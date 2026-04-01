# Nav-Header-Base Component — Design Outline

**Date**: 2026-03-29
**Author**: Lina
**Purpose**: Capture design decisions and platform analysis before creating full spec
**Status**: Design Outline — Draft
**Family**: Navigation
**Gap Report**: #0 (Spec 083)
**Origin**: Nav-TabBar-Base scope split (Spec 050)

---

## Component Overview

Nav-Header-Base is a persistent top-of-screen bar providing title, optional leading action (back, menu), and optional trailing actions (search, settings, profile). It's the structural complement to Nav-TabBar-Base — TabBar handles bottom navigation between destinations, Header handles the top bar within each destination.

**Key Characteristics**:
- **Persistent**: Fixed to top of screen, always visible within a destination
- **Slot-based**: Leading action + title + trailing actions
- **True Native**: Platform conventions diverge structurally, not just visually
- **Safe area aware**: Integrates with iOS status bar, Android system bar, web viewport
- **Accessibility landmark**: `<header>` / `role="banner"` (web), navigation bar semantics (iOS/Android)

---

## Platform Convention Analysis

This is the most platform-divergent component in the catalog. Unlike TabBar (shared visual model, platform-specific animation), the top bar has platform-specific *structure*.

### iOS Convention

- **Title**: Centered by default, left-aligned in large title mode
- **Large title**: Expands to a large, left-aligned title that collapses to centered on scroll (UINavigationBar behavior)
- **Leading**: Back button with chevron + previous screen title (system-provided), or custom leading item (menu hamburger)
- **Trailing**: 1–2 bar button items (icons or text)
- **Safe area**: Extends behind status bar with blur/translucency
- **Back navigation**: System swipe-back gesture (edge swipe), back button tap
- **Scroll behavior**: Large title collapses to inline on scroll, blur intensifies

### Android Convention

- **Title**: Left-aligned (Material 3 TopAppBar)
- **Leading**: Navigation icon (back arrow, menu hamburger)
- **Trailing**: Action icons (1–3), overflow menu for additional actions
- **Safe area**: Extends behind system status bar
- **Back navigation**: System back gesture/button, leading navigation icon
- **Scroll behavior**: TopAppBar can collapse (MediumTopAppBar, LargeTopAppBar)

### Web Convention

- **Title**: Typically left-aligned, but no platform standard
- **Leading**: Logo/brand mark, or back/menu button
- **Trailing**: Action buttons, navigation links, profile menu
- **Safe area**: Not applicable (no system chrome overlap)
- **Back navigation**: Browser back button (not component-controlled)
- **Scroll behavior**: Sticky positioning, optional hide-on-scroll

### Platform Divergence Summary

| Aspect | iOS | Android | Web |
|--------|-----|---------|-----|
| Title alignment | Centered (default) | Left-aligned | Left-aligned |
| Large title | ✅ Collapses on scroll | ✅ Medium/Large variants | ❌ Not conventional |
| Back button | Chevron + prev title | Arrow icon | Optional |
| System back gesture | Edge swipe | System gesture/button | Browser button |
| Safe area | Status bar integration | System bar integration | N/A |
| Blur/translucency | ✅ Standard | ❌ Not standard | Optional |

---

## Architecture Decision: Primitive + Semantic Variants

Inspired by the Container family pattern (Container-Base → Container-Card-Base), the top bar uses a primitive that handles the hard cross-platform problems once, with semantic variants encoding intent.

### Inheritance Structure

```
Nav-Header-Base (Primitive)
    │   Structural foundation: safe area, background, layout,
    │   landmark semantics, leading/title/trailing regions
    │
    ├── Nav-Header-App (Semantic)
    │   Root destination bar: engagement actions, no back button,
    │   richer composition (search, avatar, badge)
    │
    ├── Nav-Header-Page (Semantic)
    │   Pushed/presented screen bar: back or close, page title,
    │   1-2 contextual actions
    │
    └── [Future variants as needed]
```

### What the Primitive Owns

| Responsibility | Detail |
|---------------|--------|
| Safe area integration | iOS status bar, Android system bar, web viewport |
| Background treatment | Opaque/translucent, token-driven color |
| Bottom separator | Border stroke (similar to TabBar top stroke) |
| Horizontal layout | Leading region, title region, trailing region |
| Accessibility landmark | `<header>` / `role="banner"` (web), navigation bar semantics (iOS/Android) |
| Focus order | Leading → title → trailing |
| Touch targets | All interactive elements meet `tapAreaMinimum` |

### What Semantic Variants Add

