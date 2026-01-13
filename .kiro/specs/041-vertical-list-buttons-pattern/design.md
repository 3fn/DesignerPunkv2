# Design Document: Vertical List Buttons Pattern

**Date**: January 13, 2026
**Spec**: 041 - Vertical List Buttons Pattern
**Status**: Design Phase
**Dependencies**: 
- Spec 038 (Button-VerticalListItem) - Existing component to be renamed
- Spec 040 (Component Alignment) - Architectural standards

---

## Overview

This design document specifies the `Button-VerticalList-Set` component — a container/orchestrator pattern for presenting actionable choices in a stacked vertical layout. The Set manages selection behavior, state coordination between child items, animations, keyboard navigation, and accessibility semantics across three interaction modes: Tap, Select, and Multi-Select.

The design follows a controlled component pattern where the Set is the source of truth for selection state and pushes visual states down to children. This is required because the Set needs to coordinate visual states across all items (e.g., setting `notSelected` on non-selected items in Select mode).

This spec also includes renaming the existing `Button-VerticalListItem` component to `Button-VerticalList-Item` for naming consistency with Stemma System conventions.

---

## Architecture

### Component Hierarchy

```
Button-VerticalList-Set (Container/Orchestrator)
├── Error Message (optional, above list)
├── Button-VerticalList-Item (child 1)
├── Button-VerticalList-Item (child 2)
├── Button-VerticalList-Item (child 3)
└── ... (n children)
```

### Responsibility Separation

| Component | Responsibility |
|-----------|----------------|
| **Button-VerticalList-Set** | Selection logic, mode behavior, state coordination, animation timing, keyboard navigation, accessibility roles |
| **Button-VerticalList-Item** | Visual rendering, individual state display, animation execution, hover/pressed states |

The Set owns the "brain" (selection logic, mode behavior), while the Item owns the "body" (visual rendering, individual states).

### State Flow (Controlled Pattern)

```
┌─────────────────────────────────────────────────────────────┐
│                    Parent Application                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  selectedIndex / selectedIndices (controlled props)  │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Button-VerticalList-Set                 │    │
│  │  - Derives visual states from controlled props       │    │
│  │  - Coordinates animation timing                      │    │
│  │  - Manages keyboard navigation                       │    │
│  │  - Invokes callbacks on user interaction             │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│              ┌────────────┼────────────┐                    │
│              ▼            ▼            ▼                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    Item 0   │  │    Item 1   │  │    Item 2   │         │
│  │ visualState │  │ visualState │  │ visualState │         │
│  │ transDelay  │  │ transDelay  │  │ transDelay  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### Button-VerticalList-Set Interface

```typescript
interface ButtonVerticalListSetProps {
  // Mode selection
  mode: 'tap' | 'select' | 'multiSelect';
  
  // Select mode (controlled)
  selectedIndex?: number | null;
  onSelectionChange?: (index: number | null) => void;
  
  // Multi-select mode (controlled)
  selectedIndices?: number[];
  onMultiSelectionChange?: (indices: number[]) => void;
  
  // Tap mode
  onItemClick?: (index: number) => void;
  
  // Validation
  required?: boolean;
  minSelections?: number;  // Multi-select only
  maxSelections?: number;  // Multi-select only
  error?: boolean;
  errorMessage?: string;
  
  // Children
  children: ButtonVerticalListItem[];
  
  // Testing
  testID?: string;
}
```

### Button-VerticalList-Item Interface (Updated)

```typescript
interface ButtonVerticalListItemProps {
  // Content
  label: string;
  icon?: IconName;
  
  // Visual state (controlled by Set)
  visualState: 'rest' | 'selected' | 'notSelected' | 'checked' | 'unchecked';
  
  // Animation coordination (controlled by Set)
  transitionDelay?: number;  // milliseconds
  checkmarkTransition?: 'animated' | 'instant';
  
  // Error state (controlled by Set)
  error?: boolean;
  
  // ARIA (controlled by Set)
  role?: 'button' | 'radio' | 'checkbox';
  ariaChecked?: boolean;
  
  // Events
  onClick?: () => void;
  
