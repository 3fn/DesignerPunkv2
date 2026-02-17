# Issue: Demo System Property Test Failures

**Date**: February 16, 2026
**Severity**: Low
**Status**: Open
**Discovered During**: Spec 061 - Component Demo System (Task 7.4)
**Affects**: Demo system property tests (demo-system.test.ts)

---

## Summary

Three demo system property tests fail due to the index page containing links to demo files that haven't been created yet. These are expected failures that will resolve as remaining Phase 2 tasks (7.5–7.9) are completed.

---

## Failing Tests

### 1. Property 2: Index-to-file bidirectional consistency

**Test**: `every index link points to an existing demo file`
**Counterexample**: `radio-demo.html` (and others)

The index.html was populated with all 16 demo links during task 2.1, but only 12 demo files exist so far. The following index links have no corresponding file:

| Index Link | Missing File | Blocked By |
|------------|-------------|------------|
| `container-card-demo.html` | `demos/container-card-demo.html` | Task 7.5 |
| `radio-demo.html` | `demos/radio-demo.html` | Task 7.6 |
| `progress-indicator-demo.html` | `demos/progress-indicator-demo.html` | Task 7.7 |
| `progress-pagination-demo.html` | `demos/progress-pagination-demo.html` | Task 7.8 |
| `progress-stepper-demo.html` | `demos/progress-stepper-demo.html` | Task 7.9 |

### 2. Property 6: Build output completeness

**Test**: `every demo source file exists in dist/browser/`

New demo files added during Phase 2 (button-icon, button-vertical-list, chip, container-base) haven't been copied to `dist/browser/` because `npm run build` hasn't been run since they were created. This is expected — the build step copies files, and tests check the build output.

### 3. Property 7: Component family demo coverage

**Test**: `every web component family has a corresponding demo file`
**Counterexample**: `Progress-Stepper-Detailed`

The family-to-demo mapping expects `progress-stepper-demo.html` which hasn't been created yet (task 7.9).

---

## Root Cause

The index page was intentionally populated with all planned demo links ahead of file creation (task 2.1). This is a reasonable approach — the index serves as a roadmap — but it means Property 2 will fail until all demo files are created.

Similarly, Property 7 checks coverage against all web component families, which includes families whose demos are in tasks 7.5–7.9.

---

## Resolution Path

All three failures will self-resolve as Phase 2 tasks complete:
- Tasks 7.5–7.9: Create remaining demo files → fixes Properties 2 and 7
- Task 7.10 or any build run: `npm run build` → fixes Property 6

No code changes needed. These are not bugs — they're in-progress work.

---

## Related Specs

- Spec 061: Component Demo System (tasks 7.5–7.10)
