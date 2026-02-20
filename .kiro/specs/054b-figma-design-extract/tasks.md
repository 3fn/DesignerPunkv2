# Implementation Plan: Figma Design Extraction

**Date**: February 18, 2026
**Updated**: February 19, 2026 (Thurgood spec review — Task 6 updated for Req 11)
**Spec**: 054b - Figma Design Extraction
**Status**: Implementation Planning (Realigned post-054a/054c)
**Dependencies**: Spec 053 (DTCG Token Format Generator), Spec 054 Design Outline (shared architectural context), Spec 054a (Figma Token Push), Spec 054c (Figma Token Push Fixes)

---

## Implementation Plan

This spec implements the design extraction workflow in four phases:

1. **Phase 1: TokenTranslator** — Translate Figma values to DesignerPunk tokens (variable-binding-first)
2. **Phase 2: VariantAnalyzer** — Analyze variants with context-aware recommendations
3. **Phase 3: DesignExtractor** — Read Figma designs via dual-MCP strategy and generate design-outline.md
4. **Phase 4: CLI and Documentation** — User-facing command and guides

**Key Realignment Changes (post-054a/054c):**
- TokenTranslator uses binding-first approach (Figma variable name → token path) with value-based fallback
- DesignExtractor uses dual-MCP strategy: Kiro Figma Power for design structure, figma-console-mcp for variables/styles
- ConsoleMCPClient extended with `getStyles()` method (builds on verified post-054c interface)
- CLI includes port cleanup and `disconnect()` in finally block (lessons from 054c)
- Composite token reconstruction simplified: direct name matching as primary path

**Estimated Timeline:** 3-4 weeks

---

## Task List

- [x] Task 1: TokenTranslator Implementation (Parent)

  **Type**: Architecture (Parent)
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - TokenTranslator matches Figma values to DesignerPunk tokens using binding-first approach
  - `translateByBinding()` converts Figma variable names (slash → dot notation) to DTCG token paths
  - `translateByValue()` applies tolerance rules as fallback for unbound values
  - `translate()` composite method tries binding first, then value fallback
  - Semantic tokens are prioritized over primitives in enrichment
  - TranslationResult includes `matchMethod: 'binding' | 'value'`
  - No-match values trigger pause behavior

  **Primary Artifacts:**
  - `src/figma/TokenTranslator.ts`
  - `src/figma/__tests__/TokenTranslator.test.ts`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/054b-figma-design-extract/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/054b-figma-design-extract/task-1-summary.md` (triggers release detection)

  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: TokenTranslator Implementation"`
  - Verify: Check GitHub for committed changes


  - [x] 1.1 Create TokenTranslator class structure and interfaces
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/figma/TokenTranslator.ts`
    - Define `TranslationResult` interface with fields: `token`, `confidence` ('exact' | 'approximate' | 'no-match'), `matchMethod` ('binding' | 'value'), `rawValue`, `primitive?`, `semantic?`, `suggestion?`, `delta?`
    - Define `DTCGTokenFile` type for constructor parameter (or import from existing DTCG types)
    - Add constructor accepting `dtcgTokens` parameter
    - Implement `figmaNameToTokenPath()` utility: converts slash notation (`space/100`) to dot notation (`space.100`)
    - Export from figma index
    - _Requirements: Req 2_

  - [x] 1.2 Implement binding-first translation (`translateByBinding`)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `translateByBinding(figmaVariableName: string): TranslationResult`
    - Convert Figma variable name to DTCG token path via `figmaNameToTokenPath()`
    - Look up token path in DTCG token tree
    - Return exact match with `matchMethod: 'binding'` if found
    - Return no-match if token path not found in DTCG tokens
    - _Requirements: Req 2_

  - [x] 1.3 Implement value-based translation (`translateByValue`)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `translateByValue(value: number | string, category: 'spacing' | 'color' | 'typography' | 'radius' | 'shadow'): TranslationResult`
    - Implement exact value matching: search DTCG tokens for exact value match
    - Implement approximate matching with tolerance rules:
      - Spacing: ±2px
      - Color: ΔE < 3 (CIELAB color difference)
      - Font size: ±1px
      - Radius: ±1px
    - Return closest match within tolerance with `matchMethod: 'value'`
    - Include `delta` in result for approximate matches
    - Handle color format conversion: hex → rgba lookup (reverse of `FigmaTransformer.rgbaToHex()`)
    - _Requirements: Req 2_

  - [x] 1.4 Implement semantic token enrichment
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `enrichResponse(result: TranslationResult): TranslationResult`
    - Check if matched token is primitive or semantic
    - If primitive, search DTCG tokens for semantic tokens that alias it
    - If semantic, resolve the underlying primitive reference
    - Populate both `primitive` and `semantic` fields in result
    - Prioritize semantic token in the primary `token` field
    - _Requirements: Req 2_

  - [x] 1.5 Implement composite translate method
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `translate(figmaVariableName: string | undefined, rawValue: number | string, category: 'spacing' | 'color' | 'typography' | 'radius' | 'shadow'): TranslationResult`
    - If `figmaVariableName` provided, call `translateByBinding()` first
    - If binding returns exact match, call `enrichResponse()` and return
    - Otherwise fall back to `translateByValue()` with raw value
    - Call `enrichResponse()` on result
    - If no match found, return no-match result with `suggestion` (closest token if any)
    - _Requirements: Req 2_

  - [x] 1.6 Write TokenTranslator tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/figma/__tests__/TokenTranslator.test.ts`
    - Test `figmaNameToTokenPath()`: `space/100` → `space.100`, `color/purple/300` → `color.purple.300`
    - Test binding match: Figma variable `space/300` → `space.300` (exact, binding)
    - Test value exact match: 24px → `space.300` (exact, value)
    - Test value approximate match: 25px → `space.300` (approximate, ±2px, value)
    - Test no-match: 30px → no-match with suggestion
    - Test semantic enrichment: `color/purple/300` → returns both `color.purple.300` (primitive) and `color.primary` (semantic)
    - Test composite translate: binding-first with value fallback
    - Test color format handling: hex input matched against rgba DTCG values
    - _Requirements: Req 2_

