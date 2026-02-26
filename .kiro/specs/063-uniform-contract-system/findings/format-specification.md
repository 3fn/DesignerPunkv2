# Canonical Format Specification

**Date**: February 25, 2026
**Spec**: 063 - Uniform Contract System
**Task**: 1.2 - Finalize canonical format specification
**Status**: Approved — human review complete (2026-02-25)

---

## Purpose

This document is the authoritative reference for the contracts.yaml canonical format. Every component in `src/components/core/` will have a contracts.yaml file conforming to this specification after migration. AI agents, migration scripts, and validation tools should use this document as the format definition.

---

## File Location

```
src/components/core/[Component-Name]/contracts.yaml
```

One file per component. No exceptions. This is the sole source of truth for behavioral contracts.

---

## Complete Format Reference

### Header Fields

Every contracts.yaml file begins with three required header fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | string | Yes | Format version. Use `"1.0.0"` for all files created during this migration. Enables future format evolution tracking. |
| `component` | string | Yes | Component name matching the directory name (e.g., `Badge-Count-Base`). Gives agents context without relying on file path. |
| `family` | string | Yes | Stemma family name (e.g., `Badge`, `Progress-Indicator`, `Buttons`). Enables family-level queries. |

```yaml
version: "1.0.0"
component: Badge-Count-Base
family: Badge
```

### Inheritance Declaration (Optional)

Child components that inherit from a parent declare the relationship immediately after header fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `inherits` | string | No | Parent component name. Only present on child components. Declares that this component inherits all contracts from the named parent. |

```yaml
version: "1.0.0"
component: Input-Text-Email
family: Input-Text
inherits: Input-Text-Base
```

When `inherits` is present:
- The child's `contracts:` block contains ONLY contracts unique to the child (extended contracts)
- Parent contracts are resolved at read time by the metadata schema layer (spec 064)
- The child file does NOT list inherited contracts — no `inherited_contracts:` block
- Full contract set = parent contracts + child contracts

### Contract Fields

All contracts live under the `contracts:` key. Each contract is keyed by its canonical name (`{category}_{concept}` in snake_case).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `category` | string | Yes | One of the 10 taxonomy categories. Must match the category prefix in the contract name. Enforced redundancy for validation — a mismatch signals an error. |
| `description` | string | Yes | One-line summary of what the contract guarantees. |
| `behavior` | string (multiline) | Yes | Detailed behavior description. Use YAML `\|` block scalar. Describe what happens, under what conditions, on which platforms. Include token references where relevant. |
| `wcag` | string or null | Yes | WCAG 2.1 success criterion reference (e.g., `"2.1.1 Keyboard"`). Use `null` when no WCAG criterion applies. |
| `platforms` | list | Yes | Platforms where this contract applies: `[web, ios, android]` or a subset. |
| `validation` | list | Yes | Observable criteria for verifying the contract. Each item is a testable assertion. |
| `test_approach` | string (multiline) | Yes | How to test this contract. Concrete steps, not abstract guidance. Use YAML `\|` block scalar. |
| `required` | boolean | Yes | Whether this contract is mandatory for the component. `true` = the component must satisfy this contract. `false` = the contract is optional or conditional. |

```yaml
contracts:
  interaction_focusable:
    category: interaction
    description: Component receives keyboard focus
    behavior: |
      Component can receive focus via Tab key navigation.
      Focus state is visually indicated with a focus ring.
      Focus is managed appropriately when disabled state changes.
    wcag: "2.1.1 Keyboard"
    platforms: [web, ios, android]
    validation:
      - Tab key moves focus to component
      - Focus state is visually distinct with focus ring
      - Disabled components are not focusable
    test_approach: |
      - Render component in default state
      - Press Tab and verify component receives focus
      - Verify focus ring is visible
      - Set disabled=true and verify component is skipped in tab order
    required: true
```

### Exclusion Fields

