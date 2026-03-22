/**
 * GuidanceCompleteness — Guidance quality enforcement.
 *
 * Ensures every production component is reachable via getGuidance()
 * and every family guidance has non-empty quality fields.
 *
 * Resolution path: Component Development Guide § "Family Guidance Standards"
 *
 * @see .kiro/specs/083-application-mcp-guidance-completeness/design.md
 */

import * as path from 'path';
import { ComponentIndexer } from '../ComponentIndexer';

const COMPONENTS_DIR = path.resolve(__dirname, '../../../../src/components/core');

describe('GuidanceCompleteness', () => {
  let indexer: ComponentIndexer;

  beforeAll(async () => {
    indexer = new ComponentIndexer();
    await indexer.indexComponents(COMPONENTS_DIR);
  });

  it('every production component is reachable via getGuidance()', () => {
    const catalog = indexer.getCatalog();
    const unreachable: string[] = [];

    for (const c of catalog) {
      if (c.readiness !== 'production-ready' || !c.family) continue;
      if (!indexer.getGuidance(c.name)) {
        unreachable.push(
          `${c.name} — not reachable via getGuidance(). See Component Development Guide § "Family Guidance Standards"`
        );
      }
    }

    expect(unreachable).toEqual([]);
  });

  it('every family guidance has non-empty whenToUse, whenNotToUse, and accessibilityNotes', () => {
    const families = indexer.getGuidanceFamilies();
    const errors: string[] = [];
    const ref = 'See Component Development Guide § "Family Guidance Standards"';

    for (const family of families) {
      const guidance = indexer.getGuidance(family);
      if (!guidance) continue;

      if (!guidance.whenToUse?.length) {
        errors.push(`${family} — empty or missing whenToUse. ${ref}`);
      }
      if (!guidance.whenNotToUse?.length) {
        errors.push(`${family} — empty or missing whenNotToUse. ${ref}`);
      }
      if (!guidance.accessibilityNotes?.length) {
        errors.push(`${family} — empty or missing accessibilityNotes. ${ref}`);
      }
    }

    expect(errors).toEqual([]);
  });
});
