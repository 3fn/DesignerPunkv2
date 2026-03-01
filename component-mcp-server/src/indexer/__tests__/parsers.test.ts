/**
 * YAML Parser Unit Tests
 *
 * Tests each parser against real component files and edge cases.
 */

import * as path from 'path';
import { parseSchemaYaml, parseContractsYaml, parseComponentMetaYaml } from '../parsers';

const COMPONENTS_DIR = path.resolve(__dirname, '../../../../src/components/core');

describe('parseSchemaYaml', () => {
  it('parses a real schema.yaml (Badge-Count-Base)', () => {
    const result = parseSchemaYaml(path.join(COMPONENTS_DIR, 'Badge-Count-Base', 'Badge-Count-Base.schema.yaml'));
    expect(result.warning).toBeNull();
    expect(result.data).not.toBeNull();
    const d = result.data!;
    expect(d.name).toBe('Badge-Count-Base');
    expect(d.type).toBe('type-primitive');
    expect(d.family).toBe('Badge');
    expect(d.platforms).toContain('web');
    expect(d.properties).toHaveProperty('count');
    expect(d.properties.count.required).toBe(true);
  });

  it('extracts nested token objects as flat list (Container-Card-Base)', () => {
    const result = parseSchemaYaml(path.join(COMPONENTS_DIR, 'Container-Card-Base', 'Container-Card-Base.schema.yaml'));
    expect(result.data).not.toBeNull();
    expect(result.data!.tokens.length).toBeGreaterThan(0);
    expect(result.data!.tokens).toContain('space.inset.150');
  });

  it('extracts composition from internal field', () => {
    const result = parseSchemaYaml(path.join(COMPONENTS_DIR, 'Container-Card-Base', 'Container-Card-Base.schema.yaml'));
    expect(result.data!.composition).not.toBeNull();
    expect(result.data!.composition!.internal).toEqual(
      expect.arrayContaining([expect.objectContaining({ component: 'Container-Base' })])
    );
  });

  it('returns null with warning for missing file', () => {
    const result = parseSchemaYaml('/nonexistent/path.yaml');
    expect(result.data).toBeNull();
    expect(result.warning).toContain('File not found');
  });

  it('returns null with warning for malformed YAML', () => {
    const result = parseSchemaYaml(path.join(COMPONENTS_DIR, 'Badge-Count-Base', 'index.ts'));
    expect(result.data).toBeNull();
    expect(result.warning).toContain('YAML parse error');
  });
});

describe('parseContractsYaml', () => {
  it('parses a real contracts.yaml (Badge-Count-Base)', () => {
    const result = parseContractsYaml(path.join(COMPONENTS_DIR, 'Badge-Count-Base', 'contracts.yaml'));
    expect(result.warning).toBeNull();
    expect(result.data).not.toBeNull();
    const d = result.data!;
    expect(d.component).toBe('Badge-Count-Base');
    expect(d.family).toBe('Badge');
    expect(d.inherits).toBeNull();
    expect(Object.keys(d.contracts).length).toBeGreaterThan(0);
    expect(d.contracts.content_displays_count).toBeDefined();
    expect(d.contracts.content_displays_count.category).toBe('content');
  });

  it('parses inherits field (Badge-Count-Notification)', () => {
    const result = parseContractsYaml(path.join(COMPONENTS_DIR, 'Badge-Count-Notification', 'contracts.yaml'));
    expect(result.data).not.toBeNull();
    expect(result.data!.inherits).toBe('Badge-Count-Base');
  });

  it('parses excludes (Avatar-Base)', () => {
    const result = parseContractsYaml(path.join(COMPONENTS_DIR, 'Avatar-Base', 'contracts.yaml'));
    expect(result.data).not.toBeNull();
    expect(Object.keys(result.data!.excludes).length).toBeGreaterThan(0);
    expect(result.data!.excludes.interaction_focusable).toBeDefined();
  });

  it('returns null with warning for missing file', () => {
    const result = parseContractsYaml('/nonexistent/path.yaml');
    expect(result.data).toBeNull();
    expect(result.warning).toContain('File not found');
  });
});

describe('parseComponentMetaYaml', () => {
  it('parses component-meta.yaml successfully', () => {
    const result = parseComponentMetaYaml(path.join(COMPONENTS_DIR, 'Badge-Count-Base', 'component-meta.yaml'));
    expect(result.data).not.toBeNull();
    expect(result.data!.purpose).toContain('numeric count');
    expect(result.data!.alternatives.length).toBeGreaterThan(0);
    expect(result.warning).toBeNull();
  });

  it('returns null with warning for nonexistent path', () => {
    const result = parseComponentMetaYaml('/nonexistent/path.yaml');
    expect(result.data).toBeNull();
    expect(result.warning).toContain('File not found');
  });
});
