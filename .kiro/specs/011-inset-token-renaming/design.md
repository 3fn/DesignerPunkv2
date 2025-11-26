# Design Document: Inset Token Renaming

**Date**: November 25, 2025
**Spec**: 011 - Inset Token Renaming
**Status**: Design Phase
**Dependencies**: None

---

## Overview

This design document outlines the technical approach for renaming inset spacing semantic tokens from subjective synonyms to a numeric scale that exposes mathematical relationships. The renaming maintains visual consistency while improving developer experience and AI collaboration through mathematical transparency.

**Key Design Principles**:
- Maintain existing pixel values (no visual changes)
- Expose mathematical relationships through numeric naming
- Use "inset" prefix in component props for clarity
- Breaking change with clean cutover (no deprecation period)
- Layout tokens remain unchanged

---

## Architecture

### Token System Architecture

```
Primitive Layer (unchanged):
  space050 = 4px (0.5 × base)
  space100 = 8px (1 × base)
  space150 = 12px (1.5 × base)
  space200 = 16px (2 × base)
  space300 = 24px (3 × base)
  space400 = 32px (4 × base)
  
Semantic Layer (renamed):
  space.inset.050 → space050
  space.inset.100 → space100
  space.inset.150 → space150
  space.inset.200 → space200
  space.inset.300 → space300
  space.inset.400 → space400
  
Component Props (with prefix):
  padding="inset050"
  padding="inset100"
  padding="inset150"
  padding="inset200"
  padding="inset300"
  padding="inset400"
```

### Naming Convention

**Token Names**: Numeric (050, 100, 150, 200, 300, 400)
- Used in token definitions
- Used in token paths (space.inset.150)
- No "inset" prefix in token names

**Prop Values**: Prefixed (inset050, inset100, inset150, inset200, inset300, inset400)
- Used in component props
- Provides context for developers and AI
- Self-documenting code

**Mapping**: Components strip prefix to resolve token paths
```typescript
"inset150" → "space.inset.150" → space150 → 12px
```

---

## Components and Interfaces

### Semantic Token Definition

```typescript
// src/tokens/semantic/SpacingTokens.ts

/**
 * Inset Spacing Tokens (Internal Spacing)
 * 
 * Numeric naming exposes mathematical relationships:
 * - 050: 4px (0.5 × base)
 * - 100: 8px (1 × base)  
 * - 150: 12px (1.5 × base)
 * - 200: 16px (2 × base)
 * - 300: 24px (3 × base)
 * - 400: 32px (4 × base)
 * 
 * Use for padding within components and containers.
 */
export const insetSpacing = {
  /**
   * 050 - Minimal internal spacing (4px)
   * Mathematical relationship: 0.5 × base (space100)
   * Example: Compact chips, dense toolbars, tight buttons
   */
  '050': { value: 'space050' } as SpacingSemanticToken,

  /**
   * 100 - Compact internal spacing (8px)
   * Mathematical relationship: 1 × base (space100)
   * Example: Small buttons, compact cards, dense forms
   */
  '100': { value: 'space100' } as SpacingSemanticToken,

  /**
   * 150 - Standard internal spacing (12px)
   * Mathematical relationship: 1.5 × base (space100)
   * Example: Standard buttons, cards, form inputs
   */
  '150': { value: 'space150' } as SpacingSemanticToken,

  /**
   * 200 - Comfortable internal spacing (16px)
   * Mathematical relationship: 2 × base (space100)
   * Example: Large buttons, comfortable cards, readable content
   */
  '200': { value: 'space200' } as SpacingSemanticToken,

  /**
   * 300 - Spacious internal spacing (24px)
   * Mathematical relationship: 3 × base (space100)
   * Example: Hero sections, emphasized content, feature callouts
   */
  '300': { value: 'space300' } as SpacingSemanticToken,

  /**
   * 400 - Maximum internal spacing (32px)
   * Mathematical relationship: 4 × base (space100)
   * Example: Landing page heroes, maximum emphasis areas
   */
  '400': { value: 'space400' } as SpacingSemanticToken
};
```

### TypeScript Types

```typescript
// Component prop types with "inset" prefix
export type InsetPadding = 
  | 'inset050' 
  | 'inset100' 
  | 'inset150' 
  | 'inset200' 
  | 'inset300' 
  | 'inset400';

// Component interface example
interface ContainerProps {
  /**
   * Inset padding values (internal spacing)
   * 
   * Values represent multiples of base spacing (space100 = 8px):
   * - inset050: 4px (0.5 × base)
   * - inset100: 8px (1 × base)
   * - inset150: 12px (1.5 × base)
   * - inset200: 16px (2 × base)
   * - inset300: 24px (3 × base)
   * - inset400: 32px (4 × base)
   */
  padding?: InsetPadding;
  children: ReactNode;
}
```

