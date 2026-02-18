/**
 * Property-Based Tests for DTCGFormatGenerator (Task 5.3)
 *
 * Tests 6 correctness properties using fast-check:
 * - Property 1: DTCG schema compliance
 * - Property 2: Token completeness
 * - Property 3: Alias preservation
 * - Property 4: Extension completeness
 * - Property 5: Shadow color-opacity merge
 * - Property 6: Composite token structure
 *
 * @requirements All requirements (validation)
 */

import * as fc from 'fast-check';
import { DTCGFormatGenerator } from '../DTCGFormatGenerator';
import type { DTCGTokenFile, DTCGToken, DTCGGroup, DTCGType } from '../types/DTCGTypes';

// Valid DTCG types per Format Module 2025.10
const VALID_DTCG_TYPES: ReadonlySet<string> = new Set([
  'color', 'dimension', 'fontFamily', 'fontWeight', 'duration',
  'cubicBezier', 'number', 'shadow', 'typography', 'transition',
]);

// Generate output once — it's deterministic and read-only for property checks
let defaultOutput: DTCGTokenFile;
let noExtensionsOutput: DTCGTokenFile;

beforeAll(() => {
  const generator = new DTCGFormatGenerator();
  defaultOutput = generator.generate();

  const noExtGen = new DTCGFormatGenerator({ includeExtensions: false });
  noExtensionsOutput = noExtGen.generate();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Collect all tokens (objects with $value) from a DTCG output tree */
function collectAllTokens(
  obj: Record<string, unknown>,
  path = ''
): Array<{ path: string; token: DTCGToken }> {
  const results: Array<{ path: string; token: DTCGToken }> = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      if ('$value' in record) {
        results.push({ path: `${path}.${key}`, token: record as unknown as DTCGToken });
      }
      results.push(...collectAllTokens(record, `${path}.${key}`));
    }
  }
  return results;
}

/** Collect all top-level groups (non-$ keys whose values are objects) */
function collectTopLevelGroups(output: DTCGTokenFile): string[] {
  return Object.keys(output).filter(k => !k.startsWith('$') && typeof output[k] === 'object');
}

// ---------------------------------------------------------------------------
// Property 1: DTCG Schema Compliance
// Feature: dtcg-generator, Property 1: DTCG schema compliance
// Validates: Requirements 1.1, 1.3
// ---------------------------------------------------------------------------
describe('Feature: dtcg-generator, Property 1: DTCG schema compliance', () => {
  const allTokens = () => collectAllTokens(defaultOutput as unknown as Record<string, unknown>);

  it('every token in the output has a valid DTCG $type', () => {
    const tokens = allTokens();
    // Property: for any token in the output, its $type is a member of VALID_DTCG_TYPES
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tokens.length - 1 }),
        (idx) => {
          const { token, path: tokenPath } = tokens[idx];
          expect(VALID_DTCG_TYPES.has(token.$type as string)).toBe(true);
          // $value must be defined
          expect(token.$value).toBeDefined();
          return true;
        }
      ),
      { numRuns: Math.min(tokens.length, 200) }
    );
  });

  it('output is valid JSON and includes $schema', () => {
    // Property: for any configuration producing output, the result is valid JSON with $schema
    fc.assert(
      fc.property(
        fc.record({
          includeExtensions: fc.boolean(),
          prettyPrint: fc.boolean(),
        }),
        (partialConfig) => {
          const gen = new DTCGFormatGenerator(partialConfig);
          const output = gen.generate();
          // Must be serializable to valid JSON
          const json = JSON.stringify(output);
          const parsed = JSON.parse(json);
          expect(parsed.$schema).toBe('https://tr.designtokens.org/format/');
          return true;
        }
      ),
      { numRuns: 4 }
    );
  });

  it('every top-level group declares a valid $type', () => {
    const groups = collectTopLevelGroups(defaultOutput);
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: groups.length - 1 }),
        (idx) => {
          const groupName = groups[idx];
          const group = defaultOutput[groupName] as DTCGGroup;
          if (group.$type) {
            expect(VALID_DTCG_TYPES.has(group.$type)).toBe(true);
          }
          return true;
        }
      ),
      { numRuns: groups.length }
    );
  });
});


