/**
 * Primitive Token Interface and Token Category Enum
 * 
 * Defines the foundational token structure for the Mathematical Token System.
 * Primitive tokens represent the base mathematical values with systematic naming
 * that align with the baseline grid or strategic flexibility requirements.
 */

/**
 * Token categories for primitive tokens following mathematical foundation
 */
export enum TokenCategory {
  SPACING = 'spacing',
  SIZING = 'sizing', 
  RADIUS = 'radius'
}

/**
 * Platform-specific values for cross-platform consistency
 */
export interface PlatformValues {
  web: { value: number; unit: 'rem' };
  ios: { value: number; unit: 'pt' };
  android: { value: number; unit: 'dp' };
}

/**
 * Primitive token interface representing foundational mathematical values
 */
export interface PrimitiveToken {
  /** Token name following systematic naming (e.g., "space100", "size275") */
  name: string;
  
  /** Token category for organizational purposes */
  category: TokenCategory;
  
  /** Base mathematical value before platform conversion */
  baseValue: number;
  
  /** Description of mathematical meaning and usage */
  description: string;
  
  /** Mathematical relationship to baseline grid system */
  mathematicalRelationship: string;
  
  /** Whether token aligns with 8-unit baseline grid */
  baselineGridAlignment: boolean;
  
  /** Whether token is a strategic flexibility token (6, 10, 20) */
  isStrategicFlexibility: boolean;
  
  /** Generated platform-specific values maintaining mathematical relationships */
  platforms: PlatformValues;
}