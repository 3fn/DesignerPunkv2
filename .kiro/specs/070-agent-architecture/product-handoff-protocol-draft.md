# Product Handoff Protocol — Draft

**Date**: 2026-03-20
**Status**: Draft for Peter's review — not finalized
**Spec**: 070-agent-architecture

---

## Purpose

Product development follows the same spec workflow as system development (design-outline → requirements → design → tasks). The Spec-Feedback-Protocol governs communication during spec formalization.

This protocol covers **implementation-phase communication** — the phase after specs are finalized and platform agents are building. It supplements the spec workflow; it doesn't replace it.

---

## Why This Exists

System agents (Ada, Lina, Thurgood) communicate at low frequency — mostly at spec boundaries. Their domains are largely independent.

Product agents operate differently. Leonardo and platform agents have a continuous feedback loop during active implementation. A single screen build may involve multiple round-trips: spec → implement → question → clarify → continue → discover → adjust → review → iterate. The protocol must support this rhythm without creating overhead that kills velocity.

---

## Communication Reality

Currently, agents cannot communicate directly. All agent-to-agent communication is human-mediated — Peter relays between agents by swapping contexts. This protocol is designed for that reality:

- Message shapes are simple enough to relay without losing information
- Formality scales with importance, not frequency
- Quick clarifications stay conversational

---

## Three Communication Tiers

### Tier 1: Quick Clarifications

**Frequency**: High — multiple times per screen build
**Direction**: Platform → Leo (most common), Leo → Platform
**Format**: Conversational, minimal structure
**Expectation**: Fast turnaround — these are blocking or near-blocking

Examples:
- "SwiftUI's NavigationStack doesn't support X. Options: A or B. My recommendation: A because [reason]. Your call."
- "The spec says Badge-Label-Base for status, but the content is numeric. Should this be Badge-Count-Base instead?"
- "Confirmed — use the sheet presentation, not a full-screen push."

No template required. The only rule: state the question, provide options if you have them, and make a recommendation when possible. Don't make Leo (or Peter) do the thinking for you.

When a Tier 1 clarification results in a design or implementation decision, the platform agent captures it in their Implementation Report under "Decisions Made During Implementation." This keeps Tier 1 fast while ensuring decisions are traceable.

### Tier 2: Implementation Reports

**Frequency**: Once per screen or flow completion
**Direction**: Platform → Leo
**Format**: Structured, captured for reference
**Expectation**: Delivered when implementation is complete, before moving to next work

Template:

```markdown
## Implementation Report: [Screen/Flow Name]

**Platform**: {PLATFORM}
**Agent**: {NAME}
**Date**: [date]

### What Was Built
[Brief description of what was implemented]

### Deviations from Spec
[List any places where implementation differs from Leonardo's specification, with rationale]
- None / or list each with reason

### Decisions Made During Implementation
[Tier 1 clarifications that resulted in design or implementation decisions]
- Decision — context and rationale
- None / or list each

### Discoveries
[Anything learned during implementation that Leo or the system should know]
- Platform constraints encountered
- Patterns that worked better than expected
- Gaps in components, tokens, or MCP tools
- None / or list each

### Open Items
[Anything unresolved that needs Leo's attention]
- None / or list each
```

### Tier 3: System Escalation Requests

**Frequency**: Infrequent — when product work reveals system-level gaps
**Direction**: Leo → Peter → Thurgood (Thurgood triages and routes to the appropriate system agent)
**Format**: Formal, structured for actionability
**Expectation**: Not urgent unless blocking. Peter relays to Thurgood, who triages to Ada, Lina, or handles directly.

**Blocking exception**: When a platform agent hits a system-level issue that is actively blocking implementation AND Leonardo's architectural judgment isn't needed (broken component, build failure, token generation error), the platform agent may flag directly to Peter for routing to Thurgood. This bypasses Leonardo because the issue is about broken infrastructure, not cross-platform decisions. This is the exception, not the rule.

Template:

```markdown
## System Request: [Brief Title]

**From**: Leonardo
**Route to**: Thurgood (for triage)
**Date**: [date]
**Priority**: [Blocking / Can work around]

### Context
[What was being built when the gap was discovered]

### Gap
[What's missing — component, token, validation, pattern]

### What Was Tried
[MCP queries, workarounds attempted]

### What's Needed
[Specific ask — new component, token extension, MCP tool fix, pattern update]
```

---

## Lessons Synthesis Review

### Purpose

During implementation, lessons accumulate from multiple sources — Leonardo's discoveries, platform agents' Implementation Reports, Stacy's audit findings. The Lessons Synthesis Review is the forcing function that processes accumulated lessons and routes them to where they matter.

