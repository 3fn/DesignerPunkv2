import { describe, it, expect } from '@jest/globals';
import { NamingConventionManager } from '../NamingConventionManager';
import {
  convertToNamingConvention,
  validateTokenName,
  getPlatformTokenName,
  followsNamingConvention
} from '../PlatformNamingRules';
import { TokenCategory } from '../../types';

describe('NamingConventionManager', () => {
  describe('Platform-specific naming', () => {
    it('should convert token names to web kebab-case with prefix', () => {
      const manager = new NamingConventionManager();
      const result = manager.getTokenName('space100', 'web', 'spacing' as TokenCategory);
      
      expect(result).toBe('--space-100');
    });
    
    it('should convert token names to iOS camelCase', () => {
      const manager = new NamingConventionManager();
      const result = manager.getTokenName('space100', 'ios', 'spacing' as TokenCategory);
      
      expect(result).toBe('space100');
    });
    
    it('should convert token names to Android snake_case', () => {
      const manager = new NamingConventionManager();
      const result = manager.getTokenName('space100', 'android', 'spacing' as TokenCategory);
      
      expect(result).toBe('space_100');
    });
    
    it('should handle complex token names correctly', () => {
      const manager = new NamingConventionManager();
      
      expect(manager.getTokenName('fontSize125', 'web')).toBe('--font-size-125');
      expect(manager.getTokenName('fontSize125', 'ios')).toBe('fontSize125');
      expect(manager.getTokenName('fontSize125', 'android')).toBe('font_size_125');
    });
  });
  
  describe('Cross-platform validation', () => {
    it('should validate token names across all platforms', () => {
      const manager = new NamingConventionManager();
      const result = manager.validateCrossPlatform('space100', 'spacing' as TokenCategory);
      
      expect(result.tokenName).toBe('space100');
      expect(result.platformNames.web).toBe('--space-100');
      expect(result.platformNames.ios).toBe('space100');
      expect(result.platformNames.android).toBe('space_100');
      expect(result.consistent).toBe(true);
      expect(result.semanticMeaningPreserved).toBe(true);
    });
    
    it('should detect semantic meaning preservation', () => {
      const manager = new NamingConventionManager();
      const result = manager.validateCrossPlatform('primaryColor', 'color' as TokenCategory);
      
      expect(result.semanticMeaningPreserved).toBe(true);
      expect(result.platformNames.web).toBe('--primary-color');
      expect(result.platformNames.ios).toBe('primaryColor');
      expect(result.platformNames.android).toBe('primary_color');
    });
  });
  
  describe('Batch validation', () => {
    it('should validate multiple token names', () => {
      const manager = new NamingConventionManager();
      const tokenNames = ['space100', 'space150', 'fontSize100', 'radius050'];
      
      const results = manager.validateBatch(tokenNames, 'spacing' as TokenCategory);
      
      expect(results.size).toBe(4);
      
      for (const result of results.values()) {
        expect(result.consistent).toBe(true);
        expect(result.semanticMeaningPreserved).toBe(true);
      }
    });
    
    it('should provide summary of validation results', () => {
      const manager = new NamingConventionManager();
      const tokenNames = ['space100', 'space150', 'fontSize100'];
      
      const results = manager.validateBatch(tokenNames);
      const summary = manager.getSummary(results);
      
      expect(summary.total).toBe(3);
      expect(summary.valid).toBe(3);
      expect(summary.invalid).toBe(0);
    });
  });
});

describe('Naming convention conversion', () => {
  describe('camelCase conversion', () => {
    it('should convert to camelCase', () => {
      expect(convertToNamingConvention('space-100', 'camelCase')).toBe('space100');
      expect(convertToNamingConvention('font_size_125', 'camelCase')).toBe('fontSize125');
      expect(convertToNamingConvention('PrimaryColor', 'camelCase')).toBe('primaryColor');
    });
  });
  
  describe('PascalCase conversion', () => {
    it('should convert to PascalCase', () => {
      expect(convertToNamingConvention('space-100', 'PascalCase')).toBe('Space100');
      expect(convertToNamingConvention('font_size_125', 'PascalCase')).toBe('FontSize125');
      expect(convertToNamingConvention('primaryColor', 'PascalCase')).toBe('PrimaryColor');
    });
  });
  
  describe('kebab-case conversion', () => {
    it('should convert to kebab-case', () => {
      expect(convertToNamingConvention('space100', 'kebab-case')).toBe('space-100');
      expect(convertToNamingConvention('fontSize125', 'kebab-case')).toBe('font-size-125');
      expect(convertToNamingConvention('PrimaryColor', 'kebab-case')).toBe('primary-color');
    });
  });
  
  describe('snake_case conversion', () => {
    it('should convert to snake_case', () => {
      expect(convertToNamingConvention('space100', 'snake_case')).toBe('space_100');
      expect(convertToNamingConvention('fontSize125', 'snake_case')).toBe('font_size_125');
      expect(convertToNamingConvention('PrimaryColor', 'snake_case')).toBe('primary_color');
    });
  });
  
  describe('SCREAMING_SNAKE_CASE conversion', () => {
    it('should convert to SCREAMING_SNAKE_CASE', () => {
      expect(convertToNamingConvention('space100', 'SCREAMING_SNAKE_CASE')).toBe('SPACE_100');
      expect(convertToNamingConvention('fontSize125', 'SCREAMING_SNAKE_CASE')).toBe('FONT_SIZE_125');
      expect(convertToNamingConvention('PrimaryColor', 'SCREAMING_SNAKE_CASE')).toBe('PRIMARY_COLOR');
    });
  });
});

