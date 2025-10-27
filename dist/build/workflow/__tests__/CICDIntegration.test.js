"use strict";
/**
 * Tests for CI/CD Integration
 */
Object.defineProperty(exports, "__esModule", { value: true });
const CICDIntegration_1 = require("../CICDIntegration");
// Helper to create a valid BuildError
function createBuildError(code, message) {
    return {
        code,
        message,
        severity: 'error',
        category: 'build',
        context: {},
        suggestions: [],
        documentation: [],
    };
}
describe('CICDIntegration', () => {
    let config;
    let integration;
    beforeEach(() => {
        config = {
            enabled: true,
            reportFormat: 'json',
            failFast: false,
            verbose: false,
            quiet: true, // Quiet for tests
        };
        integration = new CICDIntegration_1.CICDIntegration(config);
    });
    describe('Build Tracking', () => {
        it('should track build start and completion', () => {
            integration.startBuild();
            const results = [
                {
                    platform: 'ios',
                    success: true,
                    packagePath: '/output/ios',
                    duration: 1000,
                    warnings: [],
                    errors: [],
                },
            ];
            const report = integration.completeBuild(results);
            expect(report.status).toBe('success');
            expect(report.summary.successful).toBe(1);
            expect(report.summary.failed).toBe(0);
        });
        it('should calculate total build duration', () => {
            integration.startBuild();
            // Simulate some time passing
            const results = [
                {
                    platform: 'ios',
                    success: true,
                    packagePath: '/output/ios',
                    duration: 500,
                    warnings: [],
                    errors: [],
                },
            ];
            const report = integration.completeBuild(results);
            expect(report.duration).toBeGreaterThanOrEqual(0);
        });
    });
    describe('Build Reports', () => {
        it('should generate report for successful builds', () => {
            integration.startBuild();
            const results = [
                {
                    platform: 'ios',
                    success: true,
                    packagePath: '/output/ios',
                    duration: 1000,
                    warnings: [],
                    errors: [],
                },
                {
                    platform: 'android',
                    success: true,
                    packagePath: '/output/android',
                    duration: 1200,
                    warnings: [],
                    errors: [],
                },
            ];
            const report = integration.completeBuild(results);
            expect(report.status).toBe('success');
            expect(report.platforms).toHaveLength(2);
            expect(report.summary.successful).toBe(2);
            expect(report.summary.failed).toBe(0);
        });
        it('should generate report for failed builds', () => {
            integration.startBuild();
            const results = [
                {
                    platform: 'ios',
                    success: false,
                    packagePath: '',
                    duration: 500,
                    warnings: [],
                    errors: [
                        createBuildError('BUILD_001', 'Compilation failed'),
                    ],
                },
            ];
            const report = integration.completeBuild(results);
            expect(report.status).toBe('failure');
            expect(report.summary.successful).toBe(0);
            expect(report.summary.failed).toBe(1);
            expect(report.errors).toHaveLength(1);
        });
        it('should generate report for partial success', () => {
            integration.startBuild();
            const results = [
                {
                    platform: 'ios',
                    success: true,
                    packagePath: '/output/ios',
                    duration: 1000,
                    warnings: [],
                    errors: [],
                },
                {
                    platform: 'android',
                    success: false,
                    packagePath: '',
                    duration: 500,
                    warnings: [],
                    errors: [
                        createBuildError('BUILD_002', 'Gradle build failed'),
                    ],
                },
            ];
            const report = integration.completeBuild(results);
            expect(report.status).toBe('partial');
            expect(report.summary.successful).toBe(1);
            expect(report.summary.failed).toBe(1);
        });
        it('should include warnings in report', () => {
            integration.startBuild();
            const results = [
                {
                    platform: 'web',
                    success: true,
                    packagePath: '/output/web',
                    duration: 800,
                    warnings: ['Deprecated API usage', 'Missing type annotation'],
                    errors: [],
                },
            ];
            const report = integration.completeBuild(results);
            expect(report.platforms[0].warnings).toHaveLength(2);
        });
    });
    describe('Report Formats', () => {
        it('should generate JSON report', () => {
            const report = {
                version: '1.0.0',
                timestamp: '2025-01-10T00:00:00.000Z',
                status: 'success',
                duration: 2000,
                platforms: [
                    {
                        platform: 'ios',
                        status: 'success',
                        duration: 1000,
                        packagePath: '/output/ios',
                        warnings: [],
                        errors: [],
                    },
                ],
                summary: {
                    total: 1,
                    successful: 1,
                    failed: 0,
                    skipped: 0,
                },
            };
            const jsonReport = integration.generateReport(report);
            const parsed = JSON.parse(jsonReport);
            expect(parsed.status).toBe('success');
            expect(parsed.platforms).toHaveLength(1);
        });
        it('should generate JUnit XML report', () => {
            const junitConfig = {
                ...config,
                reportFormat: 'junit',
            };
            const junitIntegration = new CICDIntegration_1.CICDIntegration(junitConfig);
            const report = {
                version: '1.0.0',
                timestamp: '2025-01-10T00:00:00.000Z',
                status: 'success',
                duration: 2000,
                platforms: [
                    {
                        platform: 'ios',
                        status: 'success',
                        duration: 1000,
                        packagePath: '/output/ios',
                        warnings: [],
                        errors: [],
                    },
                ],
                summary: {
                    total: 1,
                    successful: 1,
                    failed: 0,
                    skipped: 0,
                },
            };
            const xmlReport = junitIntegration.generateReport(report);
            expect(xmlReport).toContain('<?xml version="1.0"');
            expect(xmlReport).toContain('<testsuites');
            expect(xmlReport).toContain('<testsuite name="ios"');
        });
        it('should generate GitHub Actions report', () => {
            const ghConfig = {
                ...config,
                reportFormat: 'github-actions',
            };
            const ghIntegration = new CICDIntegration_1.CICDIntegration(ghConfig);
            const report = {
                version: '1.0.0',
                timestamp: '2025-01-10T00:00:00.000Z',
                status: 'success',
                duration: 2000,
                platforms: [
                    {
                        platform: 'ios',
                        status: 'success',
                        duration: 1000,
                        packagePath: '/output/ios',
                        warnings: [],
                        errors: [],
                    },
                ],
                summary: {
                    total: 1,
                    successful: 1,
                    failed: 0,
                    skipped: 0,
                },
            };
            const ghReport = ghIntegration.generateReport(report);
            expect(ghReport).toContain('::group::');
            expect(ghReport).toContain('Build Summary');
            expect(ghReport).toContain('::endgroup::');
        });
        it('should generate GitLab CI report', () => {
            const glConfig = {
                ...config,
                reportFormat: 'gitlab-ci',
            };
            const glIntegration = new CICDIntegration_1.CICDIntegration(glConfig);
            const report = {
                version: '1.0.0',
                timestamp: '2025-01-10T00:00:00.000Z',
                status: 'success',
                duration: 2000,
                platforms: [
                    {
                        platform: 'ios',
                        status: 'success',
                        duration: 1000,
                        packagePath: '/output/ios',
                        warnings: [],
                        errors: [],
                    },
                ],
                summary: {
                    total: 1,
                    successful: 1,
                    failed: 0,
                    skipped: 0,
                },
            };
            const glReport = glIntegration.generateReport(report);
            expect(glReport).toContain('Build Status:');
            expect(glReport).toContain('Platform: ios');
        });
    });
    describe('Exit Codes', () => {
        it('should return SUCCESS for successful builds', () => {
            const report = {
                version: '1.0.0',
                timestamp: '2025-01-10T00:00:00.000Z',
                status: 'success',
                duration: 2000,
                platforms: [],
                summary: {
                    total: 1,
                    successful: 1,
                    failed: 0,
                    skipped: 0,
                },
            };
            const exitCode = integration.getExitCode(report);
            expect(exitCode).toBe(CICDIntegration_1.CICDExitCode.SUCCESS);
        });
        it('should return CONFIG_ERROR for configuration errors', () => {
            const report = {
                version: '1.0.0',
                timestamp: '2025-01-10T00:00:00.000Z',
                status: 'failure',
                duration: 100,
                platforms: [],
                summary: {
                    total: 0,
                    successful: 0,
                    failed: 1,
                    skipped: 0,
                },
                errors: [
                    {
                        code: 'CONFIG_001',
                        message: 'Invalid configuration',
                        severity: 'error',
                    },
                ],
            };
            const exitCode = integration.getExitCode(report);
            expect(exitCode).toBe(CICDIntegration_1.CICDExitCode.CONFIG_ERROR);
        });
        it('should return VALIDATION_ERROR for validation errors', () => {
            const report = {
                version: '1.0.0',
                timestamp: '2025-01-10T00:00:00.000Z',
                status: 'failure',
                duration: 100,
                platforms: [],
                summary: {
                    total: 0,
                    successful: 0,
                    failed: 1,
                    skipped: 0,
                },
                errors: [
                    {
                        code: 'VALIDATION_001',
                        message: 'Interface validation failed',
                        severity: 'error',
                    },
                ],
            };
            const exitCode = integration.getExitCode(report);
            expect(exitCode).toBe(CICDIntegration_1.CICDExitCode.VALIDATION_ERROR);
        });
        it('should return TOKEN_ERROR for token errors', () => {
            const report = {
                version: '1.0.0',
                timestamp: '2025-01-10T00:00:00.000Z',
                status: 'failure',
                duration: 100,
                platforms: [],
                summary: {
                    total: 0,
                    successful: 0,
                    failed: 1,
                    skipped: 0,
                },
                errors: [
                    {
                        code: 'TOKEN_001',
                        message: 'Token not found',
                        severity: 'error',
                    },
                ],
            };
            const exitCode = integration.getExitCode(report);
            expect(exitCode).toBe(CICDIntegration_1.CICDExitCode.TOKEN_ERROR);
        });
        it('should return PLATFORM_ERROR for platform errors', () => {
            const report = {
                version: '1.0.0',
                timestamp: '2025-01-10T00:00:00.000Z',
                status: 'failure',
                duration: 100,
                platforms: [],
                summary: {
                    total: 0,
                    successful: 0,
                    failed: 1,
                    skipped: 0,
                },
                errors: [
                    {
                        code: 'PLATFORM_001',
                        message: 'Platform build failed',
                        severity: 'error',
                    },
                ],
            };
            const exitCode = integration.getExitCode(report);
            expect(exitCode).toBe(CICDIntegration_1.CICDExitCode.PLATFORM_ERROR);
        });
        it('should return BUILD_FAILURE for generic failures', () => {
            const report = {
                version: '1.0.0',
                timestamp: '2025-01-10T00:00:00.000Z',
                status: 'failure',
                duration: 100,
                platforms: [],
                summary: {
                    total: 0,
                    successful: 0,
                    failed: 1,
                    skipped: 0,
                },
                errors: [
                    {
                        code: 'UNKNOWN',
                        message: 'Build failed',
                        severity: 'error',
                    },
                ],
            };
            const exitCode = integration.getExitCode(report);
            expect(exitCode).toBe(CICDIntegration_1.CICDExitCode.BUILD_FAILURE);
        });
    });
    describe('Environment Detection', () => {
        const originalEnv = process.env;
        beforeEach(() => {
            process.env = { ...originalEnv };
        });
        afterEach(() => {
            process.env = originalEnv;
        });
        it('should detect GitHub Actions environment', () => {
            process.env.GITHUB_ACTIONS = 'true';
            process.env.GITHUB_WORKFLOW = 'CI';
            const config = (0, CICDIntegration_1.detectCICDEnvironment)();
            expect(config.enabled).toBe(true);
            expect(config.reportFormat).toBe('github-actions');
            expect(config.environmentVariables).toContain('GITHUB_WORKFLOW');
        });
        it('should detect GitLab CI environment', () => {
            process.env.GITLAB_CI = 'true';
            process.env.CI_PIPELINE_ID = '123';
            const config = (0, CICDIntegration_1.detectCICDEnvironment)();
            expect(config.enabled).toBe(true);
            expect(config.reportFormat).toBe('gitlab-ci');
            expect(config.environmentVariables).toContain('CI_PIPELINE_ID');
        });
        it('should detect generic CI environment', () => {
            process.env.CI = 'true';
            const config = (0, CICDIntegration_1.detectCICDEnvironment)();
            expect(config.enabled).toBe(true);
            expect(config.reportFormat).toBe('json');
        });
        it('should return default config for local development', () => {
            delete process.env.CI;
            delete process.env.GITHUB_ACTIONS;
            delete process.env.GITLAB_CI;
            const config = (0, CICDIntegration_1.detectCICDEnvironment)();
            expect(config.enabled).toBe(false);
        });
    });
    describe('Default Configuration', () => {
        it('should create default CI/CD configuration', () => {
            const config = (0, CICDIntegration_1.createDefaultCICDConfig)();
            expect(config.enabled).toBe(false);
            expect(config.reportFormat).toBe('json');
            expect(config.failFast).toBe(false);
            expect(config.verbose).toBe(false);
            expect(config.quiet).toBe(false);
        });
    });
    describe('Platform Logging', () => {
        it('should log platform start', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            const verboseConfig = {
                ...config,
                verbose: true,
                quiet: false,
            };
            const verboseIntegration = new CICDIntegration_1.CICDIntegration(verboseConfig);
            verboseIntegration.logPlatformStart('ios');
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Building ios'));
            consoleSpy.mockRestore();
        });
        it('should log platform completion', () => {
            const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
            const verboseConfig = {
                ...config,
                verbose: true,
                quiet: false,
            };
            const verboseIntegration = new CICDIntegration_1.CICDIntegration(verboseConfig);
            verboseIntegration.logPlatformComplete('ios', true, 1000);
            expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('ios completed'));
            consoleSpy.mockRestore();
        });
    });
});
//# sourceMappingURL=CICDIntegration.test.js.map