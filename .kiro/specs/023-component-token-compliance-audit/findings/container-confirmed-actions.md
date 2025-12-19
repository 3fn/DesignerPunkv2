# Container Confirmed Actions

**Date**: December 18, 2025  
**Component**: Container  
**Checkpoint**: Task 7.6  
**Reviewer**: Peter Michaels Allen  
**Status**: Confirmed

---

## Overview

This document records the confirmed actions for Container token compliance based on the audit findings review. Each finding has been categorized as Accept, Reject, Modify, or Escalate with rationale and implementation guidance.

---

## Escalated Actions (Token System Changes Required)

### E1: A1 - Create `color.canvas` Semantic Token
**Finding**: Android color token resolution needs a default value  
**Decision**: Escalate - Create new semantic token  
**Token Specification**: `color.canvas` → `white100`

**Context from Peter**: "I think the default should either be empty, or a new semantic color token that we will need called 'canvas' — which will serve as the default background color for all pages. If we create 'canvas', we can set the primitive token value to 'white100'."

**New Token Details**:
- **Token Name**: `color.canvas`
- **Primitive Reference**: `white100`
- **Purpose**: Default background color for all pages and containers
- **Category**: `SemanticCategory.SURFACE`
- **Context**: Base canvas color for page backgrounds
- **Description**: Canvas background color - default surface for all pages
- **Platforms**: All (web, iOS, Android)

**Implementation Location**: `src/tokens/semantic/ColorTokens.ts`

**Usage**:
```typescript
// Web
<dp-container background="color.canvas">...</dp-container>

// iOS
Container(background: "color.canvas")

// Android
Container(background = "color.canvas")
```

**Impact on Other Findings**:
- Resolves default value for A1 (Android color resolution)
- Provides consistent default across all platforms
- Enables proper fallback behavior when invalid color token provided

---

## Accepted Actions (Implement as Recommended)

### A1: H1 - Placeholder Token Resolution Functions
**Finding**: iOS and Android have placeholder token resolution functions for flexible token types (color, shadow, opacity)  
**Decision**: Accept  
**Rationale**: These placeholders prevent Container from working correctly on native platforms. Implementing actual token resolution is essential for cross-platform consistency.

**Implementation**:
- Implement `resolveColorToken()` on iOS/Android using switch statements
- Implement `resolveShadowToken()` on iOS/Android using switch statements
- Implement `resolveOpacityToken()` on iOS/Android using switch statements
- Map token names to generated constants once token generation supports Swift/Kotlin

---

### A2: H2 - Missing Token Generation Integration
**Finding**: Token generation system doesn't produce Swift/Kotlin constants for iOS/Android  
**Decision**: Accept  
**Rationale**: This is the root cause of placeholder implementations. Extending token generation to native platforms enables proper token resolution.

**Implementation**:
1. Extend token generation system to produce Swift constants for iOS
2. Extend token generation system to produce Kotlin constants for Android
3. Generate token lookup functions or dictionaries for each platform
4. Update iOS/Android token resolution functions to use generated constants
5. Add build-time validation that all referenced tokens exist

---

### A3: H3 - Inconsistent Token Mapping Approaches
**Finding**: Each platform uses different token mapping patterns  
**Decision**: Accept  
**Rationale**: Platform-specific idioms are appropriate as long as prop availability is consistent across platforms.

---

### A4: Web Opacity Default Consistency
**Finding**: Web opacity mapping returns empty string (full opacity) when no value provided, while iOS/Android will use `opacity.subtle` as default  
**Decision**: Accept (with consistency requirement)  
**Rationale**: All platforms should use `opacity.subtle` as the semantic default for consistency

**Context from Peter**: "This should be true of web as well" (regarding opacity.subtle as default)

**Current Web Implementation**:
```typescript
export function mapOpacityToCSS(opacity: OpacityTokenName | null): string {
  if (!opacity) {
    return '';  // Empty string = no opacity style = full opacity (1.0)
  }
  return `opacity: ${tokenToCssVar(opacity)}`;
}
```

**Updated Implementation**:
```typescript
export function mapOpacityToCSS(opacity: OpacityTokenName | null): string {
  if (!opacity) {
    return 'opacity: var(--opacity-subtle)';  // Default to opacity.subtle (0.88)
  }
  return `opacity: ${tokenToCssVar(opacity)}`;
}
```

