---
inclusion: always
---

# File Organization Standards

**Date**: January 10, 2025  
**Purpose**: Metadata-driven file organization system for sustainable project structure  
**Organization**: process-standard  
**Scope**: cross-project  
**Approach**: Process-first tool development with human-controlled organization

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

#### Process Standards
```markdown
**Organization**: process-standard
**Scope**: cross-project
```
**Purpose**: Reusable process documentation and standards
**Location**: `.kiro/steering/` or `docs/processes/` directory
**Examples**: Development workflows, quality standards, methodology documentation

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
```
.kiro/specs/[spec-name]/
├── requirements.md                        # Spec requirements
├── design.md                             # Spec design
├── tasks.md                              # Implementation tasks
├── validation/                           # Spec-specific validation artifacts
│   ├── framework-validation-report.md    # Validation against preserved knowledge
│   ├── cross-reference-validation.md     # Link integrity verification
│   └── [other-validation-files].md       # Additional validation artifacts
└── completion/                           # Spec-specific completion documentation
    ├── task-[n]-completion.md            # Individual task completion docs
    └── spec-completion-summary.md        # Overall spec completion documentation
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

## Organization Implementation

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

## Quality Standards

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

## Organization Decision Guidelines

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