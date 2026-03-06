# Task 1 Parent Completion: Token Architecture Foundation

**Date**: 2026-03-06
**Task**: 1. Token Architecture Foundation
**Type**: Parent
**Status**: Complete
**Spec**: 073 — Opacity Architecture Evolution

---

## Success Criteria Verification

### Criterion 1: TokenModifier interface and modeInvariant field added to SemanticToken

**Evidence**: `TokenModifier` interface (`type: 'opacity'`, `reference: string`) and `modifiers?: TokenModifier[]` + `modeInvariant?: boolean` fields added to `src/types/SemanticToken.ts`. Exported from `src/types/index.ts` barrel.

**Verification**:
- TypeScript compiles clean with new fields
- Existing tokens compile without changes (backward compatible)
- 3 type validation tests confirm correct behavior (Task 1.8)

### Criterion 2: All opacity primitives renamed from 000–1300 to 000–100 naming

**Evidence**: 14 tokens renamed in `src/tokens/OpacityTokens.ts`. All references updated across source (3 functional files), test files (9 files), generated output (1 file), and docs (2 files).

**Verification**:
- Zero old opacity names remain in source or docs (historical excluded per AC 7)
- `grep -rn "opacity[12][0-9][0-9][0-9]\|opacity[3-9]00" src/ docs/ final-verification/` returns empty
- Shadow and glow opacity tokens confirmed NOT needing rename (different naming conventions)

### Criterion 3: color.scrim.standard defined and resolving correctly across all platforms

**Evidence**: `src/tokens/semantic/color-scrim.ts` created with canonical definition. Registered in semantic index. Resolves to:
- Web: `rgba(0, 0, 0, 0.80)`
- iOS: `UIColor(red: 0.00, green: 0.00, blue: 0.00, alpha: 0.80)`
- Android: `Color.argb(204, 0, 0, 0)`

**Verification**:
- 6 integration tests verify discovery, fields, and per-platform output (Task 1.8)
- Validation passes with real primitives registered

### Criterion 4: All validators updated and catching invalid configurations

**Evidence**:
- `PrimitiveReferenceValidator.validateModifiers()` validates modifier references exist and belong to correct token family
- `SemanticTokenValidator.validateModeInvariance()` flags `modeInvariant: true` tokens referencing mode-aware primitives

**Verification**:
- 4 validator tests: valid ref passes, no-modifier passes, non-existent ref errors, wrong-family errors
- 3 mode-invariance tests: mode-aware warns, mode-invariant no-warn, unset no-warn

### Criterion 5: All generators resolving modifier-based tokens to correct platform output

**Evidence**: Modifier check added to `formatSingleReferenceToken` in Web, iOS, Android, and DTCG generators. Routes to `formatOpacityCompositionToken` when modifiers present.

**Verification**:
- 4 generator tests: Web rgba, iOS UIColor, Android Color.argb, backward-compat no-modifier path
- 3 scrim integration tests confirm end-to-end resolution per platform

### Criterion 6: Full test suite passing with zero failures

**Evidence**: 291 test suites, 7457 tests, ALL PASSING.

**Verification**: `npm test` — 0 failures, 0 skipped.

### Criterion 7: Steering docs updated via ballot measures

**Evidence**: 4 ballot measures presented and approved:
1. Token-Family-Opacity.md — full rewrite (74 refs)
2. Token-Family-Glow.md — no changes needed (confirmed)
3. Batched: rosetta-system-principles.md (1), Token-Family-Color.md (1 + scrim section), DTCG guide (0)
4. Token-Governance.md — modifier extensibility governance gate

---

## Overall Integration Story

Spec 073 establishes foundational infrastructure for expressing composed tokens in the DesignerPunk system. The immediate motivator was the pagination container's dark translucent background (`rgba(0, 0, 0, 0.80)`) which couldn't be expressed with the existing `SemanticToken` interface. This spec solves that by introducing:

1. **Modifier architecture** — `SemanticToken.modifiers` enables "color at opacity" composition while maintaining Rosetta traceability through the primitive→semantic reference chain
2. **Mode-invariance annotation** — `modeInvariant: true` programmatically marks tokens that don't change between light/dark modes, with validator enforcement
3. **Percentage-based opacity naming** — Token names now directly communicate their value (`opacity048` = 48%), eliminating the lookup table needed with the old ordinal naming
4. **Scrim semantic token** — `color.scrim.standard` is the first token using the modifier pattern, providing a reusable dark translucent overlay

