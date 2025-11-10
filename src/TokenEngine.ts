/**
 * Token Engine - Main Orchestrator
 * 
 * Central integration point for the Mathematical Token System that coordinates
 * all registries, validation services, and translation providers to provide
 * a unified interface for token management and cross-platform generation.
 * 
 * The TokenEngine follows the business localization model where tokens are
 * remote workers with specialized expertise serving multiple markets (platforms)
 * through translation services.
 */

import { PrimitiveTokenRegistry } from './registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from './registries/SemanticTokenRegistry';
import { ThreeTierValidator } from './validators/ThreeTierValidator';
import type { PrimitiveToken, SemanticToken, ValidationResult, TranslationOutput, TargetPlatform } from './types';
import { RegistryCoordinator } from './integration/RegistryCoordinator';
import { ValidationCoordinator } from './integration/ValidationCoordinator';
import { TranslationCoordinator } from './integration/TranslationCoordinator';

/**
 * Configuration options for TokenEngine initialization
 */
export interface TokenEngineConfig {
  /** Enable automatic validation on token registration */
  autoValidate?: boolean;
  
  /** Enable cross-platform consistency checks */
  enableCrossPlatformValidation?: boolean;
  
  /** Strategic flexibility usage threshold (default: 0.8 = 80%) */
  strategicFlexibilityThreshold?: number;
  
  /** Enable usage pattern tracking */
  enableUsageTracking?: boolean;
  
  /** Custom validation options */
  validationOptions?: {
    strictMathematics?: boolean;
    requireSemanticTokens?: boolean;
    primitiveUsageThreshold?: number;
  };
  
  /** Translation provider configuration */
  translationConfig?: {
    enabledPlatforms?: TargetPlatform[];
    outputDirectory?: string;
    includeComments?: boolean;
  };
}

/**
 * Token Engine statistics and health metrics
 */
export interface TokenEngineStats {
  primitiveTokens: {
    total: number;
    byCategory: Record<string, number>;
    strategicFlexibility: number;
    strategicFlexibilityPercentage: number;
  };
  
  semanticTokens: {
    total: number;
    byCategory: Record<string, number>;
  };
  
  validation: {
    passCount: number;
    warningCount: number;
    errorCount: number;
    overallHealthScore: number;
    mathematicalConsistencyScore: number;
  };
  
  translation: {
    enabledPlatforms: TargetPlatform[];
    lastGenerationTime?: Date;
    generatedFileCount: number;
  };
}

/**
 * Main TokenEngine class orchestrating all token system components
 */
export class TokenEngine {
  private primitiveRegistry: PrimitiveTokenRegistry;
  private semanticRegistry: SemanticTokenRegistry;
  private validator: ThreeTierValidator;
  private registryCoordinator: RegistryCoordinator;
  private validationCoordinator: ValidationCoordinator;
  private translationCoordinator: TranslationCoordinator;
  private config: Required<TokenEngineConfig>;

  constructor(config: TokenEngineConfig = {}) {
    // Initialize configuration with defaults
    this.config = {
      autoValidate: true,
      enableCrossPlatformValidation: true,
      strategicFlexibilityThreshold: 0.8,
      enableUsageTracking: true,
      validationOptions: {
        strictMathematics: true,
        requireSemanticTokens: false,
        primitiveUsageThreshold: 0.3,
        ...config.validationOptions
      },
      translationConfig: {
        enabledPlatforms: ['web', 'ios', 'android'],
        outputDirectory: 'dist/tokens',
        includeComments: true,
        ...config.translationConfig
      },
      ...config
    };

    // Initialize core registries
    this.primitiveRegistry = new PrimitiveTokenRegistry();
    this.semanticRegistry = new SemanticTokenRegistry(this.primitiveRegistry);
    this.validator = new ThreeTierValidator();

    // Initialize coordinators
    this.registryCoordinator = new RegistryCoordinator(
      this.primitiveRegistry,
      this.semanticRegistry
    );

    this.validationCoordinator = new ValidationCoordinator(
      this.validator,
      this.primitiveRegistry,
      this.semanticRegistry,
      {
        strategicFlexibilityThreshold: this.config.strategicFlexibilityThreshold,
        primitiveUsageThreshold: this.config.validationOptions.primitiveUsageThreshold!,
        enableUsageTracking: this.config.enableUsageTracking
      }
    );

    this.translationCoordinator = new TranslationCoordinator(
      this.primitiveRegistry,
      this.semanticRegistry,
      {
        enabledPlatforms: this.config.translationConfig.enabledPlatforms!,
        outputDirectory: this.config.translationConfig.outputDirectory!,
        includeComments: this.config.translationConfig.includeComments!
      }
    );
  }

