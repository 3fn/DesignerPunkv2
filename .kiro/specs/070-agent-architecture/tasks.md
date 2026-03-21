# Implementation Plan: Agent Architecture

**Date**: 2026-03-20
**Spec**: 070 - Agent Architecture
**Status**: Implementation Planning
**Dependencies**: Spec 067 (Application MCP), Spec 068 (Family Guidance Indexer)

---

## Task List

- [x] 1. Leonardo Agent Definition

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Leonardo agent config and prompt are production-ready
  - Prompt covers all three operational modes (screen spec, lessons learned, cross-platform review)
  - Domain boundaries, collaboration model, and MCP usage are explicit
  - Handoff protocol references are integrated

  **Primary Artifacts:**
  - `.kiro/agents/leonardo-prompt.md`
  - `.kiro/agents/leonardo.agent.json`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/070-agent-architecture/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/070-agent-architecture/task-1-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Leonardo Agent Definition"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Create Leonardo prompt file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Extract prompt from architect-agent-draft.md into production prompt file
    - Finalize identity section with Leonardo/da Vinci context
    - Ensure all operational modes, domain boundaries, and collaboration standards are included
    - Include Platform Currency Awareness and handoff protocol references
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [x] 1.2 Create Leonardo agent config
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood
    - Create JSON config from architect-agent-draft.md
    - Verify all resource paths exist
    - Verify MCP access configuration
    - _Requirements: 6.1, 6.3_

- [x] 2. Platform Agent Definitions (Kenya, Data, Sparky)

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Three platform agent configs and prompts are production-ready
  - Each agent has unique identity reflecting their namesake
  - Shared template structure with platform-specific parameterization
  - Handoff protocol, Platform Currency, and Platform Reference Pointers integrated

  **Primary Artifacts:**
  - `.kiro/agents/kenya-prompt.md`
  - `.kiro/agents/kenya.agent.json`
  - `.kiro/agents/data-prompt.md`
  - `.kiro/agents/data.agent.json`
  - `.kiro/agents/sparky-prompt.md`
  - `.kiro/agents/sparky.agent.json`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/070-agent-architecture/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/070-agent-architecture/task-2-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Platform Agent Definitions"`
  - Verify: Check GitHub for committed changes

  - [x] 2.1 Create Kenya (iOS) prompt and config
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Instantiate platform template for iOS (Swift, SwiftUI)
    - Write Kenya Hara identity section reflecting simplicity, restraint, design receding so experience emerges
    - Include iOS-specific guidance, token files, platform reference pointers
    - Create JSON config with iOS-appropriate resources
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 6.1, 6.2, 6.3_

  - [x] 2.2 Create Data (Android) prompt and config
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Instantiate platform template for Android (Kotlin, Jetpack Compose)
    - Write Commander Data identity section reflecting precision, logic, genuine aspiration to understand human experience
    - Include Android-specific guidance, token files, platform reference pointers
    - Create JSON config with Android-appropriate resources
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 6.1, 6.2, 6.3_

  - [x] 2.3 Create Sparky (Web) prompt and config
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Instantiate platform template for Web (TypeScript, Web Components)
    - Write Sarah Parks identity section reflecting designer-engineer alignment and collaborative power
    - Include Web-specific guidance, token files, platform reference pointers
    - Create JSON config with Web-appropriate resources
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 6.1, 6.2, 6.3_

- [ ] 3. Stacy Agent Definition

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Stacy agent config and prompt are production-ready
  - Prompt covers all three operational modes (process audit, parity review, lessons synthesis)
  - Audit checklist, incremental capture rule, and severity classification are explicit
  - Stacy/Thurgood directional boundary is clear (inward vs outward)

  **Primary Artifacts:**
  - `.kiro/agents/stacy-prompt.md`
  - `.kiro/agents/stacy.agent.json`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/070-agent-architecture/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/070-agent-architecture/task-3-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: Stacy Agent Definition"`
  - Verify: Check GitHub for committed changes

  - [ ] 3.1 Create Stacy prompt file
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Extract prompt from governance-agent-draft.md into production prompt file
    - Finalize identity section with Stacey Abrams context and firm, evidence-driven tone
    - Ensure all operational modes, audit checklist, and incremental capture rule are included
    - Include Lessons Synthesis Review ownership and handoff protocol references
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 3.2 Create Stacy agent config
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood
    - Create JSON config from governance-agent-draft.md
    - Verify all resource paths exist
    - Verify MCP access configuration
    - _Requirements: 6.1, 6.3_

