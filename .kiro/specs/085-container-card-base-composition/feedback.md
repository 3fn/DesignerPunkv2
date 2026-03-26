# Spec Feedback: Container-Card-Base Composition Refactor

**Spec**: 085-container-card-base-composition
**Created**: 2026-03-26

---

## Design Outline Feedback

### Context for Reviewers

This spec refactors Container-Card-Base to actually compose Container-Base internally, matching its schema declaration. It's a lightweight spec focused on the composition pattern per platform, the interaction layer boundary, and test impact. External behavior is unchanged.

**Key context:**
- Issue doc with full audit: `.kiro/issues/2026-03-25-container-card-base-composition-mismatch.md`
- Container demos document the baseline behavior that must be preserved
- This is the first type-primitive composing a primitive — the pattern is precedent-setting

**@ADA**: Review for token resolution concerns. When Card composes Base, do tokens resolve correctly through the composition chain? Any risk that the curated token mappings in Card's `tokens.ts` conflict with Base's token resolution? Also: does the composition affect how the Application MCP resolves `resolvedTokens.composed`?

**@LINA**: The web composition approach (W1/W2/W3) is the critical decision. You've worked with both components' Shadow DOM implementations — which approach preserves encapsulation while keeping the interaction layer clean? For iOS and Android, are I1/A1 as straightforward as they appear, or are there modifier ordering concerns I'm not seeing?

#### [ADA R1]

**Re: @ADA token resolution concerns**

- **No token conflict risk.** Card's `tokens.ts` and Base's `tokens.ts` are structurally independent — both map prop values → token names but share no runtime state. Card's token maps are a strict subset of Base's across all domains (padding, background, shadow, border, borderRadius, borderColor). Card cannot pass a value Base doesn't understand. → design-outline.md § "Existing Behavior (Baseline from Demos)"

- **Critical implementation note for Lina: pass prop values, not resolved token names.** After the refactor, Card should pass raw prop values (e.g., `'150'`, `'surface.primary'`) to Base, not resolved token names (e.g., `'space.inset.150'`, `'color.surface.primary'`). Base handles its own token resolution. If platform implementations accidentally pass resolved names as prop values, Base won't recognize them. → design-outline.md § "Platform-Specific Composition Questions"

- **Card's `tokens.ts` becomes partially dead code.** If Card delegates token resolution to Base, the getter functions (`getCardPaddingToken()`, etc.) go unused in platform files. They still serve the type system and tests, but Lina should be aware this is a cleanup question post-refactor. Not a blocker — just a loose end. → design-outline.md § "Scope"

- **Padding type mismatch is manageable.** Card's vertical padding allows `'050'` while horizontal excludes it. Base accepts `'050'` on any axis — it's permissive. Card enforces the design opinion at its API boundary, Base is permissive underneath. This is correct behavior and won't cause issues during pass-through. → design-outline.md § "Testing Strategy"

- **Interaction tokens stay on Card's wrapper.** `blend.hoverDarker`, `blend.pressedDarker`, and `motion.focusTransition` are Card-specific interaction tokens. Base only has `blend.hoverDarker` for its simpler `hoverable` behavior. After the refactor, these tokens must be applied by Card's interaction layer independently of Base — they don't get delegated. This reinforces the interaction layer boundary described in the outline. → design-outline.md § "Platform-Specific Composition Questions"

- **No Application MCP impact.** The MCP indexes from `schema.yaml`, which already declares `composition.internal: Container-Base`. The refactor makes implementation match what the MCP already believes is true. Recommend a post-refactor sanity check via `getComponent("Container-Card-Base")` to verify `resolvedTokens.composed` is unchanged. → design-outline.md § "Scope"

- [@LINA] When you refactor the platform files, will Card's `hoverable` prop pass-through to Base be set to `true` when `interactive` is `true`? The design outline mentions this ("Internally sets hoverable: true on Container-Base") but it's worth confirming the token resolution path — Base uses `blend.hoverDarker` for its hover state, and Card also uses `blend.hoverDarker` for its interaction layer. If both apply, you'd get double-darkening on hover. Card should either set `hoverable: false` on Base and handle hover entirely, or set `hoverable: true` and not apply its own hover blend. → design-outline.md § "Platform-Specific Composition Questions" -- [ADA R1]

#### [LINA R1]

**Re: Web composition approach (W1/W2/W3)**

**Recommend W1 (nested custom element).** → design-outline.md § "Platform-Specific Composition Questions"

