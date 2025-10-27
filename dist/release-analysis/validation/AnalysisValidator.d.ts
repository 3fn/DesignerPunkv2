/**
 * Analysis Validator
 *
 * Comprehensive validation system for release analysis results,
 * including version bump validation, release note quality checks,
 * and confidence threshold enforcement.
 */
import { ExtractedChanges } from '../types/AnalysisTypes';
import { VersionRecommendation } from '../versioning/VersionCalculator';
export interface AnalysisValidationResult {
    valid: boolean;
    score: number;
    status: 'pass' | 'warning' | 'fail';
    errors: string[];
    warnings: string[];
    details: ValidationDetails;
}
export interface ValidationDetails {
    versionValidation: VersionValidationResult;
    releaseNoteValidation: ReleaseNoteValidationResult;
    confidenceValidation: ConfidenceValidationResult;
    qualityGates: QualityGateResult[];
}
export interface VersionValidationResult {
    valid: boolean;
    semanticCompliance: boolean;
    progressionValid: boolean;
    bumpTypeCorrect: boolean;
    errors: string[];
    warnings: string[];
    score: number;
}
export interface ReleaseNoteValidationResult {
    valid: boolean;
    completeness: number;
    formatting: number;
    clarity: number;
    errors: string[];
    warnings: string[];
    suggestions: string[];
    score: number;
}
export interface ConfidenceValidationResult {
    valid: boolean;
    overallConfidence: number;
    extractionConfidence: number;
    versionConfidence: number;
    thresholdsMet: boolean;
    errors: string[];
    warnings: string[];
    score: number;
}
export interface QualityGateResult {
    name: string;
    passed: boolean;
    score: number;
    threshold: number;
    message: string;
    critical: boolean;
}
export interface ValidationConfig {
    confidenceThresholds: ConfidenceThresholds;
    qualityGates: QualityGateConfig[];
    releaseNoteRequirements: ReleaseNoteRequirements;
    versionValidationRules: VersionValidationRules;
}
export interface ConfidenceThresholds {
    minimum: number;
    warning: number;
    good: number;
    extraction: number;
    version: number;
}
export interface QualityGateConfig {
    name: string;
    threshold: number;
    critical: boolean;
    enabled: boolean;
}
export interface ReleaseNoteRequirements {
    minimumSections: number;
    requireBreakingChangeDetails: boolean;
    requireMigrationGuidance: boolean;
    minimumDescriptionLength: number;
    requireSummary: boolean;
}
export interface VersionValidationRules {
    enforceSemanticVersioning: boolean;
    allowPreReleaseVersions: boolean;
    requireEvidenceForBumps: boolean;
    minimumConfidenceForMajor: number;
}
export declare class AnalysisValidator {
    private config;
    constructor(config?: Partial<ValidationConfig>);
    /**
     * Validate complete analysis results
     */
    validateAnalysis(changes: ExtractedChanges, versionRecommendation: VersionRecommendation, releaseNotes: string): AnalysisValidationResult;
    /**
     * Validate version recommendation against semantic versioning rules
     */
    validateVersionRecommendation(recommendation: VersionRecommendation, changes: ExtractedChanges): VersionValidationResult;
    /**
     * Validate release notes quality and completeness
     */
    validateReleaseNotes(releaseNotes: string, changes: ExtractedChanges): ReleaseNoteValidationResult;
    /**
     * Validate confidence levels and thresholds
     */
    validateConfidence(changes: ExtractedChanges, versionRecommendation: VersionRecommendation): ConfidenceValidationResult;
    /**
     * Evaluate quality gates
     */
    private evaluateQualityGates;
    /**
     * Calculate overall validation score
     */
    private calculateOverallScore;
    /**
     * Determine overall validation status
     */
    private determineOverallStatus;
    private isValidSemanticVersion;
    private parseVersion;
    private isValidVersionProgression;
    private determineExpectedBumpType;
    private getBumpTypePriority;
    private calculateVersionValidationScore;
    private validateReleaseNoteFormatting;
    private validateReleaseNoteCompleteness;
    private validateReleaseNoteClarity;
    private calculateReleaseNoteScore;
    private calculateConfidenceScore;
}
//# sourceMappingURL=AnalysisValidator.d.ts.map