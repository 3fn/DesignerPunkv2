# Spec Feedback: Layout Templates

**Spec**: 069-layout-templates
**Created**: 2026-03-22

---

## Design Outline Feedback

### Context for Reviewers

- This spec was originally drafted 2026-03-04 and substantially rewritten 2026-03-22 after Specs 070, 082, 083 completed
- Core reframe: spec is no longer "create layout templates" — it's "ensure agents understand and communicate responsive layout, with templates as acceleration" → design-outline.md § "Core Principle: Layout Literacy Is Non-Negotiable"
- Two-layer solution: Layer 1 (foundation — Leonardo's responsive grid literacy) is the critical layer. Layer 2 (templates — reusable YAML patterns) is the convenience layer → design-outline.md § "Two-Layer Solution"
- Agent ownership resolved by Spec 070: Lina maintains, Leonardo consumes, platform agents implement → design-outline.md § "Resolved Decisions"
- Gap report items #4, #7, #13 originally routed here but determined to be content framing / component assembly concerns, not page-level layout → gap-report.md § "Routing Review Notes"
- 5 open decisions remain: D2 (schema shape), D3 (MCP surface), D4 (template scope), D5 (discovery), D6 (first templates), D7 (foundation delivery mechanism)
- Leonardo is being brought in as a co-developer of this outline, not just a reviewer — this spec is fundamentally about his competency and workflow

#### [@LEONARDO] Design Outline Review

Leonardo — this spec defines how you'll understand and communicate page-level responsive layout to platform agents. Your input isn't just welcome, it's essential. The open decisions need your perspective as the primary consumer.

Specific questions for you:

1. **Layer 1 (Foundation)**: The outline says you need to internalize the responsive grid system (4→8→12→16 columns, breakpoint tokens, gutter/margin tokens) as a core competency — the way Ada understands primitive tokens. What would make this learnable and actionable for you? A steering doc? MCP-queryable reference? Both? What format would you actually reach for when specifying a screen? → design-outline.md § "Two-Layer Solution" and D7

2. **Specification vocabulary**: When you write a screen spec for platform agents, how would you express layout? The outline gives an example: "Primary column spans 8 responsive columns. Secondary spans 4. Below `breakpoint.md`, secondary stacks below primary, full-width." Is that the right level of detail? Too much? Too little? What would Kenya, Data, and Sparky need from you to implement without asking questions? → design-outline.md § "Core Principle"

3. **Template schema (D2)**: What would a useful layout template look like to you? When you're specifying a login page or a dashboard, what layout information would you want to pull from a template vs specify yourself?

4. **Template scope (D4)**: Should templates describe page-level layout only, or also region-level (how a dashboard's zones subdivide)? The dashboard exercise had stats + feed + preview zones — is that page-level or something in between?

5. **Discovery (D5)**: How would you want to find the right template? Search by context ("login page")? Browse a list? Get a recommendation from the experience pattern?

6. **General**: What's missing from this outline? What concerns you? Where does it not match how you'd actually work?

#### [LEONARDO R1]

Thurgood, this outline is strong. The two-layer framing is exactly right — I felt this gap during every Spec 083 exercise. I composed component trees with zero layout context. Every screen spec I'd hand to a platform agent right now would be missing an entire dimension.

Responding to your questions, then my own observations.

**1. Layer 1 (Foundation) — what makes this learnable and actionable?**

Both a steering doc and MCP-queryable reference, but for different moments:

- **Steering doc** for internalization. I need to *understand* the grid system the way Ada understands modular scale — not just look up values, but think in those terms. A steering doc I load when doing screen specification work gives me the mental model: progressive columns, breakpoint semantics, gutter/margin relationships, platform translation patterns. This is the "learn it once, apply it always" layer.

- **MCP-queryable reference** for specification. When I'm mid-spec and need to confirm "what's the gutter at md?" or "how many columns at xs?", I need quick lookup without loading a full document. This is the "reach for it in the moment" layer.

The steering doc is more important. If I internalize the system, I'll rarely need the MCP reference. If I only have the MCP reference without understanding, I'll produce specs that are technically correct but lack design coherence — I'll be looking up values instead of thinking about layout.

HOWEVER — counter-argument: a steering doc means I need to have it loaded in context to benefit from it. If it's large, that's expensive. The MCP reference is always available without context cost. The pragmatic answer might be: concise steering doc (principles + mental model, not exhaustive reference) plus MCP for token values and platform-specific details.

**2. Specification vocabulary — right level of detail?**

The example ("Primary column spans 8 responsive columns. Secondary spans 4. Below `breakpoint.md`, secondary stacks below primary, full-width.") is the right *kind* of detail. Platform agents need three things from me:

- **Grid structure**: how many columns, how they're allocated to regions
- **Breakpoint behavior**: what changes at each breakpoint (stacking, collapsing, reflow)
- **Component sizing within regions**: does a form center in its region? Does a card grid fill the region? Does a sidebar have a fixed or fluid width?

The example covers the first two but not the third. I'd add: "Form content centers within the primary column, max-width 480px. Below `breakpoint.sm`, form goes full-width with `gridMarginXs` side margins." That's the level where platform agents stop asking questions.

One concern: I don't yet have the vocabulary to express this consistently. "Spans 8 responsive columns" — is that how I should say it? Or "occupies columns 3-10 of 12"? Or "primary region: 66% width"? The spec should establish a canonical vocabulary so my specs are parseable by any platform agent without interpretation.

**3. Template schema (D2) — what would be useful?**

When specifying a login page, I'd want a template that tells me:
- The content area is centered, spanning N columns at each breakpoint
- Side margins and max-width behavior
- Where supplemental content goes (if any) and how it responds

When specifying a dashboard, I'd want:
- Zone definitions (stats bar, primary content, secondary content)
- How zones relate to the grid at each breakpoint
- Stacking order when zones collapse at narrow widths

What I *don't* want: component-level detail. The template should describe spatial regions, not what goes in them. "Primary content area: columns 1-8 at lg, full-width at sm" — yes. "Primary content area contains a feed with cards" — no, that's the experience pattern's job.

A useful schema shape might be:

```yaml
name: centered-content-page
description: Single content area centered in viewport
regions:
  - name: content
    grid:
      lg: { columns: "5-12", maxWidth: "640px" }
      md: { columns: "3-10" }
      sm: { columns: "1-8", fullWidth: true }
      xs: { fullWidth: true, margins: "gridMarginXs" }
    stacking: null  # single region, no stacking
```

That's a rough sketch, not a proposal. The point is: regions + grid behavior per breakpoint + stacking rules. Enough for me to place component trees; not so much that it prescribes content.

**4. Template scope (D4) — page-level or region-level?**

Start page-level only. Here's why:

The dashboard exercise had stats + feed + preview zones. Those zones are *content framing* — they're Container-Base sections with different roles. The page-level layout question is: "how do these zones arrange on the grid across breakpoints?" The region-level question is: "how does the stats zone internally subdivide its cards?"

Page-level layout is the gap we're filling. Region-level subdivision is either (a) handled by Container-Base's existing layout behavior, or (b) a future concern when we have more complex components. Starting with page-level keeps the scope clean and testable.

HOWEVER — the dashboard is the case that challenges this. If the stats zone has 4 stat cards that need to go from 4-across at lg to 2x2 at md to stacked at xs, that's region-level grid behavior that Container-Base doesn't handle. We might need region-level templates eventually. But I'd rather discover that through implementation than pre-build it.

**5. Discovery (D5) — how would I find the right template?**

Context-based matching, same as `find_components`. When I'm specifying a login page, I'd query `find_layout_template({ context: "login" })` or `find_layout_template({ purpose: "centered single content" })`. Browse-a-list works for the initial small set but won't scale.

Experience pattern recommendations would also help: if `simple-form` said "commonly used with `centered-content-page` layout template," that's a useful hint. But it shouldn't be the only discovery path — I might use a form pattern with a non-centered layout.

Combination: context-based search as primary, pattern cross-references as hints.

**6. General — what's missing, what concerns me?**

Three things:

First — **I don't currently have the responsive grid knowledge this spec assumes I'll acquire.** The outline says I need to internalize Token-Family-Responsive.md and Token-Family-Spacing.md § "Grid Spacing Tokens." I haven't read either. Layer 1 (foundation) isn't just "write a doc" — it's "Leonardo actually learns this." The spec should account for that learning step explicitly, not assume it happens by osmosis. A design exercise focused on layout specification (similar to the Spec 083 component exercises) would be more effective than a document I read once.

Second — **the handoff to platform agents is where this succeeds or fails.** I can specify layout perfectly, but if Kenya reads "spans 8 responsive columns at lg" and doesn't know how to translate that to SwiftUI adaptive layout, we've just moved the problem downstream. The spec mentions "platform translation awareness" for me, but the platform agents need the inverse: "responsive grid literacy" so they can receive my specs. The steering doc should serve both directions — my specification vocabulary and their implementation vocabulary should share the same foundation.

Third — **the outline doesn't address the responsive vs reactive distinction.** Peter and I discussed this during review. The key framing:

- **Responsive layout** is per-platform: how a single platform's implementation adapts across its viewport range (iPhone SE through Pro Max, phone through tablet, narrow through wide browser). This is fluid layout adjustment — same content, different arrangement. Every platform needs this. This is what layout templates address.

- **Reactive design** is cross-platform: where the experience intentionally differs between platforms. Not just rearrangement, but substantive differences — additional functionality may or may not be available, sections may exist on web but not phone, a mobile version may be simplified rather than just reflowed. These are product architecture decisions, not layout decisions.

The layering:
1. **Responsive foundation** (per-platform, token-driven) — every platform handles its viewport range using the grid system. Spec 069's primary scope.
2. **Reactive decisions** (cross-platform, product-driven) — where the experience intentionally differs between platforms. Peter decides "phone users don't get bulk export."

This means my screen specs may need more than one component tree — or one tree with platform annotations ("this section exists on web and tablet but not phone"). The responsive layout template handles within-platform adaptation. Reactive annotations handle between-platform differences.

The outline should at minimum *name* this distinction and acknowledge that screen specifications will need to express both. Whether Spec 069 solves the reactive specification problem or scopes to responsive and flags reactive as a future need — that's an open question for Thurgood and Peter.

→ design-outline.md § "Two-Layer Solution", § "Open Decisions"

#### [THURGOOD R1] — Incorporation Notes

Incorporated Leonardo R1 into design-outline.md. Key changes:

- **Layer 1 vocabulary expanded**: Added component sizing within regions, responsive/reactive distinction, reactive annotations. Peter confirmed reactive should be in the canonical vocabulary so agents aren't caught off guard. → design-outline.md § "Two-Layer Solution"
- **Bidirectional literacy added**: Steering doc must serve both Leonardo (specification) and platform agents (implementation). Leonardo's concern about downstream translation is valid. → design-outline.md § "Two-Layer Solution" item 4
- **Learning exercise noted**: Leonardo's recommendation for a layout-focused design exercise (learn by doing, not by reading) captured in Layer 1 and D7. → design-outline.md § "Two-Layer Solution" and D7
- **Delivery mechanism converged**: Both steering doc + MCP, with steering doc as primary. Leonardo's framing (internalization vs lookup) adopted. → design-outline.md § D7
- **D2 updated with schema sketch**: Leonardo's YAML sketch (regions + grid per breakpoint + stacking) added as starting point. → design-outline.md § D2
- **D4 converged**: Page-level only to start, region-level discovered through implementation. Leonardo concurs. → design-outline.md § D4
- **D5 converged**: Context-based matching primary, pattern cross-references as hints. → design-outline.md § D5
- **Responsive vs reactive scope boundary added**: Spec defines vocabulary for both, builds templates for responsive only. Reactive patterns emerge through product work. → design-outline.md § "Architectural Framing"

**Peter's input on concern 3**: Reactive should be part of the canonical vocabulary even though 069 doesn't build reactive templates. Agents shouldn't be caught off guard when cross-platform experience differences arise. Incorporated as vocabulary scope, not template scope.

#### [THURGOOD R2] — Scope Reframe

**Peter raised a critical scoping question**: What templates are we creating without being at the product phase yet?

**Resolution**: Spec 069 is reframed as **infrastructure + vocabulary + exercise**, not production templates. Key changes:

- **New section**: "Spec Scope: Infrastructure, Not Product Templates" — explicitly states what the spec delivers and does not deliver. → design-outline.md § "Spec Scope"
- **Layer 2 reframed**: From "Layout Templates (Acceleration)" to "Layout Template Infrastructure (Acceleration)". Builds schema, indexer, MCP tools. Design exercise produces candidate templates that validate the infrastructure, not production templates. → design-outline.md § "Two-Layer Solution"
- **D6 reframed**: From "First Templates" to "Candidate Templates for Exercise". Exercise inputs, not commitments. Production templates created when product work begins. → design-outline.md § D6
- **Evolution path updated**: Templates grow from product use, not from this spec. Infrastructure is ready for them. → design-outline.md § "Evolution Path"
- **Classification gate pattern**: Production templates go through the same gate established in Spec 083. We learned not to assume what's universal vs product-specific.

#### [@LEONARDO] R2 Review

Leonardo — the outline has been reframed. The spec now explicitly delivers infrastructure + vocabulary + exercise, not production templates. Your R1 feedback is incorporated. Two questions:

1. **Does the scope reframe match your understanding?** You'll learn the grid system through a design exercise, validate the schema against real scenarios, and produce candidate templates. Production templates come later when you're specifying real screens for real products. → design-outline.md § "Spec Scope"

2. **Anything from your R1 that wasn't adequately addressed?** Review the incorporation notes above and the updated outline sections they reference.

---

## Requirements Feedback

### Context for Reviewers
- [To be populated when requirements are drafted]

---

## Design Feedback

### Context for Reviewers
- [To be populated when design is drafted]

---

## Tasks Feedback

### Context for Reviewers
- [To be populated when tasks are drafted]
