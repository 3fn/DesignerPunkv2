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

  /** File patterns to identify summary documents (prioritized over completion docs) */
  summaryPatterns: string[];

  /** Whether to prefer summary documents over full completion documents */
  preferSummaries: boolean;

  /** Whether to use ONLY summary documents (ignore completion docs entirely) */
  summariesOnly: boolean;

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
export const DEFAULT_ANALYSIS_CONFIG: AnalysisConfig = {
  extraction: {
    completionPatterns: [
      '*-completion.md',
      'spec-completion-summary.md',
      'task-*-completion.md'
    ],
    summaryPatterns: [
      'task-*-summary.md',
      '*-summary.md'
    ],
    preferSummaries: true,
    summariesOnly: true,  // For inaugural release: only analyze summary documents
    breakingChangeKeywords: [
      'breaking change',
      'breaking',
      'incompatible',
      'removes',
      'deprecated',
      'migration required',
      'API change',
      'interface change'
    ],
    featureKeywords: [
      'new feature',
      'adds functionality',
      'enhancement',
      'implements',
      'introduces',
      'feature',
      'capability'
    ],
    bugFixKeywords: [
      'bug fix',
      'fixes',
      'resolves',
      'corrects',
      'patch',
      'issue',
      'problem'
    ],
    improvementKeywords: [
      'improvement',
      'optimization',
      'performance',
      'refactor',
      'cleanup',
      'enhancement',
      'better'
    ],
    documentationKeywords: [
      'documentation',
      'docs',
      'readme',
      'comments',
      'examples',
      'guide',
      'tutorial'
    ],
    confidenceThresholds: {
      minimumConfidence: 0.6,
      uncertaintyThreshold: 0.8,
      reviewThreshold: 0.7,
      deduplicationThreshold: 0.8,
      semanticSimilarityThreshold: 0.7
    },
    sectionHeaders: {
      breakingChanges: [
        'Breaking Changes',
        'BREAKING CHANGES',
        'Incompatible Changes',
        'API Changes'
      ],
      features: [
        'New Features',
        'Features',
        'Enhancements',
        'Additions',
        'Functionality'
      ],
      bugFixes: [
        'Bug Fixes',
        'Fixes',
        'Resolved Issues',
        'Corrections',
        'Patches'
      ],
      improvements: [
        'Improvements',
        'Optimizations',
        'Performance',
        'Refactoring',
        'Cleanup'
      ],
      summary: [
        'Summary',
        'Overview',
        'Description',
        'What Changed',
        'Changes',
        'What Was Done',
        'Key Changes',
        'Impact'
      ]
    },
    excludePatterns: [
      'README.md',
      '*.test.ts',
      '*.spec.ts',
      'docs/processes/**',
      'docs/guides/**',
      'examples/**'
    ]
  },
  versioning: {
    semanticVersioning: true,
    preReleaseHandling: 'increment',
    versionBumpRules: {
      majorBumpTriggers: [
        'breaking change',
        'incompatible change',
        'removes feature',
        'API change',
        'interface change'
      ],
      minorBumpTriggers: [
        'new feature',
        'adds functionality',
        'enhancement',
        'spec completion'
      ],
      patchBumpTriggers: [
        'bug fix',
        'patch',
        'task completion',
        'improvement',
        'optimization'
      ],
      defaultBumpType: 'patch',
      requireMajorConfirmation: true
    },
    preRelease: {
      identifier: 'beta',
      startingNumber: 1,
      format: '{version}-{identifier}.{number}'
    }
  },
  reporting: {
    defaultFormat: 'summary',
    includeConfidence: true,
    includeMetadata: true,
    includeEvidence: true,
    templates: {
      summary: {
        format: 'markdown',
        sections: [
          {
            id: 'header',
            title: 'Release Analysis Summary',
            priority: 1,
            required: true,
            template: '# Release Analysis Summary\n\n**Analysis Date**: {date}\n**Version Recommendation**: {version}\n**Confidence**: {confidence}%\n\n'
          },
          {
            id: 'changes',
            title: 'Changes Detected',
            priority: 2,
            required: true,
            template: '## Changes Detected\n\n{changes}\n\n'
          },
          {
            id: 'recommendation',
            title: 'Version Recommendation',
            priority: 3,
            required: true,
            template: '## Version Recommendation\n\n{recommendation}\n\n'
          }
        ],
        includeTableOfContents: false
      },
      detailed: {
        format: 'markdown',
        sections: [
          {
            id: 'header',
            title: 'Detailed Release Analysis',
            priority: 1,
            required: true,
            template: '# Detailed Release Analysis\n\n**Analysis Date**: {date}\n**Analysis Scope**: {scope}\n**Documents Analyzed**: {documentCount}\n\n'
          },
          {
            id: 'breaking-changes',
            title: 'Breaking Changes',
            priority: 2,
            required: false,
            template: '## Breaking Changes\n\n{breakingChanges}\n\n'
          },
          {
            id: 'features',
            title: 'New Features',
            priority: 3,
            required: false,
            template: '## New Features\n\n{features}\n\n'
          },
          {
            id: 'bug-fixes',
            title: 'Bug Fixes',
            priority: 4,
            required: false,
            template: '## Bug Fixes\n\n{bugFixes}\n\n'
          },
          {
            id: 'improvements',
            title: 'Improvements',
            priority: 5,
            required: false,
            template: '## Improvements\n\n{improvements}\n\n'
          },
          {
            id: 'metadata',
            title: 'Analysis Metadata',
            priority: 6,
            required: false,
            template: '## Analysis Metadata\n\n{metadata}\n\n'
          }
        ],
        includeTableOfContents: true
      },
      releaseNotes: {
        format: 'markdown',
        header: '# Release {version}\n\n**Release Date**: {date}\n\n{summary}\n\n',
        sections: {
          breakingChanges: '## ⚠️ Breaking Changes\n\n{items}\n\n',
          features: '## ✨ New Features\n\n{items}\n\n',
          bugFixes: '## 🐛 Bug Fixes\n\n{items}\n\n',
          improvements: '## 🔧 Improvements\n\n{items}\n\n'
        },
        footer: '\n---\n\n**Full Changelog**: {changelogUrl}\n'
      }
    },
    outputFiles: {
      saveResults: true,
      outputDirectory: './.kiro/release-analysis',
      analysisFilename: 'analysis-{timestamp}.md',
      releaseNotesFilename: 'release-notes-{version}.md',
      overwriteExisting: false
    }
  },
  git: {
    defaultBranch: 'main',
    releaseTagPattern: '^v?\\d+\\.\\d+\\.\\d+',
    completionPaths: [
      '.kiro/specs/*/completion/',
      '.kiro/specs/*/tasks.md'
    ],
    includePatterns: [
      '**/task-*-summary.md',
      '**/*-summary.md',
      '**/*-completion.md',
      '**/spec-completion-summary.md',
      '**/task-*-completion.md'
    ],
    excludePatterns: [
      'node_modules/**',
      '.git/**',
      'dist/**',
      'build/**'
    ],
    maxCommits: 1000
  }
};