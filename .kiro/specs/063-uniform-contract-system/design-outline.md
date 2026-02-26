# Uniform Contract System

**Date**: 2026-02-25
**Purpose**: Design and implement a uniform behavioral contract system for all Stemma components, converging 4 existing formats into a single machine-parseable standard
**Organization**: spec-guide
**Scope**: 063-uniform-contract-system
**Status**: Design decisions complete — pending spec formalization

---

## Problem Statement

The 062 Stemma Catalog Readiness Audit found that the behavioral contract system has grown organically into 4 incompatible documentation formats, a disconnected standard library, and significant gaps. This blocks schema formalization for the agentic UI pipeline.

Specific findings driving this work:

1. **4 contract documentation formats** — schema-inline (14 components), contracts.yaml (9 components), README-only (6 components), undocumented (2 components). No uniform machine-parseable source exists.
2. **Standard library referenced by 0 components** — 16 abstract contracts defined in Component-Schema-Format.md that no component uses by name. The governance layer and implementation layer evolved independently.
3. **12 contract categories discovered vs. 5 in standard library** — The real taxonomy is wider than governance docs describe.
4. **Naming inconsistencies** — `pressable` vs `clickable`, `hover_state` vs `hoverable`, `disabled_state` vs `supports_disabled_state`. Same behaviors, different names across formats.
5. **8 components with no schema YAML** — No machine-parseable contract source for Avatar, Button-Icon, Button-VerticalList-Item/Set, Input-Checkbox-Base/Legal, Input-Radio-Base/Set.
6. **2 components with zero documented contracts** — Avatar and Button-Icon have implementations and tests but no contract definitions in any format.
7. **Inheritance documentation at 3 quality levels** — Explicit (Input-Text family), declared-but-implicit (Chip, Badge-Count), conceptual-only (Checkbox).

The readiness recommendation from 062 was clear: align the contract system first, then proceed with schema formalization. This spec is that alignment work.

---

## Objectives

1. **Define the canonical contract format** — A single YAML format that all 28 components will use
2. **Establish the canonical vocabulary** — One name per behavioral concept, resolving all naming inconsistencies
3. **Finalize the contract taxonomy** — The set of categories that organize contracts by behavioral domain
4. **Define intentional exclusion representation** — How the system distinguishes "implements," "gap," and "by-design exclusion"
5. **Decide the hierarchy model** — Flat (concrete contracts with categories) vs. two-level (abstract + concrete)
6. **Migrate all 28 components** — Every component gets a contracts.yaml in the uniform format
7. **Reconcile governance documentation** — Update the stale "11 families" list and either update or deprecate the standard contracts library

---

## Scope

### In Scope
- Contract format design and specification
- Canonical vocabulary resolution
- Taxonomy consolidation
- Intentional exclusion representation
- Hierarchy model decision
- Migration of all 28 components to uniform format
- Governance doc updates (family list, standard library disposition)
- Inheritance formalization for all component hierarchies

