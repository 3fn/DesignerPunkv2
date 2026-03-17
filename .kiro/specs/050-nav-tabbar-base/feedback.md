# Spec Feedback: Nav-TabBar-Base

**Spec**: 050-nav-tabbar-base
**Created**: 2026-03-13

> **Note (2026-03-14)**: Component renamed from Nav-BottomTabs-Base to Nav-TabBar-Base. Web-first header navigation split to separate spec (Nav-Header-Base, TBD). Feedback below still applies to the renamed component.

---

## Design Outline Feedback

### Context for Reviewers

- Scope change: mobile tab bar only (iOS, Android, mobile web). Web header nav split to Nav-Header-Base → design-outline.md § "SCOPE CHANGE"
- Web uses floating pill with dynamic chrome tracking via Visual Viewport API → design-outline.md § "Platform Position Behavior"
- Visual divergence between web (floating pill) and native (anchored full-width) is intentional → design-outline.md § "Design Decisions Summary" #8
- Token references are acknowledged placeholders from wrkingClass prototype → design-outline.md § "PLACEHOLDER NOTICE"
- **Design change (2026-03-16)**: Labels removed. Icon-only with dot indicator for v1. Confirmed by Peter.
- **Design change (2026-03-16)**: Dot glide animation between tabs is a requirement, not deferred. Confirmed by Peter.
- **Design change (2026-03-16)**: Glow effect on active tab required for both Day and Night modes. Token definition needed from Ada. Confirmed by Peter.
- **Correction (2026-03-16)**: Badge deferment was assumed from Figma delivery absence, not authorized by Peter. Badge scope is an open question requiring explicit decision. See design-outline.md § Open Questions OQ-6.
- **Correction (2026-03-16)**: Night inactive tab `color.teal200` stroke is a Figma delivery error (strokes turned off in design, data carried over). Disregard. See feedback.md [ADA R1] F23.
- **Blocker (2026-03-16)**: Spec formalization paused — token system lacks mode-differentiated semantic tokens. Mode architecture work required before full token pass and formalization can proceed. See feedback.md [ADA R1] B1.

---

#### [THURGOOD R1]

**Overall Assessment**: The outline captures the right component concept and has solid accessibility thinking. However, nearly every token reference is fictional — the placeholder notice is accurate. The API design makes assumptions about patterns (callback props, JSX-style usage) that don't match DesignerPunk's Web Component / True Native architecture. Needs significant revision before formalization.

**Critical:**

- F1. Token references are almost entirely fictional. Of ~14 references, only `space050` and `icon.size200` exist. Full list of mismatches documented. → design-outline.md § "Token Requirements"
  - **Action**: Full token pass required. Ada should review and map to actual tokens.
- F2. Component token proposal (`bottomTabs.*`) is premature. Per Token Governance, these would be component tokens requiring human approval. → design-outline.md § "New Semantic Tokens"
  - **Action**: Remove section. Component tokens defined during implementation per Token Governance.
- F3. API uses React-style patterns (`onTabChange`, JSX). Should follow `types.ts` Web Component pattern. → design-outline.md § "Component API Design"
  - **Action**: Revise API to match DesignerPunk's attribute-based pattern. Reference Nav-SegmentedChoice-Base's `types.ts`.
- F4. Full platform implementations don't belong in a design outline. → design-outline.md § "Platform Considerations"
  - **Action**: Replace code with behavioral descriptions. Keep platform-specific notes.

**Moderate:**

- F5. Hard-coded pixel values (`56px`, `64px`, `168px`, `16px`, `44px`, `1px`) should reference tokens. → design-outline.md § "Visual Specifications"
  - **Action**: Map all pixel values to existing tokens or flag as needing new tokens.
- F6. Badge integration unclear — should compose with existing Badge family components, not reimplement. → design-outline.md § "Badge"
  - **Action**: Clarify composition vs internal rendering. Composition preferred per Stemma.
- F7. Missing behavioral contracts. `contracts.yaml` must be authored before platform implementation. → design-outline.md (absent)
  - **Action**: Add section listing expected contracts using `{category}_{concept}` naming.

**Minor:**

- F8. "3-5 tabs recommended" not enforced — validation contract or guidance? → design-outline.md § "Design Decisions Summary" #6
- F9. Future variants (Floating, Minimal, Adaptive) are speculative — fine as future direction, shouldn't influence base design. → design-outline.md § "Future Enhancements"
- F10. Missing Nav family context — no reference to Navigation family doc or Nav-SegmentedChoice-Base as sibling. → design-outline.md § "Architecture"

