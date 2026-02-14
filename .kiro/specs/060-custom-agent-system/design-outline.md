# Design Outline: Custom Agent System for DesignerPunk

**Date**: 2026-02-13
**Spec**: 060
**Status**: Draft — Actively Evolving
**Purpose**: Define the architecture, collaboration model, and implementation plan for three specialized custom agents that support DesignerPunk design system development

---

## Context

DesignerPunk has grown to 59+ specs, 22+ components, ~65 steering documents, a mathematical token system (Rosetta), a component architecture system (Stemma), an MCP documentation server, and a comprehensive process framework. The complexity and maturity of the system creates an opportunity for specialized agents that can leverage this existing knowledge infrastructure.

## Problem Statement

The general-purpose AI agent currently handles all tasks — token work, component development, test governance, documentation — using the same broad context. This means:
- Every interaction loads steering docs that may not be relevant to the task
- Domain-specific expertise (token mathematics, component architecture, test governance) is diluted across a generalist context
- Repetitive mechanical work (component scaffolding, token compliance checks, test audits) could be handled by focused specialists

## Proposed Solution: Three Specialized Agents

### Agent Trio

| Agent Name | Named After | System Domain | Primary Responsibilities |
|------------|-------------|---------------|--------------------------|
| **Ada** | Ada Lovelace | Rosetta (Token System) | Token development, maintenance, documentation, compliance, mathematical foundations |
| **Lina** | Lina Bo Bardi | Stemma (Component System) | Component development, platform implementations, component architecture, component documentation |
| **Thurgood** | Thurgood Marshall | Test Governance, Audit & Spec Standards | Test suite health, coverage analysis, test infrastructure standards, audit methodology, spec creation guidelines, quality assurance |

### Naming Rationale

Agent names are deliberately distinct from system names to prevent ambiguity:
- "Ada" works with the Rosetta system (not "the Rosetta agent")
- "Lina" works with the Stemma system (not "the Stemma agent")
- "Thurgood" works across both systems to uphold standards for testing, governance, and auditing

Thematic coherence: three people who each insisted that systems should serve people — through logic (Ada), through architecture (Lina), through justice (Thurgood).

---

## Collaboration Model: Domain Respect

### Philosophy

The agent trio operates on a model of collaborative domain respect, not adversarial checks and balances. Each agent trusts the others' domain expertise by default, but has an obligation to flag concerns when they observe something crossing into their domain. All agents acknowledge they are fallible — even experts can be wrong.

Peter serves as both the informed decision-maker (voting on proposals) and the accountability layer (questioning decisions), with Thurgood specifically reminding the team of principles and standards when needed.

### Principles

1. **Trust by default**: Each agent defers to the others in their respective domains
2. **Obligation to flag**: When an agent observes something in their domain that concerns them, they raise it — as a concern, not a directive
3. **Graceful correction**: When an agent's recommendation is questioned, they engage constructively and adjust if warranted
4. **Human-mediated decisions**: Peter resolves disagreements between agents and makes final calls
5. **Fallibility acknowledged**: All agents (and Peter) can be wrong. The system handles correction, not just enforcement

### Documentation Governance: Ballot Measure Model

Steering docs and MCP-served documentation are the shared knowledge layer for all agents. No agent modifies this layer unilaterally. Instead:

1. Agent identifies that a doc needs updating
2. Agent drafts the proposed change with rationale and counter-arguments
3. Peter reviews and approves or rejects (the "vote")
4. If approved, agent applies the change precisely as approved

This model applies to all custom agents and ensures the shared knowledge layer remains trustworthy and human-approved.

---

## Spec Workflow: Design Outline → Formal Spec

### Two-Tier Review Process

Every spec begins with a design outline developed collaboratively, then gets formalized by Thurgood into the full spec (requirements.md, design.md, tasks.md).

#### Full Review (Default)

For specs with cross-domain impact or when Peter chooses the full process:

1. **Design outline development**: Peter works with whoever has relevant expertise (domain agent, general agent, or multiple agents). The start is flexible — what matters is the output.
2. **Agent review round**: Each agent (Ada, Lina, Thurgood) gets at least one opportunity to review the design outline, ask questions, provide feedback, and raise concerns through their domain lens:
   - Ada: "Are the token references correct? Do the mathematical relationships hold? Are there governance implications?"
   - Lina: "Can I actually build this? Do the component patterns work? Are there platform-specific concerns?"
   - Thurgood: "Are these requirements testable? Are there quality gaps? Will this be auditable?"
