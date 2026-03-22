# Design Exercises — Spec 083

**Date**: 2026-03-22
**Participants**: Leonardo (architect) + Peter (product lead)
**Purpose**: Stress-test Application MCP tools against real design problems, seed experience pattern pipeline

---

## Screen Selection Rationale

### Screen 1: Working Class — User Profile (Type 1: Data Capture Priority)

**Product context**: Working Class (WrKing Class) is a civic engagement app — a federal legislation tracker that personalizes bill impact based on user demographics and interests. The profile screen captures demographic data (zip code, age, gender, income, employment, family status) and policy interests that drive the app's core personalization engine.

**Why this screen**: Type 1 profile — data capture priority. The user's profile data directly feeds the product's impact analysis algorithm. The profile isn't publicly visible; it exists to serve the product's personalization systems. This is a form-heavy screen with sectioned data groups, conditional fields (children count appears only if hasChildren=true), and a completeness indicator.

**Families exercised**: Avatar, Container, FormInput, Button, Chip (interests as selectable chips), Icon (section headers)
**Families covered**: 6 of 7 (Badge not naturally present — no notification/status indicators on this screen)

---

## Exercise 1: Working Class User Profile

### Design Intent

The profile screen serves two modes:
1. **View mode** (profile.tsx): Read-only display of captured data, organized in cards by category (Location, Demographics, Income, Work, Family, Interests). Includes a profile completeness indicator when data is missing.
2. **Edit mode** (profile/edit.tsx): Full edit form with sectioned inputs, conditional fields, and save/cancel actions.

The existing prototype uses a tab-level profile view with a push navigation to a separate edit screen. This is a common Type 1 pattern — the view mode is a summary dashboard of your data, the edit mode is a dedicated form.

### MCP Query Trace

| Query | Tool | Result |
|-------|------|--------|
| `purpose: "user profile"` | find_components | Empty — no screen-level context matching |
| `context: "settings-screens"` | find_components | Button-VerticalList-Item/Set, Container-Card-Base, Input-Checkbox-Base, Input-Radio-Base/Set, Nav-SegmentedChoice-Base |
| `context: "form-footers"` | find_components | Button-CTA |
| `purpose: "avatar"` | find_components | Avatar-Base ✅ |
| `purpose: "text input"` | find_components | Input-Text-Base ✅ |
| `purpose: "chip selection"` | find_components | Empty — no results for this phrasing |
| `category: "interaction", purpose: "chip"` | find_components | Chip-Base, Chip-Filter ✅, Chip-Input |
| `purpose: "progress indicator"` | find_components | Progress-Indicator-* (all development readiness) |
| `name: "simple-form"` | get_experience_pattern | Found — partially applicable (single-step, not multi-section) |
| `name: "settings"` | get_experience_pattern | Not found — pattern index issue |

### Component Selection

**Components selected (with reasoning):**

- **Avatar-Base** — profile identity display in both view and edit modes. Production-ready, supports initials fallback, tagged for `user-profiles` context. Clear fit.
- **Container-Base** — section grouping in both modes. Maintains information hierarchy consistency between view and edit. Used as fieldset wrapper with semantic role.
- **Input-Radio-Set / Input-Radio-Base** — mutually exclusive selections (age range, gender, income range) in edit mode. Guidance correctly disambiguated from Button-VerticalList-Set: "When the selection is form data (radio-style) rather than action-driven."
- **Input-Checkbox-Base** — boolean questions (married, has children, cares for elderly) in edit mode. Binary yes/no choices.
- **Input-Text-Base** — free text fields (zip code, job title, job industry) in edit mode. Zip code could use a specialized numeric variant if one existed.
- **Chip-Filter** — interest selection with toggle behavior in edit mode. Guidance correctly disambiguated from Chip-Input (dismissible user-entered values) and Chip-Base (no filter semantics). Max-3 selection constraint orchestrated by parent, not the component.
- **Button-CTA** — primary actions: Save Changes (edit mode footer), Edit Profile (view mode), Complete Profile (completeness nudge). Found via `form-footers` context.
- **Icon-Base** — section header icons (decorative, paired with section titles).

**Key design decisions:**

