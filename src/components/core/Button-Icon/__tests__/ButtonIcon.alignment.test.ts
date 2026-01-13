/**
 * @category evergreen
 * @purpose Alignment tests for Button-Icon component (Spec 040)
 * @jest-environment jsdom
 */
/**
 * Button-Icon Alignment Tests (Spec 040 - Component Alignment)
 * 
 * Tests verifying ButtonIcon alignment to consistent architectural patterns:
 * - Blend utility integration for state colors
 * - Incremental DOM update pattern for CSS transitions
 * - Semantic motion token usage
 * 
 * These tests validate the architectural patterns established in Spec 040
 * to ensure consistency across the component library.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-Icon
 * Component Type: Primitive (foundational component)
 * 
 * @module Button-Icon/__tests__/ButtonIcon.alignment
 * @see Requirements: 1.1, 1.2, 2.2, 2.3, 3.2 (Spec 040)
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  registerButtonIcon,
  createButtonIcon,
  cleanupButtonIcon,
  getShadowButton,
  cleanupButtonIconTokens
} from './test-utils';
import { ButtonIcon } from '../platforms/web/ButtonIcon.web';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Read the actual CSS file content for CSS validation tests.
 */
function readCSSFileContent(): string {
  const cssPath = path.resolve(process.cwd(), 'src/components/core/Button-Icon/platforms/web/ButtonIcon.web.css');
  if (fs.existsSync(cssPath)) {
    return fs.readFileSync(cssPath, 'utf-8');
  }
  return '';
}

/**
 * Read the TypeScript source file for implementation validation.
 */
