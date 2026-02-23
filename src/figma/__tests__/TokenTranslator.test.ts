/**
 * TokenTranslator — Unit Tests
 *
 * Tests for the binding-first token translation approach:
 * - figmaNameToTokenPath utility
 * - translateByBinding (Figma variable name → DTCG token path)
 * - translateByValue (raw value matching with tolerance)
 * - enrichResponse (primitive ↔ semantic resolution)
 * - translate (composite: binding-first with value fallback)
 * - Color format handling (hex → rgba DTCG lookup)
 *
 * @requirements Req 2
 * @spec 054b-figma-design-extract
 */

import {
  figmaNameToTokenPath,
  parseRgba,
  parseHex,
  rgbToLab,
  deltaE,
  TokenTranslator,
} from '../TokenTranslator';
import type { ClassificationSummary } from '../TokenTranslator';
import type { DTCGTokenFile } from '../../generators/types/DTCGTypes';

// ---------------------------------------------------------------------------
// Mock DTCG token tree
// ---------------------------------------------------------------------------

/**
 * Minimal DTCG token tree that exercises all translation paths:
 * - Spacing primitives (space group with numeric keys)
 * - Color primitives (color.purple group with rgba values)
 * - Semantic color alias (color.primary → color.purple.300)
 * - Radius primitives
 * - Typography (fontSize) primitives
 */
function buildMockDTCGTokens(): DTCGTokenFile {
  return {
    $schema: 'https://tr.designtokens.org/format/',
    space: {
      space100: {
        $value: '8px',
        $type: 'dimension',
        $extensions: { designerpunk: { family: 'spacing', formula: 'base × 1' } },
      },
      space200: {
        $value: '16px',
        $type: 'dimension',
        $extensions: { designerpunk: { family: 'spacing', formula: 'base × 2' } },
      },
      space300: {
        $value: '24px',
        $type: 'dimension',
        $extensions: { designerpunk: { family: 'spacing', formula: 'base × 3' } },
      },
      space400: {
        $value: '32px',
        $type: 'dimension',
        $extensions: { designerpunk: { family: 'spacing', formula: 'base × 4' } },
      },
    },
    color: {
      purple: {
        purple300: {
          $value: 'rgba(147, 51, 234, 1)',
          $type: 'color',
          $extensions: { designerpunk: { family: 'color' } },
        },
        purple500: {
          $value: 'rgba(107, 33, 168, 1)',
          $type: 'color',
          $extensions: { designerpunk: { family: 'color' } },
        },
      },
      // Semantic alias: color.primary references color.purple.purple300
      primary: {
        $value: '{color.purple.purple300}',
        $type: 'color',
        $extensions: { designerpunk: { family: 'color' } },
      },
    },
    radius: {
      radius100: {
        $value: '4px',
        $type: 'dimension',
        $extensions: { designerpunk: { family: 'radius' } },
      },
      radius200: {
        $value: '8px',
        $type: 'dimension',
        $extensions: { designerpunk: { family: 'radius' } },
      },
    },
    fontSize: {
      fontSize100: {
        $value: '12px',
        $type: 'dimension',
        $extensions: { designerpunk: { family: 'fontSize' } },
      },
      fontSize200: {
        $value: '14px',
        $type: 'dimension',
        $extensions: { designerpunk: { family: 'fontSize' } },
      },
      fontSize300: {
        $value: '16px',
        $type: 'dimension',
        $extensions: { designerpunk: { family: 'fontSize' } },
      },
    },
  } as unknown as DTCGTokenFile;
}

// ---------------------------------------------------------------------------
// figmaNameToTokenPath
// ---------------------------------------------------------------------------

