# Product MCP Design: Schema, Primitives, and Cross-MCP References

**Date**: 2026-03-20
**Purpose**: Define the Product MCP's schema, product primitives shape, and cross-MCP reference patterns — completing the three-MCP architecture established in Spec 070
**Organization**: spec-guide
**Scope**: 081-product-mcp-design
**Status**: Design outline — capturing scope and open questions for future design sessions

---

## Problem Statement

Spec 070 (Agent Architecture) established a three-node knowledge network with three corresponding MCPs: Docs MCP (system core), Application MCP (system application), and Product MCP (product ecosystem). The MCP Relationship Model (drafted in Spec 070) defines the boundaries, information flow, and access model between them.

Two design conversations remain unresolved:

1. **Product primitives shape** — The Product MCP's most architecturally significant content type. Objects, surfaces, and intent signals need a schema that connects product domain knowledge to DesignerPunk's component and pattern vocabulary. Without this, Leonardo has no structured way to translate product context into screen specifications.

2. **Cross-MCP reference patterns** — How Product MCP entries reference Application MCP components and patterns, and how those references stay stable as both systems evolve. The relationship model established four governing principles but deferred the detailed patterns.

These are parent-child: the relationship model (parent) must be stable before product primitives (child) can take shape. The relationship model is drafted. This spec picks up from there.

---

## Dependencies

| Spec | Relationship | Status |
|------|-------------|--------|
| 070 (Agent Architecture) | Established three-node model, MCP relationship model, product agent definitions | Design outline + drafts complete |
| 067 (Application MCP) | The Application MCP that Product MCP references | Complete |
| 068 (Family Guidance Indexer) | Prop guidance that Product MCP entries may reference | Complete |
| 069 (Layout Templates) | Layout guidance that Product MCP entries may reference | Design outline |

---

## Activation Trigger

This spec becomes active when DesignerPunk is packageable — when a product repository can attach DesignerPunk's Docs MCP and Application MCP as dependencies. Until then, this design outline captures the thinking so the design work is ready when the time comes.

Specific triggers:
- DesignerPunk is available as a Kiro Power, plugin, or equivalent packaging vehicle
- A real product is ready to consume DesignerPunk through the packaged interface
- The MCP Relationship Model (Spec 070) has been validated through at least one product application attempt

---

## Design Session 1: Product Primitives Shape

### Context

Product primitives were identified in Spec 070 as "the objects users create, the surfaces those objects can appear in, and the intent signals that determine which surface to show." They sit above DesignerPunk components — providing the *what* and *where* that components render.

### Three Elements

- **Objects**: Domain entities users interact with (e.g., in a civic engagement app: Bill, Representative, UserProfile, ImpactScore)
- **Surfaces**: Contexts where objects appear (e.g., Dashboard, Detail Sheet, Search Results, Onboarding Flow)
- **Intent Signals**: Routing logic connecting objects to surfaces (e.g., user tapped bill → Bill Detail surface)

### Open Questions

