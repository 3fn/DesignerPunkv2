# Requirements Document: Figma Design Extraction

**Date**: February 18, 2026
**Updated**: February 19, 2026 (Thurgood spec review)
**Spec**: 054b - Figma Design Extraction
**Status**: Requirements Phase (Realigned post-054a/054c)
**Dependencies**: Spec 053 (DTCG Token Format Generator), Spec 054 Design Outline (shared architectural context), Spec 054a (Figma Token Push), Spec 054c (Figma Token Push Fixes)

---

## Introduction

This spec implements the design extraction workflow: Figma designs → design-outline.md. Building on Spec 054a's token push, this enables designers to create validated designs in Figma that become formal component specs.

**Core Value:**
- Designers iterate in Figma using DesignerPunk tokens
- Validated designs are extracted to design-outline.md
- Design-outline enters spec process (requirements → design → tasks → implementation)
- Human review ensures quality and alignment with Stemma patterns

**Workflow:**
```
Figma Design (using DesignerPunk tokens)
  → Designer marks as "ready for spec"
  → DesignExtractor (this spec)
  → TokenTranslator (automatic translation)
  → design-outline.md (with confidence flags)
  → Human review (Ada, Lina, Thurgood)
  → Spec process
```

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

## Requirements

### Requirement 1: DesignExtractor Implementation

**User Story:**
As a DesignerPunk maintainer, I need an extractor that reads Figma designs and generates design-outline.md, so that validated designs can enter the spec process.

**Acceptance Criteria:**
- DesignExtractor reads Figma component structure via Kiro Figma Power (`get_design_context`, `get_metadata`)
- DesignExtractor reads token bindings via figma-console-mcp (`figma_get_token_values`)
- DesignExtractor reads styles via figma-console-mcp (`figma_get_styles`)
- Extractor queries Component-Family docs via DesignerPunk MCP for context
- Extractor queries Component-Readiness-Status for existing components
- Extractor generates design-outline.md with required sections
- Extractor flags missing information with confidence levels (✅ ⚠️ ❌)
- Extractor pauses on critical missing information (behavioral contracts, no-match tokens)

**Testable Conditions:**
- GIVEN Figma component WHEN extraction runs THEN design-outline.md is generated
- GIVEN Component-Family doc exists WHEN extraction runs THEN context-aware recommendations are provided
- GIVEN no Component-Family doc WHEN extraction runs THEN extractor flags missing doc and recommends creation
- GIVEN missing behavioral contracts WHEN extraction runs THEN extractor flags as ❌ and blocks progression

---

### Requirement 2: TokenTranslator Implementation

**User Story:**
As a designer, I need automatic translation of Figma values to DesignerPunk tokens, so that I can see which tokens my design uses.

**Acceptance Criteria:**
- TokenTranslator uses variable-binding-first approach: match by Figma variable name before falling back to value-based matching
- `translateByBinding()` converts Figma variable names (slash notation `space/100`) to DTCG token paths (dot notation `space.100`) via `figmaNameToTokenPath()`
- `translateByValue()` applies tolerance rules (±2px spacing, ΔE < 3 color, ±1px font size/radius) as fallback for unbound values
- `translate()` composite method tries binding first, then value fallback
- Translator enriches responses with both primitive and semantic token references
- TranslationResult includes `matchMethod: 'binding' | 'value'` to indicate how match was found
- Translator flags no-match values and pauses for human decision

**Testable Conditions:**
- GIVEN Figma variable `space/300` bound to element WHEN translated via binding THEN returns `space.300` (exact, binding)
- GIVEN unbound Figma value 24px WHEN translated via value THEN returns `space.300` (exact, value)
- GIVEN unbound Figma value 25px WHEN translated via value THEN returns `space.300` (approximate, ±2px tolerance)
- GIVEN unbound Figma value 30px WHEN translated THEN returns no-match and pauses
- GIVEN Figma variable `color/purple/300` WHEN translated THEN returns `color.primary` (semantic) and `color.purple.300` (primitive)

---

### Requirement 3: Composite Token Reconstruction

**User Story:**
As a designer, I need composite tokens (shadow, typography) recognized from Figma styles, so that extraction identifies which composite tokens my design uses.

