/**
 * Mathematical Relationship Parser
 *
 * Parses and validates mathematical relationship expressions for design tokens.
 * Supports multiple formats and validates mathematical correctness.
 *
 * Supported formats:
 * - Simple: 'base × 2', '8 × 2', 'base ÷ 2'
 * - With result: '8 × 2 = 16', 'base × 2 = 16'
 * - Full expression: 'base × 2 = 8 × 2 = 16'
 *
 * Supported operators: ×, *, x, ÷, /, +, -
 */
/**
 * Parsed mathematical relationship
 */
export interface ParsedRelationship {
    /** Original expression */
    original: string;
    /** Normalized expression (standardized operators) */
    normalized: string;
    /** Left side of equation (e.g., 'base × 2') */
    leftSide: string;
    /** Right side of equation (e.g., '8 × 2 = 16') */
    rightSide?: string;
    /** Operator used (×, ÷, +, -) */
    operator: '×' | '÷' | '+' | '-';
    /** Multiplier/divisor/addend/subtrahend value */
    operand: number;
    /** Expected result (if provided) */
    expectedResult?: number;
    /** Whether the expression is valid */
    isValid: boolean;
    /** Validation errors */
    errors: string[];
}
/**
 * Validation result for mathematical relationship
 */
export interface RelationshipValidationResult {
    /** Whether the relationship is valid */
    isValid: boolean;
    /** Validation errors */
    errors: string[];
    /** Parsed relationship */
    parsed?: ParsedRelationship;
    /** Whether the math is correct */
    mathematicallyCorrect: boolean;
    /** Calculated result */
    calculatedResult?: number;
    /** Expected result (from expression) */
    expectedResult?: number;
}
/**
 * Mathematical Relationship Parser
 */
export declare class MathematicalRelationshipParser {
    private readonly OPERATOR_MAP;
    /**
     * Parse a mathematical relationship expression
     *
     * @param expression - Mathematical relationship expression
     * @returns Parsed relationship
     */
    parse(expression: string): ParsedRelationship;
    /**
     * Parse a single expression (e.g., 'base × 2' or '8 × 2')
     */
    private parseExpression;
    /**
     * Calculate result of operation
     */
    private calculate;
    /**
     * Validate a mathematical relationship against actual values
     *
     * @param expression - Mathematical relationship expression
     * @param baseValue - Actual base value of the token
     * @param familyBaseValue - Family base value
     * @returns Validation result
     */
    validate(expression: string, baseValue: number, familyBaseValue: number): RelationshipValidationResult;
    /**
     * Check if two mathematical relationships are equivalent
     *
     * @param expr1 - First expression
     * @param expr2 - Second expression
     * @param familyBaseValue - Family base value for calculation
     * @returns Whether the expressions are equivalent
     */
    areEquivalent(expr1: string, expr2: string, familyBaseValue: number): boolean;
    /**
     * Normalize a mathematical relationship expression
     *
     * Converts various formats to a standard format: 'base × N = familyBase × N = result'
     *
     * @param expression - Expression to normalize
     * @param baseValue - Actual base value
     * @param familyBaseValue - Family base value
     * @returns Normalized expression
     */
    normalize(expression: string, baseValue: number, familyBaseValue: number): string;
    /**
     * Generate a mathematical relationship expression from values
     *
     * @param baseValue - Token base value
     * @param familyBaseValue - Family base value
     * @returns Generated expression
     */
    generate(baseValue: number, familyBaseValue: number): string;
}
//# sourceMappingURL=MathematicalRelationshipParser.d.ts.map