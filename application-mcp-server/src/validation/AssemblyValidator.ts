/**
 * Assembly Validator
 *
 * Validates a component tree (AssemblyNode) against the component catalog.
 * Depth-first walk checking: component existence, parent-child composition,
 * requires constraints, and count constraints.
 *
 * @see .kiro/specs/067-application-mcp/design.md — AssemblyValidator section
 */

import { ComponentIndexer } from '../indexer/ComponentIndexer';
import { checkComposition, validateRequires } from '../indexer/CompositionChecker';
import { AccessibilityChecker } from './AccessibilityChecker';
import { AssemblyNode, AssemblyValidationResult, AssemblyIssue } from '../models';

export class AssemblyValidator {
  private accessibilityChecker = new AccessibilityChecker();

  constructor(private indexer: ComponentIndexer) {}

  validate(assembly: AssemblyNode): AssemblyValidationResult {
    const errors: AssemblyIssue[] = [];
    const warnings: AssemblyIssue[] = [];
    this.walk(assembly, 'root', errors, warnings);
    const accessibility = this.accessibilityChecker.check(assembly);
    return {
      valid: errors.length === 0 && !accessibility.some(a => a.severity === 'error'),
      errors,
      warnings,
      accessibility,
    };
  }

  private walk(node: AssemblyNode, path: string, errors: AssemblyIssue[], warnings: AssemblyIssue[]): void {
    const meta = this.indexer.getComponent(node.component);
    if (!meta) {
      errors.push({ path, component: node.component, message: `Component "${node.component}" not found in catalog` });
      return;
    }

    const children = node.children ?? [];
    const index = this.indexer.getIndex();

    // Check each child is allowed
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childPath = `${path}.children[${i}]`;
      const result = checkComposition(meta, child.component, index, node.props);
      if (!result.allowed) {
        errors.push({ path: childPath, component: child.component, message: result.reason });
      }
    }

    // Check requires
    const childNames = children.map(c => c.component);
    const req = validateRequires(meta, childNames);
    if (!req.complete) {
      errors.push({ path, component: node.component, message: `Missing required children: ${req.missing.join(', ')}` });
    }

    // Check count constraints
    const comp = meta.composition;
    if (comp?.children && children.length > 0) {
      if (comp.children.minCount !== undefined && children.length < comp.children.minCount) {
        errors.push({ path, component: node.component, message: `Requires at least ${comp.children.minCount} children, found ${children.length}` });
      }
      if (comp.children.maxCount !== undefined && children.length > comp.children.maxCount) {
        errors.push({ path, component: node.component, message: `Allows at most ${comp.children.maxCount} children, found ${children.length}` });
      }
    }

    // Recurse
    for (let i = 0; i < children.length; i++) {
      this.walk(children[i], `${path}.children[${i}]`, errors, warnings);
    }
  }
}
