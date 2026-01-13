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
  SetInternalState,
  DerivedItemState 
} from '../../types';

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
    this._errorMessageId = `vls-error-${Math.random().toString(36).substr(2, 9)}`;
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
   * Propagates visual state, error state, and ARIA attributes to children.
   * Full implementation in Task 3 (mode behaviors).
   */
  private _updateChildItems(): void {
    // Get all slotted children
    const slot = this._shadowRoot.querySelector('slot');
    if (!slot) return;
    
    const children = slot.assignedElements() as HTMLElement[];
    
    // Propagate error state to all children
    // Full state derivation will be implemented in Task 3
    children.forEach((child) => {
      if (child.tagName.toLowerCase() === 'button-vertical-list-item') {
        // Propagate error state
        if (this._error) {
          child.setAttribute('error', 'true');
        } else {
          child.setAttribute('error', 'false');
        }
      }
    });
  }
  
  // ─────────────────────────────────────────────────────────────────
  // Event Handling
  // ─────────────────────────────────────────────────────────────────
  
  /**
   * Attach event listeners.
   * 
   * Sets up listeners for child item clicks and keyboard navigation.
   * Full implementation in Tasks 3 (mode behaviors) and 4 (keyboard navigation).
   */
  private _attachEventListeners(): void {
    // Listen for slot changes to update child items
    const slot = this._shadowRoot.querySelector('slot');
    if (slot) {
      slot.addEventListener('slotchange', this._handleSlotChange);
    }
    
    // Listen for click events from children (bubbles through slot)
    this.addEventListener('click', this._handleChildClick);
    
    // Keyboard navigation will be implemented in Task 4
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
   * Determines which child was clicked and invokes appropriate callback.
   * Full implementation in Task 3 (mode behaviors).
   * 
   * @param event - The click event
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
    
    // Handle click based on mode (full implementation in Task 3)
    switch (this._mode) {
      case 'tap':
        if (this._onItemClick) {
          this._onItemClick(index);
        }
        break;
      case 'select':
        // Selection logic will be implemented in Task 3.3
        break;
      case 'multiSelect':
        // Multi-selection logic will be implemented in Task 3.4
        break;
    }
  };
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