**Acceptance Criteria:**
- Extractor reads Figma effect styles (shadows) via figma-console-mcp `figma_get_styles`
- Extractor reads Figma text styles (typography) via figma-console-mcp `figma_get_styles`
- Primary path: match style names directly to DesignerPunk composite tokens (names match because 054a pushed them)
- Fallback path: reconstruct from raw properties if no style match (designer applied raw values without using a style)
- Extractor flags decomposed composites for Ada's review

**Testable Conditions:**
- GIVEN Figma effect style `shadow.elevation200` WHEN extracted THEN returns composite token `shadow.elevation200` (name match, binding method)
- GIVEN Figma text style `typography.heading200` WHEN extracted THEN returns composite token `typography.heading200` (name match, binding method)
- GIVEN raw shadow properties (no style applied) WHEN extracted THEN attempts reconstruction from properties (value method)
- GIVEN decomposed shadow properties WHEN no match THEN flags for Ada's review

---

### Requirement 4: Context-Aware Variant Mapping

**User Story:**
As a DesignerPunk maintainer, I need context-aware variant mapping recommendations, so that Figma variants map correctly to Stemma component structure.

**Acceptance Criteria:**
- Extractor queries Component-Family doc for established patterns
- Extractor queries Component-Readiness-Status for existing components
- Extractor analyzes behavioral differences vs styling differences
- Extractor provides recommendations with rationale
- Extractor flags conflicts between family pattern and behavioral analysis
- Extractor recommends Component-Family doc creation if missing

**Testable Conditions:**
- GIVEN Component-Family-Button.md exists WHEN extracting button THEN recommendations align with family pattern
- GIVEN no Component-Family doc WHEN extracting THEN extractor flags missing doc and recommends creation
- GIVEN variants differ only in styling WHEN analyzing THEN recommends single component with variant prop
- GIVEN variants differ in behavior WHEN analyzing THEN recommends primitive + semantic structure

---

### Requirement 5: Design Outline Quality Checklist

**User Story:**
As a DesignerPunk maintainer, I need design-outlines that cover all required areas, so that specs are complete and actionable.

**Acceptance Criteria:**
- Design-outline includes all required sections (Component Purpose, Variants, States, Token Usage, Accessibility, Platform Behaviors, Edge Cases, Extraction Confidence, Inheritance Pattern, Behavioral Contracts, Platform Parity, Component Token Needs, Accessibility Contracts)
- Each section has appropriate confidence flags (✅ ⚠️ ❌)
- Missing information is explicitly flagged
- Human action required is clearly stated

**Testable Conditions:**
- GIVEN extraction complete WHEN design-outline generated THEN all required sections are present
- GIVEN exact token match WHEN flagged THEN uses ✅ High Confidence
- GIVEN approximate token match WHEN flagged THEN uses ⚠️ Needs Review
- GIVEN no token match WHEN flagged THEN uses ❌ Requires Human Input

---

### Requirement 6: Behavioral Contract Detection

**User Story:**
As a DesignerPunk maintainer, I need behavioral contracts explicitly flagged when missing, so that interactive components have complete specifications.

**Acceptance Criteria:**
- Extractor distinguishes interactive components (buttons, inputs) from static components (badges, dividers)
- Extractor flags missing behavioral contracts for interactive components
- Extractor auto-generates "no interaction" contract for static components
- Extractor blocks progression to requirements.md until behavioral contracts are defined

**Testable Conditions:**
- GIVEN interactive component (button) WHEN extracted THEN flags missing behavioral contracts as ❌
- GIVEN static component (badge) WHEN extracted THEN auto-generates "no interaction" contract
- GIVEN missing behavioral contracts WHEN design-outline reviewed THEN blocks progression to requirements.md

---

### Requirement 7: Platform Parity Detection

**User Story:**
As a DesignerPunk maintainer, I need platform-specific interactions flagged, so that cross-platform consistency is validated.

**Acceptance Criteria:**
- Extractor detects platform-specific interactions (hover = web-only, press = mobile)
- Extractor queries platform-implementation-guidelines.md for validation
- Extractor flags platform parity concerns with recommendations
- Extractor provides decision options (omit on mobile, map to press, other)

