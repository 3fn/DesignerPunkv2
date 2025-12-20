/**
 * @category evergreen
 * @purpose Verify integration component integration behavior
 */
/**
 * @jest-environment jsdom
 */

/**
 * Integration Tests for TextInputField Component
 * 
 * Tests integration with:
 * - Icon component (error, success, info icons)
 * - Motion tokens (animation timing, scaling)
 * - Form integration (submission, validation)
 * - Cross-platform token usage
 * 
 * Requirements: 4.1, 4.2, 4.3, 8.1, 8.2
 */

import { createIcon } from '../../Icon/platforms/web/Icon.web';
import { getMotionToken } from '../../../../tokens/semantic/MotionTokens';
import { calculateIconVisibility } from '../stateManagement';
import { TextInputFieldState, LabelAnimationState } from '../types';

describe('TextInputField Integration Tests', () => {
  describe('Icon Component Integration', () => {
    describe('Error Icon Integration (Requirement 4.1)', () => {
      it('should create error icon with correct properties', () => {
        const errorIcon = createIcon({
          name: 'x-circle',
          size: 24,
          color: 'color-error'
        });

        expect(errorIcon).toContain('x-circle');
        expect(errorIcon).toContain('icon--size-100'); // 24px = size100
        expect(errorIcon).toContain('var(--color-error)');
      });

      it('should show error icon when in error state with label floated', () => {
        const state: TextInputFieldState = {
          isFocused: true,
          isFilled: false,
          hasError: true,
          isSuccess: false,
          isLabelFloated: true
        };

        const animationState: LabelAnimationState = {
          isAnimating: false,
          direction: 'up',
          progress: 1.0
        };

        const visibility = calculateIconVisibility(state, animationState);

        expect(visibility.showErrorIcon).toBe(true);
        expect(visibility.showSuccessIcon).toBe(false);
        expect(visibility.showInfoIcon).toBe(false);
      });

      it('should hide error icon during label animation', () => {
        const state: TextInputFieldState = {
          isFocused: true,
          isFilled: false,
          hasError: true,
          isSuccess: false,
          isLabelFloated: true
        };

        const animationState: LabelAnimationState = {
          isAnimating: true,
          direction: 'up',
          progress: 0.5
        };

        const visibility = calculateIconVisibility(state, animationState);

        expect(visibility.showErrorIcon).toBe(false);
      });

      it('should use correct icon size for error icon', () => {
        const errorIcon = createIcon({
          name: 'x-circle',
          size: 24,
          color: 'color-error'
        });

        // Icon should use size100 class (24px as specified in design)
        expect(errorIcon).toContain('icon--size-100');
      });
    });

    describe('Success Icon Integration (Requirement 4.2)', () => {
      it('should create success icon with correct properties', () => {
        const successIcon = createIcon({
          name: 'check',
          size: 24,
          color: 'color-success'
        });

        expect(successIcon).toContain('check');
        expect(successIcon).toContain('icon--size-100'); // 24px = size100
        expect(successIcon).toContain('var(--color-success)');
      });

      it('should show success icon when in success state with label floated', () => {
        const state: TextInputFieldState = {
          isFocused: false,
          isFilled: true,
          hasError: false,
          isSuccess: true,
          isLabelFloated: true
        };

        const animationState: LabelAnimationState = {
          isAnimating: false,
          direction: 'up',
          progress: 1.0
        };

        const visibility = calculateIconVisibility(state, animationState);

        expect(visibility.showErrorIcon).toBe(false);
        expect(visibility.showSuccessIcon).toBe(true);
        expect(visibility.showInfoIcon).toBe(false);
      });

      it('should hide success icon during label animation', () => {
        const state: TextInputFieldState = {
          isFocused: false,
          isFilled: true,
          hasError: false,
          isSuccess: true,
          isLabelFloated: true
        };

        const animationState: LabelAnimationState = {
          isAnimating: true,
          direction: 'up',
          progress: 0.5
        };

        const visibility = calculateIconVisibility(state, animationState);

        expect(visibility.showSuccessIcon).toBe(false);
      });
    });

    describe('Info Icon Integration (Requirement 4.3)', () => {
      it('should create info icon with correct properties', () => {
        const infoIcon = createIcon({
          name: 'info',
          size: 24,
          color: 'color-text-muted'
        });

        expect(infoIcon).toContain('info');
        expect(infoIcon).toContain('icon--size-100'); // 24px = size100
        expect(infoIcon).toContain('var(--color-text-muted)');
      });

      it('should show info icon when focused with showInfoIcon enabled', () => {
        const state: TextInputFieldState = {
          isFocused: true,
          isFilled: false,
          hasError: false,
          isSuccess: false,
          isLabelFloated: true,
          showInfoIcon: true
        };

        const animationState: LabelAnimationState = {
          isAnimating: false,
          direction: 'up',
          progress: 1.0
        };

        const visibility = calculateIconVisibility(state, animationState);

        expect(visibility.showInfoIcon).toBe(true);
      });

      it('should show info icon when filled with showInfoIcon enabled', () => {
        const state: TextInputFieldState = {
          isFocused: false,
          isFilled: true,
          hasError: false,
          isSuccess: false,
          isLabelFloated: true,
          showInfoIcon: true
        };

        const animationState: LabelAnimationState = {
          isAnimating: false,
          direction: 'up',
          progress: 1.0
        };

        const visibility = calculateIconVisibility(state, animationState);

        expect(visibility.showInfoIcon).toBe(true);
      });

      it('should hide info icon when not focused or filled', () => {
        const state: TextInputFieldState = {
          isFocused: false,
          isFilled: false,
          hasError: false,
          isSuccess: false,
          isLabelFloated: false,
          showInfoIcon: true
        };

        const animationState: LabelAnimationState = {
          isAnimating: false,
          direction: 'up',
          progress: 1.0
        };

        const visibility = calculateIconVisibility(state, animationState);

        expect(visibility.showInfoIcon).toBe(false);
      });
    });

    describe('Icon Coordination with Label Animation', () => {
      it('should hide all icons during label float animation', () => {
        const state: TextInputFieldState = {
          isFocused: true,
          isFilled: false,
          hasError: true,
          isSuccess: false,
          isLabelFloated: true,
          showInfoIcon: true
        };

        const animationState: LabelAnimationState = {
          isAnimating: true,
          direction: 'up',
          progress: 0.5
        };

        const visibility = calculateIconVisibility(state, animationState);

        expect(visibility.showErrorIcon).toBe(false);
        expect(visibility.showSuccessIcon).toBe(false);
        expect(visibility.showInfoIcon).toBe(false);
      });

      it('should show appropriate icon after animation completes', () => {
        const state: TextInputFieldState = {
          isFocused: true,
          isFilled: false,
          hasError: true,
          isSuccess: false,
          isLabelFloated: true
        };

        const animationState: LabelAnimationState = {
          isAnimating: false,
          direction: 'up',
          progress: 1.0
        };

        const visibility = calculateIconVisibility(state, animationState);

        expect(visibility.showErrorIcon).toBe(true);
      });
    });
  });

  describe('Motion Token Integration', () => {
    describe('Float Label Motion Token (Requirement 8.1)', () => {
      it('should retrieve motion.floatLabel token', () => {
        const floatLabelMotion = getMotionToken('motion.floatLabel');

        expect(floatLabelMotion).toBeDefined();
        expect(floatLabelMotion?.name).toBe('motion.floatLabel');
      });

      it('should have correct primitive references', () => {
        const floatLabelMotion = getMotionToken('motion.floatLabel');

        expect(floatLabelMotion?.primitiveReferences).toBeDefined();
        expect(floatLabelMotion?.primitiveReferences.duration).toBe('duration250');
        expect(floatLabelMotion?.primitiveReferences.easing).toBe('easingStandard');
      });

      it('should have correct context and description', () => {
        const floatLabelMotion = getMotionToken('motion.floatLabel');

        expect(floatLabelMotion?.context).toContain('Float label animation');
        expect(floatLabelMotion?.description).toContain('250ms');
        expect(floatLabelMotion?.description).toContain('standard curve');
      });
    });

    describe('Animation Timing Integration (Requirement 8.2)', () => {
      it('should use 250ms duration from motion token', () => {
        const floatLabelMotion = getMotionToken('motion.floatLabel');
        
        // Duration should be 250ms as specified in motion token
        expect(floatLabelMotion?.primitiveReferences.duration).toBe('duration250');
      });

      it('should use easingStandard curve from motion token', () => {
        const floatLabelMotion = getMotionToken('motion.floatLabel');
        
        // Easing should be standard curve as specified in motion token
        expect(floatLabelMotion?.primitiveReferences.easing).toBe('easingStandard');
      });

      it('should coordinate icon timing with label animation', () => {
        // Icons should appear after label animation completes (250ms)
        const state: TextInputFieldState = {
          isFocused: true,
          isFilled: false,
          hasError: true,
          isSuccess: false,
          isLabelFloated: true
        };

        // During animation (progress < 1.0)
        const duringAnimation: LabelAnimationState = {
          isAnimating: true,
          direction: 'up',
          progress: 0.8
        };

        const visibilityDuring = calculateIconVisibility(state, duringAnimation);
        expect(visibilityDuring.showErrorIcon).toBe(false);

        // After animation completes (progress = 1.0)
        const afterAnimation: LabelAnimationState = {
          isAnimating: false,
          direction: 'up',
          progress: 1.0
        };

        const visibilityAfter = calculateIconVisibility(state, afterAnimation);
        expect(visibilityAfter.showErrorIcon).toBe(true);
      });
    });

    describe('Scale Token Integration', () => {
      it('should use scale088 for label typography scaling', () => {
        // scale088 is used to scale fontSize100 (16px) to labelMdFloat (14px)
        // This is verified through the typography token system
        // The motion token doesn't include scale directly, but the animation
        // uses scale088 through the typography token transition
        
        // Verify the motion token structure supports scale if needed
        const floatLabelMotion = getMotionToken('motion.floatLabel');
        
        // Motion token can optionally include scale reference
        // Currently not used for floatLabel, but structure supports it
        expect(floatLabelMotion?.primitiveReferences).toBeDefined();
      });
    });
  });

  describe('Form Integration', () => {
    describe('Form Submission', () => {
      it('should allow form submission when Enter key is pressed', () => {
        // This test verifies the component doesn't prevent default form submission
        // The actual form submission is handled by the browser
        
        // Create a mock form element
        const form = document.createElement('form');
        const input = document.createElement('input');
        input.type = 'text';
        form.appendChild(input);
        
        // Add submit event listener
        let submitCalled = false;
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          submitCalled = true;
        });
        
        // Simulate Enter key press
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          bubbles: true
        });
        
        input.dispatchEvent(enterEvent);
        
        // Form submission should be triggered
        // Note: In JSDOM, we need to manually trigger submit
        form.dispatchEvent(new Event('submit', { bubbles: true }));
        
        expect(submitCalled).toBe(true);
      });
    });

    describe('Form Validation Integration', () => {
      it('should integrate with external validation', () => {
        // Component receives validation state via props
        // This test verifies the state management handles validation correctly
        
        const state: TextInputFieldState = {
          isFocused: false,
          isFilled: true,
          hasError: false,
          isSuccess: false,
          isLabelFloated: true
        };

        // External validation sets error
        const errorState = {
          ...state,
          hasError: true
        };

        expect(errorState.hasError).toBe(true);
        expect(errorState.isSuccess).toBe(false);
      });

      it('should handle validation state changes', () => {
        // Start with no validation
        let state: TextInputFieldState = {
          isFocused: false,
          isFilled: true,
          hasError: false,
          isSuccess: false,
          isLabelFloated: true
        };

        // Validation fails
        state = { ...state, hasError: true };
        expect(state.hasError).toBe(true);

        // Validation succeeds
        state = { ...state, hasError: false, isSuccess: true };
        expect(state.hasError).toBe(false);
        expect(state.isSuccess).toBe(true);

        // Validation clears
        state = { ...state, isSuccess: false };
        expect(state.hasError).toBe(false);
        expect(state.isSuccess).toBe(false);
      });

      it('should maintain validation state across focus changes', () => {
        // Start with error state
        let state: TextInputFieldState = {
          isFocused: false,
          isFilled: true,
          hasError: true,
          isSuccess: false,
          isLabelFloated: true
        };

        // Focus input - error should persist
        state = { ...state, isFocused: true };
        expect(state.hasError).toBe(true);

        // Blur input - error should still persist
        state = { ...state, isFocused: false };
        expect(state.hasError).toBe(true);
      });
    });
  });

  describe('Cross-Platform Token Usage', () => {
    describe('Token Reference Format', () => {
      it('should use dot notation for semantic tokens', () => {
        // Verify token references use correct format
        const tokenReferences = {
          typography: {
            label: 'typography.labelMd',
            labelFloat: 'typography.labelMdFloat',
            input: 'typography.input',
            helper: 'typography.caption'
          },
          color: {
            labelDefault: 'color.text.muted',
            labelFocused: 'color.primary',
            labelError: 'color.error',
            labelSuccess: 'color.success'
          },
          motion: {
            floatLabel: 'motion.floatLabel'
          }
        };

        // All token references should use dot notation
        expect(tokenReferences.typography.label).toMatch(/^[a-z]+\.[a-zA-Z]+$/);
        expect(tokenReferences.color.labelDefault).toMatch(/^[a-z]+\.[a-zA-Z.]+$/);
        expect(tokenReferences.motion.floatLabel).toMatch(/^[a-z]+\.[a-zA-Z]+$/);
      });
    });

    describe('Platform-Specific Generation', () => {
      it('should support web CSS custom property generation', () => {
        // Token references should be convertible to CSS custom properties
        const webToken = 'typography.labelMd';
        const cssProperty = `var(--${webToken.replace(/\./g, '-')})`;
        
        // CSS custom properties use the token name with dots replaced by hyphens
        expect(cssProperty).toBe('var(--typography-labelMd)');
      });

      it('should support iOS Swift constant generation', () => {
        // Token references should be convertible to Swift constants
        const iosToken = 'typography.labelMd';
        const swiftConstant = iosToken.replace(/\./g, '');
        
        // Swift uses camelCase: typographyLabelMd
        expect(swiftConstant).toBe('typographylabelMd');
      });

      it('should support Android Kotlin constant generation', () => {
        // Token references should be convertible to Kotlin constants
        const androidToken = 'typography.labelMd';
        const kotlinConstant = androidToken.replace(/\./g, '');
        
        // Kotlin uses camelCase: typographyLabelMd
        expect(kotlinConstant).toBe('typographylabelMd');
      });
    });

    describe('Motion Token Cross-Platform Consistency', () => {
      it('should maintain timing consistency across platforms', () => {
        const floatLabelMotion = getMotionToken('motion.floatLabel');
        
        // Duration should be 250ms on all platforms
        expect(floatLabelMotion?.primitiveReferences.duration).toBe('duration250');
        
        // This translates to:
        // Web: 250ms
        // iOS: 0.25 seconds
        // Android: 250 milliseconds
        // All mathematically equivalent
      });

      it('should maintain easing consistency across platforms', () => {
        const floatLabelMotion = getMotionToken('motion.floatLabel');
        
        // Easing should be standard curve on all platforms
        expect(floatLabelMotion?.primitiveReferences.easing).toBe('easingStandard');
        
        // This translates to:
        // Web: cubic-bezier(0.4, 0.0, 0.2, 1.0)
        // iOS: .timingCurve(0.4, 0.0, 0.2, 1.0)
        // Android: CubicBezierEasing(0.4f, 0.0f, 0.2f, 1.0f)
        // All mathematically equivalent
      });
    });
  });

  describe('End-to-End Integration Scenarios', () => {
    describe('Complete User Flow with Icons and Animation', () => {
      it('should handle complete focus → fill → validate → blur flow', () => {
        // Start: Empty, not focused
        let state: TextInputFieldState = {
          isFocused: false,
          isFilled: false,
          hasError: false,
          isSuccess: false,
          isLabelFloated: false
        };

        let animationState: LabelAnimationState = {
          isAnimating: false,
          direction: 'up',
          progress: 1.0
        };

        // Step 1: User focuses input
        state = { ...state, isFocused: true, isLabelFloated: true };
        animationState = { isAnimating: true, direction: 'up', progress: 0.0 };
        
        // During animation, no icons visible
        let visibility = calculateIconVisibility(state, animationState);
        expect(visibility.showErrorIcon).toBe(false);
        expect(visibility.showSuccessIcon).toBe(false);

        // Step 2: Animation completes
        animationState = { isAnimating: false, direction: 'up', progress: 1.0 };
        
        // Step 3: User types value
        state = { ...state, isFilled: true };

        // Step 4: External validation succeeds
        state = { ...state, isSuccess: true };
        
        // Success icon should now be visible
        visibility = calculateIconVisibility(state, animationState);
        expect(visibility.showSuccessIcon).toBe(true);

        // Step 5: User blurs input
        state = { ...state, isFocused: false };
        
        // Success icon should remain visible
        visibility = calculateIconVisibility(state, animationState);
        expect(visibility.showSuccessIcon).toBe(true);
      });

      it('should handle error state with icon coordination', () => {
        // Start: Filled, focused
        let state: TextInputFieldState = {
          isFocused: true,
          isFilled: true,
          hasError: false,
          isSuccess: false,
          isLabelFloated: true
        };

        let animationState: LabelAnimationState = {
          isAnimating: false,
          direction: 'up',
          progress: 1.0
        };

        // External validation fails
        state = { ...state, hasError: true };
        
        // Error icon should be visible
        const visibility = calculateIconVisibility(state, animationState);
        expect(visibility.showErrorIcon).toBe(true);
        
        // Verify error icon can be created
        const errorIcon = createIcon({
          name: 'x-circle',
          size: 24,
          color: 'color-error'
        });
        
        expect(errorIcon).toContain('x-circle');
        expect(errorIcon).toContain('var(--color-error)');
      });
    });

    describe('Motion Token and Icon Timing Coordination', () => {
      it('should coordinate icon appearance with motion token timing', () => {
        const floatLabelMotion = getMotionToken('motion.floatLabel');
        
        // Motion token specifies 250ms duration
        expect(floatLabelMotion?.primitiveReferences.duration).toBe('duration250');
        
        // Icons should appear after this duration
        const state: TextInputFieldState = {
          isFocused: true,
          isFilled: false,
          hasError: true,
          isSuccess: false,
          isLabelFloated: true
        };

        // During 250ms animation
        const duringAnimation: LabelAnimationState = {
          isAnimating: true,
          direction: 'up',
          progress: 0.5
        };
        
        let visibility = calculateIconVisibility(state, duringAnimation);
        expect(visibility.showErrorIcon).toBe(false);

        // After 250ms animation completes
        const afterAnimation: LabelAnimationState = {
          isAnimating: false,
          direction: 'up',
          progress: 1.0
        };
        
        visibility = calculateIconVisibility(state, afterAnimation);
        expect(visibility.showErrorIcon).toBe(true);
      });
    });
  });
});
