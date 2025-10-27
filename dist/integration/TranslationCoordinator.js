"use strict";
/**
 * Translation Coordinator
 *
 * Coordinates translation services to generate platform-specific token files
 * while maintaining cross-platform mathematical consistency. Manages Unit,
 * Format, and Path providers to produce optimized output for each platform.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationCoordinator = void 0;
const WebUnitConverter_1 = require("../providers/WebUnitConverter");
const iOSUnitConverter_1 = require("../providers/iOSUnitConverter");
const AndroidUnitConverter_1 = require("../providers/AndroidUnitConverter");
const WebFormatGenerator_1 = require("../providers/WebFormatGenerator");
const iOSFormatGenerator_1 = require("../providers/iOSFormatGenerator");
const AndroidFormatGenerator_1 = require("../providers/AndroidFormatGenerator");
const WebFileOrganizer_1 = require("../providers/WebFileOrganizer");
const iOSFileOrganizer_1 = require("../providers/iOSFileOrganizer");
const AndroidFileOrganizer_1 = require("../providers/AndroidFileOrganizer");
/**
 * Translation Coordinator class managing cross-platform token generation
 */
class TranslationCoordinator {
    constructor(primitiveRegistry, semanticRegistry, config) {
        this.generationHistory = [];
        this.generatedFileCount = 0;
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
    initializePlatformProviders() {
        // Web providers
        this.platformProviders.set('web', {
            unitProvider: new WebUnitConverter_1.WebUnitConverter(),
            formatProvider: new WebFormatGenerator_1.WebFormatGenerator(),
            pathProvider: new WebFileOrganizer_1.WebFileOrganizer()
        });
        // iOS providers
        this.platformProviders.set('ios', {
            unitProvider: new iOSUnitConverter_1.iOSUnitConverter(),
            formatProvider: new iOSFormatGenerator_1.iOSFormatGenerator(),
            pathProvider: new iOSFileOrganizer_1.iOSFileOrganizer()
        });
        // Android providers
        this.platformProviders.set('android', {
            unitProvider: new AndroidUnitConverter_1.AndroidUnitConverter(),
            formatProvider: new AndroidFormatGenerator_1.AndroidFormatGenerator(),
            pathProvider: new AndroidFileOrganizer_1.AndroidFileOrganizer()
        });
    }
    // ============================================================================
    // Token Translation
    // ============================================================================
    /**
     * Generate platform-specific token files for all enabled platforms
     */
    async generateAllPlatforms() {
        const outputs = [];
        for (const platform of this.config.enabledPlatforms) {
            try {
                const output = await this.generateForPlatform(platform);
                outputs.push(output);
            }
            catch (error) {
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
    async generateForPlatform(platform) {
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
    convertTokensForPlatform(tokens, unitProvider) {
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
            }
            else {
                // Semantic token - already has resolved primitive tokens with platform values
                return token;
            }
        });
    }
    /**
     * Get output format for a platform
     */
    getFormatForPlatform(platform) {
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
    validateCrossPlatformConsistency() {
        const primitiveTokens = this.primitiveRegistry.query();
        const results = [];
        for (const token of primitiveTokens) {
            const consistencyResult = this.validateTokenConsistency(token);
            results.push(consistencyResult);
        }
        return results;
    }
    /**
     * Validate consistency for a single token across platforms
     */
    validateTokenConsistency(token) {
        const platforms = ['web', 'ios', 'android'];
        const values = {};
        const inconsistencies = [];
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
    recordGeneration(platform, tokenCount, success) {
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
    getGenerationHistory() {
        return [...this.generationHistory];
    }
    /**
     * Get generation statistics
     */
    getGenerationStats() {
        const total = this.generationHistory.length;
        const successful = this.generationHistory.filter(g => g.success).length;
        const failed = this.generationHistory.filter(g => !g.success).length;
        const byPlatform = {
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
    getLastGenerationTime() {
        return this.lastGenerationTime;
    }
    /**
     * Get generated file count
     */
    getGeneratedFileCount() {
        return this.generatedFileCount;
    }
    /**
     * Clear generation history
     */
    clearGenerationHistory() {
        this.generationHistory = [];
    }
    /**
     * Clear generation cache
     */
    clearGenerationCache() {
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
    updateConfig(config) {
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
    getConfig() {
        return { ...this.config };
    }
    /**
     * Get available platforms
     */
    getAvailablePlatforms() {
        return Array.from(this.platformProviders.keys());
    }
    /**
     * Check if a platform is enabled
     */
    isPlatformEnabled(platform) {
        return this.config.enabledPlatforms.includes(platform);
    }
    /**
     * Enable a platform
     */
    enablePlatform(platform) {
        if (!this.config.enabledPlatforms.includes(platform)) {
            this.config.enabledPlatforms.push(platform);
        }
    }
    /**
     * Disable a platform
     */
    disablePlatform(platform) {
        this.config.enabledPlatforms = this.config.enabledPlatforms.filter(p => p !== platform);
    }
}
exports.TranslationCoordinator = TranslationCoordinator;
//# sourceMappingURL=TranslationCoordinator.js.map