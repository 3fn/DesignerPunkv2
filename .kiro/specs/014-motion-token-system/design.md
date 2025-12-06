# Design Document: Motion Token System

**Date**: December 3, 2025  
**Spec**: 014-motion-token-system  
**Status**: Design Phase  
**Dependencies**: None (foundational token system)

---

## Overview

The Motion Token System provides a compositional token architecture for animation timing, easing, and scale values that work consistently across web, iOS, and Android platforms. The system follows the same compositional pattern as Shadow and Typography tokens - semantic tokens compose primitive duration, easing, and scale values to create complete motion styles for specific use cases.

The initial implementation focuses on foundational tokens needed for the Text Input Field float label animation (duration250, easingStandard, scale088, motion.floatLabel), with a structure that supports incremental expansion as new animation patterns emerge across the design system.

---

## Integration with Existing Infrastructure

### Token File Structure

Motion tokens integrate with the existing token file organization:

**Primitive Tokens** (New files in `src/tokens/`):
- `DurationTokens.ts` - Duration primitive tokens (150ms, 250ms, 350ms)
- `EasingTokens.ts` - Easing primitive tokens (cubic-bezier curves)
- `ScaleTokens.ts` - Scale primitive tokens (0.88, 0.92, 0.96, 1.00, 1.04, 1.08)

**Semantic Tokens** (New file in `src/tokens/semantic/`):
- `MotionTokens.ts` - Semantic motion tokens (motion.floatLabel, etc.)

**Pattern Consistency**: Follows the same file structure as existing tokens:
- Primitive tokens in `src/tokens/` (like `SpacingTokens.ts`, `ColorTokens.ts`)
- Semantic tokens in `src/tokens/semantic/` (like `ShadowTokens.ts`, `TypographyTokens.ts`)

### Token Generation Pipeline

Motion tokens leverage the existing cross-platform build system:

**Build System Integration**:
- Uses existing `BuildOrchestrator` (`src/build/BuildOrchestrator.ts`)
- Integrates with existing platform builders:
  - `WebBuilder` (`src/build/platforms/WebBuilder.ts`)
  - `iOSBuilder` (`src/build/platforms/iOSBuilder.ts`)
  - `AndroidBuilder` (`src/build/platforms/AndroidBuilder.ts`)
- Follows existing build workflow (`npm run build`)

**Token Selection**:
- Uses existing `TokenSelector` (`src/build/tokens/TokenSelector.ts`)
- Integrates with existing `PrimitiveTokenRegistry` and `SemanticTokenRegistry`
- Follows existing token resolution priority (semantic → primitive)

**Platform Generation**:
- Extends existing platform-specific generators:
  - Web: Generates CSS custom properties (like existing shadow/typography tokens)
  - iOS: Generates Swift constants (like existing shadow/typography tokens)
  - Android: Generates Kotlin constants (like existing shadow/typography tokens)
- Uses existing `UnitConverter` (`src/build/tokens/UnitConverter.ts`) for platform-specific unit conversion

**Output Structure**:
- Follows existing output directory structure:
  - `dist/web/` - CSS custom properties
  - `dist/ios/` - Swift constants
  - `dist/android/` - Kotlin constants

### Validation System

Motion tokens leverage the existing three-tier validation infrastructure:

**Structural Validation** (`src/build/validation/MathematicalConsistencyValidator.ts`):
- **Pass**: Motion tokens are structurally correct
  - All primitive tokens exist and have valid numeric/string values
  - Semantic tokens reference existing primitive tokens via primitiveReferences
  - Platform-specific output uses correct syntax (CSS, Swift, Kotlin)
  - Cross-platform values are mathematically equivalent
- **Warning**: Valid but consider alternatives
  - Using primitive duration tokens directly in components (suggest semantic motion token)
  - Using scale tokens outside transform animations (suggest typography tokens)
  - Unusual scale values outside typical range (0.5-1.5)
- **Error**: Structural failures that break the system
  - Semantic token references non-existent primitive token
  - Invalid platform-specific syntax (malformed cubic-bezier, invalid Swift/Kotlin)
  - Missing required token properties (name, primitiveReferences, category)

**Design Philosophy Context** (informational, not validated):

The current motion token values follow specific mathematical progressions that align with DesignerPunk's design philosophy:
- Scale tokens use 8-interval progression (0.88, 0.92, 0.96, 1.00, 1.04, 1.08) to align with 8px baseline grid
- Duration tokens use linear +100ms progression (150ms, 250ms, 350ms) for predictable timing
- Easing tokens use Material Design cubic-bezier curves for natural motion feel

**Note**: These progressions are design decisions that inform current token values, not validation requirements. The validation system tests structural correctness (tokens exist, references resolve, syntax valid), not philosophical alignment. If the mathematical philosophy evolves, token values can change without breaking validation.

