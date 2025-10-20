/**
 * Analysis Configuration Manager
 * 
 * Handles loading, merging, and validation of release analysis configuration
 * Adapted from release management system for CLI-driven workflow
 */

import * as fs from 'fs';
import * as path from 'path';
import { AnalysisConfig, DEFAULT_ANALYSIS_CONFIG } from './AnalysisConfig';
import { validateAnalysisConfig, AnalysisConfigValidationResult, ConfigValidationError, ConfigValidationWarning } from './AnalysisConfigSchema';

export interface AnalysisConfigLoadResult {
  config: AnalysisConfig;
  validation: AnalysisConfigValidationResult;
  sources: ConfigSource[];
}

export interface ConfigSource {
  path: string;
  type: 'default' | 'user' | 'environment';
  loaded: boolean;
  error?: string;
}

export class AnalysisConfigManager {
  private static instance: AnalysisConfigManager;
  private cachedConfig: AnalysisConfig | null = null;
  private configPaths: string[] = [
    '.kiro/analysis-config.json',
    'analysis-config.json',
    '.analysis-config.json'
  ];

  private constructor() { }

  public static getInstance(): AnalysisConfigManager {
    if (!AnalysisConfigManager.instance) {
      AnalysisConfigManager.instance = new AnalysisConfigManager();
    }
    return AnalysisConfigManager.instance;
  }

  /**
   * Load and merge configuration from all sources
   */
  public async loadConfig(workspaceRoot?: string): Promise<AnalysisConfigLoadResult> {
    const sources: ConfigSource[] = [];
    let mergedConfig = this.deepClone(DEFAULT_ANALYSIS_CONFIG);

    // Add default config source
    sources.push({
      path: 'built-in',
      type: 'default',
      loaded: true
    });

    // Try to load user configuration files
    const userConfig = await this.loadUserConfig(workspaceRoot);
    if (userConfig.config) {
      mergedConfig = this.mergeConfigs(mergedConfig, userConfig.config);
      sources.push({
        path: userConfig.source || 'unknown',
        type: 'user',
        loaded: true
      });
    } else if (userConfig.error) {
      sources.push({
        path: userConfig.source || 'unknown',
        type: 'user',
        loaded: false,
        error: userConfig.error
      });
    }

    // Apply environment variable overrides
    const envConfig = this.loadEnvironmentOverrides();
    if (envConfig) {
      mergedConfig = this.mergeConfigs(mergedConfig, envConfig);
      sources.push({
        path: 'environment variables',
        type: 'environment',
        loaded: true
      });
    }

    // Validate the merged configuration
    const validation = validateAnalysisConfig(mergedConfig);

    // Cache the configuration if valid
    if (validation.valid) {
      this.cachedConfig = mergedConfig;
    }

    return {
      config: mergedConfig,
      validation,
      sources
    };
  }

  /**
   * Get cached configuration or load if not cached
   */
  public async getConfig(workspaceRoot?: string): Promise<AnalysisConfig> {
    if (this.cachedConfig) {
      return this.cachedConfig;
    }

    const result = await this.loadConfig(workspaceRoot);
    if (!result.validation.valid) {
      throw new Error(`Configuration validation failed: ${result.validation.errors.map((e: ConfigValidationError) => e.message).join(', ')}`);
    }

    return result.config;
  }

  /**
   * Clear cached configuration (force reload on next access)
   */
  public clearCache(): void {
    this.cachedConfig = null;
  }

  /**
   * Save configuration to file
   */
  public async saveConfig(config: AnalysisConfig, filePath?: string): Promise<void> {
    const targetPath = filePath || path.join(process.cwd(), '.kiro/analysis-config.json');

    // Validate configuration before saving
    const validation = validateAnalysisConfig(config);
    if (!validation.valid) {
      throw new Error(`Cannot save invalid configuration: ${validation.errors.map((e: ConfigValidationError) => e.message).join(', ')}`);
    }

    // Ensure directory exists
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write configuration file
    const configJson = JSON.stringify(config, null, 2);
    fs.writeFileSync(targetPath, configJson, 'utf8');

    // Clear cache to force reload
    this.clearCache();
  }

