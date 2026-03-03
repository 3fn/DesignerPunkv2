# Implementation Plan: Application MCP — Agent-Facing Component Catalog

**Date**: 2026-03-01
**Spec**: 067 - Application MCP
**Status**: Implementation Planning
**Dependencies**: 064 (Component Metadata Schema — COMPLETE), 066 (Schema Completion — COMPLETE)

---

## Implementation Plan

The execution follows the agreed sequence: schema definition → Pattern A interview (co-evolves schema) → schema review gate → build indexer and tools → Pattern C and B interviews → wire up accessibility checks → final verification.

Tasks are grouped into 4 parent tasks: (1) Experience Pattern Schema, (2) Enhanced Selection, (3) Assembly Validation, and (4) Final Verification. The pattern interviews are embedded in Task 1 because they co-evolve the schema.

---

## Task List

- [x] 1. Experience Pattern Schema and Authored Patterns

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Experience pattern YAML schema defined and validated against 3 structurally diverse patterns
  - 3 patterns authored through interviews: simple form (A), non-form layout (C), multi-step flow (B)
  - PatternIndexer parses and indexes all 3 patterns with zero errors
  - `list_experience_patterns` and `get_experience_pattern` tools registered and functional
  - Assembly-level accessibility notes captured from each interview

  **Primary Artifacts:**
  - `experience-patterns/` directory with 3 `.yaml` pattern files
  - `component-mcp-server/src/indexer/PatternIndexer.ts`
  - `component-mcp-server/src/models/index.ts` (pattern type additions)
  - `component-mcp-server/src/index.ts` (2 new tool registrations)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/067-application-mcp/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/067-application-mcp/task-1-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Experience Pattern Schema and Authored Patterns"` (runs release analysis automatically)
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Define initial experience pattern schema
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Lina (lead), Peter (co-evolves)
    - Define YAML schema structure based on design.md `ExperiencePattern` model
    - Create `experience-patterns/` directory
    - Document schema with field descriptions, required vs optional, and token governance convention (D9)
    - Create schema reference at `experience-patterns/README.md`
    - _Requirements: 3_

  - [x] 1.2 Interview for Pattern A — simple single-step form
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (lead), Ada + Thurgood (consult)
    - Conduct structured interview with Peter (Lina leads, Ada + Thurgood consult)
    - Fill schema live — discover gaps between schema and design judgment
    - Author `experience-patterns/simple-form.yaml`
    - Capture assembly-level accessibility notes
    - _Requirements: 3, 6.3_

  - [x] 1.3 Adjust schema from Pattern A findings
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Lina
    **Informed Placeholder**: Rewrite with schema gaps identified in Task 1.2 interview. Scope and implementation steps are unknowable until the interview surfaces what the initial schema got wrong. If the interview surfaces zero gaps, this task becomes a confirmation note rather than a change task.
    - _Requirements: 3_

  - [ ] 1.4 Schema review gate (Thurgood)
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    **Agent**: Thurgood
    - Review schema structure for completeness and consistency
    - Verify token governance convention (D9) is enforced
    - Verify two-layer architecture fields (`source`, `extends`) are present
    - Flag structural issues before indexer is built — last cheap moment
    - _Requirements: 3_

  - [x] 1.5 Build PatternIndexer
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Create `component-mcp-server/src/indexer/PatternIndexer.ts`
    - Implement YAML parsing with schema validation
    - Implement catalog listing and single-pattern retrieval
    - Implement health reporting
    - Integrate into `ComponentIndexer` startup lifecycle
    - Handle missing `experience-patterns/` directory gracefully
    - Write unit tests for parsing, validation, catalog, and error cases
    - _Requirements: 4, 7_

  - [x] 1.6 Register pattern tools in MCP server
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Add `ExperiencePattern`, `PatternStep`, `PatternComponent`, `PatternAlternative`, `PatternCatalogEntry` to models
    - Register `list_experience_patterns` tool in `index.ts`
    - Register `get_experience_pattern` tool in `index.ts`
    - Write tool descriptions following existing pattern
    - _Requirements: 4, 8_

  - [x] 1.7 Interview for Pattern C — non-form layout
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (lead), Ada + Thurgood (consult)
    **Informed Placeholder**: Rewrite after Task 1.5 (PatternIndexer built) with reviewed schema from Task 1.4. Interview questions and validation focus will be informed by what Pattern A established and what the schema review flagged. Core intent: validate schema handles non-form composition (container components, required children, list-based layout).
    - _Requirements: 3, 6.3_

  - [x] 1.8 Interview for Pattern B — multi-step flow
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (lead), Ada + Thurgood (consult)
    **Informed Placeholder**: Rewrite after Task 1.7 (Pattern C complete). Interview questions and validation focus will be informed by what Patterns A and C established. Core intent: validate schema handles sequencing (multiple steps with different component sets, inter-step navigation).
    - _Requirements: 3, 6.3_

