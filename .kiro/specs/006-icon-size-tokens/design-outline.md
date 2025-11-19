# Design Outline: Icon Size Tokens

**Date**: November 18, 2025
**Spec**: 006 - Icon Size Tokens
**Status**: Design Outline
**Dependencies**: Spec 001 (Mathematical Token System), Spec 004 (Icon System)

---

## Context and Motivation

### Discovery Through Implementation

During Spec 004 (Icon System) implementation, icon sizes were hard-coded as literal values (16, 24, 32, 40). While this delivered a working icon system, it revealed a gap in the token architecture: **icon sizes are disconnected from the typography system they pair with**.

This design outline addresses that gap by creating icon size tokens that are mathematically derived from typography tokens, ensuring:
- Automatic adaptation when typography scales change
- Perfect optical balance between icons and text
- Clear reasoning paths for AI agents
- Alignment with the 4pt subgrid system

### The Adaptability Problem

**Current State (Spec 004):**
```typescript
// Hard-coded icon sizes
type IconSize = 16 | 24 | 32 | 40;

// Problem: If baseline grid changes from 8px to 6px, these values don't adapt
// Manual updates required across:
// - Icon component implementations (web, iOS, Android)
// - Type definitions
// - Tests
// - Documentation
```

**Desired State (Spec 006):**
```typescript
// Token-based icon sizes
icon.size100 = fontSize100 × lineHeight100  // 16 × 1.5 = 24

// Benefit: If fontSize or lineHeight changes, icon size adapts automatically
// No manual updates needed - mathematical relationship preserved
```

### Why This Matters for AI Collaboration

AI agents need explicit, calculable relationships to reason reliably about design decisions. Hard-coded values provide no context:

```typescript
// Current: No reasoning path
<Icon name="check" size={24} />
// AI: "Why 24? Is this correct? Should it be 20? 28?"

// With tokens: Clear reasoning path
<Icon name="check" size={icon.size100} />
// AI: "icon.size100 = fontSize100 × lineHeight100 = 16 × 1.5 = 24"
// AI: "This pairs with typography.bodyMd which uses fontSize100"
// AI: "Icon fills the line height space - optically balanced"
```

---

## Current State Analysis

### Spec 004 Outputs

**Files Created:**
- `src/components/core/Icon/types.ts` - IconSize type with hard-coded values
- `src/components/core/Icon/platforms/web/Icon.web.tsx` - Web implementation
- `src/components/core/Icon/platforms/ios/Icon.ios.swift` - iOS implementation
- `src/components/core/Icon/platforms/android/Icon.android.kt` - Android implementation
- `src/components/core/Icon/__tests__/*.test.ts` - Test files
- `src/components/core/Icon/README.md` - Component documentation

**Current Icon Sizes:**
```typescript
type IconSize = 16 | 24 | 32 | 40;

// These were chosen to align with 8px baseline grid:
// 16 = 2 × 8
// 24 = 3 × 8
// 32 = 4 × 8
// 40 = 5 × 8
```

### Typography Token Structure

**Actual Typography Pairings:**
```typescript
// Body text
typography.bodySm   → fontSize075 (14) × lineHeight075 (1.25) = 17.5 ≈ 18
typography.bodyMd   → fontSize100 (16) × lineHeight100 (1.5) = 24
typography.bodyLg   → fontSize125 (18) × lineHeight125 (1.75) = 31.5 ≈ 32

// Headings
typography.h6 → fontSize150 (20) × lineHeight150 (1.4) = 28
typography.h5 → fontSize200 (23) × lineHeight200 (1.391) = 32
typography.h4 → fontSize300 (26) × lineHeight300 (1.231) = 32
typography.h3 → fontSize400 (29) × lineHeight400 (1.241) = 36
typography.h2 → fontSize500 (33) × lineHeight500 (1.212) = 40
typography.h1 → fontSize600 (37) × lineHeight600 (1.19) = 44

// Display
typography.display → fontSize700 (42) × lineHeight700 (1.143) = 48
```

### The Gap

