/**
 * Android Shadow Generator
 * 
 * Translates shadow tokens to Android Kotlin elevation values.
 * Generates Kotlin code for Material Design elevation.
 * 
 * Note: Android uses elevation (dp) for shadows, which is an approximation
 * of the shadow system. For precise shadow control, custom drawable generation
 * would be required (future enhancement).
 * 
 * Requirements: 6.3, 6.4
 */

import { getAllShadowTokens } from '../../tokens/semantic/ShadowTokens';
import { 
  shadowOffsetX, 
  shadowOffsetY 
} from '../../tokens/ShadowOffsetTokens';
import { shadowBlur } from '../../tokens/ShadowBlurTokens';
import { shadowOpacityTokens } from '../../tokens/ShadowOpacityTokens';
import { colorTokens } from '../../tokens/ColorTokens';
import { PrimitiveToken } from '../../types/PrimitiveToken';

/**
 * Shadow Kotlin value structure
 */
export interface ShadowKotlinValue {
  /** Android elevation value (dp) */
  elevation: string;
  
  /** Elevation approximation strategy used */
  strategy: 'blur-based' | 'offset-based' | 'combined';
  
  /** Individual shadow properties (for documentation) */
  properties: {
    offsetX: number;
    offsetY: number;
    blur: number;
    opacity: number;
    color: string;
  };
  
  /** Limitations note */
  limitations: string[];
}

/**
 * Android Shadow Generator
 * 
 * Translates shadow semantic tokens to Android elevation values.
 * Uses approximation strategy to convert shadow properties to Material elevation.
 * 
 * Android Limitations:
 * - Elevation is a single dp value, not separate offset/blur/opacity
 * - Shadow direction is fixed (light source from top)
 * - Shadow color is system-controlled (cannot be customized in standard elevation)
 * - Spread is not supported
 * 
 * Approximation Strategy:
 * - Primary: Use blur value as elevation approximation (blur ≈ elevation)
 * - Secondary: Consider offsetY for depth adjustment
 * - Ignore: offsetX (directional shadows not supported), opacity, color
 */
export class AndroidShadowGenerator {
  /**
   * Generate Android elevation value from shadow token name
   * 
   * @param shadowTokenName - Semantic shadow token name (e.g., 'shadow.container')
   * @returns Shadow Kotlin value structure or null if token not found
   */
  generateShadowKotlinValue(shadowTokenName: string): ShadowKotlinValue | null {
    const shadowToken = getAllShadowTokens().find(t => t.name === shadowTokenName);
    
    if (!shadowToken || !shadowToken.primitiveReferences) {
      return null;
    }
    
    const { offsetX, offsetY, blur, opacity, color } = shadowToken.primitiveReferences;
    
    // Resolve primitive tokens
    const offsetXToken = this.resolvePrimitiveToken(offsetX, shadowOffsetX);
    const offsetYToken = this.resolvePrimitiveToken(offsetY, shadowOffsetY);
    const blurToken = this.resolvePrimitiveToken(blur, shadowBlur);
    const opacityToken = this.resolvePrimitiveToken(opacity, shadowOpacityTokens);
    const colorToken = this.resolveColorToken(color);
    
    if (!offsetXToken || !offsetYToken || !blurToken || !opacityToken || !colorToken) {
      return null;
    }
    
    // Get Android platform values
    const offsetXValue = typeof offsetXToken.platforms.android.value === 'number' 
      ? offsetXToken.platforms.android.value 
      : Number(offsetXToken.platforms.android.value);
    const offsetYValue = typeof offsetYToken.platforms.android.value === 'number'
      ? offsetYToken.platforms.android.value
      : Number(offsetYToken.platforms.android.value);
    const blurValue = typeof blurToken.platforms.android.value === 'number'
      ? blurToken.platforms.android.value
      : Number(blurToken.platforms.android.value);
    const opacityValue = opacityToken.baseValue;
    const colorValue = this.extractColorValue(colorToken.platforms.android.value);
    
    // Calculate elevation using approximation strategy
    const { elevation, strategy } = this.calculateElevation(
      offsetXValue,
      offsetYValue,
      blurValue,
      opacityValue
    );
    
    // Document limitations
    const limitations = this.getElevationLimitations(
      offsetXValue,
      offsetYValue,
      opacityValue,
      colorValue
    );
    
    return {
      elevation: `${elevation}dp`,
      strategy,
      properties: {
        offsetX: offsetXValue,
        offsetY: offsetYValue,
        blur: blurValue,
        opacity: opacityValue,
        color: colorValue
      },
      limitations
    };
  }
  
