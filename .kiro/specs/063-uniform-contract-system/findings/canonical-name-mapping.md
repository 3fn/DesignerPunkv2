# Canonical Name Mapping

**Date**: February 25, 2026
**Spec**: 063 - Uniform Contract System
**Task**: 1.1 - Build complete 108→canonical name mapping
**Status**: Approved — human review complete (2026-02-25)

---

## Methodology

Sources for contract names:
1. **contracts.yaml files** (9 components) — Badge family, Progress family
2. **Schema-inline definitions** (14 components) — Button-CTA, Input-Text-*, Chip-*, Container-*, Icon-Base
3. **README behavioral contract tables** (6 components) — Button-VerticalList-*, Input-Checkbox-*, Input-Radio-*
4. **Standard contracts library** (Component-Schema-Format.md) — 16 abstract contracts

Naming convention: `{category}_{concept}` in snake_case. No `supports_`, `provides_`, or other directional prefixes.

Tiebreaker rule: When a contract could fit multiple categories, assign to the category that best reflects its purpose for the end user.

### Source Verification Notes

During mapping, the following discrepancies were found between the 062 taxonomy document and the actual source files:

1. **Progress-Indicator-Node-Base**: Taxonomy listed 4 contracts; actual file has 5 (missing `renders_content`). Taxonomy also misattributed categories — `renders_state_colors` and `applies_size_emphasis` are `visual` in the file (not `content`), and `respects_reduced_motion` is `accessibility` (not `visual`).
2. **Progress-Stepper-Base**: Taxonomy listed 4 contracts; actual file has 5 (missing `progressbar_accessibility`).
3. **Progress-Stepper-Detailed**: Taxonomy listed 5 contracts; actual file has 6 (missing `list_accessibility`).
4. **Input-Checkbox-Legal**: Taxonomy listed `audit_trail` as a contract; it appears in README prose/features but NOT in the behavioral contracts table. Included in mapping as a contract to be formalized from implementation analysis.

**Corrected total**: 113 distinct contract names (not 108). The 062 taxonomy undercounted by 5 due to the above.

---

## Mapping Table

### Legend

- **Current Name**: Contract name as it exists in source files today
- **Source**: Where the contract is defined (schema, contracts.yaml, README, standard-library)
- **Component(s)**: Which components use this contract
- **Canonical Name**: Proposed `{category}_{concept}` name
- **Category**: Taxonomy category assignment
- **Notes**: Edge cases, tiebreaker reasoning, or precedent

---

### 1. Interaction Contracts

| # | Current Name | Source | Component(s) | Canonical Name | Notes |
|---|-------------|--------|-------------|---------------|-------|
| 1 | `focusable` | schema, README | Button-CTA, Input-Text-Base (+children), Input-Checkbox-Base, Input-Checkbox-Legal, Input-Radio-Base, Button-VerticalList-Item | `interaction_focusable` | |
| 2 | `keyboard_focusable` | schema | Chip-Base | `interaction_focusable` | Merge with `focusable` — same concept |
| 3 | `pressable` | schema, README | Button-CTA, Input-Checkbox-Base, Input-Checkbox-Legal, Input-Radio-Base, Button-VerticalList-Item | `interaction_pressable` | |
| 4 | `press_interaction` | schema | Chip-Base | `interaction_pressable` | Merge with `pressable` — same concept |
| 5 | `hover_state` | schema, README | Button-CTA, Container-Base, Input-Checkbox-Base, Input-Checkbox-Legal, Input-Radio-Base, Button-VerticalList-Item | `interaction_hover` | |
| 6 | `pressed_state` | schema, README | Button-CTA, Input-Checkbox-Base, Input-Checkbox-Legal, Input-Radio-Base, Button-VerticalList-Item | `interaction_pressed` | |
| 7 | `focus_ring` | schema, README | Button-CTA, Input-Text-Base (+children), Input-Checkbox-Base, Input-Checkbox-Legal, Input-Radio-Base, Button-VerticalList-Item | `interaction_focus_ring` | |
| 8 | `keyboard_activation` | schema | Chip-Base | `interaction_keyboard_activation` | Distinct from focusable — Enter/Space triggers action |
| 9 | `keyboard_navigation` | README | Button-VerticalList-Set, Input-Radio-Set | `interaction_keyboard_navigation` | Arrow keys, Home, End within group |
| 10 | `roving_tabindex` | README | Button-VerticalList-Set | `interaction_roving_tabindex` | Single tab stop with arrow navigation (web pattern) |
| 11 | `non_interactive` | contracts.yaml | Badge-Count-Base, Badge-Label-Base | `accessibility_non_interactive` | Purpose is declaring decorative status for AT. Tiebreaker: end-user purpose is accessibility, not interaction. Per design-outline precedent. |
| 12 | `expanded_tap_area` | schema | Chip-Base | `interaction_expanded_tap_area` | Touch target sizing |
| 13 | `toggle_selection` | schema | Chip-Filter | `interaction_toggle_selection` | Press toggles selected state |
| 14 | `dismiss_on_press` | schema | Chip-Input | `interaction_dismiss` | Press dismisses/removes the chip |

