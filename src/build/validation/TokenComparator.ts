/**
 * Token Value Comparator
 * 
 * Compares token values across platforms to ensure mathematical consistency.
 * Leverages F1's CrossPlatformConsistencyValidator for primitive and semantic tokens,
 * and implements F2-specific comparison for component tokens.
 * 
 * Integration with F1:
 * - Uses CrossPlatformConsistencyValidator for primitive/semantic token comparison
 * - Adapts DetailedConsistencyResult format for build context
 * - Extends comparison logic to handle component tokens
 */

import { PrimitiveToken } from '../../types/PrimitiveToken';
import { SemanticToken } from '../../types/SemanticToken';
import { 
  CrossPlatformConsistencyValidator, 
  DetailedConsistencyResult,
  CrossPlatformValidationContext 
} from '../../validators/CrossPlatformConsistencyValidator';
import { UnitProvider } from '../../providers/UnitProvider';
import { WebUnitConverter } from '../../providers/WebUnitConverter';
import { iOSUnitConverter } from '../../providers/iOSUnitConverter';
import { AndroidUnitConverter } from '../../providers/AndroidUnitConverter';
import { ComponentToken } from '../tokens/ComponentToken';
import { Platform, PlatformValue } from '../tokens/types';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';

/**
 * Token comparison request
 */
export interface TokenComparisonRequest {
  /** Token to compare (primitive, semantic, or component) */
  token: PrimitiveToken | SemanticToken | ComponentToken;
  
  /** Platforms to compare across */
  platforms: Platform[];
  
  /** Comparison options */
  options?: TokenComparisonOptions;
}

/**
 * Token comparison options
 */
export interface TokenComparisonOptions {
  /** Use relative tolerance for large values */
  useRelativeTolerance?: boolean;
  
  /** Strict mode - fail on any inconsistency */
  strictMode?: boolean;
  
  /** Custom tolerance multiplier */
  toleranceMultiplier?: number;
  
  /** Handle platform constraints */
  handleConstraints?: boolean;
}

/**
 * Token comparison result
 * 
 * Adapts F1's DetailedConsistencyResult format for build context
 */
export interface TokenComparisonResult {
  /** Token name being compared */
  tokenName: string;
  
  /** Token type (primitive, semantic, component) */
  tokenType: 'primitive' | 'semantic' | 'component';
  
  /** Token category */
  category: string;
  
  /** Platforms compared */
  platforms: Platform[];
  
  /** Whether values are consistent across platforms */
  isConsistent: boolean;
  
  /** Platform-specific values */
  platformValues: Record<Platform, PlatformValue>;
  
  /** Specific differences found */
  differences: TokenValueDifference[];
  
  /** Mathematical analysis */
  mathematicalAnalysis: {
    /** Proportional relationships between platforms */
    proportionalRelationships: Record<string, number>;
    
    /** Maximum deviation found */
    maxDeviation: number;
    
    /** Platform pairs that failed consistency */
    failedPairs: string[];
    
    /** Overall consistency score (0-1) */
    consistencyScore: number;
  };
  
  /** Tolerance used for comparison */
  toleranceLevel: number;
  
  /** Recommendations for fixing inconsistencies */
  recommendations: string[];
  
  /** F1 validation result (for primitive/semantic tokens) */
  f1ValidationResult?: DetailedConsistencyResult;
}

/**
 * Token value difference between platforms
 */
export interface TokenValueDifference {
  /** Platform pair with difference */
  platforms: [Platform, Platform];
  
  /** Values being compared */
  values: [PlatformValue, PlatformValue];
  
  /** Numeric deviation (if applicable) */
  deviation?: number;
  
  /** Difference description */
  description: string;
  
  /** Severity of difference */
  severity: 'error' | 'warning' | 'info';
}

/**
 * Batch comparison result for multiple tokens
 */
export interface BatchComparisonResult {
  /** Total tokens compared */
  totalTokens: number;
  
  /** Consistent tokens */
  consistentTokens: number;
  
  /** Inconsistent tokens */
  inconsistentTokens: number;
  
  /** Average consistency score */
  averageConsistencyScore: number;
  
  /** Individual token results */
  tokenResults: TokenComparisonResult[];
  
  /** Common issues across tokens */
  commonIssues: string[];
  
  /** Platform-specific issue counts */
  platformIssues: Record<Platform, number>;
  
  /** Summary by token type */
  byTokenType: {
    primitive: { total: number; consistent: number };
    semantic: { total: number; consistent: number };
    component: { total: number; consistent: number };
  };
}

