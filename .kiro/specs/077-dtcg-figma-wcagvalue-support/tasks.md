# Implementation Plan: DTCG & Figma wcagValue Support

**Date**: 2026-03-12
**Spec**: 077 - DTCG & Figma wcagValue Support
**Status**: Implementation Planning
**Dependencies**: Spec 076 (complete — `d79f4ed5`)

---

## Dependency Graph

```
Task 1 (DTCG Export — Modes Extension)
    ↓
Task 2 (Figma Import — WCAG Mode)
    ↓
Task 3 (Test Restoration & Transformation)
    ↓
Task 4 (Steering Documentation)
```

Strictly sequential — Task 2 reads DTCG output from Task 1, Task 3 restores tests against the new behavior, Task 4 documents the completed architecture.

---

## Task List

- [ ] 1. DTCG Export — Modes Extension

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `generateSemanticColorTokens()` emits `$extensions.designerpunk.modes.wcag` for tokens with `wcagValue`
  - Guard rail (try/catch + throw) fully removed
  - `dist/DesignTokens.dtcg.json` regenerated with all semantic color tokens present
  - `DesignerPunkExtensions` interface includes `modes` field
  - All tests pass

  **Primary Artifacts:**
  - `src/generators/DTCGFormatGenerator.ts`
  - `src/generators/types/DTCGTypes.ts`
  - `dist/DesignTokens.dtcg.json`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/077-dtcg-figma-wcagvalue-support/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/077-dtcg-figma-wcagvalue-support/task-1-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 1 Complete: DTCG Export — Modes Extension"`

  - [x] 1.1 Extend DesignerPunkExtensions interface
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Ada
    - Add `modes?: Record<string, string>` to `DesignerPunkExtensions` in `src/generators/types/DTCGTypes.ts`
    - _Requirements: 1.1, 6.1_

  - [ ] 1.2 Replace DTCG guard rail with modes generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - In `generateSemanticColorTokens()` (~line 523): remove the `throw` guard rail for `wcagValue`
    - When `refs.wcagValue` is present, build `modes: { wcag: '{color.${refs.wcagValue}}' }` and attach to `extensions`
    - When `refs.wcagValue` is absent, do not add `modes` to extensions (no empty object)
    - When `resolveAliases` config is true, resolve `modes.wcag` to RGBA using the same resolution path as `$value`
    - Note: `resolveAliases` has never needed to walk into `$extensions` before — this is new behavior. Verify that the existing resolution path can be reused for mode values, or extend it if needed.
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.5_

  - [ ] 1.3 Remove generate() try/catch
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - In `generate()` (~line 143-152): remove the try/catch that swallows the wcagValue error
    - Replace with direct call: `output.semanticColor = this.generateSemanticColorTokens();`
    - _Requirements: 2.2, 2.3_

  - [ ] 1.4 Regenerate dist/DesignTokens.dtcg.json
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Ada
    - Run `npx ts-node src/generators/DTCGFormatGenerator.ts` (or the project's DTCG generation script) to produce updated `dist/DesignTokens.dtcg.json`
    - Verify semantic color tokens are present (not omitted)
    - Verify tokens with `wcagValue` have `$extensions.designerpunk.modes.wcag`
    - _Requirements: 1.6, 2.3_

- [ ] 2. Figma Import — WCAG Mode

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Semantics collection includes `'wcag'` in modes array
  - Tokens with WCAG mode override have different `valuesByMode.wcag` from `valuesByMode.light`
  - Tokens without WCAG override fall back to `valuesByMode.light`
  - Primitives collection unchanged (no WCAG mode)
  - Guard rail removed
  - All tests pass

  **Primary Artifacts:**
  - `src/generators/transformers/FigmaTransformer.ts`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/077-dtcg-figma-wcagvalue-support/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/077-dtcg-figma-wcagvalue-support/task-2-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Figma Import — WCAG Mode"`

  - [ ] 2.1 Add WCAG mode to Semantics collection
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Add `'wcag'` to the Semantics collection `modes` array
    - Primitives collection remains `['light', 'dark']` — no WCAG mode
    - _Requirements: 3.2, 3.5_

  - [ ] 2.2 Replace Figma guard rail with mode-conditional resolution
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - In `extractVariablesFromGroup()` (~line 318-325): remove the `throw` guard rail
    - Read `$extensions.designerpunk.modes.wcag` from the DTCG token
    - If present, resolve the alias value and set `valuesByMode.wcag` to the resolved value
    - If absent, set `valuesByMode.wcag` = same as `valuesByMode.light` (Figma constraint: all variables must have values for all modes)
    - Note: this is the first real exercise of mode-conditional resolution — light/dark currently hold identical values
    - _Requirements: 3.1, 3.3, 3.4_

- [ ] 3. Test Restoration & Transformation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All 10 weakened tests restored to full assertion strength
  - `semanticColor` present in all expected group lists
  - Token count thresholds restored (≥180 semantic, ≥350 total)
  - All early-return guards removed
  - Guard rail test file renamed and assertions flipped
  - New tests verify modes extension and Figma WCAG mode
  - All tests pass

  **Primary Artifacts:**
  - `src/generators/__tests__/DTCGFormatGenerator.test.ts`
  - `src/generators/__tests__/DTCGConfigOptions.test.ts`
  - `src/generators/__tests__/DTCGFormatGenerator.integration.test.ts`
  - `src/generators/__tests__/DTCGFormatGenerator.property.test.ts`
  - `src/generators/__tests__/WcagValueExportSupport.test.ts` (renamed from WcagValueExportGuardRails)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/077-dtcg-figma-wcagvalue-support/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/077-dtcg-figma-wcagvalue-support/task-3-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Test Restoration & Transformation"`

  - [ ] 3.1 Restore DTCGFormatGenerator.test.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Re-add `semanticColor` to expected top-level token groups
    - Restore semantic token count threshold to ≥180
    - _Requirements: 4.1, 4.2_

  - [ ] 3.2 Restore DTCGConfigOptions.test.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Remove early-return guards (`if (!semanticColors) return`)
    - Assert semantic color alias resolution works
    - _Requirements: 4.3_

  - [ ] 3.3 Restore DTCGFormatGenerator.integration.test.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Re-add `semanticColor` to expected group lists
    - Re-add `semanticColor` to semantic token category mapping
    - _Requirements: 4.4_

  - [ ] 3.4 Restore DTCGFormatGenerator.property.test.ts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Re-add `semanticColor` to expected semantic group list
    - Restore total token count threshold to ≥350
    - _Requirements: 4.5, 4.6_

  - [ ] 3.5 Transform guard rail tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Rename `WcagValueExportGuardRails.test.ts` → `WcagValueExportSupport.test.ts`
    - Transform DTCG tests: "wcagValue → throw" becomes "wcagValue → correct `$extensions.designerpunk.modes` output"
    - Transform DTCG tests: "wcagValue tokens omitted" becomes "wcagValue tokens present with modes extension"
    - Transform Figma test: "wcagValue → throw" becomes "wcagValue → correct `valuesByMode.wcag` population"
    - Preserve source token fixtures; update DTCG structure fixtures to new `modes` shape
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ] 3.6 Add new modes verification tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - DTCG: modes object absent when no wcagValue (Req 1 AC 2)
    - DTCG: modes uses alias syntax (Req 1 AC 5)
    - DTCG: $value unchanged by wcagValue presence (Req 1 AC 3)
    - Figma: wcag mode in Semantics collection (Req 3 AC 2)
    - Figma: wcag fallback for non-wcagValue tokens (Req 3 AC 3)
    - Figma: Primitives collection has no wcag mode (Req 3 AC 5)
    - _Requirements: 1.2, 1.3, 1.5, 3.2, 3.3, 3.5_

