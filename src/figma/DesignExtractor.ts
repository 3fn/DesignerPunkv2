/**
 * DesignExtractor — Reads Figma designs via dual-MCP strategy and generates
 * design-outline.md documents with confidence flags.
 *
 * Uses Kiro Figma Power for rich design context and figma-console-mcp for
 * variable/style data. Orchestrates TokenTranslator for value matching and
 * VariantAnalyzer for context-aware recommendations.
 *
 * @see Design: .kiro/specs/054b-figma-design-extract/design.md
 * @requirements Req 1 (DesignExtractor Implementation)
 * @spec 054b-figma-design-extract
 */

import type { ConsoleMCPClient } from './ConsoleMCPClient';
import type { TokenTranslator, TranslationResult, TokenCategory } from './TokenTranslator';
import type { VariantAnalyzer, ExtractionContext, VariantMapping, MCPDocClient } from './VariantAnalyzer';
import type { DTCGTokenFile } from '../generators/types/DTCGTypes';

// ---------------------------------------------------------------------------
// Kiro Figma Power Client Interface
// ---------------------------------------------------------------------------

/**
 * Response from Kiro Figma Power `get_design_context` tool.
 *
 * Contains generated code and asset download URLs. The code string
 * is parsed to extract component structure, layout, and visual properties.
 */
export interface DesignContextResponse {
  /** Generated code string (HTML/CSS/TS) describing the component. */
  code?: string;
  /** Asset download URLs referenced in the code. */
  assets?: Record<string, string>;
  /** Raw response metadata. */
  [key: string]: unknown;
}

/**
 * Response from Kiro Figma Power `get_metadata` tool.
 *
 * XML-formatted metadata containing node IDs, layer types, names,
 * positions, and sizes for structural overview.
 */
export interface MetadataResponse {
  /** XML string describing the node tree structure. */
  xml?: string;
  /** Raw response metadata. */
  [key: string]: unknown;
}

/**
 * Response from figma-console-mcp `figma_get_component` tool.
 *
 * Contains component reconstruction spec with variants, properties,
 * and structure information.
 */
export interface FigmaComponentResponse {
  /** Component name. */
  name?: string;
  /** Component description. */
  description?: string;
  /** Component key. */
  key?: string;
  /** Variant properties and their options. */
  variantProperties?: Record<string, string[]>;
  /** Raw component data. */
  [key: string]: unknown;
}

/**
 * Client interface for Kiro Figma Power MCP operations.
 *
 * Provides design context and metadata queries for rich component
 * structure extraction. Abstracted for testability.
 */
export interface KiroFigmaPowerClient {
  /**
   * Get rich design context for a Figma node.
   *
   * Returns generated code and assets that describe the component's
   * layout, properties, and visual states.
   */
  getDesignContext(
    fileKey: string,
    nodeId: string,
  ): Promise<DesignContextResponse>;

  /**
   * Get structural metadata for a Figma node.
   *
   * Returns XML-formatted overview of node tree with IDs, types,
   * names, positions, and sizes.
   */
  getMetadata(
    fileKey: string,
    nodeId: string,
  ): Promise<MetadataResponse>;
}

// ---------------------------------------------------------------------------
// Extracted Component (rich representation from dual-MCP)
// ---------------------------------------------------------------------------

/**
 * Layout information extracted from a Figma component.
 */
export interface ExtractedLayout {
  /** Layout mode: auto-layout direction or none. */
  mode: 'horizontal' | 'vertical' | 'none';
  /** Spacing between children (px). */
  itemSpacing?: number;
  /** Padding values (px). */
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

/**
 * Rich component representation extracted from Figma via dual-MCP.
 *
 * Extends the minimal FigmaComponent from VariantAnalyzer with layout,
 * property definitions, and raw source data for downstream processing.
 */
export interface ExtractedComponent {
  /** Component name from Figma. */
  name: string;
  /** Component description from Figma. */
  description: string;
  /** Variant definitions with their property values. */
  variants: VariantDefinition[];
  /** Visual states detected (hover, focus, disabled, pressed). */
  states: StateDefinition[];
  /** Component properties (boolean, text, instance swap, etc.). */
  properties: PropertyDefinition[];
  /** Layout information (auto-layout, spacing, padding). */
  layout: ExtractedLayout;
  /** Raw design context code from Kiro Power (for downstream parsing). */
  rawDesignContext?: string;
  /** Raw metadata XML from Kiro Power (for downstream parsing). */
  rawMetadata?: string;
  /** Which MCP source provided the primary data. */
  source: 'kiro-power' | 'console-mcp-fallback';
  /**
   * Direct variable bindings from Figma component children.
   *
   * Maps Figma property names (e.g. "paddingLeft", "itemSpacing", "cornerRadius")
   * to their bound variable names (e.g. "space/100", "radius/200").
   * Extracted from `boundVariables` on child nodes via Console MCP.
   * Enables binding-first token translation without value scanning.
   */
  boundVariableMap?: Map<string, string>;
  /** Corner radius value (px) extracted from component children. */
  cornerRadius?: number;
  /** Fill colors extracted from component children (hex or rgba). */
  fills?: Array<{ type: string; color?: string; opacity?: number }>;
}

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

/** Confidence level for an extracted value. */
export type ConfidenceLevel = 'exact' | 'approximate' | 'no-match';

/** How a token match was found. */
export type MatchMethod = 'binding' | 'value';

/**
 * A single token reference extracted from a Figma component property.
 */
export interface TokenReference {
  /** CSS property or Figma property name (e.g. "padding-left", "fill"). */
  property: string;
  /** Matched DesignerPunk token path (dot notation). */
  token: string;
  /** Match confidence. */
  confidence: ConfidenceLevel;
  /** How the match was found. */
  matchMethod: MatchMethod;
  /** Primitive token path if resolved. */
  primitive?: string;
  /** Semantic token path if resolved. */
  semantic?: string;
  /** Difference from matched token value (e.g. "±1px"). */
  delta?: string;
  /** Original Figma value as string (preserved for no-match reporting). */
  rawValue?: string;
  /** Suggested closest token when no exact match found. */
  suggestion?: string;
}

/**
 * A single no-match entry in the pause report.
 *
 * Provides all context needed for a human to decide how to handle
 * an unmatched Figma value: map to suggested token, document as
 * off-system, or request new token creation.
 */
export interface NoMatchEntry {
  /** CSS property or Figma property name. */
  property: string;
  /** Original Figma value that could not be matched. */
  figmaValue: string;
  /** Closest token suggestion (if any). */
  closestMatch?: string;
  /** Delta from closest match (e.g. "±3px"). */
  delta?: string;
  /** Resolution options for human review. */
  options: string[];
}

/**
 * Aggregated token usage across all properties of a component.
 */
export interface TokenUsage {
  spacing: TokenReference[];
  colors: TokenReference[];
  typography: TokenReference[];
  radius: TokenReference[];
  shadows: TokenReference[];
}

/**
 * A Figma variable binding on a component element.
 *
 * Represents the relationship between a Figma variable and its resolved
 * values across modes (light/dark).
 */
export interface TokenBinding {
  /** Figma variable name in slash notation (e.g. "space/100"). */
  variableName: string;
  /** Figma variable ID. */
  variableId: string;
  /** Collection name (e.g. "Primitives", "Semantics"). */
  collectionName: string;
  /** Resolved variable type: FLOAT, COLOR, STRING. */
  resolvedType: string;
  /** Values keyed by mode name or mode ID. */
  valuesByMode: Record<string, unknown>;
  /** Whether this variable is a semantic alias. */
  isAlias: boolean;
  /** Primitive variable name if this is an alias. */
  aliasTarget?: string;
}

/**
 * A Figma style (effect or text) read from the file.
 */
export interface FigmaStyle {
  /** Style name (e.g. "shadow.elevation200", "typography.heading200"). */
  name: string;
  /** Style type. */
  type: 'EFFECT' | 'TEXT';
  /** Raw style properties from Figma. */
  properties: Record<string, unknown>;
}

/**
 * Variant definition extracted from a Figma component.
 */
export interface VariantDefinition {
  name: string;
  properties: Record<string, string>;
}

/**
 * Visual state extracted from a Figma component (e.g. hover, focus, disabled).
 */
export interface StateDefinition {
  name: string;
  description?: string;
}

/**
 * A component property extracted from Figma.
 */
export interface PropertyDefinition {
  name: string;
  type: string;
  defaultValue?: string;
}

/**
 * Inheritance pattern for a component within its family.
 */
export interface InheritancePattern {
  familyName: string;
  pattern: string;
  baseComponent?: string;
}

/**
 * Status of behavioral contracts for a component.
 *
 * Interactive components (buttons, inputs) require explicit behavioral
 * contracts. Static components (badges, dividers) get auto-generated
 * "no interaction" contracts.
 */
export interface BehavioralContractStatus {
  /** Whether the component is classified as interactive or static. */
  classification: 'interactive' | 'static';
  /** Visual states detected from Figma (hover, focus, disabled, pressed). */
  detectedStates: string[];
  /** Whether behavioral contracts are defined. */
  contractsDefined: boolean;
  /** Auto-generated contract for static components, or undefined for interactive. */
  autoContract?: string;
  /** Confidence flag for the behavioral contract status. */
  confidence: '✅' | '⚠️' | '❌';
}

/**
 * Platform parity check result for a component.
 *
 * Flags platform-specific interactions (hover = web-only, press = mobile)
 * and provides recommendations for cross-platform consistency.
 */
export interface PlatformParityCheck {
  /** Platform-specific interactions detected. */
  interactions: PlatformInteraction[];
  /** Overall parity status. */
  hasConcerns: boolean;
}

/** A single platform-specific interaction. */
export interface PlatformInteraction {
  /** Interaction name (e.g. "hover", "press", "long-press"). */
  interaction: string;
  /** Which platforms support this interaction. */
  platforms: ('web' | 'ios' | 'android')[];
  /** Recommendation for cross-platform handling. */
  recommendation: string;
}

/**
 * A component token decision point surfaced for Ada's review.
 *
 * Detects repeated primitive token usage and provides illustrative
 * component token suggestions. All suggestions are explicitly labeled
 * as pending human review.
 */
export interface ComponentTokenDecision {
  /** The primitive token being used repeatedly. */
  primitiveToken: string;
  /** Number of times the primitive is used across component properties. */
  usageCount: number;
  /** Where the primitive is used (e.g. "padding-left: 5 variants"). */
  locations: string[];
  /** Illustrative component token name suggestion. */
  illustrativeSuggestion: string;
  /** Why this pattern is notable. */
  rationale: string;
}

/**
 * Mode validation result for token bindings.
 */
export interface ModeValidationResult {
  /** Discrepancies found between modes. */
  discrepancies: ModeDiscrepancy[];
  /** Whether any unexpected discrepancies were found. */
  hasUnexpectedDiscrepancies: boolean;
}

/** A single mode discrepancy for a token binding. */
export interface ModeDiscrepancy {
  /** Variable name with the discrepancy. */
  variableName: string;
  /** Light mode value. */
  lightValue: unknown;
  /** Dark mode value. */
  darkValue: unknown;
  /** Whether this discrepancy is expected or unexpected. */
  category: 'expected' | 'unexpected';
}

/**
 * Confidence report for the overall extraction.
 */
export interface ConfidenceReport {
  /** Overall confidence: high, medium, or low. */
  overall: 'high' | 'medium' | 'low';
  /** Number of exact matches. */
  exactMatches: number;
  /** Number of approximate matches. */
  approximateMatches: number;
  /** Number of no-match values. */
  noMatches: number;
  /** Whether human input is required before proceeding. */
  requiresHumanInput: boolean;
  /** Specific items requiring human review. */
  reviewItems: string[];
}

/**
 * Complete design outline generated from Figma extraction.
 *
 * Contains all information needed to generate a design-outline.md
 * document with confidence flags for human review.
 */
export interface DesignOutline {
  componentName: string;
  description: string;
  variants: VariantDefinition[];
  states: StateDefinition[];
  properties: PropertyDefinition[];
  tokenUsage: TokenUsage;
  inheritancePattern?: InheritancePattern;
  variantMapping?: VariantMapping;
  behavioralContracts: BehavioralContractStatus;
  platformParity: PlatformParityCheck;
  componentTokenDecisions: ComponentTokenDecision[];
  modeValidation?: ModeValidationResult;
  extractionConfidence: ConfidenceReport;
}

// ---------------------------------------------------------------------------
// DesignExtractor
// ---------------------------------------------------------------------------

/**
 * Orchestrates extraction from Figma via dual-MCP strategy and generates
 * design-outline.md documents.
 *
 * Uses:
 * - Kiro Figma Power for rich design context (component structure, layout)
 * - figma-console-mcp via ConsoleMCPClient for variables and styles
 * - TokenTranslator for Figma value → DesignerPunk token matching
 * - VariantAnalyzer for context-aware variant mapping recommendations
 */
export class DesignExtractor {
  /** Platform-interaction heuristics: interaction → supported platforms. */
  private static readonly PLATFORM_HEURISTICS: Record<string, ('web' | 'ios' | 'android')[]> = {
    hover: ['web'],
    focus: ['web', 'ios', 'android'],
    pressed: ['web', 'ios', 'android'],
    disabled: ['web', 'ios', 'android'],
    active: ['web', 'ios', 'android'],
    selected: ['web', 'ios', 'android'],
    'long-press': ['ios', 'android'],
    loading: ['web', 'ios', 'android'],
    error: ['web', 'ios', 'android'],
  };

