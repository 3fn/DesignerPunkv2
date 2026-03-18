/**
 * @category evergreen
 * @purpose Verify Spec 076 token migration: correct primitive references and gray RGBA values.
 * wcagValue inline overrides removed in Spec 080 Phase 2 — WCAG overrides now in theme files.
 */
import { colorTokens } from '../../tokens/semantic/ColorTokens';
import { grayTokens } from '../../tokens/ColorTokens';

describe('Spec 076 Token Migration', () => {
  // ── Semantic token primitive references ──

  describe('Action tokens', () => {
    it('color.action.primary → cyan300 (wcagValue migrated to theme file)', () => {
      const refs = colorTokens['color.action.primary'].primitiveReferences;
      expect(refs.value).toBe('cyan300');
      expect(refs.wcagValue).toBeUndefined();
    });

    it('color.action.secondary → gray400, no wcagValue', () => {
      const refs = colorTokens['color.action.secondary'].primitiveReferences;
      expect(refs.value).toBe('gray400');
      expect(refs.wcagValue).toBeUndefined();
    });

    it('color.action.navigation → cyan500 (wcagValue migrated to theme file)', () => {
      const refs = colorTokens['color.action.navigation'].primitiveReferences;
      expect(refs.value).toBe('cyan500');
      expect(refs.wcagValue).toBeUndefined();
    });
  });

  describe('Contrast tokens', () => {
    it('color.contrast.onAction → black500 (wcagValue migrated to theme file)', () => {
      const refs = colorTokens['color.contrast.onAction'].primitiveReferences;
      expect(refs.value).toBe('black500');
      expect(refs.wcagValue).toBeUndefined();
    });

    it('color.contrast.onPrimary must not exist (Spec 052 guard)', () => {
      expect(colorTokens['color.contrast.onPrimary']).toBeUndefined();
    });
  });

  describe('Background tokens', () => {
    it('color.background.primary.subtle → cyan100 (wcagValue migrated to theme file)', () => {
      const refs = colorTokens['color.background.primary.subtle'].primitiveReferences;
      expect(refs.value).toBe('cyan100');
      expect(refs.wcagValue).toBeUndefined();
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

  describe('Info feedback tokens (WCAG override migrated to theme file)', () => {
    it('color.feedback.info.text → teal400 (wcagValue migrated to theme file)', () => {
      const refs = colorTokens['color.feedback.info.text'].primitiveReferences;
      expect(refs.value).toBe('teal400');
      expect(refs.wcagValue).toBeUndefined();
    });

    it('color.feedback.info.background → teal100 (wcagValue migrated to theme file)', () => {
      const refs = colorTokens['color.feedback.info.background'].primitiveReferences;
      expect(refs.value).toBe('teal100');
      expect(refs.wcagValue).toBeUndefined();
    });

    it('color.feedback.info.border → teal400 (wcagValue migrated to theme file)', () => {
      const refs = colorTokens['color.feedback.info.border'].primitiveReferences;
      expect(refs.value).toBe('teal400');
      expect(refs.wcagValue).toBeUndefined();
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
});
