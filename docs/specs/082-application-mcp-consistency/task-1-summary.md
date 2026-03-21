# Task 1 Summary: Foundation — Registry & Directory Rename

**Date**: 2026-03-21
**Spec**: 082 — Application MCP Consistency & Governance
**Organization**: spec-summary
**Scope**: 082-application-mcp-consistency

---

## What

Created the canonical family registry (`family-registry.yaml`) and renamed the MCP server directory from `component-mcp-server/` to `application-mcp-server/` to establish the "Application MCP" identity.

## Why

The Application MCP ecosystem had four different names for the same server and no single source of truth for family identity. The registry provides canonical names, display names, and component prefixes for all 9 production families. The directory rename eliminates the most visible naming inconsistency before five new product agents onboard.

## Artifacts

- `family-registry.yaml` — Canonical family registry (9 families: canonical, displayName, prefix)
- `application-mcp-server/` — Renamed directory (31 files), package: `@designerpunk/application-mcp-server`
- `.kiro/settings/mcp.json` and `.kiro/agents/lina.json` — Config paths updated

## Impact

- 306 test suites, 7,965 tests passing
- Foundation in place for Task 2 (family name normalization) and Task 3 (governance enforcement)
