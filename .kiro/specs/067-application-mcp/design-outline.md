# Application MCP: Agent-Facing Component Catalog

**Date**: 2026-03-01
**Purpose**: Evolve the component MCP from a development tool into an application MCP — a callable catalog that agents query to select, compose, and configure components for building experiences
**Organization**: spec-guide
**Scope**: 067-application-mcp
**Status**: Design outline — decisions made, pending Lina/Ada review of final updates

---

## Problem Statement

The component MCP (built in 064, completed in 066) serves agents who *build and maintain* DesignerPunk. It answers "what does this component look like structurally?" — props, tokens, contracts, composition rules.

It does not serve agents who *use* DesignerPunk to build experiences. When an agent receives "build a three-step onboarding flow," it needs to:

1. **Select** appropriate components for the use case
2. **Compose** them into valid assemblies
3. **Configure** them with correct props and values
4. **Validate** that the result is accessible and within system constraints

The current MCP partially supports #1 (via `find_components` and `searchByPurpose`) and #2 (via `check_composition`). It doesn't support #3 or #4 in any meaningful way. And the queries it does support are developer-oriented — they return structural metadata, not application guidance.

The agentic UI strategy doc (`.kiro/docs/agentic-ui-strategy.md`) identified this as the "Application MCP" — a callable catalog distinct from the documentation MCP. The strategy doc's sequencing places it after the contract system (063) and metadata schema (064/066), both of which are now complete.

---

## What Exists Today

### Current MCP Tools (6)

| Tool | Purpose | Application MCP relevance |
|------|---------|--------------------------|
| `get_component_catalog` | Lightweight list of all 28 components | ✅ Foundation — needs enrichment |
| `get_component_summary` | Identity, contracts, token count, annotations | ✅ Good for selection |
| `get_component_full` | Complete assembled metadata | ⚠️ Too much data for selection, useful for configuration |
| `find_components` | Filter by category, concept, platform, purpose | ✅ Core selection tool — needs enhancement |
| `check_composition` | Validate parent-child relationships | ✅ Core composition tool |
| `get_component_health` | Index health status | 🔧 Development tool, not application-facing |

### Current Data That Supports Application Use

**component-meta.yaml annotations** (already indexed):
- `purpose` — what the component is for
- `usage.when_to_use` / `when_not_to_use` — selection guidance
- `contexts` — where the component belongs (68 unique context values across 28 components)
- `alternatives` — what to use instead and why

**Composition model** (already indexed):
- `children.requires` — what must go inside a container
- `children.allowed` / `prohibited` — what can/can't go inside
- `internal` — what the component wraps internally

**Behavioral contracts** (already indexed):
- Active contracts with WCAG mappings
- Exclusions with rationale
- Inheritance chains

### What's Missing

1. **Context-based selection** — `find_components` searches `purpose` and `description` text, not the structured `contexts` array.

2. **Experience patterns** — No concept of multi-component assemblies. An agent can check if Radio-Base goes inside Radio-Set, but can't ask "what does a form page look like?"

3. **Configuration guidance** — Props have types and defaults, but no guidance on *which values to use when*.

4. **Assembly validation** — `check_composition` validates one parent-child pair. No tool validates a complete component tree.

5. **Assembly-level accessibility** — Individual components have WCAG contracts, but no validation that a composed experience meets WCAG holistically.

6. **A2UI output** — No protocol-specific rendering. The strategy doc positions A2UI as the first validation target.

---

## Teaching Philosophy

The MCP is a knowledge layer. How it *teaches* agents to make design decisions matters more than what tools it exposes.

### Three levels of teaching

1. **Answering questions** — "What components exist for forms?" → here's a list. The current MCP does this.
2. **Guiding decisions** — "What should I use for a registration form?" → here's a recommended assembly with rationale. Experience patterns do this.
3. **Correcting mistakes** — "I'm using checkboxes for a mutually exclusive choice" → that's the wrong pattern, use Radio-Set. Assembly validation and `when_not_to_use` guidance do this.

