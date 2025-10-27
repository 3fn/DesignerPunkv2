"use strict";
/**
 * Configuration Schema Validation
 *
 * Provides JSON schema definitions and validation for release configuration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RELEASE_CONFIG_SCHEMA = void 0;
exports.validateConfig = validateConfig;
exports.validateEnvironmentVariables = validateEnvironmentVariables;
/**
 * JSON Schema for ReleaseConfig validation
 */
exports.RELEASE_CONFIG_SCHEMA = {
    type: 'object',
    required: ['detection', 'versioning', 'publishing', 'validation'],
    properties: {
        detection: {
            type: 'object',
            required: ['specCompletionTrigger', 'taskCompletionTrigger', 'breakingChangeKeywords', 'confidenceThreshold'],
            properties: {
                specCompletionTrigger: { type: 'boolean' },
                taskCompletionTrigger: { type: 'boolean' },
                breakingChangeKeywords: {
                    type: 'array',
                    items: { type: 'string' },
                    minItems: 1
                },
                confidenceThreshold: {
                    type: 'number',
                    minimum: 0,
                    maximum: 1
                },
                monitorPaths: {
                    type: 'array',
                    items: { type: 'string' }
                },
                completionPatterns: {
                    type: 'array',
                    items: { type: 'string' }
                }
            }
        },
        versioning: {
            type: 'object',
            required: ['preReleaseStrategy', 'packageCoordination', 'semanticVersioning', 'versionBumpRules'],
            properties: {
                preReleaseStrategy: {
                    type: 'string',
                    enum: ['alpha', 'beta', 'rc']
                },
                packageCoordination: {
                    type: 'object',
                    required: ['corePackageSync', 'componentIndependence', 'dependencyUpdates'],
                    properties: {
                        corePackageSync: { type: 'boolean' },
                        componentIndependence: { type: 'boolean' },
                        dependencyUpdates: {
                            type: 'string',
                            enum: ['automatic', 'manual', 'prompt']
                        },
                        corePackages: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        independentPackages: {
                            type: 'array',
                            items: { type: 'string' }
                        }
                    }
                },
                semanticVersioning: {
                    type: 'object',
                    required: ['strictCompliance', 'allowPreRelease'],
                    properties: {
                        strictCompliance: { type: 'boolean' },
                        allowPreRelease: { type: 'boolean' },
                        preReleaseFormat: { type: 'string' },
                        validationRules: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['id', 'description', 'pattern', 'errorMessage'],
                                properties: {
                                    id: { type: 'string' },
                                    description: { type: 'string' },
                                    pattern: { type: 'string' },
                                    errorMessage: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                versionBumpRules: {
                    type: 'object',
                    required: ['majorBumpTriggers', 'minorBumpTriggers', 'patchBumpTriggers', 'defaultBumpType'],
                    properties: {
                        majorBumpTriggers: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        minorBumpTriggers: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        patchBumpTriggers: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        defaultBumpType: {
                            type: 'string',
                            enum: ['major', 'minor', 'patch']
                        }
                    }
                }
            }
        },
        publishing: {
            type: 'object',
            required: ['github', 'npm', 'artifacts', 'publishingOrder'],
            properties: {
                github: {
                    type: 'object',
                    required: ['owner', 'repository', 'tokenEnvVar'],
                    properties: {
                        owner: { type: 'string', minLength: 1 },
                        repository: { type: 'string', minLength: 1 },
                        tokenEnvVar: { type: 'string', minLength: 1 },
                        createReleases: { type: 'boolean' },
                        createTags: { type: 'boolean' },
                        tagFormat: { type: 'string' },
                        releaseNameFormat: { type: 'string' },
                        includePreReleases: { type: 'boolean' }
                    }
                },
                npm: {
                    type: 'object',
                    required: ['registry', 'tokenEnvVar', 'access', 'packages'],
                    properties: {
                        registry: { type: 'string', format: 'uri' },
                        tokenEnvVar: { type: 'string', minLength: 1 },
                        access: {
                            type: 'string',
                            enum: ['public', 'restricted']
                        },
                        packages: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['name', 'path'],
                                properties: {
                                    name: { type: 'string', minLength: 1 },
                                    path: { type: 'string', minLength: 1 },
                                    registry: { type: 'string', format: 'uri' },
                                    access: {
                                        type: 'string',
                                        enum: ['public', 'restricted']
                                    }
                                }
                            },
                            minItems: 1
                        },
                        publishTimeout: {
                            type: 'number',
                            minimum: 1000
                        }
                    }
                },
                artifacts: {
                    type: 'object',
                    required: ['enabled'],
                    properties: {
                        enabled: { type: 'boolean' },
                        buildCommand: { type: 'string' },
                        outputDirectory: { type: 'string' },
                        includePatterns: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        excludePatterns: {
                            type: 'array',
                            items: { type: 'string' }
                        }
                    }
                },
                publishingOrder: {
                    type: 'object',
                    required: ['dependencyAware', 'retryConfig'],
                    properties: {
                        dependencyAware: { type: 'boolean' },
                        customOrder: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        parallelGroups: {
                            type: 'array',
                            items: {
                                type: 'array',
                                items: { type: 'string' }
                            }
                        },
                        retryConfig: {
                            type: 'object',
                            required: ['maxAttempts', 'retryDelay', 'backoffMultiplier', 'maxRetryDelay'],
                            properties: {
                                maxAttempts: {
                                    type: 'number',
                                    minimum: 1,
                                    maximum: 10
                                },
                                retryDelay: {
                                    type: 'number',
                                    minimum: 100
                                },
                                backoffMultiplier: {
                                    type: 'number',
                                    minimum: 1
                                },
                                maxRetryDelay: {
                                    type: 'number',
                                    minimum: 1000
                                }
                            }
                        }
                    }
                }
            }
        },
        validation: {
            type: 'object',
            required: ['releaseReadiness', 'versionBumpValidation', 'packageCompatibility', 'completionDocumentValidation'],
            properties: {
                releaseReadiness: { type: 'boolean' },
                versionBumpValidation: { type: 'boolean' },
                packageCompatibility: { type: 'boolean' },
                completionDocumentValidation: { type: 'boolean' },
                validationRules: {
                    type: 'object',
                    required: ['requireCompletionDocs', 'validateDocFormat'],
                    properties: {
                        requireCompletionDocs: { type: 'boolean' },
                        validateDocFormat: { type: 'boolean' },
                        requiredSections: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        breakingChangeRules: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['id', 'description', 'pattern', 'requireMigrationGuidance'],
                                properties: {
                                    id: { type: 'string' },
                                    description: { type: 'string' },
                                    pattern: { type: 'string' },
                                    requireMigrationGuidance: { type: 'boolean' }
                                }
                            }
                        }
                    }
                },
                safetyChecks: {
                    type: 'object',
                    properties: {
                        rollbackValidation: { type: 'boolean' },
                        dependencyConflictDetection: { type: 'boolean' },
                        publishingSafetyChecks: { type: 'boolean' },
                        requireMajorReleaseConfirmation: { type: 'boolean' },
                        requireBreakingChangeConfirmation: { type: 'boolean' }
                    }
                }
            }
        }
    }
};
/**
 * Validates configuration object against schema
 */
