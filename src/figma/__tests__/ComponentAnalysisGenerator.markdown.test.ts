/**
 * Integration tests for ComponentAnalysisGenerator — Markdown output.
 *
 * Validates that generateComponentAnalysisMarkdown() produces Markdown
 * with all required sections, tier indicators, validation disclaimers,
 * domain specialist prompts, and screenshot embedding.
 *
 * @spec 054d-hierarchical-design-extraction
 * @requirements Req 6 (Validation-Required Recommendations), Req 7 (Dual Output Format)
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  generateComponentAnalysisMarkdown,
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
      variantMapping: {
        componentName: 'Progress / Pagination',
        behavioralClassification: 'behavioral',
        recommendations: [
          {
            option: 'Option A',
            description: 'Map Property 1 to size variant',
            rationale: 'Aligns with Stemma naming convention',
            recommended: true,
            alignsWith: ['Stemma System'],
            tradeoffs: ['Requires renaming in Figma'],
          },
        ],
        conflicts: [],
        familyPattern: null,
        existingComponents: [],
      },
      componentTokens: [
        {
          primitiveToken: 'space.space050',
          usageCount: 5,
          locations: ['Track', 'Node'],
          illustrativeSuggestion: 'progress.track.spacing',
          rationale: 'Used consistently across all progress indicator instances',
        },
      ],
      modeValidation: {
        discrepancies: [
          {
            variableName: 'track-fill',
            lightValue: '#E0E0E0',
            darkValue: '#333333',
            category: 'expected',
          },
        ],
        hasUnexpectedDiscrepancies: false,
      },
      platformParity: {
        interactions: [
          {
            interaction: 'hover',
            platforms: ['web'],
            recommendation: 'Consider focus state for touch platforms',
          },
        ],
        hasConcerns: true,
      },
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
// Tests
// ---------------------------------------------------------------------------

describe('generateComponentAnalysisMarkdown', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'analysis-md-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function generate(overrides?: Partial<ComponentAnalysis>): { md: string; result: ReturnType<typeof generateComponentAnalysisMarkdown> } {
    const analysis = makeAnalysisFixture(overrides);
    const result = generateComponentAnalysisMarkdown(analysis, { outputDir: tmpDir });
    const md = fs.readFileSync(result.filePath, 'utf-8');
    return { md, result };
  }

  // --- File output ---

  it('writes Markdown file with correct filename', () => {
    const { result } = generate();
    expect(path.basename(result.filePath)).toBe('progress-pagination-analysis.md');
    expect(result.componentName).toBe('progress-pagination');
    expect(fs.existsSync(result.filePath)).toBe(true);
  });

  it('creates output directory if it does not exist', () => {
    const nested = path.join(tmpDir, 'deep', 'nested');
    const analysis = makeAnalysisFixture();
    const result = generateComponentAnalysisMarkdown(analysis, { outputDir: nested });
    expect(fs.existsSync(result.filePath)).toBe(true);
  });

  it('returns correct sizeBytes', () => {
    const { md, result } = generate();
    expect(result.sizeBytes).toBe(Buffer.byteLength(md, 'utf-8'));
  });

  // --- Required sections ---

  it('includes Classification Summary section with tier indicators', () => {
    const { md } = generate();
    expect(md).toContain('## Classification Summary');
    expect(md).toContain('✅ Semantic Identified');
    expect(md).toContain('⚠️ Primitive Identified');
    expect(md).toContain('❌ Unidentified');
  });

  it('includes correct classification counts', () => {
    const { md } = generate();
    // Table row for semantic: | ✅ Semantic Identified | 1 | 25% |
    expect(md).toMatch(/Semantic Identified \| 1/);
    expect(md).toMatch(/Primitive Identified \| 2/);
    expect(md).toMatch(/Unidentified \| 1/);
  });

  it('includes Node Tree section with indented hierarchy', () => {
    const { md } = generate();
    expect(md).toContain('## Node Tree');
    expect(md).toContain('**Progress / Pagination** (COMPONENT_SET, depth 0)');
    expect(md).toContain('**Property 1=Sm** (COMPONENT, depth 1)');
    expect(md).toContain('**Progress Indicator Primitive** (INSTANCE, depth 2)');
  });

  it('includes component properties in node tree', () => {
    const { md } = generate();
    expect(md).toContain('State=Current');
    expect(md).toContain('Show Label=false');
  });

  it('includes per-node classification counts in node tree', () => {
    const { md } = generate();
    // Root node: S:1 P:1 U:1
    expect(md).toContain('[S:1 P:1 U:1]');
    // Instance node: S:0 P:1 U:0
    expect(md).toContain('[S:0 P:1 U:0]');
  });

  it('includes Token Usage by Node section', () => {
    const { md } = generate();
    expect(md).toContain('## Token Usage by Node');
    // Semantic token with ✅
    expect(md).toContain('✅ `padding-top`');
    expect(md).toContain('semanticSpace.inset.100');
    // Primitive token with ⚠️
    expect(md).toContain('⚠️ `item-spacing`');
    expect(md).toContain('space.space050');
    // Unidentified with ❌
    expect(md).toContain('❌ `fill`');
    expect(md).toContain('no-token-match');
  });

  it('includes Composition Patterns section', () => {
    const { md } = generate();
    expect(md).toContain('## Composition Patterns');
    expect(md).toContain('Progress Indicator Primitive × 5');
    expect(md).toContain('Size: Sm');
    expect(md).toContain('State=Current');
    expect(md).toContain('× 4: State=Incomplete');
  });

  it('includes Unresolved Bindings section', () => {
    const { md } = generate();
    expect(md).toContain('## Unresolved Bindings');
    expect(md).toContain('VariableID:1224:14083');
    expect(md).toContain('Track');
    expect(md).toContain('not-in-token-values');
  });

  it('includes Recommendations section', () => {
    const { md } = generate();
    expect(md).toContain('## Recommendations');
    expect(md).toContain('### Variant Mapping');
    expect(md).toContain('### Component Token Suggestions');
    expect(md).toContain('### Mode Validation');
    expect(md).toContain('### Platform Parity');
  });

  it('includes Unidentified Values section', () => {
    const { md } = generate();
    expect(md).toContain('## Unidentified Values');
    expect(md).toContain('Progress / Pagination');
    expect(md).toContain('`fill`');
    expect(md).toContain('rgba(255, 0, 0, 1)');
  });

  it('includes Screenshots section with embedded images', () => {
    const { md } = generate();
    expect(md).toContain('## Screenshots');
    expect(md).toContain('![');
    expect(md).toContain('./images/progress-pagination-sm.png');
    expect(md).toContain('Property 1=Sm');
  });

  // --- Validation disclaimers (Req 6) ---

  it('includes validation disclaimer before every recommendation subsection', () => {
    const { md } = generate();
    const disclaimer = '⚠️ **Validation Required**';
    // Count occurrences — should appear before each of the 4 recommendation subsections
    const matches = md.match(new RegExp(disclaimer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
    expect(matches).not.toBeNull();
    expect(matches!.length).toBe(4);
  });

  it('includes domain specialist validation prompts', () => {
    const { md } = generate();
    expect(md).toContain('**Ada** (Token Specialist)');
    expect(md).toContain('**Lina** (Component Specialist)');
    expect(md).toContain('**Thurgood** (Governance)');
  });

  // --- Header metadata ---

  it('includes component metadata in header', () => {
    const { md } = generate();
    expect(md).toContain('# Component Analysis: Progress / Pagination');
    expect(md).toContain('**Component Type**: COMPONENT_SET');
    expect(md).toContain('**Figma ID**: 1:1');
    expect(md).toContain('**File Key**: abc123');
    expect(md).toContain('**Extracted**: 2026-02-22T10:00:00.000Z');
    expect(md).toContain('**Extractor Version**: 6.3.0');
  });

  it('includes variant definitions in header', () => {
    const { md } = generate();
    expect(md).toContain('**Variant Definitions**');
    expect(md).toContain('Property 1: VARIANT');
    expect(md).toContain('Sm, Md, Lg');
  });

  // --- Empty/minimal cases ---

  it('omits optional sections when data is empty', () => {
    const { md } = generate({
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
      classificationSummary: { semanticIdentified: 0, primitiveIdentified: 0, unidentified: 0 },
      variantDefinitions: undefined,
    });
    expect(md).toContain('## Classification Summary');
    expect(md).toContain('## Node Tree');
    expect(md).not.toContain('## Composition Patterns');
    expect(md).not.toContain('## Unresolved Bindings');
    expect(md).not.toContain('## Recommendations');
    expect(md).not.toContain('## Unidentified Values');
    expect(md).not.toContain('## Screenshots');
    expect(md).not.toContain('**Variant Definitions**');
  });

  it('handles zero-total classification without division error', () => {
    const { md } = generate({
      classificationSummary: { semanticIdentified: 0, primitiveIdentified: 0, unidentified: 0 },
    });
    expect(md).toContain('0%');
    expect(md).not.toContain('NaN');
  });
});