### 2. State Contracts

| # | Current Name | Source | Component(s) | Canonical Name | Notes |
|---|-------------|--------|-------------|---------------|-------|
| 15 | `disabled_state` | schema | Button-CTA, Input-Text-Base (+children) | `state_disabled` | |
| 16 | `loading_state` | schema | Button-CTA | `state_loading` | |
| 17 | `checked_state` | README | Input-Checkbox-Base, Input-Checkbox-Legal | `state_checked` | |
| 18 | `indeterminate_state` | README | Input-Checkbox-Base | `state_indeterminate` | |
| 19 | `error_state` | README | Input-Checkbox-Base, Input-Radio-Base | `state_error` | Merge with `error_state_display` — same concept, different name |
| 20 | `error_state_display` | schema, README | Input-Text-Base (+children), Button-VerticalList-Item | `state_error` | Merge with `error_state` |
| 21 | `success_state_display` | schema | Input-Text-Base (+children) | `state_success` | |
| 22 | `selected_state` | README | Input-Radio-Base | `state_selected` | |
| 23 | `visual_state_driven` | README | Button-VerticalList-Item | `state_visual_driven` | Appearance determined by visualState prop |
| 24 | `state_styling` | schema | Chip-Base | `state_styling` | Visual treatment changes per state. Tiebreaker: purpose is state communication, not visual appearance. |
| 25 | `selected_styling` | schema | Chip-Filter | `state_selected_styling` | Visual treatment for selected state |
| 26 | `derives_binary_state` | contracts.yaml | Progress-Pagination-Base | `state_binary_derivation` | current vs incomplete |
| 27 | `derives_priority_state` | contracts.yaml | Progress-Stepper-Base, Progress-Stepper-Detailed | `state_priority_derivation` | error > completed > current > incomplete |
| 28 | `connector_state_derivation` | contracts.yaml | Progress-Stepper-Base, Progress-Stepper-Detailed | `state_connector_derivation` | Active between completed nodes |
| 29 | `controlled_state` | README | Button-VerticalList-Set | `state_controlled` | Selection managed by parent via props |
| 30 | `mode_driven` | README | Button-VerticalList-Set | `state_mode_driven` | Behavior determined by mode prop |

### 3. Validation Contracts

