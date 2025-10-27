"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenEngine = void 0;
const PrimitiveTokenRegistry_1 = require("./registries/PrimitiveTokenRegistry");
const SemanticTokenRegistry_1 = require("./registries/SemanticTokenRegistry");
const ThreeTierValidator_1 = require("./validators/ThreeTierValidator");
const RegistryCoordinator_1 = require("./integration/RegistryCoordinator");
const ValidationCoordinator_1 = require("./integration/ValidationCoordinator");
const TranslationCoordinator_1 = require("./integration/TranslationCoordinator");
/**
 * Main TokenEngine class orchestrating all token system components
 */
class TokenEngine {
    constructor(config = {}) {
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
        this.primitiveRegistry = new PrimitiveTokenRegistry_1.PrimitiveTokenRegistry();
        this.semanticRegistry = new SemanticTokenRegistry_1.SemanticTokenRegistry(this.primitiveRegistry);
        this.validator = new ThreeTierValidator_1.ThreeTierValidator();
        // Initialize coordinators
        this.registryCoordinator = new RegistryCoordinator_1.RegistryCoordinator(this.primitiveRegistry, this.semanticRegistry);
        this.validationCoordinator = new ValidationCoordinator_1.ValidationCoordinator(this.validator, this.primitiveRegistry, this.semanticRegistry, {
            strategicFlexibilityThreshold: this.config.strategicFlexibilityThreshold,
            primitiveUsageThreshold: this.config.validationOptions.primitiveUsageThreshold,
            enableUsageTracking: this.config.enableUsageTracking
        });
        this.translationCoordinator = new TranslationCoordinator_1.TranslationCoordinator(this.primitiveRegistry, this.semanticRegistry, {
            enabledPlatforms: this.config.translationConfig.enabledPlatforms,
            outputDirectory: this.config.translationConfig.outputDirectory,
            includeComments: this.config.translationConfig.includeComments
        });
    }
    // ============================================================================
    // Token Registration Methods
    // ============================================================================
    /**
     * Register a primitive token with automatic validation
     */
    registerPrimitiveToken(token) {
        return this.registryCoordinator.registerPrimitive(token, {
            skipValidation: !this.config.autoValidate,
            allowOverwrite: false
        });
    }
    /**
     * Register multiple primitive tokens in batch
     */
    registerPrimitiveTokens(tokens) {
        return this.registryCoordinator.registerPrimitiveBatch(tokens, {
            skipValidation: !this.config.autoValidate,
            allowOverwrite: false
        });
    }
    /**
     * Register a semantic token with automatic validation
     */
    registerSemanticToken(token) {
        return this.registryCoordinator.registerSemantic(token, {
            skipValidation: !this.config.autoValidate,
            allowOverwrite: false
        });
    }
    /**
     * Register multiple semantic tokens in batch
     */
    registerSemanticTokens(tokens) {
        return this.registryCoordinator.registerSemanticBatch(tokens, {
            skipValidation: !this.config.autoValidate,
            allowOverwrite: false
        });
    }
    // ============================================================================
    // Token Retrieval Methods
    // ============================================================================
    /**
     * Get a primitive token by name
     */
    getPrimitiveToken(name) {
        return this.primitiveRegistry.get(name);
    }
    /**
     * Get a semantic token by name
     */
    getSemanticToken(name) {
        return this.semanticRegistry.get(name);
    }
    /**
     * Get all primitive tokens
     */
    getAllPrimitiveTokens() {
        return this.primitiveRegistry.query();
    }
    /**
     * Get all semantic tokens
     */
    getAllSemanticTokens() {
        return this.semanticRegistry.query();
    }
    /**
     * Query primitive tokens with filters
     */
    queryPrimitiveTokens(options) {
        return this.primitiveRegistry.query(options);
    }
    /**
     * Query semantic tokens with filters
     */
    querySemanticTokens(options) {
        return this.semanticRegistry.query(options);
    }
    // ============================================================================
    // Validation Methods
    // ============================================================================
    /**
     * Validate a specific token
     */
    validateToken(token) {
        return this.validationCoordinator.validateToken(token, {
            strictMathematics: this.config.validationOptions.strictMathematics,
            requireCrossPlatformConsistency: this.config.enableCrossPlatformValidation
        });
    }
    /**
     * Validate all registered tokens
     */
    validateAllTokens() {
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
    async generatePlatformTokens() {
        return this.translationCoordinator.generateAllPlatforms();
    }
    /**
     * Generate platform-specific token files for a specific platform
     */
    async generatePlatformTokensFor(platform) {
        return this.translationCoordinator.generateForPlatform(platform);
    }
    /**
     * Validate cross-platform mathematical consistency
     */
    validateCrossPlatformConsistency() {
        return this.translationCoordinator.validateCrossPlatformConsistency();
    }
    // ============================================================================
    // System Health and Statistics
    // ============================================================================
    /**
     * Get comprehensive token engine statistics
     */
    getStats() {
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
                enabledPlatforms: this.config.translationConfig.enabledPlatforms,
                lastGenerationTime: this.translationCoordinator.getLastGenerationTime(),
                generatedFileCount: this.translationCoordinator.getGeneratedFileCount()
            }
        };
    }
    /**
     * Get system health status
     */
    getHealthStatus() {
        const stats = this.getStats();
        const issues = [];
        const recommendations = [];
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
        let status = 'healthy';
        if (stats.validation.errorCount > 0 || stats.validation.mathematicalConsistencyScore < 0.5) {
            status = 'critical';
        }
        else if (issues.length > 0) {
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
    updateConfig(config) {
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
            primitiveUsageThreshold: this.config.validationOptions.primitiveUsageThreshold,
            enableUsageTracking: this.config.enableUsageTracking
        });
        this.translationCoordinator.updateConfig({
            enabledPlatforms: this.config.translationConfig.enabledPlatforms,
            outputDirectory: this.config.translationConfig.outputDirectory,
            includeComments: this.config.translationConfig.includeComments
        });
    }
    /**
     * Get current engine configuration
     */
    getConfig() {
        return { ...this.config };
    }
    // ============================================================================
    // System Management
    // ============================================================================
    /**
     * Clear all tokens and reset the engine
     */
    reset() {
        this.primitiveRegistry.clear();
        this.semanticRegistry.clear();
        this.translationCoordinator.clearGenerationCache();
    }
    /**
     * Export complete token system state
     */
    exportState() {
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
    importState(state) {
        const errors = [];
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
        }
        catch (error) {
            errors.push(`Import failed: ${error instanceof Error ? error.message : String(error)}`);
            return {
                success: false,
                errors
            };
        }
    }
}
exports.TokenEngine = TokenEngine;
//# sourceMappingURL=TokenEngine.js.map