# Ada: Node-Base Current Size Tokens — Missing Units

**Date**: 2026-03-07
**Spec**: 074 — Pagination Animation (Task 1.1 prerequisite)
**Flagged by**: Lina
**Domain**: Token source definitions (`progress.ts`)

---

## Problem

The three `node.size.*.current` component tokens output unitless values in the web CSS, causing Node-Base to render current-state nodes at zero size.

### Generated output (`dist/ComponentTokens.web.css`):

```css
--progress-node-size-sm-current: 16;    /* ❌ unitless — CSS width: 16 is invalid */
--progress-node-size-md-current: 20;    /* ❌ unitless */
--progress-node-size-lg-current: 28;    /* ❌ unitless */
```

### Expected:

```css
--progress-node-size-sm-current: var(--space-200);   /* ✅ resolves to 16px */
--progress-node-size-md-current: var(--space-250);   /* ✅ resolves to 20px */
--progress-node-size-lg-current: var(--space-350);   /* ✅ resolves to 28px */
```

## Root Cause

In `src/tokens/component/progress.ts`, the base size tokens use `reference` (which the generator correctly outputs as `var(--space-*)`), but the current size tokens use raw `value` (which the generator outputs as bare numbers):

```typescript
// ✅ Base sizes — use reference → generates var(--space-*)
'node.size.sm': { reference: spacingTokens.space150 },

// ❌ Current sizes — use value → generates bare number
'node.size.sm.current': { value: SPACING_BASE_VALUE * 2 },  // outputs: 16
```

## Why CSS Fallbacks Don't Help

The Node-Base CSS uses `var(--progress-node-size-sm-current, 16px)`. The fallback `16px` never triggers because the custom property IS defined (with value `16`). CSS `var()` fallbacks only apply when the property is completely undefined.

## Fix

Change the three current size token definitions from `value` to `reference`:

| Token | Current | Fix |
|-------|---------|-----|
| `node.size.sm.current` | `value: SPACING_BASE_VALUE * 2` (=16) | `reference: spacingTokens.space200` (=16px) |
| `node.size.md.current` | `value: SPACING_BASE_VALUE * 2.5` (=20) | `reference: spacingTokens.space250` (=20px) |
| `node.size.lg.current` | `value: SPACING_BASE_VALUE * 3.5` (=28) | `reference: spacingTokens.space350` (=28px) |

File: `src/tokens/component/progress.ts`, lines ~69–79.

## Impact

- Fixes Node-Base current state rendering (size emphasis + visibility)
- Fixes the "missing 5th dot" in pagination demos (the current dot was zero-sized)
- Unblocks 074 visual validation

## Test Note

The existing test `ProgressTokenTranslation.test.ts` asserts `--progress-node-size-sm-current:\s*16` — this will need updating to match `var(--space-200)` after the fix.
