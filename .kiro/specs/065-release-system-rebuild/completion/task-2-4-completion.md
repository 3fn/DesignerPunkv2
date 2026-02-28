# Task 2.4 Completion: Define Shared Types

**Date**: 2026-02-27
**Task**: 2.4 Define shared types
**Type**: Implementation
**Status**: Complete

---

## Artifacts Modified

- `src/tools/release/types/index.ts` — restructured into three sections, added pipeline types from design.md

## Implementation Details

### Approach
Restructured the types file into three clearly separated sections:
1. Pipeline types — the new system's domain model from design.md (TagInfo, SummaryDoc, ExtractedChange, DeliverableEntry, ClassifiedChange, PipelineRecommendation, RenderedNotes, ReleaseData, ReleaseConfig)
2. Calculator types — shapes consumed by the extracted VersionCalculator (BreakingChange, Feature, BugFix, etc.)
3. Publisher types — shapes consumed by the extracted publishers (GitHubRelease, PackagePublish, etc.)

### Key Decision: Two Recommendation Types
The design.md specifies `VersionRecommendation` with `ClassifiedChange[]` evidence, but the extracted VersionCalculator uses `VersionRecommendation` with `ChangeEvidence[]`. These are different abstraction levels. Named the pipeline-level one `PipelineRecommendation` to avoid collision. The pipeline will bridge between them in Task 3.

### Issue Encountered
Both `VersionCalculator.ts` and its test file had been overwritten by another process with a premature Task 3 implementation (a `recommend()` method taking `ClassifiedChange[]`). Restored both to the correct extracted versions. All 77 tests pass.

## Validation

### Syntax Validation
- ✅ TypeScript compiles without errors
- ✅ All pipeline types from design.md present

### Functional Validation
- ✅ 77/77 tests passing across 4 suites
- ✅ Existing extracted code compiles against restructured types
- ✅ Pipeline types match design.md interfaces
