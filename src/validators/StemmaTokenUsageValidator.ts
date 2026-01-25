/**
 * Stemma System Token Usage Validator
 * 
 * Validates token usage in component implementations:
 * - Detects inline styles and missing token references
 * - Validates token usage against component contracts (from YAML schemas)
 * - Provides suggestions for correct token usage
 * 
 * @see .kiro/steering/stemma-system-principles.md
 * @see Requirements: R8 (Health Guardrails and Validation)
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Result of token usage validation
 */
export interface TokenUsageValidationResult {
  /** Whether the validation passed (no errors) */
  valid: boolean;
  
  /** File path that was validated */
  filePath: string;
  
  /** Platform detected from file path */
  platform: 'web' | 'ios' | 'android' | 'unknown';
  
  /** Validation errors (blocking issues) */
  errors: TokenUsageError[];
  
  /** Validation warnings (non-blocking issues) */
  warnings: TokenUsageWarning[];
  
  /** Token usage statistics */
  stats: TokenUsageStats;
}

/**
 * Token usage validation error
 */
export interface TokenUsageError {
  /** Error code for programmatic handling */
  code: TokenUsageErrorCode;
  
  /** Human-readable error message */
  message: string;
  
  /** Line number where the issue was found (1-indexed) */
  line: number;
  
  /** Column number where the issue was found (1-indexed) */
  column?: number;
  
  /** The problematic code snippet */
  snippet: string;
  
  /** Detailed guidance for correction */
  guidance: string;
  
  /** Suggested fix (if available) */
  suggestion?: string;
}

/**
 * Token usage validation warning
 */
export interface TokenUsageWarning {
  /** Warning code for programmatic handling */
  code: TokenUsageWarningCode;
  
  /** Human-readable warning message */
  message: string;
  
  /** Line number where the issue was found (1-indexed) */
  line: number;
  
  /** The problematic code snippet */
  snippet: string;
  
  /** Detailed guidance */
  guidance: string;
}

/**
 * Token usage statistics
 */
export interface TokenUsageStats {
  /** Total lines analyzed */
  linesAnalyzed: number;
  
  /** Number of inline style violations found */
  inlineStyleViolations: number;
  
  /** Number of hardcoded value violations found */
  hardcodedValueViolations: number;
  
  /** Number of token references found */
  tokenReferencesFound: number;
  
  /** Number of missing required tokens */
  missingRequiredTokens: number;
}

/**
 * Error codes for token usage validation
 */
export type TokenUsageErrorCode =
  | 'INLINE_STYLE_COLOR'
  | 'INLINE_STYLE_SPACING'
  | 'INLINE_STYLE_TYPOGRAPHY'
  | 'INLINE_STYLE_BORDER'
  | 'HARDCODED_COLOR'
  | 'HARDCODED_SPACING'
  | 'HARDCODED_FONT_SIZE'
  | 'HARDCODED_BORDER_RADIUS'
  | 'MISSING_REQUIRED_TOKEN'
  | 'INVALID_TOKEN_REFERENCE';

/**
 * Warning codes for token usage validation
 */
export type TokenUsageWarningCode =
  | 'OPACITY_WORKAROUND'
  | 'FILTERBRIGHTNESS_WORKAROUND'
  | 'SCALEEFFECT_WORKAROUND'
  | 'RIPPLE_WORKAROUND'
  | 'MAGIC_NUMBER'
  | 'UNKNOWN_TOKEN_PATTERN'
  | 'DEPRECATED_TOKEN';

/**
 * Inline style patterns to detect (by platform)
 */
