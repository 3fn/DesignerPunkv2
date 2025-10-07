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

// Extended validation result with component and platform info
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

export class WebBuildValidator {
  /**
   * Validate package.json has required fields and proper structure
   */
  validatePackageJson(packageJson: PackageJson): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    const requiredFields = ['name', 'version', 'main', 'module', 'types'];
    for (const field of requiredFields) {
      if (!packageJson[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Validate exports configuration
    if (!packageJson.exports) {
      warnings.push('Missing exports field - recommended for modern NPM packages');
    } else {
      if (!packageJson.exports['.']) {
        errors.push('Missing root export in exports field');
      }
    }

    // Validate name format
    if (packageJson.name && !packageJson.name.match(/^(@[a-z0-9-]+\/)?[a-z0-9-]+$/)) {
      errors.push('Package name must be lowercase with hyphens only');
    }

    // Validate version format
    if (packageJson.version && !packageJson.version.match(/^\d+\.\d+\.\d+/)) {
      errors.push('Version must follow semver format (e.g., 1.0.0)');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'package.json',
      platform: 'web'
    };
  }

  /**
   * Validate package.json syntax is valid JSON
   */
  validatePackageJsonSyntax(jsonString: string): ValidationResult {
    const errors: string[] = [];

    try {
      JSON.parse(jsonString);
    } catch (error) {
      errors.push(`Invalid JSON syntax: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: [],
      component: 'package.json',
      platform: 'web'
    };
  }

  /**
   * Validate CSS custom properties syntax
   */
  validateCSSCustomProperties(css: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for :root selector
    if (!css.includes(':root')) {
      warnings.push('CSS custom properties should be defined in :root selector');
    }

    // Check for basic syntax errors
    const lines = css.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines and selectors
      if (!line || line.startsWith(':') || line === '{' || line === '}') {
        continue;
      }

      // Check for custom property syntax
      if (line.startsWith('--')) {
        if (!line.includes(':')) {
          errors.push(`Line ${i + 1}: Missing colon in custom property declaration`);
        }
        if (!line.endsWith(';') && !line.endsWith('}')) {
          errors.push(`Line ${i + 1}: Missing semicolon at end of declaration`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'CSS',
      platform: 'web'
    };
  }

  /**
   * Validate CSS custom property naming conventions
   */
  validateCSSNamingConventions(css: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Extract custom property names
    const propertyRegex = /--([\w-]+):/g;
    let match;

    while ((match = propertyRegex.exec(css)) !== null) {
      const propertyName = match[1];

      // Check for lowercase with hyphens
      if (!propertyName.match(/^[a-z0-9-]+$/)) {
        errors.push(`Invalid property name: --${propertyName} (use lowercase with hyphens)`);
      }

      // Check for underscores (should use hyphens)
      if (propertyName.includes('_')) {
        errors.push(`Property --${propertyName} uses underscores (use hyphens instead)`);
      }

      // Check for camelCase (should use kebab-case)
      if (propertyName.match(/[A-Z]/)) {
        errors.push(`Property --${propertyName} uses uppercase (use lowercase with hyphens)`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'CSS naming',
      platform: 'web'
    };
  }

  /**
   * Validate CSS custom property values
   */
  validateCSSPropertyValues(css: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Extract property declarations
    const declarationRegex = /--([\w-]+):\s*([^;]+);/g;
    let match;

    while ((match = declarationRegex.exec(css)) !== null) {
      const propertyName = match[1];
      const value = match[2].trim();

      // Check for empty values
      if (!value) {
        errors.push(`Property --${propertyName} has empty value`);
        continue;
      }

      // Validate var() references
      if (value.startsWith('var(')) {
        if (!value.match(/^var\(--[\w-]+\)$/)) {
          errors.push(`Property --${propertyName} has invalid var() reference: ${value}`);
        }
      }

      // Validate color values
      if (propertyName.includes('color') && !value.startsWith('var(')) {
        if (!value.match(/^#[0-9A-Fa-f]{6}$/) && !value.match(/^#[0-9A-Fa-f]{8}$/)) {
          warnings.push(`Property --${propertyName} color value should be hex format: ${value}`);
        }
      }

      // Validate spacing values
      if (propertyName.includes('space') && !value.startsWith('var(')) {
        if (!value.match(/^\d+(\.\d+)?(px|rem|em)$/)) {
          warnings.push(`Property --${propertyName} spacing value should have units: ${value}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'CSS values',
      platform: 'web'
    };
  }

  /**
   * Validate package structure for NPM installation
   */
  validatePackageStructure(structure: PackageStructure): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required files
    const requiredFiles = [
      'package.json',
      'dist/index.js',
      'dist/index.mjs',
      'dist/index.d.ts',
      'dist/tokens.css'
    ];

    for (const file of requiredFiles) {
      if (!structure[file]) {
        errors.push(`Missing required file: ${file}`);
      }
    }

    // Recommended files
    const recommendedFiles = ['README.md', 'LICENSE'];
    for (const file of recommendedFiles) {
      if (!structure[file]) {
        warnings.push(`Missing recommended file: ${file}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'package structure',
      platform: 'web'
    };
  }

  /**
   * Validate package can be imported as ESM
   */
  validateESMSupport(packageJson: PackageJson): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for module field or exports with import
    if (!packageJson.module && !packageJson.exports?.['.']?.import) {
      errors.push('Missing ESM support - add module field or exports.import');
    }

    // Check for type: "module" if using .js extension
    if (packageJson.module?.endsWith('.js') && packageJson.type !== 'module') {
      warnings.push('Consider adding "type": "module" for .js ESM files');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'ESM support',
      platform: 'web'
    };
  }

  /**
   * Validate package can be imported as CommonJS
   */
  validateCommonJSSupport(packageJson: PackageJson): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for main field or exports with require
    if (!packageJson.main && !packageJson.exports?.['.']?.require) {
      errors.push('Missing CommonJS support - add main field or exports.require');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'CommonJS support',
      platform: 'web'
    };
  }

  /**
   * Validate Shadow DOM support in Web Components
   */
  validateShadowDOMSupport(componentCode: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for attachShadow call
    if (!componentCode.includes('attachShadow')) {
      warnings.push('Component does not use Shadow DOM - consider for style encapsulation');
    }

    // Check for shadowRoot usage
    if (componentCode.includes('attachShadow') && !componentCode.includes('shadowRoot')) {
      errors.push('Component attaches shadow but does not use shadowRoot');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'Shadow DOM',
      platform: 'web'
    };
  }

  /**
   * Validate custom elements registration
   */
  validateCustomElementsRegistration(componentCode: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for customElements.define
    if (!componentCode.includes('customElements.define')) {
      errors.push('Missing customElements.define() call');
    }

    // Check for valid custom element names (must contain hyphen)
    const defineRegex = /customElements\.define\(['"]([^'"]+)['"]/g;
    let match;

    while ((match = defineRegex.exec(componentCode)) !== null) {
      const elementName = match[1];
      if (!elementName.includes('-')) {
        errors.push(`Invalid custom element name: ${elementName} (must contain hyphen)`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'custom elements',
      platform: 'web'
    };
  }

  /**
   * Validate CSS scoping optimization
   */
  validateCSSScopingOptimization(css: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for :host selector (Shadow DOM scoping)
    if (css.includes(':host')) {
      // Good - using Shadow DOM scoping
    } else if (css.includes(':root')) {
      warnings.push('Using :root instead of :host - consider Shadow DOM for better encapsulation');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'CSS scoping',
      platform: 'web'
    };
  }

  /**
   * Validate tree-shaking support
   */
  validateTreeShakingSupport(packageJson: PackageJson): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for sideEffects field
    if (packageJson.sideEffects === undefined) {
      warnings.push('Missing sideEffects field - add "sideEffects": false for better tree-shaking');
    }

    // Check for ESM exports
    if (!packageJson.module && !packageJson.exports?.['.']?.import) {
      warnings.push('Missing ESM exports - required for tree-shaking');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'tree-shaking',
      platform: 'web'
    };
  }

  /**
   * Validate minification is applied
   */
  validateMinification(code: string, mode: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (mode === 'production') {
      // Check for minification indicators
      const hasWhitespace = code.includes('\n') || code.includes('  ');
      const hasComments = code.includes('//') || code.includes('/*');
      
      if (hasWhitespace || hasComments) {
        warnings.push('Production code appears not to be minified');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'minification',
      platform: 'web'
    };
  }

  /**
   * Validate source maps are generated
   */
  validateSourceMaps(sourceMap: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for required source map fields
    const requiredFields = ['version', 'sources', 'mappings', 'file'];
    for (const field of requiredFields) {
      if (!sourceMap[field]) {
        errors.push(`Missing required source map field: ${field}`);
      }
    }

    // Validate version
    if (sourceMap.version !== 3) {
      errors.push('Source map must be version 3');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'source maps',
      platform: 'web'
    };
  }

  /**
   * Perform complete Web build validation
   */
  validateCompleteBuild(buildOutput: CompleteBuildOutput): ValidationResult {
    const allErrors: string[] = [];
    const allWarnings: string[] = [];

    // Validate package.json
    const packageJsonResult = this.validatePackageJson(buildOutput.packageJson);
    allErrors.push(...packageJsonResult.errors);
    allWarnings.push(...packageJsonResult.warnings);

    // Validate CSS
    const cssResult = this.validateCSSCustomProperties(buildOutput.css);
    allErrors.push(...cssResult.errors);
    allWarnings.push(...cssResult.warnings);

    const cssNamingResult = this.validateCSSNamingConventions(buildOutput.css);
    allErrors.push(...cssNamingResult.errors);
    allWarnings.push(...cssNamingResult.warnings);

    const cssValuesResult = this.validateCSSPropertyValues(buildOutput.css);
    allErrors.push(...cssValuesResult.errors);
    allWarnings.push(...cssValuesResult.warnings);

    // Validate package structure
    const structureResult = this.validatePackageStructure(buildOutput.structure);
    allErrors.push(...structureResult.errors);
    allWarnings.push(...structureResult.warnings);

    // Validate module support
    const esmResult = this.validateESMSupport(buildOutput.packageJson);
    allErrors.push(...esmResult.errors);
    allWarnings.push(...esmResult.warnings);

    const cjsResult = this.validateCommonJSSupport(buildOutput.packageJson);
    allErrors.push(...cjsResult.errors);
    allWarnings.push(...cjsResult.warnings);

    // Validate optimizations
    const treeShakingResult = this.validateTreeShakingSupport(buildOutput.packageJson);
    allErrors.push(...treeShakingResult.errors);
    allWarnings.push(...treeShakingResult.warnings);

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      component: 'complete build',
      platform: 'web'
    };
  }

  /**
   * Validate build result from WebBuilder
   */
  validateBuildResult(buildResult: BuildResult): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check build success
    if (!buildResult.success) {
      errors.push('Build failed');
      errors.push(...buildResult.errors.map(e => e.message));
    }

    // Check platform
    if (buildResult.platform !== 'web') {
      errors.push(`Expected platform 'web', got '${buildResult.platform}'`);
    }

    // Check package path exists
    if (!buildResult.packagePath) {
      errors.push('Missing package path in build result');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      component: 'build result',
      platform: 'web'
    };
  }
}
