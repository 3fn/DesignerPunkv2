# Design Document: MCP Documentation Server

**Date**: 2025-12-16
**Spec**: 021 - MCP Documentation Server
**Status**: Design Phase
**Dependencies**: 
- Spec 020 (Steering Documentation Refinement) - Complete

---

## Overview

The MCP Documentation Server is a Model Context Protocol server that provides on-demand documentation querying to reduce AI agent baseline context usage from 56% (112k tokens) to roughly 15-20% (30-40k tokens). The server enables AI agents to query specific documentation sections rather than loading entire documents upfront.

**Core Innovation**: The server uses **mechanical parsing** (regex/parsing, not AI interpretation) to extract document structure and generate summaries, preventing the "context load loop" problem where AI agents reading documentation naturally would follow embedded instructions and exhaust context before completing work.

**Key Design Principles**:
- **Mechanical parsing**: Extract structure without interpreting content
- **Summary-first approach**: Return metadata + outline (~200 tokens) before full content
- **Progressive disclosure**: Enable section-level retrieval for granular access
- **Token efficiency**: Minimize token usage through intelligent chunking
- **Read-only MVP**: Focus on querying, defer write operations

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Kiro IDE                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              AI Agent                                 │  │
│  │  - Loads Layer 0-1 steering docs (20k tokens)        │  │
│  │  - Queries MCP for Layer 2-3 docs on-demand          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MCP Protocol
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              MCP Documentation Server                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Query Engine                                │  │
│  │  - Route queries to appropriate handlers              │  │
│  │  - Validate parameters                                │  │
│  │  - Return structured responses                        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Document Indexer                            │  │
│  │  - Parse markdown files mechanically                  │  │
│  │  - Extract metadata (regex, no interpretation)        │  │
│  │  - Build heading structure (H2/H3 levels)             │  │
│  │  - Generate summaries (metadata + outline)            │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           File Watcher                                │  │
│  │  - Monitor .kiro/steering/ for changes               │  │
│  │  - Trigger re-indexing on file modifications          │  │
│  │  - Update index structures automatically              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Index Storage                               │  │
│  │  - In-memory index structures                         │  │
│  │  - Document map (4-layer structure)                   │  │
│  │  - Section map (H2/H3 boundaries)                     │  │
│  │  - Cross-reference map                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ File System Access
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Documentation Files                            │
│  .kiro/steering/                                            │
│  ├─ Spec Planning Standards.md (Layer 2)                   │
│  ├─ Component Development Guide.md (Layer 3)               │
│  ├─ File Organization Standards.md (Layer 2)               │
│  └─ Task Type Definitions.md (Layer 2)                     │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

**Query Engine**:
- Routes incoming MCP tool calls to appropriate handlers
- Validates parameters (file paths, headings, task types)
- Formats responses according to MCP protocol
- Handles errors and returns clear messages

**Document Indexer**:
- Parses markdown files using mechanical extraction (regex/parsing)
- Extracts metadata without interpreting content
- Builds heading structure (H2/H3 levels with subsections)
- Generates summaries (metadata + outline, ~200 tokens)
- Identifies section boundaries for granular retrieval
- Extracts cross-references without following them

**File Watcher**:
- Monitors `.kiro/steering/` directory for file changes
- Detects file modifications, additions, deletions
- Triggers re-indexing for affected files
- Updates index structures automatically

**Index Storage**:
- Maintains in-memory index structures for fast queries
- Stores document map (4-layer structure with metadata)
- Stores section map (H2/H3 boundaries with token counts)
- Stores cross-reference map (links between documents)

---

## Components and Interfaces

### MCP Tools Interface

The server exposes 8 MCP tools organized by purpose:

#### Core Tools (MVP)

```typescript
interface GetDocumentationMapTool {
  name: 'get_documentation_map';
  description: 'Get complete documentation structure with metadata';
  inputSchema: {
    type: 'object';
    properties: {};  // No parameters
  };
}

interface GetDocumentSummaryTool {
  name: 'get_document_summary';
  description: 'Get document summary with outline';
  inputSchema: {
    type: 'object';
    properties: {
      path: {
        type: 'string';
        description: 'Document path (e.g., ".kiro/steering/Component Development Guide.md")';
      };
    };
    required: ['path'];
  };
}

interface GetDocumentFullTool {
  name: 'get_document_full';
  description: 'Get complete document content';
  inputSchema: {
    type: 'object';
    properties: {
      path: {
        type: 'string';
        description: 'Document path';
      };
    };
    required: ['path'];
  };
}

interface GetSectionTool {
  name: 'get_section';
  description: 'Get specific section by heading';
  inputSchema: {
    type: 'object';
    properties: {
      path: {
        type: 'string';
        description: 'Document path';
      };
      heading: {
        type: 'string';
        description: 'Section heading (e.g., "Token Selection Decision Framework")';
      };
    };
    required: ['path', 'heading'];
  };
}

interface ListCrossReferencesTool {
  name: 'list_cross_references';
  description: 'List cross-references in a document';
  inputSchema: {
    type: 'object';
    properties: {
      path: {
        type: 'string';
        description: 'Document path';
      };
    };
    required: ['path'];
  };
}
```

#### Discovery Tools (Post-MVP)

```typescript
interface SearchDocumentationTool {
  name: 'search_documentation';
  description: 'Search documentation by keyword';
  inputSchema: {
    type: 'object';
    properties: {
      query: {
        type: 'string';
        description: 'Search query';
      };
      max_results: {
        type: 'number';
        description: 'Maximum results (default: 5)';
      };
    };
    required: ['query'];
  };
}

interface SuggestRelevantDocsTool {
  name: 'suggest_relevant_docs';
  description: 'Suggest relevant documentation based on task context';
  inputSchema: {
    type: 'object';
    properties: {
      task_type: {
        type: 'string';
        description: 'Task type (e.g., "component-development")';
      };
      task_description: {
        type: 'string';
        description: 'Additional context (optional)';
      };
    };
    required: ['task_type'];
  };
}
```

#### Debugging Tools (MVP)

```typescript
interface ValidateMetadataTool {
  name: 'validate_metadata';
  description: 'Validate document metadata for debugging';
  inputSchema: {
    type: 'object';
    properties: {
      path: {
        type: 'string';
        description: 'Document path';
      };
    };
    required: ['path'];
  };
}
```

