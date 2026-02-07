/**
 * Input-Radio-Set Web Component
 * 
 * Web platform implementation of the Input-Radio-Set component using Web Components.
 * Orchestrates child Input-Radio-Base components to provide group behavior including
 * mutual exclusivity, keyboard navigation, and validation.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Pattern (Set)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Radio-Set
 * 
 * Architectural Principle: ORCHESTRATION, NOT DUPLICATION
 * This component uses slot-based composition to render child Input-Radio-Base
 * elements. It does NOT duplicate radio circle/dot rendering logic from Base.
 * 
 * Features:
 * - Shadow DOM with <slot> for child composition
 * - role="radiogroup" for accessibility
 * - Attribute reflection for reactive updates
 * - Error message display with role="alert"
 * 
 * DesignerPunk Philosophy: NO DISABLED STATES
 * 
 * @module Input-Radio-Set/platforms/web
 * @see Requirements: 9.1, 9.2, 11.1 in .kiro/specs/047-input-radio-base/requirements.md
 */

import {
  INPUT_RADIO_SET_OBSERVED_ATTRIBUTES,
  INPUT_RADIO_SET_DEFAULTS
} from '../../types';

import type {
  RadioSize
} from '../../../Input-Radio-Base/types';

// Import CSS as string for browser bundle compatibility
// The esbuild CSS-as-string plugin transforms this import into a JS string export
import radioSetStyles from './InputRadioSet.web.css';

/** Counter for generating unique IDs for error message elements */
let radioSetIdCounter = 0;

/**
 * Input-Radio-Set Web Component
 * 
 * Custom element implementing a radio group container with Shadow DOM encapsulation
 * and slot-based child composition. Orchestrates child Input-Radio-Base elements
 * without duplicating their rendering logic.
 * 
 * @example
 * ```html
 * <input-radio-set selected-value="option-a" size="md">
 *   <input-radio-base label="Option A" value="option-a"></input-radio-base>
 *   <input-radio-base label="Option B" value="option-b"></input-radio-base>
 *   <input-radio-base label="Option C" value="option-c"></input-radio-base>
 * </input-radio-set>
 * ```
 * 
 * @see Requirement 9.1 - Orchestrate child Input-Radio-Base components
 * @see Requirement 9.2 - Apply role="radiogroup" for accessibility
 * @see Requirement 11.1 - Slot-based composition on web
 */
export class InputRadioSetElement extends HTMLElement {
  /** Shadow DOM root */
  private _shadowRoot: ShadowRoot;

  /** Generated unique ID for error message element */
  private _errorMessageId: string;

  /** Cached reference to the container element */
  private _container: HTMLElement | null = null;

  /** Cached reference to the error message element */
  private _errorMessageEl: HTMLElement | null = null;

  /** Selection change callback (JS property, not attribute) */
  onSelectionChange: ((value: string | null) => void) | null = null;

  /** Index of the currently focused radio within the group (roving tabindex) */
  private _focusedIndex: number = 0;

  /** Bound handler for child radio selection events */
  private _onChildSelect = this._handleChildSelect.bind(this);

  constructor() {
    super();

    // Attach shadow DOM for style encapsulation
    // delegatesFocus: true enables proper tab navigation into slotted children
    this._shadowRoot = this.attachShadow({ mode: 'open', delegatesFocus: true });

    // Generate unique ID for error message element (for aria-describedby)
    this._errorMessageId = `radio-set-error-${++radioSetIdCounter}`;
  }

  // ---------------------------------------------------------------------------
  // Observed Attributes
  // ---------------------------------------------------------------------------

