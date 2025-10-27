# Shadow/Glow Semantic Reference Issue - Findings Document

**Date**: October 25, 2025
**Purpose**: Document semantic→semantic reference limitation discovered during semantic token generation implementation
**Organization**: spec-completion
**Scope**: semantic-token-generation
**Status**: Issue Identified - Future Spec Required

---

## Executive Summary

During implementation of end-to-end semantic token generation (Task 6.5), discovered that shadow and glow semantic tokens require **semantic→semantic references** (referencing other semantic tokens like `color.shadow.default`), but the current validation system only supports **semantic→primitive references**. This limitation blocks shadow/glow semantic token generation.

**Impact**: 9 shadow tokens and glow tokens cannot be generated as semantic tokens in current implementation.

**Resolution**: Temporarily exclude shadow/glow tokens from semantic generation. They remain available as primitive tokens. Future spec will address semantic→semantic reference support.

---

## Problem Description

### The Issue

Shadow semantic tokens are defined with references to semantic color tokens:

```typescript
// Shadow token definition
{
  name: 'shadow.container',
  primitiveReferences: {
    offsetX: 'shadowOffsetX.000',      // ✅ Primitive reference
    offsetY: 'shadowOffsetY.100',      // ✅ Primitive reference
    blur: 'shadowBlurModerate',        // ✅ Primitive reference
    opacity: 'shadowOpacityModerate',  // ✅ Primitive reference
    color: 'color.shadow.default'      // ❌ SEMANTIC reference (not primitive)
  }
}
```

The `color` property references `color.shadow.default`, which is itself a semantic token that references `shadowBlack100` primitive.

### Why This Fails Validation

The `validateSemanticReferences()` method in TokenFileGenerator checks that all references exist in the **primitive token list**:

```typescript
// Create a set of primitive token names for fast lookup
const primitiveNames = new Set(primitives.map(p => p.name));

// Check if reference exists in primitives
if (!primitiveNames.has(refs.value)) {
  // ERROR: 'color.shadow.default' not found in primitive tokens
}
```

Since `color.shadow.default` is a semantic token (not primitive), validation fails with:
```
"Semantic token 'shadow.container' has invalid color reference 'color.shadow.default'"
```

### Current Behavior

When validation fails:
1. Errors are logged for all shadow tokens (9 errors)
2. Semantic generation is skipped entirely (graceful degradation)
3. Result: `semanticTokenCount = 0`, `valid = false`
4. No semantic tokens appear in generated files

---

## Root Cause Analysis

### Design Limitation

The current semantic token system was designed with a **single-level hierarchy**:

```
Primitive Tokens (mathematical foundation)
    ↓
Semantic Tokens (contextual meaning)
```

This works perfectly for:
- **Colors**: `color.primary` → `purple300` (primitive)
- **Spacing**: `space.grouped.normal` → `space100` (primitive)
- **Typography**: `typography.bodyMd` → `fontSize100`, `lineHeight100`, etc. (all primitives)
- **Borders**: `border.default` → `borderWidth100` (primitive)

### Why Shadow/Glow Need Multi-Level References

Shadow and glow tokens have a **semantic color component** that should reference semantic colors, not primitives:

```
Primitive Tokens
    ↓
Semantic Color Tokens (color.shadow.default → shadowBlack100)
    ↓
Semantic Shadow Tokens (shadow.container → color.shadow.default)
```

**Why this matters**:
- Shadow colors have semantic meaning ("default shadow", "warm shadow", "cool shadow")
- These semantic meanings should be reusable across shadow, glow, and other effects
- Forcing shadows to reference primitive colors directly (`shadowBlack100`) bypasses the semantic layer
- This violates the design principle that semantic tokens provide contextual meaning

### Architectural Insight

This reveals a fundamental architectural question:

**Should semantic tokens form a flat namespace or support hierarchical composition?**

Current design: **Flat namespace** (all semantics reference primitives directly)
Shadow/glow need: **Hierarchical composition** (semantics can reference other semantics)

---

## Affected Tokens

### Shadow Tokens (9 tokens)

All shadow semantic tokens reference `color.shadow.*` semantic tokens:

1. `shadow.container` → references `color.shadow.default`
2. `shadow.modal` → references `color.shadow.default`
3. `shadow.fab` → references `color.shadow.warm`
4. `shadow.hover` → references `color.shadow.default`
5. `shadow.sunrise` → references `color.shadow.warm`
6. `shadow.morning` → references `color.shadow.default`
7. `shadow.noon` → references `color.shadow.default`
8. `shadow.dusk` → references `color.shadow.default`
9. `shadow.sunset` → references `color.shadow.warm`

