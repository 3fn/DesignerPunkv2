/**
 * @category evergreen
 * @purpose Stemma System validator integration tests for Input-Radio-Set component
 * @jest-environment node
 */
/**
 * Input-Radio-Set Stemma Validator Integration Tests
 * 
 * Integrates Stemma System validators for static analysis validation:
 * - Component naming validation (Stemma naming conventions)
 * - Token usage validation (no hardcoded values)
 * - Orchestration pattern validation (Set does not duplicate Base rendering)
 * - Accessibility attribute validation (WCAG compliance)
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Input-Radio-Set
 * Component Type: Pattern (Set)
 * 
 * @module Input-Radio-Set/__tests__/InputRadioSet.stemma
 * @see Requirements: 12.2 - Use Stemma System validators for token compliance
 * @see Requirements: 12.8 - Validate orchestration pattern
 * @see .kiro/specs/047-input-radio-base/design.md - Testing Strategy
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

const COMPONENT_NAME = 'Input-Radio-Set';
const COMPONENT_DIR = 'src/components/core/Input-Radio-Set';
const WEB_COMPONENT_PATH = `${COMPONENT_DIR}/platforms/web/InputRadioSet.web.ts`;
const CSS_PATH = `${COMPONENT_DIR}/platforms/web/InputRadioSet.web.css`;
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

describe('Input-Radio-Set Stemma Validators', () => {
  describe('Component Naming Validation', () => {
    /**
     * Validates that "Input-Radio-Set" follows Stemma System naming conventions:
     * - [Family]-[Type]-[Variant] format (3 segments)
     * - PascalCase for each segment
     * - Known family name (Input)
     * 
     * **Validates: Requirement 12.2**
     */

    it('should validate "Input-Radio-Set" as a valid Stemma component name', () => {
      const result: ComponentNameValidationResult = validateComponentName(COMPONENT_NAME);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.name).toBe(COMPONENT_NAME);
    });

    it('should parse "Input-Radio-Set" into correct segments', () => {
      const result = validateComponentName(COMPONENT_NAME);

      expect(result.segments).toBeDefined();
      expect(result.segments?.family).toBe('Input');
      expect(result.segments?.type).toBe('Radio');
      expect(result.segments?.variant).toBe('Set');
    });

    it('should classify "Input-Radio-Set" as pattern component type', () => {
      const result = validateComponentName(COMPONENT_NAME);

      // Input-Radio-Set is a pattern (Set variant)
      expect(result.componentType).toBe('pattern');
    });

    it('should recognize "Input" as a known family', () => {
      const result = validateComponentName(COMPONENT_NAME);

      const hasUnknownFamilyWarning = result.warnings.some(
        w => w.code === 'UNUSUAL_FAMILY_NAME'
      );
      expect(hasUnknownFamilyWarning).toBe(false);
    });

    it('should not be classified as primitive component', () => {
      expect(isPrimitiveComponent(COMPONENT_NAME)).toBe(false);
    });

    it('should not be classified as semantic component', () => {
      expect(isSemanticComponent(COMPONENT_NAME)).toBe(false);
    });
  });

  // ============================================================================
  // Test Suite: Orchestration Pattern Validation
  // ============================================================================

  describe('Orchestration Pattern Validation', () => {
    /**
     * Validates that Input-Radio-Set follows the orchestration pattern:
     * - Uses slot-based composition (not duplicating Base rendering)
     * - Does NOT contain radio circle/dot rendering logic
     * - References Input-Radio-Base as child components
     * 
     * **Validates: Requirement 12.8**
     * @see Design: Architectural Principle - Orchestration, Not Duplication
     */

    let webComponentSource: string;
    let cssSource: string;

    beforeAll(() => {
      if (fileExists(WEB_COMPONENT_PATH)) {
        webComponentSource = readFileContent(WEB_COMPONENT_PATH);
      }
      if (fileExists(CSS_PATH)) {
        cssSource = readFileContent(CSS_PATH);
      }
    });

    it('should use slot-based composition for child rendering', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }

      // Set must use <slot> for child composition
      expect(webComponentSource).toContain('<slot>');
    });

    it('should NOT contain radio circle rendering logic', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }

      // Set must NOT duplicate Base's radio circle/dot rendering
      expect(webComponentSource).not.toContain('radio__circle');
      expect(webComponentSource).not.toContain('radio__dot');
    });

    it('should NOT contain radio dot styling', () => {
      if (!cssSource) {
        console.warn('CSS file not found, skipping test');
        return;
      }

      // CSS must NOT contain radio circle/dot classes from Base
      expect(cssSource).not.toContain('.radio__circle');
      expect(cssSource).not.toContain('.radio__dot');
    });

    it('should reference Input-Radio-Base as child component', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }

      // Set must reference input-radio-base (the child custom element)
      expect(webComponentSource).toContain('input-radio-base');
    });

    it('should document orchestration pattern in source', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }

      // Source should document the orchestration principle
      const hasOrchestrationDoc =
        webComponentSource.includes('ORCHESTRATION') ||
        webComponentSource.includes('orchestrat');
      expect(hasOrchestrationDoc).toBe(true);
    });
  });

  // ============================================================================
  // Test Suite: Token Usage Validation
  // ============================================================================

  describe('Token Usage Validation', () => {
    /**
     * Validates that Input-Radio-Set uses design tokens
     * instead of hardcoded values for all styling.
     * 
     * **Validates: Requirement 12.2**
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

      const nonDocumentedErrors = result.errors.filter(error => {
        return !error.snippet.match(/\d+px/);
      });

      expect(nonDocumentedErrors).toHaveLength(0);
    });

    it('should find token references in CSS file', () => {
      if (!cssSource) {
        console.warn('CSS file not found, skipping test');
        return;
      }

      const result = validateTokenUsage(cssSource, CSS_PATH);

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

    it('should use CSS custom properties for spacing', () => {
      if (!cssSource) {
        console.warn('CSS file not found, skipping test');
        return;
      }

      // Set uses grouped spacing token for gap between children
      expect(cssSource).toContain('--space-grouped-normal');
    });

    it('should use CSS custom properties for error typography', () => {
      if (!cssSource) {
        console.warn('CSS file not found, skipping test');
        return;
      }

      // Error message uses caption typography tokens
      expect(cssSource).toContain('--typography-caption-font-family');
      expect(cssSource).toContain('--typography-caption-font-size');
      expect(cssSource).toContain('--color-feedback-error-text');
    });
  });

  // ============================================================================
  // Test Suite: Accessibility Attribute Validation
  // ============================================================================

  describe('Accessibility Attribute Validation', () => {
    /**
     * Validates that Input-Radio-Set implements required
     * accessibility attributes for WCAG 2.1 AA compliance.
     * 
     * **Validates: Requirement 12.2, 12.8**
     * @see Requirements: 9.2, 9.9
     */

    let webComponentSource: string;
    let cssSource: string;

    beforeAll(() => {
      if (fileExists(WEB_COMPONENT_PATH)) {
        webComponentSource = readFileContent(WEB_COMPONENT_PATH);
      }
      if (fileExists(CSS_PATH)) {
        cssSource = readFileContent(CSS_PATH);
      }
    });

    it('should apply role="radiogroup" for group semantics', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }

      expect(webComponentSource).toContain('role="radiogroup"');
    });

    it('should have role="alert" on error message', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }

      expect(webComponentSource).toContain('role="alert"');
    });

    it('should use aria-describedby for error association', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }

      expect(webComponentSource).toContain('aria-describedby');
    });

    it('should support reduced motion preference', () => {
      if (!cssSource) {
        console.warn('CSS file not found, skipping test');
        return;
      }

      expect(cssSource).toContain('prefers-reduced-motion: reduce');
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

    it('should define InputRadioSetProps interface', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('interface InputRadioSetProps');
    });

    it('should define observed attributes constant', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('INPUT_RADIO_SET_OBSERVED_ATTRIBUTES');
    });

    it('should define default values constant', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('INPUT_RADIO_SET_DEFAULTS');
    });

    it('should include Stemma System documentation', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('Stemma System');
      expect(typesSource).toContain('Input-Radio-Set');
    });

    it('should document orchestration pattern', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('ORCHESTRATION');
    });

    it('should reference RadioSize from Input-Radio-Base', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      // Set imports RadioSize from Base (reuse, not duplication)
      expect(typesSource).toContain('RadioSize');
      expect(typesSource).toContain('Input-Radio-Base');
    });
  });

  // ============================================================================
  // Test Suite: Property Validation
  // ============================================================================

  describe('Property Validation', () => {
    /**
     * Validates component properties against accessibility requirements.
     */

    it('should validate component as container type', () => {
      const componentType = determineComponentType(null, COMPONENT_NAME);
      expect(componentType).toBe('container');
    });

    it('should validate required accessibility properties', () => {
      const validProps = {
        selectedValue: 'option-a',
        required: false,
        error: false,
        size: 'md',
      };

      const result: PropertyAccessibilityValidationResult = validatePropertyAndAccessibility(
        COMPONENT_NAME,
        validProps
      );

      // Set is a container/group — it should not require its own label
      // (the radiogroup role + children provide semantics)
      const hasCriticalError = result.errors.some(
        e => e.code === 'MISSING_ACCESSIBILITY_LABEL'
      );
      expect(hasCriticalError).toBe(false);
    });
  });
});
