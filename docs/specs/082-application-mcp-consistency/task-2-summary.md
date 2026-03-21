# Task 2 Summary: Family Name Normalization

**Date**: 2026-03-21
**Spec**: 082 — Application MCP Consistency & Governance
**Organization**: spec-summary
**Scope**: 082-application-mcp-consistency

---

## What

Normalized all component family names to canonical singular PascalCase across 30 schemas and 8 guidance YAMLs. Added `displayName` field to the guidance system for human-facing contexts. Simplified CoverageDrift test to use direct family name lookups.

## Why

Schema and guidance family names were inconsistent — `"Buttons"` vs `Button`, `"Form Inputs"` vs `FormInputs`, `"Progress Indicators"` vs `Progress-Indicator`. This caused `getGuidance("Button")` to return null, forcing the CoverageDrift test to use an indirect workaround. Now `getGuidance()` works with canonical names directly.

## Artifacts

- 21 schema.yaml files normalized (9 already correct)
- 8 guidance YAMLs normalized with `displayName` added
- `FamilyGuidance` and `PropGuidanceResponse` interfaces — `displayName` field added
- `FamilyGuidanceIndexer` parser — reads `displayName` with fallback
- `CoverageDrift.test.ts` — indirect workaround replaced with direct lookup
- 3 Progress component tests — regex assertions updated

## Impact

- 306 test suites, 7,965 tests passing
- `getGuidance("Button")`, `getGuidance("FormInput")`, etc. now resolve directly
- Foundation in place for Task 3 (governance enforcement) and Task 4 (documentation sweep)