### Component Prop Mapping

```typescript
// Component implementation maps prefixed prop values to token paths
function Container({ padding, children }: ContainerProps) {
  // Map prop value to token path
  const tokenPath = padding 
    ? `space.inset.${padding.replace('inset', '')}` 
    : null;
  
  // Resolve token value
  const paddingValue = tokenPath ? getSemanticToken(tokenPath) : null;
  
  // Apply to platform-specific implementation
  return (
    <div style={{ padding: paddingValue }}>
      {children}
    </div>
  );
}
```

---

## Data Models

### Token Mapping Table

| Old Name | New Token Name | New Prop Value | Primitive Reference | Pixel Value | Mathematical Relationship |
|----------|----------------|----------------|---------------------|-------------|---------------------------|
| tight | 050 | inset050 | space050 | 4px | 0.5 × base |
| normal | 100 | inset100 | space100 | 8px | 1 × base |
| comfortable | 150 | inset150 | space150 | 12px | 1.5 × base |
| spacious | 200 | inset200 | space200 | 16px | 2 × base |
| expansive | 300 | inset300 | space300 | 24px | 3 × base |
| generous | 400 | inset400 | space400 | 32px | 4 × base |

### Migration Impact Analysis

**Files Requiring Updates**:

1. **Token Definitions**:
   - `src/tokens/semantic/SpacingTokens.ts` - Rename inset token keys

2. **Components**:
   - `src/components/core/ButtonCTA/` - Update padding prop values
   - `src/components/core/Icon/` - Update padding prop values (if used)

3. **Platform Generators**:
   - `src/generators/platforms/WebCSSGenerator.ts` - Generate new CSS custom property names
   - `src/generators/platforms/iOSSwiftGenerator.ts` - Generate new Swift constant names
   - `src/generators/platforms/AndroidKotlinGenerator.ts` - Generate new Kotlin constant names

4. **Tests**:
   - `src/tokens/semantic/__tests__/SpacingTokens.test.ts` - Update token name assertions
   - `src/components/core/ButtonCTA/__tests__/` - Update prop value assertions
   - `src/generators/__tests__/` - Update generated output assertions

5. **Documentation**:
   - Component README files
   - Token system documentation
   - Migration guides

---

## Error Handling

### Invalid Token Values

```typescript
// TypeScript prevents invalid values at compile time
<Container padding="inset075">  // ❌ Type error: not in InsetPadding union

// Runtime validation (optional, for dynamic values)
function validateInsetPadding(value: string): value is InsetPadding {
  const validValues: InsetPadding[] = [
    'inset050', 'inset100', 'inset150', 
    'inset200', 'inset300', 'inset400'
  ];
  return validValues.includes(value as InsetPadding);
}
```

### Token Resolution Errors

```typescript
// Handle missing tokens gracefully
function getInsetToken(propValue: InsetPadding): string | null {
  try {
    const tokenPath = `space.inset.${propValue.replace('inset', '')}`;
    const token = getSemanticToken(tokenPath);
    
    if (!token) {
      console.warn(`Inset token not found: ${tokenPath}`);
      return null;
    }
    
    return token.primitiveReferences.value;
  } catch (error) {
    console.error(`Error resolving inset token: ${propValue}`, error);
    return null;
  }
}
```

---

## Testing Strategy

### Unit Tests

**Token Definition Tests**:
```typescript
describe('Inset Spacing Tokens', () => {
  it('should have numeric token names', () => {
    expect(insetSpacing['050']).toBeDefined();
    expect(insetSpacing['100']).toBeDefined();
    expect(insetSpacing['150']).toBeDefined();
    expect(insetSpacing['200']).toBeDefined();
    expect(insetSpacing['300']).toBeDefined();
    expect(insetSpacing['400']).toBeDefined();
  });

  it('should reference correct primitive tokens', () => {
    expect(insetSpacing['050'].value).toBe('space050');
    expect(insetSpacing['100'].value).toBe('space100');
    expect(insetSpacing['150'].value).toBe('space150');
    expect(insetSpacing['200'].value).toBe('space200');
    expect(insetSpacing['300'].value).toBe('space300');
    expect(insetSpacing['400'].value).toBe('space400');
  });

  it('should not have old token names', () => {
    expect(insetSpacing['tight']).toBeUndefined();
    expect(insetSpacing['normal']).toBeUndefined();
    expect(insetSpacing['comfortable']).toBeUndefined();
    expect(insetSpacing['spacious']).toBeUndefined();
    expect(insetSpacing['expansive']).toBeUndefined();
    expect(insetSpacing['generous']).toBeUndefined();
  });
});
```

