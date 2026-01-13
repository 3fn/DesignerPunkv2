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

import * as fs from 'fs';
import * as path from 'path';
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
// Helper Functions
// ============================================================================

/**
 * Read the actual CSS file content for CSS validation tests.
 * Since Jest mocks CSS imports to return empty strings, we need to read
 * the actual CSS file for tests that validate CSS content.
 */
function readCSSFileContent(): string {
  const cssPath = path.resolve(process.cwd(), 'src/components/core/Button-Icon/platforms/web/ButtonIcon.web.css');
  if (fs.existsSync(cssPath)) {
    return fs.readFileSync(cssPath, 'utf-8');
  }
  return '';
}

// Cache CSS content to avoid repeated file reads
let cachedCSSContent: string | null = null;

function getCSSContent(): string {
  if (cachedCSSContent === null) {
    cachedCSSContent = readCSSFileContent();
  }
  return cachedCSSContent;
}

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
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              // Verify focus ring CSS variables are defined in CSS file
              expect(cssContent).toContain('--_bi-focus-width');
              expect(cssContent).toContain('--_bi-focus-color');
              expect(cssContent).toContain('--_bi-focus-offset');
              
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
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              // Verify :focus-visible rule exists for keyboard-only focus in CSS file
              expect(cssContent).toContain('.button-icon:focus-visible');
              
              // Verify outline uses focus ring tokens
              expect(cssContent).toContain('outline: var(--_bi-focus-width) solid var(--_bi-focus-color)');
              expect(cssContent).toContain('outline-offset: var(--_bi-focus-offset)');
              
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
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              // Verify focus:not(:focus-visible) rule removes outline on mouse click in CSS file
              expect(cssContent).toContain('.button-icon:focus:not(:focus-visible)');
              expect(cssContent).toContain('outline: none');
              
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
     * correct blend utility calculated color to the appropriate element
     * while maintaining circular shape.
     * 
     * **Validates: Requirements 7.1, 7.2, 7.3, 7.4**
     * **Feature: button-icon-component, Property 9: Hover State Styling**
     * 
     * Note: Updated to use blend utilities instead of filter: brightness()
     * @see Requirements 1.1, 1.5, 1.6 - Blend utility adoption
     */
    it('should have hover state CSS rules for all variants', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant });
            
            try {
              // Verify hover rule exists for the variant in CSS file
              expect(cssContent).toContain(`.button-icon--${variant}:hover`);
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should apply blend utility calculated color for hover state', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant });
            
            try {
              // Verify hover uses blend utility CSS custom property
              const hoverSection = cssContent.match(new RegExp(`\\.button-icon--${variant}:hover\\s*\\{[^}]+\\}`));
              expect(hoverSection).toBeTruthy();
              
              // Primary uses background-color, secondary/tertiary use color
              if (variant === 'primary') {
                expect(hoverSection?.[0]).toContain('background-color: var(--_bi-hover-bg)');
              } else {
                expect(hoverSection?.[0]).toContain('color: var(--_bi-hover-bg)');
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

    
    it('should apply subtle background on secondary hover', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant: 'secondary' });
            
            try {
              // Verify secondary hover has subtle background in CSS file
              const hoverSection = cssContent.match(/\.button-icon--secondary:hover\s*\{[^}]+\}/);
              expect(hoverSection).toBeTruthy();
              expect(hoverSection?.[0]).toContain('background-color: var(--_bi-color-bg-subtle)');
              
              // Verify border uses blend utility calculated color
              expect(hoverSection?.[0]).toContain('border-color: var(--_bi-hover-bg)');
              
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
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              // Verify hover state maintains border-radius in CSS file
              expect(cssContent).toContain('.button-icon:hover');
              expect(cssContent).toContain('border-radius: var(--_bi-radius)');
              
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
     * correct blend utility calculated color (blend.pressedDarker) to the 
     * appropriate element while maintaining circular shape.
     * 
     * **Validates: Requirements 8.1, 8.2, 8.3, 8.6**
     * **Feature: button-icon-component, Property 10: Pressed State Styling**
     * 
     * Note: Updated to use blend utilities instead of filter: brightness()
     * @see Requirements 1.2, 1.5, 1.6 - Blend utility adoption
     */
    it('should have active/pressed state CSS rules for all variants', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant });
            
            try {
              // Verify active rule exists for the variant in CSS file
              expect(cssContent).toContain(`.button-icon--${variant}:active`);
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should apply blend utility calculated color for pressed state', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant });
            
            try {
              // Verify pressed uses blend utility CSS custom property
              const activeSection = cssContent.match(new RegExp(`\\.button-icon--${variant}:active\\s*\\{[^}]+\\}`));
              expect(activeSection).toBeTruthy();
              
              // Primary uses background-color, secondary/tertiary use color
              if (variant === 'primary') {
                expect(activeSection?.[0]).toContain('background-color: var(--_bi-pressed-bg)');
              } else {
                expect(activeSection?.[0]).toContain('color: var(--_bi-pressed-bg)');
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

    
    it('should apply subtle background on secondary pressed', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant: 'secondary' });
            
            try {
              // Verify secondary active has subtle background in CSS file
              const activeSection = cssContent.match(/\.button-icon--secondary:active\s*\{[^}]+\}/);
              expect(activeSection).toBeTruthy();
              expect(activeSection?.[0]).toContain('background-color: var(--_bi-color-bg-subtle)');
              
              // Verify border uses blend utility calculated color
              expect(activeSection?.[0]).toContain('border-color: var(--_bi-pressed-bg)');
              
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
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              // Verify active state maintains border-radius in CSS file
              expect(cssContent).toContain('.button-icon:active');
              expect(cssContent).toContain('border-radius: var(--_bi-radius)');
              
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
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant: 'secondary' });
            
            try {
              // Verify secondary has transparent border reserving 2px space in CSS file
              const secondarySection = cssContent.match(/\.button-icon--secondary\s*\{[^}]+\}/);
              expect(secondarySection).toBeTruthy();
              expect(secondarySection?.[0]).toContain('border: var(--_bi-border-emphasis) solid transparent');
              
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
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant: 'secondary' });
            
            try {
              // Verify secondary uses inset box-shadow for 1px visual border in CSS file
              const secondarySection = cssContent.match(/\.button-icon--secondary\s*\{[^}]+\}/);
              expect(secondarySection).toBeTruthy();
              expect(secondarySection?.[0]).toContain('box-shadow: inset 0 0 0 var(--_bi-border-default)');
              
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
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant: 'secondary' });
            
            try {
              // Verify hover removes box-shadow (actual border takes over) in CSS file
              const hoverSection = cssContent.match(/\.button-icon--secondary:hover\s*\{[^}]+\}/);
              expect(hoverSection).toBeTruthy();
              expect(hoverSection?.[0]).toContain('box-shadow: none');
              
              // Verify active removes box-shadow (actual border takes over) in CSS file
              const activeSection = cssContent.match(/\.button-icon--secondary:active\s*\{[^}]+\}/);
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
      const cssContent = getCSSContent();
      
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
              // Verify size-specific dimensions are defined in CSS file
              const sizeSection = cssContent.match(new RegExp(`\\.button-icon--${size}\\s*\\{[^}]+\\}`));
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
     * the transition SHALL use semantic motion.buttonPress token for timing and easing.
     * 
     * **Validates: Requirements 3.2, 3.3, 3.4**
     * **Feature: button-icon-component, Property 12: Animation Tokens**
     */
    it('should define transition CSS variables using semantic motion.buttonPress token', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              // Verify transition CSS variables reference semantic motion.buttonPress token
              // @see Requirements: 3.2, 3.3, 3.4 - Semantic motion token usage
              expect(cssContent).toContain('--_bi-transition-duration: var(--motion-button-press-duration)');
              expect(cssContent).toContain('--_bi-transition-easing: var(--motion-button-press-easing)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should apply transition to state-changing properties using semantic motion tokens', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              // Verify transition is applied to relevant properties in CSS file
              expect(cssContent).toContain('transition:');
              // Verify semantic motion token references are used
              expect(cssContent).toContain('var(--_bi-transition-duration)');
              expect(cssContent).toContain('var(--_bi-transition-easing)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    
    it('should transition background-color, border-color, color, and box-shadow using semantic motion tokens', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              // Verify transition includes all state-changing properties in CSS file
              // Using semantic motion tokens for duration and easing
              expect(cssContent).toContain('background-color var(--_bi-transition-duration) var(--_bi-transition-easing)');
              expect(cssContent).toContain('border-color var(--_bi-transition-duration) var(--_bi-transition-easing)');
              expect(cssContent).toContain('color var(--_bi-transition-duration) var(--_bi-transition-easing)');
              expect(cssContent).toContain('box-shadow var(--_bi-transition-duration) var(--_bi-transition-easing)');
              
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
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              // Verify reduced motion media query exists in CSS file
              expect(cssContent).toContain('@media (prefers-reduced-motion: reduce)');
              expect(cssContent).toContain('transition: none');
              
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
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant });
            
            try {
              // Verify variant-specific color is defined in CSS file
              const variantSection = cssContent.match(new RegExp(`\\.button-icon--${variant}\\s*\\{[^}]+\\}`));
              expect(variantSection).toBeTruthy();
              
              // Primary uses contrast color, secondary/tertiary use primary color
              if (variant === 'primary') {
                expect(variantSection?.[0]).toContain('color: var(--_bi-color-contrast)');
              } else {
                expect(variantSection?.[0]).toContain('color: var(--_bi-color-primary)');
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
