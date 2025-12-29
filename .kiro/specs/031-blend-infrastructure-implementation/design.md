# Design Document: Blend Infrastructure Implementation

**Date**: December 28, 2025
**Spec**: 031 - Blend Infrastructure Implementation
**Status**: Design Phase
**Dependencies**: 024-blend-token-infrastructure-audit (completed)

---

## Overview

This design document describes the implementation of blend token runtime infrastructure. The solution integrates the existing BlendUtilityGenerator into the build pipeline, generating platform-native utilities that components consume to apply blend operations to colors.

**Root Cause Being Addressed**:
> Blend tokens are defined as calculation parameters, but no mechanism exists to execute the calculation and deliver a consumable color value to components.

**Solution**: Integrate BlendUtilityGenerator into TokenFileGenerator, producing blend utilities for Web (TypeScript), iOS (Swift), and Android (Kotlin).

---

## Architecture

### Current State (Gap)

```
┌─────────────────────┐     ┌─────────────────────┐
│ BlendUtilityGenerator│     │ TokenFileGenerator  │
│ (exists, orphaned)  │     │ (orchestrator)      │
└─────────────────────┘     └─────────────────────┘
         ↓                           ↓
    [NOT CALLED]              [Generates tokens]
         ↓                           ↓
    [No output]               [dist/DesignTokens.*]
```

### Target State (Solution)

```
┌─────────────────────┐     ┌─────────────────────┐
│ BlendUtilityGenerator│────→│ TokenFileGenerator  │
│ (integrated)        │     │ (orchestrator)      │
└─────────────────────┘     └─────────────────────┘
         ↓                           ↓
    [Called by TFG]           [Generates tokens]
         ↓                           ↓
    [Utilities in output]     [dist/DesignTokens.*]
```

### Component Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ BlendTokens  │───→│ BlendUtility │───→│  Component   │
│ (parameters) │    │ (function)   │    │ (consumer)   │
└──────────────┘    └──────────────┘    └──────────────┘
     0.08              darkerBlend()      hover color
```

---

## Components and Interfaces

### TokenFileGenerator Integration

**File**: `src/generators/TokenFileGenerator.ts`

**Changes**:
- Import BlendUtilityGenerator
- Call BlendUtilityGenerator.generate() during build
- Include blend utility files in output manifest

```typescript
// Existing orchestrator pattern
class TokenFileGenerator {
  async generate(): Promise<void> {
    // Existing token generation
    await this.generateTokenFiles();
    
    // NEW: Blend utility generation
    await this.blendUtilityGenerator.generate();
  }
}
```

### BlendUtilityGenerator Interface

**File**: `src/generators/BlendUtilityGenerator.ts` (existing)

**Interface**:
```typescript
interface BlendUtilityGenerator {
  generate(): Promise<void>;
  generateWeb(): Promise<string>;
  generateIOS(): Promise<string>;
  generateAndroid(): Promise<string>;
}
```

### Web Blend Utilities

**Output**: `dist/BlendUtilities.web.ts`

```typescript
/**
 * Darkens a color by the specified blend amount.
 * @param color - Hex color string (e.g., "#FF5733")
 * @param blendAmount - Amount to darken (0.0-1.0)
 * @returns Darkened hex color string
 */
export function darkerBlend(color: string, blendAmount: number): string;

/**
 * Lightens a color by the specified blend amount.
 * @param color - Hex color string (e.g., "#FF5733")
 * @param blendAmount - Amount to lighten (0.0-1.0)
 * @returns Lightened hex color string
 */
export function lighterBlend(color: string, blendAmount: number): string;

/**
 * Increases saturation of a color by the specified blend amount.
 * @param color - Hex color string (e.g., "#FF5733")
 * @param blendAmount - Amount to saturate (0.0-1.0)
 * @returns Saturated hex color string
 */
export function saturate(color: string, blendAmount: number): string;

/**
 * Decreases saturation of a color by the specified blend amount.
 * @param color - Hex color string (e.g., "#FF5733")
 * @param blendAmount - Amount to desaturate (0.0-1.0)
 * @returns Desaturated hex color string
 */
