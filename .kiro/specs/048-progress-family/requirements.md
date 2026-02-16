# Requirements Document: Progress Indicator Family

**Date**: February 15, 2026
**Spec**: 048-progress-family
**Status**: Requirements Phase
**Dependencies**: None

---

## Introduction

The Progress Indicator Family provides visual indicators for position and progression through sequences, spanning simple mobile pagination dots through rich desktop steppers with labels, connectors, and content nodes.

**Scope**: Three semantic variants (Pagination-Base, Stepper-Base, Stepper-Detailed) built from shared primitives (Node-Base, Connector-Base, Label-Base), with cross-platform support (web, iOS, Android).

**Key Characteristics**:
- Shared primitive building blocks composed differently by each semantic variant
- Non-interactive by default (navigation handled by parent flow)
- Mathematical foundation: formula-based sizing with +4px current node emphasis
- Accessibility-first: WCAG 2.1 AA compliance with non-color differentiation

---

## Requirements

### Requirement 1: Primitive Components

**User Story**: As a component developer, I want reusable primitive building blocks, so that I can compose semantic variants without duplicating visual rendering logic.

#### Acceptance Criteria

1. WHEN Progress-Indicator-Node-Base is rendered THEN it SHALL support four states: incomplete, current, completed, error
2. WHEN Progress-Indicator-Node-Base is rendered THEN it SHALL support three sizes: sm (12px), md (16px), lg (24px)
3. WHEN Progress-Indicator-Node-Base is rendered with size sm THEN it SHALL render as a dot (no content slot)
4. WHEN Progress-Indicator-Node-Base is rendered with size md or lg THEN it SHALL support content: none, checkmark, icon
5. WHEN Progress-Indicator-Node-Base is rendered with state current THEN it SHALL apply size emphasis (+4px from base size)
6. WHEN Progress-Indicator-Connector-Base is rendered THEN it SHALL support two states: active, inactive
7. WHEN Progress-Indicator-Connector-Base is rendered THEN it SHALL use 1px thickness (borderDefault token)
8. WHEN Progress-Indicator-Label-Base is rendered THEN it SHALL position centered below the node
9. WHEN Progress-Indicator-Label-Base is rendered THEN it SHALL support optional helper text
10. WHEN Progress-Indicator-Label-Base text exceeds available width THEN it SHALL truncate with ellipsis

---

### Requirement 2: Pagination-Base Component

**User Story**: As a developer, I want a simple pagination indicator, so that users can see their position in a carousel or multi-page flow.

#### Acceptance Criteria

1. WHEN Pagination-Base is rendered THEN it SHALL compose Progress-Indicator-Node-Base primitives (dots only)
2. WHEN Pagination-Base is rendered THEN it SHALL NOT render connectors or labels
3. WHEN Pagination-Base receives totalItems and currentItem props THEN it SHALL derive node states: current for currentItem, incomplete for all others
4. WHEN Pagination-Base receives totalItems ≤ 5 THEN it SHALL render all nodes
5. WHEN Pagination-Base receives totalItems > 5 THEN it SHALL render only 5 visible nodes using sliding window algorithm
6. WHEN Pagination-Base virtualizes nodes THEN it SHALL center current node at position 3 (when possible)
7. WHEN Pagination-Base virtualizes nodes AND currentItem ≤ 3 THEN it SHALL show nodes 1-5
8. WHEN Pagination-Base virtualizes nodes AND currentItem ≥ (totalItems - 2) THEN it SHALL show last 5 nodes
9. WHEN Pagination-Base receives totalItems > 50 in development THEN it SHALL throw error with guidance message
10. WHEN Pagination-Base receives totalItems > 50 in production THEN it SHALL log warning and clamp to 50
11. WHEN Pagination-Base receives currentItem outside bounds THEN it SHALL clamp to valid range [1, totalItems]
12. WHEN Pagination-Base is rendered THEN it SHALL use role="group" with aria-label reflecting actual position (not virtualized subset)

