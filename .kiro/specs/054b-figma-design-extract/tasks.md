# Implementation Plan: Figma Design Extraction

**Date**: February 18, 2026
**Spec**: 054b - Figma Design Extraction
**Status**: Implementation Planning
**Dependencies**: Spec 053 (DTCG Token Format Generator), Spec 054 Design Outline (shared architectural context), Spec 054a (Figma Token Push)

---

## Implementation Plan

This spec implements the design extraction workflow in four phases:

1. **Phase 1: TokenTranslator** — Translate Figma values to DesignerPunk tokens
2. **Phase 2: VariantAnalyzer** — Analyze variants with context-aware recommendations
3. **Phase 3: DesignExtractor** — Read Figma designs and generate design-outline.md
4. **Phase 4: CLI and Documentation** — User-facing command and guides

**Estimated Timeline:** 3-4 weeks

---

## Task List

### Task 1: TokenTranslator Implementation (Parent)

**Type**: Architecture (Parent)
**Validation**: Tier 3 - Comprehensive
**Success Criteria:**
- TokenTranslator matches Figma values to DesignerPunk tokens
- Tolerance rules are applied correctly
- Semantic tokens are prioritized over primitives
- No-match values trigger pause behavior

**Subtasks:**

- [ ] 1.1 Create TokenTranslator class structure
  **Type**: Setup
  **Validation**: Tier 1 - Minimal
  - Create `src/figma/TokenTranslator.ts`
  - Define TranslationResult interface
  - Add constructor (dtcgTokens parameter)
  - Export from figma index
  - _Requirements: Req 2_

- [ ] 1.2 Implement exact match logic
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `findExactMatch()` method
  - Search DTCG tokens for exact value match
  - Return token name if found
  - Handle different token categories (spacing, color, typography, radius, shadow)
  - _Requirements: Req 2_

- [ ] 1.3 Implement approximate match logic
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `findApproximateMatch()` method
  - Apply tolerance rules (±2px spacing, ΔE < 3 color, ±1px font size/radius)
  - Calculate delta between Figma value and token value
  - Return closest match within tolerance
  - _Requirements: Req 2_

- [ ] 1.4 Implement semantic token priority
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `enrichResponse()` method
  - Check if matched token is primitive or semantic
  - If primitive, check if semantic token aliases it
  - Return both primitive and semantic references
  - _Requirements: Req 2_

- [ ] 1.5 Implement main translate method
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `translate()` method
  - Call `findExactMatch()` first
  - If no exact match, call `findApproximateMatch()`
  - If no approximate match, return no-match result
  - Call `enrichResponse()` to add semantic references
  - _Requirements: Req 2_

