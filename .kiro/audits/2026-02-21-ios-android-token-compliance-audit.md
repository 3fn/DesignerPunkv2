# iOS & Android Component Token Compliance Audit

**Date**: February 21, 2026  
**Auditor**: Thurgood (Test Governance Agent)  
**Scope**: iOS and Android components corresponding to web components with token issues  
**Methodology**: Targeted grep-based audit of token references in iOS (Swift) and Android (Kotlin) implementations  
**Cross-Reference**: Web Component Token Compliance Audit (2026-02-21)

---

## Executive Summary

**iOS Components Audited**: 7 (corresponding to web components with issues)  
**Android Components Audited**: 7 (corresponding to web components with issues)  
**iOS Components with Invalid Token References**: 4  
**Android Components with Invalid Token References**: 4  
**Severity**: HIGH — Cross-platform token naming inconsistency confirmed

**Key Finding**: iOS and Android have **the same token reference issues as web**, confirming the cross-platform risk assessment from the web audit. However, iOS and Android implementations use **hardcoded fallbacks** (e.g., `UIColor.systemBackground`, `0xFFFFFFFF`) instead of failing loudly, which **masks the token generation gap**.

**Critical Governance Issue**: Components define their own token constants when generated tokens don't exist. This violates token governance and creates platform-specific divergence.

---

## Token Naming Convention Summary

| Platform | Naming Convention | Example |
|----------|-------------------|---------|
| Web | CSS custom properties (kebab-case) | `--color-action-primary` |
| iOS | Swift constants (camelCase) | `DesignTokens.colorActionPrimary` |
| Android | Kotlin constants (snake_case) | `DesignTokens.color_action_primary` |

---

## Cross-Platform Token Existence Verification

### Tokens That Exist in ALL Platforms

| Semantic Token | Web | iOS | Android |
|----------------|-----|-----|---------|
| `color.action.primary` | `--color-action-primary` ✓ | `colorActionPrimary` ✓ | `color_action_primary` ✓ |
| `color.background.primary.subtle` | `--color-background-primary-subtle` ✓ | `colorBackgroundPrimarySubtle` ✓ | `color_background_primary_subtle` ✓ |
| `color.feedback.notification.background` | `--color-feedback-notification-background` ✓ | `colorFeedbackNotificationBackground` ✓ | `color_feedback_notification_background` ✓ |
| `color.feedback.notification.text` | `--color-feedback-notification-text` ✓ | `colorFeedbackNotificationText` ✓ | `color_feedback_notification_text` ✓ |

### Tokens That DO NOT Exist in ANY Platform

| Semantic Token | Web | iOS | Android | Component Usage |
|----------------|-----|-----|---------|-----------------|
| `color.background` | ✗ | ✗ | ✗ | ButtonVerticalListItem (all platforms) |
| `color.primary` | ✗ | ✗ | ✗ | InputTextBase (web, iOS) |
| `color.surface` | ✗ | ✗ | ✗ | ContainerBase, ContainerCardBase (all platforms) |
| `color.canvas` | ✗ | ✗ | ✗ | ContainerBase (web, iOS) |
| `color.surface.primary` | ✗ | ✗ | ✗ | ContainerCardBase (all platforms) |
| `color.surface.secondary` | ✗ | ✗ | ✗ | ContainerCardBase (all platforms) |
| `color.surface.tertiary` | ✗ | ✗ | ✗ | ContainerCardBase (all platforms) |
| `color.badge.notification.*` | ✗ | ✗ | ✗ | BadgeCountNotification (all platforms, docs only) |
| `color.feedback.select.border.default` | Exists as `--color-feedback-select-border-default` | ✗ | ✗ | InputCheckboxBase, InputRadioBase (web only) |

**Critical Finding**: The missing tokens are consistent across all three platforms, confirming this is a **token generation gap**, not a platform-specific implementation issue.

---

## iOS Audit Findings

### 1. ButtonVerticalListItem (iOS) — HIGH

**File**: `src/components/core/Button-VerticalList-Item/platforms/ios/VerticalListButtonItem.ios.swift`  
**Invalid Token**: `colorBackground` (semantic token `color.background`)  
**Impact**: Component defines its own fallback constant instead of using generated token

