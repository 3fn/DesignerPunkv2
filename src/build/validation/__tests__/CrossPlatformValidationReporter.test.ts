/**
 * @category evergreen
 * @purpose Verify build system generates required outputs with correct structure
 */
/**
 * Tests for CrossPlatformValidationReporter
 * 
 * Validates that the reporter correctly aggregates results from:
 * - Task 8.1: Mathematical consistency validation
 * - Task 8.2: Token comparison
 * - Task 8.3: Interface contract validation
 */

import { CrossPlatformValidationReporter } from '../CrossPlatformValidationReporter';
import { BuildMathematicalConsistencyResult } from '../MathematicalConsistencyValidator';
import { BatchComparisonResult } from '../TokenComparator';
import { InterfaceContractValidationResult } from '../InterfaceContractValidator';
import { Platform } from '../../types/Platform';

describe('CrossPlatformValidationReporter', () => {
  let reporter: CrossPlatformValidationReporter;

  beforeEach(() => {
    reporter = new CrossPlatformValidationReporter();
  });

  describe('generateReport', () => {
    it('should generate comprehensive report with all validation results', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      expect(report.valid).toBe(true);
      expect(report.metadata.platforms).toEqual(['ios', 'android', 'web']);
      expect(report.mathematicalConsistency).toBeDefined();
      expect(report.tokenComparison).toBeDefined();
      expect(report.interfaceValidation).toBeDefined();
      expect(report.recommendations).toBeDefined();
      expect(report.executiveSummary).toBeDefined();
    });

    it('should mark report as invalid if mathematical consistency fails', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(false);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      expect(report.valid).toBe(false);
      expect(report.mathematicalConsistency.valid).toBe(false);
    });

    it('should mark report as invalid if token comparison fails', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(false);
      const interfaceResults = [createMockInterfaceResult(true)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      expect(report.valid).toBe(false);
      expect(report.tokenComparison.valid).toBe(false);
    });

    it('should mark report as invalid if interface validation fails', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(false)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      expect(report.valid).toBe(false);
      expect(report.interfaceValidation.valid).toBe(false);
    });
  });


  describe('summarizeMathematicalConsistency', () => {
    it('should summarize mathematical consistency results', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      expect(report.mathematicalConsistency.crossPlatformConsistency.status).toBe('pass');
      expect(report.mathematicalConsistency.mathematicalRelationships.status).toBe('pass');
      expect(report.mathematicalConsistency.strategicFlexibility.status).toBe('pass');
      expect(report.mathematicalConsistency.accessibility.status).toBe('pass');
    });

    it('should identify key findings from mathematical validation', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(false);
      mathematicalResult.accessibility.contrastRatioIssues = [
        {
          foregroundColor: '#000000',
          backgroundColor: '#333333',
          contrastRatio: 2.5,
          requiredRatio: 4.5,
          level: 'AA',
          context: 'normal-text'
        }
      ];
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      expect(report.mathematicalConsistency.keyFindings.length).toBeGreaterThan(0);
      expect(report.mathematicalConsistency.keyFindings.some(
        f => f.includes('contrast ratio')
      )).toBe(true);
    });
  });

  describe('summarizeTokenComparison', () => {
    it('should summarize token comparison results', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      expect(report.tokenComparison.totalTokens).toBe(10);
      expect(report.tokenComparison.consistentTokens).toBe(10);
      expect(report.tokenComparison.inconsistentTokens).toBe(0);
      expect(report.tokenComparison.averageConsistencyScore).toBe(1.0);
    });

    it('should calculate percentages by token type', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      expect(report.tokenComparison.byTokenType.primitive.percentage).toBe(100);
      expect(report.tokenComparison.byTokenType.semantic.percentage).toBe(100);
      expect(report.tokenComparison.byTokenType.component.percentage).toBe(100);
    });
  });


  describe('summarizeInterfaceValidation', () => {
    it('should summarize interface validation results', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      expect(report.interfaceValidation.componentsValidated).toBe(1);
      expect(report.interfaceValidation.apiDifferences).toBe(0);
    });

    it('should count API differences by type', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(false)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      expect(report.interfaceValidation.byDifferenceType.method).toBeGreaterThan(0);
    });
  });

  describe('generateRecommendations', () => {
    it('should generate critical recommendations for interface violations', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(false)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      const criticalSection = report.recommendations.find(s => s.priority === 'critical');
      expect(criticalSection).toBeDefined();
      expect(criticalSection!.recommendations.length).toBeGreaterThan(0);
    });

    it('should generate high priority recommendations for token inconsistencies', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(false);
      const interfaceResults = [createMockInterfaceResult(true)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      const highSection = report.recommendations.find(s => s.priority === 'high');
      expect(highSection).toBeDefined();
      expect(highSection!.recommendations.length).toBeGreaterThan(0);
    });

    it('should include actionable suggestions in recommendations', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(false);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      report.recommendations.forEach(section => {
        section.recommendations.forEach(rec => {
          expect(rec.description).toBeTruthy();
          expect(rec.action).toBeTruthy();
        });
      });
    });
  });


  describe('generateExecutiveSummary', () => {
    it('should generate executive summary with overall status', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      expect(report.executiveSummary.overallStatus).toBe('pass');
      expect(report.executiveSummary.successRate).toBe(100);
      expect(report.executiveSummary.criticalIssues).toBe(0);
    });

    it('should mark status as fail when critical issues exist', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(false);
      mathematicalResult.accessibility.contrastRatioIssues = [
        {
          foregroundColor: '#000000',
          backgroundColor: '#333333',
          contrastRatio: 2.5,
          requiredRatio: 4.5,
          level: 'AA',
          context: 'normal-text'
        }
      ];
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      expect(report.executiveSummary.overallStatus).toBe('fail');
      expect(report.executiveSummary.criticalIssues).toBeGreaterThan(0);
    });

    it('should provide next steps based on validation results', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(false);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];

      // Act
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Assert
      expect(report.executiveSummary.nextSteps.length).toBeGreaterThan(0);
      expect(report.executiveSummary.nextSteps.some(
        step => step.includes('Re-run validation')
      )).toBe(true);
    });
  });

  describe('formatAsText', () => {
    it('should format report as human-readable text', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Act
      const text = reporter.formatAsText(report);

      // Assert
      expect(text).toContain('CROSS-PLATFORM VALIDATION REPORT');
      expect(text).toContain('EXECUTIVE SUMMARY');
      expect(text).toContain('MATHEMATICAL CONSISTENCY');
      expect(text).toContain('TOKEN COMPARISON');
      expect(text).toContain('INTERFACE VALIDATION');
      expect(text).toContain('NEXT STEPS');
    });

    it('should include all platforms in text format', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Act
      const text = reporter.formatAsText(report);

      // Assert
      expect(text).toContain('ios');
      expect(text).toContain('android');
      expect(text).toContain('web');
    });
  });


  describe('formatAsJSON', () => {
    it('should format report as valid JSON', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Act
      const json = reporter.formatAsJSON(report);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.valid).toBe(true);
      expect(parsed.metadata).toBeDefined();
      expect(parsed.mathematicalConsistency).toBeDefined();
      expect(parsed.tokenComparison).toBeDefined();
      expect(parsed.interfaceValidation).toBeDefined();
    });
  });

  describe('formatAsMarkdown', () => {
    it('should format report as markdown', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Act
      const markdown = reporter.formatAsMarkdown(report);

      // Assert
      expect(markdown).toContain('# Cross-Platform Validation Report');
      expect(markdown).toContain('## Executive Summary');
      expect(markdown).toContain('## Mathematical Consistency');
      expect(markdown).toContain('## Token Comparison');
      expect(markdown).toContain('## Interface Validation');
      expect(markdown).toContain('## Next Steps');
    });

    it('should use markdown formatting for status indicators', () => {
      // Arrange
      const mathematicalResult = createMockMathematicalResult(true);
      const tokenComparisonResult = createMockTokenComparisonResult(true);
      const interfaceResults = [createMockInterfaceResult(true)];
      const report = reporter.generateReport(
        mathematicalResult,
        tokenComparisonResult,
        interfaceResults
      );

      // Act
      const markdown = reporter.formatAsMarkdown(report);

      // Assert
      expect(markdown).toContain('✓ PASS');
    });
  });
});

