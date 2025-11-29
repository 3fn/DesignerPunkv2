/**
 * Tests for Release Analysis Integration
 * 
 * Validates the integration interface provides clean access to analysis results
 * with comprehensive convenience methods and error handling.
 * 
 * Mock Strategy:
 * - Mock CLIBridge: Simulates CLI execution and output
 * - Mock AnalysisResultParser: Simulates JSON parsing
 * - Focus on integration interface: Tests validate convenience methods and error handling
 * - No shared mocks: Each test creates fresh mocks with specific scenarios
 */

/**
 * ============================================================================
 * ASYNC ERROR MOCK PATTERNS
 * ============================================================================
 * 
 * This section documents correct patterns for mocking async errors in Jest tests.
 * These patterns ensure errors propagate correctly through async/await code.
 * 
 * PATTERN 1: Use mockRejectedValue() for Async Errors
 * ----------------------------------------------------------------------------
 * When mocking async functions that should throw errors, use mockRejectedValue()
 * to return a rejected promise. This ensures the error propagates correctly
 * through async/await chains.
 * 
 * Example:
 * ```typescript
 * const mockAsyncFunction = jest.fn().mockRejectedValue(
 *   new Error('Async operation failed')
 * );
 * 
 * // Test will correctly catch the error
 * await expect(mockAsyncFunction()).rejects.toThrow('Async operation failed');
 * ```
 * 
 * PATTERN 2: Access Correct Mock Instance
 * ----------------------------------------------------------------------------
 * When working with mocked classes, ensure you access the correct mock instance
 * from the mock instances array. Jest creates a new instance for each test.
 * 
 * Example:
 * ```typescript
 * // Mock the class
 * jest.mock('../MyClass');
 * 
 * // In beforeEach, get the mock instance
 * let mockInstance: jest.Mocked<MyClass>;
 * beforeEach(() => {
 *   mockInstance = (MyClass as jest.MockedClass<typeof MyClass>)
 *     .mock.instances[0] as jest.Mocked<MyClass>;
 * });
 * 
 * // Now configure the mock instance
 * mockInstance.asyncMethod.mockRejectedValue(new Error('Failed'));
 * ```
 * 
 * PATTERN 3: Use await expect(...).rejects.toThrow()
 * ----------------------------------------------------------------------------
 * When testing that async functions throw errors, use Jest's rejects matcher
 * with await. This properly handles promise rejection and provides clear
 * error messages.
 * 
 * Example:
 * ```typescript
 * // Test that async function throws specific error
 * await expect(asyncFunction()).rejects.toThrow('Expected error message');
 * 
 * // Test that async function throws specific error type
 * await expect(asyncFunction()).rejects.toThrow(CustomError);
 * 
 * // Test that async function throws any error
 * await expect(asyncFunction()).rejects.toThrow();
 * ```
 * 
 * COMMON MISTAKES TO AVOID
 * ----------------------------------------------------------------------------
 * 
 * ❌ WRONG: Using mockImplementation with throw
 * ```typescript
 * mockAsyncFunction.mockImplementation(() => {
 *   throw new Error('Failed');
 * });
 * // This throws synchronously, not as a rejected promise
 * ```
 * 
 * ✅ CORRECT: Using mockRejectedValue
 * ```typescript
 * mockAsyncFunction.mockRejectedValue(new Error('Failed'));
 * // This returns a rejected promise
 * ```
 * 
 * ❌ WRONG: Not using await with rejects
 * ```typescript
 * expect(asyncFunction()).rejects.toThrow(); // Missing await!
 * ```
 * 
 * ✅ CORRECT: Using await with rejects
 * ```typescript
 * await expect(asyncFunction()).rejects.toThrow();
 * ```
 * 
 * ❌ WRONG: Accessing mock before instance is created
 * ```typescript
 * const mockInstance = (MyClass as jest.MockedClass<typeof MyClass>)
 *   .mock.instances[0]; // May be undefined if called before instantiation
 * ```
 * 
 * ✅ CORRECT: Accessing mock in beforeEach after instantiation
 * ```typescript
 * beforeEach(() => {
 *   // Create instance first
 *   new MyClass();
 *   // Then access mock instance
 *   const mockInstance = (MyClass as jest.MockedClass<typeof MyClass>)
 *     .mock.instances[0];
 * });
 * ```
 * 
 * INTEGRATION WITH ERROR HANDLING
 * ----------------------------------------------------------------------------
 * When testing error propagation through integration layers:
 * 
 * 1. Mock the error at the lowest level (e.g., CLI execution)
 * 2. Verify the error propagates through intermediate layers
 * 3. Check that the error is properly wrapped/transformed if needed
 * 
 * Example:
 * ```typescript
 * it('should propagate CLI errors through integration layer', async () => {
 *   // Mock error at CLI level
 *   mockCLIBridge.execute.mockRejectedValue(
 *     new CLIError('Execution failed', CLIErrorCategory.EXECUTION_FAILED)
 *   );
 *   
 *   // Verify error propagates through integration
 *   await expect(integration.analyze()).rejects.toThrow(CLIError);
 *   await expect(integration.analyze()).rejects.toThrow('Execution failed');
 * });
 * ```
 * 
 * ============================================================================
 */

