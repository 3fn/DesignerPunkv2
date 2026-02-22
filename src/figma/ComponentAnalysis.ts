/**
 * ComponentAnalysis — Descriptive artifact interfaces for the Figma
 * design extraction pipeline.
 *
 * Replaces the flat design-outline output with hierarchical node tree
 * data, three-tier token classification, composition patterns, and
 * validation-required recommendations.
 *
 * @see Design: .kiro/specs/054d-hierarchical-design-extraction/design.md
 * @requirements Req 2 (Hierarchical Node Tree Preservation)
 * @spec 054d-hierarchical-design-extraction
 */

import type {
  ConfidenceLevel,
  MatchMethod,
  ModeValidationResult,
  ComponentTokenDecision,
  PlatformParityCheck,
} from './DesignExtractor';
import type { VariantMapping } from './VariantAnalyzer';

// ---------------------------------------------------------------------------
// Three-Tier Classification
// ---------------------------------------------------------------------------

/** Classification tier for an extracted token value. */
export type ClassificationTier = 'semantic' | 'primitive' | 'unidentified';

/**
 * A token value that was successfully matched (semantic or primitive tier).
 */
export interface ClassifiedToken {
  /** CSS property or Figma property name (e.g. 'padding-top', 'fill'). */
  property: string;
  /** Semantic token path, if resolved (e.g. 'semanticSpace.inset.075'). */
  semanticToken?: string;
  /** Primitive token path (e.g. 'space.space075'). */
  primitiveToken: string;
  /** Original Figma value. */
  rawValue: unknown;
  /** How the match was found. */
  matchMethod: MatchMethod;
  /** Match confidence (exact or approximate). */
  confidence: Extract<ConfidenceLevel, 'exact' | 'approximate'>;
  /** Delta from matched token value for approximate matches (e.g. '+1px'). */
  delta?: string;
}

/** Reason an extracted value could not be matched to a token. */
export type UnidentifiedReason =
  | 'no-token-match'
  | 'unresolved-binding'
  | 'out-of-tolerance';

/**
 * A value extracted from Figma that could not be matched to any token.
 */
export interface UnidentifiedValue {
  /** CSS property or Figma property name. */
  property: string;
  /** Original Figma value. */
  rawValue: unknown;
  /** Why the value could not be matched. */
  reason: UnidentifiedReason;
  /** Closest token match if one was found outside tolerance. */
  closestMatch?: {
    token: string;
    delta: string;
  };
  /** Bound variable ID if this was a binding that couldn't resolve. */
  boundVariableId?: string;
}

// ---------------------------------------------------------------------------
// Hierarchical Node Tree
// ---------------------------------------------------------------------------

/** Figma node types relevant to component analysis. */
export type FigmaNodeType =
  | 'COMPONENT_SET'
  | 'COMPONENT'
  | 'INSTANCE'
  | 'FRAME'
  | 'TEXT';

/**
 * A node in the hierarchical Figma tree with per-node token classifications.
 *
 * Preserves parent-child relationships so token matches retain their
 * originating node context rather than being flattened.
 */
export interface NodeWithClassifications {
  /** Figma node ID. */
  id: string;
  /** Node name in Figma. */
  name: string;
  /** Figma node type. */
  type: FigmaNodeType;
  /** Depth in the node tree (root = 0). */
  depth: number;
  /** Ancestor node types from root to parent. */
  ancestorChain: string[];

  /** Layout properties extracted from this node. */
  layout?: {
    layoutMode?: 'HORIZONTAL' | 'VERTICAL' | 'NONE';
    padding?: { top: number; right: number; bottom: number; left: number };
    itemSpacing?: number;
    counterAxisSpacing?: number;
    cornerRadius?: number;
  };

  /** Component properties for INSTANCE nodes. */
  componentProperties?: Record<string, {
    type: 'VARIANT' | 'BOOLEAN' | 'TEXT' | 'INSTANCE_SWAP';
    value: unknown;
  }>;

  /** Token classifications for values extracted from this node. */
  tokenClassifications: {
    semanticIdentified: ClassifiedToken[];
    primitiveIdentified: ClassifiedToken[];
    unidentified: UnidentifiedValue[];
  };