### Out of Scope
- Component metadata schema for agentic UI (downstream — consumes this work's output)
- A2UI renderer bridge (further downstream)
- Token compliance audit (Ada's domain, separate concern)
- Writing new behavioral tests (test gaps flagged but not fixed here)
- New component development

---

## Design Decisions

### Decision 1: Canonical Format — Extended contracts.yaml

**Status**: Decided

The contracts.yaml format (used by Badge and Progress families) is the strongest candidate, extended with a `required` field from the standard library:

```yaml
version: "1.0.0"
component: Component-Name
family: Family-Name

contracts:
  contract_name:
    category: interaction
    description: Short description
    behavior: |
      Detailed behavior description
    wcag: "2.1.1 Keyboard"
    platforms: [web, ios, android]
    validation:
      - Validation criterion 1
      - Validation criterion 2
    test_approach: |
      How to test this contract
    required: true
```

**Why this format**: Richest existing format. Machine-parseable. Already in use by 9 components. Adding `required` addresses the "is this contract mandatory?" question.

**Header fields**: `version` enables migration tracking. `component` and `family` give agents context when reading the file without directory path awareness (per Lina consultation).

**Source of truth**: contracts.yaml is the sole source of truth for behavioral contracts. The schema YAML's `behavioral_contracts:` array will be removed during migration. This eliminates the sync problem of maintaining contract references in two files.

**Rationale**: AI agents are the primary consumers of contract data. A single authoritative file per component is simpler for agents to read and write. The short-term loss of "component at a glance" readability in the schema YAML is addressed by the component metadata schema (next spec), which will provide a proper queryable view.

**Migration impact by current format**:
- 9 components with contracts.yaml → Add `required` field, remove `behavioral_contracts:` from schema YAML
- 14 components with schema-inline → Extract and restructure contracts into dedicated contracts.yaml, add `category`, `test_approach`, `required`, remove inline contract definitions from schema YAML
- 6 components with README-only → Create contracts.yaml from README tables, add all fields
- 2 undocumented components → Define contracts from scratch

**Counter-argument**: Removing contract references from the schema YAML means a human scanning a component directory must open contracts.yaml separately to see what the component guarantees. The schema YAML becomes less self-contained. If the metadata schema is delayed, this readability gap persists longer than expected.

---

### Decision 2: Canonical Vocabulary

**Status**: Decided

**Naming convention**: `{category}_{concept}`, `snake_case`. No `supports_` or `provides_` prefix. The category prefix replaces the need for directional prefixes — every contract name is predictable from its category and concept.

**Rationale**: AI agents will both read and write contract names. A single predictable pattern (`{category}_{concept}`) is optimal for agent consumption — an agent can construct a name from the concept and parse the category from any name without metadata lookup. Prefixes like `provides_` introduced a second pattern that required judgment about when to apply.

| Concept | Canonical Name | Current Variants |
|---------|---------------|-----------------|
| Keyboard focus | `interaction_focusable` | `focusable`, `keyboard_focusable` |
| Click/tap response | `interaction_pressable` | `clickable`, `pressable`, `press_interaction` |
| Hover feedback | `interaction_hover` | `hoverable`, `hover_state` |
| Press feedback | `interaction_pressed` | `pressable` (overloaded), `pressed_state` |
| Focus ring | `interaction_focus_ring` | `focus_ring` |
| Secure input | `interaction_secure_input` | `provides_secure_input` |
| Email autocomplete | `interaction_email_autocomplete` | `provides_email_autocomplete` |
| Disabled | `state_disabled` | `supports_disabled_state`, `disabled_state` |
| Error display | `state_error` | `supports_error_states`, `error_state_display`, `error_state` |
| Success display | `state_success` | `success_state_display`, `success_state` |
| Loading | `state_loading` | `supports_loading_state`, `loading_state` |
| Reduced motion | `accessibility_reduced_motion` | `reduced_motion_support`, `respects_reduced_motion` |
| Non-interactive | `accessibility_non_interactive` | `non_interactive` |
| Form participation | `validation_form_integration` | `form_integration` |
| Checkmark animation | `animation_checkmark` | `checkmark_animation` |
| Circular shape | `visual_circular_shape` | `circular_shape` |
| State colors | `visual_state_colors` | `renders_state_colors` |

**Classification tiebreaker rule**: When a contract could fit multiple categories, assign to the category that best reflects the contract's purpose for the end user. This rule optimizes for agent selection — agents seek components by purpose, so contracts should be categorized by purpose.

**Category field redundancy**: The `category:` field in contracts.yaml is retained even though the `{category}_{concept}` name encodes the same information. The explicit field is more robust than parsing the name (no dependency on naming convention stability) and enables validation — a mismatch between the name prefix and the `category:` field signals an error. Enforced redundancy as an integrity check.

**Worked examples**:
- `form_integration` → `validation_form_integration` (purpose is input correctness in a form context, not structural composition)
- `non_interactive` → `accessibility_non_interactive` (purpose is declaring the component is decorative for assistive technology, not describing interaction absence)
- `notification_color_semantic` → `visual_notification_color` (purpose is visual communication of urgency to the end user — precedent case for content/visual/state boundary, per Lina Flag 2)

**Boundary note — interaction category**: The `interaction` category contains both capability contracts (`interaction_focusable`, `interaction_pressable` — "can it do X?") and feedback contracts (`interaction_hover`, `interaction_pressed` — "what happens when X occurs?"). These are kept in one category because both serve the same end-user purpose: describing how the component responds to input. If this mix causes repeated classification confusion during migration, consider splitting into `interaction` (capabilities) and `feedback` (state responses to input). Try as-is first (per Lina Flag 1).

---

### Decision 3: Taxonomy Consolidation

**Status**: Decided

The audit discovered 12 categories. After review, consolidated to 10 with purpose-oriented definitions:

| # | Category | Definition | Merged From |
|---|----------|------------|-------------|
| 1 | `layout` | Contracts governing how a component structures and arranges its content and data | layout (from visual+layout merge proposal — kept separate) |
| 2 | `interaction` | Contracts governing how a component responds to user input across input methods | interaction |
| 3 | `state` | Contracts governing application-driven conditions that affect a component's availability or feedback | state |
| 4 | `validation` | Contracts governing a component's ability to evaluate input correctness and communicate results | validation |
| 5 | `accessibility` | Contracts guaranteeing a component is perceivable, operable, and understandable by all users, including those using assistive technology — includes dynamic announcements and live region behaviors | accessibility + notification |
| 6 | `composition` | Contracts governing a component's relationship with its child components — what it contains, requires, or orchestrates | composition |
| 7 | `content` | Contracts governing a component's required, conditional, or orchestrated display of data | content |
| 8 | `animation` | Contracts governing the motion and transitional behaviors of a component, including reduced-motion compliance | NEW — 16 of 28 components have animation behaviors |
| 9 | `visual` | Contracts governing a component's visual presentation — shape, color treatment, and appearance across states | visual + shape |
| 10 | `performance` | Contracts governing a component's rendering and loading behaviors | performance |

**Key decisions**:
- `notification` merged into `accessibility` — notification contracts (live regions, announcements) are accessibility delivery mechanisms
- `shape` merged into `visual` — both describe appearance; static vs. dynamic distinction can be a contract-level attribute if needed later
- `animation` restored as its own category — 16 of 28 components have animation/transition/motion behaviors; the 062 design brief incorrectly proposed removing it based on standard library usage (which no component references) rather than actual component behavior
- `layout` kept separate from `visual` — spatial arrangement and appearance are distinct concerns

**Boundary notes to document**:
- `animation` vs `interaction`: If a contract's primary purpose is responding to user input, it's `interaction`. If its primary purpose is describing motion behavior, it's `animation`. A hover color transition is interaction; a checkmark fade animation is animation.
- `content` vs `composition`: Content is about data display (what information the component shows). Composition is about component assembly (what child components it contains).

**Counter-argument for 9 categories (merging layout into visual)**: Layout and visual are both "rendering properties." Keeping them separate adds a classification decision for every rendering-related contract. If the boundary proves hard to maintain, merge later — splitting is harder than merging.

**Counter-argument for 11 categories (keeping notification separate)**: The merged accessibility category loses the distinction between static accessibility (labels, roles) and dynamic accessibility (live regions, announcements). If agents need that distinction, it would require subcategories or contract-level attributes within the merged category.

---

### Decision 4: Intentional Exclusion Representation

**Status**: Decided

Three states in the uniform system:
- `contracts:` block — what the component guarantees (✅)
- `excludes:` block — what the component intentionally does not support (🚫)
- Absence from both — not applicable or not yet addressed (— or ⚠️)

**Exclusion format**: Lighter than contracts — three fields only:

```yaml
excludes:
  state_disabled:
    reason: "If an action is unavailable, the component should not be rendered."
    category: state
    reference: "Chip-Base.schema.yaml, design philosophy section"
```

- `reason`: Design rationale for the exclusion
- `category`: Taxonomy category (redundant with the `{category}_{concept}` name but provides explicit context for agents parsing without naming convention awareness)
- `reference`: Direct pointer to where the exclusion decision was documented — gives agents a path to deeper context without searching

**Why lighter than contracts**: An exclusion isn't a capability — it's the absence of one. Fields like `validation`, `test_approach`, `platforms`, and `required` don't apply to something that intentionally doesn't exist. Adding them would produce empty or N/A fields everywhere.

**Why this matters**: An agent querying "does Chip-Base support disabled state?" gets a definitive "no, by design" with a reason and a reference — rather than silence (which could mean "not yet implemented" or "not applicable").

**Counter-argument for matching contract structure**: Different shapes for contracts and exclusions means two parsing patterns for schema consumers. A uniform shape (with empty fields for exclusions) is simpler to consume programmatically, even if the empty fields are noise. If schema consumption proves awkward with the lighter format, adding fields later is non-breaking.

---

### Decision 5: Hierarchy Model and Capability Discovery

**Status**: Decided

**Hierarchy**: Flat. Concrete contracts with category tags. No abstract layer.

The standard library's abstract contracts (`focusable`, `pressable`) were never adopted by any component. That's evidence against a two-level model. A flat model is simpler and the abstract level can be added later without breaking changes.

**Capability discovery**: Deferred to the component metadata schema (next spec). The metadata schema's job is making the catalog queryable for agents — building a separate discovery mechanism in the contract layer would duplicate that responsibility.

**Interim queryability**: The `{category}_{concept}` naming convention (Decision 2) makes contracts self-indexing via pattern matching. During the gap between this spec and the metadata schema spec, capability discovery works by scanning contracts.yaml files and filtering by name pattern (e.g., all `interaction_*` contracts). This is functional for development use — not a production query interface.

**Rationale**: The documentation MCP demonstrated that structured metadata layers (summaries, sections, cross-references) provide confident discoverability that raw file scanning cannot. The same principle applies here — the metadata schema provides structured entry points for agent queries, while contracts.yaml files provide the raw source of truth.

**Counter-argument for building a capability index now**: If the metadata schema is delayed, developers and agents working with the contract system have no clean query interface beyond file scanning. A generated `catalog-index.yaml` (contract → components) would be cheap insurance. Deferred unless the gap between specs proves problematic.

**Counter-argument for two-level hierarchy**: An abstract layer provides a cleaner query interface for agents ("give me all focusable components" maps directly to an abstract `focusable` concept). The flat model requires the metadata schema to provide this — an extra dependency. If the metadata schema proves insufficient for capability queries, revisit the abstract layer.

---

### Decision 6: Inheritance Formalization

**Status**: Decided

The audit found 3 levels of inheritance documentation quality:
1. **Explicit** (Input-Text family): `inherits:` declared, inherited contracts listed
2. **Declared but implicit** (Chip, Badge-Count): `inherits:` declared, inherited contracts not listed
3. **Conceptual** (Checkbox): README says "extends" but no formal declaration

**Approach**: Declare and resolve (Option B). Child components declare `inherits: ParentComponent` and list only their own contracts. The parent's contracts are resolved at read time by the metadata schema layer.

```yaml
# Input-Text-Email/contracts.yaml
inherits: Input-Text-Base
contracts:
  validation_email_format:
    category: validation
    description: Validates email format
    ...
```

**Rationale**: Optimized for AI agent consumption. Agents resolve parent lookups trivially — the extra file read that's inconvenient for humans is negligible for machines. DRY structure means agents writing contracts for new child components only need to declare `inherits:` and their own contracts, reducing the surface area for errors. The metadata schema (next spec) provides the fully resolved view for consumers.

**Conceptual inheritance eliminated**: All inheritance must be formally declared with `inherits:` or it doesn't exist. The audit found "conceptual" inheritance (Checkbox README says "extends" without a formal declaration). During migration, each conceptual relationship must be either formalized as `inherits:` or dropped. No more prose-only inheritance claims.

**Inheritance vs. composition corrections (per Lina Flag 3)**:
- Input-Checkbox-Legal → Input-Checkbox-Base: **Real inheritance**. Formalize with `inherits:`.
- Input-Radio-Set → Input-Radio-Base: **Not inheritance — composition**. Radio-Set orchestrates Radio-Base items (manages selection state across a collection). Use `composes:` in schema YAML with `relationship: orchestrates`. Same pattern as Button-VerticalList-Set → Button-VerticalList-Item.
- Badge-Count-Notification → Badge-Count-Base: **Already formally declared**. Clean.

**Counter-argument**: If the metadata schema is delayed, there's no way to see a child component's full contract set without manually reading the parent. Option C (listing inherited contract names without definitions) would have provided that at-a-glance view without full duplication. The DRY benefit of Option B depends on the metadata schema arriving to provide resolution.

---

### Decision 7: Composition Representation

**Status**: Decided

The audit found composition relationships distinct from inheritance:
- Progress-Stepper-Base composes Node-Base + Connector-Base
- Container-Card-Base composes Container-Base
- Button-VerticalList-Set orchestrates Button-VerticalList-Item
- Input-Radio-Set orchestrates Input-Radio-Base (corrected from inheritance — per Lina Flag 3)

**Placement**: Schema YAML, not contracts.yaml.

contracts.yaml answers "what does this component *do*?" (behavioral guarantees). Schema YAML answers "what *is* this component?" (structural identity). Composition is structural — a Progress-Stepper *is* a thing made of Nodes and Connectors. That's identity, not behavior.

```yaml
# In Progress-Stepper-Base.schema.yaml
composes:
  - component: Progress-Indicator-Node-Base
    relationship: required-child
  - component: Progress-Indicator-Connector-Base
    relationship: required-child
```

**Rationale**: Keeps structural information together in the schema YAML (props, slots, platform info, composition). An agent querying "what goes inside this component?" finds the answer alongside other structural metadata, not mixed in with behavioral contracts.

**Counter-argument**: Splitting composition from contracts means an agent building a full picture of a component reads two files (schema YAML for structure, contracts.yaml for behavior). But this is the same split we already have — and the metadata schema (next spec) unifies both into a single queryable view.

---

### Decision 8: Standard Library Disposition

**Status**: Decided — requires ballot measure for execution

The standard contracts library (Component-Schema-Format.md) defines 16 contracts that 0 components reference.

**Decision**: Deprecate. Add a deprecation note to Component-Schema-Format.md pointing to the uniform contract system as the replacement. Stop maintaining the library.

**Rationale**: The flat hierarchy model (Decision 5) eliminates the abstract layer the library would serve. The contracts.yaml files per component *are* the library. The metadata schema provides the queryable catalog view. A separate reference document would duplicate information already maintained in contracts.yaml files — the same redundancy pattern eliminated from schema YAML (Decision 1).

**Ballot measure**: Specific deprecation language will be drafted during spec execution and presented for Peter's approval before modifying the steering document.

**Counter-argument**: A centralized reference catalog has discoverability value — "what contracts exist across the system?" is easier to answer from one document than from 28 contracts.yaml files. The metadata schema addresses this, but until it exists, there's no single-document view of all contracts. If that gap proves painful, a *generated* (not manually maintained) catalog could fill it.

---

### Decision 9: Governance Updates

**Status**: Decided — requires ballot measure for execution

Two governance issues surfaced by the audit:

1. **"11 families" list is stale** — Chip and Progress-Indicator are active families not in the canonical list. The actual count is at least 13.
2. **Avatar misalignment** — Named `Avatar` not `Avatar-Base`, listed as placeholder despite active implementation.

**Decision**: Update stemma-system-principles.md and Component-Inheritance-Structures.md to reflect reality. Add Chip and Progress-Indicator to the family list. Reconcile Avatar naming and status.

**Ballot measure**: Specific changes will be drafted during spec execution and presented for Peter's approval before modifying steering documents.

---

## External Reference Points

### WAI-ARIA Role Taxonomy
ARIA organizes roles hierarchically: widget roles (interactive), document structure roles, landmark roles, abstract roles. `checkbox` inherits from `input` which inherits from `widget`. This is the closest existing standard to a behavioral contract taxonomy. The proposed flat model diverges from ARIA's hierarchical approach — ARIA's hierarchy has proven useful for assistive technology but adds maintenance cost.

### A2UI Component Catalog Model
A2UI (v0.8, Google) uses a "pre-approved component catalog" where agents can only request components the client has registered. A2UI's standard catalog categories (Layout, Display, Interactive, Container) are coarser than the 10-category taxonomy but complementary — A2UI categorizes by purpose, the contract taxonomy categorizes by behavioral guarantee. The contract system feeds the component metadata schema, which feeds the A2UI renderer. Contracts are not consumed by A2UI directly.

### Industry Comparison
No major design system (Material, Carbon, Radix, Polaris) has formalized behavioral contracts as structured, machine-parseable, categorized metadata with explicit exclusions. Most document behaviors in prose. DesignerPunk's approach is novel — a strength (ahead of the curve) and a risk (no prior art to learn from).

---

## Agent Assignments

| Agent | Role | Scope |
|-------|------|-------|
| Lina | Stemma Component Specialist | Contract format design, contracts.yaml creation for all 28 components, inheritance formalization |
| Thurgood | Test Governance / Audit | Migration validation, standard library disposition proposal, governance update proposals |
| Ada | Rosetta Token Specialist | Contract-token relationship documentation (if warranted — medium priority) |

---

## Pre-Formalization Review Requests

Design decisions are finalized pending domain specialist review. Feedback from Lina and Ada should be collected before formal spec creation (requirements.md, design.md, tasks.md).

### Lina — Stemma Component Specialist (Critical Path)

Lina executes the migration. Her feedback can surface practical issues that change the design.

**Decision 1 (Canonical Format)**: The extended contracts.yaml format adds `required`, `category`, and `test_approach` fields. contracts.yaml becomes the sole source of truth — the `behavioral_contracts:` array in schema YAML will be removed.
- Does the format work for all 28 components, or are there edge cases where it breaks down?
- Any concerns about removing contract references from schema YAML?

**Decision 2 (Vocabulary)**: All contracts renamed to `{category}_{concept}` pattern, snake_case, no prefixes.
- Review the canonical name table. Are there contracts where the proposed name is ambiguous or misleading?
- Are there component-specific contracts not in the table that need canonical names?

**Decision 3 (Taxonomy)**: 10 categories with purpose-oriented definitions. Animation restored (16 components have animation behaviors). Shape merged into visual. Notification merged into accessibility.
- Do any existing contracts not fit cleanly into the 10 categories?
- Does the animation/interaction boundary note (primary purpose determines category) work in practice?

**Decision 6 (Inheritance)**: Declare-and-resolve — child declares `inherits: ParentComponent`, lists only its own contracts. No conceptual inheritance.
- For each current "conceptual" inheritance relationship: is it real inheritance (formalize with `inherits:`) or not (drop the claim)?
- Any concerns about the parent lookup requirement for resolving full contract sets?

**Decision 7 (Composition)**: `composes:` block lives in schema YAML, not contracts.yaml.
- Does this split feel right given she maintains both files?
- Are there composition relationships the audit missed?

### Ada — Rosetta Token Specialist (Parallel Review)

Ada's scope is narrow but worth confirming.

**Contract-token relationships (from 062 gap A2)**: Contracts reference tokens (e.g., `interaction_hover` references `blend.hoverDarker`) but the relationship isn't formalized.
- Should this spec include a `tokens:` field in contracts.yaml linking contracts to the tokens they depend on?
- Or is this better addressed in the metadata schema spec or a separate token compliance audit?

**General**: Any concerns about how the uniform contract system interacts with the Rosetta token layer? Anything in the 10-category taxonomy or the `{category}_{concept}` naming convention that conflicts with token naming patterns?

---

## Sequencing

```
1. ✅ Finalize design decisions (this document) — COMPLETE
2. ✅ Collect Lina + Ada review feedback — COMPLETE
3. → Formalize spec (requirements.md, design.md, tasks.md) — NEXT
4.   Build full 108→canonical name mapping (per Lina resolution item 2)
5.   Create contracts.yaml for 8 schema-less components (L1+L2 critical gaps)
6.   Define contracts for Avatar and Button-Icon (L1 critical gap)
7.   Extract and restructure contracts from 14 schema-inline components to dedicated contracts.yaml
8.   Add required field to 9 existing contracts.yaml files
9.   Formalize all inheritance relationships
10.  Update governance docs (ballot measures)
11.  Validate migration completeness
```

Step 4 must complete before steps 5-8 begin — the name mapping prevents mid-migration category debates. Steps 5-8 can partially overlap after that. Steps 9-10 can run in parallel. Step 11 is the gate before downstream schema work begins.

---

## Estimated Effort

Based on 062 design brief estimates, adjusted for scope:

| Work Item | Effort | Owner |
|-----------|--------|-------|
| Finalize design decisions | 0.5 day | Peter (decisions) + Lina (format design) |
| Create contracts.yaml for 8 schema-less components | 1 day | Lina |
| Define contracts for Avatar and Button-Icon | 0.5 day | Lina |
| Extract contracts from 14 schema-inline components | 1 day | Lina |
| Add required field to 9 existing contracts.yaml | 0.25 day | Lina |
| Formalize inheritance relationships | 0.5 day | Lina |
| Governance updates (ballot measures) | 0.5 day | Thurgood (propose) + Peter (approve) |
| Validate migration | 0.5 day | Thurgood |
| **Total** | **~4.75 days** | |

---

## Success Criteria

1. All 28 components have a contracts.yaml in the uniform format
2. Canonical vocabulary applied consistently — zero naming inconsistencies
3. All inheritance relationships formally declared
4. All intentional exclusions captured in `excludes` blocks
5. Standard library disposition decided and executed
6. Governance docs updated to reflect actual family count and Avatar status
7. Migration validated by Thurgood audit
8. Downstream schema work unblocked

---

## Connection to Agentic UI Strategy

This spec is Step 2 in the sequencing from the readiness recommendation:

```
1. ✅ Catalog readiness audit (062) — COMPLETE
2. → Uniform contract system design (this spec)
3.   Component metadata schema — consumes uniform contracts
4.   A2UI validation — validates schema against A2UI as proof-of-concept
```

Per the integration methodology (Process-Integration-Methodology.md), the contract system is the "internal system" that feeds the "canonical schema" (component metadata schema), which feeds the "integration transformer" (A2UI renderer). This spec ensures the internal system is consistent enough to generate a schema from.

---

## Ada Consultation Response

**Date**: 2026-02-25
**Status**: Review complete — no blockers, 1 recommendation, 1 downstream flag

### Contract-Token Relationships — Recommendation

**Do not add a `tokens:` field to contracts.yaml in this spec.**

The contract-token relationship is a *consumption* relationship, not a *definitional* one. A contract like `interaction_hover` guarantees hover feedback behavior. The fact that it's implemented using `blend.hoverDarker` is an implementation detail — the contract would still be valid if the token changed to a different blend value. Hardcoding token references into contracts.yaml couples behavioral guarantees to specific tokens, meaning a token rename or restructure forces contract file updates across 28 components. That's the sync problem this spec is eliminating, not creating.

**Right place**: The metadata schema (next spec). The schema can express "this contract's implementation depends on these tokens" as a derived relationship — queried, not hardcoded. This keeps contracts.yaml clean (behavioral guarantees only) and keeps token governance in the Rosetta layer.

A separate token compliance audit could later validate that implementations actually use the correct tokens — but that's a compliance check, not a contract definition concern.

### Naming and Taxonomy — No Conflicts

The `{category}_{concept}` snake_case pattern for contracts is cleanly distinct from camelCase dot-notation for tokens (`color.feedback.error.text`, `blend.hoverDarker`, `space125`). An agent or tool will never confuse a contract name for a token name. The different conventions actually help — they signal which system you're in.

**Observation**: The `visual` contract category will have the heaviest token dependency. Contracts like `visual_state_colors` and `visual_circular_shape` are almost entirely *about* token usage — state colors map to `color.progress.*` tokens, circular shape uses `borderRadius.*` tokens. When the metadata schema formalizes contract-token relationships, the `visual` category will be the most densely connected to Rosetta. Not a problem — just a heads-up for sequencing that work.

### Downstream Flag: Motion Token Family Gap

The `animation` category (Decision 3) references motion tokens (`motion.selectionTransition` in Button-VerticalList-Item). DesignerPunk's motion token family is thin — a few component-level motion values exist but there's no formal motion token family in Rosetta comparable to color, space, and typography families.

If the uniform contract system surfaces 16 components with animation contracts, that will highlight the gap in the motion token layer. The contract system may generate demand for a motion token family that doesn't exist yet.

**Not a blocker for this spec.** But worth tracking as a downstream implication — the animation category could trigger a motion token family spec once migration reveals the scope of motion-related token needs.

---

## Lina Consultation Response

**Date**: 2026-02-25
**Status**: Review complete — 2 items to resolve before formalization, 4 flags for awareness

### Items to Resolve

**1. Canonical format missing header fields**
The existing contracts.yaml files (Badge, Progress families) include `version`, `component`, and `family` header fields that the Decision 1 format example omits:

```yaml
version: "1.0.0"
component: Badge-Count-Base
family: Badge

contracts:
  content_displays_count:
    category: content
    ...
```

Recommendation: Add these to the canonical format spec. `version` enables migration tracking. `component` and `family` give agents context when reading the file without directory path awareness. Small addition, meaningful for agent consumption.

**2. Full canonical name mapping needed as explicit early task**
The Decision 2 vocabulary table has 17 entries, but the audit found 108 distinct contract names. The remaining ~91 (mostly component-specific) need canonical names during migration. Many will be straightforward (`displays_count` → `content_displays_count`), but some will require judgment calls against the tiebreaker rule.

Recommendation: Build the complete 108→canonical name mapping as the first migration task — before touching any component files. This catches ambiguities and category disputes upfront rather than mid-migration. Should be reflected in the sequencing and tasks.

### Flags for Awareness

**Flag 1: Interaction category mixes capability and feedback contracts**
`interaction_focusable` and `interaction_pressable` describe *capabilities* ("can it do X?"). `interaction_hover` and `interaction_pressed` describe *feedback states* ("what does it look like when X happens?"). These are two different semantic patterns under one category. Not recommending a split — I can work with it — but noting it as a potential source of confusion during migration. If it causes repeated classification debates, consider splitting interaction into `interaction` (capabilities) and `feedback` (state responses to input).

**Flag 2: Content/visual/state boundary edge case**
Badge-Count-Notification has `notification_color_semantic` which maps notification types (info, warning, error) to colors. This could be:
- `visual` (appearance driven by condition)
- `content` (communicating meaning through color)
- `state` (application-driven condition)

Applying the tiebreaker rule ("purpose for the end user"), I'd categorize as `visual` — the purpose is visual communication of urgency. But this is the kind of edge case that will recur. Documenting the reasoning for this specific case would help establish precedent for similar contracts.

**Flag 3: Radio-Set is composition, not inheritance**
The audit listed Input-Radio-Set's relationship to Input-Radio-Base as a potential inheritance case. It's not — Radio-Set *orchestrates* Radio-Base items (manages selection state across a collection). It doesn't inherit Radio-Base's contracts. This should be `composes:` in schema YAML with `relationship: orchestrates`, not `inherits:` in contracts.yaml. Same pattern as Button-VerticalList-Set → Button-VerticalList-Item.

Confirmed inheritance relationships for formalization:
- Input-Checkbox-Legal → Input-Checkbox-Base: **Real inheritance** (adds required-acceptance on top of toggle behavior). Formalize with `inherits:`.
- Input-Radio-Set → Input-Radio-Base: **Not inheritance — composition**. Use `composes:` in schema YAML.
- Badge-Count-Notification → Badge-Count-Base: **Already formally declared**. Clean.

**Flag 4: Schema-inline extraction is restructure, not deletion**
Decision 1 notes removing `behavioral_contracts:` from schema YAML. For the 14 schema-inline components, the schema YAML contains full contract *definitions* (descriptions, behavior blocks, validation criteria), not just name references. "Remove from schema YAML" means extracting substantial content into contracts.yaml and restructuring it to match the canonical format. The effort estimate already accounts for this (~1 day for 14 components), but the migration tasks should describe this as "extract and restructure" rather than "remove references" to set accurate expectations.

### No Concerns

- Decision 3 (Taxonomy): 10 categories works. Animation/interaction boundary note is practical.
- Decision 4 (Exclusions): Lighter format is right.
- Decision 5 (Hierarchy + Discovery): Flat model with metadata schema discovery is sound.
- Decision 7 (Composition): Schema YAML is the right place. No missed composition relationships beyond the Radio-Set correction above.
- Decision 8 (Standard Library): Deprecate is correct.
- Decision 9 (Governance): Straightforward updates.

---

## Related Documentation

- `.kiro/specs/062-stemma-catalog-readiness-audit/` — Audit findings that drive this work
- `.kiro/specs/062-stemma-catalog-readiness-audit/findings/contract-system-design-brief.md` — Design brief with initial proposals
- `.kiro/docs/agentic-ui-strategy.md` — Strategic context for the agentic UI pipeline
- `.kiro/steering/Process-Integration-Methodology.md` — Integration methodology this work feeds into
- `.kiro/steering/Rosetta-Stemma-Systems-Overview.md` — Stemma system architecture reference
