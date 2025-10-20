/**
 * Confidence Metrics System
 * 
 * Provides comprehensive confidence scoring, quality indicators, and uncertainty
 * flagging for extracted changes in the release analysis system.
 */

import { 
  ExtractedChanges, 
  ExtractionMetadata, 
  BreakingChange, 
  Feature, 
  BugFix, 
  Improvement,
  DocumentationChange,
  CompletionDocument,
  PatternMatch,
  SectionMatch
} from '../types/AnalysisTypes';
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

export class ConfidenceMetrics {
  private thresholds: ConfidenceThresholds;

  constructor(thresholds: ConfidenceThresholds) {
    this.thresholds = thresholds;
  }

  /**
   * Calculate comprehensive confidence score for extracted changes
   */
  public calculateConfidenceScore(
    changes: ExtractedChanges,
    documents: CompletionDocument[],
    patternMatches?: PatternMatch[],
    sectionMatches?: SectionMatch[]
  ): ConfidenceScore {
    // Calculate component scores
    const extractionScore = this.calculateExtractionConfidence(changes, documents, patternMatches, sectionMatches);
    const categorizationScore = this.calculateCategorizationConfidence(changes);
    const completenessScore = this.calculateCompletenessConfidence(changes, documents);
    const consistencyScore = this.calculateConsistencyConfidence(changes, patternMatches, sectionMatches);

    // Calculate overall confidence as weighted average
    const overall = (
      extractionScore * 0.3 +
      categorizationScore * 0.25 +
      completenessScore * 0.25 +
      consistencyScore * 0.2
    );

    // Generate quality indicators
    const quality = this.generateQualityIndicators(changes, documents, {
      extraction: extractionScore,
      categorization: categorizationScore,
      completeness: completenessScore,
      consistency: consistencyScore
    });

    // Identify uncertainties
    const uncertainties = this.identifyUncertainties(changes, documents, {
      extraction: extractionScore,
      categorization: categorizationScore,
      completeness: completenessScore,
      consistency: consistencyScore
    });

    // Validate confidence against thresholds
    const validation = this.validateConfidence(overall, {
      extraction: extractionScore,
      categorization: categorizationScore,
      completeness: completenessScore,
      consistency: consistencyScore
    });

    return {
      overall,
      components: {
        extraction: extractionScore,
        categorization: categorizationScore,
        completeness: completenessScore,
        consistency: consistencyScore
      },
      quality,
      uncertainties,
      validation
    };
  }

  /**
   * Calculate confidence for individual change items
   */
  public calculateItemConfidence(
    item: BreakingChange | Feature | BugFix | Improvement | DocumentationChange,
    context: {
      patternMatch?: PatternMatch;
      sectionMatch?: SectionMatch;
      documentStructure: 'structured' | 'unstructured';
      extractionMethod: 'pattern' | 'section' | 'mixed';
    }
  ): ItemConfidenceScore {
    const factors: ConfidenceFactor[] = [];

    // Factor 1: Extraction method confidence
    const extractionMethodScore = this.scoreExtractionMethod(context.extractionMethod, context.documentStructure);
    factors.push({
      name: 'extraction-method',
      weight: 0.3,
      score: extractionMethodScore,
      explanation: `Confidence based on ${context.extractionMethod} extraction from ${context.documentStructure} document`
    });

    // Factor 2: Pattern/Section match confidence
    const matchScore = context.patternMatch?.confidence || context.sectionMatch?.confidence || 0.5;
    factors.push({
      name: 'pattern-match',
      weight: 0.25,
      score: matchScore,
      explanation: `Confidence from pattern/section matching: ${(matchScore * 100).toFixed(1)}%`
    });

    // Factor 3: Information completeness
    const completenessScore = this.scoreItemCompleteness(item);
    factors.push({
      name: 'information-completeness',
      weight: 0.25,
      score: completenessScore,
      explanation: `Information richness and completeness score`
    });

    // Factor 4: Categorization certainty
    const categorizationScore = this.scoreItemCategorization(item);
    factors.push({
      name: 'categorization-certainty',
      weight: 0.2,
      score: categorizationScore,
      explanation: `Confidence in change type categorization`
    });

    // Calculate weighted confidence
    const confidence = factors.reduce((sum, factor) => sum + (factor.score * factor.weight), 0);

    // Identify uncertainties for this item
    const uncertainties = this.identifyItemUncertainties(item, confidence, factors);

    return {
      confidence,
      factors,
      uncertainties
    };
  }

