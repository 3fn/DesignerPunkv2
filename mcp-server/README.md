# MCP Documentation Server

**Version**: 0.1.0  
**Spec**: 021 - MCP Documentation Server  
**Status**: MVP Implementation

---

## Overview

The MCP Documentation Server is a Model Context Protocol server that provides on-demand documentation querying to reduce AI agent context load. Instead of loading entire documentation files upfront, AI agents can query specific sections, summaries, and metadata as needed.

### Key Features

- **Progressive Disclosure**: Query documentation map → summary → section for token-efficient access
- **Mechanical Parsing**: Extracts structure using regex/parsing without interpreting content
- **8 MCP Tools**: Complete toolkit for documentation discovery and retrieval
- **File Watching**: Automatic re-indexing when documentation changes
- **Token Efficiency**: Summaries (~200 tokens) vs full documents (2,000-15,000 tokens)

### Design Principles

- **Summary-First Approach**: Return metadata + outline before full content
- **Section-Level Granularity**: Retrieve specific sections by heading
- **No Context Load Loops**: Mechanical parsing prevents AI from following embedded instructions
- **Read-Only MVP**: Focus on querying, write operations deferred to post-MVP

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Kiro IDE                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              AI Agent                                 │  │
│  │  - Queries MCP for documentation on-demand           │  │
│  │  - Uses progressive disclosure workflow              │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MCP Protocol (stdio)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              MCP Documentation Server                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │Query Engine │  │Doc Indexer  │  │   File Watcher      │ │
│  │- Routes     │  │- Parses MD  │  │- Monitors changes   │ │
│  │- Validates  │  │- Extracts   │  │- Triggers reindex   │ │
│  │- Formats    │  │  metadata   │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Documentation Files (.kiro/steering/)          │
└─────────────────────────────────────────────────────────────┘
```

### Components

| Component | Purpose |
|-----------|---------|
| **Query Engine** | Routes requests, validates parameters, formats responses |
| **Document Indexer** | Parses markdown files, extracts metadata and structure |
| **File Watcher** | Monitors documentation directory for changes |
| **MCP Tools** | 8 tools for documentation querying |

---

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Install Dependencies

```bash
cd mcp-server
npm install
```

### Build

```bash
npm run build
```

---

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MCP_STEERING_DIR` | `.kiro/steering/` | Directory to index for documentation |

### Kiro IDE Configuration

Add to your `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "documentation": {
      "command": "node",
      "args": ["mcp-server/dist/index.js"],
      "env": {
        "MCP_STEERING_DIR": ".kiro/steering/"
      },
      "disabled": false,
      "autoApprove": [
        "get_documentation_map",
        "get_document_summary",
        "get_section"
      ]
    }
  }
}
```

---

## MCP Tools Reference

The server provides 8 MCP tools organized by purpose:

### Core Tools (6)

#### 1. `get_documentation_map`

Get the complete documentation structure with metadata for all indexed documents.

**Parameters**: None

**Returns**: Documentation map organized by layer (0-3)

**Example Request**:
```json
{
  "name": "get_documentation_map",
  "arguments": {}
}
```

**Example Response**:
```json
{
  "layers": {
    "0": {
      "name": "Meta-Guide",
      "documents": []
    },
    "2": {
      "name": "Frameworks and Patterns",
      "documents": [
        {
          "path": ".kiro/steering/Spec Planning Standards.md",
          "purpose": "Standards for creating specifications",
          "layer": 2,
          "relevantTasks": ["spec-creation"],
          "sections": ["Requirements Document Format", "Design Document Format"],
          "tokenCount": 15000
        }
      ]
    }
  }
}
```

---

#### 2. `get_document_summary`

Get document summary with metadata and outline (~200 tokens vs full document).

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `path` | string | Yes | Document path relative to project root |

**Example Request**:
```json
{
  "name": "get_document_summary",
  "arguments": {
    "path": ".kiro/steering/Component Development Guide.md"
  }
}
```

