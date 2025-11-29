/**
 * Hook System Integration
 * 
 * Integrates release management with existing commit and organization hooks.
 * Provides coordination to prevent conflicts and ensure proper sequencing.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface HookConfig {
  enabled: boolean;
  name: string;
  description: string;
  version: string;
  when: {
    type: string;
    patterns?: string[];
  };
  then: {
    type: string;
    prompt?: string;
    command?: string;
  };
  settings?: {
    runAfter?: string[];
    autoApprove?: boolean;
    timeout?: number;
  };
}

export interface HookExecutionContext {
  hookName: string;
  triggerType: string;
  sourcePath?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface HookExecutionResult {
  success: boolean;
  hookName: string;
  executionTime: number;
  output?: string;
  error?: string;
}

/**
 * Hook Integration Manager
 * 
 * Manages integration between release management and existing hook system.
 * Ensures proper coordination and prevents conflicts.
 */
export class HookIntegration {
  private projectRoot: string;
  private hooksDir: string;
  private logFile: string;
  private releaseManagerScript: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.hooksDir = path.join(projectRoot, '.kiro', 'hooks');
    this.logFile = path.join(projectRoot, '.kiro', 'logs', 'hook-integration.log');
    this.releaseManagerScript = path.join(this.hooksDir, 'release-manager.sh');

