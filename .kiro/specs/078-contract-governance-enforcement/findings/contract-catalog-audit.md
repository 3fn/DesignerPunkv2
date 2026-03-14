# Contract Catalog Audit — Task 1.1 Findings

**Date**: 2026-03-13
**Agent**: Lina
**Spec**: 078 — Contract Governance & Enforcement

---

## Summary

| Metric | Count |
|--------|-------|
| Components scanned | 29 |
| Unique concept names | 115 |
| Catalog concepts (pre-audit) | 112 |
| Catalog-aligned | 111 |
| Non-catalog | 4 |
| Components with platforms/ but no contracts.yaml | 0 |
| Exclusions found | 0 |

---

## Non-Catalog Names (4)

### Classification

Using the heuristic from my R1 tasks feedback: if the concept describes a behavior no existing catalog concept covers, it's **(a) legitimate new concept**. If an existing concept covers it under a different name, it's **(b) naming mistake**.

#### 1. `accessibility_aria_controls` — Nav-SegmentedChoice-Base
- **Category**: accessibility
- **Description**: Optional panel association via id prop
- **Naming convention**: ✅ Follows `{category}_{concept}` pattern
- **Classification**: **(a) Legitimate new concept**
- **Rationale**: No existing accessibility concept covers ARIA controls/owns relationships. `aria_label`, `aria_pressed`, `aria_role` cover other ARIA attributes but not `aria-controls`. This is a genuinely distinct behavioral pattern.
- **Resolution**: Add `aria_controls` to accessibility category in Concept Catalog.

#### 2. `animation_initial_render` — Nav-SegmentedChoice-Base
- **Category**: animation
- **Description**: No animation on first render
- **Naming convention**: ✅ Follows `{category}_{concept}` pattern
- **Classification**: **(a) Legitimate new concept**
- **Rationale**: Existing animation concepts are `checkmark` (specific to checkbox) and `coordination` (multi-element sequencing). "Suppress animation on initial render" is a distinct behavioral pattern that will apply to any component with animated state indicators. Not covered by `coordination` — that's about sequencing, not suppression.
- **Resolution**: Add `initial_render` to animation category in Concept Catalog.

#### 3. `interaction_noop_active` — Nav-SegmentedChoice-Base
- **Category**: interaction
- **Description**: Activating the selected segment is a no-op
- **Naming convention**: ✅ Follows `{category}_{concept}` pattern
- **Classification**: **(a) Legitimate new concept**
- **Rationale**: No existing interaction concept covers "re-selecting the active item does nothing." `toggle_selection` is about toggling on/off. `pressed` is about press state. This is a distinct pattern: the component explicitly ignores activation of the already-active item. Relevant to tabs, segmented controls, and similar single-selection navigation.
- **Resolution**: Add `noop_active` to interaction category in Concept Catalog.

#### 4. `rendering_and_animation` — Progress-Pagination-Base
- **Category**: performance (declared in YAML)
- **Description**: Renders dots with viewport clipping and animated centering
- **Naming convention**: ⚠️ Does NOT follow `{category}_{concept}` pattern
- **Classification**: **(b) Naming mistake**
- **Rationale**: The key is `rendering_and_animation` but the declared category is `performance`. The name should start with `performance_`. Additionally, the concept name `rendering_and_animation` is vague — it conflates two concerns (rendering strategy and animation behavior). Looking at the actual behavior: it describes viewport clipping with animated centering. The closest existing concept is `performance_virtualization`, but this isn't virtualization — it renders all items and clips visually. This is a distinct concept, but needs renaming.
- **Proposed rename**: `visual_viewport_clipping` — describes the actual behavior (fixed viewport clips to visible subset, animates centering). Category changed from `performance` to `visual` because the contract describes what the user sees (clipped subset), not a performance optimization.
- **Resolution**: Rename key in `contracts.yaml` from `rendering_and_animation` to `visual_viewport_clipping`, change category from `performance` to `visual`. Add `viewport_clipping` to visual category in Concept Catalog.

---

## Per-Component Breakdown

All 29 components with `platforms/` directories have `contracts.yaml` files. No existence gaps.

| Component | Contracts | Status |
|-----------|-----------|--------|
| Avatar-Base | 9 | ✅ |
| Badge-Count-Base | 7 | ✅ |
| Badge-Count-Notification | 3 | ✅ |
| Badge-Label-Base | 6 | ✅ |
| Button-CTA | 7 | ✅ |
| Button-Icon | 11 | ✅ |
| Button-VerticalList-Item | 8 | ✅ |
| Button-VerticalList-Set | 9 | ✅ |
| Chip-Base | 11 | ✅ |
| Chip-Filter | 4 | ✅ |
| Chip-Input | 4 | ✅ |
| Container-Base | 7 | ✅ |
| Container-Card-Base | 8 | ✅ |
| Icon-Base | 5 | ✅ |
| Input-Checkbox-Base | 9 | ✅ |
| Input-Checkbox-Legal | 2 | ✅ |
| Input-Radio-Base | 8 | ✅ |
| Input-Radio-Set | 5 | ✅ |
| Input-Text-Base | 8 | ✅ |
| Input-Text-Email | 2 | ✅ |
| Input-Text-Password | 3 | ✅ |
| Input-Text-PhoneNumber | 3 | ✅ |
| Nav-SegmentedChoice-Base | 23 | ⚠️ 3 new concepts |
| Progress-Indicator-Connector-Base | 4 | ✅ |
| Progress-Indicator-Label-Base | 4 | ✅ |
| Progress-Indicator-Node-Base | 5 | ✅ |
| Progress-Pagination-Base | 4 | ⚠️ 1 naming mistake |
| Progress-Stepper-Base | 5 | ✅ |
| Progress-Stepper-Detailed | 6 | ✅ |

---

## Proposed Catalog Changes (Batch Ballot Measure)

### Additions (4 new concepts)

1. **accessibility** → `aria_controls` — ARIA controls/owns panel association
2. **animation** → `initial_render` — Suppress animation on first render
3. **interaction** → `noop_active` — Re-selecting active item is a no-op
4. **visual** → `viewport_clipping` — Fixed viewport clips to visible subset with animated centering

### Renames (1)

1. **Progress-Pagination-Base**: `rendering_and_animation` → `visual_viewport_clipping` (category: `performance` → `visual`)

### Updated Counts (post-audit)

| Category | Before | After | Delta |
|----------|--------|-------|-------|
| accessibility | 22 | 23 | +1 |
| animation | 2 | 3 | +1 |
| composition | 7 | 7 | — |
| content | 16 | 16 | — |
| interaction | 15 | 16 | +1 |
| layout | 3 | 3 | — |
| performance | 1 | 1 | — |
| state | 15 | 15 | — |
| validation | 9 | 9 | — |
| visual | 22 | 23 | +1 |
| **Total** | **112** | **116** | **+4** |

### Component Count Update

Header should update from "28 deployed contracts.yaml files" to "29 deployed contracts.yaml files" (Nav-SegmentedChoice-Base added since Spec 063).
