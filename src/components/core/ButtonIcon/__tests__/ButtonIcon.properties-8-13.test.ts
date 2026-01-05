/**
 * @category evergreen
 * @purpose Property-based tests for Button-Icon component (Properties 8-13)
 * @jest-environment jsdom
 */
/**
 * Button-Icon Property-Based Tests (Properties 8-13)
 * 
 * Property-based tests using fast-check to verify universal properties
 * that should hold across all valid inputs for the Button-Icon component.
 * 
 * Properties covered:
 * - Property 8: Focus Ring Styling
 * - Property 9: Hover State Styling
 * - Property 10: Pressed State Styling
 * - Property 11: Secondary Border No Layout Shift
 * - Property 12: Animation Tokens
 * - Property 13: Icon Component Integration
 * 
 * Note: These tests verify structural properties (DOM structure, attributes, CSS classes)
 * rather than computed styles, as jsdom has limited CSS computation support for Shadow DOM.
 * Visual styling verification should be done via visual regression testing.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-Icon
 * Component Type: Primitive (foundational component)
 * 
 * @module Button-Icon/__tests__/ButtonIcon.properties-8-13
 * @see Requirements: 6.1-6.3, 7.1-7.4, 8.1-8.3, 9.1-9.2, 12.1-12.2, 13.1-13.4
 */

import * as fc from 'fast-check';
import {
  registerButtonIcon,
  createButtonIcon,
  cleanupButtonIcon,
  getShadowButton,
  getIconElement,
  hasClass,
  cleanupButtonIconTokens
} from './test-utils';
import { ButtonIconSize, ButtonIconVariant } from '../types';
import { IconBaseName } from '../../Icon-Base/types';

// ============================================================================
// Test Data Generators
// ============================================================================

/**
 * All valid ButtonIcon sizes
 */
const allSizes: ButtonIconSize[] = ['small', 'medium', 'large'];

/**
 * All valid ButtonIcon variants
 */
const allVariants: ButtonIconVariant[] = ['primary', 'secondary', 'tertiary'];


/**
 * All valid icon names for testing
 */
const allIconNames: IconBaseName[] = [
  'arrow-right', 'arrow-left', 'arrow-up', 'arrow-down', 'chevron-right',
  'check', 'x', 'x-circle', 'info', 'plus', 'minus',
  'circle', 'heart', 'settings', 'user', 'mail', 'calendar'
];

/**
 * Fast-check arbitrary for ButtonIcon size
 */
const sizeArbitrary = fc.constantFrom<ButtonIconSize>(...allSizes);

/**
 * Fast-check arbitrary for ButtonIcon variant
 */
const variantArbitrary = fc.constantFrom<ButtonIconVariant>(...allVariants);

/**
 * Fast-check arbitrary for icon names
 */
const iconNameArbitrary = fc.constantFrom<IconBaseName>(...allIconNames);

/**
 * Fast-check arbitrary for safe aria labels (alphanumeric + spaces)
 * Avoids special characters that could break HTML attribute parsing
 */
const ariaLabelArbitrary = fc.string({ minLength: 1, maxLength: 50 })
  .filter((s: string) => /^[a-zA-Z0-9 ]+$/.test(s) && s.trim().length > 0);

// ============================================================================
// Expected Token Mappings
// ============================================================================

/**
 * Expected icon size tokens per button size
 * @see Requirements 1.1, 1.2, 1.3
 */
const expectedIconSizes: Record<ButtonIconSize, number> = {
  small: 13,   // icon.size050
  medium: 18,  // icon.size075
  large: 24    // icon.size100
};


// ============================================================================
// Test Suite
// ============================================================================

