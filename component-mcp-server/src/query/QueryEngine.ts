/**
 * Component Query Engine
 *
 * Wraps ComponentIndexer with query logic, metrics, and error handling.
 * Provides capability discovery (by category, concept, platform, purpose)
 * and progressive disclosure (catalog → summary → full).
 *
 * @see .kiro/specs/064-component-metadata-schema/design.md — Requirements 3.1–3.6
 */

import { ComponentIndexer } from '../indexer/ComponentIndexer';
import { checkComposition } from '../indexer/CompositionChecker';
import {
  ComponentMetadata,
  ComponentCatalogEntry,
  ComponentSummary,
  CompositionResult,
  IndexHealth,
  QueryResult,
} from '../models';

export class ComponentQueryEngine {
  constructor(private indexer: ComponentIndexer) {}

  getComponent(name: string): QueryResult<ComponentMetadata> {
    const start = Date.now();
    const data = this.indexer.getComponent(name);
    return {
      data,
      error: data ? null : `Component "${name}" not found`,
      warnings: data?.warnings ?? [],
      metrics: { responseTimeMs: Date.now() - start },
    };
  }

  getCatalog(): QueryResult<ComponentCatalogEntry[]> {
    const start = Date.now();
    const data = this.indexer.getCatalog();
    return {
      data,
      error: null,
      warnings: [],
      metrics: { responseTimeMs: Date.now() - start },
    };
  }

  getComponentSummary(name: string): QueryResult<ComponentSummary> {
    const start = Date.now();
    const meta = this.indexer.getComponent(name);
    if (!meta) {
      return { data: null, error: `Component "${name}" not found`, warnings: [], metrics: { responseTimeMs: Date.now() - start } };
    }
    const summary: ComponentSummary = {
      name: meta.name,
      type: meta.type,
      family: meta.family,
      readiness: meta.readiness,
      description: meta.description,
      platforms: meta.platforms,
      contractCategories: [...new Set(Object.values(meta.contracts.active).map(c => c.category))],
      contractCount: Object.keys(meta.contracts.active).length,
      tokenCount: meta.tokens.length,
      annotations: meta.annotations,
      composesComponents: meta.composition?.composes.map(c => c.component) ?? [],
      inheritsFrom: meta.contracts.inheritsFrom,
    };
    return { data: summary, error: null, warnings: [], metrics: { responseTimeMs: Date.now() - start } };
  }

  findByCategory(category: string): QueryResult<ComponentSummary[]> {
    const start = Date.now();
    const results: ComponentSummary[] = [];
    for (const meta of this.indexer.getIndex().values()) {
      const hasCategory = Object.values(meta.contracts.active).some(c => c.category === category);
      if (hasCategory) {
        results.push(this.toSummary(meta));
      }
    }
    return { data: results, error: null, warnings: [], metrics: { responseTimeMs: Date.now() - start } };
  }

  findByConcept(concept: string): QueryResult<ComponentSummary[]> {
    const start = Date.now();
    const results: ComponentSummary[] = [];
    for (const meta of this.indexer.getIndex().values()) {
      if (meta.contracts.active[concept]) {
        results.push(this.toSummary(meta));
      }
    }
    return { data: results, error: null, warnings: [], metrics: { responseTimeMs: Date.now() - start } };
  }

  findByPlatform(platform: string): QueryResult<ComponentSummary[]> {
    const start = Date.now();
    const results: ComponentSummary[] = [];
    for (const meta of this.indexer.getIndex().values()) {
      if (meta.platforms.includes(platform)) {
        results.push(this.toSummary(meta));
      }
    }
    return { data: results, error: null, warnings: [], metrics: { responseTimeMs: Date.now() - start } };
  }

  searchByPurpose(keyword: string): QueryResult<ComponentSummary[]> {
    const start = Date.now();
    const lower = keyword.toLowerCase();
    const purposeMatches: ComponentSummary[] = [];
    const descriptionMatches: ComponentSummary[] = [];
    for (const meta of this.indexer.getIndex().values()) {
      const purpose = meta.annotations?.purpose?.toLowerCase() ?? '';
      const desc = meta.description.toLowerCase();
      if (purpose.includes(lower)) {
        purposeMatches.push(this.toSummary(meta));
      } else if (desc.includes(lower)) {
        descriptionMatches.push(this.toSummary(meta));
      }
    }
    const byName = (a: ComponentSummary, b: ComponentSummary) => a.name.localeCompare(b.name);
    const results = [...purposeMatches.sort(byName), ...descriptionMatches.sort(byName)];
    return { data: results, error: null, warnings: [], metrics: { responseTimeMs: Date.now() - start } };
  }

  findComponents(filters: { category?: string; concept?: string; platform?: string; purpose?: string }): QueryResult<ComponentSummary[]> {
    const start = Date.now();
    let candidates = Array.from(this.indexer.getIndex().values());

    if (filters.category) {
      candidates = candidates.filter(m =>
        Object.values(m.contracts.active).some(c => c.category === filters.category));
    }
    if (filters.concept) {
      candidates = candidates.filter(m => m.contracts.active[filters.concept!]);
    }
    if (filters.platform) {
      candidates = candidates.filter(m => m.platforms.includes(filters.platform!));
    }
    if (filters.purpose) {
      const lower = filters.purpose.toLowerCase();
      candidates = candidates.filter(m => {
        const purpose = m.annotations?.purpose?.toLowerCase() ?? '';
        const desc = m.description.toLowerCase();
        return purpose.includes(lower) || desc.includes(lower);
      });
    }

    const results = candidates.map(m => this.toSummary(m)).sort((a, b) => a.name.localeCompare(b.name));
    return { data: results, error: null, warnings: [], metrics: { responseTimeMs: Date.now() - start } };
  }

  checkComposition(parent: string, child: string, parentProps?: Record<string, unknown>): QueryResult<CompositionResult> {
    const start = Date.now();
    const parentMeta = this.indexer.getComponent(parent);
    if (!parentMeta) {
      return { data: null, error: `Parent component "${parent}" not found`, warnings: [], metrics: { responseTimeMs: Date.now() - start } };
    }
    const result = checkComposition(parentMeta, child, this.indexer.getIndex(), parentProps);
    return { data: result, error: null, warnings: [], metrics: { responseTimeMs: Date.now() - start } };
  }

  getHealth(): IndexHealth {
    return this.indexer.getHealth();
  }

  private toSummary(meta: ComponentMetadata): ComponentSummary {
    return {
      name: meta.name,
      type: meta.type,
      family: meta.family,
      readiness: meta.readiness,
      description: meta.description,
      platforms: meta.platforms,
      contractCategories: [...new Set(Object.values(meta.contracts.active).map(c => c.category))],
      contractCount: Object.keys(meta.contracts.active).length,
      tokenCount: meta.tokens.length,
      annotations: meta.annotations,
      composesComponents: meta.composition?.composes.map(c => c.component) ?? [],
      inheritsFrom: meta.contracts.inheritsFrom,
    };
  }
}