**Current icon sizes (16, 24, 32, 40) don't align with computed line heights:**
- bodyMd line height: 24px ✅ (matches current icon size)
- bodySm line height: 18px ❌ (no matching icon size)
- bodyLg line height: 32px ✅ (matches current icon size)
- h6 line height: 28px ❌ (no matching icon size)
- h3 line height: 36px ❌ (no matching icon size)
- h1 line height: 44px ❌ (no matching icon size)
- display line height: 48px ❌ (no matching icon size)

**This gap prevents perfect optical balance between icons and text.**

---

## Proposed Solution: fontSize × lineHeight Formula

### Core Concept

**Icon sizes should match the computed line height of their paired typography.**

This creates perfect optical balance where icons fill the vertical space of the text line, not just match the font size.

### Mathematical Formula

```typescript
icon.sizeXXX = fontSizeXXX.baseValue × lineHeightXXX.baseValue
```

**Rationale:**
1. **Optical Balance**: Icons fill the line height space, creating visual harmony
2. **4pt Subgrid Alignment**: LineHeight tokens are precision-targeted to create 4pt-aligned line heights
3. **Automatic Adaptation**: Changes to fontSize or lineHeight propagate automatically
4. **AI-Friendly**: Explicit, calculable relationship enables reliable reasoning

### Calculated Icon Sizes

```typescript
// Formula: fontSize × lineHeight (rounded to nearest integer)

icon.size050 = 13 × 1.0 = 13    // pairs with caption, legal, labelXs
icon.size075 = 14 × 1.25 = 18   // pairs with bodySm, buttonSm, labelSm
icon.size100 = 16 × 1.5 = 24    // pairs with bodyMd, buttonMd, labelMd, input
icon.size125 = 18 × 1.75 = 32   // pairs with bodyLg, buttonLg, labelLg
icon.size150 = 20 × 1.4 = 28    // pairs with h6
icon.size200 = 23 × 1.391 = 32  // pairs with h5
icon.size300 = 26 × 1.231 = 32  // pairs with h4
icon.size400 = 29 × 1.241 = 36  // pairs with h3
icon.size500 = 33 × 1.212 = 40  // pairs with h2
icon.size600 = 37 × 1.19 = 44   // pairs with h1
icon.size700 = 42 × 1.143 = 48  // pairs with display
```

### Key Observations

**4pt Subgrid Alignment:**
- 13px (not aligned, but smallest size)
- 18px (not aligned, but close to 16)
- 24px = 6 × 4 ✅
- 28px = 7 × 4 ✅
- 32px = 8 × 4 ✅
- 36px = 9 × 4 ✅
- 40px = 10 × 4 ✅
- 44px = 11 × 4 ✅
- 48px = 12 × 4 ✅

**Natural Convergence:**
- h4, h5, bodyLg all converge to 32px icons (similar heading levels)
- This convergence is mathematically derived, not arbitrary

**Expanded Range:**
- Current: 4 sizes (16, 24, 32, 40)
- Proposed: 11 sizes (13, 18, 24, 28, 32, 36, 40, 44, 48, plus duplicates)
- Unique sizes: 8 (13, 18, 24, 28, 32, 36, 40, 44, 48)

---

## Token Structure

### Proposed Implementation

