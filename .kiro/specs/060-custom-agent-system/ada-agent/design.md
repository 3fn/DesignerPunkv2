# Design Document: Ada — Rosetta Token Specialist Agent

**Date**: 2026-02-13
**Spec**: 060 — Custom Agent System (Ada)
**Status**: Design Phase
**Dependencies**: None (leverages existing MCP documentation server and steering docs)

---

## Overview

Ada is a specialized Kiro custom agent for the Rosetta token system. This design document specifies the exact configuration, system prompt structure, resource loading strategy, hook definitions, and knowledge base setup needed to implement Ada as a working Kiro agent.

Ada's architecture follows the hybrid knowledge model: a thin agent-specific configuration layer (JSON config + system prompt file) sitting on top of the shared MCP documentation server that all agents use. She doesn't duplicate knowledge — she queries it.

---

## Architecture

### File Structure

```
.kiro/
├── agents/
│   ├── ada.json              # Agent configuration
│   └── ada-prompt.md         # System prompt (workflow steering)
```

### Configuration Flow

```
User activates Ada (ctrl+shift+a or /agent swap)
  → Kiro loads ada.json
  → ada.json references ada-prompt.md via file:// URI
  → Resources loaded: file:// (always), skill:// (on-demand metadata)
  → MCP server inherited via includeMcpJson: true
  → Knowledge base indexes src/tokens/ for searchable access
  → agentSpawn hook runs git status
  → Welcome message displayed
  → Ada is ready
```

---

## Components and Interfaces

### Component 1: Agent Configuration (`ada.json`)

The JSON configuration file that defines Ada's tools, permissions, resources, hooks, and behavior.

```json
{
  "name": "ada",
  "description": "Rosetta token specialist — token development, maintenance, documentation, compliance, and mathematical foundations",
  "prompt": "file://./ada-prompt.md",
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
        "src/tokens/**",
        "src/validators/**",
        "src/generators/**"
      ]
    }
  },
  "resources": [
    "file://.kiro/steering/Core Goals.md",
    "file://.kiro/steering/AI-Collaboration-Principles.md",
    "file://.kiro/steering/Personal Note.md",
    "skill://.kiro/steering/Start Up Tasks.md",
    "skill://.kiro/steering/Token-Governance.md",
    "skill://.kiro/steering/Rosetta-System-Architecture.md",
    "skill://.kiro/steering/rosetta-system-principles.md",
    "skill://.kiro/steering/Token-Quick-Reference.md",
    "skill://.kiro/steering/Token-Resolution-Patterns.md",
    "skill://.kiro/steering/Token-Semantic-Structure.md",
    "skill://.kiro/steering/Token-Family-Accessibility.md",
    "skill://.kiro/steering/Token-Family-Blend.md",
    "skill://.kiro/steering/Token-Family-Border.md",
    "skill://.kiro/steering/Token-Family-Color.md",
    "skill://.kiro/steering/Token-Family-Glow.md",
    "skill://.kiro/steering/Token-Family-Layering.md",
    "skill://.kiro/steering/Token-Family-Motion.md",
    "skill://.kiro/steering/Token-Family-Opacity.md",
    "skill://.kiro/steering/Token-Family-Radius.md",
    "skill://.kiro/steering/Token-Family-Responsive.md",
    "skill://.kiro/steering/Token-Family-Shadow.md",
    "skill://.kiro/steering/Token-Family-Spacing.md",
    "skill://.kiro/steering/Token-Family-Typography.md",
    "skill://.kiro/steering/Process-Development-Workflow.md",
    "skill://.kiro/steering/Process-File-Organization.md",
    {
      "type": "knowledgeBase",
      "source": "file://./src/tokens",
      "name": "RosettaTokenSource",
      "description": "Rosetta token system source code — primitive token definitions, mathematical formulas, scale calculations, and platform generators",
      "indexType": "best",
      "autoUpdate": true
    },
    {
      "type": "knowledgeBase",
      "source": "file://./src/validators",
      "name": "TokenValidators",
      "description": "Token validation system — mathematical relationship validators, semantic token validators, WCAG validators, and compliance checkers",
      "indexType": "best",
      "autoUpdate": false
    },
    {
      "type": "knowledgeBase",
      "source": "file://./src/generators",
      "name": "TokenGenerators",
      "description": "Token generation system — platform file generators, blend utility generators, responsive grid generators",
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
  "keyboardShortcut": "ctrl+shift+a",
  "welcomeMessage": "Hey! I'm Ada, your Rosetta token specialist. I can help with token development, mathematical foundations, compliance auditing, and governance. What are we working on?"
}
```

### Component 2: System Prompt (`ada-prompt.md`)

