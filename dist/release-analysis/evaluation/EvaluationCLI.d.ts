/**
 * Evaluation CLI Interface
 *
 * Command-line interface for running artifact evaluation framework.
 * Provides easy access to systematic testing and comparison of extraction approaches.
 */
import { ComparisonResult } from './ArtifactEvaluator';
import { AnalysisConfig } from '../config/AnalysisConfig';
export interface EvaluationOptions {
    outputPath?: string;
    verbose?: boolean;
    testCasesPath?: string;
    format?: 'markdown' | 'json' | 'console';
}
export declare class EvaluationCLI {
    private analysisConfig;
    private detectionConfig;
    private evaluator;
    constructor(analysisConfig?: AnalysisConfig, detectionConfig?: import("../../release/config/ReleaseConfig").DetectionConfig);
    /**
     * Run complete artifact evaluation
     */
    runEvaluation(options?: EvaluationOptions): Promise<ComparisonResult>;
    /**
     * Run CompletionAnalyzer method evaluation (Task 4.2)
     */
    runMethodEvaluation(options?: EvaluationOptions): Promise<void>;
    /**
     * Output evaluation results in specified format
     */
    private outputResults;
    /**
     * Output method evaluation results in specified format
     */
    private outputMethodResults;
    /**
     * Print evaluation summary to console
     */
    private printSummary;
    /**
     * Print method evaluation summary to console
     */
    private printMethodSummary;
    /**
     * Generate method evaluation markdown report
     */
    private generateMethodEvaluationReport;
    /**
     * Get default output path for format
     */
    private getDefaultOutputPath;
    /**
     * Get default output path for method evaluation
     */
    private getDefaultMethodOutputPath;
    /**
     * Run quick comparison (simplified evaluation)
     */
    runQuickComparison(): Promise<void>;
    /**
     * Validate evaluation setup
     */
    validateSetup(): Promise<boolean>;
    /**
     * Setup validation checks
     */
    private checkSimpleExtractor;
    private checkComplexAnalyzer;
    private checkTestDocuments;
    private checkOutputDirectory;
}
/**
 * CLI entry point for artifact evaluation
 */
export declare function runArtifactEvaluation(options?: EvaluationOptions): Promise<void>;
/**
 * CLI entry point for quick comparison
 */
export declare function runQuickComparison(): Promise<void>;
/**
 * CLI entry point for method evaluation (Task 4.2)
 */
export declare function runMethodEvaluation(options?: EvaluationOptions): Promise<void>;
//# sourceMappingURL=EvaluationCLI.d.ts.map