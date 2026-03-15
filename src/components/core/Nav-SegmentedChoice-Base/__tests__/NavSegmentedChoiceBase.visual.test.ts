/**
 * @category evergreen
 * @purpose Verify Nav-SegmentedChoice-Base web component: animation choreography, visual spec, size variants
 * @jest-environment jsdom
 */
/**
 * Nav-SegmentedChoice-Base Web Component — Animation & Visual Tests
 *
 * Validates contracts: animation_coordination, accessibility_reduced_motion,
 * animation_initial_render, visual_background, visual_border, visual_shadow,
 * visual_state_colors, visual_size_variants, layout_flexible_length,
 * content_displays_label, content_supports_icon
 *
 * @module Nav-SegmentedChoice-Base/__tests__
 * @see .kiro/specs/049-nav-segmentedchoice-base/requirements.md Req 3, 7, 9
 */

import { NavSegmentedChoiceBase } from '../platforms/web/NavSegmentedChoiceBase.web';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TEXT_SEGMENTS = JSON.stringify([
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]);

let reducedMotion = false;

async function createComponent(attrs: Record<string, string> = {}): Promise<NavSegmentedChoiceBase> {
  const el = document.createElement('nav-segmented-choice') as NavSegmentedChoiceBase;
  el.setAttribute('segments', attrs.segments ?? TEXT_SEGMENTS);
  el.setAttribute('selected-value', attrs['selected-value'] ?? 'daily');
  if (attrs.size) el.setAttribute('size', attrs.size);
  if (attrs.id) el.setAttribute('id', attrs.id);
  document.body.appendChild(el);
  await new Promise(r => setTimeout(r, 0));
  return el;
}

function getIndicator(el: NavSegmentedChoiceBase): HTMLDivElement {
  return el.shadowRoot!.querySelector('.segmented-choice__indicator')!;
}

function getContainer(el: NavSegmentedChoiceBase): HTMLDivElement {
  return el.shadowRoot!.querySelector('.segmented-choice')!;
}

function getSegments(el: NavSegmentedChoiceBase): HTMLButtonElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll('.segmented-choice__segment'));
}

/** Read the CSS source file for token verification */
function readCSS(): string {
  const fs = require('fs');
  const path = require('path');
  return fs.readFileSync(
    path.resolve(__dirname, '../platforms/web/NavSegmentedChoiceBase.styles.css'),
    'utf-8'
  );
}