  constructor(
    private readonly consoleMcp: ConsoleMCPClient,
    private readonly translator: TokenTranslator,
    private readonly analyzer: VariantAnalyzer,
    private readonly kiroPower?: KiroFigmaPowerClient,
    private readonly mcpDocs?: MCPDocClient,
  ) {}

  // -------------------------------------------------------------------------
  // readFigmaComponent (Task 3.2)
  // -------------------------------------------------------------------------

  /**
   * Read a Figma component via dual-MCP strategy.
   *
   * Primary: Kiro Figma Power `get_design_context` for rich component
   * structure (layout, properties, visual states).
   * Fallback: `get_metadata` + figma-console-mcp `figma_get_component`
   * if `get_design_context` lacks detail or Kiro Power is unavailable.
   *
   * @param fileKey - The Figma file key.
   * @param nodeId - The node ID of the component to extract.
   * @returns An ExtractedComponent with structure, layout, and states.
   * @throws Error if component cannot be read from either MCP source.
   */
  async readFigmaComponent(
    fileKey: string,
    nodeId: string,
  ): Promise<ExtractedComponent> {
    // Try primary path: Kiro Figma Power
    if (this.kiroPower) {
      try {
        const designContext = await this.kiroPower.getDesignContext(fileKey, nodeId);

        if (designContext.code && designContext.code.trim().length > 0) {
          const extracted = this.parseDesignContext(designContext);
          if (extracted.name) {
            return {
              ...extracted,
              rawDesignContext: designContext.code,
              source: 'kiro-power',
            };
          }
        }
      } catch {
        // Kiro Power failed — fall through to fallback
      }
    }

    // Fallback: get_metadata + figma_get_component
    return this.readFigmaComponentFallback(fileKey, nodeId);
  }

  /**
   * Parse Kiro Figma Power `get_design_context` response into an
   * ExtractedComponent.
   *
   * Extracts component name, description, variants, states, properties,
   * and layout from the generated code string.
   */
  private parseDesignContext(response: DesignContextResponse): ExtractedComponent {
    const code = response.code ?? '';

    return {
      name: this.extractComponentName(code),
      description: this.extractDescription(code),
      variants: this.extractVariants(code),
      states: this.extractStates(code),
      properties: this.extractProperties(code),
      layout: this.extractLayout(code),
      source: 'kiro-power',
    };
  }

  /**
   * Fallback component reading via get_metadata + figma_get_component.
   *
   * Primary extraction path when Kiro Power is unavailable (which is the
   * common case). Extracts structured layout data, boundVariables, fills,
   * and cornerRadius directly from the Console MCP component response.
   */
  private async readFigmaComponentFallback(
      fileKey: string,
      nodeId: string,
    ): Promise<ExtractedComponent> {
      // Try metadata from Kiro Power if available
      let rawMetadata: string | undefined;
      if (this.kiroPower) {
        try {
          const metadata = await this.kiroPower.getMetadata(fileKey, nodeId);
          rawMetadata = metadata.xml;
        } catch {
          // Metadata unavailable — continue without it
        }
      }

      // Get component data from figma-console-mcp
      let componentData: FigmaComponentResponse;
      try {
        componentData = await this.consoleMcp.getComponent(fileKey, nodeId);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        throw new Error(
          `Failed to read Figma component (file: ${fileKey}, node: ${nodeId}): ${msg}`,
        );
      }

      if (!componentData.name) {
        throw new Error(
          `Component not found or invalid node ID (file: ${fileKey}, node: ${nodeId})`,
        );
      }

      // Build variants from variantProperties map
      const variants: VariantDefinition[] = [];
      if (componentData.variantProperties) {
        const propEntries = Object.entries(componentData.variantProperties);
        if (propEntries.length > 0) {
          // Generate variant combinations from the first property's values
          const [firstProp, firstValues] = propEntries[0];
          for (const val of firstValues) {
            variants.push({
              name: `${firstProp}=${val}`,
              properties: { [firstProp]: val },
            });
          }
        }
      }

      // Extract component properties and states from children's componentProperties.
      // Children of a COMPONENT_SET carry componentProperties like:
      //   { "State": { value: "Incomplete", type: "VARIANT" },
      //     "Size": { value: "Sm", type: "VARIANT" },
      //     "Show Label#1231:0": { type: "BOOLEAN", value: false } }
      const { properties, states: childStates } = this.extractChildComponentProperties(componentData);

      // Extract states from metadata XML if available, merge with child states
      const metadataStates = rawMetadata ? this.extractStatesFromMetadata(rawMetadata) : [];
      const stateNames = new Set(metadataStates.map(s => s.name));
      for (const cs of childStates) {
        if (!stateNames.has(cs.name)) {
          metadataStates.push(cs);
          stateNames.add(cs.name);
        }
      }

      // Extract structured layout data from component children
      const { layout, boundVariableMap, cornerRadius, fills } =
        this.extractLayoutFromComponentData(componentData);

      return {
        name: componentData.name,
        description: componentData.description ?? '',
        variants,
        states: metadataStates,
        properties,
        layout,
        boundVariableMap,
        cornerRadius,
        fills,
        rawMetadata,
        source: 'console-mcp-fallback',
      };
    }

  /**
   * Extract structured layout data from a Console MCP component response.
   *
   * Walks the component's children (variant instances in a component set)
   * to extract padding, itemSpacing, cornerRadius, fills, and boundVariables.
   * Uses the first child with layout data as the representative, since
   * variant children typically share the same structural tokens.
   *
   * boundVariables entries use VARIABLE_ALIAS format:
   *   { "paddingLeft": { "type": "VARIABLE_ALIAS", "id": "VariableID:..." } }
   *
   * We resolve variable IDs to names via the bindings loaded separately
   * in readTokenBindings(). Here we store the raw property→variableId map
   * and also extract any inline variable name references.
   */
  /**
     * Extract structured layout data from a Console MCP component response.
     *
     * Walks the component's children recursively to extract padding,
     * itemSpacing, cornerRadius, fills, and boundVariables. Uses the first
     * child with layout data as the representative for spacing/layout, and
     * collects boundVariables from all levels of the tree (since bindings
     * often live on grandchildren — e.g. fill color bindings on inner frames).
     *
     * boundVariables entries use VARIABLE_ALIAS format:
     *   { "paddingLeft": { "type": "VARIABLE_ALIAS", "id": "VariableID:..." } }
     *
     * Fill-level boundVariables are nested inside the fills array:
     *   fills: [{ color: {...}, boundVariables: { color: { id: "..." } } }]
     *
     * We resolve variable IDs to names via the bindings loaded separately
     * in readTokenBindings(). Here we store the raw property→variableId map.
     */
    private extractLayoutFromComponentData(
      componentData: FigmaComponentResponse,
    ): {
      layout: ExtractedLayout;
      boundVariableMap: Map<string, string>;
      cornerRadius?: number;
      fills?: Array<{ type: string; color?: string; opacity?: number }>;
    } {
      const boundVariableMap = new Map<string, string>();
      let layout: ExtractedLayout = { mode: 'none' };
      let cornerRadius: number | undefined;
      let fills: Array<{ type: string; color?: string; opacity?: number }> | undefined;

      // The component data may be a component set (with children) or a single component.
      // Try children first, then fall back to the component itself.
      const raw = componentData as Record<string, unknown>;
      const children = raw.children as Array<Record<string, unknown>> | undefined;
      const nodesToInspect = children && children.length > 0
        ? children
        : [raw];

      for (const node of nodesToInspect) {
        // Extract layout mode from layoutMode field
        const layoutMode = node.layoutMode as string | undefined;
        if (layoutMode && layout.mode === 'none') {
          if (layoutMode === 'HORIZONTAL') layout.mode = 'horizontal';
          else if (layoutMode === 'VERTICAL') layout.mode = 'vertical';
        }

        // Extract spacing values — use first node that has them
        const itemSpacing = node.itemSpacing as number | undefined;
        if (itemSpacing != null && layout.itemSpacing == null) {
          layout.itemSpacing = itemSpacing;
        }

        // Extract padding
        const pTop = node.paddingTop as number | undefined;
        const pRight = node.paddingRight as number | undefined;
        const pBottom = node.paddingBottom as number | undefined;
        const pLeft = node.paddingLeft as number | undefined;
        if ((pTop != null || pRight != null || pBottom != null || pLeft != null) && !layout.padding) {
          layout.padding = {
            top: pTop,
            right: pRight,
            bottom: pBottom,
            left: pLeft,
          };
        }

        // Extract corner radius
        const cr = node.cornerRadius as number | undefined;
        if (cr != null && cornerRadius == null) {
          cornerRadius = cr;
        }

        // Extract fills from this node (top-level fills for the component)
        const nodeFills = node.fills as Array<Record<string, unknown>> | undefined;
        if (nodeFills && nodeFills.length > 0 && !fills) {
          fills = nodeFills.map((f) => {
            const color = f.color as Record<string, number> | undefined;
            let colorStr: string | undefined;
            if (color) {
              const r = Math.round((color.r ?? 0) * 255);
              const g = Math.round((color.g ?? 0) * 255);
              const b = Math.round((color.b ?? 0) * 255);
              colorStr = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            }
            // Extract fill-level boundVariables (e.g. color bound to a variable)
            const fillBoundVars = f.boundVariables as Record<string, unknown> | undefined;
            if (fillBoundVars) {
              this.extractBoundVariables(fillBoundVars, boundVariableMap);
            }
            return {
              type: String(f.type ?? 'SOLID'),
              color: colorStr,
              opacity: f.opacity as number | undefined,
            };
          });
        }

        // Extract node-level boundVariables (spacing, padding, radius bindings)
        const boundVars = node.boundVariables as Record<string, unknown> | undefined;
        if (boundVars) {
          this.extractBoundVariables(boundVars, boundVariableMap);
        }

        // Stop scanning siblings once we have layout data (spacing/padding)
        if (layout.mode !== 'none') break;
      }

      // Always walk the full tree for boundVariables and deep fills.
      // boundVariables and color bindings often live on grandchildren
      // (e.g. fill color bindings on inner frames within instance children).
      // We collect ALL of them, not just the first match.
      for (const node of nodesToInspect) {
        this.collectBoundVariablesRecursive(node, boundVariableMap, 0, 4);
      }

      // Collect fills from deep children that have boundVariables on their
      // fills — these represent designer-intentional color assignments that
      // the top-level fills may not capture.
      const deepFills = this.collectDeepFills(nodesToInspect);
      if (deepFills.length > 0) {
        // Merge deep fills with top-level fills, deduplicating by color value
        const existingColors = new Set((fills ?? []).map(f => f.color));
        for (const df of deepFills) {
          if (df.color && !existingColors.has(df.color)) {
            if (!fills) fills = [];
            fills.push(df);
            existingColors.add(df.color);
          }
        }
      }

      return { layout, boundVariableMap, cornerRadius, fills };
    }

