# Implementation Plan: Rosetta Mode Architecture

**Date**: March 16, 2026
**Spec**: 080 - Rosetta Mode Architecture
**Status**: Implementation Planning
**Dependencies**: None (Spec 050 Nav-TabBar-Base depends on this)

---

## Implementation Plan

The implementation follows the two-phase structure from the design outline. Phase 1 activates mode-aware resolution (primitive dark values + semantic override resolver + generator updates). Phase 2 unifies mode and theme resolution by migrating `wcagValue` into the theme file architecture.

Tasks are ordered to minimize risk: pre-requisite fixes first, then infrastructure (types + resolver), then data (audit + populate), then output (generators), then governance tooling, then documentation. Each task builds on the previous — no task requires code that hasn't been written yet.

Phase 2 follows the same pattern: snapshot existing behavior, migrate infrastructure, migrate data, verify zero regression.

---

## Task List

- [x] 1. Pre-Requisite Fixes

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `ModeThemeResolver.validate()` accepts `rgba()` format strings (the only format in use)
  - `resolveColorValue()` explicitly checks `.value` key in priority chain
  - All existing tests continue to pass — zero behavioral regression
  - Pre-existing validation mismatch documented

  **Primary Artifacts:**
  - `src/resolvers/ModeThemeResolver.ts` (modified)
  - `src/registries/SemanticTokenRegistry.ts` (modified)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/080-rosetta-mode-architecture/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/080-rosetta-mode-architecture/task-1-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Pre-Requisite Fixes"`
  - Verify: All existing tests pass, no regressions

  - [x] 1.1 Fix `ModeThemeResolver.validate()` hex-only regex
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update regex at line ~130 to accept `rgba()` format (or remove format check — value is typed as `string`)
    - Verify `validate()` returns `true` for existing primitive color values
    - Run existing `ModeThemeResolver` tests — confirm no regressions
    - _Requirements: R1 (enables Level 1 activation)_
    - _Traces: Ada R4 F19_

  - [x] 1.2 Fix `resolveColorValue()` priority chain
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Add `.value` explicitly to the priority chain in `SemanticTokenRegistry.resolveColorValue()` (line ~133-135)
    - Priority order: `.default || .value || .color || Object.values()[0]`
    - Run existing semantic token resolution tests — confirm no regressions
    - _Requirements: R2 (enables override consumption), R3 AC3_
    - _Traces: Ada R4 F20, Lina F25_


