/**
 * TransformerRegistry Unit Tests
 *
 * @requirements 8.2-8.5
 */

import { TransformerRegistry, transformerRegistry } from '../transformers/TransformerRegistry';
import type { ITokenTransformer, TransformResult } from '../transformers/ITokenTransformer';
import type { DTCGTokenFile } from '../types/DTCGTypes';

/** Minimal DTCG token file for testing */
const mockDTCGFile: DTCGTokenFile = {
  $schema: 'https://tr.designtokens.org/format/',
};

/** Helper: create a stub transformer */
function createStubTransformer(
  id: string,
  canHandle = true
): ITokenTransformer {
  return {
    config: {
      id,
      name: `${id} Transformer`,
      outputExtension: `.${id}.json`,
      includeExtensions: false,
    },
    transform: (_dtcgTokens: DTCGTokenFile): TransformResult => ({
      content: `{"format":"${id}"}`,
      filename: `DesignTokens.${id}.json`,
      warnings: [],
    }),
    canTransform: () => canHandle,
  };
}

describe('TransformerRegistry', () => {
  let registry: TransformerRegistry;

  beforeEach(() => {
    registry = new TransformerRegistry();
  });

  it('registers and retrieves a transformer by id', () => {
    const transformer = createStubTransformer('figma');
    registry.register(transformer);
    expect(registry.get('figma')).toBe(transformer);
  });

  it('returns undefined for unregistered id', () => {
    expect(registry.get('nonexistent')).toBeUndefined();
  });

  it('returns all registered transformers', () => {
    registry.register(createStubTransformer('figma'));
    registry.register(createStubTransformer('sketch'));
    expect(registry.getAll()).toHaveLength(2);
  });

  it('overwrites transformer when registering same id', () => {
    const first = createStubTransformer('figma');
    const second = createStubTransformer('figma');
    registry.register(first);
    registry.register(second);
    expect(registry.get('figma')).toBe(second);
    expect(registry.getAll()).toHaveLength(1);
  });

  it('transforms using specified transformer id', () => {
    registry.register(createStubTransformer('figma'));
    const result = registry.transform('figma', mockDTCGFile);
    expect(result.content).toBe('{"format":"figma"}');
    expect(result.filename).toBe('DesignTokens.figma.json');
  });

  it('throws when transforming with unknown id', () => {
    expect(() => registry.transform('unknown', mockDTCGFile)).toThrow(
      'Transformer not found: unknown'
    );
  });

  it('throws when transformer cannot handle input', () => {
    registry.register(createStubTransformer('broken', false));
    expect(() => registry.transform('broken', mockDTCGFile)).toThrow(
      'Transformer broken cannot handle input'
    );
  });

  it('transformAll invokes all compatible transformers', () => {
    registry.register(createStubTransformer('figma'));
    registry.register(createStubTransformer('sketch'));
    registry.register(createStubTransformer('incompatible', false));
    const results = registry.transformAll(mockDTCGFile);
    expect(results).toHaveLength(2);
    expect(results.map((r) => r.filename)).toEqual(
      expect.arrayContaining([
        'DesignTokens.figma.json',
        'DesignTokens.sketch.json',
      ])
    );
  });

  it('transformAll returns empty array when no transformers registered', () => {
    expect(registry.transformAll(mockDTCGFile)).toEqual([]);
  });

  it('exports a singleton instance', () => {
    expect(transformerRegistry).toBeInstanceOf(TransformerRegistry);
  });

  it('singleton has FigmaTransformer registered and invocable', () => {
    const figma = transformerRegistry.get('figma');
    expect(figma).toBeDefined();
    expect(figma!.config.id).toBe('figma');
    expect(figma!.config.name).toBe('Figma Variables and Styles');
    expect(figma!.canTransform(mockDTCGFile)).toBe(true);
  });
});
