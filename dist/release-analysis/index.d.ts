/**
 * Release Analysis System
 *
 * Main entry point for the release analysis system providing CLI-driven
 * analysis of changes between releases with version bump recommendations.
 *
 * Includes performance optimizations for large repositories:
 * - Efficient Git history analysis with caching and batching
 * - Incremental document parsing with intelligent caching
 * - Parallel processing for multiple completion documents
 * - Comprehensive progress reporting for long-running operations
 */
export { ReleaseCLI, runAnalysisCli } from './cli/ReleaseCLI';
export * from './git';
export * from './collection';
export { ChangeExtractor, DefaultChangeExtractor } from './extraction/ChangeExtractor';
export { SimpleChangeExtractor } from './extraction/SimpleChangeExtractor';
export { PatternMatcher } from './extraction/PatternMatcher';
export { ChangeCategorizationSystem } from './extraction/ChangeCategorizationSystem';
export type { CategorizationResult, SeverityAssessment, FeatureClassification, ImprovementClassification, BugFixClassification } from './extraction/ChangeCategorizationSystem';
export type { CompletionDocument, ExtractedChanges, DocumentChanges, ExtractionValidation, BreakingChange, Feature, BugFix, Improvement, DocumentationChange, PatternMatch, SectionMatch, ExtractionMetadata } from './types/AnalysisTypes';
export { VersionCalculator } from './versioning/VersionCalculator';
export type { VersionRecommendation, ChangeEvidence, PreReleaseInfo } from './versioning/VersionCalculator';
export * from './notes';
export { AnalysisReporter } from './reporting/AnalysisReporter';
export type { AnalysisResult, ConfidenceMetrics, AnalysisMetadata, ReportFormat, ReportOptions } from './reporting/AnalysisReporter';
export { AnalysisValidator } from './validation/AnalysisValidator';
export { AccuracyValidationFramework } from './validation/AccuracyValidationFramework';
export { AccuracyTestCases } from './validation/AccuracyTestCases';
export { AccuracyTestRunner } from './validation/AccuracyTestRunner';
export * from './performance';
export { AnalysisConfig, ExtractionConfig, VersioningConfig, ReportingConfig, GitConfig, ConfidenceThresholds, SectionHeaders, BumpRules, PreReleaseConfig, TemplateConfig, ReportTemplate, ReleaseNotesTemplate, OutputFileConfig, DEFAULT_ANALYSIS_CONFIG, AnalysisConfigManager, AnalysisConfigLoadResult, ConfigSource, validateAnalysisConfig, validateConfigurationPaths, AnalysisConfigValidationResult, ConfigValidationError, ConfigValidationWarning } from './config';
export * from './errors';
export type { ErrorContext, ErrorDetails, RecoveryStrategy } from './types';
//# sourceMappingURL=index.d.ts.map