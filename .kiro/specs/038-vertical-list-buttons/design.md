# Design Document: Vertical List Buttons

**Date**: January 6, 2026
**Spec**: 038 - Vertical List Buttons
**Status**: Design Phase
**Dependencies**: Icon Component, Icon Size Tokens, Accessibility Tokens

---

## Overview

Vertical List Buttons (`Button-VerticalList`) is a component family for presenting actionable choices in a stacked vertical layout. The component supports three interaction modes through a single `mode` prop:

- **Tap**: Traditional tap-and-go behavior
- **Select**: Single-selection (radio-button style)
- **Multi-Select**: Multiple-selection (checkbox style)

The component follows True Native Architecture with build-time platform separation, using semantic tokens for all styling and integrating with the Icon component for icon rendering.

---

## Architecture

### Component Structure

The component uses a single-component architecture with a `mode` prop rather than three separate components. This approach keeps the codebase DRY since the three modes share 80%+ of their implementation.

```
src/components/core/ButtonVerticalList/
├── README.md                           # Component documentation
├── types.ts                            # Shared TypeScript interfaces
├── __tests__/                          # Cross-platform tests
├── examples/                           # Usage examples
└── platforms/                          # Platform-specific implementations
    ├── web/
    │   ├── ButtonVerticalList.web.ts   # Web implementation
    │   └── ButtonVerticalList.web.css  # Web component styles
    ├── ios/
    │   └── ButtonVerticalList.ios.swift # iOS implementation (SwiftUI)
    └── android/
        └── ButtonVerticalList.android.kt # Android implementation (Compose)
```

### Stemma Registration

```typescript
// Stemma component registration
{
  name: 'Button-VerticalList',
  category: 'buttons',
  description: 'Vertical list of actionable buttons with tap, select, or multi-select modes',
  status: 'stable',
  variants: {
    mode: ['tap', 'select', 'multiSelect']
  }
}
```

---

## Components and Interfaces

### Type Definitions

```typescript
// types.ts - Platform-agnostic interfaces

export type VerticalListButtonMode = 'tap' | 'select' | 'multiSelect';

export interface VerticalListButtonItem {
  /** Unique identifier for the button */
  id: string;
  
  /** Button label text */
  label: string;
  
  /** Optional description text below label */
  description?: string;
  
  /** Optional leading icon */
  icon?: IconName;
  
  /** Action handler for tap mode */
  onTap?: () => void;
}

export interface VerticalListButtonGroupProps {
  /** Interaction mode */
  mode: VerticalListButtonMode;
  
  /** Array of button items */
  items: VerticalListButtonItem[];
  
  /** Currently selected item ID(s) - for select/multiSelect modes */
  selectedIds?: string[];
  
  /** Selection change handler - for select/multiSelect modes */
  onSelectionChange?: (selectedIds: string[]) => void;
  
  /** Optional test ID */
  testID?: string;
}
```

### State Management

```typescript
// Internal state management per mode

// Tap mode: No selection state, just action triggers
// Select mode: Single selectedId, enforced by component
// Multi-Select mode: Array of selectedIds, toggled independently

interface InternalState {
  focusedIndex: number;
  // Selection state managed via props (controlled component)
}
```

---

## Data Models

### Token Mapping

| Property | Token | Value |
|----------|-------|-------|
| Min Height | `accessibility.tapAreaRecommended` | 48px |
| Border Radius | `radiusNormal` | 8px |
| Vertical Padding | `verticalListButton.padding.vertical` → `space075` | 6px |
| Horizontal Padding | `space.inset.200` | 16px |
| Button Gap | `space.grouped.normal` | 8px |
| Icon-Label Gap | `space.grouped.loose` | 12px |
| Label-Checkmark Gap | `space.grouped.loose` | 12px |

### Color Token Mapping by Mode and State

#### Tap Mode
| State | Background | Text | Border |
|-------|------------|------|--------|
| Rest | `color.background` | `color.text.primary` | None |
| Hover | + `opacity.hover` | `color.text.primary` | None |
| Pressed | + `opacity.pressed` | `color.text.primary` | None |

#### Select Mode
| State | Background | Text | Border | Checkmark |
|-------|------------|------|--------|-----------|
| Not Selected | `color.select.notSelected.background` | `color.select.notSelected` | None | Hidden |
| Selected | `color.select.selected.background` | `color.select.selected` | `borderEmphasis` | Visible |

#### Multi-Select Mode
| State | Background | Text | Border | Checkmark |
|-------|------------|------|--------|-----------|
| Unchecked | `color.background` | `color.text.primary` | None | Hidden |
| Checked | `color.select.selected.background` | `color.select.selected` | None | Visible |

### Description Text
- Always uses `color.text.secondary` regardless of selection state
- Uses `typography.bodySm` for styling

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Mode Behavior Correctness

*For any* Vertical List Button group:
- In Tap mode, tapping any button SHALL trigger that button's action callback
- In Select mode, at most one button SHALL be selected at any time
- In Multi-Select mode, any combination of buttons (including none or all) SHALL be selectable

