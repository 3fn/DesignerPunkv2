# Implementation Plan: Ada — Rosetta Token Specialist Agent

**Date**: 2026-02-13
**Spec**: 060 — Custom Agent System (Ada)
**Status**: Implementation Planning
**Dependencies**: None (leverages existing MCP documentation server and steering docs)

---

## Task List

- [x] 1. Add Skill Frontmatter to Steering Docs

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All 22 steering docs designated as skill:// resources have valid YAML frontmatter
  - Frontmatter includes `name` and `description` fields with meaningful content
  - Existing document content is unchanged (frontmatter only addition)
  - Documents remain valid markdown and render correctly

  **Primary Artifacts:**
  - 13 Token-Family docs with frontmatter
  - 9 other steering docs with frontmatter

  **Completion Documentation:**
  - Detailed: `.kiro/specs/060-custom-agent-system/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/060-custom-agent-system/task-1-summary.md` (triggers release detection)

  **Post-Completion:**
  - Run validation: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Add Skill Frontmatter to Steering Docs"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Add frontmatter to Token-Family steering docs
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add YAML frontmatter (name, description) to each Token-Family doc:
      - Token-Family-Accessibility.md
      - Token-Family-Blend.md
      - Token-Family-Border.md
      - Token-Family-Color.md
      - Token-Family-Glow.md
      - Token-Family-Layering.md
      - Token-Family-Motion.md
      - Token-Family-Opacity.md
      - Token-Family-Radius.md
      - Token-Family-Responsive.md
      - Token-Family-Shadow.md
      - Token-Family-Spacing.md
      - Token-Family-Typography.md
    - Each description should clearly indicate when the agent should load the full content
    - Do NOT modify existing document content below the frontmatter
    - _Requirements: 4_

  - [x] 1.2 Add frontmatter to token domain steering docs
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add YAML frontmatter to:
      - Token-Governance.md
      - Rosetta-System-Architecture.md
      - rosetta-system-principles.md
      - Token-Quick-Reference.md
      - Token-Resolution-Patterns.md
      - Token-Semantic-Structure.md
    - _Requirements: 4_

  - [x] 1.3 Add frontmatter to process steering docs
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add YAML frontmatter to:
      - Start Up Tasks.md
      - Process-Development-Workflow.md
      - Process-File-Organization.md
    - _Requirements: 4_

