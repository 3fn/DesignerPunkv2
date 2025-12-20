/**
 * @category evergreen
 * @purpose Verify build system generates required outputs with correct structure
 */
/**
 * Error Reporter Tests
 * 
 * Tests for error reporting functionality including:
 * - Report generation with various error types
 * - Error context and stack trace inclusion
 * - Recovery recommendations
 * - Build result summaries
 * - Multiple output formats (text, json, markdown)
 */

import { ErrorReporter, BuildResultSummary } from '../ErrorReporter';
import { createBuildError, ErrorCodes } from '../BuildError';

describe('ErrorReporter', () => {
  describe('generateReport', () => {
    it('should generate report with no errors', () => {
      const reporter = new ErrorReporter();
      const report = reporter.generateReport([]);
      
      expect(report.totalErrors).toBe(0);
      expect(report.errorsBySeverity.error).toBe(0);
      expect(report.errorsBySeverity.warning).toBe(0);
      expect(report.errorsBySeverity.info).toBe(0);
      expect(report.criticalErrors).toHaveLength(0);
      expect(report.summary).toContain('0');
    });
    
    it('should count errors by severity', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'TEST_ERROR_1',
          message: 'Error 1',
          severity: 'error',
          category: 'build',
        }),
        createBuildError({
          code: 'TEST_WARNING_1',
          message: 'Warning 1',
          severity: 'warning',
          category: 'build',
        }),
        createBuildError({
          code: 'TEST_INFO_1',
          message: 'Info 1',
          severity: 'info',
          category: 'build',
        }),
      ];
      
      const report = reporter.generateReport(errors);
      
      expect(report.totalErrors).toBe(3);
      expect(report.errorsBySeverity.error).toBe(1);
      expect(report.errorsBySeverity.warning).toBe(1);
      expect(report.errorsBySeverity.info).toBe(1);
    });
    
    it('should count errors by category', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'CONFIG_ERROR',
          message: 'Config error',
          severity: 'error',
          category: 'config',
        }),
        createBuildError({
          code: 'BUILD_ERROR',
          message: 'Build error',
          severity: 'error',
          category: 'build',
        }),
        createBuildError({
          code: 'TOKEN_ERROR',
          message: 'Token error',
          severity: 'error',
          category: 'token',
        }),
        createBuildError({
          code: 'INTERFACE_ERROR',
          message: 'Interface error',
          severity: 'error',
          category: 'interface',
        }),
      ];
      
      const report = reporter.generateReport(errors);
      
      expect(report.errorsByCategory.config).toBe(1);
      expect(report.errorsByCategory.build).toBe(1);
      expect(report.errorsByCategory.token).toBe(1);
      expect(report.errorsByCategory.interface).toBe(1);
    });
    
    it('should count errors by platform', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'IOS_ERROR',
          message: 'iOS error',
          severity: 'error',
          category: 'build',
          platform: 'ios',
        }),
        createBuildError({
          code: 'ANDROID_ERROR',
          message: 'Android error',
          severity: 'error',
          category: 'build',
          platform: 'android',
        }),
        createBuildError({
          code: 'WEB_ERROR',
          message: 'Web error',
          severity: 'error',
          category: 'build',
          platform: 'web',
        }),
      ];
      
      const report = reporter.generateReport(errors);
      
      expect(report.errorsByPlatform.ios).toBe(1);
      expect(report.errorsByPlatform.android).toBe(1);
      expect(report.errorsByPlatform.web).toBe(1);
    });
    
    it('should identify critical errors', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'CRITICAL_ERROR',
          message: 'Critical error',
          severity: 'error',
          category: 'build',
        }),
        createBuildError({
          code: 'WARNING',
          message: 'Warning',
          severity: 'warning',
          category: 'build',
        }),
      ];
      
      const report = reporter.generateReport(errors);
      
      expect(report.criticalErrors).toHaveLength(1);
      expect(report.criticalErrors[0].code).toBe('CRITICAL_ERROR');
    });
    
    it('should include build summary when provided', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'BUILD_ERROR',
          message: 'Build failed',
          severity: 'error',
          category: 'build',
          platform: 'ios',
        }),
      ];
      
      const buildSummary: BuildResultSummary = {
        totalPlatforms: 3,
        successfulPlatforms: ['android', 'web'],
        failedPlatforms: ['ios'],
        duration: 5000,
        status: 'partial',
      };
      
      const report = reporter.generateReport(errors, buildSummary);
      
      expect(report.summary).toContain('PARTIAL');
      expect(report.summary).toContain('2/3');
      expect(report.summary).toContain('5.00s');
    });
    
    it('should generate formatted report', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'TEST_ERROR',
          message: 'Test error',
          severity: 'error',
          category: 'build',
        }),
      ];
      
      const report = reporter.generateReport(errors);
      
      expect(report.formattedReport).toBeTruthy();
      expect(report.formattedReport).toContain('BUILD ERROR REPORT');
      expect(report.formattedReport).toContain('TEST_ERROR');
    });
  });
  
  describe('generateErrorSummary', () => {
    it('should generate summary for no errors', () => {
      const reporter = new ErrorReporter();
      const summary = reporter.generateErrorSummary([]);
      
      expect(summary).toContain('successfully');
      expect(summary).toContain('no errors');
    });
    
    it('should generate summary for errors only', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'ERROR_1',
          message: 'Error 1',
          severity: 'error',
          category: 'build',
        }),
        createBuildError({
          code: 'ERROR_2',
          message: 'Error 2',
          severity: 'error',
          category: 'build',
        }),
      ];
      
      const summary = reporter.generateErrorSummary(errors);
      
      expect(summary).toContain('2 errors');
    });
    
    it('should generate summary for mixed severity', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'ERROR_1',
          message: 'Error 1',
          severity: 'error',
          category: 'build',
        }),
        createBuildError({
          code: 'WARNING_1',
          message: 'Warning 1',
          severity: 'warning',
          category: 'build',
        }),
        createBuildError({
          code: 'INFO_1',
          message: 'Info 1',
          severity: 'info',
          category: 'build',
        }),
      ];
      
      const summary = reporter.generateErrorSummary(errors);
      
      expect(summary).toContain('1 error');
      expect(summary).toContain('1 warning');
      expect(summary).toContain('1 info message');
    });
  });
  
  describe('generateErrorContext', () => {
    it('should generate basic error context', () => {
      const reporter = new ErrorReporter();
      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test error message',
        severity: 'error',
        category: 'build',
        platform: 'ios',
        component: 'Button',
      });
      
      const context = reporter.generateErrorContext(error);
      
      expect(context).toContain('TEST_ERROR');
      expect(context).toContain('Test error message');
      expect(context).toContain('error');
      expect(context).toContain('build');
      expect(context).toContain('ios');
      expect(context).toContain('Button');
    });
    
    it('should include context details when enabled', () => {
      const reporter = new ErrorReporter({ includeContext: true });
      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test error',
        severity: 'error',
        category: 'build',
        context: {
          file: 'test.ts',
          line: 42,
        },
      });
      
      const context = reporter.generateErrorContext(error);
      
      expect(context).toContain('Context:');
      expect(context).toContain('file');
      expect(context).toContain('test.ts');
      expect(context).toContain('line');
      expect(context).toContain('42');
    });
    
    it('should include stack trace when enabled', () => {
      const reporter = new ErrorReporter({ includeStackTraces: true });
      const originalError = new Error('Original error');
      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test error',
        severity: 'error',
        category: 'build',
        originalError,
      });
      
      const context = reporter.generateErrorContext(error);
      
      expect(context).toContain('Stack Trace:');
      expect(context).toContain('Error: Original error');
    });
    
    it('should include suggestions', () => {
      const reporter = new ErrorReporter();
      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test error',
        severity: 'error',
        category: 'build',
        suggestions: ['Fix this', 'Try that'],
      });
      
      const context = reporter.generateErrorContext(error);
      
      expect(context).toContain('Suggestions:');
      expect(context).toContain('Fix this');
      expect(context).toContain('Try that');
    });
    
    it('should include documentation links', () => {
      const reporter = new ErrorReporter();
      const error = createBuildError({
        code: 'TEST_ERROR',
        message: 'Test error',
        severity: 'error',
        category: 'build',
        documentation: ['https://docs.example.com/error'],
      });
      
      const context = reporter.generateErrorContext(error);
      
      expect(context).toContain('Documentation:');
      expect(context).toContain('https://docs.example.com/error');
    });
  });
  
  describe('generateRecommendations', () => {
    it('should return empty recommendations for no errors', () => {
      const reporter = new ErrorReporter();
      const recommendations = reporter.generateRecommendations([]);
      
      expect(recommendations).toHaveLength(0);
    });
    
    it('should recommend addressing critical errors', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'CRITICAL_ERROR',
          message: 'Critical error',
          severity: 'error',
          category: 'build',
        }),
      ];
      
      const recommendations = reporter.generateRecommendations(errors);
      
      expect(recommendations.some(r => r.includes('critical error'))).toBe(true);
    });
    
    it('should recommend fixing configuration errors', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'CONFIG_ERROR',
          message: 'Config error',
          severity: 'error',
          category: 'config',
        }),
      ];
      
      const recommendations = reporter.generateRecommendations(errors);
      
      expect(recommendations.some(r => r.includes('configuration'))).toBe(true);
    });
    
    it('should recommend verifying tokens for token errors', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'TOKEN_ERROR',
          message: 'Token error',
          severity: 'error',
          category: 'token',
        }),
      ];
      
      const recommendations = reporter.generateRecommendations(errors);
      
      expect(recommendations.some(r => r.includes('token'))).toBe(true);
    });
    
    it('should recommend checking interfaces for interface errors', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'INTERFACE_ERROR',
          message: 'Interface error',
          severity: 'error',
          category: 'interface',
        }),
      ];
      
      const recommendations = reporter.generateRecommendations(errors);
      
      expect(recommendations.some(r => r.includes('interface'))).toBe(true);
    });
    
    it('should recommend reviewing platform-specific errors', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'PLATFORM_ERROR',
          message: 'Platform error',
          severity: 'error',
          category: 'build',
          platform: 'ios',
        }),
      ];
      
      const buildSummary: BuildResultSummary = {
        totalPlatforms: 3,
        successfulPlatforms: ['android', 'web'],
        failedPlatforms: ['ios'],
        status: 'partial',
      };
      
      const recommendations = reporter.generateRecommendations(errors, buildSummary);
      
      expect(recommendations.some(r => r.includes('ios'))).toBe(true);
    });
    
    it('should recommend reviewing warnings', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'WARNING',
          message: 'Warning',
          severity: 'warning',
          category: 'build',
        }),
      ];
      
      const recommendations = reporter.generateRecommendations(errors);
      
      expect(recommendations.some(r => r.includes('warning'))).toBe(true);
    });
    
    it('should recommend verbose mode for critical errors', () => {
      const reporter = new ErrorReporter();
      const errors = [
        createBuildError({
          code: 'CRITICAL_ERROR',
          message: 'Critical error',
          severity: 'error',
          category: 'build',
        }),
      ];
      
      const recommendations = reporter.generateRecommendations(errors);
      
      expect(recommendations.some(r => r.includes('verbose'))).toBe(true);
    });
  });
  
  describe('output formats', () => {
    const testError = createBuildError({
      code: 'TEST_ERROR',
      message: 'Test error',
      severity: 'error',
      category: 'build',
      platform: 'ios',
      suggestions: ['Fix this'],
    });
    
    it('should format report as text', () => {
      const reporter = new ErrorReporter({ format: 'text' });
      const report = reporter.generateReport([testError]);
      
      expect(report.formattedReport).toContain('BUILD ERROR REPORT');
      expect(report.formattedReport).toContain('SUMMARY');
      expect(report.formattedReport).toContain('CRITICAL ERRORS');
      expect(report.formattedReport).toContain('RECOMMENDATIONS');
      expect(report.formattedReport).toContain('STATISTICS');
    });
    
    it('should format report as markdown', () => {
      const reporter = new ErrorReporter({ format: 'markdown' });
      const report = reporter.generateReport([testError]);
      
      expect(report.formattedReport).toContain('# Build Error Report');
      expect(report.formattedReport).toContain('## Summary');
      expect(report.formattedReport).toContain('## Critical Errors');
      expect(report.formattedReport).toContain('## Recommendations');
      expect(report.formattedReport).toContain('## Statistics');
    });
    
    it('should format report as JSON', () => {
      const reporter = new ErrorReporter({ format: 'json' });
      const report = reporter.generateReport([testError]);
      
      const parsed = JSON.parse(report.formattedReport);
      
      expect(parsed.totalErrors).toBe(1);
      expect(parsed.errorsBySeverity.error).toBe(1);
      expect(parsed.criticalErrors).toHaveLength(1);
      expect(parsed.criticalErrors[0].code).toBe('TEST_ERROR');
    });
  });
  
  describe('report options', () => {
    it('should limit detailed errors based on maxDetailedErrors', () => {
      const reporter = new ErrorReporter({ maxDetailedErrors: 2 });
      const errors = [
        createBuildError({
          code: 'ERROR_1',
          message: 'Error 1',
          severity: 'error',
          category: 'build',
        }),
        createBuildError({
          code: 'ERROR_2',
          message: 'Error 2',
          severity: 'error',
          category: 'build',
        }),
        createBuildError({
          code: 'ERROR_3',
          message: 'Error 3',
          severity: 'error',
          category: 'build',
        }),
      ];
      
      const report = reporter.generateReport(errors);
      
      expect(report.formattedReport).toContain('ERROR_1');
      expect(report.formattedReport).toContain('ERROR_2');
      expect(report.formattedReport).toContain('and 1 more critical error');
    });
    
    it('should exclude recommendations when disabled', () => {
      const reporter = new ErrorReporter({ includeRecommendations: false });
      const errors = [
        createBuildError({
          code: 'ERROR_1',
          message: 'Error 1',
          severity: 'error',
          category: 'build',
        }),
      ];
      
      const report = reporter.generateReport(errors);
      
      expect(report.formattedReport).not.toContain('RECOMMENDATIONS');
    });
  });
});