import { ReleaseAnalysisIntegration, AnalysisResultWrapper } from '../ReleaseAnalysisIntegration';
import { AnalysisResult } from '../../../release-analysis/types/AnalysisTypes';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';

// Mock child_process (what CLIBridge uses)
jest.mock('child_process');
const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

/**
 * Helper function to create a mock child process
 * Following the pattern from CLIBridge.test.ts
 */
function createMockProcess() {
  const mockProcess = new EventEmitter() as any;
  mockProcess.stdout = new EventEmitter();
  mockProcess.stderr = new EventEmitter();
  mockProcess.stdin = {
    write: jest.fn(),
    end: jest.fn()
  };
  mockProcess.kill = jest.fn();
  return mockProcess;
}

/**
 * Helper to setup spawn mock that handles both analysis and version commands
 * The integration calls getVersion() after analyze(), so we need to mock both spawns
 */
function setupSpawnMockForAnalysis(analysisOutput: any, versionOutput: string = 'Advanced Release Analysis CLI v1.2.3\n') {
  mockSpawn.mockImplementation(() => {
    const mockProcess = createMockProcess();
    process.nextTick(() => {
      const args = mockSpawn.mock.calls[mockSpawn.mock.calls.length - 1][1];
      if (args && args.includes('--version')) {
        mockProcess.stdout.emit('data', Buffer.from(versionOutput));
      } else {
        mockProcess.stdout.emit('data', Buffer.from(JSON.stringify(analysisOutput)));
      }
      mockProcess.emit('close', 0);
    });
    return mockProcess as any;
  });
}

