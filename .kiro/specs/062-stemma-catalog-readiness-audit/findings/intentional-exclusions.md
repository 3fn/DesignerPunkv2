# Intentional Exclusions Inventory

**Date**: February 25, 2026
**Spec**: 062 - Stemma Catalog Readiness Audit
**Phase**: 2 (Task 2.1)
**Status**: Complete

---

## Intentional Exclusions (🚫)

Each exclusion below has documented evidence of a deliberate design decision.

### 1. Chip Family — No Disabled States

**Components**: Chip-Base, Chip-Filter, Chip-Input
**Excluded contracts**: `disabled_state`
**Evidence**: All three Chip schemas contain explicit documentation:
- Chip-Base: "If an action is unavailable, the component should not be rendered."
- Chip-Filter: "If filtering is unavailable, the component should not be rendered."
- Chip-Input: "If dismissal is unavailable, the component should not be rendered."
**Design rationale**: Chips represent actionable items. If the action isn't available, the chip shouldn't exist in the UI. This prevents users from seeing non-actionable elements.

### 2. Button-Icon — No Disabled Prop

**Component**: Button-Icon
**Excluded contracts**: `disabled_state`
**Evidence**: README states: "Button-Icon intentionally does not support a `disabled` prop."
**Design rationale**: Not documented beyond the statement of intent.

### 3. Button-VerticalList-Item — No Disabled Prop

**Component**: Button-VerticalList-Item
**Excluded contracts**: `disabled_state`
**Evidence**: README states: "Button-VerticalList-Item intentionally does not support a `disabled` prop."
**Design rationale**: Items are controlled by the parent Set component. Individual item disabling is not supported.

### 4. Button-VerticalList-Set — No Individual Item Disabling

**Component**: Button-VerticalList-Set
**Excluded contracts**: `disabled_state`
**Evidence**: README states: "The Set does not support disabling individual items."
**Design rationale**: The Set manages state holistically. If an option shouldn't be available, it shouldn't be in the Set.

### 5. Badge Family — Non-Interactive by Design

**Components**: Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base
**Excluded contracts**: `focusable`, `pressable`, `hover_state`, `pressed_state`
**Evidence**: contracts.yaml for all three Badge components includes `non_interactive` contract:
- "Not focusable via keyboard navigation (no tabindex)"
- "Does not respond to click, tap, or keyboard events"
- "No hover or press visual feedback"
- "pointer-events: none (web)"
**Design rationale**: Badges are visual indicators, not interactive elements. Making them interactive would create confusing UX — users would expect an action that doesn't exist.

---

## Exclusion Pattern Summary

| Pattern | Components | What's Excluded | Rationale Category |
|---------|-----------|----------------|-------------------|
| "Don't render if unavailable" | Chip-Base, Chip-Filter, Chip-Input | disabled_state | UX philosophy |
| "No disabled prop" | Button-Icon, Button-VerticalList-Item | disabled_state | Controlled by parent / not applicable |
| "No individual disabling" | Button-VerticalList-Set | disabled_state | Holistic state management |
| "Non-interactive by design" | Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base | focusable, pressable, hover, pressed | Component purpose (display-only) |

**Observation**: `disabled_state` is the most commonly excluded contract (6 components). This suggests the standard library's `supports_disabled_state` with `required: true` is too broad — disabled state is not universally applicable.
