/**
 * FigmaTransformer Variable Transformation Tests
 *
 * Tests for transformVariables(), naming conventions, type mapping,
 * mode values, and description building.
 *
 * @requirements Req 2, Req 6
 */

import { FigmaTransformer } from '../transformers/FigmaTransformer';
import type { DTCGTokenFile } from '../types/DTCGTypes';

describe('FigmaTransformer — Variable Transformation', () => {
  let transformer: FigmaTransformer;

  beforeEach(() => {
    transformer = new FigmaTransformer();
  });

  // ─── Primitives Collection ───────────────────────────────────────

  describe('Primitives collection', () => {
    it('generates primitive variables from space tokens', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        space: {
          $type: 'dimension',
          space100: {
            $value: '8px',
            $type: 'dimension',
            $description: 'Base spacing',
            $extensions: {
              designerpunk: {
                formula: 'base × 1 = 8 × 1 = 8',
                family: 'spacing',
                baseValue: 8,
              },
            },
          },
          space200: {
            $value: '16px',
            $type: 'dimension',
            $description: 'Wide spacing',
          },
        },
      };

      const collections = transformer.transformVariables(dtcg);
      expect(collections).toHaveLength(1);

      const primitives = collections[0];
      expect(primitives.name).toBe('Primitives');
      expect(primitives.modes).toEqual(['light', 'dark']);
      expect(primitives.variables).toHaveLength(2);

      const space100 = primitives.variables.find(
        (v) => v.name === 'space/100',
      );
      expect(space100).toBeDefined();
      expect(space100!.resolvedType).toBe('FLOAT');
      expect(space100!.valuesByMode.light).toBe(8);
      expect(space100!.valuesByMode.dark).toBe(8);
    });

    it('generates primitive variables from color tokens', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        color: {
          $type: 'color',
          purple300: {
            $value: 'rgba(176, 38, 255, 1)',
            $type: 'color',
            $description: 'Bright purple',
          },
        },
      };

      const collections = transformer.transformVariables(dtcg);
      const primitives = collections[0];
      const purple = primitives.variables.find(
        (v) => v.name === 'color/purple/300',
      );
      expect(purple).toBeDefined();
      expect(purple!.resolvedType).toBe('COLOR');
      expect(purple!.valuesByMode.light).toBe('#B026FF');
    });

    it('generates primitive variables from fontWeight tokens', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        fontWeight: {
          $type: 'fontWeight',
          fontWeight400: {
            $value: 400,
            $type: 'fontWeight',
            $description: 'Normal font weight',
          },
        },
      };

      const collections = transformer.transformVariables(dtcg);
      const primitives = collections[0];
      const fw = primitives.variables.find(
        (v) => v.name === 'fontWeight/400',
      );
      expect(fw).toBeDefined();
      expect(fw!.resolvedType).toBe('FLOAT');
      expect(fw!.valuesByMode.light).toBe(400);
    });

    it('generates primitive variables from fontFamily tokens', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        fontFamily: {
          $type: 'fontFamily',
          fontFamilySystem: {
            $value: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            $type: 'fontFamily',
            $description: 'System font stack',
          },
        },
      };

      const collections = transformer.transformVariables(dtcg);
      const primitives = collections[0];
      const ff = primitives.variables.find(
        (v) => v.name === 'fontFamily/System',
      );
      expect(ff).toBeDefined();
      expect(ff!.resolvedType).toBe('STRING');
      expect(ff!.valuesByMode.light).toBe(
        '-apple-system, BlinkMacSystemFont, sans-serif',
      );
    });

    it('generates primitive variables from cubicBezier tokens', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        easing: {
          $type: 'cubicBezier',
          easingStandard: {
            $value: [0.4, 0, 0.2, 1],
            $type: 'cubicBezier',
            $description: 'Standard easing',
          },
        },
      };

      const collections = transformer.transformVariables(dtcg);
      const primitives = collections[0];
      const easing = primitives.variables.find(
        (v) => v.name === 'easing/Standard',
      );
      expect(easing).toBeDefined();
      expect(easing!.resolvedType).toBe('STRING');
      expect(easing!.valuesByMode.light).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    });

    it('generates primitive variables from duration tokens', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        duration: {
          $type: 'duration',
          duration250: {
            $value: '250ms',
            $type: 'duration',
            $description: 'Standard transition',
          },
        },
      };

      const collections = transformer.transformVariables(dtcg);
      const primitives = collections[0];
      const dur = primitives.variables.find(
        (v) => v.name === 'duration/250',
      );
      expect(dur).toBeDefined();
      expect(dur!.resolvedType).toBe('FLOAT');
      expect(dur!.valuesByMode.light).toBe(250);
    });
  });

  // ─── Semantics Collection ────────────────────────────────────────

  describe('Semantics collection', () => {
    it('generates semantic variables with alias references', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        semanticColor: {
          $type: 'color',
          'color.action.primary': {
            $value: '{color.purple300}',
            $type: 'color',
            $description: 'Primary action color',
          },
        },
      };

      const collections = transformer.transformVariables(dtcg);
      expect(collections).toHaveLength(1);

      const semantics = collections[0];
      expect(semantics.name).toBe('Semantics');
      const primary = semantics.variables.find(
        (v) => v.name === 'color/action/primary',
      );
      expect(primary).toBeDefined();
      expect(primary!.resolvedType).toBe('COLOR');
      expect(primary!.valuesByMode.light).toEqual({
        aliasOf: 'color/purple/300',
      });
      // Phase 1: identical light/dark values
      expect(primary!.valuesByMode.dark).toEqual({
        aliasOf: 'color/purple/300',
      });
    });

    it('generates semantic variables from nested groups', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        semanticSpace: {
          $type: 'dimension',
          grouped: {
            $type: 'dimension',
            none: {
              $value: '{space.space000}',
              $type: 'dimension',
              $description: 'Semantic spacing: grouped.none',
            },
            normal: {
              $value: '{space.space100}',
              $type: 'dimension',
              $description: 'Semantic spacing: grouped.normal',
            },
          },
        },
      };

      const collections = transformer.transformVariables(dtcg);
      const semantics = collections[0];
      expect(semantics.variables.length).toBeGreaterThanOrEqual(2);

      const none = semantics.variables.find(
        (v) => v.name === 'semanticSpace/grouped/none',
      );
      expect(none).toBeDefined();
      expect(none!.valuesByMode.light).toEqual({
        aliasOf: 'space/000',
      });

      const normal = semantics.variables.find(
        (v) => v.name === 'semanticSpace/grouped/normal',
      );
      expect(normal).toBeDefined();
      expect(normal!.valuesByMode.light).toEqual({
        aliasOf: 'space/100',
      });
    });
  });

  // ─── Mode Mapping (Req 6) ────────────────────────────────────────

  describe('Mode mapping', () => {
    it('sets identical values for light and dark modes', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        space: {
          $type: 'dimension',
          space100: {
            $value: '8px',
            $type: 'dimension',
          },
        },
      };

      const collections = transformer.transformVariables(dtcg);
      const variable = collections[0].variables[0];
      expect(variable.valuesByMode.light).toBe(variable.valuesByMode.dark);
    });

    it('sets identical alias values for light and dark modes', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        semanticColor: {
          $type: 'color',
          'color.text.default': {
            $value: '{color.gray300}',
            $type: 'color',
          },
        },
      };

      const collections = transformer.transformVariables(dtcg);
      const variable = collections[0].variables[0];
      expect(variable.valuesByMode.light).toEqual(variable.valuesByMode.dark);
    });
  });

  // ─── Naming Conventions ──────────────────────────────────────────

  describe('Naming conventions', () => {
    it('converts space tokens: space/100', () => {
      expect(transformer.toFigmaVariableName('space', 'space100')).toBe(
        'space/100',
      );
    });

    it('converts color tokens with sub-family: color/purple/300', () => {
      expect(transformer.toFigmaVariableName('color', 'purple300')).toBe(
        'color/purple/300',
      );
    });

    it('converts fontSize tokens: fontSize/100', () => {
      expect(transformer.toFigmaVariableName('fontSize', 'fontSize100')).toBe(
        'fontSize/100',
      );
    });

    it('converts dot-separated semantic keys: color/feedback/success/text', () => {
      expect(
        transformer.toFigmaVariableName(
          'semanticColor',
          'color.feedback.success.text',
        ),
      ).toBe('color/feedback/success/text');
    });

    it('converts special names without numbers', () => {
      expect(transformer.toFigmaVariableName('radius', 'radiusMax')).toBe(
        'radius/Max',
      );
    });

    it('converts special names: radiusHalf', () => {
      expect(transformer.toFigmaVariableName('radius', 'radiusHalf')).toBe(
        'radius/Half',
      );
    });
  });

  // ─── Type Mapping ────────────────────────────────────────────────

  describe('Type mapping', () => {
    it('maps color → COLOR', () => {
      expect(transformer.dtcgTypeToFigmaType('color')).toBe('COLOR');
    });

    it('maps dimension → FLOAT', () => {
      expect(transformer.dtcgTypeToFigmaType('dimension')).toBe('FLOAT');
    });

    it('maps number → FLOAT', () => {
      expect(transformer.dtcgTypeToFigmaType('number')).toBe('FLOAT');
    });

    it('maps fontFamily → STRING', () => {
      expect(transformer.dtcgTypeToFigmaType('fontFamily')).toBe('STRING');
    });

    it('maps fontWeight → FLOAT', () => {
      expect(transformer.dtcgTypeToFigmaType('fontWeight')).toBe('FLOAT');
    });

    it('maps cubicBezier → STRING', () => {
      expect(transformer.dtcgTypeToFigmaType('cubicBezier')).toBe('STRING');
    });

    it('maps duration → FLOAT', () => {
      expect(transformer.dtcgTypeToFigmaType('duration')).toBe('FLOAT');
    });

    it('defaults to FLOAT for unknown types', () => {
      expect(transformer.dtcgTypeToFigmaType(undefined)).toBe('FLOAT');
    });
  });

  // ─── Description Building ────────────────────────────────────────

  describe('Description building', () => {
    it('includes token description', () => {
      const desc = transformer.buildVariableDescription({
        $value: '8px',
        $description: 'Base spacing',
      });
      expect(desc).toContain('Base spacing');
    });

    it('includes mathematical formula', () => {
      const desc = transformer.buildVariableDescription({
        $value: '8px',
        $description: 'Base spacing',
        $extensions: {
          designerpunk: {
            formula: 'base × 1 = 8 × 1 = 8',
            family: 'spacing',
            baseValue: 8,
          },
        },
      });
      expect(desc).toContain('Formula: base × 1 = 8 × 1 = 8');
    });

    it('includes platform notes for unsupported platforms', () => {
      const desc = transformer.buildVariableDescription({
        $value: 100,
        $description: 'Z-index',
        $extensions: {
          designerpunk: {
            family: 'zIndex',
            platforms: {
              web: { supported: true },
              android: {
                supported: false,
                note: 'Use elevation tokens instead',
              },
            },
          },
        },
      });
      expect(desc).toContain('android: Use elevation tokens instead');
    });

    it('returns undefined when no metadata available', () => {
      const desc = transformer.buildVariableDescription({
        $value: '8px',
      });
      expect(desc).toBeUndefined();
    });
  });

  // ─── Empty/Missing Groups ────────────────────────────────────────

  describe('Edge cases', () => {
    it('returns empty collections when no matching groups exist', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
      };

      const collections = transformer.transformVariables(dtcg);
      expect(collections).toHaveLength(0);
    });

    it('skips composite token groups (shadow, typography)', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        shadow: {
          $type: 'shadow' as any,
          container: {
            $value: { offsetX: '0px', offsetY: '4px', blur: '12px', spread: '0px', color: 'rgba(0,0,0,0.3)' },
            $type: 'shadow' as any,
          },
        },
        typography: {
          $type: 'typography' as any,
          bodyMd: {
            $value: { fontFamily: 'Inter', fontSize: '16px', fontWeight: 400, lineHeight: 1.5, letterSpacing: '0em' },
            $type: 'typography' as any,
          },
        },
      };

      const collections = transformer.transformVariables(dtcg);
      // shadow and typography are composite groups, not in PRIMITIVE_GROUPS or SEMANTIC_GROUPS
      expect(collections).toHaveLength(0);
    });
  });

  // ─── Integration with real DTCG structure ────────────────────────

  describe('Integration with realistic DTCG structure', () => {
    it('handles a mix of primitive and semantic tokens', () => {
      const dtcg: DTCGTokenFile = {
        $schema: 'https://tr.designtokens.org/format/',
        space: {
          $type: 'dimension',
          space000: { $value: '0px', $type: 'dimension' },
          space100: { $value: '8px', $type: 'dimension' },
        },
        color: {
          $type: 'color',
          purple300: { $value: 'rgba(176, 38, 255, 1)', $type: 'color' },
          gray300: { $value: 'rgba(45, 43, 62, 1)', $type: 'color' },
        },
        semanticColor: {
          $type: 'color',
          'color.action.primary': {
            $value: '{color.purple300}',
            $type: 'color',
          },
          'color.text.default': {
            $value: '{color.gray300}',
            $type: 'color',
          },
        },
        semanticSpace: {
          $type: 'dimension',
          inset: {
            $type: 'dimension',
            '100': {
              $value: '{space.space100}',
              $type: 'dimension',
            },
          },
        },
      };

      const collections = transformer.transformVariables(dtcg);
      expect(collections).toHaveLength(2);

      const primitives = collections.find((c) => c.name === 'Primitives')!;
      expect(primitives.variables).toHaveLength(4);

      const semantics = collections.find((c) => c.name === 'Semantics')!;
      expect(semantics.variables).toHaveLength(3);
    });
  });
});
