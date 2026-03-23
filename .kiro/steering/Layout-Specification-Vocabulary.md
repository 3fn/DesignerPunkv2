---
inclusion: manual
name: Layout-Specification-Vocabulary
description: Layout specification vocabulary — responsive layout terms, grid system mental model, specification format, and platform translation patterns. Load when specifying screen layouts, working with layout templates, or translating layout intent to platform implementation.
---

# Layout Specification Vocabulary

**Date**: 2026-03-23
**Purpose**: Canonical vocabulary and specification format for responsive layout across platforms
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 3
**Relevant Tasks**: screen-specification, layout-templates, responsive-design

---

## AI Agent Reading Priorities

**Layer Context**: This is a Layer 3 (Specific Implementations) document that defines how responsive layout is specified and communicated between Leonardo (architect), platform agents (Kenya, Data, Sparky), and Lina (template author).

**WHEN specifying a screen layout THEN Read:**
- Section 3 (Specification Vocabulary) — canonical terms
- Section 4 (Specification Format) — how to express layout in screen specs

**WHEN authoring or consuming a layout template THEN Read:**
- Section 1 (Token Source Map) — which tokens feed layout
- Section 2 (Grid System Mental Model) — how the grid works
- Section 5 (Responsive Adaptation) — breakpoint behavior

**WHEN implementing a layout on a platform THEN Read:**
- Section 7 (Platform Translation Patterns) — platform-specific guidance

**WHEN deciding if something is responsive vs reactive THEN Read:**
- Section 5 (Responsive Adaptation) — responsive scope
- Section 6 (Reactive Annotations) — reactive scope and boundary

---

## Section 1: Token Source Map

Layout specification draws from two token families. This split is not obvious — "responsive layout" sounds like one family, but the tokens come from two.

### Token-Family-Responsive (Breakpoints + Density)

| Token | Value | Purpose |
|-------|-------|---------|
| `breakpointXs` | 320px | Small mobile viewport baseline |
| `breakpointSm` | 375px | Standard mobile / large mobile |
| `breakpointMd` | 1024px | Desktop / tablet landscape transition |
| `breakpointLg` | 1440px | Large desktop / wide screen |
| `densityCompact` | 0.75 | Compact UI scaling (-25%) |
| `densityDefault` | 1.0 | No scaling (baseline) |
| `densityComfortable` | 1.25 | Comfortable UI scaling (+25%) |
| `densitySpacious` | 1.5 | Spacious UI scaling (+50%) |

Breakpoint values are device-based (real viewport widths), not mathematical progressions.

Density tokens are included for completeness. They affect content within regions, not layout structure. See Section 2.

### Token-Family-Spacing (Grid Structure)

| Token | Primitive | Value | Breakpoint |
|-------|-----------|-------|------------|
| `gridGutterXs` | space200 | 16px | xs (4 columns) |
| `gridGutterSm` | space250 | 20px | sm (8 columns) |
| `gridGutterMd` | space300 | 24px | md (12 columns) |
| `gridGutterLg` | space400 | 32px | lg (16 columns) |
| `gridMarginXs` | space300 | 24px | xs |
| `gridMarginSm` | space300 | 24px | sm |
| `gridMarginMd` | space400 | 32px | md |
| `gridMarginLg` | space500 | 40px | lg |
| `gridGutterNative` | space250 | 20px | iOS/Android |
| `gridMarginNative` | space300 | 24px | iOS/Android |

**Known gap**: `gridMarginSm` resolves to 24px. Design spec calls for 28px (`space350`), but that token doesn't exist in the primitive spacing scale. Templates and specs use the current 24px value.

### What's NOT a Token

Column counts per breakpoint (4, 8, 12, 16) are documented constants, not tokens. They are stable architectural decisions sourced from Token-Family-Spacing.md.

---

## Section 2: Grid System Mental Model

### The Progressive Column Grid

DesignerPunk uses a fluid column grid that increases in complexity with viewport width:

| Breakpoint | Viewport | Columns | Gutter | Margin |
|------------|----------|---------|--------|--------|
| xs | 320px+ | 4 | 16px | 24px |
| sm | 375px+ | 8 | 20px | 24px |
| md | 1024px+ | 12 | 24px | 32px |
| lg | 1440px+ | 16 | 32px | 40px |

**How to think about it**: At xs, you have 4 columns — enough for a single content region. At sm, 8 columns — enough for simple two-region layouts. At md, 12 columns — comfortable multi-region layouts. At lg, 16 columns — complex layouts with generous spacing.

### The 8→12 Pressure Point

