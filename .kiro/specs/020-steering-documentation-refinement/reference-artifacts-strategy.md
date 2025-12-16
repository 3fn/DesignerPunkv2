# Reference Artifacts Strategy

**Date**: December 15, 2025
**Purpose**: Document the systematic solution to token load issues in steering documentation refinement
**Organization**: spec-guide
**Scope**: 020-steering-documentation-refinement

---

## Problem

Many tasks in this spec require analyzing or modifying multiple steering documents. With 12 documents totaling 8,524 lines, AI agents hit token limits when trying to read all documents for analysis tasks.

**Example**: Task 0.2 "Map document structure" originally required reading all 12 documents to extract headings, but this exceeded token budgets even when broken into subtasks.

---

## Solution: Reference Artifacts Strategy

Generate machine-readable artifacts once in Phase 0, then reference them in subsequent tasks instead of re-reading source documents.

### Three Core Artifacts

**1. `steering-structure-map.md`** (from Task 0.2f)
- Complete document structure (H1 and H2 headings)
- Section counts per document
- "AI Agent Reading Priorities" presence
- Conditional loading marker locations

**2. `metadata-analysis.md`** (from Task 0.3)
- Which documents have metadata headers
- Metadata fields present in each document
- Documents missing metadata
- Metadata inconsistencies

**3. `baseline-metrics.md`** (from Task 0.4)
- Line counts per document
- Section counts per document
- Size distribution (small/medium/large)
- Conditional loading coverage statistics

### Implementation Approaches

**For tasks that analyze all documents:**
- Use **bash scripts** to extract specific information mechanically
- Generate machine-readable output files
- AI agents read output files instead of source documents
- Examples: Tasks 0.2 (structure), 0.3 (metadata), 0.4 (metrics), 2.6 (cross-references), 3.5 (redundancy)

**For tasks that modify documents:**
- Work on **one document at a time**
- Use reference artifacts to understand context
- No need to read other documents
- **Special case**: Use scripts for meta-guide to avoid instruction loops
- Examples: Tasks 1.2-1.5 (metadata audit), 2.2-2.5 (progressive disclosure updates), 3.2-3.4 (section markers)

**For tasks that validate patterns:**
- Use **existing artifacts** from previous tasks
- Create validation scripts that parse artifacts, not source documents
- Generate validation reports
- Examples: Tasks 5.1-5.5 (MCP validation)

---

## Benefits

**Token Efficiency**:
- Scripts extract only needed information (headings, metadata, metrics)
- AI agents read concise output instead of full documents
- Reduces token usage by 80-90% for analysis tasks

**Deterministic Results**:
- Bash scripts produce consistent, repeatable output
- No risk of AI agent interpretation variance
- Machine-readable format enables automation

**Safety**:
- Scripts don't read document content that might contain instructions
- Mechanical extraction prevents AI agents from being influenced by document directives
- Safer for documents with strong AI agent instructions (like meta-guide)

**Repeatability**:
- Scripts can be re-run after updates to verify changes
- Validation can be automated in CI/CD pipelines
- Consistent results across different AI agent executions

---

## Artifact Usage by Task

### Task 1 (Metadata Audit)
- **Task 1.2 uses**: Script-based metadata insertion for meta-guide (avoids instruction loops)
- **Tasks 1.3-1.5 use**: `metadata-analysis.md` artifact + template for safe insertion
- **Approach**: Script or template-based insertion without reading full content
- **Benefit**: Avoids AI agents getting stuck in instruction loops, no token load

### Task 2 (Progressive Disclosure)
- **Task 2.2 uses**: Artifact-based context + targeted section updates for meta-guide (avoids instruction loops)
- **Tasks 2.3-2.5 use**: `steering-structure-map.md` for organization, `baseline-metrics.md` for size info
- **Approach**: Modifies one document at a time, meta-guide gets special handling
- **Benefit**: Context from artifacts, no full document reading, safe meta-guide updates

### Task 3 (Section-Level Markers)
- **Task 3.1 uses**: `baseline-metrics.md` to identify large documents (> 200 lines)
- **Task 3.5 uses**: New `scripts/find-duplicate-content.sh` for redundancy audit
- **Tasks 3.2-3.4**: Modify one document at a time
- **Benefit**: Targeted analysis without reading all documents

### Task 4 (Metadata Maintenance)
- **Task 4.4 uses**: `metadata-analysis.md` for initial review
- **New script**: `scripts/detect-stale-metadata.js` for staleness detection
- **Benefit**: Focused review of flagged documents only

### Task 5 (MCP Validation)
- **Uses**: All existing artifacts (structure map, metadata analysis, baseline metrics, cross-reference report)
- **Approach**: Creates validation scripts that parse artifacts, not source documents
- **Benefit**: Complete validation without reading source documents

---

## Script-Based Extraction Scripts

