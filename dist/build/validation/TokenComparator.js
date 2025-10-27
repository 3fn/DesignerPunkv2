"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenComparator = void 0;
const CrossPlatformConsistencyValidator_1 = require("../../validators/CrossPlatformConsistencyValidator");
const WebUnitConverter_1 = require("../../providers/WebUnitConverter");
const iOSUnitConverter_1 = require("../../providers/iOSUnitConverter");
const AndroidUnitConverter_1 = require("../../providers/AndroidUnitConverter");
/**
 * Token value comparator
 *
 * Compares token values across platforms using F1 validation for primitive/semantic
 * tokens and custom logic for component tokens.
 */
class TokenComparator {
    constructor(primitiveRegistry, semanticRegistry) {
        this.primitiveRegistry = primitiveRegistry;
        this.semanticRegistry = semanticRegistry;
        this.f1Validator = new CrossPlatformConsistencyValidator_1.CrossPlatformConsistencyValidator();
        // Initialize unit providers for each platform
        this.unitProviders = {
            web: new WebUnitConverter_1.WebUnitConverter(),
            ios: new iOSUnitConverter_1.iOSUnitConverter(),
            android: new AndroidUnitConverter_1.AndroidUnitConverter()
        };
    }
    /**
     * Compare token values across platforms
     *
     * Uses F1's CrossPlatformConsistencyValidator for primitive/semantic tokens
     * and custom comparison logic for component tokens.
     */
    async compareToken(request) {
        const { token, platforms, options = {} } = request;
        // Determine token type
        const tokenType = this.getTokenType(token);
        // For primitive tokens, use F1 validator directly
        if (tokenType === 'primitive') {
            return this.comparePrimitiveToken(token, platforms, options);
        }
        // For semantic tokens, resolve to primitive and use F1 validator
        if (tokenType === 'semantic') {
            return this.compareSemanticToken(token, platforms, options);
        }
        // For component tokens, use custom comparison logic
        return this.compareComponentToken(token, platforms, options);
    }
    /**
     * Compare multiple tokens in batch
     */
    async compareTokens(tokens, platforms, options) {
        const tokenResults = [];
        // Compare each token
        for (const token of tokens) {
            const result = await this.compareToken({ token, platforms, options });
            tokenResults.push(result);
        }
        // Calculate summary statistics
        const totalTokens = tokenResults.length;
        const consistentTokens = tokenResults.filter(r => r.isConsistent).length;
        const inconsistentTokens = totalTokens - consistentTokens;
        const averageConsistencyScore = tokenResults.reduce((sum, result) => sum + result.mathematicalAnalysis.consistencyScore, 0) / totalTokens;
        // Analyze common issues
        const issueFrequency = {};
        const platformIssues = {
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
    async comparePrimitiveToken(token, platforms, options) {
        // Create unit providers for requested platforms
        const platformUnitProviders = {};
        platforms.forEach(platform => {
            platformUnitProviders[platform] = this.unitProviders[platform];
        });
        // Use F1 validator
        const context = {
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
    async compareSemanticToken(token, platforms, options) {
        // Resolve semantic token to primitive
        const primitiveRef = Object.values(token.primitiveReferences)[0];
        const primitiveToken = this.primitiveRegistry.get(primitiveRef);
        if (!primitiveToken) {
            throw new Error(`Cannot compare semantic token '${token.name}': primitive reference '${primitiveRef}' not found`);
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
    async compareComponentToken(token, platforms, options) {
        // Extract platform values from component token
        const platformValues = {};
        platforms.forEach(platform => {
            platformValues[platform] = token.platforms[platform];
        });
        // Analyze mathematical consistency
        const mathematicalAnalysis = this.analyzeComponentTokenConsistency(platformValues, token.baseValue, options);
        // Generate differences
        const differences = this.generateDifferences(platformValues, platforms, mathematicalAnalysis);
        // Generate recommendations
        const recommendations = this.generateComponentTokenRecommendations(token, mathematicalAnalysis, differences);
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
    analyzeComponentTokenConsistency(platformValues, baseValue, options) {
        const platforms = Object.keys(platformValues);
        const proportionalRelationships = {};
        const failedPairs = [];
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
                }
                else {
                    maxDeviation = Math.max(maxDeviation, deviation);
                    failedPairs.push(`${pairKey} (deviation: ${deviation.toFixed(4)}, expected: 0)`);
                }
                // Also check against base value
                const baseDeviation1 = Math.abs(numValue1 - baseValue);
                const baseDeviation2 = Math.abs(numValue2 - baseValue);
                if (baseDeviation1 > tolerance) {
                    failedPairs.push(`${platform1} value (${numValue1}) deviates from base value (${baseValue}) by ${baseDeviation1.toFixed(4)}`);
                }
                if (baseDeviation2 > tolerance) {
                    failedPairs.push(`${platform2} value (${numValue2}) deviates from base value (${baseValue}) by ${baseDeviation2.toFixed(4)}`);
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
    generateDifferences(platformValues, platforms, analysis) {
        const differences = [];
        // Parse failed pairs into differences
        analysis.failedPairs.forEach(failedPair => {
            const match = failedPair.match(/^(\w+)-(\w+)/);
            if (match) {
                const [, platform1, platform2] = match;
                const value1 = platformValues[platform1];
                const value2 = platformValues[platform2];
                if (value1 && value2) {
                    const deviation = typeof value1.value === 'number' && typeof value2.value === 'number'
                        ? Math.abs(value1.value - value2.value)
                        : undefined;
                    differences.push({
                        platforms: [platform1, platform2],
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
    generateComponentTokenRecommendations(token, analysis, differences) {
        const recommendations = [];
        if (analysis.consistencyScore < 0.95) {
            recommendations.push(`Component token '${token.name}' has low consistency score (${(analysis.consistencyScore * 100).toFixed(1)}%)`);
            recommendations.push('Review platform-specific value generation to ensure mathematical consistency');
        }
        if (differences.length > 0) {
            recommendations.push(`Found ${differences.length} platform value differences - ensure all platforms use same base value`);
        }
        if (token.references && token.references.length > 0) {
            recommendations.push(`Component token references primitives: ${token.references.map(r => r.tokenName).join(', ')}`);
            recommendations.push('Consider if primitive tokens could be used directly instead of component token');
        }
        if (token.usage.appropriateUsageRate < 0.8) {
            recommendations.push(`Component token usage rate (${(token.usage.appropriateUsageRate * 100).toFixed(1)}%) is below 80% threshold`);
            recommendations.push('Review usage patterns to ensure component token is being used appropriately');
        }
        return recommendations;
    }
    /**
     * Calculate tolerance for component token
     */
    calculateToleranceForComponentToken(token, options) {
        const baseTolerance = 0.01; // 1% tolerance for component tokens
        return options.toleranceMultiplier
            ? baseTolerance * options.toleranceMultiplier
            : baseTolerance;
    }
    /**
     * Adapt F1 validation result to build context format
     */
    adaptF1Result(f1Result, tokenType, platforms) {
        // Convert F1 platform values to build context format
        const platformValues = {};
        platforms.forEach(platform => {
            const f1Value = f1Result.platformValues[platform];
            platformValues[platform] = {
                value: f1Value.value,
                unit: f1Value.unit,
                token: f1Result.tokenName
            };
        });
        // Generate differences from F1 failed pairs
        const differences = this.generateDifferences(platformValues, platforms, f1Result.mathematicalAnalysis);
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
    getTokenType(token) {
        if ('component' in token) {
            return 'component';
        }
        if ('primitiveReferences' in token) {
            return 'semantic';
        }
        return 'primitive';
    }
}
exports.TokenComparator = TokenComparator;
//# sourceMappingURL=TokenComparator.js.map