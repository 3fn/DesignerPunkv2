# Requirements Document: Pre-Product Native Readiness Sweep

**Date**: 2026-04-03
**Spec**: 091 - Native Readiness Sweep
**Status**: Requirements Phase
**Dependencies**: Specs 088, 089, 090, 092 (all complete)

---

## Introduction

28 of 34 components have never been reviewed on iOS or Android by platform agents. Evidence from Spec 088 shows ~2.5 issues per file on first review, including contract violations, wrong API variants, and hard-coded values. This spec reviews all 28 unreviewed components before product development begins.

---

## Requirements

### Requirement 1: Mechanical Pattern Detection (Phase 0)

**User Story**: As a platform reviewer, I want known bug patterns detected mechanically before per-component review, so that I can focus deeper review time on contract compliance and platform idioms.

#### Acceptance Criteria

1. Kenya SHALL run grep-based detection for known iOS bug patterns across all 28 `.ios.swift` files
2. Data SHALL run grep-based detection for known Android bug patterns across all 28 `.android.kt` files
3. Detected issues SHALL be classified as blocking or non-blocking per the severity table in the design outline
4. Phase 0 findings SHALL be included in the consolidated findings docs
5. The known-pattern detection list SHALL be maintained in the findings docs and updated when new cross-cutting patterns are discovered during review

### Requirement 2: iOS Implementation Review

**User Story**: As a product development team, I want every iOS implementation reviewed against contracts and platform conventions, so that native issues don't block screen implementation.

#### Acceptance Criteria

1. Kenya SHALL review all 28 iOS implementations against their `contracts.yaml`
2. Each review SHALL verify: contract compliance, token-first usage (no hard-coded visual values), VoiceOver accessibility semantics, SwiftUI idioms, safe area handling where applicable
3. Issues SHALL be classified as blocking (contract violation, missing accessibility, hard-coded tokens) or non-blocking (non-idiomatic code, minor convention mismatches)
4. Findings SHALL be documented in `findings-ios.md` with cross-cutting patterns at top, per-component findings below, and summary table
5. Nav-TabBar-Base SHALL receive a sanity check despite `reviewed: true` — it pre-dates Kenya as an agent

### Requirement 3: Android Implementation Review

**User Story**: As a product development team, I want every Android implementation reviewed against contracts and platform conventions, so that native issues don't block screen implementation.

#### Acceptance Criteria

1. Data SHALL review all 28 Android implementations against their `contracts.yaml`
2. Each review SHALL verify: contract compliance, token-first usage (no hard-coded visual values), TalkBack accessibility semantics, Compose idioms (including recomposition safety — side effects in `LaunchedEffect`/`SideEffect`, mutable state in `remember`, no expensive operations on recomposition), Material convention alignment
3. Issues SHALL be classified as blocking or non-blocking per the same criteria as iOS
4. Findings SHALL be documented in `findings-android.md` with cross-cutting patterns at top, per-component findings below, and summary table
5. Nav-TabBar-Base SHALL receive a sanity check despite `reviewed: true` — it pre-dates Data as an agent

### Requirement 4: Spec 092 Token Migration Verification

**User Story**: As a product development team, I want the sizing token migration verified on native platforms, so that "zero visual change by design" is confirmed as "zero visual change in practice."

#### Acceptance Criteria

1. Kenya SHALL verify that the 6 components affected by Spec 092 (Button-Icon, Progress-Node, Avatar-Base, Input-Checkbox-Base, Input-Radio-Base, Nav-TabBar-Base) render correctly on iOS after the spacing→sizing token swap
2. Data SHALL verify the same 6 components render correctly on Android
3. This is a quick render verification, not a full review — the full review covers these components separately

### Requirement 5: Fix Ownership and Process

**User Story**: As a governance specialist, I want clear ownership boundaries between review and fix, so that accountability is unambiguous and reviewer objectivity is preserved.

#### Acceptance Criteria

1. Lina SHALL own all fixes — platform agents SHALL NOT modify implementation code
2. Lina SHALL address all blocking issues before product development begins
3. Non-blocking issues SHALL be documented in `.kiro/issues/` for future cleanup
4. WHEN a structural issue is found (fundamentally wrong layout approach, not a targeted fix) THEN it SHALL be escalated: flagged in findings → Leonardo assesses cross-platform impact → Peter decides fix-now or defer
5. Lina MAY batch-fix by pattern when the same issue appears across multiple components

### Requirement 6: Readiness Flag Updates

**User Story**: As a readiness model consumer, I want reviewed components to show `reviewed: true` on their platform, so that the readiness model accurately reflects which components have been verified by platform specialists.

#### Acceptance Criteria

1. WHEN a component passes review (all blocking issues fixed) THEN Lina SHALL update `reviewed: true` for that platform in the component's `schema.yaml`
2. The readiness compliance test (Spec 086 Task 2.3) SHALL pass after all updates
3. Components with all artifacts present + `reviewed: true` SHALL derive `production-ready` status
4. Components with blocking issues that cannot be fixed in this spec SHALL remain at their current readiness level with the issue documented

### Documentation Requirements Waiver

This spec is a review and fix sweep, not new component or token development. No new consumer-facing artifacts are created. Standard component documentation requirements are not applicable.
