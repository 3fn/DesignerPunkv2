/**
 * Hook Integration Manager for Release Analysis System
 * 
 * Manages automatic triggering of release analysis via Git hooks or Kiro agent hooks.
 * Provides quick feedback for AI agents after task completion commits.
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { AnalysisConfig } from '../config/AnalysisConfig';

export interface HookConfig {
  /** Enable/disable hook integration */
  enabled: boolean;

  /** Type of hook to use */
  hookType: 'git' | 'agent' | 'both';

  /** Use quick mode for faster analysis */
  quickMode: boolean;

  /** Maximum time before giving up (seconds) */
  timeoutSeconds: number;

  /** Don't block commit on failure */
  failSilently: boolean;

  /** Cache results for later CLI access */
  cacheResults: boolean;
}

export interface QuickAnalysisResult {
  /** Version bump recommendation */
  versionBump: 'major' | 'minor' | 'patch' | 'none';

  /** Count of changes by type */
  changeCount: {
    breaking: number;
    features: number;
    fixes: number;
    improvements: number;
  };

  /** Confidence in the analysis (0-1) */
  confidence: number;

  /** Concise one-line summary for AI feedback */
  summary: string;

  /** Whether full result was cached */
  fullResultCached: boolean;
}

export interface HookInstallationResult {
  /** Whether installation was successful */
  success: boolean;

  /** Hook type that was installed */
  hookType: 'git' | 'agent';

  /** Path to installed hook */
  hookPath: string;

  /** Any warnings or messages */
  messages: string[];
}

export interface HookValidationResult {
  /** Whether hook is properly installed */
  valid: boolean;

  /** Hook type being validated */
  hookType: 'git' | 'agent';

  /** Validation errors */
  errors: string[];

  /** Validation warnings */
  warnings: string[];

  /** Hook file permissions */
  permissions?: string;

  /** Whether hook is executable */
  executable?: boolean;
}

export class HookIntegrationManager {
  private config: AnalysisConfig;
  private projectRoot: string;
  private hookConfig: HookConfig;

  constructor(
    config: AnalysisConfig,
    hookConfig: HookConfig,
    projectRoot: string = process.cwd()
  ) {
    this.config = config;
    this.hookConfig = hookConfig;
    this.projectRoot = projectRoot;
  }