**Recommended Revision Order:**
1. ✅ [@ADA] Full token mapping pass — Ada R1 completed (2026-03-16). Partial mapping; blocked on mode architecture.
2. ⏳ [@PETER] API design revision — deferred to Lina during requirements/design phase. Web Component pattern required.
3. ⏳ [@LINA] Badge composition decision + behavioral contracts identification — blocked on OQ-6 and animation answers.
4. ✅ [@THURGOOD] Re-review after revisions — Thurgood R2 completed (2026-03-16). Design outline revised.

---

#### [LINA R1]

**@ Mention Responses:**

- Re: [@LINA] Badge composition decision + behavioral contracts identification -- [THURGOOD R1]
  - Badge composition: Agree — Nav-TabBar-Base should compose with existing Badge family components (Badge-Count-Base, Badge-Count-Notification) rather than reimplementing badge rendering. This is consistent with Stemma composition principles. Note: badge variants were not included in the Figma delivery; badge scope requires explicit decision from Peter (see design-outline.md § Open Questions OQ-6). Composition analysis deferred pending that decision.
  - Behavioral contracts: Will draft during requirements phase. Key contracts expected: `interaction_pressable`, `interaction_noop_active`, `animation_coordination` (dot glide), `visual_state_colors`, `accessibility_aria_roles`, `layout_flexible_length`. Will reference Nav-SegmentedChoice-Base's contracts as the structural model.

**Feedback (source: Figma analysis `analysis/analysis-tab/`, `analysis/analysis-tab-bar/`):**

- F11. Glow effect on active tab needs token definition before implementation. Visible in all four Tab Bar Figma variants but not captured in token analysis (no Figma variable bindings). → design-outline.md § "Tab Item States"
  - [@ADA] Color definition: Day mode shows subtle light cyan wash; Night mode shows prominent cyan glow. Same gradient at different opacities, or distinct definitions? -- [LINA R1]
  - [@ADA] Color stops: What are the specific color values, stop positions, and radius? Figma gradients need decomposing into tokenizable values. -- [LINA R1]
  - [@ADA] Token structure: Single composite token (like `shadow.navigation.indicator`) or decomposed into color + radius + opacity? -- [LINA R1]
  - [@PETER] Scope: Does the glow bleed into adjacent tabs, or is it clipped to the tab's bounds? -- [LINA R1]
  - [@PETER] Animation coordination: Does the glow animate with the dot glide (dims at departing, brightens at arriving), or snap as a static property of selected state? -- [LINA R1]
  - Reduced motion: If the glow animates, it must respect `prefers-reduced-motion` — snap instead of fade.
  - **Action**: Ada to define glow tokens. Lina blocked on glow implementation until tokens exist.

- F12. Dot glide animation choreography — proposed three-phase pattern borrowing from Nav-SegmentedChoice-Base's proven motion tokens (`duration150`, `duration350`, `easingGlideDecelerate`). → design-outline.md § "Design Decisions Summary"
  - Proposed phases:
    - Phase 1 (0ms): Glow dims on departing tab (`duration150`, `easingAccelerate`). Departing icon begins settling down.
    - Phase 2 (150ms): Dot glides to new tab center (`duration350`, `easingGlideDecelerate`). Icon swap: outline→solid / solid→outline.
    - Phase 3 (500ms): Arriving icon lifts up (`duration150`, `easingDecelerate`). Glow brightens on arriving tab.
  - [@PETER] Should the icon lift overlap with the end of the glide (more fluid) or be strictly sequential (clearer phases)? -- [LINA R1]
  - [@PETER] Does the icon fill/outline swap happen as a crossfade during the glide, or as a snap at the midpoint? -- [LINA R1]
  - [@ADA] Icon lift distance needs a spacing token — likely `space050` or `space025`. Does one of these fit semantically? -- [LINA R1]
  - **Action**: Peter to confirm choreography direction. May need motion prototyping before finalizing.

- F13. Active tab padding asymmetry confirmed by Figma analysis. → design-outline.md § "Tab Item Layout"
  - Active: `space150` top, `space150` inline, `space050` bottom, `space050` item-spacing
  - Inactive: `space200` top, `space150` inline, `space100` bottom, `0` item-spacing
  - Asymmetry accommodates dot indicator below icon in active state.
  - [@PETER] Is the padding shift the icon lift animation, or is there an additional transform on top? -- [LINA R1]

