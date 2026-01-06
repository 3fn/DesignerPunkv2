/**
 * Button-VerticalList Component for Web Platform (Vanilla Web Component)
 * 
 * Vertical list of actionable buttons with three interaction modes:
 * - Tap: Traditional tap-and-go behavior (immediate action)
 * - Select: Single-selection (radio-button style)
 * - Multi-Select: Multiple-selection (checkbox style)
 * 
 * Follows True Native Architecture with build-time platform separation.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-VerticalList
 * Component Type: Primitive (foundational component)
 * 
 * Uses <icon-base> web component for icon rendering, following the same component
 * composition pattern as iOS and Android platforms.
 * 
 * Design Decisions:
 * - Single component with mode prop (80%+ shared implementation)
 * - Controlled component pattern (selection via props)
 * - Token-based styling via CSS custom properties
 * - Semantic button elements for accessibility
 * 
 * @module Button-VerticalList/platforms/web
 * @see Requirements: 1.1, 1.2, 1.4
 */

/// <reference lib="dom" />

import {
  VerticalListButtonMode,
  VerticalListButtonItem,
  VerticalListButtonGroupProps,
  VerticalListButtonInternalState,
  VERTICAL_LIST_BUTTON_DEFAULTS
} from '../../types';
// Import Icon-Base to ensure it's registered before ButtonVerticalList uses it
import '../../../Icon-Base/platforms/web/IconBase.web';
import { iconBaseSizes } from '../../../Icon-Base/types';

/**
 * ButtonVerticalList Web Component
 * 
 * A native web component that renders a vertical list of buttons with token-based
 * styling and platform-specific interaction patterns.
 * 
 * @remarks
 * - Uses Shadow DOM for style encapsulation
 * - Semantic `<button>` elements for proper accessibility
 * - Token-based styling via CSS custom properties
 * - Supports three interaction modes: tap, select, multiSelect
 * - Controlled component pattern for selection state
 * - WCAG 2.1 AA compliant:
 *   - Keyboard navigation (Tab, Arrow keys, Enter, Space)
 *   - Focus indicators with 3:1 contrast ratio
 *   - Minimum 48px touch targets
 *   - ARIA roles for screen readers
 * 
 * @example
 * ```html
 * <!-- Tap mode -->
 * <button-vertical-list
 *   mode="tap"
 *   test-id="action-list"
 * ></button-vertical-list>
 * 
 * <!-- Select mode -->
 * <button-vertical-list
 *   mode="select"
 *   test-id="option-list"
 * ></button-vertical-list>
 * ```
 * 
 * @example
 * ```typescript
 * // Programmatic usage
 * const list = document.createElement('button-vertical-list') as ButtonVerticalList;
 * list.mode = 'select';
 * list.items = [
 *   { id: '1', label: 'Option 1' },
 *   { id: '2', label: 'Option 2' }
 * ];
 * list.selectedIds = ['1'];
 * list.addEventListener('selectionchange', (e) => {
 *   console.log('Selection changed:', e.detail.selectedIds);
 * });
 * document.body.appendChild(list);
 * ```
 * 
 * @see Requirements 1.1, 1.2, 1.4
 */