Intentional exclusions live under the `excludes:` key. Each exclusion is keyed by the canonical contract name that is intentionally not supported.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | string | Yes | Design rationale for the exclusion. Why this component intentionally does not support this contract. |
| `category` | string | Yes | Taxonomy category of the excluded contract. Provides context without requiring name parsing. |
| `reference` | string | Yes | Pointer to where the exclusion decision was documented (e.g., schema YAML section, README, design doc). |

```yaml
excludes:
  state_disabled:
    reason: "If an action is unavailable, the component should not be rendered."
    category: state
    reference: "Input-Checkbox-Base README, DesignerPunk Philosophy section"
```

Three-state interpretation:
- Present in `contracts:` → component guarantees this behavior ✅
- Present in `excludes:` → component intentionally does not support this, by design 🚫
- Absent from both → not applicable or not yet addressed

### Summary Block (Optional)

A summary block may be included for human readability. It is not authoritative — the `contracts:` and `excludes:` blocks are the source of truth.

```yaml
summary:
  total_contracts: 7
  categories:
    content: 2
    visual: 2
    accessibility: 2
    interaction: 1
  platforms: [web, ios, android]
```

---

## Taxonomy Categories

Exactly 10 categories. Every contract's `category` field must be one of these values.

| Category | Definition |
|----------|------------|
| `layout` | Contracts governing how a component structures and arranges its content and data |
| `interaction` | Contracts governing how a component responds to user input across input methods |
| `state` | Contracts governing application-driven conditions that affect a component's availability or feedback |
| `validation` | Contracts governing a component's ability to evaluate input correctness and communicate results |
| `accessibility` | Contracts guaranteeing a component is perceivable, operable, and understandable by all users, including those using assistive technology — includes dynamic announcements and live region behaviors |
| `composition` | Contracts governing a component's relationship with its child components — what it contains, requires, or orchestrates |
| `content` | Contracts governing a component's required, conditional, or orchestrated display of data |
| `animation` | Contracts governing the motion and transitional behaviors of a component, including reduced-motion compliance |
| `visual` | Contracts governing a component's visual presentation — shape, color treatment, and appearance across states |
| `performance` | Contracts governing a component's rendering and loading behaviors |

### Classification Rules

1. **Tiebreaker**: When a contract could fit multiple categories, assign to the category that best reflects its purpose for the end user.
2. **Animation vs. interaction**: User input response → `interaction`. Motion behavior description → `animation`.
3. **Content vs. composition**: Data display → `content`. Component assembly → `composition`.
4. **Interaction note**: Contains both capability contracts (`interaction_focusable`) and feedback contracts (`interaction_hover`). Both serve the same end-user purpose: describing how the component responds to input.

---

## Naming Convention

All contract names follow `{category}_{concept}` in `snake_case`.

Rules:
- No `supports_`, `provides_`, or other directional prefixes
- Category prefix must match the `category:` field value
- Concept portion describes the specific behavior
- Use established precedent from the canonical name mapping (task 1.1) for consistency

Examples:
- `interaction_focusable` (not `focusable`, not `supports_focus`)
- `state_disabled` (not `disabled_state`, not `supports_disabled_state`)
- `accessibility_reduced_motion` (not `reduced_motion_support`)
- `visual_circular_shape` (not `circular_single_digit`)

---

## Fields NOT Included in contracts.yaml

The following are explicitly excluded from the canonical format:

| Excluded | Reason | Where It Lives Instead |
|----------|--------|----------------------|
| `tokens:` | Contract-token relationships are consumption details, not behavioral definitions. Coupling them creates sync problems. | Metadata schema (spec 064) |
| `composes:` | Composition is structural identity, not behavioral guarantee. | Schema YAML |
| `inherited_contracts:` | Listing inherited contracts in the child file creates duplication. | Resolved at read time via `inherits:` declaration |
| `behavioral_contracts:` array | Inline contract references in schema YAML are eliminated. | contracts.yaml is the sole source of truth |
| `announceChanges_opt_out_use_cases:` | Implementation guidance, not a behavioral contract. | README or schema YAML notes |

