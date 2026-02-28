# Task 2 Completion: Tool Scaffold and Code Extraction

**Date**: 2026-02-27
**Task**: 2. Tool Scaffold and Code Extraction
**Type**: Parent
**Status**: Complete

---

## Artifacts Created

### Directory Structure
- `src/tools/release/` — root with subdirs: `cli/`, `pipeline/`, `publishers/`, `validators/`, `types/`, `__tests__/`
- `docs/releases/` — release notes output directory

### Extracted Components
- `src/tools/release/pipeline/VersionCalculator.ts` — from `src/release-analysis/versioning/VersionCalculator.ts`
- `src/tools/release/publishers/GitHubPublisher.ts` — from `src/release/publishing/GitHubPublisher.ts`
- `src/tools/release/publishers/NpmPublisher.ts` — from `src/release/publishing/NpmPublisher.ts`
- `src/tools/release/validators/SemanticVersionValidator.ts` — rewritten as thin delegation layer

### Shared Types and Config
- `src/tools/release/types/index.ts` — three-section type system (pipeline, calculator, publisher)
- `src/tools/release/release-config.json` — defaults (`npmPublishEnabled: false`, `outputDir: docs/releases`)

### Tests (77 total)
- `__tests__/VersionCalculator.test.ts` — 20 tests
- `__tests__/GitHubPublisher.test.ts` — 26 tests
- `__tests__/NpmPublisher.test.ts` — 24 tests
- `__tests__/SemanticVersionValidator.test.ts` — 7 tests
- `__tests__/helpers/NpmMockHelper.ts` — test utility

## Architecture Decisions

### Decision: src/tools/release/ instead of .kiro/tools/release/

**Options Considered**:
1. `.kiro/tools/release/` — separates tooling from product code by directory tree
2. `src/tools/release/` — stays within Jest roots and tsconfig include scope

**Decision**: `src/tools/release/`

**Rationale**: Jest roots are `<rootDir>/src` and tsconfig includes only `src/**/*`. Using `.kiro/tools/` would require config changes affecting the entire project. The `tools/` directory name provides the same conceptual separation with zero config friction.

**Trade-offs**:
- ✅ Zero config changes, Jest and TypeScript just work
- ❌ Tool code lives alongside product code in `src/`
- ⚠️ Must rely on convention (`tools/` directory) rather than physical separation

### Decision: Two VersionRecommendation Types

The extracted VersionCalculator uses `VersionRecommendation` with `ChangeEvidence[]` (the old system's granular evidence model). The pipeline design specifies a recommendation with `ClassifiedChange[]` (the new system's summary-doc-based model). Named the pipeline-level one `PipelineRecommendation` to avoid collision. Task 3 will bridge between them.

### Decision: SemanticVersionValidator as Delegation Layer

The original SemanticVersionValidator (330 lines) duplicated version parsing and progression logic already present in VersionCalculator, plus was coupled to a `SemanticVersioningRules` config interface. Rewrote as a 50-line wrapper that delegates to VersionCalculator.

## Validation (Tier 3: Comprehensive)

### Syntax Validation
- ✅ All TypeScript compiles without errors
- ✅ No references to old `release/` or `release-analysis/` type systems

### Functional Validation
- ✅ 77/77 new tests passing across 4 suites
- ✅ Jest discovers tests in `src/tools/release/__tests__/`
- ✅ All extracted code behavior preserved (identical test assertions)

### Design Validation
- ✅ Directory structure matches design outline (adapted path)
- ✅ Types cover all design.md interfaces (TagInfo, SummaryDoc, ExtractedChange, DeliverableEntry, ClassifiedChange, PipelineRecommendation, RenderedNotes, ReleaseData, ReleaseConfig)
- ✅ npm publishing gated behind `npmPublishEnabled` config flag
- ✅ Config defaults match requirements (`outputDir: docs/releases`)

### Full Suite Validation
- ✅ 8999 tests passing, 13 skipped
- ⚠️ 10 pre-existing failures (6 stemma schema, 1 color token count) — documented in `.kiro/issues/pre-existing-test-failures.md`, flagged for Lina and Ada

## Success Criteria Verification

### Criterion: Directory structure created with all subdirs
✅ `cli/`, `pipeline/`, `publishers/`, `validators/`, `types/`, `__tests__/` all present

### Criterion: VersionCalculator extracted with passing tests
✅ 20/20 tests passing, all behavior preserved

### Criterion: Publishers and validators extracted with passing tests
✅ GitHubPublisher 26/26, NpmPublisher 24/24, SemanticVersionValidator 7/7

### Criterion: Shared types defined covering all pipeline components
✅ Three-section type system covers pipeline, calculator, and publisher domains

### Criterion: Extracted code compiles against new types
✅ All 77 tests pass, no type errors

## Related Documentation

- [Task 2 Summary](../../../docs/specs/065-release-system-rebuild/task-2-summary.md)
- [Task 2.1 Completion](task-2-1-completion.md)
- [Task 2.2 Completion](task-2-2-completion.md)
- [Task 2.3 Completion](task-2-3-completion.md)
- [Task 2.4 Completion](task-2-4-completion.md)
