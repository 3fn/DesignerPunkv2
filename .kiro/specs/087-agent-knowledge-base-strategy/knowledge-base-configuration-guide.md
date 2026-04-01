# Agent Knowledge Base Configuration Guide

**Date**: 2026-03-29
**Purpose**: Per-agent `/knowledge` setup for searchable, domain-scoped source access
**Status**: Active — update when agents or directory structure change

---

## Overview

Kiro's `/knowledge` CLI gives agents searchable, persistent, per-agent knowledge bases with include/exclude pattern filtering. This guide defines what each agent should have indexed based on their domain boundaries.

**Prerequisite** (one-time):
```bash
kiro-cli settings chat.enableKnowledge true
```

**Principles:**
- Don't duplicate what's already available via MCP servers or `file://` resources
- Use `Best` (semantic) index type for source code and documentation — agents search with natural language
- Use `--include` patterns to scope to the agent's domain
- Exclude `__tests__/` from implementation KBs; index tests separately when useful
- Exclude build artifacts (`dist/`, `node_modules/`, `.git/`)

---

## Platform Agents

Platform agents need their platform's component source (filtered) and token definitions. They already have generated token output via `file://` resources and the Platform Resource Map for navigation.

### Sparky (Web)

```bash
/knowledge add --name "web-components" --path ./src/components/core --include "**/platforms/web/**" --include "**/types.ts" --include "**/tokens.ts" --include "**/*.tokens.ts" --include "**/contracts.yaml" --exclude "**/__tests__/**" --index-type Best

/knowledge add --name "web-tests" --path ./src/components/core --include "**/__tests__/**/*.test.ts" --index-type Best

/knowledge add --name "semantic-tokens" --path ./src/tokens/semantic --exclude "**/__tests__/**" --index-type Best
```

### Kenya (iOS)

```bash
/knowledge add --name "ios-components" --path ./src/components/core --include "**/platforms/ios/**" --include "**/types.ts" --include "**/tokens.ts" --include "**/*.tokens.ts" --include "**/contracts.yaml" --exclude "**/__tests__/**" --index-type Best

/knowledge add --name "ios-tests" --path ./src/components/core --include "**/platforms/ios/*Tests.swift" --index-type Best

/knowledge add --name "semantic-tokens" --path ./src/tokens/semantic --exclude "**/__tests__/**" --index-type Best

/knowledge add --name "ios-platform-tokens" --path ./src/tokens/platforms/ios --index-type Best
```

### Data (Android)

```bash
/knowledge add --name "android-components" --path ./src/components/core --include "**/platforms/android/**" --include "**/types.ts" --include "**/tokens.ts" --include "**/*.tokens.ts" --include "**/contracts.yaml" --exclude "**/__tests__/**" --index-type Best

/knowledge add --name "android-tests" --path ./src/components/core --include "**/platforms/android/*Test.kt" --index-type Best

/knowledge add --name "semantic-tokens" --path ./src/tokens/semantic --exclude "**/__tests__/**" --index-type Best

/knowledge add --name "android-platform-tokens" --path ./src/tokens/platforms/android --index-type Best
```

---

## System Agents

System agents already have JSON config `knowledgeBase` entries for their primary source directories. `/knowledge` supplements these with filtered or cross-domain access they don't currently have.

### Ada (Rosetta Token Specialist)

Already has via JSON config: `src/tokens`, `src/validators`, `src/generators`

**Additional `/knowledge` — not needed currently.** Ada's JSON config knowledge bases cover her full domain. If the token system grows to where filtering is needed (e.g., searching only semantic tokens vs primitives), add filtered KBs then.

### Lina (Stemma Component Specialist)

Already has via JSON config: `src/components` (all platforms, unfiltered)

**Additional `/knowledge`:**
```bash
/knowledge add --name "application-mcp" --path ./application-mcp-server/src --exclude "**/__tests__/**" --exclude "**/dist/**" --index-type Best
```

Lina maintains the Application MCP indexer. Her JSON config KB covers component source but not the MCP server code. This gives her searchable access to the indexer, query engine, and validation logic she owns.

### Thurgood (Test Governance & Spec Standards)

No JSON config knowledge bases currently.

```bash
/knowledge add --name "test-infrastructure" --path ./src/__tests__ --index-type Best

/knowledge add --name "mcp-tests" --path ./application-mcp-server/src --include "**/__tests__/**" --index-type Best

/knowledge add --name "component-tests" --path ./src/components/core --include "**/__tests__/**" --index-type Best
```

Thurgood audits test health across the project. These three KBs cover shared test infrastructure, Application MCP compliance tests, and component-level tests — the three test directories he scans during audits.

---

## Product Agents

### Leonardo (Product Architect)

```bash
/knowledge add --name "spec-history" --path ./docs/specs --index-type Best

/knowledge add --name "experience-patterns" --path ./experience-patterns --index-type Best

/knowledge add --name "layout-templates" --path ./layout-templates --index-type Best
```

Leonardo references past specs for architectural precedent and queries patterns/templates during screen specification. The Application MCP serves patterns and templates too, but indexed source files let him search across pattern definitions (e.g., "which patterns use Container-Card-Base").

### Stacy (Product Governance & QA)

```bash
/knowledge add --name "completion-docs" --path ./.kiro/specs --include "**/completion/**" --index-type Best

/knowledge add --name "spec-summaries" --path ./docs/specs --index-type Best
```

Stacy reviews completion documentation and spec summaries during Lessons Synthesis Reviews. Indexed access lets her search across specs for patterns (e.g., "which specs had escape hatches" or "which tasks reported regressions").

---

## What NOT to Index

| Content | Why Not |
|---------|---------|
| `.kiro/steering/` docs | Already served by Documentation MCP with progressive disclosure |
| Component metadata (schemas, contracts, meta) | Already served by Application MCP with structured queries |
| `dist/` build artifacts | Generated output, not source of truth |
| `node_modules/` | Third-party code, not project knowledge |
| `family-guidance/*.yaml` | Already served by Application MCP via `get_prop_guidance` |

---

## Maintenance

### When to update

Run `/knowledge update` for the relevant agent after:
- Adding new components (platform agents, Lina, Thurgood)
- Modifying token definitions (Ada, platform agents)
- Completing a spec (Leonardo, Stacy)
- Changing test infrastructure (Thurgood)

### When to rebuild

Use `/knowledge remove` + `/knowledge add` if:
- Include/exclude patterns need to change
- Directory structure changes significantly
- Index seems stale or search quality degrades

---

## Experiment Results (2026-03-29)

Validated with Sparky (web). Key findings:
- Search returned relevant results on first natural language query
- `--include` patterns correctly filtered to web-only files
- 0.12s search time for 5 results
- Agent defaulted to manual file reads until prompted — discoverability addressed via Platform Resource Map update
- `Best` index type works well for source code despite docs recommending `Fast` for codebases
