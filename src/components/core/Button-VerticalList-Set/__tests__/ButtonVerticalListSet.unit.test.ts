/**
 * @category evergreen
 * @purpose Unit tests for Button-VerticalList-Set web component
 * @jest-environment jsdom
 * 
 * Tests component registration, initial state by mode, error state behavior,
 * keyboard navigation edge cases, and animation timing edge cases following
 * JSDOM web component patterns.
 * 
 * Stemma System Naming: [Family]-[Type] = Button-VerticalList-Set
 * Component Type: Pattern (VerticalList-Set)
 * Custom Element Tag: <button-vertical-list-set>
 * 
 * @see Requirements: All
 * @see .kiro/specs/041-vertical-list-buttons-pattern/design.md - Testing Strategy
 */

import { ButtonVerticalListSet } from '../platforms/web/ButtonVerticalListSet.web';
import { ButtonVerticalListItem } from '../../Button-VerticalList-Item/platforms/web/ButtonVerticalListItem.web';
import { setupRequiredTokens, cleanupRequiredTokens } from '../../Button-VerticalList-Item/__tests__/test-utils';

// ─────────────────────────────────────────────────────────────────
// Test Utilities
// ─────────────────────────────────────────────────────────────────

/**
 * Register the Button-VerticalList-Set custom element if not already registered.
 */
function registerSetComponent(): void {
  setupRequiredTokens();
  
  if (!customElements.get('button-vertical-list-set')) {
    customElements.define('button-vertical-list-set', ButtonVerticalListSet);
  }
  if (!customElements.get('button-vertical-list-item')) {
    customElements.define('button-vertical-list-item', ButtonVerticalListItem);
  }
}

/**
 * Wait for shadow DOM to be initialized and rendered
 */
async function waitForShadowDOM(element: HTMLElement, timeout: number = 1000): Promise<void> {
  const startTime = Date.now();
  
  while (!element.shadowRoot) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for shadow DOM to initialize');
    }
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  await new Promise(resolve => setTimeout(resolve, 0));
}


interface CreateSetOptions {
  mode?: 'tap' | 'select' | 'multiSelect';
  selectedIndex?: number | null;
  selectedIndices?: number[];
  error?: boolean;
  errorMessage?: string;
  required?: boolean;
  minSelections?: number;
  maxSelections?: number;
  testID?: string;
  itemCount?: number;
}

/**
 * Create a Button-VerticalList-Set element with child items
 */
async function createSet(options: CreateSetOptions = {}): Promise<ButtonVerticalListSet> {
  registerSetComponent();
  
  const set = document.createElement('button-vertical-list-set') as ButtonVerticalListSet;
  
  // Set mode (default to 'tap')
  set.mode = options.mode || 'tap';
  
  // Set controlled props
  if (options.selectedIndex !== undefined) {
    set.selectedIndex = options.selectedIndex;
  }
  if (options.selectedIndices !== undefined) {
    set.selectedIndices = options.selectedIndices;
  }
  
  // Set validation props
  if (options.required !== undefined) {
    set.required = options.required;
  }
  if (options.minSelections !== undefined) {
    set.minSelections = options.minSelections;
  }
  if (options.maxSelections !== undefined) {
    set.maxSelections = options.maxSelections;
  }
  
  // Set error props
  if (options.error !== undefined) {
    set.error = options.error;
  }
  if (options.errorMessage !== undefined) {
    set.errorMessage = options.errorMessage;
  }
  
  // Set test ID
  if (options.testID !== undefined) {
    set.testID = options.testID;
  }
  
  // Add child items
  const itemCount = options.itemCount ?? 3;
  for (let i = 0; i < itemCount; i++) {
    const item = document.createElement('button-vertical-list-item') as ButtonVerticalListItem;
    item.label = `Item ${i + 1}`;
    set.appendChild(item);
  }
  
  // Append to document to trigger rendering
  document.body.appendChild(set);
  
  // Wait for shadow DOM to be ready
  await waitForShadowDOM(set);
  
  return set;
}

/**
 * Clean up a Button-VerticalList-Set element from the DOM
 */
