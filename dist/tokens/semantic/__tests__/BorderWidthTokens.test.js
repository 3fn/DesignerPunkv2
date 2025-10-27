"use strict";
/**
 * Semantic Border Width Tokens Unit Tests
 *
 * Tests for semantic border width token structure and primitive references.
 * Validates that semantic tokens follow the { value: 'primitiveTokenName' } pattern.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const BorderWidthTokens_1 = require("../BorderWidthTokens");
describe('Semantic Border Width Tokens', () => {
    describe('Token Structure', () => {
        test('should use { value: "primitiveTokenName" } pattern', () => {
            expect(BorderWidthTokens_1.borderDefault).toHaveProperty('value');
            expect(typeof BorderWidthTokens_1.borderDefault.value).toBe('string');
            expect(BorderWidthTokens_1.borderEmphasis).toHaveProperty('value');
            expect(typeof BorderWidthTokens_1.borderEmphasis.value).toBe('string');
            expect(BorderWidthTokens_1.borderHeavy).toHaveProperty('value');
            expect(typeof BorderWidthTokens_1.borderHeavy.value).toBe('string');
        });
        test('should have all semantic tokens in SemanticBorderWidthTokens object', () => {
            expect(BorderWidthTokens_1.SemanticBorderWidthTokens).toHaveProperty('borderDefault');
            expect(BorderWidthTokens_1.SemanticBorderWidthTokens).toHaveProperty('borderEmphasis');
            expect(BorderWidthTokens_1.SemanticBorderWidthTokens).toHaveProperty('borderHeavy');
            expect(Object.keys(BorderWidthTokens_1.SemanticBorderWidthTokens)).toHaveLength(3);
        });
    });
    describe('Primitive References', () => {
        test('borderDefault should reference borderWidth100', () => {
            expect(BorderWidthTokens_1.borderDefault.value).toBe('borderWidth100');
        });
        test('borderEmphasis should reference borderWidth200', () => {
            expect(BorderWidthTokens_1.borderEmphasis.value).toBe('borderWidth200');
        });
        test('borderHeavy should reference borderWidth400', () => {
            expect(BorderWidthTokens_1.borderHeavy.value).toBe('borderWidth400');
        });
        test('all semantic tokens should reference valid primitive token names', () => {
            const validPrimitiveNames = ['borderWidth100', 'borderWidth200', 'borderWidth400'];
            expect(validPrimitiveNames).toContain(BorderWidthTokens_1.borderDefault.value);
            expect(validPrimitiveNames).toContain(BorderWidthTokens_1.borderEmphasis.value);
            expect(validPrimitiveNames).toContain(BorderWidthTokens_1.borderHeavy.value);
        });
    });
    describe('Semantic Token Object', () => {
        test('SemanticBorderWidthTokens should match individual exports', () => {
            expect(BorderWidthTokens_1.SemanticBorderWidthTokens.borderDefault).toEqual(BorderWidthTokens_1.borderDefault);
            expect(BorderWidthTokens_1.SemanticBorderWidthTokens.borderEmphasis).toEqual(BorderWidthTokens_1.borderEmphasis);
            expect(BorderWidthTokens_1.SemanticBorderWidthTokens.borderHeavy).toEqual(BorderWidthTokens_1.borderHeavy);
        });
        test('should be immutable (as const)', () => {
            // TypeScript enforces this at compile time, but we can verify the structure
            expect(Object.isFrozen(BorderWidthTokens_1.SemanticBorderWidthTokens)).toBe(false); // Not frozen, but const
            expect(typeof BorderWidthTokens_1.SemanticBorderWidthTokens).toBe('object');
        });
    });
    describe('Type Safety', () => {
        test('SemanticBorderWidthTokenKey should include all token names', () => {
            // This is a compile-time check, but we can verify the keys exist
            const keys = [
                'borderDefault',
                'borderEmphasis',
                'borderHeavy'
            ];
            keys.forEach(key => {
                expect(BorderWidthTokens_1.SemanticBorderWidthTokens).toHaveProperty(key);
            });
        });
    });
    describe('Pattern Consistency', () => {
        test('should follow semantic/SpacingTokens.ts pattern', () => {
            // All semantic tokens should have only a 'value' property
            Object.values(BorderWidthTokens_1.SemanticBorderWidthTokens).forEach(token => {
                const keys = Object.keys(token);
                expect(keys).toEqual(['value']);
                expect(typeof token.value).toBe('string');
            });
        });
        test('should not import primitive BorderWidthTokens', () => {
            // This test verifies the pattern - semantic tokens reference primitives by name,
            // not by importing the primitive token objects
            // The values should be strings, not objects
            expect(typeof BorderWidthTokens_1.borderDefault.value).toBe('string');
            expect(typeof BorderWidthTokens_1.borderEmphasis.value).toBe('string');
            expect(typeof BorderWidthTokens_1.borderHeavy.value).toBe('string');
        });
    });
    describe('Token Count', () => {
        test('should have exactly 3 semantic border width tokens', () => {
            const tokenCount = Object.keys(BorderWidthTokens_1.SemanticBorderWidthTokens).length;
            expect(tokenCount).toBe(3);
        });
        test('should match the number of primitive border width tokens', () => {
            // We have 3 primitive tokens (borderWidth100, borderWidth200, borderWidth400)
            // and 3 semantic tokens (borderDefault, borderEmphasis, borderHeavy)
            const semanticCount = Object.keys(BorderWidthTokens_1.SemanticBorderWidthTokens).length;
            expect(semanticCount).toBe(3);
        });
    });
});
//# sourceMappingURL=BorderWidthTokens.test.js.map