**Cross-Platform Validation** (`src/build/validation/`):
- Uses existing `CrossPlatformValidationReporter` to verify mathematical equivalence
- Uses existing `TokenComparator` to validate platform-specific output consistency
- Uses existing platform validators:
  - `WebBuildValidator` - Validates CSS custom property syntax
  - `iOSBuildValidator` - Validates Swift constant syntax
  - `AndroidBuildValidator` - Validates Kotlin constant syntax

### Semantic Token Pattern

Motion tokens follow the established semantic token pattern used by Shadow and Typography tokens:

**primitiveReferences Property**:
```typescript
// Motion tokens use same pattern as ShadowTokens.ts
primitiveReferences: {
  duration: 'duration250',      // Reference to primitive token
  easing: 'easingStandard'      // Reference to primitive token
}
```

**Utility Functions**:
```typescript
// Same pattern as getShadowToken(), getTypographyToken()
export function getMotionToken(name: string): SemanticMotionToken | undefined
export function getAllMotionTokens(): Array<SemanticMotionToken>
```

**Token Interface**:
```typescript
// Follows SemanticToken interface pattern
interface SemanticMotionToken {
  name: string;
  primitiveReferences: Record<string, string>;  // Same as Shadow/Typography
  category: SemanticCategory.MOTION;            // Same category system
  context: string;                              // Same metadata pattern
  description: string;                          // Same documentation pattern
}
```

### Error Handling

Motion tokens integrate with the existing error handling infrastructure:

**Error Types** (`src/build/errors/`):
- Uses existing `BuildError` base class
- Extends existing error types for motion-specific errors:
  - `TokenGenerationError` - Invalid primitive references
  - `PlatformGenerationError` - Platform-specific generation failures
  - `TokenReferenceError` - Non-existent token references

**Error Recovery** (`src/build/errors/RecoveryStrategy.ts`):
- Uses existing recovery strategies:
  - Fallback to default values (250ms duration, standard easing)
  - Graceful degradation (disable animations if token resolution fails)
  - Error reporting with actionable messages

**Error Reporting** (`src/build/errors/ErrorReporter.ts`):
- Uses existing error reporter for consistent error messages
- Integrates with existing error documentation system

### Testing Infrastructure

Motion tokens leverage the existing testing infrastructure:

**Unit Testing**:
- Uses existing Jest configuration
- Follows existing test patterns in `src/tokens/__tests__/`
- Uses existing test utilities for token validation

**Property-Based Testing**:
- Uses existing property-based testing setup (fast-check)
- Follows existing property test patterns
- Integrates with existing test suites

**Integration Testing**:
- Uses existing build integration tests in `src/build/__tests__/`
- Follows existing cross-platform validation test patterns
- Integrates with existing CI/CD pipeline

### Key Integration Points

**What We're Extending** (not creating from scratch):
- ✅ Token file structure (adding new files to existing directories)
- ✅ Build orchestration (using existing BuildOrchestrator)
- ✅ Platform builders (extending existing Web/iOS/Android builders)
- ✅ Validation system (using existing three-tier validation)
- ✅ Error handling (using existing error types and recovery)
- ✅ Testing infrastructure (using existing Jest and property-based testing)

**What We're Creating** (new for motion tokens):
- 🆕 Motion-specific primitive tokens (duration, easing, scale)
- 🆕 Motion-specific semantic tokens (motion.floatLabel)
- 🆕 Motion-specific generator methods (within existing platform builders)
- 🆕 Motion-specific validation rules (within existing validation system)

**Integration Verification**:
- Motion tokens must work with existing `npm run build` command
- Motion tokens must integrate with existing token selection system
- Motion tokens must validate using existing validation infrastructure
- Motion tokens must generate platform-specific output in existing output directories

---

## Architecture

### Compositional Pattern

Motion tokens follow the established DesignerPunk compositional pattern where semantic tokens compose primitive tokens:

```
Primitive Layer (Foundation)
├── DurationTokens.ts (duration150, duration250, duration350)
├── EasingTokens.ts (easingStandard, easingDecelerate, easingAccelerate)
└── ScaleTokens.ts (scale088, scale092, scale096, scale100, scale104, scale108)

Semantic Layer (Contextual)
└── MotionTokens.ts (motion.floatLabel composes duration250 + easingStandard)

Token Generation System
└── Generates platform-specific formats (CSS, Swift, Kotlin)
```

**Pattern Consistency**: This matches Shadow tokens (compose offsetX/offsetY/blur/opacity/color) and Typography tokens (compose fontSize/lineHeight/fontWeight/etc).

### Token Flow

```
1. Define Primitives → DurationTokens.ts, EasingTokens.ts, ScaleTokens.ts
2. Compose Semantics → MotionTokens.ts references primitives
3. Generate Platform-Specific → Build system creates CSS/Swift/Kotlin
4. Components Consume → Use generated platform-specific tokens
```

