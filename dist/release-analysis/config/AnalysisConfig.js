"use strict";
/**
 * Release Analysis Configuration System
 *
 * Provides configuration for CLI-driven release analysis workflow
 * including extraction patterns, versioning rules, and output formats.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ANALYSIS_CONFIG = void 0;
/**
 * Default configuration values for release analysis
 */
exports.DEFAULT_ANALYSIS_CONFIG = {
    extraction: {
        completionPatterns: [
            '*-completion.md',
            'spec-completion-summary.md',
            'task-*-completion.md'
        ],
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
                'Changes'
            ]
        },
        excludePatterns: [
            'README.md',
            '*.test.ts',
            '*.spec.ts',
            'docs/**',
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
//# sourceMappingURL=AnalysisConfig.js.map