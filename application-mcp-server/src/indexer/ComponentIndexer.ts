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
  ExperiencePattern,
  PatternCatalogEntry,
  FamilyGuidance,
  LayoutTemplate,
  LayoutTemplateCatalogEntry,
  PlatformReadiness,
  PlatformReadinessStatus,
} from '../models';
import { parseSchemaYaml, parseContractsYaml, parseComponentMetaYaml, ParsedContracts, ParsedSchemaReadiness } from './parsers';
import { resolveInheritance, validateOmits } from './InheritanceResolver';
import { deriveContractTokenRelationships } from './ContractTokenDeriver';
import { PatternIndexer } from './PatternIndexer';
import { FamilyGuidanceIndexer } from './FamilyGuidanceIndexer';
import { LayoutTemplateIndexer } from './LayoutTemplateIndexer';
import { ModeClassifier } from './ModeClassifier';

export class ComponentIndexer {
  private index = new Map<string, ComponentMetadata>();
  private contractsCache = new Map<string, ParsedContracts>();
  private patternIndexer = new PatternIndexer();
  private guidanceIndexer = new FamilyGuidanceIndexer();
  private layoutTemplateIndexer = new LayoutTemplateIndexer();
  private modeClassifier = new ModeClassifier();
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

    // Load mode classifier (reads SemanticOverrides.ts for Level 2 keys)
    const projectRoot = path.resolve(componentsDir, '..', '..', '..');
    this.modeClassifier.load(projectRoot);

    // Second pass: assemble full metadata
    for (const dir of dirs) {
      this.assembleComponent(componentsDir, dir);
    }

    // Third pass: resolve composed tokens (needs all components indexed first)
    this.resolveComposedTokens();

    // Index experience patterns (resolve from project root, not components dir)
    const patternsDir = path.resolve(componentsDir, '..', '..', '..', 'experience-patterns');
    await this.patternIndexer.indexPatterns(patternsDir);

    // Index layout templates (resolve from project root, not components dir)
    const layoutTemplatesDir = path.resolve(componentsDir, '..', '..', '..', 'layout-templates');
    await this.layoutTemplateIndexer.indexTemplates(layoutTemplatesDir);

    // Index family guidance (must run after components and patterns for cross-reference validation)
    const guidanceDir = path.resolve(componentsDir, '..', '..', '..', 'family-guidance');
    await this.guidanceIndexer.indexGuidance(guidanceDir);

