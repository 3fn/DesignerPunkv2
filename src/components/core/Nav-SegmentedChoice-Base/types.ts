/**
 * Nav-SegmentedChoice-Base Type Definitions
 * 
 * Stemma System: Navigation Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Nav-SegmentedChoice-Base
 * 
 * Provides type-safe props for the Nav-SegmentedChoice-Base component
 * across all platforms. Text OR icon segments enforced via union type.
 * 
 * @module Nav-SegmentedChoice-Base/types
 * @see .kiro/specs/049-nav-segmentedchoice-base/design-outline.md
 * @see Requirements 1.1–1.5, 2.1–2.4, 6.1–6.3, 7.1–7.3
 */

import type { IconBaseName } from '../Icon-Base/types';

/** Text segment — displays a label string */
export interface TextSegmentOption {
  value: string;
  label: string;
}

/** Icon segment — displays an icon with required accessibility label */
export interface IconSegmentOption {
  value: string;
  icon: IconBaseName;
  accessibilityLabel: string;
}

/** A segment is either text or icon, never both */
export type SegmentOption = TextSegmentOption | IconSegmentOption;

/** Size variants */
export type SegmentedChoiceSize = 'standard' | 'condensed';

/**
 * Nav-SegmentedChoice-Base Props
 * 
 * @see Requirements 1.1–1.5, 2.1–2.4, 6.1–6.3, 7.1–7.3
 */
export interface SegmentedChoiceProps {
  /** Array of segment options (minimum 2) */
  segments: SegmentOption[];

  /** Currently selected segment value */
  selectedValue: string;

  /** Called when selection changes */
  onSelectionChange: (value: string) => void;

  /** Size variant — default: 'standard' */
  size?: SegmentedChoiceSize;

  /** DOM identity — drives aria-controls generation ([id]-panel-[value]) */
  id?: string;

  /** Test ID for automated testing */
  testID?: string;
}

/** Default prop values */
export const SEGMENTED_CHOICE_DEFAULTS = {
  size: 'standard' as SegmentedChoiceSize,
} as const;