  // ============================================================================
  // Token Registration Methods
  // ============================================================================

  /**
   * Register a primitive token with automatic validation
   * 
   * Validates the token before registration. If validation fails with an error,
   * registration is prevented. Warnings allow registration to proceed.
   */
  registerPrimitiveToken(token: PrimitiveToken): ValidationResult {
    // Validate before registration if autoValidate is enabled
    if (this.config.autoValidate) {
      const validationResult = this.validateToken(token);
      
      // Prevent registration if validation fails with error
      if (validationResult.level === 'Error') {
        return validationResult;
      }
      
      // Proceed with registration (validation passed or warning)
      // Skip validation in registry since we already validated
      try {
        this.registryCoordinator.registerPrimitive(token, {
          skipValidation: true,
          allowOverwrite: false
        });
        return validationResult;
      } catch (error) {
        // Handle registration errors (e.g., duplicate token)
        return {
          level: 'Error',
          token: token.name,
          message: error instanceof Error ? error.message : 'Registration failed',
          rationale: 'Token registration failed after successful validation',
          mathematicalReasoning: 'N/A',
          suggestions: ['Check for duplicate token names', 'Use allowOverwrite option if intentional']
        };
      }
    }
    
    // If autoValidate is disabled, register without validation
    try {
      this.registryCoordinator.registerPrimitive(token, {
        skipValidation: true,
        allowOverwrite: false
      });
      return {
        level: 'Pass',
        token: token.name,
        message: 'Token registered successfully without validation',
        rationale: 'Auto-validation is disabled',
        mathematicalReasoning: 'N/A',
        suggestions: []
      };
    } catch (error) {
      return {
        level: 'Error',
        token: token.name,
        message: error instanceof Error ? error.message : 'Registration failed',
        rationale: 'Token registration failed',
        mathematicalReasoning: 'N/A',
        suggestions: ['Check for duplicate token names', 'Use allowOverwrite option if intentional']
      };
    }
  }

  /**
   * Register multiple primitive tokens in batch
   * 
   * Validates each token before registration. If validation fails with an error,
   * that token's registration is prevented. Warnings allow registration to proceed.
   */
  registerPrimitiveTokens(tokens: PrimitiveToken[]): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    for (const token of tokens) {
      const result = this.registerPrimitiveToken(token);
      results.push(result);
    }
    
