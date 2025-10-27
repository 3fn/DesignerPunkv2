/**
 * Shadow Opacity Token Definitions
 *
 * Shadow opacity tokens determine shadow darkness based on quality and depth.
 * Base value: 0.3 (unitless)
 *
 * Quality-based opacity tokens:
 * - shadowOpacityHard: 0.4 (darker for sharp shadows)
 * - shadowOpacityModerate: 0.3 (balanced opacity)
 * - shadowOpacitySoft: 0.2 (lighter for diffuse shadows)
 *
 * Depth-based opacity tokens:
 * - shadowOpacityDepth200: 0.35 (slightly darker for raised elements)
 * - shadowOpacityDepth300: 0.4 (darkest for floating elements)
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
export declare const SHADOW_OPACITY_BASE_VALUE = 0.3;
export declare const shadowOpacityTokens: Record<string, PrimitiveToken>;
export declare function getShadowOpacityToken(name: string): PrimitiveToken | undefined;
export declare function getAllShadowOpacityTokens(): PrimitiveToken[];
export declare const shadowOpacityTokenNames: string[];
//# sourceMappingURL=ShadowOpacityTokens.d.ts.map