- [x] 2. Semantic Override Infrastructure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `SemanticOverride` and `SemanticOverrideMap` types defined and importable
  - `SemanticOverrideResolver` class implements validate/resolve/resolveAll
  - Validation rejects orphaned override keys (R4 AC1)
  - Override replaces entire `primitiveReferences` — no partial merge (correctness property #4)
  - Modifier inheritance semantics correct: present `modifiers` key replaces, absent inherits (correctness property #5)
  - Light mode resolution passes tokens through unchanged (Decision #5)
  - Dark mode resolution swaps `primitiveReferences` for overridden tokens
  - Empty override map produces identical output to no-override path
  - All resolver unit tests pass (testing strategy Layer 1)

  **Primary Artifacts:**
  - `src/tokens/themes/types.ts` (new)
  - `src/resolvers/SemanticOverrideResolver.ts` (new)
  - `src/resolvers/__tests__/SemanticOverrideResolver.test.ts` (new)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/080-rosetta-mode-architecture/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/080-rosetta-mode-architecture/task-2-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Semantic Override Infrastructure"`
  - Verify: All tests pass including new resolver tests

  - [x] 2.1 Create theme override types
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Ada
    - Create `src/tokens/themes/types.ts`
    - Define `SemanticOverride` interface: `{ primitiveReferences: Record<string, string>; modifiers?: TokenModifier[] }`
    - Define `SemanticOverrideMap` type: `Record<string, SemanticOverride>`
    - Import `TokenModifier` from `../types/SemanticToken.js`
    - _Requirements: R2_

  - [x] 2.2 Implement `SemanticOverrideResolver`
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Ada
    - Investigate pipeline integration point first: determine whether `TokenFileGenerator` or `TokenEngine` orchestrates generation. Confirm resolver API (`resolveAll()` return shape) fits the integration point. (Ada F28, Lina F34)
    - Create `src/resolvers/SemanticOverrideResolver.ts`
    - Constructor takes `SemanticTokenRegistry` and `SemanticOverrideMap`
    - `validate()`: iterate override keys, assert each exists in semantic token registry. Return `ValidationResult` with descriptive errors for orphaned keys.
    - `resolve(token, mode)`: light → return token unchanged. Dark → if override exists, return token with swapped `primitiveReferences` (and `modifiers` per inheritance semantics). If no override, return token unchanged.
    - `resolveAll(tokens)`: produce `{ light: SemanticToken[], dark: SemanticToken[] }` by resolving each token for both modes.
    - Modifier inheritance: override with `modifiers` key (even `[]`) replaces base. Override without `modifiers` key inherits base.
    - _Requirements: R2 AC1-4, R3 AC1-5, R4 AC1_

  - [x] 2.3 Write resolver unit tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada + Thurgood (Ada writes, Thurgood audits coverage)
    - `validate()`: orphaned key rejected with descriptive error
    - `validate()`: component token name rejected (not in semantic registry — correctness property #7, Ada F22 + Lina F27)
    - `validate()`: valid override map passes
    - `resolve()`: light mode returns token unchanged
    - `resolve()`: dark mode with override swaps `primitiveReferences`
    - `resolve()`: dark mode without override returns token unchanged
    - `resolve()`: structural replacement — composite `{ color, opacity }` → simple `{ value }`
    - `resolve()`: modifier inheritance — override with `modifiers: []` clears base modifiers
    - `resolve()`: modifier inheritance — override without `modifiers` key inherits base modifiers
    - `resolve()`: empty override map returns token unchanged
    - `resolveAll()`: produces correct light and dark token sets
    - _Requirements: R2, R3, R4 AC1_


- [x] 3. Full Semantic Color Token Audit

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Every semantic color token (~56 tokens) classified as Level 1, Level 2, or mode-invariant
  - Design intent documented for each Level 2 token (same role/different value vs different role)
  - System-wide Level 1:Level 2 ratio reported
  - Complete dark theme file created with all tokens listed and Level 2 overrides populated
  - At least one composite-reference token included in proof case

  **Primary Artifacts:**
  - `.kiro/specs/080-rosetta-mode-architecture/audit/semantic-color-token-audit.md` (new)
  - `src/tokens/themes/dark/SemanticOverrides.ts` (new)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/080-rosetta-mode-architecture/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/080-rosetta-mode-architecture/task-3-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Full Semantic Color Token Audit"`
  - Verify: Override file passes `SemanticOverrideResolver.validate()` against live registry

  - [x] 3.1 Audit all semantic color tokens
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Ada
    - Read all semantic color token definitions in `src/tokens/semantic/ColorTokens.ts`
    - For each token, classify:
      - **Level 1**: primitive handles mode differentiation (same primitive name, different light/dark values)
      - **Level 2**: semantic override needed (different primitive name per mode — role remapping)
      - **Mode-invariant**: same value in both modes (intentionally identical, e.g., `modeInvariant: true`)
    - For each Level 2 token, document design intent: same role at different value, or different role entirely
    - Report system-wide Level 1:Level 2:mode-invariant ratio
    - Identify at least one composite-reference token for proof case (Thurgood R1 F9)
    - Cross-reference against Nav-TabBar-Base needs (Lina R1 F10 validated mappings)
    - _Requirements: R7 AC1-4_
    - _Traces: Lina R2 F15 (audit methodology)_

  - [x] 3.2 Create complete dark theme file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Create `src/tokens/themes/dark/SemanticOverrides.ts` as complete theme file
    - List every semantic color token (~56 tokens) — complete inventory
    - Populate entries for Level 2 tokens identified in audit (Nav-TabBar-Base tokens populated with Figma-extracted values; other Level 2 tokens populated if dark values are known)
    - Comment out Level 1 tokens (primitive handles mode) and tokens without dark mode design yet — these fall back to base
    - Export `darkSemanticOverrides: SemanticOverrideMap` containing only populated entries (commented-out entries not in exported map)
    - Include `modifiers` key only where modifier behavior changes between modes (e.g., composite→solid)
    - Validate exported map against `SemanticOverrideResolver.validate()` — all keys must exist in base registry
    - _Requirements: R2 AC1-2, R4 AC1-4, R7_


- [ ] 4. Activate Primitive Dark Values

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Color primitives that need distinct dark values have them populated
  - Primitives that are mode-invariant retain identical light/dark values
  - `ModeThemeResolver` resolves correct mode-appropriate values
  - Backward compatibility regression passes — pipeline with current data produces identical output (correctness property #8)

  **Primary Artifacts:**
  - `src/tokens/ColorTokens.ts` (modified — dark slot values populated)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/080-rosetta-mode-architecture/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/080-rosetta-mode-architecture/task-4-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Activate Primitive Dark Values"`
  - Verify: Backward compatibility regression test passes

  - [ ] 4.1 Snapshot pre-activation pipeline output
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Ada
    - Run full token pipeline with current (identical light/dark) primitive data
    - Capture output as regression baseline snapshot
    - This snapshot validates correctness property #8 after dark values are populated
    - _Requirements: R1 (enables regression verification)_
    - _Traces: Lina F28 (backward compatibility regression)_

  - [ ] 4.2 Populate distinct dark values in color primitives (Nav-TabBar-Base scope)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - **Scope**: Nav-TabBar-Base primitives only. Full dark palette design work is not complete — other components will populate their dark primitive values as part of their own specs. (Peter direction, 2026-03-17)
    - Using audit results (Task 3.1) and Figma analysis (`analysis/analysis-tab-bar/`), populate distinct `dark` slot values for primitives referenced by Nav-TabBar-Base tokens
    - Primitives referenced by Nav-TabBar-Base Level 1 tokens: populate dark values from Figma
    - Primitives referenced by Nav-TabBar-Base Level 2 override targets: populate dark values (the override swaps the primitive name, but the target primitive still needs its own dark value)
    - All other primitives: leave identical light/dark values (fallback to light in dark mode until their component specs populate them)
    - No interface changes — `ColorTokenValue` already has the right shape
    - _Requirements: R1 AC1-3_

  - [ ] 4.3 Verify backward compatibility
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada + Thurgood (Ada runs, Thurgood audits)
    - Run full pipeline with updated primitives but no semantic overrides active
    - Compare output against Task 4.1 snapshot
    - For tokens where light/dark are now distinct: verify light output matches snapshot (dark output is new)
    - For tokens where light/dark remain identical: verify output matches snapshot exactly
    - _Requirements: R5 AC1-3 (fallback behavior)_
    - _Traces: Testing strategy Layer 4_


- [ ] 5. Pipeline Integration + Generator Updates

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `SemanticOverrideResolver` integrated into token pipeline between Registry and Generation
  - Generators receive two fully resolved token sets (light, dark)
  - Web generator outputs CSS `light-dark()` values
  - iOS generator outputs dynamic `UIColor` with light/dark variants
  - Android generator outputs `lightColorScheme`/`darkColorScheme`
  - DTCG export includes mode contexts
  - Mode-invariant tokens produce single non-mode-aware value (optimization)
  - Generator integration tests pass (testing strategy Layer 3)

  **Primary Artifacts:**
  - `src/generators/TokenFileGenerator.ts` (modified)
  - `src/generators/DTCGFormatGenerator.ts` (modified)
  - `src/generators/__tests__/ModeAwareGeneration.test.ts` (new)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/080-rosetta-mode-architecture/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/080-rosetta-mode-architecture/task-5-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: Pipeline Integration + Generator Updates"`
  - Verify: Full pipeline produces correct mode-aware output for all platforms

  - [ ] 5.1 Integrate `SemanticOverrideResolver` into pipeline
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Ada
    - Determine integration point: `TokenFileGenerator` or `TokenEngine` (pin to specific class — Ada F23)
    - Load `darkSemanticOverrides` from `src/tokens/themes/dark/SemanticOverrides.ts`
    - Instantiate `SemanticOverrideResolver` with registry and overrides
    - Call `validate()` — fail build on orphaned keys
    - Call `resolveAll()` — produce light and dark token sets
    - Pass both sets to generators
    - _Requirements: R3 AC1-2, R4 AC1_

  - [ ] 5.2 Update web generator for mode-aware output
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update `TokenFileGenerator` web output to use CSS `light-dark()` function
    - Add `color-scheme: light dark` to `:root`
    - Format: `--color-surface-primary: light-dark(rgba(255,255,255,1), rgba(24,34,40,1));`
    - Mode-invariant tokens (identical light/dark): output single value (optimization, R6 AC4)
    - _Requirements: R6 AC1, R6 AC4_

  - [ ] 5.3 Update iOS generator for mode-aware output
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update iOS output to use dynamic `UIColor` with `traitCollection` variants or Asset Catalog light/dark appearances
    - Mode-invariant tokens: single value
    - _Requirements: R6 AC2_

  - [ ] 5.4 Update Android generator for mode-aware output
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update Android output to use `lightColorScheme`/`darkColorScheme` color scheme objects
    - Mode-invariant tokens: single value
    - _Requirements: R6 AC3_

  - [ ] 5.5 Update DTCG export with mode contexts
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Extend `DTCGFormatGenerator` to emit mode contexts in `$extensions.modes`
    - Tokens with distinct light/dark: both values with mode context
    - Mode-invariant tokens: single mode-invariant value
    - Align with DTCG Resolver specification set/modifier pattern
    - _Requirements: R9 AC1-3_

  - [ ] 5.6 Write generator integration tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada + Thurgood (Ada writes, Thurgood audits coverage)
    - Web: verify `light-dark()` output format
    - iOS: verify dynamic color output format
    - Android: verify color scheme output format
    - Mode-invariant tokens: verify single value output
    - DTCG: verify mode context export
    - _Requirements: R6, R9_
    - _Traces: Testing strategy Layer 3_


- [ ] 6. Mode Parity Audit + Theme Template Tooling

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Mode parity audit runs in CI on token file changes
  - Audit reports tokens using fallback values (no distinct dark definition) — audit report, not build failure
  - Audit reports Level 1 vs Level 2 classification per token
  - Theme file generator produces complete dark theme file skeleton from base token set
  - CI flags new tokens needing dark mode evaluation
  - CI flags orphaned overrides from deleted tokens

  **Primary Artifacts:**
  - `src/validators/ModeParity.ts` (new) or integrated into existing validator
  - `src/tools/ThemeFileGenerator.ts` (new)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/080-rosetta-mode-architecture/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/080-rosetta-mode-architecture/task-6-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Mode Parity Audit + Theme Template Tooling"`
  - Verify: CI integration working on token file changes

  - [ ] 6.1 Implement mode parity audit
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - For each semantic color token: verify both light and dark resolve to valid primitive references
    - Report tokens using fallback values (no distinct dark definition)
    - Report Level 1 vs Level 2 classification
    - Distinguish two conditions: (a) token has commented-out entry in theme file (intentional fallback — audit report), (b) token has no entry in theme file at all (theme file out of sync — build warning)
    - Output: audit report for (a), build warning for (b). Structural errors (nonexistent references) still fail.
    - Integrate into CI — trigger on token file changes
    - _Requirements: R5 AC4-5, R7 AC3-4_
    - _Traces: Testing strategy Layer 2_

  - [ ] 6.2 Implement theme file generator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Generate the complete dark theme file skeleton (`SemanticOverrides.ts`) listing every semantic color token
    - Populated entries exported in the map; unpopulated entries commented out with base primitive reference
    - Standalone tooling step — not part of token resolution pipeline
    - CI regenerates and compares against existing theme file to detect:
      - New tokens added to base (appear as new commented-out entries — flagged for dark mode evaluation)
      - Tokens removed from base (orphaned populated entries — flagged for cleanup)
    - _Requirements: R8 AC1-4_


- [ ] 7. Proof Case Validation (Nav-TabBar-Base Tokens)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Nav-TabBar-Base mode-differentiated tokens resolve correctly through the full pipeline
  - At least one composite-reference token validated (structural replacement)
  - Web output produces correct `light-dark()` values for Nav-TabBar-Base tokens
  - iOS and Android output produces correct mode-aware values
  - Level 1 tokens (container background) resolve via primitive dark values
  - Level 2 tokens (active icon, inactive icon, indicator dot, top stroke) resolve via semantic overrides
  - Proof case documents the end-to-end resolution path for each token

  **Primary Artifacts:**
  - `.kiro/specs/080-rosetta-mode-architecture/proof-case/nav-tabbar-base-validation.md` (new)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/080-rosetta-mode-architecture/completion/task-7-parent-completion.md`
  - Summary: `docs/specs/080-rosetta-mode-architecture/task-7-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 7 Complete: Proof Case Validation"`
  - Verify: Nav-TabBar-Base tokens produce correct mode-aware output

  - [ ] 7.1 Validate Nav-TabBar-Base token resolution
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada + Lina (Ada validates resolution correctness, Lina validates pipeline output matches Figma-extracted values. Peter validates that Figma design intent is correct — separate step.)
    - Resolve each Nav-TabBar-Base mode-differentiated token through the full pipeline:
      - Container background (`white100`): Level 1 — verify primitive dark value resolves correctly
      - Inactive icon (`gray300` → `gray100`): Level 2 — verify semantic override swaps reference
      - Active icon (`cyan500` → `cyan100`): Level 2 — verify semantic override
      - Indicator dot (`cyan500` → `cyan100`): Level 2 — verify semantic override
      - Top stroke (`white200` → `gray500`): Level 2 — verify semantic override
    - Include at least one composite-reference token (e.g., `color.structure.border.subtle` if applicable)
    - Verify web `light-dark()` output for each token
    - Document end-to-end resolution path per token
    - _Requirements: R1, R2, R3, R6_
    - _Traces: Thurgood R1 F9 (composite proof case), Lina R1 F10 (validated mappings)_


- [ ] 8. Documentation Updates

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Rosetta System Architecture doc includes updated pipeline diagram with Mode Resolution step
  - Token Quick Reference includes mode-aware lookup guidance
  - Documentation MCP serves mode architecture content
  - Component MCP shows light/dark resolved values in `getComponent()` responses
  - Token-Governance.md updated with Decision #12 (dimension governance gate)

  **Primary Artifacts:**
  - Rosetta System Architecture doc (modified)
  - Token Quick Reference (modified)
  - Documentation MCP content (modified)
  - Component MCP schema (modified)
  - Token-Governance.md (modified — ballot measure required)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/080-rosetta-mode-architecture/completion/task-8-parent-completion.md`
  - Summary: `docs/specs/080-rosetta-mode-architecture/task-8-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 8 Complete: Documentation Updates"`
  - Verify: MCP queries return mode architecture content

  - [ ] 8.1 Update Rosetta System Architecture documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Add updated pipeline diagram showing Mode Resolution step between Registry and Generation
    - Document two-level resolver architecture (Level 1: primitive mode values, Level 2: semantic overrides)
    - Document fallback behavior and correctness properties
    - _Requirements: R10 AC1_

  - [ ] 8.2 Update Token Quick Reference
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Add mode-aware lookup guidance
    - Document how to determine if a token needs a dark override vs primitive handling
    - Include examples of Level 1 and Level 2 resolution
    - _Requirements: R10 AC2_

  - [ ] 8.3 Update documentation MCP
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Ensure `@designerpunk-docs` serves mode architecture content
    - Add sections queryable via `get_section()` for mode resolution, override format, fallback behavior
    - _Requirements: R10 AC3_

  - [ ] 8.4 Update component MCP
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    **Depends on**: Tasks 2 and 5 (needs resolver output format and working pipeline — cannot parallelize with 8.1-8.3)
    - Update `getComponent()` responses to show light/dark resolved values for mode-aware tokens
    - Update schema validation to recognize mode-differentiated tokens
    - _Requirements: R10 AC4_

  - [ ] 8.5 Propose governance updates (ballot measures)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Draft ballot measure for Token-Governance.md: add Decision #12 — "Adding new mode/theme dimensions requires a spec and Peter's approval"
    - Draft ballot measure for Token-Governance.md (or Ada's workflow docs): update token creation workflow to include "when creating a semantic color token, add entry to all existing theme files (populated or commented-out)" — preventive sync so theme files don't drift from base
    - Draft ballot measure for Component-Development-Guide.md (or component scaffolding workflow): add "dark mode token population" step — when a component is designed with dark mode needs, coordinate with Ada to populate the component's semantic token entries in the dark theme file. Without this, components could silently render light-mode fallback values in dark mode. (Lina R2 F36)
    - Present all to Peter with rationale, counter-argument, and impact assessment
    - Apply only after Peter's approval
    - _Requirements: R8 AC5, R10 (documentation completeness)_
    - _Traces: Ada R3 F18, Lina F23, Lina R2 F36_


---

## Phase 2: wcagValue Unification

Phase 2 migrates the inline `wcagValue` pattern into the theme file architecture, collapsing mode and theme into a single resolver mechanism. The full resolution matrix becomes four theme contexts: `light-base`, `light-wcag`, `dark-base`, `dark-wcag`.

---

- [ ] 9. Phase 2 Pre-Migration Snapshot

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Complete snapshot of all resolved token values across the full mode × theme matrix (light-base, light-wcag, dark-base, dark-wcag)
  - Snapshot includes both semantic token AND component token resolved values
  - Snapshot stored as regression baseline for post-migration verification
  - All 7 tokens currently using `wcagValue` identified and documented

  **Primary Artifacts:**
  - `.kiro/specs/080-rosetta-mode-architecture/regression/pre-migration-snapshot.json` (new)
  - `.kiro/specs/080-rosetta-mode-architecture/regression/wcag-token-inventory.md` (new)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/080-rosetta-mode-architecture/completion/task-9-parent-completion.md`
  - Summary: `docs/specs/080-rosetta-mode-architecture/task-9-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 9 Complete: Phase 2 Pre-Migration Snapshot"`
  - Verify: Snapshot covers all tokens across all 4 contexts

  - [ ] 9.1 Capture full resolution matrix snapshot
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Resolve every semantic color token across all 4 contexts: light-base, light-wcag, dark-base, dark-wcag
    - Resolve every component token that references a color semantic token across all 4 contexts
    - Store as structured JSON for automated comparison
    - _Requirements: R11 AC3-4_
    - _Traces: Thurgood R1 F5.4, Lina R1 F13_

  - [ ] 9.2 Inventory wcagValue tokens
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Ada
    - Identify all semantic tokens currently using `wcagValue` on `primitiveReferences` (currently 7 tokens)
    - Document each token's wcagValue mapping (e.g., cyan→teal action color swap)
    - Document the equivalent theme file override that will replace each `wcagValue`
    - _Requirements: R11 AC1-2_


- [ ] 10. Unified Theme Resolver

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Single resolver mechanism handles both mode (light/dark) and theme (base/WCAG) resolution
  - Four theme contexts expressible: `light-base`, `light-wcag`, `dark-base`, `dark-wcag`
  - `SemanticToken` interface no longer contains `wcagValue` on `primitiveReferences`
  - WCAG overrides expressed as theme files (same mechanism as dark overrides)
  - Resolver produces correct output for all 4 contexts
  - WCAG cyan→teal action color swap validated through unified mechanism

  **Primary Artifacts:**
  - `src/resolvers/SemanticOverrideResolver.ts` (modified — extended for theme dimension)
  - `src/tokens/themes/types.ts` (modified — extended for theme contexts)
  - `src/tokens/themes/wcag/SemanticOverrides.ts` (new)
  - `src/tokens/themes/dark-wcag/SemanticOverrides.ts` (new, if needed)
  - `src/types/SemanticToken.ts` (modified — `wcagValue` removed from `primitiveReferences`)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/080-rosetta-mode-architecture/completion/task-10-parent-completion.md`
  - Summary: `docs/specs/080-rosetta-mode-architecture/task-10-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 10 Complete: Unified Theme Resolver"`
  - Verify: All 4 contexts resolve correctly, WCAG validation case passes

  - [ ] 10.1 Extend override types for theme dimension
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Ada
    - **Design decision needed before implementation**: The theme context model (how `light-base`, `light-wcag`, `dark-base`, `dark-wcag` map to override files) should be resolved as a Phase 2 design addendum before this task begins. (Ada F29)
    - Extend `SemanticOverrideMap` or create new type to support theme-contextualized overrides
    - Design the theme context model: how do `light-base`, `light-wcag`, `dark-base`, `dark-wcag` map to override files?
    - Options: (a) separate override file per context, (b) single override file with context keys, (c) mode + theme override files composed
    - Document architectural decision with rationale
    - _Requirements: R11 AC1-2_

  - [ ] 10.2 Create WCAG theme override files
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Migrate all 7 `wcagValue` tokens to theme file overrides
    - WCAG cyan→teal action color swap as concrete validation case
    - Create `src/tokens/themes/wcag/SemanticOverrides.ts` (and `dark-wcag/` if the architecture requires it)
    - _Requirements: R11 AC5_

  - [ ] 10.3 Update `SemanticOverrideResolver` for unified resolution
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Ada
    - Extend resolver to handle both mode and theme dimensions
    - `resolveAll()` produces 4 token sets (one per context) instead of 2
    - Validate all override files against base registry
    - Maintain backward compatibility — Phase 1 dark overrides continue working
    - _Requirements: R11 AC1-2, R3_

  - [ ] 10.4 Remove `wcagValue` from `SemanticToken` interface
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Remove `wcagValue` from `primitiveReferences` in `SemanticToken` interface
    - Update all semantic token definitions that use `wcagValue` — replace with theme file references
    - Update `resolveColorValue()` to remove `wcagValue` handling
    - _Requirements: R11 AC1_

  - [ ] 10.5 Update generators for 4-context output
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update `TokenFileGenerator` to consume 4 token sets instead of 2
    - Update web output: extend `light-dark()` pattern for WCAG contexts (or separate WCAG stylesheet)
    - Update iOS output: extend dynamic color for WCAG contexts
    - Update Android output: extend color schemes for WCAG contexts
    - Update DTCG export for 4-context mode structure
    - _Requirements: R6, R9, R11 AC2_

  - [ ] 10.6 Update existing wcagValue tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada + Thurgood (Ada updates, Thurgood audits)
    - Update `WcagValueInfrastructure.test.ts` — tests now validate through theme file mechanism
    - Update `WcagValueExportSupport.test.ts` — DTCG export tests for 4-context structure
    - Verify WCAG cyan→teal swap resolves correctly through unified mechanism
    - _Requirements: R11 AC5_


- [ ] 11. Phase 2 Regression Verification

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All resolved token values across the full mode × theme matrix match pre-migration snapshot exactly (zero behavioral regression)
  - Semantic token resolved values match
  - Component token resolved values match (consumer-facing surface)
  - WCAG cyan→teal swap resolves correctly through theme file mechanism
  - All existing tests pass

  **Primary Artifacts:**
  - `.kiro/specs/080-rosetta-mode-architecture/regression/post-migration-comparison.md` (new)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/080-rosetta-mode-architecture/completion/task-11-parent-completion.md`
  - Summary: `docs/specs/080-rosetta-mode-architecture/task-11-summary.md`

  **Post-Completion:**
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 11 Complete: Phase 2 Regression Verification"`
  - Verify: Zero diff between pre- and post-migration resolved values

  - [ ] 11.1 Run post-migration snapshot and compare
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada + Thurgood (Ada runs, Thurgood audits)
    - Resolve every semantic color token across all 4 contexts (same method as Task 9.1)
    - Resolve every component token that references a color semantic token across all 4 contexts
    - Compare against Task 9.1 snapshot — assert zero diff
    - Document any discrepancies with root cause analysis
    - _Requirements: R11 AC3-4_
    - _Traces: Testing strategy Layer 5_

  - [ ] 11.2 Validate WCAG cyan→teal through unified mechanism
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Verify the WCAG action color swap (cyan→teal) resolves correctly through theme file override
    - Verify all 4 contexts produce correct values:
      - light-base: cyan action colors
      - light-wcag: teal action colors
      - dark-base: cyan action colors (dark variants)
      - dark-wcag: teal action colors (dark variants)
    - _Requirements: R11 AC5_

  - [ ] 11.3 Update Phase 2 documentation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Update Rosetta System Architecture doc with unified resolver
    - Update Token Quick Reference with 4-context resolution guidance
    - Update documentation MCP with unified theme architecture
    - Remove any references to `wcagValue` inline pattern from docs
    - _Requirements: R10, R11_

---

**Organization**: spec-guide
**Scope**: 080-rosetta-mode-architecture
