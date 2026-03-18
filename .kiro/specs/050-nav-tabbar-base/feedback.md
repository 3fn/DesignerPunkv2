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
- **Blocker CLEARED (2026-03-17)**: Mode architecture implemented in Spec 080. Two-level resolution system (SemanticOverrideResolver + SemanticValueResolver) supports mode-differentiated semantic tokens. Full token pass (Ada R2) can proceed. B1 resolved.

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

#### [ADA R2]

**Date**: 2026-03-17
**Context**: Full token pass (OQ-11). Mode architecture (Spec 080) now implemented. All choreography questions resolved (Peter R1).

**Final Token Mapping for Nav-TabBar-Base:**

**Reuse existing semantic tokens (3) — add Level 2 dark overrides in `SemanticOverrides.ts`:**

| Token | Day (base) | Dark Override | Role |
|-------|-----------|---------------|------|
| `color.structure.canvas` | `white100` | → `gray400` | Container background + inactive gradient center |
| `color.action.navigation` | `cyan500` | → `cyan100` | Active icon fill + indicator dot |
| `color.background.primary.subtle` | `cyan100` | → `cyan500` | Active gradient center |

**Modify existing composite token (1) — Level 2 dark override on color component:**

| Token | Day (base) | Dark Override | Role |
|-------|-----------|---------------|------|
| `color.structure.border.subtle` | `gray100 @ opacity048` | → `gray500 @ opacity048` | Container top stroke |

**New semantic token (1) — approved by Peter:**

| Token | Day Primitive | Dark Override | Role |
|-------|--------------|---------------|------|
| `color.icon.navigation.inactive` | `gray300` | → `gray100` | Inactive icon fill |

Scoped to navigation contexts (Nav-TabBar, Nav-Header, nav family). Not `color.icon.inactive` — the specific gray values are tuned for nav-on-canvas contrast and shouldn't promise universal applicability. Blend token alternatives explored (all 4 directions × 5 levels, chained desaturate+darken, opacity compositing) — none approach the target neutral grays from saturated cyan. These are independent color roles, not blend-derivable states.

**Mode-invariant (no override needed):**

| Primitive | Value | Role |
|-----------|-------|------|
| `opacity024` | `0.24` | Gradient edge opacity |

**Spacing tokens (confirmed, unchanged from R1):**
- `space050`, `space100`, `space150`, `space200` — all confirmed via Figma bindings

**Motion tokens (confirmed, unchanged from R1):**
- `duration150`, `duration350`, `easingAccelerate`, `easingGlideDecelerate`, `easingDecelerate`

**Blocker B1 Status**: CLEARED. Spec 080 delivered two-level mode resolution. These overrides will be the first active Level 2 entries in the system.

**Next**: Implement overrides (Spec 080 Task 4 + Task 7 proof case). Create `color.icon.navigation.inactive` in semantic registry.

---

#### [PETER R1]

**Date**: 2026-03-17
**Context**: Resolving open questions OQ-1 through OQ-6 after Spec 080 mode architecture implementation.

**OQ-1 (Glow scope)**: Glow bleeds into adjacent tabs — no clipping. "I don't mind if it bleeds." Ada assessment: bleed is simpler to implement (no overflow hidden or masking), produces more organic visual result.

**OQ-2 (Glow animation)**: Dims at departing tab, brightens at arriving tab. Confirms decomposed token structure — glow opacity must be independently animatable during transition phases.

**OQ-3 (Icon lift timing)**: Slight overlap with end of dot glide. More fluid feel than strictly sequential phases.

**OQ-4 (Icon swap style)**: Icon outline→solid swap happens when the arriving glow animates in (Phase 3). Snap, not crossfade during glide.

**OQ-5 (Padding vs lift)**: Figma padding asymmetry is a construction artifact of building components in Figma, not prescribed implementation. Any mechanism (transform, padding, flex) that achieves the same visual result is acceptable, as long as it aligns with DesignerPunk principles and patterns.

**OQ-6 (Badge scope)**: Badges deferred from v1. Condition: structure must support adding badges later as a light effort. Ada assessment: Stemma composition with Badge family components (Badge-Count-Base, Badge-Count-Notification) via a named slot on the tab item makes future integration lightweight. Tab item structure should include a composition slot placeholder. No badge tokens needed for v1.

