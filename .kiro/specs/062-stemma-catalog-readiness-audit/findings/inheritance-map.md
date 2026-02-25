# Inheritance Map

**Date**: February 25, 2026
**Spec**: 062 - Stemma Catalog Readiness Audit
**Phase**: 2 (Task 2.2)
**Status**: Complete

---

## Inheritance Relationships

### Formally Declared (schema `inherits:` field)

6 components have explicit `inherits:` declarations in their schema YAML:

```
Input-Text-Base (primitive, 9 contracts)
├── Input-Text-Email (semantic, inherits 9 + extends 2)
├── Input-Text-Password (semantic, inherits 9 + extends 3)
└── Input-Text-PhoneNumber (semantic, inherits 9 + extends 3)

Chip-Base (primitive, 8 contracts)
├── Chip-Filter (semantic, inherits all + extends 4)
└── Chip-Input (semantic, inherits all + extends 4)

Badge-Count-Base (type-primitive, 7 contracts)
└── Badge-Count-Notification (semantic, inherits all + extends 3)
```

### Documented but Not Formally Declared

These components describe inheritance in READMEs but have no schema `inherits:` field (because they have no schema at all):

```
Input-Checkbox-Base (primitive, 9 contracts — README-only)
└── Input-Checkbox-Legal (semantic, extends with 2 — README-only)
    README: "extends Input-Checkbox-Base conceptually"

Input-Radio-Base (primitive, 8 contracts — README-only)
└── Input-Radio-Set (orchestrator, 5 own contracts — README-only)
    README: orchestrates Input-Radio-Base children
```

### Composition (Not Inheritance)

These components use other components but don't inherit contracts — they compose:

```
Container-Card-Base → uses Container-Base (composition, not inheritance)
    Schema: "uses composition (not inheritance)"

Progress-Stepper-Base → composes Node-Base + Connector-Base
Progress-Stepper-Detailed → composes Node-Base + Connector-Base + Label-Base
Progress-Pagination-Base → composes Node-Base only
```

### No Inheritance Relationship

These components are standalone — no parent, no children:

- Button-CTA (standalone)
- Button-Icon (standalone, undocumented)
- Button-VerticalList-Item (primitive, but Set orchestrates it — not inheritance)
- Button-VerticalList-Set (orchestrator)
- Container-Base (primitive, no semantic variants yet)
- Icon-Base (primitive, no semantic variants yet)
- Avatar (standalone, undocumented)
- Badge-Label-Base (type-primitive, no semantic variants yet)
- All Progress-Indicator primitives (composed by steppers/pagination, not inherited)

---

## Contract Propagation Analysis

### Input-Text Family — Explicit Inheritance, Fully Documented

| Contract | Base | Email | Password | PhoneNumber |
|----------|------|-------|----------|-------------|
| focusable | ✅ defined | ✅ inherited | ✅ inherited | ✅ inherited |
| float_label_animation | ✅ defined | ✅ inherited | ✅ inherited | ✅ inherited |
| validates_on_blur | ✅ defined | ✅ inherited | ✅ inherited | ✅ inherited |
| error_state_display | ✅ defined | ✅ inherited | ✅ inherited | ✅ inherited |
| success_state_display | ✅ defined | ✅ inherited | ✅ inherited | ✅ inherited |
| disabled_state | ✅ defined | ✅ inherited | ✅ inherited | ✅ inherited |
| trailing_icon_display | ✅ defined | ✅ inherited | ✅ inherited | ✅ inherited |
| focus_ring | ✅ defined | ✅ inherited | ✅ inherited | ✅ inherited |
| reduced_motion_support | ✅ defined | ✅ inherited | ✅ inherited | ✅ inherited |
| validates_email_format | — | ✅ extended | — | — |
| provides_email_autocomplete | — | ✅ extended | — | — |
| provides_secure_input | — | — | ✅ extended | — |
| supports_password_toggle | — | — | ✅ extended | — |
| provides_password_autocomplete | — | — | ✅ extended | — |
| validates_phone_format | — | — | — | ✅ extended |
| provides_phone_formatting | — | — | — | ✅ extended |
| supports_international_formats | — | — | — | ✅ extended |

**Assessment**: Best-documented inheritance in the catalog. Each semantic variant explicitly lists inherited contracts with `# Inherited from Input-Text-Base` comments, plus its own extensions.

### Chip Family — Declared Inheritance, Implicit Contract List

| Contract | Base | Filter | Input |
|----------|------|--------|-------|
| renders_pill_container | ✅ defined | (inherited) | (inherited) |
| renders_icon | ✅ defined | (inherited) | (inherited) |
| press_interaction | ✅ defined | (inherited) | (inherited) |
| state_styling | ✅ defined | (inherited) | (inherited) |
| keyboard_focusable | ✅ defined | (inherited) | (inherited) |
| keyboard_activation | ✅ defined | (inherited) | (inherited) |
| expanded_tap_area | ✅ defined | (inherited) | (inherited) |
| accessibility_role | ✅ defined | (inherited) | (inherited) |
| toggle_selection | — | ✅ extended | — |
| selected_styling | — | ✅ extended | — |
| checkmark_icon | — | ✅ extended | — |
| aria_pressed | — | ✅ extended | — |
| dismiss_on_press | — | — | ✅ extended |
| trailing_x_icon | — | — | ✅ extended |
| dual_icons | — | — | ✅ extended |
| x_icon_accessible_label | — | — | ✅ extended |

**Assessment**: Chip-Filter and Chip-Input declare `inherits: Chip-Base` but their schemas only list their *own* extended contracts — they don't explicitly list the 8 inherited contracts. The inheritance is declared but the inherited contract list is implicit. This is the gap flagged in Requirement 4.3.

### Badge-Count Family — Declared Inheritance, Partially Explicit

Badge-Count-Notification's contracts.yaml has an `inherited_contracts` section that lists what it inherits from Badge-Count-Base, plus its own `extended_contracts`. This is the most explicit inheritance documentation in the catalog.

### Checkbox Family — Conceptual Inheritance, No Formal Declaration

Input-Checkbox-Legal "extends Input-Checkbox-Base conceptually" per its README. Both components list their contracts independently in README tables. There's no formal `inherits:` declaration because neither has a schema. The contract overlap is visible (both share `focusable`, `pressable`, `hover_state`, `pressed_state`, `checked_state`, `focus_ring`, `form_integration`) but it's not formally connected.

**Assessment**: This is the weakest inheritance documentation. If Checkbox-Base's contracts change, there's no mechanism to propagate that to Checkbox-Legal.

---

## Findings

### Finding 1: Three Levels of Inheritance Documentation Quality

1. **Explicit** (Input-Text family): `inherits:` declared, inherited contracts listed with comments, extensions clearly separated
2. **Declared but implicit** (Chip, Badge-Count families): `inherits:` declared, but inherited contracts not listed in the child — you have to look at the parent to know what's inherited
3. **Conceptual** (Checkbox family): README says "extends" but no formal declaration, no contract propagation mechanism

### Finding 2: Composition Is Not Inheritance but Needs Schema Representation

Progress-Stepper-Base composes Node-Base and Connector-Base. Container-Card-Base composes Container-Base. Button-VerticalList-Set orchestrates Button-VerticalList-Item. These are not inheritance relationships, but the schema needs to represent them — an agent composing UI needs to know that a Stepper requires Nodes and Connectors.

### Finding 3: No Override or Restriction Patterns Found

No component overrides or restricts a parent contract. All inheritance is additive (inherit all + extend with new). This simplifies the schema design — inheritance means "everything the parent has, plus more."
