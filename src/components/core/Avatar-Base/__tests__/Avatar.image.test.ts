/**
 * @category evergreen
 * @purpose Verify Avatar component image handling: display, clipping, fallback, and agent type behavior
 * @jest-environment jsdom
 */
/**
 * Avatar Component Image Handling Tests
 * 
 * Stemma System: Avatar Family
 * Component Type: Primitive (Base)
 * 
 * Tests the Avatar component's image handling functionality:
 * - Image display when src provided (human type)
 * - Image clipping to circle shape
 * - Fallback to icon on image error
 * - src ignored for agent type
 * 
 * @module Avatar/__tests__
 * @see Requirements: 5.1-5.6 in .kiro/specs/042-avatar-component/requirements.md
 */

import { AvatarBaseElement } from '../platforms/web/Avatar.web';

describe('Avatar Component Image Handling', () => {
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
  // Image Display (Human Type)
  // ============================================================================
  
  describe('Image Display (Human Type)', () => {
    /**
     * @see Requirements: 5.1 - Human type with src displays image
     */
    it('should render image element when src is provided for human type', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'User profile';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const img = avatar.shadowRoot?.querySelector('.avatar__image');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe('https://example.com/profile.jpg');
    });

    it('should set alt attribute on image element', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'User profile picture';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const img = avatar.shadowRoot?.querySelector('.avatar__image');
      expect(img?.getAttribute('alt')).toBe('User profile picture');
    });

    it('should render icon placeholder when src is not provided for human type', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const img = avatar.shadowRoot?.querySelector('.avatar__image');
      const icon = avatar.shadowRoot?.querySelector('.avatar__icon');
      
      expect(img).toBeFalsy();
      expect(icon).toBeTruthy();
    });

    it('should update image when src attribute changes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/old-image.jpg';
      avatar.alt = 'Profile';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let img = avatar.shadowRoot?.querySelector('.avatar__image');
      expect(img?.getAttribute('src')).toBe('https://example.com/old-image.jpg');
      
      // Change src
      avatar.src = 'https://example.com/new-image.jpg';
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      img = avatar.shadowRoot?.querySelector('.avatar__image');
      expect(img?.getAttribute('src')).toBe('https://example.com/new-image.jpg');
    });
  });

  // ============================================================================
  // Image Clipping to Circle Shape
  // ============================================================================
  
  describe('Image Clipping to Circle Shape', () => {
    /**
     * @see Requirements: 5.3 - Image clipped to circle shape
     * 
     * Note: Actual clipping is achieved via parent container's border-radius.
     * We verify the avatar has the correct class that applies border-radius: 50%.
     */
    it('should have avatar--human class for circle clipping when displaying image', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'Profile';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--human')).toBe(true);
    });

    it('should have avatar--has-image class when displaying image', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'Profile';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--has-image')).toBe(true);
    });

    it('should not have avatar--has-image class when no image is provided', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--has-image')).toBe(false);
    });

    /**
     * @see Requirements: 5.2 - Image uses object-fit: cover
     * 
     * Note: CSS styling is verified through class presence. The avatar__image
     * class applies object-fit: cover for proper image scaling.
     */
    it('should have avatar__image class for proper image scaling', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'Profile';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const img = avatar.shadowRoot?.querySelector('img');
      expect(img?.classList.contains('avatar__image')).toBe(true);
    });
  });

  // ============================================================================
  // Image Error Handling (Fallback to Icon)
  // ============================================================================
  
  describe('Image Error Handling (Fallback to Icon)', () => {
    /**
     * @see Requirements: 5.6 - Fall back to icon placeholder when image fails to load
     */
    it('should fall back to icon when image fails to load', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/nonexistent.jpg';
      avatar.alt = 'Profile';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify image element exists initially
      let img = avatar.shadowRoot?.querySelector('.avatar__image');
      expect(img).toBeTruthy();
      
      // Simulate image error
      const errorEvent = new Event('error');
      img?.dispatchEvent(errorEvent);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // After error, should show icon instead of image
      img = avatar.shadowRoot?.querySelector('.avatar__image');
      const icon = avatar.shadowRoot?.querySelector('.avatar__icon');
      
      expect(img).toBeFalsy();
      expect(icon).toBeTruthy();
    });

    it('should remove src attribute after image error to prevent retry loops', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/broken.jpg';
      avatar.alt = 'Profile';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify src is set initially
      expect(avatar.src).toBe('https://example.com/broken.jpg');
      
      // Simulate image error
      const img = avatar.shadowRoot?.querySelector('.avatar__image');
      const errorEvent = new Event('error');
      img?.dispatchEvent(errorEvent);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // After error, src should be removed
      expect(avatar.src).toBeNull();
      expect(avatar.hasAttribute('src')).toBe(false);
    });

    it('should show human icon placeholder after image error', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/broken.jpg';
      avatar.alt = 'Profile';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Simulate image error
      const img = avatar.shadowRoot?.querySelector('.avatar__image');
      img?.dispatchEvent(new Event('error'));
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Should show human icon (user icon)
      const icon = avatar.shadowRoot?.querySelector('.avatar__icon--human');
      expect(icon).toBeTruthy();
    });
  });

  // ============================================================================
  // Agent Type Ignores src Prop
  // ============================================================================
  
  describe('Agent Type Ignores src Prop', () => {
    /**
     * @see Requirements: 5.5 - Agent type ignores src prop (agents don't support images)
     */
    it('should not render image for agent type even when src is provided', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.src = 'https://example.com/agent-image.jpg';
      avatar.alt = 'Agent profile';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const img = avatar.shadowRoot?.querySelector('.avatar__image');
      const icon = avatar.shadowRoot?.querySelector('.avatar__icon');
      
      expect(img).toBeFalsy();
      expect(icon).toBeTruthy();
    });

    it('should render agent icon when src is provided for agent type', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.src = 'https://example.com/agent-image.jpg';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const icon = avatar.shadowRoot?.querySelector('.avatar__icon--agent');
      expect(icon).toBeTruthy();
    });

    it('should not have avatar--has-image class for agent type with src', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.src = 'https://example.com/agent-image.jpg';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--has-image')).toBe(false);
    });

    it('should have avatar--agent class (hexagon shape) even when src is provided', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.src = 'https://example.com/agent-image.jpg';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--agent')).toBe(true);
      expect(container?.classList.contains('avatar--human')).toBe(false);
    });
  });

  // ============================================================================
  // Image with Different Sizes
  // ============================================================================
  
  describe('Image with Different Sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;

    sizes.forEach(size => {
      it(`should render image correctly at ${size} size`, async () => {
        const avatar = document.createElement('avatar-base') as AvatarBaseElement;
        avatar.type = 'human';
        avatar.size = size;
        avatar.src = 'https://example.com/profile.jpg';
        avatar.alt = 'Profile';
        document.body.appendChild(avatar);
        
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const container = avatar.shadowRoot?.querySelector('.avatar');
        const img = avatar.shadowRoot?.querySelector('.avatar__image');
        
        expect(container?.classList.contains(`avatar--size-${size}`)).toBe(true);
        expect(img).toBeTruthy();
      });
    });
  });

  // ============================================================================
  // Alt Text Accessibility Warning
  // ============================================================================
  
  describe('Alt Text Accessibility Warning', () => {
    /**
     * @see Requirements: 5.4 - Require alt prop when src is provided
     */
    it('should warn when src is provided without alt', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      // Intentionally not setting alt
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('alt')
      );
      
      consoleSpy.mockRestore();
    });

    it('should not warn when both src and alt are provided', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'User profile picture';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });
});
