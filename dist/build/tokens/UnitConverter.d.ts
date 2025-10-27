/**
 * Cross-Platform Unit Converter
 *
 * Converts F1 unitless baseValues to platform-specific units:
 * - iOS: pt (points)
 * - Android: dp (density-independent pixels) / sp (scalable pixels)
 * - Web: px (pixels) / rem (root em)
 *
 * Mathematical consistency is maintained across all platforms.
 */
import { Platform } from '../types/Platform';
import { TokenCategory } from './PlatformTokens';
/**
 * Platform-specific unit types
 */
export type iOSUnit = 'pt';
export type AndroidUnit = 'dp' | 'sp';
export type WebUnit = 'px' | 'rem';
export type PlatformUnit = iOSUnit | AndroidUnit | WebUnit;
/**
 * Platform-specific value with unit
 */
export interface PlatformValue {
    value: number;
    unit: PlatformUnit;
    token: string;
}
/**
 * Conversion options
 */
export interface ConversionOptions {
    /** Token category (affects unit selection for some platforms) */
    category?: TokenCategory;
    /** Web base font size for rem conversion (default: 16) */
    webBaseFontSize?: number;
    /** Precision for decimal values (default: 2) */
    precision?: number;
}
/**
 * Conversion result with mathematical validation
 */
export interface ConversionResult {
    ios: PlatformValue;
    android: PlatformValue;
    web: PlatformValue;
    mathematicallyConsistent: boolean;
    reasoning: string;
}
/**
 * Unit Converter for cross-platform token values
 */
export declare class UnitConverter {
    private readonly defaultWebBaseFontSize;
    private readonly defaultPrecision;
    /**
     * Convert unitless baseValue to all platform-specific units
     */
    convertToAllPlatforms(baseValue: number, tokenName: string, options?: ConversionOptions): ConversionResult;
    /**
     * Convert to iOS pt units
     *
     * iOS uses points (pt) which are density-independent.
     * Direct 1:1 conversion from baseValue to pt.
     */
    convertToiOS(baseValue: number, tokenName: string, options?: ConversionOptions): PlatformValue;
    /**
     * Convert to Android dp/sp units
     *
     * Android uses:
     * - dp (density-independent pixels) for spacing, sizing
     * - sp (scalable pixels) for typography
     *
     * Direct 1:1 conversion from baseValue to dp/sp.
     */
    convertToAndroid(baseValue: number, tokenName: string, options?: ConversionOptions): PlatformValue;
    /**
     * Convert to Web px/rem units
     *
     * Web uses:
     * - px (pixels) for most values
     * - rem (root em) for typography and responsive spacing
     *
     * Direct 1:1 conversion from baseValue to px.
     * For rem: baseValue / webBaseFontSize (default 16)
     */
    convertToWeb(baseValue: number, tokenName: string, options?: ConversionOptions): PlatformValue;
    /**
     * Validate mathematical consistency across platforms
     *
     * Ensures that the same baseValue produces equivalent visual results
     * across all platforms, accounting for unit differences.
     */
    private validateMathematicalConsistency;
    /**
     * Check if token is typography-related
     */
    private isTypographyToken;
    /**
     * Round value to specified precision
     */
    private roundToPrecision;
    /**
     * Convert single platform value
     */
    convertToPlatform(baseValue: number, tokenName: string, platform: Platform, options?: ConversionOptions): PlatformValue;
}
/**
 * Default unit converter instance
 */
export declare const unitConverter: UnitConverter;
//# sourceMappingURL=UnitConverter.d.ts.map