function validateConfig(config) {
    const errors = [];
    const warnings = [];
    // Basic type validation
    if (!config || typeof config !== 'object') {
        errors.push({
            path: 'root',
            message: 'Configuration must be an object',
            value: config,
            expectedType: 'object'
        });
        return { valid: false, errors, warnings };
    }
    // Validate required top-level properties
    const requiredProps = ['detection', 'versioning', 'publishing', 'validation'];
    for (const prop of requiredProps) {
        if (!(prop in config)) {
            errors.push({
                path: prop,
                message: `Required property '${prop}' is missing`,
                expectedType: 'object'
            });
        }
    }
    // Validate detection configuration
    if (config.detection) {
        validateDetectionConfig(config.detection, 'detection', errors, warnings);
    }
    // Validate versioning configuration
    if (config.versioning) {
        validateVersioningConfig(config.versioning, 'versioning', errors, warnings);
    }
    // Validate publishing configuration
    if (config.publishing) {
        validatePublishingConfig(config.publishing, 'publishing', errors, warnings);
    }
    // Validate validation configuration
    if (config.validation) {
        validateValidationConfig(config.validation, 'validation', errors, warnings);
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
function validateDetectionConfig(config, path, errors, warnings) {
    if (typeof config !== 'object') {
        errors.push({
            path,
            message: 'Detection configuration must be an object',
            value: config,
            expectedType: 'object'
        });
        return;
    }
    // Validate confidence threshold
    if ('confidenceThreshold' in config) {
        const threshold = config.confidenceThreshold;
        if (typeof threshold !== 'number' || threshold < 0 || threshold > 1) {
            errors.push({
                path: `${path}.confidenceThreshold`,
                message: 'Confidence threshold must be a number between 0 and 1',
                value: threshold,
                expectedType: 'number (0-1)'
            });
        }
    }
    // Validate breaking change keywords
    if ('breakingChangeKeywords' in config) {
        const keywords = config.breakingChangeKeywords;
        if (!Array.isArray(keywords)) {
            errors.push({
                path: `${path}.breakingChangeKeywords`,
                message: 'Breaking change keywords must be an array',
                value: keywords,
                expectedType: 'array'
            });
        }
        else if (keywords.length === 0) {
            warnings.push({
                path: `${path}.breakingChangeKeywords`,
                message: 'No breaking change keywords defined',
                suggestion: 'Consider adding keywords like "breaking change", "incompatible", etc.'
            });
        }
    }
}
function validateVersioningConfig(config, path, errors, warnings) {
    if (typeof config !== 'object') {
        errors.push({
            path,
            message: 'Versioning configuration must be an object',
            value: config,
            expectedType: 'object'
        });
        return;
    }
    // Validate pre-release strategy
    if ('preReleaseStrategy' in config) {
        const strategy = config.preReleaseStrategy;
        if (!['alpha', 'beta', 'rc'].includes(strategy)) {
            errors.push({
                path: `${path}.preReleaseStrategy`,
                message: 'Pre-release strategy must be "alpha", "beta", or "rc"',
                value: strategy,
                expectedType: '"alpha" | "beta" | "rc"'
            });
        }
    }
    // Validate package coordination
    if (config.packageCoordination) {
        const coordination = config.packageCoordination;
        if ('dependencyUpdates' in coordination) {
            const updates = coordination.dependencyUpdates;
            if (!['automatic', 'manual', 'prompt'].includes(updates)) {
                errors.push({
                    path: `${path}.packageCoordination.dependencyUpdates`,
                    message: 'Dependency updates must be "automatic", "manual", or "prompt"',
                    value: updates,
                    expectedType: '"automatic" | "manual" | "prompt"'
                });
            }
        }
    }
}
function validatePublishingConfig(config, path, errors, warnings) {
    if (typeof config !== 'object') {
        errors.push({
            path,
            message: 'Publishing configuration must be an object',
            value: config,
            expectedType: 'object'
        });
        return;
    }
    // Validate GitHub configuration
    if (config.github) {
        const github = config.github;
        const requiredGitHubProps = ['owner', 'repository', 'tokenEnvVar'];
        for (const prop of requiredGitHubProps) {
            if (!(prop in github) || typeof github[prop] !== 'string' || github[prop].length === 0) {
                errors.push({
                    path: `${path}.github.${prop}`,
                    message: `GitHub ${prop} is required and must be a non-empty string`,
                    value: github[prop],
                    expectedType: 'string'
                });
            }
        }
    }
    // Validate npm configuration
    if (config.npm) {
        const npm = config.npm;
        if ('packages' in npm) {
            if (!Array.isArray(npm.packages)) {
                errors.push({
                    path: `${path}.npm.packages`,
                    message: 'npm packages must be an array',
                    value: npm.packages,
                    expectedType: 'array'
                });
            }
            else if (npm.packages.length === 0) {
                warnings.push({
                    path: `${path}.npm.packages`,
                    message: 'No npm packages configured for publishing',
                    suggestion: 'Add package configurations to enable npm publishing'
                });
            }
        }
    }
}
function validateValidationConfig(config, path, errors, warnings) {
    if (typeof config !== 'object') {
        errors.push({
            path,
            message: 'Validation configuration must be an object',
            value: config,
            expectedType: 'object'
        });
        return;
    }
    // Validate validation rules
    if (config.validationRules && config.validationRules.breakingChangeRules) {
        const rules = config.validationRules.breakingChangeRules;
        if (Array.isArray(rules)) {
            rules.forEach((rule, index) => {
                if (!rule.id || typeof rule.id !== 'string') {
                    errors.push({
                        path: `${path}.validationRules.breakingChangeRules[${index}].id`,
                        message: 'Breaking change rule ID is required and must be a string',
                        value: rule.id,
                        expectedType: 'string'
                    });
                }
                if (!rule.pattern || typeof rule.pattern !== 'string') {
                    errors.push({
                        path: `${path}.validationRules.breakingChangeRules[${index}].pattern`,
                        message: 'Breaking change rule pattern is required and must be a string',
                        value: rule.pattern,
                        expectedType: 'string'
                    });
                }
            });
        }
    }
}
/**
 * Validates that required environment variables are available
 */
function validateEnvironmentVariables(config) {
    const errors = [];
    const warnings = [];
    // Check GitHub token
    if (config.publishing?.github?.tokenEnvVar) {
        const tokenVar = config.publishing.github.tokenEnvVar;
        if (!process.env[tokenVar]) {
            errors.push({
                path: 'publishing.github.tokenEnvVar',
                message: `Environment variable '${tokenVar}' is not set`,
                value: tokenVar
            });
        }
    }
    // Check npm token
    if (config.publishing?.npm?.tokenEnvVar) {
        const tokenVar = config.publishing.npm.tokenEnvVar;
        if (!process.env[tokenVar]) {
            errors.push({
                path: 'publishing.npm.tokenEnvVar',
                message: `Environment variable '${tokenVar}' is not set`,
                value: tokenVar
            });
        }
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings
    };
}
//# sourceMappingURL=ConfigSchema.js.map