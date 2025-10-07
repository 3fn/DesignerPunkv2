/**
 * Validation Reporter
 * 
 * Generates detailed validation reports with platform differences,
 * actionable suggestions, file paths, and validation status summaries.
 */

import {
  ValidationReport,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationErrorType,
} from './types/ValidationResult';
import { Platform } from './types/InterfaceDefinition';

export interface DetailedValidationReport {
  /** Overall validation status */
  valid: boolean;
  
  /** Component name */
  component: string;
  
  /** Summary section */
  summary: ValidationSummary;
  
  /** Platform-specific results */
  platformResults: PlatformValidationDetail[];
  
  /** Cross-platform differences */
  differences: PlatformDifference[];
  
  /** Actionable suggestions */
  suggestions: ActionableSuggestion[];
  
  /** Report timestamp */
  timestamp: Date;
}

export interface ValidationSummary {
  /** Total errors across all platforms */
  totalErrors: number;
  
  /** Total warnings across all platforms */
  totalWarnings: number;
  
  /** Platforms validated */
  platforms: Platform[];
  
  /** Validation status by platform */
  platformStatus: Record<Platform, 'pass' | 'fail'>;
  
  /** Error breakdown by type */
  errorsByType: Record<ValidationErrorType, number>;
}

export interface PlatformValidationDetail {
  /** Platform name */
  platform: Platform;
  
  /** Validation status */
  status: 'pass' | 'fail';
  
  /** Number of errors */
  errorCount: number;
  
  /** Number of warnings */
  warningCount: number;
  
  /** Detailed errors with file paths */
  errors: DetailedError[];
  
  /** Detailed warnings */
  warnings: DetailedWarning[];
}

export interface DetailedError {
  /** Error type */
  type: ValidationErrorType;
  
  /** Error message */
  message: string;
  
  /** Expected value */
  expected: string;
  
  /** Actual value */
  actual: string;
  
  /** Location (property/method name) */
  location: string;
  
  /** File path where error occurred */
  filePath?: string;
  
  /** Line number in file */
  lineNumber?: number;
  
  /** Platforms involved */
  platforms: Platform[];
  
  /** Suggestion for fixing */
  suggestion: string;
}

export interface DetailedWarning {
  /** Warning type */
  type: string;
  
  /** Warning message */
  message: string;
  
  /** Location */
  location: string;
  
  /** File path */
  filePath?: string;
  
  /** Suggestion */
  suggestion?: string;
}

export interface PlatformDifference {
  /** Type of difference */
  type: 'property' | 'method' | 'event' | 'state';
  
  /** Name of the differing element */
  name: string;
  
  /** Platforms involved */
  platforms: Platform[];
  
  /** Description of difference */
  description: string;
  
  /** Platform-specific values */
  values: Record<Platform, string>;
  
  /** Suggestion for resolution */
  suggestion: string;
}

export interface ActionableSuggestion {
  /** Priority level */
  priority: 'high' | 'medium' | 'low';
  
  /** Suggestion title */
  title: string;
  
  /** Detailed description */
  description: string;
  
  /** Affected platforms */
  platforms: Platform[];
  
  /** Steps to resolve */
  steps: string[];
  
  /** Related errors */
  relatedErrors: string[];
}

export class ValidationReporter {
  /**
   * Generate detailed validation report from validation results
   */
  generateReport(report: ValidationReport): DetailedValidationReport {
    const summary = this.generateSummary(report);
    const platformResults = this.generatePlatformResults(report);
    const differences = this.extractPlatformDifferences(report);
    const suggestions = this.generateActionableSuggestions(report, differences);

    return {
      valid: report.valid,
      component: report.component,
      summary,
      platformResults,
      differences,
      suggestions,
      timestamp: report.timestamp,
    };
  }

  /**
   * Generate summary section
   */
  private generateSummary(report: ValidationReport): ValidationSummary {
    const platforms = report.results.map(r => r.platform).filter((p): p is Platform => p !== undefined);
    const platformStatus: Record<string, 'pass' | 'fail'> = {};

    for (const result of report.results) {
      if (result.platform) {
        platformStatus[result.platform] = result.valid ? 'pass' : 'fail';
      }
    }

    return {
      totalErrors: report.errorSummary.total,
      totalWarnings: report.warningSummary.total,
      platforms,
      platformStatus: platformStatus as Record<Platform, 'pass' | 'fail'>,
      errorsByType: report.errorSummary.byType,
    };
  }

