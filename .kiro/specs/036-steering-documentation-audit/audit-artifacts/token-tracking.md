# Steering Documentation Token Tracking

**Date**: 2026-01-03
**Spec**: 036 - Steering Documentation Audit
**Status**: Discovery Phase - Token Audit Complete
**Total Documents**: 55
**Total Tokens**: 281,679
**Session Start Load (Steering Only)**: 39,124 tokens (13.9% of steering docs)
**Observed Context Usage**: ~45% baseline (Kiro UI, Claude Opus 4.5, fresh "Hi" session)

---

## By Layer

| Layer | Doc Count | Total Tokens | % of Total |
|-------|-----------|--------------|------------|
| 0     | 1         | 3,711        | 1.3%       |
| 1     | 3         | 2,640        | 0.9%       |
| 2     | 22        | 171,599      | 60.9%      |
| 3     | 29        | 103,729      | 36.8%      |
| **TOTAL** | **55** | **281,679**  | **100%**   |

**Layer 0-1 Combined**: 6,351 tokens (always loaded)
**Layer 2 Always-Loaded**: 32,773 tokens (Development Workflow, File Organization Standards only)
**Session Start Load (inclusion: always)**: 39,124 tokens (6 documents total)

---

## By Document

### Layer 0 (Meta-Guide)

| Document | Layer | Tokens | Always Loaded? | Source |
|----------|-------|--------|----------------|--------|
| 00-Steering Documentation Directional Priorities.md | 0 | 3,711 | Yes | MCP get_documentation_map |

**Layer 0 Total**: 3,711 tokens

### Layer 1 (Foundational)

| Document | Layer | Tokens | Always Loaded? | Source |
|----------|-------|--------|----------------|--------|
| Personal Note.md | 1 | 624 | Yes | MCP get_document_summary |
| Core Goals.md | 1 | 557 | Yes | MCP get_document_summary |
| Start Up Tasks.md | 1 | 1,459 | Yes | MCP get_document_summary |

**Layer 1 Total**: 2,640 tokens

### Layer 2 (Frameworks and Patterns)

| Document | Layer | Tokens | Always Loaded? | Source |
|----------|-------|--------|----------------|--------|
| Component Quick Reference.md | 2 | 2,366 | Manual | MCP get_documentation_map |
| Cross-Platform vs Platform-Specific Decision Framework.md | 2 | 2,914 | Manual | MCP get_documentation_map |
| Development Workflow.md | 2 | 16,093 | **Always** | MCP get_documentation_map |
| File Organization Standards.md | 2 | 16,680 | **Always** | MCP get_documentation_map |
| Release Management System.md | 2 | 2,408 | Manual | MCP get_documentation_map |
| Spec Planning Standards.md | 2 | 27,135 | Manual | MCP get_documentation_map |
| Task-Type-Definitions.md | 2 | 3,793 | Manual | MCP get_documentation_map |
| Test Development Standards.md | 2 | 16,485 | Manual | MCP get_documentation_map |
| Test Failure Audit Methodology.md | 2 | 14,845 | Manual | MCP get_documentation_map |
| Token Quick Reference.md | 2 | 1,665 | Manual | MCP get_documentation_map |
| Token Resolution Patterns.md | 2 | 3,832 | Manual | MCP get_documentation_map |
| behavioral-contract-validation-framework.md | 2 | 4,811 | Manual | MCP get_documentation_map |
| component-family-development-standards.md | 2 | 9,446 | Manual | MCP get_documentation_map |
| component-family-inheritance-structures.md | 2 | 6,437 | Manual | MCP get_documentation_map |
| component-family-templates.md | 2 | 8,101 | Manual | MCP get_documentation_map |
| component-readiness-status-system.md | 2 | 4,730 | Manual | MCP get_documentation_map |
| component-schema-format.md | 2 | 8,517 | Manual | MCP get_documentation_map |
| mcp-component-family-document-template.md | 2 | 4,155 | Manual | MCP get_documentation_map |
| platform-implementation-guidelines.md | 2 | 5,956 | Manual | MCP get_documentation_map |
| primitive-vs-semantic-usage-philosophy.md | 2 | 2,841 | Manual | MCP get_documentation_map |
| stemma-system-principles.md | 2 | 8,389 | Manual | MCP get_documentation_map |

**Layer 2 Total**: 171,599 tokens (22 documents)
**Layer 2 Always-Loaded**: 32,773 tokens (2 documents: Development Workflow, File Organization Standards)

