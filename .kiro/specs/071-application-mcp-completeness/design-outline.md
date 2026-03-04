# Application MCP Completeness: Coverage Gaps and Effectiveness Maximization

**Date**: 2026-03-04
**Purpose**: Identify and address remaining gaps in the Application MCP to maximize its effectiveness for product agent consumption
**Organization**: spec-guide
**Scope**: 071-application-mcp-completeness
**Status**: Design outline — early thinking, pending review

---

## Problem Statement

The Application MCP (Spec 067) provides 10 tools across component discovery, composition validation, experience patterns, and family guidance. Post-068, the system is architecturally complete — all planned knowledge layers have at least one implementation.

But coverage within those layers is uneven. Family guidance covers 3 of 13 families. Token knowledge is entirely absent from the Application MCP. And no product agent has consumed the MCP yet, meaning the gap analysis is theoretical rather than empirically validated.

This spec addresses the known coverage gaps and positions the MCP for its first real product application.

---

## Current State (Post-068, v9.1.0)

### What the MCP serves well
- **Component discovery**: catalog, summary, full, find (with context filter), health — 28 components indexed
- **Composition validation**: check_composition — structural parent/child rules
- **Experience patterns**: list, get, validate_assembly — 3 patterns (simple-form, settings-screen, account-onboarding)
- **Family guidance**: get_prop_guidance — 3 families (Buttons, Form Inputs, Containers)

### What's missing or underserving
1. **Family guidance coverage** — 10 of 13 families have no companion YAML
2. **Token query capability** — no MCP tool for token selection guidance
3. **Negative guidance** — no "don't do this" query path beyond whenNotToUse in family guidance
4. **Cross-layer synthesis** — every query is stateless; no tool combines pattern + guidance + token knowledge

---

## Gap 1: Remaining Family Guidance Files (Phase 3 of 068)

### The Gap
Only 3 of 13 component families have companion YAML files. A product agent asking about Avatars, Badges, Chips, Progress indicators, Navigation components, or Icons gets null from `get_prop_guidance`.

### Families Remaining
Per D3 from 068, these should be batched by structural similarity:

**Batch A — Simple flat families** (similar to button.yaml):
- Avatar (Avatar-Base, Avatar-Group)
- Badge (Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base)
- Chip (Chip-Base)
- Icon (Icon-Base)

**Batch B — Grouped families** (similar to form-inputs.yaml):
- Progress (Progress-Bar-Base, Progress-Circle-Base, Progress-Step-Base)
- Navigation (Nav-SegmentedChoice-Base, Nav-BottomTabs-Base — design outlines exist)

**Batch C — Complex/composition families** (similar to container.yaml):
- Container (Container-Card-Base already covered; remaining variants if any)
- Text Input (Input-Text-Base and specialized inputs — overlap with Form Inputs family?)
- Vertical List Buttons (Button-VerticalList-Set, Button-VerticalList-Item)

### Scope
- Pure content work — no new code, no new MCP tools
- FamilyGuidanceIndexer already handles all structural types
- Interview-driven authoring process proven in 068 Phase 2
- D9 compliance required for all files

### Open Decision (D1): Text Input / Form Inputs Overlap
Form Inputs family guidance already covers Input-Text-Base, Input-Email, Input-PhoneNumber. Does the Text Input family need its own companion YAML, or is it fully covered by form-inputs.yaml? Need to audit the Component-Family steering docs to determine if there's a separate Text Input family or if it's subsumed.

### Effort Estimate
~10 companion YAML files. Each takes roughly the effort of one 068 Phase 2 interview cycle. Batching by similarity should accelerate later files in each batch.

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

| ID | Decision | Options | Recommendation |
|----|----------|---------|----------------|
| D1 | Text Input / Form Inputs overlap | Audit needed | Audit before Phase 3 |
| D2 | Token tool scope | (a) semantic only, (b) full hierarchy, (c) component-context, (d) defer | Low confidence — needs Ada |
| D3 | Token data source | (a) parse source, (b) companion YAML, (c) test infra, (d) cross-MCP | Low confidence — needs Ada |
| D4 | Negative guidance approach | (a) expand whenNotToUse, (b) dedicated system, (c) accept gap, (d) defer | (d) defer |
| D5 | Synthesis responsibility | (a) product agent's job, (b) lightweight tool, (c) defer | (a) with reevaluation after 070 |
