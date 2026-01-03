# Requirements Document: Steering Documentation Audit

**Date**: 2026-01-03
**Spec**: 036 - Steering Documentation Audit
**Status**: Requirements Phase
**Dependencies**: None

---

## Introduction

The steering documentation has grown organically as DesignerPunk evolved, resulting in legacy naming references, high token load, content redundancy, and buried testing standards. This spec defines requirements for a comprehensive audit to align documentation with the Stemma System, optimize context load, eliminate redundancy, and improve testing standards integration.

---

## Glossary

- **Steering_Documentation**: The collection of markdown files in `.kiro/steering/` that guide AI agent behavior
- **Stemma_System**: The current component naming architecture (e.g., `Icon-Base`, `Container-Base`)
- **Legacy_Naming**: Deprecated naming patterns (e.g., `<dp-icon>`, `TextInputField`, "Legacy Icon")
- **Token_Load**: The context usage when steering docs are loaded into AI agent sessions
- **MCP_Server**: The Model Context Protocol server that indexes and serves steering documentation
- **Categorical_Prefix**: A naming prefix that groups related documents (e.g., `Token-`, `Component-Family-`)
- **Hard_Reference**: A markdown link to another document (e.g., `[text](path)`)
- **Soft_Reference**: A prose mention of another document (e.g., "refer to Development Workflow")
- **Human_Agent_Checkpoint**: A defined point where the AI agent pauses for human review before proceeding

---

## Requirements

### Requirement 1: Stemma Alignment

**User Story**: As an AI agent, I want steering documentation to use consistent Stemma System naming, so that I don't encounter conflicting guidance about component names.

#### Acceptance Criteria

1. WHEN the Audit_Agent scans steering documentation THEN the Audit_Agent SHALL identify all Legacy_Naming instances
2. WHEN Legacy_Naming is found THEN the Audit_Agent SHALL replace it with the corresponding Stemma_System equivalent
3. WHEN `<dp-icon>` is found THEN the Audit_Agent SHALL replace it with `<icon-base>`
4. WHEN `<dp-container>` is found THEN the Audit_Agent SHALL replace it with `<container-base>`
5. WHEN `TextInputField` is found THEN the Audit_Agent SHALL replace it with `Input-Text-Base`
6. WHEN "Legacy Icon" references are found THEN the Audit_Agent SHALL remove them or replace with Stemma equivalents
7. WHEN `DPIcon` class references are found THEN the Audit_Agent SHALL replace them with `IconBaseElement`
8. WHEN all Legacy_Naming has been addressed THEN the Steering_Documentation SHALL contain zero legacy naming references

### Requirement 2: Token Optimization Discovery

**User Story**: As a human collaborator, I want to understand the current token load of steering documentation, so that I can make informed decisions about optimization.

#### Acceptance Criteria

1. WHEN the Audit_Agent audits Steering_Documentation THEN the Audit_Agent SHALL calculate token counts for all 55 documents
2. WHEN token counts are calculated THEN the Audit_Agent SHALL capture them in a separate tracking document only
3. WHEN token counts are captured THEN the Audit_Agent SHALL NOT add token metrics to the steering documents themselves
4. WHEN the audit is complete THEN the Audit_Agent SHALL report the current context load percentage at session start
5. WHEN optimization opportunities are identified THEN the Audit_Agent SHALL document them as candidates for evaluation
6. WHEN optimization decisions are needed THEN the Audit_Agent SHALL defer to Human_Agent_Checkpoint before implementation

### Requirement 3: Redundancy Identification

**User Story**: As an AI agent, I want each concept to have a single source of truth with intentional priming where helpful, so that I don't receive conflicting guidance from different documents.

#### Acceptance Criteria

