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
- Task completion: `Process-Development-Workflow.md` (Layer 2)
- File organization: `Process-File-Organization.md` (Layer 2)
- Spec planning: `Process-Spec-Planning.md` (Layer 2, conditional)

**Token Usage:**
- **Always** prioritize design tokens over hard-coded values
- **MUST** use semantic tokens first — only use primitive tokens when no semantic token exists for the use case
- All tokens must follow Rosetta System: mathematical relationships, unitless values, primitive→semantic hierarchy
- Inform user if hard-coded values are necessary

**Token Selection Priority (MUST follow this order):**
1. **Semantic tokens** — purpose-built for specific use cases (e.g., `tapAreaRecommended` for touch targets, `color.contrast.onPrimary` for content on primary backgrounds)
2. **Primitive tokens** — only when no semantic token exists for the use case
3. **Hard-coded values** — only as last resort, requires user approval

**Why semantic first?** Semantic tokens are self-documenting, theme-aware, and encode design intent. Using `tapAreaRecommended` instead of `space600` makes code readable and maintainable.

**Token-First in Specs:**
- Specs reference tokens, not pixel values: `icon.size100` not `24px`
- Hard values in source docs (design-outlines) **must** be translated to token references when available
- Format: `token.name` with value as comment only when needed for clarity
- Query Token Quick Reference via MCP when uncertain which token to use

**For detailed token guidance, see:**
- Component development: `Component-Development-Guide.md` (Layer 3, conditional)
- Token selection: Component Development Guide's "Token Selection Decision Framework"

**Documentation Approach:**
- Maintain concept-based documentation preventing contamination vectors
- Apply process-first tool development: prove manual processes before automation