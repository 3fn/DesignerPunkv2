"use strict";
/**
 * Error Reporter
 *
 * Generates comprehensive error reports for build failures.
 * Provides detailed error context, stack traces, recovery recommendations,
 * and build result summaries.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorReporter = void 0;
const ErrorDocumentation_1 = require("./ErrorDocumentation");
/**
 * Error Reporter class
 *
 * Generates comprehensive error reports with detailed context,
 * stack traces, recovery recommendations, and build summaries.
 */
class ErrorReporter {
    constructor(options = {}) {
        this.options = {
            includeStackTraces: options.includeStackTraces ?? true,
            includeContext: options.includeContext ?? true,
            includeRecommendations: options.includeRecommendations ?? true,
            maxDetailedErrors: options.maxDetailedErrors ?? 10,
            format: options.format ?? 'text',
        };
    }
    /**
     * Generate comprehensive error report
     */
    generateReport(errors, buildSummary) {
        const timestamp = new Date();
        // Calculate error statistics
        const errorsBySeverity = this.countBySeverity(errors);
        const errorsByCategory = this.countByCategory(errors);
        const errorsByPlatform = this.countByPlatform(errors);
        // Identify critical errors
        const criticalErrors = errors.filter(e => e.severity === 'error');
        // Generate summary
        const summary = this.generateSummary(errors, buildSummary);
        // Generate recommendations
        const recommendations = this.generateRecommendations(errors, buildSummary);
        // Format the report
        const formattedReport = this.formatReport({
            timestamp,
            totalErrors: errors.length,
            errorsBySeverity,
            errorsByCategory,
            errorsByPlatform,
            errors,
            summary,
            recommendations,
            criticalErrors,
            formattedReport: '', // Will be set below
        });
        return {
            timestamp,
            totalErrors: errors.length,
            errorsBySeverity,
            errorsByCategory,
            errorsByPlatform,
            errors,
            summary,
            recommendations,
            criticalErrors,
            formattedReport,
        };
    }
    /**
     * Generate error summary for build results
     */
    generateErrorSummary(errors) {
        if (errors.length === 0) {
            return 'Build completed successfully with no errors.';
        }
        const errorCount = errors.filter(e => e.severity === 'error').length;
        const warningCount = errors.filter(e => e.severity === 'warning').length;
        const infoCount = errors.filter(e => e.severity === 'info').length;
        const parts = [];
        if (errorCount > 0) {
            parts.push(`${errorCount} error${errorCount !== 1 ? 's' : ''}`);
        }
        if (warningCount > 0) {
            parts.push(`${warningCount} warning${warningCount !== 1 ? 's' : ''}`);
        }
        if (infoCount > 0) {
            parts.push(`${infoCount} info message${infoCount !== 1 ? 's' : ''}`);
        }
        return `Build completed with ${parts.join(', ')}.`;
    }
    /**
     * Generate detailed error context
     */
    generateErrorContext(error) {
        const lines = [];
        lines.push(`Error Code: ${error.code}`);
        lines.push(`Message: ${error.message}`);
        lines.push(`Severity: ${error.severity}`);
        lines.push(`Category: ${error.category}`);
        if (error.platform) {
            lines.push(`Platform: ${error.platform}`);
        }
        if (error.component) {
            lines.push(`Component: ${error.component}`);
        }
        lines.push(`Timestamp: ${error.timestamp.toISOString()}`);
        // Add context details if enabled
        if (this.options.includeContext && Object.keys(error.context).length > 0) {
            lines.push('\nContext:');
            for (const [key, value] of Object.entries(error.context)) {
                lines.push(`  ${key}: ${JSON.stringify(value, null, 2)}`);
            }
        }
        // Add stack trace if available and enabled
        if (this.options.includeStackTraces && error.originalError?.stack) {
            lines.push('\nStack Trace:');
            lines.push(error.originalError.stack);
        }
        // Add suggestions
        if (error.suggestions.length > 0) {
            lines.push('\nSuggestions:');
            error.suggestions.forEach(suggestion => {
                lines.push(`  • ${suggestion}`);
            });
        }
        // Add documentation links
        if (error.documentation.length > 0) {
            lines.push('\nDocumentation:');
            error.documentation.forEach(doc => {
                lines.push(`  • ${doc}`);
            });
        }
        return lines.join('\n');
    }
    /**
     * Generate recovery recommendations based on errors
     */
    generateRecommendations(errors, buildSummary) {
        const recommendations = [];
        // No errors - no recommendations needed
        if (errors.length === 0) {
            return recommendations;
        }
        // Critical errors require immediate attention
        const criticalErrors = errors.filter(e => e.severity === 'error');
        if (criticalErrors.length > 0) {
            recommendations.push(`Address ${criticalErrors.length} critical error${criticalErrors.length !== 1 ? 's' : ''} before proceeding`);
        }
        // Configuration errors
        const configErrors = errors.filter(e => e.category === 'config');
        if (configErrors.length > 0) {
            recommendations.push('Review build configuration and fix configuration errors', 'Consult build configuration documentation for valid options');
        }
        // Token errors
        const tokenErrors = errors.filter(e => e.category === 'token');
        if (tokenErrors.length > 0) {
            recommendations.push('Verify token references exist in F1 token system', 'Check token selection priority (semantic → primitive → component)');
        }
        // Interface errors
        const interfaceErrors = errors.filter(e => e.category === 'interface');
        if (interfaceErrors.length > 0) {
            recommendations.push('Ensure component interfaces match across all platforms', 'Review interface validation errors for specific mismatches');
        }
        // Platform-specific errors
        const platformErrors = errors.filter(e => e.platform !== undefined);
        if (platformErrors.length > 0 && buildSummary) {
            const failedPlatforms = [...new Set(platformErrors.map(e => e.platform))];
            recommendations.push(`Review platform-specific errors for: ${failedPlatforms.join(', ')}`, 'Consider using --skip-platform flag to continue with other platforms');
        }
        // Warnings
        const warnings = errors.filter(e => e.severity === 'warning');
        if (warnings.length > 0) {
            recommendations.push(`Review ${warnings.length} warning${warnings.length !== 1 ? 's' : ''} to improve build quality`);
        }
        // General recommendations
        if (criticalErrors.length > 0) {
            recommendations.push('Run build with --verbose flag for detailed error information', 'Check build logs for additional context');
        }
        return recommendations;
    }
    // Private methods
    countBySeverity(errors) {
        return {
            error: errors.filter(e => e.severity === 'error').length,
            warning: errors.filter(e => e.severity === 'warning').length,
            info: errors.filter(e => e.severity === 'info').length,
        };
    }
    countByCategory(errors) {
        return {
            config: errors.filter(e => e.category === 'config').length,
            build: errors.filter(e => e.category === 'build').length,
            token: errors.filter(e => e.category === 'token').length,
            interface: errors.filter(e => e.category === 'interface').length,
        };
    }
    countByPlatform(errors) {
        return {
            ios: errors.filter(e => e.platform === 'ios').length,
            android: errors.filter(e => e.platform === 'android').length,
            web: errors.filter(e => e.platform === 'web').length,
        };
    }
    generateSummary(errors, buildSummary) {
        const lines = [];
        // Build status
        if (buildSummary) {
            lines.push(`Build Status: ${buildSummary.status.toUpperCase()}`);
            lines.push(`Platforms: ${buildSummary.successfulPlatforms.length}/${buildSummary.totalPlatforms} successful`);
            if (buildSummary.duration) {
                lines.push(`Duration: ${(buildSummary.duration / 1000).toFixed(2)}s`);
            }
            if (buildSummary.failedPlatforms.length > 0) {
                lines.push(`Failed Platforms: ${buildSummary.failedPlatforms.join(', ')}`);
            }
            lines.push('');
        }
        // Error summary
        const errorCount = errors.filter(e => e.severity === 'error').length;
        const warningCount = errors.filter(e => e.severity === 'warning').length;
        const infoCount = errors.filter(e => e.severity === 'info').length;
        lines.push(`Total Issues: ${errors.length}`);
        lines.push(`  Errors: ${errorCount}`);
        lines.push(`  Warnings: ${warningCount}`);
        lines.push(`  Info: ${infoCount}`);
        return lines.join('\n');
    }
    formatReport(report) {
        switch (this.options.format) {
            case 'json':
                return this.formatAsJson(report);
            case 'markdown':
                return this.formatAsMarkdown(report);
            case 'text':
            default:
                return this.formatAsText(report);
        }
    }
    formatAsText(report) {
        const lines = [];
        lines.push('='.repeat(80));
        lines.push('BUILD ERROR REPORT');
        lines.push('='.repeat(80));
        lines.push('');
        lines.push(`Generated: ${report.timestamp.toISOString()}`);
        lines.push('');
        // Summary
        lines.push('SUMMARY');
        lines.push('-'.repeat(80));
        lines.push(report.summary);
        lines.push('');
        // Critical errors
        if (report.criticalErrors.length > 0) {
            lines.push('CRITICAL ERRORS');
            lines.push('-'.repeat(80));
            const errorsToShow = report.criticalErrors.slice(0, this.options.maxDetailedErrors);
            errorsToShow.forEach((error, index) => {
                lines.push(`\n[${index + 1}] ${(0, ErrorDocumentation_1.formatErrorMessage)(error)}`);
                if (this.options.includeContext || this.options.includeStackTraces) {
                    lines.push('');
                    lines.push(this.generateErrorContext(error));
                }
            });
            if (report.criticalErrors.length > this.options.maxDetailedErrors) {
                lines.push('');
                lines.push(`... and ${report.criticalErrors.length - this.options.maxDetailedErrors} more critical errors`);
            }
            lines.push('');
        }
        // Recommendations
        if (this.options.includeRecommendations && report.recommendations.length > 0) {
            lines.push('RECOMMENDATIONS');
            lines.push('-'.repeat(80));
            report.recommendations.forEach(rec => {
                lines.push(`• ${rec}`);
            });
            lines.push('');
        }
        // Statistics
        lines.push('STATISTICS');
        lines.push('-'.repeat(80));
        lines.push(`By Severity:`);
        lines.push(`  Errors: ${report.errorsBySeverity.error}`);
        lines.push(`  Warnings: ${report.errorsBySeverity.warning}`);
        lines.push(`  Info: ${report.errorsBySeverity.info}`);
        lines.push('');
        lines.push(`By Category:`);
        lines.push(`  Config: ${report.errorsByCategory.config}`);
        lines.push(`  Build: ${report.errorsByCategory.build}`);
        lines.push(`  Token: ${report.errorsByCategory.token}`);
        lines.push(`  Interface: ${report.errorsByCategory.interface}`);
        lines.push('');
        lines.push(`By Platform:`);
        lines.push(`  iOS: ${report.errorsByPlatform.ios}`);
        lines.push(`  Android: ${report.errorsByPlatform.android}`);
        lines.push(`  Web: ${report.errorsByPlatform.web}`);
        lines.push('');
        lines.push('='.repeat(80));
        return lines.join('\n');
    }
    formatAsMarkdown(report) {
        const lines = [];
        lines.push('# Build Error Report');
        lines.push('');
        lines.push(`**Generated:** ${report.timestamp.toISOString()}`);
        lines.push('');
        // Summary
        lines.push('## Summary');
        lines.push('');
        lines.push('```');
        lines.push(report.summary);
        lines.push('```');
        lines.push('');
        // Critical errors
        if (report.criticalErrors.length > 0) {
            lines.push('## Critical Errors');
            lines.push('');
            const errorsToShow = report.criticalErrors.slice(0, this.options.maxDetailedErrors);
            errorsToShow.forEach((error, index) => {
                lines.push(`### ${index + 1}. ${error.code}`);
                lines.push('');
                lines.push(`**Message:** ${error.message}`);
                lines.push(`**Severity:** ${error.severity}`);
                lines.push(`**Category:** ${error.category}`);
                if (error.platform) {
                    lines.push(`**Platform:** ${error.platform}`);
                }
                if (error.suggestions.length > 0) {
                    lines.push('');
                    lines.push('**Suggestions:**');
                    error.suggestions.forEach(s => lines.push(`- ${s}`));
                }
                lines.push('');
            });
            if (report.criticalErrors.length > this.options.maxDetailedErrors) {
                lines.push(`*... and ${report.criticalErrors.length - this.options.maxDetailedErrors} more critical errors*`);
                lines.push('');
            }
        }
        // Recommendations
        if (this.options.includeRecommendations && report.recommendations.length > 0) {
            lines.push('## Recommendations');
            lines.push('');
            report.recommendations.forEach(rec => {
                lines.push(`- ${rec}`);
            });
            lines.push('');
        }
        // Statistics
        lines.push('## Statistics');
        lines.push('');
        lines.push('### By Severity');
        lines.push('');
        lines.push(`- Errors: ${report.errorsBySeverity.error}`);
        lines.push(`- Warnings: ${report.errorsBySeverity.warning}`);
        lines.push(`- Info: ${report.errorsBySeverity.info}`);
        lines.push('');
        lines.push('### By Category');
        lines.push('');
        lines.push(`- Config: ${report.errorsByCategory.config}`);
        lines.push(`- Build: ${report.errorsByCategory.build}`);
        lines.push(`- Token: ${report.errorsByCategory.token}`);
        lines.push(`- Interface: ${report.errorsByCategory.interface}`);
        lines.push('');
        lines.push('### By Platform');
        lines.push('');
        lines.push(`- iOS: ${report.errorsByPlatform.ios}`);
        lines.push(`- Android: ${report.errorsByPlatform.android}`);
        lines.push(`- Web: ${report.errorsByPlatform.web}`);
        lines.push('');
        return lines.join('\n');
    }
    formatAsJson(report) {
        return JSON.stringify({
            timestamp: report.timestamp.toISOString(),
            totalErrors: report.totalErrors,
            errorsBySeverity: report.errorsBySeverity,
            errorsByCategory: report.errorsByCategory,
            errorsByPlatform: report.errorsByPlatform,
            summary: report.summary,
            recommendations: report.recommendations,
            criticalErrors: report.criticalErrors.map(e => ({
                code: e.code,
                message: e.message,
                severity: e.severity,
                category: e.category,
                platform: e.platform,
                component: e.component,
                timestamp: e.timestamp.toISOString(),
                suggestions: e.suggestions,
                documentation: e.documentation,
            })),
        }, null, 2);
    }
}
exports.ErrorReporter = ErrorReporter;
//# sourceMappingURL=ErrorReporter.js.map