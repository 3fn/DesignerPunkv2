# Requirements Document: DTCG & Figma wcagValue Support

**Date**: 2026-03-12
**Spec**: 077 - DTCG & Figma wcagValue Support
**Status**: Requirements Phase
**Dependencies**: Spec 076 (complete — `d79f4ed5`)

---

## Ada/Lina Review Feedback — Resolved

| # | Feedback | Resolution |
|---|----------|------------|
| A1 | Req 6 AC 2-3: mode key discovery impedance mismatch (`primitiveReferences` mixes structural + mode keys) | Softened: DTCG output schema is extensible (arbitrary keys); generator hardcodes `wcagValue` → `wcag` for now. Convention/config deferred to when second mode materializes. |
| A2 | Req 3 AC 3: Figma fallback rationale not stated | Added note: Figma constraint (all variables must have values for all modes in a collection) |
| A3 | Req 1 AC 5: alias syntax assumption | Verify during task planning that existing `$value` uses aliases. No req change. |
| A4 | Missing DTCG validation AC | Covered implicitly by Req 4 test restoration. Added note. |
| A5 | File rename grep side effects | Handle at rename time. No req change. |
| L1 | Figma fallback UX: designers may assume non-WCAG tokens were reviewed for WCAG | Documented as known trade-off in Req 3 AC 3 note (same as A2) |
| L2 | Mode infrastructure untested at real resolution (light/dark hold identical values today) | Added note to Req 3: first real exercise of mode-conditional resolution |
| L3 | No tasks.md | Expected next step after requirements approval |
| L4 | Guard rail test fixture uses old `wcagValue` extension shape, not new `modes` shape | Clarified Req 5 AC 5: "test inputs" = source token fixtures, not intermediate DTCG structures |
| L5 | Req 6.4 premature Figma extensibility (Figma modes must be pre-configured) | Removed Req 6.4. DTCG output schema is the extensibility layer (Req 6.1-6.3). Figma stays scoped to known modes — updated when new modes arrive. |

---

## Introduction

Spec 076 introduced `wcagValue` on semantic token `primitiveReferences`, enabling theme-conditional primitive resolution across web, iOS, and Android generators. However, two export pipelines — DTCG token export and Figma variable import — were given deliberate guard rails (throws with descriptive errors) rather than full support. This spec replaces those guard rails with wcagValue-aware generation, restores test coverage weakened during 076, and produces a current `dist/DesignTokens.dtcg.json`.

7 semantic tokens currently carry `wcagValue`. This number will grow as more tokens adopt theme-conditional behavior.

---

## Requirements

### Requirement 1: DTCG Export with Modes Extension

**User Story**: As a token system consumer, I want the DTCG export to include wcagValue data in a standards-compatible format, so that the `dist/DesignTokens.dtcg.json` file is complete and not stale.

#### Acceptance Criteria

1. WHEN a semantic color token has `wcagValue` in its `primitiveReferences` THEN `DTCGFormatGenerator` SHALL emit `$extensions.designerpunk.modes.wcag` containing the DTCG alias reference for the WCAG primitive
2. WHEN a semantic color token has no `wcagValue` THEN `DTCGFormatGenerator` SHALL emit the token without `$extensions.designerpunk.modes` (no empty modes object)
3. The `$value` field SHALL always contain the default (non-WCAG) primitive alias, regardless of whether `wcagValue` is present
4. The `$extensions.designerpunk.modes` object SHALL contain only non-default mode overrides (no `"default"` key)
5. The DTCG output SHALL use alias syntax (`{color.teal300}`) for mode values, not resolved RGBA
6. The `dist/DesignTokens.dtcg.json` file SHALL be regenerated with all semantic color tokens present (no omissions)

> **Note (A3)**: AC 5 assumes existing `$value` output already uses alias syntax. Verify during task planning. If the generator currently resolves to RGBA, AC 5 has broader implications.

> **Note (A4)**: DTCG validity of the regenerated file (parseable, correct `$type` inheritance, well-formed `$extensions`) is implicitly covered by Req 4's test restoration — existing DTCG tests validate structural correctness.

### Requirement 2: DTCG Guard Rail Removal

**User Story**: As a token pipeline maintainer, I want the temporary guard rails from Spec 076 removed, so that the DTCG generator handles wcagValue natively instead of throwing or skipping.

#### Acceptance Criteria

1. The `generateSemanticColorTokens()` method SHALL process tokens with `wcagValue` without throwing
2. The try/catch in `generate()` that swallows the semantic color error SHALL be removed
3. The `semanticColor` group SHALL be present in DTCG output (no longer skipped)
4. All early-return guards (`if (!semanticColors) return`) in test files SHALL be removed
5. WHEN `generateSemanticColorTokens()` encounters a token with `wcagValue` THEN it SHALL produce valid DTCG output with the modes extension (not throw)

### Requirement 3: Figma Variable Import with WCAG Mode

**User Story**: As a design system maintainer syncing tokens to Figma, I want the Figma transformer to map wcagValue to Figma's native variable modes, so that designers can switch between Standard and WCAG themes in the Figma UI.

#### Acceptance Criteria

1. WHEN the Figma transformer encounters `$extensions.designerpunk.modes.wcag` in DTCG input THEN it SHALL populate `valuesByMode.wcag` on the corresponding `FigmaVariable`
2. The Semantics variable collection SHALL include `'wcag'` in its `modes` array
3. WHEN a token has no WCAG mode override THEN `valuesByMode.wcag` SHALL fall back to the same value as `valuesByMode.light`
4. The Figma transformer SHALL NOT throw when encountering `$extensions.designerpunk.modes` in DTCG input (guard rail removed)
5. The Primitives variable collection SHALL NOT add a WCAG mode (primitives are theme-invariant)

