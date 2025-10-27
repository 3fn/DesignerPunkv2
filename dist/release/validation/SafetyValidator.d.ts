/**
 * Release Safety Validation
 *
 * Provides safety checks for release readiness and rollback capabilities
 * to prevent incorrect or harmful releases
 */
import { ValidationResult, ReleasePlan } from '../types/ReleaseTypes';
import { SafetyChecksConfig } from '../config/ReleaseConfig';
export declare class SafetyValidator {
    private config;
    constructor(config: SafetyChecksConfig);
    /**
     * Validate release safety checks
     */
    validateReleaseSafety(releasePlan: ReleasePlan): Promise<ValidationResult>;
    /**
     * Validate rollback capability exists and is functional
     */
    private validateRollbackCapability;
    /**
     * Validate dependency conflicts that could cause issues
     */
    private validateDependencyConflicts;
    /**
     * Validate publishing safety checks
     */
    private validatePublishingSafety;
    /**
     * Validate major release confirmation
     */
    private validateMajorReleaseConfirmation;
    /**
     * Validate breaking change confirmation
     */
    private validateBreakingChangeConfirmation;
    /**
     * Validate rollback plan content
     */
    private validateRollbackPlanContent;
    /**
     * Validate git state for rollback capability
     */
    private validateGitStateForRollback;
    /**
     * Validate backup capabilities
     */
    private validateBackupCapabilities;
    /**
     * Detect circular dependencies
     */
    private detectCircularDependencies;
    /**
     * Detect cycle from specific package
     */
    private detectCycleFromPackage;
    /**
     * Check version conflict for dependency
     */
    private checkVersionConflict;
    /**
     * Check for missing dependencies
     */
    private checkMissingDependencies;
    /**
     * Validate publishing order
     */
    private validatePublishingOrder;
    /**
     * Validate authentication tokens
     */
    private validateAuthenticationTokens;
    /**
     * Validate registry accessibility
     */
    private validateRegistryAccessibility;
    /**
     * Validate build artifacts exist
     */
    private validateBuildArtifacts;
    /**
     * Check major release confirmation
     */
    private checkMajorReleaseConfirmation;
    /**
     * Check breaking change confirmation
     */
    private checkBreakingChangeConfirmation;
    /**
     * Get rollback plan path
     */
    private getRollbackPlanPath;
    /**
     * Check if file exists
     */
    private fileExists;
    /**
     * Check if dependency exists
     */
    private checkDependencyExists;
    /**
     * Check if versions are compatible
     */
    private isVersionCompatible;
}
//# sourceMappingURL=SafetyValidator.d.ts.map