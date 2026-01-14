/**
 * @category evergreen
 * @purpose Property-based tests for Button-VerticalList-Set component (Properties 1-9)
 * @jest-environment jsdom
 * 
 * Property-based tests using fast-check to verify universal properties
 * that should hold across all valid inputs for the Button-VerticalList-Set component.
 * 
 * Properties covered in this file (Properties 1-9):
 * - Property 1: Single Click Event Per Interaction
 * - Property 2: ARIA Role Based on Mode
 * - Property 3: Tap Mode Items Always Rest
 * - Property 4: Tap Mode Click Callback
 * - Property 5: Select Mode State Transitions
 * - Property 6: Select Mode Selection Callback
 * - Property 7: Select Mode Item ARIA Attributes
 * - Property 8: MultiSelect Mode Toggle Behavior
 * - Property 9: MultiSelect Mode Selection Callback
 * 
 * Stemma System Naming: [Family]-[Type] = Button-VerticalList-Set
 * Component Type: Pattern (VerticalList-Set)
 * Custom Element Tag: <button-vertical-list-set>
 * 
 * @module Button-VerticalList-Set/__tests__/ButtonVerticalListSet.property
 * @see Requirements: 1.6, 1.7, 2.1, 3.1-3.4, 4.1-4.7, 5.1-5.5
 * @see .kiro/specs/041-vertical-list-buttons-pattern/design.md - Correctness Properties
 */

import * as fc from 'fast-check';
import { ButtonVerticalListSet } from '../platforms/web/ButtonVerticalListSet.web';
import { ButtonVerticalListItem } from '../../Button-VerticalList-Item/platforms/web/ButtonVerticalListItem.web';
import { setupRequiredTokens, cleanupRequiredTokens } from '../../Button-VerticalList-Item/__tests__/test-utils';
import type { SelectionMode } from '../types';

// ============================================================================
// Test Utilities
// ============================================================================

/**
 * Register the Button-VerticalList-Set and Button-VerticalList-Item custom elements
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
  mode?: SelectionMode;
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
 * Get all child items from the set
 */
function getChildItems(set: ButtonVerticalListSet): HTMLElement[] {
  const slot = set.shadowRoot?.querySelector('slot');
  if (!slot) return [];
  return slot.assignedElements() as HTMLElement[];
}

/**
 * Click a child item by index
 */
function clickChildItem(set: ButtonVerticalListSet, index: number): void {
  const items = getChildItems(set);
  if (items[index]) {
    items[index].click();
  }
}

// ============================================================================
// Test Data Generators (Arbitraries)
// ============================================================================

/**
 * All valid selection modes
 */
const allModes: SelectionMode[] = ['tap', 'select', 'multiSelect'];

/**
 * Fast-check arbitrary for selection modes
 */
const modeArbitrary = fc.constantFrom<SelectionMode>(...allModes);

/**
 * Fast-check arbitrary for item count (1-10 items)
 */
const itemCountArbitrary = fc.integer({ min: 1, max: 10 });

/**
 * Fast-check arbitrary for valid index within item count
 */
function validIndexArbitrary(itemCount: number): fc.Arbitrary<number> {
  return fc.integer({ min: 0, max: Math.max(0, itemCount - 1) });
}

/**
 * Fast-check arbitrary for valid indices array within item count
 */
function validIndicesArbitrary(itemCount: number): fc.Arbitrary<number[]> {
  if (itemCount === 0) return fc.constant([]);
  return fc.uniqueArray(fc.integer({ min: 0, max: itemCount - 1 }), { minLength: 0, maxLength: itemCount });
}

/**
 * Fast-check arbitrary for safe label strings
 */
const labelArbitrary = fc.string({ minLength: 1, maxLength: 50 })
  .filter((s: string) => /^[a-zA-Z0-9 ]+$/.test(s) && s.trim().length > 0);

// ============================================================================
// Property-Based Tests
// ============================================================================

