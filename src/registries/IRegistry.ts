/**
 * Common interface for all token registries
 * 
 * This interface establishes a consistent contract for token storage and retrieval
 * across different registry implementations. It enables polymorphic usage of registries
 * and ensures separation of concerns by focusing solely on storage operations without
 * validation logic.
 * 
 * @template TToken - The type of token this registry stores (e.g., PrimitiveToken, SemanticToken)
 * 
 * @example
 * ```typescript
 * // Implementing a registry
 * class MyTokenRegistry implements IRegistry<MyToken> {
 *   readonly name = 'MyTokenRegistry';
 *   
 *   register(token: MyToken, options?: RegistrationOptions): void {
 *     // Storage logic only - no validation
 *   }
 *   
 *   query(): MyToken[] {
 *     // Return all tokens
 *   }
 *   
 *   get(name: string): MyToken | undefined {
 *     // Retrieve specific token
 *   }
 *   
 *   has(name: string): boolean {
 *     // Check token existence
 *   }
 * }
 * ```
 */
export interface IRegistry<TToken> {
  /**
   * Registry name for identification and logging
   * 
   * This property helps identify which registry is being used in logs,
   * error messages, and debugging scenarios.
   * 
   * @example
   * ```typescript
   * console.log(`Using registry: ${registry.name}`);
   * // Output: "Using registry: PrimitiveTokenRegistry"
   * ```
   */
  readonly name: string;

  /**
   * Register a token in the registry
   * 
   * This method stores a token without performing validation. Validation should
   * be performed by the caller before registration using appropriate validators.
   * 
   * The registry trusts that tokens passed to this method are valid and focuses
   * solely on storage operations.
   * 
   * @param token - The token to register
   * @param options - Optional registration options
   * 
   * @throws May throw if token with same name already exists (implementation-specific)
   * 
   * @example
   * ```typescript
   * // Caller validates before registration
   * const validationResult = validator.validate(token);
   * if (validationResult.valid) {
   *   registry.register(token);
   * }
   * 
   * // Skip validation if token is already validated
   * registry.register(token, { skipValidation: true });
   * ```
   */
  register(token: TToken, options?: RegistrationOptions): void;

  /**
   * Query all tokens in the registry
   * 
   * Returns an array of all registered tokens. The order of tokens in the
   * returned array is implementation-specific.
   * 
   * @returns Array of all registered tokens
   * 
   * @example
   * ```typescript
   * const allTokens = registry.query();
   * console.log(`Registry contains ${allTokens.length} tokens`);
   * 
   * // Process all tokens
   * allTokens.forEach(token => {
   *   console.log(`Token: ${token.name}`);
   * });
   * ```
   */
  query(): TToken[];

  /**
   * Get a specific token by name
   * 
   * Retrieves a token from the registry by its name. Returns undefined if
   * the token is not found.
   * 
   * @param name - Token name to retrieve
   * @returns Token if found, undefined otherwise
   * 
   * @example
   * ```typescript
   * const token = registry.get('space100');
   * if (token) {
   *   console.log(`Found token: ${token.name}`);
   * } else {
   *   console.log('Token not found');
   * }
   * ```
   */
  get(name: string): TToken | undefined;

  /**
   * Check if a token exists in the registry
   * 
   * Checks whether a token with the given name is registered without
   * retrieving the token itself. This is useful for existence checks
   * before attempting to retrieve or register tokens.
   * 
   * @param name - Token name to check
   * @returns True if token exists, false otherwise
   * 
   * @example
   * ```typescript
   * if (registry.has('space100')) {
   *   console.log('Token already registered');
   * } else {
   *   registry.register(newToken);
   * }
   * ```
   */
  has(name: string): boolean;
}

/**
 * Registration options for token registration
 * 
 * These options control the registration behavior and provide flexibility
 * for different registration scenarios.
 */
export interface RegistrationOptions {
  /**
   * Skip validation during registration
   * 
   * When true, the registry assumes the token is already validated and
   * skips any validation steps. This is useful when:
   * - Token has been validated by the caller
   * - Re-registering tokens during system initialization
   * - Batch operations where validation is performed separately
   * 
   * Default: false (validation is performed)
   * 
   * @example
   * ```typescript
   * // Token already validated by caller
   * const validationResult = validator.validate(token);
   * if (validationResult.valid) {
   *   registry.register(token, { skipValidation: true });
   * }
   * ```
   */
  skipValidation?: boolean;
}
