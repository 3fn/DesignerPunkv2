/**
 * @category evergreen
 * @purpose Verify Spec 076 token migration: correct primitive references, wcagValue keys, and gray RGBA values
 */
import { colorTokens } from '../../tokens/semantic/ColorTokens';
import { grayTokens } from '../../tokens/ColorTokens';
import { TokenFileGenerator } from '../TokenFileGenerator';

describe('Spec 076 Token Migration', () => {
  // ── Semantic token primitive references ──

  describe('Action tokens', () => {
    it('color.action.primary → cyan300 with wcagValue teal300', () => {
      const refs = colorTokens['color.action.primary'].primitiveReferences;
      expect(refs.value).toBe('cyan300');
      expect(refs.wcagValue).toBe('teal300');
    });

    it('color.action.secondary → gray400, no wcagValue', () => {
      const refs = colorTokens['color.action.secondary'].primitiveReferences;
      expect(refs.value).toBe('gray400');
      expect(refs.wcagValue).toBeUndefined();
    });

    it('color.action.navigation → cyan500 with wcagValue teal500', () => {
      const refs = colorTokens['color.action.navigation'].primitiveReferences;
      expect(refs.value).toBe('cyan500');
      expect(refs.wcagValue).toBe('teal500');
    });
  });

  describe('Contrast tokens', () => {
    it('color.contrast.onAction → black500 with wcagValue white100', () => {
      const refs = colorTokens['color.contrast.onAction'].primitiveReferences;
      expect(refs.value).toBe('black500');
      expect(refs.wcagValue).toBe('white100');
    });

    it('color.contrast.onPrimary must not exist (Spec 052 guard)', () => {
      expect(colorTokens['color.contrast.onPrimary']).toBeUndefined();
    });
  });

  describe('Background tokens', () => {
    it('color.background.primary.subtle → cyan100 with wcagValue teal100', () => {
      const refs = colorTokens['color.background.primary.subtle'].primitiveReferences;
      expect(refs.value).toBe('cyan100');
      expect(refs.wcagValue).toBe('teal100');
    });
  });

  describe('Data/Tech tokens', () => {
    it('color.data → purple300, no wcagValue', () => {
      const refs = colorTokens['color.data'].primitiveReferences;
      expect(refs.value).toBe('purple300');
      expect(refs.wcagValue).toBeUndefined();
    });

    it('color.tech → purple400, no wcagValue', () => {
      const refs = colorTokens['color.tech'].primitiveReferences;
      expect(refs.value).toBe('purple400');
      expect(refs.wcagValue).toBeUndefined();
    });
  });

  describe('Info feedback tokens (WCAG theme)', () => {
    it('color.feedback.info.text → teal400 with wcagValue purple500', () => {
      const refs = colorTokens['color.feedback.info.text'].primitiveReferences;
      expect(refs.value).toBe('teal400');
      expect(refs.wcagValue).toBe('purple500');
    });

    it('color.feedback.info.background → teal100 with wcagValue purple100', () => {
      const refs = colorTokens['color.feedback.info.background'].primitiveReferences;
      expect(refs.value).toBe('teal100');
      expect(refs.wcagValue).toBe('purple100');
    });

    it('color.feedback.info.border → teal400 with wcagValue purple500', () => {
      const refs = colorTokens['color.feedback.info.border'].primitiveReferences;
      expect(refs.value).toBe('teal400');
      expect(refs.wcagValue).toBe('purple500');
    });
  });

  // ── Gray primitive RGBA values ──

  describe('Gray primitives (cool blue-gray)', () => {
    const expected: Record<string, string> = {
      gray100: 'rgba(178, 188, 196, 1)',
      gray200: 'rgba(94, 112, 124, 1)',
      gray300: 'rgba(38, 50, 58, 1)',
      gray400: 'rgba(24, 34, 40, 1)',
      gray500: 'rgba(16, 22, 26, 1)',
    };

    it.each(Object.entries(expected))('%s outputs %s on all platforms', (name, rgba) => {
      const token = grayTokens[name as keyof typeof grayTokens];
      for (const platform of ['web', 'ios', 'android'] as const) {
        const val = token.platforms[platform].value as any;
        expect(val.light.base).toBe(rgba);
        expect(val.dark.base).toBe(rgba);
      }
    });
  });

  // ── WCAG overrides appear in generated web output ──

  describe('Web WCAG override block', () => {
    it('generates WCAG overrides for all wcagValue tokens', () => {
      const generator = new TokenFileGenerator();
      const result = generator.generateWebTokens();
      const web = result.content;

      // WCAG block should contain overrides for all tokens with wcagValue
      expect(web).toContain('data-theme="wcag"');
      expect(web).toContain('var(--teal-300)');   // action.primary wcag
      expect(web).toContain('var(--teal-100)');   // background.primary.subtle wcag
      expect(web).toContain('var(--teal-500)');   // action.navigation wcag
      expect(web).toContain('var(--white-100)');  // contrast.onAction wcag
      expect(web).toContain('var(--purple-500)'); // info.text + info.border wcag
      expect(web).toContain('var(--purple-100)'); // info.background wcag
    });
  });
});
