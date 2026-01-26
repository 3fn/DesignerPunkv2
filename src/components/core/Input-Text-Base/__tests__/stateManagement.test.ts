/**
 * @category evergreen
 * @purpose Verify stateManagement component renders correctly and behaves as expected
 */
/**
 * State Management Tests
 * 
 * Tests for Input-Text-Base state machine logic, label positioning,
 * and icon visibility calculations.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Primitive (Base)
 * 
 * Note: Animation timing coordination is now handled by CSS transition-delay
 * on the icon container. The calculateIconVisibility function no longer requires
 * an animationState parameter - it determines visibility based on component state only.
 * 
 * UPDATED (Spec 052 - Task 9.3): Tests updated to verify behavior, not specific token names.
 * Component tests should survive future refactoring without breaking.
 */

import {
  calculateLabelPosition,
  calculateIconVisibility,
  createInitialState,
  handleFocus,
  handleBlur,
  handleValueChange,
  handleValidationChange
} from '../stateManagement';
import { InputTextBaseState, InputTextBaseProps } from '../types';

describe('State Management', () => {
  describe('calculateLabelPosition', () => {
    it('should return inside position for empty, unfocused input', () => {
      const state: InputTextBaseState = {
        isFocused: false,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: false
      };

      const result = calculateLabelPosition(state);

      expect(result.isFloated).toBe(false);
      expect(result.fontSize).toBe('typography.labelMd');
      expect(result.color).toBeDefined();
      expect(result.position).toBe('inside');
    });

    it('should return floated position when input is focused', () => {
      const state: InputTextBaseState = {
        isFocused: true,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      const result = calculateLabelPosition(state);

      expect(result.isFloated).toBe(true);
      expect(result.fontSize).toBe('typography.labelMdFloat');
      expect(result.color).toBeDefined();
      expect(result.position).toBe('above');
    });

    it('should return floated position when input is filled', () => {
      const state: InputTextBaseState = {
        isFocused: false,
        isFilled: true,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      const result = calculateLabelPosition(state);

      expect(result.isFloated).toBe(true);
      expect(result.fontSize).toBe('typography.labelMdFloat');
      expect(result.color).toBeDefined();
      expect(result.position).toBe('above');
    });

    it('should use different color when in error state vs default state', () => {
      const defaultState: InputTextBaseState = {
        isFocused: false,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: false
      };

      const errorState: InputTextBaseState = {
        isFocused: true,
        isFilled: false,
        hasError: true,
        isSuccess: false,
        isLabelFloated: true
      };

      const defaultResult = calculateLabelPosition(defaultState);
      const errorResult = calculateLabelPosition(errorState);

      // Error state should have a different color than default
      expect(errorResult.color).not.toBe(defaultResult.color);
      expect(errorResult.color).toBeDefined();
    });

    it('should use different color when in success state vs default state', () => {
      const defaultState: InputTextBaseState = {
        isFocused: false,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: false
      };

      const successState: InputTextBaseState = {
        isFocused: false,
        isFilled: true,
        hasError: false,
        isSuccess: true,
        isLabelFloated: true
      };

      const defaultResult = calculateLabelPosition(defaultState);
      const successResult = calculateLabelPosition(successState);

      // Success state should have a different color than default
      expect(successResult.color).not.toBe(defaultResult.color);
      expect(successResult.color).toBeDefined();
    });

    it('should prioritize error color over success color', () => {
      const successOnlyState: InputTextBaseState = {
        isFocused: false,
        isFilled: true,
        hasError: false,
        isSuccess: true,
        isLabelFloated: true
      };

      const errorAndSuccessState: InputTextBaseState = {
        isFocused: false,
        isFilled: true,
        hasError: true,
        isSuccess: true,
        isLabelFloated: true
      };

      const errorOnlyState: InputTextBaseState = {
        isFocused: false,
        isFilled: true,
        hasError: true,
        isSuccess: false,
        isLabelFloated: true
      };

      const successResult = calculateLabelPosition(successOnlyState);
      const errorAndSuccessResult = calculateLabelPosition(errorAndSuccessState);
      const errorOnlyResult = calculateLabelPosition(errorOnlyState);

      // When both error and success are true, error should take precedence
      expect(errorAndSuccessResult.color).toBe(errorOnlyResult.color);
      expect(errorAndSuccessResult.color).not.toBe(successResult.color);
    });

    it('should prioritize error color over focused color', () => {
      const focusedState: InputTextBaseState = {
        isFocused: true,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      const errorAndFocusedState: InputTextBaseState = {
        isFocused: true,
        isFilled: false,
        hasError: true,
        isSuccess: false,
        isLabelFloated: true
      };

      const errorOnlyState: InputTextBaseState = {
        isFocused: false,
        isFilled: true,
        hasError: true,
        isSuccess: false,
        isLabelFloated: true
      };

      const focusedResult = calculateLabelPosition(focusedState);
      const errorAndFocusedResult = calculateLabelPosition(errorAndFocusedState);
      const errorOnlyResult = calculateLabelPosition(errorOnlyState);

      // When both error and focused are true, error should take precedence
      expect(errorAndFocusedResult.color).toBe(errorOnlyResult.color);
      expect(errorAndFocusedResult.color).not.toBe(focusedResult.color);
    });

    it('should use different color when focused vs unfocused (non-error, non-success)', () => {
      const unfocusedState: InputTextBaseState = {
        isFocused: false,
        isFilled: true,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      const focusedState: InputTextBaseState = {
        isFocused: true,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true
      };

      const unfocusedResult = calculateLabelPosition(unfocusedState);
      const focusedResult = calculateLabelPosition(focusedState);

      // Focused state should have a different color than unfocused filled state
      expect(focusedResult.color).not.toBe(unfocusedResult.color);
    });
  });

  /**
   * Icon Visibility Tests
   * 
   * These tests verify that calculateIconVisibility correctly determines
   * icon visibility based on component state. Animation timing coordination
   * is handled by CSS transition-delay, so these tests only verify state-based logic.
   */
  describe('calculateIconVisibility', () => {
    it('should hide all icons when label is not floated', () => {
      const state: InputTextBaseState = {
        isFocused: false,
        isFilled: false,
        hasError: true,
        isSuccess: false,
        isLabelFloated: false,
        showInfoIcon: true
      };

      const result = calculateIconVisibility(state);

      expect(result.showErrorIcon).toBe(false);
      expect(result.showSuccessIcon).toBe(false);
      expect(result.showInfoIcon).toBe(false);
    });

    it('should show error icon when label is floated and has error', () => {
      const state: InputTextBaseState = {
        isFocused: true,
        isFilled: false,
        hasError: true,
        isSuccess: false,
        isLabelFloated: true
      };

      const result = calculateIconVisibility(state);

      expect(result.showErrorIcon).toBe(true);
      expect(result.showSuccessIcon).toBe(false);
      expect(result.showInfoIcon).toBe(false);
    });

    it('should show success icon when label is floated and is success', () => {
      const state: InputTextBaseState = {
        isFocused: false,
        isFilled: true,
        hasError: false,
        isSuccess: true,
        isLabelFloated: true
      };

      const result = calculateIconVisibility(state);

      expect(result.showErrorIcon).toBe(false);
      expect(result.showSuccessIcon).toBe(true);
      expect(result.showInfoIcon).toBe(false);
    });

    it('should show info icon when focused', () => {
      const state: InputTextBaseState = {
        isFocused: true,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true,
        showInfoIcon: true
      };

      const result = calculateIconVisibility(state);

      expect(result.showErrorIcon).toBe(false);
      expect(result.showSuccessIcon).toBe(false);
      expect(result.showInfoIcon).toBe(true);
    });

    it('should show info icon when filled', () => {
      const state: InputTextBaseState = {
        isFocused: false,
        isFilled: true,
        hasError: false,
        isSuccess: false,
        isLabelFloated: true,
        showInfoIcon: true
      };

      const result = calculateIconVisibility(state);

      expect(result.showErrorIcon).toBe(false);
      expect(result.showSuccessIcon).toBe(false);
      expect(result.showInfoIcon).toBe(true);
    });

    it('should not show info icon when not focused or filled', () => {
      const state: InputTextBaseState = {
        isFocused: false,
        isFilled: false,
        hasError: false,
        isSuccess: false,
        isLabelFloated: false,
        showInfoIcon: true
      };

      const result = calculateIconVisibility(state);

      expect(result.showInfoIcon).toBe(false);
    });
  });

  describe('createInitialState', () => {
    it('should create initial state for empty input', () => {
      const props: InputTextBaseProps = {
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
      const props: InputTextBaseProps = {
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
      const props: InputTextBaseProps = {
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
      const props: InputTextBaseProps = {
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
      const props: InputTextBaseProps = {
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
      const currentState: InputTextBaseState = {
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
      const currentState: InputTextBaseState = {
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
      const currentState: InputTextBaseState = {
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
      const currentState: InputTextBaseState = {
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
      const currentState: InputTextBaseState = {
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
      const currentState: InputTextBaseState = {
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
      const currentState: InputTextBaseState = {
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
      const currentState: InputTextBaseState = {
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
      const currentState: InputTextBaseState = {
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
      const currentState: InputTextBaseState = {
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

  describe('State Machine Transitions', () => {
    it('should transition from Empty, Not Focused to Empty, Focused', () => {
      let state: InputTextBaseState = {
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
      let state: InputTextBaseState = {
        isFocused: false,
        isFilled: true,
        hasError: true,
        isSuccess: false,
        isLabelFloated: true
      };

      state = handleFocus(state);
      expect(state.hasError).toBe(true);
      expect(state.isFocused).toBe(true);

      state = handleBlur(state);
      expect(state.hasError).toBe(true);
      expect(state.isFocused).toBe(false);
    });

    it('should maintain error state across value changes', () => {
      let state: InputTextBaseState = {
        isFocused: true,
        isFilled: false,
        hasError: true,
        isSuccess: false,
        isLabelFloated: true
      };

      state = handleValueChange(state, 'new value');
      expect(state.hasError).toBe(true);
      expect(state.isFilled).toBe(true);

      state = handleValueChange(state, '');
      expect(state.hasError).toBe(true);
      expect(state.isFilled).toBe(false);
    });

    it('should transition from Empty, Focused to Empty, Not Focused', () => {
      let state: InputTextBaseState = {
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
      let state: InputTextBaseState = {
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
      let state: InputTextBaseState = {
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
      let state: InputTextBaseState = {
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
      let state: InputTextBaseState = {
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
      let state: InputTextBaseState = {
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
