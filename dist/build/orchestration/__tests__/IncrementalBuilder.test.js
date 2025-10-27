"use strict";
/**
 * Incremental Builder Tests
 *
 * Tests for incremental build support including change detection,
 * caching, and selective rebuilding.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const IncrementalBuilder_1 = require("../IncrementalBuilder");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
describe('IncrementalBuilder', () => {
    let tempDir;
    let sourceDir;
    let tokenDir;
    let cacheDir;
    let builder;
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
        builder = new IncrementalBuilder_1.IncrementalBuilder({
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
            builder = new IncrementalBuilder_1.IncrementalBuilder({
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
                platform: 'web',
                success: true,
                packagePath: '/dist/web',
                duration: 1000,
                warnings: [],
                errors: [],
            });
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
                platform: 'web',
                success: true,
                packagePath: artifactPath,
                duration: 1000,
                warnings: [],
                errors: [],
            });
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
                platform: 'web',
                success: true,
                packagePath: '/dist/web',
                duration: 1000,
                warnings: [],
                errors: [],
            });
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
                platform: 'web',
                success: true,
                packagePath: '/dist/web',
                duration: 1000,
                warnings: [],
                errors: [],
            });
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
                platform: 'web',
                success: true,
                packagePath: '/dist/web',
                duration: 1000,
                warnings: [],
                errors: [],
            });
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
                platform: 'web',
                success: true,
                packagePath: '/dist/web',
                duration: 1000,
                warnings: [],
                errors: [],
            });
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
                platform: 'web',
                success: true,
                packagePath: '/dist/web',
                duration: 1000,
                warnings: [],
                errors: [],
            });
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
//# sourceMappingURL=IncrementalBuilder.test.js.map