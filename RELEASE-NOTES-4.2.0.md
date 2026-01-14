# Release Notes v4.2.0

**Release Date**: January 14, 2026
**Previous Version**: v4.1.0

---

## Overview

This release completes **Spec 041: Vertical List Buttons Pattern**, delivering the `Button-VerticalList-Set` container component with full cross-platform support (Web, iOS, Android) and comprehensive accessibility features.

---

## New Features

### Button-VerticalList-Set Container Component

A new container/orchestrator component for vertical list button groups that manages selection behavior, state coordination, and accessibility semantics.

**Custom Element**: `<button-vertical-list-set>`

**Three Interaction Modes**:
| Mode | Behavior | ARIA Role |
|------|----------|-----------|
| `tap` | Action buttons with no selection tracking | `group` |
| `select` | Single-selection (radio-button style) | `radiogroup` |
| `multiSelect` | Multiple-selection (checkbox style) | `group` with `aria-multiselectable` |

**Key Features**:
- **Controlled Component API**: `selectedIndex`, `selectedIndices`, `onSelectionChange`, `onMultiSelectionChange`
- **Validation**: `required`, `minSelections`, `maxSelections` constraints with error messaging
- **Animation Coordination**: Staggered transitions (125ms handoff) for smooth selection changes
- **Keyboard Navigation**: Arrow Up/Down with wrapping, Home/End, Enter/Space activation
- **Roving Tabindex**: Single tab stop with arrow key navigation within group

**Cross-Platform Implementations**:
- **Web**: Web Component with Shadow DOM, incremental DOM updates, external CSS
- **iOS**: SwiftUI View with VoiceOver support and haptic feedback
- **Android**: Jetpack Compose Composable with TalkBack support and haptic feedback

---

## Improvements

### Component Rename: Button-VerticalList-Item

The existing vertical list button item component was renamed for Stemma System naming consistency:

| Before | After |
|--------|-------|
| `Button-VerticalListItem` | `Button-VerticalList-Item` |
| `<vertical-list-button-item>` | `<button-vertical-list-item>` |

### Bug Fixes

- **Accessibility Fix**: Added `delegatesFocus: true` to enable proper Tab key navigation
- **Event Reliability**: Removed redundant custom click event dispatch (single click event per interaction)

---

## Technical Highlights

### Architectural Patterns

- **Incremental DOM**: `_createDOM()` + `_updateDOM()` pattern preserves CSS transitions
- **External CSS**: Token-based styling with `--_vls-*` prefix for component-scoped properties
- **Token-First**: All spacing, color, and animation values use design tokens (no fallbacks)

### Property-Based Testing

18 correctness properties validated with 100+ iterations each:
- Mode behavior properties (tap, select, multiSelect)
- State derivation properties
- Animation timing properties
- Accessibility properties
- Error handling properties

### Cross-Platform Consistency

All three platforms implement identical:
- Validation logic and error messages
- Mode enum values (`tap`, `select`, `multiSelect`)
- Animation timing (125ms stagger delay)
- State derivation from controlled props

---

## Test Suite

- **284 test suites** passing
- **6,812 tests** passing
- All property-based tests validated
- Cross-platform consistency verified

---

## Specification Completed

| Spec | Title | Tasks |
|------|-------|-------|
| 041 | Vertical List Buttons Pattern | 11 tasks |

---

## Upgrade Notes

1. **Component Rename**: Update imports from `Button-VerticalListItem` to `Button-VerticalList-Item`
2. **Custom Element Tag**: Update HTML from `<vertical-list-button-item>` to `<button-vertical-list-item>`
3. **New Component**: `Button-VerticalList-Set` is available for selection pattern orchestration

---

## Related Documentation

- [Spec 041 Tasks](.kiro/specs/041-vertical-list-buttons-pattern/tasks.md)
- [Button-VerticalList-Set README](src/components/core/Button-VerticalList-Set/README.md)
- [Button-VerticalList-Item README](src/components/core/Button-VerticalList-Item/README.md)
- [Component Family: Button](.kiro/steering/Component-Family-Button.md)
