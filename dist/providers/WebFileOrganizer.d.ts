import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';
import { BasePathProvider, BuildSystemConfig, OptimizedFileStructure } from './PathProvider';
/**
 * Web file organization implementation
 * Organizes tokens for CSS structure with webpack/vite optimization
 */
export declare class WebFileOrganizer extends BasePathProvider {
    readonly platform: TargetPlatform;
    getBaseDirectory(): string;
    getFileName(format: OutputFormat): string;
    getDirectoryStructure(): string[];
    getBuildSystemIntegration(): BuildSystemConfig;
    optimizeForBuildSystem(files: string[]): OptimizedFileStructure;
    /**
     * Get CSS custom property naming convention
     * @param tokenName - Original token name
     * @returns CSS custom property name
     */
    getCSSCustomPropertyName(tokenName: string): string;
    /**
     * Get JavaScript export naming convention
     * @param tokenName - Original token name
     * @returns JavaScript export name
     * @deprecated JavaScript format no longer supported - method maintained for interface compatibility
     */
    getJavaScriptExportName(tokenName: string): string;
    /**
     * Validate web-specific file path conventions
     */
    validatePath(filePath: string): {
        valid: boolean;
        errors?: string[];
    };
}
//# sourceMappingURL=WebFileOrganizer.d.ts.map