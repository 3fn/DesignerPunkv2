# Agent Interoperability Protocol: Structured Cross-Agent Communication

**Date**: 2026-03-07
**Purpose**: Define a structured protocol for direct agent-to-agent communication, eliminating the human-relay bottleneck and enabling traceable cross-domain task handoffs
**Organization**: spec-guide
**Scope**: XXX-agent-interoperability-protocol
**Status**: Design outline — exploratory, pending review
**Related Specs**: 060 (Custom Agent System), 067 (Application MCP), 070 (Agent Architecture)

---

## Problem Statement

DesignerPunk operates with three specialized agents — Ada (tokens), Lina (components), Thurgood (governance/audit) — coordinated by Peter as human lead. Today, all cross-agent communication is human-mediated: when Thurgood's audit reveals a component test gap, Peter manually relays the finding to Lina. When Lina's implementation raises a token governance question, Peter carries the context to Ada.

This works at the current scale (3 agents, 1 codebase), but creates three problems:

1. **Peter is the bottleneck.** Every cross-agent handoff requires Peter to context-switch, summarize, and relay. As agent count grows (application MCP agents, product MCP agents per Spec 070), this doesn't scale.

2. **Context is lossy.** When Peter relays a finding from Thurgood to Lina, the original analysis is summarized. Nuance, caveats, and supporting evidence may be lost or compressed. The receiving agent works from a human summary rather than the structured original.

3. **Handoffs are untraceable.** There's no record of what was requested, what was delivered, or what's still pending. Cross-agent dependencies live in conversation history, which is ephemeral and unsearchable.

The Spec 074 pagination animation pivot exposed this acutely: Lina produced an architectural pivot finding, Ada produced a token review, Thurgood produced a gate plan — all mediated through Peter across multiple sessions. The coordination worked, but only because Peter held the full picture in his head.

---

## Vision: Three Horizons

### Horizon 1 — DesignerPunk System Agents (Current Phase)
Ada, Lina, and Thurgood communicating within the design system MCP. Structured task handoffs, capability discovery, traceable requests. This is the immediate problem to solve.

### Horizon 2 — Application MCP Agents
When DesignerPunk is used to build a product, application-layer agents (frontend, backend, data) need to request design system artifacts from system agents. A frontend agent needs to ask Ada for a color token, or ask Lina for a component's API surface. The protocol established in Horizon 1 becomes the interface between MCP boundaries.

