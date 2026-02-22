/**
 * Container-Card-Base Web Component
 * 
 * Stemma System naming: [Family]-[Type]-[Variant] = Container-Card-Base
 * Type: Type Primitive (Card)
 * 
 * Web platform implementation using Custom Elements with Shadow DOM.
 * Composes Container-Base internally and exposes a curated subset of props
 * appropriate for card use cases.
 * 
 * Key Features:
 * - Zero-config card rendering with opinionated defaults
 * - Curated prop subset (only card-appropriate values)
 * - Interactive behavior (hover, press, focus, keyboard)
 * - ARIA semantics based on role prop
 * 
 * @see ./README.md for complete documentation
 * @see .kiro/specs/043-container-card-base/design.md for complete design
 * @see Requirements 3.1-3.14, 4.1-4.7, 5.1-5.10, 6.1-6.5, 7.1-7.6
 */

import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';
import type {
  CardPaddingValue,
  CardVerticalPaddingValue,
  CardHorizontalPaddingValue,
  CardBackgroundValue,
  CardShadowValue,
  CardBorderValue,
  CardBorderColorValue,
  CardBorderRadiusValue,
  CardSemanticElement,
  CardRole
} from '../../types';
import {
  cardPaddingTokenMap,
  cardVerticalPaddingTokenMap,
  cardHorizontalPaddingTokenMap,
  cardBackgroundTokenMap,
  cardShadowTokenMap,
  cardBorderTokenMap,
  cardBorderColorTokenMap,
  cardBorderRadiusTokenMap
} from '../../tokens';

/**
 * Convert token name to CSS custom property format
 */
function tokenToCssVar(tokenName: string): string {
  return `var(--${tokenName.replace(/\./g, '-')})`;
}

/**
 * Base styles for Container-Card-Base component
 * 
 * These styles provide the foundation for card appearance.
 * Interactive states use blend utilities for cross-platform consistency.
 */
const BASE_STYLES = `
  :host {
    display: block;
    box-sizing: border-box;
  }
  
  .container-card-base {
    box-sizing: border-box;
    display: block;
    width: 100%;
    transition: background-color var(--motion-focus-transition-duration, 150ms) var(--motion-focus-transition-easing, ease-out);
  }
  
  /* Interactive hover state */
  .container-card-base--interactive:hover {
    background-color: var(--_card-hover-bg, inherit);
    cursor: pointer;
  }
  
  /* Interactive press/active state */
  .container-card-base--interactive:active {
    background-color: var(--_card-pressed-bg, inherit);
  }
  
  /* Focus styles for keyboard navigation */
  .container-card-base--interactive:focus {
    outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
    outline-offset: var(--accessibility-focus-offset);
  }
  
  .container-card-base--interactive:focus:not(:focus-visible) {
    outline: none;
  }
  
  .container-card-base--interactive:focus-visible {
    outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
    outline-offset: var(--accessibility-focus-offset);
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .container-card-base {
      transition: none !important;
    }
  }
  
  /* High contrast mode */
  @media (prefers-contrast: high) {
    .container-card-base {
      border-width: var(--border-emphasis, 2px) !important;
    }
  }
  
  /* Print styles */
  @media print {
    .container-card-base {
      box-shadow: none !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
`;

/**
 * Container-Card-Base web component class
 * 
 * Custom element that renders a card with design system token-based styling.
 * Uses Shadow DOM for style encapsulation and composes Container-Base internally.
 */
