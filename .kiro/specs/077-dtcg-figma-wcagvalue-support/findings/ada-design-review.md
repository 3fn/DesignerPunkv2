# Ada's Design Review — Spec 077

**Date**: 2026-03-12
**Reviewer**: Ada
**Document**: `design.md`

---

## Finding 1: `resolveAliases` Config Interaction Not Described

**Severity**: Low — obvious during implementation, but should be documented

**Issue**: The `DTCGFormatGenerator` has a `resolveAliases` config option. When true, `$value` is resolved to RGBA instead of alias syntax. The design describes `modes.wcag` using alias syntax (`{color.teal300}`) but doesn't specify behavior when `resolveAliases` is true. The edge case table mentions it in passing but the `generateSemanticColorTokens()` change description omits it.

**Recommendation**: Add a line to the `generateSemanticColorTokens()` change description: "When `resolveAliases` is true, resolve `modes.wcag` to RGBA using the same resolution path as `$value`."

---

## Finding 2: Decision 7 Staleness Window

**Severity**: Low — acceptable given single-team context

**Issue**: Deferring steering doc updates to end of spec means docs updated in 076 Task 4.2 (7 files) will describe the old pipeline behavior (no modes) for the duration of 077 implementation. Anyone reading `Rosetta-System-Architecture.md` or `Token-Semantic-Structure.md` mid-spec gets an incomplete picture.

**Recommendation**: No change needed — we're the only team. Just be aware during task planning that the final task should include steering doc updates, similar to 076 Task 4.2.

---

## Finding 3: Figma Variable Example RGBA Values Are Approximations

**Severity**: Trivial — documentation accuracy only

**Issue**: The Figma variable structure example shows `{ r: 0, g: 0.94, b: 1, a: 1 }` for cyan300 and `{ r: 0, g: 0.79, b: 0.65, a: 1 }` for teal300. These are rounded approximations, not the actual primitive RGBA values from `ColorTokens.ts`. If someone cross-references the design doc against source, the values won't match exactly.

**Recommendation**: Either note these are illustrative approximations, or update to match actual primitive values during task planning when the exact values are at hand.

---

## Finding 4: `DesignerPunkExtensions` Interface Change Is Correct

**Severity**: Positive confirmation

**Issue**: Initially questioned whether the `modes?: Record<string, string>` addition to `DesignerPunkExtensions` was necessary or if the generator builds raw objects. Verified: the interface lives in `src/generators/types/DTCGTypes.ts` and is actively used in `generateSemanticColorTokens()` (line 545) and the Figma transformer's alias reading path (line 288). The typed interface change is required.

**Action**: None — design is correct.

---

## Summary

| # | Finding | Severity | Action |
|---|---------|----------|--------|
| 1 | `resolveAliases` interaction | Low | Add line to change description |
| 2 | Steering doc staleness window | Low | Note for task planning |
| 3 | Figma RGBA approximations | Trivial | Mark as illustrative or fix later |
| 4 | Interface change confirmed | Positive | None — design is correct |

No blockers. Design is implementation-ready.
