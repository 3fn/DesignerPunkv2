/**
 * Blend Value Generator
 *
 * Generates blend value constants for all platforms.
 * Outputs blend100-blend500 constants in platform-appropriate format:
 * - Web: export const blend100 = 0.04
 * - iOS: static let blend100: Double = 0.04
 * - Android: const val blend100 = 0.04f
 *
 * Integrates with existing unified generator infrastructure.
 */
import { PrimitiveToken } from '../types/PrimitiveToken';
export interface BlendValueGenerationOptions {
    includeComments?: boolean;
    includeBaseValue?: boolean;
}
/**
 * Blend Value Generator
 * Generates platform-specific blend value constants
 */
export declare class BlendValueGenerator {
    /**
     * Generate blend values for all platforms
     */
    generateAll(options?: BlendValueGenerationOptions): {
        web: string;
        ios: string;
        android: string;
    };
    /**
     * Generate blend values for web platform (JavaScript/TypeScript)
     */
    generateWebBlendValues(options?: BlendValueGenerationOptions): string;
    /**
     * Generate blend values for iOS platform (Swift)
     */
    generateiOSBlendValues(options?: BlendValueGenerationOptions): string;
    /**
     * Generate blend values for Android platform (Kotlin)
     */
    generateAndroidBlendValues(options?: BlendValueGenerationOptions): string;
    /**
     * Format blend value for specific platform
     * Helper method for integration with existing generator infrastructure
     */
    formatBlendValue(platform: 'web' | 'ios' | 'android', name: string, value: number): string;
    /**
     * Get blend tokens as array for iteration
     */
    getBlendTokens(): PrimitiveToken[];
}
//# sourceMappingURL=BlendValueGenerator.d.ts.map