```typescript
/**
 * Icon size tokens - derived from fontSize × lineHeight
 * 
 * Icons are sized to match the computed line height of their paired typography.
 * This creates perfect optical balance where icons fill the vertical space
 * of the text line.
 * 
 * Formula: icon.sizeXXX = fontSizeXXX × lineHeightXXX
 * 
 * Benefits:
 * - Perfect optical balance with text
 * - Aligns with 4pt subgrid (via lineHeight precision targeting)
 * - Mathematically derived, not arbitrary
 * - Adapts automatically when typography changes
 * - AI agents can calculate relationships
 * 
 * Examples:
 * - bodyMd: 16px × 1.5 = 24px icon
 * - h3: 29px × 1.241 = 36px icon
 * - display: 42px × 1.143 = 48px icon
 * 
 * @module tokens/semantic/IconTokens
 */

import { 
  fontSize050, fontSize075, fontSize100, fontSize125, fontSize150,
  fontSize200, fontSize300, fontSize400, fontSize500, fontSize600, fontSize700
} from '../FontSizeTokens';

import {
  lineHeight050, lineHeight075, lineHeight100, lineHeight125, lineHeight150,
  lineHeight200, lineHeight300, lineHeight400, lineHeight500, lineHeight600, lineHeight700
} from '../LineHeightTokens';

export const icon = {
  size: {
    // Calculated: fontSize × lineHeight (rounded to nearest integer)
    size050: Math.round(fontSize050.baseValue * lineHeight050.baseValue),  // 13 × 1.0 = 13
    size075: Math.round(fontSize075.baseValue * lineHeight075.baseValue),  // 14 × 1.25 = 18
    size100: Math.round(fontSize100.baseValue * lineHeight100.baseValue),  // 16 × 1.5 = 24
    size125: Math.round(fontSize125.baseValue * lineHeight125.baseValue),  // 18 × 1.75 = 32
    size150: Math.round(fontSize150.baseValue * lineHeight150.baseValue),  // 20 × 1.4 = 28
    size200: Math.round(fontSize200.baseValue * lineHeight200.baseValue),  // 23 × 1.391 = 32
    size300: Math.round(fontSize300.baseValue * lineHeight300.baseValue),  // 26 × 1.231 = 32
    size400: Math.round(fontSize400.baseValue * lineHeight400.baseValue),  // 29 × 1.241 = 36
    size500: Math.round(fontSize500.baseValue * lineHeight500.baseValue),  // 33 × 1.212 = 40
    size600: Math.round(fontSize600.baseValue * lineHeight600.baseValue),  // 37 × 1.19 = 44
    size700: Math.round(fontSize700.baseValue * lineHeight700.baseValue)   // 42 × 1.143 = 48
  }
} as const;

export type IconSize = typeof icon.size[keyof typeof icon.size];
```

### Naming Convention

**Pattern**: `icon.sizeXXX` where XXX matches the fontSize/lineHeight scale

**Rationale:**
- Consistent with typography token naming (fontSize100, lineHeight100)
- AI agents can reason: "bodyMd uses fontSize100, so icon uses icon.size100"
- Scales infinitely (can add size800, size900, etc.)
- No t-shirt sizing problems (small/medium/large breaks down when adding sizes)

---

## Migration Impact

### Files from Spec 004 Requiring Updates

#### 1. Type Definitions

**File**: `src/components/core/Icon/types.ts`

**Current:**
```typescript
export type IconSize = 16 | 24 | 32 | 40;
```

**Updated:**
```typescript
import { icon } from '@/tokens/semantic/IconTokens';

export type IconSize = typeof icon.size[keyof typeof icon.size];
// Resolves to: 13 | 18 | 24 | 28 | 32 | 36 | 40 | 44 | 48
```

**Impact**: Type-safe, but expands from 4 sizes to 8 unique sizes

#### 2. Web Implementation

**File**: `src/components/core/Icon/platforms/web/Icon.web.tsx`

**Current:**
```typescript
export function createIcon(props: IconProps): string {
  const { name, size, color, className, style, testID } = props;
  // Uses size directly as number
}
```

**Updated:**
```typescript
import { icon } from '@/tokens/semantic/IconTokens';

export function createIcon(props: IconProps): string {
  const { name, size, color, className, style, testID } = props;
  // size is now a token value (number), usage remains the same
}

// Usage
createIcon({ name: 'check', size: icon.size100 });  // 24
```

**Impact**: Minimal - size is still a number, just sourced from tokens

#### 3. iOS Implementation

**File**: `src/components/core/Icon/platforms/ios/Icon.ios.swift`

**Current:**
```swift
struct Icon: View {
    let name: String
    let size: CGFloat  // Direct numeric value
    let color: Color?
}
```

**Updated:**
```swift
// Icon size tokens generated for iOS
let iconSize050: CGFloat = 13
let iconSize075: CGFloat = 18
let iconSize100: CGFloat = 24
// ... etc

struct Icon: View {
    let name: String
    let size: CGFloat  // Still CGFloat, but use tokens
    let color: Color?
}

// Usage
Icon(name: "check", size: iconSize100)  // 24
```

**Impact**: Minimal - CGFloat type unchanged, add token constants

