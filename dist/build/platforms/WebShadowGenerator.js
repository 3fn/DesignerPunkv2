"use strict";
/**
 * Web Shadow Generator
 *
 * Translates shadow tokens to CSS box-shadow format for web platform.
 * Generates CSS custom properties for shadow tokens.
 *
 * Requirements: 6.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebShadowGenerator = void 0;
const ShadowTokens_1 = require("../../tokens/semantic/ShadowTokens");
const ShadowOffsetTokens_1 = require("../../tokens/ShadowOffsetTokens");
const ShadowBlurTokens_1 = require("../../tokens/ShadowBlurTokens");
const ShadowOpacityTokens_1 = require("../../tokens/ShadowOpacityTokens");
const ColorTokens_1 = require("../../tokens/ColorTokens");
/**
 * Web Shadow Generator
 *
 * Translates shadow semantic tokens to CSS box-shadow format.
 * Resolves primitive token references and generates complete CSS values.
 */
class WebShadowGenerator {
    /**
     * Generate CSS box-shadow value from shadow token name
     *
     * @param shadowTokenName - Semantic shadow token name (e.g., 'shadow.container')
     * @returns CSS box-shadow value or null if token not found
     */
    generateBoxShadow(shadowTokenName) {
        const shadowToken = (0, ShadowTokens_1.getAllShadowTokens)().find(t => t.name === shadowTokenName);
        if (!shadowToken || !shadowToken.primitiveReferences) {
            return null;
        }
        const { offsetX, offsetY, blur, opacity, color } = shadowToken.primitiveReferences;
        // Resolve primitive tokens
        const offsetXToken = this.resolvePrimitiveToken(offsetX, ShadowOffsetTokens_1.shadowOffsetX);
        const offsetYToken = this.resolvePrimitiveToken(offsetY, ShadowOffsetTokens_1.shadowOffsetY);
        const blurToken = this.resolvePrimitiveToken(blur, ShadowBlurTokens_1.shadowBlur);
        const opacityToken = this.resolvePrimitiveToken(opacity, ShadowOpacityTokens_1.shadowOpacityTokens);
        const colorToken = this.resolveColorToken(color);
        if (!offsetXToken || !offsetYToken || !blurToken || !opacityToken || !colorToken) {
            return null;
        }
        // Get web platform values
        const offsetXValue = offsetXToken.platforms.web;
        const offsetYValue = offsetYToken.platforms.web;
        const blurValue = blurToken.platforms.web;
        const opacityValue = opacityToken.baseValue;
        const colorValue = this.extractColorValue(colorToken.platforms.web.value);
        // Generate CSS box-shadow value
        // Format: offsetX offsetY blur spread color
        // Note: spread is omitted (0) as it's not supported cross-platform
        const boxShadow = `${offsetXValue.value}${offsetXValue.unit} ${offsetYValue.value}${offsetYValue.unit} ${blurValue.value}${blurValue.unit} ${this.applyOpacityToColor(colorValue, opacityValue)}`;
        return boxShadow;
    }
    /**
     * Generate complete shadow CSS value with custom properties
     *
     * @param shadowTokenName - Semantic shadow token name
     * @returns Shadow CSS value structure or null if token not found
     */
    generateShadowCSSValue(shadowTokenName) {
        const shadowToken = (0, ShadowTokens_1.getAllShadowTokens)().find(t => t.name === shadowTokenName);
        if (!shadowToken || !shadowToken.primitiveReferences) {
            return null;
        }
        const { offsetX, offsetY, blur, opacity, color } = shadowToken.primitiveReferences;
        // Resolve primitive tokens
        const offsetXToken = this.resolvePrimitiveToken(offsetX, ShadowOffsetTokens_1.shadowOffsetX);
        const offsetYToken = this.resolvePrimitiveToken(offsetY, ShadowOffsetTokens_1.shadowOffsetY);
        const blurToken = this.resolvePrimitiveToken(blur, ShadowBlurTokens_1.shadowBlur);
        const opacityToken = this.resolvePrimitiveToken(opacity, ShadowOpacityTokens_1.shadowOpacityTokens);
        const colorToken = this.resolveColorToken(color);
        if (!offsetXToken || !offsetYToken || !blurToken || !opacityToken || !colorToken) {
            return null;
        }
        // Get web platform values
        const offsetXValue = offsetXToken.platforms.web;
        const offsetYValue = offsetYToken.platforms.web;
        const blurValue = blurToken.platforms.web;
        const opacityValue = opacityToken.baseValue;
        const colorValue = this.extractColorValue(colorToken.platforms.web.value);
        // Generate box-shadow value
        const boxShadow = `${offsetXValue.value}${offsetXValue.unit} ${offsetYValue.value}${offsetYValue.unit} ${blurValue.value}${blurValue.unit} ${this.applyOpacityToColor(colorValue, opacityValue)}`;
        return {
            boxShadow,
            customProperties: {
                offsetX: `${offsetXValue.value}${offsetXValue.unit}`,
                offsetY: `${offsetYValue.value}${offsetYValue.unit}`,
                blur: `${blurValue.value}${blurValue.unit}`,
                opacity: `${opacityValue}`,
                color: colorValue
            }
        };
    }
    /**
     * Generate CSS custom properties for all shadow tokens
     *
     * @returns CSS string with custom properties for all shadow tokens
     */
    generateCSSCustomProperties() {
        const lines = [];
        lines.push('/**');
        lines.push(' * Shadow Token CSS Custom Properties');
        lines.push(' * DesignerPunk Design System');
        lines.push(' *');
        lines.push(' * Auto-generated shadow tokens for Web');
        lines.push(' * DO NOT EDIT - Generated from Shadow Token System');
        lines.push(' */');
        lines.push('');
        lines.push(':root {');
        lines.push('  /* Shadow Tokens */');
        lines.push('  ');
        const shadowTokens = (0, ShadowTokens_1.getAllShadowTokens)();
        for (const shadowToken of shadowTokens) {
            const cssValue = this.generateShadowCSSValue(shadowToken.name);
            if (cssValue) {
                const cssVarName = this.toCSSVariableName(shadowToken.name);
                lines.push(`  /* ${shadowToken.description} */`);
                lines.push(`  --${cssVarName}: ${cssValue.boxShadow};`);
                lines.push(`  --${cssVarName}-offset-x: ${cssValue.customProperties.offsetX};`);
                lines.push(`  --${cssVarName}-offset-y: ${cssValue.customProperties.offsetY};`);
                lines.push(`  --${cssVarName}-blur: ${cssValue.customProperties.blur};`);
                lines.push(`  --${cssVarName}-opacity: ${cssValue.customProperties.opacity};`);
                lines.push(`  --${cssVarName}-color: ${cssValue.customProperties.color};`);
                lines.push('  ');
            }
        }
        lines.push('}');
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Resolve primitive token from token registry
     */
    resolvePrimitiveToken(tokenName, tokenRegistry) {
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
    resolveColorToken(tokenName) {
        // Direct primitive color lookup
        const token = ColorTokens_1.colorTokens[tokenName];
        if (token) {
            return token;
        }
        return null;
    }
    /**
     * Extract color string value from ColorTokenValue or string
     */
    extractColorValue(value) {
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
     * Apply opacity to color value
     *
     * Converts rgb() to rgba() with opacity
     */
    applyOpacityToColor(colorValue, opacity) {
        // Handle rgb() format
        if (colorValue.startsWith('rgb(')) {
            const rgbValues = colorValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbValues) {
                const [, r, g, b] = rgbValues;
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
            }
        }
        // Handle rgba() format (already has opacity)
        if (colorValue.startsWith('rgba(')) {
            // Replace existing opacity with new opacity
            return colorValue.replace(/,\s*[\d.]+\)$/, `, ${opacity})`);
        }
        // Handle hex format
        if (colorValue.startsWith('#')) {
            // Convert hex to rgba
            const hex = colorValue.replace('#', '');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
        // Fallback: return color as-is
        return colorValue;
    }
    /**
     * Convert token name to CSS variable name
     * Example: shadow.container -> shadow-container
     */
    toCSSVariableName(name) {
        return name
            .replace(/\./g, '-')
            .toLowerCase();
    }
}
exports.WebShadowGenerator = WebShadowGenerator;
//# sourceMappingURL=WebShadowGenerator.js.map