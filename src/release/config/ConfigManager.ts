/**
 * Configuration Manager
 * 
 * Handles loading, validation, and merging of release management configuration.
 * Supports default configuration with user overrides and environment-specific settings.
 * 
 * Mock Strategy:
 * - jest.mock('fs'): Mock file system operations for config file reading
 * - No shared mocks: Each test creates fresh mocks
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  ReleaseConfig,
  DEFAULT_RELEASE_CONFIG,
  DetectionConfig,
  VersioningConfig,
  PublishingConfig,
  ValidationConfig
} from './ReleaseConfig';

export interface ConfigLoadOptions {
  /** Path to configuration file */
  configPath?: string;
  
  /** Environment-specific configuration */
  environment?: string;
  
  /** Merge with default configuration */
  mergeWithDefaults?: boolean;
  
  /** Validate configuration after loading */
  validate?: boolean;
  
  /** Create backup before loading */
  createBackup?: boolean;
  
  /** Automatically migrate old configuration versions */
  autoMigrate?: boolean;
}

export interface ConfigValidationResult {
  /** Whether configuration is valid */
  valid: boolean;
  
  /** Validation errors */
  errors: ConfigValidationError[];
  
  /** Validation warnings */
  warnings: ConfigValidationWarning[];
}

export interface ConfigValidationError {
  /** Error path in configuration */
  path: string;
  
  /** Error message */
  message: string;
  
  /** Expected value or format */
  expected?: string;
  
  /** Actual value */
  actual?: any;
}

export interface ConfigValidationWarning {
  /** Warning path in configuration */
  path: string;
  
  /** Warning message */
  message: string;
  
  /** Suggested value */
  suggestion?: string;
}

export interface ConfigMigrationResult {
  /** Whether migration was successful */
  success: boolean;
  
  /** Original configuration version */
  fromVersion: string;
  
  /** Target configuration version */
  toVersion: string;
  
  /** Migration steps applied */
  stepsApplied: string[];
  
  /** Migration errors */
  errors: string[];
  
  /** Backup file path */
  backupPath?: string;
}

export interface ConfigBackupResult {
  /** Whether backup was successful */
  success: boolean;
  
  /** Backup file path */
  backupPath: string;
  
  /** Backup timestamp */
  timestamp: Date;
  
  /** Error message if backup failed */
  error?: string;
}

export interface ConfigChangeNotification {
  /** Timestamp of change */
  timestamp: Date;
  
  /** Previous configuration */
  previousConfig: ReleaseConfig;
  
  /** New configuration */
  newConfig: ReleaseConfig;
  
  /** Changes detected */
  changes: ConfigChange[];
  
  /** Whether change was successful */
  success: boolean;
  
  /** Error message if change failed */
  error?: string;
}

export interface ConfigChange {
  /** Path to changed value */
  path: string;
  
  /** Previous value */
  previousValue: any;
  
  /** New value */
  newValue: any;
  
  /** Type of change */
  type: 'added' | 'modified' | 'removed';
}

export type ConfigChangeListener = (notification: ConfigChangeNotification) => void;

export interface HotReloadOptions {
  /** Enable hot reload */
  enabled?: boolean;
  
  /** Validate configuration before applying changes */
  validateBeforeApply?: boolean;
  
  /** Create backup before applying changes */
  createBackup?: boolean;
  
  /** Rollback on validation failure */
  rollbackOnFailure?: boolean;
  
  /** Notify listeners of changes */
  notifyListeners?: boolean;
}

/**
 * Configuration Manager
 * 
 * Provides centralized configuration management for the release system.
 */
export class ConfigManager {
  private config: ReleaseConfig;
  private configPath?: string;
  private static readonly CONFIG_VERSION = '1.0.0';
  private static readonly BACKUP_DIR = '.release-config-backups';
  private changeListeners: ConfigChangeListener[] = [];
  private hotReloadOptions: HotReloadOptions = {
    enabled: false,
    validateBeforeApply: true,
    createBackup: true,
    rollbackOnFailure: true,
    notifyListeners: true
  };
  private fileWatcher?: any; // fs.FSWatcher type
  