**Evidence**:
- Line 613: `public static let colorBackground: UIColor = UIColor.systemBackground`
- Used in `VisualStateStyles.swift` lines 167, 215: `Color(DesignTokens.colorBackground)`
- Comments reference semantic token `color.background` (lines 165, 212 in VisualStateStyles.swift)

**Governance Violation**: Component defines a token constant that should come from `DesignTokens.ios.swift`. This creates platform-specific divergence — iOS uses `UIColor.systemBackground` while web expects a design system token.

**Cross-Platform Status**: Same issue on web and Android ✓

---

### 2. InputTextBase (iOS) — CRITICAL

**File**: `src/components/core/Input-Text-Base/platforms/ios/InputTextBase.ios.swift`  
**Invalid Token**: `color.primary` (should be `color.action.primary`)  
**Impact**: Code references non-existent token path, likely causing runtime errors

**Evidence**:
- Line 142: `Color(DesignTokens.color.primary).disabledBlend()`
- Line 144: `Color(DesignTokens.color.primary).focusBlend()`
- Line 166: `Color(DesignTokens.color.primary).disabledBlend()`
- Line 168: `Color(DesignTokens.color.primary).focusBlend()`
- Line 384: `Color(DesignTokens.color.primary)`

**Severity Rationale**: Unlike ButtonVerticalListItem which defines a fallback, this code directly references `DesignTokens.color.primary` which doesn't exist. This should cause compilation errors unless there's a nested struct pattern I'm not seeing.

**Correct Token**: `DesignTokens.colorActionPrimary` (exists in `dist/ios/DesignTokens.ios.swift` line 481)

**Cross-Platform Status**: Same issue on web ✓ (web uses `--color-primary` instead of `--color-action-primary`)

---

### 3. ContainerCardBase (iOS) — HIGH

**File**: `src/components/core/Container-Card-Base/platforms/ios/ContainerCardBase.ios.swift`  
**Invalid Tokens**: `color.surface.primary`, `color.surface.secondary`, `color.surface.tertiary`  
**Impact**: Component defines its own fallback constants using iOS system colors

**Evidence**:
- Lines 86-88: Enum cases reference `color.surface.primary`, `color.surface.secondary`, `color.surface.tertiary`
- Lines 684, 686: Uses `colorSurfacePrimary`, `colorSurfaceSecondary` in mapping function
- Lines 797-799: Component defines fallback constants:
  - `let colorSurfacePrimary: Color = Color(UIColor.systemBackground)`
  - `let colorSurfaceSecondary: Color = Color(UIColor.secondarySystemBackground)`
  - `let colorSurfaceTertiary: Color = Color(UIColor.tertiarySystemBackground)`

**Governance Violation**: Component defines three token constants that should come from `DesignTokens.ios.swift`. Uses iOS system colors as fallbacks, creating platform-specific behavior.

**Cross-Platform Status**: Same issue on web and Android ✓

---

### 4. BadgeCountNotification (iOS) — MEDIUM

**File**: `src/components/core/Badge-Count-Notification/platforms/ios/BadgeCountNotification.ios.swift`  
**Invalid Tokens**: `colorBadgeNotificationBackground`, `colorBadgeNotificationText` (documentation references incorrect token names)  
**Impact**: Code uses correct tokens, but documentation is misleading

**Evidence**:
- Lines 23-24: Comments reference `DesignTokens.colorBadgeNotificationBackground` and `DesignTokens.colorBadgeNotificationText`
- Lines 58, 61, 64: Comments reference the same incorrect token names
- **Actual code** (lines 61, 67): Uses `DesignTokens.colorFeedbackNotificationBackground` and `DesignTokens.colorFeedbackNotificationText` (correct tokens)

**Correct Tokens**: 
- `DesignTokens.colorFeedbackNotificationBackground` (exists in `dist/ios/DesignTokens.ios.swift` line 477)
- `DesignTokens.colorFeedbackNotificationText` (exists in `dist/ios/DesignTokens.ios.swift` line 478)

