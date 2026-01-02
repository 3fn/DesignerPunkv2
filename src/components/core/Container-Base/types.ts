/**
 * Container-Base Component Type Definitions
 * 
 * Stemma System naming: [Family]-[Type] = Container-Base
 * Type: Primitive (foundational component)
 * 
 * Platform-agnostic TypeScript interfaces for the Container-Base component.
 * These types are shared across all platform implementations (web, iOS, Android).
 * 
 * @see .kiro/specs/010-container-component/design.md for complete design documentation
 * @see .kiro/specs/034-component-architecture-system for Stemma System details
 */

import type { ColorTokenName, ShadowTokenName, OpacityTokenName } from '../../../types/generated/TokenTypes';

/**
 * Padding values for Container-Base component
 * 
 * Maps to space.inset tokens:
 * - none: No padding
 * - 050: 4px (inset.050)
 * - 100: 8px (inset.100)
 * - 150: 12px (inset.150)
 * - 200: 16px (inset.200)
 * - 300: 24px (inset.300)
 * - 400: 32px (inset.400)
 */
export type PaddingValue = 
  | 'none'
  | '050'
  | '100'
  | '150'
  | '200'
  | '300'
  | '400';

/**
 * Border width values for Container-Base component
 * 
 * Maps to border tokens:
 * - none: No border
 * - default: 1px (border.default)
 * - emphasis: 2px (border.emphasis)
 * - heavy: 4px (border.heavy)
 */
export type BorderValue = 
  | 'none'
  | 'default'
  | 'emphasis'
  | 'heavy';

/**
 * Border radius values for Container-Base component
 * 
 * Maps to radius tokens:
 * - none: No border radius
 * - tight: 4px (radius050)
 * - normal: 8px (radius100)
 * - loose: 16px (radius200)
 */
export type BorderRadiusValue = 
  | 'none'
  | 'tight'
  | 'normal'
  | 'loose';

/**
 * Layering values for Container-Base component
 * 
 * Maps to platform-specific tokens:
 * - Web/iOS: z-index tokens (zIndex.container, zIndex.navigation, etc.)
 * - Android: elevation tokens (elevation.container, elevation.navigation, etc.)
 * 
 * Note: On Android, elevation handles both stacking order and shadow rendering.
 */
export type LayeringValue = 
  | 'container'
  | 'navigation'
  | 'dropdown'
  | 'modal'
  | 'toast'
  | 'tooltip';

/**
 * Semantic HTML elements for web platform
 * 
 * Web-specific prop that allows Container-Base to render as semantic HTML elements
 * for improved accessibility and SEO.
 * 
 * Default: 'div'
 */
export type SemanticHTMLElement = 
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'nav'
  | 'header'
  | 'footer'
  | 'main'
  | 'fieldset';

/**
 * Container-Base component props interface
 * 
 * Platform-agnostic interface for Container-Base styling capabilities.
 * Platform implementations (web, iOS, Android) use these props to generate
 * platform-specific styling.
 * 
 * @example
 * ```typescript
 * // Basic usage
 * <container-base padding="200" background="color.surface">
 *   Content
 * </container-base>
 * 
 * // With multiple styling props
 * <container-base
 *   padding="300"
 *   background="color.primary"
 *   shadow="shadow.container"
 *   border-radius="normal"
 *   layering="navigation"
 * >
 *   Content
 * </container-base>
 * 
 * // Web-specific semantic HTML
 * <container-base semantic="article" accessibility-label="Blog post">
 *   Content
 * </container-base>
 * ```
 */
export interface ContainerBaseProps {
  // Spacing
  /**
   * Internal padding for the container
   * 
   * Maps to space.inset tokens. Use 'none' for no padding.
   * 
   * @default undefined (no padding applied)
   */
  padding?: PaddingValue;
  
  // Visual styling
  /**
   * Background color for the container
   * 
   * Accepts any semantic color token name. Use generated ColorTokenName type
   * for compile-time validation.
   * 
   * @default undefined (no background applied)
   */
  background?: ColorTokenName;
  
