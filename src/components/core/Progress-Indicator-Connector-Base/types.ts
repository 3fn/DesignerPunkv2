/**
 * Progress-Indicator-Connector-Base Type Definitions
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Primitive (Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Progress-Indicator-Connector-Base
 * 
 * Provides type-safe props for the Progress-Indicator-Connector-Base component
 * across all platforms. This primitive renders connecting lines between nodes
 * with state-based color treatment.
 * 
 * @module Progress-Indicator-Connector-Base/types
 * @see .kiro/specs/048-progress-family/design.md for design specification
 * @see Requirements 1.6-1.7, 12.10-12.12 in .kiro/specs/048-progress-family/requirements.md
 */

/**
 * Connector visual states.
 * 
 * Each state maps to specific color tokens from color.progress.*:
 * - active: color.progress.completed.connector (green100) — between completed nodes
 * - inactive: color.progress.pending.connector (white200) — between incomplete nodes
 * 
 * @see Requirement 1.6 - Two states: active, inactive
 * @see Requirements 12.10-12.11 - Color application per state
 */
export type ConnectorState = 'active' | 'inactive';

/**
 * Default values for Progress-Indicator-Connector-Base props.
 */
export const CONNECTOR_BASE_DEFAULTS = {
  /** Default connector state */
  state: 'inactive' as ConnectorState,
} as const;

/**
 * Props interface for Progress-Indicator-Connector-Base component (platform-agnostic).
 * 
 * This interface defines the common API across all platforms (web, iOS, Android).
 * 
 * @see Requirements 1.6-1.7 in .kiro/specs/048-progress-family/requirements.md
 * 
 * @example
 * ```typescript
 * // Web usage
 * <progress-indicator-connector-base state="active"></progress-indicator-connector-base>
 * <progress-indicator-connector-base state="inactive"></progress-indicator-connector-base>
 * ```
 */
export interface ProgressIndicatorConnectorBaseProps {
  /**
   * Visual state of the connector (required).
   * Determines color: active (green100) or inactive (white200).
   * 
   * @see Requirement 1.6 - Two states
   */
  state: ConnectorState;

  /**
   * Test identifier for automated testing.
   * - Web: data-testid attribute
   * - iOS: accessibilityIdentifier
   * - Android: testTag in semantics
   */
  testID?: string;
}