Without this step, lessons collect but never get acted on.

### Timing

**Default trigger**: After a complete feature or flow is implemented across active platforms.

**Early trigger**: After a single screen, when that screen produced significant discoveries (new platform constraints, major component gaps, pattern mismatches).

Stacy determines when a synthesis review is warranted based on the volume and significance of accumulated lessons.

### Participants

- **Stacy** leads — she's been tracking lessons incrementally and has the full picture
- **Leonardo** provides architectural context — which discoveries have cross-platform implications
- **Platform agents** provide implementation context when specific discoveries need clarification
- **Peter** mediates and makes routing decisions for system-level items

All participation is human-mediated through Peter.

### Inputs

- Stacy's `lessons-in-progress.md` (incremental captures from audits)
- Leonardo's lessons-learned discoveries (from his operational mode)
- Platform agents' Implementation Reports (discoveries sections)
- Any Tier 1 clarifications that revealed systemic issues

### Process

1. Stacy consolidates all accumulated lessons from the inputs above
2. Each lesson is classified:
   - **Product-specific** → stays in product context, informs future screens
   - **Systemic DesignerPunk** → becomes a Tier 3 System Escalation Request routed to the appropriate system agent
   - **Process** → informs protocol or workflow adjustments
   - **Pattern candidate** → recurring pattern worth systematizing (new component, token, or experience pattern)
3. Stacy drafts the synthesis document with classifications and recommended routing
4. Peter reviews and approves routing decisions
5. Tier 3 requests are created for system-level items

### Output

A synthesis document at `.kiro/specs/[spec]/completion/lessons-synthesis-[feature].md`:

```markdown
## Lessons Synthesis: [Feature/Flow Name]

**Date**: [date]
**Led by**: Stacy
**Scope**: [screens/flows covered]

### Product-Specific Lessons
[Lessons that stay in product context]
- Lesson → impact on future work

### System Escalation Requests
[Lessons routed to system agents]
- Lesson → Tier 3 request drafted for [Ada/Lina/Thurgood]

### Process Adjustments
[Lessons that affect how the team works]
- Lesson → proposed adjustment

### Pattern Candidates
[Recurring patterns worth systematizing]
- Pattern → candidate for [component/token/experience pattern]
```

---

## Direction-Specific Patterns

### Leo → Platform (Screen Spec Handoff)

This is the spec workflow's output — design.md and tasks.md from the product spec. No additional format needed. Leonardo may add platform-specific notes inline.

When handing off, Leo should confirm:
- Component tree is complete
- Token references are specified
- Platform-specific notes are included where divergence is expected
- Accessibility requirements are explicit

### Platform → Leo (Raising Concerns Before Implementation)

Before starting implementation, platform agents should flag concerns about the spec. This is a Tier 1 clarification, not a formal report. The goal is to catch issues before code is written, not after.

### Leo → Peter (Status Updates)

When Peter asks for status or at natural checkpoints:
- Where each platform stands
- Any blocking items awaiting decisions
- Discoveries that may affect product direction
- System requests pending routing

No template — conversational, adapted to what Peter needs to know.

---

## Stacy's Role in the Protocol

Stacy (Product Governance) is not a participant in the Tier 1/2/3 communication flow — she audits its outputs. Specifically:

- **Tier 2 Implementation Reports**: Stacy audits these for completeness (deviations documented, discoveries captured) as part of her process audit. She does not receive them directly — she reviews them after the fact.
- **Tier 3 System Escalation Requests**: Stacy verifies these are structured and actionable as part of lessons-learned governance.
- **Tier 1 Quick Clarifications**: Not auditable — conversational and ephemeral by design.

Stacy's incremental capture rule (lessons-in-progress.md) operates independently of this protocol.

---

## Relationship to Existing Protocols

| Protocol | Scope | Phase |
|----------|-------|-------|
| Spec-Feedback-Protocol | Multi-agent review of spec artifacts | Spec formalization (before implementation) |
| Product Handoff Protocol | Implementation communication | During and after implementation |
| Ballot Measure Protocol | Shared knowledge changes | Any time (governance) |

---

## Notes on This Draft

### What I'm confident about:
- Three-tier structure matches the actual communication frequency and formality needs
- Tier 1 being conversational prevents overhead from killing velocity
- Acknowledging human-mediated reality keeps the protocol honest and practical
- Clear relationship to Spec-Feedback-Protocol avoids overlap

### What needs Peter's review:
- Does the System Escalation Request template give system agents enough to act on?

### What I'm uncertain about:
- Whether Leo → Platform feedback after review (cross-platform consistency notes) needs its own shape, or if Tier 1 covers it
