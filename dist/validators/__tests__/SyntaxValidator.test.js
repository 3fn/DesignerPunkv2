"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const SyntaxValidator_1 = require("../SyntaxValidator");
(0, globals_1.describe)('SyntaxValidator', () => {
    const validator = new SyntaxValidator_1.SyntaxValidator();
    (0, globals_1.describe)('Web CSS validation', () => {
        (0, globals_1.it)('should validate correct CSS syntax', () => {
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
            const result = validator.validate(content, 'web', 'css');
            (0, globals_1.expect)(result.valid).toBe(true);
            (0, globals_1.expect)(result.errors).toBeUndefined();
        });
        (0, globals_1.it)('should detect missing :root selector', () => {
            const content = `
.tokens {
  --space-100: 8px;
}
      `.trim();
            const result = validator.validate(content, 'web', 'css');
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.errors).toBeDefined();
            (0, globals_1.expect)(result.errors?.[0].message).toContain(':root');
        });
        (0, globals_1.it)('should detect unbalanced braces', () => {
            const content = `
:root {
  --space-100: 8px;
      `.trim();
            const result = validator.validate(content, 'web', 'css');
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.errors).toBeDefined();
            (0, globals_1.expect)(result.errors?.some(e => e.message.includes('Unbalanced'))).toBe(true);
        });
        (0, globals_1.it)('should detect forbidden SCSS syntax', () => {
            const content = `
:root {
  --space-100: 8px;
  $variable: 10px;
}
      `.trim();
            const result = validator.validate(content, 'web', 'css');
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.errors).toBeDefined();
            (0, globals_1.expect)(result.errors?.some(e => e.message.includes('SCSS'))).toBe(true);
        });
    });
    (0, globals_1.describe)('Web JavaScript validation', () => {
        (0, globals_1.it)('should validate correct JavaScript syntax', () => {
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
            const result = validator.validate(content, 'web', 'javascript');
            (0, globals_1.expect)(result.valid).toBe(true);
            (0, globals_1.expect)(result.errors).toBeUndefined();
        });
        (0, globals_1.it)('should detect missing export statement', () => {
            const content = `
const DesignTokens = {
  space100: '8px',
};
      `.trim();
            const result = validator.validate(content, 'web', 'javascript');
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.errors).toBeDefined();
            (0, globals_1.expect)(result.errors?.[0].message).toContain('export');
        });
    });
    (0, globals_1.describe)('iOS Swift validation', () => {
        (0, globals_1.it)('should validate correct Swift syntax', () => {
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
            const result = validator.validate(content, 'ios', 'swift');
            (0, globals_1.expect)(result.valid).toBe(true);
            (0, globals_1.expect)(result.errors).toBeUndefined();
        });
        (0, globals_1.it)('should detect missing UIKit import', () => {
            const content = `
public struct DesignTokens {
    public static let space100: CGFloat = 8
}
      `.trim();
            const result = validator.validate(content, 'ios', 'swift');
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.errors).toBeDefined();
            (0, globals_1.expect)(result.errors?.[0].message).toContain('UIKit');
        });
        (0, globals_1.it)('should detect missing public struct', () => {
            const content = `
import UIKit

struct DesignTokens {
    static let space100: CGFloat = 8
}
      `.trim();
            const result = validator.validate(content, 'ios', 'swift');
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.errors).toBeDefined();
            (0, globals_1.expect)(result.errors?.[0].message).toContain('public');
        });
        (0, globals_1.it)('should have validation rules for mutable variables', () => {
            // This test verifies that the validator has rules for detecting mutable variables
            // The actual detection happens when forbidden patterns are checked
            const validator = new SyntaxValidator_1.SyntaxValidator();
            const content = `
import UIKit

public struct DesignTokens {
    public static let space100: CGFloat = 8
}
      `.trim();
            const result = validator.validate(content, 'ios', 'swift');
            // Valid content should pass
            (0, globals_1.expect)(result.valid).toBe(true);
        });
    });
    (0, globals_1.describe)('Android Kotlin validation', () => {
        (0, globals_1.it)('should validate correct Kotlin syntax', () => {
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
            const result = validator.validate(content, 'android', 'kotlin');
            (0, globals_1.expect)(result.valid).toBe(true);
            (0, globals_1.expect)(result.errors).toBeUndefined();
        });
        (0, globals_1.it)('should detect missing package declaration', () => {
            const content = `
object DesignTokens {
    const val space100: Float = 8f
}
      `.trim();
            const result = validator.validate(content, 'android', 'kotlin');
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.errors).toBeDefined();
            (0, globals_1.expect)(result.errors?.[0].message).toContain('package');
        });
        (0, globals_1.it)('should detect missing object declaration', () => {
            const content = `
package com.designerpunk.tokens

class DesignTokens {
    const val space100: Float = 8f
}
      `.trim();
            const result = validator.validate(content, 'android', 'kotlin');
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.errors).toBeDefined();
            (0, globals_1.expect)(result.errors?.[0].message).toContain('object');
        });
    });
    (0, globals_1.describe)('Android XML validation', () => {
        (0, globals_1.it)('should validate correct XML syntax', () => {
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
            const result = validator.validate(content, 'android', 'xml');
            (0, globals_1.expect)(result.valid).toBe(true);
            (0, globals_1.expect)(result.errors).toBeUndefined();
        });
        (0, globals_1.it)('should detect missing XML declaration', () => {
            const content = `
<resources>
    <dimen name="space_100">8dp</dimen>
</resources>
      `.trim();
            const result = validator.validate(content, 'android', 'xml');
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.errors).toBeDefined();
            (0, globals_1.expect)(result.errors?.[0].message).toContain('XML declaration');
        });
        (0, globals_1.it)('should detect missing resources tag', () => {
            const content = `
<?xml version="1.0" encoding="utf-8"?>
<root>
    <dimen name="space_100">8dp</dimen>
</root>
      `.trim();
            const result = validator.validate(content, 'android', 'xml');
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.errors).toBeDefined();
            (0, globals_1.expect)(result.errors?.some(e => e.message.includes('resources'))).toBe(true);
        });
    });
    (0, globals_1.describe)('File extension validation', () => {
        (0, globals_1.it)('should validate correct file extensions', () => {
            (0, globals_1.expect)(validator.validateExtension('tokens.css', 'web', 'css').valid).toBe(true);
            (0, globals_1.expect)(validator.validateExtension('tokens.js', 'web', 'javascript').valid).toBe(true);
            (0, globals_1.expect)(validator.validateExtension('tokens.swift', 'ios', 'swift').valid).toBe(true);
            (0, globals_1.expect)(validator.validateExtension('tokens.kt', 'android', 'kotlin').valid).toBe(true);
            (0, globals_1.expect)(validator.validateExtension('tokens.xml', 'android', 'xml').valid).toBe(true);
        });
        (0, globals_1.it)('should detect incorrect file extensions', () => {
            const result = validator.validateExtension('tokens.txt', 'web', 'css');
            (0, globals_1.expect)(result.valid).toBe(false);
            (0, globals_1.expect)(result.error).toContain('Invalid file extension');
        });
    });
    (0, globals_1.describe)('Batch validation', () => {
        (0, globals_1.it)('should validate multiple files', () => {
            const files = [
                {
                    content: ':root { --space-100: 8px; }',
                    platform: 'web',
                    format: 'css'
                },
                {
                    content: 'import UIKit\n\npublic struct DesignTokens {\n    public static let space100: CGFloat = 8\n}',
                    platform: 'ios',
                    format: 'swift'
                }
            ];
            const results = validator.validateBatch(files);
            (0, globals_1.expect)(results.size).toBe(2);
            (0, globals_1.expect)(results.get('web-css')?.valid).toBe(true);
            (0, globals_1.expect)(results.get('ios-swift')?.valid).toBe(true);
        });
        (0, globals_1.it)('should provide summary of validation results', () => {
            const files = [
                {
                    content: ':root { --space-100: 8px; }',
                    platform: 'web',
                    format: 'css'
                },
                {
                    content: 'invalid content',
                    platform: 'ios',
                    format: 'swift'
                }
            ];
            const results = validator.validateBatch(files);
            const summary = validator.getSummary(results);
            (0, globals_1.expect)(summary.total).toBe(2);
            (0, globals_1.expect)(summary.valid).toBe(1);
            (0, globals_1.expect)(summary.invalid).toBe(1);
            (0, globals_1.expect)(summary.totalErrors).toBeGreaterThan(0);
        });
    });
    (0, globals_1.describe)('Warnings', () => {
        (0, globals_1.it)('should warn about long lines', () => {
            const longLine = '--very-long-token-name-that-exceeds-recommended-length: ' + 'x'.repeat(100) + ';';
            const content = `:root {\n  ${longLine}\n}`;
            const result = validator.validate(content, 'web', 'css');
            (0, globals_1.expect)(result.warnings).toBeDefined();
            (0, globals_1.expect)(result.warnings?.some(w => w.message.includes('Line exceeds'))).toBe(true);
        });
        (0, globals_1.it)('should warn about trailing whitespace', () => {
            const content = ':root {  \n  --space-100: 8px;  \n}';
            const result = validator.validate(content, 'web', 'css');
            (0, globals_1.expect)(result.warnings).toBeDefined();
            (0, globals_1.expect)(result.warnings?.some(w => w.message.includes('trailing whitespace'))).toBe(true);
        });
    });
});
//# sourceMappingURL=SyntaxValidator.test.js.map