# Synthesis Review: Sparky

**Agent**: Sparky — Web Platform Engineer
**Spec**: 086
**Date**: 2026-03-28
**Instructions**: Review the positions below and provide your assessment. The full synthesis is at `research/synthesis.md` if you need deeper context. Do not read other agents' review docs before completing yours.

---

## Position: Knowledge Base Scope

**Proposal**: You'd get an indexed knowledge base for web-specific source files, making them searchable rather than requiring manual file navigation. Three options:

- **Broad**: Index all of `src/components/core` — every component's files across all platforms
- **Targeted**: Index only `src/components/core/*/platforms/web/` — just web implementation files
- **Middle Ground**: Web platform files (`platforms/web/`) plus shared `types.ts` and `tokens.ts` per component

Additionally, a Platform Resource Map steering doc would be created so any agent can look up where platform-specific resources live (token files, component implementations, generated output).

**Questions**:
1. Which option best matches your workflow? When you're implementing a web component, do you primarily need the web platform files, or do you also reference the shared types and tokens?
2. Would you ever need to see iOS or Android implementations for reference (e.g., to understand cross-platform intent)?
3. Is there anything else in the component directories you'd want indexed beyond platform files, types, and tokens? (schemas, contracts, READMEs?)
4. Does the Platform Resource Map concept help you find what you need, or is the knowledge base sufficient on its own?

---

## Your Assessment

### Question 1: Which option best matches your workflow?

**Middle Ground**, clearly.

I looked at what I actually touch when implementing. The web files (`platforms/web/*.web.ts` and `*.styles.css`) are the primary target — that's the Custom Element class, the Shadow DOM template, the CSS. That's non-negotiable.

But `types.ts` is where the cross-platform prop interfaces live. Chip-Filter's `types.ts` defines `ChipFilterProps` extending `ChipBaseProps` — that's the canonical prop contract I'm implementing against. The web `.ts` file *consumes* those types; it doesn't redefine them. If I only had the web file, I'd see the implementation but not the interface it's supposed to satisfy.

`tokens.ts` is similarly important. Container-Card-Base's `tokens.ts` has the prop-to-token mapping (`cardPaddingTokenMap`, `cardBackgroundTokenMap`, etc.). The web implementation references these maps. Without them, I'd see `this.tokens.cardPaddingTokenMap[value]` in the web code and not know what it resolves to.

So: web platform files give me the *how*. Shared types and tokens give me the *what* and *with what values*. I need both.

**Targeted** would leave me constantly jumping out of the knowledge base to manually read `types.ts` and `tokens.ts`. That's the exact workflow friction this is supposed to eliminate.

**Broad** would work but it's wasteful. I don't need `ChipFilter.ios.swift` or `ChipFilter.android.kt` indexed for my workflow. That's ~30-50KB of Swift and Kotlin per component that I'd never query. It would add noise to search results and bloat the index for no benefit to me.

### Question 2: Would I ever need iOS or Android implementations?

Rarely, and not in a way that justifies indexing them.

The one scenario: Leonardo's spec says "match the iOS behavior for X" and I need to understand what that behavior actually looks like in code. But that's an edge case — Leonardo should be translating cross-platform intent into his spec, not asking me to reverse-engineer it from sibling platform code. If I need to understand cross-platform intent, the behavioral contracts in the Application MCP already give me that at the right abstraction level.

If I ever do need to peek at an iOS or Android file, I can read it manually. It's a once-in-a-while thing, not a daily workflow. Indexing all three platforms for that edge case would be over-engineering.

### Question 3: Anything else worth indexing?

Two things worth considering:

**`index.ts`** — these are small (typically under 2KB) but they define the Custom Element registration and public exports. For Button-CTA, `index.ts` is where I'd find the tag name registration and what's exported for consumers. That's directly relevant to my "what's the tag name?" gap from the initial research.

**`examples/` directory** (where it exists) — Button-CTA has `BasicUsage.html`, `Variants.html`, `WithIcon.html`. These are concrete usage examples showing the component in action with real HTML. For a web implementer, these are gold — they answer "how do I actually use this thing in markup?" faster than reading the class definition. Not every component has them, but where they exist, they're high-value.

I'd skip schemas, contracts, and READMEs for the knowledge base. Schemas and contracts are already surfaced through the Application MCP (`get_component_full`), and surfacing them in two places creates a "which one is authoritative?" problem. READMEs exist for some components but not others, and their content overlaps with what the MCP provides.

So my ideal scope: `platforms/web/` + `types.ts` + `tokens.ts` + `index.ts` + `examples/` (where present).

HOWEVER — I want to flag a counter-argument to my own recommendation. Adding `index.ts` and `examples/` increases the scope beyond the proposed Middle Ground. If the goal is to keep the knowledge base lean and focused, the Middle Ground as stated (web + types + tokens) covers 90% of my needs. The `index.ts` and `examples/` additions are nice-to-haves, not blockers. I'd rather ship the Middle Ground and add more later than delay for a perfect scope.

### Question 4: Platform Resource Map — helpful or redundant?

Helpful, and for a reason that goes beyond my own workflow.

For me personally, the knowledge base would be sufficient — I know where the web files live because I work with them daily. But the Platform Resource Map serves a different purpose: it's a shared reference that any agent can use without platform-specific knowledge. If Leonardo needs to point Kenya to the iOS token file, or if Thurgood is auditing test coverage across platforms, they shouldn't need to memorize the directory structure.

It also future-proofs against structural changes. If the component directory layout ever changes (e.g., generated output moves, token files get consolidated), the Resource Map is one place to update rather than every agent's mental model.

The key: keep it factual and minimal. A lookup table of "here's where X lives for each platform," not a narrative document. If it's more than a page, it's too much.

### Summary

- **Middle Ground** is the right scope for the knowledge base
- Consider adding `index.ts` and `examples/` if scope allows, but don't block on it
- Don't index iOS/Android — the Application MCP handles cross-platform understanding at the right level
- Platform Resource Map is a good idea, keep it lean