---

### Requirement 3: Stepper-Base Component

**User Story**: As a developer, I want a simple stepper indicator with connectors, so that users can see their progress through a linear multi-step flow.

#### Acceptance Criteria

1. WHEN Stepper-Base is rendered THEN it SHALL compose Progress-Indicator-Node-Base and Progress-Indicator-Connector-Base primitives
2. WHEN Stepper-Base is rendered THEN it SHALL NOT render labels
3. WHEN Stepper-Base receives totalSteps and currentStep props THEN it SHALL derive node states using priority: error > completed > current > incomplete
4. WHEN Stepper-Base receives errorSteps prop THEN nodes in errorSteps SHALL have state error
5. WHEN Stepper-Base derives node state AND step < currentStep AND step not in errorSteps THEN node SHALL have state completed
6. WHEN Stepper-Base derives node state AND step === currentStep AND step not in errorSteps THEN node SHALL have state current
7. WHEN Stepper-Base derives node state AND step > currentStep THEN node SHALL have state incomplete
8. WHEN Stepper-Base renders completed nodes THEN it SHALL pass content='checkmark' to node primitive
9. WHEN Stepper-Base renders current/incomplete/error nodes THEN it SHALL pass content='none' to node primitive
10. WHEN Stepper-Base renders connectors THEN connectors between completed nodes SHALL have state active
11. WHEN Stepper-Base renders connectors THEN connectors between incomplete nodes SHALL have state inactive
12. WHEN Stepper-Base receives totalSteps > 8 in development THEN it SHALL throw error with guidance message
13. WHEN Stepper-Base receives totalSteps > 8 in production THEN it SHALL log warning and render first 8 steps only
14. WHEN Stepper-Base receives currentStep outside bounds THEN it SHALL clamp to valid range [1, totalSteps]
15. WHEN Stepper-Base receives errorSteps with invalid indices THEN it SHALL filter to valid range [1, totalSteps]
16. WHEN Stepper-Base is rendered THEN it SHALL use role="progressbar" with aria-valuenow, aria-valuemin, aria-valuemax
17. WHEN Stepper-Base is rendered with size sm THEN it SHALL throw error (steppers require md or lg)

---

### Requirement 4: Stepper-Detailed Component

**User Story**: As a developer, I want a detailed stepper with labels and optional icons, so that users can see step names and status in complex multi-step flows.

#### Acceptance Criteria

1. WHEN Stepper-Detailed is rendered THEN it SHALL compose Progress-Indicator-Node-Base, Progress-Indicator-Connector-Base, and Progress-Indicator-Label-Base primitives
2. WHEN Stepper-Detailed receives steps array THEN it SHALL render label primitive for each step
3. WHEN Stepper-Detailed derives node states THEN it SHALL use same priority logic as Stepper-Base: error > completed > current > incomplete
4. WHEN Stepper-Detailed renders completed nodes THEN it SHALL pass content='checkmark' to node primitive (regardless of user-provided icon)
5. WHEN Stepper-Detailed renders current/incomplete/error nodes AND step has icon THEN it SHALL pass content='icon' with icon name to node primitive
6. WHEN Stepper-Detailed renders current/incomplete/error nodes AND step has no icon THEN it SHALL pass content='none' to node primitive
7. WHEN Stepper-Detailed renders label primitive THEN it SHALL pass step label and optional helper text
8. WHEN Stepper-Detailed renders label primitive AND step is optional THEN label SHALL indicate optional status
9. WHEN Stepper-Detailed receives steps.length > 8 in development THEN it SHALL throw error with guidance message
10. WHEN Stepper-Detailed receives steps.length > 8 in production THEN it SHALL log warning and render first 8 steps only
11. WHEN Stepper-Detailed receives currentStep outside bounds THEN it SHALL clamp to valid range [1, steps.length]
12. WHEN Stepper-Detailed receives errorSteps with invalid indices THEN it SHALL filter to valid range [1, steps.length]
13. WHEN Stepper-Detailed is rendered THEN it SHALL use role="list" with each step as role="listitem"
14. WHEN Stepper-Detailed is rendered with error steps THEN aria-label SHALL include "error" suffix for error steps
15. WHEN Stepper-Detailed is rendered with optional steps THEN aria-label SHALL include "optional" suffix for optional steps
16. WHEN Stepper-Detailed is rendered with size sm THEN it SHALL throw error (steppers require md or lg)

