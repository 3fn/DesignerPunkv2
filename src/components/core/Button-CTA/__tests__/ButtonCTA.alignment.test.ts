/**
 * @category evergreen
 * @purpose Alignment tests for Button-CTA component (Spec 040)
 * @jest-environment jsdom
 */
/**
 * Button-CTA Alignment Tests (Spec 040 - Component Alignment)
 * 
 * Tests verifying Button-CTA alignment to consistent architectural patterns:
 * - Incremental DOM update pattern for CSS transitions
 * - Semantic motion token usage
 * 
 * These tests validate the architectural patterns established in Spec 040
 * to ensure consistency across the component library.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-CTA
 * Component Type: Standalone (no behavioral variants)
 * 
 * @module Button-CTA/__tests__/ButtonCTA.alignment
 * @see Requirements: 2.2, 2.3, 3.1 (Spec 040)
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  registerButtonCTA,
  createButtonCTA,
  cleanupButtonCTA,
  getShadowButton,
  cleanupBlendColorProperties
} from './test-utils';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Read the actual CSS file content for CSS validation tests.
 */
function readCSSFileContent(): string {
  const cssPath = path.resolve(process.cwd(), 'src/components/core/Button-CTA/platforms/web/ButtonCTA.web.css');
  if (fs.existsSync(cssPath)) {
    return fs.readFileSync(cssPath, 'utf-8');
  }
  return '';
}

/**
 * Read the TypeScript source file for implementation validation.
 */
