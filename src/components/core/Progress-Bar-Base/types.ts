/**
 * Progress-Bar-Base Type Definitions
 *
 * Stemma System: ProgressIndicator Family
 * Component Type: Primitive (standalone)
 *
 * Continuous/percentage-based progress indicator with determinate
 * and indeterminate modes. Discriminated union ensures value is
 * required for determinate and absent for indeterminate.
 *
 * @module Progress-Bar-Base/types
 * @see .kiro/specs/090-linear-progress-bar/design.md
 */

/**
 * Static fill width for indeterminate mode when reduced motion is enabled.
 * Visually distinct from empty (0) and complete (1) states while
 * communicating ongoing activity without animation.
 */
export const INDETERMINATE_STATIC_FILL = 0.33;

/** Determinate mode — value required */
interface ProgressBarDeterminate {
  mode?: 'determinate';
  /** Progress value, 0 to 1. Throws runtime error if outside range. */
  value: number;
  /** Accessible label describing what the bar represents (required) */
  accessibilityLabel: string;
  /** Size variant — sm (4px), md (8px, default), lg (12px) */
  size?: 'sm' | 'md' | 'lg';
  /** Test identifier */
  testID?: string;
}

/** Indeterminate mode — no value */
interface ProgressBarIndeterminate {
  mode: 'indeterminate';
  /** Accessible label describing what the bar represents (required) */
  accessibilityLabel: string;
  /** Size variant — sm (4px), md (8px, default), lg (12px) */
  size?: 'sm' | 'md' | 'lg';
  /** Test identifier */
  testID?: string;
}

export type ProgressBarBaseProps = ProgressBarDeterminate | ProgressBarIndeterminate;
