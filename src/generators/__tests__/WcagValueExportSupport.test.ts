/**
 * @category evergreen
 * @purpose Verify DTCG and Figma exports handle mode contexts correctly
 */
/**
 * WCAG Export Support Tests (Spec 080 Phase 2)
 *
 * Verifies DTCG mode emission and Figma mode handling.
 * wcagValue inline pattern removed — WCAG overrides now come from theme files.
 */

import { FigmaTransformer } from '../transformers/FigmaTransformer';
import { DTCGFormatGenerator } from '../DTCGFormatGenerator';
import type { DTCGTokenFile, DTCGGroup, DTCGToken } from '../types/DTCGTypes';

describe('WCAG Export Support (Spec 080 Phase 2)', () => {
  describe('DTCG export', () => {
    it('should emit light/dark modes for tokens with dark overrides', () => {
      const generator = new DTCGFormatGenerator();
      const output = generator.generate();
      const sc = output.semanticColor as DTCGGroup;
      // color.action.navigation has a dark override
      const token = sc['color.action.navigation'] as DTCGToken;
      expect(token.$extensions?.designerpunk?.modes?.light).toBeDefined();
      expect(token.$extensions?.designerpunk?.modes?.dark).toBeDefined();
    });

    it('should not emit modes for tokens without mode differentiation', () => {
      const generator = new DTCGFormatGenerator();
      const output = generator.generate();
      const sc = output.semanticColor as DTCGGroup;
      const token = sc['color.action.secondary'] as DTCGToken;
      expect(token.$extensions?.designerpunk?.modes).toBeUndefined();
    });

    it('should not throw when generating', () => {
      const generator = new DTCGFormatGenerator();
      expect(() => generator.generate()).not.toThrow();
    });
  });

  describe('Figma export', () => {
    it('should populate valuesByMode.wcag when DTCG token has modes extension', () => {
      const transformer = new FigmaTransformer();
      const dtcgInput: DTCGTokenFile = {
        $schema: 'https://design-tokens.org/schema.json',
        semanticColor: {
          $type: 'color',
          'color.feedback.info.text': {
            $value: '{color.teal400}',
            $type: 'color',
            $extensions: {
              designerpunk: { family: 'color', modes: { wcag: '{color.purple500}' } } as any
            }
          }
        }
      };
      const result = transformer.transform(dtcgInput);
      const collections = JSON.parse(result.content).collections;
      const semantics = collections.find((c: any) => c.name === 'Semantics');
      const variable = semantics.variables.find((v: any) => v.name.includes('info/text'));
      expect(variable.valuesByMode.wcag).toBeDefined();
      expect(variable.valuesByMode.wcag).not.toEqual(variable.valuesByMode.light);
    });

    it('should not throw when DTCG tokens have no modes extension', () => {
      const transformer = new FigmaTransformer();
      const dtcgInput: DTCGTokenFile = {
        $schema: 'https://design-tokens.org/schema.json',
        semanticColor: {
          $type: 'color',
          'color.feedback.info.text': {
            $value: '{color.teal400}',
            $type: 'color',
            $extensions: {
              designerpunk: { family: 'color' }
            }
          }
        }
      };
      expect(() => transformer.transform(dtcgInput)).not.toThrow();
    });
  });
});