  /**
   * Generate platform-specific validation details
   */
  private generatePlatformResults(report: ValidationReport): PlatformValidationDetail[] {
    return report.results.map(result => {
      if (!result.platform) {
        throw new Error('Platform is required for validation result');
      }

      const errors = result.errors.map(error => this.enrichError(error, result.platform!));
      const warnings = result.warnings.map(warning => this.enrichWarning(warning));

      return {
        platform: result.platform,
        status: result.valid ? 'pass' : 'fail',
        errorCount: result.errors.length,
        warningCount: result.warnings.length,
        errors,
        warnings,
      };
    });
  }

  /**
   * Enrich error with file path and actionable suggestion
   */
  private enrichError(error: ValidationError, platform: Platform): DetailedError {
    const filePath = this.inferFilePath(error, platform);
    const suggestion = this.generateErrorSuggestion(error);

    return {
      type: error.type,
      message: error.message,
      expected: error.expected,
      actual: error.actual,
      location: error.location || 'unknown',
      filePath,
      lineNumber: undefined, // Would need source code parsing to determine
      platforms: error.platforms,
      suggestion,
    };
  }

  /**
   * Enrich warning with details
   */
  private enrichWarning(warning: ValidationWarning): DetailedWarning {
    return {
      type: warning.type,
      message: warning.message,
      location: warning.location || 'unknown',
      filePath: undefined,
      suggestion: warning.suggestion,
    };
  }

  /**
   * Infer file path based on error and platform
   */
  private inferFilePath(error: ValidationError, platform: Platform): string {
    const location = error.location || 'Component';
    
    switch (platform) {
      case 'ios':
        return `platforms/ios/${location}.swift`;
      case 'android':
        return `platforms/android/${location}.kt`;
      case 'web':
        return `platforms/web/${location}.ts`;
      default:
        return `platforms/${platform}/${location}`;
    }
  }

  /**
   * Generate actionable suggestion for error
   */
  private generateErrorSuggestion(error: ValidationError): string {
    switch (error.type) {
      case 'property_mismatch':
        return `Add the missing property "${error.location}" to ${error.platforms.join(' and ')} implementations to match the interface contract.`;
      
      case 'method_mismatch':
        return `Implement the missing method "${error.location}" in ${error.platforms.join(' and ')} to maintain API consistency.`;
      
      case 'type_mismatch':
        return `Update the type of "${error.location}" from "${error.actual}" to "${error.expected}" to match across platforms.`;
      
      case 'parameter_mismatch':
        return `Align the parameters of "${error.location}" to match: expected ${error.expected}, but found ${error.actual}.`;
      
      case 'return_type_mismatch':
        return `Change the return type of "${error.location}" from "${error.actual}" to "${error.expected}" for cross-platform consistency.`;
      
      case 'event_mismatch':
        return `Add the missing event "${error.location}" to ${error.platforms.join(' and ')} implementations.`;
      
      case 'state_mismatch':
        return `Add the missing state "${error.location}" to ${error.platforms.join(' and ')} implementations.`;
      
      case 'signature_mismatch':
        return `Update the signature of "${error.location}" to match: expected ${error.expected}, but found ${error.actual}.`;
      
      default:
        return `Review and fix the mismatch in "${error.location}" across ${error.platforms.join(' and ')}.`;
    }
  }

  /**
   * Extract platform differences from validation report
   */
  private extractPlatformDifferences(report: ValidationReport): PlatformDifference[] {
    const differences: PlatformDifference[] = [];
    const processedLocations = new Set<string>();

    for (const result of report.results) {
      for (const error of result.errors) {
        const location = error.location || 'unknown';
        const key = `${error.type}-${location}`;

        if (processedLocations.has(key)) {
          continue;
        }
        processedLocations.add(key);

        const difference = this.createPlatformDifference(error, report.results);
        if (difference) {
          differences.push(difference);
        }
      }
    }

    return differences;
  }

