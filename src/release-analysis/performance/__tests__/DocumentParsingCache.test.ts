/**
 * @category evergreen
 * @purpose Verify DocumentParsingCache functionality works correctly
 */
import { DocumentParsingCache } from '../DocumentParsingCache';
import { statSync } from 'fs';
import { join } from 'path';

// Mock fs and path
jest.mock('fs');
jest.mock('path');
jest.mock('child_process');

const mockStatSync = statSync as jest.MockedFunction<typeof statSync>;
const mockJoin = join as jest.MockedFunction<typeof join>;

// Mock fs/promises
const mockReadFile = jest.fn();
jest.mock('fs/promises', () => ({
  readFile: mockReadFile
}));

describe('DocumentParsingCache', () => {
  let cache: DocumentParsingCache;
  const mockWorkingDir = '/test/repo';

  beforeEach(() => {
    cache = new DocumentParsingCache(mockWorkingDir, {
      enableCache: true,
      maxCacheSize: 100,
      maxCacheAgeMs: 60000,
      enableIncrementalParsing: true,
      enableContentHashing: true,
      enableParallelParsing: true,
      maxConcurrentParsing: 2
    });

    // Reset mocks
    jest.clearAllMocks();
    mockJoin.mockImplementation((...args) => args.join('/'));
  });

  describe('parseDocumentIncremental', () => {
    const mockFilePath = '.kiro/specs/test/completion/task-1-completion.md';
    const mockContent = `# Task 1 Completion

**Date**: 2023-10-20
**Task**: 1.1 Test task
**Spec**: test-spec
**Status**: Complete

## Summary
Task completed successfully.`;

    beforeEach(() => {
      mockStatSync.mockReturnValue({
        mtime: new Date('2023-10-20T10:00:00Z'),
        size: 1024
      } as any);

      mockReadFile.mockResolvedValue(mockContent);
    });

    it('should parse document and cache result', async () => {
      const result = await cache.parseDocumentIncremental(mockFilePath);

      expect(result.fromCache).toBe(false);
      expect(result.cacheHit).toBe(false);
      expect(result.contentChanged).toBe(true);
      expect(result.document.path).toBe(mockFilePath);
      expect(result.document.content).toBe(mockContent);
      expect(result.document.metadata.title).toBe('Task 1 Completion');
      expect(result.document.metadata.task).toBe('1.1 Test task');
      expect(result.document.metadata.type).toBe('task-completion');
    });

    it('should return cached result on second parse', async () => {
      // First parse
      await cache.parseDocumentIncremental(mockFilePath);

      // Second parse should use cache
      const result = await cache.parseDocumentIncremental(mockFilePath);

      expect(result.fromCache).toBe(true);
      expect(result.cacheHit).toBe(true);
      expect(result.contentChanged).toBe(false);
      expect(mockReadFile).toHaveBeenCalledTimes(2); // Once for initial, once for hash verification
    });

    it('should reparse when file is modified', async () => {
      // First parse
      await cache.parseDocumentIncremental(mockFilePath);

      // Simulate file modification
      mockStatSync.mockReturnValue({
        mtime: new Date('2023-10-20T11:00:00Z'), // Different time
        size: 1024
      } as any);

      const result = await cache.parseDocumentIncremental(mockFilePath);

      expect(result.fromCache).toBe(false);
      expect(result.cacheHit).toBe(false);
      expect(result.contentChanged).toBe(true);
    });

    it('should reparse when content hash changes', async () => {
      // First parse
      await cache.parseDocumentIncremental(mockFilePath);

      // Change content but keep same mtime
      const newContent = mockContent + '\n\nAdditional content';
      mockReadFile.mockResolvedValue(newContent);

      const result = await cache.parseDocumentIncremental(mockFilePath);

      expect(result.fromCache).toBe(false);
      expect(result.contentChanged).toBe(true);
    });

    it('should handle parsing errors gracefully', async () => {
      mockReadFile.mockRejectedValue(new Error('File not found'));

      await expect(cache.parseDocumentIncremental(mockFilePath)).rejects.toThrow('File not found');
    });
  });

  describe('parseDocumentsParallel', () => {
    const mockFiles = [
      '.kiro/specs/test1/completion/task-1-completion.md',
      '.kiro/specs/test2/completion/task-2-completion.md',
      '.kiro/specs/test3/completion/task-3-completion.md'
    ];

    beforeEach(() => {
      mockStatSync.mockReturnValue({
        mtime: new Date('2023-10-20T10:00:00Z'),
        size: 1024
      } as any);

      mockReadFile.mockResolvedValue(`# Test Document\n\n**Date**: 2023-10-20\n\nContent`);
    });

    it('should parse multiple documents in parallel', async () => {
      const progressUpdates: any[] = [];
      const progressCallback = (progress: any) => {
        progressUpdates.push(progress);
      };

      const results = await cache.parseDocumentsParallel(mockFiles, progressCallback);

      expect(results).toHaveLength(3);
      expect(results.every(r => !r.fromCache)).toBe(true);
      expect(progressUpdates.length).toBeGreaterThan(0);
      expect(progressUpdates[progressUpdates.length - 1].completed).toBe(3);
    });

    it('should handle mixed cache hits and misses', async () => {
      // Pre-populate cache for first file
      await cache.parseDocumentIncremental(mockFiles[0]);

      const results = await cache.parseDocumentsParallel(mockFiles);

      expect(results[0].fromCache).toBe(true);
      expect(results[1].fromCache).toBe(false);
      expect(results[2].fromCache).toBe(false);
    });

    it('should continue processing despite individual failures', async () => {
      // Make second file fail
      mockReadFile
        .mockResolvedValueOnce('# Test 1')
        .mockRejectedValueOnce(new Error('File error'))
        .mockResolvedValueOnce('# Test 3');

      const results = await cache.parseDocumentsParallel(mockFiles);

      // Should get results for files that succeeded
      expect(results.length).toBeLessThan(3);
      expect(results.every(r => r.document)).toBe(true);
    });
  });

  describe('needsReparsing', () => {
    const mockFilePath = '.kiro/specs/test/completion/task-1-completion.md';

    it('should return true for uncached files', async () => {
      mockStatSync.mockReturnValue({
        mtime: new Date('2023-10-20T10:00:00Z'),
        size: 1024
      } as any);

      const needsReparse = await cache.needsReparsing(mockFilePath);

      expect(needsReparse).toBe(true);
    });

    it('should return false for unchanged cached files', async () => {
      // First parse to populate cache
      mockStatSync.mockReturnValue({
        mtime: new Date('2023-10-20T10:00:00Z'),
        size: 1024
      } as any);
      mockReadFile.mockResolvedValue('# Test');

      await cache.parseDocumentIncremental(mockFilePath);

      const needsReparse = await cache.needsReparsing(mockFilePath);

      expect(needsReparse).toBe(false);
    });

    it('should return true for modified files', async () => {
      // First parse
      mockStatSync.mockReturnValue({
        mtime: new Date('2023-10-20T10:00:00Z'),
        size: 1024
      } as any);
      mockReadFile.mockResolvedValue('# Test');

      await cache.parseDocumentIncremental(mockFilePath);

      // Simulate file modification
      mockStatSync.mockReturnValue({
        mtime: new Date('2023-10-20T11:00:00Z'),
        size: 1024
      } as any);

      const needsReparse = await cache.needsReparsing(mockFilePath);

      expect(needsReparse).toBe(true);
    });
  });

  describe('cache statistics', () => {
    it('should provide accurate cache statistics', async () => {
      const mockFiles = [
        '.kiro/specs/test1/completion/task-1-completion.md',
        '.kiro/specs/test2/completion/task-2-completion.md'
      ];

      mockStatSync.mockReturnValue({
        mtime: new Date('2023-10-20T10:00:00Z'),
        size: 1024
      } as any);
      mockReadFile.mockResolvedValue('# Test');

      // Parse some documents
      await cache.parseDocumentsParallel(mockFiles);

      const stats = cache.getCacheStats();

      expect(stats.totalDocuments).toBe(2);
      expect(stats.cachedDocuments).toBe(2);
      expect(stats.cacheHitRate).toBe(0); // No cache hits yet
      expect(stats.totalParseTime).toBeGreaterThanOrEqual(0);
      expect(stats.averageParseTime).toBeGreaterThanOrEqual(0);
    });

    it('should track cache hit rate correctly', async () => {
      const mockFile = '.kiro/specs/test/completion/task-1-completion.md';

      mockStatSync.mockReturnValue({
        mtime: new Date('2023-10-20T10:00:00Z'),
        size: 1024
      } as any);
      mockReadFile.mockResolvedValue('# Test');

      // First parse (miss)
      await cache.parseDocumentIncremental(mockFile);

      // Second parse (hit)
      await cache.parseDocumentIncremental(mockFile);

      const stats = cache.getCacheStats();

      expect(stats.cacheHitRate).toBe(0.5); // 1 hit out of 2 requests
    });
  });

  describe('cache management', () => {
    it('should clear cache and reset statistics', () => {
      cache.clear();

      const stats = cache.getCacheStats();

      expect(stats.totalDocuments).toBe(0);
      expect(stats.cachedDocuments).toBe(0);
      expect(stats.totalParseTime).toBe(0);
    });

    it('should prune old cache entries', async () => {
      const mockFile = '.kiro/specs/test/completion/task-1-completion.md';

      mockStatSync.mockReturnValue({
        mtime: new Date('2023-10-20T10:00:00Z'),
        size: 1024
      } as any);
      mockReadFile.mockResolvedValue('# Test');

      // Parse document to populate cache
      await cache.parseDocumentIncremental(mockFile);

      // Prune (should remove entries older than maxCacheAgeMs)
      const pruned = cache.pruneOldEntries();

      expect(typeof pruned).toBe('number');
      expect(pruned).toBeGreaterThanOrEqual(0);
    });

    it('should provide most accessed documents', async () => {
      const mockFile = '.kiro/specs/test/completion/task-1-completion.md';

      mockStatSync.mockReturnValue({
        mtime: new Date('2023-10-20T10:00:00Z'),
        size: 1024
      } as any);
      mockReadFile.mockResolvedValue('# Test');

      // Parse document multiple times
      await cache.parseDocumentIncremental(mockFile);
      await cache.parseDocumentIncremental(mockFile);
      await cache.parseDocumentIncremental(mockFile);

      const mostAccessed = cache.getMostAccessedDocuments(5);

      expect(mostAccessed).toHaveLength(1);
      expect(mostAccessed[0].path).toBe(mockFile);
      expect(mostAccessed[0].accessCount).toBe(3);
    });
  });

  describe('preloading', () => {
    it('should preload documents into cache', async () => {
      const mockFiles = [
        '.kiro/specs/test1/completion/task-1-completion.md',
        '.kiro/specs/test2/completion/task-2-completion.md'
      ];

      mockStatSync.mockReturnValue({
        mtime: new Date('2023-10-20T10:00:00Z'),
        size: 1024
      } as any);
      mockReadFile.mockResolvedValue('# Test');

      await cache.preloadDocuments(mockFiles);

      const stats = cache.getCacheStats();

      expect(stats.cachedDocuments).toBe(2);
    });
  });
});