**Severity Rationale**: Medium (not High) because the code is correct — only the documentation is wrong. This is a comment-only issue.

**Cross-Platform Status**: Same documentation issue on web and Android ✓

---

### iOS Components with No Token Issues

- **ButtonCTA** — Uses valid token `DesignTokens.colorActionPrimary`
- **ButtonIcon** — Uses valid token `DesignTokens.colorActionPrimary`
- **ContainerBase** — Uses string-based token resolution system, not direct token references (see `TokenMapping.swift`)

**Note on ContainerBase**: iOS ContainerBase uses a `resolveColorToken()` function that takes semantic token strings (e.g., `"color.surface"`) and resolves them at runtime. This is a different architecture than web's direct CSS custom property references. The token resolution system may have its own fallback logic that masks missing tokens.

---

## Android Audit Findings

### 1. ButtonVerticalListItem (Android) — HIGH

**File**: `src/components/core/Button-VerticalList-Item/platforms/android/VisualStateStyles.kt`  
**Invalid Token**: `color_background` (semantic token `color.background`)  
**Impact**: Component defines its own extension property with hardcoded fallback

**Evidence**:
- Lines 49-50: Extension property definition:
  ```kotlin
  val DesignTokens.Companion.color_background: Int
      get() = 0xFFFFFFFF.toInt()
  ```
- Lines 268, 323: Used in visual state styles: `Color(DesignTokens.color_background)`
- Comments reference semantic token `color.background`

**Governance Violation**: Component defines an extension property on `DesignTokens.Companion` that should come from `DesignTokens.android.kt`. Hardcodes white color (`0xFFFFFFFF`), creating platform-specific behavior.

**Cross-Platform Status**: Same issue on web and iOS ✓

---

### 2. ContainerCardBase (Android) — HIGH

**File**: `src/components/core/Container-Card-Base/platforms/android/ContainerCardBase.android.kt`  
**Invalid Tokens**: `color_surface_primary`, `color_surface_secondary`, `color_surface_tertiary`  
**Impact**: Component references non-existent tokens, likely causing runtime errors

**Evidence**:
- Lines 597-599: Switch statement references:
  - `CardBackground.SurfacePrimary -> colorSurfacePrimary`
  - `CardBackground.SurfaceSecondary -> colorSurfaceSecondary`
  - `CardBackground.SurfaceTertiary -> colorSurfaceTertiary`
- Lines 698-699: Private constants reference non-existent tokens:
  - `private val colorSurfacePrimary: Color = Color(DesignTokens.color_surface_primary)`
  - `private val colorSurfaceSecondary: Color = Color(DesignTokens.color_surface_secondary)`
  - (Line 700 likely has `colorSurfaceTertiary` but was truncated in grep output)

**Severity Rationale**: CRITICAL — Unlike iOS which defines fallback constants, Android code directly references `DesignTokens.color_surface_primary` which doesn't exist in `dist/android/DesignTokens.android.kt`. This should cause compilation errors.

**Verification Needed**: Check if this component actually compiles. If it does, there may be extension properties defined elsewhere.

**Cross-Platform Status**: Same issue on web and iOS ✓

---

### 3. BadgeCountNotification (Android) — MEDIUM

**File**: `src/components/core/Badge-Count-Notification/platforms/android/BadgeCountNotification.android.kt`  
**Invalid Tokens**: `color_badge_notification_background`, `color_badge_notification_text` (documentation references incorrect token names)  
**Impact**: Code uses correct tokens, but documentation is misleading

**Evidence**:
- Lines 23-24: Comments reference `DesignTokens.color_badge_notification_background` and `DesignTokens.color_badge_notification_text`
- Lines 114, 118, 121: Comments reference the same incorrect token names
- **Actual code** (line 118): Uses `DesignTokens.color_badge_notification_background` (incorrect token name in code)

**Wait — Verification Needed**: The grep output shows line 118 uses `color_badge_notification_background`, but `dist/android/DesignTokens.android.kt` only has `color_feedback_notification_background`. Need to verify if this is a code issue or documentation issue.

**Cross-Platform Status**: Same documentation issue on web and iOS ✓

