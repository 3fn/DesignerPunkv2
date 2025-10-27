"use strict";
/**
 * Hook Integration Manager for Release Analysis System
 *
 * Manages automatic triggering of release analysis via Git hooks or Kiro agent hooks.
 * Provides quick feedback for AI agents after task completion commits.
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
exports.HookIntegrationManager = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class HookIntegrationManager {
    constructor(config, hookConfig, projectRoot = process.cwd()) {
        this.config = config;
        this.hookConfig = hookConfig;
        this.projectRoot = projectRoot;
    }
    /**
     * Install Git post-commit hook for automatic analysis
     */
    async installGitHook() {
        const messages = [];
        const hookPath = (0, path_1.join)(this.projectRoot, '.kiro/hooks/analyze-after-commit.sh');
        try {
            // Check if hooks directory exists
            const hooksDir = (0, path_1.join)(this.projectRoot, '.kiro/hooks');
            await this.ensureDirectoryExists(hooksDir);
            // Check if hook already exists
            if (await this.fileExists(hookPath)) {
                messages.push('Hook file already exists, will be overwritten');
            }
            // Create hook script
            const hookScript = this.generateGitHookScript();
            await fs_1.promises.writeFile(hookPath, hookScript, { mode: 0o755 });
            // Verify hook is executable
            const stats = await fs_1.promises.stat(hookPath);
            if (!(stats.mode & 0o111)) {
                await fs_1.promises.chmod(hookPath, 0o755);
                messages.push('Made hook executable');
            }
            // Integrate with existing commit hook if present
            await this.integrateWithCommitHook(hookPath);
            messages.push('Git hook installed successfully');
            return {
                success: true,
                hookType: 'git',
                hookPath,
                messages
            };
        }
        catch (error) {
            return {
                success: false,
                hookType: 'git',
                hookPath,
                messages: [
                    ...messages,
                    `Installation failed: ${error instanceof Error ? error.message : String(error)}`
                ]
            };
        }
    }
    /**
     * Install Kiro agent hook for automatic analysis
     */
    async installAgentHook() {
        const messages = [];
        const hookPath = (0, path_1.join)(this.projectRoot, '.kiro/agent-hooks/analyze-after-commit.sh');
        const configPath = (0, path_1.join)(this.projectRoot, '.kiro/agent-hooks/release-analysis-on-task-completion.json');
        try {
            // Check if agent-hooks directory exists
            const agentHooksDir = (0, path_1.join)(this.projectRoot, '.kiro/agent-hooks');
            await this.ensureDirectoryExists(agentHooksDir);
            // Check if hook already exists
            if (await this.fileExists(hookPath)) {
                messages.push('Hook script already exists, will be overwritten');
            }
            // Create hook script
            const hookScript = this.generateAgentHookScript();
            await fs_1.promises.writeFile(hookPath, hookScript, { mode: 0o755 });
            // Create hook configuration
            const hookConfig = this.generateAgentHookConfig();
            await fs_1.promises.writeFile(configPath, JSON.stringify(hookConfig, null, 2));
            // Verify hook is executable
            const stats = await fs_1.promises.stat(hookPath);
            if (!(stats.mode & 0o111)) {
                await fs_1.promises.chmod(hookPath, 0o755);
                messages.push('Made hook executable');
            }
            messages.push('Agent hook installed successfully');
            messages.push(`Configuration saved to ${configPath}`);
            return {
                success: true,
                hookType: 'agent',
                hookPath,
                messages
            };
        }
        catch (error) {
            return {
                success: false,
                hookType: 'agent',
                hookPath,
                messages: [
                    ...messages,
                    `Installation failed: ${error instanceof Error ? error.message : String(error)}`
                ]
            };
        }
    }
    /**
     * Install hook based on configuration
     */
    async installHook(hookType) {
        if (hookType === 'git') {
            return this.installGitHook();
        }
        else {
            return this.installAgentHook();
        }
    }
    /**
     * Uninstall Git hook
     */
    async uninstallGitHook() {
        const hookPath = (0, path_1.join)(this.projectRoot, '.kiro/hooks/analyze-after-commit.sh');
        try {
            if (await this.fileExists(hookPath)) {
                await fs_1.promises.unlink(hookPath);
                // Remove integration from commit hook
                await this.removeCommitHookIntegration();
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Failed to uninstall Git hook:', error);
            return false;
        }
    }
    /**
     * Uninstall agent hook
     */
    async uninstallAgentHook() {
        const hookPath = (0, path_1.join)(this.projectRoot, '.kiro/agent-hooks/analyze-after-commit.sh');
        const configPath = (0, path_1.join)(this.projectRoot, '.kiro/agent-hooks/release-analysis-on-task-completion.json');
        try {
            let removed = false;
            if (await this.fileExists(hookPath)) {
                await fs_1.promises.unlink(hookPath);
                removed = true;
            }
            if (await this.fileExists(configPath)) {
                await fs_1.promises.unlink(configPath);
                removed = true;
            }
            return removed;
        }
        catch (error) {
            console.error('Failed to uninstall agent hook:', error);
            return false;
        }
    }
    /**
     * Uninstall hook based on type
     */
    async uninstallHook(hookType) {
        if (hookType === 'git') {
            return this.uninstallGitHook();
        }
        else {
            return this.uninstallAgentHook();
        }
    }
    /**
     * Validate Git hook installation
     */
    async validateGitHook() {
        const hookPath = (0, path_1.join)(this.projectRoot, '.kiro/hooks/analyze-after-commit.sh');
        const errors = [];
        const warnings = [];
        try {
            // Check if hook exists
            if (!(await this.fileExists(hookPath))) {
                errors.push('Hook file does not exist');
                return {
                    valid: false,
                    hookType: 'git',
                    errors,
                    warnings
                };
            }
            // Check if hook is executable
            const stats = await fs_1.promises.stat(hookPath);
            const isExecutable = !!(stats.mode & 0o111);
            const permissions = (stats.mode & 0o777).toString(8);
            if (!isExecutable) {
                errors.push('Hook file is not executable');
            }
            // Check hook content
            const content = await fs_1.promises.readFile(hookPath, 'utf-8');
            if (!content.includes('npm run release:analyze')) {
                warnings.push('Hook does not appear to call release analysis');
            }
            // Check integration with commit hook
            const commitHookPath = (0, path_1.join)(this.projectRoot, '.kiro/hooks/commit-task.sh');
            if (await this.fileExists(commitHookPath)) {
                const commitHookContent = await fs_1.promises.readFile(commitHookPath, 'utf-8');
                if (!commitHookContent.includes('analyze-after-commit.sh')) {
                    warnings.push('Hook is not integrated with commit-task.sh');
                }
            }
            return {
                valid: errors.length === 0,
                hookType: 'git',
                errors,
                warnings,
                permissions,
                executable: isExecutable
            };
        }
        catch (error) {
            errors.push(`Validation failed: ${error instanceof Error ? error.message : String(error)}`);
            return {
                valid: false,
                hookType: 'git',
                errors,
                warnings
            };
        }
    }
    /**
     * Validate agent hook installation
     */
    async validateAgentHook() {
        const hookPath = (0, path_1.join)(this.projectRoot, '.kiro/agent-hooks/analyze-after-commit.sh');
        const configPath = (0, path_1.join)(this.projectRoot, '.kiro/agent-hooks/release-analysis-on-task-completion.json');
        const errors = [];
        const warnings = [];
        try {
            // Check if hook exists
            if (!(await this.fileExists(hookPath))) {
                errors.push('Hook script does not exist');
            }
            // Check if config exists
            if (!(await this.fileExists(configPath))) {
                errors.push('Hook configuration does not exist');
            }
            if (errors.length > 0) {
                return {
                    valid: false,
                    hookType: 'agent',
                    errors,
                    warnings
                };
            }
            // Check if hook is executable
            const stats = await fs_1.promises.stat(hookPath);
            const isExecutable = !!(stats.mode & 0o111);
            const permissions = (stats.mode & 0o777).toString(8);
            if (!isExecutable) {
                errors.push('Hook script is not executable');
            }
            // Validate hook configuration
            const configContent = await fs_1.promises.readFile(configPath, 'utf-8');
            try {
                const config = JSON.parse(configContent);
                if (!config.name || !config.events || !config.command) {
                    warnings.push('Hook configuration is missing required fields');
                }
            }
            catch {
                errors.push('Hook configuration is not valid JSON');
            }
            return {
                valid: errors.length === 0,
                hookType: 'agent',
                errors,
                warnings,
                permissions,
                executable: isExecutable
            };
        }
        catch (error) {
            errors.push(`Validation failed: ${error instanceof Error ? error.message : String(error)}`);
            return {
                valid: false,
                hookType: 'agent',
                errors,
                warnings
            };
        }
    }
    /**
     * Validate hook installation
     */
    async validateHookIntegration() {
        if (this.hookConfig.hookType === 'git') {
            return this.validateGitHook();
        }
        else if (this.hookConfig.hookType === 'agent') {
            return this.validateAgentHook();
        }
        else {
            // Validate both
            const gitResult = await this.validateGitHook();
            const agentResult = await this.validateAgentHook();
            return {
                valid: gitResult.valid && agentResult.valid,
                hookType: 'git', // Primary type
                errors: [...gitResult.errors, ...agentResult.errors],
                warnings: [...gitResult.warnings, ...agentResult.warnings]
            };
        }
    }
    /**
     * Run quick analysis mode
     * Requirement 9.2: Quick analysis completes in <10 seconds
     */
    async runQuickAnalysis() {
        const { QuickAnalyzer } = await Promise.resolve().then(() => __importStar(require('../cli/quick-analyze')));
        const analyzer = new QuickAnalyzer(this.projectRoot, {
            timeoutMs: this.hookConfig.timeoutSeconds * 1000,
            skipDetailedExtraction: this.hookConfig.quickMode,
            cacheResults: this.hookConfig.cacheResults,
            monitorPerformance: true
        });
        const result = await analyzer.runQuickAnalysis();
        // Return just the QuickAnalysisResult without performance metrics
        return {
            versionBump: result.versionBump,
            changeCount: result.changeCount,
            confidence: result.confidence,
            summary: result.summary,
            fullResultCached: result.fullResultCached
        };
    }
    /**
     * Cache analysis result
     * Requirement 9.7: Cache results for later CLI access
     */
    async cacheResult(result) {
        const cacheDir = (0, path_1.join)(this.projectRoot, '.kiro/release-analysis/cache');
        await fs_1.promises.mkdir(cacheDir, { recursive: true });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const cacheFileName = `analysis-${timestamp}.json`;
        const cacheFilePath = (0, path_1.join)(cacheDir, cacheFileName);
        const cacheData = {
            timestamp: new Date().toISOString(),
            result,
            source: 'hook-integration'
        };
        await fs_1.promises.writeFile(cacheFilePath, JSON.stringify(cacheData, null, 2));
        // Create symlink to latest
        const latestPath = (0, path_1.join)(cacheDir, 'latest-full.json');
        try {
            await fs_1.promises.unlink(latestPath);
        }
        catch {
            // Ignore if doesn't exist
        }
        try {
            await fs_1.promises.symlink(cacheFileName, latestPath);
        }
        catch {
            // Symlinks might not be supported on all systems
            await fs_1.promises.copyFile(cacheFilePath, latestPath);
        }
    }
    /**
     * Get cached analysis result
     * Requirement 9.7: Retrieve cached results
     */
    async getCachedResult() {
        const latestPath = (0, path_1.join)(this.projectRoot, '.kiro/release-analysis/cache/latest-full.json');
        try {
            const content = await fs_1.promises.readFile(latestPath, 'utf-8');
            const cached = JSON.parse(content);
            return cached.result;
        }
        catch {
            return null;
        }
    }
    /**
     * Get current hook configuration
     */
    getHookConfig() {
        return { ...this.hookConfig };
    }
    /**
     * Update hook configuration
     */
    updateHookConfig(updates) {
        this.hookConfig = {
            ...this.hookConfig,
            ...updates
        };
    }
    // Private helper methods
    async fileExists(path) {
        try {
            await fs_1.promises.access(path);
            return true;
        }
        catch {
            return false;
        }
    }
    async ensureDirectoryExists(path) {
        try {
            await fs_1.promises.mkdir(path, { recursive: true });
        }
        catch (error) {
            // Directory might already exist
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }
    generateGitHookScript() {
        const quickMode = this.hookConfig.quickMode ? '--quick' : '';
        const timeout = this.hookConfig.timeoutSeconds;
        return `#!/bin/bash
#
# Release Analysis Git Hook
# Automatically analyzes changes after task completion commits
#

set -e

# Configuration
QUICK_MODE="${quickMode}"
TIMEOUT=${timeout}
FAIL_SILENTLY=${this.hookConfig.failSilently ? 'true' : 'false'}
CACHE_RESULTS=${this.hookConfig.cacheResults ? 'true' : 'false'}

# Colors for output
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
RED='\\033[0;31m'
NC='\\033[0m' # No Color

echo "🔍 Running release analysis..."

# Run analysis with timeout
if [ "$FAIL_SILENTLY" = "true" ]; then
    # Non-blocking mode
    timeout $TIMEOUT npm run release:analyze $QUICK_MODE 2>/dev/null || {
        echo -e "\${YELLOW}⚠️  Release analysis failed (non-blocking)\${NC}"
        exit 0
    }
else
    # Blocking mode
    timeout $TIMEOUT npm run release:analyze $QUICK_MODE || {
        echo -e "\${RED}❌ Release analysis failed\${NC}"
        exit 1
    }
fi

echo -e "\${GREEN}✅ Release analysis complete\${NC}"
exit 0
`;
    }
    generateAgentHookScript() {
        const quickMode = this.hookConfig.quickMode ? '--quick' : '';
        const timeout = this.hookConfig.timeoutSeconds;
        return `#!/bin/bash
#
# Release Analysis Agent Hook
# Automatically analyzes changes after task completion via Kiro agent
#

set -e

# Configuration
QUICK_MODE="${quickMode}"
TIMEOUT=${timeout}
FAIL_SILENTLY=${this.hookConfig.failSilently ? 'true' : 'false'}
CACHE_RESULTS=${this.hookConfig.cacheResults ? 'true' : 'false'}

# Run analysis with timeout
if [ "$FAIL_SILENTLY" = "true" ]; then
    # Non-blocking mode
    timeout $TIMEOUT npm run release:analyze $QUICK_MODE 2>/dev/null || exit 0
else
    # Blocking mode
    timeout $TIMEOUT npm run release:analyze $QUICK_MODE || exit 1
fi

exit 0
`;
    }
    generateAgentHookConfig() {
        return {
            name: 'release-analysis-on-task-completion',
            description: 'Automatically analyze changes for release after task completion',
            version: '1.0.0',
            events: ['task.completed', 'task.status.changed'],
            conditions: {
                taskStatus: 'completed'
            },
            command: './.kiro/agent-hooks/analyze-after-commit.sh',
            timeout: this.hookConfig.timeoutSeconds * 1000, // Convert to milliseconds
            failSilently: this.hookConfig.failSilently,
            autoApprove: false,
            enabled: this.hookConfig.enabled
        };
    }
    async integrateWithCommitHook(analyzeHookPath) {
        const commitHookPath = (0, path_1.join)(this.projectRoot, '.kiro/hooks/commit-task.sh');
        try {
            if (!(await this.fileExists(commitHookPath))) {
                // No commit hook to integrate with
                return;
            }
            const content = await fs_1.promises.readFile(commitHookPath, 'utf-8');
            // Check if already integrated
            if (content.includes('analyze-after-commit.sh')) {
                return;
            }
            // Add integration before final success message
            const integrationCode = `
# Release Analysis Integration
if [ -f "${analyzeHookPath}" ]; then
    echo "🔍 Analyzing changes for release..."
    "${analyzeHookPath}" || echo "⚠️  Release analysis failed (non-blocking)"
fi
`;
            const updatedContent = content.replace(/echo "✅ Task completion committed and pushed successfully!"/, `${integrationCode.trim()}

echo "✅ Task completion committed and pushed successfully!"`);
            await fs_1.promises.writeFile(commitHookPath, updatedContent);
        }
        catch (error) {
            console.error('Failed to integrate with commit hook:', error);
            // Non-fatal error
        }
    }
    async removeCommitHookIntegration() {
        const commitHookPath = (0, path_1.join)(this.projectRoot, '.kiro/hooks/commit-task.sh');
        try {
            if (!(await this.fileExists(commitHookPath))) {
                return;
            }
            const content = await fs_1.promises.readFile(commitHookPath, 'utf-8');
            // Remove integration code
            const updatedContent = content.replace(/# Release Analysis Integration[\s\S]*?fi\n\n/, '');
            if (content !== updatedContent) {
                await fs_1.promises.writeFile(commitHookPath, updatedContent);
            }
        }
        catch (error) {
            console.error('Failed to remove commit hook integration:', error);
            // Non-fatal error
        }
    }
}
exports.HookIntegrationManager = HookIntegrationManager;
//# sourceMappingURL=HookIntegrationManager.js.map