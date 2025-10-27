/**
 * Shadow Offset Token Definitions
 *
 * Shadow offset tokens determine shadow direction based on light source position (sun arc).
 * Base value: 4 units (4px baseline grid alignment)
 *
 * Horizontal shadow offsets following the sun's arc across the sky:
 * - Sunrise/Morning: Shadows fall left (negative values)
 * - Noon: Shadows fall straight down (zero)
 * - Dusk/Sunset: Shadows fall right (positive values)
 *
 * "Dusk" naming inspired by Tracy Weiss—because she lights me up,
 * and this lighting framework needed her spark to shine its brightest.
 *
 * Y-axis offsets (vertical direction):
 * - All positive values (shadows fall downward)
 * - Values scale with depth (greater depth = larger offset)
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Shadow offset base value for mathematical calculations
 */
export declare const SHADOW_OFFSET_BASE_VALUE = 4;
/**
 * Shadow offset X tokens (horizontal direction)
 *
 * Naming convention:
 * - n300, n150, n100: Negative values for sunrise/morning (shadow falls left)
 * - 000: Zero value for noon (no horizontal offset)
 * - 100, 150, 300: Positive values for dusk/sunset (shadow falls right)
 */
export declare const shadowOffsetX: Record<string, PrimitiveToken>;
/**
 * Shadow offset Y tokens (vertical direction)
 *
 * All Y offsets are positive (shadows fall downward).
 * Values scale with depth:
 * - 100: Depth 100 / Noon - short shadow
 * - 200: Depth 200 - medium shadow
 * - 300: Morning/Dusk - medium-long shadow
 * - 400: Depth 300 / Sunrise/Sunset - long shadow
 */
export declare const shadowOffsetY: Record<string, PrimitiveToken>;
/**
 * Array of all shadow offset X token names for iteration
 */
export declare const shadowOffsetXNames: string[];
/**
 * Array of all shadow offset Y token names for iteration
 */
export declare const shadowOffsetYNames: string[];
/**
 * Get shadow offset X token by name
 */
export declare function getShadowOffsetXToken(name: string): PrimitiveToken | undefined;
/**
 * Get shadow offset Y token by name
 */
export declare function getShadowOffsetYToken(name: string): PrimitiveToken | undefined;
/**
 * Get all shadow offset X tokens as array
 */
export declare function getAllShadowOffsetXTokens(): PrimitiveToken[];
/**
 * Get all shadow offset Y tokens as array
 */
export declare function getAllShadowOffsetYTokens(): PrimitiveToken[];
//# sourceMappingURL=ShadowOffsetTokens.d.ts.map