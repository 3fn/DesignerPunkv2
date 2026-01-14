/**
 * @category evergreen
 * @purpose Property-based tests for Button-VerticalList-Set component (Properties 10-18)
 * @jest-environment jsdom
 * 
 * Property-based tests using fast-check to verify universal properties
 * that should hold across all valid inputs for the Button-VerticalList-Set component.
 * 
 * Properties covered in this file (Properties 10-18):
 * - Property 10: MultiSelect Mode Item ARIA Attributes
 * - Property 11: Animation Timing Coordination
 * - Property 12: Error State Propagation
 * - Property 13: Error Clearing on Valid Selection
 * - Property 14: Selection Count Validation
 * - Property 15: Error Accessibility Attributes
 * - Property 16: Keyboard Navigation
 * - Property 17: Controlled Component State Derivation
 * - Property 18: Token Usage for Styling
 * 
 * Stemma System Naming: [Family]-[Type] = Button-VerticalList-Set
 * Component Type: Pattern (VerticalList-Set)
 * Custom Element Tag: <button-vertical-list-set>
 * 
 * @module Button-VerticalList-Set/__tests__/ButtonVerticalListSet.property2
 * @see Requirements: 5.2-5.5, 6.1-6.5, 7.1-7.6, 8.2-8.6, 9.6, 11.4
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
 * Simulate keyboard event on an element
 */