/**
 * Token value comparator
 * 
 * Compares token values across platforms using F1 validation for primitive/semantic
 * tokens and custom logic for component tokens.
 */
export class TokenComparator {
  private f1Validator: CrossPlatformConsistencyValidator;
  private unitProviders: Record<string, UnitProvider>;

  constructor(
    private primitiveRegistry: PrimitiveTokenRegistry,
    private semanticRegistry: SemanticTokenRegistry
  ) {
    this.f1Validator = new CrossPlatformConsistencyValidator();
    
    // Initialize unit providers for each platform
    this.unitProviders = {
      web: new WebUnitConverter(),
      ios: new iOSUnitConverter(),
      android: new AndroidUnitConverter()
    };
  }

  /**
   * Compare token values across platforms
   * 
   * Uses F1's CrossPlatformConsistencyValidator for primitive/semantic tokens
   * and custom comparison logic for component tokens.
   */
  async compareToken(request: TokenComparisonRequest): Promise<TokenComparisonResult> {
    const { token, platforms, options = {} } = request;

    // Determine token type
    const tokenType = this.getTokenType(token);

    // For primitive tokens, use F1 validator directly
    if (tokenType === 'primitive') {
      return this.comparePrimitiveToken(token as PrimitiveToken, platforms, options);
    }

    // For semantic tokens, resolve to primitive and use F1 validator
    if (tokenType === 'semantic') {
      return this.compareSemanticToken(token as SemanticToken, platforms, options);
    }

    // For component tokens, use custom comparison logic
    return this.compareComponentToken(token as ComponentToken, platforms, options);
  }

  /**
   * Compare multiple tokens in batch
   */
  async compareTokens(
    tokens: (PrimitiveToken | SemanticToken | ComponentToken)[],
    platforms: Platform[],
    options?: TokenComparisonOptions
  ): Promise<BatchComparisonResult> {
    const tokenResults: TokenComparisonResult[] = [];
    
    // Compare each token
    for (const token of tokens) {
      const result = await this.compareToken({ token, platforms, options });
      tokenResults.push(result);
    }

    // Calculate summary statistics
    const totalTokens = tokenResults.length;
    const consistentTokens = tokenResults.filter(r => r.isConsistent).length;
    const inconsistentTokens = totalTokens - consistentTokens;

    const averageConsistencyScore = tokenResults.reduce(
      (sum, result) => sum + result.mathematicalAnalysis.consistencyScore,
      0
    ) / totalTokens;

    // Analyze common issues
    const issueFrequency: Record<string, number> = {};
    const platformIssues: Record<Platform, number> = {
      ios: 0,
      android: 0,
      web: 0
    };

    tokenResults.forEach(result => {
      result.differences.forEach(diff => {
        diff.platforms.forEach(platform => {
          platformIssues[platform] = (platformIssues[platform] || 0) + 1;
        });
        
        issueFrequency[diff.description] = (issueFrequency[diff.description] || 0) + 1;
      });
    });

    const commonIssues = Object.entries(issueFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([issue]) => issue);

    // Summarize by token type
    const byTokenType = {
      primitive: { total: 0, consistent: 0 },
      semantic: { total: 0, consistent: 0 },
      component: { total: 0, consistent: 0 }
    };

    tokenResults.forEach(result => {
      byTokenType[result.tokenType].total++;
      if (result.isConsistent) {
        byTokenType[result.tokenType].consistent++;
      }
    });

    return {
      totalTokens,
      consistentTokens,
      inconsistentTokens,
      averageConsistencyScore,
      tokenResults,
      commonIssues,
      platformIssues,
      byTokenType
    };
  }

  /**
   * Compare primitive token using F1 validator
   */
  private async comparePrimitiveToken(
    token: PrimitiveToken,
    platforms: Platform[],
    options: TokenComparisonOptions
  ): Promise<TokenComparisonResult> {
    // Create unit providers for requested platforms
    const platformUnitProviders: Record<string, UnitProvider> = {};
    platforms.forEach(platform => {
      platformUnitProviders[platform] = this.unitProviders[platform];
    });

    // Use F1 validator
    const context: CrossPlatformValidationContext = {
      token,
      unitProviders: platformUnitProviders,
      handleConstraints: options.handleConstraints ?? true,
      options: {
        useRelativeTolerance: options.useRelativeTolerance,
        strictMode: options.strictMode,
        toleranceMultiplier: options.toleranceMultiplier
      }
    };

    const f1Result = await this.f1Validator.validateToken(context);

    // Convert F1 result to build context format
    return this.adaptF1Result(f1Result, 'primitive', platforms);
  }

