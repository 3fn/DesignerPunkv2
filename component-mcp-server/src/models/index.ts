/**
 * Component Metadata Models
 *
 * Core data models for the component MCP server.
 * Assembled from schema.yaml, contracts.yaml, and component-meta.yaml at query time.
 *
 * @see .kiro/specs/064-component-metadata-schema/design.md — Data Models section
 */

// ---------------------------------------------------------------------------
// Property Definition (from schema.yaml)
// ---------------------------------------------------------------------------

export interface PropertyDefinition {
  type: string;
  description: string;
  default?: unknown;
  required?: boolean;
  values?: string[];
}

// ---------------------------------------------------------------------------
// Contracts (from contracts.yaml, inheritance resolved)
// ---------------------------------------------------------------------------

export interface Contract {
  category: string;
  description: string;
  behavior: string;
  wcag: string | null;
  platforms: string[];
  validation: string[];
  required: boolean;
  source: 'own' | 'inherited' | 'extended';
}

export interface ExcludedContract {
  reason: string;
  category: string;
  reference: string;
}

export interface ResolvedContracts {
  inheritsFrom: string | null;
  active: Record<string, Contract>;
  excluded: Record<string, ExcludedContract>;
  own: string[];
  inherited: string[];
}

// ---------------------------------------------------------------------------
// Semantic Annotations (from component-meta.yaml)
// ---------------------------------------------------------------------------

export interface Alternative {
  component: string;
  reason: string;
}

export interface SemanticAnnotations {
  purpose: string;
  usage: {
    whenToUse: string[];
    whenNotToUse: string[];
  };
  contexts: string[];
  alternatives: Alternative[];
}

// ---------------------------------------------------------------------------
// Composition (from schema.yaml)
// ---------------------------------------------------------------------------

export interface CompositionRelationship {
  component: string;
  relationship: string;
}

export interface CompositionRule {
  when: {
    prop: string;
    equals: unknown;
  };
  then: {
    children?: Partial<CompositionDefinition['children']>;
  };
}

export interface CompositionDefinition {
  internal: CompositionRelationship[];
  children?: {
    requires?: string[];
    allowed?: string[];
    prohibited?: string[];
    allowedCategories?: string[];
    prohibitedCategories?: string[];
    minCount?: number;
    maxCount?: number;
  };
  nesting?: {
    self: boolean;
  };
  rules?: CompositionRule[];
}

export interface CompositionResult {
  allowed: boolean;
  reason: string;
  rule: 'static' | 'conditional';
  ruleDetail?: CompositionRule;
}

// ---------------------------------------------------------------------------
// Contract-Token Derivation
// ---------------------------------------------------------------------------

export interface ContractTokenPair {
  contract: string;
  token: string;
  category: string;
}

export interface ContractTokenGap {
  contract: string;
  referencedToken: string;
  category: string;
}

export interface ContractTokenRelationships {
  resolved: ContractTokenPair[];
  gaps: ContractTokenGap[];
}

// ---------------------------------------------------------------------------
// Assembled Component Metadata (full response)
// ---------------------------------------------------------------------------

export interface ComponentMetadata {
  /** Component identity (from schema.yaml) */
  name: string;
  type: string;
  family: string;
  version: string;
  readiness: string;
  description: string;

  /** Structural data (from schema.yaml) */
  platforms: string[];
  properties: Record<string, PropertyDefinition>;
  tokens: string[];
  composition: CompositionDefinition | null;

  /** Property omissions from parent (schema-level, distinct from contract excludes) */
  omits: string[];

  /** Behavioral contracts (from contracts.yaml, inheritance resolved) */
  contracts: ResolvedContracts;

  /** Semantic annotations (from component-meta.yaml, nullable) */
  annotations: SemanticAnnotations | null;

  /** Derived data (computed at query time) */
  contractTokenRelationships: ContractTokenRelationships;

  /** Resolved token assembly (own + depth-1 composed children) */
  resolvedTokens: {
    own: string[];
    composed: Record<string, string[]>;
  };

  /** Indexing metadata */
  indexedAt: string;
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Progressive Disclosure Types
// ---------------------------------------------------------------------------

/** Tier 1: Catalog entry (~50 tokens per component) */
export interface ComponentCatalogEntry {
  name: string;
  type: string;
  family: string;
  purpose: string | null;
  readiness: string;
  platforms: string[];
  contractCount: number;
}

/** Tier 2: Component summary (~200 tokens) */
export interface ComponentSummary {
  name: string;
  type: string;
  family: string;
  readiness: string;
  description: string;
  platforms: string[];
  contractCategories: string[];
  contractCount: number;
  tokenCount: number;
  annotations: SemanticAnnotations | null;
  internalComponents: string[];
  requiredChildren: string[];
  inheritsFrom: string | null;
}

// ---------------------------------------------------------------------------
// Index Health
// ---------------------------------------------------------------------------

export type IndexHealthStatus = 'healthy' | 'degraded' | 'empty';

export interface IndexHealth {
  status: IndexHealthStatus;
  componentsIndexed: number;
  lastIndexTime: string;
  errors: string[];
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Query Result Wrapper
// ---------------------------------------------------------------------------

export interface QueryResult<T> {
  data: T | null;
  error: string | null;
  warnings: string[];
  metrics: {
    responseTimeMs: number;
  };
}
