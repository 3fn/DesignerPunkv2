/**
 * @category evergreen
 * @purpose Pipeline integration test: fixture summary docs → release notes with mocked git
 */

import { SummaryScanner } from '../pipeline/SummaryScanner';
import { ChangeExtractor } from '../pipeline/ChangeExtractor';
import { ChangeClassifier } from '../pipeline/ChangeClassifier';
import { NotesRenderer } from '../pipeline/NotesRenderer';
import { ExtractedChange, ClassifiedChange } from '../types';
import * as childProcess from 'child_process';
import * as fs from 'fs';

jest.mock('child_process');
jest.mock('fs');

const mockedExecSync = childProcess.execSync as jest.MockedFunction<typeof childProcess.execSync>;
const mockedReadFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;

// --- Fixture summary docs ---

const FIXTURE_TOKEN_SUMMARY = `# Task 1 Summary: New Color Token

**Date**: 2026-02-20
**Type**: Implementation
**Spec**: 070-color-tokens

## What Was Done

Added a new semantic color token for error states.

## Key Changes

- Created color.error.surface token
- Updated theme definitions

## Why It Matters

Consumers need a standard error surface color.

## Impact

- ✅ All themes updated
- ⚠️ Existing hardcoded error colors should migrate

## Deliverables *(optional)*

- 🔴 Token: New color.error.surface semantic token
- 🟡 Documentation: Updated token reference guide
`;

const FIXTURE_GOVERNANCE_SUMMARY = `# Task 2 Summary: Process Update

**Date**: 2026-02-22
**Type**: Documentation
**Spec**: 071-governance

## What Was Done

Updated the spec planning process with new template.

## Key Changes

- Revised summary doc template
- Added deliverables section guidance

## Why It Matters

Improves consistency across specs.

## Impact

- ✅ Template updated
`;

describe('Pipeline Integration', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-02-27'));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const TAG_INFO = { tag: 'v7.0.0', commit: 'abc123', date: '2026-02-15' };

  it('should produce release notes from fixture summary docs end-to-end', async () => {
    // SummaryScanner: git log --diff-filter=A (encoding: utf-8 → returns string)
    mockedExecSync.mockReturnValueOnce(
      'docs/specs/070-color-tokens/task-1-summary.md\ndocs/specs/071-governance/task-2-summary.md\n',
    );

    mockedReadFileSync
      .mockReturnValueOnce(FIXTURE_TOKEN_SUMMARY)
      .mockReturnValueOnce(FIXTURE_GOVERNANCE_SUMMARY);

    // --- Run pipeline stages ---
    const scanner = new SummaryScanner();
    const summaries = await scanner.findSummariesSinceTag(TAG_INFO);

    const extractor = new ChangeExtractor();
    const extracted: ExtractedChange[] = summaries
      .map((s) => extractor.extract(s))
      .filter((e): e is ExtractedChange => e !== undefined);

    const classifier = new ChangeClassifier();
    const classified: ClassifiedChange[] = classifier.classify(extracted);

    const renderer = new NotesRenderer();
    const notes = renderer.render({
      currentVersion: '7.0.0',
      recommendedVersion: '8.0.0',
      bumpType: 'major',
      rationale: 'Breaking changes detected',
      confidence: 0.9,
      changes: classified,
    });

    // --- Verify public notes ---
    expect(notes.public).toContain('# Release 8.0.0');
    expect(notes.public).toContain('🔴 Breaking / Consumer-Facing');
    expect(notes.public).toContain('New Color Token');
    // Context-only items excluded from public
    expect(notes.public).not.toContain('🔵 Internal');

    // --- Verify internal notes ---
    expect(notes.internal).toContain('New Color Token');
    expect(notes.internal).toContain('Process Update');

    // --- Verify JSON structure ---
    expect(notes.json.version).toBe('8.0.0');
    expect(notes.json.previousVersion).toBe('7.0.0');
    expect(notes.json.changes).toHaveLength(2);
    expect(notes.json.changes[0].priority).toBe('breaking');
    expect(notes.json.changes[1].priority).toBe('context');
  });

  it('should handle pipeline with no summaries found', async () => {
    mockedExecSync.mockReturnValueOnce('\n');

    const scanner = new SummaryScanner();
    const summaries = await scanner.findSummariesSinceTag(TAG_INFO);

    const extractor = new ChangeExtractor();
    const extracted = summaries
      .map((s) => extractor.extract(s))
      .filter((e): e is ExtractedChange => e !== undefined);

    const classifier = new ChangeClassifier();
    const classified = classifier.classify(extracted);

    const renderer = new NotesRenderer();
    const notes = renderer.render({
      currentVersion: '7.0.0',
      recommendedVersion: '7.0.0',
      bumpType: 'none',
      rationale: 'No changes',
      confidence: 1.0,
      changes: classified,
    });

    expect(notes.public).toContain('No consumer-facing changes');
    expect(notes.json.changes).toHaveLength(0);
  });

  it('should classify by keyword when deliverables are absent', async () => {
    mockedExecSync.mockReturnValueOnce('docs/specs/071-governance/task-2-summary.md\n');

    mockedReadFileSync.mockReturnValueOnce(FIXTURE_GOVERNANCE_SUMMARY);

    const scanner = new SummaryScanner();
    const summaries = await scanner.findSummariesSinceTag(TAG_INFO);

    const extractor = new ChangeExtractor();
    const extracted = summaries
      .map((s) => extractor.extract(s))
      .filter((e): e is ExtractedChange => e !== undefined);

    const classifier = new ChangeClassifier();
    const classified = classifier.classify(extracted);

    // "process" keyword → context
    expect(classified).toHaveLength(1);
    expect(classified[0].priority).toBe('context');
    expect(classified[0].deliverableType).toBe('Process');
  });
});
