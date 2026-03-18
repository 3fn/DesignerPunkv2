/**
 * @category evergreen
 * @purpose Verify modes extension behavior in DTCG and Figma outputs
 */
/**
 * Spec 077 — Modes Verification Tests
 *
 * Verifies the modes extension schema and Figma mode behavior.
 * wcagValue inline overrides removed in Spec 080 Phase 2 — WCAG modes
 * will be emitted from 4-context generation (Task 10.5).
 */

import { DTCGFormatGenerator } from '../DTCGFormatGenerator';
import { FigmaTransformer } from '../transformers/FigmaTransformer';
import type { DTCGGroup, DTCGToken } from '../types/DTCGTypes';

describe('Spec 077 — Modes Verification', () => {
  const generator = new DTCGFormatGenerator();
  const output = generator.generate();
  const semanticColors = output.semanticColor as DTCGGroup;

  describe('DTCG modes extension', () => {
    it('should not have modes when token has no mode differentiation', () => {
      const token = semanticColors['color.action.secondary'] as DTCGToken;
      expect(token.$extensions?.designerpunk?.modes).toBeUndefined();
    });

    it('should emit light/dark modes for tokens with dark overrides', () => {
      // color.action.navigation has a dark override (cyan500 → cyan100)
      const token = semanticColors['color.action.navigation'] as DTCGToken;
      const modes = token.$extensions?.designerpunk?.modes;
      expect(modes?.light).toBeDefined();
      expect(modes?.dark).toBeDefined();
    });
  });

  describe('Figma modes', () => {
    const transformer = new FigmaTransformer();
    const result = transformer.transform(output);
    const collections = JSON.parse(result.content).collections;
    const semantics = collections.find((c: any) => c.name === 'Semantics');
    const primitives = collections.find((c: any) => c.name === 'Primitives');

    it('should not include wcag in Primitives collection modes', () => {
      expect(primitives.modes).not.toContain('wcag');
    });

    it('should include light mode in Semantics collection', () => {
      expect(semantics.modes).toContain('light');
    });
  });
});
