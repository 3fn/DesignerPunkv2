/**
 * Inheritance Resolver
 *
 * Resolves `inherits:` declarations by merging parent contracts into child's resolved set.
 * - Child extensions (same canonical name) override parent versions
 * - Excluded contracts are omitted with rationale preserved
 * - Max depth 1 (parent-child only) — warns on grandchild detection
 *
 * @see .kiro/specs/064-component-metadata-schema/design.md — Requirements 2.1–2.5
 */

import { Contract, ExcludedContract, ResolvedContracts } from '../models';
import { ParsedContracts } from './parsers';

export interface ResolveResult {
  contracts: ResolvedContracts;
  warnings: string[];
}

/**
 * Resolve the full contract set for a component, merging parent contracts
 * with child contracts per inheritance rules.
 */
export function resolveInheritance(
  child: ParsedContracts,
  parent: ParsedContracts | null,
  parentHasParent?: boolean,
): ResolveResult {
  const warnings: string[] = [];

  // No inheritance — all contracts are own
  if (!child.inherits) {
    return {
      contracts: buildOwnOnly(child),
      warnings,
    };
  }

  // Inheritance declared but parent not found
  if (!parent) {
    warnings.push(`Unresolved inheritance: parent ${child.inherits} not found`);
    return {
      contracts: buildOwnOnly(child, child.inherits),
      warnings,
    };
  }

  // Grandchild detection
  if (parentHasParent) {
    warnings.push(`Grandchild inheritance detected: ${child.component} → ${parent.component} → further parent. Max depth is 1.`);
  }

  const active: Record<string, Contract> = {};
  const own: string[] = [];
  const inherited: string[] = [];

  // Merge parent contracts first (child overrides take precedence)
  for (const [name, contract] of Object.entries(parent.contracts)) {
    // Skip if child excludes this contract
    if (child.excludes[name]) continue;

    // Skip if child overrides (extends) this contract
    if (child.contracts[name]) continue;

    active[name] = { ...contract, source: 'inherited' };
    inherited.push(name);
  }

  // Add child's own contracts
  for (const [name, contract] of Object.entries(child.contracts)) {
    const isExtension = parent.contracts[name] !== undefined;
    active[name] = { ...contract, source: isExtension ? 'extended' : 'own' };
    own.push(name);
  }

  // Merge excludes from both parent and child
  const excluded: Record<string, ExcludedContract> = {
    ...parent.excludes,
    ...child.excludes,
  };

  return {
    contracts: {
      inheritsFrom: child.inherits,
      active,
      excluded,
      own,
      inherited,
    },
    warnings,
  };
}

/** Build a ResolvedContracts with all contracts marked as own (no inheritance). */
function buildOwnOnly(parsed: ParsedContracts, inheritsFrom?: string): ResolvedContracts {
  const active: Record<string, Contract> = {};
  for (const [name, contract] of Object.entries(parsed.contracts)) {
    active[name] = { ...contract, source: 'own' };
  }
  return {
    inheritsFrom: inheritsFrom ?? null,
    active,
    excluded: { ...parsed.excludes },
    own: Object.keys(parsed.contracts),
    inherited: [],
  };
}

// ---------------------------------------------------------------------------
// Property Omits Validation
// ---------------------------------------------------------------------------

export interface OmitsValidationResult {
  valid: string[];
  warnings: string[];
}

/**
 * Validate that omitted props exist on the parent's property set.
 * Returns the valid omits and warnings for any that don't match.
 */
export function validateOmits(
  childName: string,
  omits: string[],
  parentName: string | null,
  parentProperties: Record<string, unknown> | null,
): OmitsValidationResult {
  if (omits.length === 0) return { valid: [], warnings: [] };

  if (!parentName) {
    return {
      valid: [],
      warnings: [`${childName} declares omits but has no parent`],
    };
  }

  if (!parentProperties) {
    return {
      valid: omits,
      warnings: [`Cannot validate omits for ${childName}: parent ${parentName} not indexed`],
    };
  }

  const valid: string[] = [];
  const warnings: string[] = [];
  for (const prop of omits) {
    if (prop in parentProperties) {
      valid.push(prop);
    } else {
      warnings.push(`Omit '${prop}' not found on parent ${parentName}`);
    }
  }
  return { valid, warnings };
}
