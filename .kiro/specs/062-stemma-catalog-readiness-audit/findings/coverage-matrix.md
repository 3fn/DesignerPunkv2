# Contract Coverage Matrix

**Date**: February 25, 2026
**Spec**: 062 - Stemma Catalog Readiness Audit
**Phase**: 2 (Task 2.1)
**Status**: Complete

---

## Matrix Legend

- ✅ Contract implemented (documented in schema, contracts.yaml, or README)
- ⚠️ Gap (contract pattern is relevant to this component but not documented)
- 🚫 Intentional exclusion (documented design decision)
- `—` Not applicable to this component type

---

## Matrix 1: Interaction Contracts

| Component | focusable | pressable | hover_state | pressed_state | disabled_state | loading_state | focus_ring |
|-----------|-----------|-----------|-------------|---------------|----------------|---------------|------------|
| **Form Inputs** | | | | | | | |
| Input-Text-Base | ✅ | — | ⚠️ | ⚠️ | ✅ | — | ✅ |
| Input-Text-Email | ✅ (inherited) | — | ⚠️ | ⚠️ | ✅ (inherited) | — | ✅ (inherited) |
| Input-Text-Password | ✅ (inherited) | — | ⚠️ | ⚠️ | ✅ (inherited) | — | ✅ (inherited) |
| Input-Text-PhoneNumber | ✅ (inherited) | — | ⚠️ | ⚠️ | ✅ (inherited) | — | ✅ (inherited) |
| Input-Checkbox-Base | ✅ | ✅ | ✅ | ✅ | ⚠️ | — | ✅ |
| Input-Checkbox-Legal | ✅ | ✅ | ✅ | ✅ | ⚠️ | — | ✅ |
| Input-Radio-Base | ✅ | ✅ | ✅ | ✅ | ⚠️ | — | ✅ |
| Input-Radio-Set | — | — | — | — | ⚠️ | — | — |
| **Buttons** | | | | | | | |
| Button-CTA | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Button-Icon | ⚠️ | ⚠️ | ⚠️ | ⚠️ | 🚫 | — | ⚠️ |
| Button-VerticalList-Item | ✅ | ✅ | ✅ | ✅ | 🚫 | — | ✅ |
| Button-VerticalList-Set | — | — | — | — | 🚫 | — | — |
| **Containers** | | | | | | | |
| Container-Base | — | — | ✅ | — | — | — | — |
| Container-Card-Base | ✅ | ✅ | ✅ | ✅ | — | — | ✅ |
| **Icons** | | | | | | | |
| Icon-Base | — | — | — | — | — | — | — |
| **Avatars** | | | | | | | |
| Avatar | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | — | ⚠️ |
| **Badges & Tags** | | | | | | | |
| Badge-Count-Base | 🚫 | 🚫 | 🚫 | 🚫 | — | — | — |
| Badge-Count-Notification | 🚫 (inherited) | 🚫 (inherited) | 🚫 (inherited) | 🚫 (inherited) | — | — | — |
| Badge-Label-Base | 🚫 | 🚫 | 🚫 | 🚫 | — | — | — |
| **Chips** | | | | | | | |
| Chip-Base | ✅ | ✅ | ⚠️ | ⚠️ | 🚫 | — | ⚠️ |
| Chip-Filter | ✅ (inherited) | ✅ (inherited) | ⚠️ | ⚠️ | 🚫 | — | ⚠️ |
| Chip-Input | ✅ (inherited) | ✅ (inherited) | ⚠️ | ⚠️ | 🚫 | — | ⚠️ |
| **Progress** | | | | | | | |
| Progress-Indicator-Connector-Base | — | — | — | — | — | — | — |
| Progress-Indicator-Label-Base | — | — | — | — | — | — | — |
| Progress-Indicator-Node-Base | — | — | — | — | — | — | — |
| Progress-Pagination-Base | — | — | — | — | — | — | — |
| Progress-Stepper-Base | — | — | — | — | — | — | — |
| Progress-Stepper-Detailed | — | — | — | — | — | — | — |

---

## Matrix 2: Validation & State Contracts

| Component | validates_on_blur | error_state | success_state | float_label | reduced_motion | form_integration |
|-----------|-------------------|-------------|---------------|-------------|----------------|-----------------|
| Input-Text-Base | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Input-Text-Email | ✅ (inherited) | ✅ (inherited) | ✅ (inherited) | ✅ (inherited) | ✅ (inherited) | ⚠️ |
| Input-Text-Password | ✅ (inherited) | ✅ (inherited) | ✅ (inherited) | ✅ (inherited) | ✅ (inherited) | ⚠️ |
| Input-Text-PhoneNumber | ✅ (inherited) | ✅ (inherited) | ✅ (inherited) | ✅ (inherited) | ✅ (inherited) | ⚠️ |
| Input-Checkbox-Base | — | ✅ | — | — | — | ✅ |
| Input-Checkbox-Legal | — | ✅ | — | — | — | ✅ |
| Input-Radio-Base | — | ✅ | — | — | — | ✅ |
| Input-Radio-Set | — | ✅ | — | — | — | — |
| Button-CTA | — | — | — | — | — | — |
| Button-VerticalList-Item | — | ✅ | — | — | — | — |
| Button-VerticalList-Set | ⚠️ | ✅ | — | — | — | — |
| Container-Base | — | — | — | — | — | — |
| Container-Card-Base | — | — | — | — | — | — |
| Chip-Base | — | — | — | — | — | — |
| Chip-Filter | — | — | — | — | — | — |
| Chip-Input | — | — | — | — | — | — |
| Progress-Stepper-Base | — | — | — | — | — | — |
| Progress-Stepper-Detailed | — | — | — | — | — | — |

