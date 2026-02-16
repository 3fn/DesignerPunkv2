/**
 * Progress-Indicator-Node-Base Type Definitions
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Indicator-Node-Base
 * 
 * Provides type-safe props for the Progress-Indicator-Node-Base component
 * across all platforms. This primitive renders individual indicator nodes
 * with state-based visual treatment.
 * 
 * @module Progress-Indicator-Node-Base/types
 * @see .kiro/specs/048-progress-family/design.md for design specification
 * @see Requirements 1.1-1.5, 12.1-12.5 in .kiro/specs/048-progress-family/requirements.md
 */

/**
 * Node visual states.
 * 
 * Each state maps to specific color tokens from color.progress.*:
 * - incomplete: color.progress.pending.* (white300/gray300)
 * - current: color.progress.current.* (cyan300/cyan400)
 * - completed: color.progress.completed.* (green100/green400)
 * - error: color.progress.error.* (pink100/pink400)
 * 
 * @see Requirements 1.1 - Four states: incomplete, current, completed, error
 * @see Requirements 12.13-12.16 - Color application per state
 */
export type NodeState = 'incomplete' | 'current' | 'completed' | 'error';

/**
 * Node size variants.
 * 
 * Each size maps to base and current token values:
 * - sm: 12px base, 16px current (pagination only)
 * - md: 16px base, 20px current (all variants)
 * - lg: 24px base, 28px current (all variants)
 * 
 * @see Requirements 1.2 - Three sizes: sm (12px), md (16px), lg (24px)
 */
export type NodeSize = 'sm' | 'md' | 'lg';

/**
 * Node content types.
 * 
 * - none: Renders as dot (sm) or empty circle (md/lg)
 * - checkmark: Renders checkmark icon (md/lg only, ignored for sm)
 * - icon: Renders specified icon (md/lg only, ignored for sm)
 * 
 * @see Requirements 1.3-1.4 - Content support per size
 */
export type NodeContent = 'none' | 'checkmark' | 'icon';


/**
 * Default values for Progress-Indicator-Node-Base props.
 * 
 * @see Requirements 1.2 - Default size
 */
export const NODE_BASE_DEFAULTS = {
  /** Default size variant */
  size: 'md' as NodeSize,
  /** Default content type */
  content: 'none' as NodeContent,
} as const;

/**
 * Size token mappings for Progress-Indicator-Node-Base.
 * 
 * Maps size variants to their base and current pixel values.
 * Values come from progress component tokens:
 * - Base: progress.node.size.{sm|md|lg}
 * - Current: progress.node.size.{sm|md|lg}.current
 * 
 * @see Requirements 1.2, 1.5 - Size values and current emphasis
 * @see Requirements 12.1-12.4 - Size rendering per state
 */
export const NODE_SIZE_VALUES = {
  sm: { base: 12, current: 16 },
  md: { base: 16, current: 20 },
  lg: { base: 24, current: 28 },
} as const;

/**
 * Props interface for Progress-Indicator-Node-Base component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * 
 * @see Requirements 1.1-1.5 in .kiro/specs/048-progress-family/requirements.md
 * 
 * @example
 * ```typescript
 * // Web usage
 * <progress-indicator-node-base state="current" size="md" content="none"></progress-indicator-node-base>
 * 
 * // Completed with checkmark
 * <progress-indicator-node-base state="completed" size="lg" content="checkmark"></progress-indicator-node-base>
 * ```
 */
export interface ProgressIndicatorNodeBaseProps {
  /**
   * Visual state of the node (required).
   * Determines color tokens and size (current gets +4px emphasis).
   * 
   * @see Requirement 1.1 - Four states
   */
  state: NodeState;

  /**
   * Size variant of the node.
   * Defaults to 'md'.
   * 
   * @see Requirement 1.2 - Three sizes
   */
  size?: NodeSize;

  /**
   * Content to render inside the node.
   * - 'none': dot (sm) or empty circle (md/lg)
   * - 'checkmark': checkmark icon (md/lg only)
   * - 'icon': custom icon (md/lg only)
   * sm size always renders as dot regardless of content.
   * Defaults to 'none'.
   * 
   * @see Requirements 1.3-1.4 - Content per size
   */
  content?: NodeContent;

  /**
   * Icon name when content='icon'.
   * Only applies to md/lg sizes.
   */
  icon?: string;

  /**
   * Test identifier for automated testing.
   * - Web: data-testid attribute
   * - iOS: accessibilityIdentifier
   * - Android: testTag in semantics
   */
  testID?: string;
}
