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
export class MathematicalRelationshipParser {
  // Operator normalization map
  private readonly OPERATOR_MAP: Record<string, '×' | '÷' | '+' | '-'> = {
    '×': '×',
    '*': '×',
    'x': '×',
    '÷': '÷',
    '/': '÷',
    '+': '+',
    '-': '-'
  };

  /**
   * Parse a mathematical relationship expression
   * 
   * @param expression - Mathematical relationship expression
   * @returns Parsed relationship
   */
  parse(expression: string): ParsedRelationship {
    const errors: string[] = [];
    
    // Normalize whitespace
    const normalized = expression.trim().replace(/\s+/g, ' ');
    
    if (!normalized) {
      return {
        original: expression,
        normalized: '',
        leftSide: '',
        operator: '×',
        operand: 1,
        isValid: false,
        errors: ['Empty expression']
      };
    }

    // Split by equals sign to separate left and right sides
    const parts = normalized.split('=').map(p => p.trim());
    const leftSide = parts[0];
    const rightSide = parts.length > 1 ? parts.slice(1).join(' = ').trim() : undefined;

    // Parse left side (e.g., 'base × 2' or '8 × 2')
    const leftParsed = this.parseExpression(leftSide);
    
    if (!leftParsed.isValid) {
      errors.push(...leftParsed.errors);
    }

    // Parse right side if present
    let expectedResult: number | undefined;
    if (rightSide) {
      // Right side can be:
      // - Just a number: '16'
      // - An expression: '8 × 2'
      // - Multiple expressions: '8 × 2 = 16'
      
      const rightParts = rightSide.split('=').map(p => p.trim());
      
      // Try to parse each part
      for (const part of rightParts) {
        const parsed = this.parseExpression(part);
        
        if (parsed.isValid && parsed.result !== undefined) {
          // If we haven't set expected result yet, use this
          if (expectedResult === undefined) {
            expectedResult = parsed.result;
          } else if (expectedResult !== parsed.result) {
            // Multiple results that don't match
            errors.push(`Inconsistent results in expression: ${expectedResult} ≠ ${parsed.result}`);
          }
        }
      }
    }

    return {
      original: expression,
      normalized,
      leftSide,
      rightSide,
      operator: leftParsed.operator,
      operand: leftParsed.operand,
      expectedResult,
      isValid: errors.length === 0 && leftParsed.isValid,
      errors
    };
  }

  /**
   * Parse a single expression (e.g., 'base × 2' or '8 × 2')
   */
  private parseExpression(expr: string): {
    isValid: boolean;
    errors: string[];
    operator: '×' | '÷' | '+' | '-';
    operand: number;
    result?: number;
  } {
    const errors: string[] = [];
    
    // Find operator
    let operator: '×' | '÷' | '+' | '-' | undefined;
    let operatorIndex = -1;
    
    for (const [rawOp, normalizedOp] of Object.entries(this.OPERATOR_MAP)) {
      const index = expr.indexOf(rawOp);
      if (index !== -1) {
        operator = normalizedOp;
        operatorIndex = index;
        break;
      }
    }

    // If no operator found, check if it's just a number
    if (!operator) {
      const num = parseFloat(expr);
      if (!isNaN(num)) {
        // Just a number, treat as result
        return {
          isValid: true,
          errors: [],
          operator: '×',
          operand: 1,
          result: num
        };
      }
      
      errors.push(`No valid operator found in expression: ${expr}`);
      return {
        isValid: false,
        errors,
        operator: '×',
        operand: 1
      };
    }

    // Split by operator
    const leftPart = expr.substring(0, operatorIndex).trim();
    const rightPart = expr.substring(operatorIndex + 1).trim();

    // Parse operand (right side of operator)
    const operand = parseFloat(rightPart);
    if (isNaN(operand)) {
      errors.push(`Invalid operand: ${rightPart}`);
      return {
        isValid: false,
        errors,
        operator,
        operand: 1
      };
    }

    // Parse left side (base value or 'base')
    let result: number | undefined;
    const baseValue = parseFloat(leftPart);
    
    if (!isNaN(baseValue)) {
      // Left side is a number, calculate result
      result = this.calculate(baseValue, operator, operand);
    }
    // If left side is 'base', we can't calculate result without knowing base value

    return {
      isValid: errors.length === 0,
      errors,
      operator,
      operand,
      result
    };
  }

  /**
   * Calculate result of operation
   */
  private calculate(left: number, operator: '×' | '÷' | '+' | '-', right: number): number {
    switch (operator) {
      case '×':
        return left * right;
      case '÷':
        return left / right;
      case '+':
        return left + right;
      case '-':
        return left - right;
    }
  }

