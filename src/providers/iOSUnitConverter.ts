import { PrimitiveToken, PlatformValues } from '../types';
import { BaseUnitProvider, UnitConversionConfig } from './UnitProvider';

/**
 * iOS-specific unit converter
 * Converts unitless token values to iOS-appropriate units (points, unitless)
 */
export class iOSUnitConverter extends BaseUnitProvider {
  readonly platform = 'ios' as const;

  constructor(config: UnitConversionConfig = {}) {
    super({
      displayScale: 1.0, // Default @1x scale, can be 2.0 for @2x, 3.0 for @3x
      ...config
    });
  }

  convertToken(token: PrimitiveToken): PlatformValues['ios'] {
    return this.convertValue(token.baseValue, token.category);
  }

  convertValue(baseValue: number, category: string): PlatformValues['ios'] {
    switch (category) {
      case 'spacing':
      case 'radius':
      case 'fontSize':
      case 'tapArea':
        // Convert to points (1:1 ratio for most values)
        // Points are device-independent units in iOS
        return { value: baseValue, unit: 'pt' };
      
      case 'lineHeight':
        // Line height remains unitless for proper UIKit behavior
        return { value: baseValue, unit: 'unitless' };
      
      case 'density':
        // Density is a multiplier, remains unitless
        return { value: baseValue, unit: 'unitless' };
      
      default:
        // Default to points for unknown categories
        return { value: baseValue, unit: 'pt' };
    }
  }

  getConversionFactor(category: string): number | { factor: number; unit: string } {
    switch (category) {
      case 'spacing':
      case 'radius':
      case 'fontSize':
      case 'tapArea':
        return { factor: 1, unit: 'pt' };
      
      case 'lineHeight':
      case 'density':
        return { factor: 1, unit: 'unitless' };
      
      default:
        return { factor: 1, unit: 'pt' };
    }
  }

  /**
   * Get the display scale factor (1.0 for @1x, 2.0 for @2x, 3.0 for @3x)
   */
  getDisplayScale(): number {
    return this.config.displayScale!;
  }

  /**
   * Convert points to pixels for a given display scale
   * This is useful for understanding the actual pixel dimensions
   */
  pointsToPixels(pointValue: number, scale?: number): number {
    const displayScale = scale || this.config.displayScale!;
    return pointValue * displayScale;
  }

  /**
   * Convert pixels to points for a given display scale
   */
  pixelsToPoints(pixelValue: number, scale?: number): number {
    const displayScale = scale || this.config.displayScale!;
    return pixelValue / displayScale;
  }

  /**
   * Handle density considerations for iOS
   * iOS uses display scale rather than density buckets
   */
  applyDensityConsiderations(baseValue: number, category: string): number {
    // For iOS, density is handled through display scale
    // Most values remain 1:1 with points, but can be adjusted for specific needs
    switch (category) {
      case 'tapArea':
        // Tap areas might need slight adjustments for different device sizes
        // but generally remain consistent in points
        return baseValue;
      
      default:
        return baseValue;
    }
  }
}