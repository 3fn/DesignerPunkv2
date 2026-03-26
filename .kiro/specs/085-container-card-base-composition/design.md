# Design Document: Container-Card-Base Composition Refactor

**Date**: 2026-03-26
**Spec**: 085 - Container-Card-Base Composition Refactor
**Status**: Design Phase
**Dependencies**: None

---

## Overview

Refactor Container-Card-Base on all three platforms to render through Container-Base internally. External behavior is unchanged. The composition pattern established here becomes the template for future type-primitives.

---

## Architecture

### Composition Boundary

```
┌─ Container-Card-Base ─────────────────────┐
│  Interaction Layer (Card owns)             │
│  - hover (blend.hoverDarker)               │
│  - press (blend.pressedDarker)             │
│  - focus ring                              │
│  - keyboard activation                     │
│  - onPress callback                        │
│                                            │
│  ┌─ Container-Base ──────────────────────┐ │
│  │  Layout Layer (Base owns)             │ │
│  │  - padding                            │ │
│  │  - background                         │ │
│  │  - shadow                             │ │
│  │  - border + borderColor               │ │
│  │  - borderRadius                       │ │
│  │  - semantic element                   │ │
│  │  - children (slot)                    │ │
│  └───────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

Card sets `hoverable: false` on Base. All interaction states are handled by Card's wrapper independently.

### Prop Forwarding

Two-track pattern:

| Card Prop | Base Prop | Strategy | Example |
|-----------|-----------|----------|---------|
| padding (all variants) | padding (all variants) | Direct | `'150'` → `'150'` |
| border | border | Direct | `'default'` → `'default'` |
| borderRadius | borderRadius | Direct | `'normal'` → `'normal'` |
| semantic | semantic | Direct | `'article'` → `'article'` |
| accessibilityLabel | accessibilityLabel | Direct | Pass-through |
| background | background | Resolve | `'surface.primary'` → `'color.surface.primary'` |
| shadow | shadow | Resolve | `'container'` → `'shadow.container'` |
| borderColor | borderColor | Resolve | `'border.default'` → `'color.border.default'` |

Resolution uses Card's existing `tokens.ts` getter functions (`getCardBackgroundToken()`, `getCardShadowToken()`, `getCardBorderColorToken()`).

---

## Components and Interfaces

### Web: Nested Custom Element (W1)

Card's Shadow DOM structure changes from:

```html
<!-- Pre-refactor: Card renders everything directly -->
<container-card-base>
  #shadow-root
    <style>...</style>
    <section class="card-root">  <!-- semantic element + interaction -->
      <slot></slot>
    </section>
</container-card-base>
```

To:

```html
<!-- Post-refactor: Card wraps Base -->
<container-card-base>
  #shadow-root
    <style>...</style>
    <div class="card-interaction-wrapper">  <!-- interaction layer -->
      <container-base padding="150" background="color.surface.primary" ...>
        #shadow-root
          <style>...</style>
          <section>  <!-- semantic element rendered by Base -->
            <slot></slot>
          </section>
      </container-base>
    </div>
