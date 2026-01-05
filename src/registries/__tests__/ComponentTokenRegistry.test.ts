/**
 * @category evergreen
 * @purpose Verify ComponentTokenRegistry provides correct token storage, retrieval, and query operations
 */
/**
 * ComponentTokenRegistry Unit Tests
 * 
 * Tests for component token registration, retrieval, querying, and conflict detection.
 * Follows the same pattern as PrimitiveTokenRegistry and SemanticTokenRegistry tests.
 * 
 * @see Requirements 4.1-4.6 in .kiro/specs/037-component-token-generation-pipeline/requirements.md
 */

import { ComponentTokenRegistry, RegisteredComponentToken } from '../ComponentTokenRegistry';

// Helper to create mock component tokens
const createMockToken = (overrides: Partial<RegisteredComponentToken> = {}): RegisteredComponentToken => ({
  name: 'testcomponent.test.token',
  component: 'TestComponent',
  family: 'spacing',
  value: 8,
  reasoning: 'Test token for unit testing',
  ...overrides,
});

describe('ComponentTokenRegistry', () => {
  beforeEach(() => {
    // Clear registry before each test to ensure isolation
    ComponentTokenRegistry.clear();
  });

  describe('Token Registration', () => {
    test('should register a single token successfully', () => {
      const token = createMockToken({ name: 'buttonicon.inset.medium' });
      
      expect(() => ComponentTokenRegistry.register(token)).not.toThrow();
      expect(ComponentTokenRegistry.has('buttonicon.inset.medium')).toBe(true);
    });

    test('should register batch of tokens successfully', () => {
      const tokens: RegisteredComponentToken[] = [
        createMockToken({ name: 'buttonicon.inset.small', value: 8 }),
        createMockToken({ name: 'buttonicon.inset.medium', value: 10 }),
        createMockToken({ name: 'buttonicon.inset.large', value: 12 }),
      ];

      expect(() => ComponentTokenRegistry.registerBatch('ButtonIcon', tokens)).not.toThrow();
      expect(ComponentTokenRegistry.getAll()).toHaveLength(3);
    });

    test('should store token with all metadata', () => {
      const token = createMockToken({
        name: 'buttonicon.inset.medium',
        component: 'ButtonIcon',
        family: 'spacing',
        value: 10,
        primitiveReference: 'space125',
        reasoning: 'Medium button uses 10px inset for visual balance',
      });

      ComponentTokenRegistry.register(token);
      const retrieved = ComponentTokenRegistry.get('buttonicon.inset.medium');

      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('buttonicon.inset.medium');
      expect(retrieved?.component).toBe('ButtonIcon');
      expect(retrieved?.family).toBe('spacing');
      expect(retrieved?.value).toBe(10);
      expect(retrieved?.primitiveReference).toBe('space125');
      expect(retrieved?.reasoning).toBe('Medium button uses 10px inset for visual balance');
    });

    test('should store token without primitive reference', () => {
      const token = createMockToken({
        name: 'customcomponent.gap.special',
        primitiveReference: undefined,
      });

      ComponentTokenRegistry.register(token);
      const retrieved = ComponentTokenRegistry.get('customcomponent.gap.special');

      expect(retrieved).toBeDefined();
      expect(retrieved?.primitiveReference).toBeUndefined();
    });
  });

  describe('Naming Conflict Detection', () => {
    test('should detect naming conflicts and throw descriptive error', () => {
      const token1 = createMockToken({
        name: 'shared.token.name',
        component: 'ComponentA',
      });
      const token2 = createMockToken({
        name: 'shared.token.name',
        component: 'ComponentB',
      });

      ComponentTokenRegistry.register(token1);

      expect(() => ComponentTokenRegistry.register(token2)).toThrow(
        /Component token conflict.*"shared.token.name".*already registered by.*ComponentA.*Attempted registration by ComponentB/
      );
    });

    test('should preserve original token on conflict', () => {
      const token1 = createMockToken({
        name: 'shared.token.name',
        component: 'ComponentA',
        value: 8,
      });
      const token2 = createMockToken({
        name: 'shared.token.name',
        component: 'ComponentB',
        value: 16,
      });

      ComponentTokenRegistry.register(token1);
      
      try {
        ComponentTokenRegistry.register(token2);
      } catch {
        // Expected to throw
      }

      const retrieved = ComponentTokenRegistry.get('shared.token.name');
      expect(retrieved?.value).toBe(8); // Original value preserved
      expect(retrieved?.component).toBe('ComponentA');
    });

    test('should allow overwrite when explicitly enabled', () => {
      const token1 = createMockToken({
        name: 'shared.token.name',
        component: 'ComponentA',
        value: 8,
      });
      const token2 = createMockToken({
        name: 'shared.token.name',
        component: 'ComponentB',
        value: 16,
      });

      ComponentTokenRegistry.register(token1);
      ComponentTokenRegistry.register(token2, { allowOverwrite: true });

      const retrieved = ComponentTokenRegistry.get('shared.token.name');
      expect(retrieved?.value).toBe(16); // New value
      expect(retrieved?.component).toBe('ComponentB');
    });
  });

  describe('Token Retrieval - getAll()', () => {
    test('should return all registered tokens', () => {
      const tokens: RegisteredComponentToken[] = [
        createMockToken({ name: 'buttonicon.inset.small', component: 'ButtonIcon' }),
        createMockToken({ name: 'buttonicon.inset.large', component: 'ButtonIcon' }),
        createMockToken({ name: 'card.padding.medium', component: 'Card' }),
      ];

      tokens.forEach(t => ComponentTokenRegistry.register(t));

      const allTokens = ComponentTokenRegistry.getAll();
      expect(allTokens).toHaveLength(3);
    });

    test('should return empty array when no tokens registered', () => {
      const allTokens = ComponentTokenRegistry.getAll();
      expect(allTokens).toHaveLength(0);
      expect(Array.isArray(allTokens)).toBe(true);
    });

    test('should return tokens in consistent order', () => {
      const tokens: RegisteredComponentToken[] = [
        createMockToken({ name: 'a.token' }),
        createMockToken({ name: 'b.token' }),
        createMockToken({ name: 'c.token' }),
      ];

      tokens.forEach(t => ComponentTokenRegistry.register(t));

      const allTokens1 = ComponentTokenRegistry.getAll();
      const allTokens2 = ComponentTokenRegistry.getAll();

      expect(allTokens1.map(t => t.name)).toEqual(allTokens2.map(t => t.name));
    });
  });

  describe('Token Retrieval - getByComponent()', () => {
    beforeEach(() => {
      const tokens: RegisteredComponentToken[] = [
        createMockToken({ name: 'buttonicon.inset.small', component: 'ButtonIcon' }),
        createMockToken({ name: 'buttonicon.inset.large', component: 'ButtonIcon' }),
        createMockToken({ name: 'card.padding.medium', component: 'Card' }),
        createMockToken({ name: 'card.padding.large', component: 'Card' }),
        createMockToken({ name: 'input.border.width', component: 'Input' }),
      ];
      tokens.forEach(t => ComponentTokenRegistry.register(t));
    });

    test('should return tokens for specific component', () => {
      const buttonTokens = ComponentTokenRegistry.getByComponent('ButtonIcon');
      
      expect(buttonTokens).toHaveLength(2);
      expect(buttonTokens.every(t => t.component === 'ButtonIcon')).toBe(true);
    });

    test('should return empty array for non-existent component', () => {
      const tokens = ComponentTokenRegistry.getByComponent('NonExistent');
      
      expect(tokens).toHaveLength(0);
      expect(Array.isArray(tokens)).toBe(true);
    });

    test('should filter correctly across multiple components', () => {
      expect(ComponentTokenRegistry.getByComponent('ButtonIcon')).toHaveLength(2);
      expect(ComponentTokenRegistry.getByComponent('Card')).toHaveLength(2);
      expect(ComponentTokenRegistry.getByComponent('Input')).toHaveLength(1);
    });
  });

  describe('Token Retrieval - getByFamily()', () => {
    beforeEach(() => {
      const tokens: RegisteredComponentToken[] = [
        createMockToken({ name: 'buttonicon.inset.small', family: 'spacing' }),
        createMockToken({ name: 'buttonicon.inset.large', family: 'spacing' }),
        createMockToken({ name: 'card.corner.medium', family: 'radius' }),
        createMockToken({ name: 'input.text.size', family: 'fontSize' }),
      ];
      tokens.forEach(t => ComponentTokenRegistry.register(t));
    });

    test('should return tokens for specific family', () => {
      const spacingTokens = ComponentTokenRegistry.getByFamily('spacing');
      
      expect(spacingTokens).toHaveLength(2);
      expect(spacingTokens.every(t => t.family === 'spacing')).toBe(true);
    });

    test('should return empty array for non-existent family', () => {
      const tokens = ComponentTokenRegistry.getByFamily('nonExistentFamily');
      
      expect(tokens).toHaveLength(0);
      expect(Array.isArray(tokens)).toBe(true);
    });

    test('should filter correctly across multiple families', () => {
      expect(ComponentTokenRegistry.getByFamily('spacing')).toHaveLength(2);
      expect(ComponentTokenRegistry.getByFamily('radius')).toHaveLength(1);
      expect(ComponentTokenRegistry.getByFamily('fontSize')).toHaveLength(1);
    });
  });

  describe('Token Existence Check - has()', () => {
    test('should return true for existing token', () => {
      const token = createMockToken({ name: 'buttonicon.inset.medium' });
      ComponentTokenRegistry.register(token);

      expect(ComponentTokenRegistry.has('buttonicon.inset.medium')).toBe(true);
    });

    test('should return false for non-existent token', () => {
      expect(ComponentTokenRegistry.has('nonexistent.token')).toBe(false);
    });

    test('should be case-sensitive', () => {
      const token = createMockToken({ name: 'buttonicon.inset.medium' });
      ComponentTokenRegistry.register(token);

      expect(ComponentTokenRegistry.has('buttonicon.inset.medium')).toBe(true);
      expect(ComponentTokenRegistry.has('ButtonIcon.inset.medium')).toBe(false);
      expect(ComponentTokenRegistry.has('BUTTONICON.INSET.MEDIUM')).toBe(false);
    });
  });

  describe('Token Retrieval - get()', () => {
    test('should return token for existing name', () => {
      const token = createMockToken({ 
        name: 'buttonicon.inset.medium',
        value: 10,
      });
      ComponentTokenRegistry.register(token);

      const retrieved = ComponentTokenRegistry.get('buttonicon.inset.medium');
      expect(retrieved).toBeDefined();
      expect(retrieved?.value).toBe(10);
    });

    test('should return undefined for non-existent token', () => {
      const retrieved = ComponentTokenRegistry.get('nonexistent.token');
      expect(retrieved).toBeUndefined();
    });
  });

  describe('Registry Clear - clear()', () => {
    test('should remove all tokens from registry', () => {
      const tokens: RegisteredComponentToken[] = [
        createMockToken({ name: 'token1' }),
        createMockToken({ name: 'token2' }),
        createMockToken({ name: 'token3' }),
      ];
      tokens.forEach(t => ComponentTokenRegistry.register(t));

      expect(ComponentTokenRegistry.getAll()).toHaveLength(3);

      ComponentTokenRegistry.clear();

      expect(ComponentTokenRegistry.getAll()).toHaveLength(0);
    });

    test('should clear component index', () => {
      const token = createMockToken({ 
        name: 'buttonicon.inset.medium',
        component: 'ButtonIcon',
      });
      ComponentTokenRegistry.register(token);

      expect(ComponentTokenRegistry.getByComponent('ButtonIcon')).toHaveLength(1);

      ComponentTokenRegistry.clear();

      expect(ComponentTokenRegistry.getByComponent('ButtonIcon')).toHaveLength(0);
    });

    test('should clear family index', () => {
      const token = createMockToken({ 
        name: 'buttonicon.inset.medium',
        family: 'spacing',
      });
      ComponentTokenRegistry.register(token);

      expect(ComponentTokenRegistry.getByFamily('spacing')).toHaveLength(1);

      ComponentTokenRegistry.clear();

      expect(ComponentTokenRegistry.getByFamily('spacing')).toHaveLength(0);
    });

    test('should allow re-registration after clear', () => {
      const token = createMockToken({ name: 'buttonicon.inset.medium' });
      
      ComponentTokenRegistry.register(token);
      ComponentTokenRegistry.clear();
      
      expect(() => ComponentTokenRegistry.register(token)).not.toThrow();
      expect(ComponentTokenRegistry.has('buttonicon.inset.medium')).toBe(true);
    });
  });

  describe('Token Removal - remove()', () => {
    test('should remove existing token and return true', () => {
      const token = createMockToken({ name: 'buttonicon.inset.medium' });
      ComponentTokenRegistry.register(token);

      const removed = ComponentTokenRegistry.remove('buttonicon.inset.medium');

      expect(removed).toBe(true);
      expect(ComponentTokenRegistry.has('buttonicon.inset.medium')).toBe(false);
    });

    test('should return false for non-existent token', () => {
      const removed = ComponentTokenRegistry.remove('nonexistent.token');
      expect(removed).toBe(false);
    });

    test('should update component index after removal', () => {
      const tokens: RegisteredComponentToken[] = [
        createMockToken({ name: 'buttonicon.inset.small', component: 'ButtonIcon' }),
        createMockToken({ name: 'buttonicon.inset.large', component: 'ButtonIcon' }),
      ];
      tokens.forEach(t => ComponentTokenRegistry.register(t));

      expect(ComponentTokenRegistry.getByComponent('ButtonIcon')).toHaveLength(2);

      ComponentTokenRegistry.remove('buttonicon.inset.small');

      expect(ComponentTokenRegistry.getByComponent('ButtonIcon')).toHaveLength(1);
    });

    test('should update family index after removal', () => {
      const tokens: RegisteredComponentToken[] = [
        createMockToken({ name: 'token1', family: 'spacing' }),
        createMockToken({ name: 'token2', family: 'spacing' }),
      ];
      tokens.forEach(t => ComponentTokenRegistry.register(t));

      expect(ComponentTokenRegistry.getByFamily('spacing')).toHaveLength(2);

      ComponentTokenRegistry.remove('token1');

      expect(ComponentTokenRegistry.getByFamily('spacing')).toHaveLength(1);
    });
  });

  describe('Registry Statistics - getStats()', () => {
    test('should return accurate statistics', () => {
      const tokens: RegisteredComponentToken[] = [
        createMockToken({ name: 'buttonicon.inset.small', component: 'ButtonIcon', family: 'spacing' }),
        createMockToken({ name: 'buttonicon.inset.large', component: 'ButtonIcon', family: 'spacing' }),
        createMockToken({ name: 'card.padding.medium', component: 'Card', family: 'spacing' }),
        createMockToken({ name: 'card.corner.medium', component: 'Card', family: 'radius' }),
      ];
      tokens.forEach(t => ComponentTokenRegistry.register(t));

      const stats = ComponentTokenRegistry.getStats();

      expect(stats.totalTokens).toBe(4);
      expect(stats.componentCount).toBe(2);
      expect(stats.familyCount).toBe(2);
    });

    test('should return component statistics', () => {
      const tokens: RegisteredComponentToken[] = [
        createMockToken({ name: 'buttonicon.inset.small', component: 'ButtonIcon' }),
        createMockToken({ name: 'buttonicon.inset.large', component: 'ButtonIcon' }),
        createMockToken({ name: 'card.padding.medium', component: 'Card' }),
      ];
      tokens.forEach(t => ComponentTokenRegistry.register(t));

      const stats = ComponentTokenRegistry.getStats();

      expect(stats.componentStats['ButtonIcon']).toBe(2);
      expect(stats.componentStats['Card']).toBe(1);
    });

    test('should return family statistics', () => {
      const tokens: RegisteredComponentToken[] = [
        createMockToken({ name: 'token1', family: 'spacing' }),
        createMockToken({ name: 'token2', family: 'spacing' }),
        createMockToken({ name: 'token3', family: 'radius' }),
      ];
      tokens.forEach(t => ComponentTokenRegistry.register(t));

      const stats = ComponentTokenRegistry.getStats();

      expect(stats.familyStats['spacing']).toBe(2);
      expect(stats.familyStats['radius']).toBe(1);
    });

    test('should return zero statistics for empty registry', () => {
      const stats = ComponentTokenRegistry.getStats();

      expect(stats.totalTokens).toBe(0);
      expect(stats.componentCount).toBe(0);
      expect(stats.familyCount).toBe(0);
    });
  });

  describe('IRegistry Interface Compliance', () => {
    test('should have name property', () => {
      expect(ComponentTokenRegistry.name).toBe('ComponentTokenRegistry');
    });

    test('should implement query() as alias for getAll()', () => {
      const token = createMockToken({ name: 'test.token' });
      ComponentTokenRegistry.register(token);

      const queryResult = ComponentTokenRegistry.query();
      const getAllResult = ComponentTokenRegistry.getAll();

      expect(queryResult).toEqual(getAllResult);
    });
  });
});
