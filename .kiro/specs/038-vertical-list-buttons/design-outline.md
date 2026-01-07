# Design Outline: Vertical List Button Item

**Date**: January 6, 2026
**Spec**: 038 - Vertical List Button Item
**Status**: Design Outline (Pre-Requirements) - REVISION 6
**Author**: Peter Michaels Allen
**Last Updated**: January 6, 2026

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 6.0 | 2026-01-06 | Error state only for Select/Multi-Select; Added border width animation (1px→2px) with padding compensation; Added motion.selectionTransition token; Explicit background color animation |
| 5.0 | 2026-01-06 | Broke down visual states by mode type; Fixed radius token to semantic `radiusNormal`; Added `.strong` suffix to Select foreground tokens for consistency |
| 4.0 | 2026-01-06 | Added error visual state; Updated padding to platform-specific component tokens; Added logical properties for web; Renamed Select tokens from `.background` to `.subtle` |
| 3.0 | 2026-01-06 | Refocused on individual button component; Pattern-level concerns moved to XXX-vertical-list-buttons-pattern |
| 2.0 | 2026-01-06 | Added three-state Select mode (Rest, Selected, Not Selected); Added border stability section; Clarified token architecture |
| 1.0 | 2026-01-06 | Initial design outline |

---

## Component Overview

The Vertical List Button Item is an individual button component designed for use within vertical list contexts. It renders visual states based on props received from a parent container/pattern.

**Key Characteristic**: This component is "dumb" — it renders based on props and emits events. Selection logic, mode behavior, and state coordination are owned by the parent pattern (see XXX-vertical-list-buttons-pattern).

**Relationship to Pattern**: This component is consumed by the Vertical List Buttons Pattern, which manages selection modes, state transitions, and accessibility semantics at the container level.

---

## Visual States by Mode

The component receives a `visualState` prop that determines its appearance. Available states depend on the mode set by the parent pattern.

### Tap Mode States

| Visual State | Background | Border Width | Border Color | Label Color | Icon Color | Checkmark |
|--------------|------------|--------------|--------------|-------------|------------|-----------|
| `rest` | `color.background` | `borderDefault` (1px) | `transparent` | `color.text.default` | `color.text.default` + optical balance | Hidden |

**Note**: Tap mode does not support error state (nothing to validate).

### Select Mode States

| Visual State | Background | Border Width | Border Color | Label Color | Icon Color | Checkmark |
|--------------|------------|--------------|--------------|-------------|------------|-----------|
| `rest` | `color.background` | `borderDefault` (1px) | `color.border` | `color.text.default` | `color.text.default` + optical balance | Hidden |
| `selected` | `color.select.selected.subtle` | `borderEmphasis` (2px) | `color.select.selected.strong` | `color.select.selected.strong` | `color.select.selected.strong` + optical balance | Visible |
| `notSelected` | `color.select.notSelected.subtle` | `borderDefault` (1px) | `transparent` | `color.select.notSelected.strong` | `color.select.notSelected.strong` + optical balance | Hidden |

### Multi-Select Mode States

| Visual State | Background | Border Width | Border Color | Label Color | Icon Color | Checkmark |
|--------------|------------|--------------|--------------|-------------|------------|-----------|
| `unchecked` | `color.background` | `borderDefault` (1px) | `transparent` | `color.text.default` | `color.text.default` + optical balance | Hidden |
| `checked` | `color.select.selected.subtle` | `borderDefault` (1px) | `transparent` | `color.select.selected.strong` | `color.select.selected.strong` + optical balance | Visible |

### Error State (Select and Multi-Select Only)

Error can be applied on top of Select or Multi-Select visual states. The error treatment differs by mode to maintain consistency with each mode's visual language.

**Select Mode + Error:**
Select mode uses visible borders, so error state includes border and background changes.

| Visual State | Background | Border Width | Border Color | Label Color | Icon Color | Checkmark |
|--------------|------------|--------------|--------------|-------------|------------|-----------|
| Any Select state + `error` | `color.error.subtle` | `borderEmphasis` (2px) | `color.error.strong` | `color.error.strong` | `color.error.strong` + optical balance | Per base state |

**Multi-Select Mode + Error:**
Multi-Select mode uses transparent borders, so error state only changes text/icon colors (no border or background change).

| Visual State | Background | Border Width | Border Color | Label Color | Icon Color | Checkmark |
|--------------|------------|--------------|--------------|-------------|------------|-----------|
| `unchecked` + `error` | `color.background` | `borderDefault` (1px) | `transparent` | `color.error.strong` | `color.error.strong` + optical balance | Hidden |
| `checked` + `error` | `color.select.selected.subtle` | `borderDefault` (1px) | `transparent` | `color.error.strong` | `color.error.strong` + optical balance | Visible |

