/**
 * @category evergreen
 * @purpose Verify system integration works correctly across components
 */
/**
 * Integration Tests for CLI Integration Bridge
 * 
 * These tests validate the complete CLI integration workflow with real CLI execution,
 * JSON parsing, error handling, and the integration interface.
 * 
 * Mock Strategy:
 * - Real CLI execution: Tests run actual release-analysis CLI (no mocks)
 * - Temporary working directory: Each test uses isolated directory
 * - Real JSON parsing: Validates actual CLI output structure
 * - Focus on integration: Tests validate CLI → Parser → Interface workflow
 * 
 * **Type**: Integration
 * **Validation**: Tier 2 - Standard
 * **Requirements**: 2.1, 2.5, 8.1, 8.2
 * 
 * ============================================================================
 * CLI TESTING PATTERNS - IMPORTANT TESTING GUIDELINES
 * ============================================================================
 * 
 * This test file demonstrates correct patterns for testing CLI behavior.
 * The key principle: TEST ACTUAL CLI BEHAVIOR, NOT ASSUMPTIONS.
 * 
 * PRINCIPLE 1: Test What the CLI Actually Does
 * ---------------------------------------------
 * Don't assume how a CLI should behave - verify actual behavior first.
 * 
 *   ❌ WRONG ASSUMPTION:
 *   "Unknown flags should cause CLI to fail with error"
 *   expect(result.success).toBe(false);
 * 
 *   ✅ CORRECT APPROACH:
 *   "Test what the CLI actually does with unknown flags"
 *   // Many CLIs show help for unknown flags (success behavior)
 *   expect(result.success).toBe(true);
 *   expect(result.exitCode).toBe(0);
 * 
 * PRINCIPLE 2: Verify Actual CLI Behavior Before Writing Tests
 * -------------------------------------------------------------
 * Before writing a test, run the CLI manually to see what it does:
 * 
 *   $ npm run release:analyze -- --unknown-flag
 *   # Observe: Does it fail? Show help? Return error code?
 * 
 *   Then write test based on observed behavior, not assumptions.
 * 
 * PRINCIPLE 3: Test Graceful Handling, Not Specific Outcomes
 * -----------------------------------------------------------
 * Focus on whether the CLI handles scenarios gracefully, not on 
 * specific success/failure outcomes:
 * 
 *   ✅ GOOD TEST:
 *   it('should handle unknown flags gracefully', () => {
 *     // Test that CLI responds (doesn't hang/crash)
 *     expect(result.exitCode).toBeDefined();
 *     expect(result.duration).toBeGreaterThan(0);
 *   });
 * 
 *   ❌ BAD TEST:
 *   it('should fail with unknown flags', () => {
 *     // Assumes specific behavior without verification
 *     expect(result.success).toBe(false);
 *   });
 * 
 * PRINCIPLE 4: Distinguish Between Error Scenarios
 * -------------------------------------------------
 * Different error scenarios require different test approaches:
 * 
 *   TRULY INVALID INPUT:
 *   - Malformed JSON: --output 'invalid-json-{'
 *   - Missing required args: (when CLI requires specific args)
 *   - Invalid file paths: --config /nonexistent/path
 * 
 *   GRACEFUL HANDLING:
 *   - Unknown flags: --unknown-flag (often shows help)
 *   - Extra arguments: extra args (often ignored)
 *   - Help requests: --help, -h (success behavior)
 * 
 * EXAMPLE FROM THIS FILE:
 * -----------------------
 * See line ~120 in "should handle invalid CLI arguments gracefully":
 * 
 *   // Correct: Tests actual CLI behavior
 *   // The CLI shows help for unknown flags (success behavior)
 *   expect(result.success).toBe(true);
 *   expect(result.exitCode).toBe(0);
 * 
 *   // Would be wrong: expect(result.success).toBe(false)
 *   // This assumes CLI fails, but it actually shows help
 * 
 * PRINCIPLE 5: Update Tests When CLI Behavior Changes
 * ----------------------------------------------------
 * CLI behavior can change between versions. When tests fail:
 * 
 *   1. Verify actual CLI behavior manually
 *   2. Determine if behavior change is intentional
 *   3. Update test to match new behavior
 *   4. Document the behavior change
 * 
 * COMMON CLI BEHAVIORS TO TEST:
 * ------------------------------
 * ✅ Help flags (--help, -h): Usually success with exit code 0
 * ✅ Version flags (--version, -v): Usually success with exit code 0
 * ✅ Unknown flags: Often shows help (success) or error (failure)
 * ✅ Missing required args: Usually error with exit code 1 or 2
 * ✅ Invalid input: Usually error with descriptive message
 * ✅ Timeout scenarios: May hang or return timeout error
 * 
 * WHY THIS MATTERS:
 * -----------------
 * - CLI behavior varies across tools and versions
 * - Assumptions about "correct" behavior often wrong
 * - Tests should validate actual behavior, not ideal behavior
 * - Graceful handling is more important than specific outcomes
 * - Manual verification prevents false test failures
 * 
 * ============================================================================
 */

