# Component Discoverability Research: Kenya

**Agent**: Kenya — iOS Platform Engineer
**Spec**: 086
**Date**: 2026-03-27
**Instructions**: Answer based on your experience consuming DesignerPunk components for iOS/SwiftUI implementation. Do not read other agents' research docs before completing yours.

---

## Component Discovery Tasks

For each task, describe how you would find the right component and the information you'd need to implement it.

### Task 1: Implement a card grid on a dashboard
You need to render a grid of stat cards in SwiftUI. Each card shows a number, a label, and an optional trend icon.

**How would you search for the right component(s)?**

I'd start with the Application MCP — `find_components` with a purpose keyword like "card" or "stat", then `get_component_full` on promising matches to understand the API. If Leonardo's spec names the component, I skip discovery and go straight to the full metadata.

**What information would you need to start implementing?**

The SwiftUI view name (or the behavioral contract I'm implementing against), the prop/slot API (what's required vs optional, what types), which tokens to use for spacing/color/typography, composition rules (can I nest a trend icon inside?), and any accessibility contract (roles, labels).

**What's missing from what you currently find?**

The Application MCP gives me the component contract — props, composition rules, tokens. What it doesn't give me is the actual SwiftUI implementation pattern. I'd need to look at existing `platforms/ios/` source code to see how other DesignerPunk components translate contracts into SwiftUI views. There's a gap between "here's the component spec" and "here's how this looks in Swift." I'd also want to know if a `LazyVGrid` vs `List` approach is preferred for the card layout, which is a platform decision the MCP can't answer.

---

### Task 2: Add a tab bar to a product screen
An iOS screen needs a bottom tab bar with 4-5 tabs, each with an icon and label.

**How would you search for the right component(s)?**

`find_components` with "tab" or "navigation", or `search_symbols` for "TabBar" in the component index. If Leonardo's spec says `Nav-TabBar-Base`, I go straight to `get_component_full("Nav-TabBar-Base")`.

**What information would you need to start implementing?**

The tab item structure (icon + label props), how selection state is managed, whether it supports badges, the accessibility contract for tab navigation, and which tokens govern the bar's appearance. On iOS specifically, I need to know whether this wraps SwiftUI's native `TabView` or is a custom implementation — that has huge implications for system integration (iPad sidebar adaptation, etc.).

**What's missing from what you currently find?**

Platform implementation strategy. The MCP tells me the *what* (contract, props, tokens) but not the *how* for iOS. Does this component expect me to use native `TabView` and style it with DesignerPunk tokens? Or build a custom tab bar view? That's a critical fork that affects navigation architecture, and it's not in the component metadata.

---

### Task 3: Build a notification list with read/unread state
An iOS screen shows a list of notifications grouped by time period, with visual distinction between read and unread items.

**How would you search for the right component(s)?**

This is trickier — "notification" might not be a component name. I'd try `find_components` with "list" or "notification", and also look for components that handle read/unread visual states. Likely this is a composition: a list component + a list item component with a state variant, plus a section header for time grouping.

**What information would you need to start implementing?**

The list item component's state API (how read/unread is expressed — prop? variant?), the section/grouping pattern, which tokens differentiate read vs unread (likely color/opacity tokens), and the accessibility contract for conveying read state to VoiceOver.

**What's missing from what you currently find?**

Composition guidance for assembled patterns. The MCP can tell me about individual components, but "notification list grouped by time with read/unread" is a *pattern*, not a single component. I'd need Leonardo's spec to define the assembly, or I'd need the experience patterns (`list_experience_patterns`) to see if this is a documented pattern. The gap is connecting individual component metadata to real assembled use cases.

---

## General Questions

### 1. When you receive a screen spec from Leonardo, what component information do you need that you don't currently have easy access to?

Three things:
- **iOS implementation patterns** — how the contract maps to SwiftUI idioms. The contract says "this component has these props and tokens" but not "in SwiftUI, this is a `VStack` with these modifiers."
- **Platform-specific behavioral notes** — things like "on iOS, this component should use native scroll behavior" or "this animation should use spring timing on iOS."
- **Token consumption examples in Swift** — I know the token names, but seeing `DesignTokens.space.inset150` used in context is faster than assembling it from the token reference.

