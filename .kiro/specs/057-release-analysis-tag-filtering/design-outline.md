# Release Analysis Tag Filtering Fix - Design Outline

**Date**: February 4, 2026
**Purpose**: Document bug in release analysis `--since` flag and proposed fix
**Status**: Design Outline (Draft)

---

## Problem Statement

The release analysis CLI's `--since` flag is not filtering documents by git tag/commit. When running `npm run release:analyze -- --since v6.0.0`, the system analyzes ALL documents in the repository instead of only documents added/modified since the specified tag.

### Current Behavior (Bug)

```bash
$ npm run release:analyze -- --since v6.0.0
# Expected: Analyze only documents added/modified since v6.0.0
# Actual: Analyzes ALL 292 documents from repository start
```

### Expected Behavior

```bash
$ npm run release:analyze -- --since v6.0.0
# Should analyze only 5 documents:
# - docs/specs/045-chip-base/task-1-summary.md
# - docs/specs/045-chip-base/task-2-summary.md
# - docs/specs/045-chip-base/task-3-summary.md
# - docs/specs/045-chip-base/task-4-summary.md
# - docs/specs/055-semantic-radius-pill-rename/task-1-summary.md
```

### Impact

- **Incorrect version recommendations**: System recommends major bump (v7.0.0) when minor bump (v6.1.0) is correct
- **Duplicate release notes**: Changes already released in v5.x and v6.0.0 appear in new release notes
- **Wasted analysis time**: Processing 292 documents instead of 5

---

## Root Cause Analysis

### Code Flow Investigation

1. **CLI Entry Point**: `src/release-analysis/cli/release-analyze.ts`
   - Calls `AdvancedReleaseCLI.run()`

2. **Argument Parsing**: `AdvancedReleaseCLI.parseAdvancedArguments()`
   - Correctly parses `--since v6.0.0` into `options.since = 'v6.0.0'`

3. **Analysis Execution**: `AdvancedReleaseCLI.analyzeChanges(options)`
   - **BUG LOCATION**: When `--reset` flag is used (or implicitly triggered), the code calls `performFullResetAnalysis(options)` which ignores `options.since`

4. **Full Reset Analysis**: `performFullResetAnalysis(options)`
   - Calls `ReleaseAnalysisOrchestrator.analyzeFullReset()`
   - This method resets state and analyzes ALL documents
   - **Does NOT pass `options.since` to filter documents**

### Specific Bug Location

```typescript
// src/release-analysis/cli/AdvancedReleaseCLI.ts, line ~150
if (options.reset) {
  console.log('🔄 Reset flag detected - forcing full analysis...\n');
  return await this.performFullResetAnalysis(options);  // ← options.since is passed but ignored
}
```

```typescript
// src/release-analysis/cli/AdvancedReleaseCLI.ts, line ~260
private async performFullResetAnalysis(options: AnalysisOptions & InteractiveOptions): Promise<AnalysisResult> {
  // ...
  const orchestratorResult = await orchestrator.analyzeFullReset();  // ← options.since NOT used
  // ...
}
```

```typescript
// src/release-analysis/ReleaseAnalysisOrchestrator.ts, line ~180
async analyzeFullReset(): Promise<ReleaseAnalysisResult> {
  console.log('🔄 Forcing full analysis (resetting state)...');
  await this.stateManager.resetState();
  return this.analyze();  // ← Analyzes ALL documents, no filtering
}
```

### Secondary Issue: Normal Analysis Path

Even without `--reset`, the normal analysis path has issues:

```typescript
// src/release-analysis/cli/AdvancedReleaseCLI.ts, line ~993
private async determineAnalysisScope(options: AnalysisOptions): Promise<AnalysisScope> {
  const gitAnalyzer = new GitHistoryAnalyzer(this.workingDirectory);
  
  if (options.since) {
    const changes = await gitAnalyzer.getChangesSince(options.since);  // ← This should work
    const documents = await gitAnalyzer.findCompletionDocuments(changes);
    // ...
  }
}
```