**Component Tests**:
```typescript
describe('Container Component', () => {
  it('should accept inset-prefixed padding values', () => {
    const { container } = render(<Container padding="inset150">Content</Container>);
    expect(container.firstChild).toHaveStyle({ padding: '12px' });
  });

  it('should map prop values to token paths correctly', () => {
    const tokenPath = mapPropToTokenPath('inset150');
    expect(tokenPath).toBe('space.inset.150');
  });
});
```

**Platform Generator Tests**:
```typescript
describe('Web CSS Generator', () => {
  it('should generate CSS custom properties with numeric names', () => {
    const css = generateWebCSS(insetSpacing);
    expect(css).toContain('--space-inset-050: 4px');
    expect(css).toContain('--space-inset-100: 8px');
    expect(css).toContain('--space-inset-150: 12px');
  });

  it('should not generate old token names', () => {
    const css = generateWebCSS(insetSpacing);
    expect(css).not.toContain('--space-inset-tight');
    expect(css).not.toContain('--space-inset-normal');
    expect(css).not.toContain('--space-inset-comfortable');
  });
});
```

### Integration Tests

**End-to-End Token Resolution**:
```typescript
describe('Token Resolution Integration', () => {
  it('should resolve inset tokens from prop values to pixel values', () => {
    const propValue: InsetPadding = 'inset150';
    const tokenPath = `space.inset.${propValue.replace('inset', '')}`;
    const token = getSemanticToken(tokenPath);
    const primitiveToken = getPrimitiveToken(token.primitiveReferences.value);
    
    expect(primitiveToken.value).toBe(12); // 12px
  });
});
```

### Visual Regression Tests

**Verify No Visual Changes**:
```typescript
describe('Visual Regression', () => {
  it('should maintain same visual appearance after renaming', () => {
    // Compare screenshots before/after renaming
    const before = captureScreenshot(<ButtonCTA padding="comfortable">Button</ButtonCTA>);
    const after = captureScreenshot(<ButtonCTA padding="inset150">Button</ButtonCTA>);
    
    expect(after).toMatchScreenshot(before);
  });
});
```

---

## Design Decisions

### Decision 1: Numeric Names Over Synonyms

**Options Considered**:
1. Keep subjective synonyms (tight, normal, comfortable, spacious, expansive, generous)
2. Use t-shirt sizes (xs, sm, md, lg, xl, xxl)
3. Use numeric scale (050, 100, 150, 200, 300, 400)

**Decision**: Numeric scale (Option 3)

**Rationale**:
- Exposes mathematical relationships (300 is clearly 2× 150, 3× 100)
- Enables proportion reasoning without memorization
- Aligns with token system's mathematical foundation
- AI-friendly (agents can calculate relationships)
- Matches primitive token naming pattern

**Trade-offs**:
- ✅ Gained: Mathematical transparency, proportion reasoning, AI collaboration
- ❌ Lost: Subjective semantic meaning (but this was causing confusion)
- ⚠️ Risk: Might feel too "primitive" (mitigated by semantic layer curation)

**Counter-Arguments**:
- **Argument**: T-shirt sizes are more familiar to developers
- **Response**: Familiarity doesn't outweigh mathematical transparency for a system built on mathematical foundations

- **Argument**: Numeric names lose semantic meaning
- **Response**: The semantic layer's job is scope limitation, not adding subjective meaning through synonyms

---

### Decision 2: "inset" Prefix in Prop Values

**Options Considered**:
1. No prefix (just numbers: 050, 100, 150)
2. "inset" prefix (inset050, inset100, inset150)
3. Full token path (space.inset.050, space.inset.100)

**Decision**: "inset" prefix (Option 2)

**Rationale**:
- Provides context for AI agents ("inset150" is clearly an inset padding token)
- Self-documenting code (clear what the value represents)
- Prevents confusion with other numeric values
- Consistent with token path (space.inset.150 → padding="inset150")
- Improves searchability in codebase
- Balances clarity with verbosity (not as verbose as full token path)

**Trade-offs**:
- ✅ Gained: Context, self-documentation, AI-friendly, searchability
- ❌ Lost: Some brevity (9 characters vs 3)
- ⚠️ Risk: Redundancy with prop name (mitigated by improved clarity)

**Counter-Arguments**:
- **Argument**: Redundant with prop name (padding already implies inset)
- **Response**: Redundancy provides context - you can understand the value without looking at the prop name

- **Argument**: More verbose than necessary
- **Response**: Verbosity is intentional - provides clarity and context for developers and AI

---

### Decision 3: Breaking Change (No Deprecation Period)

**Options Considered**:
1. Breaking change (rename all at once)
2. Deprecation period (support both names temporarily)

**Decision**: Breaking change (Option 1)

