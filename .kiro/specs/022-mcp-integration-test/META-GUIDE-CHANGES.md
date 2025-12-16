# Meta-Guide Changes for MCP Integration Test

**Purpose**: Instructions for Peter to manually update the meta-guide to enable MCP-only documentation access.

---

## Overview

To properly test MCP integration, we need to:
1. Update the meta-guide to instruct AI agents to use MCP as primary source
2. Change certain docs from `inclusion: always` to `inclusion: manual`

---

## CHANGE 1: Update Meta-Guide Section

**File**: `.kiro/steering/00-Steering Documentation Directional Priorities.md`

**Find this section** (around line 70-100):

```markdown
## MCP Documentation Server (Optional)

For complex tasks requiring extensive documentation access, the MCP Documentation Server provides on-demand querying to reduce context usage.

### When to Use MCP

- Complex tasks requiring multiple Layer 2-3 documents
- Context-constrained situations where baseline loading is insufficient
- Need for specific sections without loading full documents
```

**Replace the entire "MCP Documentation Server (Optional)" section with:**

```markdown
## MCP Documentation Server (Primary for Large Docs)

The MCP Documentation Server is the **primary source** for large steering documents. AI agents MUST query MCP for these documents rather than expecting them to be auto-loaded.

### MCP-Only Documents (Not Auto-Loaded)

These documents are available ONLY via MCP queries:

| Document | Path | Tokens |
|----------|------|--------|
| Spec Planning Standards | `.kiro/steering/Spec Planning Standards.md` | ~27,000 |
| Component Development Guide | `.kiro/steering/Component Development Guide.md` | ~7,000 |

### How to Access MCP-Only Documents

**Step 1**: Query the documentation map to confirm document exists
```
get_documentation_map()
```

**Step 2**: Get document summary to understand structure
```
get_document_summary({ path: ".kiro/steering/Spec Planning Standards.md" })
```

**Step 3**: Get specific section you need
```
get_section({ path: ".kiro/steering/Spec Planning Standards.md", heading: "Tasks Document Format" })
```

### When to Use MCP

- **ALWAYS** for Spec Planning Standards and Component Development Guide
- When you need specific sections from large documents
- When context is constrained

### Still Auto-Loaded (Small, Essential)

These documents remain auto-loaded:
- Personal Note (~600 tokens)
- Core Goals (~550 tokens)
- Start Up Tasks (~700 tokens)
- This Meta-Guide (~2,000 tokens)
- Development Workflow (~16,000 tokens) - strategic reading applies
- File Organization Standards (~16,000 tokens) - strategic reading applies

### Progressive Disclosure Workflow

1. **Query documentation map** (~500 tokens)
   ```
   get_documentation_map()
   ```

2. **Request document summary** (~200 tokens)
   ```
   get_document_summary({ path: ".kiro/steering/Component Development Guide.md" })
   ```

3. **Request specific section** (~2,000 tokens)
   ```
   get_section({ path: ".kiro/steering/Component Development Guide.md", heading: "Token Selection Decision Framework" })
   ```

4. **Request full document** (only if needed)
   ```
   get_document_full({ path: ".kiro/steering/Component Development Guide.md" })
   ```

### Available Tools

| Tool | Purpose | Typical Tokens |
|------|---------|----------------|
| `get_documentation_map` | List all documents with metadata | ~500 |
| `get_document_summary` | Get metadata + outline | ~200 |
| `get_document_full` | Get complete content | 2,000-15,000 |
| `get_section` | Get specific section by heading | ~2,000 |
| `list_cross_references` | List document links | ~100 |
| `validate_metadata` | Debug metadata issues | ~50 |
| `get_index_health` | Check server status | ~50 |
| `rebuild_index` | Force re-indexing | ~50 |

### Token Efficiency

- **Old approach**: Load all docs upfront (~112k tokens)
- **MCP approach**: Map + summary + section (~2,700 tokens)
- **Typical savings**: 97% token reduction

For detailed documentation, see `mcp-server/README.md`.
```

---

## CHANGE 2: Update Tier 2 Conditional Documents Section

**Find this section** (around line 115-145):

```markdown
## Tier 2: Conditional Documents

These documents are **only loaded when specific conditions are met**. When loaded, they include "AI Agent Reading Priorities" sections to help you read strategically.

### 1. Spec Planning Standards
**Trigger**: When creating or updating specification documents (requirements.md, design.md, tasks.md)

**File**: #[[file:.kiro/steering/Spec Planning Standards.md]]
```

**Replace with:**

```markdown
## Tier 2: MCP-Only Documents

These documents are **NOT auto-loaded**. Query them via MCP when needed.

### 1. Spec Planning Standards
**Access**: MCP query required (not auto-loaded)
**When needed**: Creating or updating specification documents

**How to access**:
```
get_section({ path: ".kiro/steering/Spec Planning Standards.md", heading: "Tasks Document Format" })
```

**Confirmation**: Reply "I've queried Spec Planning Standards via MCP!" after accessing

### 2. Component Development Guide
**Access**: MCP query required (not auto-loaded)
**When needed**: Building or modifying components

**How to access**:
```
get_section({ path: ".kiro/steering/Component Development Guide.md", heading: "Token Selection Decision Framework" })
```

**Confirmation**: Reply "I've queried Component Development Guide via MCP!" after accessing
```

---

## CHANGE 3: Update Document Front Matter

**File 1**: `.kiro/steering/Spec Planning Standards.md`

Find at the top:
```yaml
inclusion: conditional
trigger: spec-creation
```

Change to:
```yaml
inclusion: manual
```

**File 2**: `.kiro/steering/Component Development Guide.md`

Find at the top:
```yaml
inclusion: conditional
trigger: component-development, token-selection, cross-platform-components
```

Change to:
```yaml
inclusion: manual
```

---

## Testing Instructions

After making these changes:

1. **Restart Kiro** to pick up the new steering configuration
2. **Start a new chat session**
3. **Ask the AI to execute Task 1.1** from spec 022-mcp-integration-test
4. **Observe**: The AI should query MCP for Component Development Guide (not have it auto-loaded)
5. **Success**: AI completes task using MCP queries

---

## Rollback Instructions

If the test fails, revert the changes:

1. Change `inclusion: manual` back to `inclusion: conditional` in both docs
2. Restore the original "MCP Documentation Server (Optional)" section in meta-guide
3. Restart Kiro