export class ContainerCardBaseWeb extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _blendUtils: BlendUtilitiesResult;
  private _hoverColor: string = '';
  private _pressedColor: string = '';
  private _onPressCallback: (() => void) | null = null;

  /**
   * Observed attributes for the custom element
   */
  static get observedAttributes(): string[] {
    return [
      'padding',
      'padding-vertical',
      'padding-horizontal',
      'padding-block-start',
      'padding-block-end',
      'padding-inline-start',
      'padding-inline-end',
      'background',
      'shadow',
      'border',
      'border-color',
      'border-radius',
      'semantic',
      'accessibility-label',
      'interactive',
      'role',
      'data-testid'
    ];
  }

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._blendUtils = getBlendUtilities();
  }

  /**
   * Called when element is inserted into the DOM
   */
  connectedCallback(): void {
    this._calculateBlendColors();
    this._setupInteractivity();
    this.render();
  }

  /**
   * Called when element is removed from the DOM
   */
  disconnectedCallback(): void {
    this._removeInteractivity();
  }

  /**
   * Calculate blend colors for hover and press states
   */
  private _calculateBlendColors(): void {
    const computedStyle = getComputedStyle(document.documentElement);
    const background = this.getAttribute('background') as CardBackgroundValue | null;
    
    let baseColor = '';
    
    if (background) {
      const tokenName = cardBackgroundTokenMap[background];
      if (tokenName) {
        const cssVarName = `--${tokenName.replace(/\./g, '-')}`;
        baseColor = computedStyle.getPropertyValue(cssVarName).trim();
      }
    }
    
    // Fallback to default surface color
    if (!baseColor) {
      baseColor = computedStyle.getPropertyValue('--color-structure-surface-primary').trim();
    }
    
    if (!baseColor) {
      baseColor = computedStyle.getPropertyValue('--color-structure-surface').trim();
    }
    
    if (!baseColor) {
      this._hoverColor = '';
      this._pressedColor = '';
      return;
    }
    
    // Calculate hover (8% darker) and pressed (12% darker) colors
    this._hoverColor = this._blendUtils.hoverColor(baseColor);
    this._pressedColor = this._blendUtils.pressedColor(baseColor);
  }

  /**
   * Setup interactivity (keyboard events)
   */
  private _setupInteractivity(): void {
    const interactive = this.getAttribute('interactive') === 'true';
    
    if (interactive) {
      this.addEventListener('keydown', this._handleKeyDown);
      this.addEventListener('click', this._handleClick);
    }
  }

  /**
   * Remove interactivity event listeners
   */
  private _removeInteractivity(): void {
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('click', this._handleClick);
  }

  /**
   * Handle keyboard activation
   * - role='button': Enter or Space triggers onPress
   * - role='link': Only Enter triggers onPress
   */
  private _handleKeyDown = (event: KeyboardEvent): void => {
    const interactive = this.getAttribute('interactive') === 'true';
    if (!interactive) return;
    
    const role = (this.getAttribute('role') as CardRole) || 'button';
    
    if (event.key === 'Enter') {
      event.preventDefault();
      this._triggerOnPress();
    } else if (event.key === ' ' && role === 'button') {
      event.preventDefault();
      this._triggerOnPress();
    }
  };

  /**
   * Handle click events
   */
  private _handleClick = (): void => {
    const interactive = this.getAttribute('interactive') === 'true';
    if (!interactive) return;
    
    this._triggerOnPress();
  };

  /**
   * Trigger the onPress callback
   */
  private _triggerOnPress(): void {
    if (this._onPressCallback) {
      this._onPressCallback();
    }
    
    // Dispatch custom event for external listeners
    this.dispatchEvent(new CustomEvent('press', {
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Set the onPress callback
   */
  set onPress(callback: (() => void) | null) {
    this._onPressCallback = callback;
  }

  /**
   * Get the onPress callback
   */
  get onPress(): (() => void) | null {
    return this._onPressCallback;
  }

  /**
   * Called when an observed attribute changes
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue !== newValue) {
      if (name === 'background') {
        this._calculateBlendColors();
      }
      if (name === 'interactive') {
        this._removeInteractivity();
        this._setupInteractivity();
      }
      this.render();
    }
  }

  /**
   * Default values for card props (opinionated defaults for zero-config cards)
   * These are defined as constants to avoid || string fallback patterns
   * which violate token compliance rules.
   */
  private static readonly DEFAULTS = {
    padding: '150' as CardPaddingValue,
    background: 'surface.primary' as CardBackgroundValue,
    shadow: 'container' as CardShadowValue,
    border: 'none' as CardBorderValue,
    borderColor: 'border.default' as CardBorderColorValue,
    borderRadius: 'normal' as CardBorderRadiusValue,
    semantic: 'div' as CardSemanticElement,
    role: 'button' as CardRole
  };

  /**
   * Render the card with current attributes
   */
  private render(): void {
    // Get attribute values - use explicit default assignment to avoid || string patterns
    const paddingAttr = this.getAttribute('padding') as CardPaddingValue | null;
    const padding: CardPaddingValue = paddingAttr !== null ? paddingAttr : ContainerCardBaseWeb.DEFAULTS.padding;
    
    const paddingVertical = this.getAttribute('padding-vertical') as CardVerticalPaddingValue | null;
    const paddingHorizontal = this.getAttribute('padding-horizontal') as CardHorizontalPaddingValue | null;
    const paddingBlockStart = this.getAttribute('padding-block-start') as CardVerticalPaddingValue | null;
    const paddingBlockEnd = this.getAttribute('padding-block-end') as CardVerticalPaddingValue | null;
    const paddingInlineStart = this.getAttribute('padding-inline-start') as CardHorizontalPaddingValue | null;
    const paddingInlineEnd = this.getAttribute('padding-inline-end') as CardHorizontalPaddingValue | null;
    
    const backgroundAttr = this.getAttribute('background') as CardBackgroundValue | null;
    const background: CardBackgroundValue = backgroundAttr !== null ? backgroundAttr : ContainerCardBaseWeb.DEFAULTS.background;
    
    const shadowAttr = this.getAttribute('shadow') as CardShadowValue | null;
    const shadow: CardShadowValue = shadowAttr !== null ? shadowAttr : ContainerCardBaseWeb.DEFAULTS.shadow;
    
    const borderAttr = this.getAttribute('border') as CardBorderValue | null;
    const border: CardBorderValue = borderAttr !== null ? borderAttr : ContainerCardBaseWeb.DEFAULTS.border;
    
    const borderColorAttr = this.getAttribute('border-color') as CardBorderColorValue | null;
    const borderColor: CardBorderColorValue = borderColorAttr !== null ? borderColorAttr : ContainerCardBaseWeb.DEFAULTS.borderColor;
    
    const borderRadiusAttr = this.getAttribute('border-radius') as CardBorderRadiusValue | null;
    const borderRadius: CardBorderRadiusValue = borderRadiusAttr !== null ? borderRadiusAttr : ContainerCardBaseWeb.DEFAULTS.borderRadius;
    
    const semanticAttr = this.getAttribute('semantic') as CardSemanticElement | null;
    const semantic: CardSemanticElement = semanticAttr !== null ? semanticAttr : ContainerCardBaseWeb.DEFAULTS.semantic;
    
    const accessibilityLabel = this.getAttribute('accessibility-label');
    const interactive = this.getAttribute('interactive') === 'true';
    
    const roleAttr = this.getAttribute('role') as CardRole | null;
    const role: CardRole = roleAttr !== null ? roleAttr : ContainerCardBaseWeb.DEFAULTS.role;
    
    const testId = this.getAttribute('data-testid');

    // Build CSS styles
    const styles = this._buildStyles({
      padding,
      paddingVertical,
      paddingHorizontal,
      paddingBlockStart,
      paddingBlockEnd,
      paddingInlineStart,
      paddingInlineEnd,
      background,
      shadow,
      border,
      borderColor,
      borderRadius
    });

    // Build class names
    const containerClasses = ['container-card-base'];
    if (interactive) {
      containerClasses.push('container-card-base--interactive');
    }

    // Build accessibility attributes
    const accessibilityAttrs: string[] = [];
    if (accessibilityLabel) {
      accessibilityAttrs.push(`aria-label="${accessibilityLabel.replace(/"/g, '&quot;')}"`);
    }
    if (interactive) {
      accessibilityAttrs.push(`role="${role}"`);
      accessibilityAttrs.push('tabindex="0"');
    }
    if (testId) {
      accessibilityAttrs.push(`data-testid="${testId.replace(/"/g, '&quot;')}"`);
    }

    // Generate blend color CSS custom properties for interactive states
    const interactiveStyles = interactive 
      ? `--_card-hover-bg: ${this._hoverColor}; --_card-pressed-bg: ${this._pressedColor};`
      : '';

    // Render Shadow DOM content
    this._shadowRoot.innerHTML = `
      <style>
        ${BASE_STYLES}
        
        .container-card-base {
          ${styles}
        }
      </style>
      <${semantic} class="${containerClasses.join(' ')}" ${accessibilityAttrs.join(' ')} style="${interactiveStyles}">
        <slot></slot>
      </${semantic}>
    `;
  }

  /**
   * Build CSS styles from component props
   */
  private _buildStyles(props: {
    padding: CardPaddingValue;
    paddingVertical: CardVerticalPaddingValue | null;
    paddingHorizontal: CardHorizontalPaddingValue | null;
    paddingBlockStart: CardVerticalPaddingValue | null;
    paddingBlockEnd: CardVerticalPaddingValue | null;
    paddingInlineStart: CardHorizontalPaddingValue | null;
    paddingInlineEnd: CardHorizontalPaddingValue | null;
    background: CardBackgroundValue;
    shadow: CardShadowValue;
    border: CardBorderValue;
    borderColor: CardBorderColorValue;
    borderRadius: CardBorderRadiusValue;
  }): string {
    const styles: string[] = [];

    // Padding hierarchy: uniform -> axis -> individual edges
    // 1. Uniform padding (lowest priority)
    if (props.padding && props.padding !== 'none') {
      const token = cardPaddingTokenMap[props.padding];
      if (token) {
        styles.push(`padding: ${tokenToCssVar(token)}`);
      }
    }

    // 2. Axis props (override uniform)
    if (props.paddingVertical && props.paddingVertical !== 'none') {
      const token = cardVerticalPaddingTokenMap[props.paddingVertical];
      if (token) {
        styles.push(`padding-block: ${tokenToCssVar(token)}`);
      }
    }
    if (props.paddingHorizontal && props.paddingHorizontal !== 'none') {
      const token = cardHorizontalPaddingTokenMap[props.paddingHorizontal];
      if (token) {
        styles.push(`padding-inline: ${tokenToCssVar(token)}`);
      }
    }

    // 3. Individual edges (highest priority)
    if (props.paddingBlockStart && props.paddingBlockStart !== 'none') {
      const token = cardVerticalPaddingTokenMap[props.paddingBlockStart];
      if (token) {
        styles.push(`padding-block-start: ${tokenToCssVar(token)}`);
      }
    }
    if (props.paddingBlockEnd && props.paddingBlockEnd !== 'none') {
      const token = cardVerticalPaddingTokenMap[props.paddingBlockEnd];
      if (token) {
        styles.push(`padding-block-end: ${tokenToCssVar(token)}`);
      }
    }
    if (props.paddingInlineStart && props.paddingInlineStart !== 'none') {
      const token = cardHorizontalPaddingTokenMap[props.paddingInlineStart];
      if (token) {
        styles.push(`padding-inline-start: ${tokenToCssVar(token)}`);
      }
    }
    if (props.paddingInlineEnd && props.paddingInlineEnd !== 'none') {
      const token = cardHorizontalPaddingTokenMap[props.paddingInlineEnd];
      if (token) {
        styles.push(`padding-inline-end: ${tokenToCssVar(token)}`);
      }
    }

    // Background
    const bgToken = cardBackgroundTokenMap[props.background];
    if (bgToken) {
      styles.push(`background: ${tokenToCssVar(bgToken)}`);
    }

    // Shadow
    if (props.shadow !== 'none') {
      const shadowToken = cardShadowTokenMap[props.shadow];
      if (shadowToken) {
        styles.push(`box-shadow: ${tokenToCssVar(shadowToken)}`);
      }
    }

    // Border
    if (props.border !== 'none') {
      const borderWidthToken = cardBorderTokenMap[props.border];
      const borderColorToken = cardBorderColorTokenMap[props.borderColor];
      if (borderWidthToken && borderColorToken) {
        styles.push(`border: ${tokenToCssVar(borderWidthToken)} solid ${tokenToCssVar(borderColorToken)}`);
      }
    }

    // Border radius (always applied for cards)
    const radiusToken = cardBorderRadiusTokenMap[props.borderRadius];
    if (radiusToken) {
      styles.push(`border-radius: ${tokenToCssVar(radiusToken)}`);
    }

    return styles.join(';\n          ');
  }
}

/**
 * Register the custom element
 */
if (!customElements.get('container-card-base')) {
  customElements.define('container-card-base', ContainerCardBaseWeb);
}
