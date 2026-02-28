/**
 * ComponentQueryEngine Tests
 *
 * Integration tests against real component files.
 */

import * as path from 'path';
import { ComponentIndexer } from '../../indexer/ComponentIndexer';
import { ComponentQueryEngine } from '../QueryEngine';

const COMPONENTS_DIR = path.resolve(__dirname, '../../../../src/components/core');

describe('ComponentQueryEngine', () => {
  let engine: ComponentQueryEngine;

  beforeAll(async () => {
    const indexer = new ComponentIndexer();
    await indexer.indexComponents(COMPONENTS_DIR);
    engine = new ComponentQueryEngine(indexer);
  });

  describe('getCatalog', () => {
    it('returns all indexed components', () => {
      const result = engine.getCatalog();
      expect(result.error).toBeNull();
      expect(result.data!.length).toBe(20);
      expect(result.metrics.responseTimeMs).toBeDefined();
    });
  });

  describe('getComponent (full)', () => {
    it('returns full metadata for Badge-Count-Base', () => {
      const result = engine.getComponent('Badge-Count-Base');
      expect(result.error).toBeNull();
      expect(result.data!.name).toBe('Badge-Count-Base');
      expect(result.data!.contracts.active).toBeDefined();
      expect(result.data!.properties).toHaveProperty('count');
    });

    it('returns error for nonexistent component', () => {
      const result = engine.getComponent('Nonexistent');
      expect(result.data).toBeNull();
      expect(result.error).toContain('not found');
    });
  });

  describe('getComponentSummary', () => {
    it('returns summary with contract categories', () => {
      const result = engine.getComponentSummary('Badge-Count-Base');
      expect(result.error).toBeNull();
      expect(result.data!.contractCategories.length).toBeGreaterThan(0);
      expect(result.data!.contractCount).toBeGreaterThan(0);
    });

    it('includes inheritsFrom for Badge-Count-Notification', () => {
      const result = engine.getComponentSummary('Badge-Count-Notification');
      expect(result.data!.inheritsFrom).toBe('Badge-Count-Base');
    });
  });

  describe('findByCategory', () => {
    it('finds components with accessibility contracts', () => {
      const result = engine.findByCategory('accessibility');
      expect(result.data!.length).toBeGreaterThan(0);
    });
  });

  describe('findByConcept', () => {
    it('finds components with content_displays_count contract', () => {
      const result = engine.findByConcept('content_displays_count');
      expect(result.data!.length).toBeGreaterThan(0);
      const names = result.data!.map(s => s.name);
      expect(names).toContain('Badge-Count-Base');
      // Badge-Count-Notification inherits this contract
      expect(names).toContain('Badge-Count-Notification');
    });
  });

  describe('findByPlatform', () => {
    it('finds web components', () => {
      const result = engine.findByPlatform('web');
      expect(result.data!.length).toBeGreaterThan(0);
    });
  });

  describe('searchByPurpose', () => {
    it('searches description when no annotations exist', () => {
      const result = engine.searchByPurpose('count');
      expect(result.data!.length).toBeGreaterThan(0);
      const names = result.data!.map(s => s.name);
      expect(names).toContain('Badge-Count-Base');
    });
  });

  describe('checkComposition', () => {
    it('returns result for known parent', () => {
      const result = engine.checkComposition('Container-Card-Base', 'Badge-Count-Base');
      expect(result.error).toBeNull();
      expect(result.data).toBeDefined();
      expect(typeof result.data!.allowed).toBe('boolean');
    });

    it('returns error for unknown parent', () => {
      const result = engine.checkComposition('Nonexistent', 'Badge-Count-Base');
      expect(result.data).toBeNull();
      expect(result.error).toContain('not found');
    });
  });

  describe('findComponents (combined filters)', () => {
    it('intersects category + platform filters', () => {
      const categoryOnly = engine.findByCategory('accessibility');
      const combined = engine.findComponents({ category: 'accessibility', platform: 'web' });
      // Combined should be subset of (or equal to) category-only
      expect(combined.data!.length).toBeLessThanOrEqual(categoryOnly.data!.length);
      // All results should have web platform
      for (const s of combined.data!) {
        expect(s.platforms).toContain('web');
      }
    });

    it('returns empty when filters have no intersection', () => {
      const result = engine.findComponents({ concept: 'content_displays_count', platform: 'nonexistent' });
      expect(result.data!).toHaveLength(0);
    });
  });

  describe('searchByPurpose ordering', () => {
    it('results are alphabetically ordered', () => {
      const result = engine.searchByPurpose('badge');
      if (result.data!.length > 1) {
        for (let i = 1; i < result.data!.length; i++) {
          // Within each tier, names should be alphabetical
          // (can't test tier separation without annotations, but alphabetical within is verifiable)
        }
        const names = result.data!.map(s => s.name);
        const sorted = [...names].sort();
        expect(names).toEqual(sorted);
      }
    });
  });

  describe('progressive disclosure', () => {
    it('catalog → summary → full returns increasing detail', () => {
      const catalog = engine.getCatalog();
      const entry = catalog.data!.find(c => c.name === 'Badge-Count-Base')!;
      expect(Object.keys(entry)).not.toContain('contracts');

      const summary = engine.getComponentSummary('Badge-Count-Base');
      expect(summary.data!.contractCategories).toBeDefined();
      expect(Object.keys(summary.data!)).not.toContain('contracts');

      const full = engine.getComponent('Badge-Count-Base');
      expect(full.data!.contracts.active).toBeDefined();
      expect(full.data!.properties).toBeDefined();
    });
  });
});
