---
inclusion: manual
name: MCP-Evolution-Roadmap
description: Known gaps in the MCP knowledge layer and trigger conditions for when to address them. Query when working on MCP-related specs or after product agent consumption reveals friction.
---

# MCP Evolution Roadmap

**Date**: 2026-03-11
**Purpose**: Capture known MCP knowledge gaps, their assessed priority, and the conditions that trigger action
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: mcp-development, spec-planning, agent-architecture

---

## Why This Document Exists

Strategic gaps are easy to identify in conversation and easy to forget between specs. This document prevents that amnesia. It captures gaps that are known but intentionally deferred, with explicit trigger conditions for when they become worth addressing.

**When to query this doc:**
- Starting a spec that touches the Application MCP, Docs MCP, or product agent layer
- After a product agent build cycle (e.g., WrKing Class) reveals friction
- During spec sequencing discussions

---

## Current State (Post-071)

- Docs MCP: Steering docs, token governance, component standards — queryable via progressive disclosure
- Application MCP: 10 tools, 8 family guidance YAMLs, 3 experience patterns, 28 components indexed
- Product MCP: Not yet built (Spec 070 design outline exists)

---

## Known Gaps

### Gap 1: Escalation and Degradation Paths

**What's missing**: Components have flat `alternatives` in component-meta.yaml, but no directional distinction between "escalate to a more complex component" and "degrade to a simpler fallback." An agent hitting a component gap (e.g., Chip-Choice doesn't exist) has no explicit fallback chain.

**Where it lives**: Application MCP — family guidance YAMLs, alongside `selectionRules`

**Priority**: Medium. Component gaps are real (Chip-Choice, Textarea, Search). Fallback guidance is currently implicit in `whenNotToUse` but not structured for agent consumption.

**Trigger**: A product agent build reveals repeated friction around component gaps — the agent doesn't know what to use instead and makes poor substitutions.

**Possible approach**: Add `escalatesTo` and `degradesTo` fields to family guidance YAML schema. Lightweight, optional, same pattern as `composesWithFamilies`.

---

### Gap 2: Context Signals (Density, Modality, Brand)

**What's missing**: No structured way to express that the same component should use different tokens or configurations based on context — density (compact/default/comfortable), modality (desktop/mobile/car), or brand. Currently, platform divergence is handled architecturally (True Native build-time separation) and density is handled via size props (standard/condensed), but neither is formalized as queryable metadata.

**Where it lives**: Layered. Data at Docs MCP (component metadata), resolution at Application MCP (context-aware queries), decision at Product MCP (product agent knows its context).

**Priority**: Low. DesignerPunk serves one brand, one product. Density is handled by size variants. Platform is handled by architecture. These signals become valuable when serving multiple products with different density/brand needs.

**Trigger**: A second product consumes DesignerPunk with different density or brand requirements, OR WrKing Class needs the same component to behave differently across form factors in ways that size props don't cover.

**Possible approach**: Context signal metadata on components, with Application MCP resolving the right token set for a given context. Significant architectural work — don't start without a real consumer need.

---

### Gap 3: Component Sentiment / Intent Valence

**What's missing**: No formal tag for the emotional or action weight of a component variant (e.g., destructive, warning, positive). This is currently encoded implicitly in variant names and selection rule rationale.

**Where it lives**: Docs MCP — component-meta.yaml or schema

**Priority**: Low. Variant logic and selection rules already convey intent. A separate sentiment field adds maintenance surface for marginal signal.

**Trigger**: A product agent consistently picks the wrong emotional weight for actions — e.g., uses a primary button for a destructive action because nothing in the metadata signals "this is destructive."

**Possible approach**: Optional `sentiment` or `intent` tag on variant-level selection rules. Minimal schema addition.

---

### Gap 4: Observability and Consumption Feedback

**What's missing**: No feedback loop from product agent consumption back to the design system. When an agent overrides a discouraged pattern, selects a component, or hits a gap, that information is lost. There's no way to know adoption rates, override frequency, or where guidance fails.

**Where it lives**: Product MCP — requires a consumer that reports telemetry back to the system layer.

**Priority**: Low now, high long-term. This is the difference between a design system that guesses what's useful and one that knows. But it requires a product agent consuming the system at scale before there's anything to observe.

**Trigger**: A product agent is actively building with the MCP and the team wants to understand which guidance is effective vs. ignored. Specifically: if discouraged pattern overrides exceed ~30%, that's a signal the guidance is wrong or the component has a gap.

**Possible approach**: Product agent logs consumption events (component selected, pattern used, override triggered). Periodic analysis — not real-time infrastructure. Start manual (review agent logs), automate only if the manual process proves valuable.

---

## Deferred from Spec 071

These were identified in the 071 design outline and explicitly deferred:

| Gap | Status | Reference |
|-----|--------|-----------|
| Token query capability | Deferred — needs Ada's design input | 071 design-outline Gap 2 |
| Negative guidance system | Partially addressed via `discouragedPatterns` | 071 design-outline Gap 3 |
| Cross-layer synthesis | Deferred — respect system/product boundary | 071 design-outline Gap 4 |

---

## Source

Gaps 1–4 identified during analysis of [Romina Kavcic's machine-readable components framework](https://www.linkedin.com/posts/rominakavcic_designsystem-productdesign-ai-activity-7437135540996644865-Odfd/) (2026-03-11), mapped against DesignerPunk's current MCP architecture. Content was rephrased for compliance with licensing restrictions.