**Note**: Error state is NOT available for Tap mode (nothing to validate).

### Interactive States (Overlays)

These apply on top of any visual state:

| State | Treatment |
|-------|-----------|
| Hover | + `blend.hoverDarker` overlay |
| Pressed | + `blend.pressedDarker` overlay |
| Focus | `accessibility.focus.*` tokens (outline) |

---

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│  [Icon]  Label Text                          [✓]            │
│          Description text (optional)                        │
└─────────────────────────────────────────────────────────────┘
```

### Elements

| Element | Required | Position | Notes |
|---------|----------|----------|-------|
| Label | Yes | Left (after icon if present) | Primary button text |
| Description | No | Below label | Secondary explanatory text |
| Leading Icon | No | Far left, inline with label | Optional visual indicator |
| Selection Indicator | Conditional | Far right | Checkmark when `selected` or `checked` |

---

## Spacing and Border Width Coordination

### The Challenge

Border width changes from `borderDefault` (1px) to `borderEmphasis` (2px) when transitioning to selected state. Without compensation, this would cause a 2px total height change (1px per side).

### The Solution: Padding Compensation

When border width increases, padding decreases by the same amount to maintain constant total height. This follows the same pattern used in Button-CTA secondary's hover state.

### Platform-Specific Padding Values

**At Rest (1px border):**

| Platform | Border | Padding (each) | Content | Total |
|----------|--------|----------------|---------|-------|
| Web | 1px × 2 = 2px | 11px × 2 = 22px | 24px | 48px |
| iOS | 1px × 2 = 2px | 11px × 2 = 22px | 24px | 48px |
| Android | 1px × 2 = 2px | 11px × 2 = 22px | 24px | 48px |

**When Selected (2px border):**

| Platform | Border | Padding (each) | Content | Total |
|----------|--------|----------------|---------|-------|
| Web | 2px × 2 = 4px | 10px × 2 = 20px | 24px | 48px |
| iOS | 2px × 2 = 4px | 10px × 2 = 20px | 24px | 48px |
| Android | 2px × 2 = 4px | 10px × 2 = 20px | 24px | 48px |

**Content height**: `typography.buttonMd` = fontSize100 (16px) × lineHeight100 (1.5) = 24px

### Component Tokens for Padding

```typescript
// Button-VerticalListItem/tokens.ts
export const verticalListItemTokens = defineComponentTokens({
  component: 'Button-VerticalListItem',
  family: 'spacing',
  tokens: {
    'paddingBlock.rest': {
      reference: 'space137',  // 11px (if exists) or define as component token
      reasoning: 'Block padding at rest state (1px border). 11px padding + 1px border = 12px per side, achieving 48px total with 24px content.'
    },
    'paddingBlock.selected': {
      reference: 'space125',  // 10px
      reasoning: 'Block padding when selected (2px border). 10px padding + 2px border = 12px per side, maintaining 48px total with 24px content.'
    }
  }
});
```

**Note**: If `space137` (11px) doesn't exist as a primitive, we may need to create it as a strategic flexibility token, or use a component-specific value.

### Internal Button Spacing (Non-Animated)

| Relationship | Token | Value | Notes |
|--------------|-------|-------|-------|
| Inline padding (left/right) | `space.inset.200` | 16px | Horizontal inset (constant) |
| Icon to Label | `space.grouped.loose` | 12px | Leading icon spacing |
| Label to Checkmark | `space.grouped.loose` | 12px | Selection indicator spacing |

### Logical Properties (Web)

Web implementation MUST use CSS logical properties for RTL support:
- `padding-block-start` / `padding-block-end` instead of `padding-top` / `padding-bottom`
- `padding-inline-start` / `padding-inline-end` instead of `padding-left` / `padding-right`

---

## Typography

| Element | Token | CSS Variable | Notes |
|---------|-------|--------------|-------|
| Label | `typography.buttonMd` | `--typography-button-md-*` | Primary text styling |
| Description | `typography.bodySm` | `--typography-body-sm-*` | Secondary text styling |

### Description Text Color

Description text always uses `color.text.muted` regardless of visual state.

---

## Sizing

| Property | Token | Value | Notes |
|----------|-------|-------|-------|
| Min Height | `accessibility.tapAreaRecommended` | 48px | Comfortable touch target (constant) |
| Width | N/A | 100% | Always fills container width |
| Border Radius | `radiusNormal` | 8px | Semantic token (references `radius100`) |

---

## Animation

The component animates transitions between visual states using the `motion.selectionTransition` token.

### Animated Properties

All of the following properties animate together when visual state changes:

| Property | Animation |
|----------|-----------|
| Background color | Smooth transition between state colors |
| Border color | Smooth transition (transparent ↔ visible) |
| Border width | Smooth transition (1px ↔ 2px) |
| Padding | Compensates for border width change (11px ↔ 10px) |
| Text color | Smooth transition between state colors |
| Icon color | Smooth transition between state colors |

### Motion Token

**`motion.selectionTransition`** (NEW TOKEN REQUIRED)
- Duration: `duration250` (250ms)
- Easing: `easingStandard`
- Context: Selection state transitions for selectable elements
- Description: Deliberate motion for selection state changes with balanced easing. Used when items transition between rest, selected, and not-selected states.

### Checkmark Animation

- Fades in when becoming visible (uses `motion.selectionTransition`)
- Fades out when becoming hidden, OR instant hide (controlled by `checkmarkTransition` prop)
- Instant hide used in Select mode when selection changes to another item (border animation communicates the handoff)

### Props for Animation Control

```typescript
interface AnimationProps {
  // Allows parent to control checkmark transition behavior
  checkmarkTransition?: 'fade' | 'instant';
  