**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

### Property 2: Selection State Transitions

*For any* Vertical List Button group in Select mode with a selected button:
- Tapping a different button SHALL result in exactly one button being selected (the newly tapped one)
- The previously selected button SHALL transition to not-selected state

*For any* Vertical List Button group in Multi-Select mode:
- Tapping a button SHALL toggle only that button's state
- Other buttons' states SHALL remain unchanged

**Validates: Requirements 1.3, 1.5**

### Property 3: Token Application Correctness

*For any* Vertical List Button in any mode and state:
- The rendered background color SHALL match the token specified for that mode/state combination
- The rendered text color SHALL match the token specified for that mode/state combination
- The rendered border (if any) SHALL match the token specified for that mode/state combination
- The checkmark visibility SHALL match the specification for that mode/state combination

**Validates: Requirements 5.1, 5.2, 5.5, 6.1-6.8, 8.1-8.8**

### Property 4: Spacing Token Application

*For any* Vertical List Button:
- Vertical padding SHALL equal `space075` (6px)
- Horizontal padding SHALL equal `space.inset.200` (16px)
- Gap between buttons SHALL equal `space.grouped.normal` (8px)
- Icon-label gap (when icon present) SHALL equal `space.grouped.loose` (12px)
- Label-checkmark gap (when checkmark visible) SHALL equal `space.grouped.loose` (12px)

**Validates: Requirements 3.4, 3.5, 3.6, 4.1, 4.2**

### Property 5: Sizing Constraints

*For any* Vertical List Button:
- Rendered height SHALL be >= `accessibility.tapAreaRecommended` (48px)
- Rendered width SHALL equal 100% of container width
- Border radius SHALL equal `radiusNormal`

**Validates: Requirements 3.1, 3.2, 3.3, 15.1, 15.2**

### Property 6: Keyboard Navigation Correctness

*For any* Vertical List Button group with n buttons:
- Arrow Down from button i SHALL focus button (i+1) mod n
- Arrow Up from button i SHALL focus button (i-1+n) mod n
- Enter/Space on focused button in Tap mode SHALL trigger action
- Enter/Space on focused button in Select/Multi-Select mode SHALL toggle selection

**Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7**

### Property 7: Accessibility Attribute Correctness

*For any* Vertical List Button group on web:
- Select mode container SHALL have `role="radiogroup"`
- Multi-Select mode container SHALL have `role="group"`
- All buttons SHALL use semantic `<button>` elements
- Selection state SHALL be announced via `aria-checked` or `aria-selected`
- Icons SHALL have `aria-hidden="true"`

**Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5**

### Property 8: Color Contrast Compliance

*For any* Vertical List Button in any state:
- Label text to background contrast ratio SHALL be >= 4.5:1
- Description text to background contrast ratio SHALL be >= 4.5:1
- Focus outline to adjacent color contrast ratio SHALL be >= 3:1

**Validates: Requirements 16.1, 16.2, 16.3**

### Property 9: Icon Rendering Correctness

*For any* Vertical List Button with a leading icon:
- Icon SHALL be rendered via Icon component
- Icon size SHALL match `typography.buttonMd` via icon size formula
- Icon color SHALL have `color.icon.opticalBalance` blend applied

*For any* Vertical List Button with visible checkmark:
- Checkmark SHALL be rendered via Icon component
- Checkmark size SHALL match `typography.buttonMd` via icon size formula
- Checkmark color SHALL be `color.select.selected` with `color.icon.opticalBalance` blend applied

**Validates: Requirements 2.3, 2.4, 2.5, 6.9, 6.10, 8.9**

### Property 10: Description Text Consistency

*For any* Vertical List Button with description:
- Description color SHALL be `color.text.secondary`
- Description color SHALL remain `color.text.secondary` regardless of selection state
- Description SHALL be positioned below label

**Validates: Requirements 10.1, 10.2, 10.3**

---

## Error Handling

### Invalid Props

| Error Condition | Handling |
|-----------------|----------|
| Empty items array | Render nothing, log warning |
| Duplicate item IDs | Log warning, use first occurrence |
| Invalid mode value | Default to 'tap', log warning |
| selectedIds with tap mode | Ignore selectedIds, log warning |
| Missing onSelectionChange with select/multiSelect | Log warning (uncontrolled behavior) |

### Runtime Errors

| Error Condition | Handling |
|-----------------|----------|
| Icon not found | Render without icon, log warning |
| Token resolution failure | Use fallback values, log error |

---

## Testing Strategy

### Unit Tests

Unit tests verify specific examples and edge cases:

1. **Mode Behavior**
   - Tap mode triggers action on tap
   - Select mode enforces single selection
   - Multi-Select mode allows multiple selections

2. **Visual States**
   - Correct tokens applied for each mode/state combination
   - Border visibility matches specification
   - Checkmark visibility matches specification

3. **Edge Cases**
   - Empty items array
   - Single item
   - Very long labels (text wrapping)
   - Missing optional props

