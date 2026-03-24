/**
 * LayoutTemplateIndexer Tests
 *
 * Tests parsing, validation, catalog, health, and edge cases for layout templates.
 * MCP tool integration tested via ComponentIndexer delegation.
 */

import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { LayoutTemplateIndexer } from '../LayoutTemplateIndexer';
import { ComponentIndexer } from '../ComponentIndexer';

describe('LayoutTemplateIndexer', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'layout-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  const writeTemplate = (name: string, content: string) => {
    fs.writeFileSync(path.join(tmpDir, `${name}.yaml`), content);
  };

  const singleRegion = `
name: test-centered
source: system
description: A test centered page
category: content-focused
tags: [test]
regions:
  - name: content
    grid:
      xs: { columns: "1-4" }
      sm: { columns: "1-8" }
      md: { columns: "2-11" }
      lg: { columns: "3-14", maxWidth: breakpointMd }
    stacking: null
`;

  const multiRegion = `
name: test-sidebar
source: project
description: A test sidebar page
category: multi-region
tags: [sidebar, test]
regions:
  - name: primary
    grid:
      xs: { columns: "1-4" }
      sm: { columns: "1-8" }
      md: { columns: "1-8" }
      lg: { columns: "1-11" }
    stacking:
      below: breakpointMd
      order: 1
  - name: sidebar
    grid:
      xs: { columns: "1-4" }
      sm: { columns: "1-8" }
      md: { columns: "9-12" }
      lg: { columns: "12-16" }
    stacking:
      below: breakpointMd
      order: 2
`;

  // ---------------------------------------------------------------------------
  // Valid parsing
  // ---------------------------------------------------------------------------

  describe('valid parsing', () => {
    it('parses single-region template', async () => {
      writeTemplate('centered', singleRegion);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      const t = indexer.getTemplate('test-centered');
      expect(t).not.toBeNull();
      expect(t!.regions).toHaveLength(1);
      expect(t!.regions[0].name).toBe('content');
      expect(t!.regions[0].stacking).toBeNull();
    });

    it('parses multi-region template with stacking', async () => {
      writeTemplate('sidebar', multiRegion);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      const t = indexer.getTemplate('test-sidebar');
      expect(t).not.toBeNull();
      expect(t!.regions).toHaveLength(2);
      expect(t!.regions[0].stacking).toEqual({ below: 'breakpointMd', order: 1 });
      expect(t!.regions[1].stacking).toEqual({ below: 'breakpointMd', order: 2 });
    });

    it('parses source field correctly', async () => {
      writeTemplate('centered', singleRegion);
      writeTemplate('sidebar', multiRegion);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getTemplate('test-centered')!.source).toBe('system');
      expect(indexer.getTemplate('test-sidebar')!.source).toBe('project');
    });

    it('parses maxWidth on grid behavior', async () => {
      writeTemplate('centered', singleRegion);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      const t = indexer.getTemplate('test-centered')!;
      expect(t.regions[0].grid.lg.maxWidth).toBe('breakpointMd');
      expect(t.regions[0].grid.md.maxWidth).toBeUndefined();
    });

    it('parses tags and category', async () => {
      writeTemplate('sidebar', multiRegion);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      const t = indexer.getTemplate('test-sidebar')!;
      expect(t.category).toBe('multi-region');
      expect(t.tags).toEqual(['sidebar', 'test']);
    });
  });

  // ---------------------------------------------------------------------------
  // Validation errors
  // ---------------------------------------------------------------------------

  describe('validation errors', () => {
    it('rejects missing required fields', async () => {
      writeTemplate('bad', 'name: incomplete\nsource: system\n');
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getTemplate('incomplete')).toBeNull();
      expect(indexer.getHealth().warnings.length).toBeGreaterThan(0);
    });

    it('rejects invalid source value', async () => {
      writeTemplate('bad', singleRegion.replace('source: system', 'source: custom'));
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().warnings.some(w => w.includes("'source'"))).toBe(true);
    });

    it('rejects missing breakpoint', async () => {
      const noLg = `
name: bad
source: system
description: Missing lg
category: test
regions:
  - name: content
    grid:
      xs: { columns: "1-4" }
      sm: { columns: "1-8" }
      md: { columns: "1-12" }
    stacking: null
`;
      writeTemplate('bad', noLg);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().warnings.some(w => w.includes("missing breakpoint 'lg'"))).toBe(true);
    });

    it('rejects invalid column format', async () => {
      const bad = singleRegion.replace('columns: "1-4"', 'columns: "wide"');
      writeTemplate('bad', bad);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().warnings.some(w => w.includes('invalid column format'))).toBe(true);
    });

    it('rejects out-of-range columns', async () => {
      // xs has 4 columns, "1-8" exceeds that
      const bad = singleRegion.replace('columns: "1-4"', 'columns: "1-8"');
      writeTemplate('bad', bad);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().warnings.some(w => w.includes('exceeds xs column count'))).toBe(true);
    });

    it('rejects column start > end', async () => {
      const bad = singleRegion.replace('columns: "1-4"', 'columns: "4-1"');
      writeTemplate('bad', bad);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().warnings.some(w => w.includes('start (4) must be <= end (1)'))).toBe(true);
    });

    it('rejects zero-indexed columns', async () => {
      const bad = singleRegion.replace('columns: "1-4"', 'columns: "0-4"');
      writeTemplate('bad', bad);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().warnings.some(w => w.includes('column start must be >= 1'))).toBe(true);
    });

    it('rejects invalid maxWidth token', async () => {
      const bad = singleRegion.replace('maxWidth: breakpointMd', 'maxWidth: densityCompact');
      writeTemplate('bad', bad);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().warnings.some(w => w.includes('invalid maxWidth token'))).toBe(true);
    });

    it('rejects duplicate stacking order', async () => {
      const dup = multiRegion.replace('order: 2', 'order: 1');
      writeTemplate('bad', dup);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().warnings.some(w => w.includes('duplicate'))).toBe(true);
    });

    it('rejects non-positive stacking order', async () => {
      const bad = multiRegion.replace('order: 1', 'order: 0');
      writeTemplate('bad', bad);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().warnings.some(w => w.includes('positive integer'))).toBe(true);
    });

    it('rejects invalid stacking below token', async () => {
      const bad = multiRegion.replace('below: breakpointMd', 'below: gridMarginMd');
      writeTemplate('bad', bad);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().warnings.some(w => w.includes("stacking 'below' must be a breakpoint token"))).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Catalog generation
  // ---------------------------------------------------------------------------

  describe('catalog', () => {
    it('returns sorted catalog entries', async () => {
      writeTemplate('sidebar', multiRegion);
      writeTemplate('centered', singleRegion);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      const catalog = indexer.getCatalog();
      expect(catalog).toHaveLength(2);
      expect(catalog[0].name).toBe('test-centered');
      expect(catalog[1].name).toBe('test-sidebar');
    });

    it('includes region count in catalog entries', async () => {
      writeTemplate('centered', singleRegion);
      writeTemplate('sidebar', multiRegion);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      const catalog = indexer.getCatalog();
      expect(catalog.find(c => c.name === 'test-centered')!.regionCount).toBe(1);
      expect(catalog.find(c => c.name === 'test-sidebar')!.regionCount).toBe(2);
    });
  });

  // ---------------------------------------------------------------------------
  // Health reporting
  // ---------------------------------------------------------------------------

  describe('health', () => {
    it('reports correct template count', async () => {
      writeTemplate('centered', singleRegion);
      writeTemplate('sidebar', multiRegion);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().templatesIndexed).toBe(2);
    });

    it('reports warnings for invalid templates', async () => {
      writeTemplate('good', singleRegion);
      writeTemplate('bad', 'name: broken\n');
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().templatesIndexed).toBe(1);
      expect(indexer.getHealth().warnings.length).toBeGreaterThan(0);
    });

    it('clears state on re-index', async () => {
      writeTemplate('centered', singleRegion);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().templatesIndexed).toBe(1);
      fs.rmSync(path.join(tmpDir, 'centered.yaml'));
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().templatesIndexed).toBe(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Edge cases
  // ---------------------------------------------------------------------------

  describe('edge cases', () => {
    it('handles empty directory', async () => {
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().templatesIndexed).toBe(0);
      expect(indexer.getCatalog()).toEqual([]);
    });

    it('handles nonexistent directory', async () => {
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates('/nonexistent/path');
      expect(indexer.getHealth().templatesIndexed).toBe(0);
    });

    it('ignores non-YAML files', async () => {
      writeTemplate('good', singleRegion);
      fs.writeFileSync(path.join(tmpDir, 'readme.md'), '# Not a template');
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().templatesIndexed).toBe(1);
    });

    it('handles malformed YAML gracefully', async () => {
      fs.writeFileSync(path.join(tmpDir, 'bad.yaml'), '{{invalid yaml');
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getHealth().warnings.some(w => w.includes('YAML parse error'))).toBe(true);
    });

    it('allows columns "1-1" (single column)', async () => {
      const narrow = singleRegion.replace('columns: "1-4"', 'columns: "1-1"');
      writeTemplate('narrow', narrow);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getTemplate('test-centered')).not.toBeNull();
    });

    it('allows full-width column shorthand', async () => {
      const fw = singleRegion.replace('columns: "1-4"', 'columns: "full-width"');
      writeTemplate('fw', fw);
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getTemplate('test-centered')).not.toBeNull();
    });

    it('returns null for unknown template name', async () => {
      const indexer = new LayoutTemplateIndexer();
      await indexer.indexTemplates(tmpDir);
      expect(indexer.getTemplate('nonexistent')).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // MCP tool integration (via ComponentIndexer delegation)
  // ---------------------------------------------------------------------------

  describe('MCP tool integration', () => {
    const COMPONENTS_DIR = path.resolve(__dirname, '../../../../src/components/core');

    it('list_layout_templates returns catalog through ComponentIndexer', async () => {
      const indexer = new ComponentIndexer();
      await indexer.indexComponents(COMPONENTS_DIR);
      const catalog = indexer.getLayoutTemplateCatalog();
      expect(catalog.length).toBeGreaterThanOrEqual(4);
      expect(catalog.some(c => c.name === 'full-width-page')).toBe(true);
    });

    it('get_layout_template returns full template through ComponentIndexer', async () => {
      const indexer = new ComponentIndexer();
      await indexer.indexComponents(COMPONENTS_DIR);
      const t = indexer.getLayoutTemplate('sidebar-page');
      expect(t).not.toBeNull();
      expect(t!.regions).toHaveLength(2);
    });

    it('get_layout_template returns null for unknown name', async () => {
      const indexer = new ComponentIndexer();
      await indexer.indexComponents(COMPONENTS_DIR);
      expect(indexer.getLayoutTemplate('nonexistent')).toBeNull();
    });
  });
});