| | Nav-Header-App | Nav-Header-Page |
|---|---------------|-----------------|
| Purpose | Architectural foundation for product-defined app-level headers | Opinionated page-level navigation bar |
| Readiness | Scaffold (architecture in place, product content TBD) | Production target |
| Leading slot | Permissive (logo, menu, empty — product-defined) | Back (chevron) or custom |
| Title/center slot | Permissive (title, logo, search — product-defined) | Page title (string) |
| Trailing slot | Permissive (product-defined engagement actions) | 1-2 contextual actions |
| Close action | Product-defined | Close button at inline-end when modal/presented |
| Composition | Inherits primitive, exposes raw slots | Inherits primitive, constrains to navigation props |
| Back navigation | N/A | Platform back gesture integration |
| API surface | Minimal — close to primitive's slots | Opinionated — purpose-specific props |

Nav-Header-App is "documentation as code" — it declares the architectural foundation (safe area, landmark, tokens) so that when a product defines app-level header content, the work is extending an existing component, not composing ad-hoc from Container-Base. Similar to Nav-TabBar-Base's empty badge composition slot in v1.

### Nav-Header-App Intent Statement

Nav-Header-App is the persistent, top-level chrome for a product's primary experience.

- **It orients, it doesn't navigate.** Nav-Header-Page has back/close because it's about movement within a flow. Nav-Header-App has no navigation actions because it *is* the top level — there's nowhere to go back to.
- **Its content is product-defined.** The design system can't predict what a product's top-level chrome needs. An email app needs search + compose. A social app needs notifications + profile. An e-commerce site needs cart + search. The component provides the structural frame; the product fills it.
- **It inherits the hard problems.** Safe area, landmark semantics, background treatment, token foundation — consistent regardless of what the product puts in the slots. Products don't re-solve these.
- **It covers all platforms.** On native, it's the bar on root tab destinations. On web, it's the site header. The structural differences (nav links on web, engagement actions on native) are product-level composition decisions, not component-level concerns.

### Why This Architecture

- **Primitive solves the hard problems once**: Safe area, background, layout, landmark semantics — implemented once in Nav-Header-Base, inherited by all variants
- **Semantic variants encode intent**: Product agents pick "app-level header" or "page-level header" — they don't configure raw slots
- **Extensible**: Future variants (Nav-Header-Search, Nav-Header-Modal) inherit the foundation without re-implementing safe area or landmark semantics
- **Web top-level header dissolves as a separate question**: It's a semantic variant (possibly Nav-Header-App on web, or a future Nav-Header-Site variant) — not a separate component family
- **Consistent with Stemma patterns**: Same inheritance model as Container-Base → Container-Card-Base

**Counter-argument**: The primitive's "leading/title/trailing" layout is already an opinion. If a future variant needs a fundamentally different layout (e.g., a search bar that replaces the title), the primitive's structure might be too rigid. Mitigation: the primitive's slots should be flexible enough that a variant can leave regions empty or replace their content — similar to how Container-Base's padding props can all be set to zero.

### Primitive Is Internal Only

Unlike Container-Base (which is valid for direct use), Nav-Header-Base is **never used directly by product agents**. It exists solely as the inheritance foundation for semantic variants. The primitive's slot-based API is too open — arbitrary slot content would bypass the structural guardrails (heading semantics, back button conventions, action constraints) that make the semantic variants consistent and accessible.

This means:
- `component-meta.yaml` for Nav-Header-Base should have `when_not_to_use: "Direct use in product screens — always use a semantic variant (Nav-Header-App, Nav-Header-Page)"`
- Composition rules should flag direct use of the primitive as a warning
- The family guidance should steer product agents exclusively to semantic variants

This is a departure from the general Stemma pattern where primitives are usable. The precedent is that some primitives are structural foundations only — similar to how Progress-Indicator-Node-Base is a building block for Stepper/Pagination, not used standalone.

### Proposed Primitive Props

```typescript
interface NavHeaderBaseProps {
  /** Content for the leading region (inline-start) */
  leadingSlot?: React.ReactNode;

  /** Content for the title region (center or after leading, per platform/config) */
  titleSlot?: React.ReactNode;

  /** Content for the trailing region (inline-end) */
  trailingSlot?: React.ReactNode;

  /** Visual style — affects background treatment */
  appearance?: 'opaque' | 'translucent';

  /** Bottom separator visibility */
  showSeparator?: boolean;

  /** Test identifier */
  testID?: string;
}
```