| # | Current Name | Source | Component(s) | Canonical Name | Notes |
|---|-------------|--------|-------------|---------------|-------|
| 31 | `validates_on_blur` | schema | Input-Text-Base (+children) | `validation_on_blur` | |
| 32 | `validates_email_format` | schema | Input-Text-Email | `validation_email_format` | |
| 33 | `validates_phone_format` | schema | Input-Text-PhoneNumber | `validation_phone_format` | |
| 34 | `form_integration` | README | Input-Checkbox-Base, Input-Checkbox-Legal, Input-Radio-Base | `validation_form_integration` | Purpose is input correctness in form context. Per design-outline precedent. |
| 35 | `validation` | README | Button-VerticalList-Set | `validation_selection_constraints` | Validates selection against constraints. Renamed for clarity — bare `validation` is too generic. |
| 36 | `group_validation` | README | Input-Radio-Set | `validation_group_required` | Required validation at group level |
| 37 | `size_restriction` | contracts.yaml | Progress-Stepper-Base, Progress-Stepper-Detailed | `validation_size_restriction` | Throws error if size='sm' |
| 38 | `explicit_consent` | README | Input-Checkbox-Legal | `validation_explicit_consent` | Prevents pre-checking. Purpose is input correctness (legal compliance). |
| 39 | `audit_trail` | README (prose) | Input-Checkbox-Legal | `validation_audit_trail` | ISO 8601 timestamp + metadata. In README features but not contracts table. Formalize from implementation. |

### 4. Accessibility Contracts

| # | Current Name | Source | Component(s) | Canonical Name | Notes |
|---|-------------|--------|-------------|---------------|-------|
| 40 | `accessibility_role` | schema | Chip-Base | `accessibility_role` | |
| 41 | `aria_pressed` | schema | Chip-Filter | `accessibility_aria_pressed` | |
| 42 | `x_icon_accessible_label` | schema | Chip-Input | `accessibility_dismiss_label` | Renamed for clarity — concept is the accessible label for the dismiss action |
| 43 | `accessibility_hidden` | schema | Icon-Base | `accessibility_hidden` | Decorative icon hidden from AT |
| 44 | `decorative_primitive` | contracts.yaml | Progress-Indicator-Connector-Base, Progress-Indicator-Label-Base, Progress-Indicator-Node-Base | `accessibility_decorative` | Primitive hidden from AT; semantic variants handle a11y |
| 45 | `color_contrast` | contracts.yaml | Badge-Count-Base, Badge-Label-Base | `accessibility_color_contrast` | WCAG AA 4.5:1 |
| 46 | `text_scaling` | contracts.yaml | Badge-Count-Base, Badge-Label-Base | `accessibility_text_scaling` | Respects user font size preferences |
| 47 | `reduced_motion_support` | schema | Input-Text-Base (+children) | `accessibility_reduced_motion` | |
| 48 | `respects_reduced_motion` | contracts.yaml | Progress-Indicator-Node-Base | `accessibility_reduced_motion` | Merge with `reduced_motion_support` — same concept |
| 49 | `reflects_actual_position` | contracts.yaml | Progress-Pagination-Base | `accessibility_actual_position` | ARIA label shows real position, not virtualized subset |
| 50 | `progressbar_accessibility` | contracts.yaml | Progress-Stepper-Base | `accessibility_progressbar_role` | role="progressbar" with aria-value* |
| 51 | `list_accessibility` | contracts.yaml | Progress-Stepper-Detailed | `accessibility_list_role` | role="list" with role="listitem" per step |
| 52 | `applies_aria_role` | schema | Container-Card-Base | `accessibility_aria_role` | Applies appropriate ARIA role |
| 53 | `error_announcement` | README | Input-Radio-Set | `accessibility_error_announcement` | Error message announced to screen readers |
| 54 | `radiogroup_role` | README | Input-Radio-Set | `accessibility_radiogroup_role` | Proper ARIA role for group |
| 55 | `aria_roles` | README | Button-VerticalList-Set | `accessibility_aria_roles` | Appropriate ARIA roles based on mode |
| 56 | `announces_count_changes` | contracts.yaml | Badge-Count-Notification | `accessibility_announces_changes` | Live region announcements on count change. Notification merged into accessibility per Decision 3. |
| 57 | `pluralized_announcements` | contracts.yaml | Badge-Count-Notification | `accessibility_pluralized_announcements` | Correct singular/plural in announcements |

### 5. Content Contracts