  /**
   * Load user configuration from file
   */
  private async loadUserConfig(workspaceRoot?: string): Promise<{ config?: Partial<AnalysisConfig>; source?: string; error?: string }> {
    const root = workspaceRoot || process.cwd();

    for (const configPath of this.configPaths) {
      const fullPath = path.join(root, configPath);

      try {
        if (fs.existsSync(fullPath)) {
          const configContent = fs.readFileSync(fullPath, 'utf8');
          const config = JSON.parse(configContent);
          return { config, source: fullPath };
        }
      } catch (error) {
        return {
          source: fullPath,
          error: error instanceof Error ? error.message : 'Unknown error loading configuration'
        };
      }
    }

    return {}; // No user config found
  }

  /**
   * Load configuration overrides from environment variables
   */
  private loadEnvironmentOverrides(): Partial<AnalysisConfig> | null {
    const overrides: any = {};
    let hasOverrides = false;

    // Git configuration overrides
    if (process.env.ANALYSIS_DEFAULT_BRANCH) {
      this.setNestedProperty(overrides, 'git.defaultBranch', process.env.ANALYSIS_DEFAULT_BRANCH);
      hasOverrides = true;
    }
    if (process.env.ANALYSIS_RELEASE_TAG_PATTERN) {
      this.setNestedProperty(overrides, 'git.releaseTagPattern', process.env.ANALYSIS_RELEASE_TAG_PATTERN);
      hasOverrides = true;
    }
    if (process.env.ANALYSIS_MAX_COMMITS) {
      const maxCommits = parseInt(process.env.ANALYSIS_MAX_COMMITS, 10);
      if (!isNaN(maxCommits)) {
        this.setNestedProperty(overrides, 'git.maxCommits', maxCommits);
        hasOverrides = true;
      }
    }

    // Extraction configuration overrides
    if (process.env.ANALYSIS_MINIMUM_CONFIDENCE) {
      const confidence = parseFloat(process.env.ANALYSIS_MINIMUM_CONFIDENCE);
      if (!isNaN(confidence)) {
        this.setNestedProperty(overrides, 'extraction.confidenceThresholds.minimumConfidence', confidence);
        hasOverrides = true;
      }
    }

    // Reporting configuration overrides
    if (process.env.ANALYSIS_DEFAULT_FORMAT) {
      const format = process.env.ANALYSIS_DEFAULT_FORMAT;
      if (['summary', 'detailed', 'json'].includes(format)) {
        this.setNestedProperty(overrides, 'reporting.defaultFormat', format);
        hasOverrides = true;
      }
    }
    if (process.env.ANALYSIS_OUTPUT_DIRECTORY) {
      this.setNestedProperty(overrides, 'reporting.outputFiles.outputDirectory', process.env.ANALYSIS_OUTPUT_DIRECTORY);
      hasOverrides = true;
    }

    // Versioning configuration overrides
    if (process.env.ANALYSIS_DEFAULT_BUMP_TYPE) {
      const bumpType = process.env.ANALYSIS_DEFAULT_BUMP_TYPE;
      if (['major', 'minor', 'patch'].includes(bumpType)) {
        this.setNestedProperty(overrides, 'versioning.versionBumpRules.defaultBumpType', bumpType);
        hasOverrides = true;
      }
    }
    if (process.env.ANALYSIS_PRERELEASE_IDENTIFIER) {
      this.setNestedProperty(overrides, 'versioning.preRelease.identifier', process.env.ANALYSIS_PRERELEASE_IDENTIFIER);
      hasOverrides = true;
    }

    return hasOverrides ? overrides : null;
  }

