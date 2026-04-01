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

### [THURGOOD R2]

Incorporated all Lina feedback:

- **F1**: Title truncation with ellipsis when centered title approaches leading/trailing regions → Decision 2, Correctness Property #9
- **F2**: `space.grouped.tight` gap between trailing actions and close action → Decision 3
- **F3**: `showSeparator` exposed on both Nav-Header-Page and Nav-Header-App (default `true`) for agent discoverability → Props interfaces
- **F4**: `scrollContainerRef` added to Nav-Header-Page props (web-only) → Props interface
- **F5**: Badge renders only when present and > 0 → Props comment, Correctness Property #8

Design approved. Ready to proceed to tasks.

---

## Tasks Feedback

### Context for Reviewers
Task breakdown: 4 parent tasks (primitive → Page → App → documentation), 12 subtasks. Logical ordering respects dependencies. All design feedback incorporated.

### Lina — Component Review

**Overall**: Well-structured. Dependency chain is correct, task sizing is appropriate, requirement traceability is thorough. Five refinements below.

**F1: Task 1.1 — contracts.yaml authoring should be a separate subtask.**
The scaffolding task (Tier 1 setup) includes "Create contracts.yaml with landmark, focus order, appearance, separator contracts." Writing behavioral contracts is substantive work — requires referencing the Contract System Reference, using the concept catalog, potentially proposing new concepts. Recommend splitting into 1.1 (scaffold: directory, types.ts, schema.yaml, tokens.ts) and 1.1b (contracts: contracts.yaml authoring, Tier 2).

**F2: Task 2.5 dependency chain — confirmed correct.**
Contracts.yaml authored in 2.1 (the spec), contract tests in 2.5 (the verification) depending on 2.2–2.4 (implementations to test against). This is the right order. No change needed.

**F3: Task 3.1 — `showSeparator` prop not in design doc's Nav-Header-App interface.**
Task says "showSeparator prop" but the design doc's `NavHeaderAppProps` doesn't include it. Either add `showSeparator?: boolean` to the design doc's Nav-Header-App interface, or clarify in the task that it's inherited from the primitive and passed through.

**F4: Missing — README creation.**
Scaffolding workflow Step 7 is README creation. No task mentions READMEs for the three components. Recommend adding to Task 4.1 (documentation): "Create READMEs for Nav-Header-Base, Nav-Header-Page, Nav-Header-App."

**F5: Missing — examples/ directory.**
Scaffolding workflow includes `examples/BasicUsage.tsx` and `BasicUsage.html`. Not mentioned in any task. Nav-Header-Page should have usage examples. Recommend adding to Task 4.1 or as a subtask of Task 2. Low priority for Nav-Header-App (scaffold).

### Lina — Implementation Note (Task 1.1b)

**New contract concepts for catalog ballot measure.**
The Nav-Header-Base contracts introduce 3 concepts not in the current concept catalog (117 concepts as of Spec 078 audit):
- `three_regions` (layout) — three-region horizontal layout with collapsible empty regions
- `safe_area` (layout) — platform safe area integration (iOS status bar, Android system bar)
- `focus_order` (interaction) — enforced focus traversal order across regions

These are used in `contracts.yaml` following `{category}_{concept}` naming. Not blocking — contracts are valid and usable. But the concept catalog needs updating. Thurgood: does this change anything in the spec, or is it a standalone catalog update?

### [THURGOOD R2]

Incorporated Lina's feedback:

- **F1**: Split Task 1.1 — scaffold (Tier 1) and contracts authoring (Tier 2, new Task 1.1b). Contracts are substantive work requiring Contract System Reference.
- **F2**: Confirmed correct, no change.
- **F3**: `showSeparator` is already in the design doc's Nav-Header-App interface (line 97). No change needed — Lina may have been looking at an older version.
- **F4**: READMEs added to Task 4.1.
- **F5**: Usage examples for Nav-Header-Page added to Task 4.1.

Tasks approved. Ready for implementation.

---

## Platform Implementation Review

### Context for Kenya and Data

Tasks 1.3 (iOS) and 1.4 (Android) are complete — Lina authored both implementations. Per Leonardo's process flag, this is the most platform-divergent component in the catalog. Kenya and Data should review the native implementations before we proceed to Task 1.5.