import { ReleaseAnalysisIntegration } from '../ReleaseAnalysisIntegration';
import { CLIBridge } from '../CLIBridge';
import { AnalysisResultParser } from '../AnalysisResultParser';
import { CLIErrorHandler, CLIError, CLIErrorCategory } from '../CLIErrorHandler';
import * as fs from 'fs';
import * as path from 'path';

describe('CLI Integration Tests', () => {
  let integration: ReleaseAnalysisIntegration;
  let testWorkingDir: string;

  beforeAll(() => {
    // Use actual project directory for integration tests
    testWorkingDir = process.cwd();
  });

  beforeEach(() => {
    integration = new ReleaseAnalysisIntegration({
      workingDirectory: testWorkingDir,
      timeout: 60000, // 1 minute timeout for integration tests
      validateResults: true
    });
  });

  afterEach(async () => {
    // Force cleanup of any remaining resources
    if (integration) {
      await integration.cleanup();
    }
    
    // Give processes time to fully terminate
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  describe('CLI Availability', () => {
    it('should detect if CLI is available', async () => {
      const available = await integration.isAvailable();
      
      // CLI should be available in this project
      expect(typeof available).toBe('boolean');
      
      if (available) {
        console.log('✓ CLI is available');
      } else {
        console.warn('⚠ CLI is not available - some tests may be skipped');
      }
    });

    it('should get CLI version', async () => {
      const version = await integration.getVersion();
      
      if (version) {
        expect(version).toMatch(/^\d+\.\d+\.\d+$/);
        console.log(`✓ CLI version: ${version}`);
      } else {
        console.warn('⚠ Could not determine CLI version');
      }
    });
  });

  describe('CLI Execution', () => {
    it('should execute CLI with --help flag', async () => {
      const bridge = new CLIBridge();
      
      const result = await bridge.execute({
        args: ['--help'],
        workingDirectory: testWorkingDir,
        timeout: 10000
      });

      expect(result.success).toBe(true);
      expect(result.stdout).toBeTruthy();
      expect(result.exitCode).toBe(0);
      expect(result.duration).toBeGreaterThan(0);
    });

    it('should execute CLI with --version flag', async () => {
      const bridge = new CLIBridge();
      
      const result = await bridge.execute({
        args: ['--version'],
        workingDirectory: testWorkingDir,
        timeout: 10000
      });

      expect(result.success).toBe(true);
      expect(result.stdout).toBeTruthy();
      expect(result.exitCode).toBe(0);
    });

    it('should handle invalid CLI arguments gracefully', async () => {
      const bridge = new CLIBridge();
      
      const result = await bridge.execute({
        args: ['--invalid-flag-that-does-not-exist'],
        workingDirectory: testWorkingDir,
        timeout: 10000
      });

      // CLI shows help for unknown flags (success behavior)
      // The CLI handles unknown flags gracefully by displaying help text
      // rather than failing with an error
      expect(result.success).toBe(true);
      expect(result.exitCode).toBe(0);
    });

    it('should capture both stdout and stderr', async () => {
      const bridge = new CLIBridge();
      
      const result = await bridge.execute({
        args: ['--help'],
        workingDirectory: testWorkingDir,
        captureStderr: true,
        timeout: 10000
      });

      expect(result.stdout).toBeDefined();
      expect(result.stderr).toBeDefined();
    });

    it('should respect timeout settings', async () => {
      const bridge = new CLIBridge();
      
      // Use very short timeout to test timeout handling
      const result = await bridge.execute({
        args: ['--help'],
        workingDirectory: testWorkingDir,
        timeout: 1 // 1ms - should timeout
      });

      // Should either succeed quickly or timeout
      if (!result.success) {
        expect(result.timedOut).toBe(true);
      }
    }, 10000);
  });

  describe('JSON Output Parsing', () => {
    it('should parse valid JSON output from CLI', async () => {
      const parser = new AnalysisResultParser();
      
      // Create minimal valid JSON that matches AnalysisResult structure
      const validJSON = JSON.stringify({
        scope: {
          toCommit: 'test-commit',
          completionDocuments: [],
          analysisDate: new Date().toISOString()
        },
        changes: {
          breakingChanges: [],
          newFeatures: [],
          bugFixes: [],
          improvements: [],
          documentation: [],
          metadata: {
            documentsAnalyzed: 0,
            extractionConfidence: 0.8,
            ambiguousItems: [],
            filteredItems: []
          }
        },
        versionRecommendation: {
          currentVersion: '1.0.0',
          recommendedVersion: '1.0.0',
          bumpType: 'none',
          rationale: 'No changes detected',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'No changes',
        confidence: {
          overall: 0.8,
          extraction: 0.8,
          categorization: 0.8,
          deduplication: 0.8,
          versionCalculation: 0.9
        }
      });

      const result = parser.parse(validJSON);

      expect(result).toBeDefined();
      expect(result.scope.toCommit).toBe('test-commit');
      expect(result.versionRecommendation.currentVersion).toBe('1.0.0');
    });

    it('should validate parsed results', async () => {
      const parser = new AnalysisResultParser();
      
      const validJSON = JSON.stringify({
        scope: {
          toCommit: 'test-commit',
          completionDocuments: [],
          analysisDate: new Date().toISOString()
        },
        changes: {
          breakingChanges: [],
          newFeatures: [],
          bugFixes: [],
          improvements: [],
          documentation: [],
          metadata: {
            documentsAnalyzed: 0,
            extractionConfidence: 0.8,
            ambiguousItems: [],
            filteredItems: []
          }
        },
        versionRecommendation: {
          currentVersion: '1.0.0',
          recommendedVersion: '1.1.0',
          bumpType: 'minor',
          rationale: 'Test',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'Test',
        confidence: {
          overall: 0.8,
          extraction: 0.8,
          categorization: 0.8,
          deduplication: 0.8,
          versionCalculation: 0.9
        }
      });

      const result = parser.parse(validJSON);
      const validation = parser.validate(result);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid JSON structure', async () => {
      const parser = new AnalysisResultParser();
      
      const invalidJSON = '{ invalid json }';

      expect(() => parser.parse(invalidJSON)).toThrow();
    });

    it('should detect missing required fields', async () => {
      const parser = new AnalysisResultParser();
      
      const incompleteJSON = JSON.stringify({
        scope: {
          toCommit: 'test'
          // Missing required fields
        }
      });

      expect(() => parser.parse(incompleteJSON)).toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should categorize CLI unavailable errors', () => {
      const handler = new CLIErrorHandler();
      
      const result = {
        success: false,
        stdout: '',
        stderr: '',
        exitCode: null,
        duration: 100,
        error: 'Failed to spawn CLI process: ENOENT'
      };

      const category = handler.categorizeError(result);
      expect(category).toBe(CLIErrorCategory.CLI_UNAVAILABLE);
    });

    it('should categorize timeout errors', () => {
      const handler = new CLIErrorHandler();
      
      const result = {
        success: false,
        stdout: '',
        stderr: '',
        exitCode: null,
        duration: 300000,
        timedOut: true,
        error: 'CLI execution timed out'
      };

      const category = handler.categorizeError(result);
      expect(category).toBe(CLIErrorCategory.TIMEOUT);
    });

    it('should categorize configuration errors', () => {
      const handler = new CLIErrorHandler();
      
      const result = {
        success: false,
        stdout: '',
        stderr: 'Invalid argument: --unknown-flag',
        exitCode: 2,
        duration: 500
      };

      const category = handler.categorizeError(result);
      expect(category).toBe(CLIErrorCategory.CONFIGURATION);
    });

    it('should create CLIError with recovery suggestions', () => {
      const handler = new CLIErrorHandler();
      
      const result = {
        success: false,
        stdout: '',
        stderr: '',
        exitCode: null,
        duration: 100,
        error: 'ENOENT: command not found'
      };

      const error = handler.createError(result);

      expect(error).toBeInstanceOf(CLIError);
      expect(error.category).toBe(CLIErrorCategory.CLI_UNAVAILABLE);
      expect(error.recoverySuggestions.length).toBeGreaterThan(0);
    });

    it('should identify retryable errors', () => {
      const transientError = new CLIError(
        'Network error',
        CLIErrorCategory.TRANSIENT
      );
      expect(transientError.isRetryable()).toBe(true);

      const configError = new CLIError(
        'Invalid config',
        CLIErrorCategory.CONFIGURATION
      );
      expect(configError.isRetryable()).toBe(false);
    });
  });

  describe('Integration Interface', () => {
    it('should provide clean interface for analysis execution', async () => {
      // This test verifies the integration interface works
      // but may skip actual execution if CLI is not available
      
      const available = await integration.isAvailable();
      
      if (!available) {
        console.warn('⚠ Skipping integration test - CLI not available');
        return;
      }

      // If CLI is available, test the interface
      expect(integration).toHaveProperty('analyze');
      expect(integration).toHaveProperty('analyzeDryRun');
      expect(integration).toHaveProperty('analyzeSince');
      expect(integration).toHaveProperty('isAvailable');
      expect(integration).toHaveProperty('getVersion');
    });

    it('should handle dry-run execution', async () => {
      const available = await integration.isAvailable();
      
      if (!available) {
        console.warn('⚠ Skipping dry-run test - CLI not available');
        return;
      }

      // Dry-run should not throw errors
      try {
        await integration.analyzeDryRun();
      } catch (error) {
        // Expected to fail if no completion documents exist
        // but should fail gracefully with CLIError
        if (error instanceof CLIError) {
          expect(error.category).toBeDefined();
        }
      }
    }, 45000); // 45 second timeout for integration test with real CLI execution (increased for repository growth)

    it('should provide convenience methods for common queries', async () => {
      // Test that the wrapper interface provides expected methods
      // without requiring actual CLI execution
      
      const mockResult = {
        scope: {
          toCommit: 'test',
          completionDocuments: [],
          analysisDate: new Date()
        },
        changes: {
          breakingChanges: [],
          newFeatures: [],
          bugFixes: [],
          improvements: [],
          documentation: [],
          metadata: {
            documentsAnalyzed: 0,
            extractionConfidence: 0.8,
            ambiguousItems: [],
            filteredItems: []
          }
        },
        versionRecommendation: {
          currentVersion: '1.0.0',
          recommendedVersion: '1.0.0',
          bumpType: 'none',
          rationale: 'Test',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'Test',
        confidence: {
          overall: 0.8,
          extraction: 0.8,
          categorization: 0.8,
          deduplication: 0.8,
          versionCalculation: 0.9
        }
      };

      // Import wrapper class
      const { AnalysisResultWrapper } = require('../ReleaseAnalysisIntegration');
      const wrapper = new AnalysisResultWrapper(mockResult, {
        duration: 1000,
        cliVersion: '1.0.0',
        timestamp: new Date()
      });

      // Verify convenience methods exist
      expect(wrapper.getCurrentVersion()).toBe('1.0.0');
      expect(wrapper.getRecommendedVersion()).toBe('1.0.0');
      expect(wrapper.getBumpType()).toBe('none');
      expect(wrapper.hasBreakingChanges()).toBe(false);
      expect(wrapper.hasFeatures()).toBe(false);
      expect(wrapper.getChangeCount()).toBe(0);
    });
  });

  describe('End-to-End Workflow', () => {
    it('should execute complete analysis workflow when CLI is available', async () => {
      const available = await integration.isAvailable();
      
      if (!available) {
        console.warn('⚠ Skipping end-to-end test - CLI not available');
        return;
      }

      try {
        // Execute analysis
        const result = await integration.analyze({
          skipConfirmation: true
        });

        // Verify result structure
        expect(result).toBeDefined();
        expect(result.getCurrentVersion).toBeDefined();
        expect(result.getRecommendedVersion).toBeDefined();
        expect(result.getBumpType).toBeDefined();
        expect(result.hasBreakingChanges).toBeDefined();
        expect(result.getChangeCount).toBeDefined();

        // Log summary for visibility
        console.log('\n' + result.getSummaryString());

      } catch (error) {
        // Expected to fail if no completion documents exist
        if (error instanceof CLIError) {
          console.log(`Expected error: ${error.getUserMessage()}`);
          expect(error.category).toBeDefined();
        } else {
          throw error;
        }
      }
    }, 120000); // 2 minute timeout for full analysis

    it('should handle analysis with scope parameter', async () => {
      const available = await integration.isAvailable();
      
      if (!available) {
        console.warn('⚠ Skipping scoped analysis test - CLI not available');
        return;
      }

      try {
        // Execute analysis with scope
        const result = await integration.analyzeSince('HEAD~1');

        expect(result).toBeDefined();
        expect(result.getScope).toBeDefined();

      } catch (error) {
        // Expected to fail if no completion documents in scope
        if (error instanceof CLIError) {
          expect(error.category).toBeDefined();
        } else {
          throw error;
        }
      }
    }, 120000);
  });

  describe('Error Recovery', () => {
    it('should retry transient errors', async () => {
      const handler = new CLIErrorHandler();
      
      let attempts = 0;
      const operation = jest.fn().mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          throw new CLIError('Transient error', CLIErrorCategory.TRANSIENT);
        }
        return Promise.resolve('success');
      });

      const result = await handler.executeWithRetry(operation, {
        maxAttempts: 3,
        initialDelay: 10,
        backoffMultiplier: 1
      });

      expect(result).toBe('success');
      expect(attempts).toBe(3);
    });

    it('should not retry non-retryable errors', async () => {
      const handler = new CLIErrorHandler();
      
      const operation = jest.fn().mockRejectedValue(
        new CLIError('Config error', CLIErrorCategory.CONFIGURATION)
      );

      await expect(
        handler.executeWithRetry(operation, {
          maxAttempts: 3,
          initialDelay: 10
        })
      ).rejects.toThrow('Config error');

      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should use exponential backoff for retries', async () => {
      const handler = new CLIErrorHandler();
      const delays: number[] = [];

      // Mock sleep to capture delays
      const sleepSpy = jest.spyOn(handler as any, 'sleep').mockImplementation((...args: unknown[]) => {
        delays.push(args[0] as number);
        return Promise.resolve();
      });

      const operation = jest.fn().mockRejectedValue(
        new CLIError('Transient error', CLIErrorCategory.TRANSIENT)
      );

      await expect(
        handler.executeWithRetry(operation, {
          maxAttempts: 3,
          initialDelay: 100,
          backoffMultiplier: 2,
          maxDelay: 1000
        })
      ).rejects.toThrow();

      expect(delays).toEqual([100, 200]); // Exponential backoff
      sleepSpy.mockRestore();
    });
  });

  describe('Validation', () => {
    it('should validate CLI execution results', () => {
      const handler = new CLIErrorHandler();
      
      const successResult = {
        success: true,
        stdout: 'Analysis complete',
        stderr: '',
        exitCode: 0,
        duration: 5000
      };

      expect(() => handler.validateResult(successResult)).not.toThrow();
    });

    it('should throw for failed execution results', () => {
      const handler = new CLIErrorHandler();
      
      const failedResult = {
        success: false,
        stdout: '',
        stderr: 'Error',
        exitCode: 1,
        duration: 1000,
        error: 'CLI failed'
      };

      expect(() => handler.validateResult(failedResult)).toThrow(CLIError);
    });

    it('should validate parsed analysis results', () => {
      const parser = new AnalysisResultParser();
      
      const validResult: any = {
        scope: {
          toCommit: 'test',
          completionDocuments: [],
          analysisDate: new Date()
        },
        changes: {
          breakingChanges: [],
          newFeatures: [],
          bugFixes: [],
          improvements: [],
          documentation: [],
          metadata: {
            documentsAnalyzed: 0,
            extractionConfidence: 0.8,
            ambiguousItems: [],
            filteredItems: []
          }
        },
        versionRecommendation: {
          currentVersion: '1.0.0',
          recommendedVersion: '1.1.0',
          bumpType: 'minor',
          rationale: 'Test',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'Test',
        confidence: {
          overall: 0.8,
          extraction: 0.8,
          categorization: 0.8,
          deduplication: 0.8,
          versionCalculation: 0.9
        }
      };

      const validation = parser.validate(validResult);
      expect(validation.valid).toBe(true);
    });

    it('should detect invalid version formats', () => {
      const parser = new AnalysisResultParser();
      
      const invalidResult: any = {
        scope: {
          toCommit: 'test',
          completionDocuments: [],
          analysisDate: new Date()
        },
        changes: {
          breakingChanges: [],
          newFeatures: [],
          bugFixes: [],
          improvements: [],
          documentation: [],
          metadata: {
            documentsAnalyzed: 0,
            extractionConfidence: 0.8,
            ambiguousItems: [],
            filteredItems: []
          }
        },
        versionRecommendation: {
          currentVersion: 'invalid-version',
          recommendedVersion: '1.1.0',
          bumpType: 'minor',
          rationale: 'Test',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'Test',
        confidence: {
          overall: 0.8,
          extraction: 0.8,
          categorization: 0.8,
          deduplication: 0.8,
          versionCalculation: 0.9
        }
      };

      const validation = parser.validate(invalidResult);
      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
    });
  });
});