1. **Information hierarchy consistency**: Section ordering (Location → Demographics → Income → Work → Family → Interests) is a data architecture decision shared between view and edit modes. Components change; structure doesn't.
2. **Interest selection constraint**: Max 3 interests is a deliberate UX decision (forced prioritization in an overwhelming information landscape). The constraint and "2/3 selected" feedback are parent-orchestrated, not component-level.
3. **Progress bar for completeness**: "Show, don't tell" — visual progress indicator over text count. Not a stepper (wrong metaphor for non-sequential completion).
4. **Prototype as starting point, not spec**: Component selection driven by product intent, not prototype replication. Prototype decisions are possibilities, not optimal choices.

### Gaps Identified

1. **Missing component: Linear progress/completion bar.** The ProgressIndicator family has steppers and pagination dots (all `development` readiness), but no linear percentage-based bar for completion indicators. This is a distinct component need — not a stepper, not pagination dots.
2. **Missing pattern: Multi-section form.** `simple-form` models a single fieldset with inputs and a submit button. Real profile forms have multiple grouped sections (Location, Demographics, etc.) each acting as a fieldset. No pattern exists for this.
3. **Missing pattern: View/edit mode screen.** No pattern for a screen that displays data in read-only mode with an edit affordance that transitions to an editable form, maintaining information hierarchy across modes.
4. **Missing pattern: Conditional field visibility.** When `hasChildren === true`, children count appears. Common form pattern with no experience pattern documentation.
5. **MCP gap: No screen-level context matching.** `find_components` with `purpose: "user profile"` returned nothing. The MCP matches at component level but has no concept of screen-level composition queries.
6. **MCP gap: `settings` pattern not found.** `get_experience_pattern("settings")` returned error. Design outline states 3 patterns exist (`simple-form`, `settings`, `onboarding`) but `settings` doesn't resolve. Naming mismatch or index issue.

---

## Exercise 2: Working Class Legislation Feed

### Design Intent

A mixed-content, personalized feed showing bill updates and representative actions. Default ordering leans toward "updated things you've signaled interest in" over "completely new things" — clear signal over unclear signal. Each feed item carries more weight than a social media post; visualization matters more than text density. Impact scoring is "strong supporting context" that escalates in visual prominence with criticality.

Two content types: bill status changes and representative actions (votes, sponsorships). Filtering across multiple dimensions (federal/state, interest topic, legislative stage).

### MCP Query Trace

| Query | Tool | Result |
|-------|------|--------|
| `purpose: "badge status"` | find_components | Empty — no match despite Badge-Label-Base being for status labels |
| `context: "content-feeds"` | find_components | Chip-Filter, Container-Card-Base (development) |
| `purpose: "badge"` | find_components | Badge-Count-Base, Badge-Count-Notification, Badge-Label-Base ✅ |
| `purpose: "icon"` | find_components | Avatar-Base, Badge-Label-Base, Button-Icon ✅, Chip-*, Icon-Base ✅, Nav-* |
| `purpose: "filter bar"` | find_components | Empty — no match despite Chip-Filter tagged for `filter-bars` context |
| `list_experience_patterns` | list_experience_patterns | Revealed actual names: `simple-form`, `settings-screen`, `account-onboarding` — design outline listed incorrect names |

### Component Selection

- **Badge-Label-Base** — status/categorization labels on feed cards (e.g., legislative status, content type). Non-interactive, display-only. Guidance correctly distinguishes from Badge-Count (numeric) and Chip (interactive).
- **Badge-Count-Notification** — notification count in header (not on feed items). Semantic variant with live region announcements for assistive technology. Guidance distinguishes from Badge-Count-Base: use Notification variant when count needs urgent visual treatment.
- **Chip-Filter** — filter bar for narrowing feed content. Multi-select filtering with toggle behavior. Same component as Screen 1's interest selection but in a different role (filtering content vs. capturing preferences).
- **Container-Base** — feed item card wrapper. Each item is a visually grouped card.
- **Container-Card-Base** — better fit for feed items (elevated, interactive), but `development` readiness. Readiness caveat.
- **Avatar-Base** — representative identity on action-type feed items (Working Class-specific usage, but Avatar on feed items is universal).
- **Icon-Base** — category/type indicators within feed items.
- **Button-Icon** — card-level actions (bookmark, share, expand). Found via `card-actions` context.

### Key Design Decisions

