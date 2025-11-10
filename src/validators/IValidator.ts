/**
 * IValidator Interface
 * 
 * Common interface for all validators in the design system.
 * Enables polymorphic usage and ensures consistent validation contracts.
 * 
 * This interface establishes the foundation for the three-tier validation system
 * (Pass/Warning/Error) and provides a consistent API for all validator implementations.
 * 
 * @example
 * ```typescript
 * // Implementing a custom validator
 * class CustomValidator implements IValidator<MyInputType> {
 *   readonly name = 'CustomValidator';
 *   
 *   validate(input: MyInputType): ValidationResult {
 *     // Validation logic here
 *     return {
 *       level: 'Pass',
 *       token: input.name,
 *       message: 'Validation passed',
 *       rationale: 'Token meets all criteria',
 *       mathematicalReasoning: 'Mathematical relationships validated'
 *     };
 *   }
 * }
 * 
 * // Using validators polymorphically
 * const validators: IValidator[] = [
 *   new PassValidator(),
 *   new WarningValidator(),
 *   new ErrorValidator()
 * ];
 * 
 * validators.forEach(validator => {
 *   const result = validator.validate(input);
 *   console.log(`${validator.name}: ${result.level}`);
 * });
 * ```
 */

/**
 * Validation levels for the three-tier validation system
 * 
 * - Pass: Token usage follows best practices and mathematical foundations
 * - Warning: Valid usage but consider semantic alternatives or improvements
 * - Error: Violates mathematical foundations or design system constraints
 */
export type ValidationLevel = 'Pass' | 'Warning' | 'Error';

/**
 * Validation result providing feedback on token usage
 * 
 * This interface defines the structure of validation feedback across all validators,
 * ensuring consistent communication of validation outcomes, rationale, and suggestions.
 */
export interface ValidationResult {
  /** 
   * Validation level indicating severity and compliance
   * 
   * - Pass: Token usage is correct and follows best practices
   * - Warning: Usage is valid but could be improved
   * - Error: Usage violates design system constraints
   */
  level: ValidationLevel;
  
  /** 
   * Token name or identifier being validated
   * 
   * Used to identify which token the validation result applies to,
   * enabling clear feedback in multi-token validation scenarios.
   */
  token: string;
  
  /** 
   * Human-readable validation message
   * 
   * Concise summary of the validation outcome suitable for display
   * in user interfaces or logs.
   */
  message: string;
  
  /** 
   * Detailed rationale explaining the validation result
   * 
   * Provides context and reasoning for the validation decision,
   * helping developers understand why a particular result was returned.
   */
  rationale: string;
  
  /** 
   * Optional suggestions for improvement or correction
   * 
   * Actionable recommendations for addressing warnings or errors,
   * guiding developers toward compliant token usage.
   */
  suggestions?: string[];
  
  /** 
   * Mathematical reasoning behind the validation decision
   * 
   * Explains the mathematical relationships and foundations that
   * inform the validation result, supporting the design system's
   * mathematical rigor and transparency.
   */
  mathematicalReasoning: string;

  /**
   * Optional array of error messages for detailed error reporting
   * 
   * Used when multiple validation errors occur or when detailed
   * error information needs to be communicated.
   */
  errors?: string[];

  /**
   * Optional array of warning messages for detailed warning reporting
   * 
   * Used when multiple validation warnings occur or when detailed
   * warning information needs to be communicated.
   */
  warnings?: string[];

  /**
   * Optional flag indicating overall validation success
   * 
   * Convenience property for quickly checking if validation passed
   * without examining the level property.
   */
  valid?: boolean;
}

