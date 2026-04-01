/**
 * @category evergreen
 * @purpose Verify Nav-SegmentedChoice-Base web component: selection, keyboard, accessibility, hover
 * @jest-environment jsdom
 */
/**
 * Nav-SegmentedChoice-Base Web Component — Interaction & Accessibility Tests
 *
 * Validates contracts: interaction_pressable, interaction_noop_active,
 * interaction_hover, interaction_focus_ring, interaction_keyboard_navigation,
 * interaction_keyboard_activation, interaction_roving_tabindex,
 * accessibility_aria_roles, accessibility_aria_controls, accessibility_alt_text,
 * validation_selection_constraints, content_displays_fallback
 *
 * @module Nav-SegmentedChoice-Base/__tests__
 * @see .kiro/specs/049-nav-segmentedchoice-base/requirements.md Req 1, 4, 5, 6, 8
 */

import { cleanupDOM } from '../../../../__tests__/helpers/web-component-test-utils';
import { NavSegmentedChoiceBase } from '../platforms/web/NavSegmentedChoiceBase.web';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TEXT_SEGMENTS = JSON.stringify([
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]);

const ICON_SEGMENTS = JSON.stringify([
  { value: 'list', icon: 'list', accessibilityLabel: 'List view' },
  { value: 'grid', icon: 'grid', accessibilityLabel: 'Grid view' },
]);

async function createComponent(attrs: Record<string, string> = {}): Promise<NavSegmentedChoiceBase> {
  const el = document.createElement('nav-segmented-choice') as NavSegmentedChoiceBase;
  el.setAttribute('segments', attrs.segments ?? TEXT_SEGMENTS);
  el.setAttribute('selected-value', attrs['selected-value'] ?? 'daily');
  if (attrs.size) el.setAttribute('size', attrs.size);
  if (attrs.id) el.setAttribute('id', attrs.id);
  if (attrs['test-id']) el.setAttribute('test-id', attrs['test-id']);
  document.body.appendChild(el);
  await new Promise(r => setTimeout(r, 0));
  return el;
}

function getSegments(el: NavSegmentedChoiceBase): HTMLButtonElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll('.segmented-choice__segment'));
}

