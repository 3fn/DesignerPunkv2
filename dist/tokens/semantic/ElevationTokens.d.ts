/**
 * Elevation Tokens (Android)
 *
 * Semantic tokens for Material Design elevation on Android platform.
 * Elevation handles both stacking order and shadow rendering.
 *
 * Platform: Android
 * Web/iOS: Use z-index + shadow tokens instead
 *
 * Architecture Note:
 * Elevation tokens are semantic-only tokens with no primitive token layer.
 * Unlike other token categories that follow a primitive→semantic hierarchy,
 * layering tokens use direct semantic values because:
 *
 * 1. No Mathematical Relationships: Elevation values are ordinal (ordering),
 *    not mathematical (relationships). Material Design elevation scale
 *    (4dp, 8dp, 16dp, 24dp) follows design guidelines, not mathematical progressions.
 *
 * 2. Platform-Specific Scales: Android uses Material Design elevation scale
 *    in dp (density-independent pixels). This scale doesn't align mathematically
 *    with web z-index or iOS zIndex values.
 *
 * 3. Component-Driven: Elevation is inherently about component stacking order
 *    and visual depth (modal above dropdown), not mathematical progressions.
 *
 * Material Design Integration:
 * Elevation values follow Material Design guidelines and couple stacking order
 * with shadow rendering. Each elevation token includes a shadowReference property
 * that documents the related shadow token for cross-platform visual consistency.
 */
import { SemanticCategory } from '../../types/SemanticToken';
/**
 * Elevation token interface for semantic-only layering tokens
 * These tokens don't reference primitives - they use direct values
 */
export interface ElevationToken {
    name: string;
    value: number;
    platforms: string[];
    category: SemanticCategory;
    shadowReference: string;
    context: string;
    description: string;
}
/**
 * Elevation tokens for Android Material Design
 *
 * Six semantic levels following Material Design elevation scale:
 * - container: 8dp (base container elevation)
 * - navigation: 4dp (persistent navigation elements)
 * - dropdown: 8dp (temporary overlay content)
 * - modal: 16dp (modal overlay content)
 * - toast: 24dp (notification elements)
 * - tooltip: 24dp (always-visible elements)
 *
 * Each token includes shadowReference to align with cross-platform shadow tokens.
 */
export declare const elevationTokens: Record<string, ElevationToken>;
/**
 * Get a specific elevation token by name
 *
 * @param name - The elevation token name (e.g., 'elevation.modal')
 * @returns The elevation token or undefined if not found
 *
 * @example
 * ```typescript
 * const modalElevation = getElevationToken('elevation.modal');
 * // Returns: { name: 'elevation.modal', value: 16, platforms: ['android'], ... }
 * ```
 */
export declare function getElevationToken(name: string): ElevationToken | undefined;
/**
 * Get all elevation tokens as an array
 *
 * @returns Array of all elevation tokens
 *
 * @example
 * ```typescript
 * const allElevations = getAllElevationTokens();
 * // Returns array of 6 elevation tokens
 * ```
 */
export declare function getAllElevationTokens(): ElevationToken[];
/**
 * Array of all elevation token names
 *
 * Useful for validation, iteration, or generating documentation.
 *
 * @example
 * ```typescript
 * elevationTokenNames.forEach(name => {
 *   console.log(name); // 'elevation.container', 'elevation.navigation', etc.
 * });
 * ```
 */
export declare const elevationTokenNames: string[];
//# sourceMappingURL=ElevationTokens.d.ts.map