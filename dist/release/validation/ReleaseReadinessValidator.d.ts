/**
 * Release Readiness Validation
 *
 * Validates that all completion documentation exists and is properly formatted
 * before allowing a release to proceed
 */
import { ValidationResult, ReleasePlan } from '../types/ReleaseTypes';
import { ValidationRulesConfig } from '../config/ReleaseConfig';
export declare class ReleaseReadinessValidator {
    private rules;
    constructor(rules: ValidationRulesConfig);
    /**
     * Validate release readiness including completion documentation
     */
    validateReleaseReadiness(releasePlan: ReleasePlan): Promise<ValidationResult>;
    /**
     * Validate that completion documentation exists for all packages
     */
    private validateCompletionDocumentation;
    /**
     * Validate document format and required sections
     */
    private validateDocumentFormat;
    /**
     * Validate breaking changes documentation
     */
    private validateBreakingChangesDocumentation;
    /**
     * Validate release notes completeness
     */
    private validateReleaseNotesCompleteness;
    /**
     * Validate required sections in completion document
     */
    private validateRequiredSections;
    /**
     * Validate document metadata
     */
    private validateDocumentMetadata;
    /**
     * Validate breaking change against configured rules
     */
    private validateBreakingChangeAgainstRules;
    /**
     * Get spec completion path for a package
     */
    private getSpecCompletionPath;
    /**
     * Get task completion paths for a package
     */
    private getTaskCompletionPaths;
    /**
     * Get all completion documents for a package
     */
    private getCompletionDocuments;
    /**
     * Check if file exists
     */
    private fileExists;
}
//# sourceMappingURL=ReleaseReadinessValidator.d.ts.map