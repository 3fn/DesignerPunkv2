import { PrimitiveToken, PlatformValues } from '../types';
import { BaseUnitProvider, UnitConversionConfig } from './UnitProvider';
/**
 * iOS-specific unit converter
 * Converts unitless token values to iOS-appropriate units (points, unitless)
 */
export declare class iOSUnitConverter extends BaseUnitProvider {
    readonly platform: "ios";
    constructor(config?: UnitConversionConfig);
    convertToken(token: PrimitiveToken): PlatformValues['ios'];
    convertValue(baseValue: number | string, category: string): PlatformValues['ios'];
    getConversionFactor(category: string): number | {
        factor: number;
        unit: string;
    };
    /**
     * Get the display scale factor (1.0 for @1x, 2.0 for @2x, 3.0 for @3x)
     */
    getDisplayScale(): number;
    /**
     * Convert points to pixels for a given display scale
     * This is useful for understanding the actual pixel dimensions
     */
    pointsToPixels(pointValue: number, scale?: number): number;
    /**
     * Convert pixels to points for a given display scale
     */
    pixelsToPoints(pixelValue: number, scale?: number): number;
    /**
     * Handle density considerations for iOS
     * iOS uses display scale rather than density buckets
     */
    applyDensityConsiderations(baseValue: number, category: string): number;
}
//# sourceMappingURL=iOSUnitConverter.d.ts.map