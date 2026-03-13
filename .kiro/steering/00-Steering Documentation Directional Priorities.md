---
inclusion: always
---

**ALL AI AGENTS MUST read this doc COMPLETELY WITHOUT EXCEPTION regardless of current task priority.**

# Steering Documentation Directional Priorities

**Date**: 2025-10-20
**Updated**: March 13, 2026
**Purpose**: Meta-guide teaching AI agents how to use the conditional loading steering system
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 0
**Relevant Tasks**: all-tasks
**Last Reviewed**: 2026-03-13

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

#### 1. Process-Development-Workflow
**File**: #[[file:.kiro/steering/Process-Development-Workflow.md]]

**How to use**: Read the "AI Agent Reading Priorities" section at the top to determine which sections apply to your current work. Most tasks only need the Task Completion Workflow and Quality Standards sections.

#### 2. Process-File-Organization
**File**: #[[file:.kiro/steering/Process-File-Organization.md]]

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

#### 6. AI-Collaboration-Principles
**File**: #[[file:.kiro/steering/AI-Collaboration-Principles.md]]

Core skepticism and candid communication requirements. Read completely.

#### 7. Spec-Feedback-Protocol
**File**: #[[file:.kiro/steering/Spec-Feedback-Protocol.md]]

Structured protocol for multi-agent feedback during spec formalization. Defines stamp format, @ mention scanning, feedback checkpoints, and context for reviewers. Read completely.

#### 8. Rosetta-Stemma-Systems-Overview
**File**: #[[file:.kiro/steering/Rosetta-Stemma-Systems-Overview.md]]

Visual architecture overview of Rosetta (token) + Stemma (component) systems. Contains Mermaid diagrams. Read completely.


---

## Tier 2: MCP-Only Documents

These documents are **NOT auto-loaded**. Query them via MCP when needed. Organized by domain.

---

### ⚠️ CRITICAL: Spec Planning Standards is an ABSOLUTE REQUIREMENT

**WHEN working on ANY spec documents (requirements.md, design.md, tasks.md), you MUST query Spec Planning Standards via MCP BEFORE creating or modifying these files.**

**This is NOT optional. This is NOT a suggestion. This is an ABSOLUTE REQUIREMENT.**

**Why this matters:**
- Spec documents have specific formatting requirements that are NOT intuitive
- Tasks.md has a precise structure including task type classification, validation tiers, agent assignments, and completion documentation paths
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

### Process & Workflow

| Document | Path | When to Load |
|----------|------|-------------|
| Spec Planning Standards | `Process-Spec-Planning.md` | Creating or updating spec documents (requirements.md, design.md, tasks.md) — **MANDATORY** |
| Task Type Definitions | `Process-Task-Type-Definitions.md` | Task classification, validation tier decisions |
| Cross-Reference Standards | `Process-Cross-Reference-Standards.md` | Adding cross-references to documentation |
| Hook Operations | `Process-Hook-Operations.md` | Debugging hooks, understanding automation, troubleshooting |
| Integration Methodology | `Process-Integration-Methodology.md` | Cross-spec integration, dependency management |
| Completion Documentation Guide | `Completion Documentation Guide.md` | Creating completion docs, two-document workflow |
| Release Management System | `Release Management System.md` | Release pipeline, task completion workflows |

### Token System — Rosetta

| Document | Path | When to Load |
|----------|------|-------------|
| Token Governance | `Token-Governance.md` | Token selection, usage, creation decisions |
| Token Quick Reference | `Token-Quick-Reference.md` | Quick token lookup, common patterns |
| Token Semantic Structure | `Token-Semantic-Structure.md` | Semantic token architecture, mode keys |
| Token Resolution Patterns | `Token-Resolution-Patterns.md` | Token resolution, alias chains |
| Rosetta System Architecture | `Rosetta-System-Architecture.md` | Token pipeline architecture, subsystem entry points |
| Rosetta System Principles | `rosetta-system-principles.md` | Core Rosetta design principles |
| Token-Family-Color | `Token-Family-Color.md` | Color token work |
| Token-Family-Typography | `Token-Family-Typography.md` | Typography token work |
| Token-Family-Spacing | `Token-Family-Spacing.md` | Spacing token work |
| Token-Family-Shadow | `Token-Family-Shadow.md` | Shadow token work |
| Token-Family-Motion | `Token-Family-Motion.md` | Motion/easing token work |
| Token-Family-Border | `Token-Family-Border.md` | Border token work |
| Token-Family-Radius | `Token-Family-Radius.md` | Radius token work |
| Token-Family-Opacity | `Token-Family-Opacity.md` | Opacity token work |
| Token-Family-Blend | `Token-Family-Blend.md` | Blend token work |
| Token-Family-Glow | `Token-Family-Glow.md` | Glow token work |
| Token-Family-Layering | `Token-Family-Layering.md` | Layering/z-index token work |
| Token-Family-Responsive | `Token-Family-Responsive.md` | Responsive token work |
| Token-Family-Accessibility | `Token-Family-Accessibility.md` | Accessibility token work |

### Component System — Stemma

