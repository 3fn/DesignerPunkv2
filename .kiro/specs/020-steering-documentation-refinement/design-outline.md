# Steering Documentation Refinement - Design Outline

**Date**: December 14, 2025  
**Updated**: December 14, 2025 (promoted to formal spec)  
**Spec**: 020 - Steering Documentation Refinement  
**Purpose**: Refine steering documentation system using progressive disclosure and task-relevant metadata  
**Organization**: spec-guide  
**Scope**: steering-documentation-refinement  
**Status**: Design outline (formal spec in progress)  
**Dependencies**: None  
**Dependents**: Spec 021 (MCP Documentation Server) - depends on refined steering structure

---

## Context

An AI agent provided detailed feedback on the steering documentation system after using it in practice. The feedback identified what works well and specific areas for improvement. This design outline explores the refinements that will be formalized in requirements.md, design.md, and tasks.md.

**Source**: `.kiro/specs/020-steering-documentation-refinement/ai-agent-feedback.md`

**Key Insight from Discussion**: The documentation should follow a "progressive disclosure" model - like an appetizer leading to a full course meal. Each layer should be complete enough to act on, but point to the next layer for depth.

**Dependency Note**: Spec 021 (MCP Documentation Server) will build on the refined steering documentation structure established by this spec. The progressive disclosure model and task-relevant metadata patterns will inform how MCP documentation is organized and served to AI agents.

---

## What Works Well (Keep These)

### 1. AI Agent Reading Priorities Sections
- **What**: Section at top of each doc guiding strategic reading
- **Why it works**: Immediately tells agents what to focus on based on task type
- **Evidence**: Agent reported "saved significant token usage and cognitive load"
- **Decision**: Keep and potentially enhance

### 2. Conditional Loading System
- **What**: Trigger-based loading of documents (Tier 1 always, Tier 2 conditional)
- **Why it works**: Only loads relevant documents for current task
- **Evidence**: Agent didn't get Spec Planning Standards when working on components
- **Decision**: Keep as-is

### 3. Meta-Guide (00-Steering Documentation)
- **What**: "How to use this system" document
- **Why it works**: Teaches the pattern immediately
- **Evidence**: Agent understood strategic reading approach from this doc
- **Decision**: Keep, potentially add task type classifier

### 4. Clear Hierarchical Structure
- **What**: Tier 1 (always-loaded) vs Tier 2 (conditional) distinction
- **Why it works**: Logical organization, clear boundaries
- **Evidence**: Agent correctly identified which tier each doc belonged to
- **Decision**: Keep as-is

---

## Problems Identified

### Problem 1: Redundancy Between Documents

**Specific Examples**:
- Token selection appears in Component Development Guide (full framework), Core Goals (principle), BUILD-SYSTEM-SETUP (mention)
- Metadata requirements in File Organization Standards (detailed), Development Workflow (procedural mention), Component Development Guide (reference)
- Task completion process in Development Workflow (complete), Spec Planning Standards (mention), 00-Steering Documentation (example)

**Agent's Concern**: "I wondered 'did I already read this?'"

**Root Cause**: Same content with same framing in multiple places creates confusion about which is authoritative

**Not Actually Redundancy**: When content serves different purposes (principle vs framework, procedural vs conceptual), it's layered learning, not redundancy

---

### Problem 2: Length of Always-Loaded Documents

**Specific Documents**:
- Development Workflow: Very long with large conditional sections
- File Organization Standards: Very long with extensive conditional content

**Agent's Concern**: "Visual noise" from scrolling past conditional sections even when knowing to skip them

**Root Cause**: Conditional sections are marked at document level but not section level, making it hard to quickly identify what to skip while scanning

---

### Problem 3: "Read Completely" vs "Read Strategically" Distinction

**Current State**:
- Some docs say "read completely" (Personal Note, Core Goals, Start Up Tasks)
- Others say "use priorities section" (Development Workflow, File Organization Standards)

**Agent's Concern**: Even "read completely" docs could benefit from priorities guidance

**Root Cause**: "Read completely" docs vary in length and relevance - some are truly quick (Personal Note), others have more content (Core Goals)

---

### Problem 4: Implicit Task Context Assumptions

**Agent's Experience**: Had to infer task type to know what to read:
- "I'm implementing component code" → Read Component Development Guide
- "I'm not creating specs" → Skip Spec Planning Standards
- "I'm not debugging hooks" → Skip those sections

**Agent's Concern**: Priorities sections assume agent knows their task type

**Root Cause**: No explicit task type classification at entry point (meta-guide)

