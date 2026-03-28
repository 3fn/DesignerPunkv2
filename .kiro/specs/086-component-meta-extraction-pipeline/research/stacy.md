# Component Discoverability Research: Stacy

**Agent**: Stacy — Product Governance & Quality Assurance
**Spec**: 086
**Date**: 2026-03-27
**Instructions**: Answer based on your experience auditing product quality, cross-platform parity, and spec structure. Do not read other agents' research docs before completing yours.

---

## Governance & Quality Tasks

For each task, describe how you would verify component usage and what information you'd need.

### Task 1: Audit a product screen for component consistency
You're reviewing a product screen spec to verify it uses the correct DesignerPunk components and follows design system conventions.

**How would you verify which components should be used for each UI element?**

I'd work through the spec's component tree element by element. For each component referenced, I'd query `get_component_summary` to confirm the component exists, check its `readiness` status, and read its `whenToUse` / `whenNotToUse` annotations. If a spec references a component for a purpose that falls under its `whenNotToUse` list, that's a finding. I'd also check `get_prop_guidance` at the family level to see if the selection rules recommend a different family member for the scenario described in the spec.

For example, if a spec uses `Container-Base` for a product card, I'd see that Container-Base's `whenNotToUse` explicitly says "Card-style containers with elevation and borders — use Container-Card-Base." That's a clear flag.

I'd also use `find_components` with purpose keywords matching the UI element's intent (e.g., searching "card" or "filter") to see if there's a component the spec author may have missed entirely.

**What information would you need from the component metadata?**

- `purpose` — does the component's stated purpose match how the spec uses it?
- `whenToUse` / `whenNotToUse` — explicit selection guidance
- `alternatives` — what should be used instead, and under what conditions
- `readiness` — is the component production-ready, or is the spec building on something still in development?
- `platforms` — does the component exist on all platforms the spec targets?
- `contexts` — does the usage context in the spec align with the component's intended contexts?
- `type` (primitive, semantic, type-primitive, pattern) — is the spec using a primitive when a semantic variant exists that encodes the right behavior?

**What's missing from what you currently find?**

Three things stand out:

1. **No "common misuse" data.** The `whenNotToUse` guidance is helpful, but it's written from the component's perspective ("don't use me for X"). What I actually need for auditing is the inverse: "If you're building X, people commonly reach for Y but should use Z." A misuse-pattern index would let me scan a spec proactively rather than checking each component reactively.

2. **No readiness-to-spec impact guidance.** Container-Card-Base is `development` readiness. If a spec references it, I need to know: is this safe to spec against, or will the contracts change? The readiness field exists but there's no guidance on what it means for spec authors — can you spec against `development` components? What's the risk?

3. **No version or stability indicator on individual contracts.** A component might be production-ready overall, but if a specific behavioral contract was recently added or modified, that's relevant to my audit. I can't currently distinguish "this component has been stable for months" from "this component just had its interaction contract rewritten."

---

### Task 2: Check cross-platform parity for a feature
A feature has been implemented on web and iOS. You need to verify the same components are used on both platforms with consistent behavior.

**How would you check which components are available on which platforms?**

Every component in the catalog includes a `platforms` array. I'd pull the catalog via `get_component_catalog` and cross-reference the spec's component list against platform availability. If a spec uses a component that's listed for web and iOS but not Android, I'd flag that as a future parity risk when Android comes online.

For the immediate audit, I'd verify that every component in the spec's component tree shows both `web` and `ios` in its platforms array.

**What information would you need to verify parity?**

- **Same component names** across platform implementations — are both platforms using `Button-CTA` or did one platform substitute something?
- **Same behavioral contracts** — I'd query `get_component_full` and check that the contracts are platform-agnostic (which they should be, since DesignerPunk's contracts are behavioral, not implementation-specific)
- **Same source semantic tokens** — both platforms should reference the same token names, expressed in platform-native format. The component metadata includes `tokenCount` but I'd need to see the actual token references to verify parity.
- **Same prop values** — if the spec says `Button-CTA` with `variant: "primary"`, both platforms should honor that prop identically

**What's missing from what you currently find?**

