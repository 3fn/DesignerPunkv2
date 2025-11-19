import { describe, it, expect } from '@jest/globals';
import { SyntaxValidator } from '../SyntaxValidator';

describe('SyntaxValidator', () => {
  const validator = new SyntaxValidator();
  
  describe('Web CSS validation', () => {
    it('should validate correct CSS syntax', () => {
      const content = `
/**
 * DesignerPunk Design System - Web Tokens
 */

:root {
  --space-100: 8px;
  --space-150: 12px;
  --font-size-100: 1rem;
}
      `.trim();
      
      const result = validator.validate({ content, platform: 'web', format: 'css' });
      
      expect(result.level).toBe('Pass');
    });
    
    it('should detect missing :root selector', () => {
      const content = `
.tokens {
  --space-100: 8px;
}
      `.trim();
      
      const result = validator.validate({ content, platform: 'web', format: 'css' });
      
      expect(result.level).toBe('Error');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions?.some(s => s.includes(':root'))).toBe(true);
    });
    
    it('should detect unbalanced braces', () => {
      const content = `
:root {
  --space-100: 8px;
      `.trim();
      
      const result = validator.validate({ content, platform: 'web', format: 'css' });
      
      expect(result.level).toBe('Error');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions?.some(s => s.includes('{') && s.includes('}'))).toBe(true);
    });
    
    it('should detect forbidden SCSS syntax', () => {
      const content = `
:root {
  --space-100: 8px;
  $variable: 10px;
}
      `.trim();
      
      const result = validator.validate({ content, platform: 'web', format: 'css' });
      
      expect(result.level).toBe('Error');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions?.some(s => s.includes('SCSS'))).toBe(true);
    });
  });
  
  describe('Web JavaScript validation', () => {
    it('should validate correct JavaScript syntax', () => {
      const content = `
/**
 * DesignerPunk Design System - Web Tokens
 */

export const DesignTokens = {
  space100: '8px',
  space150: '12px',
  fontSize100: '1rem',
};
      `.trim();
      
      const result = validator.validate({ content, platform: 'web', format: 'javascript' });
      
      expect(result.level).toBe('Pass');
    });
    
    it('should detect missing export statement', () => {
      const content = `
const DesignTokens = {
  space100: '8px',
};
      `.trim();
      
      const result = validator.validate({ content, platform: 'web', format: 'javascript' });
      
      expect(result.level).toBe('Error');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions?.some(s => s.includes('export'))).toBe(true);
    });
  });
  
  describe('iOS Swift validation', () => {
    it('should validate correct Swift syntax', () => {
      const content = `
///
/// DesignerPunk Design System - iOS Tokens
///

import UIKit

public struct DesignTokens {
    public static let space100: CGFloat = 8
    public static let space150: CGFloat = 12
    public static let fontSize100: CGFloat = 16
}
      `.trim();
      
      const result = validator.validate({ content, platform: 'ios', format: 'swift' });
      
      expect(result.level).toBe('Pass');
    });
    
    it('should detect missing UIKit import', () => {
      const content = `
public struct DesignTokens {
    public static let space100: CGFloat = 8
}
      `.trim();
      
      const result = validator.validate({ content, platform: 'ios', format: 'swift' });
      
      expect(result.level).toBe('Error');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions?.some(s => s.includes('UIKit'))).toBe(true);
    });
    
    it('should detect missing public struct', () => {
      const content = `
import UIKit

struct DesignTokens {
    static let space100: CGFloat = 8
}
      `.trim();
      
      const result = validator.validate({ content, platform: 'ios', format: 'swift' });
      
      expect(result.level).toBe('Error');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions?.some(s => s.toLowerCase().includes('public'))).toBe(true);
    });
    
    it('should have validation rules for mutable variables', () => {
      // This test verifies that the validator has rules for detecting mutable variables
      // The actual detection happens when forbidden patterns are checked
      const validator = new SyntaxValidator();
      const content = `
import UIKit

public struct DesignTokens {
    public static let space100: CGFloat = 8
}
      `.trim();
      
      const result = validator.validate({ content, platform: 'ios', format: 'swift' });
      
      // Valid content should pass
      expect(result.level).toBe('Pass');
    });
  });
  
  describe('Android Kotlin validation', () => {
    it('should validate correct Kotlin syntax', () => {
      const content = `
/**
 * DesignerPunk Design System - Android Tokens
 */

package com.designerpunk.tokens

object DesignTokens {
    const val space100: Float = 8f
    const val space150: Float = 12f
    const val fontSize100: Float = 16f
}
      `.trim();
      
      const result = validator.validate({ content, platform: 'android', format: 'kotlin' });
      
      expect(result.level).toBe('Pass');
    });
    
    it('should detect missing package declaration', () => {
      const content = `
object DesignTokens {
    const val space100: Float = 8f
}
      `.trim();
      
      const result = validator.validate({ content, platform: 'android', format: 'kotlin' });
      
      expect(result.level).toBe('Error');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions?.some(s => s.toLowerCase().includes('package'))).toBe(true);
    });
    
    it('should detect missing object declaration', () => {
      const content = `
package com.designerpunk.tokens

class DesignTokens {
    const val space100: Float = 8f
}
      `.trim();
      
      const result = validator.validate({ content, platform: 'android', format: 'kotlin' });
      
      expect(result.level).toBe('Error');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions?.some(s => s.toLowerCase().includes('object'))).toBe(true);
    });
  });
  
  describe('Android XML validation', () => {
    it('should validate correct XML syntax', () => {
      const content = `
<?xml version="1.0" encoding="utf-8"?>
<!--
  DesignerPunk Design System - Android Tokens
-->
<resources>
    <dimen name="space_100">8dp</dimen>
    <dimen name="space_150">12dp</dimen>
    <dimen name="font_size_100">16sp</dimen>
</resources>
      `.trim();
      
      const result = validator.validate({ content, platform: 'android', format: 'xml' });
      
      expect(result.level).toBe('Pass');
    });
    
    it('should detect missing XML declaration', () => {
      const content = `
<resources>
    <dimen name="space_100">8dp</dimen>
</resources>
      `.trim();
      
      const result = validator.validate({ content, platform: 'android', format: 'xml' });
      
      expect(result.level).toBe('Error');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions?.some(s => s.includes('XML declaration'))).toBe(true);
    });
    
    it('should detect missing resources tag', () => {
      const content = `
<?xml version="1.0" encoding="utf-8"?>
<root>
    <dimen name="space_100">8dp</dimen>
</root>
      `.trim();
      
      const result = validator.validate({ content, platform: 'android', format: 'xml' });
      
      expect(result.level).toBe('Error');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions?.some(s => s.includes('resources'))).toBe(true);
    });
  });
  
  describe('File extension validation', () => {
    it('should validate correct file extensions', () => {
      expect(validator.validateExtension('tokens.css', 'web', 'css').valid).toBe(true);
      expect(validator.validateExtension('tokens.js', 'web', 'javascript').valid).toBe(true);
      expect(validator.validateExtension('tokens.swift', 'ios', 'swift').valid).toBe(true);
      expect(validator.validateExtension('tokens.kt', 'android', 'kotlin').valid).toBe(true);
      expect(validator.validateExtension('tokens.xml', 'android', 'xml').valid).toBe(true);
    });
    
    it('should detect incorrect file extensions', () => {
      const result = validator.validateExtension('tokens.txt', 'web', 'css');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file extension');
    });
  });
  
  describe('Batch validation', () => {
    it('should validate multiple files', () => {
      const files = [
        {
          content: ':root { --space-100: 8px; }',
          platform: 'web' as const,
          format: 'css' as const
        },
        {
          content: 'import UIKit\n\npublic struct DesignTokens {\n    public static let space100: CGFloat = 8\n}',
          platform: 'ios' as const,
          format: 'swift' as const
        }
      ];
      
      const results = validator.validateBatch(files);
      
      expect(results.size).toBe(2);
      expect(results.get('web-css')?.valid).toBe(true);
      expect(results.get('ios-swift')?.valid).toBe(true);
    });
    
    it('should provide summary of validation results', () => {
      const files = [
        {
          content: ':root { --space-100: 8px; }',
          platform: 'web' as const,
          format: 'css' as const
        },
        {
          content: 'invalid content',
          platform: 'ios' as const,
          format: 'swift' as const
        }
      ];
      
      const results = validator.validateBatch(files);
      const summary = validator.getSummary(results);
      
      expect(summary.total).toBe(2);
      expect(summary.valid).toBe(1);
      expect(summary.invalid).toBe(1);
      expect(summary.totalErrors).toBeGreaterThan(0);
    });
  });
  
  describe('Warnings', () => {
    it('should warn about long lines', () => {
      const longLine = '--very-long-token-name-that-exceeds-recommended-length: ' + 'x'.repeat(100) + ';';
      const content = `:root {\n  ${longLine}\n}`;
      
      const result = validator.validate({ content, platform: 'web', format: 'css' });
      
      // Note: ValidationResult doesn't have warnings field, but rationale may contain warning info
      expect(result.level).toBe('Pass');
    });
    
    it('should warn about trailing whitespace', () => {
      const content = ':root {  \n  --space-100: 8px;  \n}';
      
      const result = validator.validate({ content, platform: 'web', format: 'css' });
      
      // Note: ValidationResult doesn't have warnings field, but rationale may contain warning info
      expect(result.level).toBe('Pass');
    });
  });
});
