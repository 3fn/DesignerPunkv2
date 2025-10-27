"use strict";
/**
 * Accuracy Test Cases
 *
 * Predefined test cases with known completion documents and expected results
 * for validating extraction and categorization accuracy.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccuracyTestCases = void 0;
/**
 * Collection of test cases for accuracy validation
 */
class AccuracyTestCases {
    /**
     * Get all predefined test cases
     */
    static getAllTestCases() {
        return [
            this.getStructuredBreakingChangeTestCase(),
            this.getStructuredFeatureTestCase(),
            this.getStructuredBugFixTestCase(),
            this.getUnstructuredMixedTestCase(),
            this.getComplexStructuredTestCase(),
            this.getEdgeCaseEmptyTestCase(),
            this.getEdgeCaseDocumentationOnlyTestCase(),
            this.getHighConfidenceTestCase(),
            this.getLowConfidenceTestCase(),
            this.getVersionBumpMajorTestCase(),
            this.getVersionBumpMinorTestCase(),
            this.getVersionBumpPatchTestCase(),
            this.getVersionBumpNoneTestCase()
        ];
    }
    /**
     * Test case: Well-structured document with clear breaking changes
     */
    static getStructuredBreakingChangeTestCase() {
        const document = {
            path: 'test-cases/structured-breaking-change.md',
            content: `# Task 3.2 Complete: API Refactoring

**Date**: October 20, 2025
**Task**: 3.2 Refactor authentication API for better security
**Status**: Complete

## Breaking Changes

- Removed deprecated \`getUserData()\` method from AuthService
- Changed \`TokenValidator\` interface - now requires \`algorithm\` parameter
- Updated \`login()\` method signature - removed \`rememberMe\` parameter

## Migration Guidance

- Replace \`getUserData()\` calls with \`getCurrentUser()\`
- Update TokenValidator implementations to include algorithm parameter
- Use new session management for persistent login instead of rememberMe

## Implementation Details

The authentication system has been completely refactored to use JWT tokens
with configurable algorithms. This provides better security but requires
breaking changes to the public API.

## Artifacts Created

- \`src/auth/AuthService.ts\` - Updated authentication service
- \`src/auth/TokenValidator.ts\` - New token validation interface
- \`docs/migration-guide.md\` - Migration instructions for users
`,
            lastModified: new Date('2025-10-20'),
            gitCommit: 'abc123def456',
            metadata: {
                title: 'API Refactoring',
                task: '3.2',
                type: 'task-completion',
                status: 'Complete'
            }
        };
        const expectedResults = {
            breakingChanges: [
                {
                    title: 'Removed deprecated getUserData() method from AuthService',
                    description: 'Removed deprecated getUserData() method from AuthService',
                    affectedAPIs: ['AuthService.getUserData'],
                    severity: 'high',
                    mustDetect: true
                },
                {
                    title: 'Changed TokenValidator interface - now requires algorithm parameter',
                    description: 'Changed TokenValidator interface - now requires algorithm parameter',
                    affectedAPIs: ['TokenValidator'],
                    severity: 'medium',
                    mustDetect: true
                },
                {
                    title: 'Updated login() method signature - removed rememberMe parameter',
                    description: 'Updated login() method signature - removed rememberMe parameter',
                    affectedAPIs: ['AuthService.login'],
                    severity: 'medium',
                    mustDetect: true
                }
            ],
            newFeatures: [],
            bugFixes: [],
            improvements: [],
            documentation: [
                {
                    title: 'Migration instructions for users',
                    type: 'api-docs',
                    mustDetect: false
                }
            ],
            expectedVersionBump: {
                bumpType: 'major',
                fromVersion: '1.2.3',
                expectedVersion: '2.0.0',
                minimumConfidence: 0.8
            },
            minimumConfidence: 0.85,
            maxAmbiguousItems: 0
        };
        return {
            id: 'structured-breaking-change',
            name: 'Structured Breaking Change Document',
            description: 'Well-structured completion document with clear breaking changes and migration guidance',
            document,
            expectedResults,
            metadata: {
                category: 'structured',
                difficulty: 'easy',
                tags: ['breaking-changes', 'api-refactoring', 'migration'],
                createdDate: new Date('2025-10-20'),
                lastUpdated: new Date('2025-10-20'),
                author: 'accuracy-validation-framework'
            }
        };
    }
    /**
     * Test case: Well-structured document with new features
     */
    static getStructuredFeatureTestCase() {
        const document = {
            path: 'test-cases/structured-feature.md',
            content: `# Task 2.1 Complete: Mathematical Token Validation

**Date**: October 20, 2025
**Task**: 2.1 Implement mathematical token validation system
**Status**: Complete

## New Features

- Added mathematical token validation with baseline grid alignment
- Implemented cross-platform token generation for web, iOS, and Android
- Created strategic flexibility tracking with 80% appropriate usage monitoring
- Built comprehensive validation pipeline with three-tier feedback system

## Benefits

- Ensures mathematical consistency across all design tokens
- Provides clear validation feedback to designers and developers
- Enables confident cross-platform design system deployment
- Reduces manual validation effort by 90%

## Implementation Details

The mathematical token validation system uses a modular scale approach
with baseline grid alignment. It provides pass/warning/error feedback
and tracks strategic flexibility usage patterns.

## Artifacts Created

- \`src/validators/BaselineGridValidator.ts\` - Core validation logic
- \`src/validators/ThreeTierValidator.ts\` - Validation feedback system
- \`src/analytics/StrategicFlexibilityTracker.ts\` - Usage pattern tracking
- \`src/generators/TokenFileGenerator.ts\` - Cross-platform generation
`,
            lastModified: new Date('2025-10-20'),
            gitCommit: 'def456ghi789',
            metadata: {
                title: 'Mathematical Token Validation',
                task: '2.1',
                type: 'task-completion',
                status: 'Complete'
            }
        };
        const expectedResults = {
            breakingChanges: [],
            newFeatures: [
                {
                    title: 'Added mathematical token validation with baseline grid alignment',
                    description: 'Added mathematical token validation with baseline grid alignment',
                    category: 'validation',
                    mustDetect: true
                },
                {
                    title: 'Implemented cross-platform token generation for web, iOS, and Android',
                    description: 'Implemented cross-platform token generation for web, iOS, and Android',
                    category: 'generation',
                    mustDetect: true
                },
                {
                    title: 'Created strategic flexibility tracking with 80% appropriate usage monitoring',
                    description: 'Created strategic flexibility tracking with 80% appropriate usage monitoring',
                    category: 'analytics',
                    mustDetect: true
                },
                {
                    title: 'Built comprehensive validation pipeline with three-tier feedback system',
                    description: 'Built comprehensive validation pipeline with three-tier feedback system',
                    category: 'validation',
                    mustDetect: true
                }
            ],
            bugFixes: [],
            improvements: [],
            documentation: [],
            expectedVersionBump: {
                bumpType: 'minor',
                fromVersion: '1.2.3',
                expectedVersion: '1.3.0',
                minimumConfidence: 0.8
            },
            minimumConfidence: 0.85,
            maxAmbiguousItems: 0
        };
        return {
            id: 'structured-feature',
            name: 'Structured Feature Document',
            description: 'Well-structured completion document with multiple new features',
            document,
            expectedResults,
            metadata: {
                category: 'structured',
                difficulty: 'easy',
                tags: ['features', 'validation', 'cross-platform'],
                createdDate: new Date('2025-10-20'),
                lastUpdated: new Date('2025-10-20'),
                author: 'accuracy-validation-framework'
            }
        };
    }
    /**
     * Test case: Well-structured document with bug fixes
     */
    static getStructuredBugFixTestCase() {
        const document = {
            path: 'test-cases/structured-bugfix.md',
            content: `# Task 4.3 Complete: Critical Bug Fixes

**Date**: October 20, 2025
**Task**: 4.3 Fix critical issues in token generation
**Status**: Complete

## Bug Fixes

- Fixed baseline grid alignment calculation error causing 1px offsets #234
- Resolved memory leak in token file generation process #235
- Corrected spacing token validation for edge cases with zero values #236
- Fixed cross-platform unit conversion rounding errors #237

## Issues Resolved

- Issue #234: Baseline grid calculations were using floor() instead of round()
- Issue #235: TokenFileGenerator was not properly disposing of file streams
- Issue #236: Zero spacing values were incorrectly flagged as invalid
- Issue #237: Android dp conversion was losing precision in calculations

## Testing

All fixes have been validated with comprehensive unit tests and integration
tests. Memory usage has been reduced by 15% and calculation accuracy improved.

## Artifacts Updated

- \`src/validators/BaselineGridValidator.ts\` - Fixed calculation logic
- \`src/generators/TokenFileGenerator.ts\` - Added proper resource cleanup
- \`src/validators/SyntaxValidator.ts\` - Updated zero value handling
- \`src/providers/AndroidUnitConverter.ts\` - Improved precision
`,
            lastModified: new Date('2025-10-20'),
            gitCommit: 'ghi789jkl012',
            metadata: {
                title: 'Critical Bug Fixes',
                task: '4.3',
                type: 'task-completion',
                status: 'Complete'
            }
        };
        const expectedResults = {
            breakingChanges: [],
            newFeatures: [],
            bugFixes: [
                {
                    title: 'Fixed baseline grid alignment calculation error causing 1px offsets',
                    description: 'Fixed baseline grid alignment calculation error causing 1px offsets #234',
                    severity: 'high',
                    mustDetect: true
                },
                {
                    title: 'Resolved memory leak in token file generation process',
                    description: 'Resolved memory leak in token file generation process #235',
                    severity: 'critical',
                    mustDetect: true
                },
                {
                    title: 'Corrected spacing token validation for edge cases with zero values',
                    description: 'Corrected spacing token validation for edge cases with zero values #236',
                    severity: 'medium',
                    mustDetect: true
                },
                {
                    title: 'Fixed cross-platform unit conversion rounding errors',
                    description: 'Fixed cross-platform unit conversion rounding errors #237',
                    severity: 'medium',
                    mustDetect: true
                }
            ],
            improvements: [],
            documentation: [],
            expectedVersionBump: {
                bumpType: 'patch',
                fromVersion: '1.2.3',
                expectedVersion: '1.2.4',
                minimumConfidence: 0.8
            },
            minimumConfidence: 0.85,
            maxAmbiguousItems: 0
        };
        return {
            id: 'structured-bugfix',
            name: 'Structured Bug Fix Document',
            description: 'Well-structured completion document with multiple bug fixes',
            document,
            expectedResults,
            metadata: {
                category: 'structured',
                difficulty: 'easy',
                tags: ['bug-fixes', 'critical-issues', 'performance'],
                createdDate: new Date('2025-10-20'),
                lastUpdated: new Date('2025-10-20'),
                author: 'accuracy-validation-framework'
            }
        };
    }
    /**
     * Test case: Unstructured document with mixed changes
     */
    static getUnstructuredMixedTestCase() {
        const document = {
            path: 'test-cases/unstructured-mixed.md',
            content: `# Task Completion Summary

Completed the token system refactoring work. This involved several important changes that affect how the system works.

First, I had to remove the old validateToken method because it was causing security issues. This is a breaking change since external libraries were using it. The new validation approach uses a completely different API.

I also implemented a new feature for automatic token regeneration when values change. This will help developers by automatically updating their token files when the source values are modified. The system now watches for file changes and regenerates tokens in real-time.

There was a nasty bug in the spacing calculations that was causing incorrect values on Android devices. Fixed that by updating the unit conversion logic to handle edge cases properly. Also resolved an issue where the validation was too strict and rejecting valid tokens.

Made some performance improvements to the file generation process. It's now about 30% faster and uses less memory. Also improved the error messages to be more helpful for developers.

Updated the documentation to reflect all these changes and added some examples showing how to use the new features.
`,
            lastModified: new Date('2025-10-20'),
            gitCommit: 'jkl012mno345',
            metadata: {
                title: 'Token System Refactoring',
                type: 'task-completion',
                status: 'Complete'
            }
        };
        const expectedResults = {
            breakingChanges: [
                {
                    title: 'Removed old validateToken method',
                    description: 'removed the old validateToken method because it was causing security issues',
                    affectedAPIs: ['validateToken'],
                    severity: 'high',
                    mustDetect: true
                }
            ],
            newFeatures: [
                {
                    title: 'Implemented automatic token regeneration when values change',
                    description: 'implemented a new feature for automatic token regeneration when values change',
                    category: 'automation',
                    mustDetect: true
                }
            ],
            bugFixes: [
                {
                    title: 'Fixed spacing calculations bug on Android devices',
                    description: 'There was a nasty bug in the spacing calculations that was causing incorrect values on Android devices',
                    severity: 'medium',
                    mustDetect: true
                },
                {
                    title: 'Resolved validation being too strict',
                    description: 'resolved an issue where the validation was too strict and rejecting valid tokens',
                    severity: 'low',
                    mustDetect: false
                }
            ],
            improvements: [
                {
                    title: 'Performance improvements to file generation process',
                    description: 'Made some performance improvements to the file generation process',
                    type: 'performance',
                    mustDetect: false
                },
                {
                    title: 'Improved error messages for developers',
                    description: 'improved the error messages to be more helpful for developers',
                    type: 'usability',
                    mustDetect: false
                }
            ],
            documentation: [
                {
                    title: 'Updated documentation with examples',
                    type: 'api-docs',
                    mustDetect: false
                }
            ],
            expectedVersionBump: {
                bumpType: 'major',
                fromVersion: '1.2.3',
                expectedVersion: '2.0.0',
                minimumConfidence: 0.7
            },
            minimumConfidence: 0.7,
            maxAmbiguousItems: 2
        };
        return {
            id: 'unstructured-mixed',
            name: 'Unstructured Mixed Changes Document',
            description: 'Unstructured completion document with mixed change types requiring pattern matching',
            document,
            expectedResults,
            metadata: {
                category: 'unstructured',
                difficulty: 'medium',
                tags: ['mixed-changes', 'pattern-matching', 'narrative-style'],
                createdDate: new Date('2025-10-20'),
                lastUpdated: new Date('2025-10-20'),
                author: 'accuracy-validation-framework'
            }
        };
    }
    /**
     * Test case: Complex structured document with multiple sections
     */
    static getComplexStructuredTestCase() {
        const document = {
            path: 'test-cases/complex-structured.md',
            content: `# Spec F2 Complete: Cross-Platform Build System

**Date**: October 20, 2025
**Spec**: F2 - Cross-Platform Build System
**Status**: Complete

## Summary

Completed implementation of the cross-platform build system that generates
design tokens for web, iOS, and Android platforms. This represents a major
milestone in the DesignerPunk system architecture.

## Breaking Changes

- Removed legacy \`generateTokens()\` function - replaced with new build pipeline
- Changed configuration file format from JSON to TypeScript for better type safety
- Updated CLI commands - \`build-tokens\` is now \`build --platform=all\`

## New Features

- Cross-platform token generation with platform-specific optimizations
- Intelligent build caching system reduces build times by 80%
- Live reload development mode for rapid iteration
- Comprehensive build validation with detailed error reporting
- Plugin system for custom token transformations

## Bug Fixes

- Fixed race condition in parallel build processes #145
- Resolved incorrect file paths on Windows systems #146
- Corrected token ordering in generated files #147

## Improvements

- Build performance optimized for large token sets (1000+ tokens)
- Memory usage reduced by 40% through streaming file operations
- Better error messages with actionable suggestions
- Improved logging with structured output for CI/CD integration

## Documentation Updates

- Complete build system documentation with examples
- Migration guide for upgrading from legacy system
- Troubleshooting guide for common build issues
- API reference for plugin developers

## Migration Required

The configuration file format has changed significantly. Users must:

1. Convert \`tokens.json\` to \`tokens.config.ts\`
2. Update build scripts to use new CLI commands
3. Review plugin configurations for compatibility

See the migration guide for detailed instructions.

## Performance Metrics

- Build time: 2.3s → 0.5s (78% improvement)
- Memory usage: 150MB → 90MB (40% reduction)
- File size: Generated files 15% smaller on average
`,
            lastModified: new Date('2025-10-20'),
            gitCommit: 'mno345pqr678',
            metadata: {
                title: 'Cross-Platform Build System',
                spec: 'F2',
                type: 'spec-completion',
                status: 'Complete'
            }
        };
        const expectedResults = {
            breakingChanges: [
                {
                    title: 'Removed legacy generateTokens() function',
                    description: 'Removed legacy generateTokens() function - replaced with new build pipeline',
                    affectedAPIs: ['generateTokens'],
                    severity: 'high',
                    mustDetect: true
                },
                {
                    title: 'Changed configuration file format from JSON to TypeScript',
                    description: 'Changed configuration file format from JSON to TypeScript for better type safety',
                    affectedAPIs: ['configuration'],
                    severity: 'medium',
                    mustDetect: true
                },
                {
                    title: 'Updated CLI commands',
                    description: 'Updated CLI commands - build-tokens is now build --platform=all',
                    affectedAPIs: ['CLI'],
                    severity: 'medium',
                    mustDetect: true
                }
            ],
            newFeatures: [
                {
                    title: 'Cross-platform token generation with platform-specific optimizations',
                    category: 'generation',
                    mustDetect: true
                },
                {
                    title: 'Intelligent build caching system reduces build times by 80%',
                    category: 'performance',
                    mustDetect: true
                },
                {
                    title: 'Live reload development mode for rapid iteration',
                    category: 'development',
                    mustDetect: true
                },
                {
                    title: 'Comprehensive build validation with detailed error reporting',
                    category: 'validation',
                    mustDetect: true
                },
                {
                    title: 'Plugin system for custom token transformations',
                    category: 'extensibility',
                    mustDetect: true
                }
            ],
            bugFixes: [
                {
                    title: 'Fixed race condition in parallel build processes',
                    severity: 'high',
                    mustDetect: true
                },
                {
                    title: 'Resolved incorrect file paths on Windows systems',
                    severity: 'medium',
                    mustDetect: true
                },
                {
                    title: 'Corrected token ordering in generated files',
                    severity: 'low',
                    mustDetect: true
                }
            ],
            improvements: [
                {
                    title: 'Build performance optimized for large token sets',
                    type: 'performance',
                    mustDetect: true
                },
                {
                    title: 'Memory usage reduced by 40% through streaming file operations',
                    type: 'performance',
                    mustDetect: true
                },
                {
                    title: 'Better error messages with actionable suggestions',
                    type: 'usability',
                    mustDetect: false
                },
                {
                    title: 'Improved logging with structured output for CI/CD integration',
                    type: 'usability',
                    mustDetect: false
                }
            ],
            documentation: [
                {
                    title: 'Complete build system documentation with examples',
                    type: 'api-docs',
                    mustDetect: false
                },
                {
                    title: 'Migration guide for upgrading from legacy system',
                    type: 'api-docs',
                    mustDetect: false
                }
            ],
            expectedVersionBump: {
                bumpType: 'major',
                fromVersion: '1.5.2',
                expectedVersion: '2.0.0',
                minimumConfidence: 0.9
            },
            minimumConfidence: 0.9,
            maxAmbiguousItems: 1
        };
        return {
            id: 'complex-structured',
            name: 'Complex Structured Document',
            description: 'Complex spec completion with multiple sections and comprehensive changes',
            document,
            expectedResults,
            metadata: {
                category: 'structured',
                difficulty: 'hard',
                tags: ['spec-completion', 'comprehensive', 'multi-section'],
                createdDate: new Date('2025-10-20'),
                lastUpdated: new Date('2025-10-20'),
                author: 'accuracy-validation-framework'
            }
        };
    }
    /**
     * Test case: Edge case - Empty document
     */
    static getEdgeCaseEmptyTestCase() {
        const document = {
            path: 'test-cases/edge-case-empty.md',
            content: `# Task Completion

**Date**: October 20, 2025
**Task**: 1.1 Initial setup
**Status**: Complete

## Summary

Task completed successfully.
`,
            lastModified: new Date('2025-10-20'),
            gitCommit: 'pqr678stu901',
            metadata: {
                title: 'Initial Setup',
                task: '1.1',
                type: 'task-completion',
                status: 'Complete'
            }
        };
        const expectedResults = {
            breakingChanges: [],
            newFeatures: [],
            bugFixes: [],
            improvements: [],
            documentation: [],
            expectedVersionBump: {
                bumpType: 'none',
                fromVersion: '1.2.3',
                expectedVersion: '1.2.3',
                minimumConfidence: 0.8
            },
            minimumConfidence: 0.6,
            maxAmbiguousItems: 0
        };
        return {
            id: 'edge-case-empty',
            name: 'Edge Case: Empty Document',
            description: 'Document with minimal content and no significant changes',
            document,
            expectedResults,
            metadata: {
                category: 'edge-case',
                difficulty: 'easy',
                tags: ['edge-case', 'empty-content', 'no-changes'],
                createdDate: new Date('2025-10-20'),
                lastUpdated: new Date('2025-10-20'),
                author: 'accuracy-validation-framework'
            }
        };
    }
    /**
     * Test case: Edge case - Documentation only
     */
    static getEdgeCaseDocumentationOnlyTestCase() {
        const document = {
            path: 'test-cases/edge-case-docs-only.md',
            content: `# Task 5.4 Complete: Documentation Updates

**Date**: October 20, 2025
**Task**: 5.4 Update project documentation
**Status**: Complete

## Documentation Updates

- Updated README.md with new installation instructions
- Added comprehensive API documentation for TokenValidator
- Created troubleshooting guide for common validation errors
- Updated code examples in all documentation files
- Fixed typos and formatting issues throughout documentation

## Summary

Completed comprehensive documentation update to improve developer experience.
All documentation now reflects the current API and includes practical examples.

No code changes were made as part of this task - only documentation updates.
`,
            lastModified: new Date('2025-10-20'),
            gitCommit: 'stu901vwx234',
            metadata: {
                title: 'Documentation Updates',
                task: '5.4',
                type: 'task-completion',
                status: 'Complete'
            }
        };
        const expectedResults = {
            breakingChanges: [],
            newFeatures: [],
            bugFixes: [],
            improvements: [],
            documentation: [
                {
                    title: 'Updated README.md with new installation instructions',
                    type: 'readme',
                    mustDetect: true
                },
                {
                    title: 'Added comprehensive API documentation for TokenValidator',
                    type: 'api-docs',
                    mustDetect: true
                },
                {
                    title: 'Created troubleshooting guide for common validation errors',
                    type: 'api-docs',
                    mustDetect: true
                },
                {
                    title: 'Updated code examples in all documentation files',
                    type: 'examples',
                    mustDetect: false
                }
            ],
            expectedVersionBump: {
                bumpType: 'none',
                fromVersion: '1.2.3',
                expectedVersion: '1.2.3',
                minimumConfidence: 0.8
            },
            minimumConfidence: 0.8,
            maxAmbiguousItems: 1
        };
        return {
            id: 'edge-case-docs-only',
            name: 'Edge Case: Documentation Only',
            description: 'Document with only documentation changes, no code changes',
            document,
            expectedResults,
            metadata: {
                category: 'edge-case',
                difficulty: 'medium',
                tags: ['edge-case', 'documentation-only', 'no-version-bump'],
                createdDate: new Date('2025-10-20'),
                lastUpdated: new Date('2025-10-20'),
                author: 'accuracy-validation-framework'
            }
        };
    }
    /**
     * Test case: High confidence scenario
     */
    static getHighConfidenceTestCase() {
        const document = {
            path: 'test-cases/high-confidence.md',
            content: `# Task 2.3 Complete: Token Validation Enhancement

**Date**: October 20, 2025
**Task**: 2.3 Enhance token validation with mathematical precision
**Status**: Complete

## New Features

- **Mathematical Token Validation**: Implemented precise mathematical validation using modular scale calculations
- **Baseline Grid Alignment**: Added automatic baseline grid alignment validation for all spacing tokens
- **Cross-Platform Consistency**: Built validation system that ensures consistent token values across web, iOS, and Android

## Implementation Details

### Mathematical Validation Engine
- Uses golden ratio (1.618) and perfect fourth (1.333) modular scales
- Validates all tokens against mathematical relationships
- Provides detailed feedback on mathematical compliance

### Baseline Grid System
- 8px baseline grid with 4px sub-grid for fine adjustments
- Automatic alignment validation for all spacing values
- Strategic flexibility for component-level spacing needs

### Cross-Platform Validation
- Ensures unitless base values translate correctly to px, pt, and dp
- Validates platform-specific rounding and precision requirements
- Maintains visual consistency across all target platforms

## Artifacts Created

- \`src/validators/MathematicalValidator.ts\` - Core mathematical validation logic
- \`src/validators/BaselineGridValidator.ts\` - Baseline grid alignment validation
- \`src/validators/CrossPlatformValidator.ts\` - Platform consistency validation
- \`tests/validators/\` - Comprehensive test suite for all validators

## Quality Metrics

- Test coverage: 98%
- Validation accuracy: 99.2%
- Performance: <10ms validation time for 1000+ tokens
- Zero false positives in validation results
`,
            lastModified: new Date('2025-10-20'),
            gitCommit: 'vwx234yza567',
            metadata: {
                title: 'Token Validation Enhancement',
                task: '2.3',
                type: 'task-completion',
                status: 'Complete'
            }
        };
        const expectedResults = {
            breakingChanges: [],
            newFeatures: [
                {
                    title: 'Mathematical Token Validation',
                    description: 'Implemented precise mathematical validation using modular scale calculations',
                    category: 'validation',
                    mustDetect: true
                },
                {
                    title: 'Baseline Grid Alignment',
                    description: 'Added automatic baseline grid alignment validation for all spacing tokens',
                    category: 'validation',
                    mustDetect: true
                },
                {
                    title: 'Cross-Platform Consistency',
                    description: 'Built validation system that ensures consistent token values across web, iOS, and Android',
                    category: 'validation',
                    mustDetect: true
                }
            ],
            bugFixes: [],
            improvements: [],
            documentation: [],
            expectedVersionBump: {
                bumpType: 'minor',
                fromVersion: '1.2.3',
                expectedVersion: '1.3.0',
                minimumConfidence: 0.9
            },
            minimumConfidence: 0.95,
            maxAmbiguousItems: 0
        };
        return {
            id: 'high-confidence',
            name: 'High Confidence Scenario',
            description: 'Well-structured document with clear sections and detailed descriptions',
            document,
            expectedResults,
            metadata: {
                category: 'structured',
                difficulty: 'easy',
                tags: ['high-confidence', 'detailed', 'clear-structure'],
                createdDate: new Date('2025-10-20'),
                lastUpdated: new Date('2025-10-20'),
                author: 'accuracy-validation-framework'
            }
        };
    }
    /**
     * Test case: Low confidence scenario
     */
    static getLowConfidenceTestCase() {
        const document = {
            path: 'test-cases/low-confidence.md',
            content: `# Task Update

Did some work on the system. Made various changes and updates. Fixed some issues that were causing problems. Added new stuff that should help with things.

The validation is better now. Also updated some files and changed how certain things work. There were bugs that needed fixing so I fixed them.

Performance is improved. Made the system faster and more efficient. Users should notice better response times.

Updated docs too.
`,
            lastModified: new Date('2025-10-20'),
            gitCommit: 'yza567bcd890',
            metadata: {
                title: 'System Updates',
                type: 'task-completion'
            }
        };
        const expectedResults = {
            breakingChanges: [],
            newFeatures: [],
            bugFixes: [
                {
                    title: 'Fixed issues that were causing problems',
                    description: 'Fixed some issues that were causing problems',
                    severity: 'low',
                    mustDetect: false
                }
            ],
            improvements: [
                {
                    title: 'Performance improvements',
                    description: 'Made the system faster and more efficient',
                    type: 'performance',
                    mustDetect: false
                }
            ],
            documentation: [
                {
                    title: 'Updated documentation',
                    type: 'other',
                    mustDetect: false
                }
            ],
            expectedVersionBump: {
                bumpType: 'patch',
                fromVersion: '1.2.3',
                expectedVersion: '1.2.4',
                minimumConfidence: 0.4
            },
            minimumConfidence: 0.4,
            maxAmbiguousItems: 5
        };
        return {
            id: 'low-confidence',
            name: 'Low Confidence Scenario',
            description: 'Vague document with unclear descriptions and ambiguous content',
            document,
            expectedResults,
            metadata: {
                category: 'unstructured',
                difficulty: 'hard',
                tags: ['low-confidence', 'vague', 'ambiguous'],
                createdDate: new Date('2025-10-20'),
                lastUpdated: new Date('2025-10-20'),
                author: 'accuracy-validation-framework'
            }
        };
    }
    /**
     * Test case: Version bump - Major
     */
    static getVersionBumpMajorTestCase() {
        const document = {
            path: 'test-cases/version-bump-major.md',
            content: `# API Breaking Changes Implementation

## Breaking Changes

- Removed all deprecated methods from TokenValidator interface
- Changed core TokenEngine constructor to require configuration object
- Updated all public APIs to use new error handling system

## Migration Required

All existing integrations must be updated to use the new APIs.
`,
            lastModified: new Date('2025-10-20'),
            gitCommit: 'bcd890efg123',
            metadata: {
                title: 'API Breaking Changes',
                type: 'task-completion'
            }
        };
        const expectedResults = {
            breakingChanges: [
                {
                    title: 'Removed all deprecated methods from TokenValidator interface',
                    severity: 'high',
                    mustDetect: true
                }
            ],
            newFeatures: [],
            bugFixes: [],
            improvements: [],
            documentation: [],
            expectedVersionBump: {
                bumpType: 'major',
                fromVersion: '2.1.5',
                expectedVersion: '3.0.0',
                minimumConfidence: 0.8
            },
            minimumConfidence: 0.8,
            maxAmbiguousItems: 0
        };
        return {
            id: 'version-bump-major',
            name: 'Version Bump: Major',
            description: 'Document requiring major version bump due to breaking changes',
            document,
            expectedResults,
            metadata: {
                category: 'structured',
                difficulty: 'easy',
                tags: ['version-bump', 'major', 'breaking-changes'],
                createdDate: new Date('2025-10-20'),
                lastUpdated: new Date('2025-10-20'),
                author: 'accuracy-validation-framework'
            }
        };
    }
    /**
     * Test case: Version bump - Minor
     */
    static getVersionBumpMinorTestCase() {
        const document = {
            path: 'test-cases/version-bump-minor.md',
            content: `# New Feature Implementation

## New Features

- Added support for custom token transformations
- Implemented plugin system for extensibility
- Created new validation rules for accessibility compliance

No breaking changes or bug fixes in this release.
`,
            lastModified: new Date('2025-10-20'),
            gitCommit: 'efg123hij456',
            metadata: {
                title: 'New Features',
                type: 'task-completion'
            }
        };
        const expectedResults = {
            breakingChanges: [],
            newFeatures: [
                {
                    title: 'Added support for custom token transformations',
                    category: 'extensibility',
                    mustDetect: true
                }
            ],
            bugFixes: [],
            improvements: [],
            documentation: [],
            expectedVersionBump: {
                bumpType: 'minor',
                fromVersion: '2.1.5',
                expectedVersion: '2.2.0',
                minimumConfidence: 0.8
            },
            minimumConfidence: 0.8,
            maxAmbiguousItems: 0
        };
        return {
            id: 'version-bump-minor',
            name: 'Version Bump: Minor',
            description: 'Document requiring minor version bump due to new features',
            document,
            expectedResults,
            metadata: {
                category: 'structured',
                difficulty: 'easy',
                tags: ['version-bump', 'minor', 'new-features'],
                createdDate: new Date('2025-10-20'),
                lastUpdated: new Date('2025-10-20'),
                author: 'accuracy-validation-framework'
            }
        };
    }
    /**
     * Test case: Version bump - Patch
     */
    static getVersionBumpPatchTestCase() {
        const document = {
            path: 'test-cases/version-bump-patch.md',
            content: `# Bug Fixes and Improvements

## Bug Fixes

- Fixed calculation error in spacing token generation
- Resolved file path issues on Windows systems

## Improvements

- Optimized memory usage in token processing
- Improved error messages for better debugging

No new features or breaking changes.
`,
            lastModified: new Date('2025-10-20'),
            gitCommit: 'hij456klm789',
            metadata: {
                title: 'Bug Fixes and Improvements',
                type: 'task-completion'
            }
        };
        const expectedResults = {
            breakingChanges: [],
            newFeatures: [],
            bugFixes: [
                {
                    title: 'Fixed calculation error in spacing token generation',
                    severity: 'medium',
                    mustDetect: true
                }
            ],
            improvements: [
                {
                    title: 'Optimized memory usage in token processing',
                    type: 'performance',
                    mustDetect: true
                }
            ],
            documentation: [],
            expectedVersionBump: {
                bumpType: 'patch',
                fromVersion: '2.1.5',
                expectedVersion: '2.1.6',
                minimumConfidence: 0.8
            },
            minimumConfidence: 0.8,
            maxAmbiguousItems: 0
        };
        return {
            id: 'version-bump-patch',
            name: 'Version Bump: Patch',
            description: 'Document requiring patch version bump due to bug fixes',
            document,
            expectedResults,
            metadata: {
                category: 'structured',
                difficulty: 'easy',
                tags: ['version-bump', 'patch', 'bug-fixes'],
                createdDate: new Date('2025-10-20'),
                lastUpdated: new Date('2025-10-20'),
                author: 'accuracy-validation-framework'
            }
        };
    }
    /**
     * Test case: Version bump - None
     */
    static getVersionBumpNoneTestCase() {
        const document = {
            path: 'test-cases/version-bump-none.md',
            content: `# Documentation and Internal Updates

## Documentation Updates

- Updated README with better examples
- Added inline code comments for clarity
- Reorganized documentation structure

## Internal Changes

- Refactored internal helper functions (no API changes)
- Updated development dependencies
- Improved test organization

No user-facing changes in this update.
`,
            lastModified: new Date('2025-10-20'),
            gitCommit: 'klm789nop012',
            metadata: {
                title: 'Documentation and Internal Updates',
                type: 'task-completion'
            }
        };
        const expectedResults = {
            breakingChanges: [],
            newFeatures: [],
            bugFixes: [],
            improvements: [],
            documentation: [
                {
                    title: 'Updated README with better examples',
                    type: 'readme',
                    mustDetect: true
                }
            ],
            expectedVersionBump: {
                bumpType: 'none',
                fromVersion: '2.1.5',
                expectedVersion: '2.1.5',
                minimumConfidence: 0.8
            },
            minimumConfidence: 0.8,
            maxAmbiguousItems: 0
        };
        return {
            id: 'version-bump-none',
            name: 'Version Bump: None',
            description: 'Document with no user-facing changes, no version bump required',
            document,
            expectedResults,
            metadata: {
                category: 'structured',
                difficulty: 'easy',
                tags: ['version-bump', 'none', 'documentation-only'],
                createdDate: new Date('2025-10-20'),
                lastUpdated: new Date('2025-10-20'),
                author: 'accuracy-validation-framework'
            }
        };
    }
}
exports.AccuracyTestCases = AccuracyTestCases;
//# sourceMappingURL=AccuracyTestCases.js.map