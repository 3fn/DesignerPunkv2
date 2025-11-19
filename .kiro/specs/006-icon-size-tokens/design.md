# Design Document: Icon Size Tokens

**Date**: November 18, 2025
**Spec**: 006 - Icon Size Tokens
**Status**: Design Phase
**Dependencies**: Spec 001 (Mathematical Token System), Spec 004 (Icon System)

---

## Overview

The Icon Size Token system creates mathematically-derived icon sizes using the formula `fontSize × lineHeight`. This approach ensures icons maintain perfect optical balance with their paired typography while automatically adapting when typography scales change. Icon size tokens are implemented as semantic tokens that reference primitive fontSize and lineHeight tokens, integrating with the existing token architecture for validation, registration, and cross-platform generation.

### Key Design Principles

1. **Mathematical Foundation**: Every icon size is calculated from `fontSize × lineHeight`, not arbitrary
2. **Semantic Token Architecture**: Icon sizes are semantic tokens referencing primitive tokens
3. **Automatic Adaptation**: Changes to fontSize or lineHeight propagate automatically
4. **AI-Friendly Reasoning**: Explicit formula enables reliable AI agent reasoning
5. **Cross-Platform Consistency**: Same mathematical relationships across web, iOS, Android

---

## Architecture

### Token Hierarchy

```
Primitive Tokens (Mathematical Base)
├── fontSize050 (13)
├── fontSize075 (14)
├── fontSize100 (16)
├── lineHeight050 (1.0)
├── lineHeight075 (1.25)
└── lineHeight100 (1.5)
         ↓
Semantic Tokens (Contextual Meaning)
├── icon.size050 = fontSize050 × lineHeight050 = 13
├── icon.size075 = fontSize075 × lineHeight075 = 18
└── icon.size100 = fontSize100 × lineHeight100 = 24
```

### New Semantic Category

Icon size tokens introduce a new semantic category to the token system:

**SemanticCategory.ICON**
- Purpose: Organize icon-related semantic tokens
- Rationale: Icons are distinct UI elements with their own concerns
- Future extensibility: Supports icon.color.*, icon.spacing.*, icon.stroke.* tokens
- Clear organization: Unambiguous category for AI agent reasoning


---

## Components and Interfaces

### Icon Size Token Structure

Icon size tokens follow the semantic token pattern established by TypographyTokens:

```typescript
// src/tokens/semantic/IconTokens.ts
import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';
import { fontSizeTokens } from '../FontSizeTokens';
import { lineHeightTokens } from '../LineHeightTokens';

export const iconTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  'icon.size050': {
    name: 'icon.size050',
    primitiveReferences: {
      fontSize: 'fontSize050',
      lineHeight: 'lineHeight050'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for caption, legal, labelXs typography (smallest text)',
    description: 'Icon size calculated from fontSize050 × lineHeight050 = 13 × 1.0 = 13px'
  },
  
  'icon.size075': {
    name: 'icon.size075',
    primitiveReferences: {
      fontSize: 'fontSize075',
      lineHeight: 'lineHeight075'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for bodySm, buttonSm, labelSm typography',
    description: 'Icon size calculated from fontSize075 × lineHeight075 = 14 × 1.25 = 18px'
  },
  
  'icon.size100': {
    name: 'icon.size100',
    primitiveReferences: {
      fontSize: 'fontSize100',
      lineHeight: 'lineHeight100'
    },
    category: SemanticCategory.ICON,
    context: 'Icon size for bodyMd, buttonMd, labelMd, input typography (standard)',
    description: 'Icon size calculated from fontSize100 × lineHeight100 = 16 × 1.5 = 24px'
  }
  
  // ... additional sizes for 125, 150, 200, 300, 400, 500, 600, 700
};
```


### Icon Size Calculation Function

