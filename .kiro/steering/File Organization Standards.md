---
inclusion: always
---

# File Organization Standards

**Date**: 2025-01-10
**Last Reviewed**: 2025-12-15
**Purpose**: Metadata-driven file organization system for sustainable project structure
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 2
**Relevant Tasks**: all-tasks

## AI Agent Reading Priorities

**Note**: This section intentionally uses the same heading as other steering documents because each document provides reading priorities specific to its content. This structural pattern enables progressive disclosure and helps AI agents navigate to relevant sections efficiently.

**This document is always loaded. Focus on sections relevant to your current task type.**

**Layer Context**: This is a Layer 2 (Frameworks and Patterns) document that provides metadata-driven file organization framework. It's always loaded and contains conditional sections for specific organization scenarios.

### WHEN Completing Parent Tasks
**Focus on:**
- **Summary Documents** - Two-document workflow (detailed + summary)
- **Spec-Specific Organization** - Two-directory structure for completion docs
- **Cross-Reference Standards** - Linking between summary and detailed docs
- **Required Metadata Fields** - Add organization metadata to both documents

### WHEN Creating Spec Documents (Requirements, Design, Tasks)
**Focus on:**
- **Required Metadata Fields** - Standard metadata header format
- **Organization Field Values** - Use `spec-validation`, `spec-completion`, or `spec-guide`
- **Directory Structure** - Understand `.kiro/specs/[spec-name]/` organization

### WHEN Creating Framework Documentation
**Focus on:**
- **Organization Field Values** - Use `framework-strategic` for reusable guidance
- **Directory Structure** - Place in `strategic-framework/` directory
- **Required Metadata Fields** - Ensure cross-project scope

### WHEN Creating Completion Documents
**Focus on:**
- **Spec-Specific Completion** - Naming conventions and metadata format
- **Organization Implementation** - Steps 1-2 (add metadata, place file)
- **Directory Structure** - `.kiro/specs/[spec-name]/completion/` location

### WHEN Adding Cross-References
**Focus on:**
- **Cross-Reference Standards** - Relative path format and link text
- **Organization Implementation - Step 3** - Update links after moving files
- **Summary Documents** - Cross-reference patterns for completion docs

### WHEN Organizing Existing Files AND Creating New Implementation Files
**Focus on:**
- **Organization Implementation** - Complete 3-step process
- **File Organization Scope** - Root directory scanning behavior
- **Organizing Files in Subdirectories** - Manual organization options

---

## File Organization Philosophy

### Metadata-Driven Organization
All files use explicit metadata to declare organizational intent, enabling safe automation while maintaining human control over organizational decisions.

### Organization Principles
- **Explicit Intent**: Human declares organization purpose through metadata
- **Reusability Focus**: Framework-level artifacts separated from spec-specific artifacts
- **Context Preservation**: Related artifacts grouped for efficient navigation
- **Scalable Structure**: Organization patterns work as project grows

---

## Required Metadata Fields

### Standard Metadata Header
```markdown
# Document Title

**Date**: Creation date (YYYY-MM-DD format)
**Purpose**: Clear description of document purpose and scope
**Organization**: Intended organization level (see values below)
**Scope**: Applicable scope or spec name
**Status**: Current document status (optional)
**Task**: Associated task number and name (if applicable)
```

### Organization Field Values

#### Framework-Level Artifacts
```markdown
**Organization**: framework-strategic
**Scope**: cross-spec
```
**Purpose**: Reusable strategic guidance that applies across multiple specs
**Location**: `strategic-framework/` directory
**Examples**: North star vision, system catalogs, prioritization matrices

#### Spec-Specific Validation
```markdown
**Organization**: spec-validation
**Scope**: [spec-name]
```
**Purpose**: Validation artifacts specific to one spec's development
**Location**: `.kiro/specs/[spec-name]/validation/` directory
**Examples**: Framework validation reports, cross-reference validation, gap analysis

#### Spec-Specific Completion
```markdown
**Organization**: spec-completion
**Scope**: [spec-name]
```
**Purpose**: Completion documentation for specific tasks or specs
**Location**: `.kiro/specs/[spec-name]/completion/` directory
**Examples**: Task completion documentation, lessons learned, implementation notes

**Completion Documentation Standards**:
- **All Subtasks**: Completion documents are created for all subtasks, regardless of task type (Setup, Implementation, Architecture)
- **Naming Convention**: 
  - Parent tasks: `task-[N]-completion.md` (e.g., `task-1-completion.md`, `task-2-completion.md`)
  - Subtasks: `task-[N.M]-completion.md` (e.g., `task-1-1-completion.md`, `task-2-3-completion.md`)
- **Organization Metadata**: All completion documents use `**Organization**: spec-completion`
- **Location**: All completion documents stored in `.kiro/specs/[spec-name]/completion/` directory

**Naming Convention Examples**:
```
.kiro/specs/cross-platform-build-system/completion/
├── task-1-completion.md           # Parent task 1 completion
├── task-1-1-completion.md         # Subtask 1.1 completion
├── task-1-2-completion.md         # Subtask 1.2 completion
├── task-1-3-completion.md         # Subtask 1.3 completion
├── task-2-completion.md           # Parent task 2 completion
├── task-2-1-completion.md         # Subtask 2.1 completion
└── task-2-2-completion.md         # Subtask 2.2 completion
```

#### Summary Documents
```markdown
**Organization**: spec-summary
**Scope**: [spec-name]
```
**Purpose**: Concise, commit-style summaries of parent task completion that trigger release detection hooks and serve as release note content
**Location**: `docs/specs/[spec-name]/` directory
**Examples**: Parent task summaries that trigger automatic release detection

**Summary Document Standards**:
- **Naming Convention**: `task-N-summary.md` (e.g., `task-1-summary.md`, `task-2-summary.md`, `task-10-summary.md`)
- **Organization Metadata**: All summary documents use `**Organization**: spec-summary`
- **Location**: All summary documents stored in `docs/specs/[spec-name]/` directory
- **Purpose**: Dual purpose as hook trigger and release note content
- **Relationship to Detailed Docs**: Summary docs complement detailed completion docs in `.kiro/specs/[spec-name]/completion/`

**Hook Limitation**: Kiro IDE's `fileCreated` and `fileSaved` hooks only trigger for **manual file operations through the IDE UI**, not for programmatically created files by AI agents. This requires a hybrid approach:
- **Automatic hooks**: Work for manually created/edited files through IDE UI
- **Manual trigger**: Required for AI-assisted workflows after summary document creation

**Rationale**:
- **Hook Triggering**: The `.kiro/` directory is filtered from Kiro IDE's file watching system. Summary documents in `docs/specs/` enable automatic release detection for manual file operations.
- **Dual Purpose**: Summary documents serve both as hook triggers and as concise, public-facing release note content.
- **Clear Separation**: Detailed completion docs (internal knowledge preservation) remain in `.kiro/`, while summaries (public-facing) live in `docs/`.
- **Hybrid Approach**: Automatic hooks for manual edits, manual trigger for AI workflows ensures release detection works in all scenarios.

