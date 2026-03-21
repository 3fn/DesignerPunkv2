# Task 1 Summary: Coverage Drift Test

**Date**: 2026-03-20
**Spec**: 075 — MCP Coverage Enforcement
**Organization**: spec-summary
**Scope**: 075-mcp-coverage-enforcement

---

## What

Added automated coverage drift detection for the Application MCP — a test that fails when production families or components lack family guidance coverage.

## Why

Without enforcement, adding new production components could silently regress Application MCP coverage. Product agents querying `get_prop_guidance` for an uncovered family would get null with no explanation. This test locks in the 8/8 family coverage achieved in Spec 071.

## Artifacts

- `component-mcp-server/src/indexer/__tests__/CoverageDrift.test.ts` — 3 tests: family coverage, component-to-guidance coverage, reverse coverage
- `family-guidance/button.yaml` — Added `Button-VerticalList-Item` to selectionRules (real gap caught by the test)

## Impact

- 306 test suites, 7,965 tests passing
- Any future production component or family automatically enters enforcement scope via schema `readiness` field
