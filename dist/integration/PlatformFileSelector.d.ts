/**
 * Platform File Selector
 *
 * Provides intelligent platform file selection for build systems, enabling
 * seamless integration with cross-platform builds. Automatically selects
 * appropriate token files based on build target and environment.
 */
import type { TargetPlatform } from './BuildSystemInterface';
import type { TranslationOutput } from '../types';
/**
 * Platform detection strategy
 */
export type PlatformDetectionStrategy = 'explicit' | 'environment' | 'package' | 'auto';
/**
 * Platform selection options
 */
export interface PlatformSelectionOptions {
    /** Detection strategy to use */
    strategy?: PlatformDetectionStrategy;
    /** Fallback platform if detection fails */
    fallback?: TargetPlatform;
    /** Custom environment variable name for platform detection */
    envVar?: string;
    /** Enable strict mode (throw error if platform cannot be determined) */
    strict?: boolean;
}
/**
 * Platform selection result
 */
export interface PlatformSelectionResult {
    /** Selected platform */
    platform: TargetPlatform;
    /** Detection strategy that was used */
    strategyUsed: PlatformDetectionStrategy;
    /** Whether fallback was used */
    usedFallback: boolean;
    /** Confidence level (0-1) in the selection */
    confidence: number;
    /** Additional context about the selection */
    context: string;
}
/**
 * Platform file selector
 *
 * Intelligently selects appropriate platform-specific token files based on
 * build context, environment, and configuration.
 */
export declare class PlatformFileSelector {
    private availableFiles;
    private options;
    constructor(options?: PlatformSelectionOptions);
    /**
     * Register available platform files
     */
    registerFiles(files: TranslationOutput[]): void;
    /**
     * Select platform based on configuration and context
     */
    selectPlatform(explicitPlatform?: TargetPlatform): PlatformSelectionResult;
    /**
     * Get file path for selected platform
     */
    getFilePath(platform: TargetPlatform): string;
    /**
     * Get all available platforms
     */
    getAvailablePlatforms(): TargetPlatform[];
    /**
     * Check if platform is available
     */
    isPlatformAvailable(platform: TargetPlatform): boolean;
    private selectExplicit;
    private handleMissingExplicit;
    private selectFromEnvironment;
    private selectFromPackage;
    private selectAuto;
    private selectFallback;
    private normalizePlatform;
}
/**
 * Create a platform file selector with default options
 */
export declare function createPlatformSelector(options?: PlatformSelectionOptions): PlatformFileSelector;
//# sourceMappingURL=PlatformFileSelector.d.ts.map