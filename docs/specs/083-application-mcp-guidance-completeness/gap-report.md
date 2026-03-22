# Application MCP Gap Report — Spec 083

**Date**: 2026-03-22
**Source**: Design exercises conducted during Spec 083 (4 exercises: user profile, legislation feed, notifications, dashboard)
**Purpose**: Structured findings for downstream specs and system agents
**Classification gate**: All gaps require Peter's classification before proceeding to downstream specs

---

## Component Gaps

### 1. Content List Item (Semantic Container Variant)

**Description**: Interactive container with leading visual slot, primary/secondary text, metadata, and content-consumption state (read/unread). Distinct from Button-VerticalList-Item (action semantics). Applies to notification lists, email lists, activity feeds, search results.
**What was tried**: Evaluated Button-VerticalList-Item — wrong semantics (action-oriented states: rest, selected, checked). No content-consumption states exist in any current component.
**What happened**: No component models read/unread or content-consumption interaction patterns. Peter noted this could be a semantic variant of Container-Base or Container-Card-Base rather than a new family.
**Classification**: missing component
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — notification lists, email lists, message lists, activity feeds, and search results are universal screen types across products. The structural need (leading visual + text + metadata + consumption state) is product-independent.
**Final scope**: `universal` ✅
**Downstream target**: Lina (new component spec)

---

### 2. Linear Progress / Completion Bar

**Description**: Percentage-based visual progress indicator for completion tracking. Not a stepper (wrong metaphor for non-sequential completion). Needed for profile completeness, onboarding progress, any completion tracking.
**What was tried**: Queried `purpose: "progress indicator"` — returned ProgressIndicator family components (steppers, pagination dots), all `development` readiness. None model linear percentage-based progress.
**What happened**: The ProgressIndicator family has steppers and pagination (sequential/discrete), but no continuous/percentage-based variant.
**Classification**: missing component
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — completion bars appear in onboarding flows, profile completeness, upload progress, and loading states across every product category.
**Final scope**: `universal` ✅
**Downstream target**: Lina (new component spec, ProgressIndicator family)

---

### 3. Container-Card-Base Readiness

**Description**: Container-Card-Base (elevated, interactive card) needed in 3 of 4 exercises but still at `development` readiness. Most impactful readiness gap across all exercises.
**What was tried**: Used Container-Base as fallback in all exercises. Container-Card-Base was the better fit for feed items, notification cards, stat cards, and content previews.
**What happened**: Container-Base works structurally but lacks card-specific styling (elevation, interactive behavior) that Container-Card-Base provides.
**Classification**: missing component (readiness gap)
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — cards are the most common content container pattern in modern UI. Blocking 3 of 4 exercise screens.
**Final scope**: `universal` (provisional — needs semantic assessment before accelerating)
**Downstream target**: Lina (accelerate Container-Card-Base to production readiness)

---

## Pattern Gaps

### 4. Multi-Section Form

**Description**: Form with multiple grouped sections (fieldsets), each with a heading and related inputs, maintaining consistent information hierarchy. Example: profile form with Location, Demographics, Income, Work, Family, Interests sections.
**What was tried**: Queried `get_experience_pattern("simple-form")` — found, but models a single fieldset with inputs and submit button. No multi-section variant.
**What happened**: `simple-form` is too flat for real-world forms that have grouped sections with distinct data categories.
**Classification**: missing pattern
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — multi-section forms appear in registration, profile editing, settings, checkout, and any complex data capture flow.
**Final scope**: `structurally-universal` — system provides general spacing/layout principles for grouped sections, not prescriptive form patterns
**Downstream target**: Spec 069

---

### 5. View/Edit Mode Screen

**Description**: Screen that displays data in read-only mode with an edit affordance that transitions to an editable form, maintaining information hierarchy across modes. Components change; structure doesn't.
**What was tried**: No pattern or context query matched this concept.
**What happened**: No experience pattern addresses the common pattern of viewing data and switching to edit mode while preserving section ordering and hierarchy.
**Classification**: missing pattern
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — profile screens, settings screens, account details, and any CRUD interface uses this pattern.
**Final scope**: `product-specific` — principle (hierarchy consistency across modes) is universal and captured in design exercises. Component-use pattern is product-dependent.
**Downstream target**: —

