/**
 * Analysis Configuration Schema Validation
 *
 * Provides validation for release analysis configuration
 * Adapted from release management system for CLI-driven workflow
 */
export interface AnalysisConfigValidationResult {
    valid: boolean;
    errors: ConfigValidationError[];
    warnings: ConfigValidationWarning[];
}
export interface ConfigValidationError {
    path: string;
    message: string;
    value?: any;
    expectedType?: string;
}
export interface ConfigValidationWarning {
    path: string;
    message: string;
    suggestion?: string;
}
/**
 * Validates analysis configuration object
 */
export declare function validateAnalysisConfig(config: any): AnalysisConfigValidationResult;
/**
 * Validates that configuration paths exist and are accessible
 */
export declare function validateConfigurationPaths(config: any): AnalysisConfigValidationResult;
//# sourceMappingURL=AnalysisConfigSchema.d.ts.map