/**
 * @jest-environment node
 * @category evergreen
 * @purpose Validate all contract names against the Concept Catalog in Contract-System-Reference.md
 */

/**
 * Contract Catalog Name Validation Test
 *
 * Two-phase test:
 * 1. Parse the Concept Catalog from Contract-System-Reference.md — structural assertions
 * 2. Scan all contracts.yaml, extract names, verify each concept exists in the catalog
 *
 * @see .kiro/specs/078-contract-governance-enforcement/design.md
 * @validates Requirements R4.1, R4.2, R4.3, R4.4
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const COMPONENTS_DIR = path.join(process.cwd(), 'src/components/core');
const CATALOG_PATH = path.join(process.cwd(), '.kiro/steering/Contract-System-Reference.md');

// Baseline: 116 concepts post-audit (Task 1 completion). Floor rises as concepts are added.
const BASELINE_CONCEPT_COUNT = 116;
const EXPECTED_CATEGORY_COUNT = 10;

/**
 * Parse the Concept Catalog from Contract-System-Reference.md.
 *
 * Format:
 *   ### category_name (count)
 *   `concept1` · `concept2` · `concept3`
 *
 * Separator is · (middle dot, U+00B7) — NOT a regular period or bullet.
 *
 * Note: Current categories contain no underscores, so "first underscore splits
 * category from concept" works. If a future category contained an underscore,
 * the splitting logic would need revisiting. The structural assertion on category
 * count (exactly 10) catches new categories being added.
 */
function parseCatalog(): { categories: Map<string, Set<string>>; totalConcepts: number } {
  const content = fs.readFileSync(CATALOG_PATH, 'utf-8');
  const categories = new Map<string, Set<string>>();

  // Match category headings and their concept lines
  const categoryPattern = /^### (\w+) \((\d+)\)\s*\n\n(.+)$/gm;
  let match: RegExpExecArray | null;

  while ((match = categoryPattern.exec(content)) !== null) {
    const categoryName = match[1];
    const declaredCount = parseInt(match[2], 10);
    const conceptLine = match[3];

    // Extract concepts from backtick-delimited names separated by · (U+00B7)
    const concepts = new Set<string>();
    const conceptPattern = /`([^`]+)`/g;
    let conceptMatch: RegExpExecArray | null;
    while ((conceptMatch = conceptPattern.exec(conceptLine)) !== null) {
      concepts.add(conceptMatch[1]);
    }

    // Per-category count assertion: parenthetical count must match parsed count
    if (concepts.size !== declaredCount) {
      throw new Error(
        `Catalog format error: category '${categoryName}' declares (${declaredCount}) but parsed ${concepts.size} concepts`
      );
    }

    categories.set(categoryName, concepts);
  }

  let totalConcepts = 0;
  for (const concepts of categories.values()) {
    totalConcepts += concepts.size;
  }

  return { categories, totalConcepts };
}

describe('Contract Catalog Name Validation', () => {
  let catalog: ReturnType<typeof parseCatalog>;

  beforeAll(() => {
    catalog = parseCatalog();
  });

  describe('Catalog Structural Assertions', () => {
    it(`should have exactly ${EXPECTED_CATEGORY_COUNT} categories`, () => {
      expect(catalog.categories.size).toBe(EXPECTED_CATEGORY_COUNT);
    });

    it(`should have at least ${BASELINE_CONCEPT_COUNT} total concepts`, () => {
      expect(catalog.totalConcepts).toBeGreaterThanOrEqual(BASELINE_CONCEPT_COUNT);
    });
  });

  describe('Contract Name Validation', () => {
    // Collect all contract names across all components
    const componentDirs = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    const contractEntries: Array<[string, string]> = []; // [componentName, contractKey]

    for (const dir of componentDirs) {
      const contractsPath = path.join(COMPONENTS_DIR, dir, 'contracts.yaml');
      if (!fs.existsSync(contractsPath)) continue;

      try {
        const content = fs.readFileSync(contractsPath, 'utf-8');
        const parsed = yaml.load(content) as Record<string, any>;
        if (!parsed?.contracts) continue; // empty contracts.yaml — skip per design

        for (const key of Object.keys(parsed.contracts)) {
          contractEntries.push([dir, key]);
        }
      } catch {
        // YAML parse errors are caught by other tests
      }
    }

    it('should find contracts to validate', () => {
      expect(contractEntries.length).toBeGreaterThan(0);
    });

    it.each(contractEntries)(
      '%s: %s should be a valid catalog name',
      (componentName, contractKey) => {
        const underscoreIndex = contractKey.indexOf('_');
        if (underscoreIndex === -1) {
          throw new Error(
            `Contract '${contractKey}' does not follow {category}_{concept} format`
          );
        }

        const category = contractKey.substring(0, underscoreIndex);
        const concept = contractKey.substring(underscoreIndex + 1);

        const catalogCategory = catalog.categories.get(category);
        if (!catalogCategory) {
          throw new Error(
            `Component ${componentName}: contract '${contractKey}' has unrecognized category '${category}'`
          );
        }

        if (!catalogCategory.has(concept)) {
          throw new Error(
            `Component ${componentName}: contract '${contractKey}' has unrecognized concept '${concept}' in category '${category}'`
          );
        }
      }
    );
  });
});
