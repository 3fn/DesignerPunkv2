# Pre-Existing Test Failures

**Date Identified**: 2026-02-27
**Identified During**: Spec 065, Task 2 parent completion validation
**Status**: Open

---

## Stemma / Behavioral Contract Failures (6 tests, 5 suites) → Lina

| Suite | Test | Issue |
|-------|------|-------|
| `BadgeCountBase.stemma.test.ts` | should define required behavioral contracts in schema | Schema missing `displays_count` contract string |
| `BadgeCountNotification.stemma.test.ts` | should define notification-specific behavioral contracts in schema | Same pattern — schema out of sync with test expectations |
| `BadgeLabelBase.stemma.test.ts` | should define required behavioral contracts in schema | Same pattern |
| `form-inputs-contracts.test.ts` | Input-Text-Email/Password/PhoneNumber should have schema with inherited contracts (3 tests) | Semantic component schemas missing inherited contract definitions |
| `behavioral-contract-validation.test.ts` | all schemas should have required fields / at least one behavioral contract / validation criteria (3 tests) | Cross-cutting schema validation failures |

**Root Cause**: Stemma schemas were updated or created without matching test expectations, or tests were written against a planned schema format that wasn't fully implemented.

**Domain**: Lina (component behavioral contracts)

---

## Color Token Count Failure (1 test, 1 suite) → Ada

| Suite | Test | Issue |
|-------|------|-------|
| `ColorTokens.test.ts` | should have correct token count breakdown | Expected 4 structure tokens, found 7. Tokens added without updating test. |

**Root Cause**: Structure color tokens were added (7 now exist) but the test still expects 4 (`canvas`, `surface`, `border`, `border.subtle`).

**Domain**: Ada (token tests)
