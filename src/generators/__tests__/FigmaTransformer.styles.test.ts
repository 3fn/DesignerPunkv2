/**
 * FigmaTransformer Style & Transform Integration Tests
 *
 * Tests for transformStyles(), generateEffectStyles(), generateTextStyles(),
 * style naming conventions, and the main transform() method.
 *
 * @requirements Req 1, Req 3, Req 10
 */

import { FigmaTransformer } from '../transformers/FigmaTransformer';
import type { DTCGTokenFile } from '../types/DTCGTypes';
import type { EffectStyleProperties, TextStyleProperties } from '../transformers/FigmaTransformer';

describe('FigmaTransformer — Style Transformation', () => {
  let transformer: FigmaTransformer;

  beforeEach(() => {
    transformer = new FigmaTransformer();
  });

  // ─── Effect Styles (Shadow Tokens → Req 3) ──────────────────────

  describe('Effect styles (shadow tokens)', () => {
    it('generates effect style from shadow token', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        shadow: {
          $type: 'shadow' as any,
          container: {
            $value: {
              offsetX: '0px',
              offsetY: '4px',
              blur: '12px',
              spread: '0px',
              color: 'rgba(0, 0, 0, 0.3)',
            },
            $type: 'shadow' as any,
            $description: 'Container shadow',
          },
        },
      };

      const styles = transformer.transformStyles(dtcg);
      expect(styles).toHaveLength(1);

      const style = styles[0];
      expect(style.type).toBe('EFFECT');
      expect(style.name).toBe('shadow.container');

      const props = style.properties as EffectStyleProperties;
      expect(props.effects).toHaveLength(1);
      expect(props.effects[0].type).toBe('DROP_SHADOW');
      expect(props.effects[0].offset).toEqual({ x: 0, y: 4 });
      expect(props.effects[0].radius).toBe(12);
      expect(props.effects[0].spread).toBe(0);
    });

    it('parses shadow color to Figma 0-1 range', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        shadow: {
          $type: 'shadow' as any,
          elevation200: {
            $value: {
              offsetX: '2px',
              offsetY: '8px',
              blur: '24px',
              spread: '2px',
              color: 'rgba(255, 0, 128, 0.5)',
            },
            $type: 'shadow' as any,
          },
        },
      };

      const styles = transformer.transformStyles(dtcg);
      const props = styles[0].properties as EffectStyleProperties;
      const color = props.effects[0].color;

      expect(color.r).toBeCloseTo(1.0);
      expect(color.g).toBeCloseTo(0);
      expect(color.b).toBeCloseTo(128 / 255);
      expect(color.a).toBeCloseTo(0.5);
    });

    it('includes description referencing source token', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        shadow: {
          $type: 'shadow' as any,
          dusk: {
            $value: {
              offsetX: '0px',
              offsetY: '2px',
              blur: '8px',
              color: 'rgba(0, 0, 0, 0.2)',
            },
            $type: 'shadow' as any,
            $description: 'Subtle dusk shadow',
          },
        },
      };

      const styles = transformer.transformStyles(dtcg);
      expect(styles[0].description).toBe(
        'Source: shadow.dusk — Subtle dusk shadow',
      );
    });

    it('generates multiple effect styles from multiple shadow tokens', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        shadow: {
          $type: 'shadow' as any,
          container: {
            $value: { offsetX: '0px', offsetY: '4px', blur: '12px', spread: '0px', color: 'rgba(0,0,0,0.3)' },
            $type: 'shadow' as any,
          },
          elevation200: {
            $value: { offsetX: '0px', offsetY: '8px', blur: '24px', spread: '0px', color: 'rgba(0,0,0,0.2)' },
            $type: 'shadow' as any,
          },
        },
      };

      const styles = transformer.transformStyles(dtcg);
      const effectStyles = styles.filter((s) => s.type === 'EFFECT');
      expect(effectStyles).toHaveLength(2);
      expect(effectStyles.map((s) => s.name)).toEqual(
        expect.arrayContaining(['shadow.container', 'shadow.elevation200']),
      );
    });

    it('returns empty array when no shadow group exists', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        space: { $type: 'dimension', space100: { $value: '8px', $type: 'dimension' } },
      };

      const styles = transformer.transformStyles(dtcg);
      const effectStyles = styles.filter((s) => s.type === 'EFFECT');
      expect(effectStyles).toHaveLength(0);
    });
  });


  // ─── Text Styles (Typography Tokens → Req 3) ────────────────────

  describe('Text styles (typography tokens)', () => {
    it('generates text style from typography token with direct values', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        typography: {
          $type: 'typography' as any,
          bodySm: {
            $value: {
              fontFamily: 'Inter',
              fontSize: 14,
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: 0,
            },
            $type: 'typography' as any,
            $description: 'Small body text',
          },
        },
      };

      const styles = transformer.transformStyles(dtcg);
      expect(styles).toHaveLength(1);

      const style = styles[0];
      expect(style.type).toBe('TEXT');
      expect(style.name).toBe('typography.bodySm');

      const props = style.properties as TextStyleProperties;
      expect(props.fontFamily).toBe('Inter');
      expect(props.fontSize).toBe(14);
      expect(props.fontWeight).toBe(400);
      expect(props.lineHeight).toBe(1.5);
      expect(props.letterSpacing).toBe(0);
    });

    it('resolves typography alias references to concrete values', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        fontFamily: {
          $type: 'fontFamily',
          fontFamilyBody: {
            $value: ['Inter', 'sans-serif'],
            $type: 'fontFamily',
          },
        },
        fontSize: {
          $type: 'dimension',
          fontSize200: {
            $value: '16px',
            $type: 'dimension',
          },
        },
        fontWeight: {
          $type: 'fontWeight',
          fontWeight700: {
            $value: 700,
            $type: 'fontWeight',
          },
        },
        lineHeight: {
          $type: 'number',
          lineHeight200: {
            $value: 1.5,
            $type: 'number',
          },
        },
        letterSpacing: {
          $type: 'dimension',
          letterSpacing100: {
            $value: '0px',
            $type: 'dimension',
          },
        },
        typography: {
          $type: 'typography' as any,
          heading200: {
            $value: {
              fontFamily: '{fontFamily.fontFamilyBody}',
              fontSize: '{fontSize.fontSize200}',
              fontWeight: '{fontWeight.fontWeight700}',
              lineHeight: '{lineHeight.lineHeight200}',
              letterSpacing: '{letterSpacing.letterSpacing100}',
            },
            $type: 'typography' as any,
            $description: 'Heading level 2',
          },
        },
      };

      const styles = transformer.transformStyles(dtcg);
      expect(styles).toHaveLength(1);

      const props = styles[0].properties as TextStyleProperties;
      expect(props.fontFamily).toBe('Inter, sans-serif');
      expect(props.fontSize).toBe(16);
      expect(props.fontWeight).toBe(700);
      expect(props.lineHeight).toBe(1.5);
      expect(props.letterSpacing).toBe(0);
    });

    it('includes description referencing source token', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        typography: {
          $type: 'typography' as any,
          heading200: {
            $value: {
              fontFamily: 'Inter',
              fontSize: 24,
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: -0.5,
            },
            $type: 'typography' as any,
            $description: 'Heading level 2',
          },
        },
      };

      const styles = transformer.transformStyles(dtcg);
      expect(styles[0].description).toBe(
        'Source: typography.heading200 — Heading level 2',
      );
    });

    it('returns empty array when no typography group exists', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        space: { $type: 'dimension', space100: { $value: '8px', $type: 'dimension' } },
      };

      const styles = transformer.transformStyles(dtcg);
      const textStyles = styles.filter((s) => s.type === 'TEXT');
      expect(textStyles).toHaveLength(0);
    });
  });

  // ─── Style Naming Conventions (Req 3) ────────────────────────────

  describe('Style naming conventions', () => {
    it('uses dot separator for shadow styles', () => {
      expect(transformer.toFigmaStyleName('shadow', 'container')).toBe(
        'shadow.container',
      );
    });

    it('uses dot separator for typography styles', () => {
      expect(transformer.toFigmaStyleName('typography', 'heading200')).toBe(
        'typography.heading200',
      );
    });

    it('uses dot separator for elevation styles', () => {
      expect(transformer.toFigmaStyleName('shadow', 'elevation200')).toBe(
        'shadow.elevation200',
      );
    });
  });

  // ─── Color Parsing ───────────────────────────────────────────────

  describe('Color parsing (parseRgbaColor)', () => {
    it('parses rgba string to Figma 0-1 range', () => {
      const color = transformer.parseRgbaColor('rgba(255, 128, 0, 0.8)');
      expect(color.r).toBeCloseTo(1.0);
      expect(color.g).toBeCloseTo(128 / 255);
      expect(color.b).toBeCloseTo(0);
      expect(color.a).toBeCloseTo(0.8);
    });

    it('defaults to black when color string is undefined', () => {
      const color = transformer.parseRgbaColor(undefined);
      expect(color).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    });

    it('defaults to black when color string is malformed', () => {
      const color = transformer.parseRgbaColor('not-a-color');
      expect(color).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    });
  });
});