1. **Multiple badges on one card**: A feed card may have multiple Badge-Label-Base instances serving different semantic roles (status, category, content type). The composition pattern — how badges arrange within a card — is a universal layout question. The specific badge content is product-specific.
2. **Heterogeneous feed**: Different content types share the same container pattern but have different internal compositions. The parent orchestrates which card layout to render based on content type.
3. **Filter bar position**: Chip-Filter components sit above the scrollable feed as a persistent element. This is a layout composition question (sticky filter bar + scrollable content area).
4. **Visual hierarchy within cards**: How card elements communicate relative importance — what's primary, what's supporting context, what escalates with criticality — is a universal design exploration. The specific data driving that hierarchy is product-specific.

### Gaps Identified

1. **Missing pattern: Mixed-content feed.** Heterogeneous card types in a scrollable list with shared container patterns but different internal compositions. Universal. `scope: general`
2. **Missing pattern: Filter bar + scrollable content.** Persistent filter bar (Chip-Filter row) above a scrollable content area. Universal layout composition. `scope: general`
3. **Missing pattern: Multi-badge card composition.** How multiple Badge-Label-Base instances with different semantic roles arrange within a card. Universal. `scope: general`
4. **Container-Card-Base readiness gap.** Feed items would benefit from card-specific styling (elevation, interactive behavior), but Container-Card-Base is `development`. Universal need. `scope: general`
5. **MCP gap: `purpose: "badge status"` returned nothing.** Badge-Label-Base is explicitly for status labels but wasn't found with this query. The purpose search doesn't match on "status" despite it being a core use case. `scope: general`
6. **MCP gap: `purpose: "filter bar"` returned nothing.** Chip-Filter is tagged for `filter-bars` context but wasn't found via purpose search. Context and purpose search don't cross-reference. `scope: general`
7. **Documentation error: Pattern names in design outline.** Design outline listed `settings` and `onboarding`; actual names are `settings-screen` and `account-onboarding`. Not an index issue — a documentation accuracy issue. `scope: general`

### Provisional Classification

- Mixed-content feed pattern: `general`
- Filter bar + scrollable content: `general`
- Multi-badge card composition: `general`
- Data-driven visual hierarchy within cards: `uncertain` (the structural exploration is universal; specific implementations may be product-specific)

---

## Exercise 3: Working Class Notifications

### Design Intent

Notification list showing civic alerts: bill status changes, representative actions, bill language changes, and proactive high-impact surfacing for bills outside the user's selected interests. Tap-and-go interaction — one action per notification that takes you deeper. Read/unread state and timestamp metadata. Full screen on mobile, dropdown/sheet on desktop.

### MCP Query Trace

| Query | Tool | Result |
|-------|------|--------|
| `name: "settings-screen"` | get_experience_pattern | Found — structurally similar (vertical list of tappable items) but semantically different (actions vs. content) |
| `context: "list-items"` | find_components | Badge-Count-Base, Badge-Label-Base, Icon-Base |

### Component Selection

- **Container-Base** — notification list wrapper and time-period group containers ("Today", "This Week").
- **Icon-Base** — notification type indicator (bill update, vote, language change). Communicates what kind of event before reading text.
- **Badge-Count-Notification** — count on the bell icon / nav tab entry point. Semantic variant with live region announcements. Not used on individual notifications.
- **Badge-Label-Base** — potential "New" indicator on unread notifications, or category tag. But read/unread may be better served by simpler visual treatment (bold text, background shift) than a badge.
- **Button-Icon** — header actions (mark all as read, notification settings).

### Key Design Decisions

1. **Tap-and-go interaction model**: One action per notification — tap goes deeper. No inline actions, no swipe gestures at this level. Keeps the interaction simple and consistent.
2. **Read/unread as primary state**: The most important visual distinction on each notification. Existing list components (Button-VerticalList-Item) don't have read/unread states — their states (rest, selected, checked) are action-oriented, not content-consumption-oriented.
3. **Platform-adaptive container**: Same notification content, different container treatment per platform (full screen mobile, dropdown desktop). Content composition is platform-independent; container is platform-specific. True Native architecture question.
4. **Content list item as semantic container**: Peter noted this could be a semantic container component (interactive) rather than a new family. Architecturally cleaner — extends Container family with content-list-item semantics (leading visual, primary/secondary text, metadata, read/unread state).

### Gaps Identified