  /**
   * Generate quality report for extraction results
   */
  public generateQualityReport(confidenceScore: ConfidenceScore, changes: ExtractedChanges): {
    summary: string;
    details: QualityReportSection[];
    recommendations: string[];
    actionItems: string[];
  } {
    const summary = this.generateQualitySummary(confidenceScore, changes);
    const details = this.generateQualityDetails(confidenceScore, changes);
    const recommendations = this.generateQualityRecommendations(confidenceScore);
    const actionItems = this.generateActionItems(confidenceScore);

    return {
      summary,
      details,
      recommendations,
      actionItems
    };
  }

  /**
   * Calculate extraction confidence based on pattern/section matches
   */
  private calculateExtractionConfidence(
    changes: ExtractedChanges,
    documents: CompletionDocument[],
    patternMatches?: PatternMatch[],
    sectionMatches?: SectionMatch[]
  ): number {
    if (documents.length === 0) return 0;

    let totalScore = 0;
    let scoreCount = 0;

    // Score based on document structure quality
    for (const doc of documents) {
      const structureScore = this.scoreDocumentStructure(doc);
      totalScore += structureScore;
      scoreCount++;
    }

    // Score based on pattern match quality
    if (patternMatches && patternMatches.length > 0) {
      const patternScore = patternMatches.reduce((sum, match) => sum + match.confidence, 0) / patternMatches.length;
      totalScore += patternScore;
      scoreCount++;
    }

    // Score based on section match quality
    if (sectionMatches && sectionMatches.length > 0) {
      const sectionScore = sectionMatches.reduce((sum, match) => sum + match.confidence, 0) / sectionMatches.length;
      totalScore += sectionScore;
      scoreCount++;
    }

    // Adjust for extraction success rate
    const totalItems = changes.breakingChanges.length + changes.newFeatures.length + 
                      changes.bugFixes.length + changes.improvements.length;
    const extractionSuccessRate = totalItems > 0 ? Math.min(1, totalItems / documents.length) : 0.3;

    const baseScore = scoreCount > 0 ? totalScore / scoreCount : 0.5;
    return Math.min(1, baseScore * (0.7 + extractionSuccessRate * 0.3));
  }

  /**
   * Calculate categorization confidence
   */
  private calculateCategorizationConfidence(changes: ExtractedChanges): number {
    const totalItems = changes.breakingChanges.length + changes.newFeatures.length + 
                      changes.bugFixes.length + changes.improvements.length;

    if (totalItems === 0) return 0.5;

    // Score based on categorization clarity
    let categorizationScore = 0;

    // Breaking changes should have clear indicators
    const breakingScore = this.scoreBreakingChangesCategorization(changes.breakingChanges);
    categorizationScore += breakingScore * (changes.breakingChanges.length / totalItems);

    // Features should have clear benefits/artifacts
    const featureScore = this.scoreFeaturesCategorization(changes.newFeatures);
    categorizationScore += featureScore * (changes.newFeatures.length / totalItems);

    // Bug fixes should have clear issue indicators
    const bugFixScore = this.scoreBugFixesCategorization(changes.bugFixes);
    categorizationScore += bugFixScore * (changes.bugFixes.length / totalItems);

    // Improvements should have clear type/impact
    const improvementScore = this.scoreImprovementsCategorization(changes.improvements);
    categorizationScore += improvementScore * (changes.improvements.length / totalItems);

    // Reduce score if there are many ambiguous items
    const ambiguousRatio = changes.metadata.ambiguousItems.length / Math.max(1, totalItems);
    const ambiguityPenalty = Math.min(0.3, ambiguousRatio * 0.5);

    return Math.max(0.1, categorizationScore - ambiguityPenalty);
  }

  /**
   * Calculate completeness confidence
   */
  private calculateCompletenessConfidence(changes: ExtractedChanges, documents: CompletionDocument[]): number {
    if (documents.length === 0) return 0;

    // Score based on information richness
    const informationScore = this.scoreInformationRichness(changes);

    // Score based on document coverage
    const coverageScore = this.scoreDocumentCoverage(changes, documents);

    // Score based on change type distribution
    const distributionScore = this.scoreChangeTypeDistribution(changes);

    return (informationScore * 0.4 + coverageScore * 0.3 + distributionScore * 0.3);
  }

