"use strict";
/**
 * Accuracy Validation Framework
 *
 * Comprehensive framework for validating extraction and categorization accuracy
 * using known completion documents with expected results. Provides accuracy metrics,
 * regression testing, and version bump validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccuracyValidationFramework = void 0;
const SimpleChangeExtractor_1 = require("../extraction/SimpleChangeExtractor");
const VersionCalculator_1 = require("../versioning/VersionCalculator");
class AccuracyValidationFramework {
    constructor(config) {
        this.testCases = new Map();
        this.baselineResults = new Map();
        this.extractor = new SimpleChangeExtractor_1.SimpleChangeExtractor(config);
        this.versionCalculator = new VersionCalculator_1.VersionCalculator();
    }
    /**
     * Register a test case for accuracy validation
     */
    registerTestCase(testCase) {
        this.testCases.set(testCase.id, testCase);
    }
    /**
     * Register multiple test cases
     */
    registerTestCases(testCases) {
        testCases.forEach(testCase => this.registerTestCase(testCase));
    }
    /**
     * Validate accuracy for a single test case
     */
    async validateTestCase(testCaseId) {
        const testCase = this.testCases.get(testCaseId);
        if (!testCase) {
            throw new Error(`Test case not found: ${testCaseId}`);
        }
        const startTime = process.hrtime.bigint();
        // Extract changes from the test document
        const extractedChanges = await this.extractor.extractChanges([testCase.document]);
        // Calculate version bump
        const versionRecommendation = this.versionCalculator.calculateVersionBump(extractedChanges, testCase.expectedResults.expectedVersionBump.fromVersion);
        const endTime = process.hrtime.bigint();
        const processingTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
        // Validate extraction accuracy
        const extractionAccuracy = this.validateExtractionAccuracy(extractedChanges, testCase.expectedResults);
        // Validate categorization accuracy
        const categorizationAccuracy = this.validateCategorizationAccuracy(extractedChanges, testCase.expectedResults);
        // Validate version bump accuracy
        const versionBumpAccuracy = this.validateVersionBumpAccuracy(versionRecommendation, testCase.expectedResults.expectedVersionBump);
        // Validate confidence metrics
        const confidenceValidation = this.validateConfidenceMetrics(extractedChanges, testCase.expectedResults);
        // Calculate overall accuracy
        const overallAccuracy = this.calculateOverallAccuracy(extractionAccuracy, categorizationAccuracy, versionBumpAccuracy, confidenceValidation);
        // Collect errors and warnings
        const { errors, warnings } = this.collectValidationIssues(extractionAccuracy, categorizationAccuracy, versionBumpAccuracy, confidenceValidation, testCase.expectedResults);
        // Build detailed match results
        const matchedItems = this.buildMatchResults(extractedChanges, testCase.expectedResults);
        const result = {
            testCaseId: testCase.id,
            testCaseName: testCase.name,
            passed: errors.filter(e => e.severity === 'critical').length === 0,
            overallAccuracy,
            extractionAccuracy,
            categorizationAccuracy,
            versionBumpAccuracy,
            confidenceValidation,
            errors,
            warnings,
            details: {
                extractedItems: {
                    breakingChanges: extractedChanges.breakingChanges,
                    newFeatures: extractedChanges.newFeatures,
                    bugFixes: extractedChanges.bugFixes,
                    improvements: extractedChanges.improvements,
                    documentation: extractedChanges.documentation
                },
                matchedItems,
                versionCalculation: versionRecommendation,
                processingTime
            }
        };
        return result;
    }
    /**
     * Run accuracy validation on all registered test cases
     */
    async validateAllTestCases() {
        const results = [];
        for (const testCaseId of this.testCases.keys()) {
            const result = await this.validateTestCase(testCaseId);
            results.push(result);
        }
        return results;
    }
    /**
     * Run regression testing against baseline results
     */
    async runRegressionTests(testSuiteId) {
        const startTime = Date.now();
        const testResults = await this.validateAllTestCases();
        const endTime = Date.now();
        const overallAccuracy = testResults.reduce((sum, result) => sum + result.overallAccuracy, 0) / testResults.length;
        const regressionDetected = this.detectRegression(testResults);
        const performanceMetrics = {
            averageProcessingTime: testResults.reduce((sum, result) => sum + result.details.processingTime, 0) / testResults.length,
            memoryUsage: process.memoryUsage().heapUsed,
            throughput: testResults.length / ((endTime - startTime) / 1000)
        };
        const summary = this.buildRegressionSummary(testResults);
        return {
            testSuiteId,
            timestamp: new Date(),
            overallAccuracy,
            testResults,
            regressionDetected,
            performanceMetrics,
            summary
        };
    }
    /**
     * Set baseline results for regression testing
     */
    setBaselineResults(results) {
        this.baselineResults.clear();
        results.forEach(result => {
            this.baselineResults.set(result.testCaseId, result);
        });
    }
    /**
     * Get accuracy metrics for specific categories
     */
    getAccuracyMetricsByCategory(results) {
        const categoryMetrics = new Map();
        // Group by test case category
        const categorizedResults = new Map();
        results.forEach(result => {
            const testCase = this.testCases.get(result.testCaseId);
            if (testCase) {
                const category = testCase.metadata.category;
                if (!categorizedResults.has(category)) {
                    categorizedResults.set(category, []);
                }
                categorizedResults.get(category).push(result);
            }
        });
        // Calculate average accuracy per category
        categorizedResults.forEach((categoryResults, category) => {
            const avgAccuracy = categoryResults.reduce((sum, result) => sum + result.overallAccuracy, 0) / categoryResults.length;
            categoryMetrics.set(category, avgAccuracy);
        });
        return categoryMetrics;
    }
    /**
     * Validate extraction accuracy (precision, recall, F1)
     */
    validateExtractionAccuracy(extracted, expected) {
        let truePositives = 0;
        let falsePositives = 0;
        let falseNegatives = 0;
        let mustDetectFound = 0;
        let totalMustDetect = 0;
        // Count must-detect items
        totalMustDetect = expected.breakingChanges.filter(bc => bc.mustDetect).length +
            expected.newFeatures.filter(f => f.mustDetect).length +
            expected.bugFixes.filter(bf => bf.mustDetect).length +
            expected.improvements.filter(i => i.mustDetect).length +
            expected.documentation.filter(d => d.mustDetect).length;
        // Validate breaking changes
        const bcMatches = this.matchBreakingChanges(extracted.breakingChanges, expected.breakingChanges);
        truePositives += bcMatches.truePositives;
        falsePositives += bcMatches.falsePositives;
        falseNegatives += bcMatches.falseNegatives;
        mustDetectFound += bcMatches.mustDetectFound;
        // Validate features
        const featureMatches = this.matchFeatures(extracted.newFeatures, expected.newFeatures);
        truePositives += featureMatches.truePositives;
        falsePositives += featureMatches.falsePositives;
        falseNegatives += featureMatches.falseNegatives;
        mustDetectFound += featureMatches.mustDetectFound;
        // Validate bug fixes
        const bugFixMatches = this.matchBugFixes(extracted.bugFixes, expected.bugFixes);
        truePositives += bugFixMatches.truePositives;
        falsePositives += bugFixMatches.falsePositives;
        falseNegatives += bugFixMatches.falseNegatives;
        mustDetectFound += bugFixMatches.mustDetectFound;
        // Validate improvements
        const improvementMatches = this.matchImprovements(extracted.improvements, expected.improvements);
        truePositives += improvementMatches.truePositives;
        falsePositives += improvementMatches.falsePositives;
        falseNegatives += improvementMatches.falseNegatives;
        mustDetectFound += improvementMatches.mustDetectFound;
        // Validate documentation
        const docMatches = this.matchDocumentation(extracted.documentation, expected.documentation);
        truePositives += docMatches.truePositives;
        falsePositives += docMatches.falsePositives;
        falseNegatives += docMatches.falseNegatives;
        mustDetectFound += docMatches.mustDetectFound;
        // Calculate metrics
        const precision = truePositives > 0 ? truePositives / (truePositives + falsePositives) : 0;
        const recall = truePositives > 0 ? truePositives / (truePositives + falseNegatives) : 0;
        const f1Score = precision + recall > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
        const detectionRate = totalMustDetect > 0 ? mustDetectFound / totalMustDetect : 1;
        return {
            precision,
            recall,
            f1Score,
            truePositives,
            falsePositives,
            falseNegatives,
            detectionRate
        };
    }
    /**
     * Validate categorization accuracy
     */
    validateCategorizationAccuracy(extracted, expected) {
        let correctCategories = 0;
        let incorrectCategories = 0;
        let correctSeverities = 0;
        let totalSeverities = 0;
        let correctTypes = 0;
        let totalTypes = 0;
        // Check breaking change severities
        extracted.breakingChanges.forEach(bc => {
            const expectedBc = expected.breakingChanges.find(exp => this.calculateSimilarity(bc.title, exp.title) > 0.7);
            if (expectedBc) {
                totalSeverities++;
                if (bc.severity === expectedBc.severity) {
                    correctSeverities++;
                }
            }
        });
        // Check bug fix severities
        extracted.bugFixes.forEach(bf => {
            const expectedBf = expected.bugFixes.find(exp => this.calculateSimilarity(bf.title, exp.title) > 0.7);
            if (expectedBf) {
                totalSeverities++;
                if (bf.severity === expectedBf.severity) {
                    correctSeverities++;
                }
            }
        });
        // Check improvement types
        extracted.improvements.forEach(imp => {
            const expectedImp = expected.improvements.find(exp => this.calculateSimilarity(imp.title, exp.title) > 0.7);
            if (expectedImp) {
                totalTypes++;
                if (imp.type === expectedImp.type) {
                    correctTypes++;
                }
            }
        });
        // Check documentation types
        extracted.documentation.forEach(doc => {
            const expectedDoc = expected.documentation.find(exp => this.calculateSimilarity(doc.title, exp.title) > 0.7);
            if (expectedDoc) {
                totalTypes++;
                if (doc.type === expectedDoc.type) {
                    correctTypes++;
                }
            }
        });
        const categoryAccuracy = (correctCategories + incorrectCategories) > 0 ?
            correctCategories / (correctCategories + incorrectCategories) : 1;
        const severityAccuracy = totalSeverities > 0 ? correctSeverities / totalSeverities : 1;
        const typeAccuracy = totalTypes > 0 ? correctTypes / totalTypes : 1;
        return {
            correctCategories,
            incorrectCategories,
            categoryAccuracy,
            severityAccuracy,
            typeAccuracy
        };
    }
    /**
     * Validate version bump accuracy
     */
    validateVersionBumpAccuracy(actual, expected) {
        const correctBumpType = actual.bumpType === expected.bumpType;
        const correctVersion = actual.recommendedVersion === expected.expectedVersion;
        const confidenceMet = actual.confidence >= expected.minimumConfidence;
        // Assess evidence quality (0-1 scale)
        const evidenceQuality = this.assessEvidenceQuality(actual.evidence, expected.bumpType);
        // Assess rationale quality (0-1 scale)
        const rationaleQuality = this.assessRationaleQuality(actual.rationale, expected.bumpType);
        return {
            correctBumpType,
            correctVersion,
            confidenceMet,
            evidenceQuality,
            rationaleQuality
        };
    }
    /**
     * Validate confidence metrics
     */
    validateConfidenceMetrics(extracted, expected) {
        const actualConfidence = extracted.metadata.extractionConfidence;
        const expectedMinimum = expected.minimumConfidence;
        const confidenceMet = actualConfidence >= expectedMinimum;
        const ambiguousItemsCount = extracted.metadata.ambiguousItems.length;
        const maxAllowedAmbiguous = expected.maxAmbiguousItems;
        const ambiguousItemsAcceptable = ambiguousItemsCount <= maxAllowedAmbiguous;
        return {
            actualConfidence,
            expectedMinimum,
            confidenceMet,
            ambiguousItemsCount,
            maxAllowedAmbiguous,
            ambiguousItemsAcceptable
        };
    }
    /**
     * Calculate overall accuracy score
     */
    calculateOverallAccuracy(extraction, categorization, versionBump, confidence) {
        const weights = {
            extraction: 0.4,
            categorization: 0.25,
            versionBump: 0.25,
            confidence: 0.1
        };
        const extractionScore = extraction.f1Score;
        const categorizationScore = (categorization.categoryAccuracy + categorization.severityAccuracy + categorization.typeAccuracy) / 3;
        const versionBumpScore = ((versionBump.correctBumpType ? 1 : 0) +
            (versionBump.correctVersion ? 1 : 0) +
            (versionBump.confidenceMet ? 1 : 0) +
            versionBump.evidenceQuality +
            versionBump.rationaleQuality) / 5;
        const confidenceScore = (confidence.confidenceMet ? 1 : 0) * (confidence.ambiguousItemsAcceptable ? 1 : 0.5);
        return (extractionScore * weights.extraction +
            categorizationScore * weights.categorization +
            versionBumpScore * weights.versionBump +
            confidenceScore * weights.confidence);
    }
    // Helper methods for matching and similarity calculation
    matchBreakingChanges(actual, expected) {
        let truePositives = 0;
        let falsePositives = 0;
        let mustDetectFound = 0;
        const matchedExpected = new Set();
        // Find matches for actual items
        actual.forEach(actualItem => {
            let bestMatch = -1;
            let bestSimilarity = 0;
            expected.forEach((expectedItem, index) => {
                if (matchedExpected.has(index))
                    return;
                const similarity = this.calculateSimilarity(actualItem.title, expectedItem.title);
                if (similarity > bestSimilarity && similarity > 0.7) {
                    bestSimilarity = similarity;
                    bestMatch = index;
                }
            });
            if (bestMatch >= 0) {
                truePositives++;
                matchedExpected.add(bestMatch);
                if (expected[bestMatch].mustDetect) {
                    mustDetectFound++;
                }
            }
            else {
                falsePositives++;
            }
        });
        const falseNegatives = expected.length - matchedExpected.size;
        return { truePositives, falsePositives, falseNegatives, mustDetectFound };
    }
    matchFeatures(actual, expected) {
        let truePositives = 0;
        let falsePositives = 0;
        let mustDetectFound = 0;
        const matchedExpected = new Set();
        actual.forEach(actualItem => {
            let bestMatch = -1;
            let bestSimilarity = 0;
            expected.forEach((expectedItem, index) => {
                if (matchedExpected.has(index))
                    return;
                const similarity = this.calculateSimilarity(actualItem.title, expectedItem.title);
                if (similarity > bestSimilarity && similarity > 0.7) {
                    bestSimilarity = similarity;
                    bestMatch = index;
                }
            });
            if (bestMatch >= 0) {
                truePositives++;
                matchedExpected.add(bestMatch);
                if (expected[bestMatch].mustDetect) {
                    mustDetectFound++;
                }
            }
            else {
                falsePositives++;
            }
        });
        const falseNegatives = expected.length - matchedExpected.size;
        return { truePositives, falsePositives, falseNegatives, mustDetectFound };
    }
    matchBugFixes(actual, expected) {
        let truePositives = 0;
        let falsePositives = 0;
        let mustDetectFound = 0;
        const matchedExpected = new Set();
        actual.forEach(actualItem => {
            let bestMatch = -1;
            let bestSimilarity = 0;
            expected.forEach((expectedItem, index) => {
                if (matchedExpected.has(index))
                    return;
                const similarity = this.calculateSimilarity(actualItem.title, expectedItem.title);
                if (similarity > bestSimilarity && similarity > 0.7) {
                    bestSimilarity = similarity;
                    bestMatch = index;
                }
            });
            if (bestMatch >= 0) {
                truePositives++;
                matchedExpected.add(bestMatch);
                if (expected[bestMatch].mustDetect) {
                    mustDetectFound++;
                }
            }
            else {
                falsePositives++;
            }
        });
        const falseNegatives = expected.length - matchedExpected.size;
        return { truePositives, falsePositives, falseNegatives, mustDetectFound };
    }
    matchImprovements(actual, expected) {
        let truePositives = 0;
        let falsePositives = 0;
        let mustDetectFound = 0;
        const matchedExpected = new Set();
        actual.forEach(actualItem => {
            let bestMatch = -1;
            let bestSimilarity = 0;
            expected.forEach((expectedItem, index) => {
                if (matchedExpected.has(index))
                    return;
                const similarity = this.calculateSimilarity(actualItem.title, expectedItem.title);
                if (similarity > bestSimilarity && similarity > 0.7) {
                    bestSimilarity = similarity;
                    bestMatch = index;
                }
            });
            if (bestMatch >= 0) {
                truePositives++;
                matchedExpected.add(bestMatch);
                if (expected[bestMatch].mustDetect) {
                    mustDetectFound++;
                }
            }
            else {
                falsePositives++;
            }
        });
        const falseNegatives = expected.length - matchedExpected.size;
        return { truePositives, falsePositives, falseNegatives, mustDetectFound };
    }
    matchDocumentation(actual, expected) {
        let truePositives = 0;
        let falsePositives = 0;
        let mustDetectFound = 0;
        const matchedExpected = new Set();
        actual.forEach(actualItem => {
            let bestMatch = -1;
            let bestSimilarity = 0;
            expected.forEach((expectedItem, index) => {
                if (matchedExpected.has(index))
                    return;
                const similarity = this.calculateSimilarity(actualItem.title, expectedItem.title);
                if (similarity > bestSimilarity && similarity > 0.7) {
                    bestSimilarity = similarity;
                    bestMatch = index;
                }
            });
            if (bestMatch >= 0) {
                truePositives++;
                matchedExpected.add(bestMatch);
                if (expected[bestMatch].mustDetect) {
                    mustDetectFound++;
                }
            }
            else {
                falsePositives++;
            }
        });
        const falseNegatives = expected.length - matchedExpected.size;
        return { truePositives, falsePositives, falseNegatives, mustDetectFound };
    }
    calculateSimilarity(text1, text2) {
        const len1 = text1.length;
        const len2 = text2.length;
        if (len1 === 0)
            return len2 === 0 ? 1 : 0;
        if (len2 === 0)
            return 0;
        const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));
        for (let i = 0; i <= len1; i++)
            matrix[0][i] = i;
        for (let j = 0; j <= len2; j++)
            matrix[j][0] = j;
        for (let j = 1; j <= len2; j++) {
            for (let i = 1; i <= len1; i++) {
                const indicator = text1[i - 1] === text2[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + indicator);
            }
        }
        const distance = matrix[len2][len1];
        const maxLength = Math.max(len1, len2);
        return 1 - (distance / maxLength);
    }
    assessEvidenceQuality(evidence, expectedBumpType) {
        if (evidence.length === 0)
            return 0;
        let qualityScore = 0;
        let totalWeight = 0;
        evidence.forEach(item => {
            const weight = item.impact === 'high' ? 1 : item.impact === 'medium' ? 0.7 : 0.4;
            totalWeight += weight;
            // Check if evidence type matches expected bump type
            if ((expectedBumpType === 'major' && item.type === 'breaking') ||
                (expectedBumpType === 'minor' && item.type === 'feature') ||
                (expectedBumpType === 'patch' && (item.type === 'fix' || item.type === 'improvement'))) {
                qualityScore += weight;
            }
            else {
                qualityScore += weight * 0.5; // Partial credit for relevant but not perfect evidence
            }
        });
        return totalWeight > 0 ? qualityScore / totalWeight : 0;
    }
    assessRationaleQuality(rationale, expectedBumpType) {
        if (!rationale || rationale.trim().length === 0)
            return 0;
        let score = 0.5; // Base score for having a rationale
        // Check if rationale mentions the correct bump type
        if (rationale.toLowerCase().includes(expectedBumpType)) {
            score += 0.3;
        }
        // Check for key terms that indicate good reasoning
        const goodTerms = ['because', 'due to', 'requires', 'introduces', 'removes', 'changes'];
        const hasGoodTerms = goodTerms.some(term => rationale.toLowerCase().includes(term));
        if (hasGoodTerms) {
            score += 0.2;
        }
        return Math.min(1, score);
    }
    collectValidationIssues(extraction, categorization, versionBump, confidence, expected) {
        const errors = [];
        const warnings = [];
        // Critical errors
        if (extraction.detectionRate < 0.8) {
            errors.push({
                type: 'extraction',
                severity: 'critical',
                message: `Low detection rate for must-detect items: ${(extraction.detectionRate * 100).toFixed(1)}%`,
                expected: '≥80%',
                actual: `${(extraction.detectionRate * 100).toFixed(1)}%`,
                impact: 'Critical changes may be missed in release notes'
            });
        }
        if (!versionBump.correctBumpType) {
            errors.push({
                type: 'version-bump',
                severity: 'critical',
                message: 'Incorrect version bump type calculated',
                expected: expected.expectedVersionBump.bumpType,
                actual: 'Different bump type',
                impact: 'Incorrect semantic versioning'
            });
        }
        if (!confidence.confidenceMet) {
            errors.push({
                type: 'confidence',
                severity: 'major',
                message: 'Extraction confidence below minimum threshold',
                expected: `≥${confidence.expectedMinimum}`,
                actual: confidence.actualConfidence.toFixed(2),
                impact: 'Results may be unreliable'
            });
        }
        // Warnings
        if (extraction.precision < 0.8) {
            warnings.push({
                type: 'extraction',
                message: `Low precision: ${(extraction.precision * 100).toFixed(1)}% (many false positives)`,
                suggestion: 'Review extraction patterns to reduce false positives'
            });
        }
        if (extraction.recall < 0.8) {
            warnings.push({
                type: 'extraction',
                message: `Low recall: ${(extraction.recall * 100).toFixed(1)}% (missing true positives)`,
                suggestion: 'Review extraction patterns to improve detection'
            });
        }
        if (categorization.severityAccuracy < 0.7) {
            warnings.push({
                type: 'categorization',
                message: `Low severity accuracy: ${(categorization.severityAccuracy * 100).toFixed(1)}%`,
                suggestion: 'Review severity assessment logic'
            });
        }
        return { errors, warnings };
    }
    buildMatchResults(extracted, expected) {
        return {
            breakingChanges: this.buildItemMatchResults(extracted.breakingChanges, expected.breakingChanges),
            newFeatures: this.buildItemMatchResults(extracted.newFeatures, expected.newFeatures),
            bugFixes: this.buildItemMatchResults(extracted.bugFixes, expected.bugFixes),
            improvements: this.buildItemMatchResults(extracted.improvements, expected.improvements),
            documentation: this.buildItemMatchResults(extracted.documentation, expected.documentation)
        };
    }
    buildItemMatchResults(actualItems, expectedItems) {
        const results = [];
        expectedItems.forEach(expected => {
            let bestMatch = null;
            let bestSimilarity = 0;
            let bestConfidence = 0;
            actualItems.forEach(actual => {
                const similarity = this.calculateSimilarity(actual.title, expected.title);
                if (similarity > bestSimilarity) {
                    bestSimilarity = similarity;
                    bestMatch = actual;
                    bestConfidence = similarity; // Simplified confidence calculation
                }
            });
            results.push({
                expected,
                actual: bestMatch,
                matched: bestSimilarity > 0.7,
                similarity: bestSimilarity,
                confidence: bestConfidence
            });
        });
        return results;
    }
    detectRegression(currentResults) {
        if (this.baselineResults.size === 0)
            return false;
        let regressionCount = 0;
        const threshold = 0.05; // 5% accuracy drop threshold
        currentResults.forEach(result => {
            const baseline = this.baselineResults.get(result.testCaseId);
            if (baseline) {
                const accuracyDrop = baseline.overallAccuracy - result.overallAccuracy;
                if (accuracyDrop > threshold) {
                    regressionCount++;
                }
            }
        });
        return regressionCount > 0;
    }
    buildRegressionSummary(results) {
        const totalTests = results.length;
        const passedTests = results.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        let accuracyChange = 0;
        const newFailures = [];
        const fixedIssues = [];
        if (this.baselineResults.size > 0) {
            let totalAccuracyChange = 0;
            let comparedTests = 0;
            results.forEach(result => {
                const baseline = this.baselineResults.get(result.testCaseId);
                if (baseline) {
                    const change = result.overallAccuracy - baseline.overallAccuracy;
                    totalAccuracyChange += change;
                    comparedTests++;
                    if (baseline.passed && !result.passed) {
                        newFailures.push(result.testCaseName);
                    }
                    else if (!baseline.passed && result.passed) {
                        fixedIssues.push(result.testCaseName);
                    }
                }
            });
            accuracyChange = comparedTests > 0 ? totalAccuracyChange / comparedTests : 0;
        }
        return {
            totalTests,
            passedTests,
            failedTests,
            accuracyChange,
            newFailures,
            fixedIssues,
            performanceChange: 0 // Would need baseline performance metrics
        };
    }
}
exports.AccuracyValidationFramework = AccuracyValidationFramework;
//# sourceMappingURL=AccuracyValidationFramework.js.map