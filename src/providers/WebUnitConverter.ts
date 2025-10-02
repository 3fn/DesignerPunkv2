import { PrimitiveToken, PlatformValues } from '../types';
import { BaseUnitProvider, UnitConversionConfig } from './UnitProvider';

/**
 * Web-specific unit converter
 * Converts unitless token values to web-appropriate units (px, rem, unitless)
 */
export class WebUnitConverter extends BaseUnitProvider {
  readonly platform = 'web' as const;

  constructor(config: UnitConversionConfig = {}) {
    super({
      baseFontSize: 16, // Default browser base font size
      ...config
    });
  }

  convertToken(token: PrimitiveToken): PlatformValues['web'] {
    return this.convertValue(token.baseValue, token.category);
  }

  convertValue(baseValue: number, category: string): PlatformValues['web'] {
    switch (category) {
      case 'spacing':
      case 'radius':
      case 'tapArea':
        // Convert to pixels (1:1 ratio for spacing, radius, and tap areas)
        return { value: baseValue, unit: 'px' };
      
      case 'fontSize':
        // Convert to REM by dividing by base font size
        return { 
          value: Math.round((baseValue / this.config.baseFontSize!) * 1000) / 1000, // Round to 3 decimal places
          unit: 'rem' 
        };
      
      case 'lineHeight':
        // Line height remains unitless for proper CSS behavior
        return { value: baseValue, unit: 'unitless' };
      
      case 'density':
        // Density is a multiplier, remains unitless
        return { value: baseValue, unit: 'unitless' };
      
      default:
        // Default to pixels for unknown categories
        return { value: baseValue, unit: 'px' };
    }
  }

  getConversionFactor(category: string): number | { factor: number; unit: string } {
    switch (category) {
      case 'spacing':
      case 'radius':
      case 'tapArea':
        return { factor: 1, unit: 'px' };
      
      case 'fontSize':
        return { factor: 1 / this.config.baseFontSize!, unit: 'rem' };
      
      case 'lineHeight':
      case 'density':
        return { factor: 1, unit: 'unitless' };
      
      default:
        return { factor: 1, unit: 'px' };
    }
  }

  /**
   * Get the base font size used for REM calculations
   */
  getBaseFontSize(): number {
    return this.config.baseFontSize!;
  }

  /**
   * Convert a pixel value to REM
   */
  pxToRem(pixelValue: number): number {
    return Math.round((pixelValue / this.config.baseFontSize!) * 1000) / 1000;
  }

  /**
   * Convert a REM value to pixels
   */
  remToPx(remValue: number): number {
    return remValue * this.config.baseFontSize!;
  }
}