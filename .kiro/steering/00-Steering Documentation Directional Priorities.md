# Steering Documentation Directional Priorities

**Date**: 2025-10-20
**Updated**: December 14, 2025
**Purpose**: Meta-guide teaching AI agents how to use the conditional loading steering system
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 0
**Relevant Tasks**: all-tasks
**Last Reviewed**: 2025-12-15

---
inclusion: always
---

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

## Tier 2: Conditional Documents

These documents are **only loaded when specific conditions are met**. When loaded, they include "AI Agent Reading Priorities" sections to help you read strategically.

### 1. Spec Planning Standards
**Trigger**: When creating or updating specification documents (requirements.md, design.md, tasks.md)

**File**: #[[file:.kiro/steering/Spec Planning Standards.md]]

**How to use**: 
- Read the "AI Agent Reading Priorities" section at the top
- If creating requirements: Read Requirements Document Format only
- If creating design: Read Design Document Format only
- If creating tasks: Read Tasks Document Format and Task Type Classification only
- If executing tasks: Read Validation and Documentation sections for your task's tier only

**Confirmation**: Reply "I've reviewed the Spec Planning Standards!" after reading

### 2. Component Development Guide
**Trigger**: Building or modifying components

**File**: #[[file:.kiro/steering/Component Development Guide.md]]

**Confirmation**: Reply "I've reviewed the Component Development Guide!" after reading

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
