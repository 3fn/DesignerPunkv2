# Task 3 Summary: Process & Prompt Updates

**Spec**: 078 — Contract Governance & Enforcement
**Date**: 2026-03-13

## What Changed

Embedded behavioral contracts into three layers of the component development workflow:

1. **Lina's scaffolding prompt** — new Step 3 (Author contracts.yaml) between types.ts and platform implementation, with MCP query instruction and naming convention
2. **Process-Spec-Planning** — two new Key Principles: required artifacts for component specs (contracts.yaml must precede platform work) and contract traceability (`_Contracts:` lines on implementation subtasks)
3. **Component Development Guide** — new "Behavioral Contracts Workflow" section covering when to author, naming convention, Concept Catalog consultation, and relationship to platform implementation

## Impact

- Agents scaffolding components will be prompted to author contracts before implementation
- Spec planners will include contracts in task templates
- The CDG now references contracts as core Stemma workflow