    // Ensure log directory exists
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  /**
   * Integrate with commit hook
   * 
   * Triggers release detection when task completion commits occur.
   * Requirement 6.1: Integrate with commit-task hook without disrupting workflow
   */
  async integrateWithCommitHook(commitMessage: string): Promise<HookExecutionResult> {
    const startTime = Date.now();
    const context: HookExecutionContext = {
      hookName: 'commit-hook',
      triggerType: 'commit',
      timestamp: new Date(),
      metadata: { commitMessage }
    };

    this.log(`Integrating with commit hook: ${commitMessage}`);

    try {
      // Check if this is a task completion commit
      if (this.isTaskCompletionCommit(commitMessage)) {
        this.log('Task completion commit detected');
        
        // Execute release manager with commit integration
        const result = await this.executeReleaseManager('commit', commitMessage);
        
        return {
          success: result.success,
          hookName: context.hookName,
          executionTime: Date.now() - startTime,
          output: result.output,
          error: result.error
        };
      }

      // Check if commit includes completion documents
      const completionDocs = this.getCompletionDocsFromCommit();
      if (completionDocs.length > 0) {
        this.log(`Completion documents detected: ${completionDocs.join(', ')}`);
        
        // Process each completion document
        for (const doc of completionDocs) {
          await this.executeReleaseManager('manual', 'spec-completion', doc);
        }
        
        return {
          success: true,
          hookName: context.hookName,
          executionTime: Date.now() - startTime,
          output: `Processed ${completionDocs.length} completion documents`
        };
      }

      this.log('No release triggers detected in commit');
      return {
        success: true,
        hookName: context.hookName,
        executionTime: Date.now() - startTime,
        output: 'No release triggers detected'
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log(`ERROR: Commit hook integration failed: ${errorMessage}`);
      
      return {
        success: false,
        hookName: context.hookName,
        executionTime: Date.now() - startTime,
        error: errorMessage
      };
    }
  }

  /**
   * Integrate with file organization hook
   * 
   * Triggers release detection when completion documents are organized.
   * Requirement 6.2: Coordinate with organization system for release artifacts
   */
  async integrateWithOrganizationHook(): Promise<HookExecutionResult> {
    const startTime = Date.now();
    const context: HookExecutionContext = {
      hookName: 'organization-hook',
      triggerType: 'organization',
      timestamp: new Date()
    };

    this.log('Integrating with file organization hook');

    try {
      // Execute release manager with organization integration
      const result = await this.executeReleaseManager('organize');
      
      return {
        success: result.success,
        hookName: context.hookName,
        executionTime: Date.now() - startTime,
        output: result.output,
        error: result.error
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log(`ERROR: Organization hook integration failed: ${errorMessage}`);
      
      return {
        success: false,
        hookName: context.hookName,
        executionTime: Date.now() - startTime,
        error: errorMessage
      };
    }
  }

  /**
   * Trigger release detection manually
   * 
   * Allows manual triggering of release detection for specific events.
   * Requirement 6.3: Trigger appropriate release processes automatically
   */
  async triggerReleaseDetection(
    triggerType: 'spec-completion' | 'task-completion' | 'auto',
    sourcePath?: string
  ): Promise<HookExecutionResult> {
    const startTime = Date.now();
    const context: HookExecutionContext = {
      hookName: 'manual-trigger',
      triggerType,
      sourcePath,
      timestamp: new Date()
    };

    this.log(`Manual release detection trigger: type=${triggerType}, source=${sourcePath || 'auto'}`);

    try {
      const result = await this.executeReleaseManager('manual', triggerType, sourcePath);
      
      return {
        success: result.success,
        hookName: context.hookName,
        executionTime: Date.now() - startTime,
        output: result.output,
        error: result.error
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log(`ERROR: Manual trigger failed: ${errorMessage}`);
      
      return {
        success: false,
        hookName: context.hookName,
        executionTime: Date.now() - startTime,
        error: errorMessage
      };
    }
  }

  /**
   * Check hook system status
   * 
   * Verifies that hook system is properly configured and operational.
   * Requirement 6.5: Provide clear interfaces for AI-driven release management
   */
  async checkHookStatus(): Promise<{
    configured: boolean;
    releaseManagerExists: boolean;
    configExists: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    // Check if release manager script exists
    const releaseManagerExists = fs.existsSync(this.releaseManagerScript);
    if (!releaseManagerExists) {
      issues.push('Release manager script not found');
    }

    // Check if script is executable
    if (releaseManagerExists) {
      try {
        fs.accessSync(this.releaseManagerScript, fs.constants.X_OK);
      } catch {
        issues.push('Release manager script is not executable');
      }
    }

    // Check if release config exists
    const configPath = path.join(this.projectRoot, '.kiro', 'release-config.json');
    const configExists = fs.existsSync(configPath);
    if (!configExists) {
      issues.push('Release configuration file not found');
    }

    // Check if hooks directory exists
    if (!fs.existsSync(this.hooksDir)) {
      issues.push('Hooks directory not found');
    }

    const configured = issues.length === 0;

    return {
      configured,
      releaseManagerExists,
      configExists,
      issues
    };
  }

  /**
   * Coordinate hook execution
   * 
   * Ensures proper sequencing and prevents conflicts between hooks.
   * Requirement 6.1, 6.2: Coordinate hooks without disrupting workflow
   */
  async coordinateHookExecution(
    hooks: Array<{ name: string; execute: () => Promise<HookExecutionResult> }>
  ): Promise<HookExecutionResult[]> {
    const results: HookExecutionResult[] = [];

    this.log(`Coordinating execution of ${hooks.length} hooks`);

    for (const hook of hooks) {
      this.log(`Executing hook: ${hook.name}`);
      
      try {
        const result = await hook.execute();
        results.push(result);
        
        if (!result.success) {
          this.log(`Hook ${hook.name} failed, stopping coordination`);
          break;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        this.log(`ERROR: Hook ${hook.name} threw exception: ${errorMessage}`);
        
        results.push({
          success: false,
          hookName: hook.name,
          executionTime: 0,
          error: errorMessage
        });
        break;
      }
    }

    this.log(`Hook coordination complete: ${results.filter(r => r.success).length}/${results.length} succeeded`);

    return results;
  }

  /**
   * Read hook configuration
   * 
   * Loads hook configuration from .kiro.hook files.
   */
  readHookConfig(hookName: string): HookConfig | null {
    const hookPath = path.join(this.hooksDir, `${hookName}.kiro.hook`);
    
    if (!fs.existsSync(hookPath)) {
      return null;
    }

    try {
      const content = fs.readFileSync(hookPath, 'utf-8');
      return JSON.parse(content) as HookConfig;
    } catch (error) {
      this.log(`ERROR: Failed to read hook config ${hookName}: ${error}`);
      return null;
    }
  }

  /**
   * Update hook configuration
   * 
   * Updates hook configuration file with new settings.
   */
  updateHookConfig(hookName: string, config: HookConfig): boolean {
    const hookPath = path.join(this.hooksDir, `${hookName}.kiro.hook`);
    
    try {
      const content = JSON.stringify(config, null, 2);
      fs.writeFileSync(hookPath, content, 'utf-8');
      this.log(`Updated hook configuration: ${hookName}`);
      return true;
    } catch (error) {
      this.log(`ERROR: Failed to update hook config ${hookName}: ${error}`);
      return false;
    }
  }

  // Private helper methods

  private async executeReleaseManager(
    command: string,
    ...args: Array<string | undefined>
  ): Promise<{ success: boolean; output?: string; error?: string }> {
    try {
      // Check if release manager script exists
      if (!fs.existsSync(this.releaseManagerScript)) {
        throw new Error('Release manager script not found');
      }

      // Filter out undefined args and build command
      const validArgs = args.filter((arg): arg is string => arg !== undefined);
      const fullCommand = `"${this.releaseManagerScript}" ${command} ${validArgs.map(a => `"${a}"`).join(' ')}`;
      
      this.log(`Executing: ${fullCommand}`);

      // Execute with timeout
      const output = execSync(fullCommand, {
        cwd: this.projectRoot,
        encoding: 'utf-8',
        timeout: 30000, // 30 second timeout
        stdio: 'pipe'
      });

      return {
        success: true,
        output: output.trim()
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  private isTaskCompletionCommit(commitMessage: string): boolean {
    // Check for "Task X Complete:" pattern
    return /Task\s+[\d.]+\s+Complete:/i.test(commitMessage);
  }

  private getCompletionDocsFromCommit(): string[] {
    try {
      // Get files changed in last commit
      const output = execSync('git diff --name-only HEAD~1 HEAD', {
        cwd: this.projectRoot,
        encoding: 'utf-8',
        stdio: 'pipe'
      });

      // Filter for completion documents
      return output
        .split('\n')
        .filter(file => file.includes('completion') && file.endsWith('.md'))
        .filter(file => fs.existsSync(path.join(this.projectRoot, file)));

    } catch (error) {
      this.log(`ERROR: Failed to get completion docs from commit: ${error}`);
      return [];
    }
  }

  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    
    try {
      fs.appendFileSync(this.logFile, logMessage, 'utf-8');
    } catch (error) {
      // Silently fail if logging fails
      console.error(`Failed to write to log: ${error}`);
    }
  }
}