1. **No platform-specific contract deviations.** The contracts appear to be universal, which is correct for DesignerPunk's architecture. But if a platform implementation legitimately deviates (e.g., iOS uses a native gesture that web can't replicate), there's no metadata capturing that intentional divergence. I'd have to discover it by reading implementation code, which is outside my audit scope.

2. **No token-level parity view.** I can see `tokenCount: 38` for Container-Base, but I can't easily get a list of "here are the 38 tokens this component uses" and then verify both platforms reference the same set. A token manifest per component would make parity auditing significantly faster.

3. **No implementation status per platform.** The `platforms` array tells me a component is *designed* for web/iOS/Android, but not whether it's actually *implemented* on each. A component could be in the catalog for all three platforms but only have a working web implementation. The catalog doesn't distinguish "designed for" from "shipped on."

---

### Task 3: Review a spec for component selection correctness
A spec proposes using Container-Base for card-like content sections. You need to assess whether Container-Card-Base would be more appropriate.

**How would you evaluate the component selection?**

This is exactly the kind of finding I'd catch in a Task 1 audit, but let me walk through the specific evaluation:

1. Query `get_prop_guidance` for the Container family. The selection rules are explicit: "Card with elevation and consistent styling" → recommend Container-Card-Base. "Generic content wrapper with flexible styling" → recommend Container-Base.

2. Check Container-Base's `whenNotToUse`: "Card-style containers with elevation and borders — use Container-Card-Base." Direct hit.

3. Check Container-Base's `alternatives`: Container-Card-Base is listed with reason "When the container needs card styling (elevation, border radius, background)."

4. Check Container-Card-Base's `whenToUse`: "Product cards, profile cards, or content preview cards" and "Elevated content sections that need visual separation from the background."

5. Check Container-Card-Base's `readiness`: it's `development`, not `production-ready`. This is the complicating factor — the *correct* component isn't production-ready yet.

So my finding would be: "The spec should use Container-Card-Base for card-like content sections. Container-Base's metadata explicitly redirects to Container-Card-Base for this use case. HOWEVER, Container-Card-Base is currently in `development` readiness. The spec author may have intentionally chosen Container-Base as a workaround. If so, this should be documented as a known deviation with a note to migrate when Container-Card-Base reaches production-ready. If not, this is a component selection error."

**What information would you need to make that assessment?**

- Family-level selection rules (from `get_prop_guidance`)
- Both components' `whenToUse` / `whenNotToUse` / `alternatives`
- Both components' `readiness` status
- The spec's stated intent for the UI element (is it actually card-like, or is it a content wrapper that just happens to look card-ish?)

**What's missing from what you currently find?**

1. **No "escape hatch" documentation pattern.** The selection rules do mention "Card-like container needing props not exposed by Card-Base → use Container-Base" as a valid escape hatch. But there's no structured way for a spec to say "I'm intentionally using the escape hatch because [reason]." A spec-level annotation pattern for intentional deviations from selection guidance would help me distinguish errors from informed decisions.

2. **No migration path metadata.** When a component is in `development` and a spec uses a workaround, there's no metadata saying "when Container-Card-Base reaches production-ready, specs using Container-Base for card purposes should migrate." A migration-path or supersedes relationship would help me track technical debt.

---

## General Questions

**1. When auditing product quality, do you use the Application MCP to look up component information? What queries do you make?**

Yes, and after working through the tasks above, here's my actual query pattern:

- `get_component_catalog` — first pass to understand the full component landscape and check that spec-referenced components exist
- `get_component_summary` — per-component check for readiness, platforms, and usage annotations
- `get_prop_guidance` — family-level selection rules to verify the right family member was chosen
- `find_components` with purpose keywords — to check if a better component exists that the spec author may not have known about
- `validate_assembly` — to verify that a spec's component tree is structurally valid (parent-child composition rules, required children, accessibility)
- `check_composition` — spot-checks for specific parent-child relationships when something looks off

The most valuable for governance are `get_prop_guidance` (selection rules are directly auditable) and `validate_assembly` (structural validation catches composition errors I might miss manually).

**2. Is the `when_to_use` / `when_not_to_use` guidance in component metadata useful for governance decisions? What would make it more useful?**

It's the single most useful piece of metadata for my work. It turns component selection from a subjective judgment call into an auditable decision. When a spec uses Container-Base for a card, I can point to explicit guidance that says "don't do that" rather than arguing from opinion.

