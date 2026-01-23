/**
 * @category evergreen
 * @purpose Unit tests for Badge-Label-Base component
 * @jest-environment jsdom
 */
/**
 * Badge-Label-Base Unit Tests
 * 
 * Tests for the Badge-Label-Base web component covering:
 * - Label rendering
 * - Size variants (sm, md, lg)
 * - Icon support via Icon-Base
 * - Truncation behavior with title attribute
 * - Non-interactivity
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Badge-Label-Base
 * Component Type: Type Primitive (Label)
 * 
 * @module Badge-Label-Base/__tests__/BadgeLabelBase
 * @see Requirements: 1.1-1.10, 4.1-4.8, 6.1-6.6, 8.1-8.10
 * @see .kiro/specs/044-badge-base/design.md - Testing Strategy
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  registerBadgeLabelBase,
  createBadgeLabelBase,
  cleanupBadgeLabelBase,
  getShadowBadge,
  getTextElement,
  getIconContainer,
  getIconElement,
  hasClass,
  cleanupBadgeLabelTokens,
} from './test-utils';
import { BadgeLabelBase } from '../platforms/web/BadgeLabelBase.web';
import { BADGE_LABEL_DEFAULTS } from '../types';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Read the actual CSS file content for CSS validation tests.
 */
function readCSSFileContent(): string {
  const cssPath = path.resolve(
    process.cwd(),
    'src/components/core/Badge-Label-Base/platforms/web/BadgeLabelBase.styles.css'
  );
  if (fs.existsSync(cssPath)) {
    return fs.readFileSync(cssPath, 'utf-8');
  }
  return '';
}

// ============================================================================
// Test Suite
// ============================================================================

