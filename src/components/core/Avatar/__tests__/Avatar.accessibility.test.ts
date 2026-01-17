/**
 * @category evergreen
 * @purpose Verify Avatar component accessibility: aria-hidden, alt text, screen reader support
 * @jest-environment jsdom
 */
/**
 * Avatar Component Accessibility Tests
 * 
 * Stemma System: Avatar Family
 * Component Type: Primitive (Base)
 * 
 * Tests the Avatar component's accessibility features:
 * - aria-hidden when decorative
 * - alt text on images
 * - Screen reader announcements
 * - No aria-hidden when not decorative
 * 
 * @module Avatar/__tests__
 * @see Requirements: 9.1, 9.2, 9.3, 9.4 in .kiro/specs/042-avatar-component/requirements.md
 */

import { AvatarBaseElement } from '../platforms/web/Avatar.web';

describe('Avatar Component Accessibility', () => {
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
  // Decorative Mode (aria-hidden)
  // ============================================================================
  
  describe('Decorative Mode (aria-hidden)', () => {
    /**
     * @see Requirements: 9.2 - Apply aria-hidden="true" when decorative prop is true
     */
    it('should apply aria-hidden="true" when decorative is true', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.decorative = true;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should apply aria-hidden via attribute', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.setAttribute('decorative', 'true');
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.getAttribute('aria-hidden')).toBe('true');
    });

    /**
     * @see Requirements: 9.3 - Default decorative to false (announced to screen readers)
     */
    it('should NOT have aria-hidden when decorative is false', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.decorative = false;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.hasAttribute('aria-hidden')).toBe(false);
    });

    it('should NOT have aria-hidden by default (decorative not specified)', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.hasAttribute('aria-hidden')).toBe(false);
    });

    it('should remove aria-hidden when decorative changes from true to false', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.decorative = true;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.getAttribute('aria-hidden')).toBe('true');
      
      // Change decorative to false
      avatar.decorative = false;
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.hasAttribute('aria-hidden')).toBe(false);
    });

    it('should add aria-hidden when decorative changes from false to true', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.decorative = false;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.hasAttribute('aria-hidden')).toBe(false);
      
      // Change decorative to true
      avatar.decorative = true;
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  // ============================================================================
  // Decorative Mode with Type Combinations
  // ============================================================================
  
  describe('Decorative Mode with Type Combinations', () => {
    it('should apply aria-hidden to decorative human avatar', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.decorative = true;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.getAttribute('aria-hidden')).toBe('true');
      expect(container?.classList.contains('avatar--human')).toBe(true);
    });

    it('should apply aria-hidden to decorative agent avatar', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.decorative = true;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.getAttribute('aria-hidden')).toBe('true');
      expect(container?.classList.contains('avatar--agent')).toBe(true);
    });

    it('should NOT have aria-hidden on non-decorative human avatar', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.decorative = false;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.hasAttribute('aria-hidden')).toBe(false);
    });

    it('should NOT have aria-hidden on non-decorative agent avatar', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.decorative = false;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.hasAttribute('aria-hidden')).toBe(false);
    });
  });

  // ============================================================================
  // Image Alt Text
  // ============================================================================
  
  describe('Image Alt Text', () => {
    /**
     * @see Requirements: 9.1 - Apply alt text to image for screen reader announcement
     */
    it('should apply alt attribute to image element', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'User profile picture';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const img = avatar.shadowRoot?.querySelector('.avatar__image');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('alt')).toBe('User profile picture');
    });

    it('should apply empty alt when alt is empty string', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = '';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const img = avatar.shadowRoot?.querySelector('.avatar__image');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('alt')).toBe('');
    });

    it('should update alt when alt attribute changes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'Original alt text';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      let img = avatar.shadowRoot?.querySelector('.avatar__image');
      expect(img?.getAttribute('alt')).toBe('Original alt text');
      
      // Change alt
      avatar.alt = 'Updated alt text';
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      img = avatar.shadowRoot?.querySelector('.avatar__image');
      expect(img?.getAttribute('alt')).toBe('Updated alt text');
    });

    /**
     * @see Requirements: 5.4 - Require alt prop when src is provided (console warning)
     */
    it('should warn when src is provided without alt', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      // No alt provided
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('alt')
      );
      
      consoleSpy.mockRestore();
    });

    it('should NOT warn when src and alt are both provided', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'User profile';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should NOT warn when no src is provided', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      // No src, no alt
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  // ============================================================================
  // SVG Accessibility
  // ============================================================================
  
  describe('SVG Accessibility', () => {
    it('should have aria-hidden on SVG clipPath definition', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const svg = avatar.shadowRoot?.querySelector('svg');
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should have aria-hidden on icon SVG elements', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // The icon SVG should be hidden from screen readers
      // (the avatar container provides the accessible name)
      const iconSvg = avatar.shadowRoot?.querySelector('.avatar__icon-svg');
      if (iconSvg) {
        expect(iconSvg.getAttribute('aria-hidden')).toBe('true');
      }
    });
  });

  // ============================================================================
  // Screen Reader Announcements
  // ============================================================================
  
  describe('Screen Reader Announcements', () => {
    /**
     * @see Requirements: 9.4 - Wrapper provides accessible name in interactive context
     * 
     * Note: The avatar component itself doesn't provide an accessible name.
     * When used in interactive contexts, the wrapper (button/link) should provide
     * the accessible name. These tests verify the avatar doesn't interfere with
     * screen reader announcements.
     */
    it('should be visible to screen readers when not decorative', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.decorative = false;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      // No aria-hidden means screen readers will announce the element
      expect(container?.hasAttribute('aria-hidden')).toBe(false);
    });

    it('should be hidden from screen readers when decorative', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.decorative = true;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      // aria-hidden="true" hides from screen readers
      expect(container?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should allow image alt text to be announced', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'John Doe profile picture';
      avatar.decorative = false;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      const img = avatar.shadowRoot?.querySelector('.avatar__image');
      
      // Container is not hidden
      expect(container?.hasAttribute('aria-hidden')).toBe(false);
      // Image has alt text for announcement
      expect(img?.getAttribute('alt')).toBe('John Doe profile picture');
    });

    it('should hide image alt text when decorative', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'John Doe profile picture';
      avatar.decorative = true;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      
      // Container is hidden, so image alt won't be announced
      expect(container?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  // ============================================================================
  // Decorative Mode with Image
  // ============================================================================
  
  describe('Decorative Mode with Image', () => {
    it('should apply aria-hidden to decorative avatar with image', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'User profile';
      avatar.decorative = true;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.getAttribute('aria-hidden')).toBe('true');
      
      // Image still has alt for fallback, but container hides it
      const img = avatar.shadowRoot?.querySelector('.avatar__image');
      expect(img?.getAttribute('alt')).toBe('User profile');
    });

    it('should NOT have aria-hidden on non-decorative avatar with image', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'User profile';
      avatar.decorative = false;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.hasAttribute('aria-hidden')).toBe(false);
      
      // Image alt is accessible
      const img = avatar.shadowRoot?.querySelector('.avatar__image');
      expect(img?.getAttribute('alt')).toBe('User profile');
    });
  });

  // ============================================================================
  // testID Accessibility
  // ============================================================================
  
  describe('testID Accessibility', () => {
    /**
     * testID is for automated testing, not accessibility.
     * Verify it doesn't interfere with accessibility attributes.
     */
    it('should apply data-testid without affecting aria-hidden', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.testID = 'user-avatar';
      avatar.decorative = true;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.getAttribute('data-testid')).toBe('user-avatar');
      expect(container?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should apply data-testid on non-decorative avatar', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.testID = 'user-avatar';
      avatar.decorative = false;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.getAttribute('data-testid')).toBe('user-avatar');
      expect(container?.hasAttribute('aria-hidden')).toBe(false);
    });
  });
});
