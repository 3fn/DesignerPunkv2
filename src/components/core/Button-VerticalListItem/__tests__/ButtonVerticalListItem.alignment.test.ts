/**
 * @category evergreen
 * @purpose Alignment tests for Button-VerticalListItem component (Spec 040)
 * @jest-environment jsdom
 */
/**
 * Button-VerticalListItem Alignment Tests (Spec 040 - Component Alignment)
 * 
 * Tests verifying Button-VerticalListItem alignment to consistent architectural patterns:
 * - Blend utility integration for state colors
 * - CSS custom property naming convention
 * 
 * These tests validate the architectural patterns established in Spec 040
 * to ensure consistency across the component library.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-VerticalListItem
 * Component Type: Primitive (foundational component)
 * 
 * @module Button-VerticalListItem/__tests__/ButtonVerticalListItem.alignment
 * @see Requirements: 1.3, 1.4 (Spec 040)
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  registerVerticalListButtonItem,
  createVerticalListButtonItem,
  cleanupVerticalListButtonItem,
  getShadowButton,
  cleanupRequiredTokens
} from './test-utils';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Read the actual CSS file content for CSS validation tests.
 */
function readCSSFileContent(): string {
  const cssPath = path.resolve(process.cwd(), 'src/components/core/Button-VerticalListItem/platforms/web/ButtonVerticalListItem.styles.css');
  if (fs.existsSync(cssPath)) {
    return fs.readFileSync(cssPath, 'utf-8');
  }
  return '';
}

/**
 * Read the TypeScript source file for implementation validation.
 */
function readTSFileContent(): string {
  const tsPath = path.resolve(process.cwd(), 'src/components/core/Button-VerticalListItem/platforms/web/ButtonVerticalListItem.web.ts');
  if (fs.existsSync(tsPath)) {
    return fs.readFileSync(tsPath, 'utf-8');
  }
  return '';
}

// Cache file contents to avoid repeated reads
let cachedCSSContent: string | null = null;
let cachedTSContent: string | null = null;

function getCSSContent(): string {
  if (cachedCSSContent === null) {
    cachedCSSContent = readCSSFileContent();
  }
  return cachedCSSContent;
}

function getTSContent(): string {
  if (cachedTSContent === null) {
    cachedTSContent = readTSFileContent();
  }
  return cachedTSContent;
}

// ============================================================================
// Test Suite
// ============================================================================

