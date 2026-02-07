# Release Notes: v6.3.0

**Date**: February 7, 2026
**Type**: Minor Release (new components, no breaking changes)
**Previous**: v6.2.0 (Input-Checkbox Component Family)

---

## Summary

Input-Radio Component Family — two new form input components providing single-selection controls across web, iOS, and Android platforms.

---

## New Components

### Input-Radio-Base (Primitive)

Individual radio button with full cross-platform support.

- Three size variants: sm (24px), md (32px), lg (40px)
- Filled dot indicator with scale animation on selection
- Label alignment options: center, top
- Helper text and error message support
- Web: `<input-radio-base>` custom element with Shadow DOM, form integration, CSS logical properties for RTL
- iOS: SwiftUI view with scale press feedback (`scale096`), VoiceOver support
- Android: Jetpack Compose with Material ripple, TalkBack support
- WCAG 2.1 AA compliant: focus ring, keyboard interaction, screen reader announcements

### Input-Radio-Set (Pattern/Orchestrator)

Group container that orchestrates Input-Radio-Base children.

- Mutual exclusivity: selecting one deselects others
- Keyboard navigation: Arrow keys, Home/End, Space to select, roving tabindex
- Group-level validation with `required` support
- Error message display with `role="alert"` for screen reader announcement
- Web: Slot-based composition with `role="radiogroup"`
- iOS: Environment values for state coordination
- Android: CompositionLocal for state coordination
- Follows orchestration pattern (does not duplicate Base rendering logic)

---

## Architecture

Both components follow the orchestration pattern established in v6.2.0 with Input-Checkbox-Legal. The Set orchestrates Base children rather than duplicating rendering logic, ensuring:

- Single source of truth for radio rendering
- Base improvements automatically benefit Set usage
- ~80% less code than standalone implementation

---

## Token Usage

No new tokens required. All tokens existed from prior specs:

- `color.feedback.select.*` — Selection state colors
- `color.feedback.error.*` — Error state colors
- `motion.selectionTransition` — State change animation (250ms)
- `motion.buttonPress` — iOS press feedback (150ms)
- `blend.hoverDarker` / `blend.pressedDarker` — Hover and press states
- `space.inset.050/075/100` — Size variant padding
- `space.grouped.normal/loose` — Label gap
- `accessibility.focus.*` — Focus ring tokens
- `scale096` — iOS press scale

---

## Testing

- Unit tests for Input-Radio-Base (registration, attributes, states, sizes, alignment, accessibility)
- Unit tests for Input-Radio-Set (orchestration, mutual exclusivity, keyboard navigation, validation)
- Stemma System validators for both components (naming, token usage, accessibility)
- Form integration tests (submission, reset, name grouping)
- All 306 test suites pass (7,813+ tests)

---

## Documentation

- Component-Family-Form-Inputs.md updated with radio schemas, behavioral contracts, and token dependencies
- Component-Quick-Reference.md updated with radio family routing and selection guidance
- Component READMEs created for both Input-Radio-Base and Input-Radio-Set
- Survey/Preferences Form composition pattern added

---

## Spec Reference

- Spec 047: Input-Radio-Base & Input-Radio-Set (10 tasks, all complete)

---

## Migration

No migration required. This release adds new components without modifying existing APIs.
