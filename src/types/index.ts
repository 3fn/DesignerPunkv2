/**
 * Mathematical Token System - Type Definitions
 * 
 * Barrel export file for all TypeScript interfaces and enums used throughout
 * the Mathematical Token System. Provides a single import point for all types.
 */

// Primitive Token Types
export type { PrimitiveToken, PlatformValues } from './PrimitiveToken.js';
export { TokenCategory } from './PrimitiveToken.js';

// Semantic Token Types  
export type { SemanticToken } from './SemanticToken.js';
export { SemanticCategory } from './SemanticToken.js';

// Validation Result Types
export type { 
  ValidationResult, 
  UsagePatternResult, 
  ConsistencyValidationResult,
  ValidationLevel 
} from './ValidationResult.js';

// Translation Output Types
export type { 
  TranslationOutput,
  UnitConversionConfig,
  FormatGenerationConfig, 
  PathOrganizationConfig,
  TargetPlatform,
  OutputFormat
} from './TranslationOutput.js';