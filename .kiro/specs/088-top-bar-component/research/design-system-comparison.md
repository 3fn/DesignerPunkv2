# Spec 088: Top Bar — Design System Research

**Date**: 2026-03-30
**Author**: Lina
**Purpose**: Compare DesignerPunk's proposed top bar architecture against 6 established design systems

---

## 1. Material Design (Google)

### Component Names
- **TopAppBar** — the primary component
- Variants: CenterAlignedTopAppBar, MediumTopAppBar, LargeTopAppBar, SmallTopAppBar

### Architecture
- Single component with size/alignment variants, not a primitive + semantic split
- Variants control title size and scroll behavior, not purpose (app-level vs page-level)
- All variants share the same slot structure: navigationIcon, title, actions

### Slot Structure
- **navigationIcon**: Single leading icon (back arrow, menu hamburger)
- **title**: Text, left-aligned by default, center-aligned variant available
- **actions**: Row of icon buttons (trailing)
- **No dedicated close slot** — close is just another action icon

### Title Alignment
- SmallTopAppBar: left-aligned
- CenterAlignedTopAppBar: centered
- Medium/Large: left-aligned (large title collapses to small on scroll)
- Alignment is a variant choice, not a prop

### Scroll Behavior
- Built into the component via TopAppBarScrollBehavior
- pinnedScrollBehavior, enterAlwaysScrollBehavior, exitUntilCollapsedScrollBehavior
- Medium/Large variants collapse to Small on scroll

### Key Takeaway
Material treats the top bar as one component with variants for size/scroll, not for purpose. The developer decides what goes in the slots. No primitive/semantic split.

---

## 2. Apple Human Interface Guidelines (iOS/macOS)

### Component Names
- **NavigationBar** (UIKit: UINavigationBar, SwiftUI: .navigationTitle + .toolbar)
- Not a standalone component in HIG — it's a system-provided chrome element

### Architecture
- System-managed, not custom-built. The navigation controller provides the bar.
- Developers configure it via modifiers (.navigationTitle, .navigationBarItems, .toolbar)
- No component hierarchy — it's a single system surface with configuration options

### Slot Structure
- **Leading**: Back button (system-provided, shows previous title), or custom bar button items
- **Title**: Centered, supports inline (small) and large title display modes
- **Trailing**: Bar button items (1-2 icons or text buttons)

### Title Alignment
- Always centered (inline mode)
- Left-aligned in large title mode (collapses to centered on scroll)
- Not configurable — this is the iOS convention

### Scroll Behavior
- Large title is a core feature, not optional
- Collapses from large (left-aligned) to inline (centered) on scroll
- System-managed animation

### Key Takeaway
Apple doesn't think of this as a "component" — it's system chrome. The back button with previous title is deeply integrated with the navigation stack. DesignerPunk's custom implementation (D1) means we're opting out of this system integration, which gives us design control but costs us the automatic navigation stack behavior.

---

## 3. Shopify Polaris

### Component Names
- **TopBar** — the app-level header (logo, search, user menu)
- **Page** component has a built-in header (title, breadcrumbs, actions) — not a separate component

### Architecture
- TopBar and Page header are completely separate concepts
- TopBar is app-shell chrome (always visible, contains search + profile)
- Page header is content-level (title, primary/secondary actions, breadcrumbs, pagination)
- No primitive/semantic inheritance — they're independent components

### Slot Structure (TopBar)
- **Logo**: Brand mark (leading)
- **SearchField**: Expandable search input (center)
- **UserMenu**: Profile avatar + dropdown (trailing)
- **SecondaryMenu**: Additional actions (trailing)

### Slot Structure (Page Header)
- **title**: Page name
- **primaryAction**: Main CTA button
- **secondaryActions**: Additional action buttons
- **breadcrumbs**: Navigation path
- **pagination**: Previous/next navigation

### Title Alignment
- TopBar: logo left-aligned, search centered
- Page header: title left-aligned
- Not configurable

### Key Takeaway
Polaris separates app-level (TopBar) from page-level (Page header) completely — different components, different APIs, different concerns. This validates our semantic variant direction, though Polaris doesn't share a primitive between them.

---

## 4. Spotify Encore

### Component Names
- **TopBar** — the primary navigation bar
- Variants by context, not by component split

### Architecture
- Single TopBar component with contextual configuration
- Opinionated defaults — limited customization by design
- Follows Spotify's "constrained flexibility" philosophy (same as our Container-Card-Base inspiration)

### Slot Structure
- **Leading**: Back button or custom action
- **Title**: Screen title (centered)
- **Trailing**: Action icons
- Minimal — Encore is deliberately restrictive about what goes in a top bar

### Title Alignment
- Centered across platforms
- Consistent brand identity over platform convention

### Key Takeaway
Encore is the closest to our "unified cross-platform identity" option (D4 Option A). They center the title everywhere and keep the API deliberately constrained. Their philosophy aligns with DesignerPunk's opinionated-defaults approach.

---

## 5. Atlassian Design System

### Component Names
- **PageHeader** — page-level header with title and actions
- **AtlassianNavigation** — app-level navigation bar (top of Jira, Confluence, etc.)
- Completely separate components

### Architecture
- Two distinct components, no shared primitive
- AtlassianNavigation is a complex app shell component (product switcher, search, notifications, profile, help)
- PageHeader is simpler (title, actions, breadcrumbs)

