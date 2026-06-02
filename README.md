# SOLID Code Auditor Skill

An agent skill that audits your codebase for SOLID compliance, DRY principles, design patterns, and code smells. It integrates with `codegraph` for token-efficient analysis and can interactively audit specific directories, the entire project, or specific git commits/timeframes.

## Capabilities
- **SOLID Compliance Check:** Ensures your code adheres to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
- **DRY Philosophy:** Detects duplicated logic and suggests refactoring strategies.
- **Code Smells Detection:** Identifies long methods, large classes, and other common anti-patterns.
- **Design Pattern Recommendations:** Suggests industry-standard design patterns to improve architecture.
- **Interactive Fixes:** Offers to automatically refactor and fix identified issues.
- **Codegraph Integration:** Uses `codegraph` (if installed) to map the project efficiently, saving LLM tokens.
- **Git Integration:** Can analyze specific commits, branches, or changes since a given date.

## How to install for Gemini/Antigravity Agent
Once published to npm, anyone can install this skill into their agent's local plugins directory using this simple `npx` command:

```bash
npx solid-code-auditor-skill
```

### Installing from source
Alternatively, you can install it directly via the repository:

```bash
mkdir -p ~/.gemini/config/plugins/local-custom-skills/skills && git clone https://github.com/rimacias/solid-code-auditor-skill.git ~/.gemini/config/plugins/local-custom-skills/skills/solid-code-auditor && echo '{"name": "local-custom-skills", "version": "1.0.0"}' > ~/.gemini/config/plugins/local-custom-skills/plugin.json
```

---

## MCP Server Integration

This package also includes a Model Context Protocol (MCP) server that exposes duplicate code detection (DRY) and SOLID code auditing tools to other AI coding assistants (such as Cursor, Windsurf, Claude Desktop, etc.).

### Running the MCP Server

You can run the MCP server directly using Node:

```bash
node /Users/moncho/Documents/projects/solid-code-auditor-skill/mcp-server.mjs
```

Or, if installed globally via npm:

```bash
solid-code-auditor-mcp
```

### Configuration

#### Claude Desktop
Add this entry to your Claude Desktop configuration file (typically located at `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "solid-code-auditor": {
      "command": "node",
      "args": ["/Users/moncho/Documents/projects/solid-code-auditor-skill/mcp-server.mjs"]
    }
  }
}
```

### Available MCP Tools
- **`check_codegraph_status`**: Verify if the local `codegraph` database is active for the target codebase.
- **`initialize_codegraph`**: Run initialization and build initial symbol index with `codegraph`.
- **`query_codegraph`**: Search for specific code symbols, functions, or structures using the `codegraph query` CLI.
- **`detect_duplicates`**: Recursively parse all files in the project to search for duplicate block clones (violating DRY).
- **`audit_solid_compliance`**: Scan classes, method lines, method parameters, imports, and switch-conditions to discover violations of SOLID principles.
- **`generate_refactoring_plan`**: Produce step-by-step design instructions explaining how to restructure code to resolve a specific violation.

