# Contract Catalog: 5 New Concepts from Spec 090 (Progress-Bar-Base)

**Date**: 2026-04-03
**Severity**: Medium — blocks contract-catalog-name-validation test (1 failure)
**Agent**: Thurgood
**Found by**: Lina (Spec 090 Task 1.2)

## Problem

Progress-Bar-Base contracts introduce 5 concepts not in the catalog (currently 131 concepts). The `contract-catalog-name-validation.test.ts` fails with 5 invalid names.

## Concepts to Add

| Concept | Category | Current Count → New |
|---------|----------|---------------------|
| `milestone_announcements` | accessibility | 23 → 24 |
| `track_fill` | visual | 26 → 27 |
| `value_transition` | animation | 3 → 4 |
| `indeterminate_pulse` | animation | 3 → 5 |
| `value_range` | validation | 9 → 10 |

Total: 131 → 136

## Action

Ballot measure to add all 5 to Contract System Reference. Same process as the Spec 088 additions (5 concepts → 122, then 8 concepts → 131).

## Source

- `src/components/core/Progress-Bar-Base/contracts.yaml`
- `.kiro/specs/090-linear-progress-bar/completion/task-1-2-completion.md`
