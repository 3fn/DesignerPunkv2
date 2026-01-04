# Design Document: Steering Documentation Audit

**Date**: 2026-01-03
**Spec**: 036 - Steering Documentation Audit
**Status**: Execution Phase (Phase 5 in progress)
**Dependencies**: None

---

## Overview

This design defines the methodology, phases, and artifacts for auditing 55 steering documents. The audit will identify legacy naming, measure token load, classify redundancy, and propose naming conventions - all while respecting Human-Agent checkpoints before implementation decisions.

The audit is structured in five phases with explicit checkpoints, ensuring human control over all significant decisions:

- **Phase 1-3**: Discovery, Analysis, Implementation Planning (completed)
- **Phase 4**: Execution - Initial batches through final validation (completed)
- **Phase 5**: Deep Optimization - Additional token reduction through content extraction (in progress)

---

## Architecture

### Audit Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PHASE 1: DISCOVERY                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │ Token Count │  │ Legacy Scan │  │ Redundancy  │  │ Category   │  │
│  │ Calculation │  │             │  │ Detection   │  │ Analysis   │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │
│                              ↓                                      │
│                    ┌─────────────────┐                              │
│                    │  CHECKPOINT 1   │ ← Human reviews findings     │
│                    │  Review Findings│                              │
│                    └─────────────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        PHASE 2: ANALYSIS                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │ Prioritize  │  │ Consolidate │  │ Prefix      │  │ Split      │  │
│  │ by Impact   │  │ Proposals   │  │ Proposals   │  │ Candidates │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │
│                              ↓                                      │
│                    ┌─────────────────┐                              │
│                    │  CHECKPOINT 2   │ ← Human approves approach    │
│                    │  Review Recs    │                              │
│                    └─────────────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     PHASE 3: IMPLEMENTATION                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │ Task List   │  │ Batch Plan  │  │ Rollback    │  │ Validation │  │
│  │ Creation    │  │             │  │ Strategy    │  │ Criteria   │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │
│                              ↓                                      │
│                    ┌─────────────────┐                              │
│                    │  CHECKPOINT 3   │ ← Human approves tasks       │
│                    │  Review Tasks   │                              │
│                    └─────────────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        EXECUTION                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │ Batch 1     │→ │ Batch 2     │→ │ Batch N     │                  │
│  │ Execute     │  │ Execute     │  │ Execute     │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   PHASE 5: DEEP OPTIMIZATION                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │
│  │ Identify    │  │ Extract to  │  │ Add Priming │  │ Update     │  │
│  │ Conditional │  │ Manual-Load │  │ + MCP Query │  │ Meta-Guide │  │
│  │ Sections    │  │ Documents   │  │ Directions  │  │            │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │
│                              ↓                                      │
│                    ┌─────────────────┐                              │
│                    │  VALIDATION     │ ← Re-index MCP, verify       │
│                    │  & TOKEN COUNT  │   token savings achieved     │
│                    └─────────────────┘                              │
└─────────────────────────────────────────────────────────────────────┘
```

### Batching Strategy

Documents will be processed in batches to avoid context overload:

| Batch | Documents | Rationale |
|-------|-----------|-----------|
| 1 | Layer 0-1 (5 docs) | Foundational, always-loaded |
| 2 | Layer 2 (6 docs) | Framework docs, high impact |
| 3 | Token docs (14 docs) | Clear family, similar structure |
| 4 | Component family docs (11 docs) | Clear family, similar structure |
| 5 | Component infrastructure (8 docs) | Related docs |
| 6 | Remaining docs (~11 docs) | Infrastructure, standalone |

**Note**: Batch composition may be adjusted based on actual token counts discovered in Phase 1.

---

## Components and Interfaces

### Audit Artifacts

#### 1. Token Tracking Document

**Location**: `.kiro/specs/036-steering-documentation-audit/audit-artifacts/token-tracking.md`

**Purpose**: Capture token counts without burdening steering docs

**Structure**:
```markdown
# Steering Documentation Token Tracking

**Date**: [Audit Date]
**Total Documents**: 55
**Total Tokens**: [Sum]
**Session Start Load**: [Percentage]

## By Layer

| Layer | Doc Count | Total Tokens | % of Total |
|-------|-----------|--------------|------------|
| 0     | 1         | [count]      | [%]        |
| 1     | 4         | [count]      | [%]        |
| 2     | 6         | [count]      | [%]        |
| 3     | 44        | [count]      | [%]        |

## By Document

