---
inclusion: manual
name: Contract-System-Reference
description: Uniform behavioral contract system reference — 10-category taxonomy with definitions, concept catalog with all 112 concepts, {category}_{concept} naming convention, canonical contracts.yaml format, exclusion format, inheritance and composition patterns, classification rules. Load when creating or modifying component contracts, auditing contract coverage, or building contract-consuming systems.
---

# Contract System Reference

**Date**: February 25, 2026
**Purpose**: Authoritative reference for the uniform behavioral contract system governing all Stemma components
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, architecture, spec-planning, audit

---

## Overview

The uniform contract system (established by Spec 063) defines how behavioral contracts are documented across all Stemma components. Every component has a `contracts.yaml` file as the sole source of truth for its behavioral guarantees.

This document is the authoritative reference for contract conventions. For the design rationale behind these decisions, see `.kiro/specs/063-uniform-contract-system/design-outline.md`.

---

## Taxonomy

10 categories organized by purpose — what the contract means for the end user.

| # | Category | Definition |
|---|----------|------------|
| 1 | `layout` | Contracts governing how a component structures and arranges its content and data |
| 2 | `interaction` | Contracts governing how a component responds to user input across input methods |
| 3 | `state` | Contracts governing application-driven conditions that affect a component's availability or feedback |
| 4 | `validation` | Contracts governing a component's ability to evaluate input correctness and communicate results |
| 5 | `accessibility` | Contracts guaranteeing a component is perceivable, operable, and understandable by all users, including those using assistive technology — includes dynamic announcements and live region behaviors |
| 6 | `composition` | Contracts governing a component's relationship with its child components — what it contains, requires, or orchestrates |
| 7 | `content` | Contracts governing a component's required, conditional, or orchestrated display of data |
| 8 | `animation` | Contracts governing the motion and transitional behaviors of a component, including reduced-motion compliance |
| 9 | `visual` | Contracts governing a component's visual presentation — shape, color treatment, and appearance across states |
| 10 | `performance` | Contracts governing a component's rendering and loading behaviors |

---

## Concept Catalog

112 concepts across 10 categories. Derived from the 28 deployed contracts.yaml files as of Spec 063 completion.

### accessibility (22)

`actual_position` · `alt_text` · `announces_changes` · `aria_label` · `aria_pressed` · `aria_role` · `aria_roles` · `color_contrast` · `decorative` · `decorative_mode` · `dismiss_label` · `error_announcement` · `hidden` · `list_role` · `non_interactive` · `pluralized_announcements` · `progressbar_role` · `radiogroup_role` · `reduced_motion` · `role` · `text_scaling` · `touch_target`

### animation (2)

`checkmark` · `coordination`

### composition (7)

`all_primitives` · `error_propagation` · `icon_precedence` · `mutual_exclusivity` · `node_and_connector` · `node_only` · `state_coordination`

### content (16)

`displays_count` · `displays_fallback` · `displays_image` · `displays_label` · `dual_icons` · `float_label` · `helper_text` · `international_formats` · `label_text` · `phone_formatting` · `renders` · `supports_icon` · `trailing_dismiss_icon` · `trailing_icon` · `truncates_at_max` · `truncation`

### interaction (15)

`dismiss` · `email_autocomplete` · `expanded_tap_area` · `focus_ring` · `focusable` · `hover` · `keyboard_activation` · `keyboard_navigation` · `password_autocomplete` · `password_toggle` · `pressable` · `pressed` · `roving_tabindex` · `secure_input` · `toggle_selection`

### layout (3)

`contains_children` · `flexible_length` · `padding`

### performance (1)

`virtualization`

### state (15)

`binary_derivation` · `checked` · `connector_derivation` · `controlled` · `disabled` · `error` · `indeterminate` · `loading` · `mode_driven` · `priority_derivation` · `selected` · `selected_styling` · `styling` · `success` · `visual_driven`

### validation (9)

`audit_trail` · `email_format` · `explicit_consent` · `form_integration` · `group_required` · `on_blur` · `phone_format` · `selection_constraints` · `size_restriction`

### visual (22)

`background` · `border` · `boundary` · `checkmark_icon` · `circular_shape` · `color_inheritance` · `entity_shape` · `notification_color` · `optical_balance` · `pill_container` · `pill_shape` · `radius` · `renders_icon` · `renders_svg` · `rounded_corners` · `shadow` · `size_emphasis` · `size_variants` · `state_colors` · `thickness` · `typography` · `variant_styling`

---

## Naming Convention

All contract names follow `{category}_{concept}` in `snake_case`. No `supports_`, `provides_`, or other directional prefixes.

**Examples**:

