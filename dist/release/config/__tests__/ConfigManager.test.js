"use strict";
/**
 * Configuration Manager Tests
 *
 * Tests for the release configuration system
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
describe('ConfigManager', () => {
    let configManager;
    let originalEnv;
    beforeEach(() => {
        configManager = index_1.ConfigManager.getInstance();
        configManager.clearCache();
        // Store original environment
        originalEnv = process.env;
        // Set required environment variables for testing
        process.env = {
            ...originalEnv,
            GITHUB_TOKEN: 'test-github-token',
            NPM_TOKEN: 'test-npm-token'
        };
    });
    afterEach(() => {
        // Restore original environment
        process.env = originalEnv;
    });
    describe('Default Configuration', () => {
        it('should have valid default configuration', () => {
            const validation = (0, index_1.validateConfig)(index_1.DEFAULT_RELEASE_CONFIG);
            expect(validation.valid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });
        it('should include all required configuration sections', () => {
            expect(index_1.DEFAULT_RELEASE_CONFIG.detection).toBeDefined();
            expect(index_1.DEFAULT_RELEASE_CONFIG.versioning).toBeDefined();
            expect(index_1.DEFAULT_RELEASE_CONFIG.publishing).toBeDefined();
            expect(index_1.DEFAULT_RELEASE_CONFIG.validation).toBeDefined();
        });
        it('should have reasonable default values', () => {
            const config = index_1.DEFAULT_RELEASE_CONFIG;
            // Detection defaults
            expect(config.detection.specCompletionTrigger).toBe(true);
            expect(config.detection.taskCompletionTrigger).toBe(true);
            expect(config.detection.confidenceThreshold).toBe(0.8);
            expect(config.detection.breakingChangeKeywords).toContain('breaking change');
            // Versioning defaults
            expect(config.versioning.preReleaseStrategy).toBe('beta');
            expect(config.versioning.packageCoordination.corePackageSync).toBe(true);
            expect(config.versioning.packageCoordination.componentIndependence).toBe(true);
            // Publishing defaults
            expect(config.publishing.github.owner).toBe('3fn');
            expect(config.publishing.github.repository).toBe('DesignerPunkv2');
            expect(config.publishing.npm.access).toBe('public');
            // Validation defaults
            expect(config.validation.releaseReadiness).toBe(true);
            expect(config.validation.versionBumpValidation).toBe(true);
        });
    });
    describe('Configuration Loading', () => {
        it('should load configuration successfully', async () => {
            const result = await configManager.loadConfig();
            expect(result.config).toBeDefined();
            expect(result.validation).toBeDefined();
            expect(result.sources).toBeDefined();
            expect(result.sources.length).toBeGreaterThan(0);
        });
        it('should include default configuration source', async () => {
            const result = await configManager.loadConfig();
            const defaultSource = result.sources.find(s => s.type === 'default');
            expect(defaultSource).toBeDefined();
            expect(defaultSource?.loaded).toBe(true);
        });
        it('should cache configuration after loading', async () => {
            const config1 = await configManager.getConfig();
            const config2 = await configManager.getConfig();
            expect(config1).toBe(config2); // Should be the same object reference
        });
        it('should clear cache when requested', async () => {
            await configManager.getConfig();
            configManager.clearCache();
            // This should trigger a new load
            const config = await configManager.getConfig();
            expect(config).toBeDefined();
        });
    });
    describe('Configuration Validation', () => {
        it('should validate valid configuration', () => {
            const validation = (0, index_1.validateConfig)(index_1.DEFAULT_RELEASE_CONFIG);
            expect(validation.valid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });
        it('should detect missing required properties', () => {
            const invalidConfig = {
                detection: index_1.DEFAULT_RELEASE_CONFIG.detection,
                // Missing versioning, publishing, validation
            };
            const validation = (0, index_1.validateConfig)(invalidConfig);
            expect(validation.valid).toBe(false);
            expect(validation.errors.length).toBeGreaterThan(0);
            expect(validation.errors.some(e => e.path === 'versioning')).toBe(true);
        });
        it('should validate confidence threshold range', () => {
            const invalidConfig = {
                ...index_1.DEFAULT_RELEASE_CONFIG,
                detection: {
                    ...index_1.DEFAULT_RELEASE_CONFIG.detection,
                    confidenceThreshold: 1.5 // Invalid: > 1
                }
            };
            const validation = (0, index_1.validateConfig)(invalidConfig);
            expect(validation.valid).toBe(false);
            expect(validation.errors.some(e => e.path.includes('confidenceThreshold'))).toBe(true);
        });
        it('should validate pre-release strategy values', () => {
            const invalidConfig = {
                ...index_1.DEFAULT_RELEASE_CONFIG,
                versioning: {
                    ...index_1.DEFAULT_RELEASE_CONFIG.versioning,
                    preReleaseStrategy: 'invalid'
                }
            };
            const validation = (0, index_1.validateConfig)(invalidConfig);
            expect(validation.valid).toBe(false);
            expect(validation.errors.some(e => e.path.includes('preReleaseStrategy'))).toBe(true);
        });
    });
    describe('Configuration Summary', () => {
        it('should generate configuration summary', () => {
            const summary = configManager.getConfigSummary(index_1.DEFAULT_RELEASE_CONFIG);
            expect(summary).toBeDefined();
            expect(typeof summary).toBe('string');
            const parsed = JSON.parse(summary);
            expect(parsed.detection).toBeDefined();
            expect(parsed.versioning).toBeDefined();
            expect(parsed.publishing).toBeDefined();
            expect(parsed.validation).toBeDefined();
        });
        it('should include key configuration values in summary', () => {
            const summary = configManager.getConfigSummary(index_1.DEFAULT_RELEASE_CONFIG);
            const parsed = JSON.parse(summary);
            expect(parsed.detection.confidenceThreshold).toBe(0.8);
            expect(parsed.versioning.preReleaseStrategy).toBe('beta');
            expect(parsed.publishing.github.owner).toBe('3fn');
            expect(parsed.validation.releaseReadiness).toBe(true);
        });
    });
    describe('Configuration Validation Report', () => {
        it('should generate detailed validation report', () => {
            const report = configManager.validateConfiguration(index_1.DEFAULT_RELEASE_CONFIG);
            expect(report.valid).toBe(true);
            expect(report.errors).toBeDefined();
            expect(report.warnings).toBeDefined();
            expect(report.summary).toBeDefined();
        });
        it('should include errors in validation report for invalid config', () => {
            const invalidConfig = {
                ...index_1.DEFAULT_RELEASE_CONFIG,
                detection: {
                    ...index_1.DEFAULT_RELEASE_CONFIG.detection,
                    confidenceThreshold: -1 // Invalid
                }
            };
            const report = configManager.validateConfiguration(invalidConfig);
            expect(report.valid).toBe(false);
            expect(report.errors.length).toBeGreaterThan(0);
            expect(report.errors.some(e => e.includes('confidenceThreshold'))).toBe(true);
        });
    });
});
//# sourceMappingURL=ConfigManager.test.js.map