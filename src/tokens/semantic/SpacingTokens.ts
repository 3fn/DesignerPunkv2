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
 * Describe spacing inside containers based on density.
 * Use for padding within components and containers.
 */
export const insetSpacing = {
  /**
   * High-density interfaces (compact, efficient)
   * Example: Data table cells, compact chips, dense toolbars
   */
  tight: { value: 'space050' } as SpacingSemanticToken,

  /**
   * Standard-density interfaces (balanced)
   * Example: Standard buttons, cards, form inputs
   */
  normal: { value: 'space100' } as SpacingSemanticToken,

  /**
   * Low-density interfaces (generous, content-focused)
   * Example: Content cards, comfortable forms, readable content areas
   */
  comfortable: { value: 'space150' } as SpacingSemanticToken,

  /**
   * Very low-density interfaces (emphasis, breathing room)
   * Example: Modal dialogs, emphasized content, feature callouts
   */
  spacious: { value: 'space200' } as SpacingSemanticToken,

  /**
   * Maximum breathing room (heroes, feature sections)
   * Example: Hero sections, landing page features, maximum emphasis areas
   */
  expansive: { value: 'space300' } as SpacingSemanticToken,

  /**
   * Generous internal spacing for large components
   * Example: Large button horizontal padding, spacious card padding, hero section insets
   */
  generous: { value: 'space400' } as SpacingSemanticToken
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
 * 
 * 2. Inside containers (padding)?
 *    → Use inset tokens: tight / normal / comfortable / spacious / expansive
 *    → Choose based on desired interface density
 * 
 * 3. Removing spacing (resets)?
 *    → Use 0 directly (not a token)
 * 
 * 4. Component-specific needs?
 *    → Within the context of the illustrated spec, prioritize using semantic tokens;
 *      if those tokens fail to achieve the spec requirements, use primitive tokens.
 *      If primitive tokens fail to achieve the spec requirements, request the
 *      creation of a component token that lives within the component's directory.
 */