export function desaturate(color: string, blendAmount: number): string;
```

### iOS Blend Utilities

**Output**: `dist/BlendUtilities.ios.swift`

```swift
import SwiftUI

extension Color {
    /// Darkens the color by the specified blend amount.
    /// - Parameter amount: Amount to darken (0.0-1.0)
    /// - Returns: Darkened Color
    func darkerBlend(_ amount: Double) -> Color
    
    /// Lightens the color by the specified blend amount.
    /// - Parameter amount: Amount to lighten (0.0-1.0)
    /// - Returns: Lightened Color
    func lighterBlend(_ amount: Double) -> Color
    
    /// Increases saturation by the specified blend amount.
    /// - Parameter amount: Amount to saturate (0.0-1.0)
    /// - Returns: Saturated Color
    func saturate(_ amount: Double) -> Color
    
    /// Decreases saturation by the specified blend amount.
    /// - Parameter amount: Amount to desaturate (0.0-1.0)
    /// - Returns: Desaturated Color
    func desaturate(_ amount: Double) -> Color
}
```

### Android Blend Utilities

**Output**: `dist/BlendUtilities.android.kt`

```kotlin
import androidx.compose.ui.graphics.Color

/**
 * Darkens the color by the specified blend amount.
 * @param amount Amount to darken (0.0f-1.0f)
 * @return Darkened Color
 */
fun Color.darkerBlend(amount: Float): Color

/**
 * Lightens the color by the specified blend amount.
 * @param amount Amount to lighten (0.0f-1.0f)
 * @return Lightened Color
 */
fun Color.lighterBlend(amount: Float): Color

/**
 * Increases saturation by the specified blend amount.
 * @param amount Amount to saturate (0.0f-1.0f)
 * @return Saturated Color
 */
fun Color.saturate(amount: Float): Color

/**
 * Decreases saturation by the specified blend amount.
 * @param amount Amount to desaturate (0.0f-1.0f)
 * @return Desaturated Color
 */
fun Color.desaturate(amount: Float): Color
```

---

## Data Models

### Blend Operation Types

```typescript
type BlendOperation = 'darkerBlend' | 'lighterBlend' | 'saturate' | 'desaturate';

interface BlendInput {
  color: string;      // Hex color (e.g., "#FF5733")
  amount: number;     // 0.0-1.0
}