**Note**: This ensures cross-platform consistency - all platforms default to `opacity.subtle` when no opacity value is explicitly provided.

**Context from Peter**: "The same props should be available across all three platforms; but the expression of those props can reflect what's optimal format for the code of the individual platform. Does that help answer your question and/or make sense?"

**Clarification**: 
- ✅ **Consistent**: Same props available on all platforms (padding, background, shadow, etc.)
- ✅ **Platform-Appropriate**: Each platform uses optimal code format for its ecosystem
  - Web: CSS custom properties (`var(--space-inset-200)`)
  - iOS: Swift switch statements (`case .p200: return spaceInset200`)
  - Android: Kotlin when expressions (`PaddingValue.P200 -> DesignTokens.space_inset_200.dp`)

**Implementation**:
1. ✅ Verify prop availability is consistent across all platforms
2. Document rationale for platform-specific expressions in Component Development Guide
3. Create cross-platform token mapping test that verifies all platforms map the same prop values to equivalent token references
4. Consider generating token mapping code from single source of truth (future enhancement - not required)

---

### A4: I4 - Hard-Coded Token Constants (iOS)
**Finding**: Token constants are hard-coded in TokenMapping.swift instead of imported  
**Decision**: Accept  
**Rationale**: Once token generation produces Swift constants, these should be replaced with imports for single source of truth.

**Implementation**:
- Replace hard-coded constants with imports from generated token files
- Requires token generation system to produce Swift constant files first
- Update imports: `import DesignTokens`

---

## Modified Actions (Alternative Approach)

### M1: I2 - Placeholder Shadow Token Resolution (iOS)
**Finding**: Returns hardcoded shadow properties instead of resolving token names  
**Original Recommendation**: Implement token resolution using generated constants  
**Decision**: Modify  
**Alternative**: Use existing shadow tokens (shadow.sunrise, shadow.noon, shadow.dusk, shadow.container, shadow.modal)

**Context from Peter**: "What are the recommendations here? There's not a lot of context to go on."

**Clarification**: The recommendation is to implement actual token resolution that maps token names like "shadow.container" and "shadow.modal" to their actual shadow properties (color, radius, x, y offsets). The current placeholder returns the same hardcoded shadow for all token names.

**Implementation**:
```swift
func resolveShadowToken(_ tokenName: String?) -> ShadowProperties {
    guard let tokenName = tokenName, !tokenName.isEmpty else {
        return ShadowProperties(color: Color.clear, radius: 0, x: 0, y: 0)
    }
    
    // Use generated token constants
    switch tokenName {
    case "shadow.sunrise":
        return ShadowProperties(
            color: shadowSunriseColor,
            radius: shadowSunriseRadius,
            x: shadowSunriseX,
            y: shadowSunriseY
        )
    case "shadow.noon":
        return ShadowProperties(
            color: shadowNoonColor,
            radius: shadowNoonRadius,
            x: shadowNoonX,
            y: shadowNoonY
        )
    case "shadow.dusk":
        return ShadowProperties(
            color: shadowDuskColor,
            radius: shadowDuskRadius,
            x: shadowDuskX,
            y: shadowDuskY
        )
    case "shadow.container":
        return ShadowProperties(
            color: shadowContainerColor,
            radius: shadowContainerRadius,
            x: shadowContainerX,
            y: shadowContainerY
        )
    case "shadow.modal":
        return ShadowProperties(
            color: shadowModalColor,
            radius: shadowModalRadius,
            x: shadowModalX,
            y: shadowModalY
        )
    default:
        return ShadowProperties(color: Color.clear, radius: 0, x: 0, y: 0)
    }
}
```

---

### M2: I3 - Placeholder Opacity Token Resolution (iOS)
**Finding**: Returns hardcoded `0.9` instead of resolving token names  
**Original Recommendation**: Implement token resolution using generated constants  
**Decision**: Accept (with semantic token specification)  
**Alternative**: Use `opacity.subtle` semantic token (maps to opacity1100 = 0.88)

**Context from Peter**: 
- Initial: "I believe we have an opacity that's very close to this that's 'good enough' — opacity1100, I think, would be the closest"
- Final: "Let's go with 'opacity.subtle'. If this is true of the iOS implementation as well, this changes my answer to I3; because it should also use opacity.subtle"

