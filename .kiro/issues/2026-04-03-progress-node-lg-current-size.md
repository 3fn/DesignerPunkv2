# Progress-Node lg Current-Size Inconsistency

**Date**: 2026-04-03
**Severity**: Low
**Agent**: Ada
**Found by**: Lina (Spec 092 design review)

## Problem

Progress-Node emphasis sizes follow a +4px pattern for sm and md, but not lg:

| Size | Base | Current (emphasized) | Delta |
|------|------|---------------------|-------|
| sm | 12 | 16 | +4 ✅ |
| md | 16 | 20 | +4 ✅ |
| lg | 24 | 24 | +0 ❌ |

Expected lg current: 28 (+4 pattern). Actual: 24 (same as base).

## Location

`src/tokens/component/progress.ts` — lg current-size references `space300` (24), same as lg base.

## Impact

Low — Progress-Node lg current-size shows no visual emphasis difference from base. The component still works, but the emphasis effect is absent at lg size.

## Note

Discovered during Spec 092 (Sizing Token Family) design review. Not fixed in 092 — zero-visual-change constraint preserves the existing value. This is a separate fix.
