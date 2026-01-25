/**
 * Semantic Color Token Definitions
 * 
 * Mode-aware semantic color tokens following the Nathan Curtis concept-first naming model.
 * Tokens are organized by semantic concept for intuitive discovery and AI agent reasoning.
 * 
 * SEMANTIC CONCEPTS:
 * - feedback = System status communication (success, error, warning, info, select)
 * - identity = Entity type differentiation (human, agent)
 * - action = Interactive element emphasis (primary, secondary)
 * - contrast = Content on colored backgrounds (onLight, onDark)
 * - structure = Visual organization (canvas, surface, border, border.subtle)
 * 
 * ADDITIONAL CATEGORIES:
 * - attention = yellow (attention-grabbing elements)
 * - highlight = yellow (emphasized content)
 * - tech = cyan (technical elements)
 * - data = cyan (data visualization)
 * - text = gray hierarchy (default, muted, subtle)
 * - icon = gray (default icon color)
 * - print = black (print media)
 * - glow = vibrant neon colors for emphasis effects
 * - avatar = component-specific tokens referencing identity/contrast
 * - badge = component-specific tokens for notification badges
 * 
 * All color tokens reference mode-aware primitive color tokens that support
 * light/dark modes with base/wcag themes.
 * 
 * ARCHITECTURAL DECISION: Shadow Color Semantic Layer Removed
 * 
 * Shadow tokens now reference primitive shadow colors directly (e.g., shadowBlack100)
 * instead of going through a semantic color layer (e.g., color.shadow.default).
 * 
 * Rationale:
 * 1. Matches Industry Patterns: Major design systems (Material Design, Carbon, Polaris)
 *    include shadow color directly in shadow token definitions rather than creating
 *    separate semantic color tokens for shadows.
 * 
 * 2. Aligns with Typography Architecture: Typography tokens compose primitives directly
 *    (fontSize, lineHeight, fontWeight) without intermediate semantic layers. Shadow
 *    tokens should follow the same pattern.
 * 
 * 3. Eliminates Hierarchical References: Semantic→semantic references (shadow.dusk →
 *    color.shadow.default → shadowBlack100) create unnecessary complexity. Direct
 *    primitive references (shadow.dusk → shadowBlack100) are clearer.
 * 
 * 4. Shadow Colors Aren't Reusable: Shadow-specific colors like shadowBlack100 won't
 *    be used outside shadow contexts, so a semantic abstraction layer provides no value.
 * 
 * 5. Semantic Meaning in Shadow Token: The semantic meaning belongs in the shadow token
 *    name itself (shadow.dusk, shadow.sunrise) rather than in a separate color token.
 * 
 * NAMING MIGRATION (Spec 052):
 * - Migrated from strong/subtle pattern to concept-first pattern
 * - Old: color.success.strong/subtle → New: color.feedback.success.text/background
 * - Old: color.select.selected.strong/subtle → New: color.feedback.select.text/background.rest
 * - Old: color.primary → New: color.action.primary
 * - See design authority: .kiro/specs/051-semantic-token-naming-restructure/design-outline.md
 * 
 * Spec-aligned: Token count updated for Spec 052 semantic naming restructure
 */

import { SemanticToken, SemanticCategory } from '../../types/SemanticToken';

/**
 * Semantic color tokens for systematic color usage
 * 
 * Token count updated for Spec 052 semantic naming restructure.
 * See design authority: .kiro/specs/051-semantic-token-naming-restructure/design-outline.md
 */
