/**
 * Stemma System Property and Accessibility Validator
 * 
 * Validates component properties against schemas and implements basic WCAG
 * accessibility checks for Stemma System components.
 * 
 * Features:
 * - Required property validation against component schemas
 * - Property value validation against behavioral contracts
 * - Basic WCAG accessibility compliance checks
 * - Clear error messages with correction guidance
 * 
 * @see .kiro/steering/stemma-system-principles.md
 * @see Requirements: R8 (Health Guardrails and Validation)
 */

import * as fs from 'fs';
import * as path from 'path';

/**
 * Result of property and accessibility validation
 */
export interface PropertyAccessibilityValidationResult {
  /** Whether the validation passed (no errors) */
  valid: boolean;
  
  /** Component name being validated */
  componentName: string;
  
  /** Schema path used for validation (if available) */
  schemaPath?: string;
  
  /** Validation errors (blocking issues) */
  errors: PropertyAccessibilityError[];
  
  /** Validation warnings (non-blocking issues) */
  warnings: PropertyAccessibilityWarning[];
  
  /** Validation statistics */
  stats: PropertyAccessibilityStats;
}


/**
 * Property/accessibility validation error
 */
export interface PropertyAccessibilityError {
  /** Error code for programmatic handling */
  code: PropertyAccessibilityErrorCode;
  
  /** Human-readable error message */
  message: string;
  
  /** Property name (if applicable) */
  property?: string;
  
  /** Detailed guidance for correction */
  guidance: string;
  
  /** WCAG reference (if accessibility-related) */
  wcag?: string;
}

/**
 * Property/accessibility validation warning
 */
export interface PropertyAccessibilityWarning {
  /** Warning code for programmatic handling */
  code: PropertyAccessibilityWarningCode;
  
  /** Human-readable warning message */
  message: string;
  
  /** Property name (if applicable) */
  property?: string;
  
  /** Detailed guidance */
  guidance: string;
  
  /** WCAG reference (if accessibility-related) */
  wcag?: string;
}

/**
 * Validation statistics
 */
export interface PropertyAccessibilityStats {
  /** Total properties checked */
  propertiesChecked: number;
  
  /** Required properties found */
  requiredPropertiesFound: number;
  
  /** Required properties missing */
  requiredPropertiesMissing: number;
  
  /** Accessibility checks performed */
  accessibilityChecksPerformed: number;
  
  /** Accessibility checks passed */
  accessibilityChecksPassed: number;
}


/**
 * Error codes for property/accessibility validation
 */
export type PropertyAccessibilityErrorCode =
  | 'MISSING_REQUIRED_PROPERTY'
  | 'INVALID_PROPERTY_TYPE'
  | 'INVALID_PROPERTY_VALUE'
  | 'MISSING_ACCESSIBILITY_LABEL'
  | 'MISSING_FOCUS_INDICATOR'
  | 'INSUFFICIENT_TOUCH_TARGET'
  | 'MISSING_ERROR_IDENTIFICATION'
  | 'MISSING_KEYBOARD_SUPPORT'
  | 'SCHEMA_NOT_FOUND'
  | 'SCHEMA_PARSE_ERROR';

/**
 * Warning codes for property/accessibility validation
 */
export type PropertyAccessibilityWarningCode =
  | 'OPTIONAL_PROPERTY_MISSING'
  | 'DEPRECATED_PROPERTY'
  | 'ACCESSIBILITY_ENHANCEMENT_AVAILABLE'
  | 'TOUCH_TARGET_SUBOPTIMAL'
  | 'MISSING_HELPER_TEXT';

/**
 * Component schema structure (parsed from YAML)
 */
export interface ComponentSchema {
  name: string;
  type: 'primitive' | 'semantic' | 'standalone';
  family: string;
  version?: string;
  readiness?: string;
  description?: string;
  behaviors?: string[];
  properties?: Record<string, SchemaProperty>;
  contracts?: Record<string, SchemaContract>;
  tokens?: Record<string, string[]>;
  accessibility?: SchemaAccessibility;
}


/**
 * Schema property definition
 */
export interface SchemaProperty {
  type: string;
  required: boolean;
  default?: any;
  description?: string;
  platform?: string;
}

/**
 * Schema behavioral contract
 */