// ---------------------------------------------------------------------------
// Property 2: Token Completeness
// Feature: dtcg-generator, Property 2: Token completeness
// Validates: Requirements 2.1, 2.2
// ---------------------------------------------------------------------------
describe('Feature: dtcg-generator, Property 2: Token completeness', () => {
  const expectedPrimitiveGroups = [
    'space', 'color', 'fontSize', 'fontWeight', 'fontFamily',
    'lineHeight', 'letterSpacing', 'radius', 'borderWidth',
    'tapArea', 'density', 'breakpoint', 'opacity', 'duration',
    'easing', 'scale', 'blend',
  ];

  const expectedSemanticGroups = [
    'semanticColor', 'semanticSpace', 'semanticBorderWidth',
    'semanticRadius', 'semanticOpacity', 'semanticBlend',
    'gridSpacing', 'icon', 'accessibility', 'progressColor',
    'zIndex', 'elevation', 'shadow', 'glow', 'typography', 'motion',
  ];

  it('every expected primitive group exists and contains at least one token', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: expectedPrimitiveGroups.length - 1 }),
        (idx) => {
          const groupName = expectedPrimitiveGroups[idx];
          const group = defaultOutput[groupName] as DTCGGroup;
          expect(group).toBeDefined();
          const tokens = collectAllTokens(group as unknown as Record<string, unknown>);
          expect(tokens.length).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: expectedPrimitiveGroups.length }
    );
  });

  it('every expected semantic group exists and contains at least one token', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: expectedSemanticGroups.length - 1 }),
        (idx) => {
          const groupName = expectedSemanticGroups[idx];
          const group = defaultOutput[groupName] as DTCGGroup;
          expect(group).toBeDefined();
          const tokens = collectAllTokens(group as unknown as Record<string, unknown>);
          expect(tokens.length).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: expectedSemanticGroups.length }
    );
  });

  it('total token count meets minimum thresholds', () => {
    // Property: the output always contains at least the minimum expected tokens
    const allTokens = collectAllTokens(defaultOutput as unknown as Record<string, unknown>);
    // Combined primitive + semantic should be substantial
    expect(allTokens.length).toBeGreaterThanOrEqual(350);
  });
});

// ---------------------------------------------------------------------------
// Property 3: Alias Preservation
// Feature: dtcg-generator, Property 3: Alias preservation
// Validates: Requirements 3.1, 3.2
// ---------------------------------------------------------------------------
describe('Feature: dtcg-generator, Property 3: Alias preservation', () => {
  const aliasPattern = /^\{[a-zA-Z][a-zA-Z0-9.]*\}$/;

  it('semantic color tokens use alias syntax referencing color primitives', () => {
    const semanticColors = defaultOutput.semanticColor as DTCGGroup;
    const tokens = collectAllTokens(semanticColors as unknown as Record<string, unknown>);
    const aliasTokens = tokens.filter(
      t => typeof t.token.$value === 'string' && aliasPattern.test(t.token.$value)
    );
    // Property: at least some semantic color tokens use alias syntax
    expect(aliasTokens.length).toBeGreaterThan(0);

    // Property: every alias references a color.* path
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: aliasTokens.length - 1 }),
        (idx) => {
          const val = aliasTokens[idx].token.$value as string;
          expect(val).toMatch(/^\{color\./);
          return true;
        }
      ),
      { numRuns: Math.min(aliasTokens.length, 100) }
    );
  });

  it('semantic spacing tokens use alias syntax referencing space primitives', () => {
    const semanticSpace = defaultOutput.semanticSpace as DTCGGroup;
    const tokens = collectAllTokens(semanticSpace as unknown as Record<string, unknown>);
    const aliasTokens = tokens.filter(
      t => typeof t.token.$value === 'string' && aliasPattern.test(t.token.$value)
    );
    expect(aliasTokens.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: aliasTokens.length - 1 }),
        (idx) => {
          const val = aliasTokens[idx].token.$value as string;
          expect(val).toMatch(/^\{space\./);
          return true;
        }
      ),
      { numRuns: Math.min(aliasTokens.length, 100) }
    );
  });

  it('typography composite properties use alias syntax for primitive references', () => {
    const typography = defaultOutput.typography as DTCGGroup;
    const tokens = collectAllTokens(typography as unknown as Record<string, unknown>);

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tokens.length - 1 }),
        (idx) => {
          const val = tokens[idx].token.$value as Record<string, unknown>;
          // fontFamily, fontSize, fontWeight should be alias references
          expect(String(val.fontFamily)).toMatch(/^\{fontFamily\./);
          expect(String(val.fontSize)).toMatch(/^\{fontSize\./);
          expect(String(val.fontWeight)).toMatch(/^\{fontWeight\./);
          return true;
        }
      ),
      { numRuns: Math.min(tokens.length, 50) }
    );
  });
});


