# MCP Documentation Server - Design Outline

**Date**: December 14, 2025  
**Updated**: December 16, 2025
**Purpose**: Explore design space for MCP server that provides on-demand documentation querying to reduce AI agent context usage  
**Status**: Design Exploration - Ready for Requirements  
**Dependencies**: 
- **Spec 020 (Steering Documentation Refinement)** - ✅ **COMPLETE**
  - Status: Complete (all 5 tasks finished)
  - Delivered: Machine-readable metadata, section-level conditional markers, stable task vocabulary, 4-layer structure, validation scripts
  - Integration point: Metadata + conditional markers provide complete MCP query interface
  - **Validation**: All deliverables validated and working (100% cross-reference compliance, all validation scripts passing)

**Problem**: AI agents currently load 112k tokens (~56% context) of steering documentation before starting work, leaving insufficient room for complex tasks

---

## Problem Statement

### Current State
- **Baseline context usage**: 112k tokens (~56%) before any work begins
- **Remaining capacity**: 88k tokens for dialogue, code reading, and task execution
- **Risk**: Complex tasks fail mid-execution due to context exhaustion
- **Growth trajectory**: Unsustainable as project adds more components, specs, and guidance

### Specific Pain Points
1. **Spec Planning Standards** (~30k tokens) - Loaded even when not creating specs
2. **Component Development Guide** (~15k tokens) - Loaded even when not building components
3. **File Organization Standards** (~20k tokens) - Reference material loaded upfront
4. **Development Workflow** (~25k tokens) - Includes extensive troubleshooting rarely needed

### Why This Matters
- AI agents need context space for actual work (reading code, generating solutions)
- Complex tasks (component development, spec creation) require significant context
- Project is growing - more components, more specs, more guidance documents
- Current "conditional loading" helps but still loads full documents

---

## Goals

### Primary Goal
**Reduce baseline AI agent context usage from 56% to 15-20%** by moving reference documentation to queryable MCP server

### Secondary Goals
1. **Maintain guidance quality** - AI agents still get the information they need
2. **Improve query precision** - Return only relevant sections, not entire documents
3. **Scale sustainably** - System works as documentation grows
4. **Keep docs in markdown** - No migration to databases or complex formats
5. **Version control friendly** - Documentation changes tracked in git

### Success Metrics
- Baseline context usage ≤ 20% (40k tokens)
- Query response time < 500ms
- AI agents successfully complete complex tasks without context exhaustion
- Documentation maintenance workflow unchanged (still edit markdown files)

---

## High-Level Approach

### What Moves to MCP Server
**Reference documentation** (query on-demand):
- Spec Planning Standards (requirements/design/tasks formats)
- Component Development Guide (token selection, patterns)
- File Organization Standards (metadata values, directory structure)
- Task Type Definitions (setup/implementation/architecture)

**Total moved**: ~65k tokens → Query only what's needed (~2-5k per query)

### What Stays in Steering (Always-Loaded)
**Workflow essentials** (~20k tokens):
- Personal Note (collaboration principles)
- Start Up Tasks (date check, Jest commands)
- Core Goals (project context)
- Development Workflow (stripped to essentials - task completion, git practices)
- Meta-guide (how to use the system)

### Query Patterns

AI agents would query like:
```
"token selection framework" → Returns Component Development Guide section
"tier 3 validation" → Returns Spec Planning Standards validation section
"component-level tokens" → Returns Component Development Guide section
"organization metadata values" → Returns File Organization Standards section
```

---

## Architecture Options

### Option A: Simple File-Based MCP Server
**Approach**: Index markdown files, return sections based on headings

**Pros**:
- Simple to build (2-3 days)
- No database needed
- Documentation stays in markdown
- Easy to maintain

**Cons**:
- Basic search (heading-based only)
- No semantic understanding
- Manual section mapping