| # | Current Name | Source | Component(s) | Canonical Name | Notes |
|---|-------------|--------|-------------|---------------|-------|
| 58 | `displays_count` | contracts.yaml | Badge-Count-Base | `content_displays_count` | |
| 59 | `truncates_at_max` | contracts.yaml | Badge-Count-Base | `content_truncates_at_max` | |
| 60 | `displays_label` | contracts.yaml | Badge-Label-Base | `content_displays_label` | |
| 61 | `supports_icon` | contracts.yaml | Badge-Label-Base | `content_supports_icon` | Optionally displays leading icon |
| 62 | `supports_truncation` | contracts.yaml | Badge-Label-Base | `content_truncation` | Truncates with ellipsis; full text accessible. Dropped `supports_` prefix per convention. |
| 63 | `renders_label_text` | contracts.yaml | Progress-Indicator-Label-Base | `content_label_text` | |
| 64 | `renders_helper_text` | contracts.yaml | Progress-Indicator-Label-Base | `content_helper_text` | |
| 65 | `renders_content` | contracts.yaml | Progress-Indicator-Node-Base | `content_renders` | Renders dot/checkmark/icon based on size and content prop |
| 66 | `trailing_icon_display` | schema | Input-Text-Base (+children) | `content_trailing_icon` | Displays trailing icon (info, error, success) |
| 67 | `float_label_animation` | schema | Input-Text-Base (+children) | `content_float_label` | Label floats above input on focus. Tiebreaker: primary purpose is content display (label positioning), not animation. The animation is the mechanism, not the purpose. |
| 68 | `trailing_x_icon` | schema | Chip-Input | `content_trailing_dismiss_icon` | Trailing X icon for dismiss action |
| 69 | `dual_icons` | schema | Chip-Input | `content_dual_icons` | Leading + trailing icon support |

### 6. Visual Contracts

| # | Current Name | Source | Component(s) | Canonical Name | Notes |
|---|-------------|--------|-------------|---------------|-------|
| 70 | `circular_single_digit` | contracts.yaml | Badge-Count-Base | `visual_circular_shape` | Shape merged into visual per Decision 3 |
| 71 | `pill_multi_digit` | contracts.yaml | Badge-Count-Base | `visual_pill_shape` | Shape merged into visual per Decision 3 |
| 72 | `notification_semantics` | contracts.yaml | Badge-Count-Notification | `visual_notification_color` | Color communicates urgency. Per design-outline precedent (Lina Flag 2). |
| 73 | `renders_state_colors` | contracts.yaml | Progress-Indicator-Connector-Base, Progress-Indicator-Node-Base | `visual_state_colors` | |
| 74 | `applies_thickness` | contracts.yaml | Progress-Indicator-Connector-Base | `visual_thickness` | |
| 75 | `applies_typography_tokens` | contracts.yaml | Progress-Indicator-Label-Base | `visual_typography` | |
| 76 | `applies_size_emphasis` | contracts.yaml | Progress-Indicator-Node-Base | `visual_size_emphasis` | Current state renders at +4px |
| 77 | `renders_pill_container` | schema | Chip-Base | `visual_pill_container` | |
| 78 | `renders_icon` | schema | Chip-Base | `visual_renders_icon` | Icon rendering within chip |
| 79 | `checkmark_icon` | schema | Chip-Filter | `visual_checkmark_icon` | Checkmark icon for selected state |
| 80 | `renders_svg` | schema | Icon-Base | `visual_renders_svg` | SVG rendering |
| 81 | `color_inheritance` | schema | Icon-Base | `visual_color_inheritance` | Inherits color from parent context |
| 82 | `size_variants` | schema | Icon-Base | `visual_size_variants` | Multiple size options |
| 83 | `optical_balance` | schema | Icon-Base | `visual_optical_balance` | Optical size adjustment |
| 84 | `provides_visual_boundary` | schema | Container-Card-Base | `visual_boundary` | Visual boundary (border/shadow) |
| 85 | `provides_rounded_corners` | schema | Container-Card-Base | `visual_rounded_corners` | Border radius |
| 86 | `provides_hover_feedback` | schema | Container-Card-Base | `interaction_hover` | Same concept as `hover_state`. Merge. |
| 87 | `provides_press_feedback` | schema | Container-Card-Base | `interaction_pressed` | Same concept as `pressed_state`. Merge. |
| 88 | `provides_focus_indication` | schema | Container-Card-Base | `interaction_focus_ring` | Same concept as `focus_ring`. Merge. |
| 89 | `supports_keyboard_activation` | schema | Container-Card-Base | `interaction_pressable` | Same concept as `pressable`. Merge. |

