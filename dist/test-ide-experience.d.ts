/**
 * Test file to validate IDE experience improvements
 * This file tests autocomplete, go-to-definition, and hover tooltips
 * for types created during TypeScript error resolution
 *
 * This file will be deleted after validation
 */
import { ErrorContext, ErrorDetails, EvaluationOptions, AccuracyTestReport, AccuracyTestSummary } from './release-analysis/types';
declare const testErrorContext: ErrorContext;
declare const testErrorDetails: ErrorDetails;
declare const testEvaluationOptions: EvaluationOptions;
declare const testAccuracyTestSummary: AccuracyTestSummary;
declare const testAccuracyTestReport: AccuracyTestReport;
declare const contextOperation: string;
declare const detailsSeverity: "critical" | "low" | "medium" | "high";
declare const optionsVerbose: boolean | undefined;
declare const summaryTotal: number;
declare const reportTimestamp: Date;
declare const extractionPrecision: number;
declare const categorizationAccuracy: number;
declare const performanceRate: number;
declare const validSeverity: ErrorDetails['severity'];
declare const validCategory: ErrorDetails['category'];
declare const validFormat: EvaluationOptions['format'];
export { testErrorContext, testErrorDetails, testEvaluationOptions, testAccuracyTestSummary, testAccuracyTestReport, contextOperation, detailsSeverity, optionsVerbose, summaryTotal, reportTimestamp, extractionPrecision, categorizationAccuracy, performanceRate, validSeverity, validCategory, validFormat };
//# sourceMappingURL=test-ide-experience.d.ts.map