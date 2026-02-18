/**
 * Integration Tests for DTCGFormatGenerator (Task 5.2)
 *
 * Validates end-to-end behavior:
 * - Full DTCG output generation from Rosetta token sources
 * - File write to correct location with correct formatting
 * - TransformerRegistry consuming generated DTCG output
 * - Token completeness (all token source files have corresponding output)
 *
 * @requirements All requirements (validation)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { DTCGFormatGenerator } from '../DTCGFormatGenerator';
import type { DTCGTokenFile, DTCGGroup, DTCGToken } from '../types/DTCGTypes';
import { TransformerRegistry } from '../transformers/TransformerRegistry';
import type { ITokenTransformer, TransformResult } from '../transformers/ITokenTransformer';

// ---------------------------------------------------------------------------
// 1. End-to-End Generation
// ---------------------------------------------------------------------------
describe('end-to-end generation', () => {
  let output: DTCGTokenFile;

  beforeAll(() => {
    const generator = new DTCGFormatGenerator();
    output = generator.generate();
  });

  it('should produce a complete DTCGTokenFile from Rosetta sources', () => {
    expect(output).toBeDefined();
    expect(output.$schema).toBe('https://tr.designtokens.org/format/');
    expect(output.$extensions?.designerpunk).toBeDefined();
  });

  it('should be serializable to valid JSON and back', () => {
    const json = JSON.stringify(output, null, 2);
    const parsed = JSON.parse(json) as DTCGTokenFile;

    expect(parsed.$schema).toBe(output.$schema);
    expect(parsed.$extensions?.designerpunk?.version).toBe(
      output.$extensions?.designerpunk?.version
    );
  });

  it('should produce identical output on consecutive runs (idempotent structure)', () => {
    const gen1 = new DTCGFormatGenerator();
    const gen2 = new DTCGFormatGenerator();
    const out1 = gen1.generate();
    const out2 = gen2.generate();

    // Strip generatedAt timestamps for structural comparison
    delete (out1.$extensions?.designerpunk as Record<string, unknown>)?.generatedAt;
    delete (out2.$extensions?.designerpunk as Record<string, unknown>)?.generatedAt;

    expect(JSON.stringify(out1)).toBe(JSON.stringify(out2));
  });

  it('should include both primitive and semantic token groups', () => {
    const primitiveGroups = [
      'space', 'color', 'fontSize', 'fontWeight', 'fontFamily',
      'lineHeight', 'letterSpacing', 'radius', 'borderWidth',
      'tapArea', 'density', 'breakpoint', 'opacity', 'duration',
      'easing', 'scale', 'blend',
    ];
    const semanticGroups = [
      'semanticColor', 'semanticSpace', 'semanticBorderWidth',
      'semanticRadius', 'semanticOpacity', 'semanticBlend',
      'gridSpacing', 'icon', 'accessibility', 'progressColor',
      'zIndex', 'elevation', 'shadow', 'glow', 'typography', 'motion',
    ];

    for (const g of [...primitiveGroups, ...semanticGroups]) {
      expect(output[g]).toBeDefined();
    }
  });
});


// ---------------------------------------------------------------------------
// 2. File Write
// ---------------------------------------------------------------------------
describe('file write', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dtcg-integration-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('should write valid JSON to the specified path', () => {
    const outputPath = path.join(tmpDir, 'DesignTokens.dtcg.json');
    const generator = new DTCGFormatGenerator();
    generator.writeToFile(outputPath);

    expect(fs.existsSync(outputPath)).toBe(true);
    const content = fs.readFileSync(outputPath, 'utf-8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  it('should create nested directories if they do not exist', () => {
    const outputPath = path.join(tmpDir, 'nested', 'deep', 'DesignTokens.dtcg.json');
    const generator = new DTCGFormatGenerator();
    generator.writeToFile(outputPath);

    expect(fs.existsSync(outputPath)).toBe(true);
  });

  it('should write pretty-printed JSON with 2-space indentation by default', () => {
    const outputPath = path.join(tmpDir, 'pretty.dtcg.json');
    const generator = new DTCGFormatGenerator({ prettyPrint: true });
    generator.writeToFile(outputPath);

    const content = fs.readFileSync(outputPath, 'utf-8');
    // Pretty-printed JSON starts with {\n  "
    expect(content).toContain('\n');
    expect(content).toContain('  "');
  });

  it('should write minified JSON when prettyPrint is false', () => {
    const outputPath = path.join(tmpDir, 'minified.dtcg.json');
    const generator = new DTCGFormatGenerator({ prettyPrint: false });
    generator.writeToFile(outputPath);

    const content = fs.readFileSync(outputPath, 'utf-8');
    expect(content).not.toContain('\n');
  });

  it('should overwrite existing file without error (idempotent)', () => {
    const outputPath = path.join(tmpDir, 'overwrite.dtcg.json');
    const generator = new DTCGFormatGenerator();

    generator.writeToFile(outputPath);
    const firstContent = fs.readFileSync(outputPath, 'utf-8');

    generator.writeToFile(outputPath);
    const secondContent = fs.readFileSync(outputPath, 'utf-8');

    // Both writes should produce valid JSON
    expect(() => JSON.parse(firstContent)).not.toThrow();
    expect(() => JSON.parse(secondContent)).not.toThrow();
  });

  it('should produce a file whose parsed content matches generate() output', () => {
    const outputPath = path.join(tmpDir, 'match.dtcg.json');
    const generator = new DTCGFormatGenerator();
    const memoryOutput = generator.generate();
    generator.writeToFile(outputPath);

    const fileContent = JSON.parse(fs.readFileSync(outputPath, 'utf-8')) as DTCGTokenFile;

    // Compare key structural properties (generatedAt will differ)
    expect(fileContent.$schema).toBe(memoryOutput.$schema);
    expect(Object.keys(fileContent).sort()).toEqual(Object.keys(memoryOutput).sort());
  });
});

// ---------------------------------------------------------------------------
// 3. Transformer Integration
// ---------------------------------------------------------------------------
describe('transformer integration', () => {
  /** Minimal test transformer that passes through DTCG tokens as JSON */
  class TestTransformer implements ITokenTransformer {
    readonly config = {
      id: 'test',
      name: 'Test Transformer',
      outputExtension: '.test.json',
      includeExtensions: true,
    };

    transform(dtcgTokens: DTCGTokenFile): TransformResult {
      return {
        content: JSON.stringify(dtcgTokens, null, 2),
        filename: `DesignTokens${this.config.outputExtension}`,
        warnings: [],
      };
    }

    canTransform(_dtcgTokens: DTCGTokenFile): boolean {
      return true;
    }
  }

  it('should allow TransformerRegistry to consume generated DTCG output', () => {
    const registry = new TransformerRegistry();
    const transformer = new TestTransformer();
    registry.register(transformer);

    const generator = new DTCGFormatGenerator();
    const dtcgOutput = generator.generate();

    const result = registry.transform('test', dtcgOutput);
    expect(result.content).toBeDefined();
    expect(result.filename).toBe('DesignTokens.test.json');
    expect(result.warnings).toHaveLength(0);

    // Verify the transformed content is valid JSON matching the input
    const parsed = JSON.parse(result.content) as DTCGTokenFile;
    expect(parsed.$schema).toBe(dtcgOutput.$schema);
  });

  it('should support transformAll with multiple transformers', () => {
    const registry = new TransformerRegistry();
    registry.register(new TestTransformer());

    // Add a second transformer
    const secondTransformer: ITokenTransformer = {
      config: { id: 'second', name: 'Second', outputExtension: '.second.json', includeExtensions: false },
      transform: (tokens) => ({
        content: JSON.stringify({ tokenCount: Object.keys(tokens).length }),
        filename: 'DesignTokens.second.json',
        warnings: [],
      }),
      canTransform: () => true,
    };
    registry.register(secondTransformer);

    const generator = new DTCGFormatGenerator();
    const dtcgOutput = generator.generate();
    const results = registry.transformAll(dtcgOutput);

    expect(results).toHaveLength(2);
    expect(results[0].filename).toBe('DesignTokens.test.json');
    expect(results[1].filename).toBe('DesignTokens.second.json');
  });

  it('should throw when invoking an unregistered transformer', () => {
    const registry = new TransformerRegistry();
    const generator = new DTCGFormatGenerator();
    const dtcgOutput = generator.generate();

    expect(() => registry.transform('nonexistent', dtcgOutput)).toThrow('Transformer not found: nonexistent');
  });
});


