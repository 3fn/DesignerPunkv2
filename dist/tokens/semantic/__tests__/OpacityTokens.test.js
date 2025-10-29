"use strict";
/**
 * Semantic Opacity Tokens Unit Tests
 *
 * Tests for semantic opacity token structure and primitive references.
 * Validates that semantic tokens correctly reference primitive opacity tokens.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const OpacityTokens_1 = require("../OpacityTokens");
const OpacityTokens_2 = require("../../OpacityTokens");
describe('Semantic Opacity Tokens', () => {
    describe('Token Structure', () => {
        test('should have all required properties', () => {
            Object.values(OpacityTokens_1.opacityTokens).forEach(token => {
                expect(token).toHaveProperty('name');
                expect(token).toHaveProperty('primitiveReferences');
                expect(token).toHaveProperty('category');
                expect(token).toHaveProperty('context');
                expect(token).toHaveProperty('description');
            });
        });
        test('should have primitiveReferences with value property', () => {
            Object.values(OpacityTokens_1.opacityTokens).forEach(token => {
                expect(token.primitiveReferences).toHaveProperty('value');
                expect(typeof token.primitiveReferences.value).toBe('string');
            });
        });
        test('should have exactly 5 semantic opacity tokens', () => {
            expect(Object.keys(OpacityTokens_1.opacityTokens)).toHaveLength(5);
            expect(OpacityTokens_1.opacityTokenNames).toHaveLength(5);
        });
    });
    describe('Primitive References', () => {
        test('opacity.disabled should reference opacity600', () => {
            const token = OpacityTokens_1.opacityTokens['opacity.disabled'];
            expect(token.primitiveReferences.value).toBe('opacity600');
        });
        test('opacity.overlay should reference opacity400', () => {
            const token = OpacityTokens_1.opacityTokens['opacity.overlay'];
            expect(token.primitiveReferences.value).toBe('opacity400');
        });
        test('opacity.hover should reference opacity100', () => {
            const token = OpacityTokens_1.opacityTokens['opacity.hover'];
            expect(token.primitiveReferences.value).toBe('opacity100');
        });
        test('opacity.pressed should reference opacity200', () => {
            const token = OpacityTokens_1.opacityTokens['opacity.pressed'];
            expect(token.primitiveReferences.value).toBe('opacity200');
        });
        test('opacity.loading should reference opacity200', () => {
            const token = OpacityTokens_1.opacityTokens['opacity.loading'];
            expect(token.primitiveReferences.value).toBe('opacity200');
        });
        test('all semantic tokens should reference valid primitive token names', () => {
            const validPrimitiveNames = Object.keys(OpacityTokens_2.opacityTokens);
            Object.values(OpacityTokens_1.opacityTokens).forEach(token => {
                expect(validPrimitiveNames).toContain(token.primitiveReferences.value);
            });
        });
    });
    describe('Token Resolution', () => {
        test('opacityDisabled should resolve to opacity600 (0.48)', () => {
            const semanticToken = OpacityTokens_1.opacityTokens['opacity.disabled'];
            const primitiveTokenName = semanticToken.primitiveReferences.value;
            const primitiveToken = OpacityTokens_2.opacityTokens[primitiveTokenName];
            expect(primitiveToken.baseValue).toBe(0.48);
        });
        test('all semantic tokens should resolve to valid primitive values', () => {
            Object.values(OpacityTokens_1.opacityTokens).forEach(semanticToken => {
                const primitiveTokenName = semanticToken.primitiveReferences.value;
                const primitiveToken = OpacityTokens_2.opacityTokens[primitiveTokenName];
                expect(primitiveToken).toBeDefined();
                expect(primitiveToken.baseValue).toBeGreaterThanOrEqual(0.0);
                expect(primitiveToken.baseValue).toBeLessThanOrEqual(1.0);
            });
        });
        test('semantic token references should be valid', () => {
            const expectedReferences = {
                'opacity.disabled': 'opacity600',
                'opacity.overlay': 'opacity400',
                'opacity.hover': 'opacity100',
                'opacity.pressed': 'opacity200',
                'opacity.loading': 'opacity200'
            };
            Object.entries(expectedReferences).forEach(([semanticName, primitiveName]) => {
                const semanticToken = OpacityTokens_1.opacityTokens[semanticName];
                expect(semanticToken.primitiveReferences.value).toBe(primitiveName);
                // Verify the primitive token exists
                const primitiveToken = OpacityTokens_2.opacityTokens[primitiveName];
                expect(primitiveToken).toBeDefined();
            });
        });
    });
    describe('Helper Functions', () => {
        test('getOpacityToken should return token by name', () => {
            const token = (0, OpacityTokens_1.getOpacityToken)('opacity.disabled');
            expect(token).toBeDefined();
            expect(token?.name).toBe('opacity.disabled');
            expect(token?.primitiveReferences.value).toBe('opacity600');
        });
        test('getOpacityToken should return undefined for invalid name', () => {
            const token = (0, OpacityTokens_1.getOpacityToken)('opacity.invalid');
            expect(token).toBeUndefined();
        });
        test('getAllOpacityTokens should return all tokens as array', () => {
            const tokens = (0, OpacityTokens_1.getAllOpacityTokens)();
            expect(tokens).toHaveLength(5);
            expect(Array.isArray(tokens)).toBe(true);
        });
        test('validateOpacityTokenCount should return true for correct count', () => {
            const isValid = (0, OpacityTokens_1.validateOpacityTokenCount)();
            expect(isValid).toBe(true);
        });
    });
    describe('Token Names', () => {
        test('should have expected token names', () => {
            const expectedNames = [
                'opacity.disabled',
                'opacity.overlay',
                'opacity.hover',
                'opacity.pressed',
                'opacity.loading'
            ];
            expectedNames.forEach(name => {
                expect(OpacityTokens_1.opacityTokenNames).toContain(name);
            });
        });
        test('opacityTokenNames should match object keys', () => {
            const objectKeys = Object.keys(OpacityTokens_1.opacityTokens);
            expect(OpacityTokens_1.opacityTokenNames).toEqual(objectKeys);
        });
    });
    describe('Semantic Categories', () => {
        test('all opacity tokens should be in INTERACTION category', () => {
            Object.values(OpacityTokens_1.opacityTokens).forEach(token => {
                expect(token.category).toBe('interaction');
            });
        });
    });
    describe('Context and Description', () => {
        test('all tokens should have non-empty context', () => {
            Object.values(OpacityTokens_1.opacityTokens).forEach(token => {
                expect(token.context).toBeTruthy();
                expect(token.context.length).toBeGreaterThan(0);
            });
        });
        test('all tokens should have non-empty description', () => {
            Object.values(OpacityTokens_1.opacityTokens).forEach(token => {
                expect(token.description).toBeTruthy();
                expect(token.description.length).toBeGreaterThan(0);
            });
        });
    });
});
//# sourceMappingURL=OpacityTokens.test.js.map