    // Cross-reference validation (components + patterns must be indexed first)
    const componentNames = new Set(Array.from(this.index.keys()));
    const patternNames = new Set(this.patternIndexer.getCatalog().map(p => p.name));
    this.guidanceIndexer.validateCrossReferences(componentNames, patternNames, projectRoot);

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
    this.resolveComposedTokens();
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
    const patternHealth = this.patternIndexer.getHealth();
    const guidanceHealth = this.guidanceIndexer.getHealth();
    const layoutHealth = this.layoutTemplateIndexer.getHealth();
    const allWarnings = [...this.indexWarnings, ...patternHealth.warnings, ...guidanceHealth.warnings, ...layoutHealth.warnings];
    return {
      status: count === 0 ? 'empty' : allWarnings.length > 0 ? 'degraded' : 'healthy',
      componentsIndexed: count,
      patternsIndexed: patternHealth.patternsIndexed,
      guidanceFamiliesIndexed: guidanceHealth.familiesIndexed,
      layoutTemplatesIndexed: layoutHealth.templatesIndexed,
      lastIndexTime: this.lastIndexTime,
      errors: [],
      warnings: allWarnings,
    };
  }

  /** Get a single experience pattern by name. */
  getPattern(name: string): ExperiencePattern | null {
    return this.patternIndexer.getPattern(name);
  }

  /** Get lightweight catalog of all experience patterns. */
  getPatternCatalog(): PatternCatalogEntry[] {
    return this.patternIndexer.getCatalog();
  }

  /** Get family guidance by family or component name. */
  getGuidance(familyOrComponent: string): FamilyGuidance | null {
    return this.guidanceIndexer.getGuidance(familyOrComponent);
  }

  /** Get all indexed guidance family names. */
  getGuidanceFamilies(): string[] {
    return this.guidanceIndexer.getAllFamilies();
  }

  /** Get a single layout template by name. */
  getLayoutTemplate(name: string): LayoutTemplate | null {
    return this.layoutTemplateIndexer.getTemplate(name);
  }

  /** Get lightweight catalog of all layout templates. */
  getLayoutTemplateCatalog(): LayoutTemplateCatalogEntry[] {
    return this.layoutTemplateIndexer.getCatalog();
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

    // Validate omits against parent properties
    if (schema.omits.length > 0) {
      const parentName = contracts.inheritsFrom;
      const parentMeta = parentName ? this.index.get(parentName) : null;
      const omitsResult = validateOmits(
        schema.name,
        schema.omits,
        parentName,
        parentMeta?.properties ?? null,
      );
      warnings.push(...omitsResult.warnings);
    }

    // Assemble
    const metadata: ComponentMetadata = {
      name: schema.name,
      type: schema.type,
      family: schema.family,
      version: schema.version,
      readiness: this.derivePlatformReadiness(dirPath, schema.readiness),
      description: schema.description,
      platforms: schema.platforms,
      properties: schema.properties,
      tokens: schema.tokens,
      composition: schema.composition,
      omits: schema.omits,
      contracts,
      annotations: metaResult.data ? {
        purpose: metaResult.data.purpose,
        usage: metaResult.data.usage,
        contexts: metaResult.data.contexts,
        alternatives: metaResult.data.alternatives,
      } : null,
      contractTokenRelationships: deriveContractTokenRelationships(contracts, schema.tokens),
      resolvedTokens: { own: schema.tokens, composed: {} },
      tokenModeMap: this.modeClassifier.classifyAll(schema.tokens),
      indexedAt: new Date().toISOString(),
      warnings,
    };

    this.index.set(schema.name, metadata);
  }

  /**
   * Derive per-platform readiness from filesystem scan + schema reviewed flags.
   * Design Decision 4 (Spec 086).
   */
  private derivePlatformReadiness(
    componentDir: string,
    schemaReadiness: ParsedSchemaReadiness | string,
  ): PlatformReadiness {
    // Check component-level baseline artifacts
    const hasSchema = fs.readdirSync(componentDir).some(f => f.endsWith('.schema.yaml'));
    const hasContracts = fs.existsSync(path.join(componentDir, 'contracts.yaml'));
    const hasTypes = fs.existsSync(path.join(componentDir, 'types.ts'));
    const baselineComplete = hasSchema && hasContracts && hasTypes;

    const platforms: Array<{ key: 'web' | 'ios' | 'android'; implPattern: RegExp; testPatterns: RegExp[] }> = [
      { key: 'web', implPattern: /\.web\.ts$/, testPatterns: [/\.test\.ts$/] },
      { key: 'ios', implPattern: /\.ios\.swift$/, testPatterns: [/Tests\.swift$/] },
      { key: 'android', implPattern: /\.android\.kt$/, testPatterns: [/Test\.kt$/] },
    ];

    const result: Record<string, PlatformReadinessStatus> = {};

    for (const p of platforms) {
      // Parse reviewed flag from schema
      const reviewed = typeof schemaReadiness === 'object'
        ? schemaReadiness[p.key]?.reviewed === true
        : false;
      const notApplicable = typeof schemaReadiness === 'object'
        ? schemaReadiness[p.key]?.status === 'not-applicable'
        : false;
      const naReason = typeof schemaReadiness === 'object'
        ? schemaReadiness[p.key]?.reason
        : undefined;

      if (notApplicable) {
        result[p.key] = { status: 'not-applicable', reason: naReason, reviewed: false, hasImplementation: false, hasTests: false };
        continue;
      }

      // Scan platform directory
      const platformDir = path.join(componentDir, 'platforms', p.key);
      const hasImpl = fs.existsSync(platformDir) &&
        fs.readdirSync(platformDir).some(f => p.implPattern.test(f));

      // Scan for tests — check platform dir and component __tests__ dir
      const testsDir = path.join(componentDir, '__tests__');
      const hasTests = (
        (fs.existsSync(platformDir) && fs.readdirSync(platformDir).some(f => p.testPatterns.some(tp => tp.test(f)))) ||
        (fs.existsSync(testsDir) && fs.readdirSync(testsDir).some(f => p.testPatterns.some(tp => tp.test(f))))
      );

      // Status derivation
      let status: PlatformReadinessStatus['status'];
      if (!hasImpl) {
        status = 'not-started';
      } else if (!baselineComplete || !hasTests) {
        status = 'scaffold';
      } else if (!reviewed) {
        status = 'development';
      } else {
        status = 'production-ready';
      }

      result[p.key] = { status, reviewed, hasImplementation: hasImpl, hasTests };
    }

    return result as unknown as PlatformReadiness;
  }

  /**
   * Resolve composed tokens for all indexed components (depth-1 only).
   * Collects tokens from internal and children.requires relationships.
   */
  private resolveComposedTokens(): void {
    for (const meta of this.index.values()) {
      if (!meta.composition) continue;

      const composed: Record<string, string[]> = {};
      const childNames = new Set<string>();

      for (const rel of meta.composition.internal) childNames.add(rel.component);
      if (meta.composition.children?.requires) {
        for (const r of meta.composition.children.requires) childNames.add(r);
      }

      for (const name of childNames) {
        const child = this.index.get(name);
        if (child) {
          composed[name] = child.tokens;
        } else {
          composed[name] = [];
          meta.warnings.push(`Composed child ${name} not indexed — tokens unavailable`);
        }
      }

      if (Object.keys(composed).length > 0) {
        meta.resolvedTokens = { own: meta.tokens, composed };
      }
    }
  }
}
