/**
 * @category evergreen
 * @purpose Verify Container-Card-Base composes Container-Base internally (Spec 085)
 * @jest-environment jsdom
 */
/**
 * Runtime composition and accessibility tests for Container-Card-Base web component.
 *
 * These tests verify that Container-Card-Base actually renders through Container-Base
 * at runtime (Req 1 AC 6) and that the accessibility tree is correct for both
 * interactive and non-interactive cards (Req 3 AC 5).
 *
 * Added as part of Spec 085 Task 1.3. Task 1.1 audit found zero existing runtime
 * tests for the web component — these fill that gap.
 *
 * @see .kiro/specs/085-container-card-base-composition/design.md
 */

import { ContainerCardBaseWeb } from '../platforms/web/ContainerCardBase.web';
import { ContainerBaseWeb } from '../../Container-Base/platforms/web/ContainerBase.web';

function setupTokenProperties(): void {
  const root = document.documentElement.style;
  root.setProperty('--color-structure-surface-primary', 'rgba(255, 255, 255, 1)');
  root.setProperty('--color-structure-surface', 'rgba(255, 255, 255, 1)');
  root.setProperty('--motion-focus-transition-duration', '150ms');
  root.setProperty('--motion-focus-transition-easing', 'ease-out');
}

function registerElements(): void {
  if (!customElements.get('container-base')) {
    customElements.define('container-base', ContainerBaseWeb);
  }
  if (!customElements.get('container-card-base')) {
    customElements.define('container-card-base', ContainerCardBaseWeb);
  }
}

function createCard(attrs: Record<string, string> = {}): ContainerCardBaseWeb {
  const card = new ContainerCardBaseWeb();
  for (const [key, value] of Object.entries(attrs)) {
    card.setAttribute(key, value);
  }
  document.body.appendChild(card);
  if (typeof (card as any).connectedCallback === 'function') {
    (card as any).connectedCallback();
  }
  return card;
}

describe('Container-Card-Base Composition (Spec 085)', () => {
  let container: HTMLElement;

  beforeAll(() => {
    registerElements();
  });

  beforeEach(() => {
    setupTokenProperties();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('Runtime Composition Verification (Req 1 AC 6)', () => {
    it('should contain a <container-base> element in its shadow DOM', () => {
      const card = createCard();
      const base = card.shadowRoot?.querySelector('container-base');
      expect(base).toBeTruthy();
    });

    it('should contain a slot inside <container-base> for consumer content', () => {
      const card = createCard();
      const base = card.shadowRoot?.querySelector('container-base');
      const slot = base?.querySelector('slot');
      expect(slot).toBeTruthy();
    });

    it('should wrap <container-base> in an interaction wrapper div', () => {
      const card = createCard();
      const wrapper = card.shadowRoot?.querySelector('.card-interaction-wrapper');
      expect(wrapper).toBeTruthy();
      const base = wrapper?.querySelector('container-base');
      expect(base).toBeTruthy();
    });
  });

  describe('Prop Forwarding to Container-Base', () => {
    it('should forward padding directly to Base', () => {
      const card = createCard({ padding: '200' });
      const base = card.shadowRoot?.querySelector('container-base');
      expect(base?.getAttribute('padding')).toBe('200');
    });

    it('should forward border-radius directly to Base', () => {
      const card = createCard({ 'border-radius': 'loose' });
      const base = card.shadowRoot?.querySelector('container-base');
      expect(base?.getAttribute('border-radius')).toBe('loose');
    });

    it('should resolve background shorthand to Base token name format', () => {
      const card = createCard({ background: 'surface.primary' });
      const base = card.shadowRoot?.querySelector('container-base');
      expect(base?.getAttribute('background')).toBe('color.structure.surface.primary');
    });

    it('should resolve shadow shorthand to Base token name format', () => {
      const card = createCard({ shadow: 'container' });
      const base = card.shadowRoot?.querySelector('container-base');
      expect(base?.getAttribute('shadow')).toBe('shadow.container');
    });

    it('should omit padding attribute on Base when value is none', () => {
      const card = createCard({ padding: 'none' });
      const base = card.shadowRoot?.querySelector('container-base');
      expect(base?.hasAttribute('padding')).toBe(false);
    });

    it('should omit shadow attribute on Base when value is none', () => {
      const card = createCard({ shadow: 'none' });
      const base = card.shadowRoot?.querySelector('container-base');
      expect(base?.hasAttribute('shadow')).toBe(false);
    });

    it('should not set hoverable on Base', () => {
      const card = createCard({ interactive: 'true' });
      const base = card.shadowRoot?.querySelector('container-base');
      expect(base?.hasAttribute('hoverable')).toBe(false);
    });
  });

  describe('Accessibility Tree — ARIA Nesting (Req 3 AC 5)', () => {
    it('should suppress Base semantic element to div when interactive', () => {
      const card = createCard({ interactive: 'true', semantic: 'section' });
      const base = card.shadowRoot?.querySelector('container-base');
      expect(base?.getAttribute('semantic')).toBe('div');
    });

    it('should pass semantic element to Base when not interactive', () => {
      const card = createCard({ semantic: 'article' });
      const base = card.shadowRoot?.querySelector('container-base');
      expect(base?.getAttribute('semantic')).toBe('article');
    });

    it('should set role on interaction wrapper when interactive', () => {
      const card = createCard({ interactive: 'true', role: 'link' });
      const wrapper = card.shadowRoot?.querySelector('.card-interaction-wrapper');
      expect(wrapper?.getAttribute('role')).toBe('link');
    });

    it('should set tabindex on interaction wrapper when interactive', () => {
      const card = createCard({ interactive: 'true' });
      const wrapper = card.shadowRoot?.querySelector('.card-interaction-wrapper');
      expect(wrapper?.getAttribute('tabindex')).toBe('0');
    });

    it('should not set role or tabindex when not interactive', () => {
      const card = createCard();
      const wrapper = card.shadowRoot?.querySelector('.card-interaction-wrapper');
      expect(wrapper?.hasAttribute('role')).toBe(false);
      expect(wrapper?.hasAttribute('tabindex')).toBe(false);
    });
  });
});
