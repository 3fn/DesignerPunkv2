# MCP Relationship Model — Draft

**Date**: 2026-03-20
**Status**: Draft for Peter's review — not finalized
**Spec**: 070-agent-architecture

---

## Purpose

DesignerPunk operates three MCP servers (two existing, one future) that form a knowledge pipeline from system infrastructure through application guidance to product execution. This document defines the boundaries, information flow, access model, and interface contracts between them.

---

## The Three MCPs

### Docs MCP — "How the system works"

**Status**: Production (existing)
**Scope**: DesignerPunk system knowledge — tokens, architecture, governance, process
**Repository**: Lives in DesignerPunk

**Owns**:
- Token documentation (all families, governance, resolution patterns)
- Steering documentation (process, standards, principles)
- Architecture guides (Rosetta, Stemma, platform guidelines)
- Governance rules (ballot measures, token creation, component creation)
- System process standards (development workflow, file organization, spec planning)

**Does not own**:
- How to apply the system to build products (Application MCP)
- Product-specific context (Product MCP)

**Tools**: `get_documentation_map`, `get_document_summary`, `get_document_full`, `get_section`, `list_cross_references`, `validate_metadata`, `get_index_health`, `rebuild_index`

**Query pattern**: Progressive disclosure — map → summary → section → full doc

### Application MCP — "How to use the system"

**Status**: Production (existing)
**Scope**: DesignerPunk application knowledge — component selection, assembly, patterns, guidance
**Repository**: Lives in DesignerPunk

**Owns**:
- Component catalog (names, types, families, readiness)
- Component metadata (contracts, composition rules, token relationships)
- Experience patterns (assembly guidance for common UI scenarios)
- Prop guidance (family-level selection rules, when-to-use, alternatives)
- Assembly validation (component tree correctness, accessibility checks)
- Layout templates (future — Spec 069)

**Does not own**:
- Why tokens or components are designed the way they are (Docs MCP)
- What product is being built or for whom (Product MCP)

**Tools**: `get_component_catalog`, `get_component_summary`, `get_component_full`, `find_components`, `get_prop_guidance`, `get_experience_pattern`, `list_experience_patterns`, `validate_assembly`, `check_composition`, `get_component_health`

**Query pattern**: Context-driven — find by purpose/context → get details → validate assembly

### Product MCP — "What we're building"

**Status**: Conceptual (future — v1 after DesignerPunk is packageable)
**Scope**: Product-specific knowledge — brand, users, business rules, domain model
**Repository**: Lives in the product's own repository, not in DesignerPunk