**Impact on Blocked Items:**
- OQ-11 (Full token pass): UNBLOCKED — mode architecture (Spec 080) implemented + all choreography questions answered
- OQ-12 (Badge tokens): RESOLVED — deferred per OQ-6
- OQ-13 (Badge composition): RESOLVED — deferred, slot placeholder only
- OQ-14 (Behavioral contracts): UNBLOCKED — choreography answers available for Lina

---

#### [LINA R2]

**Date**: 2026-03-18
**Context**: Post-080 completion review. Ada R2 (full token pass) and Peter R1 (OQ-1 through OQ-6 resolved) are both new since LINA R1. All blockers cleared. Reviewing design outline readiness for formalization.

**Overall Assessment**: The design outline is ready for formalization. Thurgood R2's revision is thorough, Ada R2's token mapping is clean (reuse over invention — correct instinct), and Peter R1 resolved every choreography question. Three items to track going into requirements.

**Moderate:**

- F26. **Animation choreography should be specified as behavior, not locked timing.** The three-phase pattern I proposed in F12 is directional, and Peter's answers (OQ-1 through OQ-5) refine the relationships — icon lift overlaps glide at ~80%, icon swap snaps in Phase 3, glow bleeds and animates. But nobody has prototyped this. The timing relationships between phases will need tuning during implementation. Requirements should capture the *behavioral contracts* (dot glides between tabs, glow dims/brightens, icon swaps outline↔solid, icon lifts with overlap) without locking in specific millisecond offsets or overlap percentages. The design.md can propose the timing model; implementation adjusts. → design-outline.md § "Animation Choreography"
  - **Action**: Requirements formalize behavior. Design.md proposes timing. Implementation tunes.

- F27. **Radial gradient geometry is still undefined.** We know the color stops (center accent at 100%, edge container-bg at `opacity024`) and the structural pattern, but the gradient's radius and aspect ratio were not captured by the Figma extractor. This affects how the glow reads visually — a tight radius produces a focused spotlight, a wide radius produces a diffuse wash. These are different visual effects. → design-outline.md § "Tab Item Gradient Pattern"
  - [@PETER] Can you extract the gradient radius/aspect ratio from Figma, or should we define it during implementation and validate against the design? -- [LINA R2]
  - **Action**: Needs resolution before or during implementation. Not a formalization blocker — can be tracked as an open item in requirements.

- F28. **Pressed state is undefined — needs at least a directional decision.** No Figma data, no token mapping. Pressed state affects behavioral contracts (`interaction_pressable`) and platform implementations (touch feedback). Minimum needed: what visual change happens on press? Common patterns: opacity reduction on the pressed tab item, blend darkening on the icon/background, or scale micro-animation. → design-outline.md § "Tab Item States" (Pressed row shows TBD)
  - [@PETER] Directional preference? Opacity reduction is simplest and consistent with how blend tokens work elsewhere in the system. Blend darkening (`blend.pressedDarker`) is the pattern Chip-Base uses. Scale is uncommon in DesignerPunk. -- [LINA R2]
  - **Action**: Needs at least a directional answer before behavioral contracts can fully specify pressed behavior. Not a formalization blocker if we mark it as an open item.

**Minor:**

- F29. **Ada R2 token mapping validated from component perspective.** The five tokens are correct for the component's needs:
  - `color.structure.canvas` (container bg) — Level 2, dark override to `gray400` ✓
  - `color.action.navigation` (active icon + dot) — Level 2, dark override to `cyan100` ✓
  - `color.background.primary.subtle` (active gradient center) — Level 2, dark override to `cyan500` ✓
  - `color.structure.border.subtle` (top stroke) — Level 2 composite, dark override swaps color component ✓
  - `color.icon.navigation.inactive` (new, inactive icon) — Level 2, dark override to `gray100` ✓
  
  The scoping of `color.icon.navigation.inactive` to navigation contexts is the right call. Ada's exploration of blend alternatives (all 4 directions × 5 levels, chained desaturate+darken, opacity compositing) confirms these are independent color roles, not derivable from the active color. No component-side concerns.

- F30. **OQ-14 (behavioral contracts) is now fully unblocked.** I have everything I need: choreography answers (Peter R1), token mapping (Ada R2), animation phases, composition model (badges deferred, slot placeholder). Will draft contracts during formalization. Expected contract categories: `interaction_pressable`, `interaction_selection`, `animation_coordination`, `visual_state_indicator`, `accessibility_navigation`, `layout_flexible_count`.

