# Requirement Updates for 054b Spec

**Date**: February 19, 2026
**Purpose**: Draft requirement updates based on Thurgood's spec review
**Status**: Draft for Peter's review

---

## Update 1: Introduction Section — Add Design-to-Spec-to-Code Workflow

**Location**: requirements.md, Introduction section (after "Core Value")

**Add this content:**

### Design-to-Spec-to-Code Workflow

This spec implements **Phase 2: Extraction** of the design-to-spec-to-code workflow. The extractor generates design-outline.md as an **input artifact for spec formalization**, not as a final implementation specification.

**Complete Workflow (for context):**

```
Phase 1: Design in Figma
├─ Designers create components using DesignerPunk tokens (pushed via 054a)
├─ Designers mark designs as "ready for spec"
└─ Design validated in Figma environment

Phase 2: Extraction (THIS SPEC — 054b)
├─ DesignExtractor reads Figma component structure
├─ TokenTranslator matches Figma values to DesignerPunk tokens
├─ VariantAnalyzer provides context-aware recommendations
└─ design-outline.md generated with confidence flags

Phase 3: Spec Review (out of scope — human decision-making)
├─ Ada reviews token usage and governance decisions
├─ Lina reviews component architecture and behavioral contracts
├─ Thurgood reviews spec quality and completeness
└─ Decisions made on token governance, component structure, behavioral contracts

Phase 4: Spec Formalization (out of scope)
├─ design-outline.md → requirements.md (EARS patterns)
├─ design-outline.md → design.md (architecture decisions)
└─ design-outline.md → tasks.md (implementation plan)

Phase 5: Implementation (out of scope)
└─ Code written following formal spec
```

> **Scope Note**: This spec (054b) implements Phase 2 only. Phases 3-5 follow existing DesignerPunk processes (Spec Planning Standards, Component Development Guide, Token Governance).

**Critical Distinction:**

The extraction workflow **surfaces information** for human review. It does NOT make governance decisions:

- **Extraction surfaces**: Repeated primitive token usage patterns with illustrative suggestions
- **Ada decides**: Whether to create component tokens during spec review

- **Extraction surfaces**: Variant mapping recommendations with rationale
- **Lina decides**: Component architecture during spec review

- **Extraction surfaces**: Missing behavioral contracts
- **Thurgood validates**: Spec completeness during spec review

**Rationale**: Extraction is automated information gathering with illustrative suggestions to reduce cognitive load. Governance decisions require human judgment, domain expertise, and alignment with DesignerPunk principles.

---

## Update 2: Requirement 8 — Reframe Component Token Decision Points

**Location**: requirements.md, Requirement 8

**Replace existing Requirement 8 with:**

### Requirement 8: Component Token Usage Pattern Detection

**User Story:**
As a DesignerPunk maintainer, I need repeated primitive token usage patterns flagged during extraction with illustrative component token suggestions, so that Ada can efficiently evaluate component token needs during spec review.

**Acceptance Criteria:**
- Extractor detects when the same primitive token is used repeatedly across component properties
- Extractor flags usage patterns with context (e.g., "space.300 used for padding in 5 locations")
- Extractor provides illustrative component token suggestion (e.g., "button.padding.medium = space.300") to reduce Ada's cognitive load
- Illustrative suggestions explicitly labeled as "pending Ada review" to indicate they are not governance decisions
- Illustrative suggestions follow component token naming conventions (e.g., `{component}.{property}.{scale}`)
- Extractor defers all token creation decisions to spec review phase
- Flagged patterns with illustrative suggestions included in design-outline.md "Component Token Needs" section

**Testable Conditions:**
- GIVEN primitive token `space.300` used for button padding in multiple variants WHEN extraction runs THEN usage pattern flagged with count, locations, and illustrative suggestion
- GIVEN repeated primitive usage WHEN flagged THEN illustrative suggestion follows component token naming conventions (e.g., `button.padding.horizontal = space.300`)
- GIVEN illustrative suggestion provided WHEN design-outline generated THEN suggestion labeled "Illustrative only — pending Ada review"
- GIVEN usage pattern flagged WHEN design-outline generated THEN "Component Token Needs" section includes pattern with context, illustrative suggestion, and rationale

