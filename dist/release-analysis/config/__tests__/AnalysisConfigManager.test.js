"use strict";
/**
 * Tests for Analysis Configuration Manager
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const AnalysisConfigManager_1 = require("../AnalysisConfigManager");
const AnalysisConfig_1 = require("../AnalysisConfig");
describe('AnalysisConfigManager', () => {
    let configManager;
    let tempDir;
    beforeEach(() => {
        configManager = AnalysisConfigManager_1.AnalysisConfigManager.getInstance();
        configManager.clearCache();
        // Create temporary directory for test configs
        tempDir = path.join(__dirname, 'temp-config-test');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
    });
    afterEach(() => {
        // Clean up temporary files
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        // Clear any environment variables
        delete process.env.ANALYSIS_DEFAULT_BRANCH;
        delete process.env.ANALYSIS_DEFAULT_FORMAT;
        delete process.env.ANALYSIS_MINIMUM_CONFIDENCE;
    });
    describe('loadConfig', () => {
        it('should load default configuration when no user config exists', async () => {
            const result = await configManager.loadConfig(tempDir);
            expect(result.config).toEqual(AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG);
            expect(result.validation.valid).toBe(true);
            expect(result.sources).toHaveLength(1);
            expect(result.sources[0].type).toBe('default');
        });
        it('should merge user configuration with defaults', async () => {
            const userConfig = {
                extraction: {
                    breakingChangeKeywords: ['custom-breaking', 'incompatible']
                },
                reporting: {
                    defaultFormat: 'json'
                }
            };
            const configPath = path.join(tempDir, '.kiro/analysis-config.json');
            fs.mkdirSync(path.dirname(configPath), { recursive: true });
            fs.writeFileSync(configPath, JSON.stringify(userConfig, null, 2));
            const result = await configManager.loadConfig(tempDir);
            expect(result.config.extraction.breakingChangeKeywords).toEqual(['custom-breaking', 'incompatible']);
            expect(result.config.reporting.defaultFormat).toBe('json');
            expect(result.config.versioning).toEqual(AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG.versioning);
            expect(result.validation.valid).toBe(true);
            expect(result.sources).toHaveLength(2);
        });
        it('should apply environment variable overrides', async () => {
            process.env.ANALYSIS_DEFAULT_BRANCH = 'develop';
            process.env.ANALYSIS_DEFAULT_FORMAT = 'detailed';
            process.env.ANALYSIS_MINIMUM_CONFIDENCE = '0.9';
            const result = await configManager.loadConfig(tempDir);
            expect(result.config.git.defaultBranch).toBe('develop');
            expect(result.config.reporting.defaultFormat).toBe('detailed');
            expect(result.config.extraction.confidenceThresholds.minimumConfidence).toBe(0.9);
            expect(result.sources).toHaveLength(2); // default + environment
        });
        it('should handle invalid user configuration gracefully', async () => {
            const invalidConfig = '{ invalid json }';
            const configPath = path.join(tempDir, '.kiro/analysis-config.json');
            fs.mkdirSync(path.dirname(configPath), { recursive: true });
            fs.writeFileSync(configPath, invalidConfig);
            const result = await configManager.loadConfig(tempDir);
            expect(result.config).toEqual(AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG);
            expect(result.sources.some(s => s.type === 'user' && !s.loaded)).toBe(true);
        });
    });
    describe('getConfig', () => {
        it('should return cached configuration on subsequent calls', async () => {
            const config1 = await configManager.getConfig(tempDir);
            const config2 = await configManager.getConfig(tempDir);
            expect(config1).toBe(config2); // Same object reference
        });
        it('should throw error for invalid configuration', async () => {
            const invalidConfig = {
                extraction: {
                    confidenceThresholds: {
                        minimumConfidence: 2.0 // Invalid: > 1
                    }
                }
            };
            const configPath = path.join(tempDir, '.kiro/analysis-config.json');
            fs.mkdirSync(path.dirname(configPath), { recursive: true });
            fs.writeFileSync(configPath, JSON.stringify(invalidConfig, null, 2));
            await expect(configManager.getConfig(tempDir)).rejects.toThrow('Configuration validation failed');
        });
    });
    describe('saveConfig', () => {
        it('should save valid configuration to file', async () => {
            const customConfig = {
                ...AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG,
                reporting: {
                    ...AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG.reporting,
                    defaultFormat: 'json'
                }
            };
            const configPath = path.join(tempDir, 'custom-config.json');
            await configManager.saveConfig(customConfig, configPath);
            expect(fs.existsSync(configPath)).toBe(true);
            const savedContent = fs.readFileSync(configPath, 'utf8');
            const savedConfig = JSON.parse(savedContent);
            expect(savedConfig.reporting.defaultFormat).toBe('json');
        });
        it('should reject invalid configuration', async () => {
            const invalidConfig = {
                ...AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG,
                extraction: {
                    ...AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG.extraction,
                    confidenceThresholds: {
                        minimumConfidence: -1 // Invalid
                    }
                }
            };
            const configPath = path.join(tempDir, 'invalid-config.json');
            await expect(configManager.saveConfig(invalidConfig, configPath)).rejects.toThrow('Cannot save invalid configuration');
        });
    });
    describe('validateConfiguration', () => {
        it('should validate correct configuration', () => {
            const result = configManager.validateConfiguration(AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.summary).toContain('extraction');
        });
        it('should detect configuration errors', () => {
            const invalidConfig = {
                ...AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG,
                versioning: {
                    ...AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG.versioning,
                    versionBumpRules: {
                        ...AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG.versioning.versionBumpRules,
                        defaultBumpType: 'invalid' // Invalid bump type
                    }
                }
            };
            const result = configManager.validateConfiguration(invalidConfig);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0]).toContain('defaultBumpType');
        });
    });
    describe('createDefaultConfigFile', () => {
        it('should create a minimal configuration file', async () => {
            const configPath = await configManager.createDefaultConfigFile(tempDir);
            expect(fs.existsSync(configPath)).toBe(true);
            expect(configPath).toContain('.kiro/analysis-config.json');
            const savedContent = fs.readFileSync(configPath, 'utf8');
            const savedConfig = JSON.parse(savedContent);
            expect(savedConfig.extraction.breakingChangeKeywords).toBeDefined();
            expect(savedConfig.versioning.semanticVersioning).toBe(true);
            expect(savedConfig.reporting.defaultFormat).toBe('summary');
        });
    });
    describe('getConfigSummary', () => {
        it('should generate configuration summary', () => {
            const summary = configManager.getConfigSummary(AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG);
            const summaryObj = JSON.parse(summary);
            expect(summaryObj.extraction.completionPatterns).toBeDefined();
            expect(summaryObj.versioning.semanticVersioning).toBe(true);
            expect(summaryObj.reporting.defaultFormat).toBe('summary');
            expect(summaryObj.git.defaultBranch).toBe('main');
        });
    });
});
//# sourceMappingURL=AnalysisConfigManager.test.js.map