- F31. **Design Decision #12 needs updating.** Currently reads "Outline↔solid icon swap on selection. Swap method (crossfade vs snap) pending OQ-4." OQ-4 is now resolved — snap when arriving glow animates in (Phase 3). → design-outline.md § "Design Decisions Summary" #12
  - [@THURGOOD] Minor update: remove "pending OQ-4" and state the resolved method. -- [LINA R2]

#### [PETER R2]

**Date**: 2026-03-18
**Context**: Resolving Lina R2 open items F27 and F28.

**F27 (Gradient geometry) — RESOLVED:**
- Elliptical radial gradient, centered on icon center
- Radii: 88% of tab item width × 88% of tab item height
- Three stops: center accent at 100% → container bg at `opacity024` at 88% → container bg at `opacity000` at 100%
- Third stop eliminates perceptible edge at gradient boundary

**F28 (Pressed state) — RESOLVED:**
- Active tab has no pressed state (already active — pressing is a no-op)
- Inactive tab pressed: lighten blend on icon as press hint. Previews activation without committing.
- On drag-away: blend reverts (cancellation)
- On release (confirmed selection): full selection animation begins (dot glide, glow ramp, icon swap)
- Token: `blend.pressedLighter` (new semantic token needed — completes darker/lighter symmetry in blend family). Alternatively, component token. Needs Ada coordination.
  - [@ADA] New token needed: `blend.pressedLighter` — pressed-state lighten blend for inactive Nav-TabBar-Base icons. Mirrors existing `blend.pressedDarker` (`blend300`, 12% darker). Proposed: `blend300` at LIGHTER direction (12% lighter). Or should this be a component token scoped to Nav-TabBar-Base? Peter and Lina lean toward semantic (`blend.pressedLighter`) to complete the blend family symmetry. -- [PETER R2]

#### [ADA R3]

**Date**: 2026-03-18
**Context**: Responding to Peter R2 token request for `blend.pressedLighter`.

**@ Mention Responses:**

- Re: [@ADA] New token needed: `blend.pressedLighter` — pressed-state lighten blend for inactive Nav-TabBar-Base icons. Semantic or component token? -- [PETER R2]

  **Recommendation: Semantic token `blend.pressedLighter`.** Peter and Lina's instinct is correct — this completes the blend family's directional symmetry and follows the established pattern exactly.

  The evidence:
  - `hoverDarker` (blend200, darker, 8%) has `hoverLighter` (blend200, lighter, 8%) ✓
  - `pressedDarker` (blend300, darker, 12%) has no lighter counterpart ✗
  - The gap is structural, not incidental. Any component with pressed states on dark backgrounds would need this.

  **Proposed token:**
  | Token Name | Primitive | Direction | Value | Use Case |
  |------------|-----------|-----------|-------|----------|
  | `blend.pressedLighter` | blend300 | lighter | 12% | Pressed state feedback on dark backgrounds |

  This mirrors `pressedDarker` exactly — same primitive (blend300), same intensity (12%), opposite direction (lighter vs darker). The mathematical relationship is preserved.

  **Counter-argument for component token**: If Nav-TabBar-Base is the *only* component that will ever need a pressed-lighter blend, scoping it as a component token avoids polluting the semantic layer. However, any interactive element on a dark surface (dark mode cards, dark action bars, dark overlays) could need pressed-lighter feedback. The hover pair already has both directions at the semantic level, establishing the precedent. A component token here would be the odd one out.

  **Action needed**: This is token creation — requires your approval per governance. If approved, I can add it to the blend semantic tokens. The implementation is one line in the token definitions + one test assertion.

  **Usage guidance decision (Peter R2 discussion)**: Peter asked whether lighter/darker usage guidance is needed now. Consensus: not yet. The lighter/darker distinction is intuitive (darker on light surfaces, lighter on dark surfaces). Two pressed-blend consumers isn't enough to warrant formal guidance. **Watch item**: if a third component introduces a pressed blend where the lighter/darker choice isn't obvious, formalize guidance then. **Theming note**: lighter blends on dark-mode surfaces that are further light-shifted by WCAG theme overrides could wash out — this may surface during implementation and inform whether per-context blend behavior is needed. Track, don't pre-solve.

  **Process**: Token to be formalized in Spec 050 tasks for tracking purposes, not created ad-hoc.


#### [THURGOOD R3]

**Date**: 2026-03-18
**Context**: Final cleanup pass before formalization. All reviews complete.