---

- [x] Task 2: VariantAnalyzer Implementation (Parent)

  **Type**: Architecture (Parent)
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - VariantAnalyzer provides context-aware recommendations
  - Component-Family docs are queried via DesignerPunk MCP (`get_document_full`)
  - Component-Readiness-Status is queried via DesignerPunk MCP (`get_section`)
  - Behavioral analysis distinguishes styling vs behavioral differences
  - Conflicts between family pattern and behavioral analysis are detected and flagged

  **Primary Artifacts:**
  - `src/figma/VariantAnalyzer.ts`
  - `src/figma/__tests__/VariantAnalyzer.test.ts`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/054b-figma-design-extract/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/054b-figma-design-extract/task-2-summary.md` (triggers release detection)

  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: VariantAnalyzer Implementation"`
  - Verify: Check GitHub for committed changes


  - [x] 2.1 Create VariantAnalyzer class structure
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/figma/VariantAnalyzer.ts`
    - Define `VariantMapping`, `MappingRecommendation`, `MappingConflict` interfaces
    - Define `ExtractionContext` interface (family pattern, existing components)
    - Add constructor accepting MCP client parameter for DesignerPunk doc queries
    - Export from figma index
    - _Requirements: Req 4_
    - ⚠️ **Agent Note (Feb 19, 2026)**: A previous agent created `src/figma/VariantAnalyzer.ts` and exported it from `src/figma/index.ts` during a context transfer mix-up. The file exists but has not been independently verified. Before marking this task complete, verify that the interfaces and class structure match the design doc's VariantAnalyzer section (design.md → "VariantAnalyzer (Unchanged)"). Refactor if needed, then proceed with completion documentation.

  - [x] 2.2 Implement Component-Family doc query
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `queryFamilyPattern(familyName: string): Promise<FamilyPattern | null>`
    - Query Component-Family doc via DesignerPunk MCP (`get_document_full` with path `.kiro/steering/Component-Family-${familyName}.md`)
    - Extract inheritance pattern, behavioral contracts, token usage patterns from doc content
    - Handle missing doc gracefully: return null, flag for recommendation to create doc
    - _Requirements: Req 4_

  - [x] 2.3 Implement Component-Readiness-Status query
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `queryExistingComponents(familyName: string): Promise<ComponentStatus[]>`
    - Query Component-Readiness-Status via DesignerPunk MCP (`get_section` with heading 'Individual Component Status')
    - Parse section to find components matching family (e.g., ButtonBase, ButtonCTA)
    - Return component status and implementation paths
    - _Requirements: Req 4_

  - [x] 2.4 Implement behavioral analysis
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `analyzeBehavioralDifferences(variants: FigmaVariant[]): 'behavioral' | 'styling'`
    - Check if variants have different interaction patterns (e.g., one has onClick, another doesn't)
    - Check if variants differ only in visual properties (colors, sizes, spacing)
    - Return classification: 'behavioral' (different interactions) or 'styling' (visual only)
    - _Requirements: Req 4_

  - [x] 2.5 Implement recommendation generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `generateRecommendations(familyPattern: FamilyPattern | null, behavioralAnalysis: string, existingComponents: ComponentStatus[]): MappingRecommendation[]`
    - Generate Option A (single component with variant prop) with rationale
    - Generate Option B (primitive + semantic structure) with rationale
    - Mark recommended option based on family pattern alignment and behavioral analysis
    - Include `alignsWith` and `tradeoffs` for each option
    - _Requirements: Req 4_

  - [x] 2.6 Implement conflict detection
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `detectConflicts(familyRecommendation: string, behavioralRecommendation: string): MappingConflict[]`
    - Compare family pattern recommendation with behavioral analysis recommendation
    - Flag conflicts when recommendations differ (e.g., family says single component but behavior says split)
    - Generate conflict explanation with both perspectives
    - _Requirements: Req 4_

  - [x] 2.7 Implement main analyzeVariants method
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `analyzeVariants(component: FigmaComponent, context: ExtractionContext): Promise<VariantMapping>`
    - Call `queryFamilyPattern()` and `queryExistingComponents()`
    - Call `analyzeBehavioralDifferences()` on component variants
    - Call `generateRecommendations()` with all analysis results
    - Call `detectConflicts()` to check for disagreements
    - Return `VariantMapping` with all analysis results, recommendations, and conflicts
    - _Requirements: Req 4_

  - [x] 2.8 Write VariantAnalyzer tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/figma/__tests__/VariantAnalyzer.test.ts`
    - Test Component-Family doc query (doc exists → returns pattern; doc missing → returns null)
    - Test Component-Readiness-Status query (components found → returns status)
    - Test behavioral analysis: variants with different interactions → 'behavioral'
    - Test behavioral analysis: variants with only visual differences → 'styling'
    - Test recommendation generation with and without family pattern
    - Test conflict detection when family and behavioral analysis disagree
    - Mock DesignerPunk MCP responses for all tests
    - _Requirements: Req 4_