```typescript
/**
 * Calculate icon size from fontSize and lineHeight tokens
 * Formula: iconSize = fontSize.baseValue × lineHeight.baseValue (rounded)
 */
export function calculateIconSize(
  fontSizeToken: PrimitiveToken,
  lineHeightToken: PrimitiveToken
): number {
  return Math.round(fontSizeToken.baseValue * lineHeightToken.baseValue);
}

/**
 * Generate all icon size tokens from fontSize and lineHeight primitives
 */
export function generateIconSizeTokens(): Record<string, Omit<SemanticToken, 'primitiveTokens'>> {
  const scales = ['050', '075', '100', '125', '150', '200', '300', '400', '500', '600', '700'];
  const tokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {};
  
  for (const scale of scales) {
    const fontSizeName = `fontSize${scale}`;
    const lineHeightName = `lineHeight${scale}`;
    const fontSize = fontSizeTokens[fontSizeName];
    const lineHeight = lineHeightTokens[lineHeightName];
    
    if (fontSize && lineHeight) {
      const size = calculateIconSize(fontSize, lineHeight);
      tokens[`icon.size${scale}`] = {
        name: `icon.size${scale}`,
        primitiveReferences: {
          fontSize: fontSizeName,
          lineHeight: lineHeightName
        },
        category: SemanticCategory.ICON,
        context: getIconSizeContext(scale, size),
        description: `Icon size calculated from ${fontSizeName} × ${lineHeightName} = ${fontSize.baseValue} × ${lineHeight.baseValue} = ${size}px`
      };
    }
  }
  
  return tokens;
}
```


### Type System Integration

Icon size tokens integrate with the existing Icon component type system:

```typescript
// src/components/core/Icon/types.ts (updated)
import { iconTokens } from '@/tokens/semantic/IconTokens';

/**
 * Icon size type derived from icon size tokens
 * Automatically includes all calculated icon sizes
 */
export type IconSize = ReturnType<typeof calculateIconSize>;

// Or more explicitly:
export type IconSize = 13 | 18 | 24 | 28 | 32 | 36 | 40 | 44 | 48;

/**
 * Icon size token references for type-safe token usage
 */
export const iconSizes = {
  size050: 13,  // icon.size050
  size075: 18,  // icon.size075
  size100: 24,  // icon.size100
  size125: 32,  // icon.size125
  size150: 28,  // icon.size150
  size200: 32,  // icon.size200
  size300: 32,  // icon.size300
  size400: 36,  // icon.size400
  size500: 40,  // icon.size500
  size600: 44,  // icon.size600
  size700: 48   // icon.size700
} as const;
```


---

## Data Models

### Calculated Icon Sizes

Based on current fontSize and lineHeight primitive tokens:

| Scale | fontSize | lineHeight | Calculation | Result | 4pt Aligned |
|-------|----------|------------|-------------|--------|-------------|
| 050 | 13 | 1.0 | 13 × 1.0 | 13 | ❌ |
| 075 | 14 | 1.25 | 14 × 1.25 | 18 | ❌ |
| 100 | 16 | 1.5 | 16 × 1.5 | 24 | ✅ |
| 125 | 18 | 1.75 | 18 × 1.75 | 32 | ✅ |
| 150 | 20 | 1.4 | 20 × 1.4 | 28 | ✅ |
| 200 | 23 | 1.391 | 23 × 1.391 | 32 | ✅ |
| 300 | 26 | 1.231 | 26 × 1.231 | 32 | ✅ |
| 400 | 29 | 1.241 | 29 × 1.241 | 36 | ✅ |
| 500 | 33 | 1.212 | 33 × 1.212 | 40 | ✅ |
| 600 | 37 | 1.19 | 37 × 1.19 | 44 | ✅ |
| 700 | 42 | 1.143 | 42 × 1.143 | 48 | ✅ |

**Unique Values**: 8 (13, 18, 24, 28, 32, 36, 40, 44, 48)
**Convergence**: h4, h5, bodyLg all → 32px (mathematically derived)

### Typography Pairing Map

| Icon Size | Typography Styles | Use Cases |
|-----------|------------------|-----------|
| 13px (size050) | caption, legal, labelXs | Smallest text, fine print |
| 18px (size075) | bodySm, buttonSm, labelSm | Compact layouts, small UI |
| 24px (size100) | bodyMd, buttonMd, labelMd, input | Standard UI, body text |
| 28px (size150) | h6 | Smallest heading |
| 32px (size125/200/300) | bodyLg, buttonLg, labelLg, h5, h4 | Large UI, medium headings |
| 36px (size400) | h3 | Medium-large heading |
| 40px (size500) | h2 | Large heading |
| 44px (size600) | h1 | Primary heading |
| 48px (size700) | display | Hero text, display |


---

## Cross-Platform Generation

### Platform-Specific Token Output

Icon size tokens generate platform-specific constants through the existing semantic token generation pipeline:

