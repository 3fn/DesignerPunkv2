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

Please provide your honest assessment of each position — agree, disagree, or modify. Flag anything that would make your workflow harder.
