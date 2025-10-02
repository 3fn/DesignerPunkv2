/**
 * Primitive Token Interface and Token Category Enum
 * 
 * Defines the foundational token structure for the Mathematical Token System.
 * Primitive tokens represent the base mathematical values with systematic naming
 * that align with the baseline grid or strategic flexibility requirements.
 */

/**
 * Token categories for primitive tokens with per-family mathematical foundations
 */
export enum TokenCategory {
  SPACING = 'spacing',
  FONT_SIZE = 'fontSize',
  LINE_HEIGHT = 'lineHeight',
  RADIUS = 'radius',
  DENSITY = 'density',
  TAP_AREA = 'tapArea'
}

/**
 * Platform-specific values for cross-platform consistency with per-family unit application
 */
export interface PlatformValues {
  web: { value: number; unit: 'px' | 'rem' | 'unitless' };
  ios: { value: number; unit: 'pt' | 'unitless' };
  android: { value: number; unit: 'dp' | 'sp' | 'unitless' };
}

/**
 * Primitive token interface representing foundational unitless mathematical values
 */
export interface PrimitiveToken {
  /** Token name following systematic naming (e.g., "space100", "fontSize125", "lineHeight100") */
  name: string;
  
  /** Token category for organizational purposes */
  category: TokenCategory;
  
  /** Unitless base value for this specific token */
  baseValue: number;
  
  /** Base value for the entire token family (e.g., 8 for spacing family) */
  familyBaseValue: number;
  
  /** Description of mathematical meaning and usage */
  description: string;
  
  /** Mathematical relationship to family base value */
  mathematicalRelationship: string;
  
  /** Whether token aligns with 8-unit baseline grid (spacing/radius families) */
  baselineGridAlignment: boolean;
  
  /** Whether token is a strategic flexibility exception within its family */
  isStrategicFlexibility: boolean;
  
  /** Whether token uses precision multipliers for systematic alignment */
  isPrecisionTargeted: boolean;
  
  /** Generated platform-specific values maintaining mathematical relationships */
  platforms: PlatformValues;
}