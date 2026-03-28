# Synthesis Review: Data

**Agent**: Data — Android Platform Engineer
**Spec**: 086
**Date**: 2026-03-28
**Instructions**: Review the positions below and provide your assessment. The full synthesis is at `research/synthesis.md` if you need deeper context. Do not read other agents' review docs before completing yours.

---

## Position: Knowledge Base Scope

**Proposal**: You'd get an indexed knowledge base for Android-specific source files, making them searchable rather than requiring manual file navigation. Three options:

- **Broad**: Index all of `src/components/core` — every component's files across all platforms
- **Targeted**: Index only `src/components/core/*/platforms/android/` — just Android implementation files
- **Middle Ground**: Android platform files (`platforms/android/`) plus shared `types.ts` and `tokens.ts` per component

Additionally, a Platform Resource Map steering doc would be created so any agent can look up where platform-specific resources live. This would include Android token files at `src/tokens/platforms/android/`.

**Questions**:
1. Which option best matches your workflow? When you're implementing an Android component, do you primarily need the Kotlin files, or do you also reference the shared types and tokens?
2. Would you ever need to see web or iOS implementations for reference?
3. Is there anything else in the component directories you'd want indexed beyond platform files, types, and tokens?
4. Do you need the Android-specific token files (`src/tokens/platforms/android/MotionTokens.kt`, etc.) indexed alongside the component implementations?

---

## My Assessment

### The Recommendation: Middle Ground, with one addition

Middle Ground is the right call. Here's why, grounded in what I actually do when implementing:

**The Kotlin files are my primary reference** — that's where the Composable signatures, parameter types, and platform-specific patterns live. Targeted would cover this.

**But I genuinely need `types.ts` and `tokens.ts`.** I just read through Container-Card-Base's shared files to answer these questions, and they're exactly what I reference during implementation:

- `types.ts` gives me the canonical prop interface — the curated type unions (`CardPaddingValue`, `CardBackgroundValue`, etc.) that my Kotlin implementation must honor. When I'm writing the Composable, I need to know the allowed values and their semantics. The `.android.kt` file implements these types, but `types.ts` is the source of truth for *what* I'm implementing.

- `tokens.ts` gives me the prop-to-token mapping — `padding: '150'` maps to `space.inset.150`, `background: 'surface.primary'` maps to `color.structure.surface.primary`. This is the bridge between Leonardo's spec (which uses prop values) and my Kotlin code (which needs token constants). Without this, I'm reverse-engineering the mapping from the Kotlin source.

So Targeted is too narrow. I'd be searching Kotlin files that reference types and tokens I can't see.

**Broad is wasteful.** I don't need Sparky's Web Component files or Kenya's SwiftUI files cluttering my search results. When I search for "padding" I want hits in my Kotlin implementation and the shared contract — not in three other platform files that solve the same problem differently.

### Answers to the specific questions

**1. Which option best matches your workflow?**

Middle Ground. My implementation workflow is: read Leonardo's spec → check the MCP for component contracts → open `types.ts` to understand the prop interface → open `tokens.ts` to understand the token mapping → open/write the `.android.kt` file. The middle ground indexes exactly the files in that chain.

**2. Would you ever need to see web or iOS implementations for reference?**

Rarely, and when I do, it's a smell — it usually means the shared contract is underspecified and I'm looking at a sibling platform to figure out intended behavior. That's a contract quality issue, not a knowledge base scope issue.

The one legitimate case: when Leonardo flags a cross-platform consistency concern and asks me to check how Kenya or Sparky handled something. But that's infrequent enough that manual file navigation is fine. I don't need it indexed.

**3. Is there anything else in the component directories you'd want indexed?**

Yes — `contracts.yaml`. The contracts file defines the behavioral promises my implementation must honor, including platform-specific notes (which contracts apply to Android vs web-only). The MCP surfaces contract data via `get_component_full`, but having the raw YAML searchable would help when I need to verify a specific validation criterion or check whether a contract is platform-filtered.

However, I want to flag a counter-argument to my own suggestion: adding `contracts.yaml` starts creeping toward Broad. The value is real but marginal — the MCP already gives me contract data in a structured format. If the goal is minimal context cost, skip it. If the goal is self-sufficiency (less MCP round-tripping), include it.

My lean: include it. The file is small (30-50 lines typically) and it's the authoritative source for what my implementation must do.

**4. Do you need Android-specific token files indexed?**

Yes, but with a caveat: there's almost nothing there right now. The Android token directory (`src/tokens/platforms/android/`) contains only `MotionTokens.kt`. The broader token generation pipeline for Android isn't built out yet — no `DesignTokens.android.kt`, no `ComponentTokens.android.kt`.

Index what exists, and the Platform Resource Map should note the current state honestly. When the token pipeline matures and those files appear, they should be in my knowledge base. Motion tokens are already relevant for animation implementation.

### One concern about the Platform Resource Map

The steering doc is a good idea — cross-agent visibility into where platform resources live is genuinely useful. But it needs to stay current. If the Android token pipeline generates new files (which it will as the system matures), the resource map needs to reflect that. Who owns keeping it updated? If it's manual, it'll drift. If it's generated, it's reliable but needs tooling.

Not a blocker — just flagging that a static doc describing a changing filesystem has a shelf life.

### Summary

| Option | My Vote | Reason |
|--------|---------|--------|
| Broad | No | Too much noise from other platforms |
| Targeted | No | Too narrow — missing the shared contract files I actually reference |
| Middle Ground | Yes | Matches my real workflow: Kotlin files + shared types + shared tokens |
| + contracts.yaml | Lean yes | Authoritative behavioral contract source, small files, reduces MCP round-trips |
| + Android token files | Yes | Essential as token pipeline matures, minimal cost now |
