# Issue: Repeated Interaction Contract Prose Across Components

**Date**: February 28, 2026
**Severity**: Low
**Status**: Open — Future Optimization
**Discovered During**: Post-064 contract audit
**Affects**: All components with interaction contracts (12+ components)
**Recommended Owner**: Thurgood (contract governance)

---

## Summary

Five interaction contracts appear across 8–12 components each with nearly identical behavior text:

| Contract | Occurrences |
|----------|-------------|
| `interaction_focusable` | 11 |
| `interaction_hover` | 11 |
| `interaction_pressable` | 11 |
| `interaction_pressed` | 9 |
| `interaction_focus_ring` | 8 |

The behavior prose is largely copy-pasted with minor component-name substitutions. This creates maintenance burden — a change to the standard focus ring pattern requires updating 8 files.

---

## Not Urgent

This is a DRY optimization, not a correctness issue. The current approach works and each component's contracts are self-contained. The cost is maintenance overhead as the component count grows.

---

## Possible Approaches

1. **Shared contract templates**: A `contracts/shared/` directory with canonical definitions. Components reference the template and override only what differs. Requires contract system extension.

2. **Contract inheritance from behaviors**: The `behaviors:` field in schema.yaml already lists shared behaviors (`renderable`, `focusable`, etc.). These could map to canonical contract definitions, with components inheriting them implicitly.

3. **Leave as-is**: Accept the duplication. 28 components is manageable. Revisit if the system grows past ~50 components.

---

## Recommended Action

Flag for future spec consideration. No immediate action needed. If a contract prose change is needed across all interactive components, the repetition will become painful and motivate the optimization naturally.
