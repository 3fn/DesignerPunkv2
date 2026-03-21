/**
 * FamilyGuidanceIndexer — Parse and index family guidance companion YAML files.
 *
 * Scans family-guidance/ directory, validates against schema,
 * and provides guidance retrieval by family or component name.
 *
 * @see family-guidance/README.md — Schema reference
 * @see .kiro/specs/068-family-guidance-indexer/design.md — FamilyGuidance model
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import {
  FamilyGuidance,
  SelectionRule,
  SelectionRuleGroup,
  FamilyPattern,
  FamilyPatternComponent,
  FamilyGuidanceHealth,
} from '../models';

export class FamilyGuidanceIndexer {
  private guidance = new Map<string, FamilyGuidance>();
  private componentToFamily = new Map<string, string>();
  private indexWarnings: string[] = [];

  async indexGuidance(guidanceDir: string): Promise<void> {
    this.guidance.clear();
    this.componentToFamily.clear();
    this.indexWarnings = [];

    if (!fs.existsSync(guidanceDir)) return;

    const files = fs.readdirSync(guidanceDir).filter(f => f.endsWith('.yaml'));

    for (const file of files) {
      const filePath = path.join(guidanceDir, file);
      const result = this.parseGuidanceFile(filePath);
      if (result) {
        this.guidance.set(result.family, result);
        this.buildComponentMap(result);
      }
    }
  }

  validateCrossReferences(componentNames: Set<string>, patternNames: Set<string>, projectRoot: string): void {
    for (const [family, guidance] of this.guidance) {
      // Check companion path exists
      const companionPath = path.resolve(projectRoot, guidance.companion);
      if (!fs.existsSync(companionPath)) {
        this.indexWarnings.push(`${family}: companion path not found: ${guidance.companion}`);
      }

      // Check recommend values reference real components
      for (const group of guidance.selectionRules) {
        for (const rule of group.rules) {
          if (!componentNames.has(rule.recommend)) {
            this.indexWarnings.push(`${family}: recommend "${rule.recommend}" not found in component catalog`);
          }
        }
      }

      // Check relatedPatterns reference real experience patterns
      for (const pattern of guidance.patterns) {
        for (const ref of pattern.relatedPatterns) {
          if (!patternNames.has(ref)) {
            this.indexWarnings.push(`${family}: relatedPattern "${ref}" not found in pattern index`);
          }
        }
      }
    }
  }

  getGuidance(familyOrComponent: string): FamilyGuidance | null {
    // Try family name first
    const direct = this.guidance.get(familyOrComponent);
    if (direct) return direct;

    // Try component name → family lookup
    const family = this.componentToFamily.get(familyOrComponent);
    if (family) return this.guidance.get(family) ?? null;

    return null;
  }

  getAllFamilies(): string[] {
    return Array.from(this.guidance.keys()).sort();
  }

  getHealth(): FamilyGuidanceHealth {
    return {
      familiesIndexed: this.guidance.size,
      errors: [],
      warnings: [...this.indexWarnings],
    };
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private buildComponentMap(guidance: FamilyGuidance): void {
    for (const ruleOrGroup of guidance.selectionRules) {
      if (ruleOrGroup.group) {
        for (const rule of ruleOrGroup.rules) {
          this.componentToFamily.set(rule.recommend, guidance.family);
        }
      } else {
        for (const rule of ruleOrGroup.rules) {
          this.componentToFamily.set(rule.recommend, guidance.family);
        }
      }
    }
  }

  private parseGuidanceFile(filePath: string): FamilyGuidance | null {
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

    return {
      family: String(doc.family),
      companion: String(doc.companion),
      whenToUse: (doc.whenToUse as string[]).map(String),
      whenNotToUse: (doc.whenNotToUse as string[]).map(String),
      selectionRules: this.parseSelectionRules(doc.selectionRules as unknown[]),
      accessibilityNotes: Array.isArray(doc.accessibilityNotes) ? doc.accessibilityNotes.map(String) : [],
      patterns: Array.isArray(doc.patterns) ? this.parsePatterns(doc.patterns as unknown[]) : [],
    };
  }

  private parseSelectionRules(raw: unknown[]): SelectionRuleGroup[] {
    const groups: SelectionRuleGroup[] = [];

    for (const item of raw) {
      const entry = item as Record<string, unknown>;
      if (entry.group && Array.isArray(entry.rules)) {
        // Grouped rules
        groups.push({
          group: String(entry.group),
          rules: (entry.rules as unknown[]).map(r => this.parseRule(r as Record<string, unknown>)),
        });
      } else if (entry.scenario) {
        // Flat rule — find or create the ungrouped bucket
        let ungrouped = groups.find(g => !g.group);
        if (!ungrouped) {
          ungrouped = { rules: [] };
          groups.unshift(ungrouped);
        }
        ungrouped.rules.push(this.parseRule(entry));
      }
    }

    return groups;
  }

  private parseRule(raw: Record<string, unknown>): SelectionRule {
    const rule: SelectionRule = {
      scenario: String(raw.scenario ?? ''),
      recommend: String(raw.recommend ?? ''),
      rationale: String(raw.rationale ?? ''),
    };
    if (raw.props && typeof raw.props === 'object') {
      rule.props = raw.props as Record<string, unknown>;
    }
    return rule;
  }

  private parsePatterns(raw: unknown[]): FamilyPattern[] {
    return raw.map(item => {
      const p = item as Record<string, unknown>;
      return {
        name: String(p.name ?? ''),
        description: String(p.description ?? ''),
        components: Array.isArray(p.components)
          ? p.components.map((c: unknown) => this.parsePatternComponent(c as Record<string, unknown>))
          : [],
        relatedPatterns: Array.isArray(p.relatedPatterns) ? p.relatedPatterns.map(String) : [],
      };
    });
  }

  private parsePatternComponent(raw: Record<string, unknown>): FamilyPatternComponent {
    const comp: FamilyPatternComponent = {
      component: String(raw.component ?? ''),
      role: String(raw.role ?? ''),
    };
    if (raw.props && typeof raw.props === 'object') {
      comp.props = raw.props as Record<string, unknown>;
    }
    return comp;
  }

  private validate(doc: Record<string, unknown>, filename: string): string[] {
    const errors: string[] = [];
    const prefix = `Guidance ${filename}:`;

    for (const field of ['family', 'companion', 'whenToUse', 'whenNotToUse', 'selectionRules']) {
      if (!doc[field]) errors.push(`${prefix} missing required field '${field}'`);
    }
    if (errors.length > 0) return errors;

    if (!Array.isArray(doc.whenToUse)) errors.push(`${prefix} 'whenToUse' must be an array`);
    if (!Array.isArray(doc.whenNotToUse)) errors.push(`${prefix} 'whenNotToUse' must be an array`);
    if (!Array.isArray(doc.selectionRules)) errors.push(`${prefix} 'selectionRules' must be an array`);

    if (Array.isArray(doc.selectionRules)) {
      for (const item of doc.selectionRules as Record<string, unknown>[]) {
        if (item.group) {
          if (!Array.isArray(item.rules)) errors.push(`${prefix} group '${item.group}' must have 'rules' array`);
          else this.validateRules(item.rules as Record<string, unknown>[], prefix, errors);
        } else if (item.scenario) {
          this.validateRules([item], prefix, errors);
        } else {
          errors.push(`${prefix} selectionRule entry must have 'scenario' or 'group'`);
        }
      }
    }

    return errors;
  }

  private validateRules(rules: Record<string, unknown>[], prefix: string, errors: string[]): void {
    for (const rule of rules) {
      if (!rule.scenario) errors.push(`${prefix} rule missing 'scenario'`);
      if (!rule.recommend) errors.push(`${prefix} rule missing 'recommend'`);
      if (!rule.rationale) errors.push(`${prefix} rule missing 'rationale'`);
    }
  }
}