### Document Indexer Interface

```typescript
interface DocumentIndexer {
  /**
   * Index all documentation files in the specified directory
   * Uses mechanical parsing to extract structure without interpreting content
   */
  indexDirectory(directoryPath: string): Promise<void>;

  /**
   * Re-index a specific file after changes detected
   * Updates index structures without full re-scan
   */
  reindexFile(filePath: string): Promise<void>;

  /**
   * Get the complete documentation map (4-layer structure)
   * Returns metadata for all indexed documents
   */
  getDocumentationMap(): DocumentationMap;

  /**
   * Get summary for a specific document
   * Returns metadata + outline (~200 tokens)
   */
  getDocumentSummary(path: string): DocumentSummary;

  /**
   * Get full content for a specific document
   * Returns complete markdown content
   */
  getDocumentFull(path: string): DocumentFull;

  /**
   * Get specific section by heading
   * Returns section content with parent context
   */
  getSection(path: string, heading: string): Section;

  /**
   * List cross-references in a document
   * Returns links without following them
   */
  listCrossReferences(path: string): CrossReference[];

  /**
   * Validate metadata for a document
   * Returns validation results with issues
   */
  validateMetadata(path: string): MetadataValidation;
}
```

---

## Data Models

### Documentation Map

```typescript
interface DocumentationMap {
  layers: {
    [layerNumber: string]: {
      name: string;  // "Meta-Guide", "Foundation", "Frameworks and Patterns", "Specific Implementations"
      documents: DocumentMetadata[];
    };
  };
}

interface DocumentMetadata {
  path: string;                    // File path relative to project root
  purpose: string;                 // Purpose from metadata
  layer: number;                   // 0-3 layer number
  relevantTasks: string[];         // Task types from metadata
  lastReviewed: string;            // Last reviewed date
  sections: string[];              // H2 heading names
  tokenCount: number;              // Estimated token count for full document
}
```

### Document Summary

```typescript
interface DocumentSummary {
  path: string;
  metadata: {
    purpose: string;
    layer: number;
    relevantTasks: string[];
    lastReviewed: string;
    organization: string;
    scope: string;
  };
  outline: SectionOutline[];
  crossReferences: CrossReferenceInfo[];
  tokenCount: number;              // Full document token count
}

interface SectionOutline {
  heading: string;                 // H2 heading text
  level: number;                   // 2 for H2
  subsections: string[];           // H3 heading texts
}

interface CrossReferenceInfo {
  target: string;                  // Referenced document path
  context: string;                 // Context description
  section: string;                 // Source section containing reference
}
```

### Document Full

```typescript
interface DocumentFull {
  path: string;
  content: string;                 // Complete markdown content
  metadata: {
    purpose: string;
    layer: number;
    relevantTasks: string[];
    lastReviewed: string;
    organization: string;
    scope: string;
  };
  tokenCount: number;
}
```

### Section

```typescript
interface Section {
  path: string;
  heading: string;                 // Requested heading
  content: string;                 // Section markdown content
  parentHeadings: string[];        // Parent heading context (for nested sections)
  tokenCount: number;              // Section token count
}
```

### Cross Reference

```typescript
interface CrossReference {
  target: string;                  // Referenced document path
  context: string;                 // Context description from link text
  section: string;                 // Source section containing reference
  lineNumber: number;              // Line number in source file
}
```

### Metadata Validation

```typescript
interface MetadataValidation {
  path: string;
  valid: boolean;
  metadata: Record<string, any> | null;
  issues: ValidationIssue[];
}

interface ValidationIssue {
  field: string;                   // Metadata field with issue
  issue: string;                   // Description of the issue
  severity: 'error' | 'warning';
}
```

---

## Mechanical Parsing Architecture

### Why Mechanical Parsing is Critical

**The Context Load Loop Problem** (discovered in Spec 020):
1. AI agent reads documentation using natural reading tools
2. Document contains instructions (e.g., "AI Agent Reading Priorities")
3. Agent interprets these as directives and follows them
4. Following instructions requires reading MORE documents
5. Those documents contain MORE instructions
6. **Result**: Agent exhausts context before completing work

**Solution**: Mechanical parsing extracts structure without interpreting content.

### Parsing Strategy

**Metadata Extraction**:
```typescript
function extractMetadata(content: string): Metadata {
  // Use regex to extract metadata block (first 20 lines)
  const metadataRegex = /\*\*(\w+(?:\s+\w+)*)\*\*:\s*(.+)/g;
  const metadata: Record<string, string> = {};
  
  const lines = content.split('\n').slice(0, 20);
  for (const line of lines) {
    const match = metadataRegex.exec(line);
    if (match) {
      const key = match[1].toLowerCase().replace(/\s+/g, '');
      const value = match[2].trim();
      metadata[key] = value;
    }
  }
  
  return {
    purpose: metadata.purpose || '',
    layer: parseInt(metadata.layer) || 0,
    relevantTasks: metadata.relevanttasks?.split(',').map(t => t.trim()) || [],
    lastReviewed: metadata.lastreviewed || '',
    organization: metadata.organization || '',
    scope: metadata.scope || ''
  };
}
```

**Heading Structure Extraction**:
```typescript
function extractHeadingStructure(content: string): SectionOutline[] {
  const lines = content.split('\n');
  const outline: SectionOutline[] = [];
  let currentH2: SectionOutline | null = null;
  
  for (const line of lines) {
    // Match H2 headings (## Heading)
    const h2Match = /^##\s+(.+)$/.exec(line);
    if (h2Match) {
      currentH2 = {
        heading: h2Match[1].trim(),
        level: 2,
        subsections: []
      };
      outline.push(currentH2);
      continue;
    }
    
    // Match H3 headings (### Heading)
    const h3Match = /^###\s+(.+)$/.exec(line);
    if (h3Match && currentH2) {
      currentH2.subsections.push(h3Match[1].trim());
    }
  }
  
  return outline;
}
```