  static get observedAttributes(): string[] {
    return [...INPUT_RADIO_SET_OBSERVED_ATTRIBUTES];
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Called when element is connected to the DOM.
   * 
   * Creates the Shadow DOM structure with slot for child composition,
   * applies initial state, begins listening for child selection events,
   * and sets up keyboard navigation with roving tabindex.
   * 
   * @see Requirement 9.1 - Orchestrate child Input-Radio-Base components
   * @see Requirement 11.1 - Slot-based composition on web
   * @see Requirement 10.1-10.9 - Keyboard navigation
   */
  connectedCallback(): void {
    this._createDOM();

    // Listen for 'select' events bubbling from child Input-Radio-Base components.
    // The event is composed: true so it crosses shadow DOM boundaries.
    // @see Requirement 9.3, 9.4, 9.5 - Selection state coordination
    this.addEventListener('select', this._onChildSelect);

    // Listen for keyboard events for roving tabindex navigation
    // @see Requirement 10.1-10.9 - Keyboard navigation
    this.addEventListener('keydown', this._handleKeyDown);

    // Listen for focus events to track which child has focus
    // @see Requirement 10.1 - Tab enters group on selected or first item
    this.addEventListener('focusin', this._handleFocusIn);

    // Propagate initial selection state to children and set up tabindex
    this._syncChildrenSelection();
    this._initializeTabIndices();
  }

  disconnectedCallback(): void {
    this.removeEventListener('select', this._onChildSelect);
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('focusin', this._handleFocusIn);
  }

  /**
   * Called when an observed attribute changes.
   * 
   * Updates the DOM to reflect attribute changes. When 'selected-value'
   * changes, propagates the new selection state to child radios and
   * re-initializes roving tabindex.
   * 
   * @see Requirement 9.1 - Reactive attribute updates
   * @see Requirement 9.3 - Pass selected={true} to matching child
   * @see Requirement 10.1 - Tab enters group on selected item
   */
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (oldValue === newValue) return;
    if (this.isConnected) {
      this._updateDOM();

      // When selected-value or size changes, sync children
      if (name === 'selected-value' || name === 'size') {
        this._syncChildrenSelection();
      }

      // When selected-value changes, update roving tabindex so Tab
      // enters the group on the newly selected item
      // @see Requirement 10.1 - Tab enters on selected item
      if (name === 'selected-value') {
        this._initializeTabIndices();
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Property Accessors (attribute reflection)
  // ---------------------------------------------------------------------------

  /**
   * Currently selected value.
   * 
   * Reflects the 'selected-value' attribute.
   * @see Requirement 9.3 - Pass selected={true} to matching child
   */
  get selectedValue(): string | null {
    return this.getAttribute('selected-value') ?? INPUT_RADIO_SET_DEFAULTS.selectedValue;
  }

  set selectedValue(value: string | null) {
    if (value !== null) {
      this.setAttribute('selected-value', value);
    } else {
      this.removeAttribute('selected-value');
    }
  }

  /**
   * Whether a selection is required.
   * 
   * Reflects the 'required' attribute.
   * @see Requirement 9.7 - Required validation
   */
  get required(): boolean {
    return this.hasAttribute('required');
  }

  set required(value: boolean) {
    if (value) {
      this.setAttribute('required', '');
    } else {
      this.removeAttribute('required');
    }
  }

  /**
   * Error state indicator.
   * 
   * Reflects the 'error' attribute.
   * @see Requirement 9.8 - Display errorMessage when error is true
   */
  get error(): boolean {
    return this.hasAttribute('error');
  }

  set error(value: boolean) {
    if (value) {
      this.setAttribute('error', '');
    } else {
      this.removeAttribute('error');
    }
  }

  /**
   * Error message.
   * 
   * Reflects the 'error-message' attribute.
   * @see Requirement 9.8, 9.9 - Error message display with role="alert"
   */
  get errorMessage(): string | null {
    return this.getAttribute('error-message');
  }

  set errorMessage(value: string | null) {
    if (value) {
      this.setAttribute('error-message', value);
    } else {
      this.removeAttribute('error-message');
    }
  }

  /**
   * Size variant applied to all children.
   * 
   * Reflects the 'size' attribute.
   * @see Requirement 9.10 - Size propagated to all child radios
   */
  get size(): RadioSize {
    const attr = this.getAttribute('size');
    if (attr === 'sm' || attr === 'md' || attr === 'lg') return attr;
    return INPUT_RADIO_SET_DEFAULTS.size;
  }

  set size(value: RadioSize) {
    this.setAttribute('size', value);
  }

  /**
   * Test ID for automated testing.
   * 
   * Reflects the 'test-id' attribute.
   */
  get testID(): string | null {
    return this.getAttribute('test-id');
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  /**
   * Validate the radio group selection state.
   *
   * Checks if the `required` constraint is satisfied. When `required` is true
   * and no radio is selected, validation fails. Sets the `error` and
   * `errorMessage` attributes accordingly.
   *
   * @returns `true` if valid, `false` if validation fails
   * @see Requirement 9.7 - Required validation (fail if no selection)
   * @see Requirement 9.8 - Display errorMessage when error is true
   * @see Requirement 9.9 - role="alert" for screen reader announcement
   */
  validate(): boolean {
    if (this.required && (this.selectedValue === null || this.selectedValue === '')) {
      this.error = true;
      if (!this.errorMessage) {
        this.errorMessage = 'Please select an option';
      }
      return false;
    }

    // Clear error state when valid
    this.error = false;
    return true;
  }

  /**
   * Check validity without modifying error state.
   *
   * Returns whether the current selection satisfies the `required` constraint
   * without setting error attributes. Useful for programmatic checks.
   *
   * @returns `true` if valid, `false` if validation would fail
   * @see Requirement 9.7 - Required validation
   */
  checkValidity(): boolean {
    if (this.required && (this.selectedValue === null || this.selectedValue === '')) {
      return false;
    }
    return true;
  }


  set testID(value: string | null) {
    if (value) {
      this.setAttribute('test-id', value);
    } else {
      this.removeAttribute('test-id');
    }
  }

  // ---------------------------------------------------------------------------
  // DOM Creation and Updates
  // ---------------------------------------------------------------------------

  /**
   * Create the initial Shadow DOM structure.
   * 
   * Uses slot-based composition: child Input-Radio-Base elements are rendered
   * via a <slot> element. The Set does NOT duplicate radio rendering logic.
   * 
   * Structure:
   * - Container div with role="radiogroup"
   * - Error message element with role="alert" (hidden by default)
   * - <slot> for child Input-Radio-Base elements
   * 
   * @see Requirement 9.1 - Orchestrate child components (not duplicate)
   * @see Requirement 9.2 - Apply role="radiogroup"
   * @see Requirement 11.1 - Slot-based composition on web
   */
  private _createDOM(): void {
    const testId = this.testID;
    const testIdAttr = testId ? ` data-testid="${testId}"` : '';

    this._shadowRoot.innerHTML = `
      <style>${radioSetStyles}</style>
      <div
        class="radio-set"
        role="radiogroup"${testIdAttr}
      >
        <div
          class="radio-set__error"
          id="${this._errorMessageId}"
          role="alert"
        ></div>
        <slot></slot>
      </div>
    `;

    // Cache element references for incremental updates
    this._container = this._shadowRoot.querySelector('.radio-set');
    this._errorMessageEl = this._shadowRoot.querySelector('.radio-set__error');

    // Apply initial state
    this._updateDOM();
  }

  /**
   * Update the DOM to reflect current attribute state.
   * 
   * Incrementally updates cached element references rather than
   * re-rendering the entire Shadow DOM.
   */
  private _updateDOM(): void {
    if (!this._container || !this._errorMessageEl) return;

    const isError = this.error;
    const errorMsg = this.errorMessage;
    const testId = this.testID;

    // Update error state class
    if (isError && errorMsg) {
      this._container.classList.add('radio-set--error');
    } else {
      this._container.classList.remove('radio-set--error');
    }

    // Update error message content
    // @see Requirement 9.8 - Display errorMessage when error is true
    // @see Requirement 9.9 - role="alert" for screen reader announcement
    this._errorMessageEl.textContent = (isError && errorMsg) ? errorMsg : '';

    // Associate error message with radiogroup via aria-describedby
    if (isError && errorMsg) {
      this._container.setAttribute('aria-describedby', this._errorMessageId);
    } else {
      this._container.removeAttribute('aria-describedby');
    }

    // Update test-id
    if (testId) {
      this._container.setAttribute('data-testid', testId);
    } else {
      this._container.removeAttribute('data-testid');
    }
  }

  // ---------------------------------------------------------------------------
  // Selection State Coordination
  // ---------------------------------------------------------------------------

  /**
   * Get all child Input-Radio-Base elements (light DOM children).
   *
   * Returns only direct children that are <input-radio-base> elements.
   */
  private _getChildRadios(): HTMLElement[] {
    return Array.from(this.querySelectorAll('input-radio-base'));
  }

  /**
   * Handle selection events from child Input-Radio-Base components.
   *
   * Listens for the 'select' custom event dispatched by Input-Radio-Base
   * when a user clicks/activates a radio. Implements mutual exclusivity
   * by updating selectedValue and syncing all children.
   *
   * @see Requirement 9.3 - Pass selected={true} to matching child
   * @see Requirement 9.4 - Call onSelectionChange with selected value
   * @see Requirement 9.5 - Mutual exclusivity (only one selected at a time)
   * @see Requirement 9.6 - Prevent deselection when clicking already-selected radio
   */
  private _handleChildSelect(event: Event): void {
    const customEvent = event as CustomEvent<{ value: string; selected: boolean }>;
    const newValue = customEvent.detail?.value;

    if (newValue === undefined || newValue === null) return;

    // Requirement 9.6: Prevent deselection when clicking already-selected radio.
    // If the clicked radio's value matches the current selection, do nothing.
    if (newValue === this.selectedValue) {
      // Re-sync children to ensure the clicked radio stays selected
      // (the native input may have toggled)
      this._syncChildrenSelection();
      return;
    }

    // Update the selected value attribute
    this.selectedValue = newValue;

    // Sync all children to reflect the new selection (mutual exclusivity)
    this._syncChildrenSelection();

    // Requirement 9.4: Call onSelectionChange callback
    this.onSelectionChange?.(newValue);

    // Dispatch a 'change' event from the Set for external listeners
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: newValue },
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * Synchronize selection state across all child Input-Radio-Base elements.
   *
   * Sets the 'selected' attribute on the child whose value matches
   * selectedValue, and removes it from all others. Also propagates
   * the 'size' attribute when set on the group.
   *
   * @see Requirement 9.3 - Pass selected={true} to matching child
   * @see Requirement 9.5 - Mutual exclusivity
   * @see Requirement 9.10 - Size propagated to all child radios
   */
  private _syncChildrenSelection(): void {
    const currentValue = this.selectedValue;
    const groupSize = this.getAttribute('size');
    const children = this._getChildRadios();

    for (const child of children) {
      const childValue = child.getAttribute('value');

      // Sync selection state (mutual exclusivity)
      if (childValue === currentValue && currentValue !== null) {
        child.setAttribute('selected', '');
      } else {
        child.removeAttribute('selected');
      }

      // Propagate size from Set to children
      // @see Requirement 9.10
      if (groupSize) {
        child.setAttribute('size', groupSize);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Keyboard Navigation (Roving Tabindex)
  // ---------------------------------------------------------------------------

  /**
   * Initialize roving tabindex on child radios.
   *
   * Sets tabindex="0" on the selected radio (or first radio if none selected)
   * and tabindex="-1" on all others. This implements the WAI-ARIA radio group
   * pattern where Tab enters the group on the selected/first item.
   *
   * @see Requirement 10.1 - Tab enters on selected item, or first if none selected
   * @see Requirement 10.2 - Tab again exits the radio group
   */
  private _initializeTabIndices(): void {
    const children = this._getChildRadios();
    if (children.length === 0) return;

    const currentValue = this.selectedValue;

    // Find the index of the selected radio, default to 0
    let selectedIndex = -1;
    if (currentValue !== null) {
      selectedIndex = children.findIndex(
        child => child.getAttribute('value') === currentValue
      );
    }

    // If no selection, focus the first radio
    this._focusedIndex = selectedIndex >= 0 ? selectedIndex : 0;

    this._updateTabIndices(children, this._focusedIndex);
  }

  /**
   * Update tabindex values for roving tabindex pattern.
   *
   * Sets tabindex="0" on the focused item and tabindex="-1" on all others.
   * This ensures only one radio in the group is in the tab order at a time.
   *
   * @param items - Array of child Input-Radio-Base elements
   * @param focusedIndex - Index of the item that should have tabindex="0"
   * @see Requirement 10.1 - Tab enters group on selected/first item
   * @see Requirement 10.2 - Tab exits the radio group
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
   * Handle keydown events for radio group keyboard navigation.
   *
   * Implements the WAI-ARIA radio group keyboard pattern:
   * - Arrow Down/Right: Move focus to next radio (with wrap)
   * - Arrow Up/Left: Move focus to previous radio (with wrap)
   * - Space: Select the focused radio
   * - Home: Move focus to first radio
   * - End: Move focus to last radio
   *
   * @see Requirement 10.1-10.9 - Keyboard navigation
   */
  private _handleKeyDown = (event: KeyboardEvent): void => {
    const children = this._getChildRadios();
    const itemCount = children.length;

    if (itemCount === 0) return;

    const result = this._processKeyboardNavigation(event, itemCount);

    // If the key wasn't handled, let it propagate normally
    if (!result.handled) return;

    // Prevent default browser behavior for handled keys
    event.preventDefault();

    // Update focus if the index changed
    if (result.newFocusIndex !== this._focusedIndex) {
      this._moveFocusToIndex(result.newFocusIndex, children);
    }

    // Select the focused radio on Space
    if (result.shouldSelect) {
      this._selectRadioAtIndex(this._focusedIndex, children);
    }
  };

  /**
   * Process a keyboard event and determine the navigation action.
   *
   * Pure logic function that maps key presses to navigation outcomes.
   * Separated from DOM manipulation for clarity and testability.
   *
   * @param event - The keyboard event
   * @param itemCount - Total number of radio items in the group
   * @returns Navigation result with new focus index and action flags
   *
   * @see Requirement 10.3 - Arrow Down/Right moves to next radio
   * @see Requirement 10.4 - Arrow Up/Left moves to previous radio
   * @see Requirement 10.5 - Wrap from last to first
   * @see Requirement 10.6 - Wrap from first to last
   * @see Requirement 10.7 - Space selects focused radio
   * @see Requirement 10.8 - Home moves to first radio
   * @see Requirement 10.9 - End moves to last radio
   */
  private _processKeyboardNavigation(
    event: KeyboardEvent,
    itemCount: number
  ): { newFocusIndex: number; shouldSelect: boolean; handled: boolean } {
    const currentIndex = this._focusedIndex;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        // Move focus to next radio, wrap to first if at end
        // @see Requirement 10.3 - Arrow Down/Right to next radio
        // @see Requirement 10.5 - Wrap from last to first
        return {
          newFocusIndex: (currentIndex + 1) % itemCount,
          shouldSelect: false,
          handled: true
        };

      case 'ArrowUp':
      case 'ArrowLeft':
        // Move focus to previous radio, wrap to last if at beginning
        // @see Requirement 10.4 - Arrow Up/Left to previous radio
        // @see Requirement 10.6 - Wrap from first to last
        return {
          newFocusIndex: (currentIndex - 1 + itemCount) % itemCount,
          shouldSelect: false,
          handled: true
        };

      case 'Home':
        // Move focus to first radio
        // @see Requirement 10.8 - Home moves to first radio
        return {
          newFocusIndex: 0,
          shouldSelect: false,
          handled: true
        };

      case 'End':
        // Move focus to last radio
        // @see Requirement 10.9 - End moves to last radio
        return {
          newFocusIndex: itemCount - 1,
          shouldSelect: false,
          handled: true
        };

      case ' ':
        // Select the focused radio
        // @see Requirement 10.7 - Space selects focused radio
        return {
          newFocusIndex: currentIndex,
          shouldSelect: true,
          handled: true
        };

      default:
        return {
          newFocusIndex: currentIndex,
          shouldSelect: false,
          handled: false
        };
    }
  }

  /**
   * Move focus to a specific radio by index using roving tabindex.
   *
   * Updates tabindex values so only the target radio has tabindex="0",
   * then moves DOM focus to it.
   *
   * @param newIndex - The index to focus
   * @param children - Array of child radio elements
   * @see Requirement 10.3-10.6 - Arrow key navigation with wrap
   */
  private _moveFocusToIndex(newIndex: number, children?: HTMLElement[]): void {
    const items = children || this._getChildRadios();

    if (items.length === 0 || newIndex < 0 || newIndex >= items.length) return;

    // Update internal state
    this._focusedIndex = newIndex;

    // Update tabindex values (roving tabindex pattern)
    this._updateTabIndices(items, newIndex);

    // Move DOM focus to the target radio
    const targetItem = items[newIndex];
    if (targetItem) {
      targetItem.focus();
    }
  }

  /**
   * Select the radio at the given index.
   *
   * Programmatically triggers selection on the child Input-Radio-Base
   * at the specified index. This is used when Space is pressed on a
   * focused radio.
   *
   * @param index - The index of the radio to select
   * @param children - Array of child radio elements
   * @see Requirement 10.7 - Space selects focused radio
   */
  private _selectRadioAtIndex(index: number, children?: HTMLElement[]): void {
    const items = children || this._getChildRadios();

    if (index < 0 || index >= items.length) return;

    const targetRadio = items[index];
    const value = targetRadio.getAttribute('value');

    if (value === null) return;

    // Don't re-select if already selected (radio convention)
    // @see Requirement 9.6 - Prevent deselection of already-selected radio
    if (value === this.selectedValue) return;

    // Update selection
    this.selectedValue = value;
    this._syncChildrenSelection();

    // Fire callbacks and events
    this.onSelectionChange?.(value);
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value },
        bubbles: true,
        composed: true
      })
    );
  }

  /**
   * Handle focusin events to track which child radio has focus.
   *
   * Updates the internal focused index when focus moves to a child radio
   * (e.g., via mouse click). This keeps the roving tabindex in sync with
   * actual DOM focus.
   *
   * @param event - The focus event
   * @see Requirement 10.1 - Tab enters group on selected/first item
   */
  private _handleFocusIn = (event: FocusEvent): void => {
    const target = event.target as HTMLElement;

    // Check if the focus target is a child Input-Radio-Base
    const radio = target.closest('input-radio-base');
    if (!radio) return;

    const children = this._getChildRadios();
    const index = children.indexOf(radio as HTMLElement);

    if (index !== -1 && index !== this._focusedIndex) {
      this._focusedIndex = index;
      this._updateTabIndices(children, index);
    }
  };
}

// Register custom element
// @see Requirement 9.1 - Register as <input-radio-set> custom element
if (!customElements.get('input-radio-set')) {
  customElements.define('input-radio-set', InputRadioSetElement);
}