---

## Components and Interfaces

### Primitive Token Interfaces

```typescript
// Duration Primitive Tokens
export const durationTokens: Record<string, number> = {
  duration150: 150,  // Fast interactions (hover, focus)
  duration250: 250,  // Standard transitions (float label)
  duration350: 350,  // Deliberate animations (modals, drawers)
};

// Easing Primitive Tokens
export const easingTokens: Record<string, string> = {
  easingStandard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',    // Material standard
  easingDecelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',  // Entering elements
  easingAccelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',    // Exiting elements
};

// Scale Primitive Tokens
export const scaleTokens: Record<string, number> = {
  scale088: 0.88,  // Float label scale (16px × 0.88 = 14.08px → rounds to 14px)
  scale092: 0.92,  // Subtle scale down
  scale096: 0.96,  // Button press feedback
  scale100: 1.00,  // Default/reset state
  scale104: 1.04,  // Hover emphasis
  scale108: 1.08,  // Strong emphasis
};
```

### Semantic Token Interface

```typescript
// Semantic Motion Token Interface
export interface SemanticMotionToken {
  name: string;
  primitiveReferences: {
    duration: string;  // Reference to duration primitive
    easing: string;    // Reference to easing primitive
  };
  category: SemanticCategory.MOTION;
  context: string;
  description: string;
}

// Semantic Motion Tokens
export const motionTokens: Record<string, SemanticMotionToken> = {
  'motion.floatLabel': {
    name: 'motion.floatLabel',
    primitiveReferences: {
      duration: 'duration250',
      easing: 'easingStandard'
    },
    category: SemanticCategory.MOTION,
    context: 'Float label animation for text inputs',
    description: 'Standard motion for label floating up with balanced easing (250ms, standard curve)'
  }
};
```

### Token Generation Interface

```typescript
// Platform-specific token generation interfaces
export interface PlatformTokenGenerator {
  generateDurationTokens(tokens: Record<string, number>): string;
  generateEasingTokens(tokens: Record<string, string>): string;
  generateScaleTokens(tokens: Record<string, number>): string;
  generateSemanticMotionTokens(tokens: Record<string, SemanticMotionToken>): string;
}

// Web CSS Generator
export class WebCSSGenerator implements PlatformTokenGenerator {
  generateDurationTokens(tokens: Record<string, number>): string {
    // Generates: --duration-150: 150ms;
    return Object.entries(tokens)
      .map(([name, value]) => `--${toKebabCase(name)}: ${value}ms;`)
      .join('\n');
  }
  
  generateEasingTokens(tokens: Record<string, string>): string {
    // Generates: --easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
    return Object.entries(tokens)
      .map(([name, value]) => `--${toKebabCase(name)}: ${value};`)
      .join('\n');
  }
  
  generateScaleTokens(tokens: Record<string, number>): string {
    // Generates: --scale-088: 0.88;
    return Object.entries(tokens)
      .map(([name, value]) => `--${toKebabCase(name)}: ${value};`)
      .join('\n');
  }
  
  generateSemanticMotionTokens(tokens: Record<string, SemanticMotionToken>): string {
    // Generates: --motion-float-label-duration: var(--duration-250);
    return Object.entries(tokens)
      .map(([name, token]) => {
        const kebabName = toKebabCase(name);
        const duration = `--${kebabName}-duration: var(--${toKebabCase(token.primitiveReferences.duration)});`;
        const easing = `--${kebabName}-easing: var(--${toKebabCase(token.primitiveReferences.easing)});`;
        return `${duration}\n${easing}`;
      })
      .join('\n');
  }
}

// iOS Swift Generator
export class IOSSwiftGenerator implements PlatformTokenGenerator {
  generateDurationTokens(tokens: Record<string, number>): string {
    // Generates: let duration150: TimeInterval = 0.15
    return Object.entries(tokens)
      .map(([name, value]) => `let ${name}: TimeInterval = ${value / 1000}`)
      .join('\n');
  }
  
  generateEasingTokens(tokens: Record<string, string>): string {
    // Generates: let easingStandard = Animation.timingCurve(0.4, 0.0, 0.2, 1.0)
    return Object.entries(tokens)
      .map(([name, value]) => {
        const [, p1, p2, p3, p4] = value.match(/cubic-bezier\(([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/) || [];
        return `let ${name} = Animation.timingCurve(${p1}, ${p2}, ${p3}, ${p4})`;
      })
      .join('\n');
  }
  
  generateScaleTokens(tokens: Record<string, number>): string {
    // Generates: let scale088: CGFloat = 0.88
    return Object.entries(tokens)
      .map(([name, value]) => `let ${name}: CGFloat = ${value}`)
      .join('\n');
  }
  
  generateSemanticMotionTokens(tokens: Record<string, SemanticMotionToken>): string {
    // Generates: struct MotionFloatLabel { let duration = duration250; let easing = easingStandard }
    return Object.entries(tokens)
      .map(([name, token]) => {
        const structName = toPascalCase(name);
        const durationRef = token.primitiveReferences.duration;
        const easingRef = token.primitiveReferences.easing;
        return `struct ${structName} {\n  let duration = ${durationRef}\n  let easing = ${easingRef}\n}`;
      })
      .join('\n\n');
  }
}

// Android Kotlin Generator
export class AndroidKotlinGenerator implements PlatformTokenGenerator {
  generateDurationTokens(tokens: Record<string, number>): string {
    // Generates: val Duration150 = 150
    return Object.entries(tokens)
      .map(([name, value]) => `val ${toPascalCase(name)} = ${value}`)
      .join('\n');
  }
  
  generateEasingTokens(tokens: Record<string, string>): string {
    // Generates: val EasingStandard = CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)
    return Object.entries(tokens)
      .map(([name, value]) => {
        const [, p1, p2, p3, p4] = value.match(/cubic-bezier\(([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\)/) || [];
        return `val ${toPascalCase(name)} = CubicBezierEasing(${p1}f, ${p2}f, ${p3}f, ${p4}f)`;
      })
      .join('\n');
  }
  
  generateScaleTokens(tokens: Record<string, number>): string {
    // Generates: val Scale088 = 0.88f
    return Object.entries(tokens)
      .map(([name, value]) => `val ${toPascalCase(name)} = ${value}f`)
      .join('\n');
  }
  
  generateSemanticMotionTokens(tokens: Record<string, SemanticMotionToken>): string {
    // Generates: object MotionFloatLabel { val duration = Duration250; val easing = EasingStandard }
    return Object.entries(tokens)
      .map(([name, token]) => {
        const objectName = toPascalCase(name);
        const durationRef = toPascalCase(token.primitiveReferences.duration);
        const easingRef = toPascalCase(token.primitiveReferences.easing);
        return `object ${objectName} {\n  val duration = ${durationRef}\n  val easing = ${easingRef}\n}`;
      })
      .join('\n\n');
  }
}

// Utility functions
function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function toPascalCase(str: string): string {
  return str.replace(/^([a-z])/, (_, c) => c.toUpperCase())
    .replace(/\.([a-z])/g, (_, c) => c.toUpperCase());
}
```