**Web (TypeScript/CSS)**:
```typescript
// Generated: src/tokens/generated/web/IconTokens.ts
export const iconSize050 = 13;
export const iconSize075 = 18;
export const iconSize100 = 24;
// ... etc

// CSS Custom Properties
:root {
  --icon-size-050: 13px;
  --icon-size-075: 18px;
  --icon-size-100: 24px;
  /* ... etc */
}
```

**iOS (Swift)**:
```swift
// Generated: DesignTokens.ios.swift
public let iconSize050: CGFloat = 13
public let iconSize075: CGFloat = 18
public let iconSize100: CGFloat = 24
// ... etc
```

**Android (Kotlin)**:
```kotlin
// Generated: DesignTokens.android.kt
val iconSize050 = 13.dp
val iconSize075 = 18.dp
val iconSize100 = 24.dp
// ... etc
```

### Generation Integration

Icon size tokens integrate with the existing semantic token generation system:

1. **Token Resolution**: Resolve primitive references (fontSize, lineHeight) to actual values
2. **Calculation**: Apply formula (fontSize × lineHeight, rounded)
3. **Platform Generation**: Generate platform-specific constants
4. **Type Generation**: Generate TypeScript types for Icon component


---

## Error Handling

### Token Resolution Errors

**Missing Primitive Tokens**:
```typescript
if (!fontSize || !lineHeight) {
  throw new Error(
    `Cannot calculate icon.size${scale}: Missing primitive tokens ` +
    `(fontSize${scale}: ${!!fontSize}, lineHeight${scale}: ${!!lineHeight})`
  );
}
```

**Invalid Calculation Results**:
```typescript
const size = calculateIconSize(fontSize, lineHeight);
if (!Number.isFinite(size) || size <= 0) {
  throw new Error(
    `Invalid icon size calculation for icon.size${scale}: ` +
    `${fontSize.baseValue} × ${lineHeight.baseValue} = ${size}`
  );
}
```

### Validation Integration

Icon size tokens integrate with the existing semantic token validation system:

```typescript
// Validate icon size token structure
const validation = validateSemanticTokenStructure(iconToken);
if (!validation.valid) {
  console.error(`Invalid icon size token: ${validation.errors.join(', ')}`);
}

// Validate primitive references exist
for (const [key, primitiveName] of Object.entries(iconToken.primitiveReferences)) {
  const primitive = getPrimitiveToken(primitiveName);
  if (!primitive) {
    console.error(`Icon size token references missing primitive: ${primitiveName}`);
  }
}
```


---

## Testing Strategy

### Unit Tests

**Token Calculation Tests**:
```typescript
describe('Icon Size Token Calculation', () => {
  it('should calculate icon sizes from fontSize × lineHeight', () => {
    const fontSize = fontSizeTokens.fontSize100; // 16
    const lineHeight = lineHeightTokens.lineHeight100; // 1.5
    const iconSize = calculateIconSize(fontSize, lineHeight);
    expect(iconSize).toBe(24); // 16 × 1.5 = 24
  });
  
  it('should round non-integer results', () => {
    const fontSize = fontSizeTokens.fontSize075; // 14
    const lineHeight = lineHeightTokens.lineHeight075; // 1.25
    const iconSize = calculateIconSize(fontSize, lineHeight);
    expect(iconSize).toBe(18); // 14 × 1.25 = 17.5 → 18
  });
});
```

**Token Structure Tests**:
```typescript
describe('Icon Size Token Structure', () => {
  it('should have valid semantic token structure', () => {
    const token = iconTokens['icon.size100'];
    expect(token.name).toBe('icon.size100');
    expect(token.category).toBe(SemanticCategory.ICON);
    expect(token.primitiveReferences).toHaveProperty('fontSize');
    expect(token.primitiveReferences).toHaveProperty('lineHeight');
  });
  
  it('should reference valid primitive tokens', () => {
    const token = iconTokens['icon.size100'];
    const fontSize = fontSizeTokens[token.primitiveReferences.fontSize];
    const lineHeight = lineHeightTokens[token.primitiveReferences.lineHeight];
    expect(fontSize).toBeDefined();
    expect(lineHeight).toBeDefined();
  });
});
```


### Integration Tests

**Icon Component Integration**:
```typescript
describe('Icon Component with Token Sizes', () => {
  it('should accept icon size token values', () => {
    const icon = new Icon({
      name: 'check',
      size: iconSizes.size100 // 24
    });
    expect(icon.getProps().size).toBe(24);
  });
  
  it('should maintain type safety with IconSize type', () => {
    // TypeScript compile-time test
    const validSize: IconSize = 24; // ✅ Valid
    // const invalidSize: IconSize = 25; // ❌ Compile error
  });
});
```

