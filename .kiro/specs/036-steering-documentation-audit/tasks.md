# Implementation Plan: Steering Documentation Audit

**Date**: 2026-01-03
**Spec**: 036 - Steering Documentation Audit
**Status**: Execution Ready
**Dependencies**: None

---

## Overview

This implementation plan follows a three-phase audit methodology with Human-Agent checkpoints. Phases 1-3 (Discovery, Analysis, Implementation Planning) are complete. Phase 4 (Execution) is ready to begin.

**Checkpoint 3 Approved**: 2026-01-03
**Execution Tasks**: 13 parent tasks (Tasks 10-22), 18 batches total
**Estimated Timeline**: 10-15 sessions

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

- [x] 9. **CHECKPOINT 3: Present Implementation Plan**
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: Human has reviewed task list and approved execution
  
  - Present detailed execution task list
  - Present batch plan, rollback strategy, validation criteria
  - **STOP and wait for human review and approval**
  - Incorporate any feedback before proceeding
  - _Requirements: 9.3, 9.4, 9.5_

---

### Phase 4: Execution

**Note**: Execution tasks defined after Checkpoint 3 approval (2026-01-03). See `audit-artifacts/execution-task-list.md` for detailed task breakdown.

- [x] 10. Batch 0: Rosetta System Content Analysis
  **Type**: Documentation
  **Validation**: Tier 1 - Minimal
  **Success Criteria**: All 14 token docs analyzed, infrastructure vs family classification finalized
  
  - [x] 10.1 Analyze semantic-token-structure.md content
  - [x] 10.2 Analyze 13 remaining token docs for infrastructure content
  - [x] 10.3 Document findings: infrastructure vs family content split
  - [x] 10.4 Determine if rosetta-system-principles.md needed
  - [x] 10.5 Update Edge Case 4 classification decision
  - _Requirements: 5.7, 5.8_

- [x] 11. Batch 1: New Document Creation
  **Type**: Documentation
  **Validation**: Tier 1 - Minimal
  **Success Criteria**: New documents created with proper metadata, MCP indexes them
  
  - [x] 11.1 Create Completion Documentation Guide.md
  - [x] 11.2 Create Process-Cross-Reference-Standards.md
  - [x] 11.3 Create rosetta-system-principles.md (PROCEED - human decision for architectural symmetry)
    - Create foundational principles document for Rosetta System (token architecture)
    - Parallel to stemma-system-principles.md for components
    - Content: primitive→semantic philosophy, mathematical foundations, cross-token relationships, naming conventions
  - _Requirements: 3.3, 3.7_

- [x] 12. Batch 2: Development Workflow Slimming
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: ~1,980 tokens removed, priming + MCP query directions work
  
  - [x] 12.1 Replace Release Detection detailed content with priming + MCP query
  - [x] 12.2 Replace File Organization detailed content with priming + MCP query
  - [x] 12.3 Replace Completion Documentation content with priming + MCP query
  - [x] 12.4 Update AI Agent Reading Priorities section
  - [x] 12.5 Validate all MCP query directions work
  - _Requirements: 3.3, 3.4, 3.7_

- [x] 13. Batch 3: File Organization Standards Slimming
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: ~6,120 tokens removed, cross-reference content accessible via MCP
  
  - [x] 13.1 Move Cross-Reference Standards section to Process-Cross-Reference-Standards.md
  - [x] 13.2 Move Anti-Patterns section to Process-Cross-Reference-Standards.md
  - [x] 13.3 Move completion doc naming/organization to Completion Documentation Guide.md
  - [x] 13.4 Add priming + MCP query directions for moved content (verified - already done in 13.1-13.3)
  - [x] 13.5 Update AI Agent Reading Priorities section
  - _Requirements: 3.3, 3.4, 3.7_

- [x] 14. Batch 4: Release Management System Expansion
  **Type**: Documentation
  **Validation**: Tier 1 - Minimal
  **Success Criteria**: Operational content added, document structure logical
  
  - [x] 14.1 Add Agent Hook Dependency Chains section
  - [x] 14.2 Add Hook Troubleshooting section
  - [x] 14.3 Add Manual Trigger Commands section
  - [x] 14.4 Update document structure and navigation
  - _Requirements: 3.3, 3.7_

- [x] 15. Batch 5-6: Validation Tiers and Tier Naming
  **Type**: Documentation
  **Validation**: Tier 1 - Minimal
  **Success Criteria**: Single source of truth for validation tiers, no naming collision
  
  - [x] 15.1 Verify Task-Type-Definitions.md has complete tier definitions
  - [x] 15.2 Replace Spec Planning Standards tier definitions with priming + MCP query
  - [x] 15.3 Rename behavioral contract tiers (Basic/Extended/Full Contract Validation)
  - [x] 15.4 Update any cross-references to validation tiers
  - _Requirements: 3.3, 3.4_