**Implementation**:
```javascript
// mcp-server/docs-server.js
// 1. Index markdown files on startup
// 2. Parse headings and create section map
// 3. Query returns matching sections
// 4. Watch files for changes, re-index
```

### Option B: Semantic Search MCP Server
**Approach**: Embed documentation sections, use vector similarity for queries

**Pros**:
- Intelligent query matching
- Finds relevant content even with different wording
- Better user experience

**Cons**:
- More complex (4-5 days)
- Requires embedding model
- Higher resource usage

**Implementation**:
```javascript
// Uses sentence-transformers or similar
// 1. Chunk documentation into sections
// 2. Generate embeddings for each section
// 3. Query generates embedding, finds similar sections
// 4. Return top N matches
```

### Option C: Hybrid (Recommended)
**Approach**: Start with Option A, add semantic search later if needed

**Rationale**:
- Get immediate value (context reduction)
- Validate the approach works
- Add sophistication only if heading-based search proves insufficient
- Incremental investment

---

## MCP Server Structure

### Tools to Expose

#### Core Tools (MVP)

##### 1. `get_documentation_map`
**Purpose**: Get complete documentation structure with metadata

**Parameters**: None

**Returns**:
```json
{
  "layers": {
    "0": {
      "name": "Meta-Guide",
      "documents": [
        {
          "path": ".kiro/steering/00-Steering Documentation Directional Priorities.md",
          "purpose": "How to use the steering system",
          "layer": 0,
          "relevantTasks": ["all-tasks"],
          "sections": ["How This Steering System Works", "When In Doubt"]
        }
      ]
    },
    "1": {
      "name": "Foundation",
      "documents": [...]
    },
    "2": {
      "name": "Frameworks and Patterns",
      "documents": [...]
    },
    "3": {
      "name": "Specific Implementations",
      "documents": [...]
    }
  }
}
```

##### 2. `get_document_summary`
**Purpose**: Get document summary with outline (Option D - Summary + Outline)

**Parameters**:
- `path` (string, required): Document path (e.g., ".kiro/steering/Component Development Guide.md")

**Returns**:
```json
{
  "path": ".kiro/steering/Component Development Guide.md",
  "metadata": {
    "purpose": "Guide AI agents in building components with appropriate token usage",
    "layer": 3,
    "relevantTasks": ["component-development", "token-selection"],
    "lastReviewed": "2025-12-15"
  },
  "outline": [
    {
      "heading": "Token Selection Decision Framework",
      "level": 2,
      "subsections": [
        "Step 1: Check Semantic Tokens First",
        "Step 2: Use Primitives Only When Unavoidable",
        "Step 3: Create Component-Level Tokens for Variants",
        "Step 4: Propose Semantic Token Elevation"
      ]
    },
    {
      "heading": "Common Component Patterns",
      "level": 2,
      "subsections": ["Button Components", "Input Components", "Container Components"]
    }
  ],
  "crossReferences": [
    {
      "target": "docs/token-system-overview.md",
      "context": "For detailed token guidance"
    }
  ],
  "tokenCount": 15000
}
```

##### 3. `get_document_full`
**Purpose**: Get complete document content

**Parameters**:
- `path` (string, required): Document path

**Returns**:
```json
{
  "path": ".kiro/steering/Component Development Guide.md",
  "content": "# Component Development Guide\n\n**Date**: 2025-11-17...",
  "metadata": {...},
  "tokenCount": 15000
}
```

##### 4. `get_section`
**Purpose**: Get specific section by heading

**Parameters**:
- `path` (string, required): Document path
- `heading` (string, required): Section heading (e.g., "Token Selection Decision Framework")

**Returns**:
```json
{
  "path": ".kiro/steering/Component Development Guide.md",
  "heading": "Token Selection Decision Framework",
  "content": "## Token Selection Decision Framework\n\n### Step 1: Check Semantic Tokens First...",
  "parentHeadings": [],
  "tokenCount": 2000
}
```

##### 5. `list_cross_references`
**Purpose**: List cross-references in a document (hybrid approach for Option D)

