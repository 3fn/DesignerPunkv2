/**
 * Composition Checker
 *
 * Evaluates whether a parent component can contain a child component,
 * applying static constraints and conditional rules.
 *
 * @see .kiro/specs/064-component-metadata-schema/design.md — Requirements 4.1–4.5
 */

import { ComponentMetadata, CompositionResult } from '../models';

/**
 * Check if parent can contain child, given parent's current prop values.
 */
export function checkComposition(
  parent: ComponentMetadata,
  childName: string,
  index: Map<string, ComponentMetadata>,
  parentProps?: Record<string, unknown>,
): CompositionResult {
  const comp = parent.composition;

  // No composition definition — allow by default
  if (!comp) {
    return { allowed: true, reason: `${parent.name} has no composition constraints`, rule: 'static' };
  }

  // Self-nesting check
  if (childName === parent.name && comp.nesting?.self === false) {
    return { allowed: false, reason: `${parent.name} prohibits self-nesting`, rule: 'static' };
  }

  // Check conditional rules first (they override static constraints)
  if (comp.rules && parentProps) {
    for (const rule of comp.rules) {
      if (parentProps[rule.when.prop] === rule.when.equals && rule.then.children) {
        const result = evaluateChildren(rule.then.children, childName, index);
        if (result) return { ...result, rule: 'conditional', ruleDetail: rule };
      }
    }
  }

  // Static constraints
  if (comp.children) {
    const result = evaluateChildren(comp.children, childName, index);
    if (result) return result;
  }

  // No constraints matched — allowed by default
  return { allowed: true, reason: 'No applicable constraint', rule: 'static' };
}

function evaluateChildren(
  children: NonNullable<ComponentMetadata['composition']>['children'],
  childName: string,
  index: Map<string, ComponentMetadata>,
): CompositionResult | null {
  if (!children) return null;

  // Explicit prohibition
  if (children.prohibited?.includes(childName)) {
    return { allowed: false, reason: `${childName} is explicitly prohibited`, rule: 'static' };
  }

  // Explicit allow list — if present, child must be in it
  if (children.allowed && children.allowed.length > 0) {
    if (children.allowed.includes(childName)) {
      return { allowed: true, reason: `${childName} is explicitly allowed`, rule: 'static' };
    }
    return { allowed: false, reason: `${childName} is not in the allowed list`, rule: 'static' };
  }

  // Category-based checks
  const childMeta = index.get(childName);
  if (childMeta) {
    if (children.prohibitedCategories?.includes(childMeta.type)) {
      return { allowed: false, reason: `${childName} type "${childMeta.type}" is in prohibited categories`, rule: 'static' };
    }
    if (children.allowedCategories && children.allowedCategories.length > 0) {
      if (!children.allowedCategories.includes(childMeta.type)) {
        return { allowed: false, reason: `${childName} type "${childMeta.type}" is not in allowed categories`, rule: 'static' };
      }
    }
  }

  return null;
}
