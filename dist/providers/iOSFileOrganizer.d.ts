import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';
import { BasePathProvider, BuildSystemConfig, OptimizedFileStructure } from './PathProvider';
/**
 * iOS file organization implementation
 * Organizes tokens for Swift project structure with Xcode integration
 */
export declare class iOSFileOrganizer extends BasePathProvider {
    readonly platform: TargetPlatform;
    getBaseDirectory(): string;
    getFileName(format: OutputFormat): string;
    getDirectoryStructure(): string[];
    getBuildSystemIntegration(): BuildSystemConfig;
    optimizeForBuildSystem(files: string[]): OptimizedFileStructure;
    /**
     * Get Swift constant naming convention
     * @param tokenName - Original token name
     * @returns Swift constant name
     */
    getSwiftConstantName(tokenName: string): string;
    /**
     * Get Swift struct organization
     * @returns Struct organization pattern
     */
    getSwiftStructOrganization(): string;
    /**
     * Validate iOS-specific file path conventions
     */
    validatePath(filePath: string): {
        valid: boolean;
        errors?: string[];
    };
    /**
     * Get Xcode project integration details
     */
    getXcodeIntegration(): {
        targetMembership: string;
        buildPhase: string;
        fileType: string;
        group: string;
    };
}
//# sourceMappingURL=iOSFileOrganizer.d.ts.map