**Parameters**:
- `path` (string, required): Document path

**Returns**:
```json
{
  "path": ".kiro/steering/Component Development Guide.md",
  "references": [
    {
      "target": "docs/token-system-overview.md",
      "context": "For detailed token guidance",
      "section": "Token Selection Decision Framework"
    },
    {
      "target": ".kiro/steering/Technology Stack.md",
      "context": "For platform-specific guidance",
      "section": "Platform-Specific Nuances"
    }
  ]
}
```

#### Discovery Tools (Post-MVP)

##### 6. `search_documentation`
**Purpose**: Search documentation by keyword

**Parameters**:
- `query` (string, required): Search query
- `max_results` (number, optional): Maximum results (default: 5)

**Returns**:
```json
{
  "query": "token selection",
  "results": [
    {
      "path": ".kiro/steering/Component Development Guide.md",
      "section": "Token Selection Decision Framework",
      "relevance": 0.95,
      "snippet": "...ALWAYS start by reading semantic token files..."
    }
  ]
}
```

##### 7. `suggest_relevant_docs`
**Purpose**: Suggest relevant documentation based on task context

**Parameters**:
- `task_type` (string, required): Task type (e.g., "component-development")
- `task_description` (string, optional): Additional context

**Returns**:
```json
{
  "taskType": "component-development",
  "highlyRelevant": [
    {
      "path": ".kiro/steering/Component Development Guide.md",
      "reason": "Primary guide for component development",
      "sections": ["Token Selection Decision Framework", "Component Structure Pattern"]
    }
  ],
  "possiblyRelevant": [
    {
      "path": ".kiro/steering/Technology Stack.md",
      "reason": "Platform-specific implementation guidance"
    }
  ]
}
```

#### Debugging Tools (MVP)

##### 8. `validate_metadata`
**Purpose**: Validate document metadata for debugging

**Parameters**:
- `path` (string, required): Document path

**Returns**:
```json
{
  "path": ".kiro/steering/Component Development Guide.md",
  "valid": true,
  "metadata": {...},
  "issues": []
}
```

### File Structure

```
mcp-server/
├── package.json
├── docs-server.js           # Main MCP server
├── indexer.js               # Markdown indexing logic
├── query-engine.js          # Query matching logic
├── config.json              # Configuration
└── index/                   # Generated index files
    ├── spec-planning.json
    ├── component-guide.json
    └── file-organization.json
```

---

## Documentation Organization

### Source Documents (Markdown)
Keep documentation in current locations:
- `.kiro/steering/Spec Planning Standards.md`
- `.kiro/steering/Component Development Guide.md`
- `.kiro/steering/File Organization Standards.md`

### Index Generation
MCP server indexes these files on startup:
1. Parse markdown structure (headings, content)
2. Create section map with token counts
3. Generate search index
4. Watch files for changes, re-index automatically

### Section Granularity
**Index at H2 and H3 level**:
- H1: Document title (not indexed separately)
- H2: Major sections (e.g., "Token Selection Decision Framework")
- H3: Sub-sections (e.g., "Step 1: Check Semantic Tokens First")

**Rationale**: H2/H3 provides right balance of granularity vs. context

---

## Query Strategy

### How AI Agents Use It

**Before (Current)**:
```
1. Load all steering docs (112k tokens)
2. Read strategically using "AI Agent Reading Priorities"
3. Start task with 56% context used
```

**After (With MCP)**:
```
1. Load essential steering docs (20k tokens)
2. Query MCP for specific guidance as needed
3. Start task with 10-15% context used
```

### Query Examples

**Scenario: Building a component**
```
Query: "token selection framework"
Returns: Component Development Guide → Token Selection Decision Framework section (~2k tokens)

Query: "component-level tokens"
Returns: Component Development Guide → Step 3 section (~1k tokens)
```