- F14. Figma variant structure vs Stemma architecture — Figma analysis recommends single component with variant prop. → design-outline.md § "Architecture"
  - Platform (iOS & Android vs Web) represents genuinely different visual treatments: full-width anchored vs floating pill (`border-radius: 9999`). These map to build-time platform separation, not a runtime prop.
  - Mode (Day/Night) is theme-driven, not a prop.
  - Tab State (Active/Inactive/Pressed) IS a runtime concern handled by internal state.
  - **Action**: Design outline should clarify Platform and Mode are resolved at build time and theme level, not component props.

- F15. Figma "State" variant on Tab component is confirmed as "Pressed." → Figma component `Tab` (1888:1195)
  - **Action**: Correct Figma variant naming from "State" to "Pressed" for clarity.

- F16. Home Indicator is a conceptual artifact only — not part of component surface. → design-outline.md § "Container"
  - Implementation relies on OS safe area insets (iOS/Android) and `env(safe-area-inset-bottom)` + `--chrome-offset` (web).
  - Figma Home Indicator frame uses device-specific hard-coded values (`padding: 21/129/8/129`) — these are Apple's values, not tokenizable.
  - **Action**: Annotate Home Indicator in design outline as "OS-managed, not part of component."

---

#### [ADA R1]

**@ Mention Responses:**

- Re: [@ADA] Full token mapping pass — replace all fictional tokens with actual system tokens -- [THURGOOD R1]
  - Confirmed: nearly all token references in the design outline are wrkingClass placeholders. Full mapping pass started (see findings below). **Blocked on mode architecture** — the token system does not currently support mode-differentiated semantic tokens. Primitives have light/dark slots in their data structure but all resolve to identical values in both modes. Semantic tokens have no mode-branching mechanism. This component requires mode-aware tokens for nearly every visual property. See § Blocker below.

- Re: [@ADA] Glow color definition (Day vs Night) -- [LINA R1] F11
  - **Resolved with Peter (2026-03-16).** Not same-gradient-different-opacity. Different primitive tokens per mode:
    - Day active gradient center: `cyan100` (`rgba(204, 251, 255, 1)`) at 100%
    - Night active gradient center: `cyan500` (`rgba(0, 136, 143, 1)`) at 100%
  - Figma extractor did not capture gradient/shadow effects — only fills and layout. Gradient data obtained from Peter via Figma screenshot.

- Re: [@ADA] Glow color stops -- [LINA R1] F11
  - **Resolved with Peter (2026-03-16).** Radial gradient, two stops:
    - Stop 0% (center): accent color at 100% opacity
    - Stop 100% (edge): tab bar background color at `opacity024` (24%)
  - Edge color is always the tab bar container background. `opacity024` exists in the opacity scale (`0.24`).
  - Gradient is applied as the **tab item background**, not layered behind the icon.

- Re: [@ADA] Glow token structure (composite vs decomposed) -- [LINA R1] F11
  - **Recommendation: decomposed.** The gradient is structurally simple — only the center color varies per state and mode. The edge color is always the container background, and the edge opacity is always `opacity024`. A composite token would over-package what is essentially one variable (center color) plus constants.
  - **Counter-argument**: If the glow needs to animate (dim/brighten during dot glide per OQ-2), decomposed gives Lina independent control over opacity/color channels during transitions. If it snaps, composite would suffice. Animation choreography answers (OQ-1–4) determine the final call.

- Re: [@ADA] Icon lift spacing token -- [LINA R1] F12
  - **Resolved: `space050` (4px).** Confirmed by Figma analysis — the lift is the delta between inactive `space200` (16px) and active `space150` (12px) top padding. Not a transform; it's a padding shift.

**Feedback (source: Figma analysis, token system audit, Peter clarifications 2026-03-16):**

- F17. **All tab item gradients use the same structural pattern.** Not just active glow — inactive tabs also have radial gradients for contrast protection (content scrolls behind the tab bar). → design-outline.md § "Tab Item States" (not currently documented)
  - Pattern: radial gradient, center color at 100% → tab bar background at `opacity024`
  - Active Day: center = `cyan100`
  - Active Night: center = `cyan500`
  - Inactive Day: center = `white100` (= tab bar background, creating subtle same-color vignette)
  - Inactive Night: center = `gray400` (= tab bar background, same-color vignette)
  - **Action**: Add gradient pattern to design outline for all states, not just active glow.

