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

### Kenya — iOS Platform Validation

**iOS material enum mapping: Conceptually sound, but the mapping needs scrutiny.**

The proposed mapping is:
- `blur050` (8px) → `.systemUltraThinMaterial`
- `blur100` (16px) → `.systemThinMaterial`
- `blur150` (24px) → `.systemMaterial`

This is a reasonable starting point, but there's a fundamental tension here that the design outline acknowledges without fully resolving: **Apple's material system isn't a blur intensity scale.** The `.system*Material` variants control both blur amount *and* tint/saturation, and they adapt to light/dark mode, elevated contexts, and vibrancy settings. Mapping a numeric blur token to a material enum is a lossy translation — you're collapsing a multi-dimensional system into a single axis.

That said, for DesignerPunk's purposes this is probably fine. The design outline correctly identifies this as a builder concern, not a token definition concern. The blur primitive carries the design intent (how much visual separation), and the iOS builder translates to the closest native equivalent. The mapping order feels right — `.systemUltraThinMaterial` is the most transparent, `.systemMaterial` is the most opaque, which tracks with increasing blur values.

**Counter-argument to my own position:** One could argue we should skip the material enum mapping entirely and use `UIVisualEffectView` with `UIBlurEffect(style:)` for more precise control, or even SwiftUI's `.blur(radius:)` modifier on a background layer. This would give us exact numeric blur values matching web's `backdrop-filter: blur(Xpx)`. However, that fights the platform — Apple's materials are optimized for performance and visual consistency across system contexts. Using them is the right call for True Native Architecture. The numeric precision loss is an acceptable trade-off.

**One gap: What happens at blur values outside the mapped range?**

The mapping covers `blur050`, `blur100`, `blur150`. But the unified family has 9 tokens (`blur000` through `blur250`). If a component or future screen spec references `blur200` in a surface blur context on iOS, what does the builder emit? The design outline doesn't address this. Options:
1. Clamp to `.systemMaterial` (the heaviest) for anything above `blur150`
2. Fall back to `.ultraThickMaterial` or `.thickMaterial` for higher values
3. Emit a build warning for unmapped values

I'd recommend option 2 with a complete mapping:
- `blur000` → no material (transparent)
- `blur025` → `.ultraThinMaterial` (lightest system material)
- `blur050` → `.systemUltraThinMaterial`
- `blur075` → `.thinMaterial`
- `blur100` → `.systemThinMaterial`
- `blur125` → `.material`
- `blur150` → `.systemMaterial`
- `blur200` → `.thickMaterial`
- `blur250` → `.ultraThickMaterial`

This maps the full 9-token scale to Apple's full material hierarchy. Whether all 9 are *used* is a different question — but the builder should handle any valid blur token without surprises.

**HOWEVER** — and this is the counter-argument — mapping all 9 creates a false precision. Apple's material variants don't correspond to linear blur intensity increases. The visual difference between `.thinMaterial` and `.systemThinMaterial` is subtle and context-dependent. A simpler 3-tier mapping (light/medium/heavy → the three surface blur tokens the design outline actually scopes) might be more honest about what the platform offers. The requirements doc should make a conscious decision here.

**Other iOS blur contexts beyond surface blur: Yes, one.**

SwiftUI's `.blur(radius:)` modifier is used for content blur (e.g., blurring sensitive content, progressive disclosure). This is different from surface/backdrop blur — it blurs the view itself, not what's behind it. Currently no DesignerPunk component uses this, but it's a plausible future need (think: blurred preview behind a paywall, or blurred content during loading). The unified blur primitives would work perfectly for this since `.blur(radius:)` takes a numeric `CGFloat` — no enum mapping needed.

No action required now, but worth noting in the Token-Family-Blur.md doc that iOS has two blur consumption patterns: material enums for surface blur, numeric values for content blur.

**Process: Agree with Ada on missing requirements doc and task 1.4 split.**

The iOS material mapping is the novel work in this spec. It deserves its own subtask with explicit validation criteria — specifically, visual verification that the chosen material variants produce the intended effect across light and dark mode.

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

### Context for Reviewers

Thurgood created the requirements doc after Ada's process feedback. Six requirements covering: unified primitives, shadow migration, glow migration, generation pipeline, zero visual change verification, and documentation.

### Ada — Token Review

**Overall: Strong requirements doc.** The zero visual change constraint is properly formalized (Req 5), Lina's R1 confirmations are cited (Req 2 AC 3, Req 3 AC 2), the 088/089 boundary is respected, and Kenya's content blur observation is captured (Req 6 AC 5).

**One correction needed: Req 4 AC 1 — `DEDICATED_PRIMITIVE_CATEGORIES` is the wrong pattern.**

The requirement says blur should use the `DEDICATED_PRIMITIVE_CATEGORIES` pattern. That pattern *excludes* categories from the generic primitive pass because they have dedicated generation sections (like motion has `generateMotionSection()`). Blur tokens don't need a dedicated section — they're standard numeric primitives that should flow through the generic primitive pass like spacing, color, radius, etc.

Adding `BLUR` to `DEDICATED_PRIMITIVE_CATEGORIES` would actually *prevent* blur tokens from appearing in the primitive section of the generated output — the opposite of what we want.

The pipeline work is just: register `TokenCategory.BLUR` so the generation path recognizes it. No special handling, no dedicated section, no filter exclusion.

**Action**: Revise Req 4 AC 1 to: "The `TokenFileGenerator` SHALL handle `TokenCategory.BLUR` as a standard primitive category in the generic generation pass (no dedicated section, no `DEDICATED_PRIMITIVE_CATEGORIES` exclusion)."

---

## Design Feedback

[Populated after design doc is created, if needed]
