/**
 * System Integration Tests for Release Analysis
 * 
 * Comprehensive tests covering the complete release analysis workflow
 * including edge cases and various document formats.
 */

import { ReleaseCLI } from '../cli/ReleaseCLI';
import { GitHistoryAnalyzer } from '../git/GitHistoryAnalyzer';
import { SimpleChangeExtractor } from '../extraction/SimpleChangeExtractor';
import { VersionCalculator } from '../versioning/VersionCalculator';
import { ReleaseNoteGenerator } from '../notes/ReleaseNoteGenerator';
import { DEFAULT_ANALYSIS_CONFIG } from '../config/AnalysisConfig';
import { CompletionDocument, ExtractedChanges } from '../types/AnalysisTypes';

// Mock external dependencies
jest.mock('child_process');
jest.mock('fs');
jest.mock('fs/promises');

describe('Release Analysis System Integration', () => {
  let cli: ReleaseCLI;
  let gitAnalyzer: GitHistoryAnalyzer;
  let changeExtractor: SimpleChangeExtractor;
  let versionCalculator: VersionCalculator;
  let noteGenerator: ReleaseNoteGenerator;

  beforeEach(() => {
    cli = new ReleaseCLI();
    gitAnalyzer = new GitHistoryAnalyzer();
    changeExtractor = new SimpleChangeExtractor(DEFAULT_ANALYSIS_CONFIG.extraction);
    versionCalculator = new VersionCalculator();
    noteGenerator = new ReleaseNoteGenerator();
  });

  describe('Document Format Variations', () => {
    it('should handle well-structured completion documents', async () => {
      const document: CompletionDocument = {
        path: 'structured-completion.md',
        content: `# Task 1 Completion

**Date**: 2025-10-20
**Task**: 1.1 Implement mathematical token validation
**Spec**: F1 - Mathematical Token System
**Status**: Complete

## Summary
Successfully implemented mathematical token validation with baseline grid alignment.

## Breaking Changes
- Removed deprecated \`validateToken()\` method
- Changed \`TokenValidator\` interface to require baseline grid context

## New Features
- Added mathematical relationship validation
- Implemented cross-platform token generation
- Created strategic flexibility tracking system

## Bug Fixes
- Fixed baseline grid alignment calculation errors
- Resolved token generation performance issues

## Improvements
- Optimized validation algorithm performance by 40%
- Enhanced error messages for better developer experience
`,
        lastModified: new Date(),
        gitCommit: 'abc123',
        metadata: {
          title: 'Task 1 Completion',
          type: 'task-completion',
          task: '1.1 Implement mathematical token validation',
          spec: 'F1 - Mathematical Token System'
        }
      };

      const result = await changeExtractor.parseCompletionDocument(document);

      expect(result.breakingChanges).toHaveLength(2);
      expect(result.newFeatures).toHaveLength(3);
      expect(result.bugFixes).toHaveLength(2);
      expect(result.improvements).toHaveLength(2);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should handle unstructured completion documents', async () => {
      const document: CompletionDocument = {
        path: 'unstructured-completion.md',
        content: `Completed the token validation system. This work introduces a new mathematical validation approach that replaces the old token checking method. The new system fixes several bugs with baseline grid calculations and improves performance significantly. However, this is a breaking change as the old validateToken method has been removed and the TokenValidator interface now requires additional parameters.`,
        lastModified: new Date(),
        gitCommit: 'def456',
        metadata: {
          title: 'Token Validation Completion',
          type: 'task-completion'
        }
      };

      const result = await changeExtractor.parseCompletionDocument(document);

      // Should extract changes even from unstructured text
      expect(result.breakingChanges.length + result.newFeatures.length + result.bugFixes.length + result.improvements.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0.3);
    });

    it('should handle mixed format documents', async () => {
      const document: CompletionDocument = {
        path: 'mixed-format-completion.md',
        content: `# Mixed Format Completion

This task involved updating the token system with some breaking changes.

## What Changed
The old API was removed and replaced with a new one. Also fixed some bugs.

### Breaking Changes:
* Removed old validateToken method
* Changed interface signature

### Features:
- New mathematical validation
- Cross-platform support

Some additional improvements were made to performance.
`,
        lastModified: new Date(),
        gitCommit: 'ghi789',
        metadata: {
          title: 'Mixed Format Completion',
          type: 'task-completion'
        }
      };

      const result = await changeExtractor.parseCompletionDocument(document);

      expect(result.breakingChanges.length).toBeGreaterThan(0);
      expect(result.newFeatures.length).toBeGreaterThan(0);
      expect(result.confidence).toBeGreaterThan(0.5);
    });

    it('should handle minimal completion documents', async () => {
      const document: CompletionDocument = {
        path: 'minimal-completion.md',
        content: `Task complete. Fixed bug #123.`,
        lastModified: new Date(),
        gitCommit: 'jkl012',
        metadata: {
          title: 'Minimal Completion',
          type: 'task-completion'
        }
      };

      const result = await changeExtractor.parseCompletionDocument(document);

      expect(result.bugFixes.length).toBeGreaterThan(0);
      expect(result.bugFixes[0].title).toContain('bug #123');
    });
  });

  describe('Version Calculation Scenarios', () => {
    it('should handle complex version scenarios', () => {
      const complexChanges: ExtractedChanges = {
        breakingChanges: [
          {
            id: '1',
            title: 'Remove deprecated API',
            description: 'Removed old authentication method',
            affectedAPIs: ['auth.login', 'auth.validate'],
            migrationGuidance: 'Use new auth.authenticate() method',
            source: 'task-1.md',
            severity: 'high'
          }
        ],
        newFeatures: [
          {
            id: '2',
            title: 'Add mathematical validation',
            description: 'New validation system with mathematical foundations',
            benefits: ['Better accuracy', 'Cross-platform consistency'],
            requirements: ['Baseline grid support'],
            artifacts: ['MathValidator.ts', 'BaselineGrid.ts'],
            source: 'task-2.md',
            category: 'Core System'
          }
        ],
        bugFixes: [
          {
            id: '3',
            title: 'Fix memory leak',
            description: 'Resolved memory leak in token caching',
            issueNumber: '456',
            affectedComponents: ['TokenCache', 'MemoryManager'],
            source: 'task-3.md',
            severity: 'medium'
          }
        ],
        improvements: [
          {
            id: '4',
            title: 'Performance optimization',
            description: 'Improved validation speed by 50%',
            type: 'performance',
            impact: 'high',
            source: 'task-4.md'
          }
        ],
        documentation: [],
        metadata: {
          documentsAnalyzed: 4,
          extractionConfidence: 0.9,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      const result = versionCalculator.calculateVersionBump(complexChanges, '1.2.3');

      expect(result.bumpType).toBe('major');
      expect(result.recommendedVersion).toBe('2.0.0');
      expect(result.evidence).toHaveLength(4);
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('should handle pre-release versions correctly', () => {
      const changes: ExtractedChanges = {
        breakingChanges: [],
        newFeatures: [{
          id: '1',
          title: 'New feature',
          description: 'Added new functionality',
          benefits: [],
          requirements: [],
          artifacts: [],
          source: 'test.md',
          category: 'enhancement'
        }],
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

      const result = versionCalculator.calculateVersionBump(changes, '1.0.0-beta.2');

      expect(result.recommendedVersion).toBe('1.1.0');
      expect(result.bumpType).toBe('minor');
    });

    it('should handle edge case versions', () => {
      const changes: ExtractedChanges = {
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [{
          id: '1',
          title: 'Bug fix',
          description: 'Fixed issue',
          affectedComponents: [],
          source: 'test.md',
          severity: 'low'
        }],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 1,
          extractionConfidence: 0.8,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      // Test version with build metadata
      const result1 = versionCalculator.calculateVersionBump(changes, '1.0.0+build.123');
      expect(result1.recommendedVersion).toBe('1.0.1');

      // Test version at boundary
      const result2 = versionCalculator.calculateVersionBump(changes, '0.0.1');
      expect(result2.recommendedVersion).toBe('0.0.2');
    });
  });

  describe('Release Note Generation Scenarios', () => {
    it('should generate comprehensive release notes', async () => {
      const changes: ExtractedChanges = {
        breakingChanges: [
          {
            id: '1',
            title: 'API Restructure',
            description: 'Restructured authentication API for better security',
            affectedAPIs: ['auth.login', 'auth.validate'],
            migrationGuidance: 'Replace auth.login() with auth.authenticate(). See migration guide for details.',
            source: 'auth-restructure.md',
            severity: 'high'
          }
        ],
        newFeatures: [
          {
            id: '2',
            title: 'Mathematical Token Validation',
            description: 'Introduced mathematical validation system with baseline grid alignment',
            benefits: ['Improved accuracy', 'Cross-platform consistency', 'Better performance'],
            requirements: ['Mathematical foundation', 'Baseline grid support'],
            artifacts: ['MathValidator.ts', 'BaselineGrid.ts', 'TokenMath.ts'],
            source: 'math-validation.md',
            category: 'Core System'
          }
        ],
        bugFixes: [
          {
            id: '3',
            title: 'Memory Leak Resolution',
            description: 'Fixed critical memory leak in token caching system',
            issueNumber: '789',
            affectedComponents: ['TokenCache', 'MemoryManager', 'CacheCleanup'],
            source: 'memory-fix.md',
            severity: 'critical'
          }
        ],
        improvements: [
          {
            id: '4',
            title: 'Validation Performance',
            description: 'Optimized validation algorithms for 60% performance improvement',
            type: 'performance',
            impact: 'high',
            source: 'perf-optimization.md'
          }
        ],
        documentation: [
          {
            id: '5',
            title: 'API Documentation Update',
            description: 'Updated API documentation with new authentication examples',
            type: 'api-docs',
            source: 'docs-update.md'
          }
        ],
        metadata: {
          documentsAnalyzed: 5,
          extractionConfidence: 0.95,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      const releaseNotes = await noteGenerator.generateReleaseNotes(changes, '2.0.0');

      expect(releaseNotes).toContain('# 2.0.0');
      expect(releaseNotes).toContain('## 🚨 Breaking Changes');
      expect(releaseNotes).toContain('**API Restructure**');
      expect(releaseNotes).toContain('Migration: Replace auth.login()');
      expect(releaseNotes).toContain('## ✨ New Features');
      expect(releaseNotes).toContain('**Mathematical Token Validation**');
      expect(releaseNotes).toContain('Benefits: Improved accuracy');
      expect(releaseNotes).toContain('## 🐛 Bug Fixes');
      expect(releaseNotes).toContain('**Memory Leak Resolution**');
      expect(releaseNotes).toContain('Issue: #789');
      expect(releaseNotes).toContain('## ⚡ Improvements');
      expect(releaseNotes).toContain('**Validation Performance**');
    });

    it('should handle empty sections gracefully', async () => {
      const minimalChanges: ExtractedChanges = {
        breakingChanges: [],
        newFeatures: [{
          id: '1',
          title: 'Simple Feature',
          description: 'Added simple functionality',
          benefits: [],
          requirements: [],
          artifacts: [],
          source: 'simple.md',
          category: ''
        }],
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

      const releaseNotes = await noteGenerator.generateReleaseNotes(minimalChanges, '1.1.0');

      expect(releaseNotes).toContain('# 1.1.0');
      expect(releaseNotes).toContain('## ✨ New Features');
      expect(releaseNotes).toContain('**Simple Feature**');
      expect(releaseNotes).not.toContain('## 🚨 Breaking Changes');
      expect(releaseNotes).not.toContain('## 🐛 Bug Fixes');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle extraction errors gracefully', async () => {
      const malformedDocument: CompletionDocument = {
        path: 'malformed.md',
        content: '# Incomplete\n\nThis document is incomplete and has no proper structure...',
        lastModified: new Date(),
        gitCommit: 'error123',
        metadata: {
          title: 'Malformed Document',
          type: 'task-completion'
        }
      };

      const result = await changeExtractor.parseCompletionDocument(malformedDocument);

      expect(result).toBeDefined();
      expect(result.confidence).toBeLessThanOrEqual(0.5);
      expect(result.ambiguousItems.length).toBeGreaterThanOrEqual(0);
    });

    it('should validate version calculations', () => {
      const invalidChanges: ExtractedChanges = {
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
          documentsAnalyzed: 0,
          extractionConfidence: 0.2, // Very low confidence
          ambiguousItems: ['unclear item 1', 'unclear item 2'],
          filteredItems: []
        }
      };

      const result = versionCalculator.calculateVersionBump(invalidChanges, '1.0.0');

      expect(result.bumpType).toBe('none');
      expect(result.confidence).toBeLessThan(0.5);
    });

    it('should handle version validation errors', () => {
      const validRecommendation = {
        currentVersion: '1.0.0',
        recommendedVersion: '1.1.0',
        bumpType: 'minor' as const,
        rationale: 'New features added',
        confidence: 0.9,
        evidence: []
      };

      const validation = versionCalculator.validateSemanticVersioning(validRecommendation);
      expect(validation.valid).toBe(true);

      const invalidRecommendation = {
        currentVersion: 'invalid',
        recommendedVersion: '1.1.0',
        bumpType: 'minor' as const,
        rationale: 'New features added',
        confidence: 0.9,
        evidence: []
      };

      const invalidValidation = versionCalculator.validateSemanticVersioning(invalidRecommendation);
      expect(invalidValidation.valid).toBe(false);
      expect(invalidValidation.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large numbers of changes efficiently', async () => {
      const manyChanges: ExtractedChanges = {
        breakingChanges: Array.from({ length: 10 }, (_, i) => ({
          id: `break-${i}`,
          title: `Breaking Change ${i}`,
          description: `Description ${i}`,
          affectedAPIs: [`api${i}`],
          source: `source${i}.md`,
          severity: 'medium' as const
        })),
        newFeatures: Array.from({ length: 20 }, (_, i) => ({
          id: `feat-${i}`,
          title: `Feature ${i}`,
          description: `Description ${i}`,
          benefits: [`Benefit ${i}`],
          requirements: [`Requirement ${i}`],
          artifacts: [`Artifact${i}.ts`],
          source: `source${i}.md`,
          category: 'General'
        })),
        bugFixes: Array.from({ length: 15 }, (_, i) => ({
          id: `fix-${i}`,
          title: `Bug Fix ${i}`,
          description: `Description ${i}`,
          affectedComponents: [`Component${i}`],
          source: `source${i}.md`,
          severity: 'low' as const
        })),
        improvements: Array.from({ length: 8 }, (_, i) => ({
          id: `imp-${i}`,
          title: `Improvement ${i}`,
          description: `Description ${i}`,
          type: 'performance' as const,
          impact: 'medium' as const,
          source: `source${i}.md`
        })),
        documentation: [],
        metadata: {
          documentsAnalyzed: 53,
          extractionConfidence: 0.85,
          ambiguousItems: [],
          filteredItems: []
        }
      };

      const startTime = Date.now();
      const releaseNotes = await noteGenerator.generateReleaseNotes(manyChanges, '3.0.0');
      const endTime = Date.now();

      expect(releaseNotes).toContain('# 3.0.0');
      expect(releaseNotes).toContain('10 breaking changes');
      expect(releaseNotes).toContain('20 new features');
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });
  });
});