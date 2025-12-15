# MCP Documentation Server - Design Outline

**Date**: December 14, 2025  
**Purpose**: Explore design space for MCP server that provides on-demand documentation querying to reduce AI agent context usage  
**Status**: Design Exploration  
**Dependencies**: 
- **Spec 020 (Steering Documentation Refinement)** - CRITICAL DEPENDENCY
  - Status: Design exploration phase
  - Required for: Task-relevant metadata, layer assignments, standardized task vocabulary
  - Integration point: Metadata structure becomes MCP query interface
  - **Note**: This spec's design may evolve based on outcomes from Spec 020. Current design assumes metadata structure from refinement outline, but implementation should be flexible to accommodate refinement evolution.

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

#### 1. `query_documentation`
**Purpose**: Query documentation and return relevant sections

**Parameters**:
- `query` (string, required): Search query (e.g., "token selection framework")
- `max_results` (number, optional): Maximum sections to return (default: 3)
- `document` (string, optional): Limit search to specific document

**Returns**:
```json
{
  "results": [
    {
      "document": "Component Development Guide",
      "section": "Token Selection Decision Framework",
      "content": "### Step 1: Check Semantic Tokens First...",
      "relevance": 0.95
    }
  ]
}
```

#### 2. `list_documents`
**Purpose**: List available documentation

**Returns**:
```json
{
  "documents": [
    {
      "name": "Spec Planning Standards",
      "sections": ["Requirements Format", "Design Format", "Tasks Format"],
      "size_tokens": 30000
    }
  ]
}
```

#### 3. `get_section`
**Purpose**: Get specific section by path

**Parameters**:
- `document` (string, required): Document name
- `section` (string, required): Section heading

**Returns**: Full section content

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

## Open Questions

### Technical Questions

1. **Indexing Strategy**
   - Should we index at H2, H3, or both levels?
   - How do we handle nested sections (include parent context)?
   - What's the optimal section size (token count)?

2. **Query Matching**
   - Is heading-based search sufficient, or do we need full-text?
   - Should we support fuzzy matching?
   - How do we handle synonyms (e.g., "task types" vs "task classification")?

3. **Performance**
   - How often do we re-index (on file change, on query, scheduled)?
   - Should we cache query results?
   - What's acceptable query latency?

### Process Questions

4. **Documentation Maintenance**
   - Do we need to update documentation structure for better indexing?
   - Should we add metadata to markdown files (keywords, aliases)?
   - How do we validate that sections are queryable?

5. **AI Agent Training**
   - How do we teach AI agents to query effectively?
   - Should we provide query examples in meta-guide?
   - Do we need a "query cheat sheet"?

6. **Migration Strategy**
   - Do we move all three documents at once, or incrementally?
   - How do we validate that MCP queries return equivalent information?
   - What's the rollback plan if this doesn't work?

### Scope Questions

7. **What Else Should Move to MCP?**
   - Technology Stack (conditional, but large)?
   - Build System Setup (conditional, but large)?
   - Task Type Definitions (referenced frequently)?

8. **What Should Stay in Steering?**
   - Development Workflow (workflow vs reference)?
   - Core Goals (always needed vs queryable)?

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

## Notes and Observations

### Why This Will Work
- **Proven pattern**: MCP servers are designed for exactly this use case
- **Incremental value**: Even basic implementation provides immediate benefit
- **Low risk**: Documentation stays in markdown, easy to rollback
- **Scales naturally**: Adding more documents is straightforward

### Potential Challenges
- **Query formulation**: AI agents need to learn effective query patterns
- **Section boundaries**: Some concepts span multiple sections
- **Context continuity**: Queried sections lack surrounding context
- **Maintenance overhead**: Need to ensure documentation remains queryable

### Design Decisions to Make
1. **Architecture**: Simple file-based (A) vs Semantic (B) vs Hybrid (C)?
2. **Scope**: Three documents or more?
3. **Granularity**: H2 only or H2+H3?
4. **Migration**: All at once or incremental?
5. **Query interface**: Single tool or multiple tools?

