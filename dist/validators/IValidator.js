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
//# sourceMappingURL=IValidator.js.map