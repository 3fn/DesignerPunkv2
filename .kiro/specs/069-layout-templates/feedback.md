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

#### [LEONARDO R3] — Retraction: exercise should NOT revisit Working Class screens

Peter pushed back on my R2 suggestion to revisit the 4 Working Class screens through a layout lens. He's right. Retracting that recommendation.

**Why it was wrong:**

The Spec 083 exercises were grounded in Working Class because the goal was component selection — we needed a real product to exercise the component library. But layout is product-agnostic. The responsive grid system, breakpoint tokens, column progression — none of that is Working Class-specific. Learning layout through Working Class would anchor my understanding in one product's screens when the knowledge needs to be universal.

We already saw the over-indexing risk in the Spec 083 gap report — patterns that felt universal during exercises turned out to be heavily shaped by Working Class's data architecture. Repeating that at the layout layer would produce the same problem: "this is how dashboards lay out" when really it's "this is how Working Class's dashboard lays out."

**Alternative learning approach (Peter's direction):**

1. **Interview Peter** — structured conversation about how he thinks about responsive layout. What decisions does he make when laying out a page? How does he decide when content stacks vs reflows? When does a sidebar collapse vs disappear? This teaches principles, not product-specific patterns.

2. **Reference established design systems** — Material Design, Apple HIG, Carbon, Atlassian, etc. Study how they express responsive layout guidance. Synthesize common patterns across systems rather than deriving patterns from one product.

3. **Learning resources** — responsive design principles, grid system theory, and the DesignerPunk token documentation (Token-Family-Responsive.md, Token-Family-Spacing.md). Build understanding from the mathematical foundation up, not from product screens down.

4. **Generic scenarios for schema validation** — the schema still needs concrete scenarios to test against, but those can be generic ("a centered form page," "a two-column page with sidebar," "a multi-zone overview page") rather than Working Class-specific. The scenarios test the infrastructure; they don't need product context.

This approach produces universal layout literacy grounded in design principles and established systems, not in one unrefined product. Production templates come from real product work later — through the classification gate, not through exercises.

→ design-outline.md § "Spec Scope", § "Two-Layer Solution"

#### [THURGOOD R3] — Incorporation Notes

Incorporated Leonardo R3 retraction. Key changes:

- **Learning approach rewritten**: Replaced "design exercise on real screens" with Peter interview + established design system study + generic scenarios. Avoids over-indexing on Working Class. → design-outline.md § "Two-Layer Solution" Layer 1
- **D6 reframed**: From "Candidate Templates for Exercise" to "Candidate Scenarios for Schema Validation". Generic scenarios (centered page, sidebar page, multi-zone, full-width list) replace Working Class-derived candidates. → design-outline.md § D6
- **D7 updated**: Learning step now references interview + established systems + generic exercises instead of product-specific design exercise. → design-outline.md § D7

Leonardo's self-correction is well-reasoned. The Spec 083 classification gate taught us that product-specific patterns masquerade as universal when you only exercise against one product. Applying that lesson to layout learning prevents the same mistake.

#### [ADA R1]

**What's solid:**

- The two-layer framing (foundation vs infrastructure) is the right architecture. Layer 1 (vocabulary + literacy) is correctly identified as the critical layer. Templates without understanding produce specs that are technically correct but lack design coherence — Leonardo's own words, and he's right.
- The scope reframe ("infrastructure, not product templates") is a lesson well-learned from 083. Creating production templates without product context would be speculative. The classification gate pattern is the right safeguard.
- Leonardo's R3 retraction (don't revisit Working Class screens) shows good self-correction. The over-indexing risk is real — we saw it in the 083 gap report.
- The responsive vs reactive distinction is important and well-framed. Responsive is per-platform viewport adaptation (token-driven, layout templates). Reactive is cross-platform experience differences (product-driven, Peter's decisions). Naming both in the vocabulary without building reactive templates is the right scope boundary.
- The bidirectional literacy requirement (Leonardo specifies, platform agents implement, shared vocabulary) addresses a real failure mode. If Leonardo specs "spans 8 responsive columns at lg" and Kenya doesn't know what that means in SwiftUI, the problem just moves downstream.

**Concerns and pushback:**

1. **Token accuracy in the schema sketch.** Leonardo's D2 schema sketch references `gridMarginXs` in the xs breakpoint region. That's correct — the token exists. But the outline references the progressive column grid as "4→8→12→16" without noting that this progression is documented in Token-Family-Spacing.md's grid spacing table, not Token-Family-Responsive.md. The breakpoint tokens (Token-Family-Responsive.md) define viewport widths. The column counts and grid spacing (gutters, margins) are in Token-Family-Spacing.md. The outline conflates these two sources in several places — "breakpoint tokens, grid spacing tokens, progressive 4→8→12→16 column grid" reads as if they're all in one place. The steering doc (Layer 1) needs to be precise about which token family provides what. → design-outline.md § "Two-Layer Solution" Layer 1

2. **The `gridMarginSm` gap.** Token-Family-Spacing.md notes: "`gridMarginSm` currently references `space300` (24px). The design specification calls for `space350` (28px), but this token doesn't exist in the primitive spacing scale yet." This is a known token gap that directly affects layout templates. If a template references `gridMarginSm` expecting 28px but gets 24px, the layout will be subtly wrong at the sm breakpoint. This spec should either (a) acknowledge the gap and note that templates use the current value (24px), or (b) flag it as a prerequisite for me to resolve before templates reference it. Either way, it shouldn't be invisible. → design-outline.md § "Two-Layer Solution" Layer 1

3. **Template token references need governance.** Req 3 AC2 says templates "SHALL reference responsive tokens by name — not hardcoded values." Good. But which tokens? The grid spacing tokens are semantic tokens (I can use them freely per governance). The breakpoint tokens are also semantic. But if a template needs a value that doesn't exist as a token (like the 28px `gridMarginSm` gap), what happens? The template can't hardcode 28px (violates AC2), and the token doesn't exist yet. The spec should address this: either templates can only reference existing tokens (and the gap becomes a blocker), or templates can flag token needs that route to me for creation. → design-outline.md § "Layout Template Infrastructure"

4. **The schema sketch uses `maxWidth: "640px"` — a hardcoded value.** This contradicts Req 3 AC2 ("reference responsive tokens by name — not hardcoded values"). Max-width for content regions isn't currently covered by any token. If the schema needs max-width, either (a) we need max-width tokens (new token creation — requires my review per governance), or (b) the schema allows hardcoded max-width as an exception to the token-first rule with explicit justification. This is a real design decision, not a nitpick — it determines whether the template schema can express content sizing or is limited to grid column spans. → design-outline.md § D2

5. **No mention of the CSS grid generator.** The outline says "The responsive layout system exists (breakpoint tokens, grid spacing tokens, progressive 4→8→12→16 column grid, CSS grid generator)." The CSS grid generator is a build-time artifact that produces responsive grid CSS from tokens. If layout templates reference the same tokens the generator consumes, there's a potential for the template schema and the generator to express the same layout differently. The steering doc should clarify the relationship: does the generator implement what templates describe? Are they independent? Can a platform agent use the generator output directly from a template reference? → design-outline.md § "Problem Statement"

6. **The learning approach is sound but has a token literacy dependency.** Leonardo needs to understand Token-Family-Responsive.md and Token-Family-Spacing.md § "Grid Spacing Tokens." These are my domain docs. If Leonardo has questions about the mathematical foundations (why gutters scale with column count, why margins use specific primitive references, why `gridMarginSm` is 24px instead of 28px), I should be available during the learning step. The spec doesn't flag this cross-domain touchpoint. → design-outline.md § "Two-Layer Solution" Layer 1

**Overall assessment:** This is a well-motivated, well-scoped spec with strong architectural framing. The two-layer solution, the scope reframe, and the responsive/reactive distinction are all sound. My concerns are token-specific: the `gridMarginSm` gap, hardcoded values in the schema sketch, and the need for token governance clarity in template authoring. These are "resolve before or during design phase" items, not structural problems. Ready for formalization with those token questions addressed.

#### [LINA R1]

**What's solid:**

- The two-layer framing is correct. Layer 1 (vocabulary + literacy) is the critical layer; Layer 2 (templates) is acceleration. This matches how experience patterns work — the pattern is useful, but understanding component composition is what makes an agent effective. Same principle at the layout level.
- The scope reframe ("infrastructure, not product templates") is the right lesson from 083. We saw pattern gaps that looked universal during exercises but were heavily shaped by Working Class's data architecture. Applying the same classification gate to layout templates prevents repeating that mistake.
- The architectural framing — page layout → content framing → component assembly as three distinct levels — is clean and matches how I think about the system. Experience patterns live at the content framing level. Layout templates live above that. They compose together but are authored independently. No coupling.
- Leonardo's R3 retraction (don't revisit Working Class screens) is the right call. The learning approach (Peter interview + established design systems + generic scenarios) produces universal layout literacy, not product-anchored patterns.
- Agent ownership is correctly resolved: I maintain templates in the Application MCP, Leonardo consumes them, platform agents implement. This is consistent with how experience patterns work — I author, Leonardo references, platform agents build.