| Document | Layer | Tokens | Always Loaded? |
|----------|-------|--------|----------------|
| [name]   | [n]   | [count]| Yes/No         |
```

#### 2. Legacy Naming Report

**Location**: `.kiro/specs/036-steering-documentation-audit/audit-artifacts/legacy-naming-report.md`

**Purpose**: Document all legacy naming instances found

**Structure**:
```markdown
# Legacy Naming Audit Report

**Date**: [Audit Date]
**Total Instances**: [Count]

## By Pattern

| Pattern | Replacement | Instance Count |
|---------|-------------|----------------|
| `<dp-icon>` | `<icon-base>` | [count] |
| `<dp-container>` | `<container-base>` | [count] |
| `TextInputField` | `Input-Text-Base` | [count] |
| "Legacy Icon" | [remove/replace] | [count] |
| `DPIcon` | `IconBaseElement` | [count] |

## By Document

| Document | Patterns Found | Line Numbers |
|----------|----------------|--------------|
| [name]   | [patterns]     | [lines]      |
```

#### 3. Redundancy Analysis Report

**Location**: `.kiro/specs/036-steering-documentation-audit/audit-artifacts/redundancy-analysis.md`

**Purpose**: Classify redundancy as harmful or intentional priming

**Structure**:
```markdown
# Redundancy Analysis Report

**Date**: [Audit Date]

## Harmful Redundancy (Consolidation Candidates)

| Content Topic | Documents | Proposed Canonical Source |
|---------------|-----------|---------------------------|
| [topic]       | [docs]    | [canonical]               |

## Intentional Priming (Acceptable)

| Content Topic | Priming Location | Canonical Source | Priming Length |
|---------------|------------------|------------------|----------------|
| [topic]       | [doc]            | [canonical]      | [sentences]    |

## Recommendations

[Consolidation recommendations - pending Checkpoint 2 approval]
```

#### 4. Category Analysis Report

**Location**: `.kiro/specs/036-steering-documentation-audit/audit-artifacts/category-analysis.md`

**Purpose**: Identify document families and propose prefixes

**Structure**:
```markdown
# Category Analysis Report

**Date**: [Audit Date]

## Identified Families (3+ related docs)

| Family | Document Count | Proposed Prefix | Rationale |
|--------|----------------|-----------------|-----------|
| [name] | [count]        | [prefix]        | [why]     |

## Standalone Documents (no prefix)

| Document | Rationale for Standalone |
|----------|--------------------------|
| [name]   | [why]                    |

## Edge Cases (Human Decision Required)

| Document | Possible Categories | Recommendation |
|----------|---------------------|----------------|
| [name]   | [options]           | [suggestion]   |
```

---

## Data Models

### Document Metadata

Each steering document will be analyzed for:

```typescript
interface DocumentAudit {
  // Identity
  path: string;
  currentName: string;
  proposedName: string;  // After Kebab-Title-Case + prefix
  
  // Metrics
  tokenCount: number;
  layer: 0 | 1 | 2 | 3;
  alwaysLoaded: boolean;
  
  // Legacy
  legacyInstances: LegacyInstance[];
  
  // Redundancy
  redundantContent: RedundancyInstance[];
  
  // Category
  family: string | null;  // null = standalone
  proposedPrefix: string | null;
}

interface LegacyInstance {
  pattern: string;  // e.g., "<dp-icon>"
  replacement: string;  // e.g., "<icon-base>"
  lineNumber: number;
  context: string;  // Surrounding text
}