1. WHEN the Audit_Agent audits Steering_Documentation THEN the Audit_Agent SHALL identify content that appears in multiple documents
2. WHEN redundant content is found THEN the Audit_Agent SHALL classify it as either harmful redundancy or intentional priming
3. WHEN harmful redundancy is found (detailed content duplicated, creating maintenance burden) THEN the Audit_Agent SHALL document which document should be the canonical source
4. WHEN intentional priming is found (light context that orients before directing to canonical source) THEN the Audit_Agent SHALL document it as acceptable
5. WHEN consolidation decisions are needed THEN the Audit_Agent SHALL defer to Human_Agent_Checkpoint before implementation
6. IF content exists in multiple places THEN the Audit_Agent SHALL NOT implement consolidation without human approval
7. WHEN priming is appropriate THEN the Audit_Agent MAY recommend adding explicit MCP query directions to the canonical source

#### Priming vs MCP Query Guidelines

**Purpose-based guideline (primary)**:
- **Priming** = Enough context to understand *what* and *why* to query, but not *how* to do the thing
- **MCP Query** = The actual detailed guidance on *how*

**Length guideline (suggestive)**:
- Priming should be ~3-4 sentences max before directing to MCP query
- If content exceeds this, it likely belongs in the canonical source with an MCP query direction

### Requirement 4: Testing Standards Integration

**User Story**: As an AI agent, I want testing guidance surfaced during the design phase, so that I can create better correctness properties and testing strategies.

#### Acceptance Criteria

1. WHEN a spec produces code (Implementation or Architecture tasks) THEN the Audit_Agent SHALL document that Test Development Standards should be queried at design phase
2. WHEN a spec produces only documentation (Setup or Documentation tasks) THEN the Audit_Agent SHALL document that Test Development Standards query is not required
3. WHEN the audit is complete THEN the Steering_Documentation SHALL include clear guidance on when to load Test Development Standards
4. WHEN testing integration changes are proposed THEN the Audit_Agent SHALL defer to Human_Agent_Checkpoint before implementation

### Requirement 5: Naming Convention Standardization

**User Story**: As a human collaborator, I want consistent file naming across steering documentation, so that files are easy to find and categorize.

#### Acceptance Criteria

1. WHEN the Audit_Agent renames files THEN the Audit_Agent SHALL use Kebab-Title-Case format
2. WHEN the meta-guide is renamed THEN the Audit_Agent SHALL preserve the `00-` numeric prefix for load order
3. WHEN the audit identifies document families (3+ related documents) THEN the Audit_Agent SHALL propose Categorical_Prefixes as candidates
4. WHEN proposing Categorical_Prefixes THEN the Audit_Agent SHALL define each prefix's purpose and scope
5. WHEN Categorical_Prefix decisions are needed THEN the Audit_Agent SHALL defer to Human_Agent_Checkpoint before implementation
6. WHEN a document is standalone (no family of 3+ related docs) THEN the Audit_Agent SHALL NOT apply a Categorical_Prefix
7. WHEN edge case categorization is unclear THEN the Audit_Agent SHALL defer to Human_Agent_Checkpoint
8. IF the Audit_Agent proposes specific prefixes THEN the Audit_Agent SHALL present them as candidates, not decisions

**Candidate Prefixes to Evaluate** (decisions deferred to audit findings):
- `Token-` - For token documentation family
- `Component-Family-` - For component family specifications
- `Component-` - For component infrastructure documentation
- `Process-` - For workflow and methodology documentation
- `Standard-` - For rules and requirements documentation
- `Guide-` - For how-to and reference documentation

### Requirement 6: Reference Updates

**User Story**: As an AI agent, I want all references to renamed files to be updated, so that links and prose mentions remain accurate.

#### Acceptance Criteria

1. WHEN a file is renamed THEN the Audit_Agent SHALL update all Hard_References (markdown links) to that file
2. WHEN a file is renamed THEN the Audit_Agent SHALL update all Soft_References (prose mentions) to that file
3. WHEN updating references THEN the Audit_Agent SHALL update the meta-guide (`00-Steering-Documentation-Directional-Priorities.md`)
4. WHEN updating references THEN the Audit_Agent SHALL update active spec documents with references
5. WHEN historical context exists in completion documents THEN the Audit_Agent SHALL preserve the original naming (documents what existed at that time)
6. WHEN the MCP_Server re-indexes THEN the Audit_Agent SHALL verify the index reflects renamed files

### Requirement 7: Meta-Guide Access Constraint

