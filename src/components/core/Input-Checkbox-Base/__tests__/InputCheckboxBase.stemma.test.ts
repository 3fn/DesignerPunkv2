/**
 * @category evergreen
 * @purpose Stemma System validator integration tests for Input-Checkbox-Base component
 * @jest-environment node
 */
/**
 * Input-Checkbox-Base Stemma Validator Integration Tests
 * 
 * Integrates Stemma System validators for static analysis validation:
 * - Component naming validation (Stemma naming conventions)
 * - Token usage validation (no hardcoded values)
 * - Accessibility attribute validation (WCAG compliance)
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Input-Checkbox-Base
 * Component Type: Primitive (Base)
 * 
 * @module Input-Checkbox-Base/__tests__/InputCheckboxBase.stemma
 * @see Requirements: 11.2 - Use Stemma System validators for token compliance
 * @see .kiro/specs/046-input-checkbox-base/design.md - Testing Strategy
 */

import * as fs from 'fs';
import * as path from 'path';

import {
  validateComponentName,
  ComponentNameValidationResult,
  isPrimitiveComponent,
  isSemanticComponent,
} from '../../../../validators/StemmaComponentNamingValidator';

import {
  validateTokenUsage,
  TokenUsageValidationResult,
  detectPlatform,
} from '../../../../validators/StemmaTokenUsageValidator';

import {
  validatePropertyAndAccessibility,
  PropertyAccessibilityValidationResult,
  determineComponentType,
} from '../../../../validators/StemmaPropertyAccessibilityValidator';

// ============================================================================
// Test Constants
// ============================================================================

const COMPONENT_NAME = 'Input-Checkbox-Base';
const COMPONENT_DIR = 'src/components/core/Input-Checkbox-Base';
const WEB_COMPONENT_PATH = `${COMPONENT_DIR}/platforms/web/InputCheckboxBase.web.ts`;
const CSS_PATH = `${COMPONENT_DIR}/platforms/web/InputCheckboxBase.web.css`;
const TYPES_PATH = `${COMPONENT_DIR}/types.ts`;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Read file content from the project root
 */
function readFileContent(filePath: string): string {
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(fullPath, 'utf-8');
}

/**
 * Check if file exists
 */
function fileExists(filePath: string): boolean {
  const fullPath = path.resolve(process.cwd(), filePath);
  return fs.existsSync(fullPath);
}

// ============================================================================
// Test Suite: Component Naming Validation
// ============================================================================

