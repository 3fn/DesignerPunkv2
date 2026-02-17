/**
 * DTCG (Design Tokens Community Group) Format Module 2025.10 TypeScript Types
 *
 * These types represent the DTCG token format structure used for
 * exporting DesignerPunk Rosetta tokens to industry-standard design tools.
 *
 * @see https://tr.designtokens.org/format/
 * @requirements 1.1, 1.2, 4.1-4.8
 */

/**
 * DTCG token types as defined in the Format Module 2025.10 specification.
 */
export type DTCGType =
  | 'color'
  | 'dimension'
  | 'fontFamily'
  | 'fontWeight'
  | 'duration'
  | 'cubicBezier'
  | 'number'
  | 'shadow'
  | 'typography'
  | 'transition';

/**
 * DesignerPunk-specific extension metadata preserved in DTCG output.
 * Captures mathematical relationships, governance rules, and platform behavior.
 */
export interface DesignerPunkExtensions {
  /** Mathematical formula (e.g., "base × 2 = 8 × 2 = 16") */
  formula?: string;
  /** Token family (e.g., "spacing", "color") */
  family?: string;
  /** Base value for mathematical relationships */
  baseValue?: number;
  /** Blend operation type */
  blendType?: 'darkerBlend' | 'lighterBlend' | 'contrastBlend';
  /** Glow type (for glow tokens) */
  glowType?: 'emission';
  /** Platform-specific capability flags */
  platforms?: {
    web?: { supported: boolean; note?: string };
    ios?: { supported: boolean; note?: string };
    android?: { supported: boolean; note?: string; elevation?: number };
  };
  /** Deprecation metadata */
  deprecated?: boolean;
  deprecatedReason?: string;
  deprecatedSince?: string;
  /** Partial support status */
  status?: 'partial';
  /** Primitive token references (for composite tokens) */
  primitiveRefs?: Record<string, string>;
}


/**
 * A single DTCG token with value, type, description, and optional extensions.
 */
export interface DTCGToken {
  $value: unknown;
  $type?: DTCGType;
  $description?: string;
  $extensions?: {
    designerpunk?: DesignerPunkExtensions;
  };
}

/**
 * A DTCG token group — recursive structure containing tokens and nested groups.
 * Groups can declare a shared $type for all contained tokens.
 */
export interface DTCGGroup {
  $type?: DTCGType;
  $description?: string;
  [key: string]: DTCGToken | DTCGGroup | string | undefined;
}

/**
 * Root-level DTCG token file structure.
 * Represents the complete output conforming to DTCG Format Module 2025.10.
 */
export interface DTCGTokenFile {
  $schema: string;
  $extensions?: {
    designerpunk?: {
      version: string;
      generatedAt: string;
      rosettaVersion: string;
    };
  };
  [key: string]: DTCGGroup | string | object | undefined;
}
