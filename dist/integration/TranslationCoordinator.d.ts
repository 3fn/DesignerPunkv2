/**
 * Translation Coordinator
 *
 * Coordinates translation services to generate platform-specific token files
 * while maintaining cross-platform mathematical consistency. Manages Unit,
 * Format, and Path providers to produce optimized output for each platform.
 */
import { PrimitiveTokenRegistry } from '../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../registries/SemanticTokenRegistry';
import type { TranslationOutput, TargetPlatform, ValidationResult } from '../types';
/**
 * Translation coordinator configuration
 */
export interface TranslationCoordinatorConfig {
    enabledPlatforms: TargetPlatform[];
    outputDirectory: string;
    includeComments: boolean;
}
/**
 * Translation Coordinator class managing cross-platform token generation
 */
export declare class TranslationCoordinator {
    private primitiveRegistry;
    private semanticRegistry;
    private config;
    private platformProviders;
    private generationHistory;
    private lastGenerationTime?;
    private generatedFileCount;
    constructor(primitiveRegistry: PrimitiveTokenRegistry, semanticRegistry: SemanticTokenRegistry, config: TranslationCoordinatorConfig);
    /**
     * Initialize providers for all platforms
     */
    private initializePlatformProviders;
    /**
     * Generate platform-specific token files for all enabled platforms
     */
    generateAllPlatforms(): Promise<TranslationOutput[]>;
    /**
     * Generate platform-specific token files for a specific platform
     */
    generateForPlatform(platform: TargetPlatform): Promise<TranslationOutput>;
    /**
     * Convert tokens to platform-specific values using unit provider
     */
    private convertTokensForPlatform;
    /**
     * Get output format for a platform
     */
    private getFormatForPlatform;
    /**
     * Validate cross-platform mathematical consistency
     */
    validateCrossPlatformConsistency(): ValidationResult[];
    /**
     * Validate consistency for a single token across platforms
     */
    private validateTokenConsistency;
    /**
     * Record a generation event
     */
    private recordGeneration;
    /**
     * Get generation history
     */
    getGenerationHistory(): typeof this.generationHistory;
    /**
     * Get generation statistics
     */
    getGenerationStats(): {
        totalGenerations: number;
        successfulGenerations: number;
        failedGenerations: number;
        successRate: number;
        generationsByPlatform: Record<TargetPlatform, number>;
    };
    /**
     * Get last generation time
     */
    getLastGenerationTime(): Date | undefined;
    /**
     * Get generated file count
     */
    getGeneratedFileCount(): number;
    /**
     * Clear generation history
     */
    clearGenerationHistory(): void;
    /**
     * Clear generation cache
     */
    clearGenerationCache(): void;
    /**
     * Update coordinator configuration
     */
    updateConfig(config: Partial<TranslationCoordinatorConfig>): void;
    /**
     * Get current configuration
     */
    getConfig(): Readonly<TranslationCoordinatorConfig>;
    /**
     * Get available platforms
     */
    getAvailablePlatforms(): TargetPlatform[];
    /**
     * Check if a platform is enabled
     */
    isPlatformEnabled(platform: TargetPlatform): boolean;
    /**
     * Enable a platform
     */
    enablePlatform(platform: TargetPlatform): void;
    /**
     * Disable a platform
     */
    disablePlatform(platform: TargetPlatform): void;
}
//# sourceMappingURL=TranslationCoordinator.d.ts.map