describe('Property-Based Tests: Button-VerticalList-Set (Properties 1-9)', () => {
  
  beforeAll(() => {
    registerComponents();
  });
  
  afterAll(() => {
    cleanupRequiredTokens();
  });

  // ==========================================================================
  // Property 1: Single Click Event Per Interaction
  // ==========================================================================
  
  /**
   * Property 1: Single Click Event Per Interaction
   * 
   * *For any* user click interaction on a Button-VerticalList-Item, exactly one 
   * click event SHALL reach external listeners.
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 1: Single Click Event Per Interaction**
   * **Validates: Requirements 1.6, 1.7**
   */
  describe('Property 1: Single Click Event Per Interaction', () => {
    it('should fire exactly one click event per user interaction', async () => {
      await fc.assert(
        fc.asyncProperty(
          modeArbitrary,
          itemCountArbitrary,
          async (mode, itemCount) => {
            if (itemCount === 0) return true; // Skip empty sets
            
            const set = await createSet({ mode, itemCount });
            const clickIndex = Math.floor(Math.random() * itemCount);
            
            try {
              let clickCount = 0;
              const items = getChildItems(set);
              
              // Add click listener to the item
              const clickHandler = () => { clickCount++; };
              items[clickIndex].addEventListener('click', clickHandler);
              
              // Click the item
              items[clickIndex].click();
              
              // Wait for event propagation
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Verify exactly one click event
              expect(clickCount).toBe(1);
              
              // Cleanup listener
              items[clickIndex].removeEventListener('click', clickHandler);
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ==========================================================================
  // Property 2: ARIA Role Based on Mode
  // ==========================================================================
  
  /**
   * Property 2: ARIA Role Based on Mode
   * 
   * *For any* mode value ('tap', 'select', 'multiSelect'), the Button-VerticalList-Set 
   * container SHALL have the correct ARIA role:
   * - 'tap' → role="group"
   * - 'select' → role="radiogroup"
   * - 'multiSelect' → role="group" with aria-multiselectable="true"
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 2: ARIA Role Based on Mode**
   * **Validates: Requirements 2.1, 3.4, 4.6, 5.4**
   */
  describe('Property 2: ARIA Role Based on Mode', () => {
    it('should apply correct ARIA role based on mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          modeArbitrary,
          itemCountArbitrary,
          async (mode, itemCount) => {
            const set = await createSet({ mode, itemCount });
            
            try {
              const container = getContainer(set);
              expect(container).not.toBeNull();
              
              const role = container!.getAttribute('role');
              const ariaMultiSelectable = container!.getAttribute('aria-multiselectable');
              
              switch (mode) {
                case 'tap':
                  expect(role).toBe('group');
                  expect(ariaMultiSelectable).toBeNull();
                  break;
                case 'select':
                  expect(role).toBe('radiogroup');
                  expect(ariaMultiSelectable).toBeNull();
                  break;
                case 'multiSelect':
                  expect(role).toBe('group');
                  expect(ariaMultiSelectable).toBe('true');
                  break;
              }
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ==========================================================================
  // Property 3: Tap Mode Items Always Rest
  // ==========================================================================
  
  /**
   * Property 3: Tap Mode Items Always Rest
   * 
   * *For any* Button-VerticalList-Set in tap mode with any number of items, 
   * all items SHALL be in `rest` visual state regardless of user interactions.
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 3: Tap Mode Items Always Rest**
   * **Validates: Requirements 3.1, 3.3**
   */
  describe('Property 3: Tap Mode Items Always Rest', () => {
    it('should keep all items in rest state in tap mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          itemCountArbitrary,
          async (itemCount) => {
            if (itemCount === 0) return true; // Skip empty sets
            
            const set = await createSet({ mode: 'tap', itemCount });
            
            try {
              const items = getChildItems(set);
              
              // Verify all items are in rest state initially
              items.forEach((item, index) => {
                expect(item.getAttribute('visual-state')).toBe('rest');
              });
              
              // Click each item and verify state remains rest
              for (let i = 0; i < items.length; i++) {
                items[i].click();
                await new Promise(resolve => setTimeout(resolve, 0));
                
                // All items should still be in rest state
                items.forEach((item) => {
                  expect(item.getAttribute('visual-state')).toBe('rest');
                });
              }
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ==========================================================================
  // Property 4: Tap Mode Click Callback
  // ==========================================================================
  
  /**
   * Property 4: Tap Mode Click Callback
   * 
   * *For any* item clicked in tap mode, the `onItemClick` callback SHALL be 
   * invoked with the correct item index.
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 4: Tap Mode Click Callback**
   * **Validates: Requirements 3.2, 9.5**
   */
  describe('Property 4: Tap Mode Click Callback', () => {
    it('should invoke onItemClick with correct index in tap mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          itemCountArbitrary,
          async (itemCount) => {
            if (itemCount === 0) return true; // Skip empty sets
            
            const set = await createSet({ mode: 'tap', itemCount });
            const clickedIndices: number[] = [];
            
            set.onItemClick = (index: number) => {
              clickedIndices.push(index);
            };
            
            try {
              const items = getChildItems(set);
              
              // Click each item and verify callback receives correct index
              for (let i = 0; i < items.length; i++) {
                clickedIndices.length = 0; // Reset
                items[i].click();
                await new Promise(resolve => setTimeout(resolve, 0));
                
                expect(clickedIndices).toEqual([i]);
              }
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ==========================================================================
  // Property 5: Select Mode State Transitions
  // ==========================================================================
  
  /**
   * Property 5: Select Mode State Transitions
   * 
   * *For any* Button-VerticalList-Set in select mode:
   * - When an item is selected, that item SHALL be in `selected` state and all 
   *   other items SHALL be in `notSelected` state
   * - When the currently selected item is re-selected, all items SHALL return 
   *   to `rest` state
   * - When a different item is selected, the new item SHALL be `selected` and 
   *   all others SHALL be `notSelected`
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 5: Select Mode State Transitions**
   * **Validates: Requirements 4.2, 4.3, 4.4**
   */
  describe('Property 5: Select Mode State Transitions', () => {
    it('should transition states correctly in select mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          itemCountArbitrary,
          async (itemCount) => {
            if (itemCount < 2) return true; // Need at least 2 items for meaningful test
            
            const set = await createSet({ mode: 'select', selectedIndex: null, itemCount });
            
            try {
              const items = getChildItems(set);
              
              // Initially all items should be in rest state
              items.forEach((item) => {
                expect(item.getAttribute('visual-state')).toBe('rest');
              });
              
              // Select first item
              set.selectedIndex = 0;
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // First item should be selected, others notSelected
              expect(items[0].getAttribute('visual-state')).toBe('selected');
              for (let i = 1; i < items.length; i++) {
                expect(items[i].getAttribute('visual-state')).toBe('notSelected');
              }
              
              // Select a different item
              const newIndex = Math.min(1, itemCount - 1);
              set.selectedIndex = newIndex;
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // New item should be selected, others notSelected
              items.forEach((item, index) => {
                if (index === newIndex) {
                  expect(item.getAttribute('visual-state')).toBe('selected');
                } else {
                  expect(item.getAttribute('visual-state')).toBe('notSelected');
                }
              });
              
              // Deselect (set to null)
              set.selectedIndex = null;
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // All items should return to rest state
              items.forEach((item) => {
                expect(item.getAttribute('visual-state')).toBe('rest');
              });
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ==========================================================================
  // Property 6: Select Mode Selection Callback
  // ==========================================================================
  
  /**
   * Property 6: Select Mode Selection Callback
   * 
   * *For any* selection change in select mode, the `onSelectionChange` callback 
   * SHALL be invoked with the new index (or `null` for deselection).
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 6: Select Mode Selection Callback**
   * **Validates: Requirements 4.5, 9.3**
   */
  describe('Property 6: Select Mode Selection Callback', () => {
    it('should invoke onSelectionChange with correct value in select mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          itemCountArbitrary,
          async (itemCount) => {
            if (itemCount === 0) return true; // Skip empty sets
            
            const set = await createSet({ mode: 'select', selectedIndex: null, itemCount });
            const callbackValues: (number | null)[] = [];
            
            set.onSelectionChange = (index: number | null) => {
              callbackValues.push(index);
            };
            
            try {
              const items = getChildItems(set);
              
              // Click first item - should invoke callback with index 0
              callbackValues.length = 0;
              items[0].click();
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(callbackValues).toEqual([0]);
              
              // Update selectedIndex to reflect the selection (controlled component)
              set.selectedIndex = 0;
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Click same item again - should invoke callback with null (deselection)
              callbackValues.length = 0;
              items[0].click();
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(callbackValues).toEqual([null]);
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ==========================================================================
  // Property 7: Select Mode Item ARIA Attributes
  // ==========================================================================
  
  /**
   * Property 7: Select Mode Item ARIA Attributes
   * 
   * *For any* item in select mode, the item SHALL have `role="radio"` and 
   * `aria-checked` reflecting its selection state.
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 7: Select Mode Item ARIA Attributes**
   * **Validates: Requirements 4.7**
   */
  describe('Property 7: Select Mode Item ARIA Attributes', () => {
    it('should apply correct ARIA attributes to items in select mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          itemCountArbitrary,
          async (itemCount) => {
            if (itemCount === 0) return true; // Skip empty sets
            
            // Test with a selection
            const selectedIndex = Math.floor(Math.random() * itemCount);
            const set = await createSet({ mode: 'select', selectedIndex, itemCount });
            
            try {
              const items = getChildItems(set);
              
              // All items should have role="radio"
              items.forEach((item) => {
                expect(item.getAttribute('role')).toBe('radio');
              });
              
              // Selected item should have aria-checked="true", others "false"
              items.forEach((item, index) => {
                if (index === selectedIndex) {
                  expect(item.getAttribute('aria-checked')).toBe('true');
                } else {
                  expect(item.getAttribute('aria-checked')).toBe('false');
                }
              });
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ==========================================================================
  // Property 8: MultiSelect Mode Toggle Behavior
  // ==========================================================================
  
  /**
   * Property 8: MultiSelect Mode Toggle Behavior
   * 
   * *For any* item toggled in multiSelect mode, that item SHALL toggle between 
   * `checked` and `unchecked` states while other items remain unchanged.
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 8: MultiSelect Mode Toggle Behavior**
   * **Validates: Requirements 5.2**
   */
  describe('Property 8: MultiSelect Mode Toggle Behavior', () => {
    it('should toggle items correctly in multiSelect mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          itemCountArbitrary,
          async (itemCount) => {
            if (itemCount === 0) return true; // Skip empty sets
            
            const set = await createSet({ mode: 'multiSelect', selectedIndices: [], itemCount });
            
            try {
              const items = getChildItems(set);
              
              // Initially all items should be unchecked
              items.forEach((item) => {
                expect(item.getAttribute('visual-state')).toBe('unchecked');
              });
              
              // Toggle first item to checked
              set.selectedIndices = [0];
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(items[0].getAttribute('visual-state')).toBe('checked');
              for (let i = 1; i < items.length; i++) {
                expect(items[i].getAttribute('visual-state')).toBe('unchecked');
              }
              
              // Toggle first item back to unchecked
              set.selectedIndices = [];
              await new Promise(resolve => setTimeout(resolve, 0));
              
              items.forEach((item) => {
                expect(item.getAttribute('visual-state')).toBe('unchecked');
              });
              
              // Toggle multiple items
              if (itemCount >= 2) {
                set.selectedIndices = [0, 1];
                await new Promise(resolve => setTimeout(resolve, 0));
                
                expect(items[0].getAttribute('visual-state')).toBe('checked');
                expect(items[1].getAttribute('visual-state')).toBe('checked');
                for (let i = 2; i < items.length; i++) {
                  expect(items[i].getAttribute('visual-state')).toBe('unchecked');
                }
              }
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // ==========================================================================
  // Property 9: MultiSelect Mode Selection Callback
  // ==========================================================================
  
  /**
   * Property 9: MultiSelect Mode Selection Callback
   * 
   * *For any* selection change in multiSelect mode, the `onMultiSelectionChange` 
   * callback SHALL be invoked with the complete array of selected indices.
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 9: MultiSelect Mode Selection Callback**
   * **Validates: Requirements 5.3, 9.4**
   */
  describe('Property 9: MultiSelect Mode Selection Callback', () => {
    it('should invoke onMultiSelectionChange with correct array in multiSelect mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          itemCountArbitrary,
          async (itemCount) => {
            if (itemCount === 0) return true; // Skip empty sets
            
            const set = await createSet({ mode: 'multiSelect', selectedIndices: [], itemCount });
            const callbackValues: number[][] = [];
            
            set.onMultiSelectionChange = (indices: number[]) => {
              callbackValues.push([...indices]);
            };
            
            try {
              const items = getChildItems(set);
              
              // Click first item - should invoke callback with [0]
              callbackValues.length = 0;
              items[0].click();
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(callbackValues).toEqual([[0]]);
              
              // Update selectedIndices to reflect the selection (controlled component)
              set.selectedIndices = [0];
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Click second item (if exists) - should invoke callback with [0, 1]
              if (itemCount >= 2) {
                callbackValues.length = 0;
                items[1].click();
                await new Promise(resolve => setTimeout(resolve, 0));
                
                expect(callbackValues).toEqual([[0, 1]]);
                
                // Update selectedIndices
                set.selectedIndices = [0, 1];
                await new Promise(resolve => setTimeout(resolve, 0));
                
                // Click first item again - should invoke callback with [1] (toggle off)
                callbackValues.length = 0;
                items[0].click();
                await new Promise(resolve => setTimeout(resolve, 0));
                
                expect(callbackValues).toEqual([[1]]);
              }
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });

});
