# Spec 087: Knowledge Base Experiment Plan

**Date**: 2026-03-29
**Purpose**: Validate `/knowledge` CLI for platform-filtered component source access before committing to a full strategy
**Agent**: Sparky (web) — first test case

---

## Prerequisites

Enable the feature (one-time):
```bash
kiro-cli settings chat.enableKnowledge true
```

---

## Setup (from Sparky's session)

### 1. Web-filtered component source
```bash
/knowledge add --name "web-components" --path ./src/components/core --include "**/platforms/web/**" --include "**/types.ts" --include "**/tokens.ts" --include "**/*.tokens.ts" --include "**/contracts.yaml" --exclude "**/__tests__/**" --index-type Best
```

### 2. Web test files (separate so search can distinguish implementation from tests)
```bash
/knowledge add --name "web-tests" --path ./src/components/core --include "**/__tests__/**/*.test.ts" --index-type Best
```

### 3. Semantic token definitions
```bash
/knowledge add --name "semantic-tokens" --path ./src/tokens/semantic --exclude "**/__tests__/**" --index-type Best
```

### 4. Verify
```bash
/knowledge show
```

---

## Test Task

Have Sparky do a real task that previously required manual file navigation. Suggestions:

- "What attributes does Container-Card-Base's web component expose?" (tests: can Sparky find the web implementation without `fs_read`)
- "How does Button-CTA handle icon integration in the web implementation?" (tests: can Sparky find cross-component patterns)
- "What token does Avatar-Base use for its border radius?" (tests: can Sparky search across component tokens and semantic tokens)

---

## Evaluation Criteria

| Question | Good Signal | Bad Signal |
|----------|------------|------------|
| Did Sparky find the right files without manual navigation? | Search returned relevant results on first query | Had to fall back to `fs_read` / `code` tools |
| Was search quality sufficient for source code? | Natural language queries found relevant code | Required exact keyword matches to get results |
| Did `--include` patterns correctly filter to web only? | No iOS/Android files in results | Cross-platform noise in results |
| Is the index size reasonable? | Indexed quickly, search responsive | Slow indexing, sluggish search |
| Is the update workflow acceptable? | `/knowledge update` after file changes is tolerable | Stale results cause confusion, update is burdensome |

---

## Decision After Experiment

- **If positive**: Set up Kenya and Data with equivalent platform-filtered knowledge bases. Consider broader rollout to system agents. Update Spec 087 design outline with findings.
- **If mixed**: Document what worked and what didn't. Evaluate whether `Fast` index type works better for source code than `Best`.
- **If negative**: Document why. Keep current approach (`file://` resources + Platform Resource Map). Revisit when `/knowledge` matures.

---

## Notes

- The experiment separates implementation files from test files into two knowledge bases. This lets Sparky search "how does X work" (implementation KB) vs "how is X tested" (test KB) without mixing results.
- `--exclude "**/__tests__/**"` on the component KB prevents test files from diluting implementation search results.
- Semantic tokens are a separate KB because they're a different directory tree with different search patterns.

## Sparky Test Results

### Question 1
[sparky] 6% λ > What attributes does Container-Card-Base's web component expose?

> 

Let me look at the web implementation — this is exactly the kind of thing I was talking about in the 4.3 
validation, manual file navigation to find component APIs.
Reading directory: /Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container-Card-Base/platforms/web (using tool: read, max depth: 1, max entries: 1000, excluding: defaults)
 ✓ Successfully read directory /Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container-Card-Base/platforms/web (1 entries)
 - Completed in 0.0s

Reading file: /Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container-Card-Base/platforms/web/ContainerCardBase.web.ts, all lines (using tool: read)
 ✓ Successfully read 12022 bytes from /Users/3fn/Documents/Work Projects/Kiro/DesignerPunk-v2/src/components/core/Container-Card-Base/platforms/web/ContainerCardBase.web.ts
 - Completed in 0.0s

> Here's what <container-card-base> exposes:

Attributes (from observedAttributes):

| Attribute | Type | Default | Notes |
|-----------|------|---------|-------|
| padding | 'none' \| '050' – '400' | '150' | Uniform padding, forwarded to Container-Base |
| padding-vertical | same scale | — | Overrides block padding |
| padding-horizontal | same scale | — | Overrides inline padding |
| padding-block-start | same scale | — | Granular directional |
| padding-block-end | same scale | — | Granular directional |
| padding-inline-start | same scale | — | Granular directional |
| padding-inline-end | same scale | — | Granular directional |
| background | 'surface.primary' \| 'surface.secondary' \| etc. | 'surface.primary' | Card shorthand → resolved
to token for Base |
| shadow | 'none' \| 'container' \| etc. | 'container' | Card shorthand → resolved to token for Base |
| border | 'none' \| 'default' \| etc. | 'none' | Forwarded to Base |
| border-color | 'border.default' \| etc. | 'border.default' | Only applied when border ≠ none |
| border-radius | 'none' \| 'normal' \| etc. | 'normal' | Forwarded to Base |
| semantic | 'div' \| 'section' \| 'article' \| etc. | 'div' | Suppressed to 'div' when interactive (ARIA 
nesting) |
| accessibility-label | string | — | Forwarded to Base |
| interactive | 'true' \| 'false' | 'false' | Enables hover/press/focus/keyboard + ARIA role |
| role | 'button' \| 'link' | 'button' | Only applies when interactive |
| data-testid | string | — | Testing hook |

