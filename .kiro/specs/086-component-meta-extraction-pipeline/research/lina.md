# Component Discoverability Research: Lina

**Agent**: Lina — Stemma Component Specialist
**Spec**: 086
**Date**: 2026-03-27
**Instructions**: Answer based on your experience authoring and maintaining component-meta.yaml files. Do not read other agents' research docs before completing yours.

---

## Authoring Tasks

For each task, describe your process and what's easy or hard about it.

### Task 1: Write a component-meta.yaml for a new component
You've just scaffolded a new component (e.g., a new Badge variant). You need to create its component-meta.yaml.

**What's your process for writing the `purpose` field? Where do you get the information?**

**What's your process for choosing `contexts` tags? How do you decide which UI regions apply?**

**What's your process for writing `when_to_use` / `when_not_to_use`? Where does this guidance come from?**

**What's your process for listing `alternatives`? How do you know which other components to reference?**

**What's hard or uncertain about any of these?**

---

### Task 2: Update a component-meta.yaml after a component changes
A component's API or behavior has changed (e.g., new prop, new variant, expanded use cases). You need to update its meta file.

**How do you decide what to update in the meta file?**

**Do you check the Component-Family steering doc for consistency? If so, what do you look for?**

**Is there information in the family doc that should be in the meta file but isn't, or vice versa?**

---

### Task 3: Ensure discoverability for a component
You want to make sure product agents (Leonardo, Sparky, Kenya, Data) can find a component when they need it.

**How do you decide what search terms should match the component?**

**Do you test discoverability after authoring (e.g., run `find_components` queries to verify)?**

**What would help you write more discoverable metadata?**

---

## General Questions

1. Do you feel like you're maintaining the same information in two places (family docs and meta files)? If so, which fields overlap?

2. Is the component-meta-authoring-guide useful? What's missing from it?

3. If meta files were generated from family docs instead of hand-authored, what would you gain? What would you lose?

4. Are there fields in the meta file schema that are hard to populate or feel arbitrary?

5. What would make your meta file authoring workflow faster or more reliable?

6. What does the Application MCP tell consumers that's different from what they'd already know about using components from general design system experience? From your perspective as the author, what are you providing that's genuinely new vs. restating the obvious?

7. What's an example of metadata you authored that you believe changed how a consumer understood or used a component? What's an example of metadata that probably didn't add value?

---

## Lina's Responses

### Task 1: Write a component-meta.yaml for a new component

**Purpose field process**: I start from the component's schema description and the family doc's "Usage Guidelines" section, then rewrite for agent search optimization — verb-first, naming the user-facing concept, not the implementation. The schema description tells me *what* the component is; I translate that into *when an agent should pick it*. The information comes from the schema and family doc, but the phrasing is original work.

**Contexts process**: I look at where the component appears in existing specs, demos, and the family doc's "Common Patterns" section. I also think about where an architect would place this component on a screen. This is partly informed by the family doc and partly by general design system knowledge. There's no authoritative list of context tags — I pick what seems right based on the component's nature.

**When_to_use / when_not_to_use process**: This comes almost entirely from the family doc's "When to Use This Family" and "Primitive vs Semantic Selection" sections. I narrow family-level guidance to the specific component. The `when_not_to_use` entries come from the selection table — if the table says "use Badge-Count-Notification for notification counts," then Badge-Count-Base gets a `when_not_to_use` entry pointing there.

**Alternatives process**: Directly from the family doc's selection table. The table maps scenarios to recommended components — the alternatives are the other components in those rows. I also check `Component-Inheritance-Structures.md` for sibling components in the same family.

**What's hard**: `contexts` is the most uncertain field. There's no canonical list, no validation, and no way to know if I'm tagging the right UI regions. I'm guessing based on experience. `purpose` is also hard because I'm optimizing for search terms I can't predict — I don't know what queries Leonardo or the platform agents will actually use.

---

### Task 2: Update a component-meta.yaml after a component changes