function simulateKeyDown(element: HTMLElement, key: string): void {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
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
 * Fast-check arbitrary for valid indices array within item count
 */
function validIndicesArbitrary(itemCount: number): fc.Arbitrary<number[]> {
  if (itemCount === 0) return fc.constant([]);
  return fc.uniqueArray(fc.integer({ min: 0, max: itemCount - 1 }), { minLength: 0, maxLength: itemCount });
}


// ============================================================================
// Property-Based Tests (Properties 10-18)
// ============================================================================

describe('Property-Based Tests: Button-VerticalList-Set (Properties 10-18)', () => {
  
  beforeAll(() => {
    registerComponents();
  });
  
  afterAll(() => {
    cleanupRequiredTokens();
  });

  // ==========================================================================
  // Property 10: MultiSelect Mode Item ARIA Attributes
  // ==========================================================================
  
  /**
   * Property 10: MultiSelect Mode Item ARIA Attributes
   * 
   * *For any* item in multiSelect mode, the item SHALL have `role="checkbox"` 
   * and `aria-checked` reflecting its checked state.
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 10: MultiSelect Mode Item ARIA Attributes**
   * **Validates: Requirements 5.5**
   */
  describe('Property 10: MultiSelect Mode Item ARIA Attributes', () => {
    it('should apply correct ARIA attributes to items in multiSelect mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          itemCountArbitrary,
          async (itemCount) => {
            if (itemCount === 0) return true; // Skip empty sets
            
            // Generate random selection
            const selectedIndices = Array.from(
              { length: Math.floor(Math.random() * itemCount) },
              () => Math.floor(Math.random() * itemCount)
            ).filter((v, i, a) => a.indexOf(v) === i); // Unique indices
            
            const set = await createSet({ mode: 'multiSelect', selectedIndices, itemCount });
            
            try {
              const items = getChildItems(set);
              
              // All items should have role="checkbox"
              items.forEach((item) => {
                expect(item.getAttribute('role')).toBe('checkbox');
              });
              
              // Items in selectedIndices should have aria-checked="true", others "false"
              items.forEach((item, index) => {
                if (selectedIndices.includes(index)) {
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
  // Property 11: Animation Timing Coordination
  // ==========================================================================
  
  /**
   * Property 11: Animation Timing Coordination
   * 
   * *For any* selection change in select mode:
   * - When changing selection between items, the deselecting item SHALL have 
   *   `transitionDelay=0ms` and the selecting item SHALL have `transitionDelay=125ms`
   * - When deselecting (clearing selection), all items SHALL have `transitionDelay=0ms`
   * - The deselecting item SHALL have `checkmarkTransition='instant'`
   * 
   * *For any* toggle in multiSelect mode, the toggled item SHALL have `transitionDelay=0ms`.
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 11: Animation Timing Coordination**
   * **Validates: Requirements 6.1, 6.3, 6.4, 6.5**
   */
  describe('Property 11: Animation Timing Coordination', () => {
    it('should apply correct transition delays in select mode selection change', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 3, max: 10 }),
          async (itemCount) => {
            const set = await createSet({ mode: 'select', selectedIndex: null, itemCount });
            
            try {
              const items = getChildItems(set);
              
              // First selection: all items should have 0ms delay (simultaneous)
              set.selectedIndex = 0;
              await new Promise(resolve => setTimeout(resolve, 0));
              
              items.forEach((item) => {
                expect(item.getAttribute('transition-delay')).toBe('0');
              });
              
              // Selection change: deselecting item gets 0ms, selecting item gets 125ms
              // Simulate the internal state update that happens on click
              const previousIndex = 0;
              const newIndex = 1;
              
              // Click to trigger selection change
              items[newIndex].click();
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Update selectedIndex to reflect the change (controlled component)
              set.selectedIndex = newIndex;
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Verify staggered delays
              expect(items[previousIndex].getAttribute('transition-delay')).toBe('0');
              expect(items[newIndex].getAttribute('transition-delay')).toBe('125');
              
              // Verify checkmark transition on deselecting item
              expect(items[previousIndex].getAttribute('checkmark-transition')).toBe('instant');
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should apply 0ms transition delay in multiSelect mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          itemCountArbitrary,
          async (itemCount) => {
            if (itemCount === 0) return true;
            
            const set = await createSet({ mode: 'multiSelect', selectedIndices: [], itemCount });
            
            try {
              const items = getChildItems(set);
              
              // Toggle an item - should have 0ms delay
              set.selectedIndices = [0];
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // All items should have 0ms delay in multiSelect mode
              items.forEach((item) => {
                expect(item.getAttribute('transition-delay')).toBe('0');
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
  // Property 12: Error State Propagation
  // ==========================================================================
  
  /**
   * Property 12: Error State Propagation
   * 
   * *For any* Button-VerticalList-Set with `error={true}`, all child items 
   * SHALL receive `error={true}`.
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 12: Error State Propagation**
   * **Validates: Requirements 7.1**
   */
  describe('Property 12: Error State Propagation', () => {
    it('should propagate error state to all child items', async () => {
      await fc.assert(
        fc.asyncProperty(
          modeArbitrary,
          itemCountArbitrary,
          async (mode, itemCount) => {
            if (itemCount === 0) return true;
            
            const set = await createSet({ 
              mode, 
              itemCount, 
              error: true, 
              errorMessage: 'Test error' 
            });
            
            try {
              const items = getChildItems(set);
              
              // All items should have error="true"
              items.forEach((item) => {
                expect(item.getAttribute('error')).toBe('true');
              });
              
              // Now set error to false
              set.error = false;
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // All items should have error="false"
              items.forEach((item) => {
                expect(item.getAttribute('error')).toBe('false');
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
  // Property 13: Error Clearing on Valid Selection
  // ==========================================================================
  
  /**
   * Property 13: Error Clearing on Valid Selection
   * 
   * *For any* Button-VerticalList-Set with `required={true}` and `error={true}`, 
   * when a valid selection is made, the error state SHALL be cleared.
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 13: Error Clearing on Valid Selection**
   * **Validates: Requirements 7.3**
   */
  describe('Property 13: Error Clearing on Valid Selection', () => {
    it('should clear error on valid selection in select mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          itemCountArbitrary,
          async (itemCount) => {
            if (itemCount === 0) return true;
            
            const set = await createSet({ 
              mode: 'select', 
              selectedIndex: null,
              itemCount, 
              error: true, 
              errorMessage: 'Please select an option',
              required: true
            });
            
            try {
              // Verify error state is set
              expect(set.error).toBe(true);
              
              const items = getChildItems(set);
              
              // Click an item to make a valid selection
              items[0].click();
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Error should be cleared
              expect(set.error).toBe(false);
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should clear error on valid selection in multiSelect mode with minSelections', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 2, max: 10 }),
          async (itemCount) => {
            const minSelections = 1;
            
            const set = await createSet({ 
              mode: 'multiSelect', 
              selectedIndices: [],
              itemCount, 
              error: true, 
              errorMessage: 'Please select at least 1 option',
              minSelections
            });
            
            try {
              // Verify error state is set
              expect(set.error).toBe(true);
              
              const items = getChildItems(set);
              
              // Click an item to meet minSelections
              items[0].click();
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Error should be cleared
              expect(set.error).toBe(false);
              
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
  // Property 14: Selection Count Validation
  // ==========================================================================
  
  /**
   * Property 14: Selection Count Validation
   * 
   * *For any* Button-VerticalList-Set in multiSelect mode:
   * - When `minSelections` is set, validation SHALL fail if fewer than that many items are selected
   * - When `maxSelections` is set, selecting additional items SHALL be prevented when at the maximum
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 14: Selection Count Validation**
   * **Validates: Requirements 7.4, 7.5**
   */
  describe('Property 14: Selection Count Validation', () => {
    it('should validate minSelections constraint', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 3, max: 10 }),
          fc.integer({ min: 1, max: 3 }),
          async (itemCount, minSelections) => {
            // Ensure minSelections doesn't exceed itemCount
            const actualMinSelections = Math.min(minSelections, itemCount);
            
            const set = await createSet({ 
              mode: 'multiSelect', 
              selectedIndices: [],
              itemCount, 
              minSelections: actualMinSelections
            });
            
            try {
              // Validate with fewer than minSelections
              const result = set.validate();
              expect(result.isValid).toBe(false);
              expect(result.message).toContain('at least');
              
              // Select enough items to meet minSelections
              const indices = Array.from({ length: actualMinSelections }, (_, i) => i);
              set.selectedIndices = indices;
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Validate again - should pass
              const result2 = set.validate();
              expect(result2.isValid).toBe(true);
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should enforce maxSelections constraint', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 4, max: 10 }),
          fc.integer({ min: 1, max: 3 }),
          async (itemCount, maxSelections) => {
            // Start with maxSelections items already selected
            const initialIndices = Array.from({ length: maxSelections }, (_, i) => i);
            
            const set = await createSet({ 
              mode: 'multiSelect', 
              selectedIndices: initialIndices,
              itemCount, 
              maxSelections
            });
            
            try {
              const items = getChildItems(set);
              const callbackValues: number[][] = [];
              
              set.onMultiSelectionChange = (indices: number[]) => {
                callbackValues.push([...indices]);
              };
              
              // Try to select an additional item (beyond max)
              const newIndex = maxSelections; // First unselected item
              callbackValues.length = 0;
              items[newIndex].click();
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Callback should NOT be invoked (selection prevented)
              expect(callbackValues.length).toBe(0);
              
              // Can still deselect an item
              callbackValues.length = 0;
              items[0].click();
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Callback should be invoked for deselection
              expect(callbackValues.length).toBe(1);
              expect(callbackValues[0]).not.toContain(0);
              
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
  // Property 15: Error Accessibility Attributes
  // ==========================================================================
  
  /**
   * Property 15: Error Accessibility Attributes
   * 
   * *For any* Button-VerticalList-Set with `error={true}` and `errorMessage` provided, 
   * the container SHALL have `aria-invalid="true"` and `aria-describedby` linking 
   * to the error message.
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 15: Error Accessibility Attributes**
   * **Validates: Requirements 7.6**
   */
  describe('Property 15: Error Accessibility Attributes', () => {
    it('should apply error accessibility attributes when error is true', async () => {
      await fc.assert(
        fc.asyncProperty(
          modeArbitrary,
          itemCountArbitrary,
          fc.string({ minLength: 1, maxLength: 100 }).filter(s => s.trim().length > 0),
          async (mode, itemCount, errorMessage) => {
            const set = await createSet({ 
              mode, 
              itemCount, 
              error: true, 
              errorMessage 
            });
            
            try {
              const container = getContainer(set);
              expect(container).not.toBeNull();
              
              // Container should have aria-invalid="true"
              expect(container!.getAttribute('aria-invalid')).toBe('true');
              
              // Container should have aria-describedby linking to error message
              const describedBy = container!.getAttribute('aria-describedby');
              expect(describedBy).not.toBeNull();
              
              // The error message element should exist with the referenced ID
              const errorEl = set.shadowRoot?.getElementById(describedBy!);
              expect(errorEl).not.toBeNull();
              expect(errorEl!.getAttribute('role')).toBe('alert');
              expect(errorEl!.textContent).toBe(errorMessage);
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not have error accessibility attributes when error is false', async () => {
      await fc.assert(
        fc.asyncProperty(
          modeArbitrary,
          itemCountArbitrary,
          async (mode, itemCount) => {
            const set = await createSet({ 
              mode, 
              itemCount, 
              error: false 
            });
            
            try {
              const container = getContainer(set);
              expect(container).not.toBeNull();
              
              // Container should NOT have aria-invalid
              expect(container!.getAttribute('aria-invalid')).toBeNull();
              
              // Container should NOT have aria-describedby
              expect(container!.getAttribute('aria-describedby')).toBeNull();
              
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
  // Property 16: Keyboard Navigation
  // ==========================================================================
  
  /**
   * Property 16: Keyboard Navigation
   * 
   * *For any* Button-VerticalList-Set with focus:
   * - Arrow Up/Down SHALL move focus between items with wrapping
   * - Enter/Space SHALL activate the focused item according to mode
   * - Focus SHALL be managed using roving tabindex pattern (focused item has 
   *   `tabindex=0`, others have `tabindex=-1`)
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 16: Keyboard Navigation**
   * **Validates: Requirements 8.2, 8.3, 8.6**
   */
  describe('Property 16: Keyboard Navigation', () => {
    it('should move focus with arrow keys and wrap at boundaries', async () => {
      await fc.assert(
        fc.asyncProperty(
          modeArbitrary,
          fc.integer({ min: 3, max: 10 }),
          async (mode, itemCount) => {
            const set = await createSet({ mode, itemCount });
            
            try {
              const items = getChildItems(set);
              
              // Focus the first item
              items[0].focus();
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Verify roving tabindex - first item should have tabindex=0
              expect(items[0].getAttribute('tabindex')).toBe('0');
              for (let i = 1; i < items.length; i++) {
                expect(items[i].getAttribute('tabindex')).toBe('-1');
              }
              
              // Arrow Down should move focus to next item
              simulateKeyDown(set, 'ArrowDown');
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Second item should now have tabindex=0
              expect(items[0].getAttribute('tabindex')).toBe('-1');
              expect(items[1].getAttribute('tabindex')).toBe('0');
              
              // Arrow Up should move focus back to first item
              simulateKeyDown(set, 'ArrowUp');
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(items[0].getAttribute('tabindex')).toBe('0');
              expect(items[1].getAttribute('tabindex')).toBe('-1');
              
              // Arrow Up at first item should wrap to last item
              simulateKeyDown(set, 'ArrowUp');
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(items[0].getAttribute('tabindex')).toBe('-1');
              expect(items[itemCount - 1].getAttribute('tabindex')).toBe('0');
              
              // Arrow Down at last item should wrap to first item
              simulateKeyDown(set, 'ArrowDown');
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(items[0].getAttribute('tabindex')).toBe('0');
              expect(items[itemCount - 1].getAttribute('tabindex')).toBe('-1');
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should activate item with Enter/Space in tap mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          itemCountArbitrary,
          async (itemCount) => {
            if (itemCount === 0) return true;
            
            const set = await createSet({ mode: 'tap', itemCount });
            const clickedIndices: number[] = [];
            
            set.onItemClick = (index: number) => {
              clickedIndices.push(index);
            };
            
            try {
              const items = getChildItems(set);
              
              // Focus the first item
              items[0].focus();
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Press Enter - should invoke callback
              clickedIndices.length = 0;
              simulateKeyDown(set, 'Enter');
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(clickedIndices).toEqual([0]);
              
              // Press Space - should invoke callback
              clickedIndices.length = 0;
              simulateKeyDown(set, ' ');
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(clickedIndices).toEqual([0]);
              
              return true;
            } finally {
              cleanupSet(set);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should activate item with Enter/Space in select mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          itemCountArbitrary,
          async (itemCount) => {
            if (itemCount === 0) return true;
            
            const set = await createSet({ mode: 'select', selectedIndex: null, itemCount });
            const callbackValues: (number | null)[] = [];
            
            set.onSelectionChange = (index: number | null) => {
              callbackValues.push(index);
            };
            
            try {
              const items = getChildItems(set);
              
              // Focus the first item
              items[0].focus();
              await new Promise(resolve => setTimeout(resolve, 0));
              
              // Press Enter - should invoke callback with index 0
              callbackValues.length = 0;
              simulateKeyDown(set, 'Enter');
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(callbackValues).toEqual([0]);
              
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
  // Property 17: Controlled Component State Derivation
  // ==========================================================================
  
  /**
   * Property 17: Controlled Component State Derivation
   * 
   * *For any* Button-VerticalList-Set, child visual states SHALL be derived 
   * entirely from controlled props (`selectedIndex` or `selectedIndices`), 
   * not from internal state.
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 17: Controlled Component State Derivation**
   * **Validates: Requirements 9.6**
   */
  describe('Property 17: Controlled Component State Derivation', () => {
    it('should derive visual states from controlled props in select mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 2, max: 10 }),
          async (itemCount) => {
            const set = await createSet({ mode: 'select', selectedIndex: null, itemCount });
            
            try {
              const items = getChildItems(set);
              
              // Initially all items should be in rest state (no selection)
              items.forEach((item) => {
                expect(item.getAttribute('visual-state')).toBe('rest');
              });
              
              // Set selectedIndex to 0 - visual states should update
              set.selectedIndex = 0;
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(items[0].getAttribute('visual-state')).toBe('selected');
              for (let i = 1; i < items.length; i++) {
                expect(items[i].getAttribute('visual-state')).toBe('notSelected');
              }
              
              // Change selectedIndex to 1 - visual states should update
              set.selectedIndex = 1;
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(items[0].getAttribute('visual-state')).toBe('notSelected');
              expect(items[1].getAttribute('visual-state')).toBe('selected');
              for (let i = 2; i < items.length; i++) {
                expect(items[i].getAttribute('visual-state')).toBe('notSelected');
              }
              
              // Set selectedIndex to null - all should return to rest
              set.selectedIndex = null;
              await new Promise(resolve => setTimeout(resolve, 0));
              
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

    it('should derive visual states from controlled props in multiSelect mode', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.integer({ min: 3, max: 10 }),
          async (itemCount) => {
            const set = await createSet({ mode: 'multiSelect', selectedIndices: [], itemCount });
            
            try {
              const items = getChildItems(set);
              
              // Initially all items should be unchecked
              items.forEach((item) => {
                expect(item.getAttribute('visual-state')).toBe('unchecked');
              });
              
              // Set selectedIndices to [0, 2] - visual states should update
              set.selectedIndices = [0, 2];
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(items[0].getAttribute('visual-state')).toBe('checked');
              expect(items[1].getAttribute('visual-state')).toBe('unchecked');
              expect(items[2].getAttribute('visual-state')).toBe('checked');
              for (let i = 3; i < items.length; i++) {
                expect(items[i].getAttribute('visual-state')).toBe('unchecked');
              }
              
              // Change selectedIndices to [1] - visual states should update
              set.selectedIndices = [1];
              await new Promise(resolve => setTimeout(resolve, 0));
              
              expect(items[0].getAttribute('visual-state')).toBe('unchecked');
              expect(items[1].getAttribute('visual-state')).toBe('checked');
              for (let i = 2; i < items.length; i++) {
                expect(items[i].getAttribute('visual-state')).toBe('unchecked');
              }
              
              // Set selectedIndices to [] - all should be unchecked
              set.selectedIndices = [];
              await new Promise(resolve => setTimeout(resolve, 0));
              
              items.forEach((item) => {
                expect(item.getAttribute('visual-state')).toBe('unchecked');
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
  // Property 18: Token Usage for Styling
  // ==========================================================================
  
  /**
   * Property 18: Token Usage for Styling
   * 
   * *For any* spacing, color, or animation value in Button-VerticalList-Set, 
   * the value SHALL reference a design token (no hard-coded values).
   * 
   * **Feature: 041-vertical-list-buttons-pattern, Property 18: Token Usage for Styling**
   * **Validates: Requirements 11.4**
   * 
   * Note: CSS imports are mocked in Jest (see jest.config.js moduleNameMapper).
   * These tests verify token usage by reading the actual CSS file content directly,
   * rather than checking the shadow DOM style element (which contains empty string in tests).
   */
  describe('Property 18: Token Usage for Styling', () => {
    // Read the actual CSS file content for verification
    // This is necessary because CSS imports are mocked in Jest
    const fs = require('fs');
    const path = require('path');
    const cssFilePath = path.join(
      __dirname, 
      '../platforms/web/Button-VerticalList-Set.styles.css'
    );
    
    let cssContent: string;
    
    beforeAll(() => {
      // Read the CSS file content once before all tests
      cssContent = fs.readFileSync(cssFilePath, 'utf-8');
    });
    
    it('should use CSS custom properties (tokens) for styling', async () => {
      await fc.assert(
        fc.asyncProperty(
          modeArbitrary,
          itemCountArbitrary,
          async (mode, itemCount) => {
            // Verify the CSS file uses var() references for token consumption
            // This is the architectural requirement for token-based styling
            const hasVarReferences = cssContent.includes('var(--');
            
            // The CSS should contain var() references for token usage
            // Examples: var(--space-grouped-normal), var(--color-error-strong)
            expect(hasVarReferences).toBe(true);
            
            // Verify no hard-coded pixel values for spacing (except 0)
            // Token-based styling should use var() for all spacing values
            const hasHardCodedSpacing = /:\s*\d+px(?!\s*!important)/.test(cssContent);
            
            // Allow 0px as it's a valid reset value
            // But other pixel values should use tokens
            const hardCodedMatches = cssContent.match(/:\s*(\d+)px/g) || [];
            const nonZeroHardCoded = hardCodedMatches.filter(m => !m.includes('0px'));
            
            // Should have no non-zero hard-coded pixel values
            expect(nonZeroHardCoded.length).toBe(0);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use component-scoped CSS custom properties with --_vls- prefix', async () => {
      await fc.assert(
        fc.asyncProperty(
          modeArbitrary,
          async (mode) => {
            // Verify the CSS uses the --_vls- prefix for component-scoped properties
            // This is a requirement from the design document (Requirement 11.3)
            const hasVlsPrefix = cssContent.includes('--_vls-');
            
            // The component should define its own scoped properties
            // Examples: --_vls-gap, --_vls-error-color
            expect(hasVlsPrefix).toBe(true);
            
            // Verify the component defines custom properties in :host
            const definesInHost = cssContent.includes(':host') && 
                                  cssContent.includes('--_vls-');
            expect(definesInHost).toBe(true);
            
            // Verify the component uses its scoped properties in rules
            const usesVlsProperties = cssContent.includes('var(--_vls-');
            expect(usesVlsProperties).toBe(true);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

});