**Example Metadata Header**:
```markdown
# Task 1 Summary: Fix Release Detection Triggers

**Date**: 2025-10-30
**Purpose**: Concise summary of parent task completion
**Organization**: spec-summary
**Scope**: release-detection-trigger-fix

## What Was Done

[Concise description of what was implemented]

## Why It Matters

[Business value, user impact, or technical benefit]

## Key Changes

- [Change 1]
- [Change 2]
- [Change 3]

## Impact

- ✅ [Positive impact 1]
- ✅ [Positive impact 2]
```

**Cross-References Between Summary and Detailed Docs**:

Summary documents and detailed completion documents should cross-reference each other to enable easy navigation between public-facing summaries and comprehensive internal documentation.

**From Summary to Detailed Docs**:

Summary documents should include a link to the detailed completion document at the end, providing readers a path to comprehensive implementation notes.

Format:
```markdown
---

*For detailed implementation notes, see [task-N-parent-completion.md](../../.kiro/specs/[spec-name]/completion/task-N-parent-completion.md)*
```

Example from `docs/specs/release-detection-trigger-fix/task-1-summary.md`:
```markdown
---

*For detailed implementation notes, see [task-1-parent-completion.md](../../.kiro/specs/release-detection-trigger-fix/completion/task-1-parent-completion.md)*
```

**From Detailed Docs to Summary (Optional)**:

Detailed completion documents can optionally link to the summary document, though this is less critical since detailed docs are the primary reference.

Format:
```markdown
## Related Documentation

- [Task N Summary](../../../../docs/specs/[spec-name]/task-N-summary.md) - Public-facing summary that triggered release detection
```

Example from `.kiro/specs/release-detection-trigger-fix/completion/task-1-parent-completion.md`:
```markdown
## Related Documentation

- [Task 1 Summary](../../../../docs/specs/release-detection-trigger-fix/task-1-summary.md) - Public-facing summary that triggered release detection
```

**In Tasks.md**:

Parent tasks should reference both documentation types in the "Completion Documentation" section to make it clear that two documents will be created.

Format:
```markdown
**Completion Documentation:**
- Detailed: `.kiro/specs/[spec-name]/completion/task-[N]-parent-completion.md`
- Summary: `docs/specs/[spec-name]/task-[N]-summary.md` (triggers release detection)
```

Example:
```markdown
**Completion Documentation:**
- Detailed: `.kiro/specs/release-detection-trigger-fix/completion/task-1-parent-completion.md`
- Summary: `docs/specs/release-detection-trigger-fix/task-1-summary.md` (triggers release detection)
```

**Relative Path Calculation**:

When creating cross-references, calculate relative paths based on the source document location:

- **From summary to detailed**: Summary docs are in `docs/specs/[spec-name]/`, detailed docs are in `.kiro/specs/[spec-name]/completion/`
  - Path: `../../.kiro/specs/[spec-name]/completion/task-N-parent-completion.md`
  - Breakdown: `../..` (up to root) → `.kiro/specs/[spec-name]/completion/` (down to target)

- **From detailed to summary**: Detailed docs are in `.kiro/specs/[spec-name]/completion/`, summary docs are in `docs/specs/[spec-name]/`
  - Path: `../../../../docs/specs/[spec-name]/task-N-summary.md`
  - Breakdown: `../../../..` (up to root) → `docs/specs/[spec-name]/` (down to target)

**Best Practices**:

- Always use relative paths (not absolute paths) for cross-references
- Include descriptive link text that explains what the linked document contains
- Test links by clicking them in rendered markdown to verify they work
- Update cross-references if files are moved during organization

#### Spec-Specific Guides
```markdown
**Organization**: spec-guide
**Scope**: [spec-name]
```
**Purpose**: Implementation guides and architectural documentation for specific specs
**Location**: `docs/specs/[spec-name]/guides/` directory
**Examples**: Compositional architecture guides, strategic flexibility explanations, migration guides
**Rationale**: Added based on Phase 1 audit findings (19 files). Spec guides are distinct from completion docs (which document what was done) and validation artifacts (which verify correctness). Guides explain architectural decisions, design patterns, and implementation approaches for spec outputs.

#### Audit Findings
```markdown
**Organization**: audit-findings
**Scope**: cross-project
```
**Purpose**: Cross-project audit reports and issue registries
**Location**: `.kiro/audits/` directory
**Examples**: Phase 1 infrastructure audit, issues registry, discovery reports
**Rationale**: Added based on Phase 1 audit findings (7 files). Audit findings are distinct from spec-validation (which validates specific spec implementation) because audits are cross-spec, document discovered issues rather than validate implementation, and have different lifecycle than spec validation artifacts.

#### Token Documentation
```markdown
**Organization**: token-documentation
**Scope**: cross-project
```
**Purpose**: Foundational token system documentation and guides
**Location**: `.kiro/steering/` directory (token-specific docs)
**Examples**: Shadow tokens guide, glow tokens guide, layering tokens guide
**Rationale**: Added based on Phase 1 audit findings (2 files). Token documentation is distinct from spec-guide (which is spec-specific) because token docs are foundational, cross-project references that explain token system concepts used across multiple specs.

#### Process Standards
```markdown
**Organization**: process-standard
**Scope**: cross-project
```
**Purpose**: Reusable process documentation and standards
**Location**: `.kiro/steering/` or `docs/processes/` directory
**Examples**: Development workflows, quality standards, methodology documentation
**Consolidation Note**: The value `process-documentation` has been consolidated into `process-standard`. Files previously using `process-documentation` should be updated to use `process-standard` as they serve the same purpose (reusable process documentation).

#### Working Documents
```markdown
**Organization**: working-document
**Scope**: temporary
```
**Purpose**: Temporary files during active development
**Location**: Root directory (temporary) or appropriate working directory
**Examples**: Draft documents, experimental files, temporary analysis

---

## Directory Structure

### Strategic Framework
```
strategic-framework/
├── README.md                              # Framework overview and usage guide
├── north-star-vision.md                   # Success definition and architectural integration
├── supporting-systems-catalog.md          # System inventory and dependencies
├── strategic-prioritization-matrix.md     # Development sequencing and resource allocation
├── knowledge-gaps-register.md             # Questions and uncertainties requiring resolution
├── strategic-coordination-framework.md    # System integration and coordination guidance
├── system-dependencies-map.md             # Visual mapping of system relationships
├── framework-artifact-tracking.md         # Component inventory and metrics
└── consolidated-strategic-framework.md    # Complete framework integration
```

### Spec-Specific Organization

**Two-Directory Structure**: Spec documentation is organized across two directories to enable automatic release detection while maintaining comprehensive internal documentation.