  // Allows parent to delay this item's transition for staggered effects
  transitionDelay?: number; // milliseconds
}
```

---

## Icon Treatment

### Leading Icon (Optional)
- Position: Far left, vertically centered to button height
- Size: Matches `typography.buttonMd` using icon size formula (`fontSize × lineHeight`)
- Color: Inherits from label text color with `color.icon.opticalBalance` blend applied
- Implementation: Uses Icon component, not direct assets

### Selection Indicator (Checkmark)
- Position: Far right, vertically centered to button height
- Size: Matches `typography.buttonMd` using icon size formula (`fontSize × lineHeight`)
- Color: `color.select.selected.strong` with `color.icon.opticalBalance` blend applied (or `color.error.strong` in error state)
- Visibility: Only shown when `visualState` is `selected` or `checked`
- Implementation: Uses Icon component, not direct assets

---

## Semantic Tokens Used

### Select Color Token Family

| Token | CSS Variable | Purpose |
|-------|--------------|---------|
| `color.select.selected.strong` | `--color-select-selected-strong` | Foreground color for selected state (text, border, icon base) |
| `color.select.selected.subtle` | `--color-select-selected-subtle` | Background fill for selected state |
| `color.select.notSelected.strong` | `--color-select-not-selected-strong` | Foreground color for not-selected state (text, icon base) |
| `color.select.notSelected.subtle` | `--color-select-not-selected-subtle` | Background fill for not-selected state |

### Error Color Tokens

| Token | CSS Variable | Purpose |
|-------|--------------|---------|
| `color.error.strong` | `--color-error-strong` | Foreground color for error state (text, border, icon) |
| `color.error.subtle` | `--color-error-subtle` | Background fill for error state |

### Border Width Tokens

| Token | CSS Variable | Value | Purpose |
|-------|--------------|-------|---------|
| `borderDefault` | `--border-default` | 1px | Rest state border width |
| `borderEmphasis` | `--border-emphasis` | 2px | Selected/error state border width |

### Motion Token (NEW)

| Token | Duration | Easing | Purpose |
|-------|----------|--------|---------|
| `motion.selectionTransition` | 250ms | standard | Selection state changes |

**Token Naming Pattern**: All semantic color families use consistent suffixes:
- `.strong` = foreground (text, border, icon)
- `.subtle` = background

---

## Accessibility

### Touch Targets
- Min height of `tapAreaRecommended` (48px) ensures comfortable touch targets
- Full-width buttons provide large tap area

### No Disabled States
Per accessibility standards, disabled states are not supported. Unavailable options should be hidden rather than shown as disabled.

### Focus States
- Uses `accessibility.focus.*` tokens (same as ButtonCTA)
- `accessibility.focus.width` for outline width
- `accessibility.focus.offset` for outline offset
- `accessibility.focus.color` for outline color

### ARIA (Component Level)
- Component renders as `<button>` element
- ARIA role and checked state are set by parent pattern based on mode
- Checkmark icon marked as decorative (`aria-hidden="true"`)

---

## Platform Considerations

### Web
- Semantic `<button>` element
- `:focus-visible` for keyboard focus indicators
- CSS custom properties for theming
- Logical properties for RTL support
- CSS transitions for animation

### iOS
- Native button styling with SwiftUI
- Uses `strokeBorder` for border rendering (inside view bounds)
- Haptic feedback delegated to parent pattern
- VoiceOver: label and state announced
- SwiftUI animation for state transitions

### Android
- Material-style ripple effects
- Border modifier draws inside composable bounds
- TalkBack: label and state announced
- Proper touch target sizing
- Compose animation for state transitions

---

## Props/API Surface

```typescript
interface VerticalListButtonItemProps {
  // Content
  label: string;
  description?: string;
  leadingIcon?: IconName;
  
