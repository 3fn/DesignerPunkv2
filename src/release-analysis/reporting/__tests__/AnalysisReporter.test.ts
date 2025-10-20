/**
 * Tests for AnalysisReporter
 * 
 * Comprehensive test suite covering report generation, formatting, and persistence.
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { AnalysisReporter, AnalysisResult, ReportFormat } from '../AnalysisReporter';
import { ExtractedChanges, BreakingChange, Feature, BugFix, Improvement } from '../../types/AnalysisTypes';

// Mock fs for file operations
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    writeFile: jest.fn()
  }
}));

describe('AnalysisReporter', () => {
  let reporter: AnalysisReporter;
  let mockAnalysisResult: AnalysisResult;

  beforeEach(() => {
    reporter = new AnalysisReporter();
    
    // Create comprehensive mock data
    mockAnalysisResult = {
      scope: {
        fromTag: 'v1.0.0',
        toCommit: 'abc123',
        completionDocuments: [
          {
            path: '.kiro/specs/test-spec/completion/task-1-completion.md',
            content: 'Mock completion content',
            lastModified: new Date('2025-01-01'),
            gitCommit: 'def456',
            metadata: {
              title: 'Task 1 Completion',
              task: '1. Implement feature',
              spec: 'test-spec',
              type: 'task-completion'
            }
          }
        ],
        analysisDate: new Date('2025-01-15T10:00:00Z')
      },
      changes: {
        breakingChanges: [
          {
            id: 'bc1',
            title: 'Remove deprecated API',
            description: 'Removed old authentication method',
            affectedAPIs: ['auth.login()', 'auth.verify()'],
            migrationGuidance: 'Use new auth.authenticate() method',
            source: 'task-1-completion.md',
            severity: 'high'
          }
        ],
        newFeatures: [
          {
            id: 'f1',
            title: 'New dashboard component',
            description: 'Added interactive dashboard with real-time updates',
            benefits: ['Better user experience', 'Real-time data'],
            requirements: ['React 18+', 'WebSocket support'],
            artifacts: ['Dashboard.tsx', 'dashboard.test.ts'],
            source: 'task-1-completion.md',
            category: 'UI Components'
          }
        ],
        bugFixes: [
          {
            id: 'bf1',
            title: 'Fix memory leak in data processing',
            description: 'Resolved memory leak causing performance degradation',
            issueNumber: '123',
            affectedComponents: ['DataProcessor', 'MemoryManager'],
            source: 'task-1-completion.md',
            severity: 'medium'
          }
        ],
        improvements: [
          {
            id: 'i1',
            title: 'Optimize database queries',
            description: 'Improved query performance by 40%',
            type: 'performance',
            impact: 'high',
            source: 'task-1-completion.md'
          }
        ],
        documentation: [],
        metadata: {
          documentsAnalyzed: 1,
          extractionConfidence: 0.85,
          ambiguousItems: ['Unclear change in section 3'],
          filteredItems: ['Updated README formatting']
        }
      },
      versionRecommendation: {
        currentVersion: '1.0.0',
        recommendedVersion: '2.0.0',
        bumpType: 'major',
        rationale: 'Major version bump required due to 1 breaking change:\n  • Remove deprecated API (high severity)',
        confidence: 0.9,
        evidence: [
          {
            type: 'breaking',
            description: '1 breaking change(s) detected',
            source: 'completion documents',
            impact: 'high',
            count: 1
          },
          {
            type: 'feature',
            description: '1 new feature(s) added',
            source: 'completion documents',
            impact: 'medium',
            count: 1
          }
        ]
      },
      releaseNotes: '# Release Notes v2.0.0\n\n## Breaking Changes\n- Remove deprecated API\n\n## New Features\n- New dashboard component',
      confidence: {
        overall: 0.88,
        extraction: 0.85,
        versioning: 0.9,
        completeness: 0.9
      },
      metadata: {
        generatedAt: new Date('2025-01-15T10:30:00Z'),
        cliVersion: '1.0.0',
        analysisId: 'analysis-123',
        processingTime: 1500
      }
    };

    // Clear mocks
    jest.clearAllMocks();
  });

  describe('generateSummaryReport', () => {
    it('should generate a concise summary report', () => {
      const report = reporter.generateSummaryReport(mockAnalysisResult);

      expect(report).toContain('📊 Release Analysis Summary');
      expect(report).toContain('🏷️  Version: 1.0.0 → 2.0.0');
      expect(report).toContain('📈 Bump type: major');
      expect(report).toContain('🎯 Confidence: 90.0%');
      expect(report).toContain('📝 Changes: 4 total');
      expect(report).toContain('⚠️  1 breaking changes');
      expect(report).toContain('✨ 1 new features');
      expect(report).toContain('🐛 1 bug fixes');
      expect(report).toContain('🔧 1 improvements');
    });

    it('should include quality indicators', () => {
      const report = reporter.generateSummaryReport(mockAnalysisResult);

      expect(report).toContain('⚠️  1 items need review');
      expect(report).toContain('ℹ️  1 items filtered (documentation-only)');
    });

    it('should handle empty changes gracefully', () => {
      const emptyResult = {
        ...mockAnalysisResult,
        changes: {
          ...mockAnalysisResult.changes,
          breakingChanges: [],
          newFeatures: [],
          bugFixes: [],
          improvements: [],
          metadata: {
            ...mockAnalysisResult.changes.metadata,
            ambiguousItems: [],
            filteredItems: []
          }
        },
        versionRecommendation: {
          ...mockAnalysisResult.versionRecommendation,
          bumpType: 'none' as const,
          confidence: 1.0
        }
      };

      const report = reporter.generateSummaryReport(emptyResult);

      expect(report).toContain('📝 Changes: 0 total');
      expect(report).toContain('✅ Analysis quality: Good');
    });

    it('should exclude metadata by default', () => {
      const report = reporter.generateSummaryReport(mockAnalysisResult);

      expect(report).not.toContain('Generated:');
      expect(report).not.toContain('Processing time:');
    });

    it('should include metadata when requested', () => {
      const report = reporter.generateSummaryReport(mockAnalysisResult, {
        format: { 
          type: 'summary',
          includeMetadata: true,
          includeConfidence: true,
          includeEvidence: true
        }
      });

      expect(report).toContain('ℹ️  Generated:');
      expect(report).toContain('⏱️  Processing time: 1500ms');
    });
  });

  describe('generateDetailedReport', () => {
    it('should generate a comprehensive detailed report', () => {
      const report = reporter.generateDetailedReport(mockAnalysisResult);

      expect(report).toContain('📊 Detailed Analysis Report');
      expect(report).toContain('📋 Analysis Scope:');
      expect(report).toContain('From: v1.0.0');
      expect(report).toContain('To: abc123');
      expect(report).toContain('Documents analyzed: 1');
      expect(report).toContain('🏷️  Version Recommendation:');
      expect(report).toContain('📝 Changes Details:');
    });

    it('should include detailed change breakdown', () => {
      const report = reporter.generateDetailedReport(mockAnalysisResult);

      expect(report).toContain('⚠️  Breaking Changes:');
      expect(report).toContain('1. Remove deprecated API (high)');
      expect(report).toContain('Removed old authentication method');
      
      expect(report).toContain('✨ New Features:');
      expect(report).toContain('1. New dashboard component');
      expect(report).toContain('Added interactive dashboard');
      
      expect(report).toContain('🐛 Bug Fixes:');
      expect(report).toContain('1. Fix memory leak in data processing (medium)');
      
      expect(report).toContain('🔧 Improvements:');
      expect(report).toContain('1. Optimize database queries (performance)');
    });

    it('should include evidence when enabled', () => {
      const report = reporter.generateDetailedReport(mockAnalysisResult, {
        format: {
          type: 'detailed',
          includeMetadata: false,
          includeConfidence: true,
          includeEvidence: true
        }
      });

      expect(report).toContain('🔍 Evidence:');
      expect(report).toContain('[BREAKING] 1 breaking change(s) detected');
      expect(report).toContain('[FEATURE] 1 new feature(s) added');
      expect(report).toContain('Source: completion documents');
      expect(report).toContain('Impact: high');
    });

    it('should include confidence details', () => {
      const report = reporter.generateDetailedReport(mockAnalysisResult);

      expect(report).toContain('📈 Confidence Metrics:');
      expect(report).toContain('Overall: 88.0%');
      expect(report).toContain('Extraction: 85.0%');
      expect(report).toContain('Versioning: 90.0%');
      expect(report).toContain('Completeness: 90.0%');
    });

    it('should include quality analysis', () => {
      const report = reporter.generateDetailedReport(mockAnalysisResult);

      expect(report).toContain('🔍 Quality Analysis:');
      expect(report).toContain('Extraction quality: 85.0%');
      expect(report).toContain('Items requiring review: 1');
      expect(report).toContain('1. Unclear change in section 3');
      expect(report).toContain('Filtered items: 1 (documentation-only changes)');
    });

    it('should include release notes when enabled', () => {
      const report = reporter.generateDetailedReport(mockAnalysisResult, {
        format: {
          type: 'detailed',
          includeMetadata: false,
          includeConfidence: true,
          includeEvidence: true,
          includeReleaseNotes: true
        }
      });

      expect(report).toContain('📋 Generated Release Notes:');
      expect(report).toContain('# Release Notes v2.0.0');
      expect(report).toContain('## Breaking Changes');
      expect(report).toContain('## New Features');
    });
  });

  describe('generateJSONReport', () => {
    it('should generate valid JSON output', () => {
      const report = reporter.generateJSONReport(mockAnalysisResult);
      
      expect(() => JSON.parse(report)).not.toThrow();
      
      const parsed = JSON.parse(report);
      expect(parsed.analysis).toBeDefined();
      expect(parsed.analysis.scope).toBeDefined();
      expect(parsed.analysis.versionRecommendation).toBeDefined();
      expect(parsed.analysis.changes).toBeDefined();
    });

    it('should include structured analysis data', () => {
      const report = reporter.generateJSONReport(mockAnalysisResult);
      const parsed = JSON.parse(report);

      expect(parsed.analysis.scope.fromTag).toBe('v1.0.0');
      expect(parsed.analysis.scope.toCommit).toBe('abc123');
      expect(parsed.analysis.scope.documentsAnalyzed).toBe(1);
      
      expect(parsed.analysis.versionRecommendation.currentVersion).toBe('1.0.0');
      expect(parsed.analysis.versionRecommendation.recommendedVersion).toBe('2.0.0');
      expect(parsed.analysis.versionRecommendation.bumpType).toBe('major');
      
      expect(parsed.analysis.changes.summary.breakingChanges).toBe(1);
      expect(parsed.analysis.changes.summary.newFeatures).toBe(1);
      expect(parsed.analysis.changes.summary.bugFixes).toBe(1);
      expect(parsed.analysis.changes.summary.improvements).toBe(1);
    });

    it('should include detailed change data', () => {
      const report = reporter.generateJSONReport(mockAnalysisResult);
      const parsed = JSON.parse(report);

      expect(parsed.analysis.changes.details.breakingChanges).toHaveLength(1);
      expect(parsed.analysis.changes.details.breakingChanges[0].title).toBe('Remove deprecated API');
      
      expect(parsed.analysis.changes.details.newFeatures).toHaveLength(1);
      expect(parsed.analysis.changes.details.newFeatures[0].title).toBe('New dashboard component');
    });

    it('should conditionally include evidence', () => {
      const reportWithEvidence = reporter.generateJSONReport(mockAnalysisResult, {
        format: {
          type: 'json',
          includeMetadata: false,
          includeConfidence: false,
          includeEvidence: true
        }
      });
      
      const reportWithoutEvidence = reporter.generateJSONReport(mockAnalysisResult, {
        format: {
          type: 'json',
          includeMetadata: false,
          includeConfidence: false,
          includeEvidence: false
        }
      });

      const parsedWith = JSON.parse(reportWithEvidence);
      const parsedWithout = JSON.parse(reportWithoutEvidence);

      expect(parsedWith.analysis.evidence).toBeDefined();
      expect(parsedWith.analysis.evidence).toHaveLength(2);
      
      expect(parsedWithout.analysis.evidence).toBeUndefined();
    });

    it('should conditionally include confidence metrics', () => {
      const reportWithConfidence = reporter.generateJSONReport(mockAnalysisResult, {
        format: {
          type: 'json',
          includeMetadata: false,
          includeConfidence: true,
          includeEvidence: false
        }
      });

      const parsed = JSON.parse(reportWithConfidence);
      expect(parsed.analysis.confidence).toBeDefined();
      expect(parsed.analysis.confidence.overall).toBe(0.88);
      expect(parsed.analysis.confidence.extraction).toBe(0.85);
    });

    it('should conditionally include metadata', () => {
      const reportWithMetadata = reporter.generateJSONReport(mockAnalysisResult, {
        format: {
          type: 'json',
          includeMetadata: true,
          includeConfidence: false,
          includeEvidence: false
        }
      });

      const parsed = JSON.parse(reportWithMetadata);
      expect(parsed.metadata).toBeDefined();
      expect(parsed.metadata.cliVersion).toBe('1.0.0');
      expect(parsed.metadata.analysisId).toBe('analysis-123');
    });
  });

  describe('saveReport', () => {
    const mockFs = fs as jest.Mocked<typeof fs>;

    beforeEach(() => {
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);
    });

    it('should save summary report to file', async () => {
      const format: ReportFormat = {
        type: 'summary',
        includeMetadata: false,
        includeConfidence: true,
        includeEvidence: true
      };

      await reporter.saveReport(mockAnalysisResult, format, '/tmp/report.txt');

      expect(mockFs.mkdir).toHaveBeenCalledWith('/tmp', { recursive: true });
      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/tmp/report.txt',
        expect.stringContaining('📊 Release Analysis Summary'),
        'utf-8'
      );
    });

    it('should save detailed report to file', async () => {
      const format: ReportFormat = {
        type: 'detailed',
        includeMetadata: true,
        includeConfidence: true,
        includeEvidence: true
      };

      await reporter.saveReport(mockAnalysisResult, format, '/tmp/detailed-report.txt');

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/tmp/detailed-report.txt',
        expect.stringContaining('📊 Detailed Analysis Report'),
        'utf-8'
      );
    });

    it('should save JSON report to file', async () => {
      const format: ReportFormat = {
        type: 'json',
        includeMetadata: true,
        includeConfidence: true,
        includeEvidence: true
      };

      await reporter.saveReport(mockAnalysisResult, format, '/tmp/report.json');

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/tmp/report.json',
        expect.stringMatching(/^\{[\s\S]*\}$/), // Valid JSON structure
        'utf-8'
      );
    });

    it('should include timestamp when requested', async () => {
      const format: ReportFormat = {
        type: 'summary',
        includeMetadata: false,
        includeConfidence: true,
        includeEvidence: true
      };

      await reporter.saveReport(mockAnalysisResult, format, '/tmp/report.txt', {
        includeTimestamp: true
      });

      expect(mockFs.writeFile).toHaveBeenCalledWith(
        '/tmp/report.txt',
        expect.stringContaining('Generated:'),
        'utf-8'
      );
    });

    it('should handle file system errors gracefully', async () => {
      mockFs.writeFile.mockRejectedValue(new Error('Permission denied'));

      const format: ReportFormat = {
        type: 'summary',
        includeMetadata: false,
        includeConfidence: true,
        includeEvidence: true
      };

      await expect(
        reporter.saveReport(mockAnalysisResult, format, '/tmp/report.txt')
      ).rejects.toThrow('Permission denied');
    });

    it('should throw error for unsupported format', async () => {
      const format = {
        type: 'unsupported' as any,
        includeMetadata: false,
        includeConfidence: true,
        includeEvidence: true
      };

      await expect(
        reporter.saveReport(mockAnalysisResult, format, '/tmp/report.txt')
      ).rejects.toThrow('Unsupported report format: unsupported');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle missing optional data gracefully', () => {
      const minimalResult = {
        ...mockAnalysisResult,
        metadata: undefined,
        changes: {
          ...mockAnalysisResult.changes,
          metadata: {
            documentsAnalyzed: 0,
            extractionConfidence: 0,
            ambiguousItems: [],
            filteredItems: []
          }
        }
      };

      const report = reporter.generateSummaryReport(minimalResult);
      expect(report).toContain('📊 Release Analysis Summary');
      expect(report).not.toContain('ℹ️  Generated:');
    });

    it('should handle low confidence scenarios', () => {
      const lowConfidenceResult = {
        ...mockAnalysisResult,
        versionRecommendation: {
          ...mockAnalysisResult.versionRecommendation,
          confidence: 0.6
        },
        confidence: {
          overall: 0.6,
          extraction: 0.5,
          versioning: 0.7,
          completeness: 0.6
        }
      };

      const report = reporter.generateSummaryReport(lowConfidenceResult);
      expect(report).toContain('⚠️  Low confidence - manual review recommended');
    });

    it('should handle empty evidence arrays', () => {
      const noEvidenceResult = {
        ...mockAnalysisResult,
        versionRecommendation: {
          ...mockAnalysisResult.versionRecommendation,
          evidence: []
        }
      };

      const report = reporter.generateDetailedReport(noEvidenceResult);
      expect(report).not.toContain('🔍 Evidence:');
    });
  });
});