---

## Core Concept: Progressive Disclosure

**Metaphor**: Documentation as a meal with multiple courses - appetizer → main course → dessert

**Principle**: Each layer is complete enough to act on, but points to the next layer for depth

### The Four Layers

– Note: **Length** is ideal, but not strictly required.

#### Layer 0: Entry Point (Meta-Guide)
- **Purpose**: "Here's how to navigate the meal"
- **Document**: 00-Steering Documentation Directional Priorities.md
- **Content**: Task type classifier, navigation map, system overview
- **Length**: ~20 lines
- **Read**: Completely
- **Note**: The `00-` prefix ensures this is read first

#### Layer 1: Principles (Always-Loaded)
- **Purpose**: "Here's what matters and why"
- **Documents**: Core Goals, Start Up Tasks, Personal Note
- **Content**: Core principles, essential procedures, pointers to detail
- **Length**: ~15-20 lines per doc
- **Read**: Completely
- **Pointers to**: Layer 2 frameworks for detailed "how-to"

#### Layer 2: Frameworks and Patterns (Conditional)
- **Purpose**: "Here's how to do it" (frameworks) and "What works well" (patterns)
- **Documents**: Component Development Guide, Spec Planning Standards, Development Workflow
- **Content**: Step-by-step frameworks, reusable patterns, anti-patterns, code examples, component-specific docs
- **Length**: As long as needed
- **Read**: Strategically using "AI Agent Reading Priorities"
- **Loaded when**: Task type matches trigger
- **Pointers to**: Layer 3 reference for edge cases
- **Note**: "Frameworks" = processes/workflows, "Patterns" = reusable solutions/examples

#### Layer 3: Reference (Conditional Sections)
- **Purpose**: "Here's the edge case / troubleshooting / deep dive"
- **Sections**: Agent Hook Dependency Chains, detailed examples, troubleshooting
- **Content**: Troubleshooting, edge cases, deep dives
- **Length**: As long as needed
- **Read**: Only when needed (check section metadata)
- **Loaded within**: Layer 1 and Layer 2 documents

---

## Proposed Solutions

### Solution 1: Task-Relevant Metadata for Conditional Sections (PRIORITY)

**Concept**: Add structured metadata to conditional sections that makes relevance machine-readable

**Current State**:
```markdown
## Agent Hook Dependency Chains (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**
```

**Proposed Enhancement**:
```markdown
---

## 📖 Agent Hook Dependency Chains

**Conditional Section Metadata**:
- **Last Reviewed**: 2025-12-14
- **Relevant Tasks**: debugging, hook-setup
- **Skip For**: general-task-execution, spec-creation, coding
- **Layer**: 3 (Reference)

**Load when**: 
- Debugging hook issues or automation failures
- Understanding hook dependencies and execution order
- Setting up new hooks or modifying existing ones

**Skip when**: 
- Normal task execution
- Spec creation or documentation work
- Hooks are working correctly

---
```

**Standardized Task Type Vocabulary** (14 types):
- `spec-creation` - Creating or updating specification documents (requirements.md, design.md, tasks.md)
- `general-task-execution` - Standard task completion workflow without specialized focus
- `architecture` - Making architectural decisions, designing system structure, establishing patterns
- `coding` - Implementing features, writing code, building functionality
- `accessibility-development` - Developing with accessibility requirements, WCAG compliance work
- `validation` - Validating implementations, checking compliance, quality assurance
- `debugging` - Troubleshooting issues, diagnosing problems, fixing bugs
- `documentation` - Creating or updating documentation, writing guides
- `maintenance` - Ongoing maintenance work, updates, keeping systems current
- `performance-optimization` - Performance-focused work, optimization, efficiency improvements
- `file-organization` - Organizing files and metadata, maintaining project structure
- `refactoring` - Code restructuring without changing behavior, improving code quality
- `migration` - Moving or upgrading code, systems, or dependencies
- `hook-setup` - Setting up or modifying automation, configuring hooks

**Benefits**:
- Makes "should I read this?" decision instant and unambiguous
- Machine-readable for MCP-based documentation serving (Spec 021 dependency)
- Establishes consistent vocabulary across system
- Eliminates cognitive load of deciding relevance
- "Last Reviewed" date enables metadata staleness detection during audits

**Trade-offs**:
- Adds metadata blocks to sections (more visual content)
- Requires maintaining task type vocabulary
- Need to ensure metadata stays accurate as sections evolve

**Implementation Effort**: Low (add metadata blocks to existing sections)
**Risk**: None (purely additive)
**Priority**: HIGH - This solves the core "should I read this?" problem

