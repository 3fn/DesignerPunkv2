# Implementation Plan: Unified Blur Token Family

**Date**: 2026-03-30
**Spec**: 089 - Unified Blur Token Family
**Status**: Implementation
**Agent**: Ada
**Dependencies**: None (Spec 088 depends on this spec)
**Constraint**: Zero visual change

---

## Task List

- [ ] 1. Unified Blur Token Family

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - 9 blur primitives defined with correct mathematical relationships (base 16)
  - `ShadowBlurTokens.ts` and `GlowBlurTokens.ts` deleted
  - Shadow composites reference new blur primitive names, resolve to identical values
  - Generation pipeline produces blur tokens in all platform files and DTCG output
  - Old token names (`shadowBlur*`, `glowBlur*`) do not appear in any source file
  - All tests pass

  **Completion Documentation:**
  - Detailed: `.kiro/specs/089-unified-blur-token-family/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/089-unified-blur-token-family/task-1-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Unified Blur Token Family"`

  - [x] 1.1 Create BlurTokens.ts and TokenCategory.BLUR
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Define 9 blur primitives with full `PrimitiveToken` shape (name, category, baseValue, familyBaseValue, description, mathematicalRelationship, baselineGridAlignment, platforms)
    - Add `TokenCategory.BLUR` to `src/types/PrimitiveToken.ts`
    - Update `src/tokens/index.ts` re-exports
    - Verify: TypeScript compiles, new tokens accessible
    - _Requirements: 1.1, 1.2, 1.4_

  - [x] 1.2 Migrate shadow composite references
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update `src/tokens/semantic/ShadowTokens.ts` — 6 blur primitive references renamed
    - Delete `src/tokens/ShadowBlurTokens.ts`
    - Verify: shadow-related tests pass, resolved blur values unchanged
    - _Requirements: 2.1, 2.2_

  - [ ] 1.3 Migrate glow token definitions
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Delete `src/tokens/GlowBlurTokens.ts`
    - Verify: glow-related tests pass (zero consumer updates expected)
    - _Requirements: 3.1, 3.2_

  - [ ] 1.4 Update generation pipeline and regenerate
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Register `TokenCategory.BLUR` in generation pipeline (generic primitive pass, no dedicated section)
    - Regenerate `dist/` platform token files (web CSS, iOS Swift, Android Kotlin)
    - Update DTCG generator to include blur tokens
    - Update Figma export to include blur tokens
    - Verify: all 9 blur primitives present in generated output, existing shadow/glow values unchanged
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 1.5 Migrate and add tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Migrate tests referencing old `shadowBlur*` and `glowBlur*` token names
    - Add formula validation tests (value = base × multiplier)
    - Add mathematical relationship tests (scale progression)
    - Add cross-platform consistency tests (values identical across platforms)
    - Verify: `npm test` — full suite passes
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 1.6 Final verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Grep all source files for old token names (`shadowBlur*`, `glowBlur*`) — zero matches expected (Correctness Property #6)
    - Verify shadow composite end-to-end: blur primitive → shadow composite → component token → resolved value unchanged
    - Verify `npm test` — full suite passes
    - _Requirements: 5.3_

  - [ ] 1.7 Update documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Create `.kiro/steering/Token-Family-Blur.md` — unified family doc with shadow/glow/surface context sections; note iOS dual consumption patterns (material enums for surface, numeric for content)
    - Update `.kiro/steering/Token-Family-Shadow.md` — replace blur primitive section with cross-reference
    - Update `.kiro/steering/Token-Family-Glow.md` — replace blur primitive section with cross-reference
    - Verify: all three docs queryable via Documentation MCP `get_section()`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
