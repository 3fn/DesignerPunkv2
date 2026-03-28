# Component Discoverability Research: Sparky

**Agent**: Sparky — Web Platform Engineer
**Spec**: 086
**Date**: 2026-03-27
**Instructions**: Answer based on your experience consuming DesignerPunk components for web implementation. Do not read other agents' research docs before completing yours.

---

## Component Discovery Tasks

For each task, describe how you would find the right component and the information you'd need to implement it.

### Task 1: Implement a card grid on a dashboard
You need to render a grid of stat cards on a web dashboard. Each card shows a number, a label, and an optional trend icon.

**How would you search for the right component(s)?**

I'd start with `find_components` searching for "card" and "dashboard" by purpose and context. That gets me to Container-Card-Base (dashboards context) and Container-Base. I'd also pull the `dashboard` experience pattern, which lays out the full zone structure — stat-summary-zone with stat cards containing Badge-Count-Base and Icon-Base.

The experience pattern is actually the faster path here. Searching by individual component purpose ("card") gets me the container, but doesn't tell me how to compose the stat card interior. The dashboard pattern gives me the full tree: Container-Base as page container → Container-Base as stat-summary-zone → stat cards with Badge-Count-Base + Icon-Base.

**What information would you need to start implementing?**

- The Custom Element tag name for each component (e.g., `<dp-container-card-base>` or whatever the convention is)
- Which CSS custom properties each component exposes for styling
- The HTML attribute names — the MCP gives me prop names like `padding` and `background`, but I need to know if the web implementation uses `padding="150"` as an attribute or something different
- Slot names for children — Shadow DOM means I need to know if it's a default slot or named slots
- Token-to-CSS-custom-property mapping — the MCP says `space.inset.150` but in CSS I need `var(--space-inset-150)` or whatever the actual custom property name is
- Container-Card-Base readiness — it's marked "development," so I need to know if the web implementation is usable or if I should fall back to Container-Base (the pattern already flags this, which is helpful)

**What's missing from what you currently find?**

The big gap: **no web-specific implementation details in the MCP metadata.** The component full data gives me cross-platform props, behavioral contracts, and tokens — all valuable — but nothing about:

1. The Custom Element tag name
2. HTML attribute names vs. JavaScript property names
3. Slot structure (default slot, named slots)
4. CSS custom properties exposed on the host element
5. Events dispatched (CustomEvent names and detail payloads)
6. How to import the component (module path)

I can look at the actual source files in `platforms/web/` to figure this out, but that's reading implementation code, not consuming documented API. If Leonardo hands me a spec, I shouldn't need to reverse-engineer the web component's public API from its source.

The experience pattern partially compensates — it tells me *what* to compose and *why*, with accessibility notes. But it doesn't bridge to *how* on web specifically.

---

### Task 2: Add a filter bar above a content list
A web page needs a horizontal row of filter chips that the user can toggle. The filter bar stays visible while content scrolls.

**How would you search for the right component(s)?**

`find_components` with purpose "filter chip" returns nothing. Purpose "chip" gets me Chip-Base, Chip-Filter, and Chip-Input. Context "filter-bars" gets me Chip-Base and Chip-Filter. So the search works, but only if I know the DesignerPunk vocabulary. If I searched "filter bar" as a purpose, I'd get nothing — there's no composite "filter bar" component.