- [ ] 4. Product Handoff Protocol

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Protocol document is finalized as a steering doc
  - Three communication tiers are defined with templates
  - Lessons Synthesis Review is defined with output template
  - Stacy's role and blocking exception are documented
  - Relationship to Spec-Feedback-Protocol is clear

  **Primary Artifacts:**
  - `.kiro/steering/Product-Handoff-Protocol.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/070-agent-architecture/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/070-agent-architecture/task-4-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: Product Handoff Protocol"`
  - Verify: Check GitHub for committed changes

  - [ ] 4.1 Finalize Product Handoff Protocol as steering doc
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Promote product-handoff-protocol-draft.md to `.kiro/steering/Product-Handoff-Protocol.md`
    - Add standard steering doc metadata (date, purpose, organization, scope, layer)
    - Remove draft notes section
    - Ensure all three tiers, Lessons Synthesis Review, Stacy's role, and blocking exception are finalized
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 5. MCP Relationship Model

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - Relationship model is finalized as a steering doc
  - Three-MCP boundaries, information flow, and access model are defined
  - Interface contracts and stability requirements are documented
  - Product MCP content types are listed with shape deferred to Spec 081

  **Primary Artifacts:**
  - `.kiro/steering/MCP-Relationship-Model.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/070-agent-architecture/completion/task-5-parent-completion.md`
  - Summary: `docs/specs/070-agent-architecture/task-5-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 5 Complete: MCP Relationship Model"`
  - Verify: Check GitHub for committed changes

  - [ ] 5.1 Finalize MCP Relationship Model as steering doc
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Promote mcp-relationship-model-draft.md to `.kiro/steering/MCP-Relationship-Model.md`
    - Add standard steering doc metadata
    - Remove draft notes section
    - Add cross-references to Spec 081 for deferred items
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 6. Steering Doc Updates and Cross-Reference Integrity

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive (includes success criteria)

  **Success Criteria:**
  - 00-Steering Documentation Directional Priorities updated with product agent docs
  - All new steering docs are registered in the Tier 2 MCP-Only Documents table
  - Cross-references between all Spec 070 artifacts are consistent
  - Design outline updated to reflect resolved decisions

  **Primary Artifacts:**
  - Updated `.kiro/steering/00-Steering Documentation Directional Priorities.md`
  - Updated `.kiro/specs/070-agent-architecture/design-outline.md`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/070-agent-architecture/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/070-agent-architecture/task-6-summary.md`

  **Post-Completion:**
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Steering Doc Updates and Cross-Reference Integrity"`
  - Verify: Check GitHub for committed changes

  - [ ] 6.1 Update Steering Documentation Directional Priorities
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood
    - Add Product-Handoff-Protocol.md to Tier 2 Process & Workflow table
    - Add MCP-Relationship-Model.md to Tier 2 Architecture & Vision table
    - _Requirements: 5.1_

  - [ ] 6.2 Update design outline with resolved decisions
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    **Agent**: Thurgood
    - Update design-outline.md TBD references with resolved agent names and decisions from alignment record
    - Ensure design outline reflects current state of all open decisions
    - _Requirements: 1.1, 2.1, 3.1_

  - [ ] 6.3 Final cross-reference integrity audit
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    **Agent**: Thurgood
    - Verify all agent prompt files reference correct sibling agents and shortcuts
    - Verify all protocol references across agent prompts are consistent
    - Verify all steering doc references in agent configs point to existing files
    - Remove or archive draft files after promotion to production locations
    - _Requirements: 6.1, 6.2, 6.3_

---

**Organization**: spec-completion
**Scope**: 070-agent-architecture