---

## Data Models

### Primitive Token Models

```typescript
// Duration Token Model
export interface DurationToken {
  name: string;           // e.g., "duration150"
  value: number;          // Milliseconds (e.g., 150)
  description: string;    // Usage context
}

// Easing Token Model
export interface EasingToken {
  name: string;           // e.g., "easingStandard"
  value: string;          // Cubic bezier curve (e.g., "cubic-bezier(0.4, 0.0, 0.2, 1)")
  description: string;    // Usage context
}

// Scale Token Model
export interface ScaleToken {
  name: string;           // e.g., "scale088"
  value: number;          // Scale factor (e.g., 0.88)
  description: string;    // Usage context
  example?: string;       // Example calculation (e.g., "16px × 0.88 = 14px")
}
```

### Semantic Token Model

```typescript
// Semantic Motion Token Model
export interface SemanticMotionToken {
  name: string;                    // e.g., "motion.floatLabel"
  primitiveReferences: {
    duration: string;              // Reference to duration primitive (e.g., "duration250")
    easing: string;                // Reference to easing primitive (e.g., "easingStandard")
    delay?: string;                // Optional delay reference (for future stagger patterns)
  };
  category: SemanticCategory.MOTION;
  context: string;                 // What this motion is for
  description: string;             // Detailed description
  relatedTokens?: string[];        // Related motion tokens
}
```

### Platform-Specific Output Models

