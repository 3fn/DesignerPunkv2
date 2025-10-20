/**
 * Release Analysis Configuration System
 * 
 * Exports configuration interfaces, manager, and validation utilities
 * for the CLI-driven release analysis workflow.
 */

// Configuration interfaces and types
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
  TemplateSectionConfig,
  ReleaseNotesTemplate,
  OutputFileConfig,
  DEFAULT_ANALYSIS_CONFIG
} from './AnalysisConfig';

// Configuration manager
export {
  AnalysisConfigManager,
  AnalysisConfigLoadResult,
  ConfigSource
} from './AnalysisConfigManager';

// Configuration validation
export {
  validateAnalysisConfig,
  validateConfigurationPaths,
  AnalysisConfigValidationResult,
  ConfigValidationError,
  ConfigValidationWarning
} from './AnalysisConfigSchema';