describe('Naming convention validation', () => {
  describe('followsNamingConvention', () => {
    it('should validate camelCase', () => {
      expect(followsNamingConvention('space100', 'camelCase')).toBe(true);
      expect(followsNamingConvention('fontSize125', 'camelCase')).toBe(true);
      expect(followsNamingConvention('Space100', 'camelCase')).toBe(false);
      expect(followsNamingConvention('space-100', 'camelCase')).toBe(false);
    });
    
    it('should validate PascalCase', () => {
      expect(followsNamingConvention('Space100', 'PascalCase')).toBe(true);
      expect(followsNamingConvention('FontSize125', 'PascalCase')).toBe(true);
      expect(followsNamingConvention('space100', 'PascalCase')).toBe(false);
      expect(followsNamingConvention('space-100', 'PascalCase')).toBe(false);
    });
    
    it('should validate kebab-case', () => {
      expect(followsNamingConvention('space-100', 'kebab-case')).toBe(true);
      expect(followsNamingConvention('font-size-125', 'kebab-case')).toBe(true);
      expect(followsNamingConvention('space100', 'kebab-case')).toBe(true); // No hyphens but still lowercase
      expect(followsNamingConvention('Space-100', 'kebab-case')).toBe(false);
    });
    
    it('should validate snake_case', () => {
      expect(followsNamingConvention('space_100', 'snake_case')).toBe(true);
      expect(followsNamingConvention('font_size_125', 'snake_case')).toBe(true);
      expect(followsNamingConvention('space100', 'snake_case')).toBe(true); // No underscores but still lowercase
      expect(followsNamingConvention('Space_100', 'snake_case')).toBe(false);
    });
    
    it('should validate SCREAMING_SNAKE_CASE', () => {
      expect(followsNamingConvention('SPACE_100', 'SCREAMING_SNAKE_CASE')).toBe(true);
      expect(followsNamingConvention('FONT_SIZE_125', 'SCREAMING_SNAKE_CASE')).toBe(true);
      expect(followsNamingConvention('space_100', 'SCREAMING_SNAKE_CASE')).toBe(false);
    });
  });
});

describe('Platform token name generation', () => {
  it('should generate web token names with CSS prefix', () => {
    expect(getPlatformTokenName('space100', 'web')).toBe('--space-100');
    expect(getPlatformTokenName('fontSize125', 'web')).toBe('--font-size-125');
  });
  
  it('should generate iOS token names in camelCase', () => {
    expect(getPlatformTokenName('space100', 'ios')).toBe('space100');
    expect(getPlatformTokenName('fontSize125', 'ios')).toBe('fontSize125');
  });
  
  it('should generate Android token names in snake_case', () => {
    expect(getPlatformTokenName('space100', 'android')).toBe('space_100');
    expect(getPlatformTokenName('fontSize125', 'android')).toBe('font_size_125');
  });
});

describe('Reserved keyword validation', () => {
  it('should detect reserved keywords for web', () => {
    const result = validateTokenName('initial', 'web');
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0]).toContain('reserved keyword');
  });
  
  it('should detect reserved keywords for iOS', () => {
    const result = validateTokenName('class', 'ios');
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0]).toContain('reserved keyword');
  });
  
  it('should detect reserved keywords for Android', () => {
    const result = validateTokenName('class', 'android');
    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.[0]).toContain('reserved keyword');
  });
  
  it('should allow non-reserved keywords', () => {
    expect(validateTokenName('space100', 'web').valid).toBe(true);
    expect(validateTokenName('fontSize125', 'ios').valid).toBe(true);
    expect(validateTokenName('radius050', 'android').valid).toBe(true);
  });
});