**Section Boundary Identification**:
```typescript
function extractSection(content: string, targetHeading: string): Section | null {
  const lines = content.split('\n');
  let inSection = false;
  let sectionContent: string[] = [];
  let sectionLevel = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is the target heading
    const headingMatch = /^(#{2,3})\s+(.+)$/.exec(line);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const heading = headingMatch[2].trim();
      
      if (heading === targetHeading) {
        // Found target heading - start capturing
        inSection = true;
        sectionLevel = level;
        sectionContent.push(line);
        continue;
      }
      
      if (inSection && level <= sectionLevel) {
        // Reached next section at same or higher level - stop capturing
        break;
      }
    }
    
    if (inSection) {
      sectionContent.push(line);
    }
  }
  
  if (sectionContent.length === 0) {
    return null;
  }
  
  return {
    heading: targetHeading,
    content: sectionContent.join('\n'),
    tokenCount: estimateTokenCount(sectionContent.join('\n'))
  };
}
```

**Cross-Reference Extraction**:
```typescript
function extractCrossReferences(content: string, filePath: string): CrossReference[] {
  const lines = content.split('\n');
  const references: CrossReference[] = [];
  let currentSection = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Track current section
    const headingMatch = /^##\s+(.+)$/.exec(line);
    if (headingMatch) {
      currentSection = headingMatch[1].trim();
    }
    
    // Extract markdown links [text](path)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(line)) !== null) {
      const context = match[1];
      const target = match[2];
      
      // Only include links to other documentation files
      if (target.endsWith('.md')) {
        references.push({
          target,
          context,
          section: currentSection,
          lineNumber: i + 1
        });
      }
    }
  }
  
  return references;
}
```

### Safety Mechanisms

**1. No Content Interpretation**:
- Parser extracts structure (headings, metadata) using regex
- Parser does NOT read or interpret document content
- Parser does NOT follow instructions or directives

**2. No Automatic Cross-Reference Following**:
- Parser lists cross-references without loading referenced documents
- AI agent must explicitly request referenced documents
- Prevents cascading document loads

**3. No Conditional Marker Interpretation**:
- Parser extracts "Load when" / "Skip when" criteria as data
- Parser does NOT interpret criteria as instructions to follow
- AI agent decides what to load based on task context

**4. Summary Generation Without LLM**:
- Summaries generated from metadata + heading structure
- No LLM calls or content analysis required
- Zero maintenance, deterministic results

---

## Token Efficiency Strategy

### Summary-First Approach

**Problem**: Loading full documents (2,000-15,000 tokens) exhausts context quickly.

**Solution**: Return summaries (~200 tokens) that enable informed decisions about what to load.

**Summary Components**:
1. **Metadata** (~50 tokens): Purpose, layer, relevant tasks, last reviewed
2. **Outline** (~100-150 tokens): H2/H3 heading structure
3. **Cross-references** (~50 tokens): Links to related documents
4. **Token count** (~10 tokens): Full document size

**Example Summary**:
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

**Token count**: ~200 tokens (vs 15,000 for full document)

### Section-Level Granularity

**Problem**: Sometimes need specific information, not entire document.

**Solution**: Enable retrieval of specific sections by heading.

**Section Retrieval**:
- AI agent sees outline in summary
- AI agent requests specific section (e.g., "Token Selection Decision Framework")
- Server returns only that section (~2,000 tokens vs 15,000 for full document)

**Example Section Request**:
```json
{
  "path": ".kiro/steering/Component Development Guide.md",
  "heading": "Token Selection Decision Framework"
}
```

**Example Section Response**:
```json
{
  "path": ".kiro/steering/Component Development Guide.md",
  "heading": "Token Selection Decision Framework",
  "content": "## Token Selection Decision Framework\n\n### Step 1: Check Semantic Tokens First...",
  "parentHeadings": [],
  "tokenCount": 2000
}
```

**Token count**: ~2,000 tokens (vs 15,000 for full document)

### Progressive Disclosure Workflow

**Typical AI Agent Workflow**:

1. **Query documentation map** (~500 tokens)
   - See all available documents with metadata
   - Identify relevant documents by layer and task type

2. **Request document summary** (~200 tokens)
   - Get metadata + outline for specific document
   - Understand document structure and topics

3. **Request specific section** (~2,000 tokens)
   - Get only the section needed for current work
   - Avoid loading irrelevant content

4. **Request full document** (only if needed) (~15,000 tokens)
   - Explicit decision to load complete content
   - Used when multiple sections needed

**Token Savings**:
- **Old approach**: Load all docs upfront (112k tokens)
- **New approach**: Map + summary + section (2,700 tokens)
- **Savings**: 97.6% reduction in typical case

---

## Error Handling

### Error Categories

**1. File Not Found**:
```typescript
{
  error: 'FileNotFound',
  message: 'Document not found: .kiro/steering/NonExistent.md',
  suggestions: [
    '.kiro/steering/Component Development Guide.md',
    '.kiro/steering/Spec Planning Standards.md'
  ]
}
```

**2. Section Not Found**:
```typescript
{
  error: 'SectionNotFound',
  message: 'Section "Invalid Heading" not found in Component Development Guide.md',
  availableSections: [
    'Token Selection Decision Framework',
    'Common Component Patterns',
    'Anti-Patterns to Avoid'
  ]
}
```

**3. Malformed Metadata**:
```typescript
{
  error: 'MalformedMetadata',
  message: 'Metadata validation failed for Component Development Guide.md',
  issues: [
    { field: 'layer', issue: 'Missing required field', severity: 'error' },
    { field: 'lastReviewed', issue: 'Invalid date format', severity: 'warning' }
  ],
  partialContent: '...'  // Return what we can parse
}
```

**4. Invalid Cross-Reference**:
```typescript
{
  error: 'InvalidCrossReference',
  message: 'Cross-reference target not found: docs/missing-file.md',
  source: {
    file: '.kiro/steering/Component Development Guide.md',
    section: 'Token Selection Decision Framework',
    lineNumber: 42
  }
}
```

### Error Logging

**Log Format**:
```typescript
interface ErrorLog {
  timestamp: string;           // ISO 8601 timestamp
  errorType: string;           // Error category
  filePath: string;            // Affected file path
  message: string;             // Error description
  context: Record<string, any>; // Additional context
}
```

**Log Example**:
```json
{
  "timestamp": "2025-12-16T10:30:00Z",
  "errorType": "FileNotFound",
  "filePath": ".kiro/steering/NonExistent.md",
  "message": "Document not found",
  "context": {
    "requestedBy": "AI Agent",
    "toolCalled": "get_document_summary"
  }
}
```

**Log Storage**:
- Logs written to `mcp-server/logs/errors.log`
- Rotate logs daily to prevent unbounded growth
- Keep last 7 days of logs for troubleshooting