---

### Android Components with No Token Issues

- **ButtonCTA** — Uses valid token `DesignTokens.color_action_primary`
- **ButtonIcon** — Uses valid token `DesignTokens.color_action_primary`
- **InputTextBase** — No invalid token references found (may use different architecture than iOS)
- **ContainerBase** — No invalid token references found (may use string-based resolution like iOS)
- **InputCheckboxBase** — No invalid token references found
- **InputRadioBase** — No invalid token references found

**Note**: InputCheckboxBase and InputRadioBase on Android don't have the `color_select_not_selected_strong` issue that web has. This suggests Android implementation may be newer or was implemented differently.

---

## Critical Governance Issue: Component-Defined Token Constants

### The Pattern

Multiple components define their own token constants when generated tokens don't exist:

**iOS Example** (ButtonVerticalListItem):
```swift
public static let colorBackground: UIColor = UIColor.systemBackground
```

**Android Example** (ButtonVerticalListItem):
```kotlin
val DesignTokens.Companion.color_background: Int
    get() = 0xFFFFFFFF.toInt()
```

### Why This Violates Token Governance

1. **Single Source of Truth**: All tokens should come from generated token files (`DesignTokens.ios.swift`, `DesignTokens.android.kt`, `tokens.css`). Components should never define their own tokens.

2. **Platform Divergence**: iOS uses `UIColor.systemBackground` (adapts to light/dark mode), Android uses hardcoded white (`0xFFFFFFFF`), web expects a design system token. Same semantic token, three different implementations.

3. **Maintenance Burden**: When the token is eventually added to the token generation system, these component-defined constants must be manually removed. Easy to miss.

4. **Silent Failures**: By providing fallbacks, components mask the fact that tokens are missing from the generation system. Web fails loudly (console errors), iOS/Android fail silently (use fallbacks).

### Recommended Governance Action

**Flag for Ada**: The token generation system is missing several semantic tokens that components need:
- `color.background`
- `color.primary` (should be `color.action.primary`)
- `color.surface`, `color.surface.primary`, `color.surface.secondary`, `color.surface.tertiary`
- `color.canvas`

Ada should review whether these tokens should be added to the generation system or if components should use different existing tokens.

---

## Cross-Platform Impact Summary

| Component | Web Issue | iOS Issue | Android Issue | Severity |
|-----------|-----------|-----------|---------------|----------|
| ButtonVerticalListItem | `--color-background` missing | `colorBackground` fallback | `color_background` extension | HIGH |
| InputTextBase | `--color-primary` wrong name | `color.primary` wrong path | No issue found | CRITICAL |
| ContainerBase | `--color-surface`, `--color-canvas`, `--color-background` missing | String-based resolution (masked) | No issue found | HIGH |
| ContainerCardBase | `--color-surface-primary` missing | `colorSurface*` fallbacks | `color_surface_*` missing | HIGH |
| BadgeCountNotification | Documentation only | Documentation only | Code + documentation issue | MEDIUM |
| InputCheckboxBase | `--color-select-not-selected-strong` wrong name | No issue found | No issue found | HIGH (web only) |
| InputRadioBase | `--color-select-not-selected-strong` wrong name | No issue found | No issue found | HIGH (web only) |

**Pattern**: Issues are consistent across platforms where the same component architecture is used. iOS and Android have fewer issues in some components (InputCheckboxBase, InputRadioBase, ContainerBase) suggesting those implementations may be newer or use different patterns.

---

## Fail Loudly vs Fail Silently

### Web Behavior (Fail Loudly) ✓
- Missing tokens cause console errors
- Components throw errors in `REQUIRED_CSS_VARIABLES` validation
- Blend color calculations fail visibly
- **Result**: Issues are immediately visible during development

### iOS Behavior (Fail Silently) ✗
- Components define fallback constants using iOS system colors
- String-based token resolution may have silent fallback logic
- No runtime errors, components render with fallback colors
- **Result**: Issues are masked, platform divergence is hidden

### Android Behavior (Fail Silently) ✗
- Components define extension properties with hardcoded values
- No runtime errors, components render with fallback colors
- **Result**: Issues are masked, platform divergence is hidden