**Changes Applied to Design Outline:**
- Updated status and revision date (R3)
- Added R3 revision notice documenting Lina R2, Peter R2, Ada R3 incorporations
- Removed stale B1 blocker references (mode architecture delivered by Spec 080)
- Removed disabled state (not supported — Peter decision)
- Updated pressed state row: removed TBD, reflects Ada R3 semantic token confirmation
- Fixed Design Decision #12: removed "pending OQ-4", states snap method (F31)
- Fixed icon swap in animation Phase 2: removed "method TBD", states resolved method
- Updated badge references from "pending OQ-6" to "deferred from v1"
- Updated token gaps: mode-aware tokens now "implemented and validated", gradient geometry and pressed state marked resolved
- Updated OQ-8: gradient geometry fully specified (three stops, 88% radii)
- Updated OQ-14: marked resolved — all inputs available, contracts ready for formalization
- Removed stale "pending Ada token resolution" from Lina section header
- Updated Next Steps: all review rounds marked complete, formalization is next

**No New Findings**: This was a cleanup pass, not a review round. No new feedback items. The outline is internally consistent and ready for formalization.

---

## Requirements Feedback

### Context for Reviewers

- 12 requirements covering selection, visual states, animation, glow, layout, keyboard, accessibility, touch targets, platform behavior, token creation, documentation
- Ada R2 token mapping (5 tokens) fully integrated
- Peter R1/R2 choreography and pressed state decisions incorporated
- Spec 080 mode architecture dependency complete
- Ada R4–R6 filed: token verification, semantic token upgrades, inter-tab spacing correction, motion token binding question

---

#### [LINA R1 — Requirements Review]

**Date**: 2026-03-18
**Context**: Component architecture and platform implementation review of requirements.md. Cross-referenced against Ada R4–R6 findings.

**Overall Assessment**: Solid requirements doc. 12 requirements, clean EARS format, good edge case coverage (R1 AC3 no-op on active, R1 AC4 fallback on invalid value, R1 AC5 minimum tab count). Ada's token verification confirms all references are accurate. Three items to address, plus endorsements of Ada's findings.

**Moderate:**

- F45. **R9 AC1 — `tapAreaMinimum` is correct as the min-width floor, but the AC should clarify the relationship to actual tab width.** R9 AC1 says "tappable area SHALL meet or exceed `tapAreaMinimum`." R9 AC2 says "full width of the tab item SHALL be tappable." In practice, tab items in a 3–5 tab bar will far exceed `tapAreaMinimum` — the token sets the floor, the layout provides the real target. The current wording is technically correct but could be read as "make each tab exactly `tapAreaMinimum` wide." Suggest: "each tab's tappable area min-width SHALL be `tapAreaMinimum`; the full width of the tab item SHALL be tappable." Peter confirmed `tapAreaMinimum` as the min-width (not `tapAreaRecommended`). → requirements.md § R9
  - [@THURGOOD] Minor wording clarification. Functionally correct as-is, but the min-width framing makes the intent clearer. -- [LINA R1]

- F46. **No AC for badge composition slot placeholder.** Peter R1 OQ-6 resolved: badges deferred from v1, but "structure must support adding badges later as a light effort." The introduction mentions this, and Ada R3 recommended a named slot on the tab item. But no acceptance criterion requires the slot to exist. Without an AC, an implementation could satisfy all requirements and still not have the slot — making badge integration a heavier lift later. → requirements.md (absent)
  - Proposed AC (on R5 or as a new requirement): "WHEN a tab item is rendered THEN its structure SHALL include a composition slot for future Badge family integration. The slot SHALL be empty in v1 — no badge tokens or badge rendering required."
  - **Counter-argument**: This is arguably a design.md concern, not a requirement. The requirement is "support badges later" — the slot is one implementation approach. But given Peter's explicit direction that it should be "a light effort," an AC ensures it doesn't get lost.
  - [@THURGOOD] Should this be an AC or a design.md implementation note? Peter's direction was explicit enough that I lean toward AC. -- [LINA R1]

**Minor:**

