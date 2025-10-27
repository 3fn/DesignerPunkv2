"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUnitProvider = void 0;
/**
 * Abstract base class providing common unit conversion functionality
 */
class BaseUnitProvider {
    constructor(config = {}) {
        this.config = {
            baseFontSize: 16,
            densityFactor: 1.0,
            displayScale: 1.0,
            ...config
        };
    }
    validateConversion(originalValue, convertedValue, category) {
        // For string values (like fontFamily), just ensure they match
        if (typeof originalValue === 'string') {
            return convertedValue.value === originalValue;
        }
        // Basic validation - ensure converted numeric value is positive and maintains proportional relationships
        if (typeof convertedValue.value === 'number' && convertedValue.value < 0)
            return false;
        // For unitless values (like lineHeight), the value should remain the same
        if (convertedValue.unit === 'unitless') {
            return Math.abs(convertedValue.value - originalValue) < 0.001;
        }
        // For pass-through values (fontFamily, fontWeight, letterSpacing), the value should remain the same
        if (convertedValue.unit === 'fontFamily' || convertedValue.unit === 'fontWeight' || convertedValue.unit === 'em') {
            if (typeof convertedValue.value === 'number' && typeof originalValue === 'number') {
                return Math.abs(convertedValue.value - originalValue) < 0.001;
            }
            return convertedValue.value === originalValue;
        }
        // For other units, ensure the conversion factor is applied correctly (originalValue must be numeric here)
        if (typeof originalValue !== 'number')
            return false;
        const conversionFactor = this.getConversionFactor(category);
        const expectedValue = typeof conversionFactor === 'number'
            ? originalValue * conversionFactor
            : originalValue * conversionFactor.factor;
        return Math.abs(convertedValue.value - expectedValue) < 0.001;
    }
}
exports.BaseUnitProvider = BaseUnitProvider;
//# sourceMappingURL=UnitProvider.js.map