**Kenya — iOS review** (`src/components/core/Nav-Header-Base/platforms/ios/NavHeaderBase.ios.swift`):
1. Safe area: relying on SwiftUI automatic handling — is this sufficient or does it need explicit `.safeAreaInset`?
2. Translucent: using `.thinMaterial` — should it be `.systemThinMaterial` for the blur100 mapping from Spec 089?
3. VoiceOver: `.accessibilityAddTraits(.isHeader)` + `accessibilitySortPriority` (3, 2, 1) — does this announce correctly as a navigation bar? Is `.isHeader` the right trait?
4. Generic View with `Leading`, `Title`, `Trailing` type parameters — idiomatic SwiftUI, or should this use `@ViewBuilder` closures instead?

**Data — Android review** (`src/components/core/Nav-Header-Base/platforms/android/NavHeaderBase.android.kt`):
1. Safe area: `windowInsetsPadding(WindowInsets.statusBars)` on the Column — correct for edge-to-edge? Should it use `WindowInsets.safeDrawing` instead?
2. TalkBack: relying on Compose natural semantics — does it need explicit `semantics { heading() }` for navigation bar announcement?
3. Separator: using Material `Divider` composable — should it be a custom `Box` with token-driven height for consistency with other DesignerPunk components?
4. Slot lambdas (`@Composable () -> Unit`) — idiomatic Compose pattern for this use case?

### Kenya — iOS Implementation Review

**Overall verdict: Solid foundation, three issues — one is a bug, two are structural.**

#### Issue 1 (Bug): Wrong material variant for translucent appearance

The implementation uses `.thinMaterial`:
```swift
Color.clear.background(.thinMaterial)
```

The spec, requirements (Req 4 AC 8), and contracts all specify `.systemThinMaterial` for the `blur100` mapping. These are different things in SwiftUI:

- `.thinMaterial` — designed for in-app content overlays (popovers, sidebars). Lighter tint, less vibrancy adaptation.
- `.systemThinMaterial` — designed for system chrome (navigation bars, tab bars, toolbars). Adapts to elevation context and system appearance more aggressively.

For a navigation bar, `.systemThinMaterial` is correct. This is exactly the kind of component Apple designed the `.system*` material variants for. The completion doc even flags this as a question ("should it be `.systemThinMaterial`?") — yes, it should.

**Fix**: `Color.clear.background(.thinMaterial)` → `Color.clear.background(.systemThinMaterial)`

Lina's instinct to flag this was right. The non-system variants exist for a reason, and using the wrong one will produce subtly different visual behavior in dark mode and elevated contexts.

#### Issue 2 (Structural): Safe area handling is incomplete

The implementation relies on SwiftUI's automatic safe area handling:
```swift
// SwiftUI handles status bar inset automatically via view hierarchy
```

This works *if* the NavHeaderBase view is placed at the top of a NavigationStack or as a direct child of the scene. But the schema notes say "Safe area integration via `.safeAreaInset`" and the contract (`layout_safe_area`) specifies "background extends into safe area, content positioned below."

The current implementation doesn't explicitly extend the background into the safe area. If this view is placed inside a `ScrollView` or a `VStack` that already respects safe area, the background won't extend behind the status bar — it'll just sit below it.

For a navigation bar primitive, the implementation should explicitly handle this:

```swift
.ignoresSafeArea(.container, edges: .top)
```

Or more idiomatically, the background should extend into the safe area while the content stays below it. The web implementation handles this with `position: sticky; inset-block-start: 0` — the iOS equivalent needs to be equally explicit.

**Counter-argument**: The semantic variants (Nav-Header-Page, Nav-Header-App) will compose this primitive and may handle safe area at their level. If the primitive is truly never used directly, the safe area could be the variant's responsibility. But the contract says the *primitive* provides safe area integration, and the schema says the same. If the contract lives here, the implementation should too.

**Recommendation**: Add `.ignoresSafeArea(.container, edges: .top)` to the outer VStack so the background extends behind the status bar. The HStack content stays in the safe area naturally because SwiftUI's layout system positions it below the status bar inset.

#### Issue 3 (Structural): `if` conditional modifier is duplicated

The `View.if` extension is already defined in `ContainerBase.ios.swift`. Having it in two files will cause a compile error if both are in the same module:

```swift
private extension View {
    @ViewBuilder
    func `if`<Content: View>(_ condition: Bool, transform: (Self) -> Content) -> some View {
        if condition { transform(self) } else { self }
    }
}
```

This needs to either:
1. Be extracted to a shared utility (e.g., `ViewExtensions.swift` in a shared iOS directory)
2. Use a different name to avoid collision
3. Be removed and the `testID` logic inlined with a simple `if let`

Option 3 is simplest and avoids the architectural question:

