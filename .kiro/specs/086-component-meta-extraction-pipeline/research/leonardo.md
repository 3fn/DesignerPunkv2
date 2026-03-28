# Component Discoverability Research: Leonardo

**Agent**: Leonardo — Product Architect
**Spec**: 086
**Date**: 2026-03-27
**Instructions**: Answer based on your experience discovering and selecting components for product screens. Do not read other agents' research docs before completing yours.

---

## Component Selection Tasks

For each task, describe how you would search for and select components. Include the exact MCP queries you'd make, what you'd expect to find, and what information you'd need to make a decision.

### Task 1: Build a notification screen
A product needs a notification center — a list of notifications with read/unread state, grouped by time period ("Today", "This Week"), with a "mark all as read" action.

**How would you search for components for this screen?**

I'd start by decomposing the screen into functional elements, then query for each:

1. `find_components({ context: "notification-list" })` — hoping for a direct context match
2. `get_experience_pattern("notification-list")` — I know this pattern exists
3. `find_components({ purpose: "unread" })` or `find_components({ purpose: "count" })` — for the unread badge
4. `find_components({ purpose: "group" })` or `find_components({ context: "settings-screens" })` — for grouped sections
5. `find_components({ purpose: "action" })` — for "mark all as read"
6. `list_layout_templates` — to check if a full-width or single-region template fits

**What results would you expect?**

