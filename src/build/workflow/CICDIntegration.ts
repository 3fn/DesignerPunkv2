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
export enum CICDExitCode {
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
  UNKNOWN_ERROR = 99,
}

/**
 * CI/CD Integration Manager
 */
export class CICDIntegration {
  private config: CICDConfig;
  private startTime: number = 0;
  
  constructor(config: CICDConfig) {
    this.config = config;
  }
  
  /**
   * Start build tracking
   */
  startBuild(): void {
    this.startTime = Date.now();
    
    if (this.config.enabled && !this.config.quiet) {
      this.logInfo('Starting CI/CD build...');
    }
  }
  
  /**
   * Complete build and generate report
   */
  completeBuild(results: BuildResult[]): CICDBuildReport {
    const duration = Date.now() - this.startTime;
    
    const platformResults: CICDPlatformResult[] = results.map(result => ({
      platform: result.platform,
      status: result.success ? 'success' : 'failure',
      duration: result.duration,
      packagePath: result.packagePath,
      warnings: result.warnings,
      errors: result.errors.map(err => ({
        code: err.code || 'UNKNOWN',
        message: err.message,
        platform: result.platform,
        file: err.context?.file as string | undefined,
        line: err.context?.line as number | undefined,
        severity: err.severity,
      })),
    }));
    
    const successful = platformResults.filter(r => r.status === 'success').length;
    const failed = platformResults.filter(r => r.status === 'failure').length;
    
    const report: CICDBuildReport = {
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
  generateReport(report: CICDBuildReport): string {
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
  getExitCode(report: CICDBuildReport): CICDExitCode {
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
  logPlatformStart(platform: Platform): void {
    if (this.config.enabled && !this.config.quiet) {
      this.logInfo(`Building ${platform}...`);
    }
  }
  
  /**
   * Log platform build completion
   */
  logPlatformComplete(platform: Platform, success: boolean, duration: number): void {
    if (this.config.enabled && !this.config.quiet) {
      const status = success ? '✓' : '✗';
      this.logInfo(`${status} ${platform} completed in ${duration}ms`);
    }
  }
  
  /**
   * Log error in CI/CD format
   */
  logError(error: CICDError): void {
    if (this.config.reportFormat === 'github-actions') {
      const file = error.file ? `file=${error.file},` : '';
      const line = error.line ? `line=${error.line},` : '';
      console.error(`::error ${file}${line}title=${error.code}::${error.message}`);
    } else if (this.config.reportFormat === 'gitlab-ci') {
      console.error(`ERROR: [${error.code}] ${error.message}`);
    } else {
      console.error(`[${error.code}] ${error.message}`);
    }
  }
  
  /**
   * Log warning in CI/CD format
   */
  logWarning(message: string): void {
    if (this.config.reportFormat === 'github-actions') {
      console.warn(`::warning::${message}`);
    } else if (this.config.reportFormat === 'gitlab-ci') {
      console.warn(`WARNING: ${message}`);
    } else {
      console.warn(message);
    }
  }
  
  /**
   * Log info message
   */
  private logInfo(message: string): void {
    if (this.config.verbose) {
      console.log(message);
    }
  }
  
  /**
   * Generate JSON report
   */
  private generateJSONReport(report: CICDBuildReport): string {
    return JSON.stringify(report, null, 2);
  }
  
  /**
   * Generate JUnit XML report
   */
  private generateJUnitReport(report: CICDBuildReport): string {
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
  private generateGitHubActionsReport(report: CICDBuildReport): string {
    const lines: string[] = [];
    
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
  private generateGitLabCIReport(report: CICDBuildReport): string {
    const lines: string[] = [];
    
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
  private getEnvironmentInfo(): Record<string, string> | undefined {
    if (!this.config.environmentVariables || this.config.environmentVariables.length === 0) {
      return undefined;
    }
    
    const env: Record<string, string> = {};
    
    this.config.environmentVariables.forEach(varName => {
      const value = process.env[varName];
      if (value !== undefined) {
        env[varName] = value;
      }
    });
    
    return Object.keys(env).length > 0 ? env : undefined;
  }
}

/**
 * Create default CI/CD configuration
 */
export function createDefaultCICDConfig(): CICDConfig {
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
export function detectCICDEnvironment(): CICDConfig {
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
