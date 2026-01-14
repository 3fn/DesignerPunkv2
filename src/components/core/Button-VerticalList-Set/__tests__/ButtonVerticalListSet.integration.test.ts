/**
 * @category evergreen
 * @purpose Integration tests for Button-VerticalList-Set and Button-VerticalList-Item contract
 * @jest-environment jsdom
 * 
 * Tests the contract between Set (container/orchestrator) and Item (presentational) components.
 * Verifies that the Set correctly passes props to child Items based on mode and state.
 * 
 * Contract tests verify WHAT the Set passes to Items, not HOW Items render.
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
 * Register the Button-VerticalList-Set and Item custom elements if not already registered.
 */
function registerComponents(): void {
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
  itemCount?: number;
}

/**
 * Create a Button-VerticalList-Set element with child items
 */
async function createSet(options: CreateSetOptions = {}): Promise<ButtonVerticalListSet> {
  registerComponents();
  
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
  
  // Set error props
  if (options.error !== undefined) {
    set.error = options.error;
  }
  if (options.errorMessage !== undefined) {
    set.errorMessage = options.errorMessage;
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
 * Get all child items from the set
 */
function getChildItems(set: ButtonVerticalListSet): HTMLElement[] {
  const slot = set.shadowRoot?.querySelector('slot');
  if (!slot) return [];
  return slot.assignedElements() as HTMLElement[];
}

// ─────────────────────────────────────────────────────────────────
// Integration Test Suite: Set/Item Contract
// ─────────────────────────────────────────────────────────────────

describe('Button-VerticalList-Set/Item Integration Tests', () => {
  
  // ─────────────────────────────────────────────────────────────────
  // Contract Test: visualState Passing
  // ─────────────────────────────────────────────────────────────────
  
  describe('Contract: visualState Passing', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    describe('Tap Mode', () => {
      it('should pass visual-state="rest" to all items', async () => {
        set = await createSet({ mode: 'tap', itemCount: 3 });
        
        const items = getChildItems(set);
        expect(items.length).toBe(3);
        
        items.forEach((item, index) => {
          expect(item.getAttribute('visual-state')).toBe('rest');
        });
      });
      
      it('should maintain rest state after click interactions', async () => {
        set = await createSet({ mode: 'tap', itemCount: 3 });
        
        const items = getChildItems(set);
        
        // Click an item
        items[1].click();
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // All items should still be in rest state
        items.forEach(item => {
          expect(item.getAttribute('visual-state')).toBe('rest');
        });
      });
    });
    
    describe('Select Mode', () => {
      it('should pass visual-state="rest" to all items when no selection', async () => {
        set = await createSet({ mode: 'select', selectedIndex: null, itemCount: 3 });
        
        const items = getChildItems(set);
        
        items.forEach(item => {
          expect(item.getAttribute('visual-state')).toBe('rest');
        });
      });
      
      it('should pass visual-state="selected" to selected item and "notSelected" to others', async () => {
        set = await createSet({ mode: 'select', selectedIndex: 1, itemCount: 3 });
        
        const items = getChildItems(set);
        
        expect(items[0].getAttribute('visual-state')).toBe('notSelected');
        expect(items[1].getAttribute('visual-state')).toBe('selected');
        expect(items[2].getAttribute('visual-state')).toBe('notSelected');
      });
      
      it('should update visual states when selectedIndex changes', async () => {
        set = await createSet({ mode: 'select', selectedIndex: 0, itemCount: 3 });
        
        const items = getChildItems(set);
        
        // Initial state
        expect(items[0].getAttribute('visual-state')).toBe('selected');
        expect(items[1].getAttribute('visual-state')).toBe('notSelected');
        
        // Change selection
        set.selectedIndex = 2;
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Updated state
        expect(items[0].getAttribute('visual-state')).toBe('notSelected');
        expect(items[1].getAttribute('visual-state')).toBe('notSelected');
        expect(items[2].getAttribute('visual-state')).toBe('selected');
      });
      
      it('should reset all items to rest state on deselection', async () => {
        set = await createSet({ mode: 'select', selectedIndex: 1, itemCount: 3 });
        
        const items = getChildItems(set);
        
        // Deselect by setting to null
        set.selectedIndex = null;
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // All items should be in rest state
        items.forEach(item => {
          expect(item.getAttribute('visual-state')).toBe('rest');
        });
      });
    });
    
    describe('MultiSelect Mode', () => {
      it('should pass visual-state="unchecked" to all items when no selections', async () => {
        set = await createSet({ mode: 'multiSelect', selectedIndices: [], itemCount: 3 });
        
        const items = getChildItems(set);
        
        items.forEach(item => {
          expect(item.getAttribute('visual-state')).toBe('unchecked');
        });
      });
      
      it('should pass visual-state="checked" to selected items and "unchecked" to others', async () => {
        set = await createSet({ mode: 'multiSelect', selectedIndices: [0, 2], itemCount: 3 });
        
        const items = getChildItems(set);
        
        expect(items[0].getAttribute('visual-state')).toBe('checked');
        expect(items[1].getAttribute('visual-state')).toBe('unchecked');
        expect(items[2].getAttribute('visual-state')).toBe('checked');
      });
      
      it('should update visual states when selectedIndices changes', async () => {
        set = await createSet({ mode: 'multiSelect', selectedIndices: [0], itemCount: 3 });
        
        const items = getChildItems(set);
        
        // Initial state
        expect(items[0].getAttribute('visual-state')).toBe('checked');
        expect(items[1].getAttribute('visual-state')).toBe('unchecked');
        
        // Change selections
        set.selectedIndices = [1, 2];
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Updated state
        expect(items[0].getAttribute('visual-state')).toBe('unchecked');
        expect(items[1].getAttribute('visual-state')).toBe('checked');
        expect(items[2].getAttribute('visual-state')).toBe('checked');
      });
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // Contract Test: transitionDelay Passing
  // ─────────────────────────────────────────────────────────────────
  
  describe('Contract: transitionDelay Passing', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    describe('Tap Mode', () => {
      it('should pass transition-delay="0" to all items', async () => {
        set = await createSet({ mode: 'tap', itemCount: 3 });
        
        const items = getChildItems(set);
        
        items.forEach(item => {
          expect(item.getAttribute('transition-delay')).toBe('0');
        });
      });
    });
    
    describe('Select Mode', () => {
      it('should pass transition-delay="0" to all items for first selection', async () => {
        set = await createSet({ mode: 'select', selectedIndex: null, itemCount: 3 });
        
        // Make first selection
        set.selectedIndex = 1;
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const items = getChildItems(set);
        
        // First selection uses simultaneous animation (all delays = 0)
        items.forEach(item => {
          expect(item.getAttribute('transition-delay')).toBe('0');
        });
      });
      
      it('should pass transition-delay="0" to all items on deselection', async () => {
        set = await createSet({ mode: 'select', selectedIndex: 1, itemCount: 3 });
        
        // Deselect
        set.selectedIndex = null;
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const items = getChildItems(set);
        
        // Deselection uses simultaneous animation (all delays = 0)
        items.forEach(item => {
          expect(item.getAttribute('transition-delay')).toBe('0');
        });
      });
    });
    
    describe('MultiSelect Mode', () => {
      it('should pass transition-delay="0" to all items (independent animation)', async () => {
        set = await createSet({ mode: 'multiSelect', selectedIndices: [0, 2], itemCount: 3 });
        
        const items = getChildItems(set);
        
        // MultiSelect uses independent animation (all delays = 0)
        items.forEach(item => {
          expect(item.getAttribute('transition-delay')).toBe('0');
        });
      });
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // Contract Test: error Prop Passing
  // ─────────────────────────────────────────────────────────────────
  
  describe('Contract: error Prop Passing', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    it('should pass error="false" to all items when error is false', async () => {
      set = await createSet({ mode: 'select', error: false, itemCount: 3 });
      
      const items = getChildItems(set);
      
      items.forEach(item => {
        expect(item.getAttribute('error')).toBe('false');
      });
    });
    
    it('should pass error="true" to all items when error is true', async () => {
      set = await createSet({ 
        mode: 'select', 
        error: true, 
        errorMessage: 'Please select an option',
        itemCount: 3 
      });
      
      const items = getChildItems(set);
      
      items.forEach(item => {
        expect(item.getAttribute('error')).toBe('true');
      });
    });
    
    it('should update error prop on all items when error state changes', async () => {
      set = await createSet({ mode: 'select', error: false, itemCount: 3 });
      
      const items = getChildItems(set);
      
      // Initial state
      items.forEach(item => {
        expect(item.getAttribute('error')).toBe('false');
      });
      
      // Set error
      set.error = true;
      set.errorMessage = 'Error message';
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Updated state
      items.forEach(item => {
        expect(item.getAttribute('error')).toBe('true');
      });
      
      // Clear error
      set.error = false;
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Cleared state
      items.forEach(item => {
        expect(item.getAttribute('error')).toBe('false');
      });
    });
    
    it('should propagate error to all items in all modes', async () => {
      // Test tap mode
      set = await createSet({ mode: 'tap', error: true, errorMessage: 'Error', itemCount: 2 });
      let items = getChildItems(set);
      items.forEach(item => {
        expect(item.getAttribute('error')).toBe('true');
      });
      cleanupSet(set);
      
      // Test select mode
      set = await createSet({ mode: 'select', error: true, errorMessage: 'Error', itemCount: 2 });
      items = getChildItems(set);
      items.forEach(item => {
        expect(item.getAttribute('error')).toBe('true');
      });
      cleanupSet(set);
      
      // Test multiSelect mode
      set = await createSet({ mode: 'multiSelect', error: true, errorMessage: 'Error', itemCount: 2 });
      items = getChildItems(set);
      items.forEach(item => {
        expect(item.getAttribute('error')).toBe('true');
      });
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // Contract Test: ARIA Attributes Passing
  // ─────────────────────────────────────────────────────────────────
  
  describe('Contract: ARIA Attributes Passing', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    describe('Tap Mode', () => {
      it('should pass role="button" to all items', async () => {
        set = await createSet({ mode: 'tap', itemCount: 3 });
        
        const items = getChildItems(set);
        
        items.forEach(item => {
          expect(item.getAttribute('role')).toBe('button');
        });
      });
      
      it('should not pass aria-checked to items (buttons do not use aria-checked)', async () => {
        set = await createSet({ mode: 'tap', itemCount: 3 });
        
        const items = getChildItems(set);
        
        items.forEach(item => {
          expect(item.hasAttribute('aria-checked')).toBe(false);
        });
      });
    });
    
    describe('Select Mode', () => {
      it('should pass role="radio" to all items', async () => {
        set = await createSet({ mode: 'select', itemCount: 3 });
        
        const items = getChildItems(set);
        
        items.forEach(item => {
          expect(item.getAttribute('role')).toBe('radio');
        });
      });
      
      it('should pass aria-checked="true" to selected item and "false" to others', async () => {
        set = await createSet({ mode: 'select', selectedIndex: 1, itemCount: 3 });
        
        const items = getChildItems(set);
        
        expect(items[0].getAttribute('aria-checked')).toBe('false');
        expect(items[1].getAttribute('aria-checked')).toBe('true');
        expect(items[2].getAttribute('aria-checked')).toBe('false');
      });
      
      it('should pass aria-checked="false" to all items when no selection', async () => {
        set = await createSet({ mode: 'select', selectedIndex: null, itemCount: 3 });
        
        const items = getChildItems(set);
        
        items.forEach(item => {
          expect(item.getAttribute('aria-checked')).toBe('false');
        });
      });
      
      it('should update aria-checked when selection changes', async () => {
        set = await createSet({ mode: 'select', selectedIndex: 0, itemCount: 3 });
        
        const items = getChildItems(set);
        
        // Initial state
        expect(items[0].getAttribute('aria-checked')).toBe('true');
        expect(items[1].getAttribute('aria-checked')).toBe('false');
        
        // Change selection
        set.selectedIndex = 1;
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Updated state
        expect(items[0].getAttribute('aria-checked')).toBe('false');
        expect(items[1].getAttribute('aria-checked')).toBe('true');
      });
    });
    
    describe('MultiSelect Mode', () => {
      it('should pass role="checkbox" to all items', async () => {
        set = await createSet({ mode: 'multiSelect', itemCount: 3 });
        
        const items = getChildItems(set);
        
        items.forEach(item => {
          expect(item.getAttribute('role')).toBe('checkbox');
        });
      });
      
      it('should pass aria-checked="true" to checked items and "false" to unchecked', async () => {
        set = await createSet({ mode: 'multiSelect', selectedIndices: [0, 2], itemCount: 3 });
        
        const items = getChildItems(set);
        
        expect(items[0].getAttribute('aria-checked')).toBe('true');
        expect(items[1].getAttribute('aria-checked')).toBe('false');
        expect(items[2].getAttribute('aria-checked')).toBe('true');
      });
      
      it('should pass aria-checked="false" to all items when no selections', async () => {
        set = await createSet({ mode: 'multiSelect', selectedIndices: [], itemCount: 3 });
        
        const items = getChildItems(set);
        
        items.forEach(item => {
          expect(item.getAttribute('aria-checked')).toBe('false');
        });
      });
      
      it('should update aria-checked when selections change', async () => {
        set = await createSet({ mode: 'multiSelect', selectedIndices: [0], itemCount: 3 });
        
        const items = getChildItems(set);
        
        // Initial state
        expect(items[0].getAttribute('aria-checked')).toBe('true');
        expect(items[1].getAttribute('aria-checked')).toBe('false');
        expect(items[2].getAttribute('aria-checked')).toBe('false');
        
        // Change selections
        set.selectedIndices = [1, 2];
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Updated state
        expect(items[0].getAttribute('aria-checked')).toBe('false');
        expect(items[1].getAttribute('aria-checked')).toBe('true');
        expect(items[2].getAttribute('aria-checked')).toBe('true');
      });
    });
    
    describe('Mode Switching', () => {
      it('should update role and aria-checked when mode changes', async () => {
        set = await createSet({ mode: 'tap', itemCount: 3 });
        
        const items = getChildItems(set);
        
        // Initial tap mode
        items.forEach(item => {
          expect(item.getAttribute('role')).toBe('button');
          expect(item.hasAttribute('aria-checked')).toBe(false);
        });
        
        // Switch to select mode
        set.mode = 'select';
        set.selectedIndex = 1;
        await new Promise(resolve => setTimeout(resolve, 0));
        
        items.forEach((item, index) => {
          expect(item.getAttribute('role')).toBe('radio');
          expect(item.getAttribute('aria-checked')).toBe(index === 1 ? 'true' : 'false');
        });
        
        // Switch to multiSelect mode
        set.mode = 'multiSelect';
        set.selectedIndices = [0, 2];
        await new Promise(resolve => setTimeout(resolve, 0));
        
        items.forEach((item, index) => {
          expect(item.getAttribute('role')).toBe('checkbox');
          expect(item.getAttribute('aria-checked')).toBe(
            index === 0 || index === 2 ? 'true' : 'false'
          );
        });
      });
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // Contract Test: tabindex Passing (Roving Tabindex)
  // ─────────────────────────────────────────────────────────────────
  
  describe('Contract: tabindex Passing (Roving Tabindex)', () => {
    let set: ButtonVerticalListSet;
    
    afterEach(() => {
      if (set) {
        cleanupSet(set);
      }
    });
    
    it('should pass tabindex="0" to first item and "-1" to others initially', async () => {
      set = await createSet({ mode: 'select', itemCount: 3 });
      
      const items = getChildItems(set);
      
      expect(items[0].getAttribute('tabindex')).toBe('0');
      expect(items[1].getAttribute('tabindex')).toBe('-1');
      expect(items[2].getAttribute('tabindex')).toBe('-1');
    });
    
    it('should update tabindex when focus moves via keyboard', async () => {
      set = await createSet({ mode: 'select', itemCount: 3 });
      
      const items = getChildItems(set);
      
      // Initial state
      expect(items[0].getAttribute('tabindex')).toBe('0');
      
      // Simulate ArrowDown key
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      set.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 0));
      
      // Focus should move to second item
      expect(items[0].getAttribute('tabindex')).toBe('-1');
      expect(items[1].getAttribute('tabindex')).toBe('0');
      expect(items[2].getAttribute('tabindex')).toBe('-1');
    });
    
    it('should maintain roving tabindex pattern across all modes', async () => {
      // Test in tap mode
      set = await createSet({ mode: 'tap', itemCount: 3 });
      let items = getChildItems(set);
      expect(items[0].getAttribute('tabindex')).toBe('0');
      expect(items[1].getAttribute('tabindex')).toBe('-1');
      cleanupSet(set);
      
      // Test in select mode
      set = await createSet({ mode: 'select', itemCount: 3 });
      items = getChildItems(set);
      expect(items[0].getAttribute('tabindex')).toBe('0');
      expect(items[1].getAttribute('tabindex')).toBe('-1');
      cleanupSet(set);
      
      // Test in multiSelect mode
      set = await createSet({ mode: 'multiSelect', itemCount: 3 });
      items = getChildItems(set);
      expect(items[0].getAttribute('tabindex')).toBe('0');
      expect(items[1].getAttribute('tabindex')).toBe('-1');
    });
  });
});
