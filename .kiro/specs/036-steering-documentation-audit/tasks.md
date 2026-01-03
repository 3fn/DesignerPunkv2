# Implementation Plan: Steering Documentation Audit

**Date**: 2026-01-03
**Spec**: 036 - Steering Documentation Audit
**Status**: Implementation Planning
**Dependencies**: None

---

## Overview

This implementation plan follows a three-phase audit methodology with Human-Agent checkpoints. Execution tasks (Phase 4+) are placeholders that will be defined after Checkpoint 3 approval based on audit findings.

**Task Type Note**: All tasks in this spec are Documentation type (no code produced), so validation follows documentation-appropriate patterns rather than code testing.

---

## Task List

### Phase 1: Discovery

- [x] 1. Discovery Phase Setup and Token Audit
  **Type**: Setup
  **Validation**: Tier 1 - Minimal
  **Success Criteria**: Audit artifact directory created, token tracking document populated with all 55 doc counts
  
  - [x] 1.1 Create audit artifacts directory structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `.kiro/specs/036-steering-documentation-audit/audit-artifacts/` directory
    - Create placeholder files for: `token-tracking.md`, `legacy-naming-report.md`, `redundancy-analysis.md`, `category-analysis.md`
    - _Requirements: 2.1, 2.2_
  
  - [x] 1.2 Calculate token counts for Layer 0-1 documents (5 docs)
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Use MCP `get_document_summary()` to get token counts
    - For meta-guide: use bash commands only (grep for token info or estimate)
    - Record in token-tracking.md
    - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.2, 7.3_
  
  - [x] 1.3 Calculate token counts for Layer 2 documents (6 docs)
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Use MCP `get_document_summary()` to get token counts
    - Record in token-tracking.md
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 1.4 Calculate token counts for Token documentation (14 docs)
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Use MCP `get_document_summary()` to get token counts
    - Record in token-tracking.md
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 1.5 Calculate token counts for Component documentation (18 docs)
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Use MCP `get_document_summary()` to get token counts
    - Record in token-tracking.md
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 1.6 Calculate token counts for remaining documents (~12 docs)
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Use MCP `get_document_summary()` to get token counts
    - Record in token-tracking.md
    - Calculate total and session start load percentage
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2. Legacy Naming Audit
  **Type**: Documentation
  **Validation**: Tier 1 - Minimal
  **Success Criteria**: All legacy naming instances identified and documented in legacy-naming-report.md
  
  - [x] 2.1 Scan for `<dp-icon>` and `<dp-container>` patterns
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Use grep to find all instances in `.kiro/steering/`
    - Document file, line number, and context in legacy-naming-report.md
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [x] 2.2 Scan for `TextInputField` and `DPIcon` patterns
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Use grep to find all instances in `.kiro/steering/`
    - Document file, line number, and context in legacy-naming-report.md
    - _Requirements: 1.1, 1.2, 1.5, 1.7_
  
  - [x] 2.3 Scan for "Legacy Icon" and related phrases
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Use grep to find all instances in `.kiro/steering/`
    - Document file, line number, and context in legacy-naming-report.md
    - _Requirements: 1.1, 1.2, 1.6_

- [x] 3. Redundancy Analysis
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: Redundant content identified and classified as harmful or intentional priming
  
  - [x] 3.1 Identify cross-document content overlap
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Use MCP `list_cross_references()` on key documents
    - Identify topics that appear in multiple documents
    - Document in redundancy-analysis.md
    - _Requirements: 3.1, 3.2_
  
  - [x] 3.2 Classify redundancy as harmful or priming
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - For each redundant topic, assess: Is this detailed duplication or light priming?
    - Apply priming guidelines: purpose-based (what/why vs how) + ~3-4 sentences max
    - Document classification and rationale in redundancy-analysis.md
    - _Requirements: 3.2, 3.3, 3.4_

- [x] 4. Category Analysis
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: Document families identified, prefix candidates proposed
  
  - [x] 4.1 Identify document families (3+ related docs)
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Group documents by topic/purpose
    - Identify families with 3+ members
    - Document in category-analysis.md
    - _Requirements: 5.3, 5.4_
  
  - [x] 4.2 Identify standalone documents
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - List documents that don't belong to a family
    - Document rationale for standalone status
    - _Requirements: 5.6_
  
  - [x] 4.3 Identify edge cases requiring human decision
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - List documents with unclear categorization
    - Document possible categories and recommendation
    - _Requirements: 5.7, 5.8_

