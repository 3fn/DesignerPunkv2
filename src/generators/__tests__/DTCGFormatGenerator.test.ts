/**
 * Unit Tests for DTCGFormatGenerator (Task 5.1)
 *
 * Validates core generation logic:
 * - DTCG schema structure compliance
 * - Token type mapping (Rosetta → DTCG)
 * - Alias preservation in semantic tokens
 * - Extension inclusion for tokens with metadata
 * - Shadow color-opacity merge correctness
 * - Composite token structure (shadow, typography, transition)
 * - Token count validation
 *
 * Note: Configuration options are tested in DTCGConfigOptions.test.ts
 *       Error handling is tested in DTCGErrorHandling.test.ts
 *
 * @requirements All requirements (validation)
 */

import { DTCGFormatGenerator } from '../DTCGFormatGenerator';
import type { DTCGTokenFile, DTCGToken, DTCGGroup } from '../types/DTCGTypes';

// Generate output once for read-only tests (performance optimization)
let defaultOutput: DTCGTokenFile;

beforeAll(() => {
  const generator = new DTCGFormatGenerator();
  defaultOutput = generator.generate();
});

// ---------------------------------------------------------------------------
// 1. DTCG Schema Validation (Requirements 1.1–1.5)
// ---------------------------------------------------------------------------
describe('DTCG schema structure', () => {
  it('should include $schema property referencing DTCG format URL', () => {
    expect(defaultOutput.$schema).toBe('https://tr.designtokens.org/format/');
  });

  it('should produce valid JSON (parseable by standard JSON parsers)', () => {
    const json = JSON.stringify(defaultOutput);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it('should include root-level $extensions.designerpunk metadata', () => {
    expect(defaultOutput.$extensions).toBeDefined();
    expect(defaultOutput.$extensions?.designerpunk).toBeDefined();
    expect(defaultOutput.$extensions?.designerpunk?.version).toBe('1.0.0');
    expect(defaultOutput.$extensions?.designerpunk?.generatedAt).toBeDefined();
    expect(defaultOutput.$extensions?.designerpunk?.rosettaVersion).toBeDefined();
  });

  it('should contain all expected top-level token groups', () => {
    const expectedGroups = [
      'space', 'color', 'fontSize', 'fontWeight', 'fontFamily',
      'lineHeight', 'letterSpacing', 'radius', 'borderWidth',
      'tapArea', 'density', 'breakpoint', 'opacity', 'duration',
      'easing', 'scale', 'blend',
      'semanticColor', 'semanticSpace', 'semanticBorderWidth',
      'semanticRadius', 'semanticOpacity', 'semanticBlend',
      'gridSpacing', 'icon', 'accessibility', 'progressColor',
      'zIndex', 'elevation',
      'shadow', 'glow', 'typography', 'motion',
    ];
    for (const group of expectedGroups) {
      expect(defaultOutput[group]).toBeDefined();
    }
  });

  it('should have tokens with $value and $type properties', () => {
    const spaceGroup = defaultOutput.space as DTCGGroup;
    const tokenKeys = Object.keys(spaceGroup).filter(k => !k.startsWith('$'));
    expect(tokenKeys.length).toBeGreaterThan(0);

    const firstToken = spaceGroup[tokenKeys[0]] as DTCGToken;
    expect(firstToken.$value).toBeDefined();
    expect(firstToken.$type).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// 2. Token Type Mapping (Requirements 2.1–2.3)
// ---------------------------------------------------------------------------
describe('token type mapping', () => {
  it('should map spacing tokens to DTCG dimension type', () => {
    const group = defaultOutput.space as DTCGGroup;
    expect(group.$type).toBe('dimension');
    const firstKey = Object.keys(group).find(k => !k.startsWith('$'))!;
    const token = group[firstKey] as DTCGToken;
    expect(token.$type).toBe('dimension');
    expect(String(token.$value)).toMatch(/^\d+px$/);
  });

  it('should map color tokens to DTCG color type', () => {
    const group = defaultOutput.color as DTCGGroup;
    expect(group.$type).toBe('color');
  });

  it('should map fontWeight tokens to DTCG fontWeight type', () => {
    const group = defaultOutput.fontWeight as DTCGGroup;
    expect(group.$type).toBe('fontWeight');
  });

  it('should map fontFamily tokens to DTCG fontFamily type (array value)', () => {
    const group = defaultOutput.fontFamily as DTCGGroup;
    expect(group.$type).toBe('fontFamily');
    const firstKey = Object.keys(group).find(k => !k.startsWith('$'))!;
    const token = group[firstKey] as DTCGToken;
    expect(Array.isArray(token.$value)).toBe(true);
  });

  it('should map lineHeight tokens to DTCG number type', () => {
    const group = defaultOutput.lineHeight as DTCGGroup;
    expect(group.$type).toBe('number');
  });

  it('should map duration tokens to DTCG duration type', () => {
    const group = defaultOutput.duration as DTCGGroup;
    expect(group.$type).toBe('duration');
    const firstKey = Object.keys(group).find(k => !k.startsWith('$'))!;
    const token = group[firstKey] as DTCGToken;
    expect(String(token.$value)).toMatch(/^\d+ms$/);
  });

  it('should map easing tokens to DTCG cubicBezier type (4-element array)', () => {
    const group = defaultOutput.easing as DTCGGroup;
    expect(group.$type).toBe('cubicBezier');
    const firstKey = Object.keys(group).find(k => !k.startsWith('$'))!;
    const token = group[firstKey] as DTCGToken;
    expect(Array.isArray(token.$value)).toBe(true);
    expect((token.$value as number[]).length).toBe(4);
  });

  it('should map opacity tokens to DTCG number type', () => {
    const group = defaultOutput.opacity as DTCGGroup;
    expect(group.$type).toBe('number');
  });

  it('should map shadow tokens to DTCG shadow type', () => {
    const group = defaultOutput.shadow as DTCGGroup;
    expect(group.$type).toBe('shadow');
  });

  it('should map typography tokens to DTCG typography type', () => {
    const group = defaultOutput.typography as DTCGGroup;
    expect(group.$type).toBe('typography');
  });

  it('should map motion tokens to DTCG transition type', () => {
    const group = defaultOutput.motion as DTCGGroup;
    expect(group.$type).toBe('transition');
  });
});

// ---------------------------------------------------------------------------
// 3. Alias Preservation (Requirements 3.1–3.2)
// ---------------------------------------------------------------------------
describe('alias preservation', () => {
  it('should use {token.path} alias syntax in semantic color tokens', () => {
    const semanticColors = defaultOutput.semanticColor as DTCGGroup;
    const tokenKeys = Object.keys(semanticColors).filter(k => !k.startsWith('$'));
    expect(tokenKeys.length).toBeGreaterThan(0);

    let foundAlias = false;
    for (const key of tokenKeys) {
      const token = semanticColors[key] as DTCGToken;
      if (typeof token.$value === 'string' && token.$value.match(/^\{color\..+\}$/)) {
        foundAlias = true;
        break;
      }
    }
    expect(foundAlias).toBe(true);
  });

  it('should use {token.path} alias syntax in semantic spacing tokens', () => {
    const semanticSpace = defaultOutput.semanticSpace as DTCGGroup;
    let foundAlias = false;

    for (const [groupKey, groupValue] of Object.entries(semanticSpace)) {
      if (groupKey.startsWith('$')) continue;
      const subGroup = groupValue as DTCGGroup;
      for (const [key, value] of Object.entries(subGroup)) {
        if (key.startsWith('$')) continue;
        const token = value as DTCGToken;
        if (typeof token.$value === 'string' && token.$value.match(/^\{space\..+\}$/)) {
          foundAlias = true;
          break;
        }
      }
      if (foundAlias) break;
    }
    expect(foundAlias).toBe(true);
  });

  it('should use alias syntax in typography composite properties', () => {
    const typography = defaultOutput.typography as DTCGGroup;
    const firstKey = Object.keys(typography).find(k => !k.startsWith('$'))!;
    const token = typography[firstKey] as DTCGToken;
    const val = token.$value as Record<string, unknown>;

    expect(typeof val.fontFamily).toBe('string');
    expect(String(val.fontFamily)).toMatch(/^\{fontFamily\..+\}$/);
    expect(String(val.fontSize)).toMatch(/^\{fontSize\..+\}$/);
    expect(String(val.fontWeight)).toMatch(/^\{fontWeight\..+\}$/);
  });

  it('should use alias syntax in motion composite properties', () => {
    const motion = defaultOutput.motion as DTCGGroup;
    const firstKey = Object.keys(motion).find(k => !k.startsWith('$'))!;
    const token = motion[firstKey] as DTCGToken;
    const val = token.$value as Record<string, unknown>;

    expect(String(val.duration)).toMatch(/^\{duration\..+\}$/);
    expect(String(val.timingFunction)).toMatch(/^\{easing\..+\}$/);
  });
});

// ---------------------------------------------------------------------------
// 4. Extension Inclusion (Requirements 4.1–4.8)
// ---------------------------------------------------------------------------
describe('extension inclusion', () => {
  it('should include formula in primitive token extensions', () => {
    const spaceGroup = defaultOutput.space as DTCGGroup;
    const tokenKeys = Object.keys(spaceGroup).filter(k => !k.startsWith('$'));
    const token = spaceGroup[tokenKeys[0]] as DTCGToken;

    expect(token.$extensions?.designerpunk?.formula).toBeDefined();
    expect(typeof token.$extensions?.designerpunk?.formula).toBe('string');
  });

  it('should include family in primitive token extensions', () => {
    const spaceGroup = defaultOutput.space as DTCGGroup;
    const tokenKeys = Object.keys(spaceGroup).filter(k => !k.startsWith('$'));
    const token = spaceGroup[tokenKeys[0]] as DTCGToken;

    expect(token.$extensions?.designerpunk?.family).toBe('spacing');
  });

  it('should include baseValue in primitive token extensions when applicable', () => {
    const spaceGroup = defaultOutput.space as DTCGGroup;
    const tokenKeys = Object.keys(spaceGroup).filter(k => !k.startsWith('$'));
    const token = spaceGroup[tokenKeys[0]] as DTCGToken;

    expect(token.$extensions?.designerpunk?.baseValue).toBeDefined();
    expect(typeof token.$extensions?.designerpunk?.baseValue).toBe('number');
  });

  it('should include glowType extension on glow tokens', () => {
    const glowGroup = defaultOutput.glow as DTCGGroup;
    const blurGroup = glowGroup.blur as DTCGGroup;
    const firstKey = Object.keys(blurGroup).find(k => !k.startsWith('$'))!;
    const token = blurGroup[firstKey] as DTCGToken;

    expect(token.$extensions?.designerpunk?.glowType).toBe('emission');
  });

  it('should include status: "partial" on glow tokens', () => {
    const glowGroup = defaultOutput.glow as DTCGGroup;
    const blurGroup = glowGroup.blur as DTCGGroup;
    const firstKey = Object.keys(blurGroup).find(k => !k.startsWith('$'))!;
    const token = blurGroup[firstKey] as DTCGToken;

    expect(token.$extensions?.designerpunk?.status).toBe('partial');
  });

  it('should include platform extensions on z-index tokens', () => {
    const zIndexGroup = defaultOutput.zIndex as DTCGGroup;
    const firstKey = Object.keys(zIndexGroup).find(k => !k.startsWith('$'))!;
    const token = zIndexGroup[firstKey] as DTCGToken;

    expect(token.$extensions?.designerpunk?.platforms).toBeDefined();
    expect(token.$extensions?.designerpunk?.platforms?.web?.supported).toBe(true);
    expect(token.$extensions?.designerpunk?.platforms?.android?.supported).toBe(false);
  });

  it('should include platform extensions on elevation tokens', () => {
    const elevationGroup = defaultOutput.elevation as DTCGGroup;
    const firstKey = Object.keys(elevationGroup).find(k => !k.startsWith('$'))!;
    const token = elevationGroup[firstKey] as DTCGToken;

    expect(token.$extensions?.designerpunk?.platforms?.android?.supported).toBe(true);
    expect(token.$extensions?.designerpunk?.platforms?.android?.elevation).toBeDefined();
  });

  it('should include primitiveRefs in semantic token extensions', () => {
    const semanticSpace = defaultOutput.semanticSpace as DTCGGroup;
    const firstGroupKey = Object.keys(semanticSpace).find(k => !k.startsWith('$'))!;
    const subGroup = semanticSpace[firstGroupKey] as DTCGGroup;
    const firstKey = Object.keys(subGroup).find(k => !k.startsWith('$'))!;
    const token = subGroup[firstKey] as DTCGToken;

    expect(token.$extensions?.designerpunk?.primitiveRefs).toBeDefined();
  });
});


// ---------------------------------------------------------------------------
// 5. Shadow Color-Opacity Merge (Requirements 5.1–5.2)
// ---------------------------------------------------------------------------
describe('shadow color-opacity merge', () => {
  let generator: DTCGFormatGenerator;

  beforeEach(() => {
    generator = new DTCGFormatGenerator();
  });

  it('should replace alpha channel with shadow opacity (not multiply)', () => {
    const result = generator.mergeShadowColor('rgba(0, 0, 0, 1)', 0.3);
    expect(result).toBe('rgba(0, 0, 0, 0.3)');
  });

  it('should override embedded color alpha with shadow opacity', () => {
    // Color has alpha 0.5, but shadow opacity 0.3 should override (not multiply)
    const result = generator.mergeShadowColor('rgba(0, 0, 0, 0.5)', 0.3);
    expect(result).toBe('rgba(0, 0, 0, 0.3)');
  });

  it('should handle rgb format (no alpha) by adding shadow opacity', () => {
    const result = generator.mergeShadowColor('rgb(255, 128, 0)', 0.7);
    expect(result).toBe('rgba(255, 128, 0, 0.7)');
  });

  it('should preserve RGB channels while replacing alpha', () => {
    const result = generator.mergeShadowColor('rgba(100, 200, 50, 0.9)', 0.15);
    expect(result).toBe('rgba(100, 200, 50, 0.15)');
  });

  it('should produce shadow tokens with merged color in generated output', () => {
    const shadowGroup = defaultOutput.shadow as DTCGGroup;
    const tokenKeys = Object.keys(shadowGroup).filter(k => !k.startsWith('$'));
    expect(tokenKeys.length).toBeGreaterThan(0);

    const firstToken = shadowGroup[tokenKeys[0]] as DTCGToken;
    const val = firstToken.$value as Record<string, string>;
    // Shadow color should be rgba with the shadow's opacity as alpha
    expect(val.color).toMatch(/^rgba\(\d+, \d+, \d+, [\d.]+\)$/);
  });
});

// ---------------------------------------------------------------------------
// 6. Composite Token Structure (Requirements 5.3, 6.1–6.5)
// ---------------------------------------------------------------------------
describe('composite token structure', () => {
  it('shadow tokens should have offsetX, offsetY, blur, spread, color', () => {
    const shadowGroup = defaultOutput.shadow as DTCGGroup;
    const tokenKeys = Object.keys(shadowGroup).filter(k => !k.startsWith('$'));

    for (const key of tokenKeys) {
      const token = shadowGroup[key] as DTCGToken;
      const val = token.$value as Record<string, unknown>;
      expect(val).toHaveProperty('offsetX');
      expect(val).toHaveProperty('offsetY');
      expect(val).toHaveProperty('blur');
      expect(val).toHaveProperty('spread');
      expect(val).toHaveProperty('color');
      // spread should be '0px' per Requirement 5.4
      expect(val.spread).toBe('0px');
    }
  });

  it('typography tokens should have fontFamily, fontSize, fontWeight, lineHeight, letterSpacing', () => {
    const typographyGroup = defaultOutput.typography as DTCGGroup;
    const tokenKeys = Object.keys(typographyGroup).filter(k => !k.startsWith('$'));

    for (const key of tokenKeys) {
      const token = typographyGroup[key] as DTCGToken;
      const val = token.$value as Record<string, unknown>;
      expect(val).toHaveProperty('fontFamily');
      expect(val).toHaveProperty('fontSize');
      expect(val).toHaveProperty('fontWeight');
      expect(val).toHaveProperty('lineHeight');
      expect(val).toHaveProperty('letterSpacing');
    }
  });

  it('motion tokens should have duration, timingFunction, delay', () => {
    const motionGroup = defaultOutput.motion as DTCGGroup;
    const tokenKeys = Object.keys(motionGroup).filter(k => !k.startsWith('$'));

    for (const key of tokenKeys) {
      const token = motionGroup[key] as DTCGToken;
      const val = token.$value as Record<string, unknown>;
      expect(val).toHaveProperty('duration');
      expect(val).toHaveProperty('timingFunction');
      expect(val).toHaveProperty('delay');
      // delay should default to '0ms' per Requirement 6.3
      expect(val.delay).toBe('0ms');
    }
  });

  it('shadow dimension values should end with px', () => {
    const shadowGroup = defaultOutput.shadow as DTCGGroup;
    const firstKey = Object.keys(shadowGroup).find(k => !k.startsWith('$'))!;
    const token = shadowGroup[firstKey] as DTCGToken;
    const val = token.$value as Record<string, string>;

    expect(val.offsetX).toMatch(/^-?\d+px$/);
    expect(val.offsetY).toMatch(/^-?\d+px$/);
    expect(val.blur).toMatch(/^-?\d+px$/);
  });
});

// ---------------------------------------------------------------------------
// 7. Token Count Validation (Requirements 10.1–10.5)
// ---------------------------------------------------------------------------
describe('token count validation', () => {
  it('should generate without throwing (counts meet minimums)', () => {
    const generator = new DTCGFormatGenerator();
    expect(() => generator.generate()).not.toThrow();
  });

  it('should produce a substantial number of primitive tokens in output', () => {
    const primitiveGroups = [
      'space', 'color', 'fontSize', 'fontWeight', 'fontFamily',
      'lineHeight', 'letterSpacing', 'radius', 'borderWidth',
      'tapArea', 'density', 'breakpoint', 'opacity', 'duration',
      'easing', 'scale', 'blend',
    ];

    let count = 0;
    for (const groupName of primitiveGroups) {
      const group = defaultOutput[groupName] as DTCGGroup;
      count += countTokensInGroup(group);
    }
    // Primitive groups in DTCG output (excludes shadow/glow primitives which are
    // counted separately). The source has 240+ primitives total including shadow/glow.
    expect(count).toBeGreaterThanOrEqual(150);
  });

  it('should produce at least 180 semantic tokens in output', () => {
    const semanticGroups = [
      'semanticColor', 'semanticSpace', 'semanticBorderWidth',
      'semanticRadius', 'semanticOpacity', 'semanticBlend',
      'gridSpacing', 'icon', 'accessibility', 'progressColor',
      'zIndex', 'elevation', 'shadow', 'glow', 'typography', 'motion',
    ];

    let count = 0;
    for (const groupName of semanticGroups) {
      const group = defaultOutput[groupName] as DTCGGroup;
      count += countTokensInGroup(group);
    }
    expect(count).toBeGreaterThanOrEqual(180);
  });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Count tokens (objects with $value) recursively in a DTCG group */
function countTokensInGroup(group: DTCGGroup): number {
  let count = 0;
  for (const [key, value] of Object.entries(group)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      if ('$value' in obj) {
        count++;
      }
      count += countTokensInGroup(obj as DTCGGroup);
    }
  }
  return count;
}
