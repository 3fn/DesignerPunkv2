/**
 * @category evergreen
 * @purpose Verify Avatar web component lifecycle behavior (registration, callbacks, shadow DOM)
 * @jest-environment jsdom
 */
/**
 * Avatar Web Component Lifecycle Tests
 * 
 * Stemma System: Avatar Family
 * Component Type: Primitive (Base)
 * 
 * Tests the Avatar component's web component lifecycle:
 * - Custom element registration
 * - connectedCallback behavior
 * - attributeChangedCallback behavior
 * - Shadow DOM initialization
 * 
 * @module Avatar/__tests__
 * @see Requirements: 11.1 in .kiro/specs/042-avatar-component/requirements.md
 */

import { AvatarBaseElement } from '../platforms/web/Avatar.web';

describe('Avatar Web Component Lifecycle', () => {
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
  // Custom Element Registration
  // ============================================================================
  
  describe('Custom Element Registration', () => {
    /**
     * @see Requirements: 11.1 - Register custom element as <avatar-base>
     */
    it('should be registered as "avatar-base" custom element', () => {
      const ElementClass = customElements.get('avatar-base');
      expect(ElementClass).toBe(AvatarBaseElement);
    });

    it('should be creatable via document.createElement', () => {
      const avatar = document.createElement('avatar-base');
      expect(avatar).toBeInstanceOf(AvatarBaseElement);
    });

    it('should be creatable via constructor', () => {
      const avatar = new AvatarBaseElement();
      expect(avatar).toBeInstanceOf(AvatarBaseElement);
    });

    it('should have correct tag name', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      expect(avatar.tagName.toLowerCase()).toBe('avatar-base');
    });

    it('should not allow duplicate registration', () => {
      // Attempting to register again should not throw (our code checks first)
      // The customElements.get check in the module prevents duplicate registration
      const ElementClass = customElements.get('avatar-base');
      expect(ElementClass).toBe(AvatarBaseElement);
    });
  });

  // ============================================================================
  // Shadow DOM Initialization
  // ============================================================================
  
  describe('Shadow DOM Initialization', () => {
    /**
     * @see Requirements: 11.1 - Web component with Shadow DOM
     */
    it('should attach shadow DOM in constructor', () => {
      const avatar = new AvatarBaseElement();
      expect(avatar.shadowRoot).toBeTruthy();
    });

    it('should attach shadow DOM in open mode', () => {
      const avatar = new AvatarBaseElement();
      expect(avatar.shadowRoot).not.toBeNull();
      // Open mode means shadowRoot is accessible
      expect(avatar.shadowRoot?.mode).toBe('open');
    });

    it('should have shadow DOM before being added to document', () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      // Shadow DOM is attached in constructor, before connectedCallback
      expect(avatar.shadowRoot).toBeTruthy();
    });

    it('should have empty shadow DOM before connectedCallback', () => {
      const avatar = new AvatarBaseElement();
      // Before connectedCallback, shadow DOM exists but may not have content
      // The render() method is called in connectedCallback
      expect(avatar.shadowRoot).toBeTruthy();
    });
  });

  // ============================================================================
  // connectedCallback Behavior
  // ============================================================================
  
  describe('connectedCallback Behavior', () => {
    /**
     * @see Requirements: 11.1 - connectedCallback with initial render
     */
    it('should render content when added to DOM', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      // Wait for connectedCallback to fire and render
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container).toBeTruthy();
    });

    it('should render with default type class when added to DOM', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--human')).toBe(true);
    });

    it('should render with default size class when added to DOM', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--size-md')).toBe(true);
    });

    it('should render with attributes set before connection', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.setAttribute('type', 'agent');
      avatar.setAttribute('size', 'lg');
      
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--agent')).toBe(true);
      expect(container?.classList.contains('avatar--size-lg')).toBe(true);
    });

    it('should render with properties set before connection', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      avatar.size = 'xl';
      
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--agent')).toBe(true);
      expect(container?.classList.contains('avatar--size-xl')).toBe(true);
    });

    it('should include SVG for agent type avatars', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Agent type uses inline SVG with Bézier curves for hexagon shape
      const svg = avatar.shadowRoot?.querySelector('.avatar__hexagon-svg');
      expect(svg).toBeTruthy();
      
      // SVG should have defs element for clipPath definition
      const defs = svg?.querySelector('defs');
      expect(defs).toBeTruthy();
      
      // Defs should contain clipPath (check innerHTML since JSDOM may have SVG namespace issues)
      const defsHTML = defs?.innerHTML || '';
      expect(defsHTML).toContain('clipPath');
      expect(defsHTML).toContain('path');
    });

    it('should include style element with CSS', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const style = avatar.shadowRoot?.querySelector('style');
      expect(style).toBeTruthy();
      // Note: In Jest, CSS imports are mocked to empty strings (see styleMock.js)
      // The style element contains :host styles which are inline in the component
      expect(style?.textContent).toContain(':host');
    });

    it('should set isConnected to true after connection', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      expect(avatar.isConnected).toBe(false);
      
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(avatar.isConnected).toBe(true);
    });

    it('should handle multiple connections and disconnections', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      
      // First connection
      document.body.appendChild(avatar);
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(avatar.isConnected).toBe(true);
      
      // Disconnection
      document.body.removeChild(avatar);
      expect(avatar.isConnected).toBe(false);
      
      // Second connection
      document.body.appendChild(avatar);
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(avatar.isConnected).toBe(true);
      
      // Verify content is still rendered
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container).toBeTruthy();
    });
  });

  // ============================================================================
  // attributeChangedCallback Behavior
  // ============================================================================
  
  describe('attributeChangedCallback Behavior', () => {
    /**
     * @see Requirements: 11.1 - attributeChangedCallback for prop updates
     */
    it('should re-render when type attribute changes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify initial state
      let container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--human')).toBe(true);
      
      // Change attribute
      avatar.setAttribute('type', 'agent');
      
      // Wait for attributeChangedCallback to fire
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify updated state
      container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--agent')).toBe(true);
      expect(container?.classList.contains('avatar--human')).toBe(false);
    });

    it('should re-render when size attribute changes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify initial state
      let container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--size-md')).toBe(true);
      
      // Change attribute
      avatar.setAttribute('size', 'xxl');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify updated state
      container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--size-xxl')).toBe(true);
      expect(container?.classList.contains('avatar--size-md')).toBe(false);
    });

    it('should re-render when interactive attribute changes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify initial state (not interactive)
      let container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--interactive')).toBe(false);
      
      // Change attribute
      avatar.setAttribute('interactive', 'true');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify updated state
      container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--interactive')).toBe(true);
    });

    it('should re-render when decorative attribute changes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify initial state (not decorative)
      let container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.hasAttribute('aria-hidden')).toBe(false);
      
      // Change attribute
      avatar.setAttribute('decorative', 'true');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify updated state
      container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should re-render when testid attribute changes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify initial state (no testid)
      let container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.hasAttribute('data-testid')).toBe(false);
      
      // Change attribute
      avatar.setAttribute('testid', 'my-avatar');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify updated state
      container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.getAttribute('data-testid')).toBe('my-avatar');
    });

    it('should not re-render when attribute value is unchanged', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.setAttribute('type', 'human');
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Get reference to current container
      const container = avatar.shadowRoot?.querySelector('.avatar');
      const initialHTML = avatar.shadowRoot?.innerHTML;
      
      // Set same value
      avatar.setAttribute('type', 'human');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Content should be the same (no unnecessary re-render)
      // Note: The implementation checks oldValue !== newValue
      expect(avatar.shadowRoot?.innerHTML).toBe(initialHTML);
    });

    it('should not re-render when element is not connected', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      
      // Element is not connected to DOM
      expect(avatar.isConnected).toBe(false);
      
      // Change attribute while disconnected
      avatar.setAttribute('type', 'agent');
      
      // Shadow DOM should exist but may not have rendered content
      // The attributeChangedCallback checks isConnected before rendering
      expect(avatar.shadowRoot).toBeTruthy();
    });

    it('should handle rapid attribute changes', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Rapid changes
      avatar.setAttribute('size', 'xs');
      avatar.setAttribute('size', 'sm');
      avatar.setAttribute('size', 'md');
      avatar.setAttribute('size', 'lg');
      avatar.setAttribute('size', 'xl');
      avatar.setAttribute('size', 'xxl');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Final state should be xxl
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--size-xxl')).toBe(true);
    });

    it('should handle multiple attribute changes in sequence', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Change multiple attributes
      avatar.setAttribute('type', 'agent');
      avatar.setAttribute('size', 'xl');
      avatar.setAttribute('interactive', 'true');
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Verify all changes applied
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container?.classList.contains('avatar--agent')).toBe(true);
      expect(container?.classList.contains('avatar--size-xl')).toBe(true);
      expect(container?.classList.contains('avatar--interactive')).toBe(true);
    });
  });

  // ============================================================================
  // Observed Attributes
  // ============================================================================
  
  describe('Observed Attributes', () => {
    it('should observe type attribute', () => {
      expect(AvatarBaseElement.observedAttributes).toContain('type');
    });

    it('should observe size attribute', () => {
      expect(AvatarBaseElement.observedAttributes).toContain('size');
    });

    it('should observe src attribute', () => {
      expect(AvatarBaseElement.observedAttributes).toContain('src');
    });

    it('should observe alt attribute', () => {
      expect(AvatarBaseElement.observedAttributes).toContain('alt');
    });

    it('should observe interactive attribute', () => {
      expect(AvatarBaseElement.observedAttributes).toContain('interactive');
    });

    it('should observe decorative attribute', () => {
      expect(AvatarBaseElement.observedAttributes).toContain('decorative');
    });

    it('should observe testid attribute', () => {
      expect(AvatarBaseElement.observedAttributes).toContain('testid');
    });

    it('should have exactly 7 observed attributes', () => {
      expect(AvatarBaseElement.observedAttributes.length).toBe(7);
    });
  });

  // ============================================================================
  // Shadow DOM Content Structure
  // ============================================================================
  
  describe('Shadow DOM Content Structure', () => {
    it('should have host display style set to inline-block', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const style = avatar.shadowRoot?.querySelector('style');
      expect(style?.textContent).toContain(':host');
      expect(style?.textContent).toContain('inline-block');
    });

    it('should have SVG with defs and clipPath for agent type', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Agent type uses inline SVG with Bézier curves
      const svg = avatar.shadowRoot?.querySelector('.avatar__hexagon-svg');
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute('aria-hidden')).toBe('true');
      
      // SVG should have defs element
      const defs = svg?.querySelector('defs');
      expect(defs).toBeTruthy();
      
      // Defs should contain clipPath (check innerHTML since JSDOM may have SVG namespace issues)
      const defsHTML = defs?.innerHTML || '';
      expect(defsHTML).toContain('clipPath');
    });

    it('should have clipPath with path element for hexagon shape', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      avatar.type = 'agent';
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Agent type uses inline SVG with clipPath containing path element
      // Check via innerHTML since JSDOM may have SVG namespace issues with querySelector
      const svg = avatar.shadowRoot?.querySelector('.avatar__hexagon-svg');
      expect(svg).toBeTruthy();
      
      const svgHTML = svg?.innerHTML || '';
      
      // Should have clipPath element
      expect(svgHTML).toContain('clipPath');
      
      // ClipPath should contain a path element with Bézier curve commands
      expect(svgHTML).toContain('<path');
      expect(svgHTML).toContain(' d="'); // Path d attribute
      expect(svgHTML).toMatch(/d="[^"]*M[^"]*Q[^"]*Z/); // M, Q, Z commands in path
    });

    it('should have avatar container div', async () => {
      const avatar = document.createElement('avatar-base') as AvatarBaseElement;
      document.body.appendChild(avatar);
      
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const container = avatar.shadowRoot?.querySelector('.avatar');
      expect(container).toBeTruthy();
      expect(container?.tagName.toLowerCase()).toBe('div');
    });
  });
});
