# Task 3.7 Completion: Update performance_virtualization Contract

**Date**: 2026-03-07
**Spec**: 074 — Pagination Animation
**Task**: 3.7 — Update `performance_virtualization` contract
**Agent**: Thurgood (audit + recommendation) → Lina (contract update)
**Type**: Implementation
**Validation Tier**: Tier 2 — Standard

---

## Summary

Replaced the `performance_virtualization` contract with `rendering_and_animation` in `contracts.yaml`, per Thurgood's audit (`findings/thurgood-contract-audit-performance-virtualization.md`). Also fixed `composition_node_only` language.

---

## Changes

### contracts.yaml

1. **`performance_virtualization` → `rendering_and_animation`**: Full rewrite.
   - Name changed — web no longer virtualizes
   - Behavior describes render-all-dots + translateX centering for web, native scroll for iOS/Android
   - Validation assertions updated: "renders all nodes with viewport clipping" replaces "renders exactly 5 nodes"
   - Added edge-clamping assertions (first dot at left edge, last dot at right edge)
   - Added first-render assertion (no animation on mount)
   - Test approach updated to match new rendering model

2. **`composition_node_only`**: Minor language fix.
   - "for each visible item" → "for each item" (behavior + validation)
   - Post-pivot, all items are rendered, not just visible ones

---

## Thurgood's Audit Findings Addressed

| Finding | Status |
|---------|--------|
| "Renders max 5 visible nodes" — wrong | Fixed: "renders all nodes with viewport clipping" |
| Window logic assertions — obsolete | Removed: replaced with centering + clamping assertions |
| Animation assertions — correct | Preserved |
| Reduced motion assertions — correct | Preserved |
| ARIA assertions — correct | Preserved |
| `composition_node_only` "visible item" — ambiguous | Fixed: "for each item" |
| Orphaned `calculateVisibleWindow` tests | Deferred to Task 3.12 per Thurgood |

---

## Verification

- YAML validates ✅
- Pagination-Base tests: all passing ✅
- Contract name, behavior, validation, and test_approach all reflect render-all-dots architecture ✅