---

### Requirement 5: Token System

**User Story**: As a token consumer, I want semantic and component tokens for progress indicators, so that I can build consistent, themeable progress components.

#### Acceptance Criteria

**Semantic Tokens (Color)**:
1. WHEN color.progress.current.* tokens are defined THEN they SHALL reference cyan primitives (cyan300, cyan400)
2. WHEN color.progress.pending.* tokens are defined THEN they SHALL reference white/gray primitives (white300, gray300, white200)
3. WHEN color.progress.completed.* tokens are defined THEN they SHALL reference green primitives (green100, green400)
4. WHEN color.progress.error.* tokens are defined THEN they SHALL reference pink primitives (pink100, pink400)
5. WHEN semantic color tokens are defined THEN they SHALL include background, text, and connector variants for each state
6. WHEN semantic color tokens are defined THEN total count SHALL be 10 tokens

**Component Tokens (Sizing)**:
7. WHEN progress.node.size.* tokens are defined THEN base sizes SHALL reference spacing primitives (space150, space200, space300)
8. WHEN progress.node.size.*.current tokens are defined THEN they SHALL use formula: SPACING_BASE_VALUE × multiplier
9. WHEN progress.node.size.sm.current is calculated THEN value SHALL be SPACING_BASE_VALUE × 2 = 16px
10. WHEN progress.node.size.md.current is calculated THEN value SHALL be SPACING_BASE_VALUE × 2.5 = 20px
11. WHEN progress.node.size.lg.current is calculated THEN value SHALL be SPACING_BASE_VALUE × 3.5 = 28px
12. WHEN progress.node.gap.* tokens are defined THEN they SHALL reference spacing primitives (space075, space100, space150)
13. WHEN progress.connector.thickness token is defined THEN it SHALL reference borderDefault primitive
14. WHEN component tokens are defined THEN total count SHALL be 13 tokens (6 base sizes, 3 current sizes, 3 gaps, 1 connector thickness)
15. WHEN all component tokens are defined THEN each SHALL include reasoning field

**Token Compliance**:
16. WHEN components reference color tokens THEN they SHALL use semantic tokens (not primitives)
17. WHEN components reference size tokens THEN they SHALL use component tokens (not hard-coded values)
18. WHEN current size tokens are calculated THEN they SHALL maintain +4px offset from base size
19. WHEN current size tokens are calculated THEN they SHALL align to baseline grid subdivisions (divisible by 4px)

---

### Requirement 6: Cross-Platform Translation

**User Story**: As a platform developer, I want tokens to translate correctly to web/iOS/Android, so that progress indicators render consistently across platforms.

#### Acceptance Criteria

1. WHEN tokens are translated to web THEN CSS custom properties SHALL use format: --progress-node-size-sm-current: 16px
2. WHEN tokens are translated to iOS THEN Swift constants SHALL use format: ProgressTokens.nodeSizeSmCurrent = 16.0
3. WHEN tokens are translated to Android THEN Kotlin constants SHALL use format: ProgressTokens.nodeSizeSmCurrent = 16.dp
4. WHEN formula-based tokens are translated THEN calculated values SHALL be consistent across all platforms
5. WHEN semantic color tokens are translated THEN they SHALL resolve to correct primitive values on all platforms

---

### Requirement 7: Accessibility

