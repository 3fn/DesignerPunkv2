/**
 * Component Indexer
 *
 * Scans component directories, parses source files, assembles metadata,
 * and maintains the in-memory index. Integrates InheritanceResolver for
 * contract merging.
 *
 * @see .kiro/specs/064-component-metadata-schema/design.md — Requirements 1.1–1.4
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  ComponentMetadata,
  ComponentCatalogEntry,
  IndexHealth,
  ResolvedContracts,
} from '../models';
import { parseSchemaYaml, parseContractsYaml, parseComponentMetaYaml, ParsedContracts } from './parsers';
import { resolveInheritance } from './InheritanceResolver';
import { deriveContractTokenRelationships } from './ContractTokenDeriver';

export class ComponentIndexer {
  private index = new Map<string, ComponentMetadata>();
  private contractsCache = new Map<string, ParsedContracts>();
  private lastIndexTime = '';
  private indexWarnings: string[] = [];

  /**
   * Scan component directories and build initial index.
   */
  async indexComponents(componentsDir: string): Promise<void> {
    this.index.clear();
    this.contractsCache.clear();
    this.indexWarnings = [];

    if (!fs.existsSync(componentsDir)) {
      this.indexWarnings.push(`Components directory not found: ${componentsDir}`);
      this.lastIndexTime = new Date().toISOString();
      return;
    }

    const dirs = fs.readdirSync(componentsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    // First pass: parse all contracts (needed for inheritance resolution)
    for (const dir of dirs) {
      const contractsPath = path.join(componentsDir, dir, 'contracts.yaml');
      const contractsResult = parseContractsYaml(contractsPath);
      if (contractsResult.data) {
        this.contractsCache.set(contractsResult.data.component, contractsResult.data);
      }
    }

    // Second pass: assemble full metadata
    for (const dir of dirs) {
      this.assembleComponent(componentsDir, dir);
    }

    this.lastIndexTime = new Date().toISOString();
  }

  /**
   * Re-index a single component after file change.
   */
  async reindexComponent(componentDir: string): Promise<void> {
    const dir = path.basename(componentDir);
    const componentsDir = path.dirname(componentDir);

    // Re-parse contracts for cache
    const contractsPath = path.join(componentDir, 'contracts.yaml');
    const contractsResult = parseContractsYaml(contractsPath);
    if (contractsResult.data) {
      this.contractsCache.set(contractsResult.data.component, contractsResult.data);
    }

    // Remove old entry (might have different name)
    for (const [name, meta] of this.index) {
      if (meta.name === dir || path.basename(componentDir) === dir) {
        this.index.delete(name);
        break;
      }
    }

    this.assembleComponent(componentsDir, dir);
    this.lastIndexTime = new Date().toISOString();
  }

  /**
   * Get assembled metadata for a single component.
   */
  getComponent(name: string): ComponentMetadata | null {
    return this.index.get(name) ?? null;
  }

  /**
   * Get lightweight catalog of all components.
   */
  getCatalog(): ComponentCatalogEntry[] {
    return Array.from(this.index.values()).map(m => ({
      name: m.name,
      type: m.type,
      family: m.family,
      purpose: m.annotations?.purpose ?? null,
      readiness: m.readiness,
      platforms: m.platforms,
      contractCount: Object.keys(m.contracts.active).length,
    }));
  }

  /**
   * Get index health status.
   */
  getHealth(): IndexHealth {
    const count = this.index.size;
    return {
      status: count === 0 ? 'empty' : this.indexWarnings.length > 0 ? 'degraded' : 'healthy',
      componentsIndexed: count,
      lastIndexTime: this.lastIndexTime,
      errors: [],
      warnings: this.indexWarnings,
    };
  }

  /** Expose index for query engine */
  getIndex(): Map<string, ComponentMetadata> {
    return this.index;
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private assembleComponent(componentsDir: string, dir: string): void {
    const dirPath = path.join(componentsDir, dir);

    // Find schema.yaml (named {ComponentName}.schema.yaml)
    const schemaFile = fs.readdirSync(dirPath).find(f => f.endsWith('.schema.yaml'));
    if (!schemaFile) {
      this.indexWarnings.push(`Component directory has no schema.yaml: ${dir}`);
      return;
    }

    const schemaResult = parseSchemaYaml(path.join(dirPath, schemaFile));
    if (!schemaResult.data) {
      if (schemaResult.warning) this.indexWarnings.push(schemaResult.warning);
      return;
    }
    const schema = schemaResult.data;

    // Parse contracts
    const contractsResult = parseContractsYaml(path.join(dirPath, 'contracts.yaml'));
    let contracts: ResolvedContracts;
    const warnings: string[] = [];

    if (contractsResult.data) {
      // Resolve inheritance
      let parent: ParsedContracts | null = null;
      let parentHasParent = false;
      if (contractsResult.data.inherits) {
        parent = this.contractsCache.get(contractsResult.data.inherits) ?? null;
        if (parent?.inherits) parentHasParent = true;
      }
      const resolved = resolveInheritance(contractsResult.data, parent, parentHasParent);
      contracts = resolved.contracts;
      warnings.push(...resolved.warnings);
    } else {
      if (contractsResult.warning) warnings.push(contractsResult.warning);
      contracts = { inheritsFrom: null, active: {}, excluded: {}, own: [], inherited: [] };
    }

    // Parse component-meta.yaml
    const metaResult = parseComponentMetaYaml(path.join(dirPath, 'component-meta.yaml'));
    // No warning for missing meta — expected for components without annotations yet

    // Assemble
    const metadata: ComponentMetadata = {
      name: schema.name,
      type: schema.type,
      family: schema.family,
      version: schema.version,
      readiness: schema.readiness,
      description: schema.description,
      platforms: schema.platforms,
      properties: schema.properties,
      tokens: schema.tokens,
      composition: schema.composition,
      contracts,
      annotations: metaResult.data ? {
        purpose: metaResult.data.purpose,
        usage: metaResult.data.usage,
        contexts: metaResult.data.contexts,
        alternatives: metaResult.data.alternatives,
      } : null,
      contractTokenRelationships: deriveContractTokenRelationships(contracts, schema.tokens),
      indexedAt: new Date().toISOString(),
      warnings,
    };

    this.index.set(schema.name, metadata);
  }
}