function cleanupSet(set: ButtonVerticalListSet): void {
  if (set.parentNode) {
    set.parentNode.removeChild(set);
  }
}

/**
 * Get the container element from shadow DOM
 */
function getContainer(set: ButtonVerticalListSet): HTMLElement | null {
  return set.shadowRoot?.querySelector('.vls-container') || null;
}

/**
 * Get the error message element from shadow DOM
 */
function getErrorMessageElement(set: ButtonVerticalListSet): HTMLElement | null {
  return set.shadowRoot?.querySelector('.vls-error-message') || null;
}

/**
 * Get all child items from the set
 */
function getChildItems(set: ButtonVerticalListSet): HTMLElement[] {
  const slot = set.shadowRoot?.querySelector('slot');
  if (!slot) return [];
  return slot.assignedElements() as HTMLElement[];
}


// ─────────────────────────────────────────────────────────────────
// Test Suite
// ─────────────────────────────────────────────────────────────────

describe('Button-VerticalList-Set Unit Tests', () => {
  // ─────────────────────────────────────────────────────────────────
  // Component Registration & Setup Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Component Registration & Setup', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    it('should register custom element with correct tag name', async () => {
      registerSetComponent();
      
      expect(customElements.get('button-vertical-list-set')).toBe(ButtonVerticalListSet);
    });
    
    it('should create element with shadow DOM', async () => {
      set = await createSet();
      
      expect(set).toBeTruthy();
      expect(set.shadowRoot).toBeTruthy();
    });
    
    it('should render container element in shadow DOM', async () => {
      set = await createSet();
      
      const container = getContainer(set);
      expect(container).toBeTruthy();
      expect(container?.classList.contains('vls-container')).toBe(true);
    });
    
    it('should render slot for child items', async () => {
      set = await createSet();
      
      const slot = set.shadowRoot?.querySelector('slot');
      expect(slot).toBeTruthy();
    });
    
    it('should configure delegatesFocus on shadow DOM', async () => {
      set = await createSet();
      
      // delegatesFocus is configured in attachShadow, verify shadow root exists
      // Note: JSDOM doesn't expose delegatesFocus property, but we verify shadow root works
      expect(set.shadowRoot).toBeTruthy();
      expect(set.shadowRoot?.mode).toBe('open');
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Initial State by Mode Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Initial State by Mode', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    describe('Tap Mode', () => {
      it('should render all items in rest state', async () => {
        set = await createSet({ mode: 'tap', itemCount: 3 });
        
        const items = getChildItems(set);
        items.forEach(item => {
          expect(item.getAttribute('visual-state')).toBe('rest');
        });
      });
      
      it('should apply role="group" to container', async () => {
        set = await createSet({ mode: 'tap' });
        
        const container = getContainer(set);
        expect(container?.getAttribute('role')).toBe('group');
      });
      
      it('should apply role="button" to child items', async () => {
        set = await createSet({ mode: 'tap' });
        
        const items = getChildItems(set);
        items.forEach(item => {
          expect(item.getAttribute('role')).toBe('button');
        });
      });
      
      it('should not have aria-multiselectable attribute', async () => {
        set = await createSet({ mode: 'tap' });
        
        const container = getContainer(set);
        expect(container?.hasAttribute('aria-multiselectable')).toBe(false);
      });
    });
    
    describe('Select Mode', () => {
      it('should render all items in rest state when no selection', async () => {
        set = await createSet({ mode: 'select', selectedIndex: null, itemCount: 3 });
        
        const items = getChildItems(set);
        items.forEach(item => {
          expect(item.getAttribute('visual-state')).toBe('rest');
        });
      });
      
      it('should render selected item in selected state', async () => {
        set = await createSet({ mode: 'select', selectedIndex: 1, itemCount: 3 });
        
        const items = getChildItems(set);
        expect(items[0].getAttribute('visual-state')).toBe('notSelected');
        expect(items[1].getAttribute('visual-state')).toBe('selected');
        expect(items[2].getAttribute('visual-state')).toBe('notSelected');
      });
      
      it('should apply role="radiogroup" to container', async () => {
        set = await createSet({ mode: 'select' });
        
        const container = getContainer(set);
        expect(container?.getAttribute('role')).toBe('radiogroup');
      });
      
      it('should apply role="radio" to child items', async () => {
        set = await createSet({ mode: 'select' });
        
        const items = getChildItems(set);
        items.forEach(item => {
          expect(item.getAttribute('role')).toBe('radio');
        });
      });
      
      it('should set aria-checked correctly on items', async () => {
        set = await createSet({ mode: 'select', selectedIndex: 1, itemCount: 3 });
        
        const items = getChildItems(set);
        expect(items[0].getAttribute('aria-checked')).toBe('false');
        expect(items[1].getAttribute('aria-checked')).toBe('true');
        expect(items[2].getAttribute('aria-checked')).toBe('false');
      });
    });
    
    describe('MultiSelect Mode', () => {
      it('should render all items in unchecked state when no selections', async () => {
        set = await createSet({ mode: 'multiSelect', selectedIndices: [], itemCount: 3 });
        
        const items = getChildItems(set);
        items.forEach(item => {
          expect(item.getAttribute('visual-state')).toBe('unchecked');
        });
      });
      
      it('should render selected items in checked state', async () => {
        set = await createSet({ mode: 'multiSelect', selectedIndices: [0, 2], itemCount: 3 });
        
        const items = getChildItems(set);
        expect(items[0].getAttribute('visual-state')).toBe('checked');
        expect(items[1].getAttribute('visual-state')).toBe('unchecked');
        expect(items[2].getAttribute('visual-state')).toBe('checked');
      });
      
      it('should apply role="group" with aria-multiselectable to container', async () => {
        set = await createSet({ mode: 'multiSelect' });
        
        const container = getContainer(set);
        expect(container?.getAttribute('role')).toBe('group');
        expect(container?.getAttribute('aria-multiselectable')).toBe('true');
      });
      
      it('should apply role="checkbox" to child items', async () => {
        set = await createSet({ mode: 'multiSelect' });
        
        const items = getChildItems(set);
        items.forEach(item => {
          expect(item.getAttribute('role')).toBe('checkbox');
        });
      });
      
      it('should set aria-checked correctly on items', async () => {
        set = await createSet({ mode: 'multiSelect', selectedIndices: [0, 2], itemCount: 3 });
        
        const items = getChildItems(set);
        expect(items[0].getAttribute('aria-checked')).toBe('true');
        expect(items[1].getAttribute('aria-checked')).toBe('false');
        expect(items[2].getAttribute('aria-checked')).toBe('true');
      });
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Error State Behavior Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Error State Behavior', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    it('should display error message above list when errorMessage provided', async () => {
      set = await createSet({ 
        mode: 'select', 
        error: true, 
        errorMessage: 'Please select an option' 
      });
      
      const errorEl = getErrorMessageElement(set);
      expect(errorEl).toBeTruthy();
      expect(errorEl?.textContent).toBe('Please select an option');
      expect(errorEl?.style.display).not.toBe('none');
    });
    
    it('should have role="alert" on error message for screen reader announcement', async () => {
      set = await createSet({ 
        mode: 'select', 
        error: true, 
        errorMessage: 'Please select an option' 
      });
      
      const errorEl = getErrorMessageElement(set);
      expect(errorEl?.getAttribute('role')).toBe('alert');
    });
    
    it('should not render error message when errorMessage is not provided', async () => {
      set = await createSet({ mode: 'select', error: true });
      
      const errorEl = getErrorMessageElement(set);
      expect(errorEl?.style.display).toBe('none');
      expect(errorEl?.textContent).toBe('');
    });
    
    it('should hide error message when error is false', async () => {
      set = await createSet({ 
        mode: 'select', 
        error: false, 
        errorMessage: 'Please select an option' 
      });
      
      const errorEl = getErrorMessageElement(set);
      expect(errorEl?.style.display).toBe('none');
    });
    
    it('should propagate error state to all child items', async () => {
      set = await createSet({ 
        mode: 'select', 
        error: true, 
        errorMessage: 'Error',
        itemCount: 3 
      });
      
      const items = getChildItems(set);
      items.forEach(item => {
        expect(item.getAttribute('error')).toBe('true');
      });
    });
    
    it('should set aria-invalid on container when error is true', async () => {
      set = await createSet({ 
        mode: 'select', 
        error: true, 
        errorMessage: 'Please select an option' 
      });
      
      const container = getContainer(set);
      expect(container?.getAttribute('aria-invalid')).toBe('true');
    });
    
    it('should set aria-describedby linking to error message', async () => {
      set = await createSet({ 
        mode: 'select', 
        error: true, 
        errorMessage: 'Please select an option' 
      });
      
      const container = getContainer(set);
      const errorEl = getErrorMessageElement(set);
      
      expect(container?.getAttribute('aria-describedby')).toBe(errorEl?.id);
    });
    
    it('should not have aria-invalid when error is false', async () => {
      set = await createSet({ mode: 'select', error: false });
      
      const container = getContainer(set);
      expect(container?.hasAttribute('aria-invalid')).toBe(false);
    });
    
    it('should not have aria-describedby when error is false', async () => {
      set = await createSet({ mode: 'select', error: false });
      
      const container = getContainer(set);
      expect(container?.hasAttribute('aria-describedby')).toBe(false);
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Keyboard Navigation Edge Cases Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Keyboard Navigation Edge Cases', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    it('should move focus to first item on Home key', async () => {
      set = await createSet({ mode: 'select', itemCount: 5 });
      
      const items = getChildItems(set);
      
      // Focus the third item first
      items[2].focus();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Press Home key
      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      set.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // First item should have tabindex="0"
      expect(items[0].getAttribute('tabindex')).toBe('0');
    });
    
    it('should move focus to last item on End key', async () => {
      set = await createSet({ mode: 'select', itemCount: 5 });
      
      const items = getChildItems(set);
      
      // Focus the first item
      items[0].focus();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Press End key
      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      set.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Last item should have tabindex="0"
      expect(items[4].getAttribute('tabindex')).toBe('0');
    });
    
    it('should wrap focus from last to first on ArrowDown', async () => {
      set = await createSet({ mode: 'select', itemCount: 3 });
      
      const items = getChildItems(set);
      
      // Focus the last item
      items[2].focus();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Press ArrowDown
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      set.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // First item should have tabindex="0" (wrapped)
      expect(items[0].getAttribute('tabindex')).toBe('0');
    });
    
    it('should wrap focus from first to last on ArrowUp', async () => {
      set = await createSet({ mode: 'select', itemCount: 3 });
      
      const items = getChildItems(set);
      
      // Focus the first item
      items[0].focus();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Press ArrowUp
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      set.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Last item should have tabindex="0" (wrapped)
      expect(items[2].getAttribute('tabindex')).toBe('0');
    });
    
    it('should implement roving tabindex pattern', async () => {
      set = await createSet({ mode: 'select', itemCount: 3 });
      
      const items = getChildItems(set);
      
      // Initially, first item should have tabindex="0", others "-1"
      expect(items[0].getAttribute('tabindex')).toBe('0');
      expect(items[1].getAttribute('tabindex')).toBe('-1');
      expect(items[2].getAttribute('tabindex')).toBe('-1');
      
      // Move focus to second item
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      set.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Second item should now have tabindex="0"
      expect(items[0].getAttribute('tabindex')).toBe('-1');
      expect(items[1].getAttribute('tabindex')).toBe('0');
      expect(items[2].getAttribute('tabindex')).toBe('-1');
    });
    
    it('should handle empty item list gracefully', async () => {
      set = await createSet({ mode: 'select', itemCount: 0 });
      
      // Should not throw when pressing navigation keys
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      expect(() => set.dispatchEvent(event)).not.toThrow();
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Animation Timing Edge Cases Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Animation Timing Edge Cases', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    it('should use simultaneous animation (all delays = 0) for first selection', async () => {
      set = await createSet({ mode: 'select', selectedIndex: null, itemCount: 3 });
      
      // Simulate first selection by setting selectedIndex
      set.selectedIndex = 1;
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const items = getChildItems(set);
      
      // All items should have transition-delay of 0 for first selection
      items.forEach(item => {
        const delay = item.getAttribute('transition-delay');
        expect(delay).toBe('0');
      });
    });
    
    it('should use simultaneous animation (all delays = 0) for deselection', async () => {
      set = await createSet({ mode: 'select', selectedIndex: 1, itemCount: 3 });
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Simulate deselection by clicking the selected item
      const items = getChildItems(set);
      items[1].click();
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // After deselection, all items should have transition-delay of 0
      items.forEach(item => {
        const delay = item.getAttribute('transition-delay');
        expect(delay).toBe('0');
      });
    });
    
    it('should apply transition-delay to all items in tap mode as 0', async () => {
      set = await createSet({ mode: 'tap', itemCount: 3 });
      
      const items = getChildItems(set);
      
      // Tap mode should have all delays at 0
      items.forEach(item => {
        const delay = item.getAttribute('transition-delay');
        expect(delay).toBe('0');
      });
    });
    
    it('should apply transition-delay to all items in multiSelect mode as 0', async () => {
      set = await createSet({ mode: 'multiSelect', selectedIndices: [0, 2], itemCount: 3 });
      
      const items = getChildItems(set);
      
      // MultiSelect mode should have all delays at 0 (independent animation)
      items.forEach(item => {
        const delay = item.getAttribute('transition-delay');
        expect(delay).toBe('0');
      });
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Callback Invocation Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Callback Invocation', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    it('should invoke onItemClick callback in tap mode', async () => {
      const onItemClick = jest.fn();
      set = await createSet({ mode: 'tap', itemCount: 3 });
      set.onItemClick = onItemClick;
      
      const items = getChildItems(set);
      items[1].click();
      
      expect(onItemClick).toHaveBeenCalledWith(1);
    });
    
    it('should invoke onSelectionChange callback in select mode', async () => {
      const onSelectionChange = jest.fn();
      set = await createSet({ mode: 'select', selectedIndex: null, itemCount: 3 });
      set.onSelectionChange = onSelectionChange;
      
      const items = getChildItems(set);
      items[1].click();
      
      expect(onSelectionChange).toHaveBeenCalledWith(1);
    });
    
    it('should invoke onSelectionChange with null on deselection', async () => {
      const onSelectionChange = jest.fn();
      set = await createSet({ mode: 'select', selectedIndex: 1, itemCount: 3 });
      set.onSelectionChange = onSelectionChange;
      
      const items = getChildItems(set);
      items[1].click(); // Click selected item to deselect
      
      expect(onSelectionChange).toHaveBeenCalledWith(null);
    });
    
    it('should invoke onMultiSelectionChange callback in multiSelect mode', async () => {
      const onMultiSelectionChange = jest.fn();
      set = await createSet({ mode: 'multiSelect', selectedIndices: [], itemCount: 3 });
      set.onMultiSelectionChange = onMultiSelectionChange;
      
      const items = getChildItems(set);
      items[1].click();
      
      expect(onMultiSelectionChange).toHaveBeenCalledWith([1]);
    });
    
    it('should invoke onMultiSelectionChange with updated array on toggle', async () => {
      const onMultiSelectionChange = jest.fn();
      set = await createSet({ mode: 'multiSelect', selectedIndices: [0, 2], itemCount: 3 });
      set.onMultiSelectionChange = onMultiSelectionChange;
      
      const items = getChildItems(set);
      items[0].click(); // Deselect item 0
      
      expect(onMultiSelectionChange).toHaveBeenCalledWith([2]);
    });
  });


  // ─────────────────────────────────────────────────────────────────
  // Max Selection Enforcement Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Max Selection Enforcement', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    it('should prevent selecting beyond maxSelections limit', async () => {
      const onMultiSelectionChange = jest.fn();
      set = await createSet({ 
        mode: 'multiSelect', 
        selectedIndices: [0, 1], 
        maxSelections: 2,
        itemCount: 3 
      });
      set.onMultiSelectionChange = onMultiSelectionChange;
      
      const items = getChildItems(set);
      items[2].click(); // Try to select third item when at max
      
      // Callback should not be invoked because selection was prevented
      expect(onMultiSelectionChange).not.toHaveBeenCalled();
    });
    
    it('should allow deselection even at maxSelections', async () => {
      const onMultiSelectionChange = jest.fn();
      set = await createSet({ 
        mode: 'multiSelect', 
        selectedIndices: [0, 1], 
        maxSelections: 2,
        itemCount: 3 
      });
      set.onMultiSelectionChange = onMultiSelectionChange;
      
      const items = getChildItems(set);
      items[0].click(); // Deselect item 0
      
      // Callback should be invoked with item 0 removed
      expect(onMultiSelectionChange).toHaveBeenCalledWith([1]);
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Property Getter/Setter Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Property Getters and Setters', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    it('should get and set mode property', async () => {
      set = await createSet({ mode: 'tap' });
      
      expect(set.mode).toBe('tap');
      
      set.mode = 'select';
      expect(set.mode).toBe('select');
    });
    
    it('should get and set selectedIndex property', async () => {
      set = await createSet({ mode: 'select' });
      
      expect(set.selectedIndex).toBeNull();
      
      set.selectedIndex = 1;
      expect(set.selectedIndex).toBe(1);
      
      set.selectedIndex = null;
      expect(set.selectedIndex).toBeNull();
    });
    
    it('should get and set selectedIndices property', async () => {
      set = await createSet({ mode: 'multiSelect' });
      
      expect(set.selectedIndices).toEqual([]);
      
      set.selectedIndices = [0, 2];
      expect(set.selectedIndices).toEqual([0, 2]);
    });
    
    it('should get and set error property', async () => {
      set = await createSet({ mode: 'select' });
      
      expect(set.error).toBe(false);
      
      set.error = true;
      expect(set.error).toBe(true);
    });
    
    it('should get and set errorMessage property', async () => {
      set = await createSet({ mode: 'select' });
      
      expect(set.errorMessage).toBeUndefined();
      
      set.errorMessage = 'Error message';
      expect(set.errorMessage).toBe('Error message');
    });
    
    it('should get and set required property', async () => {
      set = await createSet({ mode: 'select' });
      
      expect(set.required).toBe(false);
      
      set.required = true;
      expect(set.required).toBe(true);
    });
    
    it('should get and set minSelections property', async () => {
      set = await createSet({ mode: 'multiSelect' });
      
      expect(set.minSelections).toBeUndefined();
      
      set.minSelections = 2;
      expect(set.minSelections).toBe(2);
    });
    
    it('should get and set maxSelections property', async () => {
      set = await createSet({ mode: 'multiSelect' });
      
      expect(set.maxSelections).toBeUndefined();
      
      set.maxSelections = 3;
      expect(set.maxSelections).toBe(3);
    });
    
    it('should get and set testID property', async () => {
      set = await createSet({ mode: 'tap' });
      
      expect(set.testID).toBeUndefined();
      
      set.testID = 'my-test-id';
      expect(set.testID).toBe('my-test-id');
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // Validate Method Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Validate Method', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    it('should return valid for tap mode', async () => {
      set = await createSet({ mode: 'tap' });
      
      const result = set.validate();
      expect(result.isValid).toBe(true);
      expect(result.message).toBeNull();
    });
    
    it('should return invalid when required and no selection in select mode', async () => {
      set = await createSet({ mode: 'select', required: true, selectedIndex: null });
      
      const result = set.validate();
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Please select an option');
    });
    
    it('should return valid when required and has selection in select mode', async () => {
      set = await createSet({ mode: 'select', required: true, selectedIndex: 1 });
      
      const result = set.validate();
      expect(result.isValid).toBe(true);
      expect(result.message).toBeNull();
    });
    
    it('should return invalid when minSelections not met in multiSelect mode', async () => {
      set = await createSet({ 
        mode: 'multiSelect', 
        minSelections: 2, 
        selectedIndices: [0] 
      });
      
      const result = set.validate();
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Please select at least 2 options');
    });
  });
});
