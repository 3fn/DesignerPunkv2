/**
 * Stemma System Error Guidance System
 * 
 * Provides comprehensive error message templates with correction guidance,
 * links to relevant documentation, and IDE integration for real-time feedback.
 * 
 * Features:
 * - Unified error message templates across all Stemma validators
 * - Documentation links for each error type
 * - IDE-friendly output formats (JSON, plain text, markdown)
 * - Severity levels for prioritization
 * - Quick fix suggestions for common issues
 * 
 * @see .kiro/steering/stemma-system-principles.md
 * @see Requirements: R8 (Health Guardrails and Validation)
 */

import type {
  ComponentNameValidationResult,
  ComponentNameError,
  ComponentNameWarning,
  ComponentNameErrorCode,
  ComponentNameWarningCode,
} from './StemmaComponentNamingValidator';

import type {
  TokenUsageValidationResult,
  TokenUsageError,
  TokenUsageWarning,
  TokenUsageErrorCode,
  TokenUsageWarningCode,
} from './StemmaTokenUsageValidator';

import type {
  PropertyAccessibilityValidationResult,
  PropertyAccessibilityError,
  PropertyAccessibilityWarning,
  PropertyAccessibilityErrorCode,
  PropertyAccessibilityWarningCode,
} from './StemmaPropertyAccessibilityValidator';

// ============================================================================
// Types and Interfaces
// ============================================================================

/**
 * Severity levels for errors and warnings
 */
export type ErrorSeverity = 'error' | 'warning' | 'info' | 'hint';

/**
 * Error category for grouping related errors
 */
export type ErrorCategory = 
  | 'naming'
  | 'token-usage'
  | 'property'
  | 'accessibility'
  | 'schema'
  | 'documentation';


/**
 * Unified error guidance entry
 */
export interface ErrorGuidance {
  /** Unique error code */
  code: string;
  
  /** Error category */
  category: ErrorCategory;
  
  /** Severity level */
  severity: ErrorSeverity;
  
  /** Short title for the error */
  title: string;
  
  /** Detailed description of the error */
  description: string;
  
  /** Step-by-step guidance for fixing the error */
  guidance: string[];
  
  /** Link to relevant documentation */
  documentationLink?: string;
  
  /** Quick fix suggestion (if available) */
  quickFix?: QuickFix;
  
  /** Related error codes */
  relatedCodes?: string[];
  
  /** WCAG reference (for accessibility errors) */
  wcag?: string;
}

/**
 * Quick fix suggestion for IDE integration
 */
export interface QuickFix {
  /** Title of the quick fix */
  title: string;
  
  /** Type of fix */
  type: 'replace' | 'insert' | 'delete' | 'refactor';
  
  /** Suggested replacement text (for replace/insert) */
  replacement?: string;
  
  /** Whether this fix can be applied automatically */
  autoApplicable: boolean;
}

/**
 * IDE diagnostic format (compatible with VS Code, ESLint, etc.)
 */
export interface IDEDiagnostic {
  /** Severity level (1=error, 2=warning, 3=info, 4=hint) */
  severity: 1 | 2 | 3 | 4;
  
  /** Error message */
  message: string;
  
  /** Error code */
  code: string;
  
  /** Source identifier */
  source: string;
  
  /** Start position */
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  
  /** Related information */
  relatedInformation?: Array<{
    location: { uri: string; range: { start: { line: number; character: number }; end: { line: number; character: number } } };
    message: string;
  }>;
  
  /** Quick fix actions */
  codeActions?: Array<{
    title: string;
    kind: string;
    edit?: { changes: Record<string, Array<{ range: { start: { line: number; character: number }; end: { line: number; character: number } }; newText: string }>> };
  }>;
}


/**
 * Aggregated validation result from all validators
 */
export interface AggregatedValidationResult {
  /** Overall validity */
  valid: boolean;
  
  /** All errors grouped by category */
  errors: ErrorGuidance[];
  
  /** All warnings grouped by category */
  warnings: ErrorGuidance[];
  
  /** Summary statistics */
  summary: {
    totalErrors: number;
    totalWarnings: number;
    byCategory: Record<ErrorCategory, { errors: number; warnings: number }>;
  };
  
  /** IDE diagnostics for all issues */
  diagnostics: IDEDiagnostic[];
}

// ============================================================================
// Documentation Links
// ============================================================================

/**
 * Documentation links for error guidance
 */
export const DOCUMENTATION_LINKS = {
  // Stemma System documentation
  STEMMA_PRINCIPLES: '.kiro/steering/stemma-system-principles.md',
  COMPONENT_QUICK_REFERENCE: '.kiro/steering/Component-Quick-Reference.md',
  COMPONENT_DEVELOPMENT_GUIDE: '.kiro/steering/Component-Development-Guide.md',
  
  // Component family documentation
  FORM_INPUTS_COMPONENTS: '.kiro/steering/form-inputs-components.md',
  BUTTON_COMPONENTS: '.kiro/steering/button-components.md',
  CONTAINER_COMPONENTS: '.kiro/steering/container-components.md',
  ICON_COMPONENTS: '.kiro/steering/icon-components.md',
  
  // Token documentation
  TOKEN_QUICK_REFERENCE: '.kiro/steering/Token Quick Reference.md',
  
  // WCAG documentation
  WCAG_GUIDELINES: 'https://www.w3.org/WAI/WCAG21/quickref/',
  
  // MCP query examples
  MCP_QUERY_EXAMPLES: '.kiro/steering/Component-Quick-Reference.md#mcp-query-examples',
} as const;


// ============================================================================
// Error Message Templates
// ============================================================================

/**
 * Error message templates for component naming validation
 */
