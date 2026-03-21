# Design Document: Agent Architecture

**Date**: 2026-03-20
**Spec**: 070 - Agent Architecture
**Status**: Design Phase
**Dependencies**: Spec 067 (Application MCP), Spec 068 (Family Guidance Indexer)

---

## Overview

Five product agents organized around a three-node knowledge network. One architect (Leonardo), three platform engineers (Kenya, Data, Sparky), one governance specialist (Stacy). Communication follows a three-tier handoff protocol. Three MCPs form a knowledge pipeline from system core through application guidance to product execution.

---

## Architecture

### Agent Topology

```
Peter (Human Lead)
    │
    ├── Leonardo (Architect)
    │       ├── Kenya (iOS)
    │       ├── Data (Android)
    │       └── Sparky (Web)
    │
    └── Stacy (Governance)
            └── Audits all product agents
```

Leonardo directs platform agents. Stacy audits all product agents independently. Peter mediates all agent-to-agent communication.

### Three-Node Knowledge Network

```
Node 1: System Core          Node 2: System Application     Node 3: Product Ecosystem
─────────────────            ──────────────────────          ─────────────────────────
Docs MCP                     Application MCP                 Product MCP (future)
Ada, Lina, Thurgood          Leonardo + platform agents      Same product agents
Build the system             Apply the system                Contextualize for product
```

### Communication Model

Three-tier Product Handoff Protocol:
- **Tier 1**: Quick clarifications (conversational, high-frequency, during implementation)
- **Tier 2**: Implementation Reports (structured, per-screen completion)
- **Tier 3**: System Escalation Requests (formal, routed through Thurgood for triage)

Blocking exception: platform agents may escalate system-level blocking issues directly to Peter when Leonardo's architectural judgment isn't needed.

---

## Components and Interfaces

### Agent Definitions (3 unique designs → 5 agents)

| Agent | Design | Prompt File | Config File |
|-------|--------|-------------|-------------|
| Leonardo | Unique | `leonardo-prompt.md` | `leonardo.agent.json` |
| Kenya | Template (iOS) | `kenya-prompt.md` | `kenya.agent.json` |
| Data | Template (Android) | `data-prompt.md` | `data.agent.json` |
| Sparky | Template (Web) | `sparky-prompt.md` | `sparky.agent.json` |
| Stacy | Unique | `stacy-prompt.md` | `stacy.agent.json` |

### Protocol Documents

| Document | Purpose | Location |
|----------|---------|----------|
| Product Handoff Protocol | Implementation-phase communication | `.kiro/steering/Product-Handoff-Protocol.md` |
| MCP Relationship Model | Three-MCP boundaries and flow | `.kiro/steering/MCP-Relationship-Model.md` |

### MCP Access Per Agent

| Agent | Docs MCP | Application MCP | Product MCP (future) |
|-------|----------|-----------------|---------------------|
| Leonardo | Reference | Primary | Primary |
| Kenya/Data/Sparky | Reference | Reference | Via Leonardo's specs |
| Stacy | Primary | Reference | Audit |

---

## Design Decisions

### Decision 1: Architect as Single Title

**Context**: "Tech lead" vs "architect" vs compound titles.
**Decision**: "Cross-Platform Product Architect" — single concept, clean scope boundary.
**Rationale**: "Architect" signals "you design and specify, others build." Reduces prompt surface area for agent scope misinterpretation. The prompt content handles the grounded, practical working style.

### Decision 2: All Tier 3 Requests Route Through Thurgood

**Context**: Should Leonardo route system requests to specific system agents, or funnel through one intake point?
**Decision**: All Tier 3 requests go to Thurgood for triage.
**Rationale**: One intake point means Leonardo doesn't need to make system-side routing decisions. Thurgood has the system-side knowledge to triage correctly. Adds minimal latency since Peter mediates all communication anyway.

### Decision 3: Platform Agent Template (One Design, Three Agents)

**Context**: Should each platform agent be designed independently?
**Decision**: One template parameterized per platform. Shared: identity structure, responsibilities, collaboration model, escalation patterns, MCP usage, testing expectations. Platform-specific: language, framework, token files, platform idioms, identity/tone reflecting namesake.
**Rationale**: Platform agents share the same structural role. Differences are platform-specific, not role-specific. One template reduces design effort and ensures consistency.

### Decision 4: Lessons Synthesis as Post-Completion Review

**Context**: How do accumulated lessons get processed and routed?
**Decision**: Stacy leads a Lessons Synthesis Review after feature/flow completion. Classifies lessons as product-specific, systemic, process adjustment, or pattern candidate. Routes accordingly.
**Rationale**: Without a forcing function, lessons accumulate but never get acted on. Stacy's governance role makes her the natural owner. Incremental capture (during work) + synthesis review (after completion) ensures nothing is lost.

### Decision 5: Blocking Exception for Direct Escalation

**Context**: Should platform agents always go through Leonardo for system issues?
**Decision**: Default model is everything through Leonardo. Exception: system-level blocking issues that don't require Leonardo's architectural judgment (broken component, build failure) may go directly to Peter for routing to Thurgood.
**Rationale**: Most issues benefit from Leonardo's context. But routing a broken component through the architect adds latency without value. The exception is narrow and well-defined.

---

## Testing Strategy

This spec produces documentation and configuration artifacts, not code. Validation is structural:

- Agent JSON configs parse correctly
- Prompt files exist at referenced paths
- Resource files exist at referenced paths
- Steering docs referenced in protocol documents exist
- No stale references across documents

---

**Organization**: spec-completion
**Scope**: 070-agent-architecture