  /**
   * Install Git post-commit hook for automatic analysis
   */
  async installGitHook(): Promise<HookInstallationResult> {
    const messages: string[] = [];
    const hookPath = join(this.projectRoot, '.kiro/hooks/analyze-after-commit.sh');

    try {
      // Check if hooks directory exists
      const hooksDir = join(this.projectRoot, '.kiro/hooks');
      await this.ensureDirectoryExists(hooksDir);

      // Check if hook already exists
      if (await this.fileExists(hookPath)) {
        messages.push('Hook file already exists, will be overwritten');
      }

      // Create hook script
      const hookScript = this.generateGitHookScript();
      await fs.writeFile(hookPath, hookScript, { mode: 0o755 });

      // Verify hook is executable
      const stats = await fs.stat(hookPath);
      if (!(stats.mode & 0o111)) {
        await fs.chmod(hookPath, 0o755);
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
    } catch (error) {
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
  async installAgentHook(): Promise<HookInstallationResult> {
    const messages: string[] = [];
    const hookPath = join(this.projectRoot, '.kiro/agent-hooks/analyze-after-commit.sh');
    const configPath = join(this.projectRoot, '.kiro/agent-hooks/release-analysis-on-task-completion.json');

    try {
      // Check if agent-hooks directory exists
      const agentHooksDir = join(this.projectRoot, '.kiro/agent-hooks');
      await this.ensureDirectoryExists(agentHooksDir);

      // Check if hook already exists
      if (await this.fileExists(hookPath)) {
        messages.push('Hook script already exists, will be overwritten');
      }

      // Create hook script
      const hookScript = this.generateAgentHookScript();
      await fs.writeFile(hookPath, hookScript, { mode: 0o755 });

      // Create hook configuration
      const hookConfig = this.generateAgentHookConfig();
      await fs.writeFile(configPath, JSON.stringify(hookConfig, null, 2));

      // Verify hook is executable
      const stats = await fs.stat(hookPath);
      if (!(stats.mode & 0o111)) {
        await fs.chmod(hookPath, 0o755);
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
    } catch (error) {
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
  async installHook(hookType: 'git' | 'agent'): Promise<HookInstallationResult> {
    if (hookType === 'git') {
      return this.installGitHook();
    } else {
      return this.installAgentHook();
    }
  }

  /**
   * Uninstall Git hook
   */
  async uninstallGitHook(): Promise<boolean> {
    const hookPath = join(this.projectRoot, '.kiro/hooks/analyze-after-commit.sh');

    try {
      if (await this.fileExists(hookPath)) {
        await fs.unlink(hookPath);
        
        // Remove integration from commit hook
        await this.removeCommitHookIntegration();
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to uninstall Git hook:', error);
      return false;
    }
  }

  /**
   * Uninstall agent hook
   */
  async uninstallAgentHook(): Promise<boolean> {
    const hookPath = join(this.projectRoot, '.kiro/agent-hooks/analyze-after-commit.sh');
    const configPath = join(this.projectRoot, '.kiro/agent-hooks/release-analysis-on-task-completion.json');

    try {
      let removed = false;

      if (await this.fileExists(hookPath)) {
        await fs.unlink(hookPath);
        removed = true;
      }

      if (await this.fileExists(configPath)) {
        await fs.unlink(configPath);
        removed = true;
      }

      return removed;
    } catch (error) {
      console.error('Failed to uninstall agent hook:', error);
      return false;
    }
  }

  /**
   * Uninstall hook based on type
   */
  async uninstallHook(hookType: 'git' | 'agent'): Promise<boolean> {
    if (hookType === 'git') {
      return this.uninstallGitHook();
    } else {
      return this.uninstallAgentHook();
    }
  }

  /**
   * Validate Git hook installation
   */
  async validateGitHook(): Promise<HookValidationResult> {
    const hookPath = join(this.projectRoot, '.kiro/hooks/analyze-after-commit.sh');
    const errors: string[] = [];
    const warnings: string[] = [];

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
      const stats = await fs.stat(hookPath);
      const isExecutable = !!(stats.mode & 0o111);
      const permissions = (stats.mode & 0o777).toString(8);

      if (!isExecutable) {
        errors.push('Hook file is not executable');
      }

      // Check hook content
      const content = await fs.readFile(hookPath, 'utf-8');
      if (!content.includes('npm run release:analyze')) {
        warnings.push('Hook does not appear to call release analysis');
      }

      // Check integration with commit hook
      const commitHookPath = join(this.projectRoot, '.kiro/hooks/commit-task.sh');
      if (await this.fileExists(commitHookPath)) {
        const commitHookContent = await fs.readFile(commitHookPath, 'utf-8');
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
    } catch (error) {
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
  async validateAgentHook(): Promise<HookValidationResult> {
    const hookPath = join(this.projectRoot, '.kiro/agent-hooks/analyze-after-commit.sh');
    const configPath = join(this.projectRoot, '.kiro/agent-hooks/release-analysis-on-task-completion.json');
    const errors: string[] = [];
    const warnings: string[] = [];

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
      const stats = await fs.stat(hookPath);
      const isExecutable = !!(stats.mode & 0o111);
      const permissions = (stats.mode & 0o777).toString(8);

      if (!isExecutable) {
        errors.push('Hook script is not executable');
      }

      // Validate hook configuration
      const configContent = await fs.readFile(configPath, 'utf-8');
      try {
        const config = JSON.parse(configContent);
        if (!config.name || !config.events || !config.command) {
          warnings.push('Hook configuration is missing required fields');
        }
      } catch {
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
    } catch (error) {
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
  async validateHookIntegration(): Promise<HookValidationResult> {
    if (this.hookConfig.hookType === 'git') {
      return this.validateGitHook();
    } else if (this.hookConfig.hookType === 'agent') {
      return this.validateAgentHook();
    } else {
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
  async runQuickAnalysis(): Promise<QuickAnalysisResult> {
    const { QuickAnalyzer } = await import('../cli/quick-analyze');
    
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
  async cacheResult(result: any): Promise<void> {
    const cacheDir = join(this.projectRoot, '.kiro/release-analysis/cache');
    await fs.mkdir(cacheDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const cacheFileName = `analysis-${timestamp}.json`;
    const cacheFilePath = join(cacheDir, cacheFileName);

    const cacheData = {
      timestamp: new Date().toISOString(),
      result,
      source: 'hook-integration'
    };

    await fs.writeFile(cacheFilePath, JSON.stringify(cacheData, null, 2));

    // Create symlink to latest
    const latestPath = join(cacheDir, 'latest-full.json');
    try {
      await fs.unlink(latestPath);
    } catch {
      // Ignore if doesn't exist
    }

    try {
      await fs.symlink(cacheFileName, latestPath);
    } catch {
      // Symlinks might not be supported on all systems
      await fs.copyFile(cacheFilePath, latestPath);
    }
  }

  /**
   * Get cached analysis result
   * Requirement 9.7: Retrieve cached results
   */
  async getCachedResult(): Promise<any | null> {
    const latestPath = join(this.projectRoot, '.kiro/release-analysis/cache/latest-full.json');
    
    try {
      const content = await fs.readFile(latestPath, 'utf-8');
      const cached = JSON.parse(content);
      return cached.result;
    } catch {
      return null;
    }
  }

  /**
   * Get current hook configuration
   */
  getHookConfig(): HookConfig {
    return { ...this.hookConfig };
  }

  /**
   * Update hook configuration
   */
  updateHookConfig(updates: Partial<HookConfig>): void {
    this.hookConfig = {
      ...this.hookConfig,
      ...updates
    };
  }

  // Private helper methods

  private async fileExists(path: string): Promise<boolean> {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  private async ensureDirectoryExists(path: string): Promise<void> {
    try {
      await fs.mkdir(path, { recursive: true });
    } catch (error) {
      // Directory might already exist
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
        throw error;
      }
    }
  }

  private generateGitHookScript(): string {
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

  private generateAgentHookScript(): string {
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

  private generateAgentHookConfig(): object {
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

  private async integrateWithCommitHook(analyzeHookPath: string): Promise<void> {
    const commitHookPath = join(this.projectRoot, '.kiro/hooks/commit-task.sh');

    try {
      if (!(await this.fileExists(commitHookPath))) {
        // No commit hook to integrate with
        return;
      }

      const content = await fs.readFile(commitHookPath, 'utf-8');

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

      const updatedContent = content.replace(
        /echo "✅ Task completion committed and pushed successfully!"/,
        `${integrationCode.trim()}

echo "✅ Task completion committed and pushed successfully!"`
      );

      await fs.writeFile(commitHookPath, updatedContent);
    } catch (error) {
      console.error('Failed to integrate with commit hook:', error);
      // Non-fatal error
    }
  }

  private async removeCommitHookIntegration(): Promise<void> {
    const commitHookPath = join(this.projectRoot, '.kiro/hooks/commit-task.sh');

    try {
      if (!(await this.fileExists(commitHookPath))) {
        return;
      }

      const content = await fs.readFile(commitHookPath, 'utf-8');

      // Remove integration code
      const updatedContent = content.replace(
        /# Release Analysis Integration[\s\S]*?fi\n\n/,
        ''
      );

      if (content !== updatedContent) {
        await fs.writeFile(commitHookPath, updatedContent);
      }
    } catch (error) {
      console.error('Failed to remove commit hook integration:', error);
      // Non-fatal error
    }
  }
}
