/**
 * Artifact Evaluation Framework
 *
 * Provides systematic evaluation of existing artifacts from the Release Management System
 * to determine their value and integration potential for the Release Analysis System.
 * Implements data-driven comparison between simple and complex extraction approaches.
 */
import { AnalysisConfig } from '../config/AnalysisConfig';
import { DetectionConfig } from '../../release/config/ReleaseConfig';
import { CompletionDocument, ExtractedChanges } from '../types/AnalysisTypes';
export interface EvaluationMetrics {
    accuracy: AccuracyMetrics;
    performance: PerformanceMetrics;
    complexity: ComplexityMetrics;
    value: ValueMetrics;
}
export interface AccuracyMetrics {
    extractionAccuracy: number;
    categorizationAccuracy: number;
    deduplicationAccuracy: number;
    falsePositiveRate: number;
    falseNegativeRate: number;
    precisionScore: number;
    recallScore: number;
    f1Score: number;
}
export interface PerformanceMetrics {
    processingTimeMs: number;
    memoryUsageMB: number;
    throughputDocsPerSecond: number;
    scalabilityFactor: number;
    resourceEfficiency: number;
}
export interface ComplexityMetrics {
    linesOfCode: number;
    cyclomaticComplexity: number;
    maintainabilityIndex: number;
    dependencyCount: number;
    testCoverage: number;
    cognitiveLoad: number;
}
export interface ValueMetrics {
    accuracyImprovement: number;
    performanceImprovement: number;
    complexityCost: number;
    maintenanceBurden: number;
    integrationEffort: number;
    overallValueScore: number;
}
export interface ComparisonResult {
    simpleApproach: EvaluationMetrics;
    complexApproach: EvaluationMetrics;
    recommendation: IntegrationRecommendation;
    rationale: string;
    tradeoffAnalysis: TradeoffAnalysis;
}
export interface IntegrationRecommendation {
    decision: 'integrate' | 'simplify' | 'reject';
    confidence: number;
    conditions?: string[];
    alternatives?: string[];
}
export interface TradeoffAnalysis {
    accuracyVsComplexity: number;
    performanceVsComplexity: number;
    valueVsCost: number;
    riskAssessment: string;
    mitigationStrategies: string[];
}
export interface ExtractionMethodComparison {
    simplePatternAccuracy: number;
    complexExtractionAccuracy: number;
    accuracyImprovement: number;
    performanceImpact: number;
    complexityIncrease: number;
    recommendation: 'use-simple' | 'use-complex' | 'hybrid';
    rationale: string;
}
export interface DeduplicationMethodComparison {
    simpleDeduplicationEffectiveness: number;
    semanticDeduplicationEffectiveness: number;
    falsePositiveReduction: number;
    processingOverhead: number;
    recommendation: 'use-simple' | 'use-semantic' | 'conditional';
    rationale: string;
}
export interface SectionParsingComparison {
    structuredParsingAccuracy: number;
    patternMatchingAccuracy: number;
    structuredDocumentAdvantage: number;
    unstructuredDocumentPerformance: number;
    recommendation: 'structured-first' | 'pattern-first' | 'hybrid';
    rationale: string;
}
export interface DocumentationFilteringComparison {
    filteringAccuracy: number;
    falsePositiveReduction: number;
    falseNegativeRate: number;
    overallEffectiveness: number;
    recommendation: 'integrate' | 'simplify' | 'skip';
    rationale: string;
}
export interface MethodIntegrationRecommendation {
    extractionMethod: 'simple' | 'complex' | 'hybrid';
    deduplicationMethod: 'simple' | 'semantic' | 'conditional';
    sectionParsing: 'structured-first' | 'pattern-first' | 'hybrid';
    documentationFiltering: boolean;
    overallComplexity: 'low' | 'medium' | 'high';
    implementationPriority: Array<{
        component: string;
        priority: 'high' | 'medium' | 'low';
        justification: string;
    }>;
    rationale: string;
}
export interface TestCase {
    id: string;
    name: string;
    document: CompletionDocument;
    expectedChanges: ExtractedChanges;
    difficulty: 'easy' | 'medium' | 'hard';
    category: 'structured' | 'unstructured' | 'mixed';
}
export declare class ArtifactEvaluator {
    private analysisConfig;
    private detectionConfig;
    private simpleExtractor;
    private complexAnalyzer;
    private testCases;
    constructor(analysisConfig: AnalysisConfig, detectionConfig: DetectionConfig);
    /**
     * Evaluate existing artifacts against simple implementation
     */
    evaluateArtifacts(): Promise<ComparisonResult>;
    /**
     * Evaluate CompletionAnalyzer extraction methods specifically
     * Task 4.2: Test existing extraction logic against simple pattern-based approach
     */
    evaluateCompletionAnalyzerMethods(): Promise<{
        extractionComparison: ExtractionMethodComparison;
        deduplicationComparison: DeduplicationMethodComparison;
        sectionParsingComparison: SectionParsingComparison;
        documentationFilteringComparison: DocumentationFilteringComparison;
        overallRecommendation: MethodIntegrationRecommendation;
    }>;
    /**
     * Load test cases for evaluation
     */
    private loadTestCases;
    /**
     * Find existing completion documents to use as test cases
     */
    private findTestDocuments;
    /**
     * Create test case from document
     */
    private createTestCase;
    /**
     * Create synthetic test cases for edge cases
     */
    private createSyntheticTestCases;
    /**
     * Evaluate simple extraction approach
     */
    private evaluateSimpleApproach;
    /**
     * Evaluate complex extraction approach
     */
    private evaluateComplexApproach;
    /**
     * Calculate accuracy between extracted and expected changes
     */
    private calculateAccuracy;
    /**
     * Count fuzzy matches between two arrays of strings
     */
    private countMatches;
    /**
     * Fuzzy string matching for change titles
     */
    private fuzzyMatch;
    /**
     * Calculate Levenshtein distance for fuzzy matching
     */
    private levenshteinDistance;
    /**
     * Calculate accuracy metrics from results
     */
    private calculateAccuracyMetrics;
    /**
     * Calculate performance metrics from results
     */
    private calculatePerformanceMetrics;
    /**
     * Calculate complexity metrics for approach
     */
    private calculateComplexityMetrics;
    /**
     * Generate integration recommendation
     */
    private generateRecommendation;
    /**
     * Analyze tradeoffs between approaches
     */
    private analyzeTradeoffs;
    /**
     * Assess integration risk
     */
    private assessRisk;
    /**
     * Generate mitigation strategies
     */
    private generateMitigationStrategies;
    /**
     * Generate rationale for recommendation
     */
    private generateRationale;
    /**
     * Helper methods
     */
    private extractTitle;
    /**
     * Load test cases specifically for method comparison
     */
    private loadMethodComparisonTestCases;
    /**
     * Compare extraction methods: simple patterns vs complex logic
     */
    private compareExtractionMethods;
    /**
     * Compare deduplication methods: simple vs semantic
     */
    private compareDeduplicationMethods;
    /**
     * Compare section parsing methods: structured vs pattern matching
     */
    private compareSectionParsingMethods;
    /**
     * Compare documentation filtering effectiveness
     */
    private compareDocumentationFiltering;
    /**
     * Generate overall method integration recommendation
     */
    private generateMethodIntegrationRecommendation;
    private extractWithComplexMethod;
    private countDuplicates;
    private getTotalItems;
    private countDocumentationItems;
    private countNonDocumentationItems;
    private createExpectedStructuredChanges;
    private createExpectedUnstructuredChanges;
    private createExpectedDocumentationChanges;
    private createExpectedDuplicateChanges;
    private assessDifficulty;
    private categorizeDocument;
    private createExpectedChanges;
    /**
     * Generate comprehensive evaluation report
     */
    generateEvaluationReport(result: ComparisonResult): string;
}
//# sourceMappingURL=ArtifactEvaluator.d.ts.map