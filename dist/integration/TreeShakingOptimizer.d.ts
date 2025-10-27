/**
 * Tree-Shaking Optimizer
 *
 * Provides tree-shaking optimization support for token files, enabling
 * build systems to eliminate unused tokens and reduce bundle sizes.
 * Generates optimized token exports with proper ESM structure.
 */
import type { PrimitiveToken, SemanticToken } from '../types';
/**
 * Tree-shaking optimization level
 */
export type OptimizationLevel = 'none' | 'basic' | 'aggressive';
/**
 * Tree-shaking configuration
 */
export interface TreeShakingConfig {
    /** Optimization level */
    level?: OptimizationLevel;
    /** Enable side-effect free marking */
    sideEffectFree?: boolean;
    /** Generate individual token exports */
    individualExports?: boolean;
    /** Enable dead code elimination hints */
    deadCodeElimination?: boolean;
    /** Preserve specific tokens even if unused */
    preserve?: string[];
}
/**
 * Optimization result
 */
export interface OptimizationResult {
    /** Original token count */
    originalCount: number;
    /** Optimized token count */
    optimizedCount: number;
    /** Estimated size reduction (bytes) */
    sizeReduction: number;
    /** Optimization level used */
    level: OptimizationLevel;
    /** Tokens that were preserved */
    preserved: string[];
    /** Optimization warnings */
    warnings: string[];
}
/**
 * Export structure for tree-shaking
 */
export interface TreeShakableExport {
    /** Export name */
    name: string;
    /** Export value */
    value: unknown;
    /** Whether this export has side effects */
    hasSideEffects: boolean;
    /** Dependencies on other exports */
    dependencies: string[];
}
/**
 * Tree-shaking optimizer
 *
 * Optimizes token exports for tree-shaking by generating proper ESM structure,
 * marking side-effect free exports, and providing dead code elimination hints.
 */
export declare class TreeShakingOptimizer {
    private config;
    constructor(config?: TreeShakingConfig);
    /**
     * Optimize primitive tokens for tree-shaking
     */
    optimizePrimitiveTokens(tokens: PrimitiveToken[]): OptimizationResult;
    /**
     * Optimize semantic tokens for tree-shaking
     */
    optimizeSemanticTokens(tokens: SemanticToken[]): OptimizationResult;
    /**
     * Generate tree-shakable exports for tokens
     */
    generateTreeShakableExports(primitiveTokens: PrimitiveToken[], semanticTokens: SemanticToken[]): TreeShakableExport[];
    /**
     * Generate package.json sideEffects configuration
     */
    generateSideEffectsConfig(): boolean | string[];
    /**
     * Generate ESM export code for tree-shaking
     */
    generateESMExports(exports: TreeShakableExport[]): string;
    /**
     * Analyze token usage and provide optimization recommendations
     */
    analyzeUsage(usedTokens: string[], availableTokens: (PrimitiveToken | SemanticToken)[]): {
        unusedTokens: string[];
        utilizationRate: number;
        recommendations: string[];
    };
    /**
     * Generate webpack configuration for tree-shaking
     */
    generateWebpackConfig(): Record<string, unknown>;
    /**
     * Generate rollup configuration for tree-shaking
     */
    generateRollupConfig(): Record<string, unknown>;
    private shouldPreserveSemanticToken;
    private estimateSizeReduction;
    private generateWarnings;
}
/**
 * Create a tree-shaking optimizer with default configuration
 */
export declare function createTreeShakingOptimizer(config?: TreeShakingConfig): TreeShakingOptimizer;
//# sourceMappingURL=TreeShakingOptimizer.d.ts.map