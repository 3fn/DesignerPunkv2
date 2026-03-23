# Layout Templates: Responsive Page Framing for Agent-Guided Assembly

**Date**: 2026-03-04
**Updated**: 2026-03-22
**Purpose**: Ensure agents understand and communicate responsive page-level layout — both through foundational literacy and through reusable templates
**Organization**: spec-guide
**Scope**: 069-layout-templates
**Status**: Design outline — updated with Spec 070, 082, 083 outcomes

---

## Problem Statement

The Application MCP teaches agents how to select, compose, and validate components. Experience patterns describe component trees — what goes inside a Container-Base, how components nest, what roles they play.

But every component tree lives on a page. That page has a viewport. That viewport has breakpoints. The current assembly workflow provides no guidance on page-level layout: how many columns the form aligns to, where the form sits in the grid, what happens to supplemental content at narrow widths, whether a sidebar collapses or stacks.

The responsive layout system exists (breakpoint tokens, grid spacing tokens, progressive 4→8→12→16 column grid, CSS grid generator). But it's served by the Docs MCP and is invisible to the Application MCP assembly workflow. An agent following `find_components → get_experience_pattern → validate_assembly` produces a valid component tree with zero layout context.

This isn't a gap limited to complex dashboards. Every view requires layout — including a simple form. "Where does the form sit? What happens to help text at xs? Does the form center in 6-of-12 columns or go full-width?" These are layout questions that apply universally.

---

## Core Principle: Layout Literacy Is Non-Negotiable

**Layout is not optional guidance. It is a required competency for product specification.**

Leonardo produces screen specifications that platform agents (Kenya, Data, Sparky) implement. If those specs don't include explicit layout — grid columns, breakpoint behavior, region sizing, stacking rules — platform agents will either guess, hardcode, or ask. Three platforms guessing independently produces exactly the cross-platform inconsistency DesignerPunk exists to prevent.

The parallel is Ada and primitive tokens. Ada doesn't just pick from a menu — she understands the mathematical foundation well enough to create tokens when needed. Leonardo must understand the responsive grid system well enough to specify layout for *any* page, including pages that don't match any template.

**Templates make this easier. They do not make this optional.** A one-off page with no matching template still needs explicit layout specification. Leonardo must be able to say: "This is a two-column layout. Primary column spans 8 responsive columns. Secondary spans 4. Below `breakpoint.md`, secondary stacks below primary, full-width." That's specific enough for platform agents to implement without clarification round-trips.

This connects to the Product Handoff Protocol (Spec 070): Leonardo's screen spec handoff must include layout as a first-class section. Tier 1 clarifications ("SwiftUI doesn't support X, options A or B") should not be happening for basic layout questions — those should be answered in the spec.

---

## Two-Layer Solution

### Layer 1: Responsive Layout Foundation (Critical)

Leonardo must internalize the responsive grid system as a core competency. This means:

1. **Grid system fluency** — the progressive 4→8→12→16 column grid, breakpoint tokens (`breakpoint.xs` through `breakpoint.lg`), grid gutter tokens (`gridGutterXs` through `gridGutterLg`), grid margin tokens (`gridMarginXs` through `gridMarginLg`). Not "it exists" but "I think in these terms."

2. **Layout specification vocabulary** — a canonical way to express layout in screen specs that platform agents can implement without interpretation. This vocabulary must cover:
   - **Grid structure**: column allocation to regions (e.g., "primary region spans 8 columns")
   - **Breakpoint behavior**: what changes at each breakpoint (stacking, collapsing, reflow)
   - **Component sizing within regions**: centering, max-width, fill behavior (e.g., "form centers within primary region, max-width 480px")
   - **Responsive adaptation**: within-platform viewport changes — same content, different arrangement. This is what layout templates address.
   - **Reactive annotations**: cross-platform experience differences — where the experience intentionally diverges between platforms (e.g., "this section exists on web and tablet but not phone," "bulk export available on web only"). These are product architecture decisions directed by Peter, not layout decisions. The vocabulary includes them so agents aren't caught off guard when they arise.

3. **Platform translation awareness** — understanding that web uses CSS Grid with media queries, iOS uses adaptive layouts with size classes, Android uses Compose adaptive patterns. Leonardo doesn't implement, but he needs to know what's expressible on each platform so his specs are implementable.

4. **Bidirectional literacy** — the steering doc must serve both Leonardo (specification) and platform agents (implementation). If Leonardo specs "spans 8 responsive columns at lg" and a platform agent doesn't know how to translate that to their native responsive system, the problem just moves downstream. Shared vocabulary, shared foundation.

**Source material exists**: Token-Family-Responsive.md (breakpoint tokens, density tokens, responsive design patterns, cross-platform usage) and Token-Family-Spacing.md § "Grid Spacing Tokens" (gutter/margin tokens, progressive column grid, platform-specific patterns). This knowledge needs to be synthesized into guidance that serves both specification and implementation.

