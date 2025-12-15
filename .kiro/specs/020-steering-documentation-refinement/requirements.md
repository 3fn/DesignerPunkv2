# Requirements Document: Steering Documentation Refinement

**Date**: December 15, 2025
**Spec**: 020 - Steering Documentation Refinement
**Status**: Requirements Phase
**Dependencies**: None (but Spec 021 - MCP Documentation Server depends on this spec's completion)

---

## Introduction

The steering documentation system provides AI agents with guidance for executing tasks and leveraging the DesignerPunk design system. The current system uses conditional loading and "AI Agent Reading Priorities" sections to manage token usage, but feedback from AI agents has identified opportunities for improvement.

This spec refines the steering documentation structure to reduce redundancy, improve clarity, and prepare the documentation for machine-readable consumption by an MCP (Model Context Protocol) server in Spec 021.

### Key Architectural Principles

- **Progressive Disclosure**: Documentation structured like a meal (appetizer → main course → dessert)
- **Task-Relevant Metadata**: Machine-readable metadata enables precise document loading
- **Layer-Based Organization**: Clear boundaries between foundational concepts, frameworks, and implementations
- **MCP-Ready Structure**: Outputs support future MCP server implementation

---

## Glossary

- **Steering Documentation**: Guidance documents loaded by AI agents to inform task execution
- **Conditional Loading**: System that loads documents only when specific triggers match task type
- **Progressive Disclosure**: Layered information architecture where complexity increases gradually
- **AI Agent Reading Priorities**: Sections at document tops that guide strategic reading
- **Task-Relevant Metadata**: Machine-readable metadata indicating which task types need which documents
- **MCP (Model Context Protocol)**: Protocol for serving documentation as callable functions
- **EARS Format**: Easy Approach to Requirements Syntax (WHEN/IF/THEN structure)
- **Layer 0**: Meta-guide - How to use the steering documentation system
- **Layer 1**: Foundational concepts and principles (Core Goals, Personal Note)
- **Layer 2**: Frameworks and patterns (Development Workflow, File Organization)
- **Layer 3**: Specific implementations (Component Development, Build System)

---

## Requirements

### Requirement 1: Task-Relevant Metadata System

**User Story**: As an AI agent, I want documents to declare which task types they're relevant for, so that I can load only the documentation I need for my current work.

#### Acceptance Criteria

1. WHEN a steering document is created or updated THEN the system SHALL include task-relevant metadata in the document header
2. WHEN task-relevant metadata is added THEN the system SHALL use the standardized 14-type task vocabulary (spec-creation, general-task-execution, architecture, coding, accessibility-development, validation, debugging, documentation, maintenance, performance-optimization, file-organization, refactoring, migration, hook-setup)
3. WHEN multiple task types are relevant THEN the system SHALL list all applicable task types in the metadata
4. WHEN a document applies to all task types THEN the system SHALL use "all-tasks" as the metadata value
5. WHEN metadata is validated THEN the system SHALL verify task type names match the standardized vocabulary exactly

### Requirement 2: Progressive Disclosure Map

**User Story**: As an AI agent, I want a clear map of documentation layers, so that I understand which documents provide foundational concepts versus specific implementations.

#### Acceptance Criteria

1. WHEN the documentation system is organized THEN the system SHALL define four distinct layers (Layer 0: Meta-guide, Layer 1: Foundational Concepts, Layer 2: Frameworks and Patterns, Layer 3: Specific Implementations)
2. WHEN a document is assigned to a layer THEN the system SHALL include layer metadata in the document header
3. WHEN Layer 0 documents are loaded THEN the system SHALL teach AI agents how to use the steering documentation system itself
4. WHEN Layer 1 documents are loaded THEN the system SHALL provide foundational concepts and project principles that apply across all work
5. WHEN Layer 2 documents are loaded THEN the system SHALL provide reusable frameworks and patterns for common workflows
6. WHEN Layer 3 documents are loaded THEN the system SHALL provide specific implementation guidance for particular domains

### Requirement 3: Core Goals Refinement

**User Story**: As an AI agent, I want Core Goals to be concise and focused, so that I can quickly understand project principles without reading extensive detail.

#### Acceptance Criteria

1. WHEN Core Goals is refined THEN the system SHALL reduce the document to essential project context and development practices only
2. WHEN detailed guidance exists in other documents THEN Core Goals SHALL reference those documents rather than duplicating content
3. WHEN Core Goals is read THEN the system SHALL provide a complete understanding of project principles in under 100 lines
4. WHEN Core Goals references other documents THEN the system SHALL use clear cross-reference format with document names and brief descriptions

### Requirement 4: Section-Level Conditional Markers

**User Story**: As an AI agent, I want sections within documents to declare their relevance, so that I can skip sections that don't apply to my current task.

#### Acceptance Criteria

1. WHEN a document contains multiple distinct topics THEN the system SHALL add conditional markers to section headings
2. WHEN a conditional marker is added THEN the system SHALL use the format "## Section Name (Conditional Loading)" followed by load/skip criteria
3. WHEN load criteria are specified THEN the system SHALL clearly state which task types or conditions trigger loading
4. WHEN skip criteria are specified THEN the system SHALL clearly state when the section can be safely skipped
5. WHEN a section applies to all tasks THEN the system SHALL omit conditional markers (default is always-loaded)

### Requirement 5: Intentional Redundancy Guidelines

**User Story**: As an AI agent, I want to understand when redundancy is intentional versus when it indicates a documentation issue, so that I can trust the guidance I'm reading.

#### Acceptance Criteria

1. WHEN redundancy exists between documents THEN the system SHALL document the rationale for intentional redundancy
2. WHEN a concept appears in multiple documents THEN the system SHALL designate one document as the authoritative source
3. WHEN a document references a concept defined elsewhere THEN the system SHALL cross-reference the authoritative source
4. WHEN redundancy is identified during review THEN the system SHALL evaluate whether it serves a clear purpose (different audience, different context, different level of detail)
5. WHEN redundancy serves no clear purpose THEN the system SHALL consolidate content into the authoritative source

### Requirement 6: Metadata Maintenance Process

**User Story**: As a documentation maintainer, I want a clear process for keeping metadata current, so that AI agents can trust the task-relevant metadata and layer assignments.

#### Acceptance Criteria

1. WHEN the steering documentation system is implemented THEN the system SHALL conduct an initial audit of all steering documents
2. WHEN the initial audit is conducted THEN the system SHALL add task-relevant metadata and layer assignments to all documents
3. WHEN metadata is added THEN the system SHALL include a "Last Reviewed" date in the document header
4. WHEN steering documentation is updated THEN the system SHALL update the "Last Reviewed" date
5. WHEN quarterly reviews are conducted THEN the system SHALL verify metadata accuracy and update as needed

### Requirement 7: MCP-Ready Structure

**User Story**: As a future MCP server implementer, I want steering documentation structured for machine-readable consumption, so that I can serve documentation as callable functions in Spec 021.

#### Acceptance Criteria

1. WHEN steering documents are structured THEN the system SHALL use consistent metadata schema across all documents
2. WHEN task vocabulary is defined THEN the system SHALL maintain stable task type names that can be used as function parameters
3. WHEN layers are defined THEN the system SHALL create clear boundaries that enable different MCP serving strategies per layer
4. WHEN content is structured THEN the system SHALL use consistent heading hierarchy and section markers that enable programmatic parsing
5. WHEN cross-references are created THEN the system SHALL use consistent format that enables automated link resolution

### Requirement 8: Documentation Quality Standards

**User Story**: As an AI agent, I want steering documentation to follow consistent quality standards, so that I can efficiently extract the information I need.

#### Acceptance Criteria

1. WHEN steering documents are created THEN the system SHALL include "AI Agent Reading Priorities" sections at the top
2. WHEN "AI Agent Reading Priorities" sections are written THEN the system SHALL use WHEN/THEN format with clear task type conditions
3. WHEN documents exceed 200 lines THEN the system SHALL include conditional markers for major sections
4. WHEN cross-references are added THEN the system SHALL use relative paths and descriptive link text
5. WHEN examples are provided THEN the system SHALL use clear formatting (code blocks, bullet points) for readability

---

## Validation Approach

Requirements will be validated through:

1. **Metadata Audit**: Verify all steering documents include task-relevant metadata and layer assignments
2. **AI Agent Testing**: Test with AI agents to verify improved clarity and reduced token usage
3. **MCP Compatibility Check**: Verify structure supports programmatic parsing for Spec 021
4. **Cross-Reference Validation**: Verify all cross-references resolve correctly
5. **Quarterly Review Process**: Establish and document metadata maintenance workflow

---

**Organization**: spec-validation
**Scope**: 020-steering-documentation-refinement