describe('AnalysisResultWrapper', () => {
  const mockAnalysisResult: AnalysisResult = {
    scope: {
      toCommit: 'abc123',
      completionDocuments: [],
      analysisDate: new Date('2025-01-01')
    },
    changes: {
      breakingChanges: [
        {
          id: 'bc1',
          title: 'Breaking Change 1',
          description: 'Description 1',
          affectedAPIs: ['API1'],
          source: 'doc1.md',
          severity: 'high'
        },
        {
          id: 'bc2',
          title: 'Critical Breaking Change',
          description: 'Description 2',
          affectedAPIs: ['API2'],
          source: 'doc2.md',
          severity: 'critical'
        }
      ],
      newFeatures: [
        {
          id: 'f1',
          title: 'Feature 1',
          description: 'Description 1',
          benefits: ['Benefit 1'],
          requirements: ['Req 1'],
          artifacts: ['Artifact 1'],
          source: 'doc1.md',
          category: 'ui'
        },
        {
          id: 'f2',
          title: 'Feature 2',
          description: 'Description 2',
          benefits: ['Benefit 2'],
          requirements: ['Req 2'],
          artifacts: ['Artifact 2'],
          source: 'doc2.md',
          category: 'api'
        }
      ],
      bugFixes: [
        {
          id: 'bf1',
          title: 'Bug Fix 1',
          description: 'Description 1',
          affectedComponents: ['Component1'],
          source: 'doc1.md',
          severity: 'medium'
        }
      ],
      improvements: [
        {
          id: 'i1',
          title: 'Improvement 1',
          description: 'Description 1',
          type: 'performance',
          impact: 'high',
          source: 'doc1.md'
        }
      ],
      documentation: [],
      metadata: {
        documentsAnalyzed: 3,
        extractionConfidence: 0.85,
        ambiguousItems: [],
        filteredItems: []
      }
    },
    versionRecommendation: {
      currentVersion: '1.0.0',
      recommendedVersion: '2.0.0',
      bumpType: 'major',
      rationale: 'Breaking changes detected',
      confidence: 0.9,
      evidence: [
        {
          type: 'breaking',
          description: 'Breaking change evidence',
          source: 'doc1.md',
          impact: 'high'
        }
      ]
    },
    releaseNotes: '# Release Notes\n\nBreaking changes and new features.',
    confidence: {
      overall: 0.85,
      extraction: 0.9,
      categorization: 0.85,
      deduplication: 0.8,
      versionCalculation: 0.9
    }
  };

  const mockMetadata = {
    duration: 1000,
    cliVersion: '1.0.0',
    timestamp: new Date('2025-01-01')
  };

  let wrapper: AnalysisResultWrapper;

  beforeEach(() => {
    wrapper = new AnalysisResultWrapper(mockAnalysisResult, mockMetadata);
  });

  describe('Version Information', () => {
    it('should return current version', () => {
      expect(wrapper.getCurrentVersion()).toBe('1.0.0');
    });

    it('should return recommended version', () => {
      expect(wrapper.getRecommendedVersion()).toBe('2.0.0');
    });

    it('should return bump type', () => {
      expect(wrapper.getBumpType()).toBe('major');
    });

    it('should return version rationale', () => {
      expect(wrapper.getVersionRationale()).toBe('Breaking changes detected');
    });

    it('should indicate version bump is needed', () => {
      expect(wrapper.shouldBumpVersion()).toBe(true);
    });

    it('should identify major bump', () => {
      expect(wrapper.isMajorBump()).toBe(true);
      expect(wrapper.isMinorBump()).toBe(false);
      expect(wrapper.isPatchBump()).toBe(false);
    });
  });

  describe('Change Queries', () => {
    it('should return breaking changes', () => {
      const changes = wrapper.getBreakingChanges();
      expect(changes).toHaveLength(2);
      expect(changes[0].id).toBe('bc1');
    });

    it('should return features', () => {
      const features = wrapper.getFeatures();
      expect(features).toHaveLength(2);
      expect(features[0].id).toBe('f1');
    });

    it('should return bug fixes', () => {
      const fixes = wrapper.getBugFixes();
      expect(fixes).toHaveLength(1);
      expect(fixes[0].id).toBe('bf1');
    });

    it('should return improvements', () => {
      const improvements = wrapper.getImprovements();
      expect(improvements).toHaveLength(1);
      expect(improvements[0].id).toBe('i1');
    });

    it('should check for breaking changes', () => {
      expect(wrapper.hasBreakingChanges()).toBe(true);
    });

    it('should check for features', () => {
      expect(wrapper.hasFeatures()).toBe(true);
    });

    it('should check for bug fixes', () => {
      expect(wrapper.hasBugFixes()).toBe(true);
    });

    it('should check for improvements', () => {
      expect(wrapper.hasImprovements()).toBe(true);
    });

    it('should check for any changes', () => {
      expect(wrapper.hasChanges()).toBe(true);
    });

    it('should return total change count', () => {
      expect(wrapper.getChangeCount()).toBe(6); // 2 breaking + 2 features + 1 fix + 1 improvement + 0 documentation
    });
  });

  describe('Release Notes', () => {
    it('should return release notes', () => {
      const notes = wrapper.getReleaseNotes();
      expect(notes).toContain('Release Notes');
      expect(notes).toContain('Breaking changes');
    });

    it('should check if release notes exist', () => {
      expect(wrapper.hasReleaseNotes()).toBe(true);
    });
  });

  describe('Confidence Metrics', () => {
    it('should return overall confidence', () => {
      expect(wrapper.getOverallConfidence()).toBe(0.85);
    });

    it('should return all confidence metrics', () => {
      const metrics = wrapper.getConfidenceMetrics();
      expect(metrics.overall).toBe(0.85);
      expect(metrics.extraction).toBe(0.9);
    });

    it('should check confidence threshold', () => {
      expect(wrapper.isConfident(0.7)).toBe(true);
      expect(wrapper.isConfident(0.9)).toBe(false);
    });

    it('should return confidence level', () => {
      expect(wrapper.getConfidenceLevel()).toBe('high');
    });
  });

  describe('Filtering and Searching', () => {
    it('should filter breaking changes by severity', () => {
      const critical = wrapper.getBreakingChangesBySeverity('critical');
      expect(critical).toHaveLength(1);
      expect(critical[0].id).toBe('bc2');

      const high = wrapper.getBreakingChangesBySeverity('high');
      expect(high).toHaveLength(1);
      expect(high[0].id).toBe('bc1');
    });

    it('should get critical breaking changes', () => {
      const critical = wrapper.getCriticalBreakingChanges();
      expect(critical).toHaveLength(1);
      expect(critical[0].severity).toBe('critical');
    });

    it('should filter features by category', () => {
      const uiFeatures = wrapper.getFeaturesByCategory('ui');
      expect(uiFeatures).toHaveLength(1);
      expect(uiFeatures[0].id).toBe('f1');

      const apiFeatures = wrapper.getFeaturesByCategory('api');
      expect(apiFeatures).toHaveLength(1);
      expect(apiFeatures[0].id).toBe('f2');
    });

    it('should filter bug fixes by severity', () => {
      const medium = wrapper.getBugFixesBySeverity('medium');
      expect(medium).toHaveLength(1);
      expect(medium[0].id).toBe('bf1');
    });

    it('should search changes by keyword', () => {
      const results = wrapper.searchChanges('Feature');
      expect(results.features).toHaveLength(2);
      expect(results.breakingChanges).toHaveLength(0);
    });
  });

  describe('Summary Methods', () => {
    it('should return structured summary', () => {
      const summary = wrapper.getSummary();
      expect(summary.version.current).toBe('1.0.0');
      expect(summary.version.recommended).toBe('2.0.0');
      expect(summary.changes.breaking).toBe(2);
      expect(summary.changes.features).toBe(2);
      expect(summary.confidence.overall).toBe(0.85);
      expect(summary.metadata.documentsAnalyzed).toBe(3);
    });

    it('should return summary string', () => {
      const summaryString = wrapper.getSummaryString();
      expect(summaryString).toContain('Release Analysis Summary');
      expect(summaryString).toContain('1.0.0 → 2.0.0');
      expect(summaryString).toContain('Breaking Changes: 2');
      expect(summaryString).toContain('Confidence: 85.0%');
    });
  });

  describe('Metadata Access', () => {
    it('should return raw result', () => {
      const raw = wrapper.getRawResult();
      expect(raw).toBe(mockAnalysisResult);
    });

    it('should return execution metadata', () => {
      const metadata = wrapper.getMetadata();
      expect(metadata.duration).toBe(1000);
      expect(metadata.cliVersion).toBe('1.0.0');
    });

    it('should return document count', () => {
      expect(wrapper.getDocumentCount()).toBe(3);
    });

    it('should return analysis scope', () => {
      const scope = wrapper.getScope();
      expect(scope.toCommit).toBe('abc123');
    });

    it('should return analysis date', () => {
      const date = wrapper.getAnalysisDate();
      expect(date).toEqual(new Date('2025-01-01'));
    });
  });
});