**Learning approach**: A design exercise focused on layout specification (similar to the Spec 083 component exercises) would be more effective than documentation alone. Leonardo learns by applying the grid system to real screens, discovering gaps in his understanding through practice.

**Delivery mechanism**: Both a steering doc and MCP-queryable reference, serving different moments:
- **Steering doc** (concise — principles + mental model, not exhaustive reference) for internalization. Loaded when doing screen specification work. Serves both Leonardo and platform agents.
- **MCP-queryable reference** for mid-spec lookup — token values, platform-specific details, quick confirmation without loading a full document.

A dedicated Leonardo skill is a last resort if shared access isn't sufficient. Preference is shared access so all agents benefit.

### Layer 2: Layout Templates (Acceleration)

YAML-based templates describing common page-level responsive layouts. They codify patterns so Leonardo doesn't specify from scratch every time. But they're a convenience layer on top of Layer 1, not a substitute for it.

Templates still require specificity. "Use the centered-content-page template" isn't enough — Leonardo still specifies component sizing behavior and positioning within the template's regions. The template provides the grid structure; Leonardo provides the content-specific layout decisions within that structure.

---

## Architectural Framing

Layout and component assembly are separate concerns at different levels:

**Page Layout** — The responsive grid. Regions, columns, breakpoint behavior. Token-driven (breakpoint tokens, grid spacing tokens). Component-agnostic — it doesn't care whether a region contains a form or a settings list.

**Content Framing** — Containers (Container-Base or similar) wrapping clusters of components. This is where experience patterns live. The container knows its role but doesn't own page-level layout decisions.

**Component Assembly** — The components inside containers. What the current experience patterns describe well.

The Application MCP handles content framing and component assembly. The Docs MCP has the responsive tokens. Nothing currently teaches agents how to compose page layout — the level above content framing.

Layout templates fill this gap as a **peer system to experience patterns**, not a child of them.