**Verification**: 
- opacity.subtle → opacity1100 = 0.88 (base × 11 = 0.08 × 11 = 0.88)
- Close to placeholder value of 0.9
- Semantic token provides better meaning than primitive reference

**Implementation**:
```swift
func resolveOpacityToken(_ tokenName: String?) -> Double {
    guard let tokenName = tokenName, !tokenName.isEmpty else {
        return 1.0
    }
    
    // Use generated token constants
    switch tokenName {
    case "opacity.subtle":
        return opacitySubtle  // Maps to opacity1100 (0.88)
    case "opacity.medium":
        return opacityMedium  // Maps to opacity900 (0.72)
    case "opacity.heavy":
        return opacityHeavy   // Maps to opacity600 (0.48)
    case "opacity.ghost":
        return opacityGhost   // Maps to opacity400 (0.32)
    // ... other opacity tokens
    default:
        return opacitySubtle  // Default to opacity.subtle (0.88)
    }
}
```

**Note**: Default should use `opacity.subtle` semantic token rather than hardcoded 0.9.

---

### M3: A1 - Placeholder Color Token Resolution (Android)
**Finding**: Returns `Color.Blue` instead of resolving token names  
**Original Recommendation**: Implement token resolution using generated constants  
**Decision**: Escalate (requires new semantic token creation)  
**Alternative**: Create new `color.canvas` semantic token → `white100`

**Context from Peter**: "I think the default should either be empty, or a new semantic color token that we will need called 'canvas' — which will serve as the default background color for all pages. If we create 'canvas', we can set the primitive token value to 'white100'."

**Clarification**: This is applied to Container's `background` prop, which accepts color token names for fill/background colors (e.g., "color.primary", "color.surface", "color.background").

**Usage Context**:
```kotlin
// Container with background color
Container(
    background = "color.primary",  // Uses resolveColorToken()
    padding = PaddingValue.P200
)
```

**New Token Specification**:
- **Token Name**: `color.canvas`
- **Primitive Reference**: `white100`
- **Purpose**: Default background color for all pages and containers
- **Category**: SemanticCategory.SURFACE
- **Context**: Base canvas color for page backgrounds
- **Description**: Canvas background color - default surface for all pages

**Implementation** (after token creation):
```kotlin
fun resolveColorToken(tokenName: String?): Color {
    if (tokenName.isNullOrEmpty()) {
        return Color.Transparent
    }
    
    // Use generated token constants
    return when (tokenName) {
        "color.primary" -> colorPrimary
        "color.surface" -> colorSurface
        "color.background" -> colorBackground
        "color.canvas" -> colorCanvas  // New token
        // ... other color tokens
        else -> colorCanvas  // Default to canvas (white100)
    }
}
```

**Escalation Action**: Create `color.canvas` semantic token in Task 8.1

---

### M4: A2 - Placeholder Shadow Token Resolution with Pattern Matching (Android)
**Finding**: Uses fragile pattern matching on token names instead of proper resolution  
**Original Recommendation**: Replace pattern matching with proper token resolution  
**Decision**: Modify  
**Alternative**: Keep pattern matching for now, ensure alignment with actual token names

**Context from Peter**: "Aren't those the current token names though? They're not perfect, but I'm less concerned about these being perfect for now, and more focused on making sure they're aligned. My principle tends to be 'I'd rather have consistently bad than inconsistently good — you can more easily fix something consistently bad.'"

**Verification**: Yes, "sunrise", "noon", "dusk", "container", "modal" are actual shadow token names:
- `shadow.sunrise`
- `shadow.noon`
- `shadow.dusk`
- `shadow.container`
- `shadow.modal`

**Implementation**:
Keep the pattern matching approach but ensure it aligns with actual token names:
```kotlin
fun mapShadowToElevation(tokenName: String?): Dp {
    if (tokenName.isNullOrEmpty()) {
        return 0.dp
    }
    
    // Pattern matching aligned with actual token names
    return when {
        tokenName.contains("sunrise") -> 2.dp   // shadow.sunrise
        tokenName.contains("noon") -> 4.dp      // shadow.noon
        tokenName.contains("dusk") -> 8.dp      // shadow.dusk
        tokenName.contains("container") -> 8.dp // shadow.container
        tokenName.contains("navigation") -> 4.dp // (if exists)
        tokenName.contains("dropdown") -> 8.dp  // (if exists)
        tokenName.contains("modal") -> 16.dp    // shadow.modal
        else -> 4.dp  // Default elevation
    }
}
```

