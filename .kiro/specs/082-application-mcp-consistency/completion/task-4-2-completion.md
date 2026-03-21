# Task 4.2 Completion: Update Steering Docs and Agent Prompts (Soft References)

**Date**: 2026-03-21
**Task**: 4.2 — Update steering docs and agent prompts (soft references)
**Type**: Setup
**Status**: Complete

## Artifacts Modified

**Steering docs (MCP identity):**
- `Component-Meta-Data-Shapes-Governance.md` — "component MCP parser" → "Application MCP parser"

**Agent prompts (MCP identity):**
- `ada-prompt.md` — "component MCP" → "Application MCP", "Component MCP Server" → "Application MCP Server", directory path updated
- `lina-prompt.md` — "component MCP" → "Application MCP", "Component MCP Server" → "Application MCP Server", directory path updated

**README:**
- 6 references updated: "Component MCP Server" → "Application MCP Server", directory path updated

**Docs directory:**
- `docs/component-mcp-query-guide.md` — title + 2 references updated
- `docs/component-metadata-schema-reference.md` — 1 reference updated
- `docs/component-meta-authoring-guide.md` — 2 references updated

## Implementation Notes

- Product agent prompts (Leonardo, Kenya, Data, Sparky, Stacy) already used "Application MCP" — created in Spec 070 with correct naming. No changes needed.
- Steering doc references to `Component-MCP-Document-Template.md` are steering doc filename references, not MCP server identity — left unchanged (out of scope).
- `Component-Readiness-Status.md` family tables use display-style names ("Buttons", "Form Inputs") as human-readable labels — these are display names, correct as-is.
- All remaining `component-mcp-server` references are in historical completion docs and spec artifacts — unchanged per design outline.

## Validation

- ✅ Zero `component-mcp-server` or "component MCP server" in steering docs
- ✅ Zero `component-mcp-server` or "Component MCP" in agent prompts
- ✅ Zero `component-mcp-server` or "Component MCP" in README
- ✅ All docs directory guides updated
