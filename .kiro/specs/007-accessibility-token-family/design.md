# Design Document: Accessibility Token Family

**Date**: November 19, 2025
**Spec**: 007 - Accessibility Token Family
**Status**: Design Phase
**Dependencies**: None (foundational infrastructure)

---

## Overview

The Accessibility Token Family creates a centralized semantic token category for accessibility-specific design values that support WCAG compliance. This design establishes the `accessibility` namespace with initial focus on focus indicator tokens (offset, width, color), while providing an extensible pattern for future accessibility tokens.

The design integrates seamlessly with existing token infrastructure (registries, validation, cross-platform generation) and follows compositional architecture principles where accessibility tokens reference primitive or semantic tokens for their values.

**Key Design Goals**:
- Establish clear "usability vs accessibility" distinction
- Provide WCAG traceability for all tokens
- Enable AI agent discoverability through semantic naming
- Integrate with existing token infrastructure
- Support future extensibility (motion, contrast, text tokens)

---

## Architecture

### Token Structure

```typescript
// src/tokens/semantic/AccessibilityTokens.ts

import { space050 } from '../SpacingTokens';
import { border } from '../BorderTokens';
import { color } from './ColorTokens';

/**
 * Accessibility Token Family
 * 
 * Semantic tokens for accessibility-specific design values that support
 * WCAG compliance and inclusive design. These tokens serve users with
 * specific accessibility needs (keyboard navigation, screen readers,
 * motor impairments, visual impairments) rather than general usability.
 * 
 * Decision Framework: "Is this for usability (for everyone) or 
 * accessibility (usability for specific needs)?"
 * 
 * @see https://www.w3.org/WAI/WCAG21/quickref/
 */
export const accessibility = {
  /**
   * Focus Indicator Tokens
   * 
   * Tokens for keyboard focus indicators that help users navigate
   * interfaces using keyboard controls.
   * 
   * WCAG: 2.4.7 Focus Visible (Level AA)
   * WCAG: 1.4.11 Non-text Contrast (Level AA) - 3:1 minimum for focus indicators
   */
  focus: {
    /**
     * Focus indicator outline offset from component bounds
     * 
     * @value space050 (2px)
     * @wcag 2.4.7 Focus Visible (Level AA)
     * @usage Position focus outline outside element bounds
     * @example outlineOffset: accessibility.focus.offset
     */
    offset: space050,
    
    /**
     * Focus indicator outline width
     * 
     * @value border.emphasis (2px)
     * @wcag 2.4.7 Focus Visible (Level AA)
     * @usage Render focus outline with specified width
     * @example outlineWidth: accessibility.focus.width
     */
    width: border.emphasis,
    
    /**
     * Focus indicator outline color
     * 
     * @value color.primary
     * @wcag 2.4.7 Focus Visible (Level AA)
     * @wcag 1.4.11 Non-text Contrast (Level AA) - 3:1 minimum
     * @usage Apply color to focus outline
     * @example outlineColor: accessibility.focus.color
     */
    color: color.primary,
  },
  
  // Future token categories (not in initial implementation):
  // motion: { ... },
  // contrast: { ... },
  // text: { ... },
};
```

### Compositional Architecture

All accessibility tokens follow compositional architecture by referencing existing primitive or semantic tokens:

| Accessibility Token | References | Value | Type |
|---------------------|------------|-------|------|
| `accessibility.focus.offset` | `space050` | 2px | Primitive |
| `accessibility.focus.width` | `border.emphasis` | 2px | Primitive |
| `accessibility.focus.color` | `color.primary` | purple300 | Semantic |

**Benefits**:
- Accessibility tokens stay consistent with mathematical token system
- Changes to primitive values automatically propagate to accessibility tokens
- No duplication of values across token categories
- Clear semantic meaning while maintaining flexibility

---

## Components and Interfaces

### TypeScript Type Definitions

