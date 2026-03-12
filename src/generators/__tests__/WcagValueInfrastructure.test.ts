/**
 * @category evergreen
 * @purpose Verify wcagValue infrastructure generates correct WCAG theme overrides on all platforms
 */
/**
 * WCAG Value Infrastructure Tests (Spec 076)
 *
 * Tests that semantic tokens with primitiveReferences.wcagValue generate
 * correct WCAG theme override blocks on web, iOS, and Android platforms,
 * and that tokens without wcagValue are unaffected.
 */

import { SemanticCategory } from '../../types/SemanticToken';
import type { SemanticToken } from '../../types/SemanticToken';

// A mock token with wcagValue — references purple500 in WCAG theme instead of teal400
const MOCK_WCAG_TOKEN: Omit<SemanticToken, 'primitiveTokens'> = {
  name: 'color.feedback.info.text',
  primitiveReferences: { value: 'teal400', wcagValue: 'purple500' },
  category: SemanticCategory.COLOR,
  context: 'Test token with wcagValue',
  description: 'Test token for WCAG override generation'
};

// Must use jest.mock to intercept the import before TokenFileGenerator binds it
const originalModule = jest.requireActual('../../tokens/semantic');
let useWcagMock = false;

jest.mock('../../tokens/semantic', () => ({
  ...jest.requireActual('../../tokens/semantic'),
  getAllSemanticTokens: (...args: any[]) => {
    if (!useWcagMock) return originalModule.getAllSemanticTokens(...args);
    const realTokens = originalModule.getAllSemanticTokens(...args);
    return realTokens.map((t: any) =>
      t.name === 'color.feedback.info.text' ? MOCK_WCAG_TOKEN : t
    );
  }
}));

import { TokenFileGenerator } from '../TokenFileGenerator';

describe('wcagValue Infrastructure (Spec 076)', () => {
  let generator: TokenFileGenerator;

  beforeEach(() => {
    generator = new TokenFileGenerator();
    useWcagMock = false;
  });

  describe('Web platform', () => {
    it('should generate WCAG override block when token has wcagValue', () => {
      useWcagMock = true;
      const result = generator.generateWebTokens();

      expect(result.valid).toBe(true);
      expect(result.content).toContain(':root[data-theme="wcag"]');
      expect(result.content).toContain('Spec 076');
      // Platform naming: purple500 → --purple-500
      expect(result.content).toMatch(/\[data-theme="wcag"\][\s\S]*purple-500/);
    });

    it('should still output standard value in :root section', () => {
      useWcagMock = true;
      const result = generator.generateWebTokens();

      // The main :root block should reference teal400 (the standard value) → --teal-400
      const rootBlock = result.content.split(':root[data-theme="wcag"]')[0];
      expect(rootBlock).toContain('teal-400');
    });
  });

  describe('iOS platform', () => {
    it('should generate WCAG override lines when token has wcagValue', () => {
      useWcagMock = true;
      const result = generator.generateiOSTokens();

      expect(result.valid).toBe(true);
      expect(result.content).toContain('MARK: - WCAG Theme Semantic Overrides (Spec 076)');
      expect(result.content).toContain('_wcag');
      // iOS naming: camelCase → purple500
      expect(result.content).toMatch(/purple500/);
    });
  });

  describe('Android platform', () => {
    it('should generate WCAG override lines when token has wcagValue', () => {
      useWcagMock = true;
      const result = generator.generateAndroidTokens();

      expect(result.valid).toBe(true);
      expect(result.content).toContain('WCAG Theme Semantic Overrides (Spec 076)');
      expect(result.content).toContain('_wcag');
      // Android naming: snake_case → purple_500
      expect(result.content).toMatch(/purple_500/);
    });
  });

  describe('Backward compatibility', () => {
    it('should not generate WCAG block when no tokens have wcagValue', () => {
      // useWcagMock is false — real tokens (none have wcagValue yet)
      const webResult = generator.generateWebTokens();
      const iosResult = generator.generateiOSTokens();
      const androidResult = generator.generateAndroidTokens();

      expect(webResult.content).not.toContain(':root[data-theme="wcag"]');
      expect(webResult.content).not.toContain('Spec 076');
      expect(iosResult.content).not.toContain('WCAG Theme Semantic Overrides');
      expect(androidResult.content).not.toContain('WCAG Theme Semantic Overrides');

      expect(webResult.valid).toBe(true);
      expect(iosResult.valid).toBe(true);
      expect(androidResult.valid).toBe(true);
    });
  });
});
