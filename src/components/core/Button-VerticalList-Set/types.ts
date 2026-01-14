/**
 * Button-VerticalList-Set Type Definitions
 * 
 * Stemma System: Buttons Family
 * Component Type: Pattern (VerticalList-Set)
 * Naming Convention: [Family]-[Type] = Button-VerticalList-Set
 * 
 * Provides type-safe props and mode definitions for the vertical list
 * button set container component. This is the "smart" orchestrator that
 * manages selection behavior, state coordination, and accessibility.
 * 
 * @module Button-VerticalList-Set/types
 */

import type { VisualState } from '../Button-VerticalList-Item/types';

/**
 * Selection mode for the button set.
 * 
 * Determines how the set handles user interactions and selection state:
 * 
 * - **tap**: Simple action buttons with no selection tracking
 * - **select**: Single-selection (radio-button style)
 * - **multiSelect**: Multiple-selection (checkbox style)
 * 
 * @example
 * ```typescript
 * const mode: SelectionMode = 'select';
 * ```
 */
export type SelectionMode = 'tap' | 'select' | 'multiSelect';

/**
 * Props interface for Button-VerticalList-Set component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * The component is a controlled container that manages selection state and
 * coordinates visual states across child Button-VerticalList-Item components.
 * 
 * @remarks
 * The component follows True Native Architecture with separate implementations
 * per platform, but all platforms expose identical APIs using these shared types.
 * 
 * @example
 * ```typescript
 * // Tap mode - simple action buttons
 * <button-vertical-list-set
 *   mode="tap"
 *   onItemClick={(index) => handleAction(index)}
 * >
 *   <button-vertical-list-item label="Settings" />
 *   <button-vertical-list-item label="Help" />
 * </button-vertical-list-set>
 * 
 * // Select mode - single selection
 * <button-vertical-list-set
 *   mode="select"
 *   selectedIndex={selectedOption}
 *   onSelectionChange={(index) => setSelectedOption(index)}
 * >
 *   <button-vertical-list-item label="Option A" />
 *   <button-vertical-list-item label="Option B" />
 * </button-vertical-list-set>
 * 
 * // MultiSelect mode - multiple selections
 * <button-vertical-list-set
 *   mode="multiSelect"
 *   selectedIndices={selectedOptions}
 *   onMultiSelectionChange={(indices) => setSelectedOptions(indices)}
 *   minSelections={1}
 *   maxSelections={3}
 * >
 *   <button-vertical-list-item label="Choice 1" />
 *   <button-vertical-list-item label="Choice 2" />
 *   <button-vertical-list-item label="Choice 3" />
 * </button-vertical-list-set>
 * ```
 */
export interface ButtonVerticalListSetProps {
  // ─────────────────────────────────────────────────────────────────
  // Mode Selection
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Selection mode (required).
   * 
   * Determines how the set handles user interactions:
   * - `tap`: Items act as simple action buttons
   * - `select`: Single-selection (radio-button style)
   * - `multiSelect`: Multiple-selection (checkbox style)
   * 
   * @example
   * ```typescript
   * mode="tap"        // Action buttons
   * mode="select"     // Single selection
   * mode="multiSelect" // Multiple selection
   * ```
   */
  mode: SelectionMode;
  
  // ─────────────────────────────────────────────────────────────────
  // Select Mode (Controlled)
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Currently selected index for Select mode (controlled).
   * 
   * The index of the currently selected item, or `null` if no selection.
   * Only used when `mode="select"`.
   * 
   * @remarks
   * This is a controlled prop — the parent manages the selection state
   * and updates it via the `onSelectionChange` callback.
   * 
   * @example
   * ```typescript
   * selectedIndex={0}      // First item selected
   * selectedIndex={null}   // No selection
   * selectedIndex={selectedOption}  // Controlled by state
   * ```
   */
  selectedIndex?: number | null;
  
  /**
   * Callback when selection changes in Select mode.
   * 
   * Invoked with the new selected index, or `null` when deselecting.
   * Only used when `mode="select"`.
   * 
   * @param index - The newly selected index, or null for deselection
   * 
   * @example
   * ```typescript
   * onSelectionChange={(index) => setSelectedOption(index)}
   * ```
   */
  onSelectionChange?: (index: number | null) => void;
  
