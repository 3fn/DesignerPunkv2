/**
 * Visual State Mapping for Button-VerticalList-Item Web Component
 * 
 * Stemma System: Buttons Family
 * Component Type: Primitive (VerticalList-Item)
 * Custom Element Tag: <button-vertical-list-item>
 * 
 * Provides visual state to CSS styling mappings for the Button-VerticalList-Item
 * component. Each visual state maps to specific background, border, and text
 * color tokens.
 * 
 * Visual States:
 * - rest: Default/Tap mode state
 * - selected: Active selection in Select mode (shows checkmark, emphasis border)
 * - notSelected: Inactive item in Select mode when another item is selected
 * - checked: Active selection in Multi-Select mode (shows checkmark)
 * - unchecked: Inactive item in Multi-Select mode
 * 
 * @module Button-VerticalList-Item/platforms/web/visualStateMapping
 * @see Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

import { VisualState } from '../../types';

/**
 * CSS variable references for visual state styling.
 * 
 * All values are CSS custom property references (var(--token-name)) that
 * resolve to actual colors at runtime. This ensures theme-awareness and
 * allows the component to adapt to different color schemes.
 */
export interface VisualStateStyles {
  /** Background color CSS variable reference */
  background: string;
  /** Border width CSS variable reference */
  borderWidth: string;
  /** Border color CSS variable reference or 'transparent' */
  borderColor: string;
  /** Label text color CSS variable reference */
  labelColor: string;
  /** Icon color CSS variable reference (before optical balance) */
  iconColor: string;
  /** Whether the checkmark selection indicator should be visible */
  checkmarkVisible: boolean;
  /** CSS class name for this visual state */
  cssClass: string;
}

/**
 * Visual state to CSS styling mapping.
 * 
 * Maps each VisualState to its corresponding CSS variable references and
 * styling properties. All color values reference semantic tokens from the
 * design system.
 * 
 * Token Mapping:
 * - color.background → --color-background
 * - color.text.default → --color-text-default
 * - color.select.selected.strong → --color-select-selected-strong (foreground)
 * - color.select.selected.subtle → --color-select-selected-subtle (background)
 * - color.select.notSelected.strong → --color-select-not-selected-strong (foreground)
 * - color.select.notSelected.subtle → --color-select-not-selected-subtle (background)
 * - border.default → --border-default (1px)
 * - border.emphasis → --border-emphasis (2px)
 * 
 * @see Requirements 1.1, 1.2, 1.3, 1.4, 1.5 for visual state specifications
 */
export const visualStateMap: Record<VisualState, VisualStateStyles> = {
  /**
   * Rest state - Default/Tap mode appearance
   * 
   * - Background: color.background (neutral)
   * - Border: 1px transparent
   * - Text: color.text.default
   * - Checkmark: hidden
   * 
   * @see Requirement 1.1
   */
  rest: {
    background: 'var(--color-background)',
    borderWidth: 'var(--border-default)',
    borderColor: 'transparent',
    labelColor: 'var(--color-text-default)',
    iconColor: 'var(--color-text-default)',
    checkmarkVisible: false,
    cssClass: 'vertical-list-item--rest',
  },

  /**
   * Selected state - Active selection in Select mode
   * 
   * - Background: color.select.selected.subtle (subtle cyan)
   * - Border: 2px color.select.selected.strong (emphasis cyan)
   * - Text: color.select.selected.strong (strong cyan)
   * - Checkmark: visible
   * 
   * @see Requirement 1.2
   */
  selected: {
    background: 'var(--color-select-selected-subtle)',
    borderWidth: 'var(--border-emphasis)',
    borderColor: 'var(--color-select-selected-strong)',
    labelColor: 'var(--color-select-selected-strong)',
    iconColor: 'var(--color-select-selected-strong)',
    checkmarkVisible: true,
    cssClass: 'vertical-list-item--selected',
  },

  /**
   * Not-selected state - Inactive item in Select mode
   * 
   * - Background: color.select.notSelected.subtle (subtle gray)
   * - Border: 1px transparent
   * - Text: color.select.notSelected.strong (muted gray)
   * - Checkmark: hidden
   * 
   * @see Requirement 1.3
   */
  notSelected: {
    background: 'var(--color-select-not-selected-subtle)',
    borderWidth: 'var(--border-default)',
    borderColor: 'transparent',
    labelColor: 'var(--color-select-not-selected-strong)',
    iconColor: 'var(--color-select-not-selected-strong)',
    checkmarkVisible: false,
    cssClass: 'vertical-list-item--not-selected',
  },

  /**
   * Checked state - Active selection in Multi-Select mode
   * 
   * - Background: color.select.selected.subtle (subtle cyan)
   * - Border: 1px transparent (no emphasis border in multi-select)
   * - Text: color.select.selected.strong (strong cyan)
   * - Checkmark: visible
   * 
   * @see Requirement 1.4
   */
  checked: {
    background: 'var(--color-select-selected-subtle)',
    borderWidth: 'var(--border-default)',
    borderColor: 'transparent',
    labelColor: 'var(--color-select-selected-strong)',
    iconColor: 'var(--color-select-selected-strong)',
    checkmarkVisible: true,
    cssClass: 'vertical-list-item--checked',
  },

  /**
   * Unchecked state - Inactive item in Multi-Select mode
   * 
   * - Background: color.background (neutral)
   * - Border: 1px transparent
   * - Text: color.text.default
   * - Checkmark: hidden
   * 
   * @see Requirement 1.5
   */
  unchecked: {
    background: 'var(--color-background)',
    borderWidth: 'var(--border-default)',
    borderColor: 'transparent',
    labelColor: 'var(--color-text-default)',
    iconColor: 'var(--color-text-default)',
    checkmarkVisible: false,
    cssClass: 'vertical-list-item--unchecked',
  },
};

