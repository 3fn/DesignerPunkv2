# Issue: state_disabled Excluded on 8 Interactive Components

**Date**: February 28, 2026
**Severity**: Medium
**Status**: Open
**Discovered During**: Post-064 contract audit
**Affects**: Button-Icon, Button-VerticalList-Item, Button-VerticalList-Set, Chip-Base, Chip-Filter, Chip-Input, Input-Checkbox-Base, Input-Radio-Base, Input-Radio-Set
**Recommended Owner**: Lina (component domain), Thurgood (contract governance)

---

## Summary

9 interactive components explicitly exclude `state_disabled`. These are all components that receive user input (buttons, chips, checkboxes, radios). Disabled state is a standard interaction pattern for form controls and action elements — excluding it across this many interactive components warrants review.

---

## Affected Components

| Component | Has focusable? | Has pressable? | Excludes disabled? |
|-----------|---------------|----------------|-------------------|
| Button-Icon | ✅ | ✅ | ✅ excluded |
| Button-VerticalList-Item | ✅ | ✅ | ✅ excluded |
| Button-VerticalList-Set | ❌ | ❌ | ✅ excluded |
| Chip-Base | ✅ | ✅ | ✅ excluded |
| Chip-Filter | ❌ (inherits) | ❌ (inherits) | ✅ excluded |
| Chip-Input | ❌ (inherits) | ❌ (inherits) | ✅ excluded |
| Input-Checkbox-Base | ✅ | ✅ | ✅ excluded |
| Input-Radio-Base | ✅ | ✅ | ✅ excluded |
| Input-Radio-Set | ❌ | ❌ | ✅ excluded |

---

## Questions to Resolve

1. **Do the platform implementations actually support a `disabled` prop?** If yes, the exclusion is incorrect — there's a contract gap. If no, the exclusion is intentional but the design decision should be documented with rationale.

2. **Is disabled state deferred or permanently excluded?** If deferred, the exclusion reason should say so. If permanent, the rationale should explain why (e.g., "disabled inputs are an anti-pattern — use validation messaging instead").

3. **WCAG implications**: Form controls without disabled state may need alternative patterns for indicating unavailability. WCAG 4.1.2 (Name, Role, Value) expects standard states to be programmatically determinable.

---

## Recommended Action

Review each component's platform implementations for disabled prop support. Classify each as:
- **Gap**: Implementation supports disabled but contract is missing → add contract
- **Intentional**: Disabled is not supported by design → document rationale in exclusion reason
- **Deferred**: Disabled planned but not yet implemented → update exclusion reason to note deferral
