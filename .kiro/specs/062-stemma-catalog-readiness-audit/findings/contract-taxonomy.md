# Contract Taxonomy

**Date**: February 25, 2026
**Spec**: 062 - Stemma Catalog Readiness Audit
**Phase**: 1 (Task 1.2)
**Status**: Complete

---

## Discovered Contract Categories

11 contract categories found in use across the catalog. The standard contracts library (Component-Schema-Format.md) defines 6 categories; 5 additional categories exist only in component-level definitions.

| # | Category | In Standard Library? | Components Using It |
|---|----------|---------------------|-------------------|
| 1 | interaction | ✅ | Button-CTA, Chip-Base, Badge-Count-Base, Badge-Label-Base, Badge-Count-Notification |
| 2 | validation | ✅ | Progress-Stepper-Base, Progress-Stepper-Detailed, Button-VerticalList-Set |
| 3 | animation | ✅ | (standard library only — no component uses this category name) |
| 4 | state | ✅ | Progress-Pagination-Base, Progress-Stepper-Base, Progress-Stepper-Detailed |
| 5 | accessibility | ✅ | All families with contracts.yaml; all README-documented components |
| 6 | composition | ✅ (defined, no contracts) | Progress-Pagination-Base, Progress-Stepper-Base, Progress-Stepper-Detailed |
| 7 | content | ❌ | Badge-Count-Base, Badge-Label-Base, Progress-Indicator-Label-Base, Progress-Indicator-Node-Base |
| 8 | shape | ❌ | Badge-Count-Base |
| 9 | performance | ❌ | Progress-Pagination-Base |
| 10 | visual | ❌ | Progress-Indicator-Connector-Base, Progress-Indicator-Label-Base, Progress-Indicator-Node-Base |
| 11 | layout | ❌ | Progress-Indicator-Connector-Base |
| 12 | notification | ❌ | Badge-Count-Notification |

**Note**: 12 categories total, not 11 as Lina's consultation estimated. The `notification` category was missed — it's used only by Badge-Count-Notification.

**Note**: The `animation` category exists in the standard library but no component uses that category name. Input-Text-Base has `float_label_animation` and `reduced_motion_support` contracts, but they're not categorized — they're in the schema-inline format which doesn't use categories.

---

## Complete Contract Inventory

### Contracts from Schema-Inline Definitions (20 components)

**Button-CTA** (7 contracts):
`focusable`, `pressable`, `hover_state`, `pressed_state`, `disabled_state`, `loading_state`, `focus_ring`

**Input-Text-Base** (9 contracts):
`focusable`, `float_label_animation`, `validates_on_blur`, `error_state_display`, `success_state_display`, `disabled_state`, `trailing_icon_display`, `focus_ring`, `reduced_motion_support`

**Input-Text-Email** (11 contracts — 9 inherited + 2 extended):
Inherited: all Input-Text-Base contracts
Extended: `validates_email_format`, `provides_email_autocomplete`

**Input-Text-Password** (12 contracts — 9 inherited + 3 extended):
Inherited: all Input-Text-Base contracts
Extended: `provides_secure_input`, `supports_password_toggle`, `provides_password_autocomplete`

**Input-Text-PhoneNumber** (12 contracts — 9 inherited + 3 extended):
Inherited: all Input-Text-Base contracts
Extended: `validates_phone_format`, `provides_phone_formatting`, `supports_international_formats`

**Chip-Base** (8 contracts):
`renders_pill_container`, `renders_icon`, `press_interaction`, `state_styling`, `keyboard_focusable`, `keyboard_activation`, `expanded_tap_area`, `accessibility_role`

**Chip-Filter** (4 contracts — extends Chip-Base):
`toggle_selection`, `selected_styling`, `checkmark_icon`, `aria_pressed`

**Chip-Input** (4 contracts — extends Chip-Base):
`dismiss_on_press`, `trailing_x_icon`, `dual_icons`, `x_icon_accessible_label`

**Container-Base** (7 contracts):
`contains_children`, `applies_padding`, `applies_background`, `applies_shadow`, `applies_border`, `applies_radius`, `hover_state`

**Container-Card-Base** (8 contracts):
`provides_visual_boundary`, `provides_consistent_padding`, `provides_rounded_corners`, `provides_hover_feedback`, `provides_press_feedback`, `provides_focus_indication`, `supports_keyboard_activation`, `applies_aria_role`

**Icon-Base** (5 contracts):
`renders_svg`, `color_inheritance`, `size_variants`, `optical_balance`, `accessibility_hidden`

### Contracts from contracts.yaml Files (9 components)

**Badge-Count-Base** (7 contracts):
`displays_count` (content), `truncates_at_max` (content), `circular_single_digit` (shape), `pill_multi_digit` (shape), `non_interactive` (interaction), `color_contrast` (accessibility), `text_scaling` (accessibility)

**Badge-Count-Notification** (3 own + inherited):
Own: `notification_semantics` (notification), `announces_count_changes` (notification), `pluralized_announcements` (notification)
Inherited: all Badge-Count-Base contracts

**Badge-Label-Base** (6 contracts):
`displays_label` (content), `supports_icon` (content), `supports_truncation` (content), `non_interactive` (interaction), `color_contrast` (accessibility), `text_scaling` (accessibility)

**Progress-Indicator-Connector-Base** (4 contracts):
`renders_state_colors` (visual), `applies_thickness` (visual), `flexible_length` (layout), `decorative_primitive` (accessibility)

