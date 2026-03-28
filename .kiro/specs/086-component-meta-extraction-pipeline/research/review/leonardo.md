# Synthesis Review: Leonardo

**Agent**: Leonardo — Product Architect
**Spec**: 086
**Date**: 2026-03-28
**Instructions**: Review the positions below and provide your assessment. The full synthesis is at `research/synthesis.md` if you need deeper context. Do not read other agents' review docs before completing yours.

---

## Position 1: MCP Scope Split (P3)

**Proposal**: Application MCP focuses on components and component patterns (how DesignerPunk components work and compose). Product MCP focuses on experiences and experience patterns (how screens are designed, information hierarchy, user flow guidance).

Experience patterns would move from the Application MCP to the Product MCP. Component selection guidance stays in the Application MCP but is consumed by the Product MCP when recommending patterns.

**What this means for you**: You'd query the Product MCP for "how do I design a dashboard?" and the Application MCP for "what components exist and what are their constraints?" A product pattern in the Product MCP would reference component assemblies validated by the Application MCP.

**Questions**:
1. Does this split match how you naturally think about screen design vs. component selection?
2. Would querying two MCPs (Product for experience framing, Application for component details) feel like a natural workflow or an unnecessary extra step?
3. Are there cases where you need experience patterns and component details in the same query that this split would break?

---

## Position 2: Knowledge Base Scope

**Proposal**: Platform agents get indexed knowledge bases for their platform's source files. Three options:

- **Broad**: Index all of `src/components/core` — everything including other platforms' code
- **Targeted**: Index only `src/components/core/*/platforms/{your-platform}/` — just your platform files
- **Middle Ground**: Index your platform files plus shared `types.ts` and `tokens.ts` per component

A steering doc ("Platform Resource Map") would also be created so any agent can look up where platform-specific resources live.

**Questions**:
1. As the architect who hands off to platform agents, does the Platform Resource Map help you reference specific implementation locations in your screen specs?
2. Any concerns about the split between "resource map for orientation" and "knowledge base for working access"?

---

## Your Assessment

### Position 1: MCP Scope Split (P3)

**1. Does this split match how you naturally think about screen design vs. component selection?**

Yes, cleanly. When I'm specifying a screen, I'm doing two distinct things in sequence:

First: "What is this screen? What's the information hierarchy? What experience pattern applies?" — that's product thinking. I'm reasoning about the user's task, the content structure, the flow.

Second: "What DesignerPunk components implement this? What are their constraints? How do they compose?" — that's component selection. I'm matching product intent to available building blocks.

These are genuinely different cognitive modes. Right now I query one MCP for both, and the results are a mixed bag — experience patterns (product-level) alongside component metadata (implementation-level). Splitting them would match how I actually think.

**2. Would querying two MCPs feel like a natural workflow or an unnecessary extra step?**

Natural workflow, not an extra step — *if* the Product MCP's response includes enough component context that I don't have to immediately bounce to the Application MCP for basic information.

Here's the scenario I'm worried about: I query the Product MCP for "how do I design a dashboard?" It returns an experience pattern that says "use Container-Card-Base for stat cards." Now I need to know: is Container-Card-Base production-ready on web? What props does it have? Can it compose with Badge-Count-Base? If I have to make three Application MCP queries for every component the pattern references, the split creates friction.

The mitigation is in the synthesis — the Product MCP checks readiness from the Application MCP. If the Product MCP's pattern response includes inline readiness status and basic component summaries (not just names), I'd rarely need to cross-query. If it just returns component names and I have to look everything up myself, it's a tax.

**3. Are there cases where you need experience patterns and component details in the same query that this split would break?**

The main case: `validate_assembly`. Right now I build a component tree informed by an experience pattern, then validate it — all through the Application MCP. If patterns move to the Product MCP but `validate_assembly` stays in the Application MCP, the workflow is: query Product MCP for pattern → build tree → query Application MCP to validate. That's fine — those are sequential steps, not a single query.

The case that *would* break: if I'm iterating on a component tree and need to check "does the experience pattern say this region should have a submit action?" while also checking "does Button-CTA satisfy the submit action requirement?" — that's cross-referencing pattern intent with component capability. Today I can do both in one MCP context. With the split, I'd need to hold the pattern in my context while querying the Application MCP. Manageable, but worth acknowledging.

Overall: **I agree with P3.** The split is conceptually clean and matches my workflow. The risk is friction from cross-MCP lookups, mitigated by the Product MCP including enough inline component context in its responses.

---

### Position 2: Knowledge Base Scope

**1. Does the Platform Resource Map help you reference specific implementation locations in your screen specs?**

Honestly — marginally. When I hand off a screen spec to Kenya or Sparky, I reference components by name, not by file path. I say "use Container-Card-Base with interactive mode," not "see `src/components/core/Container-Card-Base/platforms/web/ContainerCardBase.web.ts`." The platform agents know where their files are.

Where the resource map *would* help me: when I'm doing cross-platform review (like Task 1.5 and 2.3 in spec 085) and need to find and read platform implementations to verify consistency. Right now I glob for files. A resource map would save that step. But that's a review task, not a specification task — it's occasional, not constant.

The resource map's bigger value is for Stacy (parity audits) and Thurgood (test coverage audits) — agents who need to find platform files outside their normal domain. For me, it's a nice-to-have.

**2. Any concerns about the split between "resource map for orientation" and "knowledge base for working access"?**

No concerns — the distinction is clear and correct. The resource map tells you *where* things are. The knowledge base lets you *search* what's there. Different tools for different needs.

On the knowledge base scope question: **I'd recommend the middle ground.** Platform agents reading their implementation files constantly need `types.ts` and `tokens.ts` to understand the API contract. Spec 085 proved this — Lina needed Card's `types.ts` for the enum definitions and `tokens.ts` for the resolve-then-pass maps on every platform. Targeted (platform files only) would be too narrow. Broad (everything) wastes context on other platforms' code that they'll never touch.

---

### Additional Observation

The synthesis mentions that the Product MCP would check the Application MCP for readiness when recommending patterns. This makes the derived readiness model (R2) critical infrastructure for the split — if readiness is stale, the Product MCP recommends components that aren't actually usable. I'd flag this as a hard dependency: the MCP split (P3) shouldn't ship before the readiness model (R2) is reliable. Otherwise the Product MCP is making recommendations based on unreliable data, which is worse than no recommendation at all.