// ─── Main transform() Method (Req 1, Req 10) ──────────────────────

describe('FigmaTransformer — transform() integration', () => {
  let transformer: FigmaTransformer;

  beforeEach(() => {
    transformer = new FigmaTransformer();
  });

  it('produces valid JSON with collections and styles', () => {
    const dtcg: DTCGTokenFile = {
      $schema: 'https://tr.designtokens.org/format/',
      space: {
        $type: 'dimension',
        space100: { $value: '8px', $type: 'dimension' },
      },
      shadow: {
        $type: 'shadow' as any,
        container: {
          $value: { offsetX: '0px', offsetY: '4px', blur: '12px', spread: '0px', color: 'rgba(0,0,0,0.3)' },
          $type: 'shadow' as any,
        },
      },
    };

    const result = transformer.transform(dtcg);
    const parsed = JSON.parse(result.content);

    expect(parsed.collections).toBeDefined();
    expect(parsed.styles).toBeDefined();
    expect(parsed.collections.length).toBeGreaterThan(0);
    expect(parsed.styles.length).toBeGreaterThan(0);
  });

  it('returns formatted JSON (indented)', () => {
    const dtcg: DTCGTokenFile = {
      $schema: 'https://tr.designtokens.org/format/',
      space: {
        $type: 'dimension',
        space100: { $value: '8px', $type: 'dimension' },
      },
    };

    const result = transformer.transform(dtcg);
    // JSON.stringify with indent 2 produces lines starting with spaces
    expect(result.content).toContain('\n  ');
  });

  it('returns correct filename', () => {
    const dtcg: DTCGTokenFile = { $schema: 'https://tr.designtokens.org/format/' };
    const result = transformer.transform(dtcg);
    expect(result.filename).toBe('DesignTokens.figma.json');
  });

  it('collects warnings when no groups found', () => {
    const dtcg: DTCGTokenFile = { $schema: 'https://tr.designtokens.org/format/' };
    const result = transformer.transform(dtcg);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.some((w) => w.includes('No variable collections'))).toBe(true);
    expect(result.warnings.some((w) => w.includes('No styles generated'))).toBe(true);
  });

  it('canTransform validates DTCG schema presence', () => {
    expect(transformer.canTransform({ $schema: 'https://tr.designtokens.org/format/' })).toBe(true);
    expect(transformer.canTransform(null as any)).toBe(false);
    expect(transformer.canTransform({} as any)).toBe(false);
  });
});