**Progress-Indicator-Label-Base** (4 contracts):
`renders_label_text` (content), `renders_helper_text` (content), `applies_typography_tokens` (visual), `decorative_primitive` (accessibility)

**Progress-Indicator-Node-Base** (4 contracts):
`renders_state_colors` (content), `applies_size_emphasis` (content), `respects_reduced_motion` (visual), `decorative_primitive` (accessibility)

**Progress-Pagination-Base** (4 contracts):
`composes_node_base_only` (composition), `derives_binary_state` (state), `virtualizes_large_sets` (performance), `reflects_actual_position` (accessibility)

**Progress-Stepper-Base** (4 contracts):
`composes_node_and_connector` (composition), `derives_priority_state` (state), `connector_state_derivation` (state), `size_restriction` (validation)

**Progress-Stepper-Detailed** (5 contracts):
`composes_all_primitives` (composition), `derives_priority_state` (state), `icon_precedence` (state), `connector_state_derivation` (state), `size_restriction` (validation)

### Contracts from README-Only Components (6 components)

**Button-VerticalList-Item** (8 contracts):
`focusable`, `pressable`, `hover_state`, `pressed_state`, `visual_state_driven`, `checkmark_animation`, `error_state_display`, `focus_ring`

**Button-VerticalList-Set** (9 contracts):
`mode_driven`, `controlled_state`, `state_coordination`, `animation_coordination`, `keyboard_navigation`, `roving_tabindex`, `error_propagation`, `validation`, `aria_roles`

**Input-Checkbox-Base** (9 contracts):
`focusable`, `pressable`, `hover_state`, `pressed_state`, `checked_state`, `indeterminate_state`, `error_state`, `focus_ring`, `form_integration`

**Input-Checkbox-Legal** (10 contracts — extends Checkbox-Base):
`focusable`, `pressable`, `hover_state`, `pressed_state`, `checked_state`, `error_state`, `focus_ring`, `form_integration`, `explicit_consent`, `audit_trail`

**Input-Radio-Base** (8 contracts):
`focusable`, `pressable`, `hover_state`, `pressed_state`, `selected_state`, `error_state`, `focus_ring`, `form_integration`

**Input-Radio-Set** (5 contracts):
`mutual_exclusivity`, `keyboard_navigation`, `group_validation`, `error_announcement`, `radiogroup_role`

### Components with No Documented Contracts

**Avatar**: No behavioral contracts section in README. No schema. No contracts.yaml.
**Button-Icon**: No behavioral contracts section in README. No schema. No contracts.yaml.

---

## Naming Inconsistencies

| Concept | Standard Library Name | Schema-Inline Name(s) | contracts.yaml Name(s) | README Name(s) |
|---------|----------------------|----------------------|----------------------|----------------|
| Keyboard focus | `focusable` | `focusable`, `keyboard_focusable` | — | `focusable` |
| Click/tap response | `clickable` | `pressable`, `press_interaction` | — | `pressable` |
| Hover feedback | `hoverable` | `hover_state` | — | `hover_state` |
| Press feedback | `pressable` | `pressed_state` | — | `pressed_state` |
| Validation | `validatable` | `validates_on_blur` | — | `validation` |
| Disabled | `supports_disabled_state` | `disabled_state` | — | — |
| Error display | `supports_error_states` | `error_state_display` | — | `error_state`, `error_state_display` |
| Loading | `supports_loading_state` | `loading_state` | — | — |
| Focus ring | — | `focus_ring` | — | `focus_ring` |
| Reduced motion | — | `reduced_motion_support` | `respects_reduced_motion` | — |
| Non-interactive | — | — | `non_interactive` | — |

**Key observation**: The standard library uses a different naming convention (`supports_X`, `provides_X`) than the component-level definitions (which use shorter, more direct names). The standard library's `clickable` vs. components' `pressable` is a semantic distinction — `pressable` is the more accurate term for cross-platform (touch devices don't "click").

---

## Unique Contract Patterns by Family

Contracts that represent structurally distinct behavioral patterns not found in other families:

| Pattern | Family | Contracts | Why It's Structurally Distinct |
|---------|--------|-----------|-------------------------------|
| Composition | Progress | `composes_node_and_connector`, `composes_node_base_only`, `composes_all_primitives` | Component-to-component assembly — no other family has this |
| Performance | Progress | `virtualizes_large_sets` | Runtime optimization guarantee — fundamentally different from visual/interaction contracts |
| Shape adaptation | Badge | `circular_single_digit`, `pill_multi_digit` | Shape changes based on content — no other family has content-driven shape |
| Notification | Badge | `notification_semantics`, `announces_count_changes`, `pluralized_announcements` | Live region / dynamic announcement behavior |
| Consent | Checkbox | `explicit_consent`, `audit_trail` | Legal/compliance behavioral guarantees |
| Orchestration | VerticalList-Set | `mode_driven`, `controlled_state`, `state_coordination`, `animation_coordination` | Parent-child state orchestration pattern |
| Form integration | Checkbox, Radio | `form_integration` | Native form participation — not present in any other family |

---

## Summary Statistics

- **Total distinct contract names**: 108
- **Contracts in standard library**: 16
- **Contracts in component schemas**: 61
- **Contracts in contracts.yaml**: 38
- **Contracts in READMEs only**: 25
- **Overlap (same name, multiple sources)**: ~16 (shared names like `focusable`, `pressable`, etc.)
- **Contract categories in use**: 12
- **Contract categories in standard library**: 6
- **Components with zero documented contracts**: 2 (Avatar, Button-Icon)
