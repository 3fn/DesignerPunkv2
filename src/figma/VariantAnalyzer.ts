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
   * Query a Component-Family doc via DesignerPunk MCP and extract the
   * inheritance pattern, behavioral contracts, and token usage patterns.
   *
   * Returns `null` when the doc does not exist (caller should flag for
   * recommendation to create the doc).
   */
  async queryFamilyPattern(familyName: string): Promise<FamilyPattern | null> {
    const docPath = `.kiro/steering/Component-Family-${familyName}.md`;
    const content = await this.mcp.getDocumentFull(docPath);

    if (content === null) {
      return null;
    }

    const inheritancePattern = this.extractSection(content, 'Inheritance Structure');
    const behavioralContracts = this.extractBehavioralContracts(content);
    const tokenUsagePatterns = this.extractTokenUsagePatterns(content);

    return {
      familyName,
      inheritancePattern,
      behavioralContracts,
      tokenUsagePatterns,
      rawContent: content,
    };
  }

  /**
   * Query Component-Readiness-Status via DesignerPunk MCP and return the
   * status of components belonging to the given family.
   *
   * Parses the markdown table under "Individual Component Status" and
   * filters rows whose Family column matches `familyName` (case-insensitive).
   *
   * Returns an empty array when the section is unavailable or contains no
   * matching components.
   */
  async queryExistingComponents(familyName: string): Promise<ComponentStatus[]> {
    const docPath = '.kiro/steering/Component-Readiness-Status.md';
    const section = await this.mcp.getSection(docPath, 'Individual Component Status');

    if (section === null) {
      return [];
    }

    return this.parseComponentStatusTable(section, familyName);
  }

  // -------------------------------------------------------------------------
  // Table parsing helpers
  // -------------------------------------------------------------------------

  /**
   * Parse the Component-Readiness-Status markdown table and return entries
   * whose Family column matches `familyName` (case-insensitive).
   *
   * Expected table format:
   * | Component | Family | Status | Implementation Path |
   * |-----------|--------|--------|---------------------|
   * | ButtonCTA | Buttons | 🟢 Production Ready | `src/components/...` |
   */
  private parseComponentStatusTable(
    content: string,
    familyName: string,
  ): ComponentStatus[] {
    const results: ComponentStatus[] = [];
    const lowerFamily = familyName.toLowerCase();

    // Match table rows: | col1 | col2 | col3 | col4 |
    const rowPattern = /^\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|/gm;
    let match: RegExpExecArray | null;

    while ((match = rowPattern.exec(content)) !== null) {
      const componentName = match[1].trim();
      const family = match[2].trim();
      const statusCell = match[3].trim();
      const pathCell = match[4].trim();

      // Skip header row and separator row
      if (
        componentName === 'Component' ||
        componentName.startsWith('-')
      ) {
        continue;
      }

      // Filter by family (case-insensitive)
      if (family.toLowerCase() !== lowerFamily) {
        continue;
      }

      // Extract implementation path from backtick-wrapped value
      const pathMatch = pathCell.match(/`([^`]+)`/);
      const implPath = pathMatch ? pathMatch[1] : undefined;

      results.push({
        name: componentName,
        status: this.parseStatusEmoji(statusCell),
        path: implPath,
      });
    }

    return results;
  }

  /**
   * Map status emoji indicators to ComponentStatus status values.
   *
   * 🟢 Production Ready → 'implemented'
   * 🟡 Beta             → 'implemented'
   * ⚠️ Deprecated        → 'deprecated'
   * 🔴 Planned          → 'planned'
   * Anything else       → 'unknown'
   */
  private parseStatusEmoji(statusCell: string): ComponentStatus['status'] {
    if (statusCell.includes('Production Ready')) return 'implemented';
    if (statusCell.includes('Beta')) return 'implemented';
    if (statusCell.includes('Deprecated')) return 'deprecated';
    if (statusCell.includes('Planned')) return 'planned';
    return 'unknown';
  }

  /**
   * Classify whether a set of variants differ in behavior or only in styling.
   *
   * A variant set is classified as 'behavioral' when at least one variant
   * has interactive behavior (`hasInteraction`) while another does not, or
   * when variants expose structurally different property sets (indicating
   * different component contracts). Otherwise the differences are purely
   * visual ('styling').
   *
   * @param variants - The Figma variants to analyze.
   * @returns 'behavioral' when interaction patterns differ, 'styling' when
   *          only visual properties change across variants.
   */
  analyzeBehavioralDifferences(variants: FigmaVariant[]): 'behavioral' | 'styling' {
    if (variants.length <= 1) return 'styling';

    // --- Check 1: Interaction pattern divergence ---
    // If some variants are interactive and others are not, the difference
    // is behavioral (e.g., a disabled variant that removes onClick).
    const interactionFlags = variants.map((v) => Boolean(v.hasInteraction));
    const hasInteractive = interactionFlags.some((f) => f);
    const hasNonInteractive = interactionFlags.some((f) => !f);

    if (hasInteractive && hasNonInteractive) {
      return 'behavioral';
    }

    // --- Check 2: Structural property divergence ---
    // If variants expose different property *keys* (not just different
    // values), they likely represent different behavioral contracts.
    // Visual-only differences share the same property keys with different
    // values (e.g., color: red vs color: blue).
    const propertySets = variants.map((v) => {
      const keys = Object.keys(v.properties).sort();
      return keys.join(',');
    });

    const uniquePropertySets = new Set(propertySets);
    if (uniquePropertySets.size > 1) {
      return 'behavioral';
    }

    // All variants share the same property keys and interaction pattern —
    // differences are purely visual (colors, sizes, spacing).
    return 'styling';
  }

  /**
   * Generate mapping recommendations for how Figma variants should map to
   * DesignerPunk component structure.
   *
   * Always produces two options:
   *   - Option A: Single component with a variant prop (simpler API surface).
   *   - Option B: Primitive + semantic component structure (Stemma pattern).
   *
   * The recommended option is chosen based on:
   *   1. Family pattern alignment (if a Component-Family doc exists).
   *   2. Behavioral analysis classification ('behavioral' favours split,
   *      'styling' favours single component).
   *   3. Existing component landscape (avoid duplication).
   *
   * @param familyPattern - Pattern from Component-Family doc, or null if none exists.
   * @param behavioralAnalysis - 'behavioral' or 'styling' classification.
   * @param existingComponents - Already-implemented components in the family.
   * @returns Two MappingRecommendation entries (Option A and Option B).
   *
   * @requirements Req 4
   */
  generateRecommendations(
    familyPattern: FamilyPattern | null,
    behavioralAnalysis: 'behavioral' | 'styling',
    existingComponents: ComponentStatus[],
  ): MappingRecommendation[] {
    const hasExistingPrimitive = existingComponents.some(
      (c) => c.status === 'implemented' && /base|primitive/i.test(c.name),
    );

    // --- Determine which option to recommend ---
    // Family pattern takes priority when available.
    let recommendA: boolean;

    if (familyPattern) {
      const patternLower = familyPattern.inheritancePattern.toLowerCase();
      // Family docs that describe "primitive + semantic" or "base + variant"
      // patterns align with Option B (split structure).
      const familyFavoursSplit =
        patternLower.includes('primitive') ||
        patternLower.includes('base') ||
        patternLower.includes('semantic');

      recommendA = !familyFavoursSplit;
    } else {
      // No family doc — lean on behavioral analysis.
      recommendA = behavioralAnalysis === 'styling';
    }

    // If behavioral analysis says 'behavioral' and there's already a
    // primitive/base component, strongly favour the split structure
    // regardless of family pattern to avoid duplicating the base.
    if (behavioralAnalysis === 'behavioral' && hasExistingPrimitive) {
      recommendA = false;
    }

    // --- Build Option A: Single component with variant prop ---
    const optionA: MappingRecommendation = {
      option: 'A',
      description: 'Single component with a variant prop',
      rationale:
        behavioralAnalysis === 'styling'
          ? 'Variants differ only in visual styling, making a single component with a variant prop the simplest API surface.'
          : 'A single component keeps the API surface small, though behavioral differences may complicate the internal implementation.',
      recommended: recommendA,
      alignsWith: this.buildAlignsWith('A', familyPattern, behavioralAnalysis, existingComponents),
      tradeoffs: [
        'Simpler consumer API — one import, one tag.',
        'Internal complexity grows if behavioral differences emerge later.',
        'Harder to tree-shake unused variants.',
      ],
    };

    // --- Build Option B: Primitive + semantic structure ---
    const optionB: MappingRecommendation = {
      option: 'B',
      description: 'Primitive + semantic component structure (Stemma pattern)',
      rationale:
        behavioralAnalysis === 'behavioral'
          ? 'Variants exhibit behavioral differences that map naturally to separate components sharing a primitive base.'
          : 'A split structure future-proofs the component for behavioral divergence, though current variants are styling-only.',
      recommended: !recommendA,
      alignsWith: this.buildAlignsWith('B', familyPattern, behavioralAnalysis, existingComponents),
      tradeoffs: [
        'Clean separation of behavioral contracts per component.',
        'Aligns with Stemma inheritance pattern used across DesignerPunk.',
        'More components to maintain and document.',
      ],
    };

    return [optionA, optionB];
  }

  /**
   * Build the `alignsWith` list for a given option, describing which
   * evidence supports the recommendation.
   */
  private buildAlignsWith(
    option: 'A' | 'B',
    familyPattern: FamilyPattern | null,
    behavioralAnalysis: 'behavioral' | 'styling',
    existingComponents: ComponentStatus[],
  ): string[] {
    const alignments: string[] = [];

    // Behavioral analysis alignment
    if (option === 'A' && behavioralAnalysis === 'styling') {
      alignments.push('Behavioral analysis: variants are styling-only');
    } else if (option === 'B' && behavioralAnalysis === 'behavioral') {
      alignments.push('Behavioral analysis: variants have behavioral differences');
    }

    // Family pattern alignment
    if (familyPattern) {
      const patternLower = familyPattern.inheritancePattern.toLowerCase();
      const familyFavoursSplit =
        patternLower.includes('primitive') ||
        patternLower.includes('base') ||
        patternLower.includes('semantic');

      if (option === 'B' && familyFavoursSplit) {
        alignments.push(`Family pattern (${familyPattern.familyName}): uses primitive/semantic inheritance`);
      } else if (option === 'A' && !familyFavoursSplit) {
        alignments.push(`Family pattern (${familyPattern.familyName}): single-component pattern`);
      }
    }

    // Existing component alignment
    const hasExistingPrimitive = existingComponents.some(
      (c) => c.status === 'implemented' && /base|primitive/i.test(c.name),
    );
    if (option === 'B' && hasExistingPrimitive) {
      const baseName = existingComponents.find(
        (c) => c.status === 'implemented' && /base|primitive/i.test(c.name),
      )?.name;
      alignments.push(`Existing primitive component: ${baseName} already implemented`);
    }

    return alignments;
  }

  /**
   * Detect conflicts between family-pattern and behavioral-analysis
   * recommendations.
   *
   * A conflict exists when the family pattern suggests one architectural
   * approach (e.g. single component) but the behavioral analysis suggests
   * the opposite (e.g. split structure), or vice-versa.
   *
   * @param familyRecommendation - The option favoured by the family pattern
   *   (e.g. "single component" or "primitive + semantic"). Pass an empty
   *   string when no family doc exists (no conflict possible without a
   *   family opinion).
   * @param behavioralRecommendation - The option favoured by behavioral
   *   analysis (e.g. "single component" or "primitive + semantic").
   * @returns An array of conflicts (empty when recommendations agree or
   *   when no family pattern exists).
   */
  detectConflicts(
    familyRecommendation: string,
    behavioralRecommendation: string,
  ): MappingConflict[] {
    // No family doc → nothing to conflict with.
    if (!familyRecommendation) return [];

    const normFamily = familyRecommendation.trim().toLowerCase();
    const normBehavioral = behavioralRecommendation.trim().toLowerCase();

    // If both sides agree (or either is empty), no conflict.
    if (!normFamily || !normBehavioral) return [];
    if (normFamily === normBehavioral) return [];

    // Classify each recommendation into a canonical bucket so we can
    // detect semantic equivalence even when wording differs.
    const familyBucket = this.classifyRecommendation(normFamily);
    const behavioralBucket = this.classifyRecommendation(normBehavioral);

    // Same bucket → no meaningful conflict.
    if (familyBucket === behavioralBucket) return [];

    // Build a human-readable explanation of the disagreement.
    const explanation = this.buildConflictExplanation(
      familyRecommendation,
      behavioralRecommendation,
      familyBucket,
      behavioralBucket,
    );

    return [
      {
        familyRecommendation,
        behavioralRecommendation,
        explanation,
      },
    ];
  }

  /**
   * Classify a recommendation string into a canonical bucket.
   *
   * Returns `'single'` for single-component approaches, `'split'` for
   * primitive + semantic / base + variant approaches, or `'unknown'` when
   * the wording doesn't match either pattern.
   */
  private classifyRecommendation(rec: string): 'single' | 'split' | 'unknown' {
    const singleIndicators = ['single component', 'variant prop', 'option a', 'one component'];
    const splitIndicators = [
      'primitive',
      'semantic',
      'base',
      'split',
      'option b',
      'separate component',
      'stemma',
    ];

    const matchesSingle = singleIndicators.some((ind) => rec.includes(ind));
    const matchesSplit = splitIndicators.some((ind) => rec.includes(ind));

    if (matchesSingle && !matchesSplit) return 'single';
    if (matchesSplit && !matchesSingle) return 'split';
    // Ambiguous or unrecognised — treat as unknown so we still flag the
    // textual difference as a conflict.
    return 'unknown';
  }

  /**
   * Build a human-readable conflict explanation.
   */
  private buildConflictExplanation(
    familyRec: string,
    behavioralRec: string,
    familyBucket: 'single' | 'split' | 'unknown',
    behavioralBucket: 'single' | 'split' | 'unknown',
  ): string {
    const familyLabel =
      familyBucket === 'single'
        ? 'a single component with variant prop'
        : familyBucket === 'split'
          ? 'a primitive + semantic split structure'
          : `"${familyRec}"`;

    const behavioralLabel =
      behavioralBucket === 'single'
        ? 'a single component (variants are styling-only)'
        : behavioralBucket === 'split'
          ? 'separate components (variants have behavioral differences)'
          : `"${behavioralRec}"`;

    return (
      `Component-Family pattern recommends ${familyLabel}, ` +
      `but behavioral analysis recommends ${behavioralLabel}. ` +
      'Human review is required to resolve this architectural disagreement.'
    );
  }





  /**
   * Analyze a Figma component's variants and produce mapping recommendations.
   *
   * Orchestrates family-pattern lookup, existing-component lookup,
   * behavioral analysis, recommendation generation, and conflict detection.
   */
  /**
     * Analyze a Figma component's variants and produce mapping recommendations.
     *
     * Orchestrates family-pattern lookup, existing-component lookup,
     * behavioral analysis, recommendation generation, and conflict detection.
     */
    async analyzeVariants(
      component: FigmaComponent,
      context: ExtractionContext,
    ): Promise<VariantMapping> {
      // 1. Derive family name from component name (e.g. "ButtonCTA" → "Button")
      const familyName = component.name.replace(
        /(?:Base|CTA|Primary|Secondary|Tertiary|Default|Large|Small|Medium)$/i,
        '',
      ) || component.name;

      // 2. Use context if available, otherwise query MCP directly
      const familyPattern =
        context.familyPattern !== undefined
          ? context.familyPattern
          : await this.queryFamilyPattern(familyName);

      const existingComponents =
        context.existingComponents.length > 0
          ? context.existingComponents
          : await this.queryExistingComponents(familyName);

      // 3. Classify behavioral vs styling differences
      const behavioralClassification = this.analyzeBehavioralDifferences(
        component.variants,
      );

      // 4. Generate recommendations from all analysis results
      const recommendations = this.generateRecommendations(
        familyPattern,
        behavioralClassification,
        existingComponents,
      );

      // 5. Derive recommendation strings for conflict detection
      const familyRecommendation = familyPattern
        ? ((): string => {
            const p = familyPattern.inheritancePattern.toLowerCase();
            if (p.includes('primitive') || p.includes('base') || p.includes('semantic')) {
              return 'primitive + semantic';
            }
            return 'single component';
          })()
        : '';

      const behavioralRecommendation =
        behavioralClassification === 'behavioral'
          ? 'primitive + semantic'
          : 'single component';

      // 6. Detect conflicts between family pattern and behavioral analysis
      const conflicts = this.detectConflicts(
        familyRecommendation,
        behavioralRecommendation,
      );

      return {
        componentName: component.name,
        behavioralClassification,
        recommendations,
        conflicts,
        familyPattern,
        existingComponents,
      };
    }


  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  /**
   * Extract a markdown section by heading name.
   *
   * Returns the text between the heading and the next heading of equal or
   * higher level, trimmed. Returns an empty string when the heading is not
   * found.
   */
  private extractSection(content: string, heading: string): string {
    // Match ## Heading (level 2) — Component-Family docs use level-2 headings
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `^(#{1,6})\\s+${escapedHeading}\\s*$`,
      'm',
    );
    const match = pattern.exec(content);
    if (!match) return '';

    const level = match[1].length;
    const startIdx = match.index + match[0].length;

    // Find the next heading of equal or higher level
    const rest = content.slice(startIdx);
    const nextHeadingPattern = new RegExp(`^#{1,${level}}\\s+`, 'm');
    const nextMatch = nextHeadingPattern.exec(rest);

    const sectionText = nextMatch
      ? rest.slice(0, nextMatch.index)
      : rest;

    return sectionText.trim();
  }

  /**
   * Extract behavioral contract names from the "Behavioral Contracts" section.
   *
   * Parses the markdown table under "Base Contracts" and extracts the
   * contract names from the first column (backtick-wrapped identifiers).
   * Falls back to extracting any backtick-wrapped identifiers if no table
   * is found.
   */
  private extractBehavioralContracts(content: string): string[] {
    const section = this.extractSection(content, 'Behavioral Contracts');
    if (!section) return [];

    const contracts: string[] = [];

    // Strategy 1: Parse table rows — look for `contract_name` in first column
    const tableRowPattern = /^\|[^|]*`([^`]+)`/gm;
    let rowMatch: RegExpExecArray | null;
    while ((rowMatch = tableRowPattern.exec(section)) !== null) {
      const name = rowMatch[1].trim();
      // Skip table header separators and generic words
      if (name && !name.startsWith('-')) {
        contracts.push(name);
      }
    }

    if (contracts.length > 0) return contracts;

    // Strategy 2: Fallback — extract #### headings (contract detail headings)
    const headingPattern = /^####\s+(\w[\w_]*)/gm;
    let headingMatch: RegExpExecArray | null;
    while ((headingMatch = headingPattern.exec(section)) !== null) {
      contracts.push(headingMatch[1]);
    }

    return contracts;
  }

  /**
   * Extract token usage patterns from the "Token Dependencies" section.
   *
   * Parses the markdown tables to extract token patterns (e.g.
   * `color.action.primary`, `space.inset.*`).
   */
  private extractTokenUsagePatterns(content: string): string[] {
    const section = this.extractSection(content, 'Token Dependencies');
    if (!section) return [];

    const patterns: string[] = [];

    // Extract backtick-wrapped token references from table cells
    const tokenPattern = /`([a-zA-Z][a-zA-Z0-9.*]+(?:\.[a-zA-Z0-9.*]+)+)`/g;
    let tokenMatch: RegExpExecArray | null;
    while ((tokenMatch = tokenPattern.exec(section)) !== null) {
      const token = tokenMatch[1];
      if (!patterns.includes(token)) {
        patterns.push(token);
      }
    }

    return patterns;
  }
}
