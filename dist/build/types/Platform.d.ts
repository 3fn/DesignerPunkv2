/**
 * Platform Type Definition
 *
 * Defines the supported target platforms for the Cross-Platform Build System.
 * Each platform has its own native technology stack:
 * - iOS: Swift + SwiftUI
 * - Android: Kotlin + Jetpack Compose
 * - Web: TypeScript + Lit (Web Components)
 */
export type Platform = 'ios' | 'android' | 'web';
/**
 * Platform metadata for build configuration
 */
export interface PlatformMetadata {
    platform: Platform;
    displayName: string;
    nativeLanguage: string;
    framework: string;
    packageFormat: string;
}
/**
 * Platform metadata registry
 */
export declare const PLATFORM_METADATA: Record<Platform, PlatformMetadata>;
//# sourceMappingURL=Platform.d.ts.map