/**
 * Button-VerticalList-Set Web Component
 * 
 * Stemma System: Buttons Family
 * Component Type: Pattern (VerticalList-Set)
 * Custom Element Tag: <button-vertical-list-set>
 * 
 * Container/orchestrator component that manages selection behavior,
 * state coordination, animations, keyboard navigation, and accessibility
 * for vertical list button groups.
 * 
 * RENDERING ARCHITECTURE:
 * Uses incremental DOM updates rather than full re-renders to enable CSS transitions.
 * - _createDOM(): Called once on first render, creates the full DOM structure
 * - _updateDOM(): Called on attribute changes, updates only changed properties
 * This preserves DOM element identity, allowing CSS transitions to animate smoothly.
 * 
 * @module Button-VerticalList-Set/platforms/web
 * @see Requirements: 2.1, 2.6, 11.2
 */

/// <reference lib="dom" />

import type { 
  SelectionMode, 
  SetInternalState
} from '../../types';

import { deriveItemStates } from '../../types';

// Import CSS as string for browser bundle compatibility
// The esbuild CSS-as-string plugin transforms this import into a JS string export
import componentStyles from './Button-VerticalList-Set.styles.css';

/**
 * Get the ARIA role for the container based on mode.
 * 
 * @param mode - The selection mode
 * @returns The appropriate ARIA role
 * @see Requirements: 2.1, 3.4, 4.6, 5.4
 */
function getContainerRole(mode: SelectionMode): string {
  switch (mode) {
    case 'tap':
      return 'group';
    case 'select':
      return 'radiogroup';
    case 'multiSelect':
      return 'group';
    default:
      return 'group';
  }
}

/**
 * Button-VerticalList-Set Web Component
 * 
 * A native web component that orchestrates selection behavior and coordinates
 * visual states across child Button-VerticalList-Item components.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Follows controlled component pattern (parent manages state)
 * - Coordinates animation timing across children
 * - Manages keyboard navigation with roving tabindex
 * - Provides appropriate ARIA roles based on mode
 * 
 * @example
 * ```html
 * <!-- Tap mode - action buttons -->
 * <button-vertical-list-set mode="tap">
 *   <button-vertical-list-item label="Settings"></button-vertical-list-item>
 *   <button-vertical-list-item label="Help"></button-vertical-list-item>
 * </button-vertical-list-set>
 * 
 * <!-- Select mode - single selection -->
 * <button-vertical-list-set mode="select" selected-index="0">
 *   <button-vertical-list-item label="Option A"></button-vertical-list-item>
 *   <button-vertical-list-item label="Option B"></button-vertical-list-item>
 * </button-vertical-list-set>
 * 
 * <!-- MultiSelect mode - multiple selections -->
 * <button-vertical-list-set mode="multiSelect" selected-indices="[0,2]">
 *   <button-vertical-list-item label="Choice 1"></button-vertical-list-item>
 *   <button-vertical-list-item label="Choice 2"></button-vertical-list-item>
 *   <button-vertical-list-item label="Choice 3"></button-vertical-list-item>
 * </button-vertical-list-set>
 * ```
 * 
 * @see Requirements 2.1, 2.6, 11.2
 */