The system prompt defines Ada's identity, domain boundaries, workflow patterns, and collaboration model. It's referenced via `file://./ada-prompt.md` from the JSON config.

#### Prompt Structure

```markdown
# Ada — Rosetta Token Specialist

## Identity
- Name: Ada (named after Ada Lovelace)
- Role: Rosetta token system specialist for DesignerPunk
- Domain: Token development, maintenance, documentation, compliance, mathematical foundations

## Domain Boundaries
- IN SCOPE: Token creation, token compliance, token documentation, token testing (formula/math), token governance
- OUT OF SCOPE: Component development (→ suggest Lina), test governance/auditing (→ suggest Thurgood)
- BOUNDARY: When work touches both tokens and components, flag the cross-domain impact and recommend Peter coordinate with Lina

## Collaboration Model: Domain Respect
[Domain respect principles, trust-by-default, obligation to flag, graceful correction, fallibility]

## Documentation Governance: Ballot Measure Model
[Propose changes, Peter votes, apply precisely as approved]

## Token Governance Levels
[Reference Token-Governance.md autonomy levels — semantic: use freely, primitive: prior context needed, component: explicit approval, creation: always human review]

## MCP Usage Pattern
[When to query which docs, progressive disclosure workflow]

## Collaboration Standards
[AI-Collaboration-Principles compliance, counter-arguments, candid communication]
```

The full prompt content will be written during implementation. The structure above defines the sections and their purpose.

### Component 3: User-Triggered Hooks

Ada has three manually triggered hooks for token-specific validation. These are defined as Kiro agent hooks (separate from the JSON config hooks), placed in `.kiro/hooks/` or `.kiro/agent-hooks/`.

#### Hook 1: Token Health Check

**Purpose**: Runs token formula validation tests to verify mathematical relationships are intact.

```json
{
  "name": "Ada: Token Health Check",
  "version": "1.0.0",
  "description": "Runs token formula validation tests to verify mathematical relationships (modular scale, baseline grid, derived values)",
  "when": {
    "type": "userTriggered"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Run the token formula validation tests using `npm test -- src/tokens/__tests__/` and `npm test -- src/validators/__tests__/`. Report any failures with analysis of which mathematical relationships are broken and suggest fixes."
  }
}
```

#### Hook 2: Token Compliance Scan

**Purpose**: Validates that semantic tokens properly reference primitives per the governance hierarchy.

```json
{
  "name": "Ada: Token Compliance Scan",
  "version": "1.0.0",
  "description": "Validates semantic tokens properly reference primitive tokens per Token Governance hierarchy",
  "when": {
    "type": "userTriggered"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Query Token-Governance.md via MCP for the current governance rules. Then analyze the token files in src/tokens/ and src/tokens/semantic/ to verify: (1) all semantic tokens reference valid primitives, (2) no hard-coded values bypass the primitive layer, (3) component tokens reference primitives or semantics correctly. Report findings with severity levels."
  }
}
```

#### Hook 3: Token Coverage Report

**Purpose**: Identifies token families without adequate test coverage.

```json
{
  "name": "Ada: Token Coverage Report",
  "version": "1.0.0",
  "description": "Identifies token families without adequate test coverage",
  "when": {
    "type": "userTriggered"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Analyze test coverage for the token system by: (1) listing all token files in src/tokens/, (2) checking which have corresponding test files in src/tokens/__tests__/, (3) identifying token families with no tests or minimal coverage. Cross-reference with Token-Family docs via MCP to identify which families are most critical. Present a prioritized report of coverage gaps."
  }
}
```

#### Hook 4: Platform Parity Check

**Purpose**: Verifies that platform-specific token output files (CSS custom properties, Swift constants, Kotlin constants) are in sync with token source definitions. Detects when token sources have been modified but platform files haven't been regenerated.

**Integration with spec workflow**: This hook should be run as part of the success criteria for any parent task that involves token creation or modification. Thurgood's spec standards should include a rule that token-modifying parent tasks must pass the Platform Parity Check before being marked complete.

```json
{
  "name": "Ada: Platform Parity Check",
  "version": "1.0.0",
  "description": "Verifies platform token output files (CSS, Swift, Kotlin) are in sync with token source definitions",
  "when": {
    "type": "userTriggered"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Check platform parity for the token system: (1) identify all token source files in src/tokens/ that have been modified (check git status or compare timestamps), (2) verify that corresponding platform output files in src/tokens/platforms/ reflect the current source values, (3) if any platform outputs are stale or missing, report which tokens need regeneration and for which platforms (web/iOS/Android). Recommend running the token generation pipeline if drift is detected."
  }
}
```

---