  // Visual state (controlled by parent)
  // Tap mode: 'rest'
  // Select mode: 'rest' | 'selected' | 'notSelected'
  // Multi-Select mode: 'unchecked' | 'checked'
  visualState: 'rest' | 'selected' | 'notSelected' | 'checked' | 'unchecked';
  
  // Error state (Select and Multi-Select modes only)
  error?: boolean;
  
  // Interactive states
  disabled?: never; // Explicitly not supported
  
  // Animation control (for parent coordination)
  checkmarkTransition?: 'fade' | 'instant';
  transitionDelay?: number;
  
  // Events
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}
```

---

## Resolved Decisions

| Question | Decision |
|----------|----------|
| Min height | `accessibility.tapAreaRecommended` (48px) |
| Block padding (rest) | 11px (with 1px border) |
| Block padding (selected) | 10px (with 2px border) |
| Inline padding | `space.inset.200` (16px) |
| Icon-label spacing | `space.grouped.loose` (12px) |
| Label-checkmark spacing | `space.grouped.loose` (12px) |
| Border radius | `radiusNormal` (semantic token, 8px) |
| Border width (rest) | `borderDefault` (1px) |
| Border width (selected) | `borderEmphasis` (2px) |
| Width behavior | Always full-width of container |
| Disabled states | Not supported (accessibility standard) |
| Height stability | Padding compensation when border width changes |
| Icon sizing | Matches `typography.buttonMd` via icon size formula |
| Icon implementation | Uses Icon component |
| Checkmark color | Base color + `color.icon.opticalBalance` blend |
| Description text color | `color.text.muted` |
| Focus states | Uses `accessibility.focus.*` tokens |
| Token architecture | Semantic tokens consumed directly; component tokens via Rosetta pipeline |
| Select token naming | `.strong` (foreground) + `.subtle` (background) for consistency |
| Error state | Only for Select/Multi-Select modes |
| Error visual (Select) | `color.error.strong` (foreground), `color.error.subtle` (background), `borderEmphasis` border |
| Error visual (Multi-Select) | `color.error.strong` (text/icon only), no border or background change |
| Logical properties | Required for web (RTL support) |
| Animation token | `motion.selectionTransition` (250ms, standard easing) |
| Animated properties | Background, border color, border width, padding, text color, icon color |

---

## New Tokens Required

### Motion Token

```typescript
'motion.selectionTransition': {
  name: 'motion.selectionTransition',
  primitiveReferences: {
    duration: 'duration250',
    easing: 'easingStandard'
  },
  category: SemanticCategory.INTERACTION,
  context: 'Selection state transitions for selectable elements',
  description: 'Deliberate motion for selection state changes with balanced easing (250ms, standard curve). Used when items transition between rest, selected, and not-selected states in selection components like vertical list buttons, radio groups, and checkboxes.'
}
```

### Spacing Token (If Needed)

If `space137` (11px) doesn't exist, consider adding as strategic flexibility token:
- `space137` = 11px (space100 × 1.375)
- Purpose: Padding compensation for 1px→2px border transitions

---

## Token Architecture Notes

**Implementation Guidance**: This component should consume tokens directly from the Rosetta-generated CSS. Do not create intermediary CSS custom properties (pseudo-tokens) in the component.

**Correct Pattern**:
```css
/* Use semantic tokens directly */
background-color: var(--color-background);
padding-block: var(--vertical-list-item-padding-block-rest);
padding-inline: var(--space-inset-200);
border-radius: var(--radius-normal);
border-width: var(--border-default);
transition: all var(--motion-selection-transition-duration) var(--motion-selection-transition-easing);
```

**Component Tokens**: Platform-specific values and state-dependent values (like `paddingBlock.rest` vs `paddingBlock.selected`) are defined in the component's `tokens.ts` file using `defineComponentTokens()`. The Rosetta pipeline generates platform-specific output.

---

## Related Specs

- **XXX-vertical-list-buttons-pattern**: The container pattern that consumes this component
- **ButtonCTA (005)**: Standalone action buttons — shares focus state patterns and padding compensation approach
- **ButtonIcon (035)**: Icon-only buttons — shares animation specs
- **Icon System (004)**: Icon rendering and color inheritance

---

## Stemma Structure

**Component Name**: `Button-VerticalListItem`

**Rationale**: This is a single component that renders different visual states based on props. The parent pattern determines which state to pass based on mode and selection logic.

---

*This design outline captures component-level decisions. Ready to proceed to formal requirements document.*