---

### 6. Mixed-Content Feed

**Description**: Heterogeneous card types in a scrollable list with shared container patterns but different internal compositions. Parent orchestrates which card layout to render based on content type.
**What was tried**: Queried `context: "content-feeds"` — returned Chip-Filter and Container-Card-Base (development).
**What happened**: No pattern exists for feeds with multiple content types sharing a container pattern but varying internal structure.
**Classification**: missing pattern
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — social feeds, news feeds, activity streams, and any aggregated content list uses this pattern. The structural composition (heterogeneous cards in a scrollable list) is product-independent.
**Final scope**: `product-specific` — too dependent on product content types
**Downstream target**: —

---

### 7. Filter Bar + Scrollable Content

**Description**: Persistent filter bar (Chip-Filter row) above a scrollable content area. Filter bar stays fixed while content scrolls beneath it.
**What was tried**: Queried `purpose: "filter bar"` — returned nothing despite Chip-Filter being tagged for `filter-bars` context.
**What happened**: The layout composition (sticky element + scrollable area) has no pattern. This is a layout question, not just a component question.
**Classification**: missing pattern
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — filter bars above content lists appear in e-commerce, search results, feeds, and any filterable content view.
**Final scope**: `structurally-universal` (provisional) — reframed as "chip layout patterns" — how Chip-Filter components arrange in a row
**Downstream target**: Spec 069

---

### 8. Multi-Badge Card Composition

**Description**: How multiple Badge-Label-Base instances with different semantic roles (status, category, content type) arrange within a card.
**What was tried**: Used Badge-Label-Base for multiple roles on feed cards.
**What happened**: No guidance on how to compose multiple badges within a single card — arrangement, spacing, visual hierarchy between badges.
**Classification**: missing pattern
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — any card with multiple metadata indicators (status + category, priority + type) needs this composition guidance.
**Final scope**: `product-specific` — badge arrangement driven by product content
**Downstream target**: —

---

### 9. Notification List

**Description**: Vertical list of content items with read/unread state, time-period grouping ("Today", "This Week"), and bulk actions (mark all as read). Tap-and-go interaction model.
**What was tried**: Queried `get_experience_pattern("settings-screen")` — structurally similar (vertical list of tappable items) but semantically different (actions vs. content consumption).
**What happened**: No pattern for content-consumption lists with read/unread state and temporal grouping.
**Classification**: missing pattern
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — notification lists, inbox views, and activity logs are universal. The structural pattern (grouped content items with consumption state) is product-independent.
**Final scope**: `product-specific` — close to #1. If content list item component exists, notification list is a product-specific arrangement of those items.
**Downstream target**: —

---

### 10. Platform-Adaptive Container

**Description**: Same content tree, different container treatment per platform/viewport. Example: notifications as full screen on mobile, dropdown/sheet on desktop.
**What was tried**: No query matched this concept.
**What happened**: No pattern addresses the True Native architecture question of how the same content composition adapts its container across platforms.
**Classification**: missing pattern
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — this is a core True Native architecture pattern. Every responsive/cross-platform screen faces this question.
**Final scope**: `product-specific` — highly contextual to product navigation and hierarchy
**Downstream target**: —

---

### 11. Dashboard Layout

**Description**: Section-based page with stat summary zone, content preview zone, and action areas. Information hierarchy: "What is → What will be → What was."
**What was tried**: Queried `context: "dashboards"` — returned only Container-Card-Base (development).
**What happened**: Dashboards are one of the most common screen types with no experience pattern or meaningful context tagging.
**Classification**: missing pattern
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — every product with a home screen has a dashboard. The zoned layout (stats + content + actions) is product-independent.
**Final scope**: `product-specific` — layout pattern is product-specific. "What is → What will be → What was" hierarchy preserved as design principle. Candidate for product primitive (Spec 081).
**Downstream target**: —