- W2 (importing Base's style-building logic) isn't composition — it's code reuse. It wouldn't satisfy the compliance test, and it couples Card to Base's internal API. If Base refactors its internals, Card breaks.
- W3 (light DOM) breaks encapsulation, which defeats the purpose of Shadow DOM.
- W1 is standard Web Component composition. Nested shadow roots add complexity, but it's the *correct* complexity — it's how Web Components are designed to compose. The interaction layer lives on Card's root element, and `<container-base>` handles layout inside it.

**Why W1 works with our architecture:**
- CSS custom properties (our token system) pierce shadow boundaries by design — token resolution flows naturally.
- Card already uses `composed: true` on its custom events — event bubbling works across shadow boundaries.
- Card currently renders a semantic element (`<section>`, `<article>`, `<div>`) as its root inside shadow DOM. With W1, Card renders its interaction wrapper, and Base renders the semantic element. Need to verify the semantic element ends up in the right place in the accessibility tree — solvable detail, not a blocker.

**Re: iOS (I1) and Android (A1)**

Both are as straightforward as they appear. SwiftUI and Compose are designed for this exact pattern — wrapping a child view/composable with interaction modifiers. → design-outline.md § "Platform-Specific Composition Questions"

The modifier ordering concern is real but minor: interaction modifiers (`.onTapGesture`, `.onHover`, `clickable`, `hoverable`) go on the *outer* wrapper, not on the ContainerBase child. As long as we follow that ordering, Base's layout modifiers won't interfere.

**Re: Ada's double-darkening catch**

Ada's right — this is a real issue. Card must set `hoverable: false` on Base and handle all hover/press/focus states itself. → design-outline.md § "Platform-Specific Composition Questions"

Rationale: Card's interaction layer is strictly richer than Base's `hoverable` behavior. Card does hover (8% darker) + press (12% darker) + focus ring + keyboard activation. Base only does hover (8% darker). If Card delegates hover to Base, Card loses control of the hover color calculation and can't coordinate it with press/focus states. The clean boundary is: Base handles layout, Card handles all interaction.

This means on all three platforms, Card passes `hoverable: false` (or omits the prop) to Base, and applies its own blend-based hover/press colors to the wrapping interaction layer.

**Re: Ada's dead code note on Card's tokens.ts**

Agreed this is a post-refactor cleanup question. Card's token maps (`cardPaddingTokenMap`, etc.) become unused in platform files if Base handles resolution. But they still serve as the type-safe API boundary — Card's types constrain which values consumers can pass. Recommend keeping the type definitions, flagging the getter functions for cleanup in a follow-up. Not in scope for this spec. → design-outline.md § "Scope"

**Re: Ada's "pass prop values, not resolved token names"**

Confirmed — this is the correct approach and I'll follow it. Card passes `'150'` to Base's `padding`, not `'space.inset.150'`. Base's own token maps handle resolution. → design-outline.md § "Platform-Specific Composition Questions" -- [LINA R1]

#### [THURGOOD R2]

- Incorporated ADA R1: prop pass-through rule (values not token names), interaction token boundary (Card owns all interaction, Base owns layout), no MCP impact, padding type mismatch is manageable, tokens.ts dead code as out-of-scope cleanup → design-outline.md § "Platform-Specific Composition Approach" § "Scope"
- Incorporated LINA R1: W1 selected for web (with W2/W3 rejection rationale), I1/A1 confirmed for native, hover double-darkening fix (hoverable: false on Base), semantic element placement flagged for implementation → design-outline.md § "Platform-Specific Composition Approach"
- Replaced open questions section with resolved decisions
- Added tokens.ts cleanup to out-of-scope
- No items rejected. Both agents aligned on all decisions. Ada's double-darkening catch was the most valuable finding — would have been a bug in implementation.

---

## Requirements Feedback

### Context for Reviewers

5 requirements covering: composition on all platforms (Req 1), preserved external behavior (Req 2), interaction layer boundary (Req 3), prop curation preserved (Req 4), test continuity (Req 5). Documentation requirements waived — no external API changes.

**@ADA**: Review Req 1 AC 4 (prop pass-through rule) and Req 3 (interaction boundary) — do these accurately capture your R1 feedback? Any token resolution edge cases not covered?

**@LINA**: Review Req 2 (preserved behavior) and Req 5 (test continuity) — are the acceptance criteria specific enough for implementation? Any structural test assertions you already know will break?

#### [ADA R1]

**Re: @ADA — Req 1 AC 4 (prop pass-through rule)**

- **Req 1 AC 4 needs correction.** The current wording says Card "SHALL pass raw prop values (e.g., `'150'`, `'surface.primary'`), not resolved token names." This is only correct for props where Card and Base share the same value vocabulary (padding, border, borderRadius, semantic). It is **incorrect** for background, shadow, and borderColor. → requirements.md § "Requirement 1"

  **The problem:** Base's `background` prop expects a `ColorTokenName` (e.g., `'color.surface.primary'`). Card's `CardBackgroundValue` is `'surface.primary'` — without the `color.` prefix. If Card passes `'surface.primary'` to Base, Base's `mapColorToCSS()` will generate `var(--surface-primary)` instead of `var(--color-surface-primary)` — wrong CSS variable, no background rendered.

  Same issue for:
  - `shadow`: Card uses `'container'`, Base expects `ShadowTokenName` (`'shadow.container'`)
  - `borderColor`: Card uses `'border.default'`, Base expects `ColorTokenName` (`'color.border.default'`)

  **Props that DO pass through directly** (same value vocabulary): `padding` (all variants), `border`, `borderRadius`, `semantic`, `accessibilityLabel`.

- **Recommended AC 4 revision:** "WHEN Container-Card-Base passes props to Container-Base THEN it SHALL pass values that Base's prop types accept. For props with shared vocabulary (padding, border, borderRadius, semantic, accessibilityLabel), Card passes its prop values directly. For props where Card uses shorthand values (background, shadow, borderColor), Card SHALL resolve to Base's expected token name format before passing." → requirements.md § "Requirement 1"

  This is more precise and prevents the implementation bug I described. Card's `tokens.ts` getter functions are NOT dead code for these three props — they're needed for the resolution step.

- **Correction to my R1 design outline feedback:** I said Card's `tokens.ts` getter functions become "partially dead code." That was wrong for `getCardBackgroundToken()`, `getCardShadowToken()`, and `getCardBorderColorToken()` — those are still needed to resolve Card's shorthand values to Base's expected format. The padding, border, and borderRadius getters do become unused in platform files since those values pass through directly. → design-outline.md § "Scope"

**Re: @ADA — Req 3 (interaction boundary)**

- **Req 3 accurately captures the interaction boundary.** AC 1 (`hoverable: false` on Base), AC 2 (Card handles all interaction), AC 4 (Base handles layout only) — all correct. No additional token edge cases. → requirements.md § "Requirement 3"

- [@LINA] Given the background/shadow/borderColor resolution finding above, does this change your implementation approach? Card can't do a simple attribute-forwarding pattern for all props — it needs selective resolution for the three token-name props while passing others through directly. → requirements.md § "Requirement 1" -- [ADA R1]

#### [LINA R1]

**Re: Ada's Req 1 AC 4 correction**

Ada's right — my R1 confirmation of "pass raw prop values" was too broad. I was thinking about padding/border/borderRadius where the vocabularies match and didn't think through the three props where Card uses shorthand. → requirements.md § "Requirement 1"

Agree with Ada's recommended AC 4 revision. The implementation pattern becomes two-track:
- **Direct pass-through** (same vocabulary): padding (all variants), border, borderRadius, semantic, accessibilityLabel
- **Resolve then pass** (shorthand → full token name): background, shadow, borderColor — using Card's existing `tokens.ts` getter functions

This means Card's `tokens.ts` is NOT dead code for those three props. The getter functions for background, shadow, and borderColor remain in active use. Only the padding, border, and borderRadius getters become unused in platform files. Corrects my R1 design outline feedback.

This doesn't change the overall implementation approach — it just means the attribute-forwarding isn't uniform. Card still composes Base on all platforms; it just does a small resolution step for 3 of the ~12 props before forwarding.

**Re: Req 2 (Preserved Behavior)**

Acceptance criteria are specific enough for implementation. One minor gap: no AC explicitly covers the `semantic` prop pass-through. Card supports `div`, `section`, `article` — these pass directly to Base since it's the same vocabulary. Covered implicitly by AC 1 ("any valid prop combination") but could be explicit if Thurgood wants it. Not a blocker. → requirements.md § "Requirement 2"

**Re: Req 5 (Test Continuity)**

I expect web tests with shadow DOM hierarchy assertions will break — the internal DOM structure changes from Card rendering its own semantic element to Card wrapping a `<container-base>` that renders the semantic element. I don't know the exact tests yet (Thurgood's audit), but it's predictable. iOS and Android tests are less likely to break since SwiftUI/Compose tests typically assert on behavior, not view hierarchy. → requirements.md § "Requirement 5" -- [LINA R1]

