# Stemma Documentation Scan — Contract References

**Date**: 2026-03-13
**Spec**: 078 — Contract Governance & Enforcement
**Task**: 4.1

---

## Methodology

Scanned all 35 steering docs mentioning "Stemma" and cross-referenced against docs mentioning "contract" (case-insensitive). Identified docs that reference Stemma without any contract mention, plus docs where contract mentions exist but may not frame contracts as core Stemma.

## Docs Mentioning Stemma Without Any Contract Reference

| Doc | Stemma Mentions | Action |
|-----|-----------------|--------|
| `Rosetta-System-Architecture.md` | 1 | **Needs update** — describes Rosetta/Stemma architecture with no mention of behavioral contracts |

## Critical Docs (Task 4.2 — already identified in spec)

| Doc | Contract Mentions | Stemma Mentions | Action |
|-----|-------------------|-----------------|--------|
| `Rosetta-Stemma-Systems-Overview.md` | 11 | 16 | Review framing — ensure contracts presented as core Stemma concept |
| `Component-Primitive-vs-Semantic-Philosophy.md` | 2 | 5 | Add contracts as specification layer |

## Docs Already Aligned (No Update Needed)

| Doc | Why Aligned |
|-----|-------------|
| `rosetta-system-principles.md` | Mentions contracts in Stemma behavioral consistency row and architecture diagram |
| `00-Steering Documentation Directional Priorities.md` | Already lists Contract-System-Reference as "core Stemma artifact" |
| `Component-Readiness-Status.md` | Contracts integrated into readiness criteria at multiple tiers |
| `stemma-system-principles.md` | 40 contract mentions — deeply integrated |
| `Contract-System-Reference.md` | The contract reference doc itself |
| `Test-Behavioral-Contract-Validation.md` | Contract validation patterns doc |
| `Test-Development-Standards.md` | 94 contract mentions — deeply integrated |
| `Component-Development-Standards.md` | 49 contract mentions |
| `Component-Templates.md` | 52 contract mentions |
| `Component-Development-Guide.md` | Updated in Task 3.3 with Behavioral Contracts Workflow section |
| `Process-Spec-Planning.md` | Updated in Task 3.2 with required artifacts and traceability |
| All Component-Family-*.md docs | Contract references present in family guidance |
| Remaining docs | Contract references present and contextually appropriate |

## Summary for Task 4.3

Only one additional doc needs a contract update beyond the two critical docs in Task 4.2:

- **`Rosetta-System-Architecture.md`** — Add behavioral contracts to the Stemma architecture description

This bounds Task 4.3 to a single ballot measure.