```typescript
// src/tokens/semantic/AccessibilityTokens.ts

/**
 * Focus indicator token structure
 * 
 * Note: These types describe the resolved values, not the token references.
 * The implementation uses compositional architecture (references existing tokens),
 * but TypeScript sees the resolved primitive values.
 * 
 * Example:
 * - offset: number (resolves from space050 → 2)
 * - width: number (resolves from border.emphasis → 2)
 * - color: string (resolves from color.primary → "#3B82F6")
 */
export interface FocusTokens {
  /** Focus indicator outline offset - resolves to number (2px from space050) */
  offset: number;
  
  /** Focus indicator outline width - resolves to number (2px from border.emphasis) */
  width: number;
  
  /** Focus indicator outline color - resolves to string (from color.primary) */
  color: string;
}

/**
 * Accessibility token family structure
 */
export interface AccessibilityTokens {
  /** Focus indicator tokens for keyboard navigation */
  focus: FocusTokens;
  
  // Future token categories:
  // motion?: MotionTokens;
  // contrast?: ContrastTokens;
  // text?: TextTokens;
}

/**
 * Accessibility token family
 * 
 * Implementation uses compositional architecture - references existing tokens
 * rather than hard-coded values. This ensures consistency with the mathematical
 * token system and allows changes to propagate automatically.
 */
export const accessibility: AccessibilityTokens = {
  focus: {
    offset: space050,        // References primitive token (compositional)
    width: border.emphasis,  // References primitive token (compositional)
    color: color.primary,    // References semantic token (compositional)
  },
};
```

### Token Registry Integration

```typescript
// src/tokens/registries/SemanticTokenRegistry.ts

import { accessibility } from '../semantic/AccessibilityTokens';

export class SemanticTokenRegistry {
  private tokens: Map<string, any> = new Map();
  
  constructor() {
    // Register accessibility tokens
    this.registerCategory('accessibility', accessibility);
    
    // Register other semantic token categories
    this.registerCategory('color', color);
    this.registerCategory('typography', typography);
    this.registerCategory('space', space);
  }
  
  /**
   * Register a token category
   */
  private registerCategory(name: string, tokens: any): void {
    this.tokens.set(name, tokens);
  }
  
  /**
   * Resolve a token reference
   * @example resolveToken('accessibility.focus.offset') => 2
   */
  public resolveToken(reference: string): any {
    const parts = reference.split('.');
    let current = this.tokens.get(parts[0]);
    
    for (let i = 1; i < parts.length; i++) {
      current = current?.[parts[i]];
    }
    
    return current;
  }
}
```

---

## Cross-Platform Generation

### Web (CSS Custom Properties)

```typescript
// src/generators/WebCSSGenerator.ts

export class WebCSSGenerator {
  /**
   * Generate CSS custom properties for accessibility tokens
   */
  generateAccessibilityTokens(): string {
    return `
/* Accessibility Tokens - Focus Indicators */
/* WCAG 2.4.7 Focus Visible (Level AA) */

--accessibility-focus-offset: 2px;
--accessibility-focus-width: 2px;
--accessibility-focus-color: var(--color-primary);

/* Usage Example:
 * button:focus-visible {
 *   outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
 *   outline-offset: var(--accessibility-focus-offset);
 * }
 */
    `.trim();
  }
}
```

**Generated Output** (`dist/web/tokens.css`):
```css
/* Accessibility Tokens - Focus Indicators */
--accessibility-focus-offset: 2px;
--accessibility-focus-width: 2px;
--accessibility-focus-color: var(--color-primary);
```

### iOS (Swift Constants)

```typescript
// src/generators/iOSSwiftGenerator.ts

export class iOSSwiftGenerator {
  /**
   * Generate Swift constants for accessibility tokens
   */
  generateAccessibilityTokens(): string {
    return `
// Accessibility Tokens - Focus Indicators
// WCAG 2.4.7 Focus Visible (Level AA)

let accessibilityFocusOffset: CGFloat = 2
let accessibilityFocusWidth: CGFloat = 2
let accessibilityFocusColor: Color = .primary

// Usage Example:
// .overlay(
//     RoundedRectangle(cornerRadius: cornerRadius + accessibilityFocusOffset)
//         .stroke(accessibilityFocusColor, lineWidth: accessibilityFocusWidth)
//         .padding(-accessibilityFocusOffset)
// )
    `.trim();
  }
}
```

**Generated Output** (`dist/ios/DesignTokens.swift`):
```swift
// Accessibility Tokens - Focus Indicators
let accessibilityFocusOffset: CGFloat = 2
let accessibilityFocusWidth: CGFloat = 2
let accessibilityFocusColor: Color = .primary
```