The transition from sm (8 columns) to md (12 columns) is the most significant layout change. The viewport nearly triples (375px → 1024px), column count jumps by 50%, and the interaction model shifts from touch-primary to mouse/keyboard. Proportions that work at 8 columns often need re-evaluation at 12 — they don't simply scale.

The other transitions are smoother: xs→sm is a modest expansion (320→375px, 4→8 columns), and md→lg is proportionally similar (1024→1440px, 12→16 columns).

### Density Is Orthogonal to Layout

Density tokens scale functional properties (spacing, font size, tap areas) within regions. They do NOT affect:
- Breakpoint thresholds
- Column counts
- Grid gutters and margins
- Region arrangement

Templates define spatial structure. Density affects what happens inside that structure. They are independent systems.

### Native Platforms and the Grid

iOS and Android don't use the column grid directly. They use platform-native layout systems (SwiftUI adaptive layout, Jetpack Compose WindowSizeClass) informed by DesignerPunk tokens. The grid is a specification tool — it describes intent. Platform agents translate that intent using native mechanisms.

Native platforms get dedicated tokens (`gridGutterNative`, `gridMarginNative`) at Sm-level values, rather than four breakpoint-specific tokens. This reflects that native platforms use adaptive layouts, not responsive breakpoints.

---

## Section 3: Specification Vocabulary

These are the canonical terms for layout specification. Use these terms in screen specs, layout templates, and cross-agent communication. Terms align with YAML schema field names.

### Region

A named functional area within a page's content layout. Regions have their own purpose, content, and potentially their own scroll behavior.

**Name regions by function, not position.** "filters," "content-feed," "community-context" — not "left," "center," "right." Position changes across breakpoints; function doesn't.

**Schema field**: `regions` (map of region name → region definition)

### Column Span

The grid columns a region occupies at a given breakpoint, expressed as a range: `"start-end"` (1-indexed, inclusive). Example: `"4-9"` means columns 4 through 9.

`"full-width"` is shorthand for spanning all columns at that breakpoint.

Column ranges must be within the breakpoint's column count (xs: 1-4, sm: 1-8, md: 1-12, lg: 1-16).

**Schema field**: `columns` (per breakpoint, e.g., `xs: "1-4"`, `md: "4-9"`)

### Stacking Order

When regions can't sit side by side at narrow viewports and stack vertically, stacking order determines their top-to-bottom sequence. Lower order values appear first (higher on the page).

- Positive integers only, 1-indexed
- No duplicate order values within a template
- Templates provide default stacking order; screen specs can override based on content

**Schema field**: `stacking: { below: "breakpointMd", order: 1 }`

### Content Constraint

When a region spans wide but readable content within it should be narrower. Example: a primary region spans 9 of 12 columns, but body copy is constrained to ~66 characters per line.

Content constraints are screen-spec-level decisions, not template-level. The template defines how wide the region is; the screen spec or platform agent handles content width within the region.

**Guideline**: 50-75 characters per line for body copy, 66 is the sweet spot.

**Not a schema field** — expressed in screen specs, implemented by platform agents via inner containers, responsive typography, or padding.

### Adaptation Strategy

How a region responds when viewport width changes. Four strategies:

1. **Stack** — regions arrange vertically in priority order. The common case. Expressed in the template schema via `stacking`.
2. **Surface-switch** — regions share the same space, user navigates between them (segmented controller, tabs). Reactive — expressed in screen specs, not templates.
3. **Collapse** — region content absorbed into another region's flow. Reactive — expressed in screen specs.
4. **Levitate** — region floats as overlay above other content (e.g., mobile sidebar slides in). Reactive — expressed in screen specs.

Only stacking is in the template schema. The other three are reactive decisions documented in screen specs.

### Grid Influencer

A structural element (navigation panel, sidebar, header) that affects the content grid's available space. When a grid influencer is present, the content grid operates within the remaining space.

Relevant for future page templates — the page shell is a grid influencer. Content templates operate within whatever space the page shell leaves.

**Not a schema field** — conceptual term for understanding how page structure affects content layout.

### Target Breakpoint

The breakpoint where the product's primary use case is best served. Design mobile-first (start at xs), but the target breakpoint gets the most design refinement.

**Not a schema field** — a design decision documented in product context.

### Max Width

An optional constraint on a region's maximum width, expressed as a breakpoint token reference (e.g., `maxWidth: breakpointSm`). Prevents a region from expanding beyond a comfortable width at wide viewports.

**Schema field**: `maxWidth` (optional, on region definition)

---

## Section 4: Specification Format