### Horizon 3 — Product MCP Agents
The shipped product has its own operational agents (deployment, monitoring, feedback). These agents consume artifacts from both the design system and application layers. The protocol scales to a three-node knowledge network (per Spec 070's architecture).

This spec focuses on Horizon 1 with architectural decisions that don't preclude Horizons 2 and 3.

---

## Prior Art: A2A Protocol

Google's Agent2Agent (A2A) protocol (v0.3.0, Apache 2.0, Linux Foundation) addresses agent interoperability at the network level. Key concepts relevant to our problem:

- **Agent Cards**: JSON documents describing an agent's capabilities, accepted inputs, and connection info. Enables capability discovery without shared internal state.
- **Task lifecycle**: Tasks have states (submitted → working → completed/failed), produce artifacts, and support long-running async workflows.
- **Opacity principle**: Agents collaborate without exposing internal memory, tools, or reasoning. They exchange structured requests and results.
- **Modality negotiation**: Agents negotiate the format of their communication (text, structured data, files).
- **MCP complementarity**: A2A is explicitly designed to complement MCP — MCP provides tools and context, A2A provides agent-to-agent task coordination.

### What Maps Well
- Agent Cards → our domain boundary definitions (already exist in steering docs as prose)
- Task lifecycle → our gate/blocked task patterns (already exist in spec planning)
- Opacity → our domain respect model (agents don't second-guess each other's internals)

### What Doesn't Map (Yet)
- A2A assumes agents are separate HTTP services. Our agents are personas within the same tooling environment.
- A2A's JSON-RPC transport is overkill for agents sharing a filesystem.
- A2A's authentication model solves a problem we don't have (our agents trust each other by design).

### Assessment
A2A's mental model is the right one. Its transport layer is premature for our current architecture. The strategy: adopt A2A's conceptual patterns now (Agent Cards, task lifecycle, structured handoffs), implement them at filesystem level, and graduate to full A2A transport when Horizon 2 or 3 demands it.

---

## Proposed Architecture

### Layer 1: Agent Cards (Capability Discovery)

Each agent gets a structured capability definition — a machine-readable version of what's currently in their steering doc system prompts.

```yaml
# .kiro/agents/ada.agent-card.yaml
agent:
  name: Ada
  domain: Rosetta Token System
  version: "1.0"

capabilities:
  accepts:
    - token-review          # Review token usage in implementation
    - token-creation        # Create new tokens (requires human approval)
    - token-mapping         # Confirm token-to-value mappings
    - formula-validation    # Validate mathematical relationships
    - governance-check      # Check token governance compliance
  
  produces:
    - token-review-finding  # Assessment of token correctness
    - token-proposal        # Proposed new token (pending approval)
    - mapping-confirmation  # Confirmed token-to-value mapping
    - governance-assessment # Compliance assessment

  constraints:
    - "Token creation requires Peter's explicit approval"
    - "Component tokens require human review before use"
    - "Does not implement component code — that's Lina's domain"

  knowledge_sources:
    - ".kiro/steering/Token-Governance.md"
    - ".kiro/steering/Rosetta-System-Architecture.md"
    - "preserved-knowledge/token-architecture-2-0-mathematics.md"
```

Similar cards for Lina and Thurgood. These serve two purposes:
1. **For agents**: When Thurgood needs to request something from Ada, the card tells Thurgood what Ada accepts and what to expect back.
2. **For future A2A**: These cards can be translated to A2A Agent Card format when we need network-level discovery.

### Layer 2: Task Handoff Protocol (Structured Requests)

Cross-agent requests use a structured format stored in the filesystem:

```yaml
# .kiro/agent-tasks/2026-03-07-thurgood-to-lina-contract-update.yaml
task:
  id: "074-3.7-contract-update"
  spec: "074-pagination-animation"
  gate: "Gate 3"
  
  from: Thurgood
  to: Lina
  type: contract-update
  priority: high
  status: submitted  # submitted | acknowledged | working | completed | blocked
  
  created: "2026-03-07T22:00:00-05:00"
  updated: "2026-03-07T22:00:00-05:00"

request:
  summary: "Update performance_virtualization contract for render-all-dots"
  context: |
    Web implementation pivoted from windowed 7-node buffer to render-all-dots
    with translateX centering. The performance_virtualization contract in
    contracts.yaml still describes windowed rendering behavior.
  
  references:
    - "findings/architectural-pivot-render-all-dots.md"
    - "findings/ada-token-review-render-all-dots.md"
  
  acceptance_criteria:
    - "Contract reflects render-all-dots for web platform"
    - "Contract handles platform divergence (web: render-all, iOS/Android: still windowed)"
    - "Contract assertions are testable"

  blocked_by: "074-3.5"  # Design outline must be updated first
  
response:
  # Populated by receiving agent when task is completed
  summary: null
  artifacts: []
  notes: null
  completed: null
```

### Layer 3: Task Queue (Coordination View)

A summary file that gives any agent (or Peter) a view of all pending cross-agent work:

```markdown
# Agent Task Queue

**Last Updated**: 2026-03-07T22:00:00-05:00

## Pending
| ID | From | To | Type | Priority | Status | Blocked By |
|----|------|----|------|----------|--------|------------|
| 074-3.7 | Thurgood | Lina | contract-update | high | submitted | 074-3.5 |
| 074-3.8 | Thurgood | Ada/Lina | test-annotation | medium | blocked | 074-3.4 |

## Completed (Last 7 Days)
| ID | From | To | Type | Completed |
|----|------|----|------|-----------|
```

### Layer 4: A2A Migration Path

When Horizon 2 arrives and agents span MCP boundaries:
1. Agent Cards translate to A2A Agent Card JSON format
2. Task handoff YAML translates to A2A Task objects via JSON-RPC
3. Filesystem queue graduates to HTTP endpoints
4. The JS SDK (`@a2a-js/sdk`) provides the transport layer

The conceptual model stays the same. Only the transport changes.

---

## Process-First Validation Strategy

Per our process-first principle: prove the manual process before automating.

### Phase 1: Manual Protocol (Prove the Pattern)
- Create Agent Cards as YAML files (documentation exercise)
- Create task handoff files manually when cross-agent work is identified
- Peter reviews the queue and routes work to agents in sessions
- Evaluate: Does the structured format improve context transfer? Does the queue reduce lost handoffs?

### Phase 2: MCP Integration (Lightweight Automation)
- Add MCP tools for task creation and status updates (`create_agent_task`, `update_task_status`, `list_pending_tasks`)
- Agents can create tasks for other agents directly during sessions
- Peter still reviews and approves routing, but doesn't have to manually write the handoff
- Evaluate: Does MCP-mediated handoff reduce Peter's relay burden without losing oversight?

### Phase 3: A2A Transport (Full Interoperability)
- Only when Horizon 2 demands it (application MCP agents need to talk to system agents)
- Translate filesystem protocol to A2A HTTP transport
- Agent Cards become network-discoverable
- Task lifecycle becomes async with push notifications
- Evaluate: Does the network protocol add value over filesystem for the actual use case?

---

## Trade-offs and Counter-Arguments

### For This Approach
- Incremental: each phase delivers value independently
- Process-first: we prove the pattern before building infrastructure
- A2A-aligned: conceptual compatibility means we're not building a dead end
- Filesystem-native: works within our current tooling without new infrastructure

### Against This Approach
- **Overhead risk**: Structured YAML files for every cross-agent request could become bureaucratic. If most handoffs are simple ("hey Ada, check this token"), the protocol adds friction without value. Mitigation: only use structured handoffs for tasks that cross gate boundaries or carry complex context. Simple questions stay in conversation.
- **Premature abstraction**: We have 3 agents. The coordination problem might be solvable with a shared markdown file and good discipline. Building a protocol with Agent Cards, task lifecycle, and migration paths might be over-engineering for the current scale. Counter: the protocol is the shared markdown file, just structured. The YAML format is the discipline.
- **A2A may not win**: The protocol is at v0.3.0. It might evolve in directions that don't serve our use case, or it might lose to a competing standard. Mitigation: our Phase 1 and 2 don't depend on A2A at all. Phase 3 is optional and only triggered by actual need.
- **Peter's oversight value**: The human-relay model, while bottlenecked, ensures Peter sees every cross-agent interaction. A direct agent-to-agent protocol could reduce Peter's visibility into what's happening. Mitigation: the task queue provides a coordination view. Peter sees everything, just not as the relay point.

---

## Relationship to Existing Specs

- **Spec 060 (Custom Agent System)**: Defined Ada, Lina, Thurgood as agent personas with domain boundaries. This spec adds structured communication between those personas.
- **Spec 067 (Application MCP)**: Built the MCP tools that agents consume. This spec adds agent-to-agent coordination on top of MCP tool consumption.
- **Spec 070 (Agent Architecture)**: Defined the three-node knowledge network (system, application, product). This spec provides the communication protocol within and between those nodes.
- **Spec 071 (Application MCP Completeness)**: Addresses coverage gaps in what the MCP serves. This spec addresses how agents coordinate around what the MCP serves.

---

## Open Questions

1. **Granularity threshold**: At what complexity level does a cross-agent request warrant a structured task file vs. staying in conversation? Need to define this to avoid protocol overhead on simple interactions.

2. **Peter's approval model**: Should Peter approve all cross-agent tasks before they're routed, or only tasks that involve token creation, architectural decisions, or steering doc changes? The current ballot measure model applies to doc changes — does it extend to all inter-agent work?

3. **Task completion verification**: When Lina completes a task from Thurgood, who verifies it meets the acceptance criteria — Thurgood (the requester), Peter (the lead), or both?

4. **Conversation context**: A structured YAML task captures the request, but agents often need conversational context (why this matters, what was tried before). How much context belongs in the task file vs. referenced findings documents?

5. **Spec 070 alignment**: The agent architecture spec is still exploratory. Should this spec wait for 070 to stabilize, or proceed independently and reconcile later?

---

## Recommended Next Steps

1. **Peter reviews this design outline** — is the vision right? Are the horizons correctly scoped?
2. **Ada and Lina review for domain accuracy** — do the Agent Card capabilities match their actual scope?
3. **Resolve open questions** — particularly the granularity threshold and approval model
4. **If approved**: Thurgood formalizes into requirements.md, design.md, tasks.md
5. **Phase 1 begins**: Create Agent Cards, try structured handoffs on the remaining Spec 074 work as a pilot

---

## References

- [A2A Protocol (GitHub)](https://github.com/a2aproject/A2A) — v0.3.0, Apache 2.0, Linux Foundation
- [A2A Announcement (Google Developers Blog)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) — April 2025
- [A2A JS SDK](https://github.com/a2aproject/a2a-js) — `npm install @a2a-js/sdk`
- Spec 060: Custom Agent System — agent persona definitions
- Spec 067: Application MCP — MCP tool architecture
- Spec 070: Agent Architecture — three-node knowledge network model
