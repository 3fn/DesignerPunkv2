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

### Context for Reviewers

Thurgood created the requirements doc from the design outline + Lina's R1 migration assessment. Five requirements: primitives, component migration (all 6 families + TabBar in one spec per Q5 decision), generation pipeline, zero visual change, documentation (new Token-Family-Sizing.md + Spacing cross-reference + Token Quick Reference update).

**@LINA**: Your R1 recommended phasing (primitives + direct-ref swaps now, token file creation later). The Q5 decision overrides this — all families in one spec. Review the requirements with that scope in mind. Key areas:
- Req 2 ACs 4-6 (new token file creation for Avatar, Checkbox, Radio) — are the sizing references correct for each component?
- Req 2 AC 7 (zero visual change) — any edge cases in the token file creation that could change rendered dimensions?
- Req 5 (documentation) — anything missing from the Token-Family-Sizing.md content requirements?

[Lina feedback here]

### Lina — Requirements Review

**Overall**: Requirements are solid. All sizing references verified against source code. No edge cases found that would change rendered dimensions.

#### Req 2 ACs 4-6: Sizing References Verified

**AC 4 — Avatar-Base**: ✅ Correct. Verified against `AVATAR_SIZE_PX` in web platform file:
- xs=24 → `size300` ✅
- sm=32 → `size400` ✅
- md=40 → `size500` ✅
- lg=48 → `size600` ✅
- xl=80 → `size1000` ✅
- xxl=128 → `size1600` ✅

**AC 5 — Input-Checkbox-Base**: ✅ Correct. Verified against schema (`sm: 24px, md: 32px, lg: 40px`):
- sm=24 → `size300` ✅
- md=32 → `size400` ✅
- lg=40 → `size500` ✅

Note: Checkbox also has *icon* sizes (16, 20, 24) that use `icon.size*` tokens. These are NOT sizing tokens — they stay in the icon family. The token file should only reference sizing primitives for the box/container dimensions.

**AC 6 — Input-Radio-Base**: ✅ Correct. Same dimensions as Checkbox:
- sm=24 → `size300` ✅
- md=32 → `size400` ✅
- lg=40 → `size500` ✅

#### Req 2 AC 7: Zero Visual Change Edge Cases

No edge cases found. All values are exact matches:
- Button-Icon: `space400=32`, `space500=40`, `space600=48` → `size400=32`, `size500=40`, `size600=48` ✅
- Progress-Node: `space150=12`, `space200=16`, `space300=24` → `size150=12`, `size200=16`, `size300=24` ✅
- Avatar/Checkbox/Radio: hard-coded values match sizing primitives exactly ✅
- TabBar dot: `space050=4` → `size050=4` ✅

One note: Progress-Node's current-size formula uses `SPACING_BASE_VALUE × multiplier`. Since `SPACING_BASE_VALUE = 8` and the proposed sizing base is also 8, the formula produces identical results. The constant should be renamed to `SIZING_BASE_VALUE` or a shared `BASE_VALUE` for semantic clarity, but the math doesn't change.

#### Req 5: Documentation

Nothing missing. The exclusion of icon sizes and tap area tokens from the sizing family is the right call and should be prominently documented — it's the most likely source of confusion ("why isn't `icon.size100` a sizing token?").

---

## Design Feedback

[Populated after design doc is created]

---

## Tasks Feedback

[Populated after tasks doc is created]