| Concept | Canonical Name |
|---------|---------------|
| Keyboard focus | `interaction_focusable` |
| Click/tap response | `interaction_pressable` |
| Hover feedback | `interaction_hover` |
| Disabled | `state_disabled` |
| Error display | `state_error` |
| Reduced motion | `accessibility_reduced_motion` |
| Form participation | `validation_form_integration` |
| Checkmark animation | `animation_checkmark` |
| Circular shape | `visual_circular_shape` |

The Concept Catalog above lists all 112 concepts. For the historical migration mapping (113 source names → 104 canonical names, pre-Task 2.1), see `.kiro/specs/063-uniform-contract-system/findings/canonical-name-mapping.md`.

---

## Classification Rules

### Tiebreaker Rule

When a contract could fit multiple categories, assign to the category that best reflects its **purpose for the end user**. This optimizes for agent selection — agents seek components by purpose.

### Boundary Notes

- **animation vs. interaction**: If the contract's primary purpose is responding to user input, it's `interaction`. If its primary purpose is describing motion behavior, it's `animation`. A hover color transition is interaction; a checkmark fade animation is animation.
- **content vs. composition**: Content is about data display (what information the component shows). Composition is about component assembly (what child components it contains).
- **interaction note**: The category contains both capability contracts (`interaction_focusable` — "can it do X?") and feedback contracts (`interaction_hover` — "what happens when X occurs?"). Both serve the same end-user purpose: describing how the component responds to input.

### Category Field Redundancy

The `category:` field in contracts.yaml is retained even though the `{category}_{concept}` name encodes the same information. The explicit field enables validation — a mismatch between the name prefix and the `category:` field signals an error.

---

## Canonical Format

### contracts.yaml

Every component has one `contracts.yaml` file as the sole source of truth for behavioral contracts.

```yaml
version: "1.0.0"
component: Component-Name
family: Family-Name

contracts:
  interaction_focusable:
    category: interaction
    description: Component receives keyboard focus
    behavior: |
      Detailed behavior description
    wcag: "2.1.1 Keyboard"
    platforms: [web, ios, android]
    validation:
      - Component receives focus via Tab key
      - Focus indicator visible
    test_approach: |
      How to test this contract
    required: true

excludes:
  state_disabled:
    reason: "Design rationale for the exclusion"
    category: state
    reference: "Pointer to where the decision was documented"
```

### Header Fields

| Field | Purpose |
|-------|---------|
| `version` | Migration tracking |
| `component` | Component name (agents can read without directory context) |
| `family` | Stemma family |

### Contract Fields

| Field | Purpose |
|-------|---------|
| `category` | Taxonomy category (redundant with name prefix — enables validation) |
| `description` | Short description of the behavioral guarantee |
| `behavior` | Detailed behavior description |
| `wcag` | WCAG criterion this contract supports (null if not applicable) |
| `platforms` | Platforms where this contract applies |
| `validation` | Testable criteria for verifying the contract |
| `test_approach` | How to test this contract |
| `required` | Whether this contract is mandatory for the component |

### Exclusion Fields

Lighter than contracts — three fields only.

| Field | Purpose |
|-------|---------|
| `reason` | Design rationale for the exclusion |
| `category` | Taxonomy category |
| `reference` | Pointer to where the exclusion decision was documented |

---

## Inheritance

Child components declare `inherits: ParentComponent` and list only their own extended contracts. Parent contracts are resolved at read time.

```yaml
version: "1.0.0"
component: Input-Text-Email
family: Input-Text
inherits: Input-Text-Base

contracts:
  validation_email_format:
    category: validation
    description: Validates email address format
    ...
```

All inheritance must be formally declared. No "conceptual" inheritance — either `inherits:` is present or the relationship doesn't exist.

---

## Composition

Composition relationships live in schema YAML (not contracts.yaml). contracts.yaml describes behavior; schema YAML describes structure.

```yaml
# In schema YAML
composes:
  - component: Progress-Indicator-Node-Base
    relationship: One per step
  - component: Progress-Indicator-Connector-Base
    relationship: One between adjacent nodes
```

---

## Three States

Every behavioral contract for every component is in one of three states:

| State | Location | Meaning |
|-------|----------|---------|
| ✅ Implemented | `contracts:` block | Component guarantees this behavior |
| 🚫 Excluded by design | `excludes:` block | Component intentionally does not support this |
| — Not applicable | Absent from both | Not relevant or not yet addressed |

---

## Related Documentation

- `.kiro/specs/063-uniform-contract-system/design-outline.md` — Design rationale for all decisions
- `.kiro/specs/063-uniform-contract-system/findings/format-specification.md` — Detailed format specification
- `.kiro/specs/063-uniform-contract-system/findings/canonical-name-mapping.md` — Complete name mapping
- `.kiro/steering/Component-Schema-Format.md` — Schema YAML format (companion to contracts.yaml)
- `.kiro/steering/stemma-system-principles.md` — Stemma system principles and family architecture
