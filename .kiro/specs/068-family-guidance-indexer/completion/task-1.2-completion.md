# Task 1.2 Completion: Schema Convention Ballot Measure

**Date**: 2026-03-04
**Spec**: 068 - Family Guidance Indexer
**Task**: 1.2 Schema convention ballot measure
**Agent**: Thurgood (presented), Peter (approved)

---

## What Was Done

Presented the Family Guidance YAML schema convention as a formal ballot measure. Covered schema definition (all fields with types and optionality), `family-guidance/` directory convention, read-both protocol, and D9 compliance convention.

## Outcome

Approved by Peter without modifications.

## Key Convention Points Approved

- Companion YAML files in `family-guidance/` at project root
- Bidirectional cross-references between YAML and family docs
- Mandatory read-both protocol before modifying either file
- D9 compliance: rationale text uses token names, not raw values
- `patterns` field is optional (family-scoped only, cross-family stays in experience patterns)
- File naming: lowercase family name (e.g., `button.yaml`)