| Document | Path | When to Load |
|----------|------|-------------|
| Component Development Guide | `Component-Development-Guide.md` | Building or modifying components — **key reference** |
| Component Development Standards | `Component-Development-Standards.md` | Component coding standards |
| Component Quick Reference | `Component-Quick-Reference.md` | Component selection, UI compositions |
| Component Inheritance Structures | `Component-Inheritance-Structures.md` | Base/variant inheritance patterns |
| Component Schema Format | `Component-Schema-Format.md` | Schema authoring, validation |
| Component Templates | `Component-Templates.md` | Component scaffolding templates |
| Component-Meta-Data-Shapes-Governance | `Component-Meta-Data-Shapes-Governance.md` | component-meta.yaml governance |
| Component-Primitive-vs-Semantic-Philosophy | `Component-Primitive-vs-Semantic-Philosophy.md` | Primitive vs semantic component decisions |
| Component Readiness Status | `Component-Readiness-Status.md` | Component maturity tracking |
| Component-MCP-Document-Template | `Component-MCP-Document-Template.md` | MCP document templates for components |
| Contract System Reference | `Contract-System-Reference.md` | Behavioral contracts, Concept Catalog — **core Stemma artifact** |
| Test-Behavioral-Contract-Validation | `Test-Behavioral-Contract-Validation.md` | Contract validation patterns |
| Stemma System Principles | `stemma-system-principles.md` | Core Stemma design principles |
| Platform Implementation Guidelines | `platform-implementation-guidelines.md` | Cross-platform implementation patterns |
| Cross-Platform Decision Framework | `Cross-Platform vs Platform-Specific Decision Framework.md` | Platform-specific vs shared decisions |
| Component-Family-Button | `Component-Family-Button.md` | Button family work |
| Component-Family-Form-Inputs | `Component-Family-Form-Inputs.md` | Form input family work |
| Component-Family-Navigation | `Component-Family-Navigation.md` | Navigation family work |
| Component-Family-Icon | `Component-Family-Icon.md` | Icon family work |
| Component-Family-Container | `Component-Family-Container.md` | Container family work |
| Component-Family-Progress | `Component-Family-Progress.md` | Progress family work |
| Component-Family-Chip | `Component-Family-Chip.md` | Chip family work |
| Component-Family-Badge | `Component-Family-Badge.md` | Badge family work |
| Component-Family-Avatar | `Component-Family-Avatar.md` | Avatar family work |
| Component-Family-Divider | `Component-Family-Divider.md` | Divider family work |
| Component-Family-Loading | `Component-Family-Loading.md` | Loading family work |
| Component-Family-Modal | `Component-Family-Modal.md` | Modal family work |
| Component-Family-Data-Display | `Component-Family-Data-Display.md` | Data display family work |

### Integration & Tooling

| Document | Path | When to Load |
|----------|------|-------------|
| DTCG Integration Guide | `DTCG-Integration-Guide.md` | DTCG format, tool integrations |
| Figma Workflow Guide | `Figma-Workflow-Guide.md` | Figma integration, token push, design extraction |
| Transformer Development Guide | `Transformer-Development-Guide.md` | Custom token transformers |
| MCP Integration Guide | `MCP-Integration-Guide.md` | Programmatic DTCG token consumption |
| Browser Distribution Guide | `Browser Distribution Guide.md` | Browser loading, web component distribution |
| BUILD-SYSTEM-SETUP | `BUILD-SYSTEM-SETUP.md` | Build system configuration |

### Testing

| Document | Path | When to Load |
|----------|------|-------------|
| Test Development Standards | `Test-Development-Standards.md` | Writing tests, test patterns, Stemma validators |
| Test Failure Audit Methodology | `Test-Failure-Audit-Methodology.md` | Test failure audits, clean exit audits, performance investigation |
| Test-Behavioral-Contract-Validation | `Test-Behavioral-Contract-Validation.md` | Contract validation test patterns |

### Architecture & Vision

| Document | Path | When to Load |
|----------|------|-------------|
| A Vision of the Future | `A Vision of the Future.md` | DesignerPunk vision context (optional) |
| AI-Collaboration-Framework | `AI-Collaboration-Framework.md` | Detailed collaboration protocols, validation gates |
| MCP Evolution Roadmap | `MCP-Evolution-Roadmap.md` | Known MCP gaps, trigger conditions |
| Technology Stack | `Technology Stack.md` | Technology choices, platform decisions |

### How to Access Any MCP-Only Document

All paths are relative to `.kiro/steering/`. Use progressive disclosure:


## MCP Documentation Server

The MCP Documentation Server is the **primary source** for all Tier 2 steering documents. Use progressive disclosure:

1. **Query documentation map** (~500 tokens)
   ```
   get_documentation_map()
   ```

2. **Request document summary** (~200 tokens)
   ```
   get_document_summary({ path: ".kiro/steering/Component-Development-Guide.md" })
   ```

3. **Request specific section** (~2,000 tokens)
   ```
   get_section({ path: ".kiro/steering/Component-Development-Guide.md", heading: "Token Selection Decision Framework" })
   ```

4. **Request full document** (only if needed)
   ```
   get_document_full({ path: ".kiro/steering/Component-Development-Guide.md" })
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

### Still Auto-Loaded (Tier 1)

These documents remain auto-loaded every session:
- This Meta-Guide (~2,000 tokens)
- Personal Note (~600 tokens)
- Core Goals (~550 tokens)
- Start Up Tasks (~700 tokens)
- AI-Collaboration-Principles (~800 tokens)
- Spec-Feedback-Protocol (~1,500 tokens)
- Rosetta-Stemma-Systems-Overview (~1,000 tokens)
- Process-Development-Workflow (~16,000 tokens) - strategic reading applies
- Process-File-Organization (~16,000 tokens) - strategic reading applies

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
- MCP progressive disclosure loads only what's needed
- This meta-guide teaches how to use the system

**Result**: You read what you need, when you need it, without wasting tokens on irrelevant sections.
