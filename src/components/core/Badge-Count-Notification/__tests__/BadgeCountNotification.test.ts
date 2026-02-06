/**
 * @category evergreen
 * @purpose Unit tests for Badge-Count-Notification component
 * @jest-environment jsdom
 */
/**
 * Badge-Count-Notification Unit Tests
 * 
 * Tests for the Badge-Count-Notification web component covering:
 * - Notification color tokens applied
 * - Live region attributes present (Web)
 * - Announcement text pluralization
 * - announceChanges opt-out behavior
 * - Inherited Badge-Count-Base behavior
 * 
 * Stemma System Naming: [Family]-[Type]-[Variant] = Badge-Count-Notification
 * Component Type: Semantic Variant (inherits from Badge-Count-Base)
 * 
 * @module Badge-Count-Notification/__tests__/BadgeCountNotification
 * @see Requirements: 3.1-3.10, 4.7, 5.1, 6.3
 * @see .kiro/specs/044-badge-base/design.md - Testing Strategy
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  registerBadgeCountNotification,
  createBadgeCountNotification,
  cleanupBadgeCountNotification,
  getShadowBadge,
  getTextElement,
  getAnnouncementElement,
  hasClass,
  isRendered,
  cleanupBadgeCountNotificationTokens,
} from './test-utils';
import { BadgeCountNotification } from '../platforms/web/BadgeCountNotification.web';
import { BADGE_COUNT_NOTIFICATION_DEFAULTS } from '../types';

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Read the actual CSS file content for CSS validation tests.
 */
function readCSSFileContent(): string {
  const cssPath = path.resolve(
    process.cwd(),
    'src/components/core/Badge-Count-Notification/platforms/web/BadgeCountNotification.styles.css'
  );
  if (fs.existsSync(cssPath)) {
    return fs.readFileSync(cssPath, 'utf-8');
  }
  return '';
}

// ============================================================================
// Test Suite
// ============================================================================