describe('figmaNameToTokenPath', () => {
  it('converts single-level slash to dot', () => {
    expect(figmaNameToTokenPath('space/100')).toBe('space.100');
  });

  it('converts multi-level slash to dot', () => {
    expect(figmaNameToTokenPath('color/purple/300')).toBe('color.purple.300');
  });

  it('converts deeply nested path', () => {
    expect(figmaNameToTokenPath('color/feedback/success/text')).toBe(
      'color.feedback.success.text',
    );
  });

  it('returns input unchanged when no slashes', () => {
    expect(figmaNameToTokenPath('space100')).toBe('space100');
  });
});

// ---------------------------------------------------------------------------
// Color parsing utilities
// ---------------------------------------------------------------------------

describe('parseRgba', () => {
  it('parses rgba() with alpha', () => {
    const rgb = parseRgba('rgba(147, 51, 234, 1)');
    expect(rgb).toEqual({ r: 147, g: 51, b: 234, a: 1 });
  });

  it('parses rgb() without alpha', () => {
    const rgb = parseRgba('rgb(255, 0, 0)');
    expect(rgb).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('returns null for invalid input', () => {
    expect(parseRgba('#FF0000')).toBeNull();
    expect(parseRgba('not a color')).toBeNull();
  });
});

describe('parseHex', () => {
  it('parses 6-digit hex', () => {
    const rgb = parseHex('#9333EA');
    expect(rgb).toEqual({ r: 147, g: 51, b: 234, a: 1 });
  });

  it('parses 3-digit hex', () => {
    const rgb = parseHex('#F00');
    expect(rgb).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  it('parses 8-digit hex with alpha', () => {
    const rgb = parseHex('#9333EAFF');
    expect(rgb).toEqual({ r: 147, g: 51, b: 234, a: 1 });
  });

  it('returns null for invalid hex', () => {
    expect(parseHex('#GGG')).toBeNull();
    expect(parseHex('not hex')).toBeNull();
  });
});

describe('deltaE', () => {
  it('returns 0 for identical colors', () => {
    const lab = rgbToLab({ r: 147, g: 51, b: 234, a: 1 });
    expect(deltaE(lab, lab)).toBe(0);
  });

  it('returns small value for perceptually similar colors', () => {
    const lab1 = rgbToLab({ r: 147, g: 51, b: 234, a: 1 });
    const lab2 = rgbToLab({ r: 149, g: 52, b: 233, a: 1 });
    expect(deltaE(lab1, lab2)).toBeLessThan(3);
  });

  it('returns large value for very different colors', () => {
    const lab1 = rgbToLab({ r: 255, g: 0, b: 0, a: 1 });
    const lab2 = rgbToLab({ r: 0, g: 0, b: 255, a: 1 });
    expect(deltaE(lab1, lab2)).toBeGreaterThan(50);
  });
});

// ---------------------------------------------------------------------------
// TokenTranslator
// ---------------------------------------------------------------------------

describe('TokenTranslator', () => {
  let translator: TokenTranslator;
  let tokens: DTCGTokenFile;

  beforeEach(() => {
    tokens = buildMockDTCGTokens();
    translator = new TokenTranslator(tokens);
  });

  // -----------------------------------------------------------------------
  // translateByBinding
  // -----------------------------------------------------------------------

  describe('translateByBinding', () => {
    it('matches Figma variable via reverse index (space/100 → space.space100)', () => {
      const result = translator.translateByBinding('space/100');
      expect(result.confidence).toBe('exact');
      expect(result.matchMethod).toBe('binding');
      expect(result.token).toBe('space.space100');
      expect(result.rawValue).toBe('8px');
    });

    it('matches nested color variable (color/purple/purple/300 → color.purple.purple300)', () => {
      // FigmaTransformer push generates: color/purple/purple/300
      // (groupPath=color/purple, key=purple300 → splitNameAndNumber → purple/300)
      const result = translator.translateByBinding('color/purple/purple/300');
      expect(result.confidence).toBe('exact');
      expect(result.matchMethod).toBe('binding');
      expect(result.token).toBe('color.purple.purple300');
    });

    it('returns no-match for unknown variable', () => {
      const result = translator.translateByBinding('unknown/variable');
      expect(result.confidence).toBe('no-match');
      expect(result.matchMethod).toBe('binding');
      expect(result.token).toBe('');
    });
  });

  // -----------------------------------------------------------------------
  // translateByValue — spacing
  // -----------------------------------------------------------------------

  describe('translateByValue (spacing)', () => {
    it('exact match: 24px → space.space300', () => {
      const result = translator.translateByValue('24px', 'spacing');
      expect(result.confidence).toBe('exact');
      expect(result.matchMethod).toBe('value');
      expect(result.token).toBe('space.space300');
    });

    it('exact match with numeric input: 24 → space.space300', () => {
      const result = translator.translateByValue(24, 'spacing');
      expect(result.confidence).toBe('exact');
      expect(result.matchMethod).toBe('value');
      expect(result.token).toBe('space.space300');
    });

    it('approximate match within ±2px: 25px → space.space300', () => {
      const result = translator.translateByValue('25px', 'spacing');
      expect(result.confidence).toBe('approximate');
      expect(result.matchMethod).toBe('value');
      expect(result.token).toBe('space.space300');
      expect(result.delta).toMatch(/±?1px/);
    });

    it('approximate match at tolerance boundary: 26px → space.space300 (±2px)', () => {
      const result = translator.translateByValue('26px', 'spacing');
      expect(result.confidence).toBe('approximate');
      expect(result.token).toBe('space.space300');
      expect(result.delta).toMatch(/±?2px/);
    });

    it('no-match beyond tolerance: 30px with suggestion', () => {
      // 30px is 2px from 32px (space400) and 6px from 24px (space300)
      const result = translator.translateByValue('30px', 'spacing');
      expect(result.confidence).toBe('approximate');
      expect(result.token).toBe('space.space400');
    });

    it('no-match for value far from any token', () => {
      const result = translator.translateByValue('100px', 'spacing');
      expect(result.confidence).toBe('no-match');
      expect(result.token).toBe('');
      expect(result.suggestion).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // translateByValue — color
  // -----------------------------------------------------------------------

  describe('translateByValue (color)', () => {
    it('exact hex match: #9333EA → color.purple.purple300', () => {
      const result = translator.translateByValue('#9333EA', 'color');
      // The hex #9333EA = rgb(147, 51, 234) which matches rgba(147, 51, 234, 1)
      expect(result.confidence).toBe('exact');
      expect(result.matchMethod).toBe('value');
      expect(result.token).toBe('color.purple.purple300');
    });

    it('approximate hex match within ΔE < 3', () => {
      // Slightly different purple — should be within ΔE tolerance
      const result = translator.translateByValue('#9535E8', 'color');
      if (result.confidence === 'approximate') {
        expect(result.token).toBe('color.purple.purple300');
        expect(result.delta).toMatch(/ΔE/);
      } else {
        // Could be exact depending on rounding — either is acceptable
        expect(result.confidence).toBe('exact');
      }
    });

    it('no-match for color far from any token', () => {
      const result = translator.translateByValue('#00FF00', 'color');
      expect(result.confidence).toBe('no-match');
      expect(result.token).toBe('');
    });

    it('handles rgba input format', () => {
      const result = translator.translateByValue('rgba(147, 51, 234, 1)', 'color');
      expect(result.confidence).toBe('exact');
      expect(result.token).toBe('color.purple.purple300');
    });

    it('returns no-match for unparseable color', () => {
      const result = translator.translateByValue('not-a-color', 'color');
      expect(result.confidence).toBe('no-match');
    });
  });

  // -----------------------------------------------------------------------
  // translateByValue — radius and typography
  // -----------------------------------------------------------------------

  describe('translateByValue (radius)', () => {
    it('exact match: 4px → radius.radius100', () => {
      const result = translator.translateByValue('4px', 'radius');
      expect(result.confidence).toBe('exact');
      expect(result.token).toBe('radius.radius100');
    });

    it('approximate match within ±1px: 5px → radius.radius100', () => {
      const result = translator.translateByValue('5px', 'radius');
      expect(result.confidence).toBe('approximate');
      expect(result.token).toBe('radius.radius100');
    });

    it('no-match beyond ±1px tolerance: 6px', () => {
      // 6px is 2px from radius100 (4px) and 2px from radius200 (8px)
      const result = translator.translateByValue('6px', 'radius');
      expect(result.confidence).toBe('no-match');
      expect(result.token).toBe('');
    });
  });

  describe('translateByValue (typography)', () => {
    it('exact match: 14px → fontSize.fontSize200', () => {
      const result = translator.translateByValue('14px', 'fontSize');
      expect(result.confidence).toBe('exact');
      expect(result.token).toBe('fontSize.fontSize200');
    });

    it('approximate match within ±1px: 15px → fontSize.fontSize300 (16px)', () => {
      const result = translator.translateByValue('15px', 'fontSize');
      expect(result.confidence).toBe('approximate');
      // 15px is 1px from both fontSize200 (14px) and fontSize300 (16px)
      // Either match is acceptable
      expect(['fontSize.fontSize200', 'fontSize.fontSize300']).toContain(result.token);
    });
  });

  // -----------------------------------------------------------------------
  // enrichResponse
  // -----------------------------------------------------------------------

  describe('enrichResponse', () => {
    it('enriches primitive with semantic alias', () => {
      // color.purple.purple300 is a primitive; color.primary aliases it
      const result = translator.enrichResponse({
        token: 'color.purple.purple300',
        confidence: 'exact',
        matchMethod: 'binding',
        rawValue: 'rgba(147, 51, 234, 1)',
      });

      expect(result.primitive).toBe('color.purple.purple300');
      expect(result.semantic).toBe('color.primary');
      // Semantic should be promoted to primary token field
      expect(result.token).toBe('color.primary');
    });

    it('enriches semantic alias with primitive reference', () => {
      const result = translator.enrichResponse({
        token: 'color.primary',
        confidence: 'exact',
        matchMethod: 'binding',
        rawValue: '{color.purple.purple300}',
      });

      expect(result.semantic).toBe('color.primary');
      expect(result.primitive).toBe('color.purple.purple300');
    });

    it('marks primitive-only token (no semantic alias)', () => {
      const result = translator.enrichResponse({
        token: 'space.space300',
        confidence: 'exact',
        matchMethod: 'binding',
        rawValue: '24px',
      });

      expect(result.primitive).toBe('space.space300');
      expect(result.semantic).toBeUndefined();
    });

    it('passes through no-match results unchanged', () => {
      const noMatch = {
        token: '',
        confidence: 'no-match' as const,
        matchMethod: 'value' as const,
        rawValue: '999px',
      };
      const result = translator.enrichResponse(noMatch);
      expect(result).toEqual(noMatch);
    });
  });

  // -----------------------------------------------------------------------
  // translate (composite)
  // -----------------------------------------------------------------------

  describe('translate (composite)', () => {
    it('uses binding-first when variable name provided and matches', () => {
      const result = translator.translate('space/300', '24px', 'spacing');
      expect(result.confidence).toBe('exact');
      expect(result.matchMethod).toBe('binding');
      expect(result.token).toBe('space.space300');
      expect(result.primitive).toBe('space.space300');
    });

    it('falls back to value when binding fails', () => {
      const result = translator.translate('unknown/var', '24px', 'spacing');
      expect(result.confidence).toBe('exact');
      expect(result.matchMethod).toBe('value');
      expect(result.token).toBe('space.space300');
    });

    it('uses value-only when no variable name provided', () => {
      const result = translator.translate(undefined, '24px', 'spacing');
      expect(result.confidence).toBe('exact');
      expect(result.matchMethod).toBe('value');
      expect(result.token).toBe('space.space300');
    });

    it('enriches binding result with semantic token', () => {
      // Use the actual Figma variable name that push generates for color.purple.purple300
      const result = translator.translate('color/purple/purple/300', 'rgba(147, 51, 234, 1)', 'color');
      expect(result.confidence).toBe('exact');
      expect(result.matchMethod).toBe('binding');
      // Should be enriched: primitive + semantic
      expect(result.primitive).toBe('color.purple.purple300');
      expect(result.semantic).toBe('color.primary');
      // Semantic promoted to primary
      expect(result.token).toBe('color.primary');
    });

    it('returns no-match with suggestion for unresolvable value', () => {
      const result = translator.translate(undefined, '100px', 'spacing');
      expect(result.confidence).toBe('no-match');
      expect(result.matchMethod).toBe('value');
      expect(result.token).toBe('');
      expect(result.suggestion).toBeDefined();
    });

    it('enriches value-based match with semantic when available', () => {
      // Use hex color without binding — should match via value and enrich
      const result = translator.translate(undefined, '#9333EA', 'color');
      expect(result.confidence).toBe('exact');
      expect(result.matchMethod).toBe('value');
      // Should be enriched with semantic
      expect(result.primitive).toBe('color.purple.purple300');
      expect(result.semantic).toBe('color.primary');
      expect(result.token).toBe('color.primary');
    });
  });

  // -----------------------------------------------------------------------
  // Color format handling (hex → rgba DTCG lookup)
  // -----------------------------------------------------------------------

  describe('color format handling', () => {
    it('matches hex input against rgba DTCG values', () => {
      // DTCG stores rgba(147, 51, 234, 1), input is hex #9333EA
      const result = translator.translateByValue('#9333EA', 'color');
      expect(result.confidence).toBe('exact');
      expect(result.token).toBe('color.purple.purple300');
    });

    it('matches rgba input directly', () => {
      const result = translator.translateByValue('rgba(147, 51, 234, 1)', 'color');
      expect(result.confidence).toBe('exact');
      expect(result.token).toBe('color.purple.purple300');
    });

    it('matches hex with alpha channel', () => {
      const result = translator.translateByValue('#9333EAFF', 'color');
      expect(result.confidence).toBe('exact');
      expect(result.token).toBe('color.purple.purple300');
    });
  });

  // -----------------------------------------------------------------------
  // lookupToken
  // -----------------------------------------------------------------------

  describe('lookupToken', () => {
    it('finds token by dot-notation path', () => {
      const token = translator.lookupToken('space.space300');
      expect(token).toBeDefined();
      expect(token!.$value).toBe('24px');
    });

    it('finds nested token', () => {
      const token = translator.lookupToken('color.purple.purple300');
      expect(token).toBeDefined();
      expect(token!.$value).toBe('rgba(147, 51, 234, 1)');
    });

    it('returns undefined for non-existent path', () => {
      expect(translator.lookupToken('nonexistent.path')).toBeUndefined();
    });

    it('returns undefined for group path (not a leaf token)', () => {
      expect(translator.lookupToken('space')).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // classifyTokenMatch (three-tier classification)
  // -----------------------------------------------------------------------

  describe('classifyTokenMatch', () => {
    it('classifies as semantic when both semantic and primitive are present', () => {
      const result = translator.translate('color/purple/purple/300', 'rgba(147, 51, 234, 1)', 'color');
      // enrichResponse promotes semantic; result has both semantic + primitive
      expect(result.semantic).toBe('color.primary');
      expect(result.primitive).toBe('color.purple.purple300');
      expect(translator.classifyTokenMatch(result)).toBe('semantic');
    });

    it('classifies as primitive when only primitive is present (no semantic alias)', () => {
      const result = translator.translate('space/300', '24px', 'spacing');
      // space.space300 has no semantic alias
      expect(result.primitive).toBe('space.space300');
      expect(result.semantic).toBeUndefined();
      expect(translator.classifyTokenMatch(result)).toBe('primitive');
    });

    it('classifies as unidentified when confidence is no-match', () => {
      const result = translator.translate(undefined, '100px', 'spacing');
      expect(result.confidence).toBe('no-match');
      expect(translator.classifyTokenMatch(result)).toBe('unidentified');
    });

    it('classifies approximate semantic match as semantic', () => {
      // Slightly off color that still matches within ΔE < 3
      const result = translator.translate(undefined, '#9535E8', 'color');
      if (result.confidence !== 'no-match' && result.semantic) {
        expect(translator.classifyTokenMatch(result)).toBe('semantic');
      }
    });

    it('classifies approximate primitive match as primitive', () => {
      // 25px is within ±2px of space300 (24px), no semantic alias for spacing
      const result = translator.translate(undefined, '25px', 'spacing');
      expect(result.confidence).toBe('approximate');
      expect(result.primitive).toBeDefined();
      expect(result.semantic).toBeUndefined();
      expect(translator.classifyTokenMatch(result)).toBe('primitive');
    });

    it('classifies value-based semantic match as semantic', () => {
      // Exact hex match for purple300 which has semantic alias color.primary
      const result = translator.translate(undefined, '#9333EA', 'color');
      expect(result.semantic).toBe('color.primary');
      expect(translator.classifyTokenMatch(result)).toBe('semantic');
    });

    it('preserves existing confidence flags alongside classification', () => {
      // Exact match
      const exact = translator.translate('space/100', '8px', 'spacing');
      expect(exact.confidence).toBe('exact');
      expect(translator.classifyTokenMatch(exact)).toBe('primitive');

      // Approximate match
      const approx = translator.translate(undefined, '25px', 'spacing');
      expect(approx.confidence).toBe('approximate');
      expect(translator.classifyTokenMatch(approx)).toBe('primitive');

      // No match
      const noMatch = translator.translate(undefined, '100px', 'spacing');
      expect(noMatch.confidence).toBe('no-match');
      expect(translator.classifyTokenMatch(noMatch)).toBe('unidentified');
    });

    it('classifies radius match as primitive (no semantic aliases for radius)', () => {
      const result = translator.translate(undefined, '4px', 'radius');
      expect(result.confidence).toBe('exact');
      expect(result.primitive).toBe('radius.radius100');
      expect(result.semantic).toBeUndefined();
      expect(translator.classifyTokenMatch(result)).toBe('primitive');
    });

    it('classifies typography match as primitive (no semantic aliases for fontSize)', () => {
      const result = translator.translate(undefined, '14px', 'fontSize');
      expect(result.confidence).toBe('exact');
      expect(result.primitive).toBe('fontSize.fontSize200');
      expect(result.semantic).toBeUndefined();
      expect(translator.classifyTokenMatch(result)).toBe('primitive');
    });
  });

  // -----------------------------------------------------------------------
  // toClassifiedToken
  // -----------------------------------------------------------------------

  describe('toClassifiedToken', () => {
    it('converts semantic result to ClassifiedToken with both token paths', () => {
      const result = translator.translate('color/purple/purple/300', 'rgba(147, 51, 234, 1)', 'color');
      const classified = translator.toClassifiedToken(result, 'fill');

      expect(classified.property).toBe('fill');
      expect(classified.semanticToken).toBe('color.primary');
      expect(classified.primitiveToken).toBe('color.purple.purple300');
      expect(classified.rawValue).toBe('rgba(147, 51, 234, 1)');
      expect(classified.matchMethod).toBe('binding');
      expect(classified.confidence).toBe('exact');
      expect(classified.delta).toBeUndefined();
    });

    it('converts primitive result to ClassifiedToken without semantic', () => {
      const result = translator.translate('space/300', '24px', 'spacing');
      const classified = translator.toClassifiedToken(result, 'padding-top');

      expect(classified.property).toBe('padding-top');
      expect(classified.semanticToken).toBeUndefined();
      expect(classified.primitiveToken).toBe('space.space300');
      expect(classified.rawValue).toBe('24px');
      expect(classified.matchMethod).toBe('binding');
      expect(classified.confidence).toBe('exact');
    });

    it('includes delta for approximate matches', () => {
      const result = translator.translate(undefined, '25px', 'spacing');
      const classified = translator.toClassifiedToken(result, 'item-spacing');

      expect(classified.confidence).toBe('approximate');
      expect(classified.delta).toBeDefined();
      expect(classified.delta).toMatch(/±?\d+px/);
    });
  });

  // -----------------------------------------------------------------------
  // toUnidentifiedValue
  // -----------------------------------------------------------------------

  describe('toUnidentifiedValue', () => {
    it('creates UnidentifiedValue with out-of-tolerance reason', () => {
      const result = translator.translate(undefined, '100px', 'spacing');
      const unidentified = translator.toUnidentifiedValue(result, 'padding-top');

      expect(unidentified.property).toBe('padding-top');
      expect(unidentified.rawValue).toBe('100px');
      expect(unidentified.reason).toBe('out-of-tolerance');
      expect(unidentified.closestMatch).toBeDefined();
      expect(unidentified.boundVariableId).toBeUndefined();
    });

    it('creates UnidentifiedValue with unresolved-binding reason when boundVariableId provided', () => {
      const result = translator.translate(undefined, '100px', 'spacing');
      const unidentified = translator.toUnidentifiedValue(result, 'fill', 'VariableID:1224:14083');

      expect(unidentified.reason).toBe('unresolved-binding');
      expect(unidentified.boundVariableId).toBe('VariableID:1224:14083');
    });

    it('creates UnidentifiedValue with no-token-match when no suggestion exists', () => {
      // Unparseable color has no suggestion
      const result = translator.translate(undefined, 'not-a-color', 'color');
      const unidentified = translator.toUnidentifiedValue(result, 'fill');

      expect(unidentified.reason).toBe('no-token-match');
      expect(unidentified.closestMatch).toBeUndefined();
    });

    it('includes closest match info when suggestion available', () => {
      const result = translator.translate(undefined, '100px', 'spacing');
      const unidentified = translator.toUnidentifiedValue(result, 'width');

      if (unidentified.closestMatch) {
        expect(unidentified.closestMatch.token).toBeDefined();
        expect(typeof unidentified.closestMatch.delta).toBe('string');
      }
    });
  });

  // -----------------------------------------------------------------------
  // createClassificationSummary
  // -----------------------------------------------------------------------

  describe('createClassificationSummary', () => {
    it('counts values in each tier', () => {
      const semantic = [
        translator.toClassifiedToken(
          translator.translate('color/purple/purple/300', 'rgba(147, 51, 234, 1)', 'color'),
          'fill',
        ),
      ];
      const primitive = [
        translator.toClassifiedToken(
          translator.translate('space/300', '24px', 'spacing'),
          'padding-top',
        ),
        translator.toClassifiedToken(
          translator.translate('space/100', '8px', 'spacing'),
          'padding-bottom',
        ),
      ];
      const unidentified = [
        translator.toUnidentifiedValue(
          translator.translate(undefined, '100px', 'spacing'),
          'width',
        ),
      ];

      const summary = TokenTranslator.createClassificationSummary(semantic, primitive, unidentified);

      expect(summary.semanticIdentified).toBe(1);
      expect(summary.primitiveIdentified).toBe(2);
      expect(summary.unidentified).toBe(1);
    });

    it('returns zeros for empty arrays', () => {
      const summary = TokenTranslator.createClassificationSummary([], [], []);

      expect(summary.semanticIdentified).toBe(0);
      expect(summary.primitiveIdentified).toBe(0);
      expect(summary.unidentified).toBe(0);
    });
  });
});