#### [THURGOOD R2]

- Incorporated ADA R1: Fixed Req 1 AC 4 to two-track prop forwarding (direct pass-through for shared vocabulary, resolve-then-pass for background/shadow/borderColor). Updated design outline prop pass-through rule and dead code note accordingly. → requirements.md § "Requirement 1" AC 4, design-outline.md § "Prop Pass-Through Rule" § "Scope"
- Acknowledged LINA R1: Req 2 semantic prop gap is covered by AC 1 ("any valid prop combination") — leaving implicit rather than adding another AC. Web shadow DOM test breakage is expected and covered by Req 5 AC 1-2 (pass or deliberately update with rationale).
- Leonardo review still pending — context added to feedback doc.
- Ada's catch on the background/shadow/borderColor resolution is the second implementation bug prevented by this feedback cycle. The two-track pattern is more complex than uniform pass-through but it's correct.

#### [THURGOOD R3]

- Incorporated LEONARDO R1: Added Req 1 AC 6 (runtime composition verification — not just file-level structural check). Added Req 3 AC 5 (accessibility tree preservation — semantic element nesting must not introduce invalid ARIA nesting).
- Leonardo's non-blocking observations noted: pattern documentation follow-up (out of scope, future task) and implementation order consideration (web-first vs native-first — for task planning).
- Leonardo's @LINA question on semantic element placement in the composed accessibility tree is a critical implementation detail for Lina to verify during web refactor.
- Three implementation bugs now prevented by the feedback cycle before any code was written: (1) double-darkening on hover, (2) background/shadow/borderColor resolution mismatch, (3) potential accessibility tree nesting violation.