What would make it more useful:

- **Severity or strength indicators.** "Don't use Container-Base for cards" is a strong redirect — there's a better component. "Don't use Container-Base for semantic sectioning — use native HTML elements" is web-specific guidance that doesn't apply to iOS/Android. Not all `whenNotToUse` items carry the same weight, and I can't currently distinguish "this is wrong" from "this is suboptimal" from "this is platform-specific."

- **Bidirectional linking.** Container-Base says "don't use me for cards, use Container-Card-Base." Container-Card-Base says "don't use me for simple wrapping, use Container-Base." This bidirectional pattern is great when it exists, but I have to manually verify both sides. If the metadata guaranteed bidirectional consistency, I could trust one side without checking the other.

**3. Are the `alternatives` fields helpful for identifying when a different component would be more appropriate?**

Yes, but they're limited. The alternatives tell me *what* to use instead and *when*, which is exactly what I need. The Container-Base → Container-Card-Base alternative is a clean example.

The limitation: alternatives only capture direct substitutions within a family or closely related components. They don't capture cross-family alternatives. If someone uses a `Chip-Base` where they should use a `Badge-Label-Base` (both are compact labeling elements), neither component's alternatives would point me to the other. The `find_components` purpose search partially fills this gap, but it requires me to know what to search for.

**4. Is there anything about the current component metadata that makes governance auditing harder than it should be?**

Two things:

- **No diff or changelog visibility.** When I audit a spec that was written two weeks ago, I can't tell if the component metadata has changed since the spec was authored. If Container-Card-Base's contracts were modified after the spec was written, the spec might be out of sync and I'd have no way to know without someone telling me.

- **Readiness without roadmap context.** I can see that Container-Card-Base is `development`, but I can't see whether it's expected to reach production-ready next week or next quarter. This matters for my audit findings — "use the workaround for now, migration expected soon" is a very different finding from "use the workaround, no timeline for the proper solution."

**5. What would make your component governance workflow faster or more reliable?**

In priority order:

1. **A "spec validation" query** — give it a component tree from a spec, get back selection-rule violations. Like `validate_assembly` but for selection correctness, not just structural validity. Currently I do this manually component-by-component.

2. **A parity diff tool** — give it two platform implementations of the same screen, get back a structured comparison of component usage, token references, and behavioral contract coverage. Currently this is entirely manual.

3. **Readiness filtering in searches** — when I use `find_components`, I'd like to filter by readiness so I can distinguish "components you can spec against today" from "components that exist but aren't ready."

**6. What does the Application MCP tell you that's different from what you already know about auditing design system usage and product quality?**

The Application MCP gives me *authoritative, structured, queryable* component metadata. Without it, I'd be reading spec files, behavioral contract documents, and component source code to piece together the same information. The MCP turns "read 15 files and synthesize" into "make 3 queries and compare."

Specifically, the selection rules in `get_prop_guidance` are something I couldn't reliably reconstruct from raw source files. They encode design intent and decision logic that would otherwise live only in the heads of the people who designed the components.

The `validate_assembly` tool is also something I couldn't replicate manually with confidence — composition rules, required children, and accessibility checks across a component tree are complex enough that manual verification would be error-prone.

**7. What's an example of something you understood before accessing the Application MCP that changed after accessing it? What's an example of something that stayed the same?**

**Changed:** I assumed `whenToUse` / `whenNotToUse` would be generic, hand-wavy guidance — the kind of thing you see in component library docs that says "use buttons for actions" and isn't actually helpful for auditing. What I found is significantly more specific and actionable. The Container family's selection rules include specific scenarios with recommended components AND prop configurations. That's auditable. I can check a spec against those rules mechanically.

I also didn't expect `validate_assembly` to check accessibility concerns (form labels, submit actions, page headings). I assumed it was purely structural. The accessibility layer makes it directly useful for my audit checklist item on accessibility coverage.

**Stayed the same:** My understanding that parity auditing would require significant manual work. The MCP gives me per-component platform arrays and behavioral contracts, but it doesn't give me a way to compare two platform implementations side-by-side. The building blocks are there, but the parity workflow is still manual assembly. That's consistent with what I expected — parity is a cross-cutting concern that's hard to automate at the metadata level.
