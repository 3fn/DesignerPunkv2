"use strict";
/**
 * Token File Generator Tests
 *
 * Tests token file generation orchestration, cross-platform consistency,
 * and file structure validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const TokenFileGenerator_1 = require("../TokenFileGenerator");
describe('TokenFileGenerator', () => {
    let generator;
    beforeEach(() => {
        generator = new TokenFileGenerator_1.TokenFileGenerator();
    });
    describe('Initialization', () => {
        it('should initialize with all platform generators', () => {
            expect(generator).toBeDefined();
            expect(generator).toBeInstanceOf(TokenFileGenerator_1.TokenFileGenerator);
        });
    });
    describe('Web Token Generation', () => {
        it('should generate web tokens with default options', () => {
            const result = generator.generateWebTokens();
            expect(result.platform).toBe('web');
            expect(result.filePath).toBe('output/DesignTokens.web.js');
            expect(result.content).toBeDefined();
            expect(result.tokenCount).toBeGreaterThan(0);
            expect(result.valid).toBe(true);
        });
        it('should generate web tokens with custom output directory', () => {
            const result = generator.generateWebTokens({
                outputDir: 'custom/output'
            });
            expect(result.filePath).toBe('custom/output/DesignTokens.web.js');
        });
        it('should include version in generated content', () => {
            const result = generator.generateWebTokens({
                version: '2.0.0'
            });
            expect(result.content).toContain('2.0.0');
        });
        it('should group tokens by category when requested', () => {
            const result = generator.generateWebTokens({
                groupByCategory: true,
                includeComments: true
            });
            // Should contain category comments
            expect(result.content).toContain('SPACING');
            expect(result.content).toContain('FONTSIZE');
        });
        it('should generate flat token list when grouping disabled', () => {
            const result = generator.generateWebTokens({
                groupByCategory: false,
                includeComments: false
            });
            expect(result.content).toBeDefined();
            expect(result.tokenCount).toBeGreaterThan(0);
        });
        it('should include mathematical comments when requested', () => {
            const result = generator.generateWebTokens({
                includeComments: true
            });
            // Should contain mathematical relationship comments
            expect(result.content).toContain('base ×');
        });
        it('should validate generated syntax', () => {
            const result = generator.generateWebTokens();
            expect(result.valid).toBe(true);
            expect(result.errors).toBeUndefined();
        });
    });
    describe('iOS Token Generation', () => {
        it('should generate iOS tokens with default options', () => {
            const result = generator.generateiOSTokens();
            expect(result.platform).toBe('ios');
            expect(result.filePath).toBe('output/DesignTokens.ios.swift');
            expect(result.content).toBeDefined();
            expect(result.tokenCount).toBeGreaterThan(0);
            expect(result.valid).toBe(true);
        });
        it('should generate iOS tokens with custom output directory', () => {
            const result = generator.generateiOSTokens({
                outputDir: 'ios/output'
            });
            expect(result.filePath).toBe('ios/output/DesignTokens.ios.swift');
        });
        it('should include Swift-specific syntax', () => {
            const result = generator.generateiOSTokens();
            expect(result.content).toContain('struct DesignTokens');
            expect(result.content).toContain('static let');
            expect(result.content).toContain('CGFloat');
        });
        it('should group tokens by category when requested', () => {
            const result = generator.generateiOSTokens({
                groupByCategory: true,
                includeComments: true
            });
            // Should contain category comments (iOS uses MARK comments)
            expect(result.content).toContain('MARK:');
            expect(result.content).toContain('SPACING');
        });
        it('should validate generated Swift syntax', () => {
            const result = generator.generateiOSTokens();
            expect(result.valid).toBe(true);
            expect(result.errors).toBeUndefined();
        });
    });
    describe('Android Token Generation', () => {
        it('should generate Android tokens with default options', () => {
            const result = generator.generateAndroidTokens();
            expect(result.platform).toBe('android');
            expect(result.filePath).toBe('output/DesignTokens.android.kt');
            expect(result.content).toBeDefined();
            expect(result.tokenCount).toBeGreaterThan(0);
            expect(result.valid).toBe(true);
        });
        it('should generate Android tokens with custom output directory', () => {
            const result = generator.generateAndroidTokens({
                outputDir: 'android/output'
            });
            expect(result.filePath).toBe('android/output/DesignTokens.android.kt');
        });
        it('should include Kotlin-specific syntax', () => {
            const result = generator.generateAndroidTokens();
            expect(result.content).toContain('object DesignTokens');
            expect(result.content).toContain('const val');
            expect(result.content).toContain('Float');
        });
        it('should group tokens by category when requested', () => {
            const result = generator.generateAndroidTokens({
                groupByCategory: true,
                includeComments: true
            });
            // Should contain category comments
            expect(result.content).toContain('SPACING');
            expect(result.content).toContain('FONTSIZE');
        });
        it('should validate generated Kotlin syntax', () => {
            const result = generator.generateAndroidTokens();
            expect(result.valid).toBe(true);
            expect(result.errors).toBeUndefined();
        });
    });
    describe('Generate All Platforms', () => {
        it('should generate tokens for all platforms', () => {
            const results = generator.generateAll();
            expect(results).toHaveLength(3);
            expect(results.map(r => r.platform)).toEqual(['web', 'ios', 'android']);
        });
        it('should generate all platforms with custom options', () => {
            const options = {
                outputDir: 'dist',
                version: '3.0.0',
                includeComments: true,
                groupByCategory: true
            };
            const results = generator.generateAll(options);
            expect(results).toHaveLength(3);
            results.forEach(result => {
                expect(result.filePath).toContain('dist/');
                expect(result.content).toContain('3.0.0');
                expect(result.valid).toBe(true);
            });
        });
        it('should generate all platforms successfully', () => {
            const results = generator.generateAll();
            results.forEach(result => {
                expect(result.valid).toBe(true);
                expect(result.errors).toBeUndefined();
                expect(result.tokenCount).toBeGreaterThan(0);
            });
        });
    });
    describe('Cross-Platform Consistency Validation', () => {
        it('should validate consistent token counts across platforms', () => {
            const results = generator.generateAll();
            const validation = generator.validateCrossPlatformConsistency(results);
            expect(validation.consistent).toBe(true);
            expect(validation.issues).toHaveLength(0);
        });
        it('should detect token count mismatches', () => {
            const results = [
                {
                    platform: 'web',
                    filePath: 'test.js',
                    content: 'test',
                    tokenCount: 10,
                    semanticTokenCount: 5,
                    valid: true
                },
                {
                    platform: 'ios',
                    filePath: 'test.swift',
                    content: 'test',
                    tokenCount: 15,
                    semanticTokenCount: 5,
                    valid: true
                },
                {
                    platform: 'android',
                    filePath: 'test.kt',
                    content: 'test',
                    tokenCount: 10,
                    semanticTokenCount: 5,
                    valid: true
                }
            ];
            const validation = generator.validateCrossPlatformConsistency(results);
            expect(validation.consistent).toBe(false);
            expect(validation.issues.length).toBeGreaterThan(0);
            expect(validation.issues[0]).toContain('Primitive token count mismatch');
        });
        it('should detect generation failures', () => {
            const results = [
                {
                    platform: 'web',
                    filePath: 'test.js',
                    content: 'test',
                    tokenCount: 10,
                    semanticTokenCount: 5,
                    valid: true
                },
                {
                    platform: 'ios',
                    filePath: 'test.swift',
                    content: 'test',
                    tokenCount: 10,
                    semanticTokenCount: 5,
                    valid: false,
                    errors: ['Syntax error']
                },
                {
                    platform: 'android',
                    filePath: 'test.kt',
                    content: 'test',
                    tokenCount: 10,
                    semanticTokenCount: 5,
                    valid: true
                }
            ];
            const validation = generator.validateCrossPlatformConsistency(results);
            expect(validation.consistent).toBe(false);
            expect(validation.issues.length).toBeGreaterThan(0);
            expect(validation.issues[0]).toContain('ios generation failed');
        });
        it('should pass validation when all platforms are consistent', () => {
            const results = [
                {
                    platform: 'web',
                    filePath: 'test.js',
                    content: 'test',
                    tokenCount: 10,
                    semanticTokenCount: 5,
                    valid: true
                },
                {
                    platform: 'ios',
                    filePath: 'test.swift',
                    content: 'test',
                    tokenCount: 10,
                    semanticTokenCount: 5,
                    valid: true
                },
                {
                    platform: 'android',
                    filePath: 'test.kt',
                    content: 'test',
                    tokenCount: 10,
                    semanticTokenCount: 5,
                    valid: true
                }
            ];
            const validation = generator.validateCrossPlatformConsistency(results);
            expect(validation.consistent).toBe(true);
            expect(validation.issues).toHaveLength(0);
        });
    });
    describe('File Structure Consistency', () => {
        it('should generate consistent file names across platforms', () => {
            const results = generator.generateAll();
            expect(results[0].filePath).toContain('DesignTokens.web.js');
            expect(results[1].filePath).toContain('DesignTokens.ios.swift');
            expect(results[2].filePath).toContain('DesignTokens.android.kt');
        });
        it('should use consistent output directory across platforms', () => {
            const results = generator.generateAll({ outputDir: 'tokens' });
            results.forEach(result => {
                expect(result.filePath.startsWith('tokens/')).toBe(true);
            });
        });
        it('should include same token count across platforms', () => {
            const results = generator.generateAll();
            const tokenCounts = results.map(r => r.tokenCount);
            const uniqueCounts = new Set(tokenCounts);
            expect(uniqueCounts.size).toBe(1); // All platforms should have same count
        });
    });
    describe('Generation Options', () => {
        it('should respect includeComments option', () => {
            const withComments = generator.generateWebTokens({ includeComments: true });
            const withoutComments = generator.generateWebTokens({ includeComments: false });
            expect(withComments.content.length).toBeGreaterThan(withoutComments.content.length);
        });
        it('should respect groupByCategory option', () => {
            const grouped = generator.generateWebTokens({ groupByCategory: true });
            const flat = generator.generateWebTokens({ groupByCategory: false });
            // Both should be valid but potentially different structure
            expect(grouped.valid).toBe(true);
            expect(flat.valid).toBe(true);
        });
        it('should apply options consistently across platforms', () => {
            const options = {
                version: '4.0.0',
                includeComments: true,
                groupByCategory: true
            };
            const results = generator.generateAll(options);
            results.forEach(result => {
                expect(result.content).toContain('4.0.0');
                expect(result.valid).toBe(true);
            });
        });
    });
    describe('Error Handling', () => {
        it('should handle generation with minimal tokens', () => {
            const results = generator.generateAll();
            results.forEach(result => {
                expect(result.tokenCount).toBeGreaterThanOrEqual(0);
                expect(result.valid).toBe(true);
            });
        });
        it('should validate syntax for all generated files', () => {
            const results = generator.generateAll();
            results.forEach(result => {
                expect(result.valid).toBe(true);
                expect(result.errors).toBeUndefined();
            });
        });
    });
    describe('Content Validation', () => {
        it('should generate non-empty content for all platforms', () => {
            const results = generator.generateAll();
            results.forEach(result => {
                expect(result.content).toBeDefined();
                expect(result.content.length).toBeGreaterThan(0);
            });
        });
        it('should include header and footer in generated content', () => {
            const webResult = generator.generateWebTokens();
            const iosResult = generator.generateiOSTokens();
            const androidResult = generator.generateAndroidTokens();
            // Web should have export statements
            expect(webResult.content).toContain('export');
            // iOS should have struct definition
            expect(iosResult.content).toContain('struct');
            // Android should have object definition
            expect(androidResult.content).toContain('object');
        });
        it('should include token definitions in generated content', () => {
            const results = generator.generateAll();
            results.forEach(result => {
                // Should contain at least some token definitions
                expect(result.tokenCount).toBeGreaterThan(0);
                expect(result.content.length).toBeGreaterThan(100); // Reasonable minimum
            });
        });
    });
    describe('Semantic Token Reference Validation', () => {
        it('should validate semantic tokens with valid single references', () => {
            const semantics = [
                {
                    name: 'colorPrimary',
                    primitiveReferences: { value: 'purple300' },
                    category: 'color',
                    context: 'Primary brand color',
                    description: 'Primary brand color for main actions'
                }
            ];
            const primitives = [
                {
                    name: 'purple300',
                    category: 'color',
                    baseValue: 0,
                    familyBaseValue: 0,
                    description: 'Purple 300',
                    mathematicalRelationship: 'base',
                    baselineGridAlignment: false,
                    isStrategicFlexibility: false,
                    isPrecisionTargeted: false,
                    platforms: {}
                }
            ];
            const validation = generator.validateSemanticReferences(semantics, primitives);
            expect(validation.valid).toBe(true);
            expect(validation.invalidReferences).toHaveLength(0);
        });
        it('should detect invalid single reference', () => {
            const semantics = [
                {
                    name: 'colorPrimary',
                    primitiveReferences: { value: 'nonExistentToken' },
                    category: 'color',
                    context: 'Primary brand color',
                    description: 'Primary brand color for main actions'
                }
            ];
            const primitives = [
                {
                    name: 'purple300',
                    category: 'color',
                    baseValue: 0,
                    familyBaseValue: 0,
                    description: 'Purple 300',
                    mathematicalRelationship: 'base',
                    baselineGridAlignment: false,
                    isStrategicFlexibility: false,
                    isPrecisionTargeted: false,
                    platforms: {}
                }
            ];
            const validation = generator.validateSemanticReferences(semantics, primitives);
            expect(validation.valid).toBe(false);
            expect(validation.invalidReferences).toHaveLength(1);
            expect(validation.invalidReferences[0].semanticToken).toBe('colorPrimary');
            expect(validation.invalidReferences[0].reference).toBe('nonExistentToken');
            expect(validation.invalidReferences[0].reason).toContain('non-existent primitive');
        });
        it('should validate typography tokens with all required references', () => {
            const semantics = [
                {
                    name: 'typographyBodyMd',
                    primitiveReferences: {
                        fontSize: 'fontSize100',
                        lineHeight: 'lineHeight100',
                        fontFamily: 'fontFamilyBody',
                        fontWeight: 'fontWeight400',
                        letterSpacing: 'letterSpacing100'
                    },
                    category: 'typography',
                    context: 'Body medium typography',
                    description: 'Medium body text style'
                }
            ];
            const primitives = [
                { name: 'fontSize100', category: 'fontSize', baseValue: 16, familyBaseValue: 16, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} },
                { name: 'lineHeight100', category: 'lineHeight', baseValue: 24, familyBaseValue: 24, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} },
                { name: 'fontFamilyBody', category: 'fontFamily', baseValue: 0, familyBaseValue: 0, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} },
                { name: 'fontWeight400', category: 'fontWeight', baseValue: 400, familyBaseValue: 400, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} },
                { name: 'letterSpacing100', category: 'letterSpacing', baseValue: 0, familyBaseValue: 0, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} }
            ];
            const validation = generator.validateSemanticReferences(semantics, primitives);
            expect(validation.valid).toBe(true);
            expect(validation.invalidReferences).toHaveLength(0);
        });
        it('should detect missing required typography property', () => {
            const semantics = [
                {
                    name: 'typographyBodyMd',
                    primitiveReferences: {
                        fontSize: 'fontSize100',
                        lineHeight: 'lineHeight100',
                        fontFamily: 'fontFamilyBody',
                        fontWeight: 'fontWeight400'
                        // Missing letterSpacing
                    },
                    category: 'typography',
                    context: 'Body medium typography',
                    description: 'Medium body text style'
                }
            ];
            const primitives = [
                { name: 'fontSize100', category: 'fontSize', baseValue: 16, familyBaseValue: 16, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} },
                { name: 'lineHeight100', category: 'lineHeight', baseValue: 24, familyBaseValue: 24, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} },
                { name: 'fontFamilyBody', category: 'fontFamily', baseValue: 0, familyBaseValue: 0, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} },
                { name: 'fontWeight400', category: 'fontWeight', baseValue: 400, familyBaseValue: 400, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} }
            ];
            const validation = generator.validateSemanticReferences(semantics, primitives);
            expect(validation.valid).toBe(false);
            expect(validation.invalidReferences).toHaveLength(1);
            expect(validation.invalidReferences[0].semanticToken).toBe('typographyBodyMd');
            expect(validation.invalidReferences[0].property).toBe('letterSpacing');
            expect(validation.invalidReferences[0].reason).toContain('missing required reference');
        });
        it('should detect invalid typography property reference', () => {
            const semantics = [
                {
                    name: 'typographyBodyMd',
                    primitiveReferences: {
                        fontSize: 'invalidFontSize',
                        lineHeight: 'lineHeight100',
                        fontFamily: 'fontFamilyBody',
                        fontWeight: 'fontWeight400',
                        letterSpacing: 'letterSpacing100'
                    },
                    category: 'typography',
                    context: 'Body medium typography',
                    description: 'Medium body text style'
                }
            ];
            const primitives = [
                { name: 'fontSize100', category: 'fontSize', baseValue: 16, familyBaseValue: 16, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} },
                { name: 'lineHeight100', category: 'lineHeight', baseValue: 24, familyBaseValue: 24, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} },
                { name: 'fontFamilyBody', category: 'fontFamily', baseValue: 0, familyBaseValue: 0, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} },
                { name: 'fontWeight400', category: 'fontWeight', baseValue: 400, familyBaseValue: 400, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} },
                { name: 'letterSpacing100', category: 'letterSpacing', baseValue: 0, familyBaseValue: 0, description: '', mathematicalRelationship: '', baselineGridAlignment: false, isStrategicFlexibility: false, isPrecisionTargeted: false, platforms: {} }
            ];
            const validation = generator.validateSemanticReferences(semantics, primitives);
            expect(validation.valid).toBe(false);
            expect(validation.invalidReferences).toHaveLength(1);
            expect(validation.invalidReferences[0].semanticToken).toBe('typographyBodyMd');
            expect(validation.invalidReferences[0].property).toBe('fontSize');
            expect(validation.invalidReferences[0].reference).toBe('invalidFontSize');
            expect(validation.invalidReferences[0].reason).toContain('invalid fontSize reference');
        });
    });
});
//# sourceMappingURL=TokenFileGenerator.test.js.map