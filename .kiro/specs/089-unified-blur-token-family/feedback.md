# Spec Feedback: Unified Blur Token Family

**Spec**: 089-unified-blur-token-family
**Created**: 2026-03-30
**Design Outline**: `design-outline.md` (developed by Ada + Peter)

---

## Tasks Feedback

### Context for Reviewers

Thurgood produced a task breakdown directly from the design outline, skipping the requirements doc. The design outline was originally scoped as a "just do it" change (3 surface blur tokens), but expanded during Ada + Peter discussion into a full unification of shadow blur, glow blur, and surface blur into a single primitive family. The scope grew significantly — the "just do it" framing in the outline no longer reflects the actual work.

This feedback addresses the task doc and the missing process steps.

### Ada — Token Review

**Process concern: Missing requirements doc.**

The spec jumped from design outline to tasks. For a migration across two existing token families with consumer reference updates, I'd want a requirements doc that formalizes:

- The "zero visual change" constraint as a testable acceptance criterion (every shadow/glow composite resolves to the same numeric value before and after)
- Platform mapping behavior for surface blur (web backdrop-filter, iOS material enum, Android passthrough) — this is a new pattern that needs explicit requirements, not just task descriptions
- DTCG export expectations (should blur tokens appear in DTCG output?)
- The distinction between blur-as-numeric-value (shadow, glow) and blur-as-design-intent (surface) — this affects how the platform builders handle the tokens

This likely happened because the design outline still carried "just do it" framing from when the scope was 3 new tokens. The scope is now: 9 primitives, delete 2 files, migrate shadow composites, update generation pipeline, add new platform builder behavior, update 3 steering docs, regenerate dist/. That's requirements territory.

**Action**: Thurgood to create requirements doc before implementation begins.

**Task 1.4 conflates two concerns.**

"Add BLUR category to TokenFileGenerator" and "add platform builder support for surface blur context" are different work:

1. Category handling in the generation pipeline — mechanical, follows the pattern from the recent `DEDICATED_PRIMITIVE_CATEGORIES` refactor
2. Platform builder surface blur formatting — novel work. Web needs `backdrop-filter: blur(Xpx)`. iOS needs material enum mapping (`blur050` → `.systemUltraThinMaterial`, `blur100` → `.systemThinMaterial`, `blur150` → `.systemMaterial`). Android generates numeric constants.

The builder work is the only genuinely new pattern in this spec. It deserves its own subtask with explicit validation — especially the iOS mapping, which should be reviewed by Kenya.

**Action**: Split task 1.4 into separate subtasks for pipeline category handling and platform builder surface blur support.

**DTCG export not addressed.**

The design outline flagged DTCG export as an open question. Current shadow and glow blur tokens are included in DTCG output. The tasks don't mention whether the unified blur tokens should appear there. Recommend yes for consistency — but it needs to be a conscious decision, not an omission.

**Action**: Address DTCG export in requirements. If yes, add as subtask or extend task 1.4.

**Missing feedback round.**

No feedback doc was created for agent review. For a migration spec:
- **Kenya** should validate the iOS material enum mapping before implementation
- **Lina** should confirm shadow composite references in `ShadowTokens.ts` are the only blur consumers (I checked and believe they are, but Lina owns the component domain)
- **Ada** should review task breakdown before implementation (this feedback)

**Action**: Route this feedback doc to Kenya and Lina for Round 1 review before moving to requirements.

---

### Round 1 — Platform + Component Validation

**Kenya — iOS focus areas**:
- iOS material enum mapping: `blur050` → `.systemUltraThinMaterial`, `blur100` → `.systemThinMaterial`, `blur150` → `.systemMaterial`. Does the visual intensity feel right for these mappings?
- Are there other iOS blur contexts beyond surface blur that might consume these primitives?

**Lina — Component focus areas**:
- Confirm that `ShadowTokens.ts` composites are the only consumers of shadow blur primitives (Ada's grep found no other references, but Lina should verify from the component side)
- Confirm glow blur primitives have zero consumers (Ada found none — no semantic composites, no component references)
- Any concerns about the unified naming (`blur050` instead of `shadowBlurHard`) affecting component token readability?

[Round 1 feedback here]

### Lina — Component Validation

**Shadow blur consumers: Confirmed — ShadowTokens.ts composites only.**

Grep across all component files (`src/components/`) returns zero references to `shadowBlur*`. Components consume shadow through semantic composites (e.g., `shadow.navigation.indicator`), never blur primitives directly. Ada's finding is correct.

**Glow blur consumers: Confirmed — zero.**

Zero references to `glowBlur*` in any component file. Infrastructure tokens with no downstream references.

**Unified naming readability: No concern.**

Components never see blur primitive names. They reference semantic composites. The rename from `shadowBlurHard` to `blur025` is invisible to component code. In `ShadowTokens.ts` where the names do appear, `blur025` is actually more readable — it communicates scale position rather than a subjective descriptor.

**Process: Agree with Ada on missing requirements doc.**

The scope is 9 primitives, 2 file deletions, composite migration, pipeline updates, novel platform builder behavior, and 3 steering doc updates. That's requirements territory. The "just do it" framing from the original 3-token scope no longer fits.

**Task 1.4 split: Agree.**

The iOS material enum mapping is a novel pattern that deserves Kenya's review as a separate subtask. Pipeline category handling is mechanical and follows existing patterns.

---

## Requirements Feedback

[Populated after requirements doc is created]

---

## Design Feedback

[Populated after design doc is created, if needed]