  // Testing
  testID?: string;
}
```

### Visual State Definitions

| State | Border | Background | Text/Icon | Checkmark |
|-------|--------|------------|-----------|-----------|
| `rest` | `color.border.default` | `color.background.default` | `color.content.default` | Hidden |
| `selected` | `color.select.selected.strong` | `color.select.selected.subtle` | `color.select.selected.strong` | Visible |
| `notSelected` | transparent | `color.select.notSelected.subtle` | `color.select.notSelected.strong` | Hidden |
| `checked` | `color.select.selected.strong` | `color.select.selected.subtle` | `color.select.selected.strong` | Visible |
| `unchecked` | `color.border.default` | `color.background.default` | `color.content.default` | Hidden |

---

## Data Models

### Internal State Model

```typescript
interface SetInternalState {
  // Focus management
  focusedIndex: number;
  
  // Animation tracking
  previousSelectedIndex: number | null;  // For stagger calculation
  isFirstSelection: boolean;             // For simultaneous vs staggered
  
  // Validation
  isValid: boolean;
  validationMessage: string | null;
}
```

### State Derivation Logic

```typescript
function deriveItemStates(
  mode: Mode,
  selectedIndex: number | null,
  selectedIndices: number[],
  itemCount: number
): VisualState[] {
  switch (mode) {
    case 'tap':
      return Array(itemCount).fill('rest');
      
    case 'select':
      if (selectedIndex === null) {
        return Array(itemCount).fill('rest');
      }
      return Array(itemCount).fill(null).map((_, i) => 
        i === selectedIndex ? 'selected' : 'notSelected'
      );
      
    case 'multiSelect':
      return Array(itemCount).fill(null).map((_, i) =>
        selectedIndices.includes(i) ? 'checked' : 'unchecked'
      );
  }
}
```

---

## Mode Behavior

### Tap Mode

**Purpose**: Traditional tap-and-go behavior for navigation or immediate actions.

**State Machine**:
```
┌─────────────────────────────────────────────────────────────┐
│                    ALL ITEMS: REST                          │
│                    (permanent state)                        │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ User clicks item N
                           ▼
                    onItemClick(N) invoked
                           │
                           ▼
                    Return to REST
```

**ARIA**: `role="group"` on container, `role="button"` on items.

### Select Mode

**Purpose**: Single-selection behavior (radio-button style).

**State Machine**:
```
┌─────────────────────────────────────────────────────────────┐
│                    INITIAL STATE                            │
│         All items: Rest                                     │
│         selectedIndex = null                                │
│         isFirstSelection = true                             │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ User selects item N
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   SELECTION EXISTS                          │
│         Item N: Selected                                    │
│         All other items: Not Selected                       │
│         selectedIndex = N                                   │
│         isFirstSelection = false                            │
└─────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┴────────────────┐
          │                                 │
          ▼                                 ▼
    User selects                      User selects
    SAME item (N)                     DIFFERENT item (M)
          │                                 │
          ▼                                 ▼
    Reset to INITIAL                  Update selection
    onSelectionChange(null)           onSelectionChange(M)
    (simultaneous animation)          (staggered animation)
```

**ARIA**: `role="radiogroup"` on container, `role="radio"` + `aria-checked` on items.

### Multi-Select Mode

**Purpose**: Multiple-selection behavior (checkbox style).

**State Machine**:
```
┌─────────────────────────────────────────────────────────────┐
│                    INITIAL STATE                            │
│         All items: Unchecked                                │
│         selectedIndices = []                                │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ User toggles item N
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   SELECTIONS EXIST                          │
│         Toggled items: Checked                              │
│         Other items: Unchecked                              │
│         selectedIndices = [N, ...]                          │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ User toggles item (add or remove)
                           ▼
                    Update selectedIndices
                    onMultiSelectionChange(newIndices)
                    (independent animation per item)