describe('Button-VerticalListItem Alignment Tests (Spec 040)', () => {
  // Register component before all tests
  beforeAll(() => {
    registerVerticalListButtonItem();
  });
  
  // Clean up tokens after all tests
  afterAll(() => {
    cleanupRequiredTokens();
  });

  // ============================================================================
  // Evergreen Tests: Blend Utility Integration
  // ============================================================================
  
  describe('Blend Utility Integration (Evergreen)', () => {
    /**
     * Evergreen tests for blend utility integration.
     * 
     * These tests verify that Button-VerticalListItem uses blend utilities for state colors
     * instead of CSS filters, ensuring cross-platform consistency.
     * 
     * **Validates: Requirements 1.3, 1.4 (Spec 040)**
     */
    
    it('should import getBlendUtilities from ThemeAwareBlendUtilities', () => {
      const tsContent = getTSContent();
      
      // Verify blend utilities import
      expect(tsContent).toContain('import { getBlendUtilities');
      expect(tsContent).toContain('ThemeAwareBlendUtilities.web');
    });
    
    it('should initialize blend utilities in constructor', () => {
      const tsContent = getTSContent();
      
      // Verify blend utilities initialization in constructor
      expect(tsContent).toContain('this._blendUtils = getBlendUtilities()');
    });
    
    it('should have _calculateBlendColors method', () => {
      const tsContent = getTSContent();
      
      // Verify _calculateBlendColors method exists
      expect(tsContent).toContain('private _calculateBlendColors()');
      expect(tsContent).toContain('this._blendUtils.hoverColor');
      expect(tsContent).toContain('this._blendUtils.pressedColor');
    });
    
    it('should apply blend colors via CSS custom properties', async () => {
      const button = await createVerticalListButtonItem({
        label: 'Test Option',
        visualState: 'rest'
      });
      
      try {
        const shadowButton = getShadowButton(button);
        expect(shadowButton).toBeTruthy();
        
        // Verify blend color CSS custom properties are applied
        const style = shadowButton?.getAttribute('style') || '';
        expect(style).toContain('--_vlbi-hover-bg');
        expect(style).toContain('--_vlbi-pressed-bg');
      } finally {
        cleanupVerticalListButtonItem(button);
      }
    });
    
    it('should use blend utility CSS custom properties in hover state CSS', () => {
      const cssContent = getCSSContent();
      
      // Verify hover state uses --_vlbi-hover-bg
      expect(cssContent).toContain('var(--_vlbi-hover-bg)');
      
      // Verify hover uses background-color with blend utility
      const hoverSection = cssContent.match(/\.vertical-list-item:hover\s*\{[^}]+\}/);
      expect(hoverSection).toBeTruthy();
      expect(hoverSection?.[0]).toContain('background-color: var(--_vlbi-hover-bg)');
    });
    
    it('should use blend utility CSS custom properties in pressed state CSS', () => {
      const cssContent = getCSSContent();
      
      // Verify pressed state uses --_vlbi-pressed-bg
      expect(cssContent).toContain('var(--_vlbi-pressed-bg)');
      
      // Verify active uses background-color with blend utility
      const activeSection = cssContent.match(/\.vertical-list-item:active\s*\{[^}]+\}/);
      expect(activeSection).toBeTruthy();
      expect(activeSection?.[0]).toContain('background-color: var(--_vlbi-pressed-bg)');
    });
    
    it('should have retry pattern for blend color calculation', () => {
      const tsContent = getTSContent();
      
      // Verify retry pattern exists
      expect(tsContent).toContain('_calculateBlendColorsWithRetry');
      expect(tsContent).toContain('requestAnimationFrame');
    });
    
    it('should store blend utilities instance as private member', () => {
      const tsContent = getTSContent();
      
      // Verify private member declaration
      expect(tsContent).toContain('private _blendUtils: BlendUtilitiesResult');
    });
    
    it('should store calculated hover and pressed colors as private members', () => {
      const tsContent = getTSContent();
      
      // Verify private member declarations for cached colors
      expect(tsContent).toContain("private _hoverColor: string = ''");
      expect(tsContent).toContain("private _pressedColor: string = ''");
    });
  });

  // ============================================================================
  // Evergreen Tests: CSS Custom Property Naming Convention
  // ============================================================================
  
  describe('CSS Custom Property Naming Convention (Evergreen)', () => {
    /**
     * Evergreen tests for CSS custom property naming convention.
     * 
     * These tests verify that Button-VerticalListItem uses the --_vlbi-* naming
     * convention for component-scoped CSS custom properties.
     * 
     * **Validates: Requirements 7.2, 7.4 (Spec 040)**
     */
    
    it('should use --_vlbi-* prefix for component-scoped properties', () => {
      const cssContent = getCSSContent();
      
      // Verify component-scoped properties use --_vlbi-* prefix
      expect(cssContent).toContain('--_vlbi-');
      
      // Verify specific properties use the convention
      expect(cssContent).toContain('--_vlbi-hover-bg');
      expect(cssContent).toContain('--_vlbi-pressed-bg');
      expect(cssContent).toContain('--_vlbi-focus-width');
      expect(cssContent).toContain('--_vlbi-focus-color');
      expect(cssContent).toContain('--_vlbi-focus-offset');
      expect(cssContent).toContain('--_vlbi-radius');
    });
    
    it('should define component-scoped properties in :host', () => {
      const cssContent = getCSSContent();
      
      // Verify :host contains component-scoped property definitions
      const hostSection = cssContent.match(/:host\s*\{[^}]+\}/);
      expect(hostSection).toBeTruthy();
      expect(hostSection?.[0]).toContain('--_vlbi-focus-offset');
      expect(hostSection?.[0]).toContain('--_vlbi-focus-width');
      expect(hostSection?.[0]).toContain('--_vlbi-focus-color');
      expect(hostSection?.[0]).toContain('--_vlbi-min-height');
      expect(hostSection?.[0]).toContain('--_vlbi-radius');
      expect(hostSection?.[0]).toContain('--_vlbi-padding-inline');
      expect(hostSection?.[0]).toContain('--_vlbi-gap');
    });
    
    it('should use underscore prefix to signal internal/private semantics', () => {
      const cssContent = getCSSContent();
      
      // Verify underscore prefix is used consistently
      // All component-scoped properties should start with --_vlbi-
      const componentProperties = cssContent.match(/--_vlbi-[a-z-]+/g) || [];
      expect(componentProperties.length).toBeGreaterThan(0);
      
      // Verify all matched properties follow the pattern
      componentProperties.forEach(prop => {
        expect(prop).toMatch(/^--_vlbi-[a-z-]+$/);
      });
    });
    
    it('should apply component-scoped properties via inline style in _updateDOM', () => {
      const tsContent = getTSContent();
      
      // Verify _updateDOM sets component-scoped properties
      expect(tsContent).toContain("style.setProperty('--_vlbi-background'");
      expect(tsContent).toContain("style.setProperty('--_vlbi-border-width'");
      expect(tsContent).toContain("style.setProperty('--_vlbi-border-color'");
      expect(tsContent).toContain("style.setProperty('--_vlbi-padding-block'");
      expect(tsContent).toContain("style.setProperty('--_vlbi-label-color'");
      expect(tsContent).toContain("style.setProperty('--_vlbi-icon-color'");
      expect(tsContent).toContain("style.setProperty('--_vlbi-hover-bg'");
      expect(tsContent).toContain("style.setProperty('--_vlbi-pressed-bg'");
    });
  });

  // ============================================================================
  // Temporary Migration Tests (Retire after Spec 040 completion)
  // ============================================================================
  
  /**
   * TEMPORARY TESTS - Delete after Spec 040 completion
   * 
   * These tests validate migration from old patterns to new patterns.
   * Once the migration is complete and verified, these tests should be retired.
   */
  
  describe('Migration Validation: No filter: brightness() (Temporary)', () => {
    /**
     * TEMPORARY TEST - Delete after Spec 040 completion
     * 
     * Validates Button-VerticalListItem no longer uses filter: brightness() for state colors.
     * This pattern was replaced with blend utilities for cross-platform consistency.
     * 
     * Note: The CSS file contains:
     * - Comments documenting what was replaced (acceptable)
     * - `filter: none !important;` in print styles (acceptable - resetting, not using brightness)
     * 
     * **Validates: Requirements 1.5 (Spec 040) - No CSS filter for state colors**
     */
    
    it('should NOT use filter: brightness() for hover state in CSS', () => {
      const cssContent = getCSSContent();
      
      // Extract hover section and verify no filter: brightness() usage
      const hoverSection = cssContent.match(/\.vertical-list-item:hover\s*\{[^}]+\}/)?.[0] || '';
      expect(hoverSection).not.toMatch(/filter:\s*brightness\(/i);
      expect(hoverSection).not.toContain('filter');
    });
    
    it('should NOT use filter: brightness() for active/pressed state in CSS', () => {
      const cssContent = getCSSContent();
      
      // Extract active section and verify no filter: brightness() usage
      const activeSection = cssContent.match(/\.vertical-list-item:active\s*\{[^}]+\}/)?.[0] || '';
      expect(activeSection).not.toMatch(/filter:\s*brightness\(/i);
      expect(activeSection).not.toContain('filter');
    });
    
    it('should NOT use filter: brightness() in TypeScript implementation', () => {
      const tsContent = getTSContent();
      
      // Verify no actual filter: brightness() usage in implementation code
      // Comments mentioning brightness() are acceptable (documentation of what was replaced)
      // We check for actual style.filter assignments with brightness
      expect(tsContent).not.toMatch(/\.style\.filter\s*=.*brightness/i);
      
      // Also check for any setProperty calls setting filter to brightness
      expect(tsContent).not.toMatch(/setProperty\s*\(\s*['"]filter['"]\s*,.*brightness/i);
    });
    
    it('should use blend utilities instead of CSS filter for state colors', () => {
      const cssContent = getCSSContent();
      
      // Verify hover uses blend utility CSS custom property
      const hoverSection = cssContent.match(/\.vertical-list-item:hover\s*\{[^}]+\}/)?.[0] || '';
      expect(hoverSection).toContain('var(--_vlbi-hover-bg)');
      
      // Verify active uses blend utility CSS custom property
      const activeSection = cssContent.match(/\.vertical-list-item:active\s*\{[^}]+\}/)?.[0] || '';
      expect(activeSection).toContain('var(--_vlbi-pressed-bg)');
    });
  });
  
  describe('Migration Validation: CSS Property Naming (Temporary)', () => {
    /**
     * TEMPORARY TEST - Delete after Spec 040 completion
     * 
     * Validates Button-VerticalListItem uses --_vlbi-* naming convention
     * instead of the old --vlbi-* naming (without underscore).
     * 
     * **Validates: Requirements 7.2, 7.4 (Spec 040) - CSS property naming**
     */
    
    it('should NOT use old --vlbi-* naming convention (without underscore)', () => {
      const cssContent = getCSSContent();
      
      // The old naming convention was --vlbi-* (without underscore)
      // The new naming convention is --_vlbi-* (with underscore)
      // We need to check that --vlbi- without underscore is not used
      // But we need to be careful not to match --_vlbi- which is correct
      
      // Find all CSS custom property declarations and usages
      const allProperties = cssContent.match(/--[a-z_][a-z0-9_-]*/gi) || [];
      
      // Filter for vlbi properties
      const vlbiProperties = allProperties.filter(prop => 
        prop.toLowerCase().includes('vlbi')
      );
      
      // All vlbi properties should use the underscore prefix
      vlbiProperties.forEach(prop => {
        // Should be --_vlbi-* not --vlbi-*
        expect(prop).toMatch(/^--_vlbi-/i);
      });
    });
    
    it('should use underscore prefix consistently in TypeScript', () => {
      const tsContent = getTSContent();
      
      // Find all setProperty calls with vlbi
      const setPropertyCalls = tsContent.match(/setProperty\s*\(\s*['"]--[^'"]+vlbi[^'"]+['"]/gi) || [];
      
      // All should use --_vlbi- prefix
      setPropertyCalls.forEach(call => {
        expect(call).toContain('--_vlbi-');
      });
    });
  });
});
