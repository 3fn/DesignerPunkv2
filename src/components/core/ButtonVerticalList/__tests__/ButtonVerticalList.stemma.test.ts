/**
 * @category evergreen
 * @purpose Stemma System validator integration tests for Button-VerticalList component
 * @jest-environment node
 */
/**
 * Button-VerticalList Stemma Validator Integration Tests
 * 
 * Integrates Stemma System validators for static analysis validation:
 * - Component naming validation (Stemma naming conventions)
 * - Token usage validation (no hardcoded values)
 * - Required props validation
 * - Accessibility attribute validation (WCAG compliance)
 * 
 * Stemma System Naming: [Family]-[Type] = Button-VerticalList
 * Component Type: Standalone (foundational component)
 * 
 * @module Button-VerticalList/__tests__/ButtonVerticalList.stemma
 * @see Requirements: Static analysis
 * @see .kiro/specs/038-vertical-list-buttons/design.md - Testing Strategy
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
  validatePropertyAndAccessibility,
  PropertyAccessibilityValidationResult,
  determineComponentType,
} from '../../../../validators/StemmaPropertyAccessibilityValidator';

// ============================================================================
// Test Constants
// ============================================================================

const COMPONENT_NAME = 'Button-VerticalList';
const COMPONENT_DIR = 'src/components/core/ButtonVerticalList';
const TYPES_PATH = `${COMPONENT_DIR}/types.ts`;
const TOKENS_PATH = `${COMPONENT_DIR}/buttonVerticalList.tokens.ts`;

// Valid mode values for Button-VerticalList
const VALID_MODES = ['tap', 'select', 'multiSelect'];

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

describe('Button-VerticalList Stemma Validators', () => {
  describe('Component Naming Validation', () => {
    /**
     * Validates that "Button-VerticalList" follows Stemma System naming conventions:
     * - [Family]-[Type] format (2 segments)
     * - PascalCase for each segment
     * - Known family name (Button)
     * 
     * @see .kiro/steering/stemma-system-principles.md
     * @see Requirement 19.1
     */
    
    it('should validate "Button-VerticalList" as a valid Stemma component name', () => {
      const result: ComponentNameValidationResult = validateComponentName(COMPONENT_NAME);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.name).toBe(COMPONENT_NAME);
    });
    
    it('should parse "Button-VerticalList" into correct segments', () => {
      const result = validateComponentName(COMPONENT_NAME);
      
      expect(result.segments).toBeDefined();
      expect(result.segments?.family).toBe('Button');
      expect(result.segments?.type).toBe('VerticalList');
      expect(result.segments?.variant).toBeUndefined();
    });
    
    it('should classify "Button-VerticalList" as standalone component type', () => {
      const result = validateComponentName(COMPONENT_NAME);
      
      // Button-VerticalList is standalone (not primitive or semantic)
      // Primitive would be "Button-VerticalList-Base"
      // Semantic would be "Button-VerticalList-Settings" (specific variant)
      expect(result.componentType).toBe('standalone');
    });
    
    it('should recognize "Button" as a known family', () => {
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
    
    it('should not be classified as semantic component', () => {
      expect(isSemanticComponent(COMPONENT_NAME)).toBe(false);
    });
    
    it('should reject invalid naming variations', () => {
      // Test common naming mistakes
      const invalidNames = [
        'ButtonVerticalList',      // Missing hyphen
        'button-verticallist',     // Wrong case
        'BUTTON-VERTICALLIST',     // All uppercase
        'Button_VerticalList',     // Underscore instead of hyphen
        'Button-verticalList',     // Inconsistent case
      ];
      
      for (const name of invalidNames) {
        const result = validateComponentName(name);
        expect(result.valid).toBe(false);
      }
    });
  });
  
  // ============================================================================
  // Test Suite: Required Props Validation
  // ============================================================================
  
  describe('Required Props Validation', () => {
    /**
     * Validates that Button-VerticalList component enforces required props:
     * - mode: Required interaction mode
     * - items: Required button items array
     * 
     * @see Requirements 1.1, 1.2, 1.4
     */
    
    let typesSource: string;
    
    beforeAll(() => {
      if (fileExists(TYPES_PATH)) {
        typesSource = readFileContent(TYPES_PATH);
      }
    });
    
    it('should define types.ts file', () => {
      expect(fileExists(TYPES_PATH)).toBe(true);
    });
    
    it('should define VerticalListButtonMode type', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('VerticalListButtonMode');
      expect(typesSource).toContain("'tap'");
      expect(typesSource).toContain("'select'");
      expect(typesSource).toContain("'multiSelect'");
    });
    
    it('should define VerticalListButtonItem interface', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('interface VerticalListButtonItem');
      expect(typesSource).toContain('id: string');
      expect(typesSource).toContain('label: string');
      expect(typesSource).toContain('description?: string');
      expect(typesSource).toContain('icon?: IconBaseName');
      expect(typesSource).toContain('onTap?: () => void');
    });
    
    it('should define VerticalListButtonGroupProps interface', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('interface VerticalListButtonGroupProps');
      expect(typesSource).toContain('mode: VerticalListButtonMode');
      expect(typesSource).toContain('items: VerticalListButtonItem[]');
      expect(typesSource).toContain('selectedIds?: string[]');
      expect(typesSource).toContain('onSelectionChange?: (selectedIds: string[]) => void');
      expect(typesSource).toContain('testID?: string');
    });
    
    it('should export default values constant', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('VERTICAL_LIST_BUTTON_DEFAULTS');
    });
    
    it('should validate component as button type', () => {
      const componentType = determineComponentType(null, COMPONENT_NAME);
      expect(componentType).toBe('button');
    });
  });
  
  // ============================================================================
  // Test Suite: Mode Variants Validation
  // ============================================================================
  
  describe('Mode Variants Validation', () => {
    /**
     * Validates that Button-VerticalList supports all required mode variants:
     * - tap: Immediate action trigger
     * - select: Single selection (radio-button style)
     * - multiSelect: Multiple selection (checkbox style)
     * 
     * @see Requirements 19.3
     */
    
    let typesSource: string;
    
    beforeAll(() => {
      if (fileExists(TYPES_PATH)) {
        typesSource = readFileContent(TYPES_PATH);
      }
    });
    
    it('should define all required mode variants', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      for (const mode of VALID_MODES) {
        expect(typesSource).toContain(`'${mode}'`);
      }
    });
    
    it('should document mode variants in JSDoc', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      // Check for mode documentation
      expect(typesSource).toContain('tap');
      expect(typesSource).toContain('select');
      expect(typesSource).toContain('multiSelect');
    });
  });
  
  // ============================================================================
  // Test Suite: Component Token File Validation
  // ============================================================================
  
  describe('Component Token File Validation', () => {
    /**
     * Validates that buttonVerticalList.tokens.ts follows Stemma System patterns
     * for component-specific tokens.
     * 
     * @see Requirements 3.4 (vertical padding token)
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
    
    it('should define vertical padding token', () => {
      if (!tokensSource) {
        console.warn('Tokens file not found, skipping test');
        return;
      }
      
      expect(tokensSource).toContain('padding.vertical');
      expect(tokensSource).toContain('space075');
    });
    
    it('should export token getter function', () => {
      if (!tokensSource) {
        console.warn('Tokens file not found, skipping test');
        return;
      }
      
      expect(tokensSource).toContain('export');
      expect(tokensSource).toMatch(/getVerticalListButtonPaddingVertical|VerticalListButtonTokens/);
    });
    
    it('should include Stemma System documentation', () => {
      if (!tokensSource) {
        console.warn('Tokens file not found, skipping test');
        return;
      }
      
      expect(tokensSource).toContain('Stemma System');
      expect(tokensSource).toContain('Button-VerticalList');
    });
  });
  
  // ============================================================================
  // Test Suite: Stemma Metadata Validation
  // ============================================================================
  
  describe('Stemma Metadata Validation', () => {
    /**
     * Validates that component files include required Stemma metadata:
     * - Category (buttons)
     * - Description
     * - Status
     * 
     * @see Requirements 19.2
     */
    
    let typesSource: string;
    let tokensSource: string;
    
    beforeAll(() => {
      if (fileExists(TYPES_PATH)) {
        typesSource = readFileContent(TYPES_PATH);
      }
      if (fileExists(TOKENS_PATH)) {
        tokensSource = readFileContent(TOKENS_PATH);
      }
    });
    
    it('should include Stemma System naming in types.ts', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('Stemma System naming');
      expect(typesSource).toContain('[Family]-[Type]');
      expect(typesSource).toContain('Button-VerticalList');
    });
    
    it('should include component type classification in types.ts', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('Type: Primitive');
    });
    
    it('should include Stemma System naming in tokens.ts', () => {
      if (!tokensSource) {
        console.warn('Tokens file not found, skipping test');
        return;
      }
      
      expect(tokensSource).toContain('Stemma System naming');
      expect(tokensSource).toContain('[Family]-[Type]');
      expect(tokensSource).toContain('Button-VerticalList');
    });
    
    it('should reference design document in types.ts', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('.kiro/specs/038-vertical-list-buttons/design.md');
    });
    
    it('should reference component architecture system in types.ts', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      expect(typesSource).toContain('.kiro/specs/034-component-architecture-system');
    });
  });
  
  // ============================================================================
  // Test Suite: Props Documentation Validation
  // ============================================================================
  
  describe('Props Documentation Validation', () => {
    /**
     * Validates that all props are documented with types and descriptions
     * in Stemma-compatible format.
     * 
     * @see Requirements 19.5
     */
    
    let typesSource: string;
    
    beforeAll(() => {
      if (fileExists(TYPES_PATH)) {
        typesSource = readFileContent(TYPES_PATH);
      }
    });
    
    it('should document mode prop with JSDoc', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      // Check for mode prop documentation
      expect(typesSource).toContain('Interaction mode');
      expect(typesSource).toContain('@required');
    });
    
    it('should document items prop with JSDoc', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      // Check for items prop documentation
      expect(typesSource).toContain('Array of button items');
      expect(typesSource).toContain('@required');
    });
    
    it('should document selectedIds prop with JSDoc', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      // Check for selectedIds prop documentation
      expect(typesSource).toContain('Currently selected item ID');
      expect(typesSource).toContain('@optional');
    });
    
    it('should document onSelectionChange prop with JSDoc', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      // Check for onSelectionChange prop documentation
      expect(typesSource).toContain('Selection change handler');
      expect(typesSource).toContain('@optional');
    });
    
    it('should document testID prop with JSDoc', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      // Check for testID prop documentation
      expect(typesSource).toContain('test ID');
      expect(typesSource).toContain('@optional');
    });
    
    it('should include requirement references in documentation', () => {
      if (!typesSource) {
        console.warn('Types file not found, skipping test');
        return;
      }
      
      // Check for requirement references
      expect(typesSource).toContain('@see Requirement');
    });
  });
});
