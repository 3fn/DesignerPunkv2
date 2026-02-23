/**
 * Integration tests for ComponentAnalysisGenerator — JSON output.
 *
 * Validates that generateComponentAnalysisJSON() produces valid JSON
 * matching the ComponentAnalysis interface, creates directories,
 * sanitizes filenames, and preserves all data through serialization.
 *
 * @spec 054d-hierarchical-design-extraction
 * @requirements Req 7 (Dual Output Format)
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  generateComponentAnalysisJSON,
  sanitizeComponentName,
} from '../ComponentAnalysisGenerator';
import type { ComponentAnalysis } from '../ComponentAnalysis';

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

function makeAnalysisFixture(overrides?: Partial<ComponentAnalysis>): ComponentAnalysis {
  return {
    componentName: 'Progress / Pagination',
    componentType: 'COMPONENT_SET',
    figmaId: '1:1',
    fileKey: 'abc123',
    variantDefinitions: {
      'Property 1': {
        type: 'VARIANT',
        defaultValue: 'Sm',
        variantOptions: ['Sm', 'Md', 'Lg'],
      },
    },
    nodeTree: {
      id: '1:1',
      name: 'Progress / Pagination',
      type: 'COMPONENT_SET',
      depth: 0,
      ancestorChain: [],
      layout: {
        layoutMode: 'VERTICAL',
        padding: { top: 16, right: 16, bottom: 16, left: 16 },
        itemSpacing: 8,
      },
      tokenClassifications: {
        semanticIdentified: [
          {
            property: 'padding-top',
            semanticToken: 'semanticSpace.inset.100',
            primitiveToken: 'space.space100',
            rawValue: 16,
            matchMethod: 'binding',
            confidence: 'exact',
          },
        ],
        primitiveIdentified: [
          {
            property: 'item-spacing',
            primitiveToken: 'space.space050',
            rawValue: 8,
            matchMethod: 'value',
            confidence: 'exact',
          },
        ],
        unidentified: [
          {
            property: 'fill',
            rawValue: 'rgba(255, 0, 0, 1)',
            reason: 'no-token-match',
          },
        ],
      },
      children: [
        {
          id: '1:2',
          name: 'Property 1=Sm',
          type: 'COMPONENT',
          depth: 1,
          ancestorChain: ['COMPONENT_SET'],
          layout: { layoutMode: 'HORIZONTAL', itemSpacing: 4, cornerRadius: 8 },
          tokenClassifications: {
            semanticIdentified: [],
            primitiveIdentified: [],
            unidentified: [],
          },
          children: [
            {
              id: '1:3',
              name: 'Progress Indicator Primitive',
              type: 'INSTANCE',
              depth: 2,
              ancestorChain: ['COMPONENT_SET', 'COMPONENT'],
              componentProperties: {
                State: { type: 'VARIANT', value: 'Current' },
                'Show Label': { type: 'BOOLEAN', value: false },
              },
              tokenClassifications: {
                semanticIdentified: [],
                primitiveIdentified: [
                  {
                    property: 'corner-radius',
                    primitiveToken: 'radius.radius050',
                    rawValue: 4,
                    matchMethod: 'value',
                    confidence: 'exact',
                  },
                ],
                unidentified: [],
              },
              children: [],
            },
          ],
        },
      ],
    },
    classificationSummary: {
      semanticIdentified: 1,
      primitiveIdentified: 2,
      unidentified: 1,
    },
    compositionPatterns: [
      {
        componentName: 'Progress Indicator Primitive',
        count: 5,
        sharedProperties: { Size: 'Sm', 'Show Label': false },
        propertyVariations: [
          { properties: { State: 'Current' }, count: 1 },
          { properties: { State: 'Incomplete' }, count: 4 },
        ],
        depth: 2,
      },
    ],
    unresolvedBindings: [
      {
        variableId: 'VariableID:1224:14083',
        property: 'fill',
        nodeId: '1:4',
        nodeName: 'Track',
        ancestorChain: ['COMPONENT_SET', 'COMPONENT', 'INSTANCE'],
        reason: 'not-in-token-values',
      },
    ],
    recommendations: {
      componentTokens: [
        {
          tokenName: 'progress.track.fill',
          currentValue: 'purple-500',
          usageCount: 5,
          locations: ['Track'],
          rationale: 'Used consistently across all progress indicator instances',
        } as any,
      ],
    },
    screenshots: [
      {
        filePath: './images/progress-pagination-sm.png',
        url: 'https://figma.com/images/abc123.png',
        format: 'png',
        scale: 2,
        variant: 'Property 1=Sm',
        capturedAt: '2026-02-22T10:00:00.000Z',
      },
    ],
    extractedAt: '2026-02-22T10:00:00.000Z',
    extractorVersion: '6.3.0',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests — generateComponentAnalysisJSON
// ---------------------------------------------------------------------------

describe('generateComponentAnalysisJSON', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'analysis-json-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it('writes valid JSON matching ComponentAnalysis interface', () => {
    const analysis = makeAnalysisFixture();
    const result = generateComponentAnalysisJSON(analysis, { outputDir: tmpDir });

    const raw = fs.readFileSync(result.filePath, 'utf-8');
    const parsed = JSON.parse(raw) as ComponentAnalysis;

    expect(parsed.componentName).toBe('Progress / Pagination');
    expect(parsed.componentType).toBe('COMPONENT_SET');
    expect(parsed.figmaId).toBe('1:1');
    expect(parsed.fileKey).toBe('abc123');
    expect(parsed.extractedAt).toBe('2026-02-22T10:00:00.000Z');
    expect(parsed.extractorVersion).toBe('6.3.0');
    expect(parsed.variantDefinitions).toBeDefined();
    expect(parsed.nodeTree).toBeDefined();
    expect(parsed.classificationSummary).toBeDefined();
    expect(parsed.compositionPatterns).toBeDefined();
    expect(parsed.unresolvedBindings).toBeDefined();
    expect(parsed.recommendations).toBeDefined();
    expect(parsed.screenshots).toBeDefined();
  });

  it('creates output directory if it does not exist', () => {
    const analysis = makeAnalysisFixture();
    const nested = path.join(tmpDir, 'deep', 'nested', 'dir');

    expect(fs.existsSync(nested)).toBe(false);

    const result = generateComponentAnalysisJSON(analysis, { outputDir: nested });

    expect(fs.existsSync(nested)).toBe(true);
    expect(fs.existsSync(result.filePath)).toBe(true);
  });

  it('sanitizes component name for filename', () => {
    const analysis = makeAnalysisFixture();
    const result = generateComponentAnalysisJSON(analysis, { outputDir: tmpDir });

    expect(path.basename(result.filePath)).toBe('progress-pagination-analysis.json');
    expect(result.componentName).toBe('progress-pagination');
  });

  it('preserves hierarchical nodeTree structure', () => {
    const analysis = makeAnalysisFixture();
    const result = generateComponentAnalysisJSON(analysis, { outputDir: tmpDir });

    const parsed = JSON.parse(fs.readFileSync(result.filePath, 'utf-8')) as ComponentAnalysis;
    const tree = parsed.nodeTree;

    // Root
    expect(tree.depth).toBe(0);
    expect(tree.type).toBe('COMPONENT_SET');
    expect(tree.children).toHaveLength(1);

    // Depth 1
    const child = tree.children[0];
    expect(child.depth).toBe(1);
    expect(child.type).toBe('COMPONENT');
    expect(child.ancestorChain).toEqual(['COMPONENT_SET']);
    expect(child.children).toHaveLength(1);

    // Depth 2
    const grandchild = child.children[0];
    expect(grandchild.depth).toBe(2);
    expect(grandchild.type).toBe('INSTANCE');
    expect(grandchild.ancestorChain).toEqual(['COMPONENT_SET', 'COMPONENT']);
    expect(grandchild.children).toHaveLength(0);
  });

  it('preserves classificationSummary counts', () => {
    const analysis = makeAnalysisFixture();
    const result = generateComponentAnalysisJSON(analysis, { outputDir: tmpDir });

    const parsed = JSON.parse(fs.readFileSync(result.filePath, 'utf-8')) as ComponentAnalysis;

    expect(parsed.classificationSummary).toEqual({
      semanticIdentified: 1,
      primitiveIdentified: 2,
      unidentified: 1,
    });
  });

  it('preserves compositionPatterns', () => {
    const analysis = makeAnalysisFixture();
    const result = generateComponentAnalysisJSON(analysis, { outputDir: tmpDir });

    const parsed = JSON.parse(fs.readFileSync(result.filePath, 'utf-8')) as ComponentAnalysis;

    expect(parsed.compositionPatterns).toHaveLength(1);
    const pattern = parsed.compositionPatterns[0];
    expect(pattern.componentName).toBe('Progress Indicator Primitive');
    expect(pattern.count).toBe(5);
    expect(pattern.sharedProperties).toEqual({ Size: 'Sm', 'Show Label': false });
    expect(pattern.propertyVariations).toHaveLength(2);
    expect(pattern.propertyVariations[0]).toEqual({ properties: { State: 'Current' }, count: 1 });
    expect(pattern.propertyVariations[1]).toEqual({ properties: { State: 'Incomplete' }, count: 4 });
    expect(pattern.depth).toBe(2);
  });

  it('preserves unresolvedBindings', () => {
    const analysis = makeAnalysisFixture();
    const result = generateComponentAnalysisJSON(analysis, { outputDir: tmpDir });

    const parsed = JSON.parse(fs.readFileSync(result.filePath, 'utf-8')) as ComponentAnalysis;

    expect(parsed.unresolvedBindings).toHaveLength(1);
    const binding = parsed.unresolvedBindings[0];
    expect(binding.variableId).toBe('VariableID:1224:14083');
    expect(binding.property).toBe('fill');
    expect(binding.nodeId).toBe('1:4');
    expect(binding.nodeName).toBe('Track');
    expect(binding.ancestorChain).toEqual(['COMPONENT_SET', 'COMPONENT', 'INSTANCE']);
    expect(binding.reason).toBe('not-in-token-values');
  });

  it('preserves recommendations', () => {
    const analysis = makeAnalysisFixture();
    const result = generateComponentAnalysisJSON(analysis, { outputDir: tmpDir });

    const parsed = JSON.parse(fs.readFileSync(result.filePath, 'utf-8')) as ComponentAnalysis;

    expect(parsed.recommendations).toBeDefined();
    expect(parsed.recommendations.componentTokens).toHaveLength(1);
    const token = parsed.recommendations.componentTokens![0] as any;
    expect(token.tokenName).toBe('progress.track.fill');
    expect(token.usageCount).toBe(5);
  });

  it('preserves screenshots metadata', () => {
    const analysis = makeAnalysisFixture();
    const result = generateComponentAnalysisJSON(analysis, { outputDir: tmpDir });

    const parsed = JSON.parse(fs.readFileSync(result.filePath, 'utf-8')) as ComponentAnalysis;

    expect(parsed.screenshots).toHaveLength(1);
    const screenshot = parsed.screenshots[0];
    expect(screenshot.filePath).toBe('./images/progress-pagination-sm.png');
    expect(screenshot.url).toBe('https://figma.com/images/abc123.png');
    expect(screenshot.format).toBe('png');
    expect(screenshot.scale).toBe(2);
    expect(screenshot.variant).toBe('Property 1=Sm');
    expect(screenshot.capturedAt).toBe('2026-02-22T10:00:00.000Z');
  });

  it('returns correct result metadata', () => {
    const analysis = makeAnalysisFixture();
    const result = generateComponentAnalysisJSON(analysis, { outputDir: tmpDir });

    expect(result.componentName).toBe('progress-pagination');
    expect(result.filePath).toBe(path.join(path.resolve(tmpDir), 'progress-pagination-analysis.json'));
    expect(result.sizeBytes).toBeGreaterThan(0);

    // sizeBytes should match actual file content
    const raw = fs.readFileSync(result.filePath, 'utf-8');
    expect(result.sizeBytes).toBe(Buffer.byteLength(raw, 'utf-8'));
  });

  it('respects custom indent option', () => {
    const analysis = makeAnalysisFixture();
    const result = generateComponentAnalysisJSON(analysis, { outputDir: tmpDir, indent: 4 });

    const raw = fs.readFileSync(result.filePath, 'utf-8');
    // 4-space indentation: first nested key should be indented with 4 spaces
    expect(raw).toContain('    "componentName"');
    // Should NOT use 2-space indentation for the first level
    expect(raw).not.toMatch(/^  "componentName"/m);
  });

  it('handles empty arrays and optional fields', () => {
    const analysis = makeAnalysisFixture({
      variantDefinitions: undefined,
      compositionPatterns: [],
      unresolvedBindings: [],
      recommendations: {},
      screenshots: [],
      nodeTree: {
        id: '1:1',
        name: 'Minimal',
        type: 'COMPONENT',
        depth: 0,
        ancestorChain: [],
        tokenClassifications: {
          semanticIdentified: [],
          primitiveIdentified: [],
          unidentified: [],
        },
        children: [],
      },
      classificationSummary: {
        semanticIdentified: 0,
        primitiveIdentified: 0,
        unidentified: 0,
      },
    });

    const result = generateComponentAnalysisJSON(analysis, { outputDir: tmpDir });
    const parsed = JSON.parse(fs.readFileSync(result.filePath, 'utf-8')) as ComponentAnalysis;

    expect(parsed.compositionPatterns).toEqual([]);
    expect(parsed.unresolvedBindings).toEqual([]);
    expect(parsed.screenshots).toEqual([]);
    expect(parsed.recommendations).toEqual({});
    expect(parsed.variantDefinitions).toBeUndefined();
    expect(parsed.nodeTree.children).toEqual([]);
    expect(parsed.classificationSummary.semanticIdentified).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Tests — sanitizeComponentName
// ---------------------------------------------------------------------------

describe('sanitizeComponentName', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(sanitizeComponentName('Button CTA')).toBe('button-cta');
  });

  it('replaces slashes with hyphens', () => {
    expect(sanitizeComponentName('Progress / Pagination')).toBe('progress-pagination');
  });

  it('collapses multiple special characters into single hyphen', () => {
    expect(sanitizeComponentName('A---B///C   D')).toBe('a-b-c-d');
  });

  it('strips leading and trailing hyphens', () => {
    expect(sanitizeComponentName('  /Hello World/  ')).toBe('hello-world');
  });

  it('handles already-clean names', () => {
    expect(sanitizeComponentName('icon-base')).toBe('icon-base');
  });

  it('handles names with numbers', () => {
    expect(sanitizeComponentName('Button V2 Large')).toBe('button-v2-large');
  });

  it('handles empty string', () => {
    expect(sanitizeComponentName('')).toBe('');
  });
});