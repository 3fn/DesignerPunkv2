/**
 * @category evergreen
 * @purpose Verify SemanticOverrideResolver correctness for mode-aware token resolution
 */
/**
 * SemanticOverrideResolver Unit Tests
 *
 * Tests for Level 2 semantic override resolution: validation, light passthrough,
 * dark mode swapping, modifier inheritance, and resolveAll output shape.
 */

import { SemanticOverrideResolver } from '../SemanticOverrideResolver';
import type { SemanticToken } from '../../types/SemanticToken';
import { SemanticCategory } from '../../types/SemanticToken';
import type { SemanticOverrideMap } from '../../tokens/themes/types';
import type { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';

// Minimal mock registry — only `get()` is used by the resolver
const createMockRegistry = (knownTokens: string[]): SemanticTokenRegistry => {
  const tokenMap = new Map<string, SemanticToken>();
  for (const name of knownTokens) {
    tokenMap.set(name, createToken(name));
  }
  return { get: (name: string) => tokenMap.get(name) } as unknown as SemanticTokenRegistry;
};

const createToken = (
  name: string,
  primitiveReferences: Record<string, string> = { value: 'cyan500' },
  modifiers?: SemanticToken['modifiers']
): SemanticToken => ({
  name,
  primitiveReferences,
  modifiers,
  category: SemanticCategory.COLOR,
  context: 'test',
  description: 'test token',
});

describe('SemanticOverrideResolver', () => {
  describe('validate()', () => {
    test('should reject orphaned override key with descriptive error', () => {
      const registry = createMockRegistry(['color.primary']);
      const overrides: SemanticOverrideMap = {
        'color.doesNotExist': { primitiveReferences: { value: 'cyan100' } },
      };
      const resolver = new SemanticOverrideResolver(registry, overrides);
      const result = resolver.validate();

      expect(result.valid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('color.doesNotExist');
    });

    test('should reject component token name (not in semantic registry)', () => {
      const registry = createMockRegistry(['color.primary']);
      const overrides: SemanticOverrideMap = {
        'navTabBar.icon.active': { primitiveReferences: { value: 'cyan100' } },
      };
      const resolver = new SemanticOverrideResolver(registry, overrides);
      const result = resolver.validate();

      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('navTabBar.icon.active');
    });

    test('should pass for valid override map', () => {
      const registry = createMockRegistry(['color.primary', 'color.secondary']);
      const overrides: SemanticOverrideMap = {
        'color.primary': { primitiveReferences: { value: 'cyan100' } },
      };
      const resolver = new SemanticOverrideResolver(registry, overrides);
      const result = resolver.validate();

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('resolve()', () => {
    const registry = createMockRegistry(['color.primary']);
    const overrides: SemanticOverrideMap = {
      'color.primary': { primitiveReferences: { value: 'cyan100' } },
    };

    test('should return token unchanged for light mode', () => {
      const resolver = new SemanticOverrideResolver(registry, overrides);
      const token = createToken('color.primary', { value: 'cyan500' });
      const result = resolver.resolve(token, 'light');

      expect(result).toBe(token); // same reference
    });

    test('should swap primitiveReferences for dark mode with override', () => {
      const resolver = new SemanticOverrideResolver(registry, overrides);
      const token = createToken('color.primary', { value: 'cyan500' });
      const result = resolver.resolve(token, 'dark');

      expect(result.primitiveReferences).toEqual({ value: 'cyan100' });
      expect(result.name).toBe('color.primary');
    });

    test('should return token unchanged for dark mode without override', () => {
      const resolver = new SemanticOverrideResolver(registry, overrides);
      const token = createToken('color.secondary', { value: 'gray300' });
      const result = resolver.resolve(token, 'dark');

      expect(result).toBe(token); // same reference
    });

    test('should handle structural replacement — composite to simple', () => {
      const compositeOverrides: SemanticOverrideMap = {
        'color.surface': { primitiveReferences: { value: 'gray900' } },
      };
      const reg = createMockRegistry(['color.surface']);
      const resolver = new SemanticOverrideResolver(reg, compositeOverrides);
      const token = createToken('color.surface', { color: 'white100', opacity: 'opacity048' });
      const result = resolver.resolve(token, 'dark');

      expect(result.primitiveReferences).toEqual({ value: 'gray900' });
      expect(result.primitiveReferences).not.toHaveProperty('color');
      expect(result.primitiveReferences).not.toHaveProperty('opacity');
    });

    test('should clear base modifiers when override has modifiers: []', () => {
      const overridesWithModifiers: SemanticOverrideMap = {
        'color.primary': { primitiveReferences: { value: 'cyan100' }, modifiers: [] },
      };
      const resolver = new SemanticOverrideResolver(registry, overridesWithModifiers);
      const token = createToken('color.primary', { value: 'cyan500' }, [
        { type: 'opacity', reference: 'opacity080' },
      ]);
      const result = resolver.resolve(token, 'dark');

      expect(result.modifiers).toEqual([]);
    });

    test('should inherit base modifiers when override omits modifiers key', () => {
      const overridesNoModifiers: SemanticOverrideMap = {
        'color.primary': { primitiveReferences: { value: 'cyan100' } },
      };
      const resolver = new SemanticOverrideResolver(registry, overridesNoModifiers);
      const baseModifiers = [{ type: 'opacity' as const, reference: 'opacity080' }];
      const token = createToken('color.primary', { value: 'cyan500' }, baseModifiers);
      const result = resolver.resolve(token, 'dark');

      expect(result.modifiers).toEqual(baseModifiers);
    });

    test('should return token unchanged with empty override map', () => {
      const resolver = new SemanticOverrideResolver(registry, {});
      const token = createToken('color.primary', { value: 'cyan500' });
      const result = resolver.resolve(token, 'dark');

      expect(result).toBe(token);
    });
  });

  describe('resolveAll()', () => {
    test('should produce correct light and dark token sets', () => {
      const registry = createMockRegistry(['color.primary', 'color.secondary']);
      const overrides: SemanticOverrideMap = {
        'color.primary': { primitiveReferences: { value: 'cyan100' } },
      };
      const resolver = new SemanticOverrideResolver(registry, overrides);

      const tokens = [
        createToken('color.primary', { value: 'cyan500' }),
        createToken('color.secondary', { value: 'gray300' }),
      ];
      const result = resolver.resolveAll(tokens);

      // Light: both unchanged
      expect(result.light[0].primitiveReferences).toEqual({ value: 'cyan500' });
      expect(result.light[1].primitiveReferences).toEqual({ value: 'gray300' });

      // Dark: primary overridden, secondary unchanged
      expect(result.dark[0].primitiveReferences).toEqual({ value: 'cyan100' });
      expect(result.dark[1].primitiveReferences).toEqual({ value: 'gray300' });

      // Array lengths match
      expect(result.light).toHaveLength(2);
      expect(result.dark).toHaveLength(2);
    });
  });
});