#### 4. Android Implementation

**File**: `src/components/core/Icon/platforms/android/Icon.android.kt`

**Current:**
```kotlin
@Composable
fun Icon(
    name: String,
    size: Dp,  // Direct Dp value
    color: Color? = null,
    modifier: Modifier = Modifier
)
```

**Updated:**
```kotlin
// Icon size tokens generated for Android
val iconSize050 = 13.dp
val iconSize075 = 18.dp
val iconSize100 = 24.dp
// ... etc

@Composable
fun Icon(
    name: String,
    size: Dp,  // Still Dp, but use tokens
    color: Color? = null,
    modifier: Modifier = Modifier
)

// Usage
Icon(name = "check", size = iconSize100)  // 24.dp
```

**Impact**: Minimal - Dp type unchanged, add token constants

#### 5. Tests

**Files**: 
- `src/components/core/Icon/__tests__/Icon.size-variants.test.ts`
- `src/components/core/Icon/platforms/web/__tests__/Icon.web.test.ts`
- Other test files

**Current:**
```typescript
const sizes: IconSize[] = [16, 24, 32, 40];
```

**Updated:**
```typescript
import { icon } from '@/tokens/semantic/IconTokens';

const sizes = [
  icon.size050, icon.size075, icon.size100, icon.size125,
  icon.size150, icon.size200, icon.size300, icon.size400,
  icon.size500, icon.size600, icon.size700
];

// Or test specific pairings
describe('Typography pairing', () => {
  it('should pair with bodyMd', () => {
    expect(icon.size100).toBe(24);  // fontSize100 × lineHeight100
  });
});
```

**Impact**: Moderate - expand test coverage for new sizes

#### 6. Documentation

**File**: `src/components/core/Icon/README.md`

**Current:**
```markdown
## Size Variants

Icons support four sizes aligned with the 8px baseline grid:
- 16px - Small UI elements
- 24px - Standard UI elements
- 32px - Large UI elements
- 40px - Extra large UI elements
```

**Updated:**
```markdown
## Size Variants

Icons are sized to match the computed line height of their paired typography,
creating perfect optical balance. Sizes are calculated using the formula:

**icon.sizeXXX = fontSizeXXX × lineHeightXXX**

Available sizes:
- `icon.size050` (13px) - Pairs with caption, legal, labelXs
- `icon.size075` (18px) - Pairs with bodySm, buttonSm, labelSm
- `icon.size100` (24px) - Pairs with bodyMd, buttonMd, labelMd, input
- `icon.size125` (32px) - Pairs with bodyLg, buttonLg, labelLg
- `icon.size150` (28px) - Pairs with h6
- `icon.size200` (32px) - Pairs with h5
- `icon.size300` (32px) - Pairs with h4
- `icon.size400` (36px) - Pairs with h3
- `icon.size500` (40px) - Pairs with h2
- `icon.size600` (44px) - Pairs with h1
- `icon.size700` (48px) - Pairs with display

### Usage Examples

```typescript
// Icon with body text
<Icon name="check" size={icon.size100} />
<Text style={typography.bodyMd}>Completed</Text>

// Icon with heading
<Icon name="heart" size={icon.size400} />
<Text style={typography.h3}>Features</Text>
```
```

**Impact**: Significant - complete documentation rewrite

### New Files to Create

#### 1. Icon Size Tokens

**File**: `src/tokens/semantic/IconTokens.ts`

**Purpose**: Define icon size tokens with fontSize × lineHeight formula

**Content**: See "Token Structure" section above

#### 2. Icon Size Token Tests

**File**: `src/tokens/semantic/__tests__/IconTokens.test.ts`

**Purpose**: Validate icon size calculations and relationships

**Content**:
```typescript
describe('Icon Size Tokens', () => {
  it('should calculate icon sizes from fontSize × lineHeight', () => {
    expect(icon.size100).toBe(
      Math.round(fontSize100.baseValue * lineHeight100.baseValue)
    );
  });

  it('should align with 4pt subgrid (except smallest sizes)', () => {
    const fourPtAligned = [24, 28, 32, 36, 40, 44, 48];
    fourPtAligned.forEach(size => {
      expect(size % 4).toBe(0);
    });
  });

  it('should adapt when fontSize changes', () => {
    // Test adaptability (may require mocking token values)
  });
});
```