export class ButtonVerticalListSet extends HTMLElement {
  // ─────────────────────────────────────────────────────────────────
  // Static Properties
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Observed attributes for attribute change callbacks.
   * 
   * When these attributes change, attributeChangedCallback is invoked.
   */
  static get observedAttributes(): string[] {
    return [
      'mode',
      'selected-index',
      'selected-indices',
      'required',
      'min-selections',
      'max-selections',
      'error',
      'error-message',
      'test-id'
    ];
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Private Properties
  // ─────────────────────────────────────────────────────────────────
  
  /** Shadow root reference */
  private _shadowRoot: ShadowRoot;
  
  /** Whether DOM has been created */
  private _domCreated: boolean = false;
  
  // Cached DOM element references for incremental updates
  private _container: HTMLDivElement | null = null;
  private _errorMessageEl: HTMLDivElement | null = null;
  
  // Props (backed by attributes)
  private _mode: SelectionMode = 'tap';
  private _selectedIndex: number | null = null;
  private _selectedIndices: number[] = [];
  private _required: boolean = false;
  private _minSelections?: number;
  private _maxSelections?: number;
  private _error: boolean = false;
  private _errorMessage?: string;
  private _testID?: string;
  
  // Internal state for focus management and animation tracking
  private _internalState: SetInternalState = {
    focusedIndex: 0,
    previousSelectedIndex: null,
    isFirstSelection: true
  };
  
  // Callbacks (set via properties, not attributes)
  private _onItemClick?: (index: number) => void;
  private _onSelectionChange?: (index: number | null) => void;
  private _onMultiSelectionChange?: (indices: number[]) => void;
  
  // Unique ID for error message element (for aria-describedby)
  private _errorMessageId: string;
  
  // ─────────────────────────────────────────────────────────────────
  // Constructor
  // ─────────────────────────────────────────────────────────────────
  
  constructor() {
    super();
    
    // Attach shadow DOM for style encapsulation
    // delegatesFocus: true enables proper tab navigation
    this._shadowRoot = this.attachShadow({ mode: 'open', delegatesFocus: true });
    
    // Generate unique ID for error message element
    this._errorMessageId = `vls-error-${Math.random().toString(36).slice(2, 11)}`;
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Lifecycle Callbacks
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Called when the element is added to the DOM.
   * 
   * Performs initial render and sets up event listeners.
   */
  connectedCallback(): void {
    // Defer rendering until DOM is ready to ensure CSS is applied
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this._render();
      }, { once: true });
    } else {
      this._render();
    }
  }
  
  /**
   * Called when the element is removed from the DOM.
   * 
   * Cleans up event listeners to prevent memory leaks.
   */
  disconnectedCallback(): void {
    this._detachEventListeners();
  }
  
  /**
   * Called when an observed attribute changes.
   * 
   * Triggers incremental DOM update to reflect the new attribute value.
   * 
   * @param name - Attribute name
   * @param oldValue - Previous attribute value
   * @param newValue - New attribute value
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    // Only update if value changed and DOM exists
    if (oldValue === newValue) return;
    
    // Parse attribute values into internal properties
    switch (name) {
      case 'mode':
        this._mode = (newValue as SelectionMode) || 'tap';
        break;
      case 'selected-index':
        this._selectedIndex = newValue !== null ? parseInt(newValue, 10) : null;
        if (isNaN(this._selectedIndex as number)) {
          this._selectedIndex = null;
        }
        break;
      case 'selected-indices':
        try {
          this._selectedIndices = newValue ? JSON.parse(newValue) : [];
        } catch {
          this._selectedIndices = [];
        }
        break;
      case 'required':
        this._required = newValue !== null;
        break;
      case 'min-selections':
        this._minSelections = newValue !== null ? parseInt(newValue, 10) : undefined;
        break;
      case 'max-selections':
        this._maxSelections = newValue !== null ? parseInt(newValue, 10) : undefined;
        break;
      case 'error':
        this._error = newValue !== null;
        break;
      case 'error-message':
        this._errorMessage = newValue || undefined;
        break;
      case 'test-id':
        this._testID = newValue || undefined;
        break;
    }
    
    // Update DOM if it exists
    if (this.isConnected && this._domCreated) {
      this._updateDOM();
    }
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Public Getters/Setters
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Get the selection mode.
   */
  get mode(): SelectionMode {
    return this._mode;
  }
  
  /**
   * Set the selection mode.
   */
  set mode(value: SelectionMode) {
    this._mode = value;
    this.setAttribute('mode', value);
  }
  
  /**
   * Get the selected index (Select mode).
   */
  get selectedIndex(): number | null {
    return this._selectedIndex;
  }
  
  /**
   * Set the selected index (Select mode).
   */
  set selectedIndex(value: number | null) {
    this._selectedIndex = value;
    if (value !== null) {
      this.setAttribute('selected-index', String(value));
    } else {
      this.removeAttribute('selected-index');
    }
  }
  
  /**
   * Get the selected indices (MultiSelect mode).
   */
  get selectedIndices(): number[] {
    return this._selectedIndices;
  }
  
  /**
   * Set the selected indices (MultiSelect mode).
   */
  set selectedIndices(value: number[]) {
    this._selectedIndices = value;
    this.setAttribute('selected-indices', JSON.stringify(value));
  }
  
  /**
   * Get the required flag.
   */
  get required(): boolean {
    return this._required;
  }
  
  /**
   * Set the required flag.
   */
  set required(value: boolean) {
    this._required = value;
    if (value) {
      this.setAttribute('required', '');
    } else {
      this.removeAttribute('required');
    }
  }
  
  /**
   * Get the minimum selections (MultiSelect mode).
   */
  get minSelections(): number | undefined {
    return this._minSelections;
  }
  
  /**
   * Set the minimum selections (MultiSelect mode).
   */
  set minSelections(value: number | undefined) {
    this._minSelections = value;
    if (value !== undefined) {
      this.setAttribute('min-selections', String(value));
    } else {
      this.removeAttribute('min-selections');
    }
  }
  
  /**
   * Get the maximum selections (MultiSelect mode).
   */
  get maxSelections(): number | undefined {
    return this._maxSelections;
  }
  
  /**
   * Set the maximum selections (MultiSelect mode).
   */
  set maxSelections(value: number | undefined) {
    this._maxSelections = value;
    if (value !== undefined) {
      this.setAttribute('max-selections', String(value));
    } else {
      this.removeAttribute('max-selections');
    }
  }
  
  /**
   * Get the error state.
   */
  get error(): boolean {
    return this._error;
  }
  
  /**
   * Set the error state.
   */
  set error(value: boolean) {
    this._error = value;
    if (value) {
      this.setAttribute('error', '');
    } else {
      this.removeAttribute('error');
    }
  }
  
  /**
   * Get the error message.
   */
  get errorMessage(): string | undefined {
    return this._errorMessage;
  }
  
  /**
   * Set the error message.
   */
  set errorMessage(value: string | undefined) {
    this._errorMessage = value;
    if (value) {
      this.setAttribute('error-message', value);
    } else {
      this.removeAttribute('error-message');
    }
  }
  
  /**
   * Get the test ID.
   */
  get testID(): string | undefined {
    return this._testID;
  }
  
  /**
   * Set the test ID.
   */
  set testID(value: string | undefined) {
    this._testID = value;
    if (value) {
      this.setAttribute('test-id', value);
    } else {
      this.removeAttribute('test-id');
    }
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Callback Setters
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Set the onItemClick callback (Tap mode).
   */
  set onItemClick(callback: ((index: number) => void) | undefined) {
    this._onItemClick = callback;
  }
  
  /**
   * Get the onItemClick callback.
   */
  get onItemClick(): ((index: number) => void) | undefined {
    return this._onItemClick;
  }
  
  /**
   * Set the onSelectionChange callback (Select mode).
   */
  set onSelectionChange(callback: ((index: number | null) => void) | undefined) {
    this._onSelectionChange = callback;
  }
  
  /**
   * Get the onSelectionChange callback.
   */
  get onSelectionChange(): ((index: number | null) => void) | undefined {
    return this._onSelectionChange;
  }
  
  /**
   * Set the onMultiSelectionChange callback (MultiSelect mode).
   */
  set onMultiSelectionChange(callback: ((indices: number[]) => void) | undefined) {
    this._onMultiSelectionChange = callback;
  }
  
  /**
   * Get the onMultiSelectionChange callback.
   */
  get onMultiSelectionChange(): ((indices: number[]) => void) | undefined {
    return this._onMultiSelectionChange;
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Rendering (Incremental Update Architecture)
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Main render entry point.
   * 
   * Routes to _createDOM() for first render or _updateDOM() for subsequent updates.
   * This architecture enables CSS transitions by preserving DOM element identity.
   */
  private _render(): void {
    if (!this._domCreated) {
      this._createDOM();
      this._domCreated = true;
      this._attachEventListeners();
    } else {
      this._updateDOM();
    }
  }
  
  /**
   * Create the initial DOM structure (called once).
   * 
   * Creates the shadow DOM structure with container and slot for children.
   * Error message element is always present but hidden when not needed.
   * 
   * @see Requirements 2.1, 11.2
   */
  private _createDOM(): void {
    // Get initial ARIA role based on mode
    const role = getContainerRole(this._mode);
    const ariaMultiSelectable = this._mode === 'multiSelect' ? 'true' : null;
    
    // Create the shadow DOM structure
    // Error message is conditionally rendered (only when errorMessage is provided)
    // Slot receives child Button-VerticalList-Item elements
    this._shadowRoot.innerHTML = `
      <style>${componentStyles}</style>
      <div 
        class="vls-container" 
        role="${role}"
        ${ariaMultiSelectable ? `aria-multiselectable="${ariaMultiSelectable}"` : ''}
      >
        <div 
          class="vls-error-message" 
          id="${this._errorMessageId}" 
          role="alert"
          style="display: none;"
        ></div>
        <slot></slot>
      </div>
    `;
    
    // Cache element references for incremental updates
    this._container = this._shadowRoot.querySelector('.vls-container');
    this._errorMessageEl = this._shadowRoot.querySelector('.vls-error-message');
    
    // Apply initial state
    this._updateDOM();
  }
  
  /**
   * Update existing DOM elements (called on attribute changes).
   * 
   * Only updates properties that need to change, preserving DOM element identity.
   * This enables CSS transitions to animate smoothly between states.
   * 
   * @see Requirements 2.1, 11.2
   */
  private _updateDOM(): void {
    if (!this._container) return;
    
    // Update ARIA role based on mode
    const role = getContainerRole(this._mode);
    this._container.setAttribute('role', role);
    
    // Update aria-multiselectable for multiSelect mode
    if (this._mode === 'multiSelect') {
      this._container.setAttribute('aria-multiselectable', 'true');
    } else {
      this._container.removeAttribute('aria-multiselectable');
    }
    
    // Update error state accessibility attributes
    if (this._error && this._errorMessage) {
      this._container.setAttribute('aria-invalid', 'true');
      this._container.setAttribute('aria-describedby', this._errorMessageId);
    } else {
      this._container.removeAttribute('aria-invalid');
      this._container.removeAttribute('aria-describedby');
    }
    
    // Update test ID
    if (this._testID) {
      this._container.setAttribute('data-testid', this._testID);
    } else {
      this._container.removeAttribute('data-testid');
    }
    
    // Update error message
    if (this._errorMessageEl) {
      if (this._error && this._errorMessage) {
        this._errorMessageEl.textContent = this._errorMessage;
        this._errorMessageEl.style.display = '';
      } else {
        this._errorMessageEl.textContent = '';
        this._errorMessageEl.style.display = 'none';
      }
    }
    
    // Update child items (will be implemented in Task 3)
    // For now, just propagate error state to children
    this._updateChildItems();
  }
  
  /**
   * Update child Button-VerticalList-Item elements.
   * 
   * Propagates visual state, transition delay, error state, and ARIA attributes to children.
   * Uses deriveItemStates() to calculate visual states from controlled props.
   * Also sets up roving tabindex pattern for keyboard navigation.
   * 
   * Communication props passed to children:
   * - `visual-state`: Derived from controlled props (mode, selectedIndex, selectedIndices)
   * - `transition-delay`: Animation timing coordination (calculated in Task 6)
   * - `error`: Error state propagation to all children
   * - `tabindex`: Roving tabindex for keyboard navigation (0 for focused, -1 for others)
   * 
   * @see Requirements 3.1, 4.1, 4.2, 5.1, 7.1, 8.6, 9.6
   */
  private _updateChildItems(): void {
    // Get all slotted children
    const slot = this._shadowRoot.querySelector('slot');
    if (!slot) return;
    
    const children = slot.assignedElements() as HTMLElement[];
    const itemCount = children.length;
    
    // Derive visual states from controlled props
    // This is the core state derivation logic per design document
    const visualStates = deriveItemStates(
      this._mode,
      this._selectedIndex,
      this._selectedIndices,
      itemCount
    );
    
    // Calculate transition delays for animation coordination
    // Full timing logic will be implemented in Task 6 (Animation Coordination)
    // For now, use default delay of 0ms for all items
    const transitionDelays = this._calculateTransitionDelays(itemCount, visualStates);
    
    // Determine ARIA role for items based on mode
    // @see Requirements 3.4, 4.7, 5.5
    const itemRole = this._getItemRole();
    
    // Ensure focused index is within bounds
    // @see Requirement 8.6: Roving tabindex pattern
    if (this._internalState.focusedIndex >= itemCount) {
      this._internalState.focusedIndex = Math.max(0, itemCount - 1);
    }
    
    // Update each child with derived state
    children.forEach((child, index) => {
      if (child.tagName.toLowerCase() === 'button-vertical-list-item') {
        // Set visual state derived from controlled props
        // @see Requirements 9.6: "derive child visual states from controlled props"
        const visualState = visualStates[index];
        child.setAttribute('visual-state', visualState);
        
        // Set transition delay for animation coordination
        // @see Requirements 6.1, 6.2, 6.3, 6.4: Animation timing coordination
        const transitionDelay = transitionDelays[index];
        child.setAttribute('transition-delay', String(transitionDelay));
        
        // Propagate error state to all children
        // @see Requirements 7.1: "pass error={true} to all child items"
        if (this._error) {
          child.setAttribute('error', 'true');
        } else {
          child.setAttribute('error', 'false');
        }
        
        // Set ARIA role for the item based on mode
        // @see Requirements 3.4, 4.7, 5.5
        child.setAttribute('role', itemRole);
        
        // Set aria-checked for radio and checkbox roles
        // @see Requirements 4.7, 5.5
        if (itemRole === 'radio' || itemRole === 'checkbox') {
          const isChecked = this._getItemAriaChecked(index, visualState);
          child.setAttribute('aria-checked', isChecked ? 'true' : 'false');
        } else {
          // Button role doesn't use aria-checked
          child.removeAttribute('aria-checked');
        }
        
        // Set tabindex for roving tabindex pattern
        // @see Requirement 8.6: "focused item has tabindex=0, others have tabindex=-1"
        if (index === this._internalState.focusedIndex) {
          child.setAttribute('tabindex', '0');
        } else {
          child.setAttribute('tabindex', '-1');
        }
      }
    });
  }
  
  /**
   * Get the ARIA role for child items based on mode.
   * 
   * Role mapping:
   * - Tap mode: 'button' (simple action buttons)
   * - Select mode: 'radio' (single-selection radio-button style)
   * - MultiSelect mode: 'checkbox' (multiple-selection checkbox style)
   * 
   * @returns The ARIA role for child items
   * @see Requirements 3.4, 4.7, 5.5
   */
  private _getItemRole(): 'button' | 'radio' | 'checkbox' {
    switch (this._mode) {
      case 'tap':
        return 'button';
      case 'select':
        return 'radio';
      case 'multiSelect':
        return 'checkbox';
      default:
        return 'button';
    }
  }
  
  /**
   * Determine if an item should have aria-checked="true".
   * 
   * For Select mode (radio): Item is checked if it's the selected item
   * For MultiSelect mode (checkbox): Item is checked if it's in the selectedIndices array
   * 
   * @param index - The index of the item
   * @param visualState - The visual state of the item
   * @returns true if the item should be aria-checked="true"
   * @see Requirements 4.7, 5.5
   */
  private _getItemAriaChecked(index: number, visualState: string): boolean {
    switch (this._mode) {
      case 'select':
        // In Select mode, item is checked if it's the selected item
        // Visual states 'selected' indicates the item is checked
        return visualState === 'selected';
      case 'multiSelect':
        // In MultiSelect mode, item is checked if it's in the selectedIndices array
        // Visual state 'checked' indicates the item is checked
        return visualState === 'checked';
      default:
        // Tap mode doesn't use aria-checked
        return false;
    }
  }
  
  /**
   * Calculate transition delays for animation coordination.
   * 
   * This method provides the communication mechanism for passing transition delays
   * to child items. The actual timing logic will be implemented in Task 6.
   * 
   * Animation timing rules (to be implemented in Task 6):
   * - Selection change: Deselecting item gets 0ms, selecting item gets 125ms (staggered)
   * - First selection: All items get 0ms (simultaneous)
   * - Deselection: All items get 0ms (simultaneous)
   * - MultiSelect toggle: Toggled item gets 0ms (independent)
   * 
   * @param itemCount - Number of child items
   * @param visualStates - Array of visual states for each item
   * @returns Array of transition delays in milliseconds
   * @see Requirements 6.1, 6.2, 6.3, 6.4
   */
  private _calculateTransitionDelays(itemCount: number, visualStates: string[]): number[] {
    // Default: All items have 0ms delay
    // Full timing logic will be implemented in Task 6 (Animation Coordination)
    // This placeholder ensures the communication mechanism is in place
    return Array(itemCount).fill(0);
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Event Handling
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Attach event listeners.
   * 
   * Sets up listeners for child item clicks and keyboard navigation.
   * 
   * @see Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
   */
  private _attachEventListeners(): void {
    // Listen for slot changes to update child items
    const slot = this._shadowRoot.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this._handleSlotChange);
    }
    
    // Listen for click events from children (bubbles through slot)
    this.addEventListener('click', this._handleChildClick);
    
    // Listen for keyboard events for navigation
    // @see Requirements 8.1, 8.2, 8.3, 8.4, 8.5
    this.addEventListener('keydown', this._handleKeyDown);
    
    // Listen for focus events to track which item has focus
    // @see Requirement 8.6: Roving tabindex pattern
    this.addEventListener('focusin', this._handleFocusIn);
  }
  
  /**
   * Detach event listeners.
   */
  private _detachEventListeners(): void {
    const slot = this._shadowRoot.querySelector('slot');
    if (slot) {
      slot.removeEventListener('slotchange', this._handleSlotChange);
    }
    
    this.removeEventListener('click', this._handleChildClick);
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('focusin', this._handleFocusIn);
  }
  
  /**
   * Handle slot change events.
   * 
   * Called when children are added or removed from the slot.
   */
  private _handleSlotChange = (): void => {
    // Update child items when slot content changes
    this._updateChildItems();
  };
  
  /**
   * Handle click events from child items.
   * 
   * Determines which child was clicked and invokes appropriate callback
   * based on the current mode.
   * 
   * Mode behaviors:
   * - **Tap**: Invokes onItemClick callback with clicked index
   * - **Select**: Toggles selection (select new item or deselect if same)
   * - **MultiSelect**: Toggles item in selection array (Task 3.4)
   * 
   * @param event - The click event
   * @see Requirements 3.2, 4.2, 4.3, 4.4, 4.5, 9.3, 9.5
   */
  private _handleChildClick = (event: Event): void => {
    // Find the clicked child item
    const target = event.target as HTMLElement;
    
    // Check if the click came from a button-vertical-list-item
    const item = target.closest('button-vertical-list-item');
    if (!item) return;
    
    // Get the index of the clicked item
    const slot = this._shadowRoot.querySelector('slot');
    if (!slot) return;
    
    const children = slot.assignedElements();
    const index = children.indexOf(item);
    
    if (index === -1) return;
    
    // Handle click based on mode
    switch (this._mode) {
      case 'tap':
        // Tap mode: Invoke callback with clicked index
        // No selection state tracking
        // @see Requirements 3.2, 9.5
        if (this._onItemClick) {
          this._onItemClick(index);
        }
        break;
        
      case 'select':
        // Select mode: Single-selection (radio-button style)
        // @see Requirements 4.2, 4.3, 4.4, 4.5, 9.3
        this._handleSelectModeClick(index);
        break;
        
      case 'multiSelect':
        // MultiSelect mode: Multiple-selection (checkbox style)
        // @see Requirements 5.2, 5.3, 9.4
        this._handleMultiSelectModeClick(index);
        break;
    }
  };
  
  /**
   * Handle click in Select mode.
   * 
   * Implements single-selection behavior:
   * - Clicking an unselected item selects it (and deselects any previous selection)
   * - Clicking the currently selected item deselects it (returns to null)
   * 
   * This is a controlled component, so we invoke the callback and let the parent
   * update the selectedIndex prop. The visual state update happens when the
   * attribute changes.
   * 
   * @param clickedIndex - The index of the clicked item
   * @see Requirements 4.2, 4.3, 4.4, 4.5, 9.3
   */
  private _handleSelectModeClick(clickedIndex: number): void {
    // Determine the new selection state
    let newSelectedIndex: number | null;
    
    if (this._selectedIndex === clickedIndex) {
      // Clicking the currently selected item deselects it
      // @see Requirement 4.3: "clicking selected item SHALL reset all items to rest state"
      newSelectedIndex = null;
    } else {
      // Clicking a different item selects it
      // @see Requirement 4.2, 4.4: "selecting an item SHALL set that item to selected state"
      newSelectedIndex = clickedIndex;
    }
    
    // Invoke the callback with the new selection
    // @see Requirement 4.5, 9.3: "SHALL invoke onSelectionChange callback"
    if (this._onSelectionChange) {
      this._onSelectionChange(newSelectedIndex);
    }
  }
  
  /**
   * Handle click in MultiSelect mode.
   * 
   * Implements multiple-selection behavior (checkbox style):
   * - Clicking an unchecked item adds it to the selection (toggles to checked)
   * - Clicking a checked item removes it from the selection (toggles to unchecked)
   * 
   * This is a controlled component, so we invoke the callback and let the parent
   * update the selectedIndices prop. The visual state update happens when the
   * attribute changes.
   * 
   * @param clickedIndex - The index of the clicked item
   * @see Requirements 5.2, 5.3, 9.4
   */
  private _handleMultiSelectModeClick(clickedIndex: number): void {
    // Create a new array to avoid mutating the existing one
    let newSelectedIndices: number[];
    
    if (this._selectedIndices.includes(clickedIndex)) {
      // Item is currently checked - remove it from selection (toggle to unchecked)
      // @see Requirement 5.2: "toggling an item SHALL toggle between checked and unchecked"
      newSelectedIndices = this._selectedIndices.filter(i => i !== clickedIndex);
    } else {
      // Item is currently unchecked - add it to selection (toggle to checked)
      // @see Requirement 5.2: "toggling an item SHALL toggle between checked and unchecked"
      newSelectedIndices = [...this._selectedIndices, clickedIndex];
    }
    
    // Invoke the callback with the complete array of selected indices
    // @see Requirement 5.3, 9.4: "SHALL invoke onMultiSelectionChange callback with array of selected indices"
    if (this._onMultiSelectionChange) {
      this._onMultiSelectionChange(newSelectedIndices);
    }
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Keyboard Navigation
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Handle keyboard events for navigation.
   * 
   * Implements keyboard navigation per WCAG 2.1 AA requirements:
   * - Arrow Up/Down: Move focus between items with wrapping
   * - Home: Move focus to first item
   * - End: Move focus to last item
   * - Enter/Space: Activate the focused item based on mode
   * 
   * @param event - The keyboard event
   * @see Requirements 8.2, 8.3, 8.4, 8.5
   */
  private _handleKeyDown = (event: KeyboardEvent): void => {
    // Get all child items
    const children = this._getChildItems();
    const itemCount = children.length;
    
    // No items to navigate
    if (itemCount === 0) return;
    
    // Process the key and determine action
    const result = this._processKeyboardNavigation(event, itemCount);
    
    // If the key wasn't handled, let it propagate
    if (!result.handled) return;
    
    // Prevent default behavior for handled keys
    event.preventDefault();
    
    // Update focus if needed
    if (result.newFocusIndex !== this._internalState.focusedIndex) {
      this._moveFocusToIndex(result.newFocusIndex, children);
    }
    
    // Activate item if needed (Enter/Space)
    if (result.shouldActivate) {
      this._activateItem(this._internalState.focusedIndex);
    }
  };
  
  /**
   * Process keyboard navigation and determine the action to take.
   * 
   * Implements the key handler logic from the design document:
   * - Arrow Down: Move focus to next item (wrap to first)
   * - Arrow Up: Move focus to previous item (wrap to last)
   * - Home: Move focus to first item
   * - End: Move focus to last item
   * - Enter/Space: Activate the focused item
   * 
   * @param event - The keyboard event
   * @param itemCount - Number of child items
   * @returns Object with newFocusIndex, shouldActivate, and handled flags
   * @see Requirements 8.2, 8.3, 8.4, 8.5
   */
  private _processKeyboardNavigation(
    event: KeyboardEvent,
    itemCount: number
  ): { newFocusIndex: number; shouldActivate: boolean; handled: boolean } {
    const currentIndex = this._internalState.focusedIndex;
    
    switch (event.key) {
      case 'ArrowDown':
        // Move focus to next item, wrap to first if at end
        // @see Requirement 8.2: "Arrow Down SHALL move focus between items"
        return {
          newFocusIndex: (currentIndex + 1) % itemCount,
          shouldActivate: false,
          handled: true
        };
        
      case 'ArrowUp':
        // Move focus to previous item, wrap to last if at beginning
        // @see Requirement 8.2: "Arrow Up SHALL move focus between items"
        return {
          newFocusIndex: (currentIndex - 1 + itemCount) % itemCount,
          shouldActivate: false,
          handled: true
        };
        
      case 'Home':
        // Move focus to first item
        // @see Requirement 8.4: "Home SHALL move focus to first item"
        return {
          newFocusIndex: 0,
          shouldActivate: false,
          handled: true
        };
        
      case 'End':
        // Move focus to last item
        // @see Requirement 8.5: "End SHALL move focus to last item"
        return {
          newFocusIndex: itemCount - 1,
          shouldActivate: false,
          handled: true
        };
        
      case 'Enter':
      case ' ':
        // Activate the focused item
        // @see Requirement 8.3: "Enter/Space SHALL activate or toggle item based on mode"
        return {
          newFocusIndex: currentIndex,
          shouldActivate: true,
          handled: true
        };
        
      default:
        // Key not handled
        return {
          newFocusIndex: currentIndex,
          shouldActivate: false,
          handled: false
        };
    }
  }
  
  /**
   * Move focus to a specific item index.
   * 
   * Updates the internal focused index, updates tabindex values using
   * roving tabindex pattern, and moves DOM focus to the new item.
   * 
   * @param newIndex - The index to focus
   * @param children - Array of child elements (optional, will be fetched if not provided)
   * @see Requirement 8.6: Roving tabindex pattern
   */
  private _moveFocusToIndex(newIndex: number, children?: HTMLElement[]): void {
    const items = children || this._getChildItems();
    
    if (items.length === 0 || newIndex < 0 || newIndex >= items.length) return;
    
    // Update internal state
    this._internalState.focusedIndex = newIndex;
    
    // Update tabindex values (roving tabindex pattern)
    // @see Requirement 8.6: "focused item has tabindex=0, others have tabindex=-1"
    this._updateTabIndices(items, newIndex);
    
    // Move DOM focus to the new item
    const targetItem = items[newIndex];
    if (targetItem) {
      targetItem.focus();
    }
  }
  
  /**
   * Update tabindex values for roving tabindex pattern.
   * 
   * Sets tabindex="0" on the focused item and tabindex="-1" on all others.
   * This ensures only one item is in the tab order at a time.
   * 
   * @param items - Array of child elements
   * @param focusedIndex - Index of the item that should have tabindex="0"
   * @see Requirement 8.6: Roving tabindex pattern
   */
  private _updateTabIndices(items: HTMLElement[], focusedIndex: number): void {
    items.forEach((item, index) => {
      if (index === focusedIndex) {
        item.setAttribute('tabindex', '0');
      } else {
        item.setAttribute('tabindex', '-1');
      }
    });
  }
  
  /**
   * Activate an item at the specified index.
   * 
   * Simulates a click on the item, which triggers the appropriate
   * mode-specific behavior (tap callback, selection change, or toggle).
   * 
   * @param index - The index of the item to activate
   * @see Requirement 8.3: "Enter/Space SHALL activate or toggle item based on mode"
   */
  private _activateItem(index: number): void {
    // Handle activation based on mode (same as click handling)
    switch (this._mode) {
      case 'tap':
        // Tap mode: Invoke callback with index
        if (this._onItemClick) {
          this._onItemClick(index);
        }
        break;
        
      case 'select':
        // Select mode: Toggle selection
        this._handleSelectModeClick(index);
        break;
        
      case 'multiSelect':
        // MultiSelect mode: Toggle item
        this._handleMultiSelectModeClick(index);
        break;
    }
  }
  
  /**
   * Handle focus-in events to track which item has focus.
   * 
   * Updates the internal focused index when focus moves to a child item.
   * This ensures the roving tabindex pattern stays in sync with actual focus.
   * 
   * @param event - The focus event
   * @see Requirement 8.6: Roving tabindex pattern
   */
  private _handleFocusIn = (event: FocusEvent): void => {
    const target = event.target as HTMLElement;
    
    // Check if the focus target is a child item
    const item = target.closest('button-vertical-list-item');
    if (!item) return;
    
    // Get the index of the focused item
    const children = this._getChildItems();
    const index = children.indexOf(item as HTMLElement);
    
    if (index !== -1 && index !== this._internalState.focusedIndex) {
      // Update internal state
      this._internalState.focusedIndex = index;
      
      // Update tabindex values to reflect new focus
      this._updateTabIndices(children, index);
    }
  };
  
  /**
   * Get all child Button-VerticalList-Item elements.
   * 
   * @returns Array of child elements
   */
  private _getChildItems(): HTMLElement[] {
    const slot = this._shadowRoot.querySelector('slot');
    if (!slot) return [];
    
    return slot.assignedElements().filter(
      el => el.tagName.toLowerCase() === 'button-vertical-list-item'
    ) as HTMLElement[];
  }
}

// Register custom element
// Uses conditional check for idempotent registration
if (typeof customElements !== 'undefined' && !customElements.get('button-vertical-list-set')) {
  customElements.define('button-vertical-list-set', ButtonVerticalListSet);
}

/**
 * Default export for convenience.
 */
export default ButtonVerticalListSet;
