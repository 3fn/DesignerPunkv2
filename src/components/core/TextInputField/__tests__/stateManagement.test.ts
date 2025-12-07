/**
 * State Management Tests
 * 
 * Tests for TextInputField state machine logic, label positioning,
 * and icon visibility calculations.
 */

import {
  calculateLabelPosition,
  calculateIconVisibility,
  createInitialState,
  handleFocus,
  handleBlur,
  handleValueChange,
  handleValidationChange,
  createInitialAnimationState,
  startLabelAnimation,
  updateAnimationProgress,
  completeLabelAnimation
} from '../stateManagement';
import { TextInputFieldState, TextInputFieldProps, LabelAnimationState } from '../types';

describe('State Management', () => {
  describe('calculateLabelPosition', () => {
    it('should return inside position for empty, unfocused input', () => {
      const state: TextInputFieldState = {
        isFocused: false,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: false
      };

      const result = calculateLabelPosition(state);

      expect(result.isFloated).toBe(false);
      expect(result.fontSize).toBe('typography.labelMd');
      expect(result.color).toBe('color.text.muted');
      expect(result.position).toBe('inside');
    });

    it('should return floated position when input is focused', () => {
      const state: TextInputFieldState = {
        isFocused: true,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      const result = calculateLabelPosition(state);

      expect(result.isFloated).toBe(true);
      expect(result.fontSize).toBe('typography.labelMdFloat');
      expect(result.color).toBe('color.primary');
      expect(result.position).toBe('above');
    });

    it('should return floated position when input is filled', () => {
      const state: TextInputFieldState = {
        isFocused: false,
        isFilled: true,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      const result = calculateLabelPosition(state);

      expect(result.isFloated).toBe(true);
      expect(result.fontSize).toBe('typography.labelMdFloat');
      expect(result.color).toBe('color.text.muted');
      expect(result.position).toBe('above');
    });

    it('should use error color when in error state', () => {
      const state: TextInputFieldState = {
        isFocused: true,
        isFilled: false,
        hasError: true,
        isSuccess: false,
        isLabelFloated: true
      };

      const result = calculateLabelPosition(state);

      expect(result.color).toBe('color.error');
    });

    it('should use success color when in success state', () => {
      const state: TextInputFieldState = {
        isFocused: false,
        isFilled: true,
        hasError: false,
        isSuccess: true,
        isLabelFloated: true
      };

      const result = calculateLabelPosition(state);

      expect(result.color).toBe('color.success');
    });

    it('should prioritize error color over success color', () => {
      const state: TextInputFieldState = {
        isFocused: false,
        isFilled: true,
        hasError: true,
        isSuccess: true,
        isLabelFloated: true
      };

      const result = calculateLabelPosition(state);

      expect(result.color).toBe('color.error');
    });

    it('should prioritize error color over focused color', () => {
      const state: TextInputFieldState = {
        isFocused: true,
        isFilled: false,
        hasError: true,
        isSuccess: false,
        isLabelFloated: true
      };

      const result = calculateLabelPosition(state);

      expect(result.color).toBe('color.error');
    });
  });

  describe('calculateIconVisibility', () => {
    it('should hide all icons when label is not floated', () => {
      const state: TextInputFieldState = {
        isFocused: false,
        isFilled: false,
        hasError: true,
        isSuccess: false,
        isLabelFloated: false,
        showInfoIcon: true
      };

      const animationState: LabelAnimationState = {
        isAnimating: false,
        direction: 'up',
        progress: 1.0
      };

      const result = calculateIconVisibility(state, animationState);

      expect(result.showErrorIcon).toBe(false);
      expect(result.showSuccessIcon).toBe(false);
      expect(result.showInfoIcon).toBe(false);
    });

    it('should hide all icons when animation is in progress', () => {
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

      const result = calculateIconVisibility(state, animationState);

      expect(result.showErrorIcon).toBe(false);
      expect(result.showSuccessIcon).toBe(false);
      expect(result.showInfoIcon).toBe(false);
    });

    it('should show error icon when label floated and animation complete', () => {
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

      const result = calculateIconVisibility(state, animationState);

      expect(result.showErrorIcon).toBe(true);
      expect(result.showSuccessIcon).toBe(false);
      expect(result.showInfoIcon).toBe(false);
    });

    it('should show success icon when label floated and animation complete', () => {
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

      const result = calculateIconVisibility(state, animationState);

      expect(result.showErrorIcon).toBe(false);
      expect(result.showSuccessIcon).toBe(true);
      expect(result.showInfoIcon).toBe(false);
    });

    it('should show info icon when focused and animation complete', () => {
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

      const result = calculateIconVisibility(state, animationState);

      expect(result.showErrorIcon).toBe(false);
      expect(result.showSuccessIcon).toBe(false);
      expect(result.showInfoIcon).toBe(true);
    });

    it('should show info icon when filled and animation complete', () => {
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

      const result = calculateIconVisibility(state, animationState);

      expect(result.showErrorIcon).toBe(false);
      expect(result.showSuccessIcon).toBe(false);
      expect(result.showInfoIcon).toBe(true);
    });

    it('should not show info icon when not focused or filled', () => {
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

      const result = calculateIconVisibility(state, animationState);

      expect(result.showInfoIcon).toBe(false);
    });
  });

  describe('createInitialState', () => {
    it('should create initial state for empty input', () => {
      const props: TextInputFieldProps = {
        id: 'test',
        label: 'Test Label',
        value: '',
        onChange: jest.fn()
      };

      const state = createInitialState(props);

      expect(state.isFocused).toBe(false);
      expect(state.isFilled).toBe(false);
      expect(state.hasError).toBe(false);
      expect(state.isSuccess).toBe(false);
      expect(state.isLabelFloated).toBe(false);
    });

    it('should create initial state for filled input', () => {
      const props: TextInputFieldProps = {
        id: 'test',
        label: 'Test Label',
        value: 'test value',
        onChange: jest.fn()
      };

      const state = createInitialState(props);

      expect(state.isFocused).toBe(false);
      expect(state.isFilled).toBe(true);
      expect(state.isLabelFloated).toBe(true);
    });

    it('should create initial state with error', () => {
      const props: TextInputFieldProps = {
        id: 'test',
        label: 'Test Label',
        value: '',
        onChange: jest.fn(),
        errorMessage: 'Error message'
      };

      const state = createInitialState(props);

      expect(state.hasError).toBe(true);
    });

    it('should create initial state with success', () => {
      const props: TextInputFieldProps = {
        id: 'test',
        label: 'Test Label',
        value: 'test',
        onChange: jest.fn(),
        isSuccess: true
      };

      const state = createInitialState(props);

      expect(state.isSuccess).toBe(true);
    });

    it('should create initial state with info icon', () => {
      const props: TextInputFieldProps = {
        id: 'test',
        label: 'Test Label',
        value: '',
        onChange: jest.fn(),
        showInfoIcon: true
      };

      const state = createInitialState(props);

      expect(state.showInfoIcon).toBe(true);
    });
  });

  describe('handleFocus', () => {
    it('should set focused state and float label', () => {
      const currentState: TextInputFieldState = {
        isFocused: false,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: false
      };

      const newState = handleFocus(currentState);

      expect(newState.isFocused).toBe(true);
      expect(newState.isLabelFloated).toBe(true);
    });

    it('should preserve other state properties', () => {
      const currentState: TextInputFieldState = {
        isFocused: false,
        isFilled: true,
        hasError: true,
        isSuccess: false,
        isLabelFloated: true
      };

      const newState = handleFocus(currentState);

      expect(newState.isFilled).toBe(true);
      expect(newState.hasError).toBe(true);
      expect(newState.isSuccess).toBe(false);
    });
  });

  describe('handleBlur', () => {
    it('should clear focused state and return label for empty input', () => {
      const currentState: TextInputFieldState = {
        isFocused: true,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      const newState = handleBlur(currentState);

      expect(newState.isFocused).toBe(false);
      expect(newState.isLabelFloated).toBe(false);
    });

    it('should clear focused state but keep label floated for filled input', () => {
      const currentState: TextInputFieldState = {
        isFocused: true,
        isFilled: true,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      const newState = handleBlur(currentState);

      expect(newState.isFocused).toBe(false);
      expect(newState.isLabelFloated).toBe(true);
    });
  });

  describe('handleValueChange', () => {
    it('should set filled state when value is added', () => {
      const currentState: TextInputFieldState = {
        isFocused: true,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      const newState = handleValueChange(currentState, 'test');

      expect(newState.isFilled).toBe(true);
      expect(newState.isLabelFloated).toBe(true);
    });

    it('should clear filled state when value is removed', () => {
      const currentState: TextInputFieldState = {
        isFocused: true,
        isFilled: true,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      const newState = handleValueChange(currentState, '');

      expect(newState.isFilled).toBe(false);
      expect(newState.isLabelFloated).toBe(true); // Still floated because focused
    });

    it('should keep label floated when unfocused but filled', () => {
      const currentState: TextInputFieldState = {
        isFocused: false,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: false
      };

      const newState = handleValueChange(currentState, 'test');

      expect(newState.isFilled).toBe(true);
      expect(newState.isLabelFloated).toBe(true);
    });
  });

  describe('handleValidationChange', () => {
    it('should set error state', () => {
      const currentState: TextInputFieldState = {
        isFocused: false,
        isFilled: true,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      const newState = handleValidationChange(currentState, 'Error message');

      expect(newState.hasError).toBe(true);
      expect(newState.isSuccess).toBe(false);
    });

    it('should set success state', () => {
      const currentState: TextInputFieldState = {
        isFocused: false,
        isFilled: true,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      const newState = handleValidationChange(currentState, undefined, true);

      expect(newState.hasError).toBe(false);
      expect(newState.isSuccess).toBe(true);
    });

    it('should clear validation states', () => {
      const currentState: TextInputFieldState = {
        isFocused: false,
        isFilled: true,
        hasError: true,
        isSuccess: false,
        isLabelFloated: true
      };

      const newState = handleValidationChange(currentState);

      expect(newState.hasError).toBe(false);
      expect(newState.isSuccess).toBe(false);
    });
  });

  describe('Animation State Management', () => {
    describe('createInitialAnimationState', () => {
      it('should create initial animation state with no animation', () => {
        const state = createInitialAnimationState();

        expect(state.isAnimating).toBe(false);
        expect(state.direction).toBe('up');
        expect(state.progress).toBe(1.0);
      });
    });

    describe('startLabelAnimation', () => {
      it('should start animation in up direction', () => {
        const state = startLabelAnimation('up');

        expect(state.isAnimating).toBe(true);
        expect(state.direction).toBe('up');
        expect(state.progress).toBe(0.0);
      });

      it('should start animation in down direction', () => {
        const state = startLabelAnimation('down');

        expect(state.isAnimating).toBe(true);
        expect(state.direction).toBe('down');
        expect(state.progress).toBe(0.0);
      });
    });

    describe('updateAnimationProgress', () => {
      it('should update animation progress', () => {
        const currentState: LabelAnimationState = {
          isAnimating: true,
          direction: 'up',
          progress: 0.0
        };

        const newState = updateAnimationProgress(currentState, 0.5);

        expect(newState.progress).toBe(0.5);
        expect(newState.isAnimating).toBe(true);
      });

      it('should clamp progress to 0-1 range (lower bound)', () => {
        const currentState: LabelAnimationState = {
          isAnimating: true,
          direction: 'up',
          progress: 0.5
        };

        const newState = updateAnimationProgress(currentState, -0.5);

        expect(newState.progress).toBe(0.0);
      });

      it('should clamp progress to 0-1 range (upper bound)', () => {
        const currentState: LabelAnimationState = {
          isAnimating: true,
          direction: 'up',
          progress: 0.5
        };

        const newState = updateAnimationProgress(currentState, 1.5);

        expect(newState.progress).toBe(1.0);
      });
    });

    describe('completeLabelAnimation', () => {
      it('should mark animation as complete', () => {
        const currentState: LabelAnimationState = {
          isAnimating: true,
          direction: 'up',
          progress: 0.8
        };

        const newState = completeLabelAnimation(currentState);

        expect(newState.isAnimating).toBe(false);
        expect(newState.progress).toBe(1.0);
      });
    });
  });

  describe('State Machine Transitions', () => {
    it('should transition from Empty, Not Focused to Empty, Focused', () => {
      let state: TextInputFieldState = {
        isFocused: false,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: false
      };

      state = handleFocus(state);

      expect(state.isFocused).toBe(true);
      expect(state.isFilled).toBe(false);
      expect(state.isLabelFloated).toBe(true);
    });

    it('should maintain error state across focus transitions', () => {
      // Start with error state, not focused
      let state: TextInputFieldState = {
        isFocused: false,
        isFilled: true,
        hasError: true,
        isSuccess: false,
        isLabelFloated: true
      };

      // Focus the input - error state should persist
      state = handleFocus(state);
      expect(state.hasError).toBe(true);
      expect(state.isFocused).toBe(true);

      // Blur the input - error state should still persist
      state = handleBlur(state);
      expect(state.hasError).toBe(true);
      expect(state.isFocused).toBe(false);
    });

    it('should maintain error state across value changes', () => {
      // Start with error state
      let state: TextInputFieldState = {
        isFocused: true,
        isFilled: false,
        hasError: true,
        isSuccess: false,
        isLabelFloated: true
      };

      // Change value - error state should persist
      state = handleValueChange(state, 'new value');
      expect(state.hasError).toBe(true);
      expect(state.isFilled).toBe(true);

      // Clear value - error state should still persist
      state = handleValueChange(state, '');
      expect(state.hasError).toBe(true);
      expect(state.isFilled).toBe(false);
    });

    it('should transition from Empty, Focused to Empty, Not Focused', () => {
      let state: TextInputFieldState = {
        isFocused: true,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      state = handleBlur(state);

      expect(state.isFocused).toBe(false);
      expect(state.isFilled).toBe(false);
      expect(state.isLabelFloated).toBe(false);
    });

    it('should transition from Empty, Focused to Filled, Focused', () => {
      let state: TextInputFieldState = {
        isFocused: true,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      state = handleValueChange(state, 'test');

      expect(state.isFocused).toBe(true);
      expect(state.isFilled).toBe(true);
      expect(state.isLabelFloated).toBe(true);
    });

    it('should transition from Filled, Focused to Filled, Not Focused', () => {
      let state: TextInputFieldState = {
        isFocused: true,
        isFilled: true,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      state = handleBlur(state);

      expect(state.isFocused).toBe(false);
      expect(state.isFilled).toBe(true);
      expect(state.isLabelFloated).toBe(true);
    });

    it('should transition from Filled, Not Focused to Filled, Focused', () => {
      let state: TextInputFieldState = {
        isFocused: false,
        isFilled: true,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      state = handleFocus(state);

      expect(state.isFocused).toBe(true);
      expect(state.isFilled).toBe(true);
      expect(state.isLabelFloated).toBe(true);
    });

    it('should transition to Error state from any state', () => {
      let state: TextInputFieldState = {
        isFocused: false,
        isFilled: true,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      state = handleValidationChange(state, 'Error message');

      expect(state.hasError).toBe(true);
      expect(state.isSuccess).toBe(false);
    });

    it('should transition to Success state from any state', () => {
      let state: TextInputFieldState = {
        isFocused: false,
        isFilled: true,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      state = handleValidationChange(state, undefined, true);

      expect(state.hasError).toBe(false);
      expect(state.isSuccess).toBe(true);
    });
  });
});
