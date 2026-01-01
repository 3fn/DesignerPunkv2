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

**⚠️ SPECIAL CASE: Spec Documents**
If you are about to create or modify **ANY spec document** (design-outline.md, requirements.md, design.md, tasks.md), you MUST query Spec Planning Standards via MCP FIRST. This is **not optional**. See "Tier 2: MCP-Only Documents" section for details.

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

---

### ⚠️ CRITICAL: Spec Planning Standards is an ABSOLUTE REQUIREMENT

**WHEN working on ANY spec documents (requirements.md, design.md, tasks.md), you MUST query Spec Planning Standards via MCP BEFORE creating or modifying these files.**

**This is NOT optional. This is NOT a suggestion. This is an ABSOLUTE REQUIREMENT.**

**Why this matters:**
- Spec documents have specific formatting requirements that are NOT intuitive
- Tasks.md has a precise structure including task type classification, validation tiers, and completion documentation paths
- Failure to query Spec Planning Standards WILL result in incorrectly formatted documents that require rework
- This has happened before and caused wasted effort - learn from this mistake

**What happens if you skip this:**
- ❌ Tasks will be formatted incorrectly (wrong structure, missing fields)
- ❌ Requirements will lack proper EARS format or acceptance criteria
- ❌ Design documents will miss required sections
- ❌ Peter will have to ask another agent to fix your work
- ❌ Time, tokens, and effort will be wasted

**The correct workflow:**
1. **BEFORE** creating/modifying any spec document, query the relevant section via MCP
2. Read the formatting requirements completely
3. Follow the format exactly
4. Confirm you've queried the standards in your response

---

### 1. Spec Planning Standards
**Access**: MCP query required (not auto-loaded)
**When needed**: Creating or updating specification documents (requirements.md, design.md, tasks.md)

**MANDATORY SECTIONS TO QUERY:**
- **For requirements.md**: Query "Requirements Document Format" section
- **For design.md**: Query "Design Document Format" section  
- **For tasks.md**: Query "Tasks Document Format" AND "Task Type Classification" sections

**How to access**:
```
get_document_summary({ path: ".kiro/steering/Spec Planning Standards.md" })
```

Then query the specific section you need:
```
get_section({ path: ".kiro/steering/Spec Planning Standards.md", heading: "Tasks Document Format" })
```

**REQUIRED Confirmation**: You MUST reply "I've queried Spec Planning Standards via MCP and reviewed [section name]!" after accessing. If you do not include this confirmation, you have NOT followed the requirement.

---

### 2. Component Development and Practices Guide
**Access**: MCP query required (not auto-loaded)
**When needed**: Building or modifying components

**How to access**:
```
get_section({ path: ".kiro/steering/Component Development and Practices Guide.md", heading: "Token Selection Decision Framework" })
```

**Confirmation**: Reply "I've queried Component Development and Practices Guide via MCP!" after accessing

---

### 3. A Vision of the Future
**When needed**: Need greater context on DesignerPunk vision (optional)

**File**: #[[file:.kiro/steering/A Vision of the Future.md]]

**How to access**:
```
get_document_summary({ path: ".kiro/steering/A Vision of the Future.md" })
```


---



### 4. Token Quick Reference
**When needed**: Working with design tokens, component development, token selection

**File**: #[[file:.kiro/steering/Token Quick Reference.md]]

**How to access**:
```
get_document_summary({ path: ".kiro/steering/Token Quick Reference.md" })
```

Then query the specific section you need:
```
get_section({ path: ".kiro/steering/Token Quick Reference.md", heading: "Token Documentation Map" })
get_section({ path: ".kiro/steering/Token Quick Reference.md", heading: "Common Patterns" })
```

**Confirmation**: Reply "I've queried Token Quick Reference via MCP!" after accessing

---

### 5. Browser Distribution Guide
**When needed**: Working with browser distribution, web components, or bundle loading

**File**: #[[file:.kiro/steering/Browser Distribution Guide.md]]

**How to access**:
```
get_section({ path: ".kiro/steering/Browser Distribution Guide.md", heading: "Troubleshooting" })
```

**Confirmation**: Reply "I've queried Browser Distribution Guide via MCP!" after accessing

---

### 6. Test Failure Audit Methodology
**When needed**: Conducting test failure audits, completing specs (clean exit audit), investigating performance issues

**File**: #[[file:.kiro/steering/Test Failure Audit Methodology.md]]

**How to access**:
get_document_summary({ path: ".kiro/steering/Test Failure Audit Methodology.md" })

Then query the specific section you need:
```
get_section({ path: ".kiro/steering/Test Failure Audit Methodology.md", heading: "Audit Workflow Steps" }) get_section({ path: ".kiro/steering/Test Failure Audit Methodology.md", heading: "Clean Exit Audit Requirement" }) get_section({ path: ".kiro/steering/Test Failure Audit Methodology.md", heading: "Performance Investigation Protocol" })
```

**Confirmation**: Reply "I've queried Test Failure Audit Methodology via MCP!" after accessing


### 7. Release Management System
**When needed**: Working with release management, understanding release pipeline, task completion workflows

**File**: #[[file:.kiro/steering/Release Management System.md]]

**How to access**:
```
get_document_summary({ path: ".kiro/steering/Release Management System.md" })
```

Then query the specific section you need:
```
get_section({ path: ".kiro/steering/Release Management System.md", heading: "Release Pipeline Architecture" })
get_section({ path: ".kiro/steering/Release Management System.md", heading: "AI Agent Decision Points" })
```

**Confirmation**: Reply "I've queried Release Management System via MCP!" after accessing

---

### 8. Component Quick Reference
**When needed**: Building UI compositions, selecting components, understanding component architecture

**File**: #[[file:.kiro/steering/Component Quick Reference.md]]

**How to access**:
```
get_document_summary({ path: ".kiro/steering/Component Quick Reference.md" })
```

Then query the specific section you need:
```
get_section({ path: ".kiro/steering/Component Quick Reference.md", heading: "Component Selection Guide" })
get_section({ path: ".kiro/steering/Component Quick Reference.md", heading: "Common UI Compositions" })
get_section({ path: ".kiro/steering/Component Quick Reference.md", heading: "MCP Query Examples" })
```

**Confirmation**: Reply "I've queried Component Quick Reference via MCP!" after accessing

---

## MCP Documentation Server (Primary for Large Docs)

The MCP Documentation Server is the **primary source** for large steering documents. AI agents MUST query MCP for these documents rather than expecting them to be auto-loaded.

### MCP-Only Documents (Not Auto-Loaded)

These documents are available ONLY via MCP queries:


| Document | Path |
|----------|------|
| Spec Planning Standards | `.kiro/steering/Spec Planning Standards.md` |
| Component Development and Practices Guide | `.kiro/steering/Component Development and Practices Guide.md` |
| Component Quick Reference | `.kiro/steering/Component Quick Reference.md` |
| Test Failure Audit Methodology | `.kiro/steering/Test Failure Audit Methodology.md` |

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


| Tool | Purpose |
|------|---------|
| `get_documentation_map` | List all documents with metadata |
| `get_document_summary` | Get metadata + outline |
| `get_document_full` | Get complete content |
| `get_section` | Get specific section by heading |
| `list_cross_references` | List document links |
| `validate_metadata` | Debug metadata issues |
| `get_index_health` | Check server status |
| `rebuild_index` | Force re-indexing |



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
