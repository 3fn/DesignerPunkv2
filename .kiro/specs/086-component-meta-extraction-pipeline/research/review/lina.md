# Synthesis Review: Lina

**Agent**: Lina — Stemma Component Specialist
**Spec**: 086
**Date**: 2026-03-28
**Instructions**: Review the positions below and provide your assessment. The full synthesis is at `research/synthesis.md` if you need deeper context. Do not read other agents' review docs before completing yours.

---

## Position 1: Full Single Source Extraction (Option C)

**Proposal**: All component-meta.yaml fields — including `purpose` and `contexts` — are authored in Component-Family steering docs as structured metadata blocks, then extracted by a build-time script. Meta files become generated artifacts.

**Format in family docs**:
```markdown
### Badge-Count-Base — Metadata
- **Purpose**: Display a numeric count indicator for unread notifications or item quantities in a compact badge
- **Contexts**: navigation-tabs, list-items, icon-overlays, app-bars
```

The alternative (Option B) would derive `usage` and `alternatives` from family docs but keep `purpose` and `contexts` hand-authored in meta files.

**What this means for you**: You'd author all metadata in one place (family docs). No more maintaining meta files separately. The extraction script generates them. You'd have Leonardo's search terms from the research as a reference for writing `purpose` fields.

**Questions**:
1. Does the structured metadata block format work within family docs, or does it feel forced?
2. Would authoring `purpose` in a family doc (with consumer search terms as reference) produce better or worse results than authoring it in the meta file?
3. Is there anything about the current meta file authoring workflow that Option C would lose?
4. For `contexts` — if we define a controlled vocabulary, does it matter whether you pick from that list in a family doc vs. a meta file?

---

## Position 2: Knowledge Base Scope

**Proposal**: Platform agents get indexed knowledge bases. Three options:

- **Broad**: Index all of `src/components/core`
- **Targeted**: Index only `src/components/core/*/platforms/{platform}/`
- **Middle Ground**: Platform files plus shared `types.ts` and `tokens.ts`

**What this means for you**: Platform agents would have searchable access to implementations you've built, reducing "ask Lina" requests and source-diving friction.

**Questions**:
1. From the component author's perspective, is there anything in the component directories that platform agents should NOT have indexed access to? (Draft files, internal notes, etc.)
2. Does the middle ground (platform files + types + tokens) capture what platform agents actually need from your components?

---

## Your Assessment

Please provide your honest assessment of each position — agree, disagree, or modify. Flag anything that would make your workflow harder.

---

## Lina's Responses

### Position 1: Full Single Source Extraction (Option C)

**1. Does the structured metadata block format work within family docs?**

It works. The family docs already have per-component subsections under "Component Schemas" — adding a metadata block per component is a natural extension, not a forced addition. The format is clean: purpose as a one-liner, contexts as a comma-separated list, alternatives as bullet points. It's less verbose than the current YAML format and sits alongside the schema descriptions where it contextually belongs.

One concern: family docs for large families (Form Inputs has 7 components) will get longer. But the metadata blocks are small — maybe 5-8 lines per component. That's manageable.

**2. Would authoring `purpose` in a family doc produce better or worse results?**

Better, for two reasons:

First, context. When I'm writing `purpose` in a standalone meta file, I'm looking at the component in isolation. When I'm writing it in the family doc, I'm looking at it alongside its siblings, the selection table, and the usage guidelines. That context naturally produces better differentiation — I can see what makes this component distinct from its alternatives right there on the page.

Second, review. Family docs go through the ballot measure process. If I write a weak `purpose` field, it gets reviewed alongside the rest of the family guidance. In the current workflow, meta files are authored and committed without that review gate.

The one thing I'd lose is the "agent-optimized" mindset. When I open a meta file, I'm thinking "how will an agent search for this?" When I open a family doc, I'm thinking "how does this family work?" Having Leonardo's search terms as a reference (from the research) would compensate — it gives me the consumer perspective while I'm in the author context.

**3. Anything Option C would lose?**

Nothing meaningful. The meta file authoring workflow has no advantages over authoring in the family doc. The only thing the meta file gives me is a standalone file I can edit without touching a larger document — but that's a convenience, not a quality benefit. And it's the root cause of drift.

One practical note: the extraction script needs to be reliable. If it silently drops a field or misparses a metadata block, the generated meta file will be wrong and I won't notice because I'm not looking at meta files anymore. Validation in the script is important.

**4. For `contexts` — does it matter where I pick from a controlled vocabulary?**

No. If there's a controlled vocabulary, the authoring location is irrelevant — I'm picking from the same list either way. What matters is that the vocabulary exists, not where I reference it. Putting it in the family doc is slightly better because I can see the component's context alongside its siblings and make consistent choices across the family.

### Position 2: Knowledge Base Scope

**1. Anything platform agents should NOT have indexed access to?**

No. Everything in `src/components/core/` is implementation — there are no draft files, internal notes, or sensitive content in component directories. The directory structure is: schema, contracts, types, tokens, platform files, tests, examples, meta, README. All of that is useful to platform agents.

If anything, broader access reduces friction. When Sparky needs to understand how a web component works, they should be able to search the source directly rather than asking me to read it for them.

**2. Does middle ground capture what platform agents need?**

Almost. Platform files + `types.ts` + `tokens.ts` covers the implementation and API contract. But I'd add `contracts.yaml` — platform agents need to know what behavioral contracts their implementation must satisfy. Without contracts, they're implementing from the spec doc alone and might miss a contract that was added after the spec was written.

So my recommendation: **platform files + types.ts + tokens.ts + contracts.yaml**. That's the complete "what do I need to implement this component correctly" package.

The `schema.yaml` is also useful but less critical — the Application MCP already serves assembled schema data via `get_component_full`. Including it wouldn't hurt, but it's redundant with what the MCP provides.
