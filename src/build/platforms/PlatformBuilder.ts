/**
 * Platform Builder Interface
 * 
 * Defines the common interface that all platform-specific builders must implement.
 * Each platform builder is responsible for generating platform-native packages
 * with proper token integration and component structure.
 */

import { BuildConfig } from '../types/BuildConfig';
import { BuildResult } from '../types/BuildResult';
import { Platform } from '../types/Platform';
import { PlatformTokens } from '../tokens/PlatformTokens';

/**
 * Component definition for platform builds
 */
export interface ComponentDefinition {
  /** Component name */
  name: string;
  
  /** Component description */
  description: string;
  
  /** Component category */
  category: string;
  
  /** Component properties */
  properties: PropertyDefinition[];
  
  /** Component methods */
  methods: MethodDefinition[];
  
  /** Token references used by component */
  tokens: TokenReference[];
}

/**
 * Property definition
 */
export interface PropertyDefinition {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: unknown;
}

/**
 * Method definition
 */
export interface MethodDefinition {
  name: string;
  description: string;
  parameters: ParameterDefinition[];
  returnType: string;
}

/**
 * Parameter definition
 */
export interface ParameterDefinition {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

/**
 * Token reference in component
 */
export interface TokenReference {
  property: string;
  tokenName: string;
  category: string;
}

/**
 * Platform builder interface
 * 
 * All platform-specific builders must implement this interface to ensure
 * consistent build behavior across platforms.
 */
export interface PlatformBuilder {
  /**
   * Get the platform this builder targets
   */
  readonly platform: Platform;
  
  /**
   * Build platform-specific package from component definitions
   * 
   * @param components - Component definitions to build
   * @param tokens - Platform-specific tokens
   * @param config - Build configuration
   * @returns Promise resolving to build result
   */
  build(
    components: ComponentDefinition[],
    tokens: PlatformTokens,
    config: BuildConfig
  ): Promise<BuildResult>;
  
  /**
   * Validate platform-specific implementation
   * 
   * @param implementation - Platform implementation to validate
   * @returns Validation result with errors and warnings
   */
  validate(implementation: unknown): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
  
  /**
   * Generate platform-specific tokens
   * 
   * @param tokens - Platform tokens to generate
   * @returns Generated token file content
   */
  generateTokens(tokens: PlatformTokens): string;
  
  /**
   * Clean build artifacts
   * 
   * @param outputDir - Output directory to clean
   * @returns Promise resolving when cleanup is complete
   */
  clean(outputDir: string): Promise<void>;
}