---

### Solution 2: Progressive Disclosure Map in Meta-Guide

**Concept**: Make the "appetizer to full course" metaphor explicit in the meta-guide

**Proposed Addition** (to 00-Steering Documentation, after "How This Steering System Works"):

```markdown
## Progressive Disclosure: How to Navigate the Documentation

Think of the steering documentation as a meal with multiple courses:

**🍽️ Layer 0: Entry Point (You Are Here)**
- **Purpose**: Understand how to navigate
- **Documents**: This meta-guide (00-Steering Documentation)
- **Read**: Completely

**🥗 Layer 1: Principles (Always-Loaded)**
- **Purpose**: Core principles and essential procedures
- **Documents**: Core Goals, Start Up Tasks, Personal Note
- **Read**: Completely
- **Pointers to**: Layer 2 frameworks for detailed "how-to"

**🍝 Layer 2: Frameworks and Patterns (Conditional)**
- **Purpose**: Step-by-step frameworks and reusable patterns
- **Documents**: Component Development Guide, Spec Planning Standards
- **Read**: Strategically using "AI Agent Reading Priorities"
- **Loaded when**: Task type matches trigger
- **Pointers to**: Layer 3 reference for edge cases

**🍰 Layer 3: Reference (Conditional Sections)**
- **Purpose**: Troubleshooting, edge cases, deep dives
- **Sections**: Agent Hook Dependency Chains, detailed examples
- **Read**: Only when needed (check section metadata)
- **Loaded within**: Layer 1 and Layer 2 documents

**Navigation Rule**: Each layer is complete enough to act on, but points to the next layer for depth. Start at Layer 1, follow pointers as needed.
```

**Benefits**:
- Makes progressive disclosure explicit and visual
- Provides clear mental model for navigation
- Uses memorable metaphor (meal courses)
- Shows relationship between layers
- Reinforces "complete enough to act on" principle

**Trade-offs**:
- Adds content to meta-guide (but high-value at top)
- Requires maintaining layer assignments

**Implementation Effort**: Low
**Risk**: None (purely additive)
**Priority**: HIGH - Establishes clear navigation model

---

### Solution 3: Tighten Core Goals to Pure Principles (Layer 1)

---

**Concept**: Define clear threshold for when documents should be "read completely" vs "read strategically"

**Current State**:
- Personal Note: ~10 lines → "read completely"
- Core Goals: ~30 lines → "read completely"
- Development Workflow: ~500+ lines → "read strategically"

**Proposed Threshold**: 
- **≤20 lines**: "Read completely" (Layer 1 - Principles)
- **>20 lines**: "Read strategically using AI Agent Reading Priorities" (Layer 2 - Frameworks)

**Rationale**:
- Keeps Layer 1 truly quick to consume
- Forces discipline in keeping principles concise
- Clear, objective criterion

**Implementation**:
- Document threshold in meta-guide
- Review all "read completely" docs against threshold
- Tighten docs that exceed threshold (like Core Goals)

**Benefits**:
- Clear, consistent expectations
- Objective criterion (not subjective judgment)
- Reinforces Layer 1 as principles-only
- Makes "read completely" designation meaningful

**Trade-offs**:
- Some docs may need tightening to meet threshold
- Requires discipline to keep Layer 1 docs brief

**Implementation Effort**: Low (just document the rule + review docs)
**Risk**: None (just clarification)
**Priority**: LOW - Nice to have, but not critical

---

### Solution 4: Enhanced Section-Level Conditional Markers

**Concept**: Combine visual markers with task-relevant metadata (builds on Solution 1)

---

**Note**: This builds on Solution 1 (Task-Relevant Metadata) by adding visual boundaries

**Current State**:
```markdown
## Agent Hook Dependency Chains (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**
```

**Proposed Enhancement** (combines metadata + visual markers):
```markdown
---

## 📖 Agent Hook Dependency Chains

**Conditional Section Metadata**:
- **Last Reviewed**: 2025-12-14
- **Relevant Tasks**: debugging, hook-setup
- **Skip For**: general-task-execution, spec-creation, coding
- **Layer**: 3 (Reference)

**Load when**: 
- Debugging hook issues or automation failures
- Understanding hook dependencies and execution order

**Skip when**: 
- Normal task execution
- Hooks are working correctly

---
```

**Benefits**:
- Horizontal rules create clear visual boundaries
- Metadata makes relevance machine-readable
- "Load when" / "Skip when" provides human-readable guidance
- Easier to scan and identify what to skip
- Reduces "visual noise" from conditional sections

