"use strict";
/**
 * Breakpoint Token Definitions
 *
 * Breakpoint tokens define viewport width thresholds for responsive behavior.
 * Primarily used by web platforms for media queries and responsive grid systems.
 * Values are practical device-based measurements rather than mathematical progressions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.breakpointTokenNames = exports.breakpointTokens = exports.BREAKPOINT_BASE_VALUE = void 0;
exports.getBreakpointToken = getBreakpointToken;
exports.getAllBreakpointTokens = getAllBreakpointTokens;
const PrimitiveToken_1 = require("../types/PrimitiveToken");
/**
 * Breakpoint token base value (smallest breakpoint)
 */
exports.BREAKPOINT_BASE_VALUE = 320;
/**
 * Generate platform values for breakpoint tokens
 */
function generateBreakpointPlatformValues(baseValue) {
    return {
        web: { value: baseValue, unit: 'px' },
        ios: { value: baseValue, unit: 'pt' },
        android: { value: baseValue, unit: 'dp' }
    };
}
/**
 * Breakpoint tokens with practical device-based values
 */
exports.breakpointTokens = {
    breakpointXs: {
        name: 'breakpointXs',
        category: PrimitiveToken_1.TokenCategory.BREAKPOINT,
        baseValue: 320,
        familyBaseValue: exports.BREAKPOINT_BASE_VALUE,
        description: 'Small mobile viewport baseline',
        mathematicalRelationship: 'Practical device-based value',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateBreakpointPlatformValues(320)
    },
    breakpointSm: {
        name: 'breakpointSm',
        category: PrimitiveToken_1.TokenCategory.BREAKPOINT,
        baseValue: 375,
        familyBaseValue: exports.BREAKPOINT_BASE_VALUE,
        description: 'iPhone standard width and large mobile',
        mathematicalRelationship: 'Practical device-based value',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateBreakpointPlatformValues(375)
    },
    breakpointMd: {
        name: 'breakpointMd',
        category: PrimitiveToken_1.TokenCategory.BREAKPOINT,
        baseValue: 1024,
        familyBaseValue: exports.BREAKPOINT_BASE_VALUE,
        description: 'Desktop and tablet landscape transition',
        mathematicalRelationship: 'Practical device-based value',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateBreakpointPlatformValues(1024)
    },
    breakpointLg: {
        name: 'breakpointLg',
        category: PrimitiveToken_1.TokenCategory.BREAKPOINT,
        baseValue: 1440,
        familyBaseValue: exports.BREAKPOINT_BASE_VALUE,
        description: 'Large desktop and wide screen displays',
        mathematicalRelationship: 'Practical device-based value',
        baselineGridAlignment: false,
        isStrategicFlexibility: false,
        isPrecisionTargeted: false,
        platforms: generateBreakpointPlatformValues(1440)
    }
};
/**
 * Array of all breakpoint token names for iteration
 */
exports.breakpointTokenNames = Object.keys(exports.breakpointTokens);
/**
 * Get breakpoint token by name
 */
function getBreakpointToken(name) {
    return exports.breakpointTokens[name];
}
/**
 * Get all breakpoint tokens as array
 */
function getAllBreakpointTokens() {
    return Object.values(exports.breakpointTokens);
}
//# sourceMappingURL=BreakpointTokens.js.map