1. **Missing component: Content list item (semantic container variant).** An interactive container with leading visual slot, primary text, secondary text, metadata, and content-consumption state (read/unread). Distinct from Button-VerticalList-Item (action semantics). Could be a semantic variant of Container-Base or Container-Card-Base. Universal need — applies to notifications, email lists, message lists, activity feeds, search results. `scope: general`
2. **Missing pattern: Notification list.** Vertical list of content items with read/unread state, time-period grouping, and bulk actions (mark all as read). Universal. `scope: general`
3. **No content-consumption states in existing components.** Button-VerticalList-Item's states are action-oriented (rest, selected, checked). Read/unread is a content-consumption state that no current component models. `scope: general`
4. **Missing pattern: Platform-adaptive container.** Same content tree, different container treatment per platform/viewport. Universal True Native pattern. `scope: general`

### Provisional Classification

- Content list item component: `general`
- Notification list pattern: `general`
- Platform-adaptive container pattern: `general`

---

## Exercise 4: Working Class Dashboard / Home

### Design Intent

The dashboard is the user's first screen after onboarding. It provides a personalized overview of their civic landscape. Onboarding is a separate interstitial flow, not a state of the dashboard.

Information hierarchy principle: "What is → What will be → What was." Present state first (current alignment, active bills), upcoming changes second (scheduled votes, committee hearings), historical context third (recent updates). Notifications handle time-critical urgency; the dashboard handles persistent awareness.

Structural zones:
1. Current state summary — stat cards showing where things stand now
2. The feed — personalized legislation stream (designed in Exercise 2)
3. Potentially: forward-looking events (the "what will be" zone — not in prototype, but identified as a need)

### MCP Query Trace

| Query | Tool | Result |
|-------|------|--------|
| `context: "dashboards"` | find_components | Container-Card-Base only (development readiness) |
| `purpose: "empty state"` | find_components | Empty — no results |
| `purpose: "container grouping"` | find_components | Empty — no results |
| Assembly validation (Container-Base main → sections → stat cards) | validate_assembly | Valid structure; caught missing accessibilityLabel on main container (WCAG 2.4.2) |

### Component Selection

- **Container-Base** — primary structural component. Page wrapper (`semantic: main`), section wrappers for each zone, individual stat card containers. Dashboards are fundamentally about grouping and arranging information.
- **Container-Card-Base** — better fit for stat cards and content previews (elevated, interactive), but `development` readiness. Third exercise in a row where this is the right choice but unavailable.
- **Badge-Count-Base** — numeric stat values (active bills, high impact count). Informational counts without notification urgency.
- **Badge-Label-Base** — status/category labels on content preview cards within the dashboard.
- **Icon-Base** — stat card icons, section header icons, category indicators.
- **Button-CTA** — primary actions ("View All Bills", "Update Profile" in empty state).
- **Button-Icon** — secondary header actions (notification bell, settings).
- **Avatar-Base** — representative identity in alignment/representative section.

### Key Design Decisions

1. **"What is → What will be → What was" hierarchy**: Universal dashboard organizing principle. Present state first, upcoming changes second, historical context third. Not Working Class-specific — applies to any dashboard.
2. **Onboarding is not a dashboard state**: Separate interstitial flow. The dashboard assumes a completed profile.
3. **The feed IS the dashboard content**: The personalized legislation stream (Exercise 2) is the dashboard's primary content area, not a separate screen. Stat cards provide at-a-glance summary above the feed.
4. **Critical items surface in both notifications and dashboard**: High-criticality events appear in notifications (urgency) AND are prioritized in the dashboard (persistent awareness). Dual-surfacing for critical items.

### Gaps Identified

1. **Missing pattern: Dashboard layout.** Section-based page with stat summary, content previews, and action areas. Most common screen type with no experience pattern. `scope: general`
2. **Missing pattern: Stat card.** Compact card with numeric value (Badge-Count-Base), label, and optional icon/trend indicator. Universal dashboard primitive. `scope: general`
3. **Missing pattern: Empty state.** Explanation + CTA when a section or screen has no data. Universal. `scope: general`
4. **Missing pattern: Content preview section.** Limited view of a larger dataset with "View All" action. Universal. `scope: general`
5. **Container-Card-Base readiness**: Third exercise where this component is the right choice but `development`. Most impactful readiness gap across all exercises. `scope: general`
6. **MCP gap: `context: "dashboards"` severely underserved.** Only one component tagged (Container-Card-Base, development). Dashboards are one of the most common screen types. `scope: general`
7. **MCP gap: `purpose: "empty state"` returned nothing.** No component or pattern addresses empty states despite being universal. `scope: general`

### Provisional Classification

