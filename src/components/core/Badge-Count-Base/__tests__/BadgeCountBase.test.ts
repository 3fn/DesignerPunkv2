/**
 * @category evergreen
 * @purpose Unit tests for Badge-Count-Base component
 * @jest-environment jsdom
 */
/**
 * Badge-Count-Base Unit Tests
 * 
 * Tests for the Badge-Count-Base web component covering:
 * - Count rendering for single/double/triple digits
 * - Circular vs pill shape behavior
 * - Max truncation ("99+")
 * - showZero behavior
 * - Size variants (sm, md, lg)
 * - Non-interactivity
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Badge-Count-Base
 * Component Type: Type Primitive (Count)
 * 
 * @module Badge-Count-Base/__tests__/BadgeCountBase
 * @see Requirements: 2.1-2.13, 4.3, 4.4, 5.1
 * @see .kiro/specs/044-badge-base/design.md - Testing Strategy
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  registerBadgeCountBase,
  createBadgeCountBase,
  cleanupBadgeCountBase,
  getShadowBadge,
  getTextElement,
  hasClass,
  isRendered,
  cleanupBadgeCountTokens,
} from './test-utils';
import { BadgeCountBase } from '../platforms/web/BadgeCountBase.web';
import { BADGE_COUNT_DEFAULTS } from '../types';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Read the actual CSS file content for CSS validation tests.
 */
function readCSSFileContent(): string {
  const cssPath = path.resolve(
    process.cwd(),
    'src/components/core/Badge-Count-Base/platforms/web/BadgeCountBase.styles.css'
  );
  if (fs.existsSync(cssPath)) {
    return fs.readFileSync(cssPath, 'utf-8');
  }
  return '';
}

// ============================================================================
// Test Suite
// ============================================================================

