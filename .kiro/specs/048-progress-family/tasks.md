# Implementation Plan: Progress Indicator Family

**Date**: February 15, 2026
**Spec**: 048-progress-family
**Status**: Implementation Planning
**Dependencies**: None

---

## Implementation Strategy

This spec implements a complete component family with 3 primitives and 3 semantic variants, plus supporting token infrastructure. Implementation follows a bottom-up approach:

1. **Token Foundation** (Task 1) — Create semantic and component tokens
2. **Primitive Components** (Task 2) — Build reusable visual building blocks
3. **Semantic Variants** (Tasks 3-5) — Compose primitives into user-facing components
4. **Testing Infrastructure** (Task 6) — Comprehensive test coverage across all domains

**Estimated Timeline**: 4-6 weeks
**Total Tasks**: 6 parent tasks, 23 subtasks

---

## Task List

- [x] 1. Token System Foundation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Semantic color.progress.* family created (10 tokens)
  - Component progress.* family created (13 tokens)
  - All tokens follow Rosetta System governance rules
  - Formula-based current size tokens approved by Ada
  - Cross-platform translation verified (web, iOS, Android)
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/tokens/semantic/color-progress.ts`
  - `src/tokens/component/progress.ts`
  - Platform-specific token output files
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/048-progress-family/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/048-progress-family/task-1-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Token System Foundation"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create semantic color.progress.* tokens
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/tokens/semantic/color-progress.ts`
    - Define 10 semantic tokens: current.{background|text}, pending.{background|text|connector}, completed.{background|text|connector}, error.{background|text}
    - All tokens reference primitives (cyan300, cyan400, white300, gray300, white200, green100, green400, pink100, pink400)
    - Include reasoning field for each token
    - _Requirements: 5.1-5.6_

  - [x] 1.2 Create component progress.* tokens
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/tokens/component/progress.ts`
    - Define base size tokens (sm/md/lg) referencing spacing primitives (space150, space200, space300)
    - Define current size tokens (sm/md/lg) using formula: SPACING_BASE_VALUE × multiplier (2, 2.5, 3.5)
    - Define gap tokens (sm/md/lg) referencing spacing primitives (space075, space100, space150)
    - Define connector thickness token referencing borderDefault
    - Include reasoning field for each token
    - _Requirements: 5.7-5.15_

  - [x] 1.3 Implement token formula validation tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/__tests__/ProgressTokenFormulas.test.ts`
    - Test current size formulas derive correct values (16/20/28px)
    - Test mathematical relationship: current = base + 4px
    - Test baseline grid alignment (all divisible by 4px)
    - _Requirements: 15.1_

  - [x] 1.4 Implement token compliance tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/__tests__/ProgressTokenCompliance.test.ts`
    - Test semantic tokens reference primitives (not hard-coded values)
    - Test component tokens use formulas or primitive references
    - Test all tokens include reasoning field
    - Test token counts (10 semantic, 13 component)
    - Test naming conventions (kebab-case, concept-first)
    - _Requirements: 15.2-15.4, 15.8-15.10_

  - [x] 1.5 Implement cross-platform translation tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/tokens/__tests__/ProgressTokenTranslation.test.ts`
    - Test web CSS output includes current size tokens (--progress-node-size-sm-current: 16px)
    - Test iOS Swift output includes current size tokens (ProgressTokens.nodeSizeSmCurrent = 16.0)
    - Test Android Kotlin output includes current size tokens (ProgressTokens.nodeSizeSmCurrent = 16.dp)
    - _Requirements: 6.1-6.5, 15.5-15.7_

---