function readTSFileContent(): string {
  const tsPath = path.resolve(process.cwd(), 'src/components/core/Button-CTA/platforms/web/ButtonCTA.web.ts');
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

describe('Button-CTA Alignment Tests (Spec 040)', () => {
  // Register component before all tests
  beforeAll(() => {
    registerButtonCTA();
  });
  
  // Clean up tokens after all tests
  afterAll(() => {
    cleanupBlendColorProperties();
  });

  // ============================================================================
  // Evergreen Tests: DOM Element Identity Preservation
  // ============================================================================
  
  describe('DOM Element Identity Preservation (Evergreen)', () => {
    /**
     * Evergreen tests for incremental DOM update pattern.
     * 
     * These tests verify that Button-CTA preserves DOM element identity
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
    });
    
    it('should NOT use innerHTML in _updateDOM method', () => {
      const tsContent = getTSContent();
      
      // Find the _updateDOM method and verify it doesn't use innerHTML
      // The method should use direct DOM APIs instead
      const updateDOMMatch = tsContent.match(/private _updateDOM\(\)[^{]*\{([\s\S]*?)(?=\n  \/\*\*|\n  private |\n  public |\n\})/);
      if (updateDOMMatch) {
        const updateDOMBody = updateDOMMatch[1];
        // _updateDOM should NOT contain innerHTML assignment
        expect(updateDOMBody).not.toContain('.innerHTML =');
        expect(updateDOMBody).not.toContain('.innerHTML=');
      }
    });
    
    it('should cache DOM element references', () => {
      const tsContent = getTSContent();
      
      // Verify cached element references
      expect(tsContent).toContain('private _button: HTMLButtonElement | null');
      expect(tsContent).toContain('private _labelEl: HTMLSpanElement | null');
      expect(tsContent).toContain('private _iconEl: HTMLElement | null');
    });
    
    it('should preserve button element identity across attribute changes', async () => {
      const button = await createButtonCTA({
        label: 'Test Button',
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
        cleanupButtonCTA(button);
      }
    });
    
    it('should preserve button element identity across variant changes', async () => {
      const button = await createButtonCTA({
        label: 'Test Button',
        buttonVariant: 'primary'
      });
      
      try {
        // Get initial button reference
        const initialButton = getShadowButton(button);
        expect(initialButton).toBeTruthy();
        
        // Change variant
        button.buttonVariant = 'secondary';
        
        // Wait for update
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Get button reference after change
        const updatedButton = getShadowButton(button);
        expect(updatedButton).toBeTruthy();
        
        // Verify same element (identity preserved)
        expect(updatedButton).toBe(initialButton);
      } finally {
        cleanupButtonCTA(button);
      }
    });
    
    it('should preserve label element identity across label changes', async () => {
      const button = await createButtonCTA({
        label: 'Initial Label'
      });
      
      try {
        // Get initial label reference
        const initialLabel = button.shadowRoot?.querySelector('.button-cta__label, .button-cta__label--no-wrap');
        expect(initialLabel).toBeTruthy();
        
        // Change label
        button.label = 'Updated Label';
        
        // Wait for update
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Get label reference after change
        const updatedLabel = button.shadowRoot?.querySelector('.button-cta__label, .button-cta__label--no-wrap');
        expect(updatedLabel).toBeTruthy();
        
        // Verify same element (identity preserved)
        expect(updatedLabel).toBe(initialLabel);
        
        // Verify label text was updated
        expect(updatedLabel?.textContent).toBe('Updated Label');
      } finally {
        cleanupButtonCTA(button);
      }
    });
    
    it('should preserve icon container identity across icon changes', async () => {
      const button = await createButtonCTA({
        label: 'Test Button',
        icon: 'arrow-right'
      });
      
      try {
        // Get initial icon container reference
        const initialIconContainer = button.shadowRoot?.querySelector('.button-cta__icon');
        expect(initialIconContainer).toBeTruthy();
        
        // Change icon
        button.icon = 'check';
        
        // Wait for update
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Get icon container reference after change
        const updatedIconContainer = button.shadowRoot?.querySelector('.button-cta__icon');
        expect(updatedIconContainer).toBeTruthy();
        
        // Verify same element (identity preserved)
        expect(updatedIconContainer).toBe(initialIconContainer);
      } finally {
        cleanupButtonCTA(button);
      }
    });
    
    it('should call _updateDOM on attribute change after initial render', () => {
      const tsContent = getTSContent();
      
      // Verify attributeChangedCallback routes to _updateDOM
      expect(tsContent).toContain('attributeChangedCallback');
      expect(tsContent).toContain('this._updateDOM()');
    });
    
    it('should use direct DOM APIs for updates', () => {
      const tsContent = getTSContent();
      
      // Verify _updateDOM uses direct DOM APIs
      const updateDOMMatch = tsContent.match(/private _updateDOM\(\)[^{]*\{([\s\S]*?)(?=\n  \/\*\*|\n  private |\n  public |\n\})/);
      if (updateDOMMatch) {
        const updateDOMBody = updateDOMMatch[1];
        // Should use direct DOM manipulation methods
        expect(updateDOMBody).toContain('.className');
        expect(updateDOMBody).toContain('.setAttribute');
        expect(updateDOMBody).toContain('.textContent');
      }
    });
  });

  // ============================================================================
  // Evergreen Tests: Motion Token Usage
  // ============================================================================
  
  describe('Motion Token Usage (Evergreen)', () => {
    /**
     * Evergreen tests for semantic motion token usage.
     * 
     * These tests verify that Button-CTA uses semantic motion tokens
     * (motion.buttonPress) instead of primitive tokens with hard-coded easing.
     * 
     * **Validates: Requirements 3.1 (Spec 040)**
     */
    
    it('should use semantic motion token for transition duration', () => {
      const cssContent = getCSSContent();
      
      // Verify semantic motion token reference for duration
      expect(cssContent).toContain('--motion-button-press-duration');
    });
    
    it('should use semantic motion token for transition easing', () => {
      const cssContent = getCSSContent();
      
      // Verify semantic motion token reference for easing
      expect(cssContent).toContain('--motion-button-press-easing');
    });
    
    it('should use semantic motion tokens in transition property', () => {
      const cssContent = getCSSContent();
      
      // Verify transition uses both duration and easing from semantic tokens
      expect(cssContent).toContain('var(--motion-button-press-duration) var(--motion-button-press-easing)');
    });
    
    it('should apply transitions to state-changing properties', () => {
      const cssContent = getCSSContent();
      
      // Verify transition is applied to background-color, border-color, color
      expect(cssContent).toContain('background-color var(--motion-button-press-duration)');
      expect(cssContent).toContain('border-color var(--motion-button-press-duration)');
      expect(cssContent).toContain('color var(--motion-button-press-duration)');
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
    
    it('should support reduced motion preference', () => {
      const cssContent = getCSSContent();
      
      // Verify reduced motion media query exists
      expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
      expect(cssContent).toContain('transition: none');
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
  
  describe('Migration Validation: No Primitive + Hard-Coded Easing (Temporary)', () => {
    /**
     * TEMPORARY TEST - Delete after Spec 040 completion
     * 
     * Validates Button-CTA no longer uses primitive duration tokens with
     * hard-coded easing values. This pattern was replaced with semantic
     * motion tokens for consistency.
     * 
     * **Validates: Requirements 3.1, 3.3, 3.4 (Spec 040) - Semantic motion token usage**
     */
    
    it('should NOT use --duration-150 with hard-coded easing in CSS', () => {
      const cssContent = getCSSContent();
      
      // Verify no --duration-150 with hard-coded easing
      expect(cssContent).not.toMatch(/--duration-150[^;]*ease/i);
      expect(cssContent).not.toMatch(/var\(--duration-150\)[^;]*ease/i);
    });
    
    it('should NOT use any primitive duration token with hard-coded easing', () => {
      const cssContent = getCSSContent();
      
      // Check for any primitive duration token followed by hard-coded easing
      // Patterns to avoid:
      // - var(--duration-100) ease-in-out
      // - var(--duration-150) ease-out
      // - var(--duration-200) ease-in
      // - var(--duration-300) linear
      const primitivePatterns = [
        /var\(--duration-\d+\)\s+ease-in-out/,
        /var\(--duration-\d+\)\s+ease-out/,
        /var\(--duration-\d+\)\s+ease-in/,
        /var\(--duration-\d+\)\s+ease\b/,
        /var\(--duration-\d+\)\s+linear/,
        /var\(--duration-\d+\)\s+cubic-bezier/
      ];
      
      primitivePatterns.forEach(pattern => {
        expect(cssContent).not.toMatch(pattern);
      });
    });
    
    it('should NOT use hard-coded timing values in transition', () => {
      const cssContent = getCSSContent();
      
      // Verify no hard-coded timing values like "150ms ease-in-out"
      // These should be replaced with semantic token references
      expect(cssContent).not.toMatch(/transition:[^;]*\d+ms\s+ease/i);
      expect(cssContent).not.toMatch(/transition:[^;]*\d+s\s+ease/i);
    });
    
    it('should use semantic motion token pattern consistently', () => {
      const cssContent = getCSSContent();
      
      // Verify the semantic pattern is used: var(--motion-*-duration) var(--motion-*-easing)
      // This is the correct pattern for semantic motion tokens
      const semanticPattern = /var\(--motion-[a-z-]+-duration\)\s+var\(--motion-[a-z-]+-easing\)/;
      expect(cssContent).toMatch(semanticPattern);
    });
  });
  
  describe('Migration Validation: Incremental DOM Architecture (Temporary)', () => {
    /**
     * TEMPORARY TEST - Delete after Spec 040 completion
     * 
     * Validates Button-CTA uses incremental DOM architecture instead of
     * full innerHTML replacement on attribute changes.
     * 
     * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5 (Spec 040)**
     */
    
    it('should have render method that routes to _createDOM or _updateDOM', () => {
      const tsContent = getTSContent();
      
      // Verify render method exists and routes correctly
      expect(tsContent).toContain('private render()');
      expect(tsContent).toContain('this._createDOM()');
      expect(tsContent).toContain('this._domCreated = true');
    });
    
    it('should set _domCreated flag after initial render', () => {
      const tsContent = getTSContent();
      
      // Verify _domCreated is set to true after _createDOM
      const renderMatch = tsContent.match(/private render\(\)[^{]*\{([\s\S]*?)(?=\n  \/\*\*|\n  private |\n  public |\n\})/);
      if (renderMatch) {
        const renderBody = renderMatch[1];
        expect(renderBody).toContain('this._domCreated = true');
      }
    });
    
    it('should check _domCreated before routing in render', () => {
      const tsContent = getTSContent();
      
      // Verify render checks _domCreated flag
      expect(tsContent).toContain('if (!this._domCreated)');
    });
  });
});
