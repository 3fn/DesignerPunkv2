# Inset Token Renaming Design Outline

**Date**: November 25, 2025
**Purpose**: Explore inset token renaming from subjective synonyms to numeric scale
**Organization**: spec-guide
**Scope**: 011-inset-token-renaming
**Status**: Exploratory - Design thinking in progress

---

## Overview

Rename inset spacing semantic tokens from subjective synonyms (tight, normal, comfortable, spacious, expansive, generous) to numeric scale (050, 100, 150, 200, 300, 400) that exposes mathematical relationships and proportions.

**Key Principle**: Numeric naming enables developers and AI to reason about proportions and ratios, aligning with the mathematical foundation of the token system.

---

## The Problem

### Current Inset Token Names (Subjective Synonyms)

```typescript
inset: {
  tight: { value: 'space050' },        // 4px
  normal: { value: 'space100' },       // 8px
  comfortable: { value: 'space150' },  // 12px
  spacious: { value: 'space200' },     // 16px
  expansive: { value: 'space300' },    // 24px
  generous: { value: 'space400' }      // 32px
}
```

**Problems**:
1. **Indistinguishable synonyms** - tight/normal/comfortable/spacious/expansive/generous are subjective
2. **No proportion information** - Can't tell that spacious is 2× comfortable
3. **Memorization required** - Must memorize which synonym maps to which value
4. **Poor AI reasoning** - AI can't calculate relationships between synonyms
5. **Inconsistent with mathematical foundation** - Hides the mathematical relationships

### Example of the Problem

```typescript
// Current usage:
<Container padding="comfortable">  // Is this 12px? 16px? 🤷

// What's the relationship?
comfortable vs spacious  // How much bigger? 🤷
```

**You can't reason about proportions** without looking up the values.

---

## The Solution

### Proposed Inset Token Names (Numeric Scale)

```typescript
inset: {
  '050': { value: 'space050' },  // 4px - 0.5 × base
  '100': { value: 'space100' },  // 8px - 1 × base
  '150': { value: 'space150' },  // 12px - 1.5 × base
  '200': { value: 'space200' },  // 16px - 2 × base
  '300': { value: 'space300' },  // 24px - 3 × base
  '400': { value: 'space400' }   // 32px - 4 × base
}
```

**Benefits**:
1. **Mathematical transparency** - 300 is 2× 150, 3× 100
2. **Proportion reasoning** - Can calculate relationships mentally
3. **No memorization** - Names match primitive token values
4. **AI-friendly** - AI can reason mathematically about relationships
5. **Aligns with token philosophy** - Exposes mathematical foundation

### Example of the Solution

```typescript
// Proposed usage:
<Container padding="150">  // 12px - clear value

// What's the relationship?
150 vs 300  // 300 is 2× 150 - clear proportion ✅
```

**You can reason about proportions** without looking anything up.

---

## Why Numeric Names Work

### 1. Mathematical Transparency

```typescript
// You can calculate proportions:
padding="150"  // 150 = 1.5 × base (100)
padding="200"  // 200 = 2 × base (100)
padding="300"  // 300 = 3 × base (100) = 2 × 150

// Relationships are obvious:
300 is 2× 150
200 is 1.33× 150
400 is 2× 200
```

### 2. Aligns with Mathematical Token System

The entire DesignerPunk token system is built on mathematical relationships. Numeric names expose those relationships rather than hiding them.

```typescript
// Current (hides math):
comfortable → space150 (hidden relationship)
spacious → space200 (hidden relationship)

// Proposed (exposes math):
150 → space150 (transparent relationship)
200 → space200 (transparent relationship)
```

### 3. AI-Friendly Reasoning

```typescript
// AI can reason mathematically:
"Use padding 200 for standard containers, 300 for emphasized containers"
// AI knows: 300 is 1.5× 200

// vs Current:
"Use padding comfortable for standard, spacious for emphasized"
// AI must memorize arbitrary mapping
```

### 4. Consistent with Primitive Layer

```typescript
// Primitive tokens:
space050, space100, space150, space200, space300, space400

// Semantic inset tokens (proposed):
050, 100, 150, 200, 300, 400

// Clear 1:1 mapping - no translation needed
```

---

## The Semantic Layer Still Has Value

### Question: Why Have Semantic Layer?

