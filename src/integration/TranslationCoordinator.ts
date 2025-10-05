/**
 * Translation Coordinator
 * 
 * Coordinates translation services to generate platform-specific token files
 * while maintaining cross-platform mathematical consistency. Manages Unit,
 * Format, and Path providers to produce optimized output for each platform.
 */

import { PrimitiveTokenRegistry } from '../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../registries/SemanticTokenRegistry';
import { WebUnitConverter } from '../providers/WebUnitConverter';
import { iOSUnitConverter } from '../providers/iOSUnitConverter';
import { AndroidUnitConverter } from '../providers/AndroidUnitConverter';
import { WebFormatGenerator } from '../providers/WebFormatGenerator';
import { iOSFormatGenerator } from '../providers/iOSFormatGenerator';
import { AndroidFormatGenerator } from '../providers/AndroidFormatGenerator';
import { WebFileOrganizer } from '../providers/WebFileOrganizer';
import { iOSFileOrganizer } from '../providers/iOSFileOrganizer';
import { AndroidFileOrganizer } from '../providers/AndroidFileOrganizer';
import type { 
  PrimitiveToken, 
  SemanticToken, 
  TranslationOutput, 
  TargetPlatform,
  ValidationResult 
} from '../types';
import type { UnitProvider } from '../providers/UnitProvider';
import type { FormatProvider } from '../providers/FormatProvider';
import type { PathProvider } from '../providers/PathProvider';

/**
 * Translation coordinator configuration
 */
export interface TranslationCoordinatorConfig {
  enabledPlatforms: TargetPlatform[];
  outputDirectory: string;
  includeComments: boolean;
}

/**
 * Platform provider set containing all providers for a platform
 */
interface PlatformProviders {
  unitProvider: UnitProvider;
  formatProvider: FormatProvider;
  pathProvider: PathProvider;
}

/**
 * Translation Coordinator class managing cross-platform token generation
 */
export class TranslationCoordinator {
  private primitiveRegistry: PrimitiveTokenRegistry;
  private semanticRegistry: SemanticTokenRegistry;
  private config: TranslationCoordinatorConfig;
  private platformProviders: Map<TargetPlatform, PlatformProviders>;
  private generationHistory: Array<{
    timestamp: Date;
    platform: TargetPlatform;
    tokenCount: number;
    success: boolean;
  }> = [];
  private lastGenerationTime?: Date;
  private generatedFileCount: number = 0;

  constructor(
    primitiveRegistry: PrimitiveTokenRegistry,
    semanticRegistry: SemanticTokenRegistry,
    config: TranslationCoordinatorConfig
  ) {
    this.primitiveRegistry = primitiveRegistry;
    this.semanticRegistry = semanticRegistry;
    this.config = config;
    this.platformProviders = new Map();

    // Initialize platform providers
    this.initializePlatformProviders();
  }

  // ============================================================================
  // Platform Provider Initialization
  // ============================================================================

  /**
   * Initialize providers for all platforms
   */
  private initializePlatformProviders(): void {
    // Web providers
    this.platformProviders.set('web', {
      unitProvider: new WebUnitConverter(),
      formatProvider: new WebFormatGenerator(),
      pathProvider: new WebFileOrganizer()
    });

    // iOS providers
    this.platformProviders.set('ios', {
      unitProvider: new iOSUnitConverter(),
      formatProvider: new iOSFormatGenerator(),
      pathProvider: new iOSFileOrganizer()
    });

    // Android providers
    this.platformProviders.set('android', {
      unitProvider: new AndroidUnitConverter(),
      formatProvider: new AndroidFormatGenerator(),
      pathProvider: new AndroidFileOrganizer()
    });
  }

  // ============================================================================
  // Token Translation
  // ============================================================================

  /**
   * Generate platform-specific token files for all enabled platforms
   */
  async generateAllPlatforms(): Promise<TranslationOutput[]> {
    const outputs: TranslationOutput[] = [];

    for (const platform of this.config.enabledPlatforms) {
      try {
        const output = await this.generateForPlatform(platform);
        outputs.push(output);
      } catch (error) {
        // Log error but continue with other platforms
        console.error(`Failed to generate tokens for ${platform}:`, error);
        outputs.push({
          platform,
          filePath: '',
          content: '',
          format: this.getFormatForPlatform(platform),
          tokenCount: 0,
          validationStatus: 'invalid',
          validationErrors: [error instanceof Error ? error.message : String(error)]
        });
      }
    }

    this.lastGenerationTime = new Date();
    this.generatedFileCount = outputs.filter(o => o.validationStatus === 'valid').length;

    return outputs;
  }

