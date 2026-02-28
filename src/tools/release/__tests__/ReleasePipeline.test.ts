/**
 * @category evergreen
 * @purpose Verify ReleasePipeline orchestrates pipeline components correctly
 */

import { ReleasePipeline } from '../cli/ReleasePipeline';
import * as childProcess from 'child_process';
import * as fs from 'fs';

jest.mock('child_process');
jest.mock('fs');

const mockedExecSync = childProcess.execSync as jest.MockedFunction<typeof childProcess.execSync>;
const mockedReadFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;
const mockedExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
const mockedWriteFileSync = fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>;
const mockedMkdirSync = fs.mkdirSync as jest.MockedFunction<typeof fs.mkdirSync>;
const mockedReaddirSync = fs.readdirSync as jest.MockedFunction<typeof fs.readdirSync>;

const FIXTURE_SUMMARY = `# Task 1 Summary: New Token

**Date**: 2026-02-20
**Type**: Implementation
**Spec**: 070-tokens

## What Was Done

Added a new token.

## Key Changes

- Created new token

## Why It Matters

Consumers need it.

## Impact

- ✅ Done

## Deliverables *(optional)*

- 🔴 Token: New semantic token
`;

const CONFIG = JSON.stringify({ npmPublishEnabled: false, repoUrl: '', outputDir: 'docs/releases' });

describe('ReleasePipeline', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-02-27'));
    jest.clearAllMocks();
    // Default: config file read returns config
    mockedReadFileSync.mockImplementation((p: any) => {
      if (String(p).includes('release-config.json')) return CONFIG;
      return FIXTURE_SUMMARY;
    });
    mockedExistsSync.mockReturnValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function mockTagAndSummaries(summaryPaths: string[]): void {
    // TagResolver: describe, rev-list, log (all return strings via encoding: utf-8)
    mockedExecSync
      .mockReturnValueOnce('v7.0.0\n')
      .mockReturnValueOnce('abc123\n')
      .mockReturnValueOnce('2026-02-15\n')
      // SummaryScanner: git log
      .mockReturnValueOnce(summaryPaths.join('\n') + '\n');
  }

  describe('analyze', () => {
    it('should return recommendation with changes', async () => {
      mockTagAndSummaries(['docs/specs/070-tokens/task-1-summary.md']);
      const pipeline = new ReleasePipeline();
      const rec = await pipeline.analyze();

      expect(rec.currentVersion).toBe('7.0.0');
      expect(rec.bumpType).toBe('major');
      expect(rec.changes).toHaveLength(1);
      expect(rec.changes[0].priority).toBe('breaking');
    });

    it('should return none bump when no summaries', async () => {
      mockTagAndSummaries([]);
      const pipeline = new ReleasePipeline();
      const rec = await pipeline.analyze();

      expect(rec.bumpType).toBe('none');
      expect(rec.changes).toHaveLength(0);
    });
  });

  describe('generateNotes', () => {
    it('should write files to output directory', async () => {
      mockTagAndSummaries(['docs/specs/070-tokens/task-1-summary.md']);
      const pipeline = new ReleasePipeline();
      await pipeline.generateNotes();

      expect(mockedMkdirSync).toHaveBeenCalled();
      expect(mockedWriteFileSync).toHaveBeenCalledTimes(3); // public, internal, json
    });
  });

  describe('checkAccumulation', () => {
    it('should warn when >5 files in output dir', () => {
      mockedReaddirSync.mockReturnValue(['a', 'b', 'c', 'd', 'e', 'f'] as any);
      const pipeline = new ReleasePipeline();
      const warning = pipeline.checkAccumulation();

      expect(warning).toContain('6 files');
    });

    it('should return null when <=5 files', () => {
      mockedReaddirSync.mockReturnValue(['a', 'b'] as any);
      const pipeline = new ReleasePipeline();
      expect(pipeline.checkAccumulation()).toBeNull();
    });
  });

  describe('release', () => {
    it('should return notes without tagging or publishing in dry-run mode', async () => {
      mockTagAndSummaries(['docs/specs/070-tokens/task-1-summary.md']);
      const pipeline = new ReleasePipeline();
      const result = await pipeline.release(true);

      expect(result.published).toBe(false);
      expect(result.notes.json.version).toBe('8.0.0');
      // generateNotes writes 3 files, but no tag creation call beyond that
      const execCalls = mockedExecSync.mock.calls;
      const tagCalls = execCalls.filter((c) => String(c[0]).includes('git tag'));
      expect(tagCalls).toHaveLength(0);
    });

    it('should create git tag when not dry-run', async () => {
      // First call: analyze (tag + scanner)
      mockTagAndSummaries(['docs/specs/070-tokens/task-1-summary.md']);
      // Second call inside release: generateNotes calls analyze again
      mockedExecSync
        .mockReturnValueOnce('v7.0.0\n')
        .mockReturnValueOnce('abc123\n')
        .mockReturnValueOnce('2026-02-15\n')
        .mockReturnValueOnce('docs/specs/070-tokens/task-1-summary.md\n')
        // createTag call
        .mockReturnValueOnce('');

      const pipeline = new ReleasePipeline();
      const result = await pipeline.release(false);

      const tagCalls = mockedExecSync.mock.calls.filter((c) => String(c[0]).includes('git tag'));
      expect(tagCalls).toHaveLength(1);
      expect(String(tagCalls[0][0])).toContain('v8.0.0');
      // No repoUrl configured, so not published
      expect(result.published).toBe(false);
      expect(result.error).toContain('No repoUrl configured');
    });

    it('should skip GitHub publish when GITHUB_TOKEN is not set', async () => {
      const configWithRepo = JSON.stringify({ npmPublishEnabled: false, repoUrl: 'https://github.com/3fn/DesignerPunkv2', outputDir: 'docs/releases' });
      mockedReadFileSync.mockImplementation((p: any) => {
        if (String(p).includes('release-config.json')) return configWithRepo;
        return FIXTURE_SUMMARY;
      });

      // analyze pass
      mockTagAndSummaries(['docs/specs/070-tokens/task-1-summary.md']);
      // generateNotes calls analyze again
      mockedExecSync
        .mockReturnValueOnce('v7.0.0\n')
        .mockReturnValueOnce('abc123\n')
        .mockReturnValueOnce('2026-02-15\n')
        .mockReturnValueOnce('docs/specs/070-tokens/task-1-summary.md\n')
        .mockReturnValueOnce(''); // createTag

      const originalToken = process.env.GITHUB_TOKEN;
      delete process.env.GITHUB_TOKEN;

      try {
        const pipeline = new ReleasePipeline();
        const result = await pipeline.release(false);

        expect(result.published).toBe(false);
        expect(result.error).toContain('GITHUB_TOKEN not set');
      } finally {
        if (originalToken) process.env.GITHUB_TOKEN = originalToken;
      }
    });
  });
});