describe('Button-Icon Property-Based Tests (Properties 8-13)', () => {
  // Register component before all tests
  beforeAll(() => {
    registerButtonIcon();
  });
  
  // Clean up tokens after all tests
  afterAll(() => {
    cleanupButtonIconTokens();
  });
  
  // ============================================================================
  // Property 8: Focus Ring Styling
  // ============================================================================
  
  describe('Property 8: Focus Ring Styling', () => {
    /**
     * Property 8: Focus Ring Styling
     * 
     * *For any* Button-Icon that receives keyboard focus, the focus ring SHALL
     * use accessibility.focus.width and accessibility.focus.color tokens, be
     * positioned at accessibility.focus.offset from the visual button edge,
     * and remain contained within the focus buffer.
     * 
     * **Validates: Requirements 6.1, 6.2, 6.3**
     * **Feature: button-icon-component, Property 8: Focus Ring Styling**
     */
    it('should have focus ring CSS variables defined', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              expect(styleElement).toBeTruthy();
              
              const styleContent = styleElement?.textContent || '';
              
              // Verify focus ring CSS variables are defined in :host
              expect(styleContent).toContain('--button-icon-focus-width');
              expect(styleContent).toContain('--button-icon-focus-color');
              expect(styleContent).toContain('--button-icon-focus-offset');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    
    it('should use focus-visible for keyboard-only focus indicators', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify :focus-visible rule exists for keyboard-only focus
              expect(styleContent).toContain('.button-icon:focus-visible');
              
              // Verify outline uses focus ring tokens
              expect(styleContent).toContain('outline: var(--button-icon-focus-width) solid var(--button-icon-focus-color)');
              expect(styleContent).toContain('outline-offset: var(--button-icon-focus-offset)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should hide focus ring on mouse click (focus:not(:focus-visible))', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify focus:not(:focus-visible) rule removes outline on mouse click
              expect(styleContent).toContain('.button-icon:focus:not(:focus-visible)');
              expect(styleContent).toContain('outline: none');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  
  // ============================================================================
  // Property 9: Hover State Styling
  // ============================================================================
  
  describe('Property 9: Hover State Styling', () => {
    /**
     * Property 9: Hover State Styling
     * 
     * *For any* Button-Icon variant on hover, the component SHALL apply the
     * correct blend token (blend.hoverDarker) to the appropriate element
     * while maintaining circular shape.
     * 
     * **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
     * **Feature: button-icon-component, Property 9: Hover State Styling**
     */
    it('should have hover state CSS rules for all variants', async () => {
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify hover rule exists for the variant
              expect(styleContent).toContain(`.button-icon--${variant}:hover`);
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should apply brightness filter for hover darkening (blend.hoverDarker)', async () => {
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify hover uses brightness filter (0.92 = 8% darker)
              const hoverSection = styleContent.match(new RegExp(`\\.button-icon--${variant}:hover\\s*\\{[^}]+\\}`));
              expect(hoverSection).toBeTruthy();
              expect(hoverSection?.[0]).toContain('filter: brightness(0.92)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    
    it('should apply subtle background on secondary hover', async () => {
      await fc.assert(
        fc.asyncProperty(
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant: 'secondary' });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify secondary hover has subtle background
              const hoverSection = styleContent.match(/\.button-icon--secondary:hover\s*\{[^}]+\}/);
              expect(hoverSection).toBeTruthy();
              expect(hoverSection?.[0]).toContain('background-color: var(--button-icon-color-bg-subtle)');
              
              // Verify border becomes visible on hover
              expect(hoverSection?.[0]).toContain('border-color: var(--button-icon-color-primary)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should maintain circular shape during hover state', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify hover state maintains border-radius
              expect(styleContent).toContain('.button-icon:hover');
              expect(styleContent).toContain('border-radius: var(--button-icon-radius)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  
  // ============================================================================
  // Property 10: Pressed State Styling
  // ============================================================================
  
  describe('Property 10: Pressed State Styling', () => {
    /**
     * Property 10: Pressed State Styling
     * 
     * *For any* Button-Icon variant on press, the component SHALL apply the
     * correct blend token (blend.pressedDarker) to the appropriate element
     * while maintaining circular shape.
     * 
     * **Validates: Requirements 8.1, 8.2, 8.3, 8.6**
     * **Feature: button-icon-component, Property 10: Pressed State Styling**
     */
    it('should have active/pressed state CSS rules for all variants', async () => {
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify active rule exists for the variant
              expect(styleContent).toContain(`.button-icon--${variant}:active`);
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should apply brightness filter for pressed darkening (blend.pressedDarker)', async () => {
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify active uses brightness filter (0.88 = 12% darker)
              const activeSection = styleContent.match(new RegExp(`\\.button-icon--${variant}:active\\s*\\{[^}]+\\}`));
              expect(activeSection).toBeTruthy();
              expect(activeSection?.[0]).toContain('filter: brightness(0.88)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    
    it('should apply subtle background on secondary pressed', async () => {
      await fc.assert(
        fc.asyncProperty(
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant: 'secondary' });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify secondary active has subtle background
              const activeSection = styleContent.match(/\.button-icon--secondary:active\s*\{[^}]+\}/);
              expect(activeSection).toBeTruthy();
              expect(activeSection?.[0]).toContain('background-color: var(--button-icon-color-bg-subtle)');
              
              // Verify border becomes visible on active
              expect(activeSection?.[0]).toContain('border-color: var(--button-icon-color-primary)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should maintain circular shape during pressed state', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify active state maintains border-radius
              expect(styleContent).toContain('.button-icon:active');
              expect(styleContent).toContain('border-radius: var(--button-icon-radius)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  
  // ============================================================================
  // Property 11: Secondary Border No Layout Shift
  // ============================================================================
  
  describe('Property 11: Secondary Border No Layout Shift', () => {
    /**
     * Property 11: Secondary Border No Layout Shift
     * 
     * *For any* Button-Icon with secondary variant, transitioning between
     * default, hover, and pressed states SHALL NOT cause any change in
     * component dimensions (no layout shift).
     * 
     * **Validates: Requirements 9.1, 9.2**
     * **Feature: button-icon-component, Property 11: Secondary Border No Layout Shift**
     */
    it('should reserve 2px border space with transparent border in default state', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant: 'secondary' });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify secondary has transparent border reserving 2px space
              const secondarySection = styleContent.match(/\.button-icon--secondary\s*\{[^}]+\}/);
              expect(secondarySection).toBeTruthy();
              expect(secondarySection?.[0]).toContain('border: var(--button-icon-border-emphasis) solid transparent');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should use box-shadow technique to simulate 1px border', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant: 'secondary' });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify secondary uses inset box-shadow for 1px visual border
              const secondarySection = styleContent.match(/\.button-icon--secondary\s*\{[^}]+\}/);
              expect(secondarySection).toBeTruthy();
              expect(secondarySection?.[0]).toContain('box-shadow: inset 0 0 0 var(--button-icon-border-default)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    
    it('should remove box-shadow on hover/active when actual border is shown', async () => {
      await fc.assert(
        fc.asyncProperty(
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant: 'secondary' });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify hover removes box-shadow (actual border takes over)
              const hoverSection = styleContent.match(/\.button-icon--secondary:hover\s*\{[^}]+\}/);
              expect(hoverSection).toBeTruthy();
              expect(hoverSection?.[0]).toContain('box-shadow: none');
              
              // Verify active removes box-shadow (actual border takes over)
              const activeSection = styleContent.match(/\.button-icon--secondary:active\s*\{[^}]+\}/);
              expect(activeSection).toBeTruthy();
              expect(activeSection?.[0]).toContain('box-shadow: none');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have consistent button dimensions across all secondary states', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant: 'secondary' });
            
            try {
              // Verify secondary class is applied
              expect(hasClass(button, 'button-icon--secondary')).toBe(true);
              
              // Verify size class is applied (determines dimensions)
              expect(hasClass(button, `button-icon--${size}`)).toBe(true);
              
              // The box-shadow technique ensures dimensions stay constant
              // because border space is always reserved (2px transparent)
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify size-specific dimensions are defined
              const sizeSection = styleContent.match(new RegExp(`\\.button-icon--${size}\\s*\\{[^}]+\\}`));
              expect(sizeSection).toBeTruthy();
              expect(sizeSection?.[0]).toContain('width:');
              expect(sizeSection?.[0]).toContain('height:');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  
  // ============================================================================
  // Property 12: Animation Tokens
  // ============================================================================
  
  describe('Property 12: Animation Tokens', () => {
    /**
     * Property 12: Animation Tokens
     * 
     * *For any* Button-Icon state transition (default↔hover, default↔pressed),
     * the transition SHALL use duration150 token for timing and standard
     * ease-in-out easing.
     * 
     * **Validates: Requirements 12.1, 12.2**
     * **Feature: button-icon-component, Property 12: Animation Tokens**
     */
    it('should define transition CSS variable using duration150 token', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify transition CSS variable references duration-150 token
              expect(styleContent).toContain('--button-icon-transition: var(--duration-150)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should apply transition to state-changing properties', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify transition is applied to relevant properties
              expect(styleContent).toContain('transition:');
              expect(styleContent).toContain('var(--button-icon-transition)');
              
              // Verify ease-in-out easing is used
              expect(styleContent).toContain('ease-in-out');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    
    it('should transition background-color, border-color, color, and box-shadow', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify transition includes all state-changing properties
              expect(styleContent).toContain('background-color var(--button-icon-transition)');
              expect(styleContent).toContain('border-color var(--button-icon-transition)');
              expect(styleContent).toContain('color var(--button-icon-transition)');
              expect(styleContent).toContain('box-shadow var(--button-icon-transition)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should respect prefers-reduced-motion media query', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify reduced motion media query exists
              expect(styleContent).toContain('@media (prefers-reduced-motion: reduce)');
              expect(styleContent).toContain('transition: none');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  
  // ============================================================================
  // Property 13: Icon Component Integration
  // ============================================================================
  
  describe('Property 13: Icon Component Integration', () => {
    /**
     * Property 13: Icon Component Integration
     * 
     * *For any* Button-Icon, the Icon component SHALL be used internally with
     * the correct icon name, size token based on Button-Icon size, and color
     * based on Button-Icon variant.
     * 
     * **Validates: Requirements 13.1, 13.2, 13.3, 13.4**
     * **Feature: button-icon-component, Property 13: Icon Component Integration**
     */
    it('should render icon-base element with correct name attribute', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              const iconElement = getIconElement(button);
              expect(iconElement).toBeTruthy();
              
              // Verify icon name is passed correctly
              expect(iconElement?.getAttribute('name')).toBe(icon);
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should pass correct size token to icon-base based on button size', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              const iconElement = getIconElement(button);
              expect(iconElement).toBeTruthy();
              
              // Verify icon size matches expected token value
              const iconSize = iconElement?.getAttribute('size');
              expect(iconSize).toBe(String(expectedIconSizes[size]));
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    
    it('should pass color="inherit" to icon-base for CSS color inheritance', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              const iconElement = getIconElement(button);
              expect(iconElement).toBeTruthy();
              
              // Verify color="inherit" is set for CSS color inheritance
              expect(iconElement?.getAttribute('color')).toBe('inherit');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have icon color defined per variant in CSS', async () => {
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant });
            
            try {
              const styleElement = button.shadowRoot?.querySelector('style');
              const styleContent = styleElement?.textContent || '';
              
              // Verify variant-specific color is defined
              const variantSection = styleContent.match(new RegExp(`\\.button-icon--${variant}\\s*\\{[^}]+\\}`));
              expect(variantSection).toBeTruthy();
              
              // Primary uses contrast color, secondary/tertiary use primary color
              if (variant === 'primary') {
                expect(variantSection?.[0]).toContain('color: var(--button-icon-color-contrast)');
              } else {
                expect(variantSection?.[0]).toContain('color: var(--button-icon-color-primary)');
              }
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should use icon-base web component (not raw SVG)', async () => {
      await fc.assert(
        fc.asyncProperty(
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel });
            
            try {
              const iconElement = getIconElement(button);
              expect(iconElement).toBeTruthy();
              
              // Verify it's the icon-base custom element
              expect(iconElement?.tagName.toLowerCase()).toBe('icon-base');
              
              // Verify no raw SVG is rendered directly in button
              const rawSvg = button.shadowRoot?.querySelector('button > svg');
              expect(rawSvg).toBeNull();
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
