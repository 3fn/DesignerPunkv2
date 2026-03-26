# Task 1.2 Completion: Refactor Web Implementation

**Date**: 2026-03-26
**Task**: 1.2 Refactor web implementation
**Type**: Architecture
**Status**: Complete

---

## Artifacts Modified

- `src/components/core/Container-Card-Base/platforms/web/ContainerCardBase.web.ts` — Full rewrite to compose Container-Base internally via W1 pattern (nested custom element)

## Architecture Decisions

### Decision 1: Nested Custom Element Composition (W1)

**Options Considered**:
1. W1 — Card's Shadow DOM contains `<container-base>` as a child element
2. W2 — Import Base's style-building logic directly
3. W3 — Light DOM composition

**Decision**: W1 — nested custom element

**Rationale**: Standard Web Component composition pattern. CSS custom properties pierce shadow boundaries (tokens resolve correctly). W2 couples to Base's internal API and isn't true composition. W3 breaks encapsulation.

**Trade-offs**:
- ✅ **Gained**: True composition, automatic propagation of Base changes, compliance test satisfaction
- ❌ **Lost**: Simpler single-shadow-root DOM structure
- ⚠️ **Risk**: Nested shadow roots add DOM complexity; `::slotted()` only reaches one level

### Decision 2: Interaction Wrapper as Plain `<div>`

**Decision**: Card renders a `<div class="card-interaction-wrapper">` that wraps `<container-base>`. All interaction styles (hover, press, focus, keyboard) apply to this wrapper.

**Rationale**: Separates interaction concerns (Card) from layout concerns (Base). The wrapper is always a `<div>` — ARIA role is applied via attribute when interactive, keeping the DOM structure consistent regardless of interactive state.

### Decision 3: Semantic Element Suppression for Interactive Cards

**Decision**: Pass `semantic="div"` to Base when `interactive="true"`.

**Rationale**: When interactive, Card's wrapper carries `role="button"` or `role="link"`. If Base also renders `<section>` inside it, the accessibility tree shows a sectioning element inside a button — semantically invalid. Suppressing to `<div>` preserves the pre-refactor accessibility tree shape where Card directly rendered `<section role="button">`.

### Decision 4: Two-Track Prop Forwarding

**Decision**: Direct pass-through for shared-vocabulary props (padding, border, borderRadius, semantic, accessibilityLabel). Resolve-then-pass for shorthand props (background, shadow, borderColor) using Card's `tokens.ts` getter maps.

**Rationale**: Card's shorthand values (`'surface.primary'`) don't match Base's expected format (`'color.surface.primary'`). Ada R1 caught this — passing shorthand directly produces wrong CSS variables. Card's token maps handle the resolution.

### Decision 5: Omit Attributes for `'none'` Values

**Decision**: When Card's prop value resolves to `'none'`, omit the attribute on Base entirely rather than setting it to an empty string.

**Rationale**: Ada R1 design feedback. Base uses `getAttribute()` which returns `null` for absent attributes, and its mapping functions handle `null` correctly. Setting an empty string could produce unexpected behavior since Base casts to typed values.

## Implementation Details

**Removed**:
- `_buildStyles()` method — Base handles its own token resolution and CSS generation
- `tokenToCssVar()` helper — no longer needed
- Unused token map imports: `cardPaddingTokenMap`, `cardVerticalPaddingTokenMap`, `cardHorizontalPaddingTokenMap`, `cardBorderTokenMap`, `cardBorderRadiusTokenMap`

**Added**:
- `import '../../../Container-Base/platforms/web/ContainerBase.web'` — ensures Base is registered before Card uses it
- `_buildBaseAttributes()` method — constructs the attribute string for `<container-base>` using two-track forwarding

**Preserved unchanged**:
- All interaction logic (`_setupInteractivity`, `_removeInteractivity`, `_handleKeyDown`, `_handleClick`, `_triggerOnPress`, `onPress` getter/setter)
- `_calculateBlendColors()` — still uses Card's token maps to resolve base color for blend calculations
- `DEFAULTS` object
- `observedAttributes` list
- `attributeChangedCallback` behavior

**Render structure change**:
```
Pre-refactor:  <semantic-element class="container-card-base" ...><slot></slot></semantic-element>
Post-refactor: <div class="card-interaction-wrapper" ...><container-base ...><slot></slot></container-base></div>
```

## Validation

- ✅ Full test suite: 307 suites, 8026 tests, 0 failures
- ✅ Composition compliance test: `container-base` present in web platform file (currently skipped via KNOWN_MISMATCHES — will be unskipped in Task 3.1)
- ✅ No existing tests broken (Task 1.1 audit confirmed zero structural DOM assertions)
- ✅ Two-track prop forwarding: direct props pass through, resolve props use token maps
- ✅ `hoverable` omitted on Base (defaults to false) — Card owns all interaction
- ✅ `semantic="div"` passed to Base when interactive
- ✅ Attributes omitted when value is `'none'`

## Requirements Compliance

| Requirement | AC | Status |
|---|---|---|
| Req 1: Composition | AC 1 (web renders `<container-base>`) | ✅ Met |
| Req 1: Composition | AC 4 (two-track prop forwarding) | ✅ Met |
| Req 2: Preserved Behavior | AC 1 (identical visual output) | ⏳ Pending demo validation (Task 1.4) |
| Req 2: Preserved Behavior | AC 2 (zero-config defaults) | ✅ Met (DEFAULTS unchanged) |
| Req 2: Preserved Behavior | AC 3 (padding hierarchy) | ✅ Met (directional padding forwarded) |
| Req 3: Interaction Boundary | AC 1 (hoverable false on Base) | ✅ Met |
| Req 3: Interaction Boundary | AC 2 (Card handles all interaction) | ✅ Met |
| Req 3: Interaction Boundary | AC 3 (no interaction when not interactive) | ✅ Met |
| Req 3: Interaction Boundary | AC 4 (Base handles layout only) | ✅ Met |
| Req 4: Prop Curation | AC 1 (curated types preserved) | ✅ Met |
| Req 4: Prop Curation | AC 2 (Base full API not exposed) | ✅ Met |
| Req 4: Prop Curation | AC 3 (Card maps and forwards) | ✅ Met |

## Lessons Learned

1. **Ada's feedback cycle catches were critical.** Two implementation bugs prevented before code was written: (a) double-darkening from `hoverable: true` on Base, (b) background/shadow/borderColor resolution mismatch. Both would have been subtle runtime bugs.

2. **The `_buildStyles()` removal was clean.** Because Base handles its own token resolution, Card's entire style-building pipeline could be removed rather than adapted. The refactor was a simplification, not just a restructuring.

3. **Token map imports split naturally.** The two-track pattern meant 5 of 8 token map imports could be removed (padding, border, borderRadius maps). Only the 3 resolve-then-pass maps (background, shadow, borderColor) remain. Clean separation.

## Integration Points

- **Container-Base web component**: Card depends on Base being registered (`customElements.define('container-base', ...)`). Import ensures registration order.
- **Card's `tokens.ts`**: `cardBackgroundTokenMap`, `cardShadowTokenMap`, `cardBorderColorTokenMap` remain in active use for resolve-then-pass. Padding/border/borderRadius maps are now unused in this platform file (cleanup tracked as out-of-scope follow-up).
- **Composition compliance test**: Web check will pass once KNOWN_MISMATCHES skip is removed (Task 3.1).
