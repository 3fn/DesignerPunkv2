/**
 * @category evergreen
 * @purpose Property-based tests for Button-Icon component (Properties 1-7)
 * @jest-environment jsdom
 */
/**
 * Button-Icon Property-Based Tests (Properties 1-7)
 * 
 * Property-based tests using fast-check to verify universal properties
 * that should hold across all valid inputs for the Button-Icon component.
 * 
 * Properties covered:
 * - Property 1: Size→Token Mapping
 * - Property 2: Focus Buffer Presence
 * - Property 3: Variant→Styling Mapping
 * - Property 4: Circular Shape Token
 * - Property 5: ariaLabel Applied
 * - Property 6: Icon Decorative
 * - Property 7: Touch Target Minimum
 * 
 * Note: These tests verify structural properties (DOM structure, attributes, CSS classes)
 * rather than computed styles, as jsdom has limited CSS computation support for Shadow DOM.
 * Visual styling verification should be done via visual regression testing.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-Icon
 * Component Type: Primitive (foundational component)
 * 
 * @module Button-Icon/__tests__/ButtonIcon.properties
 * @see Requirements: 1.1-1.4, 2.1-2.3, 3.1, 4.2, 4.5, 5.1-5.4
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

/**
 * Minimum touch target size (tapAreaRecommended)
 * @see Requirements 5.1, 5.2, 5.3
 */
const TAP_AREA_RECOMMENDED = 48;

// ============================================================================
// Test Suite
// ============================================================================