---

## Annotated Migration Examples

### Scenario A: Existing contracts.yaml (9 components)

Components: Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base, Progress-Indicator-Connector-Base, Progress-Indicator-Label-Base, Progress-Indicator-Node-Base, Progress-Pagination-Base, Progress-Stepper-Base, Progress-Stepper-Detailed

These components already have contracts.yaml files. Migration involves:
1. Add `required: true/false` to every contract
2. Rename contract keys to canonical `{category}_{concept}` names
3. Rename `category` values to match the 10-category taxonomy (e.g., `shape` → `visual`, `notification` → `accessibility`)
4. Remove `inherited_contracts:` block from child components (Badge-Count-Notification)
5. Add `excludes:` blocks where intentional exclusions were identified in the 062 audit
6. Remove `summary:` block or update to match new structure (optional — not authoritative)
7. Remove `behavioral_contracts:` array from corresponding schema YAML

**Before** (Badge-Count-Base, current format):
```yaml
version: "1.0.0"
component: Badge-Count-Base
family: Badge

contracts:
  displays_count:                    # ← missing category prefix
    category: content
    description: Shows numeric value
    behavior: |
      Badge-Count-Base renders the provided count value...
    wcag: "1.3.1 Info and Relationships"
    platforms: [web, ios, android]
    validation:
      - Count value is visible in the rendered badge
      - Typography matches size variant specification
    test_approach: |
      - Render badge with count prop
      - Verify text content matches count prop value
                                     # ← missing `required` field
  circular_single_digit:             # ← non-canonical name
    category: shape                  # ← deprecated category
    description: Renders circular for single-digit counts
    ...
```

**After** (Badge-Count-Base, canonical format):
```yaml
version: "1.0.0"
component: Badge-Count-Base
family: Badge

contracts:
  content_displays_count:            # ← canonical name
    category: content
    description: Shows numeric value
    behavior: |
      Badge-Count-Base renders the provided count value...
    wcag: "1.3.1 Info and Relationships"
    platforms: [web, ios, android]
    validation:
      - Count value is visible in the rendered badge
      - Typography matches size variant specification
    test_approach: |
      - Render badge with count prop
      - Verify text content matches count prop value
    required: true                   # ← added

  visual_circular_shape:             # ← canonical name
    category: visual                 # ← updated category
    description: Renders circular for single-digit counts
    ...
    required: true                   # ← added
```

**Before** (Badge-Count-Notification, current format with inherited_contracts):
```yaml
version: "1.0.0"
component: Badge-Count-Notification
family: Badge
inherits: Badge-Count-Base

inherited_contracts:                 # ← this entire block is removed
  displays_count:
    source: Badge-Count-Base
    description: Shows numeric value
    wcag: "1.3.1 Info and Relationships"
  truncates_at_max:
    source: Badge-Count-Base
    ...

contracts:
  notification_semantics:            # ← non-canonical name
    category: notification           # ← deprecated category
    ...
```

**After** (Badge-Count-Notification, canonical format):
```yaml
version: "1.0.0"
component: Badge-Count-Notification
family: Badge
inherits: Badge-Count-Base
                                     # ← no inherited_contracts block
contracts:
  visual_notification_color:         # ← canonical name
    category: visual                 # ← updated category
    description: Conveys notification/alert meaning through color
    behavior: |
      Badge-Count-Notification uses fixed notification colors...
    wcag: "1.3.1 Info and Relationships"
    platforms: [web, ios, android]
    validation:
      - Background color is pink400 (#CC2257)
      - Text color is white100 (#FFFFFF)
      - Colors are not configurable via props
    test_approach: |
      - Render badge and verify background color
      - Verify no props exist to change notification colors
    required: true

  accessibility_announces_changes:   # ← canonical name
    category: accessibility          # ← already correct
    ...
    required: true

  accessibility_pluralized_announcements:
    category: accessibility
    ...
    required: true
```

