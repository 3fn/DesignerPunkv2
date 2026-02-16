/**
 * Progress-Indicator-Label-Base Type Definitions
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Indicator-Label-Base
 * 
 * Provides type-safe props for the Progress-Indicator-Label-Base component
 * across all platforms. This primitive renders labels centered below
 * progress indicator nodes with optional helper text.
 * 
 * @module Progress-Indicator-Label-Base/types
 * @see .kiro/specs/048-progress-family/design.md for design specification
 * @see Requirements 1.8-1.10 in .kiro/specs/048-progress-family/requirements.md
 */

/**
 * Props interface for Progress-Indicator-Label-Base component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * 
 * @see Requirements 1.8-1.10 in .kiro/specs/048-progress-family/requirements.md
 * 
 * @example
 * ```typescript
 * // Web usage
 * <progress-indicator-label-base label="Step 1" helper-text="Personal Info"></progress-indicator-label-base>
 * 
 * // Optional step
 * <progress-indicator-label-base label="Review" optional></progress-indicator-label-base>
 * ```
 */
export interface ProgressIndicatorLabelBaseProps {
  /**
   * Primary label text (required).
   * Truncates with ellipsis if text exceeds available width.
   * 
   * @see Requirement 1.8 - Position centered below node
   * @see Requirement 1.10 - Truncate with ellipsis
   */
  label: string;

  /**
   * Optional helper text displayed below the label.
   * Truncates with ellipsis if text exceeds available width.
   * 
   * @see Requirement 1.9 - Support optional helper text
   */
  helperText?: string;

  /**
   * Whether this step is optional.
   * When true, indicates optional status visually.
   */
  optional?: boolean;

  /**
   * Test identifier for automated testing.
   * - Web: data-testid attribute
   * - iOS: accessibilityIdentifier
   * - Android: testTag in semantics
   */
  testID?: string;
}
