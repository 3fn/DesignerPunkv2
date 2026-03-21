/**
 * CoverageDrift — Application MCP coverage enforcement.
 *
 * Ensures every production family has family guidance,
 * every component in guidance exists in the catalog,
 * and every production component is reachable via getGuidance().
 *
 * @see .kiro/specs/075-mcp-coverage-enforcement/design.md
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
    const productionByFamily = new Map<string, string[]>();

    for (const c of catalog) {
      if (c.readiness === 'production-ready' && c.family) {
        const list = productionByFamily.get(c.family) || [];
        list.push(c.name);
        productionByFamily.set(c.family, list);
      }
    }

    // A family has guidance if any of its components resolve via getGuidance.
    // Schema family names may differ from guidance family names (e.g. "Button" vs "Buttons"),
    // so we check via component lookup rather than direct family name lookup.
    const uncovered: string[] = [];
    for (const [family, components] of productionByFamily) {
      const hasGuidance = components.some(name => indexer.getGuidance(name) !== null);
      if (!hasGuidance) {
        uncovered.push(`${family} (components: ${components.join(', ')})`);
      }
    }

    expect(uncovered).toEqual([]);
  });

  it('every component referenced in guidance exists in the catalog', () => {
    const health = indexer.getHealth();
    const phantomWarnings = health.warnings.filter(w => w.includes('not found in component catalog'));

    expect(phantomWarnings).toEqual([]);
  });

  it('every production component is reachable via getGuidance()', () => {
    const catalog = indexer.getCatalog();
    const productionComponents = catalog.filter(
      c => c.readiness === 'production-ready' && c.family
    );

    const unreachable: string[] = [];

    for (const component of productionComponents) {
      if (!indexer.getGuidance(component.name)) {
        // Check if any sibling in the same family resolves — distinguishes
        // "family has no guidance" from "component not in selectionRules"
        const siblingResolves = productionComponents.some(
          s => s.family === component.family && s.name !== component.name && indexer.getGuidance(s.name) !== null
        );
        if (siblingResolves) {
          unreachable.push(`${component.name} — not listed in "${component.family}" family selectionRules`);
        } else {
          unreachable.push(`${component.name} — family "${component.family}" has no guidance YAML`);
        }
      }
    }

    expect(unreachable).toEqual([]);
  });
});
