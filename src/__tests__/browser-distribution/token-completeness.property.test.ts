/**
 * @jest-environment node
 * @category evergreen
 * @purpose Property test for token CSS completeness
 */

/**
 * Token CSS Completeness Property Test
 *
 * Property 1: Token CSS Completeness
 * Verifies that all CSS custom properties referenced by DesignerPunk web components
 * exist in the generated tokens.css file.
 *
 * This property ensures that no component references a token that doesn't exist,
 * which would cause styling failures in browser environments.
 *
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 3.2
 * @validates Requirements 3.2
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Property 1: Token CSS Completeness', () => {
  const BROWSER_DIST_DIR = path.join(process.cwd(), 'dist', 'browser');
  const TOKENS_CSS_PATH = path.join(BROWSER_DIST_DIR, 'tokens.css');
  
  /**
   * Component source files that may contain CSS custom property references.
   * These are the web platform implementations of DesignerPunk components.
   */
  const COMPONENT_SOURCE_FILES = [
    'src/components/core/TextInputField/platforms/web/TextInputField.web.ts',
    'src/components/core/Button-CTA/platforms/web/ButtonCTA.web.ts',
    'src/components/core/Button-CTA/platforms/web/ButtonCTA.web.css',
    'src/components/core/Icon/platforms/web/Icon.web.ts',
    'src/components/core/Icon/platforms/web/Icon.web.css',
    'src/components/core/Container/platforms/web/Container.web.ts',
    'src/components/core/Container/platforms/web/token-mapping.ts',
    'src/components/core/Container/platforms/web/styles.css',
    'src/browser-entry.ts',
  ];

  /**
   * CSS custom properties that are standard browser properties or
   * intentionally not from the token system.
   * These are excluded from the completeness check.
   */
  const EXCLUDED_PROPERTIES = new Set([
    // Standard CSS properties that use var() syntax but aren't tokens
    'inherit',
    'currentColor',
    // Properties that are dynamically constructed or use token references
    // that get resolved at runtime (e.g., color-error, color-success-strong)
  ]);

  /**
   * Properties that are referenced but may be defined with different naming
   * conventions or are composite tokens.
   */
  const PROPERTY_ALIASES: Record<string, string> = {
    // Shadow hover is a composite token
    'shadow-hover': 'shadow-hover-offset-x', // Check for any shadow-hover-* token
  };

  let tokensContent: string;
  let availableTokens: Set<string>;

  beforeAll(() => {
    // Ensure tokens.css exists
    if (!fs.existsSync(TOKENS_CSS_PATH)) {
      throw new Error(
        'tokens.css not found. Run "npm run build:browser" first.'
      );
    }

    // Read tokens.css content
    tokensContent = fs.readFileSync(TOKENS_CSS_PATH, 'utf-8');

    // Extract all CSS custom property definitions from tokens.css
    // Matches: --property-name: value;
    const tokenDefinitionRegex = /--([a-zA-Z0-9-]+)\s*:/g;
    availableTokens = new Set<string>();
    
    let match;
    while ((match = tokenDefinitionRegex.exec(tokensContent)) !== null) {
      availableTokens.add(match[1]);
    }
  });

  /**
   * Extract CSS custom property references from a source file.
   * 
   * Matches patterns like:
   * - var(--property-name)
   * - var(--property-name, fallback)
   * 
   * @param content - File content to search
   * @returns Set of referenced property names (without -- prefix)
   */
  function extractCssPropertyReferences(content: string): Set<string> {
    const references = new Set<string>();
    
    // Match var(--property-name) or var(--property-name, fallback)
    const varRegex = /var\(\s*--([a-zA-Z0-9-]+)(?:\s*,\s*[^)]+)?\)/g;
    
    let match;
    while ((match = varRegex.exec(content)) !== null) {
      const propertyName = match[1];
      
      // Skip excluded properties
      if (!EXCLUDED_PROPERTIES.has(propertyName)) {
        references.add(propertyName);
      }
    }
    
    return references;
  }

  /**
   * Check if a property exists in tokens.css, considering aliases.
   * 
   * @param propertyName - Property name to check
   * @returns true if property exists (directly or via alias)
   */
  function propertyExistsInTokens(propertyName: string): boolean {
    // Direct match
    if (availableTokens.has(propertyName)) {
      return true;
    }
    
    // Check alias
    const alias = PROPERTY_ALIASES[propertyName];
    if (alias && availableTokens.has(alias)) {
      return true;
    }
    
    // Check if it's a prefix match (for composite tokens like shadow-hover)
    if (PROPERTY_ALIASES[propertyName]) {
      const prefix = PROPERTY_ALIASES[propertyName].replace(/-[^-]+$/, '');
      for (const token of availableTokens) {
        if (token.startsWith(prefix)) {
          return true;
        }
      }
    }
    
    return false;
  }

  describe('Token Definitions Exist', () => {
    /**
     * Property: tokens.css should contain token definitions
     * 
     * Basic sanity check that tokens.css has been generated with content.
     */
    it('should have token definitions in tokens.css', () => {
      expect(availableTokens.size).toBeGreaterThan(0);
      console.log(`Found ${availableTokens.size} token definitions in tokens.css`);
    });

    /**
     * Property: tokens.css should contain essential semantic tokens
     * 
     * Verifies that key semantic tokens used by components are present.
     */
    it('should contain essential semantic tokens', () => {
      const essentialTokens = [
        'color-primary',
        'color-error-strong',
        'color-success-strong',
        'color-text-default',
        'color-text-muted',
        'color-background',
        'color-surface',
        'color-border',
        'typography-label-md-font-size',
        'typography-label-md-line-height',
        'typography-body-md-font-size',
        'space-inset-100',
        'space-grouped-normal',
        'radius-100',
        'radius-150',
        'tap-area-minimum',
        'tap-area-recommended',
        'icon-size-100',
        'icon-size-125',
        'duration-150',
        'duration-250',
        'accessibility-focus-width',
        'accessibility-focus-color',
        'accessibility-focus-offset',
      ];

      const missingTokens: string[] = [];
      for (const token of essentialTokens) {
        if (!availableTokens.has(token)) {
          missingTokens.push(token);
        }
      }

      if (missingTokens.length > 0) {
        console.log('Missing essential tokens:', missingTokens);
      }

      expect(missingTokens).toHaveLength(0);
    });
  });

  describe('Component Token References', () => {
    /**
     * Property: For all CSS custom property references in component source files,
     * the referenced property SHALL exist in tokens.css.
     * 
     * This is the core property test that validates token completeness.
     */
    it.each(COMPONENT_SOURCE_FILES.filter(f => fs.existsSync(path.join(process.cwd(), f))))(
      'all token references in %s should exist in tokens.css',
      (sourceFile) => {
        const filePath = path.join(process.cwd(), sourceFile);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        const references = extractCssPropertyReferences(content);
        const missingTokens: string[] = [];
        
        for (const ref of references) {
          if (!propertyExistsInTokens(ref)) {
            missingTokens.push(ref);
          }
        }
        
        // Log findings for visibility
        console.log(`${sourceFile}: ${references.size} token references, ${missingTokens.length} missing`);
        
        if (missingTokens.length > 0) {
          console.log(`Missing tokens in ${sourceFile}:`, missingTokens);
        }
        
        // Property assertion: all referenced tokens should exist
        expect(missingTokens).toHaveLength(0);
      }
    );
  });

  describe('Aggregated Token Completeness', () => {
    /**
     * Property: For ALL CSS custom property references across ALL component files,
     * every referenced property SHALL exist in tokens.css.
     * 
     * This aggregates all references and provides a comprehensive view.
     */
    it('all token references across all components should exist in tokens.css', () => {
      const allReferences = new Set<string>();
      const referencesByFile = new Map<string, Set<string>>();
      
      for (const sourceFile of COMPONENT_SOURCE_FILES) {
        const filePath = path.join(process.cwd(), sourceFile);
        
        if (!fs.existsSync(filePath)) {
          continue;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const references = extractCssPropertyReferences(content);
        
        referencesByFile.set(sourceFile, references);
        
        for (const ref of references) {
          allReferences.add(ref);
        }
      }
      
      const missingTokens: Array<{ token: string; files: string[] }> = [];
      
      for (const ref of allReferences) {
        if (!propertyExistsInTokens(ref)) {
          // Find which files reference this token
          const files: string[] = [];
          for (const [file, refs] of referencesByFile) {
            if (refs.has(ref)) {
              files.push(file);
            }
          }
          missingTokens.push({ token: ref, files });
        }
      }
      
      // Log summary
      console.log(`\nToken Completeness Summary:`);
      console.log(`- Total unique token references: ${allReferences.size}`);
      console.log(`- Available tokens in tokens.css: ${availableTokens.size}`);
      console.log(`- Missing tokens: ${missingTokens.length}`);
      
      if (missingTokens.length > 0) {
        console.log('\nMissing tokens detail:');
        for (const { token, files } of missingTokens) {
          console.log(`  --${token} (referenced in: ${files.join(', ')})`);
        }
      }
      
      // Property assertion: no missing tokens
      expect(missingTokens).toHaveLength(0);
    });
  });

  describe('Browser Bundle Token References', () => {
    /**
     * Property: For all CSS custom property references in the generated browser bundles,
     * the referenced property SHALL exist in tokens.css.
     * 
     * This validates the final bundled output, not just source files.
     */
    it('all token references in ESM bundle should exist in tokens.css', () => {
      const esmBundlePath = path.join(BROWSER_DIST_DIR, 'designerpunk.esm.js');
      
      if (!fs.existsSync(esmBundlePath)) {
        throw new Error('ESM bundle not found. Run "npm run build:browser" first.');
      }
      
      const bundleContent = fs.readFileSync(esmBundlePath, 'utf-8');
      const references = extractCssPropertyReferences(bundleContent);
      
      const missingTokens: string[] = [];
      for (const ref of references) {
        if (!propertyExistsInTokens(ref)) {
          missingTokens.push(ref);
        }
      }
      
      console.log(`ESM bundle: ${references.size} token references, ${missingTokens.length} missing`);
      
      if (missingTokens.length > 0) {
        console.log('Missing tokens in ESM bundle:', missingTokens);
      }
      
      expect(missingTokens).toHaveLength(0);
    });

    it('all token references in UMD bundle should exist in tokens.css', () => {
      const umdBundlePath = path.join(BROWSER_DIST_DIR, 'designerpunk.umd.js');
      
      if (!fs.existsSync(umdBundlePath)) {
        throw new Error('UMD bundle not found. Run "npm run build:browser" first.');
      }
      
      const bundleContent = fs.readFileSync(umdBundlePath, 'utf-8');
      const references = extractCssPropertyReferences(bundleContent);
      
      const missingTokens: string[] = [];
      for (const ref of references) {
        if (!propertyExistsInTokens(ref)) {
          missingTokens.push(ref);
        }
      }
      
      console.log(`UMD bundle: ${references.size} token references, ${missingTokens.length} missing`);
      
      if (missingTokens.length > 0) {
        console.log('Missing tokens in UMD bundle:', missingTokens);
      }
      
      expect(missingTokens).toHaveLength(0);
    });
  });
});
