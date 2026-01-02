/**
 * Stemma System Component Naming Convention Validator
 * 
 * Validates component names against the Stemma System naming convention:
 * - [Family]-[Type]-[Variant] (3 segments)
 * - [Family]-[Type] (2 segments)
 * - [Family]-Base (2 segments, Base as Type)
 * 
 * @see .kiro/steering/stemma-system-principles.md
 * @see Requirements: R8 (Health Guardrails and Validation)
 */

/**
 * Result of component name validation
 */
export interface ComponentNameValidationResult {
  /** Whether the name is valid */
  valid: boolean;
  
  /** Original component name */
  name: string;
  
  /** Parsed segments (if valid) */
  segments?: ComponentNameSegments;
  
  /** Component type classification */
  componentType?: 'primitive' | 'semantic' | 'standalone';
  
  /** Validation errors (if any) */
  errors: ComponentNameError[];
  
  /** Validation warnings (if any) */
  warnings: ComponentNameWarning[];
  
  /** Suggested correction (if invalid) */
  suggestion?: string;
}

/**
 * Parsed component name segments
 */
export interface ComponentNameSegments {
  /** Family segment (e.g., "Input", "Button", "Container") */
  family: string;
  
  /** Type segment (e.g., "Text", "CTA", "Base") */
  type: string;
  
  /** Variant segment (optional, e.g., "Email", "Password", "Base") */
  variant?: string;
}

/**
 * Component name validation error
 */
export interface ComponentNameError {
  /** Error code for programmatic handling */
  code: ComponentNameErrorCode;
  
  /** Human-readable error message */
  message: string;
  
  /** Detailed guidance for correction */
  guidance: string;
}

/**
 * Component name validation warning
 */
export interface ComponentNameWarning {
  /** Warning code for programmatic handling */
  code: ComponentNameWarningCode;
  
  /** Human-readable warning message */
  message: string;
  
  /** Detailed guidance */
  guidance: string;
}

/**
 * Error codes for component name validation
 */
export type ComponentNameErrorCode =
  | 'MISSING_HYPHENS'
  | 'WRONG_CASE'
  | 'TOO_MANY_SEGMENTS'
  | 'TOO_FEW_SEGMENTS'
  | 'INVALID_SEGMENT_FORMAT'
  | 'RESERVED_KEYWORD_MISUSE'
  | 'EMPTY_SEGMENT'
  | 'INVALID_CHARACTERS';

/**
 * Warning codes for component name validation
 */
export type ComponentNameWarningCode =
  | 'BASE_NOT_AT_END'
  | 'UNUSUAL_FAMILY_NAME'
  | 'LONG_SEGMENT_NAME';

/**
 * Reserved keywords that have special meaning in Stemma System
 */
export const RESERVED_KEYWORDS = ['Base', 'Abstract', 'Core', 'Default'] as const;

/**
 * Known component families in the Stemma System
 */
export const KNOWN_FAMILIES = [
  'Input',
  'Button',
  'Container',
  'Icon',
  'Modal',
  'Avatar',
  'Badge',
  'DataDisplay',
  'Divider',
  'Loading',
  'Nav',
] as const;

/**
 * Validates a component name against Stemma System naming conventions
 */