**User Story**: As a user with disabilities, I want progress indicators to be accessible, so that I can understand my position and progress through flows.

#### Acceptance Criteria

**ARIA Roles and Labels**:
1. WHEN Pagination-Base is rendered THEN it SHALL use role="group" with aria-label="Page X of Y"
2. WHEN Pagination-Base virtualizes nodes THEN aria-label SHALL reflect actual position (not visible subset)
3. WHEN Stepper-Base is rendered THEN it SHALL use role="progressbar" with aria-valuenow, aria-valuemin, aria-valuemax
4. WHEN Stepper-Detailed is rendered THEN it SHALL use role="list" with each step as role="listitem"
5. WHEN Stepper-Detailed renders error steps THEN aria-label SHALL include "error" suffix
6. WHEN Stepper-Detailed renders optional steps THEN aria-label SHALL include "optional" suffix

**Visual Accessibility**:
7. WHEN node states are rendered THEN all SHALL meet WCAG AA contrast requirements against background
8. WHEN current node is rendered THEN size emphasis (+4px) SHALL provide non-color visual differentiation
9. WHEN completed nodes are rendered in steppers THEN checkmark SHALL provide non-color completion signal
10. WHEN node state transitions occur THEN they SHALL respect prefers-reduced-motion

**Screen Reader Support**:
11. WHEN Pagination-Base is announced THEN screen reader SHALL read "Page X of Y" (single announcement, not per-dot)
12. WHEN Stepper-Base is announced THEN screen reader SHALL read "Step X of Y"
13. WHEN Stepper-Detailed is announced THEN screen reader SHALL read "Step X of Y: [label]"

---

### Requirement 8: Validation and Error Handling

**User Story**: As a developer, I want clear validation errors, so that I can quickly identify and fix incorrect prop usage.

#### Acceptance Criteria

**Pagination Validation**:
1. WHEN Pagination-Base receives totalItems > 50 in development THEN it SHALL throw Error with message: "Progress-Pagination-Base supports a maximum of 50 items. Received {totalItems} items. Consider using a different navigation pattern for larger sets."
2. WHEN Pagination-Base receives totalItems > 50 in production THEN it SHALL log warning and clamp to 50
3. WHEN Pagination-Base receives currentItem < 1 or > totalItems THEN it SHALL clamp to valid range [1, totalItems]

**Stepper Validation**:
4. WHEN Stepper-Base receives totalSteps > 8 in development THEN it SHALL throw Error with message: "Progress-Stepper-Base supports a maximum of 8 steps. Received {totalSteps} steps. For longer flows, break into multiple sub-flows."
5. WHEN Stepper-Base receives totalSteps > 8 in production THEN it SHALL log warning and render first 8 steps only
6. WHEN Stepper-Detailed receives steps.length > 8 in development THEN it SHALL throw Error with message: "Progress-Stepper-Detailed supports a maximum of 8 steps. Received {steps.length} steps. For longer flows, break into multiple sub-flows."
7. WHEN Stepper-Detailed receives steps.length > 8 in production THEN it SHALL log warning and render first 8 steps only
8. WHEN Stepper-Base or Stepper-Detailed receives currentStep < 1 or > totalSteps THEN it SHALL clamp to valid range [1, totalSteps]
9. WHEN Stepper-Base or Stepper-Detailed receives errorSteps with invalid indices THEN it SHALL filter to valid range [1, totalSteps]
10. WHEN Stepper-Base or Stepper-Detailed receives size='sm' THEN it SHALL throw Error with message: "Steppers require size 'md' or 'lg'. Size 'sm' is only supported for Pagination-Base."

---

### Requirement 9: Pagination Virtualization

**User Story**: As a developer, I want pagination to handle large item counts efficiently, so that carousels with many pages don't bloat the DOM.

#### Acceptance Criteria

