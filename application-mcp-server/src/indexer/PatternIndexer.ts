/**
 * PatternIndexer — Parse and index experience pattern YAML files.
 *
 * Scans experience-patterns/ directory, validates against schema,
 * and provides catalog listing and single-pattern retrieval.
 *
 * @see experience-patterns/README.md — Schema reference
 * @see .kiro/specs/067-application-mcp/design.md — ExperiencePattern model
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import {
  ExperiencePattern,
  PatternComponent,
  PatternStep,
  PatternAlternative,
  PatternCatalogEntry,
  PatternHealth,
} from '../models';

export class PatternIndexer {
  private patterns = new Map<string, ExperiencePattern>();
  private indexWarnings: string[] = [];

  async indexPatterns(patternsDir: string): Promise<void> {
    this.patterns.clear();
    this.indexWarnings = [];

    if (!fs.existsSync(patternsDir)) return;

    const files = fs.readdirSync(patternsDir).filter(f => f.endsWith('.yaml'));

    for (const file of files) {
      const filePath = path.join(patternsDir, file);
      const result = this.parsePatternFile(filePath);
      if (result) {
        this.patterns.set(result.name, result);
      }
    }
  }

  getPattern(name: string): ExperiencePattern | null {
    return this.patterns.get(name) ?? null;
  }

  getCatalog(): PatternCatalogEntry[] {
    return Array.from(this.patterns.values())
      .map(p => ({
        name: p.name,
        description: p.description,
        category: p.category,
        tags: p.tags,
        source: p.source,
        stepCount: p.steps.length,
        componentCount: this.countComponents(p),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getHealth(): PatternHealth {
    return {
      patternsIndexed: this.patterns.size,
      errors: [],
      warnings: [...this.indexWarnings],
    };
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private parsePatternFile(filePath: string): ExperiencePattern | null {
    let raw: unknown;
    try {
      raw = yaml.load(fs.readFileSync(filePath, 'utf-8'));
    } catch {
      this.indexWarnings.push(`YAML parse error: ${path.basename(filePath)}`);
      return null;
    }

    if (!raw || typeof raw !== 'object') {
      this.indexWarnings.push(`Empty or invalid YAML: ${path.basename(filePath)}`);
      return null;
    }

    const doc = raw as Record<string, unknown>;
    const errors = this.validate(doc, path.basename(filePath));
    if (errors.length > 0) {
      this.indexWarnings.push(...errors);
      return null;
    }

    const steps = (doc.steps as unknown[]).map(s => this.parseStep(s as Record<string, unknown>));
    const alternatives = Array.isArray(doc.alternatives)
      ? doc.alternatives.map((a: Record<string, unknown>): PatternAlternative => ({
          pattern: String(a.pattern ?? ''),
          reason: String(a.reason ?? ''),
        }))
      : [];

    return {
      name: String(doc.name),
      source: doc.source as 'system' | 'project',
      extends: doc.extends ? String(doc.extends) : undefined,
      description: String(doc.description),
      category: String(doc.category),
      tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
      steps,
      accessibility: Array.isArray(doc.accessibility) ? doc.accessibility.map(String) : [],
      alternatives,
    };
  }

  private parseStep(raw: Record<string, unknown>): PatternStep {
    return {
      name: String(raw.name ?? ''),
      purpose: String(raw.purpose ?? ''),
      layout: raw.layout ? String(raw.layout) : undefined,
      components: Array.isArray(raw.components)
        ? raw.components.map((c: unknown) => this.parseComponent(c as Record<string, unknown>))
        : [],
    };
  }

  private parseComponent(raw: Record<string, unknown>): PatternComponent {
    const result: PatternComponent = {
      component: String(raw.component ?? ''),
      role: String(raw.role ?? ''),
    };
    if (raw.optional === true) result.optional = true;
    if (raw.hints && typeof raw.hints === 'object') result.hints = raw.hints as Record<string, unknown>;
    if (Array.isArray(raw.children)) {
      result.children = raw.children.map((c: unknown) => this.parseComponent(c as Record<string, unknown>));
    }
    return result;
  }

  private validate(doc: Record<string, unknown>, filename: string): string[] {
    const errors: string[] = [];
    const prefix = `Pattern ${filename}:`;

    for (const field of ['name', 'source', 'description', 'category', 'steps']) {
      if (!doc[field]) errors.push(`${prefix} missing required field '${field}'`);
    }
    if (errors.length > 0) return errors;

    if (doc.source !== 'system' && doc.source !== 'project') {
      errors.push(`${prefix} 'source' must be 'system' or 'project'`);
    }

    if (!Array.isArray(doc.steps) || doc.steps.length === 0) {
      errors.push(`${prefix} 'steps' must be a non-empty array`);
      return errors;
    }

    for (const step of doc.steps as Record<string, unknown>[]) {
      if (!step.name) errors.push(`${prefix} step missing 'name'`);
      if (!step.purpose) errors.push(`${prefix} step missing 'purpose'`);
      if (!Array.isArray(step.components) || step.components.length === 0) {
        errors.push(`${prefix} step '${step.name ?? '?'}' must have non-empty 'components'`);
        continue;
      }
      this.validateComponents(step.components as Record<string, unknown>[], prefix, errors);
    }

    return errors;
  }

  private validateComponents(components: Record<string, unknown>[], prefix: string, errors: string[]): void {
    for (const comp of components) {
      if (!comp.component) errors.push(`${prefix} component missing 'component' name`);
      if (!comp.role) errors.push(`${prefix} component missing 'role'`);
      if (comp.optional !== undefined && typeof comp.optional !== 'boolean') {
        errors.push(`${prefix} component '${comp.component ?? '?'}' 'optional' must be boolean`);
      }
      if (Array.isArray(comp.children)) {
        this.validateComponents(comp.children as Record<string, unknown>[], prefix, errors);
      }
    }
  }

  private countComponents(pattern: ExperiencePattern): number {
    let count = 0;
    const countRecursive = (components: PatternComponent[]) => {
      for (const c of components) {
        count++;
        if (c.children) countRecursive(c.children);
      }
    };
    for (const step of pattern.steps) countRecursive(step.components);
    return count;
  }
}