/**
 * Get visual state styles for a given state.
 * 
 * Returns the CSS variable references and styling properties for the
 * specified visual state. This function provides a type-safe way to
 * access the visual state mapping.
 * 
 * @param state - The visual state to get styles for
 * @returns VisualStateStyles object with CSS variable references
 * @throws Error if state is not a valid VisualState (TypeScript prevents this at compile time)
 * 
 * @example
 * ```typescript
 * const styles = getVisualStateStyles('selected');
 * // styles.background === 'var(--color-select-selected-background)'
 * // styles.checkmarkVisible === true
 * // styles.cssClass === 'vertical-list-item--selected'
 * ```
 */
export function getVisualStateStyles(state: VisualState): VisualStateStyles {
  const styles = visualStateMap[state];
  
  if (!styles) {
    // This should never happen with TypeScript, but provides runtime safety
    throw new Error(
      `Button-VerticalList-Item: Invalid visual state "${state}". ` +
      `Valid states are: ${Object.keys(visualStateMap).join(', ')}`
    );
  }
  
  return styles;
}

/**
 * Check if a visual state shows the checkmark selection indicator.
 * 
 * Convenience function to determine checkmark visibility without
 * accessing the full styles object.
 * 
 * @param state - The visual state to check
 * @returns true if checkmark should be visible, false otherwise
 * 
 * @example
 * ```typescript
 * isCheckmarkVisible('selected') // true
 * isCheckmarkVisible('rest')     // false
 * isCheckmarkVisible('checked')  // true
 * ```
 */
export function isCheckmarkVisible(state: VisualState): boolean {
  return getVisualStateStyles(state).checkmarkVisible;
}

/**
 * Get the CSS class name for a visual state.
 * 
 * Returns the BEM-style CSS class name that should be applied to the
 * component for the given visual state.
 * 
 * @param state - The visual state to get the class for
 * @returns CSS class name string
 * 
 * @example
 * ```typescript
 * getVisualStateCssClass('selected')    // 'vertical-list-item--selected'
 * getVisualStateCssClass('notSelected') // 'vertical-list-item--not-selected'
 * ```
 */
export function getVisualStateCssClass(state: VisualState): string {
  return getVisualStateStyles(state).cssClass;
}

/**
 * Determine if a visual state is in Select mode.
 * 
 * Select mode states use emphasis border when selected and have
 * different error treatment than Multi-Select mode.
 * 
 * @param state - The visual state to check
 * @returns true if state is a Select mode state (rest, selected, notSelected)
 * 
 * @example
 * ```typescript
 * isSelectModeState('selected')    // true
 * isSelectModeState('notSelected') // true
 * isSelectModeState('checked')     // false
 * ```
 */
export function isSelectModeState(state: VisualState): boolean {
  return state === 'rest' || state === 'selected' || state === 'notSelected';
}

/**
 * Determine if a visual state is in Multi-Select mode.
 * 
 * Multi-Select mode states use transparent borders and have
 * different error treatment than Select mode.
 * 
 * @param state - The visual state to check
 * @returns true if state is a Multi-Select mode state (checked, unchecked)
 * 
 * @example
 * ```typescript
 * isMultiSelectModeState('checked')   // true
 * isMultiSelectModeState('unchecked') // true
 * isMultiSelectModeState('selected')  // false
 * ```
 */