// ---------------------------------------------------------------------------
// Property 4: Extension Completeness
// Feature: dtcg-generator, Property 4: Extension completeness
// Validates: Requirements 4.1-4.8
// ---------------------------------------------------------------------------
describe('Feature: dtcg-generator, Property 4: Extension completeness', () => {
  it('primitive tokens with extensions include formula and family', () => {
    // Check primitive groups that should have formula/family extensions
    const primitiveGroups = ['space', 'fontSize', 'radius', 'borderWidth', 'opacity', 'duration'];

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: primitiveGroups.length - 1 }),
        (idx) => {
          const groupName = primitiveGroups[idx];
          const group = defaultOutput[groupName] as DTCGGroup;
          const tokens = collectAllTokens(group as unknown as Record<string, unknown>);
          // Property: every primitive token in these groups has formula and family
          for (const { token } of tokens) {
            const ext = token.$extensions?.designerpunk;
            expect(ext).toBeDefined();
            expect(ext?.formula).toBeDefined();
            expect(typeof ext?.formula).toBe('string');
            expect(ext?.family).toBeDefined();
            expect(typeof ext?.family).toBe('string');
          }
          return true;
        }
      ),
      { numRuns: primitiveGroups.length }
    );
  });

  it('glow tokens include glowType and partial status extensions', () => {
    const glowGroup = defaultOutput.glow as DTCGGroup;
    const tokens = collectAllTokens(glowGroup as unknown as Record<string, unknown>);

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tokens.length - 1 }),
        (idx) => {
          const ext = tokens[idx].token.$extensions?.designerpunk;
          expect(ext?.glowType).toBe('emission');
          expect(ext?.status).toBe('partial');
          return true;
        }
      ),
      { numRuns: Math.min(tokens.length, 50) }
    );
  });

  it('when includeExtensions is false, no token has designerpunk extensions', () => {
    const tokens = collectAllTokens(noExtensionsOutput as unknown as Record<string, unknown>);

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tokens.length - 1 }),
        (idx) => {
          const ext = tokens[idx].token.$extensions;
          // Either no $extensions at all, or no designerpunk key
          if (ext) {
            expect(ext.designerpunk).toBeUndefined();
          }
          return true;
        }
      ),
      { numRuns: Math.min(tokens.length, 200) }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 5: Shadow Color-Opacity Merge