### Hybrid approach (Philosophy C)

The MCP provides structured data plus *just enough* guidance to steer agents toward good decisions without trying to encode all design knowledge. This means:

- **Component annotations** (`when_to_use`, `when_not_to_use`, `alternatives`) — opinionated selection guidance
- **Experience patterns** with hints and accessibility notes — opinionated assembly guidance
- **Composition validation** — structural correctness enforcement
- **Design rationale in hints** — the "why", not just the "what"

The MCP does NOT try to be a design reasoning engine. It provides facts and opinions; the agent applies reasoning. But the opinions are strong enough that a mediocre agent can still produce acceptable results by following them.

### Two-layer separation

Design system guidance is universal. Application practices are project-specific. The MCP owns system-level teaching (how to use DesignerPunk). Project-level teaching (how to apply DesignerPunk to a specific product) is an extension point that products provide. See Experience Pattern Schema for the architecture.

---

## Decisions Made

### D1: Extend existing server
Single server, application tools added alongside development tools. Same index, no inter-server coordination. The strategy doc's "two MCPs" is a conceptual distinction, not a process boundary.

### D2: Enhance `findComponents`, not a new selection tool
Add a `context` filter to the existing `findComponents` method and return an enriched response shape (`ApplicationSummary`) that includes `when_to_use`, `when_not_to_use`, and `alternatives`. No relevance scoring — deterministic filtering, alphabetical sort. The consuming agent decides relevance.

### D3: Hybrid experience patterns with two-layer architecture
Derived-from-contexts queries for discovery. Authored pattern files for assembly guidance. Pattern schema includes `source` (system/project) and `extends` fields from day one. Tier 1 implements system-level only; project-level is an extension point.

