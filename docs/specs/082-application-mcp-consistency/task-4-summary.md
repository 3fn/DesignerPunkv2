# Task 4 Summary: Documentation Sweep

**Date**: 2026-03-21
**Spec**: 082 - Application MCP Consistency & Governance

## What Was Done

Updated all active documentation to use consistent naming: "Application MCP" (not "Component MCP"), `application-mcp-server/` (not `component-mcp-server/`), and canonical PascalCase family names in schema examples.

## Why It Matters

Documentation is teaching material. Steering docs with `family: FormInputs` in examples would teach agents the wrong convention. Agent prompts referencing "Component MCP Server" would contradict the MCP Relationship Model. This sweep ensures every active document reinforces the canonical conventions.

## Key Changes

- 5 steering docs — schema examples normalized (`FormInputs` → `FormInput`)
- 2 agent prompts (Ada, Lina) — MCP identity + directory path updated
- 1 steering doc — "component MCP parser" → "Application MCP parser"
- README — 6 MCP identity references updated
- 3 docs guides — MCP identity + directory references updated

## Impact

- All active documentation now uses consistent naming
- Historical docs (completion docs, release notes) preserved as records of state at time of writing
- 306 suites, 7,965 tests passing
