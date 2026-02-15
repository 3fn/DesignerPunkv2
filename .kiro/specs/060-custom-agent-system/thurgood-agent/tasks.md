# Implementation Plan: Thurgood — Test Governance, Audit & Spec Standards Agent

**Date**: 2026-02-27
**Spec**: 060 — Custom Agent System (Thurgood)
**Status**: Implementation Planning
**Dependencies**: Ada agent (060-ada) and Lina agent (060-lina) must be built and validated (Phases 2-3 complete)

---

## Overview

Implementation follows the same pattern established by Ada (Phase 1-2) and Lina (Phase 3): frontmatter additions → agent config → system prompt → hooks → checkpoint validation. Tasks reference specific requirements and design decisions.

## Tasks

- [x] 1. Add Skill Frontmatter to Governance and Process Steering Docs

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All ~10 governance/process steering docs designated as skill:// resources have valid YAML frontmatter with `name` and `description` fields
  - Existing `inclusion: manual` frontmatter is preserved (fields added, not replaced)
  - Existing document content below frontmatter is unchanged
  - Documents remain valid markdown and render correctly
  - Docs that already have frontmatter from Ada/Lina work (Start Up Tasks, Process-Development-Workflow, Process-File-Organization) are NOT modified

  **Primary Artifacts:**
  - 10 steering docs with frontmatter additions

  **Completion Documentation:**
  - Detailed: `.kiro/specs/060-custom-agent-system/completion/task-1-thurgood-parent-completion.md`
  - Summary: `docs/specs/060-custom-agent-system/task-1-thurgood-summary.md` (triggers release detection)

  **Post-Completion:**
  - Run validation: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 (Thurgood) Complete: Add Skill Frontmatter to Governance and Process Steering Docs"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Add frontmatter to governance and test steering docs
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add `name` and `description` fields to existing YAML frontmatter in each doc:
      - AI-Collaboration-Framework.md
      - Test-Development-Standards.md
      - Test-Failure-Audit-Methodology.md
      - Test-Behavioral-Contract-Validation.md
      - Process-Spec-Planning.md
      - Process-Task-Type-Definitions.md
    - Preserve existing `inclusion: manual` field
    - Each description should clearly indicate when the agent should load the full content
    - Do NOT modify existing document content below the frontmatter
    - _Requirements: 4_

  - [x] 1.2 Add frontmatter to process and infrastructure steering docs
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add `name` and `description` fields to existing YAML frontmatter in:
      - BUILD-SYSTEM-SETUP.md
      - Completion Documentation Guide.md
      - Process-Cross-Reference-Standards.md
      - Process-Hook-Operations.md
    - Preserve existing `inclusion: manual` field
    - Verify that Start Up Tasks.md, Process-Development-Workflow.md, and Process-File-Organization.md already have frontmatter from Ada/Lina work — do NOT modify these
    - _Requirements: 4_