1. WHEN Pagination-Base receives totalItems ≤ 5 THEN it SHALL render all nodes (no virtualization)
2. WHEN Pagination-Base receives totalItems > 5 THEN it SHALL render only 5 visible nodes
3. WHEN Pagination-Base calculates visible window AND currentItem is 1, 2, or 3 THEN it SHALL show nodes 1-5
4. WHEN Pagination-Base calculates visible window AND currentItem is 4 to (totalItems - 3) THEN it SHALL show currentItem ±2 (centered at position 3)
5. WHEN Pagination-Base calculates visible window AND currentItem is last 3 pages THEN it SHALL show nodes (totalItems - 4) to totalItems
6. WHEN Pagination-Base changes currentItem THEN visible window SHALL shift immediately (no animation)
7. WHEN Pagination-Base virtualizes nodes THEN aria-label SHALL reflect actual position (e.g., "Page 26 of 50"), not visible subset

---

### Requirement 10: State Derivation Logic

**User Story**: As a component consumer, I want predictable state derivation, so that node visual states match my mental model of progress.

#### Acceptance Criteria

**Pagination State Logic**:
1. WHEN Pagination-Base derives node state AND node index === currentItem THEN state SHALL be current
2. WHEN Pagination-Base derives node state AND node index ≠ currentItem THEN state SHALL be incomplete

**Stepper State Logic**:
3. WHEN Stepper-Base or Stepper-Detailed derives node state AND node index is in errorSteps THEN state SHALL be error (highest priority)
4. WHEN Stepper-Base or Stepper-Detailed derives node state AND node index < currentStep AND not in errorSteps THEN state SHALL be completed
5. WHEN Stepper-Base or Stepper-Detailed derives node state AND node index === currentStep AND not in errorSteps THEN state SHALL be current
6. WHEN Stepper-Base or Stepper-Detailed derives node state AND node index > currentStep THEN state SHALL be incomplete
7. WHEN Stepper-Base or Stepper-Detailed applies state priority THEN order SHALL be: error > completed > current > incomplete

---

### Requirement 11: Composition Contracts

**User Story**: As a component maintainer, I want semantic variants to compose primitives correctly, so that visual rendering is consistent and maintainable.

#### Acceptance Criteria

**Pagination-Base Composition**:
1. WHEN Pagination-Base is rendered THEN it SHALL render Progress-Indicator-Node-Base for each visible item
2. WHEN Pagination-Base is rendered THEN it SHALL NOT render Progress-Indicator-Connector-Base
3. WHEN Pagination-Base is rendered THEN it SHALL NOT render Progress-Indicator-Label-Base
4. WHEN Pagination-Base renders nodes THEN it SHALL pass content='none' to all nodes (dots only)
5. WHEN Pagination-Base renders nodes THEN it SHALL pass correct state (incomplete or current) to each node
6. WHEN Pagination-Base renders nodes THEN it SHALL pass size prop to each node

**Stepper-Base Composition**:
7. WHEN Stepper-Base is rendered THEN it SHALL render Progress-Indicator-Node-Base for each step
8. WHEN Stepper-Base is rendered THEN it SHALL render Progress-Indicator-Connector-Base between all nodes (n-1 connectors for n nodes)
9. WHEN Stepper-Base is rendered THEN it SHALL NOT render Progress-Indicator-Label-Base
10. WHEN Stepper-Base renders completed nodes THEN it SHALL pass content='checkmark' to node primitive
11. WHEN Stepper-Base renders current/incomplete/error nodes THEN it SHALL pass content='none' to node primitive
12. WHEN Stepper-Base renders connectors between completed nodes THEN it SHALL pass state='active' to connector primitive
13. WHEN Stepper-Base renders connectors between incomplete nodes THEN it SHALL pass state='inactive' to connector primitive

