/**
 * Semantic Version Validation
 *
 * Provides comprehensive semantic versioning validation and compliance checking
 */
import { ValidationResult, VersionBump } from '../types/ReleaseTypes';
import { SemanticVersioningRules } from '../config/ReleaseConfig';
export declare class SemanticVersionValidator {
    private rules;
    constructor(rules: SemanticVersioningRules);
    /**
     * Validate semantic versioning compliance for a version bump
     */
    validateVersionBump(versionBump: VersionBump): Promise<ValidationResult>;
    /**
     * Validate version format against semantic versioning specification
     */
    private validateVersionFormat;
    /**
     * Validate version progression logic
     */
    private validateVersionProgression;
    /**
     * Validate bump type consistency with changes
     */
    private validateBumpTypeConsistency;
    /**
     * Validate pre-release version rules
     */
    private validatePreReleaseRules;
    /**
     * Parse semantic version into components
     */
    private parseVersion;
    /**
     * Validate version against semantic versioning rules
     */
    validateVersion(version: string): Promise<ValidationResult>;
}
//# sourceMappingURL=SemanticVersionValidator.d.ts.map