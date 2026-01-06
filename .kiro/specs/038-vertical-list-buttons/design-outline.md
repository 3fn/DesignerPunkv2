# Design Outline: Vertical List Buttons

**Date**: January 6, 2026
**Spec**: 038 - Vertical List Buttons
**Status**: Design Outline (Pre-Requirements)
**Author**: Peter Michaels Allen

---

## Component Overview

Vertical List Buttons are a component family for presenting actionable choices in a stacked vertical layout. They're commonly used for settings screens, selection flows, onboarding choices, and multi-step forms.

**Key Characteristic**: Always used in sets of two or more, displayed vertically.

---

## Interaction Models

### 1. Tap Mode
Traditional tap-and-go behavior. User taps a button, action fires immediately.

**Use Cases**: Navigation menus, settings options, action lists

**Visual Characteristics**:
- No border outline
- No selection indicator

### 2. Select Mode  
Single-selection behavior. User taps to select one button (showing selected state), then waits for a separate confirmation action. Only one item can be selected at a time.

**Use Cases**: Single-choice questions, preference selection, radio-button-style choices

**Visual Characteristics**:
- Border outline (`borderDefault`) in Not Selected state
- No border in Selected state
- Checkmark indicator on far right when selected

### 3. Multi-Select Mode
Multiple-selection behavior. User can select one or more buttons (showing "checked" state), then waits for a separate confirmation action.

**Use Cases**: Multi-choice questions, filter selection, checkbox-style choices

**Visual Characteristics**:
- No border outline
- Checkmark indicator on far right when selected
- Items toggle between Rest and Selected states

---

## Anatomy

```
┌─────────────────────────────────────────────────────────┐
│  [Icon]  Label Text                          [✓]        │
│          Description text (optional)                    │
└─────────────────────────────────────────────────────────┘
```

### Elements

| Element | Required | Position | Notes |
|---------|----------|----------|-------|
| Label | Yes | Left (after icon if present) | Primary button text |
| Description | No | Below label | Secondary explanatory text |
| Leading Icon | No | Far left, inline with label | Optional visual indicator |
| Selection Indicator | Conditional | Far right | Checkmark for Select/Multi-Select modes when selected |

---

## Spacing

### Button List Spacing
| Relationship | Token | Value | Notes |
|--------------|-------|-------|-------|
| Gap between buttons | `space.grouped.normal` | 8px | Vertical stack spacing |

### Internal Button Spacing
| Relationship | Token | Value | Notes |
|--------------|-------|-------|-------|
| Top/Bottom padding | Component token → `space075` | 6px | Vertical inset |
| Left/Right padding | `space.inset.200` | 16px | Horizontal inset |
| Icon to Label | `space.grouped.loose` | 12px | Leading icon spacing |
| Label to Checkmark | `space.grouped.loose` | 12px | Selection indicator spacing |

---

## Typography

| Element | Token | Notes |
|---------|-------|-------|
| Label | `typography.buttonMd` | Primary text styling |
| Description | `typography.bodySm` | Secondary text styling |

### Text Colors
| Element | Default/Tap | Select (Not Selected) | Select (Selected) / Multi-Select (Checked) |
|---------|-------------|----------------------|-------------------------------------------|
| Label | `color.text.primary` | `color.select.notSelected` | `color.select.selected` |
| Description | `color.text.secondary` | `color.text.secondary` | `color.text.secondary` |

---

## Sizing

| Property | Token | Value | Notes |
|----------|-------|-------|-------|
| Min Height | `accessibility.tapAreaRecommended` | 48px | Comfortable touch target |
| Width | N/A | 100% | Always fills container width |
| Border Radius | `radiusNormal` | 8px | All three interaction types |

---

## Visual States by Interaction Model

### Tap Mode States

| State | Background | Border | Text Color |
|-------|------------|--------|------------|
| Rest | `color.background` | None | `color.text.primary` |
| Hover | + `opacity.hover` overlay | None | `color.text.primary` |
| Pressed | + `opacity.pressed` overlay | None | `color.text.primary` |

### Select Mode States

| State | Background | Border | Text Color | Checkmark |
|-------|------------|--------|------------|-----------|
| Not Selected | `color.select.notSelected.background` | None | `color.select.notSelected` | Hidden |
| Selected | `color.select.selected.background` | `borderEmphasis` (animated) | `color.select.selected` | Visible |
| Hover | + `opacity.hover` overlay | (per selection state) | (per selection state) | (per selection state) |
| Pressed | + `opacity.pressed` overlay | (per selection state) | (per selection state) | (per selection state) |

#### Select Mode Animation Behavior

When selection changes between items, a staggered animation sequence creates a smooth "handoff" effect:

**Animation Sequence:**
1. **T=0**: Previously selected item begins border fade-out animation
2. **T=50%**: Newly selected item begins border fade-in animation (delayed by 50% of animation duration)
3. **T=100%**: Previously selected item completes fade-out
4. **T=150%**: Newly selected item completes fade-in

**Animation Specs:**
- Uses same animation specs as Button-Icon Secondary hover state
- Border animates from none → `borderEmphasis` (fade-in) or `borderEmphasis` → none (fade-out)
- Stagger delay = 50% of single animation duration

**Rationale:**
- Guides user's eye from deselecting to selecting item
- Avoids visual chaos of simultaneous animations
- Total transition time is 1.5x single animation duration (still feels snappy)

**Future Consideration:** If this pattern proves successful, consider formalizing the stagger timing as a semantic token (e.g., `animation.stagger.selection`) for reuse in Horizontal List Buttons and other selection components.

### Multi-Select Mode States