This section defines how Leonardo expresses layout in screen specs. This is the most important section for the architect — it's the format platform agents read.

### Screen Spec Layout Section Structure

```
## Layout

**Template**: sidebar-page (or "custom" if no template applies)
**Target breakpoint**: md

### Regions

**primary** (content-feed)
- Purpose: Scrollable feed of legislation items
- Content constraint: 66 characters for body copy
- Adaptation: stacks below filters at xs/sm

**sidebar** (filters)
- Purpose: Legislation filtering controls
- Adaptation: stacks above primary at xs/sm (minified entry point)
- At md+: persistent sidebar, columns 1-3

### Reactive Annotations
- sidebar surface-switches to bottom sheet at xs (not stacked)
- notification badge hidden on Android (platform doesn't support)
```

### Rules for the Format

1. **Reference a template when one fits.** If the layout matches an existing template, name it. Don't re-describe what the template already defines.

2. **Override only what differs.** If the template says sidebar stacks below primary but this screen needs sidebar above, note the override. Don't repeat the template's defaults.

3. **Name regions by function.** Use the same region names as the template. If the screen adds a region the template doesn't have, name it by function.

4. **Separate responsive from reactive.** Responsive behavior (spatial rearrangement) goes in the Regions section. Reactive behavior (experience changes) goes in Reactive Annotations.

5. **Use token names, not pixel values.** "columns 1-3 at md" not "250px wide." "max-width breakpointSm" not "max-width 375px."

6. **State the target breakpoint.** This tells platform agents which breakpoint gets the most design attention and should be the primary implementation reference.

### Worked Example 1: Template-Referenced Layout (Sidebar Page)

This example shows a legislation detail screen that uses the `sidebar-page` template with content-specific overrides.

```markdown
## Layout

**Template**: sidebar-page
**Target breakpoint**: md

### Regions

#### primary (legislation-detail)
- Purpose: Full text of legislation with section navigation
- Content constraint: 66 characters for body copy
- Scrollable: yes (independent scroll)

#### sidebar (legislation-context)
- Purpose: Sponsor info, committee status, voting timeline, related bills
- Scrollable: yes (independent scroll)
- Stacking override: stacks ABOVE primary at xs/sm (context needed before reading)

### Reactive Annotations
- sidebar: surface-switches to segmented controller at xs
  (legislation-context tab alongside legislation-detail tab)
- share-action: hidden on Android (uses system share sheet instead)
```

**What to notice:**
- Template is named — the spec doesn't re-describe column allocations or default stacking (the template defines those)
- Stacking override is noted because this screen's sidebar has control/context content that users need *before* the primary content, reversing the template's default order
- Reactive annotations are separated — the surface-switch at xs is a different interaction model, not just a spatial rearrangement

### Worked Example 2: Custom Layout (No Template)

This example shows a search results screen with a layout that doesn't match any existing template.

```markdown
## Layout

**Template**: custom
**Target breakpoint**: md

### Regions

#### search-controls
- Purpose: Search input, active filters, sort controls
- Columns:
  - xs: full-width
  - sm: full-width
  - md: 1-12
  - lg: 1-16
- Stacking: order 1 (always on top)

#### results-feed
- Purpose: Scrollable list of search results (infinite scroll)
- Columns:
  - xs: full-width
  - sm: full-width
  - md: 1-8
  - lg: 1-10
- Stacking: order 2
- Content constraint: result cards max 3 per row at lg

#### results-context
- Purpose: Selected result preview, quick actions
- Columns:
  - xs: (not shown — see reactive)
  - sm: (not shown — see reactive)
  - md: 9-12
  - lg: 11-16
- Stacking: order 3

### Reactive Annotations
- results-context: hidden at xs/sm (appears as bottom sheet on result tap)
- search-controls: collapses to search icon + active filter count at xs
  (expands to full controls on tap)
```

**What to notice:**
- No template referenced — all column allocations are specified explicitly
- Each region has columns defined at all four breakpoints
- results-context doesn't exist at xs/sm — that's reactive (noted in annotations), not responsive
- search-controls has a reactive collapse behavior at xs that changes the interaction model

---

## Section 5: Responsive Adaptation

Responsive adaptation is spatial rearrangement of the same content across breakpoints. The content doesn't change — its arrangement does.

### What's Responsive (Template Scope)

- Regions changing column allocation across breakpoints
- Regions stacking vertically at narrow viewports
- Region max-width constraints
- Grid gutter and margin changes (automatic via tokens)

### Stacking Behavior

When regions stack vertically, workflow direction determines order:
- Content that **controls or influences** primary (search, filters) → stacks above primary
- Content that **supplements** primary (author bio, related links) → stacks below primary