- [ ] 1.6 Write translator tests
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Test exact match (24px → space.300)
  - Test approximate match (25px → space.300, ±2px tolerance)
  - Test no-match (30px → no match)
  - Test semantic priority (#B026FF → color.primary + purple.300)
  - Test tolerance rules for all categories
  - _Requirements: Req 2_

---

### Task 2: VariantAnalyzer Implementation (Parent)

**Type**: Architecture (Parent)
**Validation**: Tier 3 - Comprehensive
**Success Criteria:**
- VariantAnalyzer provides context-aware recommendations
- Component-Family docs are queried correctly
- Component-Readiness-Status is queried correctly
- Behavioral analysis distinguishes styling vs behavioral differences
- Conflicts are detected and flagged

**Subtasks:**

- [ ] 2.1 Create VariantAnalyzer class structure
  **Type**: Setup
  **Validation**: Tier 1 - Minimal
  - Create `src/figma/VariantAnalyzer.ts`
  - Define VariantMapping, MappingRecommendation, MappingConflict interfaces
  - Add constructor (mcp parameter)
  - Export from figma index
  - _Requirements: Req 4_

- [ ] 2.2 Implement Component-Family doc query
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `queryFamilyPattern()` method
  - Query Component-Family doc via MCP (`get_document_full`)
  - Extract inheritance pattern, behavioral contracts, token usage patterns
  - Handle missing doc (return null, flag for recommendation)
  - _Requirements: Req 4_

- [ ] 2.3 Implement Component-Readiness-Status query
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `queryExistingComponents()` method
  - Query Component-Readiness-Status via MCP (`get_section`)
  - Parse Individual Component Status section
  - Check if components exist (e.g., ButtonBase)
  - Return component status and implementation paths
  - _Requirements: Req 4_

- [ ] 2.4 Implement behavioral analysis
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `analyzeBehavioralDifferences()` method
  - Check if variants have different interaction patterns
  - Check if variants differ only in visual properties
  - Return 'behavioral' or 'styling' classification
  - _Requirements: Req 4_

- [ ] 2.5 Implement recommendation generation
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `generateRecommendations()` method
  - Generate Option A (single component) with rationale
  - Generate Option B (primitive + semantic) with rationale
  - Mark recommended option based on family pattern and behavioral analysis
  - Include alignsWith and tradeoffs for each option
  - _Requirements: Req 4_

- [ ] 2.6 Implement conflict detection
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `detectConflicts()` method
  - Compare family pattern recommendation with behavioral analysis
  - Flag conflicts when recommendations differ
  - Generate conflict explanation
  - _Requirements: Req 4_

- [ ] 2.7 Implement main analyzeVariants method
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `analyzeVariants()` method
  - Call `queryFamilyPattern()` and `queryExistingComponents()`
  - Call `analyzeBehavioralDifferences()`
  - Call `generateRecommendations()`
  - Call `detectConflicts()`
  - Return VariantMapping with all analysis results
  - _Requirements: Req 4_

- [ ] 2.8 Write analyzer tests
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Test Component-Family doc query (exists and missing)
  - Test Component-Readiness-Status query
  - Test behavioral analysis (behavioral vs styling)
  - Test recommendation generation
  - Test conflict detection
  - _Requirements: Req 4_

---

### Task 3: DesignExtractor Implementation (Parent)

**Type**: Architecture (Parent)
**Validation**: Tier 3 - Comprehensive
**Success Criteria:**
- DesignExtractor reads Figma designs correctly
- All required sections are generated in design-outline.md
- Confidence flags are applied correctly
- Behavioral contracts are detected and flagged
- Platform parity is detected and flagged
- Component token decision points are surfaced

**Subtasks:**

- [ ] 3.1 Create DesignExtractor class structure
  **Type**: Setup
  **Validation**: Tier 1 - Minimal
  - Create `src/figma/DesignExtractor.ts`
  - Define DesignOutline, ComponentStructure, BehavioralContractStatus, PlatformParityCheck interfaces
  - Add constructor (consoleMcp, translator, analyzer parameters)
  - Export from figma index
  - _Requirements: Req 1_

- [ ] 3.2 Implement Figma component reading
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `readFigmaComponent()` method
  - Use Console MCP `figma_get_component` to read component structure
  - Extract variants, states, properties
  - Handle errors (component not found, invalid node ID)
  - _Requirements: Req 1_

- [ ] 3.3 Implement context querying
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `queryContext()` method
  - Determine component family from name (e.g., "Button" → "Button")
  - Query Component-Family doc via VariantAnalyzer
  - Query Component-Readiness-Status via VariantAnalyzer
  - Return ExtractionContext with family pattern and existing components
  - _Requirements: Req 1, Req 4_

- [ ] 3.4 Implement token translation
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `translateTokens()` method
  - Extract spacing, color, typography, radius, shadow values from Figma component
  - Call TokenTranslator for each value
  - Aggregate results into TokenUsage structure
  - Handle no-match values (pause and report)
  - _Requirements: Req 2_

- [ ] 3.5 Implement composite token reconstruction
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `reconstructCompositeTokens()` method
  - Read Figma styles via `figma_get_styles`
  - Match style names to DesignerPunk composite tokens
  - Reconstruct from raw properties if no style match
  - Flag decomposed composites for Ada's review
  - _Requirements: Req 3_

- [ ] 3.6 Implement behavioral contract detection
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `detectBehavioralContracts()` method
  - Classify component as interactive or static
  - Extract visual states from Figma (hover, focus, disabled)
  - Flag missing behavioral contracts for interactive components
  - Auto-generate "no interaction" for static components
  - _Requirements: Req 6_

- [ ] 3.7 Implement platform parity detection
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `detectPlatformParity()` method
  - Apply heuristics (hover = web-only, focus = all platforms)
  - Query platform-implementation-guidelines.md for validation
  - Flag platform-specific interactions with recommendations
  - _Requirements: Req 7_

- [ ] 3.8 Implement component token decision points
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `detectComponentTokenDecisions()` method
  - Identify repeated primitive token usage
  - Surface decision points (use primitive vs create component token)
  - Provide rationale for component token consideration
  - Defer decision to Ada review
  - _Requirements: Req 8_

- [ ] 3.9 Implement mode validation
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `validateModes()` method
  - Check if light and dark mode values are identical
  - Flag discrepancies when modes differ
  - Pause for human review when discrepancies found
  - _Requirements: Req 9_

- [ ] 3.10 Implement design-outline generation
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `generateDesignOutlineMarkdown()` method
  - Generate all required sections (Component Purpose, Variants, States, Token Usage, etc.)
  - Apply confidence flags (✅ ⚠️ ❌)
  - Include context-aware recommendations from VariantAnalyzer
  - Include behavioral contract status
  - Include platform parity check
  - Include component token decision points
  - _Requirements: Req 5_

- [ ] 3.11 Implement main extractDesign method
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Implement `extractDesign()` method
  - Call `readFigmaComponent()`
  - Call `queryContext()`
  - Call `translateTokens()`
  - Call `reconstructCompositeTokens()`
  - Call `detectBehavioralContracts()`
  - Call `detectPlatformParity()`
  - Call `detectComponentTokenDecisions()`
  - Call `validateModes()`
  - Return DesignOutline with all extracted data
  - _Requirements: All_

- [ ] 3.12 Write extractor tests
  **Type**: Implementation
  **Validation**: Tier 2 - Standard
  - Test Figma component reading
  - Test context querying
  - Test token translation
  - Test composite token reconstruction
  - Test behavioral contract detection
  - Test platform parity detection
  - Test component token decision points
  - Test mode validation
  - Test design-outline generation
  - _Requirements: All_

---

### Task 4: CLI Command Implementation

**Type**: Implementation
**Validation**: Tier 2 - Standard

- [ ] 4.1 Create CLI command
  - Create `src/cli/figma-extract.ts`
  - Parse command-line arguments (--file, --node, --output)
  - Load DTCG tokens from `dist/DesignTokens.dtcg.json`
  - Initialize DesignExtractor, TokenTranslator, VariantAnalyzer
  - Run extraction
  - Write design-outline.md to output path
  - Report results (confidence flags, warnings, errors)
  - Exit with appropriate code (0 on success, 1 on failure or pause)
  - _Requirements: Req 10_

- [ ] 4.2 Add npm script
  - Add `figma:extract` script to package.json
  - Configure script to run CLI command
  - Test script execution
  - _Requirements: Req 10_

- [ ] 4.3 Write CLI tests
  - Test normal extraction
  - Test missing arguments (--file, --node)
  - Test no-match pause behavior
  - Test error reporting
  - Test exit codes
  - _Requirements: Req 10_

---

### Task 5: Error Handling Implementation

**Type**: Implementation
**Validation**: Tier 2 - Standard

- [ ] 5.1 Implement no-match pause behavior
  - Detect no-match token values
  - Format error report (property, Figma value, closest match, delta)
  - Provide options (map to suggested, document as off-system, request new token)
  - Pause extraction and exit with error code
  - _Requirements: Req 2_

- [ ] 5.2 Implement missing Component-Family doc handling
  - Detect missing Component-Family doc
  - Format recommendation (create doc, use template)
  - Allow ad-hoc decision with rationale documentation
  - _Requirements: Req 4_

- [ ] 5.3 Implement conflicting recommendations handling
  - Detect conflicts between family pattern and behavioral analysis
  - Format conflict report (both recommendations, explanation)
  - Defer to human decision
  - _Requirements: Req 4_

---

### Task 6: Documentation

**Type**: Documentation
**Validation**: Tier 2 - Standard

- [ ] 6.1 Update DTCG Integration Guide
  - Add "Design Extraction Workflow" section to `docs/dtcg-integration-guide.md`
  - Document CLI commands (`figma:extract`, arguments)
  - Document confidence flags and what they mean
  - Document design-outline review process
  - _Requirements: Req 1_

- [ ] 6.2 Create Designer Workflow Guide
  - Create `docs/figma-designer-workflow.md`
  - Document how to use pushed tokens in Figma
  - Document how to mark designs as "ready for spec"
  - Document what extraction looks for
  - Document how to interpret extraction results
  - _Requirements: Req 1_

- [ ] 6.3 Create completion documentation
  - Create task completion docs in `.kiro/specs/054b-figma-design-extract/completion/`
  - Document implementation approach
  - Document key decisions
  - Document integration points
  - _Requirements: All_

---

## Validation Strategy

### Tier 1: Minimal (Setup Tasks)

**Tasks:** 1.1, 2.1, 3.1

**Validation:**
- Syntax validation (TypeScript compiles)
- Artifact verification (files exist)
- Basic structure validation (exports correct)

---

### Tier 2: Standard (Implementation Tasks)

**Tasks:** 1.2, 1.3, 1.4, 1.5, 1.6, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11, 3.12, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3

**Validation:**
- Syntax validation (TypeScript compiles)
- Functional validation (unit tests pass)
- Integration validation (MCP queries work)
- Requirements compliance (acceptance criteria met)

---

### Tier 3: Comprehensive (Architecture & Parent Tasks)

**Tasks:** 1 (parent), 2 (parent), 3 (parent)

**Validation:**
- All Tier 2 validations
- Design validation (extensibility, maintainability)
- System integration (end-to-end workflow works)
- Edge cases (no-match values, missing docs, conflicts)
- Success criteria verification (all subtasks integrate correctly)

---

## Testing Checklist

### Unit Tests

- [ ] TokenTranslator matches exact values
- [ ] TokenTranslator matches approximate values (within tolerance)
- [ ] TokenTranslator returns no-match for out-of-tolerance values
- [ ] TokenTranslator prioritizes semantic over primitive
- [ ] VariantAnalyzer queries Component-Family docs
- [ ] VariantAnalyzer queries Component-Readiness-Status
- [ ] VariantAnalyzer distinguishes behavioral vs styling differences
- [ ] VariantAnalyzer generates recommendations
- [ ] VariantAnalyzer detects conflicts
- [ ] DesignExtractor reads Figma components
- [ ] DesignExtractor translates tokens
- [ ] DesignExtractor reconstructs composite tokens
- [ ] DesignExtractor detects behavioral contracts
- [ ] DesignExtractor detects platform parity
- [ ] DesignExtractor surfaces component token decisions
- [ ] DesignExtractor validates modes
- [ ] DesignExtractor generates design-outline.md

### Integration Tests

- [ ] End-to-end extraction from test Figma file
- [ ] Design-outline.md generated with all required sections
- [ ] Confidence flags applied correctly
- [ ] No-match values trigger pause
- [ ] Missing Component-Family doc flagged
- [ ] Conflicting recommendations flagged
- [ ] MCP queries work correctly

---

## Post-Completion Steps

1. **Run tests**: `npm test` (verify all tests pass)
2. **Test CLI**: `npm run figma:extract -- --file <key> --node <id> --output ./test-outline.md` (verify output)
3. **Review design-outline**: Verify all sections present, confidence flags correct
4. **Commit changes**: `./.kiro/hooks/commit-task.sh "Figma Design Extraction"`
5. **Create summary**: `docs/specs/054b-figma-design-extract/task-1-summary.md` (parent task only)
6. **Trigger release detection**: Summary doc creation triggers automatic detection

---

## Dependencies

- **Spec 053**: DTCG Token Format Generator must be complete
- **Spec 054a**: Figma Token Push must be complete (tokens in Figma)
- **Console MCP**: NPX mode + Desktop Bridge must be configured
- **Figma Access Token**: Personal access token must be configured
- **Component-Readiness-Status**: Individual Component Status section must exist

---

## Related Documentation

- [Requirements](./requirements.md) — What this spec must accomplish
- [Design](./design.md) — How this spec is implemented
- [Design Outline](../../054-figma-console-mcp-integration/design-outline.md) — Shared architectural context
- [Spec 054a Tasks](../../054a-figma-token-push/tasks.md) — Token push implementation
- [Process-Task-Type-Definitions](.kiro/steering/Process-Task-Type-Definitions.md) — Task type classification guidance

---

**Organization**: spec-guide
**Scope**: 054b-figma-design-extract
