# Implementation Plan: Opacity Architecture Evolution

**Date**: 2026-03-06
**Spec**: 073 - Opacity Architecture Evolution
**Status**: Implementation Planning
**Dependencies**: None (foundational infrastructure)

---

## Task List

- [x] 1. Token Architecture Foundation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `TokenModifier` interface and `modeInvariant` field added to `SemanticToken`
  - All opacity primitives renamed from 000–1300 to 000–100 naming
  - `color.scrim.standard` defined and resolving correctly across all platforms
  - All validators updated and catching invalid configurations
  - All generators resolving modifier-based tokens to correct platform output
  - Full test suite passing with zero failures
  - Steering docs updated via ballot measures

  **Primary Artifacts:**
  - `src/types/SemanticToken.ts` (modified)
  - `src/tokens/semantic/color-scrim.ts` (new)
  - `findings/opacity-rename-blast-radius.md` (reference)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/073-opacity-architecture-evolution/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/073-opacity-architecture-evolution/task-1-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Token Architecture Foundation"` (runs release analysis automatically)
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Add TokenModifier interface and modeInvariant field to SemanticToken
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Ada (token architecture)
    - Add `TokenModifier` interface (`type: 'opacity'`, `reference: string`) to `src/types/SemanticToken.ts`
    - Add `modifiers?: TokenModifier[]` to `SemanticToken` interface
    - Add `modeInvariant?: boolean` to `SemanticToken` interface
    - Verify existing tokens compile without changes (backward compatibility)
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_

  - [x] 1.2 Rename opacity primitives
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada (token definitions)
    **Parallelism**: Task 1.3 (Lina) can execute simultaneously — no dependency between token source files and component comment strings
    - Apply rename mapping to `src/tokens/OpacityTokens.ts` (29 refs)
    - Apply rename mapping to `src/tokens/ShadowOpacityTokens.ts` (30 refs)
    - Apply rename mapping to `src/tokens/GlowOpacityTokens.ts` (12 refs)
    - Update `src/tokens/index.ts` (16 refs)
    - Update semantic token files: `semantic/OpacityTokens.ts` (4), `semantic/ColorTokens.ts` (3), `semantic/BlendTokens.ts` (1), `semantic/ShadowTokens.ts` (14)
    - Update composition layer: `OpacityCompositionParser.ts` (7), `OpacityComposition.ts` (3) — review parser regex/string patterns, not just token name strings
    - Update generators: `DTCGFormatGenerator.ts` (4), `WebFormatGenerator.ts` (3), `iOSFormatGenerator.ts` (3), `AndroidFormatGenerator.ts` (3)
    - Reference: `findings/opacity-rename-blast-radius.md` for complete file list
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 1.7_

  - [x] 1.3 Update component platform file references
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (component files)
    **Parallelism**: Can execute simultaneously with Task 1.2 — comment strings are independent of token source files
    - Update comment references in Container-Base iOS/Android (20 refs)
    - Update comment references in Avatar-Base iOS/Android (2 refs)
    - Confirm no functional code changes needed (per Lina's audit — comment-only)
    - _Requirements: 1.6_

  - [x] 1.4 Update validators for modifier and mode-invariance support
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada (token validation)
    - Extend `PrimitiveReferenceValidator` to validate `modifiers[].reference` — verify primitive exists and belongs to correct family
    - Extend `SemanticTokenValidator` to flag `modeInvariant: true` on tokens referencing mode-aware primitives
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 3.4_

  - [x] 1.5 Update generators for modifier resolution
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada (token pipeline)
    - Extend DTCG generator to resolve modifiers in array order after base value resolution
    - Extend web generator to output `rgba()` for modifier-based color tokens
    - Extend iOS generator to output `UIColor(red:green:blue:alpha:)` for modifier-based color tokens
    - Extend Android generator to output `Color(red, green, blue, alpha)` for modifier-based color tokens
    - Verify generators produce identical output for tokens without modifiers (backward compatibility)
    - Leverage existing `mergeShadowColor` pattern in `DTCGFormatGenerator.ts` as reference
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 1.6 Define color.scrim.standard token
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada (token definitions)
    - Create `src/tokens/semantic/color-scrim.ts` with canonical definition per Ada's specification
    - Register in semantic token index
    - Verify end-to-end resolution: definition → generator → platform output for all three platforms
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 1.7 Rename opacity references in test files
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada (token tests — mechanical rename)
    - Rename opacity primitive references in all 9 test files (221 refs total)
    - Run full test suite: `npm test` — all existing tests must pass with new names before new test code is added
    - A failure here indicates a missed rename, not a new feature bug
    - _Requirements: 1.4_

  - [x] 1.8 Write new feature tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada (token tests — new features)
    - Add tests for `TokenModifier` type validation
    - Add tests for `modeInvariant` field validation
    - Add tests for generator modifier resolution (per-platform RGBA output)
    - Add tests for `PrimitiveReferenceValidator` modifier reference validation
    - Add tests for `SemanticTokenValidator` mode-invariance suspicious usage detection
    - Add integration test for `color.scrim.standard` end-to-end resolution
    - Run full test suite: `npm test`
    - _Requirements: 2.3, 3.4, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 1.9 Regenerate output and update docs
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada (generated output + public docs)
    - Regenerate `final-verification/DesignTokens.ios.swift` (22 refs — regenerate, don't hand-edit)
    - Update `docs/token-system-overview.md` (2 refs)
    - Update `docs/releases/RELEASE-NOTES-6.0.0.md` if appropriate (2 refs — historical, may leave as-is with migration note)
    - _Requirements: 7.5_

  - [x] 1.10 Steering doc ballot measures
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada (drafts) → Peter (approval) → Ada (applies)
    - Draft ballot measure 1: `Token-Family-Opacity.md` full rewrite (74 refs)
    - Draft ballot measure 2: `Token-Family-Glow.md` rename references (27 refs)
    - Draft ballot measure 3: `rosetta-system-principles.md` (5) + `Token-Family-Color.md` (1, plus new Scrim Concept section) + `DTCG-Integration-Guide.md` (1) — batched minor updates
    - Draft modifier extensibility governance gate for inclusion in appropriate steering doc
    - Present all ballot measures to Peter for approval
    - Apply approved changes
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6, 8.1, 8.2, 8.3_

---

## Domain Review Recommendations

After formalization, recommend domain review:
- **Ada**: Token definitions, modifier architecture implementation, generator resolution logic, mathematical correctness of rename mapping
- **Lina**: Component platform file updates (comment-only), verify no functional impact, confirm scrim token consumption readiness for Spec 072