### Layer 3 (Specific Implementations)

#### Token Documentation (14 docs)

| Document | Layer | Tokens | Always Loaded? | Source |
|----------|-------|--------|----------------|--------|
| accessibility-tokens.md | 3 | 4,973 | Conditional | MCP get_documentation_map |
| blend-tokens.md | 3 | 4,014 | Conditional | MCP get_documentation_map |
| border-tokens.md | 3 | 3,628 | Conditional | MCP get_documentation_map |
| color-tokens.md | 3 | 5,279 | Conditional | MCP get_documentation_map |
| glow-tokens.md | 3 | 4,058 | Conditional | MCP get_documentation_map |
| layering-tokens.md | 3 | 5,007 | Conditional | MCP get_documentation_map |
| motion-tokens.md | 3 | 5,360 | Conditional | MCP get_documentation_map |
| opacity-tokens.md | 3 | 4,523 | Conditional | MCP get_documentation_map |
| radius-tokens.md | 3 | 3,523 | Conditional | MCP get_documentation_map |
| responsive-tokens.md | 3 | 5,311 | Conditional | MCP get_documentation_map |
| semantic-token-structure.md | 3 | 8,871 | Conditional | MCP get_documentation_map |
| shadow-tokens.md | 3 | 6,378 | Conditional | MCP get_documentation_map |
| spacing-tokens.md | 3 | 5,489 | Conditional | MCP get_documentation_map |
| typography-tokens.md | 3 | 4,858 | Conditional | MCP get_documentation_map |

**Token Documentation Total**: 71,272 tokens (14 documents)

#### Component Documentation (12 docs - Layer 3 only)

**Note**: Original task estimated 18 docs, but actual count is 12 Layer 3 component docs. Additional 7 component-related docs exist in Layer 2 (already counted in Layer 2 section).

| Document | Layer | Tokens | Always Loaded? | Source |
|----------|-------|--------|----------------|--------|
| avatar-components.md | 3 | 1,133 | Conditional | MCP get_documentation_map |
| badge-components.md | 3 | 1,130 | Conditional | MCP get_documentation_map |
| button-components.md | 3 | 3,094 | Conditional | MCP get_documentation_map |
| container-components.md | 3 | 3,143 | Conditional | MCP get_documentation_map |
| data-display-components.md | 3 | 1,131 | Conditional | MCP get_documentation_map |
| divider-components.md | 3 | 1,002 | Conditional | MCP get_documentation_map |
| form-inputs-components.md | 3 | 5,183 | Conditional | MCP get_documentation_map |
| icon-components.md | 3 | 3,015 | Conditional | MCP get_documentation_map |
| loading-components.md | 3 | 1,067 | Conditional | MCP get_documentation_map |
| modal-components.md | 3 | 1,226 | Conditional | MCP get_documentation_map |
| navigation-components.md | 3 | 1,112 | Conditional | MCP get_documentation_map |
| Component Development and Practices Guide.md | 3 | 11,208 | Conditional | MCP get_documentation_map |

**Component Documentation Total**: 33,444 tokens (12 documents)

**Component Family Docs Breakdown**:
- Implemented families (with schemas): button, container, form-inputs, icon = 14,435 tokens
- Placeholder families: avatar, badge, data-display, divider, loading, modal, navigation = 7,801 tokens
- Component Development Guide: 11,208 tokens

**Layer 2 Component-Related Docs** (already counted in Layer 2):
- Component Quick Reference.md: 2,366 tokens
- component-family-development-standards.md: 9,446 tokens
- component-family-inheritance-structures.md: 6,437 tokens
- component-family-templates.md: 8,101 tokens
- component-readiness-status-system.md: 4,730 tokens
- component-schema-format.md: 8,517 tokens
- mcp-component-family-document-template.md: 4,155 tokens
- **Layer 2 Component Total**: 43,752 tokens (7 documents)

**All Component Documentation Combined**: 77,196 tokens (19 documents across Layers 2-3)

#### Remaining Documentation (4 docs)

**Note**: Original task estimated ~12 remaining docs, but actual count is 4 Layer 3 infrastructure/guide docs. The discrepancy is because Component Development and Practices Guide was already counted in the Component Documentation section.