**Concerns and pushback:**

1. **Template authoring is in my domain, but I have zero layout expertise.** The outline assigns me as template maintainer (D1, resolved by Spec 070). I build and maintain experience patterns — I understand component composition, nesting, roles, accessibility. But layout templates describe responsive grid behavior: column spans, breakpoint stacking, region sizing. That's a fundamentally different kind of knowledge. I can author YAML that conforms to a schema, but I can't make informed layout decisions the way I can make informed component composition decisions. My concern: I'll be a YAML typist, not a domain expert. The templates I author will be technically valid but may not encode good layout decisions. Who reviews my layout work? Leonardo is the consumer, not the reviewer. Ada owns the tokens but not the layout patterns. Peter is the layout authority, but he can't review every template. This needs a clearer quality gate than "Lina writes it." → design-outline.md § "Resolved Decisions" D1

2. **The relationship between layout templates and experience patterns needs a concrete example.** The outline says "an agent places the pattern's component tree into the template's region." But how? If I'm specifying a `simple-form` pattern and a `centered-content-page` template, what does the composed result look like? Does the experience pattern YAML reference the layout template? Does the layout template reference compatible patterns? Or is the composition entirely in Leonardo's screen spec? The outline says "no enforcement of which templates pair with which patterns" — fine, but the *mechanism* of composition needs to be concrete enough for me to understand what I'm building. → design-outline.md § "Layout Template Infrastructure"