```typescript
// Web CSS Output
export interface WebCSSOutput {
  primitives: {
    durations: string;    // CSS custom properties for durations
    easings: string;      // CSS custom properties for easings
    scales: string;       // CSS custom properties for scales
  };
  semantics: {
    motions: string;      // CSS custom properties for semantic motion tokens
  };
}

// iOS Swift Output
export interface IOSSwiftOutput {
  primitives: {
    durations: string;    // Swift constants for durations (TimeInterval)
    easings: string;      // Swift Animation.timingCurve definitions
    scales: string;       // Swift CGFloat constants
  };
  semantics: {
    motions: string;      // Swift structs for semantic motion tokens
  };
}

// Android Kotlin Output
export interface AndroidKotlinOutput {
  primitives: {
    durations: string;    // Kotlin constants for durations (milliseconds)
    easings: string;      // Kotlin CubicBezierEasing definitions
    scales: string;       // Kotlin Float constants
  };
  semantics: {
    motions: string;      // Kotlin objects for semantic motion tokens
  };
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptance Criteria Testing Prework

**1.1 WHEN the token generation system processes duration tokens THEN the system SHALL generate three primitive duration tokens: duration150, duration250, and duration350**

Thoughts: This is about the system generating a specific set of tokens. We can test this by running the generation system and verifying that exactly these three tokens are present in the output. This applies to all duration tokens regardless of specific values.

Testable: yes - property

**1.2-1.4 WHEN duration150/250/350 is referenced THEN the system SHALL provide a value of 150/250/350 milliseconds**

Thoughts: These are testing that specific tokens have specific values. We can generate random token references and verify the values match expectations. This is about the correctness of token value mapping.

Testable: yes - property

**1.5-1.7 WHEN duration tokens are generated for web/iOS/Android THEN the system SHALL output values in correct format**

Thoughts: This is testing that the same token generates platform-specific output formats. We can test this by generating tokens for each platform and verifying format correctness (ms suffix for web, TimeInterval for iOS, milliseconds for Android).

Testable: yes - property

**2.1-2.4 Easing token generation and values**

Thoughts: Same pattern as duration tokens - testing that specific easing tokens exist and have correct cubic-bezier values.

Testable: yes - property

**2.5-2.7 Easing token platform-specific output**

Thoughts: Testing that easing tokens generate correct platform-specific syntax (CSS cubic-bezier, Swift Animation.timingCurve, Kotlin CubicBezierEasing).

Testable: yes - property

**3.1-3.8 Scale token generation, values, and progression**

Thoughts: Testing that scale tokens exist, have correct values, and follow 8-interval progression. The progression is mathematical and can be verified.

Testable: yes - property

**4.1-4.5 Scale token rounding**

Thoughts: This is testing that the token generation system applies Math.round() to scaled values. We can test this by generating tokens with scale factors and verifying the output is rounded to whole numbers.

Testable: yes - property

**5.1-5.5 Semantic motion token composition**

Thoughts: Testing that semantic tokens correctly reference primitive tokens and maintain compositional pattern. This is about the structure of semantic tokens, not specific values.

Testable: yes - property

**6.1-6.8 Cross-platform token generation**

Thoughts: Testing that tokens generate correctly for all platforms with mathematically equivalent values. This is about platform-specific syntax while maintaining value equivalence.

Testable: yes - property

**7.1-7.5 Reduced motion accessibility**

Thoughts: This is testing that components can detect reduced motion preferences on each platform. This is more about component implementation than token generation, but we can test that the mechanism exists.

Testable: yes - example (platform-specific detection mechanisms)

**8.1-8.5 Token system integration**

Thoughts: Testing that motion tokens follow the same patterns as other semantic tokens (file structure, primitiveReferences property, utility functions).

Testable: yes - property

**9.1-9.5 Incremental expansion structure**

Thoughts: Testing that the system supports adding new tokens without breaking existing ones. This is about backward compatibility and extensibility.

Testable: yes - property

### Property 1: Duration Token Generation Completeness

*For any* token generation execution, the output SHALL contain exactly three duration primitive tokens: duration150, duration250, and duration350

**Validates: Requirements 1.1**

### Property 2: Duration Token Value Correctness

*For any* duration token reference (duration150, duration250, duration350), the resolved value SHALL match the expected millisecond value (150, 250, 350 respectively)

**Validates: Requirements 1.2, 1.3, 1.4**

### Property 3: Duration Token Platform Format Correctness

*For any* duration token generated for a specific platform, the output format SHALL match platform conventions: web uses "ms" suffix, iOS uses TimeInterval (seconds), Android uses milliseconds

**Validates: Requirements 1.5, 1.6, 1.7**

### Property 4: Easing Token Generation Completeness

*For any* token generation execution, the output SHALL contain exactly three easing primitive tokens: easingStandard, easingDecelerate, and easingAccelerate

**Validates: Requirements 2.1**

### Property 5: Easing Token Value Correctness

*For any* easing token reference, the resolved cubic-bezier value SHALL match the expected curve definition

**Validates: Requirements 2.2, 2.3, 2.4**

### Property 6: Easing Token Platform Format Correctness

*For any* easing token generated for a specific platform, the output format SHALL match platform conventions: web uses cubic-bezier CSS, iOS uses Animation.timingCurve, Android uses CubicBezierEasing

**Validates: Requirements 2.5, 2.6, 2.7**

### Property 7: Scale Token Generation Completeness

*For any* token generation execution, the output SHALL contain exactly six scale primitive tokens: scale088, scale092, scale096, scale100, scale104, and scale108

**Validates: Requirements 3.1**

### Property 8: Scale Token Value Correctness

*For any* scale token reference, the resolved value SHALL match the expected scale factor with 8-interval progression maintained

**Validates: Requirements 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**

### Property 9: Scale Token Rounding Correctness

*For any* scale token applied to a base value during token generation, the result SHALL be rounded to the nearest whole number using Math.round()

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

### Property 10: Semantic Motion Token Composition

*For any* semantic motion token, the token SHALL reference primitive tokens via primitiveReferences property and maintain compositional pattern

**Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

### Property 11: Cross-Platform Value Equivalence

*For any* motion token generated for multiple platforms, the mathematical values SHALL be equivalent across platforms despite platform-specific syntax differences

**Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8**

### Property 12: Token System Integration Pattern Consistency

*For any* motion token file structure and export pattern, the implementation SHALL follow the same patterns as existing semantic token systems (color, typography, spacing, shadow)

**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

### Property 13: Incremental Expansion Backward Compatibility

*For any* new motion token added to the system, existing token references SHALL continue to resolve correctly without modification

**Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5**

---

## Error Handling

### Token Generation Errors

**Invalid Primitive Reference**:
```typescript
// Error: Semantic token references non-existent primitive
'motion.invalid': {
  primitiveReferences: {
    duration: 'duration999',  // Does not exist
    easing: 'easingStandard'
  }
}

