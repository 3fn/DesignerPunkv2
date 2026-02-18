/**
 * Token Transformer Interfaces for DTCG Format Generator
 *
 * Defines the ITokenTransformer interface and supporting types for
 * tool-specific transformers that consume DTCG output and produce
 * tool-specific formats (e.g., Figma, Sketch, Adobe).
 *
 * @see Design: .kiro/specs/053-dtcg-token-format-generator/design.md
 * @requirements 8.1, 8.6
 */

import type { DTCGTokenFile } from '../types/DTCGTypes';

/**
 * Configuration for a token transformer.
 */
export interface TransformerConfig {
  /** Unique transformer identifier (e.g., 'figma', 'sketch') */
  id: string;
  /** Human-readable transformer name (e.g., 'Figma Variables') */
  name: string;
  /** Output file extension (e.g., '.figma.json') */
  outputExtension: string;
  /** Whether to include DesignerPunk extensions in output */
  includeExtensions: boolean;
}

/**
 * Result of a transformer invocation.
 */
export interface TransformResult {
  /** Transformed content as string */
  content: string;
  /** Output filename */
  filename: string;
  /** Any warnings generated during transformation */
  warnings: string[];
}

/**
 * Interface for tool-specific token transformers.
 *
 * Transformers consume DTCG-compliant token files and produce
 * tool-specific output formats. Implement this interface to add
 * support for new design tools (e.g., FigmaTransformer in Spec 054).
 */
export interface ITokenTransformer {
  /** Transformer configuration */
  readonly config: TransformerConfig;

  /** Transform DTCG tokens to target format */
  transform(dtcgTokens: DTCGTokenFile): TransformResult;

  /** Validate that the transformer can handle the given input */
  canTransform(dtcgTokens: DTCGTokenFile): boolean;
}
