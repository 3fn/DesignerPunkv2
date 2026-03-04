# Agent Architecture: System and Product Agent Model

**Date**: 2026-03-04
**Purpose**: Define the agent architecture for DesignerPunk — system agents that build and maintain the design system, product agents that apply it to build experiences, and the MCP boundaries between them
**Organization**: spec-guide
**Scope**: 070-agent-architecture
**Status**: Design outline — exploratory, capturing early architectural thinking

---

## Problem Statement

DesignerPunk currently operates with three system agents: Ada (tokens), Lina (components), and Thurgood (governance/audit). These agents build and maintain the design system. They share the docs MCP as a common knowledge layer, with each agent carrying domain-specific expertise that shapes how they interpret shared information.

As the Application MCP matures (Specs 067-069), a new class of work emerges: applying DesignerPunk to build product experiences. This work requires product domain knowledge (brand, users, business needs) that system agents don't carry, and shouldn't. The question is: what agents perform this work, how are they organized, and how do they interface with the system agents?

---

## Core Principle: MCP as Boundary

The MCP is the interface between agent domains. System agents encode their knowledge into MCP tools. Product agents consume those tools to make product decisions. The MCP carries system expertise so product agents don't have to be system specialists.

This mirrors the existing model: Ada, Lina, and Thurgood all access the docs MCP, but each brings specialized interpretation. Product agents would access the Application MCP the same way — shared tools, specialized judgment.

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
**Agents**: TBD — product-facing agents that consume Application MCP tools
**Steering**: TBD — application-level guidance (how to use patterns, when to deviate, layout principles)
**Scope**: Universal to DesignerPunk. Doesn't vary by product. Bridges system knowledge to product use.

### Node 3: Product Ecosystem
**Purpose**: Contextualizing a specific product's identity, users, and business needs.
**MCP**: Product MCP (brand tokens, content standards, product-specific patterns, user research)
**Agents**: TBD — product-specific agents carrying domain knowledge
**Steering**: Per-product steering docs (brand guidelines, content voice, user personas, business rules)
**Scope**: Per-product. Varies entirely by project. Stored in the product's own repository, not in DesignerPunk.

### Node Relationships

```
System Core ──(docs MCP)──> System Application ──(application MCP)──> Product Ecosystem
     │                              │                                        │
  Ada, Lina,                   Product agents                         Product agents
  Thurgood                     (application)                          (product domain)
     │                              │                                        │
  Build the system          Apply the system                    Contextualize for product
```

Information flows outward: system core encodes knowledge into the docs MCP, which informs the Application MCP, which product agents consume. Feedback flows inward: product agents discover gaps (component gaps, missing patterns, layout needs), humans coordinate promotion of discoveries into system knowledge.

---

## Agent Model: What Emerges from the Work

### System Agents (Established)
- **Ada** — Rosetta token specialist. Owns mathematical foundations, token governance, cross-platform generation.
- **Lina** — Stemma component specialist. Owns component architecture, behavioral contracts, platform implementations.
- **Thurgood** — Test governance, audit, spec standards. Owns test health, coverage analysis, spec formalization, interface governance.

### Product Agents (Emerging)
The specific product agent roles should emerge from real application attempts rather than being pre-designed. The Application MCP's full scope (after 068 prop guidance and 069 layout templates) will reveal the natural specializations.

Candidate specializations observed so far:
- **Layout** — Spatial and responsive reasoning. Page framing, grid composition, breakpoint behavior. Consumes layout templates and responsive tokens.
- **Experience** — Component selection, assembly, and configuration. Consumes experience patterns, prop guidance, assembly validation.

Whether these are two agents or one generalist agent is deferred until the Application MCP scope is complete and a real product application attempt reveals the actual context load.

---

## Governance: Extending the Social Contract

### Ballot Measure Model
The existing ballot measure protocol (propose → present → vote → apply) extends to product agents. No agent — system or product — unilaterally modifies shared knowledge. This applies to:
- System steering docs (existing governance)
- Application-level guidance (new — when it exists)
- Product steering docs (per-product governance)

