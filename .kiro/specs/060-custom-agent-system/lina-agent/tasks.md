# Implementation Plan: Lina — Stemma Component Specialist Agent

**Date**: 2026-02-20
**Spec**: 060 — Custom Agent System (Lina)
**Status**: Implementation Planning
**Dependencies**: Ada agent (060-ada) must be built and validated (Phase 2 complete)

---

## Task List

- [x] 1. Add Skill Frontmatter to Component Steering Docs

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All ~19 component steering docs designated as skill:// resources have valid YAML frontmatter with `name` and `description` fields
  - Existing `inclusion: manual` frontmatter is preserved (fields added, not replaced)
  - Existing document content below frontmatter is unchanged
  - Documents remain valid markdown and render correctly

  **Primary Artifacts:**
  - 12 Component-Family docs with frontmatter
  - 7 other component steering docs with frontmatter

  **Completion Documentation:**
  - Detailed: `.kiro/specs/060-custom-agent-system/completion/task-1-lina-parent-completion.md`
  - Summary: `docs/specs/060-custom-agent-system/task-1-lina-summary.md` (triggers release detection)

  **Post-Completion:**
  - Run validation: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 (Lina) Complete: Add Skill Frontmatter to Component Steering Docs"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Add frontmatter to Component-Family steering docs
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add `name` and `description` fields to existing YAML frontmatter in each Component-Family doc:
      - Component-Family-Avatar.md
      - Component-Family-Badge.md
      - Component-Family-Button.md
      - Component-Family-Chip.md
      - Component-Family-Container.md
      - Component-Family-Data-Display.md
      - Component-Family-Divider.md
      - Component-Family-Form-Inputs.md
      - Component-Family-Icon.md
      - Component-Family-Loading.md
      - Component-Family-Modal.md
      - Component-Family-Navigation.md
    - Preserve existing `inclusion: manual` field
    - Each description should clearly indicate when the agent should load the full content
    - Do NOT modify existing document content below the frontmatter
    - _Requirements: 4_

  - [x] 1.2 Add frontmatter to component domain steering docs
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add `name` and `description` fields to existing YAML frontmatter in:
      - stemma-system-principles.md
      - Component-Development-Standards.md
      - Component-Quick-Reference.md
      - Component-Readiness-Status.md
      - Component-Inheritance-Structures.md
      - platform-implementation-guidelines.md
      - Cross-Platform vs Platform-Specific Decision Framework.md
    - Preserve existing `inclusion: manual` field
    - _Requirements: 4_