describe('Badge-Count-Base Unit Tests', () => {
  // Register component before all tests
  beforeAll(() => {
    registerBadgeCountBase();
  });

  // Clean up tokens after all tests
  afterAll(() => {
    cleanupBadgeCountTokens();
  });

  // ============================================================================
  // Count Rendering Tests
  // ============================================================================

  describe('Count Rendering', () => {
    /**
     * **Validates: Requirement 2.1**
     */
    let badge: BadgeCountBase;

    afterEach(() => {
      if (badge) {
        cleanupBadgeCountBase(badge);
      }
    });

    it('should render single digit count', async () => {
      badge = await createBadgeCountBase({ count: 5 });

      const textElement = getTextElement(badge);
      expect(textElement).toBeTruthy();
      expect(textElement?.textContent).toBe('5');
    });

    it('should render double digit count', async () => {
      badge = await createBadgeCountBase({ count: 42 });

      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('42');
    });

    it('should render triple digit count within max', async () => {
      badge = await createBadgeCountBase({ count: 100, max: 999 });

      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('100');
    });

    it('should update count when property changes', async () => {
      badge = await createBadgeCountBase({ count: 5 });

      badge.count = 10;
      await new Promise(resolve => setTimeout(resolve, 50));

      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('10');
    });

    it('should handle negative count by using absolute value', async () => {
      badge = await createBadgeCountBase({ count: -5 });

      expect(badge.count).toBe(5);
      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('5');
    });

    it('should handle NaN count by rendering 0', async () => {
      badge = document.createElement('badge-count-base') as BadgeCountBase;
      badge.setAttribute('count', 'not-a-number');
      badge.showZero = true;
      document.body.appendChild(badge);
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(badge.count).toBe(0);
      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('0');
    });
  });

  // ============================================================================
  // Max Truncation Tests
  // ============================================================================

  describe('Max Truncation', () => {
    /**
     * **Validates: Requirements 2.4, 2.5**
     */
    let badge: BadgeCountBase;

    afterEach(() => {
      if (badge) {
        cleanupBadgeCountBase(badge);
      }
    });

    it('should default max to 99', async () => {
      badge = await createBadgeCountBase({ count: 50 });

      expect(badge.max).toBe(99);
      expect(badge.max).toBe(BADGE_COUNT_DEFAULTS.max);
    });

    it('should show exact value when count equals max', async () => {
      badge = await createBadgeCountBase({ count: 99, max: 99 });

      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('99');
    });

    it('should show "[max]+" when count exceeds max', async () => {
      badge = await createBadgeCountBase({ count: 100, max: 99 });

      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('99+');
    });

    it('should respect custom max value', async () => {
      badge = await createBadgeCountBase({ count: 50, max: 49 });

      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('49+');
    });

    it('should use default max when max is 0', async () => {
      badge = document.createElement('badge-count-base') as BadgeCountBase;
      badge.count = 100;
      badge.setAttribute('max', '0');
      document.body.appendChild(badge);
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(badge.max).toBe(99);
    });

    it('should use default max when max is negative', async () => {
      badge = document.createElement('badge-count-base') as BadgeCountBase;
      badge.count = 100;
      badge.setAttribute('max', '-10');
      document.body.appendChild(badge);
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(badge.max).toBe(99);
    });
  });

  // ============================================================================
  // showZero Behavior Tests
  // ============================================================================

  describe('showZero Behavior', () => {
    /**
     * **Validates: Requirements 2.6, 2.7, 2.8**
     */
    let badge: BadgeCountBase;

    afterEach(() => {
      if (badge) {
        cleanupBadgeCountBase(badge);
      }
    });

    it('should default showZero to false', async () => {
      badge = await createBadgeCountBase({ count: 5 });

      expect(badge.showZero).toBe(false);
      expect(badge.showZero).toBe(BADGE_COUNT_DEFAULTS.showZero);
    });

    it('should not render when count is 0 and showZero is false', async () => {
      badge = await createBadgeCountBase({ count: 0, showZero: false });

      expect(isRendered(badge)).toBe(false);
      expect(getShadowBadge(badge)).toBeNull();
    });

    it('should render "0" when count is 0 and showZero is true', async () => {
      badge = await createBadgeCountBase({ count: 0, showZero: true });

      expect(isRendered(badge)).toBe(true);
      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('0');
    });

    it('should update visibility when showZero changes', async () => {
      badge = await createBadgeCountBase({ count: 0, showZero: false });
      expect(isRendered(badge)).toBe(false);

      badge.showZero = true;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(isRendered(badge)).toBe(true);
      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('0');
    });
  });

  // ============================================================================
  // Size Variants Tests
  // ============================================================================

  describe('Size Variants', () => {
    /**
     * **Validates: Requirements 2.9, 2.10**
     */
    let badge: BadgeCountBase;

    afterEach(() => {
      if (badge) {
        cleanupBadgeCountBase(badge);
      }
    });

    it('should default to md size when size prop is omitted', async () => {
      badge = await createBadgeCountBase({ count: 5 });

      expect(badge.size).toBe('md');
      expect(badge.size).toBe(BADGE_COUNT_DEFAULTS.size);
      expect(hasClass(badge, 'badge-count--md')).toBe(true);
    });

    it('should apply sm size class', async () => {
      badge = await createBadgeCountBase({ count: 5, size: 'sm' });

      expect(badge.size).toBe('sm');
      expect(hasClass(badge, 'badge-count--sm')).toBe(true);
      expect(hasClass(badge, 'badge-count--md')).toBe(false);
      expect(hasClass(badge, 'badge-count--lg')).toBe(false);
    });

    it('should apply md size class', async () => {
      badge = await createBadgeCountBase({ count: 5, size: 'md' });

      expect(badge.size).toBe('md');
      expect(hasClass(badge, 'badge-count--md')).toBe(true);
      expect(hasClass(badge, 'badge-count--sm')).toBe(false);
      expect(hasClass(badge, 'badge-count--lg')).toBe(false);
    });

    it('should apply lg size class', async () => {
      badge = await createBadgeCountBase({ count: 5, size: 'lg' });

      expect(badge.size).toBe('lg');
      expect(hasClass(badge, 'badge-count--lg')).toBe(true);
      expect(hasClass(badge, 'badge-count--sm')).toBe(false);
      expect(hasClass(badge, 'badge-count--md')).toBe(false);
    });

    it('should handle invalid size attribute by falling back to default', async () => {
      badge = document.createElement('badge-count-base') as BadgeCountBase;
      badge.count = 5;
      badge.setAttribute('size', 'invalid-size');
      document.body.appendChild(badge);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(badge.size).toBe('md');
    });
  });

  // ============================================================================
  // Shape Behavior Tests (CSS Validation)
  // ============================================================================

  describe('Shape Behavior', () => {
    /**
     * **Validates: Requirements 2.2, 2.3 (circular vs pill shape)**
     */
    let cssContent: string;

    beforeAll(() => {
      cssContent = readCSSFileContent();
    });

    it('should use radiusHalf (50%) for circular/pill shape', () => {
      expect(cssContent).toContain('border-radius: var(--radius-half');
    });

    it('should define min-width equal to line-height for circular single digits', () => {
      // sm size: min-width = line-height-050
      expect(cssContent).toContain('min-width: var(--line-height-050)');
      // md size: min-width = line-height-075
      expect(cssContent).toContain('min-width: var(--line-height-075)');
      // lg size: min-width = line-height-100
      expect(cssContent).toContain('min-width: var(--line-height-100)');
    });

    it('should center content for circular shape', () => {
      expect(cssContent).toContain('justify-content: center');
      expect(cssContent).toContain('align-items: center');
    });
  });

  // ============================================================================
  // Non-Interactivity Tests
  // ============================================================================

  describe('Non-Interactivity', () => {
    /**
     * **Validates: Requirement 2.11**
     */
    let badge: BadgeCountBase;
    let cssContent: string;

    beforeAll(() => {
      cssContent = readCSSFileContent();
    });

    afterEach(() => {
      if (badge) {
        cleanupBadgeCountBase(badge);
      }
    });

    it('should not have tabindex attribute', async () => {
      badge = await createBadgeCountBase({ count: 5 });

      expect(badge.hasAttribute('tabindex')).toBe(false);
      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.hasAttribute('tabindex')).toBe(false);
    });

    it('should have pointer-events: none in CSS', () => {
      expect(cssContent).toContain('pointer-events: none');
    });

    it('should have user-select: none in CSS', () => {
      expect(cssContent).toContain('user-select: none');
    });
  });

  // ============================================================================
  // Test ID Support Tests
  // ============================================================================

  describe('Test ID Support', () => {
    let badge: BadgeCountBase;

    afterEach(() => {
      if (badge) {
        cleanupBadgeCountBase(badge);
      }
    });

    it('should apply data-testid attribute when testID is provided', async () => {
      badge = await createBadgeCountBase({
        count: 5,
        testID: 'notification-badge',
      });

      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.getAttribute('data-testid')).toBe('notification-badge');
    });

    it('should not have data-testid when testID is not provided', async () => {
      badge = await createBadgeCountBase({ count: 5 });

      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.hasAttribute('data-testid')).toBe(false);
    });
  });

  // ============================================================================
  // Accessibility Tests
  // ============================================================================

  describe('Accessibility', () => {
    /**
     * **Validates: Requirements 2.12, 2.13**
     */
    let cssContent: string;

    beforeAll(() => {
      cssContent = readCSSFileContent();
    });

    it('should have high contrast mode support', () => {
      expect(cssContent).toContain('prefers-contrast: high');
    });

    it('should have reduced motion support', () => {
      expect(cssContent).toContain('prefers-reduced-motion: reduce');
    });

    it('should have print styles', () => {
      expect(cssContent).toContain('@media print');
    });

    it('should use token-based colors for WCAG compliance', () => {
      expect(cssContent).toContain('var(--color-surface');
      expect(cssContent).toContain('var(--color-text-default');
    });
  });
});