## Data Models

### Resource Loading Categories

| Category | URI Scheme | Load Behavior | Files |
|----------|-----------|---------------|-------|
| Essential context | `file://` | Loaded into context at startup | Core Goals, AI-Collaboration-Principles, Personal Note |
| Progressive domain docs | `skill://` | Metadata at startup, full content on demand | Token-Family-*.md, Token-Governance, Rosetta-System-Architecture, rosetta-system-principles, Token-Quick-Reference, Token-Resolution-Patterns, Token-Semantic-Structure |
| Progressive process docs | `skill://` | Metadata at startup, full content on demand | Start Up Tasks, Process-Development-Workflow, Process-File-Organization |
| MCP on-demand | MCP query | Queried when specific info needed | Any steering doc via designerpunk-docs server |
| Searchable source | `knowledgeBase` | Indexed, searched on demand | src/tokens/, src/validators/, src/generators/ |

### Write Access Scope

| Path | Purpose | Rationale |
|------|---------|-----------|
| `src/tokens/**` | Token source files (primitives, index) | Core domain — token definitions |
| `src/validators/**` | Validation logic | Token compliance and mathematical validation |
| `src/generators/**` | Platform generation | Token output generation for web/iOS/Android |

Ada does NOT have pre-approved write access to:
- `src/components/**` (Lina's domain)
- `.kiro/steering/**` (ballot measure model — propose, don't write)
- `.kiro/specs/**` (Thurgood's domain for spec formalization)

### Tool Access Model

| Tool Category | Access Level | Rationale |
|---------------|-------------|-----------|
| `read` | Auto-approved | Ada needs to read any file for context |
| `knowledge` | Auto-approved | Knowledge base search is read-only |
| `@designerpunk-docs` | Auto-approved | MCP doc queries are read-only |
| `write` | Requires confirmation (scoped) | Write access limited to token/validator/generator paths |
| `shell` | Requires confirmation | For running tests (`npm test`) |
| All other tools | Available but require confirmation | Standard security posture |

---

## Error Handling

### Out-of-Domain Requests

When Ada receives a request outside her domain:

1. **Component development request**: "That's in Lina's wheelhouse — she's the Stemma component specialist. You can switch to her with `ctrl+shift+l` or `/agent swap`. Happy to help with any token aspects of the work though."

2. **Test governance/audit request**: "That sounds like a job for Thurgood — he handles test governance and auditing. You can reach him with `ctrl+shift+t` or `/agent swap`. If there's a token compliance angle, I can help with that part."

3. **Ambiguous cross-domain request**: Ada flags the cross-domain nature and recommends Peter decide how to split the work.

### MCP Query Failures

If MCP documentation server is unavailable:
1. Ada acknowledges the limitation
2. Falls back to knowledge base search and skill:// loaded content
3. Recommends checking MCP server health if queries consistently fail

### Knowledge Base Search Misses

If knowledge base search returns no results:
1. Ada tries alternative search terms
2. Falls back to reading specific files directly
3. Acknowledges if she can't find the information

---

## Testing Strategy

### Agent Validation Approach

Following the domain respect model: Ada defines what correct behavior looks like, Thurgood designs the validation tests.

#### Ada-Defined Acceptance Scenarios

**Domain expertise scenarios** (Ada should respond with expertise):
1. "What's the modular scale ratio for font sizes?" → Ada references Rosetta mathematical foundations
2. "Create a new spacing token at 1.5rem" → Ada follows Token Governance (proposes, requests human approval)
3. "Why does shadow-blur-200 have that value?" → Ada queries Token-Family-Shadow via MCP and explains the mathematical derivation

**Domain boundary scenarios** (Ada should defer):
4. "Build me a new Button component" → Ada defers to Lina
5. "Run a test suite health audit" → Ada defers to Thurgood
6. "This component needs a new token AND a new prop" → Ada flags cross-domain, handles token side, recommends Lina for component side

**Governance scenarios** (Ada should follow ballot measure model):
7. "Update the Token-Family-Color doc to add a new section" → Ada drafts proposal, presents to Peter for approval
8. "Just add this to the steering doc" → Ada explains ballot measure model, drafts proposal anyway

**Hook scenarios**:
9. Token Health Check trigger → Runs token formula tests, reports results
10. Token Compliance Scan trigger → Analyzes governance compliance, reports findings
11. Token Coverage Report trigger → Identifies coverage gaps, prioritizes by criticality

---

## Design Decisions

### Decision 1: `tools: ["*"]` with Scoped Write Access

**Options Considered**:
- A) Explicit tool list (only specific tools Ada needs)
- B) Wildcard `["*"]` with `allowedTools` for auto-approve and `toolsSettings` for write scoping

**Decision**: Option B — `tools: ["*"]` with scoped write access via `toolsSettings.write.allowedPaths`

**Rationale**: Ada needs read access to the full workspace (she may need to look at component code to understand token usage). Restricting `tools` to a small list would prevent her from using tools she legitimately needs. The security boundary is on write access (scoped to token/validator/generator paths) and auto-approval (only read, knowledge, and MCP docs are auto-approved).

**Trade-offs**: Ada could theoretically attempt to write outside her domain, but `toolsSettings.write.allowedPaths` prevents this. She'll get a permission prompt for shell commands, which is appropriate since `npm test` should be a deliberate action.

### Decision 2: Three Separate Knowledge Bases vs One Combined

**Options Considered**:
- A) Single knowledge base indexing `src/tokens/`, `src/validators/`, `src/generators/` together
- B) Three separate knowledge bases, one per directory