  /**
   * Compare semantic token by resolving to primitive
   */
  private async compareSemanticToken(
    token: SemanticToken,
    platforms: Platform[],
    options: TokenComparisonOptions
  ): Promise<TokenComparisonResult> {
    // Resolve semantic token to primitive
    const primitiveRef = Object.values(token.primitiveReferences)[0];
    const primitiveToken = this.primitiveRegistry.get(primitiveRef);

    if (!primitiveToken) {
      throw new Error(
        `Cannot compare semantic token '${token.name}': primitive reference '${primitiveRef}' not found`
      );
    }

    // Compare the underlying primitive token
    const primitiveResult = await this.comparePrimitiveToken(primitiveToken, platforms, options);

    // Update result to reflect semantic token
    return {
      ...primitiveResult,
      tokenName: token.name,
      tokenType: 'semantic',
      category: token.category,
      recommendations: [
        ...primitiveResult.recommendations,
        `Semantic token '${token.name}' references primitive '${primitiveRef}'`
      ]
    };
  }

  /**
   * Compare component token using custom logic
   */
  private async compareComponentToken(
    token: ComponentToken,
    platforms: Platform[],
    options: TokenComparisonOptions
  ): Promise<TokenComparisonResult> {
    // Extract platform values from component token
    const platformValues: Record<Platform, PlatformValue> = {} as Record<Platform, PlatformValue>;
    platforms.forEach(platform => {
      platformValues[platform] = token.platforms[platform];
    });

    // Analyze mathematical consistency
    const mathematicalAnalysis = this.analyzeComponentTokenConsistency(
      platformValues,
      token.baseValue,
      options
    );

    // Generate differences
    const differences = this.generateDifferences(platformValues, platforms, mathematicalAnalysis);

    // Generate recommendations
    const recommendations = this.generateComponentTokenRecommendations(
      token,
      mathematicalAnalysis,
      differences
    );

    return {
      tokenName: token.name,
      tokenType: 'component',
      category: token.category,
      platforms,
      isConsistent: mathematicalAnalysis.consistencyScore >= 0.95 && differences.length === 0,
      platformValues,
      differences,
      mathematicalAnalysis,
      toleranceLevel: this.calculateToleranceForComponentToken(token, options),
      recommendations
    };
  }

  /**
   * Analyze mathematical consistency for component token
   */
  private analyzeComponentTokenConsistency(
    platformValues: Record<Platform, PlatformValue>,
    baseValue: number,
    options: TokenComparisonOptions
  ): TokenComparisonResult['mathematicalAnalysis'] {
    const platforms = Object.keys(platformValues) as Platform[];
    const proportionalRelationships: Record<string, number> = {};
    const failedPairs: string[] = [];
    let maxDeviation = 0;
    let totalComparisons = 0;
    let successfulComparisons = 0;

    const tolerance = options.toleranceMultiplier 
      ? 0.01 * options.toleranceMultiplier 
      : 0.01;

    // Compare all platform pairs
    for (let i = 0; i < platforms.length - 1; i++) {
      for (let j = i + 1; j < platforms.length; j++) {
        const platform1 = platforms[i];
        const platform2 = platforms[j];
        const value1 = platformValues[platform1];
        const value2 = platformValues[platform2];

        const pairKey = `${platform1}-${platform2}`;
        totalComparisons++;

        // For component tokens, values should match base value
        const numValue1 = typeof value1.value === 'number' ? value1.value : 0;
        const numValue2 = typeof value2.value === 'number' ? value2.value : 0;

        // Calculate proportional relationship
        const ratio = numValue2 !== 0 ? numValue1 / numValue2 : (numValue1 === 0 ? 1 : Infinity);
        proportionalRelationships[pairKey] = ratio;

        // Check if values match (should be same for component tokens)
        const deviation = Math.abs(numValue1 - numValue2);
        
        if (deviation <= tolerance) {
          successfulComparisons++;
        } else {
          maxDeviation = Math.max(maxDeviation, deviation);
          failedPairs.push(
            `${pairKey} (deviation: ${deviation.toFixed(4)}, expected: 0)`
          );
        }

        // Also check against base value
        const baseDeviation1 = Math.abs(numValue1 - baseValue);
        const baseDeviation2 = Math.abs(numValue2 - baseValue);

        if (baseDeviation1 > tolerance) {
          failedPairs.push(
            `${platform1} value (${numValue1}) deviates from base value (${baseValue}) by ${baseDeviation1.toFixed(4)}`
          );
        }

        if (baseDeviation2 > tolerance) {
          failedPairs.push(
            `${platform2} value (${numValue2}) deviates from base value (${baseValue}) by ${baseDeviation2.toFixed(4)}`
          );
        }
      }
    }

    const consistencyScore = totalComparisons > 0 ? successfulComparisons / totalComparisons : 1.0;

    return {
      proportionalRelationships,
      maxDeviation,
      failedPairs,
      consistencyScore
    };
  }

