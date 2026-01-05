/**
 * Component Token Registry
 * 
 * Global registry for component tokens that collects tokens from all components.
 * Follows the same pattern as PrimitiveTokenRegistry and SemanticTokenRegistry.
 * 
 * Provides registration, retrieval, and query methods for component tokens.
 * Detects naming conflicts when two components define tokens with the same name.
 * 
 * @see Requirements 4.1-4.6 in .kiro/specs/037-component-token-generation-pipeline/requirements.md
 */

import type { IRegistry, RegistrationOptions } from './IRegistry';

/**
 * Registered component token with full metadata
 * 
 * This is the structure stored in the ComponentTokenRegistry.
 * It contains all information needed for validation and platform output generation.
 */
export interface RegisteredComponentToken {
  /** Full token name (e.g., 'buttonicon.inset.large') */
  name: string;
  /** Component this token belongs to */
  component: string;
  /** Token family */
  family: string;
  /** Resolved numeric value */
  value: number;
  /** Reference to primitive token name (if applicable) */
  primitiveReference?: string;
  /** Explanation of why this token exists */
  reasoning: string;
}

/**
 * Registration options for component tokens
 */
export interface ComponentTokenRegistrationOptions extends RegistrationOptions {
  /** Allow overwriting existing tokens (default: false) */
  allowOverwrite?: boolean;
}

/**
 * Query options for component tokens
 */
export interface ComponentTokenQueryOptions {
  /** Filter by component name */
  component?: string;
  /** Filter by token family */
  family?: string;
  /** Sort results */
  sortBy?: 'name' | 'component' | 'family' | 'value';
}

/**
 * Component Token Registry Implementation
 * 
 * Manages component tokens with indexing by component and family.
 * Implements IRegistry<RegisteredComponentToken> for consistent registry interface.
 */
class ComponentTokenRegistryImpl implements IRegistry<RegisteredComponentToken> {
  /**
   * Registry name for identification
   */
  readonly name = 'ComponentTokenRegistry';

  /** Primary token storage by name */
  private tokens: Map<string, RegisteredComponentToken> = new Map();
  
  /** Index by component name */
  private byComponent: Map<string, RegisteredComponentToken[]> = new Map();
  
  /** Index by token family */
  private byFamily: Map<string, RegisteredComponentToken[]> = new Map();

  /**
   * Register a single component token
   * 
   * Implements IRegistry.register() interface.
   * 
   * @param token - The component token to register
   * @param options - Registration options
   * @throws Error if token with same name already exists (unless allowOverwrite is true)
   */
  register(token: RegisteredComponentToken, options: ComponentTokenRegistrationOptions = {}): void {
    const { allowOverwrite = false } = options;

    // Check for conflicts
    if (this.tokens.has(token.name) && !allowOverwrite) {
      const existing = this.tokens.get(token.name)!;
      throw new Error(
        `Component token conflict: "${token.name}" already registered by ` +
        `${existing.component}. Attempted registration by ${token.component}.`
      );
    }

    // If overwriting, remove from indexes first
    if (this.tokens.has(token.name)) {
      this.removeFromIndexes(token.name);
    }

    // Store token
    this.tokens.set(token.name, token);

    // Index by component
    if (!this.byComponent.has(token.component)) {
      this.byComponent.set(token.component, []);
    }
    this.byComponent.get(token.component)!.push(token);

    // Index by family
    if (!this.byFamily.has(token.family)) {
      this.byFamily.set(token.family, []);
    }
    this.byFamily.get(token.family)!.push(token);
  }

  /**
   * Register a batch of component tokens for a component
   * 
   * This is the primary method called by defineComponentTokens().
   * 
   * @param component - Component name (for error messages)
   * @param tokens - Array of tokens to register
   * @throws Error if any token conflicts with existing tokens
   */
  registerBatch(component: string, tokens: RegisteredComponentToken[]): void {
    for (const token of tokens) {
      this.register(token);
    }
  }

