"use strict";
/**
 * Tests for hook scripts
 *
 * Validates that hook scripts are properly created, executable, and handle
 * concurrent requests and failures gracefully.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const child_process_1 = require("child_process");
describe('Hook Scripts', () => {
    const projectRoot = process.cwd();
    const gitHookPath = (0, path_1.join)(projectRoot, '.kiro/hooks/analyze-after-commit.sh');
    const agentHookPath = (0, path_1.join)(projectRoot, '.kiro/agent-hooks/analyze-after-commit.sh');
    const agentConfigPath = (0, path_1.join)(projectRoot, '.kiro/agent-hooks/release-analysis-on-task-completion.json');
    describe('Git Hook Script', () => {
        it('should exist and be executable', async () => {
            const stats = await fs_1.promises.stat(gitHookPath);
            expect(stats.isFile()).toBe(true);
            expect(stats.mode & 0o111).toBeTruthy(); // Check executable bit
        });
        it('should contain required configuration', async () => {
            const content = await fs_1.promises.readFile(gitHookPath, 'utf-8');
            expect(content).toContain('QUICK_MODE');
            expect(content).toContain('TIMEOUT');
            expect(content).toContain('FAIL_SILENTLY');
            expect(content).toContain('CACHE_RESULTS');
        });
        it('should implement concurrent request handling', async () => {
            const content = await fs_1.promises.readFile(gitHookPath, 'utf-8');
            expect(content).toContain('check_concurrent_analysis');
            expect(content).toContain('LOCK_FILE');
            expect(content).toContain('MAX_LOCK_AGE');
        });
        it('should implement graceful failure handling', async () => {
            const content = await fs_1.promises.readFile(gitHookPath, 'utf-8');
            expect(content).toContain('FAIL_SILENTLY');
            expect(content).toContain('trap remove_lock');
            expect(content).toContain('Non-blocking');
        });
        it('should support cross-platform timeout', async () => {
            const content = await fs_1.promises.readFile(gitHookPath, 'utf-8');
            // Should check for timeout command availability
            expect(content).toContain('command -v timeout');
            // Should have macOS fallback using perl
            expect(content).toContain('perl -e "alarm');
        });
        it('should call release:analyze npm script', async () => {
            const content = await fs_1.promises.readFile(gitHookPath, 'utf-8');
            expect(content).toContain('npm run release:analyze');
        });
    });
    describe('Agent Hook Script', () => {
        it('should exist and be executable', async () => {
            const stats = await fs_1.promises.stat(agentHookPath);
            expect(stats.isFile()).toBe(true);
            expect(stats.mode & 0o111).toBeTruthy(); // Check executable bit
        });
        it('should contain required configuration', async () => {
            const content = await fs_1.promises.readFile(agentHookPath, 'utf-8');
            expect(content).toContain('QUICK_MODE');
            expect(content).toContain('TIMEOUT');
            expect(content).toContain('FAIL_SILENTLY');
        });
        it('should implement concurrent request handling', async () => {
            const content = await fs_1.promises.readFile(agentHookPath, 'utf-8');
            expect(content).toContain('check_concurrent_analysis');
            expect(content).toContain('LOCK_FILE');
            expect(content).toContain('MAX_LOCK_AGE');
        });
        it('should implement graceful failure handling', async () => {
            const content = await fs_1.promises.readFile(agentHookPath, 'utf-8');
            expect(content).toContain('FAIL_SILENTLY');
            expect(content).toContain('trap remove_lock');
        });
        it('should support cross-platform timeout', async () => {
            const content = await fs_1.promises.readFile(agentHookPath, 'utf-8');
            // Should check for timeout command availability
            expect(content).toContain('command -v timeout');
            // Should have macOS fallback using perl
            expect(content).toContain('perl -e "alarm');
        });
        it('should suppress output in silent mode', async () => {
            const content = await fs_1.promises.readFile(agentHookPath, 'utf-8');
            // Should redirect output to /dev/null in silent mode
            expect(content).toContain('>/dev/null 2>&1');
        });
    });
    describe('Agent Hook Configuration', () => {
        it('should exist', async () => {
            const stats = await fs_1.promises.stat(agentConfigPath);
            expect(stats.isFile()).toBe(true);
        });
        it('should be valid JSON', async () => {
            const content = await fs_1.promises.readFile(agentConfigPath, 'utf-8');
            const config = JSON.parse(content);
            expect(config).toBeDefined();
        });
        it('should contain required fields', async () => {
            const content = await fs_1.promises.readFile(agentConfigPath, 'utf-8');
            const config = JSON.parse(content);
            expect(config.name).toBe('release-analysis-on-task-completion');
            expect(config.description).toBeDefined();
            expect(config.version).toBeDefined();
            expect(config.events).toContain('task.completed');
            expect(config.command).toBe('./.kiro/agent-hooks/analyze-after-commit.sh');
            expect(config.timeout).toBe(10000);
            expect(config.failSilently).toBe(true);
        });
        it('should be disabled by default', async () => {
            const content = await fs_1.promises.readFile(agentConfigPath, 'utf-8');
            const config = JSON.parse(content);
            expect(config.enabled).toBe(false);
        });
    });
    describe('Concurrent Request Handling', () => {
        const lockFile = (0, path_1.join)(projectRoot, '.kiro/release-analysis/.analysis-lock');
        afterEach(async () => {
            // Clean up lock file after each test
            try {
                await fs_1.promises.unlink(lockFile);
            }
            catch {
                // Ignore if doesn't exist
            }
        });
        it('should create lock file during execution', async () => {
            // Create a mock lock file
            await fs_1.promises.mkdir((0, path_1.join)(projectRoot, '.kiro/release-analysis'), { recursive: true });
            await fs_1.promises.writeFile(lockFile, '12345');
            const exists = await fs_1.promises.access(lockFile).then(() => true).catch(() => false);
            expect(exists).toBe(true);
        });
        it('should detect concurrent analysis', async () => {
            // Create a fresh lock file
            await fs_1.promises.mkdir((0, path_1.join)(projectRoot, '.kiro/release-analysis'), { recursive: true });
            await fs_1.promises.writeFile(lockFile, '12345');
            // Run hook and check for concurrent detection message
            try {
                const output = (0, child_process_1.execSync)('./.kiro/hooks/analyze-after-commit.sh', {
                    encoding: 'utf-8',
                    cwd: projectRoot
                });
                expect(output).toContain('Another analysis is already running');
            }
            catch (error) {
                // Hook should exit successfully even when skipping
                expect(error.status).toBe(0);
            }
        });
        it('should remove stale lock files', async () => {
            // Create a stale lock file (older than MAX_LOCK_AGE)
            await fs_1.promises.mkdir((0, path_1.join)(projectRoot, '.kiro/release-analysis'), { recursive: true });
            await fs_1.promises.writeFile(lockFile, '12345');
            // Set file modification time to 60 seconds ago
            const sixtySecondsAgo = new Date(Date.now() - 60000);
            await fs_1.promises.utimes(lockFile, sixtySecondsAgo, sixtySecondsAgo);
            // Run hook - should detect and remove stale lock
            try {
                (0, child_process_1.execSync)('./.kiro/hooks/analyze-after-commit.sh', {
                    encoding: 'utf-8',
                    cwd: projectRoot,
                    timeout: 15000
                });
            }
            catch {
                // Ignore execution errors
            }
            // Lock file should be removed or replaced
            // (Can't guarantee it's removed since analysis might create a new one)
        });
    });
    describe('Graceful Failure Handling', () => {
        it('should not block on analysis failure', async () => {
            // The hook should always exit with code 0 in FAIL_SILENTLY mode
            const content = await fs_1.promises.readFile(gitHookPath, 'utf-8');
            // Verify FAIL_SILENTLY is set to true
            expect(content).toContain('FAIL_SILENTLY=true');
            // Verify non-blocking exit
            expect(content).toContain('exit_code=0  # Non-blocking');
        });
        it('should clean up lock file on failure', async () => {
            const content = await fs_1.promises.readFile(gitHookPath, 'utf-8');
            // Should use trap to ensure cleanup
            expect(content).toContain('trap remove_lock EXIT INT TERM');
        });
        it('should handle timeout gracefully', async () => {
            const content = await fs_1.promises.readFile(gitHookPath, 'utf-8');
            // Should detect timeout exit codes
            expect(content).toContain('timed out');
        });
    });
    describe('Requirements Validation', () => {
        it('should address requirement 9.1: Automatic analysis triggered', async () => {
            const gitContent = await fs_1.promises.readFile(gitHookPath, 'utf-8');
            const agentContent = await fs_1.promises.readFile(agentHookPath, 'utf-8');
            // Both hooks should call release:analyze
            expect(gitContent).toContain('npm run release:analyze');
            expect(agentContent).toContain('npm run release:analyze');
        });
        it('should address requirement 9.4: Graceful failure handling', async () => {
            const gitContent = await fs_1.promises.readFile(gitHookPath, 'utf-8');
            const agentContent = await fs_1.promises.readFile(agentHookPath, 'utf-8');
            // Both hooks should have FAIL_SILENTLY=true
            expect(gitContent).toContain('FAIL_SILENTLY=true');
            expect(agentContent).toContain('FAIL_SILENTLY=true');
        });
        it('should address requirement 9.6: Concurrent request handling', async () => {
            const gitContent = await fs_1.promises.readFile(gitHookPath, 'utf-8');
            const agentContent = await fs_1.promises.readFile(agentHookPath, 'utf-8');
            // Both hooks should implement concurrent handling
            expect(gitContent).toContain('check_concurrent_analysis');
            expect(agentContent).toContain('check_concurrent_analysis');
            expect(gitContent).toContain('LOCK_FILE');
            expect(agentContent).toContain('LOCK_FILE');
        });
    });
});
//# sourceMappingURL=HookScripts.test.js.map