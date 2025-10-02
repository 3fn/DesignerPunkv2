import { PrimitiveToken, PlatformValues } from '../types';
import { BaseUnitProvider, UnitConversionConfig } from './UnitProvider';

/**
 * Android density buckets and their scale factors
 */
export enum AndroidDensity {
  LDPI = 0.75,    // ~120dpi
  MDPI = 1.0,     // ~160dpi (baseline)
  HDPI = 1.5,     // ~240dpi
  XHDPI = 2.0,    // ~320dpi
  XXHDPI = 3.0,   // ~480dpi
  XXXHDPI = 4.0   // ~640dpi
}

/**
 * Android-specific unit converter
 * Converts unitless token values to Android-appropriate units (dp, sp, unitless)
 */
export class AndroidUnitConverter extends BaseUnitProvider {
  readonly platform = 'android' as const;

  constructor(config: UnitConversionConfig = {}) {
    super({
      densityFactor: AndroidDensity.MDPI, // Default to MDPI (1.0)
      ...config
    });
  }

  convertToken(token: PrimitiveToken): PlatformValues['android'] {
    return this.convertValue(token.baseValue, token.category);
  }

  convertValue(baseValue: number | string, category: string): PlatformValues['android'] {
    switch (category) {
      case 'spacing':
      case 'radius':
      case 'tapArea':
        // Convert to density-independent pixels (dp)
        // dp values remain consistent across different screen densities
        return { value: baseValue as number, unit: 'dp' };
      
      case 'fontSize':
        // Convert to scale-independent pixels (sp) for text
        // sp respects user's font size preferences
        return { value: baseValue as number, unit: 'sp' };

      case 'fontFamily':
        // Font family remains as string for Android
        return { value: baseValue as string, unit: 'fontFamily' };

      case 'fontWeight':
        // Font weight remains as numeric for Android
        return { value: baseValue as number, unit: 'fontWeight' };

      case 'letterSpacing':
        // Letter spacing converted to em units for Android
        return { value: baseValue as number, unit: 'em' };
      
      case 'lineHeight':
        // Line height remains unitless for proper Android behavior
        return { value: baseValue as number, unit: 'unitless' };
      
      case 'density':
        // Density is a multiplier, remains unitless
        return { value: baseValue as number, unit: 'unitless' };
      
      default:
        // Default to dp for unknown categories
        return { value: baseValue as number, unit: 'dp' };
    }
  }

  getConversionFactor(category: string): number | { factor: number; unit: string } {
    switch (category) {
      case 'spacing':
      case 'radius':
      case 'tapArea':
        return { factor: 1, unit: 'dp' };
      
      case 'fontSize':
        return { factor: 1, unit: 'sp' };

      case 'fontFamily':
        return { factor: 1, unit: 'fontFamily' }; // Pass-through for strings

      case 'fontWeight':
        return { factor: 1, unit: 'fontWeight' }; // Pass-through for numeric weights

      case 'letterSpacing':
        return { factor: 1, unit: 'em' }; // 1:1 conversion to em
      
      case 'lineHeight':
      case 'density':
        return { factor: 1, unit: 'unitless' };
      
      default:
        return { factor: 1, unit: 'dp' };
    }
  }

  /**
   * Get the current density factor
   */
  getDensityFactor(): number {
    return this.config.densityFactor!;
  }

  /**
   * Convert dp to pixels for a given density
   */
  dpToPixels(dpValue: number, density?: AndroidDensity): number {
    const densityFactor = density || this.config.densityFactor!;
    return dpValue * densityFactor;
  }

  /**
   * Convert pixels to dp for a given density
   */
  pixelsToDp(pixelValue: number, density?: AndroidDensity): number {
    const densityFactor = density || this.config.densityFactor!;
    return pixelValue / densityFactor;
  }

  /**
   * Convert sp to pixels for a given density
   * Note: sp also considers user font scale preferences
   */
  spToPixels(spValue: number, density?: AndroidDensity, fontScale: number = 1.0): number {
    const densityFactor = density || this.config.densityFactor!;
    return spValue * densityFactor * fontScale;
  }

  /**
   * Handle density bucket considerations
   * Ensures values work well across different Android density buckets
   */
  handleDensityBuckets(baseValue: number, category: string): Record<string, number> {
    const results: Record<string, number> = {};
    
    Object.entries(AndroidDensity).forEach(([key, densityFactor]) => {
      if (typeof densityFactor === 'number') {
        switch (category) {
          case 'spacing':
          case 'radius':
          case 'tapArea':
            // dp values remain consistent across densities
            results[key] = baseValue;
            break;
          
          case 'fontSize':
            // sp values remain consistent across densities
            results[key] = baseValue;
            break;
          
          default:
            results[key] = baseValue;
            break;
        }
      }
    });
    
    return results;
  }

  /**
   * Validate that values work well across density buckets
   */
  validateAcrossDensities(baseValue: number, category: string): boolean {
    const densityResults = this.handleDensityBuckets(baseValue, category);
    
    // Ensure all density results are positive and reasonable
    return Object.values(densityResults).every(value => 
      value > 0 && value < 1000 // Reasonable upper bound
    );
  }
}