  /**
   * Calculate consistency confidence
   */
  private calculateConsistencyConfidence(
    changes: ExtractedChanges,
    patternMatches?: PatternMatch[],
    sectionMatches?: SectionMatch[]
  ): number {
    let consistencyScore = 0.5; // Base score

    // Check pattern match consistency
    if (patternMatches && patternMatches.length > 0) {
      const patternConsistency = this.scorePatternConsistency(patternMatches);
      consistencyScore = Math.max(consistencyScore, patternConsistency);
    }

    // Check section match consistency
    if (sectionMatches && sectionMatches.length > 0) {
      const sectionConsistency = this.scoreSectionConsistency(sectionMatches);
      consistencyScore = Math.max(consistencyScore, sectionConsistency);
    }

    // Check deduplication effectiveness
    if (changes.metadata.deduplication) {
      const deduplicationScore = Math.min(1, changes.metadata.deduplication.effectiveness + 0.5);
      consistencyScore = (consistencyScore + deduplicationScore) / 2;
    }

    return consistencyScore;
  }

  /**
   * Generate quality indicators
   */
  private generateQualityIndicators(
    changes: ExtractedChanges,
    documents: CompletionDocument[],
    componentScores: { extraction: number; categorization: number; completeness: number; consistency: number }
  ): QualityIndicators {
    return {
      completeness: componentScores.completeness,
      consistency: componentScores.consistency,
      structureQuality: this.calculateStructureQuality(documents),
      categorizationAccuracy: componentScores.categorization,
      informationRichness: this.scoreInformationRichness(changes)
    };
  }

  /**
   * Identify uncertainties in the extraction
   */
  private identifyUncertainties(
    changes: ExtractedChanges,
    documents: CompletionDocument[],
    componentScores: { extraction: number; categorization: number; completeness: number; consistency: number }
  ): UncertaintyFlag[] {
    const uncertainties: UncertaintyFlag[] = [];

    // Check for ambiguous categorization
    if (changes.metadata.ambiguousItems.length > 0) {
      uncertainties.push({
        type: 'ambiguous-categorization',
        severity: changes.metadata.ambiguousItems.length > 3 ? 'high' : 'medium',
        description: `${changes.metadata.ambiguousItems.length} items have ambiguous categorization`,
        source: 'extraction-analysis',
        suggestedAction: 'Review ambiguous items for proper categorization',
        affectedItems: changes.metadata.ambiguousItems
      });
    }

    // Check for low confidence extraction
    if (componentScores.extraction < this.thresholds.uncertaintyThreshold) {
      uncertainties.push({
        type: 'low-confidence-extraction',
        severity: componentScores.extraction < 0.5 ? 'high' : 'medium',
        description: `Extraction confidence (${(componentScores.extraction * 100).toFixed(1)}%) below threshold`,
        source: 'confidence-analysis',
        suggestedAction: 'Review extraction patterns and document structure',
        affectedItems: ['overall-extraction']
      });
    }

    // Check for incomplete information
    if (componentScores.completeness < 0.6) {
      uncertainties.push({
        type: 'incomplete-information',
        severity: componentScores.completeness < 0.4 ? 'high' : 'medium',
        description: `Information completeness (${(componentScores.completeness * 100).toFixed(1)}%) indicates missing details`,
        source: 'completeness-analysis',
        suggestedAction: 'Review documents for missing change information',
        affectedItems: ['information-completeness']
      });
    }

    // Check for conflicting patterns
    if (componentScores.consistency < 0.6) {
      uncertainties.push({
        type: 'conflicting-patterns',
        severity: 'medium',
        description: `Pattern consistency (${(componentScores.consistency * 100).toFixed(1)}%) suggests conflicting extraction results`,
        source: 'consistency-analysis',
        suggestedAction: 'Review extraction patterns for conflicts',
        affectedItems: ['pattern-consistency']
      });
    }

    // Check for uncertain duplicates
    if (changes.metadata.deduplication?.uncertainDuplicates && changes.metadata.deduplication.uncertainDuplicates.length > 0) {
      uncertainties.push({
        type: 'missing-context',
        severity: 'medium',
        description: `${changes.metadata.deduplication.uncertainDuplicates.length} potential duplicate groups need review`,
        source: 'deduplication-analysis',
        suggestedAction: 'Review potential duplicates for manual resolution',
        affectedItems: changes.metadata.deduplication.uncertainDuplicates.map(dup => 
          dup.items.map(item => item.id).join(', ')
        )
      });
    }

    return uncertainties;
  }