  // ─────────────────────────────────────────────────────────────────
  // MultiSelect Mode (Controlled)
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Currently selected indices for MultiSelect mode (controlled).
   * 
   * Array of indices for all currently selected items.
   * Only used when `mode="multiSelect"`.
   * 
   * @remarks
   * This is a controlled prop — the parent manages the selection state
   * and updates it via the `onMultiSelectionChange` callback.
   * 
   * @example
   * ```typescript
   * selectedIndices={[0, 2]}     // First and third items selected
   * selectedIndices={[]}         // No selections
   * selectedIndices={selections} // Controlled by state
   * ```
   */
  selectedIndices?: number[];
  
  /**
   * Callback when selections change in MultiSelect mode.
   * 
   * Invoked with the complete array of selected indices after any change.
   * Only used when `mode="multiSelect"`.
   * 
   * @param indices - Array of all currently selected indices
   * 
   * @example
   * ```typescript
   * onMultiSelectionChange={(indices) => setSelections(indices)}
   * ```
   */
  onMultiSelectionChange?: (indices: number[]) => void;
  
  // ─────────────────────────────────────────────────────────────────
  // Tap Mode
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Callback when an item is clicked in Tap mode.
   * 
   * Invoked with the index of the clicked item.
   * Only used when `mode="tap"`.
   * 
   * @param index - The index of the clicked item
   * 
   * @example
   * ```typescript
   * onItemClick={(index) => handleAction(index)}
   * ```
   */
  onItemClick?: (index: number) => void;
  
  // ─────────────────────────────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Whether a selection is required (Select mode only).
   * 
   * When true, validation fails if no item is selected.
   * 
   * @defaultValue false
   * 
   * @example
   * ```typescript
   * required={true}  // Selection required
   * ```
   */
  required?: boolean;
  
  /**
   * Minimum number of selections required (MultiSelect mode only).
   * 
   * Validation fails if fewer than this many items are selected.
   * 
   * @example
   * ```typescript
   * minSelections={1}  // At least one selection required
   * minSelections={2}  // At least two selections required
   * ```
   */
  minSelections?: number;
  
  /**
   * Maximum number of selections allowed (MultiSelect mode only).
   * 
   * Prevents selecting more than this many items.
   * 
   * @example
   * ```typescript
   * maxSelections={3}  // Maximum three selections
   * maxSelections={1}  // Effectively single-select behavior
   * ```
   */
  maxSelections?: number;
  
  // ─────────────────────────────────────────────────────────────────
  // Error State
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Error state indicator (optional, default: false).
   * 
   * When true, applies error styling to all child items and displays
   * the error message if provided.
   * 
   * @defaultValue false
   * 
   * @example
   * ```typescript
   * error={true}   // Show error styling
   * error={hasValidationError}  // Conditional error
   * ```
   */
  error?: boolean;
  
  /**
   * Error message to display above the list.
   * 
   * Displayed when `error={true}`. The message appears above the list
   * with `role="alert"` for screen reader announcement.
   * 
   * @example
   * ```typescript
   * errorMessage="Please select an option"
   * errorMessage="Please select at least 2 options"
   * ```
   */
  errorMessage?: string;
  
  // ─────────────────────────────────────────────────────────────────
  // Testing
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Optional test ID for automated testing.
   * 
   * Identifier used by testing frameworks to locate the container element.
   * Platform-specific implementations map this to appropriate attributes:
   * - Web: data-testid attribute
   * - iOS: accessibilityIdentifier
   * - Android: testTag
   * 
   * @example
   * ```typescript
   * testID="settings-options"
   * testID="payment-methods"
   * ```
   */
  testID?: string;
}

/**
 * Internal state model for the Set component.
 * 
 * Tracks focus management and animation coordination state.
 * This is internal to the component and not exposed via props.
 */
export interface SetInternalState {
  /**
   * Index of the currently focused item.
   * Used for keyboard navigation with roving tabindex.
   */
  focusedIndex: number;
  
  /**
   * Previous selected index for animation stagger calculation.
   * Used to determine animation timing when selection changes.
   */
  previousSelectedIndex: number | null;
  
  /**
   * Whether this is the first selection (no previous selection).
   * Used to determine simultaneous vs staggered animation.
   */
  isFirstSelection: boolean;
}

/**
 * Derived item state passed to child Button-VerticalList-Item components.
 * 
 * The Set derives these values from its controlled props and passes
 * them to each child item.
 */
export interface DerivedItemState {
  /**
   * Visual state for the item.
   */
  visualState: VisualState;
  
  /**
   * Transition delay in milliseconds for animation coordination.
   */
  transitionDelay: number;
  
