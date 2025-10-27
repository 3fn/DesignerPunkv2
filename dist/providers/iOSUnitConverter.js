"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iOSUnitConverter = void 0;
const UnitProvider_1 = require("./UnitProvider");
/**
 * iOS-specific unit converter
 * Converts unitless token values to iOS-appropriate units (points, unitless)
 */
class iOSUnitConverter extends UnitProvider_1.BaseUnitProvider {
    constructor(config = {}) {
        super({
            displayScale: 1.0, // Default @1x scale, can be 2.0 for @2x, 3.0 for @3x
            ...config
        });
        this.platform = 'ios';
    }
    convertToken(token) {
        return this.convertValue(token.baseValue, token.category);
    }
    convertValue(baseValue, category) {
        switch (category) {
            case 'spacing':
            case 'radius':
            case 'fontSize':
            case 'tapArea':
                // Convert to points (1:1 ratio for most values)
                // Points are device-independent units in iOS
                return { value: baseValue, unit: 'pt' };
            case 'fontFamily':
                // Font family remains as string for iOS
                return { value: baseValue, unit: 'fontFamily' };
            case 'fontWeight':
                // Font weight remains as numeric for iOS
                return { value: baseValue, unit: 'fontWeight' };
            case 'letterSpacing':
                // Letter spacing converted to em units for iOS
                return { value: baseValue, unit: 'em' };
            case 'lineHeight':
                // Line height remains unitless for proper UIKit behavior
                return { value: baseValue, unit: 'unitless' };
            case 'density':
                // Density is a multiplier, remains unitless
                return { value: baseValue, unit: 'unitless' };
            default:
                // Default to points for unknown categories
                return { value: baseValue, unit: 'pt' };
        }
    }
    getConversionFactor(category) {
        switch (category) {
            case 'spacing':
            case 'radius':
            case 'fontSize':
            case 'tapArea':
                return { factor: 1, unit: 'pt' };
            case 'fontFamily':
                return { factor: 1, unit: 'fontFamily' }; // Pass-through for strings
            case 'fontWeight':
                return { factor: 1, unit: 'fontWeight' }; // Pass-through for numeric weights
            case 'letterSpacing':
                return { factor: 1, unit: 'em' }; // 1:1 conversion to em
            case 'lineHeight':
            case 'density':
                return { factor: 1, unit: 'unitless' };
            default:
                return { factor: 1, unit: 'pt' };
        }
    }
    /**
     * Get the display scale factor (1.0 for @1x, 2.0 for @2x, 3.0 for @3x)
     */
    getDisplayScale() {
        return this.config.displayScale;
    }
    /**
     * Convert points to pixels for a given display scale
     * This is useful for understanding the actual pixel dimensions
     */
    pointsToPixels(pointValue, scale) {
        const displayScale = scale || this.config.displayScale;
        return pointValue * displayScale;
    }
    /**
     * Convert pixels to points for a given display scale
     */
    pixelsToPoints(pixelValue, scale) {
        const displayScale = scale || this.config.displayScale;
        return pixelValue / displayScale;
    }
    /**
     * Handle density considerations for iOS
     * iOS uses display scale rather than density buckets
     */
    applyDensityConsiderations(baseValue, category) {
        // For iOS, density is handled through display scale
        // Most values remain 1:1 with points, but can be adjusted for specific needs
        switch (category) {
            case 'tapArea':
                // Tap areas might need slight adjustments for different device sizes
                // but generally remain consistent in points
                return baseValue;
            default:
                return baseValue;
        }
    }
}
exports.iOSUnitConverter = iOSUnitConverter;
//# sourceMappingURL=iOSUnitConverter.js.map