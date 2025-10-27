/**
 * Tap Area Token Definitions
 *
 * Tap area tokens use precision multipliers to achieve specific accessibility targets
 * while maintaining baseline grid alignment where possible.
 * Base value: 44 units (WCAG 2.1 AA minimum tap target size)
 * Mathematical progression: Precision-targeted multipliers for accessibility compliance
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Tap area token base value for mathematical calculations (WCAG 2.1 AA minimum)
 */
export declare const TAP_AREA_BASE_VALUE = 44;
/**
 * TapArea tokens with precision multipliers for accessibility targets
 */
export declare const tapAreaTokens: Record<string, PrimitiveToken>;
/**
 * Array of all tap area token names for iteration
 */
export declare const tapAreaTokenNames: string[];
/**
 * Get tap area token by name
 */
export declare function getTapAreaToken(name: string): PrimitiveToken | undefined;
/**
 * Get all tap area tokens as array
 */
export declare function getAllTapAreaTokens(): PrimitiveToken[];
/**
 * Validate tap area meets accessibility requirements
 */
export declare function validateTapAreaAccessibility(tapAreaValue: number): {
    isAccessible: boolean;
    level: 'AA' | 'AAA' | 'Below AA';
    recommendation?: string;
};
//# sourceMappingURL=TapAreaTokens.d.ts.map