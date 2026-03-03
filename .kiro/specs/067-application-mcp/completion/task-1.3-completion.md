# Task 1.3 Completion: Adjust Schema from Pattern A Findings

**Date**: 2026-03-02
**Spec**: 067 - Application MCP
**Task Type**: Architecture (Tier 3)
**Status**: Complete

---

## What Was Done

Applied 2 schema changes surfaced by the Pattern A interview. Updated design.md, requirements.md, README, and verified alignment with AssemblyNode.

### Changes Applied

1. **Added `children?: PatternComponent[]`** — recursive nesting support. Container-Base wrapping form fields requires the pattern to express parent-child relationships within a step's component list.

2. **Renamed `required` to `optional`** (default `false`) — Peter's convention: everything is required by default, only mark exceptions. Field is now optional in the schema; absence means required.

### Files Modified

| File | Change |
|------|--------|
| `design.md` | `PatternComponent` interface: removed `required: boolean`, added `optional?: boolean`, `children?: PatternComponent[]`, made `hints` optional |
| `requirements.md` | Requirement 3.3: updated field list to reflect `optional`, `children` |
| `experience-patterns/README.md` | PatternComponent table, validation rules, example updated |

### Files Not Modified (intentional)

- `design-outline.md` — historical document with review notes. Examples predate interview findings. Authoritative schema is in design.md and README.
- `simple-form.yaml` — already uses `children` nesting and has no `required`/`optional` fields (all components are required by default).

### AssemblyNode Alignment (Thurgood's flag)

Verified parallel structure:
- `AssemblyNode`: `component`, `props?`, `children?: AssemblyNode[]`
- `PatternComponent`: `component`, `role`, `optional?`, `hints?`, `children?: PatternComponent[]`

Both are recursive trees with `children`. They differ in purpose (guidance vs. configuration). An agent reads a pattern's component tree, translates hints into props, and produces an AssemblyNode tree. No transformation gymnastics needed.

### Deferred Items (not Task 1.3 scope)

- `layout` enrichment — vertical-stack sufficient for Pattern A
- Placement guidance field — deferred to Pattern C
- Role-based component flexibility — tracking across interviews
