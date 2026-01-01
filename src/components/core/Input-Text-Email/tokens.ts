/**
 * Input-Text-Email Component Token References
 * 
 * Inherits all tokens from Input-Text-Base.
 * Email-specific components use the same visual tokens as the base component.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Email
 * 
 * Token Inheritance:
 * Input-Text-Email inherits ALL tokens from Input-Text-Base.
 * No additional tokens are required for email-specific functionality.
 * 
 * This file re-exports Input-Text-Base tokens for consistency and
 * to allow future email-specific token additions if needed.
 */

// Re-export all tokens from Input-Text-Base
export {
  typographyTokens,
  colorTokens,
  spacingTokens,
  motionTokens,
  borderTokens,
  accessibilityTokens,
  blendTokens,
  inputTextBaseTokens
} from '../Input-Text-Base/tokens';

// Alias for semantic naming
export { inputTextBaseTokens as inputTextEmailTokens } from '../Input-Text-Base/tokens';

