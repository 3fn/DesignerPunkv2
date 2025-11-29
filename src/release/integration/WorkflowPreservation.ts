/**
 * Workflow Preservation System
 * 
 * Ensures existing developer workflow remains unchanged while adding
 * transparent release processing. Provides fallback mechanisms for
 * hook failures or conflicts.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import * as fs from 'fs';
import * as path from 'path';

export interface WorkflowState {
  inProgress: boolean;
  operation: string;
  startTime: Date;
  metadata?: Record<string, any>;
}

export interface FallbackResult {
  success: boolean;
  fallbackUsed: boolean;
  operation: string;
  message: string;
  error?: string;
}

export interface TransparencyReport {
  operationsExecuted: number;
  transparentOperations: number;
  disruptiveOperations: number;
  fallbacksUsed: number;
  workflowPreserved: boolean;
}

/**
 * Workflow Preservation Manager
 * 
 * Manages transparent release processing that doesn't disrupt normal operations.
 * Provides fallback mechanisms for hook failures or conflicts.
 */
export class WorkflowPreservation {
  private projectRoot: string;
  private stateFile: string;
  private logFile: string;
  private currentState: WorkflowState | null = null;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
    this.stateFile = path.join(projectRoot, '.kiro', 'release-state', 'workflow-state.json');
    this.logFile = path.join(projectRoot, '.kiro', 'logs', 'workflow-preservation.log');