- [x] 2. Create Thurgood Agent Configuration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `thurgood.json` is valid JSON and loadable by Kiro
  - Thurgood appears in `/agent swap` list
  - Resource loading works (file://, skill://)
  - MCP documentation server accessible via `includeMcpJson: true`
  - Write access correctly scoped to `src/__tests__/**`, `.kiro/specs/**`, `docs/specs/**`
  - No knowledge base configured
  - Keyboard shortcut `ctrl+shift+t` activates Thurgood

  **Primary Artifacts:**
  - `.kiro/agents/thurgood.json`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/060-custom-agent-system/completion/task-2-thurgood-parent-completion.md`
  - Summary: `docs/specs/060-custom-agent-system/task-2-thurgood-summary.md` (triggers release detection)

  **Post-Completion:**
  - Run validation: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 (Thurgood) Complete: Create Thurgood Agent Configuration"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Create thurgood.json configuration file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/agents/thurgood.json` following the design document specification
    - Include all fields: name, description, prompt, includeMcpJson, tools, allowedTools, toolsSettings, resources, hooks, keyboardShortcut, welcomeMessage
    - Verify JSON is valid (no syntax errors)
    - Verify all file:// and skill:// resource paths resolve to existing files
    - Confirm no knowledge base is configured (unlike Ada and Lina)
    - Confirm `allowedTools` does NOT include `"knowledge"` (no knowledge base)
    - _Requirements: 1, 3, 4, 5_

  - [x] 2.2 Validate agent loads correctly
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Switch to Thurgood using `/agent swap` or `ctrl+shift+t`
    - Verify welcome message displays
    - Verify Thurgood can query MCP documentation server
    - Verify Thurgood does NOT have knowledge base search capability
    - _Requirements: 1, 3_

  - [x] 2.3 Validate write scope across all three agents
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test Thurgood's write scoping: attempt write inside `src/__tests__/` (should succeed), attempt write inside `src/tokens/` (should prompt or block), attempt write inside `src/components/` (should prompt or block)
    - Verify Ada's write paths (`src/tokens/**`, `src/validators/**`, `src/generators/**`) do NOT overlap with Thurgood's write paths (`src/__tests__/**`)
    - Verify Lina's write paths (`src/components/**`) do NOT overlap with Thurgood's write paths (`src/__tests__/**`)
    - Verify all three agents can write to `.kiro/specs/**` and `docs/specs/**`
    - Document results of cross-agent write scope validation
    - _Requirements: 5_

- [x] 3. Create Thurgood System Prompt

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - System prompt defines Thurgood's identity, domain, boundaries, and three operational modes
  - Thurgood correctly identifies himself and his specialization
  - Thurgood defers out-of-domain requests to Ada or Lina
  - Thurgood follows Process-Spec-Planning standards for spec formalization
  - Thurgood follows Test-Failure-Audit-Methodology for audits
  - Thurgood follows ballot measure model for documentation changes
  - Thurgood follows AI-Collaboration-Principles (counter-arguments, candid communication)

  **Primary Artifacts:**
  - `.kiro/agents/thurgood-prompt.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/060-custom-agent-system/completion/task-3-thurgood-parent-completion.md`
  - Summary: `docs/specs/060-custom-agent-system/task-3-thurgood-summary.md` (triggers release detection)

  **Post-Completion:**
  - Run validation: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 (Thurgood) Complete: Create Thurgood System Prompt"`
  - Verify: Check GitHub for committed changes

  - [x] 3.1 Write Thurgood system prompt
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Create `.kiro/agents/thurgood-prompt.md` with sections defined in design document:
      - Identity (name, role, domain)
      - Domain Boundaries (in scope, out of scope, boundary cases — audits not fixes)
      - Operational Mode: Spec Formalization (design outline → requirements.md/design.md/tasks.md, EARS patterns, Process-Spec-Planning standards)
      - Operational Mode: Audit (Test-Failure-Audit-Methodology, severity levels, domain-specific flagging)
      - Operational Mode: Test Governance (Test-Development-Standards, coverage strategy, quality standards)
      - Collaboration Model: Domain Respect (trust Ada's token decisions, trust Lina's component decisions, flag test governance concerns)
      - Documentation Governance: Ballot Measure Model (propose, vote, apply)
      - MCP Usage Pattern (when to query which docs, progressive disclosure)
      - Collaboration Standards (AI-Collaboration-Principles compliance)
    - Prompt should reference specific MCP doc paths for Thurgood to query
    - Prompt should include examples of domain boundary responses
    - Prompt should clearly distinguish "audit" (does the test exist and pass?) from "write" (create the test) — Thurgood audits, Ada/Lina write
    - _Requirements: 2, 6, 7, 8, 10, 11_

  - [x] 3.2 Validate prompt behavior
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test Thurgood with a test governance question → verify domain expertise response
    - Test Thurgood with a token creation question → verify he defers to Ada
    - Test Thurgood with a component scaffolding question → verify he defers to Lina
    - Test Thurgood with a doc update request → verify ballot measure model
    - Test Thurgood with a spec formalization request → verify he references Process-Spec-Planning
    - Test Thurgood with an audit request → verify he follows Test-Failure-Audit-Methodology
    - _Requirements: 2, 7, 8, 11_

- [x] 4. Create Thurgood User-Triggered Hooks

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All three hooks are defined and loadable by Kiro
  - Test Suite Health Audit analyzes coverage gaps, failing tests, and flaky tests
  - Spec Quality Scan validates EARS format, task types, and validation tiers
  - Accessibility Test Coverage Audit checks component and token accessibility test existence
  - Hooks are userTriggered (not automatic)

  **Primary Artifacts:**
  - `.kiro/hooks/thurgood-test-suite-health-audit.kiro.hook`
  - `.kiro/hooks/thurgood-spec-quality-scan.kiro.hook`
  - `.kiro/hooks/thurgood-accessibility-test-coverage-audit.kiro.hook`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/060-custom-agent-system/completion/task-4-thurgood-parent-completion.md`
  - Summary: `docs/specs/060-custom-agent-system/task-4-thurgood-summary.md` (triggers release detection)

  **Post-Completion:**
  - Run validation: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 (Thurgood) Complete: Create Thurgood User-Triggered Hooks"`
  - Verify: Check GitHub for committed changes

  - [x] 4.1 Create Test Suite Health Audit hook
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/hooks/thurgood-test-suite-health-audit.kiro.hook` following design document specification
    - Hook analyzes coverage gaps, failing tests, flaky tests across all test directories
    - Hook flags domain-specific issues for Ada (token tests) or Lina (component tests)
    - Verify hook appears in Kiro hook UI
    - Test hook execution produces meaningful output
    - _Requirements: 9_

  - [x] 4.2 Create Spec Quality Scan hook
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/hooks/thurgood-spec-quality-scan.kiro.hook` following design document specification
    - Hook validates EARS format, task type classification, validation tiers, and acceptance criteria quality
    - Hook scans all spec directories under `.kiro/specs/`
    - Verify hook appears in Kiro hook UI
    - Test hook execution produces meaningful output
    - _Requirements: 9_

  - [x] 4.3 Create Accessibility Test Coverage Audit hook
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/hooks/thurgood-accessibility-test-coverage-audit.kiro.hook` following design document specification
    - Hook checks component accessibility tests (ARIA, keyboard nav, focus management, screen reader, contrast)
    - Hook checks WCAG-related token tests
    - Hook cross-references behavioral contracts with actual test files
    - Hook flags token accessibility gaps for Ada and component accessibility gaps for Lina
    - Verify hook appears in Kiro hook UI
    - Test hook execution produces meaningful output
    - _Requirements: 9_

- [ ] 5. Checkpoint — Validate Thurgood End-to-End
  - Ensure all tests pass (`npm test`)
  - Verify Thurgood loads correctly via `/agent swap` and `ctrl+shift+t`
  - Verify all three hooks appear and are triggerable
  - Verify write scoping works correctly across all three agents (Ada, Lina, Thurgood)
  - Verify Thurgood has no knowledge base
  - Ask the user if questions arise

## Notes

- Tasks follow the same pattern as Ada (Phase 1-2) and Lina (Phase 3): frontmatter → config → prompt → hooks → checkpoint
- Frontmatter task only covers the ~10 docs that don't already have frontmatter from Ada/Lina work
- Thurgood has no knowledge base task (unlike Ada and Lina) — this is by design
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate configuration correctness (write scope, hook types)
- Manual acceptance tests validate LLM behavior (domain expertise, boundary responses, spec formalization)
