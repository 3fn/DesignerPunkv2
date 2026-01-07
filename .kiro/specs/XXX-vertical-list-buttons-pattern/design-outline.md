# Design Outline: Vertical List Buttons Pattern

**Date**: January 6, 2026
**Spec**: XXX - Vertical List Buttons Pattern
**Status**: Design Outline (Pre-Requirements) - REVISION 2
**Author**: Peter Michaels Allen
**Last Updated**: January 6, 2026

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-01-06 | Added deselection behavior; Updated error state section; Renamed Select tokens from `.background` to `.subtle` |
| 1.0 | 2026-01-06 | Initial pattern extraction from 038-vertical-list-buttons |

---

## Pattern Overview

The Vertical List Buttons Pattern is a container/orchestrator for presenting actionable choices in a stacked vertical layout. It manages selection behavior, state coordination between items, animations, keyboard navigation, and accessibility semantics.

**Key Characteristic**: Always contains two or more `Button-VerticalListItem` components, displayed vertically.

**Relationship to Component**: This pattern consumes `Button-VerticalListItem` (Spec 038) as its child elements. The pattern owns the "brain" (selection logic, mode behavior), while the component owns the "body" (visual rendering, individual states).

---

## Interaction Models

### 1. Tap Mode
Traditional tap-and-go behavior. User taps a button, action fires immediately.

**Use Cases**: Navigation menus, settings options, action lists

**Pattern Responsibilities**:
- Pass-through click events to parent
- No selection state tracking
- Keyboard navigation (arrow keys to move focus, Enter/Space to activate)

### 2. Select Mode  
Single-selection behavior. User taps to select one button, then waits for a separate confirmation action. Only one item can be selected at a time.

**Use Cases**: Single-choice questions, preference selection, radio-button-style choices

**Pattern Responsibilities**:
- Track `hasSelectionBeenMade` state
- Track `selectedIndex` (or `null` if none)
- Coordinate state transitions across all items
- Manage staggered animation timing between items
- ARIA: `role="radiogroup"` on container

**Deselection Behavior**:
- When the currently selected item is engaged again, ALL items revert to **Rest** state
- This clears the selection and returns the component to its initial state
- `hasSelectionBeenMade` resets to `false`
- Animation: All items transition simultaneously (no stagger)

### 3. Multi-Select Mode
Multiple-selection behavior. User can select one or more buttons, then waits for a separate confirmation action.

**Use Cases**: Multi-choice questions, filter selection, checkbox-style choices

**Pattern Responsibilities**:
- Track `selectedIndices` array
- Toggle individual items on/off
- ARIA: `role="group"` on container with `aria-multiselectable="true"`

---

## State Management

### Select Mode State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                    INITIAL STATE                            │
│         hasSelectionBeenMade = false                        │
│         All items: Rest                                     │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ User selects item
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   SELECTION EXISTS                          │
│         hasSelectionBeenMade = true                         │
│         Selected item: Selected                             │
│         Other items: Not Selected                           │
└─────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    User selects     User selects     User re-engages
    different item   same item        selected item
          │                │                │
          │                │                │
          ▼                ▼                ▼
    Update selection  (no change)    Reset to INITIAL
    (staggered anim)                 (simultaneous anim)
