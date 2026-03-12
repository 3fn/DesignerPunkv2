/**
 * @category evergreen
 * @purpose Verify DTCG and Figma exports throw when tokens have wcagValue
 */
/**
 * wcagValue Export Guard Rails (Spec 076, Task 1.4)
 *
 * DTCG and Figma formats do not yet support theme-conditional semantic
 * references (wcagValue). These tests verify that attempting to export
 * a token with wcagValue produces a clear error.
 */

import { SemanticCategory } from '../../types/SemanticToken';
import type { SemanticToken } from '../../types/SemanticToken';
import { FigmaTransformer } from '../transformers/FigmaTransformer';
import type { DTCGTokenFile } from '../types/DTCGTypes';

// --- DTCG guard rail tests ---

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

describe('wcagValue Export Guard Rails (Spec 076)', () => {
  afterEach(() => {
    injectWcag = false;
  });

  describe('DTCG export', () => {
    it('should omit semanticColor from output when a token has wcagValue', () => {
      injectWcag = true;
      const generator = new DTCGFormatGenerator();
      const output = generator.generate();
      // Guard rail fires internally — semanticColor is skipped, not thrown
      expect(output.semanticColor).toBeUndefined();
      // Other groups still present
      expect(output.space).toBeDefined();
    });

    it('should not throw when no tokens have wcagValue', () => {
      injectWcag = false;
      const generator = new DTCGFormatGenerator();
      expect(() => generator.generate()).not.toThrow();
    });
  });

  describe('Figma export', () => {
    it('should throw when a DTCG token has wcagValue in extensions', () => {
      const transformer = new FigmaTransformer();
      const dtcgInput: DTCGTokenFile = {
        $schema: 'https://design-tokens.org/schema.json',
        semanticColor: {
          $type: 'color',
          'color.feedback.info.text': {
            $value: '{color.teal400}',
            $type: 'color',
            $extensions: {
              designerpunk: { family: 'color', wcagValue: 'purple500' } as any
            }
          }
        }
      };
      expect(() => transformer.transform(dtcgInput)).toThrow(/wcagValue/);
    });

    it('should not throw when DTCG tokens have no wcagValue', () => {
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
