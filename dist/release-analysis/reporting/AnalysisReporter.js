"use strict";
/**
 * Analysis Reporter for Release Analysis System
 *
 * Presents analysis results to users in various formats and handles result persistence.
 * Supports summary, detailed, and JSON report formats with configurable output options.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisReporter = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
/**
 * Main class for generating and managing analysis reports
 */
class AnalysisReporter {
    constructor() {
        this.defaultFormat = {
            type: 'summary',
            includeMetadata: false,
            includeConfidence: true,
            includeEvidence: true,
            includeReleaseNotes: false
        };
    }
    /**
     * Generate summary report for CLI output
     */
    generateSummaryReport(result, options) {
        const reportOptions = this.mergeOptions({ format: { ...this.defaultFormat, type: 'summary' } }, options);
        const sections = [];
        // Header
        sections.push(this.formatHeader('📊 Release Analysis Summary', reportOptions.maxWidth));
        // Version recommendation
        sections.push(this.formatVersionSummary(result.versionRecommendation));
        // Changes overview
        sections.push(this.formatChangesSummary(result.changes));
        // Confidence (if enabled)
        if (reportOptions.format.includeConfidence) {
            sections.push(this.formatConfidenceSummary(result.confidence));
        }
        // Quality indicators
        sections.push(this.formatQualityIndicators(result.changes, result.versionRecommendation));
        // Metadata (if enabled)
        if (reportOptions.format.includeMetadata && result.metadata) {
            sections.push(this.formatMetadataSummary(result.metadata));
        }
        return sections.join('\n\n');
    }
    /**
     * Generate detailed report with full change breakdown
     */
    generateDetailedReport(result, options) {
        const reportOptions = this.mergeOptions({ format: { ...this.defaultFormat, type: 'detailed' } }, options);
        const sections = [];
        // Header
        sections.push(this.formatHeader('📊 Detailed Analysis Report', reportOptions.maxWidth));
        // Analysis scope
        sections.push(this.formatAnalysisScope(result.scope));
        // Version recommendation with rationale
        sections.push(this.formatVersionDetails(result.versionRecommendation));
        // Detailed changes breakdown
        sections.push(this.formatChangesDetails(result.changes));
        // Evidence (if enabled)
        if (reportOptions.format.includeEvidence && result.versionRecommendation.evidence.length > 0) {
            sections.push(this.formatEvidence(result.versionRecommendation.evidence));
        }
        // Confidence metrics (if enabled)
        if (reportOptions.format.includeConfidence) {
            sections.push(this.formatConfidenceDetails(result.confidence));
        }
        // Release notes (if enabled)
        if (reportOptions.format.includeReleaseNotes && result.releaseNotes) {
            sections.push(this.formatReleaseNotesSection(result.releaseNotes));
        }
        // Quality analysis
        sections.push(this.formatQualityAnalysis(result.changes, result.versionRecommendation));
        // Metadata (if enabled)
        if (reportOptions.format.includeMetadata && result.metadata) {
            sections.push(this.formatMetadataDetails(result.metadata));
        }
        return sections.join('\n\n');
    }
    /**
     * Generate JSON report for programmatic consumption
     */
    generateJSONReport(result, options) {
        const reportOptions = this.mergeOptions({ format: { ...this.defaultFormat, type: 'json' } }, options);
        // Create a clean JSON structure
        const jsonReport = {
            analysis: {
                scope: {
                    fromTag: result.scope.fromTag,
                    fromCommit: result.scope.fromCommit,
                    toCommit: result.scope.toCommit,
                    analysisDate: result.scope.analysisDate.toISOString(),
                    documentsAnalyzed: result.scope.completionDocuments.length
                },
                versionRecommendation: {
                    currentVersion: result.versionRecommendation.currentVersion,
                    recommendedVersion: result.versionRecommendation.recommendedVersion,
                    bumpType: result.versionRecommendation.bumpType,
                    rationale: result.versionRecommendation.rationale,
                    confidence: result.versionRecommendation.confidence
                },
                changes: {
                    summary: {
                        breakingChanges: result.changes.breakingChanges.length,
                        newFeatures: result.changes.newFeatures.length,
                        bugFixes: result.changes.bugFixes.length,
                        improvements: result.changes.improvements.length,
                        documentation: result.changes.documentation.length
                    },
                    details: {
                        breakingChanges: result.changes.breakingChanges,
                        newFeatures: result.changes.newFeatures,
                        bugFixes: result.changes.bugFixes,
                        improvements: result.changes.improvements,
                        documentation: result.changes.documentation
                    }
                }
            }
        };
        // Add evidence if enabled
        if (reportOptions.format.includeEvidence) {
            jsonReport.analysis.evidence = result.versionRecommendation.evidence;
        }
        // Add confidence metrics if enabled
        if (reportOptions.format.includeConfidence) {
            jsonReport.analysis.confidence = result.confidence;
        }
        // Add metadata if enabled
        if (reportOptions.format.includeMetadata && result.metadata) {
            jsonReport.metadata = result.metadata;
        }
        // Add release notes if enabled
        if (reportOptions.format.includeReleaseNotes) {
            jsonReport.analysis.releaseNotes = result.releaseNotes;
        }
        return JSON.stringify(jsonReport, null, 2);
    }
    /**
     * Save report to file with specified format
     */
    async saveReport(result, format, filePath, options) {
        try {
            // Ensure directory exists
            const dir = path.dirname(filePath);
            await fs_1.promises.mkdir(dir, { recursive: true });
            let content;
            const reportOptions = { format, ...options };
            // Generate content based on format
            switch (format.type) {
                case 'summary':
                    content = this.generateSummaryReport(result, reportOptions);
                    break;
                case 'detailed':
                    content = this.generateDetailedReport(result, reportOptions);
                    break;
                case 'json':
                    content = this.generateJSONReport(result, reportOptions);
                    break;
                default:
                    throw new Error(`Unsupported report format: ${format.type}`);
            }
            // Add timestamp if requested
            if (options?.includeTimestamp) {
                const timestamp = `Generated: ${new Date().toISOString()}\n\n`;
                content = format.type === 'json' ? content : timestamp + content;
            }
            await fs_1.promises.writeFile(filePath, content, 'utf-8');
            console.log(`💾 Report saved: ${filePath}`);
        }
        catch (error) {
            console.error(`❌ Error saving report: ${error}`);
            throw error;
        }
    }
    /**
     * Format header with optional width constraint
     */
    formatHeader(title, maxWidth) {
        const width = maxWidth || 50;
        const separator = '='.repeat(width);
        return `${title}\n${separator}`;
    }
    /**
     * Format version recommendation summary
     */
    formatVersionSummary(recommendation) {
        const lines = [];
        lines.push(`🏷️  Version: ${recommendation.currentVersion} → ${recommendation.recommendedVersion}`);
        lines.push(`📈 Bump type: ${recommendation.bumpType}`);
        lines.push(`🎯 Confidence: ${(recommendation.confidence * 100).toFixed(1)}%`);
        return lines.join('\n');
    }
    /**
     * Format changes summary
     */
    formatChangesSummary(changes) {
        const totalChanges = changes.breakingChanges.length +
            changes.newFeatures.length +
            changes.bugFixes.length +
            changes.improvements.length;
        const lines = [];
        lines.push(`📝 Changes: ${totalChanges} total`);
        if (changes.breakingChanges.length > 0) {
            lines.push(`  ⚠️  ${changes.breakingChanges.length} breaking changes`);
        }
        if (changes.newFeatures.length > 0) {
            lines.push(`  ✨ ${changes.newFeatures.length} new features`);
        }
        if (changes.bugFixes.length > 0) {
            lines.push(`  🐛 ${changes.bugFixes.length} bug fixes`);
        }
        if (changes.improvements.length > 0) {
            lines.push(`  🔧 ${changes.improvements.length} improvements`);
        }
        if (changes.documentation.length > 0) {
            lines.push(`  📚 ${changes.documentation.length} documentation updates`);
        }
        return lines.join('\n');
    }
    /**
     * Format confidence summary
     */
    formatConfidenceSummary(confidence) {
        return `📈 Confidence: ${(confidence.overall * 100).toFixed(1)}% overall`;
    }
    /**
     * Format quality indicators
     */
    formatQualityIndicators(changes, recommendation) {
        const lines = [];
        // Check for items needing review
        if (changes.metadata.ambiguousItems.length > 0) {
            lines.push(`⚠️  ${changes.metadata.ambiguousItems.length} items need review`);
        }
        // Check confidence level
        if (recommendation.confidence < 0.7) {
            lines.push(`⚠️  Low confidence - manual review recommended`);
        }
        // Check for filtered items
        if (changes.metadata.filteredItems.length > 0) {
            lines.push(`ℹ️  ${changes.metadata.filteredItems.length} items filtered (documentation-only)`);
        }
        if (lines.length === 0) {
            lines.push(`✅ Analysis quality: Good`);
        }
        return lines.join('\n');
    }
    /**
     * Format analysis scope details
     */
    formatAnalysisScope(scope) {
        const lines = [];
        lines.push('📋 Analysis Scope:');
        lines.push(`  From: ${scope.fromTag || scope.fromCommit || 'Repository start'}`);
        lines.push(`  To: ${scope.toCommit}`);
        lines.push(`  Documents analyzed: ${scope.completionDocuments.length}`);
        lines.push(`  Analysis date: ${scope.analysisDate.toISOString()}`);
        return lines.join('\n');
    }
    /**
     * Format version details with rationale
     */
    formatVersionDetails(recommendation) {
        const lines = [];
        lines.push('🏷️  Version Recommendation:');
        lines.push(`  Current: ${recommendation.currentVersion}`);
        lines.push(`  Recommended: ${recommendation.recommendedVersion}`);
        lines.push(`  Bump type: ${recommendation.bumpType}`);
        lines.push(`  Confidence: ${(recommendation.confidence * 100).toFixed(1)}%`);
        lines.push(`  Rationale:`);
        // Format rationale with proper indentation
        const rationaleLines = recommendation.rationale.split('\n');
        rationaleLines.forEach(line => {
            lines.push(`    ${line}`);
        });
        return lines.join('\n');
    }
    /**
     * Format detailed changes breakdown
     */
    formatChangesDetails(changes) {
        const sections = [];
        sections.push('📝 Changes Details:');
        // Breaking changes
        if (changes.breakingChanges.length > 0) {
            sections.push('  ⚠️  Breaking Changes:');
            changes.breakingChanges.forEach((change, index) => {
                sections.push(`    ${index + 1}. ${change.title} (${change.severity})`);
                if (change.description) {
                    sections.push(`       ${change.description}`);
                }
            });
        }
        // New features
        if (changes.newFeatures.length > 0) {
            sections.push('  ✨ New Features:');
            changes.newFeatures.forEach((feature, index) => {
                sections.push(`    ${index + 1}. ${feature.title}`);
                if (feature.description) {
                    sections.push(`       ${feature.description}`);
                }
            });
        }
        // Bug fixes
        if (changes.bugFixes.length > 0) {
            sections.push('  🐛 Bug Fixes:');
            changes.bugFixes.forEach((fix, index) => {
                sections.push(`    ${index + 1}. ${fix.title} (${fix.severity})`);
                if (fix.description) {
                    sections.push(`       ${fix.description}`);
                }
            });
        }
        // Improvements
        if (changes.improvements.length > 0) {
            sections.push('  🔧 Improvements:');
            changes.improvements.forEach((improvement, index) => {
                sections.push(`    ${index + 1}. ${improvement.title} (${improvement.type})`);
                if (improvement.description) {
                    sections.push(`       ${improvement.description}`);
                }
            });
        }
        return sections.join('\n');
    }
    /**
     * Format evidence details
     */
    formatEvidence(evidence) {
        const lines = [];
        lines.push('🔍 Evidence:');
        evidence.forEach((item, index) => {
            lines.push(`  ${index + 1}. [${item.type.toUpperCase()}] ${item.description}`);
            lines.push(`     Source: ${item.source}`);
            lines.push(`     Impact: ${item.impact}`);
        });
        return lines.join('\n');
    }
    /**
     * Format confidence details
     */
    formatConfidenceDetails(confidence) {
        const lines = [];
        lines.push('📈 Confidence Metrics:');
        lines.push(`  Overall: ${(confidence.overall * 100).toFixed(1)}%`);
        lines.push(`  Extraction: ${(confidence.extraction * 100).toFixed(1)}%`);
        lines.push(`  Versioning: ${(confidence.versioning * 100).toFixed(1)}%`);
        lines.push(`  Completeness: ${(confidence.completeness * 100).toFixed(1)}%`);
        return lines.join('\n');
    }
    /**
     * Format release notes section
     */
    formatReleaseNotesSection(releaseNotes) {
        const lines = [];
        lines.push('📋 Generated Release Notes:');
        lines.push('');
        // Add indentation to release notes
        const noteLines = releaseNotes.split('\n');
        noteLines.forEach(line => {
            lines.push(`  ${line}`);
        });
        return lines.join('\n');
    }
    /**
     * Format quality analysis
     */
    formatQualityAnalysis(changes, recommendation) {
        const lines = [];
        lines.push('🔍 Quality Analysis:');
        // Extraction quality
        const extractionConfidence = changes.metadata.extractionConfidence;
        lines.push(`  Extraction quality: ${(extractionConfidence * 100).toFixed(1)}%`);
        // Ambiguous items
        if (changes.metadata.ambiguousItems.length > 0) {
            lines.push(`  Items requiring review: ${changes.metadata.ambiguousItems.length}`);
            changes.metadata.ambiguousItems.slice(0, 3).forEach((item, index) => {
                lines.push(`    ${index + 1}. ${item}`);
            });
            if (changes.metadata.ambiguousItems.length > 3) {
                lines.push(`    ... and ${changes.metadata.ambiguousItems.length - 3} more`);
            }
        }
        // Filtered items
        if (changes.metadata.filteredItems.length > 0) {
            lines.push(`  Filtered items: ${changes.metadata.filteredItems.length} (documentation-only changes)`);
        }
        // Version confidence
        if (recommendation.confidence < 0.8) {
            lines.push(`  ⚠️  Version recommendation confidence is below 80%`);
            lines.push(`     Consider manual review before proceeding`);
        }
        return lines.join('\n');
    }
    /**
     * Format metadata summary
     */
    formatMetadataSummary(metadata) {
        const lines = [];
        lines.push(`ℹ️  Generated: ${metadata.generatedAt.toISOString()}`);
        if (metadata.processingTime) {
            lines.push(`⏱️  Processing time: ${metadata.processingTime}ms`);
        }
        return lines.join('\n');
    }
    /**
     * Format metadata details
     */
    formatMetadataDetails(metadata) {
        const lines = [];
        lines.push('ℹ️  Analysis Metadata:');
        lines.push(`  Generated at: ${metadata.generatedAt.toISOString()}`);
        lines.push(`  CLI version: ${metadata.cliVersion}`);
        lines.push(`  Analysis ID: ${metadata.analysisId}`);
        if (metadata.processingTime) {
            lines.push(`  Processing time: ${metadata.processingTime}ms`);
        }
        return lines.join('\n');
    }
    /**
     * Merge report options with defaults
     */
    mergeOptions(defaults, options) {
        if (!options)
            return defaults;
        return {
            format: { ...defaults.format, ...options.format },
            colorOutput: options.colorOutput ?? defaults.colorOutput,
            maxWidth: options.maxWidth ?? defaults.maxWidth,
            includeTimestamp: options.includeTimestamp ?? defaults.includeTimestamp
        };
    }
}
exports.AnalysisReporter = AnalysisReporter;
//# sourceMappingURL=AnalysisReporter.js.map