**Will own**:
- Brand tokens (product-specific color, typography, voice extensions)
- User personas and research
- Business rules and domain logic
- Product primitives (objects, surfaces, intent signals — shape TBD, see below)
- Content standards (voice, tone, terminology)
- Screen inventory (what's been built, what's planned)
- Product-specific patterns (recurring product UI that isn't generalizable to DesignerPunk)

**Will not own**:
- DesignerPunk system knowledge (Docs MCP)
- DesignerPunk component catalog or patterns (Application MCP)
- Anything generalizable across products (belongs in Application MCP or Docs MCP)

**Tools**: TBD — likely mirrors progressive disclosure pattern
**Query pattern**: TBD

---

## Information Flow

```
Docs MCP ──────────> Application MCP ──────────> Product MCP
(system core)        (system application)         (product ecosystem)

Encodes system       Encodes application          Encodes product
knowledge into       knowledge into               knowledge into
queryable docs       queryable components         queryable context
                     and patterns
```

### Flow Direction

**Outward (system → product)**: System knowledge informs application guidance, which informs product execution. A token's existence (Docs MCP) enables a component's token usage (Application MCP), which enables a screen's implementation (Product MCP context).

**Inward (product → system)**: Product work discovers gaps. A missing component for a product screen (Product MCP context) becomes a Tier 3 System Escalation Request routed through Thurgood, who triages to the appropriate system agent. If the gap is generalizable, it gets promoted into the Application MCP (new pattern) or Docs MCP (new token, new component).

### Promotion Path

When product work reveals something generalizable:

```
Product-specific discovery
    ↓
Lessons Synthesis Review (Stacy leads)
    ↓
Classified as "pattern candidate" or "systemic"
    ↓
Tier 3 System Escalation Request → Thurgood
    ↓
Thurgood triages:
    → Ada (new token) → Docs MCP
    → Lina (new component/pattern) → Application MCP
    → Thurgood (process/governance) → Docs MCP
```

Nothing gets promoted without human review (Peter approves routing).

---

## Access Model

### Who Queries What

| Agent | Docs MCP | Application MCP | Product MCP |
|-------|----------|-----------------|-------------|
| **Peter** | ✅ Direct | ✅ Direct | ✅ Direct |
| **Leonardo** | ✅ Reference | ✅ Primary | ✅ Primary (future) |
| **Kenya/Data/Sparky** | ✅ Reference | ✅ Reference | ❌ Via Leonardo's specs |
| **Stacy** | ✅ Primary | ✅ Reference | ✅ Audit (future) |
| **Thurgood** | ✅ Primary | ✅ Audit | ❌ Not product-scoped |
| **Ada** | ✅ Primary | ❌ Not component-scoped | ❌ Not product-scoped |
| **Lina** | ✅ Reference | ✅ Primary | ❌ Not product-scoped |

### Access Principles

- **Platform agents don't query Product MCP directly.** Product context flows through Leonardo's screen specifications. This keeps platform agents focused on implementation, not product decisions.
- **System agents don't query Product MCP.** They receive product context through Tier 3 requests, which contain enough context to act without needing the full product picture.
- **Leonardo is the bridge.** He's the only agent that queries both Application MCP (component selection) and Product MCP (product context), synthesizing them into screen specifications.
- **Stacy audits across boundaries.** She queries Docs MCP for standards, Application MCP for component verification, and Product MCP for product process quality.

---

## Interface Contracts

### How MCPs Reference Each Other

**Application MCP → Docs MCP**: Components reference tokens by name. Experience patterns reference token families. The Application MCP assumes Docs MCP token names are stable identifiers.

**Product MCP → Application MCP**: Product primitives (future) will reference Application MCP components and experience patterns by name. A product surface definition might specify "use the `simple-form` experience pattern for user registration." The Product MCP assumes Application MCP component names and pattern names are stable identifiers.

**Product MCP → Docs MCP**: Brand tokens in the Product MCP extend or override DesignerPunk semantic tokens. The Product MCP references Docs MCP token names as the base layer that product tokens build on.

### Stability Contract

For cross-MCP references to work, each MCP must maintain stable identifiers:

| MCP | Stable Identifiers |
|-----|-------------------|
| Docs MCP | Token names (e.g., `space150`, `color.primary`) |
| Application MCP | Component names (e.g., `Button-CTA`), pattern names (e.g., `simple-form`), context values (e.g., `login-forms`) |
| Product MCP | Product primitive names (TBD), brand token names (TBD) |

Breaking changes to stable identifiers require coordination across MCPs.

---

## Content Types Per MCP

### Docs MCP Content Types (Established)
- Token definitions (primitive, semantic, component)
- Steering documents (process, governance, architecture)
- System principles (Rosetta, Stemma)
- Platform guidelines
- Test standards

### Application MCP Content Types (Established)
- Component metadata (schemas, contracts, annotations)
- Experience patterns (assembly step sequences)
- Family guidance (prop selection, when-to-use)
- Composition rules (parent-child constraints)

### Product MCP Content Types (Future — Shape TBD)
- **Brand tokens** — product-specific extensions to DesignerPunk's semantic token layer
- **User personas** — who the product serves, their needs and contexts
- **Business rules** — domain logic that affects UI decisions
- **Product primitives** — objects, surfaces, intent signals (shape deferred until relationship model is stable)
- **Content standards** — voice, tone, terminology conventions
- **Screen inventory** — what's been built, current state, planned work
- **Product-specific patterns** — recurring UI that isn't generalizable

Product primitives are the most architecturally significant content type in the Product MCP. Their shape will be defined as a child exercise after this relationship model is reviewed and stable. See alignment record "Emerging Concept: Product Primitives" for initial thinking.

---

## Cross-MCP Reference Rules (Principles)

Detailed patterns for cross-MCP references are deferred for a dedicated design session. The governing principles are:

1. **Reference by stable identifier, not by path or internal structure.** A Product MCP entry references `Button-CTA`, not `src/components/core/Button-CTA/schema.yaml`.
2. **One direction of dependency.** Product MCP depends on Application MCP depends on Docs MCP. Never the reverse. System MCPs have no knowledge of product-specific content.
3. **Graceful degradation.** If a referenced identifier doesn't resolve (component removed, pattern renamed), the query should return a clear "not found" rather than failing silently.
4. **Promotion is explicit.** Product-specific content doesn't automatically become system content. Promotion requires human review, Tier 3 request, and system agent action.

---

## Relationship to DesignerPunk Packaging

The Product MCP becomes practical when DesignerPunk is consumable as a package — when a product repository can attach DesignerPunk's Docs MCP and Application MCP as dependencies. The Product MCP is the product-side complement that provides the context those system MCPs need to be useful in a specific product.

The packaging vehicle (Kiro Power, plugin, or other mechanism) will determine the technical integration pattern. The relationship model defined here is vehicle-agnostic — it describes the logical boundaries and information flow regardless of how the MCPs are technically connected.

---

## Notes on This Draft

### What I'm confident about:
- Three-MCP boundary definitions are clean and match the three-node knowledge network
- Access model correctly reflects agent roles — Leonardo as bridge, platform agents via specs, Stacy as cross-boundary auditor
- Promotion path through Lessons Synthesis → Tier 3 → Thurgood triage is consistent with the handoff protocol
- Stability contract principle prevents cross-MCP reference breakage

### What needs Peter's review:
- Is the access model right? Especially platform agents not querying Product MCP directly
- Are the interface contracts sufficient, or do we need more specificity now?
- Does the content type list for Product MCP feel complete, or are there categories missing?

### What's deferred:
- Product primitives shape → Spec 081 (Product MCP Design), Design Session 1
- Cross-MCP reference detailed patterns → Spec 081, Design Session 2
- Product MCP tooling and query patterns → Spec 081
- Technical integration pattern (depends on packaging vehicle)
