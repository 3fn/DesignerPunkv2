# Ada's Review Notes — 066 Spec

**Date**: 2026-03-01
**Reviewer**: Ada (Rosetta token specialist)

---

## Token-Domain Findings

### 1. Blend token completeness in existing schemas ⚠️ FOR PETER TO DECIDE

Task 1.5 migrates 4 existing schemas (`composes` → `internal`, add `omits`) but doesn't audit their token lists for blend token completeness. The contract audit already showed blend tokens missing from documentation — if we're touching these schemas anyway, checking blend coverage is efficient.

**Counter-argument**: Scope creep. Task 1.5 is already doing two things (rename + omits). Adding blend auditing muddies the commit.

**Options**:
- (A) Add "verify blend tokens" to Task 1.5 — efficient but mixed concerns
- (B) Separate subtask under Task 2 or Task 3 — clean but more overhead
- (C) Defer — accept the gap for now, address in a future token audit pass

### 2. `.tokens.ts` is additive, not a replacement ⚠️ TASK DESCRIPTION CLARIFICATION

Tasks 2.1–2.8 say "Read `.tokens.ts` if present, then cross-reference platform files." This could be read as `.tokens.ts` first, platform files for gaps only.

`.tokens.ts` defines *component-level* tokens (e.g., `buttonIcon.inset.small`) that reference primitives. It does NOT list all tokens the component consumes. Platform CSS/Swift/Kotlin files directly reference semantic and primitive tokens (`color.primary`, `blend.hoverDarker`, `motion.focusTransition`) that never appear in `.tokens.ts`.

**Correct verification approach**:
1. `.tokens.ts` → component tokens + their primitive references
2. Platform files (CSS/Swift/Kotlin) → all directly consumed tokens (color, spacing, motion, blend, accessibility)
3. Union of both = complete token list

Recommend updating task descriptions to: "Read `.tokens.ts` for component tokens and their primitive references. Independently scan platform files for all directly consumed tokens. Token list is the union of both sources."

---

## Process Notes

### 3. Ballot measure review request (Task 4.2) — NO ACTION NOW

When Lina drafts ballot measures for Component-Development-Standards.md and Component-Development-Guide.md, I want to review the token-related sections (Token Selection Decision Framework, token governance references) to ensure `omits` and `resolvedTokens` don't create confusion with existing governance language. Not a blocker — just flagging for when drafts are ready.

---

## Items Reviewed — No Concerns

- Q4 token resolution (own in schema, resolved at query time) — correct, follows 064 Q6 pattern
- `resolvedTokens` structure with source attribution — useful for token impact analysis
- `omits` / `excludes` distinction — clean separation of API surface vs behavioral contracts
- Overall spec scope and sequencing — well-bounded, no token governance issues