**Testable Conditions:**
- GIVEN hover state in Figma WHEN extracted THEN flags as web-specific with mobile recommendation
- GIVEN focus state in Figma WHEN extracted THEN flags as all-platform
- GIVEN platform guidelines queried WHEN validating THEN cross-references heuristics with guidelines

---

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

---

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

---

### Requirement 10: CLI Command

**User Story:**
As a DesignerPunk maintainer, I need a CLI command to trigger design extraction, so that I can extract designs on demand.

**Acceptance Criteria:**
- CLI command `npm run figma:extract` triggers extraction workflow
- CLI command accepts `--file <file-key>` and `--node <node-id>` arguments
- CLI command accepts `--output <path>` for design-outline location
- CLI command reports extraction results (confidence flags, warnings, errors)
- CLI command exits with error code on failure
- CLI performs stale port cleanup before connecting (lesson from 054c ISSUE-4)
- CLI calls `consoleMcp.disconnect()` in finally block to prevent stale processes (lesson from 054c)

**Testable Conditions:**
- GIVEN CLI command `npm run figma:extract -- --file <key> --node <id>` WHEN executed THEN extraction runs
- GIVEN extraction success WHEN command completes THEN exit code is 0
- GIVEN extraction failure WHEN command completes THEN exit code is non-zero
- GIVEN no-match values WHEN extraction pauses THEN reports pause reason and exits with error
- GIVEN CLI exits (success or failure) WHEN finally block runs THEN consoleMcp.disconnect() is called

---

### Requirement 11: Developer-Facing Documentation

**User Story:**
As a DesignerPunk developer, I need comprehensive documentation for the Figma extraction workflow, so that I can run extractions, interpret results, and troubleshoot issues without requiring maintainer assistance.

**Acceptance Criteria:**
- Documentation created at `docs/figma-workflow-guide.md` covering both token push (054a) and design extraction (054b) workflows
- Figma-specific content migrated from `docs/dtcg-integration-guide.md` to new Figma workflow guide
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

---

## Documentation Requirements

### User-Facing Documentation

1. **Figma Workflow Guide** (new `docs/figma-workflow-guide.md`)
   - Comprehensive guide covering both push and extraction workflows
   - Migrates Figma-specific content from DTCG Integration Guide
   - See Requirement 11 for complete structure

2. **DTCG Integration Guide** (update existing `docs/dtcg-integration-guide.md`)
   - Remove Figma-specific content (migrated to Figma Workflow Guide)
   - Keep tool-agnostic DTCG format documentation
   - Cross-reference to Figma Workflow Guide for Figma-specific usage

### Internal Documentation

1. **054b Design Document** (`design.md`)
   - DesignExtractor architecture
   - TokenTranslator implementation
   - MCP query strategy
   - Behavioral analysis heuristics
   - Composite token reconstruction
   - Conflict resolution strategy

2. **054b Tasks Document** (`tasks.md`)
   - Task breakdown with validation tiers
   - Implementation sequence
   - Testing strategy

---

## Success Criteria

This spec is complete when:

1. ✅ DesignExtractor generates valid design-outline.md
2. ✅ TokenTranslator matches Figma values to DesignerPunk tokens
3. ✅ Composite token reconstruction works for shadows and typography
4. ✅ Context-aware variant mapping provides recommendations
5. ✅ Behavioral contract detection flags missing contracts
6. ✅ Platform parity detection flags platform-specific interactions
7. ✅ Component token decision points are surfaced for Ada review
8. ✅ Mode validation flags discrepancies
9. ✅ CLI command `npm run figma:extract` works with all arguments
10. ✅ All requirements have passing tests
11. ✅ Documentation is complete and accurate

---

## Out of Scope

The following are explicitly out of scope for this spec:

1. **Token push** (Code → Figma) — Covered in Spec 054a
2. **Automatic spec generation** (design-outline → requirements.md) — Human review required
3. **Bidirectional sync** (Figma → Code) — Explicitly rejected in design outline
4. **Design validation** (verify design quality) — Human review responsibility
5. **Component implementation** (generate code from design) — Separate workflow
6. **Multi-component extraction** (extract multiple components at once) — Future enhancement

---

**Organization**: spec-guide
**Scope**: 054b-figma-design-extract
