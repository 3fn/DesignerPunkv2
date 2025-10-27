"use strict";
/**
 * Platform Type Definition
 *
 * Defines the supported target platforms for the Cross-Platform Build System.
 * Each platform has its own native technology stack:
 * - iOS: Swift + SwiftUI
 * - Android: Kotlin + Jetpack Compose
 * - Web: TypeScript + Lit (Web Components)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLATFORM_METADATA = void 0;
/**
 * Platform metadata registry
 */
exports.PLATFORM_METADATA = {
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
//# sourceMappingURL=Platform.js.map