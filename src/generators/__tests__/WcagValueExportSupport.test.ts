/**
 * @category evergreen
 * @purpose Verify DTCG and Figma exports correctly handle wcagValue via modes extension
 */
/**
 * wcagValue Export Support (Spec 077)
 *
 * Replaces guard rail tests from Spec 076 Task 1.4. Verifies that DTCG and
 * Figma exports produce correct modes output for tokens with wcagValue.
 * Test fixtures preserved from original guard rail tests.
 */

import { SemanticCategory } from '../../types/SemanticToken';
import type { SemanticToken } from '../../types/SemanticToken';
import { FigmaTransformer } from '../transformers/FigmaTransformer';
import type { DTCGTokenFile, DTCGGroup, DTCGToken } from '../types/DTCGTypes';

// --- DTCG tests ---

const MOCK_WCAG_TOKEN: Omit<SemanticToken, 'primitiveTokens'> = {
  name: 'color.feedback.info.text',
  primitiveReferences: { value: 'teal400', wcagValue: 'purple500' },
  category: SemanticCategory.COLOR,
  context: 'Test',
  description: 'Test'
};

const originalColorTokens = jest.requireActual('../../tokens/semantic/ColorTokens');
let injectWcag = false;

jest.mock('../../tokens/semantic/ColorTokens', () => {
  const actual = jest.requireActual('../../tokens/semantic/ColorTokens');
  return {
    ...actual,
    get colorTokens() {
      if (!injectWcag) return actual.colorTokens;
      return {
        ...actual.colorTokens,
        'color.feedback.info.text': MOCK_WCAG_TOKEN
      };
    }
  };
});

// Import after mock
import { DTCGFormatGenerator } from '../DTCGFormatGenerator';

describe('wcagValue Export Support (Spec 077)', () => {
  afterEach(() => {
    injectWcag = false;
  });

  describe('DTCG export', () => {
    it('should include semanticColor with modes.wcag when a token has wcagValue', () => {
      injectWcag = true;
      const generator = new DTCGFormatGenerator();
      const output = generator.generate();
      expect(output.semanticColor).toBeDefined();
      const token = (output.semanticColor as DTCGGroup)['color.feedback.info.text'] as DTCGToken;
      expect(token.$extensions?.designerpunk?.modes?.wcag).toBe('{color.purple500}');
      expect(token.$value).toBe('{color.teal400}');
    });

    it('should not throw when no tokens have wcagValue', () => {
      injectWcag = false;
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