### Android (Kotlin Constants)

```typescript
// src/generators/AndroidKotlinGenerator.ts

export class AndroidKotlinGenerator {
  /**
   * Generate Kotlin constants for accessibility tokens
   */
  generateAccessibilityTokens(): string {
    return `
// Accessibility Tokens - Focus Indicators
// WCAG 2.4.7 Focus Visible (Level AA)

val accessibilityFocusOffset = 2.dp
val accessibilityFocusWidth = 2.dp
val accessibilityFocusColor = colorPrimary

// Usage Example:
// .border(
//     width = accessibilityFocusWidth,
//     color = accessibilityFocusColor,
//     shape = RoundedCornerShape(cornerRadius + accessibilityFocusOffset)
// )
    `.trim();
  }
}
```

**Generated Output** (`dist/android/DesignTokens.kt`):
```kotlin
// Accessibility Tokens - Focus Indicators
val accessibilityFocusOffset = 2.dp
val accessibilityFocusWidth = 2.dp
val accessibilityFocusColor = colorPrimary
```

---

## Validation Strategy

### WCAG Compliance Validation

```typescript
// src/validation/WCAGValidator.ts

/**
 * Validator for WCAG compliance of accessibility tokens
 */
export class WCAGValidator {
  /**
   * Validate focus indicator contrast ratio
   * WCAG 1.4.11 Non-text Contrast (Level AA) - 3:1 minimum
   */
  validateFocusContrast(
    focusColor: string,
    backgroundColor: string
  ): ValidationResult {
    const contrastRatio = this.calculateContrastRatio(focusColor, backgroundColor);
    const minimumRatio = 3.0; // WCAG 1.4.11 Level AA
    
    if (contrastRatio >= minimumRatio) {
      return {
        level: 'pass',
        message: `Focus indicator contrast ratio ${contrastRatio.toFixed(2)}:1 meets WCAG 1.4.11 (minimum 3:1)`,
      };
    } else {
      return {
        level: 'error',
        message: `Focus indicator contrast ratio ${contrastRatio.toFixed(2)}:1 fails WCAG 1.4.11 (minimum 3:1)`,
        wcag: '1.4.11 Non-text Contrast (Level AA)',
      };
    }
  }
  
  /**
   * Validate focus indicator visibility
   * WCAG 2.4.7 Focus Visible (Level AA)
   */
  validateFocusVisibility(
    offset: number,
    width: number
  ): ValidationResult {
    const minimumWidth = 1; // Minimum 1px for visibility
    const minimumOffset = 0; // Can be 0 or positive
    
    if (width >= minimumWidth && offset >= minimumOffset) {
      return {
        level: 'pass',
        message: `Focus indicator (${width}px width, ${offset}px offset) meets WCAG 2.4.7 visibility requirements`,
      };
    } else {
      return {
        level: 'error',
        message: `Focus indicator (${width}px width, ${offset}px offset) fails WCAG 2.4.7 visibility requirements`,
        wcag: '2.4.7 Focus Visible (Level AA)',
      };
    }
  }
}
```

### Three-Tier Validation Integration

```typescript
// src/validation/ThreeTierValidator.ts

export class ThreeTierValidator {
  /**
   * Validate accessibility tokens
   */
  validateAccessibilityTokens(tokens: AccessibilityTokens): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    // Validate focus indicator offset
    if (tokens.focus.offset < 0) {
      results.push({
        level: 'error',
        message: 'Focus offset must be non-negative',
        token: 'accessibility.focus.offset',
      });
    } else if (tokens.focus.offset === 0) {
      results.push({
        level: 'warning',
        message: 'Focus offset of 0px may reduce visibility - consider 2px for better separation',
        token: 'accessibility.focus.offset',
      });
    } else {
      results.push({
        level: 'pass',
        message: `Focus offset ${tokens.focus.offset}px provides clear separation`,
        token: 'accessibility.focus.offset',
      });
    }
    
    // Validate focus indicator width
    if (tokens.focus.width < 1) {
      results.push({
        level: 'error',
        message: 'Focus width must be at least 1px for visibility',
        token: 'accessibility.focus.width',
      });
    } else if (tokens.focus.width < 2) {
      results.push({
        level: 'warning',
        message: 'Focus width below 2px may reduce visibility - consider 2px for better clarity',
        token: 'accessibility.focus.width',
      });
    } else {
      results.push({
        level: 'pass',
        message: `Focus width ${tokens.focus.width}px provides clear visibility`,
        token: 'accessibility.focus.width',
      });
    }
    
    return results;
  }
}
```