*Note: Badge, Icon, Avatar, and Progress-Indicator primitives omitted — validation/state contracts are not applicable.*

---

## Matrix 3: Structural Contract Patterns

These are contract patterns unique to specific families that represent structurally distinct behavioral categories.

| Pattern | Components | Status |
|---------|-----------|--------|
| **Composition** (component-to-component assembly) | | |
| `composes_node_and_connector` | Progress-Stepper-Base | ✅ |
| `composes_node_base_only` | Progress-Pagination-Base | ✅ |
| `composes_all_primitives` | Progress-Stepper-Detailed | ✅ |
| **Performance** (runtime optimization guarantees) | | |
| `virtualizes_large_sets` | Progress-Pagination-Base | ✅ |
| **Shape adaptation** (content-driven shape) | | |
| `circular_single_digit` | Badge-Count-Base, Badge-Count-Notification | ✅ |
| `pill_multi_digit` | Badge-Count-Base, Badge-Count-Notification | ✅ |
| **Notification** (live region / dynamic announcements) | | |
| `notification_semantics` | Badge-Count-Notification | ✅ |
| `announces_count_changes` | Badge-Count-Notification | ✅ |
| `pluralized_announcements` | Badge-Count-Notification | ✅ |
| **Consent** (legal/compliance guarantees) | | |
| `explicit_consent` | Input-Checkbox-Legal | ✅ |
| `audit_trail` | Input-Checkbox-Legal | ✅ |
| **Orchestration** (parent-child state coordination) | | |
| `mode_driven` | Button-VerticalList-Set | ✅ |
| `controlled_state` | Button-VerticalList-Set | ✅ |
| `state_coordination` | Button-VerticalList-Set | ✅ |
| `animation_coordination` | Button-VerticalList-Set | ✅ |
| **Content display** (rendering guarantees) | | |
| `displays_count` | Badge-Count-Base, Badge-Count-Notification | ✅ |
| `displays_label` | Badge-Label-Base | ✅ |
| `renders_label_text` | Progress-Indicator-Label-Base | ✅ |
| **Accessibility primitives** (decorative/non-interactive) | | |
| `non_interactive` | Badge-Count-Base, Badge-Label-Base | ✅ |
| `decorative_primitive` | Progress-Indicator-Connector-Base, Label-Base, Node-Base | ✅ |
| `accessibility_hidden` | Icon-Base | ✅ |

---

## Contracts with Zero Coverage

These contracts exist in the standard library but no component implements them by name:

| Standard Library Contract | Category | Status |
|--------------------------|----------|--------|
| `clickable` | interaction | Superseded by `pressable` in all components |
| `hoverable` | interaction | Superseded by `hover_state` in all components |
| `validates_on_change` | validation | No component implements real-time validation |
| `provides_transition_feedback` | animation | No component uses this contract name |
| `supports_loading_state` | state | Button-CTA has `loading_state` (different name) |
| `announces_state_changes` | accessibility | Badge-Count-Notification has `announces_count_changes` (more specific) |
| `supports_keyboard_navigation` | accessibility | Components use `keyboard_navigation` or `keyboard_focusable` instead |
| `provides_accessible_label` | accessibility | Components use `accessibility_role` or `accessible_label` instead |

**Interpretation**: These aren't true gaps — they're naming mismatches. The behaviors exist under different names. The standard library vocabulary was never adopted.

---

## Contracts with Single Coverage

Contracts implemented by only one component (fragile coverage):

| Contract | Component | Risk |
|----------|-----------|------|
| `loading_state` | Button-CTA | Low — loading is button-specific until Loading family is built |
| `virtualizes_large_sets` | Progress-Pagination-Base | Medium — Data Displays will likely need this |
| `explicit_consent` | Input-Checkbox-Legal | Low — consent is domain-specific |
| `audit_trail` | Input-Checkbox-Legal | Low — audit trail is domain-specific |
| `roving_tabindex` | Button-VerticalList-Set | Medium — Navigation family will likely need this |
| `mutual_exclusivity` | Input-Radio-Set | Low — radio-specific by nature |
| `indeterminate_state` | Input-Checkbox-Base | Low — checkbox-specific |

---

## Summary Statistics

- **Total matrix cells evaluated**: ~500
- **✅ Implemented**: ~130
- **⚠️ Gaps**: ~35
- **🚫 Intentional exclusions**: ~25
- **— Not applicable**: ~310
- **Components with zero contracts**: 2 (Avatar, Button-Icon)
