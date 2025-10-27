/**
 * Release Analysis Configuration System
 *
 * Exports configuration interfaces, manager, and validation utilities
 * for the CLI-driven release analysis workflow.
 */
export { AnalysisConfig, ExtractionConfig, VersioningConfig, ReportingConfig, GitConfig, ConfidenceThresholds, SectionHeaders, BumpRules, PreReleaseConfig, TemplateConfig, ReportTemplate, TemplateSectionConfig, ReleaseNotesTemplate, OutputFileConfig, DEFAULT_ANALYSIS_CONFIG } from './AnalysisConfig';
export { AnalysisConfigManager, AnalysisConfigLoadResult, ConfigSource } from './AnalysisConfigManager';
export { validateAnalysisConfig, validateConfigurationPaths, AnalysisConfigValidationResult, ConfigValidationError, ConfigValidationWarning } from './AnalysisConfigSchema';
//# sourceMappingURL=index.d.ts.map