/**
 * Common interface for all validators
 * 
 * This interface defines the contract that all validators must implement,
 * enabling polymorphic usage and consistent validation behavior across
 * the design system.
 * 
 * @template TInput - The type of input the validator accepts
 * 
 * @remarks
 * Validators implementing this interface can be used interchangeably,
 * composed into validation pipelines, and orchestrated by higher-level
 * validation coordinators. The generic type parameter allows validators
 * to accept different input types while maintaining a consistent API.
 * 
 * @example
 * ```typescript
 * // Type-safe validator for primitive tokens
 * class PrimitiveValidator implements IValidator<PrimitiveToken> {
 *   readonly name = 'PrimitiveValidator';
 *   
 *   validate(input: PrimitiveToken): ValidationResult {
 *     // Type-safe validation logic
 *     return {
 *       level: 'Pass',
 *       token: input.name,
 *       message: 'Primitive token validated',
 *       rationale: 'Token follows mathematical foundations',
 *       mathematicalReasoning: `Base value: ${input.baseValue}`
 *     };
 *   }
 * }
 * 
 * // Validator that returns null when no issues found
 * class WarningValidator implements IValidator<WarningContext> {
 *   readonly name = 'WarningValidator';
 *   
 *   validate(input: WarningContext): ValidationResult | null {
 *     // Check for warnings
 *     if (this.hasWarning(input)) {
 *       return {
 *         level: 'Warning',
 *         token: input.token.name,
 *         message: 'Usage could be improved',
 *         rationale: 'Consider semantic alternatives',
 *         mathematicalReasoning: 'Primitive token usage detected'
 *       };
 *     }
 *     
 *     // No warnings found
 *     return null;
 *   }
 * }
 * ```
 */
export interface IValidator<TInput = any> {
  /**
   * Validator name for identification and logging
   * 
   * Used to identify the validator in logs, error messages, and debugging output.
   * Should be a descriptive, unique name that clearly indicates the validator's purpose.
   * 
   * @example
   * ```typescript
   * readonly name = 'BaselineGridValidator';
   * readonly name = 'SemanticTokenValidator';
   * readonly name = 'CrossPlatformConsistencyValidator';
   * ```
   */
  readonly name: string;

  /**
   * Validate input and return validation result
   * 
   * Performs validation logic on the provided input and returns a structured
   * validation result indicating the outcome, rationale, and any suggestions
   * for improvement.
   * 
   * All validators in the design system are synchronous, performing computational
   * validation (mathematical checks, pattern matching, reference validation) without
   * I/O operations. This ensures fast, predictable validation performance.
   * 
   * Some validators (like WarningValidator and ErrorValidator) may return null
   * when no issues are found, indicating that validation passed without warnings
   * or errors.
   * 
   * @param input - The input to validate (token, configuration, etc.)
   * @returns Validation result with status, messages, and mathematical reasoning, or null if no issues found
   * 
   * @remarks
   * - All validators return ValidationResult synchronously or null
   * - Validators perform computational validation only (no I/O)
   * - Null return indicates no validation issues (equivalent to Pass)
   * - Validators should provide clear, actionable feedback in all cases
   * 
   * @example
   * ```typescript
   * // Synchronous validation
   * validate(token: PrimitiveToken): ValidationResult {
   *   if (token.baseValue % 8 === 0) {
   *     return {
   *       level: 'Pass',
   *       token: token.name,
   *       message: 'Baseline grid alignment validated',
   *       rationale: 'Token aligns with 8-unit baseline grid',
   *       mathematicalReasoning: `${token.baseValue} ÷ 8 = ${token.baseValue / 8}`
   *     };
   *   }
   *   
   *   return {
   *     level: 'Error',
   *     token: token.name,
   *     message: 'Baseline grid alignment violation',
   *     rationale: 'Token does not align with baseline grid',
   *     mathematicalReasoning: `${token.baseValue} ÷ 8 = ${token.baseValue / 8} (non-whole)`,
   *     suggestions: ['Use value divisible by 8', 'Consider strategic flexibility token']
   *   };
   * }
   * 
   * // Validator that returns null when no issues found
   * validate(context: WarningValidationContext): ValidationResult | null {
   *   // Check for warnings
   *   if (hasWarning) {
   *     return {
   *       level: 'Warning',
   *       token: context.token.name,
   *       message: 'Warning detected',
   *       rationale: 'Usage could be improved',
   *       mathematicalReasoning: 'Consider semantic alternatives'
   *     };
   *   }
   *   
   *   // No warnings found
   *   return null;
   * }
   * ```
   */
  validate(input: TInput): ValidationResult | null;
}


