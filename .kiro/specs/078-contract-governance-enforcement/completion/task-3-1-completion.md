# Task 3.1 Completion: Add contracts.yaml step to Lina's scaffolding workflow

**Date**: 2026-03-13
**Spec**: 078 — Contract Governance & Enforcement
**Task**: 3.1 — Add contracts.yaml step to Lina's scaffolding workflow
**Agent**: Peter (prompt authoring)
**Type**: Implementation
**Validation Tier**: Tier 1 — Minimal

---

## Summary

Added Step 3 (Author contracts.yaml) to Lina's scaffolding workflow in `.kiro/agents/lina-prompt.md`. Existing Steps 3-6 renumbered to 4-7. Step covers MCP query for Concept Catalog, `{category}_{concept}` naming, ballot measure for new concepts, and "before platform implementation" gate.

## Changes

| File | Action |
|------|--------|
| `.kiro/agents/lina-prompt.md` | Added Step 3, renumbered Steps 3-6 → 4-7 |

## Requirements Addressed

| Requirement | How |
|-------------|-----|
| 1.1 — Scaffolding includes contracts step | Step 3 added between types.ts and platform implementation |
| 1.2 — MCP query instruction | Step includes `get_section` query for Concept Catalog |
| 1.3 — Naming convention | Step references `{category}_{concept}` naming from catalog |
| 1.4 — Before platform implementation gate | Step 3 item 4 explicitly states contracts must be authored before platform work |