interface BlendResult {
  color: string;      // Resulting hex color
  operation: BlendOperation;
  inputColor: string;
  amount: number;
}
```

### Component State to Blend Mapping

| Component State | Blend Operation | Token Reference |
|-----------------|-----------------|-----------------|
| Hover | `darkerBlend` | `blend.hoverDarker` |
| Pressed | `darkerBlend` | `blend.pressedDarker` |
| Focus | `saturate` | `blend.focusSaturate` |
| Disabled | `desaturate` | `blend.disabledDesaturate` |
| Icon Optical | `lighterBlend` | `blend.iconLighter` |

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Blend Direction Correctness

*For any* valid color and blend amount (0.0-1.0):
- `darkerBlend` SHALL produce a color with lower luminance than the input
- `lighterBlend` SHALL produce a color with higher luminance than the input
- `saturate` SHALL produce a color with higher saturation than the input (unless already fully saturated)
- `desaturate` SHALL produce a color with lower saturation than the input (unless already fully desaturated)

**Validates: Requirements 2.2, 2.3, 2.4, 2.5, 3.2, 3.3, 3.4, 3.5, 4.2, 4.3, 4.4, 4.5**

### Property 2: Invalid Input Handling

*For any* invalid input (malformed color string, out-of-range blend amount), blend functions SHALL return the original color unchanged.

**Validates: Requirements 2.6, 3.6, 4.6**

### Property 3: Cross-Platform Consistency

*For any* valid color and blend amount, the resulting RGB values from Web, iOS, and Android implementations SHALL match within ±1 on the 0-255 scale.

**Validates: Requirements 5.1, 5.3**

---

## Error Handling

### Build-Time Errors

| Error Condition | Handling |
|-----------------|----------|
| BlendUtilityGenerator fails | Build halts with error message |
| Invalid blend token values | Validation error during build |
| Output directory not writable | Build halts with permission error |

### Runtime Errors

| Error Condition | Handling |
|-----------------|----------|
| Invalid color string | Return original color unchanged |
| Blend amount < 0 | Clamp to 0 |
| Blend amount > 1 | Clamp to 1 |
| Null/undefined input | Return original color unchanged |

---

## Testing Strategy

### Two-Layer Validation Approach

This spec uses a two-layer validation strategy that separates concerns and enables future Figma QA integration.

#### Layer 1: Blend Utility Tests (Numerical Precision)

**Purpose**: Validate the math is correct in blend utility functions.

**Test Types**:
- Cross-platform consistency (±1 RGB tolerance)
- Boundary conditions (no overflow, no negative values)
- Algorithm correctness (directional validation)

**Reference Implementation**: TypeScript (Web) serves as the source of truth.

**Property-Based Tests**:
- Property 1: Blend direction correctness
- Property 2: Invalid input handling
- Property 3: Cross-platform consistency

**Configuration**: Minimum 100 iterations per property test.

#### Layer 2: Component Integration Tests (Token-Naming Validation)

**Purpose**: Validate components use the correct blend utility + token combinations.

**Test Types**:
- Token usage verification (correct function + token for each state)
- Semantic correctness (state maps to expected blend operation)
- Workaround removal (no hardcoded values or CSS hacks)

**Validation Approach**: Static analysis of component code to verify:
- ButtonCTA hover uses `darkerBlend(color.primary, blend.hoverDarker)`
- ButtonCTA pressed uses `darkerBlend(color.primary, blend.pressedDarker)`
- ButtonCTA disabled uses `desaturate(color.primary, blend.disabledDesaturate)`
- ButtonCTA icon uses `lighterBlend(color.onPrimary, blend.iconLighter)`
- TextInputField focus uses `saturate(color.primary, blend.focusSaturate)`
- TextInputField disabled uses `desaturate(color.primary, blend.disabledDesaturate)`
- Container hover uses `darkerBlend(color.surface, blend.hoverDarker)`
- Icon optical uses `lighterBlend(color, blend.iconLighter)`

### Unit Tests

**Blend Utility Unit Tests**:
- Each blend function with known input/output pairs
- Edge cases: black, white, fully saturated, fully desaturated
- Boundary values: blend amount 0, 0.5, 1.0

**Component Unit Tests**:
- State transitions trigger correct blend utility calls
- Theme context integration works correctly

### Future Figma QA Integration

The token-naming validation layer is designed to enable future Figma integration:
- Figma defines variables with semantic names matching our token structure
- QA validates: "Does the code use the semantically equivalent token?"
- Actual color values are a consequence of correct token usage

---

## Design Decisions

### Decision 1: Integration Over Creation

**Options Considered**:
1. Create new blend utility system from scratch
2. Integrate existing BlendUtilityGenerator into build pipeline
3. Generate blend utilities at runtime

**Decision**: Option 2 - Integrate existing BlendUtilityGenerator

**Rationale**:
- BlendUtilityGenerator already exists and produces valid code
- Follows existing patterns (GP-001 through GP-004 from Spec 024)
- Minimal new code required
- Build-time generation is more performant than runtime

**Trade-offs**: Limited flexibility to change utility API without modifying generator

### Decision 2: TypeScript as Reference Implementation

**Options Considered**:
1. Each platform is independently authoritative
2. TypeScript (Web) is the reference, others must match
3. Define reference in platform-agnostic format

**Decision**: Option 2 - TypeScript as reference

**Rationale**:
- TypeScript implementation is most mature
- Easier to test (Node.js environment)
- Single source of truth simplifies debugging
- Aligns with existing BlendCalculator implementation

**Trade-offs**: iOS/Android implementations must normalize to match TypeScript, even if platform-native approaches differ slightly

### Decision 3: Two-Layer Validation Strategy

**Options Considered**:
1. Numerical precision testing only
2. Visual snapshot testing
3. Token-naming validation only
4. Two-layer approach (numerical + token-naming)

**Decision**: Option 4 - Two-layer approach

**Rationale**:
- Numerical precision catches calculation bugs
- Token-naming catches "wrong token" bugs (more common)
- Enables future Figma QA integration at token-naming layer
- Figma can't compute blend functions, but can define semantic names

**Trade-offs**: More complex test infrastructure, but catches more bug categories

### Decision 4: ±1 RGB Tolerance

**Options Considered**:
1. Exact match (0 tolerance)
2. ±1 RGB tolerance
3. ±5 RGB tolerance
4. Percentage-based tolerance

**Decision**: Option 2 - ±1 RGB tolerance

**Rationale**:
- Accounts for floating-point rounding across platforms
- Tight enough to catch algorithmic drift
- Looser tolerances might miss real bugs
- Exact match is impractical across platform math libraries

**Trade-offs**: May occasionally pass with 1-unit drift that's technically incorrect

---

## Component Update Patterns

### ButtonCTA Update Pattern

**Before (Workarounds)**:
```typescript
// Web
const hoverStyle = { opacity: 0.92 };
const pressedStyle = { opacity: 0.84 };
const iconStyle = { filter: 'brightness(1.08)' };
```

**After (Blend Utilities)**:
```typescript
// Web
import { darkerBlend, lighterBlend, desaturate } from '@designerpunk/tokens/BlendUtilities';
import { DesignTokens } from '@designerpunk/tokens';

