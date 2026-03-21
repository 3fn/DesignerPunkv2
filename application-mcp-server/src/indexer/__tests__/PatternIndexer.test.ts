/**
 * PatternIndexer Tests
 *
 * Tests parsing, validation, catalog, and error handling for experience patterns.
 */

import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { PatternIndexer } from '../PatternIndexer';

describe('PatternIndexer', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pattern-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  const writePattern = (name: string, content: string) => {
    fs.writeFileSync(path.join(tmpDir, `${name}.yaml`), content);
  };

  const validPattern = `
name: test-form
source: system
description: A test form pattern
category: forms
tags: [test]
steps:
  - name: step-one
    purpose: Collect data
    layout: vertical-stack
    components:
      - component: Input-Text-Email
        role: form-field
      - component: Button-CTA
        role: submit-action
accessibility:
  - "Fields must have labels"
alternatives:
  - pattern: other-pattern
    reason: "When you need something else"
`;

  describe('indexPatterns', () => {
    it('parses valid pattern files', async () => {
      writePattern('test-form', validPattern);
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);
      expect(indexer.getHealth().patternsIndexed).toBe(1);
    });

    it('handles missing directory gracefully', async () => {
      const indexer = new PatternIndexer();
      await indexer.indexPatterns('/nonexistent/path');
      expect(indexer.getHealth().patternsIndexed).toBe(0);
      expect(indexer.getHealth().warnings).toHaveLength(0);
    });

    it('skips non-yaml files', async () => {
      writePattern('test-form', validPattern);
      fs.writeFileSync(path.join(tmpDir, 'README.md'), '# Readme');
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);
      expect(indexer.getHealth().patternsIndexed).toBe(1);
    });

    it('skips invalid YAML with warning', async () => {
      fs.writeFileSync(path.join(tmpDir, 'bad.yaml'), '{{invalid yaml');
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);
      expect(indexer.getHealth().patternsIndexed).toBe(0);
      expect(indexer.getHealth().warnings).toContainEqual(expect.stringContaining('YAML parse error'));
    });

    it('skips files missing required fields with warning', async () => {
      writePattern('incomplete', `
name: incomplete
description: Missing source and steps
category: forms
`);
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);
      expect(indexer.getHealth().patternsIndexed).toBe(0);
      expect(indexer.getHealth().warnings.some(w => w.includes("missing required field"))).toBe(true);
    });

    it('skips files with invalid source value', async () => {
      writePattern('bad-source', `
name: bad-source
source: unknown
description: Bad source
category: forms
steps:
  - name: s
    purpose: p
    components:
      - component: X
        role: r
`);
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);
      expect(indexer.getHealth().patternsIndexed).toBe(0);
      expect(indexer.getHealth().warnings.some(w => w.includes("'source' must be"))).toBe(true);
    });

    it('skips files with empty steps', async () => {
      writePattern('empty-steps', `
name: empty-steps
source: system
description: No steps
category: forms
steps: []
`);
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);
      expect(indexer.getHealth().patternsIndexed).toBe(0);
    });

    it('validates component required fields', async () => {
      writePattern('bad-comp', `
name: bad-comp
source: system
description: Bad component
category: forms
steps:
  - name: s
    purpose: p
    components:
      - role: form-field
`);
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);
      expect(indexer.getHealth().patternsIndexed).toBe(0);
      expect(indexer.getHealth().warnings.some(w => w.includes("missing 'component' name"))).toBe(true);
    });
  });

  describe('getPattern', () => {
    it('returns pattern by name', async () => {
      writePattern('test-form', validPattern);
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);

      const pattern = indexer.getPattern('test-form');
      expect(pattern).not.toBeNull();
      expect(pattern!.name).toBe('test-form');
      expect(pattern!.source).toBe('system');
      expect(pattern!.description).toBe('A test form pattern');
      expect(pattern!.category).toBe('forms');
      expect(pattern!.tags).toEqual(['test']);
      expect(pattern!.steps).toHaveLength(1);
      expect(pattern!.steps[0].components).toHaveLength(2);
      expect(pattern!.accessibility).toHaveLength(1);
      expect(pattern!.alternatives).toHaveLength(1);
    });

    it('returns null for unknown pattern', async () => {
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);
      expect(indexer.getPattern('nonexistent')).toBeNull();
    });
  });

  describe('children nesting', () => {
    it('parses nested children recursively', async () => {
      writePattern('nested', `
name: nested
source: system
description: Nested pattern
category: forms
steps:
  - name: s
    purpose: p
    components:
      - component: Container-Base
        role: form-container
        hints:
          semantic: fieldset
        children:
          - component: Input-Text-Email
            role: form-field
          - component: Button-CTA
            role: submit-action
`);
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);

      const pattern = indexer.getPattern('nested')!;
      const container = pattern.steps[0].components[0];
      expect(container.component).toBe('Container-Base');
      expect(container.children).toHaveLength(2);
      expect(container.children![0].component).toBe('Input-Text-Email');
      expect(container.children![1].component).toBe('Button-CTA');
    });

    it('validates children component fields', async () => {
      writePattern('bad-child', `
name: bad-child
source: system
description: Bad child
category: forms
steps:
  - name: s
    purpose: p
    components:
      - component: Container-Base
        role: container
        children:
          - component: Valid
            role: field
          - hints:
              label: "missing component and role"
`);
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);
      expect(indexer.getHealth().patternsIndexed).toBe(0);
    });
  });

  describe('optional field', () => {
    it('parses optional: true on components', async () => {
      writePattern('with-optional', `
name: with-optional
source: system
description: Has optional component
category: forms
steps:
  - name: s
    purpose: p
    components:
      - component: Input-Text-Email
        role: form-field
      - component: Input-Checkbox-Base
        role: preference
        optional: true
`);
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);

      const pattern = indexer.getPattern('with-optional')!;
      expect(pattern.steps[0].components[0].optional).toBeUndefined();
      expect(pattern.steps[0].components[1].optional).toBe(true);
    });
  });

  describe('getCatalog', () => {
    it('returns sorted catalog entries with counts', async () => {
      writePattern('b-pattern', `
name: b-pattern
source: system
description: Second
category: forms
steps:
  - name: s
    purpose: p
    components:
      - component: X
        role: r
`);
      writePattern('a-pattern', `
name: a-pattern
source: system
description: First
category: onboarding
tags: [signup]
steps:
  - name: s1
    purpose: p1
    components:
      - component: A
        role: r
  - name: s2
    purpose: p2
    components:
      - component: B
        role: r
      - component: C
        role: r
`);
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);

      const catalog = indexer.getCatalog();
      expect(catalog).toHaveLength(2);
      expect(catalog[0].name).toBe('a-pattern');
      expect(catalog[0].stepCount).toBe(2);
      expect(catalog[0].componentCount).toBe(3);
      expect(catalog[1].name).toBe('b-pattern');
      expect(catalog[1].stepCount).toBe(1);
      expect(catalog[1].componentCount).toBe(1);
    });

    it('counts nested children in componentCount', async () => {
      writePattern('nested-count', `
name: nested-count
source: system
description: Nested
category: forms
steps:
  - name: s
    purpose: p
    components:
      - component: Container
        role: wrapper
        children:
          - component: A
            role: r
          - component: B
            role: r
`);
      const indexer = new PatternIndexer();
      await indexer.indexPatterns(tmpDir);

      const catalog = indexer.getCatalog();
      expect(catalog[0].componentCount).toBe(3);
    });
  });
});
