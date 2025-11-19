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

// CLI Interface
export { ReleaseCLI, runAnalysisCli } from './cli/ReleaseCLI';

// Core Analysis Components
// Note: Some modules export conflicting type names, so we export explicitly
// to avoid ambiguity warnings from TypeScript

// Git module - exports ValidationResult, AnalysisScope
export * from './git';

// Collection module - no conflicts
export * from './collection';

// Extraction module - export explicitly to avoid conflicts
export { ChangeExtractor, DefaultChangeExtractor } from './extraction/ChangeExtractor';
export { SimpleChangeExtractor } from './extraction/SimpleChangeExtractor';
export { PatternMatcher } from './extraction/PatternMatcher';
export { ChangeCategorizationSystem } from './extraction/ChangeCategorizationSystem';
export type { 
  CategorizationResult, 
  SeverityAssessment, 
  FeatureClassification, 
  ImprovementClassification, 
  BugFixClassification 
} from './extraction/ChangeCategorizationSystem';
// Re-export types from AnalysisTypes (excluding ValidationResult which git already exports)
export type {
  CompletionDocument,
  ExtractedChanges,
  DocumentChanges,
  ExtractionValidation,
  BreakingChange,
  Feature,
  BugFix,
  Improvement,
  DocumentationChange,
  PatternMatch,
  SectionMatch,
  ExtractionMetadata
} from './types/AnalysisTypes';

// Versioning module - exports ValidationResult (conflicts with git)
// Export versioning explicitly excluding conflicting types
export { VersionCalculator } from './versioning/VersionCalculator';
export type {
  VersionRecommendation,
  ChangeEvidence,
  PreReleaseInfo
  // ValidationResult - skip, already exported by git
} from './versioning/VersionCalculator';

// Notes module - exports TemplateSectionConfig
export * from './notes';

// Reporting module - exports AnalysisScope (conflicts with git)
// Export reporting classes but not conflicting types
export { AnalysisReporter } from './reporting/AnalysisReporter';
// Export reporting types explicitly (excluding AnalysisScope which git already exports)
export type { AnalysisResult, ConfidenceMetrics, AnalysisMetadata, ReportFormat, ReportOptions } from './reporting/AnalysisReporter';

// Validation module - exports ConfidenceThresholds (conflicts with reporting)
// Export validation explicitly to avoid conflicts
export { AnalysisValidator } from './validation/AnalysisValidator';
export { AccuracyValidationFramework } from './validation/AccuracyValidationFramework';
export { AccuracyTestCases } from './validation/AccuracyTestCases';
export { AccuracyTestRunner } from './validation/AccuracyTestRunner';

// Performance Optimizations
export * from './performance';

// Configuration - exports TemplateSectionConfig (conflicts with notes)
// Export config explicitly excluding conflicting types
export {
  AnalysisConfig,
  ExtractionConfig,
  VersioningConfig,
  ReportingConfig,
  GitConfig,
  ConfidenceThresholds,
  SectionHeaders,
  BumpRules,
  PreReleaseConfig,
  TemplateConfig,
  ReportTemplate,
  // TemplateSectionConfig - skip, already exported by notes
  ReleaseNotesTemplate,
  OutputFileConfig,
  DEFAULT_ANALYSIS_CONFIG,
  AnalysisConfigManager,
  AnalysisConfigLoadResult,
  ConfigSource,
  validateAnalysisConfig,
  validateConfigurationPaths,
  AnalysisConfigValidationResult,
  ConfigValidationError,
  ConfigValidationWarning
} from './config';

// Error Handling
export * from './errors';

// Types - Export only types not already exported by modules above
// Note: Most types are already exported by their respective modules (git, notes, reporting, etc.)
// Only export types that are unique to the types file
export type { 
  ErrorContext, 
  ErrorDetails, 
  RecoveryStrategy
} from './types';