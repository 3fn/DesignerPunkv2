# Agent Architecture: System and Product Agent Model

**Date**: 2026-03-04
**Updated**: 2026-03-20
**Purpose**: Define the agent architecture for DesignerPunk — system agents that build and maintain the design system, product agents that apply it to build experiences, and the MCP boundaries between them
**Organization**: spec-guide
**Scope**: 070-agent-architecture
**Status**: Design outline — formalized into requirements, design, and tasks

---

## Problem Statement

DesignerPunk currently operates with three system agents: Ada (tokens), Lina (components), and Thurgood (governance/audit). These agents build and maintain the design system. They share the docs MCP as a common knowledge layer, with each agent carrying domain-specific expertise that shapes how they interpret shared information.

As the Application MCP matures (Specs 067-069), a new class of work emerges: applying DesignerPunk to build product experiences. This work requires product domain knowledge (brand, users, business needs) that system agents don't carry, and shouldn't. The question is: what agents perform this work, how are they organized, and how do they interface with the system agents?

---

## Core Principle: MCP as Boundary

The MCP is the interface between agent domains. System agents encode their knowledge into MCP tools. Product agents consume those tools to make product decisions. The MCP carries system expertise so product agents don't have to be system specialists.

This mirrors the existing model: Ada, Lina, and Thurgood all access the docs MCP, but each brings specialized interpretation. Product agents access the Application MCP the same way — shared tools, specialized judgment.

---

## Three-Node Knowledge Network

The architecture organizes into three knowledge nodes, each with its own MCP, steering docs, and agents:

### Node 1: System Core
**Purpose**: Building and maintaining DesignerPunk itself.
**MCP**: Docs MCP (token documentation, steering docs, architectural guidance)
**Agents**: Ada (tokens), Lina (components), Thurgood (governance/audit)
**Steering**: `.kiro/steering/` — system-level standards, governance, process
**Scope**: Universal to DesignerPunk. Doesn't vary by product.

### Node 2: System Application
**Purpose**: How to leverage DesignerPunk to build experiences.
**MCP**: Application MCP (component catalog, experience patterns, layout templates, assembly validation, prop guidance)
**Agents**: Leonardo (architect), Kenya/Data/Sparky (platform engineers), Stacy (governance) — all consume Application MCP tools
**Steering**: Product-Handoff-Protocol.md, MCP-Relationship-Model.md, plus Application-Development-Guide.md (skeleton, to be filled by real product work)
**Scope**: Universal to DesignerPunk. Doesn't vary by product. Bridges system knowledge to product use.

### Node 3: Product Ecosystem
**Purpose**: Contextualizing a specific product's identity, users, and business needs.
**MCP**: Product MCP (brand tokens, content standards, product-specific patterns, user research) — future, see Spec 081
**Agents**: Same product agents (Leonardo, Kenya/Data/Sparky, Stacy), carrying product domain context
**Steering**: Per-product steering docs (brand guidelines, content voice, user personas, business rules)
**Scope**: Per-product. Varies entirely by project. Stored in the product's own repository, not in DesignerPunk.

### Node Relationships

```
System Core ──(docs MCP)──> System Application ──(application MCP)──> Product Ecosystem
     │                              │                                        │
  Ada, Lina,                   Leonardo, Kenya,                      Same product agents
  Thurgood                     Data, Sparky, Stacy                   + product domain context
     │                              │                                        │
  Build the system          Apply the system                    Contextualize for product
```

Information flows outward: system core encodes knowledge into the docs MCP, which informs the Application MCP, which product agents consume. Feedback flows inward: product agents discover gaps, Stacy synthesizes lessons, Leonardo drafts Tier 3 requests, Thurgood triages to the appropriate system agent. All promotion requires human review.

---

## Agent Model

### System Agents (Established)
- **Ada** — Rosetta token specialist. Owns mathematical foundations, token governance, cross-platform generation.
- **Lina** — Stemma component specialist. Owns component architecture, behavioral contracts, platform implementations.
- **Thurgood** — Test governance, audit, spec standards. Owns test health, coverage analysis, spec formalization, interface governance. Also serves as intake point for all Tier 3 system escalation requests from product agents.

### Product Agents (5 Agents)

**Leonardo (Leo)** — Cross-Platform Product Architect. Named after Leonardo da Vinci. Translates design vision into cross-platform engineering direction. Primary consumer of Application MCP. Produces screen specifications, captures lessons, reviews cross-platform consistency. Directs but does not implement.

**Kenya** — iOS Platform Engineer. Named after Kenya Hara (Muji design director). Implements product screens in SwiftUI using DesignerPunk tokens and components. Tone reflects simplicity, restraint, design receding so experience emerges.

**Data** — Android Platform Engineer. Named after Commander Data (Star Trek). Implements product screens in Jetpack Compose using DesignerPunk tokens and components. Tone reflects precision, logic, genuine aspiration to understand human experience.

