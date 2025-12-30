# Design Outline: Task-Based Conditional Loading for Steering Docs

**Date**: 2025-12-30
**Spec**: XXX - Task-Based Conditional Loading
**Status**: Future Enhancement (Parked)
**Priority**: Low (aspirational automation)

---

## Origin

This enhancement was identified during Spec 032 (Documentation Architecture Audit) Task 10.3 review. The `Relevant Tasks` metadata field exists in steering doc headers but has no automation backing it.

**Current State:**
- Steering docs include `Relevant Tasks: component-development, token-selection` metadata
- This metadata documents *intent* but doesn't trigger any automation
- Docs load via `inclusion: always`, `inclusion: manual`, or `inclusion: fileMatch`

**Gap:**
- No `inclusion: taskMatch` option exists
- AI agents must manually determine which docs are relevant to their current task
- The `Relevant Tasks` field is aspirational documentation, not functional automation

---

## Problem Statement

When AI agents work on tasks, they must:
1. Read the task description in tasks.md
2. Mentally map task type to relevant steering docs
3. Manually query MCP or request manual loading

This works, but creates cognitive overhead. The `Relevant Tasks` metadata already captures the mapping - it just isn't automated.

**Example:**
```markdown
# typography-tokens.md
**Relevant Tasks**: component-development, token-selection
```

If an agent is executing a task tagged `component-development`, this doc should be surfaced automatically (or at least suggested).

---

## Proposed Solution

Add `inclusion: taskMatch` option to steering doc front-matter:

```yaml
---
inclusion: taskMatch
taskMatchPattern: 'component-development, token-selection'
---
```

**Behavior:**
- When agent begins executing a task from tasks.md
- System checks task's `**Type**:` field against `taskMatchPattern`
- Matching docs are auto-loaded or suggested to agent

**Integration Points:**
- Kiro IDE task execution system
- Steering doc loading mechanism
- Possibly MCP server for progressive disclosure

---

## Design Questions

1. **Auto-load vs suggest?**
   - Auto-load: Docs appear in context automatically
   - Suggest: Agent receives notification "These docs may be relevant: [list]"
   - Suggest is safer (avoids token bloat), auto-load is more seamless

2. **How to handle large docs?**
   - Full load could still cause token issues
   - Could combine with MCP: "Load summary, query sections as needed"
   - Could load just the "Quick Reference" section

3. **Task type taxonomy:**
   - Current types: Setup, Implementation, Architecture, Documentation
   - Would need to extend or create parallel taxonomy for doc matching
   - `component-development` and `token-selection` aren't current task types

4. **Kiro IDE integration:**
   - Does Kiro expose task context to steering system?
   - Would this require Kiro feature request?
   - Could this be implemented via hooks instead?

5. **Fallback behavior:**
   - What if task has no type?
   - What if no docs match?
   - Should manual loading always remain available?

---

## Dependencies

- **Kiro IDE**: Would need to expose task context to steering loading system
- **Steering System**: Would need new `inclusion: taskMatch` option
- **Task Type Taxonomy**: May need refinement to support doc matching

---

## Why This is Parked

1. **Current system works**: Manual + MCP is functional and explicit
2. **Kiro dependency**: May require IDE feature request
3. **Complexity vs value**: Significant implementation for incremental improvement
4. **Risk of token bloat**: Auto-loading could cause more problems than it solves

---

## When to Revisit

Consider prioritizing this spec when:
- Kiro adds task-context-aware steering features
- Manual loading becomes a significant friction point
- Token doc count grows significantly (more docs = more manual overhead)
- AI agents consistently miss relevant docs during task execution

---

## Related Context

- **Spec 032**: Documentation Architecture Audit (identified the gap)
- **File Organization Standards**: Defines `Relevant Tasks` metadata field
- **00-Steering Documentation Directional Priorities**: Defines current loading system

---

*This outline captures a future enhancement opportunity. Full requirements, design, and tasks to be developed if/when this spec is prioritized.*
