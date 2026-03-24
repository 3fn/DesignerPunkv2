# Product Transition Plan

**Date**: 2026-03-23
**Author**: Peter + Thurgood
**Purpose**: Three-bucket plan for transitioning from system development to product development
**Status**: Planning

---

## Context

DesignerPunk's system infrastructure is mature: 310+ tokens, 30 production components, 306 test suites (7,965 tests), two MCP servers, behavioral contracts, layout template infrastructure, and a multi-agent development model. The next phase is building a product (Working Class) on this foundation.

This plan organizes remaining work into three buckets based on when each piece needs to happen relative to product development starting.

---

## Bucket 1: System Work Before Product

Work that would create constant friction if missing when product development begins. Scoped to be as small as possible — the bar is "can Leonardo specify real screens without this?"

### Container-Card-Base Readiness
- **Why before product**: 3 of 4 Spec 083 exercises needed it. Cards are the most common content container in modern UI. Leonardo would be working around a missing primitive on nearly every screen.
- **What**: Accelerate Container-Card-Base from `development` to production readiness. Semantic assessment first (per classification gate), then implementation.
- **Source**: Gap report #3

### Content List Item Component
- **Why before product**: Notification lists, activity feeds, search results, email lists — too many screens need interactive list items with content-consumption state (read/unread). No current component models this.
- **What**: New component spec. Likely a semantic variant of Container-Base or Container-Card-Base. Needs leading visual slot, primary/secondary text, metadata, read/unread state.
- **Source**: Gap report #1

### Top Bar Component
- **Why before product**: Every screen in a mobile app has a top bar. Leonardo can't spec a single screen without describing it, and there's no component for it. Also completes the page shell triad: top bar + content area (layout templates) + tab bar (Nav-TabBar-Base).
- **What**: New component spec in the Navigation family. Cross-platform behavioral contracts for iOS NavigationBar, Android TopAppBar, and web equivalent. Deceptively complex — large title modes, action buttons, search integration, back navigation.
- **Source**: Architectural gap identified during product transition planning

### Search/Discovery Enrichment
- **Why before product**: If Leonardo can't find components by natural search terms ("badge status", "filter bar", "empty state"), every screen spec starts with friction. Small work, high leverage.
- **What**: Enrich `purpose` text in component-meta.yaml files with natural search terms. Tag production components with missing context values (e.g., `"dashboards"` context). Half-day of meta enrichment, not a spec.
- **Source**: Gap report #16, #17, #18

---

## Bucket 2: Packaging the System for a New Project

Work that makes DesignerPunk consumable by a product repository. Currently everything lives in one repo. A product needs to attach to the system without forking it.

### Key Decisions Needed

These are architectural decisions that need a focused design session, not a full spec. The packaging can evolve — it needs to be functional enough to start, not perfect.

- **Token consumption**: How does a product repo access generated tokens (CSS, Swift, Kotlin)? npm package? Git submodule? Monorepo?
- **MCP attachment**: How do Docs MCP and Application MCP serve a product repo? Running from DesignerPunk's repo with the product pointing to them? Packaged and installed?
- **Component access**: How does a product use DesignerPunk components? Import from a package? Copy templates?
- **Product-side structure**: What does the product repo look like? Where do product-specific tokens, screen specs, and product context live?
- **Agent configuration**: How do the agents (Leonardo, Kenya, Data, Sparky, Stacy) attach to a product repo while still accessing DesignerPunk's system knowledge?

### Approach

A focused design conversation (Peter + Thurgood) to produce a working structure. Not a spec — a decision document that enables creating the product repo. The packaging evolves as product work reveals what's awkward.

---

## Bucket 3: Work During Product Development

Work that should be driven by product pressure rather than anticipated in advance. The system infrastructure is ready to absorb these as they arise.

### Product MCP (Spec 081)
- Build product context infrastructure as Leonardo discovers what he needs
- First screen specs reveal what product context is missing
- Patterns emerge over multiple screens
- MCP server gets built when the shape stabilizes
- Gap report items #5, #6, #10, #11 are concrete examples of product context agents needed but couldn't access — they inform the shape but don't define it

### Components On Demand
- **Linear progress bar** (gap #2) — build when a screen needs it
- **New components** — whatever Working Class needs that doesn't exist. The component pipeline (schema → contracts → implementation → tests) is proven. New components are execution, not architecture.

### Patterns On Demand
- **Multi-section form** (gap #4), **filter bar** (gap #7), **empty state** (gap #13) — build as experience patterns when screens need them. Routing review notes indicate these are component assembly concerns, not layout problems.
- **New experience patterns** — emerge from real screen specification work through the classification gate

### Production Layout Templates
- 069 built the infrastructure (schema, indexer, MCP tools, vocabulary)
- Real templates emerge from real screens through the classification gate
- Candidate templates validate the infrastructure; production templates come from product work

### Product Primitives
- Shape emerges from Leonardo's actual screen specification work
- What product context does he keep needing? That becomes the Product MCP's content model
- Gap #11 (dashboard layout) flagged as product primitive candidate — "What is → What will be → What was" hierarchy

---

## Sequencing

```
Bucket 1 (system work)          Bucket 2 (packaging)
├── Container-Card-Base          ├── Design session
├── Content list item            └── Product repo structure
├── Top bar component
└── Search enrichment
         │                              │
         └──────────┬───────────────────┘
                    ▼
           Product development begins
           (Working Class on DesignerPunk)
                    │
                    ▼
            Bucket 3 (during product)
            ├── Product MCP (081)
            ├── Components on demand
            ├── Patterns on demand
            ├── Production templates
            └── Product primitives
```

Buckets 1 and 2 can run in parallel. Product development begins when both are complete. Bucket 3 is ongoing throughout product development.

---

## Open Questions

- **Bucket 1 sequencing**: Can Container-Card-Base and content list item run in parallel (different agents), or does content list item depend on Container-Card-Base?
- **Bucket 2 vehicle**: Is Kiro Power a factor in the packaging decision, or do we package independently?
- **Bucket 3 trigger**: What's the first Working Class screen Leonardo specs? That choice sets the tone for what Bucket 3 work surfaces first.
