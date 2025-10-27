"use strict";
/**
 * Build Error Handler
 *
 * Provides comprehensive error handling and fallback options for build system
 * integration. Ensures clear error messages and graceful degradation when
 * build integration encounters issues.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildErrorHandler = void 0;
exports.createBuildErrorHandler = createBuildErrorHandler;
/**
 * Build error handler
 *
 * Handles errors during build system integration with clear messages,
 * helpful suggestions, and graceful fallback options.
 */
class BuildErrorHandler {
    constructor(fallbackOptions = {}) {
        this.errors = [];
        this.fallbackOptions = {
            strategy: fallbackOptions.strategy || 'use-default',
            defaultPlatform: fallbackOptions.defaultPlatform || 'web',
            enableCache: fallbackOptions.enableCache !== false,
            maxRetries: fallbackOptions.maxRetries || 3,
            customHandler: fallbackOptions.customHandler || (async () => { })
        };
    }
    /**
     * Handle a build error
     */
    handleError(error, context) {
        const buildError = this.normalizeToBuildError(error, context);
        this.errors.push(buildError);
        return buildError;
    }
    /**
     * Attempt to recover from an error
     */
    async recover(error) {
        const actions = [];
        const warnings = [];
        let recovered = false;
        let requiresManualIntervention = false;
        try {
            switch (this.fallbackOptions.strategy) {
                case 'use-default':
                    recovered = await this.recoverWithDefault(error, actions, warnings);
                    break;
                case 'skip-platform':
                    recovered = await this.recoverBySkipping(error, actions, warnings);
                    break;
                case 'use-cache':
                    recovered = await this.recoverFromCache(error, actions, warnings);
                    break;
                case 'manual':
                    requiresManualIntervention = true;
                    warnings.push('Manual intervention required to resolve this error');
                    break;
                case 'abort':
                    throw error.originalError || new Error(error.message);
            }
            // Try custom handler if provided
            if (!recovered && this.fallbackOptions.customHandler) {
                await this.fallbackOptions.customHandler(error);
                actions.push('Executed custom error handler');
                recovered = true;
            }
        }
        catch (recoveryError) {
            warnings.push(`Recovery failed: ${recoveryError instanceof Error ? recoveryError.message : 'Unknown error'}`);
            recovered = false;
        }
        return {
            recovered,
            strategy: this.fallbackOptions.strategy,
            actions,
            warnings,
            requiresManualIntervention
        };
    }
    /**
     * Get all errors
     */
    getErrors() {
        return [...this.errors];
    }
    /**
     * Get errors by severity
     */
    getErrorsBySeverity(severity) {
        return this.errors.filter(e => e.severity === severity);
    }
    /**
     * Get errors by category
     */
    getErrorsByCategory(category) {
        return this.errors.filter(e => e.category === category);
    }
    /**
     * Clear all errors
     */
    clearErrors() {
        this.errors = [];
    }
    /**
     * Format error for display
     */
    formatError(error) {
        const lines = [];
        // Header
        lines.push(`[${error.severity.toUpperCase()}] ${error.code}: ${error.message}`);
        // Context
        if (error.context && Object.keys(error.context).length > 0) {
            lines.push('\nContext:');
            for (const [key, value] of Object.entries(error.context)) {
                lines.push(`  ${key}: ${JSON.stringify(value)}`);
            }
        }
        // Suggestions
        if (error.suggestions.length > 0) {
            lines.push('\nSuggestions:');
            for (const suggestion of error.suggestions) {
                lines.push(`  • ${suggestion}`);
            }
        }
        // Documentation
        if (error.documentation && error.documentation.length > 0) {
            lines.push('\nDocumentation:');
            for (const doc of error.documentation) {
                lines.push(`  • ${doc}`);
            }
        }
        return lines.join('\n');
    }
    /**
     * Create configuration error
     */
    static configurationError(message, config, suggestions) {
        return {
            code: 'BUILD_CONFIG_ERROR',
            message,
            severity: 'error',
            category: 'configuration',
            context: config ? { config } : undefined,
            suggestions: suggestions || [
                'Check your build configuration',
                'Ensure all required fields are provided',
                'Validate configuration against schema'
            ],
            documentation: [
                'https://github.com/3fn/DesignerPunkv2/docs/build-integration.md'
            ]
        };
    }
    /**
     * Create platform error
     */
    static platformError(platform, message, suggestions) {
        return {
            code: 'PLATFORM_ERROR',
            message: `Platform ${platform}: ${message}`,
            severity: 'error',
            category: 'platform',
            context: { platform },
            suggestions: suggestions || [
                `Verify ${platform} platform is properly configured`,
                'Check platform-specific dependencies',
                'Ensure platform files are generated correctly'
            ],
            documentation: [
                `https://github.com/3fn/DesignerPunkv2/docs/platforms/${platform}.md`
            ]
        };
    }
    /**
     * Create generation error
     */
    static generationError(message, tokenCount, suggestions) {
        return {
            code: 'TOKEN_GENERATION_ERROR',
            message,
            severity: 'error',
            category: 'generation',
            context: tokenCount !== undefined ? { tokenCount } : undefined,
            suggestions: suggestions || [
                'Verify token definitions are valid',
                'Check for circular dependencies',
                'Ensure all primitive tokens are defined'
            ]
        };
    }
    /**
     * Create validation error
     */
    static validationError(message, validationErrors, suggestions) {
        return {
            code: 'VALIDATION_ERROR',
            message,
            severity: 'error',
            category: 'validation',
            context: validationErrors ? { validationErrors } : undefined,
            suggestions: suggestions || [
                'Review validation errors',
                'Fix mathematical relationship violations',
                'Ensure tokens follow baseline grid alignment'
            ]
        };
    }
    /**
     * Create warning
     */
    static warning(message, category, suggestions) {
        return {
            code: 'BUILD_WARNING',
            message,
            severity: 'warning',
            category,
            suggestions: suggestions || ['Review the warning and take appropriate action']
        };
    }
    normalizeToBuildError(error, context) {
        if (this.isBuildError(error)) {
            return error;
        }
        return {
            code: 'UNKNOWN_ERROR',
            message: error.message,
            severity: 'error',
            category: 'integration',
            context,
            suggestions: [
                'Check the error message for details',
                'Review build configuration',
                'Consult documentation for troubleshooting'
            ],
            originalError: error
        };
    }
    isBuildError(error) {
        return (typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            'message' in error &&
            'severity' in error &&
            'category' in error);
    }
    async recoverWithDefault(error, actions, warnings) {
        actions.push(`Using default platform: ${this.fallbackOptions.defaultPlatform}`);
        warnings.push(`Falling back to default platform due to: ${error.message}`);
        return true;
    }
    async recoverBySkipping(error, actions, warnings) {
        if (error.context?.platform) {
            actions.push(`Skipping platform: ${error.context.platform}`);
            warnings.push(`Platform ${error.context.platform} skipped due to error`);
            return true;
        }
        return false;
    }
    async recoverFromCache(error, actions, warnings) {
        if (this.fallbackOptions.enableCache) {
            actions.push('Attempting to use cached files');
            warnings.push('Using cached files - may be outdated');
            return true;
        }
        return false;
    }
}
exports.BuildErrorHandler = BuildErrorHandler;
/**
 * Create a build error handler with default options
 */
function createBuildErrorHandler(options) {
    return new BuildErrorHandler(options);
}
//# sourceMappingURL=BuildErrorHandler.js.map