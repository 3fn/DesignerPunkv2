# Requirements Document: TextInputField Animation Refactor

**Date**: December 21, 2025
**Spec**: 027 - TextInputField Animation Refactor
**Status**: Requirements Phase
**Dependencies**: Spec 013 (TextInputField), Spec 014 (Motion Token System), Spec 026 (Test Failure Resolution)

---

## Introduction

This specification defines requirements for refactoring the TextInputField web component to eliminate JavaScript-based animation timing coordination. The current implementation uses `getComputedStyle()` to read CSS custom properties at runtime, which fails in JSDOM test environments because JSDOM doesn't compute CSS custom properties from stylesheets for Shadow DOM elements.

The refactor replaces JavaScript `setTimeout` coordination with pure CSS `transition-delay`, following the pattern established by ButtonCTA. This is a targeted refactor focused on animation timing—not a full component rewrite.

---

## Requirements

### Requirement 1: Remove JavaScript Animation Timing

**User Story**: As a developer, I want TextInputField to coordinate icon visibility timing through CSS instead of JavaScript, so that tests pass without requiring workarounds.

#### Acceptance Criteria

1. WHEN TextInputField is rendered THEN the component SHALL NOT use `getComputedStyle()` to read motion token values from CSS custom properties
2. WHEN the label animation starts THEN the component SHALL NOT use `setTimeout()` to delay icon visibility changes
3. WHEN the component initializes THEN it SHALL NOT create or maintain a `LabelAnimationState` object for tracking animation progress
4. IF the `getAnimationDuration()` method exists THEN it SHALL be removed from the component

---

### Requirement 2: Implement CSS Transition-Delay for Icon Timing

**User Story**: As a user, I want icons to appear after the label floats up, so that the visual sequence feels polished and intentional.

#### Acceptance Criteria

1. WHEN the input receives focus AND the input is empty THEN the trailing icon container SHALL have a `transition-delay` equal to the label animation duration
2. WHEN the input loses focus AND the input is empty THEN the trailing icon container SHALL have a `transition-delay` of 0ms (immediate hide)
3. WHEN the input has content (filled state) THEN icons SHALL be visible without delay
4. WHEN CSS `transition-delay` is applied THEN it SHALL use the `--motion-float-label-duration` custom property value

---

### Requirement 3: Simplify State Management

**User Story**: As a developer, I want simpler state management code, so that the component is easier to understand and maintain.

#### Acceptance Criteria

1. WHEN `calculateIconVisibility()` is called THEN it SHALL NOT require an `animationState` parameter
2. WHEN `calculateIconVisibility()` is called THEN it SHALL determine icon visibility based only on `TextInputFieldState` (focus, filled, error, success states)
3. IF animation state functions exist (`createInitialAnimationState`, `startLabelAnimation`, `updateAnimationProgress`, `completeLabelAnimation`) THEN they SHALL be removed or deprecated
4. WHEN the component updates icon visibility THEN it SHALL NOT check animation progress or completion status

---

### Requirement 4: Maintain Visual Behavior

**User Story**: As a user, I want the input field to look and animate exactly as it did before, so that my experience is unchanged.

#### Acceptance Criteria

1. WHEN the user focuses an empty input THEN the label SHALL float up with a 250ms transition
2. WHEN the label floats up THEN icons SHALL fade in AFTER the label animation completes (250ms delay)
3. WHEN the user blurs an empty input THEN the label SHALL return down with a 250ms transition
4. WHEN the user blurs an empty input THEN icons SHALL fade out immediately (no delay)
5. WHEN the input has content THEN the label SHALL remain floated regardless of focus state
6. WHEN validation state changes (error/success) THEN the appropriate icon SHALL appear based on current label position

---

### Requirement 5: Maintain Accessibility

**User Story**: As a user with accessibility needs, I want the input field to remain fully accessible, so that I can use it effectively.

#### Acceptance Criteria

1. WHEN `prefers-reduced-motion: reduce` is active THEN all transitions and transition-delays SHALL be disabled
2. WHEN the component renders THEN label association (for attribute) SHALL remain functional
3. WHEN the component renders THEN color contrast SHALL meet WCAG 2.1 AA requirements (4.5:1 minimum)
4. WHEN the input receives focus THEN focus indicators SHALL remain visible (2px solid primary)
5. WHEN an error state is active THEN error identification SHALL use both color AND text
6. WHEN keyboard navigation is used THEN all interactive elements SHALL remain accessible

