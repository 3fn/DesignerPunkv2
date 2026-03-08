# Ada: Token Review — Render-All-Dots Architectural Pivot

**Date**: 2026-03-07
**Author**: Ada (token review)
**Context**: Spec 074, Task 3 — reviewing Lina's `architectural-pivot-render-all-dots.md`
**Status**: Review complete, decisions needed from Peter

---

## Findings Summary

### 1. Padding Split — ✅ Correct, No Action Needed

The CSS splits padding into block/inline using semantic inset tokens:

| Size | Block | Inline |
|------|-------|--------|
| sm/md | `space.inset.075` (6px) | `space.inset.100` (8px) |
| lg | `space.inset.100` (8px) | `space.inset.150` (12px) |

**Assessment**: Semantically correct. These are existing inset tokens used at their documented purpose (internal container padding). The asymmetry is justified — inline padding needs to be larger to clear the pill border-radius curves.

**Recommendation**: No component token needed. Creating `progress.pagination.padding.*` tokens would add indirection without semantic value.

**Counter-argument**: If the block < inline pattern recurs in other pill-shaped components, a semantic pair like `space.inset.pill.block` / `space.inset.pill.inline` might be warranted. Watch for the pattern, don't create speculatively.

---

### 2. Gap Tokens — ⚠️ Discrepancy With Existing Component Tokens

The CSS uses semantic `space.grouped.*` tokens for dot gaps:

| Size | CSS Token Used | CSS Value | Existing Component Token | Component Value |
|------|---------------|-----------|--------------------------|-----------------|
| sm | `space.grouped.tight` | 4px | `progress.node.gap.sm` | 6px |
| md | `space.grouped.tight` | 4px | `progress.node.gap.md` | 8px |
| lg | `space.grouped.normal` | 8px | `progress.node.gap.lg` | 12px |

The existing `progress.node.gap.*` component tokens were defined for the stepper use case (wider gaps between nodes with connectors). Pagination legitimately needs tighter gaps.

**Decision needed from Peter — two options:**

- **Option A (recommended)**: Accept the semantic tokens as-is. Document that `progress.node.gap.*` are stepper-specific and pagination uses `space.grouped.*` directly. Simpler, fewer tokens.
- **Option B**: Create pagination-specific component tokens (`progress.pagination.gap.*`) referencing the appropriate primitives. Cleaner component token hierarchy, but more tokens to maintain.

---

### 3. Hardcoded JS Constants — ⚠️ Tech Debt (Lina's Domain)

```ts
const stride = size === 'lg' ? 24 : size === 'md' ? 20 : 16;
const gap = size === 'lg' ? 8 : 4;
const padding = size === 'lg' ? 12 : 8;
```

These duplicate token values. If any token changes, the JS breaks silently.

**Token-to-JS mapping:**

| JS Constant | sm | md | lg | Corresponding Token |
|---|---|---|---|---|
| stride | 16px | 20px | 24px | `progress.node.size.{size}.current` |
| gap | 4px | 4px | 8px | `space.grouped.tight` / `space.grouped.normal` |
| padding | 8px | 8px | 12px | `space.inset.100` / `space.inset.150` |

**Recommendation**: Future fix should read computed CSS custom property values at render time instead of hardcoding. This is a component implementation concern (Lina's domain), but the token mapping is confirmed correct as of today.

---

### 4. Split-Timing Motion Properties — ⏳ Waiting on Peter

Node-Base CSS uses a fallback pattern for experimental split timing:

```css
background-color var(--motion-color-transition-duration, var(--motion-selection-transition-duration))
                 var(--motion-color-transition-easing, var(--motion-selection-transition-easing));
```

`--motion-color-transition-duration` and `--motion-color-transition-easing` are not defined in `tokens.css`. This causes 2 token-completeness test failures.

**Assessment**: The fallback pattern is architecturally sound — it degrades to the real token when the custom property isn't set. But the test failures will persist until Peter decides:

- **Path A**: Define proper motion tokens for split color timing (if the feel experiment confirms split timing is desirable)
- **Path B**: Remove the custom properties and use unified timing (if split timing isn't needed)

This is a design feel decision, not a token architecture one.

---

### 5. `clip-path` Magic Number — ⚠️ Minor, Needs Evaluation

```css
clip-path: inset(0 2px round var(--radius-full));
```

The `2px` is a magic number to prevent dot slivers at pill edges. Not token-governed.

**Question**: Does this need to scale with size variant? At 2px it works for sm/md/lg today, but if node sizes or padding change, this could break. Worth a quick visual check across variants to confirm it's stable, and a code comment explaining the value.

---

## Prioritized Task Recommendations for Thurgood

Ordered by dependency and risk:

### Priority 1 — Blocking: Contract Update
- Update `performance_virtualization` contract in `contracts.yaml` — web no longer virtualizes
- This blocks accurate behavioral auditing

### Priority 2 — Test Integrity: Token-Completeness Failures
- The 2 split-timing test failures are known/expected but should be formally suppressed or annotated so they don't mask real regressions
- Depends on Peter's split-timing decision (Finding #4 above)

### Priority 3 — Decision Gate: Gap Token Discrepancy
- Peter needs to decide Option A vs Option B (Finding #2)
- If Option B: Ada creates new component tokens, Lina updates CSS references, Thurgood verifies
- If Option A: Ada documents the stepper-specific scope of `progress.node.gap.*` in Token-Family-Spacing.md (ballot measure proposal to Peter)

### Priority 4 — Tech Debt Tracking: Hardcoded JS Constants
- Not blocking, but should be tracked as a follow-up task
- Risk: silent drift if tokens change
- Fix is in Lina's domain (read computed styles instead of hardcoding)

### Priority 5 — Cleanup: `calculateVisibleWindow` Deprecation
- Still in `types.ts`, still tested, but no longer used by web
- Remove after iOS/Android are updated to render-all-dots
- Low urgency, no risk while it remains

### Priority 6 — Minor: `clip-path` 2px Evaluation
- Visual check across size variants to confirm stability
- Add code comment explaining the magic number
- Low risk, low effort