| Document | Layer | Tokens | Always Loaded? | Source |
|----------|-------|--------|----------------|--------|
| A Vision of the Future.md | 3 | 8,856 | Conditional | MCP get_documentation_map |
| BUILD-SYSTEM-SETUP.md | 3 | 1,975 | Conditional | MCP get_documentation_map |
| Browser Distribution Guide.md | 3 | 4,220 | Conditional | MCP get_documentation_map |
| Technology Stack.md | 3 | 762 | Conditional | MCP get_documentation_map |

**Remaining Documentation Total**: 15,813 tokens (4 documents)

---

## Summary Totals

### Layer Totals

| Layer | Doc Count | Total Tokens | % of Total |
|-------|-----------|--------------|------------|
| 0     | 1         | 3,711        | 1.3%       |
| 1     | 3         | 2,640        | 0.9%       |
| 2     | 22        | 171,599      | 60.9%      |
| 3     | 29        | 103,729      | 36.8%      |
| **TOTAL** | **55** | **281,679**  | **100%**   |

### Layer 3 Breakdown

| Category | Doc Count | Total Tokens | % of Layer 3 |
|----------|-----------|--------------|--------------|
| Token Documentation | 14 | 71,272 | 68.7% |
| Component Documentation | 11 | 22,236 | 21.4% |
| Component Development Guide | 1 | 11,208 | 10.8% |
| Infrastructure/Guides | 4 | 15,813 | 15.2% |
| **Layer 3 Total** | **29** | **103,729** | **100%** |

**Note**: Component Development Guide counted separately from component family docs for clarity.

### Session Start Load Analysis

**Always-Loaded Documents** (inclusion: always):

| Document | Layer | Tokens |
|----------|-------|--------|
| 00-Steering Documentation Directional Priorities.md | 0 | 3,711 |
| Personal Note.md | 1 | 624 |
| Core Goals.md | 1 | 557 |
| Start Up Tasks.md | 1 | 1,459 |
| Development Workflow.md | 2 | 16,093 |
| File Organization Standards.md | 2 | 16,680 |
| **Session Start Total** | | **39,124** |

**Session Start Load Percentage**: 39,124 / 281,679 = **13.9%** of total steering documentation

### Context Load Categories

| Category | Doc Count | Total Tokens | % of Total |
|----------|-----------|--------------|------------|
| Always Loaded (Session Start) | 6 | 39,124 | 13.9% |
| Manual (MCP Query) | 20 | 132,526 | 47.1% |
| Conditional (Task-Based) | 29 | 110,029 | 39.1% |
| **TOTAL** | **55** | **281,679** | **100%** |

**Note**: Manual = Layer 2 docs with `inclusion: manual`. Conditional = Layer 3 docs with `inclusion: conditional`.

---

## Notes

- Token counts populated during Tasks 1.2-1.6
- Layer 0 token count confirmed via MCP (3,711 tokens)
- Layer 1 documents confirmed via MCP metadata (layer field)
- Layer 2 has 22 documents (not 6 as originally estimated in design)
  - Only 2 are `inclusion: always`: Development Workflow, File Organization Standards
  - Remaining 20 are `inclusion: manual` (loaded via MCP query)
- **Layer 3 Token Documentation**: 14 documents totaling 71,272 tokens
  - All are `inclusion: conditional` (loaded based on task type)
  - Largest: semantic-token-structure.md (8,871 tokens)
  - Smallest: radius-tokens.md (3,523 tokens)
  - Average: ~5,091 tokens per token doc
- **Layer 3 Component Documentation**: 12 documents totaling 33,444 tokens
  - Original task estimated 18 docs, actual count is 12 in Layer 3
  - 11 component family docs + 1 Component Development Guide
  - 4 implemented families (button, container, form-inputs, icon): 14,435 tokens
  - 7 placeholder families (avatar, badge, data-display, divider, loading, modal, navigation): 7,801 tokens
  - Placeholder docs are smaller (~1,000-1,200 tokens) vs implemented (~3,000-5,200 tokens)
- **Layer 2 Component-Related Docs**: 7 documents totaling 43,752 tokens
  - These are frameworks/standards for component development, not component family docs
  - Includes: Quick Reference, development standards, inheritance structures, templates, readiness system, schema format, MCP template
- **Layer 3 Remaining/Infrastructure Docs**: 4 documents totaling 15,813 tokens
  - Original task estimated ~12 remaining docs, actual count is 4
  - Includes: A Vision of the Future, BUILD-SYSTEM-SETUP, Browser Distribution Guide, Technology Stack
  - Component Development Guide was already counted in component documentation
