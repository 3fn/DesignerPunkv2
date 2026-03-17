# Nav-TabBar-Base Component - Design Outline

**Date**: January 19, 2026
**Revised**: March 16, 2026 (Thurgood R2)
**Purpose**: Capture design decisions and token requirements before creating full spec
**Status**: Design Outline (Pre-Requirements) — Open questions blocking formalization (see § Open Questions)

> ⚠️ **REVISION NOTICE (2026-03-16, Thurgood R2)**: This outline has been substantially revised to incorporate:
> - Figma analysis data (`analysis/analysis-tab/`, `analysis/analysis-tab-bar/`)
> - Ada R1 token findings (confirmed primitives per mode, gradient pattern, icon color mapping)
> - Design changes confirmed by Peter: labels removed (icon-only v1), dot glide animation required, glow effect required
> - Feedback items F1–F25 from Thurgood R1, Lina R1, Ada R1
>
> Token references now use confirmed Figma primitive bindings where available. Semantic token references are deferred pending mode architecture work (see § Blocker B1 in feedback.md). Sections previously containing fictional wrkingClass placeholders have been corrected or flagged.

> ⚠️ **SCOPE CHANGE (2026-03-14)**: Originally scoped as Nav-BottomTabs-Base covering all platforms. After architectural review, split into two components:
> - **Nav-TabBar-Base** (this spec) — Mobile-first tab bar navigation. Icon-only with dot indicator, 3-5 items, safe area aware. Primary use: iOS and Android. Secondary: mobile web.
> - **Nav-Header-Base** (separate spec TBD) — Web-first header navigation. Label-primary, flexible item count, responsive, overflow-capable.
>
> Rationale: The behavioral contracts, interaction models, content patterns, and platform-native expectations diverge enough that a single component would require extensive runtime branching — counter to DesignerPunk's build-time platform separation philosophy.

---

## Component Overview

Nav-TabBar-Base is a primary navigation component that provides persistent access to top-level destinations in an app. It appears at the bottom of the screen and allows users to switch between major sections with a single tap.

**Key Characteristics**:
- **Primary navigation**: Top-level app destinations
- **Persistent**: Always visible during navigation
- **Icon-only (v1)**: Solid fill (active) / outline stroke (inactive) icon variants with dot indicator for active state. Labels deferred to future variant (Nav-TabBar-Labeled or similar).
- **Badge support**: Notification indicators via Badge family composition (scope pending — see OQ-6)
- **Glow effect**: Radial gradient behind tab items; prominent on active tab, subtle vignette on inactive tabs
- **Dot glide animation**: Animated indicator transition between tabs on selection change
- **Mobile-first**: Optimized for thumb-zone interaction on iOS, Android, and mobile web

**Platform Equivalents**:
- iOS: `UITabBar` / `TabView`
- Android: `BottomNavigationView` / `NavigationBar`
- Web: Custom floating bottom tab bar (mobile web contexts)

**Nav Family Context**:
- Family: Navigation (family 11 in Component-Inheritance-Structures.md — currently placeholder status)
- Sibling: Nav-SegmentedChoice-Base (in-context content switching — implemented, contracts defined)
- Related: Nav-Header-Base (web-first header navigation — separate spec TBD)

---

## Architecture

### Component Structure

```
Nav-TabBar-Base (Primitive)
├── Provides foundational tab bar navigation
├── Tab items with icon, dot indicator, glow gradient
├── Badge composition slot (via Badge family — scope pending OQ-6)
└── Semantic variants inherit from this

Future Semantic Variants:
├── Nav-TabBar-Floating (elevated floating bar)
├── Nav-TabBar-Minimal (icon-only, labels on selection)
└── Nav-TabBar-Labeled (icon + label — restores label support)
```

**Design Pattern**: Base primitive with semantic variants for specialized behaviors.

### Build-Time Resolution

Per DesignerPunk's True Native architecture and feedback F14:
- **Platform** (iOS/Android vs Web) is resolved at build time — different visual treatments (full-width anchored vs floating pill), not a runtime prop
- **Mode** (Day/Night) is resolved at theme level — not a component prop
- **Tab State** (Active/Inactive/Pressed) is a runtime concern handled by internal state

---