### D4: Accessibility validation in Tier 1
Assembly-level accessibility checks are Tier 1, not Tier 2. Implemented as hardcoded checks in an isolated module. Specific checks emerge from the pattern interviews — not predetermined. When pattern count exceeds ~5 or the first project-level pattern is authored, refactor to declarative assertions in pattern files (Ada's recommended architecture).

### D5: 3 initial patterns, ordered for schema validation
Patterns are hypothetical exercises to stress-test the schema, not a production pattern library. Ordered by structural diversity:
1. **Pattern A: Simple single-step form** — establishes baseline schema (flat component list, form-field roles, single action)
2. **Pattern C: Non-form layout** — validates schema handles non-form composition (container components, Radio-Set with required children, list-based layout)
3. **Pattern B: Multi-step flow** — validates sequencing (`steps` with different component sets per step, inter-step navigation)

### D6: Defer `get_prop_guidance` to follow-up spec
Pattern `hints` provide context-specific prop guidance for the immediate need. A standalone per-component guidance tool is a Tier 2 concern for a follow-up spec.

### D7: A2UI deferred to Tier 3
Protocol-independent capabilities first. The 064 mapping exercise proved zero schema omissions against A2UI v0.9 draft. A2UI mapping included only if protocol stabilizes. Not a core deliverable.

### D8: Interview-driven guidance capture
Pattern content authored through structured interviews with Peter. Agents ask questions about component usage, Peter answers, answers become pattern content. Surfaces tacit design knowledge and validates the schema — if an answer has no field to live in, the schema has a gap.

### D9: Token governance convention for hints
Hints reference prop values and semantic intent, never raw pixel/color/spacing values. If a hint needs to reference a visual property, use token names. Stated in the pattern schema definition from day one.

### D10: Assembly input schema resolved during formalization
The input schema for `validate_assembly` defines the agent interaction contract — how an agent represents a component tree. Resolved during formalization phase, before interviews begin. Interviews focus on design judgment (component selection, hints, accessibility), not data structure design.

---

## Scope — Tiered by Value and Dependency Risk

### Tier 1: Core Application Capabilities (no external dependencies)

1. **Enhanced `findComponents`** — Add `context` filter + enriched `ApplicationSummary` response with `when_to_use`, `when_not_to_use`, `alternatives`.

2. **Experience pattern schema and 3 authored patterns** — Define the pattern file format. Author 3 patterns through interviews, ordered A → C → B for structural diversity. Schema co-evolves with first pattern.

3. **`get_experience_pattern` / `list_experience_patterns`** — Serve authored pattern files. Returns component list with roles, sequencing, configuration hints, and composition structure.

4. **`validate_assembly`** — Validate a complete component tree: structural composition checks + assembly-level accessibility checks. Accessibility checks in isolated module, emerging from pattern interviews.

### Tier 2: Enhanced Guidance (follow-up spec)

5. **`get_prop_guidance`** — Deferred. Pattern hints cover immediate need.

### Tier 3: Protocol Integration (defer if unstable)

6. **A2UI schema mapping** — Deferred unless protocol stabilizes.

---

## Experience Pattern Schema

### Two-Layer Architecture

**System-level guidance** — universal to DesignerPunk regardless of project. Ships with the design system.

**Project-level guidance** — specific to the product using DesignerPunk. Extension point, not Tier 1.

```
experience-patterns/          ← system-level (ships with DesignerPunk)
  simple-form.yaml
  non-form-layout.yaml
  multi-step-flow.yaml

project-patterns/             ← project-level (authored per product, future)
  fintech-onboarding.yaml
```

Schema affordances for the project layer (built into schema from day one, not implemented in Tier 1):
- `source` field: `system` or `project`
- `extends` field: reference to a system pattern
- Indexer scans multiple directories
- Queries can filter by source or merge both layers

### Pattern file format

```yaml
name: registration-flow
source: system
description: Multi-step user registration with email, password, and consent
category: onboarding
tags: [registration, signup, account-creation]

steps:
  - name: collect-credentials
    purpose: Collect email and password
    layout: vertical-stack
    components:
      - component: Input-Text-Email
        role: form-field
        required: true
        hints:
          label: "Describe what the email will be used for"
          context: "registration-forms"

      - component: Input-Text-Password
        role: form-field
        required: true
        hints:
          showToggle: true
          isNewPassword: true

      - component: Input-Checkbox-Legal
        role: consent
        required: true
        hints:
          requiresExplicitConsent: true
          context: "Must reference specific legal document"

      - component: Button-CTA
        role: primary-action
        required: true
        hints:
          variant: primary
          label: "Action verb — Create Account, Sign Up, etc."

accessibility:
  - "All form fields must have visible labels"
  - "Focus order follows visual order (top to bottom)"
  - "Error messages announced to screen readers on validation"
  - "Legal consent checkbox must not be pre-checked"

alternatives:
  - pattern: login-form
    reason: "When the user already has an account"
```

Project-level extension (future, not Tier 1):

```yaml
name: fintech-onboarding
source: project
extends: registration-flow
description: Fintech-specific registration with KYC requirements

steps:
  - name: collect-credentials
    components:
      - component: Input-Text-PhoneNumber
        role: form-field
        required: true
        hints:
          label: "Required for account verification"

  - name: identity-verification
    purpose: KYC compliance
    components:
      - component: Input-Text-Base
        role: form-field
        required: true
        hints:
          label: "Full legal name as it appears on ID"
```

### Schema design notes

- **`source`** — `system` or `project`. Tier 1 implements system only. Field exists from day one.
- **`extends`** — optional reference to a system pattern. Not implemented in Tier 1 but schema supports it.
- **`steps`** — ordered sequence. Single-step patterns have one step. Multi-step patterns have multiple.
- **`components[].role`** — semantic role within the pattern (form-field, primary-action, consent, navigation, selection). Not a fixed enum — roles converge on common names across patterns.
- **`components[].hints`** — prop value guidance. Recommendations, not configuration. **Convention: hints reference prop values and semantic intent, never raw pixel/color/spacing values. Use token names for visual properties.**
- **`components[].required`** — whether this component is essential to the pattern or optional.
- **`accessibility`** — assembly-level accessibility requirements beyond individual component contracts.
- **`alternatives`** — other patterns that serve similar purposes, with differentiation guidance.

---

## Execution Sequence

1. Define initial experience pattern schema (best guess at YAML structure)
2. **Interview for Pattern A** (simple single-step form) — fill the schema live, discover gaps
3. Adjust schema based on interview findings
4. **Thurgood reviews schema** — last cheap moment to catch structural issues before indexer is built
5. Build indexer and tools against reviewed schema
6. **Interview for Pattern C** (non-form layout) — validates schema handles structural diversity
7. **Interview for Pattern B** (multi-step flow) — validates sequencing
8. Wire up `validate_assembly` with accessibility checks surfaced from interviews
9. Final verification

The first pattern co-evolves with the schema. Patterns C and B benefit from a battle-tested format.

**Interview domain split:**
- Lina leads: component selection, composition, roles, hints
- Ada consulted: token implications of hints
- Thurgood consulted: contract coverage, assembly-level validation checks

---

## Proposed Tools (Final)

| Tool | Tier | Purpose | Answers |
|------|------|---------|---------|
| `findComponents` (enhanced) | 1 | Add `context` filter + enriched `ApplicationSummary` response | "What components work for a login form?" |
| `get_experience_pattern` | 1 | Retrieve authored assembly pattern | "How do I build a registration flow?" |
| `list_experience_patterns` | 1 | List available patterns | "What patterns exist?" |
| `validate_assembly` | 1 | Tree validation + assembly-level accessibility | "Is this form composition valid and accessible?" |
| `get_prop_guidance` | Deferred | Follow-up spec | — |
| `render_a2ui` | Deferred | Defer unless A2UI stabilizes | — |

---

## Open Items (Resolve During Formalization)

1. **Assembly input schema** — How does an agent represent a component tree for `validate_assembly`? Resolve during formalization (per Lina and Ada: keep interviews focused on design judgment, not data structure design).
2. **Accessibility check set** — Specific checks emerge from pattern interviews, not predetermined. Each pattern type surfaces different assembly-level accessibility requirements.
3. **`list_experience_patterns` response shape** — Lina's call during implementation. Likely: name + description + category + tags.

---

## Estimated Complexity

| Work Item | Tier | Effort | Notes |
|-----------|------|--------|-------|
| Enhanced `findComponents` | 1 | Low | Add context filter + enriched response shape |
| Experience pattern schema | 1 | Low | YAML format design, parser |
| 3 pattern interviews + authoring | 1 | Medium | Design judgment in hints and accessibility notes |
| `get_experience_pattern` / `list_experience_patterns` | 1 | Low | Serve indexed pattern files |
| `validate_assembly` | 1 | Medium | Tree validation + isolated accessibility module |
| Pattern indexer integration | 1 | Low | Extend existing indexer to scan `experience-patterns/` |

Tier 1 is a clean spec's worth of work.

---

## Agent Assignments (Preliminary)

| Area | Recommended Lead | Rationale |
|------|-----------------|-----------|
| Pattern interviews | Lina (lead), Ada + Thurgood (consult) | Component architecture + token + validation perspectives |
| Schema design + iteration | Peter + Lina | Co-evolves with first interview |
| Schema review gate | Thurgood | Structural review before indexer is built |
| Enhanced `findComponents` | Lina | Extends existing query engine |
| `validate_assembly` | Lina | Extends existing composition checker |
| Pattern indexer integration | Lina | Extends existing indexer |
| Accessibility check module | Lina (implement), Thurgood (review) | Checks derived from interviews, reviewed for coverage |
| Tier 1 verification | Thurgood | Catalog integrity, tool validation |
| Token implications review | Ada | Verify hints follow token governance convention |

---

## Connection to Strategy Doc

| Strategy Doc Item | This Spec |
|-------------------|-----------|
| 1. Component Metadata Schema | ✅ Done (064/066) |
| 2. Composition Rules | ✅ Done (064/066) — extended with `validate_assembly` |
| 3. Context-to-Component Mapping | Enhanced `findComponents` + experience patterns |
| 4. Data Contract Definitions | Partially done (contracts.yaml) — `get_prop_guidance` deferred to follow-up |
| 5. Renderer Bridge | A2UI deferred (Tier 3) |
| 6. Validation and Safety Layer | `validate_assembly` with accessibility checks |
| 7. Feedback Loop Mechanism | Out of scope |

---

## Related Documentation

- `.kiro/docs/agentic-ui-strategy.md` — Strategic vision and sequencing
- `.kiro/specs/063-uniform-contract-system/design-outline.md` — Contract system that feeds this work
- `.kiro/specs/064-component-metadata-schema/` — Metadata schema this extends
- `.kiro/specs/064-component-metadata-schema/findings/a2ui-mapping-exercise.md` — A2UI v0.9 mapping (zero schema omissions)
- `.kiro/specs/066-schema-completion/` — Schema completion that provides the 28/28 foundation
- `.kiro/steering/Process-Integration-Methodology.md` — Integration methodology pattern
- `component-mcp-server/` — Existing server to extend

---

## Lina's Notes on Final Outline (2026-03-01)

**Reviewer**: Lina (Stemma Component Specialist)

### Positions Updated from Original Review

**3 patterns — convinced.** I originally advocated for 2. The reframe as schema stress tests rather than pattern library authoring changes the calculus. Pattern A (flat form), C (non-form layout), and B (multi-step flow) exercise three structurally different composition shapes. Two form-like patterns would have validated the schema against variations of the same shape. The non-form layout is what catches schema assumptions I'd bake in unconsciously.

**Accessibility checks not predetermined — better than my original approach.** My first review listed 5 specific hardcoded checks. This version says checks emerge from the interviews. That's more honest. I was prescribing assembly-level accessibility requirements before we'd reasoned through them with real patterns.

### Scheduling Preference on Open Item #1

The outline says the assembly input schema can be resolved "during formalization or early in Pattern A interview." I'd lean toward formalization. The Pattern A interview should focus on component selection and guidance content. Mixing data structure design for a validation tool into the same session could muddy both concerns. Not a design issue — a scheduling preference.

### No Remaining Concerns

The outline is ready for formalization from my perspective. All feedback from my original review and Ada's review is either incorporated or explicitly decided against with rationale.

---

## Ada's Notes on Final Outline (2026-03-01)

**Reviewer**: Ada (Rosetta Token Specialist)

### Positions Updated from Earlier Review

**D4 (Accessibility in Tier 1) — satisfied.** My original position was Tier 2. The compromise — hardcoded checks in an isolated module with an explicit refactor trigger at ~5 patterns — addresses my maintainability concern without blocking Tier 1 value. The additional refinement that checks emerge from interviews rather than being predetermined is more honest than both my original position (arguing about where checks live) and Lina's original list of 5 specific checks (prescribing before reasoning through patterns).

**D5 (3 patterns) — convinced.** The reframe as schema stress tests changes the calculus. A flat form, a non-form layout, and a multi-step flow exercise three structurally different composition shapes. Two form-like patterns would validate the schema against variations of the same shape. The non-form layout catches form-centric assumptions in the schema design.

**D10 (Assembly input schema) — addressed.** Elevated from "not a blocker" to an explicit decision item. Agree with Lina's scheduling preference: resolve during formalization, not during the Pattern A interview. Keep interviews focused on design judgment.

### Token-Domain Assessment

- D9 (token governance convention for hints) covers the only new token surface this spec introduces. No gaps.
- `resolvedTokens` from 064/066 is available for future assembly-level token analysis but isn't needed in Tier 1.
- Pattern schema doesn't introduce token surfaces beyond hints. No token-domain concerns.

### No Remaining Concerns

The outline is ready for formalization from my perspective. All feedback from my review is either incorporated or explicitly decided against with rationale.
