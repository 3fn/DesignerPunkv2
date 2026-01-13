/**
 * State Derivation Logic Tests
 * 
 * Tests for the deriveItemStates() function that transforms controlled props
 * (mode, selectedIndex, selectedIndices) into visual states for child items.
 * 
 * @module Button-VerticalList-Set/__tests__/deriveItemStates.test
 * @see Requirements: 3.1, 4.1, 4.2, 5.1, 9.6
 */

import { deriveItemStates } from '../types';

describe('deriveItemStates', () => {
  // ─────────────────────────────────────────────────────────────────
  // Tap Mode Tests (Requirement 3.1)
  // ─────────────────────────────────────────────────────────────────
  
  describe('Tap Mode', () => {
    it('should return all rest states for tap mode with no items', () => {
      const result = deriveItemStates('tap', null, [], 0);
      expect(result).toEqual([]);
    });
    
    it('should return all rest states for tap mode with multiple items', () => {
      const result = deriveItemStates('tap', null, [], 3);
      expect(result).toEqual(['rest', 'rest', 'rest']);
    });
    
    it('should ignore selectedIndex in tap mode', () => {
      // Even if selectedIndex is set, tap mode should return all rest
      const result = deriveItemStates('tap', 1, [], 3);
      expect(result).toEqual(['rest', 'rest', 'rest']);
    });
    
    it('should ignore selectedIndices in tap mode', () => {
      // Even if selectedIndices is set, tap mode should return all rest
      const result = deriveItemStates('tap', null, [0, 2], 3);
      expect(result).toEqual(['rest', 'rest', 'rest']);
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // Select Mode Tests (Requirements 4.1, 4.2)
  // ─────────────────────────────────────────────────────────────────
  
  describe('Select Mode', () => {
    it('should return all rest states when no selection exists', () => {
      const result = deriveItemStates('select', null, [], 3);
      expect(result).toEqual(['rest', 'rest', 'rest']);
    });
    
    it('should return selected for selected item and notSelected for others', () => {
      const result = deriveItemStates('select', 1, [], 3);
      expect(result).toEqual(['notSelected', 'selected', 'notSelected']);
    });
    
    it('should handle first item selected', () => {
      const result = deriveItemStates('select', 0, [], 3);
      expect(result).toEqual(['selected', 'notSelected', 'notSelected']);
    });
    
    it('should handle last item selected', () => {
      const result = deriveItemStates('select', 2, [], 3);
      expect(result).toEqual(['notSelected', 'notSelected', 'selected']);
    });
    
    it('should handle single item list with selection', () => {
      const result = deriveItemStates('select', 0, [], 1);
      expect(result).toEqual(['selected']);
    });
    
    it('should handle single item list without selection', () => {
      const result = deriveItemStates('select', null, [], 1);
      expect(result).toEqual(['rest']);
    });
    
    it('should ignore selectedIndices in select mode', () => {
      // selectedIndices should be ignored in select mode
      const result = deriveItemStates('select', 1, [0, 2], 3);
      expect(result).toEqual(['notSelected', 'selected', 'notSelected']);
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // MultiSelect Mode Tests (Requirement 5.1)
  // ─────────────────────────────────────────────────────────────────
  
  describe('MultiSelect Mode', () => {
    it('should return all unchecked states when no selections exist', () => {
      const result = deriveItemStates('multiSelect', null, [], 3);
      expect(result).toEqual(['unchecked', 'unchecked', 'unchecked']);
    });
    
    it('should return checked for selected items and unchecked for others', () => {
      const result = deriveItemStates('multiSelect', null, [0, 2], 3);
      expect(result).toEqual(['checked', 'unchecked', 'checked']);
    });
    
    it('should handle all items selected', () => {
      const result = deriveItemStates('multiSelect', null, [0, 1, 2], 3);
      expect(result).toEqual(['checked', 'checked', 'checked']);
    });
    
    it('should handle single item selected', () => {
      const result = deriveItemStates('multiSelect', null, [1], 3);
      expect(result).toEqual(['unchecked', 'checked', 'unchecked']);
    });
    
    it('should handle empty list', () => {
      const result = deriveItemStates('multiSelect', null, [], 0);
      expect(result).toEqual([]);
    });
    
    it('should ignore selectedIndex in multiSelect mode', () => {
      // selectedIndex should be ignored in multiSelect mode
      const result = deriveItemStates('multiSelect', 1, [0, 2], 3);
      expect(result).toEqual(['checked', 'unchecked', 'checked']);
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // Controlled Component Behavior (Requirement 9.6)
  // ─────────────────────────────────────────────────────────────────
  
  describe('Controlled Component Behavior', () => {
    it('should derive states purely from props without side effects', () => {
      // Call multiple times with same props should return same result
      const props = { mode: 'select' as const, selectedIndex: 1, selectedIndices: [] as number[], itemCount: 3 };
      
      const result1 = deriveItemStates(props.mode, props.selectedIndex, props.selectedIndices, props.itemCount);
      const result2 = deriveItemStates(props.mode, props.selectedIndex, props.selectedIndices, props.itemCount);
      
      expect(result1).toEqual(result2);
      expect(result1).toEqual(['notSelected', 'selected', 'notSelected']);
    });
    
    it('should return new array on each call (no mutation)', () => {
      const result1 = deriveItemStates('tap', null, [], 3);
      const result2 = deriveItemStates('tap', null, [], 3);
      
      // Should be equal but not the same reference
      expect(result1).toEqual(result2);
      expect(result1).not.toBe(result2);
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // Edge Cases
  // ─────────────────────────────────────────────────────────────────
  
  describe('Edge Cases', () => {
    it('should handle large item counts', () => {
      const result = deriveItemStates('select', 50, [], 100);
      
      expect(result.length).toBe(100);
      expect(result[50]).toBe('selected');
      expect(result.filter(s => s === 'notSelected').length).toBe(99);
    });
    
    it('should handle out-of-bounds selectedIndex gracefully', () => {
      // If selectedIndex is out of bounds, all items should be notSelected
      // (the selected item doesn't exist in the list)
      const result = deriveItemStates('select', 10, [], 3);
      expect(result).toEqual(['notSelected', 'notSelected', 'notSelected']);
    });
    
    it('should handle out-of-bounds selectedIndices gracefully', () => {
      // Out-of-bounds indices in selectedIndices should be ignored
      const result = deriveItemStates('multiSelect', null, [0, 10, 2], 3);
      expect(result).toEqual(['checked', 'unchecked', 'checked']);
    });
    
    it('should handle negative selectedIndex', () => {
      // Negative index should result in no selection matching
      const result = deriveItemStates('select', -1, [], 3);
      expect(result).toEqual(['notSelected', 'notSelected', 'notSelected']);
    });
  });
});
