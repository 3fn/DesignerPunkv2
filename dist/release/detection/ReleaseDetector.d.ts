/**
 * Release Signal Detection Engine
 *
 * Monitors workflow events and analyzes completion documentation to detect
 * when releases should occur. Implements intelligent confidence scoring
 * and evidence collection for release decisions.
 */
import { ReleaseDetector as IReleaseDetector } from '../interfaces/ReleaseInterfaces';
import { ReleaseSignal, ReleaseAnalysis, ValidationResult } from '../types/ReleaseTypes';
import { DetectionConfig } from '../config/ReleaseConfig';
export declare class ReleaseDetector implements IReleaseDetector {
    private config;
    constructor(config: DetectionConfig);
    /**
     * Detect release signal from task completion
     * Analyzes task completion to determine if a patch release is warranted
     */
    detectReleaseFromTaskCompletion(taskPath: string, taskName: string): Promise<ReleaseSignal | null>;
    /**
     * Detect release signal from spec completion
     * Spec completion typically triggers a minor version bump
     */
    detectReleaseFromSpecCompletion(specPath: string): Promise<ReleaseSignal | null>;
    /**
     * Analyze completion documents for release-relevant information
     */
    analyzeCompletionDocuments(documentsPath: string): Promise<ReleaseAnalysis>;
    /**
     * Validate that a release signal is ready for processing
     */
    validateReleaseReadiness(signal: ReleaseSignal): Promise<ValidationResult>;
    /**
     * Calculate confidence score for release analysis
     */
    calculateConfidence(analysis: ReleaseAnalysis): number;
    private analyzeTaskSignificance;
    private analyzeCompletionContent;
    private extractTaskContext;
    private findCompletionDocumentPath;
    private determineAffectedPackages;
    private extractBreakingChanges;
    private extractFeatures;
    private extractBugFixes;
    private extractImprovements;
    private extractAffectedAPIs;
    private extractRequirements;
    private extractArtifacts;
    private calculateAnalysisConfidence;
    private matchesPattern;
}
//# sourceMappingURL=ReleaseDetector.d.ts.map