| State | Background | Border | Text Color | Checkmark |
|-------|------------|--------|------------|-----------|
| Rest (Unchecked) | `color.background` | None | `color.text.primary` | Hidden |
| Selected (Checked) | `color.select.selected.background` | None | `color.select.selected` | Visible |
| Hover | + `opacity.hover` overlay | None | (per selection state) | (per selection state) |
| Pressed | + `opacity.pressed` overlay | None | (per selection state) | (per selection state) |

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
- Color: `color.select.selected` with `color.icon.opticalBalance` blend applied
- Visibility: Only shown when item is in Selected state (Select/Multi-Select modes)
- Implementation: Uses Icon component, not direct assets

### Checkmark Animation Behavior

**Multi-Select Mode:**
- Checkmark fades in when item is checked
- Checkmark fades out when item is unchecked
- Each item animates independently

**Select Mode (single-selection):**
- When selection changes from one item to another:
  - Checkmark on deselected item disappears **instantly** (no fade)
  - Checkmark on newly selected item fades in
- Rationale: The border animation already communicates the "handoff"; instant checkmark removal keeps focus on the new selection

---

## New Semantic Tokens Required

### Select Color Token Family

| Token | Primitive Reference | Hex Value | Purpose |
|-------|---------------------|-----------|---------|
| `color.select.selected` | `cyan400` | #00C0CC | Foreground color for selected state (text, border, icon base) |
| `color.select.selected.background` | `cyan100` | #CCFBFF | Background fill for selected state |
| `color.select.notSelected` | `gray200` | #68658A | Foreground color for not-selected state (text) |
| `color.select.notSelected.background` | `gray100` | #B8B6C8 | Background fill for not-selected state |

**Design Rationale**: The cyan palette provides a distinct "selection" semantic that's separate from primary (purple) and success (green). Cyan has a digital, interface-y feel that fits the DesignerPunk aesthetic while remaining semantically neutral about the "positivity" of the selection.

---

## Accessibility

### Touch Targets
- Min height of `tapAreaRecommended` (48px) ensures comfortable touch targets
- Full-width buttons provide large tap area

### No Disabled States
Per accessibility standards, disabled states are not supported. Unavailable options should be hidden rather than shown as disabled.

### Screen Reader Support
- Selection state changes announced
- Checkmark icons marked as decorative (state communicated via ARIA)

### Keyboard Navigation
- Tab to enter button group
- Arrow keys to navigate within group
- Enter/Space to activate (Tap) or toggle selection (Select/Multi-Select)

### Focus States
- Uses `accessibility.focus.*` tokens (same as ButtonCTA)
- `accessibility.focus.width` for outline width
- `accessibility.focus.offset` for outline offset
- `accessibility.focus.color` for outline color

---

## Platform Considerations

### Web
- Semantic `<button>` elements within list container
- `role="radiogroup"` for Select mode, `role="group"` for Multi-Select
- `:focus-visible` for keyboard focus indicators

### iOS
- Native button styling with SwiftUI
- Haptic feedback on selection changes
- VoiceOver support with selection state announcements

### Android
- Material-style ripple effects
- TalkBack support with selection state announcements
- Proper touch target sizing

---

## Layout Options Summary

### Icon Configuration
- **None**: No leading icon
- **Leading**: Icon positioned left with `space.grouped.loose` gap to label

### Description Configuration
- **None**: Label only
- **With Description**: Description text below label using `typography.bodySm`

---

## Resolved Decisions

| Question | Decision |
|----------|----------|
| Dividers | Not included (future component) |
| Min height | `tapAreaRecommended` (48px) |
| Gap between buttons | `space.grouped.normal` (8px) |
| Top/Bottom padding | Component token → `space075` (6px) |
| Left/Right padding | `space.inset.200` (16px) |
| Icon-label spacing | `space.grouped.loose` (12px) |
| Label-checkmark spacing | `space.grouped.loose` (12px) |
| Border radius | `radiusNormal` (all types) |
| Item count limit | No ceiling |
| Width behavior | Always full-width of container |
| Disabled states | Not supported (accessibility standard) |
| Select border | `borderEmphasis` on Selected (animated), none on Not Selected |
| Icon sizing | Matches `typography.buttonMd` via icon size formula |
| Icon implementation | Uses Icon component |
| Checkmark color | Base color + `color.icon.opticalBalance` blend |
| Checkmark animation (Multi-Select) | Fade in/out on check/uncheck |
| Checkmark animation (Select) | Instant disappear on deselect, fade in on select |
| Selection animation | Staggered 50% delay, reuses Button-Icon Secondary hover specs |
| Description text color | `color.text.secondary` |
| Focus states | Uses `accessibility.focus.*` tokens |

---

## Future Considerations

### Selection Animation Token
If the staggered selection animation pattern proves successful in this component, consider formalizing as semantic tokens for reuse:
- `animation.stagger.selection` — 50% delay ratio for selection handoff animations
- Could apply to: Horizontal List Buttons, Tab bars, Segmented controls, etc.

---

## Related Components

- **ButtonCTA**: Standalone action buttons
- **ButtonIcon**: Icon-only buttons
- **Icon System**: Icon rendering and color inheritance

---

## Stemma Structure

**Component Name**: `Button-VerticalList`

**Approach**: Single component with `mode` prop (Option B)

**Mode Variants**:
- `tap` — Traditional tap-and-go behavior
- `select` — Single-selection (radio-button style)
- `multiSelect` — Multiple-selection (checkbox style)

**Rationale**: The three modes share 80%+ of implementation (sizing, spacing, typography, icons, hover/press states). A single component with a `mode` prop keeps the codebase DRY and simplifies maintenance.

---

*This design outline captures finalized design decisions. Ready to proceed to formal requirements document.*
