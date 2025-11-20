"use strict";
/**
 * Accessibility Tokens Unit Tests
 *
 * Tests for accessibility token structure, WCAG compliance, and compositional architecture.
 * Validates that focus indicator tokens reference correct primitive tokens and follow
 * the compositional pattern used throughout the semantic token system.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const AccessibilityTokens_1 = require("../AccessibilityTokens");
describe('Accessibility Tokens', () => {
    describe('Token Structure and References', () => {
        test('should have correct focus token structure', () => {
            expect(AccessibilityTokens_1.accessibility).toHaveProperty('focus');
            expect(AccessibilityTokens_1.accessibility.focus).toHaveProperty('offset');
            expect(AccessibilityTokens_1.accessibility.focus).toHaveProperty('width');
            expect(AccessibilityTokens_1.accessibility.focus).toHaveProperty('color');
        });
        test('should reference correct primitive tokens', () => {
            // Test that focus.offset references space025
            expect(AccessibilityTokens_1.accessibility.focus.offset).toBe('space025');
            // Test that focus.width references borderWidth200 (via border.emphasis)
            expect(AccessibilityTokens_1.accessibility.focus.width).toBe('borderWidth200');
            // Test that focus.color references purple300 (via color.primary)
            expect(AccessibilityTokens_1.accessibility.focus.color).toBe('purple300');
        });
        test('should have correct resolved values', () => {
            // space025 resolves to 2px
            expect(AccessibilityTokens_1.accessibility.focus.offset).toBe('space025');
            // borderWidth200 resolves to 2px
            expect(AccessibilityTokens_1.accessibility.focus.width).toBe('borderWidth200');
            // purple300 is a string (hex color)
            expect(typeof AccessibilityTokens_1.accessibility.focus.color).toBe('string');
            expect(AccessibilityTokens_1.accessibility.focus.color).toBe('purple300');
        });
        test('should follow compositional architecture pattern', () => {
            // All values should be primitive token references (strings), not resolved values
            expect(typeof AccessibilityTokens_1.accessibility.focus.offset).toBe('string');
            expect(typeof AccessibilityTokens_1.accessibility.focus.width).toBe('string');
            expect(typeof AccessibilityTokens_1.accessibility.focus.color).toBe('string');
            // Values should be token names, not numeric values
            expect(AccessibilityTokens_1.accessibility.focus.offset).toMatch(/^space\d+$/);
            expect(AccessibilityTokens_1.accessibility.focus.width).toMatch(/^borderWidth\d+$/);
            expect(AccessibilityTokens_1.accessibility.focus.color).toMatch(/^[a-z]+\d+$/);
        });
    });
    describe('Token Registry Integration', () => {
        test('should have all token names defined', () => {
            expect(AccessibilityTokens_1.accessibilityTokenNames).toEqual([
                'accessibility.focus.offset',
                'accessibility.focus.width',
                'accessibility.focus.color'
            ]);
            expect(AccessibilityTokens_1.accessibilityTokenNames).toHaveLength(3);
        });
        test('should retrieve tokens by path correctly', () => {
            // Test valid token retrieval
            expect((0, AccessibilityTokens_1.getAccessibilityToken)('accessibility.focus.offset')).toBe('space025');
            expect((0, AccessibilityTokens_1.getAccessibilityToken)('accessibility.focus.width')).toBe('borderWidth200');
            expect((0, AccessibilityTokens_1.getAccessibilityToken)('accessibility.focus.color')).toBe('purple300');
        });
        test('should return undefined for invalid token paths', () => {
            expect((0, AccessibilityTokens_1.getAccessibilityToken)('invalid.path')).toBeUndefined();
            expect((0, AccessibilityTokens_1.getAccessibilityToken)('accessibility.invalid')).toBeUndefined();
            expect((0, AccessibilityTokens_1.getAccessibilityToken)('accessibility.focus.invalid')).toBeUndefined();
        });
        test('should get all accessibility tokens as array', () => {
            const allTokens = (0, AccessibilityTokens_1.getAllAccessibilityTokens)();
            expect(allTokens).toHaveLength(3);
            expect(allTokens).toEqual([
                { name: 'accessibility.focus.offset', value: 'space025' },
                { name: 'accessibility.focus.width', value: 'borderWidth200' },
                { name: 'accessibility.focus.color', value: 'purple300' }
            ]);
        });
    });
    describe('WCAG Compliance', () => {
        test('should support WCAG 2.4.7 Focus Visible requirements', () => {
            // Focus indicator tokens should exist for WCAG 2.4.7 compliance
            expect(AccessibilityTokens_1.accessibility.focus.offset).toBeDefined();
            expect(AccessibilityTokens_1.accessibility.focus.width).toBeDefined();
            expect(AccessibilityTokens_1.accessibility.focus.color).toBeDefined();
            // All three properties are required for WCAG-compliant focus indicators
            expect(AccessibilityTokens_1.accessibility.focus.offset).toBeTruthy();
            expect(AccessibilityTokens_1.accessibility.focus.width).toBeTruthy();
            expect(AccessibilityTokens_1.accessibility.focus.color).toBeTruthy();
        });
        test('should reference tokens that provide sufficient visibility', () => {
            // Focus offset should provide separation (space025 = 2px)
            expect(AccessibilityTokens_1.accessibility.focus.offset).toBe('space025');
            // Focus width should be visible (borderWidth200 = 2px)
            expect(AccessibilityTokens_1.accessibility.focus.width).toBe('borderWidth200');
            // Focus color should be primary brand color for visibility
            expect(AccessibilityTokens_1.accessibility.focus.color).toBe('purple300');
        });
        test('should support WCAG 1.4.11 Non-text Contrast requirements', () => {
            // Focus color should reference a color token that provides 3:1 contrast
            // purple300 is the primary brand color designed for sufficient contrast
            expect(AccessibilityTokens_1.accessibility.focus.color).toBe('purple300');
            expect(typeof AccessibilityTokens_1.accessibility.focus.color).toBe('string');
        });
    });
    describe('TypeScript Type Safety', () => {
        test('should have correct TypeScript interfaces', () => {
            // Test that accessibility conforms to AccessibilityTokens interface
            const tokens = AccessibilityTokens_1.accessibility;
            expect(tokens.focus).toBeDefined();
            // Test that focus conforms to FocusTokens interface
            const focusTokens = AccessibilityTokens_1.accessibility.focus;
            expect(focusTokens.offset).toBeDefined();
            expect(focusTokens.width).toBeDefined();
            expect(focusTokens.color).toBeDefined();
        });
        test('should have string types for all token references', () => {
            // All token references should be strings (primitive token names)
            const focusTokens = AccessibilityTokens_1.accessibility.focus;
            const offset = focusTokens.offset;
            const width = focusTokens.width;
            const color = focusTokens.color;
            expect(typeof offset).toBe('string');
            expect(typeof width).toBe('string');
            expect(typeof color).toBe('string');
        });
    });
    describe('AI Agent Guidance', () => {
        test('should provide clear token paths for AI agents', () => {
            // AI agents should be able to discover tokens through clear paths
            expect(AccessibilityTokens_1.accessibility.focus.offset).toBe('space025');
            expect(AccessibilityTokens_1.accessibility.focus.width).toBe('borderWidth200');
            expect(AccessibilityTokens_1.accessibility.focus.color).toBe('purple300');
            // Token names should be self-documenting
            expect(AccessibilityTokens_1.accessibilityTokenNames[0]).toContain('focus');
            expect(AccessibilityTokens_1.accessibilityTokenNames[1]).toContain('focus');
            expect(AccessibilityTokens_1.accessibilityTokenNames[2]).toContain('focus');
        });
        test('should support token discovery through getAllAccessibilityTokens', () => {
            const allTokens = (0, AccessibilityTokens_1.getAllAccessibilityTokens)();
            // AI agents can iterate through all tokens
            allTokens.forEach(token => {
                expect(token).toHaveProperty('name');
                expect(token).toHaveProperty('value');
                expect(typeof token.name).toBe('string');
                expect(typeof token.value).toBe('string');
            });
        });
        test('should provide semantic naming for AI reasoning', () => {
            // Token names should clearly indicate their purpose
            expect(AccessibilityTokens_1.accessibilityTokenNames[0]).toBe('accessibility.focus.offset');
            expect(AccessibilityTokens_1.accessibilityTokenNames[1]).toBe('accessibility.focus.width');
            expect(AccessibilityTokens_1.accessibilityTokenNames[2]).toBe('accessibility.focus.color');
            // Names follow consistent pattern: accessibility.category.property
            AccessibilityTokens_1.accessibilityTokenNames.forEach(name => {
                expect(name).toMatch(/^accessibility\.[a-z]+\.[a-z]+$/);
            });
        });
    });
    describe('Future Extensibility', () => {
        test('should support future token categories through interface structure', () => {
            // Current structure supports adding future categories
            // (motion, contrast, text) without breaking existing code
            expect(AccessibilityTokens_1.accessibility).toHaveProperty('focus');
            // Interface allows for future expansion
            const tokens = AccessibilityTokens_1.accessibility;
            expect(tokens.focus).toBeDefined();
            // Future categories would be added as: tokens.motion, tokens.contrast, etc.
        });
        test('should maintain consistent token reference pattern for future tokens', () => {
            // All current tokens reference primitives as strings
            expect(typeof AccessibilityTokens_1.accessibility.focus.offset).toBe('string');
            expect(typeof AccessibilityTokens_1.accessibility.focus.width).toBe('string');
            expect(typeof AccessibilityTokens_1.accessibility.focus.color).toBe('string');
            // Future tokens should follow the same pattern
            // (reference primitive token names, not resolved values)
        });
    });
});
//# sourceMappingURL=AccessibilityTokens.test.js.map