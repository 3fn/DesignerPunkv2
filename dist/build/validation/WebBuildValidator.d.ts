/**
 * Web Build Validator
 *
 * Validates Web build output including:
 * - package.json syntax and structure
 * - CSS custom properties validity
 * - NPM package installability
 * - Web-specific optimizations
 *
 * Requirements: 2.3, 2.7, 5.3
 */
import type { ValidationResult as BaseValidationResult, BuildResult } from '../types';
interface ValidationResult extends BaseValidationResult {
    component?: string;
    platform?: string;
}
interface PackageJson {
    name?: string;
    version?: string;
    description?: string;
    main?: string;
    module?: string;
    types?: string;
    type?: string;
    sideEffects?: boolean;
    exports?: Record<string, any>;
    [key: string]: any;
}
interface PackageStructure {
    [path: string]: boolean;
}
interface BuildOptimizations {
    shadowDOM: boolean;
    customElements: boolean;
    treeShaking: boolean;
    minification: boolean;
    sourceMaps: boolean;
}
interface CompleteBuildOutput {
    packageJson: PackageJson;
    css: string;
    structure: PackageStructure;
    optimizations: BuildOptimizations;
}
export declare class WebBuildValidator {
    /**
     * Validate package.json has required fields and proper structure
     */
    validatePackageJson(packageJson: PackageJson): ValidationResult;
    /**
     * Validate package.json syntax is valid JSON
     */
    validatePackageJsonSyntax(jsonString: string): ValidationResult;
    /**
     * Validate CSS custom properties syntax
     */
    validateCSSCustomProperties(css: string): ValidationResult;
    /**
     * Validate CSS custom property naming conventions
     */
    validateCSSNamingConventions(css: string): ValidationResult;
    /**
     * Validate CSS custom property values
     */
    validateCSSPropertyValues(css: string): ValidationResult;
    /**
     * Validate package structure for NPM installation
     */
    validatePackageStructure(structure: PackageStructure): ValidationResult;
    /**
     * Validate package can be imported as ESM
     */
    validateESMSupport(packageJson: PackageJson): ValidationResult;
    /**
     * Validate package can be imported as CommonJS
     */
    validateCommonJSSupport(packageJson: PackageJson): ValidationResult;
    /**
     * Validate Shadow DOM support in Web Components
     */
    validateShadowDOMSupport(componentCode: string): ValidationResult;
    /**
     * Validate custom elements registration
     */
    validateCustomElementsRegistration(componentCode: string): ValidationResult;
    /**
     * Validate CSS scoping optimization
     */
    validateCSSScopingOptimization(css: string): ValidationResult;
    /**
     * Validate tree-shaking support
     */
    validateTreeShakingSupport(packageJson: PackageJson): ValidationResult;
    /**
     * Validate minification is applied
     */
    validateMinification(code: string, mode: string): ValidationResult;
    /**
     * Validate source maps are generated
     */
    validateSourceMaps(sourceMap: any): ValidationResult;
    /**
     * Perform complete Web build validation
     */
    validateCompleteBuild(buildOutput: CompleteBuildOutput): ValidationResult;
    /**
     * Validate build result from WebBuilder
     */
    validateBuildResult(buildResult: BuildResult): ValidationResult;
}
export {};
//# sourceMappingURL=WebBuildValidator.d.ts.map