If semantic tokens use the same names as primitives, what's the point?

### Answer: Scope Limitation

**Primitive layer** (all spacing values):
```typescript
space025, space050, space075, space100, space125, space150, space200, 
space250, space300, space400, space500, space600, space700, space800
// 13+ options
```

**Semantic inset layer** (curated subset):
```typescript
050, 100, 150, 200, 300, 400
// 6 options - the ones appropriate for inset padding
```

**The semantic layer's job**: Say "these 6 values are appropriate for inset padding, not all 13+ primitive values."

### Semantic Layer Benefits

**1. Guidance Through Limitation**
```typescript
// Without semantic layer:
<Container padding="space075">  // Is 6px appropriate for padding?
<Container padding="space125">  // Is 10px appropriate for padding?

// With semantic layer:
<Container padding="150">  // ✅ Curated option
<Container padding="075">  // ❌ Not in semantic layer - probably wrong
```

**2. Future Flexibility**
```typescript
// If you redesign, you can change the mapping:
inset.150 → space150  // Current
inset.150 → space200  // Future redesign

// Application code doesn't change:
<Container padding="150">  // Still works
```

**3. Semantic Meaning in Context**
```typescript
// The context provides meaning:
space.inset.150  // "150 is appropriate for inset padding"
space.grouped.150  // "150 is appropriate for grouped layout spacing"

// vs primitive:
space150  // "150 exists, but is it appropriate here?"
```

---

## Migration Impact

### Files That Need Updates

**1. Semantic Token Definition**
- `src/tokens/semantic/SpacingTokens.ts` - Rename inset token keys

**2. Components Using Inset Tokens**
- `src/components/core/ButtonCTA/` - Uses inset tokens for padding
- `src/components/core/Icon/` - May use inset tokens
- Any other components using `space.inset.*`

**3. Platform Generators**
- `src/generators/platforms/WebCSSGenerator.ts` - Generate new token names
- `src/generators/platforms/iOSSwiftGenerator.ts` - Generate new token names
- `src/generators/platforms/AndroidKotlinGenerator.ts` - Generate new token names

**4. Tests**
- Update tests referencing old inset token names
- Verify generated output uses new names

**5. Documentation**
- Update any documentation referencing inset token names
- Update examples and usage guides

---

## Proposed Token Mapping

| Current Name | Token Name | Prop Value | Primitive Value | Mathematical Relationship |
|--------------|------------|------------|-----------------|---------------------------|
| `tight` | `050` | `inset050` | `space050` (4px) | 0.5 × base |
| `normal` | `100` | `inset100` | `space100` (8px) | 1 × base |
| `comfortable` | `150` | `inset150` | `space150` (12px) | 1.5 × base |
| `spacious` | `200` | `inset200` | `space200` (16px) | 2 × base |
| `expansive` | `300` | `inset300` | `space300` (24px) | 3 × base |
| `generous` | `400` | `inset400` | `space400` (32px) | 4 × base |

**Note**: Token names are numeric (050, 100, 150, etc.) but prop values use "inset" prefix (inset050, inset100, inset150, etc.) for clarity and AI-friendly context.

---

## Usage Examples

### Before (Current)

```typescript
// Component usage:
<Container padding="comfortable">
<Button padding="normal">

// Token reference:
space.inset.comfortable  // What value is this? 🤷
space.inset.spacious     // How much bigger than comfortable? 🤷
```

### After (Proposed)

```typescript
// Component usage:
<Container padding="inset150">
<Button padding="inset100">

// Token reference:
space.inset.150  // 12px - 1.5 × base ✅
space.inset.200  // 16px - 2 × base, 1.33× 150 ✅

// Prop values use "inset" prefix for clarity
```

---

## Open Questions - RESOLVED

### 1. Should We Rename Layout Tokens Too?

**Decision**: No, keep layout density modifiers as-is (tight, normal, loose)

**Rationale**: Layout tokens have two-level semantics (category + density). The category names (grouped, related, separated, sectioned) provide relationship context, and the density modifiers (tight, normal, loose) are relative to that context. This semantic system is well-defined and works effectively.

---

### 2. Backward Compatibility Strategy

**Decision**: Breaking change (Option A) - rename all at once

