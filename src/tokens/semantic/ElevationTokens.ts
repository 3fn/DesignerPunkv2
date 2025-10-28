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

import { SemanticCategory } from '../../types/SemanticToken.js';

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