// Error handling:
throw new TokenGenerationError(
  `Invalid primitive reference: duration999 does not exist in durationTokens`,
  { token: 'motion.invalid', invalidReference: 'duration999' }
);
```

**Platform Generation Failure**:
```typescript
// Error: Platform-specific generation fails
try {
  const webOutput = webGenerator.generateDurationTokens(durationTokens);
} catch (error) {
  throw new PlatformGenerationError(
    `Failed to generate web CSS for duration tokens: ${error.message}`,
    { platform: 'web', tokenType: 'duration', originalError: error }
  );
}
```

**Rounding Precision Loss**:
```typescript
// Warning: Cumulative rounding error at large sizes
const baseSize = 32;
const scaledSize = Math.round(baseSize * scale088);  // 32 × 0.88 = 28.16 → 28

if (Math.abs((baseSize * scale088) - scaledSize) > 0.5) {
  console.warn(
    `Rounding precision loss: ${baseSize}px × ${scale088} = ${baseSize * scale088}px → ${scaledSize}px`,
    { baseSize, scaleFactor: scale088, expectedSize: baseSize * scale088, actualSize: scaledSize }
  );
}
```

### Component Usage Errors

**Missing Reduced Motion Check**:
```typescript
// Error: Component uses motion token without checking reduced motion preference
// This should be caught in code review or linting

// Web - Missing check
.input-label {
  transition: font-size var(--motion-float-label-duration) var(--motion-float-label-easing);
  /* Missing: @media (prefers-reduced-motion: reduce) { transition: none; } */
}

// Linting rule to enforce:
// "motion-tokens-require-reduced-motion-check": "error"
```

**Invalid Token Reference**:
```typescript
// Error: Component references non-existent motion token
const labelMotion = motionTokens['motion.nonexistent'];  // undefined

// Error handling:
if (!labelMotion) {
  throw new TokenReferenceError(
    `Motion token 'motion.nonexistent' does not exist`,
    { requestedToken: 'motion.nonexistent', availableTokens: Object.keys(motionTokens) }
  );
}
```

### Recovery Strategies

**Fallback to Default Values**:
```typescript
// If token generation fails, use safe defaults
const defaultMotion = {
  duration: 250,  // Reasonable default
  easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'  // Material standard
};

try {
  const motion = resolveMotionToken('motion.floatLabel');
} catch (error) {
  console.error('Failed to resolve motion token, using defaults', error);
  return defaultMotion;
}
```

**Graceful Degradation**:
```typescript
// If reduced motion detection fails, disable animations by default (safer)
let reduceMotion = true;  // Default to reduced motion

