/**
 * Container-Card-Base Web Component
 *
 * Stemma System naming: [Family]-[Type]-[Variant] = Container-Card-Base
 * Type: Type Primitive (Card)
 *
 * Web platform implementation using Custom Elements with Shadow DOM.
 * Composes Container-Base internally via nested custom element (W1 pattern).
 * Card owns the interaction layer; Base owns layout rendering.
 *
 * Composition boundary:
 * - Card wrapper: hover, press, focus, keyboard, onPress, ARIA role
 * - Container-Base: padding, background, shadow, border, borderRadius, semantic element, slot
 *
 * @see .kiro/specs/085-container-card-base-composition/design.md
 * @see .kiro/specs/043-container-card-base/design.md
 * @see Requirements 1.1, 1.4, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3
 */

import { getBlendUtilities, BlendUtilitiesResult } from '../../../../../blend/ThemeAwareBlendUtilities.web';
// Ensure Container-Base is registered before Card uses it
import '../../../Container-Base/platforms/web/ContainerBase.web';
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
  cardBackgroundTokenMap,
  cardShadowTokenMap,
  cardBorderColorTokenMap
} from '../../tokens';

/**
 * Base styles for Container-Card-Base component
 *
 * Card's interaction layer styles. Layout styles are handled by Container-Base.
 */
const BASE_STYLES = `
  :host {
    display: block;
    box-sizing: border-box;
  }

  .card-interaction-wrapper {
    display: block;
    width: 100%;
    transition: background-color var(--motion-focus-transition-duration, 150ms) var(--motion-focus-transition-easing, ease-out);
  }

  /* Interactive hover state */
  .card-interaction-wrapper--interactive:hover {
    background-color: var(--_card-hover-bg, inherit);
    cursor: pointer;
  }

  /* Interactive press/active state */
  .card-interaction-wrapper--interactive:active {
    background-color: var(--_card-pressed-bg, inherit);
  }

  /* Focus styles for keyboard navigation */
  .card-interaction-wrapper--interactive:focus {
    outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
    outline-offset: var(--accessibility-focus-offset);
  }

  .card-interaction-wrapper--interactive:focus:not(:focus-visible) {
    outline: none;
  }

  .card-interaction-wrapper--interactive:focus-visible {
    outline: var(--accessibility-focus-width) solid var(--accessibility-focus-color);
    outline-offset: var(--accessibility-focus-offset);
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .card-interaction-wrapper {
      transition: none !important;
    }
  }

  /* High contrast mode — applied to composed container-base via CSS custom property inheritance */
  @media (prefers-contrast: high) {
    container-base {
      --_card-high-contrast-border: var(--border-emphasis, 2px);
    }
  }

  /* Print styles */
  @media print {
    container-base {
      --_card-print-shadow: none;
    }
  }
`;

/**
 * Container-Card-Base web component class
 *
 * Composes Container-Base internally (W1 pattern — nested custom element).
 * Card handles interaction; Base handles layout.
 */
export class ContainerCardBaseWeb extends HTMLElement {
  private _shadowRoot: ShadowRoot;
  private _blendUtils: BlendUtilitiesResult;
  private _hoverColor: string = '';
  private _pressedColor: string = '';
  private _onPressCallback: (() => void) | null = null;

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

  connectedCallback(): void {
    this._calculateBlendColors();
    this._setupInteractivity();
    this.render();
  }

  disconnectedCallback(): void {
    this._removeInteractivity();
  }

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

