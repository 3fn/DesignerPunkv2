/**
 * Avatar Component Type Definitions
 * 
 * Platform-agnostic type definitions for the Avatar component.
 * 
 * @see .kiro/specs/042-avatar-component/design.md for interface details
 * @see .kiro/specs/042-avatar-component/requirements.md for requirements
 */

/**
 * Avatar entity type determines shape:
 * - 'human': Circle shape (organic, natural)
 * - 'agent': Hexagon shape (synthetic, constructed)
 */
export type AvatarType = 'human' | 'agent';

/**
 * Avatar size variants
 * 
 * Size values are defined by component tokens:
 * - xs: 24px (avatar.size.xs)
 * - sm: 32px (avatar.size.sm)
 * - md: 40px (avatar.size.md) - default
 * - lg: 48px (avatar.size.lg)
 * - xl: 80px (avatar.size.xl)
 * - xxl: 128px (avatar.size.xxl)
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Avatar component props interface
 * 
 * @see .kiro/specs/042-avatar-component/design.md for detailed prop descriptions
 */
export interface AvatarProps {
  /**
   * Entity type determines shape: 'human' = circle, 'agent' = hexagon
   * @default 'human'
   */
  type?: AvatarType;
  
  /**
   * Avatar size variant
   * @default 'md'
   */
  size?: AvatarSize;
  
  /**
   * Image source URL or local asset (human only)
   * Ignored for agent type
   */
  src?: string;
  
  /**
   * Alt text for accessibility (required if src provided)
   */
  alt?: string;
  
  /**
   * Whether avatar shows hover visual feedback
   * @default false
   */
  interactive?: boolean;
  
  /**
   * Hide from screen readers (use when avatar is decorative)
   * @default false
   */
  decorative?: boolean;
  
  /**
   * Test ID for automated testing
   * Applied as data-testid (web), accessibilityIdentifier (iOS), testTag (Android)
   */
  testID?: string;
}

/**
 * Default values for Avatar props
 */
export const AVATAR_DEFAULTS: Required<Pick<AvatarProps, 'type' | 'size' | 'interactive' | 'decorative'>> = {
  type: 'human',
  size: 'md',
  interactive: false,
  decorative: false,
};