---

- [x] Task 3: DesignExtractor Implementation (Parent)

  **Type**: Architecture (Parent)
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - DesignExtractor reads Figma designs via dual-MCP strategy (Kiro Power + figma-console-mcp)
  - All required design-outline.md sections are generated with confidence flags
  - Behavioral contracts are detected and flagged for interactive components
  - Platform parity is detected and flagged
  - Component token decision points are surfaced for Ada review
  - Mode validation flags light/dark discrepancies

  **Primary Artifacts:**
  - `src/figma/DesignExtractor.ts`
  - `src/figma/__tests__/DesignExtractor.test.ts`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/054b-figma-design-extract/completion/task-3-parent-completion.md`
  - Summary: `docs/specs/054b-figma-design-extract/task-3-summary.md` (triggers release detection)

  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 3 Complete: DesignExtractor Implementation"`
  - Verify: Check GitHub for committed changes


  - [x] 3.1 Create DesignExtractor class structure and extend ConsoleMCPClient
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/figma/DesignExtractor.ts`
    - Define interfaces: `DesignOutline`, `FigmaComponent`, `FigmaStyle`, `TokenBinding`, `BehavioralContractStatus`, `PlatformParityCheck`, `ComponentTokenDecision`, `ConfidenceReport`
    - Add constructor accepting `consoleMcp: ConsoleMCPClient`, `translator: TokenTranslator`, `analyzer: VariantAnalyzer`
    - Add `getStyles(fileKey: string): Promise<FigmaStyle[]>` method to `ConsoleMCPClient` interface (calls `figma_get_styles`)
    - Add `getStyles()` implementation to `ConsoleMCPClientImpl` (calls `this.callTool('figma_get_styles', { fileKey })`)
    - Export from figma index
    - _Requirements: Req 1_

  - [x] 3.2 Implement Figma component reading (dual-MCP)
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `readFigmaComponent(fileKey: string, nodeId: string): Promise<FigmaComponent>`
    - Primary: Use Kiro Figma Power `get_design_context` for rich component structure (layout, properties, visual states)
    - Fallback: Use `get_metadata` + figma-console-mcp `figma_get_component` if `get_design_context` lacks detail
    - Extract: component name, description, variants, states, properties, layout structure
    - Handle errors: component not found, invalid node ID, MCP server unavailable
    - _Requirements: Req 1_

  - [x] 3.3 Implement token binding reading
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `readTokenBindings(fileKey: string): Promise<TokenBinding[]>`
    - Use figma-console-mcp via `consoleMcp.getVariables(fileKey)` (calls `figma_get_token_values`)
    - Map results to `TokenBinding[]` with: `variableName`, `variableId`, `collectionName`, `resolvedType`, `valuesByMode`, `isAlias`, `aliasTarget`
    - Detect alias relationships (semantic → primitive) from collection membership
    - _Requirements: Req 1, Req 2_

  - [x] 3.4 Implement style reading
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `readStyles(fileKey: string): Promise<FigmaStyle[]>`
    - Use figma-console-mcp via `consoleMcp.getStyles(fileKey)` (calls `figma_get_styles`)
    - Map results to `FigmaStyle[]` with: `name`, `type` ('EFFECT' | 'TEXT'), `properties`
    - Separate effect styles (shadows) from text styles (typography)
    - _Requirements: Req 3_

  - [x] 3.5 Implement context querying
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `queryContext(componentName: string): Promise<ExtractionContext>`
    - Determine component family from name (e.g., "ButtonCTA" → "Button")
    - Delegate to VariantAnalyzer: `queryFamilyPattern()` and `queryExistingComponents()`
    - Return `ExtractionContext` with family pattern and existing component status
    - _Requirements: Req 1, Req 4_

  - [x] 3.6 Implement token translation orchestration
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `translateTokens(component: FigmaComponent, bindings: TokenBinding[]): TokenUsage`
    - Build binding lookup map: `variableName → TokenBinding`
    - For each property on the component (spacing, color, typography, radius, shadow):
      - Check if property has a variable binding → use `translator.translate(bindingName, rawValue, category)`
      - If no binding → use `translator.translate(undefined, rawValue, category)`
    - Aggregate results into `TokenUsage` structure (spacing[], colors[], typography[], radius[], shadows[])
    - Track no-match values for pause reporting
    - _Requirements: Req 2_

  - [x] 3.7 Implement composite token reconstruction
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `reconstructCompositeTokens(styles: FigmaStyle[], dtcgTokens: DTCGTokenFile): TokenReference[]`
    - Primary path: match style names directly to DTCG composite tokens (names match because 054a pushed them)
    - For effect styles: match `shadow.elevation200` → `shadow.elevation200` token
    - For text styles: match `typography.heading200` → `typography.heading200` token
    - Fallback path: if style name doesn't match, attempt property-by-property reconstruction
    - Flag unmatched composites for Ada's review with ⚠️ confidence
    - _Requirements: Req 3_

  - [x] 3.8 Implement behavioral contract detection
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `detectBehavioralContracts(component: FigmaComponent): BehavioralContractStatus`
    - Classify component as interactive or static using keyword heuristics (button, input, toggle → interactive; badge, divider, icon → static)
    - Extract visual states from Figma component (hover, focus, disabled, pressed)
    - For interactive components: flag missing behavioral contracts as ❌
    - For static components: auto-generate "no interaction" contract
    - _Requirements: Req 6_

  - [x] 3.9 Implement platform parity detection
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `detectPlatformParity(component: FigmaComponent): PlatformParityCheck`
    - Apply heuristics: hover = web-only, focus = all platforms, press/long-press = mobile
    - Query platform-implementation-guidelines.md via DesignerPunk MCP for validation
    - Flag platform-specific interactions with recommendations (e.g., "hover → map to press on mobile")
    - Provide decision options: omit on mobile, map to press, other
    - _Requirements: Req 7_

  - [x] 3.10 Implement component token decision points
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `detectComponentTokenDecisions(tokenUsage: TokenUsage): ComponentTokenDecision[]`
    - Identify repeated primitive token usage across component properties
    - Surface decision points: "Consider component token `button.padding.medium = space.300`"
    - Provide rationale for component token consideration
    - Defer all decisions to Ada review (no autonomous token creation per governance)
    - _Requirements: Req 8_

  - [x] 3.11 Implement mode validation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `validateModes(bindings: TokenBinding[]): ModeValidationResult`
    - For each token binding, check if light and dark mode values are identical
    - Flag discrepancies when modes differ (unexpected for spacing/radius, expected for colors)
    - Categorize: expected difference (color modes) vs unexpected difference (spacing modes)
    - Pause for human review when unexpected discrepancies found
    - _Requirements: Req 9_

  - [x] 3.12 Implement design-outline markdown generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `generateDesignOutlineMarkdown(outline: DesignOutline): string`
    - Generate all required sections: Component Purpose, Variants, States, Token Usage, Accessibility, Platform Behaviors, Edge Cases, Extraction Confidence, Inheritance Pattern, Behavioral Contracts, Platform Parity, Component Token Needs, Accessibility Contracts
    - Apply confidence flags: ✅ (exact binding match), ⚠️ (approximate/needs review), ❌ (no match/missing)
    - Include context-aware recommendations from VariantAnalyzer
    - Include behavioral contract status and platform parity check
    - Include component token decision points
    - _Requirements: Req 5_

  - [x] 3.13 Implement main extractDesign orchestration method
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Implement `extractDesign(figmaFileKey: string, componentNodeId: string): Promise<DesignOutline>`
    - Orchestrate all extraction steps in order:
      1. `readFigmaComponent()` — get component structure via Kiro Power
      2. `readTokenBindings()` — get variable bindings via console MCP
      3. `readStyles()` — get styles via console MCP
      4. `queryContext()` — get Component-Family and readiness context
      5. `translateTokens()` — translate all values using TokenTranslator
      6. `reconstructCompositeTokens()` — match composite styles
      7. `detectBehavioralContracts()` — classify interactive vs static
      8. `detectPlatformParity()` — flag platform-specific interactions
      9. `detectComponentTokenDecisions()` — surface token governance decisions
      10. `validateModes()` — check light/dark mode consistency
    - Assemble `DesignOutline` from all results
    - Calculate overall `extractionConfidence` from individual results
    - _Requirements: All_

  - [x] 3.14 Write DesignExtractor tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/figma/__tests__/DesignExtractor.test.ts`
    - Test `readFigmaComponent()` with mocked Kiro Power responses
    - Test `readTokenBindings()` with mocked console MCP responses
    - Test `readStyles()` with mocked console MCP responses
    - Test `translateTokens()` with binding and value paths
    - Test `reconstructCompositeTokens()` with name match and fallback
    - Test `detectBehavioralContracts()` for interactive and static components
    - Test `detectPlatformParity()` for web-only and cross-platform states
    - Test `detectComponentTokenDecisions()` for repeated primitive usage
    - Test `validateModes()` for matching and mismatching mode values
    - Test `generateDesignOutlineMarkdown()` for complete section generation
    - Test `extractDesign()` end-to-end with all mocks
    - Mock both Kiro Figma Power and figma-console-mcp responses
    - _Requirements: All_