// ---------------------------------------------------------------------------
// 4. Token Completeness
// ---------------------------------------------------------------------------
describe('token completeness', () => {
  let output: DTCGTokenFile;

  beforeAll(() => {
    const generator = new DTCGFormatGenerator();
    output = generator.generate();
  });

  it('should have a DTCG group for every primitive token family', () => {
    // Map of primitive token source files → expected DTCG group names
    const primitiveSourceToGroup: Record<string, string> = {
      SpacingTokens: 'space',
      ColorTokens: 'color',
      FontSizeTokens: 'fontSize',
      FontWeightTokens: 'fontWeight',
      FontFamilyTokens: 'fontFamily',
      LineHeightTokens: 'lineHeight',
      LetterSpacingTokens: 'letterSpacing',
      RadiusTokens: 'radius',
      BorderWidthTokens: 'borderWidth',
      TapAreaTokens: 'tapArea',
      DensityTokens: 'density',
      BreakpointTokens: 'breakpoint',
      OpacityTokens: 'opacity',
      DurationTokens: 'duration',
      EasingTokens: 'easing',
      ScaleTokens: 'scale',
      BlendTokens: 'blend',
      // Shadow primitives are folded into the shadow group
      ShadowBlurTokens: 'shadow',
      ShadowOffsetTokens: 'shadow',
      ShadowOpacityTokens: 'shadow',
      // Glow primitives have their own group
      GlowBlurTokens: 'glow',
      GlowOpacityTokens: 'glow',
    };

    for (const [source, group] of Object.entries(primitiveSourceToGroup)) {
      expect(output[group]).toBeDefined();
      const dtcgGroup = output[group] as DTCGGroup;
      // Each group should have at least one non-meta key
      const tokenKeys = Object.keys(dtcgGroup).filter(k => !k.startsWith('$'));
      expect(tokenKeys.length).toBeGreaterThan(0);
    }
  });

  it('should have a DTCG group for every semantic token category', () => {
    const semanticSourceToGroup: Record<string, string> = {
      'semantic/ColorTokens': 'semanticColor',
      'semantic/SpacingTokens': 'semanticSpace',
      'semantic/BorderWidthTokens': 'semanticBorderWidth',
      'semantic/RadiusTokens': 'semanticRadius',
      'semantic/OpacityTokens': 'semanticOpacity',
      'semantic/BlendTokens': 'semanticBlend',
      'semantic/ZIndexTokens': 'zIndex',
      'semantic/ElevationTokens': 'elevation',
      'semantic/GridSpacingTokens': 'gridSpacing',
      'semantic/IconTokens': 'icon',
      'semantic/AccessibilityTokens': 'accessibility',
      'semantic/MotionTokens': 'motion',
      'semantic/TypographyTokens': 'typography',
      'semantic/ShadowTokens': 'shadow',
      'semantic/color-progress': 'progressColor',
    };

    for (const [source, group] of Object.entries(semanticSourceToGroup)) {
      expect(output[group]).toBeDefined();
    }
  });

  it('should contain tokens with valid $value in every group', () => {
    const allGroups = Object.entries(output).filter(
      ([key]) => !key.startsWith('$')
    );

    for (const [groupName, groupValue] of allGroups) {
      const group = groupValue as DTCGGroup;
      const tokenCount = countTokensDeep(group);
      expect(tokenCount).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively count tokens (objects with $value) in a DTCG group */
function countTokensDeep(group: DTCGGroup): number {
  let count = 0;
  for (const [key, value] of Object.entries(group)) {
    if (key.startsWith('$')) continue;
    if (value && typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      if ('$value' in obj) {
        count++;
      }
      count += countTokensDeep(obj as DTCGGroup);
    }
  }
  return count;
}