- **CRITICAL DISTINCTION**: Layer ≠ Inclusion mode
  - Layer indicates conceptual grouping (0=meta, 1=foundation, 2=frameworks, 3=specific)
  - Inclusion mode (`always`, `manual`, `conditional`) determines actual loading behavior
  - MCP doesn't expose inclusion mode - must check front-matter directly
- Session start load = sum of `inclusion: always` documents only
- **DISCOVERY**: Original task description mentioned "6 docs" for Layer 2, but actual count is 22 docs
  - Design document batching strategy needs revision
  - Layer 2 is much larger than anticipated
- **DISCOVERY**: Original task 1.5 mentioned "18 docs" for Component documentation
  - Actual Layer 3 component docs: 12 documents
  - Additional Layer 2 component-related docs: 7 documents
  - Total component documentation: 19 documents across both layers
- **DISCOVERY**: Original task 1.6 mentioned "~12 docs" for remaining documentation
  - Actual remaining docs: 4 documents
  - Discrepancy due to Component Development Guide already counted in component section

---

## Key Findings for Checkpoint 1

### ⚠️ CRITICAL: Understanding the 13.9% Figure

**The 13.9% is a THEORETICAL ratio, not actual context usage.**

| Metric | Value | What It Measures |
|--------|-------|------------------|
| 13.9% (theoretical) | 39,124 / 281,679 | Steering docs loaded at start ÷ total steering docs |
| ~61% (observed) | Kiro UI indicator | Actual context usage after steering + system prompt + workflow |

**Why the massive difference?**

The 13.9% only measures steering-to-steering ratio. Your actual context load includes:
1. **Always-loaded steering docs**: ~39,124 tokens
2. **System prompt**: Substantial (workflow instructions, rules, capabilities)
3. **Tool definitions**: All available tools and their schemas
4. **Spec files loaded**: requirements.md, design.md, tasks.md for current spec
5. **Conversation history**: Grows with each exchange
6. **File reads**: Any files examined during the session

**Practical implication**: The 13.9% is useful for comparing steering docs to each other (identifying which docs to optimize), but it does NOT predict your actual context experience.

**Observed baselines** (Claude Opus 4.5, January 2026):
- **Fresh session ("Hi" prompt)**: 45% context usage after steering docs + tasks.md read
- **Mid-session (after spec work)**: ~61% context usage

**Interpretation**: The 45% baseline represents the true "session start" cost. The jump to 61% came from accumulated conversation history and file reads during spec work.

### Token Load Summary
- **Total Steering Documentation**: 281,679 tokens across 55 documents
- **Session Start Load (steering only)**: 39,124 tokens (13.9% of steering docs)
- **Observed Context Usage**: ~45% baseline (includes system prompt, tools, steering docs)
- **Soft Aspiration Target**: ~25% context usage at session start
- **Current Status**: ⚠️ ~20 percentage points above target - optimization has real value

### Largest Documents (Optimization Candidates)
1. Spec Planning Standards.md - 27,135 tokens (Layer 2, manual)
2. Development Workflow.md - 16,093 tokens (Layer 2, **always**)
3. File Organization Standards.md - 16,680 tokens (Layer 2, **always**)
4. Test Development Standards.md - 16,485 tokens (Layer 2, manual)
5. Test Failure Audit Methodology.md - 14,845 tokens (Layer 2, manual)

### Session Start Load Breakdown
| Document | Tokens | % of Session Start |
|----------|--------|-------------------|
| File Organization Standards.md | 16,680 | 42.6% |
| Development Workflow.md | 16,093 | 41.1% |
| 00-Steering Documentation Directional Priorities.md | 3,711 | 9.5% |
| Start Up Tasks.md | 1,459 | 3.7% |
| Personal Note.md | 624 | 1.6% |
| Core Goals.md | 557 | 1.4% |
| **Total** | **39,124** | **100%** |

### Observations
1. **Layer 2 dominates**: 60.9% of all tokens are in Layer 2 (frameworks/patterns)
2. **Two large always-loaded docs**: Development Workflow + File Organization Standards = 83.7% of session start load
3. **Conditional loading working**: Layer 3 (39.1% of tokens) only loads when needed
4. **MCP query strategy effective**: 47.1% of tokens available via manual MCP query, not auto-loaded
