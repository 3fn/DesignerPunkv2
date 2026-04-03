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

### Lina — Component Migration Assessment

**Overall**: The semantic separation is the right call. The density mode argument is compelling even as a future concern — the mismatch is real today in how we document tokens (`buttonIcon.size.large = space600` reads wrong).

#### Migration Scope by Component

| Component | Current Pattern | Spacing Refs? | Migration Complexity |
|-----------|----------------|---------------|---------------------|
| **Button-Icon** | `buttonIcon.tokens.ts` references `spacingTokens.space400/500/600` | ✅ Direct refs | Low — swap 3 references |
| **Progress-Node** | `src/tokens/component/progress.ts` references `spacingTokens.space150/200/300` | ✅ Direct refs | Low — swap 3 references. Note: current-size tokens use `SPACING_BASE_VALUE × multiplier` formula — this should use a sizing base value instead. |
| **Avatar-Base** | Hard-coded values in web platform file (`xs: 24, sm: 32, md: 40, lg: 48`) with spacing comments | ❌ Hard-coded | Medium — needs component token file created first, then reference sizing primitives. Currently has no `avatar.tokens.ts`. |
| **Input-Checkbox-Base** | Hard-coded values in web platform file, icon size tokens for checkmark | ❌ Hard-coded | Medium — box dimensions are hard-coded, not tokenized. Needs component token file. |
| **Input-Radio-Base** | Hard-coded values in schema description (`24px, 32px, 40px`) | ❌ Hard-coded | Medium — same as Checkbox. |
| **Progress-Bar (090)** | New component — no migration | N/A | None — references sizing primitives from the start |

**Summary**: 2 components have direct spacing refs (Button-Icon, Progress-Node) — straightforward swap. 3 components have hard-coded values (Avatar, Checkbox, Radio) — need component token files created first, then reference sizing primitives. This is a larger effort but the right thing to do.

#### Complications

- **Progress-Node current-size formula**: Uses `SPACING_BASE_VALUE × multiplier` to calculate +4px emphasis sizes. If we're separating spacing from sizing, this formula should use a sizing base value. The formula itself is fine (`8 × 2 = 16`, `8 × 2.5 = 20`, `8 × 3.5 = 28`) — it's just that the constant name `SPACING_BASE_VALUE` is semantically wrong for a sizing calculation. Minor rename.

- **No dual-purpose tokens found**: I checked all 6 families — no token is used for both spacing and sizing simultaneously. The separation is clean.

#### Additional Components Not in Audit

- **Nav-Header-Base**: Uses `tapAreaRecommended` for min-height (48px). This is correctly an accessibility constraint, not a sizing token. No migration needed.
- **Nav-TabBar-Base**: Uses `space050` for dot size. This is a dimensional value (dot diameter), not spacing. Could be a sizing candidate, but it's a 4px dot — `size050` would work. Low priority.

#### Scale Coverage

The proposed scale (4–128px) covers everything I'm aware of. The gap between 64 and 80 is fine — those are exceptional Avatar sizes. I don't see any component needing 72 or 96 in the near term.

#### Recommendation on Migration Phasing

Phase 1 (this spec): Create sizing primitives + migrate Button-Icon and Progress-Node (direct spacing refs — mechanical swap).

Phase 2 (follow-up or part of individual component specs): Create component token files for Avatar, Checkbox, Radio and reference sizing primitives. This is more work because it involves creating new token files, not just swapping references. Could be done as part of each component's next spec touch.

Progress-Bar (Spec 090) uses sizing primitives from the start — no migration.

---

## Requirements Feedback

[Populated after requirements doc is created]

---

## Design Feedback

[Populated after design doc is created]

---

## Tasks Feedback

[Populated after tasks doc is created]
