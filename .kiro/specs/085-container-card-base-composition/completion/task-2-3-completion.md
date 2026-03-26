# Task 2.3 Completion: Leonardo Cross-Platform Review (Native)

**Date**: 2026-03-26
**Task**: 2.3 Leonardo cross-platform review (native)
**Type**: Implementation
**Agent**: Leonardo
**Status**: Complete

---

## Review Scope

Reviewed Task 2.0 (Base token mapping extensions), Task 2.1 (iOS), and Task 2.2 (Android) completion docs, plus the full source of both native platform implementations.

## Verdict

**Both native implementations are consistent with the web pattern and with each other. The composition pattern generalizes cleanly across all three platforms.**

## Cross-Platform Consistency Check

| Concern | Web | iOS | Android | Consistent? |
|---------|-----|-----|---------|-------------|
| Composes Base internally | `<container-base>` in shadow DOM | `ContainerBase(...)` in body | `ContainerBase()` in Box | ✅ |
| Two-track forwarding (direct) | Attribute strings | Enum-to-enum mapping functions | Enum-to-enum mapping functions | ✅ |
| Two-track forwarding (resolve) | Token map lookups → attribute strings | Switch → string literals | When → string literals | ✅ |
| `hoverable: false` on Base | Attribute omitted | `hoverable: false` explicit | `hoverable = false` explicit | ✅ |
| `'none'` → omit on Base | Attribute not set | `nil` passed | `null` passed | ✅ |
| Interaction wrapper always present | `<div class="card-interaction-wrapper">` | Modifiers on outer view | `Box(interactionModifier)` | ✅ |
| Interaction on wrapper, not Base | CSS classes on wrapper div | `.onHover`/`.simultaneousGesture` on outer | `hoverable`/`clickable` on Box modifier | ✅ |
| Blend calculation | `getComputedStyle` → `hoverColor`/`pressedColor` | `mapCardBackgroundToColor().hoverBlend()` | `mapCardBackgroundToColor().hoverBlend()` | ✅ |
| Focus indicator | CSS `:focus-visible` on wrapper | `focusIndicatorOverlay` with `@FocusState` | `drawBehind` with `onFocusChanged` | ✅ (platform-native) |

## Observations

### Interaction overlay mechanism

My Task 1.5 review flagged a question about whether the interaction wrapper adds a background overlay or modifies Base's background. Now I can confirm:

- **Web**: CSS custom properties (`--_card-hover-bg`, `--_card-pressed-bg`) on the wrapper div. The wrapper's `:hover`/`:active` pseudo-classes apply the blend color as the wrapper's own background. Base's background renders underneath.
- **iOS**: `.background(interactionOverlayColor)` on the outer view. This is an overlay on top of Base.
- **Android**: `.background(interactionOverlayColor)` on the Box. Same overlay approach.

All three use the same visual strategy: the interaction color overlays Base's background. This is consistent. One subtlety: on web, the wrapper's background color replaces (not overlays) when hover/press is active, because CSS `background-color` is opaque. On native, `.background()` is also opaque. So the blend utilities must produce the final blended color, not a semi-transparent overlay — which they do (`hoverBlend()` and `pressedBlend()` return fully resolved colors). Consistent.

### Semantic suppression (web-only)

iOS and Android correctly don't deal with semantic element suppression — the `semantic` prop is web-only per the schema. No inconsistency.

### Task 2.0 (Base token mapping extensions)

This was an unplanned prerequisite task — Base's native token mappings didn't handle the full-token-name strings that Card's resolve-then-pass track produces. Good catch by Lina to identify and resolve this before the platform refactors. The iOS placeholder color values (noted for Ada review) are a known pattern in the codebase.

### Retained helper functions

Both platforms retain the pre-refactor helper functions (`mapCardPaddingToCGFloat`, `mapCardPaddingToDp`, `calculateCardDirectionalPadding`, `calculateCardPadding`, etc.) with "retained for tests and previews" notes. These are now unused in the main rendering path but still serve tests. Consistent with the web approach where padding/border/borderRadius token maps were removed from imports but the maps themselves remain in `tokens.ts`. The cleanup follow-up applies to all three platforms equally.

### Android `CardRole.Link` maps to `Role.Button`

In the Android implementation, `CardRole.Link` maps to `Role.Button` in the semantics block. This is because Compose doesn't have a `Role.Link` equivalent. iOS uses `.isLink` accessibility trait. Web uses `role="link"`. This is a known platform limitation, not a consistency issue — Android's TalkBack handles link semantics differently. Worth documenting if not already captured.

## Requirements Compliance

| Requirement | AC | Status |
|---|---|---|
| Req 1: Composition | AC 2 (iOS renders through ContainerBase) | ✅ Met |
| Req 1: Composition | AC 3 (Android renders through ContainerBase) | ✅ Met |
| Req 1: Composition | AC 4 (two-track prop forwarding) | ✅ Met on both platforms |
| Req 2: Preserved Behavior | AC 1 (identical output) | ✅ Met (test suite passes) |
| Req 3: Interaction Boundary | AC 1 (hoverable false on Base) | ✅ Met on both platforms |
| Req 3: Interaction Boundary | AC 2 (Card handles all interaction) | ✅ Met on both platforms |
| Req 3: Interaction Boundary | AC 4 (Base handles layout only) | ✅ Met on both platforms |

## Validation (Tier 2: Standard)

- ✅ iOS implementation reviewed for pattern consistency with web
- ✅ Android implementation reviewed for pattern consistency with web
- ✅ Two-track prop forwarding verified on both platforms
- ✅ Interaction wrapper pattern verified across all 3 platforms
- ✅ Blend color mechanism verified as consistent (overlay, not modification)
- ✅ Full test suite: 308 suites, 8041 tests, 0 failures (per Task 2.1/2.2)