Templates provide default stacking order. Screen specs override when content warrants it.

### Each Breakpoint Stands Alone

Every template defines all four breakpoints explicitly. No interpolation — what you see at each breakpoint is what gets implemented. The 8→12 column transition is a pressure point where proportions often need re-evaluation, not just scaling.

### Mobile-First Authoring

Start at xs. The narrow layout defines content hierarchy. Wider breakpoints add regions and redistribute columns — they don't redefine priority.

---

## Section 6: Reactive Annotations

Reactive changes are substantive experience differences across platforms or viewports. Functionality may appear, disappear, or change form.

### What's Reactive (Screen Spec Scope)

- A region disappearing at a breakpoint (visibility change)
- A region changing interaction model (sidebar → bottom sheet)
- Surface switching (two regions share space, user navigates between them)
- Platform-specific functionality differences
- Content that exists on one platform but not another

### The Responsive/Reactive Boundary

This distinction is unique to DesignerPunk — no established design system explicitly names it.

**Test**: Does the user get the same content in a different arrangement? → Responsive. Does the user get a different experience? → Reactive.

- Sidebar stacks below primary → responsive (same content, different position)
- Sidebar becomes a bottom sheet → reactive (different interaction model)
- Sidebar disappears on mobile → reactive (content removed)
- Filters minify to a compact entry point → reactive (different UI, same function)

### How to Annotate Reactive Changes

In screen specs, use the Reactive Annotations section:

```
### Reactive Annotations
- [region]: [what changes] at [condition]
- sidebar: surface-switches to segmented controller at xs
- purchase-cta: moves to sticky footer at xs/sm (persistent access)
- admin-tools: hidden on mobile (desktop-only functionality)
```

Templates do not express reactive changes. They describe spatial arrangement only.

---

## Section 7: Platform Translation Patterns

Layout specifications describe intent. Platform agents translate intent to platform-native implementation.

### Web (Kenya / Sparky)

- Breakpoint tokens → CSS media queries (`@media (min-width: var(--breakpoint-md))`)
- Column spans → CSS Grid `grid-column` declarations
- Grid tokens → CSS custom properties (`--grid-gutter-md`, `--grid-margin-md`)
- The CSS grid generator consumes the same tokens that templates reference. Kenya can use generator output as a starting point when implementing template-specified layouts.
- Stacking → CSS Grid reordering or flexbox `order` property

### iOS (Kenya)

- Breakpoint tokens → GeometryReader width checks or horizontal size class
- Column spans → proportional width calculations or NavigationSplitView column widths
- Native grid tokens → SwiftUI spacing values (`gridGutterNative`, `gridMarginNative`)
- Stacking → VStack arrangement, conditional view inclusion
- Use SwiftUI adaptive layout idioms (NavigationSplitView, LazyVGrid) — don't replicate a web grid

### Android (Data)

- Breakpoint tokens → WindowSizeClass (Compact/Medium/Expanded mapping)
- Column spans → weight-based or fixed-width column arrangements
- Native grid tokens → Compose spacing values (`gridGutterNative`, `gridMarginNative`)
- Stacking → Column arrangement, conditional composition
- Use Compose adaptive layout idioms (Scaffold, ListDetailPaneScaffold) — don't replicate a web grid

### Cross-Platform Consistency

Consistent does NOT mean identical. Each platform should feel native. Consistent means: same information architecture, same interaction model, same visual hierarchy, same accessibility guarantees — expressed through platform-native patterns.

The vocabulary in this document is platform-neutral. Avoid web-centric terms ("flexbox," "media query," "CSS grid") in screen specs — use the canonical terms (region, column span, stacking order) and let platform agents translate.

For platform-specific grid implementation patterns (CSS Grid, SwiftUI adaptive layout, Compose grid), see Token-Family-Spacing.md § Grid Spacing Patterns.

---

## Section 8: Template Authoring Guidance

This section serves both Lina (template author) and Leonardo (template consumer). It defines what makes a good template and where the boundary sits between template decisions and screen spec decisions.

### What Belongs in a Template

A template encodes **structural, reusable** layout decisions:

- Region names and their functional purpose
- Column allocation per breakpoint (which columns each region occupies)
- Default stacking order when regions collapse vertically
- Max-width constraints at the region level (via breakpoint token references)
- Source lifecycle (`system` or `project`)

### What Belongs in the Screen Spec

A screen spec encodes **content-specific, per-page** decisions:

