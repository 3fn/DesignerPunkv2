/**
 * Glow Blur Token Definitions
 *
 * Glow blur tokens determine the radial spread of glow effects.
 * Base value: 8 units (8px baseline grid alignment)
 *
 * Glow blur tokens use an extended blur range compared to shadow blur tokens,
 * providing larger blur amounts suitable for emphasis and energy effects.
 *
 * Scale progression:
 * - glowBlur100: 8px (base value)
 * - glowBlur200: 16px (base × 2)
 * - glowBlur300: 24px (base × 3)
 * - glowBlur400: 32px (base × 4)
 * - glowBlur500: 40px (base × 5)
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Glow blur base value for mathematical calculations
 */
export declare const GLOW_BLUR_BASE_VALUE = 8;
/**
 * Glow blur tokens
 *
 * Extended blur range for radial glow effects that convey emphasis and energy.
 * Larger blur amounts than shadow tokens to create diffuse, radiant effects.
 */
export declare const glowBlur: Record<string, PrimitiveToken>;
/**
 * Array of all glow blur token names for iteration
 */
export declare const glowBlurNames: string[];
/**
 * Get glow blur token by name
 */
export declare function getGlowBlurToken(name: string): PrimitiveToken | undefined;
/**
 * Get all glow blur tokens as array
 */
export declare function getAllGlowBlurTokens(): PrimitiveToken[];
//# sourceMappingURL=GlowBlurTokens.d.ts.map