### Error Recovery

**Graceful Degradation**:
- Return partial results when possible (e.g., malformed metadata)
- Provide suggestions for corrections (e.g., similar file names)
- Include context to help AI agents understand what went wrong

**No Silent Failures**:
- All errors logged with context
- All errors returned to AI agent with clear messages
- No assumptions or guessing about what user intended

---

## Conditional Section Filtering

### Overview

Conditional section filtering enables the MCP server to return only sections relevant to the AI agent's current task type, using the conditional marker format validated in Spec 020 Task 3.

### Conditional Marker Format (from Spec 020)

Spec 020 Task 3 delivered and validated this format:

```markdown
## Section Name (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- [Condition 1]
- [Condition 2]
- [Condition 3]

**Skip when**: 
- [Condition 1]
- [Condition 2]
- [Condition 3]

---

[Section content...]
```

### Parsing Strategy

**Mechanical Extraction**:
```typescript
function extractConditionalMarkers(content: string): ConditionalSection[] {
  const sections: ConditionalSection[] = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for conditional section marker
    if (line.includes('📖 CONDITIONAL SECTION')) {
      const section = {
        heading: extractPreviousHeading(lines, i),
        loadWhen: [],
        skipWhen: []
      };
      
      // Extract load conditions
      let inLoadWhen = false;
      let inSkipWhen = false;
      
      for (let j = i + 1; j < lines.length && j < i + 20; j++) {
        const condLine = lines[j];
        
        if (condLine.includes('**Load when**:')) {
          inLoadWhen = true;
          inSkipWhen = false;
        } else if (condLine.includes('**Skip when**:')) {
          inLoadWhen = false;
          inSkipWhen = true;
        } else if (condLine.startsWith('- ')) {
          const condition = condLine.substring(2).trim();
          if (inLoadWhen) {
            section.loadWhen.push(condition);
          } else if (inSkipWhen) {
            section.skipWhen.push(condition);
          }
        } else if (condLine.startsWith('---')) {
          break; // End of marker block
        }
      }
      
      sections.push(section);
    }
  }
  
  return sections;
}
```

### Filtering Logic

**Task-Type-Based Filtering**:
```typescript
function filterSectionsByTaskType(
  sections: Section[],
  conditionalMarkers: ConditionalSection[],
  taskType: string
): Section[] {
  return sections.filter(section => {
    const marker = conditionalMarkers.find(m => m.heading === section.heading);
    
    if (!marker) {
      // No conditional marker - include in all queries
      return true;
    }
    
    // Check skip conditions first
    for (const skipCondition of marker.skipWhen) {
      if (matchesCondition(skipCondition, taskType)) {
        return false; // Skip this section
      }
    }
    
    // Check load conditions
    if (marker.loadWhen.length === 0) {
      return true; // No load conditions - include by default
    }
    
    for (const loadCondition of marker.loadWhen) {
      if (matchesCondition(loadCondition, taskType)) {
        return true; // Load this section
      }
    }
    
    return false; // Load conditions exist but none match
  });
}

function matchesCondition(condition: string, taskType: string): boolean {
  // Simple keyword matching for MVP
  // Could be enhanced with more sophisticated matching later
  return condition.toLowerCase().includes(taskType.toLowerCase());
}
```

### Integration with Query Engine

**Enhanced get_section Tool**:
```typescript
interface GetSectionParams {
  path: string;
  heading: string;
  taskType?: string; // Optional task type for filtering
}

function getSection(params: GetSectionParams): Section {
  const document = loadDocument(params.path);
  const section = extractSection(document.content, params.heading);
  
  if (params.taskType) {
    const markers = extractConditionalMarkers(document.content);
    const filtered = filterSectionsByTaskType([section], markers, params.taskType);
    
    if (filtered.length === 0) {
      throw new Error(`Section "${params.heading}" not relevant for task type "${params.taskType}"`);
    }
  }
  
  return section;
}
```

---

## Index Health and Recovery

### Health Check System

**Index Validation on Startup**:
```typescript
class DocumentIndexer {
  async validateIndexHealth(): Promise<IndexHealth> {
    const health: IndexHealth = {
      healthy: true,
      documentCount: 0,
      indexSize: 0,
      lastUpdate: new Date(),
      issues: []
    };
    
    try {
      // Check index exists
      if (!this.index || this.index.size === 0) {
        health.healthy = false;
        health.issues.push({
          severity: 'error',
          message: 'Index is empty or not initialized'
        });
        return health;
      }
      
      // Validate each document in index
      for (const [path, metadata] of this.index.entries()) {
        // Check file still exists
        if (!fs.existsSync(path)) {
          health.healthy = false;
          health.issues.push({
            severity: 'error',
            message: `Indexed file no longer exists: ${path}`
          });
        }
        
        // Check metadata is valid
        if (!metadata.purpose || !metadata.layer) {
          health.issues.push({
            severity: 'warning',
            message: `Incomplete metadata for: ${path}`
          });
        }
      }
      
      health.documentCount = this.index.size;
      health.indexSize = this.calculateIndexSize();
      
    } catch (error) {
      health.healthy = false;
      health.issues.push({
        severity: 'error',
        message: `Index validation failed: ${error.message}`
      });
    }
    
    return health;
  }
}
```

### Automatic Recovery

**Re-indexing on Corruption**:
```typescript
async function ensureIndexHealth(): Promise<void> {
  const health = await this.validateIndexHealth();
  
  if (!health.healthy) {
    logger.error('Index corruption detected', { issues: health.issues });
    
    try {
      logger.info('Attempting automatic re-indexing...');
      await this.indexDirectory(this.documentDirectory);
      logger.info('Re-indexing successful');
    } catch (error) {
      logger.error('Re-indexing failed', { error: error.message });
      throw new Error('Index recovery failed - manual intervention required');
    }
  }
}
```

### Health Check Endpoint

**MCP Tool for Health Status**:
```typescript
interface GetHealthStatusTool {
  name: 'get_health_status';
  description: 'Get MCP server health status and index metrics';
  inputSchema: {
    type: 'object';
    properties: {};  // No parameters
  };
}

function getHealthStatus(): HealthStatus {
  const health = this.indexer.validateIndexHealth();
  
  return {
    status: health.healthy ? 'healthy' : 'unhealthy',
    indexMetrics: {
      documentCount: health.documentCount,
      indexSize: health.indexSize,
      lastUpdate: health.lastUpdate
    },
    issues: health.issues,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage()
  };
}
```