**Rationale**: Consistent pattern matching across all shadow tokens is better than partially correct implementation. Can be improved later with proper token resolution once token generation supports it.

---

### M5: A3 - Placeholder Opacity Token Resolution (Android)
**Finding**: Returns hardcoded `0.9f` instead of resolving token names  
**Original Recommendation**: Implement token resolution using generated constants  
**Decision**: Accept (with semantic token specification)  
**Alternative**: Use `opacity.subtle` semantic token (maps to opacity1100 = 0.88f)

**Context from Peter**: "Let's go with 'opacity.subtle'. If this is true of the iOS implementation as well, this changes my answer to I3; because it should also use opacity.subtle"

**Clarification**: This is about opacity token resolution for Container's `opacity` prop. Elevation and opacity are separate concerns on Android - elevation handles stacking order and shadow, while opacity handles transparency.

**Verification**: 
- opacity.subtle → opacity1100 = 0.88f (base × 11 = 0.08 × 11 = 0.88)
- Close to placeholder value of 0.9f
- Semantic token provides better meaning than primitive reference
- Same approach as iOS (M2/I3)

**Implementation**:
```kotlin
fun resolveOpacityToken(tokenName: String?): Float {
    if (tokenName.isNullOrEmpty()) {
        return 1.0f
    }
    
    // Use generated token constants
    return when (tokenName) {
        "opacity.subtle" -> opacitySubtle  // Maps to opacity1100 (0.88f)
        "opacity.medium" -> opacityMedium  // Maps to opacity900 (0.72f)
        "opacity.heavy" -> opacityHeavy    // Maps to opacity600 (0.48f)
        "opacity.ghost" -> opacityGhost    // Maps to opacity400 (0.32f)
        // ... other opacity tokens
        else -> opacitySubtle  // Default to opacity.subtle (0.88f)
    }
}
```

**Note**: Default should use `opacity.subtle` semantic token rather than hardcoded 0.9f. Matches iOS implementation approach.

---

## Confirmed Positive Findings (No Action)

### C1: A4 - Correct Rosetta Pattern Compliance for Fixed Tokens (Android)
**Finding**: Token constants correctly use DesignTokens references  
**Decision**: Confirm  
**Rationale**: This is the correct pattern for fixed token types. No action needed.

---

### C2: A5 - Android-Specific Layering/Shadow Conflict Handling
**Finding**: Correctly handles Android's elevation system  
**Decision**: Confirm  
**Rationale**: Correct Android-specific behavior following Material Design guidelines. No action needed.

---

### C3: Web Implementation - Fully Token-Compliant
**Finding**: Web implementation has zero hard-coded values, exemplary token compliance  
**Decision**: Confirm  
**Rationale**: Excellent reference implementation for other components. No action needed.

---

## Intentional Differences (Documented)

### D1: Layering Token Types
**Platform**: iOS vs Android  
**Decision**: Confirm as intentional  
**Clarification from Peter**: "Intentional, but it might be helpful to clarify Layering vs Elevation vs ZIndex"

**Documentation Needed**:
Add clarification to Component Development Guide explaining:
- **Z-Index (Web + iOS)**: Pure stacking order, separate from visual depth (shadows)
- **Elevation (Android)**: Material Design pattern that couples stacking order with shadow rendering
- **Layering Tokens**: Unified semantic naming across platforms (container, navigation, dropdown, modal, toast, tooltip)

**Key Points**:
- Same semantic meaning ("modal") across platforms
- Different implementation (z-index 400 on web/iOS, elevation 16dp on Android)
- Platform-appropriate idioms following design guidelines

**Reference**: See `src/tokens/semantic/LayeringTokens.ts` for complete documentation

---

### D2: Semantic HTML Support
**Platform**: Web only  
**Decision**: Confirm as intentional  
**Rationale**: Web-specific accessibility and SEO feature with no native equivalent. No action needed.

---

## Component Development Guide Opportunities

**Decision from Peter**: "Yes, please. I presume this is going to be collected for eventual Task 9 efforts?"

**Confirmation**: Yes, these opportunities will be accumulated and addressed in Task 9 (Component Development Guide Updates).

