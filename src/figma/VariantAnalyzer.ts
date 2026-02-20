/**
 * VariantAnalyzer — Analyzes Figma variants with context-aware recommendations.
 *
 * Queries Component-Family docs and Component-Readiness-Status via
 * DesignerPunk MCP, analyzes behavioral vs styling differences, and
 * generates mapping recommendations with conflict detection.
 *
 * @see Design: .kiro/specs/054b-figma-design-extract/design.md
 * @requirements Req 4 (Variant Analysis)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Minimal Figma variant representation for analysis. */
export interface FigmaVariant {
  name: string;
  properties: Record<string, string>;
  /** Whether this variant has interactive behavior (onClick, onHover, etc.). */
  hasInteraction?: boolean;
  /** Visual-only property keys (colors, sizes, spacing). */
  visualProperties?: string[];
}

/** Minimal Figma component representation used by the analyzer. */
export interface FigmaComponent {
  name: string;
  description?: string;
  variants: FigmaVariant[];
  states?: string[];
}

/** Pattern extracted from a Component-Family steering doc. */
export interface FamilyPattern {
  familyName: string;
  inheritancePattern: string;
  behavioralContracts: string[];
  tokenUsagePatterns: string[];
  /** Raw doc content for additional context. */
  rawContent?: string;
}

/** Status of an existing component in the design system. */
export interface ComponentStatus {
  name: string;
  status: 'implemented' | 'planned' | 'deprecated' | 'unknown';
  platform?: string;
  path?: string;
}

/** Context gathered from DesignerPunk MCP for extraction. */
export interface ExtractionContext {
  familyPattern: FamilyPattern | null;
  existingComponents: ComponentStatus[];
}

/** A single mapping recommendation (Option A or Option B). */
export interface MappingRecommendation {
  option: string;
  description: string;
  rationale: string;
  recommended: boolean;
  alignsWith: string[];
  tradeoffs: string[];
}

/** A conflict between family-pattern and behavioral-analysis recommendations. */
export interface MappingConflict {
  familyRecommendation: string;
  behavioralRecommendation: string;
  explanation: string;
}

/** Complete variant analysis result. */
export interface VariantMapping {
  componentName: string;
  behavioralClassification: 'behavioral' | 'styling';
  recommendations: MappingRecommendation[];
  conflicts: MappingConflict[];
  familyPattern: FamilyPattern | null;
  existingComponents: ComponentStatus[];
}

// ---------------------------------------------------------------------------
// MCP client interface (minimal contract for doc queries)
// ---------------------------------------------------------------------------

/**
 * Minimal MCP client interface for querying DesignerPunk documentation.
 *
 * Concrete implementations will call the DesignerPunk MCP server's
 * `get_document_full` and `get_section` tools.
 */
export interface MCPDocClient {
  getDocumentFull(path: string): Promise<string | null>;
  getSection(path: string, heading: string): Promise<string | null>;
}

// ---------------------------------------------------------------------------
// VariantAnalyzer
// ---------------------------------------------------------------------------

export class VariantAnalyzer {
  constructor(private readonly mcp: MCPDocClient) {}

  /**
   * Analyze a Figma component's variants and produce mapping recommendations.
   *
   * Orchestrates family-pattern lookup, existing-component lookup,
   * behavioral analysis, recommendation generation, and conflict detection.
   */
  async analyzeVariants(
    _component: FigmaComponent,
    _context: ExtractionContext,
  ): Promise<VariantMapping> {
    // Implemented in subsequent tasks (2.2 – 2.7)
    throw new Error('Not yet implemented');
  }
}
