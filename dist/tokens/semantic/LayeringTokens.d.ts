/**
 * Layering Token System
 *
 * Unified entry point for all layering tokens across web, iOS, and Android platforms.
 *
 * The Layering Token System provides platform-specific semantic tokens for controlling
 * element stacking order. It acknowledges fundamental platform differences:
 * - Web and iOS separate stacking order (z-index) from visual depth (shadows)
 * - Android Material Design couples these concerns through elevation
 *
 * ## Token Sets
 *
 * ### Z-Index Tokens (Web + iOS)
 * Pure stacking order tokens used independently with shadow tokens for visual depth.
 * Uses 100-based scale (100, 200, 300, 400, 500, 600) to allow for future expansion.
 *
 * Platform support: web, iOS
 * See: ZIndexTokens.ts
 *
 * ### Elevation Tokens (Android)
 * Material Design elevation tokens that handle both stacking order and shadow rendering.
 * Uses Material Design scale (4dp, 8dp, 16dp, 24dp) following platform guidelines.
 *
 * Platform support: Android
 * See: ElevationTokens.ts
 *
 * ## Semantic Consistency
 *
 * Both token sets use consistent semantic naming across platforms:
 * - container: Base container components
 * - navigation: Persistent navigation elements
 * - dropdown: Temporary overlay content
 * - modal: Modal overlay content
 * - toast: Notification elements
 * - tooltip: Always-visible elements
 *
 * This ensures "modal" means the same layering concept everywhere, even though
 * implementation differs (z-index 400 on web/iOS, elevation 16dp on Android).
 *
 * ## Architecture Note
 *
 * Layering tokens are semantic-only with no primitive token layer. This is a
 * documented exception to the typical primitive→semantic hierarchy because:
 *
 * 1. **No Mathematical Relationships**: Z-index and elevation values are ordinal
 *    (ordering), not mathematical (relationships). There's no meaningful mathematical
 *    relationship between z-index 100 and 400, or elevation 8dp and 16dp.
 *
 * 2. **Platform-Specific Scales**: Web uses arbitrary z-index values, iOS uses
 *    small integers, Android uses Material Design dp scale. These don't align
 *    mathematically.
 *
 * 3. **Component-Driven**: Layering is about component stacking order (modal above
 *    dropdown), not mathematical progressions.
 *
 * ## Usage Examples
 *
 * ### Web Platform
 * ```typescript
 * import { zIndexTokens } from './LayeringTokens';
 *
 * // Use z-index for stacking order
 * const modalStyle = {
 *   zIndex: zIndexTokens['zIndex.modal'].value, // 400
 *   boxShadow: shadowTokens['shadow.modal'] // Separate shadow
 * };
 * ```
 *
 * ### iOS Platform
 * ```swift
 * import { zIndexTokens } from './LayeringTokens';
 *
 * // Use z-index for stacking order (scaled to 1-6)
 * Modal()
 *   .zIndex(zIndexTokens['zIndex.modal'].value) // 4 (scaled from 400)
 *   .shadow(shadowTokens['shadow.modal']) // Separate shadow
 * ```
 *
 * ### Android Platform
 * ```kotlin
 * import { elevationTokens } from './LayeringTokens';
 *
 * // Use elevation (handles both z-order and shadow)
 * Modal(
 *   elevation = elevationTokens['elevation.modal'].value // 16.dp
 * )
 * ```
 *
 * ## Platform-Specific Helpers
 *
 * ```typescript
 * import { getLayeringTokensByPlatform } from './LayeringTokens';
 *
 * // Get tokens for specific platform
 * const webTokens = getLayeringTokensByPlatform('web'); // Returns z-index tokens
 * const androidTokens = getLayeringTokensByPlatform('android'); // Returns elevation tokens
 * ```
 */
export { type ZIndexToken, zIndexTokens, zIndexTokenNames, getZIndexToken, getAllZIndexTokens } from './ZIndexTokens';
export { type ElevationToken, elevationTokens, elevationTokenNames, getElevationToken, getAllElevationTokens } from './ElevationTokens';
/**
 * Get all layering tokens organized by token set
 *
 * @returns Object containing both z-index and elevation token sets
 *
 * @example
 * ```typescript
 * const allTokens = getAllLayeringTokens();
 * console.log(allTokens.zIndex); // Array of 6 z-index tokens
 * console.log(allTokens.elevation); // Array of 6 elevation tokens
 * ```
 */
export declare function getAllLayeringTokens(): {
    zIndex: any;
    elevation: any;
};
/**
 * Get layering tokens for a specific platform
 *
 * @param platform - Target platform ('web', 'ios', or 'android')
 * @returns Array of tokens appropriate for the specified platform
 *
 * @example
 * ```typescript
 * // Get tokens for web platform
 * const webTokens = getLayeringTokensByPlatform('web');
 * // Returns z-index tokens
 *
 * // Get tokens for Android platform
 * const androidTokens = getLayeringTokensByPlatform('android');
 * // Returns elevation tokens
 * ```
 */
export declare function getLayeringTokensByPlatform(platform: 'web' | 'ios' | 'android'): any;
//# sourceMappingURL=LayeringTokens.d.ts.map