### 7. Layout Contracts

| # | Current Name | Source | Component(s) | Canonical Name | Notes |
|---|-------------|--------|-------------|---------------|-------|
| 90 | `flexible_length` | contracts.yaml | Progress-Indicator-Connector-Base | `layout_flexible_length` | Fills available space between nodes |
| 91 | `contains_children` | schema | Container-Base | `layout_contains_children` | Renders child content |
| 92 | `applies_padding` | schema | Container-Base | `layout_padding` | Applies padding tokens |
| 93 | `provides_consistent_padding` | schema | Container-Card-Base | `layout_padding` | Same concept as `applies_padding`. Merge. |

### 8. Composition Contracts

| # | Current Name | Source | Component(s) | Canonical Name | Notes |
|---|-------------|--------|-------------|---------------|-------|
| 94 | `composes_node_and_connector` | contracts.yaml | Progress-Stepper-Base | `composition_node_and_connector` | |
| 95 | `composes_node_base_only` | contracts.yaml | Progress-Pagination-Base | `composition_node_only` | |
| 96 | `composes_all_primitives` | contracts.yaml | Progress-Stepper-Detailed | `composition_all_primitives` | |
| 97 | `icon_precedence` | contracts.yaml | Progress-Stepper-Detailed | `composition_icon_precedence` | Completed=checkmark, others=user icon. Tiebreaker: purpose is governing child component content rules, which is composition. |
| 98 | `state_coordination` | README | Button-VerticalList-Set | `composition_state_coordination` | Derives and propagates visual states to children |
| 99 | `error_propagation` | README | Button-VerticalList-Set | `composition_error_propagation` | Error state propagates to all children |
| 100 | `mutual_exclusivity` | README | Input-Radio-Set | `composition_mutual_exclusivity` | Only one radio selected at a time. Tiebreaker: purpose is governing child component selection rules. |

### 9. Animation Contracts

| # | Current Name | Source | Component(s) | Canonical Name | Notes |
|---|-------------|--------|-------------|---------------|-------|
| 101 | `checkmark_animation` | README | Button-VerticalList-Item | `animation_checkmark` | Animated selection indicator |
| 102 | `animation_coordination` | README | Button-VerticalList-Set | `animation_coordination` | Coordinates transition timing across children |

### 10. Performance Contracts

| # | Current Name | Source | Component(s) | Canonical Name | Notes |
|---|-------------|--------|-------------|---------------|-------|
| 103 | `virtualizes_large_sets` | contracts.yaml | Progress-Pagination-Base | `performance_virtualization` | Renders max 5 visible nodes via sliding window |

### 11. Container-Specific Visual/Layout Contracts

| # | Current Name | Source | Component(s) | Canonical Name | Notes |
|---|-------------|--------|-------------|---------------|-------|
| 104 | `applies_background` | schema | Container-Base | `visual_background` | Applies background color token |
| 105 | `applies_shadow` | schema | Container-Base | `visual_shadow` | Applies shadow token |
| 106 | `applies_border` | schema | Container-Base | `visual_border` | Applies border token |
| 107 | `applies_radius` | schema | Container-Base | `visual_radius` | Applies border radius token |

### 12. Input-Text Extended Contracts (Semantic Variants)