**Stepper-Detailed Composition**:
14. WHEN Stepper-Detailed is rendered THEN it SHALL render Progress-Indicator-Node-Base for each step
15. WHEN Stepper-Detailed is rendered THEN it SHALL render Progress-Indicator-Connector-Base between all nodes (n-1 connectors for n nodes)
16. WHEN Stepper-Detailed is rendered THEN it SHALL render Progress-Indicator-Label-Base for each step
17. WHEN Stepper-Detailed renders completed nodes THEN it SHALL pass content='checkmark' to node primitive (icon precedence: checkmark always for completed)
18. WHEN Stepper-Detailed renders current/incomplete/error nodes AND step has icon THEN it SHALL pass content='icon' with icon name to node primitive
19. WHEN Stepper-Detailed renders current/incomplete/error nodes AND step has no icon THEN it SHALL pass content='none' to node primitive
20. WHEN Stepper-Detailed renders label primitive THEN it SHALL pass step label and optional helper text
21. WHEN Stepper-Detailed renders connectors between completed nodes THEN it SHALL pass state='active' to connector primitive
22. WHEN Stepper-Detailed renders connectors between incomplete nodes THEN it SHALL pass state='inactive' to connector primitive

---

### Requirement 12: Visual State Rendering

**User Story**: As a user, I want clear visual differentiation between progress states, so that I can quickly understand my position and status.

#### Acceptance Criteria

**Node Size Rendering**:
1. WHEN node with state incomplete is rendered THEN it SHALL use base size (12/16/24px based on size prop)
2. WHEN node with state completed is rendered THEN it SHALL use base size (12/16/24px based on size prop)
3. WHEN node with state error is rendered THEN it SHALL use base size (12/16/24px based on size prop)
4. WHEN node with state current is rendered THEN it SHALL use current size (16/20/28px based on size prop)
5. WHEN node transitions to current state THEN size change SHALL respect prefers-reduced-motion

**Node Content Rendering**:
6. WHEN node with size sm is rendered THEN it SHALL render as dot (no content) regardless of content prop
7. WHEN node with size md or lg AND content='none' is rendered THEN it SHALL render as empty circle
8. WHEN node with size md or lg AND content='checkmark' is rendered THEN it SHALL render checkmark icon
9. WHEN node with size md or lg AND content='icon' is rendered THEN it SHALL render specified icon

**Connector Rendering**:
10. WHEN connector with state active is rendered THEN it SHALL use color.progress.completed.connector token (green100)
11. WHEN connector with state inactive is rendered THEN it SHALL use color.progress.pending.connector token (white200)
12. WHEN connector is rendered THEN it SHALL use 1px thickness (borderDefault token)

**Color Application**:
13. WHEN node with state incomplete is rendered THEN it SHALL use color.progress.pending.* tokens
14. WHEN node with state current is rendered THEN it SHALL use color.progress.current.* tokens
15. WHEN node with state completed is rendered THEN it SHALL use color.progress.completed.* tokens
16. WHEN node with state error is rendered THEN it SHALL use color.progress.error.* tokens

---

### Requirement 13: Stemma System Compliance

**User Story**: As a component system maintainer, I want all progress components to follow Stemma naming and behavioral contracts, so that they integrate consistently with the design system.

#### Acceptance Criteria

**Naming Conventions**:
1. WHEN Progress-Pagination-Base is validated THEN it SHALL follow [Family]-[Type]-[Variant] naming pattern
2. WHEN Progress-Stepper-Base is validated THEN it SHALL follow [Family]-[Type]-[Variant] naming pattern
3. WHEN Progress-Stepper-Detailed is validated THEN it SHALL follow [Family]-[Type]-[Variant] naming pattern
4. WHEN Progress-Indicator-Node-Base is validated THEN it SHALL be classified as primitive component type
5. WHEN Progress-Indicator-Connector-Base is validated THEN it SHALL be classified as primitive component type
6. WHEN Progress-Indicator-Label-Base is validated THEN it SHALL be classified as primitive component type
7. WHEN Progress-Pagination-Base is validated THEN it SHALL be classified as semantic component type
8. WHEN Progress-Stepper-Base is validated THEN it SHALL be classified as semantic component type
9. WHEN Progress-Stepper-Detailed is validated THEN it SHALL be classified as semantic component type

