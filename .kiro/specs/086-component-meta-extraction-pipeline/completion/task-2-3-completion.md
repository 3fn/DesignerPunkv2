# Task 2.3 Completion: Readiness Compliance Test

**Date**: 2026-03-28
**Task**: 2.3 Write readiness compliance test
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Agent**: Thurgood
**Status**: Complete

---

## Artifact Created

- `application-mcp-server/src/indexer/__tests__/ReadinessCompliance.test.ts`

## Requirements Coverage

| Requirement | AC | Status | Validation |
|-------------|-----|--------|------------|
| Req 5 AC 1 | Derived status matches filesystem for every component | ✅ | Test 1: full component × platform matrix comparison |
| Req 5 AC 2 | Runs as part of standard test suite | ✅ | Runs via `cd application-mcp-server && npm test` (same as CoverageDrift, GuidanceCompleteness) |
| Req 5 AC 3 | Fails when impl exists but status is `not-started` | ✅ | Test 2: targeted implementation-file check |
| Req 5 AC 4 | Fails when `not-applicable` marker exists but status is `not-started` | ✅ | Test 3: targeted not-applicable marker check |

## Test Design

5 tests covering the 4 ACs plus two design-doc invariants:

1. **Derived status matches filesystem** — Primary compliance test. Independently scans filesystem for baseline artifacts (schema, contracts, types) and platform artifacts (impl, tests), reads `reviewed` flag from schema.yaml, derives expected status, compares against indexer output. Diagnostic messages include component name, platform, expected vs actual, and artifact state.

2. **Implementation file → not `not-started`** — Req 5 AC 3. Catches indexer missing an implementation file.

3. **`not-applicable` marker → not `not-started`** — Req 5 AC 4. Catches indexer ignoring schema readiness flags.

4. **Baseline gate enforcement** — Design Decision 4 invariant (Stacy/Leonardo feedback). Validates no platform reaches `development` or `production-ready` when component-level baseline artifacts are incomplete.

5. **`production-ready` requires `reviewed`** — Design Decision 4 invariant. Validates the human-judgment gate is enforced.

## Validation

- ✅ ReadinessCompliance: 5 tests, 5 passed
- ✅ Application MCP full suite: 177 passed, 2 failed (pre-existing — Navigation family missing guidance)
- ✅ Root test suite: 308 suites, 8041 tests, 0 failures

## Pre-Existing Failures Noted

CoverageDrift and GuidanceCompleteness have 2 failures: Navigation family (Nav-SegmentedChoice-Base, Nav-TabBar-Base) missing family guidance doc. Unrelated to Spec 086 — this is a coverage gap that Task 3.2 (family doc audit) will surface but not fix. Flagged for Lina.

## Design Decisions

- **Independent filesystem scan**: The compliance test performs its own filesystem scan rather than calling `derivePlatformReadiness` directly. This ensures the test validates the indexer's output against ground truth, not against itself.
- **Same scan logic as indexer**: Uses the same patterns (`.web.ts`, `.ios.swift`, `.android.kt`, test patterns, `readdirSync` non-recursive) to ensure the compliance test's expectations match the indexer's documented behavior.
- **Follows existing test conventions**: Same pattern as CoverageDrift and GuidanceCompleteness — real `ComponentIndexer` instance, real components directory, property validation.
