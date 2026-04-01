# Pre-Product Native Readiness Sweep — Design Outline

**Date**: 2026-03-31
**Author**: Thurgood
**Purpose**: Systematic platform agent review of iOS and Android implementations before product development begins
**Status**: Design Outline — Draft
**Activation**: After Specs 088 (Nav-Header-Base) and 090 (Linear Progress Bar) are complete

---

## Problem Statement

Lina implements all three platforms for every component. Kenya and Data's first reviews of native implementations (Spec 088, Tasks 1.3/1.4) found 5 issues across 2 platform files — including a contract violation, a wrong material variant, and incomplete safe area handling. These are the kinds of issues that would block product development if discovered during screen implementation.

Currently, most components have `reviewed: false` on iOS and Android (honest — Lina hasn't verified native rendering). If product development starts without a review pass, Leonardo's screen specs will reference components that may have undiscovered native issues. Platform agents will hit these during implementation, causing start-stop friction across multiple screens.

---

## Approach

A prioritized review sweep — not all 30 components, but the subset most likely to appear in early product screens.

### Step 1: Leonardo Identifies Priority Components

Leonardo reviews the gap report, his research scenarios, and the component catalog to identify which components he expects to use in the first 3-5 product screens. This becomes the review set.

**Expected high-priority components** (based on gap report research and common screen patterns):
- Container-Base, Container-Card-Base (every screen)
- Button-CTA, Button-Icon (every screen)
- Icon-Base (every screen)
- Nav-Header-Page, Nav-TabBar-Base (app shell)
- Input-Text-Base, Input-Text-Email, Input-Text-Password (forms)
- Badge-Count-Base, Badge-Count-Notification (notifications)

Leonardo may add or remove from this list based on actual product plans.

### Step 2: Kenya Reviews iOS Implementations

For each component in the priority set:
- Review the `.ios.swift` implementation against contracts and schema
- Flag issues by severity (blocking vs non-blocking)
- Verify safe area handling, VoiceOver semantics, SwiftUI idioms
- Check token usage (token-first, correct references)

### Step 3: Data Reviews Android Implementations

For each component in the priority set:
- Review the `.android.kt` implementation against contracts and schema
- Flag issues by severity (blocking vs non-blocking)
- Verify TalkBack semantics, Compose idioms, Material convention alignment
- Check token usage (token-first, correct references)

### Step 4: Lina Fixes Issues

Lina addresses blocking issues. Non-blocking issues documented for future cleanup.

### Step 5: Readiness Flags Updated

Components that pass review get `reviewed: true` on the reviewed platform. The readiness model (Spec 086) automatically derives `production-ready` status for components with all artifacts + reviewed flag.

---

## Scope

### In Scope
- Leonardo's priority component identification
- Kenya iOS review of priority set
- Data Android review of priority set
- Lina fixes for blocking issues
- Readiness flag updates for reviewed components

### Out of Scope
- Web implementation review (Lina's strongest platform, no issues found in any review)
- Review of non-priority components (deferred to product-driven need)
- New component development
- Behavioral contract changes (unless review reveals contract violations)

---

## Success Criteria

1. Leonardo's priority component set identified and documented
2. Kenya reviews all iOS implementations in the priority set
3. Data reviews all Android implementations in the priority set
4. All blocking issues fixed
5. Priority components show `reviewed: true` on iOS and Android
6. Priority components derive `production-ready` on platforms where all artifacts exist + reviewed

---

## Evidence from Spec 088

| Platform | Issues Found | Severity |
|----------|-------------|----------|
| iOS (Kenya) | Wrong material variant, incomplete safe area, duplicated extension | 1 bug, 2 structural |
| Android (Data) | No TalkBack landmark, hard-coded dp value | 2 blocking |

5 issues in 2 files. Pattern: Lina's implementations are structurally sound but miss platform-specific conventions and contract compliance details that platform agents catch immediately.

---

## Risk Assessment

**Low risk, high value.** The review is read-only analysis + targeted fixes. No architectural changes, no new components, no migration. The main risk is scope creep — Kenya or Data finding issues that cascade into larger refactors. Mitigation: blocking issues only. Non-blocking issues documented, not fixed in this spec.

---

## Relationship to Readiness Model

This spec is the first systematic use of the readiness model (Spec 086 Task 2) for its intended purpose — moving components from `development` (artifacts present, not reviewed) to `production-ready` (artifacts present, reviewed). The compliance test validates the transition.
