/**
 * @category evergreen
 * @purpose Verify system integration works correctly across components
 */
/**
 * Tests for AnalysisResultParser
 * 
 * Mock Strategy:
 * - No external mocks: Tests use real JSON parsing logic
 * - Focus on parsing validation: Tests validate JSON structure and error handling
 * - Pure logic testing: No file system or external dependencies
 */

import { AnalysisResultParser, JSONParseError } from '../AnalysisResultParser';
import { AnalysisResult } from '../../../release-analysis/types/AnalysisTypes';

describe('AnalysisResultParser', () => {
  let parser: AnalysisResultParser;

  beforeEach(() => {
    parser = new AnalysisResultParser();
  });

  describe('parse', () => {
    it('should parse valid JSON output', () => {
      const validJSON = JSON.stringify({
        scope: {
          toCommit: 'abc123',
          completionDocuments: [],
          analysisDate: '2025-01-01T00:00:00.000Z'
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
        releaseNotes: '# Release Notes\n\nNew features added.',
        confidence: {
          overall: 0.85,
          extraction: 0.8,
          categorization: 0.85,
          deduplication: 0.9,
          versionCalculation: 0.9
        }
      });

      const result = parser.parse(validJSON);

      expect(result).toBeDefined();
      expect(result.scope.toCommit).toBe('abc123');
      expect(result.versionRecommendation.currentVersion).toBe('1.0.0');
      expect(result.versionRecommendation.recommendedVersion).toBe('1.1.0');
      expect(result.versionRecommendation.bumpType).toBe('minor');
      expect(result.confidence.overall).toBe(0.85);
    });

    it('should throw JSONParseError for invalid JSON', () => {
      const invalidJSON = '{ invalid json }';

      expect(() => parser.parse(invalidJSON)).toThrow(JSONParseError);
      expect(() => parser.parse(invalidJSON)).toThrow(/Failed to parse JSON/);
    });

    it('should throw JSONParseError for missing required fields', () => {
      const incompleteJSON = JSON.stringify({
        scope: {
          toCommit: 'abc123'
          // Missing completionDocuments and analysisDate
        }
      });

      expect(() => parser.parse(incompleteJSON)).toThrow(JSONParseError);
      expect(() => parser.parse(incompleteJSON)).toThrow(/Missing required field/);
    });

    it('should parse complete analysis result with all change types', () => {
      const completeJSON = JSON.stringify({
        scope: {
          fromTag: 'v1.0.0',
          toCommit: 'abc123',
          completionDocuments: [
            {
              path: 'docs/task-1-summary.md',
              content: '# Task 1 Summary',
              lastModified: '2025-01-01T00:00:00.000Z',
              gitCommit: 'def456',
              metadata: {
                title: 'Task 1',
                date: '2025-01-01',
                task: '1',
                spec: 'test-spec',
                status: 'complete',
                type: 'task-completion'
              }
            }
          ],
          analysisDate: '2025-01-01T00:00:00.000Z'
        },
        changes: {
          breakingChanges: [
            {
              id: 'bc-1',
              title: 'Breaking Change 1',
              description: 'API changed',
              affectedAPIs: ['api1', 'api2'],
              migrationGuidance: 'Update your code',
              source: 'task-1',
              severity: 'high'
            }
          ],
          newFeatures: [
            {
              id: 'feat-1',
              title: 'Feature 1',
              description: 'New feature',
              benefits: ['benefit1'],
              requirements: ['req1'],
              artifacts: ['artifact1'],
              source: 'task-1',
              category: 'enhancement'
            }
          ],
          bugFixes: [
            {
              id: 'fix-1',
              title: 'Bug Fix 1',
              description: 'Fixed bug',
              issueNumber: '#123',
              affectedComponents: ['component1'],
              source: 'task-1',
              severity: 'medium'
            }
          ],
          improvements: [
            {
              id: 'imp-1',
              title: 'Improvement 1',
              description: 'Performance improvement',
              type: 'performance',
              impact: 'high',
              source: 'task-1'
            }
          ],
          documentation: [
            {
              id: 'doc-1',
              title: 'Documentation 1',
              description: 'Updated docs',
              type: 'readme',
              source: 'task-1'
            }
          ],
          metadata: {
            documentsAnalyzed: 1,
            extractionConfidence: 0.85,
            ambiguousItems: ['ambiguous item'],
            filteredItems: ['filtered item']
          }
        },
        versionRecommendation: {
          currentVersion: '1.0.0',
          recommendedVersion: '2.0.0',
          bumpType: 'major',
          rationale: 'Breaking changes detected',
          confidence: 0.95,
          evidence: [
            {
              type: 'breaking',
              description: 'API changed',
              source: 'task-1',
              impact: 'high'
            }
          ]
        },
        releaseNotes: '# Release 2.0.0\n\n## Breaking Changes\n\n- API changed',
        confidence: {
          overall: 0.9,
          extraction: 0.85,
          categorization: 0.9,
          deduplication: 0.95,
          versionCalculation: 0.95
        }
      });

      const result = parser.parse(completeJSON);

      expect(result.scope.fromTag).toBe('v1.0.0');
      expect(result.scope.completionDocuments).toHaveLength(1);
      expect(result.scope.completionDocuments[0].path).toBe('docs/task-1-summary.md');
      expect(result.changes.breakingChanges).toHaveLength(1);
      expect(result.changes.newFeatures).toHaveLength(1);
      expect(result.changes.bugFixes).toHaveLength(1);
      expect(result.changes.improvements).toHaveLength(1);
      expect(result.changes.documentation).toHaveLength(1);
      expect(result.versionRecommendation.bumpType).toBe('major');
      expect(result.versionRecommendation.evidence).toHaveLength(1);
    });
  });

  describe('type validation', () => {
    it('should validate document type', () => {
      const invalidTypeJSON = JSON.stringify({
        scope: {
          toCommit: 'abc123',
          completionDocuments: [
            {
              path: 'test.md',
              content: 'content',
              lastModified: '2025-01-01T00:00:00.000Z',
              gitCommit: 'abc',
              metadata: {
                title: 'Test',
                type: 'invalid-type' // Invalid type
              }
            }
          ],
          analysisDate: '2025-01-01T00:00:00.000Z'
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
          rationale: 'test',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'test',
        confidence: {
          overall: 0.8,
          extraction: 0.8,
          categorization: 0.8,
          deduplication: 0.8,
          versionCalculation: 0.8
        }
      });

      expect(() => parser.parse(invalidTypeJSON)).toThrow(JSONParseError);
      expect(() => parser.parse(invalidTypeJSON)).toThrow(/Invalid document type/);
    });

    it('should validate severity', () => {
      const invalidSeverityJSON = JSON.stringify({
        scope: {
          toCommit: 'abc123',
          completionDocuments: [],
          analysisDate: '2025-01-01T00:00:00.000Z'
        },
        changes: {
          breakingChanges: [
            {
              id: 'bc-1',
              title: 'Test',
              description: 'Test',
              affectedAPIs: [],
              source: 'test',
              severity: 'invalid-severity' // Invalid severity
            }
          ],
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
          rationale: 'test',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'test',
        confidence: {
          overall: 0.8,
          extraction: 0.8,
          categorization: 0.8,
          deduplication: 0.8,
          versionCalculation: 0.8
        }
      });

      expect(() => parser.parse(invalidSeverityJSON)).toThrow(JSONParseError);
      expect(() => parser.parse(invalidSeverityJSON)).toThrow(/Invalid severity/);
    });

    it('should validate bump type', () => {
      const invalidBumpTypeJSON = JSON.stringify({
        scope: {
          toCommit: 'abc123',
          completionDocuments: [],
          analysisDate: '2025-01-01T00:00:00.000Z'
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
          bumpType: 'invalid-bump', // Invalid bump type
          rationale: 'test',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'test',
        confidence: {
          overall: 0.8,
          extraction: 0.8,
          categorization: 0.8,
          deduplication: 0.8,
          versionCalculation: 0.8
        }
      });

      expect(() => parser.parse(invalidBumpTypeJSON)).toThrow(JSONParseError);
      expect(() => parser.parse(invalidBumpTypeJSON)).toThrow(/Invalid bump type/);
    });
  });

  describe('validate', () => {
    it('should validate correct analysis result', () => {
      const result: AnalysisResult = {
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
          rationale: 'New features',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'Release notes',
        confidence: {
          overall: 0.85,
          extraction: 0.8,
          categorization: 0.85,
          deduplication: 0.9,
          versionCalculation: 0.9
        }
      };

      const validation = parser.validate(result);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should detect invalid version format', () => {
      const result: AnalysisResult = {
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
          currentVersion: 'invalid-version', // Invalid format
          recommendedVersion: '1.1.0',
          bumpType: 'minor',
          rationale: 'New features',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'Release notes',
        confidence: {
          overall: 0.85,
          extraction: 0.8,
          categorization: 0.85,
          deduplication: 0.9,
          versionCalculation: 0.9
        }
      };

      const validation = parser.validate(result);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Invalid current version format: invalid-version');
    });

    it('should detect confidence out of range', () => {
      const result: AnalysisResult = {
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
          rationale: 'New features',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'Release notes',
        confidence: {
          overall: 1.5, // Out of range
          extraction: 0.8,
          categorization: 0.85,
          deduplication: 0.9,
          versionCalculation: 0.9
        }
      };

      const validation = parser.validate(result);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Overall confidence out of range: 1.5');
    });

    it('should warn about breaking changes without major bump', () => {
      const result: AnalysisResult = {
        scope: {
          toCommit: 'abc123',
          completionDocuments: [],
          analysisDate: new Date()
        },
        changes: {
          breakingChanges: [
            {
              id: 'bc-1',
              title: 'Breaking Change',
              description: 'API changed',
              affectedAPIs: ['api1'],
              source: 'task-1',
              severity: 'high'
            }
          ],
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
        },
        versionRecommendation: {
          currentVersion: '1.0.0',
          recommendedVersion: '1.1.0',
          bumpType: 'minor', // Should be major
          rationale: 'New features',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'Release notes',
        confidence: {
          overall: 0.85,
          extraction: 0.8,
          categorization: 0.85,
          deduplication: 0.9,
          versionCalculation: 0.9
        }
      };

      const validation = parser.validate(result);

      expect(validation.valid).toBe(true); // Still valid, just a warning
      expect(validation.warnings).toContain('Breaking changes detected but not recommending major version bump');
    });

    it('should warn about version bump with no changes', () => {
      const result: AnalysisResult = {
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
          bumpType: 'minor', // Bump with no changes
          rationale: 'New features',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'Release notes',
        confidence: {
          overall: 0.85,
          extraction: 0.8,
          categorization: 0.85,
          deduplication: 0.9,
          versionCalculation: 0.9
        }
      };

      const validation = parser.validate(result);

      expect(validation.valid).toBe(true);
      expect(validation.warnings).toContain('No changes detected but version bump recommended');
    });
  });

  describe('error handling', () => {
    it('should provide detailed error messages for nested fields', () => {
      const invalidNestedJSON = JSON.stringify({
        scope: {
          toCommit: 'abc123',
          completionDocuments: [
            {
              path: 'test.md',
              content: 'content',
              lastModified: 'invalid-date', // Invalid date
              gitCommit: 'abc',
              metadata: {
                title: 'Test',
                type: 'task-completion'
              }
            }
          ],
          analysisDate: '2025-01-01T00:00:00.000Z'
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
          rationale: 'test',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'test',
        confidence: {
          overall: 0.8,
          extraction: 0.8,
          categorization: 0.8,
          deduplication: 0.8,
          versionCalculation: 0.8
        }
      });

      expect(() => parser.parse(invalidNestedJSON)).toThrow(JSONParseError);
      expect(() => parser.parse(invalidNestedJSON)).toThrow(/Invalid date/);
    });

    it('should handle array parsing errors with index information', () => {
      const invalidArrayJSON = JSON.stringify({
        scope: {
          toCommit: 'abc123',
          completionDocuments: [],
          analysisDate: '2025-01-01T00:00:00.000Z'
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
            ambiguousItems: [123], // Should be string
            filteredItems: []
          }
        },
        versionRecommendation: {
          currentVersion: '1.0.0',
          recommendedVersion: '1.0.0',
          bumpType: 'none',
          rationale: 'test',
          confidence: 0.9,
          evidence: []
        },
        releaseNotes: 'test',
        confidence: {
          overall: 0.8,
          extraction: 0.8,
          categorization: 0.8,
          deduplication: 0.8,
          versionCalculation: 0.8
        }
      });

      expect(() => parser.parse(invalidArrayJSON)).toThrow(JSONParseError);
      expect(() => parser.parse(invalidArrayJSON)).toThrow(/Expected string at index 0/);
    });
  });
});
