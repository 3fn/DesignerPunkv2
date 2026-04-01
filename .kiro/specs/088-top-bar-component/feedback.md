# Spec Feedback: Nav-Header Component

**Spec**: 088-top-bar-component
**Created**: 2026-03-29
**Design Outline**: `design-outline.md`
**Research**: `research/design-system-comparison.md`, `research/ada-token-request.md`

---

## Design Outline Feedback

### Context for Reviewers

The design outline proposes Nav-Header-Base (primitive, internal only) with two semantic variants: Nav-Header-Page (opinionated page-level bar) and Nav-Header-App (permissive scaffold for product-defined app-level headers).

9 confirmed decisions (D1–D9). Key areas for review:
- D1: Custom implementation — no UINavigationBar or Material TopAppBar wrappers
- D4: Configurable title alignment with platform-native defaults (center iOS, leading Android/web)
- D6: Medium tertiary Button-Icon for all actions
- D7: Content-driven height — 48px on iOS/web (no padding), 64dp on Android (space.inset.100)
- D8: Fixed + collapsible scroll behavior
- Token dependencies: new typography token, blur token, space.inset.000

### Round 1 — Platform + Tokens

**Reviewers**: Kenya (iOS), Data (Android), Sparky (Web), Ada (Tokens)

**Kenya — iOS focus areas**:
- D1: Feasibility of custom SwiftUI implementation vs UINavigationBar. What system behaviors do we lose (swipe-back gesture, status bar integration)?
- D7: 48px content height with no padding — does this feel right for iOS?
- D8: Collapsible scroll via SwiftUI preference keys / scroll offset observation — complexity assessment

**Data — Android focus areas**:
- D1: Feasibility of custom Compose implementation vs Material TopAppBar. What do we lose?
- D4: Center-aligned title on Android — does this feel acceptable or jarring?
- D7: space.inset.100 padding bringing height to 64dp — does this match Material expectations?
- D8: Collapsible scroll via NestedScrollConnection — complexity assessment

**Sparky — Web focus areas**:
- D7: 48px content height with no padding — does this work for web?
- D8: Window scroll default with optional scrollContainerRef — does this cover the product screens you'd build?
- Translucent appearance: backdrop-filter approach, browser support concerns

**Ada — Token focus areas**:
- Typography token: fontFamilyBody + fontSize100 + lineHeight100 + fontWeight600 + letterSpacing100. Naming and structure.
- Blur/backdrop token: Structure for translucent backgrounds. Two consumers (Nav-Header-Base, Nav-TabBar-Base). Blocks formal spec.
- space.inset.000: Do we need an explicit zero inset token, or is this handled differently?
- Any token gaps in the preliminary token requirements table?

### Ada — Token Review

**Typography token: Recommend `typography.labelMd` instead of a new token.**

Lina's request identified fontWeight600 (semi-bold) as needed. However, `typography.labelMd` (fontWeight500, medium) is worth trying first:

- `labelMd` is semantically accurate — a nav bar title is a UI label. Its context is literally "labels for form fields and UI elements."
- fontWeight500 is already heavier than body text (400). It reads as distinct from content without competing with display headings.
- Material 3 TopAppBar and iOS UINavigationBar inline titles both use medium weight — semi-bold is reserved for large titles.
- Zero new tokens means no creation governance, documentation, or MCP updates.

If fontWeight500 proves too light during implementation, creating a new token at that point is a small, well-understood task. Recommend trying `labelMd` first and evaluating visually before committing to a new token.

**Action**: Lina to confirm whether fontWeight500 is acceptable or if there's a visual rationale requiring fontWeight600.

**Blur/backdrop token: Separate spec, not folded into 088.**

Two consumers (Nav-Header-Base translucent appearance, Nav-TabBar-Base floating pill) warrant a proper token family. Proposed structure:

- Three primitive tokens following base-8 progression: `blur.subtle = 8`, `blur.standard = 16`, `blur.heavy = 24`
- Platform mapping via Option A (design intent, not literal values): web maps to `backdrop-filter: blur(Xpx)`, iOS maps to system material enums (subtle → `.systemUltraThinMaterial`, standard → `.systemThinMaterial`, heavy → `.systemMaterial`), Android uses solid backgrounds by convention (token available but not consumed)
- TabBar's existing hard-coded blur migrates to `blur.standard`

