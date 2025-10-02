import { PrimitiveToken, PlatformValues } from '../types';

/**
 * Base interface for unit conversion providers
 * Defines consistent contract for converting unitless token values to platform-specific units
 */
export interface UnitProvider {
  /**
   * Platform identifier for this unit provider
   */
  readonly platform: 'web' | 'ios' | 'android';

  /**
   * Convert a primitive token's base value to platform-specific unit
   * @param token - The primitive token to convert
   * @returns Platform-specific value with unit
   */
  convertToken(token: PrimitiveToken): PlatformValues[keyof PlatformValues];

  /**
   * Convert a raw base value to platform-specific unit for a given token category
   * @param baseValue - The unitless base value to convert (number or string for categorical tokens)
   * @param category - The token category (spacing, fontSize, etc.)
   * @returns Platform-specific value with unit
   */
  convertValue(baseValue: number | string, category: string): PlatformValues[keyof PlatformValues];

  /**
   * Get the conversion factor for a specific token category
   * @param category - The token category
   * @returns Conversion factor or configuration for the category
   */
  getConversionFactor(category: string): number | { factor: number; unit: string };

  /**
   * Validate that the converted value maintains mathematical relationships
   * @param originalValue - Original unitless value (number or string for categorical tokens)
   * @param convertedValue - Converted platform-specific value
   * @param category - Token category
   * @returns True if conversion maintains mathematical relationships
   */
  validateConversion(originalValue: number | string, convertedValue: PlatformValues[keyof PlatformValues], category: string): boolean;
}

/**
 * Configuration interface for unit conversion settings
 */
export interface UnitConversionConfig {
  baseFontSize?: number;
  densityFactor?: number;
  displayScale?: number;
}

/**
 * Abstract base class providing common unit conversion functionality
 */
export abstract class BaseUnitProvider implements UnitProvider {
  abstract readonly platform: 'web' | 'ios' | 'android';
  protected config: UnitConversionConfig;

  constructor(config: UnitConversionConfig = {}) {
    this.config = {
      baseFontSize: 16,
      densityFactor: 1.0,
      displayScale: 1.0,
      ...config
    };
  }

  abstract convertToken(token: PrimitiveToken): PlatformValues[keyof PlatformValues];
  abstract convertValue(baseValue: number | string, category: string): PlatformValues[keyof PlatformValues];
  abstract getConversionFactor(category: string): number | { factor: number; unit: string };

  validateConversion(originalValue: number | string, convertedValue: PlatformValues[keyof PlatformValues], category: string): boolean {
    // For string values (like fontFamily), just ensure they match
    if (typeof originalValue === 'string') {
      return convertedValue.value === originalValue;
    }
    
    // Basic validation - ensure converted numeric value is positive and maintains proportional relationships
    if (typeof convertedValue.value === 'number' && convertedValue.value < 0) return false;
    
    // For unitless values (like lineHeight), the value should remain the same
    if (convertedValue.unit === 'unitless') {
      return Math.abs((convertedValue.value as number) - originalValue) < 0.001;
    }
    
    // For pass-through values (fontFamily, fontWeight, letterSpacing), the value should remain the same
    if (convertedValue.unit === 'fontFamily' || convertedValue.unit === 'fontWeight' || convertedValue.unit === 'em') {
      if (typeof convertedValue.value === 'number' && typeof originalValue === 'number') {
        return Math.abs(convertedValue.value - originalValue) < 0.001;
      }
      return convertedValue.value === originalValue;
    }
    
    // For other units, ensure the conversion factor is applied correctly (originalValue must be numeric here)
    if (typeof originalValue !== 'number') return false;
    
    const conversionFactor = this.getConversionFactor(category);
    const expectedValue = typeof conversionFactor === 'number' 
      ? originalValue * conversionFactor 
      : originalValue * conversionFactor.factor;
    
    return Math.abs((convertedValue.value as number) - expectedValue) < 0.001;
  }
}