/**
 * Transformer Architecture — Public API
 *
 * Barrel export for the DTCG transformer system. Downstream specs
 * (e.g., Spec 054 Figma Transformer) should import from this index:
 *
 * ```typescript
 * import {
 *   ITokenTransformer,
 *   TransformerConfig,
 *   TransformResult,
 *   TransformerRegistry,
 *   transformerRegistry,
 * } from '../generators/transformers';
 * ```
 *
 * Usage pattern for implementing a new transformer:
 *
 * ```typescript
 * import { ITokenTransformer, transformerRegistry } from '../generators/transformers';
 * import type { DTCGTokenFile } from '../generators/types/DTCGTypes';
 *
 * class FigmaTransformer implements ITokenTransformer {
 *   readonly config = { id: 'figma', name: 'Figma Variables', outputExtension: '.figma.json', includeExtensions: false };
 *   transform(dtcgTokens: DTCGTokenFile) { return { content: '{}', filename: 'DesignTokens.figma.json', warnings: [] }; }
 *   canTransform() { return true; }
 * }
 *
 * transformerRegistry.register(new FigmaTransformer());
 * ```
 *
 * @see Design: .kiro/specs/053-dtcg-token-format-generator/design.md
 * @requirements 8.1-8.6
 */

// Interfaces and types
export type { ITokenTransformer, TransformerConfig, TransformResult } from './ITokenTransformer';

// Registry class and singleton
export { TransformerRegistry, transformerRegistry } from './TransformerRegistry';

// Transformer implementations
export { FigmaTransformer } from './FigmaTransformer';
export type {
  FigmaVariable,
  FigmaVariableType,
  FigmaVariableCollection,
  FigmaStyleDefinition,
  FigmaTokenFile,
  EffectStyleProperties,
  TextStyleProperties,
} from './FigmaTransformer';
