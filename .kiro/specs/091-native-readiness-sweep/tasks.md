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

  - [ ] 3.1 Container Family (Container-Base, Container-Card-Base)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina fixes, Kenya reviews full iOS implementation, Data reviews full Android implementation
    **Status**: Lina fixes complete. Data full Android review complete (see feedback-container-android.md). Kenya full iOS review pending.
    **Feedback docs**: `feedback/feedback-container-ios.md` (Kenya), `feedback/feedback-container-android.md` (Data)
    - Lina fixes all issues from findings (iOS + Android) ✅
    - Kenya: Full production-quality review of iOS implementations — document in `feedback-container-ios.md`. Assess: token architecture, accessibility, SwiftUI idioms, code organization, error handling patterns. Flag anything you wouldn't be comfortable building product screens against.
    - Data: Full production-quality review of Android implementations ✅ (see feedback-container-android.md — found C1-C8, new issues beyond original findings)
    - Lina: Fix ALL issues found in feedback docs — blocking, non-blocking, and new issues discovered during production-quality review
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2, 5.5_

  - [ ] 3.2 Button Family (Button-CTA, Button-Icon, Button-VerticalList-Item, Button-VerticalList-Set)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina fixes, Kenya reviews full iOS implementation, Data reviews full Android implementation
    **Feedback docs**: `feedback/feedback-button-ios.md` (Kenya), `feedback/feedback-button-android.md` (Data)
    - Lina: Fix all issues from findings
    - Kenya: Full production-quality review — document in `feedback-button-ios.md`
    - Data: Full production-quality review — document in `feedback-button-android.md`
    - Lina: Fix ALL issues found in feedback docs
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2, 5.5_

  - [x] 3.3 Icon Family (Icon-Base)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina fixes, Kenya reviews full iOS implementation, Data reviews full Android implementation
    **Feedback docs**: `feedback/feedback-icon-ios.md` (Kenya), `feedback/feedback-icon-android.md` (Data)
    - Kenya: Full production-quality review — document in `feedback-icon-ios.md`
    - Data: Full production-quality review — document in `feedback-icon-android.md`
    - Lina: Fix ALL issues found in feedback docs
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2_

  - [x] 3.4 FormInput Family (Input-Text-Base, Email, Password, PhoneNumber, Checkbox-Base, Checkbox-Legal, Radio-Base, Radio-Set)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina fixes, Kenya reviews full iOS implementation, Data reviews full Android implementation
    **Feedback docs**: `feedback/feedback-forminput-ios.md` (Kenya), `feedback/feedback-forminput-android.md` (Data)
    - Lina: Fix all issues from findings
    - Kenya: Full production-quality review — document in `feedback-forminput-ios.md`
    - Data: Full production-quality review — document in `feedback-forminput-android.md`
    - Lina: Fix ALL issues found in feedback docs
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2, 5.5_

  - [ ] 3.5 Badge Family (Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina fixes, Kenya reviews full iOS implementation, Data reviews full Android implementation
    **Feedback docs**: `feedback/feedback-badge-ios.md` (Kenya), `feedback/feedback-badge-android.md` (Data)
    - Kenya: Full production-quality review — document in `feedback-badge-ios.md`
    - Data: Full production-quality review — document in `feedback-badge-android.md`
    - Lina: Fix ALL issues found in feedback docs
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2_

  - [ ] 3.6 Chip Family (Chip-Base, Chip-Filter, Chip-Input)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina fixes, Kenya reviews full iOS implementation, Data reviews full Android implementation
    **Feedback docs**: `feedback/feedback-chip-ios.md` (Kenya), `feedback/feedback-chip-android.md` (Data)
    - Lina: Fix all issues from findings
    - Kenya: Full production-quality review — document in `feedback-chip-ios.md`
    - Data: Full production-quality review — document in `feedback-chip-android.md`
    - Lina: Fix ALL issues found in feedback docs
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2, 5.5_

  - [ ] 3.7 Avatar Family (Avatar-Base)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina fixes, Kenya reviews full iOS implementation, Data reviews full Android implementation
    **Feedback docs**: `feedback/feedback-avatar-ios.md` (Kenya), `feedback/feedback-avatar-android.md` (Data)
    - Lina: Fix all issues from findings
    - Kenya: Full production-quality review — document in `feedback-avatar-ios.md`
    - Data: Full production-quality review — document in `feedback-avatar-android.md`
    - Lina: Fix ALL issues found in feedback docs
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2_

  - [ ] 3.8 Navigation Family (Nav-SegmentedChoice-Base, Nav-TabBar-Base)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina fixes, Kenya reviews full iOS implementation, Data reviews full Android implementation
    **Feedback docs**: `feedback/feedback-navigation-ios.md` (Kenya), `feedback/feedback-navigation-android.md` (Data)
    - Lina: Fix all issues from findings
    - Kenya: Full production-quality review — document in `feedback-navigation-ios.md`
    - Data: Full production-quality review — document in `feedback-navigation-android.md`
    - Lina: Fix ALL issues found in feedback docs
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2, 5.5_

  - [ ] 3.9 ProgressIndicator Family (Node-Base, Connector-Base, Label-Base, Pagination-Base, Stepper-Base, Stepper-Detailed)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina fixes, Kenya reviews full iOS implementation, Data reviews full Android implementation
    **Feedback docs**: `feedback/feedback-progress-ios.md` (Kenya), `feedback/feedback-progress-android.md` (Data)
    - Lina: Fix all issues from findings
    - Kenya: Full production-quality review — document in `feedback-progress-ios.md`
    - Data: Full production-quality review — document in `feedback-progress-android.md`
    - Lina: Fix ALL issues found in feedback docs
    - Verify: `npm test` passes
    - _Requirements: 5.1, 5.2, 5.5_

  - [ ] 3.10 Shared iOS utility extraction
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Extract `View.if` extension to shared iOS utility (or remove and inline)
    - Cross-family concern, handled after per-family fixes
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
