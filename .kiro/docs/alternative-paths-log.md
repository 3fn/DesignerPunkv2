# Alternative Paths Log

**Date Created**: January 15, 2026
**Purpose**: Document unexplored alternatives for difficult decisions. Not a record of disagreements — a resource for future problem-solving.
**Organization**: working-document
**Scope**: cross-project

---

## How to Use This Log

When we face a decision with multiple viable approaches and choose one path, the unchosen alternatives can be documented here. This isn't about proving anyone right or wrong — it's about preserving options we might want to revisit if circumstances change or if we hit unexpected obstacles.

**When to Log:**
- When multiple viable approaches existed
- When the decision involved meaningful trade-offs
- When the alternative might become relevant if circumstances change
- NOT for "I think you're making a mistake" moments
- NOT for minor stylistic or implementation preferences

---

## Entry Template

```markdown
### [Brief Decision Title]

**Date**: YYYY-MM-DD
**Context**: What problem we were solving
**Direction Chosen**: What we decided to do
**Alternative Considered**: A different approach that wasn't taken
**Trade-offs**: 
- Chosen path offers: [benefits]
- Chosen path sacrifices: [costs]
- Alternative would have offered: [benefits]
- Alternative would have sacrificed: [costs]
**Revisit Trigger**: When would it make sense to reconsider this?
```

---

## Log Entries

### CSS Custom Properties Cannot Be Used in @media Queries

**Date**: 2026-03-24
**Context**: During Task 1.3 (showcase stylesheet, spec 084), breakpoint tokens (`--breakpoint-xs/sm/md/lg`) exist as CSS custom properties but cannot be used inside `@media` conditions. This is a CSS specification limitation — `@media (max-width: var(--breakpoint-md))` is invalid CSS. The showcase stylesheet uses hard-coded pixel values in media queries instead.
**Direction Chosen**: Hard-coded breakpoint values in `@media` rules for the showcase site. Breakpoint tokens remain available for JavaScript-based responsive logic and documentation.
**Alternative Considered**: (1) CSS `@custom-media` (spec draft, no browser support yet). (2) Sass/PostCSS preprocessing to resolve token values at build time. (3) JavaScript `matchMedia()` using token values for responsive behavior.
**Trade-offs**: 
- Chosen path offers: zero build step, works today, matches showcase zero-CI constraint
- Chosen path sacrifices: breakpoint values duplicated between tokens and CSS media queries — drift risk
- Alternative (2) would have offered: single source of truth for breakpoints
- Alternative (2) would have sacrificed: zero-CI deployment model, adds build dependency
**Revisit Trigger**: When `@custom-media` reaches baseline browser support, or when a future spec introduces a build step that could resolve token values into media queries. Also relevant for any web consumer of DesignerPunk tokens who needs responsive breakpoints — this is a system-wide limitation, not showcase-specific.