Full scope for a new token family includes: primitive definitions, Token-Family doc, mathematical foundation, platform builder updates, generation pipeline changes, dist/ rebuild, formula/compliance tests, MCP updates, and existing consumer migration. This is a proper spec (089), not a subtask of 088.

**Action**: Ada to own unified blur token family spec (089). Spec 088 lists it as a dependency. The two specs can run in parallel.

**space.inset.000: Likely unnecessary, pending Lina confirmation.**

Zero padding is the absence of padding — expressed by not referencing an inset token, not by referencing a zero-valued one. The only case where `space.inset.000` would matter is if the component token schema requires every component to declare an explicit inset reference.

**Action**: Lina to confirm whether the schema requires an explicit inset reference when padding is zero. If not, no token needed.

**Token table gap: Separator border width.**

The bottom separator references `color.structure.border.subtle` for color (correct), but the separator *width* should reference a border width token (`border.hairline` or `border.thin`) rather than being hard-coded.

**Action**: Lina to add border width token reference to the separator specification.

### Ada — Cross-Spec Note (from Spec 089 feedback)

**iOS material enum mapping for surface blur belongs in this spec, not Spec 089.**

During Spec 089 (Unified Blur Token Family) review, Kenya provided detailed feedback on mapping blur primitives to iOS system material enums (`.systemUltraThinMaterial`, `.systemThinMaterial`, `.systemMaterial`). Key points:

- Apple's material system isn't a blur intensity scale — materials control blur *and* tint/saturation, and adapt to light/dark mode and vibrancy contexts
- The 3-tier mapping (blur050/blur100/blur150 → the three `.system*Material` variants) is the right approach for app chrome (nav bars, tab bars)
- Full 9-token mapping creates false precision — the non-system material variants (`.ultraThinMaterial`, `.thickMaterial`, etc.) are designed for different contexts
- Kenya recommends using system materials over raw `.blur(radius:)` for True Native Architecture
- Visual verification across light and dark mode should be an acceptance criterion

This is component-level platform implementation, not token generation. Spec 089 generates blur tokens as numeric values on all platforms. This spec (088) owns how Nav-Header-Base translates those values to native APIs per platform.

**Action**: Address iOS material mapping in Spec 088 design. Kenya's full feedback is in `.kiro/specs/089-unified-blur-token-family/feedback.md` under "Kenya — iOS Platform Validation."

---

### Round 2 — Governance + Product

**Reviewers**: Thurgood (Governance), Leonardo (Product)

**Thurgood — Governance focus areas**:
- Spec structure readiness — is the outline complete enough to move to requirements?
- Behavioral contract planning — what contract categories does this component need?
- The "primitive is internal only" constraint — any governance implications?

**Leonardo — Product focus areas**:
- Nav-Header-Page: Does the prop surface cover the screens you'd spec?
- Nav-Header-App: Is the intent statement clear enough for product agents to understand when/how to use it?
- Composition with Nav-TabBar-Base: Does the app shell model (header top + tab bar bottom) work for your screen specs?
- Any product screens that wouldn't be served by this architecture?

[Round 2 feedback here]

---

## Requirements Feedback

### Context for Reviewers
Requirements doc translates design outline decisions D1–D9 into 7 requirements with testable acceptance criteria. All major decisions are traceable.

### Lina — Component Review

**Overall**: Solid. Every confirmed decision maps to specific ACs. The primitive-is-internal-only constraint is captured in both Req 1 and Req 7. Ready to move to design with the refinements below.

**F1: Req 2 AC 9 — Scroll threshold is imprecise.**
"~8-10px" isn't testable. Recommend picking 8px (base-8 grid aligned) as a firm value. A behavioral contract test needs a specific number.

**F2: Req 4 AC 8 — iOS material enum mapping references unfinalized feedback.**
"Mapping per Kenya's R1 feedback from Spec 089" — if Kenya hasn't validated yet, this AC has an unresolved dependency. Should either state the mapping explicitly (blur050 → .systemUltraThinMaterial, blur100 → .systemThinMaterial, blur150 → .systemMaterial) or mark as "TBD pending Kenya validation."

