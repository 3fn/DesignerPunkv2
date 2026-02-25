# Contract System Design Brief

**Date**: February 25, 2026
**Spec**: 062 - Stemma Catalog Readiness Audit
**Phase**: 3 (Task 3.2)
**Status**: Complete — Recommendation for post-audit design work, not a decision

---

## Purpose

This brief captures the full taxonomy discovered during the audit, recommends a format convergence point, outlines the hierarchy model, and addresses intentional exclusion representation. It is a starting point for the uniform contract system design, not the design itself.

---

## 1. Complete Contract Taxonomy

### Categories (12 discovered)

| Category | Description | Families Using It |
|----------|-------------|-------------------|
| interaction | User interaction behaviors (focus, press, hover) | Buttons, Form Inputs, Chips, Containers, Badges |
| validation | Input validation behaviors | Form Inputs, Progress, Buttons (VerticalList-Set) |
| state | State management behaviors | Progress, Buttons |
| accessibility | Assistive technology support | All families |
| composition | Component-to-component assembly | Progress |
| content | Content rendering guarantees | Badges, Progress |
| shape | Content-driven shape adaptation | Badges |
| visual | Visual rendering properties | Progress (primitives) |
| layout | Spatial arrangement | Progress (Connector) |
| performance | Runtime optimization guarantees | Progress |
| notification | Live region / dynamic announcements | Badges |
| animation | Motion and transition behaviors | (standard library only — unused in practice) |

### Recommended Taxonomy Consolidation

Some categories overlap and could be merged without losing meaning:

- **visual + layout → visual**: Both describe rendering properties. `flexible_length` (layout) and `renders_state_colors` (visual) are both about how a component looks.
- **animation**: Remove as a standalone category. Animation behaviors are aspects of other categories (interaction animations, state transition animations, notification animations). The standard library defined it but no component uses it.
- **notification → accessibility**: Notification contracts (`announces_count_changes`, `pluralized_announcements`) are accessibility behaviors — they're about screen reader announcements.

**Proposed consolidated taxonomy (9 categories)**:

| Category | Merged From |
|----------|-------------|
| interaction | interaction |
| validation | validation |
| state | state |
| accessibility | accessibility + notification |
| composition | composition |
| content | content |
| shape | shape |
| visual | visual + layout |
| performance | performance |

**Counter-argument**: Merging notification into accessibility loses the distinction between static accessibility (labels, roles) and dynamic accessibility (live regions, announcements). If the schema needs to distinguish these, keep notification separate.

---

## 2. Format Convergence Recommendation

### Recommended Format: Extended contracts.yaml

The contracts.yaml format (Format 3) is the strongest candidate, extended with one field from the standard library:

```yaml
contract_name:
  category: interaction          # From contracts.yaml
  description: Short description # From contracts.yaml
  behavior: |                    # From contracts.yaml
    Detailed behavior description
  wcag: "2.1.1 Keyboard"        # From contracts.yaml
  platforms: [web, ios, android] # From contracts.yaml
  validation:                    # From contracts.yaml
    - Validation criterion 1
    - Validation criterion 2
  test_approach: |               # From contracts.yaml
    How to test this contract
  required: true                 # From standard library — NEW addition
```

**Why this format**:
- It's the richest existing format (has everything schema-inline has, plus category and test_approach)
- It's machine-parseable (YAML)
- It's already in use by 9 components (Badge and Progress families)
- Adding `required` from the standard library addresses the "is this contract mandatory for this component type?" question

**What changes for existing components**:
- **9 components with contracts.yaml**: Add `required` field. Otherwise no change.
- **14 components with schema-inline**: Extract contracts from schema into dedicated contracts.yaml. Add `category`, `test_approach`, and `required` fields.
- **6 components with README-only**: Create contracts.yaml from README tables. Add all fields.
- **2 undocumented components**: Define contracts from scratch in contracts.yaml format.

### Where Contracts Live

**Recommendation**: Dedicated `contracts.yaml` file per component, separate from the schema.

