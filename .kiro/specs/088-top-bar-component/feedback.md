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

**Action**: Ada to own blur token family spec (089). Spec 088 lists it as a dependency. The two specs can run in parallel.

**space.inset.000: Likely unnecessary, pending Lina confirmation.**

Zero padding is the absence of padding — expressed by not referencing an inset token, not by referencing a zero-valued one. The only case where `space.inset.000` would matter is if the component token schema requires every component to declare an explicit inset reference.

**Action**: Lina to confirm whether the schema requires an explicit inset reference when padding is zero. If not, no token needed.

**Token table gap: Separator border width.**

The bottom separator references `color.structure.border.subtle` for color (correct), but the separator *width* should reference a border width token (`border.hairline` or `border.thin`) rather than being hard-coded.

**Action**: Lina to add border width token reference to the separator specification.

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
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

---

## Design Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

---

## Tasks Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]