```

### Multi-Select Mode State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                    INITIAL STATE                            │
│         selectedIndices = []                                │
│         All items: Unchecked                                │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ User toggles item
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   SELECTIONS EXIST                          │
│         selectedIndices = [n, ...]                          │
│         Toggled items: Checked                              │
│         Other items: Unchecked                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Animation Coordination

### Select Mode: Selection Change (Item to Item)

When selection changes between items, a staggered animation sequence creates a smooth "handoff" effect:

**Animation Sequence:**
1. **T=0**: Previously selected item begins border fade-out animation (border-color → transparent)
2. **T=50%**: Newly selected item begins border fade-in animation (transparent → border-color)
3. **T=100%**: Previously selected item completes fade-out
4. **T=150%**: Newly selected item completes fade-in

**Checkmark Behavior:**
- Checkmark on deselected item disappears **instantly** (no fade)
- Checkmark on newly selected item fades in
- Rationale: Border animation communicates the "handoff"; instant checkmark removal keeps focus on new selection

### Select Mode: First Selection

When the first selection is made (transitioning from Rest to Selected):
- All non-selected items transition from Rest → Not Selected (background/text color change)
- Selected item transitions from Rest → Selected (background/text/border color change)
- Checkmark fades in on selected item
- All transitions happen simultaneously

### Select Mode: Deselection (Clear All)

When the selected item is re-engaged to clear selection:
- All items transition simultaneously to Rest state
- No staggered animation (there's no "destination" to hand off to)
- Checkmark fades out on previously selected item

### Multi-Select Mode

- Each item animates independently
- Checkmark fades in when checked, fades out when unchecked
- No coordination between items needed

**Animation Specs:**
- Uses `motion.selectionTransition` token (250ms, standard easing)
- Border animates both `border-color` AND `border-width` (1px ↔ 2px)
- Padding compensates for border width change to maintain constant height
- Background color animates smoothly between states
- Stagger delay = 50% of single animation duration (125ms)

---

## Error States

**Scope**: Error states apply at the **container level**, not individual items. The pattern sets `error={true}` on all child items when validation fails.

### When Errors Apply
- **Select Mode**: "Please select an option" — required field with no selection
- **Multi-Select Mode**: "Please select at least one option" or count validation (e.g., "Select 2-4 options")

### Error Visual Treatment

The pattern passes `error={true}` to all `Button-VerticalListItem` children, which renders:
- Border: `color.error.strong`
- Label/Icon: `color.error.strong`
- Background: `color.error.subtle`

**Error Message**: Optional error message slot below the list for descriptive validation feedback.

### Error State Clearing
- Error clears automatically when valid selection is made
- Pattern tracks `isValid` based on mode requirements and current selection
- When `isValid` becomes `true`, pattern sets `error={false}` on all children

### Error + Selection State Interaction

When error is active, items maintain their selection visual state but with error colors:
- `selected` + `error` → Error colors with checkmark visible
- `notSelected` + `error` → Error colors, no checkmark
- `rest` + `error` → Error colors (typically the state when no selection made)

---

## Layout

### Container Spacing
| Relationship | Token | CSS Variable | Value | Notes |
|--------------|-------|--------------|-------|-------|
| Gap between items | `space.grouped.normal` | `--space-grouped-normal` | 8px | Vertical stack spacing |

### Container Sizing
| Property | Value | Notes |
|----------|-------|-------|
| Width | 100% | Always fills parent container width |
| Height | Auto | Determined by content |

---

## Semantic Tokens Used

### Select Color Token Family

| Token | CSS Variable | Purpose |
|-------|--------------|---------|
| `color.select.selected.strong` | `--color-select-selected-strong` | Foreground color for selected state (text, border, icon) |
| `color.select.selected.subtle` | `--color-select-selected-subtle` | Background fill for selected state |
| `color.select.notSelected.strong` | `--color-select-not-selected-strong` | Foreground color for not-selected state (text, icon) |
| `color.select.notSelected.subtle` | `--color-select-not-selected-subtle` | Background fill for not-selected state |

**Token Naming Pattern**: All semantic color families use consistent suffixes:
- `.strong` = foreground (text, border, icon)
- `.subtle` = background

---

## Accessibility

### ARIA Roles by Mode

| Mode | Container Role | Item Role | Additional Attributes |
|------|---------------|-----------|----------------------|
| Tap | `role="group"` | `role="button"` | — |
| Select | `role="radiogroup"` | `role="radio"` | `aria-checked` on items |
| Multi-Select | `role="group"` | `role="checkbox"` | `aria-checked` on items, `aria-multiselectable="true"` on container |

### Keyboard Navigation
- **Tab**: Enter/exit the button group
- **Arrow Up/Down**: Navigate between items within group
- **Enter/Space**: Activate (Tap) or toggle selection (Select/Multi-Select)
- **Home/End**: Jump to first/last item

### Screen Reader Announcements
- Selection state changes announced via `aria-checked` updates
- Error states announced via `aria-invalid` and `aria-describedby` linking to error message

---

## Platform Considerations

### Web
- Semantic container with appropriate ARIA role
- `:focus-visible` for keyboard focus indicators
- Focus management within group

### iOS
- Native container with SwiftUI
- Haptic feedback on selection changes
- VoiceOver support with selection state announcements

### Android
- Material-style container
- TalkBack support with selection state announcements
- Proper focus management

---

## Props/API Surface

```typescript
interface VerticalListButtonsProps {
  mode: 'tap' | 'select' | 'multiSelect';
  
  // Select mode
  selectedIndex?: number | null;
  onSelectionChange?: (index: number | null) => void;
  
  // Multi-select mode
  selectedIndices?: number[];
  onSelectionChange?: (indices: number[]) => void;
  
  // Validation
  required?: boolean;
  minSelections?: number; // Multi-select only
  maxSelections?: number; // Multi-select only
  error?: boolean;
  errorMessage?: string;
  
  // Children
  children: VerticalListButtonItem[];
}
```

---

## Resolved Decisions

| Question | Decision |
|----------|----------|
| Gap between items | `space.grouped.normal` (8px) |
| Max item count | No ceiling |
| Deselection behavior | Re-engage selected item → all revert to Rest |
| Deselection animation | Simultaneous (no stagger) |
| Error scope | Container-level (applies to all children) |
| Error visual | Passed to children via `error` prop |
| Select token naming | `.strong` (foreground) + `.subtle` (background) |
| Animation token | `motion.selectionTransition` (250ms, standard easing) |
| Stagger delay | 125ms (50% of 250ms duration) |

---

## Open Questions

| Question | Status | Notes |
|----------|--------|-------|
| Error message positioning | Open | Below list? Inline? |
| Horizontal variant | Future | Separate pattern spec |

---

## Future Considerations

### Selection Animation Token
If the staggered selection animation pattern proves successful, consider formalizing as semantic tokens:
- `animation.stagger.selection` — 50% delay ratio for selection handoff animations
- Could apply to: Horizontal List Buttons, Tab bars, Segmented controls

### Horizontal List Buttons Pattern
Similar pattern for horizontal layouts — would share much of the selection logic but with different layout tokens.

---

## Related Specs

- **038-vertical-list-buttons**: The individual button component this pattern consumes
- **Input-Text (013)**: Error state patterns to align with

---

*This design outline captures pattern-level decisions. Ready for further refinement before formal requirements.*