The schema YAML should reference contracts by name (as it does now with `behavioral_contracts:` arrays) but not define them inline. This separates the contract definitions (what the component guarantees) from the component schema (what the component is and how it's configured).

**Counter-argument**: Having contracts in a separate file means two files to maintain. Inline contracts in the schema keep everything in one place. The Badge/Progress families already have both (schema references + contracts.yaml definitions), which works but is more files.

---

## 3. Hierarchy Model

### Recommendation: Two-Level — Abstract Categories + Concrete Contracts

The standard library defines abstract contracts (`focusable`, `pressable`). Components define concrete contracts (`keyboard_focusable`, `press_interaction`, `displays_count`). These are different levels of abstraction that should be formally connected.

**Proposed model**:

```
Abstract Category (e.g., "interaction")
├── Abstract Contract (e.g., "focusable")
│   ├── Concrete: Button-CTA.focusable
│   ├── Concrete: Chip-Base.keyboard_focusable
│   └── Concrete: Input-Text-Base.focusable
└── Abstract Contract (e.g., "pressable")
    ├── Concrete: Button-CTA.pressable
    ├── Concrete: Chip-Base.press_interaction
    └── Concrete: Input-Checkbox-Base.pressable
```

The abstract level answers: "Does this component participate in focus management?" The concrete level answers: "How exactly does this component handle focus?"

**For the schema**: The abstract level is what agents query ("give me all focusable components"). The concrete level is what the schema exposes as behavioral detail.

**Counter-argument**: A flat model (just concrete contracts with a category tag) is simpler and avoids the mapping work between abstract and concrete. The abstract level might not be worth the maintenance cost if agents can just filter by category. Lina's consultation left this as an open question — the audit findings should inform the decision, and the findings show that the abstract level (standard library) was never adopted. That's evidence against a two-level model.

**My lean**: Start flat (concrete contracts with categories). Add the abstract level only if agent consumption patterns require it. The flat model is simpler and the abstract level can be added later without breaking the flat model.

---

## 4. Intentional Exclusion Representation

### Recommendation: Explicit `excludes` Block

```yaml
# In Chip-Base contracts.yaml
excludes:
  disabled_state:
    reason: "If an action is unavailable, the component should not be rendered."
    category: interaction
    reference: "Chip-Base.schema.yaml, design philosophy section"
```

This makes exclusions first-class citizens in the contract system. An agent querying "does Chip-Base support disabled state?" gets a definitive "no, by design" rather than silence (which could mean "not yet implemented" or "not applicable").

**Three states in the uniform system**:
- `contracts:` block — what the component guarantees (✅)
- `excludes:` block — what the component intentionally does not support (🚫)
- Absence from both — not applicable or not yet addressed (— or ⚠️)

---

## 5. Canonical Vocabulary

### Recommended Name Resolutions

| Concept | Recommended Name | Rationale |
|---------|-----------------|-----------|
| Keyboard focus | `focusable` | Most common usage across catalog |
| Click/tap response | `pressable` | Cross-platform accurate (touch doesn't "click") |
| Hover feedback | `hover_state` | More descriptive than `hoverable` |
| Press feedback | `pressed_state` | Consistent with `hover_state` pattern |
| Disabled | `disabled_state` | Consistent with state naming pattern |
| Error display | `error_state` | Shorter, consistent with state pattern |
| Success display | `success_state` | Consistent with state pattern |
| Loading | `loading_state` | Consistent with state pattern |
| Focus ring | `focus_ring` | Specific, widely used |
| Reduced motion | `reduced_motion` | Shorter form |
| Non-interactive | `non_interactive` | Clear, already in use |
| Form participation | `form_integration` | Already in use |

**Naming convention**: `snake_case`, descriptive, no `supports_` or `provides_` prefix (those add verbosity without clarity).

---

## 6. Migration Scope Estimate

Based on Lina's estimate (2-3 days design, 1-2 days migration) and audit findings:

| Work Item | Effort | Owner |
|-----------|--------|-------|
| Finalize taxonomy and vocabulary | 0.5 day | Peter + Thurgood |
| Design uniform contract format | 1 day | Lina |
| Create contracts.yaml for 14 schema-inline components | 1 day | Lina |
| Create contracts.yaml for 6 README-only components | 0.5 day | Lina |
| Define contracts for Avatar and Button-Icon | 0.5 day | Lina |
| Update standard library or deprecate | 0.5 day | Thurgood (propose) + Peter (approve) |
| Validate migration | 0.5 day | Thurgood (audit) |
| **Total** | **~4.5 days** | |

This is slightly higher than Lina's original estimate because the audit found more components without schemas (8) than expected, and 2 components with zero contracts.
