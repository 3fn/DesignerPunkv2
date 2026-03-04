# Layout Templates: Responsive Page Framing for Agent-Guided Assembly

**Date**: 2026-03-04
**Purpose**: Introduce layout templates as a guided system for page-level responsive framing, bridging the gap between responsive tokens and component assembly
**Organization**: spec-guide
**Scope**: 069-layout-templates
**Status**: Design outline — early thinking, pending review

---

## Problem Statement

The Application MCP (Spec 067) teaches agents how to select, compose, and validate components. Experience patterns describe component trees — what goes inside a Container-Base, how components nest, what roles they play.

But every component tree lives on a page. That page has a viewport. That viewport has breakpoints. The current assembly workflow provides no guidance on page-level layout: how many columns the form aligns to, where the form sits in the grid, what happens to supplemental content at narrow widths, whether a sidebar collapses or stacks.

The responsive layout system exists (breakpoint tokens, grid spacing tokens, progressive 4→8→12→16 column grid, CSS grid generator). But it's served by the docs MCP and is invisible to the Application MCP assembly workflow. An agent following `find_components → get_experience_pattern → validate_assembly` produces a valid component tree with zero layout context.

This isn't a gap limited to complex dashboards. Every view requires layout — including a simple form. "Where does the form sit? What happens to help text at xs? Does the form center in 6-of-12 columns or go full-width?" These are layout questions that apply universally.

---

## Architectural Framing

Layout and component assembly are separate concerns at different levels:

**Page Layout** — The responsive grid. Regions, columns, breakpoint behavior. Token-driven (breakpoint tokens, grid spacing tokens). Component-agnostic — it doesn't care whether a region contains a form or a settings list.

**Content Framing** — Containers (Container-Base or similar) wrapping clusters of components. This is where experience patterns live. The container knows its role but doesn't own page-level layout decisions.

**Component Assembly** — The components inside containers. What the current experience patterns describe well.

The Application MCP handles content framing and component assembly. The docs MCP has the responsive tokens. Nothing currently teaches agents how to compose page layout — the level above content framing.

Layout templates fill this gap as a **peer system to experience patterns**, not a child of them.

---

## Proposed Approach: Layout Templates

### What They Are

YAML-based templates describing page-level responsive layout: regions, grid behavior across breakpoints, and how content areas respond to viewport changes. They reference responsive tokens (breakpoints, grid spacing) and describe spatial relationships — not components.

### What They Are Not

- Not component assembly guides (that's experience patterns)
- Not validation targets (layout is guided, not enforced)
- Not rigid prescriptions — templates support common cases; free-form layout supports exploration

### Relationship to Experience Patterns

Layout templates and experience patterns are composed together but authored independently:

- A layout template defines regions (e.g., "primary content area: centered, 6-of-12 at md")
- An experience pattern defines a component tree (e.g., "simple-form: Container-Base with Input-Text-Email and Button-CTA")
- The agent places the pattern's component tree into the template's region

No enforcement of which templates pair with which patterns. Agents can use templates, deviate from them, or work without them entirely. When deviation produces good results, it becomes a candidate for a new template.

### Guided, Not Validated

Layout is too context-dependent for hard validation. "You must use 6 columns here" doesn't make sense the way "a form needs an accessible name" does. Layout templates are advisory — they provide informed defaults and common patterns, not rules.

---

## Open Decisions

### D1: Template Schema Shape
What does a layout template YAML look like? Needs to describe regions, breakpoint behavior, and grid positioning without becoming a full page blueprint. The experience pattern interview process (from 067) could be adapted to discover the right schema through real layout scenarios.

### D2: MCP Surface
How do agents access layout templates? Options:
- New tools on the Application MCP (`list_layout_templates`, `get_layout_template`) — mirrors the experience pattern tools
- Extension to existing experience pattern tools (layout metadata alongside component trees)
- Separate system entirely

Leaning toward new tools on the Application MCP for clean separation.

### D3: Template Scope
What level of layout do templates describe?
- Page-level only (full viewport grid)?
- Region-level (how a content area subdivides)?
- Both?

Initial thinking: page-level. Container-Base already handles region-level framing.

### D4: Agent Ownership
Who owns layout guidance in the agent model? Layout sits between Ada's responsive tokens and Lina's component composition. Options:
- Expand Lina's domain (layout is the next level up from container framing)
- New agent responsibility
- Shared concern

Deferred — resolve after the template shape is clearer.

### D5: Template Discovery
How does an agent know which layout template to use? Options:
- Context-based matching (similar to `find_components({ context })`)
- Explicit recommendation in experience patterns ("this pattern works well with `centered-form` layout")
- Agent judgment based on template descriptions

Likely a combination. Not yet resolved.

### D6: Agent Ownership
Layout sits between Ada's responsive tokens and Lina's component composition. The current system agents (Ada, Lina, Thurgood) are oriented toward building and maintaining DesignerPunk — not applying it to products. Layout templates are consumed by product-facing agents, not system agents.

This decision is deferred pending the broader agent architecture work in Spec 070. The template schema and MCP tools can be designed independently of who owns them.

---

## Dependencies

- **Responsive layout system** (complete): Breakpoint tokens, grid spacing tokens, CSS grid generator
- **Application MCP** (Spec 067, complete): Experience patterns, assembly validation, `find_components` with context
- **Spec 068 (Family Guidance Indexer)**: Independent — no dependency in either direction
- **Spec 070 (Agent Architecture)**: Informs D6 (agent ownership) but does not block template implementation

---

## Reevaluation Triggers

This design outline should be reevaluated after:
- **Spec 068 completion** — Family guidance interviews and indexer implementation may surface insights about how structured guidance integrates with the Application MCP, which could affect layout template schema design or MCP tool surface.
- **First layout template interview** — The experience pattern interview process (067) should be adapted for layout scenarios. Real use cases may invalidate assumptions in this outline.

---

## What This Enables

An agent building a login page would:
1. Select components via `find_components({ context: 'login-forms' })`
2. Get assembly guidance via `get_experience_pattern('simple-form')`
3. Get layout guidance via `get_layout_template('centered-form-page')` — breakpoints, grid columns, supplemental content behavior
4. Compose the component tree into the layout regions
5. Validate the component tree via `validate_assembly`

The layout template bridges the gap between "here are your components" and "here's where they go on the page."

---

## Evolution Path

Templates grow through use. Initial set covers common patterns (centered form, sidebar layout, full-width content). As agents explore free-form layouts and produce good results, those become candidates for new templates. The system evolves bottom-up from real usage, not top-down from prescription.

Layout templates are guided, not enforced. Variability is important for exploration and critical to DesignerPunk's evolution. Templates and free-form application provide the tools to support both structured and exploratory work.
