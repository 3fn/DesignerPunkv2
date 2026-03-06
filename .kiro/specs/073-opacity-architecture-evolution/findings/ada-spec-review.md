# Ada Spec Review: 073 Opacity Architecture Evolution

**Date**: 2026-03-06
**Reviewer**: Ada (Token Specialist)
**Documents Reviewed**: requirements.md, design.md, tasks.md
**Overall Assessment**: Ready to execute. No blockers.

---

## Requirements Review

**Verdict**: Solid. All requirements are testable and traceable to the design outline decisions.

### Strengths

- Requirement 5, AC 3 correctly specifies wrong-family primitive references as an error (not a warning). An opacity modifier referencing `cyan300` should fail validation, not just warn.
- Requirement 1, AC 5 explicitly calls out shadow and glow opacity primitives following the same rename pattern. The blast radius audit identified `ShadowOpacityTokens.ts` (30 refs) and `GlowOpacityTokens.ts` (12 refs) — good that this is captured as a requirement, not left implicit.
- Requirement 8 (modifier extensibility governance) properly captures Lina's concern about ungoverned growth. Criteria + Peter's approval + ballot measure is the right gate.
- Requirement 1, AC 7 explicitly protects historical docs from modification. Important for a big-bang rename.

### No Issues Found

No missing requirements, no ambiguous acceptance criteria, no conflicts between requirements.

---

## Design Review

**Verdict**: Clean and accurate. Pipeline resolution approach is correct.

### Strengths

- The `mergeShadowColor` reference in `DTCGFormatGenerator.ts` is the right existing pattern to leverage. It already composes color + opacity → RGBA for shadow tokens. The modifier resolution can follow the same approach with minimal new code.
- Error handling table is comprehensive — covers all failure modes I can think of.
- Design decisions accurately reflect the conversation rationale. No drift from what was agreed.

### No Issues Found

The pipeline resolution pseudocode matches what I'd implement. The `TokenModifier` interface is minimal and correct. The `modeInvariant` field placement is appropriate.

---

## Tasks Review

**Verdict**: Executable with one suggestion.

### Suggestion: Consider Splitting Task 1.7

Task 1.7 bundles two distinct types of work:
- **Mechanical rename** of opacity references in 9 test files (221 refs) — same find-and-replace pattern as Task 1.2
- **New feature tests** for modifier validation, mode-invariance, generator resolution, and scrim integration — requires design thinking

These have different risk profiles and could be verified independently. The mechanical rename can be confirmed by running the existing test suite (all tests should pass with new names). The new feature tests require writing new assertions.

**Counter-argument**: Bundling ensures the full test suite runs once with everything in place. Running `npm test` at the end of 1.7 validates both the rename and the new features in a single pass. This is a valid approach.

**Recommendation**: Not a blocker. I can work with the bundled task. If Thurgood prefers to split, the natural boundary is:
- 1.7a: Rename opacity references in test files (mechanical, Tier 2)
- 1.7b: Write new feature tests (modifier, mode-invariance, generator, scrim — Tier 2)

### Observation: Task 1.3 Parallelism

Task 1.3 (Lina — component platform file comment updates) has no dependency on Task 1.2 (Ada — rename token definitions). These can execute in parallel. The comment updates in component files don't reference the token source files — they're string literals in comments. Worth noting for scheduling.

---

## Cross-Domain Notes

- Task 1.3 is correctly assigned to Lina. Those are her component files.
- All other tasks are correctly in my domain (token definitions, validators, generators, tests, docs).
- The ballot measures in Task 1.9 follow the correct process — I draft, Peter approves, I apply.