**Rationale**:
- Early in project with minimal usage (only ButtonCTA and Icon)
- Usage will only grow in the future
- Deal with it now while the scale is minimal
- Clean cutover with no confusion about which names to use
- Simpler implementation (no dual support, no deprecation warnings, no cleanup later)
- Aligns with spec-driven development (this is when you should make breaking changes)

**Trade-offs**:
- ✅ Gained: Clean cutover, simplicity, no confusion
- ❌ Lost: Gradual migration option
- ⚠️ Risk: Immediate breakage (mitigated by small scope)

**Counter-Arguments**:
- **Argument**: Deprecation period is safer
- **Response**: Safety isn't needed when only 2 components are affected and we control all the code

---

### Decision 4: Keep Layout Tokens Unchanged

**Options Considered**:
1. Rename layout tokens for consistency
2. Keep layout tokens unchanged

**Decision**: Keep layout tokens unchanged (Option 2)

**Rationale**:
- Layout tokens have two-level semantics (category + density)
- Category names (grouped, related, separated, sectioned) provide relationship context
- Density modifiers (tight, normal, loose) are relative to that context
- This semantic system is well-defined and works effectively
- Layout tokens are about relationships between elements (subjective modifiers make sense)
- Inset tokens are about absolute padding values (numeric names make more sense)

**Trade-offs**:
- ✅ Gained: Preserved effective semantic system for layout
- ❌ Lost: Complete consistency across all spacing tokens
- ⚠️ Risk: Two different naming conventions (mitigated by clear distinction in purpose)

**Counter-Arguments**:
- **Argument**: Inconsistent naming across spacing tokens
- **Response**: The inconsistency is intentional - layout and inset serve different purposes and benefit from different naming approaches

---

## Migration Strategy

### Phase 1: Update Token Definitions
1. Rename inset token keys in `SpacingTokens.ts`
2. Update token documentation with mathematical relationships
3. Verify token paths resolve correctly

### Phase 2: Update TypeScript Types
1. Create `InsetPadding` type with prefixed values
2. Update component interfaces to use new type
3. Verify TypeScript compilation succeeds

### Phase 3: Update Components
1. Update ButtonCTA to use new prop values
2. Update Icon to use new prop values (if applicable)
3. Verify visual appearance unchanged

### Phase 4: Update Platform Generators
1. Update WebCSSGenerator to output new token names
2. Update iOSSwiftGenerator to output new token names
3. Update AndroidKotlinGenerator to output new token names
4. Verify generated output matches expected format

### Phase 5: Update Tests
1. Update token definition tests
2. Update component tests
3. Update platform generator tests
4. Verify all tests pass

### Phase 6: Update Documentation
1. Update token system documentation
2. Update component documentation
3. Create migration guide with mapping table
4. Document breaking change and rationale

---

## Platform-Specific Considerations

### Web (CSS)

**Generated Output**:
```css
/* CSS Custom Properties */
:root {
  --space-inset-050: 4px;
  --space-inset-100: 8px;
  --space-inset-150: 12px;
  --space-inset-200: 16px;
  --space-inset-300: 24px;
  --space-inset-400: 32px;
}
```

**Usage**:
```css
.container {
  padding: var(--space-inset-150); /* 12px */
}
```

### iOS (Swift)

**Generated Output**:
```swift
// Swift Constants
let spaceInset050: CGFloat = 4
let spaceInset100: CGFloat = 8
let spaceInset150: CGFloat = 12
let spaceInset200: CGFloat = 16
let spaceInset300: CGFloat = 24
let spaceInset400: CGFloat = 32
```

**Usage**:
```swift
VStack {
  Text("Content")
}
.padding(spaceInset150) // 12pt
```

### Android (Kotlin)

**Generated Output**:
```kotlin
// Kotlin Constants
val spaceInset050 = 4.dp
val spaceInset100 = 8.dp
val spaceInset150 = 12.dp
val spaceInset200 = 16.dp
val spaceInset300 = 24.dp
val spaceInset400 = 32.dp
```

**Usage**:
```kotlin
Column(
  modifier = Modifier.padding(spaceInset150) // 12dp
) {
  Text("Content")
}
```

---

## Success Metrics

The inset token renaming is successful when:

1. ✅ All inset tokens use numeric names in token definitions
2. ✅ All component props use "inset" prefix for clarity
3. ✅ All existing components updated with no visual changes
4. ✅ All platform generators output new token names
5. ✅ All tests pass with 100% coverage
6. ✅ TypeScript enforces valid token values
7. ✅ Documentation complete with migration guide
8. ✅ No references to old token names in codebase
9. ✅ Layout tokens remain unchanged
10. ✅ Developers and AI can reason about mathematical relationships

---

**Status**: Design complete. Ready to create implementation tasks.
