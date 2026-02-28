/**
 * @category evergreen
 * @purpose Verify Avatar component core API, props, defaults, and attribute reflection
 * @jest-environment jsdom
 */
/**
 * Avatar Component Core API Tests
 * 
 * Stemma System: Avatar Family
 * Component Type: Primitive (Base)
 * 
 * Tests the Avatar component's core API functionality:
 * - All prop combinations (type, size, src, alt, interactive, decorative, testID)
 * - Default values for all props
 * - Attribute reflection (property ↔ attribute synchronization)
 * - Web component lifecycle
 * 
 * @module Avatar/__tests__
 * @see Requirements: 1.5, 2.7, 8.4, 9.3, 16.2 in .kiro/specs/042-avatar-component/requirements.md
 */

import { AvatarBaseElement } from '../platforms/web/Avatar.web';
import { AVATAR_DEFAULTS, AvatarType, AvatarSize } from '../types';

describe('Avatar Component Core API', () => {
  beforeAll(() => {
    // Ensure custom element is registered
    if (!customElements.get('avatar-base')) {
      customElements.define('avatar-base', AvatarBaseElement);
    }
  });

  afterEach(() => {
    // Clean up any created elements
    document.body.innerHTML = '';
  });

  // ============================================================================
  // Default Values
  // ============================================================================
  
  describe('Default Values', () => {
    /**
     * @see Requirements: 1.5 - Default to "human" type when prop omitted
     */
    it('should default type to "human" when not specified', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      expect(avatar.type).toBe('human');
      expect(avatar.type).toBe(AVATAR_DEFAULTS.type);
    });

    /**
     * @see Requirements: 2.7 - Default to "md" size when prop omitted
     */
    it('should default size to "md" when not specified', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      expect(avatar.size).toBe('md');
      expect(avatar.size).toBe(AVATAR_DEFAULTS.size);
    });

    /**
     * @see Requirements: 8.4 - Default interactive to false when prop omitted
     */
    it('should default interactive to false when not specified', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      expect(avatar.interactive).toBe(false);
      expect(avatar.interactive).toBe(AVATAR_DEFAULTS.interactive);
    });

    /**
     * @see Requirements: 9.3 - Default decorative to false when prop omitted
     */
    it('should default decorative to false when not specified', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      expect(avatar.decorative).toBe(false);
      expect(avatar.decorative).toBe(AVATAR_DEFAULTS.decorative);
    });

    it('should default src to null when not specified', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      expect(avatar.src).toBeNull();
    });

    it('should default alt to null when not specified', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      expect(avatar.alt).toBeNull();
    });

    /**
     * @see Requirements: 16.2 - testID prop omitted means no test identifier
     */
    it('should default testID to null when not specified', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      expect(avatar.testID).toBeNull();
    });
  });

  // ============================================================================
  // Type Prop
  // ============================================================================
  
  describe('Type Prop', () => {
    it('should accept "human" type', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      document.body.appendChild(avatar);
      
      expect(avatar.type).toBe('human');
      expect(avatar.getAttribute('type')).toBe('human');
    });

    it('should accept "agent" type', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      document.body.appendChild(avatar);
      
      expect(avatar.type).toBe('agent');
      expect(avatar.getAttribute('type')).toBe('agent');
    });

    it('should fall back to "human" for invalid type values', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.setAttribute('type', 'invalid');
      document.body.appendChild(avatar);
      
      expect(avatar.type).toBe('human');
    });

    it('should update type via attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.setAttribute('type', 'agent');
      expect(avatar.type).toBe('agent');
      
      avatar.setAttribute('type', 'human');
      expect(avatar.type).toBe('human');
    });

    it('should update type via property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.type = 'agent';
      expect(avatar.getAttribute('type')).toBe('agent');
      
      avatar.type = 'human';
      expect(avatar.getAttribute('type')).toBe('human');
    });
  });

  // ============================================================================
  // Size Prop
  // ============================================================================
  
  describe('Size Prop', () => {
    const validSizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];

    validSizes.forEach(size => {
      it(`should accept "${size}" size`, () => {
        const avatar = document.createElement('avatar-base') as AvatarBaseElement;
        avatar.size = size;
        document.body.appendChild(avatar);
        
        expect(avatar.size).toBe(size);
        expect(avatar.getAttribute('size')).toBe(size);
      });
    });

    it('should fall back to "md" for invalid size values', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.setAttribute('size', 'invalid');
      document.body.appendChild(avatar);
      
      expect(avatar.size).toBe('md');
    });

    it('should update size via attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.setAttribute('size', 'lg');
      expect(avatar.size).toBe('lg');
      
      avatar.setAttribute('size', 'xs');
      expect(avatar.size).toBe('xs');
    });

    it('should update size via property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.size = 'xl';
      expect(avatar.getAttribute('size')).toBe('xl');
      
      avatar.size = 'sm';
      expect(avatar.getAttribute('size')).toBe('sm');
    });
  });

  // ============================================================================
  // Src Prop
  // ============================================================================
  
  describe('Src Prop', () => {
    it('should accept src value', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.src = 'https://example.com/image.jpg';
      document.body.appendChild(avatar);
      
      expect(avatar.src).toBe('https://example.com/image.jpg');
      expect(avatar.getAttribute('src')).toBe('https://example.com/image.jpg');
    });

    it('should update src via attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.setAttribute('src', 'https://example.com/new-image.jpg');
      expect(avatar.src).toBe('https://example.com/new-image.jpg');
    });

    it('should update src via property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.src = 'https://example.com/profile.png';
      expect(avatar.getAttribute('src')).toBe('https://example.com/profile.png');
    });

    it('should remove src attribute when set to null', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.src = 'https://example.com/image.jpg';
      document.body.appendChild(avatar);
      
      avatar.src = null;
      expect(avatar.src).toBeNull();
      expect(avatar.hasAttribute('src')).toBe(false);
    });
  });

  // ============================================================================
  // Alt Prop
  // ============================================================================
  
  describe('Alt Prop', () => {
    it('should accept alt value', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.alt = 'User profile picture';
      document.body.appendChild(avatar);
      
      expect(avatar.alt).toBe('User profile picture');
      expect(avatar.getAttribute('alt')).toBe('User profile picture');
    });

    it('should update alt via attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.setAttribute('alt', 'New alt text');
      expect(avatar.alt).toBe('New alt text');
    });

    it('should update alt via property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.alt = 'Profile image';
      expect(avatar.getAttribute('alt')).toBe('Profile image');
    });

    it('should remove alt attribute when set to null', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.alt = 'Some alt text';
      document.body.appendChild(avatar);
      
      avatar.alt = null;
      expect(avatar.alt).toBeNull();
      expect(avatar.hasAttribute('alt')).toBe(false);
    });
  });

  // ============================================================================
  // Interactive Prop
  // ============================================================================
  
  describe('Interactive Prop', () => {
    it('should accept interactive=true', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.interactive = true;
      document.body.appendChild(avatar);
      
      expect(avatar.interactive).toBe(true);
      expect(avatar.getAttribute('interactive')).toBe('true');
    });

    it('should accept interactive=false', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.interactive = false;
      document.body.appendChild(avatar);
      
      expect(avatar.interactive).toBe(false);
      expect(avatar.hasAttribute('interactive')).toBe(false);
    });

    it('should update interactive via attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.setAttribute('interactive', 'true');
      expect(avatar.interactive).toBe(true);
      
      avatar.removeAttribute('interactive');
      expect(avatar.interactive).toBe(false);
    });

    it('should update interactive via property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.interactive = true;
      expect(avatar.getAttribute('interactive')).toBe('true');
      
      avatar.interactive = false;
      expect(avatar.hasAttribute('interactive')).toBe(false);
    });

    it('should only recognize "true" string as truthy', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.setAttribute('interactive', 'yes');
      expect(avatar.interactive).toBe(false);
      
      avatar.setAttribute('interactive', '1');
      expect(avatar.interactive).toBe(false);
      
      avatar.setAttribute('interactive', 'true');
      expect(avatar.interactive).toBe(true);
    });
  });

  // ============================================================================
  // Decorative Prop
  // ============================================================================
  
  describe('Decorative Prop', () => {
    it('should accept decorative=true', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.decorative = true;
      document.body.appendChild(avatar);
      
      expect(avatar.decorative).toBe(true);
      expect(avatar.getAttribute('decorative')).toBe('true');
    });

    it('should accept decorative=false', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.decorative = false;
      document.body.appendChild(avatar);
      
      expect(avatar.decorative).toBe(false);
      expect(avatar.hasAttribute('decorative')).toBe(false);
    });

    it('should update decorative via attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.setAttribute('decorative', 'true');
      expect(avatar.decorative).toBe(true);
      
      avatar.removeAttribute('decorative');
      expect(avatar.decorative).toBe(false);
    });

    it('should update decorative via property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.decorative = true;
      expect(avatar.getAttribute('decorative')).toBe('true');
      
      avatar.decorative = false;
      expect(avatar.hasAttribute('decorative')).toBe(false);
    });

    it('should only recognize "true" string as truthy', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.setAttribute('decorative', 'yes');
      expect(avatar.decorative).toBe(false);
      
      avatar.setAttribute('decorative', '1');
      expect(avatar.decorative).toBe(false);
      
      avatar.setAttribute('decorative', 'true');
      expect(avatar.decorative).toBe(true);
    });
  });

  // ============================================================================
  // TestID Prop
  // ============================================================================
  
  describe('TestID Prop', () => {
    /**
     * @see Requirements: 16.1 - Apply data-testid when testID prop provided
     */
    it('should accept testID value', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.testID = 'user-avatar';
      document.body.appendChild(avatar);
      
      expect(avatar.testID).toBe('user-avatar');
      expect(avatar.getAttribute('testid')).toBe('user-avatar');
    });

    it('should update testID via attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.setAttribute('testid', 'new-test-id');
      expect(avatar.testID).toBe('new-test-id');
    });

    it('should update testID via property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.testID = 'avatar-test';
      expect(avatar.getAttribute('testid')).toBe('avatar-test');
    });

    it('should remove testid attribute when set to null', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.testID = 'some-id';
      document.body.appendChild(avatar);
      
      avatar.testID = null;
      expect(avatar.testID).toBeNull();
      expect(avatar.hasAttribute('testid')).toBe(false);
    });
  });

  // ============================================================================
  // Prop Combinations
  // ============================================================================
  
  describe('Prop Combinations', () => {
    it('should handle all props set together', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'lg';
      avatar.src = 'https://example.com/profile.jpg';
      avatar.alt = 'User profile';
      avatar.interactive = true;
      avatar.decorative = false;
      avatar.testID = 'user-avatar';
      document.body.appendChild(avatar);
      
      expect(avatar.type).toBe('human');
      expect(avatar.size).toBe('lg');
      expect(avatar.src).toBe('https://example.com/profile.jpg');
      expect(avatar.alt).toBe('User profile');
      expect(avatar.interactive).toBe(true);
      expect(avatar.decorative).toBe(false);
      expect(avatar.testID).toBe('user-avatar');
    });

    it('should handle agent type with all sizes', () => {
      const sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
      
      sizes.forEach(size => {
        const avatar = document.createElement('avatar-base') as AvatarBaseElement;
        avatar.type = 'agent';
        avatar.size = size;
        document.body.appendChild(avatar);
        
        expect(avatar.type).toBe('agent');
        expect(avatar.size).toBe(size);
        
        document.body.removeChild(avatar);
      });
    });

    it('should handle human type with all sizes', () => {
      const sizes: AvatarSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
      
      sizes.forEach(size => {
        const avatar = document.createElement('avatar-base') as AvatarBaseElement;
        avatar.type = 'human';
        avatar.size = size;
        document.body.appendChild(avatar);
        
        expect(avatar.type).toBe('human');
        expect(avatar.size).toBe(size);
        
        document.body.removeChild(avatar);
      });
    });

    it('should handle interactive agent avatar', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.size = 'xl';
      avatar.interactive = true;
      document.body.appendChild(avatar);
      
      expect(avatar.type).toBe('agent');
      expect(avatar.size).toBe('xl');
      expect(avatar.interactive).toBe(true);
    });

    it('should handle decorative human avatar with image', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'human';
      avatar.size = 'md';
      avatar.src = 'https://example.com/avatar.png';
      avatar.alt = 'Decorative avatar';
      avatar.decorative = true;
      document.body.appendChild(avatar);
      
      expect(avatar.type).toBe('human');
      expect(avatar.src).toBe('https://example.com/avatar.png');
      expect(avatar.decorative).toBe(true);
    });
  });

  // ============================================================================
  // Attribute Reflection
  // ============================================================================
  
  describe('Attribute Reflection', () => {
    it('should reflect type property to attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.type = 'agent';
      expect(avatar.getAttribute('type')).toBe('agent');
    });

    it('should reflect size property to attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.size = 'xxl';
      expect(avatar.getAttribute('size')).toBe('xxl');
    });

    it('should reflect src property to attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.src = 'https://example.com/test.jpg';
      expect(avatar.getAttribute('src')).toBe('https://example.com/test.jpg');
    });

    it('should reflect alt property to attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.alt = 'Test alt';
      expect(avatar.getAttribute('alt')).toBe('Test alt');
    });

    it('should reflect interactive property to attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.interactive = true;
      expect(avatar.getAttribute('interactive')).toBe('true');
      
      avatar.interactive = false;
      expect(avatar.hasAttribute('interactive')).toBe(false);
    });

    it('should reflect decorative property to attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.decorative = true;
      expect(avatar.getAttribute('decorative')).toBe('true');
      
      avatar.decorative = false;
      expect(avatar.hasAttribute('decorative')).toBe(false);
    });

    it('should reflect testID property to attribute', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      avatar.testID = 'my-test-id';
      expect(avatar.getAttribute('testid')).toBe('my-test-id');
    });

    it('should read type attribute as property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.setAttribute('type', 'agent');
      document.body.appendChild(avatar);
      
      expect(avatar.type).toBe('agent');
    });

    it('should read size attribute as property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.setAttribute('size', 'xl');
      document.body.appendChild(avatar);
      
      expect(avatar.size).toBe('xl');
    });

    it('should read src attribute as property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.setAttribute('src', 'https://example.com/img.png');
      document.body.appendChild(avatar);
      
      expect(avatar.src).toBe('https://example.com/img.png');
    });

    it('should read alt attribute as property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.setAttribute('alt', 'Alt from attribute');
      document.body.appendChild(avatar);
      
      expect(avatar.alt).toBe('Alt from attribute');
    });

    it('should read interactive attribute as property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.setAttribute('interactive', 'true');
      document.body.appendChild(avatar);
      
      expect(avatar.interactive).toBe(true);
    });

    it('should read decorative attribute as property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.setAttribute('decorative', 'true');
      document.body.appendChild(avatar);
      
      expect(avatar.decorative).toBe(true);
    });

    it('should read testid attribute as property', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.setAttribute('testid', 'test-from-attr');
      document.body.appendChild(avatar);
      
      expect(avatar.testID).toBe('test-from-attr');
    });
  });

  // ============================================================================
  // Observed Attributes
  // ============================================================================
  
  describe('Observed Attributes', () => {
    it('should observe all required attributes', () => {
      const observed = AvatarBaseElement.observedAttributes;
      
      expect(observed).toContain('type');
      expect(observed).toContain('size');
      expect(observed).toContain('src');
      expect(observed).toContain('alt');
      expect(observed).toContain('interactive');
      expect(observed).toContain('decorative');
      expect(observed).toContain('testid');
    });

    it('should have exactly 7 observed attributes', () => {
      const observed = AvatarBaseElement.observedAttributes;
      expect(observed.length).toBe(7);
    });
  });
});
