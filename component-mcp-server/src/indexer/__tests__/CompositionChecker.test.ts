/**
 * CompositionChecker Unit Tests
 */

import { checkComposition, validateRequires } from '../CompositionChecker';
import { ComponentMetadata, CompositionDefinition } from '../../models';

function makeMeta(name: string, composition: CompositionDefinition | null, type = 'type-primitive'): ComponentMetadata {
  return {
    name, type, family: 'Test', version: '1.0.0', readiness: 'production-ready',
    description: '', platforms: ['web'], properties: {}, tokens: [],
    composition, omits: [],
    contracts: { inheritsFrom: null, active: {}, excluded: {}, own: [], inherited: [] },
    annotations: null, contractTokenRelationships: { resolved: [], gaps: [] },
    resolvedTokens: { own: [], composed: {} },
    indexedAt: '', warnings: [],
  };
}

function makeIndex(...metas: ComponentMetadata[]): Map<string, ComponentMetadata> {
  const map = new Map<string, ComponentMetadata>();
  for (const m of metas) map.set(m.name, m);
  return map;
}

describe('checkComposition', () => {
  it('allows by default when no composition constraints', () => {
    const parent = makeMeta('Parent', null);
    const index = makeIndex(parent);
    const result = checkComposition(parent, 'AnyChild', index);
    expect(result.allowed).toBe(true);
    expect(result.rule).toBe('static');
  });

  it('prohibits explicitly listed child', () => {
    const parent = makeMeta('Parent', {
      internal: [],
      children: { prohibited: ['BadChild'] },
    });
    const index = makeIndex(parent);
    const result = checkComposition(parent, 'BadChild', index);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('explicitly prohibited');
  });

  it('allows explicitly listed child', () => {
    const parent = makeMeta('Parent', {
      internal: [],
      children: { allowed: ['GoodChild'] },
    });
    const index = makeIndex(parent);
    const result = checkComposition(parent, 'GoodChild', index);
    expect(result.allowed).toBe(true);
  });

  it('rejects child not in allowed list', () => {
    const parent = makeMeta('Parent', {
      internal: [],
      children: { allowed: ['GoodChild'] },
    });
    const index = makeIndex(parent);
    const result = checkComposition(parent, 'OtherChild', index);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('not in the allowed list');
  });

  it('prohibits self-nesting when nesting.self is false', () => {
    const parent = makeMeta('Parent', {
      internal: [],
      nesting: { self: false },
    });
    const index = makeIndex(parent);
    const result = checkComposition(parent, 'Parent', index);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('self-nesting');
  });

  it('conditional rule overrides static constraints', () => {
    const parent = makeMeta('Card', {
      internal: [],
      children: { allowed: ['Text', 'Image', 'Button'] },
      rules: [{
        when: { prop: 'role', equals: 'button' },
        then: { children: { prohibited: ['Button'] } },
      }],
    });
    const index = makeIndex(parent);

    // Without role=button, Button is allowed
    const allowed = checkComposition(parent, 'Button', index);
    expect(allowed.allowed).toBe(true);

    // With role=button, Button is prohibited by conditional rule
    const prohibited = checkComposition(parent, 'Button', index, { role: 'button' });
    expect(prohibited.allowed).toBe(false);
    expect(prohibited.rule).toBe('conditional');
    expect(prohibited.ruleDetail).toBeDefined();
  });

  it('allows unknown component by default with no constraints', () => {
    const parent = makeMeta('Parent', { internal: [] });
    const index = makeIndex(parent);
    const result = checkComposition(parent, 'UnknownComponent', index);
    expect(result.allowed).toBe(true);
  });
});

describe('validateRequires', () => {
  it('returns complete when all required types present', () => {
    const parent = makeMeta('Set', {
      internal: [],
      children: { requires: ['Item-Base'], allowed: ['Item-Base'] },
    });
    const result = validateRequires(parent, ['Item-Base']);
    expect(result.complete).toBe(true);
    expect(result.missing).toHaveLength(0);
  });

  it('returns missing when required type absent', () => {
    const parent = makeMeta('Set', {
      internal: [],
      children: { requires: ['Item-Base'], allowed: ['Item-Base'] },
    });
    const result = validateRequires(parent, ['Other-Component']);
    expect(result.complete).toBe(false);
    expect(result.missing).toEqual(['Item-Base']);
  });

  it('returns complete when no requires defined', () => {
    const parent = makeMeta('Parent', {
      internal: [],
      children: { allowed: ['Anything'] },
    });
    const result = validateRequires(parent, []);
    expect(result.complete).toBe(true);
  });

  it('returns complete when no composition at all', () => {
    const parent = makeMeta('Parent', null);
    const result = validateRequires(parent, []);
    expect(result.complete).toBe(true);
  });
});
