/**
 * @category evergreen
 * @purpose Verify Color tokens are correctly defined and structured
 */
/**
 * Semantic Color Token Tests
 * 
 * Tests for semantic color token updates as part of color palette refresh.
 * Validates that color tokens reference correct primitives after palette update.
 * 
 * Task: 2.6 Write unit tests for semantic token updates
 * Spec: 015-color-palette-update
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 * 
 * UPDATED (Spec 052): Token names migrated to concept-first pattern
 * - Old: color.success.strong/subtle → New: color.feedback.success.text/background
 * - Old: color.error.strong/subtle → New: color.feedback.error.text/background
 * - Old: color.warning.strong/subtle → New: color.feedback.warning.text/background
 * - Old: color.info.strong/subtle → New: color.feedback.info.text/background
 * - Old: color.select.* → New: color.feedback.select.*
 */

import {
  colorTokens,
  colorTokenNames,
  getColorToken,
  getAllColorTokens,
  validateColorTokenCount
} from '../ColorTokens';
import { colorTokens as primitiveColorTokens } from '../../ColorTokens';
import { SemanticCategory } from '../../../types/SemanticToken';

describe('Semantic Color Tokens - Palette Update', () => {
  describe('Feedback Success Tokens Reference Green Primitives', () => {
    it('should have color.feedback.success.text token', () => {
      expect(colorTokens['color.feedback.success.text']).toBeDefined();
    });

    it('should reference green400 primitive for success text', () => {
      const token = colorTokens['color.feedback.success.text'];
      expect(token.primitiveReferences.value).toBe('green400');
    });

    it('should have color.feedback.success.background token', () => {
      expect(colorTokens['color.feedback.success.background']).toBeDefined();
    });

    it('should reference green100 primitive for success background', () => {
      const token = colorTokens['color.feedback.success.background'];
      expect(token.primitiveReferences.value).toBe('green100');
    });

    it('should have color.feedback.success.border token', () => {
      expect(colorTokens['color.feedback.success.border']).toBeDefined();
    });

    it('should reference green400 primitive for success border', () => {
      const token = colorTokens['color.feedback.success.border'];
      expect(token.primitiveReferences.value).toBe('green400');
    });

    it('should verify green400 primitive exists', () => {
      const token = colorTokens['color.feedback.success.text'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should verify green100 primitive exists', () => {
      const token = colorTokens['color.feedback.success.background'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should have COLOR category for success tokens', () => {
      expect(colorTokens['color.feedback.success.text'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.feedback.success.background'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.feedback.success.border'].category).toBe(SemanticCategory.COLOR);
    });

    it('should have meaningful context for success tokens', () => {
      const textToken = colorTokens['color.feedback.success.text'];
      expect(textToken.context).toBeTruthy();
      expect(textToken.context).toContain('success');

      const bgToken = colorTokens['color.feedback.success.background'];
      expect(bgToken.context).toBeTruthy();
      expect(bgToken.context).toContain('success');
    });
  });

  describe('Feedback Error Tokens Reference Pink Primitives', () => {
    it('should have color.feedback.error.text token', () => {
      expect(colorTokens['color.feedback.error.text']).toBeDefined();
    });

    it('should reference pink400 primitive for error text', () => {
      const token = colorTokens['color.feedback.error.text'];
      expect(token.primitiveReferences.value).toBe('pink400');
    });

    it('should have color.feedback.error.background token', () => {
      expect(colorTokens['color.feedback.error.background']).toBeDefined();
    });

    it('should reference pink100 primitive for error background', () => {
      const token = colorTokens['color.feedback.error.background'];
      expect(token.primitiveReferences.value).toBe('pink100');
    });

    it('should have color.feedback.error.border token', () => {
      expect(colorTokens['color.feedback.error.border']).toBeDefined();
    });

    it('should reference pink400 primitive for error border', () => {
      const token = colorTokens['color.feedback.error.border'];
      expect(token.primitiveReferences.value).toBe('pink400');
    });

    it('should verify pink400 primitive exists', () => {
      const token = colorTokens['color.feedback.error.text'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should verify pink100 primitive exists', () => {
      const token = colorTokens['color.feedback.error.background'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should have COLOR category for error tokens', () => {
      expect(colorTokens['color.feedback.error.text'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.feedback.error.background'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.feedback.error.border'].category).toBe(SemanticCategory.COLOR);
    });

    it('should have meaningful context for error tokens', () => {
      const textToken = colorTokens['color.feedback.error.text'];
      expect(textToken.context).toBeTruthy();
      expect(textToken.context).toContain('error');

      const bgToken = colorTokens['color.feedback.error.background'];
      expect(bgToken.context).toBeTruthy();
      expect(bgToken.context).toContain('error');
    });
  });

  describe('Feedback Warning Tokens Reference Amber Primitives', () => {
    it('should have color.feedback.warning.text token', () => {
      expect(colorTokens['color.feedback.warning.text']).toBeDefined();
    });

    it('should reference orange400 primitive for warning text (amber)', () => {
      const token = colorTokens['color.feedback.warning.text'];
      expect(token.primitiveReferences.value).toBe('orange400');
    });

    it('should have color.feedback.warning.background token', () => {
      expect(colorTokens['color.feedback.warning.background']).toBeDefined();
    });

    it('should reference orange100 primitive for warning background (amber)', () => {
      const token = colorTokens['color.feedback.warning.background'];
      expect(token.primitiveReferences.value).toBe('orange100');
    });

    it('should have color.feedback.warning.border token', () => {
      expect(colorTokens['color.feedback.warning.border']).toBeDefined();
    });

    it('should reference orange400 primitive for warning border', () => {
      const token = colorTokens['color.feedback.warning.border'];
      expect(token.primitiveReferences.value).toBe('orange400');
    });

    it('should verify orange400 primitive exists', () => {
      const token = colorTokens['color.feedback.warning.text'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should verify orange100 primitive exists', () => {
      const token = colorTokens['color.feedback.warning.background'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should have COLOR category for warning tokens', () => {
      expect(colorTokens['color.feedback.warning.text'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.feedback.warning.background'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.feedback.warning.border'].category).toBe(SemanticCategory.COLOR);
    });

    it('should have meaningful context for warning tokens', () => {
      const textToken = colorTokens['color.feedback.warning.text'];
      expect(textToken.context).toBeTruthy();
      expect(textToken.context).toContain('warning');

      const bgToken = colorTokens['color.feedback.warning.background'];
      expect(bgToken.context).toBeTruthy();
      expect(bgToken.context).toContain('warning');
    });
  });

  describe('Feedback Info Tokens Reference Teal Primitives', () => {
    it('should have color.feedback.info.text token', () => {
      expect(colorTokens['color.feedback.info.text']).toBeDefined();
    });

    it('should reference teal400 primitive for info text', () => {
      const token = colorTokens['color.feedback.info.text'];
      expect(token.primitiveReferences.value).toBe('teal400');
    });

    it('should have color.feedback.info.background token', () => {
      expect(colorTokens['color.feedback.info.background']).toBeDefined();
    });

    it('should reference teal100 primitive for info background', () => {
      const token = colorTokens['color.feedback.info.background'];
      expect(token.primitiveReferences.value).toBe('teal100');
    });

    it('should have color.feedback.info.border token', () => {
      expect(colorTokens['color.feedback.info.border']).toBeDefined();
    });

    it('should reference teal400 primitive for info border', () => {
      const token = colorTokens['color.feedback.info.border'];
      expect(token.primitiveReferences.value).toBe('teal400');
    });

    it('should have COLOR category for info tokens', () => {
      expect(colorTokens['color.feedback.info.text'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.feedback.info.background'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.feedback.info.border'].category).toBe(SemanticCategory.COLOR);
    });
  });

  describe('New Attention and Highlight Tokens Exist', () => {
    it('should have color.attention token', () => {
      expect(colorTokens['color.attention']).toBeDefined();
    });

    it('should reference yellow400 primitive for attention', () => {
      const token = colorTokens['color.attention'];
      expect(token.primitiveReferences.value).toBe('yellow400');
    });

    it('should have color.highlight token', () => {
      expect(colorTokens['color.highlight']).toBeDefined();
    });

    it('should reference yellow300 primitive for highlight', () => {
      const token = colorTokens['color.highlight'];
      expect(token.primitiveReferences.value).toBe('yellow300');
    });

    it('should verify yellow400 primitive exists', () => {
      const token = colorTokens['color.attention'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should verify yellow300 primitive exists', () => {
      const token = colorTokens['color.highlight'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should have COLOR category for attention/highlight tokens', () => {
      expect(colorTokens['color.attention'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.highlight'].category).toBe(SemanticCategory.COLOR);
    });

    it('should have meaningful context for attention token', () => {
      const token = colorTokens['color.attention'];
      expect(token.context).toBeTruthy();
      expect(token.context.toLowerCase()).toContain('attention');
    });

    it('should have meaningful context for highlight token', () => {
      const token = colorTokens['color.highlight'];
      expect(token.context).toBeTruthy();
      expect(token.context.toLowerCase()).toContain('highlight');
    });
  });

  describe('New Tech and Data Tokens Exist', () => {
    it('should have color.tech token', () => {
      expect(colorTokens['color.tech']).toBeDefined();
    });

    it('should reference cyan400 primitive for tech', () => {
      const token = colorTokens['color.tech'];
      expect(token.primitiveReferences.value).toBe('cyan400');
    });

    it('should have color.data token', () => {
      expect(colorTokens['color.data']).toBeDefined();
    });

    it('should reference cyan300 primitive for data', () => {
      const token = colorTokens['color.data'];
      expect(token.primitiveReferences.value).toBe('cyan300');
    });

    it('should verify cyan400 primitive exists', () => {
      const token = colorTokens['color.tech'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should verify cyan300 primitive exists', () => {
      const token = colorTokens['color.data'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should have COLOR category for tech/data tokens', () => {
      expect(colorTokens['color.tech'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['color.data'].category).toBe(SemanticCategory.COLOR);
    });

    it('should have meaningful context for tech token', () => {
      const token = colorTokens['color.tech'];
      expect(token.context).toBeTruthy();
      expect(token.context.toLowerCase()).toContain('tech');
    });

    it('should have meaningful context for data token', () => {
      const token = colorTokens['color.data'];
      expect(token.context).toBeTruthy();
      expect(token.context.toLowerCase()).toContain('data');
    });
  });

  describe('Structure Concept Tokens (Spec 052)', () => {
    describe('Canvas Token', () => {
      it('should have color.structure.canvas token', () => {
        expect(colorTokens['color.structure.canvas']).toBeDefined();
      });

      it('should reference white100 primitive for canvas', () => {
        const token = colorTokens['color.structure.canvas'];
        expect(token.primitiveReferences.value).toBe('white100');
      });

      it('should verify white100 primitive exists', () => {
        const token = colorTokens['color.structure.canvas'];
        const primitiveName = token.primitiveReferences.value;
        expect(primitiveColorTokens).toHaveProperty(primitiveName);
      });

      it('should have COLOR category for canvas token', () => {
        expect(colorTokens['color.structure.canvas'].category).toBe(SemanticCategory.COLOR);
      });

      it('should have meaningful context for canvas token', () => {
        const token = colorTokens['color.structure.canvas'];
        expect(token.context).toBeTruthy();
        expect(token.context.toLowerCase()).toContain('canvas');
      });

      it('should describe canvas as default surface for pages', () => {
        const token = colorTokens['color.structure.canvas'];
        expect(token.description).toBeTruthy();
        expect(token.description.toLowerCase()).toContain('canvas');
        expect(token.description.toLowerCase()).toContain('background');
      });
    });

    describe('Surface Token', () => {
      it('should have color.structure.surface token', () => {
        expect(colorTokens['color.structure.surface']).toBeDefined();
      });

      it('should reference white200 primitive for surface', () => {
        const token = colorTokens['color.structure.surface'];
        expect(token.primitiveReferences.value).toBe('white200');
      });

      it('should have COLOR category for surface token', () => {
        expect(colorTokens['color.structure.surface'].category).toBe(SemanticCategory.COLOR);
      });
    });

    describe('Border Token', () => {
      it('should have color.structure.border token', () => {
        expect(colorTokens['color.structure.border']).toBeDefined();
      });

      it('should reference gray100 primitive for border', () => {
        const token = colorTokens['color.structure.border'];
        expect(token.primitiveReferences.value).toBe('gray100');
      });

      it('should have COLOR category for border token', () => {
        expect(colorTokens['color.structure.border'].category).toBe(SemanticCategory.COLOR);
      });
    });

    describe('Migration from Old Tokens (Spec 052)', () => {
      it('should NOT have old color.canvas token (migrated to color.structure.canvas)', () => {
        expect(colorTokens['color.canvas']).toBeUndefined();
      });

      it('should NOT have old color.surface token (migrated to color.structure.surface)', () => {
        expect(colorTokens['color.surface']).toBeUndefined();
      });

      it('should NOT have old color.border token (migrated to color.structure.border)', () => {
        expect(colorTokens['color.border']).toBeUndefined();
      });

      it('should NOT have old color.background token (migrated to color.structure.canvas)', () => {
        expect(colorTokens['color.background']).toBeUndefined();
      });
    });
  });

  describe('New Glow Tokens Exist', () => {
    it('should have glow.neonGreen token', () => {
      expect(colorTokens['glow.neonGreen']).toBeDefined();
    });

    it('should reference green500 primitive for neon green glow', () => {
      const token = colorTokens['glow.neonGreen'];
      expect(token.primitiveReferences.value).toBe('green500');
    });

    it('should have glow.neonPink token', () => {
      expect(colorTokens['glow.neonPink']).toBeDefined();
    });

    it('should reference pink500 primitive for neon pink glow', () => {
      const token = colorTokens['glow.neonPink'];
      expect(token.primitiveReferences.value).toBe('pink500');
    });

    it('should verify green500 primitive exists', () => {
      const token = colorTokens['glow.neonGreen'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should verify pink500 primitive exists', () => {
      const token = colorTokens['glow.neonPink'];
      const primitiveName = token.primitiveReferences.value;
      expect(primitiveColorTokens).toHaveProperty(primitiveName);
    });

    it('should have COLOR category for glow tokens', () => {
      expect(colorTokens['glow.neonGreen'].category).toBe(SemanticCategory.COLOR);
      expect(colorTokens['glow.neonPink'].category).toBe(SemanticCategory.COLOR);
    });

    it('should have meaningful context for glow tokens', () => {
      const greenToken = colorTokens['glow.neonGreen'];
      expect(greenToken.context).toBeTruthy();
      expect(greenToken.context.toLowerCase()).toContain('glow');

      const pinkToken = colorTokens['glow.neonPink'];
      expect(pinkToken.context).toBeTruthy();
      expect(pinkToken.context.toLowerCase()).toContain('glow');
    });
  });

  describe('Color.secondary Token Removed', () => {
    it('should not have color.secondary token', () => {
      expect(colorTokens['color.secondary']).toBeUndefined();
    });

    it('should not include color.secondary in token names array', () => {
      expect(colorTokenNames).not.toContain('color.secondary');
    });

    it('should return undefined when getting color.secondary', () => {
      const token = getColorToken('color.secondary');
      expect(token).toBeUndefined();
    });

    it('should not include color.secondary in all tokens array', () => {
      const allTokens = getAllColorTokens();
      const secondaryToken = allTokens.find(t => t.name === 'color.secondary');
      expect(secondaryToken).toBeUndefined();
    });
  });

  describe('Token Count Validation', () => {
    it('should have exactly 50 color tokens', () => {
      // Updated for Spec 052 semantic naming restructure:
      // Feedback concept: 18 tokens (success/error/warning/info × text/background/border + select × 6)
      // Identity concept: 2 tokens (human, agent)
      // Action concept: 2 tokens (primary, secondary)
      // Contrast concept: 2 tokens (onLight, onDark)
      // Structure concept: 4 tokens (canvas, surface, border, border.subtle)
      // Attention/Highlight: 2 tokens
      // Tech/Data: 2 tokens
      // Text hierarchy: 3 tokens (default, muted, subtle)
      // Icon: 1 token (default)
      // Print: 1 token (default)
      // Background: 1 token (primary.subtle)
      // Glow: 5 tokens (neonPurple, neonCyan, neonYellow, neonGreen, neonPink)
      // Avatar component: MIGRATED to src/components/core/Avatar/avatar.tokens.ts (Spec 058)
      // Badge component: 2 tokens (notification.background, notification.text)
      // Total: 45 tokens (includes color.structure.border.subtle with opacity composition)
      // Note: 5 Avatar tokens removed in Spec 058 migration (50 - 5 = 45)
      expect(colorTokenNames.length).toBe(45);
    });

    it('should pass validateColorTokenCount()', () => {
      expect(validateColorTokenCount()).toBe(true);
    });

    it('should have correct token count breakdown', () => {
      // Updated for Spec 052 semantic naming restructure
      const actionTokens = colorTokenNames.filter(n => n.startsWith('color.action.'));
      const feedbackSuccessTokens = colorTokenNames.filter(n => n.startsWith('color.feedback.success'));
      const feedbackErrorTokens = colorTokenNames.filter(n => n.startsWith('color.feedback.error'));
      const feedbackWarningTokens = colorTokenNames.filter(n => n.startsWith('color.feedback.warning'));
      const feedbackInfoTokens = colorTokenNames.filter(n => n.startsWith('color.feedback.info'));
      const feedbackSelectTokens = colorTokenNames.filter(n => n.startsWith('color.feedback.select'));
      const identityTokens = colorTokenNames.filter(n => n.startsWith('color.identity.'));
      const attentionTokens = colorTokenNames.filter(n => n === 'color.attention' || n === 'color.highlight');
      const techDataTokens = colorTokenNames.filter(n => n === 'color.tech' || n === 'color.data');
      const textTokens = colorTokenNames.filter(n => n.startsWith('color.text'));
      const contrastTokens = colorTokenNames.filter(n => n.startsWith('color.contrast'));
      const structureTokens = colorTokenNames.filter(n => n.startsWith('color.structure.'));
      const glowTokens = colorTokenNames.filter(n => n.startsWith('glow.'));
      const avatarTokens = colorTokenNames.filter(n => n.startsWith('color.avatar.'));
      const badgeTokens = colorTokenNames.filter(n => n.startsWith('color.badge.'));

      expect(actionTokens.length).toBe(2); // color.action.primary, color.action.secondary
      expect(feedbackSuccessTokens.length).toBe(3); // text, background, border
      expect(feedbackErrorTokens.length).toBe(3); // text, background, border
      expect(feedbackWarningTokens.length).toBe(3); // text, background, border
      expect(feedbackInfoTokens.length).toBe(3); // text, background, border
      expect(feedbackSelectTokens.length).toBe(6); // text/background/border × rest/default
      expect(identityTokens.length).toBe(2); // human, agent
      expect(attentionTokens.length).toBe(2);
      expect(techDataTokens.length).toBe(2);
      expect(textTokens.length).toBe(3); // color.text.default, color.text.muted, color.text.subtle
      expect(contrastTokens.length).toBe(2); // color.contrast.onLight, color.contrast.onDark
      expect(structureTokens.length).toBe(4); // canvas, surface, border, border.subtle
      expect(glowTokens.length).toBe(5);
      // Avatar tokens MIGRATED to src/components/core/Avatar/avatar.tokens.ts (Spec 058)
      expect(avatarTokens.length).toBe(0); // Migrated to component directory
      expect(badgeTokens.length).toBe(2); // notification.background, notification.text
    });
  });

  describe('Utility Functions', () => {
    describe('getColorToken()', () => {
      it('should return color.feedback.success.text token', () => {
        const token = getColorToken('color.feedback.success.text');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.feedback.success.text');
      });

      it('should return color.feedback.error.text token', () => {
        const token = getColorToken('color.feedback.error.text');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.feedback.error.text');
      });

      it('should return color.feedback.warning.text token', () => {
        const token = getColorToken('color.feedback.warning.text');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.feedback.warning.text');
      });

      it('should return color.attention token', () => {
        const token = getColorToken('color.attention');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.attention');
      });

      it('should return color.tech token', () => {
        const token = getColorToken('color.tech');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.tech');
      });

      it('should return glow.neonGreen token', () => {
        const token = getColorToken('glow.neonGreen');
        expect(token).toBeDefined();
        expect(token?.name).toBe('glow.neonGreen');
      });

      it('should return undefined for non-existent token', () => {
        const token = getColorToken('color.nonexistent');
        expect(token).toBeUndefined();
      });
    });

    describe('getAllColorTokens()', () => {
      it('should return array of color tokens', () => {
        const tokens = getAllColorTokens();
        expect(Array.isArray(tokens)).toBe(true);
      });

      it('should return exactly 45 tokens', () => {
        // Updated for Spec 058: Avatar tokens migrated to component directory
        // Previous count: 50, Current count: 45 (5 Avatar tokens removed)
        const tokens = getAllColorTokens();
        expect(tokens.length).toBe(45);
      });

      it('should include all new tokens', () => {
        const tokens = getAllColorTokens();
        const tokenNames = tokens.map(t => t.name);

        expect(tokenNames).toContain('color.attention');
        expect(tokenNames).toContain('color.highlight');
        expect(tokenNames).toContain('color.tech');
        expect(tokenNames).toContain('color.data');
        expect(tokenNames).toContain('glow.neonGreen');
        expect(tokenNames).toContain('glow.neonPink');
      });

      it('should not include color.secondary', () => {
        const tokens = getAllColorTokens();
        const tokenNames = tokens.map(t => t.name);
        expect(tokenNames).not.toContain('color.secondary');
      });

      it('should return tokens with correct structure', () => {
        const tokens = getAllColorTokens();

        tokens.forEach(token => {
          expect(token).toHaveProperty('name');
          expect(token).toHaveProperty('primitiveReferences');
          expect(token).toHaveProperty('category');
          expect(token).toHaveProperty('context');
          expect(token).toHaveProperty('description');
        });
      });
    });
  });

  describe('Token Structure Consistency', () => {
    it('should have consistent structure across all tokens', () => {
      const tokens = getAllColorTokens();
      const firstToken = tokens[0];
      const firstTokenKeys = Object.keys(firstToken).sort();

      tokens.forEach(token => {
        const tokenKeys = Object.keys(token).sort();
        expect(tokenKeys).toEqual(firstTokenKeys);
      });
    });

    it('should maintain name consistency with object key', () => {
      Object.entries(colorTokens).forEach(([key, token]) => {
        expect(token.name).toBe(key);
      });
    });

    it('should have non-empty required fields', () => {
      const tokens = getAllColorTokens();

      tokens.forEach(token => {
        expect(token.name).toBeTruthy();
        expect(token.name.length).toBeGreaterThan(0);

        // Check for opacity composition pattern or standard value pattern
        const refs = token.primitiveReferences as Record<string, string>;
        if ('color' in refs && 'opacity' in refs) {
          // Opacity composition pattern: { color: 'primitiveName', opacity: 'opacityName' }
          expect(refs.color).toBeTruthy();
          expect(refs.color.length).toBeGreaterThan(0);
          expect(refs.opacity).toBeTruthy();
          expect(refs.opacity.length).toBeGreaterThan(0);
        } else {
          // Standard single-value reference pattern: { value: 'primitiveName' }
          expect(refs.value).toBeTruthy();
          expect(refs.value.length).toBeGreaterThan(0);
        }

        expect(token.category).toBeTruthy();
        expect(token.category).toBe(SemanticCategory.COLOR);

        expect(token.context).toBeTruthy();
        expect(token.context.length).toBeGreaterThan(0);

        expect(token.description).toBeTruthy();
        expect(token.description.length).toBeGreaterThan(0);
      });
    });

    it('should have valid primitive references', () => {
      const tokens = getAllColorTokens();

      tokens.forEach(token => {
        const refs = token.primitiveReferences as Record<string, string>;
        
        // Check for opacity composition pattern: { color: 'primitiveName', opacity: 'opacityName' }
        if ('color' in refs && 'opacity' in refs) {
          // Validate composite reference (color + opacity)
          // color.structure.border.subtle uses opacity composition per Spec 052 Task 9.4.FIX.1
          expect(primitiveColorTokens).toHaveProperty(refs.color);
          // Opacity primitive validation is handled by ValidatePrimitiveReferences.test.ts
        } else {
          // Standard single-value reference pattern: { value: 'primitiveName' }
          const primitiveName = refs.value;
          expect(primitiveColorTokens).toHaveProperty(primitiveName);
        }
      });
    });

    it('should have color.structure.border.subtle with opacity composition', () => {
      const token = colorTokens['color.structure.border.subtle'];
      expect(token).toBeDefined();
      
      const refs = token.primitiveReferences as Record<string, string>;
      // Verify opacity composition pattern (color + opacity)
      expect(refs.color).toBe('gray100');
      expect(refs.opacity).toBe('opacity600');
    });
  });

  describe('Palette Update Requirements Coverage', () => {
    it('should satisfy Requirement 2.1: Success tokens reference green', () => {
      expect(colorTokens['color.feedback.success.text'].primitiveReferences.value).toBe('green400');
      expect(colorTokens['color.feedback.success.background'].primitiveReferences.value).toBe('green100');
    });

    it('should satisfy Requirement 2.2: Error tokens reference pink', () => {
      expect(colorTokens['color.feedback.error.text'].primitiveReferences.value).toBe('pink400');
      expect(colorTokens['color.feedback.error.background'].primitiveReferences.value).toBe('pink100');
    });

    it('should satisfy Requirement 2.3: Warning tokens reference amber (orange)', () => {
      expect(colorTokens['color.feedback.warning.text'].primitiveReferences.value).toBe('orange400');
      expect(colorTokens['color.feedback.warning.background'].primitiveReferences.value).toBe('orange100');
    });

    it('should satisfy Requirement 2.4: New attention/highlight/tech/data tokens exist', () => {
      expect(colorTokens['color.attention']).toBeDefined();
      expect(colorTokens['color.highlight']).toBeDefined();
      expect(colorTokens['color.tech']).toBeDefined();
      expect(colorTokens['color.data']).toBeDefined();
    });

    it('should satisfy Requirement 2.5: New glow tokens exist', () => {
      expect(colorTokens['glow.neonGreen']).toBeDefined();
      expect(colorTokens['glow.neonPink']).toBeDefined();
    });

    it('should satisfy Requirement 2.6: color.secondary is removed', () => {
      expect(colorTokens['color.secondary']).toBeUndefined();
    });
  });

  /**
   * Feedback Select Color Token Tests (Spec 052)
   * 
   * Tests for Feedback Select color tokens migrated from Spec 038: Vertical List Buttons.
   * Validates that Select tokens reference correct primitives and have proper structure.
   * 
   * UPDATED (Spec 052): Token names migrated to concept-first pattern
   * - Old: color.select.selected.strong → New: color.feedback.select.text.rest
   * - Old: color.select.selected.subtle → New: color.feedback.select.background.rest
   * - Old: color.select.notSelected.strong → New: color.feedback.select.text.default
   * - Old: color.select.notSelected.subtle → New: color.feedback.select.background.default
   */
  describe('Feedback Select Color Tokens (Spec 052)', () => {
    describe('Token Existence', () => {
      it('should have color.feedback.select.text.rest token', () => {
        expect(colorTokens['color.feedback.select.text.rest']).toBeDefined();
      });

      it('should have color.feedback.select.background.rest token', () => {
        expect(colorTokens['color.feedback.select.background.rest']).toBeDefined();
      });

      it('should have color.feedback.select.text.default token', () => {
        expect(colorTokens['color.feedback.select.text.default']).toBeDefined();
      });

      it('should have color.feedback.select.background.default token', () => {
        expect(colorTokens['color.feedback.select.background.default']).toBeDefined();
      });

      it('should have color.feedback.select.border.rest token', () => {
        expect(colorTokens['color.feedback.select.border.rest']).toBeDefined();
      });

      it('should have color.feedback.select.border.default token', () => {
        expect(colorTokens['color.feedback.select.border.default']).toBeDefined();
      });
    });

    describe('Primitive References', () => {
      it('should reference cyan400 primitive for selected text', () => {
        const token = colorTokens['color.feedback.select.text.rest'];
        expect(token.primitiveReferences.value).toBe('cyan400');
      });

      it('should reference cyan100 primitive for selected background', () => {
        const token = colorTokens['color.feedback.select.background.rest'];
        expect(token.primitiveReferences.value).toBe('cyan100');
      });

      it('should reference gray200 primitive for not-selected text', () => {
        const token = colorTokens['color.feedback.select.text.default'];
        expect(token.primitiveReferences.value).toBe('gray200');
      });

      it('should reference gray100 primitive for not-selected background', () => {
        const token = colorTokens['color.feedback.select.background.default'];
        expect(token.primitiveReferences.value).toBe('gray100');
      });

      it('should reference cyan400 primitive for selected border', () => {
        const token = colorTokens['color.feedback.select.border.rest'];
        expect(token.primitiveReferences.value).toBe('cyan400');
      });

      it('should reference gray200 primitive for not-selected border', () => {
        const token = colorTokens['color.feedback.select.border.default'];
        expect(token.primitiveReferences.value).toBe('gray200');
      });

      it('should verify cyan400 primitive exists', () => {
        const token = colorTokens['color.feedback.select.text.rest'];
        const primitiveName = token.primitiveReferences.value;
        expect(primitiveColorTokens).toHaveProperty(primitiveName);
      });

      it('should verify cyan100 primitive exists', () => {
        const token = colorTokens['color.feedback.select.background.rest'];
        const primitiveName = token.primitiveReferences.value;
        expect(primitiveColorTokens).toHaveProperty(primitiveName);
      });

      it('should verify gray200 primitive exists', () => {
        const token = colorTokens['color.feedback.select.text.default'];
        const primitiveName = token.primitiveReferences.value;
        expect(primitiveColorTokens).toHaveProperty(primitiveName);
      });

      it('should verify gray100 primitive exists', () => {
        const token = colorTokens['color.feedback.select.background.default'];
        const primitiveName = token.primitiveReferences.value;
        expect(primitiveColorTokens).toHaveProperty(primitiveName);
      });
    });

    describe('Token Structure', () => {
      it('should have COLOR category for all select tokens', () => {
        expect(colorTokens['color.feedback.select.text.rest'].category).toBe(SemanticCategory.COLOR);
        expect(colorTokens['color.feedback.select.background.rest'].category).toBe(SemanticCategory.COLOR);
        expect(colorTokens['color.feedback.select.text.default'].category).toBe(SemanticCategory.COLOR);
        expect(colorTokens['color.feedback.select.background.default'].category).toBe(SemanticCategory.COLOR);
        expect(colorTokens['color.feedback.select.border.rest'].category).toBe(SemanticCategory.COLOR);
        expect(colorTokens['color.feedback.select.border.default'].category).toBe(SemanticCategory.COLOR);
      });

      it('should have meaningful context for selected tokens', () => {
        const selectedToken = colorTokens['color.feedback.select.text.rest'];
        expect(selectedToken.context).toBeTruthy();
        expect(selectedToken.context.toLowerCase()).toContain('selected');

        const selectedBgToken = colorTokens['color.feedback.select.background.rest'];
        expect(selectedBgToken.context).toBeTruthy();
        expect(selectedBgToken.context.toLowerCase()).toContain('selected');
      });

      it('should have meaningful context for not-selected tokens', () => {
        const notSelectedToken = colorTokens['color.feedback.select.text.default'];
        expect(notSelectedToken.context).toBeTruthy();
        expect(notSelectedToken.context.toLowerCase()).toContain('not-selected');

        const notSelectedBgToken = colorTokens['color.feedback.select.background.default'];
        expect(notSelectedBgToken.context).toBeTruthy();
        expect(notSelectedBgToken.context.toLowerCase()).toContain('not-selected');
      });

      it('should have descriptions for all select tokens', () => {
        expect(colorTokens['color.feedback.select.text.rest'].description).toBeTruthy();
        expect(colorTokens['color.feedback.select.background.rest'].description).toBeTruthy();
        expect(colorTokens['color.feedback.select.text.default'].description).toBeTruthy();
        expect(colorTokens['color.feedback.select.background.default'].description).toBeTruthy();
        expect(colorTokens['color.feedback.select.border.rest'].description).toBeTruthy();
        expect(colorTokens['color.feedback.select.border.default'].description).toBeTruthy();
      });
    });

    describe('Utility Function Access', () => {
      it('should return color.feedback.select.text.rest via getColorToken()', () => {
        const token = getColorToken('color.feedback.select.text.rest');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.feedback.select.text.rest');
      });

      it('should return color.feedback.select.background.rest via getColorToken()', () => {
        const token = getColorToken('color.feedback.select.background.rest');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.feedback.select.background.rest');
      });

      it('should return color.feedback.select.text.default via getColorToken()', () => {
        const token = getColorToken('color.feedback.select.text.default');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.feedback.select.text.default');
      });

      it('should return color.feedback.select.background.default via getColorToken()', () => {
        const token = getColorToken('color.feedback.select.background.default');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.feedback.select.background.default');
      });

      it('should include all select tokens in getAllColorTokens()', () => {
        const tokens = getAllColorTokens();
        const tokenNames = tokens.map(t => t.name);

        expect(tokenNames).toContain('color.feedback.select.text.rest');
        expect(tokenNames).toContain('color.feedback.select.background.rest');
        expect(tokenNames).toContain('color.feedback.select.text.default');
        expect(tokenNames).toContain('color.feedback.select.background.default');
        expect(tokenNames).toContain('color.feedback.select.border.rest');
        expect(tokenNames).toContain('color.feedback.select.border.default');
      });
    });

    describe('Token Count Includes Select Tokens', () => {
      it('should have exactly 6 feedback select tokens', () => {
        const selectTokens = colorTokenNames.filter(n => n.startsWith('color.feedback.select'));
        expect(selectTokens.length).toBe(6);
      });

      it('should include select tokens in total count of 45', () => {
        // Verify total count includes the 6 feedback select tokens
        // Updated for Spec 058: 45 total tokens (5 Avatar tokens migrated to component directory)
        expect(colorTokenNames.length).toBe(45);
        expect(validateColorTokenCount()).toBe(true);
      });
    });
  });

  // Identity Concept Tokens (Spec 052: Semantic Token Naming Implementation)
  describe('Identity Concept Tokens (Spec 052)', () => {
    describe('Token Existence', () => {
      it('should have color.identity.human token', () => {
        const token = colorTokens['color.identity.human'];
        expect(token).toBeDefined();
        expect(token.name).toBe('color.identity.human');
      });

      it('should have color.identity.agent token', () => {
        const token = colorTokens['color.identity.agent'];
        expect(token).toBeDefined();
        expect(token.name).toBe('color.identity.agent');
      });
    });

    describe('Primitive References', () => {
      it('color.identity.human should reference orange300', () => {
        const token = colorTokens['color.identity.human'];
        expect(token.primitiveReferences.value).toBe('orange300');
      });

      it('color.identity.agent should reference teal200', () => {
        const token = colorTokens['color.identity.agent'];
        expect(token.primitiveReferences.value).toBe('teal200');
      });
    });

    describe('Token Structure', () => {
      it('color.identity.human should have correct category', () => {
        const token = colorTokens['color.identity.human'];
        expect(token.category).toBe(SemanticCategory.COLOR);
      });

      it('color.identity.agent should have correct category', () => {
        const token = colorTokens['color.identity.agent'];
        expect(token.category).toBe(SemanticCategory.COLOR);
      });

      it('color.identity.human should have context and description', () => {
        const token = colorTokens['color.identity.human'];
        expect(token.context).toBeDefined();
        expect(token.context.length).toBeGreaterThan(0);
        expect(token.description).toBeDefined();
        expect(token.description.length).toBeGreaterThan(0);
      });

      it('color.identity.agent should have context and description', () => {
        const token = colorTokens['color.identity.agent'];
        expect(token.context).toBeDefined();
        expect(token.context.length).toBeGreaterThan(0);
        expect(token.description).toBeDefined();
        expect(token.description.length).toBeGreaterThan(0);
      });
    });

    describe('Utility Function Access', () => {
      it('should return color.identity.human via getColorToken()', () => {
        const token = getColorToken('color.identity.human');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.identity.human');
      });

      it('should return color.identity.agent via getColorToken()', () => {
        const token = getColorToken('color.identity.agent');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.identity.agent');
      });

      it('should include all identity tokens in getAllColorTokens()', () => {
        const tokens = getAllColorTokens();
        const tokenNames = tokens.map(t => t.name);

        expect(tokenNames).toContain('color.identity.human');
        expect(tokenNames).toContain('color.identity.agent');
      });
    });

    describe('Token Count Includes Identity Tokens', () => {
      it('should have exactly 2 identity tokens', () => {
        const identityTokens = colorTokenNames.filter(n => n.startsWith('color.identity'));
        expect(identityTokens.length).toBe(2);
      });
    });

    describe('Migration from Avatar Tokens (Spec 052)', () => {
      it('should NOT have old color.avatar.human token (migrated to color.identity.human)', () => {
        const token = colorTokens['color.avatar.human'];
        expect(token).toBeUndefined();
      });

      it('should NOT have old color.avatar.agent token (migrated to color.identity.agent)', () => {
        const token = colorTokens['color.avatar.agent'];
        expect(token).toBeUndefined();
      });
    });
  });

  // Action Concept Tokens (Spec 052: Semantic Token Naming Implementation)
  describe('Action Concept Tokens (Spec 052)', () => {
    describe('Token Existence', () => {
      it('should have color.action.primary token', () => {
        const token = colorTokens['color.action.primary'];
        expect(token).toBeDefined();
        expect(token.name).toBe('color.action.primary');
      });

      it('should have color.action.secondary token', () => {
        const token = colorTokens['color.action.secondary'];
        expect(token).toBeDefined();
        expect(token.name).toBe('color.action.secondary');
      });
    });

    describe('Primitive References', () => {
      it('color.action.primary should reference purple300', () => {
        const token = colorTokens['color.action.primary'];
        expect(token.primitiveReferences.value).toBe('purple300');
      });

      it('color.action.secondary should reference black400', () => {
        const token = colorTokens['color.action.secondary'];
        expect(token.primitiveReferences.value).toBe('black400');
      });
    });

    describe('Token Structure', () => {
      it('color.action.primary should have correct category', () => {
        const token = colorTokens['color.action.primary'];
        expect(token.category).toBe(SemanticCategory.COLOR);
      });

      it('color.action.secondary should have correct category', () => {
        const token = colorTokens['color.action.secondary'];
        expect(token.category).toBe(SemanticCategory.COLOR);
      });

      it('color.action.primary should have context and description', () => {
        const token = colorTokens['color.action.primary'];
        expect(token.context).toBeDefined();
        expect(token.context.length).toBeGreaterThan(0);
        expect(token.description).toBeDefined();
        expect(token.description.length).toBeGreaterThan(0);
      });

      it('color.action.secondary should have context and description', () => {
        const token = colorTokens['color.action.secondary'];
        expect(token.context).toBeDefined();
        expect(token.context.length).toBeGreaterThan(0);
        expect(token.description).toBeDefined();
        expect(token.description.length).toBeGreaterThan(0);
      });
    });

    describe('Utility Function Access', () => {
      it('should return color.action.primary via getColorToken()', () => {
        const token = getColorToken('color.action.primary');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.action.primary');
      });

      it('should return color.action.secondary via getColorToken()', () => {
        const token = getColorToken('color.action.secondary');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.action.secondary');
      });

      it('should include all action tokens in getAllColorTokens()', () => {
        const tokens = getAllColorTokens();
        const tokenNames = tokens.map(t => t.name);

        expect(tokenNames).toContain('color.action.primary');
        expect(tokenNames).toContain('color.action.secondary');
      });
    });

    describe('Token Count Includes Action Tokens', () => {
      it('should have exactly 2 action tokens', () => {
        const actionTokens = colorTokenNames.filter(n => n.startsWith('color.action'));
        expect(actionTokens.length).toBe(2);
      });
    });

    describe('Migration from Brand Token (Spec 052)', () => {
      it('should NOT have old color.primary token (migrated to color.action.primary)', () => {
        const token = colorTokens['color.primary'];
        expect(token).toBeUndefined();
      });
    });
  });

  // Contrast Concept Tokens (Spec 052: Semantic Token Naming Implementation)
  describe('Contrast Concept Tokens (Spec 052)', () => {
    describe('Token Existence', () => {
      it('should have color.contrast.onLight token', () => {
        const token = colorTokens['color.contrast.onLight'];
        expect(token).toBeDefined();
        expect(token.name).toBe('color.contrast.onLight');
      });

      it('should have color.contrast.onDark token', () => {
        const token = colorTokens['color.contrast.onDark'];
        expect(token).toBeDefined();
        expect(token.name).toBe('color.contrast.onDark');
      });
    });

    describe('Primitive References', () => {
      it('color.contrast.onLight should reference black500', () => {
        const token = colorTokens['color.contrast.onLight'];
        expect(token.primitiveReferences.value).toBe('black500');
      });

      it('color.contrast.onDark should reference white100', () => {
        const token = colorTokens['color.contrast.onDark'];
        expect(token.primitiveReferences.value).toBe('white100');
      });
    });

    describe('Token Structure', () => {
      it('color.contrast.onLight should have correct category', () => {
        const token = colorTokens['color.contrast.onLight'];
        expect(token.category).toBe(SemanticCategory.COLOR);
      });

      it('color.contrast.onDark should have correct category', () => {
        const token = colorTokens['color.contrast.onDark'];
        expect(token.category).toBe(SemanticCategory.COLOR);
      });

      it('color.contrast.onLight should have context and description', () => {
        const token = colorTokens['color.contrast.onLight'];
        expect(token.context).toBeDefined();
        expect(token.context.length).toBeGreaterThan(0);
        expect(token.description).toBeDefined();
        expect(token.description.length).toBeGreaterThan(0);
      });

      it('color.contrast.onDark should have context and description', () => {
        const token = colorTokens['color.contrast.onDark'];
        expect(token.context).toBeDefined();
        expect(token.context.length).toBeGreaterThan(0);
        expect(token.description).toBeDefined();
        expect(token.description.length).toBeGreaterThan(0);
      });
    });

    describe('Utility Function Access', () => {
      it('should return color.contrast.onLight via getColorToken()', () => {
        const token = getColorToken('color.contrast.onLight');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.contrast.onLight');
      });

      it('should return color.contrast.onDark via getColorToken()', () => {
        const token = getColorToken('color.contrast.onDark');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.contrast.onDark');
      });

      it('should include all contrast tokens in getAllColorTokens()', () => {
        const tokens = getAllColorTokens();
        const tokenNames = tokens.map(t => t.name);

        expect(tokenNames).toContain('color.contrast.onLight');
        expect(tokenNames).toContain('color.contrast.onDark');
      });
    });

    describe('Token Count Includes Contrast Tokens', () => {
      it('should have exactly 2 contrast tokens', () => {
        const contrastTokens = colorTokenNames.filter(n => n.startsWith('color.contrast'));
        expect(contrastTokens.length).toBe(2);
      });
    });

    describe('Migration from onPrimary Token (Spec 052)', () => {
      it('should NOT have old color.contrast.onPrimary token (migrated to color.contrast.onDark)', () => {
        const token = colorTokens['color.contrast.onPrimary'];
        expect(token).toBeUndefined();
      });
    });
  });

  // Avatar Color Tokens - MIGRATED (Spec 058: Component Token Architecture Cleanup)
  // Avatar color tokens have been migrated to src/components/core/Avatar/avatar.tokens.ts
  // per Rosetta System architecture which mandates component tokens live at src/components/[ComponentName]/tokens.ts
  // 
  // These tests now verify:
  // 1. Avatar tokens are NOT in ColorTokens.ts (migration complete)
  // 2. Backward compatibility re-exports work correctly
  // 3. Deprecation warnings are in place
  //
  // For Avatar token functionality tests, see: src/components/core/Avatar/__tests__/avatar.tokens.test.ts
  describe('Avatar Color Tokens - Migration Verification (Spec 058)', () => {
    describe('Token Migration Complete', () => {
      it('should NOT have color.avatar.human.background in colorTokens (migrated)', () => {
        const token = colorTokens['color.avatar.human.background'];
        expect(token).toBeUndefined();
      });

      it('should NOT have color.avatar.agent.background in colorTokens (migrated)', () => {
        const token = colorTokens['color.avatar.agent.background'];
        expect(token).toBeUndefined();
      });

      it('should NOT have color.avatar.human.icon in colorTokens (migrated)', () => {
        const token = colorTokens['color.avatar.human.icon'];
        expect(token).toBeUndefined();
      });

      it('should NOT have color.avatar.agent.icon in colorTokens (migrated)', () => {
        const token = colorTokens['color.avatar.agent.icon'];
        expect(token).toBeUndefined();
      });

      it('should NOT have color.avatar.default.border in colorTokens (migrated)', () => {
        const token = colorTokens['color.avatar.default.border'];
        expect(token).toBeUndefined();
      });
    });

    describe('Token Count Updated', () => {
      it('should have 0 avatar tokens in ColorTokens (all migrated to component directory)', () => {
        const avatarTokens = colorTokenNames.filter(n => n.startsWith('color.avatar'));
        expect(avatarTokens.length).toBe(0);
      });
    });

    describe('Backward Compatibility Re-exports', () => {
      it('should re-export AvatarColorTokens for backward compatibility', () => {
        // Import the re-exported AvatarColorTokens
        const { AvatarColorTokens } = require('../ColorTokens');
        expect(AvatarColorTokens).toBeDefined();
        expect(AvatarColorTokens['human.background']).toBe('color.identity.human');
        expect(AvatarColorTokens['agent.background']).toBe('color.identity.agent');
        expect(AvatarColorTokens['human.icon']).toBe('color.contrast.onDark');
        expect(AvatarColorTokens['agent.icon']).toBe('color.contrast.onDark');
        expect(AvatarColorTokens['default.border']).toBe('color.structure.border');
      });
    });
  });

  /**
   * Badge Color Token Tests
   * 
   * Tests for Badge color tokens added in Spec 044: Badge Component Family.
   * Validates that Badge tokens reference correct primitives and have proper structure.
   * Following industry-standard naming pattern: [semantic token family].[component].[property].[variant]
   */
  describe('Badge Color Tokens (Spec 044, Updated Spec 052)', () => {
    describe('Token Existence', () => {
      it('should have color.badge.notification.background token', () => {
        expect(colorTokens['color.badge.notification.background']).toBeDefined();
      });

      it('should have color.badge.notification.text token', () => {
        expect(colorTokens['color.badge.notification.text']).toBeDefined();
      });
    });

    describe('Primitive References', () => {
      it('should reference pink400 primitive for notification background', () => {
        const token = colorTokens['color.badge.notification.background'];
        expect(token.primitiveReferences.value).toBe('pink400');
      });

      it('should reference white100 primitive for notification text', () => {
        const token = colorTokens['color.badge.notification.text'];
        expect(token.primitiveReferences.value).toBe('white100');
      });

      it('should verify pink400 primitive exists', () => {
        const token = colorTokens['color.badge.notification.background'];
        const primitiveName = token.primitiveReferences.value;
        expect(primitiveColorTokens).toHaveProperty(primitiveName);
      });

      it('should verify white100 primitive exists', () => {
        const token = colorTokens['color.badge.notification.text'];
        const primitiveName = token.primitiveReferences.value;
        expect(primitiveColorTokens).toHaveProperty(primitiveName);
      });
    });

    describe('Token Structure', () => {
      it('should have COLOR category for badge background token', () => {
        expect(colorTokens['color.badge.notification.background'].category).toBe(SemanticCategory.COLOR);
      });

      it('should have COLOR category for badge text token', () => {
        expect(colorTokens['color.badge.notification.text'].category).toBe(SemanticCategory.COLOR);
      });

      it('should have meaningful context for badge background token', () => {
        const token = colorTokens['color.badge.notification.background'];
        expect(token.context).toBeTruthy();
        expect(token.context.toLowerCase()).toContain('notification');
        expect(token.context.toLowerCase()).toContain('badge');
      });

      it('should have meaningful context for badge text token', () => {
        const token = colorTokens['color.badge.notification.text'];
        expect(token.context).toBeTruthy();
        expect(token.context.toLowerCase()).toContain('notification');
        expect(token.context.toLowerCase()).toContain('badge');
      });

      it('should have descriptions for all badge tokens', () => {
        expect(colorTokens['color.badge.notification.background'].description).toBeTruthy();
        expect(colorTokens['color.badge.notification.text'].description).toBeTruthy();
      });

      it('should follow {component}.{variant}.{property} naming pattern (Spec 052)', () => {
        // Verify naming pattern: color.badge.notification.background
        const bgToken = colorTokens['color.badge.notification.background'];
        expect(bgToken.name).toBe('color.badge.notification.background');
        const bgParts = bgToken.name.split('.');
        expect(bgParts[0]).toBe('color');        // semantic token family
        expect(bgParts[1]).toBe('badge');        // component
        expect(bgParts[2]).toBe('notification'); // variant
        expect(bgParts[3]).toBe('background');   // property

        // Verify naming pattern: color.badge.notification.text
        const textToken = colorTokens['color.badge.notification.text'];
        expect(textToken.name).toBe('color.badge.notification.text');
        const textParts = textToken.name.split('.');
        expect(textParts[0]).toBe('color');        // semantic token family
        expect(textParts[1]).toBe('badge');        // component
        expect(textParts[2]).toBe('notification'); // variant
        expect(textParts[3]).toBe('text');         // property
      });
    });

    describe('Utility Function Access', () => {
      it('should return color.badge.notification.background via getColorToken()', () => {
        const token = getColorToken('color.badge.notification.background');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.badge.notification.background');
      });

      it('should return color.badge.notification.text via getColorToken()', () => {
        const token = getColorToken('color.badge.notification.text');
        expect(token).toBeDefined();
        expect(token?.name).toBe('color.badge.notification.text');
      });

      it('should include all badge tokens in getAllColorTokens()', () => {
        const tokens = getAllColorTokens();
        const tokenNames = tokens.map(t => t.name);

        expect(tokenNames).toContain('color.badge.notification.background');
        expect(tokenNames).toContain('color.badge.notification.text');
      });
    });

    describe('Token Count Includes Badge Tokens', () => {
      it('should have exactly 2 badge tokens', () => {
        const badgeTokens = colorTokenNames.filter(n => n.startsWith('color.badge'));
        expect(badgeTokens.length).toBe(2);
      });

      it('should include badge tokens in total count of 45', () => {
        // Verify total count includes the 2 badge tokens
        // Updated for Spec 058: 45 total tokens (5 Avatar tokens migrated to component directory)
        expect(colorTokenNames.length).toBe(45);
        expect(validateColorTokenCount()).toBe(true);
      });
    });

    describe('Requirements Coverage (Spec 044, Updated Spec 052)', () => {
      it('should satisfy Requirement 4.7: Badge-Count-Notification uses notification color tokens', () => {
        expect(colorTokens['color.badge.notification.background']).toBeDefined();
        expect(colorTokens['color.badge.notification.text']).toBeDefined();
      });

      it('should satisfy Requirement 9.1: color.badge.notification.background references pink400', () => {
        const token = colorTokens['color.badge.notification.background'];
        expect(token.primitiveReferences.value).toBe('pink400');
      });

      it('should satisfy Requirement 9.2: color.badge.notification.text references white100', () => {
        const token = colorTokens['color.badge.notification.text'];
        expect(token.primitiveReferences.value).toBe('white100');
      });

      it('should satisfy Requirement 9.7: tokens follow {component}.{variant}.{property} pattern (Spec 052)', () => {
        // Pattern: [semantic token family].[component].[variant].[property]
        const bgToken = colorTokens['color.badge.notification.background'];
        const textToken = colorTokens['color.badge.notification.text'];
        
        // Both tokens follow the pattern
        expect(bgToken.name.split('.').length).toBe(4);
        expect(textToken.name.split('.').length).toBe(4);
      });
    });
  });
});