Semantic variants (Nav-Header-App, Nav-Header-Page) expose purpose-specific props and compose the primitive internally — similar to how Container-Card-Base exposes `interactive`, `onPress`, `padding` and composes Container-Base.

### Proposed Nav-Header-Page Props

```typescript
interface NavHeaderPageProps {
  /** Screen title */
  title: string;

  /** Leading action — back or menu */
  leadingAction?: LeadingAction;

  /** Trailing actions — global-context actions for the page */
  trailingActions?: TrailingAction[];

  /** Close action — always rendered at inline-end edge when present */
  closeAction?: { onPress: () => void; accessibilityLabel?: string };

  /** Visual style */
  appearance?: 'opaque' | 'translucent';

  /** Test identifier */
  testID?: string;
}

type LeadingAction =
  | { type: 'back'; accessibilityLabel?: string; onPress: () => void }
  | { type: 'menu'; onPress: () => void }
  | { type: 'custom'; icon: string; accessibilityLabel: string; onPress: () => void };

type TrailingAction = {
  icon: string;
  accessibilityLabel: string;
  onPress: () => void;
  badge?: number;
};
```

### Proposed Nav-Header-App Props

```typescript
interface NavHeaderAppProps {
  /** Content for the leading region — product-defined (logo, menu, etc.) */
  leadingContent?: React.ReactNode;

  /** Content for the center region — product-defined (title, logo, search, etc.) */
  centerContent?: React.ReactNode;

  /** Content for the trailing region — product-defined (actions, profile, etc.) */
  trailingContent?: React.ReactNode;

  /** Visual style */
  appearance?: 'opaque' | 'translucent';

  /** Test identifier */
  testID?: string;
}
```

Nav-Header-App's props are intentionally permissive — it's an architectural scaffold, not an opinionated component. The product defines what goes in each region. The value is in what it inherits from the primitive: safe area, background, landmark semantics, token foundation.

---

## Composition

### Internal Composition

| Component | Role |
|-----------|------|
| Icon-Base | Leading action icon, trailing action icons |
| Button-Icon | Trailing action tap targets |
| Badge-Count-Base | Optional badge on trailing actions |
| Badge-Count-Notification | Optional notification badge on trailing actions |

### Composition with Nav-TabBar-Base

The header and tab bar form the app shell together:
```
┌─────────────────────────┐
│  Nav-Header-Base        │  ← top
│  (title + actions)      │
├─────────────────────────┤
│                         │
│  Screen Content         │
│                         │
├─────────────────────────┤
│  Nav-TabBar-Base        │  ← bottom
│  (destination tabs)     │
└─────────────────────────┘
```

The header changes per destination (different title, different actions). The tab bar persists across destinations.

---

## Confirmed Decisions (Continued)

### D6: Medium Tertiary Button-Icon for Actions

All header actions (back, close, trailing actions) use Button-Icon at `size: 'medium'`, `variant: 'tertiary'`.

- **Visual**: 20px icon (`icon.size075`), no background, no border — chrome recedes
- **Touch target**: 48px total box (40px visual circle + 4px focus buffer each side) — meets `tapAreaRecommended`
- **Variant rationale**: Tertiary has no visible chrome. The navigation bar should feel lightweight — actions are present but don't compete with content.

### D7: Content-Driven Height, Sized to Touch Target

The bar's height is content-driven, not hard-coded. The floor is the medium Button-Icon's 48px total box.

**Height composition per platform**:
- **iOS**: No bar padding. Content height = 48px (Button-Icon box). Tertiary buttons have no visible chrome, so the bar feels compact. Title vertically centered within 48px.
- **Web**: No bar padding. Same as iOS — 48px content height.
- **Android**: `space.inset.100` (8px) vertical padding. Content height = 48 + 16 = 64dp. Aligns with Material 3 TopAppBar convention.

**Safe area inset**: Added above content by the primitive (platform-specific, not part of content height).

**Touch targets contained within the bar**. The 48px button box fits entirely within the bar's visual bounds.

Platform-specific padding is applied by the semantic variant (Nav-Header-Page), not the primitive.

### D8: Scroll Behavior — Fixed and Collapsible

Nav-Header-Page supports two scroll behaviors. Large title collapse deferred.

**Prop**: `scrollBehavior?: 'fixed' | 'collapsible'` (default: `'fixed'`)

**Fixed**: Bar stays put. Content scrolls underneath. Zero scroll coordination.

