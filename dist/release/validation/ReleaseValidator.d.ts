/**
 * Release Validation Framework
 *
 * Provides comprehensive validation for release operations, semantic versioning,
 * and safety checks for release readiness and rollback capabilities
 */
import { ValidationResult, ReleasePlan, VersionBump } from '../types/ReleaseTypes';
import { ReleaseConfig } from '../config/ReleaseConfig';
export declare class ReleaseValidator {
    private config;
    private semanticVersionValidator;
    private releaseReadinessValidator;
    private safetyValidator;
    constructor(config: ReleaseConfig);
    /**
     * Comprehensive release validation
     */
    validateRelease(releasePlan: ReleasePlan): Promise<ValidationResult>;
    /**
     * Validate release readiness (legacy method for backward compatibility)
     */
    validateReleaseReadiness(releaseData: any): Promise<ValidationResult>;
    /**
     * Validate version bump against semantic versioning rules
     */
    validateVersionBump(versionBump: VersionBump): Promise<ValidationResult>;
    /**
     * Validate semantic versioning compliance (legacy method)
     */
    validateSemanticVersioning(version: string, bumpType: 'major' | 'minor' | 'patch'): Promise<ValidationResult>;
    /**
     * Validate package compatibility
     */
    validatePackageCompatibility(packages: any[]): Promise<ValidationResult>;
    /**
     * Validate safety checks
     */
    validateSafetyChecks(releaseData: any): Promise<ValidationResult>;
    /**
     * Validate document sections
     */
    private validateDocumentSections;
    /**
     * Check for dependency conflicts
     */
    private checkDependencyConflict;
    /**
     * Detect circular dependencies
     */
    private detectCircularDependencies;
    /**
     * Detect cycle from specific package
     */
    private detectCycleFromPackage;
    /**
     * Check if versions are compatible
     */
    private isVersionCompatible;
    /**
     * Validate rollback capabilities
     */
    validateRollbackCapability(releasePlan: ReleasePlan): Promise<ValidationResult>;
    /**
     * Validate release plan completeness
     */
    validateReleasePlan(releasePlan: ReleasePlan): Promise<ValidationResult>;
    /**
     * Validate error handling and recovery capabilities
     */
    validateErrorHandling(): Promise<ValidationResult>;
    /**
     * Provide clear, actionable error messages with resolution guidance
     */
    generateErrorGuidance(validationResult: ValidationResult): string;
    /**
     * Validate configuration completeness
     */
    validateConfiguration(): ValidationResult;
}
//# sourceMappingURL=ReleaseValidator.d.ts.map