```

**ARIA**: `role="group"` + `aria-multiselectable="true"` on container, `role="checkbox"` + `aria-checked` on items.

---

## Animation Coordination

### Animation Timing Strategy

The Set coordinates animation timing by setting `transitionDelay` props on child Items. The actual animation execution is handled by the Item component using `motion.selectionTransition` (250ms, standard easing).

### Select Mode: Selection Change (Staggered)

When selection changes from item A to item B:

```typescript
function calculateStaggeredDelays(
  previousIndex: number,
  newIndex: number,
  itemCount: number
): number[] {
  const delays = Array(itemCount).fill(0);
  delays[previousIndex] = 0;    // Deselecting starts immediately
  delays[newIndex] = 125;       // Selecting starts at 50% (stagger)
  return delays;
}
```

**Timeline**:
- T=0ms: Item A begins deselection animation
- T=125ms: Item B begins selection animation
- T=250ms: Item A completes deselection
- T=375ms: Item B completes selection

### Select Mode: First Selection (Simultaneous)

When first selection is made (all items transition from Rest):

```typescript
function calculateFirstSelectionDelays(itemCount: number): number[] {
  return Array(itemCount).fill(0);  // All simultaneous
}
```

### Select Mode: Deselection (Simultaneous)

When selected item is re-engaged to clear selection:

```typescript
function calculateDeselectionDelays(itemCount: number): number[] {
  return Array(itemCount).fill(0);  // All simultaneous
}
```

### Multi-Select Mode (Independent)

Each item animates independently:

```typescript
function calculateMultiSelectDelay(toggledIndex: number): number {
  return 0;  // Immediate, no coordination needed
}
```

### Checkmark Transition

In Select mode, when deselecting an item, the checkmark should disappear instantly while the border animates:

```typescript
function getCheckmarkTransition(
  isDeselecting: boolean,
  mode: Mode
): 'animated' | 'instant' {
  if (mode === 'select' && isDeselecting) {
    return 'instant';
  }
  return 'animated';
}
```

---

## Keyboard Navigation

### Roving Tabindex Pattern

The Set manages focus using roving tabindex:

```typescript
function updateTabIndices(
  items: HTMLElement[],
  focusedIndex: number
): void {
  items.forEach((item, i) => {
    item.tabIndex = i === focusedIndex ? 0 : -1;
  });
}
```

### Key Handlers

| Key | Action |
|-----|--------|
| Tab | Move focus into/out of group |
| Arrow Down | Move focus to next item (wrap to first) |
| Arrow Up | Move focus to previous item (wrap to last) |
| Home | Move focus to first item |
| End | Move focus to last item |
| Enter/Space | Activate item (mode-dependent) |

```typescript
function handleKeyDown(
  event: KeyboardEvent,
  focusedIndex: number,
  itemCount: number,
  mode: Mode
): { newFocusIndex: number; shouldActivate: boolean } {
  switch (event.key) {
    case 'ArrowDown':
      return { 
        newFocusIndex: (focusedIndex + 1) % itemCount, 
        shouldActivate: false 
      };
    case 'ArrowUp':
      return { 
        newFocusIndex: (focusedIndex - 1 + itemCount) % itemCount, 
        shouldActivate: false 
      };
    case 'Home':
      return { newFocusIndex: 0, shouldActivate: false };
    case 'End':
      return { newFocusIndex: itemCount - 1, shouldActivate: false };
    case 'Enter':
    case ' ':
      event.preventDefault();
      return { newFocusIndex: focusedIndex, shouldActivate: true };
    default:
      return { newFocusIndex: focusedIndex, shouldActivate: false };
  }
}
```

---

## Error Handling

### Validation Logic

```typescript
function validateSelection(
  mode: Mode,
  selectedIndex: number | null,
  selectedIndices: number[],
  required: boolean,
  minSelections?: number,
  maxSelections?: number
): { isValid: boolean; message: string | null } {
  if (mode === 'select' && required && selectedIndex === null) {
    return { isValid: false, message: 'Please select an option' };
  }
  
  if (mode === 'multiSelect') {
    const count = selectedIndices.length;
    
    if (minSelections !== undefined && count < minSelections) {
      return { 
        isValid: false, 
        message: `Please select at least ${minSelections} option${minSelections > 1 ? 's' : ''}` 
      };
    }
    
    if (maxSelections !== undefined && count > maxSelections) {
      return { 
        isValid: false, 
        message: `Please select no more than ${maxSelections} option${maxSelections > 1 ? 's' : ''}` 
      };
    }
  }
  
  return { isValid: true, message: null };
}
```

### Max Selection Enforcement

In Multi-Select mode, when `maxSelections` is set, prevent selecting additional items:

```typescript
function canSelectItem(
  index: number,
  selectedIndices: number[],
  maxSelections?: number
): boolean {
  if (selectedIndices.includes(index)) {
    return true;  // Can always deselect
  }
  if (maxSelections !== undefined && selectedIndices.length >= maxSelections) {
    return false;  // At max, can't select more
  }
  return true;
}
```

### Error State Propagation

When `error={true}` on the Set, all child Items receive `error={true}`:

```typescript
function propagateErrorState(
  error: boolean,
  itemCount: number
): boolean[] {
  return Array(itemCount).fill(error);
}
```

### Accessibility for Errors

```typescript
function getErrorAccessibility(
  error: boolean,
  errorMessage: string | null,
  errorMessageId: string
): { ariaInvalid: boolean; ariaDescribedBy: string | null } {
  return {
    ariaInvalid: error,
    ariaDescribedBy: error && errorMessage ? errorMessageId : null
  };
}
```

### Error State Behavior Clarifications

**Error Message Styling**:
- Error message text uses `color.error.strong` for text color
- Error message uses `typography.body.small` for font styling
- Error message container has no background (text only, positioned above list)

**Focus Management on Error**:
- When error state is set programmatically, focus remains on the current item (no automatic focus movement)
- The `role="alert"` on the error message ensures screen readers announce the error immediately without focus change
- This follows WCAG guidance: alerts should not steal focus from user's current position

**Animation on Error State Change**:
- Error state changes are **instant** (no animation)
- Rationale: Error states indicate validation problems that need immediate attention; animating them would delay the feedback
- The `motion.selectionTransition` token is only used for selection state changes, not error state changes

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

**Note on Requirements 1.1-1.4 (Rename Operations)**: These requirements cover structural changes (directory rename, custom element tag rename, import updates, documentation updates). These are verified through build success and manual inspection rather than property-based testing, as they are one-time migration tasks rather than runtime behaviors.

### Property 1: Single Click Event Per Interaction

*For any* user click interaction on a Button-VerticalList-Item, exactly one click event SHALL reach external listeners.

**Validates: Requirements 1.6, 1.7**

### Property 2: ARIA Role Based on Mode

*For any* mode value ('tap', 'select', 'multiSelect'), the Button-VerticalList-Set container SHALL have the correct ARIA role:
- 'tap' → `role="group"`
- 'select' → `role="radiogroup"`
- 'multiSelect' → `role="group"` with `aria-multiselectable="true"`

**Validates: Requirements 2.1, 3.4, 4.6, 5.4**

### Property 3: Tap Mode Items Always Rest

*For any* Button-VerticalList-Set in tap mode with any number of items, all items SHALL be in `rest` visual state regardless of user interactions.

**Validates: Requirements 3.1, 3.3**

### Property 4: Tap Mode Click Callback

*For any* item clicked in tap mode, the `onItemClick` callback SHALL be invoked with the correct item index.

**Validates: Requirements 3.2, 9.5**

### Property 5: Select Mode State Transitions

*For any* Button-VerticalList-Set in select mode:
- When an item is selected, that item SHALL be in `selected` state and all other items SHALL be in `notSelected` state
- When the currently selected item is re-selected, all items SHALL return to `rest` state
- When a different item is selected, the new item SHALL be `selected` and all others SHALL be `notSelected`

**Validates: Requirements 4.2, 4.3, 4.4**

### Property 6: Select Mode Selection Callback

*For any* selection change in select mode, the `onSelectionChange` callback SHALL be invoked with the new index (or `null` for deselection).

**Validates: Requirements 4.5, 9.3**

### Property 7: Select Mode Item ARIA Attributes

*For any* item in select mode, the item SHALL have `role="radio"` and `aria-checked` reflecting its selection state.

**Validates: Requirements 4.7**

### Property 8: MultiSelect Mode Toggle Behavior

*For any* item toggled in multiSelect mode, that item SHALL toggle between `checked` and `unchecked` states while other items remain unchanged.

**Validates: Requirements 5.2**

### Property 9: MultiSelect Mode Selection Callback

*For any* selection change in multiSelect mode, the `onMultiSelectionChange` callback SHALL be invoked with the complete array of selected indices.

**Validates: Requirements 5.3, 9.4**

### Property 10: MultiSelect Mode Item ARIA Attributes

*For any* item in multiSelect mode, the item SHALL have `role="checkbox"` and `aria-checked` reflecting its checked state.

**Validates: Requirements 5.5**

### Property 11: Animation Timing Coordination

*For any* selection change in select mode:
- When changing selection between items, the deselecting item SHALL have `transitionDelay=0ms` and the selecting item SHALL have `transitionDelay=125ms`
- When deselecting (clearing selection), all items SHALL have `transitionDelay=0ms`
- The deselecting item SHALL have `checkmarkTransition='instant'`

*For any* toggle in multiSelect mode, the toggled item SHALL have `transitionDelay=0ms`.

**Validates: Requirements 6.1, 6.3, 6.4, 6.5**

### Property 12: Error State Propagation

*For any* Button-VerticalList-Set with `error={true}`, all child items SHALL receive `error={true}`.

**Validates: Requirements 7.1**

### Property 13: Error Clearing on Valid Selection

*For any* Button-VerticalList-Set with `required={true}` and `error={true}`, when a valid selection is made, the error state SHALL be cleared.

**Validates: Requirements 7.3**

### Property 14: Selection Count Validation

*For any* Button-VerticalList-Set in multiSelect mode:
- When `minSelections` is set, validation SHALL fail if fewer than that many items are selected
- When `maxSelections` is set, selecting additional items SHALL be prevented when at the maximum

**Validates: Requirements 7.4, 7.5**

### Property 15: Error Accessibility Attributes

*For any* Button-VerticalList-Set with `error={true}` and `errorMessage` provided, the container SHALL have `aria-invalid="true"` and `aria-describedby` linking to the error message.

**Validates: Requirements 7.6**

### Property 16: Keyboard Navigation

*For any* Button-VerticalList-Set with focus:
- Arrow Up/Down SHALL move focus between items with wrapping
- Enter/Space SHALL activate the focused item according to mode
- Focus SHALL be managed using roving tabindex pattern (focused item has `tabindex=0`, others have `tabindex=-1`)

**Validates: Requirements 8.2, 8.3, 8.6**

### Property 17: Controlled Component State Derivation

*For any* Button-VerticalList-Set, child visual states SHALL be derived entirely from controlled props (`selectedIndex` or `selectedIndices`), not from internal state.

**Validates: Requirements 9.6**

### Property 18: Token Usage for Styling

*For any* spacing, color, or animation value in Button-VerticalList-Set, the value SHALL reference a design token (no hard-coded values).

**Validates: Requirements 11.4**

---

## Testing Strategy

### Testing Philosophy Alignment

This testing strategy follows the Test Development Standards established in the DesignerPunk design system:

- **Test behavior, not implementation**: Tests verify what the component does, not how it does it
- **Test contracts, not details**: Integration tests verify the contract between Set and Item components
- **Evergreen tests only**: All tests verify permanent functional requirements (no temporary migration tests)
- **Proper async handling**: Web component tests use `customElements.whenDefined()` and async lifecycle patterns

### Validation Approach

| Validation Type | Mechanism | What It Validates |
|-----------------|-----------|-------------------|
| **Static Analysis (Linting)** | Stemma validators | Component naming, token usage, property completeness |
| **Unit Tests** | Jest + jsdom | Specific examples, edge cases, error conditions |
| **Integration Tests** | Jest + jsdom | Set/Item contract, callback invocation |
| **Property Tests** | fast-check | Universal properties across generated inputs |

### Unit Tests (Evergreen)

Unit tests verify specific examples and edge cases. All tests focus on **behavior**, not implementation details.

**Component Registration & Setup**:
1. Verify custom elements are registered with correct tag names (`<button-vertical-list-set>`, `<button-vertical-list-item>`)
2. Verify `delegatesFocus: true` is configured on Item shadow DOM

**Initial State by Mode**:
3. Verify tap mode renders all items in `rest` state
4. Verify select mode with no selection renders all items in `rest` state
5. Verify multiSelect mode with no selections renders all items in `unchecked` state

**Error State Behavior**:
6. Verify error message appears above list when `errorMessage` provided
7. Verify error message has `role="alert"` for screen reader announcement
8. Verify error message is not rendered when `errorMessage` is not provided

**Keyboard Navigation Edge Cases**:
9. Verify Home key moves focus to first item
10. Verify End key moves focus to last item
11. Verify Tab moves focus into/out of group

**Animation Timing Edge Cases**:
12. Verify first selection uses simultaneous animation (all delays = 0)
13. Verify deselection uses simultaneous animation (all delays = 0)

**Validation Edge Cases**:
14. Verify max selection enforcement prevents selecting beyond limit

### Web Component Testing Pattern

All web component tests follow the async lifecycle pattern from Test Development Standards:

```typescript
describe('Button-VerticalList-Set', () => {
  beforeAll(() => {
    // Explicitly register custom elements
    if (!customElements.get('button-vertical-list-set')) {
      customElements.define('button-vertical-list-set', ButtonVerticalListSet);
    }
    if (!customElements.get('button-vertical-list-item')) {
      customElements.define('button-vertical-list-item', ButtonVerticalListItem);
    }
  });

  beforeEach(async () => {
    // Wait for element definitions
    await customElements.whenDefined('button-vertical-list-set');
    await customElements.whenDefined('button-vertical-list-item');
  });

  it('should render with correct ARIA role', async () => {
    const element = document.createElement('button-vertical-list-set');
    element.setAttribute('mode', 'select');
    document.body.appendChild(element);
    
    // Wait for connectedCallback to fire
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const container = element.shadowRoot?.querySelector('.vls-container');
    expect(container?.getAttribute('role')).toBe('radiogroup');
    
    // Cleanup
    document.body.removeChild(element);
  });
});
```

### Property-Based Tests (Evergreen)

Property-based tests verify universal properties across many generated inputs. Each test runs minimum 100 iterations.

**Click Event Properties**:
1. **Property 1**: *For any* click interaction, exactly one click event reaches external listeners

**ARIA Role Properties**:
2. **Property 2**: *For any* mode value, container has correct ARIA role

**Tap Mode Properties**:
3. **Property 3**: *For any* item count and click sequence in tap mode, all items remain in `rest` state
4. **Property 4**: *For any* item clicked in tap mode, `onItemClick` receives correct index

**Select Mode Properties**:
5. **Property 5**: *For any* selection sequence, state transitions follow the state machine
6. **Property 6**: *For any* selection change, `onSelectionChange` is invoked with correct value
7. **Property 7**: *For any* item in select mode, ARIA attributes are correct

**MultiSelect Mode Properties**:
8. **Property 8**: *For any* toggle sequence, items toggle correctly
9. **Property 9**: *For any* selection change, `onMultiSelectionChange` receives correct array
10. **Property 10**: *For any* item in multiSelect mode, ARIA attributes are correct

**Animation Timing Properties**:
11. **Property 11**: *For any* selection change, animation timing follows coordination rules

**Error State Properties**:
12. **Property 12**: *For any* error state, all children receive `error={true}`
13. **Property 13**: *For any* required set with error, valid selection clears error
14. **Property 14**: *For any* min/max constraints, validation enforces limits
15. **Property 15**: *For any* error with message, accessibility attributes are set

**Keyboard Navigation Properties**:
16. **Property 16**: *For any* arrow key sequence, focus moves correctly with wrapping

**Controlled Component Properties**:
17. **Property 17**: *For any* controlled prop value, visual states derive correctly

**Token Usage Properties**:
18. **Property 18**: *For any* rendered output, all styling values reference tokens

### Integration Tests (Evergreen)

Integration tests verify the contract between Set and Item components, focusing on **what** the Set passes to Items, not **how** Items render.

**Contract Tests**:
1. Set passes correct `visualState` to Items based on mode and selection
2. Set passes correct `transitionDelay` to Items for animation coordination
3. Set passes correct `error` prop to all Items when error state is active
4. Set passes correct ARIA attributes (`role`, `aria-checked`) to Items based on mode

### Testing Framework

- **Unit Tests**: Jest with jsdom for Web Component testing
- **Property-Based Tests**: fast-check for property-based testing
- **Minimum Iterations**: 100 per property test
- **Stemma Validators**: Component naming, token usage validation (static analysis)

---

## Design Decisions

### Decision 1: Controlled-Only API

**Options Considered**:
1. Uncontrolled (internal state management)
2. Controlled (parent manages state)
3. Hybrid (both controlled and uncontrolled modes)

**Decision**: Controlled-only

**Rationale**: The Set needs to coordinate visual states across all items. In Select mode, when one item is selected, all other items must transition to `notSelected`. This coordination requires the Set to be the source of truth. A controlled API makes this explicit and prevents state synchronization bugs.

**Trade-offs**:
- ✅ Clear state ownership
- ✅ Predictable behavior
- ✅ Easy to integrate with form libraries
- ❌ More boilerplate for simple use cases

### Decision 2: Error Message Position (Top)

**Options Considered**:
1. Above the list (top)
2. Below the list (bottom)
3. Inline with each item

**Decision**: Above the list (top)

**Rationale**: Users should see the error before the options, allowing them to understand the problem before making a selection. This follows form validation best practices where errors appear near the top of the problematic section.

**Trade-offs**:
- ✅ Error visible before options
- ✅ Consistent with form validation patterns
- ❌ May push content down when error appears

### Decision 3: Staggered Animation for Selection Change

**Options Considered**:
1. Simultaneous animation (all items animate together)
2. Staggered animation (deselecting starts first, selecting follows)
3. Sequential animation (deselecting completes before selecting starts)

**Decision**: Staggered animation with 50% overlap

**Rationale**: Staggered animation creates a smooth "handoff" effect that guides the user's eye from the old selection to the new selection. The 50% overlap (125ms delay on 250ms animation) provides visual continuity without making the transition feel slow.

**Trade-offs**:
- ✅ Smooth visual handoff
- ✅ Guides user attention
- ✅ Feels responsive
- ❌ More complex timing coordination

### Decision 4: Instant Checkmark on Deselection

**Options Considered**:
1. Animated checkmark fade-out
2. Instant checkmark removal
3. Checkmark fades with border

**Decision**: Instant checkmark removal

**Rationale**: When selection changes, the border animation communicates the "handoff" between items. Having the checkmark also animate would create visual noise. Instant removal keeps focus on the new selection while the border animation provides the transition feedback.

**Trade-offs**:
- ✅ Cleaner visual transition
- ✅ Focus on new selection
- ❌ Slight visual discontinuity

---

## Platform Implementations

### Web (Primary)

**Architecture**:
- Custom Element: `<button-vertical-list-set>`
- External CSS file: `Button-VerticalList-Set.styles.css`
- DOM pattern: `_createDOM()` + `_updateDOM()` (incremental updates)
- CSS property prefix: `--_vls-*`

**Shadow DOM Configuration**:
- `delegatesFocus: true` — enables tab navigation to focus inner interactive elements
- Single click event — native click bubbles through shadow DOM, no custom `dispatchEvent` needed (fixes duplicate click bug in Item component)

**Shadow DOM Structure**:
```html
<div class="vls-container" role="[mode-dependent]">
  <!-- Only rendered when errorMessage is provided -->
  <div class="vls-error-message" id="error-msg" role="alert">[errorMessage]</div>
  <slot></slot>