**Collapsible**: Bar hides on scroll down, reveals on scroll up.
- Scroll direction detection with ~8-10px threshold to prevent flicker
- Bar translates upward (off-screen) on hide, back to position on reveal
- Safe area remains protected — bar slides behind status bar, not above it
- Content reclaims the space when bar is hidden
- Animation uses motion tokens (duration + easing)
- Reduced motion: degrades to fixed (no animation, bar stays visible)

**Scroll context discovery (per platform)**:
- **iOS**: Native scroll observation (SwiftUI preference keys / UIScrollView delegate). Auto-discovers scroll context.
- **Android**: `NestedScrollConnection`. Auto-discovers scroll context.
- **Web**: `window` scroll as default (covers full-page scroll). Optional `scrollContainerRef` prop for nested scrollable containers. Tracks last scroll position for direction detection.

**Where it lives**: On Nav-Header-Page, not the primitive. The primitive is scroll-agnostic.

---

## Token Requirements (Preliminary)

| Category | Expected Tokens | Notes |
|----------|----------------|-------|
| Color | `color.structure.canvas`, `color.structure.border.subtle` | Background and bottom stroke (similar to TabBar top stroke) |
| Typography | `typography.labelMd` | Title typography — fontFamilyBody, fontSize100, lineHeight100, fontWeight500, letterSpacing100. Existing token, no creation needed (Ada R1). |
| Color | `color.action.navigation` | Title and icon color |
| Spacing | `space.inset.*` | Internal padding |
| Spacing | `space.grouped.*` | Gap between trailing actions |
| Typography | `fontSize*`, `fontWeight*`, `lineHeight*` | Covered by `typography.labelMd` composite token |
| Touch | `tapAreaMinimum`, `tapAreaRecommended` | Action button touch targets |
| Accessibility | `accessibility.focus.*` | Focus ring tokens |
| Motion | `duration*`, `easing*` | Large title collapse animation |
| Border | `borderDefault` | Bottom separator width (1px, references borderWidth100) |
| Blur | Resolved: Spec 089 (complete) | Translucent background uses unified blur primitives (`blur050`, `blur100`, `blur150`). Platform mapping is component-level: web `backdrop-filter`, iOS system materials, Android solid background. No semantic blur layer — primitives consumed directly by component tokens. |
| Spacing | ~~`space.inset.000`~~ | Not needed. Zero padding = absence of inset token reference, not an explicit zero token. Confirmed: schema does not require explicit inset reference when padding is zero. |

**Token gap resolved**: Spec 089 (Unified Blur Token Family) created 9 blur primitives (`blur000`–`blur250`). Nav-Header-Base's translucent appearance consumes these directly as component tokens. Platform mapping (web `backdrop-filter`, iOS system materials, Android solid background) is a component-level implementation concern handled in this spec's platform tasks. Kenya's R1 feedback on iOS material enum mapping (from 089 feedback) applies here.

---

## Accessibility

### Landmark Semantics

- **Web**: `<header role="banner">` with `<nav>` for action groups
- **iOS**: Treated as navigation bar by VoiceOver (automatic with UINavigationBar, manual with SwiftUI `.navigationBarTitleDisplayMode`)
- **Android**: Content description on the toolbar, TalkBack announces as navigation

### Back Button

- **Web**: `aria-label="Go back"` or `aria-label="Back to [previous screen]"` when label is provided
- **iOS**: VoiceOver announces "Back" or previous screen title
- **Android**: TalkBack announces "Navigate up"

### Heading Semantics

The title should be announced as a heading:
- **Web**: `<h1>` or `role="heading" aria-level="1"` (configurable — not all screens want h1)
- **iOS**: `.isHeader` accessibility trait
- **Android**: `heading()` semantics modifier

### Focus Order

Leading action → title (if focusable) → trailing actions (left to right). Tab key (web) follows this order. VoiceOver/TalkBack swipe follows this order.

---

## Scroll Behavior (Deferred to v2?)

Large title collapse on scroll is the most complex behavior. It requires:
- Scroll position observation from the content area
- Coordinated animation between title size, header height, and blur intensity
- Platform-specific scroll APIs (UIScrollView delegate on iOS, NestedScrollConnection on Android, IntersectionObserver or scroll event on web)

**Recommendation**: Ship v1 with `scrollBehavior: 'fixed'` only. Large title and collapsible behavior as v2. This matches the TabBar approach — v1 shipped without labels, labels deferred to Nav-TabBar-Labeled.

**Counter-argument**: Large title is a defining iOS convention. Shipping without it means the iOS implementation won't feel native for screens that expect it (settings, inbox, etc.). If we defer it, product agents will need an escape hatch for iOS screens that require large title behavior.

