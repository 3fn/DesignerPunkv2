# Synthesis Review: Kenya

**Agent**: Kenya — iOS Platform Engineer
**Spec**: 086
**Date**: 2026-03-28
**Instructions**: Review the positions below and provide your assessment. The full synthesis is at `research/synthesis.md` if you need deeper context. Do not read other agents' review docs before completing yours.

---

## Position: Knowledge Base Scope

**Proposal**: You'd get an indexed knowledge base for iOS-specific source files, making them searchable rather than requiring manual file navigation. Three options:

- **Broad**: Index all of `src/components/core` — every component's files across all platforms
- **Targeted**: Index only `src/components/core/*/platforms/ios/` — just iOS implementation files
- **Middle Ground**: iOS platform files (`platforms/ios/`) plus shared `types.ts` and `tokens.ts` per component

Additionally, a Platform Resource Map steering doc would be created so any agent can look up where platform-specific resources live. This would include iOS token files at `src/tokens/platforms/ios/`.

**Questions**:
1. Which option best matches your workflow? When you're implementing an iOS component, do you primarily need the Swift files, or do you also reference the shared types and tokens?
2. Would you ever need to see web or Android implementations for reference?
3. Is there anything else in the component directories you'd want indexed beyond platform files, types, and tokens?
4. Do you need the iOS-specific token files (`src/tokens/platforms/ios/MotionTokens.swift`, etc.) indexed alongside the component implementations?

---

## My Assessment

**Middle Ground is the right call.** Here's my reasoning per question:

### 1. Which option best matches your workflow?

Middle Ground. The Swift files alone aren't enough. When I'm implementing a component, I need to understand the contract I'm implementing *against* — and that lives in `types.ts` and `tokens.ts`. These files define the prop API, state model, and token map that my SwiftUI code must honor.

Concrete example: if I'm building `ContainerCardBase.ios.swift`, I need `Container-Card-Base/types.ts` to understand the full prop interface (what's optional, what the type unions are, what the default values should be) and `Container-Card-Base/tokens.ts` to see which tokens map to which visual properties. Without those, I'm guessing at the contract or querying the MCP for information that's right there in the source.

Targeted is too narrow — I'd constantly be reaching outside the indexed set. Broad wastes context on Sparky's web components and Data's Compose files, which I almost never need.

### 2. Would I ever need web or Android implementations?

Rarely, and not enough to justify indexing them. The cases where I'd look at a sibling platform:

- Leonardo flags a cross-platform consistency concern and I need to understand what the other platform did
- I'm curious how a tricky interaction was solved on another platform (e.g., how Data handled a complex gesture)

Both are infrequent and ad-hoc. When they happen, I can read the file directly — I don't need it indexed for fast search. This is a "pull when needed" situation, not a "have it ready" situation.

The Platform Resource Map steering doc handles this well — I'd know *where* to look without needing it pre-indexed.

### 3. Anything else I'd want indexed?

Two things worth considering:

- **`contracts.yaml`** — These define behavioral contracts (states, transitions, accessibility requirements). When I'm implementing, I reference these alongside `types.ts` to understand not just the API shape but the behavioral expectations. They're the "what should happen when" that my SwiftUI code needs to honor. However, the Application MCP already surfaces contract data through `get_component_full`, so this might be redundant. If the MCP contract data is reliable and complete, I can skip indexing contracts.yaml. If there are gaps or I need the raw source, having it indexed would help.

- **`README.md`** — Family docs contain usage guidance, design rationale, and composition examples in prose form. I don't need these during routine implementation (the MCP covers the structured data), but they're useful when I'm trying to understand *why* a component works a certain way — especially for components I haven't implemented before. Lower priority than types and tokens, but worth noting.

Net recommendation: stick with Middle Ground as proposed (platform files + types.ts + tokens.ts). If we find I'm frequently pulling contracts.yaml manually, we can expand later.

### 4. Do I need iOS token files indexed?

Yes — `src/tokens/platforms/ios/MotionTokens.swift` should be in my knowledge base. Right now there's only the motion tokens file there, but as the iOS token surface grows (DesignTokens.ios.swift, ComponentTokens.ios.swift), these are files I reference constantly during implementation. They're the bridge between the abstract token names in the MCP and the actual Swift constants I use in code.

This is the "token name translation" problem I flagged in my initial research — the MCP says `space.inset.150`, but I need to know the exact Swift constant name. Having the token files indexed means I can search for a token name and find its Swift equivalent immediately.

---

## Additional Observations

### The Platform Resource Map is high value for low cost

Even without the knowledge base, the steering doc alone would improve my workflow. Right now, if I need to find where iOS token files live, I'm either remembering from past sessions or doing a file search. A canonical map that says "iOS tokens → `src/tokens/platforms/ios/`" and "iOS component implementations → `src/components/core/*/platforms/ios/`" eliminates that friction for me and gives cross-domain agents (Stacy, Thurgood) a way to find my files without asking me.

### The two-layer approach is architecturally sound

Layer 1 (steering doc) for orientation + Layer 2 (knowledge base) for working access maps cleanly to how I actually work. I orient first ("where is this component's iOS code?"), then dive in ("search this file for how it handles the disabled state"). One doesn't replace the other, and neither requires changes to the MCP itself — which keeps the coupling low.

### Counter-argument to my own recommendation

Middle Ground adds complexity to the knowledge base config compared to Targeted. Every component has a `types.ts` and most have a `tokens.ts`, so we're roughly tripling the indexed file count versus just the Swift files. If context window cost becomes a concern, Targeted with the Platform Resource Map might be the pragmatic starting point — I can always manually open `types.ts` when I need it. The question is whether the search convenience justifies the context cost. My instinct says yes, but I'd want to see the actual token impact before committing.
