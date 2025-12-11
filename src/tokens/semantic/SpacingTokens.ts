/**
 * Hierarchical Spacing Semantic Token Definitions
 * 
 * Two-category spacing system distinguishing between external spacing (layout)
 * and internal spacing (inset):
 * 
 * - Layout Tokens: Spacing between elements based on relationship hierarchy
 *   (grouped, related, separated, sectioned)
 * - Inset Tokens: Spacing inside containers based on density
 *   (tight, normal, comfortable, spacious, expansive)
 * 
 * Zero Spacing: Use 0 directly rather than a token (zero represents absence of spacing)
 */

/**
 * Spacing semantic token structure
 * Uses { value: 'primitiveTokenName' } format for primitive references
 */
interface SpacingSemanticToken {
  value: string;
}

/**
 * Layout Spacing Tokens (External Spacing)
 * 
 * Describe spacing between elements based on their relationship hierarchy.
 * Use for margins, gaps, and spacing between components.
 */
export const layoutSpacing = {
  /**
   * Grouped - Elements within the same logical group (tightest relationships)
   */
  grouped: {
    /**
     * No spacing - elements directly adjacent with no gap
     * Example: Removing spacing between tightly coupled elements, resetting margins
     * Rationale: Explicit "none" token improves search/discoverability, communicates intent,
     * and provides consistent maintenance pattern across spacing contexts
     */
    none: { value: 'space000' } as SpacingSemanticToken,

    /**
     * Extremely tight grouping for metadata, labels, and tightly coupled elements
     * Example: Post metadata, icon-label pairs with minimal separation
     */
    minimal: { value: 'space025' } as SpacingSemanticToken,

    /**
     * Tight grouping for closely related elements within a group
     * Example: Icon-label pairs, form field labels
     */
    tight: { value: 'space050' } as SpacingSemanticToken,

    /**
     * Standard grouping for form fields and related elements in a group
     * Example: Form fields in same section, list items in a group
     */
    normal: { value: 'space100' } as SpacingSemanticToken,

    /**
     * Generous grouping for related cards and loosely grouped elements
     * Example: Related cards in a grid, grouped content blocks
     */
    loose: { value: 'space150' } as SpacingSemanticToken
  },

  /**
   * Related - Elements that are connected but distinct (moderate relationships)
   */
  related: {
    /**
     * No spacing - elements directly adjacent with no gap
     * Example: Removing spacing between related sections, resetting margins
     * Rationale: Explicit "none" token improves search/discoverability, communicates intent,
     * and provides consistent maintenance pattern across spacing contexts
     */
    none: { value: 'space000' } as SpacingSemanticToken,

    /**
     * Minimal related separation for connected but distinct elements
     * Example: Different form sections with minimal separation
     */
    tight: { value: 'space100' } as SpacingSemanticToken,

    /**
     * Standard related separation for connected sections
     * Example: Form sections, related content areas
     */
    normal: { value: 'space200' } as SpacingSemanticToken,

    /**
     * Generous related separation for loosely connected sections
     * Example: Related content blocks with clear but moderate separation
     */
    loose: { value: 'space300' } as SpacingSemanticToken
  },

  /**
   * Separated - Elements that are independent (clear separation)
   */
  separated: {
    /**
     * No spacing - elements directly adjacent with no gap
     * Example: Removing spacing between independent sections, resetting margins
     * Rationale: Explicit "none" token improves search/discoverability, communicates intent,
     * and provides consistent maintenance pattern across spacing contexts
     */
    none: { value: 'space000' } as SpacingSemanticToken,

    /**
     * Minimal separated distinction for independent elements
     * Example: Dashboard widgets with minimal separation
     */
    tight: { value: 'space200' } as SpacingSemanticToken,

    /**
     * Standard separated distinction for independent sections
     * Example: Dashboard widgets, independent content cards
     */
    normal: { value: 'space300' } as SpacingSemanticToken,

    /**
     * Generous separated distinction for clearly independent sections
     * Example: Major content areas with clear visual separation
     */
    loose: { value: 'space400' } as SpacingSemanticToken
  },

  /**
   * Sectioned - Major section boundaries (strongest separation)
   */
  sectioned: {
    /**
     * No spacing - sections directly adjacent with no gap
     * Example: Removing spacing between major sections, resetting margins
     * Rationale: Explicit "none" token improves search/discoverability, communicates intent,
     * and provides consistent maintenance pattern across spacing contexts
     */
    none: { value: 'space000' } as SpacingSemanticToken,

    /**
     * Minimal section boundary for major page sections
     * Example: Page sections with minimal boundary
     */
    tight: { value: 'space400' } as SpacingSemanticToken,

    /**
     * Standard section boundary for major page sections
     * Example: Hero to features section, major page boundaries
     */
    normal: { value: 'space500' } as SpacingSemanticToken,

    /**
     * Generous section boundary for maximum visual separation
     * Example: Major landing page sections, distinct content areas
     */
    loose: { value: 'space600' } as SpacingSemanticToken
  }
};