export function validateComponentName(name: string): ComponentNameValidationResult {
  const errors: ComponentNameError[] = [];
  const warnings: ComponentNameWarning[] = [];
  
  // Check for empty or whitespace-only name
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      name,
      errors: [{
        code: 'EMPTY_SEGMENT',
        message: 'Component name cannot be empty',
        guidance: 'Provide a component name following the pattern [Family]-[Type] or [Family]-[Type]-[Variant]'
      }],
      warnings: []
    };
  }
  
  // Check for invalid characters (only allow letters, numbers, and hyphens)
  if (!/^[a-zA-Z0-9-]+$/.test(name)) {
    errors.push({
      code: 'INVALID_CHARACTERS',
      message: `Component name "${name}" contains invalid characters`,
      guidance: 'Component names should only contain letters, numbers, and hyphens. Use PascalCase for segments separated by hyphens.'
    });
  }
  
  // Check for missing hyphens (single word or camelCase without hyphens)
  if (!name.includes('-')) {
    errors.push({
      code: 'MISSING_HYPHENS',
      message: `Component name "${name}" must use hyphens between segments`,
      guidance: 'Use the pattern [Family]-[Type] or [Family]-[Type]-[Variant]. Example: "Input-Text-Email" or "Button-CTA"'
    });
    
    // Try to suggest a correction
    const suggestion = suggestCorrectedName(name);
    return {
      valid: false,
      name,
      errors,
      warnings,
      suggestion
    };
  }
  
  // Split into segments
  const segments = name.split('-');
  
  // Check for empty segments (consecutive hyphens)
  if (segments.some(s => s.length === 0)) {
    errors.push({
      code: 'EMPTY_SEGMENT',
      message: `Component name "${name}" contains empty segments (consecutive hyphens)`,
      guidance: 'Each segment between hyphens must contain at least one character'
    });
  }
  
  // Check segment count
  if (segments.length < 2) {
    errors.push({
      code: 'TOO_FEW_SEGMENTS',
      message: `Component name "${name}" has too few segments (${segments.length})`,
      guidance: 'Component names should have 2-3 segments: [Family]-[Type] or [Family]-[Type]-[Variant]'
    });
  } else if (segments.length > 3) {
    errors.push({
      code: 'TOO_MANY_SEGMENTS',
      message: `Component name "${name}" has too many segments (${segments.length})`,
      guidance: 'Component names should have 2-3 segments maximum. Simplify the naming.'
    });
  }
  
  // Validate each segment for PascalCase
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (segment.length > 0 && !isPascalCase(segment)) {
      errors.push({
        code: 'WRONG_CASE',
        message: `Segment "${segment}" in "${name}" must use PascalCase`,
        guidance: `Capitalize the first letter of each word. "${segment}" should be "${toPascalCase(segment)}"`
      });
    }
  }
  
  // Check for reserved keyword misuse
  for (const segment of segments) {
    if (RESERVED_KEYWORDS.includes(segment as any) && segment !== 'Base') {
      errors.push({
        code: 'RESERVED_KEYWORD_MISUSE',
        message: `"${segment}" is a reserved keyword`,
        guidance: `Use "Base" instead of "${segment}" for foundational components`
      });
    }
  }
  
  // If there are errors, return early
  if (errors.length > 0) {
    const suggestion = suggestCorrectedName(name);
    return {
      valid: false,
      name,
      errors,
      warnings,
      suggestion
    };
  }
  
  // Parse segments
  const parsedSegments: ComponentNameSegments = {
    family: segments[0],
    type: segments[1],
    variant: segments.length > 2 ? segments[2] : undefined
  };
  
  // Determine component type
  const componentType = determineComponentType(parsedSegments);
  
  // Add warnings for unusual patterns
  if (!KNOWN_FAMILIES.includes(parsedSegments.family as any)) {
    warnings.push({
      code: 'UNUSUAL_FAMILY_NAME',
      message: `"${parsedSegments.family}" is not a known component family`,
      guidance: `Known families: ${KNOWN_FAMILIES.join(', ')}. If this is a new family, ensure it's documented.`
    });
  }
  
  // Check for long segment names
  for (const segment of segments) {
    if (segment.length > 20) {
      warnings.push({
        code: 'LONG_SEGMENT_NAME',
        message: `Segment "${segment}" is unusually long (${segment.length} characters)`,
        guidance: 'Consider using a shorter, more concise name for better readability'
      });
    }
  }
  
  // Check for Base not at end when used as variant
  if (parsedSegments.variant && parsedSegments.variant !== 'Base' && 
      parsedSegments.type === 'Base') {
    warnings.push({
      code: 'BASE_NOT_AT_END',
      message: `"Base" is used as Type but there's also a Variant`,
      guidance: 'When "Base" is used as Type (e.g., Container-Base), there should be no Variant. Consider restructuring.'
    });
  }
  
  return {
    valid: true,
    name,
    segments: parsedSegments,
    componentType,
    errors,
    warnings
  };
}

/**
 * Checks if a string is in PascalCase
 * 
 * Valid PascalCase:
 * - Starts with uppercase letter
 * - No underscores or spaces
 * - Short acronyms (2-3 characters like "CTA", "URL", "API") are valid
 * - Mixed case words like "Button", "Text", "Email" are valid
 * - All uppercase words longer than 3 characters are invalid
 */
export function isPascalCase(str: string): boolean {
  if (str.length === 0) return false;
  
  // Must start with an uppercase letter
  if (!/^[A-Z]/.test(str)) return false;
  
  // Must not contain underscores or spaces
  if (/[_\s]/.test(str)) return false;
  
  // Check if all uppercase
  const isAllUppercase = str === str.toUpperCase();
  
  if (isAllUppercase) {
    // Single character is valid (e.g., "A")
    if (str.length === 1) return true;
    
    // Short acronyms (2-3 characters) are valid (e.g., "CTA", "URL", "API")
    if (str.length <= 3) return true;
    
    // Longer all-uppercase words are invalid (e.g., "INPUT", "TEXT")
    return false;
  }
  
  // Mixed case starting with uppercase is valid PascalCase
  return true;
}

