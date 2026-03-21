/**
 * FamilyNameValidation — Family name governance enforcement.
 *
 * Validates that every schema family: value matches a canonical name
 * in family-registry.yaml, and that guidance displayNames match the registry.
 *
 * @see .kiro/specs/082-application-mcp-consistency/design.md
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { ComponentIndexer } from '../ComponentIndexer';

const COMPONENTS_DIR = path.resolve(__dirname, '../../../../src/components/core');
const REGISTRY_PATH = path.resolve(__dirname, '../../../../family-registry.yaml');
const GUIDANCE_DIR = path.resolve(__dirname, '../../../../family-guidance');

interface RegistryEntry {
  canonical: string;
  displayName: string;
  prefix: string;
}

function loadRegistry(): RegistryEntry[] {
  const raw = yaml.load(fs.readFileSync(REGISTRY_PATH, 'utf-8')) as { families: RegistryEntry[] };
  return raw.families;
}

function isPascalCase(name: string): boolean {
  return /^[A-Z][a-zA-Z]*$/.test(name);
}

describe('FamilyNameValidation', () => {
  let indexer: ComponentIndexer;
  let registry: RegistryEntry[];
  let canonicalNames: Set<string>;

  beforeAll(async () => {
    indexer = new ComponentIndexer();
    await indexer.indexComponents(COMPONENTS_DIR);
    registry = loadRegistry();
    canonicalNames = new Set(registry.map(e => e.canonical));
  });

  it('every schema family value is registered in family-registry.yaml', () => {
    const catalog = indexer.getCatalog();
    const errors: string[] = [];

    for (const component of catalog) {
      if (!component.family) continue;

      if (!canonicalNames.has(component.family)) {
        if (!isPascalCase(component.family)) {
          errors.push(
            `Schema '${component.name}' uses family '${component.family}' which does not match PascalCase convention. ` +
            `Valid families: ${[...canonicalNames].sort().join(', ')}`
          );
        } else {
          errors.push(
            `Schema '${component.name}' uses family '${component.family}' which is not registered in family-registry.yaml. ` +
            `Valid families: ${[...canonicalNames].sort().join(', ')}`
          );
        }
      }
    }

    expect(errors).toEqual([]);
  });

  it('guidance displayNames match registry', () => {
    const registryMap = new Map(registry.map(e => [e.canonical, e.displayName]));
    const guidanceFiles = fs.readdirSync(GUIDANCE_DIR).filter(f => f.endsWith('.yaml'));
    const errors: string[] = [];

    for (const file of guidanceFiles) {
      const raw = yaml.load(fs.readFileSync(path.join(GUIDANCE_DIR, file), 'utf-8')) as Record<string, unknown>;
      if (!raw?.family || !raw?.displayName) continue;

      const family = String(raw.family);
      const guidanceDisplayName = String(raw.displayName);
      const registryDisplayName = registryMap.get(family);

      if (registryDisplayName && guidanceDisplayName !== registryDisplayName) {
        errors.push(
          `Guidance '${file}' has displayName '${guidanceDisplayName}' but registry has '${registryDisplayName}'. These must match.`
        );
      }
    }

    expect(errors).toEqual([]);
  });

  it('registry entries are all valid PascalCase', () => {
    const invalid = registry.filter(e => !isPascalCase(e.canonical));
    expect(invalid.map(e => e.canonical)).toEqual([]);
  });
});