### Property-Based Tests

Property tests verify universal properties across generated inputs:

1. **Selection Invariants** (Property 1, 2)
   - Generate random button groups and interaction sequences
   - Verify selection constraints are maintained

2. **Token Application** (Property 3, 4)
   - Generate buttons with random mode/state combinations
   - Verify correct tokens are applied

3. **Keyboard Navigation** (Property 6)
   - Generate random button groups
   - Verify arrow key navigation wraps correctly

4. **Accessibility** (Property 7, 8)
   - Generate buttons in all modes
   - Verify ARIA attributes and contrast ratios

### Integration Tests

1. **Animation Behavior** (Requirements 7.x, 9.x)
   - Visual regression tests for animation sequences
   - Timing verification for staggered animations

2. **Platform-Specific Behavior**
   - iOS haptic feedback
   - Android ripple effect
   - Web cursor styles

---

## Design Decisions

### Decision 1: Single Component with Mode Prop

**Context**: Three interaction models (Tap, Select, Multi-Select) could be implemented as separate components or a single component with a mode prop.

**Decision**: Single component with `mode` prop.

**Rationale**: The three modes share 80%+ of implementation (sizing, spacing, typography, icons, hover/press states). A single component keeps the codebase DRY and simplifies maintenance.

**Alternatives Considered**:
- Three separate components: More code duplication, harder to maintain
- Container + Item pattern: Added complexity without significant benefit

### Decision 2: Staggered Selection Animation

**Context**: When selection changes in Select mode, both the deselected and newly selected buttons need visual updates.

**Decision**: Stagger the animations with 50% delay—deselected button starts animating out at T=0, newly selected button starts animating in at T=50%.

**Rationale**: Creates a smooth "handoff" effect that guides the user's eye from the deselecting item to the selecting item. Avoids visual chaos of simultaneous animations while keeping total transition time snappy (1.5x single animation duration).

### Decision 3: Instant Checkmark Removal in Select Mode

**Context**: When selection changes in Select mode, the checkmark on the deselected button could fade out or disappear instantly.

**Decision**: Checkmark disappears instantly (no fade) on the deselected button; checkmark fades in on the newly selected button.

**Rationale**: The border animation already communicates the "handoff." Having the checkmark also animate out would be redundant and slow things down. Instant removal keeps focus on the new selection.

### Decision 4: Controlled Component Pattern

**Context**: Selection state could be managed internally (uncontrolled) or via props (controlled).

**Decision**: Controlled component pattern—selection state passed via `selectedIds` prop, changes reported via `onSelectionChange` callback.

**Rationale**: Gives parent components full control over selection state, enabling integration with form libraries, state management, and complex UI flows.

---

## New Semantic Tokens

### Select Color Token Family

| Token | Primitive Reference | Hex Value | Purpose |
|-------|---------------------|-----------|---------|
| `color.select.selected` | `cyan400` | #00C0CC | Foreground color for selected state (text, border, checkmark base) |
| `color.select.selected.background` | `cyan100` | #CCFBFF | Background fill for selected state |
| `color.select.notSelected` | `gray200` | #68658A | Foreground color for not-selected state (text) |
| `color.select.notSelected.background` | `gray100` | #B8B6C8 | Background fill for not-selected state |

### Component Token

| Token | References | Purpose |
|-------|------------|---------|
| `verticalListButton.padding.vertical` | `space075` | Top and bottom internal padding |

---

## Animation Specifications

### Select Mode Border Animation

Uses same animation specs as Button-Icon Secondary hover state:
- Duration: [Reference Button-Icon spec]
- Easing: [Reference Button-Icon spec]
- Property: border opacity/visibility

**Stagger Sequence**:
1. T=0: Deselected button border fade-out begins
2. T=50%: Newly selected button border fade-in begins
3. T=100%: Deselected button fade-out completes
4. T=150%: Newly selected button fade-in completes

### Checkmark Animation

**Select Mode**:
- Deselected: Instant removal (no animation)
- Newly selected: Fade in

**Multi-Select Mode**:
- Check: Fade in
- Uncheck: Fade out

---

## Platform Implementation Notes

### Web
- Custom element: `<button-vertical-list>`
- Shadow DOM for style encapsulation
- CSS custom properties for token consumption
- `role="radiogroup"` for Select mode, `role="group"` for Multi-Select
- `:focus-visible` for keyboard focus styling
- `cursor: pointer` on hover

### iOS (SwiftUI)
- `VStack` for button layout
- `ForEach` for button rendering
- `@State` for focus management
- Haptic feedback via `UIImpactFeedbackGenerator`
- VoiceOver support via accessibility modifiers

### Android (Jetpack Compose)
- `Column` for button layout
- `LazyColumn` for large lists (optional optimization)
- Material ripple effect via `Modifier.clickable`
- TalkBack support via semantics modifiers

---

*This design document provides comprehensive architectural guidance for implementing the Vertical List Buttons component family.*