---

## Conditional Section Filtering

### Overview

Conditional section filtering enables AI agents to retrieve only sections relevant to their current task type, reducing token usage and improving query precision. This feature builds on the conditional markers delivered in Spec 020 Task 3.

### Conditional Marker Format (from Spec 020)

Spec 020 Task 3 established the standard format for conditional section markers:

```markdown
**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Organizing existing files or creating new implementation files
- Need to understand the 3-step organization process

**Skip when**: 
- Just completing normal tasks without file organization
- Files are already organized correctly
```

### Mechanical Extraction Strategy

**Marker Detection**:
```typescript
function extractConditionalMarkers(content: string): ConditionalMarkers | null {
  // Match conditional section marker
  const markerRegex = /\*\*📖 CONDITIONAL SECTION[^\n]*\*\*/;
  if (!markerRegex.test(content)) {
    return null;
  }
  
  // Extract "Load when" criteria
  const loadWhenRegex = /\*\*Load when\*\*:\s*\n((?:- .+\n)+)/;
  const loadMatch = loadWhenRegex.exec(content);
  const loadCriteria = loadMatch ? loadMatch[1].split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.replace(/^-\s*/, '').trim()) : [];
  
  // Extract "Skip when" criteria
  const skipWhenRegex = /\*\*Skip when\*\*:\s*\n((?:- .+\n)+)/;
  const skipMatch = skipWhenRegex.exec(content);
  const skipCriteria = skipMatch ? skipMatch[1].split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.replace(/^-\s*/, '').trim()) : [];
  
  return {
    loadCriteria,
    skipCriteria
  };
}
```

### Filtering Logic

**Task-Based Filtering**:
```typescript
function shouldIncludeSection(
  section: Section,
  taskType: string
): boolean {
  const markers = section.conditionalMarkers;
  
  // If no markers, include by default
  if (!markers) {
    return true;
  }
  
  // Check skip criteria first (explicit exclusion)
  for (const skipCriterion of markers.skipCriteria) {
    if (matchesTaskType(skipCriterion, taskType)) {
      return false;
    }
  }
  
  // Check load criteria (explicit inclusion)
  if (markers.loadCriteria.length > 0) {
    for (const loadCriterion of markers.loadCriteria) {
      if (matchesTaskType(loadCriterion, taskType)) {
        return true;
      }
    }
    // Has load criteria but none matched - exclude
    return false;
  }
  
  // No skip match, no load criteria - include by default
  return true;
}

function matchesTaskType(criterion: string, taskType: string): boolean {
  // Simple keyword matching (can be enhanced with fuzzy matching)
  const keywords = criterion.toLowerCase().split(/\s+/);
  const taskKeywords = taskType.toLowerCase().split('-');
  
  // Check if any task keyword appears in criterion
  return taskKeywords.some(keyword => 
    keywords.some(criterionWord => criterionWord.includes(keyword))
  );
}
```

### Query Interface

**get_section with Task Type**:
```typescript
interface GetSectionTool {
  name: 'get_section';
  inputSchema: {
    path: string;
    heading: string;
    taskType?: string;  // Optional task type for filtering
  };
}
```

**Example Query**:
```json
{
  "path": ".kiro/steering/Development Workflow.md",
  "heading": "Agent Hook Dependency Chains",
  "taskType": "debugging"
}
```

**Response**:
- If section has conditional markers and taskType matches "Load when" criteria → Return section
- If section has conditional markers and taskType matches "Skip when" criteria → Return empty with explanation
- If section has no conditional markers → Return section (always included)

### Integration with Document Indexer

**Index Structure**:
```typescript
interface SectionIndex {
  heading: string;
  content: string;
  conditionalMarkers: ConditionalMarkers | null;
  tokenCount: number;
}
```

**Indexing Process**:
1. Parse document into sections by heading
2. For each section, extract conditional markers (if present)
3. Store markers with section in index
4. Query time: Filter sections based on task type

### Safety Mechanisms

**No Interpretation**:
- Parser extracts "Load when" / "Skip when" criteria as data
- Parser does NOT interpret criteria as instructions to follow
- AI agent provides task type, server applies filtering mechanically

**Graceful Degradation**:
- If conditional markers are malformed, include section by default
- Log warning about malformed markers for debugging
- Never silently exclude content due to parsing errors

---

## Index Health and Recovery

### Health Check System

**Index Health Interface**:
```typescript
interface IndexHealth {
  status: 'healthy' | 'degraded' | 'failed';
  documentsIndexed: number;
  lastIndexTime: string;
  errors: string[];
  warnings: string[];
  metrics: {
    totalDocuments: number;
    totalSections: number;
    totalCrossReferences: number;
    indexSizeBytes: number;
  };
}
```

**Health Check Tool**:
```typescript
interface GetIndexHealthTool {
  name: 'get_index_health';
  description: 'Get index health status for debugging';
  inputSchema: {
    type: 'object';
    properties: {};  // No parameters
  };
}
```

**Health Determination**:
```typescript
function determineIndexHealth(): IndexHealth {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check for missing documents
  const expectedDocs = getExpectedDocuments();
  const indexedDocs = getIndexedDocuments();
  const missingDocs = expectedDocs.filter(doc => !indexedDocs.includes(doc));
  if (missingDocs.length > 0) {
    errors.push(`Missing documents: ${missingDocs.join(', ')}`);
  }
  
  // Check for stale index
  const lastIndexTime = getLastIndexTime();
  const fileModTimes = getFileModificationTimes();
  const staleFiles = fileModTimes.filter(mod => mod > lastIndexTime);
  if (staleFiles.length > 0) {
    warnings.push(`Stale index: ${staleFiles.length} files modified since last index`);
  }
  
  // Check for malformed metadata
  const malformedDocs = getDocumentsWithMalformedMetadata();
  if (malformedDocs.length > 0) {
    warnings.push(`Malformed metadata: ${malformedDocs.join(', ')}`);
  }
  
  // Determine status
  let status: 'healthy' | 'degraded' | 'failed';
  if (errors.length > 0) {
    status = 'failed';
  } else if (warnings.length > 0) {
    status = 'degraded';
  } else {
    status = 'healthy';
  }
  
  return {
    status,
    documentsIndexed: indexedDocs.length,
    lastIndexTime: lastIndexTime.toISOString(),
    errors,
    warnings,
    metrics: getIndexMetrics()
  };
}
```