  /**
   * Deep merge two configuration objects
   */
  private mergeConfigs(base: AnalysisConfig, override: Partial<AnalysisConfig>): AnalysisConfig {
    return this.deepMerge(base, override) as AnalysisConfig;
  }

  /**
   * Deep merge utility function
   */
  private deepMerge(target: any, source: any): any {
    const result = this.deepClone(target);

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (this.isObject(source[key]) && this.isObject(result[key])) {
          result[key] = this.deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  }

  /**
   * Deep clone utility function
   */
  private deepClone(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepClone(item));
    }

    const cloned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }

    return cloned;
  }

  /**
   * Check if value is an object
   */
  private isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  /**
   * Set nested property using dot notation
   */
  private setNestedProperty(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || !this.isObject(current[key])) {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  }

  /**
   * Get configuration summary for debugging
   */
  public getConfigSummary(config: AnalysisConfig): string {
    const summary = {
      extraction: {
        completionPatterns: config.extraction.completionPatterns.length,
        breakingChangeKeywords: config.extraction.breakingChangeKeywords.length,
        featureKeywords: config.extraction.featureKeywords.length,
        minimumConfidence: config.extraction.confidenceThresholds.minimumConfidence
      },
      versioning: {
        semanticVersioning: config.versioning.semanticVersioning,
        preReleaseHandling: config.versioning.preReleaseHandling,
        defaultBumpType: config.versioning.versionBumpRules.defaultBumpType
      },
      reporting: {
        defaultFormat: config.reporting.defaultFormat,
        includeConfidence: config.reporting.includeConfidence,
        saveResults: config.reporting.outputFiles.saveResults
      },
      git: {
        defaultBranch: config.git.defaultBranch,
        completionPaths: config.git.completionPaths.length,
        maxCommits: config.git.maxCommits
      }
    };

    return JSON.stringify(summary, null, 2);
  }

  /**
   * Validate configuration and return detailed report
   */
  public validateConfiguration(config: AnalysisConfig): {
    valid: boolean;
    errors: string[];
    warnings: string[];
    summary: string;
  } {
    const validation = validateAnalysisConfig(config);

    return {
      valid: validation.valid,
      errors: validation.errors.map((e: ConfigValidationError) => `${e.path}: ${e.message}`),
      warnings: validation.warnings.map((w: ConfigValidationWarning) => `${w.path}: ${w.message}${w.suggestion ? ` (${w.suggestion})` : ''}`),
      summary: this.getConfigSummary(config)
    };
  }

  /**
   * Create a minimal configuration file for first-time setup
   */
  public async createDefaultConfigFile(workspaceRoot?: string): Promise<string> {
    const root = workspaceRoot || process.cwd();
    const configPath = path.join(root, '.kiro/analysis-config.json');

    // Create a minimal configuration with common overrides
    const minimalConfig: Partial<AnalysisConfig> = {
      extraction: {
        ...DEFAULT_ANALYSIS_CONFIG.extraction,
        confidenceThresholds: {
          minimumConfidence: 0.7,
          uncertaintyThreshold: 0.8,
          reviewThreshold: 0.75,
          deduplicationThreshold: 0.8,
          semanticSimilarityThreshold: 0.7
        }
      },
      versioning: {
        ...DEFAULT_ANALYSIS_CONFIG.versioning,
        versionBumpRules: {
          ...DEFAULT_ANALYSIS_CONFIG.versioning.versionBumpRules,
          defaultBumpType: 'patch',
          requireMajorConfirmation: true
        }
      },
      reporting: {
        ...DEFAULT_ANALYSIS_CONFIG.reporting,
        defaultFormat: 'summary',
        includeConfidence: true,
        outputFiles: {
          ...DEFAULT_ANALYSIS_CONFIG.reporting.outputFiles,
          saveResults: true,
          outputDirectory: './.kiro/release-analysis'
        }
      }
    };

    await this.saveConfig(this.mergeConfigs(DEFAULT_ANALYSIS_CONFIG, minimalConfig), configPath);
    return configPath;
  }
}