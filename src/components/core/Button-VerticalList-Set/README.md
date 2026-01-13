# Button-VerticalList-Set Component

**Stemma System**: Buttons Family  
**Component Type**: Pattern (VerticalList-Set)  
**Readiness**: 🟡 In Development  
**Version**: 0.1.0

---

## Overview

The Button-VerticalList-Set component is a container/orchestrator pattern for presenting actionable choices in a stacked vertical layout. It manages selection behavior, state coordination between child items, animations, keyboard navigation, and accessibility semantics across three interaction modes: Tap, Select, and Multi-Select.

**Stemma System Naming**: This component follows the `[Family]-[Type]` naming convention:
- **Family**: Button
- **Type**: VerticalList-Set (vertical list selection container)

**Key Design Decision**: This is a controlled component — the parent manages selection state via props, and the Set coordinates visual states across all child items.

---

## Key Features

- ✅ Three interaction modes (Tap, Select, MultiSelect)
- ✅ Controlled component API
- ✅ Coordinated animation timing across children
- ✅ Keyboard navigation with roving tabindex
- ✅ Error state management with validation
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ True Native Architecture (separate implementations per platform)
- 🚧 Token-based styling (in progress)

---

## Usage

### HTML Custom Element

```html
<!-- Tap mode - simple action buttons -->
<button-vertical-list-set mode="tap">
  <button-vertical-list-item label="Settings"></button-vertical-list-item>
  <button-vertical-list-item label="Help"></button-vertical-list-item>
</button-vertical-list-set>

<!-- Select mode - single selection -->
<button-vertical-list-set 
  mode="select" 
  selected-index="0"
>
  <button-vertical-list-item label="Option A"></button-vertical-list-item>
  <button-vertical-list-item label="Option B"></button-vertical-list-item>
</button-vertical-list-set>

<!-- MultiSelect mode - multiple selections -->
<button-vertical-list-set 
  mode="multiSelect"
  min-selections="1"
  max-selections="3"
>
  <button-vertical-list-item label="Choice 1"></button-vertical-list-item>
  <button-vertical-list-item label="Choice 2"></button-vertical-list-item>
  <button-vertical-list-item label="Choice 3"></button-vertical-list-item>
</button-vertical-list-set>
```

---

## API Reference

### Properties

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `mode` | `'tap' \| 'select' \| 'multiSelect'` | ✅ Yes | - | Selection mode |
| `selectedIndex` | `number \| null` | No | `null` | Selected index (Select mode) |
| `selectedIndices` | `number[]` | No | `[]` | Selected indices (MultiSelect mode) |
| `required` | `boolean` | No | `false` | Selection required (Select mode) |
| `minSelections` | `number` | No | - | Minimum selections (MultiSelect mode) |
| `maxSelections` | `number` | No | - | Maximum selections (MultiSelect mode) |
| `error` | `boolean` | No | `false` | Error state indicator |
| `errorMessage` | `string` | No | - | Error message to display |
| `testID` | `string` | No | - | Test identifier |

### Events/Callbacks

| Callback | Parameters | Description |
|----------|------------|-------------|
| `onItemClick` | `(index: number)` | Item clicked (Tap mode) |
| `onSelectionChange` | `(index: number \| null)` | Selection changed (Select mode) |
| `onMultiSelectionChange` | `(indices: number[])` | Selections changed (MultiSelect mode) |

---

## File Structure

```
src/components/core/Button-VerticalList-Set/
├── types.ts                              # Shared type definitions
├── index.ts                              # Module exports
├── README.md                             # This documentation
├── platforms/
│   ├── web/
│   │   ├── ButtonVerticalListSet.web.ts      # Web Component implementation
│   │   └── Button-VerticalList-Set.styles.css # Web styles
│   ├── ios/
│   │   └── ButtonVerticalListSet.swift       # SwiftUI implementation
│   └── android/
│       └── ButtonVerticalListSet.kt          # Compose implementation
└── __tests__/
    ├── ButtonVerticalListSet.unit.test.ts        # Unit tests
    ├── ButtonVerticalListSet.integration.test.ts # Integration tests
    └── ButtonVerticalListSet.property.test.ts    # Property tests
```

---

## Related Documentation

- [Button-VerticalList-Item Component](../Button-VerticalList-Item/README.md) - Child item component
- [Spec 041 - Vertical List Buttons Pattern](/.kiro/specs/041-vertical-list-buttons-pattern/)

---

*This component is part of the DesignerPunk Design System, following Stemma System principles for cross-platform consistency and AI-optimal discoverability.*
