"use strict";
/**
 * Build Orchestrator Implementation
 *
 * Main orchestrator for coordinating platform-specific builds.
 * Manages configuration validation, platform selection, build execution,
 * and status tracking.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildOrchestrator = void 0;
const BuildConfig_1 = require("./types/BuildConfig");
const Platform_1 = require("./types/Platform");
const TokenFileGenerator_1 = require("../generators/TokenFileGenerator");
const tokens_1 = require("../tokens");
const semantic_1 = require("../tokens/semantic");
const PrimitiveToken_1 = require("../types/PrimitiveToken");
const SemanticTokenValidator_1 = require("../validators/SemanticTokenValidator");
const PrimitiveTokenRegistry_1 = require("../registries/PrimitiveTokenRegistry");
const SemanticTokenRegistry_1 = require("../registries/SemanticTokenRegistry");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/**
 * Build orchestrator implementation
 *
 * Coordinates the entire build process across multiple platforms,
 * managing configuration, execution, and validation.
 */
class BuildOrchestrator {
    constructor() {
        this.config = { ...BuildConfig_1.DEFAULT_BUILD_CONFIG };
        this.status = this.createInitialStatus();
        this.results = [];
        this.cancelled = false;
        this.tokenGenerator = new TokenFileGenerator_1.TokenFileGenerator();
    }
    /**
     * Configure the build system with specified options
     */
    configure(config) {
        // Validate configuration
        const validation = this.validateConfig(config);
        if (!validation.valid) {
            const errorMessages = validation.errors.join('\n');
            throw new Error(`Invalid build configuration:\n${errorMessages}`);
        }
        // Store configuration
        this.config = { ...config };
        // Update status
        this.status.phase = 'configuring';
        this.status.currentOperation = 'Configuration validated';
    }
    /**
     * Execute builds for specified platforms
     */
    async build(platforms) {
        // Reset state for new build
        this.reset();
        this.results = [];
        this.cancelled = false;
        // Validate platforms
        const invalidPlatforms = platforms.filter(p => !['ios', 'android', 'web'].includes(p));
        if (invalidPlatforms.length > 0) {
            throw new Error(`Invalid platforms specified: ${invalidPlatforms.join(', ')}`);
        }
        if (platforms.length === 0) {
            throw new Error('No platforms specified for build');
        }
        // Update status
        this.status.phase = 'building';
        this.status.activePlatforms = [...platforms];
        this.status.startTime = new Date();
        try {
            // Execute builds based on parallel/sequential configuration
            if (this.config.parallel) {
                this.results = await this.buildParallel(platforms);
            }
            else {
                this.results = await this.buildSequential(platforms);
            }
            // Update final status
            this.status.phase = 'complete';
            this.status.endTime = new Date();
            this.status.progress = 100;
            this.status.activePlatforms = [];
            this.status.completedPlatforms = this.results
                .filter(r => r.success)
                .map(r => r.platform);
            this.status.failedPlatforms = this.results
                .filter(r => !r.success)
                .map(r => r.platform);
            return this.results;
        }
        catch (error) {
            // Handle build failure
            this.status.phase = 'failed';
            this.status.endTime = new Date();
            this.status.activePlatforms = [];
            throw error;
        }
    }
    /**
     * Validate build configuration
     */
    validateConfig(config) {
        const errors = [];
        const warnings = [];
        // Validate platforms
        if (!config.platforms || config.platforms.length === 0) {
            errors.push('At least one platform must be specified');
        }
        else {
            const invalidPlatforms = config.platforms.filter(p => !['ios', 'android', 'web'].includes(p));
            if (invalidPlatforms.length > 0) {
                errors.push(`Invalid platforms: ${invalidPlatforms.join(', ')}. ` +
                    `Valid platforms are: ios, android, web`);
            }
        }
        // Validate build mode
        if (!['development', 'production'].includes(config.mode)) {
            errors.push(`Invalid build mode: ${config.mode}. ` +
                `Valid modes are: development, production`);
        }
        // Validate output directory
        if (!config.outputDir || config.outputDir.trim() === '') {
            errors.push('Output directory must be specified');
        }
        else {
            // Check if output directory path is valid
            try {
                const resolvedPath = path.resolve(config.outputDir);
                if (!path.isAbsolute(resolvedPath) && !resolvedPath.startsWith('.')) {
                    warnings.push(`Output directory "${config.outputDir}" will be resolved relative to current directory`);
                }
            }
            catch (error) {
                errors.push(`Invalid output directory path: ${config.outputDir}`);
            }
        }
        // Validate platform-specific options
        if (config.platforms.includes('ios') && config.ios) {
            const iosErrors = this.validateiOSOptions(config.ios);
            errors.push(...iosErrors);
        }
        if (config.platforms.includes('android') && config.android) {
            const androidErrors = this.validateAndroidOptions(config.android);
            errors.push(...androidErrors);
        }
        if (config.platforms.includes('web') && config.web) {
            const webErrors = this.validateWebOptions(config.web);
            errors.push(...webErrors);
        }
        // Validate validation options
        if (!config.validation) {
            warnings.push('No validation options specified, using defaults');
        }
        // Production mode warnings
        if (config.mode === 'production') {
            if (config.sourceMaps) {
                warnings.push('Source maps enabled in production mode. ' +
                    'Consider disabling for smaller bundle sizes.');
            }
            if (!config.minify) {
                warnings.push('Minification disabled in production mode. ' +
                    'Consider enabling for smaller bundle sizes.');
            }
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }
    /**
     * Get current build status and progress
     */
    getStatus() {
        return { ...this.status };
    }
    /**
     * Get aggregated build results summary
     */
    getSummary() {
        if (this.results.length === 0) {
            return null;
        }
        const successCount = this.results.filter(r => r.success).length;
        const failureCount = this.results.filter(r => !r.success).length;
        const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
        const allWarnings = this.results.flatMap(r => r.warnings);
        const allErrors = this.results.flatMap(r => r.errors);
        let status;
        if (failureCount === 0) {
            status = 'success';
        }
        else if (successCount === 0) {
            status = 'failure';
        }
        else {
            status = 'partial';
        }
        return {
            status,
            results: this.results,
            totalDuration,
            successCount,
            failureCount,
            allWarnings,
            allErrors,
        };
    }
    /**
     * Cancel ongoing build process
     */
    async cancel() {
        this.cancelled = true;
        this.status.phase = 'failed';
        this.status.currentOperation = 'Build cancelled by user';
        this.status.activePlatforms = [];
    }
    /**
     * Reset orchestrator state
     */
    reset() {
        this.status = this.createInitialStatus();
        this.results = [];
        this.cancelled = false;
    }
    // Private helper methods
    /**
     * Create initial build status
     */
    createInitialStatus() {
        return {
            phase: 'idle',
            activePlatforms: [],
            completedPlatforms: [],
            failedPlatforms: [],
            progress: 0,
        };
    }
    /**
     * Build platforms in parallel
     */
    async buildParallel(platforms) {
        this.status.currentOperation = `Building ${platforms.length} platforms in parallel`;
        const buildPromises = platforms.map(platform => this.buildPlatform(platform));
        const results = await Promise.allSettled(buildPromises);
        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            }
            else {
                // Handle rejected promise
                return this.createErrorResult(platforms[index], result.reason?.message || 'Unknown build error');
            }
        });
    }
    /**
     * Build platforms sequentially
     */
    async buildSequential(platforms) {
        const results = [];
        for (let i = 0; i < platforms.length; i++) {
            if (this.cancelled) {
                break;
            }
            const platform = platforms[i];
            this.status.currentOperation =
                `Building ${Platform_1.PLATFORM_METADATA[platform].displayName} (${i + 1}/${platforms.length})`;
            this.status.progress = Math.round((i / platforms.length) * 100);
            try {
                const result = await this.buildPlatform(platform);
                results.push(result);
                // Update status
                if (result.success) {
                    this.status.completedPlatforms.push(platform);
                }
                else {
                    this.status.failedPlatforms.push(platform);
                }
            }
            catch (error) {
                const errorResult = this.createErrorResult(platform, error instanceof Error ? error.message : 'Unknown build error');
                results.push(errorResult);
                this.status.failedPlatforms.push(platform);
            }
            // Remove from active platforms
            this.status.activePlatforms = this.status.activePlatforms.filter(p => p !== platform);
        }
        return results;
    }
    /**
     * Build a single platform
     *
     * Generates platform-specific token files using TokenFileGenerator.
     * Includes all token categories including border width tokens.
     */
    async buildPlatform(platform) {
        const startTime = Date.now();
        const warnings = [];
        const errors = [];
        try {
            // Verify border width tokens are available
            const borderWidthTokens = (0, tokens_1.getTokensByCategory)(PrimitiveToken_1.TokenCategory.BORDER_WIDTH);
            if (borderWidthTokens.length === 0) {
                warnings.push('No border width tokens found in token registry');
            }
            // Verify all tokens are available
            const allTokens = (0, tokens_1.getAllPrimitiveTokens)();
            if (allTokens.length === 0) {
                throw new Error('No tokens available for generation');
            }
            // Validate semantic token references before generation
            const primitiveRegistry = new PrimitiveTokenRegistry_1.PrimitiveTokenRegistry();
            const semanticRegistry = new SemanticTokenRegistry_1.SemanticTokenRegistry(primitiveRegistry);
            const validator = new SemanticTokenValidator_1.SemanticTokenValidator(primitiveRegistry, semanticRegistry);
            const semanticTokens = (0, semantic_1.getAllSemanticTokens)();
            const validationResult = validator.validateSemanticReferences(semanticTokens, allTokens);
            if (validationResult.level === 'Error') {
                // Validation failed - add error and return early
                errors.push({
                    code: 'VALIDATION_FAILED',
                    message: validationResult.message,
                    severity: 'error',
                    category: 'token',
                    platform,
                    context: {
                        rationale: validationResult.rationale,
                        suggestions: validationResult.suggestions
                    },
                    suggestions: validationResult.suggestions || [
                        'Verify that all referenced primitive tokens exist',
                        'Check for typos in primitive token names',
                        'Ensure typography tokens include all required properties'
                    ],
                    documentation: []
                });
                const duration = Date.now() - startTime;
                return {
                    platform,
                    success: false,
                    packagePath: '',
                    duration,
                    warnings,
                    errors
                };
            }
            if (validationResult.level === 'Warning') {
                warnings.push(validationResult.message);
            }
            // Generate platform-specific token file
            let generationResult;
            switch (platform) {
                case 'web':
                    generationResult = this.tokenGenerator.generateWebTokens({
                        outputDir: this.config.outputDir,
                        version: '1.0.0',
                        includeComments: true,
                        groupByCategory: true
                    });
                    break;
                case 'ios':
                    generationResult = this.tokenGenerator.generateiOSTokens({
                        outputDir: this.config.outputDir,
                        version: '1.0.0',
                        includeComments: true,
                        groupByCategory: true
                    });
                    break;
                case 'android':
                    generationResult = this.tokenGenerator.generateAndroidTokens({
                        outputDir: this.config.outputDir,
                        version: '1.0.0',
                        includeComments: true,
                        groupByCategory: true
                    });
                    break;
                default:
                    throw new Error(`Unsupported platform: ${platform}`);
            }
            // Check generation result
            if (!generationResult.valid) {
                const generationErrors = generationResult.errors || [];
                generationErrors.forEach(errorMsg => {
                    errors.push({
                        code: 'GENERATION_FAILED',
                        message: errorMsg,
                        severity: 'error',
                        category: 'token',
                        platform,
                        context: {},
                        suggestions: [
                            'Check token definitions for syntax errors',
                            'Verify all tokens have required platform values',
                            'Review generator configuration'
                        ],
                        documentation: []
                    });
                });
            }
            // Write generated content to file
            const outputPath = path.join(this.config.outputDir, platform);
            // Ensure output directory exists
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath, { recursive: true });
            }
            // Write the generated file
            const fileName = path.basename(generationResult.filePath);
            const fullPath = path.join(outputPath, fileName);
            fs.writeFileSync(fullPath, generationResult.content, 'utf-8');
            const duration = Date.now() - startTime;
            return {
                platform,
                success: errors.length === 0,
                packagePath: fullPath,
                duration,
                warnings,
                errors,
                metadata: {
                    timestamp: new Date().toISOString(),
                    tokensGenerated: generationResult.tokenCount,
                    packageSize: Buffer.byteLength(generationResult.content, 'utf-8')
                },
            };
        }
        catch (error) {
            const duration = Date.now() - startTime;
            const buildError = {
                code: 'BUILD_FAILED',
                message: error instanceof Error ? error.message : 'Unknown build error',
                severity: 'error',
                category: 'build',
                platform,
                context: {},
                suggestions: [
                    'Check build logs for detailed error information',
                    'Verify platform-specific configuration is correct',
                    'Ensure all dependencies are installed',
                    'Verify token definitions are valid'
                ],
                documentation: [],
            };
            return {
                platform,
                success: false,
                packagePath: '',
                duration,
                warnings,
                errors: [buildError],
            };
        }
    }
    /**
     * Create error result for failed build
     */
    createErrorResult(platform, errorMessage) {
        const error = {
            code: 'BUILD_FAILED',
            message: errorMessage,
            severity: 'error',
            category: 'build',
            platform,
            context: {},
            suggestions: [
                'Check build logs for detailed error information',
                'Verify platform-specific configuration is correct',
                'Ensure all dependencies are installed',
            ],
            documentation: [],
        };
        return {
            platform,
            success: false,
            packagePath: '',
            duration: 0,
            warnings: [],
            errors: [error],
        };
    }
    /**
     * Validate iOS-specific options
     */
    validateiOSOptions(options) {
        const errors = [];
        if (!options.swiftVersion) {
            errors.push('iOS build requires swiftVersion to be specified');
        }
        if (!options.minimumDeploymentTarget) {
            errors.push('iOS build requires minimumDeploymentTarget to be specified');
        }
        return errors;
    }
    /**
     * Validate Android-specific options
     */
    validateAndroidOptions(options) {
        const errors = [];
        if (!options.kotlinVersion) {
            errors.push('Android build requires kotlinVersion to be specified');
        }
        if (typeof options.minSdkVersion !== 'number' || options.minSdkVersion < 21) {
            errors.push('Android build requires minSdkVersion >= 21');
        }
        if (typeof options.targetSdkVersion !== 'number') {
            errors.push('Android build requires targetSdkVersion to be specified');
        }
        if (options.minSdkVersion > options.targetSdkVersion) {
            errors.push('Android minSdkVersion cannot be greater than targetSdkVersion');
        }
        return errors;
    }
    /**
     * Validate Web-specific options
     */
    validateWebOptions(options) {
        const errors = [];
        if (!options.target) {
            errors.push('Web build requires target to be specified');
        }
        else if (!['es2020', 'es2021', 'esnext'].includes(options.target)) {
            errors.push(`Invalid web target: ${options.target}. ` +
                `Valid targets are: es2020, es2021, esnext`);
        }
        if (!options.formats || options.formats.length === 0) {
            errors.push('Web build requires at least one output format');
        }
        else {
            const validFormats = ['esm', 'cjs', 'umd'];
            const invalidFormats = options.formats.filter((f) => !validFormats.includes(f));
            if (invalidFormats.length > 0) {
                errors.push(`Invalid web formats: ${invalidFormats.join(', ')}. ` +
                    `Valid formats are: ${validFormats.join(', ')}`);
            }
        }
        return errors;
    }
}
exports.BuildOrchestrator = BuildOrchestrator;
//# sourceMappingURL=BuildOrchestrator.js.map