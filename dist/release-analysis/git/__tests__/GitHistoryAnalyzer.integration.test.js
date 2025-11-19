"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GitHistoryAnalyzer_1 = require("../GitHistoryAnalyzer");
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
const os_1 = require("os");
describe('GitHistoryAnalyzer Integration Tests', () => {
    let tempDir;
    let analyzer;
    beforeEach(() => {
        // Create temporary directory for Git repository
        tempDir = (0, fs_1.mkdtempSync)((0, path_1.join)((0, os_1.tmpdir)(), 'git-analyzer-test-'));
        analyzer = new GitHistoryAnalyzer_1.GitHistoryAnalyzer(tempDir);
        // Initialize Git repository
        (0, child_process_1.execSync)('git init', { cwd: tempDir });
        (0, child_process_1.execSync)('git config user.name "Test User"', { cwd: tempDir });
        (0, child_process_1.execSync)('git config user.email "test@example.com"', { cwd: tempDir });
    });
    afterEach(() => {
        // Clean up temporary directory
        (0, fs_1.rmSync)(tempDir, { recursive: true, force: true });
    });
    describe('Real Git Operations', () => {
        it('should work with actual Git repository', async () => {
            // Create initial commit
            (0, fs_1.writeFileSync)((0, path_1.join)(tempDir, 'README.md'), '# Test Repository');
            (0, child_process_1.execSync)('git add README.md', { cwd: tempDir });
            (0, child_process_1.execSync)('git commit -m "Initial commit"', { cwd: tempDir });
            // Create and tag a release
            (0, child_process_1.execSync)('git tag v1.0.0', { cwd: tempDir });
            // Add completion document
            const completionDir = (0, path_1.join)(tempDir, '.kiro', 'specs', 'test-feature', 'completion');
            (0, child_process_1.execSync)(`mkdir -p "${completionDir}"`, { cwd: tempDir });
            const completionContent = `# Task 1 Completion

**Date**: 2025-01-15
**Task**: 1.1 Implement test feature
**Spec**: F1 - Test Feature
**Status**: Complete

## Summary
Test task completed successfully.`;
            (0, fs_1.writeFileSync)((0, path_1.join)(completionDir, 'task-1-completion.md'), completionContent);
            (0, child_process_1.execSync)('git add .', { cwd: tempDir });
            (0, child_process_1.execSync)('git commit -m "Add task completion"', { cwd: tempDir });
            // Test finding last release
            const lastRelease = await analyzer.findLastRelease();
            expect(lastRelease).not.toBeNull();
            expect(lastRelease?.name).toBe('v1.0.0');
            // Test getting changes since release
            const changes = await analyzer.getChangesSince('v1.0.0');
            expect(changes.commits).toHaveLength(1);
            expect(changes.commits[0].message).toBe('Add task completion');
            expect(changes.addedFiles).toContain('.kiro/specs/test-feature/completion/task-1-completion.md');
            // Test finding completion documents
            const completionDocs = await analyzer.findCompletionDocuments(changes);
            expect(completionDocs).toHaveLength(1);
            expect(completionDocs[0].path).toBe('.kiro/specs/test-feature/completion/task-1-completion.md');
            expect(completionDocs[0].metadata.task).toBe('1.1 Implement test feature');
            expect(completionDocs[0].metadata.type).toBe('task-completion');
        });
        it('should handle repository with no releases', async () => {
            // Create initial commit without tags
            (0, fs_1.writeFileSync)((0, path_1.join)(tempDir, 'README.md'), '# Test Repository');
            (0, child_process_1.execSync)('git add README.md', { cwd: tempDir });
            (0, child_process_1.execSync)('git commit -m "Initial commit"', { cwd: tempDir });
            const lastRelease = await analyzer.findLastRelease();
            expect(lastRelease).toBeNull();
        });
        it('should validate analysis scope with real Git data', async () => {
            // Create commits and tags
            (0, fs_1.writeFileSync)((0, path_1.join)(tempDir, 'README.md'), '# Test Repository');
            (0, child_process_1.execSync)('git add README.md', { cwd: tempDir });
            (0, child_process_1.execSync)('git commit -m "Initial commit"', { cwd: tempDir });
            const initialCommit = (0, child_process_1.execSync)('git rev-parse HEAD', { cwd: tempDir, encoding: 'utf-8' }).trim();
            (0, child_process_1.execSync)('git tag v1.0.0', { cwd: tempDir });
            // Add another commit
            (0, fs_1.writeFileSync)((0, path_1.join)(tempDir, 'feature.txt'), 'New feature');
            (0, child_process_1.execSync)('git add feature.txt', { cwd: tempDir });
            (0, child_process_1.execSync)('git commit -m "Add feature"', { cwd: tempDir });
            const headCommit = (0, child_process_1.execSync)('git rev-parse HEAD', { cwd: tempDir, encoding: 'utf-8' }).trim();
            // Test scope validation
            const scope = {
                fromTag: 'v1.0.0',
                fromCommit: initialCommit,
                toCommit: headCommit,
                completionDocuments: [],
                analysisDate: new Date()
            };
            const validation = analyzer.validateAnalysisScope(scope);
            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });
        it('should handle non-semantic version tags correctly', async () => {
            // Create initial commit
            (0, fs_1.writeFileSync)((0, path_1.join)(tempDir, 'README.md'), '# Test Repository');
            (0, child_process_1.execSync)('git add README.md', { cwd: tempDir });
            (0, child_process_1.execSync)('git commit -m "Initial commit"', { cwd: tempDir });
            // Create non-semantic tags
            (0, child_process_1.execSync)('git tag feature-branch', { cwd: tempDir });
            (0, child_process_1.execSync)('git tag some-other-tag', { cwd: tempDir });
            // Create semantic version tag
            (0, child_process_1.execSync)('git tag v1.0.0', { cwd: tempDir });
            const lastRelease = await analyzer.findLastRelease();
            expect(lastRelease?.name).toBe('v1.0.0');
        });
    });
    describe('Error Handling', () => {
        it('should handle non-Git directory gracefully', async () => {
            const nonGitAnalyzer = new GitHistoryAnalyzer_1.GitHistoryAnalyzer('/tmp');
            const lastRelease = await nonGitAnalyzer.findLastRelease();
            // Graceful error handling returns an object with confidence reduction instead of null
            expect(lastRelease).toBeDefined();
            expect(lastRelease).toHaveProperty('confidenceReduction');
        });
        it('should handle invalid commit references', async () => {
            // Create Git repository
            (0, fs_1.writeFileSync)((0, path_1.join)(tempDir, 'README.md'), '# Test Repository');
            (0, child_process_1.execSync)('git add README.md', { cwd: tempDir });
            (0, child_process_1.execSync)('git commit -m "Initial commit"', { cwd: tempDir });
            const result = await analyzer.getChangesSince('invalid-commit');
            expect(result.commits).toEqual([]);
        });
    });
});
//# sourceMappingURL=GitHistoryAnalyzer.integration.test.js.map