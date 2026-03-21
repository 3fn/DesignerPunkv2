/**
 * AssemblyValidator Tests
 *
 * Integration tests against real component catalog.
 */

import * as path from 'path';
import { ComponentIndexer } from '../../indexer/ComponentIndexer';
import { AssemblyValidator } from '../AssemblyValidator';

const COMPONENTS_DIR = path.resolve(__dirname, '../../../../src/components/core');

describe('AssemblyValidator', () => {
  let validator: AssemblyValidator;

  beforeAll(async () => {
    const indexer = new ComponentIndexer();
    await indexer.indexComponents(COMPONENTS_DIR);
    validator = new AssemblyValidator(indexer);
  });

  it('validates a single valid component', () => {
    const result = validator.validate({ component: 'Button-CTA' });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects unknown component', () => {
    const result = validator.validate({ component: 'Nonexistent-Widget' });
    expect(result.valid).toBe(false);
    expect(result.errors[0].path).toBe('root');
    expect(result.errors[0].message).toContain('not found');
  });

  it('validates valid parent-child composition (Radio-Set with Radio-Base)', () => {
    const result = validator.validate({
      component: 'Input-Radio-Set',
      children: [
        { component: 'Input-Radio-Base' },
        { component: 'Input-Radio-Base' },
      ],
    });
    expect(result.valid).toBe(true);
  });

  it('validates VerticalList-Set with VerticalList-Item children', () => {
    const result = validator.validate({
      component: 'Button-VerticalList-Set',
      children: [
        { component: 'Button-VerticalList-Item' },
        { component: 'Button-VerticalList-Item' },
      ],
    });
    expect(result.valid).toBe(true);
  });

  it('rejects disallowed child in VerticalList-Set', () => {
    const result = validator.validate({
      component: 'Button-VerticalList-Set',
      children: [
        { component: 'Button-VerticalList-Item' },
        { component: 'Button-CTA' },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path === 'root.children[1]')).toBe(true);
  });

  it('checks requires constraint (VerticalList-Set needs VerticalList-Item)', () => {
    const result = validator.validate({
      component: 'Button-VerticalList-Set',
      children: [],
    });
    expect(result.errors.some(e => e.message.includes('Missing required'))).toBe(true);
  });

  it('checks minCount constraint', () => {
    const result = validator.validate({
      component: 'Button-VerticalList-Set',
      children: [
        { component: 'Button-VerticalList-Item' },
      ],
    });
    expect(result.errors.some(e => e.message.includes('at least'))).toBe(true);
  });

  it('validates nested tree (Container → VerticalList-Set → Items)', () => {
    const result = validator.validate({
      component: 'Container-Base',
      children: [
        {
          component: 'Button-VerticalList-Set',
          children: [
            { component: 'Button-VerticalList-Item' },
            { component: 'Button-VerticalList-Item' },
          ],
        },
      ],
    });
    expect(result.valid).toBe(true);
  });

  it('reports errors at correct paths in nested tree', () => {
    const result = validator.validate({
      component: 'Container-Base',
      children: [
        {
          component: 'Button-VerticalList-Set',
          children: [
            { component: 'Button-VerticalList-Item' },
            { component: 'Nonexistent-Widget' },
          ],
        },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.path === 'root.children[0].children[1]')).toBe(true);
  });

  it('returns empty accessibility array (populated by AccessibilityChecker later)', () => {
    const result = validator.validate({ component: 'Button-CTA' });
    expect(result.accessibility).toEqual([]);
  });

  it('includes accessibility errors from AccessibilityChecker', () => {
    const result = validator.validate({
      component: 'Container-Base',
      props: { semantic: 'form' },
      children: [{ component: 'Input-Text-Email' }],
    });
    expect(result.valid).toBe(false);
    expect(result.accessibility.some(a => a.rule === 'form-needs-accessible-name')).toBe(true);
  });

  it('validates leaf component with no children', () => {
    const result = validator.validate({ component: 'Input-Text-Email' });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
