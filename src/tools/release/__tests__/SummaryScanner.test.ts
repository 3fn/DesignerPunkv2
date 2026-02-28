/**
 * @category evergreen
 * @purpose Verify SummaryScanner discovers and parses summary docs correctly
 */

import { SummaryScanner } from '../pipeline/SummaryScanner';
import { TagInfo } from '../types';
import { execSync } from 'child_process';
import * as fs from 'fs';

jest.mock('child_process');
jest.mock('fs');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockFs = fs as jest.Mocked<typeof fs>;

describe('SummaryScanner', () => {
  let scanner: SummaryScanner;

  beforeEach(() => {
    jest.clearAllMocks();
    scanner = new SummaryScanner('/test/repo');
  });

  const tag: TagInfo = { tag: 'v7.0.0', commit: 'abc123', date: '2026-02-23' };

  describe('findSummariesSinceTag with tag', () => {
    it('should find summaries via git log', async () => {
      mockExecSync.mockReturnValueOnce(
        'docs/specs/063-uniform-contract/task-1-summary.md\ndocs/specs/064-metadata/task-2-summary.md\n',
      );
      mockFs.readFileSync
        .mockReturnValueOnce('# Task 1 Summary\nContent here')
        .mockReturnValueOnce('# Task 2 Summary\nMore content');

      const results = await scanner.findSummariesSinceTag(tag);

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual({
        path: 'docs/specs/063-uniform-contract/task-1-summary.md',
        specName: '063-uniform-contract',
        taskNumber: 1,
        raw: '# Task 1 Summary\nContent here',
      });
      expect(results[1].specName).toBe('064-metadata');
      expect(results[1].taskNumber).toBe(2);

      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('v7.0.0..HEAD'),
        expect.objectContaining({ cwd: '/test/repo' }),
      );
    });

    it('should fall back to glob when git log fails', async () => {
      mockExecSync
        .mockImplementationOnce(() => { throw new Error('git error'); })
        .mockReturnValueOnce('docs/specs/060-spec/task-1-summary.md\n');
      mockFs.readFileSync.mockReturnValueOnce('# Content');

      const results = await scanner.findSummariesSinceTag(tag);

      expect(results).toHaveLength(1);
      expect(results[0].specName).toBe('060-spec');
    });

    it('should return empty when no summaries found', async () => {
      mockExecSync.mockReturnValueOnce('\n');

      const results = await scanner.findSummariesSinceTag(tag);

      expect(results).toHaveLength(0);
    });
  });

  describe('findSummariesSinceTag without tag (null)', () => {
    it('should use glob scan when tag is null', async () => {
      mockExecSync.mockReturnValueOnce('docs/specs/061-tokens/task-1-summary.md\n');
      mockFs.readFileSync.mockReturnValueOnce('# Task 1');

      const results = await scanner.findSummariesSinceTag(null);

      expect(results).toHaveLength(1);
      expect(results[0].specName).toBe('061-tokens');
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('find docs/specs'),
        expect.anything(),
      );
    });

    it('should return empty when glob finds nothing', async () => {
      mockExecSync.mockReturnValueOnce('');

      const results = await scanner.findSummariesSinceTag(null);

      expect(results).toHaveLength(0);
    });
  });

  describe('path parsing', () => {
    it('should extract specName and taskNumber from path', async () => {
      mockExecSync.mockReturnValueOnce('docs/specs/065-release-system-rebuild/task-3-summary.md\n');
      mockFs.readFileSync.mockReturnValueOnce('# Content');

      const results = await scanner.findSummariesSinceTag(null);

      expect(results[0].specName).toBe('065-release-system-rebuild');
      expect(results[0].taskNumber).toBe(3);
    });

    it('should handle double-digit task numbers', async () => {
      mockExecSync.mockReturnValueOnce('docs/specs/050-spec/task-12-summary.md\n');
      mockFs.readFileSync.mockReturnValueOnce('# Content');

      const results = await scanner.findSummariesSinceTag(null);

      expect(results[0].taskNumber).toBe(12);
    });

    it('should skip files that fail to read', async () => {
      mockExecSync.mockReturnValueOnce(
        'docs/specs/060-spec/task-1-summary.md\ndocs/specs/061-spec/task-2-summary.md\n',
      );
      mockFs.readFileSync
        .mockImplementationOnce(() => { throw new Error('ENOENT'); })
        .mockReturnValueOnce('# Content');

      const results = await scanner.findSummariesSinceTag(null);

      expect(results).toHaveLength(1);
      expect(results[0].taskNumber).toBe(2);
    });

    it('should skip files with unparseable paths', async () => {
      mockExecSync.mockReturnValueOnce('some/random/file.md\n');

      const results = await scanner.findSummariesSinceTag(null);

      expect(results).toHaveLength(0);
    });
  });
});