---

### Scenario B: Schema-inline contracts (14 components)

Components: Button-CTA, Input-Text-Base, Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber, Chip-Base, Chip-Filter, Chip-Input, Container-Base, Container-Card-Base, Icon-Base, and 3 others

These components have full contract definitions embedded in their schema YAML under a `contracts:` key. Migration involves extracting and restructuring — not just moving.

1. Extract contract definitions from schema YAML into a new contracts.yaml
2. Restructure to canonical format: add `category`, `required` fields; rename contract keys
3. Convert `validation` from multiline string to list format
4. Add `test_approach` field (may need to be written from scratch if not present in schema)
5. Remove the `contracts:` block from schema YAML
6. Add `excludes:` blocks where applicable

**Before** (Button-CTA, in Button-CTA.schema.yaml):
```yaml
# In Button-CTA.schema.yaml
contracts:
  focusable:                         # ← bare name, no category prefix
    description: Can receive keyboard focus
    behavior: |
      Component can receive focus via Tab key navigation...
    wcag: "2.1.1 Keyboard, 2.4.7 Focus Visible"
    platforms: [web, ios, android]
    validation: |                    # ← multiline string, not list
      - Tab key moves focus to button
      - Focus state is visually distinct with focus ring
                                     # ← missing category, required, test_approach
```

**After** (Button-CTA, new contracts.yaml):
```yaml
# New file: src/components/core/Button-CTA/contracts.yaml
version: "1.0.0"
component: Button-CTA
family: Buttons

contracts:
  interaction_focusable:             # ← canonical name
    category: interaction            # ← added
    description: Can receive keyboard focus
    behavior: |
      Component can receive focus via Tab key navigation.
      Focus state is visually indicated with a focus ring.
      Focus is managed appropriately when disabled state changes.
    wcag: "2.1.1 Keyboard"
    platforms: [web, ios, android]
    validation:                      # ← converted to list
      - Tab key moves focus to button
      - Focus state is visually distinct with focus ring
      - Focus ring meets 3:1 contrast ratio
      - Disabled buttons are not focusable
    test_approach: |                 # ← added
      - Render button in default state
      - Press Tab and verify button receives focus
      - Verify focus ring is visible
      - Set disabled=true and verify button is skipped
    required: true                   # ← added

  interaction_pressable:
    category: interaction
    description: Responds to press/click events
    ...
    required: true

  interaction_hover:
    category: interaction
    description: Visual feedback on hover (desktop only)
    ...
    required: true

  interaction_pressed:
    category: interaction
    description: Visual feedback when pressed
    ...
    required: true

  state_disabled:
    category: state
    description: Prevents interaction when disabled
    ...
    required: true

  state_loading:
    category: state
    description: Shows loading indicator during async operations
    ...
    required: true

  interaction_focus_ring:
    category: interaction
    description: WCAG 2.4.7 focus visible indicator
    ...
    required: true
```

**Schema YAML cleanup** — remove the `contracts:` block entirely from Button-CTA.schema.yaml. The `behaviors:` list (high-level behavior tags) may remain if desired, but it is not authoritative.

---

### Scenario C: README-only contracts (6 components)

Components: Button-VerticalList-Item, Button-VerticalList-Set, Input-Checkbox-Base, Input-Checkbox-Legal, Input-Radio-Base, Input-Radio-Set

These components have contracts documented only in README tables. Migration involves creating contracts.yaml from scratch using the README as source material.

1. Create new contracts.yaml with header fields
2. Formalize each README table row into a full contract entry with all required fields
3. Write `behavior`, `test_approach`, and `validation` fields (README tables have minimal detail)
4. Add `excludes:` blocks where applicable (e.g., Input-Checkbox-Base excludes `state_disabled`)

