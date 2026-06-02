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
import { detectDuplicates, auditSolid } from "./auditor.mjs";

const execAsync = promisify(exec);

// Initialize the MCP server
const server = new Server(
  {
    name: "solid-code-auditor",
    version: "1.0.0",
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
        description: "Scans files in a directory to detect duplicate blocks of code (DRY violations) and returns location/snippet details.",
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
        description: "Audits a codebase directory or specific file for SOLID compliance violations and common code smells (Large Class, Long Method, Too Many Parameters, High Coupling, Type Checking switch/cases, Hardcoded Dependency Instantiations).",
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
        name: "generate_refactoring_plan",
        description: "Creates a step-by-step refactoring instruction plan to resolve a specific SOLID or duplication violation using design pattern guidelines.",
        inputSchema: {
          type: "object",
          properties: {
            issueType: {
              type: "string",
              enum: ["duplicate_code", "SRP", "OCP", "LSP", "ISP", "DIP", "Code Smell"],
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
      
      case "generate_refactoring_plan": {
        const { issueType, files, details } = args;
        
        let plan = `### Refactoring Plan for ${issueType}\n`;
        plan += `**Files Involved:** ${files.join(', ')}\n\n`;
        plan += `**Issue Details:** ${details}\n\n`;
        
        plan += `#### Proposed Solution:\n`;
        if (issueType === 'duplicate_code') {
          plan += `1. **Identify Shared Abstraction**: Define a shared helper function, module, or common parent class to contain the duplicated logic.\n`;
          plan += `2. **Extract Method**: Move the duplicate block to the shared abstraction, using parameters for any variables that differ between occurrences.\n`;
          plan += `3. **Reference Helper**: Replace the original duplicate blocks with calls/references to the new shared helper.\n`;
          plan += `4. **Test**: Run tests to ensure identical functional behavior is maintained (DRY principle).\n`;
        } else if (issueType === 'SRP') {
          plan += `1. **Separate Responsibilities**: Break down the large class or method into distinct units, each handling one single concern.\n`;
          plan += `2. **Delegate Work**: Outsource logic to helper objects/services (e.g. Validator, Formatter, DB client) rather than doing it all inline.\n`;
          plan += `3. **Clean Interfaces**: Expose simple API endpoints or functions for the consumer.\n`;
        } else if (issueType === 'OCP') {
          plan += `1. **Extract to Polymorphic Classes/Functions**: Replace conditional checks (switch statements/type checks) with class inheritance or strategy functions.\n`;
          plan += `2. **Register Implementations**: Use a registry or factory method that maps type names to their respective strategy implementations.\n`;
          plan += `3. **Extend without Modifying**: New type handlers can now be added by creating a new class/object registering to the factory, without altering existing logic.\n`;
        } else if (issueType === 'DIP') {
          plan += `1. **Define Contract/Interface**: Specify what methods the dependency requires.\n`;
          plan += `2. **Accept dependency in Constructor**: Modify the class to accept the dependency as a parameter (Constructor Injection).\n`;
          plan += `3. **Configure Injection**: Wire up the class at the entrypoint/composition root of the application, passing in the required dependency instance.\n`;
        } else {
          plan += `1. Apply clean coding principles to isolate and decouple the violating structures.\n`;
          plan += `2. Extract helper classes or functions where methods are too long.\n`;
          plan += `3. Group parameters into structs or parameter objects to simplify signatures.\n`;
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
console.error("SOLID Code Auditor MCP Server running on stdio");
