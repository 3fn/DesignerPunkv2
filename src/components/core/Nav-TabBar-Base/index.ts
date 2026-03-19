/**
 * Nav-TabBar-Base Component Index
 *
 * Stemma System naming: [Family]-[Type]-[Variant] = Nav-TabBar-Base
 * Type: Primitive (Base)
 *
 * Primary bottom navigation with icon-only tabs, dot indicator,
 * radial glow gradients, and three-phase selection animation.
 *
 * @see .kiro/specs/050-nav-tabbar-base for design specification
 */

// Export types
export type {
  TabBarProps,
  TabOption,
} from './types';

// Platform implementations
export { NavTabBarBase } from './platforms/web/NavTabBarBase.web';