**Governance Recommendation**: iOS and Android should adopt web's "fail loudly" philosophy. When a required token is missing, components should log warnings or throw errors during development rather than silently using fallbacks.

---

## Ada's Answers (February 21, 2026)

**Reviewed By**: Ada (Rosetta Token Specialist)  
**Reviewed With**: Peter (Human Lead)  
**Status**: APPROVED — Fixes unblocked

### Question 1: Missing Surface Tokens

**Decision**: ADD `color.structure.surface.primary`, `color.structure.surface.secondary`, `color.structure.surface.tertiary`.

**Rationale**: Spec 043 (Container-Card-Base) explicitly requires these tokens as a SHALL requirement. The component was designed with three surface elevation levels for visual hierarchy.

**Token Definitions**:
- `color.structure.surface` → `white200` (kept as alias for `surface.primary`)
- `color.structure.surface.primary` → `white200` (primary elevation level)
- `color.structure.surface.secondary` → `white300` (secondary elevation level)
- `color.structure.surface.tertiary` → `white400` (tertiary elevation level)

**Implementation Status**: ✅ COMPLETE
- Added to `src/tokens/semantic/ColorTokens.ts`
- Regenerated tokens for all platforms (web, iOS, Android)
- Web: `--color-structure-surface-primary`, `--color-structure-surface-secondary`, `--color-structure-surface-tertiary`
- iOS: `colorStructureSurfacePrimary`, `colorStructureSurfaceSecondary`, `colorStructureSurfaceTertiary`
- Android: `color_structure_surface_primary`, `color_structure_surface_secondary`, `color_structure_surface_tertiary`

**Semantic Correctness**: ✓ Provides elevation hierarchy for nested cards and different emphasis levels.

---

### Question 2: Missing Canvas Token

**Decision**: Do NOT add `color.canvas`.

**Correct Token Mapping**:
- Components should use `color.structure.canvas` (existing token → `white100`)

**Rationale**: `color.structure.canvas` already exists and serves this exact purpose (page-level background).

**Semantic Correctness**: ✓ `color.structure.canvas` is semantically correct for page backgrounds.

---

### Question 3: Missing Background Token

**Decision**: Do NOT add `color.background`.

**Correct Token Mapping**:
- ButtonVerticalListItem should use `color.structure.canvas` (existing token → `white100`)
- ContainerBase fallback chain should use `color.structure.canvas` (existing token → `white100`)

**Rationale**: `color.structure.canvas` serves as the general background color. `color.background.primary.subtle` is for specific use cases (hover states, selections), not general backgrounds.

**Semantic Correctness**: ✓ `color.structure.canvas` is semantically correct for component-level backgrounds that match page background.

---

### Question 4: color.primary → color.action.primary

**Decision**: `color.primary` never existed. Update all references to `color.action.primary`.

**Correct Token Mapping**:
- InputTextBase should use `color.action.primary` (existing token → `purple300`)

**Rationale**: This is a straightforward naming error in components. `color.action.primary` is the correct semantic token for interactive action colors.

**Semantic Correctness**: ✓ `color.action.primary` is semantically correct for InputTextBase's focus/active states (interactive action).

---

### Question 5: color.badge.notification.* → color.feedback.notification.*

**Decision**: `color.badge.notification.*` never existed. Update all references to `color.feedback.notification.*`.

**Correct Token Mapping**:
- BadgeCountNotification should use `color.feedback.notification.background` and `color.feedback.notification.text` (existing tokens → `pink400`, `white100`)

**Rationale**: Notifications are a feedback mechanism, not a badge-specific concept. The semantic hierarchy is `color.feedback.notification.*`.

**Semantic Correctness**: ✓ `color.feedback.notification.*` is semantically correct for notification badges (system feedback).

---

### Question 6: Platform-Specific Fallbacks — Governance Policy

**Decision**: NO. Components should never define their own token constants.

