"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebUnitConverter = void 0;
const UnitProvider_1 = require("./UnitProvider");
const FontSizeTokens_1 = require("../tokens/FontSizeTokens");
/**
 * Web-specific unit converter
 * Converts unitless token values to web-appropriate units (px, rem, unitless)
 */
class WebUnitConverter extends UnitProvider_1.BaseUnitProvider {
    constructor(config = {}) {
        super({
            baseFontSize: FontSizeTokens_1.FONT_SIZE_BASE_VALUE, // Derived from primitive fontSize tokens
            ...config
        });
        this.platform = 'web';
    }
    convertToken(token) {
        // For font family tokens, use the actual font stack from platforms
        if (token.category === 'fontFamily') {
            return token.platforms.web;
        }
        return this.convertValue(token.baseValue, token.category);
    }
    convertValue(baseValue, category) {
        switch (category) {
            case 'spacing':
            case 'radius':
            case 'tapArea':
                // Convert to pixels (1:1 ratio for spacing, radius, and tap areas)
                return { value: baseValue, unit: 'px' };
            case 'fontSize':
                // Convert to REM by dividing by base font size
                return {
                    value: Math.round((baseValue / this.config.baseFontSize) * 1000) / 1000, // Round to 3 decimal places
                    unit: 'rem'
                };
            case 'fontFamily':
                // Font family remains as string for CSS
                return { value: baseValue, unit: 'fontFamily' };
            case 'fontWeight':
                // Font weight remains as numeric for CSS
                return { value: baseValue, unit: 'fontWeight' };
            case 'lineHeight':
                // Line height remains unitless for proper CSS behavior
                return { value: baseValue, unit: 'unitless' };
            case 'letterSpacing':
                // Letter spacing converted to em units for CSS
                return { value: baseValue, unit: 'em' };
            case 'density':
                // Density is a multiplier, remains unitless
                return { value: baseValue, unit: 'unitless' };
            default:
                // Default to pixels for unknown categories
                return { value: baseValue, unit: 'px' };
        }
    }
    getConversionFactor(category) {
        switch (category) {
            case 'spacing':
            case 'radius':
            case 'tapArea':
                return { factor: 1, unit: 'px' };
            case 'fontSize':
                return { factor: 1 / this.config.baseFontSize, unit: 'rem' };
            case 'fontFamily':
                return { factor: 1, unit: 'fontFamily' }; // Pass-through for strings
            case 'fontWeight':
                return { factor: 1, unit: 'fontWeight' }; // Pass-through for numeric weights
            case 'lineHeight':
            case 'density':
                return { factor: 1, unit: 'unitless' };
            case 'letterSpacing':
                return { factor: 1, unit: 'em' }; // 1:1 conversion to em
            default:
                return { factor: 1, unit: 'px' };
        }
    }
    /**
     * Get the base font size used for REM calculations
     */
    getBaseFontSize() {
        return this.config.baseFontSize;
    }
    /**
     * Convert a pixel value to REM
     */
    pxToRem(pixelValue) {
        return Math.round((pixelValue / this.config.baseFontSize) * 1000) / 1000;
    }
    /**
     * Convert a REM value to pixels
     */
    remToPx(remValue) {
        return remValue * this.config.baseFontSize;
    }
}
exports.WebUnitConverter = WebUnitConverter;
//# sourceMappingURL=WebUnitConverter.js.map