## Visual Specifications

### Container

> **Mode note**: Container values differ between Day and Night modes. Semantic token abstraction blocked on mode architecture (B1). Primitives listed per mode.

| Property | Day | Night | Notes |
|----------|-----|-------|-------|
| Background | `white100` | `gray400` | ⚠️ Not `color.structure.surface.primary` (resolves to `white200`). Needs mode-aware semantic token. |
| Top Stroke | `white200` | `gray500` | Peter approved `color.structure.border.subtle` semantically. Current definition doesn't match either value — needs mode update. |
| Position | Fixed to bottom | Fixed to bottom | See § Platform Position Behavior |

**Home Indicator**: OS-managed, not part of component surface. Implementation relies on OS safe area insets (iOS/Android) and `env(safe-area-inset-bottom)` + `--chrome-offset` (web). Figma Home Indicator frame uses Apple device-specific hard-coded values — not tokenizable. (F16)

#### Platform Position Behavior

| Platform | Behavior |
|----------|----------|
| **iOS** | Full-width, anchored to bottom. Safe area insets handled by OS. |
| **Android** | Full-width, anchored to bottom. Safe area insets handled by OS. |
| **Web (mobile)** | Floating pill above browser chrome. Dynamically tracks toolbar show/hide via Visual Viewport API. Rounded corners (`border-radius: 9999`), backdrop blur, inline margins. |
| **Web (desktop)** | Floating pill anchored to bottom (no browser chrome to track). |

**Web Dynamic Chrome Tracking (mobile web):**
- Uses `window.visualViewport` resize/scroll events to compute browser chrome offset: `window.innerHeight - visualViewport.height`
- Offset applied via CSS custom property `--chrome-offset` on the component host
- `transition: bottom 100ms ease-out` smooths the tracking (slight trail preferred over raw frame jumps)
- Floating gap: `space200` above the chrome offset
- Inline margins: `space200` left/right
- **Fallback**: If `visualViewport` is unavailable, `--chrome-offset` defaults to `0px` — bar falls back to static positioning above `env(safe-area-inset-bottom)`
- **Validated**: Tested in iOS Simulator Safari (2026-03-15). Demo: `demos/nav-tabbar-chrome-tracking-demo.html`

**Web Container Padding** (from Figma):

| Property | Token | Value |
|----------|-------|-------|
| Padding Top | `space050` | 4px |
| Padding Right | `space100` | 8px |
| Padding Bottom | `space150` | 12px |
| Padding Left | `space100` | 8px |
| Item Spacing | — | 8px (no token binding in Figma; needs mapping) |
| Border Radius | — | 9999 (full pill) |

**iOS/Android Container**: No padding on the container itself — tab items fill the content area. Home Indicator area is below the component boundary.

### Tab Item Layout

> **v1 is icon-only.** Labels are removed. Typography tokens (`fontSize: 13`, `lineHeight: ~20px`) from Figma don't map to the token scale and are moot for v1. Noted for future label variant (F25).

**Active Tab**:

| Property | Token | Value |
|----------|-------|-------|
| Padding Top | `space150` | 12px |
| Padding Right | `space150` | 12px |
| Padding Bottom | `space050` | 4px |
| Padding Left | `space150` | 12px |
| Item Spacing | `space050` | 4px (between icon and dot) |

**Inactive Tab**:

| Property | Token | Value |
|----------|-------|-------|
| Padding Top | `space200` | 16px |
| Padding Right | `space150` | 12px |
| Padding Bottom | `space100` | 8px |
| Padding Left | `space150` | 12px |
| Item Spacing | — | 0 (no dot, no label) |

**Padding Asymmetry**: The active tab has less top padding (`space150` vs `space200`) and less bottom padding (`space050` vs `space100`), creating a 4px (`space050`) upward shift that accommodates the dot indicator below the icon. This padding delta IS the icon "lift" — not a CSS transform. (F13, OQ-10 resolved)

**Item Spacing Discrepancy (F24)**: Day inactive = 0, Night inactive = `space025` (2px). Likely a Figma inconsistency — moot for v1 icon-only. Flagged for Peter.

### Tab Item States