- [x] 2. Create Lina Agent Configuration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `lina.json` is valid JSON and loadable by Kiro
  - Lina appears in `/agent swap` list
  - Resource loading works (file://, skill://, knowledgeBase)
  - MCP documentation server accessible via `includeMcpJson: true`
  - Write access correctly scoped to `src/components/**`, `.kiro/specs/**`, `docs/specs/**`
  - Keyboard shortcut `ctrl+shift+l` activates Lina

  **Primary Artifacts:**
  - `.kiro/agents/lina.json`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/060-custom-agent-system/completion/task-2-lina-parent-completion.md`
  - Summary: `docs/specs/060-custom-agent-system/task-2-lina-summary.md` (triggers release detection)

  **Post-Completion:**
  - Run validation: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 (Lina) Complete: Create Lina Agent Configuration"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Create lina.json configuration file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/agents/lina.json` following the design document specification
    - Include all fields: name, description, prompt, includeMcpJson, tools, allowedTools, toolsSettings, resources, hooks, keyboardShortcut, welcomeMessage
    - Verify JSON is valid (no syntax errors)
    - Verify all file:// and skill:// resource paths resolve to existing files
    - _Requirements: 1, 3, 4, 5_

  - [x] 2.2 Validate agent loads correctly
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Switch to Lina using `/agent swap` or `ctrl+shift+l`
    - Verify welcome message displays
    - Verify Lina can query MCP documentation server
    - Verify Lina can search knowledge base (StemmaComponentSource)
    - _Requirements: 1, 3_

  - [x] 2.3 Validate write scope for both Ada and Lina
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test Ada's write scoping: attempt write inside `src/tokens/` (should succeed), attempt write inside `src/components/` (should prompt or block)
    - Test Lina's write scoping: attempt write inside `src/components/` (should succeed), attempt write inside `src/tokens/` (should prompt or block)
    - Verify both agents can write to `.kiro/specs/**` and `docs/specs/**`
    - Document results of cross-agent write scope validation
    - _Requirements: 5_

- [ ] 3. Create Lina System Prompt

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - System prompt defines Lina's identity, domain, and boundaries
  - Lina correctly identifies herself and her specialization
  - Lina defers out-of-domain requests to Ada or Thurgood
  - Lina follows Token Governance for component token usage
  - Lina follows ballot measure model for documentation changes
  - Lina follows AI-Collaboration-Principles (counter-arguments, candid communication)

  **Primary Artifacts:**
  - `.kiro/agents/lina-prompt.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/060-custom-agent-system/completion/task-3-lina-parent-completion.md`
  - Summary: `docs/specs/060-custom-agent-system/task-3-lina-summary.md` (triggers release detection)

  **Post-Completion:**
  - Run validation: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 (Lina) Complete: Create Lina System Prompt"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Write Lina system prompt
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Create `.kiro/agents/lina-prompt.md` with sections defined in design document:
      - Identity (name, role, domain)
      - Domain Boundaries (in scope, out of scope, boundary cases)
      - Component Scaffolding Workflow (types.ts → platforms → tests → README, Component-Family doc check)
      - Platform Implementation: True Native Architecture (web: Web Components + CSS logical properties, iOS: Swift + SwiftUI, Android: Kotlin + Jetpack Compose)
      - Token Usage in Components (Token Governance: semantic first, flag missing tokens for Ada)
      - Collaboration Model: Domain Respect (trust-by-default, obligation to flag, graceful correction, fallibility)
      - Documentation Governance: Ballot Measure Model (propose, vote, apply)
      - MCP Usage Pattern (when to query which docs, progressive disclosure)
      - Collaboration Standards (AI-Collaboration-Principles compliance)
    - Prompt should reference specific MCP doc paths for Lina to query
    - Prompt should include examples of domain boundary responses
    - _Requirements: 2, 6, 7, 8, 10_

  - [ ] 3.2 Validate prompt behavior
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test Lina with a component-related question → verify domain expertise response
    - Test Lina with a token creation question → verify she defers to Ada
    - Test Lina with a test governance question → verify she defers to Thurgood
    - Test Lina with a doc update request → verify ballot measure model
    - Test Lina with a component scaffolding request → verify Stemma structure compliance
    - _Requirements: 2, 7, 8_

- [ ] 4. Create Lina User-Triggered Hooks

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All four hooks are defined and loadable by Kiro
  - Stemma Compliance Check validates behavioral contracts and inheritance patterns
  - Component Token Audit identifies hard-coded values and governance violations
  - Component Scaffold Validation checks structure completeness and family doc existence
  - Platform Parity Check verifies all three platform implementations exist and are in sync
  - Hooks are userTriggered (not automatic)

  **Primary Artifacts:**
  - `.kiro/hooks/lina-stemma-compliance-check.json`
  - `.kiro/hooks/lina-component-token-audit.json`
  - `.kiro/hooks/lina-component-scaffold-validation.json`
  - `.kiro/hooks/lina-platform-parity-check.json`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/060-custom-agent-system/completion/task-4-lina-parent-completion.md`
  - Summary: `docs/specs/060-custom-agent-system/task-4-lina-summary.md` (triggers release detection)

  **Post-Completion:**
  - Run validation: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 (Lina) Complete: Create Lina User-Triggered Hooks"`
  - Verify: Check GitHub for committed changes

  - [ ] 4.1 Create Stemma Compliance Check hook
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create hook JSON following design document specification
    - Hook validates behavioral contracts, inheritance patterns, and schema requirements
    - Verify hook appears in Kiro hook UI
    - Test hook execution produces meaningful output
    - _Requirements: 9_

  - [ ] 4.2 Create Component Token Audit hook
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create hook JSON following design document specification
    - Hook checks for hard-coded values and verifies token governance compliance
    - Verify hook appears in Kiro hook UI
    - Test hook execution produces meaningful output
    - _Requirements: 9_

  - [ ] 4.3 Create Component Scaffold Validation hook
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create hook JSON following design document specification
    - Hook verifies component structure completeness (types.ts, platforms, tests, README)
    - Hook verifies Component-Family doc exists for each family, drafts one from template if missing
    - Verify hook appears in Kiro hook UI
    - Test hook execution produces meaningful output
    - _Requirements: 9_

  - [ ] 4.4 Create Platform Parity Check hook
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create hook JSON following design document specification
    - Hook compares platform implementations across web/iOS/Android
    - Verify hook appears in Kiro hook UI
    - Test hook execution detects when platform implementations are missing or out of sync
    - _Requirements: 9_

- [ ] 5. Checkpoint — Validate Lina End-to-End
  - Ensure all tests pass (`npm test`)
  - Verify Lina loads correctly via `/agent swap` and `ctrl+shift+l`
  - Verify all four hooks appear and are triggerable
  - Verify write scoping works correctly for both Ada and Lina
  - Ask the user if questions arise