  /**
   * Checkmark transition behavior.
   */
  checkmarkTransition: 'animated' | 'instant';
  
  /**
   * Whether the item is in error state.
   */
  error: boolean;
  
  /**
   * ARIA role for the item.
   */
  role: 'button' | 'radio' | 'checkbox';
  
  /**
   * ARIA checked state for the item.
   */
  ariaChecked?: boolean;
  
  /**
   * Tabindex for roving tabindex pattern.
   */
  tabIndex: number;
}

// ─────────────────────────────────────────────────────────────────
// Validation Result Type
// ─────────────────────────────────────────────────────────────────

/**
 * Result of selection validation.
 * 
 * Contains the validation status and an optional error message
 * to display to the user.
 */
export interface ValidationResult {
  /**
   * Whether the current selection is valid.
   */
  isValid: boolean;
  
  /**
   * Error message to display if validation fails.
   * Null when validation passes.
   */
  message: string | null;
}

// ─────────────────────────────────────────────────────────────────
// Validation Functions
// ─────────────────────────────────────────────────────────────────

/**
 * Validate the current selection state based on mode and constraints.
 * 
 * This function checks if the current selection meets the validation
 * requirements based on the mode and configured constraints:
 * 
 * **Select Mode**:
 * - If `required` is true, validation fails when no item is selected
 * 
 * **MultiSelect Mode**:
 * - If `minSelections` is set, validation fails if fewer items are selected
 * - If `maxSelections` is set, validation fails if more items are selected
 * 
 * **Tap Mode**:
 * - No validation (always valid)
 * 
 * @param mode - The selection mode ('tap', 'select', or 'multiSelect')
 * @param selectedIndex - The selected index for Select mode (null if no selection)
 * @param selectedIndices - Array of selected indices for MultiSelect mode
 * @param required - Whether a selection is required (Select mode only)
 * @param minSelections - Minimum number of selections required (MultiSelect mode only)
 * @param maxSelections - Maximum number of selections allowed (MultiSelect mode only)
 * @returns ValidationResult with isValid flag and optional error message
 * 
 * @example
 * ```typescript
 * // Select mode - required but no selection
 * validateSelection('select', null, [], true);
 * // Returns: { isValid: false, message: 'Please select an option' }
 * 
 * // Select mode - required with selection
 * validateSelection('select', 1, [], true);
 * // Returns: { isValid: true, message: null }
 * 
 * // MultiSelect mode - minSelections not met
 * validateSelection('multiSelect', null, [0], false, 2);
 * // Returns: { isValid: false, message: 'Please select at least 2 options' }
 * 
 * // MultiSelect mode - maxSelections exceeded
 * validateSelection('multiSelect', null, [0, 1, 2, 3], false, undefined, 3);
 * // Returns: { isValid: false, message: 'Please select no more than 3 options' }
 * ```
 * 
 * @see Requirements 7.3, 7.4, 7.5
 */
export function validateSelection(
  mode: SelectionMode,
  selectedIndex: number | null,
  selectedIndices: number[],
  required: boolean,
  minSelections?: number,
  maxSelections?: number
): ValidationResult {
  // Select mode: Check required constraint
  // @see Requirement 7.3: "WHEN a valid selection is made AND required is true"
  if (mode === 'select' && required && selectedIndex === null) {
    return { isValid: false, message: 'Please select an option' };
  }
  
  // MultiSelect mode: Check min/max constraints
  if (mode === 'multiSelect') {
    const count = selectedIndices.length;
    
    // @see Requirement 7.4: "WHEN minSelections is set THEN validate at least that many"
    if (minSelections !== undefined && count < minSelections) {
      return { 
        isValid: false, 
        message: `Please select at least ${minSelections} option${minSelections > 1 ? 's' : ''}` 
      };
    }
    
    // @see Requirement 7.5: "WHEN maxSelections is set THEN prevent selecting more"
    // Note: This validation is for display purposes; actual prevention is in canSelectItem()
    if (maxSelections !== undefined && count > maxSelections) {
      return { 
        isValid: false, 
        message: `Please select no more than ${maxSelections} option${maxSelections > 1 ? 's' : ''}` 
      };
    }
  }
  
  // Tap mode has no validation requirements
  // All other cases are valid
  return { isValid: true, message: null };
}