**Example Output in design-outline.md:**

```markdown
## Component Token Needs

### Pattern 1: Repeated Padding Usage

**Primitive Token**: `space.300` (24px)

**Usage Context**:
- Button padding-left: 5 variants
- Button padding-right: 5 variants
- Button padding-top: 3 variants (uses space.200)
- Button padding-bottom: 3 variants (uses space.200)

**Illustrative Suggestion** (pending Ada review):
```
button.padding.horizontal = space.300
button.padding.vertical = space.200
```

**Rationale**: Consistent spacing across button variants suggests semantic intent. Horizontal padding uses space.300 uniformly; vertical padding uses space.200 uniformly. Component tokens would encode this design decision.

**Ada Decision Required**: Evaluate whether component tokens align with Token Governance standards and button component architecture.
```

**Rationale**: 
Illustrative suggestions reduce Ada's cognitive load by showing what a component token *could* look like, while explicit "pending review" framing preserves Ada's autonomy over token governance decisions. This balances efficiency (Ada doesn't start from scratch) with governance (Ada makes the final call).

---

## Update 3: Requirement 9 — Clarify Mode Validation

**Location**: requirements.md, Requirement 9

**Replace existing Requirement 9 with:**

### Requirement 9: Mode Consistency Validation

**User Story:**
As a DesignerPunk maintainer, I need mode value discrepancies flagged during extraction, so that unexpected inconsistencies can be reviewed before spec formalization.

**Acceptance Criteria:**
- Extractor checks if light and dark mode values differ for each token binding
- Extractor categorizes discrepancies as "expected" or "unexpected":
  - **Expected**: Color tokens differ by mode (light/dark theme variations)
  - **Unexpected**: Spacing, radius, or typography tokens differ by mode (structural tokens should be mode-agnostic)
- Extractor flags unexpected discrepancies for human review
- Extractor does NOT block on expected discrepancies (color mode variations)
- Extractor pauses for human decision when unexpected discrepancies found

**Testable Conditions:**
- GIVEN color token with light mode `#FFFFFF` and dark mode `#000000` WHEN validated THEN categorized as "expected" and no flag raised
- GIVEN spacing token with light mode `24px` and dark mode `24px` WHEN validated THEN no discrepancy detected
- GIVEN spacing token with light mode `24px` and dark mode `32px` WHEN validated THEN categorized as "unexpected" and flagged for review
- GIVEN unexpected discrepancy flagged WHEN extraction pauses THEN reports which tokens have mode inconsistencies and requests human decision

**Rationale**:
Modes in Figma serve design exploration (light/dark theme variants). Color tokens naturally differ by mode. Structural tokens (spacing, radius, typography) should be mode-agnostic — discrepancies indicate potential design errors or misunderstandings that require human review before spec formalization.

---

## Update 4: Add Requirement 11 — Documentation

**Location**: requirements.md, after Requirement 10

**Add new requirement:**

### Requirement 11: Developer-Facing Documentation

**User Story:**
As a DesignerPunk developer, I need comprehensive documentation for the Figma extraction workflow, so that I can run extractions, interpret results, and troubleshoot issues without requiring maintainer assistance.

**Acceptance Criteria:**
- Documentation created at `.kiro/steering/Figma-Workflow-Guide.md` covering both token push (054a) and design extraction (054b) workflows
- Figma-specific content migrated from `.kiro/steering/DTCG-Integration-Guide.md` to new Figma workflow guide
- Token Push section documents `npm run figma:push` with all arguments, flags, and examples
- Design Extraction section documents `npm run figma:extract` with all arguments, flags, and examples
- Shared sections cover MCP setup (figma-console-mcp + Kiro Figma Power), Desktop Bridge plugin setup, authentication (PAT and OAuth), and Figma-specific troubleshooting
- Design-to-spec-to-code workflow diagram included in extraction section
- Confidence flag interpretation guide explains ✅ (High Confidence), ⚠️ (Needs Review), ❌ (Requires Human Input)
- Troubleshooting section covers extraction-specific failures: no-match token values, missing Component-Family docs, MCP connection issues, Desktop Bridge not running
- Example design-outline.md provided with annotations explaining each section and confidence flag usage
- Cross-references to related documentation: `dtcg-integration-guide.md` (DTCG format), Token Governance (token decisions), Component Development Guide (component specs), Spec Planning Standards (spec formalization)

**Testable Conditions:**
- GIVEN developer needs to run extraction WHEN consulting documentation THEN finds complete CLI usage with all arguments (`--file`, `--node`, `--output`)
- GIVEN extraction returns ⚠️ confidence flag WHEN consulting documentation THEN finds interpretation guide explaining "approximate match, needs review"
- GIVEN extraction fails with "no-match token value" WHEN consulting troubleshooting THEN finds guidance on handling no-match values (map to suggested token, document as off-system, request new token)
- GIVEN developer unfamiliar with design-to-spec-to-code workflow WHEN consulting documentation THEN finds workflow diagram showing extraction → spec review → formalization → implementation
- GIVEN developer needs to understand DTCG format WHEN consulting Figma workflow guide THEN finds cross-reference to `dtcg-integration-guide.md`

**Documentation Structure:**

```markdown
# Figma Workflow Guide

## Overview
- Bidirectional Figma integration: push tokens (054a), extract designs (054b)
- Prerequisites: Node.js 18+, Figma Desktop, MCP clients

## MCP Setup
- figma-console-mcp installation and configuration
- Kiro Figma Power installation and configuration
- Desktop Bridge plugin setup
- Authentication (PAT vs OAuth)

## Token Push Workflow (Spec 054a)
- CLI: npm run figma:push [arguments]
- Push process and drift detection
- Troubleshooting push failures

## Design Extraction Workflow (Spec 054b)
- Design-to-spec-to-code workflow diagram
- CLI: npm run figma:extract [arguments]
- Confidence flag interpretation (✅ ⚠️ ❌)
- Example design-outline.md with annotations
- Troubleshooting extraction failures

## Troubleshooting
- MCP connection issues
- Desktop Bridge not running
- Authentication failures
- No-match token values
- Missing Component-Family docs

## Related Documentation
- [DTCG Integration Guide](./dtcg-integration-guide.md) — DTCG format details
- [Token Governance](./.kiro/steering/Token-Governance.md) — Token decision-making
- [Component Development Guide](./.kiro/steering/Component-Development-Guide.md) — Component specs
- [Spec Planning Standards](./.kiro/steering/Process-Spec-Planning.md) — Spec formalization
```

**Rationale**:
Developer-facing documentation is a deliverable per Spec Planning Standards. Figma-specific workflows (push + extraction) belong in a tool-specific guide separate from the tool-agnostic DTCG Integration Guide. This structure scales to future tool integrations (Sketch, Adobe XD) without duplicating DTCG format knowledge.

---

## Summary of Changes

| Update | Location | Type | Rationale |
|--------|----------|------|-----------|
| 1 | Introduction | Addition | Clarifies design-to-spec-to-code workflow and extraction vs decision-making distinction |
| 2 | Requirement 8 | Reframe | Emphasizes flagging patterns for review, not making token governance decisions |
| 3 | Requirement 9 | Clarification | Distinguishes expected (color) vs unexpected (structural) mode discrepancies |
| 4 | Requirement 11 | New requirement | Adds developer-facing documentation per Spec Planning Standards |

---

## Next Steps

1. **Peter reviews** these draft requirements
2. **If approved**, update `requirements.md` with these changes
3. **Update tasks.md** to add documentation task for Requirement 11
4. **Update design.md** if architectural changes needed (likely minimal)

---

**Organization**: spec-guide
**Scope**: 054b-figma-design-extract