**Note on scope boundary**: The Spec 083 gap report routed three items (#4 multi-section form, #7 filter bar, #13 empty state) to this spec. On review, those are content framing / component assembly concerns, not page-level layout problems. See gap report § "Routing Review Notes" for analysis. This spec addresses page-level responsive layout only.

**Responsive vs reactive scope**: This spec *defines vocabulary* for both responsive (within-platform viewport adaptation) and reactive (cross-platform experience differences). It *builds templates* for responsive only. Reactive specification patterns will emerge through product work — but the language is ready when they do.

---

## Layout Templates: Details

### What They Are

YAML-based templates describing page-level responsive layout: regions, grid behavior across breakpoints, and how content areas respond to viewport changes. They reference responsive tokens (breakpoints, grid spacing) and describe spatial relationships — not components.

### What They Are Not

- Not component assembly guides (that's experience patterns)
- Not validation targets (layout is guided, not enforced)
- Not rigid prescriptions — templates support common cases; free-form layout supports exploration
- Not a substitute for layout literacy — Leonardo must be able to specify layout without templates

### Relationship to Experience Patterns

Layout templates and experience patterns are composed together but authored independently:

- A layout template defines regions (e.g., "primary content area: centered, 6-of-12 at md")
- An experience pattern defines a component tree (e.g., "simple-form: Container-Base with Input-Text-Email and Button-CTA")
- The agent places the pattern's component tree into the template's region

No enforcement of which templates pair with which patterns. Agents can use templates, deviate from them, or work without them entirely. When deviation produces good results, it becomes a candidate for a new template.

### Guided, Not Validated

Layout is too context-dependent for hard validation. "You must use 6 columns here" doesn't make sense the way "a form needs an accessible name" does. Layout templates are advisory — they provide informed defaults and common patterns, not rules.

---

## Resolved Decisions

### D1: Agent Ownership

**Resolved by Spec 070 (Agent Architecture).**

Layout templates are Application MCP content. Per the MCP Relationship Model:
- **Lina** builds and maintains layout templates in the Application MCP (system agent, component/pattern domain)
- **Leonardo** consumes layout templates and specifies layout in screen specs (product architect)
- **Platform agents** (Kenya, Data, Sparky) implement the layout using platform-native responsive patterns, guided by Leonardo's screen specifications

---

## Open Decisions

### D2: Template Schema Shape

What does a layout template YAML look like? Needs to describe regions, breakpoint behavior, and grid positioning without becoming a full page blueprint.

Leonardo's initial sketch (from R1 feedback):

```yaml
name: centered-content-page
description: Single content area centered in viewport
regions:
  - name: content
    grid:
      lg: { columns: "5-12", maxWidth: "640px" }
      md: { columns: "3-10" }
      sm: { columns: "1-8", fullWidth: true }
      xs: { fullWidth: true, margins: "gridMarginXs" }
    stacking: null  # single region, no stacking
```

Key principles from Leonardo: regions + grid behavior per breakpoint + stacking rules. Enough to place component trees; not so much that it prescribes content. Component-agnostic — "primary content area: columns 1-8 at lg" yes, "primary content area contains a feed with cards" no.

We have 4 design exercises (Spec 083) providing real layout scenarios to test schema ideas against. A schema design exercise would ground this in real needs.

### D3: MCP Surface

How do agents access layout templates? Options:
- New tools on the Application MCP (`list_layout_templates`, `get_layout_template`) — mirrors the experience pattern tools
- Extension to existing experience pattern tools (layout metadata alongside component trees)
- Separate system entirely

Leaning toward new tools on the Application MCP for clean separation.

### D4: Template Scope

What level of layout do templates describe?
- Page-level only (full viewport grid)?
- Region-level (how a content area subdivides)?
- Both?

**Leaning page-level only** (Leonardo R1 concurs). The dashboard exercise had stats + feed + preview zones, but those are content framing — Container-Base sections with different roles. The page-level question is "how do these zones arrange on the grid across breakpoints?" Region-level subdivision (e.g., 4 stat cards going from 4-across to 2x2 to stacked) may need region-level templates eventually, but should be discovered through implementation rather than pre-built.

### D5: Template Discovery

How does an agent know which layout template to use?

**Leaning context-based matching** (Leonardo R1 concurs) — same model as `find_components({ context })`. Experience pattern cross-references as secondary hints ("commonly used with `centered-content-page` layout template"). Browse-a-list works for the initial small set but won't scale.

### D6: First Templates

What are the initial layout templates? Should be grounded in real needs through a design exercise focused specifically on page-level layout scenarios.

Candidates informed by Spec 083 exercises (layout aspects, not component aspects):
- Centered content page (login, profile edit — single content area, centered in grid)
- List page (feed, notifications — full-width scrollable content, optional sticky header)
- Multi-zone page (dashboard — distinct content regions with different grid behavior)

These are starting points for a schema design exercise, not commitments.

### D7: Foundation Delivery Mechanism

**Converging on both** (Leonardo R1 aligns):
- **Steering doc** (concise — principles + mental model, not exhaustive reference) for internalization. Serves both Leonardo (specification) and platform agents (implementation). Loaded when doing screen specification work.
- **MCP-queryable reference** for mid-spec lookup — token values, platform-specific details, quick confirmation.

The steering doc is more important. If Leonardo internalizes the system, he'll rarely need the MCP reference. The MCP reference without understanding produces specs that are technically correct but lack design coherence.

Open sub-question: should the learning step include a layout-focused design exercise (Leonardo R1 recommendation)? Similar to Spec 083 component exercises but focused on specifying layout for real screens using the grid system.

---

## Dependencies

- **Responsive layout system** (complete): Breakpoint tokens, grid spacing tokens, CSS grid generator
- **Application MCP** (Spec 067, complete): Experience patterns, assembly validation, `find_components` with context
- **Spec 070 (Agent Architecture)** (complete): Resolves agent ownership — Leonardo consumes, Lina maintains. MCP Relationship Model and Product Handoff Protocol define boundaries and handoff expectations.
- **Spec 082 (Family Naming + Registry)** (complete): Application MCP governance infrastructure
- **Spec 083 (Guidance Completeness)** (complete): Gap report informs but does not drive scope (see "Routing Review Notes")

---

## What This Enables

An agent building a login page would:
1. Select components via `find_components({ context: 'login-forms' })`
2. Get assembly guidance via `get_experience_pattern('simple-form')`
3. Get layout guidance via `get_layout_template('centered-content-page')` — breakpoints, grid columns, supplemental content behavior
4. Compose the component tree into the layout regions, specifying component sizing and positioning within each region
5. Validate the component tree via `validate_assembly`

An agent building a one-off page with no matching template would:
1. Understand the responsive grid system (Layer 1 foundation)
2. Specify layout from scratch using grid tokens, breakpoint behavior, and column spans
3. Produce a screen spec with explicit layout that platform agents can implement without clarification

The layout template bridges the gap between "here are your components" and "here's where they go on the page." The foundation ensures agents can bridge that gap even without a template.

---

## Evolution Path

Templates grow through use. Initial set covers common patterns discovered through design exercises. As agents explore free-form layouts and produce good results, those become candidates for new templates. The system evolves bottom-up from real usage, not top-down from prescription.

Layout templates are guided, not enforced. Variability is important for exploration and critical to DesignerPunk's evolution. Templates and free-form application provide the tools to support both structured and exploratory work.