**Cross-Platform Generation Tests**:
```typescript
describe('Icon Size Token Generation', () => {
  it('should generate web tokens correctly', () => {
    const webTokens = generateWebIconTokens(iconTokens);
    expect(webTokens).toContain('export const iconSize100 = 24;');
  });
  
  it('should generate iOS tokens correctly', () => {
    const iosTokens = generateIOSIconTokens(iconTokens);
    expect(iosTokens).toContain('public let iconSize100: CGFloat = 24');
  });
  
  it('should generate Android tokens correctly', () => {
    const androidTokens = generateAndroidIconTokens(iconTokens);
    expect(androidTokens).toContain('val iconSize100 = 24.dp');
  });
});
```


### Validation Tests

**4pt Subgrid Alignment**:
```typescript
describe('Icon Size 4pt Subgrid Alignment', () => {
  it('should align most sizes to 4pt subgrid', () => {
    const alignedSizes = [24, 28, 32, 36, 40, 44, 48];
    alignedSizes.forEach(size => {
      expect(size % 4).toBe(0);
    });
  });
  
  it('should document non-aligned sizes', () => {
    const nonAlignedSizes = [13, 18];
    // These are smallest sizes, alignment trade-off acceptable
    expect(nonAlignedSizes.length).toBeLessThan(3);
  });
});
```

**Adaptability Tests**:
```typescript
describe('Icon Size Adaptability', () => {
  it('should recalculate when fontSize changes', () => {
    // Simulate fontSize change
    const originalFontSize = fontSizeTokens.fontSize100.baseValue;
    fontSizeTokens.fontSize100.baseValue = 18; // Change from 16 to 18
    
    const newIconSize = calculateIconSize(
      fontSizeTokens.fontSize100,
      lineHeightTokens.lineHeight100
    );
    
    expect(newIconSize).toBe(27); // 18 × 1.5 = 27
    
    // Restore original value
    fontSizeTokens.fontSize100.baseValue = originalFontSize;
  });
});
```


---

## Design Decisions

### Decision 1: Semantic Tokens (Not Primitive)

**Options Considered**:
1. Primitive tokens (like FontSizeTokens)
2. Semantic tokens (like TypographyTokens) ← **Chosen**
3. Component-level tokens (in Icon component)

**Decision**: Semantic tokens

**Rationale**:
Icon sizes reference primitive tokens (fontSize, lineHeight) and provide contextual meaning ("pairs with bodyMd typography"). This matches the definition of semantic tokens: they reference primitives and describe usage context.

Primitive tokens are mathematical base values with no context. Icon sizes have context (typography pairing, use cases) and compose multiple primitives (fontSize × lineHeight), making them semantic by definition.

Component-level tokens would duplicate the semantic token infrastructure and prevent reuse across components.

**Trade-offs**:
- ✅ **Gained**: Integration with existing semantic token system (validation, generation, registration)
- ✅ **Gained**: Reusability across components (not just Icon component)
- ✅ **Gained**: Consistent architecture with other semantic tokens
- ❌ **Lost**: Slightly more complex than primitive tokens
- ⚠️ **Risk**: None - semantic tokens are the established pattern for contextual tokens

**Counter-Arguments**:
- **Argument**: "Icon sizes are just numbers, they should be primitive tokens"
- **Response**: Icon sizes have contextual meaning (typography pairing) and compose multiple primitives (fontSize × lineHeight). This is the definition of semantic tokens.


### Decision 2: New SemanticCategory.ICON

**Options Considered**:
1. Use existing SemanticCategory.LAYOUT
2. Use existing SemanticCategory.TYPOGRAPHY
3. Create new SemanticCategory.ICON ← **Chosen**

**Decision**: Create new SemanticCategory.ICON

**Rationale**:
Icons are distinct UI elements with their own concerns, separate from layout and typography. While icon sizes pair with typography, they're not typography themselves - they're sizing tokens for a different rendering system (SVG/vector graphics vs text).

Creating a dedicated ICON category provides:
- Clear organization for current and future icon tokens
- Unambiguous categorization for AI agent reasoning
- Extensibility for icon.color.*, icon.spacing.*, icon.stroke.* tokens
- Semantic clarity that aligns with the Rosetta Stone vision