function getContainer(el: NavSegmentedChoiceBase): HTMLDivElement {
  return el.shadowRoot!.querySelector('.segmented-choice')!;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Nav-SegmentedChoice-Base — Interaction & Accessibility', () => {
  beforeAll(() => {
    if (!customElements.get('nav-segmented-choice')) {
      customElements.define('nav-segmented-choice', NavSegmentedChoiceBase);
    }
  });

  beforeEach(async () => {
    await customElements.whenDefined('nav-segmented-choice');
    // Mock matchMedia for reduced motion checks (not available in JSDOM)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    cleanupDOM();
  });

  // ==========================================================================
  // Selection (contract: interaction_pressable, interaction_noop_active)
  // ==========================================================================

  describe('Selection', () => {
    it('should invoke onSelectionChange when clicking an inactive segment', async () => {
      const el = await createComponent();
      const cb = jest.fn();
      el.onSelectionChange = cb;

      const segments = getSegments(el);
      segments[1].click();

      expect(cb).toHaveBeenCalledWith('weekly');
    });

    it('should NOT invoke onSelectionChange when clicking the active segment', async () => {
      const el = await createComponent();
      const cb = jest.fn();
      el.onSelectionChange = cb;

      getSegments(el)[0].click();

      expect(cb).not.toHaveBeenCalled();
    });

    it('should dispatch selection-change CustomEvent', async () => {
      const el = await createComponent();
      const handler = jest.fn();
      el.addEventListener('selection-change', handler);

      getSegments(el)[2].click();

      expect(handler).toHaveBeenCalled();
      expect((handler.mock.calls[0][0] as CustomEvent).detail.value).toBe('monthly');
    });

    it('should update aria-selected after selection change', async () => {
      const el = await createComponent();
      getSegments(el)[1].click();
      await new Promise(r => setTimeout(r, 0));

      const segments = getSegments(el);
      expect(segments[0].getAttribute('aria-selected')).toBe('false');
      expect(segments[1].getAttribute('aria-selected')).toBe('true');
      expect(segments[2].getAttribute('aria-selected')).toBe('false');
    });

    it('should select exactly one segment at all times', async () => {
      const el = await createComponent();
      getSegments(el)[2].click();
      await new Promise(r => setTimeout(r, 0));

      const selected = getSegments(el).filter(s => s.getAttribute('aria-selected') === 'true');
      expect(selected).toHaveLength(1);
    });
  });

  // ==========================================================================
  // Fallback (contract: content_displays_fallback)
  // ==========================================================================

  describe('Fallback', () => {
    it('should fall back to first segment when selectedValue is invalid', async () => {
      const el = await createComponent({ 'selected-value': 'nonexistent' });
      const segments = getSegments(el);
      expect(segments[0].getAttribute('aria-selected')).toBe('true');
    });

    it('should not throw for invalid selectedValue', async () => {
      await expect(createComponent({ 'selected-value': 'bogus' })).resolves.toBeDefined();
    });
  });

  // ==========================================================================
  // Validation (contract: validation_selection_constraints)
  // ==========================================================================

  describe('Minimum Segments', () => {
    it('should throw when 0 segments provided', () => {
      const el = document.createElement('nav-segmented-choice') as NavSegmentedChoiceBase;
      expect(() => { el.segments = []; }).toThrow(/at least 2 segments/);
    });

    it('should throw when 1 segment provided', () => {
      const el = document.createElement('nav-segmented-choice') as NavSegmentedChoiceBase;
      expect(() => { el.segments = [{ value: 'only', label: 'Only' }]; }).toThrow(/at least 2 segments/);
    });

    it('should include segment count in error message', () => {
      const el = document.createElement('nav-segmented-choice') as NavSegmentedChoiceBase;
      expect(() => { el.segments = [{ value: 'a', label: 'A' }]; }).toThrow(/Received: 1/);
    });

    it('should render normally with 2 segments', async () => {
      const el = await createComponent({
        segments: JSON.stringify([
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]),
        'selected-value': 'a',
      });
      expect(getSegments(el)).toHaveLength(2);
    });
  });


  // ==========================================================================
  // Keyboard Navigation (contract: interaction_keyboard_navigation)
  // ==========================================================================

  describe('Keyboard Navigation', () => {
    it('should move focus to next segment on ArrowRight', async () => {
      const el = await createComponent();
      const segments = getSegments(el);
      segments[0].focus();
      segments[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

      expect(el.shadowRoot!.activeElement).toBe(segments[1]);
    });

    it('should move focus to previous segment on ArrowLeft', async () => {
      const el = await createComponent();
      const segments = getSegments(el);
      segments[1].focus();
      segments[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));

      expect(el.shadowRoot!.activeElement).toBe(segments[0]);
    });

    it('should wrap focus from last to first on ArrowRight', async () => {
      const el = await createComponent();
      const segments = getSegments(el);
      segments[2].focus();
      segments[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

      expect(el.shadowRoot!.activeElement).toBe(segments[0]);
    });

    it('should wrap focus from first to last on ArrowLeft', async () => {
      const el = await createComponent();
      const segments = getSegments(el);
      segments[0].focus();
      segments[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));

      expect(el.shadowRoot!.activeElement).toBe(segments[2]);
    });

    it('should move focus on ArrowDown (same as ArrowRight)', async () => {
      const el = await createComponent();
      const segments = getSegments(el);
      segments[0].focus();
      segments[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(el.shadowRoot!.activeElement).toBe(segments[1]);
    });

    it('should move focus on ArrowUp (same as ArrowLeft)', async () => {
      const el = await createComponent();
      const segments = getSegments(el);
      segments[1].focus();
      segments[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

      expect(el.shadowRoot!.activeElement).toBe(segments[0]);
    });

    it('should NOT change selection on arrow key (focus only)', async () => {
      const el = await createComponent();
      const cb = jest.fn();
      el.onSelectionChange = cb;

      const segments = getSegments(el);
      segments[0].focus();
      segments[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

      expect(cb).not.toHaveBeenCalled();
      expect(el.selectedValue).toBe('daily');
    });
  });

  // ==========================================================================
  // Keyboard Activation (contract: interaction_keyboard_activation)
  // ==========================================================================

  describe('Keyboard Activation', () => {
    it('should select focused segment on Enter', async () => {
      const el = await createComponent();
      const cb = jest.fn();
      el.onSelectionChange = cb;

      const segments = getSegments(el);
      segments[1].focus();
      segments[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(cb).toHaveBeenCalledWith('weekly');
    });

    it('should select focused segment on Space', async () => {
      const el = await createComponent();
      const cb = jest.fn();
      el.onSelectionChange = cb;

      const segments = getSegments(el);
      segments[2].focus();
      segments[2].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(cb).toHaveBeenCalledWith('monthly');
    });

    it('should NOT invoke callback when Enter on already-selected segment', async () => {
      const el = await createComponent();
      const cb = jest.fn();
      el.onSelectionChange = cb;

      const segments = getSegments(el);
      segments[0].focus();
      segments[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(cb).not.toHaveBeenCalled();
    });
  });

  // ==========================================================================
  // Roving Tabindex (contract: interaction_roving_tabindex)
  // ==========================================================================

  describe('Roving Tabindex', () => {
    it('should set tabindex="0" on selected segment', async () => {
      const el = await createComponent();
      const segments = getSegments(el);
      expect(segments[0].tabIndex).toBe(0);
    });

    it('should set tabindex="-1" on unselected segments', async () => {
      const el = await createComponent();
      const segments = getSegments(el);
      expect(segments[1].tabIndex).toBe(-1);
      expect(segments[2].tabIndex).toBe(-1);
    });

    it('should update tabindex after selection change', async () => {
      const el = await createComponent();
      getSegments(el)[1].click();
      await new Promise(r => setTimeout(r, 0));

      const segments = getSegments(el);
      expect(segments[0].tabIndex).toBe(-1);
      expect(segments[1].tabIndex).toBe(0);
      expect(segments[2].tabIndex).toBe(-1);
    });
  });

  // ==========================================================================
  // ARIA Roles (contract: accessibility_aria_roles)
  // ==========================================================================

  describe('ARIA Roles', () => {
    it('should have role="tablist" on container', async () => {
      const el = await createComponent();
      expect(getContainer(el).getAttribute('role')).toBe('tablist');
    });

    it('should have role="tab" on each segment', async () => {
      const el = await createComponent();
      for (const seg of getSegments(el)) {
        expect(seg.getAttribute('role')).toBe('tab');
      }
    });

    it('should set aria-selected="true" on selected segment', async () => {
      const el = await createComponent();
      expect(getSegments(el)[0].getAttribute('aria-selected')).toBe('true');
    });

    it('should set aria-selected="false" on unselected segments', async () => {
      const el = await createComponent();
      const segments = getSegments(el);
      expect(segments[1].getAttribute('aria-selected')).toBe('false');
      expect(segments[2].getAttribute('aria-selected')).toBe('false');
    });
  });

  // ==========================================================================
  // ARIA Controls (contract: accessibility_aria_controls)
  // ==========================================================================

  describe('ARIA Controls', () => {
    it('should generate aria-controls when id prop is provided', async () => {
      const el = await createComponent({ id: 'freq' });
      const segments = getSegments(el);
      expect(segments[0].getAttribute('aria-controls')).toBe('freq-panel-daily');
      expect(segments[1].getAttribute('aria-controls')).toBe('freq-panel-weekly');
      expect(segments[2].getAttribute('aria-controls')).toBe('freq-panel-monthly');
    });

    it('should NOT render aria-controls when id is omitted', async () => {
      const el = await createComponent();
      for (const seg of getSegments(el)) {
        expect(seg.hasAttribute('aria-controls')).toBe(false);
      }
    });
  });

  // ==========================================================================
  // Icon Accessibility (contract: accessibility_alt_text)
  // ==========================================================================

  describe('Icon Accessibility', () => {
    it('should set aria-label on icon-base element from accessibilityLabel', async () => {
      const el = await createComponent({ segments: ICON_SEGMENTS, 'selected-value': 'list' });
      const segments = getSegments(el);
      const icon1 = segments[0].querySelector('icon-base');
      expect(icon1?.getAttribute('aria-label')).toBe('List view');
      const icon2 = segments[1].querySelector('icon-base');
      expect(icon2?.getAttribute('aria-label')).toBe('Grid view');
    });
  });

  // ==========================================================================
  // Hover (contract: interaction_hover — CSS-based, limited JSDOM testability)
  // ==========================================================================

  describe('Hover', () => {
    it('should have hover CSS rule targeting only inactive segments in source stylesheet', () => {
      // CSS modules return empty in JSDOM — verify source file directly
      const fs = require('fs');
      const path = require('path');
      const cssPath = path.resolve(__dirname, '../platforms/web/NavSegmentedChoiceBase.styles.css');
      const css = fs.readFileSync(cssPath, 'utf-8');
      expect(css).toContain('aria-selected="false"]:hover');
      expect(css).toContain('--blend-container-hover-darker');
    });
  });
});
