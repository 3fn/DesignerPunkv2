"use strict";
/**
 * Example Usage: Analysis Validation System
 *
 * Demonstrates how to use the validation system for comprehensive
 * quality assurance of release analysis results.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicValidationExample = basicValidationExample;
exports.customConfigurationExample = customConfigurationExample;
exports.componentValidationExample = componentValidationExample;
exports.cliIntegrationExample = cliIntegrationExample;
exports.runExamples = runExamples;
const AnalysisValidator_1 = require("./AnalysisValidator");
// Example: Basic validation usage
async function basicValidationExample() {
    console.log('=== Basic Validation Example ===\n');
    const validator = new AnalysisValidator_1.AnalysisValidator();
    // Mock extracted changes
    const changes = {
        breakingChanges: [
            {
                id: '1',
                title: 'Remove deprecated API endpoints',
                description: 'Removed /api/v1/legacy endpoints that were deprecated in v2.0.0',
                affectedAPIs: ['/api/v1/users', '/api/v1/posts'],
                migrationGuidance: 'Use /api/v2/users and /api/v2/posts instead',
                source: 'task-3-completion.md',
                severity: 'high'
            }
        ],
        newFeatures: [
            {
                id: '2',
                title: 'Advanced search functionality',
                description: 'Added full-text search with filters and sorting',
                benefits: ['Faster content discovery', 'Better user experience'],
                requirements: ['Search index', 'Filter UI'],
                artifacts: ['SearchService.ts', 'SearchFilters.tsx'],
                source: 'task-1-completion.md',
                category: 'search'
            }
        ],
        bugFixes: [
            {
                id: '3',
                title: 'Fix memory leak in data processing',
                description: 'Resolved memory leak that occurred during large dataset processing',
                issueNumber: '456',
                affectedComponents: ['DataProcessor', 'BatchHandler'],
                source: 'task-2-completion.md',
                severity: 'medium'
            }
        ],
        improvements: [],
        documentation: [],
        metadata: {
            documentsAnalyzed: 3,
            extractionConfidence: 0.85,
            ambiguousItems: [],
            filteredItems: ['Updated README formatting']
        }
    };
    // Mock version recommendation
    const versionRecommendation = {
        currentVersion: '2.1.0',
        recommendedVersion: '3.0.0',
        bumpType: 'major',
        rationale: 'Major version bump required due to 1 breaking change',
        confidence: 0.88,
        evidence: [
            {
                type: 'breaking',
                description: '1 breaking change detected',
                source: 'completion documents',
                impact: 'high',
                count: 1
            },
            {
                type: 'feature',
                description: '1 new feature added',
                source: 'completion documents',
                impact: 'medium',
                count: 1
            },
            {
                type: 'fix',
                description: '1 bug fix implemented',
                source: 'completion documents',
                impact: 'medium',
                count: 1
            }
        ]
    };
    // Mock release notes
    const releaseNotes = `# 3.0.0

This release includes 1 breaking change, 1 new feature, and 1 bug fix.

## 🚨 Breaking Changes

- **Remove deprecated API endpoints**: Removed /api/v1/legacy endpoints that were deprecated in v2.0.0
  - **Affected APIs:** /api/v1/users, /api/v1/posts
  - **Migration:** Use /api/v2/users and /api/v2/posts instead

## ✨ New Features

- **Advanced search functionality**: Added full-text search with filters and sorting
  - **Benefits:** Faster content discovery, Better user experience

## 🐛 Bug Fixes

- **Fix memory leak in data processing**: Resolved memory leak that occurred during large dataset processing
  - **Issue:** #456
  - **Components:** DataProcessor, BatchHandler`;
    // Perform validation
    const result = validator.validateAnalysis(changes, versionRecommendation, releaseNotes);
    // Display results
    console.log(`Overall Status: ${result.status.toUpperCase()}`);
    console.log(`Quality Score: ${(result.score * 100).toFixed(1)}%`);
    console.log(`Valid: ${result.valid ? 'YES' : 'NO'}\n`);
    // Show detailed results
    console.log('=== Validation Details ===');
    const { versionValidation, releaseNoteValidation, confidenceValidation, qualityGates } = result.details;
    console.log(`\nVersion Validation:`);
    console.log(`  Semantic Compliance: ${versionValidation.semanticCompliance ? 'PASS' : 'FAIL'}`);
    console.log(`  Progression Valid: ${versionValidation.progressionValid ? 'PASS' : 'FAIL'}`);
    console.log(`  Bump Type Correct: ${versionValidation.bumpTypeCorrect ? 'PASS' : 'FAIL'}`);
    console.log(`  Score: ${(versionValidation.score * 100).toFixed(1)}%`);
    console.log(`\nRelease Note Validation:`);
    console.log(`  Completeness: ${(releaseNoteValidation.completeness * 100).toFixed(1)}%`);
    console.log(`  Formatting: ${(releaseNoteValidation.formatting * 100).toFixed(1)}%`);
    console.log(`  Clarity: ${(releaseNoteValidation.clarity * 100).toFixed(1)}%`);
    console.log(`  Score: ${(releaseNoteValidation.score * 100).toFixed(1)}%`);
    console.log(`\nConfidence Validation:`);
    console.log(`  Overall Confidence: ${(confidenceValidation.overallConfidence * 100).toFixed(1)}%`);
    console.log(`  Extraction Confidence: ${(confidenceValidation.extractionConfidence * 100).toFixed(1)}%`);
    console.log(`  Version Confidence: ${(confidenceValidation.versionConfidence * 100).toFixed(1)}%`);
    console.log(`  Thresholds Met: ${confidenceValidation.thresholdsMet ? 'YES' : 'NO'}`);
    console.log(`\nQuality Gates:`);
    qualityGates.forEach(gate => {
        const status = gate.passed ? 'PASS' : 'FAIL';
        const critical = gate.critical ? ' (CRITICAL)' : '';
        console.log(`  ${gate.name}: ${status}${critical} - ${gate.message}`);
    });
    // Show any issues
    if (result.errors.length > 0) {
        console.log(`\nErrors:`);
        result.errors.forEach(error => console.log(`  ❌ ${error}`));
    }
    if (result.warnings.length > 0) {
        console.log(`\nWarnings:`);
        result.warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
    }
}
// Example: Custom configuration
async function customConfigurationExample() {
    console.log('\n\n=== Custom Configuration Example ===\n');
    // Define custom validation configuration
    const customConfig = {
        confidenceThresholds: {
            minimum: 0.8, // Higher minimum threshold
            warning: 0.85, // Higher warning threshold
            good: 0.9, // Higher good threshold
            extraction: 0.8, // Higher extraction threshold
            version: 0.85 // Higher version threshold
        },
        qualityGates: [
            { name: 'extraction_confidence', threshold: 0.8, critical: true, enabled: true },
            { name: 'version_confidence', threshold: 0.85, critical: true, enabled: true },
            { name: 'release_note_completeness', threshold: 0.9, critical: false, enabled: true },
            { name: 'overall_quality', threshold: 0.85, critical: false, enabled: true },
            { name: 'custom_enterprise_standard', threshold: 0.95, critical: false, enabled: true }
        ],
        releaseNoteRequirements: {
            minimumSections: 2,
            requireBreakingChangeDetails: true,
            requireMigrationGuidance: true,
            minimumDescriptionLength: 25, // Longer descriptions required
            requireSummary: true
        },
        versionValidationRules: {
            enforceSemanticVersioning: true,
            allowPreReleaseVersions: false, // Stricter - no pre-releases
            requireEvidenceForBumps: true,
            minimumConfidenceForMajor: 0.9 // Higher confidence required for major bumps
        }
    };
    const strictValidator = new AnalysisValidator_1.AnalysisValidator(customConfig);
    // Use same mock data as before but with stricter validation
    const changes = {
        breakingChanges: [],
        newFeatures: [
            {
                id: '1',
                title: 'New feature',
                description: 'Short description', // Will trigger length warning
                benefits: [],
                requirements: [],
                artifacts: [],
                source: 'task-1.md',
                category: 'feature'
            }
        ],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
            documentsAnalyzed: 1,
            extractionConfidence: 0.75, // Below custom threshold
            ambiguousItems: [],
            filteredItems: []
        }
    };
    const versionRecommendation = {
        currentVersion: '1.0.0',
        recommendedVersion: '1.1.0',
        bumpType: 'minor',
        rationale: 'Minor version bump due to new features',
        confidence: 0.75, // Below custom threshold
        evidence: [
            {
                type: 'feature',
                description: '1 new feature added',
                source: 'completion documents',
                impact: 'low',
                count: 1
            }
        ]
    };
    const releaseNotes = `# 1.1.0

## Features
- New feature: Short description`; // Will trigger various warnings
    const result = strictValidator.validateAnalysis(changes, versionRecommendation, releaseNotes);
    console.log(`Strict Validation Status: ${result.status.toUpperCase()}`);
    console.log(`Quality Score: ${(result.score * 100).toFixed(1)}%`);
    console.log(`Valid: ${result.valid ? 'YES' : 'NO'}\n`);
    if (result.errors.length > 0) {
        console.log('Errors (Custom Thresholds):');
        result.errors.forEach(error => console.log(`  ❌ ${error}`));
    }
    if (result.warnings.length > 0) {
        console.log('\nWarnings (Custom Requirements):');
        result.warnings.forEach(warning => console.log(`  ⚠️  ${warning}`));
    }
    console.log('\nCustom Quality Gates:');
    result.details.qualityGates.forEach(gate => {
        const status = gate.passed ? 'PASS' : 'FAIL';
        const critical = gate.critical ? ' (CRITICAL)' : '';
        console.log(`  ${gate.name}: ${status}${critical} - Score: ${(gate.score * 100).toFixed(1)}%`);
    });
}
// Example: Component-specific validation
async function componentValidationExample() {
    console.log('\n\n=== Component-Specific Validation Example ===\n');
    const validator = new AnalysisValidator_1.AnalysisValidator();
    // Test version validation specifically
    console.log('Testing Version Validation:');
    const invalidVersionRecommendation = {
        currentVersion: 'invalid-version', // Invalid format
        recommendedVersion: '2.0.0', // Wrong progression for minor bump
        bumpType: 'minor', // Should be major for this jump
        rationale: 'Version bump',
        confidence: 0.5, // Low confidence
        evidence: [] // No evidence
    };
    const mockChanges = {
        breakingChanges: [
            {
                id: '1',
                title: 'Breaking change',
                description: 'API change',
                affectedAPIs: ['api'],
                source: 'task.md',
                severity: 'high'
            }
        ],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
            documentsAnalyzed: 1,
            extractionConfidence: 0.8,
            ambiguousItems: [],
            filteredItems: []
        }
    };
    const versionResult = validator.validateVersionRecommendation(invalidVersionRecommendation, mockChanges);
    console.log(`  Valid: ${versionResult.valid ? 'YES' : 'NO'}`);
    console.log(`  Semantic Compliance: ${versionResult.semanticCompliance ? 'PASS' : 'FAIL'}`);
    console.log(`  Progression Valid: ${versionResult.progressionValid ? 'PASS' : 'FAIL'}`);
    console.log(`  Bump Type Correct: ${versionResult.bumpTypeCorrect ? 'PASS' : 'FAIL'}`);
    if (versionResult.errors.length > 0) {
        console.log('  Errors:');
        versionResult.errors.forEach(error => console.log(`    ❌ ${error}`));
    }
    // Test release note validation specifically
    console.log('\nTesting Release Note Validation:');
    const poorReleaseNotes = `# 1.1.0
- Fix
- Update
- Various improvements`; // Poor quality notes
    const notesResult = validator.validateReleaseNotes(poorReleaseNotes, mockChanges);
    console.log(`  Valid: ${notesResult.valid ? 'YES' : 'NO'}`);
    console.log(`  Completeness: ${(notesResult.completeness * 100).toFixed(1)}%`);
    console.log(`  Formatting: ${(notesResult.formatting * 100).toFixed(1)}%`);
    console.log(`  Clarity: ${(notesResult.clarity * 100).toFixed(1)}%`);
    if (notesResult.errors.length > 0) {
        console.log('  Errors:');
        notesResult.errors.forEach(error => console.log(`    ❌ ${error}`));
    }
    if (notesResult.suggestions.length > 0) {
        console.log('  Suggestions:');
        notesResult.suggestions.forEach(suggestion => console.log(`    💡 ${suggestion}`));
    }
    // Test confidence validation specifically
    console.log('\nTesting Confidence Validation:');
    const lowConfidenceChanges = {
        ...mockChanges,
        metadata: {
            ...mockChanges.metadata,
            extractionConfidence: 0.4, // Very low confidence
            ambiguousItems: ['unclear item 1', 'unclear item 2']
        }
    };
    const lowConfidenceVersion = {
        ...invalidVersionRecommendation,
        confidence: 0.3 // Very low confidence
    };
    const confidenceResult = validator.validateConfidence(lowConfidenceChanges, lowConfidenceVersion);
    console.log(`  Valid: ${confidenceResult.valid ? 'YES' : 'NO'}`);
    console.log(`  Overall Confidence: ${(confidenceResult.overallConfidence * 100).toFixed(1)}%`);
    console.log(`  Thresholds Met: ${confidenceResult.thresholdsMet ? 'YES' : 'NO'}`);
    if (confidenceResult.errors.length > 0) {
        console.log('  Errors:');
        confidenceResult.errors.forEach(error => console.log(`    ❌ ${error}`));
    }
    if (confidenceResult.warnings.length > 0) {
        console.log('  Warnings:');
        confidenceResult.warnings.forEach(warning => console.log(`    ⚠️  ${warning}`));
    }
}
// Example: Integration with CLI workflow
async function cliIntegrationExample() {
    console.log('\n\n=== CLI Integration Example ===\n');
    const validator = new AnalysisValidator_1.AnalysisValidator();
    // Simulate CLI workflow validation
    function simulateCliValidation(changes, version, notes) {
        console.log('🔍 Validating analysis results...\n');
        const result = validator.validateAnalysis(changes, version, notes);
        // CLI-style output
        console.log('✅ Analysis Complete');
        console.log(`   Version: ${version.currentVersion} → ${version.recommendedVersion} (${version.bumpType})`);
        console.log(`   Confidence: ${(version.confidence * 100).toFixed(0)}%\n`);
        console.log('🔍 Validation Results');
        const statusIcon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
        console.log(`   ${statusIcon} Overall: ${result.status.toUpperCase()} (${(result.score * 100).toFixed(0)}%)`);
        const versionIcon = result.details.versionValidation.valid ? '✅' : '❌';
        console.log(`   ${versionIcon} Version validation: ${result.details.versionValidation.valid ? 'PASS' : 'FAIL'} (${(result.details.versionValidation.score * 100).toFixed(0)}%)`);
        const notesIcon = result.details.releaseNoteValidation.valid ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
        console.log(`   ${notesIcon} Release notes: ${result.details.releaseNoteValidation.valid ? 'PASS' : 'WARNING'} (${(result.details.releaseNoteValidation.score * 100).toFixed(0)}%)`);
        const confidenceIcon = result.details.confidenceValidation.valid ? '✅' : '❌';
        console.log(`   ${confidenceIcon} Confidence: ${result.details.confidenceValidation.valid ? 'PASS' : 'FAIL'} (${(result.details.confidenceValidation.overallConfidence * 100).toFixed(0)}%)`);
        if (result.errors.length > 0) {
            console.log('\n❌ Errors:');
            result.errors.forEach(error => console.log(`   • ${error}`));
        }
        if (result.warnings.length > 0) {
            console.log('\n⚠️  Warnings:');
            result.warnings.forEach(warning => console.log(`   • ${warning}`));
        }
        console.log('\n📊 Quality Gates:');
        result.details.qualityGates.forEach(gate => {
            const icon = gate.passed ? '✅' : '❌';
            const critical = gate.critical ? ' (CRITICAL)' : '';
            console.log(`   ${icon} ${gate.name}: ${gate.passed ? 'PASS' : 'FAIL'}${critical} (${(gate.score * 100).toFixed(0)}% ≥ ${(gate.threshold * 100).toFixed(0)}%)`);
        });
        console.log(`\n${result.status === 'fail' ? '❌' : '✅'} Continue with release? [y/N/review]`);
        return result;
    }
    // Good analysis example
    const goodChanges = {
        breakingChanges: [],
        newFeatures: [
            {
                id: '1',
                title: 'Enhanced user dashboard',
                description: 'Added comprehensive analytics and customizable widgets',
                benefits: ['Better insights', 'Improved UX'],
                requirements: [],
                artifacts: [],
                source: 'task-1.md',
                category: 'ui'
            }
        ],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
            documentsAnalyzed: 1,
            extractionConfidence: 0.9,
            ambiguousItems: [],
            filteredItems: []
        }
    };
    const goodVersion = {
        currentVersion: '1.2.0',
        recommendedVersion: '1.3.0',
        bumpType: 'minor',
        rationale: 'Minor version bump due to new features',
        confidence: 0.9,
        evidence: [
            {
                type: 'feature',
                description: '1 new feature added',
                source: 'completion documents',
                impact: 'medium',
                count: 1
            }
        ]
    };
    const goodNotes = `# 1.3.0

This release includes 1 new feature that enhances the user experience.

## ✨ New Features

- **Enhanced user dashboard**: Added comprehensive analytics and customizable widgets
  - **Benefits:** Better insights, Improved UX
  - **Category:** ui`;
    simulateCliValidation(goodChanges, goodVersion, goodNotes);
}
// Run all examples
async function runExamples() {
    try {
        await basicValidationExample();
        await customConfigurationExample();
        await componentValidationExample();
        await cliIntegrationExample();
    }
    catch (error) {
        console.error('Example execution error:', error);
    }
}
// Run examples if this file is executed directly
if (require.main === module) {
    runExamples();
}
//# sourceMappingURL=example-usage.js.map