  /**
   * Calculate elevation from shadow properties
   * 
   * Approximation Strategy:
   * 1. Blur-based: elevation ≈ blur (primary strategy)
   * 2. Offset-based: elevation ≈ offsetY (for shadows with large offsets)
   * 3. Combined: elevation ≈ (blur + offsetY) / 2 (for balanced shadows)
   * 
   * @returns Elevation value (dp) and strategy used
   */
  private calculateElevation(
    offsetX: number,
    offsetY: number,
    blur: number,
    opacity: number
  ): { elevation: number; strategy: 'blur-based' | 'offset-based' | 'combined' } {
    // Strategy 1: Blur-based (most common)
    // For shadows with moderate blur and small offsets
    if (Math.abs(offsetY) <= blur) {
      return {
        elevation: blur,
        strategy: 'blur-based'
      };
    }
    
    // Strategy 2: Offset-based
    // For shadows with large offsets relative to blur
    if (Math.abs(offsetY) > blur * 1.5) {
      return {
        elevation: Math.abs(offsetY),
        strategy: 'offset-based'
      };
    }
    
    // Strategy 3: Combined
    // For shadows with balanced blur and offset
    return {
      elevation: Math.round((blur + Math.abs(offsetY)) / 2),
      strategy: 'combined'
    };
  }
  
  /**
   * Get elevation limitations for this shadow
   * 
   * Documents what shadow properties cannot be represented in Android elevation
   */
  private getElevationLimitations(
    offsetX: number,
    offsetY: number,
    opacity: number,
    color: string
  ): string[] {
    const limitations: string[] = [];
    
    // Check for directional shadows (offsetX != 0)
    if (offsetX !== 0) {
      limitations.push(
        `Directional shadow (offsetX: ${offsetX}dp) not supported - Android elevation uses fixed light source from top`
      );
    }
    
    // Check for custom opacity
    if (opacity !== 0.3) {
      limitations.push(
        `Custom opacity (${opacity}) not supported - Android elevation uses system-controlled opacity`
      );
    }
    
    // Check for custom color
    if (!color.includes('0, 0, 0')) {
      limitations.push(
        `Custom shadow color not supported - Android elevation uses system-controlled shadow color`
      );
    }
    
    // Always note spread limitation
    limitations.push(
      'Shadow spread not supported - omitted for cross-platform consistency'
    );
    
    return limitations;
  }
  