### Slot Structure (AtlassianNavigation)
- **ProductHome**: Logo/product icon (leading)
- **PrimaryItems**: Navigation links
- **Search**: Search input
- **AppSwitcher, Help, Notifications, Profile**: Specific trailing slots (not generic)

### Slot Structure (PageHeader)
- **children**: Title content
- **actions**: Action buttons
- **breadcrumbs**: Navigation path
- **bottomBar**: Secondary content below the header

### Title Alignment
- Left-aligned throughout
- Not configurable

### Key Takeaway
Atlassian has the most complex app-level bar (product switcher, cross-product navigation). Their separation of app-level and page-level is complete — no shared foundation. The app-level bar has named slots for specific concerns (notifications, help, profile) rather than generic trailing actions.

---

## 6. IBM Carbon

### Component Names
- **UIShell Header** — app-level header
- **UIShell HeaderPanel** — expandable side panel from header
- No separate page-level header component — page titles are handled by content layout

### Architecture
- Header is part of the "UI Shell" pattern (Header + SideNav + Content)
- Single header component, not split by purpose
- Highly structured with named slots

### Slot Structure
- **HeaderName**: App/product name (leading, after hamburger)
- **HeaderNavigation**: Horizontal nav links
- **HeaderGlobalBar**: Global actions (search, notifications, profile, app switcher)
- **HeaderMenuButton**: Hamburger for side nav toggle

### Title Alignment
- Left-aligned (after hamburger icon)
- Not configurable

### Key Takeaway
Carbon treats the header as part of a larger shell pattern. No page-level header component — that's left to content layout. The header is app-level only, with structured named slots rather than generic leading/trailing.

---

## Comparative Summary

| Aspect | Material | Apple | Polaris | Encore | Atlassian | Carbon | DesignerPunk (Proposed) |
|--------|----------|-------|---------|--------|-----------|--------|------------------------|
| **App vs Page split** | No (one component) | No (system chrome) | Yes (TopBar + Page) | No (one component) | Yes (AtlassianNav + PageHeader) | No (app-level only) | Yes (semantic variants) |
| **Shared primitive** | N/A | N/A | No | N/A | No | N/A | Yes (Nav-Header-Base) |
| **Title alignment** | Variant-driven | Always centered | Always left | Always centered | Always left | Always left | TBD (D4) |
| **Close as dedicated slot** | No | No | No | No | No | No | Yes (proposed) |
| **Scroll collapse** | Core feature | Core feature | No | No | No | No | v2 (proposed) |
| **Named vs generic slots** | Generic (actions) | Generic (barButtonItems) | Named (search, userMenu) | Generic | Named (notifications, help, profile) | Named (nav, globalBar) | Generic (proposed) |
| **Primitive direct use** | N/A | N/A | N/A | N/A | N/A | N/A | Prohibited |

---

## Implications for DesignerPunk

### What the research validates
- **App/page split**: Polaris and Atlassian both separate these concerns. Our semantic variant approach is validated, though neither uses a shared primitive.
- **Custom implementation (D1)**: Every system except Apple uses custom components. Apple's system-managed approach is the outlier.
- **No previous page label (D2)**: Only Apple shows the previous title. Material, Polaris, Encore, Atlassian, Carbon all use icon-only back buttons.
- **Constrained trailing actions (D3)**: Encore is the most restrictive. Polaris and Atlassian use named slots for specific actions rather than a generic array. Worth considering.

### What the research challenges
- **Shared primitive**: No other system uses a shared primitive between app-level and page-level bars. Polaris and Atlassian keep them completely separate. Our primitive approach is novel — which could mean it's innovative or it could mean it's unnecessary abstraction. The test is whether the primitive's shared responsibilities (safe area, background, landmark) are substantial enough to justify the inheritance.
- **Close as dedicated slot**: No other system does this. They all treat close as just another action icon. Our dedicated `closeAction` prop may be over-engineering the distinction.
- **Generic vs named slots**: Polaris, Atlassian, and Carbon use named slots for app-level bars (search, notifications, profile). Our generic `trailingActions` array for Nav-Header-App might be too unstructured for the app-level use case. Named slots would give stronger composition guidance.

### Title alignment landscape
- **Centered**: Apple, Encore (2/6)
- **Left-aligned**: Polaris, Atlassian, Carbon (3/6)
- **Variant-driven**: Material (1/6)

The industry leans left-aligned. Centered is the minority position, held by Apple (platform convention) and Encore (brand identity choice). If DesignerPunk centers everywhere (D4 Option A), we're in Encore's camp — unified brand over platform convention.

---

## Questions This Research Raises

1. **Is the shared primitive justified?** No other system does it. The safe area + background + landmark responsibilities are real, but are they enough to warrant inheritance vs just duplicating them in two independent components?

2. **Should Nav-Header-App use named slots instead of generic trailing actions?** Polaris and Atlassian suggest that app-level bars benefit from structured slots (search, notifications, profile) rather than a generic array.

3. **Should we drop the dedicated closeAction prop?** No other system separates close from other actions. It could just be a trailing action with `type: 'close'` that the component renders at the edge.

4. **Is scroll collapse a v1 requirement after all?** Material and Apple both treat it as core, not optional. Deferring it to v2 puts us behind the two most influential mobile design systems.