```
docs/specs/[spec-name]/                   # Public-facing documentation (TRIGGERS HOOKS)
├── task-1-summary.md                     # ✅ Parent task summary (triggers release detection)
├── task-2-summary.md                     # ✅ Parent task summary (triggers release detection)
├── task-N-summary.md                     # ✅ Parent task summary (triggers release detection)
│                                         # Format: task-N-summary.md (N = parent task number)
│                                         # Purpose: Concise, commit-style summaries
│                                         # Hook Pattern: **/task-*-summary.md
│                                         # Kiro IDE watches this directory for file creation
└── guides/                               # Spec-specific implementation guides
    ├── compositional-architecture-guide.md  # Architectural pattern explanations
    ├── strategic-flexibility-guide.md       # Design decision rationale
    └── migration-guide.md                   # Migration paths and upgrade guides

.kiro/specs/[spec-name]/                  # Internal documentation (NO HOOK TRIGGERS)
├── requirements.md                        # ❌ Spec requirements (no hook trigger)
├── design.md                             # ❌ Spec design (no hook trigger)
├── tasks.md                              # ❌ Implementation tasks (no hook trigger)
├── validation/                           # ❌ Spec-specific validation artifacts (no hook trigger)
│   ├── framework-validation-report.md    # Validation against preserved knowledge
│   ├── cross-reference-validation.md     # Link integrity verification
│   └── [other-validation-files].md       # Additional validation artifacts
└── completion/                           # ❌ Spec-specific completion documentation (no hook trigger)
    ├── task-1-parent-completion.md       # Parent task detailed docs (Tier 3 comprehensive)
    ├── task-1-1-completion.md            # Subtask completion docs
    ├── task-1-2-completion.md            # Subtask completion docs
    ├── task-2-parent-completion.md       # Parent task detailed docs (Tier 3 comprehensive)
    ├── task-2-1-completion.md            # Subtask completion docs
    └── spec-completion-summary.md        # Overall spec completion documentation
                                          # .kiro/ directory is filtered from Kiro IDE file watching
```

**Key Distinctions**:

| Location | Purpose | Hook Trigger | Audience |
|----------|---------|--------------|----------|
| `docs/specs/[spec-name]/` | Concise summaries | ✅ Yes | Public-facing, release notes |
| `.kiro/specs/[spec-name]/` | Comprehensive docs | ❌ No | Internal, knowledge preservation |

**Why Two Directories?**:
- **Hook Triggering**: The `.kiro/` directory is filtered from Kiro IDE's file watching system. Summary documents in `docs/specs/` enable automatic release detection when created.
- **Dual Purpose**: Summary documents serve both as hook triggers and as concise, public-facing release note content.
- **Clear Separation**: Detailed completion docs (internal knowledge preservation) remain in `.kiro/`, while summaries (public-facing) live in `docs/`.

**File Naming Patterns**:
- **Summary docs**: `task-N-summary.md` (e.g., `task-1-summary.md`, `task-2-summary.md`, `task-10-summary.md`)
- **Detailed parent docs**: `task-N-parent-completion.md` (e.g., `task-1-parent-completion.md`)
- **Subtask docs**: `task-N.M-completion.md` (e.g., `task-1-1-completion.md`, `task-2-3-completion.md`)

### Audit Findings
```
.kiro/audits/                             # Cross-project audit reports
├── phase-1-infrastructure-report.md      # Infrastructure discovery audit
├── phase-1-issues-registry.md            # Discovered issues and priorities
└── [other-audit-reports].md              # Additional audit findings
```

### Token Documentation
```
.kiro/steering/                           # Token documentation (with other steering docs)
├── shadow-tokens.md                      # Shadow token system guide
├── glow-tokens.md                        # Glow token system guide
├── layering-tokens.md                    # Layering token system guide
└── [other-token-guides].md               # Additional token documentation
```

### Process Documentation
```
.kiro/steering/                           # Always-active process guidance
├── Core Goals.md                         # Project principles and development approach
├── Development Workflow.md               # Task completion and git practices
├── File Organization Standards.md        # This document
└── [other-process-standards].md          # Additional process documentation

docs/processes/                           # Detailed process documentation
├── cross-reference-integration-standard.md
├── safety-first-migration-methodology.md
└── [other-methodology-docs].md
```

---

## Organization Implementation (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Organizing existing files or creating new implementation files
- Need to understand the 3-step organization process
- Adding organization metadata to files
- Moving files to appropriate directories

**Skip when**: 
- Just completing normal tasks without file organization
- Reading for general context
- Files are already organized correctly

---

### Manual Organization Process

#### Step 1: Add Organization Metadata
When creating any new file, include organization metadata in the header:
```markdown
**Organization**: [appropriate-value]
**Scope**: [relevant-scope]
```

#### Step 2: Place in Appropriate Directory
- **framework-strategic**: Move to `strategic-framework/` directory
- **spec-validation**: Move to `.kiro/specs/[spec-name]/validation/` directory
- **spec-completion**: Move to `.kiro/specs/[spec-name]/completion/` directory
- **spec-summary**: Move to `docs/specs/[spec-name]/` directory
- **spec-guide**: Move to `docs/specs/[spec-name]/guides/` directory
- **audit-findings**: Move to `.kiro/audits/` directory
- **token-documentation**: Keep in `.kiro/steering/` (with other steering docs)
- **process-standard**: Keep in `.kiro/steering/` or move to `docs/processes/`
- **working-document**: Keep in root or appropriate working directory

#### Step 3: Update Cross-References
After moving files, update any cross-reference links to reflect new locations.

### Hook-Assisted Organization (Future)

#### Metadata-Driven Hook
```bash
# .kiro/hooks/organize-by-metadata.sh
# Parse files for **Organization** metadata
# Move files based on explicit metadata values
# Update cross-references automatically
# Validate organization completed successfully
```

#### Enhanced Commit Hook
```bash
# .kiro/hooks/commit-task-organized.sh "Task Name" [--organize]
# Optional organization during task completion
# Human-controlled with hook assistance
# Maintains fallback to current behavior
```

---

## File Organization Scope (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Organizing files in subdirectories
- Understanding why automation only scans root directory
- Need to organize spec-guide files or other subdirectory content
- Troubleshooting file organization behavior

**Skip when**: 
- Normal task completion without file organization
- Files are in root directory and will be organized automatically
- Just need to understand metadata fields

---

### Overview

The file organization system is intentionally designed to scan **only the root directory**, not subdirectories. This design decision is based on typical workflow patterns and ensures the automation remains predictable and safe.

### Root Directory Only

**Intentional Design**: File organization scans the root directory for files with organization metadata and moves them to appropriate locations based on their metadata values.

**Why Root Directory Only?**

1. **Completion Documents Already Organized**: Task completion documents are created directly in `.kiro/specs/[spec-name]/completion/` subdirectories and are already in their correct location
2. **New Files in Root**: New documentation, analysis, and framework files are typically created in the root directory during development and need organization
3. **Subdirectory Stability**: Files in subdirectories are usually already organized and shouldn't be moved automatically
4. **Clear Scope Boundary**: Limiting scope to root directory makes the automation predictable and safe
5. **Avoid Moving Organized Files**: Prevents accidentally reorganizing files that are already in their intended locations

### Rationale

**Root Directory Clutter Prevention**: The primary purpose of file organization is to prevent accumulation of unorganized files in the root directory. New files created during development typically appear in root and need to be moved to appropriate directories.

**Completion Docs Already Organized**: Files created in `.kiro/specs/*/completion/` are already in their correct location and don't need organization.

**Subdirectory Stability**: Files in subdirectories are usually already organized. Scanning subdirectories would risk moving files that are intentionally placed in specific locations.

**Predictable Automation**: Limiting scope to root directory makes the system behavior clear and predictable. Developers know that only root-level files will be automatically organized.

### Special Case: Spec-Guide Files