---

### Requirement 6: Remove Test Workarounds

**User Story**: As a developer, I want tests to pass without injecting motion tokens, so that test setup is simpler and tests reflect production behavior.

#### Acceptance Criteria

1. WHEN TextInputField tests run THEN they SHALL NOT require `injectMotionTokens()` helper calls
2. WHEN TextInputField tests run in JSDOM THEN they SHALL pass without inline style injection for motion tokens
3. IF `injectMotionTokens()` helper exists THEN it SHALL be removed from test setup files
4. WHEN new tests are written THEN they SHALL NOT need any motion token workarounds

---

### Requirement 7: Maintain Token Architecture

**User Story**: As a design system maintainer, I want motion tokens to remain the source of truth for animation timing, so that design consistency is preserved.

#### Acceptance Criteria

1. WHEN CSS transitions are defined THEN they SHALL reference `--motion-float-label-duration` custom property
2. WHEN CSS transitions are defined THEN they SHALL reference `--motion-float-label-easing` custom property
3. WHEN motion token values change THEN the component animation timing SHALL update accordingly (via CSS cascade)
4. IF JavaScript reads motion token values at runtime THEN this behavior SHALL be removed

---

### Requirement 8: Update Test Suite

**User Story**: As a developer, I want the test suite to reflect the new architecture, so that tests are maintainable and accurately verify component behavior.

#### Acceptance Criteria

1. WHEN animation state functions are removed THEN corresponding unit tests SHALL be removed from `stateManagement.test.ts`
2. WHEN `calculateIconVisibility()` signature changes THEN all tests using the old signature SHALL be updated to use the new state-only signature
3. WHEN integration tests call `calculateIconVisibility()` THEN they SHALL be updated to remove the `animationState` parameter
4. WHEN tests verify "during animation" icon hiding behavior THEN they SHALL be removed with documentation explaining CSS handles timing
5. WHEN test setup helpers (`injectMotionTokens`, `injectMotionTokensInContainer`) are no longer needed THEN they SHALL be removed from `setup.ts`
6. WHEN icon creation tests exist THEN they SHALL remain unchanged (Icon component integration is unaffected)
7. WHEN motion token integration tests exist THEN they SHALL remain unchanged (token retrieval is unaffected)

---

## Non-Functional Requirements

### NFR-1: Code Reduction

The refactor SHALL reduce component code by approximately 100 lines by removing:
- Animation state management functions
- JavaScript timing coordination logic
- Runtime CSS property reading

### NFR-2: Test Reliability

Tests SHALL pass consistently in JSDOM without environment-specific workarounds.

### NFR-3: Maintainability

The simplified architecture SHALL follow the established ButtonCTA pattern for CSS-based transitions.

---

## Scope Boundaries

### In Scope
- TextInputField web implementation (`TextInputField.web.ts`)
- State management simplification (`stateManagement.ts`)
- Type definitions (`types.ts`)
- CSS transition-delay implementation
- Test file cleanup

### Out of Scope
- iOS implementation (uses native animation APIs)
- Android implementation (uses native animation APIs)
- Float label pattern changes
- Typography token changes
- Validation logic changes
- Icon component changes (icons are already properly implemented via Icon component)

---

## Success Metrics

1. All TextInputField tests pass without `injectMotionTokens()` calls
2. Visual behavior is identical to current implementation (verified manually)
3. ~100 lines of animation state management code removed
4. All WCAG 2.1 AA accessibility requirements maintained
5. `prefers-reduced-motion` support continues to work

---

## References

- **Design Outline**: `.kiro/specs/027-textinputfield-animation-refactor/design-outline.md`
- **Root Cause Analysis**: `.kiro/specs/026-test-failure-resolution/completion/task-6-2-completion.md`
- **CodePen Reference**: https://codepen.io/DCODESHOW/pen/VwBGOyP
- **ButtonCTA Pattern**: `src/components/core/ButtonCTA/platforms/web/`

---

*This requirements document defines the scope and acceptance criteria for the TextInputField animation refactor.*