export interface SchemaContract {
  description: string;
  behavior: string;
  wcag?: string;
  platforms?: string[];
  validation?: string;
}

/**
 * Schema accessibility section
 */
export interface SchemaAccessibility {
  wcag_level?: string;
  compliance?: string[];
  aria_attributes?: Record<string, string>;
  keyboard_navigation?: string[];
}

/**
 * Component properties to validate
 */
export interface ComponentProperties {
  [key: string]: any;
}

/**
 * WCAG accessibility requirements
 */
export const WCAG_REQUIREMENTS = {
  KEYBOARD_ACCESSIBLE: {
    criterion: '2.1.1',
    level: 'A',
    description: 'All functionality must be operable through keyboard interface',
  },
  FOCUS_VISIBLE: {
    criterion: '2.4.7',
    level: 'AA',
    description: 'Keyboard focus indicator must be visible',
  },
  ERROR_IDENTIFICATION: {
    criterion: '3.3.1',
    level: 'A',
    description: 'Input errors must be automatically detected and described',
  },
  LABELS_OR_INSTRUCTIONS: {
    criterion: '3.3.2',
    level: 'A',
    description: 'Labels or instructions provided when content requires user input',
  },
  NAME_ROLE_VALUE: {
    criterion: '4.1.2',
    level: 'A',
    description: 'Name, role, and value must be programmatically determinable',
  },
  TARGET_SIZE: {
    criterion: '2.5.5',
    level: 'AAA',
    description: 'Target size for pointer inputs is at least 44x44 CSS pixels',
  },
  TARGET_SIZE_MINIMUM: {
    criterion: '2.5.8',
    level: 'AA',
    description: 'Target size for pointer inputs is at least 24x24 CSS pixels',
  },
} as const;


/**
 * Minimum touch target sizes (in pixels)
 */
export const TOUCH_TARGET_SIZES = {
  RECOMMENDED: 48, // iOS Human Interface Guidelines
  MINIMUM_AA: 44,  // WCAG 2.5.5 Level AAA (commonly used as AA target)
  MINIMUM: 24,     // WCAG 2.5.8 Level AA minimum
} as const;

/**
 * Parse a YAML schema file (simplified parser for component schemas)
 * Note: This is a simplified parser that handles the specific YAML structure
 * used in Stemma System component schemas. For production use, consider
 * using a full YAML parser like js-yaml.
 */
