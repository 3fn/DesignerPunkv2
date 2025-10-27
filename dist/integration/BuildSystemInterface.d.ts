/**
 * Build System Integration Interface
 *
 * Provides standardized interface for integrating the Mathematical Token System
 * with various build systems (webpack, rollup, vite, etc.). Enables seamless
 * platform file selection and build-time optimization.
 */
import type { TranslationOutput } from '../types';
/**
 * Supported build systems
 */
export type BuildSystem = 'webpack' | 'rollup' | 'vite' | 'esbuild' | 'parcel' | 'custom';
/**
 * Target platform for build output
 */
export type TargetPlatform = 'web' | 'ios' | 'android';
/**
 * Build system configuration
 */
export interface BuildSystemConfig {
    /** Build system type */
    system: BuildSystem;
    /** Target platform(s) for this build */
    targets: TargetPlatform[];
    /** Enable tree-shaking optimization */
    treeShaking?: boolean;
    /** Output directory for generated token files */
    outputDir?: string;
    /** Enable source maps for debugging */
    sourceMaps?: boolean;
    /** Custom file naming pattern */
    filePattern?: string;
    /** Additional build system specific options */
    customOptions?: Record<string, unknown>;
}
/**
 * Build integration result
 */
export interface BuildIntegrationResult {
    /** Whether integration was successful */
    success: boolean;
    /** Generated files for the build */
    files: TranslationOutput[];
    /** Platform-specific entry points */
    entryPoints: Map<TargetPlatform, string>;
    /** Build system specific configuration */
    buildConfig: Record<string, unknown>;
    /** Any warnings during integration */
    warnings: string[];
    /** Error message if integration failed */
    error?: string;
}
/**
 * Build system integration interface
 *
 * Provides methods for integrating token generation with build systems,
 * enabling platform-specific file selection and optimization.
 */
export interface IBuildSystemIntegration {
    /**
     * Configure the build system integration
     */
    configure(config: BuildSystemConfig): void;
    /**
     * Generate platform-specific token files for the build
     */
    generateForBuild(platforms: TargetPlatform[]): Promise<BuildIntegrationResult>;
    /**
     * Get entry point for a specific platform
     */
    getEntryPoint(platform: TargetPlatform): string;
    /**
     * Get build system specific configuration
     */
    getBuildConfig(): Record<string, unknown>;
    /**
     * Validate build configuration
     */
    validateConfig(config: BuildSystemConfig): {
        valid: boolean;
        errors: string[];
    };
}
/**
 * Build system integration implementation
 */
export declare class BuildSystemIntegration implements IBuildSystemIntegration {
    private config;
    private generatedFiles;
    configure(config: BuildSystemConfig): void;
    generateForBuild(platforms: TargetPlatform[]): Promise<BuildIntegrationResult>;
    getEntryPoint(platform: TargetPlatform): string;
    getBuildConfig(): Record<string, unknown>;
    validateConfig(config: BuildSystemConfig): {
        valid: boolean;
        errors: string[];
    };
    private generatePlatformFile;
    private generateBuildConfig;
    private generateWebpackConfig;
    private generateRollupConfig;
    private generateViteConfig;
    private generateEsbuildConfig;
    private generateAliases;
    private generateExternals;
}
//# sourceMappingURL=BuildSystemInterface.d.ts.map