  /**
   * Generate differences from mathematical analysis
   */
  private generateDifferences(
    platformValues: Record<Platform, PlatformValue>,
    platforms: Platform[],
    analysis: TokenComparisonResult['mathematicalAnalysis']
  ): TokenValueDifference[] {
    const differences: TokenValueDifference[] = [];

    // Parse failed pairs into differences
    analysis.failedPairs.forEach(failedPair => {
      const match = failedPair.match(/^(\w+)-(\w+)/);
      if (match) {
        const [, platform1, platform2] = match;
        const value1 = platformValues[platform1 as Platform];
        const value2 = platformValues[platform2 as Platform];

        if (value1 && value2) {
          const deviation = typeof value1.value === 'number' && typeof value2.value === 'number'
            ? Math.abs(value1.value - value2.value)
            : undefined;

          differences.push({
            platforms: [platform1 as Platform, platform2 as Platform],
            values: [value1, value2],
            deviation,
            description: failedPair,
            severity: deviation && deviation > 1 ? 'error' : 'warning'
          });
        }
      }
    });

    return differences;
  }

  /**
   * Generate recommendations for component token
   */
  private generateComponentTokenRecommendations(
    token: ComponentToken,
    analysis: TokenComparisonResult['mathematicalAnalysis'],
    differences: TokenValueDifference[]
  ): string[] {
    const recommendations: string[] = [];

    if (analysis.consistencyScore < 0.95) {
      recommendations.push(
        `Component token '${token.name}' has low consistency score (${(analysis.consistencyScore * 100).toFixed(1)}%)`
      );
      recommendations.push(
        'Review platform-specific value generation to ensure mathematical consistency'
      );
    }

    if (differences.length > 0) {
      recommendations.push(
        `Found ${differences.length} platform value differences - ensure all platforms use same base value`
      );
    }

    if (token.references && token.references.length > 0) {
      recommendations.push(
        `Component token references primitives: ${token.references.map(r => r.tokenName).join(', ')}`
      );
      recommendations.push(
        'Consider if primitive tokens could be used directly instead of component token'
      );
    }

    if (token.usage.appropriateUsageRate < 0.8) {
      recommendations.push(
        `Component token usage rate (${(token.usage.appropriateUsageRate * 100).toFixed(1)}%) is below 80% threshold`
      );
      recommendations.push(
        'Review usage patterns to ensure component token is being used appropriately'
      );
    }

    return recommendations;
  }

  /**
   * Calculate tolerance for component token
   */
  private calculateToleranceForComponentToken(
    token: ComponentToken,
    options: TokenComparisonOptions
  ): number {
    const baseTolerance = 0.01; // 1% tolerance for component tokens
    return options.toleranceMultiplier 
      ? baseTolerance * options.toleranceMultiplier 
      : baseTolerance;
  }

  /**
   * Adapt F1 validation result to build context format
   */
  private adaptF1Result(
    f1Result: DetailedConsistencyResult,
    tokenType: 'primitive' | 'semantic',
    platforms: Platform[]
  ): TokenComparisonResult {
    // Convert F1 platform values to build context format
    const platformValues: Record<Platform, PlatformValue> = {} as Record<Platform, PlatformValue>;
    platforms.forEach(platform => {
      const f1Value = f1Result.platformValues[platform];
      platformValues[platform] = {
        value: f1Value.value,
        unit: f1Value.unit,
        token: f1Result.tokenName
      };
    });

    // Generate differences from F1 failed pairs
    const differences = this.generateDifferences(
      platformValues,
      platforms,
      f1Result.mathematicalAnalysis
    );

    return {
      tokenName: f1Result.tokenName,
      tokenType,
      category: f1Result.category,
      platforms,
      isConsistent: f1Result.isConsistent,
      platformValues,
      differences,
      mathematicalAnalysis: f1Result.mathematicalAnalysis,
      toleranceLevel: f1Result.toleranceLevel,
      recommendations: f1Result.recommendations,
      f1ValidationResult: f1Result
    };
  }

  /**
   * Determine token type
   */
  private getTokenType(
    token: PrimitiveToken | SemanticToken | ComponentToken
  ): 'primitive' | 'semantic' | 'component' {
    if ('component' in token) {
      return 'component';
    }
    if ('primitiveReferences' in token) {
      return 'semantic';
    }
    return 'primitive';
  }

