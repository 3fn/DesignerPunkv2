"use strict";
/**
 * CI/CD Integration Support
 *
 * Provides CI/CD-friendly configuration, machine-readable reports,
 * and proper exit codes for automated build systems.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CICDIntegration = exports.CICDExitCode = void 0;
exports.createDefaultCICDConfig = createDefaultCICDConfig;
exports.detectCICDEnvironment = detectCICDEnvironment;
/**
 * CI/CD exit codes
 */
var CICDExitCode;
(function (CICDExitCode) {
    /** All builds succeeded */
    CICDExitCode[CICDExitCode["SUCCESS"] = 0] = "SUCCESS";
    /** One or more builds failed */
    CICDExitCode[CICDExitCode["BUILD_FAILURE"] = 1] = "BUILD_FAILURE";
    /** Configuration error */
    CICDExitCode[CICDExitCode["CONFIG_ERROR"] = 2] = "CONFIG_ERROR";
    /** Validation error */
    CICDExitCode[CICDExitCode["VALIDATION_ERROR"] = 3] = "VALIDATION_ERROR";
    /** Token integration error */
    CICDExitCode[CICDExitCode["TOKEN_ERROR"] = 4] = "TOKEN_ERROR";
    /** Platform-specific error */
    CICDExitCode[CICDExitCode["PLATFORM_ERROR"] = 5] = "PLATFORM_ERROR";
    /** Unknown error */
    CICDExitCode[CICDExitCode["UNKNOWN_ERROR"] = 99] = "UNKNOWN_ERROR";
})(CICDExitCode || (exports.CICDExitCode = CICDExitCode = {}));
/**
 * CI/CD Integration Manager
 */