### Index Validation on Startup

**Startup Validation**:
```typescript
async function validateIndexOnStartup(): Promise<void> {
  console.log('Validating index on startup...');
  
  // Check if index exists
  if (!indexExists()) {
    console.log('No index found, performing initial indexing...');
    await indexDirectory('.kiro/steering/');
    return;
  }
  
  // Check index integrity
  const health = determineIndexHealth();
  
  if (health.status === 'failed') {
    console.error('Index validation failed:', health.errors);
    console.log('Rebuilding index...');
    await rebuildIndex();
  } else if (health.status === 'degraded') {
    console.warn('Index validation warnings:', health.warnings);
    console.log('Re-indexing affected files...');
    await reindexStaleFiles();
  } else {
    console.log('Index validation passed');
  }
}
```

### Index Rebuild Command

**Rebuild Tool**:
```typescript
interface RebuildIndexTool {
  name: 'rebuild_index';
  description: 'Rebuild index from scratch (for recovery)';
  inputSchema: {
    type: 'object';
    properties: {};  // No parameters
  };
}
```

**Rebuild Implementation**:
```typescript
async function rebuildIndex(): Promise<void> {
  console.log('Starting index rebuild...');
  
  // Clear existing index
  clearIndex();
  
  // Re-index all documents
  await indexDirectory('.kiro/steering/');
  
  // Validate rebuilt index
  const health = determineIndexHealth();
  
  if (health.status === 'healthy') {
    console.log('Index rebuild successful');
  } else {
    console.error('Index rebuild completed with issues:', health.errors, health.warnings);
  }
}
```

### Index State Logging

**State Change Events**:
```typescript
interface IndexStateChange {
  timestamp: string;
  event: 'index_created' | 'index_updated' | 'index_rebuilt' | 'index_corrupted';
  details: Record<string, any>;
}
```

**Logging Strategy**:
```typescript
function logIndexStateChange(event: string, details: Record<string, any>): void {
  const stateChange: IndexStateChange = {
    timestamp: new Date().toISOString(),
    event: event as any,
    details
  };
  
  // Log to file
  fs.appendFileSync(
    'logs/index-state.log',
    JSON.stringify(stateChange) + '\n'
  );
  
  // Log to console
  console.log(`[Index State] ${event}:`, details);
}
```

**State Change Triggers**:
- Index created (initial startup)
- Index updated (file watcher detects changes)
- Index rebuilt (manual rebuild or recovery)
- Index corrupted (validation detects errors)

### Recovery Strategies

**Automatic Recovery**:
- File watcher detects changes → Re-index affected files
- Startup validation detects stale index → Re-index stale files
- Startup validation detects corruption → Rebuild entire index

**Manual Recovery**:
- `get_index_health` tool → Diagnose issues
- `rebuild_index` tool → Force complete rebuild
- `validate_metadata` tool → Check specific document

**Graceful Degradation**:
- If index is degraded but functional → Continue serving with warnings
- If index is failed → Attempt automatic rebuild
- If rebuild fails → Return clear error messages to AI agents

---

## Testing Strategy

### Unit Testing

**Mechanical Parsing Tests**:
- Test metadata extraction with various formats
- Test heading structure extraction (H2/H3 levels)
- Test section boundary identification
- Test cross-reference extraction
- Verify no content interpretation occurs

**Example Test**:
```typescript
describe('Metadata Extraction', () => {
  it('should extract metadata without interpreting content', () => {
    const content = `
**Date**: 2025-12-16
**Purpose**: Test document
**Layer**: 2
**Relevant Tasks**: component-development, coding

## AI Agent Reading Priorities
Read this section first!
    `;
    
    const metadata = extractMetadata(content);
    
    expect(metadata.purpose).toBe('Test document');
    expect(metadata.layer).toBe(2);
    expect(metadata.relevantTasks).toEqual(['component-development', 'coding']);
    // Verify parser did NOT follow "Read this section first!" instruction
  });
});
```

**Token Efficiency Tests**:
- Verify summaries use < 500 tokens
- Verify sections use < 3,000 tokens
- Verify full documents report accurate token counts
- Test token estimation algorithm accuracy

**Error Handling Tests**:
- Test file not found scenarios
- Test section not found scenarios
- Test malformed metadata handling
- Test invalid cross-reference handling
- Verify error messages are clear and actionable

### Integration Testing

**MCP Protocol Tests**:
- Test all 8 MCP tools with valid inputs
- Test error responses for invalid inputs
- Test response format compliance with MCP protocol
- Test query performance (< 500ms requirement)

**File Watching Tests**:
- Test re-indexing on file modification
- Test index updates on file addition
- Test index cleanup on file deletion
- Test re-indexing performance (< 2 seconds)

**End-to-End Workflow Tests**:
- Test typical AI agent workflow (map → summary → section)
- Test progressive disclosure pattern
- Test cross-reference navigation
- Test conditional section filtering

### Property-Based Testing

**Mechanical Parsing Properties**:
- **Property 1**: For any valid markdown file, metadata extraction should not interpret content
- **Property 2**: For any heading structure, section boundaries should be correctly identified
- **Property 3**: For any cross-reference, parser should list it without following it

**Token Efficiency Properties**:
- **Property 4**: For any document, summary token count should be < 500 tokens
- **Property 5**: For any section, section token count should be < 3,000 tokens

**Error Handling Properties**:
- **Property 6**: For any invalid file path, error should include clear message and suggestions
- **Property 7**: For any malformed metadata, error should include specific issues and partial content

### Performance Testing

**Query Performance**:
- Measure response time for all MCP tools
- Verify < 500ms requirement for typical queries
- Test with various document sizes
- Test with various query patterns

**Re-indexing Performance**:
- Measure re-indexing time for single file changes
- Verify < 2 seconds requirement
- Test with various file sizes
- Test with multiple concurrent changes

**Memory Usage**:
- Measure index storage memory footprint
- Test with full documentation set
- Verify reasonable memory usage (< 100MB for typical docs)

---

## Design Decisions

### Decision 1: Mechanical Parsing Over AI Interpretation

