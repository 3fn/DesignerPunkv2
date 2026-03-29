# Agent Knowledge Base Strategy

**Date**: 2026-03-28
**Purpose**: Define a project-wide strategy for using Kiro's `/knowledge` feature to give agents searchable, platform-filtered access to source code, documentation, and project artifacts
**Organization**: spec-guide
**Scope**: 087-agent-knowledge-base-strategy
**Status**: Draft — Design Outline

---

## Problem Statement

Spec 086 (Task 4.1) identified that Kiro's agent configuration `knowledgeBase` resource type doesn't support `includePatterns` — the `source` field points at an entire directory with no filtering. This forced a workaround: `file://` resources for generated token output + a Platform Resource Map for navigation.

Meanwhile, Kiro's `/knowledge` CLI feature supports exactly the filtering we need (`--include`, `--exclude` patterns) plus semantic search (`Best` index type) and per-agent isolation. This feature was discovered during Spec 086 implementation but is too broad in scope to address within that spec.

The opportunity extends beyond platform agents. Every DesignerPunk agent could benefit from searchable, scoped access to their domain's source files — replacing manual `fs_read`/`code` tool navigation with indexed search.

---

## Current State

### What Agents Have Today

| Agent | Source Access | Method |
|-------|-------------|--------|
| Ada | `src/tokens`, `src/validators`, `src/generators` | `knowledgeBase` in config (full directory, no filtering) |
| Lina | `src/components/core`, `src/composition` | `knowledgeBase` in config (full directory, no filtering) |
| Thurgood | None (uses `code`/`fs_read` tools) | Manual navigation |
| Leonardo | None | Manual navigation + MCP queries |
| Sparky | Generated token output (`dist/`) | `file://` resources (Spec 086) |
| Kenya | Generated token output (`dist/`) | `file://` resources (Spec 086) |
| Data | Generated token output (`dist/`) | `file://` resources (Spec 086) |
| Stacy | None | Manual navigation + MCP queries |

### What `/knowledge` Enables

- **Include/exclude patterns**: Filter indexed content to relevant files only
- **Per-agent isolation**: Each agent's knowledge base is scoped to that agent
- **Semantic search** (`Best`): Natural language queries against indexed content
- **Lexical search** (`Fast`): Keyword-based search for logs, configs, large codebases
- **Persistence**: Survives across chat sessions
- **Background indexing**: Non-blocking, with progress monitoring via `/knowledge show`
- **Update support**: `/knowledge update` re-indexes when source changes

### Constraints

- **CLI-only setup**: `/knowledge add` commands, not declarative JSON config
- **Experimental feature**: May change in future Kiro releases
- **Manual updates**: No auto-update on file change (requires `/knowledge update` or re-add)
- **No cross-agent access**: Agent A cannot search Agent B's knowledge base

---

## Proposed Strategy

### Per-Agent Knowledge Bases

#### Platform Agents (Sparky, Kenya, Data)

Each gets two knowledge bases scoped to their platform:

1. **Component source** — platform implementations + shared cross-platform files
   - Include: `**/platforms/{platform}/**`, `**/types.ts`, `**/tokens.ts`, `**/*.tokens.ts`, `**/contracts.yaml`
   - Source: `src/components/core`
   - Index type: Best (semantic — "find the component that handles focus management")

2. **Token constants** — platform-specific generated tokens
   - Source: `src/tokens/platforms/{platform}` (iOS, Android) or `src/tokens/semantic` (Web)
   - Index type: Best

#### System Agents (Ada, Lina, Thurgood)

These agents already have `knowledgeBase` entries in their JSON configs (Ada, Lina) or use manual navigation (Thurgood). `/knowledge` could replace or supplement:

- **Ada**: Could add filtered knowledge bases for specific token families or test files, replacing the broad `src/tokens` directory index
- **Lina**: Could add filtered knowledge bases excluding platform files she doesn't need for a given task
- **Thurgood**: Could add test infrastructure knowledge base (`src/__tests__`, `application-mcp-server/src/indexer/__tests__`) — currently has no indexed source access

#### Product Agents (Leonardo, Stacy)

- **Leonardo**: Could benefit from indexed spec history (`docs/specs/`) for cross-referencing past architectural decisions
- **Stacy**: Could benefit from indexed lessons learned and completion docs for governance reviews

### Relationship to Existing Config Knowledge Bases

Two options:

**Option A — Replace**: Remove `knowledgeBase` entries from agent JSON configs, use `/knowledge` exclusively. Simpler mental model, one mechanism for all agents.

**Option B — Supplement**: Keep existing JSON config knowledge bases, add `/knowledge` for cases where filtering is needed. Less disruption, but two mechanisms to maintain.

Recommendation deferred to research phase — need to understand whether `/knowledge` and JSON config knowledge bases interact, conflict, or are fully independent.

---

## Open Questions

1. **Interaction between JSON config `knowledgeBase` and `/knowledge` CLI**: Do they share an index? Can they conflict? Does one override the other?
2. **Update workflow**: What's the practical workflow for keeping knowledge bases current? Manual `/knowledge update` after each spec? A hook? A script?
3. **Index size at scale**: With 30 components × 3 platforms × shared files, how large are the indexes? Any performance concerns?
4. **Feature stability**: `/knowledge` is experimental. What's the risk of building a workflow dependency on it?
5. **Semantic vs lexical**: Which index type is better for source code? The docs suggest `Fast` for codebases, `Best` for documentation. Our use case is both — source code with documentation comments.

---

## Scope

### In Scope
- `/knowledge` setup for all 8 agents (or a justified subset)
- Include/exclude patterns per agent based on domain boundaries
- Update workflow (manual, scripted, or hook-based)
- Evaluation of JSON config `knowledgeBase` replacement vs supplementation
- Documentation of the knowledge base strategy for agent onboarding

### Out of Scope
- Changes to the `/knowledge` feature itself (Kiro platform concern)
- MCP tool development for source access (evaluated and deferred in Spec 086)
- Changes to agent prompts (separate concern)

---

## Dependencies

- **Spec 086**: Task 4.1 (current `file://` approach) and Task 4.3 (platform agent validation) provide baseline for comparison
- **Kiro `/knowledge` feature stability**: Experimental status is a risk factor

---

## Success Criteria

1. Platform agents can search their platform's component source without cross-platform noise
2. System agents have indexed access to their domain's source files
3. Update workflow is documented and practical (not burdensome)
4. Agent workflow validation (similar to Spec 086 Task 4.3) confirms improvement over current state
5. Strategy documented for future agent onboarding

---

## Next Steps

1. Research: Test `/knowledge` with one agent (suggest Sparky — web has the most test files) to answer open questions
2. Agent feedback on proposed knowledge base scoping
3. Formalize into requirements if research validates the approach
