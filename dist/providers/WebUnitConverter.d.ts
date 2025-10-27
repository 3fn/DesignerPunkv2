import { PrimitiveToken, PlatformValues } from '../types';
import { BaseUnitProvider, UnitConversionConfig } from './UnitProvider';
/**
 * Web-specific unit converter
 * Converts unitless token values to web-appropriate units (px, rem, unitless)
 */
export declare class WebUnitConverter extends BaseUnitProvider {
    readonly platform: "web";
    constructor(config?: UnitConversionConfig);
    convertToken(token: PrimitiveToken): PlatformValues['web'];
    convertValue(baseValue: number | string, category: string): PlatformValues['web'];
    getConversionFactor(category: string): number | {
        factor: number;
        unit: string;
    };
    /**
     * Get the base font size used for REM calculations
     */
    getBaseFontSize(): number;
    /**
     * Convert a pixel value to REM
     */
    pxToRem(pixelValue: number): number;
    /**
     * Convert a REM value to pixels
     */
    remToPx(remValue: number): number;
}
//# sourceMappingURL=WebUnitConverter.d.ts.map