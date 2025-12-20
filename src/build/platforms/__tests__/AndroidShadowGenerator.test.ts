/**
 * @category evergreen
 * @purpose Verify build generators produce correct file formats for target platforms
 */
/**
 * Android Shadow Generator Tests
 * 
 * Tests for Android Kotlin shadow translation
 */

import { AndroidShadowGenerator } from '../AndroidShadowGenerator';

describe('AndroidShadowGenerator', () => {
  let generator: AndroidShadowGenerator;
  
  beforeEach(() => {
    generator = new AndroidShadowGenerator();
  });
  
  describe('generateShadowKotlinValue', () => {
    it('should generate elevation for shadow.container', () => {
      const result = generator.generateShadowKotlinValue('shadow.container');
      
      expect(result).not.toBeNull();
      expect(result?.elevation).toBe('12dp');
      expect(result?.strategy).toBe('blur-based');
      expect(result?.properties.offsetX).toBe(0);
      expect(result?.properties.offsetY).toBe(4);
      expect(result?.properties.blur).toBe(12);
      expect(result?.properties.opacity).toBe(0.3);
    });
    
    it('should generate elevation for shadow.modal', () => {
      const result = generator.generateShadowKotlinValue('shadow.modal');
      
      expect(result).not.toBeNull();
      expect(result?.elevation).toBe('16dp');
      expect(result?.strategy).toBe('blur-based');
      expect(result?.properties.offsetX).toBe(0);
      expect(result?.properties.offsetY).toBe(8);
      expect(result?.properties.blur).toBe(16);
    });
    
    it('should generate elevation for shadow.hover', () => {
      const result = generator.generateShadowKotlinValue('shadow.hover');
      
      expect(result).not.toBeNull();
      expect(result?.elevation).toBe('20dp');
      expect(result?.strategy).toBe('blur-based');
      expect(result?.properties.offsetX).toBe(0);
      expect(result?.properties.offsetY).toBe(4);
      expect(result?.properties.blur).toBe(20);
    });
    
    it('should generate elevation for shadow.fab with directional offset', () => {
      const result = generator.generateShadowKotlinValue('shadow.fab');
      
      expect(result).not.toBeNull();
      expect(result?.elevation).toBeDefined();
      expect(result?.properties.offsetX).toBe(12);
      expect(result?.properties.offsetY).toBe(16);
      expect(result?.properties.blur).toBe(4);
    });
    
    it('should document directional shadow limitations', () => {
      const result = generator.generateShadowKotlinValue('shadow.fab');
      
      expect(result).not.toBeNull();
      expect(result?.limitations.some(l => l.includes('Directional shadow'))).toBe(true);
      expect(result?.limitations.some(l => l.includes('offsetX: 12dp'))).toBe(true);
    });
    
    it('should document custom opacity limitations', () => {
      const result = generator.generateShadowKotlinValue('shadow.fab');
      
      expect(result).not.toBeNull();
      expect(result?.limitations.some(l => l.includes('Custom opacity'))).toBe(true);
    });
    
    it('should always document spread limitation', () => {
      const result = generator.generateShadowKotlinValue('shadow.container');
      
      expect(result).not.toBeNull();
      expect(result?.limitations.some(l => l.includes('Shadow spread not supported'))).toBe(true);
    });
    
    it('should return null for non-existent shadow token', () => {
      const result = generator.generateShadowKotlinValue('shadow.nonexistent');
      
      expect(result).toBeNull();
    });
    
    it('should use blur-based strategy for shadows with small offsets', () => {
      const result = generator.generateShadowKotlinValue('shadow.container');
      
      expect(result).not.toBeNull();
      expect(result?.strategy).toBe('blur-based');
      expect(result?.elevation).toBe('12dp'); // Uses blur value
    });
    
    it('should use offset-based strategy for shadows with large offsets', () => {
      const result = generator.generateShadowKotlinValue('shadow.fab');
      
      expect(result).not.toBeNull();
      // FAB has offsetY: 16, blur: 4, so offsetY > blur * 1.5
      expect(result?.strategy).toBe('offset-based');
      expect(result?.elevation).toBe('16dp'); // Uses offsetY value
    });
  });
  
  describe('generateKotlinCode', () => {
    it('should generate complete Kotlin code with package declaration', () => {
      const code = generator.generateKotlinCode();
      
      expect(code).toContain('package com.designerpunk.tokens');
      expect(code).toContain('import androidx.compose.ui.unit.dp');
    });
    
    it('should generate ShadowToken data class', () => {
      const code = generator.generateKotlinCode();
      
      expect(code).toContain('data class ShadowToken(');
      expect(code).toContain('val elevation: androidx.compose.ui.unit.Dp');
      expect(code).toContain('val strategy: String');
      expect(code).toContain('val limitations: List<String>');
    });
    
    it('should generate ShadowTokens object with all shadow tokens', () => {
      const code = generator.generateKotlinCode();
      
      expect(code).toContain('object ShadowTokens {');
      expect(code).toContain('val container = ShadowToken(');
      expect(code).toContain('val modal = ShadowToken(');
      expect(code).toContain('val hover = ShadowToken(');
      expect(code).toContain('val fab = ShadowToken(');
    });
    
    it('should include elevation values in dp', () => {
      const code = generator.generateKotlinCode();
      
      expect(code).toContain('elevation = 12.dp'); // container
      expect(code).toContain('elevation = 16.dp'); // modal
      expect(code).toContain('elevation = 20.dp'); // hover
    });
    
    it('should include approximation strategy in comments', () => {
      const code = generator.generateKotlinCode();
      
      expect(code).toContain('Approximation Strategy: blur-based');
      expect(code).toContain('Approximation Strategy: offset-based');
    });
    
    it('should include original shadow properties in comments', () => {
      const code = generator.generateKotlinCode();
      
      expect(code).toContain('Original Properties:');
      expect(code).toContain('offsetX:');
      expect(code).toContain('offsetY:');
      expect(code).toContain('blur:');
      expect(code).toContain('opacity:');
    });
    
    it('should include limitations in comments and data', () => {
      const code = generator.generateKotlinCode();
      
      expect(code).toContain('Limitations:');
      expect(code).toContain('limitations = listOf(');
      expect(code).toContain('Shadow spread not supported');
    });
    
    it('should generate Modifier extension function', () => {
      const code = generator.generateKotlinCode();
      
      expect(code).toContain('fun androidx.compose.ui.Modifier.shadow(shadow: ShadowToken)');
      expect(code).toContain('return this.shadow(elevation = shadow.elevation)');
    });
    
    it('should include Android limitations documentation', () => {
      const code = generator.generateKotlinCode();
      
      expect(code).toContain('Android Limitations:');
      expect(code).toContain('Elevation is an approximation');
      expect(code).toContain('Shadow direction is fixed');
      expect(code).toContain('Shadow color is system-controlled');
      expect(code).toContain('Directional shadows (offsetX) not supported');
      expect(code).toContain('Custom opacity not supported');
    });
    
    it('should note custom drawable requirement for precise control', () => {
      const code = generator.generateKotlinCode();
      
      expect(code).toContain('For precise shadow control, custom drawable generation would be required');
    });
  });
});