**Property and Accessibility Validation**:
10. WHEN Pagination-Base props are validated THEN required props SHALL be totalItems and currentItem
11. WHEN Stepper-Base props are validated THEN required props SHALL be totalSteps and currentStep
12. WHEN Stepper-Detailed props are validated THEN required props SHALL be steps and currentStep
13. WHEN Pagination-Base accessibility is validated THEN it SHALL have role="group" and aria-label
14. WHEN Stepper-Base accessibility is validated THEN it SHALL have role="progressbar" and aria-value* attributes
15. WHEN Stepper-Detailed accessibility is validated THEN it SHALL have role="list" and role="listitem" for steps

---

### Requirement 14: Platform Parity

**User Story**: As a cross-platform developer, I want progress indicators to render equivalently on web/iOS/Android, so that users have consistent experiences.

#### Acceptance Criteria

**Node Rendering Parity**:
1. WHEN Pagination-Base is rendered on web and iOS THEN node count SHALL be identical
2. WHEN Pagination-Base is rendered on web and Android THEN node count SHALL be identical
3. WHEN Stepper-Base is rendered on all platforms THEN node states SHALL be derived identically
4. WHEN Stepper-Detailed is rendered on all platforms THEN node states SHALL be derived identically

**Size Token Parity**:
5. WHEN node size tokens are applied on web THEN values SHALL be in px units (16px, 20px, 28px)
6. WHEN node size tokens are applied on iOS THEN values SHALL be in CGFloat (16.0, 20.0, 28.0)
7. WHEN node size tokens are applied on Android THEN values SHALL be in dp units (16.dp, 20.dp, 28.dp)
8. WHEN size tokens are translated across platforms THEN calculated values SHALL be numerically equivalent

**Connector Rendering Parity**:
9. WHEN Stepper-Base is rendered on all platforms THEN connector count SHALL be identical (n-1 for n nodes)
10. WHEN Stepper-Detailed is rendered on all platforms THEN connector count SHALL be identical (n-1 for n nodes)
11. WHEN connectors are rendered on all platforms THEN thickness SHALL be 1px/1.0/1.dp equivalent

**Label Rendering Parity**:
12. WHEN Stepper-Detailed is rendered on all platforms THEN label count SHALL be identical (one per step)
13. WHEN labels are rendered on all platforms THEN typography token SHALL translate to equivalent font size

---

### Requirement 15: Test Coverage

**User Story**: As a quality engineer, I want comprehensive test coverage, so that I can verify correctness and prevent regressions.

#### Acceptance Criteria

