# Task 4.2 Completion: Implement Checkmark Animation

**Date**: January 7, 2026
**Spec**: 038 - Vertical List Button Item
**Task**: 4.2 Implement checkmark animation
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 038-vertical-list-buttons

---

## Summary

Implemented asymmetric checkmark animation behavior where the checkmark always fades in when becoming visible, but can either fade out or hide instantly when disappearing based on the `checkmarkTransition` prop. Also removed all hard-coded fallback values to align with the fail-loudly architecture.

---

## Changes Made

### 1. Updated External CSS File

**File**: `src/components/core/Button-VerticalListItem/platforms/web/ButtonVerticalListItem.styles.css`

Implemented asymmetric animation behavior and removed fallbacks:

```css
/* No fallbacks - fail loudly if tokens not loaded */
--vlbi-transition-duration: var(--motion-selection-transition-duration);
--vlbi-transition-easing: var(--motion-selection-transition-easing);

/* Base checkmark always has fade-in transition */
.vertical-list-item__checkmark {
  transition: opacity var(--vlbi-transition-duration) var(--vlbi-transition-easing),
              visibility var(--vlbi-transition-duration) var(--vlbi-transition-easing);
}

/* Fade mode: inherits base transition for both fade-in and fade-out */
.vertical-list-item__checkmark--fade {
  opacity: inherit;
}

/* Instant mode: only applies instant hide when checkmark is hidden */
/* Fade-in still animated (asymmetric behavior) */
.vertical-list-item__checkmark--instant.vertical-list-item__checkmark--hidden {
  transition: none;
}
```

### 2. Updated Web Component Inline Styles

**File**: `src/components/core/Button-VerticalListItem/platforms/web/ButtonVerticalListItem.web.ts`

- Removed all hard-coded fallback values (e.g., `250ms`, `cubic-bezier(...)`)
- Updated inline CSS to match the external CSS file with the same asymmetric animation pattern
- Added motion tokens to `REQUIRED_CSS_VARIABLES` for fail-loudly validation:
  - `--motion-selection-transition-duration`
  - `--motion-selection-transition-easing`

---

## Animation Behavior

### Fade-In (Always Animated)
- **Requirement 7.2**: Checkmark always fades in using `motion.selectionTransition` (250ms)
- Applied via base `.vertical-list-item__checkmark` class
- Works regardless of `checkmarkTransition` prop value

### Fade-Out (When `checkmarkTransition='fade'`)
- **Requirement 7.3**: Checkmark fades out using `motion.selectionTransition` (250ms)
- Inherits transition from base class
- Default behavior

### Instant Hide (When `checkmarkTransition='instant'`)
- **Requirement 7.4**: Checkmark hides immediately without animation
- Achieved via compound selector `.vertical-list-item__checkmark--instant.vertical-list-item__checkmark--hidden`
- Only overrides transition when checkmark is being hidden
- Fade-in still works normally

---

## Fail-Loudly Architecture Alignment

### Before (Non-Compliant)
```css
/* Hard-coded fallbacks mask token issues */
--vlbi-transition-duration: var(--motion-selection-transition-duration, 250ms);
--vlbi-transition-easing: var(--motion-selection-transition-easing, cubic-bezier(0.4, 0.0, 0.2, 1));
```

### After (Compliant)
```css
/* No fallbacks - fail loudly if tokens not loaded */
--vlbi-transition-duration: var(--motion-selection-transition-duration);
--vlbi-transition-easing: var(--motion-selection-transition-easing);
```

### Token Validation
Motion tokens added to `REQUIRED_CSS_VARIABLES` array, ensuring the component throws a descriptive error if tokens are missing rather than silently degrading.

---

## CSS Selector Strategy

The asymmetric behavior is achieved through CSS specificity:

1. **Base class** (`.vertical-list-item__checkmark`): Always has transition enabled
2. **Fade mode** (`.vertical-list-item__checkmark--fade`): Inherits base transition
3. **Instant mode + hidden** (`.vertical-list-item__checkmark--instant.vertical-list-item__checkmark--hidden`): Overrides transition to `none` only when hiding

This approach ensures:
- Fade-in always works (base transition)
- Fade-out works in fade mode (inherited transition)
- Instant hide works in instant mode (compound selector override)

---

## Requirements Validated

| Requirement | Description | Status |
|-------------|-------------|--------|
| 7.2 | WHEN Selection_Indicator becomes visible THEN it SHALL fade in using `motion.selectionTransition` | ✅ Implemented |
| 7.3 | WHEN checkmarkTransition prop is `fade` AND Selection_Indicator becomes hidden THEN it SHALL fade out using `motion.selectionTransition` | ✅ Implemented |
| 7.4 | WHEN checkmarkTransition prop is `instant` AND Selection_Indicator becomes hidden THEN it SHALL hide immediately without animation | ✅ Implemented |

---

## Test Results

- ✅ visualStateMapping.test.ts - All 43 tests pass
- ✅ TypeScript compilation - No diagnostics
- ✅ CSS validation - No errors

---

## Notes

- All hard-coded fallback values removed per fail-loudly philosophy
- Motion tokens added to required CSS variables validation
- The implementation uses CSS compound selectors for specificity-based override
- Reduced motion media query respects user preferences by disabling all transitions
- The `opacity: inherit` in `.vertical-list-item__checkmark--fade` prevents empty ruleset lint warnings while maintaining semantic class presence