    this._hoverColor = this._blendUtils.hoverColor(baseColor);
    this._pressedColor = this._blendUtils.pressedColor(baseColor);
  }

  private _setupInteractivity(): void {
    if (this.getAttribute('interactive') === 'true') {
      this.addEventListener('keydown', this._handleKeyDown);
      this.addEventListener('click', this._handleClick);
    }
  }

  private _removeInteractivity(): void {
    this.removeEventListener('keydown', this._handleKeyDown);
    this.removeEventListener('click', this._handleClick);
  }

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (this.getAttribute('interactive') !== 'true') return;

    const role = (this.getAttribute('role') as CardRole) || 'button';

    if (event.key === 'Enter') {
      event.preventDefault();
      this._triggerOnPress();
    } else if (event.key === ' ' && role === 'button') {
      event.preventDefault();
      this._triggerOnPress();
    }
  };

  private _handleClick = (): void => {
    if (this.getAttribute('interactive') !== 'true') return;
    this._triggerOnPress();
  };

  private _triggerOnPress(): void {
    if (this._onPressCallback) {
      this._onPressCallback();
    }
    this.dispatchEvent(new CustomEvent('press', { bubbles: true, composed: true }));
  }

  set onPress(callback: (() => void) | null) {
    this._onPressCallback = callback;
  }

  get onPress(): (() => void) | null {
    return this._onPressCallback;
  }

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
   * Build Container-Base attributes string.
   *
   * Two-track prop forwarding:
   * - Direct pass-through: padding, border, borderRadius, semantic, accessibilityLabel
   * - Resolve then pass: background, shadow, borderColor (Card shorthand → Base token name)
   *
   * Omits attributes when value resolves to 'none' (Ada R1 — let Base use its own defaults).
   */
  private _buildBaseAttributes(): string {
    const D = ContainerCardBaseWeb.DEFAULTS;
    const attrs: string[] = [];

    // --- Direct pass-through props ---

    const padding = this.getAttribute('padding') as CardPaddingValue | null ?? D.padding;
    if (padding !== 'none') attrs.push(`padding="${padding}"`);

    // Directional padding — pass through only if set (no defaults)
    const dirPadding: [string, string][] = [
      ['padding-vertical', 'padding-vertical'],
      ['padding-horizontal', 'padding-horizontal'],
      ['padding-block-start', 'padding-block-start'],
      ['padding-block-end', 'padding-block-end'],
      ['padding-inline-start', 'padding-inline-start'],
      ['padding-inline-end', 'padding-inline-end'],
    ];
    for (const [cardAttr, baseAttr] of dirPadding) {
      const val = this.getAttribute(cardAttr);
      if (val && val !== 'none') attrs.push(`${baseAttr}="${val}"`);
    }

    const border = this.getAttribute('border') as CardBorderValue | null ?? D.border;
    if (border !== 'none') attrs.push(`border="${border}"`);

    const borderRadius = this.getAttribute('border-radius') as CardBorderRadiusValue | null ?? D.borderRadius;
    attrs.push(`border-radius="${borderRadius}"`);

    // Semantic element: suppress to 'div' when interactive (Req 3.5 — ARIA nesting)
    const interactive = this.getAttribute('interactive') === 'true';
    const semantic = interactive
      ? 'div'
      : (this.getAttribute('semantic') as CardSemanticElement | null ?? D.semantic);
    attrs.push(`semantic="${semantic}"`);

    const accessibilityLabel = this.getAttribute('accessibility-label');
    if (accessibilityLabel) {
      attrs.push(`accessibility-label="${accessibilityLabel.replace(/"/g, '&quot;')}"`);
    }

    // --- Resolve then pass props (Card shorthand → Base token name) ---

    const background = this.getAttribute('background') as CardBackgroundValue | null ?? D.background;
    const bgToken = cardBackgroundTokenMap[background];
    if (bgToken) attrs.push(`background="${bgToken}"`);

    const shadow = this.getAttribute('shadow') as CardShadowValue | null ?? D.shadow;
    if (shadow !== 'none') {
      const shadowToken = cardShadowTokenMap[shadow];
      if (shadowToken) attrs.push(`shadow="${shadowToken}"`);
    }

    if (border !== 'none') {
      const borderColor = this.getAttribute('border-color') as CardBorderColorValue | null ?? D.borderColor;
      const borderColorToken = cardBorderColorTokenMap[borderColor];
      if (borderColorToken) attrs.push(`border-color="${borderColorToken}"`);
    }

    // hoverable: false — Card owns all interaction (Design Decision 2)
    // Omitting the attribute; Base defaults to false.

    return attrs.join(' ');
  }

  private render(): void {
    const interactive = this.getAttribute('interactive') === 'true';
    const roleAttr = this.getAttribute('role') as CardRole | null;
    const role: CardRole = roleAttr !== null ? roleAttr : ContainerCardBaseWeb.DEFAULTS.role;
    const testId = this.getAttribute('data-testid');

    // Build interaction wrapper attributes
    const wrapperClasses = ['card-interaction-wrapper'];
    if (interactive) wrapperClasses.push('card-interaction-wrapper--interactive');

    const wrapperAttrs: string[] = [];
    if (interactive) {
      wrapperAttrs.push(`role="${role}"`);
      wrapperAttrs.push('tabindex="0"');
    }
    if (testId) {
      wrapperAttrs.push(`data-testid="${testId.replace(/"/g, '&quot;')}"`);
    }

    // Blend color CSS custom properties for interactive states
    const interactiveStyles = interactive
      ? `--_card-hover-bg: ${this._hoverColor}; --_card-pressed-bg: ${this._pressedColor};`
      : '';

    // Build Container-Base attributes (two-track forwarding)
    const baseAttrs = this._buildBaseAttributes();

    this._shadowRoot.innerHTML = `
      <style>${BASE_STYLES}</style>
      <div class="${wrapperClasses.join(' ')}" ${wrapperAttrs.join(' ')} style="${interactiveStyles}">
        <container-base ${baseAttrs}>
          <slot></slot>
        </container-base>
      </div>
    `;
  }
}

if (!customElements.get('container-card-base')) {
  customElements.define('container-card-base', ContainerCardBaseWeb);
}
