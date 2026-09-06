# Clean Code Auditor Skill

An elite AI agent skill and MCP server for auditing codebases against **SOLID principles**, **DRY philosophy**, **23 code smells**, **66 refactoring techniques**, and **22 Gang of Four (GoF) design patterns**.

It bundles a complete, offline markdown knowledge base curated from [Refactoring Guru](https://refactoring.guru) (140 comprehensive reference documents) and integrates with `codegraph` for token-efficient codebase exploration.

---

## 🚀 Capabilities

- **SOLID Principles Compliance:** Enforces Single Responsibility (SRP), Open/Closed (OCP), Liskov Substitution (LSP), Interface Segregation (ISP), and Dependency Inversion (DIP).
- **DRY Duplicate Detection:** Scans source files with normalized sliding-window hashing to detect identical and near-identical clone blocks.
- **23 Code Smells Taxonomy:** Detects and diagnoses Bloaters, Object-Orientation Abusers, Change Preventers, Dispensables, and Couplers.
- **66 Refactoring Techniques:** Recommends concrete, step-by-step transformations with before/after examples (e.g. Extract Method, Replace Conditional with Polymorphism, Introduce Parameter Object).
- **22 Design Patterns Blueprints:** Maps architectural bottlenecks to Creational, Structural, and Behavioral GoF patterns (Factory Method, Strategy, Observer, Adapter, Decorator, etc.).
- **Bundled Offline Knowledge Base:** Contains 140 self-contained Markdown guides in `./references/` complete with diagrams, pseudocode, and remediation checklists.
- **Codegraph Token Efficiency:** Queries symbol maps and call hierarchies via `codegraph` to analyze large repositories using minimal LLM tokens.
- **Interactive Audits & Automated Fixes:** Supports directory-level, whole-project, or git-diff based audits, and offers pair-programming style automated refactoring.

---

### Via Open Agent Skills CLI (`skills.sh`)
Install directly into your current project or coding agent (Claude Code, Cursor, Antigravity, Copilot, etc.):

```bash
# Project-level install (installs into your current project's agent directory)
npx skills add rimacias/clean-code-auditor-skill

# Global install (makes the skill available across all projects on your machine)
npx skills add rimacias/clean-code-auditor-skill -g
```

### From Local Repository
Run the installer directly from this repository:
```bash
node ./install.js
```
This copies the skill definition (`SKILL.md`), engine (`auditor.mjs`, `mcp-server.mjs`), and complete knowledge base (`references/`) directly to:
`~/.gemini/config/plugins/local-custom-skills/skills/clean-code-auditor`

---

## 🔌 MCP Server Integration

This package includes a standalone Model Context Protocol (MCP) server that exposes audit and refactoring tools to any MCP-compatible AI environment (such as Claude Desktop, Cursor, Windsurf, or Antigravity).

### Running the MCP Server
```bash
node ./mcp-server.mjs
```

### Claude Desktop Configuration
Add the server to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "clean-code-auditor": {
      "command": "node",
      "args": ["/Users/moncho/Documents/projects/clean-code-auditor-skill/mcp-server.mjs"]
    }
  }
}
```

### Available MCP Tools

| Tool | Description |
| :--- | :--- |
| `audit_solid_compliance` | Scans files for SOLID violations, bloaters, switch-based type branching, and high coupling. |
| `detect_duplicates` | Analyzes codebase for duplicate code blocks (DRY violations) with line spans and snippets. |
| `lookup_knowledge_base` | Searches the 140 bundled Refactoring Guru guides by keyword or topic. |
| `get_reference_doc` | Fetches the full markdown guide for any specific pattern, smell, or refactoring technique. |
| `generate_refactoring_plan` | Produces an actionable, step-by-step refactoring plan citing exact techniques and patterns. |
| `check_codegraph_status` | Checks if `codegraph` symbol indexing is active in the target directory. |
| `initialize_codegraph` | Initializes and builds the `codegraph` symbol database. |
| `query_codegraph` | Runs semantic queries against `codegraph` symbols, classes, and methods. |

---

## 📚 Bundled Knowledge Base Catalog (`references/`)

- **`01-refactoring/`**
  - Core Articles (Clean Code criteria, Technical Debt payoff, When & How to refactor)
  - `05-code-smells/`
    - **Bloaters:** Long Method, Large Class, Primitive Obsession, Long Parameter List, Data Clumps
    - **OO Abusers:** Switch Statements, Temporary Field, Refused Bequest, Alternative Classes
    - **Change Preventers:** Divergent Change, Shotgun Surgery, Parallel Inheritance Hierarchies
    - **Dispensables:** Comments, Duplicate Code, Data Class, Dead Code, Lazy Class, Speculative Generality
    - **Couplers:** Feature Envy, Inappropriate Intimacy, Incomplete Library Class, Message Chains, Middle Man
  - `06-refactoring-techniques/` (66 techniques across Composing Methods, Moving Features, Organizing Data, Simplifying Conditionals, Simplifying Method Calls, and Dealing with Generalization)
- **`02-design-patterns/`**
  - Pattern Concepts, Benefits, Classification, History, and Criticism
  - `07-creational-patterns/` (Factory Method, Abstract Factory, Builder, Prototype, Singleton)
  - `08-structural-patterns/` (Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy)
  - `09-behavioral-patterns/` (Chain of Responsibility, Command, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method, Visitor)

---

## 📄 License
MIT