**Implementation**:
- Add to Development Workflow (Agent Hook sections, Troubleshooting)
- Add to File Organization Standards (detailed sections)
- Add to Spec Planning Standards (Rationale sections, detailed examples)

**Implementation Effort**: Medium (need to add to many sections)
**Risk**: Low (could create new visual noise if overdone)
**Priority**: MEDIUM - Enhances Solution 1 with visual clarity

---

### Solution 5: Task Type Classifier in Meta-Guide

**Concept**: Add quick classifier at top of meta-guide using standardized task vocabulary

**Proposed Addition** (to 00-Steering Documentation, before "How This Steering System Works"):

```markdown
## Quick Task Type Check

**What are you doing right now?**

- [ ] `spec-creation` - Creating/updating specs → Read Spec Planning Standards (Layer 2)
- [ ] `general-task-execution` - Standard task completion → Focus on Development Workflow basics (Layer 1)
- [ ] `architecture` - Architectural decisions → Read architecture sections (Layer 2)
- [ ] `coding` - Implementing features → Read Component Development Guide (Layer 2)
- [ ] `accessibility-development` - A11y work → Read accessibility sections (Layer 2)
- [ ] `validation` - Quality assurance → Read validation sections (Layer 2/3)
- [ ] `debugging` - Troubleshooting → Read troubleshooting sections (Layer 3)
- [ ] `documentation` - Creating docs → Read documentation sections (Layer 2)
- [ ] `maintenance` - Ongoing maintenance → Read maintenance sections (Layer 2/3)
- [ ] `performance-optimization` - Performance work → Read optimization sections (Layer 2/3)
- [ ] `file-organization` - Organizing files → Read File Organization Standards (Layer 1)
- [ ] `refactoring` - Code restructuring → Read refactoring sections (Layer 2)
- [ ] `migration` - Moving/upgrading systems → Read migration sections (Layer 2/3)
- [ ] `hook-setup` - Automation setup → Read hook sections (Layer 3)

**Not sure?** Default to reading MORE rather than less, or ask Peter.

**Note**: These task types match the metadata in conditional sections throughout the documentation.
```

**Benefits**:
- Makes task type explicit using standardized vocabulary
- Helps agents quickly identify which documents to prioritize
- Reduces cognitive load of inferring task type
- Provides clear entry point for strategic reading
- Vocabulary matches conditional section metadata (consistency)

**Trade-offs**:
- Adds content to meta-guide (but at the top, so high value)
- Requires maintenance when new task types emerge
- Vocabulary must stay synchronized with section metadata

**Implementation Effort**: Low
**Risk**: None (purely additive)
**Priority**: MEDIUM - Complements Solution 1 by establishing vocabulary

---

### Solution 6: Intentional Redundancy with Different Framing

**Concept**: Accept some redundancy when it serves different purposes (procedural vs conceptual)

**Example - Metadata Requirements**:

**Development Workflow** (procedural context):
```markdown
## After Completing a Task
1. Create completion document
2. Add metadata: **Organization**: spec-completion
3. Mark task complete with taskStatus tool

**For metadata details**: See File Organization Standards
```

**File Organization Standards** (conceptual context):
```markdown
## Required Metadata Fields

**Organization**: spec-completion
- **Purpose**: Completion documentation for specific tasks
- **Location**: `.kiro/specs/[spec-name]/completion/`
- **When to use**: After completing any subtask
- **Why it matters**: Enables automatic file organization
```

**Key Principle**: Same information, different framing
- Development Workflow: "What to do, when to do it" (action-oriented)
- File Organization Standards: "What it means, why it exists" (concept-oriented)

**Benefits**:
- Each document is self-contained for its context
- Agents don't need to jump between documents
- Different framings reinforce understanding
- Redundancy serves a purpose (not just duplication)

**Trade-offs**:
- Higher token usage (intentional duplication)
- Maintenance burden (update in multiple places)
- Risk of documents drifting out of sync

---

### Solution 7: Standardize "Read Completely" Threshold

**Current State**: ~30 lines with token usage details, development practices details

**Proposed Changes**:

**Keep**:
- Project context (DesignerPunk, True Native Architecture)
- Repository info (GitHub URL, single-branch workflow)
- Core principles (accessibility, cross-platform consistency)

**Reduce to Pointers**:
- Token usage details → "See Component Development Guide § Token Selection"
- Development practices details → "See Development Workflow § Task Completion"
- Build system details → "See BUILD-SYSTEM-SETUP"