### 2. Do you use the Application MCP to discover components, or do you rely on other sources (READMEs, source code, asking Lina)?

Yes, and it's my primary discovery tool. I use `find_components` for discovery and `get_component_full` for implementation details. I supplement with source code in `platforms/ios/` when I need to see how existing components were actually built. I rarely need to ask Lina directly — the MCP covers the contract layer well. Where I fall back to source code is for the *implementation* layer.

### 3. When you find a component, is the iOS-specific implementation information (SwiftUI view name, modifiers, token constants) easy to find?

Not really. The Application MCP is platform-agnostic by design — it gives me the universal contract. That's correct architecturally (the contract *should* be platform-agnostic), but it means I always have a translation step. I go from MCP metadata → mental model of the SwiftUI implementation → actual code. The existing `platforms/ios/` implementations are my real reference for that translation, and they're not indexed or searchable through the MCP.

### 4. Is there anything about the current component metadata that's confusing, incomplete, or unhelpful for iOS implementation?

Not confusing — the metadata is well-structured. Two gaps:
- **Composition examples are abstract.** The MCP tells me "Container-Card-Base can contain Text-Body-Base" but doesn't show me what that assembly looks like in practice. A concrete example (even pseudocode) would save time.
- **Token references in component metadata don't include platform-specific constant names.** The metadata says `space.inset.150` but in Swift I need `DesignTokens.space.inset150` — the dot-path-to-Swift-constant mapping is something I do in my head every time.

### 5. What would make your component discovery workflow faster or more reliable?

- **Platform-filtered views.** If I could query "show me this component's iOS implementation details" and get the SwiftUI view name, Swift token constants, and any iOS-specific behavioral notes, that would eliminate my biggest translation step.
- **Composition examples per platform.** Not just "these components can nest" but "here's a SwiftUI snippet showing the nesting."
- **Searchable iOS implementations.** Right now the `platforms/ios/` code exists but isn't indexed through the MCP. If I could search existing iOS implementations by component name through the MCP, I'd find patterns much faster.

### 6. What does the Application MCP tell you that's different from what you already know about implementing iOS components and consuming design systems?

The MCP gives me the *authoritative contract* — the canonical props, composition rules, accessibility requirements, and token relationships. Without it, I'd be reverse-engineering intent from source code or READMEs, which is error-prone. The MCP is the source of truth for *what* a component is. My existing knowledge covers *how* to build things in SwiftUI — the MCP doesn't replace that, it gives me the spec to build against.

The MCP also surfaces things I wouldn't think to check — like composition constraints ("this component cannot contain X") or accessibility contracts I might otherwise miss.

### 7. What's an example of something you understood before accessing the Application MCP that changed after accessing it? What's an example of something that stayed the same?

**Changed:** My understanding of composition rules. Before the MCP, I'd assume I could nest components however made sense in SwiftUI. The MCP made explicit that composition is *governed* — not every parent-child relationship is valid. That changed how I approach building component trees. I now validate composition before implementing.

**Stayed the same:** How I actually write SwiftUI code. The MCP doesn't change my implementation patterns — I still use the same SwiftUI idioms, the same state management approaches, the same accessibility modifiers. The MCP informs *what* I build, not *how* I build it on iOS. That "how" comes from platform expertise and existing implementation patterns in the codebase.

---

## Meta-Observation

The Application MCP is strong on the contract/specification layer and weak on the platform-specific implementation layer — which may be by design (contracts *should* be platform-agnostic), but it means platform engineers always have a translation step that could be reduced.

**Counter-argument:** Baking iOS-specific implementation details into the MCP risks coupling the component metadata to platform implementation choices that should remain flexible. If SwiftUI changes significantly, you'd have to update both the contract AND the platform hints. Keeping them separate has real architectural value. The question is whether the translation cost is worth the decoupling benefit.
