# Design Outline: Component Token Generation Pipeline

**Date**: 2026-01-05
**Status**: Complete
**Purpose**: Document the Rosetta System architecture, integrate component tokens into the generation pipeline, and ensure platform files consume generated tokens instead of hard-coded values

## Problem Statement

Component tokens (like `buttonIcon.tokens.ts`) exist but are not connected to the generation pipeline. Platform implementation files (iOS, Android, Web) contain hard-coded values instead of consuming generated tokens. Additionally, the Rosetta System's technical pipeline architecture is not documented in an AI-agent-optimized format for the MCP.

This creates:

1. **Token compliance violations** - Hard-coded values like `10.dp` trigger test failures
2. **Maintenance burden** - Changes require updating multiple files manually
3. **Inconsistency risk** - Platform files can drift from token definitions
4. **Unused infrastructure** - `ComponentTokenGenerator.ts` exists but isn't utilized
5. **Documentation gap** - No high-level architecture doc showing how tokens flow through the pipeline

## Deliverables

### Deliverable 1: Rosetta-System-Architecture.md (MCP Steering Doc)

Create a new steering document that:
- Outlines the high-level token generation pipeline flow (similar to the Rosetta System diagram, but in AI-agent-optimized format)
- Provides entry points to detailed documentation for each subsystem:
  - Validators (primitive, semantic, component)
  - Registries (token storage and retrieval)
  - Generators (platform-specific output)
  - Platform outputs (Web CSS, iOS Swift, Android Kotlin)
  - Build architecture
- Remains evergreen by avoiding specific token counts, names, or values
- Complements (not replaces) `rosetta-system-principles.md`

### Deliverable 2: Hybrid Component Token Authoring System

Create a `defineComponentTokens()` helper that bridges lightweight authoring with rich metadata:

**Design Goals**:
- Lightweight authoring experience (close to component implementation)
- Explicit token family connections (not implicit through imports)
- Required reasoning documentation (forces explanation of why token exists)
- Full primitive token references OR family-conformant values
- Family-aware validation (not one-size-fits-all)
- Deferred complexity (usage tracking, approval workflows added later if needed)

**Proposed API**:
```typescript
// buttonIcon.tokens.ts - Hybrid approach
import { spacingTokens, SPACING_BASE_VALUE } from '../../../tokens/SpacingTokens';
import { defineComponentTokens } from '../../../build/tokens/defineComponentTokens';

export const ButtonIconTokens = defineComponentTokens({
  component: 'ButtonIcon',
  family: 'spacing',
  
  tokens: {
    // Option A: Reference existing primitive (preferred)
    'inset.large': {
      reference: spacingTokens.space150,
      reasoning: 'Padding for large variant, aligns with space150 for visual consistency',
    },
    
    // Option B: Conform to family's value definition pattern (when no primitive exists)
    'inset.custom': {
      value: SPACING_BASE_VALUE * 1.75,  // Uses family's formula pattern
      reasoning: 'Custom spacing for unique layout requirement, no existing primitive at 14px',
    },
  },
});
```

**What this provides**:
- ✅ Lightweight authoring (still close to component)
- ✅ Explicit family connection (`family: 'spacing'`)
- ✅ Full token reference OR family-conformant value
- ✅ Required reasoning (in ALL cases)
- ✅ Component association (`component: 'ButtonIcon'`)
- ✅ Family-aware validation (rejects magic numbers)
- ✅ Pipeline can derive platform values from the referenced token or computed value

**What we defer**:
- ❌ Runtime usage tracking (add later if needed)
- ❌ Approval workflow (add later if needed)
- ❌ Creation metadata (can be inferred from git)

### Deliverable 3: Component Token Pipeline Integration

Connect the hybrid component token system to the generation pipeline:
- Create `defineComponentTokens()` helper function
- Create lightweight `ComponentTokenRegistry` that collects defined tokens
- Update `ValidationCoordinator` to validate component tokens (reasoning required, valid primitive reference)
- Connect to `TokenFileGenerator` for platform-specific output
- Generate platform-consumable output (CSS custom properties, Swift constants, Kotlin constants)
- Update Button-Icon platform files to consume generated tokens
- Button-Icon serves as QA validation case

## Audit Approach

### Starting Point
Use `docs/token-system-overview.md` as the primary source. It contains:
- System Architecture section (validators, registries, coordinators)
- Token Generation section (generator components, platform outputs)
- Extensive linking to subsystem documentation

### Audit Process
1. Review `token-system-overview.md` for current pipeline understanding
2. Follow links to audit specific subsystems (generators, validators, registries)
3. Compare documented architecture against actual code implementation
4. Identify gaps between documentation and implementation

### Gap Identification
During the audit, explicitly identify:
- **Understanding gaps**: Areas where documentation is unclear or incomplete
- **Implementation gaps**: Where code exists but isn't documented
- **Missing connections**: Where component tokens should plug in but don't

