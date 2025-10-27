/**
 * Density Token Definitions
 *
 * Density tokens provide selective scaling for functional tokens (spacing, typography, tap areas)
 * while leaving aesthetic tokens (radius, line height ratios) unchanged.
 * Base value: 1.0 (no scaling applied)
 * Mathematical progression: Multipliers for functional token scaling
 */
import { PrimitiveToken, TokenCategory } from '../types/PrimitiveToken';
/**
 * Density token base value for mathematical calculations
 */
export declare const DENSITY_BASE_VALUE = 1;
/**
 * Density tokens with selective application to functional tokens
 */
export declare const densityTokens: Record<string, PrimitiveToken>;
/**
 * Array of all density token names for iteration
 */
export declare const densityTokenNames: string[];
/**
 * Get density token by name
 */
export declare function getDensityToken(name: string): PrimitiveToken | undefined;
/**
 * Get all density tokens as array
 */
export declare function getAllDensityTokens(): PrimitiveToken[];
/**
 * Apply density scaling to functional token values
 * Functional tokens: spacing, fontSize, tapArea
 * Aesthetic tokens (radius, lineHeight ratios) are NOT scaled
 */
export declare function applyDensityScaling(tokenValue: number, densityMultiplier: number, tokenCategory: TokenCategory): number;
//# sourceMappingURL=DensityTokens.d.ts.map