/**
 * Shadow Blur Token Definitions
 *
 * Shadow blur tokens determine edge definition based on shadow quality and depth.
 * Base value: 4 units (4px baseline grid alignment)
 *
 * Quality-based blur tokens:
 * - shadowBlurHard: Sharp, defined edges (4px)
 * - shadowBlurModerate: Balanced definition (12px)
 * - shadowBlurSoft: Diffuse, gentle edges (20px)
 *
 * Depth-based blur tokens:
 * - shadowBlurDepth200: Increased blur for raised elements (16px)
 * - shadowBlurDepth300: Maximum blur for floating elements (24px)
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
/**
 * Shadow blur base value for mathematical calculations
 */
export declare const SHADOW_BLUR_BASE_VALUE = 4;
/**
 * Shadow blur tokens
 *
 * Quality-based tokens define edge characteristics:
 * - Hard: Sharp, defined edges for strong shadows
 * - Moderate: Balanced definition for standard shadows
 * - Soft: Diffuse, gentle edges for subtle shadows
 *
 * Depth-based tokens provide blur adjustments for elevation:
 * - Depth200: Increased blur for raised elements
 * - Depth300: Maximum blur for floating elements
 */
export declare const shadowBlur: Record<string, PrimitiveToken>;
/**
 * Array of all shadow blur token names for iteration
 */
export declare const shadowBlurNames: string[];
/**
 * Get shadow blur token by name
 */
export declare function getShadowBlurToken(name: string): PrimitiveToken | undefined;
/**
 * Get all shadow blur tokens as array
 */
export declare function getAllShadowBlurTokens(): PrimitiveToken[];
//# sourceMappingURL=ShadowBlurTokens.d.ts.map