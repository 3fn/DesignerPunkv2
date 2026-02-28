/**
 * @category evergreen
 * @purpose Verify TagResolver resolves git tags correctly
 */

import { TagResolver } from '../pipeline/TagResolver';
import { execSync } from 'child_process';

jest.mock('child_process');
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;

describe('TagResolver', () => {
  let resolver: TagResolver;

  beforeEach(() => {
    jest.clearAllMocks();
    resolver = new TagResolver('/test/repo');
  });

  describe('getLatestTag', () => {
    it('should return tag info when tags exist', async () => {
      mockExecSync
        .mockReturnValueOnce('v7.0.0\n')
        .mockReturnValueOnce('abc123def\n')
        .mockReturnValueOnce('2026-02-23T12:00:00-05:00\n');

      const result = await resolver.getLatestTag();

      expect(result).toEqual({
        tag: 'v7.0.0',
        commit: 'abc123def',
        date: '2026-02-23T12:00:00-05:00',
      });
      expect(mockExecSync).toHaveBeenCalledWith(
        'git describe --tags --abbrev=0',
        expect.objectContaining({ cwd: '/test/repo' }),
      );
    });

    it('should return null when no tags exist', async () => {
      mockExecSync.mockImplementationOnce(() => { throw new Error('fatal: No names found'); });

      const result = await resolver.getLatestTag();

      expect(result).toBeNull();
    });

    it('should return null when git is not available', async () => {
      mockExecSync.mockImplementationOnce(() => { throw new Error('command not found: git'); });

      const result = await resolver.getLatestTag();

      expect(result).toBeNull();
    });
  });

  describe('createTag', () => {
    it('should create annotated tag with v prefix', async () => {
      mockExecSync.mockReturnValueOnce('');

      await resolver.createTag('8.0.0', 'Release v8.0.0');

      expect(mockExecSync).toHaveBeenCalledWith(
        'git tag -a v8.0.0 -m "Release v8.0.0"',
        expect.objectContaining({ cwd: '/test/repo' }),
      );
    });

    it('should not double-prefix v', async () => {
      mockExecSync.mockReturnValueOnce('');

      await resolver.createTag('v8.0.0', 'Release v8.0.0');

      expect(mockExecSync).toHaveBeenCalledWith(
        'git tag -a v8.0.0 -m "Release v8.0.0"',
        expect.objectContaining({ cwd: '/test/repo' }),
      );
    });

    it('should escape quotes in message', async () => {
      mockExecSync.mockReturnValueOnce('');

      await resolver.createTag('8.0.0', 'Release with "quotes"');

      expect(mockExecSync).toHaveBeenCalledWith(
        'git tag -a v8.0.0 -m "Release with \\"quotes\\""',
        expect.objectContaining({ cwd: '/test/repo' }),
      );
    });
  });
});
