/**
 * Visual State Mapping Unit Tests
 * 
 * Tests for the visual state mapping module that provides CSS styling
 * mappings for each visual state of the Button-VerticalListItem component.
 * 
 * @module Button-VerticalListItem/__tests__/visualStateMapping.test
 * @see Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

import {
  visualStateMap,
  getVisualStateStyles,
  isCheckmarkVisible,
  getVisualStateCssClass,
  isSelectModeState,
  isMultiSelectModeState,
  requiresEmphasisBorder,
  applyErrorStyles,
  getVisualStateStylesWithError,
  VisualStateStyles,
} from '../platforms/web/visualStateMapping';
import { VisualState } from '../types';

describe('Visual State Mapping', () => {
  describe('visualStateMap', () => {
    it('should have all five visual states defined', () => {
      const expectedStates: VisualState[] = ['rest', 'selected', 'notSelected', 'checked', 'unchecked'];
      
      expectedStates.forEach(state => {
        expect(visualStateMap[state]).toBeDefined();
      });
    });

    it('should have correct structure for each state', () => {
      Object.values(visualStateMap).forEach(styles => {
        expect(styles).toHaveProperty('background');
        expect(styles).toHaveProperty('borderWidth');
        expect(styles).toHaveProperty('borderColor');
        expect(styles).toHaveProperty('labelColor');
        expect(styles).toHaveProperty('iconColor');
        expect(styles).toHaveProperty('checkmarkVisible');
        expect(styles).toHaveProperty('cssClass');
      });
    });
  });

  describe('getVisualStateStyles', () => {
    it('should return correct styles for rest state', () => {
      const styles = getVisualStateStyles('rest');
      
      expect(styles.background).toBe('var(--color-background)');
      expect(styles.borderWidth).toBe('var(--border-border-default)');
      expect(styles.borderColor).toBe('transparent');
      expect(styles.labelColor).toBe('var(--color-text-default)');
      expect(styles.checkmarkVisible).toBe(false);
      expect(styles.cssClass).toBe('vertical-list-item--rest');
    });

    it('should return correct styles for selected state', () => {
      const styles = getVisualStateStyles('selected');
      
      expect(styles.background).toBe('var(--color-select-selected-subtle)');
      expect(styles.borderWidth).toBe('var(--border-border-emphasis)');
      expect(styles.borderColor).toBe('var(--color-select-selected-strong)');
      expect(styles.labelColor).toBe('var(--color-select-selected-strong)');
      expect(styles.checkmarkVisible).toBe(true);
      expect(styles.cssClass).toBe('vertical-list-item--selected');
    });

    it('should return correct styles for notSelected state', () => {
      const styles = getVisualStateStyles('notSelected');
      
      expect(styles.background).toBe('var(--color-select-not-selected-subtle)');
      expect(styles.borderWidth).toBe('var(--border-border-default)');
      expect(styles.borderColor).toBe('transparent');
      expect(styles.labelColor).toBe('var(--color-select-not-selected-strong)');
      expect(styles.checkmarkVisible).toBe(false);
      expect(styles.cssClass).toBe('vertical-list-item--not-selected');
    });

    it('should return correct styles for checked state', () => {
      const styles = getVisualStateStyles('checked');
      
      expect(styles.background).toBe('var(--color-select-selected-subtle)');
      expect(styles.borderWidth).toBe('var(--border-border-default)');
      expect(styles.borderColor).toBe('transparent');
      expect(styles.labelColor).toBe('var(--color-select-selected-strong)');
      expect(styles.checkmarkVisible).toBe(true);
      expect(styles.cssClass).toBe('vertical-list-item--checked');
    });

    it('should return correct styles for unchecked state', () => {
      const styles = getVisualStateStyles('unchecked');
      
      expect(styles.background).toBe('var(--color-background)');
      expect(styles.borderWidth).toBe('var(--border-border-default)');
      expect(styles.borderColor).toBe('transparent');
      expect(styles.labelColor).toBe('var(--color-text-default)');
      expect(styles.checkmarkVisible).toBe(false);
      expect(styles.cssClass).toBe('vertical-list-item--unchecked');
    });

    it('should throw error for invalid state', () => {
      // @ts-expect-error Testing runtime behavior with invalid input
      expect(() => getVisualStateStyles('invalid')).toThrow('Invalid visual state');
    });
  });

  describe('isCheckmarkVisible', () => {
    it('should return true for selected state', () => {
      expect(isCheckmarkVisible('selected')).toBe(true);
    });

    it('should return true for checked state', () => {
      expect(isCheckmarkVisible('checked')).toBe(true);
    });

    it('should return false for rest state', () => {
      expect(isCheckmarkVisible('rest')).toBe(false);
    });

    it('should return false for notSelected state', () => {
      expect(isCheckmarkVisible('notSelected')).toBe(false);
    });

    it('should return false for unchecked state', () => {
      expect(isCheckmarkVisible('unchecked')).toBe(false);
    });
  });

  describe('getVisualStateCssClass', () => {
    it('should return correct CSS class for each state', () => {
      expect(getVisualStateCssClass('rest')).toBe('vertical-list-item--rest');
      expect(getVisualStateCssClass('selected')).toBe('vertical-list-item--selected');
      expect(getVisualStateCssClass('notSelected')).toBe('vertical-list-item--not-selected');
      expect(getVisualStateCssClass('checked')).toBe('vertical-list-item--checked');
      expect(getVisualStateCssClass('unchecked')).toBe('vertical-list-item--unchecked');
    });
  });

  describe('isSelectModeState', () => {
    it('should return true for rest state', () => {
      expect(isSelectModeState('rest')).toBe(true);
    });

    it('should return true for selected state', () => {
      expect(isSelectModeState('selected')).toBe(true);
    });

    it('should return true for notSelected state', () => {
      expect(isSelectModeState('notSelected')).toBe(true);
    });

    it('should return false for checked state', () => {
      expect(isSelectModeState('checked')).toBe(false);
    });

    it('should return false for unchecked state', () => {
      expect(isSelectModeState('unchecked')).toBe(false);
    });
  });

  describe('isMultiSelectModeState', () => {
    it('should return true for checked state', () => {
      expect(isMultiSelectModeState('checked')).toBe(true);
    });

    it('should return true for unchecked state', () => {
      expect(isMultiSelectModeState('unchecked')).toBe(true);
    });

    it('should return false for rest state', () => {
      expect(isMultiSelectModeState('rest')).toBe(false);
    });

    it('should return false for selected state', () => {
      expect(isMultiSelectModeState('selected')).toBe(false);
    });

    it('should return false for notSelected state', () => {
      expect(isMultiSelectModeState('notSelected')).toBe(false);
    });
  });

  describe('requiresEmphasisBorder', () => {
    it('should return true only for selected state', () => {
      expect(requiresEmphasisBorder('selected')).toBe(true);
    });

    it('should return false for all other states', () => {
      expect(requiresEmphasisBorder('rest')).toBe(false);
      expect(requiresEmphasisBorder('notSelected')).toBe(false);
      expect(requiresEmphasisBorder('checked')).toBe(false);
      expect(requiresEmphasisBorder('unchecked')).toBe(false);
    });
  });

  describe('Token Reference Validation', () => {
    it('should use CSS variable syntax for all color references', () => {
      Object.values(visualStateMap).forEach(styles => {
        // Background should be a CSS variable or transparent
        expect(styles.background).toMatch(/^var\(--[\w-]+\)$/);
        
        // Border width should be a CSS variable
        expect(styles.borderWidth).toMatch(/^var\(--[\w-]+\)$/);
        
        // Border color should be a CSS variable or transparent
        expect(styles.borderColor).toMatch(/^(var\(--[\w-]+\)|transparent)$/);
        
        // Label color should be a CSS variable
        expect(styles.labelColor).toMatch(/^var\(--[\w-]+\)$/);
        
        // Icon color should be a CSS variable
        expect(styles.iconColor).toMatch(/^var\(--[\w-]+\)$/);
      });
    });

    it('should reference correct semantic tokens for selected states', () => {
      const selectedStyles = getVisualStateStyles('selected');
      const checkedStyles = getVisualStateStyles('checked');
      
      // Both should use the same selected background token
      expect(selectedStyles.background).toBe(checkedStyles.background);
      
      // Both should use the same selected foreground token
      expect(selectedStyles.labelColor).toBe(checkedStyles.labelColor);
    });

    it('should reference correct semantic tokens for neutral states', () => {
      const restStyles = getVisualStateStyles('rest');
      const uncheckedStyles = getVisualStateStyles('unchecked');
      
      // Both should use the same neutral background token
      expect(restStyles.background).toBe(uncheckedStyles.background);
      
      // Both should use the same neutral text token
      expect(restStyles.labelColor).toBe(uncheckedStyles.labelColor);
    });
  });
});


describe('Error State Overlay', () => {
  describe('applyErrorStyles', () => {
    describe('Select mode error treatment (Requirements 3.1, 3.3)', () => {
      it('should apply full error treatment for rest state', () => {
        const baseStyles = getVisualStateStyles('rest');
        const errorStyles = applyErrorStyles(baseStyles, 'rest');
        
        expect(errorStyles.background).toBe('var(--color-error-subtle)');
        expect(errorStyles.borderWidth).toBe('var(--border-border-emphasis)');
        expect(errorStyles.borderColor).toBe('var(--color-error-strong)');
        expect(errorStyles.labelColor).toBe('var(--color-error-strong)');
        expect(errorStyles.iconColor).toBe('var(--color-error-strong)');
        expect(errorStyles.cssClass).toContain('vertical-list-item--error');
      });

      it('should apply full error treatment for selected state', () => {
        const baseStyles = getVisualStateStyles('selected');
        const errorStyles = applyErrorStyles(baseStyles, 'selected');
        
        expect(errorStyles.background).toBe('var(--color-error-subtle)');
        expect(errorStyles.borderWidth).toBe('var(--border-border-emphasis)');
        expect(errorStyles.borderColor).toBe('var(--color-error-strong)');
        expect(errorStyles.labelColor).toBe('var(--color-error-strong)');
        expect(errorStyles.iconColor).toBe('var(--color-error-strong)');
        expect(errorStyles.cssClass).toContain('vertical-list-item--error');
      });

      it('should apply full error treatment for notSelected state', () => {
        const baseStyles = getVisualStateStyles('notSelected');
        const errorStyles = applyErrorStyles(baseStyles, 'notSelected');
        
        expect(errorStyles.background).toBe('var(--color-error-subtle)');
        expect(errorStyles.borderWidth).toBe('var(--border-border-emphasis)');
        expect(errorStyles.borderColor).toBe('var(--color-error-strong)');
        expect(errorStyles.labelColor).toBe('var(--color-error-strong)');
        expect(errorStyles.iconColor).toBe('var(--color-error-strong)');
        expect(errorStyles.cssClass).toContain('vertical-list-item--error');
      });

      it('should preserve checkmarkVisible from base styles in Select mode', () => {
        const selectedStyles = getVisualStateStyles('selected');
        const errorStyles = applyErrorStyles(selectedStyles, 'selected');
        
        expect(errorStyles.checkmarkVisible).toBe(true);
        
        const restStyles = getVisualStateStyles('rest');
        const restErrorStyles = applyErrorStyles(restStyles, 'rest');
        
        expect(restErrorStyles.checkmarkVisible).toBe(false);
      });
    });

    describe('Multi-Select mode error treatment (Requirements 3.2, 3.3)', () => {
      it('should apply colors-only error treatment for checked state', () => {
        const baseStyles = getVisualStateStyles('checked');
        const errorStyles = applyErrorStyles(baseStyles, 'checked');
        
        // Colors should change to error
        expect(errorStyles.labelColor).toBe('var(--color-error-strong)');
        expect(errorStyles.iconColor).toBe('var(--color-error-strong)');
        
        // Background and border should remain unchanged
        expect(errorStyles.background).toBe(baseStyles.background);
        expect(errorStyles.borderWidth).toBe(baseStyles.borderWidth);
        expect(errorStyles.borderColor).toBe(baseStyles.borderColor);
        
        expect(errorStyles.cssClass).toContain('vertical-list-item--error');
      });

      it('should apply colors-only error treatment for unchecked state', () => {
        const baseStyles = getVisualStateStyles('unchecked');
        const errorStyles = applyErrorStyles(baseStyles, 'unchecked');
        
        // Colors should change to error
        expect(errorStyles.labelColor).toBe('var(--color-error-strong)');
        expect(errorStyles.iconColor).toBe('var(--color-error-strong)');
        
        // Background and border should remain unchanged
        expect(errorStyles.background).toBe(baseStyles.background);
        expect(errorStyles.borderWidth).toBe(baseStyles.borderWidth);
        expect(errorStyles.borderColor).toBe(baseStyles.borderColor);
        
        expect(errorStyles.cssClass).toContain('vertical-list-item--error');
      });

      it('should preserve checkmarkVisible from base styles in Multi-Select mode', () => {
        const checkedStyles = getVisualStateStyles('checked');
        const errorStyles = applyErrorStyles(checkedStyles, 'checked');
        
        expect(errorStyles.checkmarkVisible).toBe(true);
        
        const uncheckedStyles = getVisualStateStyles('unchecked');
        const uncheckedErrorStyles = applyErrorStyles(uncheckedStyles, 'unchecked');
        
        expect(uncheckedErrorStyles.checkmarkVisible).toBe(false);
      });
    });

    describe('CSS class handling', () => {
      it('should append error class to existing state class', () => {
        const states: VisualState[] = ['rest', 'selected', 'notSelected', 'checked', 'unchecked'];
        
        states.forEach(state => {
          const baseStyles = getVisualStateStyles(state);
          const errorStyles = applyErrorStyles(baseStyles, state);
          
          // Should contain both the original class and the error modifier
          expect(errorStyles.cssClass).toContain(baseStyles.cssClass);
          expect(errorStyles.cssClass).toContain('vertical-list-item--error');
        });
      });
    });
  });

  describe('getVisualStateStylesWithError', () => {
    it('should return base styles when error is false', () => {
      const styles = getVisualStateStylesWithError('selected', false);
      const baseStyles = getVisualStateStyles('selected');
      
      expect(styles).toEqual(baseStyles);
    });

    it('should return error styles when error is true', () => {
      const styles = getVisualStateStylesWithError('selected', true);
      
      expect(styles.background).toBe('var(--color-error-subtle)');
      expect(styles.labelColor).toBe('var(--color-error-strong)');
    });

    it('should default to no error when error parameter is omitted', () => {
      const styles = getVisualStateStylesWithError('selected');
      const baseStyles = getVisualStateStyles('selected');
      
      expect(styles).toEqual(baseStyles);
    });

    it('should apply mode-specific error treatment', () => {
      // Select mode: full treatment
      const selectErrorStyles = getVisualStateStylesWithError('selected', true);
      expect(selectErrorStyles.background).toBe('var(--color-error-subtle)');
      expect(selectErrorStyles.borderColor).toBe('var(--color-error-strong)');
      
      // Multi-Select mode: colors only
      const multiSelectErrorStyles = getVisualStateStylesWithError('checked', true);
      const checkedBaseStyles = getVisualStateStyles('checked');
      expect(multiSelectErrorStyles.background).toBe(checkedBaseStyles.background);
      expect(multiSelectErrorStyles.labelColor).toBe('var(--color-error-strong)');
    });
  });

  describe('Error Token Reference Validation', () => {
    it('should use correct error token references', () => {
      const errorStyles = applyErrorStyles(getVisualStateStyles('selected'), 'selected');
      
      // Verify error tokens use CSS variable syntax
      expect(errorStyles.background).toBe('var(--color-error-subtle)');
      expect(errorStyles.borderColor).toBe('var(--color-error-strong)');
      expect(errorStyles.labelColor).toBe('var(--color-error-strong)');
      expect(errorStyles.iconColor).toBe('var(--color-error-strong)');
      expect(errorStyles.borderWidth).toBe('var(--border-border-emphasis)');
    });

    it('should use consistent error color for label and icon', () => {
      const states: VisualState[] = ['rest', 'selected', 'notSelected', 'checked', 'unchecked'];
      
      states.forEach(state => {
        const baseStyles = getVisualStateStyles(state);
        const errorStyles = applyErrorStyles(baseStyles, state);
        
        // Label and icon should always use the same error color
        expect(errorStyles.labelColor).toBe(errorStyles.iconColor);
        expect(errorStyles.labelColor).toBe('var(--color-error-strong)');
      });
    });
  });
});
