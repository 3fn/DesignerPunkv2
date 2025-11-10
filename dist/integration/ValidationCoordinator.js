"use strict";
/**
 * Validation Coordinator
 *
 * Coordinates validation services across the token system, managing three-tier
 * validation, usage pattern analysis, and comprehensive validation reporting.
 * Integrates with registries to provide system-wide validation insights.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationCoordinator = void 0;
const types_1 = require("../types");
/**
 * Validation Coordinator class managing validation services
 */
class ValidationCoordinator {
    constructor(validator, primitiveRegistry, semanticRegistry, config) {
        this.validationCache = new Map();
        this.validator = validator;
        this.primitiveRegistry = primitiveRegistry;
        this.semanticRegistry = semanticRegistry;
        this.config = config;
    }
    // ============================================================================
    // Token Validation
    // ============================================================================
    /**
     * Validate a single token with comprehensive three-tier validation
     *
     * This method performs validation only and does not register the token.
     * The caller is responsible for registering the token after successful validation.
     *
     * @param token - Token to validate
     * @param options - Validation options
     * @returns Validation result indicating whether the token is valid
     */
    validateToken(token, options = {}) {
        const context = this.buildValidationContext(token, options);
        const result = this.validator.validate(context);
        // Cache validation result
        this.cacheValidationResult(token.name, result);
        return result.primaryResult;
    }
    /**
     * Validate all registered tokens
     *
     * This method validates all tokens currently in the registries.
     * It does not perform registration - tokens are already registered.
     *
     * @param options - Validation options
     * @returns Array of validation results for all tokens
     */
    validateAllTokens(options = {}) {
        const allTokens = [
            ...this.primitiveRegistry.query(),
            ...this.semanticRegistry.query()
        ];
        return allTokens.map(token => this.validateToken(token, options));
    }
    /**
     * Validate primitive tokens only
     *
     * This method validates all primitive tokens currently in the registry.
     * It does not perform registration - tokens are already registered.
     *
     * @param options - Validation options
     * @returns Array of validation results for primitive tokens
     */
    validatePrimitiveTokens(options = {}) {
        const primitiveTokens = this.primitiveRegistry.query();
        return primitiveTokens.map(token => this.validateToken(token, options));
    }
    /**
     * Validate semantic tokens only
     *
     * This method validates all semantic tokens currently in the registry.
     * It does not perform registration - tokens are already registered.
     *
     * @param options - Validation options
     * @returns Array of validation results for semantic tokens
     */
    validateSemanticTokens(options = {}) {
        const semanticTokens = this.semanticRegistry.query();
        return semanticTokens.map(token => this.validateToken(token, options));
    }
    // ============================================================================
    // Validation Context Building
    // ============================================================================
    /**
     * Build comprehensive validation context for a token
     */
    buildValidationContext(token, options) {
        const isPrimitive = 'baseValue' in token;
        const context = {
            token,
            usageContext: this.buildUsageContext(token),
            mathematicalContext: isPrimitive ? this.buildMathematicalContext(token) : undefined,
            systemContext: this.buildSystemContext(),
            options: {
                enabledLevels: ['Pass', 'Warning', 'Error'],
                strictMathematics: options.strictMathematics ?? true,
                requireCrossPlatformConsistency: options.requireCrossPlatformConsistency ?? true,
                enablePatternAnalysis: options.enablePatternAnalysis ?? this.config.enableUsageTracking,
                validateReferences: options.validateReferences ?? true,
                checkCircularDependencies: true,
                strategicFlexibilityThreshold: this.config.strategicFlexibilityThreshold,
                primitiveUsageThreshold: this.config.primitiveUsageThreshold
            }
        };
        return context;
    }
    /**
     * Build usage context for a token
     */
    buildUsageContext(token) {
        // In a real implementation, this would track actual usage across the codebase
        // For now, we provide basic context
        return {
            component: 'system',
            property: token.category,
            metadata: {
                tokenType: 'baseValue' in token ? 'primitive' : 'semantic'
            }
        };
    }
    /**
     * Build mathematical context for primitive tokens
     */
    buildMathematicalContext(token) {
        return {
            expectedRelationship: token.mathematicalRelationship,
            actualRelationship: token.mathematicalRelationship,
            baselineGridRequirement: {
                required: token.baselineGridAlignment,
                gridUnit: 8,
                expectedAlignment: token.baselineGridAlignment,
                actualAlignment: token.baseValue % 8 === 0 || token.isStrategicFlexibility
            },
            familyFoundation: {
                category: token.category,
                baseValue: token.familyBaseValue,
                expectedProgression: `Based on ${token.familyBaseValue}`,
                actualProgression: token.mathematicalRelationship
            }
        };
    }
    /**
     * Build system context with registry information
     */
    buildSystemContext() {
        const primitiveTokens = this.primitiveRegistry.query();
        const semanticTokens = this.semanticRegistry.query();
        const primitiveStats = this.primitiveRegistry.getStats();
        // Calculate strategic flexibility stats
        const strategicFlexibilityTokens = primitiveTokens.filter(t => t.isStrategicFlexibility);
        const strategicFlexibilityStats = {
            totalUsage: strategicFlexibilityTokens.length,
            appropriateUsage: strategicFlexibilityTokens.length, // Assume appropriate for now
            inappropriateUsage: 0,
            usagePercentage: primitiveStats.strategicFlexibilityPercentage
        };
        // Calculate family usage patterns
        const familyUsagePatterns = {};
        for (const category of Object.values(types_1.TokenCategory)) {
            const primitiveCount = primitiveTokens.filter(t => t.category === category).length;
            const semanticCount = semanticTokens.filter(t => t.category === category).length;
            familyUsagePatterns[category] = {
                primitiveUsage: primitiveCount,
                semanticUsage: semanticCount,
                totalUsage: primitiveCount + semanticCount
            };
        }
        return {
            availableSemanticTokens: semanticTokens.map(t => t.name),
            availablePrimitiveTokens: primitiveTokens.map(t => t.name),
            strategicFlexibilityStats,
            familyUsagePatterns
        };
    }
    // ============================================================================
    // Validation Reporting
    // ============================================================================
    /**
     * Generate comprehensive validation report
     */
    generateValidationReport(options = {}) {
        const allTokens = [
            ...this.primitiveRegistry.query(),
            ...this.semanticRegistry.query()
        ];
        const contexts = allTokens.map(token => this.buildValidationContext(token, options));
        const report = this.validator.generateValidationReport(contexts);
        // Add usage pattern analysis if enabled
        let usagePatterns;
        if (this.config.enableUsageTracking) {
            usagePatterns = this.analyzeUsagePatterns();
        }
        return {
            ...report,
            usagePatterns
        };
    }
    /**
     * Analyze usage patterns across the token system
     */
    analyzeUsagePatterns() {
        const primitiveTokens = this.primitiveRegistry.query();
        const semanticTokens = this.semanticRegistry.query();
        const primitiveStats = this.primitiveRegistry.getStats();
        // Strategic flexibility usage
        const strategicFlexibilityTokens = primitiveTokens.filter(t => t.isStrategicFlexibility);
        const strategicFlexibilityUsage = {
            totalUsage: strategicFlexibilityTokens.length,
            appropriateUsage: strategicFlexibilityTokens.length, // Assume appropriate for now
            inappropriateUsage: 0,
            usagePercentage: primitiveStats.strategicFlexibilityPercentage
        };
        // Primitive vs semantic usage
        const totalTokens = primitiveTokens.length + semanticTokens.length;
        const primitiveVsSemanticUsage = {
            primitiveUsage: primitiveTokens.length,
            semanticUsage: semanticTokens.length,
            primitivePercentage: totalTokens > 0 ? (primitiveTokens.length / totalTokens) * 100 : 0
        };
        // Category usage
        const categoryUsage = {};
        for (const category of Object.values(types_1.TokenCategory)) {
            const count = primitiveTokens.filter(t => t.category === category).length;
            categoryUsage[category] = count;
        }
        return {
            strategicFlexibilityUsage,
            primitiveVsSemanticUsage,
            categoryUsage
        };
    }
    /**
     * Get validation summary for quick health check
     */
    getValidationSummary() {
        const results = this.validateAllTokens();
        const totalTokens = results.length;
        const passCount = results.filter(r => r.level === 'Pass').length;
        const warningCount = results.filter(r => r.level === 'Warning').length;
        const errorCount = results.filter(r => r.level === 'Error').length;
        const healthScore = totalTokens > 0 ? (passCount + warningCount * 0.5) / totalTokens : 1;
        let status = 'healthy';
        if (errorCount > 0 || healthScore < 0.5) {
            status = 'critical';
        }
        else if (warningCount > 0 || healthScore < 0.8) {
            status = 'warning';
        }
        return {
            totalTokens,
            passCount,
            warningCount,
            errorCount,
            healthScore,
            status
        };
    }
    // ============================================================================
    // Validation Cache Management
    // ============================================================================
    /**
     * Cache validation result for a token
     */
    cacheValidationResult(tokenName, result) {
        this.validationCache.set(tokenName, {
            result,
            timestamp: new Date()
        });
    }
    /**
     * Get cached validation result if available and not stale
     */
    getCachedValidationResult(tokenName, maxAge = 60000) {
        const cached = this.validationCache.get(tokenName);
        if (!cached) {
            return null;
        }
        const age = Date.now() - cached.timestamp.getTime();
        if (age > maxAge) {
            this.validationCache.delete(tokenName);
            return null;
        }
        return cached.result;
    }
    /**
     * Clear validation cache
     */
    clearValidationCache() {
        this.validationCache.clear();
    }
    /**
     * Invalidate cache for a specific token
     */
    invalidateCacheFor(tokenName) {
        this.validationCache.delete(tokenName);
    }
    // ============================================================================
    // Configuration Management
    // ============================================================================
    /**
     * Update coordinator configuration
     */
    updateConfig(config) {
        this.config = {
            ...this.config,
            ...config
        };
        // Clear cache when configuration changes
        this.clearValidationCache();
    }
    /**
     * Get current configuration
     */
    getConfig() {
        return { ...this.config };
    }
}
exports.ValidationCoordinator = ValidationCoordinator;
//# sourceMappingURL=ValidationCoordinator.js.map