export class ButtonVerticalList extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _items: VerticalListButtonItem[] = [];
  private _selectedIds: string[] = [];
  private _mode: VerticalListButtonMode = VERTICAL_LIST_BUTTON_DEFAULTS.mode;
  private _onSelectionChange?: (selectedIds: string[]) => void;
  private _internalState: VerticalListButtonInternalState = { focusedIndex: -1 };
  
  /**
   * Track previous selection for animation purposes.
   * Used to determine which buttons are transitioning in Select mode.
   * @see Requirements 7.1, 7.2, 7.3, 7.4, 7.5
   */
  private _previousSelectedIds: string[] = [];
  
  /**
   * Observed attributes for automatic re-rendering on change.
   */
  static get observedAttributes(): string[] {
    return ['mode', 'test-id'];
  }
  
  constructor() {
    super();
    
    // Attach shadow DOM for style encapsulation
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }
  
  /**
   * Called when the element is added to the DOM.
   */
  connectedCallback(): void {
    this.render();
    this._attachEventListeners();
  }
  
  /**
   * Called when the element is removed from the DOM.
   */
  disconnectedCallback(): void {
    this._detachEventListeners();
  }
  
  /**
   * Called when an observed attribute changes.
   */
  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue) {
      this.render();
      this._attachEventListeners();
    }
  }
  
  // ============================================================================
  // Property Getters/Setters
  // ============================================================================
  
  /**
   * Get the interaction mode.
   * 
   * @see Requirements 1.1, 1.2, 1.4
   */
  get mode(): VerticalListButtonMode {
    const mode = this.getAttribute('mode');
    return (mode === 'tap' || mode === 'select' || mode === 'multiSelect')
      ? mode
      : VERTICAL_LIST_BUTTON_DEFAULTS.mode;
  }
  
  /**
   * Set the interaction mode.
   */
  set mode(value: VerticalListButtonMode) {
    this.setAttribute('mode', value);
  }
  
  /**
   * Get the button items.
   */
  get items(): VerticalListButtonItem[] {
    return this._items;
  }
  
  /**
   * Set the button items.
   */
  set items(value: VerticalListButtonItem[]) {
    this._items = value;
    this.render();
    this._attachEventListeners();
  }
  
  /**
   * Get the selected item IDs.
   * 
   * @see Requirements 1.2, 1.4
   */
  get selectedIds(): string[] {
    return this._selectedIds;
  }
  
  /**
   * Set the selected item IDs.
   * Tracks previous selection for animation purposes in Select and Multi-Select modes.
   * @see Requirements 7.1, 7.2, 7.3, 7.4, 7.5 (Select mode)
   * @see Requirements 9.1, 9.2, 9.3 (Multi-Select mode)
   */
  set selectedIds(value: string[]) {
    // Store previous selection for animation tracking
    this._previousSelectedIds = [...this._selectedIds];
    this._selectedIds = value;
    
    // In Select mode, apply staggered animations for selection changes
    if (this.mode === 'select' && this._previousSelectedIds.length > 0) {
      this._applySelectModeAnimations();
    } else if (this.mode === 'multiSelect') {
      // In Multi-Select mode, apply independent animations per button
      // @see Requirements 9.1, 9.2, 9.3
      this._applyMultiSelectModeAnimations();
    } else {
      this.render();
      this._attachEventListeners();
    }
  }
  
  /**
   * Get the selection change handler.
   * 
   * @see Requirements 1.3, 1.5
   */
  get onSelectionChange(): ((selectedIds: string[]) => void) | undefined {
    return this._onSelectionChange;
  }
  
  /**
   * Set the selection change handler.
   */
  set onSelectionChange(value: ((selectedIds: string[]) => void) | undefined) {
    this._onSelectionChange = value;
  }
  
  /**
   * Get the test ID.
   */
  get testID(): string | null {
    return this.getAttribute('test-id');
  }
  
  /**
   * Set the test ID.
   */
  set testID(value: string | null) {
    if (value) {
      this.setAttribute('test-id', value);
    } else {
      this.removeAttribute('test-id');
    }
  }
  
  // ============================================================================
  // Selection Logic
  // ============================================================================
  
  /**
   * Handle button click based on mode.
   * 
   * @param item - The clicked button item
   * @see Requirements 1.1, 1.2, 1.3, 1.4, 1.5
   */
  private _handleButtonClick(item: VerticalListButtonItem): void {
    switch (this.mode) {
      case 'tap':
        // Tap mode: trigger action immediately
        // @see Requirement 1.1
        if (item.onTap) {
          item.onTap();
        }
        // Dispatch tap event
        this.dispatchEvent(new CustomEvent('tap', {
          bubbles: true,
          composed: true,
          detail: { itemId: item.id, item }
        }));
        break;
        
      case 'select':
        // Select mode: single selection
        // @see Requirements 1.2, 1.3
        this._updateSelection([item.id]);
        break;
        
      case 'multiSelect':
        // Multi-select mode: toggle selection
        // @see Requirements 1.4, 1.5
        const isSelected = this._selectedIds.includes(item.id);
        const newSelectedIds = isSelected
          ? this._selectedIds.filter(id => id !== item.id)
          : [...this._selectedIds, item.id];
        this._updateSelection(newSelectedIds);
        break;
    }
  }
  
  /**
   * Update selection state and notify listeners.
   * 
   * @param newSelectedIds - The new array of selected IDs
   */
  private _updateSelection(newSelectedIds: string[]): void {
    // Call the callback if provided
    if (this._onSelectionChange) {
      this._onSelectionChange(newSelectedIds);
    }
    
    // Dispatch custom event for external listeners
    this.dispatchEvent(new CustomEvent('selectionchange', {
      bubbles: true,
      composed: true,
      detail: { selectedIds: newSelectedIds }
    }));
  }
  
  /**
   * Check if an item is selected.
   * 
   * @param itemId - The item ID to check
   * @returns True if the item is selected
   */
  private _isSelected(itemId: string): boolean {
    return this._selectedIds.includes(itemId);
  }
  
  // ============================================================================
  // Select Mode Animations
  // ============================================================================
  
  /**
   * Apply staggered animations for Select mode selection changes.
   * 
   * Animation sequence:
   * - T=0: Deselected button border fade-out begins, checkmark removed instantly
   * - T=50%: Newly selected button border fade-in begins
   * - T=100%: Deselected button fade-out completes
   * - T=150%: Newly selected button fade-in completes, checkmark fades in
   * 
   * Uses same animation specs as Button-Icon Secondary hover state:
   * - Duration: duration150 (150ms)
   * - Easing: ease-in-out
   * 
   * @see Requirements 7.1, 7.2, 7.3, 7.4, 7.5
   */
  private _applySelectModeAnimations(): void {
    // Determine which items are transitioning
    const deselectedId = this._previousSelectedIds.find(id => !this._selectedIds.includes(id));
    const newlySelectedId = this._selectedIds.find(id => !this._previousSelectedIds.includes(id));
    
    // If no actual change, just render normally
    if (!deselectedId && !newlySelectedId) {
      this.render();
      this._attachEventListeners();
      return;
    }
    
    // Render with animation classes
    this._renderWithAnimations(deselectedId, newlySelectedId);
    this._attachEventListeners();
  }
  
  /**
   * Render the component with animation classes for Select mode transitions.
   * 
   * @param deselectedId - ID of the button being deselected (or undefined)
   * @param newlySelectedId - ID of the button being selected (or undefined)
   * @see Requirements 7.1, 7.2, 7.3, 7.4, 7.5
   */
  private _renderWithAnimations(deselectedId: string | undefined, newlySelectedId: string | undefined): void {
    const mode = this.mode;
    const items = this._items;
    const testID = this.testID;
    
    // Handle empty items
    if (!items || items.length === 0) {
      this._shadowRoot.innerHTML = '';
      return;
    }
    
    // Generate container attributes based on mode
    const containerRole = this._getContainerRole();
    const containerRoleAttr = containerRole ? ` role="${containerRole}"` : '';
    const testIDAttr = testID ? ` data-testid="${testID}"` : '';
    
    // Generate button HTML with animation classes
    const buttonsHTML = items.map((item, index) => 
      this._renderButtonWithAnimation(item, index, deselectedId, newlySelectedId)
    ).join('');
    
    // Inline CSS for Shadow DOM styling
    const styles = this._generateStyles();
    
    // Render shadow DOM content
    this._shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="button-vertical-list button-vertical-list--${mode}"${containerRoleAttr}${testIDAttr}>
        ${buttonsHTML}
      </div>
    `;
    
    // Schedule the staggered animation for newly selected button
    // T=50% delay (75ms for 150ms duration)
    if (newlySelectedId) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const newlySelectedButton = this._shadowRoot.querySelector(
            `[data-item-id="${newlySelectedId}"]`
          );
          if (newlySelectedButton) {
            newlySelectedButton.classList.remove('button-vertical-list__button--animating-in');
            newlySelectedButton.classList.add('button-vertical-list__button--selected');
          }
        }, 75); // 50% of 150ms duration
      });
    }
  }
  
  /**
   * Render a single button with animation classes for Select mode transitions.
   * 
   * @param item - The button item to render
   * @param index - The button index
   * @param deselectedId - ID of the button being deselected
   * @param newlySelectedId - ID of the button being selected
   * @returns HTML string for the button
   * @see Requirements 7.1, 7.2, 7.3, 7.4, 7.5
   */
  private _renderButtonWithAnimation(
    item: VerticalListButtonItem, 
    index: number,
    deselectedId: string | undefined,
    newlySelectedId: string | undefined
  ): string {
    const isSelected = this._isSelected(item.id);
    const isDeselecting = item.id === deselectedId;
    const isNewlySelecting = item.id === newlySelectedId;
    
    // Determine button state class with animation modifiers
    let stateClass: string;
    if (isDeselecting) {
      // Button is being deselected - start with selected styling, animate out
      // Checkmark is instantly hidden via animation class
      stateClass = 'button-vertical-list__button--animating-out';
    } else if (isNewlySelecting) {
      // Button is being selected - start with not-selected styling, will animate in after delay
      stateClass = 'button-vertical-list__button--animating-in';
    } else if (isSelected) {
      stateClass = 'button-vertical-list__button--selected';
    } else {
      stateClass = 'button-vertical-list__button--not-selected';
    }
    
    // Generate ARIA attributes
    const ariaAttrs = this._getButtonAriaAttributes(isSelected);
    
    // Determine tabindex for roving tabindex pattern
    // @see Requirement 13.1 - Tab focuses first/selected button
    const tabIndex = this._getButtonTabIndex(item.id, index);
    
    // Generate icon HTML if present
    const iconHTML = item.icon 
      ? `<span class="button-vertical-list__icon" aria-hidden="true">
           <icon-base name="${item.icon}" size="${iconBaseSizes.size100}" color="inherit"></icon-base>
         </span>`
      : '';
    
    // Generate description HTML if present
    const descriptionHTML = item.description
      ? `<span class="button-vertical-list__description">${this._escapeHtml(item.description)}</span>`
      : '';
    
    // Generate checkmark HTML for select mode
    const checkmarkHTML = `<span class="button-vertical-list__checkmark" aria-hidden="true">
         <icon-base name="check" size="${iconBaseSizes.size100}" color="inherit"></icon-base>
       </span>`;
    
    return `
      <button
        class="button-vertical-list__button ${stateClass}"
        type="button"
        data-item-id="${item.id}"
        data-index="${index}"
        tabindex="${tabIndex}"
        ${ariaAttrs}
      >
        <span class="button-vertical-list__content">
          ${iconHTML}
          <span class="button-vertical-list__text">
            <span class="button-vertical-list__label">${this._escapeHtml(item.label)}</span>
            ${descriptionHTML}
          </span>
        </span>
        ${checkmarkHTML}
      </button>
    `;
  }
  
  // ============================================================================
  // Multi-Select Mode Animations
  // ============================================================================
  
  /**
   * Apply independent animations for Multi-Select mode selection changes.
   * 
   * Each button animates independently when toggled:
   * - Checkmark fades in when button is checked
   * - Checkmark fades out when button is unchecked
   * 
   * Unlike Select mode which uses staggered animations, Multi-Select mode
   * allows multiple buttons to animate simultaneously and independently.
   * 
   * @see Requirements 9.1, 9.2, 9.3
   */
  private _applyMultiSelectModeAnimations(): void {
    // Determine which items are transitioning
    const newlyCheckedIds = this._selectedIds.filter(id => !this._previousSelectedIds.includes(id));
    const newlyUncheckedIds = this._previousSelectedIds.filter(id => !this._selectedIds.includes(id));
    
    // If no actual change, just render normally
    if (newlyCheckedIds.length === 0 && newlyUncheckedIds.length === 0) {
      this.render();
      this._attachEventListeners();
      return;
    }
    
    // Render with animation classes for Multi-Select mode
    this._renderWithMultiSelectAnimations(newlyCheckedIds, newlyUncheckedIds);
    this._attachEventListeners();
  }
  
  /**
   * Render the component with animation classes for Multi-Select mode transitions.
   * 
   * @param newlyCheckedIds - IDs of buttons being checked
   * @param newlyUncheckedIds - IDs of buttons being unchecked
   * @see Requirements 9.1, 9.2, 9.3
   */
  private _renderWithMultiSelectAnimations(
    newlyCheckedIds: string[],
    newlyUncheckedIds: string[]
  ): void {
    const mode = this.mode;
    const items = this._items;
    const testID = this.testID;
    
    // Handle empty items
    if (!items || items.length === 0) {
      this._shadowRoot.innerHTML = '';
      return;
    }
    
    // Generate container attributes based on mode
    const containerRole = this._getContainerRole();
    const containerRoleAttr = containerRole ? ` role="${containerRole}"` : '';
    const testIDAttr = testID ? ` data-testid="${testID}"` : '';
    
    // Generate button HTML with animation classes
    const buttonsHTML = items.map((item, index) => 
      this._renderMultiSelectButtonWithAnimation(item, index, newlyCheckedIds, newlyUncheckedIds)
    ).join('');
    
    // Inline CSS for Shadow DOM styling
    const styles = this._generateStyles();
    
    // Render shadow DOM content
    this._shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="button-vertical-list button-vertical-list--${mode}"${containerRoleAttr}${testIDAttr}>
        ${buttonsHTML}
      </div>
    `;
    
    // Trigger animations by adding final state classes after initial render
    // This allows CSS transitions to animate from initial to final state
    requestAnimationFrame(() => {
      // For newly checked buttons, transition to checked state
      newlyCheckedIds.forEach(id => {
        const button = this._shadowRoot.querySelector(`[data-item-id="${id}"]`);
        if (button) {
          button.classList.remove('button-vertical-list__button--checking');
          button.classList.add('button-vertical-list__button--checked');
        }
      });
      
      // For newly unchecked buttons, transition to unchecked state
      newlyUncheckedIds.forEach(id => {
        const button = this._shadowRoot.querySelector(`[data-item-id="${id}"]`);
        if (button) {
          button.classList.remove('button-vertical-list__button--unchecking');
          button.classList.add('button-vertical-list__button--unchecked');
        }
      });
    });
  }
  
  /**
   * Render a single button with animation classes for Multi-Select mode transitions.
   * 
   * @param item - The button item to render
   * @param index - The button index
   * @param newlyCheckedIds - IDs of buttons being checked
   * @param newlyUncheckedIds - IDs of buttons being unchecked
   * @returns HTML string for the button
   * @see Requirements 9.1, 9.2, 9.3
   */
  private _renderMultiSelectButtonWithAnimation(
    item: VerticalListButtonItem, 
    index: number,
    newlyCheckedIds: string[],
    newlyUncheckedIds: string[]
  ): string {
    const isSelected = this._isSelected(item.id);
    const isNewlyChecking = newlyCheckedIds.includes(item.id);
    const isNewlyUnchecking = newlyUncheckedIds.includes(item.id);
    
    // Determine button state class with animation modifiers
    let stateClass: string;
    if (isNewlyChecking) {
      // Button is being checked - start with unchecked styling, will animate to checked
      // @see Requirement 9.1
      stateClass = 'button-vertical-list__button--checking';
    } else if (isNewlyUnchecking) {
      // Button is being unchecked - start with checked styling, will animate to unchecked
      // @see Requirement 9.2
      stateClass = 'button-vertical-list__button--unchecking';
    } else if (isSelected) {
      stateClass = 'button-vertical-list__button--checked';
    } else {
      stateClass = 'button-vertical-list__button--unchecked';
    }
    
    // Generate ARIA attributes
    const ariaAttrs = this._getButtonAriaAttributes(isSelected);
    
    // Determine tabindex for roving tabindex pattern
    // @see Requirement 13.1 - Tab focuses first/selected button
    const tabIndex = this._getButtonTabIndex(item.id, index);
    
    // Generate icon HTML if present
    const iconHTML = item.icon 
      ? `<span class="button-vertical-list__icon" aria-hidden="true">
           <icon-base name="${item.icon}" size="${iconBaseSizes.size100}" color="inherit"></icon-base>
         </span>`
      : '';
    
    // Generate description HTML if present
    const descriptionHTML = item.description
      ? `<span class="button-vertical-list__description">${this._escapeHtml(item.description)}</span>`
      : '';
    
    // Generate checkmark HTML for multi-select mode
    const checkmarkHTML = `<span class="button-vertical-list__checkmark" aria-hidden="true">
         <icon-base name="check" size="${iconBaseSizes.size100}" color="inherit"></icon-base>
       </span>`;
    
    return `
      <button
        class="button-vertical-list__button ${stateClass}"
        type="button"
        data-item-id="${item.id}"
        data-index="${index}"
        tabindex="${tabIndex}"
        ${ariaAttrs}
      >
        <span class="button-vertical-list__content">
          ${iconHTML}
          <span class="button-vertical-list__text">
            <span class="button-vertical-list__label">${this._escapeHtml(item.label)}</span>
            ${descriptionHTML}
          </span>
        </span>
        ${checkmarkHTML}
      </button>
    `;
  }
  
  // ============================================================================
  // Rendering
  // ============================================================================
  
  /**
   * Render the component.
   */
  private render(): void {
    const mode = this.mode;
    const items = this._items;
    const testID = this.testID;
    
    // Handle empty items
    if (!items || items.length === 0) {
      this._shadowRoot.innerHTML = '';
      return;
    }
    
    // Generate container attributes based on mode
    const containerRole = this._getContainerRole();
    const containerRoleAttr = containerRole ? ` role="${containerRole}"` : '';
    const testIDAttr = testID ? ` data-testid="${testID}"` : '';
    
    // Generate button HTML
    const buttonsHTML = items.map((item, index) => 
      this._renderButton(item, index)
    ).join('');
    
    // Inline CSS for Shadow DOM styling
    const styles = this._generateStyles();
    
    // Render shadow DOM content
    this._shadowRoot.innerHTML = `
      <style>${styles}</style>
      <div class="button-vertical-list button-vertical-list--${mode}"${containerRoleAttr}${testIDAttr}>
        ${buttonsHTML}
      </div>
    `;
  }
  
  /**
   * Get the ARIA role for the container based on mode.
   * 
   * @returns The ARIA role or null
   * @see Requirements 14.1, 14.2
   */
  private _getContainerRole(): string | null {
    switch (this.mode) {
      case 'select':
        return 'radiogroup';
      case 'multiSelect':
        return 'group';
      default:
        return null;
    }
  }
  
  /**
   * Render a single button.
   * 
   * @param item - The button item to render
   * @param index - The button index
   * @returns HTML string for the button
   */
  private _renderButton(item: VerticalListButtonItem, index: number): string {
    const mode = this.mode;
    const isSelected = this._isSelected(item.id);
    
    // Determine button state class
    const stateClass = this._getButtonStateClass(isSelected);
    
    // Generate ARIA attributes
    const ariaAttrs = this._getButtonAriaAttributes(isSelected);
    
    // Determine tabindex for roving tabindex pattern
    // @see Requirement 13.1 - Tab focuses first/selected button
    const tabIndex = this._getButtonTabIndex(item.id, index);
    
    // Generate icon HTML if present
    const iconHTML = item.icon 
      ? `<span class="button-vertical-list__icon" aria-hidden="true">
           <icon-base name="${item.icon}" size="${iconBaseSizes.size100}" color="inherit"></icon-base>
         </span>`
      : '';
    
    // Generate description HTML if present
    const descriptionHTML = item.description
      ? `<span class="button-vertical-list__description">${this._escapeHtml(item.description)}</span>`
      : '';
    
    // Generate checkmark HTML for select/multiSelect modes
    const checkmarkHTML = (mode === 'select' || mode === 'multiSelect')
      ? `<span class="button-vertical-list__checkmark" aria-hidden="true">
           <icon-base name="check" size="${iconBaseSizes.size100}" color="inherit"></icon-base>
         </span>`
      : '';
    
    return `
      <button
        class="button-vertical-list__button ${stateClass}"
        type="button"
        data-item-id="${item.id}"
        data-index="${index}"
        tabindex="${tabIndex}"
        ${ariaAttrs}
      >
        <span class="button-vertical-list__content">
          ${iconHTML}
          <span class="button-vertical-list__text">
            <span class="button-vertical-list__label">${this._escapeHtml(item.label)}</span>
            ${descriptionHTML}
          </span>
        </span>
        ${checkmarkHTML}
      </button>
    `;
  }
  
  /**
   * Get the tabindex for a button using roving tabindex pattern.
   * 
   * Implements roving tabindex for keyboard navigation:
   * - Only one button in the group is tabbable (tabindex="0")
   * - Other buttons have tabindex="-1" and are navigated via arrow keys
   * - The tabbable button is:
   *   1. The currently focused button (if any)
   *   2. The first selected button (for select/multiSelect modes)
   *   3. The first button (fallback)
   * 
   * @param itemId - The button's item ID
   * @param index - The button's index in the list
   * @returns "0" for the tabbable button, "-1" for others
   * @see Requirement 13.1 - Tab focuses first/selected button
   */
  private _getButtonTabIndex(itemId: string, index: number): string {
    // If we have a focused index from keyboard navigation, use that
    if (this._internalState.focusedIndex >= 0) {
      return index === this._internalState.focusedIndex ? '0' : '-1';
    }
    
    // For select/multiSelect modes, focus the first selected button
    if (this.mode === 'select' || this.mode === 'multiSelect') {
      if (this._selectedIds.length > 0) {
        // First selected button gets tabindex="0"
        const firstSelectedId = this._selectedIds[0];
        return itemId === firstSelectedId ? '0' : '-1';
      }
    }
    
    // Default: first button is tabbable
    return index === 0 ? '0' : '-1';
  }
  
  /**
   * Get the button state class based on mode and selection.
   * 
   * @param isSelected - Whether the button is selected
   * @returns CSS class string
   */
  private _getButtonStateClass(isSelected: boolean): string {
    const mode = this.mode;
    
    switch (mode) {
      case 'tap':
        return 'button-vertical-list__button--tap';
      case 'select':
        return isSelected
          ? 'button-vertical-list__button--selected'
          : 'button-vertical-list__button--not-selected';
      case 'multiSelect':
        return isSelected
          ? 'button-vertical-list__button--checked'
          : 'button-vertical-list__button--unchecked';
      default:
        return '';
    }
  }
  
  /**
   * Get ARIA attributes for a button based on mode and selection.
   * 
   * Implements proper ARIA roles and states for each mode:
   * - Select mode: role="radio" with aria-checked (within radiogroup container)
   * - Multi-Select mode: role="checkbox" with aria-checked (within group container)
   * - Tap mode: no additional ARIA attributes (semantic button is sufficient)
   * 
   * @param isSelected - Whether the button is selected
   * @returns ARIA attributes string
   * @see Requirements 14.1, 14.2, 14.4
   */
  private _getButtonAriaAttributes(isSelected: boolean): string {
    const mode = this.mode;
    
    switch (mode) {
      case 'select':
        // Select mode uses radiogroup container, so buttons are radio buttons
        // @see Requirement 14.1, 14.4
        return `role="radio" aria-checked="${isSelected}"`;
      case 'multiSelect':
        // Multi-Select mode uses group container, so buttons are checkboxes
        // @see Requirement 14.2, 14.4
        return `role="checkbox" aria-checked="${isSelected}"`;
      default:
        // Tap mode: semantic button element is sufficient
        return '';
    }
  }
  
  /**
   * Escape HTML special characters.
   * 
   * @param text - Text to escape
   * @returns Escaped text
   */
  private _escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  /**
   * Generate inline CSS styles for the component.
   * 
   * Token-based styling using CSS custom properties from the mathematical token system.
   * All values reference semantic or primitive tokens - zero hard-coded values.
   * 
   * @returns CSS string for Shadow DOM injection
   */
  private _generateStyles(): string {
    return `
      /* ==========================================================================
         CSS Custom Properties (Token References)
         ========================================================================== */
      
      :host {
        display: block;
        
        /* Sizing tokens - no fallbacks, tokens must be provided */
        --vlb-min-height: var(--accessibility-tap-area-recommended);
        --vlb-border-radius: var(--radius-normal);
        
        /* Spacing tokens - no fallbacks, tokens must be provided */
        --vlb-padding-vertical: var(--verticallistbutton-padding-vertical);
        --vlb-padding-horizontal: var(--space-inset-200);
        --vlb-gap: var(--space-grouped-normal);
        --vlb-icon-gap: var(--space-grouped-loose);
        --vlb-checkmark-gap: var(--space-grouped-loose);
        
        /* Color tokens - Tap mode - no fallbacks, tokens must be provided */
        --vlb-bg-tap: var(--color-background);
        --vlb-text-tap: var(--color-text-primary);
        
        /* Color tokens - Select mode (not selected) - no fallbacks */
        --vlb-bg-not-selected: var(--color-select-not-selected-background);
        --vlb-text-not-selected: var(--color-select-not-selected);
        
        /* Color tokens - Select mode (selected) / Multi-Select (checked) - no fallbacks */
        --vlb-bg-selected: var(--color-select-selected-background);
        --vlb-text-selected: var(--color-select-selected);
        --vlb-border-selected: var(--border-border-emphasis);
        
        /* Color tokens - Multi-Select mode (unchecked) - no fallbacks */
        --vlb-bg-unchecked: var(--color-background);
        --vlb-text-unchecked: var(--color-text-primary);
        
        /* Description text - no fallbacks */
        --vlb-text-description: var(--color-text-secondary);
        
        /* Interaction overlays - use semantic blend tokens
         * blend.hoverDarker = 8% for hover
         * blend.pressedDarker = 12% for pressed
         * @see src/tokens/semantic/BlendTokens.ts */
        --vlb-blend-hover: var(--blend-hover-darker);
        --vlb-blend-pressed: var(--blend-pressed-darker);
        
        /* Focus tokens - no fallbacks */
        --vlb-focus-offset: var(--accessibility-focus-offset);
        --vlb-focus-width: var(--accessibility-focus-width);
        --vlb-focus-color: var(--accessibility-focus-color);
        
        /* Transition - no fallbacks */
        --vlb-transition: var(--duration-150);
      }
      
      /* ==========================================================================
         Container Styles
         ========================================================================== */
      
      .button-vertical-list {
        display: flex;
        flex-direction: column;
        gap: var(--vlb-gap);
        width: 100%;
      }
      
      /* ==========================================================================
         Base Button Styles
         ========================================================================== */
      
      .button-vertical-list__button {
        /* Reset browser defaults */
        appearance: none;
        border: none;
        background: transparent;
        padding: 0;
        font: inherit;
        text-align: left;
        
        /* Layout */
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        min-height: var(--vlb-min-height);
        padding: var(--vlb-padding-vertical) var(--vlb-padding-horizontal);
        
        /* Shape */
        border-radius: var(--vlb-border-radius);
        
        /* Interaction */
        cursor: pointer;
        user-select: none;
        
        /* Transitions */
        transition: background-color var(--vlb-transition) ease-in-out,
                    border-color var(--vlb-transition) ease-in-out,
                    color var(--vlb-transition) ease-in-out,
                    box-shadow var(--vlb-transition) ease-in-out;
        
        /* Focus outline reset */
        outline: none;
        
        /* Box sizing */
        box-sizing: border-box;
        
        /* Position for overlay */
        position: relative;
      }
      
      /* ==========================================================================
         Button Content Layout
         ========================================================================== */
      
      .button-vertical-list__content {
        display: flex;
        align-items: center;
        gap: var(--vlb-icon-gap);
        flex: 1;
        min-width: 0;
      }
      
      .button-vertical-list__text {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
      }
      
      .button-vertical-list__label {
        /* Typography: buttonMd */
        font-size: var(--typography-button-md-font-size, 16px);
        font-weight: var(--typography-button-md-font-weight, 500);
        line-height: var(--typography-button-md-line-height, 1.5);
      }
      
      .button-vertical-list__description {
        /* Typography: bodySm */
        font-size: var(--typography-body-sm-font-size, 14px);
        font-weight: var(--typography-body-sm-font-weight, 400);
        line-height: var(--typography-body-sm-line-height, 1.5);
        color: var(--vlb-text-description);
      }
      
      .button-vertical-list__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        color: inherit;
        /* Apply optical balance blend (8% lighter) to compensate for icons appearing heavier than text
         * Uses CSS filter as workaround since icon inherits color via currentColor
         * @see Requirements 2.5 - Apply color.icon.opticalBalance blend to icon color
         * @see color.icon.opticalBalance = blend200 = 8% lighter */
        filter: brightness(1.08);
      }
      
      .button-vertical-list__checkmark {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-left: var(--vlb-checkmark-gap);
        opacity: 0;
        transition: opacity var(--vlb-transition) ease-in-out;
        /* Apply optical balance blend (8% lighter) to compensate for icons appearing heavier than text
         * Uses CSS filter as workaround since icon inherits color via currentColor
         * @see Requirements 6.9, 8.9 - Apply color.icon.opticalBalance blend to checkmark color
         * @see color.icon.opticalBalance = blend200 = 8% lighter */
        filter: brightness(1.08);
      }
      
      /* ==========================================================================
         Tap Mode Styles
         ========================================================================== */
      
      .button-vertical-list__button--tap {
        background-color: var(--vlb-bg-tap);
        color: var(--vlb-text-tap);
      }
      
      .button-vertical-list__button--tap .button-vertical-list__checkmark {
        display: none;
      }
      
      /* ==========================================================================
         Select Mode - Not Selected
         ========================================================================== */
      
      .button-vertical-list__button--not-selected {
        background-color: var(--vlb-bg-not-selected);
        color: var(--vlb-text-not-selected);
      }
      
      .button-vertical-list__button--not-selected .button-vertical-list__checkmark {
        opacity: 0;
      }
      
      /* ==========================================================================
         Select Mode - Selected
         ========================================================================== */
      
      .button-vertical-list__button--selected {
        background-color: var(--vlb-bg-selected);
        color: var(--vlb-text-selected);
        border: var(--vlb-border-selected) solid var(--vlb-text-selected);
      }
      
      .button-vertical-list__button--selected .button-vertical-list__checkmark {
        opacity: 1;
        color: var(--vlb-text-selected);
      }
      
      /* ==========================================================================
         Select Mode - Animation States
         
         Staggered animation sequence for selection changes:
         - T=0: Deselected button border fade-out begins, checkmark removed instantly
         - T=50%: Newly selected button border fade-in begins
         - T=100%: Deselected button fade-out completes
         - T=150%: Newly selected button fade-in completes, checkmark fades in
         
         Uses same animation specs as Button-Icon Secondary hover state:
         - Duration: duration150 (150ms)
         - Easing: ease-in-out
         
         @see Requirements 7.1, 7.2, 7.3, 7.4, 7.5
         ========================================================================== */
      
      /**
       * Animating out state (deselecting button)
       * - Starts with selected styling
       * - Border fades out at T=0
       * - Checkmark removed instantly (no fade)
       * @see Requirements 7.2, 7.4
       */
      .button-vertical-list__button--animating-out {
        background-color: var(--vlb-bg-not-selected);
        color: var(--vlb-text-not-selected);
        /* Border animates from visible to none */
        border: var(--vlb-border-selected) solid transparent;
        /* Smooth transition for border fade-out */
        transition: background-color var(--vlb-transition) ease-in-out,
                    border-color var(--vlb-transition) ease-in-out,
                    color var(--vlb-transition) ease-in-out;
      }
      
      .button-vertical-list__button--animating-out .button-vertical-list__checkmark {
        /* Checkmark removed instantly - no fade animation */
        /* @see Requirement 7.4 */
        opacity: 0;
        transition: none;
      }
      
      /**
       * Animating in state (newly selecting button)
       * - Starts with not-selected styling
       * - Border fade-in begins at T=50% (handled via JS setTimeout)
       * - Checkmark fades in with border
       * @see Requirements 7.1, 7.3, 7.5
       */
      .button-vertical-list__button--animating-in {
        background-color: var(--vlb-bg-not-selected);
        color: var(--vlb-text-not-selected);
        /* No border initially - will animate in */
        border: var(--vlb-border-selected) solid transparent;
        /* Smooth transition for border fade-in */
        transition: background-color var(--vlb-transition) ease-in-out,
                    border-color var(--vlb-transition) ease-in-out,
                    color var(--vlb-transition) ease-in-out;
      }
      
      .button-vertical-list__button--animating-in .button-vertical-list__checkmark {
        /* Checkmark hidden initially - will fade in with selection */
        opacity: 0;
        /* Checkmark fades in when button transitions to selected state */
        /* @see Requirement 7.5 */
        transition: opacity var(--vlb-transition) ease-in-out;
      }
      
      /* ==========================================================================
         Multi-Select Mode - Unchecked
         ========================================================================== */
      
      .button-vertical-list__button--unchecked {
        background-color: var(--vlb-bg-unchecked);
        color: var(--vlb-text-unchecked);
      }
      
      .button-vertical-list__button--unchecked .button-vertical-list__checkmark {
        opacity: 0;
      }
      
      /* ==========================================================================
         Multi-Select Mode - Checked
         ========================================================================== */
      
      .button-vertical-list__button--checked {
        background-color: var(--vlb-bg-selected);
        color: var(--vlb-text-selected);
        /* No border in multi-select mode */
      }
      
      .button-vertical-list__button--checked .button-vertical-list__checkmark {
        opacity: 1;
        color: var(--vlb-text-selected);
      }
      
      /* ==========================================================================
         Multi-Select Mode - Animation States
         
         Independent animations for each button when toggling:
         - Checkmark fades in when button is checked
         - Checkmark fades out when button is unchecked
         - Each button animates independently (no stagger)
         
         Uses same animation specs as Button-Icon Secondary hover state:
         - Duration: duration150 (150ms)
         - Easing: ease-in-out
         
         @see Requirements 9.1, 9.2, 9.3
         ========================================================================== */
      
      /**
       * Checking state (button being checked)
       * - Starts with unchecked styling
       * - Background and text transition to checked colors
       * - Checkmark fades in
       * @see Requirement 9.1
       */
      .button-vertical-list__button--checking {
        background-color: var(--vlb-bg-unchecked);
        color: var(--vlb-text-unchecked);
        /* Smooth transition for background and text color */
        transition: background-color var(--vlb-transition) ease-in-out,
                    color var(--vlb-transition) ease-in-out;
      }
      
      .button-vertical-list__button--checking .button-vertical-list__checkmark {
        /* Checkmark starts hidden, will fade in */
        opacity: 0;
        color: var(--vlb-text-selected);
        /* Checkmark fades in when transitioning to checked state */
        transition: opacity var(--vlb-transition) ease-in-out;
      }
      
      /**
       * Unchecking state (button being unchecked)
       * - Starts with checked styling
       * - Background and text transition to unchecked colors
       * - Checkmark fades out
       * @see Requirement 9.2
       */
      .button-vertical-list__button--unchecking {
        background-color: var(--vlb-bg-selected);
        color: var(--vlb-text-selected);
        /* Smooth transition for background and text color */
        transition: background-color var(--vlb-transition) ease-in-out,
                    color var(--vlb-transition) ease-in-out;
      }
      
      .button-vertical-list__button--unchecking .button-vertical-list__checkmark {
        /* Checkmark starts visible, will fade out */
        opacity: 1;
        color: var(--vlb-text-selected);
        /* Checkmark fades out when transitioning to unchecked state */
        transition: opacity var(--vlb-transition) ease-in-out;
      }
      
      /* ==========================================================================
         Interaction Overlay Base
         Creates the overlay pseudo-element for hover and press states.
         The overlay uses currentColor to inherit the text color, creating
         a darkening effect that works on any background.
         
         @see Requirements 11.1, 11.2, 11.3
         ========================================================================== */
      
      .button-vertical-list__button::before {
        content: '';
        position: absolute;
        inset: 0;
        background-color: currentColor;
        opacity: 0;
        border-radius: inherit;
        pointer-events: none;
        transition: opacity var(--vlb-transition) ease-in-out;
      }
      
      /* ==========================================================================
         Hover States
         Uses semantic blend tokens for overlay opacity
         blend.hoverDarker = 8% for hover
         
         Applies overlay on top of current visual state for all modes.
         @see Requirement 11.1
         ========================================================================== */
      
      .button-vertical-list__button:hover::before {
        opacity: var(--vlb-blend-hover);
      }
      
      /* ==========================================================================
         Pressed/Active States
         Uses semantic blend tokens for overlay opacity
         blend.pressedDarker = 12% for pressed
         
         Applies overlay on top of current visual state for all modes.
         Pressed state takes precedence over hover state.
         @see Requirement 11.2
         ========================================================================== */
      
      .button-vertical-list__button:active::before {
        opacity: var(--vlb-blend-pressed);
      }
      
      /* ==========================================================================
         Focus States
         ========================================================================== */
      
      .button-vertical-list__button:focus-visible {
        outline: var(--vlb-focus-width) solid var(--vlb-focus-color);
        outline-offset: var(--vlb-focus-offset);
      }
      
      .button-vertical-list__button:focus:not(:focus-visible) {
        outline: none;
      }
      
      /* ==========================================================================
         Reduced Motion Support
         ========================================================================== */
      
      @media (prefers-reduced-motion: reduce) {
        .button-vertical-list__button,
        .button-vertical-list__checkmark {
          transition: none;
        }
      }
    `;
  }
  
  // ============================================================================
  // Event Handling
  // ============================================================================
  
  /**
   * Attach event listeners to buttons.
   */
  private _attachEventListeners(): void {
    const buttons = this._shadowRoot.querySelectorAll('.button-vertical-list__button');
    buttons.forEach((button) => {
      button.addEventListener('click', this._handleClick);
      button.addEventListener('keydown', this._handleKeyDown);
    });
    
    // Attach container keydown for arrow navigation
    const container = this._shadowRoot.querySelector('.button-vertical-list');
    if (container) {
      container.addEventListener('keydown', this._handleContainerKeyDown);
    }
  }
  
  /**
   * Detach event listeners from buttons.
   */
  private _detachEventListeners(): void {
    const buttons = this._shadowRoot.querySelectorAll('.button-vertical-list__button');
    buttons.forEach((button) => {
      button.removeEventListener('click', this._handleClick);
      button.removeEventListener('keydown', this._handleKeyDown);
    });
    
    const container = this._shadowRoot.querySelector('.button-vertical-list');
    if (container) {
      container.removeEventListener('keydown', this._handleContainerKeyDown);
    }
  }
  
  /**
   * Handle button click events.
   */
  private _handleClick = (event: Event): void => {
    const button = event.currentTarget as HTMLButtonElement;
    const itemId = button.dataset.itemId;
    
    if (itemId) {
      const item = this._items.find(i => i.id === itemId);
      if (item) {
        this._handleButtonClick(item);
      }
    }
  };
  
  /**
   * Handle keyboard events on individual buttons.
   * 
   * Implements Enter and Space key handling:
   * - In Tap mode: triggers the button's action
   * - In Select/Multi-Select mode: toggles the button's selection state
   * 
   * @see Requirements 13.4, 13.5
   */
  private _handleKeyDown = (event: Event): void => {
    const keyEvent = event as KeyboardEvent;
    const button = keyEvent.currentTarget as HTMLButtonElement;
    const itemId = button.dataset.itemId;
    
    // Handle Enter and Space keys
    // @see Requirement 13.4 - Enter/Space triggers action in Tap mode
    // @see Requirement 13.5 - Enter/Space toggles selection in Select/Multi-Select mode
    if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
      keyEvent.preventDefault();
      
      if (itemId) {
        const item = this._items.find(i => i.id === itemId);
        if (item) {
          this._handleButtonClick(item);
        }
      }
    }
  };
  
  /**
   * Handle keyboard navigation on the container.
   * 
   * Implements roving tabindex pattern for arrow key navigation:
   * - Arrow Down moves focus to next button (with wrap)
   * - Arrow Up moves focus to previous button (with wrap)
   * - Updates tabindex to maintain roving tabindex pattern
   * 
   * @see Requirements 13.2, 13.3, 13.6, 13.7
   */
  private _handleContainerKeyDown = (event: Event): void => {
    const keyEvent = event as KeyboardEvent;
    const buttons = Array.from(
      this._shadowRoot.querySelectorAll('.button-vertical-list__button')
    ) as HTMLButtonElement[];
    
    if (buttons.length === 0) return;
    
    const currentIndex = buttons.findIndex(
      btn => btn === this._shadowRoot.activeElement
    );
    
    let nextIndex = currentIndex;
    
    switch (keyEvent.key) {
      case 'ArrowDown':
        keyEvent.preventDefault();
        // Move to next button, wrap to first
        // @see Requirements 13.2, 13.6
        nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % buttons.length;
        break;
        
      case 'ArrowUp':
        keyEvent.preventDefault();
        // Move to previous button, wrap to last
        // @see Requirements 13.3, 13.7
        nextIndex = currentIndex === -1 
          ? buttons.length - 1 
          : (currentIndex - 1 + buttons.length) % buttons.length;
        break;
        
      default:
        return;
    }
    
    if (nextIndex !== currentIndex && buttons[nextIndex]) {
      // Update roving tabindex: remove tabindex from current, add to next
      this._updateRovingTabIndex(buttons, currentIndex, nextIndex);
      
      // Focus the new button
      buttons[nextIndex].focus();
      this._internalState.focusedIndex = nextIndex;
    }
  };
  
  /**
   * Update roving tabindex when focus moves between buttons.
   * 
   * Ensures only one button is tabbable at a time:
   * - Previous focused button gets tabindex="-1"
   * - Newly focused button gets tabindex="0"
   * 
   * @param buttons - Array of button elements
   * @param previousIndex - Index of previously focused button (-1 if none)
   * @param nextIndex - Index of newly focused button
   * @see Requirement 13.1 - Tab focuses first/selected button
   */
  private _updateRovingTabIndex(
    buttons: HTMLButtonElement[],
    previousIndex: number,
    nextIndex: number
  ): void {
    // Remove tabindex from previous button
    if (previousIndex >= 0 && buttons[previousIndex]) {
      buttons[previousIndex].setAttribute('tabindex', '-1');
    }
    
    // Add tabindex to new button
    if (buttons[nextIndex]) {
      buttons[nextIndex].setAttribute('tabindex', '0');
    }
  }
}

/**
 * Register the custom element.
 * 
 * Makes <button-vertical-list> available as a custom HTML element.
 * 
 * @see Requirements 18.3 - True Native Architecture with separate platform implementations
 */
if (!customElements.get('button-vertical-list')) {
  customElements.define('button-vertical-list', ButtonVerticalList);
}

/**
 * Default export for convenience.
 */
export default ButtonVerticalList;