### Escalation Model
Product agents escalate to system agents when they encounter system-level issues:

| Situation | Escalates to |
|---|---|
| Missing component for a use case | Lina (component gap) |
| No token exists for a needed value | Ada (token gap) |
| Assembly validation fails unexpectedly | Thurgood (MCP tool audit) |
| Layout template doesn't fit the use case | Free-form is acceptable; promote to template if generalizable |

### Agent-to-Agent Coordination
Currently human-mediated. Thurgood flags a test gap for Lina; Peter coordinates the handoff. This model extends to product-to-system escalation: a product agent discovers a component gap, a human reviews and routes to Lina.

Direct agent-to-agent coordination (without human mediation) is a future capability. The ballot measure model provides the social contract foundation, but unbound agent behavior carries the same risks as unbound human behavior. Human-in-the-loop remains the default until coordination protocols are proven safe.

### Relationship Principles
- No adversarial relationships between humans and agents, or agents and agents
- All parties and roles are appreciated and respected
- The ballot measure protocol is a working social contract contingent on mutual respect
- Agents are partners with specialized expertise, not tools executing commands

---

## Open Decisions

### D1: Product Agent Count and Specialization
One generalist product agent or multiple specialists (layout + experience)? Deferred until Application MCP scope is complete (post-068, post-069) and a real product application attempt reveals the context load.

### D2: Application-Level Steering Docs
What guidance do product agents need beyond MCP tools? Where does it live? Likely in DesignerPunk's repo (since it's system-application knowledge, not product-specific), but the format and scope are undefined.

### D3: Product MCP Shape
What does a product-level MCP look like? Brand tokens, content standards, user personas — how are these structured for agent consumption? This is per-product and outside DesignerPunk's scope, but DesignerPunk could provide a template or convention.

### D4: Feedback Loop Mechanics
How do product agent discoveries (component gaps, useful layouts, new patterns) get promoted into system knowledge? Currently human-mediated. The process needs definition — is it a formal proposal? A pattern interview? An automated suggestion pipeline?

### D5: Cross-Node Communication Protocol
How do agents in different nodes communicate? Today it's human-mediated context switching (swap agents, relay information). Future state might involve structured handoff protocols. Depends on tooling maturity.

### D6: External MCP Integration Guidance
DesignerPunk does not create product MCPs, but should provide integration guidance — an API contract describing how external MCPs (like a product MCP) can align with DesignerPunk's conventions. This includes token hierarchy expectations, assembly node schema, context values for `find_components`, and escalation conventions for flagging gaps back to the system.

The actual guide should be deferred until after the first real product integration attempt, so the guidance is grounded in evidence rather than designed in the abstract.

---

## Dependencies

- **Spec 067 (Application MCP)**: Complete. Established the MCP-as-boundary pattern.
- **Spec 068 (Family Guidance Indexer)**: In progress. Adds prop guidance to Application MCP.
- **Spec 069 (Layout Templates)**: Design outline. Adds layout guidance to Application MCP.
- **First product application attempt**: The real test. Agent model should be validated against actual product work.

---

## Reevaluation Triggers

This design outline should be reevaluated after:
- **Spec 068 completion** — Family guidance indexer outcomes may reveal how much domain knowledge product agents need to carry vs. how much the MCP can encode. This directly affects D1 (agent count and specialization).
- **Spec 069 completion** — Layout template implementation will clarify the boundary between spatial reasoning and component reasoning, informing whether layout and experience are one agent's job or two.
- **First real product application** — The agent model is theoretical until tested against actual product work. All open decisions should be revisited after the first attempt.

---

## Historical Context

This thinking traces back to the "system as an international business" metaphor from DesignerPunk's founding iteration. The three-node knowledge network (system core, system application, product ecosystem) maps to headquarters (standards/governance), regional operations (system deployment), and local markets (product-specific needs). The MCP boundaries between nodes are the organizational interfaces that allow each node to specialize without requiring full knowledge of the others.