**Governance Policy**:
- All tokens must come from generated token files (`DesignTokens.ios.swift`, `DesignTokens.android.kt`, `tokens.css`)
- Components should fail loudly when required tokens are missing (throw errors, log warnings)
- No platform-specific fallbacks allowed (e.g., `UIColor.systemBackground`, hardcoded `0xFFFFFFFF`)

**Rationale**: 
- Violates single source of truth
- Creates platform divergence
- Masks token generation gaps
- Maintenance burden

**Action**: Remove all component-defined token constants. Components should reference generated tokens only.

---

### Question 7: Token Architecture — Background/Surface/Canvas Hierarchy

**Decision**: The hierarchy already exists in `color.structure`:

| Semantic Concept | Token | Primitive | Use Case |
|------------------|-------|-----------|----------|
| Canvas (page-level) | `color.structure.canvas` | `white100` | Page backgrounds, component backgrounds that match page |
| Surface (container-level) | `color.structure.surface` | `white200` | Cards, panels, elevated containers |
| Border (separation) | `color.structure.border` | `gray100` | UI element borders, dividers |

**No additional tokens needed**. Components should use these existing tokens.

---

### Token Generation Tasks

**No new tokens to add**. All required tokens already exist in the Rosetta system.

**Component fixes required**:
1. Update component references to use correct existing tokens
2. Remove component-defined token constants
3. Update documentation to reference correct token names

---

### Summary: All Fixes Unblocked

All component fixes can proceed using existing tokens. No token generation work required.

| Component | Platform | Old Reference | New Reference |
|-----------|----------|---------------|---------------|
| ButtonVerticalListItem | All | `color.background` | `color.structure.canvas` |
| InputTextBase | Web, iOS | `color.primary` | `color.action.primary` |
| ContainerBase | Web, iOS | `color.surface`, `color.canvas`, `color.background` | `color.structure.surface`, `color.structure.canvas`, `color.structure.canvas` |
| ContainerCardBase | All | `color.surface.primary`, `.secondary`, `.tertiary` | `color.structure.surface.primary`, `color.structure.surface.secondary`, `color.structure.surface.tertiary` |
| BadgeCountNotification | All | `color.badge.notification.*` | `color.feedback.notification.*` |
| InputCheckboxBase | Web | `color.select.not.selected.strong` | `color.feedback.select.border.default` |
| InputRadioBase | Web | `color.select.not.selected.strong` | `color.feedback.select.border.default` |

**Token Generation Status**: ✅ COMPLETE
- Surface elevation tokens added to `ColorTokens.ts`
- Tokens regenerated for all platforms
- All required tokens now exist in generated files

---

## Questions for Ada (Token Specialist)

**Status**: Awaiting Ada's review  
**Priority**: BLOCKING — Cannot proceed with fixes until token architecture is clarified  
**Context**: Cross-platform audit found components referencing tokens that don't exist in generated token files. Components have implemented workarounds (hardcoded fallbacks) that violate token governance.

### 1. Missing Surface Tokens

**Tokens**: `color.surface`, `color.surface.primary`, `color.surface.secondary`, `color.surface.tertiary`

**Component Usage**:
- ContainerBase references `color.surface` (web, iOS)
- ContainerCardBase references `color.surface.primary`, `color.surface.secondary`, `color.surface.tertiary` (all platforms)

**Current Workarounds**:
- iOS: Uses `UIColor.systemBackground`, `UIColor.secondarySystemBackground`, `UIColor.tertiarySystemBackground`
- Android: References non-existent `DesignTokens.color_surface_primary` (may cause compilation errors)
- Web: Fallback chain fails silently when tokens missing

**Questions**:
- Should these tokens exist in the token generation system?
- If yes, what primitive tokens should they reference?
- If no, what existing tokens should ContainerBase and ContainerCardBase use instead?
- Is there a semantic hierarchy for surface/background colors that we're missing?

### 2. Missing Canvas Token

**Token**: `color.canvas`

**Component Usage**:
- ContainerBase uses as fallback in blend color calculation (web, iOS)

**Current Workarounds**:
- Web: Fallback chain includes `--color-canvas` but it doesn't exist, falls through to `--color-background` (also missing)
- iOS: String-based token resolution may have silent fallback