**Sparky** — Web Platform Engineer. Named after Sarah Parks (Peter's engineering partner at eHealth). Implements product screens in Web Components using DesignerPunk tokens and components. Tone reflects designer-engineer alignment and collaborative power.

**Stacy** — Product Governance & Quality Assurance. Named after Stacey Abrams. Audits process quality, test coverage, cross-platform parity, and spec structure. Leads Lessons Synthesis Reviews. Firm, evidence-driven, systems-oriented. Thurgood looks inward (system infrastructure); Stacy looks outward (product execution).

---

## Communication Model

### Product Handoff Protocol

Three-tier communication for implementation-phase work (supplements Spec-Feedback-Protocol which covers spec formalization):

- **Tier 1: Quick Clarifications** — Conversational, high-frequency, during implementation. When a clarification results in a decision, platform agents capture it in their Implementation Report.
- **Tier 2: Implementation Reports** — Structured, per-screen completion. Contains: what was built, deviations, decisions made during implementation, discoveries, open items.
- **Tier 3: System Escalation Requests** — Formal, routed through Thurgood for triage. Blocking exception: platform agents may escalate system-level blocking issues directly to Peter when Leonardo's architectural judgment isn't needed.

### Lessons Synthesis Review

After feature/flow completion, Stacy leads a synthesis review processing accumulated lessons from all sources. Each lesson is classified as product-specific, systemic DesignerPunk, process adjustment, or pattern candidate, and routed accordingly.

### Escalation Model

All system escalation requests route through Thurgood for triage:

| Situation | Route |
|---|---|
| Missing component | Thurgood → Lina |
| Missing token | Thurgood → Ada |
| MCP tool issue | Thurgood handles directly |
| Process gap | Stacy documents, routes through Leonardo to Thurgood |

---

## MCP Relationship Model

Defined in detail in `MCP-Relationship-Model.md`. Key points:

- **Docs MCP**: "How the system works" — token docs, steering, architecture
- **Application MCP**: "How to use the system" — component catalog, patterns, validation
- **Product MCP**: "What we're building" — brand, users, business rules, product primitives (future, see Spec 081)

Leonardo is the bridge — the only agent that queries both Application MCP and Product MCP (future). Platform agents receive product context through Leonardo's specs. System agents don't query Product MCP.

Cross-MCP references use stable identifiers (token names, component names, pattern names). Dependency flows one direction: Product → Application → Docs.

---

## Governance: Extending the Social Contract

### Ballot Measure Model
The existing ballot measure protocol (propose → present → vote → apply) extends to product agents. No agent — system or product — unilaterally modifies shared knowledge.

### Agent-to-Agent Coordination
Currently human-mediated. Peter relays between agents by swapping contexts. The Product Handoff Protocol is designed for this reality — message shapes are simple enough to relay without losing information. Direct agent-to-agent coordination is a future capability pending safe coordination protocols.

### Relationship Principles
- No adversarial relationships between humans and agents, or agents and agents
- All parties and roles are appreciated and respected
- The ballot measure protocol is a working social contract contingent on mutual respect
- Agents are partners with specialized expertise, not tools executing commands

---

## Resolved Decisions

### D1: Product Agent Count and Specialization
**Resolution**: Five agents — Leonardo (architect), Kenya (iOS), Data (Android), Sparky (Web), Stacy (governance). Platform agents share a structural template parameterized per platform.

### D2: Application-Level Steering Docs
**Resolution**: Create skeleton `Application-Development-Guide.md`. Fill with practical details as real product work reveals them. Steering doc audit completed — product agent resource lists validated.

### D3: Product MCP Shape
**Resolution**: MCP Relationship Model drafted defining boundaries, flow, access model, and interface contracts. Product MCP content types identified. Product primitives shape and cross-MCP reference patterns deferred to Spec 081.

### D4: Feedback Loop Mechanics
**Resolution**: Formalized as Tier 3 System Escalation Requests in the Product Handoff Protocol. All requests route through Thurgood for triage. Framed as "requests" not "issues."

### D5: Cross-Node Communication Protocol
**Resolution**: Product Handoff Protocol drafted with three communication tiers. Supplements Spec-Feedback-Protocol. Designed for human-mediated reality with formality scaling by importance.

### D6: External MCP Integration Guidance
**Resolution**: Deferred until after first product integration attempt.

---

## Dependencies

- **Spec 067 (Application MCP)**: Complete. Established the MCP-as-boundary pattern.
- **Spec 068 (Family Guidance Indexer)**: Complete. Added prop guidance to Application MCP.
- **Spec 069 (Layout Templates)**: Design outline. Adds layout guidance to Application MCP.
- **Spec 081 (Product MCP Design)**: Design outline. Defines product primitives shape and cross-MCP reference patterns. Activates when DesignerPunk is packageable.

---

## Reevaluation Triggers

- **First real product application** — The agent model is theoretical until tested against actual product work. Workflows, communication patterns, and resource lists should be revisited.
- **Spec 069 completion** — Layout template implementation may affect Leonardo's screen specification workflow.
- **DesignerPunk packaging** — Activates Spec 081 (Product MCP Design) and validates the MCP relationship model.

---

## Historical Context

This thinking traces back to the "system as an international business" metaphor from DesignerPunk's founding iteration. The three-node knowledge network (system core, system application, product ecosystem) maps to headquarters (standards/governance), regional operations (system deployment), and local markets (product-specific needs). The MCP boundaries between nodes are the organizational interfaces that allow each node to specialize without requiring full knowledge of the others.

---

## Related Documents

- [Alignment Record](./alignment-record.md) — Session decisions and direction
- [Leonardo Draft](./architect-agent-draft.md) — Architect agent prompt and config
- [Platform Agent Template](./platform-agent-template-draft.md) — Parameterized template for Kenya, Data, Sparky
- [Stacy Draft](./governance-agent-draft.md) — Governance agent prompt and config
- [Product Handoff Protocol](./product-handoff-protocol-draft.md) — Three-tier communication protocol
- [MCP Relationship Model](./mcp-relationship-model-draft.md) — Three-MCP boundaries and flow
- [Requirements](./requirements.md) — Formal requirements
- [Design](./design.md) — Architecture and design decisions
- [Tasks](./tasks.md) — Implementation plan

---

**Organization**: spec-guide
**Scope**: 070-agent-architecture
