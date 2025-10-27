import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';
import { BasePathProvider, BuildSystemConfig, OptimizedFileStructure } from './PathProvider';
/**
 * Android file organization implementation
 * Organizes tokens for Kotlin/XML structure with Gradle integration
 */
export declare class AndroidFileOrganizer extends BasePathProvider {
    readonly platform: TargetPlatform;
    getBaseDirectory(): string;
    getFileName(format: OutputFormat): string;
    getDirectoryStructure(): string[];
    /**
     * Override getFilePath to handle Android's dual structure (kotlin/res)
     */
    getFilePath(format: OutputFormat, options?: any): string;
    getBuildSystemIntegration(): BuildSystemConfig;
    optimizeForBuildSystem(files: string[]): OptimizedFileStructure;
    /**
     * Get Kotlin constant naming convention
     * @param tokenName - Original token name
     * @returns Kotlin constant name
     */
    getKotlinConstantName(tokenName: string): string;
    /**
     * Get XML resource naming convention
     * @param tokenName - Original token name
     * @returns XML resource name
     */
    getXMLResourceName(tokenName: string): string;
    /**
     * Get Kotlin object organization
     * @returns Object organization pattern
     */
    getKotlinObjectOrganization(): string;
    /**
     * Get XML resource organization
     * @returns XML organization pattern
     */
    getXMLResourceOrganization(): string;
    /**
     * Validate Android-specific file path conventions
     */
    validatePath(filePath: string): {
        valid: boolean;
        errors?: string[];
    };
    /**
     * Get resource qualifier paths for mode-aware resources
     */
    getResourceQualifierPaths(): {
        light: string;
        dark: string;
        densities: Record<string, string>;
    };
}
//# sourceMappingURL=AndroidFileOrganizer.d.ts.map