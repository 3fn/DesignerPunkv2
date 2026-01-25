/**
 * iOS Shadow Generator
 * 
 * Translates shadow tokens to iOS Swift shadow properties.
 * Generates Swift code for shadowOffset, shadowRadius, shadowOpacity, and shadowColor.
 * 
 * Note: iOS does not support shadow spread property.
 * 
 * Requirements: 6.2, 6.5
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
 * Shadow Swift value structure
 */
export interface ShadowSwiftValue {
  /** Swift shadowOffset value (CGSize) */
  shadowOffset: string;
  
  /** Swift shadowRadius value (CGFloat) */
  shadowRadius: string;
  
  /** Swift shadowOpacity value (Float) */
  shadowOpacity: string;
  
  /** Swift shadowColor value (UIColor) */
  shadowColor: string;
  
  /** Individual shadow properties */
  properties: {
    offsetX: number;
    offsetY: number;
    blur: number;
    opacity: number;
    color: string;
  };
}

/**
 * iOS Shadow Generator
 * 
 * Translates shadow semantic tokens to iOS Swift shadow properties.
 * Resolves primitive token references and generates Swift code.
 * 
 * Note: iOS does not support shadow spread. The spread property is omitted
 * from shadow composition to maintain cross-platform consistency.
 */
export class IOSShadowGenerator {
  /**
   * Generate Swift shadow properties from shadow token name
   * 
   * @param shadowTokenName - Semantic shadow token name (e.g., 'shadow.container')
   * @returns Shadow Swift value structure or null if token not found
   */
  generateShadowSwiftValue(shadowTokenName: string): ShadowSwiftValue | null {
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
    
    // Get iOS platform values
    const offsetXValue = typeof offsetXToken.platforms.ios.value === 'number' 
      ? offsetXToken.platforms.ios.value 
      : Number(offsetXToken.platforms.ios.value);
    const offsetYValue = typeof offsetYToken.platforms.ios.value === 'number'
      ? offsetYToken.platforms.ios.value
      : Number(offsetYToken.platforms.ios.value);
    const blurValue = typeof blurToken.platforms.ios.value === 'number'
      ? blurToken.platforms.ios.value
      : Number(blurToken.platforms.ios.value);
    const opacityValue = opacityToken.baseValue;
    const colorValue = this.extractColorValue(colorToken.platforms.ios.value);
    
    // Generate Swift shadow properties
    // shadowOffset: CGSize(width: x, height: y)
    const shadowOffset = `CGSize(width: ${offsetXValue}, height: ${offsetYValue})`;
    
    // shadowRadius: CGFloat (blur / 2 for iOS)
    // iOS shadowRadius is half the blur value to match visual appearance
    const shadowRadius = `${blurValue / 2}`;
    
    // shadowOpacity: Float
    const shadowOpacity = `${opacityValue}`;
    
    // shadowColor: UIColor
    const shadowColor = this.generateUIColor(colorValue, opacityValue);
    
    return {
      shadowOffset,
      shadowRadius,
      shadowOpacity,
      shadowColor,
      properties: {
        offsetX: offsetXValue,
        offsetY: offsetYValue,
        blur: blurValue,
        opacity: opacityValue,
        color: colorValue
      }
    };
  }
  