- F18. **Tab bar container background values identified.** → design-outline.md § "Container"
  - Day: `white100` (`rgba(255, 255, 255, 1)`)
  - Night: `gray400` (`rgba(24, 34, 40, 1)`)
  - Design outline placeholder `color.surface.primary` is incorrect — `color.structure.surface.primary` resolves to `white200`, not `white100`.
  - **Action**: Correct container background reference. Requires mode-aware token (see § Blocker).

- F19. **Tab bar top stroke values identified.** → design-outline.md § "Container"
  - Day: `white200` (solid)
  - Night: `gray500` (solid)
  - Peter approved using `color.structure.border.subtle` semantically. Current definition (`gray100 @ opacity048`) doesn't match either value, but semantic intent aligns. Night mode value needs updating when mode architecture supports it.
  - **Action**: Reference `color.structure.border.subtle` in outline. Note mode gap.

- F20. **Icon color mapping confirmed from Figma.** → design-outline.md § "Tab Item States"
  - Active Day icon: `cyan500` (`rgba(0, 136, 143, 1)`)
  - Active Night icon: `cyan100` (`rgba(204, 251, 255, 1)`)
  - Inactive Day icon: `gray300` (`rgba(38, 50, 58, 1)`)
  - Inactive Night icon: `gray100` (`rgba(178, 188, 196, 1)`)
  - Note: icon fill and gradient center use the same two cyan primitives but **inverted** between modes. Day icon = `cyan500`, day gradient = `cyan100`. Night icon = `cyan100`, night gradient = `cyan500`. Intentional — glow is softer in day, more vivid in night; icon does the opposite for legibility.
  - Design outline placeholders (`color.interactive.primary`, `color.content.tertiary`) are incorrect.
  - **Action**: Replace placeholder color tokens with actual primitives. Requires mode-aware semantic tokens for proper abstraction.

- F21. **Indicator dot (Ellipse 1) needs explicit token definition.** → design-outline.md § "Tab Item Layout" (not currently documented as distinct element)
  - 4×4px circle below icon in active state
  - Day: `cyan500`, Night: `cyan100` (same as icon fill per mode)
  - **Action**: Add indicator dot to visual specifications with size and color tokens.

- F22. **Night inactive label color is a Figma error.** → Figma component `Tab` (1888:1195), State=Inactive, Mode=Night
  - Label text uses `color.gray500` (`rgba(16, 22, 26, 1)`) — near-black on dark background = invisible.
  - Moot for v1 (labels removed), but should be corrected in Figma source for future label variants.
  - [@PETER] Flag to Figma maintainer for correction. No spec impact for v1. -- [ADA R1]

- F23. **Night inactive tab `color.teal200` stroke is a Figma delivery error.** → Figma component `Tab` (1888:1195), State=Inactive, Mode=Night
  - Peter confirmed (2026-03-16): strokes were turned off in design but carried over in delivery data. Not part of the design.
  - [@PETER] Flag to Figma maintainer for cleanup. Disregarded for spec purposes. -- [ADA R1]

- F24. **Inactive tab item-spacing discrepancy between Day and Night.** → Figma component `Tab` (1888:1195)
  - Day inactive: `item-spacing: 0`
  - Night inactive: `item-spacing: space025` (2px)
  - Active (both modes): `item-spacing: space050` (4px)
  - Likely a Figma inconsistency (Night inactive should also be 0 since labels are removed and no dot is shown). Moot for v1 icon-only, but worth noting.
  - [@PETER] Confirm this is a Figma inconsistency. Low priority — padding structure will be optimized for animation per Peter's direction. -- [ADA R1]

- F25. **Font size 13px and line-height ~20px don't map to token scale.** → Figma component `Tab` (1888:1195), text node "Item 1"
  - `fontSize: 13` — no matching fontSize token. Extractor incorrectly suggested `icon.size050`.
  - `lineHeight: 19.99px` — out of tolerance for all lineHeight tokens.
  - Moot for v1 (labels removed). If labels return in a future variant, these values need deliberate token mapping.
  - **Action**: No action for v1. Note for future label variant.

**Blocker:**