- [x] 16. Batch 7: Start Up Tasks Update
  **Type**: Documentation
  **Validation**: Tier 1 - Minimal
  **Success Criteria**: MCP query reminder added for Completion Documentation Guide
  
  - [x] 16.1 Add checklist item for querying Completion Documentation Guide via MCP
  - _Requirements: 4.3_

- [ ] 17. Batch 8-9: Legacy Naming Fixes
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: All 39 legacy naming instances fixed, zero legacy naming
  
  - [ ] 17.1 Fix legacy naming in low-risk documents (10 instances in 6 docs)
  - [ ] 17.2 Fix legacy naming in medium-risk documents (30 instances in 3 docs)
  - [ ] 17.3 Verify zero legacy naming instances via grep
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8_

- [ ] 18. Batch 10-12: Low-Risk Prefix Renames
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: 27-28 docs renamed, MCP indexes new names, cross-references updated
  
  - [ ] 18.1 Apply Token-Family- prefix (13-14 docs)
  - [ ] 18.2 Apply Component-Family- prefix (11 docs)
  - [ ] 18.3 Apply Token- prefix (2-3 docs)
  - [ ] 18.4 Update all cross-references to renamed files
  - [ ] 18.5 Re-index MCP server and validate
  - _Requirements: 5.3, 5.4, 5.5, 6.1, 6.2, 6.6_

- [ ] 19. Batch 13-14: Medium-Risk Prefix Renames
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: 12 docs renamed, MCP indexes new names, cross-references updated
  
  - [ ] 19.1 Apply Component- prefix (9 docs)
  - [ ] 19.2 Apply Test- prefix (3 docs)
  - [ ] 19.3 Update all cross-references to renamed files
  - [ ] 19.4 Re-index MCP server and validate
  - _Requirements: 5.3, 5.4, 5.5, 6.1, 6.2, 6.6_

- [ ] 20. Batch 15: High-Risk Prefix Renames (Process-)
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: 4 always-loaded docs renamed, session start works correctly
  
  - [ ] 20.1 Create backup branch before execution
  - [ ] 20.2 Apply Process- prefix (4 docs including 2 always-loaded)
  - [ ] 20.3 Update meta-guide references
  - [ ] 20.4 Update all cross-references to renamed files
  - [ ] 20.5 Re-index MCP server and validate
  - [ ] 20.6 Test session start behavior
  - _Requirements: 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.6_

- [ ] 21. Batch 16: Meta-Guide Updates
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: All file references updated, MCP query examples work
  
  - [ ] 21.1 Update Tier 1 document references with new names
  - [ ] 21.2 Update Tier 2 MCP query examples with new paths
  - [ ] 21.3 Add Completion Documentation Guide to Tier 2
  - [ ] 21.4 Add Process-Cross-Reference-Standards.md to Tier 2
  - [ ] 21.5 Validate all MCP query directions work
  - _Requirements: 6.3, 6.4, 6.6_

- [ ] 22. Batch 17: Final Validation
  **Type**: Documentation
  **Validation**: Tier 2 - Standard
  **Success Criteria**: MCP index healthy, all 55+ docs indexed, zero legacy naming, all cross-references valid
  
  - [ ] 22.1 Verify MCP index health
  - [ ] 22.2 Verify all documents indexed
  - [ ] 22.3 Verify zero legacy naming instances
  - [ ] 22.4 Verify all cross-references resolve
  - [ ] 22.5 Verify session start load reduced (~11,000 tokens saved)
  - [ ] 22.6 Document final token counts and savings
  - _Requirements: 1.8, 2.4, 6.5, 6.6_

---

## Completion Documentation

**Detailed completion docs**: `.kiro/specs/036-steering-documentation-audit/completion/`
**Summary docs**: `docs/specs/036-steering-documentation-audit/`

---

## Notes

- All tasks in this spec are Documentation type - no code is produced
- Meta-guide must be accessed via bash commands only (Requirement 7)
- Phase 4 execution tasks defined after Checkpoint 3 approval (2026-01-03)
- Human-Agent checkpoints are mandatory pause points - do not proceed without explicit approval
- See `audit-artifacts/` for detailed execution task list, batch plan, rollback strategy, and validation criteria
- High-risk batches (12, 13, 20, 21) require backup branches before execution
- MCP re-indexing required after each rename batch