**Token Tests (Ada's Domain)**:
1. WHEN token formula validation tests run THEN they SHALL verify current size formulas derive correct values (16/20/28px)
2. WHEN token compliance tests run THEN they SHALL verify semantic tokens reference primitives (not hard-coded values)
3. WHEN token compliance tests run THEN they SHALL verify component tokens use formulas or primitive references
4. WHEN token compliance tests run THEN they SHALL verify all tokens include reasoning field
5. WHEN cross-platform translation tests run THEN they SHALL verify web CSS output includes current size tokens
6. WHEN cross-platform translation tests run THEN they SHALL verify iOS Swift output includes current size tokens
7. WHEN cross-platform translation tests run THEN they SHALL verify Android Kotlin output includes current size tokens
8. WHEN token governance tests run THEN they SHALL verify semantic color.progress family has 10 tokens
9. WHEN token governance tests run THEN they SHALL verify component token family has 13 tokens
10. WHEN token governance tests run THEN they SHALL verify all tokens follow naming conventions (kebab-case, concept-first)

**Component Tests (Lina's Domain)**:
11. WHEN Stemma behavioral contract tests run THEN they SHALL verify naming conventions for all 6 components
12. WHEN Stemma behavioral contract tests run THEN they SHALL verify component type classification (primitive vs semantic)
13. WHEN Stemma behavioral contract tests run THEN they SHALL verify prop validation (max items/steps, bounds checking)
14. WHEN Stemma behavioral contract tests run THEN they SHALL verify accessibility properties (ARIA roles, labels)
15. WHEN composition tests run THEN they SHALL verify Pagination-Base renders nodes only (no connectors, no labels)
16. WHEN composition tests run THEN they SHALL verify Stepper-Base renders nodes and connectors (no labels)
17. WHEN composition tests run THEN they SHALL verify Stepper-Detailed renders nodes, connectors, and labels
18. WHEN composition tests run THEN they SHALL verify correct content prop passed to nodes (none, checkmark, icon)
19. WHEN state derivation tests run THEN they SHALL verify Pagination state logic (current vs incomplete)
20. WHEN state derivation tests run THEN they SHALL verify Stepper state logic with priority (error > completed > current > incomplete)
21. WHEN visual state tests run THEN they SHALL verify current nodes render at emphasized size (+4px)
22. WHEN visual state tests run THEN they SHALL verify completed nodes render checkmark icon
23. WHEN visual state tests run THEN they SHALL verify size transitions respect prefers-reduced-motion
24. WHEN accessibility tests run THEN they SHALL verify Pagination uses role="group" with correct aria-label
25. WHEN accessibility tests run THEN they SHALL verify Pagination virtualization reflects actual position in ARIA
26. WHEN accessibility tests run THEN they SHALL verify Stepper-Base uses role="progressbar" with aria-value* attributes
27. WHEN accessibility tests run THEN they SHALL verify Stepper-Detailed uses role="list" with role="listitem"
28. WHEN accessibility tests run THEN they SHALL verify error steps announced with "error" suffix
29. WHEN accessibility tests run THEN they SHALL verify optional steps announced with "optional" suffix
30. WHEN platform parity tests run THEN they SHALL verify web and iOS render same node count
31. WHEN platform parity tests run THEN they SHALL verify all platforms derive same node states
32. WHEN platform parity tests run THEN they SHALL verify all platforms apply same size tokens (translated to platform units)

**Infrastructure Tests (Thurgood's Domain)**:
33. WHEN virtualization logic tests run THEN they SHALL verify calculateVisibleWindow for edge cases (pages 1, 3, 4, 26, 47, 48, 50)
34. WHEN validation behavior tests run THEN they SHALL verify dev-time throws for >50 items, >8 steps
35. WHEN validation behavior tests run THEN they SHALL verify production-time warning+clamp for >50 items, >8 steps
36. WHEN validation behavior tests run THEN they SHALL verify bounds clamping for currentItem, currentStep
37. WHEN validation behavior tests run THEN they SHALL verify errorSteps filtering to valid range
38. WHEN state derivation tests run THEN they SHALL verify Pagination state logic matches specification
39. WHEN state derivation tests run THEN they SHALL verify Stepper state priority logic matches specification
40. WHEN accessibility tests run THEN they SHALL verify virtualized ARIA labels reflect actual position

---

## Summary

**Total Requirements**: 15 major requirements
**Total Acceptance Criteria**: 280+ testable conditions
**Test Coverage Estimate**: ~100-110 tests across three domains (Ada: ~15-20, Lina: ~73, Thurgood: ~10-15)

**Key Quality Gates**:
- All components follow Stemma naming and behavioral contracts
- All tokens follow Rosetta System governance rules
- All components meet WCAG 2.1 AA accessibility standards
- All components render with platform parity (web, iOS, Android)
- All validation errors provide clear, actionable guidance

---

**Organization**: spec-guide
**Scope**: 048-progress-family
