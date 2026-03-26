/**
 * @jest-environment node
 * @category evergreen
 * @purpose Validate that composition.internal declarations match actual platform usage
 */

/**
 * Composition Compliance Validation Test
 *
 * For each component that declares composed children in composition.internal,
 * verifies that platform source files actually use the composed component.
 *
 * Pattern matching per platform:
 *   - iOS (.swift):    PascalCase function call, e.g. IconBase(
 *   - Android (.kt):   PascalCase function call, e.g. IconBase(
 *   - Web (.ts):        kebab-case tag, e.g. icon-base or <icon-base
 *
 * @see .kiro/issues/2026-03-18-composition-compliance-iconbase.md
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const COMPONENTS_DIR = path.join(process.cwd(), 'src/components/core');

interface CompositionEntry {
  component: string;
  role?: string;
  required?: boolean;
}

interface CompositionCheck {
  parent: string;
  child: string;
  platform: string;
}

function toCallPattern(componentName: string): string {
  // Icon-Base → IconBase(
  return componentName.replace(/-/g, '') + '(';
}

function toTagPattern(componentName: string): string {
  // Icon-Base → matches icon-base tag OR IconBase/createIconBase function calls
  // Web components may use custom element tags OR programmatic creation
  return componentName.toLowerCase();
}

function webPatterns(componentName: string): string[] {
  const kebab = componentName.toLowerCase();
  const pascal = componentName.replace(/-/g, '');
  // Match: <icon-base, icon-base (tag), createIconBase(, IconBase(, import from Icon-Base path
  return [kebab, `create${pascal}(`, `${pascal}(`];
}

function findPlatformFiles(componentDir: string): { platform: string; filePath: string }[] {
  const platformsDir = path.join(componentDir, 'platforms');
  if (!fs.existsSync(platformsDir)) return [];

  const results: { platform: string; filePath: string }[] = [];
  const platforms = fs.readdirSync(platformsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const platform of platforms) {
    const platDir = path.join(platformsDir, platform);
    const files = fs.readdirSync(platDir).filter(f => {
      if (platform === 'ios') return f.endsWith('.swift');
      if (platform === 'android') return f.endsWith('.kt');
      if (platform === 'web') return f.endsWith('.ts');
      return false;
    });
    for (const file of files) {
      results.push({ platform, filePath: path.join(platDir, file) });
    }
  }
  return results;
}

function getCompositionEntries(schemaPath: string): CompositionEntry[] {
  const content = fs.readFileSync(schemaPath, 'utf-8');
  const schema = yaml.load(content) as Record<string, unknown>;
  const composition = schema?.composition as Record<string, unknown> | undefined;
  const internal = composition?.internal as CompositionEntry[] | undefined;
  return internal || [];
}

// Build the full list of checks
const checks: CompositionCheck[] = [];
const componentDirs = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const comp of componentDirs) {
  const compDir = path.join(COMPONENTS_DIR, comp);
  const schemaPath = path.join(compDir, `${comp}.schema.yaml`);
  if (!fs.existsSync(schemaPath)) continue;

  const entries = getCompositionEntries(schemaPath);
  if (entries.length === 0) continue;

  const platformFiles = findPlatformFiles(compDir);
  for (const entry of entries) {
    for (const { platform } of platformFiles) {
      checks.push({ parent: comp, child: entry.component, platform });
    }
  }
}

// Deduplicate (multiple files per platform)
const uniqueChecks = checks.filter((check, i, arr) =>
  arr.findIndex(c => c.parent === check.parent && c.child === check.child && c.platform === check.platform) === i
);

// Known architectural mismatches tracked in separate issues
// All resolved — list is empty
const KNOWN_MISMATCHES: { parent: string; child: string }[] = [];

function isKnownMismatch(check: CompositionCheck): boolean {
  return KNOWN_MISMATCHES.some(m => m.parent === check.parent && m.child === check.child);
}

const activeChecks = uniqueChecks.filter(c => !isKnownMismatch(c));
const skippedChecks = uniqueChecks.filter(c => isKnownMismatch(c));

describe('Composition Compliance Validation', () => {
  it('should find components with composition.internal declarations', () => {
    expect(activeChecks.length).toBeGreaterThan(0);
  });

  it.each(activeChecks.map(c => [`${c.parent} → ${c.child} (${c.platform})`, c]))(
    '%s',
    (_label, check) => {
      const { parent, child, platform } = check as CompositionCheck;
      const compDir = path.join(COMPONENTS_DIR, parent);
      const platformFiles = findPlatformFiles(compDir)
        .filter(f => f.platform === platform);

      const pattern = platform === 'web' ? toTagPattern(child) : toCallPattern(child);
      const found = platformFiles.some(({ filePath }) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (platform === 'web') {
          const patterns = webPatterns(child);
          return patterns.some(p => content.includes(p));
        }
        return content.includes(pattern);
      });

      expect(found).toBe(true);
    }
  );

  if (skippedChecks.length > 0) {
    it.each(skippedChecks.map(c => [`${c.parent} → ${c.child} (${c.platform})`, c]))(
      'KNOWN MISMATCH (skipped): %s',
      () => {
        // Tracked in separate issues — remove from KNOWN_MISMATCHES when resolved
      }
    );
  }
});
