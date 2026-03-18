/**
 * Nav-TabBar-Base Type Definitions
 *
 * Stemma System: Navigation Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Nav-TabBar-Base
 *
 * Provides type-safe props for the Nav-TabBar-Base component
 * across all platforms. Icon-only tabs with dot indicator.
 *
 * @module Nav-TabBar-Base/types
 * @see .kiro/specs/050-nav-tabbar-base/design.md
 * @see Requirements R1, R2, R8 AC3
 */

import type { IconBaseName } from '../Icon-Base/types';

/** Tab item definition — icon-only with required accessibility label */
export interface TabOption {
  value: string;
  icon: IconBaseName;             // outline-stroke variant (inactive)
  activeIcon: IconBaseName;       // solid-fill variant (active)
  accessibilityLabel: string;     // required — icon-only, no visible text
}

/**
 * Nav-TabBar-Base Props
 *
 * @see Requirements R1, R2, R8 AC3
 */
export interface TabBarProps {
  /** Array of tab definitions (minimum 2, 3-5 recommended) */
  tabs: TabOption[];

  /** Currently selected tab value */
  selectedValue: string;

  /** Called when selection changes — fires before animation begins */
  onSelectionChange: (value: string) => void;

  /** Test ID for automated testing */
  testID?: string;
}
