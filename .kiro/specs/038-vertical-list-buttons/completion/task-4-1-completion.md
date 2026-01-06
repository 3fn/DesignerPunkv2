# Task 4.1 Completion: Create Web Component Base Structure

**Date**: January 6, 2026
**Task**: 4.1 Create web component base structure
**Status**: Complete
**Type**: Implementation
**Validation**: Tier 2: Standard

---

## Summary

Created the base web component structure for `ButtonVerticalList` following True Native Architecture patterns. The component implements Shadow DOM encapsulation, CSS custom properties for token-based styling, and prop handling for mode, items, selectedIds with onSelectionChange callback wiring.

---

## Implementation Details

### File Created

**`src/components/core/ButtonVerticalList/platforms/web/ButtonVerticalList.web.ts`**

A vanilla web component implementing:

1. **Shadow DOM Setup**
   - Attached shadow root with `mode: 'open'` for style encapsulation
   - Inline CSS generation for Shadow DOM styling
   - CSS custom properties referencing design tokens

2. **Prop Handling**
   - `mode`: VerticalListButtonMode ('tap' | 'select' | 'multiSelect')
   - `items`: VerticalListButtonItem[] (button configuration array)
   - `selectedIds`: string[] (currently selected item IDs)
   - `testID`: string | null (for automated testing)

3. **Selection Logic**
   - **Tap mode**: Triggers item.onTap() callback and dispatches 'tap' event
   - **Select mode**: Single selection - replaces selectedIds with clicked item
   - **Multi-Select mode**: Toggle selection - adds/removes item from selectedIds

4. **onSelectionChange Callback**
   - Callback function property for controlled component pattern
   - Dispatches 'selectionchange' custom event with selectedIds detail
   - Supports both callback and event listener patterns

5. **Event Handling**
   - Click handlers for button activation
   - Keyboard handlers for Enter/Space activation
   - Container keydown for Arrow key navigation (with wrapping)

---

## Token Integration

The component uses CSS custom properties that reference semantic tokens:

| CSS Variable | Token Reference | Purpose |
|--------------|-----------------|---------|
| `--vlb-min-height` | `accessibility.tapAreaRecommended` | 48px minimum touch target |
| `--vlb-border-radius` | `radiusNormal` | 8px border radius |
| `--vlb-padding-vertical` | `verticalListButton.padding.vertical` | 6px vertical padding |
| `--vlb-padding-horizontal` | `space.inset.200` | 16px horizontal padding |
| `--vlb-gap` | `space.grouped.normal` | 8px gap between buttons |
| `--vlb-icon-gap` | `space.grouped.loose` | 12px icon-label gap |
| `--vlb-bg-selected` | `color.select.selected.background` | Selected state background |
| `--vlb-text-selected` | `color.select.selected` | Selected state text color |
| `--vlb-bg-not-selected` | `color.select.notSelected.background` | Not-selected background |
| `--vlb-text-not-selected` | `color.select.notSelected` | Not-selected text color |

---

## Requirements Satisfied

| Requirement | Description | Implementation |
|-------------|-------------|----------------|
| 1.1 | Tap mode triggers action immediately | `_handleButtonClick()` calls `item.onTap()` and dispatches 'tap' event |
| 1.2 | Select mode allows single selection | `_updateSelection([item.id])` replaces entire selection |
| 1.4 | Multi-Select mode allows multiple selections | Toggle logic in `_handleButtonClick()` |

---

## Component API

### Attributes
- `mode`: 'tap' | 'select' | 'multiSelect' (default: 'tap')
- `test-id`: string (optional)

### Properties
- `items`: VerticalListButtonItem[]
- `selectedIds`: string[]
- `onSelectionChange`: (selectedIds: string[]) => void

### Events
- `tap`: Fired in tap mode when button is clicked (detail: { itemId, item })
- `selectionchange`: Fired when selection changes (detail: { selectedIds })

---

## Usage Example

```typescript
// Create component
const list = document.createElement('button-vertical-list') as ButtonVerticalList;

// Configure
list.mode = 'select';
list.items = [
  { id: '1', label: 'Option 1', icon: 'check' },
  { id: '2', label: 'Option 2', description: 'With description' },
  { id: '3', label: 'Option 3' }
];
list.selectedIds = ['1'];

// Handle selection changes
list.onSelectionChange = (selectedIds) => {
  console.log('Selected:', selectedIds);
};

// Or use event listener
list.addEventListener('selectionchange', (e) => {
  console.log('Selected:', e.detail.selectedIds);
});

document.body.appendChild(list);
```

---

## Test Results

```
PASS src/components/core/ButtonVerticalList/__tests__/buttonVerticalList.tokens.test.ts
PASS src/components/core/ButtonVerticalList/__tests__/ButtonVerticalList.stemma.test.ts

Test Suites: 2 passed, 2 total
Tests:       41 passed, 41 total
```

---

## Notes

- This task creates the base structure only; visual states, animations, and accessibility features are implemented in subsequent tasks (4.2-4.12)
- The component follows the controlled component pattern - selection state is managed via props
- Icon rendering uses the `<icon-base>` web component for consistency with other components
- CSS is inlined in Shadow DOM to ensure styles work in all deployment scenarios
