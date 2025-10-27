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
import type { PrimitiveToken, SemanticToken, ValidationResult, TranslationOutput, TargetPlatform } from './types';
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
export declare class TokenEngine {
    private primitiveRegistry;
    private semanticRegistry;
    private validator;
    private registryCoordinator;
    private validationCoordinator;
    private translationCoordinator;
    private config;
    constructor(config?: TokenEngineConfig);
    /**
     * Register a primitive token with automatic validation
     */
    registerPrimitiveToken(token: PrimitiveToken): ValidationResult;
    /**
     * Register multiple primitive tokens in batch
     */
    registerPrimitiveTokens(tokens: PrimitiveToken[]): ValidationResult[];
    /**
     * Register a semantic token with automatic validation
     */
    registerSemanticToken(token: SemanticToken): ValidationResult;
    /**
     * Register multiple semantic tokens in batch
     */
    registerSemanticTokens(tokens: SemanticToken[]): ValidationResult[];
    /**
     * Get a primitive token by name
     */
    getPrimitiveToken(name: string): PrimitiveToken | undefined;
    /**
     * Get a semantic token by name
     */
    getSemanticToken(name: string): SemanticToken | undefined;
    /**
     * Get all primitive tokens
     */
    getAllPrimitiveTokens(): PrimitiveToken[];
    /**
     * Get all semantic tokens
     */
    getAllSemanticTokens(): SemanticToken[];
    /**
     * Query primitive tokens with filters
     */
    queryPrimitiveTokens(options: Parameters<PrimitiveTokenRegistry['query']>[0]): PrimitiveToken[];
    /**
     * Query semantic tokens with filters
     */
    querySemanticTokens(options: Parameters<SemanticTokenRegistry['query']>[0]): SemanticToken[];
    /**
     * Validate a specific token
     */
    validateToken(token: PrimitiveToken | SemanticToken): ValidationResult;
    /**
     * Validate all registered tokens
     */
    validateAllTokens(): ValidationResult[];
    /**
     * Generate comprehensive validation report
     */
    generateValidationReport(): import("./integration/ValidationCoordinator").ComprehensiveValidationReport;
    /**
     * Generate platform-specific token files for all enabled platforms
     */
    generatePlatformTokens(): Promise<TranslationOutput[]>;
    /**
     * Generate platform-specific token files for a specific platform
     */
    generatePlatformTokensFor(platform: TargetPlatform): Promise<TranslationOutput>;
    /**
     * Validate cross-platform mathematical consistency
     */
    validateCrossPlatformConsistency(): ValidationResult[];
    /**
     * Get comprehensive token engine statistics
     */
    getStats(): TokenEngineStats;
    /**
     * Get system health status
     */
    getHealthStatus(): {
        status: 'healthy' | 'warning' | 'critical';
        issues: string[];
        recommendations: string[];
    };
    /**
     * Update engine configuration
     */
    updateConfig(config: Partial<TokenEngineConfig>): void;
    /**
     * Get current engine configuration
     */
    getConfig(): Readonly<TokenEngineConfig>;
    /**
     * Clear all tokens and reset the engine
     */
    reset(): void;
    /**
     * Export complete token system state
     */
    exportState(): {
        primitiveTokens: PrimitiveToken[];
        semanticTokens: SemanticToken[];
        config: TokenEngineConfig;
        stats: TokenEngineStats;
    };
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
    };
}
//# sourceMappingURL=TokenEngine.d.ts.map