/**
 * Release Management Configuration System
 *
 * Provides comprehensive configuration for all release management behaviors
 * including detection, versioning, publishing, and validation settings.
 */
export interface ReleaseConfig {
    detection: DetectionConfig;
    versioning: VersioningConfig;
    publishing: PublishingConfig;
    validation: ValidationConfig;
}
export interface DetectionConfig {
    /** Enable automatic release detection from spec completion */
    specCompletionTrigger: boolean;
    /** Enable automatic release detection from task completion */
    taskCompletionTrigger: boolean;
    /** Keywords that indicate breaking changes in completion documents */
    breakingChangeKeywords: string[];
    /** Minimum confidence threshold for automatic release detection (0-1) */
    confidenceThreshold: number;
    /** Paths to monitor for completion documents */
    monitorPaths: string[];
    /** File patterns to watch for completion events */
    completionPatterns: string[];
}
export interface VersioningConfig {
    /** Pre-release strategy for version bumps */
    preReleaseStrategy: 'alpha' | 'beta' | 'rc';
    /** Package coordination strategy */
    packageCoordination: CoordinationStrategy;
    /** Semantic versioning rules and validation */
    semanticVersioning: SemanticVersioningRules;
    /** Version bump calculation rules */
    versionBumpRules: VersionBumpRules;
}
export interface CoordinationStrategy {
    /** Keep core packages (@designerpunk/tokens, @designerpunk/build-system) in sync */
    corePackageSync: boolean;
    /** Allow @designerpunk/components independent versioning */
    componentIndependence: boolean;
    /** How to handle dependency updates */
    dependencyUpdates: 'automatic' | 'manual' | 'prompt';
    /** Core packages that should be synchronized */
    corePackages: string[];
    /** Packages that can version independently */
    independentPackages: string[];
}
export interface SemanticVersioningRules {
    /** Enforce strict semantic versioning compliance */
    strictCompliance: boolean;
    /** Allow pre-release versions */
    allowPreRelease: boolean;
    /** Pre-release version format */
    preReleaseFormat: string;
    /** Version validation rules */
    validationRules: VersionValidationRule[];
}
export interface VersionBumpRules {
    /** Rules for determining major version bumps */
    majorBumpTriggers: string[];
    /** Rules for determining minor version bumps */
    minorBumpTriggers: string[];
    /** Rules for determining patch version bumps */
    patchBumpTriggers: string[];
    /** Default bump type when triggers are ambiguous */
    defaultBumpType: 'major' | 'minor' | 'patch';
}
export interface VersionValidationRule {
    /** Rule identifier */
    id: string;
    /** Rule description */
    description: string;
    /** Validation function pattern */
    pattern: string;
    /** Error message for validation failure */
    errorMessage: string;
}
export interface PublishingConfig {
    /** GitHub publishing configuration */
    github: GitHubConfig;
    /** npm registry publishing configuration */
    npm: NpmConfig;
    /** Artifact publishing configuration */
    artifacts: ArtifactConfig;
    /** Publishing order and coordination */
    publishingOrder: PublishingOrderConfig;
}
export interface GitHubConfig {
    /** GitHub repository owner */
    owner: string;
    /** GitHub repository name */
    repository: string;
    /** GitHub API token (environment variable name) */
    tokenEnvVar: string;
    /** Create GitHub releases */
    createReleases: boolean;
    /** Create Git tags */
    createTags: boolean;
    /** Tag name format */
    tagFormat: string;
    /** Release name format */
    releaseNameFormat: string;
    /** Include pre-releases */
    includePreReleases: boolean;
}
export interface NpmConfig {
    /** npm registry URL */
    registry: string;
    /** npm authentication token (environment variable name) */
    tokenEnvVar: string;
    /** Package access level */
    access: 'public' | 'restricted';
    /** Packages to publish to npm */
    packages: NpmPackageConfig[];
    /** Publishing timeout in milliseconds */
    publishTimeout: number;
}
export interface NpmPackageConfig {
    /** Package name */
    name: string;
    /** Package directory path */
    path: string;
    /** Custom registry for this package */
    registry?: string;
    /** Custom access level for this package */
    access?: 'public' | 'restricted';
}
export interface ArtifactConfig {
    /** Enable artifact publishing */
    enabled: boolean;
    /** Artifact build command */
    buildCommand: string;
    /** Artifact output directory */
    outputDirectory: string;
    /** Artifact file patterns to include */
    includePatterns: string[];
    /** Artifact file patterns to exclude */
    excludePatterns: string[];
}
export interface PublishingOrderConfig {
    /** Enable dependency-aware publishing order */
    dependencyAware: boolean;
    /** Custom publishing order (overrides dependency analysis) */
    customOrder?: string[];
    /** Parallel publishing groups */
    parallelGroups?: string[][];
    /** Publishing retry configuration */
    retryConfig: RetryConfig;
}
export interface RetryConfig {
    /** Maximum number of retry attempts */
    maxAttempts: number;
    /** Retry delay in milliseconds */
    retryDelay: number;
    /** Exponential backoff multiplier */
    backoffMultiplier: number;
    /** Maximum retry delay in milliseconds */
    maxRetryDelay: number;
}
export interface ValidationConfig {
    /** Enable release readiness validation */
    releaseReadiness: boolean;
    /** Enable version bump validation */
    versionBumpValidation: boolean;
    /** Enable package compatibility validation */
    packageCompatibility: boolean;
    /** Enable completion document validation */
    completionDocumentValidation: boolean;
    /** Validation rules configuration */
    validationRules: ValidationRulesConfig;
    /** Safety checks configuration */
    safetyChecks: SafetyChecksConfig;
}
export interface ValidationRulesConfig {
    /** Require completion documentation for all releases */
    requireCompletionDocs: boolean;
    /** Validate completion document format */
    validateDocFormat: boolean;
    /** Required sections in completion documents */
    requiredSections: string[];
    /** Breaking change validation rules */
    breakingChangeRules: BreakingChangeRule[];
}
export interface BreakingChangeRule {
    /** Rule identifier */
    id: string;
    /** Rule description */
    description: string;
    /** Detection pattern */
    pattern: string;
    /** Require migration guidance for this type of breaking change */
    requireMigrationGuidance: boolean;
}
export interface SafetyChecksConfig {
    /** Enable rollback capability validation */
    rollbackValidation: boolean;
    /** Enable dependency conflict detection */
    dependencyConflictDetection: boolean;
    /** Enable publishing safety checks */
    publishingSafetyChecks: boolean;
    /** Require manual confirmation for major releases */
    requireMajorReleaseConfirmation: boolean;
    /** Require manual confirmation for breaking changes */
    requireBreakingChangeConfirmation: boolean;
}
/**
 * Default configuration values
 */
export declare const DEFAULT_RELEASE_CONFIG: ReleaseConfig;
//# sourceMappingURL=ReleaseConfig.d.ts.map