**Note**: As decided in Task 1.2, spec-guide files will move from `.kiro/specs/[spec-name]/` to `docs/specs/[spec-name]/guides/` directory. This is an intentional migration to improve documentation organization and enable better cross-referencing between guides.

**Migration Path**:
- Old location: `.kiro/specs/[spec-name]/[guide-name].md`
- New location: `docs/specs/[spec-name]/guides/[guide-name].md`
- Organization metadata: `**Organization**: spec-guide`

This migration will be handled through the file organization system when spec-guide files are moved to the root directory temporarily and then organized to their new location.

### Organizing Files in Subdirectories

If you need to organize files that are already in subdirectories, you have three options:

#### Option 1: Move to Root Temporarily

1. Move the file from subdirectory to root directory
2. Add appropriate **Organization** metadata to the file header (if not already present)
3. Run file organization: `./.kiro/hooks/organize-by-metadata.sh` or mark a task complete to trigger automatic organization
4. The file will be organized to its correct location based on metadata

**Example**:
```bash
# Move file to root
mv .kiro/specs/my-spec/old-guide.md ./old-guide.md

# Add organization metadata to file header
# **Organization**: spec-guide
# **Scope**: my-spec

# Run organization (or mark task complete to trigger automatic organization)
./.kiro/hooks/organize-by-metadata.sh

# File moves to: docs/specs/my-spec/guides/old-guide.md
```

#### Option 2: Manual Organization

1. Add **Organization** metadata to the file header (if not already present)
2. Manually move the file to the appropriate directory based on metadata value:
   - `framework-strategic` → `strategic-framework/`
   - `spec-validation` → `.kiro/specs/[spec-name]/validation/`
   - `spec-completion` → `.kiro/specs/[spec-name]/completion/`
   - `spec-summary` → `docs/specs/[spec-name]/`
   - `spec-guide` → `docs/specs/[spec-name]/guides/`
   - `audit-findings` → `.kiro/audits/`
   - `token-documentation` → `.kiro/steering/`
   - `process-standard` → `.kiro/steering/` or `docs/processes/`
3. Update any cross-references in other files to reflect the new location
4. Commit the changes manually

**Example**:
```bash
# Add organization metadata to file header
# **Organization**: spec-guide
# **Scope**: my-spec

# Manually move file
mkdir -p docs/specs/my-spec/guides
mv .kiro/specs/my-spec/old-guide.md docs/specs/my-spec/guides/old-guide.md

# Update cross-references in other files
# (Search for references to old-guide.md and update paths)

# Commit changes
git add .
git commit -m "Organize: Move old-guide.md to spec-guide location"
git push
```

#### Option 3: Use organize-by-metadata.sh Directly

Run the organization script directly (scans root only by default):

```bash
# Run organization script
./.kiro/hooks/organize-by-metadata.sh

# For subdirectory files, move to root first, then run script
mv subdirectory/file.md ./file.md
./.kiro/hooks/organize-by-metadata.sh
```

### Scope Behavior Summary

| Location | Automatic Organization | Manual Organization |
|----------|----------------------|---------------------|
| Root directory | ✅ Yes (on task completion) | ✅ Yes (anytime) |
| Subdirectories | ❌ No (intentionally excluded) | ✅ Yes (manual process) |
| Completion docs | ❌ No (already organized) | ✅ Yes (if needed) |
| Spec-guide files | ⚠️ Migration in progress | ✅ Yes (manual or via root) |

**Note**: This scope limitation is an intentional design decision that keeps the automation focused and predictable. Files in subdirectories are assumed to be already organized or require manual review before moving.

### Logging Scanning Scope

When the organization script runs, it logs the scanning scope to provide transparency about which directory is being scanned:

```
📁 Scanning directory: /path/to/project
   Scope: Root directory only (subdirectories excluded by design)
   Rationale: Avoid moving already-organized files
```

This logging helps developers understand the system behavior and confirms that only the root directory is being scanned.

---

## Cross-Reference Standards (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Adding cross-references to documentation
- Creating documentation guides or completion documents
- Need to understand cross-reference formatting patterns
- Updating links after file moves

**Skip when**: 
- Not working with documentation
- Just completing implementation tasks
- Files don't contain cross-references

---

### Overview

Cross-references are markdown links that connect related documentation, enabling efficient navigation between guides, specs, completion documents, and other active documentation. This section defines when and how to use cross-references to create a well-connected documentation network while maintaining clean, focused production code.

### When to Use Cross-References

Cross-references MUST be used in the following documentation types:

- **Documentation Guides**: Spec-specific guides that explain implementation patterns (e.g., `.kiro/specs/[spec-name]/[guide-name].md`)
- **Spec Documents**: Requirements, design, and tasks documents in `.kiro/specs/[spec-name]/`
- **Completion Documents**: Task completion documentation in `.kiro/specs/[spec-name]/completion/`
- **README Files**: Project and directory README files that provide navigation and context
- **Overview Documents**: Master documents that map components to their documentation (e.g., `docs/token-system-overview.md`)
- **Process Documentation**: Standards and methodology documents in `.kiro/steering/` and `docs/processes/`

**Rationale**: These are documentation artifacts where cross-references add value by helping readers discover related information and navigate between connected concepts.

### When NOT to Use Cross-References

Cross-references MUST NOT be used in the following production code files:

- **Token Definition Files**: Files like `FontSizeTokens.ts`, `TypographyTokens.ts`, `SpacingTokens.ts`
- **Component Implementation Files**: React components, SwiftUI views, Jetpack Compose components
- **Utility Function Files**: Helper functions, validators, converters, generators
- **Type Definition Files**: TypeScript interfaces and type definitions
- **Configuration Files**: Build configs, test configs, linting configs

**Rationale**: Production code should be focused on implementation, not documentation navigation. Code comments should be brief and implementation-focused. Architectural rationale and design decisions belong in documentation guides, not in code files. Cross-references in code create noise and distract from the implementation.

### Documentation vs Code Distinction

