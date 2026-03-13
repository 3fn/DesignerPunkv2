---
inclusion: always
---

# Spec Feedback Protocol

**Date**: 2026-03-13
**Last Reviewed**: 2026-03-13
**Purpose**: Structured protocol for multi-agent feedback during spec formalization
**Organization**: process-standard
**Scope**: cross-project
**Layer**: 1
**Relevant Tasks**: all-tasks

---

## Purpose

Spec formalization produces shared artifacts (design-outline, requirements, design, tasks) that benefit from multi-agent review. This protocol governs how feedback is captured, directed, and resolved — reducing routing overhead and preventing re-litigation of settled decisions.

---

## The Feedback Document

Every spec MUST have a feedback document created alongside the design outline:

```
.kiro/specs/[spec-name]/feedback.md
```

This is the single location for all agent feedback across the spec lifecycle. See the Spec Feedback Template section below for the required structure.

---

## Feedback Checkpoints

Feedback is organized by spec artifact. Each artifact may have multiple rounds:

1. **Design Outline** — collaborative input before formal docs begin
2. **Requirements** — technical feasibility and acceptance criteria review
3. **Design** — implementation accuracy and architectural review
4. **Tasks** — assignment correctness, sequencing, and scope review

Multiple rounds per artifact are expected when incorporation produces substantial changes.

---

## Mandatory @ Mention Scanning

**ALL AGENTS MUST scan, review, and respond to all new @ mentions directed at them before writing their own feedback.**

When entering a feedback round:
1. Read the feedback document
2. Find and respond to any `[@YOUR_NAME]` mentions you have not yet addressed
3. Then provide your own review feedback

This is a pre-step, not optional. Unanswered @ mentions block shared understanding.

---

## Stamp Format

Every feedback entry MUST be stamped with the agent name and round number using this exact format:

```
[AGENT_NAME R#]
```

Examples:
- `[ADA R1]` — Ada's first round of feedback on the current artifact
- `[LINA R2]` — Lina's second round of feedback on the current artifact
- `[THURGOOD R1]` — Thurgood's first round (typically incorporation notes)

Round numbers reset per artifact section. Round 1 under "Requirements Feedback" is independent of Round 1 under "Design Feedback."

---

## Feedback Entry Format

### Standard Feedback

```markdown
#### [ADA R1]
- Feedback item → artifact.md § "Section Name"
- Another item → artifact.md § "Section Name"
```

Each item references the specific section of the artifact it addresses using `§` notation.

### Directed Questions

When an agent needs a specific answer from another agent:

```markdown
- [@LINA] Question text? → artifact.md § "Section Name" -- [THURGOOD R1]
```

Questions go in the asker's section. The target agent responds in their next round entry.

### Incorporation Notes

When the spec author incorporates feedback:

```markdown
#### [THURGOOD R2]
- Incorporated ADA R1 items 1-3. Req 6 AC 2 softened per item 1.
- ADA R1 item 4: No change — see context note above.
- [@ADA] Does resolveAliases handle mode values? → design-outline.md § "DTCG Format Options" -- [THURGOOD R2]
```

---

## Context for Reviewers

Each artifact section in the feedback document includes a "Context for Reviewers" block. The spec author populates this before requesting review. It contains:

- Key decisions already made, with section references to where the rationale lives
- Scope boundaries (what is and isn't under review)
- Dependencies on prior artifacts

This prevents re-litigation of settled decisions. Reviewers who need deeper context follow the section references.

Format:

```markdown
### Context for Reviewers
- Decision or scope note → source-artifact.md § "Section Name"
- Another decision → design-outline.md § "Section Name"
```

---

## Resolution Tracking

Resolutions live in the feedback document, not in the spec artifacts. Spec artifacts (requirements.md, design.md, tasks.md) should read as clean, settled documents.

The feedback document is the working history — it shows how the spec got to its current state.

---

## Spec Feedback Template

The feedback document uses this structure:

```markdown
# Spec Feedback: [Spec Name]

**Spec**: [spec-number]-[spec-name]
**Created**: [date]

---

## Design Outline Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

---

## Requirements Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

---

## Design Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]

---

## Tasks Feedback

### Context for Reviewers
- [Populated by spec author before requesting review]

[Agent feedback rounds here]
```

---

## MCP Query

For the full protocol:
```
get_document_full({ path: ".kiro/steering/Spec-Feedback-Protocol.md" })
```

For specific sections:
```
get_section({ path: ".kiro/steering/Spec-Feedback-Protocol.md", heading: "Stamp Format" })
get_section({ path: ".kiro/steering/Spec-Feedback-Protocol.md", heading: "Mandatory @ Mention Scanning" })
```
