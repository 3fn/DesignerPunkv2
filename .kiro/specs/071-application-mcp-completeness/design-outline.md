# Application MCP Completeness: Coverage Gaps and Effectiveness Maximization

**Date**: 2026-03-04
**Purpose**: Identify and address remaining gaps in the Application MCP to maximize its effectiveness for product agent consumption
**Organization**: spec-guide
**Scope**: 071-application-mcp-completeness
**Status**: Gap 1 complete (Spec 071). Gaps 2–4 deferred.

---

## Problem Statement

The Application MCP (Spec 067) provides 10 tools across component discovery, composition validation, experience patterns, and family guidance. Post-068, the system is architecturally complete — all planned knowledge layers have at least one implementation.

But coverage within those layers is uneven. Family guidance covers 3 of 13 families. Token knowledge is entirely absent from the Application MCP. And no product agent has consumed the MCP yet, meaning the gap analysis is theoretical rather than empirically validated.

This spec addresses the known coverage gaps and positions the MCP for its first real product application.

---

## Current State (Post-071, v9.2.0)

### What the MCP serves well
- **Component discovery**: catalog, summary, full, find (with context filter), health — 28 components indexed
- **Composition validation**: check_composition — structural parent/child rules
- **Experience patterns**: list, get, validate_assembly — 3 patterns (simple-form, settings-screen, account-onboarding)
- **Family guidance**: get_prop_guidance — 8 production families (Buttons, Form Inputs, Containers, Chips, Progress Indicators, Badges, Icons, Avatars)

