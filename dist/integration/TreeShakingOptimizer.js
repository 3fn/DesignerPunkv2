"use strict";
/**
 * Tree-Shaking Optimizer
 *
 * Provides tree-shaking optimization support for token files, enabling
 * build systems to eliminate unused tokens and reduce bundle sizes.
 * Generates optimized token exports with proper ESM structure.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeShakingOptimizer = void 0;
exports.createTreeShakingOptimizer = createTreeShakingOptimizer;
/**
 * Tree-shaking optimizer
 *
 * Optimizes token exports for tree-shaking by generating proper ESM structure,
 * marking side-effect free exports, and providing dead code elimination hints.
 */
class TreeShakingOptimizer {
    constructor(config = {}) {
        this.config = {
            level: config.level || 'basic',
            sideEffectFree: config.sideEffectFree !== false,
            individualExports: config.individualExports !== false,
            deadCodeElimination: config.deadCodeElimination !== false,
            preserve: config.preserve || []
        };
    }
    /**
     * Optimize primitive tokens for tree-shaking
     */
    optimizePrimitiveTokens(tokens) {
        const originalCount = tokens.length;
        const preserved = this.config.preserve;
        let optimizedTokens = tokens;
        // Apply optimization based on level
        if (this.config.level === 'aggressive') {
            optimizedTokens = tokens.filter(token => preserved.includes(token.name) || !token.isStrategicFlexibility);
        }
        const optimizedCount = optimizedTokens.length;
        const sizeReduction = this.estimateSizeReduction(originalCount, optimizedCount);
        return {
            originalCount,
            optimizedCount,
            sizeReduction,
            level: this.config.level,
            preserved,
            warnings: this.generateWarnings(tokens, optimizedTokens)
        };
    }
    /**
     * Optimize semantic tokens for tree-shaking
     */
    optimizeSemanticTokens(tokens) {
        const originalCount = tokens.length;
        const preserved = this.config.preserve;
        const optimizedTokens = tokens.filter(token => preserved.includes(token.name) || this.shouldPreserveSemanticToken(token));
        const optimizedCount = optimizedTokens.length;
        const sizeReduction = this.estimateSizeReduction(originalCount, optimizedCount);
        return {
            originalCount,
            optimizedCount,
            sizeReduction,
            level: this.config.level,
            preserved,
            warnings: this.generateWarnings(tokens, optimizedTokens)
        };
    }
    /**
     * Generate tree-shakable exports for tokens
     */
    generateTreeShakableExports(primitiveTokens, semanticTokens) {
        const exports = [];
        // Generate individual primitive token exports
        if (this.config.individualExports) {
            for (const token of primitiveTokens) {
                exports.push({
                    name: token.name,
                    value: token,
                    hasSideEffects: false,
                    dependencies: []
                });
            }
            // Generate individual semantic token exports
            for (const token of semanticTokens) {
                exports.push({
                    name: token.name,
                    value: token,
                    hasSideEffects: false,
                    dependencies: Object.values(token.primitiveReferences)
                });
            }
        }
        else {
            // Generate grouped exports
            exports.push({
                name: 'primitiveTokens',
                value: primitiveTokens,
                hasSideEffects: false,
                dependencies: []
            });
            exports.push({
                name: 'semanticTokens',
                value: semanticTokens,
                hasSideEffects: false,
                dependencies: primitiveTokens.map(t => t.name)
            });
        }
        return exports;
    }
    /**
     * Generate package.json sideEffects configuration
     */
    generateSideEffectsConfig() {
        if (!this.config.sideEffectFree) {
            return true; // Has side effects
        }
        // Mark all token files as side-effect free
        return false;
    }
    /**
     * Generate ESM export code for tree-shaking
     */
    generateESMExports(exports) {
        const lines = [];
        // Add header comment
        lines.push('/**');
        lines.push(' * Tree-shakable token exports');
        lines.push(' * @module tokens');
        lines.push(' * @sideEffects false');
        lines.push(' */');
        lines.push('');
        // Generate individual exports
        for (const exp of exports) {
            if (this.config.deadCodeElimination) {
                lines.push(`/* #__PURE__ */`);
            }
            lines.push(`export const ${exp.name} = ${JSON.stringify(exp.value, null, 2)};`);
            lines.push('');
        }
        return lines.join('\n');
    }
    /**
     * Analyze token usage and provide optimization recommendations
     */
    analyzeUsage(usedTokens, availableTokens) {
        const availableNames = new Set(availableTokens.map(t => t.name));
        const usedNames = new Set(usedTokens);
        const unusedTokens = Array.from(availableNames).filter(name => !usedNames.has(name));
        const utilizationRate = usedNames.size / availableNames.size;
        const recommendations = [];
        if (utilizationRate < 0.3) {
            recommendations.push('Low token utilization detected (<30%). Consider using individual token imports to reduce bundle size.');
        }
        if (unusedTokens.length > 50) {
            recommendations.push(`${unusedTokens.length} unused tokens detected. Enable aggressive tree-shaking to eliminate them.`);
        }
        if (this.config.level === 'none') {
            recommendations.push('Tree-shaking is disabled. Enable at least basic optimization to reduce bundle size.');
        }
        return {
            unusedTokens,
            utilizationRate,
            recommendations
        };
    }
    /**
     * Generate webpack configuration for tree-shaking
     */
    generateWebpackConfig() {
        return {
            optimization: {
                usedExports: true,
                sideEffects: this.config.sideEffectFree,
                providedExports: true
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        sideEffects: false
                    }
                ]
            }
        };
    }
    /**
     * Generate rollup configuration for tree-shaking
     */
    generateRollupConfig() {
        return {
            treeshake: {
                moduleSideEffects: !this.config.sideEffectFree,
                propertyReadSideEffects: false,
                unknownGlobalSideEffects: false
            }
        };
    }
    shouldPreserveSemanticToken(token) {
        // Always preserve commonly used semantic tokens
        const commonTokens = ['color.primary', 'color.error', 'typography.body', 'space.normal'];
        return commonTokens.includes(token.name);
    }
    estimateSizeReduction(originalCount, optimizedCount) {
        // Rough estimate: ~100 bytes per token
        const bytesPerToken = 100;
        return (originalCount - optimizedCount) * bytesPerToken;
    }
    generateWarnings(original, optimized) {
        const warnings = [];
        const removed = original.length - optimized.length;
        if (removed > 0 && this.config.level === 'aggressive') {
            warnings.push(`Aggressive optimization removed ${removed} tokens. Ensure this doesn't break functionality.`);
        }
        return warnings;
    }
}
exports.TreeShakingOptimizer = TreeShakingOptimizer;
/**
 * Create a tree-shaking optimizer with default configuration
 */
function createTreeShakingOptimizer(config) {
    return new TreeShakingOptimizer(config);
}
//# sourceMappingURL=TreeShakingOptimizer.js.map