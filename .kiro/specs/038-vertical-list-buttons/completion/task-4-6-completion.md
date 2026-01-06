# Task 4.6 Completion: Implement Select Mode Animations

**Date**: January 6, 2026
**Task**: 4.6 Implement Select mode animations
**Type**: Implementation
**Validation**: Tier 2: Standard
**Status**: Complete

---

## Summary

Implemented staggered animations for Select mode selection changes in the ButtonVerticalList web component. The animation sequence follows the Button-Icon Secondary hover animation specs with a 50% stagger delay between deselecting and selecting buttons.

---

## Implementation Details

### Animation Sequence

The Select mode animation follows this sequence:
- **T=0**: Deselected button border fade-out begins, checkmark removed instantly
- **T=50%**: Newly selected button border fade-in begins (75ms delay for 150ms duration)
- **T=100%**: Deselected button fade-out completes
- **T=150%**: Newly selected button fade-in completes, checkmark fades in

### Animation Specs (from Button-Icon Secondary hover)

- **Duration**: `duration150` (150ms)
- **Easing**: `ease-in-out`
- **Stagger delay**: 50% of duration (75ms)

### Code Changes

#### 1. Added Previous Selection Tracking

```typescript
/**
 * Track previous selection for animation purposes.
 * Used to determine which buttons are transitioning in Select mode.
 * @see Requirements 7.1, 7.2, 7.3, 7.4, 7.5
 */
private _previousSelectedIds: string[] = [];
```

#### 2. Updated selectedIds Setter

The setter now tracks previous selection and triggers animation logic:

```typescript
set selectedIds(value: string[]) {
  // Store previous selection for animation tracking
  this._previousSelectedIds = [...this._selectedIds];
  this._selectedIds = value;
  
  // In Select mode, apply staggered animations for selection changes
  if (this.mode === 'select' && this._previousSelectedIds.length > 0) {
    this._applySelectModeAnimations();
  } else {
    this.render();
    this._attachEventListeners();
  }
}
```

#### 3. Added Animation Methods

- `_applySelectModeAnimations()`: Determines which items are transitioning and triggers animation render
- `_renderWithAnimations()`: Renders with animation classes and schedules staggered animation
- `_renderButtonWithAnimation()`: Renders individual buttons with appropriate animation state classes

#### 4. Added CSS Animation Classes

```css
/* Animating out state (deselecting button) */
.button-vertical-list__button--animating-out {
  background-color: var(--vlb-bg-not-selected);
  color: var(--vlb-text-not-selected);
  border: var(--vlb-border-selected) solid transparent;
  transition: background-color var(--vlb-transition) ease-in-out,
              border-color var(--vlb-transition) ease-in-out,
              color var(--vlb-transition) ease-in-out;
}

.button-vertical-list__button--animating-out .button-vertical-list__checkmark {
  /* Checkmark removed instantly - no fade animation */
  opacity: 0;
  transition: none;
}

/* Animating in state (newly selecting button) */
.button-vertical-list__button--animating-in {
  background-color: var(--vlb-bg-not-selected);
  color: var(--vlb-text-not-selected);
  border: var(--vlb-border-selected) solid transparent;
  transition: background-color var(--vlb-transition) ease-in-out,
              border-color var(--vlb-transition) ease-in-out,
              color var(--vlb-transition) ease-in-out;
}

.button-vertical-list__button--animating-in .button-vertical-list__checkmark {
  opacity: 0;
  transition: opacity var(--vlb-transition) ease-in-out;
}
```

---

## Requirements Validation

| Requirement | Description | Status |
|-------------|-------------|--------|
| 7.1 | Animate border on newly selected button using Button-Icon Secondary hover specs | ✅ Complete |
| 7.2 | Begin deselected button's border fade-out at T=0 | ✅ Complete |
| 7.3 | Begin newly selected button's border fade-in at T=50% (staggered delay) | ✅ Complete |
| 7.4 | Remove checkmark from deselected button instantly (no fade) | ✅ Complete |
| 7.5 | Fade in checkmark on newly selected button | ✅ Complete |

---

## Files Modified

| File | Changes |
|------|---------|
| `src/components/core/ButtonVerticalList/platforms/web/ButtonVerticalList.web.ts` | Added animation tracking, animation methods, and CSS animation classes |

---

## Testing

- All existing ButtonVerticalList tests pass (41 tests)
- Animation behavior verified through code review
- CSS transitions use token-based duration (`--duration-150`)
- Reduced motion support maintained via `@media (prefers-reduced-motion: reduce)`

---

## Design Decisions

### 1. JavaScript-based Stagger Timing

Used `requestAnimationFrame` + `setTimeout` for the 50% stagger delay rather than CSS animation delays. This approach:
- Provides precise control over animation timing
- Allows dynamic calculation based on which buttons are transitioning
- Works reliably across browsers

### 2. Instant Checkmark Removal

Per Requirement 7.4, the checkmark on the deselected button is removed instantly (no fade) by setting `transition: none` on the checkmark element. This keeps focus on the new selection.

### 3. Animation Class Pattern

Used dedicated animation classes (`--animating-out`, `--animating-in`) rather than modifying existing state classes. This:
- Keeps state logic clean and predictable
- Allows independent control of animation properties
- Makes debugging easier

---

## Cross-References

- **Design Document**: `.kiro/specs/038-vertical-list-buttons/design.md` - Animation Specifications section
- **Requirements**: `.kiro/specs/038-vertical-list-buttons/requirements.md` - Requirement 7
- **Button-Icon Reference**: `src/components/core/ButtonIcon/platforms/web/ButtonIcon.web.css` - Secondary hover animation specs