For each gap identified, propose how to fill it (additional documentation, code changes, or clarifying questions for user).

## Current State

### Preliminary Audit Findings

See **[preliminary-audit-findings.md](./preliminary-audit-findings.md)** for detailed investigation results.

**Key Findings Summary**:
1. **Pipeline flow**: Primitive → Validation → Registry → Generation → Platform (component tokens NOT in flow)
2. **Missing ComponentTokenRegistry**: Primitives and semantics have registries; components do not
3. **ComponentTokenGenerator exists but unused**: Scaffolded but never connected to pipeline
4. **ValidationCoordinator gap**: Only validates primitive/semantic tokens
5. **Component token pattern proven**: `buttonIcon.tokens.ts` now correctly references primitives

**Complexity Assessment**: Moderate (3-5 tasks) — infrastructure exists, integration is non-trivial but patterns are clear.

### Spec 035 Implementation Progress (Updated 2026-01-05)

**Status: ✅ COMPLETE**

Spec 035 (Button-Icon Component) is now complete. During implementation, the component token → primitive reference pattern was established:

**Current Implementation**:
```typescript
import { spacingTokens } from '../../../tokens/SpacingTokens';

export const ButtonIconTokens = {
  inset: {
    large: spacingTokens.space150.baseValue,   // ✅ References primitive
    medium: spacingTokens.space125.baseValue,  // ✅ References primitive
    small: spacingTokens.space100.baseValue,   // ✅ References primitive
  },
} as const;
```

**What Spec 035 Delivered**:
- ✅ Button-Icon component (web, iOS, Android platforms)
- ✅ Component token → primitive reference pattern (proven)
- ✅ 95+ tests passing (setup, unit, property-based, Stemma validators)
- ✅ `space125` strategic flexibility token correctly identified

**Known Limitation** (to be resolved by Spec 037):
- ⚠️ Platform files (iOS, Android) still have hard-coded values
- ⚠️ TokenCompliance test fails for platform files (expected — pipeline not connected)
- ⚠️ Current format is lightweight but lacks explicit family connection and reasoning

**Spec 037 will**:
- Upgrade to hybrid `defineComponentTokens()` format
- Connect component tokens to generation pipeline
- Generate platform-consumable output
- Resolve TokenCompliance failures

### What Exists
- `src/build/tokens/ComponentTokenGenerator.ts` - Generation infrastructure (exists, not connected)
- `src/build/tokens/ComponentToken.ts` - Type definitions
- `src/components/core/ButtonIcon/buttonIcon.tokens.ts` - Component token definitions (**now references primitives!**)
- `docs/token-system-overview.md` - Comprehensive token system documentation
- `docs/architecture/registry-validator-pattern.md` - Validation pattern documentation
- `.kiro/steering/rosetta-system-principles.md` - Rosetta System principles (MCP)
- `.kiro/steering/Core Goals.md` - Token Selection Priority + Component Token Construction Rule (**updated**)
- `src/registries/PrimitiveTokenRegistry.ts` - Pattern to follow for ComponentTokenRegistry
- `src/registries/SemanticTokenRegistry.ts` - Pattern to follow for ComponentTokenRegistry

### What's Missing
- `ComponentTokenRegistry` - No registry for component tokens
- High-level architecture flow document optimized for AI agents
- Component token integration into the generation pipeline
- Platform files consuming generated component tokens
- Validation for component tokens in ValidationCoordinator

### Specific Issue: buttonIcon.inset.medium
- Design requires 10px/dp/pt padding for medium size
- `space125` primitive token exists (SPACING_BASE_VALUE × 1.25 = 10)
- Current implementation uses hard-coded `10` instead of referencing `space125`
- TokenCompliance tests correctly flag this as a violation

### Spec 035 Alignment

Spec 035's `design.md` shows **intent** to use token references (comments say "references space.inset.150") but implementation uses hard-coded values. Spec 037 provides the mechanism to make that intent work:
- **Spec 035**: Defines what Button-Icon needs (component tokens with specific values)
- **Spec 037**: Provides the mechanism (pipeline integration, registry, validation)

## Execution Approach

This spec follows an **adaptive execution model**: audit first, collaborate on findings, then finalize implementation direction. Implementation tasks are placeholders until the audit reveals actual complexity.

### Execution Flow

```
Audit → Findings → Collaborate → Decision → Execute
```

1. **Audit** - Investigate via `token-system-overview.md` and linked code
2. **Findings** - Present what was learned, gaps identified, complexity assessment
3. **Collaborate** - Discuss findings, user provides direction
4. **Decision** - Determine if implementation fits in Spec 037 or requires Spec 038
5. **Execute** - Replace placeholder tasks with concrete tasks based on decision

