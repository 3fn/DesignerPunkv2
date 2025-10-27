/**
 * Glow Opacity Token Definitions
 *
 * Glow opacity tokens determine the transparency of glow effects.
 * Base value: 0.8 (unitless)
 *
 * Glow opacity tokens use a decreasing progression to create multi-layer
 * glow effects where inner layers are more opaque and outer layers are
 * more transparent, creating a natural radial fade.
 *
 * Decreasing progression:
 * - glowOpacity100: 0.8 (most opaque - inner layer)
 * - glowOpacity200: 0.6 (moderate opacity)
 * - glowOpacity300: 0.4 (lighter opacity)
 * - glowOpacity400: 0.2 (most transparent - outer layer)
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Glow opacity base value for mathematical calculations
 */
export declare const GLOW_OPACITY_BASE_VALUE = 0.8;
/**
 * Glow opacity tokens
 *
 * Decreasing opacity progression for multi-layer glow effects.
 * Inner layers (100) are more opaque, outer layers (400) are more transparent.
 */
export declare const glowOpacity: Record<string, PrimitiveToken>;
/**
 * Array of all glow opacity token names for iteration
 */
export declare const glowOpacityNames: string[];
/**
 * Get glow opacity token by name
 */
export declare function getGlowOpacityToken(name: string): PrimitiveToken | undefined;
/**
 * Get all glow opacity tokens as array
 */
export declare function getAllGlowOpacityTokens(): PrimitiveToken[];
//# sourceMappingURL=GlowOpacityTokens.d.ts.map