**Example Response**:
```json
{
  "path": ".kiro/steering/Component Development Guide.md",
  "metadata": {
    "purpose": "Guide AI agents in building components",
    "layer": 3,
    "relevantTasks": ["component-development", "token-selection"],
    "lastReviewed": "2025-12-15",
    "organization": "process-standard",
    "scope": "cross-project"
  },
  "outline": [
    {
      "heading": "Token Selection Decision Framework",
      "level": 2,
      "subsections": [
        "Step 1: Check Semantic Tokens First",
        "Step 2: Use Primitives Only When Unavoidable"
      ]
    }
  ],
  "crossReferences": [
    {
      "target": "docs/token-system-overview.md",
      "context": "For detailed token guidance"
    }
  ],
  "tokenCount": 8500
}
```

---

#### 3. `get_document_full`

Get complete document content when summaries are insufficient.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `path` | string | Yes | Document path relative to project root |

**Example Request**:
```json
{
  "name": "get_document_full",
  "arguments": {
    "path": ".kiro/steering/Start Up Tasks.md"
  }
}
```

**Example Response**:
```json
{
  "path": ".kiro/steering/Start Up Tasks.md",
  "content": "# Start Up Tasks\n\n**Date**: 2025-10-20\n...",
  "metadata": {
    "purpose": "Essential checklist for every task",
    "layer": 1
  },
  "tokenCount": 450
}
```

---

#### 4. `get_section`

Get specific section by heading for granular access.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `path` | string | Yes | Document path relative to project root |
| `heading` | string | Yes | Section heading to retrieve |

**Example Request**:
```json
{
  "name": "get_section",
  "arguments": {
    "path": ".kiro/steering/Spec Planning Standards.md",
    "heading": "Requirements Document Format"
  }
}
```

**Example Response**:
```json
{
  "path": ".kiro/steering/Spec Planning Standards.md",
  "heading": "Requirements Document Format",
  "content": "## Requirements Document Format\n\n### Structure\n...",
  "parentHeadings": [],
  "tokenCount": 1200
}
```

**Error Response** (section not found):
```json
{
  "error": "SectionNotFound",
  "message": "Section 'Invalid Heading' not found",
  "availableSections": [
    "Requirements Document Format",
    "Design Document Format",
    "Tasks Document Format"
  ]
}
```

---

#### 5. `list_cross_references`

List all cross-references in a document without following them.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `path` | string | Yes | Document path relative to project root |

**Example Request**:
```json
{
  "name": "list_cross_references",
  "arguments": {
    "path": ".kiro/steering/Core Goals.md"
  }
}
```

**Example Response**:
```json
{
  "path": ".kiro/steering/Core Goals.md",
  "crossReferences": [
    {
      "target": "preserved-knowledge/true-native-architecture-concepts.md",
      "context": "True Native Architecture",
      "section": "Core Project Context",
      "lineNumber": 15
    },
    {
      "target": "docs/token-system-overview.md",
      "context": "Token System",
      "section": "Core Project Context",
      "lineNumber": 16
    }
  ],
  "count": 2
}
```

---

#### 6. `validate_metadata`

Validate document metadata for debugging and quality assurance.

**Parameters**:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `path` | string | Yes | Document path relative to project root |

**Example Request**:
```json
{
  "name": "validate_metadata",
  "arguments": {
    "path": ".kiro/steering/Development Workflow.md"
  }
}
```

**Example Response** (valid):
```json
{
  "path": ".kiro/steering/Development Workflow.md",
  "valid": true,
  "metadata": {
    "date": "2025-10-20",
    "purpose": "Task completion workflow and git practices",
    "organization": "process-standard",
    "scope": "cross-project",
    "layer": "2",
    "relevantTasks": "all-tasks"
  },
  "issues": []
}
```

**Example Response** (issues found):
```json
{
  "path": ".kiro/steering/incomplete-doc.md",
  "valid": false,
  "metadata": {
    "date": "2025-10-20"
  },
  "issues": [
    {
      "field": "purpose",
      "issue": "Missing required field",
      "severity": "error"
    },
    {
      "field": "layer",
      "issue": "Missing required field",
      "severity": "error"
    }
  ]
}
```

---

### Health & Recovery Tools (2)

#### 7. `get_index_health`

Check index health status and metrics.

