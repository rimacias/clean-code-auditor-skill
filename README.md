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
Copy the `SKILL.md` file into your agent's skills directory.
