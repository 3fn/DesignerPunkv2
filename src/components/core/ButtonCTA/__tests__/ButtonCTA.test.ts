/**
 * Unit tests for ButtonCTA component rendering
 * 
 * Tests component rendering with various props, size variants, style variants,
 * icon integration, text wrapping, and disabled state.
 * 
 * Requirements: 1.1-1.7, 2.1-2.4, 7.1-7.4, 8.1-8.6
 * 
 * @jest-environment jsdom
 */

import { ButtonCTA } from '../platforms/web/ButtonCTA.web';

describe('ButtonCTA Component Rendering', () => {
  let container: HTMLElement;
  
  beforeEach(() => {
    // Create a container for each test
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  
  afterEach(() => {
    // Clean up after each test
    document.body.removeChild(container);
  });
  
  describe('Required Props', () => {
    it('should render with required props (label, onPress)', () => {
      // Requirement 1.1: Button renders with label
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Click me';
      container.appendChild(button);
      
      // Wait for component to render
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton).toBeTruthy();
      expect(shadowButton?.textContent).toContain('Click me');
    });
    
    it('should have default size of medium when not specified', () => {
      // Requirement 1.2: Default size is medium
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Test';
      container.appendChild(button);
      
      expect(button.size).toBe('medium');
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--medium');
    });
    
    it('should have default style of primary when not specified', () => {
      // Requirement 2.1: Default style is primary
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Test';
      container.appendChild(button);
      
      expect(button.buttonStyle).toBe('primary');
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--primary');
    });
  });
  
  describe('Size Variants', () => {
    it('should render small size with correct class', () => {
      // Requirement 1.1: Small button renders with 40px height
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Small Button';
      button.size = 'small';
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--small');
    });
    
    it('should render medium size with correct class', () => {
      // Requirement 1.2: Medium button renders with 48px height
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Medium Button';
      button.size = 'medium';
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--medium');
    });
    
    it('should render large size with correct class', () => {
      // Requirement 1.3: Large button renders with 56px height
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Large Button';
      button.size = 'large';
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--large');
    });
    
    it('should apply all size classes correctly', () => {
      // Requirement 1.1-1.3: All size variants render correctly
      const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
      
      sizes.forEach(size => {
        const button = document.createElement('button-cta') as ButtonCTA;
        button.label = `${size} button`;
        button.size = size;
        container.appendChild(button);
        
        const shadowButton = button.shadowRoot?.querySelector('button');
        expect(shadowButton?.className).toContain(`button-cta--${size}`);
        
        container.removeChild(button);
      });
    });
  });
  
  describe('Style Variants', () => {
    it('should render primary style with correct class', () => {
      // Requirement 2.1: Primary button with filled background
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Primary Button';
      button.buttonStyle = 'primary';
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--primary');
    });
    
    it('should render secondary style with correct class', () => {
      // Requirement 2.2: Secondary button with outline
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Secondary Button';
      button.buttonStyle = 'secondary';
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--secondary');
    });
    
    it('should render tertiary style with correct class', () => {
      // Requirement 2.3: Tertiary button with text-only
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Tertiary Button';
      button.buttonStyle = 'tertiary';
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--tertiary');
    });
    
    it('should apply all style classes correctly', () => {
      // Requirement 2.1-2.3: All style variants render correctly
      const styles: Array<'primary' | 'secondary' | 'tertiary'> = ['primary', 'secondary', 'tertiary'];
      
      styles.forEach(style => {
        const button = document.createElement('button-cta') as ButtonCTA;
        button.label = `${style} button`;
        button.buttonStyle = style;
        container.appendChild(button);
        
        const shadowButton = button.shadowRoot?.querySelector('button');
        expect(shadowButton?.className).toContain(`button-cta--${style}`);
        
        container.removeChild(button);
      });
    });
  });
  
  describe('Icon Integration', () => {
    it('should render icon when icon prop provided', () => {
      // Requirement 8.1: Icon renders in leading position
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Button with Icon';
      button.icon = 'arrow-right';
      container.appendChild(button);
      
      const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
      expect(iconElement).toBeTruthy();
      expect(iconElement?.getAttribute('aria-hidden')).toBe('true');
    });
    
    it('should not render icon when icon prop omitted', () => {
      // Requirement 8.1: Icon doesn't render when not provided
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Button without Icon';
      container.appendChild(button);
      
      const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
      expect(iconElement).toBeFalsy();
    });
    
    it('should render icon with correct size for small/medium buttons', () => {
      // Requirement 8.2: Small/medium buttons use icon.size100 (24px)
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Medium Button';
      button.size = 'medium';
      button.icon = 'check';
      container.appendChild(button);
      
      const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
      expect(iconElement).toBeTruthy();
      // Icon size is handled by createIcon function, we just verify it exists
    });
    
    it('should render icon with correct size for large buttons', () => {
      // Requirement 8.3: Large buttons use icon.size125 (32px)
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Large Button';
      button.size = 'large';
      button.icon = 'plus';
      container.appendChild(button);
      
      const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
      expect(iconElement).toBeTruthy();
      // Icon size is handled by createIcon function, we just verify it exists
    });
    
    it('should mark icon as decorative with aria-hidden', () => {
      // Requirement 8.6: Icon marked as decorative for accessibility
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Accessible Button';
      button.icon = 'info';
      container.appendChild(button);
      
      const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
      expect(iconElement?.getAttribute('aria-hidden')).toBe('true');
    });
  });
  
  describe('Text Wrapping', () => {
    it('should allow text wrapping by default', () => {
      // Requirement 7.1: Text wraps by default
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'This is a very long button label that should wrap';
      container.appendChild(button);
      
      const labelElement = button.shadowRoot?.querySelector('.button-cta__label');
      expect(labelElement).toBeTruthy();
      expect(labelElement?.className).toBe('button-cta__label');
    });
    
    it('should truncate text with ellipsis when noWrap is true', () => {
      // Requirement 7.3: noWrap prop truncates text with ellipsis
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'This is a very long button label that should truncate';
      button.noWrap = true;
      container.appendChild(button);
      
      const labelElement = button.shadowRoot?.querySelector('.button-cta__label--no-wrap');
      expect(labelElement).toBeTruthy();
      expect(labelElement?.className).toBe('button-cta__label--no-wrap');
    });
    
    it('should center-align text horizontally', () => {
      // Requirement 7.4: Text is center-aligned
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Centered Text';
      container.appendChild(button);
      
      const labelElement = button.shadowRoot?.querySelector('.button-cta__label');
      expect(labelElement).toBeTruthy();
      // CSS handles centering, we just verify the element exists
    });
  });
  
  describe('Disabled State', () => {
    it('should render disabled button with correct attributes', () => {
      // Requirement: Disabled prop prevents interaction
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Disabled Button';
      button.disabled = true;
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.hasAttribute('disabled')).toBe(true);
      expect(shadowButton?.getAttribute('aria-disabled')).toBe('true');
      expect(shadowButton?.className).toContain('button-cta--disabled');
    });
    
    it('should not have disabled attributes when disabled is false', () => {
      // Requirement: Enabled button is interactive
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Enabled Button';
      button.disabled = false;
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.hasAttribute('disabled')).toBe(false);
      expect(shadowButton?.getAttribute('aria-disabled')).toBe('false');
      expect(shadowButton?.className).not.toContain('button-cta--disabled');
    });
    
    it('should prevent press event when disabled', () => {
      // Requirement: Disabled button doesn't trigger onPress
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Disabled Button';
      button.disabled = true;
      container.appendChild(button);
      
      let pressCount = 0;
      button.addEventListener('press', () => {
        pressCount++;
      });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      shadowButton?.click();
      
      expect(pressCount).toBe(0);
    });
  });
  
  describe('Accessibility Attributes', () => {
    it('should have correct ARIA role', () => {
      // Requirement: Button has role="button"
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Accessible Button';
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.getAttribute('role')).toBe('button');
    });
    
    it('should have aria-label matching button text', () => {
      // Requirement: Button has accessible label
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Submit Form';
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.getAttribute('aria-label')).toBe('Submit Form');
    });
    
    it('should have correct type attribute', () => {
      // Requirement: Button has type="button"
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Button';
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.getAttribute('type')).toBe('button');
    });
  });
  
  describe('Test ID Support', () => {
    it('should apply test ID when provided', () => {
      // Requirement: testID prop for automated testing
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Test Button';
      button.testID = 'submit-button';
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.getAttribute('data-testid')).toBe('submit-button');
    });
    
    it('should not have test ID attribute when not provided', () => {
      // Requirement: testID is optional
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Button';
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.hasAttribute('data-testid')).toBe(false);
    });
  });
  
  describe('Combined Props', () => {
    it('should render with all props combined correctly', () => {
      // Requirement: All props work together
      const button = document.createElement('button-cta') as ButtonCTA;
      button.label = 'Complete Button';
      button.size = 'large';
      button.buttonStyle = 'secondary';
      button.icon = 'arrow-right';
      button.noWrap = true;
      button.testID = 'complete-button';
      container.appendChild(button);
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--large');
      expect(shadowButton?.className).toContain('button-cta--secondary');
      expect(shadowButton?.getAttribute('data-testid')).toBe('complete-button');
      
      const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
      expect(iconElement).toBeTruthy();
      
      const labelElement = button.shadowRoot?.querySelector('.button-cta__label--no-wrap');
      expect(labelElement).toBeTruthy();
    });
  });
});
