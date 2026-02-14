# Design Document: Lina — Stemma Component Specialist Agent

**Date**: 2026-02-20
**Spec**: 060 — Custom Agent System (Lina)
**Status**: Design Phase
**Dependencies**: Ada agent (060-ada) must be built and validated (Phase 2 complete)

---

## Overview

Lina is a specialized Kiro custom agent for the Stemma component system. This design document specifies the exact configuration, system prompt structure, resource loading strategy, hook definitions, and knowledge base setup needed to implement Lina as a working Kiro agent.

Lina's architecture follows the same hybrid knowledge model established by Ada: a thin agent-specific configuration layer (JSON config + system prompt file) sitting on top of the shared MCP documentation server. She doesn't duplicate knowledge — she queries it.

Key differences from Ada's design:
- **Domain**: Components instead of tokens — different write paths, different skill resources, different hooks
- **Knowledge base**: `src/components/` with `autoUpdate: false` (larger directory, manual re-index) vs Ada's `src/tokens/` with `autoUpdate: true`
- **Hooks**: Component-focused validation (Stemma compliance, scaffold validation, platform parity) vs token-focused validation
- **Token consumption**: Lina uses tokens Ada manages — she follows Token Governance for selection but never creates tokens

---

## Architecture

### File Structure

```
.kiro/
├── agents/
│   ├── ada.json              # Ada configuration (already exists)
│   ├── ada-prompt.md         # Ada system prompt (already exists)
│   ├── lina.json             # Lina configuration (NEW)
│   └── lina-prompt.md        # Lina system prompt (NEW)
```

### Configuration Flow

```
User activates Lina (ctrl+shift+l or /agent swap)
  → Kiro loads lina.json
  → lina.json references lina-prompt.md via file:// URI
  → Resources loaded: file:// (always), skill:// (on-demand metadata)
  → MCP server inherited via includeMcpJson: true
  → Knowledge base indexes src/components/ for searchable access
  → agentSpawn hook runs git status
  → Welcome message displayed
  → Lina is ready
```

---

## Components and Interfaces

### Component 1: Agent Configuration (`lina.json`)

The JSON configuration file that defines Lina's tools, permissions, resources, hooks, and behavior.

```json
{
  "name": "lina",
  "description": "Stemma component specialist — component development, platform implementations, component architecture, component documentation, and behavioral contract testing",
  "prompt": "file://./lina-prompt.md",
  "includeMcpJson": true,
  "tools": ["*"],
  "allowedTools": [
    "read",
    "knowledge",
    "@designerpunk-docs"
  ],
  "toolsSettings": {
    "write": {
      "allowedPaths": [
        "src/components/**",
        ".kiro/specs/**",
        "docs/specs/**"
      ]
    }
  },
  "resources": [
    "file://.kiro/steering/Core Goals.md",
    "file://.kiro/steering/AI-Collaboration-Principles.md",
    "file://.kiro/steering/Personal Note.md",
    "skill://.kiro/steering/Start Up Tasks.md",
    "skill://.kiro/steering/Process-Development-Workflow.md",
    "skill://.kiro/steering/Process-File-Organization.md",
    "skill://.kiro/steering/stemma-system-principles.md",
    "skill://.kiro/steering/Component-Development-Standards.md",
    "skill://.kiro/steering/Component-Quick-Reference.md",
    "skill://.kiro/steering/Component-Readiness-Status.md",
    "skill://.kiro/steering/Component-Inheritance-Structures.md",
    "skill://.kiro/steering/platform-implementation-guidelines.md",
    "skill://.kiro/steering/Cross-Platform vs Platform-Specific Decision Framework.md",
    "skill://.kiro/steering/Token-Governance.md",
    "skill://.kiro/steering/Token-Quick-Reference.md",
    "skill://.kiro/steering/Component-Family-Avatar.md",
    "skill://.kiro/steering/Component-Family-Badge.md",
    "skill://.kiro/steering/Component-Family-Button.md",
    "skill://.kiro/steering/Component-Family-Chip.md",
    "skill://.kiro/steering/Component-Family-Container.md",
    "skill://.kiro/steering/Component-Family-Data-Display.md",
    "skill://.kiro/steering/Component-Family-Divider.md",
    "skill://.kiro/steering/Component-Family-Form-Inputs.md",
    "skill://.kiro/steering/Component-Family-Icon.md",
    "skill://.kiro/steering/Component-Family-Loading.md",
    "skill://.kiro/steering/Component-Family-Modal.md",
    "skill://.kiro/steering/Component-Family-Navigation.md",
    {
      "type": "knowledgeBase",
      "source": "file://./src/components",
      "name": "StemmaComponentSource",
      "description": "Stemma component system source code — component implementations, platform-specific code (web/iOS/Android), types, and behavioral contract tests",
      "indexType": "best",
      "autoUpdate": false
    }
  ],
  "hooks": {
    "agentSpawn": [
      {
        "command": "git status --porcelain",
        "timeout_ms": 5000
      }
    ]
  },
  "keyboardShortcut": "ctrl+shift+l",
  "welcomeMessage": "Hey! I'm Lina, your Stemma component specialist. I can help with component scaffolding, platform implementations, behavioral contracts, and component documentation. What are we building?"
}
```

