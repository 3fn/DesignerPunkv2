# Preliminary Audit Findings: Token Generation Pipeline

**Date**: 2026-01-05
**Status**: Preliminary
**Purpose**: Document initial findings from auditing the Rosetta System token generation pipeline
**Scope**: Infrastructure assessment for component token integration

## Audit Approach

Started from `docs/token-system-overview.md` and followed links to examine:
- Generator infrastructure (`src/generators/`)
- Registry infrastructure (`src/registries/`)
- Validation infrastructure (`src/integration/`, `src/validators/`)
- Component token infrastructure (`src/build/tokens/`)

## Pipeline Architecture (Current State)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     TOKEN DEFINITION LAYER                               │
├─────────────────────────────────────────────────────────────────────────┤
│  src/tokens/SpacingTokens.ts     → Primitive tokens (space100, etc.)    │
│  src/tokens/semantic/*.ts        → Semantic tokens (space.inset.*, etc.)│
│  src/components/*/tokens.ts      → Component tokens (NOT CONNECTED)     │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     VALIDATION LAYER                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  ThreeTierValidator              → Pass/Warning/Error validation        │
│  ValidationCoordinator           → Orchestrates validation + caching    │
│  MathematicalRelationshipParser  → Validates math formulas              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     REGISTRY LAYER                                       │
├─────────────────────────────────────────────────────────────────────────┤
│  PrimitiveTokenRegistry          → Stores primitive tokens              │
│  SemanticTokenRegistry           → Stores semantic tokens               │
│  ❌ ComponentTokenRegistry       → DOES NOT EXIST                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     GENERATION LAYER                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  TokenFileGenerator              → Orchestrates platform generation     │
│  ├── WebFormatGenerator          → CSS custom properties                │
│  ├── iOSFormatGenerator          → Swift constants                      │
│  └── AndroidFormatGenerator      → Kotlin constants                     │
│  BlendUtilityGenerator           → Blend functions per platform         │
│  ❌ ComponentTokenGenerator      → EXISTS but NOT INTEGRATED            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     OUTPUT LAYER                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  dist/DesignTokens.web.css       → Web tokens                           │
│  dist/DesignTokens.ios.swift     → iOS tokens                           │
│  dist/DesignTokens.android.kt    → Android tokens                       │
│  dist/BlendUtilities.*           → Blend utilities per platform         │
│  ❌ Component tokens             → NOT GENERATED                        │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key Findings

### What's Working (Primitive + Semantic Pipeline)

1. **Primitive tokens** flow through: Definition → Validation → Registry → Generation → Platform output ✅
2. **Semantic tokens** flow through: Definition → Validation → Registry → Generation → Platform output ✅
3. **Blend utilities** flow through: Generation → Platform output ✅

### What's Missing (Component Token Pipeline)

| Component | Status | Notes |
|-----------|--------|-------|
| `ComponentToken.ts` | ✅ Exists | Well-designed interface with platform values, usage tracking, promotion detection |
| `ComponentTokenGenerator.ts` | ✅ Exists | Generates tokens, validates, checks promotion candidates |
| `ComponentTokenRegistry` | ❌ Missing | No registry to store component tokens |
| `ValidationCoordinator` integration | ❌ Missing | Only handles primitive and semantic tokens |
| `TokenFileGenerator` integration | ❌ Missing | Only calls `getAllPrimitiveTokens()` and `getAllSemanticTokens()` |
| Component token collection | ❌ Missing | No mechanism to discover/collect component tokens from component directories |

### ComponentTokenGenerator Capabilities (Unused)

The existing `ComponentTokenGenerator.ts` provides:
- `generate(spec)` - Creates component token from specification
- `validate(token)` - Validates mathematical principles, baseline grid alignment
- `checkPromotion(token)` - Recommends promotion to primitive based on usage
- Platform value generation (iOS pt, Android dp, Web px)
- Primitive token reference validation
- Usage tracking infrastructure

