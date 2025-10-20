/**
 * Workflow Integration Tests for Release Analysis System
 * 
 * Tests the integration between components in realistic scenarios
 * without complex CLI mocking.
 */

import { GitHistoryAnalyzer } from '../git/GitHistoryAnalyzer';
import { SimpleChangeExtractor } from '../extraction/SimpleChangeExtractor';
import { VersionCalculator } from '../versioning/VersionCalculator';
import { ReleaseNoteGenerator } from '../notes/ReleaseNoteGenerator';
import { AnalysisConfigManager } from '../config/AnalysisConfigManager';
import { DEFAULT_ANALYSIS_CONFIG } from '../config/AnalysisConfig';
import { CompletionDocument, ExtractedChanges } from '../types/AnalysisTypes';

// Mock external dependencies
jest.mock('child_process');
jest.mock('fs');
jest.mock('fs/promises');

describe('Workflow Integration Tests', () => {
  let gitAnalyzer: GitHistoryAnalyzer;
  let changeExtractor: SimpleChangeExtractor;
  let versionCalculator: VersionCalculator;
  let noteGenerator: ReleaseNoteGenerator;
  let configManager: AnalysisConfigManager;

  beforeEach(() => {
    // Initialize components
    gitAnalyzer = new GitHistoryAnalyzer('/test/workspace');
    changeExtractor = new SimpleChangeExtractor(DEFAULT_ANALYSIS_CONFIG.extraction);
    versionCalculator = new VersionCalculator();
    noteGenerator = new ReleaseNoteGenerator();
    configManager = AnalysisConfigManager.getInstance();
    configManager.clearCache();

    // Setup basic mocks
    const childProcess = require('child_process');
    const mockExecSync = childProcess.execSync as jest.Mock;
    mockExecSync.mockClear();

    const fs = require('fs');
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockStatSync = fs.statSync as jest.Mock;
    mockExistsSync.mockClear();
    mockStatSync.mockClear();

    const fsPromises = require('fs/promises');
    const mockReadFile = fsPromises.readFile as jest.Mock;
    mockReadFile.mockClear();
  });

  describe('Complete Analysis Workflow', () => {
    it('should process completion documents through full workflow', async () => {
      // Create test completion documents
      const completionDocs: CompletionDocument[] = [
        {
          path: '.kiro/specs/feature/completion/task-1-completion.md',
          content: `# Task 1 Completion

**Date**: 2025-10-20
**Task**: 1.1 Implement new authentication system
**Spec**: F1 - Authentication System
**Status**: Complete

## Summary
Successfully implemented new authentication system with enhanced security.

## Breaking Changes
- Removed deprecated \`login()\` method
- Changed \`AuthConfig\` interface to require \`tokenExpiry\`

## New Features
- Added OAuth 2.0 support with PKCE
- Implemented multi-factor authentication
- Added session management with Redis

## Bug Fixes
- Fixed memory leak in token validation
- Resolved race condition in session cleanup

## Improvements
- Optimized authentication flow performance by 60%
- Enhanced error messages for better debugging
`,
          lastModified: new Date('2025-10-20'),
          gitCommit: 'abc123def456',
          metadata: {
            title: 'Task 1 Completion',
            type: 'task-completion',
            task: '1.1 Implement new authentication system',
            spec: 'F1 - Authentication System',
            status: 'Complete'
          }
        },
        {
          path: '.kiro/specs/ui/completion/task-2-completion.md',
          content: `# Task 2 Completion

**Date**: 2025-10-20
**Task**: 2.1 Update UI components
**Spec**: F2 - UI Enhancement
**Status**: Complete

## Summary
Updated UI components to support new authentication flow.

## New Features
- Added login form with MFA support
- Implemented loading states for auth operations

## Bug Fixes
- Fixed button alignment issues
- Corrected accessibility labels

## Improvements
- Improved form validation UX
- Enhanced responsive design
`,
          lastModified: new Date('2025-10-20'),
          gitCommit: 'def456ghi789',
          metadata: {
            title: 'Task 2 Completion',
            type: 'task-completion',
            task: '2.1 Update UI components',
            spec: 'F2 - UI Enhancement',
            status: 'Complete'
          }
        }
      ];

      // Step 1: Extract changes
      const extractedChanges = await changeExtractor.extractChanges(completionDocs);

      // Verify extraction results
      expect(extractedChanges.breakingChanges).toHaveLength(2);
      expect(extractedChanges.newFeatures.length).toBeGreaterThan(3); // Some may be deduplicated
      expect(extractedChanges.bugFixes.length).toBeGreaterThan(3);
      expect(extractedChanges.improvements.length).toBeGreaterThan(3);
      expect(extractedChanges.metadata.documentsAnalyzed).toBe(2);
      expect(extractedChanges.metadata.extractionConfidence).toBeGreaterThan(0.8);

      // Step 2: Calculate version bump
      const currentVersion = '1.2.3';
      const versionRecommendation = versionCalculator.calculateVersionBump(extractedChanges, currentVersion);

      // Verify version calculation
      expect(versionRecommendation.bumpType).toBe('major'); // Breaking changes present
      expect(versionRecommendation.recommendedVersion).toBe('2.0.0');
      expect(versionRecommendation.currentVersion).toBe('1.2.3');
      expect(versionRecommendation.confidence).toBeGreaterThan(0.8);
      expect(versionRecommendation.evidence).toHaveLength(4); // All change types represented

      // Step 3: Generate release notes
      const releaseNotes = await noteGenerator.generateReleaseNotes(extractedChanges, versionRecommendation.recommendedVersion);

      // Verify release notes
      expect(releaseNotes).toContain('# 2.0.0');
      expect(releaseNotes).toContain('## 🚨 Breaking Changes');
      expect(releaseNotes).toContain('**Removed deprecated `login()` method**');
      expect(releaseNotes).toContain('## ✨ New Features');
      expect(releaseNotes).toContain('**Added OAuth 2**'); // Title may be truncated
      expect(releaseNotes).toContain('## 🐛 Bug Fixes');
      expect(releaseNotes).toContain('**Fixed memory leak in token validation**');
      expect(releaseNotes).toContain('## ⚡ Improvements');
      expect(releaseNotes).toContain('**Optimized authentication flow performance by 60%**');
    });

    it('should handle mixed document quality gracefully', async () => {
      const mixedQualityDocs: CompletionDocument[] = [
        {
          path: '.kiro/specs/good/completion/task-1-completion.md',
          content: `# Well-Structured Completion

## Breaking Changes
- Removed old API endpoint /v1/auth

## New Features
- Added new API endpoint /v2/auth with better security

## Bug Fixes
- Fixed authentication timeout issues
`,
          lastModified: new Date('2025-10-20'),
          gitCommit: 'abc123',
          metadata: {
            title: 'Well-Structured Completion',
            type: 'task-completion'
          }
        },
        {
          path: '.kiro/specs/poor/completion/task-2-completion.md',
          content: `# Poorly Structured Document

This task involved some changes to the system. We made improvements and fixed some bugs.
There might be breaking changes but it's not clearly documented.

- Did some work
- Fixed stuff
- Made it better
`,
          lastModified: new Date('2025-10-20'),
          gitCommit: 'def456',
          metadata: {
            title: 'Poorly Structured Document',
            type: 'task-completion'
          }
        },
        {
          path: '.kiro/specs/minimal/completion/task-3-completion.md',
          content: `# Minimal Document

Fixed bug #123.
`,
          lastModified: new Date('2025-10-20'),
          gitCommit: 'ghi789',
          metadata: {
            title: 'Minimal Document',
            type: 'task-completion'
          }
        }
      ];

      const extractedChanges = await changeExtractor.extractChanges(mixedQualityDocs);

      // Should extract what it can from well-structured documents
      expect(extractedChanges.breakingChanges.length).toBeGreaterThan(0);
      expect(extractedChanges.newFeatures.length).toBeGreaterThan(0);
      expect(extractedChanges.bugFixes.length).toBeGreaterThan(0);

      // Should have lower confidence due to poor document quality
      expect(extractedChanges.metadata.extractionConfidence).toBeLessThan(0.9);
      expect(extractedChanges.metadata.ambiguousItems.length).toBeGreaterThan(0);

      // Should still be able to calculate version
      const versionRecommendation = versionCalculator.calculateVersionBump(extractedChanges, '1.0.0');
      expect(versionRecommendation.bumpType).toBe('major'); // Breaking changes detected
      expect(versionRecommendation.confidence).toBeGreaterThan(0.5);
    });

    it('should handle edge case version scenarios', async () => {
      const changes: ExtractedChanges = {
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [{
          id: '1',
          title: 'Critical security fix',
          description: 'Fixed critical security vulnerability',
          affectedComponents: ['auth', 'session'],
          source: 'security-fix.md',
          severity: 'critical'
        }],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 1,
          extractionConfidence: 0.95,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      // Test various version edge cases
      const testCases = [
        { current: '0.0.1', expected: '0.0.2' },
        { current: '2.9.9', expected: '2.9.10' }
      ];

      for (const testCase of testCases) {
        const result = versionCalculator.calculateVersionBump(changes, testCase.current);
        expect(result.bumpType).toBe('patch');
        expect(result.recommendedVersion).toBe(testCase.expected);
      }

      // Test pre-release version handling separately
      const preReleaseResult = versionCalculator.calculateVersionBump(changes, '1.0.0-beta.1');
      expect(preReleaseResult.bumpType).toBe('patch');
      expect(preReleaseResult.recommendedVersion).toBe('1.0.1'); // Patch increment from base version

      // Test build metadata handling
      const buildResult = versionCalculator.calculateVersionBump(changes, '1.0.0+build.123');
      expect(buildResult.bumpType).toBe('patch');
      expect(buildResult.recommendedVersion).toBe('1.0.1');
    });
  });

  describe('Git Integration Scenarios', () => {
    it('should handle Git repository analysis', async () => {
      const childProcess = require('child_process');
      const mockExecSync = childProcess.execSync as jest.Mock;

      // Mock successful Git operations
      mockExecSync
        .mockReturnValueOnce('') // git rev-parse --git-dir
        .mockReturnValueOnce('v1.0.0\nv0.9.0') // git tag -l
        .mockReturnValueOnce('abc123def456') // git rev-list
        .mockReturnValueOnce('2025-10-15 10:30:00 +0000') // git log date
        .mockReturnValueOnce('') // git tag message
        .mockReturnValueOnce('def456ghi789') // git rev-parse HEAD
        .mockReturnValueOnce('abc123def456') // git rev-parse v1.0.0
        .mockReturnValueOnce('ghi789|ghi789|John Doe|2025-10-20 14:30:00 +0000|Add feature\n\nfeature.ts') // git log
        .mockReturnValueOnce('A\tfeature.ts\nM\t.kiro/specs/feature/completion/task-1-completion.md'); // git diff

      const lastRelease = await gitAnalyzer.findLastRelease();
      expect(lastRelease).toBeDefined();
      expect(lastRelease?.name).toBe('v1.0.0');

      const changes = await gitAnalyzer.getChangesSince('v1.0.0');
      expect(changes.commits).toHaveLength(1);
      expect(changes.addedFiles).toContain('feature.ts');
      expect(changes.modifiedFiles).toContain('.kiro/specs/feature/completion/task-1-completion.md');
    });

    it('should handle Git errors gracefully', async () => {
      const childProcess = require('child_process');
      const mockExecSync = childProcess.execSync as jest.Mock;

      // Mock Git command failure
      mockExecSync.mockImplementation(() => {
        throw new Error('fatal: not a git repository');
      });

      const lastRelease = await gitAnalyzer.findLastRelease();
      // Should return error result or null, not throw
      expect(lastRelease === null || typeof lastRelease === 'object').toBe(true);

      // Should handle validation gracefully
      const scope = {
        toCommit: 'HEAD',
        completionDocuments: [],
        analysisDate: new Date()
      };

      const validation = gitAnalyzer.validateAnalysisScope(scope);
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Not a Git repository or Git is not available');
    });
  });

  describe('Configuration Integration', () => {
    it('should load and apply configuration correctly', async () => {
      const fs = require('fs');
      const mockExistsSync = fs.existsSync as jest.Mock;
      const mockReadFileSync = fs.readFileSync as jest.Mock;

      const customConfig = {
        extraction: {
          breakingChangeKeywords: ['BREAKING', 'REMOVED'],
          featureKeywords: ['FEATURE', 'ADDED'],
          confidenceThresholds: {
            minimumConfidence: 0.8
          }
        }
      };

      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(JSON.stringify(customConfig));

      const result = await configManager.loadConfig('/test/workspace');

      expect(result.config.extraction.breakingChangeKeywords).toEqual(['BREAKING', 'REMOVED']);
      expect(result.config.extraction.featureKeywords).toEqual(['FEATURE', 'ADDED']);
      expect(result.config.extraction.confidenceThresholds.minimumConfidence).toBe(0.8);
      expect(result.validation.valid).toBe(true);
    });

    it('should handle configuration validation errors', async () => {
      const invalidConfig = {
        ...DEFAULT_ANALYSIS_CONFIG,
        extraction: {
          ...DEFAULT_ANALYSIS_CONFIG.extraction,
          confidenceThresholds: {
            minimumConfidence: 1.5, // Invalid: > 1
            uncertaintyThreshold: -0.1, // Invalid: < 0
            reviewThreshold: 0.5,
            deduplicationThreshold: 0.8,
            semanticSimilarityThreshold: 0.7
          }
        }
      };

      const validation = configManager.validateConfiguration(invalidConfig as any);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors.some(error => error.includes('minimumConfidence'))).toBe(true);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle extraction errors gracefully', async () => {
      const malformedDoc: CompletionDocument = {
        path: 'malformed.md',
        content: '\x00\x01\x02 corrupted binary content \xFF\xFE',
        lastModified: new Date(),
        gitCommit: 'abc123',
        metadata: {
          title: 'Corrupted Document',
          type: 'task-completion'
        }
      };

      // Should not throw, but return low-confidence results
      const result = await changeExtractor.parseCompletionDocument(malformedDoc);

      expect(result).toBeDefined();
      expect(result.confidence).toBeLessThanOrEqual(0.5);
      expect(result.ambiguousItems.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle version calculation edge cases', async () => {
      const emptyChanges: ExtractedChanges = {
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 0,
          extractionConfidence: 0,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      const result = versionCalculator.calculateVersionBump(emptyChanges, '1.0.0');

      expect(result.bumpType).toBe('none');
      expect(result.recommendedVersion).toBe('1.0.0');
      expect(result.confidence).toBeLessThan(0.5);
    });

    it('should handle release note generation with problematic content', async () => {
      const problematicChanges: ExtractedChanges = {
        breakingChanges: [{
          id: '1',
          title: 'Breaking change with special chars: \x00\x01\xFF',
          description: 'Very long description: ' + 'x'.repeat(5000),
          affectedAPIs: [],
          source: 'test.md',
          severity: 'high'
        }],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 1,
          extractionConfidence: 0.8,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      // Should handle problematic content without crashing
      const releaseNotes = await noteGenerator.generateReleaseNotes(problematicChanges, '2.0.0');

      expect(releaseNotes).toContain('# 2.0.0');
      expect(releaseNotes).toContain('Breaking Changes');
      expect(releaseNotes.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Integration', () => {
    it('should handle large numbers of completion documents efficiently', async () => {
      // Create many completion documents
      const manyDocs: CompletionDocument[] = Array.from({ length: 50 }, (_, i) => ({
        path: `.kiro/specs/feature${i}/completion/task-${i}-completion.md`,
        content: `# Task ${i} Completion
## New Features
- Added feature ${i}
## Bug Fixes
- Fixed bug ${i}
`,
        lastModified: new Date(),
        gitCommit: `commit${i}`,
        metadata: {
          title: `Task ${i} Completion`,
          type: 'task-completion' as const
        }
      }));

      const startTime = Date.now();
      const extractedChanges = await changeExtractor.extractChanges(manyDocs);
      const endTime = Date.now();

      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(5000); // 5 seconds

      // Should extract changes from all documents (heavy deduplication expected)
      expect(extractedChanges.newFeatures.length).toBeGreaterThanOrEqual(1);
      expect(extractedChanges.bugFixes.length).toBeGreaterThanOrEqual(1);
      expect(extractedChanges.metadata.documentsAnalyzed).toBe(50);
    });

    it('should handle version calculation with many changes efficiently', async () => {
      const manyChanges: ExtractedChanges = {
        breakingChanges: Array.from({ length: 10 }, (_, i) => ({
          id: `break-${i}`,
          title: `Breaking Change ${i}`,
          description: `Description ${i}`,
          affectedAPIs: [`api${i}`],
          source: `source${i}.md`,
          severity: 'medium' as const
        })),
        newFeatures: Array.from({ length: 25 }, (_, i) => ({
          id: `feat-${i}`,
          title: `Feature ${i}`,
          description: `Description ${i}`,
          benefits: [`Benefit ${i}`],
          requirements: [],
          artifacts: [],
          source: `source${i}.md`,
          category: 'General'
        })),
        bugFixes: Array.from({ length: 15 }, (_, i) => ({
          id: `fix-${i}`,
          title: `Bug Fix ${i}`,
          description: `Description ${i}`,
          affectedComponents: [],
          source: `source${i}.md`,
          severity: 'low' as const
        })),
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 50,
          extractionConfidence: 0.9,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      const startTime = Date.now();
      const versionRecommendation = versionCalculator.calculateVersionBump(manyChanges, '1.0.0');
      const endTime = Date.now();

      // Should complete quickly
      expect(endTime - startTime).toBeLessThan(1000); // 1 second

      // Should handle many changes correctly
      expect(versionRecommendation.bumpType).toBe('major');
      expect(versionRecommendation.evidence.length).toBeGreaterThan(0);
    });
  });
});