### Glow Tokens (if any)

Glow tokens likely have similar semantic→semantic reference needs for color properties.

### Working Tokens (66 tokens)

These tokens work correctly with semantic→primitive references:
- Color semantic tokens: ~20 tokens
- Spacing semantic tokens: ~15 tokens
- Typography semantic tokens: ~20 tokens
- Border semantic tokens: ~5 tokens
- Other semantic tokens: ~6 tokens

**Success Rate**: 88% of semantic tokens work with current implementation (66 out of 75)

---

## Temporary Workaround

### Implementation

Add filter to exclude shadow/glow tokens before validation:

```typescript
// In TokenFileGenerator generation methods
const semantics = getAllSemanticTokens();

// Filter out shadow/glow tokens temporarily
const filteredSemantics = semantics.filter(s => 
  !s.name.startsWith('shadow.') && 
  !s.name.startsWith('glow.')
);

// Validate and generate with filtered list
const validationResult = this.validateSemanticReferences(filteredSemantics, tokens);
```

### Impact of Workaround

**What Still Works**:
- ✅ 66 semantic tokens generate successfully across all platforms
- ✅ All primitive tokens (156) remain unchanged
- ✅ Shadow/glow primitive tokens still available for direct use
- ✅ Cross-platform consistency maintained for working tokens
- ✅ Reference validation works for all non-shadow/glow tokens

**What Doesn't Work**:
- ❌ Shadow semantic tokens not generated (9 tokens)
- ❌ Glow semantic tokens not generated (if any)
- ❌ Developers must use shadow/glow primitives directly

**Developer Experience**:
- Developers can use `color.primary`, `space.grouped.normal`, `typography.bodyMd` (semantic)
- Developers must use `shadowBlack100`, `shadowOffsetX.100` (primitives) for shadows
- This inconsistency is acceptable as temporary measure
- Clear documentation explains the limitation

---

## Requirements for Future Spec

### Core Requirement

**Support semantic→semantic references** while maintaining validation and cross-platform consistency.

### Design Considerations

#### Option 1: Dependency Resolution

Implement topological sort to resolve semantic tokens in dependency order:

```typescript
// Resolve semantic tokens in order
1. Resolve semantic tokens with only primitive references (color.shadow.default)
2. Resolve semantic tokens with semantic references (shadow.container)
3. Generate in resolved order
```

**Pros**: Maintains current validation approach, clear dependency chain
**Cons**: Requires dependency graph, more complex generation logic

#### Option 2: Two-Pass Generation

Generate semantic tokens in two passes:

```typescript
// Pass 1: Generate semantic tokens with primitive references only
const pass1 = semantics.filter(hasOnlyPrimitiveRefs);
generateSemanticSection(pass1);

// Pass 2: Generate semantic tokens with semantic references
const pass2 = semantics.filter(hasSemanticRefs);
generateSemanticSection(pass2);
```

**Pros**: Simple to implement, clear separation
**Cons**: Requires two passes, may not scale to deeper hierarchies

#### Option 3: Lazy Resolution

Generate all semantic tokens with references, resolve at runtime:

```typescript
// Generate with references (no resolution)
const shadow.container = {
  color: color.shadow.default  // Reference, not resolved
}
```

**Pros**: Simplest generation, runtime flexibility
**Cons**: Requires runtime resolution support on all platforms

### Validation Requirements

1. **Detect circular references**: `A → B → A` should fail validation
2. **Validate reference chains**: All references must eventually resolve to primitives
3. **Maintain cross-platform consistency**: Same reference chains across all platforms
4. **Clear error messages**: Indicate which token has invalid reference and why

### Platform Considerations

Each platform must support semantic→semantic references:

**JavaScript/Web**:
```javascript
// Should work naturally with object references
const colorShadowDefault = shadowBlack100;
const shadowContainer = {
  color: colorShadowDefault  // Reference works
};
```

**Swift/iOS**:
```swift
// Should work with constant references
public static let colorShadowDefault = shadowBlack100
public static let shadowContainer = Shadow(
  color: colorShadowDefault  // Reference works
)
```

**Kotlin/Android**:
```kotlin
// Should work with val references
val colorShadowDefault = shadowBlack100
val shadowContainer = Shadow(
  color = colorShadowDefault  // Reference works
)
```

All three platforms support this pattern naturally.

---

## Testing Requirements for Future Spec

### Unit Tests

1. Test semantic→semantic reference validation
2. Test circular reference detection
3. Test dependency resolution order
4. Test multi-level reference chains (A → B → C → primitive)

### Integration Tests

1. Test shadow token generation with semantic color references
2. Test glow token generation with semantic color references
3. Test cross-platform consistency with multi-level references
4. Test error handling for invalid semantic references

