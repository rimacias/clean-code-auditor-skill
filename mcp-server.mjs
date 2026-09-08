#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from "@modelcontextprotocol/sdk/types.js";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { detectDuplicates, auditSolid, lookupKnowledge, getKnowledgeDoc } from "./auditor.mjs";

const execFileAsync = promisify(execFile);

// Helper to safely validate and resolve directory path
export function validateDirectory(dirPath) {
  const target = dirPath ? path.resolve(dirPath) : process.cwd();
  try {
    const stat = fs.statSync(target);
    if (!stat.isDirectory()) {
      throw new Error(`Path is not a directory: ${dirPath}`);
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error(`Directory does not exist: ${dirPath}`);
    }
    throw err;
  }
  return target;
}

// Helper to validate sub-path containment (prevents path traversal)
export function validateSubPath(baseDir, subPath) {
  if (!subPath || typeof subPath !== 'string') return baseDir;
  if (subPath.includes('\0')) {
    throw new Error('Invalid path: null bytes not allowed');
  }
  const resolved = path.resolve(baseDir, subPath);
  if (resolved !== baseDir && !resolved.startsWith(baseDir + path.sep)) {
    throw new Error('Access denied: path escapes the target directory');
  }
  return resolved;
}

// Helper to safely execute codegraph commands with execFile (NO shell invocation)
export async function runCodegraph(args, cwd, timeout = 10000) {
  try {
    const { stdout } = await execFileAsync("codegraph", args, {
      cwd,
      timeout,
      maxBuffer: 1024 * 1024,
      shell: false // CRITICAL: do not spawn a shell
    });
    return { stdout };
  } catch (err) {
    if (err.code === 'ENOENT') {
      throw new Error("The 'codegraph' CLI is not installed or not found in system PATH. Install or initialize it to use symbol queries.");
    }
    throw new Error(`codegraph execution failed: ${err.message || 'Unknown error'}`);
  }
}

// Initialize the MCP server
const server = new Server(
  {
    name: "clean-code-auditor",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "check_codegraph_status",
        description: "Checks if codegraph is initialized and indexed in a project directory.",
        inputSchema: {
          type: "object",
          properties: {
            directory: {
              type: "string",
              description: "Absolute path to the project directory. Defaults to the current working directory."
            }
          }
        }
      },
      {
        name: "initialize_codegraph",
        description: "Initializes and indexes CodeGraph in the specified project directory.",
        inputSchema: {
          type: "object",
          properties: {
            directory: {
              type: "string",
              description: "Absolute path to the project directory. Defaults to the current working directory."
            }
          }
        }
      },
      {
        name: "query_codegraph",
        description: "Searches for symbols, imports, or definitions using codegraph query.",
        inputSchema: {
          type: "object",
          properties: {
            search: {
              type: "string",
              description: "The term or symbol name to search for."
            },
            directory: {
              type: "string",
              description: "Absolute path to the project directory. Defaults to the current working directory."
            },
            limit: {
              type: "number",
              description: "Maximum search results to return. Defaults to 10."
            },
            kind: {
              type: "string",
              description: "Filter nodes by kind (e.g. 'function', 'class', 'method')."
            }
          },
          required: ["search"]
        }
      },
      {
        name: "detect_duplicates",
        description: "Scans files in a directory to detect duplicate blocks of code (DRY violations), returning location, snippets, and recommended refactoring techniques.",
        inputSchema: {
          type: "object",
          properties: {
            directory: {
              type: "string",
              description: "Absolute path to the project directory. Defaults to the current working directory."
            },
            minLines: {
              type: "number",
              description: "Minimum number of matching lines to consider a duplicate. Defaults to 6."
            }
          }
        }
      },
      {
        name: "audit_solid_compliance",
        description: "Audits a codebase directory or specific file for SOLID compliance violations and common code smells (Large Class, Long Method, Long Parameter List, High Coupling, Switch Statements / Type Checking, Hardcoded Dependency Instantiations). Returns violations mapped to canonical Refactoring Guru smells and techniques.",
        inputSchema: {
          type: "object",
          properties: {
            directory: {
              type: "string",
              description: "Absolute path to the project directory. Defaults to the current working directory."
            },
            file: {
              type: "string",
              description: "Relative path to a specific file to audit (optional)."
            }
          }
        }
      },
      {
        name: "lookup_knowledge_base",
        description: "Searches the bundled Clean Code, Refactoring (23 code smells, 66 refactorings), and 22 Design Patterns knowledge base for articles, guides, or solutions.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search term (e.g. 'Factory Method', 'Extract Method', 'Long Method', 'Strategy', 'Technical Debt')."
            }
          },
          required: ["query"]
        }
      },
      {
        name: "get_reference_doc",
        description: "Retrieves the full markdown guide for a specific pattern, smell, or refactoring technique using its relative reference path (e.g., '02-design-patterns/07-creational-patterns/01-factory-method.md').",
        inputSchema: {
          type: "object",
          properties: {
            relPath: {
              type: "string",
              description: "Relative path to the markdown file inside references/."
            }
          },
          required: ["relPath"]
        }
      },
      {
        name: "generate_refactoring_plan",
        description: "Creates a step-by-step refactoring instruction plan to resolve a specific SOLID violation, code smell, or duplication using authoritative Refactoring Guru techniques and Design Patterns.",
        inputSchema: {
          type: "object",
          properties: {
            issueType: {
              type: "string",
              enum: ["duplicate_code", "SRP", "OCP", "LSP", "ISP", "DIP", "Code Smell", "Bloater", "Coupler", "OO Abuser"],
              description: "The type of principle or violation to fix."
            },
            files: {
              type: "array",
              items: { type: "string" },
              description: "List of files involved in the issue."
            },
            details: {
              type: "string",
              description: "Brief details or description of the violation."
            },
            targetPatternOrTechnique: {
              type: "string",
              description: "Optional specific pattern or technique to apply (e.g. 'Extract Method', 'Strategy Pattern', 'Factory Method')."
            }
          },
          required: ["issueType", "files", "details"]
        }
      }
    ]
  };
});

