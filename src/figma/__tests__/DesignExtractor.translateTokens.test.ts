/**
 * Tests for DesignExtractor.translateTokens() — Task 3.6
 *
 * Validates token translation orchestration: binding lookup map construction,
 * property extraction from component layout and raw design context,
 * delegation to TokenTranslator, and aggregation into TokenUsage.
 *
 * @spec 054b-figma-design-extract
 * @requirements Req 2
 */

import { DesignExtractor } from '../DesignExtractor';
import type { ExtractedComponent, TokenBinding } from '../DesignExtractor';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type { TokenTranslator, TranslationResult, TokenCategory } from '../TokenTranslator';
import type { VariantAnalyzer } from '../VariantAnalyzer';

// ---------------------------------------------------------------------------
// Mock factories
// ---------------------------------------------------------------------------

function makeMockConsoleMcp(): jest.Mocked<ConsoleMCPClient> {
  return {
    batchCreateVariables: jest.fn().mockResolvedValue(undefined),
    batchUpdateVariables: jest.fn().mockResolvedValue(undefined),
    createVariableAliases: jest.fn().mockResolvedValue(undefined),
    getVariables: jest.fn().mockResolvedValue([]),
    execute: jest.fn().mockResolvedValue(undefined),
    setupDesignTokens: jest.fn().mockResolvedValue(undefined),
    getStatus: jest.fn().mockResolvedValue({}),
    getStyles: jest.fn().mockResolvedValue([]),
    getComponent: jest.fn().mockResolvedValue({}),
    getComponentImage: jest.fn().mockResolvedValue({ imageUrl: '' }),
  };
}

function makeMockTranslator(): jest.Mocked<TokenTranslator> {
  return {
    translate: jest.fn().mockReturnValue({
      token: '',
      confidence: 'no-match',
      matchMethod: 'value',
      rawValue: '',
    } as TranslationResult),
    translateByBinding: jest.fn(),
    translateByValue: jest.fn(),
    enrichResponse: jest.fn(),
    lookupToken: jest.fn(),
  } as unknown as jest.Mocked<TokenTranslator>;
}

const stubAnalyzer = {} as VariantAnalyzer;

function makeComponent(overrides: Partial<ExtractedComponent> = {}): ExtractedComponent {
  return {
    name: 'ButtonCTA',
    description: 'A call-to-action button',
    variants: [],
    states: [],
    properties: [],
    layout: { mode: 'horizontal' },
    source: 'kiro-power',
    ...overrides,
  };
}

