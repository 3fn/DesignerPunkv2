# Domain Gap Summary

**Date**: February 25, 2026
**Spec**: 062 - Stemma Catalog Readiness Audit
**Phase**: 3 (Task 3.3)
**Status**: Complete

---

## Gaps for Lina (Stemma Component Specialist)

### Critical — Blocks Schema Work

| # | Gap | Components | Details |
|---|-----|-----------|---------|
| L1 | No contracts documented | Avatar, Button-Icon | These components have implementations and tests but zero behavioral contract definitions in any format. Schema cannot include them without contracts. |
| L2 | No schema YAML | Avatar, Button-Icon, Button-VerticalList-Item, Button-VerticalList-Set, Input-Checkbox-Base, Input-Checkbox-Legal, Input-Radio-Base, Input-Radio-Set | 8 components have no machine-parseable contract source. Schema generation requires structured input. |

### High — Affects Schema Quality

| # | Gap | Components | Details |
|---|-----|-----------|---------|
| L3 | Implicit inheritance in Chip family | Chip-Filter, Chip-Input | Declare `inherits: Chip-Base` but don't list inherited contracts. Schema must infer from parent. |
| L4 | Conceptual-only inheritance | Input-Checkbox-Legal | README says "extends Input-Checkbox-Base conceptually" but no formal declaration. Contract propagation is undocumented. |
| L5 | Avatar Stemma misalignment | Avatar | Named `Avatar` not `Avatar-Base`, family listed as placeholder in governance docs despite active implementation. Needs governance reconciliation. |

### Medium — Should Be Addressed

| # | Gap | Components | Details |
|---|-----|-----------|---------|
| L6 | No tests for 2 components | Progress-Indicator-Connector-Base, Progress-Indicator-Label-Base | Contracts documented in contracts.yaml but no test files exist. |
| L7 | Semantic variants test only extensions | Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber, Input-Checkbox-Legal | Only extended contracts tested; inherited contracts rely on base component tests. |
| L8 | Chip family missing hover/pressed/focus_ring contracts | Chip-Base, Chip-Filter, Chip-Input | These interactive components don't document hover_state, pressed_state, or focus_ring contracts despite being focusable and pressable. Likely implemented but undocumented. |

### Low — Improvement Opportunity

| # | Gap | Components | Details |
|---|-----|-----------|---------|
| L9 | Container-Card-Base uses composition, not inheritance | Container-Card-Base | Schema explicitly says "uses composition (not inheritance)" but the relationship to Container-Base isn't formalized in a way the schema can consume. |
| L10 | Inconsistent type classification | Badge-Count-Base, Badge-Label-Base, Container-Card-Base, Button-CTA | `type-primitive` and `standalone` types not in Stemma principles. Minor naming alignment. |

---

## Gaps for Ada (Rosetta Token Specialist)

### Medium — Should Be Addressed

| # | Gap | Components | Details |
|---|-----|-----------|---------|
| A1 | Token compliance not audited in this spec | All | This audit focused on behavioral contracts, not token compliance. A separate token compliance audit may be warranted to verify components use tokens correctly. |

### Low — Improvement Opportunity

| # | Gap | Components | Details |
|---|-----|-----------|---------|
| A2 | Contract-token relationship undocumented | All with contracts | Contracts reference tokens (e.g., `hover_state` references `blend.hoverDarker`) but the relationship isn't formalized. The schema may need to express which tokens a contract depends on. |

---

## Gaps for Thurgood (Test Governance — Self-Assessment)

### High — Affects Schema Quality

| # | Gap | Details |
|---|-----|---------|
| T1 | Source code pattern matching is dominant test approach | 92% of tested components use pattern matching. Behavioral correctness is largely unverified. The schema would expose contracts as capabilities, but those capabilities aren't behaviorally tested. |
| T2 | Badge family test_approach fields not implemented as behavioral tests | 16 test_approach fields describe behavioral test strategies, but actual tests use pattern matching. The most test-ready contracts in the catalog aren't tested the way their documentation says they should be. |

### Medium — Should Be Addressed

| # | Gap | Details |
|---|-----|---------|
| T3 | Standard contracts library disconnected from implementation | 16 contracts defined, 0 referenced by components. Needs to be updated to match reality or deprecated. Ballot measure proposal required. |
| T4 | "11 families" list is stale | Chip and Progress-Indicator are active families not in the canonical list. Governance docs need updating. Ballot measure proposal required. |

---

## Priority Recommendation

For the schema formalization path, address in this order:

1. **L1 + L2** (Critical): Get all 28 components to have machine-parseable contract definitions
2. **L3 + L4** (High): Make inheritance explicit in all hierarchies
3. **L5** (High): Reconcile Avatar with Stemma governance
4. **T3 + T4** (Medium): Update governance docs to match reality
5. **L6 + L7 + L8** (Medium): Fill test and documentation gaps
6. **Everything else** (Low): Address during normal development

Items 1-3 are prerequisites for schema formalization. Items 4-6 improve system quality but don't block schema work.