- [x] 2. Enhanced Component Selection

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `findComponents` supports `context` filter with exact match against `contexts` array
  - `findComponents` returns `ApplicationSummary` response shape with promoted annotation fields
  - All existing `findComponents` tests pass with updated return type
  - Context filter works conjunctively with existing filters

  **Primary Artifacts:**
  - `component-mcp-server/src/models/index.ts` (`ApplicationSummary` interface)
  - `component-mcp-server/src/query/QueryEngine.ts` (updated `findComponents`)
  - `component-mcp-server/src/index.ts` (updated tool description)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/067-application-mcp/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/067-application-mcp/task-2-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Enhanced Component Selection"` (runs release analysis automatically)
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Add ApplicationSummary model and context filter
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Add `ApplicationSummary` interface to `models/index.ts`
    - Add `context` to `findComponents` filter interface
    - Implement context filter (exact match against `contexts` array, conjunctive with other filters)
    - Implement `toApplicationSummary` mapper in QueryEngine
    - Update `findComponents` return type to `ApplicationSummary[]`
    - Update existing tests for new return type
    - Write new tests for context filter (match, no match, conjunctive, no annotations)
    - _Requirements: 1, 2_

  - [x] 2.2 Update find_components tool description
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Lina
    - Update `find_components` tool description in `index.ts` to document `context` filter
    - Document `ApplicationSummary` response shape in tool description
    - _Requirements: 8_

- [x] 3. Assembly Validation

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `validate_assembly` accepts a component tree and validates all composition constraints
  - Assembly-level accessibility checks implemented from interview findings
  - Accessibility checks in isolated module with explicit refactor trigger documented
  - All validation results include paths, component names, and actionable messages

  **Primary Artifacts:**
  - `component-mcp-server/src/validation/AssemblyValidator.ts`
  - `component-mcp-server/src/validation/AccessibilityChecker.ts`
  - `component-mcp-server/src/models/index.ts` (`AssemblyNode`, `AssemblyValidationResult`, `AccessibilityIssue`)
  - `component-mcp-server/src/index.ts` (`validate_assembly` tool registration)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/067-application-mcp/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/067-application-mcp/task-3-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Assembly Validation"` (runs release analysis automatically)
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Implement AssemblyValidator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Add `AssemblyNode`, `AssemblyValidationResult`, `AssemblyIssue` to models
    - Create `component-mcp-server/src/validation/AssemblyValidator.ts`
    - Implement depth-first tree walk with path tracking
    - Validate component existence, parent-child composition, requires constraints, count constraints
    - Write unit tests for single node, parent-child, requires, counts, nested tree, unknown component, empty tree
    - _Requirements: 5_

  - [x] 3.2 Implement AccessibilityChecker
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina (implement), Thurgood (review)
    **Informed Placeholder**: Rewrite after Tasks 1.2, 1.7, and 1.8 (all three pattern interviews complete). Specific accessibility checks emerge from the interviews — they cannot be predetermined. The module structure (isolated class, WCAG references, refactor trigger) is known; the check implementations are not.
    - Add `AccessibilityIssue` to models
    - Create `component-mcp-server/src/validation/AccessibilityChecker.ts`
    - _Remaining steps TBD from interview findings_
    - _Requirements: 6_

  - [x] 3.3 Register validate_assembly tool
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Lina
    - Register `validate_assembly` tool in `index.ts`
    - Wire AssemblyValidator with AccessibilityChecker
    - Write tool description following existing pattern
    - Write integration test: validate real component tree (e.g., Radio-Set with Radio-Base children)
    - _Requirements: 5, 6, 8_

- [ ] 4. Final Verification

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All MCP tests pass (existing + new)
  - Health endpoint reports both component and pattern index status
  - 3 patterns indexed with zero errors
  - Enhanced `findComponents` returns correct results for context queries
  - `validate_assembly` correctly validates and rejects assemblies
  - TypeScript compilation clean

  **Primary Artifacts:**
  - Test results (all passing)
  - Health check output

  **Completion Documentation:**
  - Detailed: `.kiro/specs/067-application-mcp/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/067-application-mcp/task-4-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Final Verification"` (runs release analysis automatically)
  - Verify: Check GitHub for committed changes

  - [ ] 4.1 Integration testing and health verification
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Run full MCP test suite — zero regressions
    - Run TypeScript build — clean compilation
    - Verify health endpoint reports component + pattern status
    - Verify 3 patterns indexed, zero errors, zero warnings
    - Spot-check: `findComponents` with context filter against real data
    - Spot-check: `get_experience_pattern` returns full pattern content
    - Spot-check: `validate_assembly` with valid and invalid trees
    - _Requirements: 7_

  - [ ] 4.2 Token governance review
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Ada
    - Review all 3 pattern files for token governance convention (D9) compliance
    - Verify hints reference prop values and semantic intent only — no raw values
    - Verify token names used for visual properties where applicable
    - _Requirements: 3.7_