```swift
var body: some View {
    VStack(spacing: 0) {
        // ... existing layout ...
    }
    .accessibilityElement(children: .contain)
    .accessibilityAddTraits(.isHeader)
    .accessibilityIdentifier(testID ?? "")
}
```

SwiftUI's `accessibilityIdentifier` with an empty string is a no-op for testing purposes — no need for conditional application.

#### What's Good

- **Token usage is correct.** `NavHeaderTokens` enum with static lets referencing `DesignTokens` — clean, follows the pattern from Nav-TabBar-Base.
- **Generic View with type parameters** is idiomatic SwiftUI for a slot-based primitive. The feedback doc asks whether `@ViewBuilder` closures would be better — for a primitive that's only composed by other components (not called directly by product code), generic type parameters are fine. `@ViewBuilder` closures would be better if product agents called this directly, but they won't.
- **VoiceOver focus order** via `accessibilitySortPriority(3, 2, 1)` is correct. Higher values get focus first in VoiceOver, so leading (3) → title (2) → trailing (1) is right.
- **Separator** implementation is clean — conditional Rectangle with correct tokens, `accessibilityHidden(true)`.
- **Min height 48pt** matches the spec's content-driven floor.

#### Summary

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | Bug | `.thinMaterial` should be `.systemThinMaterial` | One-line change |
| 2 | Structural | Safe area not explicitly handled — background doesn't extend behind status bar | Add `.ignoresSafeArea(.container, edges: .top)` |
| 3 | Structural | `View.if` extension duplicated from ContainerBase | Inline the conditional or extract to shared utility |

---

## Governance: Concept Catalog Update (Thurgood, 2026-03-31)

**@LINA**: Task 1.1b introduced 5 new contract concepts, not 3. Your completion doc listed `visual_translucent` and `visual_separator` as "existing visual concepts" — they were actually new and not in the catalog. The contract catalog validation test (`contract-catalog-name-validation.test.ts`) caught this.

All 5 concepts have been added to the Contract System Reference via ballot measure (Peter approved):

| Concept | Category | From |
|---------|----------|------|
| `focus_order` | interaction (16→17) | `interaction_focus_order` |
| `safe_area` | layout (3→5) | `layout_safe_area` |
| `three_regions` | layout (3→5) | `layout_three_regions` |
| `separator` | visual (24→26) | `visual_separator` |
| `translucent` | visual (24→26) | `visual_translucent` |

Total concepts: 117 → 122. Catalog validation test: 221/221 passing. Documentation MCP: healthy, rebuilt.

No action needed from you — just be aware that the catalog is updated and your contracts are valid. Going forward, run the catalog validation test after authoring contracts with new concepts to catch this earlier.

---

## Late Review: Consumer Validation

### Context for Leonardo

**@LEONARDO**: You're the primary consumer of Nav-Header-Page and Nav-Header-App. Please review the design doc (`design.md`) — specifically:

1. Does the `Nav-Header-Page` prop interface (title, leadingAction, trailingActions, closeAction, titleAlignment, scrollBehavior) give you what you need for screen specs?
2. Does `Nav-Header-App` (permissive slots, scaffold readiness) make sense for how you'd spec app-level chrome?
3. Does the Page vs App distinction match how you think about screen types?
4. Any product-level scenarios the design doesn't cover?

This is a consumer validation pass, not a full spec review. Focus on whether the component meets your workflow needs.

### Leonardo — Consumer Validation

**Verdict**: Approved. The component covers my workflow needs. Two deferrable gaps, one process flag.

#### Q1: Nav-Header-Page Props — Sufficient?

Yes. The interface covers every page-level screen I'd spec: pushed screens (back), presented screens (close), contextual actions (trailing with badges), platform-native title alignment with override, and collapsible scroll. The dedicated `closeAction` prop is the right call — separating dismissal from operations is semantically clearer than burying close in the trailing array.

**v2 consideration**: No subtitle or breadcrumb slot. `title` is a string only. When I spec a detail screen showing "Settings > Account > Privacy," I'd need either a subtitle prop or richer title composition. Not blocking for v1 — most page headers are title-only.

#### Q2: Nav-Header-App — Clear Enough?

Yes. The intent statement ("it orients, it doesn't navigate") is the right mental model. When I spec a root destination screen, I'd reach for Nav-Header-App and fill the slots with product content. The scaffold readiness is honest — the value is architectural (inheriting safe area, landmark, tokens), not behavioral.

**Noted**: Product content in Nav-Header-App slots is arbitrary ReactNode — not validated by `validate_assembly`. Acceptable trade-off for a scaffold. Means I can't validate the app-level header's component tree the way I can a Nav-Header-Page tree.