**User Story**: As an AI agent, I want to avoid context pollution when auditing the meta-guide, so that I don't load the same content twice.

#### Acceptance Criteria

1. WHEN the Audit_Agent needs to review the meta-guide THEN the Audit_Agent SHALL use bash commands only
2. WHEN the Audit_Agent needs to edit the meta-guide THEN the Audit_Agent SHALL use bash commands only
3. WHEN the Audit_Agent audits the meta-guide THEN the Audit_Agent SHALL NOT use file read tools directly
4. IF the Audit_Agent uses file read tools on the meta-guide THEN the audit SHALL be considered non-compliant

### Requirement 8: Batched Audit Execution

**User Story**: As an AI agent, I want to audit documents in manageable batches, so that I don't hit context load caps during execution.

#### Acceptance Criteria

1. WHEN the Audit_Agent audits Steering_Documentation THEN the Audit_Agent SHALL process documents in batches
2. WHEN batch size is determined THEN the Audit_Agent SHALL consider document token counts to avoid context overload
3. WHEN a batch is complete THEN the Audit_Agent SHALL document findings before proceeding to the next batch
4. IF context load approaches limits THEN the Audit_Agent SHALL pause and report status to human collaborator

### Requirement 9: Human-Agent Checkpoints

**User Story**: As a human collaborator, I want defined checkpoints where I can review findings before the agent proceeds, so that I maintain control over audit decisions.

#### Acceptance Criteria

1. WHEN discovery phase is complete THEN the Audit_Agent SHALL pause at Checkpoint 1 for human review of findings
2. WHEN analysis phase is complete THEN the Audit_Agent SHALL pause at Checkpoint 2 for human review of recommendations
3. WHEN implementation planning is complete THEN the Audit_Agent SHALL pause at Checkpoint 3 for human review of task list
4. WHEN pausing at a checkpoint THEN the Audit_Agent SHALL NOT proceed until human provides explicit approval
5. IF human requests changes at a checkpoint THEN the Audit_Agent SHALL incorporate feedback before proceeding

### Requirement 10: File Structure Evaluation

**User Story**: As a human collaborator, I want to evaluate whether large documents should be split into smaller files, so that I can make informed decisions about file structure.

#### Acceptance Criteria

1. WHEN the Audit_Agent identifies large documents THEN the Audit_Agent SHALL evaluate them as candidates for splitting
2. WHEN evaluating split candidates THEN the Audit_Agent SHALL consider conditional loading sections
3. WHEN evaluating split candidates THEN the Audit_Agent SHALL consider MCP query precision benefits
4. WHEN evaluating split candidates THEN the Audit_Agent SHALL consider maintenance burden
5. WHEN split recommendations are made THEN the Audit_Agent SHALL defer to Human_Agent_Checkpoint before implementation
6. IF the Audit_Agent proposes specific splits THEN the Audit_Agent SHALL present them as candidates, not decisions

### Requirement 11: Audit Methodologies Reframe

**User Story**: As an AI agent, I want reusable audit patterns, so that I can apply consistent methodology across different audit types.

#### Acceptance Criteria

1. WHEN the audit is complete THEN the Audit_Agent SHALL propose reframing `Test Failure Audit Methodology.md` to a generalized audit methodologies document
2. WHEN reframing is proposed THEN the Audit_Agent SHALL preserve existing test failure audit content as a subsection
3. WHEN reframing is proposed THEN the Audit_Agent SHALL add documentation audit patterns based on this spec's execution
4. WHEN reframing decisions are needed THEN the Audit_Agent SHALL defer to Human_Agent_Checkpoint before implementation

---

## Non-Functional Requirements

### NFR-1: Quality Over Metrics

WHILE optimizing token load THE Audit_Agent SHALL prioritize quality and effectiveness over satisfying token budget metrics

### NFR-2: Audit-First Execution

WHILE executing the audit THE Audit_Agent SHALL NOT create execution plans for findings until after discovery is complete AND human has approved at checkpoint

### NFR-3: Soft Aspiration Target

WHILE optimizing token load THE Audit_Agent SHALL aim for ~25% context usage at session start as a soft aspiration, not a hard requirement

