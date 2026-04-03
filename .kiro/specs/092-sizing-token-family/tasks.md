# Implementation Plan: Sizing Token Family

**Date**: 2026-04-03
**Spec**: 092 - Sizing Token Family
**Status**: Implementation
**Agent**: Ada (primitives, pipeline), Lina (component token files)
**Dependencies**: None (Spec 090 benefits from this spec)
**Constraint**: Zero visual change

---

## Task List

- [x] 1. Sizing Primitives and Pipeline

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - 13 sizing primitives defined with correct mathematical relationships (base 8)
  - Generation pipeline produces sizing tokens in all platform files, DTCG, and Figma
  - All existing tests pass
  - No spacing primitive referenced for dimensional purposes in migrated components

  **Completion Documentation:**
  - Detailed: `.kiro/specs/092-sizing-token-family/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/092-sizing-token-family/task-1-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Sizing Primitives and Pipeline"`

  - [x] 1.1 Create SizingTokens.ts and TokenCategory.SIZING
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Define 13 sizing primitives with full `PrimitiveToken` shape (base 8)
    - Add `TokenCategory.SIZING` to `src/types/PrimitiveToken.ts`
    - Update `src/tokens/index.ts` re-exports
    - Verify: TypeScript compiles, new tokens accessible
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Update generation pipeline and regenerate
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Verify `TokenCategory.SIZING` flows through generic primitive pass (no dedicated section needed)
    - Regenerate `dist/` platform token files (web CSS, iOS Swift, Android Kotlin)
    - Update DTCG generator to include sizing tokens
    - Update Figma export to include sizing tokens
    - Verify: all 13 sizing primitives present in generated output
    - _Requirements: 1.4, 3.1, 3.2, 3.3_

  - [x] 1.3 Add sizing primitive tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Add formula validation tests (value = base × multiplier)
    - Add mathematical relationship tests (scale progression)
    - Add cross-platform consistency tests
    - Verify: `npm test` passes
    - _Requirements: 4.1, 4.2_

- [ ] 2. Component Token Migration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - All 6 component families + TabBar migrated to sizing primitives
  - 3 new component token files created (Avatar, Checkbox, Radio)
  - Zero visual change — all dimensions identical
  - No spacing primitive used for dimensional values in migrated components
  - All tests pass

  **Completion Documentation:**
  - Detailed: `.kiro/specs/092-sizing-token-family/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/092-sizing-token-family/task-2-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Component Token Migration"`

  - [x] 2.1 Migrate Button-Icon tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update `buttonIcon.tokens.ts`: `space400` → `size400`, `space500` → `size500`, `space600` → `size600`
    - Verify: Button-Icon tests pass, dimensions unchanged
    - _Requirements: 2.1, 2.7_

  - [x] 2.2 Migrate Progress-Node tokens
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update `progress.ts`: base sizes `space150/200/250` → `size150/200/250`
    - Update current sizes to reference primitives directly: `size200` (sm), `size250` (md), `size300` (lg) — remove `SPACING_BASE_VALUE × multiplier` computation
    - Rename `SPACING_BASE_VALUE` → `SIZING_BASE_VALUE`
    - Add code comment: gap tokens (`node.gap.*`) remain as spacing refs — gaps are spacing, not sizing
    - Verify: Progress-Node tests pass, dimensions unchanged
    - _Requirements: 2.2, 2.7_

  - [x] 2.3 Migrate Nav-TabBar-Base dot size
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update dot size reference: `space050` → `size050`
    - Verify: TabBar tests pass, dot dimensions unchanged
    - _Requirements: 2.3, 2.7_

  - [x] 2.4 Create Avatar-Base component token file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Task 1.1 (sizing primitives must exist)
    - Create `avatar-sizing.tokens.ts` with sizing primitive references for all 6 sizes
    - Update Avatar-Base platform implementations to consume token file instead of hard-coded values
    - Verify: Avatar tests pass, all 6 size variants render at same dimensions
    - _Requirements: 2.4, 2.7, 2.8_

  - [x] 2.5 Create Input-Checkbox-Base component token file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Task 1.1 (sizing primitives must exist)
    - Create `checkbox-sizing.tokens.ts` with sizing primitive references for box dimensions only (sm/md/lg)
    - Icon sizes (checkmark) remain in icon family — NOT sizing tokens
    - Update Checkbox platform implementations to consume token file instead of hard-coded values
    - Verify: Checkbox tests pass, all 3 size variants render at same dimensions
    - _Requirements: 2.5, 2.7, 2.8_

  - [x] 2.6 Create Input-Radio-Base component token file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Task 1.1 (sizing primitives must exist)
    - Create `radio-sizing.tokens.ts` with sizing primitive references for box dimensions only (sm/md/lg)
    - Update Radio platform implementations to consume token file instead of hard-coded values
    - Verify: Radio tests pass, all 3 size variants render at same dimensions
    - _Requirements: 2.6, 2.7, 2.8_

  - [ ] 2.7 Final verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    **Depends on**: Tasks 2.1–2.6
    - Grep all migrated component files for old spacing refs used as dimensional values — zero matches expected (Correctness Property #4)
    - Verify `npm test` — full suite passes
    - Regenerate `dist/` and verify all platform output correct
    - _Requirements: 2.7, 3.4, 4.3_

- [ ] 3. Documentation

  **Type**: Parent
  **Validation**: Tier 2 - Standard

  **Success Criteria:**
  - Token-Family-Sizing.md created and queryable
  - Token-Family-Spacing.md cross-reference added
  - Token Quick Reference updated
  - Documentation MCP healthy

  **Completion Documentation:**
  - Detailed: `.kiro/specs/092-sizing-token-family/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/092-sizing-token-family/task-3-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Sizing Documentation"`

  - [ ] 3.1 Create Token-Family-Sizing.md
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Create `.kiro/steering/Token-Family-Sizing.md` covering: primitive scale with formulas, semantic distinction from spacing, component consumers, relationship to spacing (same base/grid, different purpose), why icon sizes and tap area tokens are excluded
    - Verify: queryable via Documentation MCP `get_section()`
    - _Requirements: 5.1, 5.2_

  - [ ] 3.2 Update existing documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update `Token-Family-Spacing.md` with cross-reference: dimensional values should use sizing tokens
    - Update `Token-Quick-Reference.md` to include sizing family in token documentation map
    - Verify: both docs queryable, Documentation MCP healthy
    - _Requirements: 5.3, 5.4_
