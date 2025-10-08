/**
 * Error Handler Integration Tests
 * 
 * Tests for ErrorHandler integration with ErrorReporter
 */

import { ErrorHandler } from '../ErrorHandler';
import { createBuildError } from '../BuildError';
import { BuildResultSummary } from '../ErrorReporter';

describe('ErrorHandler - ErrorReporter Integration', () => {
  describe('generateReport', () => {
    it('should generate report from logged errors', () => {
      const handler = new ErrorHandler();
      
      // Log some errors
      handler.handleError(createBuildError({
        code: 'ERROR_1',
        message: 'Error 1',
        severity: 'error',
        category: 'build',
      }));
      
      handler.handleError(createBuildError({
        code: 'WARNING_1',
        message: 'Warning 1',
        severity: 'warning',
        category: 'build',
      }));
      
      const report = handler.generateReport();
      
      expect(report.totalErrors).toBe(2);
      expect(report.errorsBySeverity.error).toBe(1);
      expect(report.errorsBySeverity.warning).toBe(1);
      expect(report.formattedReport).toContain('BUILD ERROR REPORT');
    });
    
    it('should include build summary in report', () => {
      const handler = new ErrorHandler();
      
      handler.handleError(createBuildError({
        code: 'BUILD_ERROR',
        message: 'Build failed',
        severity: 'error',
        category: 'build',
        platform: 'ios',
      }));
      
      const buildSummary: BuildResultSummary = {
        totalPlatforms: 3,
        successfulPlatforms: ['android', 'web'],
        failedPlatforms: ['ios'],
        duration: 5000,
        status: 'partial',
      };
      
      const report = handler.generateReport(buildSummary);
      
      expect(report.summary).toContain('PARTIAL');
      expect(report.summary).toContain('2/3');
      expect(report.formattedReport).toContain('Failed Platforms: ios');
    });
    
    it('should generate empty report when no errors', () => {
      const handler = new ErrorHandler();
      const report = handler.generateReport();
      
      expect(report.totalErrors).toBe(0);
      expect(report.criticalErrors).toHaveLength(0);
    });
  });
  
  describe('generateErrorSummary', () => {
    it('should generate summary from logged errors', () => {
      const handler = new ErrorHandler();
      
      handler.handleError(createBuildError({
        code: 'ERROR_1',
        message: 'Error 1',
        severity: 'error',
        category: 'build',
      }));
      
      handler.handleError(createBuildError({
        code: 'WARNING_1',
        message: 'Warning 1',
        severity: 'warning',
        category: 'build',
      }));
      
      const summary = handler.generateErrorSummary();
      
      expect(summary).toContain('1 error');
      expect(summary).toContain('1 warning');
    });
    
    it('should generate success summary when no errors', () => {
      const handler = new ErrorHandler();
      const summary = handler.generateErrorSummary();
      
      expect(summary).toContain('successfully');
      expect(summary).toContain('no errors');
    });
  });
  
  describe('setReporterOptions', () => {
    it('should update reporter options', () => {
      const handler = new ErrorHandler();
      
      handler.handleError(createBuildError({
        code: 'ERROR_1',
        message: 'Error 1',
        severity: 'error',
        category: 'build',
      }));
      
      // Set JSON format
      handler.setReporterOptions({ format: 'json' });
      const report = handler.generateReport();
      
      // Should be valid JSON
      expect(() => JSON.parse(report.formattedReport)).not.toThrow();
      
      const parsed = JSON.parse(report.formattedReport);
      expect(parsed.totalErrors).toBe(1);
    });
    
    it('should support markdown format', () => {
      const handler = new ErrorHandler();
      
      handler.handleError(createBuildError({
        code: 'ERROR_1',
        message: 'Error 1',
        severity: 'error',
        category: 'build',
      }));
      
      handler.setReporterOptions({ format: 'markdown' });
      const report = handler.generateReport();
      
      expect(report.formattedReport).toContain('# Build Error Report');
      expect(report.formattedReport).toContain('## Summary');
    });
  });
  
  describe('verbose mode integration', () => {
    it('should include stack traces in verbose mode', () => {
      const handler = new ErrorHandler({ verbose: true });
      
      const originalError = new Error('Original error');
      handler.handleError(createBuildError({
        code: 'ERROR_1',
        message: 'Error 1',
        severity: 'error',
        category: 'build',
        originalError,
      }));
      
      const report = handler.generateReport();
      
      expect(report.formattedReport).toContain('Stack Trace:');
    });
    
    it('should exclude stack traces in non-verbose mode', () => {
      const handler = new ErrorHandler({ verbose: false });
      
      const originalError = new Error('Original error');
      handler.handleError(createBuildError({
        code: 'ERROR_1',
        message: 'Error 1',
        severity: 'error',
        category: 'build',
        originalError,
      }));
      
      const report = handler.generateReport();
      
      expect(report.formattedReport).not.toContain('Stack Trace:');
    });
  });
  
  describe('error categorization and reporting', () => {
    it('should report errors by category', () => {
      const handler = new ErrorHandler();
      
      handler.handleError(createBuildError({
        code: 'CONFIG_ERROR',
        message: 'Config error',
        severity: 'error',
        category: 'config',
      }));
      
      handler.handleError(createBuildError({
        code: 'TOKEN_ERROR',
        message: 'Token error',
        severity: 'error',
        category: 'token',
      }));
      
      const report = handler.generateReport();
      
      expect(report.errorsByCategory.config).toBe(1);
      expect(report.errorsByCategory.token).toBe(1);
      expect(report.formattedReport).toContain('Config: 1');
      expect(report.formattedReport).toContain('Token: 1');
    });
    
    it('should report errors by platform', () => {
      const handler = new ErrorHandler();
      
      handler.handleError(createBuildError({
        code: 'IOS_ERROR',
        message: 'iOS error',
        severity: 'error',
        category: 'build',
        platform: 'ios',
      }));
      
      handler.handleError(createBuildError({
        code: 'ANDROID_ERROR',
        message: 'Android error',
        severity: 'error',
        category: 'build',
        platform: 'android',
      }));
      
      const report = handler.generateReport();
      
      expect(report.errorsByPlatform.ios).toBe(1);
      expect(report.errorsByPlatform.android).toBe(1);
      expect(report.formattedReport).toContain('iOS: 1');
      expect(report.formattedReport).toContain('Android: 1');
    });
  });
  
  describe('recommendations integration', () => {
    it('should include recommendations for config errors', () => {
      const handler = new ErrorHandler();
      
      handler.handleError(createBuildError({
        code: 'CONFIG_ERROR',
        message: 'Invalid configuration',
        severity: 'error',
        category: 'config',
      }));
      
      const report = handler.generateReport();
      
      expect(report.recommendations.some(r => r.includes('configuration'))).toBe(true);
    });
    
    it('should include recommendations for token errors', () => {
      const handler = new ErrorHandler();
      
      handler.handleError(createBuildError({
        code: 'TOKEN_ERROR',
        message: 'Token not found',
        severity: 'error',
        category: 'token',
      }));
      
      const report = handler.generateReport();
      
      expect(report.recommendations.some(r => r.includes('token'))).toBe(true);
    });
    
    it('should include recommendations for platform failures', () => {
      const handler = new ErrorHandler();
      
      handler.handleError(createBuildError({
        code: 'BUILD_ERROR',
        message: 'Build failed',
        severity: 'error',
        category: 'build',
        platform: 'ios',
      }));
      
      const buildSummary: BuildResultSummary = {
        totalPlatforms: 3,
        successfulPlatforms: ['android', 'web'],
        failedPlatforms: ['ios'],
        status: 'partial',
      };
      
      const report = handler.generateReport(buildSummary);
      
      expect(report.recommendations.some(r => r.includes('ios'))).toBe(true);
    });
  });
});
