/**
 * Release Analysis Configuration System
 *
 * Provides configuration for CLI-driven release analysis workflow
 * including extraction patterns, versioning rules, and output formats.
 */
export interface AnalysisConfig {
    extraction: ExtractionConfig;
    versioning: VersioningConfig;
    reporting: ReportingConfig;
    git: GitConfig;
}
export interface ExtractionConfig {
    /** File patterns to identify completion documents */
    completionPatterns: string[];
    /** Keywords that indicate breaking changes in completion documents */
    breakingChangeKeywords: string[];
    /** Keywords that indicate new features in completion documents */
    featureKeywords: string[];
    /** Keywords that indicate bug fixes in completion documents */
    bugFixKeywords: string[];
    /** Keywords that indicate improvements in completion documents */
    improvementKeywords: string[];
    /** Keywords that indicate documentation-only changes */
    documentationKeywords: string[];
    /** Confidence thresholds for extraction quality */
    confidenceThresholds: ConfidenceThresholds;
    /** Section headers to look for in structured completion documents */
    sectionHeaders: SectionHeaders;
    /** Patterns to exclude from analysis (documentation-only changes) */
    excludePatterns: string[];
}
export interface ConfidenceThresholds {
    /** Minimum confidence for extracted changes (0-1) */
    minimumConfidence: number;
    /** Threshold for flagging uncertain extractions (0-1) */
    uncertaintyThreshold: number;
    /** Threshold for requiring human review (0-1) */
    reviewThreshold: number;
    /** Threshold for deduplication similarity matching (0-1) */
    deduplicationThreshold: number;
    /** Threshold for semantic similarity in extraction (0-1) */
    semanticSimilarityThreshold: number;
}
export interface SectionHeaders {
    /** Headers that typically contain breaking changes */
    breakingChanges: string[];
    /** Headers that typically contain new features */
    features: string[];
    /** Headers that typically contain bug fixes */
    bugFixes: string[];
    /** Headers that typically contain improvements */
    improvements: string[];
    /** Headers that typically contain summary information */
    summary: string[];
}
export interface VersioningConfig {
    /** Enable strict semantic versioning compliance */
    semanticVersioning: boolean;
    /** How to handle pre-release versions */
    preReleaseHandling: 'increment' | 'promote' | 'ignore';
    /** Version bump calculation rules */
    versionBumpRules: BumpRules;
    /** Pre-release version configuration */
    preRelease: PreReleaseConfig;
}
export interface BumpRules {
    /** Patterns that trigger major version bumps */
    majorBumpTriggers: string[];
    /** Patterns that trigger minor version bumps */
    minorBumpTriggers: string[];
    /** Patterns that trigger patch version bumps */
    patchBumpTriggers: string[];
    /** Default bump type when triggers are ambiguous */
    defaultBumpType: 'major' | 'minor' | 'patch';
    /** Require explicit confirmation for major bumps */
    requireMajorConfirmation: boolean;
}
export interface PreReleaseConfig {
    /** Pre-release identifier (alpha, beta, rc) */
    identifier: string;
    /** Starting number for pre-release versions */
    startingNumber: number;
    /** Format for pre-release versions */
    format: string;
}
export interface ReportingConfig {
    /** Default output format for analysis results */
    defaultFormat: 'summary' | 'detailed' | 'json';
    /** Include confidence metrics in output */
    includeConfidence: boolean;
    /** Include extraction metadata in output */
    includeMetadata: boolean;
    /** Include evidence and rationale in output */
    includeEvidence: boolean;
    /** Templates for different output formats */
    templates: TemplateConfig;
    /** Output file configuration */
    outputFiles: OutputFileConfig;
}
export interface TemplateConfig {
    /** Template for summary reports */
    summary: ReportTemplate;
    /** Template for detailed reports */
    detailed: ReportTemplate;
    /** Template for release notes */
    releaseNotes: ReleaseNotesTemplate;
}
export interface ReportTemplate {
    /** Template format (markdown, html, plain) */
    format: 'markdown' | 'html' | 'plain';
    /** Template sections configuration */
    sections: TemplateSectionConfig[];
    /** Include table of contents */
    includeTableOfContents: boolean;
}
export interface TemplateSectionConfig {
    /** Section identifier */
    id: string;
    /** Section title */
    title: string;
    /** Section priority (lower numbers appear first) */
    priority: number;
    /** Whether section is required */
    required: boolean;
    /** Section content template */
    template: string;
}
export interface ReleaseNotesTemplate {
    /** Release notes format */
    format: 'markdown' | 'html' | 'plain';
    /** Header template */
    header: string;
    /** Section templates for different change types */
    sections: {
        breakingChanges: string;
        features: string;
        bugFixes: string;
        improvements: string;
    };
    /** Footer template */
    footer: string;
}
export interface OutputFileConfig {
    /** Save analysis results to file */
    saveResults: boolean;
    /** Directory for output files */
    outputDirectory: string;
    /** Filename pattern for analysis results */
    analysisFilename: string;
    /** Filename pattern for release notes */
    releaseNotesFilename: string;
    /** Overwrite existing files */
    overwriteExisting: boolean;
}
export interface GitConfig {
    /** Default branch to analyze from */
    defaultBranch: string;
    /** Tag pattern for identifying releases */
    releaseTagPattern: string;
    /** Paths to search for completion documents */
    completionPaths: string[];
    /** File patterns to include in analysis */
    includePatterns: string[];
    /** File patterns to exclude from analysis */
    excludePatterns: string[];
    /** Maximum number of commits to analyze */
    maxCommits: number;
}
/**
 * Default configuration values for release analysis
 */
export declare const DEFAULT_ANALYSIS_CONFIG: AnalysisConfig;
//# sourceMappingURL=AnalysisConfig.d.ts.map