- [ ] 2. Primitive Components

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All 3 primitive components implemented (Node-Base, Connector-Base, Label-Base)
  - Cross-platform implementations (web, iOS, Android)
  - Stemma naming conventions validated
  - Token application verified
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/components/core/Progress-Indicator-Node-Base/`
  - `src/components/core/Progress-Indicator-Connector-Base/`
  - `src/components/core/Progress-Indicator-Label-Base/`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/048-progress-family/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/048-progress-family/task-2-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Primitive Components"`
  - Verify: Check GitHub for committed changes

  - [ ] 2.1 Implement Progress-Indicator-Node-Base
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create component directory structure
    - Implement web component (Custom Element)
    - Implement iOS component (UIView)
    - Implement Android component (Compose)
    - Support 4 states: incomplete, current, completed, error
    - Support 3 sizes: sm (12px), md (16px), lg (24px)
    - Apply current size emphasis (+4px) for current state
    - Support content: none (dot), checkmark, icon
    - sm size: always dot (content ignored)
    - Apply color tokens based on state
    - Respect prefers-reduced-motion for transitions
    - _Requirements: 1.1-1.5, 12.1-12.5_

  - [ ] 2.2 Implement Progress-Indicator-Connector-Base
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create component directory structure
    - Implement web component (Custom Element)
    - Implement iOS component (UIView)
    - Implement Android component (Compose)
    - Support 2 states: active, inactive
    - Use 1px thickness (borderDefault token)
    - Apply color tokens: green100 (active), white200 (inactive)
    - Flexible length (fills space between nodes)
    - _Requirements: 1.6-1.7, 12.10-12.12_

  - [ ] 2.3 Implement Progress-Indicator-Label-Base
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create component directory structure
    - Implement web component (Custom Element)
    - Implement iOS component (UIView)
    - Implement Android component (Compose)
    - Position centered below node
    - Apply typography.labelSm token (14px)
    - Support optional helper text
    - Truncate with ellipsis if text exceeds width
    - _Requirements: 1.8-1.10_

  - [ ] 2.4 Implement primitive visual state tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/components/core/Progress-Indicator-Node-Base/__tests__/VisualStates.test.ts`
    - Test node renders at base size for incomplete/completed/error states
    - Test node renders at current size for current state
    - Test size transitions respect prefers-reduced-motion
    - Test content rendering: dot (sm), empty circle (md/lg + none), checkmark (md/lg + checkmark), icon (md/lg + icon)
    - Test color application for all states
    - _Requirements: 12.1-12.9, 15.21-15.23_

---

- [ ] 3. Pagination-Base Component

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Pagination-Base implemented with virtualization
  - State derivation logic working correctly
  - Validation and error handling complete (dev throw, production warn+clamp)
  - Virtualization window calculation tested for all edge cases
  - Accessibility compliance verified (ARIA, screen reader)
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/components/core/Progress-Pagination-Base/`
  - `src/components/core/Progress-Pagination-Base/__tests__/`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/048-progress-family/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/048-progress-family/task-3-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Pagination-Base Component"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Implement Pagination-Base core component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create component directory structure
    - Implement web component (Custom Element)
    - Implement iOS component (UIView)
    - Implement Android component (Compose)
    - Compose Node-Base primitives (no connectors, no labels)
    - Implement state derivation: current for currentItem, incomplete for others
    - Pass content='none' to all nodes (dots only)
    - Support sizes: sm, md, lg
    - _Requirements: 2.1-2.3, 10.1-10.2, 11.1-11.6_

  - [ ] 3.2 Implement virtualization logic
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Create calculateVisibleWindow utility function
    - Implement sliding window algorithm (current ±2, centered when possible)
    - Handle edge cases: pages 1-3 (show 1-5), last 3 pages (show last 5), middle pages (centered)
    - Window shifts immediately (no animation)
    - Render only visible nodes (5 max)
    - _Requirements: 2.4-2.9, 9.1-9.6_

  - [ ] 3.3 Implement validation and error handling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Validate totalItems ≤ 50 (dev throw, production warn+clamp)
    - Clamp currentItem to [1, totalItems]
    - Implement error messages with guidance
    - _Requirements: 2.9-2.11, 8.1-8.3_

  - [ ] 3.4 Implement accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply role="group"
    - Apply aria-label="Page {currentItem} of {totalItems}" (actual position, not virtualized)
    - Verify screen reader announces actual position
    - _Requirements: 2.12, 7.1-7.2, 9.7_

  - [ ] 3.5 Implement Pagination-Base tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create Stemma behavioral contract tests (naming, type classification, prop validation, accessibility)
    - Create composition tests (renders nodes only, no connectors/labels)
    - Create state derivation tests (current vs incomplete)
    - Create virtualization tests (window calculation edge cases: pages 1, 3, 4, 26, 47, 48, 50)
    - Create validation tests (dev throw, production warn+clamp for >50 items)
    - Create accessibility tests (ARIA role, label reflects actual position)
    - _Requirements: 13.1, 13.7, 13.10, 13.13, 15.11-15.15, 15.19, 15.24-15.25, 15.33-15.34, 15.40_

---