</div>
```

**Error Message Rendering**:
- Error message element is conditionally rendered only when `errorMessage` prop is provided
- Uses `role="alert"` for immediate screen reader announcement when error appears
- Styled with `color.error.strong` for text color

### iOS

**Architecture**:
- SwiftUI View: `ButtonVerticalListSet`
- Uses `@State` for internal focus tracking
- Uses `@Binding` for controlled selection state
- VoiceOver support via accessibility modifiers

### Android

**Architecture**:
- Jetpack Compose Composable: `ButtonVerticalListSet`
- Uses `remember` for internal focus tracking
- Uses state hoisting for controlled selection
- TalkBack support via semantics modifiers

---

## Token Usage

### Spacing Tokens

| Usage | Token | CSS Variable |
|-------|-------|--------------|
| Gap between items | `space.grouped.normal` | `--space-grouped-normal` |

### Color Tokens

| Usage | Token | CSS Variable |
|-------|-------|--------------|
| Selected foreground | `color.select.selected.strong` | `--color-select-selected-strong` |
| Selected background | `color.select.selected.subtle` | `--color-select-selected-subtle` |
| Not selected foreground | `color.select.notSelected.strong` | `--color-select-not-selected-strong` |
| Not selected background | `color.select.notSelected.subtle` | `--color-select-not-selected-subtle` |
| Error foreground | `color.error.strong` | `--color-error-strong` |
| Error background | `color.error.subtle` | `--color-error-subtle` |
| Error message text | `color.error.strong` | `--color-error-strong` |

### Border Tokens

| Usage | Token | CSS Variable |
|-------|-------|--------------|
| Default border | `color.border.default` | `--color-border-default` |
| Error border | `color.error.strong` | `--color-error-strong` |

*Note: Border and background tokens for individual item states are managed by the Button-VerticalList-Item component.*

### Typography Tokens

| Usage | Token | CSS Variable |
|-------|-------|--------------|
| Error message text | `typography.body.small` | `--typography-body-small` |

### Motion Tokens

| Usage | Token | CSS Variable |
|-------|-------|--------------|
| Selection transition | `motion.selectionTransition` | `--motion-selection-transition` |

---

*This design document provides the technical specification for implementing the Button-VerticalList-Set component across all platforms while maintaining consistency with the DesignerPunk design system architecture.*
