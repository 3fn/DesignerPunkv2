/**
 * Accuracy Validation Framework
 *
 * Comprehensive framework for validating extraction and categorization accuracy
 * using known completion documents with expected results. Provides accuracy metrics,
 * regression testing, and version bump validation.
 */
import { CompletionDocument, BreakingChange, Feature, BugFix, Improvement, DocumentationChange, VersionRecommendation } from '../types/AnalysisTypes';
import { ExtractionConfig } from '../config/AnalysisConfig';
export interface AccuracyTestCase {
    id: string;
    name: string;
    description: string;
    document: CompletionDocument;
    expectedResults: ExpectedExtractionResults;
    metadata: TestCaseMetadata;
}
export interface ExpectedExtractionResults {
    breakingChanges: ExpectedBreakingChange[];
    newFeatures: ExpectedFeature[];
    bugFixes: ExpectedBugFix[];
    improvements: ExpectedImprovement[];
    documentation: ExpectedDocumentationChange[];
    expectedVersionBump: ExpectedVersionBump;
    minimumConfidence: number;
    maxAmbiguousItems: number;
}
export interface ExpectedBreakingChange {
    title: string;
    description?: string;
    affectedAPIs?: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    mustDetect: boolean;
}
export interface ExpectedFeature {
    title: string;
    description?: string;
    category?: string;
    mustDetect: boolean;
}
export interface ExpectedBugFix {
    title: string;
    description?: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    mustDetect: boolean;
}
export interface ExpectedImprovement {
    title: string;
    description?: string;
    type: 'performance' | 'usability' | 'maintainability' | 'security' | 'accessibility' | 'other';
    mustDetect: boolean;
}
export interface ExpectedDocumentationChange {
    title: string;
    type: 'readme' | 'api-docs' | 'examples' | 'comments' | 'other';
    mustDetect: boolean;
}
export interface ExpectedVersionBump {
    bumpType: 'major' | 'minor' | 'patch' | 'none';
    fromVersion: string;
    expectedVersion: string;
    minimumConfidence: number;
}
export interface TestCaseMetadata {
    category: 'structured' | 'unstructured' | 'mixed' | 'edge-case';
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    tags: string[];
    createdDate: Date;
    lastUpdated: Date;
    author: string;
}
export interface AccuracyValidationResult {
    testCaseId: string;
    testCaseName: string;
    passed: boolean;
    overallAccuracy: number;
    extractionAccuracy: ExtractionAccuracyMetrics;
    categorizationAccuracy: CategorizationAccuracyMetrics;
    versionBumpAccuracy: VersionBumpAccuracyMetrics;
    confidenceValidation: ConfidenceValidationMetrics;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    details: ValidationDetails;
}
export interface ExtractionAccuracyMetrics {
    precision: number;
    recall: number;
    f1Score: number;
    truePositives: number;
    falsePositives: number;
    falseNegatives: number;
    detectionRate: number;
}
export interface CategorizationAccuracyMetrics {
    correctCategories: number;
    incorrectCategories: number;
    categoryAccuracy: number;
    severityAccuracy: number;
    typeAccuracy: number;
}
export interface VersionBumpAccuracyMetrics {
    correctBumpType: boolean;
    correctVersion: boolean;
    confidenceMet: boolean;
    evidenceQuality: number;
    rationaleQuality: number;
}
export interface ConfidenceValidationMetrics {
    actualConfidence: number;
    expectedMinimum: number;
    confidenceMet: boolean;
    ambiguousItemsCount: number;
    maxAllowedAmbiguous: number;
    ambiguousItemsAcceptable: boolean;
}
export interface ValidationError {
    type: 'extraction' | 'categorization' | 'version-bump' | 'confidence';
    severity: 'critical' | 'major' | 'minor';
    message: string;
    expected: any;
    actual: any;
    impact: string;
}
export interface ValidationWarning {
    type: 'extraction' | 'categorization' | 'version-bump' | 'confidence';
    message: string;
    suggestion: string;
}
export interface ValidationDetails {
    extractedItems: {
        breakingChanges: BreakingChange[];
        newFeatures: Feature[];
        bugFixes: BugFix[];
        improvements: Improvement[];
        documentation: DocumentationChange[];
    };
    matchedItems: {
        breakingChanges: MatchResult[];
        newFeatures: MatchResult[];
        bugFixes: MatchResult[];
        improvements: MatchResult[];
        documentation: MatchResult[];
    };
    versionCalculation: VersionRecommendation;
    processingTime: number;
}
export interface MatchResult {
    expected: any;
    actual: any | null;
    matched: boolean;
    similarity: number;
    confidence: number;
}
export interface RegressionTestResult {
    testSuiteId: string;
    timestamp: Date;
    overallAccuracy: number;
    testResults: AccuracyValidationResult[];
    regressionDetected: boolean;
    performanceMetrics: PerformanceMetrics;
    summary: RegressionSummary;
}
export interface PerformanceMetrics {
    averageProcessingTime: number;
    memoryUsage: number;
    throughput: number;
}
export interface RegressionSummary {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    accuracyChange: number;
    newFailures: string[];
    fixedIssues: string[];
    performanceChange: number;
}
export declare class AccuracyValidationFramework {
    private extractor;
    private versionCalculator;
    private testCases;
    private baselineResults;
    constructor(config: ExtractionConfig);
    /**
     * Register a test case for accuracy validation
     */
    registerTestCase(testCase: AccuracyTestCase): void;
    /**
     * Register multiple test cases
     */
    registerTestCases(testCases: AccuracyTestCase[]): void;
    /**
     * Validate accuracy for a single test case
     */
    validateTestCase(testCaseId: string): Promise<AccuracyValidationResult>;
    /**
     * Run accuracy validation on all registered test cases
     */
    validateAllTestCases(): Promise<AccuracyValidationResult[]>;
    /**
     * Run regression testing against baseline results
     */
    runRegressionTests(testSuiteId: string): Promise<RegressionTestResult>;
    /**
     * Set baseline results for regression testing
     */
    setBaselineResults(results: AccuracyValidationResult[]): void;
    /**
     * Get accuracy metrics for specific categories
     */
    getAccuracyMetricsByCategory(results: AccuracyValidationResult[]): Map<string, number>;
    /**
     * Validate extraction accuracy (precision, recall, F1)
     */
    private validateExtractionAccuracy;
    /**
     * Validate categorization accuracy
     */
    private validateCategorizationAccuracy;
    /**
     * Validate version bump accuracy
     */
    private validateVersionBumpAccuracy;
    /**
     * Validate confidence metrics
     */
    private validateConfidenceMetrics;
    /**
     * Calculate overall accuracy score
     */
    private calculateOverallAccuracy;
    private matchBreakingChanges;
    private matchFeatures;
    private matchBugFixes;
    private matchImprovements;
    private matchDocumentation;
    private calculateSimilarity;
    private assessEvidenceQuality;
    private assessRationaleQuality;
    private collectValidationIssues;
    private buildMatchResults;
    private buildItemMatchResults;
    private detectRegression;
    private buildRegressionSummary;
}
//# sourceMappingURL=AccuracyValidationFramework.d.ts.map