> **Note (A2/L1)**: AC 3 fallback is a Figma platform constraint — all variables in a collection must have values for all modes. This means tokens with no WCAG-differentiated behavior (e.g., `color.background.surface`) will show a WCAG mode value identical to their default. Designers may interpret this as "reviewed for WCAG" when the reality is "no WCAG differentiation needed." This is a known UX trade-off, not an oversight.

> **Note (L2)**: The existing `FigmaTransformer` mode infrastructure (`modes: string[]`, `valuesByMode: Record<string, unknown>`) has never resolved *different* values per mode — light and dark currently hold identical values. This requirement is the first real exercise of mode-conditional resolution. Implementation complexity is "make mode resolution actually function," not "add a string to an array." Estimation should account for this.

### Requirement 4: Test Coverage Restoration

**User Story**: As a test governance maintainer, I want the test coverage weakened during Spec 076 fully restored, so that the DTCG pipeline has the same assertion strength it had before the wcagValue migration.

#### Acceptance Criteria

1. `DTCGFormatGenerator.test.ts` SHALL assert `semanticColor` is present in expected top-level token groups
2. `DTCGFormatGenerator.test.ts` SHALL assert semantic token count meets the original threshold plus new wcagValue tokens (≥180)
3. `DTCGConfigOptions.test.ts` SHALL assert semantic color alias resolution without early-return guards
4. `DTCGFormatGenerator.integration.test.ts` SHALL include `semanticColor` in expected group lists and category mappings
5. `DTCGFormatGenerator.property.test.ts` SHALL assert total token count meets the original threshold plus new tokens (≥350)
6. `DTCGFormatGenerator.property.test.ts` SHALL include `semanticColor` in expected semantic group list

### Requirement 5: Guard Rail Test Transformation

**User Story**: As a test governance maintainer, I want the guard rail tests transformed into positive verification tests, so that the test inputs are preserved while assertions reflect the new behavior.

#### Acceptance Criteria

1. `WcagValueExportGuardRails.test.ts` SHALL be renamed to reflect its new purpose (e.g., `WcagValueExportSupport.test.ts`)
2. Tests that previously asserted "wcagValue → throw" SHALL be transformed to assert "wcagValue → correct `$extensions.designerpunk.modes` output"
3. Tests that previously asserted "wcagValue tokens omitted from DTCG" SHALL be transformed to assert "wcagValue tokens present with modes extension"
4. The Figma guard rail test SHALL be transformed to assert "wcagValue → correct `valuesByMode.wcag` population"
5. Source token fixtures (mock semantic tokens with `wcagValue` on `primitiveReferences`) SHALL be preserved — only assertions change. Intermediate DTCG structure fixtures fed to the Figma transformer will necessarily change to the new `$extensions.designerpunk.modes` shape.

### Requirement 6: DTCG Schema Extensibility

**User Story**: As a token architecture maintainer, I want the DTCG output schema to support future non-WCAG modes without structural changes, so that adding high-contrast or reduced-motion modes requires only new mode keys in the output.

#### Acceptance Criteria

1. The `$extensions.designerpunk.modes` object SHALL accept arbitrary string keys (not hardcoded to `"wcag"` in the output schema)
2. The DTCG generator SHALL map `wcagValue` → `modes.wcag` in the current implementation. The convention for discovering future mode keys on `primitiveReferences` (which mixes structural keys like `value`/`fontSize` with mode keys like `wcagValue`) is deferred until a second mode materializes.
3. The Figma transformer is scoped to known modes (`wcag`) for this spec. Figma variable collections require modes to be pre-configured — adding future modes requires a transformer update, not just a new key. DTCG output extensibility (AC 1-2) is the architectural investment; Figma mode support is incremental.

### Requirement 7: Steering Documentation — Mode Architecture

**User Story**: As a token system maintainer, I want the Rosetta architecture and semantic token structure docs to describe the mode-conditional resolution mechanism, so that the `wcagValue` pattern and its export-layer expression (`$extensions.designerpunk.modes`) are documented in the steering layer, not just in spec artifacts.

#### Acceptance Criteria

1. `Token-Semantic-Structure.md` SHALL document `wcagValue` as a recognized key pattern on `primitiveReferences`, with explanation of mode key vs structural key distinction
2. `Rosetta-System-Architecture.md` SHALL include a section on theme-conditional resolution describing the source-layer (`primitiveReferences.wcagValue`) to export-layer (`$extensions.designerpunk.modes.wcag`) pipeline
3. `rosetta-system-principles.md` SHALL have its outdated `primitiveReferences: string[]` type signature corrected to `Record<string, string>`
4. All steering doc changes SHALL follow the ballot measure process

---

## Out of Scope

- Figma plugin development (data format only, not a sync tool)
- DTCG community standardization of theme-conditional tokens
- Non-color wcagValue token implementation (schema supports it; no tokens exist yet)
- `$modes` migration to DTCG native spec (deferred until #210 is ratified)
- `color.contrast.onDark` — remains unchanged, not part of this spec
- Mode key discovery convention on `primitiveReferences` (deferred until second mode)
- Figma mode extensibility beyond `wcag` (incremental when new modes arrive)

---

## Documentation Requirements

**Waiver (partial)**: This spec is internal pipeline infrastructure with no new developer-facing API. No README or usage documentation required. The DTCG schema is self-documenting via `$extensions` convention. Steering doc updates are covered by Req 7 — deferred to end of spec so documentation reflects working implementation, not design intent.
