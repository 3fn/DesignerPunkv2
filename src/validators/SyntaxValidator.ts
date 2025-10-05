import { TargetPlatform, OutputFormat } from '../types/TranslationOutput';

/**
 * Syntax validation result
 */
export interface SyntaxValidationResult {
  /** Whether syntax is valid */
  valid: boolean;
  
  /** Platform being validated */
  platform: TargetPlatform;
  
  /** Output format being validated */
  format: OutputFormat;
  
  /** Validation errors (if any) */
  errors?: SyntaxError[];
  
  /** Validation warnings (if any) */
  warnings?: SyntaxWarning[];
  
  /** Additional validation details */
  details?: string;
}

/**
 * Syntax error details
 */
export interface SyntaxError {
  /** Error message */
  message: string;
  
  /** Line number where error occurred (if applicable) */
  line?: number;
  
  /** Column number where error occurred (if applicable) */
  column?: number;
  
  /** Severity level */
  severity: 'error' | 'critical';
  
  /** Suggested fix (if available) */
  suggestion?: string;
}

/**
 * Syntax warning details
 */
export interface SyntaxWarning {
  /** Warning message */
  message: string;
  
  /** Line number where warning occurred (if applicable) */
  line?: number;
  
  /** Suggested improvement */
  suggestion?: string;
}

/**
 * Platform-specific syntax validation rules
 */
interface PlatformSyntaxRules {
  /** Required patterns that must be present */
  requiredPatterns: Array<{
    pattern: RegExp;
    description: string;
    errorMessage: string;
  }>;
  
  /** Forbidden patterns that must not be present */
  forbiddenPatterns: Array<{
    pattern: RegExp;
    description: string;
    errorMessage: string;
  }>;
  
  /** Balanced delimiters to check */
  balancedDelimiters: Array<{
    open: string;
    close: string;
    description: string;
  }>;
  
  /** File extension validation */
  validExtensions: string[];
}

/**
 * Validates platform-specific syntax for generated token files
 */
export class SyntaxValidator {
  private rules: Map<string, PlatformSyntaxRules>;
  
  constructor() {
    this.rules = new Map();
    this.initializeRules();
  }
  
  /**
   * Initialize platform-specific syntax rules
   */
  private initializeRules(): void {
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
  validate(
    content: string,
    platform: TargetPlatform,
    format: OutputFormat
  ): SyntaxValidationResult {
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
    
    const errors: SyntaxError[] = [];
    const warnings: SyntaxWarning[] = [];
    
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
      const balance = this.checkBalancedDelimiters(
        content,
        delimiter.open,
        delimiter.close
      );
      
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
  private checkBalancedDelimiters(
    content: string,
    open: string,
    close: string
  ): { balanced: boolean; openCount: number; closeCount: number } {
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
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  /**
   * Perform format-specific validation checks
   */
  private performFormatSpecificChecks(
    content: string,
    platform: TargetPlatform,
    format: OutputFormat,
    warnings: SyntaxWarning[]
  ): void {
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
  private generateValidationDetails(
    errors: SyntaxError[],
    warnings: SyntaxWarning[]
  ): string {
    const parts: string[] = [];
    
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
  validateExtension(
    filename: string,
    platform: TargetPlatform,
    format: OutputFormat
  ): { valid: boolean; error?: string } {
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
  validateBatch(
    files: Array<{ content: string; platform: TargetPlatform; format: OutputFormat }>
  ): Map<string, SyntaxValidationResult> {
    const results = new Map<string, SyntaxValidationResult>();
    
    for (const file of files) {
      const key = `${file.platform}-${file.format}`;
      results.set(key, this.validate(file.content, file.platform, file.format));
    }
    
    return results;
  }
  
  /**
   * Get validation summary
   */
  getSummary(results: Map<string, SyntaxValidationResult>): {
    total: number;
    valid: number;
    invalid: number;
    totalErrors: number;
    totalWarnings: number;
  } {
    let valid = 0;
    let invalid = 0;
    let totalErrors = 0;
    let totalWarnings = 0;
    
    for (const result of results.values()) {
      if (result.valid) {
        valid++;
      } else {
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
