/**
 * @category evergreen
 * @purpose Verify WCAG theme override generation from theme files on all platforms (Spec 080 Phase 2)
 */
/**
 * WCAG Theme Override Infrastructure Tests
 *
 * Tests that generators produce correct WCAG theme override blocks when
 * wcagSemanticTokens and darkWcagSemanticTokens are provided via GenerationOptions.
 * Replaces inline wcagValue tests (Spec 076) with theme-file-based tests (Spec 080 Phase 2).
 */

import { TokenFileGenerator } from '../TokenFileGenerator';
import { defaultSemanticOptions } from './helpers/defaultSemanticOptions';
import { resolveSemanticTokenValue } from '../../resolvers/SemanticValueResolver';
import { SemanticOverrideResolver } from '../../resolvers/SemanticOverrideResolver';
import { PrimitiveTokenRegistry } from '../../registries/PrimitiveTokenRegistry';
import { SemanticTokenRegistry } from '../../registries/SemanticTokenRegistry';
import { getAllSemanticTokens } from '../../tokens/semantic';
import { SemanticCategory } from '../../types/SemanticToken';
import { darkSemanticOverrides } from '../../tokens/themes/dark/SemanticOverrides';
import { wcagSemanticOverrides } from '../../tokens/themes/wcag/SemanticOverrides';
import { darkWcagSemanticOverrides } from '../../tokens/themes/dark-wcag/SemanticOverrides';
import type { ContextOverrideSet } from '../../tokens/themes/types';

/** Build fully resolved 4-context options for generator tests. */
function wcagOptions() {
  const base = defaultSemanticOptions();
  const primReg = new PrimitiveTokenRegistry();
  const semReg = new SemanticTokenRegistry(primReg);
  for (const t of getAllSemanticTokens()) semReg.register(t);

  const colorTokens = getAllSemanticTokens().filter(t => t.category === SemanticCategory.COLOR);
  const resolver = new SemanticOverrideResolver(semReg, darkSemanticOverrides);

  const contextOverrides: ContextOverrideSet = {
    'light-wcag': wcagSemanticOverrides,
    'dark-base': darkSemanticOverrides,
    'dark-wcag': { ...darkSemanticOverrides, ...wcagSemanticOverrides, ...darkWcagSemanticOverrides },
  };

  const sets = resolver.resolveAllContexts(colorTokens, contextOverrides);

  return {
    ...base,
    wcagSemanticTokens: sets['light-wcag'].map(t => resolveSemanticTokenValue(t, 'light', 'wcag')),
    darkWcagSemanticTokens: sets['dark-wcag'].map(t => resolveSemanticTokenValue(t, 'dark', 'wcag')),
    wcagOverrideKeys: new Set([
      ...Object.keys(wcagSemanticOverrides),
      ...Object.keys(darkWcagSemanticOverrides),
    ]),
  };
}

describe('WCAG Theme Override Infrastructure (Spec 080 Phase 2)', () => {
  let generator: TokenFileGenerator;

  beforeEach(() => {
    generator = new TokenFileGenerator();
  });

  describe('Web platform', () => {
    it('should generate WCAG override block from theme files', () => {
      const result = generator.generateWebTokens(wcagOptions());
      expect(result.valid).toBe(true);
      expect(result.content).toContain(':root[data-theme="wcag"]');
      expect(result.content).toContain('Spec 080 Phase 2');
    });

    it('should not generate WCAG block when wcag tokens not provided', () => {
      const result = generator.generateWebTokens(defaultSemanticOptions());
      expect(result.content).not.toContain(':root[data-theme="wcag"]');
    });

    it('should only include tokens that differ between base and wcag', () => {
      const result = generator.generateWebTokens(wcagOptions());
      const wcagMatch = result.content.match(/:root\[data-theme="wcag"\]\s*\{([^}]*)\}/);
      expect(wcagMatch).toBeTruthy();
      const wcagBlock = wcagMatch![1];
      // color.action.secondary has no wcag override — should NOT appear
      expect(wcagBlock).not.toContain('--color-action-secondary');
      // color.action.primary has a wcag override — should appear
      expect(wcagBlock).toContain('--color-action-primary');
    });
  });

  describe('WCAG cyan→teal swap (unified mechanism)', () => {
    it('should resolve color.action.primary from cyan300 to teal300 in wcag context', () => {
      const opts = wcagOptions();
      const base = opts.semanticTokens.find(t => t.name === 'color.action.primary');
      const wcag = opts.wcagSemanticTokens!.find(t => t.name === 'color.action.primary');
      expect(base!.primitiveReferences).toEqual({ value: 'rgba(0, 240, 255, 1)' });
      expect(wcag!.primitiveReferences).toEqual({ value: 'rgba(26, 83, 92, 1)' });
    });

    it('should resolve color.action.navigation from cyan500 to teal500 in wcag context', () => {
      const opts = wcagOptions();
      const base = opts.semanticTokens.find(t => t.name === 'color.action.navigation');
      const wcag = opts.wcagSemanticTokens!.find(t => t.name === 'color.action.navigation');
      expect(base!.primitiveReferences).toEqual({ value: 'rgba(0, 136, 143, 1)' });
      expect(wcag!.primitiveReferences).toEqual({ value: 'rgba(15, 46, 51, 1)' });
    });
  });

  describe('iOS platform', () => {
    it('should generate WCAG override lines from theme files', () => {
      const result = generator.generateiOSTokens(wcagOptions());
      expect(result.valid).toBe(true);
      expect(result.content).toContain('WCAG Theme Semantic Overrides');
      expect(result.content).toContain('_wcag');
    });
  });

  describe('Android platform', () => {
    it('should generate WCAG override lines from theme files', () => {
      const result = generator.generateAndroidTokens(wcagOptions());
      expect(result.valid).toBe(true);
      expect(result.content).toContain('WCAG Theme Semantic Overrides');
      expect(result.content).toContain('_wcag');
    });
  });
});