**Key insight**: The infrastructure is well-designed but completely disconnected from the main pipeline.

### Integration Gap Analysis

To connect component tokens to the pipeline, we need:

1. **ComponentTokenRegistry** - Following `IRegistry<ComponentToken>` interface pattern
2. **ValidationCoordinator update** - Add `validateComponentToken()` and `validateComponentTokens()` methods
3. **TokenFileGenerator update** - Add component token section to generated output
4. **Collection mechanism** - Way to discover component tokens from `src/components/*/tokens.ts` files

## Complexity Assessment

**Infrastructure exists**: The `ComponentToken` interface and `ComponentTokenGenerator` are well-designed.

**Integration work required**:
- Create `ComponentTokenRegistry` (~100-150 lines, following existing patterns)
- Update `ValidationCoordinator` (~50-100 lines)
- Update `TokenFileGenerator` (~100-150 lines)
- Create collection mechanism (~50-100 lines)

**Estimated effort**: 3-5 tasks, moderate complexity

**Risk factors**:
- Need to ensure component tokens don't conflict with primitive/semantic naming
- Need to decide output format (separate file vs integrated into DesignTokens.*)
- Need to handle component token → primitive token references correctly

## Open Questions

1. Should component tokens be output to separate files or integrated into `DesignTokens.*`?
2. How should component tokens reference primitives in generated output?
3. Should we validate that component tokens reference primitives where available?
4. How does this align with Spec 035's token consumption strategy?

## Recommendations

**Option A: Implement in Spec 037**
- Keep scope tight (Button-Icon only as proof of concept)
- Create minimal infrastructure to prove the pattern
- Document pattern for future components

**Option B: Create Spec 038**
- Spec 037 focuses on architecture documentation only
- Spec 038 handles full component token pipeline implementation
- More thorough, but delays Button-Icon fix

## Next Steps

1. Review Spec 035 design.md to understand token consumption strategy
2. Identify any conflicts between 035 approach and 037 proposal
3. Decide on Option A vs Option B based on alignment
4. If proceeding, finalize implementation tasks

## Files Examined

### Documentation
- `docs/token-system-overview.md` - Primary source
- `docs/architecture/registry-validator-pattern.md` - Validation patterns

### Infrastructure
- `src/generators/TokenFileGenerator.ts` - Main generator (truncated, ~988 lines)
- `src/build/tokens/ComponentTokenGenerator.ts` - Component token generator
- `src/build/tokens/ComponentToken.ts` - Component token interface
- `src/registries/PrimitiveTokenRegistry.ts` - Primitive registry
- `src/registries/SemanticTokenRegistry.ts` - Semantic registry
- `src/registries/IRegistry.ts` - Registry interface
- `src/integration/ValidationCoordinator.ts` - Validation orchestration


## Complexity Assessment

### Overall: Moderate (3-5 tasks)

**Why Moderate (not Low)**:
- Infrastructure exists but integration is non-trivial
- Need to create ComponentTokenRegistry
- Need to update ValidationCoordinator
- Need to connect generator to pipeline
- Need to define platform output format

**Why Moderate (not High)**:
- Patterns exist from primitive/semantic implementation
- ComponentTokenGenerator already scaffolded
- Clear model to follow (PrimitiveTokenRegistry pattern)
- Button-Icon provides concrete QA case

## Spec 035 vs Spec 037 Alignment

### Alignment ✅
- Both recognize component tokens as a distinct layer
- Both identify the need for token references over hard-coded values
- Spec 035's design.md Token Flow diagram shows component tokens as separate layer
- Spec 035's testing strategy mentions "Token usage patterns (no hardcoded values)"

### Contrast ⚠️
- Spec 035 assumed component tokens would "just work" (design shows intent, not mechanism)
- Spec 037 addresses the actual mechanism (how do component tokens get generated?)
- Spec 035's design.md shows hard-coded values despite comments saying "references"

### Detailed Analysis of Spec 035's Token Strategy

