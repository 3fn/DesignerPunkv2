"use strict";
/**
 * Example usage of VersionCalculator
 *
 * Demonstrates how to use the version calculation functionality
 * for semantic versioning based on extracted changes.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.demonstrateVersionCalculation = demonstrateVersionCalculation;
exports.exampleCLIIntegration = exampleCLIIntegration;
const VersionCalculator_1 = require("./VersionCalculator");
// Example usage of VersionCalculator
function demonstrateVersionCalculation() {
    const calculator = new VersionCalculator_1.VersionCalculator();
    // Example 1: Breaking changes require major version bump
    const breakingChanges = {
        breakingChanges: [{
                id: '1',
                title: 'Remove deprecated authentication API',
                description: 'Removed the old auth.login() method in favor of auth.authenticate()',
                affectedAPIs: ['auth.login', 'auth.validateToken'],
                migrationGuidance: 'Replace auth.login() calls with auth.authenticate()',
                source: 'task-1-completion.md',
                severity: 'high'
            }],
        newFeatures: [],
        bugFixes: [],
        improvements: [],
        documentation: [],
        metadata: {
            documentsAnalyzed: 1,
            extractionConfidence: 0.95,
            ambiguousItems: [],
            filteredItems: []
        }
    };
    const majorBump = calculator.calculateVersionBump(breakingChanges, '1.2.3');
    console.log('Major version bump example:');
    console.log(`Current: ${majorBump.currentVersion} → Recommended: ${majorBump.recommendedVersion}`);
    console.log(`Bump type: ${majorBump.bumpType}`);
    console.log(`Confidence: ${majorBump.confidence}`);
    console.log(`Rationale: ${majorBump.rationale}`);
    console.log('---');
    // Example 2: New features require minor version bump
    const newFeatures = {
        breakingChanges: [],
        newFeatures: [{
                id: '2',
                title: 'Add user preference management',
                description: 'Users can now save and manage their dashboard preferences',
                benefits: ['Improved user experience', 'Personalization'],
                requirements: ['REQ-15', 'REQ-16'],
                artifacts: ['UserPreferences.ts', 'PreferenceManager.ts'],
                source: 'task-2-completion.md',
                category: 'user-experience'
            }],
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
    const minorBump = calculator.calculateVersionBump(newFeatures, '1.2.3');
    console.log('Minor version bump example:');
    console.log(`Current: ${minorBump.currentVersion} → Recommended: ${minorBump.recommendedVersion}`);
    console.log(`Bump type: ${minorBump.bumpType}`);
    console.log(`Confidence: ${minorBump.confidence}`);
    console.log(`Rationale: ${minorBump.rationale}`);
    console.log('---');
    // Example 3: Bug fixes require patch version bump
    const bugFixes = {
        breakingChanges: [],
        newFeatures: [],
        bugFixes: [{
                id: '3',
                title: 'Fix email validation regex',
                description: 'Corrected email validation to properly handle international domains',
                issueNumber: 'BUG-123',
                affectedComponents: ['LoginForm', 'RegistrationForm'],
                source: 'task-3-completion.md',
                severity: 'medium'
            }],
        improvements: [{
                id: '4',
                title: 'Optimize database query performance',
                description: 'Improved user lookup queries by 40% through better indexing',
                type: 'performance',
                impact: 'medium',
                source: 'task-3-completion.md'
            }],
        documentation: [],
        metadata: {
            documentsAnalyzed: 1,
            extractionConfidence: 0.85,
            ambiguousItems: ['Performance improvement impact unclear'],
            filteredItems: []
        }
    };
    const patchBump = calculator.calculateVersionBump(bugFixes, '1.2.3');
    console.log('Patch version bump example:');
    console.log(`Current: ${patchBump.currentVersion} → Recommended: ${patchBump.recommendedVersion}`);
    console.log(`Bump type: ${patchBump.bumpType}`);
    console.log(`Confidence: ${patchBump.confidence}`);
    console.log(`Rationale: ${patchBump.rationale}`);
    console.log('---');
    // Example 4: Pre-release version handling
    const preReleaseBump = calculator.handlePreReleaseVersions('2.0.0-beta.1', 'patch');
    console.log('Pre-release version handling:');
    console.log(`Current: 2.0.0-beta.1 → Next: ${preReleaseBump}`);
    console.log('---');
    // Example 5: Validation
    const validation = calculator.validateSemanticVersioning(majorBump);
    console.log('Validation example:');
    console.log(`Valid: ${validation.valid}`);
    console.log(`Errors: ${validation.errors.length}`);
    console.log(`Warnings: ${validation.warnings.length}`);
    return {
        majorBump,
        minorBump,
        patchBump,
        validation
    };
}
// Example of integrating with CLI workflow
function exampleCLIIntegration(changes, currentVersion) {
    const calculator = new VersionCalculator_1.VersionCalculator();
    // Calculate version recommendation
    const recommendation = calculator.calculateVersionBump(changes, currentVersion);
    // Validate the recommendation
    const validation = calculator.validateSemanticVersioning(recommendation);
    // Generate CLI output
    console.log('\n🔍 Release Analysis Results:');
    console.log(`📦 Current Version: ${recommendation.currentVersion}`);
    console.log(`🚀 Recommended Version: ${recommendation.recommendedVersion}`);
    console.log(`📈 Bump Type: ${recommendation.bumpType.toUpperCase()}`);
    console.log(`🎯 Confidence: ${(recommendation.confidence * 100).toFixed(1)}%`);
    console.log('\n📋 Evidence:');
    recommendation.evidence.forEach((evidence, index) => {
        const icon = evidence.type === 'breaking' ? '💥' :
            evidence.type === 'feature' ? '✨' :
                evidence.type === 'fix' ? '🐛' : '🔧';
        console.log(`  ${icon} ${evidence.description} (${evidence.impact} impact)`);
    });
    console.log('\n📝 Rationale:');
    console.log(recommendation.rationale.split('\n').map(line => `  ${line}`).join('\n'));
    if (!validation.valid) {
        console.log('\n❌ Validation Errors:');
        validation.errors.forEach(error => console.log(`  • ${error}`));
    }
    if (validation.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        validation.warnings.forEach(warning => console.log(`  • ${warning}`));
    }
    return recommendation;
}
// Run demonstration if this file is executed directly
if (require.main === module) {
    demonstrateVersionCalculation();
}
//# sourceMappingURL=example-usage.js.map