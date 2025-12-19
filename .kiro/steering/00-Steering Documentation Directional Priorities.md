---
inclusion: always
---

**ALL AI AGENTS MUST read this doc COMPLETELY WITHOUT EXCEPTION regardless of current task priority.**

# Steering Documentation Directional Priorities

**Date**: 2025-10-20
**Updated**: December 14, 2025
**Purpose**: Meta-guide teaching AI agents how to use the conditional loading steering system
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 0
**Relevant Tasks**: all-tasks
**Last Reviewed**: 2025-12-15

## How This Steering System Works

The steering documentation uses **progressive disclosure** through a four-layer architecture to save tokens while ensuring you have the guidance you need:

### Four-Layer Structure

The documentation is organized like a meal experience:

- **Layer 0 (Reading the Menu)**: Meta-guide - How to use the steering system itself
- **Layer 1 (Appetizer)**: Foundational concepts - Essential context for all work
- **Layer 2 (Main Course)**: Frameworks and patterns - Core workflows and methodologies
- **Layer 3 (Dessert)**: Specific implementations - Domain-specific technical guidance

### Loading Strategy

- **Always-loaded docs**: Layers 0-2 are loaded for every task, but read strategically based on your work
- **Conditional docs**: Layer 3 documents only load when specific triggers match your task type
- **"AI Agent Reading Priorities" sections**: Guide you to relevant parts within documents

**Key principle**: Steering docs contain mission critical context for successful execution, but not ALL documents need to be read completely. Many contain conditional sections that only apply to specific task types. Learn to read strategically. If you later receive a request pertaining to topics you skipped, read the previously skipped, relevant section(s).

---

## When In Doubt

**If you're unsure which sections to read:**
- Default to reading MORE rather than less
- Prioritize understanding over execution
- Ask Peter: "I'm working on [task]. Should I read [section]?"
- Check if your uncertainty indicates a missing conditional trigger

**If you need information from a skipped section later:**
- Go back and read that section immediately
- Update your understanding of when that section applies
- Consider if the trigger conditions should be refined

---

## Tier 1: Always-Loaded Documents

### Documents with Strategic Reading (Use "AI Agent Reading Priorities")

These documents are always loaded but contain extensive conditional sections. **Read the "AI Agent Reading Priorities" section at the top FIRST** to understand what applies to your current task and what to skip.

#### 1. Development Workflow
**File**: #[[file:.kiro/steering/Development Workflow.md]]

**How to use**: Read the "AI Agent Reading Priorities" section at the top to determine which sections apply to your current work. Most tasks only need the Task Completion Workflow and Quality Standards sections.

#### 2. File Organization Standards
**File**: #[[file:.kiro/steering/File Organization Standards.md]]

**How to use**: Read the "AI Agent Reading Priorities" section at the top. If you're just completing a normal task, focus on the Required Metadata Fields and Organization Implementation sections.

### Documents to Read Completely (No Conditional Sections)

These documents are concise and should be read in full every time:

#### 3. Personal Note
**File**: #[[file:.kiro/steering/Personal Note.md]]

Simple, direct message from Peter about collaboration principles. Read completely.

#### 4. Start Up Tasks
**File**: #[[file:.kiro/steering/Start Up Tasks.md]]

Essential checklist for every task (date check, Jest commands, test selection). Read completely.

#### 5. Core Goals
**File**: #[[file:.kiro/steering/Core Goals.md]]

Core project context and development practices. Read completely.

---

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

### 2. Component Development and Practices Guide
**Access**: MCP query required (not auto-loaded)
**When needed**: Building or modifying components

**How to access**:
```
get_section({ path: ".kiro/steering/Component Development and Practices Guide.md", heading: "Token Selection Decision Framework" })
```

**Confirmation**: Reply "I've queried Component Development and Practices Guide via MCP!" after accessing

**How to use**: 
- Read the "AI Agent Reading Priorities" section at the top
- If creating requirements: Read Requirements Document Format only
- If creating design: Read Design Document Format only
- If creating tasks: Read Tasks Document Format and Task Type Classification only
- If executing tasks: Read Validation and Documentation sections for your task's tier only

**Confirmation**: Reply "I've reviewed the Spec Planning Standards!" after reading

### 2. Component Development and Practices Guide
**Trigger**: Building or modifying components

**File**: #[[file:.kiro/steering/Component Development and Practices Guide.md]]

**Confirmation**: Reply "I've reviewed the Component Development and Practices Guide!" after reading

### 3. A Vision of the Future
**Trigger**: Need greater context on DesignerPunk vision (optional)

**File**: #[[file:.kiro/steering/A Vision of the Future.md]]

### 4. Token Usage Guidance
**Trigger**: Working with tokens

**Files**: 
- #[[file:docs/token-system-overview.md]]
- Related guides in #[[file:.kiro/specs/typography-token-expansion]]

**Confirmation**: Reply "I've reviewed the Token guidance!" after reading

---

## MCP Documentation Server (Primary for Large Docs)

The MCP Documentation Server is the **primary source** for large steering documents. AI agents MUST query MCP for these documents rather than expecting them to be auto-loaded.

### MCP-Only Documents (Not Auto-Loaded)

These documents are available ONLY via MCP queries:

| Document | Path | Tokens |
|----------|------|--------|
| Spec Planning Standards | `.kiro/steering/Spec Planning Standards.md` | ~27,000 |
| Component Development and Practices Guide | `.kiro/steering/Component Development and Practices Guide.md` | ~9,000 |

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
   get_document_summary({ path: ".kiro/steering/Component Development and Practices Guide.md" })
   ```

3. **Request specific section** (~2,000 tokens)
   ```
   get_section({ path: ".kiro/steering/Component Development and Practices Guide.md", heading: "Token Selection Decision Framework" })
   ```

4. **Request full document** (only if needed)
   ```
   get_document_full({ path: ".kiro/steering/Component Development and Practices Guide.md" })
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

---

## Completion Confirmation

After reading all Tier 1 documents (strategically, using their priorities sections), demonstrate completion by outputting:

**"Hello, Peter. I've completed the required readings!"**

---

## Why This System Exists

**Problem**: AI agents were ignoring steering documentation or reading everything unnecessarily, wasting tokens.

**Solution**: 
- Aggressive explicit direction ensures compliance
- "AI Agent Reading Priorities" sections teach strategic reading
- Conditional loading only loads relevant documents
- This meta-guide teaches how to use the system

**Result**: You read what you need, when you need it, without wasting tokens on irrelevant sections.