- F47. **R3 motion token binding — endorsing Ada F44 and my F26 position.** R3 should mandate Rosetta motion tokens without naming specific ones. Proposed AC addition: "WHEN animation phases execute THEN timing and easing SHALL use Rosetta motion tokens — hard-coded timing values are not permitted." The design.md proposes specific token bindings (`duration150`, `duration350`, `easingGlideDecelerate`, etc.); implementation tunes. This keeps the requirement stable if we adjust which specific tokens are used during implementation.
  - [@THURGOOD] Ada directed this to you in F44. My recommendation aligns with hers — "SHALL use Rosetta motion tokens" without naming specific ones. -- [LINA R1]

**Endorsements (Ada R5–R6):**

- F48. **Endorse Ada F37 — semantic inset tokens.** All internal padding in R5 AC7, R6 AC1, R6 AC2 should use `space.inset.*` not raw primitives. Semantic tokens first per Core Goals. I should have caught this in my initial read.

- F49. **Endorse Ada F38/F39 — grouped spacing.** Tab item spacing is `space.grouped.normal`, icon-to-dot gap is `space.grouped.minimal`. Textbook grouped spacing use cases.

- F50. **Endorse Ada F40 — `radiusFull` for pill shape.** Semantic token exists for exactly this purpose.

- F51. **Endorse Ada F43 — remove inter-tab spacing.** Tabs should fill padded bounds with zero gap. Dead zones between tabs conflict with R9 AC2 (full width tappable). Ada's reasoning is correct and stronger than my initial observation.

- F52. **Endorse Ada F32 — dot sizing as `space050` × `space050`.** Agree with the semantic stretch documentation and future sizing token family as a separate spec candidate.

## Design Feedback

### Context for Reviewers

- Architecture: True Native build-time platform separation (Web Component, SwiftUI, Compose)
- Props interface follows Nav-SegmentedChoice-Base (049) pattern — controlled selection, attribute-based
- Animation: three-phase choreography (depart → glide → arrive) with Phase 3 overlapping Phase 2 at ~80%
- Glow: elliptical radial gradient on all tabs, three stops, 88% radii, bleeds into adjacent tabs
- Mode: Day/Night resolved via Spec 080 Level 2 semantic overrides, not component props
- Token mapping: Ada R2 (5 tokens), semantic inset/grouped spacing (Ada R5), `blend.pressedLighter` (Ada R3)
- Dependencies: Spec 080 (complete), Spec 049 (complete, motion token precedent)

---

#### [LINA R1 — Design Review]

**Date**: 2026-03-18
**Context**: Component architecture, platform implementation, and behavioral contracts review of design.md.

**Overall Assessment**: Well-structured design doc. Props interface correctly follows 049's pattern, state management identifies all moving parts, animation choreography table is clear, platform API mapping gives implementers concrete starting points. Design decisions are well-reasoned with trade-offs documented. Four items to address.

**Significant:**