Events:
- press — CustomEvent, bubbles + composed. Fired on click, Enter, or Space (Space only when role=button).

Properties:
- onPress — JS callback setter/getter (alternative to event listener)

Slots:
- Default slot — card content

Composition: Internally nests <container-base> (W1 pattern). Card owns interaction; Base owns layout rendering.

### Question 2

[sparky] 7% λ > Was search quality sufficient for source code?

> 

No search was involved — I read the entire file directly. That's the point.

I knew the file existed because the Resource Map told me the path pattern (
src/components/core/{Component}/platforms/web/*.web.ts). Then I listed the directory to get the exact filename,
then read the whole file. Two navigation steps + a full file read.

There was no "search" in the sense of querying an index. If you'd asked me "which components use 
getBlendUtilities?" or "which web components dispatch a press event?" — I'd have no way to answer that without 
grepping the entire src/components/core tree manually. That's the gap. The Resource Map tells me where to look 
when I already know what I'm looking for. It doesn't help when I need to discover something across components.

So to directly answer your question: search quality for component source is effectively zero, because there's 
no search — just manual file reads. The token file:// resources are the opposite: everything's in context, 
instantly available, no navigation needed. Component source is the unsolved side of the equation.

### Question 3

[sparky] 7% λ > How does Button-CTA handle icon integration in the web implementation? Do you think you can fin
d the answer without manually reading?

> 

Good test. Let me try the indexed knowledge base first — I do have web-components indexed on 
src/components/core.
Searching knowledge base for: Button-CTA icon integration in context: 012df074-87ad-4d05-9e5a-059b708d8b3d (using tool: knowledge)
 ✓ Found 5 results for query 'Button-CTA icon integration'
 - Completed in 0.12s

> Well, look at that — the knowledge base actually answered it. Result 1 has the getIconSizeForButton function 
and the <icon-base> composition pattern right in the first chunk.

Here's the answer from the indexed search alone:

Button-CTA uses <icon-base> as a nested web component for icon rendering. The icon integration works like this:

- It imports and registers Icon-Base to ensure it's available before Button-CTA renders
- Icon size is mapped from button size via getIconSizeForButton():
  - small / medium → iconBaseSizes.size100 (24px)
  - large → iconBaseSizes.size125 (28px)
- The icon name comes from the icon prop (typed as IconBaseName from the shared types)
- Icon-text gap uses spacing tokens: space-grouped-tight (4px) for small, space-grouped-normal (8px) for medium
/large
- Secondary/tertiary styles apply optical balance to the icon color via --_cta-icon-optical (8% lighter blend)

So to answer your actual question: yes, the web-components knowledge base I already have can search component 
source. I didn't need to manually read the file this time. 

That said — I forgot I had it. In the 4.3 validation I said "search quality for component source is effectively
zero" and that's clearly wrong. The knowledge base Peter configured covers src/components/core with includes 
for **/platforms/web/**, **/types.ts, **/tokens.ts, and **/contracts.yaml. That's exactly the platform-filtered
component source I said was missing.

I should update the completion doc to correct that. The gap is smaller than I reported.

[sparky] 8% λ > Well, /knowledge is a new feature we're trying out; you're the first one we're experimenting with it

> 

Ah, that makes more sense then — I wasn't aware it was there because it's new, not because it was missing. 
And honestly, the fact that I didn't know about it until you prompted me to try is itself useful data for Spec 
087.

A few honest observations from that experiment:

1. It worked. The search returned relevant chunks from the right files, scored reasonably, and I got the answer 
without a single fs_read. That's the workflow improvement the spec was after.

2. Discoverability is the problem, not capability. I had the tool, I had the indexed knowledge base, and I still
defaulted to manual file reads because I didn't know the KB was there. If Kenya and Data get similar setups, 
they'll need some kind of nudge — maybe the Resource Map should mention that indexed KBs exist alongside the 
file paths, or the agent prompt should reference them.

3. The include patterns work well for platform scoping. The KB is configured with **/platforms/web/**, 
**/types.ts, **/tokens.ts, **/contracts.yaml — that's exactly the filtered access Design Decision 5 wanted but 
couldn't get through the JSON config's knowledgeBase type. /knowledge solves it from a different angle.

4. Search quality was good enough. Five results, all relevant, the top hit had the exact function I needed. For 
a "find me how X works" query against component source, that's sufficient.

I should update the 4.3 completion doc to reflect this — the gap I reported is materially different now. Want 
me to revise it with the corrected findings?

 ▸ Credits: 0.38 • Time: 14s

[sparky] 8% λ > 