1. **Schema format**: YAML (consistent with Application MCP's component-meta and family guidance)? JSON? Something else?
2. **Granularity**: How detailed should object definitions be? Just names and relationships, or full property schemas?
3. **Surface → Pattern mapping**: How does a surface definition reference Application MCP experience patterns? Direct reference by pattern name? Contextual query parameters?
4. **Object → Component mapping**: How does an object definition specify which DesignerPunk components render its properties? Per-property mapping? Per-surface mapping?
5. **Intent signal representation**: Are these routing rules, state machine transitions, or something simpler?
6. **Template vs convention**: Does DesignerPunk provide a product primitives template (scaffolding), or just the convention (documentation)?
7. **Queryability**: What MCP tools would agents use to query product primitives? `find_objects`, `get_surface`, `resolve_intent`?

### Relationship to Application MCP

Product primitives determine *which* Application MCP pattern to use for *which* object on *which* surface. This is the primary cross-MCP reference point:

```
Product MCP                          Application MCP
───────────                          ───────────────
Surface: "Bill Detail"        →      Experience Pattern: "detail-view"
Object: "Bill"                →      Components: Container-Card-Base, Badge-Label-Base
Intent: "user tapped bill"   →      Navigation: push to detail surface
```

---

## Design Session 2: Cross-MCP Reference Patterns

### Context

The MCP Relationship Model (Spec 070) established four governing principles:

1. Reference by stable identifier, not by path or internal structure
2. One direction of dependency (Product → Application → Docs, never reverse)
3. Graceful degradation (clear "not found" on broken references)
4. Promotion is explicit (product content doesn't auto-become system content)

This session defines the detailed patterns that implement these principles.

### Open Questions

1. **Reference syntax**: How does a Product MCP entry reference an Application MCP component? By name string (`"Button-CTA"`)? By a structured reference object (`{ mcp: "application", type: "component", name: "Button-CTA" }`)?
2. **Version stability**: When Application MCP renames a component or pattern, how do Product MCP references update? Manual migration? Alias support? Breaking change protocol?
3. **Validation**: Can the Product MCP validate its references against the Application MCP at build time? At query time? Both?
4. **Bidirectional awareness**: The relationship model says system MCPs have no knowledge of product content. But should the Application MCP be *aware* that products reference its identifiers, even if it doesn't know which products? This affects how breaking changes are communicated.
5. **Reference resolution**: When Leonardo queries the Product MCP for a surface definition that references Application MCP patterns, does the Product MCP resolve those references (returning enriched data), or does Leonardo make separate queries to each MCP?
6. **Cross-MCP query patterns**: Does Leonardo ever need to query across MCPs in a single operation ("give me the surface definition AND the referenced pattern details"), or are sequential queries sufficient?

---

## Scope Boundaries

### In Scope
- Product primitives schema definition
- Cross-MCP reference pattern specification
- Product MCP tool design (query interface)
- Template or convention for product teams adopting DesignerPunk
- Dedicated MCP agent definition and creation (see below)

### Out of Scope
- Product MCP server implementation (separate engineering spec)
- DesignerPunk packaging vehicle (Kiro Power, plugin, etc.)
- Specific product content (Working Class or any other product)
- Docs MCP or Application MCP changes (unless cross-MCP references require them)

---

## Relationship to Spec 070

This spec is a direct child of Spec 070's MCP Relationship Model. It does not revisit the boundary definitions, information flow, or access model — those are settled in Spec 070. It extends the relationship model with the detailed design that was explicitly deferred.

| Defined in Spec 070 | Extended in Spec 081 |
|---------------------|---------------------|
| Three-MCP boundaries | Product MCP content schema |
| Information flow direction | Cross-MCP reference patterns |
| Access model (who queries what) | Product MCP query tools |
| Interface contract principles | Detailed reference syntax and validation |
| Product primitives concept | Product primitives schema |
| — | Dedicated MCP agent (new) |

---

## Dedicated MCP Agent

**Added**: 2026-03-29 (from Spec 086 Task 5.1 scope boundary discussion)

With three MCPs in production, no single existing agent owns the cross-cutting infrastructure concerns. A dedicated MCP agent should be defined and created as part of this spec so it's born alongside the Product MCP with all three MCPs in scope from day one.

### Proposed Scope
- Index health monitoring across all three MCPs
- Metadata validation (correct headers, required fields)
- Cross-MCP reference integrity (stability contract enforcement)
- Rebuild triggers when indexes are stale or corrupted
- Recommending alignment specs or tasks when drift is detected between MCPs

### Operating Model
- **Audits and recommends** — does not modify domain content
- Domain agents (Ada, Lina) still own their content; the MCP agent owns infrastructure and integrity
- Same audit-vs-write distinction as Thurgood's test governance role

### Open Questions
1. Agent name and identity
2. Which tools does it need access to? (All three MCPs' health/index tools at minimum)
3. Does it need write access to any MCP configuration, or is it purely advisory?
4. Relationship to Thurgood — Thurgood currently uses Documentation MCP tools for spec work. Does the MCP agent subsume that, or do they coexist?

---

## Reevaluation Triggers

- **Packaging vehicle decision**: The technical integration pattern may constrain schema and reference design choices
- **First product application attempt**: Real usage will validate or invalidate assumptions about what product primitives need to contain
- **Application MCP evolution**: New tools or content types (layout templates from Spec 069) may affect cross-MCP reference patterns
- **Agent tooling maturity**: Direct agent-to-agent communication (if it becomes available) may change how cross-MCP queries work

---

## Reference Bookmarks

### AI Interaction Atlas

**Source**: https://github.com/quietloudlab/ai-interaction-atlas (Apache 2.0)
**NPM**: `@quietloudlab/ai-interaction-atlas`
**Relevance**: Design Session 1 (Product Primitives Shape)

An open-source taxonomy for AI interaction design with six dimensions: AI tasks, human tasks, system tasks, data artifacts, constraints, and touchpoints. Each task has typed inputs/outputs, relations to other tasks (enables, commonly_followed_by, incompatible_with), and UX notes (risk, tip, anti_patterns). Available as a queryable npm package.

**Why it's worth reviewing when this spec activates:**

The atlas's data model offers one approach to the "intent signals" question in product primitives. Its `WorkflowTemplate` concept — a graph of connected tasks with typed data flowing between them — is structurally close to what the Product MCP needs for describing how user actions connect to system and AI behavior. The task-relation model (with strength ratings and constraint attachments) is a concrete schema example for encoding product interaction flows.

The atlas's constraint categories (accuracy, bias, privacy, transparency, latency) are also relevant for AI-powered products like WrKing Class, where ethical constraints shape screen-level design decisions.

**Limitations to keep in mind:** The atlas is AI-interaction-specific. The Product MCP needs to serve any product, not just AI-powered ones. The atlas should inform the product primitives shape, not constrain it. Non-AI screens (settings, profile editors, simple forms) still need product primitives without AI task vocabulary.

---

**Organization**: spec-guide
**Scope**: 081-product-mcp-design
