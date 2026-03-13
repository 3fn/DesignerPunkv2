# Ada's Tasks Review — Spec 077

**Date**: 2026-03-13
**Reviewer**: Ada
**Document**: `tasks.md`

---

## Finding 1: Task 3 Agent Assignment — Lina vs Ada

**Severity**: Needs resolution

**Issue**: Tasks 3.1–3.6 are assigned to Lina, but the files being modified are all generator-level tests (`DTCGFormatGenerator.test.ts`, `DTCGConfigOptions.test.ts`, `DTCGFormatGenerator.integration.test.ts`, `DTCGFormatGenerator.property.test.ts`, `WcagValueExportGuardRails.test.ts`). These are token pipeline tests, not component behavioral contract tests (stemma tests). Generator tests are Ada's domain; Lina's domain is component tests.

**Recommendation**: Reassign Tasks 3.1–3.6 to Ada unless there's a specific reason for Lina's involvement (e.g., workload balancing, cross-training).

---

## Finding 2: Missed Parallelization in Task 3

**Severity**: Low — linear chain works, optimization opportunity

**Issue**: The dependency graph shows a strict linear chain: Task 1 → Task 2 → Task 3 → Task 4. But Tasks 3.1–3.4 (DTCG test restoration) only depend on Task 1 (DTCG export changes). Tasks 3.5–3.6 (Figma test transformation + new tests) depend on Task 2 (Figma import changes). The current plan forces 3.1–3.4 to wait for Task 2 unnecessarily.

**Recommendation**: If parallelization is desired, split Task 3 into two phases:
- Phase A (3.1–3.4): DTCG test restoration — can start after Task 1
- Phase B (3.5–3.6): Figma test transformation + new tests — starts after Task 2

Not a blocker — the linear chain is simpler and the time savings are marginal.

---

## Finding 3: Phantom Requirement 7 References

**Severity**: Needs correction

**Issue**: Tasks 4.1, 4.2, and 4.3 reference Requirements 7.1, 7.2, and 7.3 respectively. The requirements document only contains Requirements 1–6. There is no Requirement 7 for steering documentation.

**Recommendation**: Either:
- (a) Add a Requirement 7 (Steering Documentation) to `requirements.md` with corresponding acceptance criteria, or
- (b) Remove the requirement references from Tasks 4.1–4.3 and note that steering doc updates are process-driven (per 076 precedent), not requirements-driven

---

## Finding 4: No Figma Output Regeneration Step

**Severity**: Low — likely intentional

**Issue**: Task 1.4 regenerates `dist/DesignTokens.dtcg.json` after DTCG changes. There is no equivalent regeneration step after Task 2 modifies the Figma transformer. The Figma transformer produces in-memory `FigmaVariableCollection` objects (not `dist/` files), so there may be no artifact to regenerate.

**Recommendation**: Confirm this is intentional. If the Figma transformer has any file output (e.g., a JSON export for Figma plugin consumption), add a regeneration step to Task 2. If output is purely in-memory and validated by tests, no action needed.

---

## Finding 5: Task 1.4 Could Be Folded Into 1.3

**Severity**: Trivial — structural preference

**Issue**: Task 1.4 (regenerate `dist/DesignTokens.dtcg.json`) is a standalone subtask with Tier 1 validation. It's essentially "run the generator and check the output." The real validation of the output structure happens in Task 3 when tests assert against it. Task 1.4 could be a verification step within Task 1.3 rather than a separate subtask.

**Recommendation**: No strong opinion — keeping it separate makes the checklist explicit, which has value. Just noting it's thin for a standalone subtask.

---

## Summary

| # | Finding | Severity | Action |
|---|---------|----------|--------|
| 1 | Task 3 agent assignment | Needs resolution | Reassign to Ada or confirm Lina intent |
| 2 | Missed parallelization | Low | Optional split of Task 3 |
| 3 | Phantom Requirement 7 | Needs correction | Add Req 7 or remove references |
| 4 | No Figma regeneration step | Low | Confirm intentional |
| 5 | Task 1.4 thin as standalone | Trivial | Optional fold into 1.3 |