| # | Current Name | Source | Component(s) | Canonical Name | Notes |
|---|-------------|--------|-------------|---------------|-------|
| 108 | `provides_email_autocomplete` | schema | Input-Text-Email | `interaction_email_autocomplete` | Enables platform email autofill |
| 109 | `provides_secure_input` | schema | Input-Text-Password | `interaction_secure_input` | Masks input characters |
| 110 | `supports_password_toggle` | schema | Input-Text-Password | `interaction_password_toggle` | Show/hide password |
| 111 | `provides_password_autocomplete` | schema | Input-Text-Password | `interaction_password_autocomplete` | Enables platform password autofill |
| 112 | `provides_phone_formatting` | schema | Input-Text-PhoneNumber | `content_phone_formatting` | Formats phone number as user types |
| 113 | `supports_international_formats` | schema | Input-Text-PhoneNumber | `content_international_formats` | Supports international phone formats |

---

## Standard Library Contracts (Not Used by Any Component)

These 16 contracts exist in Component-Schema-Format.md but are referenced by 0 components. They are NOT included in the canonical mapping because they will be deprecated (Decision 8). Listed here for completeness.

| Standard Library Name | Superseded By | Notes |
|----------------------|--------------|-------|
| `focusable` | `interaction_focusable` | Same name, different format |
| `clickable` | `interaction_pressable` | `pressable` is more accurate cross-platform |
| `hoverable` | `interaction_hover` | |
| `pressable` | `interaction_pressed` | Standard library's `pressable` = components' `pressed_state` |
| `supports_disabled_state` | `state_disabled` | |
| `supports_error_states` | `state_error` | |
| `supports_loading_state` | `state_loading` | |
| `validatable` | `validation_on_blur` (and family) | Too generic |
| `validates_on_change` | (none) | No component implements real-time validation |
| `provides_transition_feedback` | (none) | No component uses this |
| `announces_state_changes` | `accessibility_announces_changes` | More specific names in use |
| `supports_keyboard_navigation` | `interaction_keyboard_navigation` | |
| `provides_accessible_label` | `accessibility_role` (and family) | |
| `supports_reduced_motion` | `accessibility_reduced_motion` | |
| `supports_high_contrast` | (none) | Implicit in color token usage |
| `supports_screen_reader` | (none) | Too generic — covered by specific a11y contracts |

---

## Merge Decisions

Contracts that map to the same canonical name (same concept, different names across sources):

| Canonical Name | Merged From | Rationale |
|---------------|------------|-----------|
| `interaction_focusable` | `focusable`, `keyboard_focusable` | Same behavior — keyboard focus capability |
| `interaction_pressable` | `pressable`, `press_interaction`, `supports_keyboard_activation` | Same behavior — responds to press/click/Enter/Space |
| `interaction_hover` | `hover_state`, `provides_hover_feedback` | Same behavior — visual feedback on hover |
| `interaction_pressed` | `pressed_state`, `provides_press_feedback` | Same behavior — visual feedback during press |
| `interaction_focus_ring` | `focus_ring`, `provides_focus_indication` | Same behavior — WCAG 2.4.7 focus indicator |
| `state_error` | `error_state`, `error_state_display` | Same behavior — error visual treatment |
| `accessibility_reduced_motion` | `reduced_motion_support`, `respects_reduced_motion` | Same behavior — prefers-reduced-motion compliance |
| `layout_padding` | `applies_padding`, `provides_consistent_padding` | Same behavior — padding token application |

---

## Edge Cases and Precedent Decisions

### Edge Case 1: `float_label_animation` → `content_float_label`

**Candidates**: `animation_float_label`, `content_float_label`
**Decision**: `content_float_label`
**Reasoning**: The primary purpose for the end user is label positioning — the label moves from placeholder position to above the input to show what the field is. The animation is the mechanism, not the purpose. If reduced motion is enabled, the label still floats — it just does so instantly. The content contract is about "where is the label," not "how does it move."

### Edge Case 2: `notification_semantics` → `visual_notification_color`

