/**
 * Validation Logic Tests
 * 
 * Tests for the validateSelection() and canSelectItem() functions that
 * handle selection validation and max selection enforcement.
 * 
 * @module Button-VerticalList-Set/__tests__/validation.test
 * @see Requirements: 7.3, 7.4, 7.5
 */

import { validateSelection, canSelectItem } from '../types';

describe('validateSelection', () => {
  // ─────────────────────────────────────────────────────────────────
  // Tap Mode Tests (No validation)
  // ─────────────────────────────────────────────────────────────────
  
  describe('Tap Mode', () => {
    it('should always return valid for tap mode', () => {
      const result = validateSelection('tap', null, [], false);
      expect(result).toEqual({ isValid: true, message: null });
    });
    
    it('should ignore required flag in tap mode', () => {
      const result = validateSelection('tap', null, [], true);
      expect(result).toEqual({ isValid: true, message: null });
    });
    
    it('should ignore minSelections in tap mode', () => {
      const result = validateSelection('tap', null, [], false, 2);
      expect(result).toEqual({ isValid: true, message: null });
    });
    
    it('should ignore maxSelections in tap mode', () => {
      const result = validateSelection('tap', null, [], false, undefined, 3);
      expect(result).toEqual({ isValid: true, message: null });
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // Select Mode Tests (Requirement 7.3)
  // ─────────────────────────────────────────────────────────────────
  
  describe('Select Mode', () => {
    it('should return valid when not required and no selection', () => {
      const result = validateSelection('select', null, [], false);
      expect(result).toEqual({ isValid: true, message: null });
    });
    
    it('should return valid when required and has selection', () => {
      const result = validateSelection('select', 1, [], true);
      expect(result).toEqual({ isValid: true, message: null });
    });
    
    it('should return invalid when required and no selection', () => {
      const result = validateSelection('select', null, [], true);
      expect(result).toEqual({ 
        isValid: false, 
        message: 'Please select an option' 
      });
    });
    
    it('should return valid when required and first item selected', () => {
      const result = validateSelection('select', 0, [], true);
      expect(result).toEqual({ isValid: true, message: null });
    });
    
    it('should ignore minSelections in select mode', () => {
      const result = validateSelection('select', null, [], false, 2);
      expect(result).toEqual({ isValid: true, message: null });
    });
    
    it('should ignore maxSelections in select mode', () => {
      const result = validateSelection('select', 0, [], false, undefined, 1);
      expect(result).toEqual({ isValid: true, message: null });
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // MultiSelect Mode Tests (Requirements 7.4, 7.5)
  // ─────────────────────────────────────────────────────────────────
  
  describe('MultiSelect Mode', () => {
    describe('minSelections validation (Requirement 7.4)', () => {
      it('should return valid when no minSelections set', () => {
        const result = validateSelection('multiSelect', null, [], false);
        expect(result).toEqual({ isValid: true, message: null });
      });
      
      it('should return valid when minSelections met', () => {
        const result = validateSelection('multiSelect', null, [0, 1], false, 2);
        expect(result).toEqual({ isValid: true, message: null });
      });
      
      it('should return valid when minSelections exceeded', () => {
        const result = validateSelection('multiSelect', null, [0, 1, 2], false, 2);
        expect(result).toEqual({ isValid: true, message: null });
      });
      
      it('should return invalid when minSelections not met (singular)', () => {
        const result = validateSelection('multiSelect', null, [], false, 1);
        expect(result).toEqual({ 
          isValid: false, 
          message: 'Please select at least 1 option' 
        });
      });
      
      it('should return invalid when minSelections not met (plural)', () => {
        const result = validateSelection('multiSelect', null, [0], false, 2);
        expect(result).toEqual({ 
          isValid: false, 
          message: 'Please select at least 2 options' 
        });
      });
      
      it('should return invalid when minSelections is 3 and only 2 selected', () => {
        const result = validateSelection('multiSelect', null, [0, 1], false, 3);
        expect(result).toEqual({ 
          isValid: false, 
          message: 'Please select at least 3 options' 
        });
      });
    });
    
    describe('maxSelections validation (Requirement 7.5)', () => {
      it('should return valid when no maxSelections set', () => {
        const result = validateSelection('multiSelect', null, [0, 1, 2, 3, 4], false);
        expect(result).toEqual({ isValid: true, message: null });
      });
      
      it('should return valid when maxSelections not exceeded', () => {
        const result = validateSelection('multiSelect', null, [0, 1], false, undefined, 3);
        expect(result).toEqual({ isValid: true, message: null });
      });
      
      it('should return valid when exactly at maxSelections', () => {
        const result = validateSelection('multiSelect', null, [0, 1, 2], false, undefined, 3);
        expect(result).toEqual({ isValid: true, message: null });
      });
      
      it('should return invalid when maxSelections exceeded (singular)', () => {
        const result = validateSelection('multiSelect', null, [0, 1], false, undefined, 1);
        expect(result).toEqual({ 
          isValid: false, 
          message: 'Please select no more than 1 option' 
        });
      });
      
      it('should return invalid when maxSelections exceeded (plural)', () => {
        const result = validateSelection('multiSelect', null, [0, 1, 2, 3], false, undefined, 3);
        expect(result).toEqual({ 
          isValid: false, 
          message: 'Please select no more than 3 options' 
        });
      });
    });
    
    describe('Combined min and max validation', () => {
      it('should return valid when within min and max range', () => {
        const result = validateSelection('multiSelect', null, [0, 1], false, 1, 3);
        expect(result).toEqual({ isValid: true, message: null });
      });
      
      it('should return invalid for minSelections first (priority)', () => {
        // When both min and max are violated, min should be checked first
        const result = validateSelection('multiSelect', null, [], false, 2, 3);
        expect(result).toEqual({ 
          isValid: false, 
          message: 'Please select at least 2 options' 
        });
      });
      
      it('should return invalid for maxSelections when min is met', () => {
        const result = validateSelection('multiSelect', null, [0, 1, 2, 3, 4], false, 2, 3);
        expect(result).toEqual({ 
          isValid: false, 
          message: 'Please select no more than 3 options' 
        });
      });
    });
    
    describe('required flag in multiSelect mode', () => {
      it('should ignore required flag in multiSelect mode', () => {
        // required is only for select mode, multiSelect uses minSelections
        const result = validateSelection('multiSelect', null, [], true);
        expect(result).toEqual({ isValid: true, message: null });
      });
    });
  });
});

describe('canSelectItem', () => {
  // ─────────────────────────────────────────────────────────────────
  // Basic Selection Tests
  // ─────────────────────────────────────────────────────────────────
  
  describe('Basic Selection', () => {
    it('should allow selection when no maxSelections set', () => {
      const result = canSelectItem(0, []);
      expect(result).toBe(true);
    });
    
    it('should allow selection when under maxSelections', () => {
      const result = canSelectItem(2, [0, 1], 3);
      expect(result).toBe(true);
    });
    
    it('should allow selection when maxSelections is undefined', () => {
      const result = canSelectItem(5, [0, 1, 2, 3, 4], undefined);
      expect(result).toBe(true);
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // Max Selection Enforcement (Requirement 7.5)
  // ─────────────────────────────────────────────────────────────────
  
  describe('Max Selection Enforcement', () => {
    it('should prevent selection when at maxSelections', () => {
      const result = canSelectItem(3, [0, 1, 2], 3);
      expect(result).toBe(false);
    });
    
    it('should prevent selection when over maxSelections', () => {
      // Edge case: somehow over max (shouldn't happen, but handle gracefully)
      const result = canSelectItem(4, [0, 1, 2, 3], 3);
      expect(result).toBe(false);
    });
    
    it('should allow deselection when at maxSelections', () => {
      // Can always deselect an already selected item
      const result = canSelectItem(1, [0, 1, 2], 3);
      expect(result).toBe(true);
    });
    
    it('should allow deselection when over maxSelections', () => {
      // Can always deselect to get back under max
      const result = canSelectItem(0, [0, 1, 2, 3], 3);
      expect(result).toBe(true);
    });
  });
  
  // ─────────────────────────────────────────────────────────────────
  // Edge Cases
  // ─────────────────────────────────────────────────────────────────
  
  describe('Edge Cases', () => {
    it('should handle maxSelections of 1', () => {
      // At max of 1, can't select new item
      const result = canSelectItem(1, [0], 1);
      expect(result).toBe(false);
    });
    
    it('should allow first selection with maxSelections of 1', () => {
      const result = canSelectItem(0, [], 1);
      expect(result).toBe(true);
    });
    
    it('should handle maxSelections of 0', () => {
      // Edge case: max of 0 means no selections allowed
      const result = canSelectItem(0, [], 0);
      expect(result).toBe(false);
    });
    
    it('should handle empty selectedIndices array', () => {
      const result = canSelectItem(0, [], 3);
      expect(result).toBe(true);
    });
    
    it('should handle large maxSelections', () => {
      const result = canSelectItem(100, Array.from({ length: 99 }, (_, i) => i), 100);
      expect(result).toBe(true);
    });
  });
});
