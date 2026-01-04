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

**Important**: Detailed guidance for completion documentation and cross-references has been moved to dedicated documents. This document now contains priming + MCP query directions for those topics. Query the canonical sources via MCP when you need detailed guidance.

### WHEN Completing Parent Tasks
**Focus on:**
- **Summary Documents** - Two-directory structure overview (priming only)
- **Spec-Specific Organization** - Hook triggering and audience distinction
- **Required Metadata Fields** - Add organization metadata to both documents

**Query via MCP for detailed guidance:**
```
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Two-Document Workflow" })
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Cross-References" })
```

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
- **Spec-Specific Completion** - Purpose and location overview (priming only)
- **Organization Implementation** - Steps 1-2 (add metadata, place file)
- **Directory Structure** - `.kiro/specs/[spec-name]/completion/` location

**Query via MCP for detailed guidance:**
```
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Naming Conventions" })
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Document Templates" })
```

### WHEN Adding Cross-References
**Focus on:**
- **Cross-Reference Standards** - Key principles overview (priming only)
- **Organization Implementation - Step 3** - Update links after moving files

**Query via MCP for detailed guidance:**
```
get_section({ path: ".kiro/steering/Process-Cross-Reference-Standards.md", heading: "How to Format Cross-References" })
get_section({ path: ".kiro/steering/Process-Cross-Reference-Standards.md", heading: "Common Cross-Reference Patterns" })
get_section({ path: ".kiro/steering/Process-Cross-Reference-Standards.md", heading: "Anti-Patterns to Avoid" })
```

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

**For detailed guidance** on completion documentation naming conventions, templates, and the two-document workflow, query Completion Documentation Guide via MCP:

```
get_document_full({ path: ".kiro/steering/Completion Documentation Guide.md" })
```

Or query specific sections:
```
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Naming Conventions" })
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Directory Structure" })
```

#### Summary Documents
```markdown
**Organization**: spec-summary
**Scope**: [spec-name]
```
**Purpose**: Concise, commit-style summaries of parent task completion that trigger release detection hooks and serve as release note content
**Location**: `docs/specs/[spec-name]/` directory
**Examples**: Parent task summaries that trigger automatic release detection

**Key Points**:
- Summary docs are ONLY for parent tasks (not subtasks)
- Naming pattern: `task-N-summary.md` (e.g., `task-1-summary.md`)
- Hook pattern: `**/task-*-summary.md`
- AI workflows require manual trigger: `./.kiro/hooks/release-manager.sh auto`

**For detailed guidance** on summary document templates, cross-references, and the two-document workflow, query Completion Documentation Guide via MCP:

```
get_document_full({ path: ".kiro/steering/Completion Documentation Guide.md" })
```

Or query specific sections:
```
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Two-Document Workflow" })
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Cross-References" })
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Document Templates" })
```

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

| Location | Purpose | Hook Trigger | Audience |
|----------|---------|--------------|----------|
| `docs/specs/[spec-name]/` | Concise summaries | ✅ Yes | Public-facing, release notes |
| `.kiro/specs/[spec-name]/` | Comprehensive docs | ❌ No | Internal, knowledge preservation |

**Why Two Directories?**:
- **Hook Triggering**: The `.kiro/` directory is filtered from Kiro IDE's file watching system
- **Dual Purpose**: Summary documents serve as hook triggers and release note content
- **Clear Separation**: Detailed docs (internal) in `.kiro/`, summaries (public) in `docs/`

**For detailed guidance** on completion documentation directory structure, naming patterns, and the two-document workflow, query Completion Documentation Guide via MCP:

```
get_document_full({ path: ".kiro/steering/Completion Documentation Guide.md" })
```

Or query specific sections:
```
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Directory Structure" })
get_section({ path: ".kiro/steering/Completion Documentation Guide.md", heading: "Naming Conventions" })
```

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

## Cross-Reference Standards

Cross-references are markdown links that connect related documentation, enabling efficient navigation between guides, specs, and completion documents. They belong in documentation, NOT in production code.

**Key Principles**:
- Use relative paths from current document location
- Include relevance explanations with each link
- Group related links in "Related Guides" sections
- Documents should remain standalone readable

**For detailed guidance** on cross-reference formatting, patterns, anti-patterns, and maintenance, query Process-Cross-Reference-Standards via MCP:

```
get_document_full({ path: ".kiro/steering/Process-Cross-Reference-Standards.md" })
```

Or query specific sections:
```
get_section({ path: ".kiro/steering/Process-Cross-Reference-Standards.md", heading: "How to Format Cross-References" })
get_section({ path: ".kiro/steering/Process-Cross-Reference-Standards.md", heading: "Common Cross-Reference Patterns" })
get_section({ path: ".kiro/steering/Process-Cross-Reference-Standards.md", heading: "Anti-Patterns to Avoid" })
```

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