From there, Chip-Filter is clearly the right choice — its purpose says "toggle a content filter on or off" and its whenToUse says "filter bars where users toggle criteria to narrow results." The alternatives steer me away from Chip-Input (that's for dismissible user-entered values) and Chip-Base (generic, no filter semantics). That guidance is genuinely useful.

**What information would you need to start implementing?**

- Chip-Filter's web Custom Element tag and attribute API
- How `selected` and `onSelectionChange` map to web — is it an HTML attribute `selected` and a CustomEvent `selection-change`? Or a JS property?
- The sticky positioning for "stays visible while content scrolls" — this is layout, not component-level, so I'd handle it with CSS `position: sticky`. But I need to know if the chip has any z-index or overflow implications in Shadow DOM
- How to arrange chips horizontally — is there a chip group/set component, or do I just use flexbox on a container? (There isn't one in the catalog)
- Token for the gap between chips — the Chip-Base contracts mention `space.grouped.tight` (4px) for icon-to-label gap, but what about chip-to-chip spacing in a row?

**What's missing from what you currently find?**

1. **No chip group/set component** — Chip-Filter is individual chips. There's no equivalent of Button-VerticalList-Set for chips. I'd need to compose the horizontal layout myself, which means I'm making spacing and overflow decisions that should probably be standardized. Is horizontal scroll the right overflow behavior? Wrap? This is a gap Leonardo and I would need to discuss.

2. **No layout pattern for "sticky filter bar"** — the experience patterns don't cover this specific composition. The dashboard pattern has zones but doesn't address sticky sub-sections.

3. **Same web-specific API gap as Task 1** — I still don't know the Custom Element tag, attribute names, or event names from the MCP alone.

4. **Chip-to-chip spacing token** — the contracts specify internal chip spacing but not the spacing between chips in a group. I'd guess `space.grouped.normal` or similar, but I shouldn't be guessing.

---

### Task 3: Build a form with multiple sections
A web form has grouped sections (Personal Info, Preferences, Notifications) each with a heading and related inputs.

**How would you search for the right component(s)?**

`find_components` with purpose "form" gets me the FormInput family — Input-Text-Base, Input-Text-Email, Input-Text-PhoneNumber, plus Button-CTA, Container-Card-Base, and Nav-TabBar-Base (the last two are noise). Purpose "form section" returns nothing.

The real win here is the `multi-section-form` experience pattern. It gives me the full component tree: Container-Base (form-container, semantic: main) → multiple Container-Base (form-section, semantic: section) each with a heading and inputs → Button-CTA (submit-action) at the end. It specifies accessibility requirements (each section as a landmark, focus order, form-level error summary) and even notes that section headings are "not a DesignerPunk component — rendered as text content."

That pattern is exactly what I need. Without it, I'd be assembling the form structure from scratch based on general web form knowledge, which would work but wouldn't guarantee I'm following DesignerPunk conventions.

**What information would you need to start implementing?**

- Container-Base's web API for setting `semantic="section"` and `accessibilityLabel`
- Input component web APIs — tag names, attribute names, validation event names
- How form validation errors surface — the pattern says "form-level error summary communicated to assistive technology" but doesn't specify the mechanism. Is there a DesignerPunk error summary component? Or do I build one?
- Typography tokens for section headings — the pattern says headings are plain text, but which typography token? `typography.heading.sm`? `typography.heading.md`?
- Spacing tokens between fields within a section vs. between sections — the pattern says `space.layout.separated.normal` (24px) between sections but doesn't specify intra-section field spacing

**What's missing from what you currently find?**

1. **No form error summary component or pattern** — the accessibility notes say to communicate form-level errors to assistive technology, but there's no component for this and no guidance on implementation. I'd need to build a live region with `role="alert"`, but that's me making accessibility architecture decisions that should be standardized.

2. **Typography guidance for headings** — the pattern says "rendered as text content" but doesn't specify which heading level or typography token. For a multi-section form, I'd use `<h2>` for section headings (assuming the page title is `<h1>`), but the token choice is unspecified.

3. **Intra-section field spacing** — between sections is specified (24px), but the gap between fields within a section isn't. I'd guess `space.layout.grouped.normal` or similar, but again — guessing.

4. **Same web API gap** — still no Custom Element tags, attributes, events, or import paths from the MCP.

---

## General Questions

1. **When you receive a screen spec from Leonardo, what component information do you need that you don't currently have easy access to?**

The web-specific implementation API. Leonardo's specs reference components by their DesignerPunk names (Container-Card-Base, Chip-Filter, etc.) with props and tokens. That's the right level for a cross-platform spec. But when I sit down to write the Web Component code, I need:

- Custom Element tag names
- HTML attribute names and types
- JavaScript property names (when different from attributes)
- Slot names and structure
- CustomEvent names and detail shapes
- CSS custom properties exposed on the host
- Import paths

Right now I get this by reading the source files in `platforms/web/`. That works, but it's slow and fragile — I'm reading implementation details rather than a documented public API. If the implementation changes internally but the public API stays the same, I wouldn't know the difference.

2. **Do you use the Application MCP to discover components, or do you rely on other sources (READMEs, demos, asking Lina)?**

I use the Application MCP as my primary discovery tool. `find_components` for initial search, `get_component_full` for detailed contracts and props, `get_experience_pattern` for composition guidance. It's genuinely useful for understanding *what* a component does, *when* to use it, and *how it behaves* across platforms.

But for the actual web implementation — tag names, attributes, events, CSS — I fall back to reading the source files in `platforms/web/`. The MCP gets me 70% of the way; the last 30% requires source diving.

I don't currently ask Lina directly (that would go through Leonardo per the routing protocol), and I haven't seen READMEs at the component level that document the web API.

3. **When you find a component, is the web-specific implementation information (Custom Element tag, attributes, events, CSS custom properties) easy to find?**

No. It's findable but not easy. The source files exist and are well-structured (`ComponentName/platforms/web/ComponentName.web.ts` + `.styles.css`), so I can read them. But there's no documented web API surface — no equivalent of a TypeScript `.d.ts` file or a component README that says "here's the tag, here are the attributes, here are the events."

The MCP metadata is platform-agnostic by design, which makes sense for Leonardo's cross-platform specs. But it means the web-specific details I need for implementation aren't surfaced through the discovery tools.

4. **Is there anything about the current component metadata that's confusing, incomplete, or unhelpful for web implementation?**

A few things:

- **Token name → CSS custom property mapping is implicit.** The MCP says `space.inset.150` but the CSS file uses `var(--space-inset-150)`. The mapping convention is consistent (dots become dashes, prefix with `--`), but it's never stated explicitly. I've inferred it. If the convention ever changes or has exceptions, I'd be wrong.

- **Props describe cross-platform behavior, not web-specific types.** For example, Container-Card-Base's `onPress` is typed as `() => void`, but on web it's presumably a CustomEvent. The `semantic` prop says `'div' | 'section' | 'article'` — that's web-only, which is good, but it's mixed in with cross-platform props without clear delineation.

- **"Readiness" is component-level, not platform-level.** Container-Card-Base is "development" readiness. Does that mean all three platforms? Or is web further along than iOS? I can't tell from the metadata. If the web implementation is usable but iOS isn't, I'd want to know that.

- **Behavioral contracts are excellent for testing but verbose for quick reference.** When I just need to know "what props does this thing take and what do they do," the contracts are overkill. The properties section is more useful for implementation, but it's buried under the contracts in the full metadata response.

5. **What would make your component discovery workflow faster or more reliable?**

In priority order:

1. **A web API reference per component** — tag name, attributes, properties, events, slots, CSS custom properties. Could be generated from the source. Doesn't need to be hand-written.

2. **Platform-specific readiness** — "web: production-ready, ios: development, android: not-started" instead of a single readiness field.

3. **Token-to-CSS-custom-property mapping documentation** — even just a one-liner confirming the convention: "Token `a.b.c` maps to CSS custom property `--a-b-c`."

4. **A "quick reference" view** in the MCP — something between `get_component_summary` (too brief) and `get_component_full` (too detailed). Just props, tokens, and web-specific API. No contracts, no composition tree, no alternatives.

5. **Chip group / layout composition guidance** — for components that are typically used in groups (chips, badges), document the expected container layout and spacing tokens.

6. **What does the Application MCP tell you that's different from what you already know about implementing web components and consuming design systems?**

The MCP tells me things I genuinely wouldn't know from general web component experience:

- **DesignerPunk-specific design philosophy** — "NO DISABLED STATES" is a deliberate choice that affects how I handle unavailable actions. I wouldn't assume that.
- **Component inheritance and composition** — Chip-Filter inherits from Chip-Base, Container-Card-Base composes Container-Base internally. This affects how I structure my implementations and what behavior I can expect "for free."
- **Behavioral contracts with WCAG references** — knowing that Chip-Filter needs `aria-pressed` and that the expanded tap area is 48px (exceeding WCAG 2.5.5's 44px minimum) is specific to DesignerPunk's accessibility stance.
- **Experience patterns** — the dashboard and multi-section-form patterns encode architectural decisions (zone ordering by temporal relevance, section-as-landmark) that I wouldn't derive from component APIs alone.
- **Token semantics** — `tapAreaRecommended` vs `space600`, `blend.hoverDarker` vs a raw opacity value. The semantic naming tells me *why* a value exists, not just *what* it is.

What it does NOT tell me that I'd know from general experience: how to write a Web Component with Shadow DOM, how CSS custom properties work, how to implement sticky positioning, how to structure a `<form>` element, how ARIA roles work. The MCP assumes web platform competence, which is correct.

7. **What's an example of something you understood before accessing the Application MCP that changed after accessing it? What's an example of something that stayed the same?**

**Changed**: I would have assumed a filter chip component uses `aria-selected` for its toggle state (that's the common pattern in ARIA for selection widgets). The MCP told me DesignerPunk uses `aria-pressed` instead, because the chip's role is `button` with toggle behavior, not a selection widget. That's a meaningful accessibility distinction — `aria-pressed` communicates "this is a toggle button" while `aria-selected` communicates "this is a selected item in a set." The MCP's behavioral contracts caught a nuance I would have gotten wrong.

I also would have reached for Container-Card-Base for the dashboard stat cards, but the experience pattern flagged that it's in development readiness and recommended Container-Base as a fallback. Without that, I'd have tried to use a component that might not be fully implemented on web yet.

**Stayed the same**: My understanding of how to implement the sticky filter bar (CSS `position: sticky`), how to structure a multi-section form with `<fieldset>` and `<legend>` (though DesignerPunk uses `<section>` with accessible names instead, which is a valid alternative), and how to use CSS Grid for the card grid layout. The MCP doesn't try to teach me web fundamentals, and it shouldn't.
