"use strict";
/**
 * Example usage of AnalysisReporter
 *
 * Demonstrates various ways to use the reporting system for different scenarios.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQuickSummary = generateQuickSummary;
exports.generateComprehensiveReport = generateComprehensiveReport;
exports.generateAutomationReport = generateAutomationReport;
exports.saveReportsToFiles = saveReportsToFiles;
exports.generateCustomReports = generateCustomReports;
exports.demonstrateErrorHandling = demonstrateErrorHandling;
exports.runAllExamples = runAllExamples;
const AnalysisReporter_1 = require("./AnalysisReporter");
// Example analysis result (would come from actual analysis)
const exampleAnalysisResult = {
    scope: {
        fromTag: 'v1.2.0',
        toCommit: 'HEAD',
        completionDocuments: [
            {
                path: '.kiro/specs/user-auth/completion/task-3-completion.md',
                content: 'Task completion content...',
                lastModified: new Date('2025-01-10'),
                gitCommit: 'abc123',
                metadata: {
                    title: 'Task 3: Implement OAuth Integration',
                    task: '3. Implement OAuth integration',
                    spec: 'user-auth',
                    type: 'task-completion'
                }
            }
        ],
        analysisDate: new Date()
    },
    changes: {
        breakingChanges: [
            {
                id: 'bc1',
                title: 'Change authentication API signature',
                description: 'Updated auth.login() to require additional security parameter',
                affectedAPIs: ['auth.login()', 'auth.refresh()'],
                migrationGuidance: 'Add securityToken parameter to all auth calls',
                source: 'task-3-completion.md',
                severity: 'medium'
            }
        ],
        newFeatures: [
            {
                id: 'f1',
                title: 'OAuth 2.0 integration',
                description: 'Added support for OAuth 2.0 authentication flow',
                benefits: ['Enhanced security', 'Third-party integration support'],
                requirements: ['OAuth provider configuration'],
                artifacts: ['OAuthProvider.ts', 'oauth.test.ts'],
                source: 'task-3-completion.md',
                category: 'Authentication'
            }
        ],
        bugFixes: [
            {
                id: 'bf1',
                title: 'Fix token expiration handling',
                description: 'Resolved issue where expired tokens caused app crashes',
                issueNumber: '456',
                affectedComponents: ['TokenManager', 'AuthService'],
                source: 'task-3-completion.md',
                severity: 'high'
            }
        ],
        improvements: [
            {
                id: 'i1',
                title: 'Improve login performance',
                description: 'Reduced login time by 60% through caching optimizations',
                type: 'performance',
                impact: 'high',
                source: 'task-3-completion.md'
            }
        ],
        documentation: [
            {
                id: 'd1',
                title: 'Update authentication documentation',
                description: 'Added OAuth setup guide and migration instructions',
                type: 'api-docs',
                source: 'task-3-completion.md'
            }
        ],
        metadata: {
            documentsAnalyzed: 1,
            extractionConfidence: 0.92,
            ambiguousItems: [],
            filteredItems: ['Updated code comments']
        }
    },
    versionRecommendation: {
        currentVersion: '1.2.0',
        recommendedVersion: '2.0.0',
        bumpType: 'major',
        rationale: 'Major version bump required due to 1 breaking change:\n  • Change authentication API signature (medium severity)',
        confidence: 0.95,
        evidence: [
            {
                type: 'breaking',
                description: '1 breaking change(s) detected',
                source: 'completion documents',
                impact: 'medium',
                count: 1
            },
            {
                type: 'feature',
                description: '1 new feature(s) added',
                source: 'completion documents',
                impact: 'high',
                count: 1
            }
        ]
    },
    releaseNotes: `# Release Notes v2.0.0

## 🚨 Breaking Changes
- **Change authentication API signature**
  Updated auth.login() to require additional security parameter
  - **Affected APIs:** auth.login(), auth.refresh()
  - **Migration:** Add securityToken parameter to all auth calls

## ✨ New Features
- **OAuth 2.0 integration**
  Added support for OAuth 2.0 authentication flow
  - **Benefits:** Enhanced security, Third-party integration support

## 🐛 Bug Fixes
- **Fix token expiration handling**
  Resolved issue where expired tokens caused app crashes
  - **Issue:** #456
  - **Components:** TokenManager, AuthService

## ⚡ Improvements
- **Improve login performance**
  Reduced login time by 60% through caching optimizations
  - **Type:** performance
  - **Impact:** high`,
    confidence: {
        overall: 0.93,
        extraction: 0.92,
        versioning: 0.95,
        completeness: 0.92
    },
    metadata: {
        generatedAt: new Date(),
        cliVersion: '1.0.0',
        analysisId: 'analysis-' + Date.now(),
        processingTime: 2300
    }
};
/**
 * Example 1: Basic summary report for quick overview
 */
async function generateQuickSummary() {
    console.log('='.repeat(60));
    console.log('Example 1: Quick Summary Report');
    console.log('='.repeat(60));
    const reporter = new AnalysisReporter_1.AnalysisReporter();
    const summary = reporter.generateSummaryReport(exampleAnalysisResult);
    console.log(summary);
}
/**
 * Example 2: Detailed report for comprehensive review
 */
async function generateComprehensiveReport() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 2: Comprehensive Detailed Report');
    console.log('='.repeat(60));
    const reporter = new AnalysisReporter_1.AnalysisReporter();
    const detailed = reporter.generateDetailedReport(exampleAnalysisResult, {
        format: {
            type: 'detailed',
            includeMetadata: true,
            includeConfidence: true,
            includeEvidence: true,
            includeReleaseNotes: true
        },
        maxWidth: 80
    });
    console.log(detailed);
}
/**
 * Example 3: JSON report for automation
 */
