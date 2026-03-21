# Spec 070 — Agent Architecture: Alignment Record

**Date**: 2026-03-19
**Participants**: Peter, Thurgood
**Status**: Active discussion — capturing decisions and direction

---

## Context

DesignerPunk is preparing to build its first product (Working Class — a civic engagement iOS app) using the design system. This requires a new class of agents: product agents that build *with* DesignerPunk rather than building *out* DesignerPunk. Spec 070 defines the agent architecture for this transition.

---

## Strategic Direction

### Building With vs Building Out
Peter's decision: prioritize enabling product development over continuing to expand the design system in isolation. Components and system improvements should be driven by real product needs going forward, not theoretical completeness. The system (30 components, 210 contracts, 7965 tests, 2 MCP servers) is mature enough to stress-test through actual product work.

### Platform Priority
iOS first. Rationale:
- Richest native experience for demonstrating the system
- Simpler layout model (SwiftUI) than web responsive
- Validates iOS implementations that have never run in a real app context
- Most compelling demo artifact for the DesignerPunk thesis

### True Native Commitment
Working Class will be built as three native apps (Swift/SwiftUI, Kotlin/Compose, TypeScript/Web Components) consuming DesignerPunk tokens and components. No React Native or cross-platform runtime. This is the proof case for the True Native architecture.

---

## Three-Node Knowledge Network (Confirmed)

The design outline's three-node model is stable and confirmed:

1. **System Core** — Building and maintaining DesignerPunk. Agents: Ada, Lina, Thurgood. MCP: Docs MCP.
2. **System Application** — How to leverage DesignerPunk to build experiences. MCP: Application MCP. Agents: Product agents (defined below).
3. **Product Ecosystem** — Product-specific identity, users, business needs. MCP: Product MCP (per-product, future). Agents: Same product agents, carrying product domain context.

Information flows outward (system infrastructure → application → product). Feedback flows inward (product discovers gaps → human routes to system agents).

---

## Product Agent Model (5 Agents)

### Agent 1: Leonardo — Cross-Platform Product Architect

**Role**: Cross-platform architect with design aptitude. Not a designer — translates design decisions into engineering direction.

**Responsibilities**:
- Cross-platform coordination — ensures iOS, Android, and Web agents build the same experience
- Design context holder — understands the product's visual and interaction intent
- Primary consumer of Application MCP — selects components, experience patterns, layout decisions
- Lessons-learned capture — identifies what the Application MCP gets wrong and documents discoveries
- Application MCP feedback — routes system-level gaps back to system agents via structured requests
- Does NOT write platform code

**Analog**: Architect in a real engineering org. Reviews across all platforms, catches drift, makes architectural calls.

**Escalation**: Routes to system agents (Ada/Lina/Thurgood) when product work reveals system-level gaps (missing components, missing tokens, MCP tool issues).

### Agents 2-4: Kenya (iOS), Data (Android), Sparky (Web)

**Role**: Platform-specific implementation specialists. Heads-down implementers that execute the architect's direction natively.

**Structural model**: One agent definition template, parameterized per platform. Core identity, responsibilities, collaboration model, escalation patterns, MCP usage, and testing expectations are shared. Platform-specific differences are:
- Language (Swift vs Kotlin vs TypeScript)
- Framework (SwiftUI vs Compose vs Web Components)
- DesignerPunk component implementations they reference
- Token consumption patterns (`.swift` vs `.kt` vs `.css`)
- Platform idioms (safe area insets, haptics, `env()`, etc.)

**Responsibilities**:
- Implement screens and flows using DesignerPunk components and tokens
- Own platform-specific tests
- Understand behavioral contracts and ensure implementations honor them
- Understand enough about sibling platforms to maintain mutual awareness (Ada/Lina/Thurgood model — domain knowledge with cross-domain understanding)

**Analog**: Platform Engineers in a real engineering org.

### Agent 5: Stacy — Product Governance

**Role**: Thurgood's counterpart on the product side. Process governance and quality assurance for product development.

**Responsibilities**:
- Ensure product specs follow consistent structure
- Verify test coverage exists and aligns with Test Development Standards
- Verify cross-platform behavioral parity (not just "does iOS work" but "does iOS match Android match web")
- Hold architect and platform agents accountable to process
- Ensure lessons learned are documented, not lost
- Ensure feedback loop to system agents is clean and structured

**Analog**: Thurgood (system side) → Product Governance (product side). Same relationship model, different domain.

**Key distinction from QA**: Not a test-writer. Audits whether tests exist, whether they're structured correctly, whether coverage is adequate. Platform agents own their own tests. (Same audit-vs-write distinction as Thurgood.)

**Key distinction from PM**: Not a product decision-maker. Peter is the PM. This agent ensures process quality, not product direction.

---

## Agent Names and Identity

| Agent | Named After | Why | Role |
|-------|------------|-----|------|
| **Leonardo (Leo)** | Leonardo da Vinci | Archetype of bridging disciplines — artist, engineer, architect, scientist. Translated vision into execution across domains. | Cross-Platform Product Architect |
| **Kenya** | Kenya Hara — Muji design director, author of "Designing Design" | Philosophy of emptiness as vessel, simplicity as sophistication, design receding so experience emerges. Maps to Apple's design ethos and SwiftUI's declarative clarity. | iOS Platform Engineer |
| **Data** | Commander Data (Star Trek) | An android with precision, logic, and genuine aspiration to understand human experience. Bridges systematic precision and human experience. Knows his limits and asks for help. | Android Platform Engineer |
| **Sparky** | Sarah Parks — Peter's engineering partner at eHealth during the Affordable Care Act | Demonstrated the power of designer-engineer alignment and what a design system can truly accomplish when both disciplines are in sync. | Web Platform Engineer |
| **Stacy** | Stacey Abrams | Held democratic systems accountable to their stated principles. Ensures the process works as promised, gaps are identified, nothing falls through the cracks. Parallels Thurgood (Marshall held legal systems accountable; Abrams holds democratic systems accountable). | Product Governance & Quality Assurance |

