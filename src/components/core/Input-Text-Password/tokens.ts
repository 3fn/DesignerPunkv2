/**
 * Input-Text-Password Component Token References
 * 
 * Inherits all tokens from Input-Text-Base.
 * Password-specific components use the same visual tokens as the base component.
 * 
 * Stemma System: Form Inputs Family
 * Component Type: Semantic (inherits from Input-Text-Base)
 * Naming Convention: [Family]-[Type]-[Variant] = Input-Text-Password
 * 
 * Token Inheritance:
 * Input-Text-Password inherits ALL tokens from Input-Text-Base.
 * No additional tokens are required for password-specific functionality.
 * 
 * This file re-exports Input-Text-Base tokens for consistency and
 * to allow future password-specific token additions if needed.
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
export { inputTextBaseTokens as inputTextPasswordTokens } from '../Input-Text-Base/tokens';
