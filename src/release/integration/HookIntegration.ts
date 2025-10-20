/**
 * Hook System Integration Implementation
 * 
 * Integrates release management with existing commit and organization hooks
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import {
  HookSystemIntegration,
  CommitHookEvent,
  OrganizationHookEvent,
  MonitoringStatus
} from './WorkflowIntegration';
import { ReleaseSignal, ValidationResult } from '../types/ReleaseTypes';
import { ReleaseConfig } from '../config/ReleaseConfig';

export class HookIntegrationManager implements HookSystemIntegration {
  private config: ReleaseConfig;
  private projectRoot: string;
  private monitoringActive: boolean = false;
  private registeredHooks: Set<string> = new Set();

  constructor(config: ReleaseConfig, projectRoot: string = process.cwd()) {
    this.config = config;
    this.projectRoot = projectRoot;
  }

  /**
   * Register release detection with commit hooks
   */
  async registerWithCommitHooks(): Promise<boolean> {
    try {
      const commitHookPath = join(this.projectRoot, '.kiro/hooks/commit-task.sh');
      const releaseHookPath = join(this.projectRoot, '.kiro/hooks/release-manager.sh');
      
      // Check if hooks exist
      const commitHookExists = await this.fileExists(commitHookPath);
      const releaseHookExists = await this.fileExists(releaseHookPath);
      
      if (!commitHookExists) {
        throw new Error(`Commit hook not found at ${commitHookPath}`);
      }
      
      if (!releaseHookExists) {
        throw new Error(`Release manager hook not found at ${releaseHookPath}`);
      }
      
      // Update commit hook to call release manager
      await this.updateCommitHookIntegration(commitHookPath, releaseHookPath);
      
      this.registeredHooks.add('commit');
      return true;
    } catch (error) {
      console.error('Failed to register with commit hooks:', error);
      return false;
    }
  }

  /**
   * Register release detection with organization hooks
   */
  async registerWithOrganizationHooks(): Promise<boolean> {
    try {
      const orgHookPath = join(this.projectRoot, '.kiro/hooks/organize-by-metadata.sh');
      const releaseHookPath = join(this.projectRoot, '.kiro/hooks/release-manager.sh');
      
      // Check if hooks exist
      const orgHookExists = await this.fileExists(orgHookPath);
      const releaseHookExists = await this.fileExists(releaseHookPath);
      
      if (!orgHookExists) {
        throw new Error(`Organization hook not found at ${orgHookPath}`);
      }
      
      if (!releaseHookExists) {
        throw new Error(`Release manager hook not found at ${releaseHookPath}`);
      }
      
      // Update organization hook to call release manager
      await this.updateOrganizationHookIntegration(orgHookPath, releaseHookPath);
      
      this.registeredHooks.add('organization');
      return true;
    } catch (error) {
      console.error('Failed to register with organization hooks:', error);
      return false;
    }
  }

  /**
   * Process commit hook event for release detection
   */
  async processCommitHookEvent(event: CommitHookEvent): Promise<ReleaseSignal | null> {
    if (!this.config.detection.taskCompletionTrigger && !this.config.detection.specCompletionTrigger) {
      return null;
    }

    try {
      // Check if this is a task completion commit
      if (this.isTaskCompletionCommit(event.message)) {
        return await this.createTaskCompletionSignal(event);
      }
      
      // Check if this commit includes completion documents
      if (await this.hasCompletionDocuments(event.changedFiles)) {
        return await this.createSpecCompletionSignal(event);
      }
      
      return null;
    } catch (error) {
      console.error('Error processing commit hook event:', error);
      return null;
    }
  }

  /**
   * Process organization hook event for release detection
   */
  async processOrganizationHookEvent(event: OrganizationHookEvent): Promise<ReleaseSignal | null> {
    if (!this.config.detection.specCompletionTrigger) {
      return null;
    }

    try {
      // Check if organized files include completion documents
      const completionDocs = event.organizedFiles.filter(file => 
        file.metadata.organization === 'spec-completion'
      );
      
      if (completionDocs.length > 0) {
        return await this.createOrganizationCompletionSignal(event, completionDocs);
      }
      
      return null;
    } catch (error) {
      console.error('Error processing organization hook event:', error);
      return null;
    }
  }

  /**
   * Validate hook integration status
   */
  async validateHookIntegration(): Promise<ValidationResult> {
    const errors: Array<{ code: string; message: string; severity: 'error' | 'warning' | 'info' }> = [];
    const warnings: Array<{ code: string; message: string }> = [];

    try {
      // Check if required hooks exist
      const requiredHooks = [
        '.kiro/hooks/commit-task.sh',
        '.kiro/hooks/release-manager.sh',
        '.kiro/hooks/organize-by-metadata.sh'
      ];

      for (const hookPath of requiredHooks) {
        const fullPath = join(this.projectRoot, hookPath);
        if (!(await this.fileExists(fullPath))) {
          errors.push({
            code: 'HOOK_MISSING',
            message: `Required hook not found: ${hookPath}`,
            severity: 'error'
          });
        }
      }

      // Check hook registration status
      if (!this.registeredHooks.has('commit')) {
        warnings.push({
          code: 'COMMIT_HOOK_NOT_REGISTERED',
          message: 'Commit hook integration not registered'
        });
      }

      if (!this.registeredHooks.has('organization')) {
        warnings.push({
          code: 'ORG_HOOK_NOT_REGISTERED',
          message: 'Organization hook integration not registered'
        });
      }

      // Check configuration
      if (!this.config.detection.taskCompletionTrigger && !this.config.detection.specCompletionTrigger) {
        warnings.push({
          code: 'NO_TRIGGERS_ENABLED',
          message: 'No release triggers are enabled in configuration'
        });
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
        validatedAt: new Date(),
        context: 'hook-integration'
      };
    } catch (error) {
      errors.push({
        code: 'VALIDATION_ERROR',
        message: `Hook integration validation failed: ${error instanceof Error ? error.message : String(error)}`,
        severity: 'error'
      });

      return {
        valid: false,
        errors,
        warnings,
        validatedAt: new Date(),
        context: 'hook-integration'
      };
    }
  }

  /**
   * Get monitoring status
   */
  getMonitoringStatus(): MonitoringStatus {
    return {
      active: this.monitoringActive,
      monitoredEvents: Array.from(this.registeredHooks),
      errors: []
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

  private async updateCommitHookIntegration(commitHookPath: string, releaseHookPath: string): Promise<void> {
    try {
      const commitHookContent = await fs.readFile(commitHookPath, 'utf-8');
      
      // Check if release manager integration already exists
      if (commitHookContent.includes('release-manager.sh')) {
        return; // Already integrated
      }
      
      // Add release manager call to commit hook
      const integrationCode = `
# Release Management Integration
if [ -f "${releaseHookPath}" ]; then
    echo "🔍 Checking for release triggers..."
    "${releaseHookPath}" commit "$commit_msg" || echo "⚠️  Release detection failed (non-blocking)"
fi
`;
      
      // Insert before the final success message
      const updatedContent = commitHookContent.replace(
        /echo "✅ Task completion committed and pushed successfully!"/,
        `${integrationCode.trim()}

echo "✅ Task completion committed and pushed successfully!"`
      );
      
      await fs.writeFile(commitHookPath, updatedContent);
    } catch (error) {
      throw new Error(`Failed to update commit hook integration: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private async updateOrganizationHookIntegration(orgHookPath: string, releaseHookPath: string): Promise<void> {
    try {
      const orgHookContent = await fs.readFile(orgHookPath, 'utf-8');
      
      // Check if release manager integration already exists
      if (orgHookContent.includes('release-manager.sh')) {
        return; // Already integrated
      }
      
      // Add release manager call to organization hook
      const integrationCode = `
# Release Management Integration
if [ -f "${releaseHookPath}" ]; then
    echo "🔍 Checking for release triggers after organization..."
    "${releaseHookPath}" organize || echo "⚠️  Release detection failed (non-blocking)"
fi
`;
      
      // Insert at the end of the main function
      const updatedContent = orgHookContent.replace(
        /echo "✅ Organization complete!"/,
        `echo "✅ Organization complete!"
${integrationCode.trim()}`
      );
      
      await fs.writeFile(orgHookPath, updatedContent);
    } catch (error) {
      throw new Error(`Failed to update organization hook integration: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private isTaskCompletionCommit(message: string): boolean {
    const taskCompletionPatterns = [
      /Task \d+(\.\d+)? Complete:/i,
      /Task Complete:/i,
      /Completed Task:/i
    ];
    
    return taskCompletionPatterns.some(pattern => pattern.test(message));
  }

  private async hasCompletionDocuments(changedFiles: string[]): Promise<boolean> {
    const completionPatterns = [
      /completion\/.*\.md$/,
      /.*-completion\.md$/,
      /spec-completion-summary\.md$/
    ];
    
    return changedFiles.some(file => 
      completionPatterns.some(pattern => pattern.test(file))
    );
  }

  private async createTaskCompletionSignal(event: CommitHookEvent): Promise<ReleaseSignal> {
    // Extract task information from commit message
    const taskMatch = event.message.match(/Task (\d+(?:\.\d+)?)\s+Complete:\s*(.+)/i);
    const taskNumber = taskMatch ? taskMatch[1] : 'unknown';
    const taskDescription = taskMatch ? taskMatch[2] : event.message;
    
    return {
      type: 'patch', // Task completion typically results in patch release
      trigger: 'task-completion',
      confidence: 0.8, // High confidence for explicit task completion
      evidence: [
        `Commit message indicates task completion: ${event.message}`,
        `Task number: ${taskNumber}`,
        `Changed files: ${event.changedFiles.join(', ')}`
      ],
      affectedPackages: await this.determineAffectedPackages(event.changedFiles),
      timestamp: event.timestamp,
      source: `commit:${event.hash}`
    };
  }

  private async createSpecCompletionSignal(event: CommitHookEvent): Promise<ReleaseSignal> {
    const completionDocs = event.changedFiles.filter(file => 
      file.includes('completion') && file.endsWith('.md')
    );
    
    return {
      type: 'minor', // Spec completion typically results in minor release
      trigger: 'spec-completion',
      confidence: 0.9, // Very high confidence for completion documents
      evidence: [
        `Completion documents modified: ${completionDocs.join(', ')}`,
        `Commit message: ${event.message}`,
        `Total changed files: ${event.changedFiles.length}`
      ],
      affectedPackages: await this.determineAffectedPackages(event.changedFiles),
      timestamp: event.timestamp,
      source: `commit:${event.hash}`
    };
  }

  private async createOrganizationCompletionSignal(
    event: OrganizationHookEvent, 
    completionDocs: Array<{ originalPath: string; newPath: string }>
  ): Promise<ReleaseSignal> {
    return {
      type: 'minor', // Organization of completion docs suggests spec completion
      trigger: 'spec-completion',
      confidence: 0.85, // High confidence for organized completion documents
      evidence: [
        `Completion documents organized: ${completionDocs.map(doc => doc.newPath).join(', ')}`,
        `Organization trigger: ${event.trigger}`,
        `Total organized files: ${event.organizedFiles.length}`
      ],
      affectedPackages: await this.determineAffectedPackagesFromPaths(
        completionDocs.map(doc => doc.newPath)
      ),
      timestamp: event.timestamp,
      source: `organization:${event.trigger}`
    };
  }

  private async determineAffectedPackages(changedFiles: string[]): Promise<string[]> {
    const packages = new Set<string>();
    
    for (const file of changedFiles) {
      // Check if file is in a package directory
      if (file.startsWith('src/')) {
        packages.add('@designerpunk/tokens'); // Core token system
      }
      
      // Check for build system changes
      if (file.includes('build') || file.includes('generator')) {
        packages.add('@designerpunk/build-system');
      }
      
      // Check for component changes
      if (file.includes('component') || file.includes('ui')) {
        packages.add('@designerpunk/components');
      }
      
      // Default to core package if uncertain
      if (packages.size === 0) {
        packages.add('@designerpunk/tokens');
      }
    }
    
    return Array.from(packages);
  }

  private async determineAffectedPackagesFromPaths(paths: string[]): Promise<string[]> {
    const packages = new Set<string>();
    
    for (const path of paths) {
      // Extract spec name from completion document path
      const specMatch = path.match(/specs\/([^\/]+)\//);
      if (specMatch) {
        const specName = specMatch[1];
        
        // Map spec names to packages
        switch (specName) {
          case 'mathematical-token-system':
          case 'release-management-system':
            packages.add('@designerpunk/tokens');
            break;
          case 'cross-platform-build-system':
            packages.add('@designerpunk/build-system');
            break;
          default:
            packages.add('@designerpunk/tokens'); // Default to core package
        }
      }
    }
    
    if (packages.size === 0) {
      packages.add('@designerpunk/tokens'); // Default fallback
    }
    
    return Array.from(packages);
  }
}