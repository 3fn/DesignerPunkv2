# Test Coverage Overlay

**Date**: February 25, 2026
**Spec**: 062 - Stemma Catalog Readiness Audit
**Phase**: 2 (Task 2.3)
**Status**: Complete

---

## Test Coverage by Component

| Component | Test Files | Stemma Tests | Test Approach | contracts.yaml test_approach |
|-----------|-----------|-------------|---------------|------------------------------|
| **Form Inputs** | | | | |
| Input-Text-Base | 6 | — | DOM/render + source pattern | — |
| Input-Text-Email | 1 | — | Unit (validation only) | — |
| Input-Text-Password | 1 | — | Unit (validation only) | — |
| Input-Text-PhoneNumber | 1 | — | Source pattern (validation) | — |
| Input-Checkbox-Base | 2 | ✅ stemma.test.ts | DOM/render + source pattern + behavioral | — |
| Input-Checkbox-Legal | 1 | — | DOM/render + source pattern | — |
| Input-Radio-Base | 3 | ✅ stemma.test.ts | DOM/render + source pattern + behavioral | — |
| Input-Radio-Set | 2 | ✅ stemma.test.ts | DOM/render + source pattern + behavioral | — |
| **Buttons** | | | | |
| Button-CTA | 4 | — | DOM/render + source pattern + behavioral | — |
| Button-Icon | 6 | ✅ stemma.test.ts | DOM/render + source pattern + behavioral | — |
| Button-VerticalList-Item | 7 | — | DOM/render + source pattern | — |
| Button-VerticalList-Set | 8 | — | DOM/render + source pattern + behavioral | — |
| **Containers** | | | | |
| Container-Base | 1 | — | DOM/render + source pattern | — |
| Container-Card-Base | 1 | — | DOM/render | — |
| **Icons** | | | | |
| Icon-Base | 1 | — | DOM/render + source pattern | — |
| **Avatars** | | | | |
| Avatar | 6 | — | DOM/render + source pattern + behavioral | — |
| **Badges & Tags** | | | | |
| Badge-Count-Base | 2 | ✅ stemma.test.ts | Source pattern + DOM/render | 7 fields |
| Badge-Count-Notification | 2 | ✅ stemma.test.ts | Source pattern + DOM/render | 3 fields |
| Badge-Label-Base | 3 | ✅ stemma.test.ts | Source pattern + DOM/render | 6 fields |
| **Chips** | | | | |
| Chip-Base | 1 | — | DOM/render + source pattern | — |
| Chip-Filter | 1 | — | DOM/render + source pattern | — |
| Chip-Input | 1 | — | DOM/render + source pattern | — |
| **Progress** | | | | |
| Progress-Indicator-Connector-Base | 0 | — | **No tests** | — |
| Progress-Indicator-Label-Base | 0 | — | **No tests** | — |
| Progress-Indicator-Node-Base | 1 | — | DOM/render + source pattern | — |
| Progress-Pagination-Base | 1 | — | DOM/render + source pattern + behavioral | — |
| Progress-Stepper-Base | 1 | — | DOM/render + source pattern + behavioral | — |
| Progress-Stepper-Detailed | 1 | — | DOM/render + source pattern + behavioral | — |

---

## Test Approach Classification

### Source Code Pattern Matching
Tests that read source files and use regex/string matching to verify implementation artifacts exist. Example: checking that a TypeScript file contains `focusable` or that a CSS file references a specific token.

**Components using this approach**: 24 of 26 tested components
**Limitation**: Verifies presence of implementation artifacts, not behavioral correctness. A test that checks "source code contains `focusable`" passes even if focus doesn't actually work.

### DOM/Render Testing
Tests that create component instances and verify DOM output, attributes, and basic rendering.

**Components using this approach**: 25 of 26 tested components
**Strength**: Verifies actual rendered output. Closer to behavioral testing than pattern matching.

### Behavioral/Contract Testing
Tests explicitly organized around behavioral contracts — testing that specific behaviors work as documented.

**Components using this approach**: 13 of 26 tested components
**Strength**: Directly validates contract guarantees. Most reliable for schema confidence.

### Stemma System Tests (*.stemma.test.ts)
Dedicated test files for Stemma system validation — naming conventions, type classification, prop validation, accessibility.

**Components with stemma tests**: 8 (Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base, Button-Icon, Input-Checkbox-Base, Input-Radio-Base, Input-Radio-Set, Progress-Stepper-Base/Detailed/Pagination via behavioral sections)

---

## Gap Analysis

### Components with No Tests

| Component | Contracts Documented | Impact |
|-----------|---------------------|--------|
| Progress-Indicator-Connector-Base | 4 (contracts.yaml) | Medium — decorative primitive, low interaction risk |
| Progress-Indicator-Label-Base | 4 (contracts.yaml) | Medium — decorative primitive, low interaction risk |

### Components with test_approach Documentation but Incomplete Test Coverage

Badge-Count-Base has 7 `test_approach` fields in its contracts.yaml describing exactly how each contract should be tested. Badge-Count-Notification has 3. Badge-Label-Base has 6. These are the most test-ready contracts in the catalog — the test strategy is documented, and stemma tests exist. However, the stemma tests primarily use source code pattern matching rather than the behavioral testing described in the `test_approach` fields.

### Semantic Variants with Minimal Testing

| Component | Test Files | What's Tested | What's Not |
|-----------|-----------|---------------|------------|
| Input-Text-Email | 1 | Email validation logic | Inherited contracts (focus, float-label, error state, etc.) |
| Input-Text-Password | 1 | Password validation logic | Inherited contracts |
| Input-Text-PhoneNumber | 1 | Phone validation logic | Inherited contracts |
| Input-Checkbox-Legal | 1 | Legal-specific behavior | Inherited contracts from Checkbox-Base |

These semantic variants test only their *extended* contracts, not their *inherited* contracts. This is reasonable if the base component's tests cover the inherited behavior — but it means contract coverage depends on the base tests being comprehensive.

---

## Summary

- **Components with tests**: 26 of 28 (93%)
- **Components with zero tests**: 2 (Progress-Indicator-Connector-Base, Progress-Indicator-Label-Base)
- **Components with stemma-specific tests**: 8 (29%)
- **Components with behavioral/contract tests**: 13 (46%)
- **Dominant test approach**: Source code pattern matching (24 of 26 — 92%)
- **contracts.yaml with test_approach fields**: 3 components (Badge family), 16 total fields
- **Test_approach fields with no behavioral test implementation**: 16 (all Badge family test_approach fields describe behavioral tests, but actual tests use pattern matching)