  /**
   * Validate confidence against thresholds
   */
  private validateConfidence(
    overallConfidence: number,
    componentScores: { extraction: number; categorization: number; completeness: number; consistency: number }
  ): ConfidenceValidation {
    const violations: ThresholdViolation[] = [];
    const recommendations: ConfidenceRecommendation[] = [];

    // Check minimum confidence threshold
    if (overallConfidence < this.thresholds.minimumConfidence) {
      violations.push({
        threshold: 'minimumConfidence',
        expected: this.thresholds.minimumConfidence,
        actual: overallConfidence,
        impact: 'Overall extraction quality below acceptable threshold'
      });

      recommendations.push({
        type: 'review-extraction',
        priority: 'high',
        description: 'Overall confidence below minimum threshold',
        actions: [
          'Review extraction patterns and keywords',
          'Improve document structure and formatting',
          'Consider manual validation of results'
        ]
      });
    }

    // Check review threshold
    if (overallConfidence < this.thresholds.reviewThreshold) {
      recommendations.push({
        type: 'manual-validation',
        priority: 'medium',
        description: 'Confidence below review threshold',
        actions: [
          'Manually review extracted changes',
          'Validate categorization accuracy',
          'Check for missing information'
        ]
      });
    }

    // Check uncertainty threshold
    if (componentScores.extraction < this.thresholds.uncertaintyThreshold) {
      recommendations.push({
        type: 'improve-documentation',
        priority: 'medium',
        description: 'Extraction confidence indicates documentation quality issues',
        actions: [
          'Improve completion document structure',
          'Add clearer section headers',
          'Include more detailed change descriptions'
        ]
      });
    }

    const meetsThresholds = violations.length === 0;
    const status: 'pass' | 'warning' | 'fail' = 
      meetsThresholds ? 'pass' : 
      overallConfidence < this.thresholds.minimumConfidence ? 'fail' : 'warning';

    return {
      meetsThresholds,
      thresholdViolations: violations,
      recommendations,
      status
    };
  }

  // Helper methods for scoring various aspects