  /**
   * Generate platform-specific token files for a specific platform
   */
  async generateForPlatform(platform: TargetPlatform): Promise<TranslationOutput> {
    const providers = this.platformProviders.get(platform);
    
    if (!providers) {
      throw new Error(`No providers configured for platform: ${platform}`);
    }

    // Get all tokens
    const primitiveTokens = this.primitiveRegistry.query();
    const semanticTokens = this.semanticRegistry.query();
    const allTokens = [...primitiveTokens, ...semanticTokens];

    // Convert tokens to platform-specific values
    const convertedTokens = this.convertTokensForPlatform(allTokens, providers.unitProvider);

    // Generate file content
    const content = providers.formatProvider.generateFile(convertedTokens, {
      includeComments: this.config.includeComments,
      groupByCategory: true,
      sortAlphabetically: true,
      includeMathematicalContext: this.config.includeComments
    });

    // Get file path
    const format = this.getFormatForPlatform(platform);
    const filePath = providers.pathProvider.getFilePath(format, {
      customBaseDirectory: this.config.outputDirectory
    });

    // Validate generated syntax
    const syntaxValidation = providers.formatProvider.validateSyntax(content);

    // Record generation
    this.recordGeneration(platform, allTokens.length, syntaxValidation.valid);

    return {
      platform,
      filePath,
      content,
      format,
      tokenCount: allTokens.length,
      validationStatus: syntaxValidation.valid ? 'valid' : 'invalid',
      validationErrors: syntaxValidation.errors
    };
  }

  /**
   * Convert tokens to platform-specific values using unit provider
   */
  private convertTokensForPlatform(
    tokens: (PrimitiveToken | SemanticToken)[],
    unitProvider: UnitProvider
  ): (PrimitiveToken | SemanticToken)[] {
    return tokens.map(token => {
      if ('baseValue' in token) {
        // Primitive token - convert using unit provider
        const platformValue = unitProvider.convertToken(token);
        return {
          ...token,
          platforms: {
            ...token.platforms,
            [unitProvider.platform]: platformValue
          }
        };
      } else {
        // Semantic token - already has resolved primitive tokens with platform values
        return token;
      }
    });
  }

  /**
   * Get output format for a platform
   */
  private getFormatForPlatform(platform: TargetPlatform): TranslationOutput['format'] {
    switch (platform) {
      case 'web':
        return 'javascript';
      case 'ios':
        return 'swift';
      case 'android':
        return 'kotlin';
      default:
        return 'javascript';
    }
  }

  // ============================================================================
  // Cross-Platform Consistency Validation
  // ============================================================================

  /**
   * Validate cross-platform mathematical consistency
   */
  validateCrossPlatformConsistency(): ValidationResult[] {
    const primitiveTokens = this.primitiveRegistry.query();
    const results: ValidationResult[] = [];

    for (const token of primitiveTokens) {
      const consistencyResult = this.validateTokenConsistency(token);
      results.push(consistencyResult);
    }

    return results;
  }