const hoverColor = darkerBlend(DesignTokens.color.primary, DesignTokens.blend.hoverDarker);
const pressedColor = darkerBlend(DesignTokens.color.primary, DesignTokens.blend.pressedDarker);
const disabledColor = desaturate(DesignTokens.color.primary, DesignTokens.blend.disabledDesaturate);
const iconColor = lighterBlend(DesignTokens.color.onPrimary, DesignTokens.blend.iconLighter);
```

### TextInputField Update Pattern

**Before (Workarounds)**:
```typescript
// Focus uses direct color reference
const focusColor = DesignTokens.color.primary;
// Disabled uses opacity
const disabledStyle = { opacity: 0.6 };
```

**After (Blend Utilities)**:
```typescript
const focusColor = saturate(DesignTokens.color.primary, DesignTokens.blend.focusSaturate);
const disabledColor = desaturate(DesignTokens.color.primary, DesignTokens.blend.disabledDesaturate);
```

---

## Theme-Aware Utilities

### Theme Context Integration

```typescript
// Theme-aware wrapper (Web)
function useBlendUtilities() {
  const theme = useTheme(); // Gets current theme context
  
  return {
    hoverColor: (baseColor: string) => 
      darkerBlend(baseColor, DesignTokens.blend.hoverDarker),
    pressedColor: (baseColor: string) => 
      darkerBlend(baseColor, DesignTokens.blend.pressedDarker),
    focusColor: (baseColor: string) => 
      saturate(baseColor, DesignTokens.blend.focusSaturate),
    disabledColor: (baseColor: string) => 
      desaturate(baseColor, DesignTokens.blend.disabledDesaturate),
  };
}
```

### Theme Switching Behavior

When theme context changes:
1. Components re-render with new base colors
2. Blend utilities apply same operations to new colors
3. Result: Appropriate blend results for light/dark mode

---

## Package Export Structure

```
dist/
├── DesignTokens.web.ts      # Existing token exports
├── DesignTokens.ios.swift   # Existing token exports
├── DesignTokens.android.kt  # Existing token exports
├── BlendUtilities.web.ts    # NEW: Web blend utilities
├── BlendUtilities.ios.swift # NEW: iOS blend utilities
└── BlendUtilities.android.kt # NEW: Android blend utilities
```

**Package.json Exports**:
```json
{
  "exports": {
    ".": "./dist/DesignTokens.web.ts",
    "./BlendUtilities": "./dist/BlendUtilities.web.ts"
  }
}
```
