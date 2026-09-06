#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from "@modelcontextprotocol/sdk/types.js";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import { detectDuplicates, auditSolid, lookupKnowledge, getKnowledgeDoc } from "./auditor.mjs";

const execAsync = promisify(exec);

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
        const dir = args?.directory || process.cwd();
        try {
          const { stdout } = await execAsync('codegraph status', { cwd: dir });
          return {
            content: [{ type: "text", text: stdout }]
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: `Codegraph is not initialized or failed to run status: ${e.message}\nOutput: ${e.stdout || ''}` }],
            isError: true
          };
        }
      }
      
      case "initialize_codegraph": {
        const dir = args?.directory || process.cwd();
        try {
          const { stdout: initOut } = await execAsync('codegraph init', { cwd: dir });
          const { stdout: indexOut } = await execAsync('codegraph index', { cwd: dir });
          return {
            content: [{ type: "text", text: `Initialization:\n${initOut}\n\nIndexing:\n${indexOut}` }]
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: `Failed to initialize codegraph: ${e.message}\nOutput: ${e.stdout || ''}` }],
            isError: true
          };
        }
      }
      
      case "query_codegraph": {
        const dir = args?.directory || process.cwd();
        const search = args.search;
        const kind = args.kind;
        const limit = args.limit || 10;
        
        let cmd = `codegraph query -j "${search.replace(/"/g, '\\"')}" -l ${limit}`;
        if (kind) {
          cmd += ` -k ${kind}`;
        }
        
        try {
          const { stdout } = await execAsync(cmd, { cwd: dir });
          return {
            content: [{ type: "text", text: stdout }]
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: `Failed to query codegraph: ${e.message}\nOutput: ${e.stdout || ''}` }],
            isError: true
          };
        }
      }
      
      case "detect_duplicates": {
        const dir = args?.directory || process.cwd();
        const minLines = args?.minLines || 6;
        try {
          const duplicates = await detectDuplicates(dir, minLines);
          if (duplicates.length === 0) {
            return {
              content: [{ type: "text", text: "No duplicate code blocks found matching the criteria." }]
            };
          }
          return {
            content: [{ type: "text", text: JSON.stringify(duplicates, null, 2) }]
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: `Error scanning for duplicates: ${e.message}` }],
            isError: true
          };
        }
      }
      
      case "audit_solid_compliance": {
        const dir = args?.directory || process.cwd();
        const file = args?.file;
        try {
          const target = file ? path.resolve(dir, file) : dir;
          const violations = await auditSolid(target);
          if (violations.length === 0) {
            return {
              content: [{ type: "text", text: "No SOLID violations or major code smells detected!" }]
            };
          }
          return {
            content: [{ type: "text", text: JSON.stringify(violations, null, 2) }]
          };
        } catch (e) {
          return {
            content: [{ type: "text", text: `Error performing SOLID audit: ${e.message}` }],
            isError: true
          };
        }
      }

      case "lookup_knowledge_base": {
        const query = args.query;
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
        const relPath = args.relPath;
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
        
        let plan = `### Refactoring Plan for ${issueType}\n`;
        plan += `**Files Involved:** ${files.join(', ')}\n`;
        plan += `**Issue Details:** ${details}\n`;
        if (targetPatternOrTechnique) {
          plan += `**Target Technique/Pattern:** ${targetPatternOrTechnique}\n`;
        }
        plan += `\n#### Recommended Architectural Solution:\n`;
        
        if (issueType === 'duplicate_code') {
          plan += `1. **Identify Shared Abstraction**: Define a shared helper function, module, or common parent class to contain the duplicated logic.\n`;
          plan += `2. **Apply [Extract Method](references/01-refactoring/06-refactoring-techniques/01-composing-methods/01-extract-method.md)**: Move duplicate blocks into a single parametrized function.\n`;
          plan += `3. **Consider [Form Template Method](references/01-refactoring/06-refactoring-techniques/06-dealing-with-generalization/10-form-template-method.md)**: If subclasses share identical algorithmic steps with minor variations.\n`;
          plan += `4. **Verify**: Ensure unit test coverage confirms identical behavior after consolidation.\n`;
        } else if (issueType === 'SRP' || issueType === 'Bloater') {
          plan += `1. **Analyze Responsibilities**: Identify the disparate concerns clustered in the class or method (e.g. data storage vs business calculation vs I/O formatting).\n`;
          plan += `2. **Apply [Extract Class](references/01-refactoring/06-refactoring-techniques/02-moving-features-between-objects/03-extract-class.md)**: Move secondary responsibilities to dedicated helper classes.\n`;
          plan += `3. **Apply [Extract Method](references/01-refactoring/06-refactoring-techniques/01-composing-methods/01-extract-method.md)**: Break long procedures into self-documenting sub-routines (< 20 lines each).\n`;
          plan += `4. **Apply [Introduce Parameter Object](references/01-refactoring/06-refactoring-techniques/05-simplifying-method-calls/06-introduce-parameter-object.md)**: If long argument lists are obscuring calls.\n`;
        } else if (issueType === 'OCP' || issueType === 'OO Abuser') {
          plan += `1. **Eliminate Type-Branching**: Replace conditional switch / if-else blocks checking type codes with polymorphism.\n`;
          plan += `2. **Apply [Replace Conditional with Polymorphism](references/01-refactoring/06-refactoring-techniques/04-simplifying-conditional-expressions/04-replace-conditional-with-polymorphism.md)**.\n`;
          plan += `3. **Apply [Strategy Pattern](references/02-design-patterns/09-behavioral-patterns/08-strategy.md)** or **[Factory Method](references/02-design-patterns/07-creational-patterns/01-factory-method.md)**: Create a registry mapping keys to strategy handlers so new behavior is added without modifying existing classes.\n`;
        } else if (issueType === 'DIP' || issueType === 'Coupler') {
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

// Start the server using stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Clean Code Auditor MCP Server running on stdio");
