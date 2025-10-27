"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AndroidUnitConverter = exports.AndroidDensity = void 0;
const UnitProvider_1 = require("./UnitProvider");
/**
 * Android density buckets and their scale factors
 */
var AndroidDensity;
(function (AndroidDensity) {
    AndroidDensity[AndroidDensity["LDPI"] = 0.75] = "LDPI";
    AndroidDensity[AndroidDensity["MDPI"] = 1] = "MDPI";
    AndroidDensity[AndroidDensity["HDPI"] = 1.5] = "HDPI";
    AndroidDensity[AndroidDensity["XHDPI"] = 2] = "XHDPI";
    AndroidDensity[AndroidDensity["XXHDPI"] = 3] = "XXHDPI";
    AndroidDensity[AndroidDensity["XXXHDPI"] = 4] = "XXXHDPI"; // ~640dpi
})(AndroidDensity || (exports.AndroidDensity = AndroidDensity = {}));
/**
 * Android-specific unit converter
 * Converts unitless token values to Android-appropriate units (dp, sp, unitless)
 */
class AndroidUnitConverter extends UnitProvider_1.BaseUnitProvider {
    constructor(config = {}) {
        super({
            densityFactor: AndroidDensity.MDPI, // Default to MDPI (1.0)
            ...config
        });
        this.platform = 'android';
    }
    convertToken(token) {
        return this.convertValue(token.baseValue, token.category);
    }
    convertValue(baseValue, category) {
        switch (category) {
            case 'spacing':
            case 'radius':
            case 'tapArea':
                // Convert to density-independent pixels (dp)
                // dp values remain consistent across different screen densities
                return { value: baseValue, unit: 'dp' };
            case 'fontSize':
                // Convert to scale-independent pixels (sp) for text
                // sp respects user's font size preferences
                return { value: baseValue, unit: 'sp' };
            case 'fontFamily':
                // Font family remains as string for Android
                return { value: baseValue, unit: 'fontFamily' };
            case 'fontWeight':
                // Font weight remains as numeric for Android
                return { value: baseValue, unit: 'fontWeight' };
            case 'letterSpacing':
                // Letter spacing converted to em units for Android
                return { value: baseValue, unit: 'em' };
            case 'lineHeight':
                // Line height remains unitless for proper Android behavior
                return { value: baseValue, unit: 'unitless' };
            case 'density':
                // Density is a multiplier, remains unitless
                return { value: baseValue, unit: 'unitless' };
            default:
                // Default to dp for unknown categories
                return { value: baseValue, unit: 'dp' };
        }
    }
    getConversionFactor(category) {
        switch (category) {
            case 'spacing':
            case 'radius':
            case 'tapArea':
                return { factor: 1, unit: 'dp' };
            case 'fontSize':
                return { factor: 1, unit: 'sp' };
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
                return { factor: 1, unit: 'dp' };
        }
    }
    /**
     * Get the current density factor
     */
    getDensityFactor() {
        return this.config.densityFactor;
    }
    /**
     * Convert dp to pixels for a given density
     */
    dpToPixels(dpValue, density) {
        const densityFactor = density || this.config.densityFactor;
        return dpValue * densityFactor;
    }
    /**
     * Convert pixels to dp for a given density
     */
    pixelsToDp(pixelValue, density) {
        const densityFactor = density || this.config.densityFactor;
        return pixelValue / densityFactor;
    }
    /**
     * Convert sp to pixels for a given density
     * Note: sp also considers user font scale preferences
     */
    spToPixels(spValue, density, fontScale = 1.0) {
        const densityFactor = density || this.config.densityFactor;
        return spValue * densityFactor * fontScale;
    }
    /**
     * Handle density bucket considerations
     * Ensures values work well across different Android density buckets
     */
    handleDensityBuckets(baseValue, category) {
        const results = {};
        Object.entries(AndroidDensity).forEach(([key, densityFactor]) => {
            if (typeof densityFactor === 'number') {
                switch (category) {
                    case 'spacing':
                    case 'radius':
                    case 'tapArea':
                        // dp values remain consistent across densities
                        results[key] = baseValue;
                        break;
                    case 'fontSize':
                        // sp values remain consistent across densities
                        results[key] = baseValue;
                        break;
                    default:
                        results[key] = baseValue;
                        break;
                }
            }
        });
        return results;
    }
    /**
     * Validate that values work well across density buckets
     */
    validateAcrossDensities(baseValue, category) {
        const densityResults = this.handleDensityBuckets(baseValue, category);
        // Ensure all density results are positive and reasonable
        return Object.values(densityResults).every(value => value > 0 && value < 1000 // Reasonable upper bound
        );
    }
}
exports.AndroidUnitConverter = AndroidUnitConverter;
//# sourceMappingURL=AndroidUnitConverter.js.map