**Parameters**: None

**Example Request**:
```json
{
  "name": "get_index_health",
  "arguments": {}
}
```

**Example Response**:
```json
{
  "status": "healthy",
  "documentCount": 12,
  "indexSize": 45000,
  "lastUpdate": "2025-12-16T10:30:00Z",
  "errors": [],
  "warnings": [],
  "metrics": {
    "averageTokenCount": 3750,
    "totalSections": 156
  }
}
```

---

#### 8. `rebuild_index`

Manually rebuild the documentation index.

**Parameters**: None

**Example Request**:
```json
{
  "name": "rebuild_index",
  "arguments": {}
}
```

**Example Response**:
```json
{
  "success": true,
  "message": "Index rebuilt successfully",
  "documentCount": 12,
  "rebuildTimeMs": 245,
  "health": {
    "status": "healthy",
    "documentCount": 12,
    "errors": [],
    "warnings": []
  }
}
```

---

## Usage Patterns

### Progressive Disclosure Workflow

The recommended workflow for AI agents to minimize token usage:

```
1. Query documentation map (~500 tokens)
   → See all available documents with metadata
   → Identify relevant documents by layer and task type

2. Request document summary (~200 tokens)
   → Get metadata + outline for specific document
   → Understand document structure and topics

3. Request specific section (~2,000 tokens)
   → Get only the section needed for current work
   → Avoid loading irrelevant content

4. Request full document (only if needed) (~15,000 tokens)
   → Explicit decision to load complete content
   → Used when multiple sections needed
```

### Token Savings Example

| Approach | Tokens Used |
|----------|-------------|
| Load all docs upfront | ~112,000 |
| Map + summary + section | ~2,700 |
| **Savings** | **97.6%** |

---

## Error Handling

### Error Types

| Error | Description | Suggestion |
|-------|-------------|------------|
| `FileNotFound` | Document path doesn't exist | Check path spelling, use `get_documentation_map` to find valid paths |
| `SectionNotFound` | Heading doesn't exist in document | Response includes `availableSections` list |
| `MalformedMetadata` | Document metadata is incomplete | Use `validate_metadata` to see specific issues |
| `IndexNotReady` | Index not yet built | Wait for indexing or call `rebuild_index` |

### Error Response Format

```json
{
  "error": "ErrorType",
  "message": "Human-readable description",
  "suggestions": ["Helpful suggestion 1", "Helpful suggestion 2"]
}
```

---

## Development

### Running in Development

```bash
npm run dev
```

### Running Tests

```bash
npm test
```

### Project Structure

```
mcp-server/
├── src/
│   ├── index.ts              # Server entry point
│   ├── indexer/              # Document parsing and indexing
│   │   ├── DocumentIndexer.ts
│   │   ├── metadata-parser.ts
│   │   ├── heading-parser.ts
│   │   ├── section-parser.ts
│   │   ├── cross-ref-parser.ts
│   │   ├── conditional-filter.ts
│   │   └── index-health.ts
│   ├── query/                # Query engine
│   │   └── QueryEngine.ts
│   ├── watcher/              # File watching
│   │   └── FileWatcher.ts
│   ├── tools/                # MCP tool implementations
│   │   ├── get-documentation-map.ts
│   │   ├── get-document-summary.ts
│   │   ├── get-document-full.ts
│   │   ├── get-section.ts
│   │   ├── list-cross-references.ts
│   │   ├── validate-metadata.ts
│   │   ├── get-index-health.ts
│   │   ├── rebuild-index.ts
│   │   └── get-health-status.ts
│   ├── models/               # TypeScript interfaces
│   └── utils/                # Utilities
│       ├── token-estimator.ts
│       └── error-handler.ts
├── logs/                     # Server logs
├── tests/                    # Test files
├── package.json
├── tsconfig.json
└── README.md
```

---

## Related Documentation

- **Requirements**: `.kiro/specs/021-mcp-documentation-server/requirements.md`
- **Design**: `.kiro/specs/021-mcp-documentation-server/design.md`
- **Tasks**: `.kiro/specs/021-mcp-documentation-server/tasks.md`

---

## License

MIT