  private scoreDocumentStructure(document: CompletionDocument): number {
    const content = document.content;
    let score = 0.5; // Base score

    // Check for structured sections
    const hasHeaders = /^#{1,6}\s+/m.test(content);
    if (hasHeaders) score += 0.2;

    // Check for lists
    const hasLists = /^[-*+]\s+/m.test(content) || /^\d+\.\s+/m.test(content);
    if (hasLists) score += 0.15;

    // Check for metadata
    const hasMetadata = /\*\*[^*]+\*\*:\s+/m.test(content);
    if (hasMetadata) score += 0.1;

    // Check for clear sections
    const sectionCount = (content.match(/^#{1,6}\s+/gm) || []).length;
    if (sectionCount >= 3) score += 0.05;

    return Math.min(1, score);
  }

  private scoreExtractionMethod(method: string, structure: string): number {
    if (structure === 'structured') {
      return method === 'section' ? 0.9 : method === 'mixed' ? 0.8 : 0.6;
    } else {
      return method === 'pattern' ? 0.7 : method === 'mixed' ? 0.6 : 0.4;
    }
  }

  private scoreItemCompleteness(item: any): number {
    let score = 0.3; // Base score

    // Check for title
    if (item.title && item.title.length > 5) score += 0.2;

    // Check for description
    if (item.description && item.description.length > 20) score += 0.2;

    // Check for source
    if (item.source) score += 0.1;

    // Type-specific completeness
    if ('affectedAPIs' in item && item.affectedAPIs?.length > 0) score += 0.1;
    if ('benefits' in item && item.benefits?.length > 0) score += 0.1;
    if ('artifacts' in item && item.artifacts?.length > 0) score += 0.1;

    return Math.min(1, score);
  }

  private scoreItemCategorization(item: any): number {
    let score = 0.5; // Base score

    // Check for type-specific indicators
    if ('severity' in item && item.severity) score += 0.2;
    if ('category' in item && item.category) score += 0.2;
    if ('type' in item && item.type) score += 0.2;
    if ('impact' in item && item.impact) score += 0.1;

    return Math.min(1, score);
  }

  private identifyItemUncertainties(item: any, confidence: number, factors: ConfidenceFactor[]): string[] {
    const uncertainties: string[] = [];

    if (confidence < 0.6) {
      uncertainties.push('Low overall confidence score');
    }

    // Check individual factors
    for (const factor of factors) {
      if (factor.score < 0.5) {
        uncertainties.push(`Low ${factor.name} score: ${(factor.score * 100).toFixed(1)}%`);
      }
    }

    // Type-specific uncertainties
    if (!item.title || item.title.length < 5) {
      uncertainties.push('Missing or insufficient title');
    }

    if (!item.description || item.description.length < 10) {
      uncertainties.push('Missing or insufficient description');
    }

    return uncertainties;
  }

  private scoreBreakingChangesCategorization(breakingChanges: BreakingChange[]): number {
    if (breakingChanges.length === 0) return 1;

    let totalScore = 0;
    for (const change of breakingChanges) {
      let score = 0.5;
      if (change.affectedAPIs.length > 0) score += 0.2;
      if (change.migrationGuidance) score += 0.2;
      if (change.severity && change.severity !== 'low') score += 0.1;
      totalScore += Math.min(1, score);
    }

    return totalScore / breakingChanges.length;
  }

  private scoreFeaturesCategorization(features: Feature[]): number {
    if (features.length === 0) return 1;

    let totalScore = 0;
    for (const feature of features) {
      let score = 0.5;
      if (feature.benefits.length > 0) score += 0.2;
      if (feature.artifacts.length > 0) score += 0.2;
      if (feature.category) score += 0.1;
      totalScore += Math.min(1, score);
    }

    return totalScore / features.length;
  }

  private scoreBugFixesCategorization(bugFixes: BugFix[]): number {
    if (bugFixes.length === 0) return 1;

    let totalScore = 0;
    for (const bugFix of bugFixes) {
      let score = 0.5;
      if (bugFix.issueNumber) score += 0.2;
      if (bugFix.affectedComponents.length > 0) score += 0.2;
      if (bugFix.severity) score += 0.1;
      totalScore += Math.min(1, score);
    }

    return totalScore / bugFixes.length;
  }

  private scoreImprovementsCategorization(improvements: Improvement[]): number {
    if (improvements.length === 0) return 1;

    let totalScore = 0;
    for (const improvement of improvements) {
      let score = 0.5;
      if (improvement.type && improvement.type !== 'other') score += 0.25;
      if (improvement.impact) score += 0.25;
      totalScore += Math.min(1, score);
    }

    return totalScore / improvements.length;
  }

  private scoreInformationRichness(changes: ExtractedChanges): number {
    const totalItems = changes.breakingChanges.length + changes.newFeatures.length + 
                      changes.bugFixes.length + changes.improvements.length;

    if (totalItems === 0) return 0.3;

    let richness = 0;

    // Score based on detailed information
    const detailedItems = [
      ...changes.breakingChanges.filter(c => c.description.length > 50),
      ...changes.newFeatures.filter(f => f.benefits.length > 0 || f.artifacts.length > 0),
      ...changes.bugFixes.filter(b => b.affectedComponents.length > 0),
      ...changes.improvements.filter(i => i.type !== 'other')
    ];

    richness = detailedItems.length / totalItems;

    return Math.min(1, richness);
  }

  private scoreDocumentCoverage(changes: ExtractedChanges, documents: CompletionDocument[]): number {
    if (documents.length === 0) return 0;

    const totalItems = changes.breakingChanges.length + changes.newFeatures.length + 
                      changes.bugFixes.length + changes.improvements.length;

    // Expect at least 1 change per 2 documents on average
    const expectedItems = documents.length * 0.5;
    const coverage = Math.min(1, totalItems / expectedItems);

    return coverage;
  }

  private scoreChangeTypeDistribution(changes: ExtractedChanges): number {
    const counts = [
      changes.breakingChanges.length,
      changes.newFeatures.length,
      changes.bugFixes.length,
      changes.improvements.length
    ];

    const totalItems = counts.reduce((sum, count) => sum + count, 0);
    if (totalItems === 0) return 0.5;

    // Good distribution has multiple types of changes
    const nonZeroTypes = counts.filter(count => count > 0).length;
    return Math.min(1, nonZeroTypes / 4);
  }

  private scorePatternConsistency(patternMatches: PatternMatch[]): number {
    if (patternMatches.length === 0) return 0.5;

    const avgConfidence = patternMatches.reduce((sum, match) => sum + match.confidence, 0) / patternMatches.length;
    const confidenceVariance = patternMatches.reduce((sum, match) => 
      sum + Math.pow(match.confidence - avgConfidence, 2), 0) / patternMatches.length;

    // Lower variance indicates more consistent matching
    const consistencyScore = Math.max(0, 1 - confidenceVariance);
    return (avgConfidence + consistencyScore) / 2;
  }

  private scoreSectionConsistency(sectionMatches: SectionMatch[]): number {
    if (sectionMatches.length === 0) return 0.5;

    const avgConfidence = sectionMatches.reduce((sum, match) => sum + match.confidence, 0) / sectionMatches.length;
    const confidenceVariance = sectionMatches.reduce((sum, match) => 
      sum + Math.pow(match.confidence - avgConfidence, 2), 0) / sectionMatches.length;

    // Lower variance indicates more consistent matching
    const consistencyScore = Math.max(0, 1 - confidenceVariance);
    return (avgConfidence + consistencyScore) / 2;
  }

  private calculateStructureQuality(documents: CompletionDocument[]): number {
    if (documents.length === 0) return 0;

    let totalScore = 0;
    for (const doc of documents) {
      totalScore += this.scoreDocumentStructure(doc);
    }

    return totalScore / documents.length;
  }

  private generateQualitySummary(confidenceScore: ConfidenceScore, changes: ExtractedChanges): string {
    const status = confidenceScore.validation.status;
    const confidence = (confidenceScore.overall * 100).toFixed(1);
    const totalItems = changes.breakingChanges.length + changes.newFeatures.length + 
                      changes.bugFixes.length + changes.improvements.length;

    return `Extraction ${status.toUpperCase()}: ${confidence}% confidence with ${totalItems} changes extracted from ${changes.metadata.documentsAnalyzed} documents.`;
  }

  private generateQualityDetails(confidenceScore: ConfidenceScore, changes: ExtractedChanges): QualityReportSection[] {
    return [
      {
        title: 'Confidence Components',
        content: `Extraction: ${(confidenceScore.components.extraction * 100).toFixed(1)}%, Categorization: ${(confidenceScore.components.categorization * 100).toFixed(1)}%, Completeness: ${(confidenceScore.components.completeness * 100).toFixed(1)}%, Consistency: ${(confidenceScore.components.consistency * 100).toFixed(1)}%`
      },
      {
        title: 'Quality Indicators',
        content: `Structure Quality: ${(confidenceScore.quality.structureQuality * 100).toFixed(1)}%, Information Richness: ${(confidenceScore.quality.informationRichness * 100).toFixed(1)}%`
      },
      {
        title: 'Uncertainties',
        content: `${confidenceScore.uncertainties.length} uncertainty flags identified${confidenceScore.uncertainties.length > 0 ? ': ' + confidenceScore.uncertainties.map(u => u.type).join(', ') : ''}`
      }
    ];
  }

  private generateQualityRecommendations(confidenceScore: ConfidenceScore): string[] {
    return confidenceScore.validation.recommendations.map(rec => 
      `${rec.priority.toUpperCase()}: ${rec.description}`
    );
  }

  private generateActionItems(confidenceScore: ConfidenceScore): string[] {
    const actions: string[] = [];

    for (const uncertainty of confidenceScore.uncertainties) {
      if (uncertainty.severity === 'high') {
        actions.push(`HIGH PRIORITY: ${uncertainty.suggestedAction}`);
      }
    }

    for (const recommendation of confidenceScore.validation.recommendations) {
      if (recommendation.priority === 'high') {
        actions.push(...recommendation.actions);
      }
    }

    return actions;
  }
}

export interface QualityReportSection {
  title: string;
  content: string;
}