describe('Badge-Count-Notification Unit Tests', () => {
  // Register component before all tests
  beforeAll(() => {
    registerBadgeCountNotification();
  });

  // Clean up tokens after all tests
  afterAll(() => {
    cleanupBadgeCountNotificationTokens();
  });

  // ============================================================================
  // Notification Color Tokens Tests
  // ============================================================================

  describe('Notification Color Tokens', () => {
    /**
     * **Validates: Requirement 3.1**
     */
    let cssContent: string;

    beforeAll(() => {
      cssContent = readCSSFileContent();
    });

    it('should use notification background color token', () => {
      // Updated to use semantic token (Spec 046 Task 8.2)
      expect(cssContent).toContain('var(--color-feedback-notification-background)');
    });

    it('should use notification text color token', () => {
      // Updated to use semantic token (Spec 046 Task 8.2)
      expect(cssContent).toContain('var(--color-feedback-notification-text)');
    });

    it('should not have configurable color props', async () => {
      const badge = await createBadgeCountNotification({ count: 5 });

      // Badge-Count-Notification should not have backgroundColor or textColor props
      expect((badge as any).backgroundColor).toBeUndefined();
      expect((badge as any).textColor).toBeUndefined();

      cleanupBadgeCountNotification(badge);
    });
  });

  // ============================================================================
  // Live Region Attributes Tests
  // ============================================================================

  describe('Live Region Attributes', () => {
    /**
     * **Validates: Requirement 3.8**
     */
    let badge: BadgeCountNotification;

    afterEach(() => {
      if (badge) {
        cleanupBadgeCountNotification(badge);
      }
    });

    it('should have aria-live="polite" when announceChanges is true', async () => {
      badge = await createBadgeCountNotification({ count: 5, announceChanges: true });

      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.getAttribute('aria-live')).toBe('polite');
    });

    it('should have aria-atomic="true" when announceChanges is true', async () => {
      badge = await createBadgeCountNotification({ count: 5, announceChanges: true });

      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.getAttribute('aria-atomic')).toBe('true');
    });

    it('should have visually hidden announcement element when announceChanges is true', async () => {
      badge = await createBadgeCountNotification({ count: 5, announceChanges: true });

      const announcementElement = getAnnouncementElement(badge);
      expect(announcementElement).toBeTruthy();
      expect(announcementElement?.getAttribute('role')).toBe('status');
    });

    it('should not have aria-live when announceChanges is false', async () => {
      badge = await createBadgeCountNotification({ count: 5, announceChanges: false });

      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.hasAttribute('aria-live')).toBe(false);
    });

    it('should not have aria-atomic when announceChanges is false', async () => {
      badge = await createBadgeCountNotification({ count: 5, announceChanges: false });

      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.hasAttribute('aria-atomic')).toBe(false);
    });

    it('should not have announcement element when announceChanges is false', async () => {
      badge = await createBadgeCountNotification({ count: 5, announceChanges: false });

      const announcementElement = getAnnouncementElement(badge);
      expect(announcementElement).toBeNull();
    });
  });

  // ============================================================================
  // Announcement Text Pluralization Tests
  // ============================================================================

  describe('Announcement Text Pluralization', () => {
    /**
     * **Validates: Requirements 3.4, 3.5**
     */
    let badge: BadgeCountNotification;

    afterEach(() => {
      if (badge) {
        cleanupBadgeCountNotification(badge);
      }
    });

    it('should use singular form for count=1', async () => {
      badge = await createBadgeCountNotification({ count: 1, announceChanges: true });

      const announcementElement = getAnnouncementElement(badge);
      expect(announcementElement?.textContent).toBe('1 notification');
    });

    it('should use plural form for count=0', async () => {
      badge = await createBadgeCountNotification({ count: 0, showZero: true, announceChanges: true });

      const announcementElement = getAnnouncementElement(badge);
      expect(announcementElement?.textContent).toBe('0 notifications');
    });

    it('should use plural form for count=5', async () => {
      badge = await createBadgeCountNotification({ count: 5, announceChanges: true });

      const announcementElement = getAnnouncementElement(badge);
      expect(announcementElement?.textContent).toBe('5 notifications');
    });

    it('should use plural form for count=42', async () => {
      badge = await createBadgeCountNotification({ count: 42, announceChanges: true });

      const announcementElement = getAnnouncementElement(badge);
      expect(announcementElement?.textContent).toBe('42 notifications');
    });

    it('should use overflow format when count exceeds max', async () => {
      badge = await createBadgeCountNotification({ count: 100, max: 99, announceChanges: true });

      const announcementElement = getAnnouncementElement(badge);
      expect(announcementElement?.textContent).toBe('99 or more notifications');
    });

    it('should use custom max in overflow format', async () => {
      badge = await createBadgeCountNotification({ count: 50, max: 49, announceChanges: true });

      const announcementElement = getAnnouncementElement(badge);
      expect(announcementElement?.textContent).toBe('49 or more notifications');
    });
  });

  // ============================================================================
  // announceChanges Opt-Out Behavior Tests
  // ============================================================================

  describe('announceChanges Opt-Out Behavior', () => {
    /**
     * **Validates: Requirements 3.6, 3.7**
     */
    let badge: BadgeCountNotification;

    afterEach(() => {
      if (badge) {
        cleanupBadgeCountNotification(badge);
      }
    });

    it('should default announceChanges to true', async () => {
      badge = await createBadgeCountNotification({ count: 5 });

      expect(badge.announceChanges).toBe(true);
      expect(badge.announceChanges).toBe(BADGE_COUNT_NOTIFICATION_DEFAULTS.announceChanges);
    });

    it('should respect announceChanges=false', async () => {
      badge = await createBadgeCountNotification({ count: 5, announceChanges: false });

      expect(badge.announceChanges).toBe(false);
    });

    it('should update announceChanges when property changes', async () => {
      badge = await createBadgeCountNotification({ count: 5, announceChanges: true });
      expect(badge.announceChanges).toBe(true);

      badge.announceChanges = false;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(badge.announceChanges).toBe(false);
      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.hasAttribute('aria-live')).toBe(false);
    });

    it('should add live region attributes when announceChanges changes to true', async () => {
      badge = await createBadgeCountNotification({ count: 5, announceChanges: false });
      expect(getShadowBadge(badge)?.hasAttribute('aria-live')).toBe(false);

      badge.announceChanges = true;
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(badge.announceChanges).toBe(true);
      expect(getShadowBadge(badge)?.getAttribute('aria-live')).toBe('polite');
    });
  });

  // ============================================================================
  // Inherited Badge-Count-Base Behavior Tests
  // ============================================================================

  describe('Inherited Badge-Count-Base Behavior', () => {
    /**
     * **Validates: Requirement 3.2**
     */
    let badge: BadgeCountNotification;

    afterEach(() => {
      if (badge) {
        cleanupBadgeCountNotification(badge);
      }
    });

    it('should render count value', async () => {
      badge = await createBadgeCountNotification({ count: 5 });

      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('5');
    });

    it('should truncate count at max with "+"', async () => {
      badge = await createBadgeCountNotification({ count: 100, max: 99 });

      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('99+');
    });

    it('should default max to 99', async () => {
      badge = await createBadgeCountNotification({ count: 50 });

      expect(badge.max).toBe(99);
    });

    it('should not render when count=0 and showZero=false', async () => {
      badge = await createBadgeCountNotification({ count: 0, showZero: false });

      expect(isRendered(badge)).toBe(false);
    });

    it('should render when count=0 and showZero=true', async () => {
      badge = await createBadgeCountNotification({ count: 0, showZero: true });

      expect(isRendered(badge)).toBe(true);
      const textElement = getTextElement(badge);
      expect(textElement?.textContent).toBe('0');
    });

    it('should default showZero to false', async () => {
      badge = await createBadgeCountNotification({ count: 5 });

      expect(badge.showZero).toBe(false);
    });

    it('should default size to md', async () => {
      badge = await createBadgeCountNotification({ count: 5 });

      expect(badge.size).toBe('md');
      expect(hasClass(badge, 'badge-count-notification--md')).toBe(true);
    });

    it('should apply sm size class', async () => {
      badge = await createBadgeCountNotification({ count: 5, size: 'sm' });

      expect(badge.size).toBe('sm');
      expect(hasClass(badge, 'badge-count-notification--sm')).toBe(true);
    });

    it('should apply lg size class', async () => {
      badge = await createBadgeCountNotification({ count: 5, size: 'lg' });

      expect(badge.size).toBe('lg');
      expect(hasClass(badge, 'badge-count-notification--lg')).toBe(true);
    });
  });

  // ============================================================================
  // Non-Interactivity Tests
  // ============================================================================

  describe('Non-Interactivity', () => {
    /**
     * **Validates: Inherited from Badge-Count-Base**
     */
    let badge: BadgeCountNotification;
    let cssContent: string;

    beforeAll(() => {
      cssContent = readCSSFileContent();
    });

    afterEach(() => {
      if (badge) {
        cleanupBadgeCountNotification(badge);
      }
    });

    it('should not have tabindex attribute', async () => {
      badge = await createBadgeCountNotification({ count: 5 });

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
    let badge: BadgeCountNotification;

    afterEach(() => {
      if (badge) {
        cleanupBadgeCountNotification(badge);
      }
    });

    it('should apply data-testid attribute when testID is provided', async () => {
      badge = await createBadgeCountNotification({
        count: 5,
        testID: 'notification-badge',
      });

      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.getAttribute('data-testid')).toBe('notification-badge');
    });

    it('should not have data-testid when testID is not provided', async () => {
      badge = await createBadgeCountNotification({ count: 5 });

      const shadowBadge = getShadowBadge(badge);
      expect(shadowBadge?.hasAttribute('data-testid')).toBe(false);
    });
  });

  // ============================================================================
  // Accessibility Tests
  // ============================================================================

  describe('Accessibility', () => {
    /**
     * **Validates: Requirements 3.8, 3.9, 3.10**
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

    it('should have visually hidden class for announcement text', () => {
      expect(cssContent).toContain('.badge-count-notification__announcement');
      expect(cssContent).toContain('position: absolute');
      expect(cssContent).toContain('clip: rect(0, 0, 0, 0)');
    });
  });

  // ============================================================================
  // Shape Behavior Tests (CSS Validation)
  // ============================================================================

  describe('Shape Behavior', () => {
    /**
     * **Validates: Inherited circular/pill shape from Badge-Count-Base**
     */
    let cssContent: string;

    beforeAll(() => {
      cssContent = readCSSFileContent();
    });

    it('should use radiusFull (9999px) for circular/pill shape', () => {
      expect(cssContent).toContain('border-radius: var(--radius-full');
    });

    it('should define min-width equal to computed line-height for each size variant', () => {
      // Each size uses calc(font-size × line-height) for min-width
      expect(cssContent).toContain('min-width: calc(var(--typography-label-xs-font-size) * var(--typography-label-xs-line-height))');
      expect(cssContent).toContain('min-width: calc(var(--typography-label-sm-font-size) * var(--typography-label-sm-line-height))');
      expect(cssContent).toContain('min-width: calc(var(--typography-label-md-font-size) * var(--typography-label-md-line-height))');
    });

    it('should center content for circular shape', () => {
      expect(cssContent).toContain('justify-content: center');
      expect(cssContent).toContain('align-items: center');
    });
  });
});