> **Mode note**: Icon colors differ between Day and Night. The cyan primitives are intentionally inverted between icon fill and gradient center across modes — glow is softer in Day, more vivid in Night; icon does the opposite for legibility. (F20)

| State | Day Icon | Night Icon | Description |
|-------|----------|------------|-------------|
| **Active** | `cyan500` (solid fill) | `cyan100` (solid fill) | Selected tab — solid icon variant |
| **Inactive** | `gray300` (outline stroke) | `gray100` (outline stroke) | Default — outline icon variant |
| **Pressed** | TBD | TBD | Touch feedback — open question, not in Figma analysis |
| **Disabled** | TBD | TBD | Unavailable — not in Figma delivery |

**Icon Style**: Active tabs use "Icon Solid" (filled) variant. Inactive tabs use "Icon" (outline/stroke) variant. The icon swap between outline↔solid is part of the selection transition (choreography TBD — see OQ-4).

### Indicator Dot

4×4px circle below the icon in active state only. (F21)

| Property | Day | Night |
|----------|-----|-------|
| Fill | `cyan500` | `cyan100` |
| Size | 4×4px | 4×4px |

Same color as the active icon fill per mode. Positioned below icon with `space050` gap (the item-spacing value on active tabs).

### Tab Item Gradient Pattern

> All tab items — active AND inactive — have radial gradient backgrounds. This is not just an "active glow" — inactive tabs also use gradients for contrast protection when content scrolls behind the tab bar. (F17)

**Pattern**: Radial gradient, two stops:
- Stop 0% (center): accent color at 100% opacity
- Stop 100% (edge): tab bar container background at `opacity024` (24%)

| State | Day Center | Night Center | Edge Color |
|-------|-----------|-------------|------------|
| **Active** | `cyan100` | `cyan500` | Container background @ `opacity024` |
| **Inactive** | `white100` | `gray400` | Container background @ `opacity024` |