// Helper functions to create mock data

function createMockMathematicalResult(valid: boolean): BuildMathematicalConsistencyResult {
  return {
    valid,
    crossPlatformConsistency: {
      valid,
      results: [],
      summary: valid ? '10/10 tokens maintain cross-platform consistency' : '8/10 tokens maintain cross-platform consistency'
    },
    mathematicalRelationships: {
      valid,
      results: [],
      summary: valid ? 'Pass: 10, Warning: 0, Error: 0' : 'Pass: 8, Warning: 1, Error: 1'
    },
    strategicFlexibility: {
      valid,
      results: [],
      summary: valid ? '10 aligned, 0 strategic flexibility tokens' : '8 aligned, 2 strategic flexibility tokens'
    },
    accessibility: {
      valid,
      contrastRatioIssues: [],
      touchTargetIssues: [],
      recommendations: []
    },
    recommendations: [],
    metadata: {
      timestamp: new Date(),
      platformsValidated: ['ios' as Platform, 'android' as Platform, 'web' as Platform],
      tokensValidated: 10,
      validationDuration: 100
    }
  };
}

function createMockTokenComparisonResult(valid: boolean): BatchComparisonResult {
  return {
    totalTokens: 10,
    consistentTokens: valid ? 10 : 8,
    inconsistentTokens: valid ? 0 : 2,
    averageConsistencyScore: valid ? 1.0 : 0.85,
    tokenResults: [],
    commonIssues: valid ? [] : ['Unit conversion mismatch', 'Rounding differences'],
    platformIssues: {
      ios: valid ? 0 : 1,
      android: valid ? 0 : 1,
      web: 0
    },
    byTokenType: {
      primitive: { total: 5, consistent: valid ? 5 : 4 },
      semantic: { total: 3, consistent: valid ? 3 : 2 },
      component: { total: 2, consistent: valid ? 2 : 2 }
    }
  };
}

function createMockInterfaceResult(valid: boolean): InterfaceContractValidationResult {
  return {
    valid,
    component: 'TestComponent',
    report: {
      valid,
      component: 'TestComponent',
      results: [],
      errorSummary: {
        total: valid ? 0 : 1,
        byType: {
          method_mismatch: valid ? 0 : 1,
          property_mismatch: 0,
          type_mismatch: 0,
          parameter_mismatch: 0,
          return_type_mismatch: 0,
          event_mismatch: 0,
          state_mismatch: 0,
          missing_implementation: 0,
          signature_mismatch: 0
        }
      },
      warningSummary: {
        total: 0,
        byType: {
          optional_property_difference: 0,
          description_missing: 0,
          naming_convention_difference: 0,
          default_value_difference: 0
        }
      },
      timestamp: new Date()
    },
    apiDifferences: valid ? [] : [
      {
        type: 'method',
        name: 'onClick',
        platforms: ['ios' as Platform, 'android' as Platform],
        description: 'Method signature mismatch',
        expected: 'onClick(): void',
        actual: 'onClick(event: Event): void'
      }
    ],
    affectedFiles: valid ? [] : [
      {
        platform: 'ios' as Platform,
        path: 'platforms/ios/TestComponent.swift',
        element: 'onClick'
      }
    ]
  };
}