- [ ] 4. Stepper-Base Component

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Stepper-Base implemented with connectors
  - State derivation with priority logic working correctly
  - Validation and error handling complete (dev throw, production warn+clamp)
  - Connector state management verified
  - Accessibility compliance verified (ARIA progressbar)
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/components/core/Progress-Stepper-Base/`
  - `src/components/core/Progress-Stepper-Base/__tests__/`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/048-progress-family/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/048-progress-family/task-4-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Stepper-Base Component"`
  - Verify: Check GitHub for committed changes

  - [ ] 4.1 Implement Stepper-Base core component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create component directory structure
    - Implement web component (Custom Element)
    - Implement iOS component (UIView)
    - Implement Android component (Compose)
    - Compose Node-Base and Connector-Base primitives (no labels)
    - Implement state derivation with priority: error > completed > current > incomplete
    - Pass content='checkmark' to completed nodes, content='none' to others
    - Pass state='active' to connectors between completed nodes, state='inactive' to others
    - Support sizes: md, lg only (throw if sm)
    - _Requirements: 3.1-3.11, 10.3-10.7, 11.7-11.13_

  - [ ] 4.2 Implement validation and error handling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Validate totalSteps ≤ 8 (dev throw, production warn+clamp)
    - Validate size ≠ 'sm' (throw in both dev and production)
    - Clamp currentStep to [1, totalSteps]
    - Filter errorSteps to valid range [1, totalSteps]
    - Implement error messages with guidance
    - _Requirements: 3.12-3.17, 8.4-8.5, 8.8-8.10_

  - [ ] 4.3 Implement accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply role="progressbar"
    - Apply aria-valuenow={currentStep}, aria-valuemin={1}, aria-valuemax={totalSteps}
    - Verify screen reader announces "Step X of Y"
    - _Requirements: 3.16, 7.3, 7.12_

  - [ ] 4.4 Implement Stepper-Base tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create Stemma behavioral contract tests (naming, type classification, prop validation, accessibility)
    - Create composition tests (renders nodes and connectors, no labels)
    - Create state derivation tests (priority logic: error > completed > current > incomplete)
    - Create validation tests (dev throw, production warn+clamp for >8 steps, throw for sm size)
    - Create accessibility tests (ARIA progressbar, aria-value* attributes)
    - _Requirements: 13.2, 13.8, 13.11, 13.14, 15.11-15.15, 15.16-15.18, 15.20, 15.26, 15.35-15.37, 15.39_

---

- [ ] 5. Stepper-Detailed Component

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - Stepper-Detailed implemented with labels and icons
  - Icon precedence logic working (completed = checkmark always)
  - State derivation with priority logic working correctly
  - Validation and error handling complete (dev throw, production warn+clamp)
  - Accessibility compliance verified (ARIA list, error/optional announcements)
  - Release detection triggered
  
  **Primary Artifacts:**
  - `src/components/core/Progress-Stepper-Detailed/`
  - `src/components/core/Progress-Stepper-Detailed/__tests__/`
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/048-progress-family/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/048-progress-family/task-5-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Stepper-Detailed Component"`
  - Verify: Check GitHub for committed changes

  - [ ] 5.1 Implement Stepper-Detailed core component
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create component directory structure
    - Implement web component (Custom Element)
    - Implement iOS component (UIView)
    - Implement Android component (Compose)
    - Compose Node-Base, Connector-Base, and Label-Base primitives
    - Implement state derivation with priority: error > completed > current > incomplete
    - Implement icon precedence: completed = checkmark always, user icon only for current/incomplete/error
    - Pass content='checkmark' to completed nodes (ignore user icon)
    - Pass content='icon' with icon name to current/incomplete/error nodes (if icon provided)
    - Pass content='none' to current/incomplete/error nodes (if no icon)
    - Pass label text and helper text to Label-Base
    - Pass state='active' to connectors between completed nodes, state='inactive' to others
    - Support sizes: md, lg only (throw if sm)
    - _Requirements: 4.1-4.16, 11.14-11.22_

  - [ ] 5.2 Implement validation and error handling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Validate steps.length ≤ 8 (dev throw, production warn+clamp)
    - Validate size ≠ 'sm' (throw in both dev and production)
    - Clamp currentStep to [1, steps.length]
    - Filter errorSteps to valid range [1, steps.length]
    - Implement error messages with guidance
    - _Requirements: 4.9-4.16, 8.6-8.10_

  - [ ] 5.3 Implement accessibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Apply role="list" with each step as role="listitem"
    - Apply aria-label with "error" suffix for error steps
    - Apply aria-label with "optional" suffix for optional steps
    - Verify screen reader announces "Step X of Y: [label]"
    - _Requirements: 4.13-4.15, 7.4-7.6, 7.13_

  - [ ] 5.4 Implement Stepper-Detailed tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create Stemma behavioral contract tests (naming, type classification, prop validation, accessibility)
    - Create composition tests (renders nodes, connectors, and labels)
    - Create icon precedence tests (completed = checkmark always, user icon for current/incomplete/error)
    - Create state derivation tests (priority logic: error > completed > current > incomplete)
    - Create validation tests (dev throw, production warn+clamp for >8 steps, throw for sm size)
    - Create accessibility tests (ARIA list, error/optional announcements)
    - _Requirements: 13.3, 13.9, 13.12, 13.15, 15.11-15.15, 15.16-15.18, 15.20, 15.27-15.29, 15.35-15.37, 15.39_

