"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaxValidator = void 0;
/**
 * Validates platform-specific syntax for generated token files
 */
class SyntaxValidator {
    constructor() {
        this.rules = new Map();
        this.initializeRules();
    }
    /**
     * Initialize platform-specific syntax rules
     */
    initializeRules() {
        // Web CSS rules
        this.rules.set('web-css', {
            requiredPatterns: [
                {
                    pattern: /:root\s*{/,
                    description: 'CSS :root selector',
                    errorMessage: 'Missing :root selector for CSS custom properties'
                },
                {
                    pattern: /--[\w-]+\s*:/,
                    description: 'CSS custom property declaration',
                    errorMessage: 'No CSS custom properties found'
                }
            ],
            forbiddenPatterns: [
                {
                    pattern: /\$[\w-]+/,
                    description: 'SCSS variable syntax',
                    errorMessage: 'SCSS variable syntax not allowed in CSS output'
                }
            ],
            balancedDelimiters: [
                { open: '{', close: '}', description: 'CSS braces' }
            ],
            validExtensions: ['.css']
        });
        // Web JavaScript rules
        this.rules.set('web-javascript', {
            requiredPatterns: [
                {
                    pattern: /export\s+(const|let|var)/,
                    description: 'JavaScript export statement',
                    errorMessage: 'Missing export statement for JavaScript constants'
                }
            ],
            forbiddenPatterns: [
                {
                    pattern: /import\s+.*\s+from\s+['"]react['"]/,
                    description: 'React import',
                    errorMessage: 'React imports not needed in token constants'
                }
            ],
            balancedDelimiters: [
                { open: '{', close: '}', description: 'JavaScript braces' },
                { open: '[', close: ']', description: 'JavaScript brackets' },
                { open: '(', close: ')', description: 'JavaScript parentheses' }
            ],
            validExtensions: ['.js', '.ts']
        });
        // iOS Swift rules
        this.rules.set('ios-swift', {
            requiredPatterns: [
                {
                    pattern: /import\s+UIKit/,
                    description: 'UIKit import',
                    errorMessage: 'Missing UIKit import for iOS tokens'
                },
                {
                    pattern: /public\s+(struct|class|enum)\s+\w+/,
                    description: 'Public type declaration',
                    errorMessage: 'Missing public type declaration for token container'
                },
                {
                    pattern: /public\s+static\s+let\s+\w+/,
                    description: 'Public static constant',
                    errorMessage: 'No public static constants found'
                }
            ],
            forbiddenPatterns: [
                {
                    pattern: /var\s+\w+\s*=/,
                    description: 'Mutable variable',
                    errorMessage: 'Tokens should be immutable (use let, not var)'
                }
            ],
            balancedDelimiters: [
                { open: '{', close: '}', description: 'Swift braces' },
                { open: '[', close: ']', description: 'Swift brackets' },
                { open: '(', close: ')', description: 'Swift parentheses' }
            ],
            validExtensions: ['.swift']
        });
        // Android Kotlin rules
        this.rules.set('android-kotlin', {
            requiredPatterns: [
                {
                    pattern: /package\s+[\w.]+/,
                    description: 'Package declaration',
                    errorMessage: 'Missing package declaration for Kotlin file'
                },
                {
                    pattern: /object\s+\w+/,
                    description: 'Object declaration',
                    errorMessage: 'Missing object declaration for token container'
                },
                {
                    pattern: /const\s+val\s+\w+/,
                    description: 'Constant declaration',
                    errorMessage: 'No constant declarations found'
                }
            ],
            forbiddenPatterns: [
                {
                    pattern: /var\s+\w+\s*=/,
                    description: 'Mutable variable',
                    errorMessage: 'Tokens should be immutable (use val, not var)'
                }
            ],
            balancedDelimiters: [
                { open: '{', close: '}', description: 'Kotlin braces' },
                { open: '[', close: ']', description: 'Kotlin brackets' },
                { open: '(', close: ')', description: 'Kotlin parentheses' }
            ],
            validExtensions: ['.kt']
        });
        // Android XML rules
        this.rules.set('android-xml', {
            requiredPatterns: [
                {
                    pattern: /<\?xml\s+version="1\.0"/,
                    description: 'XML declaration',
                    errorMessage: 'Missing XML declaration'
                },
                {
                    pattern: /<resources>/,
                    description: 'Resources root element',
                    errorMessage: 'Missing <resources> root element'
                },
                {
                    pattern: /<\/resources>/,
                    description: 'Closing resources tag',
                    errorMessage: 'Missing </resources> closing tag'
                }
            ],
            forbiddenPatterns: [
                {
                    pattern: /<resources\s+[^>]*>/,
                    description: 'Resources with attributes',
                    errorMessage: 'Resources element should not have attributes'
                }
            ],
            balancedDelimiters: [
                { open: '<resources>', close: '</resources>', description: 'Resources tags' }
            ],
            validExtensions: ['.xml']
        });
    }
    /**
     * Validate syntax for a specific platform and format
     */
    validate(content, platform, format) {
        const ruleKey = `${platform}-${format}`;
        const rules = this.rules.get(ruleKey);
        if (!rules) {
            return {
                valid: true,
                platform,
                format,
                warnings: [{
                        message: `No syntax rules defined for ${platform}-${format}`,
                        suggestion: 'Consider adding validation rules for this platform/format combination'
                    }]
            };
        }
        const errors = [];
        const warnings = [];
        // Check required patterns
        for (const rule of rules.requiredPatterns) {
            if (!rule.pattern.test(content)) {
                errors.push({
                    message: rule.errorMessage,
                    severity: 'error',
                    suggestion: `Add ${rule.description} to the generated file`
                });
            }
        }
        // Check forbidden patterns
        for (const rule of rules.forbiddenPatterns) {
            if (rule.pattern.test(content)) {
                errors.push({
                    message: rule.errorMessage,
                    severity: 'error',
                    suggestion: `Remove ${rule.description} from the generated file`
                });
            }
        }
        // Check balanced delimiters
        for (const delimiter of rules.balancedDelimiters) {
            const balance = this.checkBalancedDelimiters(content, delimiter.open, delimiter.close);
            if (!balance.balanced) {
                errors.push({
                    message: `Unbalanced ${delimiter.description}`,
                    severity: 'critical',
                    suggestion: `Ensure all ${delimiter.open} have matching ${delimiter.close}`
                });
            }
        }
        // Additional format-specific checks
        this.performFormatSpecificChecks(content, platform, format, warnings);
        return {
            valid: errors.length === 0,
            platform,
            format,
            errors: errors.length > 0 ? errors : undefined,
            warnings: warnings.length > 0 ? warnings : undefined,
            details: this.generateValidationDetails(errors, warnings)
        };
    }
    /**
     * Check if delimiters are balanced
     */
    checkBalancedDelimiters(content, open, close) {
        const openCount = (content.match(new RegExp(this.escapeRegex(open), 'g')) || []).length;
        const closeCount = (content.match(new RegExp(this.escapeRegex(close), 'g')) || []).length;
        return {
            balanced: openCount === closeCount,
            openCount,
            closeCount
        };
    }
    /**
     * Escape special regex characters
     */
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    /**
     * Perform format-specific validation checks
     */
    performFormatSpecificChecks(content, platform, format, warnings) {
        // Check for common issues
        // Empty file check
        if (content.trim().length === 0) {
            warnings.push({
                message: 'Generated file is empty',
                suggestion: 'Ensure tokens are being generated correctly'
            });
        }
        // Line length check
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            if (line.length > 120) {
                warnings.push({
                    message: 'Line exceeds recommended length',
                    line: index + 1,
                    suggestion: 'Consider breaking long lines for better readability'
                });
            }
        });
        // Trailing whitespace check
        if (/\s+$/m.test(content)) {
            warnings.push({
                message: 'File contains trailing whitespace',
                suggestion: 'Remove trailing whitespace for cleaner code'
            });
        }
    }
    /**
     * Generate validation details summary
     */
    generateValidationDetails(errors, warnings) {
        const parts = [];
        if (errors.length > 0) {
            parts.push(`Found ${errors.length} error(s)`);
        }
        if (warnings.length > 0) {
            parts.push(`Found ${warnings.length} warning(s)`);
        }
        if (parts.length === 0) {
            return 'Syntax validation passed';
        }
        return parts.join(', ');
    }
    /**
     * Validate file extension
     */
    validateExtension(filename, platform, format) {
        const ruleKey = `${platform}-${format}`;
        const rules = this.rules.get(ruleKey);
        if (!rules) {
            return { valid: true };
        }
        const extension = filename.substring(filename.lastIndexOf('.'));
        if (!rules.validExtensions.includes(extension)) {
            return {
                valid: false,
                error: `Invalid file extension "${extension}" for ${platform}-${format}. ` +
                    `Expected one of: ${rules.validExtensions.join(', ')}`
            };
        }
        return { valid: true };
    }
    /**
     * Batch validate multiple files
     */
    validateBatch(files) {
        const results = new Map();
        for (const file of files) {
            const key = `${file.platform}-${file.format}`;
            results.set(key, this.validate(file.content, file.platform, file.format));
        }
        return results;
    }
    /**
     * Get validation summary
     */
    getSummary(results) {
        let valid = 0;
        let invalid = 0;
        let totalErrors = 0;
        let totalWarnings = 0;
        for (const result of results.values()) {
            if (result.valid) {
                valid++;
            }
            else {
                invalid++;
            }
            if (result.errors) {
                totalErrors += result.errors.length;
            }
            if (result.warnings) {
                totalWarnings += result.warnings.length;
            }
        }
        return {
            total: results.size,
            valid,
            invalid,
            totalErrors,
            totalWarnings
        };
    }
}
exports.SyntaxValidator = SyntaxValidator;
//# sourceMappingURL=SyntaxValidator.js.map