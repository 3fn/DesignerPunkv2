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

### Ada — Token Review

**Approved with one correction and one scale addition.**

**Correction: Req 2 AC 2 — Progress-Node sizes are wrong.**

The requirements list Progress-Node base sizes as `size150` (12), `size200` (16), `size300` (24). Checking the actual token file (`src/tokens/component/progress.ts`), the base sizes are:

- sm: `space150` = 12 ✅
- md: `space200` = 16 ✅
- lg: `space250` = 20 ❌ (requirements say 24)

And the current (emphasized) sizes are:
- sm.current: `space200` = 16
- md.current: `space250` = 20
- lg.current: `space300` = 24

The lg base is 20px, not 24px. The requirements should reference `size250` for lg base. This also means we need `size250` (base × 2.5 = 20) in the primitive scale — it's not currently in the proposed 12 tokens.

Additionally, the current-size tokens (16, 20, 24) are also dimensional values that should reference sizing primitives, and the `SPACING_BASE_VALUE` constant in the formula should be renamed to `SIZING_BASE_VALUE` (same value of 8, different semantic name). The gap tokens (`node.gap.sm/md/lg`) are actual spacing and should remain as spacing refs.

**Action**: 
1. Add `size250` (base × 2.5 = 20) to the primitive scale — 13 tokens total
2. Revise Req 2 AC 2 to: Progress-Node base sizes `size150` (sm/12), `size200` (md/16), `size250` (lg/20); current sizes `size200` (sm.current/16), `size250` (md.current/20), `size300` (lg.current/24)
3. Rename `SPACING_BASE_VALUE` to `SIZING_BASE_VALUE` in progress.ts formula

**Everything else looks good.** Pipeline handling correct (Req 1 AC 4), zero visual change formalized (Req 4), documentation updates comprehensive (Req 5 AC 3 and AC 4 catch Spacing doc and Quick Reference).

#### Design Outline Refinements (Lina R2)

**F1: Progress-Node current-size formula should reference primitives directly, not compute from base.**
The formula `SPACING_BASE_VALUE × multiplier` produces +4px emphasis sizes (16, 20, 28). After migration this becomes `SIZING_BASE_VALUE × multiplier` — same math, different constant. But if the sizing base changes independently of spacing in the future (the whole point of separation), these emphasis sizes shift. Recommend referencing sizing primitives directly: `node.size.sm.current = size200` (16) instead of `SIZING_BASE_VALUE × 2`. Simpler, more explicit, doesn't break if the base changes.

**F2: Preemptive tokens (size700, size800) should be explicitly noted as having no current consumers.**
Q1 decision to include them is pragmatic, but the outline should note they're preemptive — no component currently uses 56 or 64 for a dimensional value. Prevents future confusion about why these tokens exist with zero references.

**F3: Nav-TabBar-Base dot migration missing from design outline migration section.**
The outline's migration section covers Button-Icon and "other components" generically. The TabBar dot (`space050` → `size050` for 4px dot diameter) is a specific case identified in my R1 that should be in the migration table for completeness.

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

### [THURGOOD R2]

Incorporated Lina's requirements feedback:

- **Req 1**: Preemptive tokens (size700, size800) marked as "no current consumers" in the scale table
- **Req 2 AC 5**: Clarified Checkbox sizing is box/container dimensions only — icon sizes stay in icon family
- **Design outline**: Added Nav-TabBar-Base dot migration to migration tables for visibility
- All sizing references verified by Lina against source code — zero edge cases
- Progress-Node `SPACING_BASE_VALUE` rename to `SIZING_BASE_VALUE` noted for implementation

Requirements approved. Ready to proceed to tasks.

### [THURGOOD R3]

Incorporated Ada's requirements feedback:

- **Req 1 AC 1**: Added `size250` (base × 2.5 = 20) — 13 tokens total, not 12. Required by Progress-Node lg base size.
- **Req 2 AC 2**: Fixed Progress-Node sizes — lg base is 20 (`size250`), not 24. Added current-size (emphasized) token references. Added `SPACING_BASE_VALUE` → `SIZING_BASE_VALUE` rename. Current-size tokens reference primitives directly per Lina's F1 (no base × multiplier computation).
- **Req 3**: Updated all "12 sizing" references to "13 sizing".

Ada's correction caught a real data error — the design outline's Progress-Node lg value was wrong (24 instead of 20). Good catch.

---

## Design Feedback

### Ada — Token Review

**Approved.** All requirements feedback incorporated — `size250` in scale, Progress-Node current sizes as direct primitive references (Decision 3), `SPACING_BASE_VALUE` rename captured, 13 tokens throughout.

Correctness property #4 ("no spacing primitive referenced for dimensional purposes in migrated components") is a strong grep-verifiable gate — recommend running it as a final validation step, same as blur spec's property #6.

**Implementation note:** Progress-Node gap tokens (`node.gap.sm/md/lg`) remain as spacing refs — gaps are spacing, not sizing. This is implicit in the migration mapping but worth a code comment during implementation to prevent future confusion about why gap tokens weren't migrated.

Ready for tasks.

### Lina — Component Review

**Overall**: Clean, thorough, all migration mappings verified. One discrepancy to flag, one pre-existing issue discovered.

**F1: Token count 13 vs outline's 12 — `size250` (20) added.**
The design doc adds `size250` (base × 2.5 = 20) which wasn't in the original outline. This is correct — Progress-Node md current-size is 20px and needs a sizing primitive. The outline's table and Req 1 AC 1 say 12 — the design doc is the authority at this stage. Minor bookkeeping.

**F2: Pre-existing issue in Progress-Node lg current-size.**
While verifying the migration mapping, I noticed: base lg = `space300` (24), current lg = `space300` (24). The +4px emphasis pattern gives sm: 12→16 (+4), md: 16→20 (+4), lg: 24→24 (+0). The lg current-size should be 28 (+4), but it references `space300` (24) — same as the base. This is a pre-existing bug in `progress.ts`, not introduced by 092. The design doc's migration table shows `size300` (24) for lg current, which faithfully preserves the existing (possibly wrong) value. Zero visual change is maintained. Flagging for awareness — may warrant a separate fix.

**Ada's implementation note seconded**: Progress-Node gap tokens staying as spacing refs is correct and should be commented. Gaps are spacing, dimensions are sizing — the distinction is exactly what this spec is about.

---

## Tasks Feedback

### [THURGOOD R4]

Design feedback from Ada and Lina — no changes needed:

- **Ada**: Approved. Correctness property #4 as grep-verifiable gate noted for tasks. Gap token code comment noted for implementation.
- **Lina F1**: Token count discrepancy (outline 12, design 13) — design doc is authority after `size250` addition. Outline is historical.
- **Lina F2**: Pre-existing Progress-Node lg current-size bug (24 instead of 28) — faithfully preserved by zero-visual-change constraint. Not this spec's problem. Filed for awareness.

Design approved. Ready for tasks.

### Ada — Token Review

**Approved.** Clean three-parent structure (primitives, migration, documentation). Agent assignments correct — Ada for token/pipeline work, Lina for component token file creation. Dependencies explicit. All prior feedback incorporated.

**Implementation note for Task 1.2:** Same pattern as Spec 089 (blur) — DTCG generator needs a `generateSizingTokens()` method, Figma transformer needs `'sizing'` in `PRIMITIVE_GROUPS`. Generic platform pass handles CSS/Swift/Kotlin automatically.

Ready for implementation.