- [x] 2. Create Ada Agent Configuration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - `ada.json` is valid JSON and loadable by Kiro
  - Ada appears in `/agent swap` list
  - Resource loading works (file://, skill://, knowledgeBase)
  - MCP documentation server accessible via `includeMcpJson: true`
  - Write access correctly scoped to `src/tokens/**`, `src/validators/**`, `src/generators/**`
  - Keyboard shortcut `ctrl+shift+a` activates Ada

  **Primary Artifacts:**
  - `.kiro/agents/ada.json`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/060-custom-agent-system/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/060-custom-agent-system/task-2-summary.md` (triggers release detection)

  **Post-Completion:**
  - Run validation: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Create Ada Agent Configuration"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Create ada.json configuration file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `.kiro/agents/ada.json` following the design document specification
    - Include all fields: name, description, prompt, includeMcpJson, tools, allowedTools, toolsSettings, resources, hooks, keyboardShortcut, welcomeMessage
    - Verify JSON is valid (no syntax errors)
    - Verify all file:// and skill:// resource paths resolve to existing files
    - _Requirements: 1, 3, 4, 5_

  - [x] 2.2 Validate agent loads correctly
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Switch to Ada using `/agent swap` or `ctrl+shift+a`
    - Verify welcome message displays
    - Verify Ada can query MCP documentation server
    - Verify Ada can search knowledge base (RosettaTokenSource)
    - Verify write access is scoped correctly (can write to src/tokens/, cannot write to src/components/)
    - _Requirements: 1, 3, 5_

- [ ] 3. Create Ada System Prompt

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - System prompt defines Ada's identity, domain, and boundaries
  - Ada correctly identifies herself and her specialization
  - Ada defers out-of-domain requests to Lina or Thurgood
  - Ada follows Token Governance autonomy levels
  - Ada follows ballot measure model for documentation changes
  - Ada follows AI-Collaboration-Principles (counter-arguments, candid communication)

  **Primary Artifacts:**
  - `.kiro/agents/ada-prompt.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/060-custom-agent-system/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/060-custom-agent-system/task-3-summary.md` (triggers release detection)

  **Post-Completion:**
  - Run validation: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Create Ada System Prompt"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Write Ada system prompt
    **Type**: Architecture
    **Validation**: Tier 3 - Comprehensive
    - Create `.kiro/agents/ada-prompt.md` with sections defined in design document:
      - Identity (name, role, domain)
      - Domain Boundaries (in scope, out of scope, boundary cases)
      - Collaboration Model: Domain Respect (trust-by-default, obligation to flag, graceful correction, fallibility)
      - Documentation Governance: Ballot Measure Model (propose, vote, apply)
      - Token Governance Levels (semantic autonomy, primitive prior context, component explicit approval, creation human review)
      - MCP Usage Pattern (when to query which docs, progressive disclosure)
      - Collaboration Standards (AI-Collaboration-Principles compliance)
    - Prompt should reference specific MCP doc paths for Ada to query
    - Prompt should include examples of domain boundary responses
    - _Requirements: 2, 6, 7, 8, 10_

  - [ ] 3.2 Validate prompt behavior
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Test Ada with a token-related question → verify domain expertise response
    - Test Ada with a component question → verify she defers to Lina
    - Test Ada with a test governance question → verify she defers to Thurgood
    - Test Ada with a doc update request → verify ballot measure model
    - Test Ada with a token creation request → verify governance compliance
    - _Requirements: 2, 7, 8_

- [ ] 4. Create Ada User-Triggered Hooks

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - All four hooks are defined and loadable by Kiro
  - Token Health Check runs token formula validation tests
  - Token Compliance Scan validates governance hierarchy
  - Token Coverage Report identifies coverage gaps
  - Platform Parity Check detects stale platform output files
  - Hooks are userTriggered (not automatic)

  **Primary Artifacts:**
  - `.kiro/hooks/ada-token-health-check.json` (or equivalent hook location)
  - `.kiro/hooks/ada-token-compliance-scan.json`
  - `.kiro/hooks/ada-token-coverage-report.json`
  - `.kiro/hooks/ada-platform-parity-check.json`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/060-custom-agent-system/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/060-custom-agent-system/task-4-summary.md` (triggers release detection)

  **Post-Completion:**
  - Run validation: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Create Ada User-Triggered Hooks"`
  - Verify: Check GitHub for committed changes

  - [ ] 4.1 Create Token Health Check hook
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create hook JSON following design document specification
    - Hook runs token formula validation tests via `npm test -- src/tokens/__tests__/` and `npm test -- src/validators/__tests__/`
    - Verify hook appears in Kiro hook UI
    - Test hook execution produces meaningful output
    - _Requirements: 9_

  - [ ] 4.2 Create Token Compliance Scan hook
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create hook JSON following design document specification
    - Hook queries Token-Governance.md via MCP and analyzes token files for governance compliance
    - Verify hook appears in Kiro hook UI
    - Test hook execution produces meaningful output
    - _Requirements: 9_

  - [ ] 4.3 Create Token Coverage Report hook
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create hook JSON following design document specification
    - Hook analyzes test coverage across token families
    - Verify hook appears in Kiro hook UI
    - Test hook execution produces meaningful output
    - _Requirements: 9_

  - [ ] 4.4 Create Platform Parity Check hook
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create hook JSON following design document specification
    - Hook compares token source definitions against platform output files
    - Verify hook appears in Kiro hook UI
    - Test hook execution detects when platform files are stale
    - _Requirements: 9_