**Proposed Structure**:
```markdown
## Core Project Context
- DesignerPunk design system - True Native cross-platform
- Build-time platform separation (web/iOS/Android)
- Mathematical foundations (REM-style, baseline grid, modular scale)
- Accessibility (WCAG 2.1 AA) and cross-platform consistency
- Human-AI collaboration as foundational value

## Development Principles
- **Token Usage**: Always use design tokens over hard-coded values
  - **Details**: See Component Development Guide § Token Selection
- **Task Completion**: Follow systematic workflow with automated git integration
  - **Details**: See Development Workflow § Task Completion
- **Documentation**: Maintain concept-based approach preventing contamination
  - **Details**: See File Organization Standards
- **Repository**: https://github.com/3fn/DesignerPunkv2 (main branch)
```

**Benefits**:
- Truly quick to read completely (~15 lines instead of ~30)
- Principles are clear and memorable
- Pointers guide to detailed frameworks when needed
- Maintains "read completely" designation appropriately

**Trade-offs**:
- Requires agents to follow pointers for details
- More cross-references to maintain

---

## Design Decisions

### Decision 1: Hybrid Approach vs Pure Layering

**Options Considered**:
1. **Pure Layering**: All always-loaded docs become principle-only, all detail moves to conditional
2. **Hybrid Approach**: Always-loaded docs have principles + essential procedures, conditional docs have frameworks
3. **Status Quo**: Keep current structure, just add section-level markers

**Recommendation**: Hybrid Approach (Option 2)

**Rationale**:
- Pure layering is too aggressive - agents need some procedural guidance in always-loaded docs
- Status quo doesn't address redundancy or length concerns
- Hybrid balances token efficiency with practical usability
- Agents get "what" and "when" in Tier 1, "how" and "why" in Tier 2

**Trade-offs**:
- ✅ **Gained**: Lighter always-loaded docs, clear principle-to-practice progression
- ❌ **Lost**: Some self-contained completeness in always-loaded docs
- ⚠️ **Risk**: Summaries might become too brief to be useful

---

### Decision 2: Section-Level Markers vs Document-Level Only

**Options Considered**:
1. **Document-Level Only**: Keep current approach (conditional sections marked at document level)
2. **Section-Level Markers**: Add visual markers and "Load when/Skip when" to each conditional section
3. **Aggressive Sectioning**: Move most conditional content to separate documents

**Recommendation**: Section-Level Markers (Option 2)

**Rationale**:
- Document-level markers don't solve "visual noise" problem
- Aggressive sectioning creates too many small documents (maintenance burden)
- Section-level markers provide clear boundaries without fragmenting documents
- Agents can quickly scan and identify what to skip

**Trade-offs**:
- ✅ **Gained**: Clearer visual boundaries, easier scanning, reduced cognitive load
- ❌ **Lost**: Some document compactness (more visual markers)
- ⚠️ **Risk**: Over-marking could create new visual noise

---

### Decision 3: Task Type Classifier Placement

**Options Considered**:
1. **In Meta-Guide**: Add to 00-Steering Documentation at top
2. **Separate Document**: Create new "Task Type Guide" document
3. **In Each Document**: Add task type check to each document's priorities section

**Recommendation**: In Meta-Guide (Option 1)

**Rationale**:
- Meta-guide is the entry point - agents read it first
- Separate document adds complexity without clear benefit
- Per-document checks create redundancy and maintenance burden
- Single location makes it easy to find and update

**Trade-offs**:
- ✅ **Gained**: Clear entry point, single source of truth, easy to maintain
- ❌ **Lost**: None (this is purely additive)
- ⚠️ **Risk**: Meta-guide becomes longer (but this is high-value content at top)

---

### Decision 4: Intentional Redundancy Guidelines

**Options Considered**:
1. **Eliminate All Redundancy**: Single source of truth for everything
2. **Intentional Redundancy**: Allow redundancy when it serves different purposes
3. **Controlled Duplication**: Specific rules about when duplication is allowed

**Recommendation**: Intentional Redundancy (Option 2)

**Rationale**:
- Eliminating all redundancy makes documents less self-contained
- Agents benefit from seeing same concept in different contexts (procedural vs conceptual)
- "Layered learning" is valuable - principle in one doc, framework in another
- The problem isn't redundancy itself, it's redundancy without purpose