- Dashboard layout pattern: `general`
- Stat card pattern: `general`
- Empty state pattern: `general`
- Content preview section pattern: `general`
- "What is → What will be → What was" hierarchy principle: `general`

---

## Cross-Exercise Summary

### Family Coverage

| Family | Ex 1 (Profile) | Ex 2 (Feed) | Ex 3 (Notifications) | Ex 4 (Dashboard) | Total |
|--------|:-:|:-:|:-:|:-:|:-:|
| Avatar | ✅ | ✅ | — | ✅ | 3/4 |
| Badge | — | ✅ | ✅ | ✅ | 3/4 |
| Button | ✅ | ✅ | ✅ | ✅ | 4/4 |
| Chip | ✅ | ✅ | — | — | 2/4 |
| Container | ✅ | ✅ | ✅ | ✅ | 4/4 |
| FormInput | ✅ | — | — | — | 1/4 |
| Icon | ✅ | ✅ | ✅ | ✅ | 4/4 |

All 7 production families exercised. Button, Container, and Icon appeared in all 4 exercises — they're the structural backbone of every screen.

### Component Gaps (Universal)

| Gap | Exercises | Priority |
|-----|-----------|----------|
| **Content list item** (semantic container variant) — interactive container with leading visual, primary/secondary text, metadata, content-consumption state | Ex 3 | High — blocks notification list, email lists, activity feeds, search results |
| **Linear progress/completion bar** — percentage-based visual indicator, not a stepper | Ex 1 | Medium — profile completeness, onboarding progress, any completion tracking |
| **Container-Card-Base readiness** — needed in 3 of 4 exercises, still `development` | Ex 2, 3, 4 | High — most impactful readiness gap |

### Pattern Gaps (Universal)

| Gap | Exercises | Downstream |
|-----|-----------|------------|
| **Multi-section form** — grouped fieldsets with consistent hierarchy | Ex 1 | Spec 069 |
| **View/edit mode screen** — same data, different interaction, consistent hierarchy | Ex 1 | Spec 069 |
| **Mixed-content feed** — heterogeneous card types in scrollable list | Ex 2 | Spec 069 |
| **Filter bar + scrollable content** — persistent filter above content area | Ex 2 | Spec 069 |
| **Multi-badge card composition** — multiple badges with different semantic roles | Ex 2 | Spec 069 |
| **Notification list** — content items with read/unread, time grouping, bulk actions | Ex 3 | Spec 069 |
| **Platform-adaptive container** — same content, different container per platform | Ex 3 | Spec 069 |
| **Dashboard layout** — section-based page with stats, previews, actions | Ex 4 | Spec 069 |
| **Stat card** — numeric value + label + optional icon/trend | Ex 4 | Spec 069 |
| **Empty state** — explanation + CTA when no data | Ex 4 | Spec 069 |
| **Content preview section** — limited dataset view with "View All" | Ex 4 | Spec 069 |
| **Conditional field visibility** — fields appearing based on other field values | Ex 1 | Spec 069 |

### MCP Tool Gaps

| Gap | Exercises |
|-----|-----------|
| `purpose` search doesn't match core use cases: "badge status", "filter bar", "empty state", "user profile", "container grouping" all returned empty | Ex 1, 2, 4 |
| `context` and `purpose` don't cross-reference — Chip-Filter tagged for `filter-bars` context but not findable via purpose search | Ex 2 |
| `context: "dashboards"` severely underserved — only 1 component (development) | Ex 4 |
| Pattern names in design outline incorrect (`settings`/`onboarding` vs actual `settings-screen`/`account-onboarding`) | Ex 2 |

### Design Principles Surfaced

1. **Information hierarchy consistency across modes** — section ordering is a data architecture decision shared between view and edit modes. Components change; structure doesn't. (Ex 1)
2. **"What is → What will be → What was"** — universal dashboard information hierarchy. Present state first, upcoming second, historical third. (Ex 4)
3. **Selection constraints are parent-orchestrated** — max selections, conditional visibility, and cross-field validation live in the orchestrating screen, not in individual components. (Ex 1)
4. **"Show, don't tell"** — visual indicators (progress bars, badges) over text descriptions for communicating state. Starting guideline, not a rule. (Ex 1)
5. **Prototype as starting point, not spec** — component selection driven by product intent, not prototype replication. (Ex 1)
6. **Universal vs. product-specific separation** — structural/compositional patterns are universal; content and meaning are product-specific. (Ex 2)