function readTSFileContent(): string {
  const tsPath = path.resolve(process.cwd(), 'src/components/core/Button-Icon/platforms/web/ButtonIcon.web.ts');
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

describe('Button-Icon Alignment Tests (Spec 040)', () => {
  // Register component before all tests
  beforeAll(() => {
    registerButtonIcon();
  });
  
  // Clean up tokens after all tests
  afterAll(() => {
    cleanupButtonIconTokens();
  });

  // ============================================================================
  // Evergreen Tests: Blend Utility Integration
  // ============================================================================
  
  describe('Blend Utility Integration (Evergreen)', () => {
    /**
     * Evergreen tests for blend utility integration.
     * 
     * These tests verify that ButtonIcon uses blend utilities for state colors
     * instead of CSS filters, ensuring cross-platform consistency.
     * 
     * **Validates: Requirements 1.1, 1.2 (Spec 040)**
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
      const button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings'
      });
      
      try {
        const shadowButton = getShadowButton(button);
        expect(shadowButton).toBeTruthy();
        
        // Verify blend color CSS custom properties are applied
        const style = shadowButton?.getAttribute('style') || '';
        expect(style).toContain('--_bi-hover-bg');
        expect(style).toContain('--_bi-pressed-bg');
      } finally {
        cleanupButtonIcon(button);
      }
    });
    
    it('should use blend utility CSS custom properties in hover state CSS', () => {
      const cssContent = getCSSContent();
      
      // Verify hover state uses --_bi-hover-bg
      expect(cssContent).toContain('var(--_bi-hover-bg)');
      
      // Verify primary hover uses background-color with blend utility
      const primaryHover = cssContent.match(/\.button-icon--primary:hover\s*\{[^}]+\}/);
      expect(primaryHover).toBeTruthy();
      expect(primaryHover?.[0]).toContain('background-color: var(--_bi-hover-bg)');
    });
    
    it('should use blend utility CSS custom properties in pressed state CSS', () => {
      const cssContent = getCSSContent();
      
      // Verify pressed state uses --_bi-pressed-bg
      expect(cssContent).toContain('var(--_bi-pressed-bg)');
      
      // Verify primary pressed uses background-color with blend utility
      const primaryActive = cssContent.match(/\.button-icon--primary:active\s*\{[^}]+\}/);
      expect(primaryActive).toBeTruthy();
      expect(primaryActive?.[0]).toContain('background-color: var(--_bi-pressed-bg)');
    });
    
    it('should have retry pattern for blend color calculation', () => {
      const tsContent = getTSContent();
      
      // Verify retry pattern exists
      expect(tsContent).toContain('_calculateBlendColorsWithRetry');
      expect(tsContent).toContain('requestAnimationFrame');
    });
  });

  // ============================================================================
  // Evergreen Tests: DOM Element Identity Preservation
  // ============================================================================
  
  describe('DOM Element Identity Preservation (Evergreen)', () => {
    /**
     * Evergreen tests for incremental DOM update pattern.
     * 
     * These tests verify that ButtonIcon preserves DOM element identity
     * across attribute changes, enabling CSS transitions to work correctly.
     * 
     * **Validates: Requirements 2.2, 2.3 (Spec 040)**
     */
    
    it('should have _domCreated flag for incremental updates', () => {
      const tsContent = getTSContent();
      
      // Verify _domCreated flag exists
      expect(tsContent).toContain('private _domCreated: boolean = false');
    });
    
    it('should have _createDOM method for initial render', () => {
      const tsContent = getTSContent();
      
      // Verify _createDOM method exists
      expect(tsContent).toContain('private _createDOM()');
      expect(tsContent).toContain('this._shadowRoot.innerHTML');
    });
    
    it('should have _updateDOM method for attribute changes', () => {
      const tsContent = getTSContent();
      
      // Verify _updateDOM method exists
      expect(tsContent).toContain('private _updateDOM()');
      
      // Verify _updateDOM does NOT use innerHTML
      const updateDOMMethod = tsContent.match(/private _updateDOM\(\)[^}]+\{[\s\S]*?(?=\n  \/\/|private |public )/);
      if (updateDOMMethod) {
        expect(updateDOMMethod[0]).not.toContain('innerHTML');
      }
    });
    
    it('should cache DOM element references', () => {
      const tsContent = getTSContent();
      
      // Verify cached element references
      expect(tsContent).toContain('private _button: HTMLButtonElement | null');
      expect(tsContent).toContain('private _iconEl: HTMLElement | null');
    });
    
    it('should preserve button element identity across attribute changes', async () => {
      const button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings',
        size: 'medium'
      });
      
      try {
        // Get initial button reference
        const initialButton = getShadowButton(button);
        expect(initialButton).toBeTruthy();
        
        // Change attribute
        button.size = 'large';
        
        // Wait for update
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Get button reference after change
        const updatedButton = getShadowButton(button);
        expect(updatedButton).toBeTruthy();
        
        // Verify same element (identity preserved)
        expect(updatedButton).toBe(initialButton);
      } finally {
        cleanupButtonIcon(button);
      }
    });
    
    it('should preserve icon element identity across attribute changes', async () => {
      const button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings'
      });
      
      try {
        // Get initial icon reference
        const initialIcon = button.shadowRoot?.querySelector('icon-base');
        expect(initialIcon).toBeTruthy();
        
        // Change icon attribute
        button.icon = 'check';
        
        // Wait for update
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Get icon reference after change
        const updatedIcon = button.shadowRoot?.querySelector('icon-base');
        expect(updatedIcon).toBeTruthy();
        
        // Verify same element (identity preserved)
        expect(updatedIcon).toBe(initialIcon);
        
        // Verify icon name was updated
        expect(updatedIcon?.getAttribute('name')).toBe('check');
      } finally {
        cleanupButtonIcon(button);
      }
    });
    
    it('should call _updateDOM on attribute change after initial render', () => {
      const tsContent = getTSContent();
      
      // Verify attributeChangedCallback routes to _updateDOM
      expect(tsContent).toContain('attributeChangedCallback');
      expect(tsContent).toContain('this._updateDOM()');
    });
  });

  // ============================================================================
  // Evergreen Tests: Motion Token Usage
  // ============================================================================
  
  describe('Motion Token Usage (Evergreen)', () => {
    /**
     * Evergreen tests for semantic motion token usage.
     * 
     * These tests verify that ButtonIcon uses semantic motion tokens
     * (motion.buttonPress) instead of primitive tokens with hard-coded easing.
     * 
     * **Validates: Requirements 3.2 (Spec 040)**
     */
    
    it('should define transition duration using semantic motion token', () => {
      const cssContent = getCSSContent();
      
      // Verify semantic motion token reference for duration
      expect(cssContent).toContain('--_bi-transition-duration: var(--motion-button-press-duration)');
    });
    
    it('should define transition easing using semantic motion token', () => {
      const cssContent = getCSSContent();
      
      // Verify semantic motion token reference for easing
      expect(cssContent).toContain('--_bi-transition-easing: var(--motion-button-press-easing)');
    });
    
    it('should use semantic motion token variables in transition property', () => {
      const cssContent = getCSSContent();
      
      // Verify transition uses the semantic token variables
      expect(cssContent).toContain('var(--_bi-transition-duration)');
      expect(cssContent).toContain('var(--_bi-transition-easing)');
      
      // Verify transition is applied to state-changing properties
      expect(cssContent).toContain('background-color var(--_bi-transition-duration) var(--_bi-transition-easing)');
    });
    
    it('should NOT use primitive duration token with hard-coded easing', () => {
      const cssContent = getCSSContent();
      
      // Verify no primitive duration tokens with hard-coded easing
      // Pattern: --duration-* followed by ease-in-out or similar
      const primitiveWithHardcodedEasing = /--duration-\d+[^;]*ease-in-out/;
      expect(cssContent).not.toMatch(primitiveWithHardcodedEasing);
      
      // Also check for common hard-coded easing patterns
      expect(cssContent).not.toMatch(/var\(--duration-\d+\)\s+ease-in-out/);
      expect(cssContent).not.toMatch(/var\(--duration-\d+\)\s+ease-out/);
      expect(cssContent).not.toMatch(/var\(--duration-\d+\)\s+ease-in/);
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
     * Validates ButtonIcon no longer uses filter: brightness() for state colors.
     * This pattern was replaced with blend utilities for cross-platform consistency.
     * 
     * **Validates: Requirements 1.5 (Spec 040) - No CSS filter for state colors**
     */
    
    it('should NOT use filter: brightness() in CSS', () => {
      const cssContent = getCSSContent();
      
      // Verify no filter: brightness() usage
      expect(cssContent).not.toMatch(/filter:\s*brightness\(/i);
    });
    
    it('should NOT use filter: brightness() in TypeScript', () => {
      const tsContent = getTSContent();
      
      // Verify no filter: brightness() usage in TS
      expect(tsContent).not.toMatch(/filter:\s*brightness\(/i);
      expect(tsContent).not.toMatch(/brightness\s*\(/i);
    });
  });
  
  describe('Migration Validation: No Hard-Coded Values (Temporary)', () => {
    /**
     * TEMPORARY TEST - Delete after Spec 040 completion
     * 
     * Validates ButtonIcon uses token references instead of hard-coded pixel values
     * for sizing and spacing.
     * 
     * **Validates: Requirements 6.1, 6.2, 6.3 (Spec 040) - Token-referenced sizing**
     */
    
    it('should use token references for size dimensions in CSS', () => {
      const cssContent = getCSSContent();
      
      // Verify size classes use token references
      const smallSection = cssContent.match(/\.button-icon--small\s*\{[^}]+\}/);
      expect(smallSection).toBeTruthy();
      expect(smallSection?.[0]).toContain('var(--_bi-size-small)');
      expect(smallSection?.[0]).toContain('var(--_bi-inset-small)');
      
      const mediumSection = cssContent.match(/\.button-icon--medium\s*\{[^}]+\}/);
      expect(mediumSection).toBeTruthy();
      expect(mediumSection?.[0]).toContain('var(--_bi-size-medium)');
      expect(mediumSection?.[0]).toContain('var(--_bi-inset-medium)');
      
      const largeSection = cssContent.match(/\.button-icon--large\s*\{[^}]+\}/);
      expect(largeSection).toBeTruthy();
      expect(largeSection?.[0]).toContain('var(--_bi-size-large)');
      expect(largeSection?.[0]).toContain('var(--_bi-inset-large)');
    });
    
    it('should NOT have hard-coded pixel values for size dimensions', () => {
      const cssContent = getCSSContent();
      
      // Extract size variant sections
      const smallSection = cssContent.match(/\.button-icon--small\s*\{[^}]+\}/)?.[0] || '';
      const mediumSection = cssContent.match(/\.button-icon--medium\s*\{[^}]+\}/)?.[0] || '';
      const largeSection = cssContent.match(/\.button-icon--large\s*\{[^}]+\}/)?.[0] || '';
      
      // Check for hard-coded pixel values in width/height/padding
      // Pattern: property: Npx (where N is a number)
      const hardCodedSizePattern = /(width|height|padding):\s*\d+px/;
      
      expect(smallSection).not.toMatch(hardCodedSizePattern);
      expect(mediumSection).not.toMatch(hardCodedSizePattern);
      expect(largeSection).not.toMatch(hardCodedSizePattern);
    });
    
    it('should define size tokens in :host', () => {
      const cssContent = getCSSContent();
      
      // Verify size tokens are defined in :host
      expect(cssContent).toContain('--_bi-size-small:');
      expect(cssContent).toContain('--_bi-size-medium:');
      expect(cssContent).toContain('--_bi-size-large:');
      expect(cssContent).toContain('--_bi-inset-small:');
      expect(cssContent).toContain('--_bi-inset-medium:');
      expect(cssContent).toContain('--_bi-inset-large:');
    });
    
    it('should reference component tokens for size values', () => {
      const cssContent = getCSSContent();
      
      // Verify size tokens reference generated component tokens
      expect(cssContent).toContain('var(--buttonicon-size-large)');
      expect(cssContent).toContain('var(--buttonicon-size-medium)');
      expect(cssContent).toContain('var(--buttonicon-size-small)');
      expect(cssContent).toContain('var(--buttonicon-inset-large)');
      expect(cssContent).toContain('var(--buttonicon-inset-medium)');
      expect(cssContent).toContain('var(--buttonicon-inset-small)');
    });
  });
  
  describe('Migration Validation: CSS Custom Property Naming (Temporary)', () => {
    /**
     * TEMPORARY TEST - Delete after Spec 040 completion
     * 
     * Validates ButtonIcon uses --_bi-* naming convention for component-scoped
     * CSS custom properties, distinguishing them from design system tokens.
     * 
     * **Validates: Requirements 7.3, 7.4 (Spec 040) - CSS property naming**
     */
    
    it('should use --_bi-* prefix for component-scoped properties', () => {
      const cssContent = getCSSContent();
      
      // Verify component-scoped properties use --_bi-* prefix
      expect(cssContent).toContain('--_bi-');
      
      // Verify specific properties use the convention
      expect(cssContent).toContain('--_bi-hover-bg');
      expect(cssContent).toContain('--_bi-pressed-bg');
      expect(cssContent).toContain('--_bi-focus-width');
      expect(cssContent).toContain('--_bi-focus-color');
      expect(cssContent).toContain('--_bi-focus-offset');
      expect(cssContent).toContain('--_bi-radius');
    });
    
    it('should NOT use old --button-icon-* naming convention', () => {
      const cssContent = getCSSContent();
      
      // Verify old naming convention is not used
      // Note: --buttonicon-* (no hyphen) is the generated component token format, which is correct
      // We're checking for --button-icon-* (with hyphen) which was the old internal naming
      expect(cssContent).not.toMatch(/--button-icon-[a-z]/);
    });
  });
});
