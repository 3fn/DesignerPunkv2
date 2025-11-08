# Platform Conventions Guide

**Date**: November 8, 2025
**Purpose**: Document intentional platform-specific design decisions in DesignerPunk
**Organization**: process-standard
**Scope**: cross-project

---

## Overview

This guide documents intentional platform-specific design decisions in the DesignerPunk design system. These decisions respect platform conventions and APIs rather than forcing artificial uniformity across platforms.

**True Native Architecture Principle**: The system prioritizes platform-appropriate design over artificial consistency. Cross-platform consistency is achieved through mathematical foundations and token values, not through forcing identical implementation patterns.

**Why This Guide Exists**: During the Phase 1 Architecture Audit, several platform differences were initially flagged as "inconsistencies." Investigation revealed these are intentional design decisions that respect platform conventions. This guide documents these decisions to prevent future misidentification as issues.

---

## Constructor Patterns

### Design Decision

**iOS**: No constructor (single output format)
**Android**: Constructor for format selection (Kotlin/XML)
**Web**: Constructor for format selection (CSS/JavaScript)

### Rationale

Constructors are only needed when multiple output formats exist. iOS only generates Swift code, so no format selection is needed. Android and Web support multiple output formats, requiring a constructor to specify which format to generate.

### Implementation

**iOS Format Generator**:
```typescript
export class iOSFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'ios';
  readonly formats: OutputFormat[] = ['swift'];  // Only ONE format
  
  // No constructor needed - always generates Swift
}
```

**Android Format Generator**:
```typescript
export class AndroidFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'android';
  readonly formats: OutputFormat[] = ['kotlin', 'xml'];  // TWO formats
  
  private outputFormat: OutputFormat;
  
  constructor(outputFormat: OutputFormat = 'kotlin') {  // Constructor to choose format
    super();
    this.outputFormat = outputFormat;
  }
}
```

**Web Format Generator**:
```typescript
export class WebFormatGenerator extends BaseFormatProvider {
  readonly platform: TargetPlatform = 'web';
  readonly formats: OutputFormat[] = ['css', 'javascript'];  // TWO formats
  
  private outputFormat: OutputFormat;
  
  constructor(outputFormat: OutputFormat = 'css') {  // Constructor to choose format
    super();
    this.outputFormat = outputFormat;
  }
}
```

### Usage

```typescript
// iOS - No constructor, always Swift
const iosGenerator = new iOSFormatGenerator();

// Android - Constructor to choose format
const androidKotlin = new AndroidFormatGenerator('kotlin');
const androidXML = new AndroidFormatGenerator('xml');

// Web - Constructor to choose format
const webCSS = new WebFormatGenerator('css');
const webJS = new WebFormatGenerator('javascript');
```

### Why This Is Correct

- **iOS doesn't need format selection** - There's only one format (Swift)
- **Android/Web need format selection** - Multiple formats require choice
- **Forcing iOS to have a constructor would be artificial** - It would accept a parameter that has no effect
- **True Native Architecture** - Respects platform-specific needs

### Related Specs

- `.kiro/specs/cross-platform-build-system/design.md` - Original design decision
- `.kiro/specs/semantic-token-generation/design.md` - Implementation details

---

## Method Naming

### Design Decision

**iOS**: `getSwiftType()` - Returns Swift-specific types
**Android**: `getKotlinType()` - Returns Kotlin-specific types
**Web**: No type method - Inline handling for simple type system

### Rationale

Method names are platform-specific because they return platform-specific types. Each platform has a fundamentally different type system, and the method names communicate WHAT they return.

### Platform Type Systems

**iOS (Swift)**:
- `CGFloat` - Floating-point numbers for layout and graphics
- `UIColor` - Color values
- `UIFont.Weight` - Font weight constants
- `String` - Text values

**Android (Kotlin)**:
- `Float` - Floating-point numbers
- `Color` - Color values
- `Int` - Integer values (font weights)
- `String` - Text values

**Web (CSS/JavaScript)**:
- Numbers - All numeric values
- Strings - All text values
- No complex type system - Simple primitives