**Notes**:
- Edge color is always the tab bar container background for that mode
- `opacity024` exists in the opacity scale (value: `0.24`)
- Inactive gradients create a subtle same-color vignette (center = container background, so the gradient is nearly invisible — provides contrast protection without visual prominence)
- Active gradients create the visible glow effect (center = cyan accent, distinct from container background)
- Gradient is applied as the tab item background, not layered behind the icon
- Gradient radius/aspect ratio TBD from Figma (extractor didn't capture gradient geometry)
- Token structure recommendation: decomposed (only center color varies; edge = container background constant, edge opacity = `opacity024` constant). Final structure depends on animation choreography (OQ-2). (F11, OQ-9)

### Figma Errors (Disregard)

- **F22**: Night inactive label uses `color.gray500` (near-black on dark background = invisible). Moot for v1 (no labels). Flag to Figma maintainer.
- **F23**: Night inactive tab `color.teal200` stroke is a delivery error — strokes were turned off in design. Confirmed by Peter. Disregard.

---

## Animation Choreography

> **Status**: Dot glide animation is a v1 requirement (confirmed by Peter). Lina proposed a three-phase pattern borrowing from Nav-SegmentedChoice-Base's proven motion tokens. Several choreography questions remain open for Peter.

### Proposed Three-Phase Pattern (Lina R1, F12)

**Phase 1 (0ms)**: Departing tab
- Glow dims on departing tab (`duration150`, `easingAccelerate`)
- Departing icon begins settling down (padding shift to inactive values)

**Phase 2 (150ms)**: Dot glide
- Dot glides to new tab center (`duration350`, `easingGlideDecelerate`)
- Icon swap: outline→solid / solid→outline (method TBD — see OQ-4)

**Phase 3 (500ms)**: Arriving tab
- Arriving icon lifts up (padding shift to active values — `space050` delta)
- Glow brightens on arriving tab (`duration150`, `easingDecelerate`)

**Motion Tokens** (from Nav-SegmentedChoice-Base, proven):
- `duration150` — short phases (glow fade, icon lift)
- `duration350` — main glide
- `easingAccelerate` — departing motion
- `easingGlideDecelerate` — glide motion
- `easingDecelerate` — arriving motion

### Open Choreography Questions

- **OQ-1**: Does the glow bleed into adjacent tabs, or clip to tab bounds?
- **OQ-2**: Does the glow animate with the dot glide (dim/brighten), or snap as a static property of selected state?
- **OQ-3**: Should the icon lift overlap with the end of the glide (more fluid) or be strictly sequential (clearer phases)?
- **OQ-4**: Does the icon fill/outline swap happen as a crossfade during the glide, or as a snap at the midpoint?
- **OQ-5**: Is the padding asymmetry the complete icon lift, or is there an additional transform on top?

### Reduced Motion

All animation phases must respect `prefers-reduced-motion` (web), `isReduceMotionEnabled` (iOS), `ANIMATOR_DURATION_SCALE` (Android). When reduced motion is active, all transitions snap instantly — no animation phases execute.

---

## Token Requirements

### Confirmed Primitives (from Figma + Ada R1)

> These are the actual primitive tokens confirmed by Figma variable bindings and Ada's analysis. Semantic token abstraction is blocked on mode architecture (B1).

**Spacing** (confirmed via Figma bindings):
- `space050` (4px) — active tab bottom padding, icon-dot gap, icon lift delta
- `space100` (8px) — inactive tab bottom padding, web container inline padding
- `space150` (12px) — active tab top/inline padding, web container bottom padding
- `space200` (16px) — inactive tab top padding, web floating gap/margins

**Color — Day Mode** (confirmed via Figma bindings):
- `cyan500` — active icon fill, indicator dot
- `cyan100` — active gradient center
- `gray300` — inactive icon fill (outline stroke)
- `white100` — container background, inactive gradient center
- `white200` — container top stroke

**Color — Night Mode** (confirmed via Figma bindings):
- `cyan100` — active icon fill, indicator dot
- `cyan500` — active gradient center
- `gray100` — inactive icon fill (outline stroke)
- `gray400` — container background, inactive gradient center
- `gray500` — container top stroke

**Opacity**:
- `opacity024` (0.24) — gradient edge opacity

**Motion** (from Nav-SegmentedChoice-Base, proposed for reuse):
- `duration150` — short animation phases
- `duration350` — main glide
- `easingAccelerate` — departing motion
- `easingGlideDecelerate` — glide motion
- `easingDecelerate` — arriving motion

### Token Gaps

- **Mode-aware semantic tokens**: The token system cannot currently express different primitive references per mode. Every color property in this component needs mode branching. Blocked on mode architecture (B1).
- **Glow gradient geometry**: Radius and aspect ratio of the radial gradient not captured by Figma extractor. Needs manual extraction or Ada definition.
- **Pressed state colors**: Not in Figma analysis. Need definition.
- **Disabled state colors**: Not in Figma delivery. Need definition if disabled tabs are supported.
- **Badge tokens**: Dependent on badge scope decision (OQ-6). If in v1, Ada needs to define badge-related tokens alongside glow/animation tokens (OQ-12).
- **Web container item-spacing**: 8px value in Figma has no token binding. Needs mapping (likely `space100`).

### Premature Component Tokens (Removed)

The previous `bottomTabs.*` component token proposal has been removed per feedback F2. Component tokens are defined during implementation per Token Governance, not in the design outline. They require explicit human approval.

---

## Component API Design

> **Revision needed (F3)**: The original API used React-style patterns (`onTabChange`, JSX). DesignerPunk uses Web Component / True Native architecture with attribute-based patterns. The API should follow the pattern established by Nav-SegmentedChoice-Base's `types.ts`. API revision is Lina's domain — she will draft the `types.ts` during requirements/design phase.

**Expected API shape** (directional, not final):
- `tabs` / `segments` — array of tab item definitions
- `selectedValue` — currently selected tab
- Selection change callback
- `testID` — test automation
- Badge composition slot (if badges in v1 scope)

**Reference**: `src/components/core/Nav-SegmentedChoice-Base/types.ts` for the established pattern.

---

## Platform Behavioral Descriptions

> **Revision (F4)**: Full platform implementation code has been removed from the design outline. Implementation details belong in the design.md and platform-specific source files. Behavioral descriptions retained.

### Web (Mobile)
- Floating pill shape with `border-radius: 9999`, backdrop blur, inline margins (`space200`)
- Dynamic chrome tracking via Visual Viewport API
- `transition: bottom 100ms ease-out` for smooth toolbar follow
- Falls back to static positioning if `visualViewport` unavailable
- Keyboard navigation: Tab to focus, arrow keys between tabs, Enter/Space to select
- Focus ring using accessibility focus tokens (`:focus-visible`)

### Web (Desktop)
- Same floating pill visual treatment as mobile web
- No chrome tracking needed (no mobile browser toolbar)
- Full keyboard navigation support

### iOS
- Full-width, anchored to bottom
- Safe area insets handled natively by OS
- Haptic feedback on selection (implementation detail for design.md)

### Android
- Full-width, anchored to bottom
- Uses Material 3 `NavigationBar` as base, customized with DesignerPunk tokens
- Safe area insets handled by OS

---

## Accessibility

### Screen Readers
- Container announced as tab list (`role="tablist"` / equivalent)
- Each tab announced with accessible label and selected state (`role="tab"`, `aria-selected`)
- Badge count announced when present (e.g., "3 notifications") — pending OQ-6

### Keyboard Navigation (Web)
- Tab to focus the navigation (roving tabindex — selected tab gets `tabindex="0"`)
- Arrow keys to navigate between tabs (with wrapping)
- Enter/Space to select focused tab
- Focus ring visible on keyboard focus (`:focus-visible`)
- Tab from within control exits to next focusable element (not next tab)

### Touch Targets
- Minimum `tapAreaMinimum` touch target per tab
- Full width of tab item is tappable

### Reduced Motion
- All animation phases respect `prefers-reduced-motion` / platform equivalents
- Transitions snap instantly when reduced motion is active

### Icon Accessibility
- Each tab requires an `accessibilityLabel` since v1 is icon-only (no visible text label)
- Screen readers announce the accessibility label, not the icon name

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Icon-only for v1 | Peter's design direction. Labels deferred to future variant. |
| 2 | Dot indicator for active state | 4×4px circle below icon, same color as icon fill per mode. Clear, minimal active state signal. |
| 3 | Radial gradient on all tabs | Active: visible glow (cyan center). Inactive: subtle vignette (same-color center) for contrast protection against scrolling content. |
| 4 | Cyan inversion between icon and gradient across modes | Day: icon=`cyan500` (dark), gradient=`cyan100` (light). Night: icon=`cyan100` (light), gradient=`cyan500` (dark). Glow softer in Day, vivid in Night; icon does opposite for legibility. |
| 5 | Dot glide animation (v1 requirement) | Animated indicator transition between tabs. Three-phase choreography proposed, borrowing proven motion tokens from Nav-SegmentedChoice-Base. |
| 6 | Build-time platform separation | Web (floating pill) vs native (full-width anchored) are build-time variants, not runtime props. Mode (Day/Night) is theme-level. |
| 7 | Web: floating pill with dynamic chrome tracking | Mobile web tab bar tracks browser toolbar show/hide via Visual Viewport API. 100ms ease-out transition. Falls back to static positioning gracefully. Validated in iOS Simulator Safari (2026-03-15). |
| 8 | Web: visual divergence from native | Web gets floating pill (rounded, backdrop blur, inline margins) vs native anchored full-width bar. Justified: web must coexist with browser chrome. Behavioral contract (persistent bottom navigation) is preserved. |
| 9 | Safe area handling | iOS/Android: OS-managed. Web: `env(safe-area-inset-bottom)` + `--chrome-offset`. Home Indicator is OS-managed, not part of component. |
| 10 | 3-5 tabs recommended | UX best practice. Enforcement method TBD — validation contract or guidance only (F8). |
| 11 | Badge via composition | Compose with Badge family components (Badge-Count-Base, Badge-Count-Notification) rather than reimplementing. Scope pending OQ-6. |
| 12 | Outline↔solid icon swap on selection | Active = solid fill icon. Inactive = outline stroke icon. Swap method (crossfade vs snap) pending OQ-4. |

---

## Future Enhancements (Separate Specs)

1. **Nav-TabBar-Labeled**: Restores icon + label layout (uses the typography tokens that are moot for v1)
2. **Nav-TabBar-Floating**: Elevated floating bar with rounded corners (for native platforms)
3. **Nav-TabBar-Minimal**: Icon-only, labels appear on selection
4. **Nav-Header-Base**: Web-first header navigation (separate component, separate spec)

---

## Open Questions

> **Status**: These questions must be resolved before formalization to requirements.md/design.md/tasks.md. Organized by owner.

### Peter

- **OQ-1 (Glow scope)**: Does the active tab glow bleed into adjacent tabs, or is it clipped to the tab's bounds? → feedback.md [LINA R1] F11
- **OQ-2 (Glow animation)**: Does the glow animate with the dot glide (dims at departing, brightens at arriving), or snap as a static property of selected state? → feedback.md [LINA R1] F11
- **OQ-3 (Icon lift timing)**: Should the icon lift overlap with the end of the dot glide (more fluid) or be strictly sequential (clearer phases)? → feedback.md [LINA R1] F12
- **OQ-4 (Icon swap style)**: Does the icon fill/outline swap happen as a crossfade during the glide, or as a snap at the midpoint? → feedback.md [LINA R1] F12
- **OQ-5 (Padding vs lift)**: Is the active/inactive padding asymmetry (F13) the icon lift animation itself, or is there an additional transform on top? → feedback.md [LINA R1] F13
- **OQ-6 (Badge scope)**: Badge support is listed as a key characteristic of this component. Figma delivery did not include badge variants — are badges in v1 scope or deferred? Explicit decision needed. → feedback.md [LINA R1] re: badge deferment assumption

### Ada

- **OQ-7 (Glow color definition)**: ✅ RESOLVED (2026-03-16). Distinct primitives per mode. Day active: `cyan100` center. Night active: `cyan500` center. Inactive tabs also use radial gradients. → feedback.md [ADA R1] F17, F20
- **OQ-8 (Glow color stops)**: ✅ RESOLVED (2026-03-16). Radial gradient, two stops: center at 100% → container background at `opacity024`. Gradient radius/aspect ratio still TBD. → feedback.md [ADA R1]
- **OQ-9 (Glow token structure)**: ✅ RESOLVED (2026-03-16). Decomposed recommended. Final structure depends on animation choreography (OQ-2). → feedback.md [ADA R1]
- **OQ-10 (Icon lift spacing)**: ✅ RESOLVED (2026-03-16). `space050` (4px). Padding delta, not a transform. → feedback.md [ADA R1]
- **OQ-11 (Full token pass)**: ⏸️ BLOCKED on mode architecture. Partial mapping complete. Full pass resumes after mode support is implemented. → feedback.md [ADA R1] B1
- **OQ-12 (Badge tokens)**: ⏸️ Dependent on OQ-6. No badge data in Figma delivery.

### Lina (pending Ada token resolution + Peter answers above)

- **OQ-13 (Badge composition)**: Confirm composition with Badge family components vs internal rendering. Deferred pending OQ-6 resolution. → feedback.md [LINA R1] re: F6
- **OQ-14 (Behavioral contracts)**: Draft contracts during requirements phase. Blocked on animation choreography answers (OQ-2 through OQ-5) and glow token definitions. → feedback.md [LINA R1] re: F7

---

## Next Steps

1. ✅ **Design outline created** — Decisions documented
2. ✅ **Initial review** — Thurgood R1 + Lina R1 feedback captured
3. ✅ **Ada R1 token analysis** — Figma analysis reviewed, glow/gradient pattern resolved, icon colors mapped, mode architecture gap identified
4. ✅ **Thurgood R2** — Design outline revised to incorporate all findings, corrected token references, removed placeholder content
5. ⏳ **Resolve remaining open questions** — Peter answers OQ-1 through OQ-6
6. ⛔ **BLOCKED: Mode architecture** — Token system lacks mode-differentiated semantic tokens. Spec formalization paused pending mode architecture work (separate spec). See feedback.md [ADA R1] B1.
7. ⏳ **Ada R2** — Complete full token pass (OQ-11) after mode architecture is implemented
8. ⏳ **Lina R2** — After token resolution and Peter's animation choreography answers
9. ⏳ **Create requirements.md** — EARS format
10. ⏳ **Create design.md** — Detailed architecture
11. ⏳ **Create tasks.md** — Implementation plan

---

**Organization**: spec-guide
**Scope**: 050-nav-tabbar-base
