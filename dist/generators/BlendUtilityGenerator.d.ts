/**
 * Blend Utility Generator
 *
 * Generates platform-specific blend utility functions that calculate
 * blended colors at runtime using blend values. Outputs TypeScript
 * functions for web that work with hex color strings.
 *
 * @module generators/BlendUtilityGenerator
 */
export interface BlendUtilityGenerationOptions {
    includeComments?: boolean;
    includeColorSpaceUtils?: boolean;
}
/**
 * Blend Utility Generator
 * Generates platform-specific blend utility functions
 */
export declare class BlendUtilityGenerator {
    /**
     * Generate blend utilities for web platform (TypeScript)
     *
     * Outputs TypeScript functions that work with hex color strings:
     * - darkerBlend(color, blendValue): string
     * - lighterBlend(color, blendValue): string
     * - saturate(color, blendValue): string
     * - desaturate(color, blendValue): string
     *
     * @param options - Generation options
     * @returns TypeScript code as string
     */
    generateWebBlendUtilities(options?: BlendUtilityGenerationOptions): string;
    /**
     * Generate blend utilities for iOS platform (Swift)
     *
     * Outputs Swift Color extension methods that work with SwiftUI Color:
     * - darkerBlend(_ amount: Double) -> Color
     * - lighterBlend(_ amount: Double) -> Color
     * - saturate(_ amount: Double) -> Color
     * - desaturate(_ amount: Double) -> Color
     *
     * @param options - Generation options
     * @returns Swift code as string
     */
    generateiOSBlendUtilities(options?: BlendUtilityGenerationOptions): string;
    /**
     * Generate blend utilities for Android platform (Kotlin)
     *
     * Outputs Kotlin Color extension functions that work with Compose Color:
     * - darkerBlend(amount: Float): Color
     * - lighterBlend(amount: Float): Color
     * - saturate(amount: Float): Color
     * - desaturate(amount: Float): Color
     *
     * @param options - Generation options
     * @returns Kotlin code as string
     */
    generateAndroidBlendUtilities(options?: BlendUtilityGenerationOptions): string;
    /**
     * Generate Android color space utility functions
     *
     * @param includeComments - Whether to include comments
     * @returns Kotlin code for color space utilities
     */
    private generateAndroidColorSpaceUtilities;
    /**
     * Generate iOS color space utility functions
     *
     * @param includeComments - Whether to include comments
     * @returns Swift code for color space utilities
     */
    private generateiOSColorSpaceUtilities;
    /**
     * Generate color space utility functions
     *
     * @param includeComments - Whether to include JSDoc comments
     * @returns TypeScript code for color space utilities
     */
    private generateColorSpaceUtilities;
}
//# sourceMappingURL=BlendUtilityGenerator.d.ts.map