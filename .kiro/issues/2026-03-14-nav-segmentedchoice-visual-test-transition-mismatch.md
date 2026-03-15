# NavSegmentedChoice Visual Test — Transition Pattern Mismatch

**Date**: 2026-03-14
**Status**: Resolved
**Agents**: Lina (primary), Peter (review)
**Priority**: Low — pre-existing, not blocking

## Issue

`NavSegmentedChoiceBase.visual.test.ts` line 183 expected:
```
/box-shadow.*500ms/
```

Actual transition string uses CSS custom property references, not resolved ms values:
```
box-shadow var(--duration-150) var(--easing-decelerate) calc(var(--duration-150) + var(--duration-350))
```

## Resolution

Updated the test assertion to match token variable references instead of resolved ms values:
```
/box-shadow.*var\(--duration-150\).*calc\(/
```

This is consistent with how all other animation tests in the file assert — they check for `var(--duration-` and `var(--easing-`, not hardcoded values. The test verifies the component uses tokens for its animation choreography, which is the correct contract to test.