### Implementation

**iOS Format Generator**:
```typescript
private getSwiftType(category: string, unit: string): string {
  switch (category) {
    case 'spacing':
    case 'radius':
    case 'fontSize':
      return 'CGFloat';
    case 'color':
      return 'UIColor';
    case 'fontWeight':
      return 'UIFont.Weight';
    case 'fontFamily':
      return 'String';
    default:
      return 'CGFloat';
  }
}
```

**Android Format Generator**:
```typescript
private getKotlinType(category: string, unit: string): string {
  switch (category) {
    case 'spacing':
    case 'radius':
    case 'fontSize':
      return 'Float';
    case 'color':
      return 'Color';
    case 'fontWeight':
      return 'Int';
    case 'fontFamily':
      return 'String';
    default:
      return 'Float';
  }
}
```

**Web Format Generator**:
```typescript
// No getType() method needed
// Web uses inline type handling because type system is simple:
// - Numbers for numeric values
// - Strings for text values
```

### Why This Is Correct

- **Method names reflect platform reality** - `getSwiftType()` returns Swift types, `getKotlinType()` returns Kotlin types
- **Web doesn't need this method** - Simple type system doesn't require complex type mapping
- **Forcing uniform names would obscure meaning** - A generic `getPlatformType()` doesn't communicate what types are returned
- **True Native Architecture** - Method names reflect platform-specific type systems

### Related Specs

- `src/providers/iOSFormatGenerator.ts` (lines 120-145)
- `src/providers/AndroidFormatGenerator.ts`
- `src/providers/WebFormatGenerator.ts`

---

## Z-Index/Elevation Scaling

### Design Decision

**Web**: Direct values (100, 200, 300, 400, ...)
**iOS**: Scaled by 100 (1, 2, 3, 4, ...)
**Android**: [Document Android convention when implemented]

### Rationale

Z-index scaling respects platform-native layering conventions. Web uses large integer values (100, 200, 300) which is standard CSS z-index practice. iOS scales these down by 100 to get small decimal values (1, 2, 3) which matches SwiftUI layering conventions.

### Implementation

**Token Definition** (Platform-agnostic):
```typescript
export const layeringTokens = {
  elevation: {
    modal: 100,      // Base value
    dropdown: 200,
    tooltip: 300,
    notification: 400
  }
};
```

**Web Generation** (Direct values):
```css
/* Web CSS - Direct values */
.modal {
  z-index: 100;
}

.dropdown {
  z-index: 200;
}
```

**iOS Generation** (Scaled by 100):
```swift
// iOS Swift - Scaled down by 100
struct DesignTokens {
    static let elevationModal: CGFloat = 1.0      // 100 / 100
    static let elevationDropdown: CGFloat = 2.0   // 200 / 100
}

// Usage in SwiftUI
.zIndex(DesignTokens.elevationModal)  // 1.0
```

**Code Implementation**:
```typescript
// src/providers/iOSFormatGenerator.ts (lines 24-27)
// For z-index tokens, scale down values (divide by 100) for SwiftUI conventions
// Web uses 100, 200, 300... but iOS uses 1, 2, 3...
if (token.category === 'layering') {
  value = token.value / 100;  // Intentional scaling
}
```

### Why This Is Correct

- **Respects platform conventions** - Web developers expect z-index values like 100/200/300, iOS developers expect zIndex values like 1/2/3
- **Platform-native patterns** - Each platform uses its standard layering approach
- **Mathematical consistency maintained** - The relationships between layers are preserved (modal < dropdown < tooltip)
- **True Native Architecture** - Respects platform-specific layering conventions

### Related Specs

- `.kiro/specs/layering-token-system/design.md` - Original design decision and rationale
- `src/providers/iOSFormatGenerator.ts` (lines 24-27) - Implementation with comments

---

## Opacity/Alpha Terminology

### Design Decision

**Web**: "opacity" (CSS property name)
**iOS**: "opacity" (SwiftUI API)
**Android**: "alpha" (Jetpack Compose API)

### Rationale

Terminology matches platform API conventions. Generated code should use the same terminology as platform documentation and APIs to match developer expectations and enable easy integration.

