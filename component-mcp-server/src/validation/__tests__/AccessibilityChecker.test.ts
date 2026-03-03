/**
 * AccessibilityChecker Tests
 */

import { AccessibilityChecker } from '../AccessibilityChecker';

describe('AccessibilityChecker', () => {
  const checker = new AccessibilityChecker();

  describe('form-needs-accessible-name (WCAG 1.3.1)', () => {
    it('errors when form container lacks accessibilityLabel', () => {
      const issues = checker.check({
        component: 'Container-Base',
        props: { semantic: 'form' },
      });
      expect(issues.some(i => i.rule === 'form-needs-accessible-name')).toBe(true);
    });

    it('errors for fieldset without accessibilityLabel', () => {
      const issues = checker.check({
        component: 'Container-Base',
        props: { semantic: 'fieldset' },
      });
      expect(issues.some(i => i.rule === 'form-needs-accessible-name')).toBe(true);
    });

    it('passes when form has accessibilityLabel', () => {
      const issues = checker.check({
        component: 'Container-Base',
        props: { semantic: 'form', accessibilityLabel: 'Login' },
        children: [{ component: 'Button-CTA' }],
      });
      expect(issues.some(i => i.rule === 'form-needs-accessible-name')).toBe(false);
    });
  });

  describe('form-needs-submit-action (WCAG 1.3.1)', () => {
    it('warns when form lacks Button-CTA', () => {
      const issues = checker.check({
        component: 'Container-Base',
        props: { semantic: 'form', accessibilityLabel: 'Login' },
        children: [{ component: 'Input-Text-Email' }],
      });
      const issue = issues.find(i => i.rule === 'form-needs-submit-action');
      expect(issue).toBeDefined();
      expect(issue!.severity).toBe('warning');
    });

    it('passes when form contains Button-CTA', () => {
      const issues = checker.check({
        component: 'Container-Base',
        props: { semantic: 'form', accessibilityLabel: 'Login' },
        children: [{ component: 'Input-Text-Email' }, { component: 'Button-CTA' }],
      });
      expect(issues.some(i => i.rule === 'form-needs-submit-action')).toBe(false);
    });

    it('finds Button-CTA in nested children', () => {
      const issues = checker.check({
        component: 'Container-Base',
        props: { semantic: 'form', accessibilityLabel: 'Login' },
        children: [{
          component: 'Container-Base',
          children: [{ component: 'Button-CTA' }],
        }],
      });
      expect(issues.some(i => i.rule === 'form-needs-submit-action')).toBe(false);
    });
  });

  describe('page-needs-accessible-name (WCAG 2.4.2)', () => {
    it('errors when main container lacks accessibilityLabel', () => {
      const issues = checker.check({
        component: 'Container-Base',
        props: { semantic: 'main' },
      });
      expect(issues.some(i => i.rule === 'page-needs-accessible-name')).toBe(true);
    });

    it('passes when main has accessibilityLabel', () => {
      const issues = checker.check({
        component: 'Container-Base',
        props: { semantic: 'main', accessibilityLabel: 'Settings' },
      });
      expect(issues.some(i => i.rule === 'page-needs-accessible-name')).toBe(false);
    });
  });

  it('returns no issues for non-semantic components', () => {
    const issues = checker.check({ component: 'Button-CTA' });
    expect(issues).toHaveLength(0);
  });

  it('checks nested containers', () => {
    const issues = checker.check({
      component: 'Container-Base',
      props: { semantic: 'main', accessibilityLabel: 'Page' },
      children: [{
        component: 'Container-Base',
        props: { semantic: 'form' },
      }],
    });
    expect(issues.some(i => i.rule === 'form-needs-accessible-name')).toBe(true);
  });
});