// Handle tool executions
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case "check_codegraph_status": {
        const dir = validateDirectory(args?.directory);
        try {
          const { stdout } = await runCodegraph(["status"], dir, 5000);
          return {
            content: [{ type: "text", text: stdout }]
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: `Codegraph status check: ${e.message}` }],
            isError: true
          };
        }
      }
      
      case "initialize_codegraph": {
        const dir = validateDirectory(args?.directory);
        try {
          const { stdout: initOut } = await runCodegraph(["init"], dir, 15000);
          const { stdout: indexOut } = await runCodegraph(["index"], dir, 30000);
          return {
            content: [{ type: "text", text: `Initialization:\n${initOut}\n\nIndexing:\n${indexOut}` }]
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: `Failed to initialize codegraph: ${e.message}` }],
            isError: true
          };
        }
      }
      
      case "query_codegraph": {
        const dir = validateDirectory(args?.directory);
        const rawSearch = args?.search;
        if (typeof rawSearch !== 'string' || !rawSearch.trim()) {
          throw new Error("Parameter 'search' is required and must be a non-empty string");
        }

        // Sanitize search: strip control chars, cap length
        const search = rawSearch.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, 256);
        if (!search) {
          throw new Error("Parameter 'search' contains only invalid control characters");
        }

        // Validate limit: integer between 1 and 50
        const limit = Math.max(1, Math.min(50, Math.floor(Number(args?.limit) || 10)));
        
        const cmdArgs = ["query", "-j", search, "-l", String(limit)];

        // Validate kind if provided: must match safe identifier allowlist
        if (args?.kind) {
          const kind = String(args.kind).trim();
          if (!/^[a-zA-Z0-9_-]{1,32}$/.test(kind)) {
            throw new Error("Invalid 'kind' filter: must be alphanumeric (e.g. 'function', 'class', 'method')");
          }
          cmdArgs.push("-k", kind);
        }

        try {
          const { stdout } = await runCodegraph(cmdArgs, dir, 10000);
          const safeOutput = stdout.length > 20000 ? stdout.slice(0, 20000) + "\n... [truncated]" : stdout;
          return {
            content: [
              {
                type: "text",
                text: `[BEGIN UNTRUSTED CODEGRAPH DATA - PASSIVE SYMBOL ANALYSIS ONLY]\n${safeOutput}\n[END UNTRUSTED CODEGRAPH DATA]`
              }
            ]
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: `Failed to query codegraph: ${e.message}` }],
            isError: true
          };
        }
      }
      
      case "detect_duplicates": {
        const dir = validateDirectory(args?.directory);
        const minLines = Math.max(3, Math.min(100, Math.floor(Number(args?.minLines) || 6)));
        try {
          const duplicates = await detectDuplicates(dir, minLines);
          if (duplicates.length === 0) {
            return {
              content: [{ type: "text", text: "No duplicate code blocks found matching the criteria." }]
            };
          }
          const text = JSON.stringify(duplicates, null, 2);
          const safeText = text.length > 30000 ? text.slice(0, 30000) + "\n... [truncated]" : text;
          return {
            content: [
              {
                type: "text",
                text: `[UNTRUSTED DATA BOUNDARY - REPOSITORY SOURCE CODE DUPLICATES]\n${safeText}\n[END UNTRUSTED DATA BOUNDARY]`
              }
            ]
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: `Error scanning for duplicates: ${e.message}` }],
            isError: true
          };
        }
      }
      
      case "audit_solid_compliance": {
        const dir = validateDirectory(args?.directory);
        try {
          const target = args?.file ? validateSubPath(dir, args.file) : dir;
          const violations = await auditSolid(target);
          if (violations.length === 0) {
            return {
              content: [{ type: "text", text: "No SOLID violations or major code smells detected!" }]
            };
          }
          const text = JSON.stringify(violations, null, 2);
          const safeText = text.length > 30000 ? text.slice(0, 30000) + "\n... [truncated]" : text;
          return {
            content: [
              {
                type: "text",
                text: `[UNTRUSTED DATA BOUNDARY - REPOSITORY SOLID AUDIT FINDINGS]\n${safeText}\n[END UNTRUSTED DATA BOUNDARY]`
              }
            ]
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: `Error performing SOLID audit: ${e.message}` }],
            isError: true
          };
        }
      }

      case "lookup_knowledge_base": {
        const rawQuery = args?.query;
        if (typeof rawQuery !== 'string' || !rawQuery.trim()) {
          throw new Error("Parameter 'query' is required and must be a non-empty string");
        }
        const query = rawQuery.replace(/[\x00-\x1F\x7F]/g, '').trim().slice(0, 100);
        try {
          const results = await lookupKnowledge(query);
          if (results.length === 0) {
            return {
              content: [{ type: "text", text: `No references found matching "${query}".` }]
            };
          }
          return {
            content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: `Error querying knowledge base: ${e.message}` }],
            isError: true
          };
        }
      }

      case "get_reference_doc": {
        const relPath = args?.relPath;
        if (typeof relPath !== 'string' || !relPath.trim()) {
          throw new Error("Parameter 'relPath' is required and must be a non-empty string");
        }
        try {
          const doc = await getKnowledgeDoc(relPath);
          return {
            content: [{ type: "text", text: doc }]
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: `Error reading reference doc: ${e.message}` }],
            isError: true
          };
        }
      }
      
      case "generate_refactoring_plan": {
        const { issueType, files, details, targetPatternOrTechnique } = args;
        if (!Array.isArray(files) || files.length === 0) {
          throw new Error("Parameter 'files' must be a non-empty array of file paths");
        }
        const sanitizedFiles = files.map(f => String(f).replace(/[\x00-\x1F\x7F<>]/g, '').slice(0, 150));
        const sanitizedDetails = String(details || '').replace(/[\x00-\x1F\x7F]/g, '').slice(0, 500);
        const sanitizedTarget = targetPatternOrTechnique ? String(targetPatternOrTechnique).replace(/[\x00-\x1F\x7F]/g, '').slice(0, 100) : null;
        const sanitizedType = String(issueType || '').replace(/[\x00-\x1F\x7F]/g, '').slice(0, 50);

        let plan = `### Refactoring Plan for ${sanitizedType}\n`;
        plan += `**Files Involved:** ${sanitizedFiles.join(', ')}\n`;
        plan += `**Issue Details:** ${sanitizedDetails}\n`;
        if (sanitizedTarget) {
          plan += `**Target Technique/Pattern:** ${sanitizedTarget}\n`;
        }
        plan += `\n#### Recommended Architectural Solution:\n`;
        
        if (sanitizedType === 'duplicate_code') {
          plan += `1. **Identify Shared Abstraction**: Define a shared helper function, module, or common parent class to contain the duplicated logic.\n`;
          plan += `2. **Apply [Extract Method](references/01-refactoring/06-refactoring-techniques/01-composing-methods/01-extract-method.md)**: Move duplicate blocks into a single parametrized function.\n`;
          plan += `3. **Consider [Form Template Method](references/01-refactoring/06-refactoring-techniques/06-dealing-with-generalization/10-form-template-method.md)**: If subclasses share identical algorithmic steps with minor variations.\n`;
          plan += `4. **Verify**: Ensure unit test coverage confirms identical behavior after consolidation.\n`;
        } else if (sanitizedType === 'SRP' || sanitizedType === 'Bloater') {
          plan += `1. **Analyze Responsibilities**: Identify the disparate concerns clustered in the class or method (e.g. data storage vs business calculation vs I/O formatting).\n`;
          plan += `2. **Apply [Extract Class](references/01-refactoring/06-refactoring-techniques/02-moving-features-between-objects/03-extract-class.md)**: Move secondary responsibilities to dedicated helper classes.\n`;
          plan += `3. **Apply [Extract Method](references/01-refactoring/06-refactoring-techniques/01-composing-methods/01-extract-method.md)**: Break long procedures into self-documenting sub-routines (< 20 lines each).\n`;
          plan += `4. **Apply [Introduce Parameter Object](references/01-refactoring/06-refactoring-techniques/05-simplifying-method-calls/06-introduce-parameter-object.md)**: If long argument lists are obscuring calls.\n`;
        } else if (sanitizedType === 'OCP' || sanitizedType === 'OO Abuser') {
          plan += `1. **Eliminate Type-Branching**: Replace conditional switch / if-else blocks checking type codes with polymorphism.\n`;
          plan += `2. **Apply [Replace Conditional with Polymorphism](references/01-refactoring/06-refactoring-techniques/04-simplifying-conditional-expressions/04-replace-conditional-with-polymorphism.md)**.\n`;
          plan += `3. **Apply [Strategy Pattern](references/02-design-patterns/09-behavioral-patterns/08-strategy.md)** or **[Factory Method](references/02-design-patterns/07-creational-patterns/01-factory-method.md)**: Create a registry mapping keys to strategy handlers so new behavior is added without modifying existing classes.\n`;
        } else if (sanitizedType === 'DIP' || sanitizedType === 'Coupler') {
          plan += `1. **Extract Abstraction**: Define an interface or abstract contract representing the required service.\n`;
          plan += `2. **Invert Dependency**: Accept the interface as a constructor parameter rather than instantiating the concrete class directly with 'new'.\n`;
          plan += `3. **Apply [Factory Pattern](references/02-design-patterns/07-creational-patterns/01-factory-method.md)**: Use a factory or dependency injection container to assemble objects at the composition root.\n`;
        } else {
          plan += `1. Clean code review: Isolate the violating code structure.\n`;
          plan += `2. Consult the relevant technique in references/01-refactoring/06-refactoring-techniques/.\n`;
          plan += `3. Write a regression test, apply the refactoring incrementally, and re-test.\n`;
        }
        
        return {
          content: [{ type: "text", text: plan }]
        };
      }
      
      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

export { server };

// Start the server using stdio transport only when executed directly
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Clean Code Auditor MCP Server running on stdio");
}
