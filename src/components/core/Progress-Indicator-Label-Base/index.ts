/**
 * Progress-Indicator-Label-Base Component Index
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Progress-Indicator-Label-Base
 * Type: Primitive (Base)
 * 
 * Progress-Indicator-Label-Base is a primitive component that renders
 * labels centered below progress indicator nodes with optional helper text.
 * It serves as a building block for the Stepper-Detailed semantic variant.
 * 
 * Key Characteristics:
 * - Positioned centered below node
 * - Uses typography.labelSm token (14px)
 * - Supports optional helper text
 * - Truncates with ellipsis if text exceeds width
 * - Non-interactive, decorative (a11y handled by semantic variants)
 * 
 * @see .kiro/specs/048-progress-family for design specification
 */

// Export types
export type { ProgressIndicatorLabelBaseProps } from './types';

// Platform implementations
// - Web: ProgressIndicatorLabelBase (Task 2.3) ✅
// - iOS: ProgressIndicatorLabelBase (Task 2.3) ✅
// - Android: ProgressIndicatorLabelBase (Task 2.3) ✅
export { ProgressIndicatorLabelBase } from './platforms/web/ProgressIndicatorLabelBase.web';