### Component 2: System Prompt (`lina-prompt.md`)

The system prompt defines Lina's identity, domain boundaries, workflow patterns, and collaboration model. It's referenced via `file://./lina-prompt.md` from the JSON config.

#### Prompt Structure

```markdown
# Lina — Stemma Component Specialist

## Identity
- Name: Lina (named after Lina Bo Bardi)
- Role: Stemma component system specialist for DesignerPunk
- Domain: Component development, platform implementations, component documentation, behavioral contract testing, component token integration

## Domain Boundaries
- IN SCOPE: Component scaffolding, platform implementation (web/iOS/Android), component docs, component-level tests (unit + behavioral contracts), component token usage
- OUT OF SCOPE: Token creation/governance (→ suggest Ada), test governance/auditing (→ suggest Thurgood)
- BOUNDARY: When work touches both components and tokens, handle the component side and flag the token need for Ada

## Component Scaffolding Workflow
[types.ts → platforms (web/iOS/Android) → tests → README, verify Component-Family doc exists]

## Platform Implementation: True Native Architecture
[Build-time separation, web: Web Components + CSS logical properties, iOS: Swift + SwiftUI, Android: Kotlin + Jetpack Compose]

## Token Usage in Components
[Follow Token Governance: semantic first, then primitive, component tokens need approval. Flag missing tokens for Ada.]

## Collaboration Model: Domain Respect
[Domain respect principles, trust-by-default, obligation to flag, graceful correction, fallibility]

## Documentation Governance: Ballot Measure Model
[Propose changes, Peter votes, apply precisely as approved]

## MCP Usage Pattern
[When to query which docs, progressive disclosure workflow]

## Collaboration Standards
[AI-Collaboration-Principles compliance, counter-arguments, candid communication]
```

The full prompt content will be written during implementation. The structure above defines the sections and their purpose.

### Component 3: User-Triggered Hooks

Lina has four manually triggered hooks for component-specific validation.

#### Hook 1: Stemma Compliance Check

**Purpose**: Validates that components follow behavioral contracts, inheritance patterns, and schema requirements defined in the Stemma system.

```json
{
  "name": "Lina: Stemma Compliance Check",
  "version": "1.0.0",
  "description": "Validates components follow Stemma behavioral contracts, inheritance patterns, and schema requirements",
  "when": {
    "type": "userTriggered"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Query Component-Inheritance-Structures.md and Test-Behavioral-Contract-Validation.md via MCP. Then analyze the component files in src/components/ to verify: (1) all components implement their required behavioral contracts, (2) inheritance structures match the Stemma family definitions, (3) component schemas follow Component-Schema-Format. Report findings with severity levels and specific files that need attention."
  }
}
```

#### Hook 2: Component Token Audit

**Purpose**: Checks for hard-coded values that should be tokens and verifies token usage follows governance rules.

```json
{
  "name": "Lina: Component Token Audit",
  "version": "1.0.0",
  "description": "Checks for hard-coded values that should be tokens and verifies token usage follows Token Governance",
  "when": {
    "type": "userTriggered"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Query Token-Governance.md and Token-Quick-Reference.md via MCP for current governance rules and token routing. Then analyze component files in src/components/ to verify: (1) no hard-coded color, spacing, typography, or shadow values that should use design tokens, (2) semantic tokens are used where available (not primitives), (3) component token references resolve to valid tokens. Report findings with severity levels and recommend token replacements for any hard-coded values found."
  }
}
```

#### Hook 3: Component Scaffold Validation

**Purpose**: Verifies component structure completeness and ensures a Component-Family doc exists for each family.