  /**
   * Validate a mathematical relationship against actual values
   * 
   * @param expression - Mathematical relationship expression
   * @param baseValue - Actual base value of the token
   * @param familyBaseValue - Family base value
   * @returns Validation result
   */
  validate(
    expression: string,
    baseValue: number,
    familyBaseValue: number
  ): RelationshipValidationResult {
    // Special case: For base tokens where baseValue === familyBaseValue,
    // allow descriptive relationships like "base value", "family base", etc.
    // These tokens don't need mathematical operators since they ARE the base
    // 
    // For non-numeric tokens (colors, strings), we can't do mathematical comparison,
    // so we accept descriptive relationships if they don't contain operators
    const isDescriptiveRelationship = !expression.match(/[×*x÷\/+\-]/);
    
    // Check if this is a base token (numeric comparison)
    const isNumericBaseToken = typeof baseValue === 'number' && 
                                typeof familyBaseValue === 'number' && 
                                Math.abs(baseValue - familyBaseValue) < 0.001;
    
    // Check if this is a non-numeric token (color, string, etc.)
    const isNonNumericToken = typeof baseValue !== 'number' || typeof familyBaseValue !== 'number';
    
    if ((isNumericBaseToken || isNonNumericToken) && isDescriptiveRelationship) {
      // This is either:
      // 1. A base token with a descriptive relationship - accept it
      // 2. A non-numeric token (color, string) - accept descriptive relationship
      return {
        isValid: true,
        errors: [],
        parsed: {
          original: expression,
          normalized: expression.trim(),
          leftSide: expression.trim(),
          operator: '×',
          operand: 1,
          isValid: true,
          errors: []
        },
        mathematicallyCorrect: true,
        calculatedResult: baseValue,
        expectedResult: baseValue
      };
    }
    
    const parsed = this.parse(expression);
    
    if (!parsed.isValid) {
      return {
        isValid: false,
        errors: parsed.errors,
        parsed,
        mathematicallyCorrect: false
      };
    }

    // Calculate what the result should be based on family base value
    const calculatedResult = this.calculate(familyBaseValue, parsed.operator, parsed.operand);
    
    // Check if calculated result matches actual base value
    const mathematicallyCorrect = Math.abs(calculatedResult - baseValue) < 0.001; // Allow for floating point errors
    
    const errors: string[] = [];
    
    if (!mathematicallyCorrect) {
      errors.push(
        `Mathematical relationship incorrect: ${familyBaseValue} ${parsed.operator} ${parsed.operand} = ${calculatedResult}, but token baseValue is ${baseValue}`
      );
    }

    // If expression includes expected result, verify it matches calculated result
    if (parsed.expectedResult !== undefined) {
      const expectedMatchesCalculated = Math.abs(parsed.expectedResult - calculatedResult) < 0.001;
      const expectedMatchesActual = Math.abs(parsed.expectedResult - baseValue) < 0.001;
      
      if (!expectedMatchesCalculated && !expectedMatchesActual) {
        errors.push(
          `Expected result ${parsed.expectedResult} does not match calculated result ${calculatedResult} or actual baseValue ${baseValue}`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      parsed,
      mathematicallyCorrect,
      calculatedResult,
      expectedResult: parsed.expectedResult
    };
  }

  /**
   * Check if two mathematical relationships are equivalent
   * 
   * @param expr1 - First expression
   * @param expr2 - Second expression
   * @param familyBaseValue - Family base value for calculation
   * @returns Whether the expressions are equivalent
   */
  areEquivalent(expr1: string, expr2: string, familyBaseValue: number): boolean {
    const parsed1 = this.parse(expr1);
    const parsed2 = this.parse(expr2);
    
    if (!parsed1.isValid || !parsed2.isValid) {
      return false;
    }

    // Calculate results for both expressions
    const result1 = this.calculate(familyBaseValue, parsed1.operator, parsed1.operand);
    const result2 = this.calculate(familyBaseValue, parsed2.operator, parsed2.operand);
    
    // Check if results are equal (within floating point tolerance)
    return Math.abs(result1 - result2) < 0.001;
  }

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
  normalize(expression: string, baseValue: number, familyBaseValue: number): string {
    const parsed = this.parse(expression);
    
    if (!parsed.isValid) {
      return expression; // Return original if invalid
    }

    // Calculate result
    const result = this.calculate(familyBaseValue, parsed.operator, parsed.operand);
    
    // Format: base × N = familyBase × N = result
    return `base ${parsed.operator} ${parsed.operand} = ${familyBaseValue} ${parsed.operator} ${parsed.operand} = ${result}`;
  }

  /**
   * Generate a mathematical relationship expression from values
   * 
   * @param baseValue - Token base value
   * @param familyBaseValue - Family base value
   * @returns Generated expression
   */
  generate(baseValue: number, familyBaseValue: number): string {
    // Calculate the relationship
    if (baseValue === familyBaseValue) {
      return `base × 1 = ${familyBaseValue} × 1 = ${baseValue}`;
    }

    // Try multiplication first (prefer integer multipliers)
    if (baseValue % familyBaseValue === 0) {
      const multiplier = baseValue / familyBaseValue;
      return `base × ${multiplier} = ${familyBaseValue} × ${multiplier} = ${baseValue}`;
    }

    // Try division (prefer integer divisors)
    if (familyBaseValue % baseValue === 0) {
      const divisor = familyBaseValue / baseValue;
      return `base ÷ ${divisor} = ${familyBaseValue} ÷ ${divisor} = ${baseValue}`;
    }

    // Use multiplication with decimal (preferred over addition/subtraction for consistency)
    const multiplier = baseValue / familyBaseValue;
    return `base × ${multiplier} = ${familyBaseValue} × ${multiplier} = ${baseValue}`;
  }
}
