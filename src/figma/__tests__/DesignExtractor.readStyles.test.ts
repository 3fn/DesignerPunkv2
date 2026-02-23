/**
 * Tests for DesignExtractor.readStyles() — Task 3.4
 *
 * Validates style reading via figma-console-mcp, mapping to FigmaStyle[],
 * and separation of effect styles (shadows) from text styles (typography).
 *
 * @spec 054b-figma-design-extract
 * @requirements Req 3 (Composite Token Reconstruction)
 */

import { DesignExtractor } from '../DesignExtractor';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type { TokenTranslator } from '../TokenTranslator';
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

const stubTranslator = {} as TokenTranslator;
const stubAnalyzer = {} as VariantAnalyzer;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.readStyles', () => {
  const FILE_KEY = 'test-file-key';

  it('returns empty array when getStyles returns empty', async () => {
    const mcp = makeMockConsoleMcp();
    mcp.getStyles.mockResolvedValue([]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    const result = await extractor.readStyles(FILE_KEY);

    expect(result).toEqual([]);
    expect(mcp.getStyles).toHaveBeenCalledWith(FILE_KEY);
  });

  it('maps effect styles (shadows) correctly', async () => {
    const mcp = makeMockConsoleMcp();
    mcp.getStyles.mockResolvedValue([
      {
        name: 'shadow.elevation200',
        type: 'EFFECT',
        properties: {
          effects: [
            { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 4 }, radius: 8 },
          ],
        },
      },
    ]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    const result = await extractor.readStyles(FILE_KEY);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'shadow.elevation200',
      type: 'EFFECT',
      properties: {
        effects: [
          { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.1 }, offset: { x: 0, y: 4 }, radius: 8 },
        ],
      },
    });
  });

  it('maps text styles (typography) correctly', async () => {
    const mcp = makeMockConsoleMcp();
    mcp.getStyles.mockResolvedValue([
      {
        name: 'typography.heading200',
        type: 'TEXT',
        properties: {
          fontFamily: 'Inter',
          fontSize: 24,
          fontWeight: 700,
          lineHeight: { value: 32, unit: 'PIXELS' },
          letterSpacing: { value: -0.02, unit: 'PERCENT' },
        },
      },
    ]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    const result = await extractor.readStyles(FILE_KEY);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      name: 'typography.heading200',
      type: 'TEXT',
      properties: {
        fontFamily: 'Inter',
        fontSize: 24,
        fontWeight: 700,
        lineHeight: { value: 32, unit: 'PIXELS' },
        letterSpacing: { value: -0.02, unit: 'PERCENT' },
      },
    });
  });

  it('separates effect and text styles in mixed results', async () => {
    const mcp = makeMockConsoleMcp();
    mcp.getStyles.mockResolvedValue([
      {
        name: 'shadow.elevation100',
        type: 'EFFECT',
        properties: { effects: [{ type: 'DROP_SHADOW', radius: 4 }] },
      },
      {
        name: 'typography.body100',
        type: 'TEXT',
        properties: { fontFamily: 'Inter', fontSize: 14 },
      },
      {
        name: 'shadow.elevation300',
        type: 'EFFECT',
        properties: { effects: [{ type: 'DROP_SHADOW', radius: 16 }] },
      },
      {
        name: 'typography.heading100',
        type: 'TEXT',
        properties: { fontFamily: 'Inter', fontSize: 20, fontWeight: 600 },
      },
    ]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    const result = await extractor.readStyles(FILE_KEY);

    expect(result).toHaveLength(4);

    const effectStyles = result.filter((s) => s.type === 'EFFECT');
    const textStyles = result.filter((s) => s.type === 'TEXT');

    expect(effectStyles).toHaveLength(2);
    expect(effectStyles[0].name).toBe('shadow.elevation100');
    expect(effectStyles[1].name).toBe('shadow.elevation300');

    expect(textStyles).toHaveLength(2);
    expect(textStyles[0].name).toBe('typography.body100');
    expect(textStyles[1].name).toBe('typography.heading100');
  });

  it('preserves all properties from MCP response', async () => {
    const mcp = makeMockConsoleMcp();
    const complexProperties = {
      effects: [
        {
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.08 },
          offset: { x: 0, y: 2 },
          radius: 4,
          spread: 0,
          visible: true,
          blendMode: 'NORMAL',
        },
        {
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.04 },
          offset: { x: 0, y: 8 },
          radius: 16,
          spread: 0,
          visible: true,
          blendMode: 'NORMAL',
        },
      ],
    };
    mcp.getStyles.mockResolvedValue([
      { name: 'shadow.elevation200', type: 'EFFECT', properties: complexProperties },
    ]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    const result = await extractor.readStyles(FILE_KEY);

    expect(result[0].properties).toEqual(complexProperties);
  });

  it('passes the correct file key to consoleMcp.getStyles', async () => {
    const mcp = makeMockConsoleMcp();
    mcp.getStyles.mockResolvedValue([]);
    const extractor = new DesignExtractor(mcp, stubTranslator, stubAnalyzer);

    await extractor.readStyles('my-specific-file-key');

    expect(mcp.getStyles).toHaveBeenCalledTimes(1);
    expect(mcp.getStyles).toHaveBeenCalledWith('my-specific-file-key');
  });
});
