"use strict";
/**
 * Mathematical Relationship Parser Tests
 *
 * Tests the parser's ability to handle various mathematical relationship formats
 * and validate mathematical correctness.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const MathematicalRelationshipParser_1 = require("../MathematicalRelationshipParser");
describe('MathematicalRelationshipParser', () => {
    let parser;
    beforeEach(() => {
        parser = new MathematicalRelationshipParser_1.MathematicalRelationshipParser();
    });
    describe('parse', () => {
        describe('simple formats', () => {
            it('should parse "base × 2"', () => {
                const result = parser.parse('base × 2');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('×');
                expect(result.operand).toBe(2);
                expect(result.leftSide).toBe('base × 2');
                expect(result.errors).toHaveLength(0);
            });
            it('should parse "8 × 2"', () => {
                const result = parser.parse('8 × 2');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('×');
                expect(result.operand).toBe(2);
                expect(result.errors).toHaveLength(0);
            });
            it('should parse "base ÷ 2"', () => {
                const result = parser.parse('base ÷ 2');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('÷');
                expect(result.operand).toBe(2);
                expect(result.errors).toHaveLength(0);
            });
            it('should parse "base + 4"', () => {
                const result = parser.parse('base + 4');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('+');
                expect(result.operand).toBe(4);
                expect(result.errors).toHaveLength(0);
            });
            it('should parse "base - 2"', () => {
                const result = parser.parse('base - 2');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('-');
                expect(result.operand).toBe(2);
                expect(result.errors).toHaveLength(0);
            });
        });
        describe('with result formats', () => {
            it('should parse "8 × 2 = 16"', () => {
                const result = parser.parse('8 × 2 = 16');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('×');
                expect(result.operand).toBe(2);
                expect(result.expectedResult).toBe(16);
                expect(result.errors).toHaveLength(0);
            });
            it('should parse "base × 2 = 16"', () => {
                const result = parser.parse('base × 2 = 16');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('×');
                expect(result.operand).toBe(2);
                expect(result.expectedResult).toBe(16);
                expect(result.errors).toHaveLength(0);
            });
            it('should parse "8 ÷ 2 = 4"', () => {
                const result = parser.parse('8 ÷ 2 = 4');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('÷');
                expect(result.operand).toBe(2);
                expect(result.expectedResult).toBe(4);
                expect(result.errors).toHaveLength(0);
            });
        });
        describe('full expression formats', () => {
            it('should parse "base × 2 = 8 × 2 = 16"', () => {
                const result = parser.parse('base × 2 = 8 × 2 = 16');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('×');
                expect(result.operand).toBe(2);
                expect(result.expectedResult).toBe(16);
                expect(result.leftSide).toBe('base × 2');
                expect(result.rightSide).toBe('8 × 2 = 16');
                expect(result.errors).toHaveLength(0);
            });
            it('should parse "base × 1 = 8 × 1 = 8"', () => {
                const result = parser.parse('base × 1 = 8 × 1 = 8');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('×');
                expect(result.operand).toBe(1);
                expect(result.expectedResult).toBe(8);
                expect(result.errors).toHaveLength(0);
            });
            it('should parse "base ÷ 2 = 8 ÷ 2 = 4"', () => {
                const result = parser.parse('base ÷ 2 = 8 ÷ 2 = 4');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('÷');
                expect(result.operand).toBe(2);
                expect(result.expectedResult).toBe(4);
                expect(result.errors).toHaveLength(0);
            });
        });
        describe('operator normalization', () => {
            it('should normalize * to ×', () => {
                const result = parser.parse('base * 2');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('×');
                expect(result.operand).toBe(2);
            });
            it('should normalize x to ×', () => {
                const result = parser.parse('base x 2');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('×');
                expect(result.operand).toBe(2);
            });
            it('should normalize / to ÷', () => {
                const result = parser.parse('base / 2');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('÷');
                expect(result.operand).toBe(2);
            });
        });
        describe('edge cases', () => {
            it('should handle empty expression', () => {
                const result = parser.parse('');
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('Empty expression');
            });
            it('should handle whitespace-only expression', () => {
                const result = parser.parse('   ');
                expect(result.isValid).toBe(false);
                expect(result.errors).toContain('Empty expression');
            });
            it('should handle expression with extra whitespace', () => {
                const result = parser.parse('  base   ×   2  ');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('×');
                expect(result.operand).toBe(2);
            });
            it('should handle decimal operands', () => {
                const result = parser.parse('base × 1.5');
                expect(result.isValid).toBe(true);
                expect(result.operator).toBe('×');
                expect(result.operand).toBe(1.5);
            });
            it('should handle decimal results', () => {
                const result = parser.parse('8 × 1.5 = 12');
                expect(result.isValid).toBe(true);
                expect(result.expectedResult).toBe(12);
            });
            it('should detect inconsistent results', () => {
                const result = parser.parse('8 × 2 = 15 = 16');
                expect(result.isValid).toBe(false);
                expect(result.errors.some(e => e.includes('Inconsistent results'))).toBe(true);
            });
            it('should handle invalid operand', () => {
                const result = parser.parse('base × abc');
                expect(result.isValid).toBe(false);
                expect(result.errors.some(e => e.includes('Invalid operand'))).toBe(true);
            });
            it('should handle missing operator', () => {
                const result = parser.parse('base 2');
                expect(result.isValid).toBe(false);
                expect(result.errors.some(e => e.includes('No valid operator'))).toBe(true);
            });
        });
    });
    describe('validate', () => {
        it('should validate correct multiplication relationship', () => {
            const result = parser.validate('base × 2 = 8 × 2 = 16', 16, 8);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
            expect(result.calculatedResult).toBe(16);
            expect(result.errors).toHaveLength(0);
        });
        it('should validate correct division relationship', () => {
            const result = parser.validate('base ÷ 2 = 8 ÷ 2 = 4', 4, 8);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
            expect(result.calculatedResult).toBe(4);
            expect(result.errors).toHaveLength(0);
        });
        it('should validate correct addition relationship', () => {
            const result = parser.validate('base + 4 = 8 + 4 = 12', 12, 8);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
            expect(result.calculatedResult).toBe(12);
            expect(result.errors).toHaveLength(0);
        });
        it('should validate correct subtraction relationship', () => {
            const result = parser.validate('base - 2 = 8 - 2 = 6', 6, 8);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
            expect(result.calculatedResult).toBe(6);
            expect(result.errors).toHaveLength(0);
        });
        it('should detect incorrect mathematical relationship', () => {
            const result = parser.validate('base × 2 = 8 × 2 = 16', 15, 8);
            expect(result.isValid).toBe(false);
            expect(result.mathematicallyCorrect).toBe(false);
            expect(result.calculatedResult).toBe(16);
            expect(result.errors.some(e => e.includes('Mathematical relationship incorrect'))).toBe(true);
        });
        it('should detect incorrect expected result', () => {
            const result = parser.validate('base × 2 = 8 × 2 = 15', 16, 8);
            expect(result.isValid).toBe(false);
            // The error message includes "Expected result" or mentions the mismatch
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors.some(e => e.includes('Expected result') || e.includes('15'))).toBe(true);
        });
        it('should validate simple format without result', () => {
            const result = parser.validate('base × 2', 16, 8);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
            expect(result.calculatedResult).toBe(16);
        });
        it('should handle floating point precision', () => {
            const result = parser.validate('base × 1.5', 12, 8);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
            expect(result.calculatedResult).toBe(12);
        });
        it('should validate identity relationship', () => {
            const result = parser.validate('base × 1 = 8 × 1 = 8', 8, 8);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
            expect(result.calculatedResult).toBe(8);
        });
    });
    describe('areEquivalent', () => {
        it('should recognize equivalent expressions with different formats', () => {
            const equivalent = parser.areEquivalent('base × 2', '8 × 2 = 16', 8);
            expect(equivalent).toBe(true);
        });
        it('should recognize equivalent expressions with normalized operators', () => {
            const equivalent = parser.areEquivalent('base * 2', 'base × 2', 8);
            expect(equivalent).toBe(true);
        });
        it('should recognize non-equivalent expressions', () => {
            const equivalent = parser.areEquivalent('base × 2', 'base × 3', 8);
            expect(equivalent).toBe(false);
        });
        it('should handle invalid expressions', () => {
            const equivalent = parser.areEquivalent('invalid', 'base × 2', 8);
            expect(equivalent).toBe(false);
        });
    });
    describe('normalize', () => {
        it('should normalize simple format to full format', () => {
            const normalized = parser.normalize('base × 2', 16, 8);
            expect(normalized).toBe('base × 2 = 8 × 2 = 16');
        });
        it('should normalize format with result', () => {
            const normalized = parser.normalize('8 × 2 = 16', 16, 8);
            expect(normalized).toBe('base × 2 = 8 × 2 = 16');
        });
        it('should normalize division', () => {
            const normalized = parser.normalize('base ÷ 2', 4, 8);
            expect(normalized).toBe('base ÷ 2 = 8 ÷ 2 = 4');
        });
        it('should normalize addition', () => {
            const normalized = parser.normalize('base + 4', 12, 8);
            expect(normalized).toBe('base + 4 = 8 + 4 = 12');
        });
        it('should normalize subtraction', () => {
            const normalized = parser.normalize('base - 2', 6, 8);
            expect(normalized).toBe('base - 2 = 8 - 2 = 6');
        });
        it('should return original if invalid', () => {
            const normalized = parser.normalize('invalid expression', 16, 8);
            expect(normalized).toBe('invalid expression');
        });
    });
    describe('generate', () => {
        it('should generate multiplication relationship', () => {
            const generated = parser.generate(16, 8);
            expect(generated).toBe('base × 2 = 8 × 2 = 16');
        });
        it('should generate division relationship', () => {
            const generated = parser.generate(4, 8);
            expect(generated).toBe('base ÷ 2 = 8 ÷ 2 = 4');
        });
        it('should generate relationship for 12 from 8', () => {
            const generated = parser.generate(12, 8);
            // Uses multiplication for consistency (12 = 8 × 1.5)
            expect(generated).toBe('base × 1.5 = 8 × 1.5 = 12');
        });
        it('should generate relationship for 6 from 8', () => {
            const generated = parser.generate(6, 8);
            // Uses multiplication for consistency (6 = 8 × 0.75)
            expect(generated).toBe('base × 0.75 = 8 × 0.75 = 6');
        });
        it('should generate identity relationship', () => {
            const generated = parser.generate(8, 8);
            expect(generated).toBe('base × 1 = 8 × 1 = 8');
        });
        it('should handle decimal multipliers', () => {
            const generated = parser.generate(12, 8);
            // Should use multiplication with decimal (preferred for consistency)
            expect(generated).toBe('base × 1.5 = 8 × 1.5 = 12');
        });
        it('should handle non-integer relationships', () => {
            const generated = parser.generate(10, 8);
            // Should use multiplication with decimal
            expect(generated).toBe('base × 1.25 = 8 × 1.25 = 10');
        });
    });
    describe('real-world token examples', () => {
        it('should validate space100 (base token)', () => {
            const result = parser.validate('base × 1 = 8 × 1 = 8', 8, 8);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
        });
        it('should validate space200 (double base)', () => {
            const result = parser.validate('base × 2 = 8 × 2 = 16', 16, 8);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
        });
        it('should validate space150 (1.5x base)', () => {
            const result = parser.validate('base × 1.5 = 8 × 1.5 = 12', 12, 8);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
        });
        it('should validate space050 (half base)', () => {
            const result = parser.validate('base ÷ 2 = 8 ÷ 2 = 4', 4, 8);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
        });
        it('should validate space075 (strategic flexibility)', () => {
            const result = parser.validate('base × 0.75 = 8 × 0.75 = 6', 6, 8);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
        });
        it('should validate fontSize100 (base token)', () => {
            const result = parser.validate('base × 1 = 16 × 1 = 16', 16, 16);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
        });
        it('should validate fontSize200 (modular scale)', () => {
            const result = parser.validate('base × 1.125 = 16 × 1.125 = 18', 18, 16);
            expect(result.isValid).toBe(true);
            expect(result.mathematicallyCorrect).toBe(true);
        });
    });
});
//# sourceMappingURL=MathematicalRelationshipParser.test.js.map