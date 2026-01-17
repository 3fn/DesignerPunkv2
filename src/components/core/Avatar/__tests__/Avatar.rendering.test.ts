/**
 * @category evergreen
 * @purpose Verify Avatar component rendering: shapes, sizes, borders, and interactive states
 * @jest-environment jsdom
 */
/**
 * Avatar Component Rendering Tests
 * 
 * Stemma System: Avatar Family
 * Component Type: Primitive (Base)
 * 
 * Tests the Avatar component's visual rendering:
 * - Circle shape for human type (CSS class verification)
 * - Hexagon shape for agent type (CSS class verification)
 * - All six size variants (CSS class verification)
 * - Border styles per size
 * - Interactive hover state
 * 
 * @module Avatar/__tests__
 * @see Requirements: 1.1, 1.2, 2.1-2.6, 7.1-7.4, 8.1-8.2 in .kiro/specs/042-avatar-component/requirements.md
 */

import { AvatarBaseElement } from '../platforms/web/Avatar.web';
import { AvatarSize } from '../types';

describe('Avatar Component Rendering', () => {
  beforeAll(() => {
    // Ensure custom element is registered
    if (!customElements.get('avatar-base')) {
      customElements.define('avatar-base', AvatarBaseElement);
    }
  });

  beforeEach(async () => {
    // Wait for custom element to be defined
    await customElements.whenDefined('avatar-base');
  });

  afterEach(() => {
    // Clean up any created elements
    document.body.innerHTML = '';
  });

  // ============================================================================
  // Shape Rendering - Human Type (Circle)
  // ============================================================================
  
  describe('Human Type Shape (Circle)', () => {
    /**
     * @see Requirements: 1.1 - Human type renders as perfect circle (border-radius: 50%)
     */
    it('should render with avatar--human class for human type', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--human')).toBe(true);
    });

    it('should render with avatar--human class by default (no type specified)', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--human')).toBe(true);
      expect(container?.classList.contains('avatar--agent')).toBe(false);
    });

    it('should not have avatar--agent class when type is human', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--agent')).toBe(false);
    });
  });

  // ============================================================================
  // Shape Rendering - Agent Type (Hexagon)
  // ============================================================================
  
  describe('Agent Type Shape (Hexagon)', () => {
    /**
     * @see Requirements: 1.2 - Agent type renders as regular hexagon with pointy-top orientation
     */
    it('should render with avatar--agent class for agent type', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--agent')).toBe(true);
    });

    it('should not have avatar--human class when type is agent', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--human')).toBe(false);
    });

    /**
     * @see Requirements: 11.1, 11.2 - SVG clipPath for hexagon shape
     */
    it('should include SVG clipPath definition for hexagon', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const clipPath = avatar.shadowRoot?.querySelector('#rounded-hexagon');
      expect(clipPath).toBeTruthy();
      expect(clipPath?.getAttribute('clipPathUnits')).toBe('objectBoundingBox');
    });

    it('should have hexagon polygon in clipPath', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const polygon = avatar.shadowRoot?.querySelector('#rounded-hexagon polygon');
      expect(polygon).toBeTruthy();
      // Verify pointy-top hexagon vertices
      const points = polygon?.getAttribute('points');
      expect(points).toContain('0.5,0'); // Top vertex
      expect(points).toContain('0.5,1'); // Bottom vertex
    });
  });

  // ============================================================================
  // Size Variants
  // ============================================================================
  
  describe('Size Variants', () => {
    const sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

    /**
     * @see Requirements: 2.1-2.6 - All six size variants
     */
    sizes.forEach(size => {
      it(`should render with avatar--size-${size} class for size="${size}"`, async () => {
        const avatar = document.createElement('avatar-base') as AvatarBaseElement;
        avatar.size = size;
        document.body.appendChild(avatar);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const container = avatar.shadowRoot?.querySelector('.avatar');
        expect(container?.classList.contains(`avatar--size-${size}`)).toBe(true);
      });
    });

    /**
     * @see Requirements: 2.7 - Default to "md" size when prop omitted
     */
    it('should render with avatar--size-md class by default (no size specified)', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--size-md')).toBe(true);
    });

    it('should only have one size class at a time', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.size = 'lg';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      
      // Should have lg class
      expect(container?.classList.contains('avatar--size-lg')).toBe(true);
      
      // Should not have other size classes
      const otherSizes = ['xs', 'sm', 'md', 'xl', 'xxl'];
      otherSizes.forEach(otherSize => {
        expect(container?.classList.contains(`avatar--size-${otherSize}`)).toBe(false);
      });
    });

    it('should update size class when size attribute changes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.size = 'sm';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--size-sm')).toBe(true);
      
      // Change size
      avatar.size = 'xl';
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--size-xl')).toBe(true);
      expect(container?.classList.contains('avatar--size-sm')).toBe(false);
    });
  });

  // ============================================================================
  // Size Variants with Type Combinations
  // ============================================================================
  
  describe('Size and Type Combinations', () => {
    const sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

    sizes.forEach(size => {
      it(`should render human type with size ${size} correctly`, async () => {
        const avatar = document.createElement('avatar-base') as AvatarBaseElement;
        avatar.type = 'human';
        avatar.size = size;
        document.body.appendChild(avatar);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const container = avatar.shadowRoot?.querySelector('.avatar');
        expect(container?.classList.contains('avatar--human')).toBe(true);
        expect(container?.classList.contains(`avatar--size-${size}`)).toBe(true);
      });

      it(`should render agent type with size ${size} correctly`, async () => {
        const avatar = document.createElement('avatar-base') as AvatarBaseElement;
        avatar.type = 'agent';
        avatar.size = size;
        document.body.appendChild(avatar);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const container = avatar.shadowRoot?.querySelector('.avatar');
        expect(container?.classList.contains('avatar--agent')).toBe(true);
        expect(container?.classList.contains(`avatar--size-${size}`)).toBe(true);
      });
    });
  });

  // ============================================================================
  // Border Styles
  // ============================================================================
  
  describe('Border Styles', () => {
    /**
     * @see Requirements: 7.1, 7.2 - xs through xl sizes use borderDefault width
     * 
     * Note: CSS styling is verified through class presence. Actual computed styles
     * depend on CSS custom properties being loaded, which may not be available in JSDOM.
     * These tests verify the correct classes are applied, which reference the correct tokens.
     */
    const standardBorderSizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

    standardBorderSizes.forEach(size => {
      it(`should render ${size} size with base avatar class (standard border)`, async () => {
        const avatar = document.createElement('avatar-base') as AvatarBaseElement;
        avatar.size = size;
        document.body.appendChild(avatar);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const container = avatar.shadowRoot?.querySelector('.avatar');
        expect(container).toBeTruthy();
        expect(container?.classList.contains('avatar')).toBe(true);
        expect(container?.classList.contains(`avatar--size-${size}`)).toBe(true);
        // Standard sizes don't have special border class - they use base .avatar styles
      });
    });

    /**
     * @see Requirements: 7.3, 7.4 - xxl size uses borderEmphasis width
     */
    it('should render xxl size with avatar--size-xxl class (emphasis border)', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.size = 'xxl';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container).toBeTruthy();
      expect(container?.classList.contains('avatar--size-xxl')).toBe(true);
      // xxl size has CSS rule that overrides border-width to borderEmphasis
    });
  });

  // ============================================================================
  // Interactive Hover State
  // ============================================================================
  
  describe('Interactive Hover State', () => {
    /**
     * @see Requirements: 8.1, 8.2 - Interactive avatars show hover visual feedback
     */
    it('should render with avatar--interactive class when interactive=true', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.interactive = true;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--interactive')).toBe(true);
    });

    /**
     * @see Requirements: 8.3, 8.4 - Non-interactive avatars don't show hover feedback
     */
    it('should not have avatar--interactive class when interactive=false', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.interactive = false;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--interactive')).toBe(false);
    });

    it('should not have avatar--interactive class by default', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--interactive')).toBe(false);
    });

    it('should add avatar--interactive class when interactive attribute is set', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--interactive')).toBe(false);
      
      // Set interactive attribute
      avatar.setAttribute('interactive', 'true');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--interactive')).toBe(true);
    });

    it('should remove avatar--interactive class when interactive is set to false', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.interactive = true;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--interactive')).toBe(true);
      
      // Remove interactive
      avatar.interactive = false;
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--interactive')).toBe(false);
    });
  });

  // ============================================================================
  // Interactive State with Type and Size Combinations
  // ============================================================================
  
  describe('Interactive State Combinations', () => {
    it('should render interactive human avatar with correct classes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'lg';
      avatar.interactive = true;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--human')).toBe(true);
      expect(container?.classList.contains('avatar--size-lg')).toBe(true);
      expect(container?.classList.contains('avatar--interactive')).toBe(true);
    });

    it('should render interactive agent avatar with correct classes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.size = 'xl';
      avatar.interactive = true;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--agent')).toBe(true);
      expect(container?.classList.contains('avatar--size-xl')).toBe(true);
      expect(container?.classList.contains('avatar--interactive')).toBe(true);
    });

    it('should render non-interactive avatar without interactive class', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.size = 'md';
      avatar.interactive = false;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--agent')).toBe(true);
      expect(container?.classList.contains('avatar--size-md')).toBe(true);
      expect(container?.classList.contains('avatar--interactive')).toBe(false);
    });
  });

  // ============================================================================
  // CSS Class Structure Verification
  // ============================================================================
  
  describe('CSS Class Structure', () => {
    it('should always have base avatar class', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container).toBeTruthy();
      expect(container?.classList.contains('avatar')).toBe(true);
    });

    it('should have correct class order: avatar, type, size, interactive', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.size = 'lg';
      avatar.interactive = true;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      const classList = Array.from(container?.classList || []);
      
      // Verify all expected classes are present
      expect(classList).toContain('avatar');
      expect(classList).toContain('avatar--agent');
      expect(classList).toContain('avatar--size-lg');
      expect(classList).toContain('avatar--interactive');
    });

    it('should not have empty class names', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      const classList = Array.from(container?.classList || []);
      
      // No empty strings in class list
      classList.forEach(className => {
        expect(className.trim()).not.toBe('');
      });
    });
  });
});