- [ ] 4. Steering Documentation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Token-Semantic-Structure.md documents `wcagValue` key pattern and mode key vs structural key distinction
  - Rosetta-System-Architecture.md describes theme-conditional resolution pipeline
  - rosetta-system-principles.md has corrected `primitiveReferences` type signature
  - All changes approved via ballot measure

  **Primary Artifacts:**
  - `.kiro/steering/Token-Semantic-Structure.md`
  - `.kiro/steering/Rosetta-System-Architecture.md`
  - `.kiro/steering/rosetta-system-principles.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/077-dtcg-figma-wcagvalue-support/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/077-dtcg-figma-wcagvalue-support/task-4-summary.md`

  **Post-Completion:**
  - Commit: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Steering Documentation"`

  - [ ] 4.1 Update Token-Semantic-Structure.md
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    **Agent**: Ada
    - Document `wcagValue` as a recognized key pattern on `primitiveReferences`
    - Explain mode key vs structural key distinction
    - Add example showing single-reference token with `wcagValue`
    - Ballot measure required
    - _Requirements: 7.1_

  - [ ] 4.2 Update Rosetta-System-Architecture.md
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    **Agent**: Ada
    - Add section on theme-conditional resolution
    - Describe source-layer (`primitiveReferences.wcagValue`) to export-layer (`$extensions.designerpunk.modes.wcag`) to consumer-layer (`valuesByMode.wcag`) pipeline
    - Ballot measure required
    - _Requirements: 7.2_

  - [ ] 4.3 Fix rosetta-system-principles.md type signature
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    **Agent**: Ada
    - Correct `primitiveReferences: string[]` to `primitiveReferences: Record<string, string>`
    - Ballot measure required
    - _Requirements: 7.3_