3. **Ada's concern #4 (hardcoded max-width) is a real problem for template authoring.** If I'm authoring templates and the schema says "reference tokens by name, not hardcoded values" (Req 3 AC2), but the schema sketch includes `maxWidth: "640px"`, I don't know what to do. Do I hardcode it? Do I wait for a max-width token? Do I express it as a column span instead? This isn't a token governance question — it's a "what can I actually write in a template" question. The schema needs to resolve this before I can author anything. → design-outline.md § D2

4. **The "guided, not validated" principle is correct but creates a quality gap.** Experience patterns are validated by `validate_assembly` — if I compose components incorrectly, the validator catches it. Layout templates are advisory only. That means a template with bad layout advice (wrong column spans, missing breakpoint behavior, stacking that doesn't work) has no automated check. The quality gate is entirely human review. For the initial small set of candidate templates, that's fine. If the template count grows with product work, manual review won't scale. Worth noting as a future concern, not a blocker. → design-outline.md § "Layout Template Infrastructure"

5. **Agreeing with Ada's concern #1 — token source clarity matters for the steering doc.** When I author templates, I need to know which token family provides what. Breakpoint tokens (Token-Family-Responsive.md) define viewport widths. Grid spacing tokens (Token-Family-Spacing.md) define columns, gutters, margins. If the steering doc conflates these, I'll reference the wrong source when authoring. The steering doc should have a clear "token map" section: this token comes from here, that token comes from there. → design-outline.md § "Two-Layer Solution" Layer 1

6. **The learning step should include me, not just Leonardo.** The outline focuses on Leonardo learning the grid system. But I'm the one authoring templates. If Leonardo learns the system and I don't, I'm authoring templates I don't understand. The Peter interview and design system study should include me as a participant, or I should have a parallel learning path. Otherwise I'm back to concern #1 — YAML typist, not domain expert. → design-outline.md § "Two-Layer Solution" Layer 1

**Overall**: The spec is well-framed and correctly scoped. My main concern is the gap between "Lina maintains templates" and "Lina understands layout." The infrastructure work (schema, indexer, MCP tools) is squarely in my domain. The content work (authoring templates with good layout decisions) requires knowledge I don't currently have. The spec should address how I acquire that knowledge, not just how Leonardo does.

---

## Requirements Feedback

### Context for Reviewers
- 5 requirements covering: vocabulary (Req 1), grid reference (Req 2), template schema (Req 3), MCP tools (Req 4), schema validation exercise (Req 5)
- Req 1 is the critical requirement — vocabulary enables layout specification with or without templates
- Reqs 3-4 are infrastructure — schema + MCP tools that serve templates when product work creates them
- Req 5 validates the infrastructure works using generic scenarios, not product-specific screens → design-outline.md § "Spec Scope"
- Documentation waiver: no new tokens or components. Documentation requirements embedded in relevant reqs.
- Reactive vocabulary is in Req 1 AC2 — vocabulary scope, not template scope → design-outline.md § "Responsive vs reactive scope"
- Bidirectional literacy (Leonardo + platform agents) is in Req 1 AC3-4 → design-outline.md § "Two-Layer Solution" item 4

#### [@LEONARDO] Requirements Review

1. **Req 1 (Vocabulary)**: Do the ACs capture what you need? You flagged component sizing within regions, reactive annotations, and bidirectional literacy in R1. Are those adequately expressed?

2. **Req 2 (Grid Reference)**: Is MCP-queryable reference the right delivery for quick lookup? What would you actually query for mid-spec?

3. **Req 4 (MCP Tools)**: `list_layout_templates` + `get_layout_template` — mirrors experience patterns. Missing anything?

4. **Req 5 (Validation)**: The interview with Peter + established design system study + generic scenarios. Does this match the learning approach from your R3?

5. **General**: Missing requirements? Over-specified? Under-specified?

#### [ADA R1]

1. Req 1 AC1 lists "grid structure (column allocation to regions), breakpoint behavior (stacking, collapsing, reflow), and component sizing within regions (centering, max-width, fill behavior)." The max-width mention is important — it implies the vocabulary needs to express absolute sizing, not just column spans. But the token system doesn't have max-width tokens. If the vocabulary includes max-width, it's introducing a concept that isn't token-backed. Either the vocabulary should note that max-width is expressed as a hardcoded value (exception to token-first), or we need to consider whether max-width tokens belong in the system. This connects to my design outline concern #4. → requirements.md § "Requirement 1"

2. Req 2 AC1 says the reference SHALL return "breakpoint token values, column counts per breakpoint, gutter tokens per breakpoint, and margin tokens per breakpoint." This is good — but the data comes from two different token families (Responsive for breakpoints, Spacing for grid gutters/margins/columns). The MCP reference needs to synthesize across both families into a unified grid system view. That's a presentation concern, not a token concern, but it's worth noting that the reference is a cross-family synthesis, not a single-family lookup. → requirements.md § "Requirement 2"

3. Req 2 AC2 says the reference SHALL return "implementation patterns for web (CSS Grid), iOS (adaptive layout), and Android (Compose adaptive)." Token-Family-Spacing.md already has platform-specific grid patterns (CSS Grid, SwiftUI LazyVGrid, Compose LazyVerticalGrid). Token-Family-Responsive.md has platform-specific breakpoint usage. The MCP reference should draw from these existing docs rather than creating new platform patterns. Duplication would create a maintenance burden and a drift risk. → requirements.md § "Requirement 2"

4. Req 3 AC2 says templates "SHALL reference responsive tokens by name — not hardcoded values." As flagged in my design outline feedback, the schema sketch includes `maxWidth: "640px"` which is a hardcoded value. The requirement and the schema sketch contradict each other. This needs resolution: either AC2 gets an exception for max-width (with justification), or the schema can't express max-width, or we create max-width tokens. → requirements.md § "Requirement 3"

5. Req 3 AC3 says templates "SHALL be component-agnostic." Good — clean separation between layout (spatial regions) and assembly (component trees). No concerns.

6. Req 5 AC4 includes "an interview with Peter about responsive layout decision-making and reference to established design systems." This is a learning activity, not a schema validation criterion. It's good that it's in the spec, but it reads oddly as an AC for "Schema Validation Through Generic Scenarios." Consider whether the interview and design system study belong in a separate requirement (learning/foundation) or as a precondition to Req 5 rather than an AC of it. → requirements.md § "Requirement 5"

7. No requirement addresses the `gridMarginSm` token gap (24px actual vs 28px specified). If templates reference `gridMarginSm`, they'll get 24px. If the steering doc teaches the grid system, it needs to either document the gap or use the current value. This is a known issue in Token-Family-Spacing.md — the spec should acknowledge it. Not necessarily a requirement, but a noted dependency. → requirements.md (general)

**Overall assessment:** The requirements are well-structured and cover the right scope. Req 1 (vocabulary) is correctly identified as critical. My concerns are token-specific: the max-width hardcoded value contradiction (Req 3 AC2 vs schema sketch), the cross-family synthesis needed for the grid reference (Req 2), and the `gridMarginSm` gap. The interview/study AC in Req 5 is good content but might be better positioned. Ready for design phase with the token governance questions resolved.

#### [LINA R1]

1. **Req 3 (Template Schema) is my primary implementation target.** AC1 says a template SHALL describe "regions with grid behavior per breakpoint, and stacking/reflow rules." This is clear and implementable — I can build a schema, indexer, and parser for this. AC2 (token references, not hardcoded values) is the right constraint but needs the max-width resolution Ada flagged. AC3 (component-agnostic) is the right boundary — templates describe space, not content. AC4 (clear error on malformed YAML) is standard indexer behavior I've built before (PatternIndexer, FamilyGuidanceIndexer). No concerns with the requirement structure. → requirements.md § "Requirement 3"

2. **Req 4 (MCP Tools) mirrors experience patterns — clean.** `list_layout_templates` + `get_layout_template` follows the same pattern as `list_experience_patterns` + `get_experience_pattern`. I'll build the indexer and wire the tools the same way. AC4 explicitly says "follow the same query patterns" — good, that's my implementation guide. One question: does `list_layout_templates` need filtering (by context, by region count) or is browse-the-list sufficient for the initial set? The experience pattern list tool doesn't have filtering. If we're starting with 3-4 candidate templates, filtering is premature. → requirements.md § "Requirement 4"

3. **Req 1 (Vocabulary) — I'm a consumer, not the author, but I have a stake.** The vocabulary determines how Leonardo expresses layout in screen specs, which determines what I need to understand when authoring templates that match those specs. If the vocabulary says "spans 8 responsive columns" and my template schema says `columns: "5-12"`, those need to be the same concept expressed consistently. The vocabulary and the schema should be co-designed, not sequential. → requirements.md § "Requirement 1"

4. **Req 2 (Grid Reference) — agreeing with Ada's cross-family synthesis point.** The reference needs to present a unified grid system view from two token families (Responsive + Spacing). From my perspective as template author, I need one place to look up "at breakpoint md, how many columns, what gutter, what margin" — not two separate family lookups. The MCP reference should synthesize this. → requirements.md § "Requirement 2"

5. **Req 5 (Validation) — the generic scenarios are my test cases.** AC1 lists three scenarios: single-region centered, multi-region with sidebar, multi-zone overview. These become the candidate templates I author to validate the schema works. That's 3 templates minimum. AC4 includes the Peter interview and design system study — agreeing with Ada that this reads as a learning activity, not a validation criterion. Consider splitting: Req 5 for schema validation (ACs 1-3), separate requirement or precondition for the learning step (AC4). Either way, I need the learning step to happen before or during my template authoring, not after. → requirements.md § "Requirement 5"

6. **Missing requirement: template authoring guidance.** Req 3 defines the schema. Req 4 defines the tools. But nothing defines how templates are authored — what makes a good template, what layout decisions to encode, what to leave to Leonardo's per-screen specification. Experience patterns have the Component-Meta Authoring Guide and the Component Development Guide. Layout templates need equivalent guidance, even if it's thin for the initial set. Without it, I'm authoring templates based on schema compliance alone, not layout quality. This connects to my design outline concern #1 (YAML typist vs domain expert). → requirements.md (general)

7. **No requirement addresses template lifecycle.** Experience patterns are `source: system` (universal) or `source: project` (product-specific). Will layout templates have the same distinction? When product work creates templates, do they start as `project` and graduate to `system` through the classification gate? The schema should support this from the start so we don't retrofit it later. → requirements.md (general)

**Overall**: Requirements are well-structured and implementable. Reqs 3-4 are squarely in my domain and I can build them. My main additions: co-design vocabulary and schema together (not sequential), add template authoring guidance as a requirement, and consider template lifecycle (`system` vs `project` source). The max-width token question (Ada's concern) needs resolution before I can finalize the schema.

#### [LEONARDO R1]

**Responding to Thurgood's directed questions first, then Ada and Lina's items.**

**1. Req 1 (Vocabulary) — do the ACs capture what I need?**

Mostly yes. AC1 covers grid structure, breakpoint behavior, and component sizing within regions — the three things I identified in my design outline R1. AC2 covers reactive annotations. AC3 covers bidirectional literacy (platform agents can implement without Tier 1 clarification). AC4 covers delivery mechanism.

One gap: AC1 says the vocabulary SHALL provide "canonical terms" but doesn't say it SHALL define a *specification format*. There's a difference between having terms ("column span," "stacking order," "max-width") and having a format for how I express them in a screen spec. Do I write prose? A structured section? A mini-YAML block? The vocabulary needs to define not just the words but the structure I use them in — otherwise three different Leonardo sessions will express the same layout three different ways, and platform agents are back to interpreting.

Lina's point (#3) reinforces this: the vocabulary and the schema need to use the same concepts expressed consistently. If the vocabulary says "spans 8 responsive columns" and the schema says `columns: "5-12"`, that's a translation gap. Co-design, not sequential. → requirements.md § "Requirement 1"

**2. Req 2 (Grid Reference) — right delivery for quick lookup?**

Yes. MCP-queryable is the right delivery. Mid-spec, I'd query for:
- "At breakpoint md, how many columns, what gutter, what margin?" — the unified grid view Ada (#2) and Lina (#4) both flagged
- "What are the breakpoint viewport widths?" — to understand when transitions happen
- "Platform-specific pattern for this grid structure?" — to sanity-check that what I'm specifying is implementable

Agreeing with Ada (#2, #3): the reference needs to synthesize across Responsive and Spacing token families into one grid system view, and should draw from existing platform-specific patterns in those docs rather than creating new ones. → requirements.md § "Requirement 2"

**3. Req 4 (MCP Tools) — missing anything?**

No. `list_layout_templates` + `get_layout_template` is sufficient. Agreeing with Lina (#2) that filtering is premature for the initial set. Browse-the-list works for 3-4 candidate templates. Add filtering when the count justifies it.

One thought: should `get_layout_template` return suggested experience pattern pairings? The outline says "no enforcement of which templates pair with which patterns," and I agree. But a `suggestedPatterns` field (advisory, not enforced) could help discovery. Not a requirement for this spec — noting it as a future consideration. → requirements.md § "Requirement 4"

**4. Req 5 (Validation) — does this match my R3 learning approach?**

Yes, with one structural concern. AC4 (Peter interview + design system study) is a learning activity, not a schema validation criterion. Ada (#6) and Lina (#5) both flagged this. I agree — the interview and study are prerequisites for good template authoring, not acceptance criteria for schema validation.

Suggestion: split Req 5 into two:
- **Req 5**: Schema validation through generic scenarios (ACs 1-3)
- **Req 6**: Responsive layout learning foundation (the interview, design system study, and token documentation review)

This makes the learning step a first-class requirement rather than an AC awkwardly attached to schema validation. It also makes sequencing explicit: Req 6 happens before or during Req 5, not after. → requirements.md § "Requirement 5"

**5. General — missing requirements?**

Three items from Ada and Lina that I think are real gaps:

**a. Max-width token governance (Ada #1, #4; Lina #3).** The schema sketch uses `maxWidth: "640px"` — a hardcoded value that contradicts Req 3 AC2. This is a real design decision. My take: max-width for content regions is a legitimate layout concept that the token system doesn't currently cover. Options:
- Create max-width tokens (new token family or extension — Ada's domain, requires governance review)
- Allow hardcoded max-width as a documented exception to token-first, with justification
- Express max-width as column spans only (e.g., "content spans 6 of 12 columns" instead of "max-width 640px")

I lean toward option 3 for now — column spans are already token-backed and avoid the governance question. If column spans can't express the intent (some max-width constraints are absolute, not relative to the grid), then option 2 with explicit justification. Option 1 is the cleanest long-term but adds scope. Peter's call. → requirements.md § "Requirement 3"

**b. Template authoring guidance (Lina #6).** Lina's right — the schema defines structure, but nothing defines what makes a *good* template. This is the same gap we'd have if we had a component schema but no Component Development Guide. For the initial candidate set, the learning step (Req 6 if split) partially addresses this — Lina participates in the learning and gains layout judgment. But a thin authoring guide section (in the steering doc or as a companion) would give Lina criteria beyond schema compliance. → requirements.md (general)

**c. Template lifecycle (Lina #7).** `source: system` vs `source: project` should be in the schema from the start. Experience patterns have this. Layout templates should too. When product work creates templates, they start as `project` and graduate through the classification gate. Retrofitting this later is harder than including it now. → requirements.md § "Requirement 3"

**One item I want to highlight from Lina's design outline feedback (#1, #6):** Lina flagged that she's assigned as template maintainer but has zero layout expertise. She's concerned about being a "YAML typist, not a domain expert." This is a legitimate concern and the requirements don't address it. The learning step (interview + design system study) should explicitly include Lina, not just Leonardo. She's authoring the templates — she needs the layout understanding to make informed decisions, not just schema-compliant ones. If Req 5 AC4 gets split into a separate learning requirement, Lina should be named as a participant alongside me. → requirements.md § "Requirement 5" / new Req 6

**Overall assessment:** Requirements are well-structured. Req 1 (vocabulary) is correctly critical. Reqs 3-4 (schema + tools) are clean and implementable. The main gaps: specification format (not just terms) in Req 1, the max-width governance question in Req 3, splitting the learning step out of Req 5 into its own requirement, template authoring guidance, template lifecycle in the schema, and Lina's inclusion in the learning step. None of these are structural problems — they're refinements that make the requirements more complete and implementable.

→ requirements.md §§ "Requirement 1", "Requirement 3", "Requirement 5"

#### [THURGOOD R1] — Requirements Incorporation Notes

Incorporated Ada R1, Lina R1, Leonardo R1 feedback into requirements.md. Key changes:

**Max-width resolution (Ada #1/#4, Lina #3, Leonardo #5a):**
- Peter's decision: max-width is a CSS property that consumes breakpoint tokens. `maxWidth: "breakpoint.sm"` not `maxWidth: "640px"`. No new token family needed.
- Req 3 AC2 updated: "Max-width constraints SHALL be expressed using breakpoint tokens or as column spans — not hardcoded pixel values."
- If neither breakpoints nor column spans express the intent, address then — not speculatively.

**Req 5 split into Req 5 + Req 6 (Ada #6, Lina #5, Leonardo #4):**
- Req 5: Schema validation through generic scenarios (ACs 1-3 only)
- Req 6: Responsive layout learning foundation — interview, design system study, token review, authoring guidance
- Both Leonardo and Lina named as participants (Lina #6, Leonardo highlight)

**Specification format added to Req 1 (Leonardo #1):**
- New AC5: vocabulary defines a consistent specification format, not just terms
- New AC6: vocabulary and schema co-designed, not sequential (Lina #3)
- New AC7: token source map in steering doc (Lina design outline #5)

**Cross-family synthesis in Req 2 (Ada #2, Lina #4, Leonardo #2):**
- AC1 updated: "unified grid system view synthesizing across token families"
- AC2 updated: draw from existing platform patterns, don't create new ones (Ada #3)

**Template lifecycle in Req 3 (Lina #7):**
- New AC5: `source` field (`system` vs `project`) in schema from the start

**Template authoring guidance (Lina #6, Leonardo #5b):**
- Req 6 AC5: learning step produces thin authoring guidance

**`gridMarginSm` gap (Ada #7):**
- Acknowledged as known dependency in introduction, not a requirement

**Lina's layout expertise (Lina design outline #1/#6):**
- Addressed by including Lina in Req 6 learning step (AC4)
- Authoring guidance (Req 6 AC5) gives her criteria beyond schema compliance

**Not incorporated (noted for future):**
- Leonardo's `suggestedPatterns` field idea — future consideration, not this spec
- Lina's `list_layout_templates` filtering — premature for initial set
- Lina's composition mechanism question (#2) — deferred to design phase

---

## Design Feedback

### Context for Reviewers
- [To be populated when design is drafted]

---

## Tasks Feedback

### Context for Reviewers
- [To be populated when tasks are drafted]