    return results;
  }

  /**
   * Register a semantic token with automatic validation
   * 
   * Validates the token before registration. If validation fails with an error,
   * registration is prevented. Warnings allow registration to proceed.
   */
  registerSemanticToken(token: SemanticToken): ValidationResult {
    // Validate before registration if autoValidate is enabled
    if (this.config.autoValidate) {
      const validationResult = this.validateToken(token);
      
      // Prevent registration if validation fails with error
      if (validationResult.level === 'Error') {
        return validationResult;
      }
      
      // Proceed with registration (validation passed or warning)
      // Skip validation in registry since we already validated
      try {
        this.registryCoordinator.registerSemantic(token, {
          skipValidation: true,
          allowOverwrite: false
        });
        return validationResult;
      } catch (error) {
        // Handle registration errors (e.g., duplicate token, unresolved references)
        return {
          level: 'Error',
          token: token.name,
          message: error instanceof Error ? error.message : 'Registration failed',
          rationale: 'Token registration failed after successful validation',
          mathematicalReasoning: 'N/A',
          suggestions: ['Check for duplicate token names', 'Ensure all primitive references exist', 'Use allowOverwrite option if intentional']
        };
      }
    }
    
    // If autoValidate is disabled, register without validation
    try {
      this.registryCoordinator.registerSemantic(token, {
        skipValidation: true,
        allowOverwrite: false
      });
      return {
        level: 'Pass',
        token: token.name,
        message: 'Token registered successfully without validation',
        rationale: 'Auto-validation is disabled',
        mathematicalReasoning: 'N/A',
        suggestions: []
      };
    } catch (error) {
      return {
        level: 'Error',
        token: token.name,
        message: error instanceof Error ? error.message : 'Registration failed',
        rationale: 'Token registration failed',
        mathematicalReasoning: 'N/A',
        suggestions: ['Check for duplicate token names', 'Ensure all primitive references exist', 'Use allowOverwrite option if intentional']
      };
    }
  }

  /**
   * Register multiple semantic tokens in batch
   * 
   * Validates each token before registration. If validation fails with an error,
   * that token's registration is prevented. Warnings allow registration to proceed.
   */
  registerSemanticTokens(tokens: SemanticToken[]): ValidationResult[] {
    const results: ValidationResult[] = [];
    
    for (const token of tokens) {
      const result = this.registerSemanticToken(token);
      results.push(result);
    }
    
    return results;
  }

  // ============================================================================
  // Token Retrieval Methods
  // ============================================================================

  /**
   * Get a primitive token by name
   */
  getPrimitiveToken(name: string): PrimitiveToken | undefined {
    return this.primitiveRegistry.get(name);
  }

  /**
   * Get a semantic token by name
   */
  getSemanticToken(name: string): SemanticToken | undefined {
    return this.semanticRegistry.get(name);
  }

  /**
   * Get all primitive tokens
   */
  getAllPrimitiveTokens(): PrimitiveToken[] {
    return this.primitiveRegistry.query();
  }

  /**
   * Get all semantic tokens
   */
  getAllSemanticTokens(): SemanticToken[] {
    return this.semanticRegistry.query();
  }

  /**
   * Query primitive tokens with filters
   */
  queryPrimitiveTokens(options: Parameters<PrimitiveTokenRegistry['query']>[0]): PrimitiveToken[] {
    return this.primitiveRegistry.query(options);
  }

  /**
   * Query semantic tokens with filters
   */
  querySemanticTokens(options: Parameters<SemanticTokenRegistry['query']>[0]): SemanticToken[] {
    return this.semanticRegistry.query(options);
  }

  // ============================================================================
  // Validation Methods
  // ============================================================================

  /**
   * Validate a specific token
   */
  validateToken(token: PrimitiveToken | SemanticToken): ValidationResult {
    return this.validationCoordinator.validateToken(token, {
      strictMathematics: this.config.validationOptions.strictMathematics,
      requireCrossPlatformConsistency: this.config.enableCrossPlatformValidation
    });
  }

  /**
   * Validate all registered tokens
   */
  validateAllTokens(): ValidationResult[] {
    return this.validationCoordinator.validateAllTokens({
      strictMathematics: this.config.validationOptions.strictMathematics,
      requireCrossPlatformConsistency: this.config.enableCrossPlatformValidation
    });
  }

  /**
   * Generate comprehensive validation report
   */
  generateValidationReport() {
    return this.validationCoordinator.generateValidationReport({
      strictMathematics: this.config.validationOptions.strictMathematics,
      requireCrossPlatformConsistency: this.config.enableCrossPlatformValidation
    });
  }

  // ============================================================================
  // Translation Methods
  // ============================================================================

  /**
   * Generate platform-specific token files for all enabled platforms
   */
  async generatePlatformTokens(): Promise<TranslationOutput[]> {
    return this.translationCoordinator.generateAllPlatforms();
  }

  /**
   * Generate platform-specific token files for a specific platform
   */
  async generatePlatformTokensFor(platform: TargetPlatform): Promise<TranslationOutput> {
    return this.translationCoordinator.generateForPlatform(platform);
  }

  /**
   * Validate cross-platform mathematical consistency
   */
  validateCrossPlatformConsistency(): ValidationResult[] {
    return this.translationCoordinator.validateCrossPlatformConsistency();
  }

  // ============================================================================
  // System Health and Statistics
  // ============================================================================

  /**
   * Get comprehensive token engine statistics
   */
  getStats(): TokenEngineStats {
    const primitiveStats = this.primitiveRegistry.getStats();
    const semanticStats = this.semanticRegistry.getStats();
    const validationReport = this.validationCoordinator.generateValidationReport({
      strictMathematics: this.config.validationOptions.strictMathematics,
      requireCrossPlatformConsistency: this.config.enableCrossPlatformValidation
    });

    return {
      primitiveTokens: {
        total: primitiveStats.totalTokens,
        byCategory: primitiveStats.categoryStats,
        strategicFlexibility: primitiveStats.strategicFlexibilityCount,
        strategicFlexibilityPercentage: primitiveStats.strategicFlexibilityPercentage
      },
      semanticTokens: {
        total: semanticStats.totalTokens,
        byCategory: semanticStats.categoryStats
      },
      validation: {
        passCount: validationReport.summary.passCount,
        warningCount: validationReport.summary.warningCount,
        errorCount: validationReport.summary.errorCount,
        overallHealthScore: validationReport.summary.overallHealthScore,
        mathematicalConsistencyScore: validationReport.systemAnalysis.mathematicalConsistencyScore
      },
      translation: {
        enabledPlatforms: this.config.translationConfig.enabledPlatforms!,
        lastGenerationTime: this.translationCoordinator.getLastGenerationTime(),
        generatedFileCount: this.translationCoordinator.getGeneratedFileCount()
      }
    };
  }

  /**
   * Get system health status
   */
  getHealthStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
  } {
    const stats = this.getStats();
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check validation health
    if (stats.validation.errorCount > 0) {
      issues.push(`${stats.validation.errorCount} critical validation errors detected`);
      recommendations.push('Address critical validation errors immediately');
    }

    if (stats.validation.overallHealthScore < 0.7) {
      issues.push(`Low overall health score: ${(stats.validation.overallHealthScore * 100).toFixed(1)}%`);
      recommendations.push('Review and improve token usage patterns');
    }

    // Check strategic flexibility usage
    if (stats.primitiveTokens.strategicFlexibilityPercentage > 20) {
      issues.push(`High strategic flexibility usage: ${stats.primitiveTokens.strategicFlexibilityPercentage.toFixed(1)}%`);
      recommendations.push('Consider creating semantic tokens for common use cases');
    }

    // Check mathematical consistency
    if (stats.validation.mathematicalConsistencyScore < 0.8) {
      issues.push(`Low mathematical consistency: ${(stats.validation.mathematicalConsistencyScore * 100).toFixed(1)}%`);
      recommendations.push('Audit tokens for mathematical relationship violations');
    }

    // Determine overall status
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (stats.validation.errorCount > 0 || stats.validation.mathematicalConsistencyScore < 0.5) {
      status = 'critical';
    } else if (issues.length > 0) {
      status = 'warning';
    }

    return { status, issues, recommendations };
  }

  // ============================================================================
  // Configuration Management
  // ============================================================================

  /**
   * Update engine configuration
   */
  updateConfig(config: Partial<TokenEngineConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      validationOptions: {
        ...this.config.validationOptions,
        ...config.validationOptions
      },
      translationConfig: {
        ...this.config.translationConfig,
        ...config.translationConfig
      }
    };

    // Update coordinators with new configuration
    this.validationCoordinator.updateConfig({
      strategicFlexibilityThreshold: this.config.strategicFlexibilityThreshold,
      primitiveUsageThreshold: this.config.validationOptions.primitiveUsageThreshold!,
      enableUsageTracking: this.config.enableUsageTracking
    });

    this.translationCoordinator.updateConfig({
      enabledPlatforms: this.config.translationConfig.enabledPlatforms!,
      outputDirectory: this.config.translationConfig.outputDirectory!,
      includeComments: this.config.translationConfig.includeComments!
    });
  }

  /**
   * Get current engine configuration
   */
  getConfig(): Readonly<TokenEngineConfig> {
    return { ...this.config };
  }

  // ============================================================================
  // System Management
  // ============================================================================

  /**
   * Clear all tokens and reset the engine
   */
  reset(): void {
    this.primitiveRegistry.clear();
    this.semanticRegistry.clear();
    this.translationCoordinator.clearGenerationCache();
  }

  /**
   * Export complete token system state
   */
  exportState(): {
    primitiveTokens: PrimitiveToken[];
    semanticTokens: SemanticToken[];
    config: TokenEngineConfig;
    stats: TokenEngineStats;
  } {
    return {
      primitiveTokens: this.getAllPrimitiveTokens(),
      semanticTokens: this.getAllSemanticTokens(),
      config: this.getConfig(),
      stats: this.getStats()
    };
  }

  /**
   * Import token system state
   */
  importState(state: {
    primitiveTokens: PrimitiveToken[];
    semanticTokens: SemanticToken[];
    config?: TokenEngineConfig;
  }): {
    success: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    try {
      // Clear existing state
      this.reset();

      // Update configuration if provided
      if (state.config) {
        this.updateConfig(state.config);
      }

      // Import primitive tokens
      const primitiveResults = this.registerPrimitiveTokens(state.primitiveTokens);
      primitiveResults.forEach((result, index) => {
        if (result.level === 'Error') {
          errors.push(`Primitive token ${state.primitiveTokens[index].name}: ${result.message}`);
        }
      });

      // Import semantic tokens
      const semanticResults = this.registerSemanticTokens(state.semanticTokens);
      semanticResults.forEach((result, index) => {
        if (result.level === 'Error') {
          errors.push(`Semantic token ${state.semanticTokens[index].name}: ${result.message}`);
        }
      });

      return {
        success: errors.length === 0,
        errors
      };
    } catch (error) {
      errors.push(`Import failed: ${error instanceof Error ? error.message : String(error)}`);
      return {
        success: false,
        errors
      };
    }
  }
}