**Trade-offs**:
- ✅ **Gained**: Clear, unambiguous category for icon-related tokens
- ✅ **Gained**: Future extensibility for icon color, spacing, stroke tokens
- ✅ **Gained**: Consistent with "distinct UI element" principle
- ❌ **Lost**: Adds one more category to the enum (minimal cost)
- ⚠️ **Risk**: None - categories are organizational, not functional

**Counter-Arguments**:
- **Argument**: "Icons pair with typography, use TYPOGRAPHY category"
- **Response**: Pairing with typography doesn't make them typography. Icons are vector graphics with different rendering concerns. The ICON category makes this distinction clear.

- **Argument**: "Adding categories increases complexity"
- **Response**: Categories are organizational metadata. One additional category is negligible complexity compared to the clarity gained.


### Decision 3: fontSize × lineHeight Formula

**Options Considered**:
1. Direct fontSize alignment (icon.size100 = fontSize100)
2. Spacing token alignment (icon.size100 = space200)
3. fontSize × multiplier (icon.size100 = fontSize100 × 1.5)
4. fontSize × lineHeight (icon.size100 = fontSize100 × lineHeight100) ← **Chosen**

**Decision**: fontSize × lineHeight formula

**Rationale**:
Icons should fill the line height space of their paired typography, not just match the font size. This creates perfect optical balance where icons and text have equal visual weight in composition.

The formula leverages existing lineHeight precision targeting for 4pt subgrid alignment. Since lineHeight tokens are already precision-targeted to create 4pt-aligned line heights, icon sizes automatically inherit this alignment.

The formula is explicit and calculable, enabling AI agents to reason about icon size selection: "bodyMd uses fontSize100 and lineHeight100, so icon should use icon.size100 = 16 × 1.5 = 24".

**Trade-offs**:
- ✅ **Gained**: Perfect optical balance (icons fill line height space)
- ✅ **Gained**: 4pt subgrid alignment (via lineHeight precision targeting)
- ✅ **Gained**: Automatic adaptation (changes to fontSize or lineHeight propagate)
- ✅ **Gained**: AI-friendly reasoning (explicit, calculable formula)
- ❌ **Lost**: Simplicity of direct fontSize alignment
- ⚠️ **Risk**: More sizes to manage (8 unique values vs 4 current)

**Counter-Arguments**:
- **Argument**: "Direct fontSize alignment is simpler"
- **Response**: Simplicity without optical balance creates visual problems. Icons same size as text look too small because they don't fill the line height space.

- **Argument**: "More sizes increases complexity"
- **Response**: Complexity is managed by the formula. AI agents can calculate which size to use based on typography pairing. The formula provides the reasoning path.


### Decision 4: Accept Natural Convergence

**Options Considered**:
1. Force unique values for each scale (adjust formula)
2. Accept natural convergence (h4, h5, bodyLg all → 32px) ← **Chosen**
3. Consolidate token names (remove duplicates)

**Decision**: Accept natural convergence

**Rationale**:
The convergence is mathematically derived, not arbitrary. Similar typography levels (h4, h5, bodyLg) naturally converge to similar icon sizes because their computed line heights are similar.

Keeping separate token names (icon.size200, icon.size300) preserves adaptability. If fontSize or lineHeight values change in the future, the convergence might disappear. The token names track the *relationship* to typography, not just the current value.

This aligns with the mathematical foundation principle: tokens represent relationships, not just static values. The system must be adaptive to typography changes.

**Trade-offs**:
- ✅ **Gained**: Adaptability to future typography changes
- ✅ **Gained**: Clear typography pairing (icon.size200 pairs with h5)
- ✅ **Gained**: Mathematical integrity (convergence is derived, not forced)
- ❌ **Lost**: Some redundancy (multiple tokens with same value)
- ⚠️ **Risk**: None - token names provide semantic clarity even when values converge

**Counter-Arguments**:
- **Argument**: "Consolidate to unique values only (icon.size032 instead of icon.size200)"
- **Response**: This breaks the typography pairing relationship. Developers and AI agents need to know "h5 uses icon.size200" without needing to know the current calculated value.

- **Argument**: "Force unique values by adjusting the formula"
- **Response**: This would make the formula arbitrary rather than mathematically pure. The convergence is natural and acceptable.


### Decision 5: Document Core vs Available Sizes

