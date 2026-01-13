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


});