function makeBinding(overrides: Partial<TokenBinding> = {}): TokenBinding {
  return {
    variableName: 'space/300',
    variableId: 'var-1',
    collectionName: 'Primitives',
    resolvedType: 'FLOAT',
    valuesByMode: { 'Mode 1': 24 },
    isAlias: false,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.translateTokens', () => {

  it('returns empty TokenUsage when component has no layout or raw context', () => {
    const translator = makeMockTranslator();
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({ layout: { mode: 'none' } });

    const result = extractor.translateTokens(component, []);

    expect(result).toEqual({
      spacing: [],
      colors: [],
      typography: [],
      radius: [],
      shadows: [],
    });
    expect(translator.translate).not.toHaveBeenCalled();
  });

  it('translates layout.itemSpacing as spacing token', () => {
    const translator = makeMockTranslator();
    translator.translate.mockReturnValue({
      token: 'space.300',
      confidence: 'exact',
      matchMethod: 'value',
      rawValue: '24',
    });
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      layout: { mode: 'horizontal', itemSpacing: 24 },
    });

    const result = extractor.translateTokens(component, []);

    expect(result.spacing).toHaveLength(1);
    expect(result.spacing[0].property).toBe('item-spacing');
    expect(result.spacing[0].token).toBe('space.300');
    expect(result.spacing[0].confidence).toBe('exact');
  });

  it('translates layout.padding sides as spacing tokens', () => {
    const translator = makeMockTranslator();
    translator.translate.mockReturnValue({
      token: 'space.200',
      confidence: 'exact',
      matchMethod: 'value',
      rawValue: '16',
    });
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      layout: {
        mode: 'vertical',
        padding: { top: 16, right: 16, bottom: 16, left: 16 },
      },
    });

    const result = extractor.translateTokens(component, []);

    expect(result.spacing).toHaveLength(4);
    expect(result.spacing.map(r => r.property)).toEqual([
      'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    ]);
  });

  it('uses binding name when a matching binding is found for spacing', () => {
    const translator = makeMockTranslator();
    translator.translate.mockReturnValue({
      token: 'space.300',
      confidence: 'exact',
      matchMethod: 'binding',
      rawValue: '24',
    });
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      layout: { mode: 'horizontal', itemSpacing: 24 },
    });
    const bindings: TokenBinding[] = [
      makeBinding({ variableName: 'space/300', resolvedType: 'FLOAT', valuesByMode: { 'Mode 1': 24 } }),
    ];

    extractor.translateTokens(component, bindings);

    // translator.translate should be called with the binding name
    expect(translator.translate).toHaveBeenCalledWith('space/300', 24, 'spacing');
  });

  it('passes undefined binding when no matching binding found', () => {
    const translator = makeMockTranslator();
    translator.translate.mockReturnValue({
      token: 'space.300',
      confidence: 'exact',
      matchMethod: 'value',
      rawValue: '24',
    });
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      layout: { mode: 'horizontal', itemSpacing: 24 },
    });

    extractor.translateTokens(component, []);

    // No bindings → undefined binding name
    expect(translator.translate).toHaveBeenCalledWith(undefined, 24, 'spacing');
  });

  it('extracts colors from raw design context', () => {
    const translator = makeMockTranslator();
    translator.translate.mockReturnValue({
      token: 'color.purple.300',
      confidence: 'exact',
      matchMethod: 'value',
      rawValue: '#7C3AED',
    });
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      rawDesignContext: `
        .button {
          background-color: #7C3AED;
          color: #FFFFFF;
        }
      `,
    });

    const result = extractor.translateTokens(component, []);

    expect(result.colors).toHaveLength(2);
    expect(result.colors[0].property).toBe('background');
    expect(result.colors[1].property).toBe('color');
  });

  it('extracts typography properties from raw design context', () => {
    const translator = makeMockTranslator();
    translator.translate.mockReturnValue({
      token: 'typography.body.md',
      confidence: 'exact',
      matchMethod: 'value',
      rawValue: '16px',
    });
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      rawDesignContext: `
        .label {
          font-size: 16px;
          font-weight: 600;
          line-height: 24px;
        }
      `,
    });

    const result = extractor.translateTokens(component, []);

    expect(result.typography).toHaveLength(3);
    expect(result.typography.map(r => r.property)).toEqual([
      'font-size', 'font-weight', 'line-height',
    ]);
  });

  it('extracts border-radius from raw design context', () => {
    const translator = makeMockTranslator();
    translator.translate.mockReturnValue({
      token: 'radius.100',
      confidence: 'exact',
      matchMethod: 'value',
      rawValue: '4px',
    });
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      rawDesignContext: '.button { border-radius: 4px; }',
    });

    const result = extractor.translateTokens(component, []);

    expect(result.radius).toHaveLength(1);
    expect(result.radius[0].property).toBe('border-radius');
    expect(result.radius[0].token).toBe('radius.100');
  });

  it('extracts box-shadow from raw design context', () => {
    const translator = makeMockTranslator();
    translator.translate.mockReturnValue({
      token: 'shadow.elevation200',
      confidence: 'exact',
      matchMethod: 'value',
      rawValue: '0 2px 4px rgba(0,0,0,0.1)',
    });
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      rawDesignContext: '.card { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }',
    });

    const result = extractor.translateTokens(component, []);

    expect(result.shadows).toHaveLength(1);
    expect(result.shadows[0].property).toBe('box-shadow');
  });

  it('tracks no-match values in results', () => {
    const translator = makeMockTranslator();
    translator.translate.mockReturnValue({
      token: '',
      confidence: 'no-match',
      matchMethod: 'value',
      rawValue: '30',
      suggestion: 'space.300',
      delta: '±6px',
    });
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      layout: { mode: 'horizontal', itemSpacing: 30 },
    });

    const result = extractor.translateTokens(component, []);

    expect(result.spacing).toHaveLength(1);
    expect(result.spacing[0].confidence).toBe('no-match');
    expect(result.spacing[0].token).toBe('');
  });

  it('matches color bindings by resolved type COLOR', () => {
    const translator = makeMockTranslator();
    translator.translate.mockReturnValue({
      token: 'color.purple.300',
      confidence: 'exact',
      matchMethod: 'binding',
      rawValue: '#7C3AED',
    });
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      rawDesignContext: '.button { fill: #7C3AED; }',
    });
    const bindings: TokenBinding[] = [
      makeBinding({
        variableName: 'color/purple/300',
        resolvedType: 'COLOR',
        valuesByMode: { 'Light': '#7C3AED' },
      }),
    ];

    extractor.translateTokens(component, bindings);

    // Should find the color binding and pass its name
    expect(translator.translate).toHaveBeenCalledWith(
      'color/purple/300', '#7C3AED', 'color',
    );
  });

  it('skips alias objects in binding value matching', () => {
    const translator = makeMockTranslator();
    translator.translate.mockReturnValue({
      token: '',
      confidence: 'no-match',
      matchMethod: 'value',
      rawValue: '24',
    });
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      layout: { mode: 'horizontal', itemSpacing: 24 },
    });
    // Binding with alias object value (semantic alias) — should be skipped
    const bindings: TokenBinding[] = [
      makeBinding({
        variableName: 'space.inset',
        resolvedType: 'FLOAT',
        valuesByMode: { 'Mode 1': { aliasOf: 'space/300' } as unknown as number },
        isAlias: true,
      }),
    ];

    extractor.translateTokens(component, bindings);

    // Should not match the alias binding, so undefined binding name
    expect(translator.translate).toHaveBeenCalledWith(undefined, 24, 'spacing');
  });

  it('handles component with both layout and raw context properties', () => {
    const translator = makeMockTranslator();
    let callCount = 0;
    translator.translate.mockImplementation(
      (_binding: string | undefined, rawValue: number | string, category: TokenCategory) => {
        callCount++;
        return {
          token: `mock.token.${callCount}`,
          confidence: 'exact' as const,
          matchMethod: 'value' as const,
          rawValue: String(rawValue),
        };
      },
    );
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      layout: {
        mode: 'horizontal',
        itemSpacing: 8,
        padding: { top: 16, bottom: 16 },
      },
      rawDesignContext: `
        .button {
          background: #7C3AED;
          font-size: 14px;
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
      `,
    });

    const result = extractor.translateTokens(component, []);

    // 1 itemSpacing + 2 padding + 1 background + 1 font-size + 1 radius + 1 shadow = 7
    expect(result.spacing).toHaveLength(3);
    expect(result.colors).toHaveLength(1);
    expect(result.typography).toHaveLength(1);
    expect(result.radius).toHaveLength(1);
    expect(result.shadows).toHaveLength(1);
  });

  it('does not extract non-color values from color CSS properties', () => {
    const translator = makeMockTranslator();
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      rawDesignContext: '.button { background: url(image.png); color: inherit; }',
    });

    const result = extractor.translateTokens(component, []);

    // "url(image.png)" and "inherit" should not be treated as colors
    expect(result.colors).toHaveLength(0);
  });

  it('skips undefined padding sides', () => {
    const translator = makeMockTranslator();
    translator.translate.mockReturnValue({
      token: 'space.200',
      confidence: 'exact',
      matchMethod: 'value',
      rawValue: '16',
    });
    const extractor = new DesignExtractor(makeMockConsoleMcp(), translator, stubAnalyzer);
    const component = makeComponent({
      layout: {
        mode: 'horizontal',
        padding: { top: 16, left: 16 },
        // right and bottom are undefined
      },
    });

    const result = extractor.translateTokens(component, []);

    expect(result.spacing).toHaveLength(2);
    expect(result.spacing.map(r => r.property)).toEqual(['padding-top', 'padding-left']);
  });
});
