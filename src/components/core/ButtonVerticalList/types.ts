/**
 * Button-VerticalList Component Type Definitions
 * 
 * Stemma System naming: [Family]-[Type] = Button-VerticalList
 * Type: Primitive (foundational component)
 * 
 * Shared TypeScript interfaces for the Button-VerticalList component.
 * These types are used across all platform implementations (web, iOS, Android).
 * 
 * The component supports three interaction modes:
 * - Tap: Traditional tap-and-go behavior (immediate action)
 * - Select: Single-selection (radio-button style)
 * - Multi-Select: Multiple-selection (checkbox style)
 * 
 * Design Decisions:
 * - Single component with mode prop (80%+ shared implementation)
 * - Controlled component pattern (selection via props)
 * - Icon component integration for consistent icon rendering
 * 
 * @see .kiro/specs/038-vertical-list-buttons/design.md for component design
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 * @module ButtonVerticalList/types
 */

import { IconBaseName } from '../Icon-Base/types';

/**
 * Button-VerticalList interaction mode variants.
 * 
 * Determines the selection behavior of the button group:
 * - `tap`: Triggers action immediately on tap/click (no selection state)
 * - `select`: Single-selection mode (radio-button style, one item at a time)
 * - `multiSelect`: Multiple-selection mode (checkbox style, any combination)
 * 
 * @example
 * ```typescript
 * const mode: VerticalListButtonMode = 'select'; // Single selection
 * ```
 * 
 * @see Requirements 1.1, 1.2, 1.4
 */
export type VerticalListButtonMode = 'tap' | 'select' | 'multiSelect';

/**
 * Individual button item configuration.
 * 
 * Defines the content and behavior of a single button within the group.
 * Each item must have a unique `id` for selection tracking.
 * 
 * @example
 * ```typescript
 * const item: VerticalListButtonItem = {
 *   id: 'option-1',
 *   label: 'First Option',
 *   description: 'Description text for the first option',
 *   icon: 'settings',
 *   onTap: () => console.log('Option 1 tapped')
 * };
 * ```
 * 
 * @see Requirements 2.1, 2.2, 2.3
 */
export interface VerticalListButtonItem {
  /**
   * Unique identifier for the button.
   * 
   * Used for selection tracking in select/multiSelect modes.
   * Must be unique within the button group.
   * 
   * @required
   */
  id: string;
  
  /**
   * Button label text.
   * 
   * Rendered using `typography.buttonMd` token.
   * This is the primary text content of the button.
   * 
   * @required
   * @see Requirement 2.1
   */
  label: string;
  
  /**
   * Optional description text below label.
   * 
   * Rendered using `typography.bodySm` token with `color.text.secondary`.
   * Provides additional context or explanation for the button option.
   * 
   * @optional
   * @see Requirement 2.2
   */
  description?: string;
  
  /**
   * Optional leading icon.
   * 
   * Rendered in leading position (far left) using the Icon component.
   * Icon size matches `typography.buttonMd` via icon size formula.
   * Icon color has `color.icon.opticalBalance` blend applied.
   * 
   * @optional
   * @see Requirements 2.3, 2.4, 2.5
   */
  icon?: IconBaseName;
  
  /**
   * Action handler for tap mode.
   * 
   * Called when the button is tapped in 'tap' mode.
   * Ignored in 'select' and 'multiSelect' modes (use onSelectionChange instead).
   * 
   * @optional (required for tap mode functionality)
   * @see Requirement 1.1
   */
  onTap?: () => void;
}

/**
 * Props interface for Button-VerticalList component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * Platform-specific implementations use this interface to ensure consistent behavior.
 * 
 * The component uses a controlled pattern for selection state:
 * - Selection state is passed via `selectedIds` prop
 * - Changes are reported via `onSelectionChange` callback
 * - Parent component manages the selection state
 * 
 * @example
 * ```typescript
 * // Tap mode - immediate actions
 * <button-vertical-list
 *   mode="tap"
 *   items={[
 *     { id: '1', label: 'Action 1', onTap: () => doAction1() },
 *     { id: '2', label: 'Action 2', onTap: () => doAction2() }
 *   ]}
 * />
 * 
 * // Select mode - single selection
 * <button-vertical-list
 *   mode="select"
 *   items={options}
 *   selectedIds={[selectedId]}
 *   onSelectionChange={(ids) => setSelectedId(ids[0])}
 * />
 * 
 * // Multi-select mode - multiple selection
 * <button-vertical-list
 *   mode="multiSelect"
 *   items={options}
 *   selectedIds={selectedIds}
 *   onSelectionChange={setSelectedIds}
 * />
 * ```
 * 
 * @see Requirements 1.1, 1.2, 1.4
 */
export interface VerticalListButtonGroupProps {
  /**
   * Interaction mode.
   * 
   * Determines the selection behavior:
   * - 'tap': Triggers action immediately (no selection state)
   * - 'select': Single-selection (one item at a time)
   * - 'multiSelect': Multiple-selection (any combination)
   * 
   * @required
   * @see Requirements 1.1, 1.2, 1.4
   */
  mode: VerticalListButtonMode;
  
  /**
   * Array of button items.
   * 
   * Each item defines the content and behavior of a button in the group.
   * Items are rendered in array order from top to bottom.
   * 
   * @required
   */
  items: VerticalListButtonItem[];
  
  /**
   * Currently selected item ID(s).
   * 
   * For 'select' mode: Array with single ID (or empty for no selection)
   * For 'multiSelect' mode: Array of selected IDs (can be empty or multiple)
   * For 'tap' mode: Ignored (no selection state)
   * 
   * @optional (required for select/multiSelect modes)
   * @see Requirements 1.2, 1.4
   */
  selectedIds?: string[];
  
  /**
   * Selection change handler.
   * 
   * Called when selection changes in 'select' or 'multiSelect' modes.
   * Receives the new array of selected IDs.
   * 
   * For 'select' mode: Array will contain 0 or 1 ID
   * For 'multiSelect' mode: Array will contain 0 or more IDs
   * For 'tap' mode: Not called (use item.onTap instead)
   * 
   * @optional (required for select/multiSelect modes)
   * @see Requirements 1.3, 1.5
   */
  onSelectionChange?: (selectedIds: string[]) => void;
  
  /**
   * Optional test ID for automated testing.
   * 
   * Platform-specific application:
   * - Web: Applied as `data-testid` attribute on container
   * - iOS: Applied via `.accessibilityIdentifier()` modifier
   * - Android: Applied via `testTag` in semantics
   * 
   * @optional
   */
  testID?: string;
}

/**
 * Default prop values for Button-VerticalList component.
 * 
 * Used by platform implementations to apply consistent defaults.
 * 
 * @see Requirements 1.1
 */
export const VERTICAL_LIST_BUTTON_DEFAULTS = {
  /** Default interaction mode */
  mode: 'tap' as VerticalListButtonMode,
  /** Default selected IDs (empty array) */
  selectedIds: [] as string[],
} as const;

/**
 * Internal state interface for Button-VerticalList component.
 * 
 * Used by platform implementations for focus management.
 * Selection state is managed via props (controlled component).
 */
export interface VerticalListButtonInternalState {
  /** Index of currently focused button (-1 if none) */
  focusedIndex: number;
}
