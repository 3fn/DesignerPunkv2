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

/** Tier 2+: Application-facing summary (promotes annotation fields for agent consumption) */
export interface ApplicationSummary extends ComponentSummary {
  purpose: string | null;
  whenToUse: string[];
  whenNotToUse: string[];
  alternatives: Alternative[];
  contexts: string[];
}

// ---------------------------------------------------------------------------
// Index Health
// ---------------------------------------------------------------------------

export type IndexHealthStatus = 'healthy' | 'degraded' | 'empty';

export interface IndexHealth {
  status: IndexHealthStatus;
  componentsIndexed: number;
  patternsIndexed: number;
  guidanceFamiliesIndexed: number;
  lastIndexTime: string;
  errors: string[];
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Experience Patterns
// ---------------------------------------------------------------------------

export interface PatternComponent {
  component: string;
  role: string;
  optional?: boolean;
  hints?: Record<string, unknown>;
  children?: PatternComponent[];
}

export interface PatternStep {
  name: string;
  purpose: string;
  layout?: string;
  components: PatternComponent[];
}

export interface PatternAlternative {
  pattern: string;
  reason: string;
}

export interface ExperiencePattern {
  name: string;
  source: 'system' | 'project';
  extends?: string;
  description: string;
  category: string;
  tags: string[];
  steps: PatternStep[];
  accessibility: string[];
  alternatives: PatternAlternative[];
}

export interface PatternCatalogEntry {
  name: string;
  description: string;
  category: string;
  tags: string[];
  source: 'system' | 'project';
  stepCount: number;
  componentCount: number;
}

export interface PatternHealth {
  patternsIndexed: number;
  errors: string[];
  warnings: string[];
}

// ---------------------------------------------------------------------------
// Assembly Validation
// ---------------------------------------------------------------------------

export interface AssemblyNode {
  component: string;
  props?: Record<string, unknown>;
  children?: AssemblyNode[];
}

export interface AssemblyIssue {
  path: string;
  component: string;
  message: string;
}

export interface AccessibilityIssue {
  rule: string;
  wcag: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface AssemblyValidationResult {
  valid: boolean;
  errors: AssemblyIssue[];
  warnings: AssemblyIssue[];
  accessibility: AccessibilityIssue[];
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

// ---------------------------------------------------------------------------
// Family Guidance (Spec 068)
// ---------------------------------------------------------------------------

export interface SelectionRule {
  scenario: string;
  recommend: string;
  props?: Record<string, unknown>;
  rationale: string;
}

export interface SelectionRuleGroup {
  group?: string;
  rules: SelectionRule[];
}

export interface FamilyPatternComponent {
  component: string;
  role: string;
  props?: Record<string, unknown>;
}

export interface FamilyPattern {
  name: string;
  description: string;
  components: FamilyPatternComponent[];
  relatedPatterns: string[];
}

export interface FamilyGuidance {
  family: string;
  companion: string;
  whenToUse: string[];
  whenNotToUse: string[];
  selectionRules: SelectionRuleGroup[];
  accessibilityNotes: string[];
  patterns: FamilyPattern[];
}

export interface PropGuidanceResponse {
  family: string;
  whenToUse: string[];
  whenNotToUse: string[];
  selectionRules: SelectionRuleGroup[];
  accessibilityNotes: string[];
  patterns: FamilyPattern[];
}

export interface FamilyGuidanceHealth {
  familiesIndexed: number;
  errors: string[];
  warnings: string[];
}