#### Q3: Page vs App Distinction — Matches My Mental Model?

Exactly. Every screen I've specced in my research maps cleanly:

- Dashboard, Settings, Inbox (root destinations) → Nav-Header-App
- Notification detail (pushed) → Nav-Header-Page with back
- Profile edit (presented) → Nav-Header-Page with close
- Onboarding step (presented) → Nav-Header-Page with close or back

The first question when decomposing a product into screens is "root destination or pushed/presented?" — that maps directly to App vs Page.

#### Q4: Uncovered Product Scenarios

Two, both deferrable:

1. **Search mode**: Tapping a search icon should transition the header into a search bar (text input replaces title, cancel button appears). Common on iOS and Android. Not addressed in current design. Could be a future variant (Nav-Header-Search) or a mode on Nav-Header-Page. Products can compose a separate search bar below the header for v1.

2. **Large title**: Already deferred to v2 in the design outline. The counter-argument is correct — iOS settings and inbox screens expect large title behavior. I'd need an escape hatch for iOS screens that require it until v2 ships. Manageable.

#### Process Flag: Platform Agent Review

The task plan has Lina doing all 6 platform implementations (web + iOS + Android for both primitive and Page). The design outline itself calls this "the most platform-divergent component in the catalog." Lina's iOS/Android verification depth is honest (from 086 feedback — confident on web, less so on native). For a component where platform conventions diverge structurally, I'd want Kenya and Data to at least review the iOS and Android implementations.

**Counter-argument**: D1 chose custom implementations over platform-native wrappers, so platform-specific API expertise is less critical. Behavioral contracts catch cross-platform consistency. Platform agent review can happen during product work when Kenya/Data first consume the component. May be fine as-is — flagging it for Peter's judgment. -- [LEONARDO R2]

### Data — Android Implementation Review (Task 1.4)

**File reviewed**: `src/components/core/Nav-Header-Base/platforms/android/NavHeaderBase.android.kt`
**Date**: 2026-03-31

**Overall**: Clean, concise, idiomatic slot pattern. Two blocking issues, three non-blocking.

#### Blocking

**F1: No TalkBack landmark semantics — contract violation.**
Contract `accessibility_aria_roles` requires "Container is announced as navigation bar by TalkBack." The implementation has zero `semantics` modifiers — the `heading` import is present but unused. Compose's natural semantics for Column + Row won't announce anything as a navigation bar. Needs at minimum:
```kotlin
.semantics { contentDescription = "Navigation bar" }
```
on the outer Column. (`heading()` is for semantic variants with h1, not the primitive.)

**F2: Hard-coded `48.dp` min height — token-first violation.**
```kotlin
.heightIn(min = 48.dp)
```
Should reference `DesignTokens.tap_area_recommended` (which resolves to 48.dp). The token exists for this exact purpose.

#### Non-Blocking

**F3: Safe area modifier order needs a comment.**
The `.background()` before `.windowInsetsPadding()` is correct for edge-to-edge (background extends behind status bar, padding pushes content below it). But modifier order in Compose is a common source of confusion — a comment explaining the intent would prevent future misreading.

**F4: Material `Divider` vs token-driven `Box`.**
Existing DesignerPunk components use token-driven custom drawing, not Material components. `Divider` works but introduces Material theme dependency. A `Box` with `.height(separatorWidth).background(separatorColor)` would be more consistent with the codebase.

**F5: Empty regions don't explicitly collapse.**
Contract says "Empty regions do not reserve space." Empty `Box {}` with empty lambda technically occupies 0×0 layout space, which works in practice with the current Row (no arrangement modifier). Not enforced explicitly, but not broken. Noting for awareness.

#### What Works Well

- Slot lambda pattern (`@Composable () -> Unit`) is idiomatic Compose for a primitive with composable regions
- Column (vertical) containing Row (horizontal) is the correct structural decomposition
- `weight(1f)` on title Box correctly fills remaining space
- `NavHeaderAppearance` enum honestly documents Android convention (both modes → solid background)
- File is concise — no over-engineering

#### Summary

| Issue | Severity | Blocking? |
|-------|----------|-----------|
| F1: No TalkBack landmark semantics | Contract violation | Yes |
| F2: Hard-coded 48.dp | Token-first violation | Yes |
| F3: Safe area modifier order comment | Documentation gap | No |
| F4: Material Divider | Convention inconsistency | No |
| F5: Empty region collapse | Contract nuance | No |

Both blocking issues are straightforward fixes. Solid foundation overall.
