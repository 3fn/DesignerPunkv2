# Task 5 Summary: MCP Scope Split Design

**Date**: 2026-03-28
**Spec**: 086 - Component Discoverability & Metadata Infrastructure
**Task**: 5. MCP Scope Split Design

---

## What Changed

The content boundary between Application MCP and Product MCP is now defined, validated, and ready for Spec 081 to consume.

## Key Deliverables

1. **Scope boundary document** — Application MCP owns components, composition, selection guidance, readiness. Product MCP owns experience patterns, layout templates, future screen-level guidance.
2. **Readiness model validation** — 30/30 components pass compliance test. Per-platform readiness is trustworthy for Product MCP consumption.

## Governing Principles

- Content organization, not access control — all agents retain read access to both MCPs
- One-direction dependency — Product MCP depends on Application MCP, never the reverse
- Readiness must be reliable before the split ships

## Impact

- Spec 081 has a clear boundary definition to implement against
- Inline readiness in Product MCP responses is an explicit requirement for 081
- Experience pattern migration has a suggested cutover plan (dual availability → deprecation → removal)
- Decision criteria established for routing future content types
- MCP-Relationship-Model refinement documented for ballot measure when 081 ships
