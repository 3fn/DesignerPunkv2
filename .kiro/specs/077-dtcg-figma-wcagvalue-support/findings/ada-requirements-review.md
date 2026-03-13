# Ada's Requirements Review — Spec 077

**Date**: 2026-03-12
**Reviewer**: Ada
**Document**: `requirements.md`

---

## Finding 1: Req 6 AC 2-3 — Mode Key Discovery Impedance Mismatch

**Severity**: Needs clarification before task planning

**Issue**: AC 2 says the DTCG generator should "iterate over all mode overrides present on a token's `primitiveReferences`" and AC 3 says future mode keys should emit "without code changes to the generator." But `primitiveReferences` is `Record<string, string>` — it mixes mode keys (`wcagValue`) with structural keys (`value`, `fontSize`, `multiplier`, `duration`). The generator has no way to distinguish a mode override from a regular primitive reference without a convention.

**Example**: Icon tokens have `primitiveReferences: { fontSize: 'icon100', multiplier: '1.5' }`. If we add `highContrastValue: 'icon200'`, how does the generator know `highContrastValue` is a mode and `fontSize` is not?

**Options**:
- (a) Naming convention (e.g., `*Value` suffix = mode) — fragile, collides with `value`
- (b) Separate `modes` sub-object on `primitiveReferences` — source-layer change, out of scope
- (c) Explicit list of known mode keys — contradicts "without code changes"

**Recommendation**: Soften AC 2-3. The DTCG *output schema* (`$extensions.designerpunk.modes`) is extensible by design (arbitrary string keys). But the *source-to-DTCG mapping* will need a convention or config when a second mode materializes. For this spec, hardcoding `wcagValue` → `wcag` is pragmatic. The extensibility guarantee lives in the schema shape, not the generator internals.

---

## Finding 2: Req 3 AC 3 — Figma Fallback Rationale

**Severity**: Clarification needed

**Issue**: AC 3 says tokens without a WCAG mode override get `valuesByMode.wcag` = same as `light`. This means every Figma variable in the Semantics collection gets a WCAG mode value, even tokens that are identical across themes. This is correct — Figma requires all variables in a collection to have values for all modes — but the rationale isn't stated in the AC.

**Recommendation**: Add a note to AC 3 explaining this is a Figma constraint (modes must have values for all variables in a collection), not a design choice. Prevents future readers from questioning the "unnecessary" duplication.

---

## Finding 3: Req 1 AC 5 — Alias Syntax Assumption

**Severity**: Low — verify during task planning

**Issue**: AC 5 says mode values should use alias syntax (`{color.teal300}`). This assumes `generateSemanticColorTokens()` already emits aliases for `$value`. If it does, this AC is just "do the same thing for modes." If it resolves to RGBA, there's a deeper issue to address.

**Action**: Verify during task planning that the existing semantic color DTCG output uses alias syntax for `$value`. If so, no issue. If not, AC 5 has a broader implication than intended.

---

## Finding 4: Missing DTCG Validation AC

**Severity**: Low

**Issue**: Req 1 AC 6 says `dist/DesignTokens.dtcg.json` SHALL be regenerated, but there's no AC requiring the regenerated file to be valid DTCG (parseable, correct `$type` inheritance, well-formed `$extensions`). Existing DTCG validation tests likely cover this, but it's not explicitly stated.

**Recommendation**: Either add an AC ("regenerated file SHALL pass existing DTCG validation tests") or note that existing test coverage in Req 4 implicitly covers this.

---

## Finding 5: Req 5 AC 1 — File Rename Side Effects

**Severity**: Trivial

**Issue**: Renaming `WcagValueExportGuardRails.test.ts` to `WcagValueExportSupport.test.ts` will break grep-based references in the design outline's test coverage debt table (line references to the old filename).

**Action**: Update the design outline's test debt table when the rename happens. No requirements change needed.

---

## Summary

| # | Finding | Severity | Action |
|---|---------|----------|--------|
| 1 | Mode key discovery mismatch | Clarification | Soften Req 6 AC 2-3 |
| 2 | Figma fallback rationale | Clarification | Add note to Req 3 AC 3 |
| 3 | Alias syntax assumption | Low | Verify during task planning |
| 4 | Missing DTCG validation AC | Low | Add AC or note |
| 5 | File rename side effects | Trivial | Update debt table at rename time |
