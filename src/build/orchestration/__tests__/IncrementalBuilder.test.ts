/**
 * Incremental Builder Tests
 * 
 * Tests for incremental build support including change detection,
 * caching, and selective rebuilding.
 */

import { IncrementalBuilder } from '../IncrementalBuilder';
import { Platform } from '../../types/Platform';
import { BuildResult } from '../../types/BuildResult';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('IncrementalBuilder', () => {
  let tempDir: string;
  let sourceDir: string;
  let tokenDir: string;
  let cacheDir: string;
  let builder: IncrementalBuilder;

  beforeEach(() => {
    // Create temporary directories for testing
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'incremental-test-'));
    sourceDir = path.join(tempDir, 'src');
    tokenDir = path.join(tempDir, 'tokens');
    cacheDir = path.join(tempDir, 'cache');

    fs.mkdirSync(sourceDir, { recursive: true });
    fs.mkdirSync(tokenDir, { recursive: true });
    fs.mkdirSync(cacheDir, { recursive: true });

    // Initialize builder
    builder = new IncrementalBuilder({
      cacheDir,
      sourceDirs: [sourceDir],
      tokenDirs: [tokenDir],
      validateCache: true,
    });
  });

  afterEach(() => {
    // Clean up temporary directories
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  describe('detectChanges', () => {
    it('should detect new files', () => {
      // Create a new file
      const testFile = path.join(sourceDir, 'test.ts');
      fs.writeFileSync(testFile, 'export const test = true;');

      const changes = builder.detectChanges('web');

      expect(changes).toHaveLength(1);
      expect(changes[0].type).toBe('added');
      expect(changes[0].path).toBe(testFile);
    });

    it('should detect modified files', () => {
      // Create initial file
      const testFile = path.join(sourceDir, 'test.ts');
      fs.writeFileSync(testFile, 'export const test = true;');

      // First detection to establish baseline
      builder.detectChanges('web');

      // Modify file
      fs.writeFileSync(testFile, 'export const test = false;');

      const changes = builder.detectChanges('web');

      expect(changes).toHaveLength(1);
      expect(changes[0].type).toBe('modified');
      expect(changes[0].path).toBe(testFile);
    });

    it('should detect deleted files', () => {
      // Create and detect file
      const testFile = path.join(sourceDir, 'test.ts');
      fs.writeFileSync(testFile, 'export const test = true;');
      builder.detectChanges('web');

      // Delete file
      fs.unlinkSync(testFile);

      const changes = builder.detectChanges('web');

      expect(changes).toHaveLength(1);
      expect(changes[0].type).toBe('deleted');
      expect(changes[0].path).toBe(testFile);
    });

    it('should return empty array when no changes', () => {
      // Create file and detect
      const testFile = path.join(sourceDir, 'test.ts');
      fs.writeFileSync(testFile, 'export const test = true;');
      builder.detectChanges('web');

      // Detect again without changes
      const changes = builder.detectChanges('web');

      expect(changes).toHaveLength(0);
    });
  });

  describe('tokensChanged', () => {
    it('should detect token file changes', () => {
      // Create initial token file BEFORE builder initialization
      const tokenFile = path.join(tokenDir, 'tokens.json');
      fs.writeFileSync(tokenFile, JSON.stringify({ space100: 8 }));

      // Reinitialize builder to capture initial state
      builder = new IncrementalBuilder({
        cacheDir,
        sourceDirs: [sourceDir],
        tokenDirs: [tokenDir],
        validateCache: true,
      });

      // First check should return false (no changes yet)
      expect(builder.tokensChanged()).toBe(false);

      // Modify token file
      fs.writeFileSync(tokenFile, JSON.stringify({ space100: 12 }));

      expect(builder.tokensChanged()).toBe(true);
    });

    it('should return false when tokens unchanged', () => {
      // Create token file
      const tokenFile = path.join(tokenDir, 'tokens.json');
      fs.writeFileSync(tokenFile, JSON.stringify({ space100: 8 }));

      // Check twice without changes
      builder.tokensChanged();
      expect(builder.tokensChanged()).toBe(false);
    });
  });

  describe('buildIncremental', () => {
    it('should perform fresh build on first run', async () => {
      const mockBuildFn = jest.fn().mockResolvedValue({
        platform: 'web' as Platform,
        success: true,
        packagePath: '/dist/web',
        duration: 1000,
        warnings: [],
        errors: [],
      } as BuildResult);

      const result = await builder.buildIncremental('web', mockBuildFn);

      expect(result.cacheHit).toBe(false);
      expect(result.result.success).toBe(true);
      expect(mockBuildFn).toHaveBeenCalledTimes(1);
    });

    it('should use cache when no changes detected', async () => {
      // Create a real artifact file for cache validation
      const artifactPath = path.join(tempDir, 'web-package.js');
      fs.writeFileSync(artifactPath, '// web package');

      const mockBuildFn = jest.fn().mockResolvedValue({
        platform: 'web' as Platform,
        success: true,
        packagePath: artifactPath,
        duration: 1000,
        warnings: [],
        errors: [],
      } as BuildResult);

      // First build
      const firstResult = await builder.buildIncremental('web', mockBuildFn);
      expect(firstResult.cacheHit).toBe(false);

      // Second build without any file changes
      const result = await builder.buildIncremental('web', mockBuildFn);

      expect(result.cacheHit).toBe(true);
      expect(mockBuildFn).toHaveBeenCalledTimes(1); // Only called once
    });

    it('should rebuild when source files change', async () => {
      const mockBuildFn = jest.fn().mockResolvedValue({
        platform: 'web' as Platform,
        success: true,
        packagePath: '/dist/web',
        duration: 1000,
        warnings: [],
        errors: [],
      } as BuildResult);

      // First build
      await builder.buildIncremental('web', mockBuildFn);

      // Modify source file
      const testFile = path.join(sourceDir, 'test.ts');
      fs.writeFileSync(testFile, 'export const test = true;');

      // Second build with changes
      const result = await builder.buildIncremental('web', mockBuildFn);

      expect(result.cacheHit).toBe(false);
      expect(result.changedFiles.length).toBeGreaterThan(0);
      expect(mockBuildFn).toHaveBeenCalledTimes(2);
    });

    it('should rebuild when tokens change', async () => {
      const mockBuildFn = jest.fn().mockResolvedValue({
        platform: 'web' as Platform,
        success: true,
        packagePath: '/dist/web',
        duration: 1000,
        warnings: [],
        errors: [],
      } as BuildResult);

      // Create initial token file
      const tokenFile = path.join(tokenDir, 'tokens.json');
      fs.writeFileSync(tokenFile, JSON.stringify({ space100: 8 }));

      // First build
      await builder.buildIncremental('web', mockBuildFn);

      // Modify token file
      fs.writeFileSync(tokenFile, JSON.stringify({ space100: 12 }));

      // Second build with token changes
      const result = await builder.buildIncremental('web', mockBuildFn);

      expect(result.cacheHit).toBe(false);
      expect(result.tokensRegenerated).toBe(true);
      expect(mockBuildFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('regenerateTokensIfNeeded', () => {
    it('should regenerate tokens when changed', async () => {
      const mockRegenerateFn = jest.fn().mockResolvedValue(undefined);

      // Create and modify token file
      const tokenFile = path.join(tokenDir, 'tokens.json');
      fs.writeFileSync(tokenFile, JSON.stringify({ space100: 8 }));
      builder.tokensChanged(); // Establish baseline
      fs.writeFileSync(tokenFile, JSON.stringify({ space100: 12 }));

      const regenerated = await builder.regenerateTokensIfNeeded(mockRegenerateFn);

      expect(regenerated).toBe(true);
      expect(mockRegenerateFn).toHaveBeenCalledTimes(1);
    });

    it('should skip regeneration when tokens unchanged', async () => {
      const mockRegenerateFn = jest.fn().mockResolvedValue(undefined);

      // Create token file
      const tokenFile = path.join(tokenDir, 'tokens.json');
      fs.writeFileSync(tokenFile, JSON.stringify({ space100: 8 }));
      builder.tokensChanged(); // Establish baseline

      const regenerated = await builder.regenerateTokensIfNeeded(mockRegenerateFn);

      expect(regenerated).toBe(false);
      expect(mockRegenerateFn).not.toHaveBeenCalled();
    });
  });

  describe('clearCache', () => {
    it('should clear cache for specific platform', async () => {
      const mockBuildFn = jest.fn().mockResolvedValue({
        platform: 'web' as Platform,
        success: true,
        packagePath: '/dist/web',
        duration: 1000,
        warnings: [],
        errors: [],
      } as BuildResult);

      // Build and cache
      await builder.buildIncremental('web', mockBuildFn);

      // Clear cache
      builder.clearCache('web');

      // Build again - should not use cache
      const result = await builder.buildIncremental('web', mockBuildFn);

      expect(result.cacheHit).toBe(false);
      expect(mockBuildFn).toHaveBeenCalledTimes(2);
    });

    it('should clear all cache when no platform specified', async () => {
      const mockBuildFn = jest.fn().mockResolvedValue({
        platform: 'web' as Platform,
        success: true,
        packagePath: '/dist/web',
        duration: 1000,
        warnings: [],
        errors: [],
      } as BuildResult);

      // Build and cache
      await builder.buildIncremental('web', mockBuildFn);

      // Clear all cache
      builder.clearCache();

      // Build again - should not use cache
      const result = await builder.buildIncremental('web', mockBuildFn);

      expect(result.cacheHit).toBe(false);
      expect(mockBuildFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', async () => {
      const mockBuildFn = jest.fn().mockResolvedValue({
        platform: 'web' as Platform,
        success: true,
        packagePath: '/dist/web',
        duration: 1000,
        warnings: [],
        errors: [],
      } as BuildResult);

      // Build to populate cache
      await builder.buildIncremental('web', mockBuildFn);

      const stats = builder.getCacheStats();

      expect(stats.totalEntries).toBe(1);
      expect(stats.platforms).toContain('web');
      expect(stats.oldestEntry).toBeInstanceOf(Date);
      expect(stats.newestEntry).toBeInstanceOf(Date);
    });

    it('should return empty stats when cache is empty', () => {
      const stats = builder.getCacheStats();

      expect(stats.totalEntries).toBe(0);
      expect(stats.platforms).toHaveLength(0);
      expect(stats.oldestEntry).toBeNull();
      expect(stats.newestEntry).toBeNull();
    });
  });
});
