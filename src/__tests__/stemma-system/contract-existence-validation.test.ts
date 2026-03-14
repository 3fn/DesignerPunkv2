/**
 * @jest-environment node
 * @category evergreen
 * @purpose Validate that every component with platforms/ has a sibling contracts.yaml
 */

/**
 * Contract Existence Validation Test
 *
 * Scans src/components/core/ for directories containing a platforms/ subdirectory
 * and verifies a sibling contracts.yaml exists for each. This catches the root cause
 * from Spec 049 Task 3.1 — components being implemented without behavioral contracts.
 *
 * @see .kiro/specs/078-contract-governance-enforcement/design.md
 * @validates Requirements R3.1, R3.2, R3.3
 */

import * as fs from 'fs';
import * as path from 'path';

const COMPONENTS_DIR = path.join(process.cwd(), 'src/components/core');

describe('Contract Existence Validation', () => {
  const componentDirs = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const componentsWithPlatforms = componentDirs.filter(dir =>
    fs.existsSync(path.join(COMPONENTS_DIR, dir, 'platforms'))
  );

  it('should find components with platforms/ directories', () => {
    expect(componentsWithPlatforms.length).toBeGreaterThan(0);
  });

  it.each(componentsWithPlatforms)(
    '%s should have contracts.yaml',
    (componentName) => {
      const contractsPath = path.join(COMPONENTS_DIR, componentName, 'contracts.yaml');
      expect(fs.existsSync(contractsPath)).toBe(true);
    }
  );
});
