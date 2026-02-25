# Agentic UI Strategy: DesignerPunk as an Agent-Ready Design System

**Date**: 2026-02-24
**Purpose**: Capture strategic thinking on positioning DesignerPunk for agentic UI protocols and agent-driven interface composition
**Organization**: working-document
**Scope**: cross-project

---

## The Core Thesis

Agentic-driven user interfaces are likely to become more normalized. The rate of development, investment, and growth in AI suggests this shift could arrive sooner than conventional timelines assume. The strategic opportunity is to position DesignerPunk to serve this future — not just the present human-authored workflow.

The working theory: we won't explicitly design specific interfaces and layouts so much as we will need to design *structures* — a diverse set of components that provide tools and layouts capable of conveying general and specific contexts and use cases. The agent selects and composes; the design system provides the vocabulary, grammar, and constraints.

---

## A2UI as a Reference Protocol

[A2UI](https://a2ui.org) (v0.8, Apache 2.0, created by Google) is an early-stage protocol for agent-driven interfaces. Its premise: instead of text-only responses or risky code execution, AI agents send declarative component descriptions that clients render using their own native widgets.

Key properties of A2UI:
- Secure by design — declarative data, not executable code
- LLM-friendly — flat, streaming JSON structure
- Framework-agnostic — one agent response renders on Angular, Flutter, React, native mobile
- Progressive rendering — stream UI updates in real-time

A2UI is not the bet. It's a signal. The protocol space for agentic UI is unsettled and A2UI may not win. The strategic move is building toward *agent-legible design systems as a category* — A2UI compatibility becomes one output of that, not the goal itself.

---

## The DTCG Analogy

The strategic pattern here mirrors the DTCG JSON transformer decision: build a canonical, tool-agnostic schema first, then attach specific integrations to it.

DTCG gave DesignerPunk a standard token representation that Figma, Style Dictionary, and other tools can consume without coupling to any one of them. The same logic applies to agentic UI:

- Build a **component catalog schema** — tool-agnostic, machine-readable, describing each Stemma component's purpose, contracts, composition rules, and data expectations
- A2UI becomes one consumer of that schema
- Future agentic UI protocols, LLM tool-use integrations, documentation generators, and design tools become other consumers

Importantly: the schema doesn't change how Stemma components are built internally. It gives the outside world a standardized way to reason about them — the same relationship DTCG has to the Rosetta token system.

---

## What DesignerPunk Needs

### 1. Component Metadata Schema (Foundation)
Structured, tool-agnostic metadata per component describing:
- Purpose and appropriate contexts
- Behavioral contracts (already partially defined in Stemma)
- Composition constraints (what can nest inside what, valid/invalid combinations)
- Data shape expectations
- Accessibility implications

### 2. Composition Rules
A constraint graph describing how components relate to each other. The metadata describes individual components; composition rules describe valid assemblies. This is the grammar on top of the vocabulary.

### 3. Context-to-Component Mapping
A semantic routing layer connecting use case categories to appropriate component combinations. "Show order status" → appropriate component selection. Could be documented patterns or embeddings over the catalog.

### 4. Data Contract Definitions
Formal descriptions of the data each component expects — semantic contracts beyond TypeScript prop types. Bridges the gap between an agent's data model and DesignerPunk's component model.

### 5. Renderer Bridge (per platform)
For A2UI specifically: implementations that map incoming A2UI component descriptions to actual Stemma components on each platform. Web is the most tractable first target.

### 6. Validation and Safety Layer
Verifies that agent-composed UIs are accessible, coherent, and within system bounds. The equivalent of existing token validators but for compositions.

### 7. Feedback Loop Mechanism
Structured signals from rendered UI interactions back to the agent — semantically meaningful actions per component type, grounded in Stemma behavioral contracts.

**Recommended sequencing**: metadata schema → composition rules → data contracts → renderer bridge → validation → feedback loop.

---

## Two MCPs, Two Audiences

This work is best understood as a second MCP alongside the existing documentation MCP:

| | Existing Docs MCP | New Application MCP |
|---|---|---|
| Audience | Agents building DesignerPunk | Agents using DesignerPunk |
| Knowledge | How to build and maintain the system | How to apply and orient the system's offerings |
| Analogy | Internal engineering wiki | Public API reference + usage guidelines for machines |
| Key capability | Documentation lookup | Callable queries ("what components fit this context?") |

The application MCP is not just a documentation artifact — it's callable. An agent can query it: "What components are appropriate for a multi-step process?" "What are the composition constraints for nesting interactive elements in a container?" "What data shape does a progress-stepper expect?" These are tool calls, not documentation lookups.

---

## Why DesignerPunk Is Better Positioned Than Most Systems

Most design systems (Atlassian/Atlaskit, Carbon, Material, Polaris, Encore) were built for human authoring workflows. They're retrofitting toward agent-readiness. DesignerPunk has structural properties that make agent-readiness a natural extension:

**Stemma behavioral contracts are explicit and named.** `focusable`, `validatable`, `float-label`, `error-state` are first-class architectural concepts — not implicit behavior buried in implementation. An agent can reason about them without reading code.

**Rosetta tokens are mathematically derived.** Values aren't arbitrary designer choices — they're computed from a baseline grid with explicit relationships. This makes visual consistency predictable for agent-driven composition.

**True Native Architecture already separates platform concerns at build time.** A2UI's premise is "one description, native rendering everywhere." DesignerPunk already thinks this way structurally.

**Human-AI collaboration is a foundational value.** The system was built with AI as a participant, not just a tool. That disposition matters architecturally.

### Honest comparison to Material Design 3
Material is the strongest of the established systems for this use case — Google has invested in cross-platform consistency and their token system is more rigorous than Carbon or Polaris. The A2UI/Material connection is probably not a coincidence. DesignerPunk's advantage is structural (behavioral contracts, mathematical tokens, True Native Architecture) rather than resource-based.

---

## Incorporate vs. Spin Off

Recommendation: **incorporate into DesignerPunk, don't spin off.**

The component schema and agentic layer derive their value from the underlying system. A fork would need to maintain its own token system, component implementations, and platform targets — two systems in parallel that inevitably drift. The schema is only as good as the components it describes, and those live in DesignerPunk.

The right model: DesignerPunk as source of truth, agentic layer as an output pipeline. Same pattern as DTCG and Figma.

---

## Canvas Tools in an Agentic World

Canvas tools (Figma, Penpot, etc.) shift role rather than relevance in an agentic UI future. They become less central as *production* tools for composing specific interfaces, but remain important as:

- **Communication and intent-expression tools** — humans expressing design intent to agents visually, which is often faster and less ambiguous than prose
- **Visual documentation tools** — diagramming for developing and facilitating shared understanding between humans and agents
- **Production tools for enhancements** — human-authored refinements on top of agent-composed foundations

The Figma extraction pipeline's direction — reading design intent and translating it to component specs — becomes *more* relevant in this world, not less. The human sketches intent in a canvas, the agent reads it and composes from the catalog. Maintaining lines of communication and exchange between humans and AI is critical; we still diagram for developing and facilitating understanding.

---

## Decisions Made

### Q1: Catalog readiness threshold
The threshold is behavioral contract *diversity*, not component quantity. The question is whether existing components exercise enough different contract patterns that the schema design will hold as the catalog grows — not whether all 11 families are complete.

A catalog readiness audit has been initiated to answer this concretely. See `.kiro/specs/XXX-stemma-catalog-readiness-audit/design-outline.md`. Thurgood (audit specialist) should be consulted on methodology and scope before the audit is executed.

### Q2: Generated vs. manually maintained schema
Generated with human-authored semantic annotations and manual confirmation gate. Structural parts (prop types, platform targets, behavioral contract participation) are derived automatically from Stemma definitions. Semantic parts (appropriate contexts, composition guidance, when not to use a component) require human judgment and live as annotations in component definition files. Same governance model as release detection: automation proposes, human approves.

### Q3: First protocol target
Build the generic component catalog schema first, using A2UI compatibility as the validation target. A2UI becomes the first proof-of-concept for the schema's expressiveness — if the schema can produce valid A2UI output, it's expressive enough for other protocols. This follows the exact same pattern as DTCG → Figma: canonical schema first, specific integrations as transformers on top.

The application MCP (callable component catalog) is the immediate deliverable. A2UI renderer bridge follows as the first protocol-specific integration.

### Q4: Figma pipeline interaction
The two pipelines are distinct and should not be conflated:
- Token/variable export → Figma (Rosetta → canvas)
- Design detail extraction → spec (canvas → development)

The component schema improves extraction accuracy as a side effect — if the schema formally describes what each component is for structurally, the extractor can use it as a reference for more confident component mapping decisions. This is an enhancement opportunity, not a dependency.

---

## Integration Methodology

This work follows the integration methodology formalized in `.kiro/steering/Process-Integration-Methodology.md`, derived from the DTCG and agentic UI work as the second implementation of the same pattern. The methodology applies here because A2UI is a 3rd-party integration without explicit install — DesignerPunk connects to it via protocol, and the protocol can change independently.

Key steps as they apply to this work:
1. Research standards (W3C web component metadata, MCP ecosystem, emerging agentic UI specs)
2. Define the canonical component catalog schema (tool-agnostic)
3. Validate against A2UI as the proof-of-concept integration target
4. Build the A2UI renderer as a transformer on top of the schema

---

## Next Steps

1. **Catalog readiness audit** — Consult Thurgood, execute audit, get schema readiness recommendation
2. **Standards research** — Survey relevant standards before schema design (per integration methodology)
3. **Component metadata schema design** — Define the schema structure with A2UI compatibility as validation target
4. **Application MCP** — Build the callable component catalog server
5. **A2UI renderer bridge** — First protocol-specific integration, validates schema expressiveness end-to-end

---

## Related Documentation

- `.kiro/specs/XXX-stemma-catalog-readiness-audit/design-outline.md` — Catalog readiness audit (prerequisite)
- `.kiro/steering/Process-Integration-Methodology.md` — Integration methodology (this work is the second implementation)
- `.kiro/steering/DTCG-Integration-Guide.md` — DTCG format specification (first implementation of the pattern)
- `.kiro/steering/Figma-Workflow-Guide.md` — Figma integration workflow (first integration transformer)
