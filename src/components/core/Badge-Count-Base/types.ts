/**
 * Badge-Count-Base Type Definitions
 * 
 * Stemma System: Badge Family
 * Component Type: Type Primitive (Count)
 * Naming Convention: [Family]-[Type]-[Variant] = Badge-Count-Base
 * 
 * Provides type-safe props for the Badge-Count-Base component across all platforms.
 * Badge-Count-Base is a read-only, non-interactive visual indicator for displaying
 * numeric values like notification counts or quantities.
 * 
 * @module Badge-Count-Base/types
 * @see .kiro/specs/044-badge-base/design.md for design specification
 * @see Requirements 2.1-2.13 in .kiro/specs/044-badge-base/requirements.md
 */

/**
 * Badge count size variants.
 * 
 * Each size maps to specific typography and spacing tokens:
 * - sm: typography.labelXs, space.inset.none (v), space.inset.050 (h)
 * - md: typography.labelSm, space.inset.none (v), space.inset.050 (h)
 * - lg: typography.labelMd, space.inset.050 (v), space.inset.100 (h)
 * 
 * @see Requirements 2.9, 2.10 in .kiro/specs/044-badge-base/requirements.md
 */
export type BadgeCountSize = 'sm' | 'md' | 'lg';

/**
 * Default values for Badge-Count-Base props.
 * 
 * @see Requirements 2.5, 2.8, 2.10 in .kiro/specs/044-badge-base/requirements.md
 */
export const BADGE_COUNT_DEFAULTS = {
  /** Default maximum before showing "[max]+" */
  max: 99,
  /** Default showZero behavior */
  showZero: false,
  /** Default size variant */
  size: 'md' as BadgeCountSize,
} as const;

/**
 * Token mappings for Badge-Count-Base sizes.
 * 
 * Maps size variants to their corresponding design tokens for typography
 * and spacing. Min-width equals line-height to ensure circular shape for
 * single-digit counts.
 * 
 * @see Requirements 4.3, 4.4 in .kiro/specs/044-badge-base/requirements.md
 */
export const BADGE_COUNT_SIZE_TOKENS = {
  sm: {
    typography: 'typography.labelXs',
    paddingVertical: 'space.inset.none',
    paddingHorizontal: 'space.inset.050',
    // Min-width equals line-height for circular shape
    // line-height-050 = 16px (from typography.labelXs)
    minWidth: 16,
  },
  md: {
    typography: 'typography.labelSm',
    paddingVertical: 'space.inset.none',
    paddingHorizontal: 'space.inset.050',
    // Min-width equals line-height for circular shape
    // line-height-075 = 20px (from typography.labelSm)
    minWidth: 20,
  },
  lg: {
    typography: 'typography.labelMd',
    paddingVertical: 'space.inset.050',
    paddingHorizontal: 'space.inset.100',
    // Min-width equals line-height for circular shape
    // line-height-100 = 24px (from typography.labelMd)
    minWidth: 24,
  },
} as const;

/**
 * Props interface for Badge-Count-Base component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * Platform-specific implementations may extend this interface with additional
 * platform-specific properties.
 * 
 * @see Requirements 2.1-2.13 in .kiro/specs/044-badge-base/requirements.md
 * 
 * @example
 * ```typescript
 * // Web usage
 * <badge-count-base count="5"></badge-count-base>
 * 
 * // With max truncation
 * <badge-count-base count="150" max="99"></badge-count-base>
 * 
 * // Show zero
 * <badge-count-base count="0" show-zero="true"></badge-count-base>
 * ```
 */
export interface BadgeCountBaseProps {
  /**
   * Numeric value to display (required).
   * 
   * The count to display inside the badge.
   * 
   * @see Requirement 2.1 in .kiro/specs/044-badge-base/requirements.md
   */
  count: number;
  
  /**
   * Maximum before showing "[max]+".
   * 
   * When count exceeds this value, displays "[max]+" (e.g., "99+").
   * 
   * @default 99
   * @see Requirements 2.4, 2.5 in .kiro/specs/044-badge-base/requirements.md
   */
  max?: number;
  
  /**
   * Whether to show badge when count is 0.
   * 
   * When false (default), badge is not rendered when count is 0.
   * When true, badge renders showing "0".
   * 
   * @default false
   * @see Requirements 2.6, 2.7, 2.8 in .kiro/specs/044-badge-base/requirements.md
   */
  showZero?: boolean;
  
  /**
   * Size variant.
   * 
   * Determines typography and spacing tokens applied.
   * 
   * @default 'md'
   * @see Requirements 2.9, 2.10 in .kiro/specs/044-badge-base/requirements.md
   */
  size?: BadgeCountSize;
  
  /**
   * Optional test ID for automated testing.
   * 
   * Used to identify badges in automated tests across all platforms:
   * - Web: data-testid attribute
   * - iOS: accessibilityIdentifier
   * - Android: testTag
   */
  testID?: string;
}
