/**
 * @category evergreen
 * @purpose Verify VerticalListButton component tokens are correctly defined and registered
 */
/**
 * Button-VerticalList Component Token Tests
 * 
 * Tests for the VerticalListButton component token definitions.
 * Verifies token registration, value correctness, and primitive references.
 * 
 * @see Requirements 3.4 in .kiro/specs/038-vertical-list-buttons/requirements.md
 * @see Component Tokens Required section in requirements.md
 */

import { ComponentTokenRegistry } from '../../../../registries/ComponentTokenRegistry';
import { 
  VerticalListButtonTokens, 
  getVerticalListButtonPaddingVertical,
  getVerticalListButtonPaddingTokenReference,
  VerticalListButtonTokenReferences
} from '../buttonVerticalList.tokens';

describe('VerticalListButton Component Tokens', () => {
  describe('Token Registration', () => {
    test('should register padding.vertical token with ComponentTokenRegistry', () => {
      expect(ComponentTokenRegistry.has('verticallistbutton.padding.vertical')).toBe(true);
    });

    test('should register token under VerticalListButton component', () => {
      const tokens = ComponentTokenRegistry.getByComponent('VerticalListButton');
      expect(tokens).toHaveLength(1);
      expect(tokens[0].name).toBe('verticallistbutton.padding.vertical');
    });

    test('should register token under spacing family', () => {
      const tokens = ComponentTokenRegistry.getByFamily('spacing');
      const verticalListButtonToken = tokens.find(t => t.name === 'verticallistbutton.padding.vertical');
      expect(verticalListButtonToken).toBeDefined();
    });
  });

  describe('Token Values', () => {
    test('should have correct value for padding.vertical (6px)', () => {
      expect(VerticalListButtonTokens['padding.vertical']).toBe(6);
    });

    test('getVerticalListButtonPaddingVertical should return 6', () => {
      expect(getVerticalListButtonPaddingVertical()).toBe(6);
    });
  });

  describe('Primitive Token References', () => {
    test('should reference space075 primitive token', () => {
      const token = ComponentTokenRegistry.get('verticallistbutton.padding.vertical');
      expect(token?.primitiveReference).toBe('space075');
    });

    test('getVerticalListButtonPaddingTokenReference should return space075', () => {
      expect(getVerticalListButtonPaddingTokenReference()).toBe('space075');
    });

    test('VerticalListButtonTokenReferences should have correct mapping', () => {
      expect(VerticalListButtonTokenReferences.paddingVertical).toBe('space075');
    });
  });

  describe('Token Metadata', () => {
    test('should have correct component name', () => {
      const token = ComponentTokenRegistry.get('verticallistbutton.padding.vertical');
      expect(token?.component).toBe('VerticalListButton');
    });

    test('should have correct family', () => {
      const token = ComponentTokenRegistry.get('verticallistbutton.padding.vertical');
      expect(token?.family).toBe('spacing');
    });

    test('should have reasoning explaining token purpose', () => {
      const token = ComponentTokenRegistry.get('verticallistbutton.padding.vertical');
      expect(token?.reasoning).toContain('6px');
      expect(token?.reasoning).toContain('vertical padding');
    });
  });
});