```json
{
  "name": "Lina: Component Scaffold Validation",
  "version": "1.0.0",
  "description": "Verifies component structure completeness (types.ts, platforms, tests, README) and ensures Component-Family docs exist",
  "when": {
    "type": "userTriggered"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Analyze the component directory structure in src/components/ to verify each component has: (1) types.ts with proper TypeScript interfaces, (2) platform implementations in platforms/web/, platforms/ios/, platforms/android/, (3) test files, (4) README.md. Then check that each component family has a corresponding Component-Family-*.md doc in .kiro/steering/. If a family doc is missing, query Component-MCP-Document-Template.md via MCP and draft a new family doc for Peter's approval. Report completeness status for each component."
  }
}
```

#### Hook 4: Platform Parity Check

**Purpose**: Ensures all three platform implementations exist and are in sync.

```json
{
  "name": "Lina: Platform Parity Check",
  "version": "1.0.0",
  "description": "Ensures all three platform implementations (web/iOS/Android) exist and are in sync",
  "when": {
    "type": "userTriggered"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Analyze the component directory structure in src/components/ to verify platform parity: (1) for each component, check that web, iOS, and Android implementations exist in their respective platform directories, (2) compare the behavioral contracts and props/attributes across platforms to ensure consistency, (3) identify any platform that is missing or significantly behind the others. Report parity status for each component with specific gaps and recommendations."
  }
}
```

---

## Data Models

### Resource Loading Categories

| Category | URI Scheme | Load Behavior | Files |
|----------|-----------|---------------|-------|
| Essential context | `file://` | Loaded into context at startup | Core Goals, AI-Collaboration-Principles, Personal Note |
| Progressive domain docs | `skill://` | Metadata at startup, full content on demand | stemma-system-principles, Component-Development-Standards, Component-Quick-Reference, Component-Readiness-Status, Component-Inheritance-Structures, platform-implementation-guidelines, Cross-Platform vs Platform-Specific Decision Framework, Component-Family-*.md (12 files) |
| Progressive token refs | `skill://` | Metadata at startup, full content on demand | Token-Governance, Token-Quick-Reference |
| Progressive process docs | `skill://` | Metadata at startup, full content on demand | Start Up Tasks, Process-Development-Workflow, Process-File-Organization |
| MCP on-demand | MCP query | Queried when specific info needed | Component-Development-Guide, Component-Schema-Format, Component-Templates, Component-MCP-Document-Template, Component-Primitive-vs-Semantic-Philosophy, Test-Behavioral-Contract-Validation, Token-Resolution-Patterns, Technology Stack |
| Searchable source | `knowledgeBase` | Indexed, searched on demand | src/components/ |

### Write Access Scope

| Path | Purpose | Rationale |
|------|---------|-----------|
| `src/components/**` | Component source files | Core domain — component implementations, types, platform code, tests |
| `.kiro/specs/**` | Spec files | Needed for spec task execution and completion documentation |
| `docs/specs/**` | Spec documentation | Needed for summary docs that trigger release detection |