**Scenario: Creating spec tasks**
```
Query: "task type classification"
Returns: Spec Planning Standards → Task Type Classification System (~5k tokens)

Query: "tier 2 validation"
Returns: Spec Planning Standards → Tier 2: Standard Validation (~2k tokens)
```

**Scenario: Organizing files**
```
Query: "organization metadata values"
Returns: File Organization Standards → Organization Field Values (~3k tokens)
```

### Query Optimization

**AI agents should**:
- Query specific topics, not broad categories
- Query just-in-time (when needed, not upfront)
- Cache results within conversation (don't re-query)

**MCP server should**:
- Return minimal sufficient context
- Include section context (parent headings)
- Provide "related sections" suggestions

---

## Implementation Phases

### Phase 1: MVP (Week 1)
**Goal**: Prove the concept, reduce context usage

**Scope**:
- Simple file-based indexing
- Basic heading-based search
- Three documents: Spec Planning, Component Guide, File Organization
- Single tool: `query_documentation`

**Success**: Baseline context drops to 25-30%

### Phase 2: Refinement (Week 2)
**Goal**: Improve query accuracy and developer experience

**Scope**:
- Add `list_documents` and `get_section` tools
- Improve section chunking logic
- Add query suggestions
- Better error messages

**Success**: AI agents successfully use MCP for complex tasks

### Phase 3: Enhancement (Future)
**Goal**: Add sophistication if needed

**Scope**:
- Semantic search (if heading-based insufficient)
- Query analytics (what's being queried most)
- Auto-suggest related sections
- Performance optimization

**Success**: Query precision improves, fewer failed queries

---

## Design Decisions

### 1. Scope & Boundaries
**Decision**: Read-only access for MVP  
**Rationale**: Reduces risk, simpler implementation, prevents AI agents from corrupting documentation  
**Future**: Consider write operations (propose documentation updates) in post-MVP iteration

### 2. Search & Discovery Strategy
**Decision**: Implement both documentation map AND smart suggestions  
**Rationale**: 
- Documentation map provides explicit navigation (agent knows what they need)
- Smart suggestions enable discovery (agent doesn't know what exists)
- Both serve different use cases and complement each other

**MVP**: Documentation map + basic keyword search  
**Post-MVP**: AI-powered smart suggestions based on task context

### 3. Metadata Parsing Reliability
**Decision**: Trust metadata, provide validation tool for debugging  
**Rationale**: Simpler, faster, validation scripts from Task 5 ensure metadata quality  
**Implementation**: Provide `validate_metadata(path)` tool for troubleshooting

### 4. Cross-Reference Resolution
**Decision**: Option D - Summary + Outline with Drill-Down  
**Rationale**: 
- Token efficient (~200 tokens for summary vs ~2000 for full doc)
- Progressive disclosure (matches steering system philosophy)
- Informed decision-making (agent sees outline before fetching full content)
- Navigable (can fetch specific sections)

**Implementation**:
```markdown
--- Referenced Document Summary: docs/token-system-overview.md ---

**Purpose**: Master document mapping token files to documentation
**Layer**: 2 (Frameworks and Patterns)
**Key Topics**: Primitive tokens, Semantic tokens, Token generation

**Document Outline**:
1. Introduction
2. Primitive Tokens
   - Font Size Tokens
   - Spacing Tokens
3. Semantic Tokens
   - Typography Tokens
   - Color Tokens

[Use get_document_full(path) to load complete content]
[Use get_section(path, heading) to load specific section]
```

**Summary Generation**: Start with metadata-based summaries (Purpose + outline from headings)
- Zero maintenance (auto-generated from doc structure)
- Fast (no LLM calls)
- Accurate (reflects actual structure)

**Future Enhancement**: Add AI-generated summaries if metadata-based proves insufficient

### 5. Conditional Loading Logic
**Decision**: Flexible - agent decides what to load  
**Rationale**: Matches current steering philosophy, allows agents to learn optimal patterns  
**Implementation**: Provide metadata (triggers, layer, scope) but don't enforce loading rules

### 6. Performance & Caching
**Decision**: No caching initially  
**Rationale**: Avoid premature optimization, documentation files are small  
**Future**: Add file watching + cache invalidation if performance becomes an issue (~1-2 hours effort)

**Cache Implementation Path** (if needed):
```javascript
// Simple file watching approach
const cache = new Map();
const watcher = fs.watch('.kiro/steering/', (event, filename) => {
  if (event === 'change') {
    cache.delete(filename); // Invalidate this file
  }
});
```

### 7. Error Handling
**Decision**: Inform human + log the issue  
**Rationale**: Transparent, debuggable, doesn't fail silently  
**Implementation**:
- Missing cross-references: Return error with clear message, log to file
- Malformed metadata: Return partial content with warnings, log issue
- Non-existent files: Return error, suggest similar files if available

### 8. Integration with Existing Workflow
**Decision**: Phase 1 (supplement) → Phase 2 (replace)

**Phase 1 - Supplement (MVP)**:
- Kiro IDE loads Layer 0 steering doc (primer/menu)
- AI agents use MCP to fetch details on demand
- Current steering system stays intact
- Validates MCP effectiveness before full migration

**Phase 2 - Replace (Post-MVP)**:
- Kiro IDE loads ONLY Layer 0 (minimal primer)
- AI agents fetch everything else via MCP
- Steering docs become MCP-only
- Migration triggered when MCP provides better UX than current loading

**Unified System Architecture**:
```
Layer 0 Steering Doc (Always Loaded by IDE)
├─ "Here's what's available via MCP"
├─ Documentation Map (high-level structure)
└─ How to use MCP tools

MCP Server (Query on Demand)
├─ get_documentation_map() → Full structure with metadata
├─ get_document_summary(path) → Summary + outline
├─ get_document_full(path) → Complete content
├─ get_section(path, heading) → Specific section
└─ suggest_relevant_docs(task_context) → Smart suggestions
```

**Migration Path**:
1. Keep Layer 0 format stable (primer doesn't change)
2. Design MCP tools to match current workflow
3. Add telemetry to measure MCP usage vs. current system
4. Gradual rollout: Start with Layer 3 (conditional docs) via MCP, keep Layer 1-2 in IDE

**Friction Mitigation**:
- ✅ Performance: MCP must be as fast as current loading
- ✅ Reliability: Graceful error handling
- ✅ Discoverability: Documentation map + smart suggestions

**Note**: Re: 2 (Discovery) and Re: 8 (Integration) follow the same pattern - progressive disclosure via MCP with unified approach

---

## Success Criteria

### Must Have
- [ ] Baseline context usage ≤ 25% (50k tokens)
- [ ] AI agents can query documentation successfully
- [ ] Query response time < 500ms
- [ ] Documentation maintenance workflow unchanged

### Should Have
- [ ] Baseline context usage ≤ 20% (40k tokens)
- [ ] Query accuracy > 90% (returns relevant section)
- [ ] AI agents complete complex tasks without context exhaustion
- [ ] Clear query examples in meta-guide

### Nice to Have
- [ ] Baseline context usage ≤ 15% (30k tokens)
- [ ] Semantic search for intelligent matching
- [ ] Query analytics and optimization
- [ ] Auto-suggest related sections

---

## Next Steps

### Immediate (This Conversation)
1. Review this design outline with Peter
2. Resolve open questions
3. Decide on architecture option (A, B, or C)
4. Determine implementation phases

### After Approval
1. Create formal requirements.md
2. Create design.md with detailed architecture
3. Create tasks.md with implementation plan
4. Begin Phase 1 implementation

---

## Critical Lesson from Spec 020: Context Load Loop Problem

### The Problem: AI Agents Reading Documentation Naturally

During Spec 020 (Steering Documentation Refinement), we discovered a critical issue when AI agents try to read steering documentation using natural reading tools (like `readFile`):

**The Context Load Loop**:
1. AI agent reads a steering document to analyze it
2. Document contains instructions (e.g., "AI Agent Reading Priorities" sections)
3. Agent interprets these as directives and tries to follow them
4. Following instructions requires reading MORE documents
5. Those documents contain MORE instructions
6. **Result**: Agent exhausts context before completing any actual work

**Example from Spec 020**:
- Task 0.2 originally required "reading all 12 documents to extract headings"
- Total: 8,524 lines across 12 documents
- Agent would hit token limits just trying to understand document structure
- Worse: Documents like the meta-guide contain explicit instructions that cause agents to load even more content

### The Solution: Mechanical Extraction via Scripts

Spec 020 solved this by using **bash scripts for mechanical extraction**:

```bash
# Extract only headings, not content
grep -E "^#{1,2} " "$file" | while read -r line; do
    echo "- $line"
done
```

**Benefits**:
- Scripts extract only needed information (headings, metadata, metrics)
- Scripts don't interpret document content or follow embedded instructions
- AI agents read script OUTPUT, not source documents
- Token usage reduced by 80-90% for analysis tasks
- Deterministic, repeatable results

**Key Insight**: Mechanical extraction is safer and more efficient than AI agent reading for documentation that contains instructions.

### Implications for MCP Server Design

This lesson is **critical** for the MCP server design. The MCP server will face the same problem if it just returns full document content.

#### Why Option D (Summary + Outline) is Essential

**Without summaries** (returning full content):
```
AI Agent: "Get Component Development Guide"
MCP Server: [Returns 15,000 tokens of full content]
AI Agent: [Reads "AI Agent Reading Priorities" section]
AI Agent: "Oh, I should also read Token System Overview"
MCP Server: [Returns another 10,000 tokens]
AI Agent: [Context exhausted, task fails]
```

**With summaries** (Option D):
```
AI Agent: "Get Component Development Guide summary"
MCP Server: [Returns 200 tokens: metadata + outline]
AI Agent: "I need the Token Selection section"
MCP Server: [Returns 2,000 tokens: just that section]
AI Agent: [Completes task with 2,200 tokens used]
```

#### MCP Server Must Use Mechanical Parsing

The MCP server implementation must:

1. **Parse documents mechanically** (like Spec 020 scripts)
   - Extract metadata without reading content
   - Generate outlines from heading structure
   - Don't interpret document instructions

2. **Return structured summaries by default**
   - Metadata + outline (200 tokens)
   - Not full content (2,000-15,000 tokens)
   - Let AI agents request full content explicitly

3. **Enable granular section retrieval**
   - Return specific sections by heading
   - Include parent context (which document, which section)
   - Avoid returning instruction-heavy sections unless requested

4. **Avoid instruction interpretation**
   - MCP server is a dumb pipe (parse, don't interpret)
   - Don't follow cross-references automatically
   - Don't load related documents proactively

### Impact on Requirements, Design, and Tasks

This lesson shapes how we structure our spec documents:

#### Requirements Document
- **Must include**: Explicit requirement for mechanical parsing
- **Must include**: Requirement for summary-first approach
- **Must include**: Requirement for section-level granularity
- **Must avoid**: Requirements that assume full-content serving

#### Design Document
- **Must include**: Parsing architecture (how to extract metadata/outline mechanically)
- **Must include**: Summary generation algorithm (metadata + outline from headings)
- **Must include**: Section extraction logic (get specific sections without full doc)
- **Must include**: Safety mechanisms (prevent instruction interpretation)

#### Tasks Document
- **Must include**: Tasks for building mechanical parsers (not AI-based)
- **Must include**: Tasks for testing summary generation (validate token counts)
- **Must include**: Tasks for section extraction (test granular retrieval)
- **Must avoid**: Tasks that require AI agents to read full steering docs

### Validation Criteria

The MCP server implementation must be validated against these criteria:

**Token Efficiency**:
- ✅ Summary requests use < 500 tokens
- ✅ Section requests use < 3,000 tokens
- ✅ Full document requests are explicit (not default)

**Safety**:
- ✅ Server doesn't interpret document instructions
- ✅ Server doesn't follow cross-references automatically
- ✅ Server doesn't load related documents proactively

**Mechanical Parsing**:
- ✅ Metadata extraction uses regex/parsing (not AI reading)
- ✅ Outline generation uses heading structure (not content analysis)
- ✅ Section extraction uses heading boundaries (not semantic understanding)

### Why This Matters

**Without this lesson**: We might build an MCP server that just returns full document content, recreating the exact problem Spec 020 solved.

**With this lesson**: We build an MCP server that uses mechanical parsing and summary-first approach, enabling AI agents to work efficiently without context exhaustion.

**This is the core innovation**: The MCP server isn't just a file server - it's a **context-efficient documentation interface** that prevents the context load loop problem.

---

## Notes and Observations

### Why This Will Work
- **Proven pattern**: MCP servers are designed for exactly this use case
- **Incremental value**: Even basic implementation provides immediate benefit
- **Low risk**: Documentation stays in markdown, easy to rollback
- **Scales naturally**: Adding more documents is straightforward
- **Validated approach**: Spec 020 proved mechanical extraction works

### Potential Challenges
- **Query formulation**: AI agents need to learn effective query patterns
- **Section boundaries**: Some concepts span multiple sections
- **Context continuity**: Queried sections lack surrounding context
- **Maintenance overhead**: Need to ensure documentation remains queryable
- **Parsing complexity**: Mechanical parsing must handle edge cases (nested headings, code blocks, etc.)

### Design Decisions to Make
1. **Architecture**: Simple file-based (A) vs Semantic (B) vs Hybrid (C)? → **Hybrid (C) recommended**
2. **Scope**: Three documents or more? → **Start with 3, expand to all Layer 2-3 docs**
3. **Granularity**: H2 only or H2+H3? → **H2+H3 for better precision**
4. **Migration**: All at once or incremental? → **Phase 1 (supplement) → Phase 2 (replace)**
5. **Query interface**: Single tool or multiple tools? → **8 tools (5 core, 2 discovery, 1 debug)**

---

## Spec 020 Deliverables: Foundation Complete

### What Spec 020 Delivered (Validated and Working)

Spec 020 (Steering Documentation Refinement) is **complete** and delivered everything needed for MCP server implementation:

#### 1. Document-Level Metadata (Task 1 - Complete)

**What was delivered**:
```markdown
**Date**: 2025-10-20
**Last Reviewed**: 2025-12-15
**Purpose**: Clear description of document purpose
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: component-development, coding
```

**How MCP uses it**:
```typescript
// Filter documents by task type and layer
getSteeringDocumentation(taskType: 'component-development', layer: 2)
// Returns only Layer 2 documents relevant for component-development
```

**Validation**: ✅ All 12 steering documents have complete, parseable metadata

#### 2. Section-Level Conditional Markers (Task 3 - Complete)

**What was delivered**:
```markdown
**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Organizing existing files or creating new implementation files
- Need to understand the 3-step organization process

**Skip when**: 
- Just completing normal tasks without file organization
- Files are already organized correctly
```

**How MCP uses it**:
```typescript
// Filter sections by task type within documents
getSections(document, taskType: 'file-organization')
// Returns only sections with matching "Load when" criteria
```

**Validation**: ✅ All large documents (>200 lines) have section-level markers with clear load/skip criteria

**Impact**: Enables intelligent section-level filtering - the "context-aware retrieval" vision

#### 3. Four-Layer Progressive Disclosure (Task 2 - Complete)

**What was delivered**:
- **Layer 0**: Meta-guide (how to use the system)
- **Layer 1**: Foundational concepts (Core Goals, Personal Note, Start Up Tasks)
- **Layer 2**: Frameworks and patterns (Development Workflow, File Organization, Spec Planning)
- **Layer 3**: Specific implementations (Component Development, Build System, Technology Stack)

**How MCP uses it**:
```typescript
// Serve documents based on layer strategy
function getDocumentsForTask(taskType: TaskType) {
  return [
    ...getLayer0Docs(),           // Always serve (meta-guide)
    ...getLayer1Docs(),           // Always serve (foundational)
    ...getLayer2Docs(taskType),   // Task-specific (frameworks)
    // Layer 3 served on-demand
  ];
}
```

**Validation**: ✅ All 12 documents assigned to appropriate layers with clear purposes

**Impact**: Enables progressive retrieval - AI agents request depth as needed

#### 4. Standardized Task Vocabulary (Task 1 - Complete)

**What was delivered**:
- 15 standardized task types with stable names
- Kebab-case naming convention (e.g., `spec-creation`, `component-development`)
- Validation script ensures consistency

**Task Types**:
```typescript
type TaskType = 
  | 'spec-creation'
  | 'general-task-execution'
  | 'architecture'
  | 'coding'
  | 'accessibility-development'
  | 'validation'
  | 'debugging'
  | 'documentation'
  | 'maintenance'
  | 'performance-optimization'
  | 'file-organization'
  | 'refactoring'
  | 'migration'
  | 'hook-setup'
  | 'all-tasks';
```

**Validation**: ✅ All task types validated against standardized vocabulary (100% compliance)

**Impact**: Stable API for MCP server - task vocabulary becomes query language

#### 5. Validation Scripts and Maintenance (Tasks 4-5 - Complete)

**What was delivered**:
- `scripts/validate-metadata-parsing.js` - Validates metadata schema
- `scripts/validate-task-vocabulary.sh` - Validates task type consistency
- `scripts/validate-structure-parsing.js` - Validates content structure
- `scripts/validate-cross-reference-format.sh` - Validates link format
- `scripts/detect-stale-metadata.js` - Detects stale documentation
- Quarterly review process documentation
- Metadata maintenance guidelines

**Validation**: ✅ All validation scripts working, 100% compliance achieved

**Impact**: Ensures ongoing MCP-readiness through automated quality assurance

### MCP Implementation Strategy

**Foundation is Complete - Ready to Build**:

With Spec 020 complete, the MCP server can be implemented with confidence:

1. **Document-Level Filtering**: Use metadata (layer, relevantTasks) to filter documents
2. **Section-Level Filtering**: Use conditional markers (load/skip criteria) to filter sections
3. **Task-Type-Based Serving**: Use task vocabulary as stable API parameters
4. **Progressive Disclosure**: Use 4-layer structure for serving strategies
5. **Quality Assurance**: Use validation scripts to ensure ongoing correctness

**No Unknowns or Blockers**:
- ✅ Metadata structure is stable and validated
- ✅ Task vocabulary is stable (15 types, kebab-case)
- ✅ Layer assignments are clear (4 layers, distinct purposes)
- ✅ Section markers provide intelligent filtering capability
- ✅ Cross-references are 100% compliant
- ✅ Maintenance process ensures ongoing accuracy

**Implementation Confidence**: High - all assumptions validated, all deliverables working

### Maintenance and Evolution

**Ongoing Quality Assurance**:
- Quarterly review process ensures metadata stays current
- Validation scripts catch compliance issues early
- Staleness detection identifies documents needing review
- Metadata maintenance guidelines enable informed updates

**Evolution Path**:
- Task vocabulary can be extended (documented process)
- Layer structure can accommodate new documents
- Metadata schema can be extended with new fields
- Validation scripts can be enhanced with new checks

**Stability Guarantees**:
- No breaking changes to existing task type names
- Metadata format changes maintain backward compatibility
- Layer structure changes preserve existing assignments
- New features extend rather than replace existing capabilities

---

**Organization**: spec-guide  
**Scope**: 021-mcp-documentation-server
