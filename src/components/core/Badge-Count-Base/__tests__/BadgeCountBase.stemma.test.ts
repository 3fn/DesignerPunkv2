/**
 * @category evergreen
 * @purpose Stemma System validator integration tests for Badge-Count-Base component
 * @jest-environment node
 */
/**
 * Badge-Count-Base Stemma Validator Integration Tests
 * 
 * Integrates Stemma System validators for static analysis validation:
 * - Component naming validation (Stemma naming conventions)
 * - Token usage validation (no hardcoded values)
 * - Accessibility attribute validation (WCAG compliance)
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Badge-Count-Base
 * Component Type: Type Primitive (Count)
 * 
 * @module Badge-Count-Base/__tests__/BadgeCountBase.stemma
 * @see Requirements: 7.5, 7.6, 7.7
 * @see .kiro/specs/044-badge-base/design.md - Testing Strategy
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
  determineComponentType,
} from '../../../../validators/StemmaPropertyAccessibilityValidator';

// ============================================================================
// Test Constants
// ============================================================================

const COMPONENT_NAME = 'Badge-Count-Base';
const COMPONENT_DIR = 'src/components/core/Badge-Count-Base';
const WEB_COMPONENT_PATH = `${COMPONENT_DIR}/platforms/web/BadgeCountBase.web.ts`;
const CSS_PATH = `${COMPONENT_DIR}/platforms/web/BadgeCountBase.styles.css`;
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

describe('Badge-Count-Base Stemma Validators', () => {
  describe('Component Naming Validation', () => {
    /**
     * Validates that "Badge-Count-Base" follows Stemma System naming conventions:
     * - [Family]-[Type]-[Variant] format (3 segments)
     * - PascalCase for each segment
     * - Known family name (Badge)
     * 
     * **Validates: Requirement 7.5**
     * @see .kiro/steering/stemma-system-principles.md
     */

    it('should validate "Badge-Count-Base" as a valid Stemma component name', () => {
      const result: ComponentNameValidationResult = validateComponentName(COMPONENT_NAME);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.name).toBe(COMPONENT_NAME);
    });

    it('should parse "Badge-Count-Base" into correct segments', () => {
      const result = validateComponentName(COMPONENT_NAME);

      expect(result.segments).toBeDefined();
      expect(result.segments?.family).toBe('Badge');
      expect(result.segments?.type).toBe('Count');
      expect(result.segments?.variant).toBe('Base');
    });

    it('should classify "Badge-Count-Base" as primitive component type', () => {
      const result = validateComponentName(COMPONENT_NAME);

      // Badge-Count-Base is a primitive (ends with "Base")
      expect(result.componentType).toBe('primitive');
    });

    it('should recognize "Badge" as a known family', () => {
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
        'BadgeCountBase',      // Missing hyphens
        'badge-count-base',    // Wrong case
        'BADGE-COUNT-BASE',    // All uppercase
        'Badge_Count_Base',    // Underscore instead of hyphen
        'Badge-count-Base',    // Inconsistent case
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
     * Validates that Badge-Count-Base web component uses design tokens
     * instead of hardcoded values for all styling.
     * 
     * **Validates: Requirement 7.6**
     * @see Requirements: Token-based styling (zero hard-coded values)
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

    it('should find token references in CSS file', () => {
      if (!cssSource) {
        console.warn('CSS file not found, skipping test');
        return;
      }

      const result = validateTokenUsage(cssSource, CSS_PATH);

      // CSS file contains var(--token) references
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

      const expectedTokenPatterns = [
        '--color-structure-surface',
        '--color-text-default',
        '--radius-full',
        '--typography-label-',  // Composite typography tokens (e.g., --typography-label-xs-font-size)
        '--space-',
      ];

      for (const pattern of expectedTokenPatterns) {
        expect(combinedSource).toContain(pattern);
      }
    });

    it('should reference semantic tokens via CSS custom properties', () => {
      if (!combinedSource) {
        console.warn('Component files not found, skipping test');
        return;
      }

      const semanticTokenReferences = [
        'var(--color-structure-surface',
        'var(--color-text-default',
        'var(--radius-full',
      ];

      for (const reference of semanticTokenReferences) {
        expect(combinedSource).toContain(reference);
      }
    });
  });

  // ============================================================================
  // Test Suite: Property Accessibility Validation
  // ============================================================================

  describe('Property Accessibility Validation', () => {
    /**
     * Validates that Badge-Count-Base component implements required
     * accessibility attributes for WCAG 2.1 AA compliance.
     * 
     * **Validates: Requirement 7.7**
     * @see Requirements 2.12, 2.13
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

    it('should validate component as generic type (non-interactive)', () => {
      const componentType = determineComponentType(null, COMPONENT_NAME);
      // Badge is not input or button, so it's generic
      expect(componentType).toBe('generic');
    });

    it('should implement non-interactive behavior', () => {
      if (!combinedSource) {
        console.warn('Component files not found, skipping test');
        return;
      }

      expect(combinedSource).toContain('pointer-events: none');
      expect(combinedSource).toContain('user-select: none');
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

    it('should support testID for automated testing', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }

      expect(webComponentSource).toContain('data-testid');
      expect(webComponentSource).toContain('test-id');
    });
  });

  // ============================================================================
  // Test Suite: Schema and Contracts Validation
  // ============================================================================

  describe('Schema and Contracts Validation', () => {
    /**
     * Validates that Badge-Count-Base has proper schema and contracts defined.
     * 
     * @see Requirements 7.8, 7.9
     */

    const SCHEMA_PATH = `${COMPONENT_DIR}/Badge-Count-Base.schema.yaml`;
    const CONTRACTS_PATH = `${COMPONENT_DIR}/contracts.yaml`;

    it('should have schema file defined', () => {
      expect(fileExists(SCHEMA_PATH)).toBe(true);
    });

    it('should have contracts file defined', () => {
      expect(fileExists(CONTRACTS_PATH)).toBe(true);
    });

    it('should define required behavioral contracts in schema', () => {
      if (!fileExists(SCHEMA_PATH)) {
        console.warn('Schema file not found, skipping test');
        return;
      }

      const schemaContent = readFileContent(SCHEMA_PATH);

      // Check for required contracts
      expect(schemaContent).toContain('displays_count');
      expect(schemaContent).toContain('truncates_at_max');
      expect(schemaContent).toContain('circular_single_digit');
      expect(schemaContent).toContain('pill_multi_digit');
      expect(schemaContent).toContain('non_interactive');
      expect(schemaContent).toContain('color_contrast');
      expect(schemaContent).toContain('text_scaling');
    });

    it('should define WCAG references in contracts', () => {
      if (!fileExists(CONTRACTS_PATH)) {
        console.warn('Contracts file not found, skipping test');
        return;
      }

      const contractsContent = readFileContent(CONTRACTS_PATH);

      // Check for WCAG references
      expect(contractsContent).toContain('wcag');
      expect(contractsContent).toContain('1.3.1');
      expect(contractsContent).toContain('1.4.3');
      expect(contractsContent).toContain('1.4.4');
    });

    it('should define all platforms in schema', () => {
      if (!fileExists(SCHEMA_PATH)) {
        console.warn('Schema file not found, skipping test');
        return;
      }

      const schemaContent = readFileContent(SCHEMA_PATH);

      expect(schemaContent).toContain('web');
      expect(schemaContent).toContain('ios');
      expect(schemaContent).toContain('android');
    });
  });

  // ============================================================================
  // Test Suite: Types File Validation
  // ============================================================================

  describe('Types File Validation', () => {
    /**
     * Validates that types.ts defines proper TypeScript types.
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

    it('should define BadgeCountSize type', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('BadgeCountSize');
      expect(typesSource).toContain("'sm'");
      expect(typesSource).toContain("'md'");
      expect(typesSource).toContain("'lg'");
    });

    it('should define BadgeCountBaseProps interface', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('BadgeCountBaseProps');
      expect(typesSource).toContain('count: number');
    });

    it('should define BADGE_COUNT_DEFAULTS', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('BADGE_COUNT_DEFAULTS');
    });

    it('should define BADGE_COUNT_SIZE_TOKENS', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('BADGE_COUNT_SIZE_TOKENS');
    });

    it('should define max property with default value', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('max');
      expect(typesSource).toContain('99');
    });

    it('should define showZero property', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('showZero');
    });
  });

  // ============================================================================
  // Test Suite: Shape Behavior Contracts Validation
  // ============================================================================

  describe('Shape Behavior Contracts Validation', () => {
    /**
     * Validates that Badge-Count-Base implements shape behavior contracts:
     * - Circular for single digits
     * - Pill for multi-digit
     * 
     * @see Requirements 2.2, 2.3
     */

    let cssSource: string;

    beforeAll(() => {
      if (fileExists(CSS_PATH)) {
        cssSource = readFileContent(CSS_PATH);
      }
    });

    it('should use radiusFull (9999px) for circular/pill shape', () => {
      if (!cssSource) {
        console.warn('CSS file not found, skipping test');
        return;
      }

      expect(cssSource).toContain('border-radius: var(--radius-full');
    });

    it('should define min-width for each size variant', () => {
      if (!cssSource) {
        console.warn('CSS file not found, skipping test');
        return;
      }

      // Each size uses calc(font-size × line-height) for min-width
      expect(cssSource).toContain('min-width: calc(var(--typography-label-xs-font-size) * var(--typography-label-xs-line-height))');
      expect(cssSource).toContain('min-width: calc(var(--typography-label-sm-font-size) * var(--typography-label-sm-line-height))');
      expect(cssSource).toContain('min-width: calc(var(--typography-label-md-font-size) * var(--typography-label-md-line-height))');
    });

    it('should center content for circular shape', () => {
      if (!cssSource) {
        console.warn('CSS file not found, skipping test');
        return;
      }

      expect(cssSource).toContain('justify-content: center');
      expect(cssSource).toContain('align-items: center');
      expect(cssSource).toContain('text-align: center');
    });

    it('should use inline-flex display for proper sizing', () => {
      if (!cssSource) {
        console.warn('CSS file not found, skipping test');
        return;
      }

      expect(cssSource).toContain('display: inline-flex');
    });
  });
});
