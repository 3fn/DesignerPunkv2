# Task 2.1 Completion: Conduct Design Exercises

**Date**: 2026-03-22
**Spec**: 083 — Application MCP Guidance Completeness
**Validation Tier**: 3 — Comprehensive
**Agents**: Leonardo + Peter

---

## What Was Done

Conducted 4 design exercises against the Working Class civic engagement app (federal legislation tracker), using Application MCP tools to select components, validate assemblies, and identify gaps. All 7 production families exercised. Produced `design-exercises.md` with per-screen MCP query traces, component selections, design decisions, gap findings, and a cross-exercise summary.

### Screen Selection

| Screen | Type | Primary Families Exercised |
|--------|------|---------------------------|
| 1. User Profile | Data capture (form) | FormInput, Chip, Avatar, Container, Button, Icon |
| 2. Legislation Feed | Content consumption | Badge, Chip, Container, Avatar, Icon, Button |
| 3. Notifications | Content list | Container, Icon, Badge, Button |
| 4. Dashboard/Home | Overview/summary | Container, Badge, Icon, Button, Avatar |

Selection rationale: maximize family coverage diversity across screen types. Peter expanded from 3 to 4 screens to ensure all 7 families were exercised.

### Exercise 1: User Profile (Data Capture)

Components: Avatar-Base, Container-Base, Input-Radio-Set/Base, Input-Checkbox-Base, Input-Text-Base, Chip-Filter, Button-CTA, Icon-Base.

Key findings:
- Information hierarchy consistency across view/edit modes — section ordering is a data architecture decision
- Selection constraints (max selections, conditional visibility) are parent-orchestrated, not component-level
- Linear progress/completion bar missing from component library
- Multi-section form pattern missing from experience patterns

### Exercise 2: Legislation Feed (Content Consumption)

Components: Badge-Label-Base, Badge-Count-Notification, Chip-Filter, Container-Base, Container-Card-Base (dev), Avatar-Base, Icon-Base, Button-Icon.

Key findings:
- Mixed-content feed pattern missing — heterogeneous card types in scrollable list
- Filter bar + scrollable content pattern missing
- Multi-badge card composition pattern missing (multiple badges with different semantic roles)
- Pattern naming error discovered: design outline said `settings`/`onboarding`, actual names are `settings-screen`/`account-onboarding`

### Exercise 3: Notifications (Content List)

Components: Container-Base, Icon-Base, Badge-Count-Notification, Badge-Label-Base, Button-Icon.

Key findings:
- Content list item (semantic container variant) identified as most impactful missing component — blocks notification lists, email lists, activity feeds, search results
- No read/unread states in existing components
- Platform-adaptive container pattern needed (same content, different container per platform)
- Fewest component selections, most gap findings — identifies biggest hole in component library

### Exercise 4: Dashboard/Home (Overview)

Components: Container-Base, Container-Card-Base (dev), Badge-Count-Base, Badge-Label-Base, Icon-Base, Button-CTA, Button-Icon, Avatar-Base.

Key findings:
- "What is → What will be → What was" dashboard hierarchy principle (Peter)
- Dashboard layout, stat card, empty state, and content preview section patterns all missing
- `context: "dashboards"` severely underserved — only 1 component (development readiness)
- validate_assembly caught missing accessibilityLabel on main container (WCAG 2.4.2)

## MCP Tools Used

| Tool | Queries | Key Outcomes |
|------|---------|-------------|
| find_components | ~15 queries across exercises | Effective for component disambiguation; blind spots on purpose queries ("badge status", "filter bar", "empty state", "user profile", "container grouping" all returned empty) |
| get_experience_pattern | 3 patterns retrieved | `simple-form` too narrow for multi-section form; `settings-screen` structurally useful for comparison; `account-onboarding` reviewed |
| list_experience_patterns | 1 query | Revealed actual pattern names (corrected naming error) |
| validate_assembly | 1 validation | Caught missing accessible name on dashboard main container |

## Cross-Exercise Findings

### Component Gaps (Universal)
- **Content list item** — semantic container variant for interactive list items. High priority.
- **Linear progress/completion bar** — percentage-based visual indicator. Medium priority.
- **Container-Card-Base readiness** — needed in 3/4 exercises, still `development`. Most impactful readiness gap.

### Pattern Gaps (12 total, all tagged `general`)
Multi-section form, view/edit mode screen, mixed-content feed, filter bar + scrollable content, multi-badge card composition, notification list, platform-adaptive container, dashboard layout, stat card, empty state, content preview section, conditional field visibility.

### MCP Tool Gaps
- `purpose` search blind spots on 5+ core use cases
- `context` and `purpose` don't cross-reference
- `context: "dashboards"` severely underserved
- Pattern names in design outline incorrect vs actual

### Design Principles Surfaced
1. Information hierarchy consistency across modes
2. "What is → What will be → What was" (dashboard hierarchy)
3. Selection constraints are parent-orchestrated
4. "Show, don't tell" (guideline, not rule)
5. Prototype as starting point, not spec
6. Universal vs. product-specific separation

## Success Criteria Verification

| Criterion | Status |
|-----------|--------|
| At least 3 design exercises completed | ✅ 4 completed |
| At least 5 of 7 production families exercised | ✅ 7/7 |
| Design reasoning captured per screen | ✅ MCP queries, trade-offs, guidance assessment |
| Gap findings documented for Task 3 | ✅ 3 component gaps, 12 pattern gaps, 4 MCP tool gaps |

## Artifacts

- Created: `.kiro/specs/083-application-mcp-guidance-completeness/design-exercises.md`

## Handoff to Task 2.2

Lina triages the 12 pattern gaps into: formalizable now, needs design refinement (returns to Leonardo+Peter), or deferred to classification gate. Per-pattern output varies — some exercises have full component lists and composition structure, others are thinner. Lina's triage determines which need refinement before formalization.
