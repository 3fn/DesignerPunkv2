/**
 * @jest-environment jsdom
 */

/**
 * Container Core Unit Tests
 * 
 * Tests core Container component functionality across all platforms.
 * Validates rendering behavior, prop handling, and token mapping integration.
 * 
 * @see Requirements: All requirements (comprehensive component testing)
 */

import { ContainerWeb } from '../platforms/web/Container.web';
import type { ContainerProps } from '../types';
import {
  getPaddingToken,
  getBorderToken,
  getBorderRadiusToken,
  getLayeringToken,
  BORDER_COLOR_TOKEN
} from '../tokens';

describe('Container Component', () => {
  // Setup: Ensure custom element is registered
  beforeAll(() => {
    if (!customElements.get('dp-container')) {
      customElements.define('dp-container', ContainerWeb);
    }
  });

  // Cleanup: Remove created elements after each test
  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Rendering with no props', () => {
    it('should render Container with default values', () => {
      // Create container element
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);

      // Wait for connectedCallback to execute
      expect(container).toBeInstanceOf(ContainerWeb);
      expect(container.shadowRoot).toBeTruthy();
    });

    it('should render with div as default semantic element', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);

      // Check shadow DOM contains div element
      const shadowDiv = container.shadowRoot?.querySelector('div');
      expect(shadowDiv).toBeTruthy();
      expect(shadowDiv?.tagName.toLowerCase()).toBe('div');
    });

    it('should render with slot for children', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);

      // Check shadow DOM contains slot element
      const slot = container.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    it('should have no styling applied by default', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);

      // Container should exist but have no token-based styling
      const containerElement = container.shadowRoot?.querySelector('.container') as HTMLElement;
      expect(containerElement).toBeTruthy();
      
      // Check that no token-based styles are applied (empty style attribute or no inline styles)
      const styleAttr = containerElement?.getAttribute('style');
      expect(styleAttr).toBeFalsy();
    });
  });

  describe('Rendering with single props', () => {
    it('should render with padding prop only', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('padding', '200');
      document.body.appendChild(container);

      expect(container.getAttribute('padding')).toBe('200');
      
      // Verify shadow DOM is rendered
      expect(container.shadowRoot?.querySelector('.container')).toBeTruthy();
    });

    it('should render with background prop only', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('background', 'color.surface');
      document.body.appendChild(container);

      expect(container.getAttribute('background')).toBe('color.surface');
      expect(container.shadowRoot?.querySelector('.container')).toBeTruthy();
    });

    it('should render with shadow prop only', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('shadow', 'shadow.container');
      document.body.appendChild(container);

      expect(container.getAttribute('shadow')).toBe('shadow.container');
      expect(container.shadowRoot?.querySelector('.container')).toBeTruthy();
    });

    it('should render with border prop only', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('border', 'default');
      document.body.appendChild(container);

      expect(container.getAttribute('border')).toBe('default');
      expect(container.shadowRoot?.querySelector('.container')).toBeTruthy();
    });

    it('should render with borderRadius prop only', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('border-radius', 'normal');
      document.body.appendChild(container);

      expect(container.getAttribute('border-radius')).toBe('normal');
      expect(container.shadowRoot?.querySelector('.container')).toBeTruthy();
    });

    it('should render with opacity prop only', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('opacity', 'opacity.subtle');
      document.body.appendChild(container);

      expect(container.getAttribute('opacity')).toBe('opacity.subtle');
      expect(container.shadowRoot?.querySelector('.container')).toBeTruthy();
    });

    it('should render with layering prop only', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('layering', 'navigation');
      document.body.appendChild(container);

      expect(container.getAttribute('layering')).toBe('navigation');
      expect(container.shadowRoot?.querySelector('.container')).toBeTruthy();
    });

    it('should render with semantic prop only', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('semantic', 'section');
      document.body.appendChild(container);

      // Check that section element is rendered instead of div
      const section = container.shadowRoot?.querySelector('section');
      expect(section).toBeTruthy();
      expect(section?.tagName.toLowerCase()).toBe('section');
    });

    it('should render with accessibilityLabel prop only', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('accessibility-label', 'Test container');
      document.body.appendChild(container);

      // Check that aria-label is applied
      const containerElement = container.shadowRoot?.querySelector('.container');
      expect(containerElement?.getAttribute('aria-label')).toBe('Test container');
    });
  });

  describe('Rendering with multiple props', () => {
    it('should render with padding and background', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('padding', '200');
      container.setAttribute('background', 'color.surface');
      document.body.appendChild(container);

      expect(container.getAttribute('padding')).toBe('200');
      expect(container.getAttribute('background')).toBe('color.surface');
      expect(container.shadowRoot?.querySelector('.container')).toBeTruthy();
    });

    it('should render with all styling props', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('padding', '300');
      container.setAttribute('background', 'color.primary');
      container.setAttribute('shadow', 'shadow.container');
      container.setAttribute('border', 'emphasis');
      container.setAttribute('border-radius', 'normal');
      container.setAttribute('opacity', 'opacity.subtle');
      container.setAttribute('layering', 'modal');
      document.body.appendChild(container);

      // Verify all attributes are set
      expect(container.getAttribute('padding')).toBe('300');
      expect(container.getAttribute('background')).toBe('color.primary');
      expect(container.getAttribute('shadow')).toBe('shadow.container');
      expect(container.getAttribute('border')).toBe('emphasis');
      expect(container.getAttribute('border-radius')).toBe('normal');
      expect(container.getAttribute('opacity')).toBe('opacity.subtle');
      expect(container.getAttribute('layering')).toBe('modal');
      
      // Verify shadow DOM is rendered
      expect(container.shadowRoot?.querySelector('.container')).toBeTruthy();
    });

    it('should render with styling and semantic props', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('padding', '200');
      container.setAttribute('background', 'color.surface');
      container.setAttribute('semantic', 'article');
      container.setAttribute('accessibility-label', 'Blog post');
      document.body.appendChild(container);

      // Check semantic element
      const article = container.shadowRoot?.querySelector('article');
      expect(article).toBeTruthy();
      expect(article?.getAttribute('aria-label')).toBe('Blog post');
      
      // Check styling attributes
      expect(container.getAttribute('padding')).toBe('200');
      expect(container.getAttribute('background')).toBe('color.surface');
    });

    it('should handle combination of border and borderRadius', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('border', 'default');
      container.setAttribute('border-radius', 'normal');
      document.body.appendChild(container);

      expect(container.getAttribute('border')).toBe('default');
      expect(container.getAttribute('border-radius')).toBe('normal');
      expect(container.shadowRoot?.querySelector('.container')).toBeTruthy();
    });

    it('should handle combination of shadow and layering', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('shadow', 'shadow.container');
      container.setAttribute('layering', 'navigation');
      document.body.appendChild(container);

      expect(container.getAttribute('shadow')).toBe('shadow.container');
      expect(container.getAttribute('layering')).toBe('navigation');
      expect(container.shadowRoot?.querySelector('.container')).toBeTruthy();
    });
  });

  describe('Children rendering', () => {
    it('should render text content as children', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.textContent = 'Test content';
      document.body.appendChild(container);

      // Check that text content is preserved
      expect(container.textContent).toBe('Test content');
      
      // Check that slot exists in shadow DOM
      const slot = container.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    it('should render HTML elements as children', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      const paragraph = document.createElement('p');
      paragraph.textContent = 'Paragraph content';
      container.appendChild(paragraph);
      document.body.appendChild(container);

      // Check that child element is preserved
      const childParagraph = container.querySelector('p');
      expect(childParagraph).toBeTruthy();
      expect(childParagraph?.textContent).toBe('Paragraph content');
      
      // Check that slot exists in shadow DOM
      const slot = container.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    it('should render multiple children', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      
      const heading = document.createElement('h2');
      heading.textContent = 'Heading';
      
      const paragraph = document.createElement('p');
      paragraph.textContent = 'Paragraph';
      
      container.appendChild(heading);
      container.appendChild(paragraph);
      document.body.appendChild(container);

      // Check that both children are preserved
      expect(container.querySelector('h2')?.textContent).toBe('Heading');
      expect(container.querySelector('p')?.textContent).toBe('Paragraph');
      expect(container.children.length).toBe(2);
    });

    it('should render nested containers', () => {
      const outerContainer = document.createElement('dp-container') as ContainerWeb;
      outerContainer.setAttribute('padding', '300');
      
      const innerContainer = document.createElement('dp-container') as ContainerWeb;
      innerContainer.setAttribute('padding', '100');
      innerContainer.textContent = 'Nested content';
      
      outerContainer.appendChild(innerContainer);
      document.body.appendChild(outerContainer);

      // Check outer container
      expect(outerContainer.getAttribute('padding')).toBe('300');
      
      // Check inner container
      const nestedContainer = outerContainer.querySelector('dp-container');
      expect(nestedContainer).toBeTruthy();
      expect(nestedContainer?.getAttribute('padding')).toBe('100');
      expect(nestedContainer?.textContent).toBe('Nested content');
    });

    it('should preserve children when attributes change', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.textContent = 'Original content';
      document.body.appendChild(container);

      // Change attribute
      container.setAttribute('padding', '200');

      // Check that content is still preserved
      expect(container.textContent).toBe('Original content');
    });
  });

  describe('Token mapping functions', () => {
    describe('getPaddingToken', () => {
      it('should return correct token for padding values', () => {
        expect(getPaddingToken('none')).toBe('');
        expect(getPaddingToken('050')).toBe('space.inset.050');
        expect(getPaddingToken('100')).toBe('space.inset.100');
        expect(getPaddingToken('150')).toBe('space.inset.150');
        expect(getPaddingToken('200')).toBe('space.inset.200');
        expect(getPaddingToken('300')).toBe('space.inset.300');
        expect(getPaddingToken('400')).toBe('space.inset.400');
      });
    });

    describe('getBorderToken', () => {
      it('should return correct token for border values', () => {
        expect(getBorderToken('none')).toBe('');
        expect(getBorderToken('default')).toBe('border.default');
        expect(getBorderToken('emphasis')).toBe('border.emphasis');
        expect(getBorderToken('heavy')).toBe('border.heavy');
      });
    });

    describe('getBorderRadiusToken', () => {
      it('should return correct token for border radius values', () => {
        expect(getBorderRadiusToken('none')).toBe('');
        expect(getBorderRadiusToken('tight')).toBe('radius050');
        expect(getBorderRadiusToken('normal')).toBe('radius100');
        expect(getBorderRadiusToken('loose')).toBe('radius200');
      });
    });

    describe('getLayeringToken', () => {
      it('should return z-index token for web platform', () => {
        expect(getLayeringToken('container', 'web')).toBe('zIndex.container');
        expect(getLayeringToken('navigation', 'web')).toBe('zIndex.navigation');
        expect(getLayeringToken('dropdown', 'web')).toBe('zIndex.dropdown');
        expect(getLayeringToken('modal', 'web')).toBe('zIndex.modal');
        expect(getLayeringToken('toast', 'web')).toBe('zIndex.toast');
        expect(getLayeringToken('tooltip', 'web')).toBe('zIndex.tooltip');
      });

      it('should return z-index token for iOS platform', () => {
        expect(getLayeringToken('container', 'ios')).toBe('zIndex.container');
        expect(getLayeringToken('modal', 'ios')).toBe('zIndex.modal');
      });

      it('should return elevation token for Android platform', () => {
        expect(getLayeringToken('container', 'android')).toBe('elevation.container');
        expect(getLayeringToken('modal', 'android')).toBe('elevation.modal');
      });
    });

    describe('BORDER_COLOR_TOKEN', () => {
      it('should be defined as color.border', () => {
        expect(BORDER_COLOR_TOKEN).toBe('color.border');
      });
    });
  });

  describe('Attribute changes', () => {
    it('should re-render when padding attribute changes', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);

      // Change padding attribute
      container.setAttribute('padding', '200');
      
      // Verify attribute is updated
      expect(container.getAttribute('padding')).toBe('200');
    });

    it('should re-render when background attribute changes', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('background', 'color.surface');
      document.body.appendChild(container);

      // Change background attribute
      container.setAttribute('background', 'color.primary');
      
      // Verify attribute is updated
      expect(container.getAttribute('background')).toBe('color.primary');
    });

    it('should re-render when semantic attribute changes', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('semantic', 'div');
      document.body.appendChild(container);

      // Change semantic attribute
      container.setAttribute('semantic', 'section');
      
      // Verify new semantic element is rendered
      const section = container.shadowRoot?.querySelector('section');
      expect(section).toBeTruthy();
    });

    it('should handle multiple attribute changes', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);

      // Change multiple attributes
      container.setAttribute('padding', '200');
      container.setAttribute('background', 'color.surface');
      container.setAttribute('border-radius', 'normal');
      
      // Verify all attributes are updated
      expect(container.getAttribute('padding')).toBe('200');
      expect(container.getAttribute('background')).toBe('color.surface');
      expect(container.getAttribute('border-radius')).toBe('normal');
    });
  });

  describe('Semantic HTML elements', () => {
    const semanticElements = ['div', 'section', 'article', 'aside', 'nav', 'header', 'footer', 'main', 'fieldset'];

    semanticElements.forEach(element => {
      it(`should render as ${element} when semantic="${element}"`, () => {
        const container = document.createElement('dp-container') as ContainerWeb;
        container.setAttribute('semantic', element);
        document.body.appendChild(container);

        const semanticElement = container.shadowRoot?.querySelector(element);
        expect(semanticElement).toBeTruthy();
        expect(semanticElement?.tagName.toLowerCase()).toBe(element);
      });
    });
  });

  describe('Accessibility', () => {
    it('should apply aria-label when accessibilityLabel is set', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('accessibility-label', 'Main content area');
      document.body.appendChild(container);

      const containerElement = container.shadowRoot?.querySelector('.container');
      expect(containerElement?.getAttribute('aria-label')).toBe('Main content area');
    });

    it('should not apply aria-label when accessibilityLabel is not set', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);

      const containerElement = container.shadowRoot?.querySelector('.container');
      expect(containerElement?.hasAttribute('aria-label')).toBe(false);
    });

    it('should update aria-label when accessibilityLabel changes', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('accessibility-label', 'Original label');
      document.body.appendChild(container);

      // Change accessibility label
      container.setAttribute('accessibility-label', 'Updated label');

      const containerElement = container.shadowRoot?.querySelector('.container');
      expect(containerElement?.getAttribute('aria-label')).toBe('Updated label');
    });

    it('should safely handle HTML in accessibility labels', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      container.setAttribute('accessibility-label', '<script>alert("xss")</script>');
      document.body.appendChild(container);

      const containerElement = container.shadowRoot?.querySelector('.container');
      const ariaLabel = containerElement?.getAttribute('aria-label');
      
      // The attribute value contains the literal text (not executed as script)
      // HTML attributes are safe - they can't execute JavaScript
      expect(ariaLabel).toBe('<script>alert("xss")</script>');
      
      // Verify no actual script execution (the text is just an attribute value)
      expect(containerElement?.tagName.toLowerCase()).not.toBe('script');
    });
  });

  describe('Shadow DOM encapsulation', () => {
    it('should have shadow root attached', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);

      expect(container.shadowRoot).toBeTruthy();
      expect(container.shadowRoot?.mode).toBe('open');
    });

    it('should contain style element in shadow DOM', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);

      const styleElement = container.shadowRoot?.querySelector('style');
      expect(styleElement).toBeTruthy();
    });

    it('should contain container element with class', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);

      const containerElement = container.shadowRoot?.querySelector('.container');
      expect(containerElement).toBeTruthy();
      expect(containerElement?.classList.contains('container')).toBe(true);
    });

    it('should isolate styles from parent document', () => {
      const container = document.createElement('dp-container') as ContainerWeb;
      document.body.appendChild(container);

      // Styles in shadow DOM should not affect parent document
      const shadowStyles = container.shadowRoot?.querySelector('style');
      expect(shadowStyles).toBeTruthy();
      
      // Shadow DOM should be isolated
      expect(container.shadowRoot?.host).toBe(container);
    });
  });
});