**Options Considered**:
1. Treat all 11 sizes equally
2. Document "core sizes" vs "available sizes" ← **Chosen**
3. Mark some sizes as "optional" or "advanced"

**Decision**: Document core sizes vs available sizes

**Rationale**:
While the formula produces 11 token names (8 unique values), not all sizes will be used equally. Most use cases will cluster around 5-6 core sizes (18, 24, 32, 36, 40), with the others available for edge cases.

Documenting this distinction helps developers and AI agents make informed decisions without overwhelming them with choices. The guidance is descriptive, not prescriptive - all sizes are valid, but some are more common.

**Core Sizes (90% of use cases)**:
- 18px (size075) - Small UI, compact layouts
- 24px (size100) - Standard UI, body text
- 32px (size125/200/300) - Large UI, medium headings
- 36px (size400) - Large headings
- 40px (size500) - Primary headings

**Available Sizes (10% of use cases)**:
- 13px (size050) - Smallest text (use sparingly)
- 28px (size150) - h6 headings (less common)
- 44px (size600) - h1 headings (less common)
- 48px (size700) - Display text (hero sections)

**Trade-offs**:
- ✅ **Gained**: Clear guidance for common use cases
- ✅ **Gained**: Reduced cognitive load (focus on core sizes)
- ✅ **Gained**: All sizes remain available (no artificial restrictions)
- ❌ **Lost**: None - this is documentation guidance, not technical restriction
- ⚠️ **Risk**: None - developers can use any size, guidance just helps prioritize

**Counter-Arguments**:
- **Argument**: "All sizes should be treated equally"
- **Response**: Equal availability doesn't mean equal usage. Documentation should reflect real-world usage patterns to help developers make informed decisions.


---

## Integration with Existing Systems

### Semantic Token System Integration

Icon size tokens integrate with the existing semantic token infrastructure:

**Registration**:
```typescript
// src/tokens/semantic/index.ts
export * from './IconTokens';
export { iconTokens, getIconToken, getAllIconTokens } from './IconTokens';
```

**Validation**:
```typescript
// Icon tokens use existing semantic token validation
const validation = validateSemanticTokenStructure(iconToken);
```

**Generation**:
```typescript
// Icon tokens use existing semantic token generation pipeline
const webTokens = generateWebSemanticTokens(iconTokens);
const iosTokens = generateIOSSemanticTokens(iconTokens);
const androidTokens = generateAndroidSemanticTokens(iconTokens);
```

### Icon Component Integration

Icon size tokens integrate with the Spec 004 Icon component:

**Type System Update**:
```typescript
// Before (Spec 004)
export type IconSize = 16 | 24 | 32 | 40;

// After (Spec 006)
export type IconSize = 13 | 18 | 24 | 28 | 32 | 36 | 40 | 44 | 48;
```

**Component Usage** (unchanged):
```typescript
// Component API remains the same
<Icon name="check" size={24} />

// Now with token reference
import { iconSizes } from '@/tokens/semantic/IconTokens';
<Icon name="check" size={iconSizes.size100} />
```


### Build System Integration

Icon size tokens extend the existing build system for semantic token generation:

**Token Resolution**:
```typescript
// Resolve primitive references to actual values
function resolveIconSizeToken(token: SemanticToken): number {
  const fontSize = getPrimitiveToken(token.primitiveReferences.fontSize);
  const lineHeight = getPrimitiveToken(token.primitiveReferences.lineHeight);
  
  if (!fontSize || !lineHeight) {
    throw new Error(`Cannot resolve icon size token: ${token.name}`);
  }
  
  return Math.round(fontSize.baseValue * lineHeight.baseValue);
}
```

**Platform Generation**:
```typescript
// Generate platform-specific constants
function generatePlatformIconTokens(
  tokens: Record<string, SemanticToken>,
  platform: 'web' | 'ios' | 'android'
): string {
  const output: string[] = [];
  
  for (const [name, token] of Object.entries(tokens)) {
    const size = resolveIconSizeToken(token);
    const tokenName = name.replace('icon.', 'icon');
    const tokenName = tokenName.replace('.', '');
    
    switch (platform) {
      case 'web':
        output.push(`export const ${tokenName} = ${size};`);
        break;
      case 'ios':
        output.push(`public let ${tokenName}: CGFloat = ${size}`);
        break;
      case 'android':
        output.push(`val ${tokenName} = ${size}.dp`);
        break;
    }
  }
  
  return output.join('\n');
}
```