try {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
} catch (error) {
  console.warn('Failed to detect reduced motion preference, disabling animations', error);
}
```

---

## Testing Strategy

### Unit Testing

**Focus**: Test structural correctness, not philosophical alignment

**Primitive Token Existence**:
- Test that duration tokens exist (duration150, duration250, duration350)
- Test that easing tokens exist (easingStandard, easingDecelerate, easingAccelerate)
- Test that scale tokens exist (scale088, scale092, scale096, scale100, scale104, scale108)
- Test that all tokens have valid numeric/string values

**Semantic Token Structure**:
- Test that semantic tokens correctly reference existing primitive tokens
- Test that primitiveReferences property contains valid token names
- Test that semantic tokens have required properties (name, category, context, description)

**Platform-Specific Generation**:
- Test that generators produce syntactically valid output (CSS, Swift, Kotlin)
- Test that platform-specific format conversion works (ms suffix, TimeInterval, etc.)
- Test that utility functions (toKebabCase, toPascalCase) work correctly

**Error Handling**:
- Test error handling for invalid primitive references
- Test error handling for platform generation failures
- Test fallback to default values when token resolution fails

**Note**: Tests focus on structural correctness (tokens exist, references resolve, syntax valid), not on specific token values or mathematical progressions. Token values can change without breaking tests.

### Property-Based Testing

**Focus**: Test universal properties about structure and behavior, not specific values

**Property Test 1: Token Existence and Type Correctness**
```typescript
// For any duration token, it exists and is a positive number
property('duration tokens exist and are valid numbers', () => {
  const tokens = ['duration150', 'duration250', 'duration350'];
  
  tokens.forEach(tokenName => {
    const value = durationTokens[tokenName];
    expect(value).toBeDefined();
    expect(typeof value).toBe('number');
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(10000);  // Reasonable upper bound
  });
});
```

**Property Test 2: Cross-Platform Value Equivalence**
```typescript
// For any motion token, values are mathematically equivalent across platforms
property('cross-platform value equivalence', () => {
  // Test that web ms = iOS seconds * 1000 = android ms
  const webDuration = 250;  // ms
  const iosDuration = 0.25;  // seconds
  const androidDuration = 250;  // ms
  
  expect(webDuration).toBe(iosDuration * 1000);
  expect(webDuration).toBe(androidDuration);
});
```

**Property Test 3: Scale Token Rounding Correctness**
```typescript
// For any scale token applied to base value, rounding produces expected whole number
property('scale token rounding produces correct whole numbers', () => {
  const baseSize = 16;
  const scaledSize = Math.round(baseSize * scale088);
  
  expect(Number.isInteger(scaledSize)).toBe(true);
  expect(scaledSize).toBe(14);  // 16 × 0.88 = 14.08 → rounds to 14
  
  // Test verifies rounding behavior, not the choice of 0.88
  // If scale088 changes, expected value changes accordingly
});
```

**Property Test 4: Semantic Token Reference Validity**
```typescript
// For any semantic motion token, primitiveReferences point to existing tokens
property('semantic tokens reference valid primitives', () => {
  Object.values(motionTokens).forEach(token => {
    const durationExists = token.primitiveReferences.duration in durationTokens;
    const easingExists = token.primitiveReferences.easing in easingTokens;
    
    expect(durationExists).toBe(true);
    expect(easingExists).toBe(true);
  });
});
```

**Property Test 5: Incremental Expansion Backward Compatibility**
```typescript
// For any new token added, existing token references still resolve
property('adding new tokens does not break existing references', () => {
  const originalTokens = { ...motionTokens };
  
  // Add new token
  motionTokens['motion.newToken'] = {
    name: 'motion.newToken',
    primitiveReferences: { duration: 'duration150', easing: 'easingStandard' },
    category: SemanticCategory.MOTION,
    context: 'New token',
    description: 'Test token'
  };
  
  // Verify original tokens still resolve
  Object.keys(originalTokens).forEach(tokenName => {
    const token = motionTokens[tokenName];
    expect(token).toBeDefined();
    expect(token.primitiveReferences.duration).toBeDefined();
    expect(token.primitiveReferences.easing).toBeDefined();
  });
});
```

**Note**: Property tests verify universal structural properties (tokens exist, references resolve, types correct), not specific values or mathematical progressions. This allows token values to evolve without breaking tests.

### Integration Testing

**Cross-Platform Generation**:
- Generate tokens for all three platforms (web, iOS, Android)
- Verify output files are created with correct syntax
- Verify mathematical equivalence across platforms
- Test that generated tokens can be imported and used in platform-specific code

**Component Integration**:
- Test that Text Input Field component can consume motion.floatLabel token
- Verify animation timing matches expected duration (250ms)
- Verify animation easing matches expected curve (cubic-bezier(0.4, 0.0, 0.2, 1))
- Test reduced motion preference disables animations correctly

**Token System Integration**:
- Verify motion tokens follow same file structure as other semantic tokens
- Test that getMotionToken() and getAllMotionTokens() utility functions work
- Verify motion tokens integrate with existing token generation pipeline

### Accessibility Testing

**Reduced Motion Support**:
- Test that web components respect `prefers-reduced-motion` media query
- Test that iOS components respect `accessibilityReduceMotion` environment variable
- Test that Android components respect `isReduceMotionEnabled` setting
- Verify animations are disabled when reduced motion is enabled
- Test that instant state changes occur when animations are disabled

---

## Design Decisions

### Decision 1: Compositional Pattern (Like Shadow Tokens)

**Options Considered**:
1. Flat token structure (like Polaris: `motion.fast`, `motion.normal`, `motion.slow`)
2. Nested categories (like Material: `motion.duration.fast`, `motion.easing.standard`)
3. Compositional semantic tokens (like Shadow: compose primitives into semantic tokens)

**Decision**: Compositional semantic tokens

**Rationale**:
- Matches existing Shadow and Typography token patterns
- Semantic tokens have clear meaning (`motion.floatLabel` vs `motion.normal`)
- Primitives can be reused in different combinations
- Simpler than nested categories, more structured than flat tokens
- Industry-aligned (simpler approach) but maintains DesignerPunk's compositional architecture

**Trade-offs**:
- ✅ Gained: Consistency with existing patterns, semantic clarity, reusable primitives
- ❌ Lost: Simplicity of flat structure (but gained semantic meaning)
- ⚠️ Risk: Might need many semantic tokens (mitigated by only creating when patterns emerge)

**Counter-Arguments**:
- **Argument**: Flat structure is simpler and easier to understand
- **Response**: Semantic meaning is more valuable than structural simplicity. `motion.floatLabel` clearly indicates purpose, while `motion.normal` requires context to understand usage.

### Decision 2: Material Design Easing Curves

**Options Considered**:
1. Material Design curves (industry standard)
2. Custom curves (brand-specific motion)
3. CSS defaults (ease, ease-in, ease-out)

**Decision**: Material Design curves

**Rationale**:
- Industry-proven curves that feel natural
- Cross-platform familiarity (developers know these curves)
- Well-documented and tested
- Can add custom curves later if brand needs emerge

**Trade-offs**:
- ✅ Gained: Proven curves, developer familiarity, cross-platform consistency
- ❌ Lost: Unique brand motion personality (can add later)

**Counter-Arguments**:
- **Argument**: Custom curves would create unique brand motion personality
- **Response**: Start with proven curves, add custom curves when brand motion language is defined. Premature customization risks poor motion feel.

### Decision 3: Mathematical Duration Progression

**Options Considered**:
1. Linear progression (150, 250, 350 - +100ms steps)
2. Exponential progression (150, 250, 400 - increasing steps)
3. Material Design values (100, 200, 300, 400, 500)

**Decision**: Linear progression (150, 250, 350)

**Rationale**:
- Aligns with DesignerPunk's mathematical token foundation
- Simple, predictable progression
- 150ms is faster than Material's 200ms (feels more responsive)
- 350ms is slower than Material's 300ms (more deliberate)

**Trade-offs**:
- ✅ Gained: Mathematical consistency, responsive feel, deliberate slow animations
- ❌ Lost: Material Design familiarity for duration values
- ⚠️ Risk: 150ms might be too fast for some animations (can adjust if needed)

**Counter-Arguments**:
- **Argument**: Material Design's 100-500ms range provides more granularity
- **Response**: Start with three values based on actual needs (Text Input Field). Add more durations when patterns emerge requiring finer granularity.

### Decision 4: Scale Token Rounding in Generation System

**Options Considered**:
1. Components handle rounding (each platform implements Math.round())
2. Token generation system handles rounding (pre-rounded values)
3. No rounding (accept subpixel values)

**Decision**: Token generation system handles rounding

**Rationale**:
- Separation of concerns: token system handles rounding, components consume values
- Consistency: all platforms get same rounded values from single source of truth
- Simplicity: components don't need rounding logic
- Predictable outcomes: `scale088` × 16px always produces 14px

**Trade-offs**:
- ✅ Gained: Consistent rendering, single source of truth, simple components
- ❌ Lost: Sub-pixel precision (negligible for most use cases)
- ⚠️ Risk: Cumulative rounding error at very large sizes

**Counter-Arguments**:
- **Argument**: Sub-pixel precision is important for smooth animations
- **Response**: Transform animations (GPU-accelerated) handle subpixel values fine. Rounding applies to generated typography tokens, not transform scale values during animation.

### Decision 5: Incremental Expansion (Fill What We Need)

**Options Considered**:
1. Comprehensive from day one (all duration/easing/delay tokens upfront)
2. Incremental expansion (fill only what's needed, document structure for future)
3. Minimal approach (only motion.floatLabel, no expansion structure)

**Decision**: Incremental expansion

**Rationale**:
- Avoids over-engineering (don't guess at future needs)
- Documents expansion pattern for consistency
- Provides structure without implementation overhead
- Aligns with DesignerPunk's "fill what we need" philosophy

**Trade-offs**:
- ✅ Gained: Avoid premature complexity, clear expansion pattern, pragmatic approach
- ❌ Lost: Immediate comprehensive token coverage
- ⚠️ Risk: Might need to add tokens frequently as patterns emerge

**Counter-Arguments**:
- **Argument**: Comprehensive approach prevents future restructuring
- **Response**: Documented expansion pattern provides same benefit without implementation cost. Add tokens when real use cases emerge, not speculatively.

---

**Organization**: spec-design  
**Scope**: 014-motion-token-system