  /** Child nodes. */
  children: NodeWithClassifications[];
}

// ---------------------------------------------------------------------------
// Composition Patterns
// ---------------------------------------------------------------------------

/**
 * A detected pattern of repeated child component instances.
 */
export interface CompositionPattern {
  /** Component name shared by grouped instances. */
  componentName: string;
  /** Number of instances in this group. */
  count: number;
  /** Properties shared across all instances in the group. */
  sharedProperties: Record<string, unknown>;
  /** Distinct property value combinations within the group. */
  propertyVariations: Array<{
    properties: Record<string, unknown>;
    count: number;
  }>;
  /** Depth level in the node tree where this pattern appears. */
  depth: number;
}

// ---------------------------------------------------------------------------
// Bound Variable Resolution
// ---------------------------------------------------------------------------

/** Reason a bound variable could not be resolved. */
export type UnresolvedBindingReason =
  | 'not-in-token-values'
  | 'api-resolution-failed';

/**
 * A Figma bound variable that could not be resolved to a known token.
 */
export interface UnresolvedBinding {
  /** Figma variable ID (e.g. 'VariableID:1224:14083'). */
  variableId: string;
  /** Property where the binding was found (e.g. 'fill'). */
  property: string;
  /** Figma node ID where the binding was found. */
  nodeId: string;
  /** Name of the node where the binding was found. */
  nodeName: string;
  /** Ancestor chain of the node for context. */
  ancestorChain: string[];
  /** Why the binding could not be resolved. */
  reason: UnresolvedBindingReason;
}

// ---------------------------------------------------------------------------
// Screenshots
// ---------------------------------------------------------------------------

/**
 * Metadata for a captured component screenshot.
 */
export interface ScreenshotMetadata {
  /** Relative file path to the screenshot image. */
  filePath: string;
  /** Figma-provided URL (expires after ~30 days). */
  url?: string;
  /** Image format. */
  format: 'png' | 'jpg' | 'svg';
  /** Render scale factor. */
  scale: number;
  /** Variant identifier if screenshot is variant-specific. */
  variant?: string;
  /** ISO timestamp of when the screenshot was captured. */
  capturedAt: string;
}

// ---------------------------------------------------------------------------
// Component Analysis (top-level artifact)
// ---------------------------------------------------------------------------

/**
 * Complete component analysis artifact produced by the extraction pipeline.
 *
 * Captures the full hierarchical node tree from Figma with three-tier
 * token classification, composition patterns, and validation-required
 * recommendations. Output as JSON (authoritative) and Markdown (readable).
 */
export interface ComponentAnalysis {
  /** Component name from Figma. */
  componentName: string;
  /** Figma node type of the root component. */
  componentType: 'COMPONENT_SET' | 'COMPONENT' | 'INSTANCE';
  /** Figma node ID. */
  figmaId: string;
  /** Figma file key. */
  fileKey: string;

  /** Variant definitions from componentPropertyDefinitions. */
  variantDefinitions?: Record<string, {
    type: 'VARIANT' | 'BOOLEAN' | 'TEXT' | 'INSTANCE_SWAP';
    defaultValue: unknown;
    variantOptions?: string[];
  }>;

  /** Root of the hierarchical node tree with per-node classifications. */
  nodeTree: NodeWithClassifications;

  /** Aggregate classification counts across all nodes. */
  classificationSummary: {
    semanticIdentified: number;
    primitiveIdentified: number;
    unidentified: number;
  };

  /** Detected patterns of repeated child instances. */
  compositionPatterns: CompositionPattern[];

  /** Bound variables that could not be resolved to tokens. */
  unresolvedBindings: UnresolvedBinding[];

  /** Recommendations requiring domain specialist review. */
  recommendations: {
    variantMapping?: VariantMapping;
    componentTokens?: ComponentTokenDecision[];
    modeValidation?: ModeValidationResult;
    platformParity?: PlatformParityCheck;
  };

  /** Captured component screenshots. */
  screenshots: ScreenshotMetadata[];

  /** ISO timestamp of extraction. */
  extractedAt: string;
  /** Version of the extractor that produced this analysis. */
  extractorVersion: string;
}