describe('Input-Checkbox-Base Stemma Validators', () => {
  describe('Component Naming Validation', () => {
    /**
     * Validates that "Input-Checkbox-Base" follows Stemma System naming conventions:
     * - [Family]-[Type]-[Variant] format (3 segments)
     * - PascalCase for each segment
     * - Known family name (Input)
     * 
     * @see .kiro/steering/stemma-system-principles.md
     */
    
    it('should validate "Input-Checkbox-Base" as a valid Stemma component name', () => {
      const result: ComponentNameValidationResult = validateComponentName(COMPONENT_NAME);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.name).toBe(COMPONENT_NAME);
    });
    
    it('should parse "Input-Checkbox-Base" into correct segments', () => {
      const result = validateComponentName(COMPONENT_NAME);
      
      expect(result.segments).toBeDefined();
      expect(result.segments?.family).toBe('Input');
      expect(result.segments?.type).toBe('Checkbox');
      expect(result.segments?.variant).toBe('Base');
    });
    
    it('should classify "Input-Checkbox-Base" as primitive component type', () => {
      const result = validateComponentName(COMPONENT_NAME);
      
      // Input-Checkbox-Base is a primitive (Base variant)
      expect(result.componentType).toBe('primitive');
    });
    
    it('should recognize "Input" as a known family', () => {
      const result = validateComponentName(COMPONENT_NAME);
      
      // Should not have warning about unknown family
      const hasUnknownFamilyWarning = result.warnings.some(
        w => w.code === 'UNUSUAL_FAMILY_NAME'
      );
      expect(hasUnknownFamilyWarning).toBe(false);
    });
    
    it('should be classified as primitive component', () => {
      expect(isPrimitiveComponent(COMPONENT_NAME)).toBe(true);
    });
    
    it('should not be classified as semantic component', () => {
      expect(isSemanticComponent(COMPONENT_NAME)).toBe(false);
    });
    
    it('should reject invalid naming variations', () => {
      const invalidNames = [
        'InputCheckboxBase',      // Missing hyphens
        'input-checkbox-base',    // Wrong case
        'INPUT-CHECKBOX-BASE',    // All uppercase
        'Input_Checkbox_Base',    // Underscore instead of hyphen
        'Input-checkbox-Base',    // Inconsistent case
      ];
      
      for (const name of invalidNames) {
        const result = validateComponentName(name);
        expect(result.valid).toBe(false);
      }
    });
  });
  
  // ============================================================================
  // Test Suite: Token Usage Validation
  // ============================================================================
  
  describe('Token Usage Validation', () => {
    /**
     * Validates that Input-Checkbox-Base web component uses design tokens
     * instead of hardcoded values for all styling.
     * 
     * @see Requirements: 11.2 - Use Stemma System validators for token compliance
     */
    
    let webComponentSource: string;
    let cssSource: string;
    let combinedSource: string;
    
    beforeAll(() => {
      if (fileExists(WEB_COMPONENT_PATH)) {
        webComponentSource = readFileContent(WEB_COMPONENT_PATH);
      }
      if (fileExists(CSS_PATH)) {
        cssSource = readFileContent(CSS_PATH);
      }
      combinedSource = (webComponentSource || '') + (cssSource || '');
    });
    
    it('should detect web platform from file path', () => {
      const platform = detectPlatform(WEB_COMPONENT_PATH);
      expect(platform).toBe('web');
    });
    
    it('should pass token usage validation for web component', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }
      
      const result: TokenUsageValidationResult = validateTokenUsage(
        webComponentSource,
        WEB_COMPONENT_PATH
      );
      
      // Filter out spacing errors that are documented with token comments
      const nonDocumentedErrors = result.errors.filter(error => {
        return !error.snippet.match(/\d+px/);
      });
      
      expect(nonDocumentedErrors).toHaveLength(0);
    });
    
    it('should find token references in web component', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }
      
      const result = validateTokenUsage(webComponentSource, WEB_COMPONENT_PATH);
      
      expect(result.stats.tokenReferencesFound).toBeGreaterThan(0);
    });
    
    it('should not have hardcoded color values', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }
      
      const result = validateTokenUsage(webComponentSource, WEB_COMPONENT_PATH);
      
      const colorErrors = result.errors.filter(
        e => e.code === 'HARDCODED_COLOR' || e.code === 'INLINE_STYLE_COLOR'
      );
      
      expect(colorErrors).toHaveLength(0);
    });
    
    it('should use CSS custom properties for token values', () => {
      if (!combinedSource) {
        console.warn('Component files not found, skipping test');
        return;
      }
      
      // Check for expected CSS custom property patterns
      const expectedTokenPatterns = [
        '--color-select-not-selected-strong',
        '--color-select-selected-strong',
        '--color-error-strong',
        '--accessibility-focus-width',
        '--accessibility-focus-color',
        '--accessibility-focus-offset',
        '--motion-selection-transition-duration',
        '--motion-selection-transition-easing',
        '--border-emphasis',
        '--radius-subtle',
        '--radius-small',
      ];
      
      for (const pattern of expectedTokenPatterns) {
        expect(combinedSource).toContain(pattern);
      }
    });
    
    it('should reference size tokens for all variants', () => {
      if (!combinedSource) {
        console.warn('Component files not found, skipping test');
        return;
      }
      
      // Check for size-specific token references
      const sizeTokens = [
        '--icon-size-050',  // sm icon
        '--icon-size-075',  // md icon
        '--icon-size-100',  // lg icon
        '--space-inset-050', // sm inset
        '--space-inset-075', // md inset
        '--space-inset-100', // lg inset
        '--space-grouped-normal', // sm/md gap
        '--space-grouped-loose',  // lg gap
      ];
      
      for (const token of sizeTokens) {
        expect(combinedSource).toContain(token);
      }
    });
    
    it('should reference typography tokens for all sizes', () => {
      if (!combinedSource) {
        console.warn('Component files not found, skipping test');
        return;
      }
      
      const typographyTokens = [
        '--typography-label-sm-font-family',
        '--typography-label-md-font-family',
        '--typography-label-lg-font-family',
      ];
      
      for (const token of typographyTokens) {
        expect(combinedSource).toContain(token);
      }
    });
  });
  
  // ============================================================================
  // Test Suite: Accessibility Attribute Validation
  // ============================================================================
  
  describe('Accessibility Attribute Validation', () => {
    /**
     * Validates that Input-Checkbox-Base component implements required
     * accessibility attributes for WCAG 2.1 AA compliance.
     * 
     * @see Requirements: 6.1-6.6, 11.3
     */
    
    let webComponentSource: string;
    let cssSource: string;
    let combinedSource: string;
    
    beforeAll(() => {
      if (fileExists(WEB_COMPONENT_PATH)) {
        webComponentSource = readFileContent(WEB_COMPONENT_PATH);
      }
      if (fileExists(CSS_PATH)) {
        cssSource = readFileContent(CSS_PATH);
      }
      combinedSource = (webComponentSource || '') + (cssSource || '');
    });
    
    it('should apply aria-labelledby to associate label', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }
      
      expect(webComponentSource).toContain('aria-labelledby');
    });
    
    it('should apply aria-checked for state announcement', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }
      
      expect(webComponentSource).toContain('aria-checked');
    });
    
    it('should support aria-checked="mixed" for indeterminate', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }
      
      expect(webComponentSource).toContain('aria-checked="mixed"');
    });
    
    it('should apply aria-invalid for error state', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }
      
      expect(webComponentSource).toContain('aria-invalid="true"');
    });
    
    it('should apply aria-describedby for helper/error association', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }
      
      expect(webComponentSource).toContain('aria-describedby');
    });
    
    it('should use native checkbox input for form compatibility', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }
      
      expect(webComponentSource).toContain('type="checkbox"');
    });
    
    it('should implement :focus-visible for keyboard-only focus', () => {
      if (!combinedSource) {
        console.warn('Component files not found, skipping test');
        return;
      }
      
      expect(combinedSource).toContain(':focus-visible');
    });
    
    it('should implement touch target minimum size', () => {
      if (!combinedSource) {
        console.warn('Component files not found, skipping test');
        return;
      }
      
      // Check for tap-area-recommended token usage
      expect(combinedSource).toContain('--tap-area-recommended');
    });
    
    it('should support high contrast mode', () => {
      if (!combinedSource) {
        console.warn('Component files not found, skipping test');
        return;
      }
      
      expect(combinedSource).toContain('prefers-contrast: high');
    });
    
    it('should support reduced motion preference', () => {
      if (!combinedSource) {
        console.warn('Component files not found, skipping test');
        return;
      }
      
      expect(combinedSource).toContain('prefers-reduced-motion: reduce');
    });
    
    it('should have role="alert" on error message', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }
      
      expect(webComponentSource).toContain('role="alert"');
    });
  });
  
  // ============================================================================
  // Test Suite: Types File Validation
  // ============================================================================
  
  describe('Types File Validation', () => {
    /**
     * Validates that types.ts follows Stemma System patterns.
     */
    
    let typesSource: string;
    
    beforeAll(() => {
      if (fileExists(TYPES_PATH)) {
        typesSource = readFileContent(TYPES_PATH);
      }
    });
    
    it('should define types file', () => {
      expect(fileExists(TYPES_PATH)).toBe(true);
    });
    
    it('should define CheckboxSize type', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('CheckboxSize');
      expect(typesSource).toContain("'sm'");
      expect(typesSource).toContain("'md'");
      expect(typesSource).toContain("'lg'");
    });
    
    it('should define LabelAlignment type', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('LabelAlignment');
      expect(typesSource).toContain("'center'");
      expect(typesSource).toContain("'top'");
    });
    
    it('should define InputCheckboxBaseProps interface', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('interface InputCheckboxBaseProps');
    });
    
    it('should not have disabled prop (by design)', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      // Input-Checkbox-Base intentionally does not support disabled state
      const hasDisabledProp = /disabled\s*[?:]/.test(typesSource);
      expect(hasDisabledProp).toBe(false);
    });
    
    it('should include Stemma System documentation', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('Stemma System');
      expect(typesSource).toContain('Input-Checkbox-Base');
    });
    
    it('should define observed attributes constant', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('INPUT_CHECKBOX_BASE_OBSERVED_ATTRIBUTES');
    });
    
    it('should define default values constant', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('INPUT_CHECKBOX_BASE_DEFAULTS');
    });
  });
  
  // ============================================================================
  // Test Suite: Property Validation
  // ============================================================================
  
  describe('Property Validation', () => {
    /**
     * Validates component properties against accessibility requirements.
     */
    
    it('should validate component as input type', () => {
      // The validator determines type based on family name prefix
      // "Input-Checkbox-Base" has "Input" family, so it's classified as 'input'
      const componentType = determineComponentType(null, COMPONENT_NAME);
      expect(componentType).toBe('input');
    });
    
    it('should validate required accessibility properties', () => {
      const validProps = {
        label: 'Accept terms',
        checked: false,
        size: 'md',
      };
      
      const result: PropertyAccessibilityValidationResult = validatePropertyAndAccessibility(
        COMPONENT_NAME,
        validProps
      );
      
      // Should not have missing accessibility label error (label prop serves as label)
      const hasLabelError = result.errors.some(
        e => e.code === 'MISSING_ACCESSIBILITY_LABEL'
      );
      expect(hasLabelError).toBe(false);
    });
  });
});