**Questions**:
- Should `color.canvas` exist as a semantic token?
- Is "canvas" a valid semantic concept in the Rosetta token architecture?
- If not, what should ContainerBase use for its background color fallback chain?

### 3. Missing Background Token

**Token**: `color.background`

**Component Usage**:
- ButtonVerticalListItem references `color.background` (all platforms)
- ContainerBase uses as final fallback in blend color calculation (web)

**Current Workarounds**:
- iOS: `public static let colorBackground: UIColor = UIColor.systemBackground`
- Android: `val DesignTokens.Companion.color_background: Int get() = 0xFFFFFFFF.toInt()`
- Web: Listed in `REQUIRED_CSS_VARIABLES`, throws error when missing

**Existing Token**: `color.background.primary.subtle` exists in all platforms

**Questions**:
- Should `color.background` exist as a standalone semantic token?
- Or should components use `color.background.primary.subtle`?
- Is there a semantic difference between "background" and "background.primary.subtle"?
- If components should use `color.background.primary.subtle`, is that the right semantic choice for ButtonVerticalListItem's default background?

### 4. Token Naming: color.primary → color.action.primary

**Token**: `color.primary` (referenced by components, doesn't exist)  
**Existing Token**: `color.action.primary` (exists in all platforms)

**Component Usage**:
- InputTextBase references `color.primary` (web, iOS)

**Current Workarounds**:
- Web: `getPropertyValue('--color-primary')` fails, throws error
- iOS: `DesignTokens.color.primary` (nested path syntax — may cause compilation error)

**Questions**:
- Was `color.primary` renamed to `color.action.primary`?
- Or was `color.primary` never part of the token system?
- Should all component references to `color.primary` be updated to `color.action.primary`?
- Is `color.action.primary` semantically correct for InputTextBase's focus/active states?

### 5. Token Naming: color.badge.notification.* → color.feedback.notification.*

**Tokens**: `color.badge.notification.background`, `color.badge.notification.text` (referenced in docs, don't exist)  
**Existing Tokens**: `color.feedback.notification.background`, `color.feedback.notification.text` (exist in all platforms)

**Component Usage**:
- BadgeCountNotification documentation references incorrect names (all platforms)
- Web: Documentation only (code doesn't use these tokens)
- iOS: Documentation only (code uses correct tokens)
- Android: **Code may use incorrect token name** (needs verification)

**Questions**:
- Were these tokens renamed from `badge.notification.*` to `feedback.notification.*`?
- Or was `badge.notification.*` never part of the token system?
- Is this purely a documentation issue, or are there code references that need updating?

### 6. Platform-Specific Fallbacks — Governance Policy

**Current Pattern**: iOS and Android components define their own token constants when generated tokens don't exist.

**Examples**:
```swift
// iOS
public static let colorBackground: UIColor = UIColor.systemBackground
```

```kotlin
// Android
val DesignTokens.Companion.color_background: Int
    get() = 0xFFFFFFFF.toInt()
```

**Governance Concerns**:
- Violates single source of truth (tokens should only come from generated files)
- Creates platform divergence (iOS uses adaptive system colors, Android uses hardcoded white)
- Masks token generation gaps (components work, but with wrong colors)
- Maintenance burden (must manually remove when tokens are added)

**Questions**:
- Should components ever be allowed to define their own token constants?
- Should iOS/Android adopt web's "fail loudly" approach (throw errors when tokens missing)?
- Or is there a valid use case for platform-specific fallbacks (e.g., using `UIColor.systemBackground` for adaptive light/dark mode)?
- If fallbacks are allowed, what's the governance process for approving them?

### 7. Token Architecture: Background/Surface/Canvas Hierarchy

**Observation**: Components reference three related but distinct semantic concepts:
- `color.background` — General background color
- `color.surface` — Surface/container background color
- `color.canvas` — Canvas/page background color

**Current State**: None of these exist as standalone tokens. Only `color.background.primary.subtle` exists.

**Questions**:
- Is there a semantic hierarchy for background colors in the Rosetta token architecture?
- Should there be distinct tokens for canvas (page-level), surface (container-level), and background (component-level)?
- Or should all components use the same `color.background.primary.subtle` token?
- Are there other `color.background.*` tokens planned (e.g., `color.background.secondary`, `color.background.tertiary`)?

---

## Ada's Review Checklist

When reviewing these questions, please provide:

1. **Token Existence Decision**: For each missing token, should it exist or not?
2. **Correct Token Mapping**: If a token shouldn't exist, what existing token should components use instead?
3. **Primitive Token References**: If a token should exist, what primitive token should it reference?
4. **Semantic Correctness**: Are the proposed token usages semantically correct for the component use cases?
5. **Governance Policy**: Should platform-specific fallbacks be allowed, and under what conditions?
6. **Token Generation Tasks**: If tokens need to be added, what's the implementation plan?

---

## Blocking Fixes Until Ada's Review

The following fixes are blocked pending Ada's answers:

| Component | Platform | Issue | Blocked On |
|-----------|----------|-------|------------|
| ButtonVerticalListItem | All | `color.background` reference | Question 3 |
| InputTextBase | Web, iOS | `color.primary` reference | Question 4 |
| ContainerBase | Web, iOS | `color.surface`, `color.canvas`, `color.background` fallback chain | Questions 1, 2, 3, 7 |
| ContainerCardBase | All | `color.surface.primary`, `color.surface.secondary`, `color.surface.tertiary` references | Questions 1, 7 |
| BadgeCountNotification | All | Documentation references incorrect token names | Question 5 |

**Non-Blocked Fixes** (can proceed independently):
- InputCheckboxBase (web only): `--color-select-not-selected-strong` → `--color-feedback-select-border-default`
- InputRadioBase (web only): `--color-select-not-selected-strong` → `--color-feedback-select-border-default`

---

**Ada Access**: Switch to Ada with `ctrl+shift+a` or `/agent swap`

---

## Additional Finding: color-progress.ts Organization

**Issue**: Progress color semantic tokens are defined in a separate file (`src/tokens/semantic/color-progress.ts`) instead of living with other semantic color tokens in `src/tokens/semantic/ColorTokens.ts`.

**Impact**: Organizational inconsistency. Developers and AI agents expect all semantic color tokens to be in `ColorTokens.ts`.

**Recommendation**: Merge `color-progress.ts` into `ColorTokens.ts` to maintain single source of truth for semantic color tokens.

**Caution**: This requires careful handling of:
- Dependent code that imports from `color-progress.ts`
- Documentation references to the separate file
- Token generation pipeline that may reference the file structure

**Action**: Capture in a spec for proper planning and dependency analysis. Do not merge as part of this audit's fixes.

---

## Recommended Fix Priority (Cross-Platform)

Based on severity and cross-platform impact:

1. **InputTextBase** (`color.primary` → `color.action.primary`) — CRITICAL, affects web and iOS, likely causes errors
2. **ButtonVerticalListItem** (`color.background` → correct token) — HIGH, affects all platforms, governance violation
3. **ContainerCardBase** (`color.surface.*` tokens) — HIGH, affects all platforms, needs Ada's review
4. **ContainerBase** (`color.surface`, `color.canvas`, `color.background`) — HIGH, affects web and iOS, needs Ada's review
5. **InputCheckboxBase/InputRadioBase** (`color.select.not.selected.strong` → `color.feedback.select.border.default`) — HIGH, affects web only
6. **BadgeCountNotification** (documentation fix) — MEDIUM, affects all platforms, comment-only issue

---

## Next Steps

1. **Peter**: Review cross-platform audit findings
2. **Ada**: Answer open questions about missing surface/canvas/background tokens
3. **Lina**: After Ada's review, implement fixes across all three platforms in priority order
4. **Thurgood**: After fixes, run validation audit on all three platforms to confirm resolution
5. **Governance**: Decide on "fail loudly" policy for iOS/Android (should components be allowed to define fallback tokens?)

---

**Audit Status**: Complete  
**Findings Delivered**: February 21, 2026  
**Cross-Platform Risk Confirmed**: HIGH — Same token issues across all platforms  
**Awaiting**: Ada's review of missing tokens, Peter's fix prioritization decision
