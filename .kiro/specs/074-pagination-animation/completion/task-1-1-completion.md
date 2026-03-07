# Task 1.1 Completion: Fix Node-Base Web Rendering Bugs

**Date**: 2026-03-07
**Spec**: 074 — Pagination Animation
**Task**: 1.1 — Fix Node-Base web rendering bugs
**Agent**: Lina (bug #3), Ada (bugs #1 and #2)
**Type**: Implementation
**Validation Tier**: Tier 2 — Standard

---

## Summary

Fixed three pre-existing Node-Base web rendering bugs that were blocking visual validation of pagination container styling (072) and animation work (074).

---

## Bugs Resolved

### Bug #1: Missing 5th dot / Bug #2: No current state emphasis (Ada)

**Root cause**: Component tokens `node.size.*.current` used raw `value` in `progress.ts`, causing the generator to output unitless CSS values (`--progress-node-size-sm-current: 16` instead of `var(--space-200)`). CSS `width: 16` (no unit) is invalid, collapsing current nodes to zero size. CSS `var()` fallbacks didn't help because the property was defined (just with a useless value).

**Fix**: Changed all three current size token definitions from `value` to `reference`:
- `node.size.sm.current` → `reference: spacingTokens.space200` (16px)
- `node.size.md.current` → `reference: spacingTokens.space250` (20px)
- `node.size.lg.current` → `reference: spacingTokens.space300` (24px)

**Additional change**: lg tier intentionally resized — base from `space300` (24px) to `space250` (20px), current from 28px to `space300` (24px). Approved by Peter.

**Files**: `src/tokens/component/progress.ts`, `src/tokens/__tests__/ProgressTokenFormulas.test.ts`, `src/tokens/__tests__/ProgressTokenTranslation.test.ts`

### Bug #3: Invalid icon size for lg nodes (Lina)

**Root cause**: Node-Base passed `size="18"` to `<icon-base>` for lg nodes. `18` is not a valid `IconBaseSize` (valid: 13, 20, 24, 28, 32, 36, 40, 44, 48).

**Fix**: Changed to `size="20"` — the next valid icon size that fits within the lg node.

**File**: `src/components/core/Progress-Indicator-Node-Base/platforms/web/ProgressIndicatorNodeBase.web.ts`

### Cleanup: CSS fallback removal (Lina)

Removed all CSS fallback values from Node-Base size tokens (base and current). Fallbacks were stale after the lg tier resize and masked token resolution failures. Token availability is validated at build time.

**File**: `src/components/core/Progress-Indicator-Node-Base/platforms/web/ProgressIndicatorNodeBase.styles.css`

---

## Verification

- Full test suite: 291 suites, 7457 tests, all passed
- No behavioral regressions
