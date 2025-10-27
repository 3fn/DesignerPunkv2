/**
 * Build Mode Support
 *
 * Provides development and production build mode configurations with
 * platform-specific optimizations. Development mode enables debugging
 * features while production mode optimizes for performance and size.
 *
 * Requirements: 8.6
 */
import { BuildConfig, BuildMode as BuildModeType } from '../types/BuildConfig';
import { Platform } from '../types/Platform';
/**
 * Platform-specific optimization configuration
 */
export interface PlatformOptimizations {
    /** iOS-specific optimizations */
    ios: iOSOptimizations;
    /** Android-specific optimizations */
    android: AndroidOptimizations;
    /** Web-specific optimizations */
    web: WebOptimizations;
}
/**
 * iOS optimization settings
 */
export interface iOSOptimizations {
    /** Enable Swift compiler optimizations */
    swiftOptimization: 'none' | 'speed' | 'size';
    /** Enable whole module optimization */
    wholeModuleOptimization: boolean;
    /** Strip debug symbols */
    stripDebugSymbols: boolean;
    /** Enable bitcode */
    enableBitcode: boolean;
    /** Dead code stripping */
    deadCodeStripping: boolean;
}
/**
 * Android optimization settings
 */
export interface AndroidOptimizations {
    /** Enable Kotlin compiler optimizations */
    kotlinOptimization: boolean;
    /** Enable ProGuard/R8 minification */
    minifyEnabled: boolean;
    /** Enable resource shrinking */
    shrinkResources: boolean;
    /** Enable code obfuscation */
    obfuscate: boolean;
    /** Debuggable flag */
    debuggable: boolean;
}
/**
 * Web optimization settings
 */
export interface WebOptimizations {
    /** Enable minification */
    minify: boolean;
    /** Enable tree shaking */
    treeShaking: boolean;
    /** Enable code splitting */
    codeSplitting: boolean;
    /** Compression level */
    compression: 'none' | 'gzip' | 'brotli';
    /** Generate source maps */
    sourceMaps: boolean | 'inline' | 'external';
}
/**
 * Build mode configuration with optimizations
 */
export interface BuildModeConfig {
    /** Build mode type */
    mode: BuildModeType;
    /** Platform-specific optimizations */
    optimizations: PlatformOptimizations;
    /** Global build settings */
    settings: {
        /** Enable source maps */
        sourceMaps: boolean;
        /** Enable minification */
        minify: boolean;
        /** Enable incremental builds */
        incremental: boolean;
        /** Verbose logging */
        verbose: boolean;
    };
}
/**
 * Build Mode Manager
 *
 * Manages build mode configurations and applies platform-specific
 * optimizations based on development or production mode.
 */
export declare class BuildModeManager {
    /**
     * Get build mode configuration for specified mode
     */
    getBuildModeConfig(mode: BuildModeType): BuildModeConfig;
    /**
     * Get development mode configuration
     *
     * Development mode prioritizes:
     * - Fast build times
     * - Debugging capabilities
     * - Source maps
     * - Verbose error messages
     */
    private getDevelopmentConfig;
    /**
     * Get production mode configuration
     *
     * Production mode prioritizes:
     * - Optimized bundle sizes
     * - Performance
     * - Security (obfuscation)
     * - Minimal debug information
     */
    private getProductionConfig;
    /**
     * Apply build mode configuration to build config
     */
    applyBuildMode(config: BuildConfig, modeConfig: BuildModeConfig): BuildConfig;
    /**
     * Get platform-specific optimizations for a platform
     */
    getPlatformOptimizations(mode: BuildModeType, platform: Platform): iOSOptimizations | AndroidOptimizations | WebOptimizations;
    /**
     * Validate build mode configuration
     */
    validateBuildMode(config: BuildConfig): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    /**
     * Get build mode description
     */
    getBuildModeDescription(mode: BuildModeType): string;
    /**
     * Compare two build modes
     */
    compareBuildModes(mode1: BuildModeType, mode2: BuildModeType): {
        same: boolean;
        differences: string[];
    };
}
//# sourceMappingURL=BuildMode.d.ts.map