**Guidelines for Intentional Redundancy**:
- ✅ **Allow**: Same concept with different framing (procedural vs conceptual)
- ✅ **Allow**: Principle in always-loaded doc, framework in conditional doc
- ✅ **Allow**: Brief mention with pointer to detailed explanation
- ❌ **Avoid**: Same content with same framing in multiple places
- ❌ **Avoid**: Detailed explanations duplicated across documents

**Trade-offs**:
- ✅ **Gained**: Self-contained documents, layered learning, context-appropriate framing
- ❌ **Lost**: Pure DRY (Don't Repeat Yourself) principle
- ⚠️ **Risk**: Requires judgment about when redundancy serves a purpose

---

## MCP-Readiness Design Considerations

This spec's outputs are designed to support future MCP-based documentation serving (Spec 021). The refined steering documentation structure will enable Spec 021 to serve documentation dynamically while further reducing context load on AI agents.

### Machine-Readable Metadata Schema

**Current Design** (already MCP-ready):
```markdown
**Conditional Section Metadata**:
- **Last Reviewed**: 2025-12-14
- **Relevant Tasks**: debugging, hook-setup
- **Skip For**: general-task-execution, spec-creation, coding
- **Layer**: 3 (Reference)
```

**Why This Works for MCP**:
- Structured format (key-value pairs) enables programmatic parsing
- Standardized vocabulary (task types) enables filtering
- Clear layer assignment (numeric) enables serving strategies
- "Last Reviewed" date enables staleness detection

**MCP Query Example**: "Give me all Layer 2 sections relevant to `coding`"

### Stable Task Vocabulary

**Critical for MCP**: Task types must be stable and well-defined

**Implementation**:
- 14 task types with explicit definitions (not just names)
- Definitions document scope and boundaries
- Vocabulary changes require spec update (not ad-hoc changes)
- Ensures MCP queries remain valid over time

**Why This Matters for MCP**:
- MCP needs to understand what each task type means to serve relevant content
- Definitions prevent drift and ensure consistency
- AI agents can validate their task type selection

### Clear Layer Boundaries

**For MCP to serve layers effectively**, layer boundaries must be unambiguous:

**Layer 0 (Entry Point)**: Navigation and system overview
- **MCP Strategy**: Always served first, regardless of task type
- **Caching**: Can be cached after first read

**Layer 1 (Principles)**: Core principles and essential procedures (≤20 lines per doc)
- **MCP Strategy**: Always served, but can be cached after first read
- **Serving**: Entire layer served as foundation

**Layer 2 (Frameworks and Patterns)**: Step-by-step frameworks and reusable patterns
- **MCP Strategy**: Served based on task type, can be served incrementally
- **Serving**: Filtered by task type, served on-demand

**Layer 3 (Reference)**: Troubleshooting, edge cases, deep dives
- **MCP Strategy**: Served on-demand only, never proactively
- **Serving**: Only when explicitly requested or highly relevant

**Why This Matters for MCP**: Clear boundaries enable smart serving strategies (always/cached/conditional/on-demand)

### Content Structure for MCP

**Self-Contained Sections**:
- Each conditional section can be served independently
- Metadata includes all information needed for relevance determination
- No dependencies between conditional sections

**Stable Cross-References**:
- Cross-references use stable paths
- Pointers from Layer 1 to Layer 2 are explicit
- MCP can resolve references programmatically

**Progressive Disclosure Support**:
- Layer progression is explicit (0 → 1 → 2 → 3)
- Each layer points to next layer for depth
- MCP can guide agents through layers based on need

### MCP Integration Benefits

**For Spec 021 (MCP Documentation Server)**:
- Metadata schema enables smart filtering and serving
- Task vocabulary enables query-based content retrieval
- Layer boundaries enable progressive disclosure in MCP context
- Stable structure ensures MCP implementation remains valid

**For AI Agents**:
- Further reduced context load (MCP serves only relevant content)
- Same guidance quality (content is refined, not reduced)
- Dynamic serving based on task type (no manual filtering needed)
- Progressive disclosure maintained (MCP respects layer progression)

---

## Implementation Plan (If We Proceed)

### Phase 1: Foundation (High Impact, Low Effort)

**Priority: HIGH - Do These First**

**1. Add Progressive Disclosure Map to Meta-Guide**
- Target: 00-Steering Documentation
- Impact: Establishes clear navigation model and layer concept
- Dependencies: None
- **Rationale**: Sets the foundation for all other changes

**2. Add Task Type Classifier to Meta-Guide**
- Target: 00-Steering Documentation
- Impact: Establishes standardized task vocabulary
- Dependencies: None
- **Rationale**: Vocabulary used throughout conditional section metadata

**3. Add Task-Relevant Metadata to Conditional Sections**
- Target: Development Workflow, File Organization Standards, Spec Planning Standards
- Impact: Makes "should I read this?" decision instant and unambiguous
- Dependencies: Task Type Classifier (for vocabulary)
- **Rationale**: Solves core problem identified in feedback

### Phase 2: Layer 1 Refinement (Medium Impact, Low Effort)

**Priority: MEDIUM - Do After Phase 1**

**4. Tighten Core Goals to Pure Principles**
- Target: Core Goals document
- Impact: Establishes Core Goals as true Layer 1 (principles only)
- Dependencies: Progressive Disclosure Map (for layer concept)
- **Rationale**: Makes Layer 1 truly quick to read

**5. Review Other Layer 1 Documents**
- Target: Start Up Tasks, Personal Note
- Impact: Ensure all Layer 1 docs meet ≤20 line threshold
- Dependencies: Core Goals tightening
- **Rationale**: Consistency across Layer 1

### Phase 3: Visual Enhancement (Low Impact, Medium Effort)

**Priority: LOW - Optional Enhancement**

**6. Add Enhanced Visual Markers to Conditional Sections**
- Target: Sections already updated with metadata in Phase 1
- Impact: Clearer visual boundaries for conditional sections
- Dependencies: Task-Relevant Metadata (Phase 1)
- **Rationale**: Enhances metadata with visual clarity

### Phase 4: Validation (Critical for Success)

**Priority: HIGH - Do After Each Phase**

**7. Test with AI Agent After Phase 1**
- Method: Have AI agent complete a task using refined documentation
- Impact: Validate foundation changes work in practice
- **Rationale**: Catch issues early before proceeding

**8. Test with AI Agent After Phase 2**
- Method: Have AI agent complete different task type
- Impact: Validate Layer 1 refinements work in practice
- **Rationale**: Ensure tightening didn't lose essential context

**9. Gather Final Feedback**
- Method: Ask AI agent for comprehensive feedback on all changes
- Impact: Identify any new issues or areas for further refinement
- **Rationale**: Validate overall system improvement

---

## Open Questions

### Question 1: Layer Assignment for Common Patterns

**Context**: Progressive disclosure requires assigning content to layers

**Question**: Where should common patterns, anti-patterns, and code examples belong?

**Proposed Assignments**:
- **Common patterns** (like "Button Components") → Layer 2 (part of framework)
- **Anti-patterns** (like "Using Primitives When Semantics Exist") → Layer 2 (essential to framework understanding)
- **Code examples** → Layer 2 when illustrating concepts, Layer 3 when showing edge cases

**Rationale**: These are all implementation guidance, not principles (Layer 1) or troubleshooting (Layer 3)

**Resolution**: Confirmed - all belong in Layer 2 (Frameworks and Patterns)

---

### Question 2: Metadata Maintenance Strategy

**Context**: Task-relevant metadata needs to stay accurate as sections evolve

**Question**: How do we ensure metadata stays synchronized with section content?

**Resolution**: Initial audit + periodic updates approach

**Implementation**:
1. **Initial audit** (during this spec): Review all conditional sections, add metadata
2. **Update guidelines**: Document when/how to update metadata (part of section update process)
3. **Periodic review**: Quarterly audit to catch drift (add to maintenance calendar)
4. **"Last Reviewed" date**: Added to metadata blocks to identify stale metadata during audits

**Rationale**: Pragmatic and sustainable - starts clean, maintains through guidelines, catches drift through periodic review

---

### Question 3: Task Type Vocabulary Stability

**Context**: Task type vocabulary must be stable for MCP-based documentation serving (Spec 021)

**Question**: How do we ensure task type vocabulary remains stable and well-defined?

**Resolution**: Document task type definitions explicitly in the spec

**Implementation**:
- Each task type includes explicit definition (not just name)
- Definitions explain scope and boundaries
- Changes to vocabulary require spec update (not ad-hoc)
- Ensures MCP queries remain valid over time

**Example Definition Format**:
```markdown
- **spec-creation**: Creating or updating specification documents (requirements.md, design.md, tasks.md)
- **general-task-execution**: Standard task completion workflow without specialized focus
- **architecture**: Making architectural decisions, designing system structure, establishing patterns
```

**Rationale**: Explicit definitions prevent drift and ensure consistency for both AI agents and MCP serving

---

### Question 4: Component-Specific Documentation Expansion

**Context**: Layer 2 naming includes "Patterns" to accommodate component-specific documentation

**Question**: How will component-specific documentation fit into the progressive disclosure model?

**Proposed Approach**:
- Component-specific docs belong in Layer 2 (Frameworks and Patterns)
- They provide implementation guidance (patterns), not principles (Layer 1) or troubleshooting (Layer 3)
- Task type `coding` or `component-development` would trigger loading
- Metadata would specify which components are covered

**Example**:
```markdown
## 📖 ButtonCTA Component Patterns

**Conditional Section Metadata**:
- **Last Reviewed**: 2025-12-14
- **Relevant Tasks**: coding, component-development
- **Skip For**: spec-creation, debugging
- **Layer**: 2 (Frameworks and Patterns)
- **Components**: ButtonCTA
```

**Resolution**: Confirmed - component docs fit naturally in Layer 2 as implementation patterns

---

## Success Criteria

**How will we know these changes are successful?**

### Quantitative Metrics
- **Token Efficiency**: Layer 1 docs total ≤100 lines (currently ~150+)
- **Navigation Clarity**: AI agents can identify relevant sections in <30 seconds
- **Metadata Coverage**: 100% of conditional sections have task-relevant metadata
- **Layer Compliance**: All Layer 1 docs ≤20 lines each

### Qualitative Feedback (from AI Agents)
- **Progressive Disclosure**: "I understood the layer progression immediately"
- **Task Relevance**: "The metadata made it obvious what to read"
- **Visual Clarity**: "Conditional sections were easy to identify and skip"
- **Navigation Confidence**: "I knew where to find detailed information when needed"

### Behavioral Indicators
- AI agents correctly identify their task type using classifier
- AI agents skip conditional sections that don't match their task type
- AI agents follow pointers from Layer 1 to Layer 2 when needed
- AI agents don't ask "should I read this?" about conditional sections (metadata answers it)
- AI agents complete tasks without reading irrelevant Layer 3 content

### Negative Indicators (Things to Watch For)
- AI agents report metadata is inaccurate or misleading
- AI agents report Layer 1 summaries are too vague to act on
- AI agents report too many visual markers create new noise
- AI agents report task type vocabulary doesn't match their work

---

## Next Steps

**If we decide to proceed with a full spec**:

1. **Validate Design Decisions**: Review this outline with Peter, confirm approach
2. **Create Requirements**: Formalize user stories and acceptance criteria
3. **Create Design**: Detail implementation approach for each change
4. **Create Tasks**: Break down implementation into actionable steps
5. **Implement Phase 1**: Start with quick wins, gather feedback
6. **Iterate**: Adjust based on real-world usage

**If we decide not to proceed**:
- Document rationale for deferring
- Preserve this outline for future reference
- Consider smaller, targeted improvements instead

---

## Conclusion

The steering documentation system is fundamentally sound - the AI agent's feedback confirms the core approach (conditional loading, priorities sections, strategic reading) works well. The proposed improvements are refinements, not fundamental changes.

**Key Insights**:

1. **Progressive Disclosure is the Core Concept**: Documentation should work like a meal - appetizer (principles) → main course (frameworks) → dessert (reference). Each layer complete enough to act on, but points to next layer for depth.

2. **Task-Relevant Metadata Solves the Core Problem**: The "should I read this?" question can be answered instantly with structured metadata using standardized task vocabulary.

3. **Layer 1 Must Be Truly Brief**: For progressive disclosure to work, Layer 1 (principles) must be ≤20 lines per doc. This forces discipline and makes "read completely" meaningful.

4. **Intentional Redundancy is Valuable**: When content serves different purposes (principle vs framework, procedural vs conceptual), it's layered learning, not duplication.

**Recommended Approach**: 

**Phase 1 (Foundation)**: 
1. Add progressive disclosure map to meta-guide
2. Add task type classifier with standardized vocabulary
3. Add task-relevant metadata to all conditional sections

**Phase 2 (Refinement)**:
4. Tighten Core Goals to pure principles (≤20 lines)
5. Review other Layer 1 docs for compliance

**Phase 3 (Enhancement)**:
6. Add visual markers to conditional sections (optional)

**Validate after each phase** with AI agent testing and feedback.

**Risk Assessment**: Low risk - changes are incremental and reversible. Worst case, we revert to current structure. Best case, we significantly improve token efficiency and agent experience while establishing clear progressive disclosure model.

**Status**: This design outline will be formalized into a complete spec with requirements.md, design.md, and tasks.md.

**Dependent Spec**: Spec 021 (MCP Documentation Server) depends on the completion of this spec. The refined steering documentation structure will inform how MCP documentation is organized and served to AI agents.