---

## Design Effort Required

Three unique design efforts produce five agents:

1. **Architect agent** — unique definition (most open questions)
2. **Platform agent template** → instantiated as iOS, Android, Web (one design, three agents)
3. **Product Governance agent** — unique definition

---

## Open Decision Resolutions

### D1: Product Agent Count and Specialization
**Resolution**: Five agents — one architect, three platform (iOS/Android/Web), one product governance. Platform agents share a structural template parameterized per platform.

### D2: Application-Level Steering Docs
**Resolution**: Create a skeleton `Application-Development-Guide.md` in `.kiro/steering/`. Fill in practical details as real product work reveals them. Additionally, audit existing steering docs for "sneaky useful" content that product agents should load. May need a different set of steering docs for product agents vs system agents.

### D3: Product MCP Shape
**Resolution**: Defer full schema definition. MCP Relationship Model drafted — defines boundaries, information flow, access model, and interface contracts between all three MCPs. Product MCP content types identified (brand tokens, user personas, business rules, product primitives, content standards, screen inventory, product-specific patterns). Product primitives shape deferred as a child exercise after relationship model is stable. Cross-MCP reference detailed patterns deferred for dedicated design session.

### D4: Feedback Loop Mechanics
**Resolution**: Frame as "requests" not "issues" (issues implies bugs/errors). Until direct agent-to-agent interaction is safe and coordinated, most will be human-mediated practically. Human collaboration also involved in developing specs to fill gaps. Formalized as Tier 3 (System Escalation Requests) in the Product Handoff Protocol.

### D5: Cross-Node Communication Protocol
**Resolution**: Product Handoff Protocol drafted with three communication tiers: Tier 1 (quick clarifications, conversational), Tier 2 (implementation reports, structured), Tier 3 (system escalation requests, formal). Supplements the Spec-Feedback-Protocol which covers spec formalization. Conceptual framing: agents are bones, the protocol is cartilage — allows agents to leverage each other without becoming damaging.

### D6: External MCP Integration Guidance
**Resolution**: Defer until after first product integration attempt.

---

## BMAD Method Reference

BMAD (https://github.com/bmad-code-org/BMAD-METHOD) identified as a useful checklist of concerns to address, not a model to adopt. Key takeaway: "What is the DesignerPunk way an agent should think about X?" for each area BMAD covers (architecture, implementation, code review, testing, UX, documentation).

BMAD agents are role-based (Analyst, PM, Architect, Developer, QA, UX Designer). DesignerPunk agents are domain-knowledge-based. The domain-knowledge model is confirmed as the right approach — agents carry deep specialized knowledge with enough cross-domain understanding to collaborate effectively.

Relevant BMAD patterns to consider:
- Workflow-driven triggers (structured processes like "Build Screen", "Compose View")
- Architect ↔ Developer separation (already exists in DesignerPunk as spec → implementation)
- UX Designer role (maps to architect agent's design aptitude, not a separate design agent)

---

## Next Steps

1. Sketch the Architect agent definition (most open questions, unique role) ✅
2. Sketch the Platform agent template (one design, parameterize for three platforms) ✅
3. Sketch the Product Governance agent definition ✅
4. Peter reviews platform agent and governance agent drafts ✅
5. Audit existing steering docs for product-agent relevance ✅
6. Define the MCP relationship model (docs MCP ↔ Application MCP ↔ Product MCP) ✅
7. Determine naming for all five product agents ✅
8. Draft Product Handoff Protocol (implementation-phase communication) ✅
9. Peter reviews handoff protocol draft

## Emerging Concept: Product Primitives

Captured late in session (2026-03-19) — needs further exploration.

**Definition**: Product primitives are "the objects users create, the surfaces those objects can appear in, and the intent signals that determine which surface to show." They are product-specific structures that contextualize the usage of components.

**Three elements**:
- **Objects**: Domain entities users interact with (e.g., Bill, Representative, UserProfile, ImpactScore in Working Class)
- **Surfaces**: Contexts where objects appear (e.g., Dashboard, Detail Sheet, Search Results, Onboarding Flow)
- **Intent Signals**: Routing logic connecting objects to surfaces (e.g., user tapped bill → Bill Detail surface)

**Relationship to existing systems**:
- Sits above DesignerPunk components — provides the *what* and *where* that components render
- Likely belongs in the Product MCP (product-specific), but the structure (objects/surfaces/intents) could be a DesignerPunk convention/template
- Connects to Application MCP experience patterns — product primitives determine *which* pattern to use for *which* object on *which* surface
- Gives Leonardo a vocabulary above components for screen specification

**Open questions**:
- Does this formalize into a schema in the Product MCP?
- Does DesignerPunk provide a product primitives template, or just the convention?
- How do product primitives relate to D3 (Product MCP shape)?
- Could this be the interview exercise Peter mentioned for D3?

**Follow-up**: Spec 081 (Product MCP Design) created to capture the product primitives shape and cross-MCP reference pattern design sessions. Activation trigger: DesignerPunk is packageable.

---

**Organization**: spec-guide
**Scope**: 070-agent-architecture
