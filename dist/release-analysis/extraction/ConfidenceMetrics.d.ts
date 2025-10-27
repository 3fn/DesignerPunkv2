/**
 * Confidence Metrics System
 *
 * Provides comprehensive confidence scoring, quality indicators, and uncertainty
 * flagging for extracted changes in the release analysis system.
 */
import { ExtractedChanges, BreakingChange, Feature, BugFix, Improvement, DocumentationChange, CompletionDocument, PatternMatch, SectionMatch } from '../types/AnalysisTypes';
import { ConfidenceThresholds } from '../config/AnalysisConfig';
export interface ConfidenceScore {
    /** Overall confidence score (0-1) */
    overall: number;
    /** Individual component scores */
    components: {
        extraction: number;
        categorization: number;
        completeness: number;
        consistency: number;
    };
    /** Quality indicators */
    quality: QualityIndicators;
    /** Uncertainty flags */
    uncertainties: UncertaintyFlag[];
    /** Validation results */
    validation: ConfidenceValidation;
}
export interface QualityIndicators {
    /** Extraction completeness score (0-1) */
    completeness: number;
    /** Pattern match consistency (0-1) */
    consistency: number;
    /** Document structure quality (0-1) */
    structureQuality: number;
    /** Change categorization accuracy (0-1) */
    categorizationAccuracy: number;
    /** Information richness (0-1) */
    informationRichness: number;
}
export interface UncertaintyFlag {
    /** Type of uncertainty */
    type: 'ambiguous-categorization' | 'low-confidence-extraction' | 'incomplete-information' | 'conflicting-patterns' | 'missing-context';
    /** Severity level */
    severity: 'low' | 'medium' | 'high';
    /** Description of the uncertainty */
    description: string;
    /** Source of the uncertainty */
    source: string;
    /** Suggested action */
    suggestedAction: string;
    /** Items affected by this uncertainty */
    affectedItems: string[];
}
export interface ConfidenceValidation {
    /** Whether confidence meets minimum thresholds */
    meetsThresholds: boolean;
    /** Specific threshold violations */
    thresholdViolations: ThresholdViolation[];
    /** Recommendations for improvement */
    recommendations: ConfidenceRecommendation[];
    /** Overall validation status */
    status: 'pass' | 'warning' | 'fail';
}
export interface ThresholdViolation {
    /** Threshold that was violated */
    threshold: keyof ConfidenceThresholds;
    /** Expected minimum value */
    expected: number;
    /** Actual value */
    actual: number;
    /** Impact of the violation */
    impact: string;
}
export interface ConfidenceRecommendation {
    /** Type of recommendation */
    type: 'review-extraction' | 'improve-documentation' | 'manual-validation' | 'adjust-thresholds';
    /** Priority level */
    priority: 'low' | 'medium' | 'high';
    /** Recommendation description */
    description: string;
    /** Specific actions to take */
    actions: string[];
}
export interface ItemConfidenceScore {
    /** Individual item confidence (0-1) */
    confidence: number;
    /** Factors contributing to confidence */
    factors: ConfidenceFactor[];
    /** Uncertainty indicators for this item */
    uncertainties: string[];
}
export interface ConfidenceFactor {
    /** Factor name */
    name: string;
    /** Factor weight in overall score */
    weight: number;
    /** Factor score (0-1) */
    score: number;
    /** Explanation of the factor */
    explanation: string;
}
export declare class ConfidenceMetrics {
    private thresholds;
    constructor(thresholds: ConfidenceThresholds);
    /**
     * Calculate comprehensive confidence score for extracted changes
     */
    calculateConfidenceScore(changes: ExtractedChanges, documents: CompletionDocument[], patternMatches?: PatternMatch[], sectionMatches?: SectionMatch[]): ConfidenceScore;
    /**
     * Calculate confidence for individual change items
     */
    calculateItemConfidence(item: BreakingChange | Feature | BugFix | Improvement | DocumentationChange, context: {
        patternMatch?: PatternMatch;
        sectionMatch?: SectionMatch;
        documentStructure: 'structured' | 'unstructured';
        extractionMethod: 'pattern' | 'section' | 'mixed';
    }): ItemConfidenceScore;
    /**
     * Generate quality report for extraction results
     */
    generateQualityReport(confidenceScore: ConfidenceScore, changes: ExtractedChanges): {
        summary: string;
        details: QualityReportSection[];
        recommendations: string[];
        actionItems: string[];
    };
    /**
     * Calculate extraction confidence based on pattern/section matches
     */
    private calculateExtractionConfidence;
    /**
     * Calculate categorization confidence
     */
    private calculateCategorizationConfidence;
    /**
     * Calculate completeness confidence
     */
    private calculateCompletenessConfidence;
    /**
     * Calculate consistency confidence
     */
    private calculateConsistencyConfidence;
    /**
     * Generate quality indicators
     */
    private generateQualityIndicators;
    /**
     * Identify uncertainties in the extraction
     */
    private identifyUncertainties;
    /**
     * Validate confidence against thresholds
     */
    private validateConfidence;
    private scoreDocumentStructure;
    private scoreExtractionMethod;
    private scoreItemCompleteness;
    private scoreItemCategorization;
    private identifyItemUncertainties;
    private scoreBreakingChangesCategorization;
    private scoreFeaturesCategorization;
    private scoreBugFixesCategorization;
    private scoreImprovementsCategorization;
    private scoreInformationRichness;
    private scoreDocumentCoverage;
    private scoreChangeTypeDistribution;
    private scorePatternConsistency;
    private scoreSectionConsistency;
    private calculateStructureQuality;
    private generateQualitySummary;
    private generateQualityDetails;
    private generateQualityRecommendations;
    private generateActionItems;
}
export interface QualityReportSection {
    title: string;
    content: string;
}
//# sourceMappingURL=ConfidenceMetrics.d.ts.map