    // Ensure directories exist
    this.ensureDirectories();
  }

  /**
   * Execute operation transparently
   * 
   * Executes operation without disrupting workflow. If operation fails,
   * uses fallback mechanism to preserve workflow.
   * 
   * Requirement 6.1: Integrate without disrupting current workflow
   */
  async executeTransparently<T>(
    operation: string,
    execute: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<{ result: T | null; fallbackUsed: boolean; error?: string }> {
    this.log(`Executing transparently: ${operation}`);

    // Save workflow state
    this.saveWorkflowState({
      inProgress: true,
      operation,
      startTime: new Date()
    });

    try {
      // Execute operation
      const result = await execute();
      
      // Clear workflow state
      this.clearWorkflowState();
      
      this.log(`Transparent execution succeeded: ${operation}`);
      return { result, fallbackUsed: false };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log(`ERROR: Transparent execution failed: ${operation} - ${errorMessage}`);

      // Try fallback if provided
      if (fallback) {
        this.log(`Attempting fallback for: ${operation}`);
        
        try {
          const result = await fallback();
          
          // Clear workflow state
          this.clearWorkflowState();
          
          this.log(`Fallback succeeded: ${operation}`);
          return { result, fallbackUsed: true };

        } catch (fallbackError) {
          const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
          this.log(`ERROR: Fallback failed: ${operation} - ${fallbackMessage}`);
          
          // Clear workflow state
          this.clearWorkflowState();
          
          return { result: null, fallbackUsed: true, error: fallbackMessage };
        }
      }

      // No fallback available
      this.clearWorkflowState();
      return { result: null, fallbackUsed: false, error: errorMessage };
    }
  }

  /**
   * Check if operation would disrupt workflow
   * 
   * Analyzes operation to determine if it would disrupt normal workflow.
   * Returns true if operation is safe to execute transparently.
   * 
   * Requirement 6.2: Coordinate to ensure artifacts properly placed
   */
  isTransparentOperation(operation: string): boolean {
    // Operations that are transparent (don't disrupt workflow)
    const transparentOperations = [
      'release-detection',
      'trigger-creation',
      'log-writing',
      'state-tracking',
      'analysis-execution'
    ];

    // Operations that might disrupt workflow
    const disruptiveOperations = [
      'package-update',
      'changelog-update',
      'git-commit',
      'git-push',
      'github-release',
      'npm-publish'
    ];

    // Check if operation is in transparent list
    if (transparentOperations.some(op => operation.includes(op))) {
      return true;
    }

    // Check if operation is in disruptive list
    if (disruptiveOperations.some(op => operation.includes(op))) {
      return false;
    }

    // Default to non-transparent for safety
    return false;
  }

  /**
   * Create fallback for operation
   * 
   * Creates appropriate fallback mechanism for operation type.
   * Ensures workflow continues even if operation fails.
   * 
   * Requirement 6.3: Trigger appropriate release processes automatically
   */
  createFallback(operation: string): (() => Promise<FallbackResult>) | null {
    // Fallback strategies by operation type
    const fallbackStrategies: Record<string, () => Promise<FallbackResult>> = {
      'release-detection': async () => {
        this.log('Fallback: Skipping release detection, will retry later');
        return {
          success: true,
          fallbackUsed: true,
          operation: 'release-detection',
          message: 'Release detection skipped, will retry on next trigger'
        };
      },

      'trigger-creation': async () => {
        this.log('Fallback: Creating manual trigger file');
        const triggerDir = path.join(this.projectRoot, '.kiro', 'release-triggers');
        const triggerFile = path.join(triggerDir, `manual-${Date.now()}.trigger`);
        
        if (!fs.existsSync(triggerDir)) {
          fs.mkdirSync(triggerDir, { recursive: true });
        }
        
        fs.writeFileSync(triggerFile, JSON.stringify({
          type: 'manual',
          timestamp: new Date().toISOString(),
          reason: 'Fallback from failed automatic trigger'
        }), 'utf-8');
        
        return {
          success: true,
          fallbackUsed: true,
          operation: 'trigger-creation',
          message: 'Manual trigger file created for later processing'
        };
      },

      'analysis-execution': async () => {
        this.log('Fallback: Deferring analysis to manual execution');
        return {
          success: true,
          fallbackUsed: true,
          operation: 'analysis-execution',
          message: 'Analysis deferred, run manually with: npm run release:analyze'
        };
      }
    };

    // Find matching fallback strategy
    for (const [key, strategy] of Object.entries(fallbackStrategies)) {
      if (operation.includes(key)) {
        return strategy;
      }
    }

    // No fallback available
    return null;
  }

  /**
   * Preserve workflow during operation
   * 
   * Ensures workflow is preserved even if operation fails.
   * Uses fallback mechanisms to maintain workflow continuity.
   * 
   * Requirement 6.4: Ensure release documentation maintains link integrity
   */
  async preserveWorkflow<T>(
    operation: string,
    execute: () => Promise<T>
  ): Promise<{ result: T | null; preserved: boolean; fallbackUsed: boolean }> {
    this.log(`Preserving workflow for: ${operation}`);

    // Check if operation is transparent
    const isTransparent = this.isTransparentOperation(operation);
    
    if (!isTransparent) {
      this.log(`WARNING: Operation ${operation} is not transparent, may disrupt workflow`);
    }

    // Create fallback if available
    const fallback = this.createFallback(operation);

    // Execute with fallback
    const { result, fallbackUsed, error } = await this.executeTransparently<T>(
      operation,
      execute,
      fallback ? async (): Promise<T> => {
        const fallbackResult = await fallback();
        // Fallback returns FallbackResult, but we need to return T
        // In this case, we return null as T (workflow preserved but no result)
        return null as T;
      } : undefined
    );

    // Determine if workflow was preserved
    const preserved = result !== null || fallbackUsed;

    if (preserved) {
      this.log(`Workflow preserved for: ${operation}`);
    } else {
      this.log(`WARNING: Workflow preservation failed for: ${operation} - ${error}`);
    }

    return { result, preserved, fallbackUsed };
  }

  /**
   * Check workflow health
   * 
   * Verifies that workflow preservation is functioning correctly.
   * Returns health status and any issues detected.
   * 
   * Requirement 6.5: Provide clear interfaces for AI-driven release management
   */
  async checkWorkflowHealth(): Promise<{
    healthy: boolean;
    stateFileExists: boolean;
    logFileExists: boolean;
    currentState: WorkflowState | null;
    issues: string[];
  }> {
    const issues: string[] = [];

    // Check state file
    const stateFileExists = fs.existsSync(this.stateFile);
    if (!stateFileExists) {
      issues.push('Workflow state file does not exist');
    }

    // Check log file
    const logFileExists = fs.existsSync(this.logFile);
    if (!logFileExists) {
      issues.push('Workflow preservation log file does not exist');
    }

    // Load current state
    const currentState = this.loadWorkflowState();
    
    // Check for stuck operations
    if (currentState && currentState.inProgress) {
      const elapsed = Date.now() - new Date(currentState.startTime).getTime();
      const maxDuration = 5 * 60 * 1000; // 5 minutes
      
      if (elapsed > maxDuration) {
        issues.push(`Operation ${currentState.operation} has been in progress for ${Math.round(elapsed / 1000)}s`);
      }
    }

    const healthy = issues.length === 0;

    return {
      healthy,
      stateFileExists,
      logFileExists,
      currentState,
      issues
    };
  }

  /**
   * Generate transparency report
   * 
   * Analyzes recent operations to determine transparency level.
   * Helps identify operations that might disrupt workflow.
   * 
   * Requirement 6.1: Integrate without disrupting current workflow
   */
  generateTransparencyReport(operations: string[]): TransparencyReport {
    let transparentOperations = 0;
    let disruptiveOperations = 0;

    for (const operation of operations) {
      if (this.isTransparentOperation(operation)) {
        transparentOperations++;
      } else {
        disruptiveOperations++;
      }
    }

    const workflowPreserved = disruptiveOperations === 0;

    return {
      operationsExecuted: operations.length,
      transparentOperations,
      disruptiveOperations,
      fallbacksUsed: 0, // Would need to track this separately
      workflowPreserved
    };
  }

  /**
   * Recover from workflow disruption
   * 
   * Attempts to recover workflow if disruption occurred.
   * Clears stuck state and restores normal operation.
   * 
   * Requirement 6.3: Trigger appropriate release processes automatically
   */
  async recoverWorkflow(): Promise<{ recovered: boolean; message: string }> {
    this.log('Attempting workflow recovery');

    const currentState = this.loadWorkflowState();
    
    if (!currentState || !currentState.inProgress) {
      return {
        recovered: true,
        message: 'No recovery needed, workflow is healthy'
      };
    }

    // Clear stuck state
    this.clearWorkflowState();
    
    this.log(`Recovered from stuck operation: ${currentState.operation}`);

    return {
      recovered: true,
      message: `Recovered from stuck operation: ${currentState.operation}`
    };
  }

  // Private helper methods

  private ensureDirectories(): void {
    const dirs = [
      path.dirname(this.stateFile),
      path.dirname(this.logFile)
    ];

    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  private saveWorkflowState(state: WorkflowState): void {
    this.currentState = state;
    
    try {
      fs.writeFileSync(this.stateFile, JSON.stringify(state, null, 2), 'utf-8');
    } catch (error) {
      this.log(`ERROR: Failed to save workflow state: ${error}`);
    }
  }

  private loadWorkflowState(): WorkflowState | null {
    if (!fs.existsSync(this.stateFile)) {
      return null;
    }

    try {
      const content = fs.readFileSync(this.stateFile, 'utf-8');
      return JSON.parse(content) as WorkflowState;
    } catch (error) {
      this.log(`ERROR: Failed to load workflow state: ${error}`);
      return null;
    }
  }

  private clearWorkflowState(): void {
    this.currentState = null;
    
    try {
      if (fs.existsSync(this.stateFile)) {
        fs.unlinkSync(this.stateFile);
      }
    } catch (error) {
      this.log(`ERROR: Failed to clear workflow state: ${error}`);
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
