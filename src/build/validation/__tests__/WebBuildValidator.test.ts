/**
 * @category evergreen
 * @purpose Verify build system generates required outputs with correct structure
 */
/**
 * Web Build Validator Tests
 * 
 * Tests validation of Web build output including:
 * - package.json syntax and structure
 * - CSS custom properties validity
 * - NPM package installability
 * - Web-specific optimizations
 * 
 * Requirements: 2.3, 2.7, 5.3
 */

import { WebBuildValidator } from '../WebBuildValidator';
import { WebBuilder } from '../../platforms/WebBuilder';
import type { BuildConfig, ValidationResult, BuildResult } from '../../types';

describe('WebBuildValidator', () => {
    let validator: WebBuildValidator;
    let webBuilder: WebBuilder;
    let mockConfig: BuildConfig;

    beforeEach(() => {
        validator = new WebBuildValidator();
        webBuilder = new WebBuilder();

        mockConfig = {
            platforms: ['web'],
            mode: 'production',
            outputDir: './test-output',
            parallel: false,
            incremental: false,
            sourceMaps: true,
            minify: true,
            validation: {
                interfaces: true,
                tokens: true,
                mathematical: true
            }
        };
    });

    describe('package.json validation', () => {
        it('should validate package.json has required fields', () => {
            const packageJson = {
                name: '@designerpunk/tokens',
                version: '1.0.0',
                description: 'DesignerPunk design tokens',
                main: './dist/index.js',
                module: './dist/index.mjs',
                types: './dist/index.d.ts',
                exports: {
                    '.': {
                        import: './dist/index.mjs',
                        require: './dist/index.js',
                        types: './dist/index.d.ts'
                    },
                    './tokens.css': './dist/tokens.css'
                }
            };

            const result = validator.validatePackageJson(packageJson);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should detect missing required fields in package.json', () => {
            const invalidPackageJson = {
                name: '@designerpunk/tokens'
                // Missing version, main, module, types
            };

            const result = validator.validatePackageJson(invalidPackageJson);

            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors.some((e: string) => e.includes('version'))).toBe(true);
        });

        it('should validate package.json exports configuration', () => {
            const packageJson = {
                name: '@designerpunk/tokens',
                version: '1.0.0',
                main: './dist/index.js',
                module: './dist/index.mjs',
                types: './dist/index.d.ts',
                exports: {
                    '.': {
                        import: './dist/index.mjs',
                        require: './dist/index.js',
                        types: './dist/index.d.ts'
                    },
                    './tokens.css': './dist/tokens.css'
                }
            };

            const result = validator.validatePackageJson(packageJson);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate package.json syntax is valid JSON', () => {
            const validJson = JSON.stringify({
                name: '@designerpunk/tokens',
                version: '1.0.0',
                main: './dist/index.js'
            });

            const result = validator.validatePackageJsonSyntax(validJson);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should detect invalid JSON syntax', () => {
            const invalidJson = '{ name: "@designerpunk/tokens", version: "1.0.0" }'; // Missing quotes

            const result = validator.validatePackageJsonSyntax(invalidJson);

            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });

    describe('CSS custom properties validation', () => {
        it('should validate CSS custom properties syntax', () => {
            const css = `
:root {
  --space-100: 8px;
  --space-150: 12px;
  --space-200: 16px;
  --color-blue-500: #3B82F6;
  --color-primary: var(--color-blue-500);
}
      `.trim();

            const result = validator.validateCSSCustomProperties(css);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should detect invalid CSS syntax', () => {
            const invalidCss = `
:root {
  --space-100 8px;  /* Missing colon */
  --space-150: 12px
  --space-200: 16px;
}
      `.trim();

            const result = validator.validateCSSCustomProperties(invalidCss);

            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should validate CSS custom property naming conventions', () => {
            const css = `
:root {
  --space-100: 8px;
  --color-blue-500: #3B82F6;
  --typography-body-size: 16px;
}
      `.trim();

            const result = validator.validateCSSNamingConventions(css);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should detect invalid naming conventions', () => {
            const css = `
:root {
  --Space100: 8px;  /* Should be lowercase */
  --color_blue_500: #3B82F6;  /* Should use hyphens */
}
      `.trim();

            const result = validator.validateCSSNamingConventions(css);

            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should validate CSS custom property values', () => {
            const css = `
:root {
  --space-100: 8px;
  --space-150: 12px;
  --color-blue-500: #3B82F6;
  --color-primary: var(--color-blue-500);
}
      `.trim();

            const result = validator.validateCSSPropertyValues(css);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
    });

    describe('NPM package installability', () => {
        it('should validate package structure for NPM installation', () => {
            const packageStructure = {
                'package.json': true,
                'dist/index.js': true,
                'dist/index.mjs': true,
                'dist/index.d.ts': true,
                'dist/tokens.css': true,
                'README.md': true
            };

            const result = validator.validatePackageStructure(packageStructure);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should detect missing required files', () => {
            const incompleteStructure = {
                'package.json': true,
                'dist/index.js': true
                // Missing module, types, CSS
            };

            const result = validator.validatePackageStructure(incompleteStructure);

            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        it('should validate package can be imported as ESM', () => {
            const packageJson = {
                name: '@designerpunk/tokens',
                version: '1.0.0',
                type: 'module',
                exports: {
                    '.': {
                        import: './dist/index.mjs',
                        types: './dist/index.d.ts'
                    }
                }
            };

            const result = validator.validateESMSupport(packageJson);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate package can be imported as CommonJS', () => {
            const packageJson = {
                name: '@designerpunk/tokens',
                version: '1.0.0',
                main: './dist/index.js',
                exports: {
                    '.': {
                        require: './dist/index.js',
                        types: './dist/index.d.ts'
                    }
                }
            };

            const result = validator.validateCommonJSSupport(packageJson);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
    });

    describe('Web-specific optimizations', () => {
        it('should validate Shadow DOM support', () => {
            const webComponent = `
class DesignToken extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  
  connectedCallback() {
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = \`
        <style>
          :host {
            display: block;
          }
        </style>
        <slot></slot>
      \`;
    }
  }
}

customElements.define('design-token', DesignToken);
      `.trim();

            const result = validator.validateShadowDOMSupport(webComponent);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate custom elements registration', () => {
            const webComponent = `
customElements.define('design-token', DesignToken);
customElements.define('design-button', DesignButton);
      `.trim();

            const result = validator.validateCustomElementsRegistration(webComponent);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate CSS custom properties are scoped correctly', () => {
            const css = `
:host {
  --space-100: 8px;
  --color-primary: #3B82F6;
}

:host([theme="dark"]) {
  --color-primary: #60A5FA;
}
      `.trim();

            const result = validator.validateCSSScopingOptimization(css);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate tree-shaking support', () => {
            const packageJson = {
                name: '@designerpunk/tokens',
                version: '1.0.0',
                sideEffects: false,
                exports: {
                    '.': {
                        import: './dist/index.mjs'
                    },
                    './tokens/*': './dist/tokens/*.mjs'
                }
            };

            const result = validator.validateTreeShakingSupport(packageJson);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate minification is applied in production mode', () => {
            const minifiedCode = 'const t={space100:8,space150:12};export{t as tokens};';

            const result = validator.validateMinification(minifiedCode, 'production');

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should validate source maps are generated', () => {
            const sourceMapContent = {
                version: 3,
                sources: ['../src/tokens/index.ts'],
                names: [],
                mappings: 'AAAA',
                file: 'index.js'
            };

            const result = validator.validateSourceMaps(sourceMapContent);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });
    });

    describe('comprehensive build validation', () => {
        it('should perform complete Web build validation', () => {
            const buildOutput = {
                packageJson: {
                    name: '@designerpunk/tokens',
                    version: '1.0.0',
                    main: './dist/index.js',
                    module: './dist/index.mjs',
                    types: './dist/index.d.ts',
                    sideEffects: false,
                    exports: {
                        '.': {
                            import: './dist/index.mjs',
                            require: './dist/index.js',
                            types: './dist/index.d.ts'
                        },
                        './tokens.css': './dist/tokens.css'
                    }
                },
                css: ':root { --space-100: 8px; --color-primary: #3B82F6; }',
                structure: {
                    'package.json': true,
                    'dist/index.js': true,
                    'dist/index.mjs': true,
                    'dist/index.d.ts': true,
                    'dist/tokens.css': true
                },
                optimizations: {
                    shadowDOM: true,
                    customElements: true,
                    treeShaking: true,
                    minification: true,
                    sourceMaps: true
                }
            };

            const result = validator.validateCompleteBuild(buildOutput);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.warnings).toBeDefined();
        });

        it('should aggregate validation errors from all checks', () => {
            const invalidBuildOutput = {
                packageJson: {
                    name: '@designerpunk/tokens'
                    // Missing required fields
                },
                css: ':root { --Space100 8px }', // Invalid syntax
                structure: {
                    'package.json': true
                    // Missing required files
                },
                optimizations: {
                    shadowDOM: false,
                    customElements: false,
                    treeShaking: false,
                    minification: false,
                    sourceMaps: false
                }
            };

            const result = validator.validateCompleteBuild(invalidBuildOutput);

            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });

    describe('integration with WebBuilder', () => {
        it('should validate output from WebBuilder', () => {
            // Create a mock build result instead of calling build
            const mockBuildResult: BuildResult = {
                platform: 'web',
                success: true,
                packagePath: './test-output/web',
                duration: 1000,
                warnings: [],
                errors: []
            };

            const validationResult = validator.validateBuildResult(mockBuildResult);

            expect(validationResult).toBeDefined();
            expect(validationResult.platform).toBe('web');
        });

        it('should provide actionable error messages', () => {
            const invalidBuildOutput = {
                packageJson: {},
                css: '',
                structure: {},
                optimizations: {
                    shadowDOM: false,
                    customElements: false,
                    treeShaking: false,
                    minification: false,
                    sourceMaps: false
                }
            };

            const result = validator.validateCompleteBuild(invalidBuildOutput);

            expect(result.valid).toBe(false);
            result.errors.forEach((error: string) => {
                expect(error).toMatch(/^(Missing|Invalid|Expected)/);
                expect(error.length).toBeGreaterThan(10);
            });
        });
    });
});