- F53. **Behavioral contracts are missing from the design doc.** The testing strategy references "Behavioral Contract Tests (Lina)" but no contracts are specified. Per the scaffolding workflow, `contracts.yaml` must be authored before platform implementation — contracts define what platforms implement, not the other way around. The design doc should include at least the contract categories and key behaviors. Full `contracts.yaml` authoring is a task deliverable, but the design doc should establish the contract surface.

  Proposed contracts (from Concept Catalog, cross-referenced against requirements):

  **interaction (6):**
  - `interaction_pressable` — inactive tabs respond to press with `blend.pressedLighter`, revert on drag-away (R2 AC3-4)
  - `interaction_noop_active` — active tab press is a no-op, no visual feedback (R1 AC3, R2 AC5)
  - `interaction_roving_tabindex` — web: selected tab `tabindex="0"`, others `tabindex="-1"` (R7 AC1)
  - `interaction_keyboard_navigation` — Left/Right arrows move focus with wrapping (R7 AC2)
  - `interaction_keyboard_activation` — Enter/Space selects focused tab (R7 AC3)
  - `interaction_focus_ring` — `:focus-visible` with accessibility focus tokens (R7 AC5)

  **animation (2):**
  - `animation_coordination` — three-phase choreography: depart → glide → arrive, Phase 3 overlaps Phase 2 (R3 AC1-4)
  - `animation_initial_render` — selected tab appears in active state without animation on first render (R3 AC6)

  **state (2):**
  - `state_selected` — exactly one tab selected at all times, controlled via `selectedValue` (R1 AC2)
  - `state_mode_driven` — colors resolve through Spec 080 mode architecture, not component props (R10 AC4)

  **visual (4):**
  - `visual_state_colors` — active: solid icon + `color.action.navigation`, inactive: outline icon + `color.icon.navigation.inactive` (R2 AC1-2)
  - `visual_background` — container uses `color.structure.canvas` bg + `color.structure.border.subtle` top stroke (R5 AC6)
  - `visual_pill_container` — web: `radiusFull`, backdrop blur, inline margins, chrome tracking (R5 AC2-5). Excluded on iOS/Android.
  - `visual_state_colors` (glow) — may need a separate concept: `visual_gradient_glow` — elliptical radial gradient on all tabs, accent center on active, canvas center on inactive (R4 AC1-4)

  **accessibility (4):**
  - `accessibility_aria_roles` — container `role="tablist"`, items `role="tab"` + `aria-selected` (R8 AC1-2)
  - `accessibility_reduced_motion` — all animation collapses to immediate state change (R3 AC5)
  - `accessibility_touch_target` — min-width `tapAreaMinimum`, full tab width tappable (R9 AC1)
  - `accessibility_aria_label` — `accessibilityLabel` required, announced instead of icon name (R8 AC3)

  **layout (1):**
  - `layout_flexible_length` — 3–5 tabs, equal-width distribution, no inter-tab gaps (R5 AC7)

  **validation (1):**
  - `validation_selection_constraints` — minimum 2 tabs, fallback on invalid `selectedValue` (R1 AC4-5)

  Note: `visual_gradient_glow` is not in the current Concept Catalog. If we use it, it needs a ballot measure to add to the catalog. Alternative: fold glow behavior into `visual_state_colors` and document the gradient as an implementation detail of the color state. I lean toward a new concept — the glow is structurally distinct from simple state colors.

  - [@THURGOOD] Contracts should have been in the design doc before my review. Process suggestion: design doc template could include a "Behavioral Contracts" section header with a note "Lina to populate — contracts must be authored before platform implementation." That way the absence is visible. Not critical — the review process caught it — but worth considering. -- [LINA R1]
  - **Action**: I will author the full `contracts.yaml` as part of the implementation tasks. The contract list above should be added to the design doc now.

**Moderate:**

- F54. **`TabOption` interface doesn't reflect the badge composition slot.** R5 AC8 requires a composition slot for future Badge family integration. The design doc's `TabOption` type has `value`, `icon`, `activeIcon`, and `accessibilityLabel` — no badge slot. This is likely a platform-level concern (named slot in Web Component, ViewBuilder in SwiftUI, content lambda in Compose) rather than a props-level concern, but the design doc should state that explicitly. → design.md § "Props Interface"
  - **Action**: Add a note to the Props Interface section: "Badge composition slot is a platform-level concern — Web Component named slot, SwiftUI ViewBuilder, Compose content lambda. Not represented in the TypeScript props interface."

- F55. **`onSelectionChange` callback timing relative to animation is unspecified.** Does the callback fire immediately on press release (before animation starts), or after animation completes? For navigation, it should fire immediately — the app needs to start loading destination content while the animation plays. This is how 049 works. → design.md § "State Management" or § "Animation Choreography"
  - **Action**: Add to Animation Choreography: "`onSelectionChange` fires immediately on confirmed selection (press release), before animation begins. The animation is visual feedback, not a gate on navigation."

**Minor:**

- F56. **Phase 3 overlap implementation approach not specified per platform.** The choreography table says Phase 3 starts "~80% through glide" but doesn't say how. Web: likely `setTimeout` at 80% of `duration350`, or a CSS animation delay. iOS: `withAnimation` delay or chained animation. Android: `Animatable` with `delay`. Not a design doc blocker — this is implementation detail — but a note acknowledging the overlap is a platform implementation concern would help implementers. → design.md § "Platform Animation APIs"
  - **Action**: Add note: "Phase 3 overlap timing (~80% through Phase 2) is a platform implementation concern. Web: animation delay or timeout. iOS: chained animation with delay. Android: `Animatable` with delay parameter."

## Tasks Feedback

### Context for Reviewers

- 6 parent tasks, 20 subtasks
- Task ordering: tokens → scaffolding (contracts gate implementation) → platforms in parallel → documentation
- Agent assignments: Ada (token creation, dark mode verification), Thurgood (ballot measure), Lina (everything else)
- All 12 requirements traced to at least one subtask
- Dependencies: Task 1 → Task 2 → Tasks 3/4/5 (parallel) → Task 6

---

#### [LINA R1 — Tasks Review]