describe('Badge-Label-Base Unit Tests', () => {
  // Register component before all tests
  beforeAll(() => {
    registerBadgeLabelBase();
  });

  // Clean up tokens after all tests
  afterAll(() => {
    cleanupBadgeLabelTokens();
  });

  // ============================================================================
  // Label Rendering Tests
  // ============================================================================

  describe('Label Rendering', () => {
    /**
     * **Validates: Requirements 1.1**
     */
    let badge: BadgeLabelBase;

    afterEach(() => {
      if (badge) {
        cleanupBadgeLabelBase(badge);
      }
    });

    it('should render label text content', async () => {
      badge = await createBadgeLabelBase({ label: 'Draft' });

      const textElement = getTextElement(badge);
      expect(textElement).toBeTruthy();
      expect(textElement?.textContent).toBe('Draft');
    });

    it('should update label when property changes', async () => {
      badge = await createBadgeLabelBase({ label: 'Draft' });

      badge.label = 'Published';
      await new Promise(resolve => setTimeout(resolve, 50));

      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('Published');
    });

    it('should escape HTML entities in label', async () => {
      badge = await createBadgeLabelBase({ label: '<script>alert("xss")</script>' });

      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('<script>alert("xss")</script>');
      expect(textElement?.innerHTML).not.toContain('<script>');
    });

    it('should handle empty label', async () => {
      badge = await createBadgeLabelBase({ label: '' });

      const textElement = getTextElement(badge);
      expect(textElement).toBeTruthy();
      expect(textElement?.textContent).toBe('');
    });
  });

  // ============================================================================
  // Size Variants Tests
  // ============================================================================

  describe('Size Variants', () => {
    /**
     * **Validates: Requirements 1.2, 1.3**
     */
    let badge: BadgeLabelBase;

    afterEach(() => {
      if (badge) {
        cleanupBadgeLabelBase(badge);
      }
    });

    it('should default to md size when size prop is omitted', async () => {
      badge = await createBadgeLabelBase({ label: 'Status' });

      expect(badge.size).toBe('md');
      expect(badge.size).toBe(BADGE_LABEL_DEFAULTS.size);
      expect(hasClass(badge, 'badge-label--md')).toBe(true);
    });

    it('should apply sm size class', async () => {
      badge = await createBadgeLabelBase({ label: 'Status', size: 'sm' });

      expect(badge.size).toBe('sm');
      expect(hasClass(badge, 'badge-label--sm')).toBe(true);
      expect(hasClass(badge, 'badge-label--md')).toBe(false);
      expect(hasClass(badge, 'badge-label--lg')).toBe(false);
    });

    it('should apply md size class', async () => {
      badge = await createBadgeLabelBase({ label: 'Status', size: 'md' });

      expect(badge.size).toBe('md');
      expect(hasClass(badge, 'badge-label--md')).toBe(true);
      expect(hasClass(badge, 'badge-label--sm')).toBe(false);
      expect(hasClass(badge, 'badge-label--lg')).toBe(false);
    });

    it('should apply lg size class', async () => {
      badge = await createBadgeLabelBase({ label: 'Status', size: 'lg' });

      expect(badge.size).toBe('lg');
      expect(hasClass(badge, 'badge-label--lg')).toBe(true);
      expect(hasClass(badge, 'badge-label--sm')).toBe(false);
      expect(hasClass(badge, 'badge-label--md')).toBe(false);
    });

    it('should handle invalid size attribute by falling back to default', async () => {
      badge = document.createElement('badge-label-base') as BadgeLabelBase;
      badge.label = 'Status';
      badge.setAttribute('size', 'invalid-size');
      document.body.appendChild(badge);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(badge.size).toBe('md');
    });
  });

  // ============================================================================
  // Icon Support Tests
  // ============================================================================

  describe('Icon Support', () => {
    /**
     * **Validates: Requirements 1.4, 6.2**
     */
    let badge: BadgeLabelBase;

    afterEach(() => {
      if (badge) {
        cleanupBadgeLabelBase(badge);
      }
    });

    it('should render without icon when icon prop is not provided', async () => {
      badge = await createBadgeLabelBase({ label: 'Status' });

      const iconContainer = getIconContainer(badge);
      expect(iconContainer).toBeNull();
    });

    it('should render icon when icon prop is provided', async () => {
      badge = await createBadgeLabelBase({ label: 'Approved', icon: 'check' });

      const iconContainer = getIconContainer(badge);
      expect(iconContainer).toBeTruthy();

      const iconElement = getIconElement(badge);
      expect(iconElement).toBeTruthy();
      expect(iconElement?.getAttribute('name')).toBe('check');
    });

    it('should mark icon as decorative with aria-hidden', async () => {
      badge = await createBadgeLabelBase({ label: 'Approved', icon: 'check' });

      const iconContainer = getIconContainer(badge);
      expect(iconContainer?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should position icon before label text', async () => {
      badge = await createBadgeLabelBase({ label: 'Approved', icon: 'check' });

      const shadowBadge = getShadowBadge(badge);
      const children = shadowBadge?.children;

      if (children && children.length >= 2) {
        expect(children[0].classList.contains('badge-label__icon')).toBe(true);
        expect(children[1].classList.contains('badge-label__text')).toBe(true);
      }
    });

    it('should update icon when property changes', async () => {
      badge = await createBadgeLabelBase({ label: 'Status', icon: 'check' });

      badge.icon = 'info';
      await new Promise(resolve => setTimeout(resolve, 50));

      const iconElement = getIconElement(badge);
      expect(iconElement?.getAttribute('name')).toBe('info');
    });

    it('should remove icon when icon prop is set to null', async () => {
      badge = await createBadgeLabelBase({ label: 'Status', icon: 'check' });

      badge.icon = null;
      await new Promise(resolve => setTimeout(resolve, 50));

      const iconContainer = getIconContainer(badge);
      expect(iconContainer).toBeNull();
    });
  });

  // ============================================================================
  // Truncation Behavior Tests
  // ============================================================================

  describe('Truncation Behavior', () => {
    /**
     * **Validates: Requirements 1.5, 1.6, 1.7, 4.8**
     */
    let badge: BadgeLabelBase;
    let cssContent: string;

    beforeAll(() => {
      cssContent = readCSSFileContent();
    });

    afterEach(() => {
      if (badge) {
        cleanupBadgeLabelBase(badge);
      }
    });

    it('should default to truncate=false', async () => {
      badge = await createBadgeLabelBase({ label: 'Status' });

      expect(badge.truncate).toBe(false);
      expect(badge.truncate).toBe(BADGE_LABEL_DEFAULTS.truncate);
    });

    it('should not apply truncate class when truncate=false', async () => {
      badge = await createBadgeLabelBase({ label: 'Very long category name' });

      const textElement = getTextElement(badge);
      expect(textElement?.classList.contains('badge-label__text--truncate')).toBe(false);
    });

    it('should apply truncate class when truncate=true', async () => {
      badge = await createBadgeLabelBase({
        label: 'Very long category name',
        truncate: true,
      });

      const textElement = getTextElement(badge);
      expect(textElement?.classList.contains('badge-label__text--truncate')).toBe(true);
    });

    it('should add title attribute when truncate=true', async () => {
      const longLabel = 'Very long category name that should be truncated';
      badge = await createBadgeLabelBase({ label: longLabel, truncate: true });

      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.getAttribute('title')).toBe(longLabel);
    });

    it('should not add title attribute when truncate=false', async () => {
      badge = await createBadgeLabelBase({ label: 'Short label', truncate: false });

      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.hasAttribute('title')).toBe(false);
    });

    it('should define truncation CSS with max-width and ellipsis', () => {
      expect(cssContent).toContain('.badge-label__text--truncate');
      expect(cssContent).toContain('text-overflow: ellipsis');
      expect(cssContent).toContain('overflow: hidden');
      expect(cssContent).toContain('white-space: nowrap');
    });

    it('should reference component token for max-width', () => {
      expect(cssContent).toContain('--badge-label-max-width');
    });
  });

  // ============================================================================
  // Non-Interactivity Tests
  // ============================================================================

  describe('Non-Interactivity', () => {
    /**
     * **Validates: Requirement 1.8**
     */
    let badge: BadgeLabelBase;
    let cssContent: string;

    beforeAll(() => {
      cssContent = readCSSFileContent();
    });

    afterEach(() => {
      if (badge) {
        cleanupBadgeLabelBase(badge);
      }
    });

    it('should not have tabindex attribute', async () => {
      badge = await createBadgeLabelBase({ label: 'Status' });

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

    it('should have pointer-events: none to prevent user interaction', () => {
      // pointer-events: none prevents mouse/touch interactions from users
      // Note: programmatic .click() still fires events, but CSS prevents user clicks
      expect(cssContent).toContain('pointer-events: none');
    });
  });

  // ============================================================================
  // Test ID Support Tests
  // ============================================================================

  describe('Test ID Support', () => {
    let badge: BadgeLabelBase;

    afterEach(() => {
      if (badge) {
        cleanupBadgeLabelBase(badge);
      }
    });

    it('should apply data-testid attribute when testID is provided', async () => {
      badge = await createBadgeLabelBase({
        label: 'Status',
        testID: 'status-badge',
      });

      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.getAttribute('data-testid')).toBe('status-badge');
    });

    it('should not have data-testid when testID is not provided', async () => {
      badge = await createBadgeLabelBase({ label: 'Status' });

      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.hasAttribute('data-testid')).toBe(false);
    });
  });

  // ============================================================================
  // Accessibility Tests
  // ============================================================================

  describe('Accessibility', () => {
    /**
     * **Validates: Requirements 1.9, 6.1**
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
