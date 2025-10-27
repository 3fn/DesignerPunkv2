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
import { DetailedConsistencyResult } from '../../validators/CrossPlatformConsistencyValidator';
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
        primitive: {
            total: number;
            consistent: number;
        };
        semantic: {
            total: number;
            consistent: number;
        };
        component: {
            total: number;
            consistent: number;
        };
    };
}
/**
 * Token value comparator
 *
 * Compares token values across platforms using F1 validation for primitive/semantic
 * tokens and custom logic for component tokens.
 */
export declare class TokenComparator {
    private primitiveRegistry;
    private semanticRegistry;
    private f1Validator;
    private unitProviders;
    constructor(primitiveRegistry: PrimitiveTokenRegistry, semanticRegistry: SemanticTokenRegistry);
    /**
     * Compare token values across platforms
     *
     * Uses F1's CrossPlatformConsistencyValidator for primitive/semantic tokens
     * and custom comparison logic for component tokens.
     */
    compareToken(request: TokenComparisonRequest): Promise<TokenComparisonResult>;
    /**
     * Compare multiple tokens in batch
     */
    compareTokens(tokens: (PrimitiveToken | SemanticToken | ComponentToken)[], platforms: Platform[], options?: TokenComparisonOptions): Promise<BatchComparisonResult>;
    /**
     * Compare primitive token using F1 validator
     */
    private comparePrimitiveToken;
    /**
     * Compare semantic token by resolving to primitive
     */
    private compareSemanticToken;
    /**
     * Compare component token using custom logic
     */
    private compareComponentToken;
    /**
     * Analyze mathematical consistency for component token
     */
    private analyzeComponentTokenConsistency;
    /**
     * Generate differences from mathematical analysis
     */
    private generateDifferences;
    /**
     * Generate recommendations for component token
     */
    private generateComponentTokenRecommendations;
    /**
     * Calculate tolerance for component token
     */
    private calculateToleranceForComponentToken;
    /**
     * Adapt F1 validation result to build context format
     */
    private adaptF1Result;
    /**
     * Determine token type
     */
    private getTokenType;
}
//# sourceMappingURL=TokenComparator.d.ts.map