async function generateAutomationReport() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 3: JSON Report for Automation');
    console.log('='.repeat(60));
    const reporter = new AnalysisReporter_1.AnalysisReporter();
    const json = reporter.generateJSONReport(exampleAnalysisResult, {
        format: {
            type: 'json',
            includeMetadata: true,
            includeConfidence: true,
            includeEvidence: true,
            includeReleaseNotes: false
        }
    });
    console.log(json);
}
/**
 * Example 4: Save reports to files
 */
async function saveReportsToFiles() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 4: Saving Reports to Files');
    console.log('='.repeat(60));
    const reporter = new AnalysisReporter_1.AnalysisReporter();
    try {
        // Save summary report
        await reporter.saveReport(exampleAnalysisResult, {
            type: 'summary',
            includeMetadata: true,
            includeConfidence: true,
            includeEvidence: true
        }, './reports/release-summary.txt', { includeTimestamp: true });
        // Save detailed report
        await reporter.saveReport(exampleAnalysisResult, {
            type: 'detailed',
            includeMetadata: true,
            includeConfidence: true,
            includeEvidence: true,
            includeReleaseNotes: true
        }, './reports/release-detailed.txt');
        // Save JSON report for CI/CD
        await reporter.saveReport(exampleAnalysisResult, {
            type: 'json',
            includeMetadata: true,
            includeConfidence: true,
            includeEvidence: true,
            includeReleaseNotes: true
        }, './reports/release-analysis.json');
        console.log('✅ All reports saved successfully!');
    }
    catch (error) {
        console.error('❌ Error saving reports:', error);
    }
}
/**
 * Example 5: Custom report configurations
 */
async function generateCustomReports() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 5: Custom Report Configurations');
    console.log('='.repeat(60));
    const reporter = new AnalysisReporter_1.AnalysisReporter();
    // Minimal summary for CI/CD status
    console.log('--- Minimal CI/CD Summary ---');
    const minimalSummary = reporter.generateSummaryReport(exampleAnalysisResult, {
        format: {
            type: 'summary',
            includeMetadata: false,
            includeConfidence: false,
            includeEvidence: false
        }
    });
    console.log(minimalSummary);
    // Evidence-focused report for review
    console.log('\n--- Evidence-Focused Report ---');
    const evidenceReport = reporter.generateDetailedReport(exampleAnalysisResult, {
        format: {
            type: 'detailed',
            includeMetadata: false,
            includeConfidence: true,
            includeEvidence: true,
            includeReleaseNotes: false
        }
    });
    console.log(evidenceReport);
    // Metadata-rich JSON for analytics
    console.log('\n--- Analytics JSON ---');
    const analyticsJson = reporter.generateJSONReport(exampleAnalysisResult, {
        format: {
            type: 'json',
            includeMetadata: true,
            includeConfidence: true,
            includeEvidence: true,
            includeReleaseNotes: true
        }
    });
    // Pretty print just the metadata section
    const parsed = JSON.parse(analyticsJson);
    console.log('Metadata:', JSON.stringify(parsed.metadata, null, 2));
    console.log('Confidence:', JSON.stringify(parsed.analysis.confidence, null, 2));
}
/**
 * Example 6: Error handling and edge cases
 */
async function demonstrateErrorHandling() {
    console.log('\n' + '='.repeat(60));
    console.log('Example 6: Error Handling and Edge Cases');
    console.log('='.repeat(60));
    const reporter = new AnalysisReporter_1.AnalysisReporter();
    // Example with no changes
    const noChangesResult = {
        ...exampleAnalysisResult,
        changes: {
            breakingChanges: [],
            newFeatures: [],
            bugFixes: [],
            improvements: [],
            documentation: [],
            metadata: {
                documentsAnalyzed: 0,
                extractionConfidence: 1.0,
                ambiguousItems: [],
                filteredItems: []
            }
        },
        versionRecommendation: {
            ...exampleAnalysisResult.versionRecommendation,
            recommendedVersion: '1.2.0',
            bumpType: 'none',
            rationale: 'No significant changes detected',
            confidence: 1.0,
            evidence: []
        }
    };
    console.log('--- No Changes Scenario ---');
    const noChangesReport = reporter.generateSummaryReport(noChangesResult);
    console.log(noChangesReport);
    // Example with low confidence
    const lowConfidenceResult = {
        ...exampleAnalysisResult,
        changes: {
            ...exampleAnalysisResult.changes,
            metadata: {
                ...exampleAnalysisResult.changes.metadata,
                extractionConfidence: 0.6,
                ambiguousItems: [
                    'Unclear change in section 2',
                    'Ambiguous API modification',
                    'Uncertain impact assessment'
                ]
            }
        },
        versionRecommendation: {
            ...exampleAnalysisResult.versionRecommendation,
            confidence: 0.65
        },
        confidence: {
            overall: 0.62,
            extraction: 0.6,
            versioning: 0.65,
            completeness: 0.61
        }
    };
    console.log('\n--- Low Confidence Scenario ---');
    const lowConfidenceReport = reporter.generateDetailedReport(lowConfidenceResult);
    console.log(lowConfidenceReport);
}
/**
 * Run all examples
 */
async function runAllExamples() {
    console.log('🚀 AnalysisReporter Usage Examples\n');
    await generateQuickSummary();
    await generateComprehensiveReport();
    await generateAutomationReport();
    await saveReportsToFiles();
    await generateCustomReports();
    await demonstrateErrorHandling();
    console.log('\n✅ All examples completed!');
}
// Run examples if this file is executed directly
if (require.main === module) {
    runAllExamples().catch(console.error);
}
//# sourceMappingURL=example-usage.js.map