**Options Considered**:
1. Use AI/LLM to analyze and summarize documents
2. Use mechanical parsing (regex/parsing) to extract structure
3. Hybrid approach (mechanical for structure, AI for summaries)

**Decision**: Mechanical parsing only

**Rationale**:
- **Prevents context load loops**: AI reading docs would follow instructions and exhaust context
- **Deterministic results**: Regex/parsing produces consistent, predictable output
- **Zero maintenance**: No LLM calls means no API costs or latency
- **Proven approach**: Spec 020 validated mechanical extraction works effectively
- **Fast**: Regex/parsing is orders of magnitude faster than LLM calls

**Trade-offs**:
- ✅ **Gained**: Safety from context loops, deterministic behavior, zero cost, fast performance
- ❌ **Lost**: Semantic understanding, intelligent summarization
- ⚠️ **Risk**: May miss nuanced relationships between sections

**Counter-Arguments**:
- **Argument**: AI-generated summaries would be more helpful than metadata + outline
- **Response**: Metadata + outline provides sufficient context for informed decisions, and AI summaries risk context load loops

### Decision 2: Summary-First Approach (Option D)

**Options Considered**:
1. Always return full document content
2. Return summaries with links to full content
3. Return summaries with inline cross-reference content
4. Return summaries with outline and drill-down capability

**Decision**: Option 4 (Summary + Outline with Drill-Down)

**Rationale**:
- **Token efficient**: ~200 tokens for summary vs ~2,000-15,000 for full doc
- **Progressive disclosure**: Matches steering system philosophy
- **Informed decisions**: Agent sees outline before fetching full content
- **Navigable**: Can fetch specific sections, not just full document
- **Prevents context exhaustion**: Agent loads only what's needed

**Trade-offs**:
- ✅ **Gained**: 97.6% token reduction in typical case, informed decision-making
- ❌ **Lost**: Immediate access to full content (requires additional query)
- ⚠️ **Risk**: Agent may need multiple queries to find right section

**Counter-Arguments**:
- **Argument**: Multiple queries add latency vs loading full document once
- **Response**: Token savings far outweigh latency cost, and most queries need only specific sections

### Decision 3: Read-Only MVP

**Options Considered**:
1. Read-only access (query only)
2. Read-write access (query + update)
3. Read-write with approval workflow

**Decision**: Read-only access for MVP

**Rationale**:
- **Reduces risk**: AI agents cannot corrupt documentation
- **Simpler implementation**: No write operations, no conflict resolution
- **Validates approach**: Prove querying value before adding write complexity
- **Incremental investment**: Add write operations in post-MVP if needed

**Trade-offs**:
- ✅ **Gained**: Safety, simplicity, faster MVP delivery
- ❌ **Lost**: Ability for AI agents to propose documentation updates
- ⚠️ **Risk**: May need write operations sooner than expected

**Counter-Arguments**:
- **Argument**: AI agents could help improve documentation through proposed edits
- **Response**: Validate read-only approach first, then add write operations with proper safeguards

### Decision 4: No Caching Initially

**Options Considered**:
1. No caching (parse on every query)
2. In-memory caching with file watching
3. Persistent caching with invalidation

**Decision**: No caching initially, add if needed

**Rationale**:
- **Avoid premature optimization**: Documentation files are small, parsing is fast
- **Simpler implementation**: No cache invalidation logic needed
- **Easy to add later**: File watching + cache invalidation is ~1-2 hours effort
- **Validate performance first**: Measure actual performance before optimizing

**Trade-offs**:
- ✅ **Gained**: Simpler implementation, no cache invalidation bugs
- ❌ **Lost**: Potential performance improvement (likely negligible)
- ⚠️ **Risk**: May need caching if performance degrades

**Counter-Arguments**:
- **Argument**: Caching would improve query performance
- **Response**: Parsing is fast enough without caching, add only if measurements show need

### Decision 5: H2/H3 Section Granularity

**Options Considered**:
1. H2 only (major sections)
2. H2 + H3 (major + sub-sections)
3. All heading levels (H2-H6)

**Decision**: H2 + H3 section granularity

**Rationale**:
- **Right balance**: H2 provides major topics, H3 provides sub-topics
- **Sufficient precision**: Most documentation uses H2/H3 for structure
- **Avoids over-granularity**: H4-H6 would create too many small sections
- **Matches current docs**: Steering docs primarily use H2/H3 structure

**Trade-offs**:
- ✅ **Gained**: Good balance of granularity vs simplicity
- ❌ **Lost**: Access to H4-H6 sections (rarely used)
- ⚠️ **Risk**: May need deeper granularity for some documents

**Counter-Arguments**:
- **Argument**: Some documents use H4-H6 for detailed structure
- **Response**: H2/H3 covers 95% of use cases, can extend if needed

### Decision 6: Phase 1 Supplement, Phase 2 Replace

**Options Considered**:
1. Replace steering system immediately
2. Supplement steering system, migrate later
3. Run both systems permanently

**Decision**: Phase 1 supplement, Phase 2 replace

**Rationale**:
- **Validates effectiveness**: Prove MCP works before full migration
- **Reduces risk**: Current system stays intact during validation
- **Enables gradual adoption**: AI agents can learn MCP patterns
- **Clear migration path**: Phase 2 triggered when MCP proves better UX

**Trade-offs**:
- ✅ **Gained**: Low risk, validation period, gradual adoption
- ❌ **Lost**: Immediate full benefit (still loading some docs)
- ⚠️ **Risk**: May delay full migration if Phase 1 is "good enough"

**Counter-Arguments**:
- **Argument**: Running both systems adds complexity
- **Response**: Temporary complexity is worth validation and risk reduction

---

## Implementation Phases

### Phase 1: MVP (Week 1)

**Goal**: Prove the concept, reduce context usage to 25-30%

**Scope**:
- Simple file-based indexing (no database)
- Mechanical parsing (metadata + heading extraction)
- 5 core MCP tools (map, summary, full, section, cross-refs)
- 1 debugging tool (validate metadata)
- Three documents: Spec Planning Standards, Component Development Guide, File Organization Standards
- File watching for automatic re-indexing

**Success Criteria**:
- Baseline context drops to 25-30% (50-60k tokens)
- All queries respond in < 500ms
- Summaries use < 500 tokens
- Sections use < 3,000 tokens
- AI agents successfully complete complex tasks

