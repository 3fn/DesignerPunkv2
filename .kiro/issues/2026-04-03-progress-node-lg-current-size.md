# Progress-Node lg Current-Size Missing +4px Emphasis

**Date**: 2026-04-03
**Severity**: Low — visual inconsistency, not broken behavior
**Agent**: Lina
**Found by**: Lina (Spec 092 design review)

## Problem

Progress-Node's current-size (emphasized) tokens follow a +4px pattern for sm and md, but not for lg:

| Size | Base | Current | Delta |
|------|------|---------|-------|
| sm | 12px (`space150`) | 16px (`space200`) | +4px ✅ |
| md | 16px (`space200`) | 20px (`space250`) | +4px ✅ |
| lg | 24px (`space300`) | 24px (`space300`) | +0px ❌ |

The lg current-size should be 28px (+4px over base 24px), but it references `space300` (24px) — the same as the base. The active/current node at lg size has no visual emphasis over inactive nodes.

## Source

`src/tokens/component/progress.ts`:
```
'node.size.lg.current': {
  reference: spacingTokens.space300,
  reasoning: 'Current node emphasis for lg (24px). +4px over base 20px...',
}
```

The reasoning text says "+4px over base 20px" but the base lg is 24px, not 20px. The reasoning appears to be copied from md and not updated.

## Impact

- lg Progress-Node current state has no size emphasis — relies solely on color differentiation
- sm and md correctly show size emphasis (+4px larger when active)
- WCAG non-color differentiation is partially compromised at lg size

## Fix

Change lg current-size to 28px. After Spec 092, this would be `size350` (base × 3.5 = 28) — but that token doesn't exist in the proposed scale. Options:
1. Add `size350` to the sizing scale (28px)
2. Use a component token with a computed value (`SIZING_BASE × 3.5 = 28`)
3. Accept 24px as intentional for lg (no emphasis at large size)

Ada's input needed on whether to extend the scale or use a computed component token.