  constructor(config?: Partial<ReleaseConfig>) {
    this.config = config 
      ? this.mergeConfigs(DEFAULT_RELEASE_CONFIG, config)
      : { ...DEFAULT_RELEASE_CONFIG };
  }
  
  /**
   * Load configuration from file
   */
  async loadFromFile(options: ConfigLoadOptions = {}): Promise<ReleaseConfig> {
    const {
      configPath = '.release-config.json',
      environment,
      mergeWithDefaults = true,
      validate = true,
      createBackup = false,
      autoMigrate = true
    } = options;
    
    this.configPath = configPath;
    
    try {
      // Check if config file exists
      if (!fs.existsSync(configPath)) {
        // No config file, use defaults
        return this.config;
      }
      
      // Create backup if requested
      if (createBackup) {
        await this.createBackup(configPath);
      }
      
      // Read config file
      const configContent = fs.readFileSync(configPath, 'utf-8');
      let userConfig = JSON.parse(configContent) as any;
      
      // Check for version and migrate if needed
      if (autoMigrate && userConfig.version) {
        const migrationResult = await this.migrateConfig(userConfig, configPath);
        if (!migrationResult.success) {
          throw new Error(
            `Configuration migration failed:\n${migrationResult.errors.join('\n')}`
          );
        }
        userConfig = migrationResult.migratedConfig;
      }
      
      // Remove version field if present (not part of ReleaseConfig)
      delete userConfig.version;
      
      // Load environment-specific config if specified
      let envConfig: Partial<ReleaseConfig> | undefined;
      if (environment) {
        const envConfigPath = configPath.replace('.json', `.${environment}.json`);
        if (fs.existsSync(envConfigPath)) {
          const envContent = fs.readFileSync(envConfigPath, 'utf-8');
          envConfig = JSON.parse(envContent) as Partial<ReleaseConfig>;
        }
      }
      
      // Merge configurations
      let finalConfig: ReleaseConfig;
      if (mergeWithDefaults) {
        finalConfig = this.mergeConfigs(
          DEFAULT_RELEASE_CONFIG,
          userConfig,
          envConfig
        );
      } else {
        finalConfig = envConfig 
          ? this.mergeConfigs(userConfig as ReleaseConfig, envConfig)
          : userConfig as ReleaseConfig;
      }
      
      // Validate if requested
      if (validate) {
        const validationResult = this.validateConfig(finalConfig);
        if (!validationResult.valid) {
          throw new Error(
            `Configuration validation failed:\n${validationResult.errors.map(e => `  - ${e.path}: ${e.message}`).join('\n')}`
          );
        }
      }
      
      this.config = finalConfig;
      return this.config;
      
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in configuration file: ${error.message}`);
      }
      throw error;
    }
  }
  
  /**
   * Save configuration to file
   */
  async saveToFile(configPath?: string): Promise<void> {
    const targetPath = configPath || this.configPath || '.release-config.json';
    
    try {
      const configJson = JSON.stringify(this.config, null, 2);
      fs.writeFileSync(targetPath, configJson, 'utf-8');
      this.configPath = targetPath;
    } catch (error) {
      throw new Error(`Failed to save configuration: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Get current configuration
   */
  getConfig(): ReleaseConfig {
    return { ...this.config };
  }
  
  /**
   * Update configuration
   */
  updateConfig(updates: Partial<ReleaseConfig>): ReleaseConfig {
    this.config = this.mergeConfigs(this.config, updates);
    return this.getConfig();
  }
  
  /**
   * Reload configuration from file
   */
  async reload(): Promise<ReleaseConfig> {
    if (!this.configPath) {
      throw new Error('No configuration file path set. Use loadFromFile first.');
    }
    
    return this.loadFromFile({ configPath: this.configPath });
  }
  
  /**
   * Enable hot reload for configuration changes
   */
  enableHotReload(options: HotReloadOptions = {}): void {
    if (!this.configPath) {
      throw new Error('Cannot enable hot reload without a configuration file path. Use loadFromFile first.');
    }
    
    // Update hot reload options
    this.hotReloadOptions = {
      ...this.hotReloadOptions,
      ...options,
      enabled: true
    };
    
    // Start watching configuration file
    if (!this.fileWatcher) {
      this.fileWatcher = fs.watch(this.configPath, async (eventType) => {
        if (eventType === 'change') {
          await this.handleConfigFileChange();
        }
      });
    }
  }
  
  /**
   * Disable hot reload
   */
  disableHotReload(): void {
    this.hotReloadOptions.enabled = false;
    
    if (this.fileWatcher) {
      this.fileWatcher.close();
      this.fileWatcher = undefined;
    }
  }
  
  /**
   * Check if hot reload is enabled
   */
  isHotReloadEnabled(): boolean {
    return this.hotReloadOptions.enabled === true;
  }
  
  /**
   * Add configuration change listener
   */
  addChangeListener(listener: ConfigChangeListener): void {
    this.changeListeners.push(listener);
  }
  
  /**
   * Remove configuration change listener
   */
  removeChangeListener(listener: ConfigChangeListener): void {
    const index = this.changeListeners.indexOf(listener);
    if (index !== -1) {
      this.changeListeners.splice(index, 1);
    }
  }
  
  /**
   * Remove all configuration change listeners
   */
  removeAllChangeListeners(): void {
    this.changeListeners = [];
  }
  
  /**
   * Apply configuration changes with validation and rollback
   */
  async applyConfigChanges(
    newConfig: Partial<ReleaseConfig>,
    options: HotReloadOptions = {}
  ): Promise<ConfigChangeNotification> {
    const applyOptions = { ...this.hotReloadOptions, ...options };
    const previousConfig = { ...this.config };
    const timestamp = new Date();
    
    try {
      // Merge new config with current config
      const mergedConfig = this.mergeConfigs(this.config, newConfig);
      
      // Validate if requested
      if (applyOptions.validateBeforeApply) {
        const validationResult = this.validateConfig(mergedConfig);
        if (!validationResult.valid) {
          throw new Error(
            `Configuration validation failed:\n${validationResult.errors.map(e => `  - ${e.path}: ${e.message}`).join('\n')}`
          );
        }
      }
      
      // Create backup if requested
      let backupPath: string | undefined;
      if (applyOptions.createBackup && this.configPath) {
        const backupResult = await this.createBackup(this.configPath);
        if (backupResult.success) {
          backupPath = backupResult.backupPath;
        }
      }
      
      // Apply changes
      this.config = mergedConfig;
      
      // Detect changes
      const changes = this.detectChanges(previousConfig, this.config);
      
      // Create notification
      const notification: ConfigChangeNotification = {
        timestamp,
        previousConfig,
        newConfig: this.config,
        changes,
        success: true
      };
      
      // Notify listeners if requested
      if (applyOptions.notifyListeners) {
        this.notifyChangeListeners(notification);
      }
      
      // Log change
      this.logConfigChange(notification);
      
      return notification;
      
    } catch (error) {
      // Rollback on failure if requested
      if (applyOptions.rollbackOnFailure) {
        this.config = previousConfig;
      }
      
      const notification: ConfigChangeNotification = {
        timestamp,
        previousConfig,
        newConfig: this.config,
        changes: [],
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
      
      // Notify listeners of failure
      if (applyOptions.notifyListeners) {
        this.notifyChangeListeners(notification);
      }
      
      // Log failure
      this.logConfigChange(notification);
      
      throw error;
    }
  }
  
  /**
   * Handle configuration file change (hot reload)
   */
  private async handleConfigFileChange(): Promise<void> {
    if (!this.hotReloadOptions.enabled || !this.configPath) {
      return;
    }
    
    try {
      // Read new configuration from file
      const configContent = fs.readFileSync(this.configPath, 'utf-8');
      const newConfig = JSON.parse(configContent) as Partial<ReleaseConfig>;
      
      // Apply changes with hot reload options
      await this.applyConfigChanges(newConfig, this.hotReloadOptions);
      
    } catch (error) {
      // Log error but don't throw (file watcher should continue)
      console.error('Hot reload failed:', error instanceof Error ? error.message : String(error));
    }
  }
  
  /**
   * Detect changes between two configurations
   */
  private detectChanges(
    oldConfig: ReleaseConfig,
    newConfig: ReleaseConfig
  ): ConfigChange[] {
    const changes: ConfigChange[] = [];
    
    const detectChangesRecursive = (
      oldObj: any,
      newObj: any,
      path: string = ''
    ): void => {
      // Get all keys from both objects
      const allKeys = new Set([
        ...Object.keys(oldObj || {}),
        ...Object.keys(newObj || {})
      ]);
      
      for (const key of allKeys) {
        const currentPath = path ? `${path}.${key}` : key;
        const oldValue = oldObj?.[key];
        const newValue = newObj?.[key];
        
        // Value removed
        if (oldValue !== undefined && newValue === undefined) {
          changes.push({
            path: currentPath,
            previousValue: oldValue,
            newValue: undefined,
            type: 'removed'
          });
        }
        // Value added
        else if (oldValue === undefined && newValue !== undefined) {
          changes.push({
            path: currentPath,
            previousValue: undefined,
            newValue: newValue,
            type: 'added'
          });
        }
        // Value modified
        else if (oldValue !== undefined && newValue !== undefined) {
          // Check if both are objects (and not arrays or null)
          if (
            typeof oldValue === 'object' &&
            typeof newValue === 'object' &&
            !Array.isArray(oldValue) &&
            !Array.isArray(newValue) &&
            oldValue !== null &&
            newValue !== null
          ) {
            // Recursively check nested objects
            detectChangesRecursive(oldValue, newValue, currentPath);
          }
          // Primitive values or arrays - compare directly
          else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            changes.push({
              path: currentPath,
              previousValue: oldValue,
              newValue: newValue,
              type: 'modified'
            });
          }
        }
      }
    };
    
    detectChangesRecursive(oldConfig, newConfig);
    return changes;
  }
  
  /**
   * Notify all change listeners
   */
  private notifyChangeListeners(notification: ConfigChangeNotification): void {
    for (const listener of this.changeListeners) {
      try {
        listener(notification);
      } catch (error) {
        console.error('Error in change listener:', error);
      }
    }
  }
  
  /**
   * Log configuration change
   */
  private logConfigChange(notification: ConfigChangeNotification): void {
    const logEntry = {
      timestamp: notification.timestamp.toISOString(),
      success: notification.success,
      changesCount: notification.changes.length,
      changes: notification.changes.map(c => ({
        path: c.path,
        type: c.type,
        previousValue: c.previousValue,
        newValue: c.newValue
      })),
      error: notification.error
    };
    
    // In a real implementation, this would write to a log file
    // For now, we'll just log to console
    if (notification.success) {
      console.log('Configuration updated:', JSON.stringify(logEntry, null, 2));
    } else {
      console.error('Configuration update failed:', JSON.stringify(logEntry, null, 2));
    }
  }
  
  /**
   * Validate configuration
   */
  validateConfig(config: ReleaseConfig = this.config): ConfigValidationResult {
    const errors: ConfigValidationError[] = [];
    const warnings: ConfigValidationWarning[] = [];
    
    // Validate detection config
    if (config.detection) {
      this.validateDetectionConfig(config.detection, errors, warnings);
    }
    
    // Validate versioning config
    if (config.versioning) {
      this.validateVersioningConfig(config.versioning, errors, warnings);
    }
    
    // Validate publishing config
    if (config.publishing) {
      this.validatePublishingConfig(config.publishing, errors, warnings);
    }
    
    // Validate validation config (meta!)
    if (config.validation) {
      this.validateValidationConfig(config.validation, errors, warnings);
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Merge multiple configurations
   */
  private mergeConfigs(...configs: Array<Partial<ReleaseConfig> | undefined>): ReleaseConfig {
    const result: any = {};
    
    for (const config of configs) {
      if (!config) continue;
      
      for (const key in config) {
        const value = (config as any)[key];
        
        if (value === undefined) continue;
        
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          // Deep merge objects
          result[key] = this.mergeObjects(result[key] || {}, value);
        } else {
          // Direct assignment for primitives and arrays
          result[key] = value;
        }
      }
    }
    
    return result as ReleaseConfig;
  }
  
  /**
   * Deep merge two objects
   */
  private mergeObjects(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      if (sourceValue === undefined) continue;
      
      if (
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        sourceValue !== null &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue) &&
        targetValue !== null
      ) {
        // Recursively merge nested objects
        result[key] = this.mergeObjects(targetValue, sourceValue);
      } else {
        // Direct assignment for primitives, arrays, and null
        result[key] = sourceValue;
      }
    }
    
    return result;
  }
  
  /**
   * Validate detection configuration
   */
  private validateDetectionConfig(
    config: DetectionConfig,
    errors: ConfigValidationError[],
    warnings: ConfigValidationWarning[]
  ): void {
    // Validate confidence threshold
    if (config.confidenceThreshold < 0 || config.confidenceThreshold > 1) {
      errors.push({
        path: 'detection.confidenceThreshold',
        message: 'Confidence threshold must be between 0 and 1',
        expected: '0 <= value <= 1',
        actual: config.confidenceThreshold
      });
    }
    
    // Validate breaking change keywords
    if (!Array.isArray(config.breakingChangeKeywords) || config.breakingChangeKeywords.length === 0) {
      warnings.push({
        path: 'detection.breakingChangeKeywords',
        message: 'No breaking change keywords defined',
        suggestion: 'Add keywords like "breaking change", "incompatible", etc.'
      });
    }
    
    // Validate monitor paths
    if (!Array.isArray(config.monitorPaths) || config.monitorPaths.length === 0) {
      errors.push({
        path: 'detection.monitorPaths',
        message: 'At least one monitor path must be specified',
        expected: 'Non-empty array of paths',
        actual: config.monitorPaths
      });
    }
    
    // Validate completion patterns
    if (!Array.isArray(config.completionPatterns) || config.completionPatterns.length === 0) {
      errors.push({
        path: 'detection.completionPatterns',
        message: 'At least one completion pattern must be specified',
        expected: 'Non-empty array of patterns',
        actual: config.completionPatterns
      });
    }
  }
  
  /**
   * Validate versioning configuration
   */
  private validateVersioningConfig(
    config: VersioningConfig,
    errors: ConfigValidationError[],
    warnings: ConfigValidationWarning[]
  ): void {
    // Validate pre-release strategy
    const validStrategies = ['alpha', 'beta', 'rc'];
    if (!validStrategies.includes(config.preReleaseStrategy)) {
      errors.push({
        path: 'versioning.preReleaseStrategy',
        message: 'Invalid pre-release strategy',
        expected: 'One of: alpha, beta, rc',
        actual: config.preReleaseStrategy
      });
    }
    
    // Validate package coordination
    const coordination = config.packageCoordination;
    if (!Array.isArray(coordination.corePackages) || coordination.corePackages.length === 0) {
      warnings.push({
        path: 'versioning.packageCoordination.corePackages',
        message: 'No core packages defined',
        suggestion: 'Define packages that should be synchronized'
      });
    }
    
    // Validate dependency updates strategy
    const validUpdateStrategies = ['automatic', 'manual', 'prompt'];
    if (!validUpdateStrategies.includes(coordination.dependencyUpdates)) {
      errors.push({
        path: 'versioning.packageCoordination.dependencyUpdates',
        message: 'Invalid dependency update strategy',
        expected: 'One of: automatic, manual, prompt',
        actual: coordination.dependencyUpdates
      });
    }
    
    // Validate version bump rules
    const bumpRules = config.versionBumpRules;
    if (!Array.isArray(bumpRules.majorBumpTriggers) || bumpRules.majorBumpTriggers.length === 0) {
      warnings.push({
        path: 'versioning.versionBumpRules.majorBumpTriggers',
        message: 'No major bump triggers defined',
        suggestion: 'Define triggers for major version bumps'
      });
    }
  }
  
  /**
   * Validate publishing configuration
   */
  private validatePublishingConfig(
    config: PublishingConfig,
    errors: ConfigValidationError[],
    warnings: ConfigValidationWarning[]
  ): void {
    // Validate GitHub config
    const github = config.github;
    if (!github.owner || github.owner.trim() === '') {
      errors.push({
        path: 'publishing.github.owner',
        message: 'GitHub owner is required',
        expected: 'Non-empty string',
        actual: github.owner
      });
    }
    
    if (!github.repository || github.repository.trim() === '') {
      errors.push({
        path: 'publishing.github.repository',
        message: 'GitHub repository is required',
        expected: 'Non-empty string',
        actual: github.repository
      });
    }
    
    if (!github.tokenEnvVar || github.tokenEnvVar.trim() === '') {
      errors.push({
        path: 'publishing.github.tokenEnvVar',
        message: 'GitHub token environment variable name is required',
        expected: 'Non-empty string',
        actual: github.tokenEnvVar
      });
    }
    
    // Validate npm config
    const npm = config.npm;
    if (!npm.registry || npm.registry.trim() === '') {
      errors.push({
        path: 'publishing.npm.registry',
        message: 'npm registry URL is required',
        expected: 'Non-empty string',
        actual: npm.registry
      });
    }
    
    if (!npm.tokenEnvVar || npm.tokenEnvVar.trim() === '') {
      errors.push({
        path: 'publishing.npm.tokenEnvVar',
        message: 'npm token environment variable name is required',
        expected: 'Non-empty string',
        actual: npm.tokenEnvVar
      });
    }
    
    if (!Array.isArray(npm.packages) || npm.packages.length === 0) {
      warnings.push({
        path: 'publishing.npm.packages',
        message: 'No npm packages configured',
        suggestion: 'Add packages to publish to npm'
      });
    }
    
    // Validate package configurations
    npm.packages.forEach((pkg, index) => {
      if (!pkg.name || pkg.name.trim() === '') {
        errors.push({
          path: `publishing.npm.packages[${index}].name`,
          message: 'Package name is required',
          expected: 'Non-empty string',
          actual: pkg.name
        });
      }
      
      if (!pkg.path || pkg.path.trim() === '') {
        errors.push({
          path: `publishing.npm.packages[${index}].path`,
          message: 'Package path is required',
          expected: 'Non-empty string',
          actual: pkg.path
        });
      }
    });
    
    // Validate retry config
    const retry = config.publishingOrder.retryConfig;
    if (retry.maxAttempts < 1) {
      errors.push({
        path: 'publishing.publishingOrder.retryConfig.maxAttempts',
        message: 'Max retry attempts must be at least 1',
        expected: '>= 1',
        actual: retry.maxAttempts
      });
    }
    
    if (retry.retryDelay < 0) {
      errors.push({
        path: 'publishing.publishingOrder.retryConfig.retryDelay',
        message: 'Retry delay cannot be negative',
        expected: '>= 0',
        actual: retry.retryDelay
      });
    }
  }
  
  /**
   * Validate validation configuration
   */
  private validateValidationConfig(
    config: ValidationConfig,
    errors: ConfigValidationError[],
    warnings: ConfigValidationWarning[]
  ): void {
    // Validate required sections
    const rules = config.validationRules;
    if (rules.requireCompletionDocs && (!Array.isArray(rules.requiredSections) || rules.requiredSections.length === 0)) {
      warnings.push({
        path: 'validation.validationRules.requiredSections',
        message: 'Completion docs required but no required sections defined',
        suggestion: 'Define required sections for completion documents'
      });
    }
    
    // Validate breaking change rules
    if (!Array.isArray(rules.breakingChangeRules) || rules.breakingChangeRules.length === 0) {
      warnings.push({
        path: 'validation.validationRules.breakingChangeRules',
        message: 'No breaking change rules defined',
        suggestion: 'Define rules for detecting breaking changes'
      });
    }
    
    // Validate breaking change rule patterns
    rules.breakingChangeRules.forEach((rule, index) => {
      if (!rule.id || rule.id.trim() === '') {
        errors.push({
          path: `validation.validationRules.breakingChangeRules[${index}].id`,
          message: 'Breaking change rule ID is required',
          expected: 'Non-empty string',
          actual: rule.id
        });
      }
      
      if (!rule.pattern || rule.pattern.trim() === '') {
        errors.push({
          path: `validation.validationRules.breakingChangeRules[${index}].pattern`,
          message: 'Breaking change rule pattern is required',
          expected: 'Non-empty string',
          actual: rule.pattern
        });
      }
      
      // Validate regex pattern
      try {
        new RegExp(rule.pattern);
      } catch (e) {
        errors.push({
          path: `validation.validationRules.breakingChangeRules[${index}].pattern`,
          message: 'Invalid regex pattern',
          expected: 'Valid regex pattern',
          actual: rule.pattern
        });
      }
    });
  }
  
  /**
   * Create backup of configuration file
   */
  async createBackup(configPath: string): Promise<ConfigBackupResult> {
    try {
      // Ensure backup directory exists
      if (!fs.existsSync(ConfigManager.BACKUP_DIR)) {
        fs.mkdirSync(ConfigManager.BACKUP_DIR, { recursive: true });
      }
      
      // Generate backup filename with timestamp
      const timestamp = new Date();
      const timestampStr = timestamp.toISOString().replace(/[:.]/g, '-');
      const basename = path.basename(configPath, '.json');
      const backupPath = path.join(
        ConfigManager.BACKUP_DIR,
        `${basename}-${timestampStr}.json`
      );
      
      // Copy config file to backup
      const configContent = fs.readFileSync(configPath, 'utf-8');
      fs.writeFileSync(backupPath, configContent, 'utf-8');
      
      return {
        success: true,
        backupPath,
        timestamp
      };
    } catch (error) {
      return {
        success: false,
        backupPath: '',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
  
  /**
   * Restore configuration from backup
   */
  async restoreFromBackup(backupPath: string, targetPath?: string): Promise<boolean> {
    try {
      const target = targetPath || this.configPath || '.release-config.json';
      
      // Verify backup exists
      if (!fs.existsSync(backupPath)) {
        throw new Error(`Backup file not found: ${backupPath}`);
      }
      
      // Read backup content
      const backupContent = fs.readFileSync(backupPath, 'utf-8');
      
      // Validate backup is valid JSON
      JSON.parse(backupContent);
      
      // Create backup of current config before restoring
      if (fs.existsSync(target)) {
        await this.createBackup(target);
      }
      
      // Restore backup to target
      fs.writeFileSync(target, backupContent, 'utf-8');
      
      // Reload configuration
      await this.loadFromFile({ configPath: target });
      
      return true;
    } catch (error) {
      throw new Error(
        `Failed to restore from backup: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
  
  /**
   * List available backups
   */
  listBackups(): Array<{ path: string; timestamp: Date; size: number }> {
    try {
      if (!fs.existsSync(ConfigManager.BACKUP_DIR)) {
        return [];
      }
      
      const files = fs.readdirSync(ConfigManager.BACKUP_DIR);
      const backups = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filePath = path.join(ConfigManager.BACKUP_DIR, file);
          const stats = fs.statSync(filePath);
          
          // Extract timestamp from filename
          const timestampMatch = file.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)/);
          const timestamp = timestampMatch
            ? new Date(timestampMatch[1].replace(/-/g, ':').replace(/T(\d{2}):(\d{2}):(\d{2})/, 'T$1:$2:$3'))
            : stats.mtime;
          
          return {
            path: filePath,
            timestamp,
            size: stats.size
          };
        })
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      return backups;
    } catch (error) {
      return [];
    }
  }
  
  /**
   * Cleanup resources (close file watcher)
   */
  cleanup(): void {
    this.disableHotReload();
    this.removeAllChangeListeners();
  }
  
  /**
   * Migrate configuration to current version
   */
  private async migrateConfig(
    config: any,
    configPath: string
  ): Promise<{ success: boolean; migratedConfig: any; errors: string[] }> {
    const errors: string[] = [];
    const stepsApplied: string[] = [];
    let migratedConfig = { ...config };
    
    try {
      const configVersion = config.version || '0.0.0';
      
      // Migration from 0.x to 1.0.0
      if (this.compareVersions(configVersion, '1.0.0') < 0) {
        // Migrate detection config
        if (migratedConfig.detection) {
          // Rename old fields if they exist
          if (migratedConfig.detection.enableSpecCompletion !== undefined) {
            migratedConfig.detection.specCompletionTrigger = migratedConfig.detection.enableSpecCompletion;
            delete migratedConfig.detection.enableSpecCompletion;
            stepsApplied.push('Renamed detection.enableSpecCompletion to detection.specCompletionTrigger');
          }
          
          if (migratedConfig.detection.enableTaskCompletion !== undefined) {
            migratedConfig.detection.taskCompletionTrigger = migratedConfig.detection.enableTaskCompletion;
            delete migratedConfig.detection.enableTaskCompletion;
            stepsApplied.push('Renamed detection.enableTaskCompletion to detection.taskCompletionTrigger');
          }
        }
        
        // Migrate versioning config
        if (migratedConfig.versioning?.packageCoordination) {
          // Ensure corePackages and independentPackages are arrays
          if (!Array.isArray(migratedConfig.versioning.packageCoordination.corePackages)) {
            migratedConfig.versioning.packageCoordination.corePackages = DEFAULT_RELEASE_CONFIG.versioning.packageCoordination.corePackages;
            stepsApplied.push('Initialized versioning.packageCoordination.corePackages array');
          }
          
          if (!Array.isArray(migratedConfig.versioning.packageCoordination.independentPackages)) {
            migratedConfig.versioning.packageCoordination.independentPackages = DEFAULT_RELEASE_CONFIG.versioning.packageCoordination.independentPackages;
            stepsApplied.push('Initialized versioning.packageCoordination.independentPackages array');
          }
        }
        
        // Migrate publishing config
        if (migratedConfig.publishing) {
          // Ensure retry config exists
          if (!migratedConfig.publishing.publishingOrder?.retryConfig) {
            if (!migratedConfig.publishing.publishingOrder) {
              migratedConfig.publishing.publishingOrder = {};
            }
            migratedConfig.publishing.publishingOrder.retryConfig = DEFAULT_RELEASE_CONFIG.publishing.publishingOrder.retryConfig;
            stepsApplied.push('Added publishing.publishingOrder.retryConfig');
          }
        }
        
        // Update version
        migratedConfig.version = '1.0.0';
        stepsApplied.push('Updated configuration version to 1.0.0');
      }
      
      // Save migrated config if changes were made
      if (stepsApplied.length > 0) {
        // Create backup before saving migrated config
        await this.createBackup(configPath);
        
        // Save migrated config
        fs.writeFileSync(
          configPath,
          JSON.stringify(migratedConfig, null, 2),
          'utf-8'
        );
        
        stepsApplied.push(`Saved migrated configuration to ${configPath}`);
      }
      
      return {
        success: true,
        migratedConfig,
        errors
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
      return {
        success: false,
        migratedConfig: config,
        errors
      };
    }
  }
  
  /**
   * Compare two semantic version strings
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }
    
    return 0;
  }
}

/**
 * Create a new ConfigManager instance
 */
export function createConfigManager(config?: Partial<ReleaseConfig>): ConfigManager {
  return new ConfigManager(config);
}

/**
 * Load configuration from file
 */
export async function loadConfig(options?: ConfigLoadOptions): Promise<ReleaseConfig> {
  const manager = new ConfigManager();
  return manager.loadFromFile(options);
}
