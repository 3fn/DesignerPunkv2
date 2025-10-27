/**
 * Validation Coordinator
 *
 * Coordinates validation services across the token system, managing three-tier
 * validation, usage pattern analysis, and comprehensive validation reporting.
 * Integrates with registries to provide system-wide validation insights.
 */
import { ThreeTierValidator, ThreeTierValidationResult } from '../validators/ThreeTierValidator';
import { PrimitiveTokenRegistry } from '../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../registries/SemanticTokenRegistry';
import type { PrimitiveToken, SemanticToken, ValidationResult } from '../types';
/**
 * Validation coordinator configuration
 */
export interface ValidationCoordinatorConfig {
    strategicFlexibilityThreshold: number;
    primitiveUsageThreshold: number;
    enableUsageTracking: boolean;
}
/**
 * Validation options for token validation
 */
export interface ValidationOptions {
    strictMathematics?: boolean;
    requireCrossPlatformConsistency?: boolean;
    enablePatternAnalysis?: boolean;
    validateReferences?: boolean;
}
/**
 * Comprehensive validation report
 */
export interface ComprehensiveValidationReport {
    summary: {
        totalTokens: number;
        passCount: number;
        warningCount: number;
        errorCount: number;
        overallHealthScore: number;
    };
    results: ThreeTierValidationResult[];
    systemAnalysis: {
        commonIssues: string[];
        criticalErrors: ValidationResult[];
        improvementRecommendations: string[];
        mathematicalConsistencyScore: number;
    };
    performanceMetrics: {
        totalValidationTime: number;
        averageValidationTime: number;
        validationTimeByLevel: Record<string, number>;
    };
    usagePatterns?: {
        strategicFlexibilityUsage: {
            totalUsage: number;
            appropriateUsage: number;
            inappropriateUsage: number;
            usagePercentage: number;
        };
        primitiveVsSemanticUsage: {
            primitiveUsage: number;
            semanticUsage: number;
            primitivePercentage: number;
        };
        categoryUsage: Record<string, number>;
    };
}
/**
 * Validation Coordinator class managing validation services
 */
export declare class ValidationCoordinator {
    private validator;
    private primitiveRegistry;
    private semanticRegistry;
    private config;
    private validationCache;
    constructor(validator: ThreeTierValidator, primitiveRegistry: PrimitiveTokenRegistry, semanticRegistry: SemanticTokenRegistry, config: ValidationCoordinatorConfig);
    /**
     * Validate a single token with comprehensive three-tier validation
     */
    validateToken(token: PrimitiveToken | SemanticToken, options?: ValidationOptions): ValidationResult;
    /**
     * Validate all registered tokens
     */
    validateAllTokens(options?: ValidationOptions): ValidationResult[];
    /**
     * Validate primitive tokens only
     */
    validatePrimitiveTokens(options?: ValidationOptions): ValidationResult[];
    /**
     * Validate semantic tokens only
     */
    validateSemanticTokens(options?: ValidationOptions): ValidationResult[];
    /**
     * Build comprehensive validation context for a token
     */
    private buildValidationContext;
    /**
     * Build usage context for a token
     */
    private buildUsageContext;
    /**
     * Build mathematical context for primitive tokens
     */
    private buildMathematicalContext;
    /**
     * Build system context with registry information
     */
    private buildSystemContext;
    /**
     * Generate comprehensive validation report
     */
    generateValidationReport(options?: ValidationOptions): ComprehensiveValidationReport;
    /**
     * Analyze usage patterns across the token system
     */
    private analyzeUsagePatterns;
    /**
     * Get validation summary for quick health check
     */
    getValidationSummary(): {
        totalTokens: number;
        passCount: number;
        warningCount: number;
        errorCount: number;
        healthScore: number;
        status: 'healthy' | 'warning' | 'critical';
    };
    /**
     * Cache validation result for a token
     */
    private cacheValidationResult;
    /**
     * Get cached validation result if available and not stale
     */
    getCachedValidationResult(tokenName: string, maxAge?: number): ThreeTierValidationResult | null;
    /**
     * Clear validation cache
     */
    clearValidationCache(): void;
    /**
     * Invalidate cache for a specific token
     */
    invalidateCacheFor(tokenName: string): void;
    /**
     * Update coordinator configuration
     */
    updateConfig(config: Partial<ValidationCoordinatorConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): Readonly<ValidationCoordinatorConfig>;
}
//# sourceMappingURL=ValidationCoordinator.d.ts.map