</container-card-base>
```

Key implementation details:
- CSS custom properties pierce both shadow boundaries — tokens resolve correctly
- Card's `<slot>` moves inside Base — Card's shadow DOM contains Base, Base's shadow DOM contains the slot for consumer content
- Semantic element (`<section>`, `<article>`, `<div>`) is now rendered by Base, not Card
- Card's interaction wrapper handles hover/press/focus styles
- Events use `composed: true` for cross-shadow-boundary bubbling

**Accessibility tree concern (Leonardo R1)**: When `interactive="true"`, Card's wrapper has `role="button"` or `role="link"`. Base renders the semantic element inside it. To avoid invalid ARIA nesting (e.g., `role="button"` containing `<section>`), Card passes `semantic="div"` to Base when `interactive="true"`. When `interactive="false"`, Card passes the consumer's chosen semantic value through to Base. This is web-only — iOS/Android don't have the semantic element concept.

**Nested slot projection**: Card's shadow DOM contains `<container-base>`, which contains a `<slot>`. Base's shadow DOM also has a `<slot>`. Consumer content projects through both levels. This is valid per spec but should be verified for browser quirks during implementation.

**`::slotted()` selector reach**: If Card uses `::slotted()` to style projected children, those selectors only reach one level deep. After refactor, children project through Base's shadow boundary — `::slotted()` rules may need updating.

### iOS: Direct View Composition (I1)

```swift
// Post-refactor structure
var body: some View {
    // Card's interaction wrapper
    interactionWrapper {
        ContainerBase(
            padding: padding,
            background: resolvedBackground,  // Card resolves shorthand
            shadow: resolvedShadow,
            border: border,
            borderColor: resolvedBorderColor,
            borderRadius: borderRadius,
            hoverable: false  // Card handles interaction
        ) {
            content  // Consumer's child content
        }
    }
}
```

Interaction modifiers (`.onTapGesture`, `.onHover`, `.focusable`) go on the outer `interactionWrapper`, not on `ContainerBase`.

### Android: Direct Composable Composition (A1)

```kotlin
// Post-refactor structure
@Composable
fun ContainerCardBase(..., content: @Composable () -> Unit) {
    // Card's interaction wrapper
    InteractionWrapper(
        interactive = interactive,
        onPress = onPress,
        ...
    ) {
        ContainerBase(
            padding = padding,
            background = resolvedBackground,  // Card resolves shorthand
            shadow = resolvedShadow,
            border = border,
            borderColor = resolvedBorderColor,
            borderRadius = borderRadius,
            hoverable = false  // Card handles interaction
        ) {
            content()  // Consumer's child content
        }
    }
}
```

Interaction modifiers (`clickable`, `hoverable`, `focusable`) go on the `InteractionWrapper`, not on `ContainerBase`.

---

## Data Models

No data model changes. Card's `types.ts` and `tokens.ts` are unchanged. Base's types are unchanged.

---

## Error Handling

No new error conditions. Card's existing prop validation (type guards) continues to enforce curated values before forwarding to Base.

---

## Testing Strategy

### Existing Tests

- Run all existing Container-Card-Base tests before refactoring to establish baseline
- After refactor, run again — expect web shadow DOM hierarchy tests to break
- Failing tests are updated with documented rationale (Req 5 AC 1-2)

### New Tests

- **Runtime composition test** (Req 1 AC 6): Verify Container-Base is actually instantiated within Card's rendering on each platform
  - Web: Query Card's shadow DOM for `<container-base>` element
  - iOS/Android: Verify through test infrastructure that ContainerBase view/composable is in the render tree

- **Accessibility tree test** (Req 3 AC 5): Verify semantic element nesting doesn't violate ARIA rules when `interactive="true"`

### Demo Validation

- Build demos (`npm run build:browser`)
- Visual comparison of `container-card-demo.html` before and after
- Verify interactive cards (Section 6) still show hover/press/focus behavior
- Verify Section 9 (Container-Base vs Card-Base comparison) renders identically

---

## Design Decisions

### Decision 1: Web Composition via Nested Custom Element

**Choice**: W1 — Card's Shadow DOM contains `<container-base>` as a child element.

**Rationale**: Standard Web Component composition pattern. CSS custom properties pierce shadow boundaries (tokens work). W2 (import internals) isn't true composition and couples to Base's internal API. W3 (light DOM) breaks encapsulation.

**Trade-off**: Nested shadow roots add DOM complexity. Acceptable because this is the correct pattern for Web Component composition and the complexity is contained within Card's implementation.

### Decision 2: Card Owns All Interaction

**Choice**: Card sets `hoverable: false` on Base and handles all interaction states itself.

**Rationale**: Prevents double-darkening on hover (Ada R1 catch). Card's interaction layer is strictly richer than Base's `hoverable` — Card does hover + press + focus + keyboard. Delegating any interaction to Base would split control and make coordinated state transitions impossible.

### Decision 3: Two-Track Prop Forwarding

**Choice**: Direct pass-through for shared-vocabulary props, resolve-then-pass for shorthand props.

**Rationale**: Card's shorthand values (`'surface.primary'`) don't match Base's expected format (`'color.surface.primary'`). Passing shorthand directly would produce wrong CSS variables (Ada R1 catch). Card's `tokens.ts` getters handle the resolution for background, shadow, and borderColor.

### Decision 4: Implementation Order

**Options**: Web-first (de-risks hardest platform) vs native-first (validates pattern on simpler platforms).

**Choice**: Web-first. It's the hardest platform (nested shadow roots, slot relocation, accessibility tree verification). If W1 hits a fundamental issue, better to discover it before investing in iOS/Android. Native platforms are straightforward and will go quickly once the web pattern is validated. (Lina R1, Leonardo R1 — both agree.)

---

## Correctness Properties

1. Card's external API (props, events, behavior) is identical pre- and post-refactor
2. Container-Base is instantiated at runtime, not just referenced in source
3. Base receives `hoverable: false` — no interaction state leakage
4. Background, shadow, and borderColor values are resolved to Base's expected format before forwarding
5. Accessibility tree preserves valid ARIA nesting for both interactive and non-interactive cards
6. CSS custom properties resolve correctly through nested shadow boundaries on web
7. Consumer content (slot) renders correctly through the nested composition — no content loss or duplication from the slot relocation
8. When Card's prop value resolves to `'none'`, the attribute/prop is omitted on Base rather than set to empty string
