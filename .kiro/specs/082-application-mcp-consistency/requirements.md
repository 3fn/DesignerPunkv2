# Requirements Document: Application MCP Consistency & Governance

**Date**: 2026-03-21
**Spec**: 082 - Application MCP Consistency & Governance
**Status**: Requirements Phase
**Dependencies**: 067 (Application MCP), 068 (Family Guidance Indexer), 070 (Agent Architecture), 075 (MCP Coverage Enforcement)

---

## Introduction

The Application MCP ecosystem has accumulated naming inconsistencies across family names, MCP identity, and directory naming. This spec normalizes all three dimensions and establishes governance infrastructure to prevent future drift. The canonical family registry becomes the single source of truth for family identity.

---

## Requirements

### Requirement 1: Canonical Family Registry

**User Story**: As an AI agent, I want a single authoritative source for family identity, so that I can resolve canonical names, display names, and component prefixes without cross-referencing multiple files.

#### Acceptance Criteria

1. WHEN an agent or indexer needs family identity information THEN the system SHALL provide a `family-registry.yaml` file containing canonical name, display name, and component prefix for every production family.
2. WHEN a new family is introduced THEN the developer SHALL register it in `family-registry.yaml` before any schema can reference it.
3. WHEN the registry is loaded THEN every entry SHALL have all three fields (`canonical`, `displayName`, `prefix`) populated with non-empty values.

### Requirement 2: Family Name Normalization

**User Story**: As an AI agent, I want consistent family names across schemas and guidance YAMLs, so that `getGuidance(family)` works with the same identifier I read from a schema.

#### Acceptance Criteria

1. WHEN a schema.yaml file declares a `family:` field THEN the value SHALL be singular PascalCase matching the `canonical` field in `family-registry.yaml`.
2. WHEN a guidance YAML declares a `family:` field THEN the value SHALL match the `canonical` field in `family-registry.yaml`.
3. WHEN a guidance YAML is parsed THEN the system SHALL expose a `displayName` field for human-facing contexts.
4. WHEN `getGuidance()` is called with a canonical family name THEN it SHALL return the guidance directly (no component-level workaround needed).
5. WHEN `getGuidance()` is called with a component name THEN it SHALL continue to resolve via the component-to-family map (existing behavior preserved).
6. WHEN `getGuidance()` is called with a non-canonical family name (e.g., old plural form) THEN it SHALL return null (no automatic migration of old identifiers).
7. WHEN `getGuidance()` returns a result THEN the response SHALL include both `family` (canonical) and `displayName` (human-facing).

### Requirement 3: MCP Identity Standardization

**User Story**: As an AI agent navigating the codebase, I want the Application MCP to have one consistent name across directories, packages, configs, and documentation, so that I can identify it unambiguously.

#### Acceptance Criteria

1. WHEN an agent encounters the Application MCP server directory THEN it SHALL be named `application-mcp-server/`.
2. WHEN an agent reads the package.json THEN the package name SHALL be `@designerpunk/application-mcp-server`.
3. WHEN an agent reads any active steering doc, agent prompt, or README THEN references to the Application MCP SHALL use "Application MCP" (not "Component MCP" or "component-mcp-server").
4. WHEN an agent reads `.kiro/settings/mcp.json` THEN the path SHALL reference `application-mcp-server/`.
5. WHEN an agent reads historical completion docs or release notes THEN original names SHALL be preserved (records of state at time of writing).

### Requirement 4: Family Name Governance

**User Story**: As a system maintainer, I want automated enforcement that prevents family name drift, so that naming inconsistencies cannot recur.

#### Acceptance Criteria

1. WHEN a schema.yaml contains a `family:` value not present in `family-registry.yaml` THEN the `FamilyNameValidation` test SHALL fail with a message identifying the invalid family name and the offending schema file.
2. WHEN all schema `family:` values match the registry THEN the `FamilyNameValidation` test SHALL pass.
3. WHEN the `FamilyNameValidation` test fails THEN the error message SHALL distinguish between "family not registered" (missing from registry) and "family name format invalid" (wrong casing or format), and SHALL print the list of valid canonical names.
4. WHEN a guidance YAML declares a `displayName` that differs from the registry's `displayName` for the same family THEN the `FamilyNameValidation` test SHALL fail with a message identifying the mismatch.
5. WHEN the Component Development Guide is consulted for new component creation THEN it SHALL document the canonical naming convention, the family registry location, the prefix-to-family mapping for legacy families, and the forward-looking rule that new families must use the canonical name as the component prefix.

### Requirement 5: Documentation Consistency

**User Story**: As an AI agent reading steering docs, I want schema examples and MCP references to use current conventions, so that teaching material doesn't contradict the canonical source of truth.

#### Acceptance Criteria

1. WHEN a steering doc contains a schema example with a `family:` field THEN the value SHALL use the canonical PascalCase name from the registry.
2. WHEN an active steering doc or agent prompt references the Application MCP THEN it SHALL use "Application MCP" consistently. (Internal code comments are out of scope — they are not agent-facing.)
3. WHEN a docs-directory guide references the Application MCP THEN it SHALL use "Application MCP" and `application-mcp-server/` for directory references.
