"use strict";
/**
 * Confidence Metrics System
 *
 * Provides comprehensive confidence scoring, quality indicators, and uncertainty
 * flagging for extracted changes in the release analysis system.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfidenceMetrics = void 0;
class ConfidenceMetrics {
    constructor(thresholds) {
        this.thresholds = thresholds;
    }
    /**
     * Calculate comprehensive confidence score for extracted changes
     */
    calculateConfidenceScore(changes, documents, patternMatches, sectionMatches) {
        // Calculate component scores
        const extractionScore = this.calculateExtractionConfidence(changes, documents, patternMatches, sectionMatches);
        const categorizationScore = this.calculateCategorizationConfidence(changes);
        const completenessScore = this.calculateCompletenessConfidence(changes, documents);
        const consistencyScore = this.calculateConsistencyConfidence(changes, patternMatches, sectionMatches);
        // Calculate overall confidence as weighted average
        const overall = (extractionScore * 0.3 +
            categorizationScore * 0.25 +
            completenessScore * 0.25 +
            consistencyScore * 0.2);
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
    calculateItemConfidence(item, context) {
        const factors = [];
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
    generateQualityReport(confidenceScore, changes) {
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
    calculateExtractionConfidence(changes, documents, patternMatches, sectionMatches) {
        if (documents.length === 0)
            return 0;
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
    calculateCategorizationConfidence(changes) {
        const totalItems = changes.breakingChanges.length + changes.newFeatures.length +
            changes.bugFixes.length + changes.improvements.length;
        if (totalItems === 0)
            return 0.5;
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
    calculateCompletenessConfidence(changes, documents) {
        if (documents.length === 0)
            return 0;
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
    calculateConsistencyConfidence(changes, patternMatches, sectionMatches) {
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
    generateQualityIndicators(changes, documents, componentScores) {
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
    identifyUncertainties(changes, documents, componentScores) {
        const uncertainties = [];
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
                affectedItems: changes.metadata.deduplication.uncertainDuplicates.map(dup => dup.items.map(item => item.id).join(', '))
            });
        }
        return uncertainties;
    }
    /**
     * Validate confidence against thresholds
     */
    validateConfidence(overallConfidence, componentScores) {
        const violations = [];
        const recommendations = [];
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
        const status = meetsThresholds ? 'pass' :
            overallConfidence < this.thresholds.minimumConfidence ? 'fail' : 'warning';
        return {
            meetsThresholds,
            thresholdViolations: violations,
            recommendations,
            status
        };
    }
    // Helper methods for scoring various aspects
    scoreDocumentStructure(document) {
        const content = document.content;
        let score = 0.5; // Base score
        // Check for structured sections
        const hasHeaders = /^#{1,6}\s+/m.test(content);
        if (hasHeaders)
            score += 0.2;
        // Check for lists
        const hasLists = /^[-*+]\s+/m.test(content) || /^\d+\.\s+/m.test(content);
        if (hasLists)
            score += 0.15;
        // Check for metadata
        const hasMetadata = /\*\*[^*]+\*\*:\s+/m.test(content);
        if (hasMetadata)
            score += 0.1;
        // Check for clear sections
        const sectionCount = (content.match(/^#{1,6}\s+/gm) || []).length;
        if (sectionCount >= 3)
            score += 0.05;
        return Math.min(1, score);
    }
    scoreExtractionMethod(method, structure) {
        if (structure === 'structured') {
            return method === 'section' ? 0.9 : method === 'mixed' ? 0.8 : 0.6;
        }
        else {
            return method === 'pattern' ? 0.7 : method === 'mixed' ? 0.6 : 0.4;
        }
    }
    scoreItemCompleteness(item) {
        let score = 0.3; // Base score
        // Check for title
        if (item.title && item.title.length > 5)
            score += 0.2;
        // Check for description
        if (item.description && item.description.length > 20)
            score += 0.2;
        // Check for source
        if (item.source)
            score += 0.1;
        // Type-specific completeness
        if ('affectedAPIs' in item && item.affectedAPIs?.length > 0)
            score += 0.1;
        if ('benefits' in item && item.benefits?.length > 0)
            score += 0.1;
        if ('artifacts' in item && item.artifacts?.length > 0)
            score += 0.1;
        return Math.min(1, score);
    }
    scoreItemCategorization(item) {
        let score = 0.5; // Base score
        // Check for type-specific indicators
        if ('severity' in item && item.severity)
            score += 0.2;
        if ('category' in item && item.category)
            score += 0.2;
        if ('type' in item && item.type)
            score += 0.2;
        if ('impact' in item && item.impact)
            score += 0.1;
        return Math.min(1, score);
    }
    identifyItemUncertainties(item, confidence, factors) {
        const uncertainties = [];
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
    scoreBreakingChangesCategorization(breakingChanges) {
        if (breakingChanges.length === 0)
            return 1;
        let totalScore = 0;
        for (const change of breakingChanges) {
            let score = 0.5;
            if (change.affectedAPIs.length > 0)
                score += 0.2;
            if (change.migrationGuidance)
                score += 0.2;
            if (change.severity && change.severity !== 'low')
                score += 0.1;
            totalScore += Math.min(1, score);
        }
        return totalScore / breakingChanges.length;
    }
    scoreFeaturesCategorization(features) {
        if (features.length === 0)
            return 1;
        let totalScore = 0;
        for (const feature of features) {
            let score = 0.5;
            if (feature.benefits.length > 0)
                score += 0.2;
            if (feature.artifacts.length > 0)
                score += 0.2;
            if (feature.category)
                score += 0.1;
            totalScore += Math.min(1, score);
        }
        return totalScore / features.length;
    }
    scoreBugFixesCategorization(bugFixes) {
        if (bugFixes.length === 0)
            return 1;
        let totalScore = 0;
        for (const bugFix of bugFixes) {
            let score = 0.5;
            if (bugFix.issueNumber)
                score += 0.2;
            if (bugFix.affectedComponents.length > 0)
                score += 0.2;
            if (bugFix.severity)
                score += 0.1;
            totalScore += Math.min(1, score);
        }
        return totalScore / bugFixes.length;
    }
    scoreImprovementsCategorization(improvements) {
        if (improvements.length === 0)
            return 1;
        let totalScore = 0;
        for (const improvement of improvements) {
            let score = 0.5;
            if (improvement.type && improvement.type !== 'other')
                score += 0.25;
            if (improvement.impact)
                score += 0.25;
            totalScore += Math.min(1, score);
        }
        return totalScore / improvements.length;
    }
    scoreInformationRichness(changes) {
        const totalItems = changes.breakingChanges.length + changes.newFeatures.length +
            changes.bugFixes.length + changes.improvements.length;
        if (totalItems === 0)
            return 0.3;
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
    scoreDocumentCoverage(changes, documents) {
        if (documents.length === 0)
            return 0;
        const totalItems = changes.breakingChanges.length + changes.newFeatures.length +
            changes.bugFixes.length + changes.improvements.length;
        // Expect at least 1 change per 2 documents on average
        const expectedItems = documents.length * 0.5;
        const coverage = Math.min(1, totalItems / expectedItems);
        return coverage;
    }
    scoreChangeTypeDistribution(changes) {
        const counts = [
            changes.breakingChanges.length,
            changes.newFeatures.length,
            changes.bugFixes.length,
            changes.improvements.length
        ];
        const totalItems = counts.reduce((sum, count) => sum + count, 0);
        if (totalItems === 0)
            return 0.5;
        // Good distribution has multiple types of changes
        const nonZeroTypes = counts.filter(count => count > 0).length;
        return Math.min(1, nonZeroTypes / 4);
    }
    scorePatternConsistency(patternMatches) {
        if (patternMatches.length === 0)
            return 0.5;
        const avgConfidence = patternMatches.reduce((sum, match) => sum + match.confidence, 0) / patternMatches.length;
        const confidenceVariance = patternMatches.reduce((sum, match) => sum + Math.pow(match.confidence - avgConfidence, 2), 0) / patternMatches.length;
        // Lower variance indicates more consistent matching
        const consistencyScore = Math.max(0, 1 - confidenceVariance);
        return (avgConfidence + consistencyScore) / 2;
    }
    scoreSectionConsistency(sectionMatches) {
        if (sectionMatches.length === 0)
            return 0.5;
        const avgConfidence = sectionMatches.reduce((sum, match) => sum + match.confidence, 0) / sectionMatches.length;
        const confidenceVariance = sectionMatches.reduce((sum, match) => sum + Math.pow(match.confidence - avgConfidence, 2), 0) / sectionMatches.length;
        // Lower variance indicates more consistent matching
        const consistencyScore = Math.max(0, 1 - confidenceVariance);
        return (avgConfidence + consistencyScore) / 2;
    }
    calculateStructureQuality(documents) {
        if (documents.length === 0)
            return 0;
        let totalScore = 0;
        for (const doc of documents) {
            totalScore += this.scoreDocumentStructure(doc);
        }
        return totalScore / documents.length;
    }
    generateQualitySummary(confidenceScore, changes) {
        const status = confidenceScore.validation.status;
        const confidence = (confidenceScore.overall * 100).toFixed(1);
        const totalItems = changes.breakingChanges.length + changes.newFeatures.length +
            changes.bugFixes.length + changes.improvements.length;
        return `Extraction ${status.toUpperCase()}: ${confidence}% confidence with ${totalItems} changes extracted from ${changes.metadata.documentsAnalyzed} documents.`;
    }
    generateQualityDetails(confidenceScore, changes) {
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
    generateQualityRecommendations(confidenceScore) {
        return confidenceScore.validation.recommendations.map(rec => `${rec.priority.toUpperCase()}: ${rec.description}`);
    }
    generateActionItems(confidenceScore) {
        const actions = [];
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
exports.ConfidenceMetrics = ConfidenceMetrics;
//# sourceMappingURL=ConfidenceMetrics.js.map