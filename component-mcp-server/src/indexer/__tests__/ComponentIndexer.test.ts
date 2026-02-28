/**
 * ComponentIndexer Integration Tests
 *
 * Tests against real component files in src/components/core/.
 */

import * as path from 'path';
import { ComponentIndexer } from '../ComponentIndexer';

const COMPONENTS_DIR = path.resolve(__dirname, '../../../../src/components/core');

describe('ComponentIndexer', () => {
  let indexer: ComponentIndexer;

  beforeAll(async () => {
    indexer = new ComponentIndexer();
    await indexer.indexComponents(COMPONENTS_DIR);
  });

  describe('indexComponents', () => {
    it('indexes components that have schema.yaml files', () => {
      const health = indexer.getHealth();
      expect(health.componentsIndexed).toBeGreaterThan(0);
      // 20 of 28 have schema.yaml, 8 don't
      expect(health.componentsIndexed).toBe(20);
    });

    it('warns about components without schema.yaml', () => {
      const health = indexer.getHealth();
      expect(health.warnings).toEqual(
        expect.arrayContaining([expect.stringContaining('has no schema.yaml')])
      );
    });

    it('reports degraded health when warnings exist', () => {
      const health = indexer.getHealth();
      expect(health.status).toBe('degraded');
    });
  });

  describe('getComponent', () => {
    it('returns assembled metadata for Badge-Count-Base', () => {
      const meta = indexer.getComponent('Badge-Count-Base');
      expect(meta).not.toBeNull();
      expect(meta!.name).toBe('Badge-Count-Base');
      expect(meta!.type).toBe('type-primitive');
      expect(meta!.family).toBe('Badge');
      expect(meta!.properties).toHaveProperty('count');
      expect(Object.keys(meta!.contracts.active).length).toBeGreaterThan(0);
    });

    it('resolves inheritance for Badge-Count-Notification', () => {
      const meta = indexer.getComponent('Badge-Count-Notification');
      expect(meta).not.toBeNull();
      expect(meta!.contracts.inheritsFrom).toBe('Badge-Count-Base');
      expect(meta!.contracts.inherited.length).toBeGreaterThan(0);
      // Has parent's content_displays_count
      expect(meta!.contracts.active.content_displays_count).toBeDefined();
      expect(meta!.contracts.active.content_displays_count.source).toBe('inherited');
      // Has own visual_notification_color
      expect(meta!.contracts.active.visual_notification_color).toBeDefined();
      expect(meta!.contracts.active.visual_notification_color.source).toBe('own');
    });

    it('includes composition for Container-Card-Base', () => {
      const meta = indexer.getComponent('Container-Card-Base');
      expect(meta).not.toBeNull();
      expect(meta!.composition).not.toBeNull();
      expect(meta!.composition!.composes).toEqual(
        expect.arrayContaining([expect.objectContaining({ component: 'Container-Base' })])
      );
    });

    it('returns null for nonexistent component', () => {
      expect(indexer.getComponent('Nonexistent')).toBeNull();
    });

    it('annotations are null (no component-meta.yaml files yet)', () => {
      const meta = indexer.getComponent('Badge-Count-Base');
      expect(meta!.annotations).toBeNull();
    });
  });

  describe('getCatalog', () => {
    it('returns lightweight entries for all indexed components', () => {
      const catalog = indexer.getCatalog();
      expect(catalog.length).toBe(20);
      const entry = catalog.find(c => c.name === 'Badge-Count-Base');
      expect(entry).toBeDefined();
      expect(entry!.family).toBe('Badge');
      expect(entry!.contractCount).toBeGreaterThan(0);
      expect(entry!.purpose).toBeNull(); // no meta files yet
    });
  });

  describe('reindexComponent', () => {
    it('re-indexes a single component and reflects in subsequent query', async () => {
      const before = indexer.getComponent('Badge-Count-Base');
      const beforeTime = before!.indexedAt;

      // Small delay to ensure different timestamp
      await new Promise(r => setTimeout(r, 10));
      await indexer.reindexComponent(path.join(COMPONENTS_DIR, 'Badge-Count-Base'));

      const after = indexer.getComponent('Badge-Count-Base');
      expect(after).not.toBeNull();
      expect(after!.indexedAt).not.toBe(beforeTime);
    });
  });

  describe('error handling', () => {
    it('handles nonexistent components directory', async () => {
      const emptyIndexer = new ComponentIndexer();
      await emptyIndexer.indexComponents('/nonexistent/path');
      const health = emptyIndexer.getHealth();
      expect(health.status).toBe('empty');
      expect(health.componentsIndexed).toBe(0);
      expect(health.warnings).toEqual(
        expect.arrayContaining([expect.stringContaining('not found')])
      );
    });
  });
});
