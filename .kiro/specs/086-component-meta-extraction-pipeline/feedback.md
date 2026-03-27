# Spec Feedback: Component Meta Extraction Pipeline

**Spec**: 086-component-meta-extraction-pipeline
**Created**: 2026-03-27

---

## Design Outline Feedback

### Context for Reviewers

This spec eliminates dual maintenance of component discoverability data by deriving `component-meta.yaml` from Component-Family steering docs via build-time extraction. Addresses gap report items #16, #17, #18 from Spec 083.

**Key context:**
- Gap report: `docs/specs/083-application-mcp-guidance-completeness/gap-report.md`
- Current authoring guide: `docs/component-meta-authoring-guide.md`
- Ballot measure already applied: component-meta.yaml review step added to Lina's scaffolding workflow

**@ADA**: Any token documentation in family docs that the extraction script might affect? Are there token references in "Usage Guidelines" or "Token Dependencies" sections that need special handling?

**@THURGOOD**: Two questions for you: (1) Is extending the docs MCP indexer to cover `docs/` feasible, or is moving the three reference docs to `.kiro/steering/` simpler? (2) The extraction script is build tooling — does this belong in your domain, or should Lina own it as component infrastructure?

**@LEONARDO**: From the product side — does this extraction approach give you what you need for component discovery? Any search patterns from the Spec 083 exercises that this design wouldn't address?

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