/**
 * Inset Spacing Tokens (Internal Spacing)
 * 
 * Numeric naming exposes mathematical relationships:
 * - none: 0px (no spacing)
 * - 050: 4px (0.5 × base)
 * - 100: 8px (1 × base)  
 * - 150: 12px (1.5 × base)
 * - 200: 16px (2 × base)
 * - 300: 24px (3 × base)
 * - 400: 32px (4 × base)
 * 
 * Use for padding within components and containers.
 */
export const insetSpacing = {
  /**
   * none - No internal spacing (0px)
   * Mathematical relationship: 0 × base (space000)
   * Example: Removing padding from containers, resetting insets
   * Rationale: Explicit "none" token improves search/discoverability, communicates intent,
   * and provides consistent maintenance pattern across spacing contexts
   */
  none: { value: 'space000' } as SpacingSemanticToken,

  /**
   * 050 - Minimal internal spacing (4px)
   * Mathematical relationship: 0.5 × base (space100)
   * Example: Compact chips, dense toolbars, tight buttons
   */
  '050': { value: 'space050' } as SpacingSemanticToken,

  /**
   * 100 - Compact internal spacing (8px)
   * Mathematical relationship: 1 × base (space100)
   * Example: Small buttons, compact cards, dense forms
   */
  '100': { value: 'space100' } as SpacingSemanticToken,

  /**
   * 150 - Standard internal spacing (12px)
   * Mathematical relationship: 1.5 × base (space100)
   * Example: Standard buttons, cards, form inputs
   */
  '150': { value: 'space150' } as SpacingSemanticToken,

  /**
   * 200 - Comfortable internal spacing (16px)
   * Mathematical relationship: 2 × base (space100)
   * Example: Large buttons, comfortable cards, readable content
   */
  '200': { value: 'space200' } as SpacingSemanticToken,

  /**
   * 300 - Spacious internal spacing (24px)
   * Mathematical relationship: 3 × base (space100)
   * Example: Hero sections, emphasized content, feature callouts
   */
  '300': { value: 'space300' } as SpacingSemanticToken,

  /**
   * 400 - Maximum internal spacing (32px)
   * Mathematical relationship: 4 × base (space100)
   * Example: Landing page heroes, maximum emphasis areas
   */
  '400': { value: 'space400' } as SpacingSemanticToken
};

/**
 * Complete hierarchical spacing semantic token structure
 */
export const spacingTokens = {
  grouped: layoutSpacing.grouped,
  related: layoutSpacing.related,
  separated: layoutSpacing.separated,
  sectioned: layoutSpacing.sectioned,
  inset: insetSpacing
};

/**
 * AI Agent Guidance for Token Selection
 * 
 * When adding spacing:
 * 
 * 1. Between elements (margins, gaps)?
 *    → Use layout tokens: grouped / related / separated / sectioned
 *    → Choose based on relationship hierarchy + desired density
 *    → Use .none variant to explicitly remove spacing (better than 0 for search/intent)
 * 
 * 2. Inside containers (padding)?
 *    → Use inset tokens: none / 050 / 100 / 150 / 200 / 300 / 400
 *    → Choose based on desired interface density
 *    → Numeric names expose mathematical relationships (150 = 1.5 × base)
 *    → Use .none to explicitly remove padding (better than 0 for search/intent)
 * 
 * 3. Removing spacing (resets)?
 *    → Use .none tokens (grouped.none, separated.none, inset.none)
 *    → Rationale: Explicit "none" tokens improve search/discoverability, communicate intent,
 *      and provide consistent maintenance pattern
 * 
 * 4. Component-specific needs?
 *    → Within the context of the illustrated spec, prioritize using semantic tokens;
 *      if those tokens fail to achieve the spec requirements, use primitive tokens.
 *      If primitive tokens fail to achieve the spec requirements, request the
 *      creation of a component token that lives within the component's directory.
 */