**Before** (Input-Checkbox-Base, in README.md):
```markdown
## Behavioral Contracts

| Contract | Description | WCAG |
|----------|-------------|------|
| `focusable` | Can receive keyboard focus | 2.1.1 |
| `pressable` | Responds to click/tap on entire label area | 2.1.1 |
| `hover_state` | Visual feedback on hover (web) | 1.4.13 |
| `pressed_state` | Visual feedback when pressed | 2.4.7 |
| `checked_state` | Shows checkmark icon when checked | 1.4.1 |
| `indeterminate_state` | Shows minus icon for partial selection | 1.4.1 |
| `error_state` | Shows error border and message | 3.3.1 |
| `focus_ring` | WCAG 2.4.7 focus visible indicator | 2.4.7 |
| `form_integration` | Native form submission and reset | 4.1.2 |
```

**After** (Input-Checkbox-Base, new contracts.yaml):
```yaml
# New file: src/components/core/Input-Checkbox-Base/contracts.yaml
version: "1.0.0"
component: Input-Checkbox-Base
family: Input-Checkbox

contracts:
  interaction_focusable:
    category: interaction
    description: Can receive keyboard focus
    behavior: |
      Component can receive focus via Tab key navigation.
      Focus applies to the checkbox control element.
      Entire label area is part of the interactive target.
    wcag: "2.1.1 Keyboard"
    platforms: [web, ios, android]
    validation:
      - Tab key moves focus to checkbox
      - Focus state is visually indicated
    test_approach: |
      - Render checkbox in default state
      - Press Tab and verify checkbox receives focus
      - Verify focus indicator is visible
    required: true

  interaction_pressable:
    category: interaction
    description: Responds to click/tap on entire label area
    behavior: |
      Clicking or tapping anywhere on the checkbox or its label
      toggles the checked state. Enter and Space keys also toggle
      when the checkbox has focus.
    wcag: "2.1.1 Keyboard"
    platforms: [web, ios, android]
    validation:
      - Click on label toggles checked state
      - Click on checkbox toggles checked state
      - Enter key toggles checked state
      - Space key toggles checked state
    test_approach: |
      - Render checkbox unchecked
      - Click label text and verify checkbox becomes checked
      - Press Space and verify checkbox toggles
    required: true

  state_checked:
    category: state
    description: Shows checkmark icon when checked
    behavior: |
      When checked, the checkbox displays a checkmark icon inside
      the checkbox control. Visual treatment changes to indicate
      the selected state.
    wcag: "1.4.1 Use of Color"
    platforms: [web, ios, android]
    validation:
      - Checkmark icon visible when checked
      - Visual treatment distinct from unchecked state
    test_approach: |
      - Render checkbox and toggle to checked
      - Verify checkmark icon is rendered
      - Verify visual distinction from unchecked
    required: true

  # ... remaining contracts follow same pattern ...

  validation_form_integration:
    category: validation
    description: Native form submission and reset
    behavior: |
      Checkbox participates in native form submission.
      Value is included in form data when checked.
      Form reset returns checkbox to initial state.
    wcag: "4.1.2 Name, Role, Value"
    platforms: [web, ios, android]
    validation:
      - Checked checkbox value included in form submission
      - Unchecked checkbox value excluded from form submission
      - Form reset restores initial checked state
    test_approach: |
      - Place checkbox in a form element
      - Check the checkbox and submit the form
      - Verify checkbox value is in form data
      - Reset form and verify checkbox returns to initial state
    required: true

excludes:
  state_disabled:
    reason: "If an action is unavailable, the component should not be rendered."
    category: state
    reference: "Input-Checkbox-Base README, DesignerPunk Philosophy section"
```

---

### Scenario D: Undocumented components (2 components)

Components: Avatar, Button-Icon

These components have implementations and tests but no contract definitions in any format. Migration involves analyzing the implementation to define contracts from scratch.