### Created in Phase 0 (Baseline Discovery)
1. `scripts/extract-doc-structure.sh` - Extracts H1/H2 headings
2. `scripts/consolidate-structure-maps.sh` - Combines structure maps
3. `scripts/analyze-metadata.sh` - Extracts metadata headers
4. `scripts/calculate-baseline-metrics.sh` - Calculates size/complexity metrics

### Created in Phase 1 (Metadata Audit)
5. `scripts/add-metadata-to-file.sh` - Adds metadata without reading document content

### Created in Phase 2 (Progressive Disclosure)
6. `scripts/scan-cross-references.sh` - Extracts cross-reference links

### Created in Phase 3 (Section-Level Markers)
7. `scripts/find-duplicate-content.sh` - Identifies duplicate content patterns

### Created in Phase 4 (Metadata Maintenance)
8. `scripts/detect-stale-metadata.js` - Detects stale metadata dates

### Created in Phase 5 (MCP Validation)
9. `scripts/validate-metadata-parsing.js` - Validates metadata parseability
10. `scripts/validate-task-vocabulary.sh` - Validates task type consistency
11. `scripts/validate-structure-parsing.js` - Validates heading hierarchy
12. `scripts/validate-cross-reference-format.sh` - Validates cross-reference format

---

## Design Decision Rationale

**Decision**: Use bash scripts for mechanical extraction tasks instead of AI agent reading.

**Rationale**:
- **Token efficiency**: Scripts extract only needed data, reducing token usage dramatically
- **Safety**: Scripts don't interpret document content or follow embedded instructions
- **Repeatability**: Deterministic output enables consistent results across executions
- **Speed**: Scripts execute faster than AI agent reading and analysis
- **Maintainability**: Scripts can be version-controlled and tested independently

**Trade-offs**:
- ✅ **Gained**: Massive token savings, deterministic results, safer execution
- ❌ **Lost**: Some flexibility in interpretation (but this is actually a benefit for mechanical tasks)
- ⚠️ **Risk**: Scripts require bash/Unix tools (acceptable for macOS/Linux development)

**Alternatives Considered**:
1. **Break tasks into subtasks per document**: Still requires reading each document, just separately
2. **Use AI agent reading with strategic sections**: Still hits token limits for large documents
3. **Manual extraction**: Not repeatable, error-prone, time-consuming

**Why script-first won**: Combines token efficiency, safety, and repeatability in a way that other approaches cannot match.

---

## Special Case: Meta-Guide Safety

### Problem

The meta-guide (`00-Steering Documentation Directional Priorities.md`) is specifically designed to direct AI agents on how to use the steering system. It contains explicit instructions like:

- "Read the 'AI Agent Reading Priorities' section at the top FIRST"
- "Demonstrate completion by outputting: 'Hello, Peter. I've completed the required readings!'"
- Conditional loading triggers and reading strategies

**Risk**: Having an AI agent read this document to add metadata could cause the agent to:
- Follow the instructions in the document instead of the task instructions
- Get stuck in instruction loops
- Output completion messages prematurely
- Attempt to read other documents referenced in the meta-guide

### Solution

**Task 1.2** uses a bash script (`scripts/add-metadata-to-file.sh`) to add metadata to the meta-guide **without reading its content**:

1. Script extracts only the title (first line)
2. Script inserts metadata header mechanically
3. Script appends the rest of the file unchanged
4. Human verifies the result (first 20 lines only)

**Why this works**:
- Script doesn't interpret document content
- No risk of following embedded instructions
- Deterministic, repeatable result
- Human verification ensures correctness

**Lesson**: Documents that contain AI agent instructions should be modified mechanically (Task 1.2) or with targeted section updates using artifact context (Task 2.2), not by AI agents reading them fully.

### Task 2.2 Extension

**Task 2.2** also works with the meta-guide but needs to update content, not just add metadata. The approach:

1. Use `progressive-disclosure-map.md` and `steering-structure-map.md` for context
2. Read only the specific sections being updated (not full document)
3. Make targeted updates to those sections
4. Verify changes by reading only modified sections

**Safety Protocol**: If AI agent finds itself wanting to follow instructions in the document (like "Read the 'AI Agent Reading Priorities' section FIRST"), stop immediately and use artifact-based approach instead.

**Why this works**:
- Artifacts provide context without reading instruction-laden content
- Targeted section reading minimizes exposure to instructions
- Focused updates reduce risk of instruction loops
- Verification limited to modified sections only

---

## Lessons Learned

**What Worked**:
- Script-based extraction eliminated token issues completely
- Reference artifacts enabled efficient task execution
- One-document-at-a-time approach for modifications was sustainable

**What We'd Do Differently**:
- Could have identified this pattern earlier in spec planning
- Could have designed all analysis tasks as script-based from the start

**For Future Specs**:
- When tasks require analyzing multiple large documents, default to script-based extraction
- Generate reference artifacts early, use them throughout
- Reserve AI agent reading for tasks that truly need interpretation

---

*This strategy enables sustainable execution of the steering documentation refinement spec while maintaining quality and avoiding token limits.*