  /**
   * Validate motion token cross-platform equivalence
   * 
   * Specialized validation for motion tokens:
   * - Duration: web ms = iOS seconds × 1000 = Android ms
   * - Easing: cubic-bezier curves mathematically equivalent
   * - Scale: unitless values identical across platforms
   * 
   * Requirements: 6.8
   */
  validateMotionTokenEquivalence(
    token: PrimitiveToken,
    platforms: Platform[]
  ): {
    valid: boolean;
    message: string;
    details: Record<Platform, any>;
  } {
    const tokenName = token.name;
    const details: Record<Platform, any> = {} as Record<Platform, any>;

    // Extract platform values
    platforms.forEach(platform => {
      details[platform] = token.platforms[platform];
    });

    // Determine motion token type based on name
    if (tokenName.startsWith('duration')) {
      return this.validateDurationEquivalence(token, platforms, details);
    } else if (tokenName.startsWith('easing')) {
      return this.validateEasingEquivalence(token, platforms, details);
    } else if (tokenName.startsWith('scale')) {
      return this.validateScaleEquivalence(token, platforms, details);
    }

    return {
      valid: false,
      message: `Unknown motion token type: ${tokenName}`,
      details
    };
  }

  /**
   * Validate duration token equivalence
   * web ms = iOS seconds × 1000 = Android ms
   */
  private validateDurationEquivalence(
    token: PrimitiveToken,
    platforms: Platform[],
    details: Record<Platform, any>
  ): { valid: boolean; message: string; details: Record<Platform, any> } {
    const webValue = details.web?.value;
    const iosValue = details.ios?.value;
    const androidValue = details.android?.value;

    if (webValue === undefined || iosValue === undefined || androidValue === undefined) {
      return {
        valid: false,
        message: `Missing platform values for duration token ${token.name}`,
        details
      };
    }

    // iOS should be in seconds (web value / 1000)
    const expectedIosValue = webValue / 1000;
    const iosMatches = Math.abs(iosValue - expectedIosValue) < 0.001; // Tolerance for floating point

    // Android should match web (both in milliseconds)
    const androidMatches = webValue === androidValue;

    const valid = iosMatches && androidMatches;

    if (!valid) {
      return {
        valid: false,
        message: `Duration mismatch: web=${webValue}ms, iOS=${iosValue}s (expected ${expectedIosValue}s), Android=${androidValue}ms`,
        details
      };
    }

    return {
      valid: true,
      message: `Duration equivalence verified: ${webValue}ms = ${iosValue}s × 1000 = ${androidValue}ms`,
      details
    };
  }

  /**
   * Validate easing token equivalence
   * Cubic-bezier curves should be mathematically equivalent
   */
  private validateEasingEquivalence(
    token: PrimitiveToken,
    platforms: Platform[],
    details: Record<Platform, any>
  ): { valid: boolean; message: string; details: Record<Platform, any> } {
    const webValue = details.web?.value;
    const iosValue = details.ios?.value;
    const androidValue = details.android?.value;

    if (webValue === undefined || iosValue === undefined || androidValue === undefined) {
      return {
        valid: false,
        message: `Missing platform values for easing token ${token.name}`,
        details
      };
    }

    // All platforms should have the same cubic-bezier string
    const allMatch = webValue === iosValue && iosValue === androidValue;

    if (!allMatch) {
      return {
        valid: false,
        message: `Easing curve mismatch: web="${webValue}", iOS="${iosValue}", Android="${androidValue}"`,
        details
      };
    }

    return {
      valid: true,
      message: `Easing curve equivalence verified: ${webValue}`,
      details
    };
  }

  /**
   * Validate scale token equivalence
   * Unitless values should be identical across platforms
   */
  private validateScaleEquivalence(
    token: PrimitiveToken,
    platforms: Platform[],
    details: Record<Platform, any>
  ): { valid: boolean; message: string; details: Record<Platform, any> } {
    const webValue = details.web?.value;
    const iosValue = details.ios?.value;
    const androidValue = details.android?.value;

    if (webValue === undefined || iosValue === undefined || androidValue === undefined) {
      return {
        valid: false,
        message: `Missing platform values for scale token ${token.name}`,
        details
      };
    }

    // All platforms should have identical scale factors
    const allMatch = webValue === iosValue && iosValue === androidValue;

    if (!allMatch) {
      return {
        valid: false,
        message: `Scale factor mismatch: web=${webValue}, iOS=${iosValue}, Android=${androidValue}`,
        details
      };
    }

    return {
      valid: true,
      message: `Scale factor equivalence verified: ${webValue}`,
      details
    };
  }
}
