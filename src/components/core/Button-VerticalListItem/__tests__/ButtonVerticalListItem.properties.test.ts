/**
 * @category evergreen
 * @purpose Property-based tests for Button-VerticalListItem component
 * @jest-environment jsdom
 */
/**
 * Button-VerticalListItem Property-Based Tests
 * 
 * Property-based tests using fast-check to verify universal properties
 * that should hold across all valid inputs for the Button-VerticalListItem component.
 * 
 * Properties covered:
 * - Property 1: Visual State Styling Consistency
 * - Property 2: Selection Indicator Visibility
 * - Property 11: Padding Compensation Correctness
 * - Property 17: Event Callback Invocation
 * 
 * Note: These tests verify structural properties (DOM structure, attributes, CSS classes)
 * rather than computed styles, as jsdom has limited CSS computation support for Shadow DOM.
 * Visual styling verification should be done via visual regression testing.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-VerticalListItem
 * Component Type: Primitive (foundational component)
 * 
 * @module Button-VerticalListItem/__tests__/ButtonVerticalListItem.properties
 * @see Requirements: 1.1-1.5, 2.1-2.2, 6.1-6.3, 12.1-12.3
 * @see .kiro/specs/038-vertical-list-buttons/design.md - Correctness Properties
 */

import * as fc from 'fast-check';
import {
  registerVerticalListButtonItem,
  createVerticalListButtonItem,
  cleanupVerticalListButtonItem,
  getShadowButton,
  getCheckmarkElement,
  hasClass,
  clickButton,
  focusButton,
  blurButton,
  cleanupRequiredTokens,
} from './test-utils';
import { VisualState, CheckmarkTransition } from '../types';
import { IconBaseName } from '../../Icon-Base/types';
import { 
  getVerticalListItemPaddingBlock,
  VerticalListItemPaddingBlockVariant 
} from '../buttonVerticalListItem.tokens';
import { requiresEmphasisBorder } from '../platforms/web/visualStateMapping';

// ============================================================================
// Test Data Generators
// ============================================================================

/**
 * All valid visual states for Button-VerticalListItem
 */
const allVisualStates: VisualState[] = ['rest', 'selected', 'notSelected', 'checked', 'unchecked'];

/**
 * Visual states that show the checkmark (selected or checked)
 */
const checkmarkVisibleStates: VisualState[] = ['selected', 'checked'];

/**
 * Visual states that hide the checkmark
 */
const checkmarkHiddenStates: VisualState[] = ['rest', 'notSelected', 'unchecked'];

/**
 * All valid checkmark transition types
 */
const allCheckmarkTransitions: CheckmarkTransition[] = ['fade', 'instant'];

/**
 * Sample icon names for testing
 */
const sampleIconNames: IconBaseName[] = [
  'settings', 'user', 'mail', 'calendar', 'check', 'heart', 'circle'
];

/**
 * Fast-check arbitrary for visual states
 */
const visualStateArbitrary = fc.constantFrom<VisualState>(...allVisualStates);

/**
 * Fast-check arbitrary for checkmark-visible states
 */
const checkmarkVisibleStateArbitrary = fc.constantFrom<VisualState>(...checkmarkVisibleStates);

/**
 * Fast-check arbitrary for checkmark-hidden states
 */
const checkmarkHiddenStateArbitrary = fc.constantFrom<VisualState>(...checkmarkHiddenStates);

/**
 * Fast-check arbitrary for checkmark transitions
 */
const checkmarkTransitionArbitrary = fc.constantFrom<CheckmarkTransition>(...allCheckmarkTransitions);

/**
 * Fast-check arbitrary for icon names
 */
const iconNameArbitrary = fc.constantFrom<IconBaseName>(...sampleIconNames);

/**
 * Fast-check arbitrary for safe label strings (alphanumeric + spaces)
 * Avoids special characters that could break HTML attribute parsing
 */
const labelArbitrary = fc.string({ minLength: 1, maxLength: 50 })
  .filter((s: string) => /^[a-zA-Z0-9 ]+$/.test(s) && s.trim().length > 0);

/**
 * Fast-check arbitrary for optional description strings
 */
const descriptionArbitrary = fc.option(
  fc.string({ minLength: 1, maxLength: 100 })
    .filter((s: string) => /^[a-zA-Z0-9 .,!?]+$/.test(s) && s.trim().length > 0),
  { nil: undefined }
);

/**
 * Fast-check arbitrary for error state boolean
 */
