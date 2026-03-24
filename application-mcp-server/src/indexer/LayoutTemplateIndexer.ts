/**
 * LayoutTemplateIndexer — Parse and index layout template YAML files.
 *
 * Scans layout-templates/ directory, validates against schema,
 * and provides catalog listing and single-template retrieval.
 *
 * Column counts sourced from Token-Family-Spacing.md § "Grid Spacing Tokens"
 *
 * @see .kiro/specs/069-layout-templates/design.md
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import {
  Breakpoint,
  GridBehavior,
  StackingRule,
  LayoutRegion,
  LayoutTemplate,
  LayoutTemplateCatalogEntry,
  LayoutTemplateHealth,
} from '../models';

// Column counts per breakpoint — from Token-Family-Spacing.md grid spacing table
const COLUMNS: Record<Breakpoint, number> = { xs: 4, sm: 8, md: 12, lg: 16 };

const BREAKPOINTS: Breakpoint[] = ['xs', 'sm', 'md', 'lg'];

// Valid token names for template references
const BREAKPOINT_TOKENS = new Set(['breakpointXs', 'breakpointSm', 'breakpointMd', 'breakpointLg']);

export class LayoutTemplateIndexer {
  private templates = new Map<string, LayoutTemplate>();
  private indexWarnings: string[] = [];

  async indexTemplates(templatesDir: string): Promise<void> {
    this.templates.clear();
    this.indexWarnings = [];

    if (!fs.existsSync(templatesDir)) return;

    const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.yaml'));

    for (const file of files) {
      const filePath = path.join(templatesDir, file);
      const result = this.parseTemplateFile(filePath);
      if (result) {
        this.templates.set(result.name, result);
      }
    }
  }

  getTemplate(name: string): LayoutTemplate | null {
    return this.templates.get(name) ?? null;
  }

  getCatalog(): LayoutTemplateCatalogEntry[] {
    return Array.from(this.templates.values())
      .map(t => ({
        name: t.name,
        description: t.description,
        category: t.category,
        tags: t.tags,
        source: t.source,
        regionCount: t.regions.length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getHealth(): LayoutTemplateHealth {
    return {
      templatesIndexed: this.templates.size,
      errors: [],
      warnings: [...this.indexWarnings],
    };
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private parseTemplateFile(filePath: string): LayoutTemplate | null {
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

    const regions = (doc.regions as Record<string, unknown>[]).map(r => this.parseRegion(r));

    return {
      name: String(doc.name),
      source: doc.source as 'system' | 'project',
      description: String(doc.description),
      category: String(doc.category),
      tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
      regions,
    };
  }

  private parseRegion(raw: Record<string, unknown>): LayoutRegion {
    const gridRaw = raw.grid as Record<string, Record<string, unknown>>;
    const grid = {} as Record<Breakpoint, GridBehavior>;

    for (const bp of BREAKPOINTS) {
      if (gridRaw[bp]) {
        const g = gridRaw[bp];
        const behavior: GridBehavior = { columns: String(g.columns) };
        if (g.maxWidth) behavior.maxWidth = String(g.maxWidth);
        grid[bp] = behavior;
      }
    }

    let stacking: StackingRule | null = null;
    if (raw.stacking && typeof raw.stacking === 'object') {
      const s = raw.stacking as Record<string, unknown>;
      stacking = { below: String(s.below), order: Number(s.order) };
    }

    return {
      name: String(raw.name),
      description: raw.description ? String(raw.description) : undefined,
      grid,
      stacking,
    };
  }

  private validate(doc: Record<string, unknown>, filename: string): string[] {
    const errors: string[] = [];
    const prefix = `Template ${filename}:`;

    for (const field of ['name', 'source', 'description', 'category', 'regions']) {
      if (!doc[field]) errors.push(`${prefix} missing required field '${field}'`);
    }
    if (errors.length > 0) return errors;

    if (doc.source !== 'system' && doc.source !== 'project') {
      errors.push(`${prefix} 'source' must be 'system' or 'project'`);
    }

    if (!Array.isArray(doc.regions) || doc.regions.length === 0) {
      errors.push(`${prefix} 'regions' must be a non-empty array`);
      return errors;
    }

    const stackingOrders: number[] = [];

    for (const region of doc.regions as Record<string, unknown>[]) {
      this.validateRegion(region, prefix, errors, stackingOrders);
    }

    return errors;
  }

  private validateRegion(
    region: Record<string, unknown>,
    prefix: string,
    errors: string[],
    stackingOrders: number[],
  ): void {
    if (!region.name) {
      errors.push(`${prefix} region missing 'name'`);
      return;
    }

    const rName = String(region.name);

    if (!region.grid || typeof region.grid !== 'object') {
      errors.push(`${prefix} region '${rName}' missing 'grid'`);
      return;
    }

    const grid = region.grid as Record<string, unknown>;

    // All four breakpoints required
    for (const bp of BREAKPOINTS) {
      if (!grid[bp]) {
        errors.push(`${prefix} region '${rName}' missing breakpoint '${bp}'`);
      }
    }

    // Validate each breakpoint's grid behavior
    for (const bp of BREAKPOINTS) {
      if (!grid[bp] || typeof grid[bp] !== 'object') continue;
      const g = grid[bp] as Record<string, unknown>;

      if (!g.columns) {
        errors.push(`${prefix} region '${rName}' breakpoint '${bp}' missing 'columns'`);
        continue;
      }

      const cols = String(g.columns);
      if (cols !== 'full-width') {
        const match = cols.match(/^(\d+)-(\d+)$/);
        if (!match) {
          errors.push(`${prefix} region '${rName}' breakpoint '${bp}' invalid column format '${cols}' — use 'N-M' or 'full-width'`);
        } else {
          const start = parseInt(match[1], 10);
          const end = parseInt(match[2], 10);
          const max = COLUMNS[bp as Breakpoint];

          if (start < 1) {
            errors.push(`${prefix} region '${rName}' breakpoint '${bp}' column start must be >= 1, got ${start}`);
          }
          if (end > max) {
            errors.push(`${prefix} region '${rName}' breakpoint '${bp}' column ${end} exceeds ${bp} column count (${max})`);
          }
          if (start > end) {
            errors.push(`${prefix} region '${rName}' breakpoint '${bp}' column start (${start}) must be <= end (${end})`);
          }
        }
      }

      if (g.maxWidth && !BREAKPOINT_TOKENS.has(String(g.maxWidth))) {
        errors.push(`${prefix} region '${rName}' breakpoint '${bp}' invalid maxWidth token '${g.maxWidth}' — must be a breakpoint token`);
      }
    }

    // Validate stacking
    if (region.stacking !== null && region.stacking !== undefined) {
      if (typeof region.stacking !== 'object') {
        errors.push(`${prefix} region '${rName}' 'stacking' must be an object or null`);
      } else {
        const s = region.stacking as Record<string, unknown>;
        if (!s.below || !BREAKPOINT_TOKENS.has(String(s.below))) {
          errors.push(`${prefix} region '${rName}' stacking 'below' must be a breakpoint token`);
        }
        if (typeof s.order !== 'number' || s.order < 1 || !Number.isInteger(s.order)) {
          errors.push(`${prefix} region '${rName}' stacking 'order' must be a positive integer`);
        } else {
          if (stackingOrders.includes(s.order as number)) {
            errors.push(`${prefix} region '${rName}' stacking order ${s.order} is a duplicate`);
          }
          stackingOrders.push(s.order as number);
        }
      }
    }
  }
}