---

- [x] Task 4: CLI Command and ConsoleMCPClient Extension (Parent)

  **Type**: Implementation (Parent)
  **Validation**: Tier 3 - Comprehensive

  **Success Criteria:**
  - CLI command `npm run figma:extract` works with all arguments
  - Port cleanup runs before connection (lesson from 054c ISSUE-4)
  - `consoleMcp.disconnect()` called in finally block (lesson from 054c)
  - Exit codes correct: 0 on success, 1 on failure or human-input-required

  **Primary Artifacts:**
  - `src/cli/figma-extract.ts`
  - `src/cli/__tests__/figma-extract.test.ts`

  **Completion Documentation:**
  - Detailed: `.kiro/specs/054b-figma-design-extract/completion/task-4-parent-completion.md`
  - Summary: `docs/specs/054b-figma-design-extract/task-4-summary.md` (triggers release detection)

  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 4 Complete: CLI Command and Documentation"`
  - Verify: Check GitHub for committed changes


  - [x] 4.1 Create CLI command
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/cli/figma-extract.ts`
    - Parse command-line arguments: `--file <file-key>`, `--node <node-id>`, `--output <path>`
    - Validate required arguments (--file and --node), exit with error if missing
    - Load DTCG tokens from `dist/DesignTokens.dtcg.json`
    - Run stale port cleanup via `cleanupStalePorts()` (from `src/figma/portCleanup.ts`, lesson from 054c ISSUE-4)
    - Initialize `ConsoleMCPClientImpl`, call `connect()`
    - Initialize `TokenTranslator`, `VariantAnalyzer`, `DesignExtractor`
    - Run `extractor.extractDesign(fileKey, nodeId)`
    - Generate markdown via `extractor.generateDesignOutlineMarkdown(outline)`
    - Write to output path (default `./design-outline.md`)
    - Report results: confidence flags summary, warnings, errors
    - Exit 0 on success, 1 on failure or human-input-required
    - Call `consoleMcp.disconnect()` in finally block
    - _Requirements: Req 10_

  - [x] 4.2 Add npm script
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Add `"figma:extract": "ts-node src/cli/figma-extract.ts"` to package.json scripts
    - Verify script runs with `npm run figma:extract -- --help` (or similar)
    - _Requirements: Req 10_

  - [x] 4.3 Write CLI tests
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/cli/__tests__/figma-extract.test.ts`
    - Test normal extraction: mock all dependencies, verify design-outline.md written
    - Test missing arguments: no --file → exit 1 with error message
    - Test missing arguments: no --node → exit 1 with error message
    - Test no-match pause behavior: extraction returns human-input-required → exit 1
    - Test error handling: MCP connection failure → exit 1 with error message
    - Test disconnect called in finally block (success and failure paths)
    - Test port cleanup called before connect
    - _Requirements: Req 10_

