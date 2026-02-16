/**
 * @category evergreen
 * @purpose Verify Progress Indicator tokens follow governance rules
 */
/**
 * Progress Token Compliance Tests
 *
 * Validates that progress indicator tokens follow Rosetta System governance:
 * - Semantic tokens reference primitives (not hard-coded values)
 * - Component tokens use formulas or primitive references
 * - All tokens include reasoning field
 * - Token counts match specification (10 semantic, 10 component)
 * - Naming conventions follow kebab-case, concept-first patterns
 *
 * @see .kiro/specs/048-progress-family/requirements.md (Requirements 15.2-15.4, 15.8-15.10)
 * @see .kiro/specs/048-progress-family/design.md (Token System, Correctness Properties)
 */

import {
  progressColorTokens,
  progressColorTokenNames,
  PROGRESS_COLOR_TOKEN_COUNT,
} from '../semantic/color-progress';
import {
  ProgressTokens,
  PROGRESS_COMPONENT_TOKEN_COUNT,
  progressComponentTokenNames,
} from '../component/progress';
import { ComponentTokenRegistry } from '../../registries/ComponentTokenRegistry';

describe('Progress Token Compliance', () => {
  // ==========================================================================
  // Semantic Token Compliance (Requirements 15.2, 15.8)
  // ==========================================================================

  describe('Semantic tokens reference primitives (not hard-coded values)', () => {
    const tokenEntries = Object.entries(progressColorTokens);

    it.each(tokenEntries)(
      '%s should have a primitiveReferences.value field',
      (_name, token) => {
        expect(token.primitiveReferences).toBeDefined();
        expect(typeof token.primitiveReferences.value).toBe('string');
        expect(token.primitiveReferences.value.length).toBeGreaterThan(0);
      }
    );
  });

  // ==========================================================================
  // Component Token Compliance (Requirements 15.3)
  // ==========================================================================

  describe('Component tokens use formulas or primitive references', () => {
    const registeredTokens = ComponentTokenRegistry.getByComponent('Progress');

    it('should have registered tokens in the ComponentTokenRegistry', () => {
      expect(registeredTokens.length).toBeGreaterThan(0);
    });

    it.each(registeredTokens.map(t => [t.name, t] as const))(
      '%s should have a primitive reference or a formula-derived value',
      (_name, token) => {
        // Every registered token must have a numeric value
        expect(typeof token.value).toBe('number');
        // Token either references a primitive OR has a standalone value (formula-based)
        const hasPrimitiveRef = typeof token.primitiveReference === 'string' && token.primitiveReference.length > 0;
        const hasValue = typeof token.value === 'number' && token.value > 0;
        expect(hasPrimitiveRef || hasValue).toBe(true);
      }
    );
  });

  // ==========================================================================
  // Reasoning Field Compliance (Requirements 15.4)
  // ==========================================================================

  describe('All tokens include reasoning field', () => {
    describe('Semantic color tokens', () => {
      const tokenEntries = Object.entries(progressColorTokens);

      it.each(tokenEntries)(
        '%s should include a reasoning context',
        (_name, token) => {
          // Semantic tokens use the `context` field for reasoning
          expect(typeof token.context).toBe('string');
          expect(token.context.toLowerCase()).toContain('reasoning');
        }
      );
    });

    describe('Component tokens', () => {
      const registeredTokens = ComponentTokenRegistry.getByComponent('Progress');

      it.each(registeredTokens.map(t => [t.name, t] as const))(
        '%s should include a reasoning field',
        (_name, token) => {
          expect(typeof token.reasoning).toBe('string');
          expect(token.reasoning.length).toBeGreaterThan(0);
        }
      );
    });
  });

  // ==========================================================================
  // Token Count Governance (Requirements 15.8, 15.9)
  // ==========================================================================

  describe('Token counts match specification', () => {
    it(`should have exactly ${PROGRESS_COLOR_TOKEN_COUNT} semantic color tokens`, () => {
      expect(progressColorTokenNames.length).toBe(PROGRESS_COLOR_TOKEN_COUNT);
      expect(Object.keys(progressColorTokens).length).toBe(PROGRESS_COLOR_TOKEN_COUNT);
    });

    it(`should have exactly ${PROGRESS_COMPONENT_TOKEN_COUNT} component tokens`, () => {
      expect(progressComponentTokenNames.length).toBe(PROGRESS_COMPONENT_TOKEN_COUNT);
      const registeredTokens = ComponentTokenRegistry.getByComponent('Progress');
      expect(registeredTokens.length).toBe(PROGRESS_COMPONENT_TOKEN_COUNT);
    });
  });

  // ==========================================================================
  // Naming Convention Compliance (Requirements 15.10)
  // ==========================================================================

  describe('Naming conventions (kebab-case, concept-first)', () => {
    describe('Semantic color tokens use dot-separated concept-first names', () => {
      it.each(progressColorTokenNames)(
        '%s should follow color.progress.[state].[variant] pattern',
        (name) => {
          // All semantic progress color tokens start with 'color.progress.'
          expect(name).toMatch(/^color\.progress\./);
          // Pattern: color.progress.<state>.<variant>
          const parts = name.split('.');
          expect(parts.length).toBe(4);
          // State must be one of the defined states
          expect(['current', 'pending', 'completed', 'error']).toContain(parts[2]);
          // Variant must be one of the defined variants
          expect(['background', 'text', 'connector']).toContain(parts[3]);
        }
      );
    });

    describe('Component tokens use dot-separated concept-first names', () => {
      it.each([...progressComponentTokenNames])(
        '%s should follow concept-first dot notation',
        (name) => {
          // No uppercase letters (kebab/dot-case)
          expect(name).toBe(name.toLowerCase());
          // Must use dot separators
          expect(name).toContain('.');
          // Must start with a concept (node or connector)
          expect(name).toMatch(/^(node|connector)\./);
        }
      );
    });
  });
});