### Decision Point: Spec 037 vs Spec 038

After the audit, we decide:
- **If component token integration is straightforward** → Implement in Spec 037 alongside architecture documentation
- **If component token integration reveals significant complexity** → Keep Spec 037 focused on architecture documentation; create Spec 038 design-outline for implementation work

This avoids premature commitment to implementation tasks before understanding the actual problem.

## Proposed Solution

### Phase 1: Architecture Documentation
1. ~~Audit current pipeline via `token-system-overview.md` and linked docs~~ ✅ Preliminary audit complete
2. ~~Audit actual code implementation against documentation~~ ✅ Key gaps identified
3. ~~Identify and document gaps~~ ✅ See [preliminary-audit-findings.md](./preliminary-audit-findings.md)
4. ~~Present findings for collaborative review~~ ✅ Hybrid approach agreed
5. Create `Rosetta-System-Architecture.md` steering doc

### Phase 2: Hybrid Component Token System Design
1. Design `defineComponentTokens()` helper API
2. Define validation requirements (reasoning required, valid primitive reference)
3. Design output format for each platform
4. Document the integration plan
5. **Decision**: Confirmed — implement hybrid approach in Spec 037

### Phase 3: Implementation
1. Create `defineComponentTokens()` helper function with TypeScript types
2. Create lightweight `ComponentTokenRegistry` for collecting defined tokens
3. Update `ValidationCoordinator` to handle component token validation
4. Connect to `TokenFileGenerator` for platform output generation
5. Update `buttonIcon.tokens.ts` to use new `defineComponentTokens()` API
6. Generate platform-specific output (CSS, Swift, Kotlin)
7. Update Button-Icon platform files to consume generated tokens
8. Verify TokenCompliance tests pass

### Phase 4: Validation & Documentation
1. QA using Button-Icon as proof of concept
2. Update `token-system-overview.md` to cover component tokens
3. Ensure `Rosetta-System-Architecture.md` reflects final state
4. Document pattern for future component token creation

## Token Reference Updates

| Token | Previous | Current | Status |
|-------|----------|---------|--------|
| `buttonIcon.inset.small` | `8` (hard-coded) | `spacingTokens.space100.baseValue` | ✅ Done |
| `buttonIcon.inset.medium` | `10` (hard-coded) | `spacingTokens.space125.baseValue` | ✅ Done |
| `buttonIcon.inset.large` | `12` (hard-coded) | `spacingTokens.space150.baseValue` | ✅ Done |

**Note**: Component token file updated. Platform files still need pipeline integration to consume generated values.

## Success Criteria

1. `Rosetta-System-Architecture.md` exists in MCP steering, providing high-level pipeline flow with entry points to detailed docs
2. `defineComponentTokens()` helper function exists with TypeScript types
3. Hybrid component token format documented and validated
4. `buttonIcon.tokens.ts` uses new `defineComponentTokens()` API with:
   - Explicit family connection (`family: 'spacing'`)
   - Full primitive token references (not just `.baseValue`)
   - Required reasoning for each token
5. Platform files consume generated tokens (no hard-coded spacing values)
6. TokenCompliance tests pass for Button-Icon component
7. Pattern documented for future component token creation
8. Existing `ComponentToken` interface and `ComponentTokenGenerator` either:
   - Deprecated in favor of new hybrid approach, OR
   - Simplified to align with hybrid approach

## Out of Scope

- Refactoring all existing component tokens (only Button-Icon for this spec)
- Changes to primitive or semantic token generation logic
- New token families or categories
- Creating `Stemma-System-Architecture.md` (may be needed later for symmetry, but not this spec)
- Runtime usage tracking (deferred — add later if demonstrated need)
- Approval workflows (deferred — add later if demonstrated need)

## Design Decisions

### Decision 1: Hybrid Component Token Approach

**Context**: The existing `ComponentToken` interface is comprehensive but verbose. Spec 035's implementation is lightweight but loses explicit metadata.

**Options Considered**:
1. **Use existing ComponentToken interface** — Rich metadata but verbose authoring
2. **Keep Spec 035's simple format** — Lightweight but loses family connection and reasoning
3. **Hybrid approach** — Lightweight authoring that produces rich metadata

**Decision**: Hybrid approach (Option 3)

**Rationale**:
- Maintains lightweight authoring experience (close to component implementation)
- Adds explicit family connection (not implicit through imports)
- Requires reasoning documentation (forces explanation of why token exists)
- References full primitive tokens (enables pipeline to extract relationships)
- Defers complexity (usage tracking, approval workflows) until demonstrated need

**Trade-offs**:
- Requires creating new `defineComponentTokens()` helper
- Existing `ComponentToken` infrastructure may need deprecation or simplification
- Migration path needed for any existing component tokens using old format

### Decision 2: Component Token Value Validation