The `GitHistoryAnalyzer.getChangesSince()` method appears correct, but:
1. It may be falling back to empty changes on error
2. The `findCompletionDocuments()` may not be finding the right files
3. The fallback to `findAllCompletionDocuments()` may be triggering incorrectly

---

## Proposed Solution

### Option A: Fix `performFullResetAnalysis` to Respect `--since`

**Approach**: Modify `performFullResetAnalysis` to pass `options.since` to the orchestrator and filter documents accordingly.

**Changes Required**:
1. Add `since` parameter to `ReleaseAnalysisOrchestrator.analyzeFullReset()`
2. Filter documents by git changes when `since` is provided
3. Update `performFullResetAnalysis` to pass `options.since`

**Pros**:
- Minimal changes to existing architecture
- Maintains reset functionality while adding filtering

**Cons**:
- Requires changes to orchestrator interface

### Option B: Separate Reset and Since Logic

**Approach**: Make `--reset` and `--since` work independently. Reset clears state but still respects `--since` for document filtering.

**Changes Required**:
1. Modify `analyzeChanges` to handle reset and since separately
2. Reset state first, then apply `--since` filtering
3. Use `determineAnalysisScope` even after reset

**Pros**:
- Cleaner separation of concerns
- More intuitive behavior

**Cons**:
- More extensive refactoring

### Recommended: Option B

Option B provides cleaner semantics:
- `--reset`: Clear cached state, force re-analysis
- `--since`: Filter to documents changed since tag
- Both together: Clear state AND filter to recent changes

---

## Implementation Plan

### Task 1: Investigate and Confirm Root Cause
- Add debug logging to trace execution path
- Confirm which code path is being taken
- Verify git commands return expected results

### Task 2: Fix Reset + Since Interaction
- Modify `analyzeChanges` to apply `--since` filtering after reset
- Ensure `determineAnalysisScope` is called with correct options
- Add tests for `--reset --since` combination

### Task 3: Fix Fallback Behavior
- Review error handling in `getChangesSince`
- Ensure fallback to all documents only happens when appropriate
- Add logging when fallback is triggered

### Task 4: Add Integration Tests
- Test `--since v6.0.0` returns only recent documents
- Test `--reset --since v6.0.0` works correctly
- Test invalid tag handling

### Task 5: Update Documentation
- Document `--since` flag behavior
- Document interaction with `--reset`
- Add troubleshooting guide

---

## Success Criteria

1. `npm run release:analyze -- --since v6.0.0` analyzes only documents added/modified since v6.0.0
2. `npm run release:analyze -- --reset --since v6.0.0` resets state AND filters to recent documents
3. Correct version recommendation (v6.1.0 MINOR, not v7.0.0 MAJOR)
4. Release notes contain only changes since v6.0.0
5. Clear logging shows which documents are being analyzed and why

---

## Verification

After fix, running `npm run release:analyze -- --since v6.0.0` should output:

```
🔍 Starting enhanced release analysis...

🎯 Determining analysis scope...
   From: v6.0.0
   To: HEAD
📄 Found 5 completion documents

🔍 Extracting changes...
✅ Successfully loaded 5 completion documents

🏷️  Calculating version recommendation...
   Current: 6.0.0
   Recommended: 6.1.0 (MINOR)
   Rationale: 3 new features, 1 bug fix, 1 improvement

📝 Generating release notes...

✅ Enhanced analysis complete!
```

---

## Related Files

- `src/release-analysis/cli/AdvancedReleaseCLI.ts` - Main CLI with bug
- `src/release-analysis/cli/ReleaseCLI.ts` - Alternative CLI (may have same issue)
- `src/release-analysis/ReleaseAnalysisOrchestrator.ts` - Orchestrator with `analyzeFullReset`
- `src/release-analysis/git/GitHistoryAnalyzer.ts` - Git operations
- `src/release-analysis/state/AnalysisStateManager.ts` - State management

---

## Out of Scope

1. Performance optimization of git operations
2. Caching improvements
3. UI/UX changes to CLI output
4. New CLI flags or features

---

**Organization**: spec-guide
**Scope**: 057-release-analysis-tag-filtering