---

## Design Decisions

### Decision 1: Centralized Accessibility Family vs Distributed Tokens

**Options Considered**:
1. Centralized accessibility family (`accessibility.focus.offset`)
2. Distributed across existing categories (`space.focus.offset`, `border.focus.width`)

**Decision**: Centralized accessibility family

**Rationale**:
- **Intent clarity**: `accessibility.focus.offset` immediately signals accessibility purpose
- **Discoverability**: AI agents and developers find all a11y tokens in one location
- **WCAG traceability**: Direct mapping to WCAG success criteria
- **Related properties grouped**: focus.offset, focus.width, focus.color together
- **Reduces ambiguity**: Clear that these are compliance requirements, not design preferences

**Trade-offs**:
- ✅ **Gained**: Clear semantic meaning, better discoverability, WCAG traceability
- ✅ **Gained**: AI-friendly reasoning path ("need a11y feature? check accessibility.*")
- ❌ **Lost**: Slight additional abstraction layer (accessibility.focus.offset → space050)
- ⚠️ **Risk**: Could become catch-all for any "good practice" token (mitigated by decision framework)

**Counter-Arguments**:
- **Argument**: "Distributed is more DRY (Don't Repeat Yourself)"
- **Response**: Both approaches reference primitives equally. Centralized adds semantic layer without duplication.
- **Argument**: "Distributed keeps categories pure"
- **Response**: But `space.focus.offset` IS about accessibility (WCAG 2.4.7). Centralized separates concerns better.

### Decision 2: Usability vs Accessibility Distinction

**Options Considered**:
1. Include all "good practices" in accessibility family (touch targets, spacing, etc.)
2. Strict distinction: only tokens for specific accessibility needs
3. Hybrid: some usability tokens in accessibility family if WCAG-related

**Decision**: Strict distinction - only tokens for specific accessibility needs

**Rationale**:
- **Focus and clarity**: Accessibility family remains focused and meaningful
- **Decision framework**: Clear question: "Is this for usability (for everyone) or accessibility (usability for specific needs)?"
- **Touch targets example**: 44px minimum benefits all users (usability), not just users with motor impairments (accessibility)
- **Focus indicators example**: Specifically for keyboard navigation users (accessibility)

**Examples**:

**Usability (NOT in accessibility family)**:
- Touch target minimum size (44px) - benefits all users on touch devices
- Comfortable spacing between elements - benefits all users
- Clear visual hierarchy - benefits all users
- Readable font sizes - benefits all users

**Accessibility (IN accessibility family)**:
- Focus indicators - specifically for keyboard navigation users
- Reduced motion preferences - specifically for users with vestibular disorders
- High contrast modes - specifically for users with visual impairments
- Screen reader labels - specifically for blind users

**Trade-offs**:
- ✅ **Gained**: Clear, focused accessibility token family
- ✅ **Gained**: Easy decision-making for future tokens
- ❌ **Lost**: Some WCAG-related tokens (like touch targets) not in accessibility family
- ⚠️ **Risk**: Confusion about where WCAG-related usability tokens belong (mitigated by documentation)

### Decision 3: Initial Scope - Focus Indicators Only

**Options Considered**:
1. Comprehensive accessibility tokens (focus, motion, contrast, text, etc.)
2. Focus indicators only with extensibility pattern
3. Focus indicators + touch targets

**Decision**: Focus indicators only with extensibility pattern

**Rationale**:
- **Minimal viable scope**: Unblocks ButtonCTA (Spec 005) with minimal implementation
- **Establishes pattern**: Creates foundation for future accessibility tokens
- **Reduces risk**: Smaller scope = faster implementation, easier to validate
- **Touch targets excluded**: Touch targets serve general usability (see Decision 2)

