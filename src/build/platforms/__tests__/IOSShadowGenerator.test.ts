/**
 * IOSShadowGenerator Tests
 * 
 * Tests for iOS Swift shadow translation functionality
 */

import { IOSShadowGenerator } from '../IOSShadowGenerator';

describe('IOSShadowGenerator', () => {
  let generator: IOSShadowGenerator;
  
  beforeEach(() => {
    generator = new IOSShadowGenerator();
  });
  
  describe('generateShadowSwiftValue', () => {
    it('should generate Swift shadow properties for shadow.container', () => {
      const swiftValue = generator.generateShadowSwiftValue('shadow.container');
      
      expect(swiftValue).toBeTruthy();
      expect(swiftValue?.shadowOffset).toContain('CGSize');
      expect(swiftValue?.shadowRadius).toBeTruthy();
      expect(swiftValue?.shadowOpacity).toBeTruthy();
      expect(swiftValue?.shadowColor).toContain('UIColor');
    });
    
    it('should generate Swift shadow properties for shadow.modal', () => {
      const swiftValue = generator.generateShadowSwiftValue('shadow.modal');
      
      expect(swiftValue).toBeTruthy();
      expect(swiftValue?.shadowOffset).toContain('CGSize');
      expect(swiftValue?.shadowRadius).toBeTruthy();
      expect(swiftValue?.shadowOpacity).toBeTruthy();
      expect(swiftValue?.shadowColor).toContain('UIColor');
    });
    
    it('should generate Swift shadow properties for shadow.fab', () => {
      const swiftValue = generator.generateShadowSwiftValue('shadow.fab');
      
      expect(swiftValue).toBeTruthy();
      expect(swiftValue?.shadowOffset).toContain('CGSize');
      expect(swiftValue?.shadowRadius).toBeTruthy();
      expect(swiftValue?.shadowOpacity).toBeTruthy();
      expect(swiftValue?.shadowColor).toContain('UIColor');
    });
    
    it('should return null for non-existent shadow token', () => {
      const swiftValue = generator.generateShadowSwiftValue('shadow.nonexistent');
      
      expect(swiftValue).toBeNull();
    });
    
    it('should generate correct offset values for shadow.sunrise', () => {
      const swiftValue = generator.generateShadowSwiftValue('shadow.sunrise');
      
      expect(swiftValue).toBeTruthy();
      // Sunrise should have negative offsetX (shadow falls left)
      expect(swiftValue?.properties.offsetX).toBeLessThan(0);
    });
    
    it('should generate correct offset values for shadow.sunset', () => {
      const swiftValue = generator.generateShadowSwiftValue('shadow.sunset');
      
      expect(swiftValue).toBeTruthy();
      // Sunset should have positive offsetX (shadow falls right)
      expect(swiftValue?.properties.offsetX).toBeGreaterThan(0);
    });
    
    it('should include all shadow properties', () => {
      const swiftValue = generator.generateShadowSwiftValue('shadow.container');
      
      expect(swiftValue?.properties).toBeTruthy();
      expect(swiftValue?.properties.offsetX).toBeDefined();
      expect(swiftValue?.properties.offsetY).toBeDefined();
      expect(swiftValue?.properties.blur).toBeDefined();
      expect(swiftValue?.properties.opacity).toBeDefined();
      expect(swiftValue?.properties.color).toBeDefined();
    });
  });
  
  describe('generateSwiftExtension', () => {
    it('should generate Swift extension code for all shadow tokens', () => {
      const swift = generator.generateSwiftExtension();
      
      expect(swift).toBeTruthy();
      expect(swift).toContain('import UIKit');
      expect(swift).toContain('extension CALayer');
      expect(swift).toContain('struct ShadowToken');
      expect(swift).toContain('enum ShadowTokens');
    });
    
    it('should include shadow token definitions', () => {
      const swift = generator.generateSwiftExtension();
      
      expect(swift).toContain('static let container');
      expect(swift).toContain('static let modal');
      expect(swift).toContain('static let fab');
      expect(swift).toContain('static let hover');
    });
    
    it('should include directional shadow tokens', () => {
      const swift = generator.generateSwiftExtension();
      
      expect(swift).toContain('static let sunrise');
      expect(swift).toContain('static let morning');
      expect(swift).toContain('static let afternoon');
      expect(swift).toContain('static let sunset');
    });
    
    it('should include documentation about spread not being supported', () => {
      const swift = generator.generateSwiftExtension();
      
      expect(swift).toContain('iOS does not support shadow spread');
    });
    
    it('should include applyShadow helper method', () => {
      const swift = generator.generateSwiftExtension();
      
      expect(swift).toContain('func applyShadow');
      expect(swift).toContain('self.shadowOffset');
      expect(swift).toContain('self.shadowRadius');
      expect(swift).toContain('self.shadowOpacity');
      expect(swift).toContain('self.shadowColor');
    });
  });
  
  describe('iOS-specific shadow properties', () => {
    it('should generate CGSize for shadowOffset', () => {
      const swiftValue = generator.generateShadowSwiftValue('shadow.container');
      
      expect(swiftValue?.shadowOffset).toMatch(/CGSize\(width: -?\d+, height: -?\d+\)/);
    });
    
    it('should generate numeric shadowRadius', () => {
      const swiftValue = generator.generateShadowSwiftValue('shadow.container');
      
      expect(swiftValue?.shadowRadius).toMatch(/^\d+(\.\d+)?$/);
    });
    
    it('should generate numeric shadowOpacity', () => {
      const swiftValue = generator.generateShadowSwiftValue('shadow.container');
      
      expect(swiftValue?.shadowOpacity).toMatch(/^0\.\d+$/);
    });
    
    it('should generate UIColor for shadowColor', () => {
      const swiftValue = generator.generateShadowSwiftValue('shadow.container');
      
      expect(swiftValue?.shadowColor).toMatch(/UIColor\(/);
    });
  });
});
