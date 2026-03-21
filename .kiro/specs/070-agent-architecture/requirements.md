# Requirements Document: Agent Architecture

**Date**: 2026-03-20
**Spec**: 070 - Agent Architecture
**Status**: Requirements Phase
**Dependencies**: Spec 067 (Application MCP), Spec 068 (Family Guidance Indexer)

---

## Introduction

DesignerPunk needs a product agent architecture to enable building products *with* the design system. This spec defines five product agents (architect, three platform engineers, governance), their communication protocol, and the MCP relationship model that connects system knowledge to product execution.

---

## Requirements

### Requirement 1: Cross-Platform Product Architect Agent

**User Story**: As a product team, we want a cross-platform architect agent, so that design intent is translated into consistent engineering direction across platforms.

#### Acceptance Criteria

1. WHEN a product screen needs to be built THEN Leonardo SHALL produce a screen specification containing component tree, state model, token references, platform-specific notes, and accessibility requirements
2. WHEN Leonardo selects components THEN Leonardo SHALL query the Application MCP using find_components, get_experience_pattern, and validate_assembly
3. WHEN product work reveals a system-level gap THEN Leonardo SHALL draft a Tier 3 System Escalation Request routed to Thurgood for triage
4. WHEN Leonardo discovers a lesson during product work THEN Leonardo SHALL document it for Stacy's Lessons Synthesis Review
5. WHEN a platform agent completes implementation THEN Leonardo SHALL review the Implementation Report for cross-platform consistency

### Requirement 2: Platform Agent Template

**User Story**: As a product team, we want platform-specific implementation agents, so that each platform gets native implementations that honor DesignerPunk's behavioral contracts.

#### Acceptance Criteria

1. WHEN Leonardo provides a screen specification THEN the platform agent SHALL implement it using platform-native patterns ({FRAMEWORK}, {LANGUAGE})
2. WHEN the platform agent completes a screen THEN the platform agent SHALL submit a Tier 2 Implementation Report to Leonardo
3. WHEN the platform agent encounters a blocking issue during implementation THEN the platform agent SHALL raise a Tier 1 clarification to Leonardo
4. WHEN a Tier 1 clarification results in a design decision THEN the platform agent SHALL capture it in the Implementation Report under "Decisions Made During Implementation"
5. WHEN the platform agent hits a system-level blocking issue that doesn't require Leonardo's architectural judgment THEN the platform agent MAY escalate directly to Peter for routing to Thurgood
6. WHEN implementing THEN the platform agent SHALL consume DesignerPunk semantic tokens from platform-specific token files and SHALL NOT hard-code values that have token equivalents

### Requirement 3: Product Governance Agent

**User Story**: As a product team, we want a governance agent, so that process quality, test coverage, and cross-platform parity are audited consistently.

#### Acceptance Criteria

1. WHEN a screen or feature is complete THEN Stacy SHALL audit against the process audit checklist (spec quality, implementation coverage, test coverage, cross-platform parity, documentation, process adherence, lessons-learned capture)
2. WHEN multiple platforms have implemented the same screen THEN Stacy SHALL conduct a parity review comparing component trees, source token usage, behavioral contract adherence, and test coverage
3. WHEN Stacy identifies a lesson or discovery during an audit THEN Stacy SHALL document it immediately in lessons-in-progress.md (incremental capture)
4. WHEN a feature or flow is complete across active platforms THEN Stacy SHALL lead a Lessons Synthesis Review that classifies and routes accumulated lessons
5. WHEN audit findings are identified THEN Stacy SHALL organize them by severity (critical, high, medium, low) and route to the appropriate agent

### Requirement 4: Product Handoff Protocol

**User Story**: As a product team, we want a structured communication protocol, so that implementation-phase communication between agents is efficient and traceable.

#### Acceptance Criteria

1. WHEN agents communicate during implementation THEN communication SHALL follow the three-tier model: Tier 1 (quick clarifications), Tier 2 (implementation reports), Tier 3 (system escalation requests)
2. WHEN a Tier 2 Implementation Report is submitted THEN it SHALL contain: what was built, deviations from spec, decisions made during implementation, discoveries, and open items
3. WHEN a Tier 3 System Escalation Request is created THEN it SHALL route to Thurgood for triage and SHALL contain: context, gap description, what was tried, and what's needed
4. WHEN a Lessons Synthesis Review is conducted THEN it SHALL produce a synthesis document classifying each lesson as product-specific, systemic, process adjustment, or pattern candidate

### Requirement 5: MCP Relationship Model

**User Story**: As a design system team, we want a defined relationship model between the three MCPs, so that agents know which MCP to query for what and how cross-MCP references work.

#### Acceptance Criteria

1. WHEN the relationship model is documented THEN it SHALL define boundaries, information flow, and access model for Docs MCP, Application MCP, and Product MCP
2. WHEN agents query MCPs THEN Leonardo SHALL be the primary consumer of both Application MCP and Product MCP (future), platform agents SHALL receive product context through Leonardo's specs, and system agents SHALL NOT query Product MCP
3. WHEN cross-MCP references are made THEN they SHALL use stable identifiers (token names, component names, pattern names) and SHALL follow one-direction dependency (Product → Application → Docs)

### Requirement 6: Agent Configuration Files

**User Story**: As a product team, we want production-ready agent configuration files, so that agents can be instantiated in Kiro with correct resources, tools, and permissions.

#### Acceptance Criteria

1. WHEN an agent is configured THEN the JSON configuration SHALL include: name, description, prompt file reference, MCP access, tool permissions, write scope, resource list, keyboard shortcut, and welcome message
2. WHEN platform agents are configured THEN each SHALL load platform-appropriate steering docs as skill resources
3. WHEN any product agent is configured THEN it SHALL load Core Goals, AI-Collaboration-Principles, and Personal Note as file resources

---

**Organization**: spec-completion
**Scope**: 070-agent-architecture
