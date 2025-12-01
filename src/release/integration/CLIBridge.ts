/**
 * CLI Bridge
 * 
 * Executes the release-analysis CLI programmatically and captures its output.
 * This bridge enables the automation layer to consume analysis results without
 * duplicating analysis logic.
 * 
 * Design Principles:
 * - Execute CLI as subprocess for isolation
 * - Capture stdout/stderr for comprehensive output
 * - Handle timeouts for long-running analysis
 * - Provide clean error handling and recovery
 */

import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

/**
 * CLI execution options
 */
export interface CLIExecutionOptions {
  /** Working directory for CLI execution */
  workingDirectory?: string;
  /** Timeout in milliseconds (default: 5 minutes) */
  timeout?: number;
  /** Additional CLI arguments */
  args?: string[];
  /** Environment variables to pass to CLI */
  env?: Record<string, string>;
  /** Whether to capture stderr separately */
  captureStderr?: boolean;
}

/**
 * CLI execution result
 */
export interface CLIExecutionResult {
  /** Whether execution succeeded */
  success: boolean;
  /** Captured stdout */
  stdout: string;
  /** Captured stderr */
  stderr: string;
  /** Exit code */
  exitCode: number | null;
  /** Execution duration in milliseconds */
  duration: number;
  /** Error message if execution failed */
  error?: string;
  /** Whether execution timed out */
  timedOut?: boolean;
}

/**
 * CLI Bridge for executing release-analysis CLI programmatically
 */
export class CLIBridge {
  private readonly defaultTimeout = 5 * 60 * 1000; // 5 minutes
  private readonly cliCommand = 'npm';
  private readonly cliArgs = ['run', 'release:analyze', '--'];

  /**
   * Execute the release-analysis CLI
   * 
   * @param options - Execution options
   * @returns Execution result with captured output
   */
  async execute(options: CLIExecutionOptions = {}): Promise<CLIExecutionResult> {
    const startTime = Date.now();
    const workingDir = options.workingDirectory || process.cwd();
    const timeout = options.timeout || this.defaultTimeout;
    const additionalArgs = options.args || [];

    // Build complete command arguments
    const args = [...this.cliArgs, ...additionalArgs];

    // Setup environment
    const env = {
      ...process.env,
      ...options.env,
      // Ensure npm uses the correct working directory
      PWD: workingDir
    };

    let stdout = '';
    let stderr = '';
    let exitCode: number | null = null;
    let timedOut = false;
    let childProcess: ChildProcess | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    try {
      // Create promise for process execution
      const executionPromise = new Promise<CLIExecutionResult>((resolve, reject) => {
        // Spawn the CLI process
        childProcess = spawn(this.cliCommand, args, {
          cwd: workingDir,
          env,
          stdio: ['pipe', 'pipe', 'pipe'] // stdin piped (so we can close it), stdout/stderr piped
        });
        
        // Immediately close stdin to prevent CLI from waiting for input
        // This is especially important for dry-run mode where readline might wait
        // We do this in a try-catch to handle cases where stdin might not be available
        try {
          if (childProcess.stdin && !childProcess.stdin.destroyed) {
            childProcess.stdin.end();
          }
        } catch (stdinError) {
          // Ignore errors closing stdin - process will still work
        }

        // Capture stdout
        if (childProcess.stdout) {
          childProcess.stdout.on('data', (data: Buffer) => {
            stdout += data.toString();
          });
        }

        // Capture stderr
        if (childProcess.stderr) {
          childProcess.stderr.on('data', (data: Buffer) => {
            stderr += data.toString();
          });
        }

        // Handle process exit
        childProcess.on('close', (code: number | null) => {
          exitCode = code;
          const duration = Date.now() - startTime;

          if (code === 0) {
            resolve({
              success: true,
              stdout,
              stderr,
              exitCode: code,
              duration
            });
          } else {
            resolve({
              success: false,
              stdout,
              stderr,
              exitCode: code,
              duration,
              error: `CLI exited with code ${code}`
            });
          }
        });

        // Handle process errors
        childProcess.on('error', (error: Error) => {
          const duration = Date.now() - startTime;
          reject({
            success: false,
            stdout,
            stderr,
            exitCode: null,
            duration,
            error: `Failed to spawn CLI process: ${error.message}`
          });
        });
      });

      // Create timeout promise with cleanup
      const timeoutPromise = new Promise<CLIExecutionResult>((resolve) => {
        timeoutId = setTimeout(() => {
          timedOut = true;
          
          // Kill the process if it's still running
          if (childProcess && !childProcess.killed) {
            childProcess.kill('SIGTERM');
            
            // Force kill after 5 seconds if still running
            setTimeout(() => {
              if (childProcess && !childProcess.killed) {
                childProcess.kill('SIGKILL');
              }
            }, 5000);
          }

          const duration = Date.now() - startTime;
          resolve({
            success: false,
            stdout,
            stderr,
            exitCode: null,
            duration,
            error: `CLI execution timed out after ${timeout}ms`,
            timedOut: true
          });
        }, timeout);
      });

      // Race between execution and timeout
      const result = await Promise.race([executionPromise, timeoutPromise]);
      
      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      
      // If error is already a CLIExecutionResult, return it
      if (typeof error === 'object' && error !== null && 'success' in error) {
        return error as CLIExecutionResult;
      }

      // Otherwise, wrap the error
      return {
        success: false,
        stdout,
        stderr,
        exitCode: null,
        duration,
        error: error instanceof Error ? error.message : String(error)
      };
    } finally {
      // Explicit cleanup in finally block to ensure resources are released
      
      // Clear timeout if it exists
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      
      // Ensure child process is cleaned up
      const processToClean = childProcess as ChildProcess | null;
      if (processToClean && !processToClean.killed) {
        try {
          // Remove all listeners to prevent memory leaks
          processToClean.removeAllListeners();
          
          // Kill the process if still running
          processToClean.kill('SIGTERM');
          
          // Give it a moment to terminate gracefully with a shorter timeout
          await new Promise<void>((resolve) => {
            const killTimeout = setTimeout(() => {
              if (processToClean && !processToClean.killed) {
                processToClean.kill('SIGKILL');
              }
              resolve();
            }, 500); // Reduced from 1000ms to 500ms
            
            // If process exits before timeout, clear the timeout
            processToClean.once('exit', () => {
              clearTimeout(killTimeout);
              resolve();
            });
            
            // Also resolve if process is already killed
            if (processToClean.killed) {
              clearTimeout(killTimeout);
              resolve();
            }
          });
        } catch (cleanupError) {
          // Log cleanup errors but don't throw - we're already in cleanup
          console.error('Error during process cleanup:', cleanupError);
        }
      }
      
      // Additional cleanup: ensure stdin is closed to prevent hanging
      const processForStdinCleanup = childProcess as ChildProcess | null;
      if (processForStdinCleanup && processForStdinCleanup.stdin && !processForStdinCleanup.stdin.destroyed) {
        try {
          processForStdinCleanup.stdin.end();
          processForStdinCleanup.stdin.destroy();
        } catch (stdinError) {
          // Ignore stdin cleanup errors
        }
      }
      
      // Force garbage collection hint for Node.js
      if (global.gc) {
        global.gc();
      }
    }
  }