/**
 * Converts a string to PascalCase
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

/**
 * Determines the component type based on parsed segments
 */
export function determineComponentType(
  segments: ComponentNameSegments
): 'primitive' | 'semantic' | 'standalone' {
  // If variant is "Base", it's a primitive
  if (segments.variant === 'Base') {
    return 'primitive';
  }
  
  // If type is "Base" and no variant, it's a primitive (e.g., Container-Base)
  if (segments.type === 'Base' && !segments.variant) {
    return 'primitive';
  }
  
  // If there's a variant that's not "Base", it's semantic
  if (segments.variant && segments.variant !== 'Base') {
    return 'semantic';
  }
  
  // Otherwise it's standalone (e.g., Button-CTA)
  return 'standalone';
}

/**
 * Checks if a component name indicates a primitive (Base) component
 */
export function isPrimitiveComponent(name: string): boolean {
  const result = validateComponentName(name);
  return result.valid && result.componentType === 'primitive';
}

/**
 * Checks if a component name indicates a semantic component
 */
export function isSemanticComponent(name: string): boolean {
  const result = validateComponentName(name);
  return result.valid && result.componentType === 'semantic';
}

/**
 * Suggests a corrected component name based on common mistakes
 */
export function suggestCorrectedName(name: string): string | undefined {
  // Handle camelCase without hyphens
  if (!name.includes('-') && /[a-z][A-Z]/.test(name)) {
    // Split on camelCase boundaries and join with hyphens
    const segments = name
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .split('-')
      .map(s => toPascalCase(s));
    return segments.join('-');
  }
  
  // Handle underscores
  if (name.includes('_')) {
    const segments = name.split('_').map(s => toPascalCase(s));
    return segments.join('-');
  }
  
  // Handle all lowercase with hyphens
  if (name.includes('-') && name === name.toLowerCase()) {
    const segments = name.split('-').map(s => toPascalCase(s));
    return segments.join('-');
  }
  
  // Handle mixed case issues
  if (name.includes('-')) {
    const segments = name.split('-').map(s => toPascalCase(s));
    const corrected = segments.join('-');
    if (corrected !== name) {
      return corrected;
    }
  }
  
  return undefined;
}

/**
 * Validates multiple component names and returns a summary
 */
export function validateComponentNames(names: string[]): {
  results: Map<string, ComponentNameValidationResult>;
  summary: {
    total: number;
    valid: number;
    invalid: number;
    primitives: number;
    semantics: number;
    standalones: number;
    warnings: number;
  };
} {
  const results = new Map<string, ComponentNameValidationResult>();
  let valid = 0;
  let invalid = 0;
  let primitives = 0;
  let semantics = 0;
  let standalones = 0;
  let warnings = 0;
  
  for (const name of names) {
    const result = validateComponentName(name);
    results.set(name, result);
    
    if (result.valid) {
      valid++;
      if (result.componentType === 'primitive') primitives++;
      else if (result.componentType === 'semantic') semantics++;
      else if (result.componentType === 'standalone') standalones++;
    } else {
      invalid++;
    }
    
    warnings += result.warnings.length;
  }
  
  return {
    results,
    summary: {
      total: names.length,
      valid,
      invalid,
      primitives,
      semantics,
      standalones,
      warnings
    }
  };
}

/**
 * Formats validation errors for display
 */
export function formatValidationErrors(result: ComponentNameValidationResult): string {
  if (result.valid && result.errors.length === 0) {
    return `✅ "${result.name}" is valid (${result.componentType})`;
  }
  
  const lines: string[] = [
    `❌ "${result.name}" is invalid:`
  ];
  
  for (const error of result.errors) {
    lines.push(`  • ${error.message}`);
    lines.push(`    → ${error.guidance}`);
  }
  
  if (result.suggestion) {
    lines.push(`  💡 Suggestion: "${result.suggestion}"`);
  }
  
  return lines.join('\n');
}

/**
 * Formats validation warnings for display
 */
export function formatValidationWarnings(result: ComponentNameValidationResult): string {
  if (result.warnings.length === 0) {
    return '';
  }
  
  const lines: string[] = [
    `⚠️ Warnings for "${result.name}":`
  ];
  
  for (const warning of result.warnings) {
    lines.push(`  • ${warning.message}`);
    lines.push(`    → ${warning.guidance}`);
  }
  
  return lines.join('\n');
}
