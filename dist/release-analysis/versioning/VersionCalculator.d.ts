/**
 * Version Calculator for Release Analysis System
 *
 * Implements semantic version calculation based on extracted changes,
 * providing version bump recommendations with rationale and evidence.
 */
import { ExtractedChanges } from '../types/AnalysisTypes';
export interface VersionRecommendation {
    currentVersion: string;
    recommendedVersion: string;
    bumpType: 'major' | 'minor' | 'patch' | 'none';
    rationale: string;
    confidence: number;
    evidence: ChangeEvidence[];
    preReleaseInfo?: PreReleaseInfo;
}
export interface ChangeEvidence {
    type: 'breaking' | 'feature' | 'fix' | 'improvement';
    description: string;
    source: string;
    impact: 'high' | 'medium' | 'low';
    count?: number;
}
export interface PreReleaseInfo {
    isPreRelease: boolean;
    preReleaseType?: 'alpha' | 'beta' | 'rc';
    preReleaseNumber?: number;
    canPromote?: boolean;
    nextPreRelease?: string;
}
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
export declare class VersionCalculator {
    /**
     * Calculate semantic version bump based on extracted changes
     */
    calculateVersionBump(changes: ExtractedChanges, currentVersion: string): VersionRecommendation;
    /**
     * Validate semantic versioning compliance
     */
    validateSemanticVersioning(recommendation: VersionRecommendation): ValidationResult;
    /**
     * Generate detailed rationale for version recommendation
     */
    generateVersionRationale(changes: ExtractedChanges): string;
    /**
     * Handle pre-release version progression
     */
    handlePreReleaseVersions(currentVersion: string, bumpType: 'major' | 'minor' | 'patch' | 'none'): string;
    /**
     * Parse semantic version string into components
     */
    private parseVersion;
    /**
     * Determine appropriate bump type based on changes
     */
    private determineBumpType;
    /**
     * Calculate new version based on bump type
     */
    private calculateNewVersion;
    /**
     * Generate evidence array from extracted changes
     */
    private generateEvidence;
    /**
     * Calculate confidence score for version recommendation
     */
    private calculateConfidence;
    /**
     * Analyze pre-release information
     */
    private analyzePreReleaseInfo;
    /**
     * Validate semantic version format
     */
    private isValidSemanticVersion;
    /**
     * Validate version progression logic
     */
    private isValidVersionProgression;
    /**
     * Determine impact level for breaking changes
     */
    private determineBreakingChangeImpact;
    /**
     * Determine impact level for features
     */
    private determineFeatureImpact;
    /**
     * Determine impact level for bug fixes
     */
    private determineBugFixImpact;
    /**
     * Determine impact level for improvements
     */
    private determineImprovementImpact;
}
//# sourceMappingURL=VersionCalculator.d.ts.map