# Family Guidance — Companion YAML Files

Machine-queryable prop selection and family member guidance for the Application MCP (`get_prop_guidance` tool).

Each YAML file is a companion to a Component-Family steering doc in `.kiro/steering/`. The family doc contains human-readable prose and rationale; the companion YAML contains structured, machine-parseable guidance.

---

## Read-Both Protocol

**Before modifying either a family doc or its companion YAML, you MUST read both files.**

- Family doc → companion YAML path is in the family doc's cross-reference section
- Companion YAML → family doc path is in the `companion` field

This prevents drift between human-readable and machine-readable guidance.

---

## Convention: Signals, Not Absolutes

`whenToUse` and `whenNotToUse` are **strong signals**, not exclusive claims. A component being a strong candidate for a scenario does not mean it's the only candidate. Multiple families may list overlapping scenarios — agents should weigh all signals (component catalog, experience patterns, assembly validation, family guidance) when making selection decisions.

If this convention proves insufficient — if overlapping guidance across families creates confusion rather than useful signal — revisit with explicit field renaming (`strongCandidateWhen` / `weakCandidateWhen`).

---

## YAML Schema

```yaml
family: "Family-Name"                    # required — family name
companion: ".kiro/steering/Component-Family-{Name}.md"  # required — path to paired family doc

whenToUse:                               # required — string array
  - "Use case description"

whenNotToUse:                            # required — string array
  - "Anti-pattern description — consider Alternative-Component instead"

selectionRules:                          # required — array of rules or rule groups
  # Flat rules (e.g., Button — no sub-type groupings):
  - scenario: "When to use this variant"
    recommend: Component-Name
    props:                               # optional — when selection is by prop, not component
      variant: value
    rationale: "Why this recommendation"

  # Grouped rules (e.g., Form-Inputs — sub-type groupings):
  - group: "Group Name"
    rules:
      - scenario: "When to use this member"
        recommend: Component-Name
        rationale: "Why this recommendation"

accessibilityNotes:                      # required — string array
  - "Accessibility consideration"

patterns:                                # optional — family-scoped composition patterns only
  - name: "Pattern Name"
    description: "What this pattern achieves"
    components:
      - component: Component-Name
        role: "semantic role in pattern"
        props:                           # optional
          variant: value
    relatedPatterns:                      # cross-references to experience patterns
      - pattern-name
```

### Field Reference

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `family` | yes | string | Family name |
| `companion` | yes | string | Path to paired family doc |
| `whenToUse` | yes | string[] | Use cases for this family |
| `whenNotToUse` | yes | string[] | Anti-patterns with alternatives |
| `selectionRules` | yes | array | Flat rules or grouped rules |
| `selectionRules[].scenario` | yes | string | Decision context |
| `selectionRules[].recommend` | yes | string | Component name (must exist in catalog) |
| `selectionRules[].props` | no | map | Prop values when selection is by variant |
| `selectionRules[].rationale` | yes | string | Reasoning (omitted when `verbose=false`) |
| `selectionRules[].group` | no | string | Sub-type grouping name |
| `selectionRules[].rules` | yes (if group) | array | Rules within the group |
| `accessibilityNotes` | yes | string[] | Accessibility considerations |
| `patterns` | no | array | Family-scoped patterns only |
| `patterns[].name` | yes | string | Pattern name |
| `patterns[].description` | yes | string | Purpose (omitted when `verbose=false`) |
| `patterns[].components` | yes | array | Components in the pattern |
| `patterns[].relatedPatterns` | no | string[] | Cross-refs to experience patterns |

---

## D9 Compliance

Rationale text referencing visual properties **must** use token names, not raw values.

- ✅ `"Uses color.contrast.onPrimary for text on primary backgrounds"`
- ❌ `"Uses white text on purple backgrounds"`

`props` values reference prop values as authored in component schemas (e.g., `variant: primary`, `padding: "200"`).

---

## Scope Boundary

- **Family-scoped patterns** belong here: how members of *this family* work together (e.g., Button's "Form Actions" — primary submit + tertiary cancel)
- **Cross-family compositions** belong in `experience-patterns/`: full screen layouts using multiple families (e.g., login form using Form-Inputs + Button + Container)
- Use `relatedPatterns` to cross-reference between the two — don't duplicate

---

## File Naming

Lowercase family name: `button.yaml`, `form-inputs.yaml`, `container.yaml`.
