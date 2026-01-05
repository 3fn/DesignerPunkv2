/**
 * Token Integration Layer Exports
 * 
 * Exports all token integration components for F2 build system
 */

// Core interfaces
export type { Platform, PlatformValue } from './types';
export type { TokenIntegrator, TokenRequest, ComponentTokenSpec } from './TokenIntegrator';
export type { TokenSelection, TokenSelectionOptions, TokenPriority, TokenSelectionValidator, TokenSelectionValidationResult } from './TokenSelection';
export type { 
  ComponentToken, 
  ComponentTokenGenerator as IComponentTokenGenerator, 
  ComponentTokenSpec as IComponentTokenSpec, 
  ComponentTokenValidationResult, 
  PromotionRecommendation 
} from './ComponentToken';
export type { PlatformTokens, TokenCategory } from './PlatformTokens';
export type { 
  ConversionResult, 
  ConversionOptions,
  iOSUnit,
  AndroidUnit,
  WebUnit,
  PlatformUnit
} from './UnitConverter';

// Component Token Definition API (new hybrid approach)
export type {
  PrimitiveTokenReference,
  TokenWithReference,
  TokenWithValue,
  TokenDefinition,
  ComponentTokenConfig,
  RegisteredComponentToken,
  ComponentTokenValues,
} from './defineComponentTokens';
export { defineComponentTokens } from './defineComponentTokens';

// Implementations
export { TokenIntegratorImpl } from './TokenIntegrator';
export { TokenSelector } from './TokenSelector';
export { ComponentTokenGenerator } from './ComponentTokenGenerator';
export { UnitConverter, unitConverter } from './UnitConverter';
