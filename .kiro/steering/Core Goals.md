---
inclusion: always
---

# Core Goals

**Date**: 2025-10-20
**Last Reviewed**: 2025-12-15
**Purpose**: Core project context and development practices for DesignerPunk design system
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 1
**Relevant Tasks**: all-tasks

## Core Project Context

DesignerPunk is a True Native cross-platform design system with mathematical foundations, built for Human-AI collaboration.

**Key Principles:**
- Build-time platform separation (web/iOS/Android) rather than runtime detection
- Mathematical foundation: REM-style baseline grid with modular scale
- Accessibility-first: WCAG 2.1 AA compliance
- Cross-platform consistency through unitless token architecture
- Human-AI partnership as foundational value

**For detailed architectural guidance, see:**
- True Native Architecture: `preserved-knowledge/true-native-architecture-concepts.md`
- Token System: `docs/token-system-overview.md`
- Mathematical Foundation: `preserved-knowledge/token-architecture-2-0-mathematics.md`

## Development Practices

**Task Completion:**
- Follow systematic workflow with automated git integration
- Use hook system: `./.kiro/hooks/commit-task.sh "Task Name"`
- Repository: https://github.com/3fn/DesignerPunkv2 (single-branch workflow on main)

**For detailed workflow guidance, see:**
- Task completion: `Development Workflow.md` (Layer 2)
- File organization: `File Organization Standards.md` (Layer 2)
- Spec planning: `Spec Planning Standards.md` (Layer 2, conditional)

**Token Usage:**
- Always prioritize design tokens over hard-coded values
- Use semantic tokens before primitive tokens
- All tokens must follow Rosetta System: mathematical relationships, unitless values, primitive→semantic hierarchy
- Inform Human partner if hard-coded values are necessary

**For detailed token guidance, see:**
- Component development: `Component Development and Practices Guide.md` (Layer 3, conditional)
- Token selection: Component Development and Practices Guide's "Token Selection Decision Framework"

**Documentation Approach:**
- Maintain concept-based documentation preventing contamination vectors
- Apply process-first tool development: prove manual processes before automation