/** Create a synthetic transitionend event (TransitionEvent not available in JSDOM) */
function transitionEnd(propertyName: string): Event {
  const evt = new Event('transitionend', { bubbles: true });
  (evt as any).propertyName = propertyName;
  return evt;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Nav-SegmentedChoice-Base — Animation & Visual', () => {
  beforeAll(() => {
    if (!customElements.get('nav-segmented-choice')) {
      customElements.define('nav-segmented-choice', NavSegmentedChoiceBase);
    }
  });

  beforeEach(async () => {
    await customElements.whenDefined('nav-segmented-choice');
    reducedMotion = false;
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)' ? reducedMotion : false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  // ==========================================================================
  // Initial Render (contract: animation_initial_render)
  // ==========================================================================

  describe('Initial Render', () => {
    it('should position indicator without transition on first render', async () => {
      const el = await createComponent();
      const indicator = getIndicator(el);
      expect(indicator.style.transition).toBe('none');
    });

    it('should position indicator at selected segment on mount', async () => {
      const el = await createComponent({ 'selected-value': 'weekly' });
      const indicator = getIndicator(el);
      // Indicator should have left and width set
      expect(indicator.style.left).toBeTruthy();
      expect(indicator.style.width).toBeTruthy();
    });
  });

  // ==========================================================================
  // Animation Choreography (contract: animation_coordination)
  // ==========================================================================

  describe('Animation Choreography', () => {
    it('should set compound transition with all phases when selection changes', async () => {
      const el = await createComponent();
      const indicator = getIndicator(el);

      getSegments(el)[1].click();

      // Compound transition includes width, left, and box-shadow
      const transition = indicator.style.transition;
      expect(transition).toContain('box-shadow');
      expect(transition).toContain('width');
      expect(transition).toContain('left');
      expect(transition).toContain('var(--easing-decelerate)');
      expect(transition).toContain('var(--easing-standard)');
      expect(transition).toContain('var(--easing-glide-decelerate)');
    });

    it('should set box-shadow to empty to transition back from none', async () => {
      const el = await createComponent();
      const indicator = getIndicator(el);

      getSegments(el)[1].click();

      // box-shadow is set to '' (empty) to transition back from 'none' via CSS default
      expect(indicator.style.boxShadow).toBe('');
    });

    it('should use easing and duration tokens in transitions', async () => {
      const el = await createComponent();
      const indicator = getIndicator(el);

      getSegments(el)[2].click();

      const transition = indicator.style.transition;
      expect(transition).toContain('var(--easing-');
      expect(transition).toContain('var(--duration-');
    });

    it('should set target position and width on click', async () => {
      const el = await createComponent();
      const indicator = getIndicator(el);

      getSegments(el)[1].click();

      // Indicator should have left and width set for the target segment
      expect(indicator.style.left).toBeTruthy();
      expect(indicator.style.width).toBeTruthy();
    });

    it('should include delay-based choreography in transition', async () => {
      const el = await createComponent();
      const indicator = getIndicator(el);

      getSegments(el)[1].click();

      // Compound transition uses delays to sequence phases
      const transition = indicator.style.transition;
      // box-shadow has the longest delay (shadow-in after glide completes)
      expect(transition).toMatch(/box-shadow.*var\(--duration-150\).*calc\(/);
    });

    it('should clean up transition after all phases complete', (done) => {
      createComponent().then(el => {
        const indicator = getIndicator(el);
        getSegments(el)[1].click();

        // Compound transition cleans up via setTimeout(700)
        setTimeout(() => {
          expect(indicator.style.transition).toBe('');
          done();
        }, 750);
      });
    });
  });

  // ==========================================================================
  // Reduced Motion (contract: accessibility_reduced_motion)
  // ==========================================================================

  describe('Reduced Motion', () => {
    it('should move indicator instantly when reduced motion is preferred', async () => {
      reducedMotion = true;
      const el = await createComponent();
      const indicator = getIndicator(el);

      getSegments(el)[1].click();

      // No transition — instant move
      expect(indicator.style.transition).toBe('none');
    });

    it('should have CSS prefers-reduced-motion rule as safety net', () => {
      const css = readCSS();
      expect(css).toContain('prefers-reduced-motion: reduce');
      expect(css).toContain('transition: none !important');
    });
  });

  // ==========================================================================
  // Visual Spec — CSS Token Compliance
  // ==========================================================================

  describe('Visual Spec (CSS Tokens)', () => {
    let css: string;

    beforeAll(() => {
      css = readCSS();
    });

    // contract: visual_background
    it('should use color.structure.surface for container background', () => {
      expect(css).toContain('--color-structure-surface');
    });

    it('should use space.inset.050 for container padding', () => {
      expect(css).toContain('--space-inset-050');
    });

    // contract: visual_border
    it('should use border.default for container border', () => {
      expect(css).toContain('--border-default');
    });

    it('should use radius.normal for container border-radius', () => {
      expect(css).toContain('--radius-normal');
    });

    // contract: visual_shadow
    it('should use shadow.navigation.indicator for indicator shadow', () => {
      expect(css).toContain('--shadow-navigation-indicator');
    });

    // contract: visual_state_colors
    it('should use color.structure.canvas for indicator background', () => {
      expect(css).toContain('--color-structure-canvas');
    });

    it('should use color.action.navigation for segment text/icon color', () => {
      expect(css).toContain('--color-action-navigation');
    });

    it('should use radius.small for indicator and segment border-radius', () => {
      expect(css).toContain('--radius-small');
    });

    // contract: layout_flexible_length
    it('should use flex: 1 for equal-width segments', () => {
      expect(css).toContain('flex: 1');
    });

    it('should use tapAreaMinimum for segment min-width', () => {
      expect(css).toContain('--tap-area-minimum');
    });

    it('should use fontWeight700 for segment labels', () => {
      expect(css).toContain('--font-weight-700');
    });
  });

  // ==========================================================================
  // Size Variants (contract: visual_size_variants)
  // ==========================================================================

  describe('Size Variants (CSS Tokens)', () => {
    let css: string;

    beforeAll(() => {
      css = readCSS();
    });

    it('should use standard size tokens for default size', () => {
      expect(css).toContain('--space-inset-150');
      expect(css).toContain('--space-inset-200');
      expect(css).toContain('--font-size-125');
      expect(css).toContain('--line-height-125');
    });

    it('should use condensed size tokens', () => {
      expect(css).toContain('--space-inset-100');
      expect(css).toContain('--font-size-100');
      expect(css).toContain('--line-height-100');
    });

    it('should apply standard size class by default', async () => {
      const el = await createComponent();
      const segments = getSegments(el);
      expect(segments[0].classList.contains('segmented-choice__segment--standard')).toBe(true);
    });

    it('should apply condensed size class when size="condensed"', async () => {
      const el = await createComponent({ size: 'condensed' });
      const segments = getSegments(el);
      expect(segments[0].classList.contains('segmented-choice__segment--condensed')).toBe(true);
    });

    it('should default to standard when size is omitted', async () => {
      const el = await createComponent();
      expect(el.size).toBe('standard');
    });
  });

  // ==========================================================================
  // Content Rendering (contracts: content_displays_label, content_supports_icon)
  // ==========================================================================

  describe('Content Rendering', () => {
    it('should render text labels for text segments', async () => {
      const el = await createComponent();
      const segments = getSegments(el);
      expect(segments[0].textContent).toBe('Daily');
      expect(segments[1].textContent).toBe('Weekly');
      expect(segments[2].textContent).toBe('Monthly');
    });

    it('should render icon-base elements for icon segments', async () => {
      const iconSegs = JSON.stringify([
        { value: 'list', icon: 'list', accessibilityLabel: 'List view' },
        { value: 'grid', icon: 'grid', accessibilityLabel: 'Grid view' },
      ]);
      const el = await createComponent({ segments: iconSegs, 'selected-value': 'list' });
      const segments = getSegments(el);
      expect(segments[0].querySelector('icon-base')).toBeTruthy();
      expect(segments[0].querySelector('icon-base')?.getAttribute('name')).toBe('list');
    });

    it('should set correct icon size for standard variant', async () => {
      const iconSegs = JSON.stringify([
        { value: 'list', icon: 'list', accessibilityLabel: 'List view' },
        { value: 'grid', icon: 'grid', accessibilityLabel: 'Grid view' },
      ]);
      const el = await createComponent({ segments: iconSegs, 'selected-value': 'list' });
      const icon = getSegments(el)[0].querySelector('icon-base');
      expect(icon?.getAttribute('size')).toBe('28');
    });

    it('should set correct icon size for condensed variant', async () => {
      const iconSegs = JSON.stringify([
        { value: 'list', icon: 'list', accessibilityLabel: 'List view' },
        { value: 'grid', icon: 'grid', accessibilityLabel: 'Grid view' },
      ]);
      const el = await createComponent({ segments: iconSegs, 'selected-value': 'list', size: 'condensed' });
      const icon = getSegments(el)[0].querySelector('icon-base');
      expect(icon?.getAttribute('size')).toBe('24');
    });
  });
});