- **B1. Mode architecture gap blocks full token pass.** → affects F18, F19, F20, F21, and all component token creation
  - The token system does not currently support mode-differentiated semantic tokens. Primitives have `light`/`dark` slots but all resolve identically. The `SemanticToken` interface has no mode-branching on `primitiveReferences`.
  - Nav-TabBar-Base requires different primitive references per mode for: container background, top stroke, icon colors, gradient center colors, indicator dot color.
  - The existing `wcagValue` pattern on `primitiveReferences` is a precedent for conditional resolution (theme-based). Mode support would be an analogous extension.
  - **Decision (Peter, 2026-03-16)**: Pause spec formalization. Prioritize mode architecture work. Resume 050 after mode support is implemented.
  - **Action**: Spec formalization blocked. Design outline updates can proceed (Thurgood). Mode architecture spec to be created separately.

---

#### [THURGOOD R2]

**Revision Summary (2026-03-16)**: Design outline substantially rewritten. This is not a new feedback round — it's the revision pass that R1 called for.

**What Changed:**
- Replaced placeholder notice with revision notice documenting all incorporated feedback
- Updated Component Overview: icon-only v1, labels removed, glow and dot glide as key characteristics
- Added Nav family context (family 11, sibling reference to Nav-SegmentedChoice-Base)
- Added build-time resolution section (Platform and Mode are not runtime props) — F14
- Rewrote Visual Specifications with Figma-confirmed primitives per mode — F1, F18, F19, F20
- Added indicator dot section with size and color tokens — F21
- Added tab item gradient pattern section documenting all four state/mode combinations — F17
- Added animation choreography section with Lina's proposed three-phase pattern and open questions — F12
- Removed premature `bottomTabs.*` component token proposal — F2
- Replaced Token Requirements with confirmed primitives from Figma bindings + token gaps list
- Noted API revision needed, deferred to Lina (Web Component pattern required) — F3
- Replaced full platform implementation code with behavioral descriptions — F4
- Added Home Indicator clarification (OS-managed, not part of component) — F16
- Documented Figma errors to disregard (F22 invisible label, F23 teal stroke)
- Updated accessibility section for icon-only (accessibilityLabel required per tab)
- Revised Design Decisions Summary to reflect current state (12 decisions)
- Updated Open Questions with resolved items marked ✅
- Updated Next Steps with Thurgood R2 marked complete

**What Was NOT Changed (intentionally):**
- Open Questions OQ-1 through OQ-6 remain open — these are Peter's decisions
- No semantic tokens were proposed — blocked on mode architecture (B1)
- No component tokens were proposed — per Token Governance, defined during implementation
- API was not rewritten — that's Lina's domain
- Behavioral contracts were not drafted — that's Lina's domain, blocked on OQ-2 through OQ-5

**Feedback Items Addressed:**
- F1 (fictional tokens) → replaced with confirmed Figma primitives
- F2 (premature component tokens) → removed
- F3 (React-style API) → flagged for Lina revision, reference to SegmentedChoice pattern added
- F4 (full platform implementations) → replaced with behavioral descriptions
- F5 (hard-coded pixel values) → mapped to tokens where Figma bindings exist, gaps documented
- F6 (badge composition) → noted as composition approach, scope pending OQ-6
- F7 (missing behavioral contracts) → deferred to Lina, blocked on animation answers
- F10 (missing Nav family context) → added
- F11 (glow token definition) → gradient pattern fully documented from Ada R1
- F12 (dot glide choreography) → section added with Lina's proposal and open questions
- F13 (padding asymmetry) → documented with resolved OQ-10
- F14 (build-time resolution) → section added
- F16 (Home Indicator) → clarified as OS-managed
- F17 (all-tab gradients) → full gradient pattern table added
- F18 (container background) → corrected per mode with primitives
- F19 (top stroke) → corrected per mode
- F20 (icon colors) → full state/mode table with cyan inversion noted
- F21 (indicator dot) → section added
- F22, F23 (Figma errors) → documented as disregard
- F24 (item-spacing discrepancy) → noted in tab item layout
- F25 (font size/line-height mismatch) → noted as moot for v1

**Items NOT addressed (out of scope for R2):**
- F8 (3-5 tabs enforcement) → noted in decisions, method TBD
- F9 (speculative future variants) → kept as future direction, doesn't influence base design
- F15 (Figma "State" variant naming) → Figma-side correction, not a spec issue

---

## Requirements Feedback

### Context for Reviewers

- [Pending — requirements.md not yet created]

---

## Design Feedback

### Context for Reviewers

- [Pending — design.md not yet created]

---

## Tasks Feedback

### Context for Reviewers

- [Pending — tasks.md not yet created]
