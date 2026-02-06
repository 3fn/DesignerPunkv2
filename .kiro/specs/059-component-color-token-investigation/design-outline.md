# Design Outline: Component Color Token Architecture Investigation

**Date**: February 6, 2026
**Spec**: 059 - Component Color Token Architecture Investigation
**Status**: Placeholder - Investigation Required
**Type**: Investigation / Architectural Decision
**Priority**: Low (no immediate blockers)

---

## Problem Statement

The current `defineComponentTokens()` API only supports numeric token values (spacing, sizing, etc.). It cannot process color tokens because:

1. Color tokens are RGBA strings, not numbers
2. The `PrimitiveTokenReference` interface requires `baseValue: number`
3. Color tokens have complex nested structures (light/dark modes, base/wcag themes)

This was discovered during Spec 046 (Input-Checkbox-Base) Task 8.2 when attempting to add Badge-Count-Notification to the token generation pipeline.

---

## Current Workaround

For Spec 046, we resolved this by creating semantic tokens:
- `color.feedback.notification.background` → pink400
- `color.feedback.notification.text` → white100

Component token files can reference these semantic tokens (like Avatar does with `color.identity.human`).

---

## Investigation Questions

Before implementing any solution, this spec should answer:

### 1. Are there legitimate use cases?

**Question**: Are there component colors that genuinely cannot be expressed as semantic tokens?

**Current evidence suggests NO**:
- Badge-Count-Notification → `color.feedback.notification.*` (semantic)
- Avatar → `color.identity.*` (semantic)
- All other components use existing semantic tokens

**Potential YES cases to investigate**:
- Component-specific brand colors?
- Theme-specific component overrides?
- One-off decorative colors?

### 2. What's the cost of NOT extending the API?

If every component color can be expressed semantically:
- No API extension needed
- Semantic tokens provide better reusability
- Simpler architecture

### 3. What would extension look like?

If extension IS needed, options include:
- Add `stringValue` support to `TokenDefinition`
- Create separate `defineComponentColorTokens()` API
- Extend `ComponentTokenRegistry` for color tokens

---

## Recommendation

**Do not implement until investigation is complete.**

The semantic token approach may be sufficient for all foreseeable use cases. This spec should remain a decision document until concrete evidence emerges that component-level color tokens are necessary.

---

## Related Specs

- Spec 037: Component Token Generation Pipeline (original `defineComponentTokens()` implementation)
- Spec 046: Input-Checkbox-Base (discovered the gap)
- Spec 051: Semantic Token Naming Restructure (concept-first naming)
- Spec 058: Component Token Architecture Cleanup (migration patterns)

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-06 | Created placeholder spec | Gap discovered in Spec 046 Task 8.2; resolved with semantic tokens |

---

**Next Steps**: Monitor for use cases where semantic tokens are insufficient. If none emerge, close this spec as "Not Needed."
