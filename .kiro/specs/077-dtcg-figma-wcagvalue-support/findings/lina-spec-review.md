# Lina Finding: Spec 077 Review

**Date**: 2026-03-12
**Spec**: 077 — DTCG & Figma wcagValue Support
**Author**: Lina
**For**: Ada (implementation), Thurgood (test planning), Peter (scope decisions)
**Type**: Spec review — concerns and refinements

---

## Overall Assessment

Architecture is sound. Option C (modes extension) is the right call, migration path to DTCG native `$modes` (#210) is clean, and the test debt table is thorough. Concerns below are refinements, not blockers.

---

## Concern 1: Figma Fallback Semantics (Req 3.3)

**The requirement:**
> "WHEN a token has no WCAG mode override THEN `valuesByMode.wcag` SHALL fall back to the same value as `valuesByMode.light`"

**The issue:** Every semantic color variable in Figma gets a WCAG mode value, even tokens with no WCAG-differentiated behavior. A designer switching to WCAG mode sees values on tokens like `color.background.surface` and may assume those values were intentionally reviewed for WCAG — when the answer is "this token doesn't need WCAG differentiation."

**Counter-argument:** Leaving `valuesByMode.wcag` absent for non-WCAG tokens would cause Figma to show "no value" or error states in WCAG mode. Figma's mode system expects all variables in a collection to have values for all modes. The fallback is probably correct.

**Recommendation:** Acknowledge the trade-off explicitly in the design outline. No requirement change needed — just documentation that this is a known UX implication for designers, not an oversight.

---

## Concern 2: Figma Mode Infrastructure Is Untested at Real Resolution

**The claim in the design outline:**
> "existing `FigmaTransformer` already has mode infrastructure"

**What I verified:** True — `FigmaVariableCollection.modes: string[]` and `FigmaVariable.valuesByMode: Record<string, unknown>` exist. Both collections use `['light', 'dark']` with identical values, commented as "future theme support."

**The issue:** Light and dark modes currently hold *identical* values. The transformer has never resolved *different* values per mode. Adding WCAG as a mode that resolves to a *different* primitive is the first time this code path does real work. The implementation complexity isn't "add 'wcag' to the array" — it's "make mode-conditional resolution actually function."

**Recommendation:** Requirements or design outline should acknowledge this is the first real exercise of the mode infrastructure. Affects estimation — this is new behavior, not extension of proven behavior.

---

## Concern 3: No tasks.md Yet

Requirements and design outline are complete, but no task breakdown exists. The test debt table is detailed enough that tasks should fall out naturally. Flagging for completeness — not a concern about quality, just about handoff readiness.

---

## Concern 4: Guard Rail Test Fixture Uses Old Extension Shape

**Current guard rail test fixture** (`WcagValueExportGuardRails.test.ts`, Figma test):
```typescript
$extensions: {
  designerpunk: { family: 'color', wcagValue: 'purple500' } as any
}
```

**New DTCG output shape** (Option C):
```json
"$extensions": {
  "designerpunk": {
    "modes": {
      "wcag": "{color.teal300}"
    }
  }
}
```

The Figma transformer will read from `modes.wcag`, not `wcagValue`. Req 5.4 says "test inputs SHALL be preserved" — but that refers to the *token* inputs (the mock semantic tokens with `wcagValue` on `primitiveReferences`), not the DTCG structure fixtures. The Figma test fixture must be updated to the new `modes` shape.

**Recommendation:** Clarify in Req 5.4 that "test inputs" means the source token fixtures, not the intermediate DTCG structures. The DTCG fixtures fed to the Figma transformer will necessarily change shape.

---

## Concern 5: Req 6.4 May Be Premature for Figma

**The requirement:**
> "The Figma transformer SHALL map any mode key in `$extensions.designerpunk.modes` to a corresponding Figma variable mode (not hardcoded to `"wcag"`)"

**The issue:** Figma variable collections have a fixed set of modes that must be pre-configured. If a future `high-contrast` mode key appears on a token, the transformer would try to populate `valuesByMode['high-contrast']` — but the collection's `modes` array might not include it. The transformer would need to either dynamically add modes to collections (changing the collection schema) or validate that the mode exists.

**Two options:**

- **(a)** Scope Req 6.4 to "SHALL map mode keys that are present in the collection's `modes` array" with a configuration mechanism for which modes are active. Unknown modes are warned, not silently dropped.
- **(b)** Accept that the DTCG side is fully extensible (Req 6.1–6.3) while the Figma side is hardcoded to known modes. The DTCG format is the interchange layer — that's where extensibility matters. Figma is a consumer that gets updated when new modes actually arrive.

**Recommendation:** Option (b) is simpler and honest. The DTCG extensibility is the important architectural investment. Figma mode support can be added incrementally as modes are defined. Req 6.4 as written implies a generality the Figma platform doesn't naturally support.

---

## Summary

| # | Concern | Severity | Action |
|---|---------|----------|--------|
| 1 | Figma fallback UX for designers | Low | Document trade-off in design outline |
| 2 | Mode infrastructure untested at real resolution | Medium | Acknowledge in requirements/estimation |
| 3 | No tasks.md | Low | Expected next step |
| 4 | Guard rail test fixture shape mismatch | Low | Clarify Req 5.4 scope |
| 5 | Req 6.4 premature Figma extensibility | Medium | Scope down or split DTCG vs Figma extensibility |

---

## Design Doc Review (appended 2026-03-12)

Most concerns from the requirements/design-outline review above are already addressed in the design doc — Figma fallback trade-off (Decision 3), guard rail test transformation (Decision 5), primitives exclusion (Decision 6). Three additional items:

### Concern 6: Req 6.2–6.3 Contradict Decision 4

**The conflict:**
- Req 6.2: "The DTCG generator SHALL iterate over all mode overrides present on a token's `primitiveReferences`, not just `wcagValue`"
- Req 6.3: "WHEN a future mode key is added to `primitiveReferences` THEN the DTCG generator SHALL emit it under `$extensions.designerpunk.modes` without code changes"
- Decision 4: Generator explicitly maps `wcagValue` → `modes.wcag` (hardcoded), generic discovery deferred until second mode materializes

Decision 4's rationale is sound — `primitiveReferences` mixes structural keys (`value`, `fontSize`, `multiplier`) with mode keys (`wcagValue`), no reliable way to distinguish them. But Req 6.2–6.3 promise a generality the design explicitly defers.

**Recommendation:** Revise Req 6.2–6.3 to match Decision 4. Something like: "The DTCG generator SHALL map `wcagValue` to `modes.wcag`. The mapping strategy will be revisited when a second mode key materializes. The `$extensions.designerpunk.modes` schema itself is extensible — adding future modes requires only a new mapping entry, not a schema change."

### Concern 7: `resolveAliases` and Mode Values

The error handling table states that when `resolveAliases` config is true, `modes.wcag` aliases are resolved to RGBA. But does the current `resolveAliases` code path know to walk into `$extensions.designerpunk.modes` and resolve aliases there? If it only resolves `$value`, mode aliases would be left as `{color.teal300}` strings in resolved output.

**Recommendation:** Verify during implementation whether `resolveAliases` needs to be extended to cover mode values. If so, add it to the task scope. If not (i.e., resolved output is only used for platform generators that don't read DTCG), document why it's safe to skip.

### Updated Summary Table

| # | Concern | Severity | Action |
|---|---------|----------|--------|
| 1 | Figma fallback UX for designers | Low | ✅ Addressed — Decision 3 |
| 2 | Mode infrastructure untested at real resolution | Medium | Acknowledged in design doc |
| 3 | No tasks.md | Low | Expected next step |
| 4 | Guard rail test fixture shape mismatch | Low | Clarify Req 5.4 scope |
| 5 | Req 6.4 premature Figma extensibility | Medium | Open — design doc doesn't address |
| 6 | Req 6.2–6.3 contradict Decision 4 | Medium | Revise reqs to match design |
| 7 | `resolveAliases` coverage of mode values | Low | Verify during implementation |

---

## Tasks Doc Review (appended 2026-03-12)

### Concern 8: Task 3 Agent Assignments

Tasks 3.1–3.6 are assigned to Lina, but these are token pipeline test files (`DTCGFormatGenerator.test.ts`, `DTCGConfigOptions.test.ts`, etc.) — Ada's domain. The guard rail test transformation (3.5) and new modes verification tests (3.6) require understanding the DTCG output schema and Figma transformer internals.

Restorations (3.1–3.4) are mechanical (re-add `semanticColor` to lists, restore thresholds, remove early-return guards) — agent assignment matters less. But 3.5–3.6 involve writing assertions against `$extensions.designerpunk.modes` and `valuesByMode.wcag`, which requires intimate knowledge of the generator output.

Counter-argument: Thurgood might claim these as test governance tasks (restoring weakened coverage, maintaining test intent). But the tests are too implementation-specific for governance ownership.

**Recommendation:** Ada owns 3.1–3.6. Lina available to pair if needed for cross-domain coverage.

### Concern 9: Task 1.2 — `resolveAliases` Scope May Be Underestimated

The subtask includes "When `resolveAliases` config is true, resolve `modes.wcag` to RGBA using the same resolution path as `$value`." This is the first time `resolveAliases` needs to walk into `$extensions`. The resolution path for `$value` may not trivially extend to nested extension fields. Buried as a bullet point — might warrant its own subtask or at least a callout that this is new behavior.

### Concern 10: Task 1.4 — Missing Execution Detail

Task says "Run the DTCG generator to produce updated `dist/DesignTokens.dtcg.json`" but doesn't specify whether this is a manual script invocation or part of the build. Should specify the command to avoid confusion during execution.