- What content goes in each region
- Adaptation strategy overrides (e.g., "this sidebar surface-switches instead of stacking")
- Content constraints within regions (e.g., "body copy constrained to 66 characters")
- Reactive annotations (region visibility, platform-specific differences)
- Stacking order overrides based on content relationship
- Component assembly within regions

**The dividing line:** If the decision depends on what's *in* the region, it belongs in the screen spec. If the decision depends on the region's *spatial relationship* to other regions, it belongs in the template.

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

### Template Composition Model

Templates compose upward from primitives:

1. **Primitive templates** — basic structural shells (single region centered, header + open canvas). Reusable across almost any page type.
2. **Specialized templates** — built on primitives by adding regions (primitive + sidebar, primitive + multi-zone). Reusable within a category of pages.
3. **Page-specific layouts** — when no template fits. The screen spec describes the layout directly.

The schema is flat — each template is self-contained. Inheritance (`extends`) is deferred until product work reveals duplication that justifies it. Migration would be additive.

### Page Layout Templates (Future)

Content templates (current scope) define region arrangement within the content area. Page templates (future) will define the full page structure — header, content area, tab bar, navigation chrome.

**Decision: Composition.** Page templates will reference content templates by name (has-a relationship). A page *has* a content layout. Many pages share the same shell but have different content layouts.

Content templates don't need modification for future page template support. The `name` field is the stable reference key.

### Validator vs Authoring Quality

The LayoutTemplateIndexer validator enforces structural correctness: required fields, valid token references, column ranges within breakpoint limits, stacking order rules. It does NOT enforce authoring quality — whether a template is reusable, whether regions are well-named, whether the layout makes design sense.

A template can pass validation and still be a bad template. The validator is a floor, not a ceiling. This checklist and human review (Peter, Leonardo) are the quality layer.

---

## Section 9: Common Layout Patterns

**These are suggestive guidelines, not definitive prescriptions.** They are seeded from established design system study and Peter's layout thinking. They will evolve as product work teaches what actually works.

### Centered Content Page

A single content region centered in the grid. The simplest layout — one region, no stacking.

**When to use:** Login, registration, single-purpose forms, focused reading, onboarding flows. Any page with a singular intent and no supplemental content.

**Character:** The content area is narrower than the viewport at wider breakpoints, creating generous whitespace. Max-width constraint prevents content from stretching uncomfortably wide.

**Cross-system parallel:** Material Design 3's single-pane layout. Polaris's single-column pattern. Atlassian's fixed-narrow grid.

### Sidebar Page

Primary content alongside a persistent supplemental region. Two regions with stacking behavior at narrow viewports.

**When to use:** Detail pages with contextual information, content feeds with filtering, any page where supplemental content recurs across multiple screens (not one-off contextual info — that belongs in the primary region).

**Character:** Primary region gets the majority of columns. Sidebar is narrower but persistent. At narrow viewports, sidebar stacks below primary (default) or above (when sidebar content controls/influences primary).

**Key decision:** Does the sidebar content need to be visible *before* the user engages with primary content? If yes, it stacks above. If it supplements after consumption, it stacks below.

**Cross-system parallel:** Material Design 3's supporting pane canonical layout. Carbon's product and docs style model. Atlassian's layout with aside panel.

### Multi-Zone Page

Three or more regions with distinct purposes and independent grid behavior. The most complex common pattern.

**When to use:** Dashboards, overview pages, pages requiring simultaneous access to multiple independent information streams. Rare — most pages are single-region or two-region.

**Character:** Each zone has its own column allocation, scroll behavior, and content lifecycle. The zones are functionally independent — removing one doesn't break the others.

**Key decision:** Do the zones genuinely need simultaneous visibility, or could they be sequential (stacked or tabbed)? Three+ regions is justified when the user's task requires cross-referencing between zones. If zones are consumed sequentially, a simpler layout with navigation between sections is better.

**Cross-system parallel:** Material Design 3's list-detail canonical layout (when extended). Carbon's high-density interface style model.

### Full-Width Content Page

A single region spanning the full grid width. No centering, no max-width constraint.

**When to use:** Data tables, search results, content that benefits from maximum horizontal space. Pages where the content itself determines its width (e.g., a table with many columns).

**Character:** Content fills the available grid at every breakpoint. Margins come from the grid margin tokens, not from column allocation. No content constraint at the region level — the content type determines its own width behavior.

**Key decision:** Does the content genuinely need full width, or would a centered layout with content constraints produce better readability? Full-width is appropriate for data-dense content; it's rarely appropriate for body copy.

**Cross-system parallel:** Carbon's high-density interface style model. Atlassian's fixed-wide grid.