---

## Confirmed Decisions (Peter, 2026-03-29)

### D1: Custom Implementation (No Platform-Native Wrappers)

iOS and Android use custom implementations (SwiftUI View, Compose Composable) rather than wrapping UINavigationBar or Material TopAppBar. This gives full control over layout, animation, and token consumption. Trade-off: system behaviors (iOS swipe-back gesture, Android system back) must be implemented manually. Kenya and Data to confirm effort level.

### D2: No Previous Page Label on Back Button

Back button renders as a chevron icon only — no visible label showing the previous screen's title. Accessibility label provides screen reader context ("Back" or configurable override). Simplifies layout and avoids instability from long previous titles.

### D3: Close Button Position and Trailing Action Constraints

- Close button is always positioned at the inline-end edge (top-right in LTR)
- Trailing actions should be limited to global-context actions for the page's content (e.g., search, share) — not item-specific actions
- Back and close are the primary action buttons; other trailing actions are permissible when they apply to the page's global context

**Open**: Should close be a dedicated `closeAction` prop (always renders at edge, separate from trailing actions) or the last item in `trailingActions` with `type: 'close'`? Dedicated prop is semantically clearer; trailing array is simpler API.

### D4: Title Alignment — Configurable with Platform-Native Defaults

**Prop**: `titleAlignment?: 'center' | 'leading'`

**Defaults** (per platform):
- iOS: `'center'`
- Android: `'leading'`
- Web: `'leading'`

Products can override to achieve unified cross-platform identity (`'center'` everywhere) or follow platform convention (use defaults). The default respects each platform's native convention — products that want consistency opt in explicitly.

### D9: Heading Level Determined by Semantic Variant, Not Props

No `headingLevel` prop. Each semantic variant knows its context and renders the appropriate heading level internally.

| Variant | Heading Level | Rationale |
|---------|--------------|-----------|
| Nav-Header-Page | h1 | Page-level bar — the page's primary heading |
| Nav-Header-App | None | App-level bar — may not have a title (could be logo). No heading rendered. |
| Nav-Header-Modal (future) | h2 | Modal headers are subordinate to the page's h1 |

The primitive passes through whatever the variant provides. Product agents don't choose heading levels — the variant encodes the correct semantics for its context.

### D5: Semantic Variant Architecture

The top bar uses a primitive + semantic variant model following the Container-Base → Container-Card-Base pattern.

**Resolved**: The web site header is not a separate concern — it's Nav-Header-App on web. Nav-Header-App's permissive slot architecture accommodates both native app-level bars and web site headers. Responsive behavior (nav link collapse, hamburger menu) is a product-level composition concern, not a component-level concern.

The original question ("does web need two top bar components?") has been reframed as a cross-platform architecture question. All platforms have two top bar contexts:

- **App-level** (root destination): engagement actions, no back button
- **Page-level** (pushed/presented screen): back/close, contextual actions

These are modeled as semantic variants of a shared primitive (Nav-Header-Base → Nav-Header-App, Nav-Header-Page), following the Container-Base → Container-Card-Base pattern. See Architecture section above.

**Remaining open question**: Does the web top-level site header (logo, nav links, responsive collapse) fit as another semantic variant (Nav-Header-Site), or is it structurally different enough to be a separate component/spec? Peter to think on the actual requirements before deciding.

---

## Remaining Open Questions

1. **Component name**: `Nav-Header-Base` (matches family doc) or `Nav-TopBar-Base` (matches gap report language)?

2. **v1 scope**: Fixed header only (no scroll collapse, no large title)? Or include large title as a core feature? Kenya's input on iOS expectations would be valuable here.

3. **Blur token**: Formalize as a semantic token, or keep as platform-specific implementation detail? Two components needing blur (TabBar + Header) suggests a token is warranted. Flag for Ada.

4. **Heading level**: Configurable (`headingLevel?: 1 | 2 | 3`) or always h1? Nested navigation (header within a modal) might need h2.

5. **No disabled states**: Consistent with DesignerPunk philosophy. Unavailable actions are not rendered. Applies to leading action too — no disabled back button.

---

## DesignerPunk Philosophy Alignment

- **No disabled states**: Unavailable actions are not rendered, not disabled
- **Build-time platform separation**: Three platform files, shared types.ts
- **Token-first**: All spacing, color, typography from Rosetta tokens
- **Accessibility-first**: Landmark semantics, heading level, focus order, screen reader labeling
- **True Native**: Platform conventions respected — centered title on iOS, left-aligned on Android, not configurable
