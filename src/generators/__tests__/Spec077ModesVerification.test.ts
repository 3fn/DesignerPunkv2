/**
 * @category evergreen
 * @purpose Verify modes extension behavior in DTCG and Figma outputs
 */
/**
 * Spec 077 — Modes Verification Tests
 *
 * Verifies the modes extension schema and Figma mode behavior
 * for tokens with and without wcagValue.
 */

import { DTCGFormatGenerator } from '../DTCGFormatGenerator';
import { FigmaTransformer } from '../transformers/FigmaTransformer';
import type { DTCGGroup, DTCGToken } from '../types/DTCGTypes';

describe('Spec 077 — Modes Verification', () => {
  const generator = new DTCGFormatGenerator();
  const output = generator.generate();
  const semanticColors = output.semanticColor as DTCGGroup;

  describe('DTCG modes extension', () => {
    it('should not have modes when token has no wcagValue', () => {
      const token = semanticColors['color.action.secondary'] as DTCGToken;
      expect(token.$extensions?.designerpunk?.modes).toBeUndefined();
    });

    it('should use alias syntax for modes values', () => {
      const token = semanticColors['color.action.primary'] as DTCGToken;
      expect(token.$extensions?.designerpunk?.modes?.wcag).toMatch(/^\{color\..+\}$/);
    });

    it('should not change $value when wcagValue is present', () => {
      const token = semanticColors['color.action.primary'] as DTCGToken;
      expect(token.$value).toBe('{color.cyan300}');
      expect(token.$extensions?.designerpunk?.modes?.wcag).toBe('{color.teal300}');
    });
  });

  describe('Figma modes', () => {
    const transformer = new FigmaTransformer();
    const result = transformer.transform(output);
    const collections = JSON.parse(result.content).collections;
    const semantics = collections.find((c: any) => c.name === 'Semantics');
    const primitives = collections.find((c: any) => c.name === 'Primitives');

    it('should include wcag in Semantics collection modes', () => {
      expect(semantics.modes).toContain('wcag');
    });

    it('should fall back to light value when token has no wcag override', () => {
      const variable = semantics.variables.find((v: any) => v.name.includes('text/default'));
      expect(variable.valuesByMode.wcag).toEqual(variable.valuesByMode.light);
    });

    it('should not include wcag in Primitives collection modes', () => {
      expect(primitives.modes).not.toContain('wcag');
    });
  });
});
