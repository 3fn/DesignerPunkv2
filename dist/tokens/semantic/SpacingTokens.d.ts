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
export declare const layoutSpacing: {
    /**
     * Grouped - Elements within the same logical group (tightest relationships)
     */
    grouped: {
        /**
         * Extremely tight grouping for metadata, labels, and tightly coupled elements
         * Example: Post metadata, icon-label pairs with minimal separation
         */
        minimal: SpacingSemanticToken;
        /**
         * Tight grouping for closely related elements within a group
         * Example: Icon-label pairs, form field labels
         */
        tight: SpacingSemanticToken;
        /**
         * Standard grouping for form fields and related elements in a group
         * Example: Form fields in same section, list items in a group
         */
        normal: SpacingSemanticToken;
        /**
         * Generous grouping for related cards and loosely grouped elements
         * Example: Related cards in a grid, grouped content blocks
         */
        loose: SpacingSemanticToken;
    };
    /**
     * Related - Elements that are connected but distinct (moderate relationships)
     */
    related: {
        /**
         * Minimal related separation for connected but distinct elements
         * Example: Different form sections with minimal separation
         */
        tight: SpacingSemanticToken;
        /**
         * Standard related separation for connected sections
         * Example: Form sections, related content areas
         */
        normal: SpacingSemanticToken;
        /**
         * Generous related separation for loosely connected sections
         * Example: Related content blocks with clear but moderate separation
         */
        loose: SpacingSemanticToken;
    };
    /**
     * Separated - Elements that are independent (clear separation)
     */
    separated: {
        /**
         * Minimal separated distinction for independent elements
         * Example: Dashboard widgets with minimal separation
         */
        tight: SpacingSemanticToken;
        /**
         * Standard separated distinction for independent sections
         * Example: Dashboard widgets, independent content cards
         */
        normal: SpacingSemanticToken;
        /**
         * Generous separated distinction for clearly independent sections
         * Example: Major content areas with clear visual separation
         */
        loose: SpacingSemanticToken;
    };
    /**
     * Sectioned - Major section boundaries (strongest separation)
     */
    sectioned: {
        /**
         * Minimal section boundary for major page sections
         * Example: Page sections with minimal boundary
         */
        tight: SpacingSemanticToken;
        /**
         * Standard section boundary for major page sections
         * Example: Hero to features section, major page boundaries
         */
        normal: SpacingSemanticToken;
        /**
         * Generous section boundary for maximum visual separation
         * Example: Major landing page sections, distinct content areas
         */
        loose: SpacingSemanticToken;
    };
};
/**
 * Inset Spacing Tokens (Internal Spacing)
 *
 * Describe spacing inside containers based on density.
 * Use for padding within components and containers.
 */
export declare const insetSpacing: {
    /**
     * High-density interfaces (compact, efficient)
     * Example: Data table cells, compact chips, dense toolbars
     */
    tight: SpacingSemanticToken;
    /**
     * Standard-density interfaces (balanced)
     * Example: Standard buttons, cards, form inputs
     */
    normal: SpacingSemanticToken;
    /**
     * Low-density interfaces (generous, content-focused)
     * Example: Content cards, comfortable forms, readable content areas
     */
    comfortable: SpacingSemanticToken;
    /**
     * Very low-density interfaces (emphasis, breathing room)
     * Example: Modal dialogs, emphasized content, feature callouts
     */
    spacious: SpacingSemanticToken;
    /**
     * Maximum breathing room (heroes, feature sections)
     * Example: Hero sections, landing page features, maximum emphasis areas
     */
    expansive: SpacingSemanticToken;
};
/**
 * Complete hierarchical spacing semantic token structure
 */
export declare const spacingTokens: {
    grouped: {
        /**
         * Extremely tight grouping for metadata, labels, and tightly coupled elements
         * Example: Post metadata, icon-label pairs with minimal separation
         */
        minimal: SpacingSemanticToken;
        /**
         * Tight grouping for closely related elements within a group
         * Example: Icon-label pairs, form field labels
         */
        tight: SpacingSemanticToken;
        /**
         * Standard grouping for form fields and related elements in a group
         * Example: Form fields in same section, list items in a group
         */
        normal: SpacingSemanticToken;
        /**
         * Generous grouping for related cards and loosely grouped elements
         * Example: Related cards in a grid, grouped content blocks
         */
        loose: SpacingSemanticToken;
    };
    related: {
        /**
         * Minimal related separation for connected but distinct elements
         * Example: Different form sections with minimal separation
         */
        tight: SpacingSemanticToken;
        /**
         * Standard related separation for connected sections
         * Example: Form sections, related content areas
         */
        normal: SpacingSemanticToken;
        /**
         * Generous related separation for loosely connected sections
         * Example: Related content blocks with clear but moderate separation
         */
        loose: SpacingSemanticToken;
    };
    separated: {
        /**
         * Minimal separated distinction for independent elements
         * Example: Dashboard widgets with minimal separation
         */
        tight: SpacingSemanticToken;
        /**
         * Standard separated distinction for independent sections
         * Example: Dashboard widgets, independent content cards
         */
        normal: SpacingSemanticToken;
        /**
         * Generous separated distinction for clearly independent sections
         * Example: Major content areas with clear visual separation
         */
        loose: SpacingSemanticToken;
    };
    sectioned: {
        /**
         * Minimal section boundary for major page sections
         * Example: Page sections with minimal boundary
         */
        tight: SpacingSemanticToken;
        /**
         * Standard section boundary for major page sections
         * Example: Hero to features section, major page boundaries
         */
        normal: SpacingSemanticToken;
        /**
         * Generous section boundary for maximum visual separation
         * Example: Major landing page sections, distinct content areas
         */
        loose: SpacingSemanticToken;
    };
    inset: {
        /**
         * High-density interfaces (compact, efficient)
         * Example: Data table cells, compact chips, dense toolbars
         */
        tight: SpacingSemanticToken;
        /**
         * Standard-density interfaces (balanced)
         * Example: Standard buttons, cards, form inputs
         */
        normal: SpacingSemanticToken;
        /**
         * Low-density interfaces (generous, content-focused)
         * Example: Content cards, comfortable forms, readable content areas
         */
        comfortable: SpacingSemanticToken;
        /**
         * Very low-density interfaces (emphasis, breathing room)
         * Example: Modal dialogs, emphasized content, feature callouts
         */
        spacious: SpacingSemanticToken;
        /**
         * Maximum breathing room (heroes, feature sections)
         * Example: Hero sections, landing page features, maximum emphasis areas
         */
        expansive: SpacingSemanticToken;
    };
};
export {};
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
//# sourceMappingURL=SpacingTokens.d.ts.map