- [x] 5. **CHECKPOINT 1: Present Discovery Findings**
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: Human has reviewed all audit artifacts and provided approval to proceed
  
  - Compile summary of findings from all audit artifacts
  - Present token counts, legacy naming instances, redundancy classification, and category analysis
  - **STOP and wait for human review and approval**
  - _Requirements: 9.1, 9.4_

---

### Phase 2: Analysis

- [x] 6. Analysis Phase
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: Prioritized recommendations ready for human review
  
  - [x] 6.1 Prioritize documents by impact
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Calculate impact score: token count × load frequency
    - Rank documents by optimization potential
    - Document in analysis section of audit artifacts
    - _Requirements: 2.5_
  
  - [x] 6.2 Propose consolidation targets
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - For harmful redundancy, propose canonical sources
    - For priming opportunities, propose MCP query directions
    - Document proposals (pending human approval)
    - _Requirements: 3.3, 3.7_
  
  - [x] 6.3 Propose category prefixes
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - For each identified family, propose prefix
    - Define prefix purpose and scope
    - Document proposals (pending human approval)
    - _Requirements: 5.3, 5.4, 5.5_
  
  - [x] 6.4 Identify file split candidates
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - For large documents, evaluate split potential
    - Consider conditional loading sections, MCP query precision, maintenance burden
    - Document candidates (pending human approval)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 7. **CHECKPOINT 2: Present Analysis Recommendations**
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: Human has reviewed recommendations and approved approach
  
  - Compile prioritized recommendations
  - Present consolidation proposals, prefix proposals, split candidates
  - **STOP and wait for human review and approval**
  - Incorporate any feedback before proceeding
  - _Requirements: 9.2, 9.4, 9.5_

---

### Phase 3: Implementation Planning

- [x] 8. Implementation Planning Phase
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: Detailed execution task list ready for human review
  
  - [x] 8.1 Create detailed execution task list
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Based on approved recommendations, create specific tasks
    - Group tasks into batches
    - Define task dependencies
    - _Requirements: 8.1, 8.2_
  
  - [x] 8.2 Define batch execution plan
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Assign documents to batches based on token counts
    - Define batch order and dependencies
    - _Requirements: 8.2, 8.3_
  
  - [x] 8.3 Define rollback strategy
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Document git-based rollback approach
    - Document MCP re-index procedure
    - Document reference validation steps
  
  - [x] 8.4 Define validation criteria
    **Type**: Documentation
    **Validation**: Tier 1 - Minimal
    - Define success criteria for each batch
    - Define MCP health checks
    - Define reference integrity checks

- [ ] 9. **CHECKPOINT 3: Present Implementation Plan**
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: Human has reviewed task list and approved execution
  
  - Present detailed execution task list
  - Present batch plan, rollback strategy, validation criteria
  - **STOP and wait for human review and approval**
  - Incorporate any feedback before proceeding
  - _Requirements: 9.3, 9.4, 9.5_

---

### Phase 4: Execution (Placeholder)

**Note**: Execution tasks will be defined after Checkpoint 3 approval based on audit findings and approved recommendations.

- [ ] 10. Execution Batch 1: [TBD]
  **Type**: [TBD]
  **Validation**: [TBD]
  **Success Criteria**: [TBD based on approved recommendations]
  
  - Tasks to be defined after Checkpoint 3

- [ ] 11. Execution Batch 2: [TBD]
  **Type**: [TBD]
  **Validation**: [TBD]
  **Success Criteria**: [TBD based on approved recommendations]
  
  - Tasks to be defined after Checkpoint 3

- [ ] 12. Execution Batch N: [TBD]
  **Type**: [TBD]
  **Validation**: [TBD]
  **Success Criteria**: [TBD based on approved recommendations]
  
  - Tasks to be defined after Checkpoint 3

- [ ] 13. Reference Updates and Final Validation
  **Type**: [TBD]
  **Validation**: [TBD]
  **Success Criteria**: All references updated, MCP index healthy, zero legacy naming
  
  - Update all hard references (markdown links)
  - Update all soft references (prose mentions)
  - Validate MCP index health
  - Verify zero legacy naming instances
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 1.8_

---

## Completion Documentation

**Detailed completion docs**: `.kiro/specs/036-steering-documentation-audit/completion/`
**Summary docs**: `docs/specs/036-steering-documentation-audit/`

---

## Notes

- All tasks in this spec are Documentation type - no code is produced
- Meta-guide must be accessed via bash commands only (Requirement 7)
- Execution tasks (Phase 4) are placeholders until Checkpoint 3 approval
- Human-Agent checkpoints are mandatory pause points - do not proceed without explicit approval

