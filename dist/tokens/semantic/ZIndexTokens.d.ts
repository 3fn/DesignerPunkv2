/**
 * Z-Index Tokens (Web + iOS)
 *
 * Part of the Layering Token System.
 * For Android layering, see ElevationTokens.ts
 *
 * Semantic tokens for stacking order on web and iOS platforms.
 * Use independently with shadow tokens for visual depth.
 *
 * Platform: Web, iOS
 * Android: Use elevation tokens instead
 *
 * Architecture Note:
 * Z-Index tokens are semantic-only tokens with no primitive token layer.
 * Unlike other token categories that follow a primitive→semantic hierarchy,
 * layering tokens use direct semantic values because:
 *
 * 1. No Mathematical Relationships: Z-index values are ordinal (ordering),
 *    not mathematical (relationships). There's no meaningful mathematical
 *    relationship between z-index 100 and 400.
 *
 * 2. Platform-Specific Scales: Web uses arbitrary z-index values (100, 200, 300),
 *    iOS uses small integers (1, 2, 3). These scales don't align mathematically.
 *
 * 3. Component-Driven: Layering is inherently about component stacking order
 *    (modal above dropdown), not mathematical progressions.
 */
import { SemanticCategory } from '../../types/SemanticToken';
/**
 * Z-Index token interface for semantic-only layering tokens
 * These tokens don't reference primitives - they use direct values
 */
export interface ZIndexToken {
    name: string;
    value: number;
    platforms: string[];
    category: SemanticCategory;
    context: string;
    description: string;
}
/**
 * Z-Index tokens for web and iOS platforms
 * Uses 100-based scale (100, 200, 300, 400, 500, 600) to allow for future insertion of intermediate levels
 *
 * Total: 6 semantic levels
 */
export declare const zIndexTokens: Record<string, ZIndexToken>;
/**
 * Array of all z-index token names for iteration
 * Total: 6 tokens
 */
export declare const zIndexTokenNames: string[];
/**
 * Get z-index token by name
 */
export declare function getZIndexToken(name: string): ZIndexToken | undefined;
/**
 * Get all z-index tokens as array
 */
export declare function getAllZIndexTokens(): ZIndexToken[];
//# sourceMappingURL=ZIndexTokens.d.ts.map