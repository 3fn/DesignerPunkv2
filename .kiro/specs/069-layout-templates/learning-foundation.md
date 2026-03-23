# Learning Foundation: Responsive Layout

**Date**: 2026-03-23
**Spec**: 069 - Layout Templates
**Status**: In Progress
**Purpose**: Capture foundational layout knowledge from Peter interview, design system study, and token documentation review

---

## Peter Interview

**Conducted**: 2026-03-23
**Participants**: Leonardo (interviewer), Peter (interviewee)
**Note**: These insights represent Peter's current thinking as a baseline. They are starting principles, not rigid rules — nuance and context will refine them as we apply these models to real product work.

### Region Decisions

**Core principle: information hierarchy drives region count.**

- The first question is: what's the information hierarchy of what needs to live on the page? Is there a singular intent, or a primary objective alongside supplemental content?
- Minimize regions, but not at the cost of clarity. Clarity is the singular most important goal of layout.
- A region earns its place when its content genuinely can't live in an existing region without degrading the user's ability to understand or navigate the page.

**Sidebars serve two distinct intents:**

1. **Supplemental content** — recurring contextual information that lives alongside primary content (e.g., community info, related links). One-off contextual info belongs in the primary container; recurring info justifies a sidebar.
2. **Persistent access** — content that needs to stay visible during scrolling (e.g., a purchase CTA moved to the sidebar so it's always findable). This is a functional need, not a hierarchy decision.

**Infinite content makes sidebars more necessary, not less.** In infinite-scroll contexts, the user can never reach the bottom of the primary container to consume secondary content. The sidebar is the only way that content stays accessible. The complication isn't whether the sidebar should exist — it's what happens to it at narrow viewports where both can't coexist. That's where responsive crosses into reactive.

**Three+ regions are rare but justified.** Example: Reddit community pages with left nav, center feed, and right sidebar — three independently scrolling regions, each with a distinct purpose. Justified because the product complexity demands simultaneous access to three independent information streams.

**Regions are functional concepts first, spatial concepts second.** Think of regions as members of a "page ecosystem" — each with its own purpose, scroll behavior, and content lifecycle. The spatial arrangement (grid columns) follows from the functional need, not the other way around.

**Name regions by function, not position.** Regions should be named by their purpose (e.g., "filters," "content-feed," "community-context") not by their spatial position ("left," "center," "right"). Position changes across breakpoints; function doesn't. The steering doc vocabulary should enforce this, and the specification format should require functional region names.

### Stacking & Adaptation

**Vertical stacking is only one adaptation strategy.** When regions can't sit side by side at narrow viewports, the options include:

1. **Stack vertically** — regions arrange top-to-bottom in priority order (common case)
2. **Surface switch** — regions share the same space, user navigates between them via segmented controller, tabs, or toggle (e.g., login/create-account forms switching via button; sidebar content accessible via segmented controller)
3. **Collapse into primary** — sidebar content absorbed into the primary flow

The choice depends on the content relationship:
- Clear hierarchy → stack (primary on top)
- Equal priority → surface switch (neither subordinate)
- Supplemental but not independently valuable → collapse into primary

**Surface switching is reactive, not responsive.** The interaction model changes — a new control appears, the user's navigation pattern is different. This is a product decision, not a layout decision.

**When stacking vertically, workflow direction determines order:**
- Content that **controls or influences** primary (search, filters) → stacks above primary, often as a minified version or entry point
- Content that **supplements** primary (author bio, related links) → stacks below primary
- The user needs to interact with control content *before* the primary content is useful; supplemental content is useful *after* consuming primary content

**Stacking order is not a fixed property of a region** — it's a property of the region's relationship to primary content. Templates provide default stacking order; screen specs can override based on what's actually in the region.

### Sidebar Behavior

- Sidebars almost never truly disappear — they change form (stack, minify, surface-switch)
- The rare case where content disappears entirely is platform/device-driven (functionality that doesn't exist on that platform), which is reactive, not responsive
- Region visibility is out of scope for templates — it's a reactive annotation in the screen spec

### Column Allocation

**Content, priority, and experience driven — not purely proportional.**

- Ideally proportions stay consistent across breakpoints, but there's tension at the 8→12 column transition:
  - 4→8 (xs→sm): similar feel, modest expansion
  - 8→12 (sm→md): significant jump — proportions often need re-evaluation
  - 12→16 (md→lg): similar feel, proportional scaling works
- The 8→12 transition is the major pressure point where column allocation gets re-evaluated rather than scaled.

**Line-length constraint: 50-75 characters per line, 66 is the sweet spot.** This is a concrete, measurable criterion for whether a column allocation is working for body-copy regions.

**Line-length management happens at multiple levels:**
1. Region level — cap column span or apply max-width (bluntest tool)
2. Inner container level — region expands, text content within has its own max-width
3. Typography level — font size/line-height scales with viewport (CSS clamp), wider viewports get larger type
4. Spacing level — extra columns as gutters, increased padding within containers

**Templates define region-to-grid relationships. Line-length management within regions is implementation detail** for the screen spec or platform agent.

### Content Constraints

**Surfaced during Lina's follow-up with Peter.**

"Content constraints" is the vocabulary term for when a region spans wide but readable content within it is narrower. Example: a primary region spans 9 of 12 columns, but body copy within it is constrained to ~66 characters per line via an inner max-width.

This is distinct from the region's column allocation (a template concern) — it's about how content *within* the region handles the available width (a screen spec or implementation concern).

**Steering doc action:** Add "content constraint" to the specification vocabulary (Section 3). Leonardo uses this term in screen specs; platform agents implement it via inner containers, responsive typography, or padding. Whether it also becomes an optional schema field (a hint on regions) is deferred — screen-spec-level for now.

### Design Direction

**Mobile-first as a thinking tool, even for desktop-centric products.**

Two reasons:
1. Easier to scale content and interaction up than down
2. Narrow viewport forces hierarchy and priority decisions — you can't defer by just putting things side by side

Mobile-first doesn't mean fully designing every mobile screen. It means doing *enough* mobile thinking to establish priorities and hierarchy, even if detailed design focuses on the primary platform.

**Target breakpoint is independent of design direction.** The optimal experience can be prioritized for any breakpoint, driven by business logic and user context. Example: Working Class would likely target md because of business logic. Design mobile-first (start at xs, expand outward), but the target breakpoint gets the most design refinement.

**Authoring implication:** Start template authoring at xs. The narrow layout defines content hierarchy. Wider breakpoints add regions and redistribute columns — they don't redefine priority.

### Reusability & Template Composition

**Templates compose upward from primitives, not downward from complex layouts.**

Layered approach:
1. **Primitive templates** — basic structural shells (header + open canvas, header + canvas + tab bar). Reusable across almost any page.
2. **Specialized templates** — built on primitives by adding structural elements (primitive + back/next = flow page template). Reusable within a category of pages.
3. **Page-specific layouts** — when the page is unique enough that no template applies. But distinguish structural uniqueness (different regions) from content uniqueness (same structure, different data).

**Inheritance is the natural mental model.** Specialized templates extend primitives. Flow-page template inherits base-canvas and adds navigation. This is how Peter thinks about template relationships.

**Schema recommendation: defer inheritance.** Document the inheritance mental model in the steering doc, but keep the schema flat and self-contained for now. When product work reveals duplication across templates, that's the signal to add `extends` to the schema. The migration would be additive, not breaking.

**Reuse recognition:** A layout is reusable when multiple pages share the same structural shell — same regions, same general column behavior, same adaptation strategy. Content differences don't make layouts different; structural differences do.

### Content Templates vs Page Templates

**Surfaced during Lina's follow-up questions with Peter, clarified in Leonardo–Peter discussion.**

Peter's interview revealed two levels of layout templating:

1. **Content layout templates** — how content regions arrange within the content area, below the page chrome. Regions on a grid, breakpoint behavior, stacking. This is the current spec scope.
2. **Page layout templates** — the full page structure: header, content area, tab bar, navigation chrome, and how all of those respond to the viewport. The content area's available space depends on the page shell.

These are separate but coupled decisions. The page shell is often shared across many screens (every screen in a tab-bar app has the same tab bar), while the content layout varies per screen. But the content area's available space depends on the shell — a persistent sidebar navigation reduces horizontal space for content regions.

**Current scope: content layout templates only.** The schema defines regions within a content area. Page-level structural elements (header, tab bar) are out of scope for this spec.

**Two candidate approaches for page templates (future):**

1. **Composition** — page template defines the shell and references a content template for the content area. Two schemas that compose. Example: a page template specifies header type, tab bar position, and points to `sidebar-page` as the content template.
2. **Unification** — one schema where structural elements (header, tab bar) are just another region type alongside content regions. Everything in one template file.

**Decision: Composition.** The real-world relationship is has-a: a page *has* a content layout. Many pages share the same shell (e.g., every screen in a tab-bar app has the same tab bar) but have different content layouts. Composition models this naturally — a page template references a content template by name. Unification would blur the conceptual separation between page chrome and content regions, and wouldn't reflect how the system actually works.

This decision does not add scope to this spec. Content layout templates are self-contained and don't need to know they'll be referenced by page templates. The decision informs how we think about the content template schema (keep it self-contained, stable `name` field for future referencing) but doesn't constrain what we build now. Page template infrastructure is built when product work begins.

**Rationale for deciding now rather than deferring:** The functional alignment is clear and won't change with more data. Product work will tell us *what* page templates look like, but not *how* they relate to content templates — that structural relationship is already evident. The risk of deciding early is low because the composition mechanism (a reference field on a future page template) doesn't constrain the content template schema at all.

**Steering doc action:** Capture this in Section 8 (Template Authoring Guidance) as a "Page Layout Templates (Future)" subsection. When product work begins, this gives us a documented starting point rather than reconstructing the reasoning.

**Peter's expectation:** Page templating will be needed soon once product development begins. This is not a distant future concern — it should be designed for, even though it's not built now.

---

## Design System Study

**Conducted**: 2026-03-23
**Systems studied**: Material Design 3, Apple HIG, Carbon Design System (IBM), Atlassian Design System, Shopify Polaris, Spotify Encore
**Focus**: How each system expresses layout to implementers — vocabulary, format, level of detail

### Comparative Grid Systems

| Aspect | Material Design 3 | Carbon (IBM) | Atlassian | Polaris (Shopify) | Encore (Spotify) | DesignerPunk |
|---|---|---|---|---|---|---|
| Column counts | 4 / 8 / 12 (by breakpoint) | 4 / 8 / 16 (sm/md/lg+) | 2 / 6 / 12 (xxs-xs / xs-s / m+) | 12 (with responsive columnSpan) | No traditional grid | 4 / 8 / 12 / 16 (xs/sm/md/lg) |
| Breakpoint names | Compact, Medium, Expanded, Large, Extra-large | sm, md, lg, xlg, max | xxs, xs, s, m, l, xl | xs, sm, md, lg, xl | Platform-native | xs, sm, md, lg |
| Breakpoint count | 5 width classes | 5 | 6 | 5 | N/A | 4 |
| Gutter approach | 16/24dp depending on breakpoint | 32px default, 3 modes (wide/narrow/condensed) | 12px (xxs-s), 16px (m+) | Responsive gap prop with tokens | Spacing variables | Token-driven per breakpoint |
| Max width | 1600dp, then margins grow or columns add | 1584px (99rem) default | Fixed-narrow, fixed-wide, or fluid | Page component handles | Platform-native | Via breakpoint token references |
| Grid type | Fluid columns with breakpoints | Fluid (default) or full-width | Fluid or fixed (narrow/wide) | CSS Grid with responsive spans | Token-driven spacing | Token-driven fluid |
| Cross-platform | Android/Web | Web-first | Web-first | Web (Shopify admin) | 45+ platforms | True Native (iOS/Android/Web) |

### How Each System Communicates Layout

**Material Design 3 — Canonical Layouts + Window Size Classes**

M3 takes the most opinionated approach. Rather than giving implementers a grid and saying "figure it out," M3 defines three canonical layouts as named, validated patterns:
- **List-detail**: list pane + detail pane, side-by-side on expanded, stacked on compact
- **Supporting pane**: primary content + secondary contextual pane (70/30 split on expanded)
- **Feed**: configurable grid of content cards, columns adapt to available width

Each canonical layout has explicit adaptation rules per window size class. The system tells you: "at compact width, show only the list; at expanded width, show list and detail side by side." This is the closest analog to what our templates aim to do.

Key vocabulary: "panes" (not regions), "window size classes" (not breakpoints — classes are ranges, not thresholds), "canonical layouts" (named, reusable layout patterns).

Adaptation strategies are named: "show and hide" (panes appear/disappear), "levitate" (pane floats as overlay), "reflow" (panes change orientation, e.g., horizontal to vertical stack).

**Relevance to DesignerPunk**: M3's canonical layouts are essentially what our layout templates aspire to be — named, reusable layout patterns with explicit per-breakpoint behavior. The "pane" vocabulary is close to our "region" concept. Their adaptation strategy names (show/hide, levitate, reflow) map to our stacking/surface-switch/collapse taxonomy from Peter's interview. M3 validates the approach of defining named layout patterns rather than just providing a grid.

**Carbon Design System (IBM) — 2x Grid + Style Models + Gutter Modes**

Carbon takes a more infrastructure-heavy approach. The 2x Grid is a 16-column system with five breakpoints and three gutter modes (wide: 32px, narrow: 16px, condensed: 1px). The gutter modes are Carbon's most distinctive feature — they control how containers relate to the column grid, enabling typographic alignment across different content types.

Carbon communicates layout through "style models" — named patterns that describe how the grid behaves above max breakpoint:
- **Editorial model**: centered grid, max-width maintained, for marketing/reading content
- **Product and docs model**: left-aligned grid, max-width maintained, anticipates left-hand nav panel
- **High-density interface model**: full-width grid, columns add as screen grows, for dashboards

Carbon also introduces "grid influencers" — components (like a left nav panel) that condense the grid when present. The grid responds to the influencer, not just to the viewport.

Key vocabulary: "2x Grid" (the system name), "gutter modes" (wide/narrow/condensed), "style models" (named grid behavior patterns), "grid influencers" (components that affect the grid), "layout modules" (coded combinations of components + spacing as grid-aware units).

**Relevance to DesignerPunk**: Carbon's style models are a higher-level concept than our templates — they describe grid behavior philosophy, not specific region arrangements. But the concept of "grid influencers" is directly relevant to our content-vs-page template discussion: the page shell (nav panel, header) influences the content grid. Carbon's gutter modes (wide/narrow/condensed) are more granular than our current schema needs, but the concept of different spacing modes within the same grid is worth noting for future consideration.

**Atlassian Design System — Grid + Layout Regions + Breakpoints**

Atlassian takes the most straightforward approach. Their grid is 12-column (at medium+ breakpoints) with six breakpoints. They define layout anatomy through named regions: side navigation, main content area, and aside panels.

Key features:
- Grid starts below top navigation (same as our content template scope)
- Side navigation and aside panels have defined widths per breakpoint (e.g., aside: 320px at 1024-1439px, 400px at 1440-1767px, 504px at 1768+px)
- Two grid types: fluid (stretches to fill) and fixed (applies ideal max-width). Fixed has narrow and wide variants.
- Fixed-narrow for content-focused pages (readability), fixed-wide for data-dense pages (screen real estate)

Key vocabulary: "layout regions" (building blocks of a page), "side navigation," "aside," "main content," "fluid grid," "fixed grid" (narrow/wide), "breakpoint ranges."

**Relevance to DesignerPunk**: Atlassian's fixed-narrow vs fixed-wide grid types map to Peter's line-length discussion — fixed-narrow is the "content constraint" concept (cap width for readability), fixed-wide is the "use available space" approach. Their layout regions vocabulary is closest to ours. Their aside panel sizing (specific pixel widths per breakpoint rather than column spans) is a different approach from our column-range model — worth noting as an alternative but our column-based approach is more flexible.

**Apple HIG — Size Classes + Adaptive Layout**

Apple takes a fundamentally different approach from the web-centric systems. Rather than a column grid with breakpoints, Apple uses size classes: two dimensions (horizontal and vertical), each with two values (compact and regular). This gives four combinations that cover all Apple devices and multitasking modes.

Apple doesn't prescribe a column grid. Instead, the HIG focuses on:
- Adaptive layout via size classes and trait collections
- Safe areas and system-provided margins
- Platform-specific layout idioms (NavigationStack, sidebar, sheet)
- Content-first layout that adapts to available space

Key vocabulary: "size classes" (compact/regular, horizontal/vertical), "adaptive layout," "trait collections," "safe areas."

**Relevance to DesignerPunk**: Apple's approach is the most different from ours, which makes sense — it's a native platform system, not a web-first design system. But the size class concept (a small number of meaningful categories rather than many specific breakpoints) validates our four-breakpoint approach. Apple proves you can build sophisticated adaptive layouts with a small number of layout categories. The HIG's emphasis on platform-native idioms reinforces our True Native architecture — iOS implementations should use SwiftUI layout idioms, not try to replicate a web grid.

**Shopify Polaris — Page Component + Grid Component + Layout Patterns**

Polaris takes a product-opinionated approach. Rather than exposing a raw grid system, Polaris provides high-level layout components that encode common Shopify admin patterns:
- **Page component**: provides built-in responsiveness for aside slots, handles the page shell
- **Grid component**: CSS Grid-based, uses responsive `columnSpan` props per breakpoint (xs, sm, md, lg, xl)
- **Named layout patterns**: single-column (focused task), two-column (visual editors, content-dense), settings layout (thin description column + wide form column)

Polaris uses a 4px spacing grid for internal component spacing and a 12-column grid for page layout. The Grid.Cell component takes responsive column spans as an object: `columnSpan={{xs: 6, sm: 3, md: 3, lg: 6, xl: 6}}` — explicit per-breakpoint, no interpolation.

Key vocabulary: "Page" (the layout shell), "Grid" / "Grid.Cell" (content layout), "columnSpan" (responsive column allocation), "layout patterns" (named arrangements like settings layout).

**Relevance to DesignerPunk**: Polaris's approach of encoding layout patterns into named, high-level components (settings layout, single-column, two-column) is the closest analog to our template concept. Their `columnSpan` per breakpoint mirrors our column-range-per-breakpoint schema. The separation of Page (shell) from Grid (content layout) directly validates our content-template-first scope with page templates as a future addition. Polaris's 4px spacing grid for component internals vs 12-column grid for page layout is a useful distinction — our templates operate at the page-layout level, not the component-internal level.

**Spotify Encore — Cross-Platform Cohesion + Platform-Specific Adaptation**

Encore is the most relevant system philosophically because it shares our cross-platform challenge. Spotify serves 45+ platforms across 2,000+ device types. Encore's approach:
- Two subsystems: Encore Consumer Mobile and Encore Web, sharing a foundation of design tokens
- Cross-platform components designed from the outset, not as afterthoughts
- "Cohesion spectrum" — the middle path between perfect consistency and total platform independence
- Component outlines that capture naming conventions, anatomy, variants, and platform-specific requirements before detailed design

Encore doesn't publish a traditional grid system. Instead, it focuses on:
- Design tokens for foundational decisions (color, type, spacing)
- Layout themes using spacing variables that create platform-appropriate density
- Cross-functional collaboration process: platform experts (iOS, Android, Web) audit each component, share context, then align on a unified specification

Key vocabulary: "cohesion" (not consistency — deliberate middle ground), "component outline" (cross-platform specification before implementation), "layout themes" (spacing variable sets that adapt density per platform).

**Relevance to DesignerPunk**: Encore validates our True Native architecture more than any other system. Their "cohesion over consistency" philosophy matches Peter's framing — same information architecture and interaction model, expressed through platform-native patterns. Their cross-functional process (platform experts audit, share context, align on specification) mirrors our architect-directs, platform-agents-implement model. The absence of a traditional grid system in Encore is notable — they solve layout through spacing tokens and platform-native layout systems rather than a cross-platform grid. Our approach (grid tokens + templates as specification vocabulary) sits between Encore's token-only approach and Carbon's infrastructure-heavy approach.

### Cross-System Synthesis

**What's universal across all six systems:**

1. **Named breakpoint categories, not arbitrary pixel values.** Every system with a grid uses a small number of named size categories (4-6) rather than letting implementers pick arbitrary widths. Encore skips breakpoints entirely in favor of platform-native layout. Our four breakpoints (xs/sm/md/lg) are on the low end but within range.

2. **Regions/panes as the unit of layout.** Every system thinks about layout in terms of named functional areas (panes, regions, layout areas) that arrange differently at different sizes. The spatial arrangement is secondary to the functional identity.

3. **Explicit adaptation rules.** No system leaves breakpoint behavior to interpretation. Each specifies what happens to each region/pane at each size class. This validates requiring all four breakpoints in our schema — no interpolation.

4. **Grid influencers / page shell separation.** Carbon explicitly names "grid influencers." Atlassian's grid starts below top navigation. M3's canonical layouts operate within the app's navigation structure. Polaris separates Page (shell) from Grid (content). All systems separate the page chrome from the content grid — validating our content-template-first scope decision.

5. **Named layout patterns.** M3 has canonical layouts. Carbon has style models. Polaris has named layout patterns (settings, single-column, two-column). These are reusable, named patterns that implementers reference by name rather than rebuilding from scratch. This is exactly what our layout templates provide.

6. **Cross-platform cohesion over consistency.** Encore and Apple HIG both emphasize platform-appropriate expression over pixel-identical reproduction. Encore's "cohesion spectrum" and Apple's size classes both validate our True Native approach — same design intent, platform-native implementation.

**What varies:**

1. **Level of prescription.** M3 is most prescriptive (three canonical layouts with explicit rules). Apple and Encore are least prescriptive (principles and idioms, not patterns). Carbon, Atlassian, and Polaris are in between. Our approach (templates as acceleration, not prescription) is closest to Polaris's named layout patterns.

2. **Grid complexity.** Carbon's three gutter modes are the most complex. Atlassian's is simplest. Encore has no grid at all. Our token-driven approach is moderate — the grid tokens handle the complexity, the template schema stays simple.

3. **Adaptation vocabulary.** M3 names adaptation strategies (show/hide, levitate, reflow). Carbon describes grid behavior (squeeze, push, overlay). Atlassian and Polaris are implicit. Our steering doc should define adaptation vocabulary explicitly — Peter's interview gave us three strategies (stack, surface-switch, collapse) that map well to M3's taxonomy.

4. **Platform scope.** Apple is single-platform (native). M3 is primarily Android/web. Carbon, Atlassian, and Polaris are web-first. Encore is cross-platform (45+ platforms). We're cross-platform (True Native), which means our vocabulary needs to work for all three platforms without being web-centric. Encore's approach is the closest philosophical match.

### Vocabulary Implications for Steering Doc

Based on this study, the steering doc vocabulary (Section 3) should include:

- **Region** (not "pane" — pane implies a UI component; region is more abstract and matches Atlassian's usage)
- **Breakpoint** (universal term, all systems use it)
- **Column span** (how many grid columns a region occupies — universal concept)
- **Stacking order** (our term for what M3 calls "reflow" — when regions go from side-by-side to vertical)
- **Content constraint** (from Peter's interview — what Atlassian calls "fixed-narrow" behavior)
- **Grid influencer** (Carbon's term, useful for describing how page shell affects content grid — relevant for future page templates)
- **Adaptation strategy** (umbrella term for how regions respond to breakpoint changes: stack, surface-switch, collapse, hide)
- **Target breakpoint** (from Peter's interview — the breakpoint where the optimal experience lives)

Terms to avoid:
- "Pane" — too UI-component-specific, implies a visible container
- "Window size class" — M3-specific, our system uses breakpoints
- "Style model" — Carbon-specific, our equivalent is "layout template"
- "Canonical layout" — M3-specific, our equivalent is "layout template"

### Lina's Review Notes

**Reviewed**: 2026-03-23

1. **Carbon's "grid influencers" concept is relevant for future page templates.** When we build page templates (composition model), the page shell is a grid influencer — a sidebar nav reduces the content grid's available columns. The content template doesn't know about this today. When page templates arrive, the composition mechanism needs to communicate available column width to the content template. Not a concern for this spec, but the term should be in the steering doc vocabulary so it's ready.

2. **M3's "levitate" adaptation strategy is a real pattern we didn't capture.** Peter's interview gave us stack, surface-switch, collapse. M3 adds "levitate" (pane floats as overlay) — think of a mobile sidebar that slides in as an overlay rather than stacking or replacing content. The steering doc should include this as a fourth adaptation strategy in the vocabulary, even though the schema only implements stacking.

3. **The responsive-vs-reactive distinction is unique to our system.** None of the six systems studied explicitly distinguish responsive adaptation (same content, different arrangement) from reactive decisions (different content/functionality per platform). M3's "show and hide" is the closest, but they don't name the distinction. This is a True Native architecture concept. The steering doc should own this vocabulary clearly since we can't borrow it from an established system.

4. **Atlassian's fixed-narrow vs fixed-wide validates Peter's "content constraints" concept.** Fixed-narrow is "cap width for readability" (content constraint). Fixed-wide is "use available space." The steering doc should reference this parallel — it gives the vocabulary term external validation.

5. **The study is web-heavy (4 of 6 systems are web-first).** The steering doc's platform translation section (Section 7) should be careful not to let web-centric grid vocabulary dominate. iOS and Android don't think in "12-column grids" — they think in adaptive layouts and size classes. The vocabulary needs to be platform-neutral enough for all three platform agents.

6. **Encore's absence of a traditional grid reinforces "templates are acceleration, not requirement."** Encore works at 45+ platforms without a grid — layout through spacing tokens and platform-native systems. Our grid is a convenience tool, not the only way to specify layout. Leonardo must be able to specify layout without templates, and the grid is one tool among several.

---

## DesignerPunk Grid System

**Reviewed**: 2026-03-23
**Sources**: Token-Family-Responsive.md (breakpoints, density), Token-Family-Spacing.md § Grid Spacing Tokens (gutters, margins, column progression)

### Token Architecture for Layout

DesignerPunk's grid system is built from two token families that serve different purposes:

**Token-Family-Responsive** provides:
- Breakpoint tokens (viewport width thresholds): `breakpointXs` (320px), `breakpointSm` (375px), `breakpointMd` (1024px), `breakpointLg` (1440px)
- Density tokens (scaling multipliers): `densityCompact` (0.75), `densityDefault` (1.0), `densityComfortable` (1.25), `densitySpacious` (1.5)

**Token-Family-Spacing** provides:
- Grid gutter tokens (spacing between columns): `gridGutterXs` (16px), `gridGutterSm` (20px), `gridGutterMd` (24px), `gridGutterLg` (32px)
- Grid margin tokens (container edge margins): `gridMarginXs` (24px), `gridMarginSm` (24px), `gridMarginMd` (32px), `gridMarginLg` (40px)
- Native platform tokens: `gridGutterNative` (20px), `gridMarginNative` (24px) — Sm-level values for iOS/Android adaptive layouts

**Key insight**: Breakpoint tokens live in the Responsive family. Column counts and grid spacing (gutters, margins) live in the Spacing family. The steering doc's token source map (Section 1) must make this split clear — it's not obvious that "responsive layout" draws from two different token families.

### Grid Progression

| Breakpoint | Token | Viewport | Columns | Gutter | Margin |
|------------|-------|----------|---------|--------|--------|
| xs | `breakpointXs` | 320px | 4 | `gridGutterXs` (16px) | `gridMarginXs` (24px) |
| sm | `breakpointSm` | 375px | 8 | `gridGutterSm` (20px) | `gridMarginSm` (24px) |
| md | `breakpointMd` | 1024px | 12 | `gridGutterMd` (24px) | `gridMarginMd` (32px) |
| lg | `breakpointLg` | 1440px | 16 | `gridGutterLg` (32px) | `gridMarginLg` (40px) |

Column counts (4→8→12→16) are documented in Token-Family-Spacing.md but not expressed as tokens — they're hardcoded in the grid CSS pattern. The LayoutTemplateIndexer validator uses `{ xs: 4, sm: 8, md: 12, lg: 16 }` with a source comment.

### Mapping Against Established Systems

| Aspect | DesignerPunk | Material Design 3 | Carbon | Atlassian | Polaris |
|--------|-------------|-------------------|--------|-----------|---------|
| Breakpoint count | 4 | 5 | 5 | 6 | 5 |
| Max columns | 16 | 12 | 16 | 12 | 12 |
| Gutter approach | Token per breakpoint | Fixed 16/24dp | 3 modes (32/16/1px) | Fixed 12/16px | Token-driven gap |
| Margin approach | Token per breakpoint | 8/16/24/40dp | Varies | Fixed 16/32px | Page component |
| Native strategy | Dedicated native tokens | Platform-native | N/A (web-first) | N/A (web-first) | N/A (web-first) |

**DesignerPunk is unique in having dedicated native platform grid tokens.** Other systems either don't support native platforms or expect native platforms to use the same breakpoint-specific tokens as web. Our `gridGutterNative` and `gridMarginNative` tokens acknowledge that iOS and Android use adaptive layouts, not responsive breakpoints — they get a single balanced value rather than four breakpoint-specific values.

**Our 16-column max matches Carbon.** Most other systems max at 12. The 4→8→12→16 progression gives us finer-grained column allocation at wide viewports, which supports Peter's observation that the 12→16 transition feels proportionally similar (unlike the 8→12 jump).

### Known Token Issues

1. **`gridMarginSm` gap**: Currently references `space300` (24px). Design spec calls for 28px (`space350`), but that token doesn't exist in the primitive spacing scale. Templates use the current 24px value. This is a documented discrepancy — not a bug, but a known gap that may be resolved when the spacing scale is extended.

2. **Column counts are not tokens.** The 4/8/12/16 progression is documented but not tokenized. If column counts ever change, the LayoutTemplateIndexer validator and any CSS grid patterns need manual updates. This is acceptable for now — column counts are stable architectural decisions, not values that change with themes or density.

3. **Breakpoint values are device-based, not mathematical.** Unlike spacing tokens (which follow 8px baseline × multiplier), breakpoint values are practical device widths (320, 375, 1024, 1440). This is intentional — breakpoints reflect real device boundaries, not mathematical relationships.

### Density × Layout Interaction

Density tokens scale functional tokens (spacing, font size, tap areas) but do NOT affect:
- Breakpoint thresholds (viewport widths don't change with density)
- Column counts (grid structure is density-independent)
- Grid gutters and margins (these are structural, not functional)

**Implication for templates**: Layout templates define spatial arrangement (columns, regions, stacking) which is density-independent. Density affects what happens *inside* regions (component spacing, text size), not the regions themselves. The steering doc should make this explicit — templates and density are orthogonal systems.

### Platform Translation Notes

**Web**: Breakpoint tokens map directly to CSS media queries. Grid tokens map to CSS custom properties. The CSS grid generator (mentioned in design doc Section 7) consumes these same tokens.

**iOS**: Breakpoint tokens inform GeometryReader-based layout decisions. Native grid tokens (`gridGutterNative`, `gridMarginNative`) provide consistent spacing. SwiftUI's adaptive layout (LazyVGrid, NavigationSplitView) is the primary layout mechanism — the grid tokens inform spacing, not structure.

**Android**: Breakpoint tokens map to Jetpack Compose WindowSizeClass decisions. Native grid tokens provide consistent spacing. Compose's adaptive layout (LazyVerticalGrid, Scaffold) is the primary mechanism.

**Key for steering doc Section 7**: Platform agents should use platform-native layout systems, informed by DesignerPunk tokens. The tokens provide consistent values; the platform provides the layout mechanism. Templates describe the *intent* (regions, column allocation, stacking); platform agents translate to platform-native implementation.

### Lina's Review Notes

**Reviewed**: 2026-03-23

Verified Leonardo's token values against Token-Family-Spacing.md and Token-Family-Responsive.md. All values are accurate. Adding implementation-focused observations for the schema and validator.

1. **Token allowlist for the validator is confirmed.** The complete set of tokens that layout templates can reference:
   - Breakpoints: `breakpointXs`, `breakpointSm`, `breakpointMd`, `breakpointLg` (used in `maxWidth` and `stacking.below`)
   - Grid margins: `gridMarginXs`, `gridMarginSm`, `gridMarginMd`, `gridMarginLg` (used in region `margins`)
   - Grid gutters: `gridGutterXs`, `gridGutterSm`, `gridGutterMd`, `gridGutterLg` (not currently in the schema, but may be needed if templates express gutter overrides)
   - Native: `gridGutterNative`, `gridMarginNative` (not in the schema — native platforms use adaptive layout, not template-driven grids)
   
   For Task 3.1, the validator allowlist starts with breakpoint + margin tokens. Gutter tokens are available if the schema needs them later.

2. **The CSS grid pattern in Token-Family-Spacing.md is the web implementation reference.** Lines 493-525 show the exact CSS Grid pattern with `repeat(N, 1fr)` per breakpoint and media queries at each breakpoint value. This is what Kenya (web agent) would produce when implementing a template. The steering doc Section 7 should reference this pattern directly rather than recreating it. Avoids duplication and drift.

3. **Density is orthogonal to templates — confirmed and important.** Leonardo's note that density doesn't affect breakpoints, column counts, or grid spacing is correct and critical for the validator. The validator should NOT accept density tokens in template fields. If someone writes `margins: densityCompact` in a template, that's an error — density affects component internals, not grid structure. The token allowlist enforces this naturally (density tokens aren't in the list), but the error message should explain why: "density tokens affect component spacing, not grid layout."

4. **Native platform tokens are out of scope for templates.** `gridGutterNative` and `gridMarginNative` are Sm-level values for iOS/Android adaptive layouts. Templates describe responsive grid behavior using breakpoint-specific tokens. Native platforms translate the template's intent using their own layout systems (SwiftUI adaptive, Compose adaptive) with native tokens for spacing. The validator should not accept native tokens in template fields — they're implementation tokens, not specification tokens.

5. **The `gridMarginSm` gap is now documented in three places** (Token-Family-Spacing.md, design doc, and this foundation doc). Consistent documentation. When Ada resolves this (if `space350` is created), the template validator's allowlist doesn't change — only the token's resolved value changes. No infrastructure impact.

6. **Column counts from Token-Family-Spacing.md match the validator constants.** The CSS grid pattern uses `repeat(4, 1fr)` at xs, `repeat(8, 1fr)` at sm, `repeat(12, 1fr)` at md, `repeat(16, 1fr)` at lg. These are the same values hardcoded in the validator: `{ xs: 4, sm: 8, md: 12, lg: 16 }`. Source alignment confirmed.

---

## Authoring Guidance

**Synthesized from**: Peter interview (Task 1.1), design system study (Task 1.2), token documentation review (Task 1.3)
**Purpose**: Source material for steering doc Section 8 (Template Authoring Guidance)

### What Makes a Good Template

A good layout template is:

1. **Reusable across multiple screens.** If only one screen uses the layout, it's a screen-spec-level decision, not a template. Templates earn their place when multiple pages share the same structural shell.

2. **Structurally defined, not content-defined.** A template describes regions and their grid behavior. It does not describe what content goes in the regions — that's the screen spec's job. Two screens with different content but the same region structure should use the same template.

3. **Complete at all four breakpoints.** Every template defines region behavior at xs, sm, md, and lg. No interpolation, no assumptions. Each breakpoint stands on its own merit (Peter interview, confirmed by all six design systems studied).

4. **Mobile-first in authoring order.** Start at xs — the narrow layout defines content hierarchy. Wider breakpoints add regions and redistribute columns. They don't redefine priority (Peter interview).

5. **Named by function, not by visual appearance.** `sidebar-page` is better than `two-column-layout`. `centered-content-page` is better than `narrow-centered`. The name should describe the structural pattern, not the visual result at one breakpoint.

### What to Encode in a Template vs Leave to Screen Spec

**Encode in the template (structural, reusable):**
- Region names and their purpose
- Column allocation per breakpoint (which columns each region occupies)
- Default stacking order when regions collapse vertically
- Max-width constraints at the region level (via breakpoint token references)
- Source lifecycle (`system` or `project`)

**Leave to the screen spec (content-specific, per-page):**
- What content goes in each region
- Adaptation strategy overrides (e.g., "this sidebar surface-switches instead of stacking")
- Content constraints within regions (e.g., "body copy constrained to 66 characters")
- Reactive annotations (region visibility changes, platform-specific differences)
- Stacking order overrides based on content (e.g., "filters stack above primary")
- Component assembly within regions

**The dividing line:** If the decision depends on what's *in* the region, it belongs in the screen spec. If the decision depends on the region's *spatial relationship* to other regions, it belongs in the template.

### Template Composition Model

Templates compose upward from primitives (Peter interview):

1. **Primitive templates** — structural shells. Example: `centered-content-page` (single region, centered in grid). Reusable across almost any page type.

2. **Specialized templates** — built on primitives by adding regions. Example: `sidebar-page` (primary + sidebar regions). Reusable within a category of pages.

3. **Page-specific layouts** — when no template fits. The screen spec describes the layout directly without referencing a template.

**Inheritance is deferred.** The schema is flat — each template is self-contained. When product work reveals duplication, add `extends` to the schema. Migration is additive.

**Page templates compose with content templates** (decided: composition model). A future page template references a content template by name. Content templates don't need to know they'll be referenced. The schema's `name` field is the stable reference key.

### Authoring Checklist

When creating a new template:

- [ ] Does this layout appear on more than one screen? (If not, use screen spec instead)
- [ ] Are all four breakpoints defined (xs, sm, md, lg)?
- [ ] Did you start authoring at xs and expand outward?
- [ ] Are regions named by function, not position?
- [ ] Do column ranges use actual grid columns (1-indexed, within breakpoint column count)?
- [ ] Are all token references in camelCase (`gridMarginSm`, `breakpointMd`)?
- [ ] Is `source` set to `system` (shared) or `project` (product-specific)?
- [ ] Is stacking order defined with positive integers, no duplicates?
- [ ] Is the `gridMarginSm` discrepancy noted where that token is referenced?

### Common Pitfalls

1. **Over-specifying.** Templates that try to encode content decisions (which component goes where, what text appears) are too specific to be reusable. Keep templates structural.

2. **Under-specifying breakpoints.** Skipping a breakpoint because "it's similar to the next one" creates ambiguity. Define all four, even if two are similar.

3. **Web-centric thinking.** Templates describe spatial intent, not CSS. Avoid vocabulary that only makes sense on web (e.g., "flexbox row," "media query"). Platform agents translate intent to platform-native implementation.

4. **Confusing responsive with reactive.** If a region disappears at a breakpoint, that's reactive (screen spec annotation), not responsive (template concern). Templates describe spatial arrangement; visibility is a product decision.

5. **Position-based region names.** "left-panel" breaks when the panel stacks below content at narrow viewports. "filters" or "navigation" stays accurate regardless of spatial position.

### Page Layout Templates (Future)

Content templates define region arrangement within the content area — the current scope. Page templates will define the full page structure (header, content area, tab bar, navigation chrome).

**Decision: Composition.** Page templates reference content templates by name (has-a relationship). A page *has* a content layout. Many pages share the same shell but have different content layouts.

**Two candidate mechanisms** (to be decided when product work begins):
1. Page template has a `contentTemplate` field referencing a content template by name
2. Page template has a `contentArea` region that accepts a content template reference

**Not built now.** Content templates are self-contained and don't need modification for future page template support. The `name` field is the stable reference key.

Peter expects page templating will be needed soon once product development begins.

### Lina's Authoring Notes

**Added**: 2026-03-23

Implementation-focused additions from the template infrastructure builder's perspective.

**Schema validation boundaries — what the validator catches vs what it can't:**

The LayoutTemplateIndexer validator enforces structural correctness: required fields, valid token references, column ranges within breakpoint limits, stacking order rules. It does NOT enforce authoring quality — whether a template is reusable, whether regions are well-named, whether the layout makes design sense. That's human review (Peter, Leonardo) and the authoring checklist above.

This means a template can be valid YAML, pass all validation, and still be a bad template. The validator is a floor, not a ceiling. The authoring guidance in the steering doc (Section 8) is the quality layer on top of the validator.

**Token reference format in YAML:**

Templates reference tokens by their exact camelCase name as it appears in the token documentation. No dot notation, no aliases.

| Field | Accepts | Examples |
|-------|---------|---------|
| `margins` | Grid margin tokens | `gridMarginXs`, `gridMarginSm`, `gridMarginMd`, `gridMarginLg` |
| `maxWidth` | Breakpoint tokens | `breakpointXs`, `breakpointSm`, `breakpointMd`, `breakpointLg` |
| `stacking.below` | Breakpoint tokens | `breakpointSm`, `breakpointMd`, `breakpointLg` |

The validator rejects: density tokens (affect component internals, not grid structure), native platform tokens (implementation tokens, not specification tokens), any unrecognized token name.

**Column range authoring rules:**

- Format: `N-M` (1-indexed, inclusive) or `full-width`
- N must be less than M
- Both N and M must be within the breakpoint's column count (xs: 4, sm: 8, md: 12, lg: 16)
- `full-width` is shorthand for "spans all available columns" — use it at xs and sm where content typically fills the viewport
- `"1-1"` (single column) is valid but unusual — verify it's intentional
- Column ranges express position AND width: `"4-9"` means "start at column 4, end at column 9" (6 columns wide, offset by 3)

**Stacking order rules:**

- Positive integers only, no duplicates within a template
- Lower numbers stack higher (order 1 is above order 2)
- `stacking: null` for single-region templates
- Default stacking order follows workflow direction (Peter interview): controls above primary (lower order), supplements below primary (higher order)
- Screen specs can override template stacking order — the template provides the default

**Relationship to experience patterns:**

Layout templates and experience patterns are independent systems that compose in Leonardo's screen spec. A template doesn't reference patterns; a pattern doesn't reference templates. Leonardo's screen spec says "use `sidebar-page` template, place `simple-form` pattern in the primary region." The composition happens at the specification level, not the YAML level.

This means I don't need to add cross-references between the two systems. If we later find that certain templates and patterns are frequently paired, that's a discovery for the steering doc (Section 9, common layout patterns), not a schema change.
