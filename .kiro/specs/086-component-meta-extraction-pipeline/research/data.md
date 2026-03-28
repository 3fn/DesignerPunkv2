# Component Discoverability Research: Data

**Agent**: Data — Android Platform Engineer
**Spec**: 086
**Date**: 2026-03-27
**Instructions**: Answer based on your experience consuming DesignerPunk components for Android/Jetpack Compose implementation. Do not read other agents' research docs before completing yours.

---

## Component Discovery Tasks

For each task, describe how you would find the right component and the information you'd need to implement it.

### Task 1: Implement a card grid on a dashboard
You need to render a grid of stat cards in Jetpack Compose. Each card shows a number, a label, and an optional trend icon.

**How would you search for the right component(s)?**

I'd start with `find_components(purpose: "card")` in the Application MCP. That immediately returns Container-Card-Base and Container-Base, with clear whenToUse/whenNotToUse guidance that makes the choice obvious — Container-Card-Base is the right pick for elevated, visually distinct cards on a dashboard. The "dashboards" context tag confirms it. For the trend icon inside each card, I'd query `find_components(purpose: "icon")` or just know from prior work that Icon-Base is the primitive for inline icons.

**What information would you need to start implementing?**

- The Composable signature and parameters for ContainerCardBase (which props map to which Compose modifiers)
- Token constants for spacing the grid — what semantic tokens exist for grid gaps vs card internal padding
- Whether the card's `interactive` prop should be true (are these tappable stat cards or display-only?)
- The actual Kotlin token constant names — the MCP gives me token names like `space.inset.150` but I need to know the Kotlin constant path (e.g., `DesignTokens.space.inset150` or however it's structured in `DesignTokens.android.kt`)
- Leonardo's spec would tell me the grid layout (LazyVerticalGrid column count, adaptive vs fixed)

**What's missing from what you currently find?**

Three things stand out:

1. **No Android-specific API surface in the MCP.** The `get_component_full` response gives me props with types like `'none' | '100' | '150' | '200'` — that's the cross-platform contract. But I need to know the actual Composable function signature. Is it `ContainerCardBase(padding: ContainerCardPadding = .p150, ...)` or `ContainerCardBase(padding: String = "150", ...)`? Right now I have to open the `.android.kt` file to find out. The MCP tells me *what* the component does but not *how to call it* on my platform.

2. **Token constant mapping is absent.** The MCP says the component uses `space.inset.150`. The Android implementation file references Kotlin constants. But there's no bridge in the MCP that says "on Android, `space.inset.150` is accessed as `DesignTokens.Space.Inset150`" (or whatever the actual path is). I have to go read the token file. And right now, `DesignTokens.android.kt` doesn't even exist yet — only `MotionTokens.kt` is in the Android token directory.

3. **No layout/grid guidance.** The MCP tells me about individual components but nothing about how to compose them into a grid. That's arguably Leonardo's job via the screen spec, but if I'm exploring on my own, there's no "dashboard layout" pattern or template that says "use LazyVerticalGrid with these token-based gaps."

---

### Task 2: Add a tab bar to a product screen
An Android screen needs a bottom navigation bar with 4-5 tabs, each with an icon and label.

**How would you search for the right component(s)?**

`find_components(purpose: "tab")` or `find_components(purpose: "navigation")` both surface Nav-TabBar-Base. The whenToUse guidance is clear: "Primary app navigation between 3-5 top-level sections" and "Persistent bottom navigation on mobile apps (iOS, Android, mobile web)." The whenNotToUse correctly steers me away from Nav-SegmentedChoice-Base for this use case.

**What information would you need to start implementing?**

- The Composable signature — how do I pass the tab definitions (icon references, selected state, onSelect callback)?
- How the "full-width (native)" platform variant works in Compose — the MCP mentions build-time platform separation with "floating pill (web) vs full-width (native)" but doesn't explain what that means for my implementation
- System bar / navigation bar inset handling — does the component handle bottom insets internally, or do I need to apply `WindowInsets.navigationBars` padding?
- The three-phase animation choreography — is this built into the component, or do I need to implement it?
- Badge composition slot — the MCP says "empty in v1" but I need to know if there's a slot parameter I should leave open for future use

**What's missing from what you currently find?**

1. **The task asks for tabs with labels, but Nav-TabBar-Base is icon-only (v1).** The MCP correctly notes "labels deferred to Nav-TabBar-Labeled" — but Nav-TabBar-Labeled doesn't exist yet. This is a real gap: the task can't be fully implemented with what's available. The MCP surfaces this information, which is genuinely helpful — I'd rather know upfront than discover it mid-implementation. But it doesn't tell me what to do about it. Should I implement icon-only and plan for labels later? Use a custom solution? Escalate to Leonardo? That decision guidance is missing.

2. **Platform-specific behavioral details are thin.** The description mentions "full-width (native)" but the contracts and props don't explain how Android specifically handles this. On Android, bottom navigation has specific Material Design conventions around safe area, gesture navigation overlap, and predictive back. The MCP doesn't address any of this.

3. **Readiness is "development" not "production-ready."** The MCP surfaces this, which is useful. But it doesn't tell me what "development" means practically — is the Android implementation complete and just not tested? Is it a stub? Is the contract finalized but the Kotlin code not written? I have to go check the `.android.kt` file to find out.

---

### Task 3: Build a form with validation feedback
An Android form needs text inputs with real-time validation, error states, and a submit action.

**How would you search for the right component(s)?**

`find_components(purpose: "input")` returns the full FormInput family — Input-Text-Base, Input-Text-Email, Input-Text-Password, Input-Text-PhoneNumber, plus checkbox and radio components. The semantic variants (Email, Password, PhoneNumber) are well-differentiated with clear whenToUse guidance. For the submit action, `find_components(purpose: "button")` gives me Button-CTA with "form-footers" in its contexts.

This is actually where the MCP works best for me — the FormInput family is well-organized with clear inheritance (semantic variants extend Input-Text-Base) and the alternatives guidance prevents me from using the wrong component.

**What information would you need to start implementing?**

- Validation contract details — when does validation fire (on blur? on change? real-time as described in the task)? The MCP says Input-Text-Base has a "validation" contract category but I need the specifics
- Error state rendering — how does the error message display? Is it built into the component or do I compose it externally?
- The float label animation — is this built into the Android implementation or do I need to implement it?
- Form-level state management — how do multiple inputs coordinate validation state for the submit button? Is there a form-level pattern?
- Keyboard handling — does the component handle IME actions (next field, done) or do I wire that up?

**What's missing from what you currently find?**

1. **No form-level orchestration pattern.** The MCP gives me individual input components and a submit button, but there's no "form" pattern that shows how they compose together. The `list_experience_patterns` might have something, but from the component discovery side, I'm assembling the form myself without guidance on validation orchestration, field ordering, or error summary patterns.

2. **Validation timing is ambiguous.** The task says "real-time validation" but the MCP's validation contracts don't specify timing. Input-Text-Email says "validates email format on blur" — that's not real-time. Is that a contract constraint I must honor, or can I add onChange validation too? This is a behavioral contract question that the MCP surfaces the existence of but doesn't fully answer.

3. **Android keyboard integration is absent.** On Android, form UX depends heavily on IME actions (`ImeAction.Next`, `ImeAction.Done`), keyboard type (`KeyboardType.Email`), and autofill hints. The semantic variants (Email, Password, PhoneNumber) mention "email keyboard type" and "autocomplete" in their descriptions, but the actual Compose implementation details — `KeyboardOptions`, `KeyboardActions`, autofill modifiers — aren't in the MCP. I need to read the source.

---

## General Questions

1. When you receive a screen spec from Leonardo, what component information do you need that you don't currently have easy access to?

The biggest gap is the **translation layer between Leonardo's cross-platform spec and my Android implementation.** Leonardo's spec says "use Container-Card-Base with padding='150' and interactive=true." The MCP confirms that component exists and those props are valid. But then I need to write Kotlin, and neither the spec nor the MCP tells me:

- The actual Composable function name and parameter types
- Which Kotlin token constants to import
- Android-specific behavioral nuances (insets, gesture handling, system UI interaction)
- Whether the Android implementation is complete or I'm building from the contract

I end up reading the `.android.kt` source files every time. The MCP gets me to the right component quickly but doesn't get me to working Kotlin code.

2. Do you use the Application MCP to discover components, or do you rely on other sources (READMEs, source code, asking Lina)?

I use the Application MCP as my first step — `find_components` for discovery, `get_component_full` for contract details. It's genuinely good for answering "which component should I use?" and "what does this component promise to do?"

But for actual implementation, I switch to reading source code almost immediately. The `.android.kt` files are my real reference. The MCP is a discovery and validation tool, not an implementation guide. I'd estimate my workflow is: 20% MCP for discovery/selection → 80% source code for implementation.

I don't typically ask Lina directly — that routing goes through Leonardo per the collaboration model. But I do read Lina's component documentation (READMEs, design docs) when the source code alone isn't enough to understand *why* something is built a certain way.

3. When you find a component, is the Android-specific implementation information (Composable name, parameters, token constants) easy to find?

No. It requires navigating to `src/components/core/[ComponentName]/platforms/android/[ComponentName].android.kt` and reading the source. The file naming convention is consistent, which helps — I can predict the path. But "easy to find" and "predictable path to source code" are different things.

What I'd call easy: the MCP telling me `ContainerCardBase(padding: ContainerCardPadding = .P150, interactive: Boolean = false, content: @Composable () -> Unit)` directly.

What I actually do: open the file, scan for the `@Composable` function, read the parameter list, trace the token references back to understand what values are valid.

4. Is there anything about the current component metadata that's confusing, incomplete, or unhelpful for Android implementation?

A few things:

- **Web-centric contract language.** Contracts reference "ARIA role," "aria-label," "tabindex," "data-testid" — these are web concepts. The Android equivalents (Semantics, contentDescription, testTag) are mentioned in prop descriptions but not in the contracts themselves. When I read a contract like `accessibility_aria_role`, I have to mentally translate to "this means `Role.Button` in Compose Semantics." The contracts should either be platform-neutral or have platform-specific notes.

- **Token names don't match Kotlin constants.** The MCP says `space.inset.150` but the Kotlin code might use `SpaceTokens.inset150` or `DesignTokens.Space.Inset.p150` — I genuinely don't know without checking because the token generation pipeline for Android isn't fully built out yet (only `MotionTokens.kt` exists in the Android token directory).

- **The `semantic` prop (div/section/article) is web-only but appears in the cross-platform prop list.** The description says "web only" but it's not filtered out of the Android-relevant view. Minor, but it adds noise when I'm scanning for what I need to implement.

5. What would make your component discovery workflow faster or more reliable?

In priority order:

1. **Platform-specific API signatures in the MCP.** A `platformAPI` field per component that gives me the actual Composable signature for Android. Even just the function name and parameter types would save significant time.

2. **Token constant mapping per platform.** When the MCP says a component uses `space.inset.150`, it should also tell me the Kotlin constant path. This is a generation pipeline concern (Ada's domain), but the consumer impact lands on me.

3. **Readiness detail per platform.** "development" readiness should break down to: contract finalized (yes/no), Android implementation exists (yes/no), Android tests exist (yes/no). Right now I have to check the filesystem to know if I'm implementing from scratch or consuming an existing implementation.

4. **Filter out web-only props and contracts.** When I query as an Android consumer, I shouldn't have to mentally skip `semantic: 'div' | 'section' | 'article'` or `interaction_pressable` contracts that only apply to web.

6. What does the Application MCP tell you that's different from what you already know about implementing Android components and consuming design systems?

The MCP's real value for me is **component selection guidance and behavioral contracts** — things I wouldn't know from general Android/Compose experience.

Without the MCP, I know how to build a card in Compose, how to build a tab bar, how to build a form. That's platform knowledge. What I don't know is: which DesignerPunk component to use, what its design intent is, what behavioral promises it makes, and how it relates to other components in the system.

Specifically, the MCP gives me:
- **whenToUse / whenNotToUse** — this is genuinely valuable. It prevents me from using Nav-SegmentedChoice-Base when I should use Nav-TabBar-Base.
- **Alternatives with rationale** — knowing *why* I'd pick one component over another.
- **Composition rules** — which components can be children of which, required children, internal components.
- **The "no disabled states" philosophy** — this is a DesignerPunk-specific design decision I wouldn't know from Android conventions. Material Design has disabled states everywhere; DesignerPunk removes them. The MCP makes this clear.

What it doesn't give me that I'd get from general Android knowledge: how to actually implement any of this in Compose. The MCP is a design system oracle, not a platform implementation guide. That's probably the right boundary — but it means I always need a second source.

7. What's an example of something you understood before accessing the Application MCP that changed after accessing it? What's an example of something that stayed the same?

**Changed:** I assumed Container-Card-Base would be a standalone component with its own layout primitives. The MCP revealed it's a type-primitive that composes Container-Base internally — it's a curated API surface over a more flexible base. That changes how I think about the implementation: I'm not building card layout from scratch, I'm constraining Container-Base's API. The composition relationship (`internalComponents: ["Container-Base"]`) and the curated prop subset (fewer padding options, fewer background options) told me the design philosophy before I read a line of Kotlin.

I also didn't expect the token mode map (`tokenModeMap` in `get_component_full`) — learning that certain color tokens operate at different semantic levels (level-1 vs level-2) affects how I handle theming in Compose. That's information I wouldn't have gotten from reading the source code alone.

**Stayed the same:** My understanding of how to implement the actual Compose UI didn't change. The MCP confirmed that Nav-TabBar-Base uses Icon-Base internally and has a three-phase animation — but I still need to write the `@Composable` function, wire up `Animatable`, handle `WindowInsets`, and manage state with `remember`. The MCP tells me *what* to build; my platform knowledge tells me *how*. That division is consistent and, honestly, appropriate.