    /**
     * Extract component properties and visual states from children's
     * componentProperties fields.
     *
     * Walks all children (and grandchildren) looking for `componentProperties`
     * objects. Extracts:
     * - VARIANT properties with value matching known state names → StateDefinition
     * - VARIANT properties → PropertyDefinition (with type from variant options)
     * - BOOLEAN properties → PropertyDefinition
     *
     * Deduplicates by property name (strips Figma hash suffixes like "#1231:0").
     */
    private extractChildComponentProperties(
      componentData: FigmaComponentResponse,
    ): { properties: PropertyDefinition[]; states: StateDefinition[] } {
      const properties: PropertyDefinition[] = [];
      const states: StateDefinition[] = [];
      const seenProps = new Set<string>();
      const seenStates = new Set<string>();

      const stateKeywords = new Set([
        'hover', 'focus', 'disabled', 'pressed', 'active', 'selected',
        'error', 'loading', 'incomplete', 'complete', 'current',
      ]);

      const raw = componentData as Record<string, unknown>;
      const children = raw.children as Array<Record<string, unknown>> | undefined;
      if (!children) return { properties, states };

      const walkNode = (node: Record<string, unknown>): void => {
        const cp = node.componentProperties as
          Record<string, { type: string; value: unknown; boundVariables?: unknown }> | undefined;

        if (cp) {
          for (const [rawName, def] of Object.entries(cp)) {
            // Strip Figma hash suffix (e.g. "Show Label#1231:0" → "Show Label")
            const cleanName = rawName.replace(/#[\d:]+$/, '').trim();
            if (seenProps.has(cleanName)) continue;
            seenProps.add(cleanName);

            if (def.type === 'VARIANT') {
              const value = String(def.value ?? '');

              // Check if this variant value is a visual state
              if (stateKeywords.has(value.toLowerCase()) && !seenStates.has(value.toLowerCase())) {
                states.push({ name: value.toLowerCase() });
                seenStates.add(value.toLowerCase());
              }

              properties.push({
                name: cleanName,
                type: 'variant',
                defaultValue: value,
              });
            } else if (def.type === 'BOOLEAN') {
              properties.push({
                name: cleanName,
                type: 'boolean',
                defaultValue: String(def.value ?? 'false'),
              });
            }
          }
        }

        // Recurse into children
        const nodeChildren = node.children as Array<Record<string, unknown>> | undefined;
        if (nodeChildren) {
          for (const child of nodeChildren) {
            walkNode(child);
          }
        }
      };

      for (const child of children) {
        walkNode(child);
      }

      return { properties, states };
    }



    /**
     * Extract boundVariables from a node's boundVariables object into the map.
     */
    private extractBoundVariables(
      boundVars: Record<string, unknown>,
      boundVariableMap: Map<string, string>,
    ): void {
      for (const [prop, binding] of Object.entries(boundVars)) {
        if (!binding || typeof binding !== 'object') continue;

        const bindingObj = binding as Record<string, unknown>;
        const bindingEntries = Array.isArray(bindingObj) ? bindingObj : [bindingObj];

        for (const entry of bindingEntries) {
          const entryObj = entry as Record<string, unknown>;
          const varId = entryObj.id as string | undefined;
          if (varId && !boundVariableMap.has(prop)) {
            boundVariableMap.set(prop, varId);
          }
        }
      }
    }

    /**
     * Recursively walk a node tree to collect all boundVariables.
     *
     * Collects from node-level boundVariables and fill-level boundVariables
     * on all descendants up to maxDepth.
     */
    private collectBoundVariablesRecursive(
      node: Record<string, unknown>,
      boundVariableMap: Map<string, string>,
      depth: number,
      maxDepth: number,
    ): void {
      if (depth > maxDepth) return;

      // Node-level boundVariables
      const boundVars = node.boundVariables as Record<string, unknown> | undefined;
      if (boundVars) {
        this.extractBoundVariables(boundVars, boundVariableMap);
      }

      // Fill-level boundVariables (color bindings inside fills array)
      const nodeFills = node.fills as Array<Record<string, unknown>> | undefined;
      if (nodeFills) {
        for (const fill of nodeFills) {
          const fillBoundVars = fill.boundVariables as Record<string, unknown> | undefined;
          if (fillBoundVars) {
            this.extractBoundVariables(fillBoundVars, boundVariableMap);
          }
        }
      }

      // Recurse into children
      const children = node.children as Array<Record<string, unknown>> | undefined;
      if (children) {
        for (const child of children) {
          this.collectBoundVariablesRecursive(child, boundVariableMap, depth + 1, maxDepth);
        }
      }
    }

    /**
     * Collect fills from deep children that have boundVariables on their fills.
     *
     * These represent designer-intentional color assignments (variables bound
     * to fill colors) that may differ from the parent component's fills.
     * Returns deduplicated fills with their hex color values.
     */
    private collectDeepFills(
      nodes: Array<Record<string, unknown>>,
    ): Array<{ type: string; color?: string; opacity?: number }> {
      const result: Array<{ type: string; color?: string; opacity?: number }> = [];
      const seenColors = new Set<string>();

      const walk = (node: Record<string, unknown>, depth: number): void => {
        if (depth > 4) return;

        const nodeFills = node.fills as Array<Record<string, unknown>> | undefined;
        if (nodeFills) {
          for (const fill of nodeFills) {
            // Only collect fills that have boundVariables (designer intent)
            const fillBv = fill.boundVariables as Record<string, unknown> | undefined;
            if (!fillBv || Object.keys(fillBv).length === 0) continue;

            const color = fill.color as Record<string, number> | undefined;
            if (!color) continue;

            const r = Math.round((color.r ?? 0) * 255);
            const g = Math.round((color.g ?? 0) * 255);
            const b = Math.round((color.b ?? 0) * 255);
            const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

            if (!seenColors.has(hex)) {
              seenColors.add(hex);
              result.push({
                type: String(fill.type ?? 'SOLID'),
                color: hex,
                opacity: fill.opacity as number | undefined,
              });
            }
          }
        }

        const children = node.children as Array<Record<string, unknown>> | undefined;
        if (children) {
          for (const child of children) {
            walk(child, depth + 1);
          }
        }
      };

      for (const node of nodes) {
        walk(node, 0);
      }

      return result;
    }




  // -------------------------------------------------------------------------
  // Design context parsing helpers
  // -------------------------------------------------------------------------

  /** Extract component name from generated code. */
  private extractComponentName(code: string): string {
    // Match class/component name patterns
    const classMatch = code.match(/class\s+(\w+)/);
    if (classMatch) return classMatch[1];

    const componentMatch = code.match(/(?:export\s+)?(?:default\s+)?(?:function|const)\s+(\w+)/);
    if (componentMatch) return componentMatch[1];

    // Try HTML custom element tag
    const tagMatch = code.match(/<([a-z][\w-]*)/);
    if (tagMatch) return tagMatch[1];

    return '';
  }

  /** Extract description from code comments or JSDoc. */
  private extractDescription(code: string): string {
    const jsdocMatch = code.match(/\/\*\*\s*\n?\s*\*?\s*(.+?)(?:\n|\*\/)/);
    if (jsdocMatch) return jsdocMatch[1].trim();

    const commentMatch = code.match(/\/\/\s*(.+)/);
    if (commentMatch) return commentMatch[1].trim();

    return '';
  }

  /** Extract variant definitions from code. */
  private extractVariants(code: string): VariantDefinition[] {
    const variants: VariantDefinition[] = [];

    // Match variant property patterns (e.g. variant="primary", size="large")
    const variantPattern = /(?:variant|type|size|state)\s*[=:]\s*["'](\w+)["']/gi;
    const seen = new Set<string>();
    let match: RegExpExecArray | null;

    while ((match = variantPattern.exec(code)) !== null) {
      const propName = match[0].split(/[=:]/)[0].trim().toLowerCase();
      const value = match[1];
      const key = `${propName}=${value}`;
      if (!seen.has(key)) {
        seen.add(key);
        variants.push({ name: key, properties: { [propName]: value } });
      }
    }

    return variants;
  }

  /** Extract visual states from code (hover, focus, disabled, pressed). */
  private extractStates(code: string): StateDefinition[] {
    const stateKeywords = ['hover', 'focus', 'disabled', 'pressed', 'active', 'selected'];
    const states: StateDefinition[] = [];
    const codeLower = code.toLowerCase();

    for (const keyword of stateKeywords) {
      if (codeLower.includes(keyword)) {
        states.push({ name: keyword });
      }
    }

    return states;
  }

  /** Extract component properties from code. */
  private extractProperties(code: string): PropertyDefinition[] {
    const properties: PropertyDefinition[] = [];

    // Match TypeScript interface/type property patterns
    const propPattern = /(\w+)\s*[?]?\s*:\s*(string|number|boolean|'[^']*'(?:\s*\|\s*'[^']*')*)/g;
    const seen = new Set<string>();
    let match: RegExpExecArray | null;

    while ((match = propPattern.exec(code)) !== null) {
      const name = match[1];
      const type = match[2];
      if (!seen.has(name)) {
        seen.add(name);
        properties.push({ name, type });
      }
    }

    return properties;
  }

  /** Extract layout information from code. */
  private extractLayout(code: string): ExtractedLayout {
    const codeLower = code.toLowerCase();

    let mode: ExtractedLayout['mode'] = 'none';
    if (codeLower.includes('flex-direction: row') || codeLower.includes('flexdirection: row') || codeLower.includes('display: flex')) {
      mode = 'horizontal';
    }
    if (codeLower.includes('flex-direction: column') || codeLower.includes('flexdirection: column')) {
      mode = 'vertical';
    }

    const layout: ExtractedLayout = { mode };

    // Extract gap/spacing
    const gapMatch = code.match(/gap:\s*(\d+)/);
    if (gapMatch) {
      layout.itemSpacing = parseInt(gapMatch[1], 10);
    }

    // Extract padding
    const paddingMatch = code.match(/padding:\s*(\d+)(?:px)?(?:\s+(\d+)(?:px)?)?(?:\s+(\d+)(?:px)?)?(?:\s+(\d+)(?:px)?)?/);
    if (paddingMatch) {
      const values = [paddingMatch[1], paddingMatch[2], paddingMatch[3], paddingMatch[4]]
        .filter(Boolean)
        .map(Number);

      if (values.length === 1) {
        layout.padding = { top: values[0], right: values[0], bottom: values[0], left: values[0] };
      } else if (values.length === 2) {
        layout.padding = { top: values[0], right: values[1], bottom: values[0], left: values[1] };
      } else if (values.length === 4) {
        layout.padding = { top: values[0], right: values[1], bottom: values[2], left: values[3] };
      }
    }

    return layout;
  }

  /** Extract states from metadata XML. */
  private extractStatesFromMetadata(xml: string): StateDefinition[] {
    const stateKeywords = ['hover', 'focus', 'disabled', 'pressed', 'active', 'selected'];
    const states: StateDefinition[] = [];
    const xmlLower = xml.toLowerCase();

    for (const keyword of stateKeywords) {
      if (xmlLower.includes(keyword)) {
        states.push({ name: keyword });
      }
    }

    return states;
  }

  // -------------------------------------------------------------------------
  // readTokenBindings (Task 3.3)
  // -------------------------------------------------------------------------

  /**
   * Read all token bindings (Figma variables) from a file.
   *
   * Uses figma-console-mcp via `consoleMcp.getVariables()` which calls
   * `figma_get_token_values`. Maps results to `TokenBinding[]` with alias
   * detection based on `valuesByMode` containing `{ aliasOf: string }`.
   *
   * @param fileKey - The Figma file key.
   * @returns Array of token bindings with alias relationships detected.
   */
  async readTokenBindings(fileKey: string): Promise<TokenBinding[]> {
    const variables = await this.consoleMcp.getVariables(fileKey);

    if (!variables || variables.length === 0) {
      return [];
    }

    // Build a lookup of variable names for alias target resolution
    const nameById = new Map<string, string>();
    for (const v of variables) {
      if (v.id) {
        nameById.set(v.id, v.name);
      }
    }

    return variables.map((v) => {
      // Detect alias: valuesByMode values shaped { aliasOf: string }
      const { isAlias, aliasTarget } = this.detectAlias(v.valuesByMode, nameById);

      // collectionName is available at runtime from figma_get_token_values
      // even though the FigmaVariable type doesn't declare it
      const raw = v as unknown as Record<string, unknown>;
      const collectionName = typeof raw.collectionName === 'string'
        ? raw.collectionName
        : this.inferCollectionFromName(v.name, isAlias);

      return {
        variableName: v.name,
        variableId: v.id ?? '',
        collectionName,
        resolvedType: v.resolvedType,
        valuesByMode: v.valuesByMode,
        isAlias,
        aliasTarget,
      };
    });
  }

  /**
   * Detect whether a variable is an alias by inspecting its mode values.
   *
   * Figma aliases are represented as `{ aliasOf: string }` in valuesByMode.
   * Returns the first alias target found (semantic tokens typically alias
   * the same primitive across all modes).
   */
  private detectAlias(
    valuesByMode: Record<string, unknown>,
    nameById: Map<string, string>,
  ): { isAlias: boolean; aliasTarget?: string } {
    for (const modeValue of Object.values(valuesByMode)) {
      if (
        modeValue &&
        typeof modeValue === 'object' &&
        'aliasOf' in (modeValue as Record<string, unknown>)
      ) {
        const aliasRef = (modeValue as { aliasOf: string }).aliasOf;
        // aliasOf may be a variable name or an ID — resolve via lookup
        const resolved = nameById.get(aliasRef) ?? aliasRef;
        return { isAlias: true, aliasTarget: resolved };
      }
    }
    return { isAlias: false };
  }

  /**
   * Infer collection name from variable name when not provided by MCP.
   *
   * Heuristic: variables with dot-separated semantic paths (e.g.
   * "color.primary", "color.feedback.success.text") are Semantics;
   * simple group/value names (e.g. "space/100", "color/purple/300")
   * are Primitives.
   */
  private inferCollectionFromName(name: string, isAlias: boolean): string {
    if (isAlias) return 'Semantics';
    // Semantic tokens use dot notation in their Figma names (pushed via 054a)
    // e.g. "color.primary", "color.feedback.success.text"
    if (name.includes('.')) return 'Semantics';
    // Primitive tokens use slash notation: "space/100", "color/purple/300"
    return 'Primitives';
  }

  /**
   * Read Figma styles (effect and text) from a file via figma-console-mcp.
   *
   * Calls `consoleMcp.getStyles(fileKey)` which invokes `figma_get_styles`,
   * then maps results to `FigmaStyle[]`. Effect styles represent shadows/blurs;
   * text styles represent typography.
   *
   * @param fileKey - The Figma file key.
   * @returns Array of FigmaStyle objects separated by type.
   * @requirements Req 3 (Composite Token Reconstruction)
   */
  async readStyles(fileKey: string): Promise<FigmaStyle[]> {
    const rawStyles = await this.consoleMcp.getStyles(fileKey);

    if (!rawStyles || rawStyles.length === 0) {
      return [];
    }

    return rawStyles.map((s) => ({
      name: s.name,
      type: s.type,
      properties: s.properties,
    }));
  }

  // -------------------------------------------------------------------------
  // queryContext (Task 3.5)
  // -------------------------------------------------------------------------

  /**
   * Determine the component family from a component name and query
   * DesignerPunk MCP for family pattern and existing component status.
   *
   * Family extraction uses PascalCase heuristics:
   *   "ButtonCTA"       → "Button"
   *   "InputTextBase"   → "Input"
   *   "IconBase"        → "Icon"
   *   "ContainerBase"   → "Container"
   *
   * Delegates to VariantAnalyzer's `queryFamilyPattern()` and
   * `queryExistingComponents()` for the actual MCP queries.
   *
   * @param componentName - The Figma component name (e.g. "ButtonCTA").
   * @returns ExtractionContext with family pattern and existing components.
   * @requirements Req 1 (DesignExtractor), Req 4 (Context-Aware Variant Mapping)
   */
  async queryContext(componentName: string): Promise<ExtractionContext> {
    const familyName = this.extractFamilyName(componentName);

    const [familyPattern, existingComponents] = await Promise.all([
      this.analyzer.queryFamilyPattern(familyName),
      this.analyzer.queryExistingComponents(familyName),
    ]);

    return { familyPattern, existingComponents };
  }

  /**
   * Extract the family name from a PascalCase component name.
   *
   * Splits on uppercase boundaries and returns the first segment.
   * Handles common suffixes like "Base", "CTA", etc.
   *
   * Examples:
   *   "ButtonCTA"       → "Button"
   *   "InputTextBase"   → "Input"
   *   "IconBase"        → "Icon"
   *   "container-base"  → "Container" (kebab-case fallback)
   *   "Button"          → "Button"
   */
  private extractFamilyName(componentName: string): string {
    // Handle kebab-case (e.g. "button-cta", "input-text-base")
    if (componentName.includes('-')) {
      const first = componentName.split('-')[0];
      return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
    }

    // PascalCase: split on uppercase boundaries
    const segments = componentName.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
    return segments[0];
  }

  // -------------------------------------------------------------------------
  // translateTokens (Task 3.6)
  // -------------------------------------------------------------------------

  /**
   * Translate all component properties to DesignerPunk token references.
   *
   * Builds a binding lookup map from the token bindings, then iterates
   * over the component's layout, color, typography, radius, and shadow
   * properties. For each property, checks if a variable binding exists
   * and delegates to `translator.translate()` with binding-first strategy.
   *
   * Tracks no-match values for pause reporting in the extraction confidence.
   *
   * @param component - The extracted Figma component with layout and raw data.
   * @param bindings - Token bindings read from figma-console-mcp.
   * @returns Aggregated TokenUsage with all translated references.
   * @requirements Req 2 (TokenTranslator Implementation)
   */
  translateTokens(
    component: ExtractedComponent,
    bindings: TokenBinding[],
  ): TokenUsage {
    // Build binding lookup: variableName → TokenBinding
    const bindingMap = new Map<string, TokenBinding>();
    for (const binding of bindings) {
      bindingMap.set(binding.variableName, binding);
    }

    // Build variable ID → variable name lookup for resolving boundVariables
    const nameById = new Map<string, string>();
    for (const binding of bindings) {
      if (binding.variableId) {
        nameById.set(binding.variableId, binding.variableName);
      }
    }

    const usage: TokenUsage = {
      spacing: [],
      colors: [],
      typography: [],
      radius: [],
      shadows: [],
    };

    // --- Direct boundVariable translation (highest confidence path) ---
    // When Console MCP provides boundVariables from component children,
    // we can resolve variable IDs directly to token names without value scanning.
    const bvMap = component.boundVariableMap;
    // Track which layout properties were resolved via boundVariables so we
    // can fall through to value-based matching for the rest.
    const resolvedByBinding = new Set<string>();

    if (bvMap && bvMap.size > 0) {
      // Mapping of Figma boundVariable property names to our categories
      const spacingProps: Record<string, string> = {
        paddingLeft: 'padding-left',
        paddingRight: 'padding-right',
        paddingTop: 'padding-top',
        paddingBottom: 'padding-bottom',
        itemSpacing: 'item-spacing',
      };
      const radiusProps: Record<string, string> = {
        topLeftRadius: 'border-radius-top-left',
        topRightRadius: 'border-radius-top-right',
        bottomLeftRadius: 'border-radius-bottom-left',
        bottomRightRadius: 'border-radius-bottom-right',
        cornerRadius: 'border-radius',
      };
      const colorProps: Record<string, string> = {
        color: 'fill',
      };

      for (const [figmaProp, varId] of bvMap) {
        const varName = nameById.get(varId);
        if (!varName) continue; // Variable ID not found in bindings

        const cssProperty = spacingProps[figmaProp] ?? radiusProps[figmaProp] ?? colorProps[figmaProp];
        if (!cssProperty) continue; // Unknown property — skip

        let category: TokenCategory;
        if (spacingProps[figmaProp]) category = 'spacing';
        else if (radiusProps[figmaProp]) category = 'radius';
        else category = 'color';

        const result = this.translator.translate(varName, 0, category);

        const ref: TokenReference = {
          property: cssProperty,
          token: result.token,
          confidence: result.confidence,
          matchMethod: 'binding',
          primitive: result.primitive,
          semantic: result.semantic,
          delta: result.delta,
          rawValue: result.rawValue,
          suggestion: result.suggestion,
        };

        if (category === 'spacing') {
          usage.spacing.push(ref);
          resolvedByBinding.add(cssProperty);
        } else if (category === 'radius') {
          usage.radius.push(ref);
          resolvedByBinding.add(cssProperty);
        } else {
          usage.colors.push(ref);
        }
      }
    }

    // --- Layout-based spacing (fills gaps not covered by boundVariables) ---
    // Always attempt layout-based translation for properties that weren't
    // resolved via direct boundVariable binding above.
    {
      const layout = component.layout;

      if (layout.itemSpacing != null && !resolvedByBinding.has('item-spacing')) {
        const ref = this.translateProperty(
          'item-spacing', layout.itemSpacing, 'spacing', bindingMap,
        );
        usage.spacing.push(ref);
      }

      if (layout.padding) {
        const sides: Array<[string, number | undefined]> = [
          ['padding-top', layout.padding.top],
          ['padding-right', layout.padding.right],
          ['padding-bottom', layout.padding.bottom],
          ['padding-left', layout.padding.left],
        ];
        for (const [prop, value] of sides) {
          if (value != null && !resolvedByBinding.has(prop)) {
            usage.spacing.push(
              this.translateProperty(prop, value, 'spacing', bindingMap),
            );
          }
        }
      }

      // Corner radius from structured data (when not resolved via boundVariable)
      if (component.cornerRadius != null && usage.radius.length === 0) {
        usage.radius.push(
          this.translateProperty('border-radius', component.cornerRadius, 'radius', bindingMap),
        );
      }
    }

    // --- Fills from structured data (when no rawDesignContext) ---
    if (component.fills && component.fills.length > 0 && !component.rawDesignContext) {
      for (const fill of component.fills) {
        if (fill.color) {
          usage.colors.push(
            this.translateProperty('fill', fill.color, 'color', bindingMap),
          );
        }
      }
    }

    // --- Parse raw design context for colors, typography, radius, shadows ---
    const raw = component.rawDesignContext ?? '';

    // Colors: match CSS color properties
    const colorPatterns = [
      { pattern: /(?:background|background-color)\s*:\s*([^;}\n]+)/gi, prop: 'background' },
      { pattern: /(?:^|[^-])color\s*:\s*([^;}\n]+)/gim, prop: 'color' },
      { pattern: /border-color\s*:\s*([^;}\n]+)/gi, prop: 'border-color' },
      { pattern: /fill\s*:\s*([^;}\n]+)/gi, prop: 'fill' },
      { pattern: /stroke\s*:\s*([^;}\n]+)/gi, prop: 'stroke' },
    ];
    for (const { pattern, prop } of colorPatterns) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(raw)) !== null) {
        const value = match[1].trim();
        if (this.isColorValue(value)) {
          usage.colors.push(
            this.translateProperty(prop, value, 'color', bindingMap),
          );
        }
      }
    }

    // Typography: font-size, font-family, font-weight, line-height
    const typographyPatterns = [
      { pattern: /font-size\s*:\s*([^;}\n]+)/gi, prop: 'font-size' },
      { pattern: /font-weight\s*:\s*([^;}\n]+)/gi, prop: 'font-weight' },
      { pattern: /line-height\s*:\s*([^;}\n]+)/gi, prop: 'line-height' },
    ];
    for (const { pattern, prop } of typographyPatterns) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(raw)) !== null) {
        const value = match[1].trim();
        usage.typography.push(
          this.translateProperty(prop, value, 'typography', bindingMap),
        );
      }
    }

    // Radius: border-radius
    const radiusPattern = /border-radius\s*:\s*([^;}\n]+)/gi;
    let radiusMatch: RegExpExecArray | null;
    while ((radiusMatch = radiusPattern.exec(raw)) !== null) {
      const value = radiusMatch[1].trim();
      usage.radius.push(
        this.translateProperty('border-radius', value, 'radius', bindingMap),
      );
    }

    // Shadows: box-shadow
    const shadowPattern = /box-shadow\s*:\s*([^;}\n]+)/gi;
    let shadowMatch: RegExpExecArray | null;
    while ((shadowMatch = shadowPattern.exec(raw)) !== null) {
      const value = shadowMatch[1].trim();
      usage.shadows.push(
        this.translateProperty('box-shadow', value, 'shadow', bindingMap),
      );
    }

    return usage;
  }

  /**
   * Translate a single property value to a token reference.
   *
   * Checks the binding map for a variable whose resolved value matches
   * the raw value, then delegates to `translator.translate()`.
   */
  private translateProperty(
    property: string,
    rawValue: number | string,
    category: TokenCategory,
    bindingMap: Map<string, TokenBinding>,
  ): TokenReference {
    // Try to find a binding whose value matches this raw value
    const bindingName = this.findBindingForValue(rawValue, category, bindingMap);

    const result: TranslationResult = this.translator.translate(
      bindingName, rawValue, category,
    );

    return {
      property,
      token: result.token,
      confidence: result.confidence,
      matchMethod: result.matchMethod,
      primitive: result.primitive,
      semantic: result.semantic,
      delta: result.delta,
      rawValue: result.rawValue,
      suggestion: result.suggestion,
    };
  }

  /**
   * Find a binding variable name whose resolved value matches the given raw value.
   *
   * Searches the binding map for a variable of the matching type whose
   * first mode value equals the raw value. Returns the variable name
   * (for binding-first translation) or undefined if no binding found.
   */
  private findBindingForValue(
    rawValue: number | string,
    category: TokenCategory,
    bindingMap: Map<string, TokenBinding>,
  ): string | undefined {
    const expectedType = category === 'color' ? 'COLOR' : 'FLOAT';

    for (const [name, binding] of bindingMap) {
      if (binding.resolvedType !== expectedType) continue;

      // Check first mode value
      const modeValues = Object.values(binding.valuesByMode);
      if (modeValues.length === 0) continue;

      const firstValue = modeValues[0];

      // Skip alias objects — they don't carry resolved values
      if (firstValue != null && typeof firstValue === 'object') continue;

      if (typeof rawValue === 'number' && firstValue === rawValue) {
        return name;
      }
      if (String(rawValue) === String(firstValue)) {
        return name;
      }
    }

    return undefined;
  }

  /**
   * Check if a CSS value looks like a color (hex, rgb, rgba, hsl, named).
   */
  /**
     * Check if a CSS value looks like a color (hex, rgb, rgba, hsl, named).
     */
    private isColorValue(value: string): boolean {
      const v = value.toLowerCase().trim();

      // Exclude CSS keywords and non-color values
      const nonColorKeywords = new Set([
        'inherit', 'initial', 'unset', 'revert', 'none', 'transparent',
        'currentcolor', 'auto', 'normal',
      ]);
      if (nonColorKeywords.has(v)) return false;

      // Exclude url(), var() (non-color), calc(), etc.
      if (v.startsWith('url(') || v.startsWith('calc(')) return false;

      return (
        v.startsWith('#') ||
        v.startsWith('rgb') ||
        v.startsWith('hsl') ||
        v.startsWith('var(--color')
      );
    }

  // -------------------------------------------------------------------------
  // reconstructCompositeTokens (Task 3.7)
  // -------------------------------------------------------------------------

  /**
   * Reconstruct composite token references from Figma styles.
   *
   * Primary path: match style names directly to DTCG composite tokens
   * (names match because 054a pushed them with known names).
   *
   * Fallback path: if style name doesn't match, attempt property-by-property
   * reconstruction by searching the DTCG token tree for tokens whose
   * composite sub-values match the style's raw properties.
   *
   * Unmatched composites are flagged with ⚠️ confidence for Ada's review.
   *
   * @param styles - Figma styles read via figma-console-mcp.
   * @param dtcgTokens - The loaded DTCG token file for lookup.
   * @returns TokenReference[] with matched composite tokens.
   * @requirements Req 3 (Composite Token Reconstruction)
   */
  reconstructCompositeTokens(
    styles: FigmaStyle[],
    dtcgTokens: DTCGTokenFile,
  ): TokenReference[] {
    const results: TokenReference[] = [];

    for (const style of styles) {
      const category = style.type === 'EFFECT' ? 'shadow' : 'typography';

      // Primary path: direct name match against DTCG token tree
      const directMatch = this.lookupCompositeToken(style.name, category, dtcgTokens);
      if (directMatch) {
        results.push({
          property: category,
          token: directMatch.path,
          confidence: 'exact',
          matchMethod: 'binding',
          primitive: directMatch.path,
        });
        continue;
      }

      // Fallback path: property-by-property reconstruction
      const reconstructed = this.reconstructFromProperties(style, category, dtcgTokens);
      if (reconstructed) {
        results.push(reconstructed);
        continue;
      }

      // No match — flag for Ada's review
      results.push({
        property: category,
        token: '',
        confidence: 'no-match',
        matchMethod: 'value',
        delta: `Unmatched ${category} style "${style.name}" — requires Ada review`,
      });
    }

    return results;
  }

  /**
   * Look up a composite token by name in the DTCG token tree.
   *
   * Tries multiple name resolution strategies:
   * 1. Direct path: `{category}.{styleName}` (e.g. `shadow.elevation200`)
   * 2. Full style name as path (e.g. `shadow.elevation200` already dot-separated)
   * 3. Style name with dots converted from slashes
   *
   * @returns The token path and token object if found, or null.
   */
  private lookupCompositeToken(
    styleName: string,
    category: 'shadow' | 'typography',
    dtcgTokens: DTCGTokenFile,
  ): { path: string; token: object } | null {
    // Strategy 1: style name already includes category prefix (e.g. "shadow.elevation200")
    if (styleName.startsWith(`${category}.`)) {
      const token = this.resolveTokenPath(styleName, dtcgTokens);
      if (token) return { path: styleName, token };
    }

    // Strategy 2: prepend category (e.g. "elevation200" → "shadow.elevation200")
    const prefixedPath = `${category}.${styleName}`;
    const prefixedToken = this.resolveTokenPath(prefixedPath, dtcgTokens);
    if (prefixedToken) return { path: prefixedPath, token: prefixedToken };

    // Strategy 3: convert slashes to dots and try both with and without prefix
    const dotName = styleName.replace(/\//g, '.');
    if (dotName !== styleName) {
      if (dotName.startsWith(`${category}.`)) {
        const token = this.resolveTokenPath(dotName, dtcgTokens);
        if (token) return { path: dotName, token };
      }
      const prefixedDot = `${category}.${dotName}`;
      const token = this.resolveTokenPath(prefixedDot, dtcgTokens);
      if (token) return { path: prefixedDot, token };
    }

    return null;
  }

  /**
   * Resolve a dot-separated token path in the DTCG token tree.
   *
   * Walks the tree following each path segment and returns the node
   * if it has a `$value` (i.e. is a token, not just a group).
   */
  private resolveTokenPath(
    path: string,
    dtcgTokens: DTCGTokenFile,
  ): object | null {
    const parts = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = dtcgTokens;

    for (const part of parts) {
      if (current == null || typeof current !== 'object') return null;
      current = current[part];
    }

    if (current != null && typeof current === 'object' && '$value' in current) {
      return current;
    }

    return null;
  }

  /**
   * Attempt to reconstruct a composite token from raw style properties.
   *
   * For shadow styles: compares offsetX, offsetY, blur, spread, color
   * against all shadow tokens in the DTCG tree.
   *
   * For typography styles: compares fontFamily, fontSize, fontWeight,
   * lineHeight against all typography tokens in the DTCG tree.
   *
   * Returns an approximate-confidence match if a token's sub-values
   * match the style properties, or null if no reconstruction possible.
   */
  private reconstructFromProperties(
    style: FigmaStyle,
    category: 'shadow' | 'typography',
    dtcgTokens: DTCGTokenFile,
  ): TokenReference | null {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const group = (dtcgTokens as any)[category];
    if (!group || typeof group !== 'object') return null;

    const props = style.properties;
    let bestMatch: { path: string; score: number } | null = null;

    for (const [key, entry] of Object.entries(group)) {
      if (key.startsWith('$')) continue;
      if (entry == null || typeof entry !== 'object' || !('$value' in entry)) continue;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tokenValue = (entry as any).$value;
      if (tokenValue == null || typeof tokenValue !== 'object') continue;

      const score = category === 'shadow'
        ? this.scoreShadowMatch(props, tokenValue)
        : this.scoreTypographyMatch(props, tokenValue);

      if (score > 0 && (bestMatch === null || score > bestMatch.score)) {
        bestMatch = { path: `${category}.${key}`, score };
      }
    }

    if (bestMatch) {
      return {
        property: category,
        token: bestMatch.path,
        confidence: 'approximate',
        matchMethod: 'value',
        primitive: bestMatch.path,
        delta: `Reconstructed from properties (score: ${bestMatch.score}/4)`,
      };
    }

    return null;
  }

  /**
   * Score how well a Figma effect style's properties match a DTCG shadow token value.
   *
   * Compares offsetX, offsetY, blur, and spread. Each matching property
   * adds 1 to the score (max 4). Returns 0 if no properties match.
   */
  private scoreShadowMatch(
    styleProps: Record<string, unknown>,
    tokenValue: Record<string, unknown>,
  ): number {
    let score = 0;
    const fields = ['offsetX', 'offsetY', 'blur', 'spread'];

    for (const field of fields) {
      const styleProp = styleProps[field];
      const tokenProp = tokenValue[field];
      if (styleProp == null || tokenProp == null) continue;
      if (this.dimensionValuesMatch(styleProp, tokenProp)) score++;
    }

    return score;
  }

  /**
   * Score how well a Figma text style's properties match a DTCG typography token value.
   *
   * Compares fontFamily, fontSize, fontWeight, and lineHeight. Each matching
   * property adds 1 to the score (max 4). Returns 0 if no properties match.
   */
  private scoreTypographyMatch(
    styleProps: Record<string, unknown>,
    tokenValue: Record<string, unknown>,
  ): number {
    let score = 0;

    // fontFamily: string comparison
    if (styleProps.fontFamily != null && tokenValue.fontFamily != null) {
      if (String(styleProps.fontFamily) === String(tokenValue.fontFamily)) score++;
    }

    // fontSize: dimension comparison
    if (styleProps.fontSize != null && tokenValue.fontSize != null) {
      if (this.dimensionValuesMatch(styleProps.fontSize, tokenValue.fontSize)) score++;
    }

    // fontWeight: numeric comparison
    if (styleProps.fontWeight != null && tokenValue.fontWeight != null) {
      if (Number(styleProps.fontWeight) === Number(tokenValue.fontWeight)) score++;
    }

    // lineHeight: numeric comparison (may be unitless ratio or px)
    if (styleProps.lineHeight != null && tokenValue.lineHeight != null) {
      if (this.dimensionValuesMatch(styleProps.lineHeight, tokenValue.lineHeight)) score++;
    }

    return score;
  }

  /**
   * Compare two dimension values that may be numbers or strings with units.
   *
   * Handles: `24` vs `"24px"`, `"16px"` vs `"16px"`, `1.5` vs `1.5`.
   */
  private dimensionValuesMatch(a: unknown, b: unknown): boolean {
    // Both numeric
    const numA = typeof a === 'number' ? a : parseFloat(String(a));
    const numB = typeof b === 'number' ? b : parseFloat(String(b));

    if (!isNaN(numA) && !isNaN(numB)) {
      return numA === numB;
    }

    // String comparison as fallback
    return String(a) === String(b);
  }

  // ---------------------------------------------------------------------------
  // Behavioral contract detection (Task 3.8)
  // ---------------------------------------------------------------------------

  /**
   * Keywords that indicate an interactive component requiring behavioral contracts.
   * Matched case-insensitively against the component name.
   */
  private static readonly INTERACTIVE_KEYWORDS = [
    'button', 'input', 'toggle', 'switch', 'checkbox', 'radio',
    'select', 'dropdown', 'slider', 'tab', 'link', 'menu',
    'dialog', 'modal', 'tooltip', 'popover', 'accordion',
  ];

  /**
   * Keywords that indicate a static (non-interactive) component.
   * Matched case-insensitively against the component name.
   */
  private static readonly STATIC_KEYWORDS = [
    'badge', 'divider', 'icon', 'avatar', 'label', 'tag',
    'separator', 'spacer', 'image', 'logo', 'progress',
  ];

  /**
   * Classify a component as interactive or static based on keyword heuristics.
   *
   * Checks the component name against known interactive and static keywords.
   * If both match (unlikely but possible), interactive takes precedence because
   * missing behavioral contracts on an interactive component is a higher risk
   * than unnecessary contracts on a static one.
   *
   * @param componentName - The Figma component name.
   * @returns 'interactive' or 'static'.
   */
  private classifyComponent(componentName: string): 'interactive' | 'static' {
    const lower = componentName.toLowerCase();

    const isInteractive = DesignExtractor.INTERACTIVE_KEYWORDS.some(
      (kw) => lower.includes(kw),
    );
    if (isInteractive) return 'interactive';

    const isStatic = DesignExtractor.STATIC_KEYWORDS.some(
      (kw) => lower.includes(kw),
    );
    if (isStatic) return 'static';

    // Default: treat unknown components as interactive (safer — forces review)
    return 'interactive';
  }

  /**
   * Extract visual state names from a component's detected states.
   *
   * Filters for well-known interaction states: hover, focus, disabled, pressed,
   * active, selected, error, loading.
   */
  private extractVisualStates(states: StateDefinition[]): string[] {
    const knownStates = new Set([
      'hover', 'focus', 'disabled', 'pressed',
      'active', 'selected', 'error', 'loading',
      'long-press',
    ]);
    return states
      .map((s) => s.name.toLowerCase())
      .filter((name) => knownStates.has(name));
  }

  /**
   * Detect behavioral contract status for a component.
   *
   * Classifies the component as interactive or static using keyword heuristics,
   * extracts visual states from the Figma component, and flags missing
   * behavioral contracts for interactive components.
   *
   * For static components, auto-generates a "no interaction" contract.
   *
   * @param component - The extracted Figma component.
   * @returns BehavioralContractStatus with classification, states, and confidence.
   */
  detectBehavioralContracts(component: ExtractedComponent): BehavioralContractStatus {
    const classification = this.classifyComponent(component.name);
    const detectedStates = this.extractVisualStates(component.states);

    if (classification === 'static') {
      return {
        classification: 'static',
        detectedStates,
        contractsDefined: true,
        autoContract: 'No interaction — static display component',
        confidence: '✅',
      };
    }

    // Interactive component: flag missing behavioral contracts
    // Behavioral contracts are considered missing because Figma designs
    // don't encode interaction behavior — only visual states.
    // The actual contracts must be defined during spec review.
    const hasStates = detectedStates.length > 0;

    return {
      classification: 'interactive',
      detectedStates,
      contractsDefined: false,
      confidence: '❌',
    };
  }

  // -------------------------------------------------------------------------
  // detectPlatformParity (Task 3.9)
  // -------------------------------------------------------------------------

  /**
   * Detect platform-specific interactions and flag parity concerns.
   *
   * Applies heuristics to classify each detected visual state by platform
   * support (hover = web-only, focus = all platforms, long-press = mobile).
   * Optionally queries platform-implementation-guidelines.md via
   * DesignerPunk MCP for cross-reference validation.
   *
   * Provides decision options for platform-specific interactions:
   * omit on unsupported platform, map to alternative interaction, or
   * defer to human review.
   *
   * @param component - The extracted Figma component.
   * @returns PlatformParityCheck with interactions and concern status.
   * @requirements Req 7 (Platform Parity Detection)
   */
  async detectPlatformParity(component: ExtractedComponent): Promise<PlatformParityCheck> {
    const detectedStates = this.extractVisualStates(component.states);

    // Query platform guidelines for cross-reference (best-effort)
    let guidelinesContent: string | null = null;
    if (this.mcpDocs) {
      try {
        guidelinesContent = await this.mcpDocs.getSection(
          '.kiro/steering/platform-implementation-guidelines.md',
          'State Management Consistency',
        );
      } catch {
        // MCP unavailable — proceed with heuristics only
      }
    }

    const interactions: PlatformInteraction[] = [];

    for (const state of detectedStates) {
      const platforms = DesignExtractor.PLATFORM_HEURISTICS[state];
      if (!platforms) continue;

      const allPlatforms: ('web' | 'ios' | 'android')[] = ['web', 'ios', 'android'];
      const missingPlatforms = allPlatforms.filter((p) => !platforms.includes(p));

      // Only flag interactions that are NOT available on all platforms
      if (missingPlatforms.length === 0) continue;

      const recommendation = this.buildPlatformRecommendation(
        state,
        platforms,
        missingPlatforms,
        guidelinesContent,
      );

      interactions.push({
        interaction: state,
        platforms,
        recommendation,
      });
    }

    return {
      interactions,
      hasConcerns: interactions.length > 0,
    };
  }

  /**
   * Build a recommendation string for a platform-specific interaction.
   *
   * Includes decision options for the human reviewer: omit on unsupported
   * platforms, map to an alternative interaction, or provide a custom
   * approach.
   */
  private buildPlatformRecommendation(
    state: string,
    supportedPlatforms: ('web' | 'ios' | 'android')[],
    missingPlatforms: ('web' | 'ios' | 'android')[],
    guidelinesContent: string | null,
  ): string {
    const supported = supportedPlatforms.join(', ');
    const missing = missingPlatforms.join(', ');

    // State-specific recommendations
    if (state === 'hover') {
      return (
        `"${state}" is ${supported}-only (not available on ${missing}). ` +
        'Decision options: (a) omit hover feedback on mobile, ' +
        '(b) map to press/active state on mobile, ' +
        '(c) provide alternative visual feedback.' +
        (guidelinesContent ? ' Cross-referenced with platform-implementation-guidelines.md.' : '')
      );
    }

    if (state === 'long-press') {
      return (
        `"${state}" is ${supported}-only (not available on ${missing}). ` +
        'Decision options: (a) omit on web, ' +
        '(b) map to right-click/context menu on web, ' +
        '(c) provide alternative trigger.' +
        (guidelinesContent ? ' Cross-referenced with platform-implementation-guidelines.md.' : '')
      );
    }

    // Generic recommendation for other platform-limited states
    return (
      `"${state}" is available on ${supported} but not on ${missing}. ` +
      `Decision options: (a) omit on ${missing}, ` +
      '(b) map to equivalent interaction, ' +
      '(c) defer to human review.' +
      (guidelinesContent ? ' Cross-referenced with platform-implementation-guidelines.md.' : '')
    );
  }


  // -------------------------------------------------------------------------
  // detectComponentTokenDecisions (Task 3.10)
  // -------------------------------------------------------------------------

  /**
   * Detect repeated primitive token usage and surface component token
   * decision points for Ada's review.
   *
   * Scans all token categories in the usage map, groups references by
   * their resolved primitive token, and generates illustrative component
   * token suggestions for any primitive used two or more times.
   *
   * All suggestions are explicitly labeled as pending human review —
   * no autonomous token creation per governance.
   *
   * @param tokenUsage - Aggregated token usage from translateTokens().
   * @param componentName - Component name for illustrative naming.
   * @returns Array of decision points for Ada's review.
   */
  detectComponentTokenDecisions(
    tokenUsage: TokenUsage,
    componentName: string = 'component',
  ): ComponentTokenDecision[] {
    // Build a map of primitiveToken → list of property locations
    const usageMap = new Map<string, string[]>();

    const categories: Array<[keyof TokenUsage, string]> = [
      ['spacing', 'spacing'],
      ['colors', 'color'],
      ['typography', 'typography'],
      ['radius', 'radius'],
      ['shadows', 'shadow'],
    ];

    for (const [category] of categories) {
      const refs = tokenUsage[category];
      for (const ref of refs) {
        // Only consider matched tokens (not no-match)
        if (ref.confidence === 'no-match') continue;

        // Use the primitive token if available, otherwise the main token
        const primitiveKey = ref.primitive ?? ref.token;
        if (!primitiveKey) continue;

        const location = ref.property;
        const existing = usageMap.get(primitiveKey) ?? [];
        existing.push(location);
        usageMap.set(primitiveKey, existing);
      }
    }

    // Generate decisions for tokens used 2+ times
    const decisions: ComponentTokenDecision[] = [];
    const baseName = this.extractComponentBaseName(componentName);

    for (const [primitiveToken, locations] of usageMap) {
      if (locations.length < 2) continue;

      const propertyGroup = this.inferPropertyGroup(locations);
      const suggestion = `${baseName}.${propertyGroup} = ${primitiveToken}`;

      decisions.push({
        primitiveToken,
        usageCount: locations.length,
        locations,
        illustrativeSuggestion: suggestion,
        rationale:
          `${primitiveToken} is used across ${locations.length} properties ` +
          `(${locations.join(', ')}). Consistent usage suggests semantic ` +
          `intent that could be encoded as a component token.`,
      });
    }

    // Sort by usage count descending for prioritized review
    decisions.sort((a, b) => b.usageCount - a.usageCount);

    return decisions;
  }

  /**
   * Extract a short base name from a component name for illustrative
   * token naming.
   *
   * "ButtonCTA" → "button", "InputTextBase" → "input", "ContainerBase" → "container"
   */
  private extractComponentBaseName(componentName: string): string {
    // Split PascalCase into words, take the first word, lowercase it
    const words = componentName.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[\s_-]+/);
    return (words[0] ?? 'component').toLowerCase();
  }

  /**
   * Infer a property group name from a list of CSS property locations.
   *
   * Groups related properties into semantic names:
   * - padding-left, padding-right → "padding.horizontal"
   * - padding-top, padding-bottom → "padding.vertical"
   * - mixed padding → "padding"
   * - color, fill, background → "fill"
   * - border-radius → "radius"
   * - Otherwise uses the first property name.
   */
  private inferPropertyGroup(locations: string[]): string {
    const normalized = locations.map(l => l.toLowerCase());

    // Check for padding patterns
    const hasPaddingLeft = normalized.some(l => l.includes('padding-left') || l.includes('padding-inline-start'));
    const hasPaddingRight = normalized.some(l => l.includes('padding-right') || l.includes('padding-inline-end'));
    const hasPaddingTop = normalized.some(l => l.includes('padding-top') || l.includes('padding-block-start'));
    const hasPaddingBottom = normalized.some(l => l.includes('padding-bottom') || l.includes('padding-block-end'));
    const allPadding = normalized.every(l => l.includes('padding'));

    if (allPadding) {
      if ((hasPaddingLeft || hasPaddingRight) && !hasPaddingTop && !hasPaddingBottom) {
        return 'padding.horizontal';
      }
      if ((hasPaddingTop || hasPaddingBottom) && !hasPaddingLeft && !hasPaddingRight) {
        return 'padding.vertical';
      }
      return 'padding';
    }

    // Check for spacing patterns (item-spacing, gap, margin)
    if (normalized.every(l => l.includes('spacing') || l.includes('gap') || l.includes('margin'))) {
      return 'spacing';
    }

    // Check for color patterns
    if (normalized.every(l =>
      l.includes('color') || l.includes('fill') || l.includes('background') || l.includes('stroke'),
    )) {
      return 'fill';
    }

    // Check for radius
    if (normalized.every(l => l.includes('radius'))) {
      return 'radius';
    }

    // Check for shadow
    if (normalized.every(l => l.includes('shadow'))) {
      return 'shadow';
    }

    // Check for typography
    if (normalized.every(l =>
      l.includes('font') || l.includes('line-height') || l.includes('letter-spacing'),
    )) {
      return 'typography';
    }

    // Fallback: use the first property, cleaned up
    return normalized[0]?.replace(/[^a-z0-9.]/g, '-') ?? 'token';
  }

  /**
   * Validate mode consistency across token bindings.
   *
   * For each binding with multiple mode values, checks whether light and
   * dark mode values are identical. Discrepancies are categorized:
   *
   * - **expected**: Color tokens differ by mode (light/dark theme variations).
   * - **unexpected**: Spacing, radius, or typography tokens differ by mode
   *   (structural tokens should be mode-agnostic).
   *
   * @param bindings - Token bindings read from Figma.
   * @returns ModeValidationResult with discrepancies and a flag for unexpected ones.
   * @requirements Req 9 (Mode Consistency Validation)
   */
  validateModes(bindings: TokenBinding[]): ModeValidationResult {
    const discrepancies: ModeDiscrepancy[] = [];

    for (const binding of bindings) {
      const modeEntries = Object.entries(binding.valuesByMode);

      // Need at least two modes to compare
      if (modeEntries.length < 2) continue;

      // Identify light and dark mode entries by key name heuristic
      const lightKey = modeEntries.find(([k]) => /light/i.test(k));
      const darkKey = modeEntries.find(([k]) => /dark/i.test(k));

      // If we can't identify light/dark by name, compare first two modes
      const [modeA, modeB] = lightKey && darkKey
        ? [lightKey, darkKey]
        : [modeEntries[0], modeEntries[1]];

      const valueA = modeA[1];
      const valueB = modeB[1];

      // Skip alias objects — they reference other variables, not resolved values
      if (this.isAliasValue(valueA) || this.isAliasValue(valueB)) continue;

      // Compare values — use JSON.stringify for deep equality of objects
      if (this.modeValuesEqual(valueA, valueB)) continue;

      // Values differ — categorize the discrepancy
      const category = binding.resolvedType === 'COLOR' ? 'expected' : 'unexpected';

      discrepancies.push({
        variableName: binding.variableName,
        lightValue: valueA,
        darkValue: valueB,
        category,
      });
    }

    return {
      discrepancies,
      hasUnexpectedDiscrepancies: discrepancies.some(d => d.category === 'unexpected'),
    };
  }

  /**
   * Resolve variable IDs from boundVariableMap that aren't in the bindings.
   *
   * When `figma_get_token_values` (limit: 500) doesn't return all variables,
   * some boundVariable IDs from the component tree won't resolve in the
   * `nameById` lookup during `translateTokens`. This method uses
   * `figma_execute` with Plugin API to batch-resolve those missing IDs,
   * returning synthetic TokenBinding entries that can be appended to the
   * bindings array.
   *
   * @param fileKey - The Figma file key.
   * @param boundVariableMap - Property→variableId map from component extraction.
   * @param existingBindings - Bindings already loaded from figma_get_token_values.
   * @returns Additional TokenBinding entries for previously unresolved IDs.
   */
  async resolveUnknownVariableIds(
    fileKey: string,
    boundVariableMap: Map<string, string>,
    existingBindings: TokenBinding[],
  ): Promise<TokenBinding[]> {
    if (!boundVariableMap || boundVariableMap.size === 0) return [];

    // Build set of known variable IDs
    const knownIds = new Set<string>();
    for (const binding of existingBindings) {
      if (binding.variableId) knownIds.add(binding.variableId);
    }

    // Collect unresolved IDs (deduplicated)
    const unresolvedIds = new Set<string>();
    for (const varId of boundVariableMap.values()) {
      if (!knownIds.has(varId)) unresolvedIds.add(varId);
    }

    if (unresolvedIds.size === 0) return [];

    // Batch-resolve via Plugin API
    const idsArray = [...unresolvedIds];
    const code = `
      const results = {};
      for (const id of ${JSON.stringify(idsArray)}) {
        try {
          const v = figma.variables.getVariableById(id);
          if (v) {
            results[id] = {
              name: v.name,
              resolvedType: v.resolvedType,
              id: v.id,
            };
          }
        } catch (e) {
          // Variable not found — skip
        }
      }
      return results;
    `.trim();

    try {
      const result = await this.consoleMcp.execute(fileKey, code);

      // Parse the result — may be wrapped in various formats
      let resolved: Record<string, { name: string; resolvedType: string; id: string }> = {};
      if (result && typeof result === 'object') {
        // Handle { result: { ... } } wrapper from figma_execute
        const raw = result as Record<string, unknown>;
        const inner = raw.result ?? raw;
        if (inner && typeof inner === 'object') {
          resolved = inner as typeof resolved;
        }
      }

      const additionalBindings: TokenBinding[] = [];
      for (const [varId, info] of Object.entries(resolved)) {
        if (!info?.name) continue;
        additionalBindings.push({
          variableName: info.name,
          variableId: varId,
          collectionName: this.inferCollectionFromName(info.name, false),
          resolvedType: (info.resolvedType ?? 'FLOAT') as TokenBinding['resolvedType'],
          valuesByMode: {},
          isAlias: false,
        });
      }

      return additionalBindings;
    } catch {
      // Plugin API resolution failed — return empty (value-based fallback still works)
      return [];
    }
  }



  /**
   * Check whether a mode value is an alias reference (not a resolved value).
   */
  private isAliasValue(value: unknown): boolean {
    return (
      value != null &&
      typeof value === 'object' &&
      'aliasOf' in (value as Record<string, unknown>)
    );
  }

  /**
   * Compare two mode values for equality.
   *
   * Handles primitives (number, string) directly and falls back to
   * JSON.stringify for object values (e.g. color objects).
   */
  private modeValuesEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object' && a !== null && b !== null) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return false;
  }


  /**
   * Extract a Figma component and produce a complete DesignOutline.
   *
   * Orchestrates all extraction steps: reading component structure,
   * token bindings, styles, context queries, translation, behavioral
   * analysis, platform parity, and mode validation.
   *
   * @param figmaFileKey - The Figma file key.
   * @param componentNodeId - The node ID of the component to extract.
   * @returns A DesignOutline ready for markdown generation.
   */
  async extractDesign(
    figmaFileKey: string,
    componentNodeId: string,
  ): Promise<DesignOutline> {
    // Step 1–3: Read component structure, token bindings, and styles in parallel
    const [component, bindings, styles] = await Promise.all([
      this.readFigmaComponent(figmaFileKey, componentNodeId),
      this.readTokenBindings(figmaFileKey),
      this.readStyles(figmaFileKey),
    ]);

    // Step 3b: Resolve any boundVariable IDs not found in token bindings.
    // figma_get_token_values (limit: 500) may not return all variables,
    // so we use Plugin API to resolve missing IDs for binding-first translation.
    if (component.boundVariableMap && component.boundVariableMap.size > 0) {
      const additionalBindings = await this.resolveUnknownVariableIds(
        figmaFileKey,
        component.boundVariableMap,
        bindings,
      );
      if (additionalBindings.length > 0) {
        bindings.push(...additionalBindings);
      }
    }

    // Step 4: Query Component-Family and readiness context
    const context = await this.queryContext(component.name);

    // Step 5: Translate all component values to DesignerPunk tokens
    const tokenUsage = this.translateTokens(component, bindings);

    // Step 6: Reconstruct composite tokens from Figma styles
    const compositeTokens = this.reconstructCompositeTokens(
      styles,
      this.translator.getDtcgTokens(),
    );

    // Merge composite tokens into tokenUsage
    for (const ref of compositeTokens) {
      if (ref.property === 'shadow') {
        tokenUsage.shadows.push(ref);
      } else if (ref.property === 'typography') {
        tokenUsage.typography.push(ref);
      }
    }

    // Step 7: Detect behavioral contracts (interactive vs static)
    const behavioralContracts = this.detectBehavioralContracts(component);

    // Step 8: Detect platform parity concerns
    const platformParity = await this.detectPlatformParity(component);

    // Step 9: Surface component token decision points
    const componentTokenDecisions = this.detectComponentTokenDecisions(
      tokenUsage,
      component.name,
    );

    // Step 10: Validate light/dark mode consistency
    const modeValidation = this.validateModes(bindings);

    // Run variant analysis via VariantAnalyzer
    const analyzerComponent = {
      name: component.name,
      description: component.description,
      variants: component.variants.map((v) => ({
        name: v.name,
        properties: v.properties,
      })),
      states: component.states.map((s) => s.name),
    };
    const variantMapping = await this.analyzer.analyzeVariants(
      analyzerComponent,
      context,
    );

    // Build inheritance pattern from family context
    const inheritancePattern: InheritancePattern | undefined =
      context.familyPattern
        ? {
            familyName: context.familyPattern.familyName,
            pattern: context.familyPattern.inheritancePattern,
          }
        : undefined;

    // Calculate overall extraction confidence (includes conflict detection)
    const extractionConfidence = this.calculateConfidence(
      tokenUsage,
      behavioralContracts,
      modeValidation,
      context,
      variantMapping,
    );

    return {
      componentName: component.name,
      description: component.description,
      variants: component.variants,
      states: component.states,
      properties: component.properties,
      tokenUsage,
      inheritancePattern,
      variantMapping,
      behavioralContracts,
      platformParity,
      componentTokenDecisions,
      modeValidation,
      extractionConfidence,
    };
  }

  /**
   * Calculate overall extraction confidence from individual results.
   *
   * Aggregates exact, approximate, and no-match counts across all token
   * references. Flags human input as required when no-match tokens exist,
   * behavioral contracts are missing for interactive components, or
   * unexpected mode discrepancies are found.
   */
  private calculateConfidence(
      tokenUsage: TokenUsage,
      behavioralContracts: BehavioralContractStatus,
      modeValidation: ModeValidationResult,
      context: ExtractionContext,
      variantMapping?: VariantMapping,
    ): ConfidenceReport {
      const allRefs = [
        ...tokenUsage.spacing,
        ...tokenUsage.colors,
        ...tokenUsage.typography,
        ...tokenUsage.radius,
        ...tokenUsage.shadows,
      ];

      const exactMatches = allRefs.filter((r) => r.confidence === 'exact').length;
      const approximateMatches = allRefs.filter((r) => r.confidence === 'approximate').length;
      const noMatches = allRefs.filter((r) => r.confidence === 'no-match').length;

      const reviewItems: string[] = [];

      // Flag no-match tokens
      if (noMatches > 0) {
        reviewItems.push(`${noMatches} token value(s) could not be matched — requires human decision`);
      }

      // Flag missing behavioral contracts for interactive components
      if (behavioralContracts.classification === 'interactive' && !behavioralContracts.contractsDefined) {
        reviewItems.push(
          'Missing behavioral contracts for interactive component — define before proceeding to requirements.md',
        );
      }

      // Flag unexpected mode discrepancies
      if (modeValidation.hasUnexpectedDiscrepancies) {
        const unexpected = modeValidation.discrepancies.filter((d) => d.category === 'unexpected');
        reviewItems.push(
          `${unexpected.length} unexpected mode discrepancy(ies) found — structural tokens differ between modes`,
        );
      }

      // Flag missing Component-Family doc — extraction continues with ⚠️ confidence
      if (!context.familyPattern) {
        reviewItems.push(
          'Component-Family doc not found. Recommend creating it before proceeding. '
          + 'See .kiro/steering/Component-Family-Template.md for the template.',
        );
      }

      // Flag conflicting variant mapping recommendations — requires human decision
      const hasConflicts = variantMapping != null && variantMapping.conflicts.length > 0;
      if (hasConflicts) {
        reviewItems.push(
          `${variantMapping!.conflicts.length} variant mapping conflict(s) — family pattern and behavioral analysis disagree. Human decision required.`,
        );
      }

      const requiresHumanInput = noMatches > 0
        || (behavioralContracts.classification === 'interactive' && !behavioralContracts.contractsDefined)
        || modeValidation.hasUnexpectedDiscrepancies
        || hasConflicts;

      // Determine overall confidence level
      let overall: 'high' | 'medium' | 'low';
      if (noMatches === 0 && approximateMatches === 0 && !requiresHumanInput) {
        overall = 'high';
      } else if (noMatches === 0 && !requiresHumanInput) {
        overall = 'medium';
      } else {
        overall = 'low';
      }

      return {
        overall,
        exactMatches,
        approximateMatches,
        noMatches,
        requiresHumanInput,
        reviewItems,
      };
    }

  /**
   * Generate a design-outline.md markdown document from a DesignOutline.
   *
   * Includes all required sections with confidence flags (✅ ⚠️ ❌),
   * context-aware recommendations, and human action items.
   *
   * @param outline - The DesignOutline to render as markdown.
   * @returns Markdown string for design-outline.md.
   */
  generateDesignOutlineMarkdown(outline: DesignOutline): string {
    const sections: string[] = [];

    sections.push(this.renderHeader(outline));
    sections.push(this.renderComponentPurpose(outline));
    sections.push(this.renderVariants(outline));
    sections.push(this.renderStates(outline));
    sections.push(this.renderTokenUsage(outline.tokenUsage));
    sections.push(this.renderAccessibility(outline));
    sections.push(this.renderPlatformBehaviors(outline));
    sections.push(this.renderEdgeCases(outline));
    sections.push(this.renderExtractionConfidence(outline.extractionConfidence));
    sections.push(this.renderInheritancePattern(outline));
    sections.push(this.renderBehavioralContracts(outline.behavioralContracts));
    sections.push(this.renderPlatformParity(outline.platformParity));
    sections.push(this.renderComponentTokenNeeds(outline.componentTokenDecisions));
    sections.push(this.renderAccessibilityContracts(outline));

    // Include no-match pause report when unmatched values exist
    const noMatchSection = this.renderNoMatchReport(outline.tokenUsage);
    if (noMatchSection) {
      sections.push(noMatchSection);
    }

    return sections.join('\n');
  }

  // ---------------------------------------------------------------------------
  // Markdown section renderers (private)
  // ---------------------------------------------------------------------------

  private renderHeader(outline: DesignOutline): string {
    return `# Design Outline: ${outline.componentName}\n\n` +
      `**Generated**: ${new Date().toISOString().split('T')[0]}\n` +
      `**Extraction Confidence**: ${this.overallConfidenceFlag(outline.extractionConfidence)}\n` +
      `**Status**: Pending Human Review\n\n---\n`;
  }

  private renderComponentPurpose(outline: DesignOutline): string {
    return `\n## Component Purpose\n\n` +
      `**Name**: \`${outline.componentName}\`\n` +
      `**Description**: ${outline.description || '_No description extracted_'}\n` +
      `**Properties**: ${outline.properties.length} defined\n`;
  }

  private renderVariants(outline: DesignOutline): string {
    let md = `\n## Variants\n\n`;
    if (outline.variants.length === 0) {
      md += '_No variants detected._\n';
    } else {
      md += `| Variant | Properties |\n|---------|------------|\n`;
      for (const v of outline.variants) {
        const props = Object.entries(v.properties)
          .map(([k, val]) => `${k}=${val}`)
          .join(', ');
        md += `| ${v.name} | ${props || '—'} |\n`;
      }
    }

    // Context-aware recommendations from VariantAnalyzer
    if (outline.variantMapping) {
      md += this.renderVariantRecommendations(outline.variantMapping);
    }

    return md;
  }

  private renderVariantRecommendations(mapping: VariantMapping): string {
      let md = `\n### Variant Mapping Recommendations\n\n`;

      // Flag reduced confidence when Component-Family doc is missing
      if (!mapping.familyPattern) {
        md += `> ⚠️ **Reduced Confidence** — Component-Family-${mapping.componentName}.md not found. `
          + `Recommend creating it before proceeding. `
          + `See \`.kiro/steering/Component-Family-Template.md\` for the template.\n\n`;
      }

      md += `**Behavioral Classification**: ${mapping.behavioralClassification}\n\n`;

      for (const rec of mapping.recommendations) {
        const marker = rec.recommended ? '⭐ **Recommended**' : '';
        md += `#### ${rec.option} ${marker}\n\n`;
        md += `${rec.description}\n\n`;
        md += `**Rationale**: ${rec.rationale}\n`;
        if (rec.alignsWith.length > 0) {
          md += `**Aligns with**: ${rec.alignsWith.join(', ')}\n`;
        }
        if (rec.tradeoffs.length > 0) {
          md += `**Tradeoffs**: ${rec.tradeoffs.join('; ')}\n`;
        }
        md += '\n';
      }

      if (mapping.conflicts.length > 0) {
        md += `### ⚠️ Mapping Conflicts\n\n`;
        md += `> **Human Decision Required** — Family pattern and behavioral analysis disagree.\n\n`;
        for (const c of mapping.conflicts) {
          md += `- **Family recommends**: ${c.familyRecommendation}\n`;
          md += `  **Behavioral analysis recommends**: ${c.behavioralRecommendation}\n`;
          md += `  **Explanation**: ${c.explanation}\n\n`;
        }
      }

      return md;
    }

  private renderStates(outline: DesignOutline): string {
    let md = `\n## States\n\n`;
    if (outline.states.length === 0) {
      md += '_No visual states detected._\n';
    } else {
      for (const s of outline.states) {
        md += `- **${s.name}**`;
        if (s.description) md += `: ${s.description}`;
        md += '\n';
      }
    }
    return md;
  }

  private renderTokenUsage(usage: TokenUsage): string {
    let md = `\n## Token Usage\n\n`;

    const categories: { label: string; refs: TokenReference[] }[] = [
      { label: 'Spacing', refs: usage.spacing },
      { label: 'Colors', refs: usage.colors },
      { label: 'Typography', refs: usage.typography },
      { label: 'Radius', refs: usage.radius },
      { label: 'Shadows', refs: usage.shadows },
    ];

    for (const cat of categories) {
      md += `### ${cat.label}\n\n`;
      if (cat.refs.length === 0) {
        md += '_None detected._\n\n';
        continue;
      }
      md += `| Property | Token | Confidence | Method |\n`;
      md += `|----------|-------|------------|--------|\n`;
      for (const ref of cat.refs) {
        const flag = this.confidenceFlag(ref.confidence);
        const tokenDisplay = ref.semantic
          ? `\`${ref.semantic}\` (primitive: \`${ref.primitive || ref.token}\`)`
          : `\`${ref.token}\``;
        const delta = ref.delta ? ` (${ref.delta})` : '';
        md += `| ${ref.property} | ${tokenDisplay} | ${flag} ${ref.confidence}${delta} | ${ref.matchMethod} |\n`;
      }
      md += '\n';
    }

    return md;
  }

  private renderAccessibility(outline: DesignOutline): string {
    let md = `\n## Accessibility\n\n`;
    const isInteractive = outline.behavioralContracts.classification === 'interactive';

    if (isInteractive) {
      md += `**Component Type**: Interactive\n\n`;
      md += `**Required Considerations**:\n`;
      md += `- Keyboard navigation support\n`;
      md += `- ARIA role and attributes\n`;
      md += `- Focus indicator visibility\n`;
      md += `- Screen reader announcements\n`;

      const hasFocus = outline.states.some(
        (s) => s.name.toLowerCase().includes('focus'),
      );
      if (!hasFocus) {
        md += `\n⚠️ **No focus state detected** — interactive components require visible focus indicators.\n`;
      }
    } else {
      md += `**Component Type**: Static\n\n`;
      md += `**Required Considerations**:\n`;
      md += `- Semantic HTML element selection\n`;
      md += `- Color contrast compliance\n`;
    }

    return md;
  }

  private renderPlatformBehaviors(outline: DesignOutline): string {
    let md = `\n## Platform Behaviors\n\n`;

    if (outline.platformParity.interactions.length === 0) {
      md += '_No platform-specific behaviors detected._\n';
      return md;
    }

    md += `| Interaction | Platforms | Recommendation |\n`;
    md += `|-------------|-----------|----------------|\n`;
    for (const pi of outline.platformParity.interactions) {
      md += `| ${pi.interaction} | ${pi.platforms.join(', ')} | ${pi.recommendation} |\n`;
    }

    return md;
  }

  private renderEdgeCases(outline: DesignOutline): string {
    let md = `\n## Edge Cases\n\n`;
    const items: string[] = [];

    // No-match tokens
    const noMatches = this.collectNoMatchTokens(outline.tokenUsage);
    if (noMatches.length > 0) {
      items.push(`**Off-system values detected** (${noMatches.length}): ${noMatches.map((r) => `\`${r.property}\``).join(', ')} — require human decision`);
    }

    // Mode discrepancies
    if (outline.modeValidation?.hasUnexpectedDiscrepancies) {
      const unexpected = outline.modeValidation.discrepancies.filter(
        (d) => d.category === 'unexpected',
      );
      items.push(`**Unexpected mode discrepancies** (${unexpected.length}): ${unexpected.map((d) => `\`${d.variableName}\``).join(', ')}`);
    }

    // Missing behavioral contracts for interactive components
    if (
      outline.behavioralContracts.classification === 'interactive' &&
      !outline.behavioralContracts.contractsDefined
    ) {
      items.push('**Missing behavioral contracts** — interactive component requires explicit contracts before spec formalization');
    }

    if (items.length === 0) {
      md += '_No edge cases flagged._\n';
    } else {
      for (const item of items) {
        md += `- ${item}\n`;
      }
    }

    return md;
  }

  private renderExtractionConfidence(confidence: ConfidenceReport): string {
    let md = `\n## Extraction Confidence\n\n`;
    md += `**Overall**: ${this.overallConfidenceFlag(confidence)} ${confidence.overall}\n\n`;
    md += `| Metric | Count |\n|--------|-------|\n`;
    md += `| ✅ Exact matches | ${confidence.exactMatches} |\n`;
    md += `| ⚠️ Approximate matches | ${confidence.approximateMatches} |\n`;
    md += `| ❌ No matches | ${confidence.noMatches} |\n\n`;

    if (confidence.requiresHumanInput) {
      md += `> **⚠️ Human Input Required** — Review the items below before proceeding to spec formalization.\n\n`;
      for (const item of confidence.reviewItems) {
        md += `- ${item}\n`;
      }
    }

    return md;
  }

  private renderInheritancePattern(outline: DesignOutline): string {
      let md = `\n## Inheritance Pattern\n\n`;
      if (!outline.inheritancePattern) {
        const familyName = outline.variantMapping?.componentName
          ?? (outline.componentName.replace(
            /(?:Base|CTA|Primary|Secondary|Tertiary|Default|Large|Small|Medium)$/i,
            '',
          ) || outline.componentName);
        md += `⚠️ Component-Family-${familyName}.md not found. Recommend creating it before proceeding.\n\n`;
        md += `See \`.kiro/steering/Component-Family-Template.md\` for the template.\n`;
        return md;
      }
      const ip = outline.inheritancePattern;
      md += `**Family**: ${ip.familyName}\n`;
      md += `**Pattern**: ${ip.pattern}\n`;
      if (ip.baseComponent) {
        md += `**Base Component**: \`${ip.baseComponent}\`\n`;
      }
      return md;
    }

  private renderBehavioralContracts(
    contracts: BehavioralContractStatus,
  ): string {
    let md = `\n## Behavioral Contracts\n\n`;
    md += `**Classification**: ${contracts.classification} ${contracts.confidence}\n`;
    md += `**Detected States**: ${contracts.detectedStates.length > 0 ? contracts.detectedStates.join(', ') : '_none_'}\n`;
    md += `**Contracts Defined**: ${contracts.contractsDefined ? 'Yes' : 'No'}\n`;

    if (contracts.autoContract) {
      md += `\n**Auto-generated Contract**: ${contracts.autoContract}\n`;
    }

    if (
      contracts.classification === 'interactive' &&
      !contracts.contractsDefined
    ) {
      md += `\n> ❌ **Action Required** — Define behavioral contracts for this interactive component before proceeding to requirements.md.\n`;
    }

    return md;
  }

  private renderPlatformParity(parity: PlatformParityCheck): string {
    let md = `\n## Platform Parity\n\n`;
    if (!parity.hasConcerns) {
      md += '✅ No platform parity concerns detected.\n';
      return md;
    }

    md += `⚠️ **Platform parity concerns detected** — review recommendations below.\n\n`;
    for (const pi of parity.interactions) {
      md += `- **${pi.interaction}** (${pi.platforms.join(', ')}): ${pi.recommendation}\n`;
    }

    return md;
  }

  private renderComponentTokenNeeds(
    decisions: ComponentTokenDecision[],
  ): string {
    let md = `\n## Component Token Needs\n\n`;
    if (decisions.length === 0) {
      md += '_No repeated primitive token usage patterns detected._\n';
      return md;
    }

    for (let i = 0; i < decisions.length; i++) {
      const d = decisions[i];
      md += `### Pattern ${i + 1}: ${d.illustrativeSuggestion}\n\n`;
      md += `**Primitive Token**: \`${d.primitiveToken}\`\n`;
      md += `**Usage Count**: ${d.usageCount} locations\n\n`;
      md += `**Usage Context**:\n`;
      for (const loc of d.locations) {
        md += `- ${loc}\n`;
      }
      md += `\n**Illustrative Suggestion** (pending Ada review):\n`;
      md += `\`\`\`\n${d.illustrativeSuggestion}\n\`\`\`\n\n`;
      md += `**Rationale**: ${d.rationale}\n\n`;
      md += `**Ada Decision Required**: Evaluate whether component tokens align with Token Governance standards.\n\n`;
    }

    return md;
  }

  private renderAccessibilityContracts(outline: DesignOutline): string {
    let md = `\n## Accessibility Contracts\n\n`;
    const isInteractive = outline.behavioralContracts.classification === 'interactive';

    if (isInteractive) {
      md += `**Component Type**: Interactive\n\n`;
      md += `| Contract | Status |\n|----------|--------|\n`;

      const hasFocus = outline.states.some(
        (s) => s.name.toLowerCase().includes('focus'),
      );
      const hasDisabled = outline.states.some(
        (s) => s.name.toLowerCase().includes('disabled'),
      );

      md += `| Focus visible indicator | ${hasFocus ? '✅ Detected' : '❌ Missing'} |\n`;
      md += `| Disabled state handling | ${hasDisabled ? '✅ Detected' : '⚠️ Not detected'} |\n`;
      md += `| Keyboard activation | ⚠️ Requires implementation review |\n`;
      md += `| ARIA role assignment | ⚠️ Requires implementation review |\n`;
    } else {
      md += `**Component Type**: Static\n\n`;
      md += `| Contract | Status |\n|----------|--------|\n`;
      md += `| Semantic HTML | ⚠️ Requires implementation review |\n`;
      md += `| Color contrast | ⚠️ Requires implementation review |\n`;
    }

    return md;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private confidenceFlag(level: ConfidenceLevel): string {
    switch (level) {
      case 'exact':
        return '✅';
      case 'approximate':
        return '⚠️';
      case 'no-match':
        return '❌';
    }
  }

  private overallConfidenceFlag(confidence: ConfidenceReport): string {
    switch (confidence.overall) {
      case 'high':
        return '✅';
      case 'medium':
        return '⚠️';
      case 'low':
        return '❌';
    }
  }

  private collectNoMatchTokens(usage: TokenUsage): TokenReference[] {
    const all = [
      ...usage.spacing,
      ...usage.colors,
      ...usage.typography,
      ...usage.radius,
      ...usage.shadows,
    ];
    return all.filter((r) => r.confidence === 'no-match');
  }

  /**
   * Build a structured no-match report from unmatched token references.
   *
   * Each entry includes the property name, raw Figma value, closest
   * suggestion (if any), delta, and resolution options for human review.
   */
  formatNoMatchReport(usage: TokenUsage): NoMatchEntry[] {
    const noMatches = this.collectNoMatchTokens(usage);
    return noMatches.map((ref) => ({
      property: ref.property,
      figmaValue: ref.rawValue ?? ref.token,
      closestMatch: ref.suggestion,
      delta: ref.delta,
      options: [
        ref.suggestion
          ? `Map to suggested token: \`${ref.suggestion}\``
          : 'No close match available — consider creating a new token',
        'Document as off-system value',
        'Request new token creation',
      ],
    }));
  }

  /**
   * Render the no-match pause report as a markdown section.
   *
   * Only included in the design outline when no-match values exist.
   * Provides actionable options for each unmatched value.
   */
  private renderNoMatchReport(usage: TokenUsage): string {
    const entries = this.formatNoMatchReport(usage);
    if (entries.length === 0) return '';

    let md = `\n## ❌ Unmatched Values — Human Decision Required\n\n`;
    md += `The following Figma values could not be matched to DesignerPunk tokens. `;
    md += `Each requires a human decision before proceeding to spec formalization.\n\n`;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      md += `### ${i + 1}. \`${entry.property}\`\n\n`;
      md += `**Figma Value**: \`${entry.figmaValue}\`\n`;
      if (entry.closestMatch) {
        md += `**Closest Match**: \`${entry.closestMatch}\``;
        if (entry.delta) {
          md += ` (${entry.delta})`;
        }
        md += '\n';
      } else {
        md += `**Closest Match**: _none_\n`;
      }
      md += `\n**Options**:\n`;
      for (const option of entry.options) {
        md += `- ${option}\n`;
      }
      md += '\n';
    }

    return md;
  }
}
