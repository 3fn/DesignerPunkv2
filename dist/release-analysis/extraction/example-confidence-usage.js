"use strict";
/**
 * Example usage of confidence metrics in release analysis
 *
 * Demonstrates how to use the confidence metrics system to evaluate
 * extraction quality and make informed decisions about release analysis results.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.demonstrateConfidenceMetrics = demonstrateConfidenceMetrics;
const SimpleChangeExtractor_1 = require("./SimpleChangeExtractor");
const AnalysisConfig_1 = require("../config/AnalysisConfig");
async function demonstrateConfidenceMetrics() {
    console.log('=== Release Analysis Confidence Metrics Demo ===\n');
    // Initialize extractor with default configuration
    const extractor = new SimpleChangeExtractor_1.SimpleChangeExtractor(AnalysisConfig_1.DEFAULT_ANALYSIS_CONFIG.extraction);
    // Example completion documents with varying quality
    const documents = [
        {
            path: 'high-quality-completion.md',
            content: `# Task 3 Completion: User Authentication System

**Date**: 2025-01-10
**Task**: Implement OAuth2 authentication
**Status**: Complete

## Breaking Changes
- **API Change**: Modified UserService.authenticate() method signature
  - **Migration**: Update calls to include new options parameter: \`authenticate(credentials, { provider: 'oauth2' })\`
  - **Affected APIs**: UserService.authenticate(), AuthController.login()
  - **Severity**: High - affects all authentication flows

## New Features
- **OAuth2 Authentication**: Complete OAuth2 implementation with Google and GitHub providers
  - **Benefits**: Enhanced security, improved user experience, reduced password management burden
  - **Requirements**: OAuth2 provider configuration, SSL certificates
  - **Artifacts**: AuthService.ts, OAuthProvider.ts, LoginComponent.tsx, AuthConfig.ts

## Bug Fixes
- **Memory Leak Fix**: Resolved memory leak in UserComponent event listeners (#456)
  - **Affected Components**: UserComponent, ProfileComponent, SessionManager
  - **Severity**: Critical - was causing browser crashes after extended use

## Improvements
- **Performance**: Optimized authentication token validation using caching
  - **Type**: Performance improvement
  - **Impact**: High - 50% faster login times, reduced server load
`,
            lastModified: new Date(),
            gitCommit: 'abc123',
            metadata: {
                title: 'Task 3 Completion: User Authentication System',
                task: '3',
                type: 'task-completion'
            }
        },
        {
            path: 'medium-quality-completion.md',
            content: `# Task 4 Completion

## Changes Made
- Fixed some bugs in the user interface
- Added new search functionality
- Improved performance in several areas
- Updated documentation

## Issues Resolved
- Fixed issue #789 with search not working
- Resolved performance problems
`,
            lastModified: new Date(),
            gitCommit: 'def456',
            metadata: {
                title: 'Task 4 Completion',
                task: '4',
                type: 'task-completion'
            }
        },
        {
            path: 'low-quality-completion.md',
            content: `Made some changes. Fixed stuff. Added things. Updated code.`,
            lastModified: new Date(),
            gitCommit: 'ghi789',
            metadata: {
                title: 'Low Quality Completion',
                type: 'other'
            }
        }
    ];
    // Extract changes with confidence metrics
    console.log('Extracting changes with confidence metrics...\n');
    const result = await extractor.extractChangesWithConfidence(documents);
    // Display overall results
    console.log('=== EXTRACTION RESULTS ===');
    console.log(`Documents analyzed: ${result.changes.metadata.documentsAnalyzed}`);
    console.log(`Breaking changes: ${result.changes.breakingChanges.length}`);
    console.log(`New features: ${result.changes.newFeatures.length}`);
    console.log(`Bug fixes: ${result.changes.bugFixes.length}`);
    console.log(`Improvements: ${result.changes.improvements.length}`);
    console.log(`Ambiguous items: ${result.changes.metadata.ambiguousItems.length}\n`);
    // Display confidence metrics
    console.log('=== CONFIDENCE METRICS ===');
    console.log(`Overall confidence: ${(result.confidenceScore.overall * 100).toFixed(1)}%`);
    console.log('Component scores:');
    console.log(`  - Extraction: ${(result.confidenceScore.components.extraction * 100).toFixed(1)}%`);
    console.log(`  - Categorization: ${(result.confidenceScore.components.categorization * 100).toFixed(1)}%`);
    console.log(`  - Completeness: ${(result.confidenceScore.components.completeness * 100).toFixed(1)}%`);
    console.log(`  - Consistency: ${(result.confidenceScore.components.consistency * 100).toFixed(1)}%\n`);
    // Display quality indicators
    console.log('=== QUALITY INDICATORS ===');
    console.log(`Structure quality: ${(result.confidenceScore.quality.structureQuality * 100).toFixed(1)}%`);
    console.log(`Information richness: ${(result.confidenceScore.quality.informationRichness * 100).toFixed(1)}%`);
    console.log(`Categorization accuracy: ${(result.confidenceScore.quality.categorizationAccuracy * 100).toFixed(1)}%\n`);
    // Display uncertainties
    if (result.confidenceScore.uncertainties.length > 0) {
        console.log('=== UNCERTAINTIES IDENTIFIED ===');
        for (const uncertainty of result.confidenceScore.uncertainties) {
            console.log(`${uncertainty.severity.toUpperCase()}: ${uncertainty.description}`);
            console.log(`  Suggested action: ${uncertainty.suggestedAction}`);
            if (uncertainty.affectedItems.length > 0) {
                console.log(`  Affected items: ${uncertainty.affectedItems.join(', ')}`);
            }
            console.log('');
        }
    }
    // Display validation results
    console.log('=== VALIDATION RESULTS ===');
    console.log(`Status: ${result.validation.status.toUpperCase()}`);
    console.log(`Meets thresholds: ${result.confidenceScore.validation.meetsThresholds ? 'YES' : 'NO'}`);
    if (result.validation.thresholdViolations.length > 0) {
        console.log('Threshold violations:');
        for (const violation of result.validation.thresholdViolations) {
            console.log(`  - ${violation.threshold}: expected ${violation.expected}, got ${violation.actual.toFixed(2)}`);
        }
    }
    if (result.validation.recommendations.length > 0) {
        console.log('Recommendations:');
        for (const rec of result.validation.recommendations) {
            console.log(`  - ${rec.priority.toUpperCase()}: ${rec.description}`);
        }
    }
    console.log('');
    // Generate and display quality report
    const qualityReport = extractor.generateQualityReport(result.confidenceScore, result.changes);
    console.log('=== QUALITY REPORT ===');
    console.log(`Summary: ${qualityReport.summary}\n`);
    if (qualityReport.recommendations.length > 0) {
        console.log('Recommendations:');
        for (const recommendation of qualityReport.recommendations) {
            console.log(`  - ${recommendation}`);
        }
        console.log('');
    }
    if (qualityReport.actionItems.length > 0) {
        console.log('Action Items:');
        for (const action of qualityReport.actionItems) {
            console.log(`  - ${action}`);
        }
        console.log('');
    }
    // Demonstrate individual item confidence
    if (result.changes.newFeatures.length > 0) {
        console.log('=== INDIVIDUAL ITEM CONFIDENCE ===');
        const feature = result.changes.newFeatures[0];
        const itemConfidence = extractor.calculateItemConfidence(feature, {
            documentStructure: 'structured',
            extractionMethod: 'section'
        });
        console.log(`Feature: "${feature.title}"`);
        console.log(`Item confidence: ${(itemConfidence.confidence * 100).toFixed(1)}%`);
        console.log('Confidence factors:');
        for (const factor of itemConfidence.factors) {
            console.log(`  - ${factor.name}: ${(factor.score * 100).toFixed(1)}% (weight: ${factor.weight})`);
            console.log(`    ${factor.explanation}`);
        }
        if (itemConfidence.uncertainties.length > 0) {
            console.log('Item uncertainties:');
            for (const uncertainty of itemConfidence.uncertainties) {
                console.log(`  - ${uncertainty}`);
            }
        }
        console.log('');
    }
    // Decision making based on confidence
    console.log('=== DECISION GUIDANCE ===');
    if (result.validation.status === 'pass') {
        console.log('✅ PROCEED: Extraction quality is sufficient for release analysis');
    }
    else if (result.validation.status === 'warning') {
        console.log('⚠️  REVIEW RECOMMENDED: Consider manual validation before proceeding');
    }
    else {
        console.log('❌ MANUAL REVIEW REQUIRED: Extraction quality below acceptable threshold');
    }
    if (result.confidenceScore.overall < 0.7) {
        console.log('💡 Consider improving completion document structure and detail');
    }
    if (result.confidenceScore.uncertainties.some(u => u.severity === 'high')) {
        console.log('🚨 High-severity uncertainties require immediate attention');
    }
    console.log('\n=== Demo Complete ===');
}
// Run demo if this file is executed directly
if (require.main === module) {
    demonstrateConfidenceMetrics().catch(console.error);
}
//# sourceMappingURL=example-confidence-usage.js.map