**Candidates**: `visual_notification_color`, `content_notification_color`, `state_notification`
**Decision**: `visual_notification_color`
**Reasoning**: Per Lina Flag 2 in the design outline. The purpose is visual communication of urgency to the end user through color. The notification type (info/warning/error) is communicated visually, not through content text or application state.

### Edge Case 3: `non_interactive` → `accessibility_non_interactive`

**Candidates**: `interaction_non_interactive`, `accessibility_non_interactive`
**Decision**: `accessibility_non_interactive`
**Reasoning**: Per design-outline precedent. The purpose is declaring the component as decorative for assistive technology. It's not describing an interaction pattern — it's declaring the absence of interaction for AT consumption.

### Edge Case 4: `form_integration` → `validation_form_integration`

**Candidates**: `validation_form_integration`, `composition_form_integration`
**Decision**: `validation_form_integration`
**Reasoning**: Per design-outline precedent. The purpose is input correctness in a form context — the component participates in form submission and reset, which is about validating and submitting user input.

### Edge Case 5: `icon_precedence` → `composition_icon_precedence`

**Candidates**: `composition_icon_precedence`, `content_icon_precedence`, `visual_icon_precedence`
**Decision**: `composition_icon_precedence`
**Reasoning**: The contract governs how a parent component (Stepper-Detailed) determines what content its child components (Node-Base) display. This is a composition rule — the parent dictates child rendering. The content and visual aspects are consequences of the composition decision.

### Edge Case 6: `mutual_exclusivity` → `composition_mutual_exclusivity`

**Candidates**: `composition_mutual_exclusivity`, `state_mutual_exclusivity`, `validation_mutual_exclusivity`
**Decision**: `composition_mutual_exclusivity`
**Reasoning**: The contract governs how a parent component (Radio-Set) manages selection across its children (Radio-Base items). This is a composition orchestration pattern — the parent enforces a constraint on child state. Similar to `composition_state_coordination` in Button-VerticalList-Set.

### Edge Case 7: `state_styling` → `state_styling`

**Candidates**: `state_styling`, `visual_state_styling`
**Decision**: `state_styling`
**Reasoning**: The contract is about how state changes manifest visually in Chip-Base. The primary purpose is communicating state to the user, which is a state concern. The visual treatment is the mechanism.
**Confirmed**: Human review (2026-02-25) — "state" is the code need.

### Edge Case 8: `audit_trail` → `validation_audit_trail`

**Candidates**: `validation_audit_trail`, `state_audit_trail`
**Decision**: `validation_audit_trail`
**Reasoning**: The audit trail records consent events for legal compliance. Its purpose is ensuring input correctness and compliance — the same domain as `validation_explicit_consent`. The timestamp/metadata recording is a validation artifact.
**Scoping note**: The contract is scoped to what the component controls: producing ISO 8601 timestamp, legalTextId, and version metadata on consent events. The consumer's responsibility to persist the audit data is out of scope — same pattern as `validation_form_integration` (component participates in form submission but doesn't guarantee server-side processing).
**Note**: This contract appears in README prose/features but NOT in the behavioral contracts table. It needs to be formalized from implementation analysis during Task 2.1.
**Confirmed**: Human review (2026-02-25) — formalize as contract, scoped to component output.

---

## Summary Statistics

- **Total distinct contract names in sources**: 113 (corrected from 108)
- **Canonical names after merging**: 103
- **Merges**: 8 (where multiple source names map to one canonical name)
- **Edge cases with documented reasoning**: 8
- **Contracts by category**:
  - interaction: 14
  - state: 16
  - validation: 9
  - accessibility: 18
  - content: 12
  - visual: 16
  - layout: 4
  - composition: 7
  - animation: 2
  - performance: 1

**Category distribution observation**: Accessibility (18) and state (16) are the largest categories. Animation (2) and performance (1) are the smallest. The animation category's small size is expected — most animation behaviors are mechanisms for other contracts (hover transitions are interaction, float label is content). Only standalone motion behaviors land here.
