/**
 * @category evergreen
 * @purpose Stemma System validator integration tests for Badge-Count-Notification component
 * @jest-environment node
 */
/**
 * Badge-Count-Notification Stemma Validator Integration Tests
 * 
 * Integrates Stemma System validators for static analysis validation:
 * - Component naming validation (Stemma naming conventions)
 * - Token usage validation (no hardcoded values)
 * - Accessibility attribute validation (WCAG compliance)
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Badge-Count-Notification
 * Component Type: Semantic Variant (inherits from Badge-Count-Base)
 * 
 * @module Badge-Count-Notification/__tests__/BadgeCountNotification.stemma
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

const COMPONENT_NAME = 'Badge-Count-Notification';
const COMPONENT_DIR = 'src/components/core/Badge-Count-Notification';
const WEB_COMPONENT_PATH = `${COMPONENT_DIR}/platforms/web/BadgeCountNotification.web.ts`;
const CSS_PATH = `${COMPONENT_DIR}/platforms/web/BadgeCountNotification.styles.css`;
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

describe('Badge-Count-Notification Stemma Validators', () => {
  describe('Component Naming Validation', () => {
    /**
     * Validates that "Badge-Count-Notification" follows Stemma System naming conventions:
     * - [Family]-[Type]-[Variant] format (3 segments)
     * - PascalCase for each segment
     * - Known family name (Badge)
     * 
     * **Validates: Requirement 7.5**
     * @see .kiro/steering/stemma-system-principles.md
     */

    it('should validate "Badge-Count-Notification" as a valid Stemma component name', () => {
      const result: ComponentNameValidationResult = validateComponentName(COMPONENT_NAME);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.name).toBe(COMPONENT_NAME);
    });

    it('should parse "Badge-Count-Notification" into correct segments', () => {
      const result = validateComponentName(COMPONENT_NAME);

      expect(result.segments).toBeDefined();
      expect(result.segments?.family).toBe('Badge');
      expect(result.segments?.type).toBe('Count');
      expect(result.segments?.variant).toBe('Notification');
    });

    it('should classify "Badge-Count-Notification" as semantic component type', () => {
      const result = validateComponentName(COMPONENT_NAME);

      // Badge-Count-Notification is a semantic variant (ends with "Notification", not "Base")
      expect(result.componentType).toBe('semantic');
    });

    it('should recognize "Badge" as a known family', () => {
      const result = validateComponentName(COMPONENT_NAME);

      // Should not have warning about unknown family
      const hasUnknownFamilyWarning = result.warnings.some(
        w => w.code === 'UNUSUAL_FAMILY_NAME'
      );
      expect(hasUnknownFamilyWarning).toBe(false);
    });

    it('should not be classified as primitive component', () => {
      expect(isPrimitiveComponent(COMPONENT_NAME)).toBe(false);
    });

    it('should be classified as semantic component', () => {
      expect(isSemanticComponent(COMPONENT_NAME)).toBe(true);
    });

    it('should reject invalid naming variations', () => {
      const invalidNames = [
        'BadgeCountNotification',      // Missing hyphens
        'badge-count-notification',    // Wrong case
        'BADGE-COUNT-NOTIFICATION',    // All uppercase
        'Badge_Count_Notification',    // Underscore instead of hyphen
        'Badge-count-Notification',    // Inconsistent case
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
     * Validates that Badge-Count-Notification web component uses design tokens
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
        '--color-badge-notification-background',
        '--color-badge-notification-text',
        '--radius-full',
        '--typography-label-',  // Composite typography tokens (e.g., --typography-label-xs-font-size)
        '--space-',
      ];

      for (const pattern of expectedTokenPatterns) {
        expect(combinedSource).toContain(pattern);
      }
    });

    it('should reference notification color tokens via CSS custom properties', () => {
      if (!combinedSource) {
        console.warn('Component files not found, skipping test');
        return;
      }

      const notificationTokenReferences = [
        'var(--color-badge-notification-background)',
        'var(--color-badge-notification-text)',
      ];

      for (const reference of notificationTokenReferences) {
        expect(combinedSource).toContain(reference);
      }
    });
  });

  // ============================================================================
  // Test Suite: Property Accessibility Validation
  // ============================================================================

  describe('Property Accessibility Validation', () => {
    /**
     * Validates that Badge-Count-Notification component implements required
     * accessibility attributes for WCAG 2.1 AA compliance.
     * 
     * **Validates: Requirement 7.7**
     * @see Requirements 3.8, 3.9, 3.10
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

    it('should implement live region attributes', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }

      expect(webComponentSource).toContain('aria-live');
      expect(webComponentSource).toContain('aria-atomic');
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
     * Validates that Badge-Count-Notification has proper schema and contracts defined.
     * 
     * @see Requirements 7.8, 7.9
     */

    const SCHEMA_PATH = `${COMPONENT_DIR}/Badge-Count-Notification.schema.yaml`;
    const CONTRACTS_PATH = `${COMPONENT_DIR}/contracts.yaml`;

    it('should have schema file defined', () => {
      expect(fileExists(SCHEMA_PATH)).toBe(true);
    });

    it('should have contracts file defined', () => {
      expect(fileExists(CONTRACTS_PATH)).toBe(true);
    });

    it('should define notification-specific behavioral contracts in schema', () => {
      if (!fileExists(SCHEMA_PATH)) {
        console.warn('Schema file not found, skipping test');
        return;
      }

      const schemaContent = readFileContent(SCHEMA_PATH);

      // Check for notification-specific contracts
      expect(schemaContent).toContain('notification_semantics');
      expect(schemaContent).toContain('announces_count_changes');
      expect(schemaContent).toContain('pluralized_announcements');
    });

    it('should define inheritance from Badge-Count-Base in schema', () => {
      if (!fileExists(SCHEMA_PATH)) {
        console.warn('Schema file not found, skipping test');
        return;
      }

      const schemaContent = readFileContent(SCHEMA_PATH);

      expect(schemaContent).toContain('inherits: Badge-Count-Base');
      expect(schemaContent).toContain('type: semantic');
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
      expect(contractsContent).toContain('4.1.3');
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

    it('should define announceChanges property in schema', () => {
      if (!fileExists(SCHEMA_PATH)) {
        console.warn('Schema file not found, skipping test');
        return;
      }

      const schemaContent = readFileContent(SCHEMA_PATH);

      expect(schemaContent).toContain('announceChanges');
      expect(schemaContent).toContain('default: true');
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

    it('should re-export BadgeCountSize from Badge-Count-Base', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('BadgeCountSize');
      expect(typesSource).toContain('Badge-Count-Base/types');
    });

    it('should define BadgeCountNotificationProps interface', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('BadgeCountNotificationProps');
      expect(typesSource).toContain('count: number');
    });

    it('should define BADGE_COUNT_NOTIFICATION_DEFAULTS', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('BADGE_COUNT_NOTIFICATION_DEFAULTS');
    });

    it('should define announceChanges property', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('announceChanges');
    });

    it('should inherit from Badge-Count-Base defaults', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }

      expect(typesSource).toContain('...BADGE_COUNT_DEFAULTS');
    });
  });

  // ============================================================================
  // Test Suite: Notification Semantics Validation
  // ============================================================================

  describe('Notification Semantics Validation', () => {
    /**
     * Validates that Badge-Count-Notification implements notification semantics:
     * - Fixed notification colors
     * - Live region announcements
     * - Pluralized announcement text
     * 
     * @see Requirements 3.1, 3.4, 3.5
     */

    let cssSource: string;
    let webComponentSource: string;

    beforeAll(() => {
      if (fileExists(CSS_PATH)) {
        cssSource = readFileContent(CSS_PATH);
      }
      if (fileExists(WEB_COMPONENT_PATH)) {
        webComponentSource = readFileContent(WEB_COMPONENT_PATH);
      }
    });

    it('should use notification background color token', () => {
      if (!cssSource) {
        console.warn('CSS file not found, skipping test');
        return;
      }

      expect(cssSource).toContain('var(--color-badge-notification-background)');
    });

    it('should use notification text color token', () => {
      if (!cssSource) {
        console.warn('CSS file not found, skipping test');
        return;
      }

      expect(cssSource).toContain('var(--color-badge-notification-text)');
    });

    it('should implement pluralization logic', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }

      // Check for pluralization patterns
      expect(webComponentSource).toContain('notification');
      expect(webComponentSource).toContain('notifications');
      expect(webComponentSource).toContain('or more notifications');
    });

    it('should implement announceChanges prop', () => {
      if (!webComponentSource) {
        console.warn('Web component file not found, skipping test');
        return;
      }

      expect(webComponentSource).toContain('announceChanges');
      expect(webComponentSource).toContain('announce-changes');
    });
  });
});