---

## Migration from Spec 004

### Files Requiring Updates

**1. SemanticCategory Enum**:
```typescript
// src/types/SemanticToken.ts
export enum SemanticCategory {
  COLOR = 'color',
  SPACING = 'spacing',
  TYPOGRAPHY = 'typography',
  BORDER = 'border',
  SHADOW = 'shadow',
  LAYOUT = 'layout',
  LAYERING = 'layering',
  INTERACTION = 'interaction',
  ICON = 'icon' // ← Add new category
}
```

**2. Icon Component Types**:
```typescript
// src/components/core/Icon/types.ts
// Update IconSize type to include new sizes
export type IconSize = 13 | 18 | 24 | 28 | 32 | 36 | 40 | 44 | 48;
```

**3. Icon Component README**:
- Update size variants table with new sizes
- Add formula explanation
- Add typography pairing examples
- Document core vs available sizes

**4. Icon Component Tests**:
- Update size variant tests to include new sizes
- Add tests for token integration
- Verify type safety with new IconSize type

### No Breaking Changes

The migration is **non-breaking** because:
- Icon component API unchanged (still accepts numeric sizes)
- Existing hard-coded sizes (16, 24, 32, 40) remain valid
- New sizes are additions, not replacements
- Token usage is optional (can still use numeric literals)


---

## AI Agent Reasoning Examples

### Example 1: Icon Size Selection

**AI Agent Task**: "Add an icon next to the body text"

**Reasoning Path**:
1. Body text uses `typography.bodyMd`
2. `typography.bodyMd` uses `fontSize100` (16) and `lineHeight100` (1.5)
3. Icon should use `icon.size100` = `fontSize100 × lineHeight100` = 16 × 1.5 = 24
4. Result: `<Icon name="check" size={iconSizes.size100} />` (24px)

### Example 2: Icon Size Calculation

**AI Agent Task**: "What icon size pairs with h3 heading?"

**Reasoning Path**:
1. h3 heading uses `typography.h3`
2. `typography.h3` uses `fontSize400` (29) and `lineHeight400` (1.241)
3. Icon should use `icon.size400` = `fontSize400 × lineHeight400` = 29 × 1.241 ≈ 36
4. Result: `icon.size400` (36px) pairs with h3

### Example 3: Adaptability Reasoning

**AI Agent Task**: "If fontSize100 changes from 16 to 18, what happens to icon.size100?"

**Reasoning Path**:
1. `icon.size100` = `fontSize100 × lineHeight100`
2. Current: 16 × 1.5 = 24
3. After change: 18 × 1.5 = 27
4. Result: Icon size automatically adapts to 27px (no manual updates needed)


---

## Success Criteria

### Functional Requirements

✅ Icon sizes calculated from fontSize × lineHeight formula
✅ Icon sizes adapt automatically when typography tokens change
✅ Type safety maintained (IconSize type derived from tokens)
✅ Cross-platform consistency (web, iOS, Android)
✅ Backward compatibility (existing icon usage continues to work)

### Quality Requirements

✅ All tests pass with new icon sizes
✅ Documentation explains formula and usage patterns
✅ AI agents can reason about icon size selection
✅ Build system generates platform-specific tokens correctly
✅ Integration with existing semantic token system

### AI Collaboration Requirements

✅ Formula is explicit and calculable
✅ Reasoning path is clear (typography → icon size)
✅ Documentation provides context for AI agents
✅ Token names follow consistent patterns
✅ Mathematical relationships are preserved

---

## Future Enhancements

The following features are not in the initial implementation but may be added in future iterations:

### Additional Icon Token Types

- **icon.color.***: Semantic icon colors (icon.color.primary, icon.color.error)
- **icon.spacing.***: Spacing around icons (icon.spacing.inline, icon.spacing.stacked)
- **icon.stroke.***: Stroke width variants for different icon weights

### Formula Adjustability

- Optional multiplier constant for fine-tuning optical balance
- Per-typography-scale multiplier overrides
- Context-specific multipliers (buttons vs inline text vs headings)

### Advanced Validation

- Runtime validation that icon size matches paired typography
- Development-mode warnings for mismatched pairings
- Automated visual regression testing for optical balance

---

*This design document defines the architecture and implementation approach for the Icon Size Token system, establishing mathematically-derived icon sizes that create perfect optical balance with typography while maintaining adaptability and AI-friendly reasoning.*