export const colorTokens: Record<string, Omit<SemanticToken, 'primitiveTokens'>> = {
  // ============================================================================
  // FEEDBACK CONCEPT: Communicate system status to users
  // ============================================================================
  /**
   * Feedback Concept: Communicate system status to users
   * 
   * Roles: success, error, warning, info, select
   * Properties: text, background, border
   * 
   * Design Note (Select): Select is placed under feedback as UI response to 
   * user action. If additional interaction-based use cases emerge (focus states, 
   * drag states), consider migrating to an 'interaction' concept.
   * 
   * @see .kiro/specs/051-semantic-token-naming-restructure/design-outline.md
   */

  // Feedback - Success (3 tokens)
  'color.feedback.success.text': {
    name: 'color.feedback.success.text',
    primitiveReferences: { value: 'green400' },
    category: SemanticCategory.COLOR,
    context: 'Text color for success feedback messages and indicators',
    description: 'Green text color for success states - form validation, confirmation messages, positive feedback'
  },

  'color.feedback.success.background': {
    name: 'color.feedback.success.background',
    primitiveReferences: { value: 'green100' },
    category: SemanticCategory.COLOR,
    context: 'Background color for success feedback areas',
    description: 'Light green background for success states - alert backgrounds, success banners, positive indicators'
  },

  'color.feedback.success.border': {
    name: 'color.feedback.success.border',
    primitiveReferences: { value: 'green400' },
    category: SemanticCategory.COLOR,
    context: 'Border color for success feedback elements',
    description: 'Green border for success states - input validation borders, success card outlines'
  },

  // Feedback - Error (3 tokens)
  'color.feedback.error.text': {
    name: 'color.feedback.error.text',
    primitiveReferences: { value: 'pink400' },
    category: SemanticCategory.COLOR,
    context: 'Text color for error feedback messages and indicators',
    description: 'Pink text color for error states - form validation errors, error messages, destructive action warnings'
  },

  'color.feedback.error.background': {
    name: 'color.feedback.error.background',
    primitiveReferences: { value: 'pink100' },
    category: SemanticCategory.COLOR,
    context: 'Background color for error feedback areas',
    description: 'Light pink background for error states - alert backgrounds, error banners, destructive indicators'
  },

  'color.feedback.error.border': {
    name: 'color.feedback.error.border',
    primitiveReferences: { value: 'pink400' },
    category: SemanticCategory.COLOR,
    context: 'Border color for error feedback elements',
    description: 'Pink border for error states - input validation borders, error card outlines'
  },

  // Feedback - Warning (3 tokens)
  'color.feedback.warning.text': {
    name: 'color.feedback.warning.text',
    primitiveReferences: { value: 'orange400' },
    category: SemanticCategory.COLOR,
    context: 'Text color for warning feedback messages and indicators',
    description: 'Orange text color for warning states - caution messages, attention-required indicators'
  },

  'color.feedback.warning.background': {
    name: 'color.feedback.warning.background',
    primitiveReferences: { value: 'orange100' },
    category: SemanticCategory.COLOR,
    context: 'Background color for warning feedback areas',
    description: 'Light orange background for warning states - alert backgrounds, caution banners'
  },

  'color.feedback.warning.border': {
    name: 'color.feedback.warning.border',
    primitiveReferences: { value: 'orange400' },
    category: SemanticCategory.COLOR,
    context: 'Border color for warning feedback elements',
    description: 'Orange border for warning states - input validation borders, warning card outlines'
  },

  // Feedback - Info (3 tokens)
  'color.feedback.info.text': {
    name: 'color.feedback.info.text',
    primitiveReferences: { value: 'teal400' },
    category: SemanticCategory.COLOR,
    context: 'Text color for informational feedback messages',
    description: 'Teal text color for informational states - help text, informational messages, neutral feedback'
  },

  'color.feedback.info.background': {
    name: 'color.feedback.info.background',
    primitiveReferences: { value: 'teal100' },
    category: SemanticCategory.COLOR,
    context: 'Background color for informational feedback areas',
    description: 'Light teal background for informational states - info banners, help sections'
  },

  'color.feedback.info.border': {
    name: 'color.feedback.info.border',
    primitiveReferences: { value: 'teal400' },
    category: SemanticCategory.COLOR,
    context: 'Border color for informational feedback elements',
    description: 'Teal border for informational states - info card outlines, help section borders'
  },

  // Feedback - Select (6 tokens: text/background/border × rest/default)
  /**
   * Select tokens include state (rest, default) because selection has interaction states.
   * - rest: Currently selected item state
   * - default: Not selected / available for selection state
   * Hover states will use blend compositions.
   */
  'color.feedback.select.text.rest': {
    name: 'color.feedback.select.text.rest',
    primitiveReferences: { value: 'cyan400' },
    category: SemanticCategory.COLOR,
    context: 'Text color for selected state in selection components',
    description: 'Cyan text for selected state - label text in Select/Multi-Select modes when item is selected'
  },

  'color.feedback.select.text.default': {
    name: 'color.feedback.select.text.default',
    primitiveReferences: { value: 'gray200' },
    category: SemanticCategory.COLOR,
    context: 'Text color for not-selected state in selection components',
    description: 'Gray text for not-selected state - label text in Select mode when item is available but not selected'
  },

  'color.feedback.select.background.rest': {
    name: 'color.feedback.select.background.rest',
    primitiveReferences: { value: 'cyan100' },
    category: SemanticCategory.COLOR,
    context: 'Background color for selected state in selection components',
    description: 'Light cyan background for selected state in Select and Multi-Select modes'
  },

  'color.feedback.select.background.default': {
    name: 'color.feedback.select.background.default',
    primitiveReferences: { value: 'gray100' },
    category: SemanticCategory.COLOR,
    context: 'Background color for not-selected state in selection components',
    description: 'Light gray background for not-selected state in Select mode'
  },

  'color.feedback.select.border.rest': {
    name: 'color.feedback.select.border.rest',
    primitiveReferences: { value: 'cyan400' },
    category: SemanticCategory.COLOR,
    context: 'Border color for selected state in selection components',
    description: 'Cyan border for selected state - checkmark base, item border in Select/Multi-Select modes'
  },

  'color.feedback.select.border.default': {
    name: 'color.feedback.select.border.default',
    primitiveReferences: { value: 'gray200' },
    category: SemanticCategory.COLOR,
    context: 'Border color for not-selected state in selection components',
    description: 'Gray border for not-selected state in Select mode'
  },

  // ============================================================================
  // IDENTITY CONCEPT: Entity type differentiation
  // ============================================================================
  /**
   * Identity Concept: Differentiate entity types visually
   * 
   * Roles: human, agent
   * 
   * These tokens represent the core identity colors for different entity types.
   * Component tokens (e.g., color.avatar.human.background) should reference these
   * semantic tokens rather than primitives directly.
   * 
   * @see .kiro/specs/051-semantic-token-naming-restructure/design-outline.md
   */

  'color.identity.human': {
    name: 'color.identity.human',
    primitiveReferences: { value: 'orange300' },
    category: SemanticCategory.COLOR,
    context: 'Identity color for human entities',
    description: 'Orange identity color for human entities - warm, approachable visual identity used by Avatar and other human-representing components'
  },

  'color.identity.agent': {
    name: 'color.identity.agent',
    primitiveReferences: { value: 'teal200' },
    category: SemanticCategory.COLOR,
    context: 'Identity color for AI agent entities',
    description: 'Teal identity color for AI agent entities - distinct, technical visual identity used by Avatar and other agent-representing components'
  },

  // ============================================================================
  // ACTION CONCEPT: Interactive element emphasis
  // ============================================================================
  /**
   * Action Concept: Visual emphasis levels for interactive elements
   * 
   * Roles: primary, secondary
   * 
   * Design Note: primary/secondary represent visual emphasis levels, not action types.
   * - primary: Emphasized action (single, focused instances) - hero CTAs, main actions
   * - secondary: De-emphasized action (repetitive, supporting instances) - list items, secondary buttons
   * 
   * Use primary for hero moments, secondary for lists to avoid UI over-saturation.
   * 
   * @see .kiro/specs/051-semantic-token-naming-restructure/design-outline.md
   */

  'color.action.primary': {
    name: 'color.action.primary',
    primitiveReferences: { value: 'purple300' },
    category: SemanticCategory.COLOR,
    context: 'Primary action color for emphasized interactive elements',
    description: 'Purple color for emphasized actions - hero CTAs, main buttons, primary interactive elements. Use for single, focused instances where visual prominence is desired.'
  },

  'color.action.secondary': {
    name: 'color.action.secondary',
    primitiveReferences: { value: 'black400' },
    category: SemanticCategory.COLOR,
    context: 'Secondary action color for de-emphasized interactive elements',
    description: 'Dark neutral color for de-emphasized actions - list item buttons, secondary CTAs, repetitive action elements. Use for supporting instances to avoid UI over-saturation.'
  },

  // Attention & Highlight (2 tokens)
  'color.attention': {
    name: 'color.attention',
    primitiveReferences: { value: 'yellow400' },
    category: SemanticCategory.COLOR,
    context: 'Attention color for elements requiring user focus',
    description: 'Yellow for attention-grabbing elements and notifications'
  },

  'color.highlight': {
    name: 'color.highlight',
    primitiveReferences: { value: 'yellow300' },
    category: SemanticCategory.COLOR,
    context: 'Highlight color for emphasized content',
    description: 'Yellow for highlighted text and emphasized content'
  },

  // Tech & Data (2 tokens)
  'color.tech': {
    name: 'color.tech',
    primitiveReferences: { value: 'cyan400' },
    category: SemanticCategory.COLOR,
    context: 'Tech color for technical elements and code',
    description: 'Cyan for technical elements, code snippets, and tech-related UI'
  },

  'color.data': {
    name: 'color.data',
    primitiveReferences: { value: 'cyan300' },
    category: SemanticCategory.COLOR,
    context: 'Data color for data visualization and metrics',
    description: 'Cyan for data visualization, metrics, and data-related elements'
  },

  // Text Hierarchy (4 tokens)
  'color.text.default': {
    name: 'color.text.default',
    primitiveReferences: { value: 'gray300' },
    category: SemanticCategory.COLOR,
    context: 'Primary text color for body content',
    description: 'Primary gray for main text content'
  },

  'color.text.muted': {
    name: 'color.text.muted',
    primitiveReferences: { value: 'gray200' },
    category: SemanticCategory.COLOR,
    context: 'Muted text color for secondary content',
    description: 'Muted gray for secondary and less prominent text'
  },

  'color.text.subtle': {
    name: 'color.text.subtle',
    primitiveReferences: { value: 'gray100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle text color for tertiary content',
    description: 'Subtle gray for tertiary and very subtle text elements'
  },

  // ============================================================================
  // CONTRAST CONCEPT: Content on colored backgrounds
  // ============================================================================
  /**
   * Contrast Concept: Colors for content on colored backgrounds
   * 
   * Roles: onLight, onDark
   * 
   * Naming matches the background the content sits ON:
   * - onLight: Dark content (black500) for use on light backgrounds
   * - onDark: Light content (white100) for use on dark backgrounds
   * 
   * @see .kiro/specs/051-semantic-token-naming-restructure/design-outline.md
   */

  'color.contrast.onLight': {
    name: 'color.contrast.onLight',
    primitiveReferences: { value: 'black500' },
    category: SemanticCategory.COLOR,
    context: 'Contrast color for content on light backgrounds',
    description: 'Black color for content (text, icons) on light backgrounds - ensures WCAG AA contrast compliance for readability'
  },

  'color.contrast.onDark': {
    name: 'color.contrast.onDark',
    primitiveReferences: { value: 'white100' },
    category: SemanticCategory.COLOR,
    context: 'Contrast color for content on dark backgrounds',
    description: 'White color for content (text, icons) on dark backgrounds - ensures WCAG AA contrast compliance for readability'
  },

  // ============================================================================
  // STRUCTURE CONCEPT: Visual organization and layout
  // ============================================================================
  /**
   * Structure Concept: Visual organization and layout elements
   * 
   * Roles: canvas, surface, border
   * 
   * Provides foundational colors for UI structure:
   * - canvas: Base page background (white100)
   * - surface: Elevated containers like cards (white200)
   * - border: Standard UI borders and dividers (gray100)
   * - border.subtle: Subtle borders with baked-in alpha for softer visual separation
   * 
   * @see .kiro/specs/051-semantic-token-naming-restructure/design-outline.md
   */

  'color.structure.canvas': {
    name: 'color.structure.canvas',
    primitiveReferences: { value: 'white100' },
    category: SemanticCategory.COLOR,
    context: 'Base canvas color for page backgrounds',
    description: 'Canvas background color - default surface for all pages, provides the foundational layer for UI structure'
  },

  'color.structure.surface': {
    name: 'color.structure.surface',
    primitiveReferences: { value: 'white200' },
    category: SemanticCategory.COLOR,
    context: 'Surface color for cards and elevated containers',
    description: 'Surface near-white for cards, containers, and elevated surfaces - provides visual hierarchy above canvas'
  },

  'color.structure.border': {
    name: 'color.structure.border',
    primitiveReferences: { value: 'gray100' },
    category: SemanticCategory.COLOR,
    context: 'Border color for UI elements and dividers',
    description: 'Border gray for standard UI element borders and dividers - provides clear visual separation'
  },

  'color.structure.border.subtle': {
    name: 'color.structure.border.subtle',
    primitiveReferences: { value: 'rgba(184, 182, 200, 0.48)' },
    category: SemanticCategory.COLOR,
    context: 'Subtle border color with baked-in alpha for softer visual separation',
    description: 'Subtle border with 48% opacity for softer visual separation - uses gray100 RGB values with baked-in alpha for cross-platform consistency'
  },

  // Background Variants (1 token - kept for specific use case)
  'color.background.primary.subtle': {
    name: 'color.background.primary.subtle',
    primitiveReferences: { value: 'purple100' },
    category: SemanticCategory.COLOR,
    context: 'Subtle primary background for hover states and selections',
    description: 'Subtle purple tint background for secondary button hover states, selected list items, and hover states on cards/containers'
  },

  // Icon Colors (1 token)
  'color.icon.default': {
    name: 'color.icon.default',
    primitiveReferences: { value: 'gray200' },
    category: SemanticCategory.COLOR,
    context: 'Default icon color with optical balance (slightly lighter than text)',
    description: 'Default icon color using gray200 for optical balance - slightly lighter than text (gray300) for proper visual weight'
  },

  // Print Media Colors (1 token)
  'color.print.default': {
    name: 'color.print.default',
    primitiveReferences: { value: 'black100' },
    category: SemanticCategory.COLOR,
    context: 'Pure black color for print media',
    description: 'Pure black (#000000) for optimal printing quality in print media queries'
  },

  // Glow Colors (5 tokens) - Reference existing vibrant primitive colors
  'glow.neonPurple': {
    name: 'glow.neonPurple',
    primitiveReferences: { value: 'purple500' },
    category: SemanticCategory.COLOR,
    context: 'Neon purple glow color for emphasis effects',
    description: 'Vibrant purple glow referencing purple500'
  },

  'glow.neonCyan': {
    name: 'glow.neonCyan',
    primitiveReferences: { value: 'cyan500' },
    category: SemanticCategory.COLOR,
    context: 'Neon cyan glow color for emphasis effects',
    description: 'Vibrant cyan glow referencing cyan500'
  },

  'glow.neonYellow': {
    name: 'glow.neonYellow',
    primitiveReferences: { value: 'yellow500' },
    category: SemanticCategory.COLOR,
    context: 'Neon yellow glow color for emphasis effects',
    description: 'Vibrant yellow glow referencing yellow500'
  },

  'glow.neonGreen': {
    name: 'glow.neonGreen',
    primitiveReferences: { value: 'green500' },
    category: SemanticCategory.COLOR,
    context: 'Neon green glow color for emphasis effects',
    description: 'Vibrant green glow referencing green500'
  },

  'glow.neonPink': {
    name: 'glow.neonPink',
    primitiveReferences: { value: 'pink500' },
    category: SemanticCategory.COLOR,
    context: 'Neon pink glow color for emphasis effects',
    description: 'Vibrant pink glow referencing pink500'
  },

  // Avatar Colors (3 tokens) - Spec 042: Avatar Component
  // Note: color.avatar.human and color.avatar.agent removed in Spec 052
  // These are now semantic identity tokens: color.identity.human, color.identity.agent
  // Component tokens (color.avatar.human.background, etc.) will be created in Task 3.1

  'color.avatar.contrast.onHuman': {
    name: 'color.avatar.contrast.onHuman',
    primitiveReferences: { value: 'white100' },
    category: SemanticCategory.COLOR,
    context: 'Icon color on human avatar background',
    description: 'White icon color for use on human avatar orange background - ensures WCAG AA contrast compliance'
  },

  'color.avatar.contrast.onAgent': {
    name: 'color.avatar.contrast.onAgent',
    primitiveReferences: { value: 'white100' },
    category: SemanticCategory.COLOR,
    context: 'Icon color on AI agent avatar background',
    description: 'White icon color for use on AI agent avatar teal background - ensures WCAG AA contrast compliance'
  },

  'color.avatar.border': {
    name: 'color.avatar.border',
    primitiveReferences: { value: 'gray100' },
    category: SemanticCategory.COLOR,
    context: 'Border color for avatars',
    description: 'Gray border color for avatar components - provides subtle visual definition for both human and agent avatars'
  },

  // Badge Colors (2 tokens) - Spec 044: Badge Component Family
  'color.badge.background.notification': {
    name: 'color.badge.background.notification',
    primitiveReferences: { value: 'pink400' },
    category: SemanticCategory.COLOR,
    context: 'Background color for notification badges',
    description: 'Pink background for notification badges - provides high-visibility alert indication with 6.33:1 contrast ratio against white text'
  },

  'color.badge.text.notification': {
    name: 'color.badge.text.notification',
    primitiveReferences: { value: 'white100' },
    category: SemanticCategory.COLOR,
    context: 'Text color on notification badge background',
    description: 'White text color for use on notification badge pink background - ensures WCAG AA contrast compliance (6.33:1 ratio)'
  }
};

/**
 * Array of all color semantic token names for iteration
 * 
 * Token count updated for Spec 052 semantic naming restructure:
 * - Removed: color.success.strong/subtle, color.error.strong/subtle, color.warning.strong/subtle, 
 *   color.info.strong/subtle, color.select.* (old pattern)
 * - Added: color.feedback.{success|error|warning|info}.{text|background|border} (12 tokens)
 * - Added: color.feedback.select.{text|background|border}.{rest|default} (6 tokens)
 * - Removed: color.avatar.human, color.avatar.agent (moved to identity concept)
 * - Added: color.identity.human, color.identity.agent (2 tokens)
 * - Removed: color.canvas, color.background, color.surface, color.border (moved to structure concept)
 * - Added: color.structure.canvas, color.structure.surface, color.structure.border, 
 *   color.structure.border.subtle (4 tokens)
 * 
 * See design authority: .kiro/specs/051-semantic-token-naming-restructure/design-outline.md
 */
export const colorTokenNames = Object.keys(colorTokens);

/**
 * Get color semantic token by name
 */
export function getColorToken(name: string): Omit<SemanticToken, 'primitiveTokens'> | undefined {
  return colorTokens[name];
}

/**
 * Get all color semantic tokens as array
 */
export function getAllColorTokens(): Array<Omit<SemanticToken, 'primitiveTokens'>> {
  return Object.values(colorTokens);
}

/**
 * Validate token count - updated for Spec 052 semantic naming restructure
 * 
 * Token changes (Task 2.1 - Feedback concept):
 * - Removed 8 old tokens: color.success.strong/subtle, color.error.strong/subtle, 
 *   color.warning.strong/subtle, color.info.strong/subtle
 * - Removed 4 old tokens: color.select.selected.strong/subtle, color.select.notSelected.strong/subtle
 * - Added 18 new tokens: color.feedback.{success|error|warning|info}.{text|background|border} (12)
 *   + color.feedback.select.{text|background|border}.{rest|default} (6)
 * 
 * Token changes (Task 2.2 - Identity concept):
 * - Removed 2 old tokens: color.avatar.human, color.avatar.agent
 * - Added 2 new tokens: color.identity.human, color.identity.agent
 * 
 * Token changes (Task 2.3 - Action concept):
 * - Removed 1 old token: color.primary
 * - Added 2 new tokens: color.action.primary, color.action.secondary
 * 
 * Token changes (Task 2.4 - Contrast concept):
 * - Removed 1 old token: color.contrast.onPrimary
 * - Added 2 new tokens: color.contrast.onLight, color.contrast.onDark
 * 
 * Token changes (Task 2.5 - Structure concept):
 * - Removed 4 old tokens: color.canvas, color.background, color.surface, color.border
 * - Added 4 new tokens: color.structure.canvas, color.structure.surface, 
 *   color.structure.border, color.structure.border.subtle
 * 
 * Net change: -12 + 18 - 2 + 2 - 1 + 2 - 1 + 2 - 4 + 4 = +8 tokens
 * New total: 40 + 8 = 48 tokens
 */
export function validateColorTokenCount(): boolean {
  const expectedCount = 48;
  const actualCount = colorTokenNames.length;
  if (actualCount !== expectedCount) {
    console.warn(`Color token count mismatch: expected ${expectedCount}, got ${actualCount}`);
    return false;
  }
  return true;
}