#### 3. Cross-Platform Generation Updates

**Files**: Build system files for generating platform-specific tokens

**Purpose**: Generate icon size tokens for iOS (Swift) and Android (Kotlin)

**Impact**: Extend existing token generation to include icon sizes

#### 4. Documentation Guide

**File**: `docs/specs/006-icon-size-tokens/icon-size-token-guide.md`

**Purpose**: Explain the fontSize × lineHeight formula and usage patterns

**Content**:
- Formula explanation
- Optical balance rationale
- Typography pairing examples
- AI agent reasoning examples
- Migration guide from hard-coded sizes

---

## Design Decisions

### Decision 1: fontSize × lineHeight Formula

**Options Considered:**
1. Direct fontSize alignment (icon.size100 = fontSize100)
2. Spacing token alignment (icon.size100 = space200)
3. fontSize × multiplier (icon.size100 = fontSize100 × 1.5)
4. fontSize × lineHeight (icon.size100 = fontSize100 × lineHeight100) ← **Chosen**

**Decision**: fontSize × lineHeight formula

**Rationale:**
- **Optical Balance**: Icons fill line height space, not just match font size
- **4pt Subgrid Alignment**: Leverages existing lineHeight precision targeting
- **Mathematically Derived**: Not arbitrary - every value is calculated
- **Automatic Adaptation**: Changes to fontSize or lineHeight propagate automatically
- **AI-Friendly**: Explicit formula enables reliable reasoning

**Trade-offs:**
- ✅ **Gained**: Perfect optical balance, mathematical elegance, automatic adaptation
- ❌ **Lost**: Simplicity of direct fontSize alignment
- ⚠️ **Risk**: More sizes to manage (8 unique sizes vs 4 current)

**Counter-Arguments:**
- **Argument**: "Direct fontSize alignment is simpler"
- **Response**: Simplicity without optical balance creates visual problems. Icons same size as text look too small.

- **Argument**: "More sizes increases complexity"
- **Response**: Complexity is managed by the formula. AI agents can calculate which size to use based on typography pairing.

### Decision 2: Numeric Scale Naming (size050, size100, etc.)

**Options Considered:**
1. T-shirt sizing (small, medium, large, extraLarge)
2. Typography pairing names (bodyMd, h3, display)
3. Baseline grid multipliers (baseline2x, baseline3x)
4. Numeric scale (size050, size075, size100) ← **Chosen**

**Decision**: Numeric scale matching fontSize/lineHeight scale

**Rationale:**
- **Consistency**: Matches existing typography token naming
- **Scalability**: Can add size800, size900 without naming conflicts
- **AI-Friendly**: Clear progression (050 < 075 < 100)
- **No T-shirt Sizing Problems**: Avoids "extraExtraLarge" naming issues

