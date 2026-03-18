/**
 * @category evergreen
 * @purpose Verify mode-aware generation produces correct platform output for light/dark tokens
 */
/**
 * Mode-Aware Generation Integration Tests (Spec 080, Task 5.6)
 *
 * Tests that the generator produces correct mode-aware output when given
 * pre-resolved light and dark semantic token sets with differing values.
 */

import { TokenFileGenerator } from '../TokenFileGenerator';
import { defaultSemanticOptions } from './helpers/defaultSemanticOptions';
import { SemanticCategory } from '../../types/SemanticToken';
import type { SemanticToken } from '../../types/SemanticToken';

// Test tokens with distinct light/dark resolved values
const lightToken: Omit<SemanticToken, 'primitiveTokens'> = {
  name: 'color.text.default',
  primitiveReferences: { value: 'rgba(38, 50, 58, 1)' },
  category: SemanticCategory.COLOR,
  context: 'Test',
  description: 'Default text color',
};

const darkToken: Omit<SemanticToken, 'primitiveTokens'> = {
  name: 'color.text.default',
  primitiveReferences: { value: 'rgba(178, 188, 196, 1)' },
  category: SemanticCategory.COLOR,
  context: 'Test',
  description: 'Default text color',
};

// Mode-invariant token (identical light/dark)
const invariantLight: Omit<SemanticToken, 'primitiveTokens'> = {
  name: 'color.print.default',
  primitiveReferences: { value: 'rgba(0, 0, 0, 1)' },
  category: SemanticCategory.COLOR,
  context: 'Test',
  description: 'Print color',
};

const invariantDark: Omit<SemanticToken, 'primitiveTokens'> = {
  ...invariantLight,
};

const lightTokens = [lightToken, invariantLight];
const darkTokens = [darkToken, invariantDark];

describe('Mode-Aware Generation (Spec 080)', () => {
  let generator: TokenFileGenerator;

  beforeEach(() => {
    generator = new TokenFileGenerator();
  });

  describe('Web platform', () => {
    it('should output light-dark() for mode-differentiated tokens', () => {
      const result = generator.generateWebTokens({
        semanticTokens: lightTokens,
        darkSemanticTokens: darkTokens,
      });
      expect(result.content).toContain(
        'light-dark(rgba(38, 50, 58, 1), rgba(178, 188, 196, 1))'
      );
    });

    it('should output single value for mode-invariant tokens', () => {
      const result = generator.generateWebTokens({
        semanticTokens: lightTokens,
        darkSemanticTokens: darkTokens,
      });
      // Mode-invariant: no light-dark() wrapper
      expect(result.content).toMatch(/--color-print-default:\s*rgba\(0, 0, 0, 1\);/);
      expect(result.content).not.toContain('light-dark(rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))');
    });

    it('should include color-scheme declaration', () => {
      const result = generator.generateWebTokens({
        semanticTokens: lightTokens,
        darkSemanticTokens: darkTokens,
      });
      expect(result.content).toContain('color-scheme: light dark;');
    });
  });

  describe('iOS platform', () => {
    it('should output dynamic UIColor for mode-differentiated tokens', () => {
      const result = generator.generateiOSTokens({
        semanticTokens: lightTokens,
        darkSemanticTokens: darkTokens,
      });
      expect(result.content).toContain('userInterfaceStyle == .dark');
      expect(result.content).toContain('UIColor(red: 0.70, green: 0.74, blue: 0.77, alpha: 1.00)');
      expect(result.content).toContain('UIColor(red: 0.15, green: 0.20, blue: 0.23, alpha: 1.00)');
    });

    it('should output single UIColor for mode-invariant tokens', () => {
      const result = generator.generateiOSTokens({
        semanticTokens: lightTokens,
        darkSemanticTokens: darkTokens,
      });
      expect(result.content).toMatch(/colorPrintDefault.*UIColor\(red: 0\.00.*alpha: 1\.00\)/);
      // Should NOT have dynamic UIColor for invariant token
      expect(result.content).not.toMatch(/colorPrintDefault.*userInterfaceStyle/);
    });
  });

  describe('Android platform', () => {
    it('should output light/dark suffixed values for mode-differentiated tokens', () => {
      const result = generator.generateAndroidTokens({
        semanticTokens: lightTokens,
        darkSemanticTokens: darkTokens,
      });
      expect(result.content).toContain('color_text_default_light');
      expect(result.content).toContain('color_text_default_dark');
    });

    it('should output single value for mode-invariant tokens', () => {
      const result = generator.generateAndroidTokens({
        semanticTokens: lightTokens,
        darkSemanticTokens: darkTokens,
      });
      expect(result.content).toMatch(/val color_print_default = Color\.argb/);
      expect(result.content).not.toContain('color_print_default_light');
      expect(result.content).not.toContain('color_print_default_dark');
    });
  });

  describe('DTCG export', () => {
    it('should not emit mode contexts when light/dark values are identical', () => {
      // All current primitives have identical light/dark — no modes.light/dark should appear
      const { DTCGFormatGenerator } = require('../DTCGFormatGenerator');
      const gen = new DTCGFormatGenerator();
      const output = gen.generate();
      const sc = output.semanticColor as Record<string, any>;
      const textDefault = sc['color.text.default'];
      expect(textDefault).toBeDefined();
      const modes = textDefault.$extensions?.designerpunk?.modes;
      // Should not have light/dark keys (values are identical)
      if (modes) {
        expect(modes.light).toBeUndefined();
        expect(modes.dark).toBeUndefined();
      }
    });

    it('should not emit wcag mode from inline wcagValue (migrated to theme files)', () => {
      const { DTCGFormatGenerator } = require('../DTCGFormatGenerator');
      const gen = new DTCGFormatGenerator();
      const output = gen.generate();
      const sc = output.semanticColor as Record<string, any>;
      const actionPrimary = sc['color.action.primary'];
      // wcagValue removed from token definitions — WCAG modes will come from 4-context generation
      expect(actionPrimary?.$extensions?.designerpunk?.modes?.wcag).toBeUndefined();
    });
  });

  // F37 guard removed in Task 5.7: TypeScript now enforces both semanticTokens
  // and darkSemanticTokens as required fields (compile-time safety replaces runtime guard).
});