  /**
   * Generate Kotlin code for all shadow tokens
   * 
   * @returns Kotlin code string with shadow token definitions
   */
  generateKotlinCode(): string {
    const lines: string[] = [];
    
    lines.push('/**');
    lines.push(' * Shadow Token Kotlin Definitions');
    lines.push(' * DesignerPunk Design System');
    lines.push(' *');
    lines.push(' * Auto-generated shadow tokens for Android');
    lines.push(' * DO NOT EDIT - Generated from Shadow Token System');
    lines.push(' *');
    lines.push(' * Android Limitations:');
    lines.push(' * - Elevation is an approximation of shadow properties');
    lines.push(' * - Shadow direction is fixed (light source from top)');
    lines.push(' * - Shadow color is system-controlled');
    lines.push(' * - Directional shadows (offsetX) not supported');
    lines.push(' * - Custom opacity not supported');
    lines.push(' * - Shadow spread not supported');
    lines.push(' *');
    lines.push(' * For precise shadow control, custom drawable generation would be required.');
    lines.push(' */');
    lines.push('');
    lines.push('package com.designerpunk.tokens');
    lines.push('');
    lines.push('import androidx.compose.ui.unit.dp');
    lines.push('');
    lines.push('/**');
    lines.push(' * Shadow token data class');
    lines.push(' */');
    lines.push('data class ShadowToken(');
    lines.push('    val elevation: androidx.compose.ui.unit.Dp,');
    lines.push('    val strategy: String,');
    lines.push('    val limitations: List<String>');
    lines.push(')');
    lines.push('');
    lines.push('/**');
    lines.push(' * Shadow tokens');
    lines.push(' */');
    lines.push('object ShadowTokens {');
    
    const shadowTokens = getAllShadowTokens();
    
    for (const shadowToken of shadowTokens) {
      const kotlinValue = this.generateShadowKotlinValue(shadowToken.name);
      
      if (kotlinValue) {
        const tokenName = this.toKotlinTokenName(shadowToken.name);
        const elevationValue = kotlinValue.elevation.replace('dp', '');
        
        lines.push('    ');
        lines.push(`    /**`);
        lines.push(`     * ${shadowToken.description}`);
        lines.push(`     * `);
        lines.push(`     * Approximation Strategy: ${kotlinValue.strategy}`);
        lines.push(`     * Original Properties:`);
        lines.push(`     * - offsetX: ${kotlinValue.properties.offsetX}dp`);
        lines.push(`     * - offsetY: ${kotlinValue.properties.offsetY}dp`);
        lines.push(`     * - blur: ${kotlinValue.properties.blur}dp`);
        lines.push(`     * - opacity: ${kotlinValue.properties.opacity}`);
        
        if (kotlinValue.limitations.length > 0) {
          lines.push(`     * `);
          lines.push(`     * Limitations:`);
          kotlinValue.limitations.forEach(limitation => {
            lines.push(`     * - ${limitation}`);
          });
        }
        
        lines.push(`     */`);
        lines.push(`    val ${tokenName} = ShadowToken(`);
        lines.push(`        elevation = ${elevationValue}.dp,`);
        lines.push(`        strategy = "${kotlinValue.strategy}",`);
        lines.push(`        limitations = listOf(`);
        
        kotlinValue.limitations.forEach((limitation, index) => {
          const comma = index < kotlinValue.limitations.length - 1 ? ',' : '';
          lines.push(`            "${limitation}"${comma}`);
        });
        
        lines.push(`        )`);
        lines.push(`    )`);
      }
    }
    
    lines.push('}');
    lines.push('');
    lines.push('/**');
    lines.push(' * Extension function to apply shadow token to Modifier');
    lines.push(' */');
    lines.push('fun androidx.compose.ui.Modifier.shadow(shadow: ShadowToken): androidx.compose.ui.Modifier {');
    lines.push('    return this.shadow(elevation = shadow.elevation)');
    lines.push('}');
    lines.push('');
    
    return lines.join('\n');
  }
  
  /**
   * Resolve primitive token from token registry
   */
  private resolvePrimitiveToken(
    tokenName: string, 
    tokenRegistry: Record<string, PrimitiveToken>
  ): PrimitiveToken | null {
    // Handle dot notation (e.g., 'shadowOffsetX.000')
    const tokenKey = tokenName.includes('.') ? tokenName.split('.')[1] : tokenName;
    
    // Try direct lookup first
    if (tokenRegistry[tokenKey]) {
      return tokenRegistry[tokenKey];
    }
    
    // Try full name lookup
    if (tokenRegistry[tokenName]) {
      return tokenRegistry[tokenName];
    }
    
    return null;
  }
  
  /**
   * Resolve color token from color token registry
   */
  private resolveColorToken(tokenName: string): PrimitiveToken | null {
    // Handle semantic color references (e.g., 'color.shadow.default')
    // Map semantic shadow colors to primitive shadow colors
    const semanticToPrimitive: Record<string, string> = {
      'color.shadow.default': 'shadowBlack100',
      'color.shadow.warm': 'shadowBlue100',
      'color.shadow.cool': 'shadowOrange100',
      'color.shadow.ambient': 'shadowGray100'
    };
    
    const primitiveColorName = semanticToPrimitive[tokenName];
    
    if (primitiveColorName) {
      // Use type assertion to access dynamic property
      const token = (colorTokens as Record<string, PrimitiveToken>)[primitiveColorName];
      if (token) {
        return token;
      }
    }
    
    return null;
  }
  
  /**
   * Extract color string value from ColorTokenValue or string
   */
  private extractColorValue(value: string | number | import('../../types/PrimitiveToken').ColorTokenValue): string {
    // If it's already a string, return it
    if (typeof value === 'string') {
      return value;
    }
    
    // If it's a number, convert to string (shouldn't happen for colors)
    if (typeof value === 'number') {
      return String(value);
    }
    
    // If it's a ColorTokenValue object, extract the light mode base value
    // Shadow colors are mode-agnostic, so light.base === dark.base
    if (typeof value === 'object' && 'light' in value) {
      return value.light.base;
    }
    
    // Fallback
    return String(value);
  }
  
  /**
   * Convert token name to Kotlin token name
   * Example: shadow.container -> container
   */
  private toKotlinTokenName(name: string): string {
    // Remove 'shadow.' prefix and convert to camelCase
    return name
      .replace('shadow.', '')
      .replace(/\./g, '_')
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }
}
