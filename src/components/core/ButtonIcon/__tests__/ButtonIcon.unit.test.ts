/**
 * @category evergreen
 * @purpose Unit tests for Button-Icon component edge cases
 * @jest-environment jsdom
 */
/**
 * Button-Icon Unit Tests (Edge Cases)
 * 
 * Unit tests covering specific examples and edge cases that complement
 * the property-based tests. These tests verify:
 * - Default prop values (size: medium, variant: primary)
 * - Focus-visible vs focus (mouse click vs keyboard)
 * - Empty ariaLabel warning
 * - Box-shadow technique for secondary border
 * 
 * Stemma System Naming: [Family]-[Type] = Button-Icon
 * Component Type: Primitive (foundational component)
 * 
 * @module Button-Icon/__tests__/ButtonIcon.unit
 * @see Requirements: 1.5, 2.4, 6.4, 6.5, 9.3
 */

import {
  registerButtonIcon,
  createButtonIcon,
  cleanupButtonIcon,
  getShadowButton,
  hasClass,
  cleanupButtonIconTokens
} from './test-utils';
import { ButtonIcon } from '../platforms/web/ButtonIcon.web';
import { BUTTON_ICON_DEFAULTS } from '../types';

// ============================================================================
// Test Suite
// ============================================================================

describe('Button-Icon Unit Tests (Edge Cases)', () => {
  // Register component before all tests
  beforeAll(() => {
    registerButtonIcon();
  });
  
  // Clean up tokens after all tests
  afterAll(() => {
    cleanupButtonIconTokens();
  });
  
  // ============================================================================
  // Default Prop Values
  // ============================================================================
  
  describe('Default Prop Values', () => {
    /**
     * Test default prop values (size: medium, variant: primary)
     * 
     * When Button-Icon is instantiated without size or variant props,
     * it should default to medium size and primary variant.
     * 
     * **Validates: Requirements 1.5, 2.4**
     */
    let button: ButtonIcon;
    
    afterEach(() => {
      if (button) {
        cleanupButtonIcon(button);
      }
    });
    
    it('should default to medium size when size prop is omitted', async () => {
      button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings'
        // size prop intentionally omitted
      });
      
      // Verify default size is medium
      expect(button.size).toBe('medium');
      expect(button.size).toBe(BUTTON_ICON_DEFAULTS.size);
      
      // Verify medium class is applied
      expect(hasClass(button, 'button-icon--medium')).toBe(true);
      
      // Verify other size classes are NOT applied
      expect(hasClass(button, 'button-icon--small')).toBe(false);
      expect(hasClass(button, 'button-icon--large')).toBe(false);
    });
    
    it('should default to primary variant when variant prop is omitted', async () => {
      button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings'
        // variant prop intentionally omitted
      });
      
      // Verify default variant is primary
      expect(button.buttonVariant).toBe('primary');
      expect(button.buttonVariant).toBe(BUTTON_ICON_DEFAULTS.variant);
      
      // Verify primary class is applied
      expect(hasClass(button, 'button-icon--primary')).toBe(true);
      
      // Verify other variant classes are NOT applied
      expect(hasClass(button, 'button-icon--secondary')).toBe(false);
      expect(hasClass(button, 'button-icon--tertiary')).toBe(false);
    });
    
    it('should apply both default size and variant when both props are omitted', async () => {
      button = await createButtonIcon({
        icon: 'check',
        ariaLabel: 'Confirm'
        // Both size and variant props intentionally omitted
      });
      
      // Verify both defaults are applied
      expect(button.size).toBe('medium');
      expect(button.buttonVariant).toBe('primary');
      
      // Verify both default classes are applied
      expect(hasClass(button, 'button-icon--medium')).toBe(true);
      expect(hasClass(button, 'button-icon--primary')).toBe(true);
    });
    
    it('should use explicit size when provided, keeping default variant', async () => {
      button = await createButtonIcon({
        icon: 'arrow-right',
        ariaLabel: 'Next',
        size: 'large'
        // variant prop intentionally omitted
      });
      
      // Verify explicit size is used
      expect(button.size).toBe('large');
      expect(hasClass(button, 'button-icon--large')).toBe(true);
      
      // Verify default variant is still applied
      expect(button.buttonVariant).toBe('primary');
      expect(hasClass(button, 'button-icon--primary')).toBe(true);
    });
    
    it('should use explicit variant when provided, keeping default size', async () => {
      button = await createButtonIcon({
        icon: 'x',
        ariaLabel: 'Close',
        variant: 'tertiary'
        // size prop intentionally omitted
      });
      
      // Verify explicit variant is used
      expect(button.buttonVariant).toBe('tertiary');
      expect(hasClass(button, 'button-icon--tertiary')).toBe(true);
      
      // Verify default size is still applied
      expect(button.size).toBe('medium');
      expect(hasClass(button, 'button-icon--medium')).toBe(true);
    });
    
    it('should handle invalid size attribute by falling back to default', async () => {
      registerButtonIcon();
      
      button = document.createElement('button-icon') as ButtonIcon;
      button.icon = 'settings';
      button.ariaLabel = 'Settings';
      button.setAttribute('size', 'invalid-size'); // Invalid size value
      document.body.appendChild(button);
      
      // Wait for shadow DOM
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify fallback to default size
      expect(button.size).toBe('medium');
    });
    
    it('should handle invalid variant attribute by falling back to default', async () => {
      registerButtonIcon();
      
      button = document.createElement('button-icon') as ButtonIcon;
      button.icon = 'settings';
      button.ariaLabel = 'Settings';
      button.setAttribute('variant', 'invalid-variant'); // Invalid variant value
      document.body.appendChild(button);
      
      // Wait for shadow DOM
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify fallback to default variant
      expect(button.buttonVariant).toBe('primary');
    });
  });
  
  // ============================================================================
  // Focus-Visible vs Focus
  // ============================================================================
  
  describe('Focus-Visible vs Focus (Mouse Click vs Keyboard)', () => {
    /**
     * Test focus-visible vs focus behavior
     * 
     * When Button-Icon receives focus via mouse click, it should NOT render
     * focus ring. When it receives focus via keyboard navigation, it should
     * render focus ring.
     * 
     * **Validates: Requirements 6.4, 6.5**
     */
    let button: ButtonIcon;
    
    afterEach(() => {
      if (button) {
        cleanupButtonIcon(button);
      }
    });
    
    it('should have :focus-visible CSS rule for keyboard-only focus indicators', async () => {
      button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings'
      });
      
      const styleElement = button.shadowRoot?.querySelector('style');
      expect(styleElement).toBeTruthy();
      
      const styleContent = styleElement?.textContent || '';
      
      // Verify :focus-visible rule exists
      expect(styleContent).toContain('.button-icon:focus-visible');
      
      // Verify focus ring styling is applied on :focus-visible
      expect(styleContent).toContain('outline: var(--button-icon-focus-width) solid var(--button-icon-focus-color)');
      expect(styleContent).toContain('outline-offset: var(--button-icon-focus-offset)');
    });
    
    it('should have :focus:not(:focus-visible) rule to hide focus ring on mouse click', async () => {
      button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings'
      });
      
      const styleElement = button.shadowRoot?.querySelector('style');
      expect(styleElement).toBeTruthy();
      
      const styleContent = styleElement?.textContent || '';
      
      // Verify :focus:not(:focus-visible) rule exists
      expect(styleContent).toContain('.button-icon:focus:not(:focus-visible)');
      
      // Verify outline is removed on mouse click focus
      expect(styleContent).toContain('outline: none');
    });
    
    it('should have focus ring tokens defined in :host', async () => {
      button = await createButtonIcon({
        icon: 'check',
        ariaLabel: 'Confirm'
      });
      
      const styleElement = button.shadowRoot?.querySelector('style');
      const styleContent = styleElement?.textContent || '';
      
      // Verify focus ring CSS variables are defined
      expect(styleContent).toContain('--button-icon-focus-width');
      expect(styleContent).toContain('--button-icon-focus-color');
      expect(styleContent).toContain('--button-icon-focus-offset');
    });
    
    it('should reference accessibility focus tokens for focus ring', async () => {
      button = await createButtonIcon({
        icon: 'info',
        ariaLabel: 'Information'
      });
      
      const styleElement = button.shadowRoot?.querySelector('style');
      const styleContent = styleElement?.textContent || '';
      
      // Verify focus ring variables reference accessibility tokens
      expect(styleContent).toContain('--button-icon-focus-offset: var(--accessibility-focus-offset)');
      expect(styleContent).toContain('--button-icon-focus-width: var(--accessibility-focus-width)');
      expect(styleContent).toContain('--button-icon-focus-color: var(--accessibility-focus-color)');
    });
    
    it('should have focus buffer margin for self-contained focus ring', async () => {
      button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings'
      });
      
      const styleElement = button.shadowRoot?.querySelector('style');
      const styleContent = styleElement?.textContent || '';
      
      // Verify focus buffer is defined (4px = focus.offset + focus.width)
      expect(styleContent).toContain('--button-icon-focus-buffer: 4px');
      
      // Verify margin uses focus buffer
      expect(styleContent).toContain('margin: var(--button-icon-focus-buffer)');
    });
  });
  
  // ============================================================================
  // Empty ariaLabel Warning
  // ============================================================================
  
  describe('Empty ariaLabel Warning', () => {
    /**
     * Test empty ariaLabel warning behavior
     * 
     * When Button-Icon is instantiated with an empty ariaLabel,
     * it should log a warning in development to alert developers.
     * 
     * **Validates: Requirements 4.1 (ariaLabel required)**
     */
    let button: ButtonIcon;
    let consoleWarnSpy: jest.SpyInstance;
    
    beforeEach(() => {
      // Spy on console.warn to capture warnings
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });
    
    afterEach(() => {
      if (button) {
        cleanupButtonIcon(button);
      }
      consoleWarnSpy.mockRestore();
    });
    
    it('should warn when ariaLabel is empty string', async () => {
      registerButtonIcon();
      
      button = document.createElement('button-icon') as ButtonIcon;
      button.icon = 'settings';
      button.ariaLabel = ''; // Empty ariaLabel
      document.body.appendChild(button);
      
      // Wait for connectedCallback to execute
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify warning was logged
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing required "aria-label" attribute')
      );
    });
    
    it('should warn when aria-label attribute is missing', async () => {
      registerButtonIcon();
      
      button = document.createElement('button-icon') as ButtonIcon;
      button.icon = 'settings';
      // aria-label attribute intentionally not set
      document.body.appendChild(button);
      
      // Wait for connectedCallback to execute
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify warning was logged
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Missing required "aria-label" attribute')
      );
    });
    
    it('should NOT warn when ariaLabel is provided', async () => {
      button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Open settings' // Valid ariaLabel
      });
      
      // Verify no warning was logged
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
    
    it('should still render button even with empty ariaLabel', async () => {
      registerButtonIcon();
      
      button = document.createElement('button-icon') as ButtonIcon;
      button.icon = 'settings';
      button.ariaLabel = ''; // Empty ariaLabel
      document.body.appendChild(button);
      
      // Wait for shadow DOM
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Verify button still renders
      expect(button.shadowRoot).toBeTruthy();
      const shadowButton = getShadowButton(button);
      expect(shadowButton).toBeTruthy();
      expect(shadowButton?.tagName.toLowerCase()).toBe('button');
    });
    
    it('should apply empty aria-label attribute when ariaLabel is empty', async () => {
      registerButtonIcon();
      
      button = document.createElement('button-icon') as ButtonIcon;
      button.icon = 'settings';
      button.ariaLabel = ''; // Empty ariaLabel
      document.body.appendChild(button);
      
      // Wait for shadow DOM
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const shadowButton = getShadowButton(button);
      expect(shadowButton?.getAttribute('aria-label')).toBe('');
    });
  });
  
  // ============================================================================
  // Box-Shadow Technique for Secondary Border
  // ============================================================================
  
  describe('Box-Shadow Technique for Secondary Border', () => {
    /**
     * Test box-shadow technique for secondary border shift prevention
     * 
     * Secondary variant uses box-shadow to simulate 1px border within 2px
     * reserved space, preventing layout shift during state transitions.
     * 
     * **Validates: Requirements 9.3**
     */
    let button: ButtonIcon;
    
    afterEach(() => {
      if (button) {
        cleanupButtonIcon(button);
      }
    });
    
    it('should use transparent border reserving 2px space in default state', async () => {
      button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings',
        variant: 'secondary'
      });
      
      const styleElement = button.shadowRoot?.querySelector('style');
      const styleContent = styleElement?.textContent || '';
      
      // Find secondary variant CSS rule
      const secondarySection = styleContent.match(/\.button-icon--secondary\s*\{[^}]+\}/);
      expect(secondarySection).toBeTruthy();
      
      // Verify transparent border reserving 2px (borderEmphasis) space
      expect(secondarySection?.[0]).toContain('border: var(--button-icon-border-emphasis) solid transparent');
    });
    
    it('should use inset box-shadow to simulate 1px border', async () => {
      button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings',
        variant: 'secondary'
      });
      
      const styleElement = button.shadowRoot?.querySelector('style');
      const styleContent = styleElement?.textContent || '';
      
      // Find secondary variant CSS rule
      const secondarySection = styleContent.match(/\.button-icon--secondary\s*\{[^}]+\}/);
      expect(secondarySection).toBeTruthy();
      
      // Verify inset box-shadow simulating 1px (borderDefault) border
      expect(secondarySection?.[0]).toContain('box-shadow: inset 0 0 0 var(--button-icon-border-default)');
      expect(secondarySection?.[0]).toContain('var(--button-icon-color-primary)');
    });
    
    it('should remove box-shadow on hover when actual border is shown', async () => {
      button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings',
        variant: 'secondary'
      });
      
      const styleElement = button.shadowRoot?.querySelector('style');
      const styleContent = styleElement?.textContent || '';
      
      // Find secondary hover CSS rule
      const hoverSection = styleContent.match(/\.button-icon--secondary:hover\s*\{[^}]+\}/);
      expect(hoverSection).toBeTruthy();
      
      // Verify box-shadow is removed on hover
      expect(hoverSection?.[0]).toContain('box-shadow: none');
      
      // Verify actual border color is applied
      expect(hoverSection?.[0]).toContain('border-color: var(--button-icon-color-primary)');
    });
    
    it('should remove box-shadow on active when actual border is shown', async () => {
      button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings',
        variant: 'secondary'
      });
      
      const styleElement = button.shadowRoot?.querySelector('style');
      const styleContent = styleElement?.textContent || '';
      
      // Find secondary active CSS rule
      const activeSection = styleContent.match(/\.button-icon--secondary:active\s*\{[^}]+\}/);
      expect(activeSection).toBeTruthy();
      
      // Verify box-shadow is removed on active
      expect(activeSection?.[0]).toContain('box-shadow: none');
      
      // Verify actual border color is applied
      expect(activeSection?.[0]).toContain('border-color: var(--button-icon-color-primary)');
    });
    
    it('should have border token CSS variables defined', async () => {
      button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings',
        variant: 'secondary'
      });
      
      const styleElement = button.shadowRoot?.querySelector('style');
      const styleContent = styleElement?.textContent || '';
      
      // Verify border token CSS variables are defined in :host
      expect(styleContent).toContain('--button-icon-border-default: var(--border-border-default)');
      expect(styleContent).toContain('--button-icon-border-emphasis: var(--border-border-emphasis)');
    });
    
    it('should apply secondary class correctly', async () => {
      button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings',
        variant: 'secondary'
      });
      
      // Verify secondary class is applied
      expect(hasClass(button, 'button-icon--secondary')).toBe(true);
      
      // Verify other variant classes are NOT applied
      expect(hasClass(button, 'button-icon--primary')).toBe(false);
      expect(hasClass(button, 'button-icon--tertiary')).toBe(false);
    });
    
    it('should have consistent dimensions across all secondary states', async () => {
      button = await createButtonIcon({
        icon: 'settings',
        ariaLabel: 'Settings',
        variant: 'secondary',
        size: 'medium'
      });
      
      const styleElement = button.shadowRoot?.querySelector('style');
      const styleContent = styleElement?.textContent || '';
      
      // Verify medium size dimensions are defined
      const mediumSection = styleContent.match(/\.button-icon--medium\s*\{[^}]+\}/);
      expect(mediumSection).toBeTruthy();
      expect(mediumSection?.[0]).toContain('width: 40px');
      expect(mediumSection?.[0]).toContain('height: 40px');
      
      // Verify secondary hover doesn't change dimensions (no width/height override)
      const hoverSection = styleContent.match(/\.button-icon--secondary:hover\s*\{[^}]+\}/);
      expect(hoverSection).toBeTruthy();
      expect(hoverSection?.[0]).not.toContain('width:');
      expect(hoverSection?.[0]).not.toContain('height:');
      
      // Verify secondary active doesn't change dimensions (no width/height override)
      const activeSection = styleContent.match(/\.button-icon--secondary:active\s*\{[^}]+\}/);
      expect(activeSection).toBeTruthy();
      expect(activeSection?.[0]).not.toContain('width:');
      expect(activeSection?.[0]).not.toContain('height:');
    });
  });
});
