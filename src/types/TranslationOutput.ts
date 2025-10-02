/**
 * Translation Output Interfaces
 * 
 * Defines the output models for Translation Provider services that convert
 * tokens to platform-specific formats while maintaining mathematical consistency.
 */

import type { PlatformValues } from './PrimitiveToken.js';

/**
 * Supported target platforms for token translation
 */
export type TargetPlatform = 'web' | 'ios' | 'android';

/**
 * Supported output formats for platform-specific files
 */
export type OutputFormat = 'javascript' | 'swift' | 'kotlin' | 'xml' | 'css';

/**
 * Translation output result for a specific platform
 */
export interface TranslationOutput {
  /** Target platform for this translation */
  platform: TargetPlatform;
  
  /** Generated file path for platform-specific output */
  filePath: string;
  
  /** Generated file content in platform-appropriate format */
  content: string;
  
  /** Output format used for generation */
  format: OutputFormat;
  
  /** Number of tokens included in the output */
  tokenCount: number;
  
  /** Validation status of the generated output */
  validationStatus: 'valid' | 'invalid';
  
  /** Optional validation errors if status is invalid */
  validationErrors?: string[];
}

/**
 * Unit conversion configuration for platform-specific units
 */
export interface UnitConversionConfig {
  /** Base unit value before conversion */
  baseValue: number;
  
  /** Target platform for conversion */
  targetPlatform: TargetPlatform;
  
  /** Conversion factor or method */
  conversionFactor?: number;
  
  /** Additional platform-specific constraints */
  platformConstraints?: Record<string, any>;
}

/**
 * Format generation configuration for platform-specific syntax
 */
export interface FormatGenerationConfig {
  /** Target platform for format generation */
  targetPlatform: TargetPlatform;
  
  /** Naming convention rules for the platform */
  namingConventions: Record<string, string>;
  
  /** Syntax templates for token generation */
  syntaxTemplates: Record<string, string>;
  
  /** File organization preferences */
  fileOrganization: {
    directory: string;
    filename: string;
    extension: string;
  };
}

/**
 * Path organization configuration for platform-specific file structures
 */
export interface PathOrganizationConfig {
  /** Target platform for path organization */
  targetPlatform: TargetPlatform;
  
  /** Base directory for token files */
  baseDirectory: string;
  
  /** Subdirectory structure preferences */
  subdirectoryStructure: string[];
  
  /** File naming patterns */
  fileNamingPattern: string;
  
  /** Integration requirements for build systems */
  buildSystemIntegration: Record<string, any>;
}

// Re-export PlatformValues for convenience
export type { PlatformValues } from './PrimitiveToken.js';