  /**
   * Create platform difference from error
   */
  private createPlatformDifference(
    error: ValidationError,
    results: ValidationResult[]
  ): PlatformDifference | null {
    const location = error.location || 'unknown';
    
    let type: 'property' | 'method' | 'event' | 'state';
    if (error.type.includes('property')) {
      type = 'property';
    } else if (error.type.includes('method')) {
      type = 'method';
    } else if (error.type.includes('event')) {
      type = 'event';
    } else if (error.type.includes('state')) {
      type = 'state';
    } else {
      type = 'property'; // default
    }

    const values: Record<string, string> = {};
    for (const platform of error.platforms) {
      const result = results.find(r => r.platform === platform);
      if (result) {
        const relatedError = result.errors.find(e => e.location === location);
        if (relatedError) {
          values[platform] = relatedError.actual || 'not found';
        }
      }
    }

    return {
      type,
      name: location,
      platforms: error.platforms,
      description: error.message,
      values: values as Record<Platform, string>,
      suggestion: this.generateErrorSuggestion(error),
    };
  }

  /**
   * Generate actionable suggestions for fixing validation issues
   */
  private generateActionableSuggestions(
    report: ValidationReport,
    differences: PlatformDifference[]
  ): ActionableSuggestion[] {
    const suggestions: ActionableSuggestion[] = [];

    // Group errors by type
    const errorsByType = this.groupErrorsByType(report);

    // Generate suggestions for each error type
    for (const [errorType, errors] of Object.entries(errorsByType)) {
      const suggestion = this.createSuggestionForErrorType(
        errorType as ValidationErrorType,
        errors
      );
      if (suggestion) {
        suggestions.push(suggestion);
      }
    }

    // Add general suggestions if there are many errors
    if (report.errorSummary.total > 10) {
      suggestions.push({
        priority: 'high',
        title: 'Consider Interface Redesign',
        description: `Found ${report.errorSummary.total} validation errors. Consider reviewing the interface design to ensure it's appropriate for all platforms.`,
        platforms: report.results.map(r => r.platform).filter((p): p is Platform => p !== undefined),
        steps: [
          'Review the interface contract definition',
          'Ensure platform-specific constraints are considered',
          'Consider using platform adapters for incompatible APIs',
          'Document platform-specific behavior differences',
        ],
        relatedErrors: ['Multiple validation errors'],
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Group errors by type
   */
  private groupErrorsByType(report: ValidationReport): Record<string, ValidationError[]> {
    const grouped: Record<string, ValidationError[]> = {};

    for (const result of report.results) {
      for (const error of result.errors) {
        if (!grouped[error.type]) {
          grouped[error.type] = [];
        }
        grouped[error.type].push(error);
      }
    }

    return grouped;
  }

  /**
   * Create suggestion for specific error type
   */
  private createSuggestionForErrorType(
    errorType: ValidationErrorType,
    errors: ValidationError[]
  ): ActionableSuggestion | null {
    const platforms = Array.from(new Set(errors.flatMap(e => e.platforms)));
    const locations = errors.map(e => e.location || 'unknown');

    switch (errorType) {
      case 'property_mismatch':
        return {
          priority: 'high',
          title: 'Fix Property Mismatches',
          description: `Found ${errors.length} property mismatches across platforms. Properties must be consistent for unified API contracts.`,
          platforms,
          steps: [
            'Review the interface definition for missing properties',
            'Add missing properties to platform implementations',
            'Ensure property names match exactly across platforms',
            'Verify property types are equivalent across platforms',
          ],
          relatedErrors: locations,
        };

      case 'method_mismatch':
        return {
          priority: 'high',
          title: 'Fix Method Mismatches',
          description: `Found ${errors.length} method mismatches. All platforms must implement the same methods.`,
          platforms,
          steps: [
            'Review the interface definition for missing methods',
            'Implement missing methods in platform code',
            'Ensure method names match exactly',
            'Verify method signatures are equivalent',
          ],
          relatedErrors: locations,
        };

      case 'type_mismatch':
        return {
          priority: 'high',
          title: 'Fix Type Mismatches',
          description: `Found ${errors.length} type mismatches. Types must be consistent across platforms.`,
          platforms,
          steps: [
            'Review type definitions across platforms',
            'Update types to match the interface contract',
            'Consider platform-specific type adapters if needed',
            'Document any necessary type conversions',
          ],
          relatedErrors: locations,
        };

      case 'parameter_mismatch':
        return {
          priority: 'medium',
          title: 'Fix Parameter Mismatches',
          description: `Found ${errors.length} parameter mismatches in method signatures.`,
          platforms,
          steps: [
            'Review method parameter lists',
            'Ensure parameter order matches across platforms',
            'Verify parameter types are equivalent',
            'Update method signatures to match',
          ],
          relatedErrors: locations,
        };

      case 'return_type_mismatch':
        return {
          priority: 'medium',
          title: 'Fix Return Type Mismatches',
          description: `Found ${errors.length} return type mismatches in methods.`,
          platforms,
          steps: [
            'Review method return types',
            'Update return types to match interface contract',
            'Consider using type adapters if needed',
            'Ensure async/promise handling is consistent',
          ],
          relatedErrors: locations,
        };

      default:
        return null;
    }
  }

  /**
   * Format report as human-readable text
   */
  formatAsText(report: DetailedValidationReport): string {
    const lines: string[] = [];

    // Header
    lines.push('='.repeat(80));
    lines.push(`VALIDATION REPORT: ${report.component}`);
    lines.push(`Status: ${report.valid ? 'PASS ✓' : 'FAIL ✗'}`);
    lines.push(`Timestamp: ${report.timestamp.toISOString()}`);
    lines.push('='.repeat(80));
    lines.push('');

    // Summary
    lines.push('SUMMARY');
    lines.push('-'.repeat(80));
    lines.push(`Total Errors: ${report.summary.totalErrors}`);
    lines.push(`Total Warnings: ${report.summary.totalWarnings}`);
    lines.push(`Platforms: ${report.summary.platforms.join(', ')}`);
    lines.push('');
    lines.push('Platform Status:');
    for (const [platform, status] of Object.entries(report.summary.platformStatus)) {
      lines.push(`  ${platform}: ${status === 'pass' ? '✓ PASS' : '✗ FAIL'}`);
    }
    lines.push('');

    // Platform Results
    if (report.platformResults.length > 0) {
      lines.push('PLATFORM RESULTS');
      lines.push('-'.repeat(80));
      
      for (const platformResult of report.platformResults) {
        lines.push(`\n${platformResult.platform.toUpperCase()}`);
        lines.push(`  Status: ${platformResult.status === 'pass' ? '✓ PASS' : '✗ FAIL'}`);
        lines.push(`  Errors: ${platformResult.errorCount}`);
        lines.push(`  Warnings: ${platformResult.warningCount}`);

        if (platformResult.errors.length > 0) {
          lines.push('\n  Errors:');
          for (const error of platformResult.errors) {
            lines.push(`    • [${error.type}] ${error.message}`);
            lines.push(`      Location: ${error.location}`);
            if (error.filePath) {
              lines.push(`      File: ${error.filePath}`);
            }
            lines.push(`      Expected: ${error.expected}`);
            lines.push(`      Actual: ${error.actual}`);
            lines.push(`      Suggestion: ${error.suggestion}`);
            lines.push('');
          }
        }
      }
    }

    // Platform Differences
    if (report.differences.length > 0) {
      lines.push('\nPLATFORM DIFFERENCES');
      lines.push('-'.repeat(80));
      
      for (const diff of report.differences) {
        lines.push(`\n${diff.type.toUpperCase()}: ${diff.name}`);
        lines.push(`  Platforms: ${diff.platforms.join(', ')}`);
        lines.push(`  Description: ${diff.description}`);
        lines.push('  Values:');
        for (const [platform, value] of Object.entries(diff.values)) {
          lines.push(`    ${platform}: ${value}`);
        }
        lines.push(`  Suggestion: ${diff.suggestion}`);
      }
    }

    // Actionable Suggestions
    if (report.suggestions.length > 0) {
      lines.push('\nACTIONABLE SUGGESTIONS');
      lines.push('-'.repeat(80));
      
      for (const suggestion of report.suggestions) {
        lines.push(`\n[${suggestion.priority.toUpperCase()}] ${suggestion.title}`);
        lines.push(`  ${suggestion.description}`);
        lines.push(`  Platforms: ${suggestion.platforms.join(', ')}`);
        lines.push('  Steps:');
        for (let i = 0; i < suggestion.steps.length; i++) {
          lines.push(`    ${i + 1}. ${suggestion.steps[i]}`);
        }
      }
    }

    lines.push('\n' + '='.repeat(80));
    lines.push('END OF REPORT');
    lines.push('='.repeat(80));

    return lines.join('\n');
  }

  /**
   * Format report as JSON
   */
  formatAsJSON(report: DetailedValidationReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Format report as Markdown
   */
  formatAsMarkdown(report: DetailedValidationReport): string {
    const lines: string[] = [];

    // Header
    lines.push(`# Validation Report: ${report.component}`);
    lines.push('');
    lines.push(`**Status:** ${report.valid ? '✓ PASS' : '✗ FAIL'}  `);
    lines.push(`**Timestamp:** ${report.timestamp.toISOString()}  `);
    lines.push('');

    // Summary
    lines.push('## Summary');
    lines.push('');
    lines.push(`- **Total Errors:** ${report.summary.totalErrors}`);
    lines.push(`- **Total Warnings:** ${report.summary.totalWarnings}`);
    lines.push(`- **Platforms:** ${report.summary.platforms.join(', ')}`);
    lines.push('');
    lines.push('### Platform Status');
    lines.push('');
    for (const [platform, status] of Object.entries(report.summary.platformStatus)) {
      lines.push(`- **${platform}:** ${status === 'pass' ? '✓ PASS' : '✗ FAIL'}`);
    }
    lines.push('');

    // Platform Results
    if (report.platformResults.length > 0) {
      lines.push('## Platform Results');
      lines.push('');
      
      for (const platformResult of report.platformResults) {
        lines.push(`### ${platformResult.platform.toUpperCase()}`);
        lines.push('');
        lines.push(`- **Status:** ${platformResult.status === 'pass' ? '✓ PASS' : '✗ FAIL'}`);
        lines.push(`- **Errors:** ${platformResult.errorCount}`);
        lines.push(`- **Warnings:** ${platformResult.warningCount}`);
        lines.push('');

        if (platformResult.errors.length > 0) {
          lines.push('#### Errors');
          lines.push('');
          for (const error of platformResult.errors) {
            lines.push(`**[${error.type}]** ${error.message}`);
            lines.push('');
            lines.push(`- **Location:** \`${error.location}\``);
            if (error.filePath) {
              lines.push(`- **File:** \`${error.filePath}\``);
            }
            lines.push(`- **Expected:** \`${error.expected}\``);
            lines.push(`- **Actual:** \`${error.actual}\``);
            lines.push(`- **Suggestion:** ${error.suggestion}`);
            lines.push('');
          }
        }
      }
    }

    // Platform Differences
    if (report.differences.length > 0) {
      lines.push('## Platform Differences');
      lines.push('');
      
      for (const diff of report.differences) {
        lines.push(`### ${diff.type}: ${diff.name}`);
        lines.push('');
        lines.push(`**Platforms:** ${diff.platforms.join(', ')}  `);
        lines.push(`**Description:** ${diff.description}  `);
        lines.push('');
        lines.push('**Values:**');
        lines.push('');
        for (const [platform, value] of Object.entries(diff.values)) {
          lines.push(`- **${platform}:** \`${value}\``);
        }
        lines.push('');
        lines.push(`**Suggestion:** ${diff.suggestion}`);
        lines.push('');
      }
    }

    // Actionable Suggestions
    if (report.suggestions.length > 0) {
      lines.push('## Actionable Suggestions');
      lines.push('');
      
      for (const suggestion of report.suggestions) {
        lines.push(`### [${suggestion.priority.toUpperCase()}] ${suggestion.title}`);
        lines.push('');
        lines.push(suggestion.description);
        lines.push('');
        lines.push(`**Platforms:** ${suggestion.platforms.join(', ')}`);
        lines.push('');
        lines.push('**Steps:**');
        lines.push('');
        for (let i = 0; i < suggestion.steps.length; i++) {
          lines.push(`${i + 1}. ${suggestion.steps[i]}`);
        }
        lines.push('');
      }
    }

    return lines.join('\n');
  }
}