const INLINE_STYLE_PATTERNS = {
  web: {
    // CSS inline color values
    color: [
      /(?:color|background(?:-color)?|border(?:-color)?|fill|stroke)\s*:\s*#[0-9a-fA-F]{3,8}\b/gi,
      /(?:color|background(?:-color)?|border(?:-color)?|fill|stroke)\s*:\s*rgb\s*\(/gi,
      /(?:color|background(?:-color)?|border(?:-color)?|fill|stroke)\s*:\s*rgba\s*\(/gi,
      /(?:color|background(?:-color)?|border(?:-color)?|fill|stroke)\s*:\s*hsl\s*\(/gi,
    ],
    // CSS inline spacing values (px, rem, em without token reference)
    spacing: [
      /(?:margin|padding|gap|top|right|bottom|left|width|height)\s*:\s*\d+(?:px|rem|em)\b/gi,
    ],
    // CSS inline typography values
    typography: [
      /font-size\s*:\s*\d+(?:px|rem|em)\b/gi,
      /line-height\s*:\s*\d+(?:px|rem|em)?\b/gi,
      /font-weight\s*:\s*\d{3}\b/gi,
    ],
    // CSS inline border values
    border: [
      /border-radius\s*:\s*\d+(?:px|rem|em)\b/gi,
      /border-width\s*:\s*\d+(?:px|rem|em)\b/gi,
    ],
  },
  ios: {
    // SwiftUI inline color values
    color: [
      /Color\s*\(\s*red\s*:/gi,
      /Color\s*\(\s*#/gi,
      /UIColor\s*\(/gi,
      /\.foregroundColor\s*\(\s*Color\s*\(/gi,
      /\.background\s*\(\s*Color\s*\(/gi,
    ],
    // SwiftUI inline spacing values
    spacing: [
      /\.padding\s*\(\s*\d+\s*\)/gi,
      /\.frame\s*\([^)]*width\s*:\s*\d+/gi,
      /\.frame\s*\([^)]*height\s*:\s*\d+/gi,
      /Spacer\s*\(\s*minLength\s*:\s*\d+/gi,
    ],
    // SwiftUI inline typography values
    typography: [
      /\.font\s*\(\s*\.system\s*\(\s*size\s*:\s*\d+/gi,
      /Font\.system\s*\(\s*size\s*:\s*\d+/gi,
    ],
    // SwiftUI inline border values
    border: [
      /\.cornerRadius\s*\(\s*\d+\s*\)/gi,
      /RoundedRectangle\s*\(\s*cornerRadius\s*:\s*\d+/gi,
    ],
  },
  android: {
    // Jetpack Compose inline color values
    color: [
      /Color\s*\(\s*0x[0-9a-fA-F]+\s*\)/gi,
      /Color\s*\(\s*red\s*=/gi,
      /Color\.rgb\s*\(/gi,
      /Color\.argb\s*\(/gi,
    ],
    // Jetpack Compose inline spacing values
    spacing: [
      /\.padding\s*\(\s*\d+\.dp\s*\)/gi,
      /\.width\s*\(\s*\d+\.dp\s*\)/gi,
      /\.height\s*\(\s*\d+\.dp\s*\)/gi,
      /Spacer\s*\([^)]*\d+\.dp/gi,
    ],
    // Jetpack Compose inline typography values
    typography: [
      /fontSize\s*=\s*\d+\.sp/gi,
      /lineHeight\s*=\s*\d+\.sp/gi,
    ],
    // Jetpack Compose inline border values
    border: [
      /RoundedCornerShape\s*\(\s*\d+\.dp\s*\)/gi,
      /\.clip\s*\(\s*RoundedCornerShape\s*\(\s*\d+/gi,
    ],
  },
};

/**
 * Hardcoded value patterns to detect
 */
const HARDCODED_VALUE_PATTERNS = {
  // Hex colors (not in comments or strings)
  hexColor: /#[0-9a-fA-F]{3,8}\b/g,
  
  // RGB/RGBA colors
  rgbColor: /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+/gi,
  
  // Pixel values (common hardcoded sizes)
  pixelValue: /(?<![a-zA-Z_$])\d{2,}px\b/g,
  
  // Magic numbers for spacing (common values like 4, 8, 12, 16, 24, 32, 48)
  magicSpacing: /(?:padding|margin|gap|spacing)\s*[=:]\s*(?:4|8|12|16|20|24|32|40|48|56|64)\b/gi,
};

/**
 * Workaround patterns to detect
 */
const WORKAROUND_PATTERNS = {
  // Opacity workarounds for state colors
  opacity: /opacity\s*[=:]\s*0\.[5-9]\d*/gi,
  
  // Filter brightness workaround
  filterBrightness: /filter\s*:\s*brightness\s*\(/gi,
  
  // iOS scaleEffect workaround
  scaleEffect: /scaleEffect\s*\(\s*0\.9/gi,
  
  // Android ripple workaround
  ripple: /rememberRipple\s*\(/gi,
};

/**
 * Token reference patterns (valid usage)
 */
const TOKEN_REFERENCE_PATTERNS = {
  web: [
    /var\s*\(\s*--[a-zA-Z][a-zA-Z0-9-]*\s*\)/g,  // CSS custom properties
    /getPropertyValue\s*\(\s*['"]--[a-zA-Z][a-zA-Z0-9-]*['"]\s*\)/g,  // JS access
    /\$\{[a-zA-Z][a-zA-Z0-9_.]*Tokens?\.[a-zA-Z][a-zA-Z0-9_.]*\}/g,  // Template literals
  ],
  ios: [
    /DesignTokens\.[a-zA-Z][a-zA-Z0-9_.]*/g,  // Token references
    /Tokens\.[a-zA-Z][a-zA-Z0-9_.]*/g,  // Token references
    /\.token\(['""][a-zA-Z][a-zA-Z0-9_.]*['"]\)/g,  // Token function
  ],
  android: [
    /DesignTokens\.[a-zA-Z][a-zA-Z0-9_.]*/g,  // Token references
    /Tokens\.[a-zA-Z][a-zA-Z0-9_.]*/g,  // Token references
    /MaterialTheme\.[a-zA-Z][a-zA-Z0-9_.]*/g,  // Material theme tokens
  ],
};

/**
 * Known token categories for suggestions
 * 
 * Updated for Spec 052: Semantic Token Naming Implementation
 * - color.primary → color.action.primary
 * - color.contrast.onPrimary → color.contrast.onDark
 */
export const TOKEN_CATEGORIES = {
  color: [
    'color.action.primary', 'color.action.secondary', 'color.feedback.error.text', 'color.feedback.success.text',
    'color.text.default', 'color.text.muted', 'color.contrast.onLight', 'color.contrast.onDark',
    'color.background', 'color.surface', 'color.border',
  ],
  spacing: [
    'space.inset.100', 'space.inset.150', 'space.inset.200',
    'space.inline.100', 'space.inline.150',
    'space.grouped.tight', 'space.grouped.minimal',
  ],
  typography: [
    'typography.body', 'typography.bodyLg', 'typography.bodySm',
    'typography.labelMd', 'typography.labelLg', 'typography.labelSm',
    'typography.heading', 'typography.caption',
  ],
  border: [
    'border.default', 'border.strong',
    'radius.100', 'radius.150', 'radius.200',
  ],
  blend: [
    'blend.hoverDarker', 'blend.pressedDarker',
    'blend.disabledDesaturate', 'blend.iconLighter',
  ],
};

/**
 * Detect platform from file path
 */
export function detectPlatform(filePath: string): 'web' | 'ios' | 'android' | 'unknown' {
  const normalizedPath = filePath.toLowerCase();
  
  if (normalizedPath.includes('/web/') || normalizedPath.endsWith('.web.ts') || normalizedPath.endsWith('.web.css')) {
    return 'web';
  }
  if (normalizedPath.includes('/ios/') || normalizedPath.endsWith('.ios.swift') || normalizedPath.endsWith('.swift')) {
    return 'ios';
  }
  if (normalizedPath.includes('/android/') || normalizedPath.endsWith('.android.kt') || normalizedPath.endsWith('.kt')) {
    return 'android';
  }
  
  return 'unknown';
}

/**
 * Check if a line is a comment
 */
function isCommentLine(line: string, platform: string): boolean {
  const trimmed = line.trim();
  
  // Single-line comments
  if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
    return true;
  }
  
  // Multi-line comment markers
  if (trimmed.startsWith('/**') || trimmed.startsWith('*/')) {
    return true;
  }
  
  // Python-style comments (for any config files)
  if (trimmed.startsWith('#')) {
    return true;
  }
  
  return false;
}

/**
 * Check if a line is inside a string literal (basic heuristic)
 */
function isInsideString(line: string, matchIndex: number): boolean {
  // Count quotes before the match position
  const beforeMatch = line.substring(0, matchIndex);
  const singleQuotes = (beforeMatch.match(/'/g) || []).length;
  const doubleQuotes = (beforeMatch.match(/"/g) || []).length;
  const backticks = (beforeMatch.match(/`/g) || []).length;
  
  // If odd number of quotes, we're inside a string
  return (singleQuotes % 2 === 1) || (doubleQuotes % 2 === 1) || (backticks % 2 === 1);
}

/**
 * Get suggestion for a token category
 */
function getSuggestionForCategory(category: keyof typeof TOKEN_CATEGORIES): string {
  const tokens = TOKEN_CATEGORIES[category];
  return `Consider using design tokens: ${tokens.slice(0, 3).join(', ')}...`;
}

/**
 * Validate token usage in a source file
 */
export function validateTokenUsage(source: string, filePath: string): TokenUsageValidationResult {
  const platform = detectPlatform(filePath);
  const errors: TokenUsageError[] = [];
  const warnings: TokenUsageWarning[] = [];
  const lines = source.split('\n');
  
  let inlineStyleViolations = 0;
  let hardcodedValueViolations = 0;
  let tokenReferencesFound = 0;
  
  // Get platform-specific patterns
  const inlinePatterns = platform !== 'unknown' 
    ? INLINE_STYLE_PATTERNS[platform] 
    : INLINE_STYLE_PATTERNS.web;
  
  const tokenPatterns = platform !== 'unknown'
    ? TOKEN_REFERENCE_PATTERNS[platform]
    : TOKEN_REFERENCE_PATTERNS.web;
  
  // Analyze each line
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const lineNumber = lineIndex + 1;
    
    // Skip comment lines
    if (isCommentLine(line, platform)) {
      continue;
    }
    
    // Count token references (valid usage)
    for (const pattern of tokenPatterns) {
      const matches = line.match(pattern);
      if (matches) {
        tokenReferencesFound += matches.length;
      }
    }
    
    // Check for inline style violations
    for (const [category, patterns] of Object.entries(inlinePatterns)) {
      for (const pattern of patterns) {
        // Reset regex lastIndex for global patterns
        pattern.lastIndex = 0;
        let match;
        
        while ((match = pattern.exec(line)) !== null) {
          // Skip if inside a string literal (likely a comment or documentation)
          if (isInsideString(line, match.index)) {
            continue;
          }
          
          inlineStyleViolations++;
          errors.push({
            code: `INLINE_STYLE_${category.toUpperCase()}` as TokenUsageErrorCode,
            message: `Inline ${category} style detected`,
            line: lineNumber,
            column: match.index + 1,
            snippet: match[0],
            guidance: `Use design tokens instead of inline ${category} values. ${getSuggestionForCategory(category as keyof typeof TOKEN_CATEGORIES)}`,
            suggestion: getSuggestionForCategory(category as keyof typeof TOKEN_CATEGORIES),
          });
        }
      }
    }
    
    // Check for hardcoded color values
    const hexMatches = line.match(HARDCODED_VALUE_PATTERNS.hexColor);
    if (hexMatches) {
      for (const match of hexMatches) {
        // Skip if inside a string or comment
        const matchIndex = line.indexOf(match);
        if (isInsideString(line, matchIndex)) {
          continue;
        }
        
        hardcodedValueViolations++;
        errors.push({
          code: 'HARDCODED_COLOR',
          message: `Hardcoded color value detected: ${match}`,
          line: lineNumber,
          snippet: match,
          guidance: 'Use semantic color tokens instead of hardcoded hex values.',
          suggestion: getSuggestionForCategory('color'),
        });
      }
    }
    
    // Check for workaround patterns
    for (const [name, pattern] of Object.entries(WORKAROUND_PATTERNS)) {
      pattern.lastIndex = 0;
      const match = pattern.exec(line);
      if (match) {
        warnings.push({
          code: `${name.toUpperCase()}_WORKAROUND` as TokenUsageWarningCode,
          message: `Potential ${name} workaround detected`,
          line: lineNumber,
          snippet: match[0],
          guidance: `Consider using blend utilities instead of ${name} workarounds for state colors.`,
        });
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    filePath,
    platform,
    errors,
    warnings,
    stats: {
      linesAnalyzed: lines.length,
      inlineStyleViolations,
      hardcodedValueViolations,
      tokenReferencesFound,
      missingRequiredTokens: 0, // Will be populated by schema validation
    },
  };
}

/**
 * Validate token usage against a component schema
 */
export function validateAgainstSchema(
  source: string,
  filePath: string,
  schemaTokens: string[]
): TokenUsageValidationResult {
  // First run basic validation
  const result = validateTokenUsage(source, filePath);
  
  // Check for required tokens from schema
  const missingTokens: string[] = [];
  
  for (const token of schemaTokens) {
    // Convert token name to various patterns to search for
    const tokenPatterns = [
      token,
      token.replace(/\./g, '-'),  // dot to hyphen (CSS custom properties)
      token.replace(/\./g, '_'),  // dot to underscore (some platforms)
      `--${token.replace(/\./g, '-')}`,  // CSS custom property format
    ];
    
    const found = tokenPatterns.some(pattern => 
      source.toLowerCase().includes(pattern.toLowerCase())
    );
    
    if (!found) {
      missingTokens.push(token);
    }
  }
  
  // Add errors for missing required tokens
  for (const token of missingTokens) {
    result.errors.push({
      code: 'MISSING_REQUIRED_TOKEN',
      message: `Required token "${token}" not found in component`,
      line: 1,
      snippet: '',
      guidance: `The component schema requires token "${token}" but it was not found in the implementation.`,
      suggestion: `Add usage of ${token} token to the component implementation.`,
    });
  }
  
  result.stats.missingRequiredTokens = missingTokens.length;
  result.valid = result.errors.length === 0;
  
  return result;
}

/**
 * Validate multiple files and return aggregated results
 */
export function validateTokenUsageInFiles(filePaths: string[]): {
  results: Map<string, TokenUsageValidationResult>;
  summary: {
    totalFiles: number;
    validFiles: number;
    invalidFiles: number;
    totalErrors: number;
    totalWarnings: number;
    totalInlineStyleViolations: number;
    totalHardcodedValueViolations: number;
  };
} {
  const results = new Map<string, TokenUsageValidationResult>();
  let validFiles = 0;
  let invalidFiles = 0;
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalInlineStyleViolations = 0;
  let totalHardcodedValueViolations = 0;
  
  for (const filePath of filePaths) {
    try {
      const fullPath = path.resolve(process.cwd(), filePath);
      if (!fs.existsSync(fullPath)) {
        continue;
      }
      
      const source = fs.readFileSync(fullPath, 'utf-8');
      const result = validateTokenUsage(source, filePath);
      results.set(filePath, result);
      
      if (result.valid) {
        validFiles++;
      } else {
        invalidFiles++;
      }
      
      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;
      totalInlineStyleViolations += result.stats.inlineStyleViolations;
      totalHardcodedValueViolations += result.stats.hardcodedValueViolations;
    } catch (error) {
      // Skip files that can't be read
      continue;
    }
  }
  
  return {
    results,
    summary: {
      totalFiles: filePaths.length,
      validFiles,
      invalidFiles,
      totalErrors,
      totalWarnings,
      totalInlineStyleViolations,
      totalHardcodedValueViolations,
    },
  };
}

/**
 * Format validation errors for display
 */
export function formatTokenUsageErrors(result: TokenUsageValidationResult): string {
  if (result.valid && result.errors.length === 0) {
    return `✅ "${result.filePath}" - No token usage violations found (${result.stats.tokenReferencesFound} token references)`;
  }
  
  const lines: string[] = [
    `❌ "${result.filePath}" - ${result.errors.length} violation(s) found:`
  ];
  
  for (const error of result.errors) {
    lines.push(`  Line ${error.line}: ${error.message}`);
    if (error.snippet) {
      lines.push(`    Code: ${error.snippet}`);
    }
    lines.push(`    → ${error.guidance}`);
    if (error.suggestion) {
      lines.push(`    💡 ${error.suggestion}`);
    }
  }
  
  return lines.join('\n');
}

/**
 * Format validation warnings for display
 */
export function formatTokenUsageWarnings(result: TokenUsageValidationResult): string {
  if (result.warnings.length === 0) {
    return '';
  }
  
  const lines: string[] = [
    `⚠️ Warnings for "${result.filePath}":`
  ];
  
  for (const warning of result.warnings) {
    lines.push(`  Line ${warning.line}: ${warning.message}`);
    if (warning.snippet) {
      lines.push(`    Code: ${warning.snippet}`);
    }
    lines.push(`    → ${warning.guidance}`);
  }
  
  return lines.join('\n');
}