/**
 * Check if an item can be selected in MultiSelect mode.
 * 
 * This function enforces the `maxSelections` constraint by preventing
 * selection of additional items when the maximum is reached.
 * 
 * Rules:
 * - Items that are already selected can always be deselected
 * - New items can only be selected if under the maxSelections limit
 * 
 * @param index - The index of the item to check
 * @param selectedIndices - Array of currently selected indices
 * @param maxSelections - Maximum number of selections allowed (optional)
 * @returns true if the item can be selected/toggled, false otherwise
 * 
 * @example
 * ```typescript
 * // Can deselect an already selected item (even at max)
 * canSelectItem(0, [0, 1, 2], 3);
 * // Returns: true (can deselect)
 * 
 * // Cannot select new item when at max
 * canSelectItem(3, [0, 1, 2], 3);
 * // Returns: false (at max, can't select more)
 * 
 * // Can select when under max
 * canSelectItem(3, [0, 1], 3);
 * // Returns: true (under max)
 * ```
 * 
 * @see Requirement 7.5
 */
export function canSelectItem(
  index: number,
  selectedIndices: number[],
  maxSelections?: number
): boolean {
  // Can always deselect an already selected item
  if (selectedIndices.includes(index)) {
    return true;
  }
  
  // Check if at max selections
  if (maxSelections !== undefined && selectedIndices.length >= maxSelections) {
    return false;  // At max, can't select more
  }
  
  return true;
}

// ─────────────────────────────────────────────────────────────────
// State Derivation Functions
// ─────────────────────────────────────────────────────────────────

/**
 * Derive visual states for all items based on mode and selection state.
 * 
 * This is the core state derivation logic that transforms controlled props
 * (mode, selectedIndex, selectedIndices) into visual states for each child item.
 * The Set component uses this to determine what visual state to pass to each
 * Button-VerticalList-Item child.
 * 
 * State derivation rules by mode:
 * 
 * **Tap Mode**:
 * - All items are always in `rest` state
 * - No selection tracking
 * 
 * **Select Mode**:
 * - No selection (selectedIndex === null): All items in `rest` state
 * - Selection exists: Selected item is `selected`, all others are `notSelected`
 * 
 * **MultiSelect Mode**:
 * - Items in selectedIndices array are `checked`
 * - Items not in selectedIndices array are `unchecked`
 * 
 * @param mode - The selection mode ('tap', 'select', or 'multiSelect')
 * @param selectedIndex - The selected index for Select mode (null if no selection)
 * @param selectedIndices - Array of selected indices for MultiSelect mode
 * @param itemCount - Total number of items in the list
 * @returns Array of VisualState values, one for each item
 * 
 * @example
 * ```typescript
 * // Tap mode - all items rest
 * deriveItemStates('tap', null, [], 3);
 * // Returns: ['rest', 'rest', 'rest']
 * 
 * // Select mode - no selection
 * deriveItemStates('select', null, [], 3);
 * // Returns: ['rest', 'rest', 'rest']
 * 
 * // Select mode - item 1 selected
 * deriveItemStates('select', 1, [], 3);
 * // Returns: ['notSelected', 'selected', 'notSelected']
 * 
 * // MultiSelect mode - items 0 and 2 checked
 * deriveItemStates('multiSelect', null, [0, 2], 3);
 * // Returns: ['checked', 'unchecked', 'checked']
 * ```
 * 
 * @see Requirements 3.1, 4.1, 4.2, 5.1, 9.6
 */
export function deriveItemStates(
  mode: SelectionMode,
  selectedIndex: number | null,
  selectedIndices: number[],
  itemCount: number
): VisualState[] {
  switch (mode) {
    case 'tap':
      // Tap mode: All items always in rest state
      // No selection tracking - items are simple action buttons
      return Array(itemCount).fill('rest');
      
    case 'select':
      // Select mode: Single-selection (radio-button style)
      if (selectedIndex === null) {
        // No selection - all items in rest state
        return Array(itemCount).fill('rest');
      }
      // Selection exists - selected item is 'selected', others are 'notSelected'
      return Array(itemCount).fill(null).map((_, i) => 
        i === selectedIndex ? 'selected' : 'notSelected'
      );
      
    case 'multiSelect':
      // MultiSelect mode: Multiple-selection (checkbox style)
      // Items in selectedIndices are 'checked', others are 'unchecked'
      return Array(itemCount).fill(null).map((_, i) =>
        selectedIndices.includes(i) ? 'checked' : 'unchecked'
      );
      
    default:
      // Fallback to rest state for unknown modes
      return Array(itemCount).fill('rest');
  }
}
