# Task 3.2 Completion: Validate Prompt Behavior

**Date**: 2026-02-14
**Task**: 3.2 — Validate prompt behavior
**Type**: Implementation
**Validation**: Tier 2 - Standard
**Organization**: spec-completion
**Scope**: 060-custom-agent-system (Lina)

---

## Summary

Validated Lina's system prompt structural correctness against all five acceptance scenarios defined in the task. Full interactive validation (switching to Lina and testing live responses) requires manual testing by Peter.

## Structural Validation Results

| Test Scenario | Prompt Section | Behavioral Instruction | Status |
|--------------|----------------|----------------------|--------|
| Component-related question → domain expertise | In Scope + MCP Usage Pattern + Component Scaffolding Workflow | Query relevant Component-Family doc, reference Stemma structure | ✅ Covered |
| Token creation question → defer to Ada | Out of Scope + Domain Boundary Response Examples | Response template: "That's Ada's area" with `ctrl+shift+a` | ✅ Covered |
| Test governance question → defer to Thurgood | Out of Scope + Domain Boundary Response Examples | Response template: "That sounds like a job for Thurgood" with `ctrl+shift+t` | ✅ Covered |
| Doc update request → ballot measure model | Documentation Governance: Ballot Measure Model | Propose/Present/Vote/Apply workflow, no write access to `.kiro/steering/` | ✅ Covered |
| Component scaffolding request → Stemma structure compliance | Component Scaffolding Workflow + Platform Implementation | 5-step workflow: Family doc check → types.ts → platforms → tests → README | ✅ Covered |

## Detailed Section Verification

### Scenario 1: Component Domain Expertise
- "In Scope" section lists: component scaffolding, platform implementation, component docs, behavioral contract testing, component token integration, schema definitions, token mapping files, inheritance structures, platform parity validation
- MCP Usage Pattern table provides 13 query entries for component-related documentation
- Component Scaffolding Workflow defines the full types.ts → platforms → tests → README pipeline
- Platform Implementation section covers all three platforms with True Native Architecture details

### Scenario 2: Token Creation Deferral
- "Out of Scope" explicitly states: "Token creation or governance — that's Ada's domain"
- "Token mathematical foundations — that's Ada's domain"
- Domain Boundary Response Example: "That's Ada's area — she's the Rosetta token specialist. You can switch to her with `ctrl+shift+a` or `/agent swap`."
- Token Usage section reinforces: "When a Token Is Missing" → flag gap, recommend Ada, do NOT create

### Scenario 3: Test Governance Deferral
- "Out of Scope" explicitly states: "Test suite audits and test governance — that's Thurgood's domain"
- Domain Boundary Response Example: "That sounds like a job for Thurgood — he handles test governance and auditing. You can reach him with `ctrl+shift+t` or `/agent swap`."
- Testing Practices section distinguishes "What You Own" vs "What You Don't Own"

### Scenario 4: Ballot Measure Model
- Full "Documentation Governance: Ballot Measure Model" section with 4-step process
- Step 2 (Present) requires: what changed, why, counter-argument, impact
- Explicit constraint: "You do NOT have write access to `.kiro/steering/` files"
- Applies to ALL documentation changes "no matter how small"

### Scenario 5: Stemma Structure Compliance
- Component Scaffolding Workflow defines 5 steps with Component-Family doc verification first
- Directory structure example shows full Stemma pattern including schema.yaml, tokens.ts, examples/
- Platform Implementation section covers web (Web Components + CSS logical properties), iOS (Swift + SwiftUI), Android (Kotlin + Jetpack Compose)
- CSS logical properties examples included per Technology Stack steering doc

## Interactive Validation (Deferred to Peter)

The following tests require manually switching to Lina (`ctrl+shift+l`) and sending test prompts:

1. Ask: "What behavioral contracts does the ButtonCTA component implement?" → Expect MCP query to Component-Inheritance-Structures.md + domain expertise response
2. Ask: "Create a new color token called color-accent-warm" → Expect Ada deferral with `ctrl+shift+a` reference
3. Ask: "Run a test suite health audit across all component tests" → Expect Thurgood deferral with `ctrl+shift+t` reference
4. Ask: "Update the Component-Family-Button doc to add a new variant section" → Expect ballot measure proposal (draft + rationale + counter-argument)
5. Ask: "Scaffold a new Card component for the Container family" → Expect Stemma workflow: check Component-Family-Container doc → types.ts → platforms → tests → README

## Requirements Coverage

- Req 2: Domain boundary behavior validated structurally ✅
- Req 7: Domain respect model (trust-by-default, deferral, flagging) instructions present ✅
- Req 8: Ballot measure model (propose, present, vote, apply) instructions present ✅
