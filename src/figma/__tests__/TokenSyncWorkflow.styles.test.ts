/**
 * TokenSyncWorkflow — Style Sync Tests
 *
 * Tests for syncStyles(), createStyle(), updateStyle(), and Plugin API
 * code generation for effect and text styles.
 *
 * @requirements Req 4 (Token Sync Workflow)
 */

import { TokenSyncWorkflow } from '../TokenSyncWorkflow';
import type { StyleSyncResult } from '../TokenSyncWorkflow';
import type { ConsoleMCPClient } from '../ConsoleMCPClient';
import type {
  FigmaStyleDefinition,
  EffectStyleProperties,
  TextStyleProperties,
} from '../../generators/transformers/FigmaTransformer';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeMockMcp(): jest.Mocked<ConsoleMCPClient> {
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

function makeEffectStyle(name: string): FigmaStyleDefinition {
  return {
    type: 'EFFECT',
    name,
    properties: {
      effects: [
        {
          type: 'DROP_SHADOW',
          offset: { x: 0, y: 4 },
          radius: 12,
          spread: 0,
          color: { r: 0, g: 0, b: 0, a: 0.3 },
        },
      ],
    } as EffectStyleProperties,
    description: `Source: ${name}`,
  };
}

function makeTextStyle(name: string): FigmaStyleDefinition {
  return {
    type: 'TEXT',
    name,
    properties: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 24,
      letterSpacing: 0,
    } as TextStyleProperties,
    description: `Source: ${name}`,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('TokenSyncWorkflow — Style Sync', () => {
  let mockMcp: jest.Mocked<ConsoleMCPClient>;
  let workflow: TokenSyncWorkflow;

  beforeEach(() => {
    mockMcp = makeMockMcp();
    workflow = new TokenSyncWorkflow(mockMcp, 'test-file-key');
  });

  // -------------------------------------------------------------------------
  // syncStyles
  // -------------------------------------------------------------------------

  describe('syncStyles', () => {
    it('creates styles that do not exist in Figma', async () => {
      const styles = [makeEffectStyle('shadow.container')];
      const result = await workflow.syncStyles(styles);

      expect(result.created).toBe(1);
      expect(result.updated).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(mockMcp.execute).toHaveBeenCalledTimes(1);
    });

    it('updates styles that already exist in Figma', async () => {
      const styles = [makeEffectStyle('shadow.container')];
      const existing = new Set(['shadow.container']);
      const result = await workflow.syncStyles(styles, existing);

      expect(result.created).toBe(0);
      expect(result.updated).toBe(1);
      expect(result.errors).toHaveLength(0);
    });

    it('handles mix of create and update', async () => {
      const styles = [
        makeEffectStyle('shadow.container'),
        makeTextStyle('typography.heading200'),
      ];
      const existing = new Set(['shadow.container']);
      const result = await workflow.syncStyles(styles, existing);

      expect(result.created).toBe(1);
      expect(result.updated).toBe(1);
      expect(result.errors).toHaveLength(0);
      expect(mockMcp.execute).toHaveBeenCalledTimes(2);
    });

    it('continues on individual style failure and collects errors', async () => {
      const styles = [
        makeEffectStyle('shadow.container'),
        makeTextStyle('typography.heading200'),
      ];
      mockMcp.execute
        .mockRejectedValueOnce(new Error('Plugin API timeout'))
        .mockResolvedValueOnce(undefined);

      const result = await workflow.syncStyles(styles);

      expect(result.created).toBe(1); // second style succeeded
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].phase).toBe('styles');
      expect(result.errors[0].message).toContain('shadow.container');
      expect(result.errors[0].message).toContain('Plugin API timeout');
    });

    it('handles empty style list', async () => {
      const result = await workflow.syncStyles([]);

      expect(result.created).toBe(0);
      expect(result.updated).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(mockMcp.execute).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Plugin API code generation — Effect styles
  // -------------------------------------------------------------------------

  describe('generateStylePluginCode — effect styles', () => {
    it('generates create code for effect style', () => {
      const style = makeEffectStyle('shadow.container');
      const code = workflow.generateStylePluginCode(style, 'create');

      expect(code).toContain('figma.createEffectStyle()');
      expect(code).toContain('"shadow.container"');
      expect(code).toContain('DROP_SHADOW');
      expect(code).toContain('"Source: shadow.container"');
    });

    it('generates update code for effect style', () => {
      const style = makeEffectStyle('shadow.elevation200');
      const code = workflow.generateStylePluginCode(style, 'update');

      expect(code).toContain('figma.getLocalEffectStyles()');
      expect(code).toContain('"shadow.elevation200"');
      expect(code).not.toContain('figma.createEffectStyle()');
    });

    it('includes spread value in effect code', () => {
      const style: FigmaStyleDefinition = {
        type: 'EFFECT',
        name: 'shadow.test',
        properties: {
          effects: [{
            type: 'DROP_SHADOW',
            offset: { x: 2, y: 8 },
            radius: 24,
            spread: 4,
            color: { r: 0, g: 0, b: 0, a: 0.2 },
          }],
        } as EffectStyleProperties,
      };
      const code = workflow.generateStylePluginCode(style, 'create');

      expect(code).toContain('"spread":4');
    });
  });

  // -------------------------------------------------------------------------
  // Plugin API code generation — Text styles
  // -------------------------------------------------------------------------

  describe('generateStylePluginCode — text styles', () => {
    it('generates create code for text style', () => {
      const style = makeTextStyle('typography.heading200');
      const code = workflow.generateStylePluginCode(style, 'create');

      expect(code).toContain('figma.createTextStyle()');
      expect(code).toContain('"typography.heading200"');
      expect(code).toContain('"Inter"');
      expect(code).toContain('loadFontAsync');
    });

    it('generates update code for text style', () => {
      const style = makeTextStyle('typography.bodySm');
      const code = workflow.generateStylePluginCode(style, 'update');

      expect(code).toContain('figma.getLocalTextStyles()');
      expect(code).toContain('"typography.bodySm"');
      expect(code).not.toContain('figma.createTextStyle()');
    });

    it('maps font weight 700 to Bold style', () => {
      const style: FigmaStyleDefinition = {
        type: 'TEXT',
        name: 'typography.heading',
        properties: {
          fontFamily: 'Inter',
          fontSize: 24,
          fontWeight: 700,
          lineHeight: 32,
          letterSpacing: -0.5,
        } as TextStyleProperties,
      };
      const code = workflow.generateStylePluginCode(style, 'create');

      expect(code).toContain('"Bold"');
    });

    it('includes description in text style code', () => {
      const style = makeTextStyle('typography.heading200');
      const code = workflow.generateStylePluginCode(style, 'create');

      expect(code).toContain('style.description');
      expect(code).toContain('"Source: typography.heading200"');
    });
  });
});
