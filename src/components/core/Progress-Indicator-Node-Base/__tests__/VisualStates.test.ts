/**
 * @jest-environment jsdom
 */

/**
 * @category evergreen
 * @purpose Verify Progress-Indicator-Node-Base visual state rendering
 */

/**
 * Visual State Tests for Progress-Indicator-Node-Base
 * 
 * Stemma System: Progress Indicator Family
 * Component Type: Primitive (Base)
 * 
 * Tests verify:
 * - Node renders at base size for incomplete/completed/error states (Req 12.1-12.3)
 * - Node renders at current size for current state (Req 12.4)
 * - Size transitions respect prefers-reduced-motion (Req 12.5, 15.23)
 * - Content rendering: dot (sm), empty circle (md/lg + none), checkmark (md/lg + checkmark), icon (md/lg + icon) (Req 12.6-12.9)
 * - Color application for all states (Req 12.13-12.16)
 * 
 * Requirements: 12.1-12.9, 15.21-15.23
 * @see .kiro/specs/048-progress-family/requirements.md
 */

import * as fs from 'fs';
import * as path from 'path';
import { describe, it, expect, beforeAll, beforeEach } from '@jest/globals';
import { ProgressIndicatorNodeBase } from '../platforms/web/ProgressIndicatorNodeBase.web';
import { NODE_SIZE_VALUES } from '../types';

// ============================================================================
// Helpers
// ============================================================================

/** Read the actual CSS file for CSS-level assertions */
function readCSSContent(): string {
  const cssPath = path.resolve(
    process.cwd(),
    'src/components/core/Progress-Indicator-Node-Base/platforms/web/ProgressIndicatorNodeBase.styles.css'
  );
  return fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf-8') : '';
}

let cssContent: string;

/** Create a node component with given attributes */
function createNode(attrs: Record<string, string> = {}): ProgressIndicatorNodeBase {
  const el = document.createElement('progress-indicator-node-base') as ProgressIndicatorNodeBase;
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  document.body.appendChild(el);
  return el;
}

// ============================================================================
// Test Suite
// ============================================================================