interface RedundancyInstance {
  topic: string;
  classification: 'harmful' | 'priming';
  otherDocuments: string[];
  sentenceCount: number;  // For priming length check
}
```

---

## Design Decisions

### Decision 1: Audit-First, Execute-Second

**Options Considered**:
1. Discover and fix issues as we find them
2. Complete discovery, then plan execution after human review

**Decision**: Option 2 - Complete discovery before execution

**Rationale**: 
- Prevents premature optimization
- Allows human to see full picture before committing
- Aligns with Human-Agent checkpoint pattern
- Reduces risk of cascading changes

**Trade-offs**: Slower initial progress, but safer and more controlled

### Decision 2: Batched Processing

**Options Considered**:
1. Process all 55 docs in one pass
2. Process docs in logical batches
3. Process docs one at a time

**Decision**: Option 2 - Logical batches by layer/family

**Rationale**:
- Avoids context overload
- Groups related docs for consistent analysis
- Allows progress checkpoints within phases

**Trade-offs**: More coordination overhead, but sustainable execution

### Decision 3: Meta-Guide Bash-Only Access

**Options Considered**:
1. Read meta-guide like any other file
2. Use bash commands only for meta-guide

**Decision**: Option 2 - Bash commands only

**Rationale**:
- Meta-guide is always loaded in context
- Reading it again would duplicate content
- Bash commands (grep, sed) allow targeted access without full load

**Trade-offs**: Less convenient, but prevents context pollution

### Decision 4: Priming Guidelines

**Options Considered**:
1. Hard word count limit (e.g., 100 words)
2. Purpose-based guideline only
3. Purpose-based with suggestive length

**Decision**: Option 3 - Purpose-based with ~3-4 sentence guideline

**Rationale**:
- Purpose-based gives agents judgment
- Sentence guideline provides sanity check
- Neither is rigid, both are useful

**Trade-offs**: Requires judgment, but more flexible than hard limits

---

## Error Handling

### Rollback Strategy

Steering docs are critical infrastructure. If issues arise:

1. **Git-based rollback**: All changes committed incrementally, can revert
2. **MCP re-index**: After rollback, rebuild MCP index to reflect reverted state
3. **Reference validation**: After any change, validate all cross-references

### Context Overload Recovery

If context limits are hit during audit:

1. **Pause and report**: Document current progress
2. **Reduce batch size**: Process fewer docs per batch
3. **Checkpoint findings**: Save partial results before continuing

---

## Testing Strategy

**Note**: This spec produces only Documentation tasks. No code is generated, so Test Development Standards are not required.

### Validation Approach

1. **MCP Index Health**: After changes, verify `get_index_health()` returns healthy
2. **Cross-Reference Validation**: Use `list_cross_references()` to verify links
3. **Metadata Validation**: Use `validate_metadata()` on modified docs
4. **Manual Spot Checks**: Human reviews sample of changes at checkpoints

---

## Correctness Properties

Since this is a documentation-only spec, correctness is validated through:

1. **Zero Legacy Naming**: After execution, grep for legacy patterns returns zero matches
2. **Reference Integrity**: All hard and soft references resolve correctly
3. **MCP Queryability**: All renamed docs are queryable via MCP
4. **Checkpoint Compliance**: No implementation without human approval at checkpoints

---

## Implementation Notes

### Phase 1: Discovery Tasks

1. Calculate token counts for all 55 docs (capture in tracking doc)
2. Scan for legacy naming patterns (capture in legacy report)
3. Identify redundant content (capture in redundancy analysis)
4. Analyze document families (capture in category analysis)
5. **CHECKPOINT 1**: Present findings to human

### Phase 2: Analysis Tasks

1. Prioritize docs by impact (token count × load frequency)
2. Propose consolidation targets for harmful redundancy
3. Propose category prefixes for identified families
4. Identify file split candidates
5. **CHECKPOINT 2**: Present recommendations to human

### Phase 3: Implementation Planning Tasks

1. Create detailed task list based on approved recommendations
2. Define batch execution plan
3. Define rollback strategy
4. Define validation criteria
5. **CHECKPOINT 3**: Present task list to human

### Execution Tasks

Tasks will be defined after Checkpoint 3 approval. Placeholder structure:

- Batch 1: [TBD based on approved recommendations]
- Batch 2: [TBD based on approved recommendations]
- ...
- Final: Reference updates and validation

### Phase 5: Deep Optimization Tasks (Task 23)

After Phase 4 validation achieved 28.1% token reduction (39,124 → 28,137 tokens), analysis identified additional optimization opportunities in always-loaded documents.

**Target**: `Process-Development-Workflow.md` (14,207 tokens)

**Strategy**: Extract conditional sections to new manual-load document, replace with priming + MCP query directions.

**Sections to Extract** (~9,000 tokens):
1. Agent Hook Dependency Chains (~3,500 tokens)
2. Troubleshooting (~4,000 tokens)
3. Kiro Agent Hook Integration (~1,500 tokens)

**New Document**: `Process-Hook-Operations.md` (inclusion: manual)

**Expected Outcome**: Session start load reduced from ~28,000 to ~19,000 tokens

**Tasks**:
- 23.1: Create `Process-Hook-Operations.md` with proper metadata
- 23.2: Move Agent Hook Dependency Chains section
- 23.3: Move Troubleshooting section
- 23.4: Move Kiro Agent Hook Integration section
- 23.5: Delete Implementation Timeline section
- 23.6: Add priming + MCP query directions to source document
- 23.7: Update meta-guide with new MCP query paths
- 23.8: Re-index MCP and validate
- 23.9: Update final token counts and savings

