# Task 2.1 Completion: Investigate DocumentParsingCache Path Resolution

**Date**: November 17, 2025
**Task**: 2.1 Investigate DocumentParsingCache path resolution
**Type**: Implementation
**Status**: Complete

---

## Investigation Summary

Investigated the DocumentParsingCache path resolution to identify the root cause of file-not-found errors in PerformanceBenchmarks tests.

## Root Cause Identified

The issue is in how the test creates mock files versus how DocumentParsingCache resolves file paths:

### Test Setup (setupMockGitRepository)

```typescript
function setupMockGitRepository(documents: CompletionDocument[]): void {
    // Create directory structure
    for (const doc of documents) {
        const dir = join(testDir, doc.path.split('/').slice(0, -1).join('/'));
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(testDir, doc.path), doc.content);
    }
}
```

**What it does**: Creates files at `join(testDir, doc.path)` - e.g., `/tmp/release-analysis-perf-123/.kiro/specs/test-spec-0/completion/task-0-completion.md`

### DocumentParsingCache Path Resolution

```typescript
async parseDocumentIncremental(filePath: string): Promise<IncrementalParsingResult> {
    const startTime = Date.now();
    this.stats.totalRequests++;

    try {
        const fullPath = join(this.workingDirectory, filePath);
        const fileStats = statSync(fullPath);
        // ...
    }
}
```

**What it does**: Resolves paths as `join(this.workingDirectory, filePath)` where `workingDirectory` is passed to constructor

### The Problem

1. **Test creates DocumentParsingCache with `testDir`**:
   ```typescript
   documentCache = new DocumentParsingCache(testDir, { ... });
   ```

2. **Test creates files at**: `join(testDir, doc.path)`
   - Example: `/tmp/release-analysis-perf-123/.kiro/specs/test-spec-0/completion/task-0-completion.md`

3. **Test calls parseDocumentIncremental with full path**: `doc.path`
   - Example: `.kiro/specs/test-spec-0/completion/task-0-completion.md`

4. **DocumentParsingCache resolves to**: `join(testDir, doc.path)`
   - Example: `/tmp/release-analysis-perf-123/.kiro/specs/test-spec-0/completion/task-0-completion.md`

5. **This should work!** The paths match correctly.

## Deeper Investigation Required

The path resolution logic appears correct. The issue must be elsewhere. Let me check:

### Potential Issues

1. **Timing Issue**: Files might not be fully written before parsing attempts
2. **Test Execution Order**: `setupMockGitRepository` might not be called before parsing
3. **Working Directory Mismatch**: The `testDir` passed to DocumentParsingCache might differ from where files are created
4. **File System Sync**: `writeFileSync` should be synchronous, but there might be OS-level delays

## Key Findings

### DocumentParsingCache Constructor
```typescript
constructor(
    workingDirectory: string = process.cwd(),
    config: Partial<DocumentParsingConfig> = {}
) {
    this.workingDirectory = workingDirectory;
    // ...
}
```
- Takes `workingDirectory` as first parameter
- Defaults to `process.cwd()` if not provided
- Stores it as `this.workingDirectory`

### Path Resolution in parseDocumentIncremental
```typescript
const fullPath = join(this.workingDirectory, filePath);
const fileStats = statSync(fullPath);
```
- Joins `workingDirectory` with the provided `filePath`
- Uses `statSync` to check file existence (throws if file doesn't exist)

### Test Initialization
```typescript
beforeAll(async () => {
    testDir = join(tmpdir(), `release-analysis-perf-${Date.now()}`);
    mkdirSync(testDir, { recursive: true });
    
    documentCache = new DocumentParsingCache(testDir, {
        enableCache: true,
        maxCacheSize: 1000,
        enableParallelParsing: true,
        maxConcurrentParsing: 4
    });
});
```
- Creates `testDir` in system temp directory
- Passes `testDir` to DocumentParsingCache constructor
- This should set `workingDirectory` correctly

## The Actual Problem

Looking at the test flow more carefully:

1. **generateTestDocuments** creates document objects with paths like:
   ```typescript
   path: `.kiro/specs/test-spec-${i}/completion/task-${i}-completion.md`
   ```

2. **setupMockGitRepository** is called in `benchmarkAnalyzerPerformance`:
   ```typescript
   async function benchmarkAnalyzerPerformance(...) {
       setupMockGitRepository(documents);
       // ...
   }
   ```

3. **But other benchmark functions don't call setupMockGitRepository!**
   - `benchmarkExtraction` - ❌ No file creation
   - `benchmarkSequentialExtraction` - ❌ No file creation
   - `benchmarkParallelExtraction` - ❌ No file creation
   - `benchmarkMemoryUsage` - ❌ No file creation

## Root Cause Confirmed

**The tests call `documentCache.parseDocumentIncremental(doc.path)` without first creating the files on disk.**

Most benchmark functions generate test documents in memory but never write them to the file system before attempting to parse them. Only `benchmarkAnalyzerPerformance` calls `setupMockGitRepository`, but that function is only used in the regression tests.

## Solution Required

The fix needs to ensure files are created on disk before attempting to parse them. Options:

1. **Option A**: Call `setupMockGitRepository(documents)` in each benchmark function before parsing
2. **Option B**: Modify `generateTestDocuments` to write files immediately
3. **Option C**: Create a helper that both generates and writes documents

## Validation (Tier 2: Standard)

### Syntax Validation
✅ No code changes made - investigation only
✅ All file reads successful

### Functional Validation
✅ Identified root cause: Files not created before parsing attempts
✅ Confirmed path resolution logic is correct
✅ Identified which functions need file creation

### Integration Validation
✅ Reviewed DocumentParsingCache constructor and initialization
✅ Verified how parseDocumentIncremental resolves file paths
✅ Confirmed testDir is passed correctly to DocumentParsingCache

### Requirements Compliance
✅ Requirement 2.1: Reviewed DocumentParsingCache constructor and initialization
✅ Requirement 2.2: Checked how parseDocumentIncremental() resolves file paths
✅ Requirement 2.2: Verified if testDir is being passed correctly
✅ Requirement 2.1: Identified root cause of file-not-found errors
✅ Requirement 2.1: Documented findings

## Next Steps

Task 2.2 will implement the fix based on these findings. The solution will ensure that all benchmark functions create the necessary files on disk before attempting to parse them.

---

**Organization**: spec-completion
**Scope**: 003-release-analysis-test-cleanup