---

### 12. Stat Card

**Description**: Compact card with numeric value (Badge-Count-Base), label, and optional icon/trend indicator. Dashboard primitive.
**What was tried**: No specific query — composed from Badge-Count-Base + Container-Base + Icon-Base during exercise.
**What happened**: The composition works but there's no pattern documenting the arrangement, spacing, or visual hierarchy within a stat card.
**Classification**: missing pattern
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — stat cards appear on every dashboard, analytics screen, and summary view.
**Final scope**: `product-specific` — content and arrangement are product-driven
**Downstream target**: —

---

### 13. Empty State

**Description**: Explanation + CTA when a section or screen has no data. Communicates why it's empty and what the user can do about it.
**What was tried**: Queried `purpose: "empty state"` — returned nothing.
**What happened**: No component or pattern addresses empty states despite being universal.
**Classification**: missing pattern
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — every list, feed, dashboard section, and search result needs an empty state. Product-independent.
**Final scope**: `universal` ✅
**Downstream target**: Spec 069

---

### 14. Content Preview Section

**Description**: Limited view of a larger dataset with "View All" action. Shows N items from a collection with a link to the full list.
**What was tried**: No specific query — composed from Container-Base + content items + Button-CTA during exercise.
**What happened**: Common dashboard pattern with no experience pattern documentation.
**Classification**: missing pattern
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — dashboards, home screens, and summary views universally use preview sections.
**Final scope**: `product-specific` — what you preview and how is product-driven
**Downstream target**: —

---

### 15. Conditional Field Visibility

**Description**: Form fields appearing or disappearing based on other field values. Example: children count field appears only when hasChildren is toggled true.
**What was tried**: No query — identified during profile form exercise.
**What happened**: Common form interaction pattern with no experience pattern documentation. The pattern is about parent orchestration (the screen controls visibility), not component behavior.
**Classification**: missing pattern
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — conditional fields appear in registration forms, settings, checkout flows, and any form with dependent fields.
**Final scope**: `product-specific` — parent orchestration logic, not a component pattern
**Downstream target**: —

---

## Search/Discovery Gaps

### 16. Purpose Search Misses Core Use Cases

**Description**: `find_components` with `purpose` parameter doesn't match natural architect search terms: "badge status", "filter bar", "empty state", "user profile", "container grouping" all returned empty.
**What was tried**: Multiple `purpose` queries using terms an architect would naturally use.
**What happened**: The `purpose` field in component-meta.yaml files doesn't contain these phrases. Badge-Label-Base is for status labels but "badge status" doesn't match. Chip-Filter is for filter bars but "filter bar" doesn't match.
**Classification**: search/discovery gap
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — this is a system tooling issue. Enriching `purpose` text in component-meta.yaml with natural search terms improves discoverability for all agents.
**Final scope**: `universal` ✅
**Downstream target**: Lina (component-meta.yaml content enrichment)

---

### 17. Context and Purpose Don't Cross-Reference

**Description**: Chip-Filter is tagged with `context: "filter-bars"` but `purpose: "filter bar"` returns nothing. The two search dimensions don't cross-reference.
**What was tried**: `find_components({ purpose: "filter bar" })` — empty. `find_components({ context: "filter-bars" })` — found Chip-Filter.
**What happened**: An architect searching by purpose misses components that are tagged by context for the same concept. The search dimensions are siloed.
**Classification**: search/discovery gap
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — this is either a content fix (enrich purpose text to include context terms) or an indexer fix (cross-search purpose and context). Content fix is simpler.
**Final scope**: `universal` ✅
**Downstream target**: Lina (content fix: enrich purpose text) or future spec (indexer cross-search)

---

### 18. Dashboard Context Severely Underserved

