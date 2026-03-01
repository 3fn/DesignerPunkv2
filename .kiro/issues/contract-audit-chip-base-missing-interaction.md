# Issue: Chip-Base Missing Interaction Contracts (hover, pressed, focus_ring)

**Date**: February 28, 2026
**Severity**: Medium
**Status**: Open
**Discovered During**: Post-064 contract audit
**Affects**: Chip-Base, Chip-Filter (inherits), Chip-Input (inherits)
**Recommended Owner**: Lina (component domain)

---

## Summary

Chip-Base has `interaction_focusable` and `interaction_pressable` but is missing `interaction_hover`, `interaction_pressed`, and `interaction_focus_ring`. As an interactive element that receives focus and responds to press, it should have:

- **hover**: Visual feedback on pointer hover (web)
- **pressed**: Visual feedback during press/tap
- **focus_ring**: Visible focus indicator for keyboard navigation (WCAG 2.4.7)

This gap propagates to Chip-Filter and Chip-Input via inheritance.

---

## Comparison

| Contract | Button-CTA | Button-Icon | Chip-Base | Input-Checkbox-Base |
|----------|-----------|-------------|-----------|-------------------|
| interaction_focusable | ✅ | ✅ | ✅ | ✅ |
| interaction_pressable | ✅ | ✅ | ✅ | ✅ |
| interaction_hover | ✅ | ✅ | ❌ | ✅ |
| interaction_pressed | ✅ | ✅ | ❌ | ✅ |
| interaction_focus_ring | ✅ | ✅ | ❌ | ✅ |

Every other focusable+pressable component has all five interaction contracts. Chip-Base is the outlier.

---

## Questions to Resolve

1. **Do the Chip platform implementations have hover/pressed/focus_ring behavior?** If yes, the contracts are missing and should be added. If no, the implementations have an accessibility gap (WCAG 2.4.7 Focus Visible).

2. **Is this an oversight or intentional?** No exclusion entry exists for these contracts, which suggests oversight rather than a deliberate design decision.

---

## Recommended Action

Check Chip-Base platform implementations for hover, pressed, and focus ring behavior. If present, add the three missing contracts. If absent, add the behavior (focus_ring is a WCAG requirement for focusable elements) and then add the contracts.
