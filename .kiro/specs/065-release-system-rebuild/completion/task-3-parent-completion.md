# Task 3 Completion: Pipeline Components

**Date**: 2026-02-27
**Task**: 3. Pipeline Components
**Type**: Parent
**Status**: Complete

---

## Artifacts Created

### Pipeline Components
- `src/tools/release/pipeline/TagResolver.ts` — git tag resolution and creation
- `src/tools/release/pipeline/SummaryScanner.ts` — finds summary docs since last tag
- `src/tools/release/pipeline/ChangeExtractor.ts` — parses summary doc markdown into structured data
- `src/tools/release/pipeline/ChangeClassifier.ts` — maps changes to priority tiers (breaking/prominent/context)
- `src/tools/release/pipeline/NotesRenderer.ts` — generates public + internal markdown and JSON intermediate

### Tests (34 unit + 3 integration = 37 new)
- `__tests__/TagResolver.test.ts` — 6 tests
- `__tests__/SummaryScanner.test.ts` — 9 tests
- `__tests__/ChangeExtractor.test.ts` — 8 tests
- `__tests__/ChangeClassifier.test.ts` — 10 tests
- `__tests__/NotesRenderer.test.ts` — 8 tests
- `__tests__/PipelineIntegration.test.ts` — 3 tests

### Subtask Completion Docs
- `.kiro/specs/065-release-system-rebuild/completion/task-3-1-completion.md`
- `.kiro/specs/065-release-system-rebuild/completion/task-3-2-completion.md`
- `.kiro/specs/065-release-system-rebuild/completion/task-3-3-completion.md`
- `.kiro/specs/065-release-system-rebuild/completion/task-3-4-completion.md`
- `.kiro/specs/065-release-system-rebuild/completion/task-3-5-completion.md`
- `.kiro/specs/065-release-system-rebuild/completion/task-3-6-completion.md`

## Architecture Decisions

### Decision: Two classification paths in ChangeClassifier

**Approach**: When `deliverables` field exists on an ExtractedChange, use the emoji priority directly (🔴→breaking, 🟡→prominent, 🔵→context). When absent, fall back to keyword heuristics against title/description text.

**Rationale**: The Deliverables section was added to the summary doc template in Task 1, but hundreds of existing summary docs predate it. The keyword fallback ensures the pipeline works with both old and new format docs.

**Counter-argument**: Keyword heuristics are inherently fragile — a doc mentioning "token" in passing gets classified as breaking. Acceptable because: (1) release notes are human-reviewed before publishing, (2) the structured deliverables path will dominate as new summaries are written, and (3) misclassification at the "prominent vs context" boundary is low-stakes.

### Decision: NotesRenderer produces two markdown outputs

**Approach**: `public` (🔴+🟡 only) and `internal` (all tiers), plus a `json` intermediate.

**Rationale**: Public release notes shouldn't include internal governance/process changes that don't affect consumers. The JSON intermediate makes the renderer testable without parsing markdown and leaves the door open for other output formats (GitHub release body, changelog).

### Decision: SummaryScanner returns async

**Approach**: `findSummariesSinceTag()` returns `Promise<SummaryDoc[]>` even though current implementation is synchronous.

**Rationale**: Future-proofing for potential async file operations. The integration test correctly awaits the result.

## Validation

### Test Results
- ✅ 37 new tests passing (34 unit + 3 integration)
- ✅ Full release tool suite: 10 suites, 121 tests passing
- ✅ No regressions in existing tests

### Pipeline Coverage
| Component | Input | Output | Tests |
|-----------|-------|--------|-------|
| TagResolver | git commands | TagInfo \| null | 6 |
| SummaryScanner | TagInfo \| null | SummaryDoc[] | 9 |
| ChangeExtractor | SummaryDoc | ExtractedChange | 8 |
| ChangeClassifier | ExtractedChange[] | ClassifiedChange[] | 10 |
| NotesRenderer | PipelineRecommendation | RenderedNotes | 8 |
| Integration | fixture docs → mocked git | rendered notes | 3 |

### Design Requirements Met
- ✅ All pipeline components from design.md implemented
- ✅ Integration test: full pipeline from summary docs → release notes with mocked git
- ✅ Deliverables field parsing with three-tier emoji taxonomy
- ✅ Public notes exclude 🔵 context items
- ✅ JSON intermediate for testability