**From Spec 035's design.md - Component Token Interface**:
```typescript
export const ButtonIconTokens = {
  inset: {
    /** Large size padding - references space.inset.150 */
    large: 12,  // ← Comment says "references" but value is hard-coded
    /** Medium size padding - unique value, no semantic equivalent */
    medium: 10, // ← Acknowledged as unique, but still hard-coded
    /** Small size padding - references space.inset.100 */
    small: 8,   // ← Comment says "references" but value is hard-coded
  },
} as const;
```

**Key Insight**: The comments show **intent** to reference primitive tokens, but the implementation uses hard-coded values because no mechanism exists to make references work.

**Spec 035's Property 1** states:
> "For any Button-Icon with a valid size variant... the rendered component SHALL use the corresponding icon token and padding token"

This property cannot be satisfied with hard-coded values — it requires actual token references.

### Resolution
Spec 037 fills the gap that Spec 035 assumed would exist. The two specs are complementary:
- **Spec 035**: Defines what Button-Icon needs (component tokens with specific values)
- **Spec 037**: Provides the mechanism to make those tokens work in the pipeline

### Token Mapping (Spec 035 Intent → Spec 037 Implementation)

| Spec 035 Intent | Previous Value | Primitive Token | Current Status |
|-----------------|----------------|-----------------|----------------|
| "references space.inset.100" | `8` | `space100` (8) | ✅ Now references `spacingTokens.space100.baseValue` |
| "unique value" | `10` | `space125` (10) | ✅ Now references `spacingTokens.space125.baseValue` |
| "references space.inset.150" | `12` | `space150` (12) | ✅ Now references `spacingTokens.space150.baseValue` |

**Update (2026-01-05)**: The component token → primitive reference pattern has been implemented in `buttonIcon.tokens.ts`. The "unique value" for medium was actually `space125` (strategic flexibility token) — this knowledge gap has been resolved.

## Recommendation

**Proceed with Spec 037 implementation using hybrid approach.**

**Decision Made (2026-01-05)**: After collaborative discussion, we agreed on a hybrid approach that combines:
- Spec 035's lightweight authoring experience
- ComponentToken interface's explicit metadata (family connection, reasoning, primitive references)

**Hybrid Approach Summary**:
```typescript
export const ButtonIconTokens = defineComponentTokens({
  component: 'ButtonIcon',
  family: 'spacing',
  tokens: {
    'inset.large': {
      value: spacingTokens.space150,  // Full token reference
      reasoning: 'Padding for large variant, aligns with space150',
    },
    // ...
  },
});
```

**What we keep from ComponentToken interface**:
- Explicit family connection
- Required reasoning
- Full primitive token references
- Component association

**What we defer**:
- Runtime usage tracking
- Approval workflows
- Creation metadata

**Updated Task Breakdown**:
1. Create `Rosetta-System-Architecture.md` (Deliverable 1)
2. Create `defineComponentTokens()` helper with TypeScript types
3. Create lightweight `ComponentTokenRegistry`
4. Update `ValidationCoordinator` for component token validation
5. Connect to `TokenFileGenerator` for platform output
6. Update `buttonIcon.tokens.ts` to use new API
7. Generate platform-specific output
8. Update platform files to consume generated tokens
9. Verify TokenCompliance tests pass

## Open Questions for User

1. **Platform output format**: Should component tokens generate:
   - CSS custom properties (e.g., `--button-icon-inset-medium: var(--space-125)`)
   - Direct primitive references in platform files
   - Both?

2. **Validation strictness**: Should component tokens be required to reference primitives, or allowed to define unique values when no primitive exists?

3. **Registry scope**: Should ComponentTokenRegistry be per-component or global?

## Next Steps

1. ✅ Create this preliminary findings document
2. ⏳ Update design-outline to reference this document
3. ⏳ Review with user for direction on open questions
4. ⏳ Proceed to full audit if needed, or move to spec creation

---

*This document captures preliminary findings. A full audit may reveal additional gaps or complexity.*
