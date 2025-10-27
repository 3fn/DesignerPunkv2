/**
 * Platform Tokens Interface
 *
 * Represents platform-specific token values with proper unit conversion.
 * Supports iOS (pt), Android (dp/sp), and Web (px/rem) platforms.
 */
import { Platform, PlatformValue } from './types';
/**
 * Token category types
 */
export type TokenCategory = 'spacing' | 'color' | 'typography' | 'radius' | 'sizing' | 'opacity' | 'elevation' | 'animation';
/**
 * Platform-specific tokens organized by category
 *
 * Contains all tokens (primitive, semantic, component) converted to
 * platform-specific units:
 * - iOS: pt (points)
 * - Android: dp (density-independent pixels) / sp (scale-independent pixels)
 * - Web: px (pixels) / rem (root em)
 */
export interface PlatformTokens {
    /** Target platform */
    platform: Platform;
    /** Primitive token values */
    primitives: PlatformTokenSet;
    /** Semantic token values */
    semantics: PlatformTokenSet;
    /** Component token values */
    components: PlatformTokenSet;
    /** Platform-specific metadata */
    metadata: PlatformMetadata;
}
/**
 * Set of platform-specific token values organized by category
 */
export interface PlatformTokenSet {
    /** Spacing tokens */
    spacing: Record<string, PlatformValue>;
    /** Color tokens */
    colors: Record<string, PlatformValue>;
    /** Typography tokens */
    typography: Record<string, PlatformValue>;
    /** Radius tokens */
    radius: Record<string, PlatformValue>;
    /** Sizing tokens */
    sizing: Record<string, PlatformValue>;
    /** Opacity tokens */
    opacity: Record<string, PlatformValue>;
    /** Elevation tokens */
    elevation: Record<string, PlatformValue>;
    /** Animation tokens */
    animation: Record<string, PlatformValue>;
}
/**
 * Platform-specific metadata
 */
export interface PlatformMetadata {
    /** Platform name */
    platform: Platform;
    /** Default unit for spacing */
    defaultSpacingUnit: string;
    /** Default unit for typography */
    defaultTypographyUnit: string;
    /** Supported units */
    supportedUnits: string[];
    /** Platform-specific constraints */
    constraints: PlatformConstraints;
    /** Generation timestamp */
    generatedAt: Date;
}
/**
 * Platform-specific constraints and capabilities
 */
export interface PlatformConstraints {
    /** Minimum supported value */
    minValue?: number;
    /** Maximum supported value */
    maxValue?: number;
    /** Supported decimal precision */
    decimalPrecision: number;
    /** Whether subpixel values are supported */
    supportsSubpixel: boolean;
    /** Platform-specific rounding rules */
    roundingMode: 'floor' | 'ceil' | 'round' | 'none';
    /** Additional platform-specific constraints */
    custom?: Record<string, unknown>;
}
/**
 * Platform token generator interface
 */
export interface PlatformTokenGenerator {
    /**
     * Generate platform-specific tokens from F1 tokens
     *
     * @param platform - Target platform
     * @returns Platform-specific token values
     */
    generate(platform: Platform): PlatformTokens;
    /**
     * Convert base value to platform-specific value
     *
     * @param baseValue - Unitless base value from F1
     * @param category - Token category
     * @param platform - Target platform
     * @returns Platform-specific value with unit
     */
    convertValue(baseValue: number, category: TokenCategory, platform: Platform): PlatformValue;
    /**
     * Validate platform-specific value meets constraints
     *
     * @param value - Platform value to validate
     * @param platform - Target platform
     * @returns Validation result
     */
    validateValue(value: PlatformValue, platform: Platform): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
}
/**
 * Platform-specific unit conversion rules
 */
export interface UnitConversionRules {
    /** iOS conversion rules (baseValue → pt) */
    ios: {
        spacing: (baseValue: number) => PlatformValue;
        typography: (baseValue: number) => PlatformValue;
        radius: (baseValue: number) => PlatformValue;
    };
    /** Android conversion rules (baseValue → dp/sp) */
    android: {
        spacing: (baseValue: number) => PlatformValue;
        typography: (baseValue: number) => PlatformValue;
        radius: (baseValue: number) => PlatformValue;
    };
    /** Web conversion rules (baseValue → px/rem) */
    web: {
        spacing: (baseValue: number) => PlatformValue;
        typography: (baseValue: number) => PlatformValue;
        radius: (baseValue: number) => PlatformValue;
    };
}
//# sourceMappingURL=PlatformTokens.d.ts.map