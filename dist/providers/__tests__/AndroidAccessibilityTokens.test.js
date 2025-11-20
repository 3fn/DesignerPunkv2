"use strict";
/**
 * Android Accessibility Token Generation Tests
 * Tests for generateAccessibilityTokens() method added in Task 2.3
 */
Object.defineProperty(exports, "__esModule", { value: true });
const AndroidFormatGenerator_1 = require("../AndroidFormatGenerator");
describe('AndroidFormatGenerator - Accessibility Token Generation', () => {
    let generator;
    beforeEach(() => {
        generator = new AndroidFormatGenerator_1.AndroidFormatGenerator('kotlin');
    });
    describe('generateAccessibilityTokens()', () => {
        it('should generate accessibility token section with WCAG comments', () => {
            const lines = generator.generateAccessibilityTokens();
            const content = lines.join('\n');
            // Verify section header
            expect(content).toContain('ACCESSIBILITY TOKENS');
            expect(content).toContain('Focus Indicators for Keyboard Navigation');
            // Verify WCAG references
            expect(content).toContain('WCAG 2.4.7 Focus Visible (Level AA)');
            expect(content).toContain('WCAG 1.4.11 Non-text Contrast (Level AA)');
        });
        it('should generate focus offset token with correct value', () => {
            const lines = generator.generateAccessibilityTokens();
            const content = lines.join('\n');
            expect(content).toContain('val accessibilityFocusOffset = 2.dp');
            expect(content).toContain('Focus Indicator Offset - WCAG 2.4.7 Focus Visible');
        });
        it('should generate focus width token with correct value', () => {
            const lines = generator.generateAccessibilityTokens();
            const content = lines.join('\n');
            expect(content).toContain('val accessibilityFocusWidth = 2.dp');
            expect(content).toContain('Focus Indicator Width - WCAG 2.4.7 Focus Visible');
        });
        it('should generate focus color token referencing colorPrimary', () => {
            const lines = generator.generateAccessibilityTokens();
            const content = lines.join('\n');
            expect(content).toContain('val accessibilityFocusColor = colorPrimary');
            expect(content).toContain('Focus Indicator Color - WCAG 2.4.7 Focus Visible, 1.4.11 Non-text Contrast (3:1 minimum)');
        });
        it('should include usage example comment', () => {
            const lines = generator.generateAccessibilityTokens();
            const content = lines.join('\n');
            expect(content).toContain('Usage Example:');
            expect(content).toContain('.border(');
            expect(content).toContain('width = accessibilityFocusWidth');
            expect(content).toContain('color = accessibilityFocusColor');
            expect(content).toContain('shape = RoundedCornerShape(cornerRadius + accessibilityFocusOffset)');
        });
        it('should return array of strings', () => {
            const lines = generator.generateAccessibilityTokens();
            expect(Array.isArray(lines)).toBe(true);
            expect(lines.length).toBeGreaterThan(0);
            expect(lines.every(line => typeof line === 'string')).toBe(true);
        });
        it('should format tokens with proper Kotlin syntax', () => {
            const lines = generator.generateAccessibilityTokens();
            const content = lines.join('\n');
            // Check for proper Kotlin val declarations
            expect(content).toMatch(/val accessibilityFocusOffset = \d+\.dp/);
            expect(content).toMatch(/val accessibilityFocusWidth = \d+\.dp/);
            expect(content).toMatch(/val accessibilityFocusColor = \w+/);
        });
    });
});
//# sourceMappingURL=AndroidAccessibilityTokens.test.js.map