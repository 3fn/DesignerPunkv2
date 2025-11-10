"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPromiseValidationResult = isPromiseValidationResult;
exports.awaitValidationResult = awaitValidationResult;
/**
 * Type guard to check if a validation result is a Promise
 *
 * Utility function for handling both synchronous and asynchronous validation results.
 *
 * @param result - Validation result or promise
 * @returns True if result is a Promise, false otherwise
 *
 * @example
 * ```typescript
 * const result = validator.validate(input);
 *
 * if (isPromiseValidationResult(result)) {
 *   result.then(r => console.log(r.level));
 * } else {
 *   console.log(result.level);
 * }
 * ```
 */
function isPromiseValidationResult(result) {
    return result instanceof Promise;
}
/**
 * Helper function to await validation result regardless of sync/async
 *
 * Normalizes synchronous and asynchronous validation results into a Promise,
 * simplifying handling of mixed validator types.
 *
 * @param result - Validation result or promise
 * @returns Promise resolving to validation result
 *
 * @example
 * ```typescript
 * const result = await awaitValidationResult(validator.validate(input));
 * console.log(result.level);
 * ```
 */
async function awaitValidationResult(result) {
    return result;
}
//# sourceMappingURL=IValidator.js.map