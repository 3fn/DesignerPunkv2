# Task 1.2 Completion: Resolve non-catalog names

**Date**: 2026-03-13
**Spec**: 078 — Contract Governance & Enforcement
**Task**: 1.2 — Resolve non-catalog names
**Agent**: Lina (changes) + Peter (ballot measure approval)
**Type**: Implementation
**Validation Tier**: Tier 2 — Standard

---

## Summary

Resolved all 4 non-catalog names identified in Task 1.1. Added 4 new concepts to the Concept Catalog via approved batch ballot measure. Renamed 1 contract key in Progress-Pagination-Base. Updated catalog header counts.

## Ballot Measure

Approved by Peter. Single batch covering all 4 additions and 1 rename.

## Changes Made

### Concept Catalog Additions (Contract-System-Reference.md)

| Category | Concept | Source |
|----------|---------|--------|
| accessibility | `aria_controls` | Nav-SegmentedChoice-Base (Spec 049) |
| animation | `initial_render` | Nav-SegmentedChoice-Base (Spec 049) |
| interaction | `noop_active` | Nav-SegmentedChoice-Base (Spec 049) |
| visual | `viewport_clipping` | Progress-Pagination-Base (renamed from `rendering_and_animation`) |

Category decision for `viewport_clipping`: moved from `performance` to `visual` per Peter's direction — an agent authoring this contract would intuitively reach for `visual` because the behavior describes what the user sees (clipped subset), not a performance optimization.

### Contract Rename (Progress-Pagination-Base/contracts.yaml)

| Before | After |
|--------|-------|
| Key: `rendering_and_animation` | Key: `visual_viewport_clipping` |
| Category: `performance` | Category: `visual` |

### Header Updates (Contract-System-Reference.md)

| Field | Before | After |
|-------|--------|-------|
| Total concepts | 112 | 116 |
| Deployed files | 28 | 29 |
| Description metadata | 112 | 116 |

## Files Modified

| File | Action |
|------|--------|
| `.kiro/steering/Contract-System-Reference.md` | Added 4 concepts, updated counts |
| `src/components/core/Progress-Pagination-Base/contracts.yaml` | Renamed key + category |
| `.kiro/specs/078.../findings/contract-catalog-audit.md` | Updated to reflect visual category |
| `.kiro/specs/078.../completion/task-1-1-completion.md` | Updated rename reference |

## Requirements Addressed

| Requirement | How |
|-------------|-----|
| 6.2 — Resolve non-catalog names | 3 new concepts added, 1 renamed |
| 6.3 — Update catalog | Catalog updated with 4 new concepts, header counts updated |
| 9.3 — Catalog ownership | Catalog header reflects current state (116 concepts, 29 files) |

## Validation

- Build: clean (1.55 MB raw, ~298.07 KB gzipped)
- Tests: 300 suites, 7629 tests, 1 pre-existing failure (mcp-queryability, unrelated)
- No regressions from contract rename