### Edge Cases

1. Circular references (A → B → A)
2. Missing semantic references (A → B, but B doesn't exist)
3. Mixed primitive and semantic references in same token
4. Deep reference chains (A → B → C → D → primitive)

---

## Migration Path

### Phase 1: Implement Semantic→Semantic Support

1. Extend validation to support semantic references
2. Implement dependency resolution (topological sort or two-pass)
3. Update platform generators to handle semantic references
4. Add comprehensive tests

### Phase 2: Migrate Shadow Tokens

1. Remove shadow token filter from TokenFileGenerator
2. Verify shadow tokens generate correctly
3. Update documentation to reflect shadow semantic token availability
4. Test cross-platform shadow token generation

### Phase 3: Migrate Glow Tokens

1. Define glow semantic tokens with semantic color references
2. Verify glow tokens generate correctly
3. Update documentation
4. Test cross-platform glow token generation

### Phase 4: Documentation and Examples

1. Document semantic→semantic reference patterns
2. Provide examples of multi-level token hierarchies
3. Update Token System Overview with hierarchy documentation
4. Create migration guide for developers

---

## Related Work

### Current Spec

- **Spec**: semantic-token-generation
- **Status**: In progress (Task 6.5)
- **Workaround**: Filter shadow/glow tokens temporarily

### Future Spec

- **Spec**: shadow-glow-semantic-token-migration (suggested name)
- **Purpose**: Implement semantic→semantic reference support and migrate shadow/glow tokens
- **Dependencies**: Requires semantic-token-generation spec completion
- **Priority**: Medium (shadow/glow primitives still work, semantic layer is enhancement)

---

## Lessons Learned

### What We Discovered

1. **Single-level hierarchy assumption**: Original design assumed all semantic tokens reference primitives directly
2. **Semantic color reusability**: Shadow colors have semantic meaning that should be reusable
3. **Validation rigidity**: Current validation correctly enforces primitive-only references
4. **Platform support**: All three platforms naturally support multi-level references

### Design Insights

1. **Semantic tokens can form hierarchies**: Not all semantic tokens are equal - some provide meaning for others
2. **Validation must support composition**: Need to validate reference chains, not just single-level references
3. **Graceful degradation works**: Filtering problematic tokens allows spec completion without blocking
4. **Clear documentation prevents confusion**: Explicit limitation documentation helps future development

### Process Insights

1. **Integration tests reveal design limitations**: End-to-end tests exposed the semantic→semantic reference need
2. **Temporary workarounds enable progress**: Filtering allows spec completion while planning proper solution
3. **Findings documents capture context**: This document provides valuable input for future spec
4. **Honest assessment prevents technical debt**: Acknowledging limitation better than forcing bad solution

---

## Recommendations

### For Current Spec

1. ✅ **Implement filter workaround**: Exclude shadow/glow tokens from semantic generation
2. ✅ **Document limitation clearly**: Explain why shadow/glow tokens not included
3. ✅ **Complete spec with 66 working tokens**: 88% success rate is excellent for initial implementation
4. ✅ **Create this findings document**: Capture context for future work

### For Future Spec

1. **Prioritize semantic→semantic support**: This is a fundamental capability for hierarchical token systems
2. **Start with dependency resolution**: Topological sort provides clean solution
3. **Validate reference chains**: Ensure all chains eventually resolve to primitives
4. **Test thoroughly**: Multi-level references introduce complexity that needs comprehensive testing

### For Design System Evolution

1. **Consider hierarchy depth limits**: How many levels of semantic→semantic references should be supported?
2. **Document composition patterns**: Provide clear guidance on when to use semantic→semantic references
3. **Maintain mathematical foundation**: Ensure all semantic chains eventually resolve to mathematical primitives
4. **Preserve cross-platform consistency**: Multi-level references must work identically across all platforms

---

## Conclusion

The shadow/glow semantic reference issue reveals an important architectural consideration: **semantic tokens can form hierarchies, not just flat namespaces**. The current implementation correctly enforces primitive-only references, which works for 88% of semantic tokens.

The temporary workaround (filtering shadow/glow tokens) allows this spec to complete successfully while preserving the design integrity. Shadow and glow tokens remain available as primitives, and the semantic layer can be added in a future spec once semantic→semantic reference support is implemented.

This findings document provides the context, requirements, and design considerations needed for that future work.

---

**Next Steps**:
1. Implement filter workaround in TokenFileGenerator
2. Complete Task 6.5 with 66 working semantic tokens
3. Document limitation in task completion
4. Plan future shadow-glow-semantic-token-migration spec

