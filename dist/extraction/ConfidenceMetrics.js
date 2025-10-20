"use strict";
/**
 * Confidence Metrics System
 *
 * Provides comprehensive confidence scoring, quality indicators, and uncertainty
 * flagging for extracted changes in the release analysis system.
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfidenceMetrics = void 0;
var ConfidenceMetrics = /** @class */ (function () {
    function ConfidenceMetrics(thresholds) {
        this.thresholds = thresholds;
    }
    /**
     * Calculate comprehensive confidence score for extracted changes
     */
    ConfidenceMetrics.prototype.calculateConfidenceScore = function (changes, documents, patternMatches, sectionMatches) {
        // Calculate component scores
        var extractionScore = this.calculateExtractionConfidence(changes, documents, patternMatches, sectionMatches);
        var categorizationScore = this.calculateCategorizationConfidence(changes);
        var completenessScore = this.calculateCompletenessConfidence(changes, documents);
        var consistencyScore = this.calculateConsistencyConfidence(changes, patternMatches, sectionMatches);
        // Calculate overall confidence as weighted average
        var overall = (extractionScore * 0.3 +
            categorizationScore * 0.25 +
            completenessScore * 0.25 +
            consistencyScore * 0.2);
        // Generate quality indicators
        var quality = this.generateQualityIndicators(changes, documents, {
            extraction: extractionScore,
            categorization: categorizationScore,
            completeness: completenessScore,
            consistency: consistencyScore
        });
        // Identify uncertainties
        var uncertainties = this.identifyUncertainties(changes, documents, {
            extraction: extractionScore,
            categorization: categorizationScore,
            completeness: completenessScore,
            consistency: consistencyScore
        });
        // Validate confidence against thresholds
        var validation = this.validateConfidence(overall, {
            extraction: extractionScore,
            categorization: categorizationScore,
            completeness: completenessScore,
            consistency: consistencyScore
        });
        return {
            overall: overall,
            components: {
                extraction: extractionScore,
                categorization: categorizationScore,
                completeness: completenessScore,
                consistency: consistencyScore
            },
            quality: quality,
            uncertainties: uncertainties,
            validation: validation
        };
    };
    /**
     * Calculate confidence for individual change items
     */
    ConfidenceMetrics.prototype.calculateItemConfidence = function (item, context) {
        var _a, _b;
        var factors = [];
        // Factor 1: Extraction method confidence
        var extractionMethodScore = this.scoreExtractionMethod(context.extractionMethod, context.documentStructure);
        factors.push({
            name: 'extraction-method',
            weight: 0.3,
            score: extractionMethodScore,
            explanation: "Confidence based on ".concat(context.extractionMethod, " extraction from ").concat(context.documentStructure, " document")
        });
        // Factor 2: Pattern/Section match confidence
        var matchScore = ((_a = context.patternMatch) === null || _a === void 0 ? void 0 : _a.confidence) || ((_b = context.sectionMatch) === null || _b === void 0 ? void 0 : _b.confidence) || 0.5;
        factors.push({
            name: 'pattern-match',
            weight: 0.25,
            score: matchScore,
            explanation: "Confidence from pattern/section matching: ".concat((matchScore * 100).toFixed(1), "%")
        });
        // Factor 3: Information completeness
        var completenessScore = this.scoreItemCompleteness(item);
        factors.push({
            name: 'information-completeness',
            weight: 0.25,
            score: completenessScore,
            explanation: "Information richness and completeness score"
        });
        // Factor 4: Categorization certainty
        var categorizationScore = this.scoreItemCategorization(item);
        factors.push({
            name: 'categorization-certainty',
            weight: 0.2,
            score: categorizationScore,
            explanation: "Confidence in change type categorization"
        });
        // Calculate weighted confidence
        var confidence = factors.reduce(function (sum, factor) { return sum + (factor.score * factor.weight); }, 0);
        // Identify uncertainties for this item
        var uncertainties = this.identifyItemUncertainties(item, confidence, factors);
        return {
            confidence: confidence,
            factors: factors,
            uncertainties: uncertainties
        };
    };
    /**
     * Generate quality report for extraction results
     */
    ConfidenceMetrics.prototype.generateQualityReport = function (confidenceScore, changes) {
        var summary = this.generateQualitySummary(confidenceScore, changes);
        var details = this.generateQualityDetails(confidenceScore, changes);
        var recommendations = this.generateQualityRecommendations(confidenceScore);
        var actionItems = this.generateActionItems(confidenceScore);
        return {
            summary: summary,
            details: details,
            recommendations: recommendations,
            actionItems: actionItems
        };
    };
    /**
     * Calculate extraction confidence based on pattern/section matches
     */
    ConfidenceMetrics.prototype.calculateExtractionConfidence = function (changes, documents, patternMatches, sectionMatches) {
        if (documents.length === 0)
            return 0;
        var totalScore = 0;
        var scoreCount = 0;
        // Score based on document structure quality
        for (var _i = 0, documents_1 = documents; _i < documents_1.length; _i++) {
            var doc = documents_1[_i];
            var structureScore = this.scoreDocumentStructure(doc);
            totalScore += structureScore;
            scoreCount++;
        }
        // Score based on pattern match quality
        if (patternMatches && patternMatches.length > 0) {
            var patternScore = patternMatches.reduce(function (sum, match) { return sum + match.confidence; }, 0) / patternMatches.length;
            totalScore += patternScore;
            scoreCount++;
        }
        // Score based on section match quality
        if (sectionMatches && sectionMatches.length > 0) {
            var sectionScore = sectionMatches.reduce(function (sum, match) { return sum + match.confidence; }, 0) / sectionMatches.length;
            totalScore += sectionScore;
            scoreCount++;
        }
        // Adjust for extraction success rate
        var totalItems = changes.breakingChanges.length + changes.newFeatures.length +
            changes.bugFixes.length + changes.improvements.length;
        var extractionSuccessRate = totalItems > 0 ? Math.min(1, totalItems / documents.length) : 0.3;
        var baseScore = scoreCount > 0 ? totalScore / scoreCount : 0.5;
        return Math.min(1, baseScore * (0.7 + extractionSuccessRate * 0.3));
    };
    /**
     * Calculate categorization confidence
     */
    ConfidenceMetrics.prototype.calculateCategorizationConfidence = function (changes) {
        var totalItems = changes.breakingChanges.length + changes.newFeatures.length +
            changes.bugFixes.length + changes.improvements.length;
        if (totalItems === 0)
            return 0.5;
        // Score based on categorization clarity
        var categorizationScore = 0;
        // Breaking changes should have clear indicators
        var breakingScore = this.scoreBreakingChangesCategorization(changes.breakingChanges);
        categorizationScore += breakingScore * (changes.breakingChanges.length / totalItems);
        // Features should have clear benefits/artifacts
        var featureScore = this.scoreFeaturesCategorization(changes.newFeatures);
        categorizationScore += featureScore * (changes.newFeatures.length / totalItems);
        // Bug fixes should have clear issue indicators
        var bugFixScore = this.scoreBugFixesCategorization(changes.bugFixes);
        categorizationScore += bugFixScore * (changes.bugFixes.length / totalItems);
        // Improvements should have clear type/impact
        var improvementScore = this.scoreImprovementsCategorization(changes.improvements);
        categorizationScore += improvementScore * (changes.improvements.length / totalItems);
        // Reduce score if there are many ambiguous items
        var ambiguousRatio = changes.metadata.ambiguousItems.length / Math.max(1, totalItems);
        var ambiguityPenalty = Math.min(0.3, ambiguousRatio * 0.5);
        return Math.max(0.1, categorizationScore - ambiguityPenalty);
    };
    /**
     * Calculate completeness confidence
     */
    ConfidenceMetrics.prototype.calculateCompletenessConfidence = function (changes, documents) {
        if (documents.length === 0)
            return 0;
        // Score based on information richness
        var informationScore = this.scoreInformationRichness(changes);
        // Score based on document coverage
        var coverageScore = this.scoreDocumentCoverage(changes, documents);
        // Score based on change type distribution
        var distributionScore = this.scoreChangeTypeDistribution(changes);
        return (informationScore * 0.4 + coverageScore * 0.3 + distributionScore * 0.3);
    };
    /**
     * Calculate consistency confidence
     */
    ConfidenceMetrics.prototype.calculateConsistencyConfidence = function (changes, patternMatches, sectionMatches) {
        var consistencyScore = 0.5; // Base score
        // Check pattern match consistency
        if (patternMatches && patternMatches.length > 0) {
            var patternConsistency = this.scorePatternConsistency(patternMatches);
            consistencyScore = Math.max(consistencyScore, patternConsistency);
        }
        // Check section match consistency
        if (sectionMatches && sectionMatches.length > 0) {
            var sectionConsistency = this.scoreSectionConsistency(sectionMatches);
            consistencyScore = Math.max(consistencyScore, sectionConsistency);
        }
        // Check deduplication effectiveness
        if (changes.metadata.deduplication) {
            var deduplicationScore = Math.min(1, changes.metadata.deduplication.effectiveness + 0.5);
            consistencyScore = (consistencyScore + deduplicationScore) / 2;
        }
        return consistencyScore;
    };
    /**
     * Generate quality indicators
     */
    ConfidenceMetrics.prototype.generateQualityIndicators = function (changes, documents, componentScores) {
        return {
            completeness: componentScores.completeness,
            consistency: componentScores.consistency,
            structureQuality: this.calculateStructureQuality(documents),
            categorizationAccuracy: componentScores.categorization,
            informationRichness: this.scoreInformationRichness(changes)
        };
    };
    /**
     * Identify uncertainties in the extraction
     */
    ConfidenceMetrics.prototype.identifyUncertainties = function (changes, documents, componentScores) {
        var _a;
        var uncertainties = [];
        // Check for ambiguous categorization
        if (changes.metadata.ambiguousItems.length > 0) {
            uncertainties.push({
                type: 'ambiguous-categorization',
                severity: changes.metadata.ambiguousItems.length > 3 ? 'high' : 'medium',
                description: "".concat(changes.metadata.ambiguousItems.length, " items have ambiguous categorization"),
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
                description: "Extraction confidence (".concat((componentScores.extraction * 100).toFixed(1), "%) below threshold"),
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
                description: "Information completeness (".concat((componentScores.completeness * 100).toFixed(1), "%) indicates missing details"),
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
                description: "Pattern consistency (".concat((componentScores.consistency * 100).toFixed(1), "%) suggests conflicting extraction results"),
                source: 'consistency-analysis',
                suggestedAction: 'Review extraction patterns for conflicts',
                affectedItems: ['pattern-consistency']
            });
        }
        // Check for uncertain duplicates
        if (((_a = changes.metadata.deduplication) === null || _a === void 0 ? void 0 : _a.uncertainDuplicates) && changes.metadata.deduplication.uncertainDuplicates.length > 0) {
            uncertainties.push({
                type: 'missing-context',
                severity: 'medium',
                description: "".concat(changes.metadata.deduplication.uncertainDuplicates.length, " potential duplicate groups need review"),
                source: 'deduplication-analysis',
                suggestedAction: 'Review potential duplicates for manual resolution',
                affectedItems: changes.metadata.deduplication.uncertainDuplicates.map(function (dup) {
                    return dup.items.map(function (item) { return item.id; }).join(', ');
                })
            });
        }
        return uncertainties;
    };
    /**
     * Validate confidence against thresholds
     */
    ConfidenceMetrics.prototype.validateConfidence = function (overallConfidence, componentScores) {
        var violations = [];
        var recommendations = [];
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
        var meetsThresholds = violations.length === 0;
        var status = meetsThresholds ? 'pass' :
            overallConfidence < this.thresholds.minimumConfidence ? 'fail' : 'warning';
        return {
            meetsThresholds: meetsThresholds,
            thresholdViolations: violations,
            recommendations: recommendations,
            status: status
        };
    };
    // Helper methods for scoring various aspects
    ConfidenceMetrics.prototype.scoreDocumentStructure = function (document) {
        var content = document.content;
        var score = 0.5; // Base score
        // Check for structured sections
        var hasHeaders = /^#{1,6}\s+/m.test(content);
        if (hasHeaders)
            score += 0.2;
        // Check for lists
        var hasLists = /^[-*+]\s+/m.test(content) || /^\d+\.\s+/m.test(content);
        if (hasLists)
            score += 0.15;
        // Check for metadata
        var hasMetadata = /\*\*[^*]+\*\*:\s+/m.test(content);
        if (hasMetadata)
            score += 0.1;
        // Check for clear sections
        var sectionCount = (content.match(/^#{1,6}\s+/gm) || []).length;
        if (sectionCount >= 3)
            score += 0.05;
        return Math.min(1, score);
    };
    ConfidenceMetrics.prototype.scoreExtractionMethod = function (method, structure) {
        if (structure === 'structured') {
            return method === 'section' ? 0.9 : method === 'mixed' ? 0.8 : 0.6;
        }
        else {
            return method === 'pattern' ? 0.7 : method === 'mixed' ? 0.6 : 0.4;
        }
    };
    ConfidenceMetrics.prototype.scoreItemCompleteness = function (item) {
        var _a, _b, _c;
        var score = 0.3; // Base score
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
        if ('affectedAPIs' in item && ((_a = item.affectedAPIs) === null || _a === void 0 ? void 0 : _a.length) > 0)
            score += 0.1;
        if ('benefits' in item && ((_b = item.benefits) === null || _b === void 0 ? void 0 : _b.length) > 0)
            score += 0.1;
        if ('artifacts' in item && ((_c = item.artifacts) === null || _c === void 0 ? void 0 : _c.length) > 0)
            score += 0.1;
        return Math.min(1, score);
    };
    ConfidenceMetrics.prototype.scoreItemCategorization = function (item) {
        var score = 0.5; // Base score
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
    };
    ConfidenceMetrics.prototype.identifyItemUncertainties = function (item, confidence, factors) {
        var uncertainties = [];
        if (confidence < 0.6) {
            uncertainties.push('Low overall confidence score');
        }
        // Check individual factors
        for (var _i = 0, factors_1 = factors; _i < factors_1.length; _i++) {
            var factor = factors_1[_i];
            if (factor.score < 0.5) {
                uncertainties.push("Low ".concat(factor.name, " score: ").concat((factor.score * 100).toFixed(1), "%"));
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
    };
    ConfidenceMetrics.prototype.scoreBreakingChangesCategorization = function (breakingChanges) {
        if (breakingChanges.length === 0)
            return 1;
        var totalScore = 0;
        for (var _i = 0, breakingChanges_1 = breakingChanges; _i < breakingChanges_1.length; _i++) {
            var change = breakingChanges_1[_i];
            var score = 0.5;
            if (change.affectedAPIs.length > 0)
                score += 0.2;
            if (change.migrationGuidance)
                score += 0.2;
            if (change.severity && change.severity !== 'low')
                score += 0.1;
            totalScore += Math.min(1, score);
        }
        return totalScore / breakingChanges.length;
    };
    ConfidenceMetrics.prototype.scoreFeaturesCategorization = function (features) {
        if (features.length === 0)
            return 1;
        var totalScore = 0;
        for (var _i = 0, features_1 = features; _i < features_1.length; _i++) {
            var feature = features_1[_i];
            var score = 0.5;
            if (feature.benefits.length > 0)
                score += 0.2;
            if (feature.artifacts.length > 0)
                score += 0.2;
            if (feature.category)
                score += 0.1;
            totalScore += Math.min(1, score);
        }
        return totalScore / features.length;
    };
    ConfidenceMetrics.prototype.scoreBugFixesCategorization = function (bugFixes) {
        if (bugFixes.length === 0)
            return 1;
        var totalScore = 0;
        for (var _i = 0, bugFixes_1 = bugFixes; _i < bugFixes_1.length; _i++) {
            var bugFix = bugFixes_1[_i];
            var score = 0.5;
            if (bugFix.issueNumber)
                score += 0.2;
            if (bugFix.affectedComponents.length > 0)
                score += 0.2;
            if (bugFix.severity)
                score += 0.1;
            totalScore += Math.min(1, score);
        }
        return totalScore / bugFixes.length;
    };
    ConfidenceMetrics.prototype.scoreImprovementsCategorization = function (improvements) {
        if (improvements.length === 0)
            return 1;
        var totalScore = 0;
        for (var _i = 0, improvements_1 = improvements; _i < improvements_1.length; _i++) {
            var improvement = improvements_1[_i];
            var score = 0.5;
            if (improvement.type && improvement.type !== 'other')
                score += 0.25;
            if (improvement.impact)
                score += 0.25;
            totalScore += Math.min(1, score);
        }
        return totalScore / improvements.length;
    };
    ConfidenceMetrics.prototype.scoreInformationRichness = function (changes) {
        var totalItems = changes.breakingChanges.length + changes.newFeatures.length +
            changes.bugFixes.length + changes.improvements.length;
        if (totalItems === 0)
            return 0.3;
        var richness = 0;
        // Score based on detailed information
        var detailedItems = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], changes.breakingChanges.filter(function (c) { return c.description.length > 50; }), true), changes.newFeatures.filter(function (f) { return f.benefits.length > 0 || f.artifacts.length > 0; }), true), changes.bugFixes.filter(function (b) { return b.affectedComponents.length > 0; }), true), changes.improvements.filter(function (i) { return i.type !== 'other'; }), true);
        richness = detailedItems.length / totalItems;
        return Math.min(1, richness);
    };
    ConfidenceMetrics.prototype.scoreDocumentCoverage = function (changes, documents) {
        if (documents.length === 0)
            return 0;
        var totalItems = changes.breakingChanges.length + changes.newFeatures.length +
            changes.bugFixes.length + changes.improvements.length;
        // Expect at least 1 change per 2 documents on average
        var expectedItems = documents.length * 0.5;
        var coverage = Math.min(1, totalItems / expectedItems);
        return coverage;
    };
    ConfidenceMetrics.prototype.scoreChangeTypeDistribution = function (changes) {
        var counts = [
            changes.breakingChanges.length,
            changes.newFeatures.length,
            changes.bugFixes.length,
            changes.improvements.length
        ];
        var totalItems = counts.reduce(function (sum, count) { return sum + count; }, 0);
        if (totalItems === 0)
            return 0.5;
        // Good distribution has multiple types of changes
        var nonZeroTypes = counts.filter(function (count) { return count > 0; }).length;
        return Math.min(1, nonZeroTypes / 4);
    };
    ConfidenceMetrics.prototype.scorePatternConsistency = function (patternMatches) {
        if (patternMatches.length === 0)
            return 0.5;
        var avgConfidence = patternMatches.reduce(function (sum, match) { return sum + match.confidence; }, 0) / patternMatches.length;
        var confidenceVariance = patternMatches.reduce(function (sum, match) {
            return sum + Math.pow(match.confidence - avgConfidence, 2);
        }, 0) / patternMatches.length;
        // Lower variance indicates more consistent matching
        var consistencyScore = Math.max(0, 1 - confidenceVariance);
        return (avgConfidence + consistencyScore) / 2;
    };
    ConfidenceMetrics.prototype.scoreSectionConsistency = function (sectionMatches) {
        if (sectionMatches.length === 0)
            return 0.5;
        var avgConfidence = sectionMatches.reduce(function (sum, match) { return sum + match.confidence; }, 0) / sectionMatches.length;
        var confidenceVariance = sectionMatches.reduce(function (sum, match) {
            return sum + Math.pow(match.confidence - avgConfidence, 2);
        }, 0) / sectionMatches.length;
        // Lower variance indicates more consistent matching
        var consistencyScore = Math.max(0, 1 - confidenceVariance);
        return (avgConfidence + consistencyScore) / 2;
    };
    ConfidenceMetrics.prototype.calculateStructureQuality = function (documents) {
        if (documents.length === 0)
            return 0;
        var totalScore = 0;
        for (var _i = 0, documents_2 = documents; _i < documents_2.length; _i++) {
            var doc = documents_2[_i];
            totalScore += this.scoreDocumentStructure(doc);
        }
        return totalScore / documents.length;
    };
    ConfidenceMetrics.prototype.generateQualitySummary = function (confidenceScore, changes) {
        var status = confidenceScore.validation.status;
        var confidence = (confidenceScore.overall * 100).toFixed(1);
        var totalItems = changes.breakingChanges.length + changes.newFeatures.length +
            changes.bugFixes.length + changes.improvements.length;
        return "Extraction ".concat(status.toUpperCase(), ": ").concat(confidence, "% confidence with ").concat(totalItems, " changes extracted from ").concat(changes.metadata.documentsAnalyzed, " documents.");
    };
    ConfidenceMetrics.prototype.generateQualityDetails = function (confidenceScore, changes) {
        return [
            {
                title: 'Confidence Components',
                content: "Extraction: ".concat((confidenceScore.components.extraction * 100).toFixed(1), "%, Categorization: ").concat((confidenceScore.components.categorization * 100).toFixed(1), "%, Completeness: ").concat((confidenceScore.components.completeness * 100).toFixed(1), "%, Consistency: ").concat((confidenceScore.components.consistency * 100).toFixed(1), "%")
            },
            {
                title: 'Quality Indicators',
                content: "Structure Quality: ".concat((confidenceScore.quality.structureQuality * 100).toFixed(1), "%, Information Richness: ").concat((confidenceScore.quality.informationRichness * 100).toFixed(1), "%")
            },
            {
                title: 'Uncertainties',
                content: "".concat(confidenceScore.uncertainties.length, " uncertainty flags identified").concat(confidenceScore.uncertainties.length > 0 ? ': ' + confidenceScore.uncertainties.map(function (u) { return u.type; }).join(', ') : '')
            }
        ];
    };
    ConfidenceMetrics.prototype.generateQualityRecommendations = function (confidenceScore) {
        return confidenceScore.validation.recommendations.map(function (rec) {
            return "".concat(rec.priority.toUpperCase(), ": ").concat(rec.description);
        });
    };
    ConfidenceMetrics.prototype.generateActionItems = function (confidenceScore) {
        var actions = [];
        for (var _i = 0, _a = confidenceScore.uncertainties; _i < _a.length; _i++) {
            var uncertainty = _a[_i];
            if (uncertainty.severity === 'high') {
                actions.push("HIGH PRIORITY: ".concat(uncertainty.suggestedAction));
            }
        }
        for (var _b = 0, _c = confidenceScore.validation.recommendations; _b < _c.length; _b++) {
            var recommendation = _c[_b];
            if (recommendation.priority === 'high') {
                actions.push.apply(actions, recommendation.actions);
            }
        }
        return actions;
    };
    return ConfidenceMetrics;
}());
exports.ConfidenceMetrics = ConfidenceMetrics;