  /**
   * Shadow for the container
   * 
   * Accepts any semantic shadow token name. Use generated ShadowTokenName type
   * for compile-time validation.
   * 
   * Note: On Android, if both shadow and layering props are provided, layering
   * takes precedence (elevation handles both stacking and shadow).
   * 
   * @default undefined (no shadow applied)
   */
  shadow?: ShadowTokenName;
  
  /**
   * Border width for the container
   * 
   * Maps to border tokens. Border color uses color.border token.
   * 
   * @default undefined (no border applied)
   */
  border?: BorderValue;
  
  /**
   * Border radius for the container
   * 
   * Maps to radius tokens. Use 'none' for sharp corners.
   * 
   * @default undefined (no border radius applied)
   */
  borderRadius?: BorderRadiusValue;
  
  /**
   * Opacity for the container
   * 
   * Accepts any semantic opacity token name. Use generated OpacityTokenName type
   * for compile-time validation.
   * 
   * @default undefined (full opacity)
   */
  opacity?: OpacityTokenName;
  
  // Layering
  /**
   * Stacking order for the container
   * 
   * Maps to platform-specific tokens:
   * - Web/iOS: z-index tokens
   * - Android: elevation tokens (handles both stacking and shadow)
   * 
   * @default undefined (default stacking context)
   */
  layering?: LayeringValue;
  
  // Content
  /**
   * Child content to render inside the container
   * 
   * Platform-specific types:
   * - Web: React.ReactNode
   * - iOS: SwiftUI View
   * - Android: Composable content
   */
  children?: any; // Platform-specific type
  
  // Accessibility
  /**
   * Accessibility label for the container
   * 
   * Platform-specific implementation:
   * - Web: aria-label attribute
   * - iOS: .accessibilityLabel() modifier
   * - Android: contentDescription in semantics
   * 
   * @default undefined (no accessibility label)
   */
  accessibilityLabel?: string;
  
  // Web-specific
  /**
   * Semantic HTML element to render (web only)
   * 
   * Allows Container-Base to render as semantic HTML elements for improved
   * accessibility and SEO. Ignored on iOS and Android platforms.
   * 
   * @default 'div'
   * @platform web
   */
  semantic?: SemanticHTMLElement;
  
  // iOS-specific
  /**
   * Whether to ignore safe area insets (iOS only)
   * 
   * When true, Container-Base extends into safe area regions (notch, home indicator).
   * Ignored on web and Android platforms.
   * 
   * @default false
   * @platform ios
   */
  ignoresSafeArea?: boolean;
  
  // Interaction
  /**
   * Whether hover state is enabled
   * 
   * When true, Container-Base shows a darkened background on hover using
   * darkerBlend(color.surface, blend.hoverDarker) - 8% darker.
   * 
   * Platform-specific implementation:
   * - Web: CSS :hover pseudo-class with blend utility
   * - iOS: SwiftUI .onHover modifier (macOS/iPadOS with pointer)
   * - Android: Compose hoverable modifier (desktop/ChromeOS with pointer)
   * 
   * @default false
   */
  hoverable?: boolean;
}

/**
 * Type guard to check if a value is a valid PaddingValue
 */
export function isPaddingValue(value: string): value is PaddingValue {
  return ['none', '050', '100', '150', '200', '300', '400'].includes(value);
}

/**
 * Type guard to check if a value is a valid BorderValue
 */
export function isBorderValue(value: string): value is BorderValue {
  return ['none', 'default', 'emphasis', 'heavy'].includes(value);
}

/**
 * Type guard to check if a value is a valid BorderRadiusValue
 */
export function isBorderRadiusValue(value: string): value is BorderRadiusValue {
  return ['none', 'tight', 'normal', 'loose'].includes(value);
}

/**
 * Type guard to check if a value is a valid LayeringValue
 */
export function isLayeringValue(value: string): value is LayeringValue {
  return ['container', 'navigation', 'dropdown', 'modal', 'toast', 'tooltip'].includes(value);
}

/**
 * Type guard to check if a value is a valid SemanticHTMLElement
 */
export function isSemanticHTMLElement(value: string): value is SemanticHTMLElement {
  return ['div', 'section', 'article', 'aside', 'nav', 'header', 'footer', 'main', 'fieldset'].includes(value);
}