  /**
   * Validate consistency for a single token across platforms
   */
  private validateTokenConsistency(token: PrimitiveToken): ValidationResult {
    const platforms = ['web', 'ios', 'android'] as const;
    const values: Record<string, number> = {};
    const inconsistencies: string[] = [];

    // Get platform-specific values
    for (const platform of platforms) {
      const platformValue = token.platforms[platform];
      if (typeof platformValue.value === 'number') {
        values[platform] = platformValue.value;
      }
    }

    // Check proportional consistency
    const webValue = values.web;
    const iosValue = values.ios;
    const androidValue = values.android;

    if (webValue && iosValue && androidValue) {
      // For most tokens, web px = iOS pt = Android dp (1:1:1 ratio)
      const tolerance = 0.01; // 1% tolerance for rounding
      
      const webToIosRatio = Math.abs(webValue - iosValue) / webValue;
      const webToAndroidRatio = Math.abs(webValue - androidValue) / webValue;

      if (webToIosRatio > tolerance) {
        inconsistencies.push(`Web-iOS ratio deviation: ${(webToIosRatio * 100).toFixed(2)}%`);
      }

      if (webToAndroidRatio > tolerance) {
        inconsistencies.push(`Web-Android ratio deviation: ${(webToAndroidRatio * 100).toFixed(2)}%`);
      }
    }

    if (inconsistencies.length > 0) {
      return {
        level: 'Warning',
        token: token.name,
        message: 'Cross-platform consistency deviation detected',
        rationale: `Token ${token.name} shows mathematical inconsistencies across platforms: ${inconsistencies.join(', ')}`,
        mathematicalReasoning: 'Cross-platform tokens should maintain proportional relationships within tolerance levels',
        suggestions: [
          'Review unit conversion logic for this token category',
          'Check for platform-specific rounding issues',
          'Verify mathematical relationships are preserved during conversion'
        ]
      };
    }

    return {
      level: 'Pass',
      token: token.name,
      message: 'Cross-platform consistency maintained',
      rationale: `Token ${token.name} maintains mathematical consistency across all platforms`,
      mathematicalReasoning: 'Platform-specific values maintain proportional relationships within acceptable tolerance'
    };
  }

  // ============================================================================
  // Generation History and Analytics
  // ============================================================================

  /**
   * Record a generation event
   */
  private recordGeneration(
    platform: TargetPlatform,
    tokenCount: number,
    success: boolean
  ): void {
    this.generationHistory.push({
      timestamp: new Date(),
      platform,
      tokenCount,
      success
    });
  }

  /**
   * Get generation history
   */
  getGenerationHistory(): typeof this.generationHistory {
    return [...this.generationHistory];
  }

  /**
   * Get generation statistics
   */
  getGenerationStats(): {
    totalGenerations: number;
    successfulGenerations: number;
    failedGenerations: number;
    successRate: number;
    generationsByPlatform: Record<TargetPlatform, number>;
  } {
    const total = this.generationHistory.length;
    const successful = this.generationHistory.filter(g => g.success).length;
    const failed = this.generationHistory.filter(g => !g.success).length;

    const byPlatform: Record<TargetPlatform, number> = {
      web: 0,
      ios: 0,
      android: 0
    };

    for (const generation of this.generationHistory) {
      byPlatform[generation.platform]++;
    }

    return {
      totalGenerations: total,
      successfulGenerations: successful,
      failedGenerations: failed,
      successRate: total > 0 ? successful / total : 1,
      generationsByPlatform: byPlatform
    };
  }

  /**
   * Get last generation time
   */
  getLastGenerationTime(): Date | undefined {
    return this.lastGenerationTime;
  }

  /**
   * Get generated file count
   */
  getGeneratedFileCount(): number {
    return this.generatedFileCount;
  }

  /**
   * Clear generation history
   */
  clearGenerationHistory(): void {
    this.generationHistory = [];
  }

  /**
   * Clear generation cache
   */
  clearGenerationCache(): void {
    this.lastGenerationTime = undefined;
    this.generatedFileCount = 0;
    this.clearGenerationHistory();
  }

  // ============================================================================
  // Configuration Management
  // ============================================================================

  /**
   * Update coordinator configuration
   */
  updateConfig(config: Partial<TranslationCoordinatorConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };

    // Clear cache when configuration changes
    this.clearGenerationCache();
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<TranslationCoordinatorConfig> {
    return { ...this.config };
  }

  /**
   * Get available platforms
   */
  getAvailablePlatforms(): TargetPlatform[] {
    return Array.from(this.platformProviders.keys());
  }

  /**
   * Check if a platform is enabled
   */
  isPlatformEnabled(platform: TargetPlatform): boolean {
    return this.config.enabledPlatforms.includes(platform);
  }

  /**
   * Enable a platform
   */
  enablePlatform(platform: TargetPlatform): void {
    if (!this.config.enabledPlatforms.includes(platform)) {
      this.config.enabledPlatforms.push(platform);
    }
  }

  /**
   * Disable a platform
   */
  disablePlatform(platform: TargetPlatform): void {
    this.config.enabledPlatforms = this.config.enabledPlatforms.filter(p => p !== platform);
  }
}