**Trade-offs**:
- ✅ **Gained**: Fast implementation, clear pattern establishment
- ✅ **Gained**: Unblocks ButtonCTA immediately
- ❌ **Lost**: Other accessibility tokens need separate implementation
- ⚠️ **Risk**: Pattern might need adjustment based on future token needs (mitigated by extensibility design)

### Decision 4: Reference Existing Tokens vs Create New Primitives

**Options Considered**:
1. Reference existing tokens (`space050`, `border.emphasis`, `color.primary`)
2. Create new accessibility-specific primitives (`accessibilityOffset050`, etc.)
3. Hybrid: some reference, some new

**Decision**: Reference existing tokens (compositional architecture)

**Rationale**:
- **Consistency**: Accessibility tokens stay aligned with mathematical token system
- **No duplication**: Single source of truth for values (2px is space050 everywhere)
- **Automatic updates**: Changes to primitives propagate to accessibility tokens
- **Follows pattern**: Same approach as other semantic tokens (color, typography, spacing)

**Trade-offs**:
- ✅ **Gained**: Consistency, no duplication, automatic updates
- ✅ **Gained**: Follows established compositional architecture pattern
- ❌ **Lost**: Accessibility tokens can't have independent values from primitives
- ⚠️ **Risk**: Changing primitive affects accessibility (acceptable - intentional coupling)

---

## Integration Points

### Token Registry Integration

```typescript
// src/tokens/semantic/index.ts

export { accessibility } from './AccessibilityTokens';
export { color } from './ColorTokens';
export { typography } from './TypographyTokens';
export { space } from './SpacingTokens';
```

### Build System Integration

```json
// package.json
{
  "scripts": {
    "build": "tsc && npm run generate:tokens",
    "generate:tokens": "node scripts/generateTokens.js",
    "build:watch": "tsc --watch"
  }
}
```

```typescript
// scripts/generateTokens.js

import { WebCSSGenerator } from '../src/generators/WebCSSGenerator';
import { iOSSwiftGenerator } from '../src/generators/iOSSwiftGenerator';
import { AndroidKotlinGenerator } from '../src/generators/AndroidKotlinGenerator';

// Generate accessibility tokens for all platforms
const webGenerator = new WebCSSGenerator();
const iosGenerator = new iOSSwiftGenerator();
const androidGenerator = new AndroidKotlinGenerator();

webGenerator.generateAccessibilityTokens();
iosGenerator.generateAccessibilityTokens();
androidGenerator.generateAccessibilityTokens();
```

### Component Usage

```typescript
// ButtonCTA component using accessibility tokens
import { accessibility } from '@/tokens/semantic';

const ButtonCTA = ({ label, size, style, onPress }: ButtonProps) => {
  return (
    <button
      onClick={onPress}
      style={{
        // ... other styles
      }}
      css={`
        &:focus-visible {
          outline: ${accessibility.focus.width}px solid ${accessibility.focus.color};
          outline-offset: ${accessibility.focus.offset}px;
        }
      `}
    >
      {label}
    </button>
  );
};
```

---

## Testing Strategy

### Unit Tests

```typescript
// src/tokens/semantic/__tests__/AccessibilityTokens.test.ts

describe('AccessibilityTokens', () => {
  describe('focus tokens', () => {
    it('should reference correct primitive tokens', () => {
      expect(accessibility.focus.offset).toBe(space050);
      expect(accessibility.focus.width).toBe(border.emphasis);
      expect(accessibility.focus.color).toBe(color.primary);
    });
    
    it('should have correct values', () => {
      expect(accessibility.focus.offset).toBe(2);
      expect(accessibility.focus.width).toBe(2);
      expect(typeof accessibility.focus.color).toBe('string');
    });
  });
});
```

### WCAG Compliance Tests

