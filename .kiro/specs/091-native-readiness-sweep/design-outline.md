# Pre-Product Native Readiness Sweep — Design Outline

**Date**: 2026-03-31
**Updated**: 2026-04-03
**Author**: Thurgood
**Purpose**: Complete platform agent review of all iOS and Android implementations before product development begins
**Status**: Design Outline — Awaiting Kenya and Data review
**Activation**: Specs 088, 089, 090, 092 complete ✅

---

## Problem Statement

Lina implements all three platforms for every component. Kenya and Data's first reviews of native implementations (Spec 088) found 5 issues across 2 platform files — including a contract violation, a wrong material variant, and incomplete safe area handling.

The catalog has 34 components. Of these:
- **6 were reviewed by Kenya/Data during Spec 088/090 implementation** — issues found and fixed
- **28 have never been reviewed on iOS or Android**

Product development requires a clean foundation. Discovering native issues during screen implementation creates start-stop friction that compounds across multiple screens. This spec reviews all 28 unreviewed components before product development begins.

---

## Scope: Complete Health Check

All 28 unreviewed components get full Kenya (iOS) + Data (Android) review. No prioritization, no deferral — clean environment for product development.

Additionally:
- **6 components** affected by Spec 092 (sizing token migration) get quick render verification
- **Nav-TabBar-Base** gets a sanity check — `reviewed: true` pre-dates Kenya/Data agents

### Components Already Reviewed (Skip)

These were reviewed by Kenya and Data during Spec 088/090 implementation. Issues found and fixed. No re-review needed.

- Nav-Header-Base, Nav-Header-Page, Nav-Header-App (Spec 088)
- Progress-Bar-Base (Spec 090)

### Components to Review (28)

| Family | Components | Count |
|--------|-----------|-------|
| Container | Container-Base, Container-Card-Base | 2 |
| Button | Button-CTA, Button-Icon, Button-VerticalList-Item, Button-VerticalList-Set | 4 |
| Icon | Icon-Base | 1 |
| FormInput | Input-Text-Base, Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber, Input-Checkbox-Base, Input-Checkbox-Legal, Input-Radio-Base, Input-Radio-Set | 8 |
| Badge | Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base | 3 |
| Chip | Chip-Base, Chip-Filter, Chip-Input | 3 |
| Avatar | Avatar-Base | 1 |
| Navigation | Nav-SegmentedChoice-Base, Nav-TabBar-Base (sanity check) | 2 |
| ProgressIndicator | Progress-Indicator-Node-Base, Progress-Indicator-Connector-Base, Progress-Indicator-Label-Base, Progress-Pagination-Base, Progress-Stepper-Base, Progress-Stepper-Detailed | 6 |

---

## Review Checklist (Per Component)

Kenya and Data follow this procedure for each component. All referenced files are in the component directory at `src/components/core/{Component}/`.

### Step 1: Read the Contract

Open `contracts.yaml`. This defines what the component promises to do — visual states, interaction behavior, accessibility semantics, layout rules. Each contract has:
- **description**: What the behavior is
- **behavior**: Detailed specification (often platform-specific notes)
- **validation**: How to verify it
- **platforms**: Which platforms it applies to

Focus on contracts tagged with your platform (`ios` or `android`).

### Step 2: Read the Platform Implementation

Open `platforms/ios/{Component}.ios.swift` (Kenya) or `platforms/android/{Component}.android.kt` (Data).

### Step 3: Contract Compliance

For each contract in `contracts.yaml`:
- Does the implementation fulfill the described behavior?
- If the contract specifies platform-specific behavior, does the implementation match?

**Flag as blocking** if a contract is violated (e.g., missing accessibility semantics, wrong visual state).

### Step 4: Token-First Check

All visual values (colors, spacing, dimensions, border radius, motion) should come from tokens, not hard-coded values.

**What to look for:**
- ❌ Hard-coded: `48.dp`, `Color(0xFF...)`, `cornerRadius: 8`
- ✅ Token-driven: `DesignTokens.tap_area_recommended`, `DesignTokens.color_primary`, `DesignTokens.radius_normal`

**Exception**: Layout logic values (e.g., `weight(1f)`, `Spacer()`, `alignment: .center`) are not tokens — they're structural.

**Flag as blocking** if dimensional or color values are hard-coded instead of token references.

### Step 5: Platform Idioms

Is the code idiomatic for the platform?

**iOS (Kenya):**
- SwiftUI View protocol, `body` computed property
- `@State`, `@Binding`, `@Environment` used correctly
- VoiceOver: `.accessibilityLabel`, `.accessibilityAddTraits`, `.accessibilityValue`
- Safe area: handled where applicable
- No UIKit patterns in SwiftUI code

**Android (Data):**
- `@Composable` functions, not classes
- `Modifier` chain for styling
- TalkBack: `semantics { contentDescription }`, `heading()`, `progressBarRangeInfo`
- Material conventions respected where applicable
- No View system patterns in Compose code

**Flag as non-blocking** if code works but isn't idiomatic. Document for future cleanup.

### Step 6: Severity Classification

| Severity | Criteria | Action |
|----------|----------|--------|
| **Blocking** | Contract violation, missing accessibility, hard-coded tokens | Must fix before product development |
| **Non-blocking** | Non-idiomatic code, minor convention mismatches, documentation gaps | Document, fix later |