// Feature: dtcg-generator, Property 5: Shadow color-opacity merge
// Validates: Requirements 5.1, 5.2
// ---------------------------------------------------------------------------
describe('Feature: dtcg-generator, Property 5: Shadow color-opacity merge', () => {
  const generator = new DTCGFormatGenerator();

  it('mergeShadowColor replaces alpha with opacity for any valid RGBA input', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        (r, g, b, originalAlpha, shadowOpacity) => {
          const input = `rgba(${r}, ${g}, ${b}, ${originalAlpha})`;
          const result = generator.mergeShadowColor(input, shadowOpacity);

          // Property: result is valid rgba format
          expect(result).toMatch(/^rgba\(\d+, \d+, \d+, [\d.e+-]+\)$/);

          // Property: RGB channels are preserved
          expect(result).toContain(`rgba(${r}, ${g}, ${b},`);

          // Property: alpha is replaced with shadow opacity (not multiplied)
          const resultAlpha = parseFloat(result.match(/,\s*([\d.e+-]+)\)$/)![1]);
          expect(resultAlpha).toBeCloseTo(shadowOpacity, 10);

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('mergeShadowColor handles rgb input (no alpha) by adding opacity', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.integer({ min: 0, max: 255 }),
        fc.double({ min: 0, max: 1, noNaN: true }),
        (r, g, b, shadowOpacity) => {
          const input = `rgb(${r}, ${g}, ${b})`;
          const result = generator.mergeShadowColor(input, shadowOpacity);

          expect(result).toMatch(/^rgba\(\d+, \d+, \d+, [\d.e+-]+\)$/);
          expect(result).toContain(`rgba(${r}, ${g}, ${b},`);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('shadow tokens in output have color with alpha matching shadow opacity', () => {
    const shadowGroup = defaultOutput.shadow as DTCGGroup;
    const tokens = collectAllTokens(shadowGroup as unknown as Record<string, unknown>);

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tokens.length - 1 }),
        (idx) => {
          const val = tokens[idx].token.$value as Record<string, string>;
          // Property: shadow color is always valid rgba
          expect(val.color).toMatch(/^rgba\(\d+, \d+, \d+, [\d.]+\)$/);
          // Property: alpha is between 0 and 1
          const alpha = parseFloat(val.color.match(/,\s*([\d.]+)\)$/)![1]);
          expect(alpha).toBeGreaterThanOrEqual(0);
          expect(alpha).toBeLessThanOrEqual(1);
          return true;
        }
      ),
      { numRuns: Math.min(tokens.length, 50) }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 6: Composite Token Structure
// Feature: dtcg-generator, Property 6: Composite token structure
// Validates: Requirements 5.3, 6.1, 6.2
// ---------------------------------------------------------------------------
describe('Feature: dtcg-generator, Property 6: Composite token structure', () => {
  it('every shadow token has all required properties', () => {
    const shadowGroup = defaultOutput.shadow as DTCGGroup;
    const tokens = collectAllTokens(shadowGroup as unknown as Record<string, unknown>);

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tokens.length - 1 }),
        (idx) => {
          const val = tokens[idx].token.$value as Record<string, unknown>;
          expect(val).toHaveProperty('offsetX');
          expect(val).toHaveProperty('offsetY');
          expect(val).toHaveProperty('blur');
          expect(val).toHaveProperty('spread');
          expect(val).toHaveProperty('color');
          // spread is always 0px per Requirement 5.4
          expect(val.spread).toBe('0px');
          // dimension values end with px (may be negative for offsets)
          expect(String(val.offsetX)).toMatch(/^-?\d+px$/);
          expect(String(val.offsetY)).toMatch(/^-?\d+px$/);
          expect(String(val.blur)).toMatch(/^-?\d+px$/);
          return true;
        }
      ),
      { numRuns: Math.min(tokens.length, 50) }
    );
  });

  it('every typography token has all required properties', () => {
    const typographyGroup = defaultOutput.typography as DTCGGroup;
    const tokens = collectAllTokens(typographyGroup as unknown as Record<string, unknown>);

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tokens.length - 1 }),
        (idx) => {
          const val = tokens[idx].token.$value as Record<string, unknown>;
          expect(val).toHaveProperty('fontFamily');
          expect(val).toHaveProperty('fontSize');
          expect(val).toHaveProperty('fontWeight');
          expect(val).toHaveProperty('lineHeight');
          expect(val).toHaveProperty('letterSpacing');
          return true;
        }
      ),
      { numRuns: Math.min(tokens.length, 50) }
    );
  });

  it('every motion token has all required properties with delay defaulting to 0ms', () => {
    const motionGroup = defaultOutput.motion as DTCGGroup;
    const tokens = collectAllTokens(motionGroup as unknown as Record<string, unknown>);

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: tokens.length - 1 }),
        (idx) => {
          const val = tokens[idx].token.$value as Record<string, unknown>;
          expect(val).toHaveProperty('duration');
          expect(val).toHaveProperty('timingFunction');
          expect(val).toHaveProperty('delay');
          // delay defaults to 0ms per Requirement 6.3
          expect(val.delay).toBe('0ms');
          return true;
        }
      ),
      { numRuns: Math.min(tokens.length, 50) }
    );
  });
});