#### [LEONARDO R1]

**Overall assessment:** Requirements are well-scoped and precise. The feedback cycle already prevented two implementation bugs (double-darkening, background/shadow/borderColor resolution) before any code was written. Two concrete suggestions below; neither is a blocker.

**Re: Req 1 — Runtime composition verification gap**

AC 5 relies on the composition compliance test, which is a structural/file-level check. It verifies that the platform file *contains* the right calls, not that Card actually *renders through* Base at runtime. The entire motivation for this spec is that the schema said one thing and the implementation did another — a structural test could pass while runtime composition still doesn't happen. → requirements.md § "Requirement 1" AC 5

Recommend adding an AC requiring a runtime test that verifies Base is actually instantiated within Card's rendering on each platform. The design outline already identifies this gap ("a runtime test confirming the composed component renders would be stronger"). Making it an explicit AC ensures it doesn't get deprioritized during implementation.

**Re: Req 2/3 — Web accessibility tree verification**

Lina R1 flagged that with W1, Card renders the interaction wrapper and Base renders the semantic element (`<section>`, `<article>`, `<div>`). The semantic element needs to end up in the correct position in the accessibility tree for screen readers. This is noted as a "solvable detail" in the design outline but no requirement AC explicitly verifies it. → requirements.md § "Requirement 2" or § "Requirement 3"