class CICDIntegration {
    constructor(config) {
        this.startTime = 0;
        this.config = config;
    }
    /**
     * Start build tracking
     */
    startBuild() {
        this.startTime = Date.now();
        if (this.config.enabled && !this.config.quiet) {
            this.logInfo('Starting CI/CD build...');
        }
    }
    /**
     * Complete build and generate report
     */
    completeBuild(results) {
        const duration = Date.now() - this.startTime;
        const platformResults = results.map(result => ({
            platform: result.platform,
            status: result.success ? 'success' : 'failure',
            duration: result.duration,
            packagePath: result.packagePath,
            warnings: result.warnings,
            errors: result.errors.map(err => ({
                code: err.code || 'UNKNOWN',
                message: err.message,
                platform: result.platform,
                file: err.context?.file,
                line: err.context?.line,
                severity: err.severity,
            })),
        }));
        const successful = platformResults.filter(r => r.status === 'success').length;
        const failed = platformResults.filter(r => r.status === 'failure').length;
        const report = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            status: failed === 0 ? 'success' : (successful > 0 ? 'partial' : 'failure'),
            duration,
            platforms: platformResults,
            summary: {
                total: platformResults.length,
                successful,
                failed,
                skipped: 0,
            },
            environment: this.getEnvironmentInfo(),
            errors: platformResults.flatMap(r => r.errors),
        };
        if (this.config.enabled && !this.config.quiet) {
            this.logInfo(`Build completed in ${duration}ms`);
            this.logInfo(`Status: ${report.status}`);
            this.logInfo(`Successful: ${successful}/${platformResults.length}`);
        }
        return report;
    }
    /**
     * Generate machine-readable report
     */
    generateReport(report) {
        switch (this.config.reportFormat) {
            case 'json':
                return this.generateJSONReport(report);
            case 'junit':
                return this.generateJUnitReport(report);
            case 'github-actions':
                return this.generateGitHubActionsReport(report);
            case 'gitlab-ci':
                return this.generateGitLabCIReport(report);
            default:
                return this.generateJSONReport(report);
        }
    }
    /**
     * Get appropriate exit code for build results
     */
    getExitCode(report) {
        if (report.status === 'success') {
            return CICDExitCode.SUCCESS;
        }
        // Check for specific error types
        const hasConfigError = report.errors?.some(e => e.code.includes('CONFIG'));
        if (hasConfigError) {
            return CICDExitCode.CONFIG_ERROR;
        }
        const hasValidationError = report.errors?.some(e => e.code.includes('VALIDATION'));
        if (hasValidationError) {
            return CICDExitCode.VALIDATION_ERROR;
        }
        const hasTokenError = report.errors?.some(e => e.code.includes('TOKEN'));
        if (hasTokenError) {
            return CICDExitCode.TOKEN_ERROR;
        }
        const hasPlatformError = report.errors?.some(e => e.code.includes('PLATFORM'));
        if (hasPlatformError) {
            return CICDExitCode.PLATFORM_ERROR;
        }
        return CICDExitCode.BUILD_FAILURE;
    }
    /**
     * Log platform build start
     */
    logPlatformStart(platform) {
        if (this.config.enabled && !this.config.quiet) {
            this.logInfo(`Building ${platform}...`);
        }
    }
    /**
     * Log platform build completion
     */
    logPlatformComplete(platform, success, duration) {
        if (this.config.enabled && !this.config.quiet) {
            const status = success ? '✓' : '✗';
            this.logInfo(`${status} ${platform} completed in ${duration}ms`);
        }
    }
    /**
     * Log error in CI/CD format
     */
    logError(error) {
        if (this.config.reportFormat === 'github-actions') {
            const file = error.file ? `file=${error.file},` : '';
            const line = error.line ? `line=${error.line},` : '';
            console.error(`::error ${file}${line}title=${error.code}::${error.message}`);
        }
        else if (this.config.reportFormat === 'gitlab-ci') {
            console.error(`ERROR: [${error.code}] ${error.message}`);
        }
        else {
            console.error(`[${error.code}] ${error.message}`);
        }
    }
    /**
     * Log warning in CI/CD format
     */
    logWarning(message) {
        if (this.config.reportFormat === 'github-actions') {
            console.warn(`::warning::${message}`);
        }
        else if (this.config.reportFormat === 'gitlab-ci') {
            console.warn(`WARNING: ${message}`);
        }
        else {
            console.warn(message);
        }
    }
    /**
     * Log info message
     */
    logInfo(message) {
        if (this.config.verbose) {
            console.log(message);
        }
    }
    /**
     * Generate JSON report
     */
    generateJSONReport(report) {
        return JSON.stringify(report, null, 2);
    }
    /**
     * Generate JUnit XML report
     */
    generateJUnitReport(report) {
        const testsuites = report.platforms.map(platform => {
            const failures = platform.errors.filter(e => e.severity === 'error').length;
            const errors = platform.errors.length;
            const testcases = platform.status === 'success'
                ? `<testcase name="${platform.platform}" time="${platform.duration / 1000}" />`
                : `<testcase name="${platform.platform}" time="${platform.duration / 1000}">
            <failure message="${platform.errors[0]?.message || 'Build failed'}">${platform.errors.map(e => e.message).join('\n')}</failure>
          </testcase>`;
            return `<testsuite name="${platform.platform}" tests="1" failures="${failures}" errors="${errors}" time="${platform.duration / 1000}">
        ${testcases}
      </testsuite>`;
        }).join('\n');
        return `<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="Cross-Platform Build" tests="${report.summary.total}" failures="${report.summary.failed}" time="${report.duration / 1000}">
  ${testsuites}
</testsuites>`;
    }
    /**
     * Generate GitHub Actions report
     */
    generateGitHubActionsReport(report) {
        const lines = [];
        lines.push(`::group::Build Summary`);
        lines.push(`Status: ${report.status}`);
        lines.push(`Duration: ${report.duration}ms`);
        lines.push(`Successful: ${report.summary.successful}/${report.summary.total}`);
        lines.push(`::endgroup::`);
        report.platforms.forEach(platform => {
            lines.push(`::group::${platform.platform}`);
            lines.push(`Status: ${platform.status}`);
            lines.push(`Duration: ${platform.duration}ms`);
            if (platform.errors.length > 0) {
                platform.errors.forEach(error => {
                    const file = error.file ? `file=${error.file},` : '';
                    const line = error.line ? `line=${error.line},` : '';
                    lines.push(`::error ${file}${line}title=${error.code}::${error.message}`);
                });
            }
            if (platform.warnings.length > 0) {
                platform.warnings.forEach(warning => {
                    lines.push(`::warning::${warning}`);
                });
            }
            lines.push(`::endgroup::`);
        });
        return lines.join('\n');
    }
    /**
     * Generate GitLab CI report
     */
    generateGitLabCIReport(report) {
        const lines = [];
        lines.push(`Build Status: ${report.status.toUpperCase()}`);
        lines.push(`Duration: ${report.duration}ms`);
        lines.push(`Successful: ${report.summary.successful}/${report.summary.total}`);
        lines.push('');
        report.platforms.forEach(platform => {
            lines.push(`Platform: ${platform.platform}`);
            lines.push(`  Status: ${platform.status}`);
            lines.push(`  Duration: ${platform.duration}ms`);
            if (platform.errors.length > 0) {
                lines.push(`  Errors:`);
                platform.errors.forEach(error => {
                    lines.push(`    - [${error.code}] ${error.message}`);
                });
            }
            if (platform.warnings.length > 0) {
                lines.push(`  Warnings:`);
                platform.warnings.forEach(warning => {
                    lines.push(`    - ${warning}`);
                });
            }
            lines.push('');
        });
        return lines.join('\n');
    }
    /**
     * Get environment information
     */
    getEnvironmentInfo() {
        if (!this.config.environmentVariables || this.config.environmentVariables.length === 0) {
            return undefined;
        }
        const env = {};
        this.config.environmentVariables.forEach(varName => {
            const value = process.env[varName];
            if (value !== undefined) {
                env[varName] = value;
            }
        });
        return Object.keys(env).length > 0 ? env : undefined;
    }
}
exports.CICDIntegration = CICDIntegration;
/**
 * Create default CI/CD configuration
 */
function createDefaultCICDConfig() {
    return {
        enabled: false,
        reportFormat: 'json',
        failFast: false,
        verbose: false,
        quiet: false,
    };
}
/**
 * Detect CI/CD environment and create appropriate configuration
 */
function detectCICDEnvironment() {
    const isCI = process.env.CI === 'true' || process.env.CI === '1';
    // GitHub Actions
    if (process.env.GITHUB_ACTIONS === 'true') {
        return {
            enabled: true,
            reportFormat: 'github-actions',
            failFast: false,
            verbose: true,
            quiet: false,
            environmentVariables: ['GITHUB_WORKFLOW', 'GITHUB_RUN_ID', 'GITHUB_SHA'],
        };
    }
    // GitLab CI
    if (process.env.GITLAB_CI === 'true') {
        return {
            enabled: true,
            reportFormat: 'gitlab-ci',
            failFast: false,
            verbose: true,
            quiet: false,
            environmentVariables: ['CI_PIPELINE_ID', 'CI_COMMIT_SHA', 'CI_JOB_NAME'],
        };
    }
    // Generic CI
    if (isCI) {
        return {
            enabled: true,
            reportFormat: 'json',
            failFast: false,
            verbose: true,
            quiet: false,
        };
    }
    // Local development
    return createDefaultCICDConfig();
}
//# sourceMappingURL=CICDIntegration.js.map