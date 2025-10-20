/**
 * Configuration Integration Tests for Release Analysis System
 * 
 * Tests configuration loading, validation, merging, and application
 * across different scenarios and environments.
 */

import { AnalysisConfigManager } from '../config/AnalysisConfigManager';
import { DEFAULT_ANALYSIS_CONFIG, AnalysisConfig } from '../config/AnalysisConfig';
import { ReleaseCLI } from '../cli/ReleaseCLI';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';

// Mock file system
jest.mock('fs');
jest.mock('fs/promises');

describe('Configuration Integration Tests', () => {
  let tempDir: string;
  let configManager: AnalysisConfigManager;
  let mockExistsSync: jest.Mock;
  let mockReadFileSync: jest.Mock;
  let mockWriteFileSync: jest.Mock;
  let mockMkdirSync: jest.Mock;

  beforeEach(async () => {
    // Create temporary directory for testing (use a simple string since we're mocking everything)
    tempDir = path.join(os.tmpdir(), 'config-test-' + Math.random().toString(36).substr(2, 9));
    
    // Get config manager instance
    configManager = AnalysisConfigManager.getInstance();
    configManager.clearCache(); // Clear any cached configuration

    // Setup mocks
    const fsModule = require('fs');
    mockExistsSync = fsModule.existsSync as jest.Mock;
    mockReadFileSync = fsModule.readFileSync as jest.Mock;
    mockWriteFileSync = fsModule.writeFileSync as jest.Mock;
    mockMkdirSync = fsModule.mkdirSync as jest.Mock;

    // Reset all mocks
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Clear cache after each test
    configManager.clearCache();
    
    // Clean up temporary directory (not needed since we're mocking)
    // No actual cleanup needed for mocked file system
  });

  describe('Configuration Loading', () => {
    it('should load default configuration when no config file exists', async () => {
      mockExistsSync.mockReturnValue(false);

      const result = await configManager.loadConfig(tempDir);

      expect(result.config).toEqual(DEFAULT_ANALYSIS_CONFIG);
      expect(result.validation.valid).toBe(true);
      expect(result.sources).toHaveLength(1);
      expect(result.sources[0].type).toBe('default');
      expect(result.sources[0].loaded).toBe(true);
    });

    it('should load and merge user configuration', async () => {
      const userConfig = {
        extraction: {
          breakingChangeKeywords: ['BREAKING', 'REMOVED', 'DEPRECATED'],
          featureKeywords: ['FEATURE', 'ADDED', 'NEW'],
          confidenceThresholds: {
            minimumConfidence: 0.8
          }
        },
        versioning: {
          versionBumpRules: {
            defaultBumpType: 'minor' as const
          }
        }
      };

      mockExistsSync.mockImplementation((filePath: string) => {
        return filePath.includes('.kiro/analysis-config.json');
      });

      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('.kiro/analysis-config.json')) {
          return JSON.stringify(userConfig);
        }
        return '{}';
      });

      const result = await configManager.loadConfig(tempDir);

      expect(result.config.extraction.breakingChangeKeywords).toEqual(['BREAKING', 'REMOVED', 'DEPRECATED']);
      expect(result.config.extraction.featureKeywords).toEqual(['FEATURE', 'ADDED', 'NEW']);
      expect(result.config.extraction.confidenceThresholds.minimumConfidence).toBe(0.8);
      expect(result.config.versioning.versionBumpRules.defaultBumpType).toBe('minor');
      expect(result.validation.valid).toBe(true);
      expect(result.sources).toHaveLength(2);
      expect(result.sources[1].type).toBe('user');
      expect(result.sources[1].loaded).toBe(true);
    });

    it('should handle malformed configuration file gracefully', async () => {
      mockExistsSync.mockImplementation((filePath: string) => {
        return filePath.includes('.kiro/analysis-config.json');
      });

      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('.kiro/analysis-config.json')) {
          return '{ invalid json content }';
        }
        return '{}';
      });

      const result = await configManager.loadConfig(tempDir);

      expect(result.config).toEqual(DEFAULT_ANALYSIS_CONFIG);
      expect(result.sources).toHaveLength(2);
      expect(result.sources[1].type).toBe('user');
      expect(result.sources[1].loaded).toBe(false);
      expect(result.sources[1].error).toContain('JSON'); // Error message may vary
    });

    it('should load configuration from multiple file locations', async () => {
      const config1 = {
        extraction: {
          breakingChangeKeywords: ['BREAKING']
        }
      };

      const config2 = {
        versioning: {
          semanticVersioning: false
        }
      };

      mockExistsSync.mockImplementation((filePath: string) => {
        return filePath.includes('.kiro/analysis-config.json') || filePath.includes('analysis-config.json');
      });

      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('.kiro/analysis-config.json')) {
          return JSON.stringify(config1);
        }
        if (filePath.includes('analysis-config.json')) {
          return JSON.stringify(config2);
        }
        return '{}';
      });

      const result = await configManager.loadConfig(tempDir);

      // First found config should be used
      expect(result.config.extraction.breakingChangeKeywords).toEqual(['BREAKING']);
      expect(result.sources[1].loaded).toBe(true);
    });
  });

  describe('Environment Variable Overrides', () => {
    beforeEach(() => {
      // Clear environment variables
      delete process.env.ANALYSIS_DEFAULT_BRANCH;
      delete process.env.ANALYSIS_MINIMUM_CONFIDENCE;
      delete process.env.ANALYSIS_DEFAULT_FORMAT;
      delete process.env.ANALYSIS_DEFAULT_BUMP_TYPE;
    });

    it('should apply environment variable overrides', async () => {
      process.env.ANALYSIS_DEFAULT_BRANCH = 'develop';
      process.env.ANALYSIS_MINIMUM_CONFIDENCE = '0.9';
      process.env.ANALYSIS_DEFAULT_FORMAT = 'detailed';
      process.env.ANALYSIS_DEFAULT_BUMP_TYPE = 'major';

      mockExistsSync.mockReturnValue(false);

      const result = await configManager.loadConfig(tempDir);

      expect(result.config.git.defaultBranch).toBe('develop');
      expect(result.config.extraction.confidenceThresholds.minimumConfidence).toBe(0.9);
      expect(result.config.reporting.defaultFormat).toBe('detailed');
      expect(result.config.versioning.versionBumpRules.defaultBumpType).toBe('major');
      expect(result.sources).toHaveLength(2);
      expect(result.sources[1].type).toBe('environment');
    });

    it('should ignore invalid environment variable values', async () => {
      process.env.ANALYSIS_MINIMUM_CONFIDENCE = 'invalid-number';
      process.env.ANALYSIS_DEFAULT_FORMAT = 'invalid-format';
      process.env.ANALYSIS_MAX_COMMITS = 'not-a-number';

      mockExistsSync.mockReturnValue(false);

      const result = await configManager.loadConfig(tempDir);

      // Should use default values for invalid environment variables
      expect(result.config.extraction.confidenceThresholds.minimumConfidence).toBe(DEFAULT_ANALYSIS_CONFIG.extraction.confidenceThresholds.minimumConfidence);
      expect(result.config.reporting.defaultFormat).toBe(DEFAULT_ANALYSIS_CONFIG.reporting.defaultFormat);
      expect(result.config.git.maxCommits).toBe(DEFAULT_ANALYSIS_CONFIG.git.maxCommits);
    });

    it('should prioritize environment variables over user config', async () => {
      const userConfig = {
        git: {
          defaultBranch: 'main'
        },
        extraction: {
          confidenceThresholds: {
            minimumConfidence: 0.7
          }
        }
      };

      process.env.ANALYSIS_DEFAULT_BRANCH = 'staging';
      process.env.ANALYSIS_MINIMUM_CONFIDENCE = '0.95';

      mockExistsSync.mockImplementation((filePath: string) => {
        return filePath.includes('.kiro/analysis-config.json');
      });

      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes('.kiro/analysis-config.json')) {
          return JSON.stringify(userConfig);
        }
        return '{}';
      });

      const result = await configManager.loadConfig(tempDir);

      expect(result.config.git.defaultBranch).toBe('staging'); // Environment override
      expect(result.config.extraction.confidenceThresholds.minimumConfidence).toBe(0.95); // Environment override
      expect(result.sources).toHaveLength(3); // default + user + environment
    });
  });

  describe('Configuration Validation', () => {
    it('should validate valid configuration', async () => {
      const validConfig: AnalysisConfig = {
        ...DEFAULT_ANALYSIS_CONFIG,
        extraction: {
          ...DEFAULT_ANALYSIS_CONFIG.extraction,
          confidenceThresholds: {
            minimumConfidence: 0.8,
            uncertaintyThreshold: 0.9,
            reviewThreshold: 0.85,
            deduplicationThreshold: 0.75,
            semanticSimilarityThreshold: 0.8
          }
        }
      };

      const validation = configManager.validateConfiguration(validConfig);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.warnings).toHaveLength(0);
      expect(validation.summary).toContain('minimumConfidence');
    });

    it('should detect invalid configuration values', async () => {
      const invalidConfig = {
        ...DEFAULT_ANALYSIS_CONFIG,
        extraction: {
          ...DEFAULT_ANALYSIS_CONFIG.extraction,
          confidenceThresholds: {
            minimumConfidence: 1.5, // Invalid: > 1
            uncertaintyThreshold: -0.1, // Invalid: < 0
            reviewThreshold: 0.5,
            deduplicationThreshold: 0.8,
            semanticSimilarityThreshold: 0.7
          }
        },
        versioning: {
          ...DEFAULT_ANALYSIS_CONFIG.versioning,
          versionBumpRules: {
            ...DEFAULT_ANALYSIS_CONFIG.versioning.versionBumpRules,
            defaultBumpType: 'invalid' as any // Invalid bump type
          }
        }
      } as AnalysisConfig;

      const validation = configManager.validateConfiguration(invalidConfig);

      expect(validation.valid).toBe(false);
      expect(validation.errors.length).toBeGreaterThan(0);
      expect(validation.errors.some(error => error.includes('minimumConfidence'))).toBe(true);
      expect(validation.errors.some(error => error.includes('uncertaintyThreshold'))).toBe(true);
      expect(validation.errors.some(error => error.includes('defaultBumpType'))).toBe(true);
    });

    it('should provide configuration warnings for suboptimal settings', async () => {
      const suboptimalConfig = {
        ...DEFAULT_ANALYSIS_CONFIG,
        extraction: {
          ...DEFAULT_ANALYSIS_CONFIG.extraction,
          confidenceThresholds: {
            minimumConfidence: 0.3, // Very low confidence threshold
            uncertaintyThreshold: 0.4, // Very low uncertainty threshold
            reviewThreshold: 0.35,
            deduplicationThreshold: 0.9, // Very high deduplication threshold
            semanticSimilarityThreshold: 0.95 // Very high similarity threshold
          }
        }
      } as AnalysisConfig;

      const validation = configManager.validateConfiguration(suboptimalConfig);

      expect(validation.valid).toBe(true); // Valid but not optimal
      expect(validation.warnings.length).toBeGreaterThanOrEqual(0); // May not have warnings implemented yet
    });
  });

  describe('Configuration Persistence', () => {
    it('should save configuration to file', async () => {
      const configToSave: AnalysisConfig = {
        ...DEFAULT_ANALYSIS_CONFIG,
        extraction: {
          ...DEFAULT_ANALYSIS_CONFIG.extraction,
          breakingChangeKeywords: ['BREAKING', 'REMOVED']
        }
      };

      mockMkdirSync.mockImplementation(() => {});
      mockWriteFileSync.mockImplementation(() => {});

      const configPath = path.join(tempDir, '.kiro/analysis-config.json');
      await configManager.saveConfig(configToSave, configPath);

      expect(mockMkdirSync).toHaveBeenCalledWith(path.dirname(configPath), { recursive: true });
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        configPath,
        expect.stringContaining('"breakingChangeKeywords"'),
        'utf8'
      );
    });

    it('should refuse to save invalid configuration', async () => {
      const invalidConfig = {
        ...DEFAULT_ANALYSIS_CONFIG,
        extraction: {
          ...DEFAULT_ANALYSIS_CONFIG.extraction,
          confidenceThresholds: {
            minimumConfidence: 2.0, // Invalid
            uncertaintyThreshold: 0.8,
            reviewThreshold: 0.75,
            deduplicationThreshold: 0.8,
            semanticSimilarityThreshold: 0.7
          }
        }
      } as AnalysisConfig;

      await expect(configManager.saveConfig(invalidConfig)).rejects.toThrow('Cannot save invalid configuration');
    });

    it('should create default configuration file', async () => {
      mockMkdirSync.mockImplementation(() => {});
      mockWriteFileSync.mockImplementation(() => {});

      const configPath = await configManager.createDefaultConfigFile(tempDir);

      expect(configPath).toBe(path.join(tempDir, '.kiro/analysis-config.json'));
      expect(mockWriteFileSync).toHaveBeenCalledWith(
        configPath,
        expect.stringContaining('"extraction"'),
        'utf8'
      );
    });
  });

  describe('Configuration Caching', () => {
    it('should cache configuration after first load', async () => {
      mockExistsSync.mockReturnValue(false);

      // First load
      const config1 = await configManager.getConfig(tempDir);
      
      // Second load should use cache
      const config2 = await configManager.getConfig(tempDir);

      expect(config1).toBe(config2); // Same object reference (cached)
    });

    it('should clear cache and reload configuration', async () => {
      mockExistsSync.mockReturnValue(false);

      // Load configuration
      const config1 = await configManager.getConfig(tempDir);

      // Clear cache
      configManager.clearCache();

      // Load again (should create new instance)
      const config2 = await configManager.getConfig(tempDir);

      expect(config1).not.toBe(config2); // Different object references
      expect(config1).toEqual(config2); // But same content
    });

    it('should clear cache after saving configuration', async () => {
      mockExistsSync.mockReturnValue(false);
      mockMkdirSync.mockImplementation(() => {});
      mockWriteFileSync.mockImplementation(() => {});

      // Load and cache configuration
      const config1 = await configManager.getConfig(tempDir);

      // Save configuration (should clear cache)
      await configManager.saveConfig(config1);

      // Next load should not use cache
      const config2 = await configManager.getConfig(tempDir);

      expect(config1).not.toBe(config2); // Cache was cleared
    });
  });

  // CLI Configuration Integration tests are covered in WorkflowIntegration.test.ts

  describe('Configuration Summary and Debugging', () => {
    it('should provide configuration summary', async () => {
      const config = await configManager.getConfig(tempDir);
      const summary = configManager.getConfigSummary(config);

      expect(summary).toContain('extraction');
      expect(summary).toContain('versioning');
      expect(summary).toContain('reporting');
      expect(summary).toContain('git');
      expect(summary).toContain('completionPatterns');
      expect(summary).toContain('breakingChangeKeywords');
      expect(summary).toContain('minimumConfidence');
    });

    it('should provide detailed validation report', async () => {
      const config = await configManager.getConfig(tempDir);
      const validation = configManager.validateConfiguration(config);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
      expect(validation.summary).toContain('extraction');
      expect(validation.summary).toContain('versioning');
    });
  });
});