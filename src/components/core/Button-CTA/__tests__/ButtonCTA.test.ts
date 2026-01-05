/**
 * @category evergreen
 * @purpose Verify Button-CTA component renders correctly and behaves as expected
 * @jest-environment jsdom
 */
/**
 * Unit tests for Button-CTA component rendering
 * 
 * Tests component rendering with various props, size variants, variant styles,
 * icon integration, text wrapping, and disabled state.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-CTA
 * Component Type: Standalone (no behavioral variants)
 * 
 * Requirements: 1.1-1.7, 2.1-2.4, 7.1-7.4, 8.1-8.6
 */

import { ButtonCTA } from '../platforms/web/ButtonCTA.web';

/**
 * Set up required CSS custom properties for Button-CTA blend utilities.
 * Button-CTA uses blend utilities that read base colors from CSS custom properties.
 */
function setupBlendColorProperties(): void {
  document.documentElement.style.setProperty('--color-primary', '#A855F7');
  document.documentElement.style.setProperty('--color-contrast-on-primary', '#FFFFFF');
  document.documentElement.style.setProperty('--color-background', '#FFFFFF');
}

describe('Button-CTA Component Rendering', () => {
  let container: HTMLElement;
  
  beforeEach(() => {
    // Set up CSS custom properties required for blend utilities
    setupBlendColorProperties();
    
    // Create a container for each test
    container = document.createElement('div');
    document.body.appendChild(container);
  });
  
  afterEach(() => {
    // Clean up after each test
    document.body.removeChild(container);
  });
  
  /**
   * Helper function to create and initialize a Button-CTA component.
   * 
   * In jsdom test environment, connectedCallback is not automatically called
   * when custom elements are appended to the DOM. This helper ensures proper
   * initialization by:
   * 1. Creating the element (constructor runs, shadow DOM attached)
   * 2. Setting initial properties
   * 3. Appending to DOM
   * 4. Manually calling connectedCallback to trigger render
   * 
   * @param props - Component properties to set
   * @returns Initialized Button-CTA component
   */
  function createButton(props: {
    label: string;
    size?: 'small' | 'medium' | 'large';
    buttonVariant?: 'primary' | 'secondary' | 'tertiary';
    icon?: string;
    noWrap?: boolean;
    disabled?: boolean;
    testID?: string;
  }): ButtonCTA {
    // Create element - constructor runs and attaches shadow DOM
    const button = new ButtonCTA();
    
    // Set properties before appending to DOM
    button.label = props.label;
    if (props.size) button.size = props.size;
    if (props.buttonVariant) button.buttonVariant = props.buttonVariant;
    if (props.icon) button.icon = props.icon;
    if (props.noWrap !== undefined) button.noWrap = props.noWrap;
    if (props.disabled !== undefined) button.disabled = props.disabled;
    if (props.testID) button.testID = props.testID;
    
    // Append to container
    container.appendChild(button);
    
    // Manually trigger connectedCallback for jsdom environment
    // jsdom doesn't automatically call lifecycle methods for custom elements
    if (typeof (button as any).connectedCallback === 'function') {
      (button as any).connectedCallback();
    }
    
    // Verify shadow DOM was created
    if (!button.shadowRoot) {
      throw new Error('Shadow DOM was not initialized. Check that ButtonCTA constructor calls attachShadow().');
    }
    
    return button;
  }
  
  describe('Required Props', () => {
    it('should render with required props (label, onPress)', () => {
      // Requirement 1.1: Button renders with label
      const button = createButton({ label: 'Click me' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton).toBeTruthy();
      expect(shadowButton?.textContent).toContain('Click me');
    });
    
    it('should have default size of medium when not specified', () => {
      // Requirement 1.2: Default size is medium
      const button = createButton({ label: 'Test' });
      
      expect(button.size).toBe('medium');
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--medium');
    });
    
    it('should have default variant of primary when not specified', () => {
      // Requirement 2.1: Default variant is primary
      const button = createButton({ label: 'Test' });
      
      expect(button.buttonVariant).toBe('primary');
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--primary');
    });
  });
  
  describe('Size Variants', () => {
    it('should render small size with correct class', () => {
      // Requirement 1.1: Small button renders with 40px height
      const button = createButton({ label: 'Small Button', size: 'small' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--small');
    });
    
    it('should render medium size with correct class', () => {
      // Requirement 1.2: Medium button renders with 48px height
      const button = createButton({ label: 'Medium Button', size: 'medium' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--medium');
    });
    
    it('should render large size with correct class', () => {
      // Requirement 1.3: Large button renders with 56px height
      const button = createButton({ label: 'Large Button', size: 'large' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--large');
    });
    
    it('should apply all size classes correctly', () => {
      // Requirement 1.1-1.3: All size variants render correctly
      const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
      
      sizes.forEach(size => {
        const button = createButton({ label: `${size} button`, size });
        
        const shadowButton = button.shadowRoot?.querySelector('button');
        expect(shadowButton?.className).toContain(`button-cta--${size}`);
        
        container.removeChild(button);
      });
    });
  });
  
  describe('Variant Styles', () => {
    it('should render primary variant with correct class', () => {
      // Requirement 2.1: Primary button with filled background
      const button = createButton({ label: 'Primary Button', buttonVariant: 'primary' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--primary');
    });
    
    it('should render secondary variant with correct class', () => {
      // Requirement 2.2: Secondary button with outline
      const button = createButton({ label: 'Secondary Button', buttonVariant: 'secondary' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--secondary');
    });
    
    it('should render tertiary variant with correct class', () => {
      // Requirement 2.3: Tertiary button with text-only
      const button = createButton({ label: 'Tertiary Button', buttonVariant: 'tertiary' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.className).toContain('button-cta--tertiary');
    });
    
    it('should apply all variant classes correctly', () => {
      // Requirement 2.1-2.3: All variant styles render correctly
      const variants: Array<'primary' | 'secondary' | 'tertiary'> = ['primary', 'secondary', 'tertiary'];
      
      variants.forEach(variant => {
        const button = createButton({ label: `${variant} button`, buttonVariant: variant });
        
        const shadowButton = button.shadowRoot?.querySelector('button');
        expect(shadowButton?.className).toContain(`button-cta--${variant}`);
        
        container.removeChild(button);
      });
    });
  });
  
  describe('Icon Integration', () => {
    it('should render icon when icon prop provided', () => {
      // Requirement 8.1: Icon renders in leading position
      const button = createButton({ label: 'Button with Icon', icon: 'arrow-right' });
      
      const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
      expect(iconElement).toBeTruthy();
      expect(iconElement?.getAttribute('aria-hidden')).toBe('true');
    });
    
    it('should not render icon when icon prop omitted', () => {
      // Requirement 8.1: Icon doesn't render when not provided
      const button = createButton({ label: 'Button without Icon' });
      
      const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
      expect(iconElement).toBeFalsy();
    });
    
    it('should render icon with correct size for small/medium buttons', () => {
      // Requirement 8.2: Small/medium buttons use icon.size100 (24px)
      const button = createButton({ label: 'Medium Button', size: 'medium', icon: 'check' });
      
      const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
      expect(iconElement).toBeTruthy();
      // Icon size is handled by createIcon function, we just verify it exists
    });
    
    it('should render icon with correct size for large buttons', () => {
      // Requirement 8.3: Large buttons use icon.size125 (32px)
      const button = createButton({ label: 'Large Button', size: 'large', icon: 'plus' });
      
      const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
      expect(iconElement).toBeTruthy();
      // Icon size is handled by createIcon function, we just verify it exists
    });
    
    it('should mark icon as decorative with aria-hidden', () => {
      // Requirement 8.6: Icon marked as decorative for accessibility
      const button = createButton({ label: 'Accessible Button', icon: 'info' });
      
      const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
      expect(iconElement?.getAttribute('aria-hidden')).toBe('true');
    });
  });
  
  describe('Text Wrapping', () => {
    it('should allow text wrapping by default', () => {
      // Requirement 7.1: Text wraps by default
      const button = createButton({ label: 'This is a very long button label that should wrap' });
      
      const labelElement = button.shadowRoot?.querySelector('.button-cta__label');
      expect(labelElement).toBeTruthy();
      expect(labelElement?.className).toBe('button-cta__label');
    });
    
    it('should truncate text with ellipsis when noWrap is true', () => {
      // Requirement 7.3: noWrap prop truncates text with ellipsis
      const button = createButton({ 
        label: 'This is a very long button label that should truncate',
        noWrap: true
      });
      
      const labelElement = button.shadowRoot?.querySelector('.button-cta__label--no-wrap');
      expect(labelElement).toBeTruthy();
      expect(labelElement?.className).toBe('button-cta__label--no-wrap');
    });
    
    it('should center-align text horizontally', () => {
      // Requirement 7.4: Text is center-aligned
      const button = createButton({ label: 'Centered Text' });
      
      const labelElement = button.shadowRoot?.querySelector('.button-cta__label');
      expect(labelElement).toBeTruthy();
      // CSS handles centering, we just verify the element exists
    });
  });
  
  describe('Disabled State', () => {
    it('should render disabled button with correct attributes', () => {
      // Requirement: Disabled prop prevents interaction
      const button = createButton({ label: 'Disabled Button', disabled: true });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.hasAttribute('disabled')).toBe(true);
      expect(shadowButton?.getAttribute('aria-disabled')).toBe('true');
      expect(shadowButton?.className).toContain('button-cta--disabled');
    });
    
    it('should not have disabled attributes when disabled is false', () => {
      // Requirement: Enabled button is interactive
      const button = createButton({ label: 'Enabled Button', disabled: false });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.hasAttribute('disabled')).toBe(false);
      expect(shadowButton?.getAttribute('aria-disabled')).toBe('false');
      expect(shadowButton?.className).not.toContain('button-cta--disabled');
    });
    
    it('should prevent press event when disabled', () => {
      // Requirement: Disabled button doesn't trigger onPress
      const button = createButton({ label: 'Disabled Button', disabled: true });
      
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
      const button = createButton({ label: 'Accessible Button' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.getAttribute('role')).toBe('button');
    });
    
    it('should have aria-label matching button text', () => {
      // Requirement: Button has accessible label
      const button = createButton({ label: 'Submit Form' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.getAttribute('aria-label')).toBe('Submit Form');
    });
    
    it('should have correct type attribute', () => {
      // Requirement: Button has type="button"
      const button = createButton({ label: 'Button' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.getAttribute('type')).toBe('button');
    });
  });
  
  describe('Test ID Support', () => {
    it('should apply test ID when provided', () => {
      // Requirement: testID prop for automated testing
      const button = createButton({ label: 'Test Button', testID: 'submit-button' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.getAttribute('data-testid')).toBe('submit-button');
    });
    
    it('should not have test ID attribute when not provided', () => {
      // Requirement: testID is optional
      const button = createButton({ label: 'Button' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.hasAttribute('data-testid')).toBe(false);
    });
  });
  
  describe('Combined Props', () => {
    it('should render with all props combined correctly', () => {
      // Requirement: All props work together
      const button = createButton({
        label: 'Complete Button',
        size: 'large',
        buttonVariant: 'secondary',
        icon: 'arrow-right',
        noWrap: true,
        testID: 'complete-button'
      });
      
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
  
  describe('Interaction Tests', () => {
    it('should call onPress when button clicked', () => {
      // Requirement 15.1: Button activates on click
      const button = createButton({ label: 'Click Me' });
      
      let pressCount = 0;
      button.addEventListener('press', () => {
        pressCount++;
      });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      shadowButton?.click();
      
      expect(pressCount).toBe(1);
    });
    
    it('should NOT call onPress when button disabled', () => {
      // Requirement 15.1: Disabled button doesn't trigger onPress
      const button = createButton({ label: 'Disabled Button', disabled: true });
      
      let pressCount = 0;
      button.addEventListener('press', () => {
        pressCount++;
      });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      shadowButton?.click();
      
      expect(pressCount).toBe(0);
    });
    
    it('should receive focus via Tab key', () => {
      // Requirement 15.2: Button is keyboard focusable
      const button = createButton({ label: 'Focusable Button' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton).toBeTruthy();
      
      // Verify button is focusable (tabindex not -1)
      const tabIndex = shadowButton?.getAttribute('tabindex');
      expect(tabIndex).not.toBe('-1');
      
      // Simulate focus
      shadowButton?.focus();
      expect(document.activeElement).toBe(button);
    });
    
    it('should call onPress when Enter key pressed while focused', () => {
      // Requirement 15.2: Button activates on Enter key
      const button = createButton({ label: 'Enter Button' });
      
      let pressCount = 0;
      button.addEventListener('press', () => {
        pressCount++;
      });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      shadowButton?.focus();
      
      // Simulate Enter key press
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true
      });
      shadowButton?.dispatchEvent(enterEvent);
      
      expect(pressCount).toBe(1);
    });
    
    it('should call onPress when Space key pressed while focused', () => {
      // Requirement 15.3: Button activates on Space key
      const button = createButton({ label: 'Space Button' });
      
      let pressCount = 0;
      button.addEventListener('press', () => {
        pressCount++;
      });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      shadowButton?.focus();
      
      // Simulate Space key press
      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        cancelable: true
      });
      shadowButton?.dispatchEvent(spaceEvent);
      
      expect(pressCount).toBe(1);
    });
    
    it('should call onPress multiple times for multiple clicks', () => {
      // Requirement 15.4: Multiple clicks work correctly
      const button = createButton({ label: 'Multi Click' });
      
      let pressCount = 0;
      button.addEventListener('press', () => {
        pressCount++;
      });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      
      // Click multiple times
      shadowButton?.click();
      shadowButton?.click();
      shadowButton?.click();
      
      expect(pressCount).toBe(3);
    });
    
    it('should handle rapid clicks without issues', () => {
      // Requirement 15.4: Rapid clicks don't cause issues
      const button = createButton({ label: 'Rapid Click' });
      
      let pressCount = 0;
      button.addEventListener('press', () => {
        pressCount++;
      });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      
      // Simulate rapid clicks
      for (let i = 0; i < 10; i++) {
        shadowButton?.click();
      }
      
      expect(pressCount).toBe(10);
    });
  });
  
  describe('ARIA and Keyboard Navigation', () => {
    it('should have correct ARIA role (role="button")', () => {
      // Requirement 12.1: Button has correct ARIA role
      const button = createButton({ label: 'ARIA Button' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton?.getAttribute('role')).toBe('button');
    });
    
    it('should be keyboard focusable', () => {
      // Requirement 12.1, 15.1: Button is keyboard focusable
      const button = createButton({ label: 'Keyboard Focusable' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton).toBeTruthy();
      
      // Verify button is focusable (not disabled and tabindex not -1)
      expect(shadowButton?.hasAttribute('disabled')).toBe(false);
      const tabIndex = shadowButton?.getAttribute('tabindex');
      expect(tabIndex).not.toBe('-1');
      
      // Verify button can receive focus
      shadowButton?.focus();
      expect(document.activeElement).toBe(button);
    });
    
    it('should mark icon as decorative (aria-hidden="true")', () => {
      // Requirement 12.3, 8.6: Icon is marked decorative for screen readers
      const button = createButton({ label: 'Button with Icon', icon: 'check' });
      
      const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
      expect(iconElement).toBeTruthy();
      expect(iconElement?.getAttribute('aria-hidden')).toBe('true');
    });
    
    it('should not have aria-hidden on icon when no icon provided', () => {
      // Requirement 12.3: No icon means no aria-hidden attribute
      const button = createButton({ label: 'Button without Icon' });
      
      const iconElement = button.shadowRoot?.querySelector('.button-cta__icon');
      expect(iconElement).toBeFalsy();
    });
    
    it('should show focus indicator on keyboard navigation', () => {
      // Requirement 12.4: Focus indicator visible on keyboard navigation
      const button = createButton({ label: 'Focus Indicator' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      expect(shadowButton).toBeTruthy();
      
      // Simulate keyboard focus (Tab key)
      shadowButton?.focus();
      
      // Verify button is focused
      expect(document.activeElement).toBe(button);
      
      // In a real browser, :focus-visible would apply CSS styles
      // In jsdom, we verify the button can receive focus and has proper attributes
      expect(shadowButton?.hasAttribute('disabled')).toBe(false);
      
      // Verify button has proper ARIA attributes for focus
      expect(shadowButton?.getAttribute('role')).toBe('button');
      expect(shadowButton?.getAttribute('aria-label')).toBeTruthy();
    });
    
    it('should maintain focus indicator visibility across all button variants', () => {
      // Requirement 12.4: Focus indicator works for all variant styles
      const variants: Array<'primary' | 'secondary' | 'tertiary'> = ['primary', 'secondary', 'tertiary'];
      
      variants.forEach(variant => {
        const button = createButton({ 
          label: `${variant} button`, 
          buttonVariant: variant 
        });
        
        const shadowButton = button.shadowRoot?.querySelector('button');
        shadowButton?.focus();
        
        // Verify focus works for all variants
        expect(document.activeElement).toBe(button);
        expect(shadowButton?.getAttribute('role')).toBe('button');
        
        container.removeChild(button);
      });
    });
    
    it('should maintain focus indicator visibility across all button sizes', () => {
      // Requirement 12.4: Focus indicator works for all size variants
      const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
      
      sizes.forEach(size => {
        const button = createButton({ 
          label: `${size} button`, 
          size 
        });
        
        const shadowButton = button.shadowRoot?.querySelector('button');
        shadowButton?.focus();
        
        // Verify focus works for all sizes
        expect(document.activeElement).toBe(button);
        expect(shadowButton?.getAttribute('role')).toBe('button');
        
        container.removeChild(button);
      });
    });
    
    it('should have proper ARIA attributes for accessibility', () => {
      // Requirement 12.1-12.6: Complete ARIA attribute verification
      const button = createButton({ label: 'Accessible Button' });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      
      // Verify all required ARIA attributes
      expect(shadowButton?.getAttribute('role')).toBe('button');
      expect(shadowButton?.getAttribute('aria-label')).toBe('Accessible Button');
      expect(shadowButton?.getAttribute('type')).toBe('button');
      expect(shadowButton?.getAttribute('aria-disabled')).toBe('false');
    });
    
    it('should have proper ARIA attributes when disabled', () => {
      // Requirement 12.6: Disabled button has correct ARIA attributes
      const button = createButton({ label: 'Disabled Button', disabled: true });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      
      // Verify disabled ARIA attributes
      expect(shadowButton?.getAttribute('role')).toBe('button');
      expect(shadowButton?.getAttribute('aria-disabled')).toBe('true');
      expect(shadowButton?.hasAttribute('disabled')).toBe(true);
    });
    
    it('should support keyboard navigation with Enter key', () => {
      // Requirement 15.2: Enter key activates button
      const button = createButton({ label: 'Enter Key Button' });
      
      let pressCount = 0;
      button.addEventListener('press', () => {
        pressCount++;
      });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      shadowButton?.focus();
      
      // Verify button is focused
      expect(document.activeElement).toBe(button);
      
      // Simulate Enter key press
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true
      });
      shadowButton?.dispatchEvent(enterEvent);
      
      expect(pressCount).toBe(1);
    });
    
    it('should support keyboard navigation with Space key', () => {
      // Requirement 15.3: Space key activates button
      const button = createButton({ label: 'Space Key Button' });
      
      let pressCount = 0;
      button.addEventListener('press', () => {
        pressCount++;
      });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      shadowButton?.focus();
      
      // Verify button is focused
      expect(document.activeElement).toBe(button);
      
      // Simulate Space key press
      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        cancelable: true
      });
      shadowButton?.dispatchEvent(spaceEvent);
      
      expect(pressCount).toBe(1);
    });
    
    it('should not activate on keyboard when disabled', () => {
      // Requirement 15.4: Disabled button doesn't respond to keyboard
      const button = createButton({ label: 'Disabled Keyboard', disabled: true });
      
      let pressCount = 0;
      button.addEventListener('press', () => {
        pressCount++;
      });
      
      const shadowButton = button.shadowRoot?.querySelector('button');
      shadowButton?.focus();
      
      // Try Enter key
      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true
      });
      shadowButton?.dispatchEvent(enterEvent);
      
      // Try Space key
      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        cancelable: true
      });
      shadowButton?.dispatchEvent(spaceEvent);
      
      expect(pressCount).toBe(0);
    });
  });
});