**How I decide what to update**: Honestly, before the ballot measure we just added, I didn't have a systematic trigger. I'd update the meta file if the spec explicitly mentioned it, but behavioral changes or new props often didn't prompt a meta review. The new Step 6 review process addresses this.

**Do I check the family doc**: Not consistently. When I do, I'm looking for whether the "Usage Guidelines" or selection table has changed in ways that affect the meta file. But the family doc and meta file are authored at different times by potentially different agents, so they can drift without anyone noticing.

**Information overlap**: Yes, significant overlap. `when_to_use` / `when_not_to_use` is essentially a reformatted version of the family doc's "When to Use" section. `alternatives` is a reformatted version of the selection table. The family doc is the source; the meta file is a derivative. The only genuinely original field is `purpose` (agent-optimized phrasing) and `contexts` (not in family docs at all).

---

### Task 3: Ensure discoverability

**Search terms**: I think about what an architect would type when looking for this component's capability. "notification count," "status badge," "filter chip." But I'm guessing — I don't have data on actual search queries.

**Testing discoverability**: No. I've never run `find_components` queries after authoring to verify the component is findable. That's a gap. The authoring guide doesn't suggest it either.

**What would help**: A list of common search queries that product agents actually use. If I knew Leonardo searches for "filter bar" and "empty state," I'd make sure those terms appear in the relevant components' purpose text. Right now I'm optimizing blind.

---

### General Questions

**1. Maintaining same information in two places?** Yes. `usage` (when_to_use / when_not_to_use) and `alternatives` are clearly duplicated between family docs and meta files. The family doc is the authoritative version; the meta file is a reformatted copy. `purpose` and `contexts` are the only fields that don't exist in family docs today.

**2. Is the authoring guide useful?** The guide is good for structure — it tells me what fields exist and gives examples. What's missing: guidance on search optimization (what makes a `purpose` field discoverable vs. not), a canonical list of `contexts` values, and a suggestion to test discoverability after authoring.

**3. Generated from family docs — gain/lose?** Gain: elimination of drift, single source of truth, family doc ballot measure process automatically governs meta content. Lose: the agent-optimization of `purpose` text. Family docs are written for human readers; meta files are written for agent search. If `purpose` is extracted from prose, it may lose the verb-first, keyword-rich phrasing that makes it searchable. This is why the hybrid approach (add `purpose` as a structured field in the family doc) is the right call — it preserves the agent-optimization while eliminating the dual maintenance for everything else.

**4. Fields that are hard or arbitrary?** `contexts` feels arbitrary. There's no controlled vocabulary, no validation, and no feedback loop telling me whether my tags are useful. I could tag a component with "dashboards" or "dashboard-screens" or "analytics-views" and have no way to know which one Leonardo will search for.

**5. Faster/more reliable workflow?** Three things: (1) A controlled vocabulary for `contexts` so I'm not guessing. (2) A post-authoring verification step — run a few `find_components` queries and confirm the component shows up. (3) Derivation from family docs for the fields that are already there (`usage`, `alternatives`), so I only need to author `purpose` and `contexts`.

**6. What's genuinely new vs. restating the obvious?** The `alternatives` with reasons are genuinely valuable — they encode decision logic that isn't obvious from general design system experience. "Use Badge-Count-Notification instead of Badge-Count-Base when you need live region announcements" is specific, actionable guidance that a product agent wouldn't know without it. The `purpose` field is also valuable when well-written — it's the hook that makes the component findable. What's less valuable: `when_to_use` entries that restate the purpose ("Showing unread message counts" for a count badge — that's obvious from the name). The value is in the non-obvious guidance.

**7. Example of high-value vs. low-value metadata?** High-value: Badge-Count-Notification's alternative entry — "When the count represents notifications requiring semantic color and live region announcements." This tells an agent something they wouldn't know from the component name alone. Low-value: Badge-Count-Base's `when_to_use` entry "Displaying item quantities in a cart or list" — this is what a count badge obviously does. An agent that can't figure this out from the component name has bigger problems.