**Context**: Component tokens that don't reference existing primitives need validation to ensure they conform to the token system's mathematical principles.

**Key Insight**: Not all token families use formulas. The validation must be family-aware.

**Decision**: Component tokens must either:
1. **Reference an existing primitive token** (always valid), OR
2. **Conform to how that primitive token family's values are defined**

**Examples**:
- **Spacing family** (formula-based): `SPACING_BASE_VALUE * 1.75` ✅, `14` ❌
- **Color family** (hex values): Must follow color system patterns
- **Radius family** (formula-based): `RADIUS_BASE_VALUE * multiplier` ✅

**Reasoning required in ALL cases** — even when referencing a primitive, explain why this token exists.

**Validation approach**:
1. Look up the family's value definition pattern
2. Verify the component token conforms to that pattern
3. Reject values that don't conform (e.g., magic numbers)
4. Require reasoning field to be non-empty

**Rationale**:
- Maintains mathematical consistency across the token system
- Prevents "magic numbers" that break the system's principles
- Family-aware validation is more accurate than one-size-fits-all
- Explicit reasoning forces documentation of design decisions

### Decision 3: Global Component Token Registry

**Context**: Should component tokens be managed per-component or globally?

**Decision**: Global registry with component namespacing

**Rationale** (optimized for AI agent developers):
- Single query point: "What component tokens exist?" → one call
- Cross-component awareness: Can detect naming conflicts, suggest reuse
- Simpler mental model: One registry pattern, same as primitives/semantics
- Pipeline integration: One collection mechanism, not N per component

**Namespacing**: Tokens are namespaced by component (e.g., `buttonIcon.inset.large`, `ctaButton.padding.medium`)

## Related Files

### Documentation
- `docs/token-system-overview.md` - Primary audit source
- `docs/architecture/registry-validator-pattern.md` - Validation patterns
- `docs/concepts/token-ecosystem-narrative.md` - Conceptual foundation
- `.kiro/steering/rosetta-system-principles.md` - Rosetta principles (MCP)
- `.kiro/specs/035-button-icon-component/design.md` - Spec 035 token consumption intent

### Pipeline Infrastructure (Patterns to Follow)
- `src/registries/PrimitiveTokenRegistry.ts` - Registry pattern model
- `src/registries/SemanticTokenRegistry.ts` - Registry pattern model
- `src/integration/ValidationCoordinator.ts` - Validation integration point

### Component Token Infrastructure (Exists, Not Connected)
- `src/build/tokens/ComponentTokenGenerator.ts` - Scaffolded generator
- `src/build/tokens/ComponentToken.ts` - Type definitions

### Generation Pipeline
- `src/generators/TokenFileGenerator.ts` - Main generator (needs component integration)
- `src/generators/BlendUtilityGenerator.ts`
- `src/providers/WebFormatGenerator.ts`
- `src/providers/iOSFormatGenerator.ts`
- `src/providers/AndroidFormatGenerator.ts`

### Button-Icon (QA Case)
- `src/components/core/ButtonIcon/buttonIcon.tokens.ts`
- `src/components/core/ButtonIcon/platforms/ios/ButtonIcon.ios.swift`
- `src/components/core/ButtonIcon/platforms/android/ButtonIcon.android.kt`
- `src/components/core/ButtonIcon/platforms/web/ButtonIcon.web.css`
- `src/components/core/ButtonIcon/platforms/web/ButtonIcon.web.ts`
- `src/tokens/SpacingTokens.ts` (contains `space125`)

## Open Questions

### Resolved ✅
- ~~What gaps will the audit reveal?~~ → See [preliminary-audit-findings.md](./preliminary-audit-findings.md)
- ~~Should we use existing ComponentToken interface or simplify?~~ → **Hybrid approach**: New `defineComponentTokens()` API that's lightweight to author but produces rich metadata
- ~~Implement in 037 or create 038?~~ → **Implement in 037** with hybrid approach
- ~~Platform output format?~~ → **CSS custom properties referencing primitives** (e.g., `--button-icon-inset-medium: var(--space-125)`) — maintains token chain
- ~~Validation strictness?~~ → **Reference primitive OR conform to family's value definition pattern**; reasoning required in ALL cases (see Decision 2 below)
- ~~Registry scope?~~ → **Global registry** — optimal for AI agent developers (single query point, cross-component awareness)
- ~~Existing infrastructure?~~ → **Deprecate** `ComponentToken.ts` and `ComponentTokenGenerator.ts` — hybrid approach supersedes them

### To Resolve During Phase 1 (Architecture Documentation)
1. **Generation trigger**: How should the generation step be triggered (build script, watch mode, manual)?
   - Will align with existing primitive/semantic generation patterns
   
2. **Return value**: Should `defineComponentTokens()` return the tokens for immediate use, or just register them?
   - Depends on how tokens are consumed in the pipeline