**Deliverables**:
- MCP server implementation (Node.js/TypeScript)
- Document indexer with mechanical parsing
- Query engine with 6 MCP tools
- File watcher for automatic re-indexing
- Unit tests for parsing logic
- Integration tests for MCP tools
- Performance tests for query response time

### Phase 2: Refinement (Week 2)

**Goal**: Improve query accuracy and developer experience

**Scope**:
- Expand to all Layer 2-3 documents
- Add conditional section filtering by task type
- Improve error messages with suggestions
- Add query examples to meta-guide
- Performance optimization if needed

**Success Criteria**:
- Baseline context drops to 20-25% (40-50k tokens)
- Query accuracy > 90% (returns relevant section)
- AI agents complete complex tasks without context exhaustion
- Clear query examples in documentation

**Deliverables**:
- Expanded document coverage (all Layer 2-3 docs)
- Conditional section filtering implementation
- Enhanced error messages with suggestions
- Updated meta-guide with query examples
- Performance optimizations (if measurements show need)

### Phase 3: Enhancement (Future)

**Goal**: Add sophistication if needed

**Scope**:
- Semantic search (if heading-based insufficient)
- AI-powered smart suggestions based on task context
- Query analytics (what's being queried most)
- Auto-suggest related sections
- Write operations (propose documentation updates)

**Success Criteria**:
- Baseline context drops to 15-20% (30-40k tokens)
- Query precision improves with semantic search
- Smart suggestions reduce query iterations
- Query analytics inform documentation improvements

**Deliverables**:
- Semantic search implementation (if needed)
- Smart suggestion system (task-context-based)
- Query analytics dashboard
- Related section suggestions
- Write operations with approval workflow (if needed)

---

## Technology Stack

### Server Implementation

**Language**: TypeScript (Node.js)
- Type safety for data models and interfaces
- Excellent tooling and IDE support
- Native async/await for file operations
- Easy integration with MCP SDK

**MCP SDK**: `@modelcontextprotocol/sdk`
- Official MCP protocol implementation
- Tool registration and request handling
- Response formatting and error handling

**File System**: Node.js `fs` module
- File reading and parsing
- File watching for automatic re-indexing
- Directory scanning for indexing

**Parsing**: Regular expressions + string manipulation
- Metadata extraction from markdown
- Heading structure extraction
- Section boundary identification
- Cross-reference extraction

### Testing Framework

**Unit Testing**: Jest
- Fast test execution
- Excellent TypeScript support
- Snapshot testing for data structures
- Coverage reporting

**Property-Based Testing**: fast-check
- Generate random markdown structures
- Verify parsing properties hold across inputs
- Test edge cases automatically

**Integration Testing**: Jest + MCP test utilities
- Test MCP tool calls end-to-end
- Verify response format compliance
- Test error handling scenarios

### Development Tools

**TypeScript Compiler**: `tsc`
- Type checking during development
- Compilation to JavaScript for runtime

**Linting**: ESLint
- Code quality enforcement
- Consistent code style

**Formatting**: Prettier
- Automatic code formatting
- Consistent markdown formatting

---

## File Structure

```
mcp-server/
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── src/
│   ├── index.ts                 # MCP server entry point
│   ├── tools/                   # MCP tool implementations
│   │   ├── get-documentation-map.ts
│   │   ├── get-document-summary.ts
│   │   ├── get-document-full.ts
│   │   ├── get-section.ts
│   │   ├── list-cross-references.ts
│   │   └── validate-metadata.ts
│   ├── indexer/                 # Document indexing logic
│   │   ├── DocumentIndexer.ts   # Main indexer class
│   │   ├── metadata-parser.ts   # Metadata extraction
│   │   ├── heading-parser.ts    # Heading structure extraction
│   │   ├── section-parser.ts    # Section boundary identification
│   │   └── cross-ref-parser.ts  # Cross-reference extraction
│   ├── query/                   # Query engine
│   │   ├── QueryEngine.ts       # Main query engine class
│   │   └── token-estimator.ts   # Token count estimation
│   ├── watcher/                 # File watching
│   │   └── FileWatcher.ts       # File change detection
│   ├── models/                  # TypeScript interfaces
│   │   ├── DocumentationMap.ts
│   │   ├── DocumentSummary.ts
│   │   ├── Section.ts
│   │   └── CrossReference.ts
│   └── utils/                   # Utility functions
│       ├── error-handler.ts     # Error handling utilities
│       └── logger.ts            # Logging utilities
├── tests/
│   ├── unit/                    # Unit tests
│   │   ├── metadata-parser.test.ts
│   │   ├── heading-parser.test.ts
│   │   ├── section-parser.test.ts
│   │   └── cross-ref-parser.test.ts
│   ├── integration/             # Integration tests
│   │   ├── mcp-tools.test.ts
│   │   └── file-watcher.test.ts
│   └── property/                # Property-based tests
│       └── parsing-properties.test.ts
├── logs/                        # Error logs
│   └── errors.log
└── README.md                    # Server documentation
```

---

## Validation Criteria

### Token Efficiency Validation

- ✅ Token usage metrics logged for all operations (summary, section, full document)
- ✅ Before/after testing shows token reduction vs loading full documents
- ✅ Full document requests are explicit (not default)
- ✅ Token estimation accuracy within 10% of actual

### Safety Validation

- ✅ Server doesn't interpret document instructions
- ✅ Server doesn't follow cross-references automatically
- ✅ Server doesn't load related documents proactively
- ✅ Mechanical parsing uses regex/parsing, not AI

### Performance Validation

- ✅ Performance metrics logged for all operations (response time, parsing time, token estimation time)
- ✅ Baseline performance established through benchmarking
- ✅ Performance monitoring identifies bottlenecks
- ✅ No performance degradation with document growth

### Correctness Validation

- ✅ Metadata extraction accurate for all documents
- ✅ Heading structure matches source documents
- ✅ Section boundaries correctly identified
- ✅ Cross-references extracted without following
- ✅ Error messages clear and actionable

### End-to-End Workflow Validation

- ✅ AI agent completes complex task using MCP server without context exhaustion
- ✅ Progressive disclosure workflow (map → summary → section) works as expected
- ✅ Conditional section filtering returns only relevant sections for task type
- ✅ Error handling provides clear guidance and recovery paths

---

**Organization**: spec-guide
**Scope**: 021-mcp-documentation-server