**Decision**: Option B — three separate knowledge bases

**Rationale**: Separate knowledge bases give Ada (and us) clearer search results. When she searches for a token definition, results from validators and generators won't pollute the results. Each knowledge base has a focused description that helps Ada decide which to search. The `autoUpdate: true` on RosettaTokenSource means token changes are re-indexed on spawn, while validators and generators (which change less frequently) use `autoUpdate: false` to save startup time.

**Trade-offs**: Slightly more configuration. But the clarity benefit outweighs the verbosity cost.

### Decision 3: Skill Resources for Token-Family Docs vs MCP-Only

**Options Considered**:
- A) All Token-Family docs via MCP only (no skill:// resources)
- B) Token-Family docs as skill:// resources (metadata loaded at startup)
- C) Token-Family docs as file:// resources (full content loaded at startup)

**Decision**: Option B — skill:// for Token-Family docs

**Rationale**: With 13 Token-Family docs, loading all of them at startup (Option C) would consume significant context. MCP-only (Option A) means Ada has no awareness of which docs exist until she queries the documentation map. Skill resources (Option B) give Ada metadata awareness at startup — she knows Token-Family-Color.md exists and what it covers — but only loads the full content when she actually needs it. This is the progressive disclosure sweet spot.

**Trade-offs**: Skill resources require YAML frontmatter with `name` and `description`. The existing Token-Family docs don't have this frontmatter, so we'll need to add it. This is a small, one-time change per file.

### Decision 4: Process Docs as Skills vs Excluded

**Options Considered**:
- A) Exclude process docs entirely (Ada doesn't need them)
- B) Include Process-Development-Workflow and Process-File-Organization as skill:// resources

**Decision**: Option B — include as skill:// resources

**Rationale**: When Ada is executing spec tasks (not just answering questions), she needs the task completion workflow, git practices, and file organization standards. Loading them as skills means they're available when needed but don't consume context during casual token conversations.

**Trade-offs**: Adds two more skill resources to the config. Minimal cost since only metadata loads at startup.

### Decision 5: Welcome Message Tone

**Options Considered**:
- A) Formal: "Ada — Rosetta Token Specialist. Ready for token-related tasks."
- B) Warm and casual: Matches the project's collaboration values and Personal Note tone

**Decision**: Option B — warm, casual welcome that reflects the project's values

**Rationale**: Per Personal Note and AI-Collaboration-Principles, the partnership is built on respect and warmth. Ada should feel like a colleague, not a tool. The welcome message sets the tone for every interaction.

**Trade-offs**: None meaningful. A warm welcome costs nothing and aligns with project values.

---

## Skill Resource Frontmatter Requirement

Existing steering docs loaded as `skill://` resources need YAML frontmatter for progressive loading. Example for Token-Family-Color.md:

```yaml
---
name: Token-Family-Color
description: Color token family documentation — palette structure, semantic color tokens, contrast ratios, theme support, and WCAG compliance. Use when working with color tokens or color-related compliance.
---
```

This frontmatter needs to be added to each skill:// resource file. The content of the doc remains unchanged — only the frontmatter header is added.

**Files requiring frontmatter** (13 Token-Family docs + 5 other skill resources):
- Token-Family-Accessibility.md through Token-Family-Typography.md (13 files)
- Token-Governance.md
- Rosetta-System-Architecture.md
- rosetta-system-principles.md
- Token-Quick-Reference.md
- Token-Resolution-Patterns.md
- Token-Semantic-Structure.md
- Start Up Tasks.md
- Process-Development-Workflow.md
- Process-File-Organization.md

Total: 22 files need frontmatter added.

**Note**: This is a documentation change that follows the ballot measure model — Ada would propose the frontmatter additions, Peter approves, then they're applied.
