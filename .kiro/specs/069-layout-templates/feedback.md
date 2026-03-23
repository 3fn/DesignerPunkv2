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