Spec 072 (Pagination Container Styling) is now unblocked and can consume `color.scrim.standard`.

### Subtask Contributions

**Task 1.1**: Added `TokenModifier` interface and `modeInvariant` field — the type-level foundation everything else builds on.

**Task 1.2**: Renamed 14 opacity primitives — the naming change that makes the system intuitive. Blast radius was smaller than estimated (3 functional files vs 14 predicted) because shadow/glow use different naming.

**Task 1.3** (Lina): Updated component platform file comment references — confirmed no functional code changes needed.

**Task 1.4**: Updated validators — enforcement layer ensuring modifier references are valid and mode-invariance annotations are consistent.

**Task 1.5**: Updated generators — resolution layer translating modifier-based tokens into platform-native output (rgba, UIColor, Color.argb).

**Task 1.6**: Defined `color.scrim.standard` — the first consumer of the modifier architecture, proving the pattern works end-to-end.

**Task 1.7**: Renamed opacity references in test files — mechanical rename with a tricky `opacity100`/`opacity008` collision that required manual disambiguation by value context.

**Task 1.8**: Wrote 22 new feature tests — coverage for all new features across types, validators, generators, and integration.

**Task 1.9**: Regenerated output and updated docs — `final-verification/DesignTokens.ios.swift` and `docs/token-system-overview.md` updated. Release notes left untouched (historical).

**Task 1.10**: Applied 4 ballot measures — steering docs now reflect the new naming, scrim concept, and modifier governance.

---

## Key Decisions

1. **Shadow/glow opacity tokens NOT renamed** — They use different naming conventions (semantic names for shadow, ordinal for glow). Renaming would be a separate concern. Peter approved.
2. **`opacity100` collision handled by value context** — The sed rename created ambiguity between old `opacity100` (8%) and new `opacity100` (100%). Resolved by checking the associated value (0.08 vs 1.0) in each occurrence.
3. **Generation script broken, used sed instead** — `scripts/generate-platform-tokens.ts` has a missing module dependency. Used deterministic sed rename for the swift verification file instead of regeneration.
4. **Release notes left untouched** — Per AC 7, historical docs are not modified.

---

## Validation (Tier 3: Comprehensive)

### Syntax Validation
- ✅ TypeScript compiles clean (`npx tsc --noEmit`)
- ✅ No type errors in new or modified files

### Functional Validation
- ✅ 291 test suites passed, 291 total
- ✅ 7457 tests passed, 7457 total
- ✅ 22 new tests added (Task 1.8)
- ✅ Zero failures, zero skipped

### Integration Validation
- ✅ `color.scrim.standard` discoverable via `getSemanticToken`
- ✅ Resolves correctly on all 3 platforms
- ✅ Passes validation with real primitives
- ✅ Modifier architecture integrates with existing generator pipeline

### Requirements Compliance
- ✅ Requirement 1 (Opacity Rename): AC 1-4, 6-7 met. AC 5 deferred (shadow/glow confirmed not needing rename).
- ✅ Requirement 2 (Modifier Architecture): AC 1-5 met
- ✅ Requirement 3 (Mode-Invariance): AC 1-4 met
- ✅ Requirement 4 (Scrim Token): AC 1-6 met
- ✅ Requirement 5 (Validators): AC 1-4 met
- ✅ Requirement 6 (Generators): AC 1-5 met
- ✅ Requirement 7 (Documentation): AC 1-6 met
- ✅ Requirement 8 (Modifier Governance): AC 1-3 met

---

## Lessons Learned

1. **Sed rename ordering matters** — longest-first prevents partial matches, but doesn't prevent collision when an old name becomes a new name (`opacity1300` → `opacity100` collides with old `opacity100`). Future renames should use a two-pass strategy or temporary placeholder.
2. **Blast radius audits overcount** — The initial audit predicted 14 functional files needing changes; actual was 3. Different naming conventions in related token families (shadow, glow) meant most "hits" were false positives.
3. **Steering doc ballot measures are efficient** — Batching minor changes into a single ballot reduced approval overhead without sacrificing governance.