- Badge-Count-Notification for unread indicators
- Container-Card-Base for notification item cards (interactive, with onPress)
- Button-Icon for the "mark all as read" action (or Button-CTA if it's prominent)
- The notification-list experience pattern should give me a component assembly
- I'd expect gaps: no list item component, no section header/grouping component, no timestamp/relative-time display component

**What information would you need to decide which components to use?**

- Whether Badge-Count-Notification supports a "dot only" mode (unread without a count) vs. always showing a number
- Whether Container-Card-Base can handle a read/unread visual distinction (background variant? border variant?) or if I need a different approach
- What the notification-list pattern recommends for grouping — does it suggest Container-Base as a section wrapper?
- Whether any component handles relative timestamps ("2 hours ago") or if that's just text content

---

### Task 2: Add a progress indicator to an onboarding flow
A 5-step onboarding flow needs a visual indicator showing the user's current position and overall progress.

**How would you search for components for this?**

1. `get_experience_pattern("onboarding")` — first stop, this pattern exists and should prescribe the progress component
2. `find_components({ purpose: "progress" })` — broad search for progress family
3. `get_prop_guidance("Progress Indicators")` — family-level guidance on which progress component fits which scenario

**What results would you expect?**

- The onboarding pattern should recommend Progress-Stepper-Base or Progress-Pagination-Base
- `find_components` should return the full Progress family: Stepper-Base, Stepper-Detailed, Pagination-Base, plus the primitives (Node, Connector, Label)
- Prop guidance should have selection rules like "5+ steps → use Stepper, 2-3 steps → use Pagination"

**What information would you need to decide which components to use?**

- The key decision is Stepper vs. Pagination. For a 5-step onboarding, I'd lean Stepper (shows step names, gives context) over Pagination (just dots, no labels). But I need the guidance to confirm whether 5 steps is in the "use Stepper" range.
- Whether Stepper-Base or Stepper-Detailed is appropriate — does the onboarding need step descriptions, or just step names?
- Whether the progress component supports a "compact" mode for mobile where step labels might not fit horizontally
- How the component handles the transition between steps — does it animate, or is it a state swap?

---

### Task 3: Create a dashboard with stat cards
A product home screen needs a dashboard with summary statistics (counts, percentages), content previews, and quick actions.

**How would you search for components for this screen?**

1. `get_experience_pattern("dashboard")` — direct pattern match
2. `find_components({ context: "dashboards" })` — context-based search
3. `find_components({ purpose: "card" })` — for stat cards
4. `find_components({ purpose: "action" })` — for quick actions
5. `list_layout_templates` — dashboard likely needs a multi-zone layout
6. `get_layout_template("multi-zone-page")` — if it exists

**What results would you expect?**

- Dashboard pattern should give me a component assembly with stat cards, content previews, and action areas
- Container-Card-Base for stat cards (with Badge-Count-Base for counts?)
- Button-CTA or Button-Icon for quick actions
- Multi-zone layout template for the dashboard grid
- Gaps: no dedicated stat/metric display component, no chart/visualization component, no content preview card variant

**What information would you need to decide which components to use?**

- Whether Container-Card-Base with interactive mode is the right wrapper for stat cards that navigate to detail views
- How to display a stat value prominently inside a card — is that just typography tokens, or is there a component for metric display?
- Whether the dashboard pattern recommends a specific layout template or leaves it to the architect
- How quick actions should be presented — a row of Button-Icons? A Button-VerticalList-Set?

---

### Task 4: Add filtering to a content feed
A scrollable content feed needs a filter bar at the top with selectable filter options.

**How would you search for components for this?**

1. `find_components({ purpose: "filter" })` — direct purpose search
2. `find_components({ context: "form-footers" })` or `find_components({ context: "settings-screens" })` — contexts where selection controls appear
3. `get_prop_guidance("Chips")` — Chip-Filter is the obvious candidate
4. `get_component_full("Chip-Filter")` — detailed look at the filter chip

**What results would you expect?**

- Chip-Filter as the primary result — it's literally named for this use case
- Possibly Nav-SegmentedChoice-Base if the filters are mutually exclusive
- The Chips family guidance should clarify when to use Chip-Filter vs. Chip-Input vs. Chip-Base

**What information would you need to decide which components to use?**

- Whether filters are multi-select (Chip-Filter) or single-select (SegmentedChoice)
- Whether Chip-Filter supports a "filter bar" layout pattern (horizontal scroll, wrapping) or if I need to compose that myself
- Whether there's a "clear all filters" pattern — does the chip family handle that, or do I add a Button-Icon?
- How the filter state connects to the content feed — that's product logic, not component selection, but the component's state model matters

---

### Task 5: Build a settings screen with grouped sections
A settings screen with multiple sections (Account, Notifications, Privacy, Appearance), each containing related options.

**How would you search for components for this screen?**

1. `get_experience_pattern("settings")` — direct pattern match, I know this exists
2. `find_components({ context: "settings-screens" })` — context search
3. `find_components({ purpose: "group" })` or `find_components({ purpose: "section" })` — for section containers
4. `get_prop_guidance("Containers")` — for section grouping approach

**What results would you expect?**

- Settings pattern should prescribe the full assembly: section containers, option rows, toggles, navigation items
- Container-Card-Base or Container-Base for section grouping
- Button-VerticalList-Set / Button-VerticalList-Item for option rows that navigate
- Input-Checkbox-Base for toggle options
- Gaps: no toggle/switch component, no "section header" component, no "option row with description" component

**What information would you need to decide which components to use?**

- Whether Container-Card-Base is the right section wrapper (cards for each settings group) or if Container-Base with a border is more appropriate
- Whether Button-VerticalList-Item supports a "disclosure indicator" (chevron) for navigation options
- How to handle different option types in the same section: some are toggles, some navigate, some show current value — do I mix component types within a Container?
- Whether the settings pattern addresses the grouped section layout or just individual option components

---

## General Questions

1. **When you're looking for a component, do you think in families first (e.g., "I need a Badge") or use cases first (e.g., "I need something to show unread count")?**

Use cases first, almost always. When I'm specifying a screen, I'm thinking "I need something to show unread count" — not "I need a Badge." The family name is the answer, not the question. The exception is when I've already used a component and know its name — then I go direct (`get_component_full("Badge-Count-Notification")`). But for discovery, it's always use-case-first.

This means `find_components({ purpose: "unread" })` is my natural query, not `find_components({ category: "Badge" })`. The MCP's purpose search is more aligned with how I think than the category/family filters.

2. **Is the `purpose` field in component metadata useful as currently written? What would make it more useful?**

It's useful but often too implementation-focused. For example, Container-Card-Base's purpose is "Display content in a card with elevation, border radius, and background styling for visually distinct content grouping." That describes what the component *does* structurally, not what it's *for* in a product. I'd never search for "elevation" or "border radius" — I'd search for "group related content" or "interactive content block" or "notification item."

What would make it more useful: purpose should answer "what product problem does this solve?" not "what visual properties does it have?" A purpose like "Group related content into a visually distinct, optionally interactive block — used for cards, list items, and content previews" would be more discoverable.

3. **Are `contexts` tags (e.g., "navigation-tabs", "dashboards") helpful for narrowing results? Do you use them?**

I use them, but inconsistently. When I remember they exist and guess the right tag name, they're great — `find_components({ context: "settings-screens" })` is a powerful query. But I often don't know what context tags are available, so I fall back to purpose search. The tags are only useful if I can predict them, and there's no way to browse available contexts without querying and seeing what comes back.

What would help: either a way to list all available context tags, or more standardized context naming so I can predict them.

4. **When you find a component, what information do you need to decide if it's the right one? What's missing?**

What I need and currently get:
- Purpose and whenToUse/whenNotToUse (from annotations) — this is the most valuable
- Alternatives (what to use instead if this isn't right)
- Props and their constraints (what can I configure?)

What I need and is sometimes missing or hard to find:
- **Visual examples or descriptions** — I can't see what the component looks like from metadata alone. The purpose says "card with elevation" but I don't know if it looks like what I'm imagining. The demos help, but they're not accessible through the MCP.
- **Composition examples** — what does this component look like when assembled with others? The experience patterns help, but individual component metadata doesn't show "here's how Badge-Count-Notification looks inside a Nav-TabBar-Base tab."
- **State coverage** — what states does this component handle? I can infer from props (interactive, disabled, etc.) but a clear state list would be faster.

5. **When search returns nothing or unhelpful results, what's your fallback strategy?**

My fallback chain:
1. Broaden the purpose search (try synonyms: "filter" → "select" → "choose")
2. Try the catalog (`get_component_catalog`) and scan manually — it's only 30 components, so this is feasible
3. Check experience patterns (`list_experience_patterns`) — the pattern might reference a component I didn't think to search for
4. Check family guidance (`get_prop_guidance`) for the family I think is closest
5. If nothing fits, document it as a gap — "no component exists for X" — and either propose a workaround using existing components or escalate to Lina for a new component

The catalog scan (step 2) is my most common fallback, which tells you something about the search — when purpose search fails, I go to browsing rather than trying more queries.

6. **Is there anything about how you currently discover components that frustrates you or feels inefficient?**

Three things:

- **The gap between "I know what I need" and "the MCP knows what it has" is a vocabulary mismatch.** I think in product terms (notification item, stat card, option row). The MCP thinks in component terms (Container-Card-Base, Button-VerticalList-Item). The purpose field bridges this sometimes, but not always. I often have to translate my product vocabulary into component vocabulary before I can search effectively.

- **No way to search by visual pattern.** "I need a horizontal row of selectable pills" — there's no query for that. I have to know that "pills" means "chips" in DesignerPunk vocabulary, then search for chips. This is a knowledge prerequisite that the MCP doesn't help with.

- **Experience patterns are the most useful discovery tool, but they're coarse-grained.** The "settings" pattern tells me what components to use for a settings screen, but if I need a settings-like pattern for something that isn't settings (e.g., a profile editing screen), I have to know to look at the settings pattern and adapt it. There's no "screens with grouped option rows" pattern — just "settings."

7. **What does the Application MCP today tell you that's different from what you already know about using components and how to design with them? Or just how to design in general?**

The MCP tells me three things I wouldn't reliably know otherwise:

- **What components actually exist in DesignerPunk right now.** My general design knowledge tells me "a notification screen needs badges, cards, and list items." The MCP tells me DesignerPunk has Badge-Count-Notification but doesn't have a list item component. That gap identification is critical — without it, I'd spec components that don't exist.

- **The specific prop constraints and composition rules.** I know cards should have padding and background options. The MCP tells me Container-Card-Base has exactly 4 padding values, 3 backgrounds, and composes Container-Base internally. That specificity is what I need for a screen spec.

- **The behavioral contracts.** I know interactive cards need hover/press/focus states. The MCP tells me exactly which contracts Container-Card-Base implements, what WCAG criteria they satisfy, and what the platform-specific behaviors are. This is more precise than my general accessibility knowledge.

What it doesn't tell me that I already know: how to structure a screen, what makes a good user experience, when to use a card vs. a list item, how to think about information hierarchy. The MCP is a component catalog, not a design advisor. That's appropriate — it should stay in its lane.

8. **What's an example of something you understood before accessing the Application MCP that changed after accessing it? What's an example of something that stayed the same?**

**Changed:** I assumed the Progress family would have a simple linear progress bar (like a loading indicator). After querying the MCP, I learned the Progress family is entirely about step-based progress (Stepper, Pagination, Node/Connector/Label primitives) — there's no continuous progress bar. That changed how I'd spec a loading state (I'd need to flag it as a gap rather than assume a component exists).

**Stayed the same:** My understanding of when to use a segmented controller vs. tabs. Before the MCP, I knew segmented controllers are for switching views within a screen, tabs are for top-level navigation. The MCP confirmed this — Nav-SegmentedChoice-Base and Nav-TabBar-Base have distinct purposes that match my prior understanding. The MCP added specificity (exact props, contracts, platform behaviors) but didn't change the conceptual model.