/**
 * TransformerRegistry — Registry pattern for managing and invoking token transformers.
 *
 * Provides centralized management of ITokenTransformer instances,
 * enabling tool-specific DTCG output transformations (e.g., Figma, Sketch, Adobe).
 *
 * @see Design: .kiro/specs/053-dtcg-token-format-generator/design.md
 * @requirements 8.2-8.5
 */

import type { DTCGTokenFile } from '../types/DTCGTypes';
import type { ITokenTransformer, TransformResult } from './ITokenTransformer';
import { FigmaTransformer } from './FigmaTransformer';

/**
 * Registry for managing and invoking token transformers.
 *
 * Transformers are registered by their config.id and can be invoked
 * individually or collectively to produce tool-specific outputs.
 */
export class TransformerRegistry {
  private transformers: Map<string, ITokenTransformer> = new Map();

  /** Register a transformer by its config.id */
  register(transformer: ITokenTransformer): void {
    this.transformers.set(transformer.config.id, transformer);
  }

  /** Get a transformer by ID */
  get(id: string): ITokenTransformer | undefined {
    return this.transformers.get(id);
  }

  /** Get all registered transformers */
  getAll(): ITokenTransformer[] {
    return Array.from(this.transformers.values());
  }

  /** Transform DTCG tokens using the specified transformer */
  transform(id: string, dtcgTokens: DTCGTokenFile): TransformResult {
    const transformer = this.get(id);
    if (!transformer) {
      throw new Error(`Transformer not found: ${id}`);
    }
    if (!transformer.canTransform(dtcgTokens)) {
      throw new Error(`Transformer ${id} cannot handle input`);
    }
    return transformer.transform(dtcgTokens);
  }

  /** Transform DTCG tokens using all registered transformers that can handle the input */
  transformAll(dtcgTokens: DTCGTokenFile): TransformResult[] {
    return this.getAll()
      .filter((t) => t.canTransform(dtcgTokens))
      .map((t) => t.transform(dtcgTokens));
  }
}

/** Singleton registry instance for application-wide transformer management */
export const transformerRegistry = new TransformerRegistry();

// Auto-register built-in transformers
transformerRegistry.register(new FigmaTransformer());
