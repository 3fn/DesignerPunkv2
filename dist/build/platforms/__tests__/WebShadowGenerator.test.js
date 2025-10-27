"use strict";
/**
 * WebShadowGenerator Tests
 *
 * Tests for Web CSS shadow translation functionality
 */
Object.defineProperty(exports, "__esModule", { value: true });
const WebShadowGenerator_1 = require("../WebShadowGenerator");
describe('WebShadowGenerator', () => {
    let generator;
    beforeEach(() => {
        generator = new WebShadowGenerator_1.WebShadowGenerator();
    });
    describe('generateBoxShadow', () => {
        it('should generate CSS box-shadow for shadow.container', () => {
            const boxShadow = generator.generateBoxShadow('shadow.container');
            expect(boxShadow).toBeTruthy();
            expect(boxShadow).toContain('px'); // Should have px units
            expect(boxShadow).toContain('rgba'); // Should have rgba color with opacity
        });
        it('should generate CSS box-shadow for shadow.modal', () => {
            const boxShadow = generator.generateBoxShadow('shadow.modal');
            expect(boxShadow).toBeTruthy();
            expect(boxShadow).toContain('px');
            expect(boxShadow).toContain('rgba');
        });
        it('should generate CSS box-shadow for shadow.fab', () => {
            const boxShadow = generator.generateBoxShadow('shadow.fab');
            expect(boxShadow).toBeTruthy();
            expect(boxShadow).toContain('px');
            expect(boxShadow).toContain('rgba');
        });
        it('should return null for non-existent shadow token', () => {
            const boxShadow = generator.generateBoxShadow('shadow.nonexistent');
            expect(boxShadow).toBeNull();
        });
    });
    describe('generateShadowCSSValue', () => {
        it('should generate complete shadow CSS value for shadow.container', () => {
            const cssValue = generator.generateShadowCSSValue('shadow.container');
            expect(cssValue).toBeTruthy();
            expect(cssValue?.boxShadow).toBeTruthy();
            expect(cssValue?.customProperties).toBeTruthy();
            expect(cssValue?.customProperties.offsetX).toBeTruthy();
            expect(cssValue?.customProperties.offsetY).toBeTruthy();
            expect(cssValue?.customProperties.blur).toBeTruthy();
            expect(cssValue?.customProperties.opacity).toBeTruthy();
            expect(cssValue?.customProperties.color).toBeTruthy();
        });
        it('should generate correct offset values for shadow.sunrise', () => {
            const cssValue = generator.generateShadowCSSValue('shadow.sunrise');
            expect(cssValue).toBeTruthy();
            // Sunrise should have negative offsetX (shadow falls left)
            expect(cssValue?.customProperties.offsetX).toContain('-');
        });
        it('should generate correct offset values for shadow.sunset', () => {
            const cssValue = generator.generateShadowCSSValue('shadow.sunset');
            expect(cssValue).toBeTruthy();
            // Sunset should have positive offsetX (shadow falls right)
            const offsetX = cssValue?.customProperties.offsetX;
            expect(offsetX).toBeTruthy();
            expect(offsetX?.startsWith('-')).toBe(false);
        });
        it('should return null for non-existent shadow token', () => {
            const cssValue = generator.generateShadowCSSValue('shadow.nonexistent');
            expect(cssValue).toBeNull();
        });
    });
    describe('generateCSSCustomProperties', () => {
        it('should generate CSS custom properties for all shadow tokens', () => {
            const css = generator.generateCSSCustomProperties();
            expect(css).toBeTruthy();
            expect(css).toContain(':root');
            expect(css).toContain('--shadow-container');
            expect(css).toContain('--shadow-modal');
            expect(css).toContain('--shadow-fab');
            expect(css).toContain('--shadow-hover');
        });
        it('should include individual property custom properties', () => {
            const css = generator.generateCSSCustomProperties();
            expect(css).toContain('--shadow-container-offset-x');
            expect(css).toContain('--shadow-container-offset-y');
            expect(css).toContain('--shadow-container-blur');
            expect(css).toContain('--shadow-container-opacity');
            expect(css).toContain('--shadow-container-color');
        });
        it('should include directional shadow tokens', () => {
            const css = generator.generateCSSCustomProperties();
            expect(css).toContain('--shadow-sunrise');
            expect(css).toContain('--shadow-morning');
            expect(css).toContain('--shadow-dusk');
            expect(css).toContain('--shadow-sunset');
        });
    });
});
//# sourceMappingURL=WebShadowGenerator.test.js.map