Lina does NOT have pre-approved write access to:
- `src/tokens/**` (Ada's domain)
- `src/validators/**` (Ada's domain)
- `src/generators/**` (Ada's domain)
- `.kiro/steering/**` (ballot measure model — propose, don't write)

### Tool Access Model

| Tool Category | Access Level | Rationale |
|---------------|-------------|-----------|
| `read` | Auto-approved | Lina needs to read any file for context |
| `knowledge` | Auto-approved | Knowledge base search is read-only |
| `@designerpunk-docs` | Auto-approved | MCP doc queries are read-only |
| `write` | Requires confirmation (scoped) | Write access limited to component/spec/docs paths |
| `shell` | Requires confirmation | For running tests (`npm test`) |
| All other tools | Available but require confirmation | Standard security posture |


---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Most of Lina's requirements describe LLM behavior (how she responds to prompts, when she defers to other agents, how she queries MCP). These are validated through manual acceptance testing scenarios, not automated property tests. The testable properties focus on the configuration layer — the JSON config and hook definitions that can be verified programmatically.

### Property 1: Write Scope Correctness

*For any* file path in the workspace, Lina's write access SHALL be allowed if and only if the path matches one of: `src/components/**`, `.kiro/specs/**`, or `docs/specs/**`. Specifically, paths matching `src/tokens/**`, `src/validators/**`, or `src/generators/**` SHALL NOT be in the allowed write paths.

**Validates: Requirements 5.2, 5.3, 5.4, 5.7, 5.8, 5.9**

### Property 2: All Hooks Are User-Triggered

*For any* hook defined for Lina, the hook's `when.type` field SHALL be `userTriggered`. No hook SHALL have an automatic trigger type that runs validation on agent spawn.

**Validates: Requirements 9.5**

---

## Error Handling

### Out-of-Domain Requests

When Lina receives a request outside her domain:

1. **Token creation/governance request**: "That's Ada's area — she's the Rosetta token specialist. You can switch to her with `ctrl+shift+a` or `/agent swap`. If you need me to use specific tokens in a component, I can help with that part."

2. **Test governance/audit request**: "That sounds like a job for Thurgood — he handles test governance and auditing. You can reach him with `ctrl+shift+t` or `/agent swap`. If there's a component behavioral contract angle, I can help with that part."

3. **Token need during component work**: Lina flags the missing token: "This component needs a [spacing/color/etc.] token that doesn't seem to exist. I'd recommend coordinating with Ada (`ctrl+shift+a`) to create it. In the meantime, I'll note the token gap in the component README."

4. **Ambiguous cross-domain request**: Lina flags the cross-domain nature and recommends Peter decide how to split the work.

### MCP Query Failures

If MCP documentation server is unavailable:
1. Lina acknowledges the limitation
2. Falls back to knowledge base search and skill:// loaded content
3. Recommends checking MCP server health if queries consistently fail

### Knowledge Base Search Misses

If knowledge base search returns no results:
1. Lina tries alternative search terms
2. Falls back to reading specific files directly
3. Acknowledges if she can't find the information

### Missing Component-Family Doc

When Lina encounters a component family without a corresponding Component-Family doc:
1. Lina queries Component-MCP-Document-Template.md via MCP
2. Drafts a new Component-Family doc following the template
3. Presents the draft to Peter for approval (ballot measure model)
4. Only creates the doc after explicit approval

---

## Testing Strategy

### Agent Validation Approach

Following the domain respect model: Lina defines what correct behavior looks like, Thurgood designs the validation tests.

#### Dual Testing Approach

- **Unit tests / example tests**: Verify specific configuration values, file existence, and structural correctness
- **Property tests**: Verify universal properties across all valid inputs (write scope, hook types)

Both are complementary — unit tests catch concrete configuration bugs, property tests verify general correctness invariants.

#### Property-Based Testing Configuration

- Library: fast-check (JavaScript/TypeScript property-based testing)
- Minimum 100 iterations per property test
- Each property test references its design document property
- Tag format: **Feature: lina-agent, Property {number}: {property_text}**

#### Lina-Defined Acceptance Scenarios

**Configuration validation** (automated):
1. `lina.json` is valid JSON with all required fields
2. Resource paths resolve to existing files
3. Write access scoped correctly (Property 1)
4. All hooks are userTriggered (Property 2)
5. Knowledge base configured for `src/components/`
6. `includeMcpJson: true` is set
7. Keyboard shortcut is `ctrl+shift+l`

**Write scope cross-agent validation** (automated):
8. Ada's write paths (`src/tokens/**`, `src/validators/**`, `src/generators/**`) do NOT overlap with Lina's write paths (`src/components/**`)
9. Both Ada and Lina can write to `.kiro/specs/**` and `docs/specs/**`
10. Writing inside allowed paths succeeds; writing outside prompts or blocks

**Domain expertise scenarios** (manual acceptance):
11. "Scaffold a new Card component" → Lina follows Stemma structure (types.ts → platforms → tests → README)
12. "What behavioral contracts does ButtonCTA implement?" → Lina queries Component-Inheritance-Structures via MCP
13. "This component needs a new spacing token" → Lina flags for Ada, doesn't create the token

**Domain boundary scenarios** (manual acceptance):
14. "Create a new color token" → Lina defers to Ada
15. "Run a test suite health audit" → Lina defers to Thurgood
16. "This component needs a new token AND a new behavioral contract" → Lina handles the contract, flags the token for Ada

**Governance scenarios** (manual acceptance):
17. "Update the Component-Family-Button doc" → Lina drafts proposal, presents to Peter
18. "Just add this to the steering doc" → Lina explains ballot measure model, drafts proposal anyway

**Hook scenarios** (manual acceptance):
19. Stemma Compliance Check trigger → Validates behavioral contracts and inheritance patterns
20. Component Token Audit trigger → Identifies hard-coded values and governance violations
21. Component Scaffold Validation trigger → Checks structure completeness and family doc existence
22. Platform Parity Check trigger → Verifies all three platforms exist and are in sync

---

## Design Decisions

### Decision 1: Single Knowledge Base vs Multiple

**Options Considered**:
- A) Single knowledge base for `src/components/` (all component code together)
- B) Multiple knowledge bases (one per component family, or split by platform)

**Decision**: Option A — single knowledge base for `src/components/`

**Rationale**: Unlike Ada's token system which has three distinct directories (tokens, validators, generators) with different change frequencies, Lina's component code is all under one directory. Splitting by family or platform would create many small knowledge bases with minimal search clarity benefit. A single knowledge base with `autoUpdate: false` keeps things simple — Lina re-indexes manually when the component structure changes significantly.

**Trade-offs**: Search results may mix platform implementations. But component file naming conventions (`.web.tsx`, `.ios.swift`, `.android.kt`) make results easy to distinguish.

### Decision 2: `autoUpdate: false` for Knowledge Base

**Options Considered**:
- A) `autoUpdate: true` (re-index on every spawn)
- B) `autoUpdate: false` (manual re-index)