describe('Button-Icon Property-Based Tests (Properties 1-7)', () => {
  // Register component before all tests
  beforeAll(() => {
    registerButtonIcon();
  });
  
  // Clean up tokens after all tests
  afterAll(() => {
    cleanupButtonIconTokens();
  });
  
  // ============================================================================
  // Property 1: Size→Token Mapping
  // ============================================================================
  
  describe('Property 1: Size→Token Mapping', () => {
    /**
     * Property 1: Size→Token Mapping
     * 
     * *For any* Button-Icon with a valid size variant (small, medium, large),
     * the rendered component SHALL use the corresponding icon token and padding token.
     * 
     * **Validates: Requirements 1.1, 1.2, 1.3, 10.1, 10.2, 10.3**
     * **Feature: button-icon-component, Property 1: Size→Token Mapping**
     */
    it('should use correct icon size token for all size variants', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size });
            
            try {
              const iconElement = getIconElement(button);
              expect(iconElement).toBeTruthy();
              
              // Verify icon size attribute matches expected token value
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
    
    it('should apply correct CSS class for size variant', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size });
            
            try {
              // Verify size class is applied
              expect(hasClass(button, `button-icon--${size}`)).toBe(true);
              
              // Verify other size classes are NOT applied
              const otherSizes = allSizes.filter(s => s !== size);
              for (const otherSize of otherSizes) {
                expect(hasClass(button, `button-icon--${otherSize}`)).toBe(false);
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
    
    it('should have size-specific CSS rules in shadow DOM styles', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size });
            
            try {
              // Verify size-specific CSS class exists in CSS file
              expect(cssContent).toContain(`.button-icon--${size}`);
              
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
  // Property 2: Focus Buffer Presence
  // ============================================================================
  
  describe('Property 2: Focus Buffer Presence', () => {
    /**
     * Property 2: Focus Buffer Presence
     * 
     * *For any* Button-Icon regardless of size or variant, the component SHALL
     * include a transparent focus buffer on all sides equal to
     * accessibility.focus.offset + accessibility.focus.width (4px).
     * 
     * **Validates: Requirements 1.4, 6.3**
     * **Feature: button-icon-component, Property 2: Focus Buffer Presence**
     */
    it('should have focus buffer CSS variable defined in styles', async () => {
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
              // Verify focus buffer CSS variable is defined in CSS file
              expect(cssContent).toContain('--_bi-focus-buffer');
              
              // Verify margin is applied using the focus buffer variable
              expect(cssContent).toContain('margin: var(--_bi-focus-buffer)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have focus ring CSS rules in styles', async () => {
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
              // Verify focus-visible rule exists in CSS file
              expect(cssContent).toContain(':focus-visible');
              
              // Verify focus ring tokens are referenced
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
  });
  
  // ============================================================================
  // Property 3: Variant→Styling Mapping
  // ============================================================================
  
  describe('Property 3: Variant→Styling Mapping', () => {
    /**
     * Property 3: Variant→Styling Mapping
     * 
     * *For any* Button-Icon with a valid variant (primary, secondary, tertiary),
     * the rendered component SHALL apply the correct background color, border,
     * and icon color tokens as specified in the variant configuration.
     * 
     * **Validates: Requirements 2.1, 2.2, 2.3**
     * **Feature: button-icon-component, Property 3: Variant→Styling Mapping**
     */
    it('should apply correct CSS class for variant', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              // Verify variant class is applied
              expect(hasClass(button, `button-icon--${variant}`)).toBe(true);
              
              // Verify other variant classes are NOT applied
              const otherVariants = allVariants.filter(v => v !== variant);
              for (const otherVariant of otherVariants) {
                expect(hasClass(button, `button-icon--${otherVariant}`)).toBe(false);
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
    
    it('should have variant-specific CSS rules in shadow DOM styles', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, variant });
            
            try {
              // Verify variant-specific CSS class exists in CSS file
              expect(cssContent).toContain(`.button-icon--${variant}`);
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have primary variant with background color token', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (icon, ariaLabel) => {
            const button = await createButtonIcon({ 
              icon, 
              ariaLabel, 
              variant: 'primary' 
            });
            
            try {
              // Primary should reference color-primary for background in CSS file
              expect(cssContent).toContain('--_bi-color-primary');
              
              // Verify primary class has background-color rule
              const primarySection = cssContent.match(/\.button-icon--primary\s*\{[^}]+\}/);
              expect(primarySection).toBeTruthy();
              expect(primarySection?.[0]).toContain('background-color');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have secondary variant with box-shadow border technique', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (icon, ariaLabel) => {
            const button = await createButtonIcon({ 
              icon, 
              ariaLabel, 
              variant: 'secondary' 
            });
            
            try {
              // Secondary should use box-shadow technique for border in CSS file
              const secondarySection = cssContent.match(/\.button-icon--secondary\s*\{[^}]+\}/);
              expect(secondarySection).toBeTruthy();
              expect(secondarySection?.[0]).toContain('box-shadow');
              expect(secondarySection?.[0]).toContain('transparent');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have tertiary variant with transparent background', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (icon, ariaLabel) => {
            const button = await createButtonIcon({ 
              icon, 
              ariaLabel, 
              variant: 'tertiary' 
            });
            
            try {
              // Tertiary should have transparent background in CSS file
              const tertiarySection = cssContent.match(/\.button-icon--tertiary\s*\{[^}]+\}/);
              expect(tertiarySection).toBeTruthy();
              expect(tertiarySection?.[0]).toContain('transparent');
              
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
  // Property 4: Circular Shape Token
  // ============================================================================
  
  describe('Property 4: Circular Shape Token', () => {
    /**
     * Property 4: Circular Shape Token
     * 
     * *For any* Button-Icon regardless of size or variant, the component SHALL
     * use the radiusCircle semantic token for border-radius, resulting in a
     * perfect circle (50%).
     * 
     * **Validates: Requirements 3.1**
     * **Feature: button-icon-component, Property 4: Circular Shape Token**
     */
    it('should use radiusCircle token (50%) for border-radius', async () => {
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
              // Verify radiusCircle CSS variable is defined as 50% in CSS file
              expect(cssContent).toContain('--_bi-radius: 50%');
              
              // Verify border-radius uses the variable
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
    
    it('should maintain circular shape during interaction states', async () => {
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
              // Verify hover, active, and focus states maintain border-radius in CSS file
              expect(cssContent).toContain('.button-icon:hover');
              expect(cssContent).toContain('.button-icon:active');
              expect(cssContent).toContain('.button-icon:focus');
              
              // Verify the interaction states section maintains border-radius
              const interactionSection = cssContent.match(/\.button-icon:hover[\s\S]*?border-radius/);
              expect(interactionSection).toBeTruthy();
              
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
  // Property 5: ariaLabel Applied
  // ============================================================================
  
  describe('Property 5: ariaLabel Applied', () => {
    /**
     * Property 5: ariaLabel Applied
     * 
     * *For any* Button-Icon with a non-empty ariaLabel string, the rendered
     * component SHALL include that exact string as the accessible name
     * (via aria-label attribute on web).
     * 
     * **Validates: Requirements 4.2, 4.3, 4.4**
     * **Feature: button-icon-component, Property 5: ariaLabel Applied**
     */
    it('should apply aria-label attribute with exact value', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              const shadowButton = getShadowButton(button);
              expect(shadowButton).toBeTruthy();
              
              // Verify aria-label attribute matches exactly
              const appliedAriaLabel = shadowButton?.getAttribute('aria-label');
              expect(appliedAriaLabel).toBe(ariaLabel);
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should apply aria-label to semantic button element', async () => {
      await fc.assert(
        fc.asyncProperty(
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel });
            
            try {
              const shadowButton = getShadowButton(button);
              expect(shadowButton).toBeTruthy();
              
              // Verify it's a semantic button element
              expect(shadowButton?.tagName.toLowerCase()).toBe('button');
              
              // Verify role is button (explicit or implicit)
              const role = shadowButton?.getAttribute('role');
              expect(role === 'button' || role === null).toBe(true);
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have type="button" on the button element', async () => {
      await fc.assert(
        fc.asyncProperty(
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel });
            
            try {
              const shadowButton = getShadowButton(button);
              expect(shadowButton).toBeTruthy();
              
              // Verify type="button" is set (prevents form submission)
              expect(shadowButton?.getAttribute('type')).toBe('button');
              
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
  // Property 6: Icon Decorative
  // ============================================================================
  
  describe('Property 6: Icon Decorative', () => {
    /**
     * Property 6: Icon Decorative
     * 
     * *For any* Button-Icon, the internal Icon component SHALL be marked as
     * decorative (aria-hidden="true" on web) since the button itself provides
     * the accessible name.
     * 
     * **Validates: Requirements 4.5**
     * **Feature: button-icon-component, Property 6: Icon Decorative**
     */
    it('should mark icon container as aria-hidden', async () => {
      await fc.assert(
        fc.asyncProperty(
          sizeArbitrary,
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (size, variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel, size, variant });
            
            try {
              // Find the icon container (span with class button-icon__icon)
              const iconContainer = button.shadowRoot?.querySelector('.button-icon__icon');
              expect(iconContainer).toBeTruthy();
              
              // Verify aria-hidden is set to true
              const ariaHidden = iconContainer?.getAttribute('aria-hidden');
              expect(ariaHidden).toBe('true');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should render icon-base element inside icon container', async () => {
      await fc.assert(
        fc.asyncProperty(
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (icon, ariaLabel) => {
            const button = await createButtonIcon({ icon, ariaLabel });
            
            try {
              const iconElement = getIconElement(button);
              expect(iconElement).toBeTruthy();
              
              // Verify icon-base element exists
              expect(iconElement?.tagName.toLowerCase()).toBe('icon-base');
              
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
    
    it('should pass color="inherit" to icon-base for color inheritance', async () => {
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
  });
  
  // ============================================================================
  // Property 7: Touch Target Minimum
  // ============================================================================
  
  describe('Property 7: Touch Target Minimum', () => {
    /**
     * Property 7: Touch Target Minimum
     * 
     * *For any* Button-Icon regardless of size, the interactive touch target
     * area SHALL be at least tapAreaRecommended (48px). For small size, this
     * requires invisible hit area extension beyond the visual bounds.
     * 
     * **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
     * **Feature: button-icon-component, Property 7: Touch Target Minimum**
     */
    it('should have touch target extension CSS for small size', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ 
              icon, 
              ariaLabel, 
              size: 'small',
              variant 
            });
            
            try {
              // Verify small size has ::after pseudo-element for touch target extension in CSS file
              expect(cssContent).toContain('.button-icon--small::after');
              
              // Verify the ::after extends to tapAreaRecommended using token reference
              // @see Requirements 6.1, 6.3 - Token-referenced sizing
              expect(cssContent).toContain('var(--_bi-touch-target)');
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have position: relative for small size touch target extension', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ 
              icon, 
              ariaLabel, 
              size: 'small',
              variant 
            });
            
            try {
              // Verify base button has position: relative (required for ::after positioning) in CSS file
              expect(cssContent).toContain('position: relative');
              
              // Verify small class is applied
              expect(hasClass(button, 'button-icon--small')).toBe(true);
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have large size meeting minimum touch target without extension', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ 
              icon, 
              ariaLabel, 
              size: 'large',
              variant 
            });
            
            try {
              // Verify large size uses token reference (not hard-coded 48px)
              // @see Requirements 6.1, 6.3 - Token-referenced sizing
              const largeSection = cssContent.match(/\.button-icon--large\s*\{[^}]+\}/);
              expect(largeSection).toBeTruthy();
              expect(largeSection?.[0]).toContain('var(--_bi-size-large)');
              
              // Verify large class is applied
              expect(hasClass(button, 'button-icon--large')).toBe(true);
              
              return true;
            } finally {
              cleanupButtonIcon(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
    
    it('should have medium size with focus buffer meeting minimum touch target', async () => {
      const cssContent = getCSSContent();
      
      await fc.assert(
        fc.asyncProperty(
          variantArbitrary,
          iconNameArbitrary,
          ariaLabelArbitrary,
          async (variant, icon, ariaLabel) => {
            const button = await createButtonIcon({ 
              icon, 
              ariaLabel, 
              size: 'medium',
              variant 
            });
            
            try {
              // Verify medium size uses token reference (not hard-coded 40px)
              // @see Requirements 6.1, 6.3 - Token-referenced sizing
              const mediumSection = cssContent.match(/\.button-icon--medium\s*\{[^}]+\}/);
              expect(mediumSection).toBeTruthy();
              expect(mediumSection?.[0]).toContain('var(--_bi-size-medium)');
              
              // Verify medium class is applied
              expect(hasClass(button, 'button-icon--medium')).toBe(true);
              
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