**Date**: 2026-03-18
**Context**: Component implementation review of tasks.md. Cross-referenced against requirements, design doc, and existing component patterns.

**Overall Assessment**: Well-structured task plan. Ordering is correct, agent assignments are right, dependency graph is clean. The explicit callout of the 049 lesson (contracts before platform implementation) in Task 2.2 is good process memory. Three minor items.

**Minor:**

- F57. **R11 AC1 (`color.icon.navigation.inactive`) is already satisfied but not noted.** The token and its dark override both exist — created during Spec 080 work. Task 1 only covers `blend.pressedLighter` (R11 AC2) and the ballot measure. R11 AC1 is implicitly satisfied, but the tasks doc should note this explicitly to avoid confusion. → tasks.md § Task 1
  - **Action**: Add a note to Task 1 or Task 1.1: "`color.icon.navigation.inactive` (R11 AC1) already exists in the semantic registry with dark override in `SemanticOverrides.ts` — created during Spec 080. No task needed."

- F58. **Task 3.4 is typed Architecture/Tier 3 but is implementation work.** The architecture decisions (three-phase choreography, overlap timing, motion token binding) are already made in the design doc. Task 3.4 is implementing those decisions in CSS transitions and JavaScript timing. Tier 2 Standard is more appropriate. → tasks.md § Task 3.4
  - **Action**: Reclassify to Implementation/Tier 2.

- F59. **Task 6.4 (Navigation family steering doc) — verify the doc exists first.** The task says "Update Navigation family in Component-Quick-Reference.md to include Nav-TabBar-Base." The Navigation family is listed as "placeholder status" in the design outline (family 11). If the family doc doesn't exist yet, this task needs to create it (using Component-MCP-Document-Template), not just update it. That's a different scope.
  - **Action**: Check if `Component-Family-Navigation.md` exists. If not, Task 6.4 should include drafting the family doc as a ballot measure.

**No concerns:**

- F60. **Task 2.2 (contracts.yaml) correctly gates platform implementation.** The 049 lesson is explicitly called out. All 20 contracts from the design doc are referenced. Good.

- F61. **Task 6.2 (dark mode verification) is correctly scoped as verification, not creation.** All 5 dark overrides already exist in `SemanticOverrides.ts` from Spec 080 Task 7. Confirmed by source inspection.

- F62. **Platform tasks (3/4/5) are correctly parallelizable.** No cross-platform dependencies. Each platform has its own rendering, animation, accessibility, and test subtasks. Clean separation.

#### [ADA R4 — Requirements Review]

**Date**: 2026-03-18
**Context**: Token-side review of requirements.md. All existing token references verified against source. Two items flagged, both resolved with Peter.

**Token Reference Verification**: ✅ All token references accurate
- `color.action.navigation`, `color.icon.navigation.inactive`, `color.structure.canvas`, `color.structure.border.subtle`, `color.background.primary.subtle` — all match Spec 080 token mapping
- `blend.pressedLighter` (R11 AC2) — correctly specified as blend300/lighter/12%
- `color.icon.navigation.inactive` (R11 AC1) — verified: gray300 base, gray100 dark override ✓
- `opacity024`, `opacity000` (R4 AC2) — both exist in opacity family ✓
- Spacing tokens in R5/R6/R7 — all valid primitive references ✓

**Resolved:**

- F32. **R2 AC1 — Indicator dot "4×4px" should reference `space050` as dimension.** No sizing token exists at this scale. Icon tokens are typography-paired and don't apply to decorative indicators. After discussion, Peter agreed: reference `space050` (4px) used as a dimension, not spacing. Document the semantic stretch. A general `size` primitive token family (mirroring spacing scale but for element dimensions) has merit but deserves its own spec — not a side-effect of a tab bar dot. → **Future spec candidate: sizing token family.** Track as system-level decision.
  - **Action for Lina/Thurgood**: R2 AC1 should read "`space050` × `space050` indicator dot" instead of "4×4px". Note in implementation that `space050` is used as a dimension here, pending future sizing token family.

- F33. **R4 AC3 — Parenthetical hardcodes resolved Day/Night values.** "Day: `cyan100`, Night: `cyan500`" will go stale if primitives change. The semantic token name `color.background.primary.subtle` is what matters. Recommend removing the parenthetical or marking it as "current resolved values, not normative."
  - **Action**: Minor editorial. Not blocking.

**No concerns:**

