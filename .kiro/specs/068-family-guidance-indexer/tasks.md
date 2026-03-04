# Implementation Plan: Family Guidance Indexer

**Date**: 2026-03-04
**Spec**: 068 - Family Guidance Indexer
**Status**: Implementation Planning
**Dependencies**: 067 (Application MCP — COMPLETE)

---

## Task List

### Task 1: Schema Convention and Directory Setup
**Type**: Setup
**Validation**: Tier 1 (Minimal)
**Agent**: Lina
**Success Criteria**: `family-guidance/` directory exists with README.md documenting the schema and read-both protocol. Schema convention ballot measure approved.

#### 1.1 Create `family-guidance/` directory and README.md
**Agent**: Lina
Create the directory at project root. README.md documents:
- YAML schema reference (all fields with types and optionality)
- Read-both protocol (mandatory read of companion file before modifying either)
- D9 compliance convention for rationale text
- File naming convention (lowercase family name, e.g., `button.yaml`)

#### 1.2 Schema convention ballot measure
**Agent**: Thurgood (present), Peter (approve)
Present the schema convention for ballot measure approval. Includes:
- Schema format and field definitions
- `family-guidance/` directory convention
- Read-both protocol
- D9 compliance convention

**Post-completion**: Commit directory and README.

---

### Task 2: Phase 2 — Interview-Driven Authoring (3 families)
**Type**: Implementation
**Validation**: Tier 2 (Standard)
**Agent**: Lina (lead), Ada (consult on token references), Thurgood (consult on D4 boundary testing)
**Success Criteria**: 3 companion YAML files authored (button.yaml, form-inputs.yaml, container.yaml), schema validated through real content, D4 boundary tested.

**Critical**: Phase 2 is strictly serial. Complete each subtask before starting the next. Schema changes from one inform the next.

#### 2.1 Author `button.yaml`
**Agent**: Lina
**Type**: Informed Placeholder — schema may evolve during interview
Interview-driven authoring of Button family guidance. Simplest family (flat rules, no groups). Validates the base schema shape.

For every pattern encountered, explicitly ask: "Does this belong in family guidance, experience pattern, or both?" (D4 boundary test)

Add cross-reference to `Component-Family-Button.md`.

#### 2.2 Author `form-inputs.yaml`
**Agent**: Lina
**Type**: Informed Placeholder — schema may evolve based on 2.1 findings
Interview-driven authoring of Form-Inputs family guidance. Complex family (grouped rules: Text Inputs, Checkboxes, Radio Buttons). Validates the `group` field and sub-type structure.

Apply any schema changes from 2.1 before starting. D4 boundary test for all patterns.

Add cross-reference to `Component-Family-Form-Inputs.md`.

#### 2.3 Author `container.yaml`
**Agent**: Lina
**Type**: Informed Placeholder — schema may evolve based on 2.1-2.2 findings
Interview-driven authoring of Container family guidance. Composition-heavy family. Validates patterns with `relatedPatterns` cross-references.

Apply any schema changes from 2.1-2.2 before starting. D4 boundary test for all patterns.

Add cross-reference to `Component-Family-Container.md`.

#### 2.4 Schema Review Gate
**Agent**: Thurgood
Review the schema as validated by 3 real companion files. Checkpoints:
- Schema handles flat rules (Button), grouped rules (Form-Inputs), and composition patterns (Container)
- D4 boundary findings: how many patterns were "both"? Does D4 need revisiting?
- D9 compliance in rationale text across all 3 files
- Cross-references are bidirectional and accurate

**Post-completion**: Commit all 3 YAML files and family doc cross-reference updates.

---

### Task 3: Indexer and MCP Tool Implementation
**Type**: Implementation
**Validation**: Tier 2 (Standard)
**Agent**: Lina
**Success Criteria**: `FamilyGuidanceIndexer` parses companion YAML files, integrates with `ComponentIndexer`, `get_prop_guidance` tool registered and functional. All tests pass.

#### 3.1 Implement `FamilyGuidanceIndexer`
**Agent**: Lina
Create `component-mcp-server/src/indexer/FamilyGuidanceIndexer.ts`:
- Scan `family-guidance/` directory for YAML files
- Parse and validate against schema
- Emit warnings for malformed entries or unknown family references
- Expose query methods: `getGuidance(familyOrComponent)`, `getAllFamilies()`

Tests: parse valid YAML (flat + grouped), handle malformed entries, validate schema, warning for unknown families.

#### 3.2 Integrate with `ComponentIndexer`
**Agent**: Lina
Update `ComponentIndexer` to instantiate and integrate `FamilyGuidanceIndexer`, following the same pattern as `PatternIndexer` integration.

Tests: guidance data accessible through `ComponentIndexer` queries.

#### 3.3 Implement `get_prop_guidance` MCP tool
**Agent**: Lina
Register `get_prop_guidance` in `index.ts`:
- Accept `component` parameter (component name or family name)
- Accept optional `verbose` parameter (default: false)
- Return `PropGuidanceResponse` with rationale stripped when non-verbose
- Return clear "no guidance available" for unknown components/families

Tests: query by component, query by family, verbose vs non-verbose, no-guidance-found.

#### 3.4 Cross-reference validation
**Agent**: Lina
Implement validation in the indexer:
- `recommend` values resolve to components in the catalog
- `relatedPatterns` values resolve to experience patterns in the pattern index
- `companion` paths reference existing files

Tests: valid references pass, invalid references emit warnings.

**Post-completion**: Run full test suite. Commit all implementation files.

---

### Task 4: Verification and Documentation
**Type**: Documentation
**Validation**: Tier 3 (Comprehensive)
**Agent**: Thurgood (verification), Lina (documentation)
**Success Criteria**: All tests pass, health check clean, documentation updated, ready for release.

#### 4.1 Final verification
**Agent**: Thurgood
- Run full MCP test suite — all tests pass
- Verify `get_component_health` reports clean status with guidance data
- Verify `get_prop_guidance` returns correct data for all 3 authored families
- Verify verbose vs non-verbose response shapes
- Count: confirm test count increase over 067 baseline (113)

#### 4.2 Update documentation
**Agent**: Lina
- Update `component-mcp-server/` README or docs with `get_prop_guidance` tool documentation
- Update `family-guidance/README.md` if schema evolved during Phase 2

#### 4.3 Ada token governance review
**Agent**: Ada
- Review all 3 companion YAML files for D9 compliance
- Verify token references in rationale text use token names, not raw values
- Verify prop values in selection rules are valid token-backed values

**Post-completion**: Commit documentation updates. Ready for release analysis.
