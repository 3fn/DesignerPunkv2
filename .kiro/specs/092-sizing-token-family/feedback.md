# Spec Feedback: Sizing Token Family

**Spec**: 092-sizing-token-family
**Created**: 2026-04-03
**Design Outline**: `design-outline.md` (developed by Ada + Peter)

---

## Design Outline Feedback

### Context for Reviewers

Ada and Peter developed this design outline based on an audit of 6 component families using spacing primitives for non-spacing dimensional values (heights, widths, box sizes). The spec proposes a new sizing primitive family (base 8, 12 tokens) to separate component dimensions from spacing. Four decisions are confirmed (scale completeness, base value, naming, DTCG export). One open question remains on migration scope.

Key areas for review:
- Base 8 aligns sizing suffixes with spacing (`size300 = 24` matches `space300 = 24`)
- 12 tokens: size050 (4) through size1600 (128), including preemptive size700 (56) and size800 (64)
- No semantic sizing layer — component tokens provide the semantic meaning
- Button-Icon is the only component explicitly referencing spacing primitives for sizing; others use hard-coded values or component tokens
- Zero visual change constraint

### Round 1 — Component + Governance

**Lina — Component focus areas**:
- Migration scope: Which of the 6 component families (Button-Icon, Avatar, Progress-Node, Checkbox, Radio, Progress-Bar) have component tokens that reference spacing primitives directly? Which use hard-coded values? This determines migration complexity.
- Are there any component token files where swapping spacing refs to sizing refs would cause complications (e.g., tokens used for both spacing and sizing purposes)?
- Any additional components not in the audit that use spacing for dimensional sizing?
- Does the proposed scale (4–128px) cover all component dimension needs you're aware of?

**Thurgood — Governance focus areas**:
- Spec structure readiness — is the outline complete enough to move to requirements?
- This follows the same pattern as Spec 089 (blur unification). Should the spec structure mirror 089's approach (requirements → design → tasks)?
- The migration scope question affects task complexity. Recommendation on whether all-family migration should be one spec or phased?

[Round 1 feedback here]

---

## Requirements Feedback

[Populated after requirements doc is created]

---

## Design Feedback

[Populated after design doc is created]

---

## Tasks Feedback

[Populated after tasks doc is created]