### Platform APIs

**Web (CSS)**:
```css
/* CSS uses "opacity" property */
.button:disabled {
  opacity: 0.48;
}

/* CSS rgba() uses "alpha" channel but property is "opacity" */
background: rgba(0, 0, 0, 0.32);
```

**iOS (SwiftUI)**:
```swift
// SwiftUI uses .opacity() modifier
Button("Click")
    .opacity(0.48)

// SwiftUI Color uses opacity parameter
Color(red: 0.42, green: 0.31, blue: 0.64, opacity: 0.48)
```

**Android (Jetpack Compose)**:
```kotlin
// Compose uses .alpha() modifier
Button(
    modifier = Modifier.alpha(0.48f)
)

// Compose Color uses alpha parameter
Color(0xFF6B50A4).copy(alpha = 0.48f)
```

### Implementation

**iOS Format Generator**:
```typescript
/**
 * Generate SwiftUI opacity modifier
 * Outputs: .opacity(0.48)
 */
generateOpacityModifier(opacityValue: number): string {
  return `.opacity(${opacityValue})`;
}

/**
 * Generate SwiftUI Color with opacity parameter
 * Outputs: Color(red: r, green: g, blue: b, opacity: 0.48)
 */
generateColorWithOpacity(r: number, g: number, b: number, opacity: number): string {
  return `Color(red: ${r}, green: ${g}, blue: ${b}, opacity: ${opacity})`;
}
```

**Android Format Generator**:
```typescript
/**
 * Generate Jetpack Compose alpha modifier
 * Outputs: Modifier.alpha(0.48f)
 */
generateAlphaModifier(token: OpacityToken): string {
  return `Modifier.alpha(${token.baseValue}f)`;
}

/**
 * Generate Jetpack Compose Color.copy with alpha
 * Outputs: Color(0xFF6B50A4).copy(alpha = 0.48f)
 */
generateColorWithAlpha(color: string, opacity: OpacityToken): string {
  return `Color(${this.parseColorToHex(color)}).copy(alpha = ${token.baseValue}f)`;
}
```

### Why This Is Correct

- **Matches platform APIs** - Generated code uses the same terminology as platform documentation
- **Developer expectations** - iOS/Web developers expect "opacity", Android developers expect "alpha"
- **Seamless integration** - Generated code integrates naturally with platform code
- **True Native Architecture** - Respects platform API terminology

### Related Specs

- `.kiro/specs/opacity-tokens/design.md` (Platform Translation section)
- `src/providers/iOSFormatGenerator.ts` (opacity methods)
- `src/providers/AndroidFormatGenerator.ts` (alpha methods)

---

## Summary: True Native Architecture

These platform-specific design decisions demonstrate the True Native Architecture principle:

**Cross-platform consistency is achieved through**:
- ✅ Mathematical foundations (same base values, same relationships)
- ✅ Token values (same semantic meaning across platforms)
- ✅ Architectural patterns (same generation approach)

**Cross-platform consistency is NOT achieved through**:
- ❌ Forcing identical implementation patterns
- ❌ Ignoring platform conventions
- ❌ Artificial uniformity that violates platform norms

**The Result**:
- Developers on each platform get code that feels native to their platform
- Mathematical consistency is maintained through token values and relationships
- Platform-specific conventions are respected
- Generated code integrates seamlessly with platform APIs and documentation

---

## For Future Development

When encountering platform differences, ask:

1. **Is this difference intentional?** - Check design specs and implementation comments
2. **Does it respect platform conventions?** - Compare with platform documentation and APIs
3. **Is mathematical consistency maintained?** - Verify token values and relationships are preserved
4. **Would forcing uniformity break platform integration?** - Consider impact on developer experience

If the answer to questions 1-3 is "yes" and question 4 is "yes", the difference is likely intentional platform-appropriate design, not an issue.

---

**Organization**: process-standard
**Scope**: cross-project

*This guide documents intentional platform-specific design decisions to prevent future misidentification as issues and to explain the True Native Architecture principle in practice.*