const errorArbitrary = fc.boolean();

/**
 * Fast-check arbitrary for transition delay (0-500ms)
 */
const transitionDelayArbitrary = fc.integer({ min: 0, max: 500 });

// ============================================================================
// Expected Mappings
// ============================================================================

/**
 * Expected CSS class for each visual state
 * @see Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 */
const expectedCssClasses: Record<VisualState, string> = {
  rest: 'vertical-list-item--rest',
  selected: 'vertical-list-item--selected',
  notSelected: 'vertical-list-item--not-selected',
  checked: 'vertical-list-item--checked',
  unchecked: 'vertical-list-item--unchecked',
};

/**
 * Expected padding values for padding compensation
 * @see Requirements 6.1, 6.2
 */
const expectedPaddingValues: Record<VerticalListItemPaddingBlockVariant, number> = {
  rest: 11,     // 1px border → 11px padding
  selected: 10, // 2px border → 10px padding
};

// ============================================================================
// Test Suite
// ============================================================================

describe('Button-VerticalListItem Property-Based Tests', () => {
  // Register component before all tests
  beforeAll(() => {
    registerVerticalListButtonItem();
  });
  
  // Clean up tokens after all tests
  afterAll(() => {
    cleanupRequiredTokens();
  });

  // ============================================================================
  // Property 1: Visual State Styling Consistency
  // ============================================================================
  
  describe('Property 1: Visual State Styling Consistency', () => {
    /**
     * Property 1: Visual State Styling Consistency
     * 
     * *For any* valid `visualState` value, the component SHALL render with the
     * correct background, border, and text colors as defined in the visual state mapping.
     * 
     * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
     * **Feature: 038-vertical-list-buttons, Property 1: Visual State Styling Consistency**
     */
    it('should apply correct CSS class for all visual states', async () => {
      await fc.assert(
        fc.asyncProperty(
          visualStateArbitrary,
          labelArbitrary,
          async (visualState, label) => {
            const button = await createVerticalListButtonItem({ label, visualState });
            
            try {
              // Verify the correct CSS class is applied for this visual state
              const expectedClass = expectedCssClasses[visualState];
              expect(hasClass(button, expectedClass)).toBe(true);
              
              // Verify other visual state classes are NOT applied
              const otherStates = allVisualStates.filter(s => s !== visualState);
              for (const otherState of otherStates) {
                const otherClass = expectedCssClasses[otherState];
                expect(hasClass(button, otherClass)).toBe(false);
              }
              
              return true;
            } finally {
              cleanupVerticalListButtonItem(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should apply error class when error is true for any visual state', async () => {
      await fc.assert(
        fc.asyncProperty(
          visualStateArbitrary,
          labelArbitrary,
          async (visualState, label) => {
            const button = await createVerticalListButtonItem({ 
              label, 
              visualState, 
              error: true 
            });
            
            try {
              // Verify error class is applied
              expect(hasClass(button, 'vertical-list-item--error')).toBe(true);
              
              // Verify base visual state class is still applied
              const expectedClass = expectedCssClasses[visualState];
              expect(hasClass(button, expectedClass)).toBe(true);
              
              return true;
            } finally {
              cleanupVerticalListButtonItem(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not apply error class when error is false', async () => {
      await fc.assert(
        fc.asyncProperty(
          visualStateArbitrary,
          labelArbitrary,
          async (visualState, label) => {
            const button = await createVerticalListButtonItem({ 
              label, 
              visualState, 
              error: false 
            });
            
            try {
              // Verify error class is NOT applied
              expect(hasClass(button, 'vertical-list-item--error')).toBe(false);
              
              return true;
            } finally {
              cleanupVerticalListButtonItem(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================================================
  // Property 2: Selection Indicator Visibility
  // ============================================================================
  
  describe('Property 2: Selection Indicator Visibility', () => {
    /**
     * Property 2: Selection Indicator Visibility
     * 
     * *For any* `visualState`, the Selection_Indicator (checkmark) SHALL be visible
     * if and only if the state is `selected` or `checked`.
     * 
     * **Validates: Requirements 2.1, 2.2**
     * **Feature: 038-vertical-list-buttons, Property 2: Selection Indicator Visibility**
     */
    it('should show checkmark for selected and checked states', async () => {
      await fc.assert(
        fc.asyncProperty(
          checkmarkVisibleStateArbitrary,
          labelArbitrary,
          async (visualState, label) => {
            const button = await createVerticalListButtonItem({ label, visualState });
            
            try {
              const checkmark = getCheckmarkElement(button);
              expect(checkmark).toBeTruthy();
              
              // Verify checkmark has visible class
              expect(checkmark?.classList.contains('vertical-list-item__checkmark--visible')).toBe(true);
              expect(checkmark?.classList.contains('vertical-list-item__checkmark--hidden')).toBe(false);
              
              return true;
            } finally {
              cleanupVerticalListButtonItem(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should hide checkmark for rest, notSelected, and unchecked states', async () => {
      await fc.assert(
        fc.asyncProperty(
          checkmarkHiddenStateArbitrary,
          labelArbitrary,
          async (visualState, label) => {
            const button = await createVerticalListButtonItem({ label, visualState });
            
            try {
              const checkmark = getCheckmarkElement(button);
              expect(checkmark).toBeTruthy();
              
              // Verify checkmark has hidden class
              expect(checkmark?.classList.contains('vertical-list-item__checkmark--hidden')).toBe(true);
              expect(checkmark?.classList.contains('vertical-list-item__checkmark--visible')).toBe(false);
              
              return true;
            } finally {
              cleanupVerticalListButtonItem(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should mark checkmark as decorative with aria-hidden', async () => {
      await fc.assert(
        fc.asyncProperty(
          visualStateArbitrary,
          labelArbitrary,
          async (visualState, label) => {
            const button = await createVerticalListButtonItem({ label, visualState });
            
            try {
              const checkmark = getCheckmarkElement(button);
              expect(checkmark).toBeTruthy();
              
              // Verify aria-hidden is set to true (decorative)
              expect(checkmark?.getAttribute('aria-hidden')).toBe('true');
              
              return true;
            } finally {
              cleanupVerticalListButtonItem(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================================================
  // Property 11: Padding Compensation Correctness
  // ============================================================================
  
  describe('Property 11: Padding Compensation Correctness', () => {
    /**
     * Property 11: Padding Compensation Correctness
     * 
     * *For any* visual state, the padding-block value SHALL be coordinated with
     * border-width such that:
     * - When `borderDefault` (1px): padding-block = 11px
     * - When `borderEmphasis` (2px): padding-block = 10px
     * 
     * This ensures the total height (border + padding + content) remains constant at 48px.
     * 
     * **Validates: Requirements 5.1, 6.1, 6.2, 6.3**
     * **Feature: 038-vertical-list-buttons, Property 11: Padding Compensation Correctness**
     */
    it('should use correct padding value based on border width for all visual states', async () => {
      await fc.assert(
        fc.asyncProperty(
          visualStateArbitrary,
          labelArbitrary,
          errorArbitrary,
          async (visualState, label, error) => {
            const button = await createVerticalListButtonItem({ label, visualState, error });
            
            try {
              const shadowButton = getShadowButton(button);
              expect(shadowButton).toBeTruthy();
              
              // Get the inline style which contains --vlbi-padding-block
              const style = shadowButton?.getAttribute('style') || '';
              
              // Determine expected padding based on whether emphasis border is needed
              // Note: Error state in Select mode also uses emphasis border
              const needsEmphasisBorder = requiresEmphasisBorder(visualState) || 
                (error && ['rest', 'selected', 'notSelected'].includes(visualState));
              
              const expectedVariant: VerticalListItemPaddingBlockVariant = 
                needsEmphasisBorder ? 'selected' : 'rest';
              const expectedPadding = expectedPaddingValues[expectedVariant];
              
              // Verify the padding value in the inline style
              expect(style).toContain(`--vlbi-padding-block: ${expectedPadding}px`);
              
              return true;
            } finally {
              cleanupVerticalListButtonItem(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return correct padding values from token function', async () => {
      await fc.assert(
        fc.asyncProperty(
          visualStateArbitrary,
          async (visualState) => {
            // Verify the token function returns expected values
            const needsEmphasisBorder = requiresEmphasisBorder(visualState);
            const variant: VerticalListItemPaddingBlockVariant = 
              needsEmphasisBorder ? 'selected' : 'rest';
            
            const paddingValue = getVerticalListItemPaddingBlock(variant);
            const expectedPadding = expectedPaddingValues[variant];
            
            expect(paddingValue).toBe(expectedPadding);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain height stability math: border + padding + content = 48px', async () => {
      await fc.assert(
        fc.asyncProperty(
          visualStateArbitrary,
          async (visualState) => {
            // Height stability math verification:
            // Total Height = (Border × 2) + (Padding × 2) + Content
            // Content height = 24px (typography.buttonMd line height)
            
            const needsEmphasisBorder = requiresEmphasisBorder(visualState);
            const borderWidth = needsEmphasisBorder ? 2 : 1;
            const variant: VerticalListItemPaddingBlockVariant = 
              needsEmphasisBorder ? 'selected' : 'rest';
            const paddingValue = getVerticalListItemPaddingBlock(variant);
            
            // Calculate total height
            const contentHeight = 24; // typography.buttonMd line height
            const totalHeight = (borderWidth * 2) + (paddingValue * 2) + contentHeight;
            
            // Verify total height is 48px
            expect(totalHeight).toBe(48);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ============================================================================
  // Property 17: Event Callback Invocation
  // ============================================================================
  
  describe('Property 17: Event Callback Invocation', () => {
    /**
     * Property 17: Event Callback Invocation
     * 
     * *For any* provided event callback (`onClick`, `onFocus`, `onBlur`), the component
     * SHALL invoke it when the corresponding user interaction occurs.
     * 
     * **Validates: Requirements 12.1, 12.2, 12.3**
     * **Feature: 038-vertical-list-buttons, Property 17: Event Callback Invocation**
     */
    it('should invoke onClick callback when clicked', async () => {
      await fc.assert(
        fc.asyncProperty(
          visualStateArbitrary,
          labelArbitrary,
          async (visualState, label) => {
            const onClickMock = jest.fn();
            const button = await createVerticalListButtonItem({ label, visualState });
            button.onClick = onClickMock;
            
            try {
              // Click the button
              clickButton(button);
              
              // Verify callback was invoked exactly once
              expect(onClickMock).toHaveBeenCalledTimes(1);
              
              return true;
            } finally {
              cleanupVerticalListButtonItem(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should invoke onFocus callback when focused', async () => {
      await fc.assert(
        fc.asyncProperty(
          visualStateArbitrary,
          labelArbitrary,
          async (visualState, label) => {
            const onFocusMock = jest.fn();
            const button = await createVerticalListButtonItem({ label, visualState });
            button.onFocus = onFocusMock;
            
            try {
              // Focus the button
              focusButton(button);
              
              // Verify callback was invoked exactly once
              expect(onFocusMock).toHaveBeenCalledTimes(1);
              
              return true;
            } finally {
              cleanupVerticalListButtonItem(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should invoke onBlur callback when blurred', async () => {
      await fc.assert(
        fc.asyncProperty(
          visualStateArbitrary,
          labelArbitrary,
          async (visualState, label) => {
            const onBlurMock = jest.fn();
            const button = await createVerticalListButtonItem({ label, visualState });
            button.onBlur = onBlurMock;
            
            try {
              // Focus then blur the button
              focusButton(button);
              blurButton(button);
              
              // Verify callback was invoked exactly once
              expect(onBlurMock).toHaveBeenCalledTimes(1);
              
              return true;
            } finally {
              cleanupVerticalListButtonItem(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not throw when callbacks are not provided', async () => {
      await fc.assert(
        fc.asyncProperty(
          visualStateArbitrary,
          labelArbitrary,
          async (visualState, label) => {
            const button = await createVerticalListButtonItem({ label, visualState });
            // Explicitly do NOT set any callbacks
            
            try {
              // Should not throw when interacting without callbacks
              expect(() => {
                clickButton(button);
                focusButton(button);
                blurButton(button);
              }).not.toThrow();
              
              return true;
            } finally {
              cleanupVerticalListButtonItem(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should invoke multiple callbacks independently', async () => {
      await fc.assert(
        fc.asyncProperty(
          visualStateArbitrary,
          labelArbitrary,
          async (visualState, label) => {
            const onClickMock = jest.fn();
            const onFocusMock = jest.fn();
            const onBlurMock = jest.fn();
            
            const button = await createVerticalListButtonItem({ label, visualState });
            button.onClick = onClickMock;
            button.onFocus = onFocusMock;
            button.onBlur = onBlurMock;
            
            try {
              // Perform all interactions
              focusButton(button);
              clickButton(button);
              blurButton(button);
              
              // Verify each callback was invoked independently
              expect(onClickMock).toHaveBeenCalledTimes(1);
              expect(onFocusMock).toHaveBeenCalledTimes(1);
              expect(onBlurMock).toHaveBeenCalledTimes(1);
              
              return true;
            } finally {
              cleanupVerticalListButtonItem(button);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