export const NAMING_ERROR_TEMPLATES: Record<ComponentNameErrorCode, ErrorGuidance> = {
  MISSING_HYPHENS: {
    code: 'MISSING_HYPHENS',
    category: 'naming',
    severity: 'error',
    title: 'Missing Hyphens in Component Name',
    description: 'Component names must use hyphens to separate segments following the [Family]-[Type]-[Variant] pattern.',
    guidance: [
      'Add hyphens between name segments',
      'Use the pattern [Family]-[Type] or [Family]-[Type]-[Variant]',
      'Example: "InputText" should be "Input-Text"',
      'Example: "ButtonCTA" should be "Button-CTA"',
    ],
    documentationLink: DOCUMENTATION_LINKS.STEMMA_PRINCIPLES,
    quickFix: {
      title: 'Convert to hyphenated format',
      type: 'replace',
      autoApplicable: true,
    },
    relatedCodes: ['WRONG_CASE', 'TOO_FEW_SEGMENTS'],
  },
  
  WRONG_CASE: {
    code: 'WRONG_CASE',
    category: 'naming',
    severity: 'error',
    title: 'Incorrect Case in Component Name',
    description: 'Each segment in a component name must use PascalCase (first letter uppercase).',
    guidance: [
      'Capitalize the first letter of each segment',
      'Use PascalCase for each word within a segment',
      'Short acronyms (2-3 chars like CTA, URL) can be all uppercase',
      'Example: "input-text" should be "Input-Text"',
    ],
    documentationLink: DOCUMENTATION_LINKS.STEMMA_PRINCIPLES,
    quickFix: {
      title: 'Convert to PascalCase',
      type: 'replace',
      autoApplicable: true,
    },
  },
  
  TOO_MANY_SEGMENTS: {
    code: 'TOO_MANY_SEGMENTS',
    category: 'naming',
    severity: 'error',
    title: 'Too Many Segments in Component Name',
    description: 'Component names should have 2-3 segments maximum: [Family]-[Type] or [Family]-[Type]-[Variant].',
    guidance: [
      'Simplify the component name to 2-3 segments',
      'Consider if some segments can be combined',
      'Use the variant segment for specialization, not additional hierarchy',
      'Example: "Input-Text-Email-Validation" should be "Input-Text-Email"',
    ],
    documentationLink: DOCUMENTATION_LINKS.STEMMA_PRINCIPLES,
  },
  
  TOO_FEW_SEGMENTS: {
    code: 'TOO_FEW_SEGMENTS',
    category: 'naming',
    severity: 'error',
    title: 'Too Few Segments in Component Name',
    description: 'Component names must have at least 2 segments: [Family]-[Type].',
    guidance: [
      'Add a type segment to identify the component role',
      'Use [Family]-[Type] for standalone components',
      'Use [Family]-Base for primitive/foundational components',
      'Example: "Input" should be "Input-Text" or "Input-Base"',
    ],
    documentationLink: DOCUMENTATION_LINKS.STEMMA_PRINCIPLES,
  },

  
  INVALID_SEGMENT_FORMAT: {
    code: 'INVALID_SEGMENT_FORMAT',
    category: 'naming',
    severity: 'error',
    title: 'Invalid Segment Format',
    description: 'One or more segments in the component name have an invalid format.',
    guidance: [
      'Ensure each segment contains only letters and numbers',
      'Start each segment with an uppercase letter',
      'Avoid special characters except hyphens between segments',
    ],
    documentationLink: DOCUMENTATION_LINKS.STEMMA_PRINCIPLES,
  },
  
  RESERVED_KEYWORD_MISUSE: {
    code: 'RESERVED_KEYWORD_MISUSE',
    category: 'naming',
    severity: 'error',
    title: 'Reserved Keyword Misuse',
    description: 'A reserved keyword is being used incorrectly in the component name.',
    guidance: [
      'Use "Base" for foundational/primitive components',
      'Avoid using "Abstract", "Core", or "Default" as they are reserved',
      'Example: Use "Container-Base" instead of "Container-Abstract"',
    ],
    documentationLink: DOCUMENTATION_LINKS.STEMMA_PRINCIPLES,
    quickFix: {
      title: 'Replace with "Base"',
      type: 'replace',
      replacement: 'Base',
      autoApplicable: true,
    },
  },
  
  EMPTY_SEGMENT: {
    code: 'EMPTY_SEGMENT',
    category: 'naming',
    severity: 'error',
    title: 'Empty Segment in Component Name',
    description: 'Component name contains empty segments (consecutive hyphens or empty string).',
    guidance: [
      'Remove consecutive hyphens',
      'Ensure each segment has at least one character',
      'Example: "Input--Text" should be "Input-Text"',
    ],
    documentationLink: DOCUMENTATION_LINKS.STEMMA_PRINCIPLES,
    quickFix: {
      title: 'Remove empty segments',
      type: 'replace',
      autoApplicable: true,
    },
  },
  
  INVALID_CHARACTERS: {
    code: 'INVALID_CHARACTERS',
    category: 'naming',
    severity: 'error',
    title: 'Invalid Characters in Component Name',
    description: 'Component name contains characters that are not allowed.',
    guidance: [
      'Use only letters (a-z, A-Z), numbers (0-9), and hyphens (-)',
      'Remove underscores, spaces, and special characters',
      'Example: "Input_Text" should be "Input-Text"',
    ],
    documentationLink: DOCUMENTATION_LINKS.STEMMA_PRINCIPLES,
    quickFix: {
      title: 'Replace invalid characters',
      type: 'replace',
      autoApplicable: true,
    },
  },
};


/**
 * Warning message templates for component naming validation
 */
export const NAMING_WARNING_TEMPLATES: Record<ComponentNameWarningCode, ErrorGuidance> = {
  BASE_NOT_AT_END: {
    code: 'BASE_NOT_AT_END',
    category: 'naming',
    severity: 'warning',
    title: '"Base" Used Incorrectly',
    description: '"Base" is used as Type but there is also a Variant segment.',
    guidance: [
      'When using "Base" as Type, there should be no Variant',
      'Consider restructuring: [Family]-Base or [Family]-[Type]-[Variant]',
      'Example: "Container-Base-Large" should be "Container-Large" or "Container-Base"',
    ],
    documentationLink: DOCUMENTATION_LINKS.STEMMA_PRINCIPLES,
  },
  
  UNUSUAL_FAMILY_NAME: {
    code: 'UNUSUAL_FAMILY_NAME',
    category: 'naming',
    severity: 'warning',
    title: 'Unknown Component Family',
    description: 'The family name is not in the list of known Stemma System families.',
    guidance: [
      'Known families: Input, Button, Container, Icon, Modal, Avatar, Badge, DataDisplay, Divider, Loading, Nav',
      'If this is a new family, ensure it is documented in the Component Quick Reference',
      'Consider if the component belongs to an existing family',
    ],
    documentationLink: DOCUMENTATION_LINKS.COMPONENT_QUICK_REFERENCE,
  },
  
  LONG_SEGMENT_NAME: {
    code: 'LONG_SEGMENT_NAME',
    category: 'naming',
    severity: 'warning',
    title: 'Long Segment Name',
    description: 'A segment in the component name is unusually long (over 20 characters).',
    guidance: [
      'Consider using a shorter, more concise name',
      'Long names can be harder to read and type',
      'Abbreviations are acceptable if they are well-known (e.g., CTA, URL)',
    ],
    documentationLink: DOCUMENTATION_LINKS.STEMMA_PRINCIPLES,
  },
};


