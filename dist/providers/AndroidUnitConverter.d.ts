import { PrimitiveToken, PlatformValues } from '../types';
import { BaseUnitProvider, UnitConversionConfig } from './UnitProvider';
/**
 * Android density buckets and their scale factors
 */
export declare enum AndroidDensity {
    LDPI = 0.75,// ~120dpi
    MDPI = 1,// ~160dpi (baseline)
    HDPI = 1.5,// ~240dpi
    XHDPI = 2,// ~320dpi
    XXHDPI = 3,// ~480dpi
    XXXHDPI = 4
}
/**
 * Android-specific unit converter
 * Converts unitless token values to Android-appropriate units (dp, sp, unitless)
 */
export declare class AndroidUnitConverter extends BaseUnitProvider {
    readonly platform: "android";
    constructor(config?: UnitConversionConfig);
    convertToken(token: PrimitiveToken): PlatformValues['android'];
    convertValue(baseValue: number | string, category: string): PlatformValues['android'];
    getConversionFactor(category: string): number | {
        factor: number;
        unit: string;
    };
    /**
     * Get the current density factor
     */
    getDensityFactor(): number;
    /**
     * Convert dp to pixels for a given density
     */
    dpToPixels(dpValue: number, density?: AndroidDensity): number;
    /**
     * Convert pixels to dp for a given density
     */
    pixelsToDp(pixelValue: number, density?: AndroidDensity): number;
    /**
     * Convert sp to pixels for a given density
     * Note: sp also considers user font scale preferences
     */
    spToPixels(spValue: number, density?: AndroidDensity, fontScale?: number): number;
    /**
     * Handle density bucket considerations
     * Ensures values work well across different Android density buckets
     */
    handleDensityBuckets(baseValue: number, category: string): Record<string, number>;
    /**
     * Validate that values work well across density buckets
     */
    validateAcrossDensities(baseValue: number, category: string): boolean;
}
//# sourceMappingURL=AndroidUnitConverter.d.ts.map