export function isMultiSelectModeState(state: VisualState): boolean {
  return state === 'checked' || state === 'unchecked';
}

/**
 * Determine if a visual state requires emphasis border (2px).
 * 
 * Only the 'selected' state in Select mode uses emphasis border.
 * All other states use default border (1px).
 * 
 * @param state - The visual state to check
 * @returns true if state requires emphasis border
 * 
 * @example
 * ```typescript
 * requiresEmphasisBorder('selected') // true
 * requiresEmphasisBorder('checked')  // false
 * ```
 */
export function requiresEmphasisBorder(state: VisualState): boolean {
  return state === 'selected';
}

/**
 * Apply error styling overlay to base visual state styles.
 * 
 * Error styling is applied on top of base visual states with mode-specific
 * treatment. The error treatment differs based on the selection mode:
 * 
 * - **Select mode** (`rest`, `selected`, `notSelected`): Full error treatment
 *   with error background, emphasis border, and error colors for all elements
 * - **Multi-Select mode** (`checked`, `unchecked`): Only text/icon colors
 *   change to error color (no border/background change)
 * - **Tap mode** (`rest` only in Tap context): Error prop has no effect
 *   (Note: This function cannot distinguish Tap mode from Select mode `rest`,
 *   so the parent component should not pass error=true for Tap mode)
 * 
 * @param baseStyles - The base visual state styles to apply error overlay to
 * @param visualState - The current visual state (determines mode-specific treatment)
 * @returns Modified VisualStateStyles with error styling applied
 * 
 * @see Requirements 3.1, 3.2, 3.3, 3.4
 * 
 * @example
 * ```typescript
 * // Select mode: full error treatment
 * const errorStyles = applyErrorStyles(getVisualStateStyles('selected'), 'selected');
 * // errorStyles.background === 'var(--color-error-subtle)'
 * // errorStyles.borderWidth === 'var(--border-emphasis)'
 * // errorStyles.borderColor === 'var(--color-error-strong)'
 * 
 * // Multi-Select mode: colors only
 * const errorStyles = applyErrorStyles(getVisualStateStyles('checked'), 'checked');
 * // errorStyles.background === 'var(--color-select-selected-subtle)' (unchanged)
 * // errorStyles.labelColor === 'var(--color-error-strong)'
 * ```
 */
export function applyErrorStyles(
  baseStyles: VisualStateStyles,
  visualState: VisualState
): VisualStateStyles {
  if (isSelectModeState(visualState)) {
    // Select mode: full error treatment (border + background + colors)
    // @see Requirement 3.1
    return {
      ...baseStyles,
      background: 'var(--color-error-subtle)',
      borderWidth: 'var(--border-emphasis)',
      borderColor: 'var(--color-error-strong)',
      labelColor: 'var(--color-error-strong)',
      iconColor: 'var(--color-error-strong)',
      // Add error CSS class modifier
      cssClass: `${baseStyles.cssClass} vertical-list-item--error`,
    };
  }
  
  if (isMultiSelectModeState(visualState)) {
    // Multi-Select mode: text/icon colors only (no border/background change)
    // @see Requirement 3.2
    return {
      ...baseStyles,
      labelColor: 'var(--color-error-strong)',
      iconColor: 'var(--color-error-strong)',
      // Add error CSS class modifier
      cssClass: `${baseStyles.cssClass} vertical-list-item--error`,
    };
  }
  
  // Tap mode (rest state in Tap context): error has no effect
  // @see Requirement 3.4
  // Note: This branch is technically unreachable since 'rest' is a Select mode state,
  // but the parent component should not pass error=true for Tap mode usage
  return baseStyles;
}

/**
 * Get visual state styles with optional error overlay applied.
 * 
 * Convenience function that combines getVisualStateStyles() and applyErrorStyles()
 * into a single call. This is the recommended way to get styles when error state
 * needs to be considered.
 * 
 * @param state - The visual state to get styles for
 * @param error - Whether to apply error styling (default: false)
 * @returns VisualStateStyles with error overlay applied if error is true
 * 
 * @example
 * ```typescript
 * // Without error
 * const styles = getVisualStateStylesWithError('selected', false);
 * 
 * // With error
 * const errorStyles = getVisualStateStylesWithError('selected', true);
 * ```
 */
export function getVisualStateStylesWithError(
  state: VisualState,
  error: boolean = false
): VisualStateStyles {
  const baseStyles = getVisualStateStyles(state);
  
  if (error) {
    return applyErrorStyles(baseStyles, state);
  }
  
  return baseStyles;
}