---

## Dependency on Spec 020: Steering Documentation Refinement

### Critical Integration Points

This spec has a **critical dependency** on Spec 020 (Steering Documentation Refinement). The refinement work establishes the foundation that makes this MCP server effective:

#### 1. Task-Relevant Metadata (Spec 020 - Solution 1)

**What it provides**:
```markdown
**Conditional Section Metadata**:
- **Relevant Tasks**: component-development, token-work
- **Skip For**: spec-creation, debugging
- **Layer**: 2 (Framework)
```

**How MCP uses it**:
```typescript
// MCP query filters by task-relevant metadata
query({ 
  taskType: 'component-development',
  layer: 2 
})
// Returns only sections marked relevant for component-development at Layer 2
```

**Impact**: Transforms MCP from basic search to intelligent, context-aware retrieval

#### 2. Progressive Disclosure Layers (Spec 020 - Solution 2)

**What it provides**:
- Layer 0: Entry point (navigation)
- Layer 1: Principles (quick, actionable)
- Layer 2: Frameworks (detailed how-to)
- Layer 3: Reference (edge cases, troubleshooting)

**How MCP uses it**:
```typescript
// MCP tools mirror layer structure
mcp.tools = {
  'get-principles': 'Layer 1 - Quick guidance',
  'get-framework': 'Layer 2 - Detailed how-to',
  'get-reference': 'Layer 3 - Deep dives'
}
```

**Impact**: Enables progressive retrieval - AI requests depth as needed

#### 3. Standardized Task Vocabulary (Spec 020 - Solution 5)

**What it provides**:
- `spec-creation`, `component-development`, `token-work`
- `normal-task-execution`, `debugging`, `hook-setup`
- `testing`, `documentation`, `file-organization`

**How MCP uses it**:
```typescript
// Task vocabulary becomes query language
enum TaskType {
  SpecCreation = 'spec-creation',
  ComponentDevelopment = 'component-development',
  // ... matches Spec 020 vocabulary exactly
}
```

**Impact**: Consistent vocabulary across documentation, queries, and routing

### Evolution Flexibility

**Current Design Assumptions**:
- Metadata structure from Spec 020 refinement outline
- Task vocabulary as defined in refinement outline
- Layer assignments as proposed in refinement outline

**Flexibility Built In**:
- MCP query interface can adapt to metadata changes
- Tool definitions can evolve with vocabulary changes
- Layer routing can adjust to layer assignment changes

**If Spec 020 Evolves**:
- **Metadata format changes**: Update query parser, maintain backward compatibility
- **Task vocabulary changes**: Update TaskType enum, add aliases for old terms
- **Layer structure changes**: Adjust tool definitions, update routing logic
- **New metadata fields**: Extend query interface to support new filters

### Implementation Sequencing

**Recommended Approach**:
1. **Wait for Spec 020 Phase 1 completion** (task-relevant metadata, task vocabulary)
2. **Build MCP server using established metadata structure**
3. **Iterate as Spec 020 evolves** (Phase 2, Phase 3 refinements)

**Alternative Approach** (if parallel development needed):
1. **Build MCP with current metadata assumptions**
2. **Design for flexibility** (pluggable metadata parser, configurable vocabulary)
3. **Refactor as Spec 020 stabilizes**

**Risk**: Building MCP before Spec 020 stabilizes may require rework. Benefit: Parallel development accelerates overall timeline.

### Success Dependency

**MCP effectiveness depends on Spec 020 delivering**:
- ✅ Task-relevant metadata on all conditional sections
- ✅ Standardized task vocabulary consistently applied
- ✅ Layer assignments for progressive disclosure
- ✅ Metadata maintenance strategy (keeps metadata accurate)

**Without Spec 020**: MCP becomes basic search tool (Option A only)
**With Spec 020**: MCP becomes intelligent documentation assistant (Options A → B → C)

---

**Organization**: spec-guide  
**Scope**: 021-mcp-documentation-server