  /**
   * Get all registered component tokens
   * 
   * Implements IRegistry.query() interface.
   * 
   * @returns Array of all registered tokens
   */
  query(): RegisteredComponentToken[] {
    return Array.from(this.tokens.values());
  }

  /**
   * Get all registered component tokens (alias for query)
   * 
   * @returns Array of all registered tokens
   */
  getAll(): RegisteredComponentToken[] {
    return this.query();
  }

  /**
   * Get tokens for a specific component
   * 
   * @param componentName - Component name to filter by
   * @returns Array of tokens for the component
   */
  getByComponent(componentName: string): RegisteredComponentToken[] {
    return this.byComponent.get(componentName) || [];
  }

  /**
   * Get tokens by token family
   * 
   * @param familyName - Family name to filter by (e.g., 'spacing', 'fontSize')
   * @returns Array of tokens in the family
   */
  getByFamily(familyName: string): RegisteredComponentToken[] {
    return this.byFamily.get(familyName) || [];
  }

  /**
   * Get a specific token by name
   * 
   * Implements IRegistry.get() interface.
   * 
   * @param tokenName - Full token name (e.g., 'buttonicon.inset.large')
   * @returns Token if found, undefined otherwise
   */
  get(tokenName: string): RegisteredComponentToken | undefined {
    return this.tokens.get(tokenName);
  }

  /**
   * Check if a token exists
   * 
   * Implements IRegistry.has() interface.
   * 
   * @param tokenName - Full token name to check
   * @returns True if token exists, false otherwise
   */
  has(tokenName: string): boolean {
    return this.tokens.has(tokenName);
  }

  /**
   * Get registry statistics
   * 
   * @returns Statistics about registered tokens
   */
  getStats(): {
    totalTokens: number;
    componentCount: number;
    familyCount: number;
    componentStats: Record<string, number>;
    familyStats: Record<string, number>;
  } {
    const componentStats: Record<string, number> = {};
    for (const [component, tokens] of this.byComponent) {
      componentStats[component] = tokens.length;
    }

    const familyStats: Record<string, number> = {};
    for (const [family, tokens] of this.byFamily) {
      familyStats[family] = tokens.length;
    }

    return {
      totalTokens: this.tokens.size,
      componentCount: this.byComponent.size,
      familyCount: this.byFamily.size,
      componentStats,
      familyStats,
    };
  }

  /**
   * Remove a token from the registry
   * 
   * @param tokenName - Full token name to remove
   * @returns True if token was removed, false if not found
   */
  remove(tokenName: string): boolean {
    if (!this.tokens.has(tokenName)) {
      return false;
    }

    this.removeFromIndexes(tokenName);
    this.tokens.delete(tokenName);
    return true;
  }

  /**
   * Clear all tokens from the registry
   * 
   * Useful for testing to reset state between tests.
   */
  clear(): void {
    this.tokens.clear();
    this.byComponent.clear();
    this.byFamily.clear();
  }

  /**
   * Remove a token from component and family indexes
   * 
   * @param tokenName - Token name to remove from indexes
   */
  private removeFromIndexes(tokenName: string): void {
    const token = this.tokens.get(tokenName);
    if (!token) return;

    // Remove from component index
    const componentTokens = this.byComponent.get(token.component);
    if (componentTokens) {
      const index = componentTokens.findIndex(t => t.name === tokenName);
      if (index !== -1) {
        componentTokens.splice(index, 1);
      }
      if (componentTokens.length === 0) {
        this.byComponent.delete(token.component);
      }
    }

    // Remove from family index
    const familyTokens = this.byFamily.get(token.family);
    if (familyTokens) {
      const index = familyTokens.findIndex(t => t.name === tokenName);
      if (index !== -1) {
        familyTokens.splice(index, 1);
      }
      if (familyTokens.length === 0) {
        this.byFamily.delete(token.family);
      }
    }
  }
}

/**
 * Singleton instance of the Component Token Registry
 * 
 * This is the global registry used by defineComponentTokens() and the generation pipeline.
 */
export const ComponentTokenRegistry = new ComponentTokenRegistryImpl();
