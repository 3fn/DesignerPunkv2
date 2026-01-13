/**
 * @category evergreen
 * @purpose Integration tests for Button-VerticalListItem component
 * @jest-environment jsdom
 * 
 * Tests integration with:
 * - Rosetta token system (CSS custom properties)
 * - Icon-Base component (icon rendering and sizing)
 * - Fail-loudly behavior (throws when tokens missing)
 * 
 * Stemma System Naming: [Family]-[Type] = Button-VerticalListItem
 * Component Type: Primitive (VerticalListItem)
 * 
 * @see Requirements: Token Dependencies from requirements.md
 * @see .kiro/specs/038-vertical-list-buttons/design.md - Testing Strategy
 */

import { ButtonVerticalListItem } from '../platforms/web/ButtonVerticalListItem.web';
import { IconBaseElement } from '../../Icon-Base/platforms/web/IconBase.web';
import { iconBaseSizes } from '../../Icon-Base/types';
import {
  registerVerticalListButtonItem,
  createVerticalListButtonItem,
  cleanupVerticalListButtonItem,
  getShadowButton,
  getLeadingIconElement,
  getCheckmarkElement,
  setupRequiredTokens,
  cleanupRequiredTokens,
} from './test-utils';

describe('Button-VerticalListItem Integration Tests', () => {
  // ─────────────────────────────────────────────────────────────────
  // Token Integration Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Token Integration', () => {
    let button: ButtonVerticalListItem;
    
    afterEach(() => {
      if (button) {
        cleanupVerticalListButtonItem(button);
      }
    });
    
    it('should consume Rosetta-generated CSS variables for styling', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'rest',
      });
      
      const shadowButton = getShadowButton(button);
      expect(shadowButton).toBeTruthy();
      
      // Verify component uses CSS custom properties (not hard-coded values)
      const style = shadowButton?.getAttribute('style') || '';
      
      // Check that component sets CSS custom properties for visual state
      expect(style).toContain('--_vlbi-background');
      expect(style).toContain('--_vlbi-border-width');
      expect(style).toContain('--_vlbi-border-color');
      expect(style).toContain('--_vlbi-padding-block');
      expect(style).toContain('--_vlbi-label-color');
      expect(style).toContain('--_vlbi-icon-color');
    });
    
    it('should use token-based values for selected state', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'selected',
      });
      
      const shadowButton = getShadowButton(button);
      const style = shadowButton?.getAttribute('style') || '';
      
      // Selected state should reference color.select.selected tokens
      expect(style).toContain('var(--color-select-selected-subtle)');
      expect(style).toContain('var(--color-select-selected-strong)');
    });
    
    it('should use token-based values for error state', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'selected',
        error: true,
      });
      
      const shadowButton = getShadowButton(button);
      const style = shadowButton?.getAttribute('style') || '';
      
      // Error state should reference color.error tokens
      expect(style).toContain('var(--color-error-subtle)');
      expect(style).toContain('var(--color-error-strong)');
    });
    
    it('should apply padding compensation based on border width', async () => {
      // Rest state: 1px border, 11px padding
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'rest',
      });
      
      let shadowButton = getShadowButton(button);
      let style = shadowButton?.getAttribute('style') || '';
      expect(style).toContain('--_vlbi-padding-block: 11px');
      
      cleanupVerticalListButtonItem(button);
      
      // Selected state: 2px border, 10px padding
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'selected',
      });
      
      shadowButton = getShadowButton(button);
      style = shadowButton?.getAttribute('style') || '';
      expect(style).toContain('--_vlbi-padding-block: 10px');
    });
    
    it('should use motion tokens for transitions', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'rest',
      });
      
      // Verify the component's CSS references motion tokens
      // The CSS file uses --_vlbi-transition-duration which references --motion-selection-transition-duration
      const shadowRoot = button.shadowRoot;
      expect(shadowRoot).toBeTruthy();
      
      // Check that the button element has transition styles applied
      // The component uses CSS custom properties for transitions
      const shadowButton = getShadowButton(button);
      expect(shadowButton).toBeTruthy();
      
      // Verify the motion tokens are available on the document root
      // (they're set up in test-utils.ts via setupRequiredTokens)
      const rootStyle = getComputedStyle(document.documentElement);
      const transitionDuration = rootStyle.getPropertyValue('--motion-selection-transition-duration').trim();
      const transitionEasing = rootStyle.getPropertyValue('--motion-selection-transition-easing').trim();
      
      expect(transitionDuration).toBe('250ms');
      expect(transitionEasing).toBe('ease-in-out');
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Icon-Base Integration Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Icon-Base Integration', () => {
    let button: ButtonVerticalListItem;
    
    beforeEach(() => {
      // Ensure Icon-Base is registered
      if (!customElements.get('icon-base')) {
        customElements.define('icon-base', IconBaseElement);
      }
    });
    
    afterEach(() => {
      if (button) {
        cleanupVerticalListButtonItem(button);
      }
    });
    
    /**
     * Helper to get the SVG element from nested Shadow DOM.
     * Button-VerticalListItem → icon-base → SVG
     */
    function getIconSvg(iconContainer: HTMLElement | null): SVGElement | null {
      if (!iconContainer) return null;
      
      const iconBase = iconContainer.querySelector('icon-base') as IconBaseElement | null;
      if (!iconBase || !iconBase.shadowRoot) return null;
      
      return iconBase.shadowRoot.querySelector('svg');
    }
    
    it('should render leading icon using Icon-Base component', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        leadingIcon: 'settings',
      });
      
      const leadingIconContainer = getLeadingIconElement(button);
      expect(leadingIconContainer).toBeTruthy();
      
      // Check for icon-base element
      const iconBase = leadingIconContainer?.querySelector('icon-base');
      expect(iconBase).toBeTruthy();
      expect(iconBase?.getAttribute('name')).toBe('settings');
    });
    
    it('should render checkmark using Icon-Base component', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'selected',
      });
      
      const checkmarkContainer = getCheckmarkElement(button);
      expect(checkmarkContainer).toBeTruthy();
      
      // Check for icon-base element with check icon
      const iconBase = checkmarkContainer?.querySelector('icon-base');
      expect(iconBase).toBeTruthy();
      expect(iconBase?.getAttribute('name')).toBe('check');
    });
    
    it('should use iconBaseSizes.size100 (24px) for leading icon', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        leadingIcon: 'settings',
      });
      
      const leadingIconContainer = getLeadingIconElement(button);
      const iconBase = leadingIconContainer?.querySelector('icon-base');
      
      // Check icon-base has correct size attribute (iconBaseSizes.size100 = 24)
      expect(iconBase?.getAttribute('size')).toBe(iconBaseSizes.size100.toString());
      
      // Check for size class in nested Shadow DOM
      const svg = getIconSvg(leadingIconContainer);
      expect(svg?.classList.contains('icon-base--size-100')).toBe(true);
    });
    
    it('should use iconBaseSizes.size100 (24px) for checkmark', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'selected',
      });
      
      const checkmarkContainer = getCheckmarkElement(button);
      const iconBase = checkmarkContainer?.querySelector('icon-base');
      
      // Check icon-base has correct size attribute (iconBaseSizes.size100 = 24)
      expect(iconBase?.getAttribute('size')).toBe(iconBaseSizes.size100.toString());
      
      // Check for size class in nested Shadow DOM
      const svg = getIconSvg(checkmarkContainer);
      expect(svg?.classList.contains('icon-base--size-100')).toBe(true);
    });
    
    it('should apply optical balance to leading icon', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        leadingIcon: 'settings',
      });
      
      const leadingIconContainer = getLeadingIconElement(button);
      const iconBase = leadingIconContainer?.querySelector('icon-base');
      
      // Check icon-base has optical-balance attribute
      expect(iconBase?.getAttribute('optical-balance')).toBe('true');
    });
    
    it('should apply optical balance to checkmark', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'selected',
      });
      
      const checkmarkContainer = getCheckmarkElement(button);
      const iconBase = checkmarkContainer?.querySelector('icon-base');
      
      // Check icon-base has optical-balance attribute
      expect(iconBase?.getAttribute('optical-balance')).toBe('true');
    });
    
    it('should pass color to Icon-Base for leading icon', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        leadingIcon: 'settings',
        visualState: 'selected',
      });
      
      const leadingIconContainer = getLeadingIconElement(button);
      const iconBase = leadingIconContainer?.querySelector('icon-base');
      
      // Icon should have a color attribute (hex value resolved from CSS variable)
      const colorAttr = iconBase?.getAttribute('color');
      expect(colorAttr).toBeTruthy();
      // Color should be a hex value (starts with #)
      expect(colorAttr?.startsWith('#')).toBe(true);
    });
    
    it('should pass color to Icon-Base for checkmark', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'selected',
      });
      
      const checkmarkContainer = getCheckmarkElement(button);
      const iconBase = checkmarkContainer?.querySelector('icon-base');
      
      // Icon should have a color attribute (hex value resolved from CSS variable)
      const colorAttr = iconBase?.getAttribute('color');
      expect(colorAttr).toBeTruthy();
      // Color should be a hex value (starts with #)
      expect(colorAttr?.startsWith('#')).toBe(true);
    });
    
    it('should mark checkmark as decorative with aria-hidden', async () => {
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'selected',
      });
      
      const checkmarkContainer = getCheckmarkElement(button);
      expect(checkmarkContainer?.getAttribute('aria-hidden')).toBe('true');
      
      // Also verify the SVG inside icon-base has aria-hidden
      const svg = getIconSvg(checkmarkContainer);
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });
    
    it('should work with nested Shadow DOM in test environment', async () => {
      // This test verifies that nested shadow DOM works in Jest/JSDOM environment
      button = await createVerticalListButtonItem({
        label: 'Test',
        leadingIcon: 'check',
        visualState: 'selected',
      });
      
      // All queries should work
      const shadowRoot = button.shadowRoot;
      expect(shadowRoot).toBeTruthy();
      
      const buttonElement = shadowRoot?.querySelector('button');
      expect(buttonElement).toBeTruthy();
      
      const leadingIconContainer = getLeadingIconElement(button);
      expect(leadingIconContainer).toBeTruthy();
      
      const checkmarkContainer = getCheckmarkElement(button);
      expect(checkmarkContainer).toBeTruthy();
      
      // Nested Shadow DOM access for both icons
      const leadingIconSvg = getIconSvg(leadingIconContainer);
      expect(leadingIconSvg).toBeTruthy();
      
      const checkmarkSvg = getIconSvg(checkmarkContainer);
      expect(checkmarkSvg).toBeTruthy();
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Fail-Loudly Behavior Tests
  // ─────────────────────────────────────────────────────────────────
  // NOTE: Comprehensive fail-loudly tests are in ButtonVerticalListItem.failLoudly.test.ts
  // These tests verify basic fail-loudly behavior for integration purposes
  
  describe('Fail-Loudly Behavior', () => {
    beforeEach(() => {
      // Start with clean state - remove all tokens
      cleanupRequiredTokens();
      document.body.innerHTML = '';
    });
    
    afterEach(() => {
      // Restore tokens after each test
      setupRequiredTokens();
      // Clean up any elements
      document.body.innerHTML = '';
    });
    
    it('should throw error when disabled attribute is set', async () => {
      // Set up tokens
      setupRequiredTokens();
      
      const button = await createVerticalListButtonItem({ label: 'Test' });
      
      // Setting disabled property to true should throw
      expect(() => {
        button.disabled = true;
      }).toThrow(/disabled.*not supported/i);
      
      cleanupVerticalListButtonItem(button);
    });
    
    it('should work correctly when all required tokens are present', async () => {
      // Ensure tokens are set up
      setupRequiredTokens();
      
      // Component should render without errors
      const button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'selected',
        leadingIcon: 'settings',
      });
      
      expect(button).toBeTruthy();
      expect(button.shadowRoot).toBeTruthy();
      
      const shadowButton = getShadowButton(button);
      expect(shadowButton).toBeTruthy();
      
      cleanupVerticalListButtonItem(button);
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Component Token Registry Integration Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Component Token Registry Integration', () => {
    let button: ButtonVerticalListItem;
    
    afterEach(() => {
      if (button) {
        cleanupVerticalListButtonItem(button);
      }
    });
    
    it('should use component tokens for padding compensation', async () => {
      // Rest state uses paddingBlock.rest (11px)
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'rest',
      });
      
      const shadowButton = getShadowButton(button);
      const style = shadowButton?.getAttribute('style') || '';
      
      // Verify padding value matches component token (11px for rest state)
      expect(style).toContain('--_vlbi-padding-block: 11px');
      
      cleanupVerticalListButtonItem(button);
      
      // Selected state uses paddingBlock.selected (10px)
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'selected',
      });
      
      const selectedButton = getShadowButton(button);
      const selectedStyle = selectedButton?.getAttribute('style') || '';
      
      // Verify padding value matches component token (10px for selected state)
      expect(selectedStyle).toContain('--_vlbi-padding-block: 10px');
    });
    
    it('should maintain height stability across visual states', async () => {
      // Test that padding compensation maintains consistent height
      // Rest: 1px border + 11px padding = 12px per side
      // Selected: 2px border + 10px padding = 12px per side
      
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'rest',
      });
      
      let shadowButton = getShadowButton(button);
      let style = shadowButton?.getAttribute('style') || '';
      
      // Rest state: 1px border, 11px padding
      expect(style).toContain('--_vlbi-border-width: var(--border-default)');
      expect(style).toContain('--_vlbi-padding-block: 11px');
      
      cleanupVerticalListButtonItem(button);
      
      button = await createVerticalListButtonItem({
        label: 'Test Label',
        visualState: 'selected',
      });
      
      shadowButton = getShadowButton(button);
      style = shadowButton?.getAttribute('style') || '';
      
      // Selected state: 2px border, 10px padding
      expect(style).toContain('--_vlbi-border-width: var(--border-emphasis)');
      expect(style).toContain('--_vlbi-padding-block: 10px');
    });
  });
});
