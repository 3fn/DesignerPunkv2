# Implementation Plan: Pre-Product Native Readiness Sweep

**Date**: 2026-04-03
**Spec**: 091 - Native Readiness Sweep
**Status**: Implementation
**Agents**: Kenya (iOS), Data (Android), Lina (fixes), Thurgood (readiness verification)
**Dependencies**: Specs 088, 089, 090, 092 (all complete)

---

## Task List

- [x] 1. Phase 0: Mechanical Pattern Detection

  **Type**: Parent
  **Validation**: Tier 2 - Standard

  **Success Criteria:**
  - All 28 iOS files scanned for known bug patterns
  - All 28 Android files scanned for known bug patterns
  - Findings included in consolidated findings docs
  - Pattern list established as living artifact

  **Completion Documentation:**
  - Detailed: `.kiro/specs/091-native-readiness-sweep/completion/task-1-parent-completion.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Phase 0 Pattern Detection"`

  - [x] 1.1 iOS grep sweep
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Kenya
    - Run known-pattern greps across all 28 `.ios.swift` files
    - Create `findings-ios.md` with cross-cutting patterns section
    - Classify each finding as blocking or non-blocking
    - _Requirements: 1.1, 1.3, 1.4, 1.5_

  - [x] 1.2 Android grep sweep
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Data
    - Run known-pattern greps across all 28 `.android.kt` files
    - Create `findings-android.md` with cross-cutting patterns section
    - Classify each finding as blocking or non-blocking
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [x] 2. Phase 1: Per-Component Review

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - All 28 iOS implementations reviewed against contracts
  - All 28 Android implementations reviewed against contracts
  - Spec 092 token migration verified on both platforms
  - Nav-TabBar-Base sanity check complete
  - All findings documented in consolidated findings docs

  **Completion Documentation:**
  - Detailed: `.kiro/specs/091-native-readiness-sweep/completion/task-2-parent-completion.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Per-Component Review"`

  - [x] 2.1 iOS per-component review
    **Type**: Implementation
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Kenya
    **Depends on**: Task 1.1
    - Review all 28 iOS implementations following the 6-step checklist (contracts, implementation, compliance, token-first, platform idioms, severity)
    - Family-order batching: Container (2) → Button (4) → Icon (1) → FormInput (8) → Badge (3) → Chip (3) → Avatar (1) → Navigation (2) → ProgressIndicator (6)
    - Include Nav-TabBar-Base sanity check
    - Include Spec 092 render verification for: Button-Icon, Progress-Indicator-Node-Base, Avatar-Base, Input-Checkbox-Base, Input-Radio-Base, Nav-TabBar-Base
    - Update cross-cutting patterns section in `findings-ios.md` when new patterns are discovered during review
    - Update `findings-ios.md` with per-component findings and summary table
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.1_

  - [x] 2.2 Android per-component review
    **Type**: Implementation
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Data
    **Depends on**: Task 1.2
    - Review all 28 Android implementations following the 6-step checklist (contracts, implementation, compliance, token-first, Compose idioms including recomposition safety, severity)
    - Family-order batching recommended (same as iOS), reorder if Phase 0 reveals concentrated issues
    - Include Nav-TabBar-Base sanity check
    - Include Spec 092 render verification for: Button-Icon, Progress-Indicator-Node-Base, Avatar-Base, Input-Checkbox-Base, Input-Radio-Base, Nav-TabBar-Base
    - Update cross-cutting patterns section in `findings-android.md` when new patterns are discovered during review
    - Update `findings-android.md` with per-component findings and summary table
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.2_

