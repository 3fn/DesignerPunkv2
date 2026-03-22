/**
 * CoverageDrift — Application MCP coverage enforcement.
 *
 * Ensures every production family has family guidance
 * and every component in guidance exists in the catalog.
 *
 * Component reachability enforcement migrated to GuidanceCompleteness.test.ts
 * per spec 083 Task 1.2.
 *
 * @see .kiro/specs/075-mcp-coverage-enforcement/design.md
 * @see .kiro/specs/083-application-mcp-guidance-completeness/design.md
 */

import * as path from 'path';
import { ComponentIndexer } from '../ComponentIndexer';

const COMPONENTS_DIR = path.resolve(__dirname, '../../../../src/components/core');

describe('CoverageDrift', () => {
  let indexer: ComponentIndexer;

  beforeAll(async () => {
    indexer = new ComponentIndexer();
    await indexer.indexComponents(COMPONENTS_DIR);
  });

  it('every production family has family guidance', () => {
    const catalog = indexer.getCatalog();
    const productionFamilies = new Set<string>();

    for (const c of catalog) {
      if (c.readiness === 'production-ready' && c.family) {
        productionFamilies.add(c.family);
      }
    }

    const uncovered: string[] = [];
    for (const family of productionFamilies) {
      if (!indexer.getGuidance(family)) {
        uncovered.push(family);
      }
    }

    expect(uncovered).toEqual([]);
  });

  it('every component referenced in guidance exists in the catalog', () => {
    const health = indexer.getHealth();
    const phantomWarnings = health.warnings.filter(w => w.includes('not found in component catalog'));

    expect(phantomWarnings).toEqual([]);
  });
});
