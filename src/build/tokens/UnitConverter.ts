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
export class UnitConverter {
  private readonly defaultWebBaseFontSize = 16;
  private readonly defaultPrecision = 2;

  /**
   * Convert unitless baseValue to all platform-specific units
   */
  convertToAllPlatforms(
    baseValue: number,
    tokenName: string,
    options: ConversionOptions = {}
  ): ConversionResult {
    const ios = this.convertToiOS(baseValue, tokenName, options);
    const android = this.convertToAndroid(baseValue, tokenName, options);
    const web = this.convertToWeb(baseValue, tokenName, options);

    const validation = this.validateMathematicalConsistency(
      baseValue,
      ios,
      android,
      web,
      options
    );

    return {
      ios,
      android,
      web,
      mathematicallyConsistent: validation.consistent,
      reasoning: validation.reasoning,
    };
  }

  /**
   * Convert to iOS pt units
   * 
   * iOS uses points (pt) which are density-independent.
   * Direct 1:1 conversion from baseValue to pt.
   */
  convertToiOS(
    baseValue: number,
    tokenName: string,
    options: ConversionOptions = {}
  ): PlatformValue {
    const precision = options.precision ?? this.defaultPrecision;
    const value = this.roundToPrecision(baseValue, precision);

    return {
      value,
      unit: 'pt',
      token: tokenName,
    };
  }

  /**
   * Convert to Android dp/sp units
   * 
   * Android uses:
   * - dp (density-independent pixels) for spacing, sizing
   * - sp (scalable pixels) for typography
   * 
   * Direct 1:1 conversion from baseValue to dp/sp.
   */
  convertToAndroid(
    baseValue: number,
    tokenName: string,
    options: ConversionOptions = {}
  ): PlatformValue {
    const precision = options.precision ?? this.defaultPrecision;
    const value = this.roundToPrecision(baseValue, precision);

    // Use sp for typography tokens, dp for everything else
    const unit: AndroidUnit = this.isTypographyToken(tokenName, options.category)
      ? 'sp'
      : 'dp';

    return {
      value,
      unit,
      token: tokenName,
    };
  }

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
  convertToWeb(
    baseValue: number,
    tokenName: string,
    options: ConversionOptions = {}
  ): PlatformValue {
    const precision = options.precision ?? this.defaultPrecision;
    const webBaseFontSize = options.webBaseFontSize ?? this.defaultWebBaseFontSize;

    // Use rem for typography tokens, px for everything else
    const useRem = this.isTypographyToken(tokenName, options.category);

    if (useRem) {
      const remValue = baseValue / webBaseFontSize;
      return {
        value: this.roundToPrecision(remValue, precision),
        unit: 'rem',
        token: tokenName,
      };
    }

    return {
      value: this.roundToPrecision(baseValue, precision),
      unit: 'px',
      token: tokenName,
    };
  }

  /**
   * Validate mathematical consistency across platforms
   * 
   * Ensures that the same baseValue produces equivalent visual results
   * across all platforms, accounting for unit differences.
   */
  private validateMathematicalConsistency(
    baseValue: number,
    ios: PlatformValue,
    android: PlatformValue,
    web: PlatformValue,
    options: ConversionOptions
  ): { consistent: boolean; reasoning: string } {
    const webBaseFontSize = options.webBaseFontSize ?? this.defaultWebBaseFontSize;

    // iOS pt and Android dp should match baseValue exactly
    const iosConsistent = ios.value === baseValue;
    const androidConsistent = android.value === baseValue;

    // Web px should match baseValue, or rem should match baseValue/webBaseFontSize
    let webConsistent = false;
    if (web.unit === 'px') {
      webConsistent = web.value === baseValue;
    } else if (web.unit === 'rem') {
      const expectedRem = baseValue / webBaseFontSize;
      webConsistent = Math.abs(web.value - expectedRem) < 0.001;
    }

    const allConsistent = iosConsistent && androidConsistent && webConsistent;

    if (allConsistent) {
      return {
        consistent: true,
        reasoning: `All platforms maintain mathematical consistency: baseValue ${baseValue} → iOS ${ios.value}${ios.unit}, Android ${android.value}${android.unit}, Web ${web.value}${web.unit}`,
      };
    }

    // Build detailed reasoning for inconsistencies
    const issues: string[] = [];
    if (!iosConsistent) {
      issues.push(`iOS: expected ${baseValue}pt, got ${ios.value}pt`);
    }
    if (!androidConsistent) {
      issues.push(`Android: expected ${baseValue}${android.unit}, got ${android.value}${android.unit}`);
    }
    if (!webConsistent) {
      if (web.unit === 'rem') {
        const expectedRem = baseValue / webBaseFontSize;
        issues.push(`Web: expected ${expectedRem}rem, got ${web.value}rem`);
      } else {
        issues.push(`Web: expected ${baseValue}px, got ${web.value}px`);
      }
    }

    return {
      consistent: false,
      reasoning: `Mathematical inconsistency detected: ${issues.join('; ')}`,
    };
  }

  /**
   * Check if token is typography-related
   */
  private isTypographyToken(tokenName: string, category?: TokenCategory): boolean {
    if (category === 'typography') {
      return true;
    }

    // Check token name patterns
    const typographyPatterns = [
      /font/i,
      /text/i,
      /typography/i,
      /lineHeight/i,
      /letterSpacing/i,
    ];

    return typographyPatterns.some(pattern => pattern.test(tokenName));
  }

  /**
   * Round value to specified precision
   */
  private roundToPrecision(value: number, precision: number): number {
    const multiplier = Math.pow(10, precision);
    return Math.round(value * multiplier) / multiplier;
  }

  /**
   * Convert single platform value
   */
  convertToPlatform(
    baseValue: number,
    tokenName: string,
    platform: Platform,
    options: ConversionOptions = {}
  ): PlatformValue {
    switch (platform) {
      case 'ios':
        return this.convertToiOS(baseValue, tokenName, options);
      case 'android':
        return this.convertToAndroid(baseValue, tokenName, options);
      case 'web':
        return this.convertToWeb(baseValue, tokenName, options);
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }
  }
}

/**
 * Default unit converter instance
 */
export const unitConverter = new UnitConverter();