**Description**: `context: "dashboards"` returns only Container-Card-Base (development readiness). Dashboards are one of the most common screen types.
**What was tried**: `find_components({ context: "dashboards" })` — 1 result, development readiness.
**What happened**: Components that naturally appear on dashboards (Container-Base, Badge-Count-Base, Icon-Base, Button-CTA, Avatar-Base) aren't tagged with `"dashboards"` context.
**Classification**: search/discovery gap
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — dashboards are universal. Tagging production components for dashboard context improves discoverability for all agents.
**Final scope**: `universal` ✅ — tag with `"dashboards"` context
**Downstream target**: Lina (component-meta.yaml context enrichment)

---

### 19. Pattern Names Documentation Error

**Description**: Design outline listed pattern names as `settings` and `onboarding`; actual names in the codebase are `settings-screen` and `account-onboarding`.
**What was tried**: `get_experience_pattern("settings")` — failed. `list_experience_patterns` revealed actual names.
**What happened**: Documentation and codebase were out of sync. Note: Task 2.3 renames the patterns to `settings` and `onboarding` to match the better naming convention (describe the *thing*, not the *container*).
**Classification**: search/discovery gap
**Provisional scope**: `general` (Leonardo)
**Recommended final scope**: `universal` — resolved by Task 2.3 (pattern rename). No further action needed after rename.
**Final scope**: `universal` ✅ — resolved by Task 2.3
**Downstream target**: Task 2.3 (already scoped)

---

## Classification Gate Summary

**Reviewed by Peter on 2026-03-22.** Each gap classified. Only `universal` and `structurally-universal` gaps proceed to downstream work.

| # | Gap | Final Scope | Downstream | Notes |
|---|-----|-------------|------------|-------|
| 1 | Content list item | `universal` | Lina (component spec) | |
| 2 | Linear progress bar | `universal` | Lina (component spec) | |
| 3 | Container-Card-Base readiness | `universal` (provisional) | Lina (readiness) | Needs semantic assessment before accelerating |
| 4 | Multi-section form | `structurally-universal` | Spec 069 | System provides general spacing/layout principles for grouped sections, not prescriptive form patterns |
| 5 | View/edit mode screen | `product-specific` | — | Principle (hierarchy consistency across modes) is universal and captured in design exercises. Component-use pattern is product-dependent |
| 6 | Mixed-content feed | `product-specific` | — | Too dependent on product content types |
| 7 | Filter bar + scrollable content | `structurally-universal` (provisional) | Spec 069 | Reframed as "chip layout patterns" — how Chip-Filter components arrange in a row |
| 8 | Multi-badge card composition | `product-specific` | — | Badge arrangement driven by product content |
| 9 | Notification list | `product-specific` | — | Close to #1 — if content list item exists, notification list is a product-specific arrangement of those items |
| 10 | Platform-adaptive container | `product-specific` | — | Highly contextual to product navigation and hierarchy |
| 11 | Dashboard layout | `product-specific` | — | "What is → What will be → What was" hierarchy preserved as design principle in exercises doc. Layout pattern is product-specific. Candidate for product primitive (Spec 081) |
| 12 | Stat card | `product-specific` | — | Content and arrangement are product-driven |
| 13 | Empty state | `universal` | Spec 069 | |
| 14 | Content preview section | `product-specific` | — | What you preview and how is product-driven |
| 15 | Conditional field visibility | `product-specific` | — | Parent orchestration logic, not a component pattern |
| 16 | Purpose search misses | `universal` | Lina (meta enrichment) | |
| 17 | Context/purpose cross-ref | `universal` | Lina (content fix) or future spec (indexer) | |
| 18 | Dashboard context underserved | `universal` | Lina (meta enrichment) | Tag production components with `"dashboards"` context |
| 19 | Pattern names error | `universal` | Task 2.3 (resolved) | |

**Summary**: 9 universal (including 2 provisional), 1 structurally-universal, 1 structurally-universal provisional, 8 product-specific.

**Product-specific items of note for Spec 081 (Product MCP)**:
- #11 (dashboard layout) flagged as product primitive candidate
- #5, #6, #9, #10 may inform Product MCP content types when that spec is scoped