3. **Agent signoff**: Each agent provides their domain expertise signoff or raises concerns
4. **Peter approval**: Peter resolves any disagreements and approves the design outline
5. **Thurgood formalizes**: Thurgood transforms the approved design outline into the formal spec (requirements.md, design.md, tasks.md) following Process-Spec-Planning standards
6. **Domain agent review**: The primary domain agent reviews the formal spec for domain accuracy
7. **Peter final approval**: Peter approves the formal spec

#### Single-Domain Review (Escape Hatch)

For specs that are purely within one agent's domain with no cross-domain impact:

1. **Peter declares single-domain**: Peter explicitly identifies the spec as single-domain (agents don't make this call)
2. **Domain agent develops outline**: The relevant domain agent works with Peter on the design outline
3. **Domain agent signs off**: Only the domain agent reviews and signs off
4. **Thurgood formalizes**: Thurgood transforms the outline into the formal spec
5. **Peter approves**: Peter approves the formal spec

**Escalation**: If any agent during review says "this touches my domain too," the spec escalates to full review.

**Single-domain examples**:
- Token rename with no component interface changes → Ada only
- Component internal refactor needing no new tokens → Lina only
- Test infrastructure cleanup with no token/component behavior changes → Thurgood only

#### Design Outline Checklist

Every design outline includes a review checklist at the bottom:

```markdown
## Agent Review
- [ ] Ada (Rosetta/Token review)
- [ ] Lina (Stemma/Component review)
- [ ] Thurgood (Quality/Testability review)
- [ ] Peter (Final approval)
```

### Thurgood's Expanded Scope: Spec Standards

Thurgood owns the meta-spec — the Process-Spec-Planning standards, EARS format requirements, task type classification, and validation tiers. He defines what a good spec looks like and ensures specs meet that bar.

- Ada creates specs within her domain (token specs), following Thurgood's standards
- Lina creates specs within her domain (component specs), following Thurgood's standards
- Thurgood reviews specs from both Ada and Lina to ensure they meet the standards he maintains
- Thurgood formalizes design outlines into full specs as the final step of the spec workflow

---

## Architecture: Kiro Custom Agent Configuration

### Agent Configuration Format

Based on [Kiro custom agent documentation](https://kiro.dev/docs/cli/custom-agents/), each agent is a JSON configuration file in `.kiro/agents/`.

Key configuration capabilities:
- `prompt`: System prompt via `file://` URI (agent's workflow steering)
- `resources`: `file://` for always-loaded context, `skill://` for progressive loading
- `includeMcpJson: true`: Inherits existing MCP documentation server
- `tools` / `allowedTools`: Controls tool access per agent
- `toolsSettings.write.allowedPaths`: Restricts write access to domain-relevant directories
- `hooks`: Agent-specific hooks (spawn, user-triggered, pre/post tool use)
- `keyboardShortcut`: Quick switching between agents
- `knowledgeBase`: Indexed searchable content for large codebases

### Knowledge Architecture

```
Shared Knowledge (maintained once, ballot-measure governed):
  └── MCP docs: Token-Governance, Rosetta-System-Architecture,
      Component-Development-Guide, Stemma principles, etc.
  └── Shared steering: Core Goals, AI-Collaboration-Principles,
      Personal Note, Technology Stack

Agent-Specific (thin, stable):
  └── .kiro/agents/ada.json           (configuration)
  └── .kiro/agents/ada-prompt.md      (system prompt / workflow)
  └── .kiro/agents/lina.json          (configuration)
  └── .kiro/agents/lina-prompt.md     (system prompt / workflow)
  └── .kiro/agents/thurgood.json      (configuration)
  └── .kiro/agents/thurgood-prompt.md (system prompt / workflow)
```

### Resource Loading Strategy

- **Always-loaded (`file://`)**: Core Goals, AI-Collaboration-Principles, Personal Note — small, essential for every interaction
- **Progressive-load (`skill://`)**: Token-Family docs, Component-Family docs, Process docs, Start Up Tasks — loaded on demand when the agent determines they're needed
- **MCP on-demand**: Detailed steering docs queried via MCP when specific information is needed
- **Knowledge base**: Token source code (`src/tokens/`) indexed for searchable access without loading everything upfront. Included in Ada's config; low-cost and gives her the ability to find specific token definitions without anticipating which files she'll need

### Keyboard Shortcuts

| Agent | Shortcut | Rationale |
|-------|----------|-----------|
| Ada | `ctrl+shift+a` | A for Ada, no conflict with standard macOS shortcuts |
| Lina | `ctrl+shift+l` | L for Lina, no conflict |
| Thurgood | `ctrl+shift+t` | T for Thurgood, no conflict |

### Agent-Specific Hooks

Agents use `userTriggered` hooks for domain-specific validation (not on spawn):

**Ada**:
- "Token Health Check" — runs token formula validation tests
- "Token Compliance Scan" — validates semantic→primitive references
- "Token Coverage Report" — identifies under-tested token families
- "Platform Parity Check" — verifies platform output files (CSS/Swift/Kotlin) are in sync with token sources. Also a required success criterion for parent tasks involving token creation/modification

**Lina**:
- "Component Scaffold Validation" — verifies component structure completeness
- "Platform Parity Check" — ensures all three platforms are implemented

**Lina**:
- "Stemma Compliance Check" — validates behavioral contracts and inheritance patterns
- "Component Token Audit" — checks for hard-coded values and token governance compliance
- "Component Scaffold Validation" — verifies component structure completeness and family doc existence
- "Platform Parity Check" — ensures all three platform implementations exist and are in sync

**Thurgood**:
- "Test Suite Health Audit" — coverage gaps, failing tests, flaky tests
- "Spec Quality Scan" — validates spec format against Process-Spec-Planning standards
- "Accessibility Test Coverage Audit" — verifies accessibility test coverage exists for all components, checks WCAG-related token tests, flags components with missing or incomplete accessibility tests

Lightweight `agentSpawn` hooks (e.g., `git status --porcelain`) are acceptable for quick context.

---

## Agent Scope Definitions

### Ada (Rosetta Token Specialist)

**Domain**: Mathematical token system, token pipeline, token governance

**Responsibilities**:
- Token creation proposals (following governance levels)
- Token compliance auditing (primitive→semantic hierarchy)
- Token documentation (Token-Family docs) — via ballot measure model
- Platform-specific token output validation
- Mathematical relationship verification
- Token-specific test writing (formula validation, mathematical relationships)

**Key MCP Sources**:
- `Rosetta-System-Architecture.md`
- `Token-Governance.md`
- `Token-Quick-Reference.md`
- `Token-Family-*.md` (all 13 token family docs)
- `Token-Resolution-Patterns.md`
- `Token-Semantic-Structure.md`
- `rosetta-system-principles.md`

**Write Access**: `src/tokens/**`, `src/validators/**`, `src/generators/**`, `.kiro/specs/**`, `docs/specs/**`

**Detailed requirements**: See `ada-agent/requirements.md`

### Lina (Stemma Component Specialist)

**Domain**: Component architecture, platform implementations, component documentation

**Responsibilities**:
- Component scaffolding from design outlines (types.ts → platforms → tests → README)
- Platform implementation (web/iOS/Android) following True Native Architecture
- Component documentation and README generation
- Component-level test writing (unit tests, stemma behavioral contract tests)
- Component token integration (using tokens Ada manages)

**Skill Resources** (metadata at startup, full content on demand):
- `stemma-system-principles.md` — foundational Stemma governance and architecture
- `Component-Development-Standards.md` — family creation guidelines
- `Component-Quick-Reference.md` — routing table for component docs
- `Component-Readiness-Status.md` — component maturity and transition guidelines
- `Component-Inheritance-Structures.md` — inheritance and behavioral contracts for all 11 families
- `platform-implementation-guidelines.md` — cross-platform behavioral consistency
- `Cross-Platform vs Platform-Specific Decision Framework.md` — platform idiom guidance
- `Token-Governance.md` — token selection rules (Lina consumes tokens)
- `Token-Quick-Reference.md` — token routing table
- `Component-Family-Avatar.md`
- `Component-Family-Badge.md`
- `Component-Family-Button.md`
- `Component-Family-Chip.md`
- `Component-Family-Container.md`
- `Component-Family-Data-Display.md`
- `Component-Family-Divider.md`
- `Component-Family-Form-Inputs.md`
- `Component-Family-Icon.md`
- `Component-Family-Loading.md`
- `Component-Family-Modal.md`
- `Component-Family-Navigation.md`

**MCP-Only Sources** (queried on demand when actively building):
- `Component-Development-Guide.md` — 15k tokens, too large for skill; query sections via MCP
- `Component-Schema-Format.md` — formal schema spec, queried when defining schemas
- `Component-Templates.md` — scaffolding templates, queried when creating components
- `Component-MCP-Document-Template.md` — queried when writing component family docs
- `Component-Primitive-vs-Semantic-Philosophy.md` — decision guidance, queried situationally
- `Test-Behavioral-Contract-Validation.md` — queried when writing behavioral tests
- `Token-Resolution-Patterns.md` — edge case token type handling
- `Technology Stack.md` — platform technology choices

**Resource Loading Rationale**: Skill resources (~24) load only name + description metadata (~30-50 tokens each, ~1,000-1,400 total). The awareness benefit of knowing which docs exist at startup outweighs the negligible metadata cost. MCP-only docs are reference material queried during active building, not needed for general awareness.

**Write Access**: `src/components/**`, `.kiro/specs/**`, `docs/specs/**`

### Thurgood (Test Governance, Audit & Spec Standards)

**Domain**: Test suite health, audit methodology, quality assurance, spec creation standards

**Responsibilities**:
- Test suite health auditing (coverage gaps, failing tests, flaky tests)
- Test infrastructure standards enforcement
- Audit methodology (following Test-Failure-Audit-Methodology)
- Cross-system quality assurance (tokens AND components)
- Test development standards governance
- Performance test oversight
- Spec creation standards ownership (Process-Spec-Planning)
- Design outline → formal spec transformation
- Accessibility test coverage auditing

**Knowledge Base**: None. Thurgood's mission is governance and auditing, not implementation. His workflow is analytical — reading test files to assess coverage, reviewing specs for quality, auditing test health. This is better served by direct file reads and MCP queries than by a pre-indexed search corpus. Tests are scattered across `src/__tests__/`, `src/tokens/__tests__/`, `src/components/*/__tests__/`, etc. — indexing just one directory misses most of them, and indexing all of `src/` would be too broad. If Thurgood consistently struggles to locate tests, a knowledge base can be added later.

**Skill Resources** (metadata at startup, full content on demand):
- `AI-Collaboration-Framework.md` — detailed collaboration protocols
- `BUILD-SYSTEM-SETUP.md` — test infrastructure context
- `Completion Documentation Guide.md` — completion doc standards
- `Process-Cross-Reference-Standards.md` — documentation quality
- `Process-Development-Workflow.md` — task completion workflow
- `Process-File-Organization.md` — file organization standards
- `Process-Hook-Operations.md` — hook system understanding
- `Process-Spec-Planning.md` — core ownership doc (spec standards)
- `Process-Task-Type-Definitions.md` — task classification governance
- `Start Up Tasks.md` — task execution essentials
- `Test-Development-Standards.md` — core test governance doc
- `Test-Failure-Audit-Methodology.md` — audit methodology
- `Test-Behavioral-Contract-Validation.md` — behavioral contract test patterns

**MCP-Only Sources** (queried on demand):
- `Token-Governance.md` — when reviewing token compliance tests
- `Component-Development-Standards.md` — when reviewing component test coverage
- `Component-Inheritance-Structures.md` — when auditing behavioral contract tests (including accessibility)
- `Release Management System.md` — when reviewing release-related tests
- `Technology Stack.md` — platform context for test validation
- `Rosetta-System-Architecture.md` — when auditing token pipeline tests

**Resource Loading Rationale**: Skill resources (~13) load only name + description metadata (~30-50 tokens each, ~500-700 total). Thurgood's cross-cutting role requires awareness of process, test, and spec standards simultaneously. MCP-only docs are domain-specific references queried during active auditing, not needed for general awareness.

**Spec Formalization Workflow**:
1. Peter develops a design outline collaboratively with relevant agents
2. Ada and Lina contribute technical details to the outline
3. Thurgood reviews the outline for testability and quality
4. Once Peter approves the outline, Thurgood writes requirements.md, design.md, tasks.md following Process-Spec-Planning standards
5. Ada and Lina review the formal spec for technical accuracy
6. Peter approves the formal spec

Thurgood's prompt needs sections for "spec formalization mode" (writing specs), "audit mode" (test health analysis), and "test governance mode" (standards enforcement).

**Write Access**: `src/__tests__/**`, `.kiro/specs/**`, `docs/specs/**` (for spec formalization, test governance, and summary docs)

---

## Inter-Agent Collaboration Patterns

| Scenario | From | To | Nature |
|----------|------|----|--------|
| Component needs new token | Lina | Ada | Concern flag: "This component needs a token that doesn't exist" |
| Token change affects components | Ada | Lina | Concern flag: "Token X changed, components may need updates" |
| Test audit finds component issue | Thurgood | Lina | Concern flag: "Component X has failing behavioral contract tests" |
| Test audit finds token issue | Thurgood | Ada | Concern flag: "Token compliance test reveals governance violation" |
| Component work reveals token gap | Lina | Ada | Feedback: "The token system doesn't cover this use case" |
| Spec needs formalization | Ada/Lina | Thurgood | Handoff: "Design outline approved, please formalize" |
| Spec quality concern | Thurgood | Ada/Lina | Concern flag: "These acceptance criteria aren't testable" |

All handoffs are human-mediated. Peter decides when to invoke each agent and carries context between them.

---

## Resolved Questions

1. ✅ **Steering doc restructuring**: Not needed initially. Agents use MCP queries to access existing docs selectively. Revisit if agents consistently struggle to find what they need.
2. ✅ **MCP server changes**: Not needed. Existing MCP server capabilities (get_section, get_document_summary, etc.) are sufficient for agent workflows.
3. ✅ **Agent-specific hooks**: Yes — `userTriggered` hooks for domain-specific validation. Lightweight `agentSpawn` hooks for quick context only.
4. ✅ **Build order**: Ada first (Peter's choice), then Lina, then Thurgood.
5. ✅ **Agent interaction with specs**: Agents contribute to design outlines collaboratively. Thurgood formalizes into specs. Domain agents execute tasks. All doc changes follow ballot measure model.
6. ✅ **Existing steering doc compatibility**: Core Goals, AI-Collaboration-Principles, Personal Note always loaded. Everything else via `skill://` or MCP on-demand.
7. ✅ **Keyboard shortcuts**: `ctrl+shift+a` (Ada), `ctrl+shift+l` (Lina), `ctrl+shift+t` (Thurgood).
8. ✅ **Documentation governance**: Ballot measure model — agents propose, Peter approves. Applies to all agents.
9. ✅ **Spec workflow**: Two-tier review (full review default, single-domain escape hatch). Design outline checklist for tracking agent signoffs.
10. ✅ **Agent validation approach**: Domain agent defines what to test, Thurgood designs the tests. Cross-domain check built in.
11. ✅ **Knowledge base for Ada**: Include `knowledgeBase` indexing of `src/tokens/` in Ada's config.
12. ✅ **Thurgood write access**: `src/__tests__/**`, `.kiro/specs/**`, `docs/specs/**` — includes summary doc path needed for spec formalization workflow.
13. ✅ **Thurgood knowledge base**: No knowledge base. Thurgood's analytical/governance mission is better served by direct file reads and MCP queries. Tests are scattered across multiple directories, making a single index impractical. Can be added later if needed.
14. ✅ **Thurgood skill resources**: ~13 skill resources covering process docs, test standards, audit methodology, spec planning, and collaboration framework. MCP-only for domain-specific docs (token governance, component standards, etc.).
15. ✅ **Thurgood hooks**: Three userTriggered hooks — "Test Suite Health Audit", "Spec Quality Scan", "Accessibility Test Coverage Audit". The accessibility hook was motivated by a silent accessibility implementation error that no test caught.
16. ✅ **Spec formalization workflow**: Peter develops design outline with agents → Ada/Lina contribute technical details → Thurgood reviews for testability → Thurgood writes formal spec (requirements.md, design.md, tasks.md) → Ada/Lina review for technical accuracy → Peter approves.
17. ✅ **Thurgood's own validation**: Ada and Lina review from their domain perspectives, Peter validates throughout. Thurgood cannot validate himself.

---

## Decisions Made in Discussion

- ✅ Agents use distinct names from the systems they serve (Ada/Lina/Thurgood, not Rosetta/Stemma)
- ✅ Hybrid architecture: agent JSON config + system prompt file + shared MCP knowledge layer
- ✅ Collaboration model: domain respect with mutual concern-flagging, not adversarial checks
- ✅ Fallibility acknowledged: all agents (and Peter) can be wrong; system handles graceful correction
- ✅ Documentation governance: ballot measure model — agents propose changes, Peter votes
- ✅ Thurgood's expanded scope: test governance + audit + spec creation standards + design outline formalization
- ✅ Spec workflow: two-tier review process (full review with all-agent signoff, single-domain escape hatch)
- ✅ Design outline checklist: Ada ☐ Lina ☐ Thurgood ☐ Peter ☐
- ✅ Agent-specific hooks: userTriggered for validation, lightweight agentSpawn for context
- ✅ Resource loading: `file://` for essentials, `skill://` for progressive loading, MCP for on-demand queries
- ✅ Testing agent (Thurgood) scoped as governance/audit/spec-standards, not test writing — Lina and Ada own tests for their domains
- ✅ Shared MCP server is the single source of truth for domain knowledge
- ✅ Agent validation: domain agent defines acceptance criteria, Thurgood designs the tests (consistent with domain respect model)
- ✅ Knowledge base indexing: included for Ada (`src/tokens/`), low-cost searchable access to token source
- ✅ Thurgood's write access includes `docs/specs/**` for summary docs during spec formalization
- ✅ Thurgood has no knowledge base — analytical mission better served by direct reads and MCP queries
- ✅ Thurgood gets "Accessibility Test Coverage Audit" hook — motivated by silent accessibility error that slipped through existing test coverage
- ✅ Accessibility hook scoped as coverage audit (do accessibility tests exist?) not accessibility checking (is the code accessible?) — respects domain boundaries with Lina and Ada

---

## Implementation Considerations

### Prerequisites
- Audit existing steering docs for agent-readiness (are MCP queries sufficient for each agent's needs?)
- Define system prompt format and content for each agent

### Agent Validation Approach

Each agent needs defined acceptance criteria before being declared "done." The validation follows the domain respect model:

1. **Domain agent defines what to test**: The agent being validated (e.g., Ada) defines the acceptance criteria — what correct behavior looks like in their domain
2. **Thurgood designs the tests**: Thurgood takes those criteria and designs rigorous validation scenarios
3. **Cross-domain check built in**: If the domain agent's criteria don't translate into testable requirements, that's a signal something needs clarification

This pattern applies consistently:
- Ada defines correct token behavior → Thurgood designs token agent validation
- Lina defines correct component behavior → Thurgood designs component agent validation
- Thurgood's own validation → Ada and Lina review from their domain perspectives, Peter validates

Validation scenarios include (at minimum):
- Domain-appropriate request → agent responds with domain expertise
- Out-of-domain request → agent defers to appropriate specialist
- Hook triggers → hooks execute expected validation
- Governance scenarios → agent follows ballot measure model for doc changes

### Phased Approach
1. **Phase 1**: Build Ada as proof of concept (requirements drafted, see `ada-agent/requirements.md`)
2. **Phase 2**: Validate the hybrid knowledge architecture works in practice
3. **Phase 3**: Build Lina based on lessons learned from Ada
4. **Phase 4**: Build Thurgood, including spec formalization workflow
5. **Phase 5**: Formalize inter-agent collaboration patterns based on real usage

---

## Agent Review
- [ ] Ada (Rosetta/Token review)
- [ ] Lina (Stemma/Component review)
- [ ] Thurgood (Quality/Testability review)
- [ ] Peter (Final approval)

---

*This design outline captures the collaborative discussion between Peter and the AI agent on 2026-02-13. It is intended as a starting point for formal spec development, not a final design.*
