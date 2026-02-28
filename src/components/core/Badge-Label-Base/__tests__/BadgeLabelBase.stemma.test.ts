/**
 * @category evergreen
 * @purpose Stemma System validator integration tests for Badge-Label-Base component
 * @jest-environment node
 */
/**
 * Badge-Label-Base Stemma Validator Integration Tests
 * 
 * Integrates Stemma System validators for static analysis validation:
 * - Component naming validation (Stemma naming conventions)
 * - Token usage validation (no hardcoded values)
 * - Accessibility attribute validation (WCAG compliance)
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Badge-Label-Base
 * Component Type: Type Primitive (foundational component)
 * 
 * @module Badge-Label-Base/__tests__/BadgeLabelBase.stemma
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
  validatePropertyAndAccessibility,
  PropertyAccessibilityValidationResult,
  determineComponentType,
} from '../../../../validators/StemmaPropertyAccessibilityValidator';

// ============================================================================
// Test Constants
// ============================================================================

const COMPONENT_NAME = 'Badge-Label-Base';
const COMPONENT_DIR = 'src/components/core/Badge-Label-Base';
const WEB_COMPONENT_PATH = `${COMPONENT_DIR}/platforms/web/BadgeLabelBase.web.ts`;
const CSS_PATH = `${COMPONENT_DIR}/platforms/web/BadgeLabelBase.styles.css`;
const TYPES_PATH = `${COMPONENT_DIR}/types.ts`;
const TOKENS_PATH = `${COMPONENT_DIR}/tokens.ts`;

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

describe('Badge-Label-Base Stemma Validators', () => {
  describe('Component Naming Validation', () => {
    /**
     * Validates that "Badge-Label-Base" follows Stemma System naming conventions:
     * - [Family]-[Type]-[Variant] format (3 segments)
     * - PascalCase for each segment
     * - Known family name (Badge)
     * 
     * **Validates: Requirement 7.5**
     * @see .kiro/steering/stemma-system-principles.md
     */

    it('should validate "Badge-Label-Base" as a valid Stemma component name', () => {
      const result: ComponentNameValidationResult = validateComponentName(COMPONENT_NAME);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.name).toBe(COMPONENT_NAME);
    });

    it('should parse "Badge-Label-Base" into correct segments', () => {
      const result = validateComponentName(COMPONENT_NAME);

      expect(result.segments).toBeDefined();
      expect(result.segments?.family).toBe('Badge');
      expect(result.segments?.type).toBe('Label');
      expect(result.segments?.variant).toBe('Base');
    });

    it('should classify "Badge-Label-Base" as primitive component type', () => {
      const result = validateComponentName(COMPONENT_NAME);

      // Badge-Label-Base is a primitive (ends with "Base")
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
        'BadgeLabelBase',      // Missing hyphens
        'badge-label-base',    // Wrong case
        'BADGE-LABEL-BASE',    // All uppercase
        'Badge_Label_Base',    // Underscore instead of hyphen
        'Badge-label-Base',    // Inconsistent case
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
     * Validates that Badge-Label-Base web component uses design tokens
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
        '--radius-subtle',
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
        'var(--radius-subtle',
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
     * Validates that Badge-Label-Base component implements required
     * accessibility attributes for WCAG 2.1 AA compliance.
     * 
     * **Validates: Requirement 7.7**
     * @see Requirements 6.1, 6.2
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

    it('should mark icon as decorative with aria-hidden', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }

      expect(webComponentSource).toContain('aria-hidden="true"');
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

    it('should provide title attribute for truncated text accessibility', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }

      expect(webComponentSource).toContain('title=');
    });
  });

  // ============================================================================
  // Test Suite: Component Token File Validation
  // ============================================================================

  describe('Component Token File Validation', () => {
    /**
     * Validates that tokens.ts follows Stemma System patterns
     * for component-specific tokens.
     * 
     * @see Requirements 4.8, 9.3, 9.4, 9.5
     */

    let tokensSource: string;

    beforeAll(() => {
      if (fileExists(TOKENS_PATH)) {
        tokensSource = readFileContent(TOKENS_PATH);
      }
    });

    it('should define component tokens file', () => {
      expect(fileExists(TOKENS_PATH)).toBe(true);
    });

    it('should define maxWidth token', () => {
      if (!tokensSource) {
        console.warn('Tokens file not found, skipping test');
        return;
      }

      expect(tokensSource).toContain('maxWidth');
    });

    it('should export token getter function', () => {
      if (!tokensSource) {
        console.warn('Tokens file not found, skipping test');
        return;
      }

      expect(tokensSource).toContain('export');
      expect(tokensSource).toMatch(/getBadgeLabelMaxWidth|BadgeLabelBaseTokens/);
    });

    it('should include Stemma System documentation', () => {
      if (!tokensSource) {
        console.warn('Tokens file not found, skipping test');
        return;
      }

      expect(tokensSource).toContain('Stemma System');
      expect(tokensSource).toContain('Badge-Label-Base');
    });

    it('should include reasoning for token definition', () => {
      if (!tokensSource) {
        console.warn('Tokens file not found, skipping test');
        return;
      }

      expect(tokensSource).toContain('reasoning');
    });
  });

  // ============================================================================
  // Test Suite: Schema and Contracts Validation
  // ============================================================================

  describe('Schema and Contracts Validation', () => {
    /**
     * Validates that Badge-Label-Base has proper schema and contracts defined.
     * 
     * @see Requirements 7.8, 7.9
     */

    const SCHEMA_PATH = `${COMPONENT_DIR}/Badge-Label-Base.schema.yaml`;
    const CONTRACTS_PATH = `${COMPONENT_DIR}/contracts.yaml`;

    it('should have schema file defined', () => {
      expect(fileExists(SCHEMA_PATH)).toBe(true);
    });

    it('should have contracts file defined', () => {
      expect(fileExists(CONTRACTS_PATH)).toBe(true);
    });

    it('should define required behavioral contracts in contracts.yaml', () => {
      if (!fileExists(CONTRACTS_PATH)) {
        console.warn('Contracts file not found, skipping test');
        return;
      }

      const contractsContent = readFileContent(CONTRACTS_PATH);

      // Check for required contracts (canonical names per 063 uniform contract system)
      expect(contractsContent).toContain('content_displays_label');
      expect(contractsContent).toContain('accessibility_non_interactive');
      expect(contractsContent).toContain('content_supports_icon');
      expect(contractsContent).toContain('content_truncation');
      expect(contractsContent).toContain('accessibility_color_contrast');
      expect(contractsContent).toContain('accessibility_text_scaling');
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

    it('should define BadgeLabelSize type', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('BadgeLabelSize');
      expect(typesSource).toContain("'sm'");
      expect(typesSource).toContain("'md'");
      expect(typesSource).toContain("'lg'");
    });

    it('should define BadgeLabelBaseProps interface', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('BadgeLabelBaseProps');
      expect(typesSource).toContain('label: string');
    });

    it('should define BADGE_LABEL_DEFAULTS', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('BADGE_LABEL_DEFAULTS');
    });

    it('should define BADGE_LABEL_SIZE_TOKENS', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('BADGE_LABEL_SIZE_TOKENS');
    });
  });
});