---

- [ ] 6. Comprehensive Testing and Platform Parity

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)
  
  **Success Criteria:**
  - All component tests passing (~73 tests)
  - All token tests passing (~15-20 tests)
  - All infrastructure tests passing (~10-15 tests)
  - Platform parity verified (web, iOS, Android)
  - Test coverage meets quality gates
  - Release detection triggered
  
  **Primary Artifacts:**
  - Test files across all components
  - Platform parity test suite
  - Test coverage reports
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/048-progress-family/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/048-progress-family/task-6-summary.md` (triggers release detection)
  
  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Comprehensive Testing and Platform Parity"`
  - Verify: Check GitHub for committed changes

  - [ ] 6.1 Implement platform parity tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/__tests__/platform-parity/ProgressPlatformParity.test.ts`
    - Test web and iOS render same node count
    - Test web and Android render same node count
    - Test all platforms derive same node states
    - Test all platforms apply same size tokens (translated to platform units)
    - Test all platforms render same connector count
    - Test all platforms render same label count (Stepper-Detailed)
    - _Requirements: 14.1-14.13, 15.30-15.32_

  - [ ] 6.2 Run full test suite and verify coverage
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Run `npm test` to execute all tests
    - Verify token tests pass (~15-20 tests)
    - Verify component tests pass (~73 tests)
    - Verify infrastructure tests pass (~10-15 tests)
    - Verify platform parity tests pass (~9 tests)
    - Generate coverage report
    - Verify coverage meets quality gates (>80% for critical paths)
    - _Requirements: 15.1-15.40_

  - [ ] 6.3 Document test results and coverage
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Document test results in completion doc
    - Include coverage metrics
    - Note any gaps or areas for future improvement
    - Document platform-specific test considerations

---

## Implementation Notes

### Task Dependencies

**Sequential Dependencies**:
- Task 1 (Tokens) must complete before Task 2 (Primitives)
- Task 2 (Primitives) must complete before Tasks 3-5 (Semantic Variants)
- Tasks 3-5 can be implemented in parallel (no dependencies between them)
- Task 6 (Testing) requires all previous tasks complete

**Recommended Order**:
1. Task 1: Token System Foundation
2. Task 2: Primitive Components
3. Task 3: Pagination-Base Component
4. Task 4: Stepper-Base Component
5. Task 5: Stepper-Detailed Component
6. Task 6: Comprehensive Testing and Platform Parity

### Validation Tier Summary

**Tier 1 (Minimal)**: 4 subtasks
- Token creation (1.1, 1.2)
- Documentation (6.3)

**Tier 2 (Standard)**: 16 subtasks
- Token tests (1.3, 1.4, 1.5)
- Primitive implementations (2.1, 2.2, 2.3, 2.4)
- Semantic variant implementations (3.1, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4)
- Platform parity tests (6.1, 6.2)

**Tier 3 (Comprehensive)**: 7 subtasks (all parent tasks + 1 architecture subtask)
- Parent tasks (1, 2, 3, 4, 5, 6)
- Virtualization architecture (3.2)

### Test Coverage Goals

**By Domain**:
- Ada (Token Tests): ~15-20 tests
- Lina (Component Tests): ~73 tests
- Thurgood (Infrastructure Tests): ~10-15 tests
- **Total**: ~100-110 tests

**By Component**:
- Primitives: ~15 tests (visual states, token application)
- Pagination-Base: ~20 tests (stemma, composition, state, virtualization, validation, accessibility)
- Stepper-Base: ~18 tests (stemma, composition, state, validation, accessibility)
- Stepper-Detailed: ~20 tests (stemma, composition, icon precedence, state, validation, accessibility)
- Platform Parity: ~9 tests
- Tokens: ~20 tests (formulas, compliance, translation, governance)

### Quality Gates

**Before Release**:
- All Stemma behavioral contract tests pass
- All state derivation tests pass
- All accessibility tests pass (WCAG 2.1 AA compliance)
- All validation tests pass (dev throw, production clamp)
- All token formula tests pass
- Platform parity verified (web, iOS, Android)

**Nice to Have**:
- Test coverage >80% for critical paths
- Performance benchmarks for virtualization
- Visual regression tests

---

**Organization**: spec-guide
**Scope**: 048-progress-family