export function parseComponentSchema(yamlContent: string): ComponentSchema | null {
  try {
    const lines = yamlContent.split('\n');
    const schema: Partial<ComponentSchema> = {};
    let currentSection: string | null = null;
    let currentProperty: string | null = null;
    
    for (const line of lines) {
      // Skip comments and empty lines
      if (line.trim().startsWith('#') || line.trim() === '') continue;
      
      // Top-level fields
      const topLevelMatch = line.match(/^(\w+):\s*(.*)$/);
      if (topLevelMatch) {
        const [, key, value] = topLevelMatch;
        if (value && !value.startsWith('|')) {
          // Simple value
          (schema as any)[key] = value.replace(/^['"]|['"]$/g, '');
        } else {
          // Section start
          currentSection = key;
          if (!value) {
            if (key === 'properties') schema.properties = {};
            else if (key === 'contracts') schema.contracts = {};
            else if (key === 'behaviors') schema.behaviors = [];
            else if (key === 'tokens') schema.tokens = {};
            else if (key === 'accessibility') schema.accessibility = {};
          }
        }
        continue;
      }
      
      // Handle behaviors array
      if (currentSection === 'behaviors' && line.trim().startsWith('- ')) {
        const behavior = line.trim().replace(/^- /, '');
        if (!schema.behaviors) schema.behaviors = [];
        schema.behaviors.push(behavior);
        continue;
      }
      
      // Handle properties section
      if (currentSection === 'properties') {
        const propMatch = line.match(/^  (\w+):$/);
        if (propMatch) {
          currentProperty = propMatch[1];
          if (!schema.properties) schema.properties = {};
          schema.properties[currentProperty] = { type: 'unknown', required: false };
          continue;
        }
        
        if (currentProperty && line.match(/^    /)) {
          const fieldMatch = line.match(/^    (\w+):\s*(.+)$/);
          if (fieldMatch && schema.properties?.[currentProperty]) {
            const [, field, val] = fieldMatch;
            const cleanVal = val.replace(/^['"]|['"]$/g, '');
            if (field === 'required') {
              schema.properties[currentProperty].required = cleanVal === 'true';
            } else if (field === 'type') {
              schema.properties[currentProperty].type = cleanVal;
            } else if (field === 'default') {
              schema.properties[currentProperty].default = cleanVal;
            }
          }
        }
      }
    }
    
    return schema as ComponentSchema;
  } catch {
    return null;
  }
}


/**
 * Load component schema from file path
 */
export function loadComponentSchema(schemaPath: string): ComponentSchema | null {
  try {
    const fullPath = path.resolve(process.cwd(), schemaPath);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const content = fs.readFileSync(fullPath, 'utf-8');
    return parseComponentSchema(content);
  } catch {
    return null;
  }
}

/**
 * Find schema path for a component name
 */
export function findSchemaPath(componentName: string): string | null {
  // Convert component name to directory path
  // e.g., "Input-Text-Base" -> "src/components/core/Input-Text-Base/Input-Text-Base.schema.yaml"
  const basePath = `src/components/core/${componentName}/${componentName}.schema.yaml`;
  const fullPath = path.resolve(process.cwd(), basePath);
  
  if (fs.existsSync(fullPath)) {
    return basePath;
  }
  
  return null;
}

/**
 * Validate component properties against schema
 */
export function validateProperties(
  properties: ComponentProperties,
  schema: ComponentSchema
): { errors: PropertyAccessibilityError[]; warnings: PropertyAccessibilityWarning[]; stats: Partial<PropertyAccessibilityStats> } {
  const errors: PropertyAccessibilityError[] = [];
  const warnings: PropertyAccessibilityWarning[] = [];
  let requiredFound = 0;
  let requiredMissing = 0;
  
  if (!schema.properties) {
    return { errors, warnings, stats: { propertiesChecked: 0, requiredPropertiesFound: 0, requiredPropertiesMissing: 0 } };
  }
  
  // Check each schema property
  for (const [propName, propDef] of Object.entries(schema.properties)) {
    const propValue = properties[propName];
    
    // Check required properties
    if (propDef.required) {
      if (propValue === undefined || propValue === null) {
        requiredMissing++;
        errors.push({
          code: 'MISSING_REQUIRED_PROPERTY',
          message: `Required property "${propName}" is missing`,
          property: propName,
          guidance: `Add the "${propName}" property with type ${propDef.type}. ${propDef.description || ''}`,
        });
      } else {
        requiredFound++;
      }
    } else if (propValue === undefined) {
      // Optional property missing - just a warning for important ones
      if (['testID', 'accessibilityLabel', 'helperText'].includes(propName)) {
        warnings.push({
          code: 'OPTIONAL_PROPERTY_MISSING',
          message: `Optional property "${propName}" is not set`,
          property: propName,
          guidance: `Consider adding "${propName}" for better ${propName === 'testID' ? 'testability' : 'accessibility'}`,
        });
      }
    }
    
    // Validate property type (basic type checking)
    if (propValue !== undefined && propValue !== null) {
      const typeError = validatePropertyType(propName, propValue, propDef.type);
      if (typeError) {
        errors.push(typeError);
      }
    }
  }
  
  return {
    errors,
    warnings,
    stats: {
      propertiesChecked: Object.keys(schema.properties).length,
      requiredPropertiesFound: requiredFound,
      requiredPropertiesMissing: requiredMissing,
    },
  };
}


/**
 * Validate property type
 */
function validatePropertyType(
  propName: string,
  value: any,
  expectedType: string
): PropertyAccessibilityError | null {
  // Handle union types (e.g., "'small' | 'medium' | 'large'")
  if (expectedType.includes("'") && expectedType.includes('|')) {
    const allowedValues = expectedType
      .split('|')
      .map(v => v.trim().replace(/^['"]|['"]$/g, ''));
    
    if (!allowedValues.includes(String(value))) {
      return {
        code: 'INVALID_PROPERTY_VALUE',
        message: `Property "${propName}" has invalid value "${value}"`,
        property: propName,
        guidance: `Allowed values are: ${allowedValues.join(', ')}`,
      };
    }
    return null;
  }
  
  // Handle basic types
  const actualType = typeof value;
  const normalizedExpected = expectedType.toLowerCase().replace(/['"]/g, '');
  
  if (normalizedExpected === 'string' && actualType !== 'string') {
    return {
      code: 'INVALID_PROPERTY_TYPE',
      message: `Property "${propName}" should be a string, got ${actualType}`,
      property: propName,
      guidance: `Provide a string value for "${propName}"`,
    };
  }
  
  if (normalizedExpected === 'boolean' && actualType !== 'boolean') {
    return {
      code: 'INVALID_PROPERTY_TYPE',
      message: `Property "${propName}" should be a boolean, got ${actualType}`,
      property: propName,
      guidance: `Provide true or false for "${propName}"`,
    };
  }
  
  if (normalizedExpected === 'number' && actualType !== 'number') {
    return {
      code: 'INVALID_PROPERTY_TYPE',
      message: `Property "${propName}" should be a number, got ${actualType}`,
      property: propName,
      guidance: `Provide a numeric value for "${propName}"`,
    };
  }
  
  return null;
}


/**
 * Validate accessibility requirements
 */
export function validateAccessibility(
  properties: ComponentProperties,
  schema: ComponentSchema,
  componentType: 'input' | 'button' | 'container' | 'icon' | 'generic'
): { errors: PropertyAccessibilityError[]; warnings: PropertyAccessibilityWarning[]; checksPerformed: number; checksPassed: number } {
  const errors: PropertyAccessibilityError[] = [];
  const warnings: PropertyAccessibilityWarning[] = [];
  let checksPerformed = 0;
  let checksPassed = 0;
  
  // Check 1: Label/Name requirement (WCAG 4.1.2, 3.3.2)
  checksPerformed++;
  if (componentType === 'input') {
    if (!properties.label && !properties.accessibilityLabel && !properties['aria-label']) {
      errors.push({
        code: 'MISSING_ACCESSIBILITY_LABEL',
        message: 'Input component is missing a label',
        guidance: 'Add a "label" property for visible label or "accessibilityLabel" for screen reader only',
        wcag: WCAG_REQUIREMENTS.LABELS_OR_INSTRUCTIONS.criterion,
      });
    } else {
      checksPassed++;
    }
  } else if (componentType === 'button') {
    if (!properties.label && !properties.accessibilityLabel && !properties['aria-label']) {
      errors.push({
        code: 'MISSING_ACCESSIBILITY_LABEL',
        message: 'Button component is missing a label',
        guidance: 'Add a "label" property for button text or "accessibilityLabel" for icon-only buttons',
        wcag: WCAG_REQUIREMENTS.NAME_ROLE_VALUE.criterion,
      });
    } else {
      checksPassed++;
    }
  } else {
    checksPassed++; // Other components don't require labels
  }
  
  // Check 2: Error identification (WCAG 3.3.1)
  checksPerformed++;
  if (componentType === 'input') {
    // Check if error state is properly communicated
    if (properties.errorMessage !== undefined || properties.hasError) {
      // Has error handling - good
      checksPassed++;
    } else if (schema.contracts?.error_state_display) {
      // Schema defines error handling contract - good
      checksPassed++;
    } else {
      warnings.push({
        code: 'ACCESSIBILITY_ENHANCEMENT_AVAILABLE',
        message: 'Consider adding error message support for better accessibility',
        guidance: 'Add "errorMessage" property to communicate validation errors to users',
        wcag: WCAG_REQUIREMENTS.ERROR_IDENTIFICATION.criterion,
      });
      checksPassed++; // Not an error, just a suggestion
    }
  } else {
    checksPassed++;
  }
  
  // Check 3: Touch target size (WCAG 2.5.5, 2.5.8)
  checksPerformed++;
  if (componentType === 'button' || componentType === 'input') {
    const height = properties.height || properties.minHeight;
    if (height !== undefined) {
      const numericHeight = typeof height === 'number' ? height : parseInt(height, 10);
      if (!isNaN(numericHeight)) {
        if (numericHeight < TOUCH_TARGET_SIZES.MINIMUM) {
          errors.push({
            code: 'INSUFFICIENT_TOUCH_TARGET',
            message: `Touch target height ${numericHeight}px is below minimum ${TOUCH_TARGET_SIZES.MINIMUM}px`,
            guidance: `Increase height to at least ${TOUCH_TARGET_SIZES.MINIMUM}px (${TOUCH_TARGET_SIZES.MINIMUM_AA}px recommended)`,
            wcag: WCAG_REQUIREMENTS.TARGET_SIZE_MINIMUM.criterion,
          });
        } else if (numericHeight < TOUCH_TARGET_SIZES.MINIMUM_AA) {
          warnings.push({
            code: 'TOUCH_TARGET_SUBOPTIMAL',
            message: `Touch target height ${numericHeight}px is below recommended ${TOUCH_TARGET_SIZES.MINIMUM_AA}px`,
            guidance: `Consider increasing height to ${TOUCH_TARGET_SIZES.MINIMUM_AA}px for better accessibility`,
            wcag: WCAG_REQUIREMENTS.TARGET_SIZE.criterion,
          });
          checksPassed++;
        } else {
          checksPassed++;
        }
      } else {
        checksPassed++; // Can't validate non-numeric height
      }
    } else {
      checksPassed++; // No explicit height - assume component handles it
    }
  } else {
    checksPassed++;
  }
  
  // Check 4: Keyboard support (WCAG 2.1.1)
  checksPerformed++;
  if (componentType === 'button' || componentType === 'input') {
    // Check if component has keyboard handlers or schema defines keyboard support
    if (properties.onKeyDown || properties.onKeyPress || properties.onKeyUp ||
        schema.contracts?.focusable || schema.behaviors?.includes('focusable')) {
      checksPassed++;
    } else if (properties.disabled) {
      checksPassed++; // Disabled elements don't need keyboard support
    } else {
      warnings.push({
        code: 'ACCESSIBILITY_ENHANCEMENT_AVAILABLE',
        message: 'Ensure keyboard navigation is supported',
        guidance: 'Interactive components should be focusable and respond to keyboard events',
        wcag: WCAG_REQUIREMENTS.KEYBOARD_ACCESSIBLE.criterion,
      });
      checksPassed++; // Warning only
    }
  } else {
    checksPassed++;
  }
  
  // Check 5: Focus indicator (WCAG 2.4.7)
  checksPerformed++;
  if (componentType === 'button' || componentType === 'input') {
    if (schema.contracts?.focus_ring || schema.contracts?.focusable ||
        schema.behaviors?.includes('focusable')) {
      checksPassed++;
    } else {
      warnings.push({
        code: 'ACCESSIBILITY_ENHANCEMENT_AVAILABLE',
        message: 'Ensure focus indicator is visible',
        guidance: 'Interactive components should have a visible focus indicator',
        wcag: WCAG_REQUIREMENTS.FOCUS_VISIBLE.criterion,
      });
      checksPassed++; // Warning only
    }
  } else {
    checksPassed++;
  }
  
  return { errors, warnings, checksPerformed, checksPassed };
}


/**
 * Determine component type from schema or name
 */
export function determineComponentType(
  schema: ComponentSchema | null,
  componentName: string
): 'input' | 'button' | 'container' | 'icon' | 'generic' {
  // Check schema family
  if (schema?.family) {
    const family = schema.family.toLowerCase();
    if (family === 'forminputs' || family === 'form inputs') return 'input';
    if (family === 'buttons') return 'button';
    if (family === 'containers') return 'container';
    if (family === 'icons') return 'icon';
  }
  
  // Fallback to name-based detection
  const nameLower = componentName.toLowerCase();
  if (nameLower.includes('input') || nameLower.includes('text')) return 'input';
  if (nameLower.includes('button')) return 'button';
  if (nameLower.includes('container')) return 'container';
  if (nameLower.includes('icon')) return 'icon';
  
  return 'generic';
}

/**
 * Main validation function - validates properties and accessibility
 */
export function validatePropertyAndAccessibility(
  componentName: string,
  properties: ComponentProperties,
  schemaPath?: string
): PropertyAccessibilityValidationResult {
  const errors: PropertyAccessibilityError[] = [];
  const warnings: PropertyAccessibilityWarning[] = [];
  
  // Find or load schema
  const resolvedSchemaPath = schemaPath || findSchemaPath(componentName);
  let schema: ComponentSchema | null = null;
  
  if (resolvedSchemaPath) {
    schema = loadComponentSchema(resolvedSchemaPath);
    if (!schema) {
      errors.push({
        code: 'SCHEMA_PARSE_ERROR',
        message: `Failed to parse schema at ${resolvedSchemaPath}`,
        guidance: 'Check that the schema file is valid YAML format',
      });
    }
  }
  
  // Determine component type
  const componentType = determineComponentType(schema, componentName);
  
  // Initialize stats
  const stats: PropertyAccessibilityStats = {
    propertiesChecked: 0,
    requiredPropertiesFound: 0,
    requiredPropertiesMissing: 0,
    accessibilityChecksPerformed: 0,
    accessibilityChecksPassed: 0,
  };
  
  // Validate properties against schema
  if (schema) {
    const propResult = validateProperties(properties, schema);
    errors.push(...propResult.errors);
    warnings.push(...propResult.warnings);
    stats.propertiesChecked = propResult.stats.propertiesChecked || 0;
    stats.requiredPropertiesFound = propResult.stats.requiredPropertiesFound || 0;
    stats.requiredPropertiesMissing = propResult.stats.requiredPropertiesMissing || 0;
  }
  
  // Validate accessibility
  const accessResult = validateAccessibility(properties, schema || { name: componentName, type: 'standalone', family: 'unknown' }, componentType);
  errors.push(...accessResult.errors);
  warnings.push(...accessResult.warnings);
  stats.accessibilityChecksPerformed = accessResult.checksPerformed;
  stats.accessibilityChecksPassed = accessResult.checksPassed;
  
  return {
    valid: errors.length === 0,
    componentName,
    schemaPath: resolvedSchemaPath || undefined,
    errors,
    warnings,
    stats,
  };
}


/**
 * Validate multiple components
 */
export function validateMultipleComponents(
  components: Array<{ name: string; properties: ComponentProperties; schemaPath?: string }>
): {
  results: Map<string, PropertyAccessibilityValidationResult>;
  summary: {
    totalComponents: number;
    validComponents: number;
    invalidComponents: number;
    totalErrors: number;
    totalWarnings: number;
  };
} {
  const results = new Map<string, PropertyAccessibilityValidationResult>();
  let validComponents = 0;
  let invalidComponents = 0;
  let totalErrors = 0;
  let totalWarnings = 0;
  
  for (const component of components) {
    const result = validatePropertyAndAccessibility(
      component.name,
      component.properties,
      component.schemaPath
    );
    results.set(component.name, result);
    
    if (result.valid) {
      validComponents++;
    } else {
      invalidComponents++;
    }
    
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
  }
  
  return {
    results,
    summary: {
      totalComponents: components.length,
      validComponents,
      invalidComponents,
      totalErrors,
      totalWarnings,
    },
  };
}

/**
 * Format validation errors for display
 */
export function formatPropertyAccessibilityErrors(
  result: PropertyAccessibilityValidationResult
): string {
  if (result.valid && result.errors.length === 0) {
    return `✅ "${result.componentName}" - All property and accessibility checks passed`;
  }
  
  const lines: string[] = [
    `❌ "${result.componentName}" - ${result.errors.length} error(s) found:`
  ];
  
  for (const error of result.errors) {
    lines.push(`  • ${error.message}`);
    if (error.property) {
      lines.push(`    Property: ${error.property}`);
    }
    if (error.wcag) {
      lines.push(`    WCAG: ${error.wcag}`);
    }
    lines.push(`    → ${error.guidance}`);
  }
  
  return lines.join('\n');
}

/**
 * Format validation warnings for display
 */
export function formatPropertyAccessibilityWarnings(
  result: PropertyAccessibilityValidationResult
): string {
  if (result.warnings.length === 0) {
    return '';
  }
  
  const lines: string[] = [
    `⚠️ Warnings for "${result.componentName}":`
  ];
  
  for (const warning of result.warnings) {
    lines.push(`  • ${warning.message}`);
    if (warning.property) {
      lines.push(`    Property: ${warning.property}`);
    }
    if (warning.wcag) {
      lines.push(`    WCAG: ${warning.wcag}`);
    }
    lines.push(`    → ${warning.guidance}`);
  }
  
  return lines.join('\n');
}