  /**
   * Execute CLI with JSON output format
   * 
   * Convenience method that automatically adds --format json to arguments
   * 
   * @param options - Execution options
   * @returns Execution result with JSON output
   */
  async executeForJSON(options: CLIExecutionOptions = {}): Promise<CLIExecutionResult> {
    const jsonArgs = ['--format', 'json'];
    const combinedArgs = [...jsonArgs, ...(options.args || [])];

    return this.execute({
      ...options,
      args: combinedArgs
    });
  }

  /**
   * Execute CLI with specific analysis scope
   * 
   * @param since - Tag or commit to analyze from
   * @param options - Additional execution options
   * @returns Execution result
   */
  async executeWithScope(since: string, options: CLIExecutionOptions = {}): Promise<CLIExecutionResult> {
    const scopeArgs = ['--since', since];
    const combinedArgs = [...scopeArgs, ...(options.args || [])];

    return this.execute({
      ...options,
      args: combinedArgs
    });
  }

  /**
   * Execute CLI in dry-run mode
   * 
   * @param options - Execution options
   * @returns Execution result from dry-run
   */
  async executeDryRun(options: CLIExecutionOptions = {}): Promise<CLIExecutionResult> {
    const dryRunArgs = ['--dry-run', '--skip-confirmation'];
    const combinedArgs = [...dryRunArgs, ...(options.args || [])];

    return this.execute({
      ...options,
      args: combinedArgs
    });
  }

  /**
   * Check if CLI is available
   * 
   * Verifies that npm and the release:analyze script are available
   * 
   * @param workingDirectory - Directory to check in
   * @returns Whether CLI is available
   */
  async isAvailable(workingDirectory?: string): Promise<boolean> {
    try {
      const result = await this.execute({
        workingDirectory,
        args: ['--help'],
        timeout: 10000 // 10 second timeout for help command
      });

      // CLI is available if help command succeeds
      return result.success || result.stdout.includes('Release Analysis CLI');
    } catch {
      return false;
    }
  }

  /**
   * Get CLI version information
   * 
   * @param workingDirectory - Directory to check in
   * @returns Version string or null if unavailable
   */
  async getVersion(workingDirectory?: string): Promise<string | null> {
    try {
      const result = await this.execute({
        workingDirectory,
        args: ['--version'],
        timeout: 10000 // 10 second timeout for version command
      });

      if (result.success) {
        // Extract version from output (e.g., "Advanced Release Analysis CLI v1.0.0")
        const match = result.stdout.match(/v?(\d+\.\d+\.\d+)/);
        return match ? match[1] : null;
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Force cleanup of any remaining resources
   * 
   * This method should be called in test teardown to ensure
   * all child processes are terminated and resources are released.
   * 
   * @returns Promise that resolves when cleanup is complete
   */
  async forceCleanup(): Promise<void> {
    // Give any pending operations a moment to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
  }
}
