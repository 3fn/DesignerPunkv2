/**
 * @jest-environment jsdom
 */

/**
 * @category evergreen
 * @purpose Verify Container.web component renders correctly and behaves as expected
 */

/**
 * Container Web Component Tests
 * 
 * Tests for the web platform implementation of Container component.
 * Verifies Shadow DOM attachment, attribute handling, and rendering.
 */

import { ContainerWeb } from '../Container.web';

describe('ContainerWeb', () => {
  beforeAll(() => {
    // Ensure custom element is defined
    if (!customElements.get('dp-container')) {
      customElements.define('dp-container', ContainerWeb);
    }
  });

  afterEach(() => {
    // Clean up any created elements
    document.body.innerHTML = '';
  });

  describe('Shadow DOM', () => {
    it('should attach Shadow DOM in open mode', () => {
      const container = new ContainerWeb();
      expect(container.shadowRoot).toBeTruthy();
      expect(container.shadowRoot?.mode).toBe('open');
    });

    it('should render slot for child content', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);
      
      const slot = container.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });
  });

  describe('Observed Attributes', () => {
    it('should define observed attributes', () => {
      const observedAttrs = ContainerWeb.observedAttributes;
      
      expect(observedAttrs).toContain('padding');
      expect(observedAttrs).toContain('background');
      expect(observedAttrs).toContain('shadow');
      expect(observedAttrs).toContain('border');
      expect(observedAttrs).toContain('border-radius');
      expect(observedAttrs).toContain('opacity');
      expect(observedAttrs).toContain('layering');
      expect(observedAttrs).toContain('semantic');
      expect(observedAttrs).toContain('accessibility-label');
    });
  });

  describe('Semantic HTML Elements', () => {
    it('should render as div by default', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);
      
      const innerElement = container.shadowRoot?.querySelector('.container');
      expect(innerElement?.tagName.toLowerCase()).toBe('div');
    });

    it('should render as section when semantic="section"', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('semantic', 'section');
      document.body.appendChild(container);
      
      const innerElement = container.shadowRoot?.querySelector('.container');
      expect(innerElement?.tagName.toLowerCase()).toBe('section');
    });

    it('should render as article when semantic="article"', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('semantic', 'article');
      document.body.appendChild(container);
      
      const innerElement = container.shadowRoot?.querySelector('.container');
      expect(innerElement?.tagName.toLowerCase()).toBe('article');
    });

    it('should render as aside when semantic="aside"', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('semantic', 'aside');
      document.body.appendChild(container);
      
      const innerElement = container.shadowRoot?.querySelector('.container');
      expect(innerElement?.tagName.toLowerCase()).toBe('aside');
    });

    it('should render as nav when semantic="nav"', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('semantic', 'nav');
      document.body.appendChild(container);
      
      const innerElement = container.shadowRoot?.querySelector('.container');
      expect(innerElement?.tagName.toLowerCase()).toBe('nav');
    });

    it('should render as header when semantic="header"', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('semantic', 'header');
      document.body.appendChild(container);
      
      const innerElement = container.shadowRoot?.querySelector('.container');
      expect(innerElement?.tagName.toLowerCase()).toBe('header');
    });

    it('should render as footer when semantic="footer"', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('semantic', 'footer');
      document.body.appendChild(container);
      
      const innerElement = container.shadowRoot?.querySelector('.container');
      expect(innerElement?.tagName.toLowerCase()).toBe('footer');
    });

    it('should render as main when semantic="main"', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('semantic', 'main');
      document.body.appendChild(container);
      
      const innerElement = container.shadowRoot?.querySelector('.container');
      expect(innerElement?.tagName.toLowerCase()).toBe('main');
    });

    it('should render as fieldset when semantic="fieldset"', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('semantic', 'fieldset');
      document.body.appendChild(container);
      
      const innerElement = container.shadowRoot?.querySelector('.container');
      expect(innerElement?.tagName.toLowerCase()).toBe('fieldset');
    });
  });

  describe('Accessibility', () => {
    it('should apply aria-label when accessibility-label is set', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('accessibility-label', 'Test container');
      document.body.appendChild(container);
      
      const innerElement = container.shadowRoot?.querySelector('.container');
      expect(innerElement?.getAttribute('aria-label')).toBe('Test container');
    });

    it('should not apply aria-label when accessibility-label is not set', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);
      
      const innerElement = container.shadowRoot?.querySelector('.container');
      expect(innerElement?.hasAttribute('aria-label')).toBe(false);
    });

    it('should safely handle HTML in accessibility labels', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('accessibility-label', '<script>alert("xss")</script>');
      document.body.appendChild(container);
      
      const innerElement = container.shadowRoot?.querySelector('.container');
      const ariaLabel = innerElement?.getAttribute('aria-label');
      
      // The attribute value contains the literal text (not executed as script)
      // HTML attributes are safe - they can't execute JavaScript
      expect(ariaLabel).toBe('<script>alert("xss")</script>');
      
      // Verify no actual script execution (the text is just an attribute value)
      expect(innerElement?.tagName.toLowerCase()).not.toBe('script');
    });
  });

  describe('Styling', () => {
    it('should apply padding styles when padding attribute is set', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('padding', '200');
      document.body.appendChild(container);
      
      const style = container.shadowRoot?.querySelector('style');
      expect(style?.textContent).toContain('padding: var(--space-inset-200)');
    });

    it('should not apply padding when padding="none"', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('padding', 'none');
      document.body.appendChild(container);
      
      const style = container.shadowRoot?.querySelector('style');
      expect(style?.textContent).not.toContain('padding:');
    });

    it('should apply background styles when background attribute is set', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('background', 'color.surface');
      document.body.appendChild(container);
      
      const style = container.shadowRoot?.querySelector('style');
      expect(style?.textContent).toContain('background: var(--color-surface)');
    });

    it('should apply shadow styles when shadow attribute is set', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('shadow', 'shadow.container');
      document.body.appendChild(container);
      
      const style = container.shadowRoot?.querySelector('style');
      expect(style?.textContent).toContain('box-shadow: var(--shadow-container)');
    });

    it('should apply border styles when border attribute is set', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('border', 'default');
      document.body.appendChild(container);
      
      const style = container.shadowRoot?.querySelector('style');
      expect(style?.textContent).toContain('border: var(--border-default) solid var(--color-border)');
    });

    it('should apply border-radius styles when border-radius attribute is set', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('border-radius', 'normal');
      document.body.appendChild(container);
      
      const style = container.shadowRoot?.querySelector('style');
      expect(style?.textContent).toContain('border-radius: var(--radius100)');
    });

    it('should apply opacity styles when opacity attribute is set', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('opacity', 'opacity.subtle');
      document.body.appendChild(container);
      
      const style = container.shadowRoot?.querySelector('style');
      expect(style?.textContent).toContain('opacity: var(--opacity-subtle)');
    });

    it('should apply z-index styles when layering attribute is set', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('layering', 'modal');
      document.body.appendChild(container);
      
      const style = container.shadowRoot?.querySelector('style');
      expect(style?.textContent).toContain('z-index: var(--zIndex-modal)');
    });
  });

  describe('Lifecycle', () => {
    it('should render on connectedCallback', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      
      // Before connecting, shadowRoot should be empty or have minimal content
      const beforeContent = container.shadowRoot?.innerHTML;
      
      // Connect to DOM
      document.body.appendChild(container);
      
      // After connecting, should have rendered content
      const afterContent = container.shadowRoot?.innerHTML;
      expect(afterContent).toBeTruthy();
      expect(afterContent).toContain('slot');
    });

    it('should re-render when observed attributes change', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);
      
      // Initial state - no padding
      let style = container.shadowRoot?.querySelector('style');
      expect(style?.textContent).not.toContain('padding:');
      
      // Change padding attribute
      container.setAttribute('padding', '200');
      
      // Should re-render with padding
      style = container.shadowRoot?.querySelector('style');
      expect(style?.textContent).toContain('padding: var(--space-inset-200)');
    });
  });

  describe('Custom Element Registration', () => {
    it('should be registered as dp-container', () => {
      const registeredClass = customElements.get('dp-container');
      expect(registeredClass).toBe(ContainerWeb);
    });

    it('should be creatable via document.createElement', () => {
      const container = document.createElement('dp-container');
      expect(container).toBeInstanceOf(ContainerWeb);
      expect(container.tagName.toLowerCase()).toBe('dp-container');
    });
  });
});
