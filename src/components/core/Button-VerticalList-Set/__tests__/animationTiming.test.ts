/**
 * Animation Timing Functions Tests
 * 
 * Tests for the animation timing calculation functions used by
 * Button-VerticalList-Set to coordinate animation timing across child items.
 * 
 * @module Button-VerticalList-Set/__tests__/animationTiming
 * @see Requirements 6.1, 6.2, 6.3, 6.4, 6.5
 */

import {
  calculateStaggeredDelays,
  calculateFirstSelectionDelays,
  calculateDeselectionDelays,
  calculateMultiSelectDelay,
  getCheckmarkTransition
} from '../types';

describe('Animation Timing Functions', () => {
  // ─────────────────────────────────────────────────────────────────
  // calculateStaggeredDelays
  // ─────────────────────────────────────────────────────────────────
  
  describe('calculateStaggeredDelays', () => {
    /**
     * @see Requirement 6.1: "WHEN selection changes between items THEN 
     * deselecting item gets 0ms, selecting item gets 125ms"
     */
    it('should return 0ms for deselecting item and 125ms for selecting item', () => {
      // Selection changes from item 0 to item 2 in a 4-item list
      const delays = calculateStaggeredDelays(0, 2, 4);
      
      expect(delays).toHaveLength(4);
      expect(delays[0]).toBe(0);   // Deselecting item: 0ms
      expect(delays[2]).toBe(125); // Selecting item: 125ms
      expect(delays[1]).toBe(0);   // Other items: 0ms
      expect(delays[3]).toBe(0);   // Other items: 0ms
    });
    
    it('should handle adjacent items correctly', () => {
      // Selection changes from item 1 to item 2
      const delays = calculateStaggeredDelays(1, 2, 3);
      
      expect(delays[1]).toBe(0);   // Deselecting item: 0ms
      expect(delays[2]).toBe(125); // Selecting item: 125ms
    });
    
    it('should handle selection moving backwards', () => {
      // Selection changes from item 3 to item 0
      const delays = calculateStaggeredDelays(3, 0, 4);
      
      expect(delays[3]).toBe(0);   // Deselecting item: 0ms
      expect(delays[0]).toBe(125); // Selecting item: 125ms
    });
    
    it('should return correct length array', () => {
      const delays = calculateStaggeredDelays(0, 1, 10);
      expect(delays).toHaveLength(10);
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // calculateFirstSelectionDelays
  // ─────────────────────────────────────────────────────────────────
  
  describe('calculateFirstSelectionDelays', () => {
    /**
     * @see Requirement 6.2: "WHEN first selection is made THEN all items get 0ms"
     */
    it('should return all 0ms delays for simultaneous animation', () => {
      const delays = calculateFirstSelectionDelays(3);
      
      expect(delays).toHaveLength(3);
      expect(delays).toEqual([0, 0, 0]);
    });
    
    it('should handle single item list', () => {
      const delays = calculateFirstSelectionDelays(1);
      expect(delays).toEqual([0]);
    });
    
    it('should handle larger lists', () => {
      const delays = calculateFirstSelectionDelays(10);
      
      expect(delays).toHaveLength(10);
      expect(delays.every(d => d === 0)).toBe(true);
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // calculateDeselectionDelays
  // ─────────────────────────────────────────────────────────────────
  
  describe('calculateDeselectionDelays', () => {
    /**
     * @see Requirement 6.3: "WHEN deselection occurs THEN all items get 0ms"
     */
    it('should return all 0ms delays for simultaneous animation', () => {
      const delays = calculateDeselectionDelays(3);
      
      expect(delays).toHaveLength(3);
      expect(delays).toEqual([0, 0, 0]);
    });
    
    it('should handle single item list', () => {
      const delays = calculateDeselectionDelays(1);
      expect(delays).toEqual([0]);
    });
    
    it('should handle larger lists', () => {
      const delays = calculateDeselectionDelays(5);
      
      expect(delays).toHaveLength(5);
      expect(delays.every(d => d === 0)).toBe(true);
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // calculateMultiSelectDelay
  // ─────────────────────────────────────────────────────────────────
  
  describe('calculateMultiSelectDelay', () => {
    /**
     * @see Requirement 6.4: "WHEN items toggle in MultiSelect mode THEN 
     * toggled item gets 0ms (independent animation)"
     */
    it('should return all 0ms delays for independent animation', () => {
      const delays = calculateMultiSelectDelay(1, 3);
      
      expect(delays).toHaveLength(3);
      expect(delays).toEqual([0, 0, 0]);
    });
    
    it('should handle any toggled index', () => {
      // Toggle first item
      expect(calculateMultiSelectDelay(0, 3)).toEqual([0, 0, 0]);
      
      // Toggle last item
      expect(calculateMultiSelectDelay(2, 3)).toEqual([0, 0, 0]);
    });
    
    it('should handle larger lists', () => {
      const delays = calculateMultiSelectDelay(5, 10);
      
      expect(delays).toHaveLength(10);
      expect(delays.every(d => d === 0)).toBe(true);
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // getCheckmarkTransition
  // ─────────────────────────────────────────────────────────────────
  
  describe('getCheckmarkTransition', () => {
    /**
     * @see Requirement 6.5: "checkmarkTransition='instant' on deselecting items in Select mode"
     */
    it('should return instant for deselecting items in Select mode', () => {
      const transition = getCheckmarkTransition(true, 'select');
      expect(transition).toBe('instant');
    });
    
    it('should return animated for selecting items in Select mode', () => {
      const transition = getCheckmarkTransition(false, 'select');
      expect(transition).toBe('animated');
    });
    
    it('should return animated for all items in MultiSelect mode', () => {
      // Deselecting in multiSelect
      expect(getCheckmarkTransition(true, 'multiSelect')).toBe('animated');
      
      // Selecting in multiSelect
      expect(getCheckmarkTransition(false, 'multiSelect')).toBe('animated');
    });
    
    it('should return animated for all items in Tap mode', () => {
      // Tap mode doesn't have selection state, but function should handle it
      expect(getCheckmarkTransition(true, 'tap')).toBe('animated');
      expect(getCheckmarkTransition(false, 'tap')).toBe('animated');
    });
  });
});