1. Analyze component source code and tests to identify behavioral guarantees
2. Create contracts.yaml with all required fields
3. Write all fields from implementation analysis — no existing documentation to reference
4. Flag any uncertain contracts with notes for Lina review

**After** (Avatar, new contracts.yaml — illustrative):
```yaml
# New file: src/components/core/Avatar/contracts.yaml
version: "1.0.0"
component: Avatar
family: Avatar

contracts:
  content_displays_image:
    category: content
    description: Renders user image within circular frame
    behavior: |
      Avatar renders a provided image URL within a circular
      container. Image is cropped to fill the circular frame
      using object-fit: cover (web) or equivalent native
      clipping.
    wcag: "1.1.1 Non-text Content"
    platforms: [web, ios, android]
    validation:
      - Image renders within circular frame
      - Image fills frame without distortion
      - Image source matches provided URL
    test_approach: |
      - Render Avatar with image URL
      - Verify image element is present
      - Verify circular clipping is applied
      - Verify image source matches prop
    required: true

  content_displays_fallback:
    category: content
    description: Shows initials or icon when image unavailable
    behavior: |
      When no image is provided or image fails to load,
      Avatar displays a fallback: user initials derived
      from the name prop, or a default user icon.
    wcag: "1.1.1 Non-text Content"
    platforms: [web, ios, android]
    validation:
      - Initials displayed when no image provided
      - Initials derived from name prop
      - Default icon shown when no name or image
      - Fallback renders on image load failure
    test_approach: |
      - Render Avatar without image prop
      - Verify initials are displayed
      - Render Avatar with failing image URL
      - Verify fallback appears after load failure
    required: true

  # ... additional contracts from implementation analysis ...

  accessibility_non_interactive:
    category: accessibility
    description: Avatar is decorative and non-interactive
    behavior: |
      Avatar is a display-only component. It does not receive
      focus, respond to clicks, or participate in keyboard
      navigation. Appropriate ARIA attributes mark it as
      decorative or provide alt text via the name prop.
    wcag: null
    platforms: [web, ios, android]
    validation:
      - Avatar cannot receive keyboard focus
      - No click/tap handlers present
      - ARIA role or alt text derived from name prop
    test_approach: |
      - Verify Avatar has no tabindex
      - Verify no interactive event handlers
      - Verify accessible name is set from name prop
    required: true
```

---

## Validation Rules

These rules can be used by migration validation (Task 3.4) and future automated tooling:

1. **Header completeness**: `version`, `component`, `family` must all be present
2. **Contract name format**: Every key under `contracts:` must match `{category}_{concept}` in snake_case
3. **Category consistency**: The category prefix in the contract name must match the `category:` field value
4. **Category validity**: The `category:` field must be one of the 10 taxonomy categories
5. **Field completeness**: Every contract must have all 8 required fields (`category`, `description`, `behavior`, `wcag`, `platforms`, `validation`, `test_approach`, `required`)
6. **Exclusion completeness**: Every exclusion must have all 3 required fields (`reason`, `category`, `reference`)
7. **Inheritance validity**: If `inherits:` is present, the named parent component must exist and have its own contracts.yaml
8. **No duplication**: Child components with `inherits:` must not redefine contracts that exist in the parent
9. **Platform values**: `platforms` list may only contain `web`, `ios`, `android`
10. **WCAG format**: `wcag` field must be either `null` or a string matching a WCAG 2.1 success criterion reference

---

## Related Documentation

- `.kiro/specs/063-uniform-contract-system/findings/canonical-name-mapping.md` — Complete 113→103 canonical name mapping
- `.kiro/specs/063-uniform-contract-system/design-outline.md` — Design decisions and rationale
- `.kiro/specs/063-uniform-contract-system/design.md` — Formal design document
- `.kiro/specs/063-uniform-contract-system/requirements.md` — Requirements (1.1, 1.2, 1.3, 4.1, 4.2, 5.1, 5.2)