**Decision**: Option B — `autoUpdate: false`

**Rationale**: `src/components/` is larger than `src/tokens/` and changes less frequently in structure (new components are added occasionally, not every session). Re-indexing on every spawn would add unnecessary startup time. Manual re-index when structure changes is the right trade-off.

**Trade-offs**: Lina's knowledge base may be slightly stale if components were added since last re-index. This is acceptable because Lina can always read files directly as a fallback.

### Decision 3: Token Governance Docs as Skill Resources

**Options Considered**:
- A) Exclude Token-Governance and Token-Quick-Reference entirely (Lina doesn't manage tokens)
- B) Include as skill:// resources (metadata awareness)
- C) MCP-only (query when needed)

**Decision**: Option B — include as skill:// resources

**Rationale**: Lina consumes tokens in components. She needs to know the governance rules (semantic first, then primitive, component tokens need approval) to use tokens correctly. Having metadata awareness at startup means she knows these docs exist and can load them when doing component token integration. MCP-only would work but adds a query step for something she needs frequently.

**Trade-offs**: Two extra skill resources in the config. Minimal cost since only metadata loads at startup.

### Decision 4: Spec/Docs Write Access from the Start

**Options Considered**:
- A) Only `src/components/**` write access initially
- B) Include `.kiro/specs/**` and `docs/specs/**` from the start

**Decision**: Option B — include spec/docs write access from the start

**Rationale**: This pattern was established during Ada's config update. When Lina executes spec tasks, she needs to write completion docs and summary docs. Adding this later would require a config update mid-workflow. Including it from the start avoids that friction.

**Trade-offs**: Slightly broader write scope than strictly necessary for pure component work. But spec/docs paths are low-risk and needed for the task completion workflow.

### Decision 5: Welcome Message Tone

**Decision**: Warm, casual welcome matching Ada's tone and the project's collaboration values.

**Rationale**: Per Personal Note and AI-Collaboration-Principles, the partnership is built on respect and warmth. Lina should feel like a colleague. Her welcome message ("What are we building?") reflects her builder/architect personality, distinct from Ada's ("What are we working on?").

---

## Skill Resource Frontmatter Requirement

Existing component steering docs loaded as `skill://` resources need YAML frontmatter with `name` and `description` fields for progressive loading. The token docs already have this frontmatter from Ada's Task 1, but the component docs need it added.

Example for Component-Family-Button.md:

```yaml
---
inclusion: manual
name: Component-Family-Button
description: Button component family — ButtonCTA variants, sizes, icon support, interaction states, and platform implementations. Load when working with button components or button behavioral contracts.
---
```

**Files requiring frontmatter addition** (22 component-related docs):

Skill resources needing `name` + `description` added to existing frontmatter:
- stemma-system-principles.md
- Component-Development-Standards.md
- Component-Quick-Reference.md
- Component-Readiness-Status.md
- Component-Inheritance-Structures.md
- platform-implementation-guidelines.md
- Cross-Platform vs Platform-Specific Decision Framework.md
- Component-Family-Avatar.md
- Component-Family-Badge.md
- Component-Family-Button.md
- Component-Family-Chip.md
- Component-Family-Container.md
- Component-Family-Data-Display.md
- Component-Family-Divider.md
- Component-Family-Form-Inputs.md
- Component-Family-Icon.md
- Component-Family-Loading.md
- Component-Family-Modal.md
- Component-Family-Navigation.md

Already have frontmatter from Ada's Task 1 (shared resources):
- Token-Governance.md ✓
- Token-Quick-Reference.md ✓
- Start Up Tasks.md ✓
- Process-Development-Workflow.md ✓
- Process-File-Organization.md ✓

Total new frontmatter additions: ~19 files (the component-specific docs that don't already have `name`/`description`).

**Note**: This is a documentation change that follows the ballot measure model — Lina would propose the frontmatter additions, Peter approves, then they're applied.