### Opportunity 1: Token Resolution Patterns
**Topic**: Implementing token resolution functions for flexible token types  
**Status**: Accumulate for Task 9

**Guidance Needed**:
- How to structure token resolution functions (switch statements, dictionaries, generated code)
- Error handling for invalid token names
- Default values for missing tokens
- Testing strategies for token resolution

---

### Opportunity 2: Cross-Platform Token Mapping
**Topic**: Maintaining consistency across platform-specific token mapping approaches  
**Status**: Accumulate for Task 9

**Guidance Needed**:
- When to use platform-specific idioms vs shared patterns
- How to verify cross-platform token equivalence
- Testing strategies for cross-platform consistency
- Documentation standards for platform differences

---

### Opportunity 3: Placeholder Implementation Patterns
**Topic**: Managing placeholder implementations during development  
**Status**: Accumulate for Task 9

**Guidance Needed**:
- When placeholders are acceptable vs when they must be completed
- How to mark placeholders clearly (TODO comments, type system, tests)
- Migration path from placeholders to real implementations
- Testing strategies that catch placeholder implementations

---

### Opportunity 4: Layering vs Elevation vs Z-Index Clarification
**Topic**: Platform-specific stacking order mechanisms  
**Status**: Accumulate for Task 9

**Guidance Needed**:
- Clear explanation of z-index (web/iOS) vs elevation (Android)
- When to use layering tokens vs platform-specific tokens
- How elevation couples stacking order with shadow rendering on Android
- Cross-platform semantic consistency despite implementation differences

---

## Implementation Checklist

Based on confirmed actions, the following tasks will be executed in Task 8:

### Prerequisites
- [x] All clarifications received from Peter
- [ ] Create `color.canvas` semantic token (Escalate action for A1/M3)

### iOS Implementation
- [ ] Implement `resolveColorToken()` with switch statement (default to `color.canvas` once created)
- [ ] Implement `resolveShadowToken()` with switch statement (using shadow.sunrise, shadow.noon, shadow.dusk, shadow.container, shadow.modal)
- [ ] Implement `resolveOpacityToken()` with switch statement (use `opacity.subtle` as default)
- [ ] Replace hard-coded token constants with imports from generated files (once available)

### Android Implementation
- [ ] Implement `resolveColorToken()` with when expression (default to `color.canvas` once created)
- [ ] Verify pattern matching in `mapShadowToElevation()` aligns with actual token names
- [ ] Implement `resolveOpacityToken()` with when expression (use `opacity.subtle` as default)

### Web Implementation
- [ ] Update `mapOpacityToCSS()` to default to `opacity.subtle` when no value provided

### Cross-Platform
- [ ] Verify all platforms use `opacity.subtle` as default (iOS, Android, Web)
- [ ] Create cross-platform token mapping test
- [ ] Verify all platforms map same prop values to equivalent tokens
- [ ] Document platform differences in Component Development Guide (Task 9)

### Documentation
- [ ] Update `src/tokens/semantic/OpacityTokens.ts` header comment with correct values (0.88, 0.72, 0.48, 0.32)
- [ ] Update Container README with token resolution details
- [ ] Document layering vs elevation vs z-index clarification (Task 9)
- [ ] Accumulate guide opportunities for Task 9

---

## Summary

**Total Findings**: 16  
**Accepted**: 7 (H1, H2, H3, I3, A3, I4, Web opacity default)  
**Modified**: 2 (I2, A2)  
**Escalated**: 1 (A1 - requires `color.canvas` token creation)  
**Confirmed Positive**: 3 (A4, A5, Web token compliance)  
**Intentional Differences**: 2 (D1, D2)  
**Guide Opportunities**: 4 (accumulated for Task 9)  
**Documentation Updates**: 1 (OpacityTokens.ts header comment)

**Additional Actions Required**:
1. **Opacity Token Documentation Update**: Update `src/tokens/semantic/OpacityTokens.ts` header comment to reflect actual values (0.88, 0.72, 0.48, 0.32) instead of outdated values (0.9, 0.7, 0.5, 0.3)

**Next Phase**: Task 8 - Container Platform Implementation & Verification

---

**Confirmation Complete**: December 18, 2025  
**Reviewer**: Peter Michaels Allen  
**Next Task**: 8.1 - Create escalated tokens (if any)
