/**
 * Semantic Grid Spacing Token Definitions
 *
 * Grid spacing semantic tokens define gutter and margin values for responsive grid layouts.
 * These tokens reference existing mathematical spacing tokens for consistency with the 8px baseline grid.
 *
 * Web platforms use breakpoint-specific tokens (Xs/Sm/Md/Lg) for responsive grid systems.
 * Native platforms use dedicated native tokens (gridGutterNative, gridMarginNative) for consistent spacing.
 *
 * Token Categories:
 * - Grid Gutter: Spacing between grid columns
 * - Grid Margin: Container margins at page edges
 *
 * Scaling Pattern:
 * Grid spacing scales with layout complexity to maintain visual hierarchy and readability.
 * More columns require more spacing to prevent visual crowding.
 */
import { SemanticToken } from '../../types/SemanticToken';
/**
 * Grid spacing semantic tokens for responsive layout spacing
 * Reference existing mathematical spacing tokens for consistency
 */
export declare const gridSpacingTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>>;
/**
 * Array of all grid spacing semantic token names for iteration
 */
export declare const gridSpacingTokenNames: string[];
/**
 * Get grid spacing semantic token by name
 */
export declare function getGridSpacingToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined;
/**
 * Get all grid spacing semantic tokens as array
 */
export declare function getAllGridSpacingTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>>;
//# sourceMappingURL=GridSpacingTokens.d.ts.map