/**
 * Error message templates for token usage validation
 */
export const TOKEN_USAGE_ERROR_TEMPLATES: Record<TokenUsageErrorCode, ErrorGuidance> = {
  INLINE_STYLE_COLOR: {
    code: 'INLINE_STYLE_COLOR',
    category: 'token-usage',
    severity: 'error',
    title: 'Inline Color Style Detected',
    description: 'A hardcoded color value was found instead of a design token reference.',
    guidance: [
      'Replace inline color with a semantic color token',
      'Use tokens like color.primary, color.text.default, color.background',
      'For state colors, use blend tokens like blend.hoverDarker',
      'Query MCP for available color tokens: get_section("Token Quick Reference.md", "Color Tokens")',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
    quickFix: {
      title: 'Replace with color token',
      type: 'replace',
      autoApplicable: false,
    },
  },
  
  INLINE_STYLE_SPACING: {
    code: 'INLINE_STYLE_SPACING',
    category: 'token-usage',
    severity: 'error',
    title: 'Inline Spacing Style Detected',
    description: 'A hardcoded spacing value was found instead of a design token reference.',
    guidance: [
      'Replace inline spacing with a semantic spacing token',
      'Use tokens like space.inset.100, space.inline.150, space.grouped.tight',
      'Spacing tokens follow the 8px baseline grid',
      'Query MCP for available spacing tokens: get_section("Token Quick Reference.md", "Spacing Tokens")',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
    quickFix: {
      title: 'Replace with spacing token',
      type: 'replace',
      autoApplicable: false,
    },
  },
  
  INLINE_STYLE_TYPOGRAPHY: {
    code: 'INLINE_STYLE_TYPOGRAPHY',
    category: 'token-usage',
    severity: 'error',
    title: 'Inline Typography Style Detected',
    description: 'A hardcoded typography value was found instead of a design token reference.',
    guidance: [
      'Replace inline typography with a semantic typography token',
      'Use tokens like typography.body, typography.labelMd, typography.heading',
      'Typography tokens include fontSize, lineHeight, fontWeight, and letterSpacing',
      'Query MCP for available typography tokens: get_section("Token Quick Reference.md", "Typography Tokens")',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
    quickFix: {
      title: 'Replace with typography token',
      type: 'replace',
      autoApplicable: false,
    },
  },
  
  INLINE_STYLE_BORDER: {
    code: 'INLINE_STYLE_BORDER',
    category: 'token-usage',
    severity: 'error',
    title: 'Inline Border Style Detected',
    description: 'A hardcoded border value was found instead of a design token reference.',
    guidance: [
      'Replace inline border with a semantic border token',
      'Use tokens like border.default, radius.100, radius.150',
      'Border radius tokens follow the spacing scale',
      'Query MCP for available border tokens: get_section("Token Quick Reference.md", "Border Tokens")',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
    quickFix: {
      title: 'Replace with border token',
      type: 'replace',
      autoApplicable: false,
    },
  },

  
  HARDCODED_COLOR: {
    code: 'HARDCODED_COLOR',
    category: 'token-usage',
    severity: 'error',
    title: 'Hardcoded Color Value',
    description: 'A hex or RGB color value was found that should use a design token.',
    guidance: [
      'Replace hardcoded color with a semantic color token',
      'Semantic tokens ensure consistency across themes and platforms',
      'Example: Replace "#FF0000" with color.error or color.danger',
      'Query MCP for color token mapping: get_document_full("Token Quick Reference.md")',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
    quickFix: {
      title: 'Replace with semantic color token',
      type: 'replace',
      autoApplicable: false,
    },
  },
  
  HARDCODED_SPACING: {
    code: 'HARDCODED_SPACING',
    category: 'token-usage',
    severity: 'error',
    title: 'Hardcoded Spacing Value',
    description: 'A pixel or rem spacing value was found that should use a design token.',
    guidance: [
      'Replace hardcoded spacing with a semantic spacing token',
      'Spacing tokens ensure consistent rhythm across the design system',
      'Example: Replace "16px" with space.inset.200',
      'Query MCP for spacing token mapping: get_section("Token Quick Reference.md", "Spacing Tokens")',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
    quickFix: {
      title: 'Replace with spacing token',
      type: 'replace',
      autoApplicable: false,
    },
  },
  
  HARDCODED_FONT_SIZE: {
    code: 'HARDCODED_FONT_SIZE',
    category: 'token-usage',
    severity: 'error',
    title: 'Hardcoded Font Size',
    description: 'A hardcoded font size was found that should use a typography token.',
    guidance: [
      'Replace hardcoded font size with a typography token',
      'Typography tokens include fontSize as part of a complete type style',
      'Example: Replace "14px" with typography.bodySm',
      'Query MCP for typography tokens: get_section("Token Quick Reference.md", "Typography Tokens")',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
    quickFix: {
      title: 'Replace with typography token',
      type: 'replace',
      autoApplicable: false,
    },
  },
  
  HARDCODED_BORDER_RADIUS: {
    code: 'HARDCODED_BORDER_RADIUS',
    category: 'token-usage',
    severity: 'error',
    title: 'Hardcoded Border Radius',
    description: 'A hardcoded border radius was found that should use a radius token.',
    guidance: [
      'Replace hardcoded border radius with a radius token',
      'Radius tokens ensure consistent corner rounding',
      'Example: Replace "8px" with radius.100',
      'Query MCP for radius tokens: get_section("Token Quick Reference.md", "Border Tokens")',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
    quickFix: {
      title: 'Replace with radius token',
      type: 'replace',
      autoApplicable: false,
    },
  },
  
  MISSING_REQUIRED_TOKEN: {
    code: 'MISSING_REQUIRED_TOKEN',
    category: 'token-usage',
    severity: 'error',
    title: 'Missing Required Token',
    description: 'A token required by the component schema is not being used.',
    guidance: [
      'Check the component schema for required tokens',
      'Ensure all required tokens are referenced in the implementation',
      'Required tokens are defined in the component\'s .schema.yaml file',
      'Query MCP for component schema: get_document_full("[component]-components.md")',
    ],
    documentationLink: DOCUMENTATION_LINKS.COMPONENT_DEVELOPMENT_GUIDE,
  },
  
  INVALID_TOKEN_REFERENCE: {
    code: 'INVALID_TOKEN_REFERENCE',
    category: 'token-usage',
    severity: 'error',
    title: 'Invalid Token Reference',
    description: 'A token reference was found that does not match any known token.',
    guidance: [
      'Verify the token name is spelled correctly',
      'Check that the token exists in the design system',
      'Use the Token Quick Reference to find valid token names',
      'Query MCP for available tokens: get_documentation_map()',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
  },
};


/**
 * Warning message templates for token usage validation
 */
export const TOKEN_USAGE_WARNING_TEMPLATES: Record<TokenUsageWarningCode, ErrorGuidance> = {
  OPACITY_WORKAROUND: {
    code: 'OPACITY_WORKAROUND',
    category: 'token-usage',
    severity: 'warning',
    title: 'Opacity Workaround Detected',
    description: 'An opacity value is being used that may be a workaround for state colors.',
    guidance: [
      'Consider using blend tokens instead of opacity for state colors',
      'Blend tokens like blend.hoverDarker provide consistent state styling',
      'Opacity workarounds can cause accessibility issues with contrast',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
  },
  
  FILTERBRIGHTNESS_WORKAROUND: {
    code: 'FILTERBRIGHTNESS_WORKAROUND',
    category: 'token-usage',
    severity: 'warning',
    title: 'Filter Brightness Workaround Detected',
    description: 'A CSS filter brightness is being used that may be a workaround for state colors.',
    guidance: [
      'Consider using blend tokens instead of filter brightness',
      'Blend tokens provide more predictable color transformations',
      'Filter brightness can cause unexpected results on different backgrounds',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
  },
  
  SCALEEFFECT_WORKAROUND: {
    code: 'SCALEEFFECT_WORKAROUND',
    category: 'token-usage',
    severity: 'warning',
    title: 'Scale Effect Workaround Detected',
    description: 'A SwiftUI scaleEffect is being used that may be a workaround for pressed states.',
    guidance: [
      'Consider using blend tokens for pressed state styling',
      'Scale effects can cause layout shifts and accessibility issues',
      'Blend tokens provide consistent pressed state appearance',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
  },
  
  RIPPLE_WORKAROUND: {
    code: 'RIPPLE_WORKAROUND',
    category: 'token-usage',
    severity: 'warning',
    title: 'Ripple Workaround Detected',
    description: 'A Jetpack Compose ripple is being used that may need blend token integration.',
    guidance: [
      'Ensure ripple colors use blend tokens for consistency',
      'Blend tokens can be applied to ripple effects for state colors',
      'Consider the interaction between ripple and blend tokens',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
  },
  
  MAGIC_NUMBER: {
    code: 'MAGIC_NUMBER',
    category: 'token-usage',
    severity: 'warning',
    title: 'Magic Number Detected',
    description: 'A numeric value was found that may be a magic number.',
    guidance: [
      'Consider if this value should be a design token',
      'Magic numbers make maintenance difficult',
      'If the value is intentional, add a comment explaining why',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
  },
  
  UNKNOWN_TOKEN_PATTERN: {
    code: 'UNKNOWN_TOKEN_PATTERN',
    category: 'token-usage',
    severity: 'warning',
    title: 'Unknown Token Pattern',
    description: 'A token-like pattern was found that does not match known token formats.',
    guidance: [
      'Verify the token reference format is correct',
      'Check the Token Quick Reference for valid token patterns',
      'Ensure the token exists in the design system',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
  },
  
  DEPRECATED_TOKEN: {
    code: 'DEPRECATED_TOKEN',
    category: 'token-usage',
    severity: 'warning',
    title: 'Deprecated Token Usage',
    description: 'A deprecated token is being used that should be replaced.',
    guidance: [
      'Check the Token Quick Reference for the replacement token',
      'Deprecated tokens may be removed in future versions',
      'Update to the recommended replacement token',
    ],
    documentationLink: DOCUMENTATION_LINKS.TOKEN_QUICK_REFERENCE,
  },
};


/**
 * Error message templates for property and accessibility validation
 */
export const PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES: Record<PropertyAccessibilityErrorCode, ErrorGuidance> = {
  MISSING_REQUIRED_PROPERTY: {
    code: 'MISSING_REQUIRED_PROPERTY',
    category: 'property',
    severity: 'error',
    title: 'Missing Required Property',
    description: 'A required property is not provided for the component.',
    guidance: [
      'Check the component schema for required properties',
      'Add the missing property with an appropriate value',
      'Required properties are marked with "required: true" in the schema',
      'Query MCP for component schema: get_document_full("[family]-components.md")',
    ],
    documentationLink: DOCUMENTATION_LINKS.COMPONENT_DEVELOPMENT_GUIDE,
  },
  
  INVALID_PROPERTY_TYPE: {
    code: 'INVALID_PROPERTY_TYPE',
    category: 'property',
    severity: 'error',
    title: 'Invalid Property Type',
    description: 'A property value has the wrong type.',
    guidance: [
      'Check the expected type in the component schema',
      'Convert the value to the correct type',
      'Common types: string, boolean, number',
    ],
    documentationLink: DOCUMENTATION_LINKS.COMPONENT_DEVELOPMENT_GUIDE,
  },
  
  INVALID_PROPERTY_VALUE: {
    code: 'INVALID_PROPERTY_VALUE',
    category: 'property',
    severity: 'error',
    title: 'Invalid Property Value',
    description: 'A property value is not in the allowed set of values.',
    guidance: [
      'Check the allowed values in the component schema',
      'Use one of the valid options',
      'Union types list all allowed values',
    ],
    documentationLink: DOCUMENTATION_LINKS.COMPONENT_DEVELOPMENT_GUIDE,
  },
  
  MISSING_ACCESSIBILITY_LABEL: {
    code: 'MISSING_ACCESSIBILITY_LABEL',
    category: 'accessibility',
    severity: 'error',
    title: 'Missing Accessibility Label',
    description: 'An interactive component is missing an accessibility label.',
    guidance: [
      'Add a "label" property for visible labels',
      'Add "accessibilityLabel" for screen reader only labels',
      'All interactive elements must have accessible names (WCAG 4.1.2)',
      'For icon-only buttons, use accessibilityLabel to describe the action',
    ],
    documentationLink: DOCUMENTATION_LINKS.WCAG_GUIDELINES,
    wcag: '4.1.2',
  },
  
  MISSING_FOCUS_INDICATOR: {
    code: 'MISSING_FOCUS_INDICATOR',
    category: 'accessibility',
    severity: 'error',
    title: 'Missing Focus Indicator',
    description: 'An interactive component does not have a visible focus indicator.',
    guidance: [
      'Ensure the component has a visible focus ring',
      'Use focus ring tokens for consistent styling',
      'Focus indicators must be visible (WCAG 2.4.7)',
      'Test with keyboard navigation to verify focus visibility',
    ],
    documentationLink: DOCUMENTATION_LINKS.WCAG_GUIDELINES,
    wcag: '2.4.7',
  },

  
  INSUFFICIENT_TOUCH_TARGET: {
    code: 'INSUFFICIENT_TOUCH_TARGET',
    category: 'accessibility',
    severity: 'error',
    title: 'Insufficient Touch Target Size',
    description: 'The touch target size is below the minimum required for accessibility.',
    guidance: [
      'Increase the touch target to at least 24x24 CSS pixels (WCAG 2.5.8)',
      'Recommended size is 44x44 CSS pixels (WCAG 2.5.5)',
      'iOS Human Interface Guidelines recommend 48x48 points',
      'Use padding to increase touch target without changing visual size',
    ],
    documentationLink: DOCUMENTATION_LINKS.WCAG_GUIDELINES,
    wcag: '2.5.8',
  },
  
  MISSING_ERROR_IDENTIFICATION: {
    code: 'MISSING_ERROR_IDENTIFICATION',
    category: 'accessibility',
    severity: 'error',
    title: 'Missing Error Identification',
    description: 'Form input errors are not properly identified to users.',
    guidance: [
      'Add error message support to form inputs',
      'Use aria-invalid and aria-describedby for error states',
      'Error messages must be programmatically associated (WCAG 3.3.1)',
      'Provide clear, specific error messages',
    ],
    documentationLink: DOCUMENTATION_LINKS.WCAG_GUIDELINES,
    wcag: '3.3.1',
  },
  
  MISSING_KEYBOARD_SUPPORT: {
    code: 'MISSING_KEYBOARD_SUPPORT',
    category: 'accessibility',
    severity: 'error',
    title: 'Missing Keyboard Support',
    description: 'An interactive component cannot be operated with keyboard.',
    guidance: [
      'Ensure the component is focusable (tabindex)',
      'Add keyboard event handlers for activation',
      'All functionality must be keyboard accessible (WCAG 2.1.1)',
      'Test with Tab, Enter, Space, and arrow keys',
    ],
    documentationLink: DOCUMENTATION_LINKS.WCAG_GUIDELINES,
    wcag: '2.1.1',
  },
  
  SCHEMA_NOT_FOUND: {
    code: 'SCHEMA_NOT_FOUND',
    category: 'schema',
    severity: 'error',
    title: 'Component Schema Not Found',
    description: 'The component schema file could not be found.',
    guidance: [
      'Ensure the schema file exists at the expected path',
      'Schema files should be named [Component-Name].schema.yaml',
      'Schema files should be in the component directory',
      'Create a schema file following the Stemma System template',
    ],
    documentationLink: DOCUMENTATION_LINKS.STEMMA_PRINCIPLES,
  },
  
  SCHEMA_PARSE_ERROR: {
    code: 'SCHEMA_PARSE_ERROR',
    category: 'schema',
    severity: 'error',
    title: 'Schema Parse Error',
    description: 'The component schema file could not be parsed.',
    guidance: [
      'Check the schema file for YAML syntax errors',
      'Ensure proper indentation (2 spaces)',
      'Verify all required fields are present',
      'Use a YAML validator to check syntax',
    ],
    documentationLink: DOCUMENTATION_LINKS.STEMMA_PRINCIPLES,
  },
};


/**
 * Warning message templates for property and accessibility validation
 */
export const PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES: Record<PropertyAccessibilityWarningCode, ErrorGuidance> = {
  OPTIONAL_PROPERTY_MISSING: {
    code: 'OPTIONAL_PROPERTY_MISSING',
    category: 'property',
    severity: 'info',
    title: 'Optional Property Not Set',
    description: 'An optional property that could improve the component is not set.',
    guidance: [
      'Consider adding this property for better functionality',
      'Optional properties enhance but are not required',
      'Check the component schema for property descriptions',
    ],
    documentationLink: DOCUMENTATION_LINKS.COMPONENT_DEVELOPMENT_GUIDE,
  },
  
  DEPRECATED_PROPERTY: {
    code: 'DEPRECATED_PROPERTY',
    category: 'property',
    severity: 'warning',
    title: 'Deprecated Property Usage',
    description: 'A deprecated property is being used.',
    guidance: [
      'Check the component schema for the replacement property',
      'Deprecated properties may be removed in future versions',
      'Update to the recommended replacement',
    ],
    documentationLink: DOCUMENTATION_LINKS.COMPONENT_DEVELOPMENT_GUIDE,
  },
  
  ACCESSIBILITY_ENHANCEMENT_AVAILABLE: {
    code: 'ACCESSIBILITY_ENHANCEMENT_AVAILABLE',
    category: 'accessibility',
    severity: 'info',
    title: 'Accessibility Enhancement Available',
    description: 'An accessibility enhancement is available for this component.',
    guidance: [
      'Consider adding the suggested accessibility feature',
      'Enhancements improve the experience for all users',
      'Check WCAG guidelines for best practices',
    ],
    documentationLink: DOCUMENTATION_LINKS.WCAG_GUIDELINES,
  },
  
  TOUCH_TARGET_SUBOPTIMAL: {
    code: 'TOUCH_TARGET_SUBOPTIMAL',
    category: 'accessibility',
    severity: 'warning',
    title: 'Touch Target Size Suboptimal',
    description: 'The touch target size meets minimum but is below recommended size.',
    guidance: [
      'Consider increasing to 44x44 CSS pixels (WCAG 2.5.5)',
      'Larger touch targets improve usability for all users',
      'iOS Human Interface Guidelines recommend 48x48 points',
    ],
    documentationLink: DOCUMENTATION_LINKS.WCAG_GUIDELINES,
    wcag: '2.5.5',
  },
  
  MISSING_HELPER_TEXT: {
    code: 'MISSING_HELPER_TEXT',
    category: 'accessibility',
    severity: 'info',
    title: 'Missing Helper Text',
    description: 'Form input could benefit from helper text.',
    guidance: [
      'Consider adding helper text to guide users',
      'Helper text improves form completion rates',
      'Use aria-describedby to associate helper text',
    ],
    documentationLink: DOCUMENTATION_LINKS.WCAG_GUIDELINES,
    wcag: '3.3.2',
  },
};


// ============================================================================
// Core Functions
// ============================================================================

/**
 * Get error guidance for a specific error code
 */
export function getErrorGuidance(code: string): ErrorGuidance | undefined {
  // Check naming errors
  if (code in NAMING_ERROR_TEMPLATES) {
    return NAMING_ERROR_TEMPLATES[code as ComponentNameErrorCode];
  }
  
  // Check naming warnings
  if (code in NAMING_WARNING_TEMPLATES) {
    return NAMING_WARNING_TEMPLATES[code as ComponentNameWarningCode];
  }
  
  // Check token usage errors
  if (code in TOKEN_USAGE_ERROR_TEMPLATES) {
    return TOKEN_USAGE_ERROR_TEMPLATES[code as TokenUsageErrorCode];
  }
  
  // Check token usage warnings
  if (code in TOKEN_USAGE_WARNING_TEMPLATES) {
    return TOKEN_USAGE_WARNING_TEMPLATES[code as TokenUsageWarningCode];
  }
  
  // Check property/accessibility errors
  if (code in PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES) {
    return PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES[code as PropertyAccessibilityErrorCode];
  }
  
  // Check property/accessibility warnings
  if (code in PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES) {
    return PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES[code as PropertyAccessibilityWarningCode];
  }
  
  return undefined;
}

/**
 * Get all error guidance entries for a category
 */
export function getGuidanceByCategory(category: ErrorCategory): ErrorGuidance[] {
  const allGuidance: ErrorGuidance[] = [
    ...Object.values(NAMING_ERROR_TEMPLATES),
    ...Object.values(NAMING_WARNING_TEMPLATES),
    ...Object.values(TOKEN_USAGE_ERROR_TEMPLATES),
    ...Object.values(TOKEN_USAGE_WARNING_TEMPLATES),
    ...Object.values(PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES),
    ...Object.values(PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES),
  ];
  
  return allGuidance.filter(g => g.category === category);
}

/**
 * Get all error guidance entries for a severity level
 */
export function getGuidanceBySeverity(severity: ErrorSeverity): ErrorGuidance[] {
  const allGuidance: ErrorGuidance[] = [
    ...Object.values(NAMING_ERROR_TEMPLATES),
    ...Object.values(NAMING_WARNING_TEMPLATES),
    ...Object.values(TOKEN_USAGE_ERROR_TEMPLATES),
    ...Object.values(TOKEN_USAGE_WARNING_TEMPLATES),
    ...Object.values(PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES),
    ...Object.values(PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES),
  ];
  
  return allGuidance.filter(g => g.severity === severity);
}


/**
 * Convert severity to IDE diagnostic severity number
 */
function severityToNumber(severity: ErrorSeverity): 1 | 2 | 3 | 4 {
  switch (severity) {
    case 'error': return 1;
    case 'warning': return 2;
    case 'info': return 3;
    case 'hint': return 4;
    default: return 1;
  }
}

/**
 * Create an IDE diagnostic from an error guidance entry
 */
export function createIDEDiagnostic(
  guidance: ErrorGuidance,
  filePath: string,
  line: number = 1,
  column: number = 1,
  endLine?: number,
  endColumn?: number
): IDEDiagnostic {
  const diagnostic: IDEDiagnostic = {
    severity: severityToNumber(guidance.severity),
    message: `${guidance.title}: ${guidance.description}`,
    code: guidance.code,
    source: 'stemma-system',
    range: {
      start: { line: line - 1, character: column - 1 },
      end: { line: (endLine || line) - 1, character: (endColumn || column + 10) - 1 },
    },
  };
  
  // Add related information if documentation link exists
  if (guidance.documentationLink) {
    diagnostic.relatedInformation = [{
      location: {
        uri: guidance.documentationLink,
        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
      },
      message: `See documentation: ${guidance.documentationLink}`,
    }];
  }
  
  // Add quick fix if available
  if (guidance.quickFix && guidance.quickFix.autoApplicable) {
    diagnostic.codeActions = [{
      title: guidance.quickFix.title,
      kind: 'quickfix',
    }];
  }
  
  return diagnostic;
}


/**
 * Convert component naming validation result to error guidance
 */
export function convertNamingResultToGuidance(
  result: ComponentNameValidationResult
): { errors: ErrorGuidance[]; warnings: ErrorGuidance[] } {
  const errors: ErrorGuidance[] = [];
  const warnings: ErrorGuidance[] = [];
  
  for (const error of result.errors) {
    const template = NAMING_ERROR_TEMPLATES[error.code];
    if (template) {
      errors.push({
        ...template,
        description: error.message,
        guidance: [error.guidance, ...template.guidance.slice(1)],
      });
    }
  }
  
  for (const warning of result.warnings) {
    const template = NAMING_WARNING_TEMPLATES[warning.code];
    if (template) {
      warnings.push({
        ...template,
        description: warning.message,
        guidance: [warning.guidance, ...template.guidance.slice(1)],
      });
    }
  }
  
  return { errors, warnings };
}

/**
 * Convert token usage validation result to error guidance
 */
export function convertTokenUsageResultToGuidance(
  result: TokenUsageValidationResult
): { errors: ErrorGuidance[]; warnings: ErrorGuidance[] } {
  const errors: ErrorGuidance[] = [];
  const warnings: ErrorGuidance[] = [];
  
  for (const error of result.errors) {
    const template = TOKEN_USAGE_ERROR_TEMPLATES[error.code];
    if (template) {
      errors.push({
        ...template,
        description: error.message,
        guidance: [error.guidance, ...template.guidance.slice(1)],
      });
    }
  }
  
  for (const warning of result.warnings) {
    const template = TOKEN_USAGE_WARNING_TEMPLATES[warning.code];
    if (template) {
      warnings.push({
        ...template,
        description: warning.message,
        guidance: [warning.guidance, ...template.guidance.slice(1)],
      });
    }
  }
  
  return { errors, warnings };
}

/**
 * Convert property/accessibility validation result to error guidance
 */
export function convertPropertyAccessibilityResultToGuidance(
  result: PropertyAccessibilityValidationResult
): { errors: ErrorGuidance[]; warnings: ErrorGuidance[] } {
  const errors: ErrorGuidance[] = [];
  const warnings: ErrorGuidance[] = [];
  
  for (const error of result.errors) {
    const template = PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES[error.code];
    if (template) {
      errors.push({
        ...template,
        description: error.message,
        guidance: [error.guidance, ...template.guidance.slice(1)],
      });
    }
  }
  
  for (const warning of result.warnings) {
    const template = PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES[warning.code];
    if (template) {
      warnings.push({
        ...template,
        description: warning.message,
        guidance: [warning.guidance, ...template.guidance.slice(1)],
      });
    }
  }
  
  return { errors, warnings };
}


/**
 * Aggregate validation results from all validators
 */
export function aggregateValidationResults(
  namingResult?: ComponentNameValidationResult,
  tokenUsageResult?: TokenUsageValidationResult,
  propertyAccessibilityResult?: PropertyAccessibilityValidationResult
): AggregatedValidationResult {
  const allErrors: ErrorGuidance[] = [];
  const allWarnings: ErrorGuidance[] = [];
  const diagnostics: IDEDiagnostic[] = [];
  
  const byCategory: Record<ErrorCategory, { errors: number; warnings: number }> = {
    naming: { errors: 0, warnings: 0 },
    'token-usage': { errors: 0, warnings: 0 },
    property: { errors: 0, warnings: 0 },
    accessibility: { errors: 0, warnings: 0 },
    schema: { errors: 0, warnings: 0 },
    documentation: { errors: 0, warnings: 0 },
  };
  
  // Process naming results
  if (namingResult) {
    const { errors, warnings } = convertNamingResultToGuidance(namingResult);
    allErrors.push(...errors);
    allWarnings.push(...warnings);
    byCategory.naming.errors += errors.length;
    byCategory.naming.warnings += warnings.length;
    
    // Create diagnostics
    for (const error of errors) {
      diagnostics.push(createIDEDiagnostic(error, namingResult.name));
    }
    for (const warning of warnings) {
      diagnostics.push(createIDEDiagnostic(warning, namingResult.name));
    }
  }
  
  // Process token usage results
  if (tokenUsageResult) {
    const { errors, warnings } = convertTokenUsageResultToGuidance(tokenUsageResult);
    allErrors.push(...errors);
    allWarnings.push(...warnings);
    byCategory['token-usage'].errors += errors.length;
    byCategory['token-usage'].warnings += warnings.length;
    
    // Create diagnostics with line numbers
    for (let i = 0; i < tokenUsageResult.errors.length; i++) {
      const error = tokenUsageResult.errors[i];
      const guidance = errors[i];
      if (guidance) {
        diagnostics.push(createIDEDiagnostic(
          guidance,
          tokenUsageResult.filePath,
          error.line,
          error.column || 1
        ));
      }
    }
    for (let i = 0; i < tokenUsageResult.warnings.length; i++) {
      const warning = tokenUsageResult.warnings[i];
      const guidance = warnings[i];
      if (guidance) {
        diagnostics.push(createIDEDiagnostic(
          guidance,
          tokenUsageResult.filePath,
          warning.line
        ));
      }
    }
  }
  
  // Process property/accessibility results
  if (propertyAccessibilityResult) {
    const { errors, warnings } = convertPropertyAccessibilityResultToGuidance(propertyAccessibilityResult);
    allErrors.push(...errors);
    allWarnings.push(...warnings);
    
    // Categorize by type
    for (const error of errors) {
      if (error.category === 'accessibility') {
        byCategory.accessibility.errors++;
      } else if (error.category === 'schema') {
        byCategory.schema.errors++;
      } else {
        byCategory.property.errors++;
      }
    }
    for (const warning of warnings) {
      if (warning.category === 'accessibility') {
        byCategory.accessibility.warnings++;
      } else {
        byCategory.property.warnings++;
      }
    }
    
    // Create diagnostics
    for (const error of errors) {
      diagnostics.push(createIDEDiagnostic(error, propertyAccessibilityResult.componentName));
    }
    for (const warning of warnings) {
      diagnostics.push(createIDEDiagnostic(warning, propertyAccessibilityResult.componentName));
    }
  }
  
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    summary: {
      totalErrors: allErrors.length,
      totalWarnings: allWarnings.length,
      byCategory,
    },
    diagnostics,
  };
}


// ============================================================================
// Formatting Functions
// ============================================================================

/**
 * Format error guidance for console output
 */
export function formatErrorGuidanceForConsole(guidance: ErrorGuidance): string {
  const icon = guidance.severity === 'error' ? '❌' :
               guidance.severity === 'warning' ? '⚠️' :
               guidance.severity === 'info' ? 'ℹ️' : '💡';
  
  const lines: string[] = [
    `${icon} ${guidance.title} [${guidance.code}]`,
    `   ${guidance.description}`,
    '',
    '   How to fix:',
  ];
  
  for (const step of guidance.guidance) {
    lines.push(`   • ${step}`);
  }
  
  if (guidance.documentationLink) {
    lines.push('');
    lines.push(`   📚 Documentation: ${guidance.documentationLink}`);
  }
  
  if (guidance.wcag) {
    lines.push(`   ♿ WCAG: ${guidance.wcag}`);
  }
  
  if (guidance.quickFix) {
    lines.push('');
    lines.push(`   💡 Quick fix: ${guidance.quickFix.title}`);
  }
  
  return lines.join('\n');
}

/**
 * Format error guidance for markdown output
 */
export function formatErrorGuidanceForMarkdown(guidance: ErrorGuidance): string {
  const icon = guidance.severity === 'error' ? '❌' :
               guidance.severity === 'warning' ? '⚠️' :
               guidance.severity === 'info' ? 'ℹ️' : '💡';
  
  const lines: string[] = [
    `### ${icon} ${guidance.title}`,
    '',
    `**Code:** \`${guidance.code}\``,
    '',
    guidance.description,
    '',
    '**How to fix:**',
    '',
  ];
  
  for (const step of guidance.guidance) {
    lines.push(`- ${step}`);
  }
  
  if (guidance.documentationLink) {
    lines.push('');
    lines.push(`**Documentation:** [${guidance.documentationLink}](${guidance.documentationLink})`);
  }
  
  if (guidance.wcag) {
    lines.push('');
    lines.push(`**WCAG Reference:** ${guidance.wcag}`);
  }
  
  if (guidance.quickFix) {
    lines.push('');
    lines.push(`**Quick Fix:** ${guidance.quickFix.title}`);
  }
  
  return lines.join('\n');
}

/**
 * Format error guidance for JSON output (IDE integration)
 */
export function formatErrorGuidanceForJSON(guidance: ErrorGuidance): string {
  return JSON.stringify(guidance, null, 2);
}


/**
 * Format aggregated validation result for console output
 */
export function formatAggregatedResultForConsole(result: AggregatedValidationResult): string {
  const lines: string[] = [];
  
  // Header
  if (result.valid) {
    lines.push('✅ All validations passed!');
  } else {
    lines.push(`❌ Validation failed: ${result.summary.totalErrors} error(s), ${result.summary.totalWarnings} warning(s)`);
  }
  lines.push('');
  
  // Summary by category
  lines.push('Summary by category:');
  for (const [category, counts] of Object.entries(result.summary.byCategory)) {
    if (counts.errors > 0 || counts.warnings > 0) {
      lines.push(`  ${category}: ${counts.errors} error(s), ${counts.warnings} warning(s)`);
    }
  }
  lines.push('');
  
  // Errors
  if (result.errors.length > 0) {
    lines.push('Errors:');
    lines.push('');
    for (const error of result.errors) {
      lines.push(formatErrorGuidanceForConsole(error));
      lines.push('');
    }
  }
  
  // Warnings
  if (result.warnings.length > 0) {
    lines.push('Warnings:');
    lines.push('');
    for (const warning of result.warnings) {
      lines.push(formatErrorGuidanceForConsole(warning));
      lines.push('');
    }
  }
  
  return lines.join('\n');
}

/**
 * Format aggregated validation result for markdown output
 */
export function formatAggregatedResultForMarkdown(result: AggregatedValidationResult): string {
  const lines: string[] = [];
  
  // Header
  lines.push('# Stemma System Validation Report');
  lines.push('');
  
  if (result.valid) {
    lines.push('✅ **All validations passed!**');
  } else {
    lines.push(`❌ **Validation failed:** ${result.summary.totalErrors} error(s), ${result.summary.totalWarnings} warning(s)`);
  }
  lines.push('');
  
  // Summary table
  lines.push('## Summary');
  lines.push('');
  lines.push('| Category | Errors | Warnings |');
  lines.push('|----------|--------|----------|');
  for (const [category, counts] of Object.entries(result.summary.byCategory)) {
    lines.push(`| ${category} | ${counts.errors} | ${counts.warnings} |`);
  }
  lines.push('');
  
  // Errors
  if (result.errors.length > 0) {
    lines.push('## Errors');
    lines.push('');
    for (const error of result.errors) {
      lines.push(formatErrorGuidanceForMarkdown(error));
      lines.push('');
      lines.push('---');
      lines.push('');
    }
  }
  
  // Warnings
  if (result.warnings.length > 0) {
    lines.push('## Warnings');
    lines.push('');
    for (const warning of result.warnings) {
      lines.push(formatErrorGuidanceForMarkdown(warning));
      lines.push('');
      lines.push('---');
      lines.push('');
    }
  }
  
  return lines.join('\n');
}


// ============================================================================
// IDE Integration Helpers
// ============================================================================

/**
 * Get all available error codes with their guidance
 */
export function getAllErrorCodes(): Map<string, ErrorGuidance> {
  const codes = new Map<string, ErrorGuidance>();
  
  for (const [code, guidance] of Object.entries(NAMING_ERROR_TEMPLATES)) {
    codes.set(code, guidance);
  }
  for (const [code, guidance] of Object.entries(NAMING_WARNING_TEMPLATES)) {
    codes.set(code, guidance);
  }
  for (const [code, guidance] of Object.entries(TOKEN_USAGE_ERROR_TEMPLATES)) {
    codes.set(code, guidance);
  }
  for (const [code, guidance] of Object.entries(TOKEN_USAGE_WARNING_TEMPLATES)) {
    codes.set(code, guidance);
  }
  for (const [code, guidance] of Object.entries(PROPERTY_ACCESSIBILITY_ERROR_TEMPLATES)) {
    codes.set(code, guidance);
  }
  for (const [code, guidance] of Object.entries(PROPERTY_ACCESSIBILITY_WARNING_TEMPLATES)) {
    codes.set(code, guidance);
  }
  
  return codes;
}

/**
 * Get documentation link for an error code
 */
export function getDocumentationLink(code: string): string | undefined {
  const guidance = getErrorGuidance(code);
  return guidance?.documentationLink;
}

/**
 * Get quick fix for an error code
 */
export function getQuickFix(code: string): QuickFix | undefined {
  const guidance = getErrorGuidance(code);
  return guidance?.quickFix;
}

/**
 * Check if an error code has an auto-applicable quick fix
 */
export function hasAutoFix(code: string): boolean {
  const quickFix = getQuickFix(code);
  return quickFix?.autoApplicable ?? false;
}

/**
 * Get WCAG reference for an error code
 */
export function getWCAGReference(code: string): string | undefined {
  const guidance = getErrorGuidance(code);
  return guidance?.wcag;
}

/**
 * Get related error codes for an error code
 */
export function getRelatedCodes(code: string): string[] {
  const guidance = getErrorGuidance(code);
  return guidance?.relatedCodes ?? [];
}

/**
 * Export diagnostics in VS Code compatible format
 */
export function exportDiagnosticsForVSCode(
  diagnostics: IDEDiagnostic[],
  uri: string
): { uri: string; diagnostics: IDEDiagnostic[] } {
  return {
    uri,
    diagnostics,
  };
}

/**
 * Export diagnostics in ESLint compatible format
 */
export function exportDiagnosticsForESLint(
  diagnostics: IDEDiagnostic[],
  filePath: string
): Array<{
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
}> {
  return diagnostics.map(d => ({
    ruleId: `stemma/${d.code}`,
    severity: d.severity === 1 ? 2 : 1, // ESLint: 2=error, 1=warning
    message: d.message,
    line: d.range.start.line + 1,
    column: d.range.start.character + 1,
    endLine: d.range.end.line + 1,
    endColumn: d.range.end.character + 1,
  }));
}
