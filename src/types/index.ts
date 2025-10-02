/**
 * Mathematical Token System - Type Definitions
 * 
 * Barrel export file for all TypeScript interfaces and enums used throughout
 * the Mathematical Token System. Provides a single import point for all types.
 */

// Primitive Token Types
export type { PrimitiveToken, PlatformValues } from './PrimitiveToken';
export { TokenCategory } from './PrimitiveToken';

// Semantic Token Types  
export type { SemanticToken } from './SemanticToken';
export { SemanticCategory } from './SemanticToken';

// Validation Result Types
export type { 
  ValidationResult, 
  UsagePatternResult, 
  ConsistencyValidationResult,
  ValidationLevel 
} from './ValidationResult';

// Translation Output Types
export type { 
  TranslationOutput,
  UnitConversionConfig,
  FormatGenerationConfig, 
  PathOrganizationConfig,
  TargetPlatform,
  OutputFormat
} from './TranslationOutput';