Accessibility tree structure is easy to miss in visual comparison (Req 2 AC 1). Recommend an explicit AC — either under Req 2 (preserved behavior includes accessibility tree) or Req 3 (interaction boundary doesn't disrupt semantic structure). Given this is precedent-setting for future type-primitives, being explicit reduces the chance of the pattern carrying a subtle accessibility gap forward.

**Cross-platform architecture observations (non-blocking):**

- **Pattern documentation follow-up.** The two-track prop forwarding, interaction layer boundary, and `hoverable: false` convention need to be documented as the canonical type-primitive composition pattern — not just implemented in Container-Card-Base's source. When Container-Panel and Container-Hero arrive, platform agents need a reference. Correctly out of scope for this spec; flagging for follow-up.

- **Platform implementation order.** Web (W1) carries the most risk — nested shadow roots, event propagation, accessibility tree ordering. If prioritizing implementation order, doing web first de-risks the hardest platform. Counter-argument: doing iOS/Android first validates the composition pattern on simpler platforms before tackling web complexity. Either approach is defensible; raising for Peter/Lina's consideration during task planning.

- [@LINA] For the web semantic element placement: after the refactor, does the semantic element rendered by Base end up as a descendant of Card's interaction wrapper in the composed accessibility tree? If Card's wrapper is a `<div role="button">` and Base renders a `<section>` inside it, the nesting semantics may differ from the pre-refactor structure where Card directly rendered the `<section>`. Worth verifying during implementation. → design-outline.md § "Platform-Specific Composition Approach" -- [LEONARDO R1]

---

## Design Feedback

### Context for Reviewers

4 design decisions, platform-specific implementation details for all 3 platforms, testing strategy, and correctness properties. The composition boundary diagram and prop forwarding table are the key references.

**@ADA**: Review the prop forwarding table — does the resolve-then-pass mapping for background/shadow/borderColor match the actual getter function outputs in Card's `tokens.ts`?

**@LINA**: Review the web Shadow DOM structure (pre/post diagrams), the accessibility tree concern for interactive cards, and the iOS/Android pseudocode. Is the implementation approach workable? Any concerns about the slot relocation (Card's slot moves inside Base)?

**@LEONARDO**: Review the accessibility tree concern in the web section. Your R1 flagged the semantic element nesting — the design proposes suppressing Base's semantic element for interactive cards if ARIA nesting is invalid. Does that approach satisfy your concern?

#### [ADA R1]

**Re: @ADA — Prop forwarding table verification**

- **Background mapping: correct.** `getCardBackgroundToken('surface.primary')` → `'color.surface.primary'`. Base's `mapColorToCSS('color.surface.primary')` → `background: var(--color-surface-primary)`. Chain verified end-to-end through `tokenToCssVar()` (dot-to-dash replacement). Same for `surface.secondary` and `surface.tertiary`. → design.md § "Prop Forwarding"

- **Shadow mapping: correct.** `getCardShadowToken('container')` → `'shadow.container'`. Base's `mapShadowToCSS('shadow.container')` → `box-shadow: var(--shadow-container)`. → design.md § "Prop Forwarding"

- **BorderColor mapping: correct.** `getCardBorderColorToken('border.default')` → `'color.border.default'`. `getCardBorderColorToken('border.subtle')` → `'color.structure.border.subtle'`. Both are valid `ColorTokenName` values that Base's `mapColorToCSS()` will handle correctly. → design.md § "Prop Forwarding"

- **`'none'` handling needs a note.** Card's token maps resolve `'none'` to `''` (empty string) for shadow, border, and padding. On web, Card should omit the attribute entirely rather than setting it to an empty string — Base uses `getAttribute()` which returns `null` for absent attributes, and its mapping functions handle `null` correctly (return `''`). Setting an empty string attribute could produce unexpected behavior since Base casts to typed values (e.g., `'' as ShadowTokenName`). This applies to all three platforms conceptually, but the web implementation is where it's most concrete. → design.md § "Components and Interfaces"

  Not a design change — just an implementation note for Lina. When Card's prop value maps to `'none'`, don't set the attribute/prop on Base. Let Base use its own defaults (which are all `undefined`/`null` → no styling applied).

- **Correctness properties look solid.** All 6 properties in the Correctness Properties section are verifiable and cover the key risks. No gaps from the token perspective. → design.md § "Correctness Properties"

#### [LINA R1]

**Re: Web Shadow DOM structure**

The pre/post diagrams are accurate. The slot relocation (consumer content flows through Card's shadow DOM → Base's shadow DOM → Base's slot) is standard nested Web Component composition. No concerns — this is how it's supposed to work. → design.md § "Components and Interfaces"

**Re: Leonardo's accessibility tree concern — interactive cards**

Agree with the design's proposed approach: suppress Base's semantic element for interactive cards by passing `semantic="div"` to Base when `interactive="true"`. → design.md § "Components and Interfaces"

Rationale:
- **Non-interactive card**: Card wrapper is a plain `<div>`, Base renders the consumer's chosen semantic element (`<section>`, `<article>`, `<div>`). Accessibility tree sees the semantic element — identical to pre-refactor.
- **Interactive card**: Card wrapper has `role="button"` or `role="link"`. If Base also renders `<section>` inside it, screen readers see a sectioning element inside a button — semantically confusing and potentially different from pre-refactor where Card directly rendered `<section role="button">`. Passing `semantic="div"` to Base when interactive avoids this — the ARIA role on Card's wrapper is the meaningful semantic, Base just provides a neutral container.

This needs to be platform-specific: on web, the semantic element matters for the accessibility tree. On iOS/Android, the semantic element concept doesn't exist (it's a web-only prop per the schema), so this concern is web-only.

**Re: Ada's `'none'` handling note**

Noted — will omit attributes/props on Base when Card's value resolves to `'none'` rather than passing empty strings. On web, this means not calling `setAttribute()` for those props. On iOS/Android, this means passing `nil`/`null` for optional parameters. → design.md § "Components and Interfaces"

**Re: iOS/Android pseudocode**

Workable. One implementation note: on iOS, the `resolvedBackground`/`resolvedShadow`/`resolvedBorderColor` values should be computed properties rather than inline resolution in the body, to keep the SwiftUI view builder clean. Minor detail, not a design concern. → design.md § "Components and Interfaces"

**Re: Decision 4 (Implementation Order)**

I prefer web-first. It's the hardest platform (nested shadow roots, slot relocation, accessibility tree verification), and if we hit a fundamental issue with W1, I'd rather discover it before investing in iOS/Android. The native platforms are straightforward enough that they'll go quickly once the web pattern is validated. → design.md § "Design Decisions"

**Re: Correctness Properties**

All 6 are verifiable. I'd add one more: "Consumer content (slot) renders correctly through the nested composition — no content loss or duplication from the slot relocation." This is low-risk but worth verifying explicitly since the slot moves from Card's shadow DOM into Base's shadow DOM. → design.md § "Correctness Properties" -- [LINA R1]

#### [LEONARDO R1]

**Re: @LEONARDO — Accessibility tree concern for interactive cards**

Lina's approach (pass `semantic="div"` to Base when `interactive="true"`) satisfies my concern. The reasoning is sound: a `<section>` inside a `role="button"` is semantically confusing, and the pre-refactor behavior was `<section role="button">` — a single element carrying both semantics. Suppressing Base's semantic element for interactive cards preserves the pre-refactor accessibility tree shape. This is the right call.

One nuance to verify during implementation: when `interactive="false"` and the consumer sets `semantic="article"`, the post-refactor accessibility tree should show the `<article>` element in the same tree position as pre-refactor. With W1, the `<article>` is now rendered by Base inside Card's shadow DOM rather than directly by Card. Confirm that screen readers (VoiceOver, NVDA) expose the semantic element identically — shadow DOM boundaries shouldn't affect this, but it's worth a manual check given this is precedent-setting. → design.md § "Components and Interfaces"

**Re: Slot relocation through nested shadow boundaries**

Lina confirmed the slot relocation is standard nested Web Component composition. Agreed. Two implementation details worth flagging:

1. **Nested slot projection.** Card currently has a `<slot>` in its shadow DOM. With W1, Card's `<container-base>` needs to contain a `<slot>` that Base then picks up via its own internal `<slot>`. Verify that this double-slot projection works correctly — it's valid per spec but has historically had browser quirks.

2. **`::slotted()` selector reach.** If Card's own styles use `::slotted()` to style projected children, those selectors may need updating since children are now projected through Base's shadow boundary. `::slotted()` only reaches one level deep. Worth checking during implementation.

Neither is a blocker — just the kind of thing that causes subtle bugs if not anticipated.

**Re: Cross-platform interaction wrapper consistency**

The design describes Card's interaction wrapper handling hover/press/focus on all platforms. I want to confirm the visual mechanism is equivalent:

- Does the wrapper add a background color overlay on top of Base's background (layered)?
- Or does it modify Base's background color directly (e.g., via CSS custom property override)?

The current implementation applies blend colors directly to the card's own background. If the post-refactor wrapper uses a different mechanism (overlay vs. direct modification), the visual result could differ subtly — especially for semi-transparent backgrounds or borders. This is a visual regression risk worth testing explicitly with the demos.

**Re: Agent Coordination table**

Missing Leonardo's role. As cross-platform architect, I should review implementations for consistency after Lina completes each platform. Suggest adding:

| Cross-platform consistency review | Leonardo | Review implementations for pattern consistency across platforms |

**Re: Success Criteria #5 vs. Scope contradiction**

Success Criteria #5 says "The composition pattern is documented for reuse by future type-primitives." The Scope section explicitly lists documentation as out of scope. These contradict each other. Recommend removing #5 from success criteria and tracking pattern documentation as a follow-up — the spec is well-scoped and adding documentation risks creep.

**Re: Schema description correction**

The `interactive` prop description in `Container-Card-Base.schema.yaml` still says "Internally sets hoverable: true on Container-Base." After Ada's R1 catch and the design resolution, Card sets `hoverable: false` on Base. This should be corrected as part of this refactor. → Container-Card-Base.schema.yaml § `interactive` property

**Re: Implementation order**

Agree with Lina's preference for web-first. It's the hardest platform and the one most likely to surface fundamental issues with the composition approach. iOS and Android will go quickly once the web pattern is validated. Counter-argument: if web hits a blocker, you've invested time without a working platform to show for it. But given the native platforms are straightforward (Lina's assessment, which I trust), the risk of a web blocker is low enough that front-loading it is the right call. → design.md § "Design Decisions" -- [LEONARDO R1]

#### [THURGOOD R2]

- Incorporated ADA R1: `'none'` handling note — omit attributes rather than passing empty strings. Added as correctness property #8. No design changes needed.
- Incorporated LINA R1: Added correctness property #7 (slot content integrity). Resolved implementation order to web-first. Accessibility approach confirmed (`semantic="div"` for interactive cards).
- Incorporated LEONARDO R1: Resolved accessibility approach (approved). Added nested slot projection and `::slotted()` notes to web section. Added Leonardo's cross-platform review role to agent coordination. Fixed Success Criteria #5 contradiction with Scope. Added schema description correction to in-scope. Implementation order resolved to web-first.
- Leonardo's interaction wrapper mechanism question (overlay vs. direct modification) is an implementation detail for Lina — the current implementation uses direct background modification via blend utilities, and the refactor should preserve this mechanism on Card's wrapper.
- Four implementation bugs/issues now prevented by the feedback cycle: (1) double-darkening, (2) background/shadow/borderColor resolution, (3) accessibility tree nesting, (4) `'none'` → empty string attribute handling.

---

## Tasks Feedback

### Context for Reviewers

3 parent tasks, 11 subtasks. Task 1 (web — highest risk, done first), Task 2 (iOS + Android), Task 3 (cleanup and compliance). Web-first per Lina and Leonardo's recommendation.

**@LINA**: You own the bulk of implementation (Tasks 1.2, 1.3, 1.4, 2.1, 2.2, 3.2). Review scope and sequencing — does the web test audit (1.1, Thurgood) before your refactor (1.2) give you what you need? Any missing subtasks?

**@LEONARDO**: You have cross-platform review tasks (1.5, 2.3). Review scope — is this the right level of review, or do you need more/less?

**@ADA**: No implementation tasks assigned to you. Review for any token-related subtasks that should exist but don't.

#### [ADA R1]

**Re: @ADA — Missing token-related subtasks**

- **Native token resolution gap — this is a blocker for Tasks 2.1 and 2.2.** The two-track prop forwarding design assumes Card resolves `'surface.primary'` → `'color.surface.primary'` and passes that to Base. This works on web because `tokenToCssVar()` is a mechanical dot-to-dash conversion. It does NOT work on iOS or Android. → tasks.md § "Task 2"

  **Evidence:**
  - iOS `resolveColorToken()` handles `"color.surface"` but NOT `"color.surface.primary"`, `"color.surface.secondary"`, or `"color.surface.tertiary"`. Passing `"color.surface.primary"` falls through to the default case and returns `colorCanvas` (white) — wrong color, silent failure.
  - Android `resolveColorToken()` handles `"color.structure.surface"` but NOT the `.primary`/`.secondary`/`.tertiary` variants. Same silent failure to `colorStructureCanvas`.
  - Card's current iOS implementation bypasses Base entirely — it uses its own `CardBackground` enum that resolves directly to `colorSurfacePrimary` (which maps to `DesignTokens.colorStructureSurfacePrimary`). This works today because Card never calls Base.

  **The same gap likely exists for `borderColor`:** Card resolves `'border.subtle'` → `'color.structure.border.subtle'`. Android's `resolveColorToken()` does handle `"color.structure.border.subtle"` (verified), but iOS's `resolveColorToken()` only handles `"color.border"` — not the subtle variant.

  **This means the refactor can't just pass resolved token names to Base on native platforms — Base doesn't know those token names.**

  **Three options:**
  1. **Extend Base's native token mappings** to handle the full set of color token names that Card needs to pass. This is the cleanest long-term fix but expands the scope — it's a change to Container-Base, which the design outline explicitly lists as out of scope.
  2. **Card passes native-specific values instead of token names** on iOS/Android. Card's iOS implementation already has the `CardBackground` enum → `Color` resolution. Instead of passing a token name string, Card could pass the resolved `Color`/`Dp` value directly to Base. This requires Base's native APIs to accept resolved values, not just token name strings.
  3. **Card uses a platform-specific forwarding strategy.** On web, Card passes resolved token names (the two-track approach). On iOS/Android, Card passes the enum/type values that Base's native API already accepts — if Base's native API accepts them. This is the most pragmatic but adds platform divergence to the composition pattern.

  **My recommendation:** Option 1 is the right fix. Base's native token mappings are incomplete — they should handle the same token names that the web platform handles. This is a token system gap, not a Card-specific problem. If Container-Panel or Container-Hero need to pass `'color.surface.secondary'` to Base later, they'll hit the same wall.

  HOWEVER — this expands scope. It means touching Container-Base's native `TokenMapping.swift` and `TokenMapping.kt`, which the design outline says is out of scope. Peter needs to decide whether to expand scope or use a workaround.

  [@LINA] Can you verify how Base's iOS and Android implementations accept the `background` prop? Is it a string token name that goes through `resolveColorToken()`, or does the native API accept something else (like a `Color` value directly)? This determines which of the three options is viable. → tasks.md § "Task 2.1" § "Task 2.2" -- [ADA R1]

#### [LINA R1]

**Re: Ada's native token resolution blocker — verified, it's real.**

I checked Base's native implementations. Ada's analysis is correct:

- **iOS**: `ContainerBase` accepts `background: String?` which goes through `resolveContainerBaseColorToken()` → `resolveColorToken()`. The mapping only handles `"color.surface"` — not `"color.surface.primary"`, `"color.surface.secondary"`, or `"color.surface.tertiary"`. Unrecognized names fall through to `colorCanvas` (white).
- **Android**: Same pattern. `ContainerBase` accepts `background: String?` which goes through `resolveContainerBaseColorToken()`. The mapping only handles `"color.structure.surface"` — not the `.primary`/`.secondary`/`.tertiary` variants. Falls through to `colorStructureCanvas`.
- **Card's current native implementations** use typed enums (`CardBackground.surfacePrimary`) that resolve directly to `Color` values via `mapCardBackgroundToColor()`. They bypass Base entirely — which is why this gap was never hit.

**Same gap confirmed for shadow and borderColor on native:**
- iOS `resolveColorToken()` doesn't handle `"color.structure.border.subtle"` — only `"color.border"` variants
- Shadow mapping is similarly limited

**My recommendation: Option 1 (extend Base's native token mappings).**

Ada's right that this is a token system gap, not a Card-specific problem. Base's native `resolveColorToken()` should handle the same token names as the web platform. If we use Option 2 or 3, we're working around a gap that Container-Panel and Container-Hero will hit later.

HOWEVER — I want to be clear about the scope impact. This means:
- Touching `Container-Base/platforms/ios/TokenMapping.swift`
- Touching `Container-Base/platforms/android/TokenMapping.kt`
- Adding the missing token name mappings for surface variants, border.subtle, and shadow variants
- Testing that the new mappings resolve to the correct values

This is Ada's domain (token system), not mine (component implementation). I can add the mappings mechanically, but Ada should verify the resolved values are correct. And Peter needs to approve the scope expansion since the design outline explicitly said Container-Base changes are out of scope.

**Impact on tasks**: Tasks 2.1 and 2.2 are blocked until this is resolved. Task 1 (web) is unaffected — web token resolution works correctly. This reinforces the web-first implementation order.

**Proposed new subtask**: Insert a Task 2.0 — "Extend Base's native token mappings for surface/border/shadow variants" — assigned to Lina with Ada review, before Tasks 2.1 and 2.2. → tasks.md § "Task 2" -- [LINA R1]

#### [THURGOOD R2]

- Incorporated ADA R1 and LINA R1: Added Task 2.0 (extend Base's native token mappings) with Lina implementing and Ada verifying. Tasks 2.1 and 2.2 now depend on 2.0.
- Scope expansion approved by Peter. Design outline updated: removed "Changing Container-Base's implementation" from out-of-scope, added "Scope Expansion (Approved)" section documenting the native token mapping gap and approval.
- This is the fifth issue prevented by the feedback cycle: native token resolution would have silently returned wrong colors on iOS and Android. Ada's catch is the most impactful finding in this spec — it would have been extremely difficult to debug at runtime (silent fallback to default color, no error).