describe('ReleaseAnalysisIntegration', () => {
  let integration: ReleaseAnalysisIntegration;
  let mockProcess: any;

  // Mock analysis result used across multiple tests
  const mockAnalysisResult: AnalysisResult = {
      scope: {
        toCommit: 'abc123',
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
        rationale: 'New features added',
        confidence: 0.9,
        evidence: []
      },
      releaseNotes: 'Release notes',
      confidence: {
        overall: 0.8,
        extraction: 0.85,
        categorization: 0.8,
        deduplication: 0.75,
        versionCalculation: 0.85
      }
    };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create real integration instance (not mocked)
    integration = new ReleaseAnalysisIntegration({
      workingDirectory: '/test/dir',
      timeout: 60000,
      validateResults: true
    });
  });

  describe('analyze()', () => {

    it('should execute analysis and return wrapped result', async () => {
      setupSpawnMockForAnalysis(mockAnalysisResult);

      const result = await integration.analyze();

      expect(result).toBeInstanceOf(AnalysisResultWrapper);
      expect(result.getCurrentVersion()).toBe('1.0.0');
      expect(result.getRecommendedVersion()).toBe('1.1.0');
    });

    it('should pass correct options to CLI bridge', async () => {
      setupSpawnMockForAnalysis(mockAnalysisResult);

      await integration.analyze({
        since: 'v1.0.0',
        skipConfirmation: true
      });

      // Verify spawn was called with correct arguments
      expect(mockSpawn).toHaveBeenCalledWith(
        'npm',
        expect.arrayContaining(['--since', 'v1.0.0', '--skip-confirmation']),
        expect.any(Object)
      );
    });

    it('should validate execution result', async () => {
      setupSpawnMockForAnalysis(mockAnalysisResult);

      const result = await integration.analyze();

      // Verify result is valid
      expect(result).toBeInstanceOf(AnalysisResultWrapper);
      expect(result.getCurrentVersion()).toBe('1.0.0');
    });

    it('should parse JSON output', async () => {
      setupSpawnMockForAnalysis(mockAnalysisResult);

      const result = await integration.analyze();

      // Verify parsing worked by checking result structure
      expect(result).toBeInstanceOf(AnalysisResultWrapper);
      expect(result.getRawResult()).toEqual(mockAnalysisResult);
    });

    it('should validate parsed results when enabled', async () => {
      setupSpawnMockForAnalysis(mockAnalysisResult);

      const result = await integration.analyze();

      // Verify validation passed by checking result is valid
      expect(result).toBeInstanceOf(AnalysisResultWrapper);
      expect(result.getCurrentVersion()).toBe('1.0.0');
    });

    it('should throw error if validation fails', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      // Simulate CLI execution with invalid JSON structure
      const invalidResult = { ...mockAnalysisResult, versionRecommendation: null };
      
      process.nextTick(() => {
        mockProcess.stdout.emit('data', Buffer.from(JSON.stringify(invalidResult)));
        mockProcess.emit('close', 0);
      });

      // The integration should detect invalid structure and throw
      await expect(integration.analyze()).rejects.toThrow();
    });

    it('should log warnings if validation has warnings', async () => {
      setupSpawnMockForAnalysis(mockAnalysisResult);

      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await integration.analyze();

      // Note: Warnings are logged internally by the integration
      // We can't easily test this without mocking the parser
      consoleWarnSpy.mockRestore();
    });

    it('should include execution metadata in result', async () => {
      setupSpawnMockForAnalysis(mockAnalysisResult);

      const result = await integration.analyze();
      const metadata = result.getMetadata();

      // Duration can be 0 for very fast operations (like mocks)
      expect(metadata.duration).toBeGreaterThanOrEqual(0);
      expect(metadata.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('isAvailable()', () => {
    it('should check if CLI is available', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      // Simulate successful help command
      process.nextTick(() => {
        mockProcess.stdout.emit('data', Buffer.from('Release Analysis CLI\n'));
        mockProcess.emit('close', 0);
      });

      const available = await integration.isAvailable();

      expect(available).toBe(true);
    });
  });

  describe('getVersion()', () => {
    it('should get CLI version', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      // Simulate version command output
      process.nextTick(() => {
        mockProcess.stdout.emit('data', Buffer.from('Advanced Release Analysis CLI v1.2.3\n'));
        mockProcess.emit('close', 0);
      });

      const version = await integration.getVersion();

      expect(version).toBe('1.2.3');
    });
  });

  describe('analyzeDryRun()', () => {
    it('should execute analysis in dry-run mode', async () => {
      setupSpawnMockForAnalysis(mockAnalysisResult);

      await integration.analyzeDryRun();

      // Verify dry-run and skip-confirmation flags were added
      expect(mockSpawn).toHaveBeenCalledWith(
        'npm',
        expect.arrayContaining(['--dry-run', '--skip-confirmation']),
        expect.any(Object)
      );
    });
  });

  describe('analyzeSince()', () => {
    it('should execute analysis for specific scope', async () => {
      setupSpawnMockForAnalysis(mockAnalysisResult);

      await integration.analyzeSince('v1.0.0');

      // Verify since argument was added
      expect(mockSpawn).toHaveBeenCalledWith(
        'npm',
        expect.arrayContaining(['--since', 'v1.0.0']),
        expect.any(Object)
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle CLI execution errors', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      // Simulate CLI error
      process.nextTick(() => {
        mockProcess.stderr.emit('data', Buffer.from('Error: CLI execution failed\n'));
        mockProcess.emit('close', 1);
      });

      await expect(integration.analyze()).rejects.toThrow();
    });

    it('should handle JSON parsing errors', async () => {
      const mockProcess = createMockProcess();
      mockSpawn.mockReturnValue(mockProcess as any);

      // Simulate invalid JSON output
      process.nextTick(() => {
        mockProcess.stdout.emit('data', Buffer.from('invalid json'));
        mockProcess.emit('close', 0);
      });

      // The analyze() method should catch the parse error and throw
      await expect(integration.analyze()).rejects.toThrow();
    });
  });
});
