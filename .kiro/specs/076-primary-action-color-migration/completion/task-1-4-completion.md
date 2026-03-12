# Task 1.4 Completion: DTCG/Figma Export Guard Rails

**Date**: 2026-03-12
**Spec**: 076 - Primary Action Color Migration
**Task**: 1.4 - DTCG/Figma export guard rails
**Type**: Implementation
**Status**: Complete

---

## What Changed

### `src/generators/DTCGFormatGenerator.ts`

Added guard rail in `generateSemanticColorTokens()`: if a semantic color token has `primitiveReferences.wcagValue`, throws a descriptive error identifying the token and recommending a follow-up spec for DTCG/Figma wcagValue representation.

### `src/generators/transformers/FigmaTransformer.ts`

Added guard rail in `extractVariablesFromGroup()`: if a DTCG token has `$extensions.designerpunk.wcagValue`, throws a descriptive error. This is defense-in-depth — the DTCG generator would normally throw first, but this catches manually-crafted DTCG files.

### `src/generators/__tests__/WcagValueExportGuardRails.test.ts`

4 tests:
1. DTCG: token with `wcagValue` throws with token name in error
2. DTCG: tokens without `wcagValue` export normally
3. Figma: DTCG input with `wcagValue` in extensions throws
4. Figma: DTCG input without `wcagValue` exports normally

## Validation

- TypeScript compilation: clean
- All 4 new tests pass
- 274 generator test suites pass
- 1 pre-existing failure (`mcp-component-integration.test.ts`) unrelated

## Requirements Covered

- 11.1: DTCG export throws descriptive error for wcagValue tokens ✅
- 11.2: Figma export throws descriptive error for wcagValue tokens ✅
- 11.3: Tokens without wcagValue are unaffected ✅