- [ ] 3. Phase 2: Fix All Issues by Family

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - All blocking AND non-blocking issues from iOS and Android findings fixed
  - Structural issues escalated and resolved
  - All tests pass
  - Every component implementation is production-quality, not just compliant

  **Completion Documentation:**
  - Detailed: `.kiro/specs/091-native-readiness-sweep/completion/task-3-parent-completion.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: All Issues Fixed"`

  - [x] 3.1 Container Family (Container-Base, Container-Card-Base)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews iOS fixes, Data reviews Android fixes)
    - iOS: P3 hard-coded focus color (2 fixes), P4 duplicated `View.if` (2 fixes), P2 local motion constants (2 fixes), P7 module-level hard-coded constants including wrong shadow values (~14 fixes in Card-Base)
    - Android: Focus color wrong + hard-coded (2 fixes), corner radius hard-coded (2 fixes), link→button role mapping (1 fix)
    - Non-blocking: P1 easing curves, P5 preview colors — fix while in the files
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2, 5.5_

  - [x] 3.2 Button Family (Button-CTA, Button-Icon, Button-VerticalList-Item, Button-VerticalList-Set)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews iOS fixes, Data reviews Android fixes)
    - iOS: P8 DesignTokens extension shadowing in VerticalList-Item (~12 properties, system colors → DesignerPunk tokens, typography tuples → struct refs) and VerticalList-Set (1 property). P6 wrong token path (1 fix)
    - Android: `.dp` on Dp token in VerticalList-Set (1 fix), `.dp` verification on Button-CTA style config
    - Non-blocking: P1 easing in VerticalList-Item, Divider in Button-Icon previews — fix while in the files
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2, 5.5_

  - [ ] 3.3 Icon Family (Icon-Base)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews iOS, Data reviews Android)
    - iOS: Review implementation for production quality — verify token usage, accessibility, SwiftUI idioms
    - Android: Review implementation for production quality — verify token usage, accessibility, Compose idioms
    - Fix any issues found (findings reported clean, but verify independently)
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2_

  - [ ] 3.4 FormInput Family (Input-Text-Base, Email, Password, PhoneNumber, Checkbox-Base, Checkbox-Legal, Radio-Base, Radio-Set)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews iOS fixes, Data reviews Android fixes)
    - iOS: Non-blocking P1 easing in Checkbox-Base and Radio-Base
    - Android: Missing easing + no reduced motion check in Checkbox-Base and Radio-Base (non-blocking)
    - All Text inputs clean on both platforms
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2, 5.5_

  - [ ] 3.5 Badge Family (Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews iOS, Data reviews Android)
    - iOS: Review all 3 implementations for production quality — verify token usage, accessibility, SwiftUI idioms
    - Android: Review all 3 implementations for production quality — verify token usage, accessibility, Compose idioms
    - Fix any issues found (findings reported clean, but verify independently)
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2_

  - [ ] 3.6 Chip Family (Chip-Base, Chip-Filter, Chip-Input)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Data reviews Android fixes)
    - iOS: Non-blocking P1 easing in Chip-Filter
    - Android: Hard-coded shape in all 3 Chip components (blocking, 3 fixes)
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2, 5.5_

  - [ ] 3.7 Avatar Family (Avatar-Base)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews iOS, Data reviews Android)
    - iOS: Fix non-blocking border width issue. Review implementation for production quality.
    - Android: Review implementation for production quality — verify token usage, accessibility, Compose idioms (findings reported clean, but verify independently)
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2_

  - [ ] 3.8 Navigation Family (Nav-SegmentedChoice-Base, Nav-TabBar-Base sanity check)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - iOS: Non-blocking P1 easing in TabBar
    - Android: Nav-SegmentedChoice-Base is gold standard (clean). TabBar: `.dp` verification on borderWidth, Divider usage (non-blocking)
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2_

  - [ ] 3.9 ProgressIndicator Family (Node-Base, Connector-Base, Label-Base, Pagination-Base, Stepper-Base, Stepper-Detailed)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (Kenya reviews iOS fixes)
    - iOS: Progress-Indicator-Label-Base hard-coded font size (blocking, 1 fix)
    - Android: Clean per findings
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2, 5.5_

  - [ ] 3.10 Shared iOS utility extraction
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Extract `View.if` extension to shared iOS utility (or remove and inline) — resolves P4 across Container-Base and Container-Card-Base
    - This is a cross-family concern, handled after per-family fixes
    - Verify: no duplicate extensions, all consumers updated
    - _Requirements: 5.1_

- [ ] 4. Phase 3: Readiness Updates and Verification

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - All reviewed components show `reviewed: true` on iOS and Android
  - Readiness compliance test passes
  - Components with all artifacts + reviewed derive `production-ready`
  - All tests pass

  **Completion Documentation:**
  - Detailed: `.kiro/specs/091-native-readiness-sweep/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/091-native-readiness-sweep/task-4-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Readiness Updates"`

  - [ ] 4.1 Update readiness flags
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Task 3
    - Update `reviewed: true` for iOS and Android in all 28 component schemas
    - _Requirements: 6.1_

  - [ ] 4.2 Verify readiness compliance
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    **Depends on**: Task 4.1
    - Run readiness compliance test
    - Verify derived statuses correct for all components
    - Verify `production-ready` derived where all artifacts + reviewed
    - Run `npm test` — full suite passes
    - _Requirements: 6.2, 6.3_
