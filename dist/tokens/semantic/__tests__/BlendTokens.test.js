"use strict";
/**
 * Semantic Blend Tokens Unit Tests
 *
 * Tests for semantic blend token structure, primitive references, and blend directions.
 * Validates that semantic tokens correctly reference primitive blend tokens with appropriate directions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const BlendTokens_1 = require("../BlendTokens");
const BlendTokens_2 = require("../../BlendTokens");
describe('Semantic Blend Tokens', () => {
    describe('Token Structure', () => {
        test('should have all required properties', () => {
            Object.values(BlendTokens_1.blendTokens).forEach(token => {
                expect(token).toHaveProperty('name');
                expect(token).toHaveProperty('primitiveReferences');
                expect(token).toHaveProperty('direction');
                expect(token).toHaveProperty('category');
                expect(token).toHaveProperty('context');
                expect(token).toHaveProperty('description');
            });
        });
        test('should have primitiveReferences with value property', () => {
            Object.values(BlendTokens_1.blendTokens).forEach(token => {
                expect(token.primitiveReferences).toHaveProperty('value');
                expect(typeof token.primitiveReferences.value).toBe('string');
                expect(token.primitiveReferences.value.length).toBeGreaterThan(0);
            });
        });
        test('should have direction as valid BlendDirection enum value', () => {
            const validDirections = Object.values(BlendTokens_2.BlendDirection);
            Object.values(BlendTokens_1.blendTokens).forEach(token => {
                expect(validDirections).toContain(token.direction);
            });
        });
        test('should have exactly 6 semantic blend tokens', () => {
            expect(Object.keys(BlendTokens_1.blendTokens)).toHaveLength(6);
            expect(BlendTokens_1.blendTokenNames).toHaveLength(6);
        });
    });
    describe('Primitive References', () => {
        test('blend.hoverDarker should reference blend200', () => {
            const token = BlendTokens_1.blendTokens['blend.hoverDarker'];
            expect(token.primitiveReferences.value).toBe('blend200');
        });
        test('blend.hoverLighter should reference blend200', () => {
            const token = BlendTokens_1.blendTokens['blend.hoverLighter'];
            expect(token.primitiveReferences.value).toBe('blend200');
        });
        test('blend.pressedDarker should reference blend300', () => {
            const token = BlendTokens_1.blendTokens['blend.pressedDarker'];
            expect(token.primitiveReferences.value).toBe('blend300');
        });
        test('blend.focusSaturate should reference blend200', () => {
            const token = BlendTokens_1.blendTokens['blend.focusSaturate'];
            expect(token.primitiveReferences.value).toBe('blend200');
        });
        test('blend.disabledDesaturate should reference blend300', () => {
            const token = BlendTokens_1.blendTokens['blend.disabledDesaturate'];
            expect(token.primitiveReferences.value).toBe('blend300');
        });
        test('blend.containerHoverDarker should reference blend100', () => {
            const token = BlendTokens_1.blendTokens['blend.containerHoverDarker'];
            expect(token.primitiveReferences.value).toBe('blend100');
        });
        test('all semantic tokens should reference valid primitive token names', () => {
            const validPrimitiveNames = Object.keys(BlendTokens_2.blendTokens);
            Object.values(BlendTokens_1.blendTokens).forEach(token => {
                expect(validPrimitiveNames).toContain(token.primitiveReferences.value);
            });
        });
    });
    describe('Blend Directions', () => {
        test('blend.hoverDarker should have DARKER direction', () => {
            const token = BlendTokens_1.blendTokens['blend.hoverDarker'];
            expect(token.direction).toBe(BlendTokens_2.BlendDirection.DARKER);
        });
        test('blend.hoverLighter should have LIGHTER direction', () => {
            const token = BlendTokens_1.blendTokens['blend.hoverLighter'];
            expect(token.direction).toBe(BlendTokens_2.BlendDirection.LIGHTER);
        });
        test('blend.pressedDarker should have DARKER direction', () => {
            const token = BlendTokens_1.blendTokens['blend.pressedDarker'];
            expect(token.direction).toBe(BlendTokens_2.BlendDirection.DARKER);
        });
        test('blend.focusSaturate should have SATURATE direction', () => {
            const token = BlendTokens_1.blendTokens['blend.focusSaturate'];
            expect(token.direction).toBe(BlendTokens_2.BlendDirection.SATURATE);
        });
        test('blend.disabledDesaturate should have DESATURATE direction', () => {
            const token = BlendTokens_1.blendTokens['blend.disabledDesaturate'];
            expect(token.direction).toBe(BlendTokens_2.BlendDirection.DESATURATE);
        });
        test('blend.containerHoverDarker should have DARKER direction', () => {
            const token = BlendTokens_1.blendTokens['blend.containerHoverDarker'];
            expect(token.direction).toBe(BlendTokens_2.BlendDirection.DARKER);
        });
        test('all semantic tokens should have valid blend directions', () => {
            const validDirections = [
                BlendTokens_2.BlendDirection.DARKER,
                BlendTokens_2.BlendDirection.LIGHTER,
                BlendTokens_2.BlendDirection.SATURATE,
                BlendTokens_2.BlendDirection.DESATURATE
            ];
            Object.values(BlendTokens_1.blendTokens).forEach(token => {
                expect(validDirections).toContain(token.direction);
            });
        });
    });
    describe('Token Resolution', () => {
        test('blend.hoverDarker should resolve to blend200 (0.08)', () => {
            const semanticToken = BlendTokens_1.blendTokens['blend.hoverDarker'];
            const primitiveTokenName = semanticToken.primitiveReferences.value;
            const primitiveToken = BlendTokens_2.blendTokens[primitiveTokenName];
            expect(primitiveToken.baseValue).toBe(0.08);
        });
        test('blend.containerHoverDarker should resolve to blend100 (0.04)', () => {
            const semanticToken = BlendTokens_1.blendTokens['blend.containerHoverDarker'];
            const primitiveTokenName = semanticToken.primitiveReferences.value;
            const primitiveToken = BlendTokens_2.blendTokens[primitiveTokenName];
            expect(primitiveToken.baseValue).toBe(0.04);
        });
        test('all semantic tokens should resolve to valid primitive values', () => {
            Object.values(BlendTokens_1.blendTokens).forEach(semanticToken => {
                const primitiveTokenName = semanticToken.primitiveReferences.value;
                const primitiveToken = BlendTokens_2.blendTokens[primitiveTokenName];
                expect(primitiveToken).toBeDefined();
                expect(primitiveToken.baseValue).toBeGreaterThanOrEqual(0.04);
                expect(primitiveToken.baseValue).toBeLessThanOrEqual(0.20);
            });
        });
        test('semantic token references should be valid', () => {
            const expectedReferences = {
                'blend.hoverDarker': 'blend200',
                'blend.hoverLighter': 'blend200',
                'blend.pressedDarker': 'blend300',
                'blend.focusSaturate': 'blend200',
                'blend.disabledDesaturate': 'blend300',
                'blend.containerHoverDarker': 'blend100'
            };
            Object.entries(expectedReferences).forEach(([semanticName, primitiveName]) => {
                const semanticToken = BlendTokens_1.blendTokens[semanticName];
                expect(semanticToken.primitiveReferences.value).toBe(primitiveName);
                // Verify the primitive token exists
                const primitiveToken = BlendTokens_2.blendTokens[primitiveName];
                expect(primitiveToken).toBeDefined();
            });
        });
    });
    describe('Token Naming Pattern', () => {
        test('hover tokens should follow "blend.hover[Direction]" pattern', () => {
            expect(BlendTokens_1.blendTokens['blend.hoverDarker'].name).toBe('blend.hoverDarker');
            expect(BlendTokens_1.blendTokens['blend.hoverLighter'].name).toBe('blend.hoverLighter');
        });
        test('pressed tokens should follow "blend.pressed[Direction]" pattern', () => {
            expect(BlendTokens_1.blendTokens['blend.pressedDarker'].name).toBe('blend.pressedDarker');
        });
        test('focus tokens should follow "blend.focus[Direction]" pattern', () => {
            expect(BlendTokens_1.blendTokens['blend.focusSaturate'].name).toBe('blend.focusSaturate');
        });
        test('disabled tokens should follow "blend.disabled[Direction]" pattern', () => {
            expect(BlendTokens_1.blendTokens['blend.disabledDesaturate'].name).toBe('blend.disabledDesaturate');
        });
        test('container tokens should follow "blend.container[State][Direction]" pattern', () => {
            expect(BlendTokens_1.blendTokens['blend.containerHoverDarker'].name).toBe('blend.containerHoverDarker');
        });
        test('all token names should include state and direction', () => {
            Object.values(BlendTokens_1.blendTokens).forEach(token => {
                // Token name should start with "blend."
                expect(token.name).toMatch(/^blend\./);
                // Token name should include a state (hover, pressed, focus, disabled, container)
                const hasState = /hover|pressed|focus|disabled|container/i.test(token.name);
                expect(hasState).toBe(true);
                // Token name should include a direction (Darker, Lighter, Saturate, Desaturate)
                const hasDirection = /Darker|Lighter|Saturate|Desaturate/.test(token.name);
                expect(hasDirection).toBe(true);
            });
        });
    });
    describe('Helper Functions', () => {
        test('getBlendToken should return token by name', () => {
            const token = (0, BlendTokens_1.getBlendToken)('blend.hoverDarker');
            expect(token).toBeDefined();
            expect(token?.name).toBe('blend.hoverDarker');
            expect(token?.primitiveReferences.value).toBe('blend200');
            expect(token?.direction).toBe(BlendTokens_2.BlendDirection.DARKER);
        });
        test('getBlendToken should return undefined for invalid name', () => {
            const token = (0, BlendTokens_1.getBlendToken)('blend.invalid');
            expect(token).toBeUndefined();
        });
        test('getAllBlendTokens should return all tokens as array', () => {
            const tokens = (0, BlendTokens_1.getAllBlendTokens)();
            expect(tokens).toHaveLength(6);
            expect(Array.isArray(tokens)).toBe(true);
        });
        test('validateBlendTokenCount should return true for correct count', () => {
            const isValid = (0, BlendTokens_1.validateBlendTokenCount)();
            expect(isValid).toBe(true);
        });
    });
    describe('Token Names', () => {
        test('should have expected token names', () => {
            const expectedNames = [
                'blend.hoverDarker',
                'blend.hoverLighter',
                'blend.pressedDarker',
                'blend.focusSaturate',
                'blend.disabledDesaturate',
                'blend.containerHoverDarker'
            ];
            expectedNames.forEach(name => {
                expect(BlendTokens_1.blendTokenNames).toContain(name);
            });
        });
        test('blendTokenNames should match object keys', () => {
            const objectKeys = Object.keys(BlendTokens_1.blendTokens);
            expect(BlendTokens_1.blendTokenNames).toEqual(objectKeys);
        });
    });
    describe('Semantic Categories', () => {
        test('all blend tokens should be in INTERACTION category', () => {
            Object.values(BlendTokens_1.blendTokens).forEach(token => {
                expect(token.category).toBe('interaction');
            });
        });
    });
    describe('Context and Description', () => {
        test('all tokens should have non-empty context', () => {
            Object.values(BlendTokens_1.blendTokens).forEach(token => {
                expect(token.context).toBeTruthy();
                expect(token.context.length).toBeGreaterThan(0);
            });
        });
        test('all tokens should have non-empty description', () => {
            Object.values(BlendTokens_1.blendTokens).forEach(token => {
                expect(token.description).toBeTruthy();
                expect(token.description.length).toBeGreaterThan(0);
            });
        });
        test('descriptions should mention blend percentage', () => {
            // blend100 = 4%, blend200 = 8%, blend300 = 12%
            expect(BlendTokens_1.blendTokens['blend.hoverDarker'].description).toContain('8%');
            expect(BlendTokens_1.blendTokens['blend.hoverLighter'].description).toContain('8%');
            expect(BlendTokens_1.blendTokens['blend.pressedDarker'].description).toContain('12%');
            expect(BlendTokens_1.blendTokens['blend.focusSaturate'].description).toContain('8%');
            expect(BlendTokens_1.blendTokens['blend.disabledDesaturate'].description).toContain('12%');
            expect(BlendTokens_1.blendTokens['blend.containerHoverDarker'].description).toContain('4%');
        });
    });
});
//# sourceMappingURL=BlendTokens.test.js.map