**Trade-offs:**
- ✅ **Gained**: Infinite scalability, consistent naming, AI-friendly progression
- ❌ **Lost**: Semantic clarity (doesn't tell you when to use it)
- ⚠️ **Risk**: Requires documentation to understand use cases

**Counter-Arguments:**
- **Argument**: "Typography pairing names (bodyMd, h3) are more semantic"
- **Response**: Creates tight coupling and doesn't handle convergence (h4, h5 both = 32px). Numeric scale with documentation provides flexibility.

### Decision 3: Expand Size Range (4 → 8 unique sizes)

**Options Considered:**
1. Keep 4 sizes, map typography to closest size
2. Expand to 8 unique sizes (13, 18, 24, 28, 32, 36, 40, 44, 48) ← **Chosen**
3. Create all 11 sizes (including duplicates)

**Decision**: Expand to 8 unique sizes

**Rationale:**
- **Perfect Pairing**: Each typography style has a matching icon size
- **Optical Balance**: Icons fill line height space for all typography variants
- **Manageable Complexity**: 8 sizes is reasonable, not overwhelming
- **SVG Scalability**: SVGs render perfectly at any size

**Trade-offs:**
- ✅ **Gained**: Perfect typography pairing, optical balance for all variants
- ❌ **Lost**: Simplicity of 4 sizes
- ⚠️ **Risk**: More sizes to test and document

**Counter-Arguments:**
- **Argument**: "4 sizes is simpler and sufficient"
- **Response**: Insufficient for perfect typography pairing. Missing sizes for bodySm (18), h6 (28), h3 (36), h1 (44), display (48).

---

## Success Criteria

### Functional Requirements

1. ✅ Icon sizes calculated from fontSize × lineHeight formula
2. ✅ Icon sizes adapt automatically when typography tokens change
3. ✅ Type safety maintained (IconSize type derived from tokens)
4. ✅ Cross-platform consistency (web, iOS, Android)
5. ✅ Backward compatibility (existing icon usage continues to work)

### Quality Requirements

1. ✅ All tests pass with new icon sizes
2. ✅ Visual regression tests confirm optical balance
3. ✅ Documentation explains formula and usage patterns
4. ✅ AI agents can reason about icon size selection
5. ✅ Build system generates platform-specific tokens correctly

### AI Collaboration Requirements

1. ✅ Formula is explicit and calculable
2. ✅ Reasoning path is clear (typography → icon size)
3. ✅ Documentation provides context for AI agents
4. ✅ Token names follow consistent patterns
5. ✅ Mathematical relationships are preserved

---

## Implementation Phases

### Phase 1: Token Creation
- Create `src/tokens/semantic/IconTokens.ts`
- Implement fontSize × lineHeight formula
- Export IconSize type
- Write token tests

### Phase 2: Type System Updates
- Update `src/components/core/Icon/types.ts`
- Update IconSize type to reference tokens
- Verify type safety across codebase

### Phase 3: Component Updates
- Update web implementation to use tokens
- Update iOS implementation with generated tokens
- Update Android implementation with generated tokens
- Maintain backward compatibility during transition

### Phase 4: Test Updates
- Update size variant tests
- Add typography pairing tests
- Add adaptability tests
- Update visual regression tests

### Phase 5: Documentation
- Update Icon README with new sizes
- Create icon size token guide
- Document formula and rationale
- Provide migration examples

### Phase 6: Build System Integration
- Extend token generation for icon sizes
- Generate iOS Swift constants
- Generate Android Kotlin constants
- Verify cross-platform consistency

---

## Open Questions

### Question 1: Backward Compatibility Strategy

**Question**: Should we maintain backward compatibility with hard-coded sizes (16, 24, 32, 40)?

**Options:**
1. **Breaking change**: Remove hard-coded sizes, require token usage
2. **Deprecation period**: Support both, warn on hard-coded usage
3. **Permanent support**: Allow both tokens and hard-coded values

**Recommendation**: Deprecation period (Option 2)
- Allows gradual migration
- Provides clear migration path
- Eventually enforces token usage

### Question 2: Handling Size Convergence

**Question**: Multiple typography styles converge to same icon size (h4, h5, bodyLg all = 32px). Is this acceptable?

**Analysis:**
- **Pro**: Mathematically derived, not arbitrary
- **Pro**: Similar heading levels should have similar icon sizes
- **Con**: Less granularity for designers

**Recommendation**: Accept convergence
- It's a natural result of the formula
- Provides consistency across similar typography levels
- Can be adjusted by changing lineHeight if needed

### Question 3: Smallest Size (13px)

**Question**: Is 13px too small for icons? Should we have a minimum size?

**Analysis:**
- 13px pairs with caption, legal, labelXs (smallest text)
- SVGs scale perfectly, but may look thin at small sizes
- Current minimum is 16px

**Recommendation**: Include 13px but document as "use sparingly"
- Provides complete typography pairing
- Designers can choose not to use it
- Better to have the option than force a gap

---

## Next Steps

1. **Review this design outline** with stakeholders
2. **Create requirements document** (requirements.md)
3. **Finalize design decisions** (design.md)
4. **Create implementation tasks** (tasks.md)
5. **Begin Phase 1 implementation** (token creation)

---

**Organization**: spec-guide
**Scope**: 006-icon-size-tokens
