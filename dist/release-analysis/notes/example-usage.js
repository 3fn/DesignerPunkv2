"use strict";
/**
 * Example usage of ReleaseNoteGenerator
 *
 * Demonstrates how to generate release notes from extracted changes
 * with various template configurations and formatting options.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleChanges = void 0;
exports.demonstrateBasicUsage = demonstrateBasicUsage;
exports.demonstrateCustomTemplate = demonstrateCustomTemplate;
exports.demonstrateIndividualFormatting = demonstrateIndividualFormatting;
exports.demonstrateMinimalTemplate = demonstrateMinimalTemplate;
exports.demonstrateEmptyChanges = demonstrateEmptyChanges;
exports.runExamples = runExamples;
const ReleaseNoteGenerator_1 = require("./ReleaseNoteGenerator");
// Example extracted changes from completion documents
const exampleChanges = {
    breakingChanges: [
        {
            id: 'break-1',
            title: 'Token System Refactor',
            description: 'Mathematical token validation now requires explicit baseline grid alignment',
            affectedAPIs: ['TokenValidator', 'BaselineGridValidator'],
            migrationGuidance: 'Update validation calls to include baseline grid context',
            source: '.kiro/specs/mathematical-token-system/completion/task-1-completion.md',
            severity: 'high'
        }
    ],
    newFeatures: [
        {
            id: 'feat-1',
            title: 'Cross-Platform Token Generation',
            description: 'Generate platform-specific token files from unitless base values',
            benefits: [
                'Consistent design tokens across web, iOS, and Android',
                'Automatic unit conversion for each platform',
                'Reduced maintenance overhead'
            ],
            requirements: ['Mathematical token foundation', 'Platform adapters'],
            artifacts: ['TokenGenerator.ts', 'PlatformAdapters.ts'],
            source: '.kiro/specs/cross-platform-build-system/completion/task-2-completion.md',
            category: 'Core System'
        },
        {
            id: 'feat-2',
            title: 'Strategic Flexibility Tracking',
            description: 'Monitor usage patterns of strategic flexibility tokens to ensure appropriate usage',
            benefits: [
                'Data-driven decisions on token system evolution',
                'Early detection of misuse patterns',
                'Automated compliance reporting'
            ],
            requirements: ['Usage analytics', 'Tracking infrastructure'],
            artifacts: ['FlexibilityTracker.ts', 'UsageAnalyzer.ts'],
            source: '.kiro/specs/mathematical-token-system/completion/task-3-completion.md',
            category: 'Analytics'
        }
    ],
    bugFixes: [
        {
            id: 'fix-1',
            title: 'Baseline Grid Validation Edge Cases',
            description: 'Fixed validation errors for edge cases in baseline grid alignment calculations',
            issueNumber: '123',
            affectedComponents: ['BaselineGridValidator', 'ToleranceCalculator'],
            source: '.kiro/specs/mathematical-token-system/completion/task-4-completion.md',
            severity: 'medium'
        }
    ],
    improvements: [
        {
            id: 'imp-1',
            title: 'Token Generation Performance',
            description: 'Optimized token generation performance for large token sets using caching',
            type: 'performance',
            impact: 'medium',
            source: '.kiro/specs/cross-platform-build-system/completion/task-5-completion.md'
        },
        {
            id: 'imp-2',
            title: 'Error Message Clarity',
            description: 'Improved error messages for token validation failures with actionable guidance',
            type: 'usability',
            impact: 'high',
            source: '.kiro/specs/mathematical-token-system/completion/task-6-completion.md'
        }
    ],
    documentation: [
        {
            id: 'doc-1',
            title: 'API Documentation Update',
            description: 'Updated API documentation with new token validation examples and migration guides',
            type: 'api-docs',
            source: '.kiro/specs/mathematical-token-system/completion/task-7-completion.md'
        }
    ],
    metadata: {
        documentsAnalyzed: 7,
        extractionConfidence: 0.92,
        ambiguousItems: ['Unclear if performance improvement affects all platforms'],
        filteredItems: ['Documentation-only changes in README']
    }
};
exports.exampleChanges = exampleChanges;
async function demonstrateBasicUsage() {
    console.log('=== Basic Release Note Generation ===\n');
    const generator = new ReleaseNoteGenerator_1.ReleaseNoteGenerator();
    // Generate release notes with default template
    const releaseNotes = await generator.generateReleaseNotes(exampleChanges, '1.2.0');
    console.log(releaseNotes);
}
async function demonstrateCustomTemplate() {
    console.log('\n=== Custom Template Example ===\n');
    const generator = new ReleaseNoteGenerator_1.ReleaseNoteGenerator();
    // Custom template with different styling and sections
    const customTemplate = {
        format: 'markdown',
        sections: [
            { type: 'breaking', title: '⚠️ BREAKING CHANGES', enabled: true, priority: 1, includeSource: true },
            { type: 'features', title: '🎉 NEW FEATURES', enabled: true, priority: 2, includeSource: false },
            { type: 'fixes', title: '🔧 BUG FIXES', enabled: true, priority: 3, includeSource: false },
            { type: 'improvements', title: '✨ IMPROVEMENTS', enabled: true, priority: 4, includeSource: false },
            { type: 'documentation', title: '📖 DOCUMENTATION', enabled: true, priority: 5, includeSource: false }
        ],
        styling: {
            headerLevel: 3,
            bulletStyle: '*',
            includeMetadata: true,
            includeSummary: true
        }
    };
    const releaseNotes = await generator.generateReleaseNotes(exampleChanges, '1.2.0', customTemplate);
    console.log(releaseNotes);
}
async function demonstrateIndividualFormatting() {
    console.log('\n=== Individual Section Formatting ===\n');
    const generator = new ReleaseNoteGenerator_1.ReleaseNoteGenerator();
    // Format individual sections
    console.log('Breaking Changes:');
    console.log(generator.formatBreakingChanges(exampleChanges.breakingChanges));
    console.log('\nNew Features:');
    console.log(generator.formatNewFeatures(exampleChanges.newFeatures));
    console.log('\nBug Fixes:');
    console.log(generator.formatBugFixes(exampleChanges.bugFixes));
    console.log('\nImprovements:');
    console.log(generator.formatImprovements(exampleChanges.improvements));
}
async function demonstrateMinimalTemplate() {
    console.log('\n=== Minimal Template (Breaking Changes Only) ===\n');
    const generator = new ReleaseNoteGenerator_1.ReleaseNoteGenerator();
    // Minimal template focusing only on breaking changes
    const minimalTemplate = {
        format: 'markdown',
        sections: [
            { type: 'breaking', title: 'Breaking Changes', enabled: true, priority: 1, includeSource: true }
        ],
        styling: {
            headerLevel: 2,
            bulletStyle: '-',
            includeMetadata: false,
            includeSummary: false
        }
    };
    const releaseNotes = await generator.generateReleaseNotes(exampleChanges, '1.2.0', minimalTemplate);
    console.log(releaseNotes);
}
async function demonstrateEmptyChanges() {
    console.log('\n=== Empty Changes Example ===\n');
    const generator = new ReleaseNoteGenerator_1.ReleaseNoteGenerator();
    const emptyChanges = {
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
    };
    const releaseNotes = await generator.generateReleaseNotes(emptyChanges, '1.0.1');
    console.log(releaseNotes);
}
// Run all examples
async function runExamples() {
    try {
        await demonstrateBasicUsage();
        await demonstrateCustomTemplate();
        await demonstrateIndividualFormatting();
        await demonstrateMinimalTemplate();
        await demonstrateEmptyChanges();
    }
    catch (error) {
        console.error('Error running examples:', error);
    }
}
// Run examples if this file is executed directly
if (require.main === module) {
    runExamples();
}
//# sourceMappingURL=example-usage.js.map