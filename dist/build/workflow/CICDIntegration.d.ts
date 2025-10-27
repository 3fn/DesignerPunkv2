/**
 * CI/CD Integration Support
 *
 * Provides CI/CD-friendly configuration, machine-readable reports,
 * and proper exit codes for automated build systems.
 */
import { BuildResult } from '../types/BuildResult';
import { Platform } from '../types/Platform';
/**
 * CI/CD configuration options
 */
export interface CICDConfig {
    /** Enable CI/CD mode (affects output format and behavior) */
    enabled: boolean;
    /** Output format for reports */
    reportFormat: 'json' | 'junit' | 'github-actions' | 'gitlab-ci';
    /** Path to write machine-readable reports */
    reportPath?: string;
    /** Fail fast - stop on first platform failure */
    failFast: boolean;
    /** Verbose output for debugging */
    verbose: boolean;
    /** Quiet mode - minimal output */
    quiet: boolean;
    /** Environment variables to include in reports */
    environmentVariables?: string[];
}
/**
 * Machine-readable build report
 */
export interface CICDBuildReport {
    /** Report format version */
    version: string;
    /** Build timestamp */
    timestamp: string;
    /** Overall build status */
    status: 'success' | 'failure' | 'partial';
    /** Total build duration in milliseconds */
    duration: number;
    /** Platform-specific results */
    platforms: CICDPlatformResult[];
    /** Summary statistics */
    summary: {
        total: number;
        successful: number;
        failed: number;
        skipped: number;
    };
    /** Environment information */
    environment?: Record<string, string>;
    /** Error details if build failed */
    errors?: CICDError[];
}
/**
 * Platform-specific CI/CD result
 */
export interface CICDPlatformResult {
    /** Platform name */
    platform: Platform;
    /** Platform build status */
    status: 'success' | 'failure' | 'skipped';
    /** Build duration in milliseconds */
    duration: number;
    /** Output package path */
    packagePath?: string;
    /** Warnings generated */
    warnings: string[];
    /** Errors encountered */
    errors: CICDError[];
}
/**
 * CI/CD error information
 */
export interface CICDError {
    /** Error code */
    code: string;
    /** Error message */
    message: string;
    /** Platform where error occurred */
    platform?: Platform;
    /** File path related to error */
    file?: string;
    /** Line number if applicable */
    line?: number;
    /** Error severity */
    severity: 'error' | 'warning' | 'info';
}
/**
 * CI/CD exit codes
 */
export declare enum CICDExitCode {
    /** All builds succeeded */
    SUCCESS = 0,
    /** One or more builds failed */
    BUILD_FAILURE = 1,
    /** Configuration error */
    CONFIG_ERROR = 2,
    /** Validation error */
    VALIDATION_ERROR = 3,
    /** Token integration error */
    TOKEN_ERROR = 4,
    /** Platform-specific error */
    PLATFORM_ERROR = 5,
    /** Unknown error */
    UNKNOWN_ERROR = 99
}
/**
 * CI/CD Integration Manager
 */
export declare class CICDIntegration {
    private config;
    private startTime;
    constructor(config: CICDConfig);
    /**
     * Start build tracking
     */
    startBuild(): void;
    /**
     * Complete build and generate report
     */
    completeBuild(results: BuildResult[]): CICDBuildReport;
    /**
     * Generate machine-readable report
     */
    generateReport(report: CICDBuildReport): string;
    /**
     * Get appropriate exit code for build results
     */
    getExitCode(report: CICDBuildReport): CICDExitCode;
    /**
     * Log platform build start
     */
    logPlatformStart(platform: Platform): void;
    /**
     * Log platform build completion
     */
    logPlatformComplete(platform: Platform, success: boolean, duration: number): void;
    /**
     * Log error in CI/CD format
     */
    logError(error: CICDError): void;
    /**
     * Log warning in CI/CD format
     */
    logWarning(message: string): void;
    /**
     * Log info message
     */
    private logInfo;
    /**
     * Generate JSON report
     */
    private generateJSONReport;
    /**
     * Generate JUnit XML report
     */
    private generateJUnitReport;
    /**
     * Generate GitHub Actions report
     */
    private generateGitHubActionsReport;
    /**
     * Generate GitLab CI report
     */
    private generateGitLabCIReport;
    /**
     * Get environment information
     */
    private getEnvironmentInfo;
}
/**
 * Create default CI/CD configuration
 */
export declare function createDefaultCICDConfig(): CICDConfig;
/**
 * Detect CI/CD environment and create appropriate configuration
 */
export declare function detectCICDEnvironment(): CICDConfig;
//# sourceMappingURL=CICDIntegration.d.ts.map