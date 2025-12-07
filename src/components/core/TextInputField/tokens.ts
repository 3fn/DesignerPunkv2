/**
 * TextInputField Component Token References
 * 
 * Platform-agnostic token references for the TextInputField component.
 * These references will be resolved to platform-specific values by the build system.
 * 
 * This file defines WHICH tokens the component uses, not HOW they're implemented per platform.
 * The build system generates platform-specific values (CSS custom properties, Swift constants, Kotlin constants).
 * 
 * Token Selection Rationale:
 * - Typography: Uses labelMd/labelMdFloat for label animation, input for text, caption for helper/error
 * - Color: Uses semantic color tokens for text, borders, and backgrounds with state variations
 * - Spacing: Uses inset tokens for padding, grouped tokens for element spacing
 * - Motion: Uses motion.floatLabel semantic token for label animation timing
 * - Border: Uses borderDefault for standard border, radius150 for rounded corners
 * - Accessibility: Uses focus tokens for keyboard navigation indicators, tapAreaRecommended for touch targets
 * - Blend: Uses focusSaturate for enhanced focus state emphasis
 */

/**
 * Typography token references for TextInputField
 * 
 * All typography tokens reference semantic typography tokens that combine
 * fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing primitives.
 */
export const typographyTokens = {
  /** Label typography when inside input (16px) */
  label: 'typography.labelMd',
  
  /** Label typography when floated above input (14px, via scale088 × fontSize100) */
  labelFloat: 'typography.labelMdFloat',
  
  /** Input text typography (16px) */
  input: 'typography.input',
  
  /** Helper text typography (13px) */
  helper: 'typography.caption',
  
  /** Error message typography (13px) */
  error: 'typography.caption'
} as const;

/**
 * Color token references for TextInputField
 * 
 * All color tokens reference semantic color tokens that provide contextual meaning
 * and support light/dark mode theming.
 */
export const colorTokens = {
  /** Label color when not focused */
  labelDefault: 'color.text.muted',
  
  /** Label color when focused (enhanced with blend.focusSaturate) */
  labelFocused: 'color.primary',
  
  /** Label color in error state */
  labelError: 'color.error',
  
  /** Label color in success state */
  labelSuccess: 'color.success.strong',
  
  /** Input text color */
  inputText: 'color.text.default',
  
  /** Helper text color */
  helperText: 'color.text.muted',
  
  /** Error message color */
  errorText: 'color.error',
  
  /** Border color when not focused */
  borderDefault: 'color.border',
  
  /** Border color when focused (enhanced with blend.focusSaturate) */
  borderFocused: 'color.primary',
  
  /** Border color in error state */
  borderError: 'color.error',
  
  /** Border color in success state */
  borderSuccess: 'color.success.strong',
  
  /** Input background color (supports future tint variations) */
  background: 'color.background',
  
  /** Focus ring color for keyboard navigation */
  focusRing: 'accessibility.focus.color'
} as const;

/**
 * Spacing token references for TextInputField
 * 
 * Uses inset tokens for internal padding and grouped tokens for element spacing.
 */
export const spacingTokens = {
  /** Input padding (horizontal and vertical) - 8px */
  inputPadding: 'space.inset.100',
  
  /** Space between floated label and input - 4px */
  labelOffset: 'space.grouped.tight',
  
  /** Space between input and helper text - 2px */
  helperOffset: 'space.grouped.minimal',
  
  /** Space between helper text and error message - 2px */
  errorOffset: 'space.grouped.minimal'
} as const;

/**
 * Motion token references for TextInputField
 * 
 * Uses motion.floatLabel semantic token for label animation timing and scale088 for typography scaling.
 */
export const motionTokens = {
  /** Label float animation timing (duration250 + easingStandard) */
  labelFloat: 'motion.floatLabel',
  
  /** Icon fade animation timing (reuses labelFloat for coordination) */
  iconFade: 'motion.floatLabel',
  
  /** Typography scale for label animation (0.88 × fontSize100 = 14px) */
  scale: 'scale088'
} as const;

/**
 * Border token references for TextInputField
 * 
 * Uses borderDefault for standard border width and radius150 for rounded corners.
 */
export const borderTokens = {
  /** Border width (1px) */
  width: 'borderDefault',
  
  /** Border radius (12px) */
  radius: 'radius150'
} as const;

/**
 * Accessibility token references for TextInputField
 * 
 * Uses accessibility.focus tokens for keyboard navigation indicators and tapAreaRecommended for touch targets.
 */
export const accessibilityTokens = {
  /** Minimum touch target height (48px) for WCAG compliance */
  minHeight: 'tapAreaRecommended',
  
  /** Focus ring width (2px) */
  focusWidth: 'accessibility.focus.width',
  
  /** Focus ring offset (2px) */
  focusOffset: 'accessibility.focus.offset',
  
  /** Focus ring color (primary) */
  focusColor: 'accessibility.focus.color'
} as const;

/**
 * Blend token references for TextInputField
 * 
 * Uses blend.focusSaturate for enhanced focus state emphasis.
 */
export const blendTokens = {
  /** Focus state emphasis (8% more saturated) */
  focusSaturate: 'blend.focusSaturate'
} as const;

/**
 * Complete TextInputField token references
 * 
 * Exports all token categories for easy import and usage.
 */
export const textInputFieldTokens = {
  typography: typographyTokens,
  color: colorTokens,
  spacing: spacingTokens,
  motion: motionTokens,
  border: borderTokens,
  accessibility: accessibilityTokens,
  blend: blendTokens
} as const;

/**
 * Type definitions for token references
 */
export type TypographyTokens = typeof typographyTokens;
export type ColorTokens = typeof colorTokens;
export type SpacingTokens = typeof spacingTokens;
export type MotionTokens = typeof motionTokens;
export type BorderTokens = typeof borderTokens;
export type AccessibilityTokens = typeof accessibilityTokens;
export type BlendTokens = typeof blendTokens;
export type TextInputFieldTokens = typeof textInputFieldTokens;