**F3: Req 2 — Missing AC for safe area behavior during collapsible scroll.**
D8 specified "safe area remains protected — bar slides behind status bar, not above it." This isn't an explicit AC. Recommend adding: "WHEN scrollBehavior is collapsible AND the header is hidden THEN the safe area (status bar zone) SHALL remain protected — content SHALL NOT render in the safe area."

**F4: Req 2 AC 10 — "Degrade to fixed" is ambiguous.**
Does "degrade to fixed" mean the bar never hides (stays visible, scroll has no effect)? Or does it mean the bar hides/shows instantly without animation? The safer accessibility choice is never hides. Recommend clarifying: "WHEN reduced motion is enabled THEN the header SHALL remain fixed (visible at all times, collapsible behavior disabled)."

**F5: Dependency — Spec 089 status.**
Header says "Spec 089 — complete." If 089 isn't actually complete, the translucent appearance ACs (Req 1 AC 5, Req 4 AC 8-10) have an unresolved dependency. Confirm 089 status or mark translucent ACs as blocked.

**F6: Req 3 — Thin but appropriate.**
Nav-Header-App has 5 ACs, two of which are documentation notes rather than testable criteria (AC 4 readiness status, AC 5 "value is in what it inherits"). This is fine — the component is intentionally thin. The thinness of the requirements reflects the thinness of the scaffold.

### [THURGOOD R2]

Incorporated all Lina feedback:

- **F1**: Scroll threshold fixed to 8px (base-8 grid aligned) → Req 2 AC 9
- **F2**: iOS material mapping stated explicitly (blur050→.systemUltraThinMaterial, blur100→.systemThinMaterial, blur150→.systemMaterial) → Req 4 AC 8
- **F3**: Added safe area protection AC during collapsible scroll → Req 2 AC 11
- **F4**: Clarified reduced motion means header remains visible, collapsible disabled → Req 2 AC 10
- **F5**: Confirmed — Spec 089 is complete. No dependency issue.
- **F6**: Acknowledged, no change needed.

Requirements approved. Ready to proceed to design.

---

## Design Feedback

### Context for Reviewers
Design doc translates the design outline (9 decisions) and requirements (7 requirements) into architecture, interfaces, and testing strategy. Props interfaces, token dependencies, and correctness properties are well-defined.

### Lina — Component Review

**Overall**: Clean and well-organized. All design outline decisions traceable. Requirements feedback (F1–F4) incorporated correctly. Correctness properties are a strong contract testing foundation. Five refinements below.

**F1: Title centering with leading action — truncation behavior needed.**
When `titleAlignment: 'center'` and `leadingAction` is present, the title should be centered in the full bar width, not the remaining space. Long titles will approach the leading/trailing regions. Specify: title truncates with ellipsis before overlapping leading or trailing regions. This matches iOS native behavior.

**F2: Trailing actions + closeAction layout order.**
Decision 3 says close is at the absolute inline-end edge, separate from trailing actions. But the spatial relationship isn't specified. Recommend: `[trailingActions] [spacing gap] [closeAction]` — with a spacing token (e.g., `space.grouped.minimal` or similar) separating close from trailing actions to visually distinguish dismissal from operations. Alternatively, no gap if close is just the last icon in the row. Needs a decision.

**F3: `showSeparator` not exposed on semantic variants.**
The primitive has `showSeparator`. Neither Nav-Header-Page nor Nav-Header-App props include it. Should both variants expose it? Recommend: Nav-Header-Page defaults to `showSeparator: true`, Nav-Header-App defaults to `showSeparator: true`, both allow override. Or: the primitive default is `true` and variants inherit without re-exposing.

**F4: `scrollContainerRef` missing from Nav-Header-Page props.**
Decision 5 mentions the web-specific `scrollContainerRef` for nested scrollable containers, but it's not in the Nav-Header-Page TypeScript interface. Should be added: `scrollContainerRef?: React.RefObject<HTMLElement>` (web-only). Platform-specific props are acceptable in types.ts when they're clearly documented as platform-specific.

**F5: Badge rendering threshold on trailing actions.**
`TrailingAction.badge?: number` — what happens when `badge` is `0`? Recommend: badge only renders when present and > 0. No `showZero` behavior on header actions — that's a notification-specific concern handled by Badge-Count-Notification, not by the header's action interface.

---

## Tasks Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]
