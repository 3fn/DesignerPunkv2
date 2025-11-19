# Steering Documentation Updates - Test Command Clarification

**Date**: November 19, 2025  
**Purpose**: Clarify when to use `npm test` vs `npm run test:all` for parent task validation  
**Impact**: Reduces validation time from 28 minutes to 10 minutes for most parent tasks

---

## Changes Made

### 1. Start Up Tasks.md

**Updated Section**: Test Command Selection Guidelines

**Key Changes**:
- Changed default for parent tasks from `npm run test:all` to `npm test`
- Added decision tree: only use `test:all` if modifying release-analysis/release-detection systems
- Clarified that `npm test` includes comprehensive functional validation (including release analysis functional tests)
- Explained that `test:all` adds 20 minutes of performance regression tests

**Rationale**: Most parent tasks don't modify the release analysis system, so they don't need performance regression tests. The functional tests in `npm test` are sufficient to validate that release analysis still works.

---

### 2. Development Workflow.md

**Updated Section**: Recommended Process (IDE-based with Automation) - Step 2

**Key Changes**:
- Changed parent task validation from `npm run test:all` to `npm test` (default)
- Added exception: use `test:all` only when modifying release-analysis/release-detection systems
- Maintained performance task guidance unchanged

**Rationale**: Aligns workflow documentation with the updated test command guidelines.

---

### 3. Spec Planning Standards.md

**Updated Section**: Three-Tier Validation System - Tier 3 Comprehensive - Test Execution

**Key Changes**:
- Changed from "Required for parent task completion" to "Default for parent tasks: npm test"
- Added conditional guidance for when to use `test:all`
- Clarified that most parent tasks only need functional validation

**Rationale**: Ensures spec planning documentation matches the updated validation approach.

---

## Impact Summary

**Before**:
- All parent tasks required `npm run test:all` (~28 minutes)
- Included 20 minutes of performance regression tests for release analysis
- No distinction between tasks that affect release analysis and those that don't

**After**:
- Most parent tasks use `npm test` (~10 minutes)
- Performance regression tests only run when modifying release-analysis/release-detection
- Clear decision tree for when comprehensive performance testing is needed

**Time Savings**:
- Typical parent task validation: 18 minutes saved (28 min → 10 min)
- Release analysis parent tasks: No change (still 28 minutes, as appropriate)

---

## Decision Rationale

### Why This Change?

The release analysis system runs after every parent task completion, but that doesn't mean we need to run performance regression tests every time. The distinction is:

**Functional Validation** (`npm test`):
- Validates release analysis still works correctly
- Tests with typical workloads (1-5 documents)
- Fast feedback (~10 minutes)
- Sufficient for most parent tasks

**Performance Regression Validation** (`npm run test:all`):
- Validates release analysis performance at scale
- Tests with 10-150 documents, stress conditions, memory usage
- Slow but thorough (~28 minutes)
- Only needed when modifying release analysis system

### When to Use Each Command

**Use `npm test` (default) when:**
- Adding new token types
- Building components
- Updating documentation
- Any work that doesn't modify release-analysis or release-detection systems

**Use `npm run test:all` when:**
- Modifying release analysis parsing logic
- Updating release detection system
- Optimizing performance-critical code paths
- Working on the release analysis system itself

---

## Files Modified

1. `.kiro/steering/Start Up Tasks.md` - Test Command Selection Guidelines
2. `.kiro/steering/Development Workflow.md` - Recommended Process validation step
3. `.kiro/steering/Spec Planning Standards.md` - Tier 3 Validation test execution

---

**Organization**: process-standard  
**Scope**: cross-project