```typescript
// src/validation/__tests__/WCAGValidator.test.ts

describe('WCAGValidator', () => {
  const validator = new WCAGValidator();
  
  describe('focus indicator contrast', () => {
    it('should pass with 3:1 contrast ratio', () => {
      const result = validator.validateFocusContrast('#3B82F6', '#FFFFFF');
      expect(result.level).toBe('pass');
    });
    
    it('should fail with insufficient contrast', () => {
      const result = validator.validateFocusContrast('#E0E0E0', '#FFFFFF');
      expect(result.level).toBe('error');
      expect(result.wcag).toContain('1.4.11');
    });
  });
  
  describe('focus indicator visibility', () => {
    it('should pass with 2px width and 2px offset', () => {
      const result = validator.validateFocusVisibility(2, 2);
      expect(result.level).toBe('pass');
    });
    
    it('should warn with 0px offset', () => {
      const result = validator.validateFocusVisibility(0, 2);
      expect(result.level).toBe('warning');
    });
  });
});
```

### Cross-Platform Generation Tests

```typescript
// src/generators/__tests__/AccessibilityTokenGeneration.test.ts

describe('Accessibility Token Generation', () => {
  describe('Web CSS Generation', () => {
    it('should generate CSS custom properties', () => {
      const generator = new WebCSSGenerator();
      const output = generator.generateAccessibilityTokens();
      
      expect(output).toContain('--accessibility-focus-offset: 2px');
      expect(output).toContain('--accessibility-focus-width: 2px');
      expect(output).toContain('--accessibility-focus-color: var(--color-primary)');
    });
  });
  
  describe('iOS Swift Generation', () => {
    it('should generate Swift constants', () => {
      const generator = new iOSSwiftGenerator();
      const output = generator.generateAccessibilityTokens();
      
      expect(output).toContain('let accessibilityFocusOffset: CGFloat = 2');
      expect(output).toContain('let accessibilityFocusWidth: CGFloat = 2');
      expect(output).toContain('let accessibilityFocusColor: Color = .primary');
    });
  });
  
  describe('Android Kotlin Generation', () => {
    it('should generate Kotlin constants', () => {
      const generator = new AndroidKotlinGenerator();
      const output = generator.generateAccessibilityTokens();
      
      expect(output).toContain('val accessibilityFocusOffset = 2.dp');
      expect(output).toContain('val accessibilityFocusWidth = 2.dp');
      expect(output).toContain('val accessibilityFocusColor = colorPrimary');
    });
  });
});
```

---

## Future Extensibility

### Motion Tokens (Future)

```typescript
// Future: accessibility.motion.*

export const accessibility = {
  focus: { /* ... */ },
  
  motion: {
    /**
     * Reduced motion duration (0ms for no animation)
     * WCAG 2.3.3 Animation from Interactions (Level AAA)
     */
    reducedDuration: 0,
    
    /**
     * Reduced motion easing (linear for simplicity)
     * WCAG 2.3.3 Animation from Interactions (Level AAA)
     */
    reducedEasing: 'linear',
    
    /**
     * Standard motion duration (when reduced motion is off)
     */
    standardDuration: animation.duration.normal,
  },
};
```

### Contrast Tokens (Future)

```typescript
// Future: accessibility.contrast.*

export const accessibility = {
  focus: { /* ... */ },
  
  contrast: {
    /**
     * Minimum contrast ratio for normal text
     * WCAG 1.4.3 Contrast (Minimum) - Level AA
     */
    textMinimum: 4.5,
    
    /**
     * Enhanced contrast ratio for normal text
     * WCAG 1.4.6 Contrast (Enhanced) - Level AAA
     */
    textEnhanced: 7.0,
    
    /**
     * Minimum contrast ratio for non-text elements
     * WCAG 1.4.11 Non-text Contrast - Level AA
     */
    nonTextMinimum: 3.0,
  },
};
```

### Text Spacing Tokens (Future)

```typescript
// Future: accessibility.text.*

export const accessibility = {
  focus: { /* ... */ },
  
  text: {
    /**
     * Minimum line height for readability
     * WCAG 1.4.12 Text Spacing - Level AA
     */
    minimumLineHeight: 1.5,
    
    /**
     * Minimum letter spacing (× font size)
     * WCAG 1.4.12 Text Spacing - Level AA
     */
    minimumLetterSpacing: 0.12,
    
    /**
     * Minimum word spacing (× font size)
     * WCAG 1.4.12 Text Spacing - Level AA
     */
    minimumWordSpacing: 0.16,
  },
};
```

---

*This design document establishes the Accessibility Token Family with focus on WCAG compliance, compositional architecture, cross-platform generation, and seamless integration with existing token infrastructure.*