The key distinction is between **documentation** (where cross-references belong) and **production code** (where they don't):

**Documentation Purpose**: Explain concepts, provide context, connect related ideas, guide understanding
- Cross-references help readers navigate between related documentation
- Links provide efficient discovery of relevant information
- Navigation aids enhance learning and comprehension

**Code Purpose**: Implement functionality, execute logic, deliver features
- Code comments should be brief and implementation-focused
- Architectural rationale belongs in documentation guides, not code
- Cross-references in code create maintenance burden and distraction

**Example - CORRECT Usage (Documentation)**:
```markdown
# Typography Token Guide

## Related Guides

- [Compositional Color Guide](./compositional-color-guide.md) - Explains why typography tokens don't include color
- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains size variant decisions

## Typography Token Architecture

Typography tokens combine fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing primitives...
```

**Example - INCORRECT Usage (Production Code)**:
```typescript
// ❌ WRONG - Don't add cross-references in production code
/**
 * Typography tokens for the design system.
 * 
 * For architectural rationale, see:
 * - .kiro/specs/typography-token-expansion/compositional-color-guide.md
 * - .kiro/specs/typography-token-expansion/strategic-flexibility-guide.md
 */
export const TypographyTokens = {
  body: { fontSize: 16, lineHeight: 24, ... }
};

// ✅ CORRECT - Brief, implementation-focused comment
/**
 * Typography tokens combining fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing.
 */
export const TypographyTokens = {
  body: { fontSize: 16, lineHeight: 24, ... }
};
```

### How to Format Cross-References

Cross-references should follow consistent formatting patterns to ensure clarity and maintainability. This section documents the standard patterns for relative paths, section anchors, descriptive link text, and section organization.

#### Relative Path Usage

Always use relative paths from the current document location. Relative paths ensure links remain valid when the repository structure changes or when viewing documentation in different contexts.

**Pattern**: Use `../` to navigate up directories and `./` for same-directory references

**Examples**:
```markdown
# From .kiro/specs/spec-a/guide.md to .kiro/specs/spec-b/guide.md
[Related Guide](../spec-b/guide.md)

# From docs/overview.md to .kiro/specs/spec-a/guide.md
[Implementation Guide](../.kiro/specs/spec-a/guide.md)

# From .kiro/specs/spec-a/guide-1.md to .kiro/specs/spec-a/guide-2.md
[Related Guide](./guide-2.md)
```

**Rationale**: Relative paths work across different viewing contexts (GitHub, local filesystem, documentation sites) and remain valid when the repository is cloned or moved.

#### Section Anchor Usage

Link to specific sections within documents using markdown section anchors. Section anchors are automatically generated from heading text by converting to lowercase and replacing spaces with hyphens.

**Pattern**: `[Link Text](./document.md#section-name)`

**Examples**:
```markdown
# Link to section in same directory
[Compositional Architecture](./compositional-color-guide.md#compositional-architecture)

# Link to section in parent directory
[Design Decisions](../design.md#design-decisions)

# Link to section in different spec
[Three-Tier Validation](../cross-platform-build-system/design.md#three-tier-validation-system)
```

**Rationale**: Section anchors enable precise navigation to relevant content within longer documents, improving reader efficiency and reducing cognitive load.

#### Descriptive Link Text with Relevance Explanation

Use descriptive link text that clearly identifies the target document, followed by a brief explanation of why the link is relevant. This pattern helps readers decide whether to follow the link.

**Pattern**: `[Descriptive Document Name](./path/to/document.md) - Brief explanation of relevance`

**Examples**:
```markdown
# ✅ GOOD - Explains relevance
[Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains why labelXs exists but bodyXs doesn't
[Migration Guide](./migration-guide.md) - Provides migration path for renamed tokens
[Compositional Color Guide](./compositional-color-guide.md) - Explains why typography tokens don't include color

# ❌ BAD - No context for relevance
<!-- INTENTIONAL VIOLATION - Teaching example of non-descriptive link text -->
[Strategic Flexibility Guide](./strategic-flexibility-guide.md)
[Click here](./migration-guide.md)
[See this document](./compositional-color-guide.md)
```

**Rationale**: Relevance explanations help readers understand the relationship between documents and make informed decisions about which links to follow, improving documentation navigation efficiency.

#### "Related Guides" or "Related Documentation" Section Format

Group multiple cross-references in a dedicated section at the beginning or end of the document. Use consistent section naming ("Related Guides" for guides, "Related Documentation" for broader references) and format each link as a list item.

**Pattern**:
```markdown
## Related Guides

- [Document Name](./path/to/document.md) - Relevance explanation
- [Document Name](./path/to/document.md) - Relevance explanation
- [Document Name](./path/to/document.md) - Relevance explanation

---

## [Main Content Section]
```

**Complete Example**:
```markdown
# Typography Token Architecture Guide

**Date**: 2025-10-22
**Purpose**: Explain typography token composition and design decisions
**Organization**: spec-guide
**Scope**: typography-token-expansion

---

## Related Guides

- [Compositional Color Guide](./compositional-color-guide.md) - Explains why typography tokens don't include color
- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains size variant decisions (labelXs vs bodyXs)
- [Inline Emphasis Guide](./inline-emphasis-guide.md) - Explains platform-native emphasis patterns
- [Migration Guide](./migration-guide.md) - Provides migration path for renamed tokens

---

## Typography Token Composition

Typography tokens combine multiple primitive tokens to create semantic typography styles...

[Main content continues...]

## Design Decisions

### Decision: Compositional Architecture

We chose to compose typography tokens from primitives rather than including all properties...

[Content continues...]
```

**Rationale**: Grouping related links in a dedicated section provides clear navigation points without interrupting the main content flow. Placing the section at the beginning helps readers discover related documentation before diving into the current document.

### Common Cross-Reference Patterns

This section documents the three most common cross-reference patterns used in DesignerPunk documentation, with complete markdown syntax examples for each pattern. These patterns provide consistent approaches for connecting related documentation across different contexts.

#### Pattern 1: Guide-to-Guide (Related Concepts)

**Use Case**: Connect documentation guides that discuss related concepts, enabling readers to navigate between guides that explain different aspects of the same system or feature.

**When to Use**:
- Linking between spec-specific guides within the same spec
- Connecting guides that explain complementary architectural concepts
- Referencing guides that provide additional context for design decisions
- Creating bidirectional navigation between related documentation

**Markdown Syntax**:
```markdown
# Compositional Color Guide

**Date**: 2025-10-22
**Purpose**: Explain compositional color architecture in typography tokens
**Organization**: spec-guide
**Scope**: typography-token-expansion

---

## Related Guides

- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains size variant decisions related to compositional architecture
- [Inline Emphasis Guide](./inline-emphasis-guide.md) - Explains why emphasis isn't in tokens, relates to compositional architecture
- [Migration Guide](./migration-guide.md) - Provides migration path for renamed tokens

---

## Compositional Architecture

Typography tokens follow a compositional architecture where properties are separated by concern.
Instead of including color properties in typography tokens, color is applied separately through
semantic color tokens. This allows the same typography token to be used with different colors
in different contexts.

[Guide content continues...]
```

**Key Elements**:
- **Related Guides section**: Placed at the beginning after metadata
- **Relative paths**: Use `./` for same-directory references
- **Relevance explanations**: Brief description of why each guide is relevant
- **Separator**: Use `---` to separate Related Guides from main content
- **Bidirectional**: Each guide should reference related guides that reference it back

**Example from Different Spec**:
```markdown
# Build System Architecture Guide

**Date**: 2025-10-22
**Purpose**: Explain build system orchestration patterns
**Organization**: spec-guide
**Scope**: cross-platform-build-system

---

## Related Guides

- [Token Selection Guide](./token-selection-guide.md) - Explains token resolution priority used by build orchestrator
- [Platform Generation Guide](./platform-generation-guide.md) - Explains platform-specific generation coordinated by orchestrator
- [Error Handling Guide](./error-handling-guide.md) - Explains error recovery strategies in build process

---

## Build Orchestration Architecture

[Guide content...]
```

#### Pattern 2: Completion-to-Guide (Created Artifacts)

**Use Case**: Link from task completion documents to the documentation guides they created, providing traceability from implementation to documentation and enabling readers to navigate from completion docs to the guides that explain the work.

**When to Use**:
- Completion documents that created new documentation guides
- Completion documents that updated existing guides
- Linking to guides that explain the architectural decisions made during the task
- Providing navigation from implementation notes to conceptual documentation

**Markdown Syntax**:
```markdown
# Task 2.3 Completion: Create Typography Guides

**Date**: 2025-10-22
**Task**: 2.3 Create typography documentation guides
**Type**: Implementation
**Status**: Complete

---

## Artifacts Created

- `.kiro/specs/typography-token-expansion/compositional-color-guide.md` - Guide explaining compositional color architecture
- `.kiro/specs/typography-token-expansion/strategic-flexibility-guide.md` - Guide explaining size variant decisions
- `.kiro/specs/typography-token-expansion/inline-emphasis-guide.md` - Guide explaining platform-native emphasis patterns
- `.kiro/specs/typography-token-expansion/migration-guide.md` - Guide providing migration path for renamed tokens

## Implementation Details

Created four documentation guides to explain typography token architecture and design decisions.
Each guide focuses on a specific aspect of the typography token system, with cross-references
connecting related concepts.

[Implementation details continue...]

## Related Documentation

- [Compositional Color Guide](../compositional-color-guide.md) - Created by this task, explains compositional architecture
- [Strategic Flexibility Guide](../strategic-flexibility-guide.md) - Created by this task, explains size variant decisions
- [Inline Emphasis Guide](../inline-emphasis-guide.md) - Created by this task, explains platform-native patterns
- [Migration Guide](../migration-guide.md) - Created by this task, provides migration guidance

## Validation (Tier 2: Standard)

[Validation results...]
```

**Key Elements**:
- **Artifacts Created section**: Lists all files created with descriptions
- **Related Documentation section**: Links to guides created by the task
- **Relative paths**: Use `../` to navigate from completion/ directory to parent directory
- **Relevance explanations**: Indicate the guide was created by this task and briefly describe its purpose
- **Bidirectional navigation**: Guides can optionally reference the completion doc that created them

**Example with Updates**:
```markdown
# Task 3.2 Completion: Update Build System Documentation

**Date**: 2025-10-22
**Task**: 3.2 Update build system guides with new orchestration patterns
**Type**: Implementation
**Status**: Complete

---

## Artifacts Modified

- `.kiro/specs/cross-platform-build-system/orchestration-guide.md` - Updated with new coordination patterns
- `.kiro/specs/cross-platform-build-system/error-handling-guide.md` - Updated with rollback strategies

## Related Documentation

- [Orchestration Guide](../orchestration-guide.md) - Updated by this task with new coordination patterns
- [Error Handling Guide](../error-handling-guide.md) - Updated by this task with rollback strategies
- [Token Selection Guide](../token-selection-guide.md) - Referenced for integration context

[Completion documentation continues...]
```

#### Pattern 3: Overview-to-Guide (Documentation Navigation)

**Use Case**: Link from overview documents (like Token System Overview, README files, or system catalogs) to detailed documentation guides, providing a navigation hub that helps readers discover relevant documentation for specific components or features.

**When to Use**:
- Overview documents that map system components to their documentation
- README files that provide navigation to detailed guides
- System catalogs that link to component-specific documentation
- Master documents that serve as documentation entry points

**Markdown Syntax**:
```markdown
# Token System Overview

**Date**: 2025-10-22
**Purpose**: Master document mapping token files to their documentation
**Organization**: framework-strategic
**Scope**: cross-project

---

## Introduction

This document provides an overview of the DesignerPunk token system, mapping each token type
to its implementation file and related documentation guides.

## Primitive Tokens

### Font Size Tokens

- **File**: `src/tokens/FontSizeTokens.ts`
- **Description**: Font size tokens based on 16px base value with 1.125 modular scale
- **Base Value**: 16px
- **Scale**: 1.125 (major second)

### Spacing Tokens

- **File**: `src/tokens/SpacingTokens.ts`
- **Description**: Spacing tokens based on 8px baseline grid
- **Base Value**: 8px
- **Grid**: 4px baseline grid alignment

## Semantic Tokens

### Typography Tokens

- **File**: `src/tokens/semantic/TypographyTokens.ts`
- **Description**: Semantic typography tokens combining fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing primitives
- **Related Guides**:
  - [Compositional Color Guide](../.kiro/specs/typography-token-expansion/compositional-color-guide.md) - Explains why typography tokens don't include color
  - [Strategic Flexibility Guide](../.kiro/specs/typography-token-expansion/strategic-flexibility-guide.md) - Explains size variant decisions (labelXs vs bodyXs)
  - [Inline Emphasis Guide](../.kiro/specs/typography-token-expansion/inline-emphasis-guide.md) - Explains platform-native emphasis patterns
  - [Migration Guide](../.kiro/specs/typography-token-expansion/migration-guide.md) - Provides migration path for renamed tokens

### Semantic Color Tokens

- **File**: `src/tokens/semantic/ColorTokens.ts`
- **Description**: Semantic color tokens for UI elements (primary, error, success, etc.)
- **Related Guides**:
  - [Color System Guide](../.kiro/specs/color-system/color-architecture-guide.md) - Explains semantic color architecture

### Semantic Spacing Tokens

- **File**: `src/tokens/semantic/SpacingTokens.ts`
- **Description**: Semantic spacing tokens for layout patterns (stack, inline, inset)
- **Related Guides**:
  - [Spacing System Guide](../.kiro/specs/spacing-system/spacing-patterns-guide.md) - Explains semantic spacing patterns

## Related Documentation

- [Token Architecture Overview](./README.md) - High-level token system architecture
- [Cross-Platform Build System](../.kiro/specs/cross-platform-build-system/design.md) - Token generation and platform conversion

---

*This overview provides navigation to token files and their related documentation guides.*
```

**Key Elements**:
- **Structured sections**: Organize by token category (Primitive, Semantic)
- **File paths**: Include actual file paths for each token type
- **Descriptions**: Brief description of each token type's purpose
- **Related Guides subsection**: Links to guides that explain the token type
- **Relative paths**: Use appropriate relative paths from overview document location
- **Relevance explanations**: Describe what each guide explains about the token type

**Example from README**:
```markdown
# DesignerPunk Design System

**Date**: 2025-10-22
**Purpose**: Cross-platform design system with mathematical foundations
**Organization**: project-documentation
**Scope**: cross-project

---

## Documentation

### Token System

- [Token System Overview](./docs/token-system-overview.md) - Master document mapping token files to documentation
- [Mathematical Token System](../.kiro/specs/mathematical-token-system/design.md) - Mathematical foundations and validation
- [Cross-Platform Build System](../.kiro/specs/cross-platform-build-system/design.md) - Token generation for web, iOS, and Android

### Typography

- [Typography Token Expansion](../.kiro/specs/typography-token-expansion/design.md) - Typography token architecture and design decisions
- [Compositional Color Guide](../.kiro/specs/typography-token-expansion/compositional-color-guide.md) - Why typography tokens don't include color
- [Strategic Flexibility Guide](../.kiro/specs/typography-token-expansion/strategic-flexibility-guide.md) - Size variant decisions

### Development

- [Development Workflow](../.kiro/steering/Development Workflow.md) - Task completion and git practices
- [File Organization Standards](../.kiro/steering/File Organization Standards.md) - Documentation organization and cross-reference standards

---

## Getting Started

[Getting started content...]
```

**Key Elements for README Pattern**:
- **Grouped by topic**: Organize links by system or feature area
- **Hierarchical structure**: Use headings to create clear navigation structure
- **Mix of overview and detail**: Include both high-level and detailed documentation links
- **Relative paths**: Use appropriate relative paths from README location
- **Brief descriptions**: Help readers understand what each link provides

### Anti-Patterns to Avoid

**Note**: This section intentionally uses the same heading as other steering documents because each document addresses anti-patterns specific to its domain. File Organization Standards focuses on organization metadata and cross-reference anti-patterns, while other documents cover their respective domains.

This section documents common anti-patterns in cross-reference usage and provides clear examples of what NOT to do, along with explanations of why these patterns are problematic.

#### Anti-Pattern 1: Cross-References in Production Code

**Problem**: Adding cross-references to documentation in production code files creates noise, maintenance burden, and distracts from implementation.

**Why This is Wrong**:
- Production code should be focused on implementation, not documentation navigation
- Code comments should be brief and implementation-focused
- Architectural rationale belongs in documentation guides, not code files
- Cross-references in code create maintenance burden when documentation moves
- Links in code comments don't provide value to developers reading the code

**Example - INCORRECT Usage**:

```typescript
// ❌ WRONG - Cross-references in production code
/**
 * Typography tokens for the design system.
 * 
 * Architecture Documentation:
 * - See .kiro/specs/typography-token-expansion/compositional-color-guide.md
 *   for explanation of why typography tokens don't include color
 * - See .kiro/specs/typography-token-expansion/strategic-flexibility-guide.md
 *   for explanation of size variant decisions
 * - See .kiro/specs/typography-token-expansion/inline-emphasis-guide.md
 *   for explanation of platform-native emphasis patterns
 * 
 * For migration guidance, see:
 * - .kiro/specs/typography-token-expansion/migration-guide.md
 */
export const TypographyTokens = {
  body: { 
    fontSize: 16, 
    lineHeight: 24, 
    fontFamily: 'system-ui',
    fontWeight: 400,
    letterSpacing: 0
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'system-ui',
    fontWeight: 500,
    letterSpacing: 0
  }
};
```

**Example - CORRECT Usage**:

```typescript
// ✅ CORRECT - Brief, implementation-focused comment
/**
 * Typography tokens combining fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing.
 * Tokens follow compositional architecture with semantic naming.
 */
export const TypographyTokens = {
  body: { 
    fontSize: 16, 
    lineHeight: 24, 
    fontFamily: 'system-ui',
    fontWeight: 400,
    letterSpacing: 0
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'system-ui',
    fontWeight: 500,
    letterSpacing: 0
  }
};
```

**Where Architectural Documentation Belongs**:

Instead of cross-references in code, create documentation guides that explain the architecture:

```markdown
# Typography Token Architecture Guide

**Date**: 2025-10-22
**Purpose**: Explain typography token composition and design decisions
**Organization**: spec-guide
**Scope**: typography-token-expansion

---

## Related Guides

- [Compositional Color Guide](./compositional-color-guide.md) - Explains why typography tokens don't include color
- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains size variant decisions
- [Inline Emphasis Guide](./inline-emphasis-guide.md) - Explains platform-native emphasis patterns
- [Migration Guide](./migration-guide.md) - Provides migration path for renamed tokens

---

## Typography Token Composition

Typography tokens combine multiple primitive tokens to create semantic typography styles.
Each token includes fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing.

[Detailed architectural explanation...]
```

#### Anti-Pattern 2: Re-Explaining Concepts Without Cross-References

**Problem**: Duplicating architectural explanations across multiple documentation files instead of using cross-references creates maintenance burden and inconsistency.

**Why This is Wrong**:
- Duplicated explanations can become inconsistent when one is updated but others aren't
- Readers don't know which explanation is authoritative
- Maintenance burden increases with each duplication
- Wastes space in documents that should focus on their specific topic

**Example - INCORRECT Usage**:

```markdown
# Strategic Flexibility Guide

## Typography Token Size Variants

Typography tokens include size variants like labelXs, labelSm, labelMd, labelLg.

The compositional color architecture is a design pattern where typography tokens
don't include color properties. Instead, color is applied separately through
semantic color tokens. This allows the same typography token to be used with
different colors in different contexts. The architecture separates concerns
between typography (size, weight, spacing) and color (semantic meaning, theme).

This compositional approach provides flexibility because...
[Long explanation duplicated from compositional-color-guide.md]
```

**Example - CORRECT Usage**:

```markdown
# Strategic Flexibility Guide

**Date**: 2025-10-22
**Purpose**: Explain size variant decisions in typography tokens
**Organization**: spec-guide
**Scope**: typography-token-expansion

---

## Related Guides

- [Compositional Color Guide](./compositional-color-guide.md) - Explains compositional architecture that informs size variant decisions
- [Inline Emphasis Guide](./inline-emphasis-guide.md) - Another example of strategic flexibility in token design
- [Migration Guide](./migration-guide.md) - Provides migration path for renamed tokens

---

## Typography Token Size Variants

Typography tokens include size variants like labelXs, labelSm, labelMd, labelLg.
These variants follow the compositional architecture (see Compositional Color Guide)
where properties are separated by concern.

[Focus on size variant decisions without re-explaining compositional architecture]
```

#### Anti-Pattern 3: Absolute Paths in Cross-References

**Problem**: Using absolute paths or repository-specific paths instead of relative paths breaks links when repository structure changes or when viewing documentation in different contexts.

**Why This is Wrong**:
- Absolute paths break when repository is cloned or moved
- Repository-specific paths (like GitHub URLs) don't work in local filesystem
- Relative paths work across all viewing contexts (GitHub, local, documentation sites)

**Example - INCORRECT Usage**:

```markdown
# Typography Token Guide

## Related Guides

<!-- INTENTIONAL VIOLATION - Teaching example of absolute paths -->
- [Compositional Color Guide](https://github.com/3fn/DesignerPunkv2/blob/main/.kiro/specs/typography-token-expansion/compositional-color-guide.md)
- [Strategic Flexibility Guide](/Users/peter/.kiro/specs/typography-token-expansion/strategic-flexibility-guide.md)
- [Inline Emphasis Guide](/.kiro/specs/typography-token-expansion/inline-emphasis-guide.md)
```

**Example - CORRECT Usage**:

```markdown
# Typography Token Guide

## Related Guides

- [Compositional Color Guide](./compositional-color-guide.md) - Explains compositional architecture
- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains size variant decisions
- [Inline Emphasis Guide](./inline-emphasis-guide.md) - Explains platform-native emphasis patterns
```

#### Anti-Pattern 4: Vague Link Text Without Context

**Problem**: Using generic link text like "click here" or "see this document" without explaining why the link is relevant makes it difficult for readers to decide whether to follow the link.

**Why This is Wrong**:
- Readers can't determine relevance without clicking
- Generic link text doesn't help with document scanning
- No context for why the related document matters
- Reduces navigation efficiency

**Example - INCORRECT Usage**:

```markdown
# Typography Token Guide

## Related Guides

<!-- INTENTIONAL VIOLATION - Teaching example of non-descriptive link text -->
- [Click here](./compositional-color-guide.md)
- [See this document](./strategic-flexibility-guide.md)
- [More information](./inline-emphasis-guide.md)
- [Guide](./migration-guide.md)
```

**Example - CORRECT Usage**:

```markdown
# Typography Token Guide

## Related Guides

- [Compositional Color Guide](./compositional-color-guide.md) - Explains why typography tokens don't include color
- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains size variant decisions (labelXs vs bodyXs)
- [Inline Emphasis Guide](./inline-emphasis-guide.md) - Explains platform-native emphasis patterns
- [Migration Guide](./migration-guide.md) - Provides migration path for renamed tokens
```

#### Anti-Pattern 5: Cross-References as Content Replacement

**Problem**: Using cross-references as a substitute for explaining core concepts in the current document makes documents dependent on other documents and reduces standalone readability.

**Why This is Wrong**:
- Documents should be standalone readable
- Readers shouldn't need to follow multiple links to understand core concepts
- Cross-references should enhance navigation, not replace content
- Creates circular dependencies between documents

**Example - INCORRECT Usage**:

```markdown
# Typography Token Guide

## Typography Token Composition

For information about typography token composition, see the Compositional Color Guide.

## Size Variants

For information about size variants, see the Strategic Flexibility Guide.

## Platform-Native Patterns

For information about platform-native patterns, see the Inline Emphasis Guide.
```

**Example - CORRECT Usage**:

```markdown
# Typography Token Guide

**Date**: 2025-10-22
**Purpose**: Explain typography token composition and design decisions
**Organization**: spec-guide
**Scope**: typography-token-expansion

---

## Related Guides

- [Compositional Color Guide](./compositional-color-guide.md) - Explains compositional architecture in detail
- [Strategic Flexibility Guide](./strategic-flexibility-guide.md) - Explains size variant decisions
- [Inline Emphasis Guide](./inline-emphasis-guide.md) - Explains platform-native emphasis patterns

---

## Typography Token Composition

Typography tokens combine multiple primitive tokens to create semantic typography styles.
Each token includes fontSize, lineHeight, fontFamily, fontWeight, and letterSpacing.

The compositional architecture separates concerns by property type, allowing tokens
to be combined flexibly. For example, typography tokens don't include color properties,
enabling the same typography token to be used with different semantic colors.

[Detailed explanation of composition...]

For more details on the compositional architecture and its rationale, see the
Compositional Color Guide.

## Size Variants

Typography tokens include size variants like labelXs, labelSm, labelMd, labelLg.
These variants provide flexibility for different use cases while maintaining
consistent typography patterns.

[Detailed explanation of size variants...]

For more details on size variant decisions and strategic flexibility, see the
Strategic Flexibility Guide.
```

### Cross-Reference Maintenance

#### After File Moves

When files are moved during organization:

1. Update all cross-reference links to reflect new locations
2. Verify bidirectional links remain consistent
3. Test navigation by clicking links in rendered markdown
4. Document any broken links and fix them immediately

#### Link Validation

Periodically validate cross-reference integrity:

- Verify all links resolve to existing documents
- Check that relative paths are correct from document location
- Confirm section anchors exist in target documents
- Test navigation efficiency (related docs reachable in 2 clicks or less)

#### Navigation as Aid, Not Dependency

Cross-references should be navigation aids, not content dependencies:

- Documents should remain standalone readable
- Cross-references help discover related information
- Don't rely on cross-references to explain core concepts
- Use cross-references to connect related concepts, not replace explanations

---

## Quality Standards

**Note**: This section intentionally uses the same heading as other steering documents because each document defines quality standards specific to its domain. File Organization Standards focuses on metadata and cross-reference quality, while other documents define standards for their respective processes.

### Metadata Validation
- All new files must include organization metadata
- Organization values must match approved list
- Scope must be specific and meaningful
- Purpose must clearly describe file intent

### Cross-Reference Integrity
- All cross-references must be updated after file moves
- Bidirectional links must remain consistent
- Navigation efficiency must be maintained
- Link validation should be performed after organization

### Directory Structure Consistency
- Files must be placed in directories matching their organization metadata
- Directory structure must remain clean and navigable
- Related files must be grouped appropriately
- Temporary files must not accumulate in permanent directories

---

## Organization Decision Guidelines (Conditional Loading)

**📖 CONDITIONAL SECTION - Read only when needed**

**Load when**: 
- Making organization decisions for new files
- Unclear which organization value to use
- Need to understand criteria for each organization type
- Evaluating whether content is framework-strategic vs spec-specific

**Skip when**: 
- Organization metadata is already clear
- Following established patterns
- Just implementing tasks without creating new documentation

---

### Framework-Strategic Criteria
- **Reusable across specs**: Will this be referenced by multiple future specs?
- **Strategic guidance**: Does this provide high-level direction or system architecture?
- **Cross-spec value**: Would other development efforts benefit from this?
- **Architectural knowledge**: Does this capture reusable architectural thinking?

### Spec-Validation Criteria
- **Validation specific**: Does this validate work specific to one spec?
- **Quality assurance**: Is this a quality check or verification report?
- **Spec-bounded**: Is the validation scope limited to one program of work?
- **Implementation verification**: Does this verify spec-specific implementation?

### Spec-Completion Criteria
- **Task completion**: Is this documentation of completed work?
- **Lessons learned**: Does this capture insights from specific implementation?
- **Completion artifacts**: Is this required for task or spec completion?
- **Implementation notes**: Does this document specific implementation decisions?

### Spec-Summary Criteria
- **Parent task summary**: Is this a concise summary of parent task completion?
- **Hook trigger**: Does this need to trigger automatic release detection?
- **Public-facing**: Is this intended as release note content?
- **Commit-style format**: Does this follow concise, what/why/impact format?

---

## Benefits of Metadata-Driven Organization

### Explicit Human Intent
- Human explicitly declares organizational intent when creating files
- No ambiguous interpretation or automated guessing
- Clear audit trail of organizational decisions
- Self-documenting file purpose and scope

### Safe Automation Potential
- Metadata parsing is reliable and unambiguous
- Hook assistance can be added without changing manual process
- Automation builds on established metadata patterns
- Human override always available

### Scalable Structure
- Organization patterns work as project grows
- New organization types can be added as needed
- Directory structure remains clean and navigable
- Related artifacts stay grouped for efficient navigation

### Quality Assurance
- All files have explicit organizational metadata
- Cross-reference integrity can be validated systematically
- Organizational decisions can be audited and reviewed
- File purpose and scope are always clear

---

## Implementation Timeline

### Phase 1: Establish Standard (Immediate)
- Document metadata standard and organization values
- Add organization metadata to existing files
- Implement manual organization for current files
- Update cross-references to reflect new structure

### Phase 2: Validate Process (Short-term)
- Apply standard to new file creation
- Validate organization effectiveness through usage
- Refine organization values based on real-world needs
- Document lessons learned from manual organization

### Phase 3: Hook Integration (Future)
- Create metadata-driven organization hooks
- Implement hook-assisted organization during task completion
- Maintain human control with hook assistance
- Validate hook effectiveness and safety

---

*This file organization standard enables sustainable project structure through explicit metadata-driven organization that scales with project growth while maintaining human control over organizational decisions.*