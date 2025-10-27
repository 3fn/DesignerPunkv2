/**
 * Configuration Schema Validation
 *
 * Provides JSON schema definitions and validation for release configuration
 */
export interface ConfigValidationResult {
    valid: boolean;
    errors: ConfigValidationError[];
    warnings: ConfigValidationWarning[];
}
export interface ConfigValidationError {
    path: string;
    message: string;
    value?: any;
    expectedType?: string;
}
export interface ConfigValidationWarning {
    path: string;
    message: string;
    suggestion?: string;
}
/**
 * JSON Schema for ReleaseConfig validation
 */
export declare const RELEASE_CONFIG_SCHEMA: {
    readonly type: "object";
    readonly required: readonly ["detection", "versioning", "publishing", "validation"];
    readonly properties: {
        readonly detection: {
            readonly type: "object";
            readonly required: readonly ["specCompletionTrigger", "taskCompletionTrigger", "breakingChangeKeywords", "confidenceThreshold"];
            readonly properties: {
                readonly specCompletionTrigger: {
                    readonly type: "boolean";
                };
                readonly taskCompletionTrigger: {
                    readonly type: "boolean";
                };
                readonly breakingChangeKeywords: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly minItems: 1;
                };
                readonly confidenceThreshold: {
                    readonly type: "number";
                    readonly minimum: 0;
                    readonly maximum: 1;
                };
                readonly monitorPaths: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                };
                readonly completionPatterns: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                };
            };
        };
        readonly versioning: {
            readonly type: "object";
            readonly required: readonly ["preReleaseStrategy", "packageCoordination", "semanticVersioning", "versionBumpRules"];
            readonly properties: {
                readonly preReleaseStrategy: {
                    readonly type: "string";
                    readonly enum: readonly ["alpha", "beta", "rc"];
                };
                readonly packageCoordination: {
                    readonly type: "object";
                    readonly required: readonly ["corePackageSync", "componentIndependence", "dependencyUpdates"];
                    readonly properties: {
                        readonly corePackageSync: {
                            readonly type: "boolean";
                        };
                        readonly componentIndependence: {
                            readonly type: "boolean";
                        };
                        readonly dependencyUpdates: {
                            readonly type: "string";
                            readonly enum: readonly ["automatic", "manual", "prompt"];
                        };
                        readonly corePackages: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly independentPackages: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                    };
                };
                readonly semanticVersioning: {
                    readonly type: "object";
                    readonly required: readonly ["strictCompliance", "allowPreRelease"];
                    readonly properties: {
                        readonly strictCompliance: {
                            readonly type: "boolean";
                        };
                        readonly allowPreRelease: {
                            readonly type: "boolean";
                        };
                        readonly preReleaseFormat: {
                            readonly type: "string";
                        };
                        readonly validationRules: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly required: readonly ["id", "description", "pattern", "errorMessage"];
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                    };
                                    readonly description: {
                                        readonly type: "string";
                                    };
                                    readonly pattern: {
                                        readonly type: "string";
                                    };
                                    readonly errorMessage: {
                                        readonly type: "string";
                                    };
                                };
                            };
                        };
                    };
                };
                readonly versionBumpRules: {
                    readonly type: "object";
                    readonly required: readonly ["majorBumpTriggers", "minorBumpTriggers", "patchBumpTriggers", "defaultBumpType"];
                    readonly properties: {
                        readonly majorBumpTriggers: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly minorBumpTriggers: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly patchBumpTriggers: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly defaultBumpType: {
                            readonly type: "string";
                            readonly enum: readonly ["major", "minor", "patch"];
                        };
                    };
                };
            };
        };
        readonly publishing: {
            readonly type: "object";
            readonly required: readonly ["github", "npm", "artifacts", "publishingOrder"];
            readonly properties: {
                readonly github: {
                    readonly type: "object";
                    readonly required: readonly ["owner", "repository", "tokenEnvVar"];
                    readonly properties: {
                        readonly owner: {
                            readonly type: "string";
                            readonly minLength: 1;
                        };
                        readonly repository: {
                            readonly type: "string";
                            readonly minLength: 1;
                        };
                        readonly tokenEnvVar: {
                            readonly type: "string";
                            readonly minLength: 1;
                        };
                        readonly createReleases: {
                            readonly type: "boolean";
                        };
                        readonly createTags: {
                            readonly type: "boolean";
                        };
                        readonly tagFormat: {
                            readonly type: "string";
                        };
                        readonly releaseNameFormat: {
                            readonly type: "string";
                        };
                        readonly includePreReleases: {
                            readonly type: "boolean";
                        };
                    };
                };
                readonly npm: {
                    readonly type: "object";
                    readonly required: readonly ["registry", "tokenEnvVar", "access", "packages"];
                    readonly properties: {
                        readonly registry: {
                            readonly type: "string";
                            readonly format: "uri";
                        };
                        readonly tokenEnvVar: {
                            readonly type: "string";
                            readonly minLength: 1;
                        };
                        readonly access: {
                            readonly type: "string";
                            readonly enum: readonly ["public", "restricted"];
                        };
                        readonly packages: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly required: readonly ["name", "path"];
                                readonly properties: {
                                    readonly name: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                    };
                                    readonly path: {
                                        readonly type: "string";
                                        readonly minLength: 1;
                                    };
                                    readonly registry: {
                                        readonly type: "string";
                                        readonly format: "uri";
                                    };
                                    readonly access: {
                                        readonly type: "string";
                                        readonly enum: readonly ["public", "restricted"];
                                    };
                                };
                            };
                            readonly minItems: 1;
                        };
                        readonly publishTimeout: {
                            readonly type: "number";
                            readonly minimum: 1000;
                        };
                    };
                };
                readonly artifacts: {
                    readonly type: "object";
                    readonly required: readonly ["enabled"];
                    readonly properties: {
                        readonly enabled: {
                            readonly type: "boolean";
                        };
                        readonly buildCommand: {
                            readonly type: "string";
                        };
                        readonly outputDirectory: {
                            readonly type: "string";
                        };
                        readonly includePatterns: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly excludePatterns: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                    };
                };
                readonly publishingOrder: {
                    readonly type: "object";
                    readonly required: readonly ["dependencyAware", "retryConfig"];
                    readonly properties: {
                        readonly dependencyAware: {
                            readonly type: "boolean";
                        };
                        readonly customOrder: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly parallelGroups: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "array";
                                readonly items: {
                                    readonly type: "string";
                                };
                            };
                        };
                        readonly retryConfig: {
                            readonly type: "object";
                            readonly required: readonly ["maxAttempts", "retryDelay", "backoffMultiplier", "maxRetryDelay"];
                            readonly properties: {
                                readonly maxAttempts: {
                                    readonly type: "number";
                                    readonly minimum: 1;
                                    readonly maximum: 10;
                                };
                                readonly retryDelay: {
                                    readonly type: "number";
                                    readonly minimum: 100;
                                };
                                readonly backoffMultiplier: {
                                    readonly type: "number";
                                    readonly minimum: 1;
                                };
                                readonly maxRetryDelay: {
                                    readonly type: "number";
                                    readonly minimum: 1000;
                                };
                            };
                        };
                    };
                };
            };
        };
        readonly validation: {
            readonly type: "object";
            readonly required: readonly ["releaseReadiness", "versionBumpValidation", "packageCompatibility", "completionDocumentValidation"];
            readonly properties: {
                readonly releaseReadiness: {
                    readonly type: "boolean";
                };
                readonly versionBumpValidation: {
                    readonly type: "boolean";
                };
                readonly packageCompatibility: {
                    readonly type: "boolean";
                };
                readonly completionDocumentValidation: {
                    readonly type: "boolean";
                };
                readonly validationRules: {
                    readonly type: "object";
                    readonly required: readonly ["requireCompletionDocs", "validateDocFormat"];
                    readonly properties: {
                        readonly requireCompletionDocs: {
                            readonly type: "boolean";
                        };
                        readonly validateDocFormat: {
                            readonly type: "boolean";
                        };
                        readonly requiredSections: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                        };
                        readonly breakingChangeRules: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "object";
                                readonly required: readonly ["id", "description", "pattern", "requireMigrationGuidance"];
                                readonly properties: {
                                    readonly id: {
                                        readonly type: "string";
                                    };
                                    readonly description: {
                                        readonly type: "string";
                                    };
                                    readonly pattern: {
                                        readonly type: "string";
                                    };
                                    readonly requireMigrationGuidance: {
                                        readonly type: "boolean";
                                    };
                                };
                            };
                        };
                    };
                };
                readonly safetyChecks: {
                    readonly type: "object";
                    readonly properties: {
                        readonly rollbackValidation: {
                            readonly type: "boolean";
                        };
                        readonly dependencyConflictDetection: {
                            readonly type: "boolean";
                        };
                        readonly publishingSafetyChecks: {
                            readonly type: "boolean";
                        };
                        readonly requireMajorReleaseConfirmation: {
                            readonly type: "boolean";
                        };
                        readonly requireBreakingChangeConfirmation: {
                            readonly type: "boolean";
                        };
                    };
                };
            };
        };
    };
};
/**
 * Validates configuration object against schema
 */
export declare function validateConfig(config: any): ConfigValidationResult;
/**
 * Validates that required environment variables are available
 */
export declare function validateEnvironmentVariables(config: any): ConfigValidationResult;
//# sourceMappingURL=ConfigSchema.d.ts.map