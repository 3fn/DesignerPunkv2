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
export const PLATFORM_METADATA: Record<Platform, PlatformMetadata> = {
  ios: {
    platform: 'ios',
    displayName: 'iOS',
    nativeLanguage: 'Swift',
    framework: 'SwiftUI',
    packageFormat: 'Swift Package',
  },
  android: {
    platform: 'android',
    displayName: 'Android',
    nativeLanguage: 'Kotlin',
    framework: 'Jetpack Compose',
    packageFormat: 'AAR/Gradle Module',
  },
  web: {
    platform: 'web',
    displayName: 'Web',
    nativeLanguage: 'TypeScript',
    framework: 'Lit',
    packageFormat: 'NPM Package',
  },
};