**Rationale**: 
- Early in project with minimal usage (only ButtonCTA and Icon currently)
- Usage will only grow in the future
- Deal with it now while the scale is minimal
- Clean cutover with no confusion about which names to use
- Simpler implementation (no dual support, no deprecation warnings, no cleanup later)

**Migration Plan**:
- Update all components using inset tokens in one PR
- Update all tests
- Update documentation
- No backward compatibility support

---

### 3. Prop Value Naming: "inset" Prefix

**Decision**: Use "inset" prefix in prop values, numeric names in token definitions

**Rationale**:
- Provides context for AI agents ("inset150" is clearly an inset padding token)
- Self-documenting code (clear what the value represents)
- Prevents confusion with other numeric values
- Consistent with token path (space.inset.150 → padding="inset150")
- Improves searchability in codebase

**Implementation**:

```typescript
// Token definition (numeric names):
inset: {
  '050': { value: 'space050' },
  '100': { value: 'space100' },
  '150': { value: 'space150' },
  '200': { value: 'space200' },
  '300': { value: 'space300' },
  '400': { value: 'space400' }
}

// Token path (clean):
space.inset.150  // ✅ No redundancy

// Prop values (clear context):
padding="inset150"  // ✅ Self-documenting

// TypeScript type:
type InsetPadding = 'inset050' | 'inset100' | 'inset150' | 'inset200' | 'inset300' | 'inset400';
```

**Component Mapping**:
Components map prefixed prop values to token paths:
```typescript
// "inset150" → "space.inset.150"
const tokenPath = padding ? `space.inset.${padding.replace('inset', '')}` : null;
```

**Benefits**:
- ✅ Clean token paths (space.inset.150)
- ✅ Clear prop values (padding="inset150")
- ✅ AI-friendly context
- ✅ Self-documenting code
- ✅ Searchable in codebase

---

## Design Decisions (To Be Formalized)

### Decision 1: Numeric Names Over Synonyms

**Options Considered**:
1. Keep subjective synonyms (tight, normal, comfortable, etc.)
2. Use t-shirt sizes (xs, sm, md, lg, xl, xxl)
3. Use numeric scale (050, 100, 150, 200, 300, 400)

**Decision**: Numeric scale (Option 3)

**Rationale**:
- Exposes mathematical relationships (proportion and ratio)
- Enables mathematical reasoning for developers and AI
- Aligns with token system's mathematical foundation
- No memorization required (names match primitive values)
- Semantic layer still provides value through scope limitation

**Trade-offs**:
- ✅ Gained: Mathematical transparency, proportion reasoning, AI-friendly
- ❌ Lost: Subjective semantic meaning (but this was causing confusion)
- ⚠️ Risk: Might feel too "primitive" (but semantic layer still provides curation)

---

## Next Steps

1. **Resolve open questions** through discussion
2. **Create formal requirements document** with EARS format
3. **Plan migration strategy** (breaking change vs deprecation)
4. **Update semantic token definitions**
5. **Update existing components** (ButtonCTA, Icon)
6. **Update platform generators**
7. **Update tests and documentation**
8. **Verify generated output** uses new token names

---

## Observations & Learnings

### Key Insights

1. **Subjective synonyms hide mathematical relationships** - tight/comfortable/spacious don't convey proportion
2. **Numeric names expose the math** - 300 is clearly 2× 150
3. **Semantic layer's job is scope limitation** - not adding subjective meaning through synonyms
4. **Mathematical transparency aligns with system philosophy** - the entire token system is built on math
5. **AI collaboration benefits from numeric reasoning** - AI can calculate relationships

### Challenges Identified

1. **Migration impact** - Need to update existing components
2. **Layout token consistency** - Should layout tokens also use numeric names?
3. **Backward compatibility** - Breaking change or deprecation period?
4. **Documentation updates** - Need to explain the numeric naming convention

### Design Philosophy Alignment

This change aligns with DesignerPunk principles:
- ✅ **Mathematical foundation**: Exposes mathematical relationships
- ✅ **AI collaboration**: Enables mathematical reasoning
- ✅ **Systematic approach**: Consistent naming convention
- ✅ **Transparency**: Shows relationships rather than hiding them
- ✅ **Token hierarchy**: Semantic layer still provides curation

---

**Status**: Design exploration complete. Ready to create formal requirements document.