- F34. **R6 — Icon size intentionally omitted.** Icon sizing is the Icon component's responsibility (controlled by its `size` prop). Nav-TabBar-Base receives Icon as a child; specifying icon size here would reach into Icon's domain. Correct boundary. No action needed.

- F35. **R10 AC4 — Mode resolution correctly deferred to Spec 080.** Mode is not a component prop. Colors resolve through Level 2 semantic overrides. This is the right pattern post-080.

- F36. **R11 — Token creation properly gated.** Both new tokens (`color.icon.navigation.inactive`, `blend.pressedLighter`) require governance review per Token Governance. Correctly captured as requirements, not pre-created.

#### [ADA R5 — Semantic Token Opportunities]

**Date**: 2026-03-18
**Context**: Peter flagged that R5/R6 padding should use inset tokens. Full scan of requirements for additional semantic token opportunities.

**Semantic upgrades (should change):**

- F37. **R5 AC7, R6 AC1, R6 AC2 — Padding should use `space.inset.*` tokens.** All internal padding references use raw primitives (`space050`, `space100`, `space150`, `space200`) but should use the semantic inset equivalents. Mapping:
  - R5 AC7: `space.inset.050` top, `space.inset.100` right, `space.inset.150` bottom, `space.inset.100` left
  - R6 AC1: `space.inset.150` top, `space.inset.150` inline, `space.inset.050` bottom
  - R6 AC2: `space.inset.200` top, `space.inset.150` inline, `space.inset.100` bottom

- F38. **R5 AC7 — Tab item spacing should use `space.grouped.normal`.** The `space100` between tab items is spacing between tightly related siblings in a navigation row — textbook grouped spacing. → `space.grouped.normal` (8px)

- F39. **R6 AC1 — Icon-to-dot gap should use `space.grouped.minimal`.** The `space050` between icon and indicator dot is minimal separation between tightly coupled elements within a single tab item. → `space.grouped.minimal` (4px)

- F40. **R5 AC2 — `border-radius: 9999` should use `radiusFull`.** The semantic token `radiusFull` (references `radiusMax` = 9999px) exists exactly for pill shapes. → `radiusFull`

**Leave as-is:**

- F41. **R5 AC2 — Inline margins `space200` is fine as primitive.** This is a container-to-viewport margin, not clearly a semantic spacing relationship. The primitive is more honest than forcing it into a layout semantic category.

- F42. **R5 AC4 — `100ms ease-out` chrome tracking transition is fine as hard-coded.** Below the motion token scale (`duration150` = 150ms is the smallest). This is a platform-specific viewport tracking implementation detail, not a design animation. No other component does chrome tracking, so tokenizing it would be governance overhead for a single use.

#### [ADA R6 — Requirements Corrections]

**Date**: 2026-03-18
**Context**: Peter identified two issues during review: inter-tab spacing and motion token binding.

**Corrections:**

- F43. **R5 AC7 — Remove `space100` item spacing between tabs.** Tabs should fill the container's padded bounds equally with zero gap. Every pixel between the container's inset padding edges should be tappable by one tab or another. Inter-tab gaps create dead zones that reduce touch target coverage (conflicts with R9 AC2: "full width of the tab item SHALL be tappable"). Visual separation between tabs comes from each tab's own internal inset padding (R6), not from inter-tab spacing. This applies to all three platforms — iOS, Android, and web.
  - **Action**: R5 AC7 should read: "...SHALL apply padding: `space.inset.050` top, `space.inset.100` right, `space.inset.150` bottom, `space.inset.100` left. Tab items SHALL distribute evenly within the padded bounds with no inter-tab spacing."

- F44. **R3 — Animation choreography doesn't reference motion tokens.** The dependency header calls out `duration150`, `duration350`, and `easingGlideDecelerate` from Spec 049, but R3's acceptance criteria describe behavior without binding to any motion tokens. An implementer could satisfy R3 with hard-coded timing values. At minimum, R3 should mandate that animation timing uses Rosetta motion tokens. Whether to name specific tokens (`duration150`, `easingGlideDecelerate`) or just require "motion tokens from the Rosetta system" is a formalization judgment call.
  - [@THURGOOD] How do you want to handle this? Lina's F26 says requirements should capture behavior, not locked timing — which argues for "SHALL use Rosetta motion tokens" without naming specific ones. But the Spec 049 precedent exists and the dependency section already identifies the tokens. Your call on the right level of specificity. -- [ADA R6]