### What's missing or underserving (deferred)
1. ~~**Family guidance coverage**~~ — ✅ Complete. 8/8 production families covered. 5 placeholder families excluded (no implemented components).
2. **Token query capability** — no MCP tool for token selection guidance (deferred — needs Ada's design input)
3. **Negative guidance** — discouragedPatterns added to 5 family YAMLs as advisory field; no dedicated query path beyond family guidance (deferred — let real usage reveal the need)
4. **Cross-layer synthesis** — every query is stateless; no tool combines pattern + guidance + token knowledge (deferred — respect system/product boundary per 070)

---

## Gap 1: Family Guidance Coverage — ✅ COMPLETE (Spec 071)

Completed 2026-03-09. All 8 production families have companion YAML files indexed by FamilyGuidanceIndexer.

### What was delivered
- 5 new family guidance YAMLs: chips.yaml, progress.yaml, badges.yaml, icons.yaml, avatars.yaml
- Enriched schema: discouragedPatterns (advisory, overridable), composesWithFamilies, platformVariants (Icons only)
- ~40 new Feather icon SVGs added to Icon-Base across web/iOS/Android
- IconBaseName type expanded
- Component Quick Reference updated: 9 production families, 5 placeholder

### What was scoped out
- Placeholder families (Modal, Data-Display, Divider, Loading, Navigation) — no guidance for unimplemented components
- Backfilling enriched schema fields to pre-071 YAMLs (Buttons, Containers, Form Inputs) — optional fields, not required
- Avatar-Group — future semantic variant, not implemented

---

## Gap 2: Token Query Capability

### The Gap
The Rosetta token system is rich (primitive → semantic → component hierarchy, mathematical foundations, modular scale) but entirely locked in steering docs and source files. The Application MCP has zero token awareness. A product agent can query which component to use and how to compose them, but must guess at tokens or rely on what's embedded in component metadata.

### Why This Matters
When a product agent builds a settings screen, it knows to use Container-Base with role="section" and Input-Text-Base for text fields (from experience patterns and family guidance). But it doesn't know which spacing token to use between form groups, which color token for section headers, or which typography token for labels. That knowledge exists in the design system but isn't queryable.

### Proposed Approach
A `get_token_guidance` tool that answers "what token should I use for X?" — scoped to semantic tokens (the safe, self-documenting layer).

Possible query patterns:
- By use case: "spacing between form groups" → `space.stack.300`
- By component context: "Button-CTA label typography" → component token references
- By category: "all color tokens for interactive states" → filtered list

### Counter-Arguments
1. **Token selection is deeply contextual.** The governance model (semantic → primitive → component → hardcoded) may not reduce well to a query tool. A tool that returns "use space300" without the full context of why might produce worse outcomes than an agent reading the component spec.
2. **Risk of false authority.** Agents might treat token suggestions as definitive rather than starting points. The current model where tokens are embedded in component definitions may actually be the right level of indirection.
3. **Ada's domain.** Token architecture and governance are Ada's specialty. This tool design needs her input — Thurgood can spec the MCP integration, but the token knowledge model is hers.

### Open Decision (D2): Token Tool Scope
Should the token tool serve:
- (a) Only semantic token lookup (safe, bounded)
- (b) Full token hierarchy navigation (powerful, complex)
- (c) Component-context token resolution (e.g., "what tokens does Button-CTA use?")
- (d) Deferred entirely until a product agent reveals the actual need

### Open Decision (D3): Token Data Source
Where does the token query tool get its data?
- (a) Parse token source files at startup (like FamilyGuidanceIndexer parses YAML)
- (b) Companion YAML files for token guidance (parallel to family guidance)
- (c) Integrate with existing token test infrastructure
- (d) Query the docs MCP (cross-MCP dependency — architecturally complex per 070)

---

## Gap 3: Negative Guidance

### The Gap
The MCP answers "what should I use?" but not "is what I'm about to do a known mistake?" Composition validation catches structural violations (wrong parent/child), but not design intent violations (structurally valid but semantically wrong).

Example: A product agent could nest a Container-Card-Base inside another Container-Card-Base. This might pass `check_composition` (if the schema allows it) but violate the design intent of card containers.

### Current Partial Coverage
- `whenNotToUse` in family guidance YAML — covers family-level anti-patterns
- `check_composition` — catches structural violations
- Experience pattern `validate_assembly` — catches assembly-level violations

### Counter-Argument
This is a bottomless pit. You can't enumerate all wrong things someone might do. The positive guidance (selection rules, patterns) implicitly covers most cases. Explicit anti-pattern documentation has high maintenance cost relative to value, and the boundary between "anti-pattern" and "creative exploration" is fuzzy.

### Open Decision (D4): Negative Guidance Approach
- (a) Expand `whenNotToUse` coverage in family guidance files (incremental, low risk)
- (b) Create a dedicated anti-patterns system (high effort, questionable ROI)
- (c) Rely on existing validation tools + positive guidance (current state, accept the gap)
- (d) Defer until a product agent demonstrates the need empirically

---

## Gap 4: Cross-Layer Synthesis

### The Gap
Every MCP query is stateless. Building a settings screen requires: query experience pattern → query family guidance for each component → figure out tokens → validate assembly. There's no "I'm building a settings screen — what do I need?" tool that synthesizes across knowledge layers.

### Counter-Argument
This is exactly what a product agent should be doing — orchestrating multiple queries. Building synthesis into the Application MCP pushes product-level logic into the system layer. Spec 070's three-node architecture explicitly separates system knowledge (what the MCP serves) from product application (what product agents do with it). A synthesis tool in the Application MCP would blur this boundary.

### Open Decision (D5): Synthesis Responsibility
- (a) Keep the Application MCP as a knowledge server; synthesis is the product agent's job
- (b) Add a lightweight "assembly guide" tool that returns pattern + guidance + token hints for a named pattern
- (c) Defer until 070 clarifies the system/product boundary

---

## Dependencies

| Spec | Relationship |
|------|-------------|
| 068 | Phase 3 (remaining families) is Gap 1 of this spec |
| 069 | Layout templates add a new knowledge layer the MCP will need to serve |
| 070 | Agent architecture determines system/product boundary (affects D5) |

---

## Reevaluation Triggers

- **After first product agent application**: Real usage will reveal which gaps actually matter vs. which are theoretical. This is the most important trigger.
- **After 069 completion**: Layout templates may change the MCP tool surface area.
- **After 070 formalization**: Agent architecture decisions (especially system/product boundary) directly affect D5.
- **After Phase 3 family guidance**: Coverage data will show whether 13/13 families is sufficient or whether the guidance model itself needs refinement.

---

## Priority Assessment

1. **Gap 1 (Family guidance coverage)** — Highest impact, lowest risk, zero code. Should proceed first.
2. **Gap 2 (Token query)** — Highest architectural significance, needs Ada's input. Design before implementation.
3. **Gap 3 (Negative guidance)** — Likely defer (D4 option c or d). Let real usage reveal the need.
4. **Gap 4 (Cross-layer synthesis)** — Likely defer (D5 option a or c). Respect the system/product boundary.

---

## Open Decisions Summary

| ID | Decision | Status | Resolution |
|----|----------|--------|------------|
| D1 | Text Input / Form Inputs overlap | ✅ Resolved | Form Inputs family guidance covers all text inputs. No separate family needed. |
| D2 | Token tool scope | Deferred | Needs Ada's design input. No product agent usage yet to validate need. |
| D3 | Token data source | Deferred | Blocked on D2. |
| D4 | Negative guidance approach | Partially addressed | discouragedPatterns added as advisory field in family YAMLs. Dedicated system deferred. |
| D5 | Synthesis responsibility | Deferred | Respect system/product boundary. Reevaluate after 070. |