---

- [x] Task 5: Error Handling and Edge Cases

  **Type**: Implementation
  **Validation**: Tier 2 - Standard

  - [x] 5.1 Implement no-match pause behavior
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Detect no-match token values from TokenTranslator results
    - Format error report: property name, Figma value, closest match (if any), delta
    - Provide options: map to suggested token, document as off-system value, request new token creation
    - Set `extractionConfidence.requiresHumanInput = true` when no-match values exist
    - CLI exits with code 1 when human input required
    - _Requirements: Req 2_

  - [x] 5.2 Implement missing Component-Family doc handling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Detect when `queryFamilyPattern()` returns null (doc doesn't exist)
    - Format recommendation: "Component-Family-{name}.md not found. Recommend creating it before proceeding."
    - Include template reference for creating the doc
    - Allow extraction to continue with ⚠️ confidence on variant recommendations
    - _Requirements: Req 4_

  - [x] 5.3 Implement conflicting recommendations handling
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Detect conflicts from `VariantAnalyzer.detectConflicts()`
    - Format conflict report: both recommendations with rationale, explanation of disagreement
    - Flag in design-outline.md with ⚠️ and clear "Human Decision Required" label
    - Defer to human decision (do not auto-resolve)
    - _Requirements: Req 4_

---

- [x] Task 6: Documentation (Parent)

  **Type**: Documentation (Parent)
  **Validation**: Tier 2 - Standard

  **Success Criteria:**
  - Figma Workflow Guide created covering both push and extraction workflows
  - Figma-specific content migrated from DTCG Integration Guide
  - Design-to-spec-to-code workflow documented with scope clarity
  - Confidence flags and troubleshooting documented
  - All cross-references to related documentation included

  **Primary Artifacts:**
  - `docs/figma-workflow-guide.md`
  - `docs/dtcg-integration-guide.md` (updated)

  **Completion Documentation:**
  - Detailed: `.kiro/specs/054b-figma-design-extract/completion/task-6-parent-completion.md`
  - Summary: `docs/specs/054b-figma-design-extract/task-6-summary.md` (triggers release detection)

  **Post-Completion:**
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 6 Complete: Documentation"`
  - Verify: Check GitHub for committed changes

  - [x] 6.1 Create Figma Workflow Guide
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Create `docs/figma-workflow-guide.md` with complete structure per Requirement 11
    - Add Overview section: bidirectional integration, prerequisites
    - Add MCP Setup section: figma-console-mcp, Kiro Figma Power, Desktop Bridge, authentication
    - Add Token Push Workflow section: CLI usage, drift detection, troubleshooting (from 054a)
    - Add Design Extraction Workflow section: design-to-spec-to-code diagram, CLI usage, confidence flags, example design-outline.md
    - Add Troubleshooting section: MCP connection, Desktop Bridge, auth failures, no-match values, missing Component-Family docs
    - Add Related Documentation section: cross-references to DTCG guide, Token Governance, Component Development Guide, Spec Planning Standards
    - _Requirements: Req 11_

  - [x] 6.2 Migrate Figma-specific content from DTCG Integration Guide
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Review `docs/dtcg-integration-guide.md` for Figma-specific content
    - Move Figma CLI commands, MCP setup, authentication to Figma Workflow Guide
    - Keep tool-agnostic DTCG format documentation in DTCG Integration Guide
    - Add cross-reference from DTCG guide to Figma Workflow Guide
    - Verify no duplication between guides
    - _Requirements: Req 11_

  - [x] 6.3 Document design-to-spec-to-code workflow
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Add 5-phase workflow diagram to Design Extraction section
    - Mark Phase 2 as "THIS SPEC — 054b"
    - Mark Phases 3-5 as "out of scope"
    - Add scope note explaining this spec implements Phase 2 only
    - Document critical distinction: extraction surfaces information, humans make decisions
    - _Requirements: Req 11_

  - [x] 6.4 Document confidence flags and interpretation
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Document ✅ High Confidence: exact match via variable binding or style name
    - Document ⚠️ Needs Review: approximate value match or ambiguous
    - Document ❌ Requires Human Input: no match or missing info
    - Provide interpretation guidance for each flag
    - Include examples of when each flag appears
    - _Requirements: Req 11_

  - [x] 6.5 Create annotated example design-outline.md
    **Type**: Documentation
    **Validation**: Tier 2 - Standard
    - Create example design-outline.md showing all required sections
    - Annotate each section explaining its purpose
    - Show confidence flags in context
    - Include example of illustrative component token suggestion
    - Include example of mode validation categorization
    - Add to Figma Workflow Guide as reference
    - _Requirements: Req 11_

---

## Validation Strategy

### Tier 1: Minimal (Setup Tasks)

**Tasks:** 1.1, 2.1, 3.1, 4.2

**Validation:**
- Syntax validation (TypeScript compiles)
- Artifact verification (files exist, exports correct)
- Basic structure validation (interfaces defined, classes instantiable)

---

### Tier 2: Standard (Implementation Tasks)

**Tasks:** 1.2–1.6, 2.2–2.8, 3.2–3.14, 4.1, 4.3, 5.1–5.3, 6.1–6.5

**Validation:**
- Syntax validation (TypeScript compiles)
- Functional validation (unit tests pass)
- Integration validation (MCP queries work with mocks)
- Requirements compliance (acceptance criteria met)

---

### Tier 3: Comprehensive (Parent Tasks)

**Tasks:** 1 (parent), 2 (parent), 3 (parent), 4 (parent)

**Validation:**
- All Tier 2 validations
- Design validation (extensibility, maintainability)
- System integration (end-to-end workflow works with mocked MCP)
- Edge cases (no-match values, missing docs, conflicts, mode discrepancies)
- Success criteria verification (all subtasks integrate correctly)

---

## Testing Checklist

### Unit Tests

- [ ] TokenTranslator: `figmaNameToTokenPath()` converts slash to dot notation
- [ ] TokenTranslator: `translateByBinding()` matches by variable name
- [ ] TokenTranslator: `translateByValue()` matches exact values
- [ ] TokenTranslator: `translateByValue()` matches approximate values within tolerance
- [ ] TokenTranslator: `translateByValue()` returns no-match for out-of-tolerance values
- [ ] TokenTranslator: `enrichResponse()` adds semantic references to primitive matches
- [ ] TokenTranslator: `translate()` tries binding first, falls back to value
- [ ] VariantAnalyzer: queries Component-Family docs (exists and missing)
- [ ] VariantAnalyzer: queries Component-Readiness-Status
- [ ] VariantAnalyzer: distinguishes behavioral vs styling differences
- [ ] VariantAnalyzer: generates recommendations with rationale
- [ ] VariantAnalyzer: detects conflicts between family and behavioral analysis
- [ ] DesignExtractor: reads component via Kiro Figma Power
- [ ] DesignExtractor: reads token bindings via console MCP
- [ ] DesignExtractor: reads styles via console MCP
- [ ] DesignExtractor: translates tokens using binding-first approach
- [ ] DesignExtractor: reconstructs composite tokens by name match
- [ ] DesignExtractor: detects behavioral contracts (interactive vs static)
- [ ] DesignExtractor: detects platform parity (web-only vs cross-platform)
- [ ] DesignExtractor: surfaces component token decisions
- [ ] DesignExtractor: validates mode consistency
- [ ] DesignExtractor: generates complete design-outline.md with all sections
- [ ] CLI: parses arguments correctly
- [ ] CLI: runs port cleanup before connect
- [ ] CLI: calls disconnect in finally block
- [ ] CLI: exits with correct codes

### Integration Tests

- [ ] End-to-end extraction with mocked MCP servers
- [ ] Design-outline.md generated with all required sections
- [ ] Confidence flags applied correctly based on match method
- [ ] No-match values trigger human-input-required flag
- [ ] Missing Component-Family doc flagged with recommendation
- [ ] Conflicting recommendations flagged for human decision

---

## Dependencies

- **Spec 053**: DTCG Token Format Generator must be complete (provides `dist/DesignTokens.dtcg.json`)
- **Spec 054a**: Figma Token Push must be complete (tokens pushed to Figma with known variable names)
- **Spec 054c**: Figma Token Push Fixes must be complete (ConsoleMCPClient interface verified, aliases working)
- **Kiro Figma Power**: Must be installed and configured (provides `get_design_context`, `get_metadata`, `get_variable_defs`)
- **figma-console-mcp**: NPX mode + Desktop Bridge must be configured (provides `figma_get_token_values`, `figma_get_styles`, `figma_get_component`)
- **Figma Access Token**: Personal access token must be configured in `.env`
- **Component-Readiness-Status**: Individual Component Status section must exist in steering docs

---

## Related Documentation

- [Requirements](./requirements.md) — What this spec must accomplish
- [Design](./design.md) — How this spec is implemented (realigned post-054a/054c)
- [Design Outline](../../054-figma-console-mcp-integration/design-outline.md) — Shared architectural context
- [Spec 054a Tasks](../../054a-figma-token-push/tasks.md) — Token push implementation (completed)
- [Spec 054c Tasks](../../054c-figma-token-push-fixes/tasks.md) — Push fixes (completed)
- [Issues File](../../issues/054a-figma-token-push-issues.md) — Known issues and lessons learned

---

**Organization**: spec-guide
**Scope**: 054b-figma-design-extract
