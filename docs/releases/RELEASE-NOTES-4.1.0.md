# Release Notes v4.1.0

**Release Date**: January 13, 2026
**Previous Version**: v4.0.0

---

## Overview

This release completes three specifications focused on component development and architectural alignment:

- **Spec 038**: Vertical List Buttons - New cross-platform component
- **Spec 039**: Deprecated Component Names Removal - Cleanup
- **Spec 040**: Component Alignment - Architectural consistency

---

## New Features

### Vertical List Button Item Component (Spec 038)

A new cross-platform component for vertical list button items with:

- **Web Implementation**: Custom element `<vertical-list-button-item>` with full accessibility support
- **iOS Implementation**: SwiftUI view with native styling and haptic feedback
- **Android Implementation**: Jetpack Compose component with Material Design integration
- **Features**:
  - Selection state management (single/multi-select)
  - Leading/trailing icon support
  - Subtitle text support
  - Keyboard navigation (arrow keys, Enter, Space)
  - RTL layout support
  - Blend utility integration for consistent hover/pressed states

---

## Improvements

### Component Architectural Alignment (Spec 040)

All four core button/input components now follow consistent architectural patterns:

| Component | Changes |
|-----------|---------|
| **ButtonIcon** | Blend utilities, incremental DOM, semantic motion tokens, external CSS, token-referenced sizing |
| **Button-CTA** | Incremental DOM, semantic motion tokens |
| **Button-VerticalListItem** | Blend utilities, CSS property naming |
| **Input-Text-Base** | External CSS extraction |

**Key Patterns Established**:
- **Blend Utilities**: All interactive components use `getBlendUtilities()` for mathematically consistent hover/pressed state colors
- **Incremental DOM**: Components use `_createDOM()` + `_updateDOM()` pattern to preserve CSS transitions
- **Semantic Motion Tokens**: All animations use `--motion-button-press-duration` and `--motion-button-press-easing`
- **CSS Property Naming**: Component-scoped properties use `--_[abbrev]-*` convention

### Component Development Guide Updates

The Component Development Guide now documents:
- Blend utility usage patterns with Button-CTA as canonical example
- Incremental DOM architecture with Button-VerticalListItem as canonical example
- CSS custom property naming conventions

---

## Breaking Changes

### Deprecated Component Names Removed (Spec 039)

The following deprecated component names have been removed:
- Old component name aliases are no longer supported
- Use the current component names as documented

### Internal Changes (Non-Breaking for Public API)

- ButtonIcon directory renamed from `ButtonIcon/` to `Button-Icon/`
- CSS custom properties renamed from `--button-icon-*` to `--_bi-*`
- CSS custom properties renamed from `--vlbi-*` to `--_vlbi-*`

These changes are internal and do not affect the public component APIs.

---

## Test Suite

- **277 test suites** passing
- **6,620 tests** passing
- All alignment tests validated
- Temporary migration tests retired after validation

---

## Specifications Completed

| Spec | Title | Tasks |
|------|-------|-------|
| 038 | Vertical List Buttons | 10 tasks |
| 039 | Deprecated Component Names Removal | 1 task |
| 040 | Component Alignment | 7 tasks |

---

## Upgrade Notes

1. **No action required** for most users - public APIs unchanged
2. If you were using deprecated component names, update to current names
3. If you were referencing internal CSS custom properties directly, update to new naming convention

---

## Related Documentation

- [Spec 038 Tasks](.kiro/specs/038-vertical-list-buttons/tasks.md)
- [Spec 039 Tasks](.kiro/specs/039-deprecated-component-names-removal/tasks.md)
- [Spec 040 Tasks](.kiro/specs/040-component-alignment/tasks.md)
- [Component Development Guide](.kiro/steering/Component-Development-Guide.md)