---

## Evidence from Spec 088

Common issue patterns Kenya and Data found — look for these across all components:

| Pattern | Example | Platform |
|---------|---------|----------|
| Wrong system API variant | `.thinMaterial` instead of `.systemThinMaterial` | iOS |
| Missing accessibility semantics | No `semantics { contentDescription }` on container | Android |
| Hard-coded dimensional values | `48.dp` instead of `DesignTokens.tap_area_recommended` | Android |
| Incomplete safe area handling | Background doesn't extend behind status bar | iOS |
| Duplicated utility extensions | `View.if` extension copied between files | iOS |
| Material component usage | `Divider` instead of token-driven `Box` | Android |

---

## Approach

### Phase 0: Grep Sweep (Kenya + Data, parallel)

Before per-component reviews, run mechanical pattern detection across all 28 implementations. Surfaces known bug patterns in minutes.

**iOS (Kenya):**

| Pattern | Detection | Severity |
|---------|----------|----------|
| `duration / 1000` | grep for `/ 1000` | Blocking |
| Wrong duration path | Should be `DesignTokens.Duration.duration150` | Blocking |
| `.thinMaterial` without `system` prefix | grep for `.thinMaterial` | Blocking |
| Duplicated `View.if` extension | grep for `func \`if\`` | Blocking |
| `.infinity` instead of `radiusFull` | grep for `cornerRadius: .infinity` | Non-blocking |
| Hard-coded `.easeInOut` | grep for `.easeInOut` | Non-blocking |

**Android (Data):**

| Pattern | Detection | Severity |
|---------|----------|----------|
| Hard-coded `.dp` values | grep for `\d+\.dp` without `DesignTokens` | Blocking |
| Material `Divider` usage | grep for `Divider(` | Non-blocking |
| Missing `semantics {}` on containers | cross-ref with contracts | Blocking |
| Hard-coded `Color(0x` | grep for `Color(0x` | Blocking |
| `tween()` without explicit easing | grep for `tween(` without `easing =` | Non-blocking |
| Double `.dp` on spacing tokens | grep for `space.*\.dp` | Blocking |

### Phase 1: Per-Component Review (Kenya + Data, parallel)

Kenya reviews all 28 iOS implementations. Data reviews all 28 Android implementations. Both work in parallel — no dependency between platforms. Family-order batching for context continuity.

Output per platform:
```
.kiro/specs/091-native-readiness-sweep/
  findings-ios.md       ← Kenya's consolidated iOS findings
  findings-android.md   ← Data's consolidated Android findings
```

Each file: cross-cutting patterns at top, per-component findings (blocking then non-blocking), summary table.

### Phase 2: Fix (Lina — sole owner)

**Lina owns all fixes.** Platform agents review only — they do not modify implementation code. This maintains clean ownership, prevents accountability ambiguity, and preserves reviewer objectivity.

Lina addresses all blocking issues. Non-blocking issues documented in `.kiro/issues/` for future cleanup. Lina can batch-fix by pattern (e.g., "add `semantics { contentDescription }` to all containers" as one pass).

### Escalation Path: Structural Issues

If Kenya or Data find a component whose layout approach is fundamentally wrong for the platform (not a token swap or accessibility addition — a re-implementation), the issue is escalated:

1. Flag as "structural" in findings doc
2. Leonardo assesses cross-platform impact
3. Peter decides: fix in this spec or defer to a dedicated spec
4. If fixed here, Lina re-implements with Kenya/Data review (same as Spec 088 pattern)

### Phase 3: Verify and Update Readiness

- Lina updates `reviewed: true` on fixed/verified platforms in each component's schema.yaml
- Readiness compliance test (Spec 086 Task 2.3) validates the transitions
- Components with all artifacts + reviewed derive `production-ready`

---

## Success Criteria

1. Kenya reviews all 28 iOS implementations
2. Data reviews all 28 Android implementations
3. All blocking issues fixed by Lina
4. Spec 092 token migration verified on native platforms (zero visual change confirmed)
5. Nav-TabBar-Base sanity check complete
6. All reviewed components show `reviewed: true` on iOS and Android
7. Readiness compliance test passes

---

## Risk Assessment

**Medium risk, high value.** 28 components × 2 platforms = 56 reviews. If the Spec 088 issue rate holds (~2.5 issues per file), we're looking at ~140 potential issues. Mitigation:
- Blocking issues only — non-blocking documented, not fixed
- Lina fixes are targeted (token swaps, accessibility additions) — not refactors
- The review checklist standardizes the process — Kenya and Data don't need to invent their approach per component

---

## Questions for Kenya and Data

1. Is the review checklist (Steps 1–6) sufficient guidance, or do you need more context on contracts, tokens, or the Stemma architecture?
2. Would example reviews help? (The Spec 088 feedback doc has Kenya's iOS review and Data's Android review of Nav-Header-Base as reference.)
3. How would you prefer to organize the output — one issue doc per component, one doc per platform, or a single consolidated findings doc?
4. Estimated effort — can you review ~28 implementations in a reasonable timeframe, or should we batch (e.g., 10 per session)?