  /**
   * Generate Swift extension code for all shadow tokens
   * 
   * @returns Swift code string with shadow token extensions
   */
  generateSwiftExtension(): string {
    const lines: string[] = [];
    
    lines.push('/**');
    lines.push(' * Shadow Token Swift Extensions');
    lines.push(' * DesignerPunk Design System');
    lines.push(' *');
    lines.push(' * Auto-generated shadow tokens for iOS');
    lines.push(' * DO NOT EDIT - Generated from Shadow Token System');
    lines.push(' *');
    lines.push(' * Note: iOS does not support shadow spread property.');
    lines.push(' * Shadow spread is omitted to maintain cross-platform consistency.');
    lines.push(' */');
    lines.push('');
    lines.push('import UIKit');
    lines.push('');
    lines.push('extension CALayer {');
    lines.push('  /// Apply shadow token to layer');
    lines.push('  func applyShadow(_ shadow: ShadowToken) {');
    lines.push('    self.shadowOffset = shadow.offset');
    lines.push('    self.shadowRadius = shadow.radius');
    lines.push('    self.shadowOpacity = shadow.opacity');
    lines.push('    self.shadowColor = shadow.color.cgColor');
    lines.push('  }');
    lines.push('}');
    lines.push('');
    lines.push('/// Shadow token structure');
    lines.push('struct ShadowToken {');
    lines.push('  let offset: CGSize');
    lines.push('  let radius: CGFloat');
    lines.push('  let opacity: Float');
    lines.push('  let color: UIColor');
    lines.push('}');
    lines.push('');
    lines.push('/// Shadow tokens');
    lines.push('enum ShadowTokens {');
    
    const shadowTokens = getAllShadowTokens();
    
    for (const shadowToken of shadowTokens) {
      const swiftValue = this.generateShadowSwiftValue(shadowToken.name);
      
      if (swiftValue) {
        const tokenName = this.toSwiftTokenName(shadowToken.name);
        
        lines.push('  ');
        lines.push(`  /// ${shadowToken.description}`);
        lines.push(`  static let ${tokenName} = ShadowToken(`);
        lines.push(`    offset: ${swiftValue.shadowOffset},`);
        lines.push(`    radius: ${swiftValue.shadowRadius},`);
        lines.push(`    opacity: ${swiftValue.shadowOpacity},`);
        lines.push(`    color: ${swiftValue.shadowColor}`);
        lines.push('  )');
      }
    }
    
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
   * 
   * Shadow tokens now reference primitive colors directly (e.g., 'shadowBlack100')
   * rather than semantic colors (e.g., 'color.shadow.default').
   */
  private resolveColorToken(tokenName: string): PrimitiveToken | null {
    // Direct primitive color lookup
    const token = (colorTokens as Record<string, PrimitiveToken>)[tokenName];
    
    if (token) {
      return token;
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
   * Generate UIColor Swift code from color value
   * 
   * @param colorValue - Color value (rgba string, rgb string, hex, or UIColor code)
   * @param opacity - Opacity value (0-1)
   * @returns Swift UIColor code
   */
  private generateUIColor(colorValue: string, opacity: number): string {
    // If it's already UIColor code, return it
    if (colorValue.startsWith('UIColor')) {
      return colorValue;
    }
    
    // Handle rgba() format (Spec 052: RGBA Migration)
    if (colorValue.startsWith('rgba(')) {
      const rgbaValues = colorValue.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      
      if (rgbaValues) {
        const [, r, g, b, a] = rgbaValues;
        const rNorm = parseInt(r) / 255;
        const gNorm = parseInt(g) / 255;
        const bNorm = parseInt(b) / 255;
        const alpha = parseFloat(a);
        
        return `UIColor(red: ${rNorm.toFixed(3)}, green: ${gNorm.toFixed(3)}, blue: ${bNorm.toFixed(3)}, alpha: ${alpha.toFixed(1)})`;
      }
    }
    
    // Handle rgb() format
    if (colorValue.startsWith('rgb(')) {
      const rgbValues = colorValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      
      if (rgbValues) {
        const [, r, g, b] = rgbValues;
        const rNorm = parseInt(r) / 255;
        const gNorm = parseInt(g) / 255;
        const bNorm = parseInt(b) / 255;
        
        return `UIColor(red: ${rNorm.toFixed(3)}, green: ${gNorm.toFixed(3)}, blue: ${bNorm.toFixed(3)}, alpha: 1.0)`;
      }
    }
    
    // Handle hex format
    if (colorValue.startsWith('#')) {
      const hex = colorValue.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      
      return `UIColor(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)}, alpha: 1.0)`;
    }
    
    // Fallback: return black
    return 'UIColor.black';
  }
  
  /**
   * Convert token name to Swift token name
   * Example: shadow.container -> container
   */
  private toSwiftTokenName(name: string): string {
    // Remove 'shadow.' prefix and convert to camelCase
    return name
      .replace('shadow.', '')
      .replace(/\./g, '_')
      .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  }
}