describe('Progress-Indicator-Node-Base — Visual States', () => {
  beforeAll(() => {
    if (!customElements.get('progress-indicator-node-base')) {
      customElements.define('progress-indicator-node-base', ProgressIndicatorNodeBase);
    }
    cssContent = readCSSContent();
  });

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  // ==========================================================================
  // Size Rendering (Req 12.1-12.4, 15.21)
  // ==========================================================================

  describe('Node Size Rendering', () => {
    it('renders at base size for incomplete state via CSS class', () => {
      const el = createNode({ state: 'incomplete', size: 'md' });
      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;

      expect(node.classList.contains('node--incomplete')).toBe(true);
      expect(node.classList.contains('node--md')).toBe(true);
      expect(node.classList.contains('node--current')).toBe(false);
    });

    it('renders at base size for completed state via CSS class', () => {
      const el = createNode({ state: 'completed', size: 'lg' });
      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;

      expect(node.classList.contains('node--completed')).toBe(true);
      expect(node.classList.contains('node--lg')).toBe(true);
      expect(node.classList.contains('node--current')).toBe(false);
    });

    it('renders at base size for error state via CSS class', () => {
      const el = createNode({ state: 'error', size: 'sm' });
      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;

      expect(node.classList.contains('node--error')).toBe(true);
      expect(node.classList.contains('node--sm')).toBe(true);
      expect(node.classList.contains('node--current')).toBe(false);
    });

    it('renders at current (emphasized) size for current state via CSS class', () => {
      const el = createNode({ state: 'current', size: 'md' });
      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;

      expect(node.classList.contains('node--current')).toBe(true);
      expect(node.classList.contains('node--md')).toBe(true);
    });

    it('CSS defines base size tokens for all size variants', () => {
      // Verify CSS references base size tokens
      expect(cssContent).toMatch(/\.node--sm\s*\{[^}]*--progress-node-size-sm/);
      expect(cssContent).toMatch(/\.node--md\s*\{[^}]*--progress-node-size-md/);
      expect(cssContent).toMatch(/\.node--lg\s*\{[^}]*--progress-node-size-lg/);
    });

    it('CSS defines current size overrides for all size variants', () => {
      // Verify CSS has compound selectors for current + size
      expect(cssContent).toMatch(/\.node--sm\.node--current[^{]*\{[^}]*--progress-node-size-sm-current/);
      expect(cssContent).toMatch(/\.node--md\.node--current[^{]*\{[^}]*--progress-node-size-md-current/);
      expect(cssContent).toMatch(/\.node--lg\.node--current[^{]*\{[^}]*--progress-node-size-lg-current/);
    });

    it('current size values are +4px over base size', () => {
      // Validate the mathematical relationship from types
      for (const size of ['sm', 'md', 'lg'] as const) {
        const { base, current } = NODE_SIZE_VALUES[size];
        expect(current - base).toBe(4);
      }
    });
  });

  // ==========================================================================
  // Prefers-Reduced-Motion (Req 12.5, 15.23)
  // ==========================================================================

  describe('Prefers-Reduced-Motion', () => {
    it('CSS includes transition on .node for size changes', () => {
      expect(cssContent).toMatch(/\.node\s*\{[^}]*transition:/);
    });

    it('CSS disables transition when prefers-reduced-motion: reduce', () => {
      expect(cssContent).toMatch(/prefers-reduced-motion:\s*reduce/);
      // Inside the media query, transition should be set to none
      const reducedMotionBlock = cssContent.match(
        /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\}/
      );
      expect(reducedMotionBlock).not.toBeNull();
      expect(reducedMotionBlock![1]).toMatch(/transition:\s*none/);
    });
  });

  // ==========================================================================
  // Content Rendering (Req 12.6-12.9, 15.22)
  // ==========================================================================

  describe('Content Rendering', () => {
    it('sm size renders as dot regardless of content prop', () => {
      // Even with content="checkmark", sm should render a dot
      const el = createNode({ state: 'incomplete', size: 'sm', content: 'checkmark' });
      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;

      expect(node.querySelector('.node__dot')).not.toBeNull();
      expect(node.querySelector('.node__content')).toBeNull();
    });

    it('md size with content=none renders empty circle (no inner content)', () => {
      const el = createNode({ state: 'incomplete', size: 'md', content: 'none' });
      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;

      expect(node.querySelector('.node__dot')).toBeNull();
      expect(node.querySelector('.node__content')).toBeNull();
    });

    it('md size with content=checkmark renders checkmark SVG', () => {
      const el = createNode({ state: 'completed', size: 'md', content: 'checkmark' });
      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;

      const content = node.querySelector('.node__content');
      expect(content).not.toBeNull();
      expect(content!.querySelector('svg')).not.toBeNull();
    });

    it('lg size with content=icon renders icon-base element', () => {
      const el = createNode({ state: 'current', size: 'lg', content: 'icon', icon: 'star' });
      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;

      const content = node.querySelector('.node__content');
      expect(content).not.toBeNull();
      expect(content!.querySelector('icon-base')).not.toBeNull();
      expect(content!.querySelector('icon-base')!.getAttribute('name')).toBe('star');
    });

    it('lg size with content=none renders empty circle', () => {
      const el = createNode({ state: 'incomplete', size: 'lg', content: 'none' });
      const node = el.shadowRoot!.querySelector('.node') as HTMLElement;

      expect(node.querySelector('.node__dot')).toBeNull();
      expect(node.querySelector('.node__content')).toBeNull();
    });
  });

  // ==========================================================================
  // Color Application (Req 12.13-12.16)
  // ==========================================================================

  describe('Color Application', () => {
    it('CSS applies pending color tokens for incomplete state', () => {
      expect(cssContent).toMatch(
        /\.node--incomplete\s*\{[^}]*--color-progress-pending-background/
      );
      expect(cssContent).toMatch(
        /\.node--incomplete\s*\{[^}]*--color-progress-pending-text/
      );
    });

    it('CSS applies current color tokens for current state', () => {
      expect(cssContent).toMatch(
        /\.node--current\s*\{[^}]*--color-progress-current-background/
      );
      expect(cssContent).toMatch(
        /\.node--current\s*\{[^}]*--color-progress-current-text/
      );
    });

    it('CSS applies completed color tokens for completed state', () => {
      expect(cssContent).toMatch(
        /\.node--completed\s*\{[^}]*--color-progress-completed-background/
      );
      expect(cssContent).toMatch(
        /\.node--completed\s*\{[^}]*--color-progress-completed-text/
      );
    });

    it('CSS applies error color tokens for error state', () => {
      expect(cssContent).toMatch(
        /\.node--error\s*\{[^}]*--color-progress-error-background/
      );
      expect(cssContent).toMatch(
        /\.node--error\s*\{[^}]*--color-progress-error-text/
      );
    });

    it('component applies correct state class for each state', () => {
      const states = ['incomplete', 'current', 'completed', 'error'] as const;
      for (const state of states) {
        const el = createNode({ state, size: 'md' });
        const node = el.shadowRoot!.querySelector('.node') as HTMLElement;
        expect(node.classList.contains(`node--${state}`)).toBe(true);
        document.body.innerHTML = '';
      }
    });
  });
});
