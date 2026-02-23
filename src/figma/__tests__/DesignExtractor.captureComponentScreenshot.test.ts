/**
 * Tests for DesignExtractor.captureComponentScreenshot() — Task 2.3
 *
 * Validates screenshot capture via figma-console-mcp: successful capture
 * with metadata, graceful failure handling, filename sanitization,
 * and variant support.
 *
 * @spec 054d-hierarchical-design-extraction
 * @requirements Req 5 (Component Screenshots)
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
  } as unknown as jest.Mocked<ConsoleMCPClient>;
}

function makeMockTranslator(): jest.Mocked<TokenTranslator> {
  return {
    translate: jest.fn(),
    translateByBinding: jest.fn(),
    translateByValue: jest.fn(),
    enrichResponse: jest.fn(),
    lookupToken: jest.fn(),
    getDtcgTokens: jest.fn().mockReturnValue({}),
    classifyTokenMatch: jest.fn(),
    toClassifiedToken: jest.fn(),
    toUnidentifiedValue: jest.fn(),
  } as unknown as jest.Mocked<TokenTranslator>;
}

function makeMockAnalyzer(): jest.Mocked<VariantAnalyzer> {
  return {
    analyzeVariants: jest.fn().mockResolvedValue(null),
  } as unknown as jest.Mocked<VariantAnalyzer>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('DesignExtractor.captureComponentScreenshot', () => {
  let consoleMcp: jest.Mocked<ConsoleMCPClient>;
  let extractor: DesignExtractor;

  beforeEach(() => {
    consoleMcp = makeMockConsoleMcp();
    extractor = new DesignExtractor(
      consoleMcp,
      makeMockTranslator(),
      makeMockAnalyzer(),
    );
    // Prevent actual HTTP downloads in tests
    jest.spyOn(extractor as any, 'downloadFile').mockResolvedValue(undefined);
  });

  it('returns ScreenshotMetadata on successful capture', async () => {
    consoleMcp.getComponentImage.mockResolvedValue({
      imageUrl: 'https://figma.com/images/abc123.png',
    });

    const result = await extractor.captureComponentScreenshot(
      'file-key', '1:1', './output', 'Progress / Pagination',
    );

    expect(result).not.toBeNull();
    expect(result!.filePath).toBe('./images/progress-pagination.png');
    expect(result!.url).toBe('https://figma.com/images/abc123.png');
    expect(result!.format).toBe('png');
    expect(result!.scale).toBe(2);
    expect(result!.capturedAt).toBeDefined();
  });

  it('calls getComponentImage with scale 2 and png format', async () => {
    consoleMcp.getComponentImage.mockResolvedValue({
      imageUrl: 'https://figma.com/images/test.png',
    });

    await extractor.captureComponentScreenshot(
      'file-key', '695:313', './output', 'Button CTA',
    );

    expect(consoleMcp.getComponentImage).toHaveBeenCalledWith(
      'file-key', '695:313', { scale: 2, format: 'png' },
    );
  });

  it('includes variant in filename and metadata when provided', async () => {
    consoleMcp.getComponentImage.mockResolvedValue({
      imageUrl: 'https://figma.com/images/variant.png',
    });

    const result = await extractor.captureComponentScreenshot(
      'file-key', '1:2', './output', 'Progress / Pagination', 'Property 1=Sm',
    );

    expect(result).not.toBeNull();
    expect(result!.filePath).toBe('./images/progress-pagination-property-1-sm.png');
    expect(result!.variant).toBe('Property 1=Sm');
  });

  it('returns null and logs warning when MCP call throws', async () => {
    consoleMcp.getComponentImage.mockRejectedValue(new Error('MCP connection failed'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const result = await extractor.captureComponentScreenshot(
      'file-key', '1:1', './output', 'Test Component',
    );

    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Screenshot capture failed for "Test Component"'),
    );
    warnSpy.mockRestore();
  });

  it('returns null and logs warning when imageUrl is empty', async () => {
    consoleMcp.getComponentImage.mockResolvedValue({ imageUrl: '' });
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const result = await extractor.captureComponentScreenshot(
      'file-key', '1:1', './output', 'Test Component',
    );

    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('returned no image URL'),
    );
    warnSpy.mockRestore();
  });

  it('sanitizes component name with special characters', async () => {
    consoleMcp.getComponentImage.mockResolvedValue({
      imageUrl: 'https://figma.com/images/test.png',
    });

    const result = await extractor.captureComponentScreenshot(
      'file-key', '1:1', './output', '  /My Component V2/  ',
    );

    expect(result).not.toBeNull();
    expect(result!.filePath).toBe('./images/my-component-v2.png');
  });

  it('produces valid ISO timestamp in capturedAt', async () => {
    consoleMcp.getComponentImage.mockResolvedValue({
      imageUrl: 'https://figma.com/images/test.png',
    });

    const result = await extractor.captureComponentScreenshot(
      'file-key', '1:1', './output', 'Test',
    );

    expect(result).not.toBeNull();
    const parsed = new Date(result!.capturedAt);
    expect(parsed.getTime()).not.toBeNaN();
  });
});
