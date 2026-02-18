# Requirements Document: Figma Design Extraction

**Date**: February 18, 2026
**Spec**: 054b - Figma Design Extraction
**Status**: Requirements Phase
**Dependencies**: Spec 053 (DTCG Token Format Generator), Spec 054 Design Outline (shared architectural context), Spec 054a (Figma Token Push)

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

---

## Requirements

### Requirement 1: DesignExtractor Implementation

**User Story:**
As a DesignerPunk maintainer, I need an extractor that reads Figma designs and generates design-outline.md, so that validated designs can enter the spec process.

**Acceptance Criteria:**
- DesignExtractor reads Figma component structure via Console MCP
- Extractor queries Component-Family docs via MCP for context
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
- TokenTranslator matches Figma values to DesignerPunk tokens
- Translator prioritizes semantic tokens over primitives
- Translator provides exact match, approximate match, or no-match results
- Translator includes tolerance rules (±2px spacing, ΔE < 3 color, ±1px font size/radius)
- Translator enriches responses with both primitive and semantic token references
- Translator flags no-match values and pauses for human decision

**Testable Conditions:**
- GIVEN Figma value 24px WHEN translated THEN returns `space.300` (exact match)
- GIVEN Figma value 25px WHEN translated THEN returns `space.300` (approximate match, ±2px tolerance)
- GIVEN Figma value 30px WHEN translated THEN returns no-match and pauses
- GIVEN Figma color #B026FF WHEN translated THEN returns `color.primary` (semantic) and `purple.300` (primitive)

---

### Requirement 3: Composite Token Reconstruction

**User Story:**
As a designer, I need composite tokens (shadow, typography) recognized from Figma styles, so that extraction identifies which composite tokens my design uses.

**Acceptance Criteria:**
- Extractor reads Figma effect styles (shadows) via `figma_get_styles`
- Extractor reads Figma text styles (typography) via `figma_get_styles`
- Extractor matches style names to DesignerPunk composite tokens
- Extractor reconstructs from raw properties if no style match
- Extractor flags decomposed composites for Ada's review

**Testable Conditions:**
- GIVEN Figma effect style `shadow.elevation200` WHEN extracted THEN returns composite token `shadow.elevation200`
- GIVEN Figma text style `typography.heading200` WHEN extracted THEN returns composite token `typography.heading200`
- GIVEN raw shadow properties (no style) WHEN extracted THEN attempts reconstruction from properties
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

### Requirement 8: Component Token Decision Points

**User Story:**
As a DesignerPunk maintainer, I need component token decision points surfaced during extraction, so that Ada can validate token governance during design-outline review.

**Acceptance Criteria:**
- Extractor detects when primitive tokens are used repeatedly
- Extractor surfaces component token decision points (use primitive vs create component token)
- Extractor defers decision to design-outline review with Ada
- Extractor provides rationale for component token consideration

**Testable Conditions:**
- GIVEN primitive token `space.300` used for button padding WHEN extracted THEN surfaces decision point: "Consider component token `button.padding.medium = space.300`"
- GIVEN component token decision point WHEN flagged THEN includes rationale and defers to Ada review

---

### Requirement 9: Mode Validation

**User Story:**
As a DesignerPunk maintainer, I need mode discrepancies flagged, so that light/dark mode values are validated.

**Acceptance Criteria:**
- Extractor checks if light and dark mode values are identical
- Extractor flags discrepancies when modes differ
- Extractor pauses for human review when discrepancies found

**Testable Conditions:**
- GIVEN light mode value 24px and dark mode value 24px WHEN extracted THEN no flag
- GIVEN light mode value 24px and dark mode value 25px WHEN extracted THEN flags discrepancy and pauses

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

**Testable Conditions:**
- GIVEN CLI command `npm run figma:extract -- --file <key> --node <id>` WHEN executed THEN extraction runs
- GIVEN extraction success WHEN command completes THEN exit code is 0
- GIVEN extraction failure WHEN command completes THEN exit code is non-zero
- GIVEN no-match values WHEN extraction pauses THEN reports pause reason and exits with error

---

## Documentation Requirements

### User-Facing Documentation

1. **Figma Integration Guide** (update existing `docs/dtcg-integration-guide.md`)
   - Add section on design extraction workflow
   - Document CLI commands (`figma:extract`, arguments)
   - Document confidence flags and what they mean
   - Document design-outline review process

2. **Designer Workflow Guide** (new `docs/figma-designer-workflow.md`)
   - How to use pushed tokens in Figma
   - How to mark designs as "ready for spec"
   - What extraction looks for
   - How to interpret extraction results

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
