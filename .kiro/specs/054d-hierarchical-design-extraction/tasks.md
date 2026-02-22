# Implementation Plan: Component Analysis Extraction

**Date**: 2026-02-22
**Spec**: 054d - Component Analysis Extraction
**Status**: Implementation Planning
**Dependencies**: Spec 054a (Figma Token Push), Spec 054b (Figma Design Extract)

---

## Implementation Plan

This spec refactors the Figma design extraction pipeline to produce Component Analysis artifacts instead of auto-generated design-outlines. Implementation is organized into 7 tasks covering three-tier classification, node tree preservation, composition pattern detection, dual output generation, screenshot capture, and design-outline deprecation.

**Implementation approach:**
1. Extend existing TokenTranslator with three-tier classification (minimal changes to extraction logic)
2. Preserve hierarchical node tree in new ComponentAnalysis data structure
3. Add composition pattern detection and bound variable batch resolution
4. Build dual output generators (JSON + Markdown)
5. Integrate screenshot capture via figma-console-mcp
6. Deprecate auto-generated design-outline logic
7. Update CLI to generate component analyses

**Estimated effort:** Medium-sized refactor (5-7 days)

---

## Task List

- [x] 1. Component Analysis Core Infrastructure

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - ComponentAnalysis data structure defined and tested
  - Three-tier classification system working correctly
  - Hierarchical node tree preserved with token classifications per node
  - Composition pattern detection functional
  - Bound variable batch resolution implemented
  
  **Primary Artifacts:**
  - `src/figma/ComponentAnalysis.ts` (interfaces)
  - `src/figma/DesignExtractor.ts` (enhanced with classification and node tree)
  - `src/figma/TokenTranslator.ts` (enhanced with three-tier classification)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/054d-hierarchical-design-extraction/completion/task-1-parent-completion.md`
  - Summary: `docs/specs/054d-hierarchical-design-extraction/task-1-summary.md`
  
  **Post-Completion:**
  - Run tests: `npm test`
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 1 Complete: Component Analysis Core Infrastructure"`
  - Verify: Check GitHub for committed changes

  - [x] 1.1 Define ComponentAnalysis interfaces
    **Type**: Setup
    **Validation**: Tier 1 - Minimal
    - Create `src/figma/ComponentAnalysis.ts`
    - Define `ComponentAnalysis` interface (component identity, nodeTree, classificationSummary, compositionPatterns, unresolvedBindings, recommendations, screenshots, metadata)
    - Define `NodeWithClassifications` interface (node identity, layout, componentProperties, tokenClassifications, children)
    - Define supporting interfaces: `ClassifiedToken`, `UnidentifiedValue`, `CompositionPattern`, `UnresolvedBinding`, `ScreenshotMetadata`
    - Export from figma index
    - _Requirements: Req 2_

  - [x] 1.2 Implement three-tier classification in TokenTranslator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `classifyTokenMatch()` method to TokenTranslator
    - Logic: confidence === 'no-match' → unidentified; has semantic → semantic; has primitive only → primitive
    - Update `translate()` method to return classifications alongside token references
    - Add classification summary counter (semanticIdentified, primitiveIdentified, unidentified counts)
    - Preserve existing confidence flags (✅ exact, ⚠️ approximate, ❌ no-match)
    - Write unit tests for classification logic covering all three tiers and edge cases
    - _Requirements: Req 1_

  - [x] 1.3 Implement hierarchical node tree construction
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `buildNodeTree()` method to DesignExtractor
    - Recursively walk Figma node tree preserving parent-child relationships
    - Track depth and ancestor chain for each node
    - Extract layout properties (layoutMode, padding, itemSpacing, cornerRadius) per node
    - Extract componentProperties from INSTANCE nodes
    - Classify tokens per node using TokenTranslator (not flattened)
    - Build children recursively
    - Write unit tests for node tree construction with 4+ depth levels
    - _Requirements: Req 2_

  - [x] 1.4 Implement composition pattern detection
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `detectCompositionPatterns()` method to DesignExtractor
    - Group children by component name (INSTANCE nodes only)
    - For groups with 2+ instances, detect shared properties
    - Detect property variations within groups (different State, Size, etc.)
    - Return CompositionPattern array with counts and variations
    - Apply pattern detection at every level of node tree (recursive)
    - Write unit tests for pattern detection (identical instances, property variations, multiple patterns, multi-level)
    - _Requirements: Req 3_

  - [x] 1.5 Implement bound variable batch resolution
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `collectBoundVariableIds()` method to walk node tree and collect all boundVariables
    - Add `batchResolveBoundVariables()` method to call figma-console-mcp with collected IDs
    - Parse resolution results (map of variableId → resolved name or failure reason)
    - Update token classification to use resolved variable names
    - For resolved bindings: translate to token and classify as Semantic/Primitive
    - For unresolved bindings: classify as Unidentified with reason and node context
    - Add unresolved bindings to ComponentAnalysis.unresolvedBindings array
    - Write unit tests for batch resolution (all resolve, some fail, node context preserved)
    - _Requirements: Req 4_

- [ ] 2. Output Generation and CLI Integration

  **Type**: Parent
  **Validation**: Tier 3 - Comprehensive
  
  **Success Criteria:**
  - JSON and Markdown output generators functional
  - Component screenshots captured and embedded
  - Design-outline auto-generation deprecated
  - CLI generates ComponentAnalysis artifacts
  - Multi-component extraction supported
  
  **Primary Artifacts:**
  - `src/figma/ComponentAnalysisGenerator.ts` (JSON + Markdown generators)
  - `scripts/figma-extract.ts` (updated CLI)
  - `.kiro/specs/[spec-name]/analysis/` (output directory structure)
  
  **Completion Documentation:**
  - Detailed: `.kiro/specs/054d-hierarchical-design-extraction/completion/task-2-parent-completion.md`
  - Summary: `docs/specs/054d-hierarchical-design-extraction/task-2-summary.md`
  
  **Post-Completion:**
  - Run tests: `npm test`
  - Manual validation: Extract Progress/Pagination and review generated analysis
  - Trigger release detection: `./.kiro/hooks/release-manager.sh auto`
  - Mark complete: Use `taskStatus` tool to update task status
  - Commit changes: `./.kiro/hooks/commit-task.sh "Task 2 Complete: Output Generation and CLI Integration"`
  - Update Figma-Workflow-Guide.md with new component analysis workflow
  - Verify: Check GitHub for committed changes

  - [ ] 2.1 Implement JSON output generator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Create `src/figma/ComponentAnalysisGenerator.ts`
    - Add `generateComponentAnalysisJSON()` method
    - Serialize ComponentAnalysis to JSON with all fields
    - Write to `.kiro/specs/[spec-name]/analysis/{component-name}-analysis.json`
    - Write integration tests verifying JSON structure matches interface
    - _Requirements: Req 7_

  - [ ] 2.2 Implement Markdown output generator
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `generateComponentAnalysisMarkdown()` method
    - Generate sections: Classification Summary, Node Tree (indented), Token Usage by Node, Composition Patterns, Recommendations, Unidentified Values
    - Include tier indicators: ✅ Semantic, ⚠️ Primitive, ❌ Unidentified
    - Include ⚠️ **Validation Required** disclaimers before recommendations
    - Include validation questions and domain specialist prompts
    - Embed screenshot images with captions
    - Write to `.kiro/specs/[spec-name]/analysis/{component-name}-analysis.md`
    - Write integration tests verifying Markdown includes all required sections
    - _Requirements: Req 6, Req 7_

  - [ ] 2.3 Implement screenshot capture
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Add `captureComponentScreenshot()` method to DesignExtractor
    - Call `figma_get_component_image` with fileKey, nodeId, scale: 2, format: 'png'
    - Parse response to get image URL
    - Create `.kiro/specs/[spec-name]/analysis/images/` directory
    - Generate filename: `{component-name}-{variant}.png`
    - Store screenshot metadata (url, format, scale, capturedAt) in ComponentAnalysis
    - Handle capture failures gracefully (log warning, continue without screenshot)
    - Write integration tests for screenshot capture (mock MCP response, verify metadata, verify graceful failure)
    - _Requirements: Req 5_

  - [ ] 2.4 Deprecate design-outline auto-generation
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Remove or deprecate `generateDesignOutlineMarkdown()` method
    - Remove auto-generated behavioral contract text generation
    - Remove platform parity prescriptive recommendations
    - Update tests to remove design-outline generation expectations
    - _Requirements: Req 9_

  - [ ] 2.5 Update CLI to generate ComponentAnalysis
    **Type**: Implementation
    **Validation**: Tier 2 - Standard
    - Update `scripts/figma-extract.ts` CLI command
    - Generate ComponentAnalysis instead of DesignOutline
    - Call `generateComponentAnalysisJSON()` and `generateComponentAnalysisMarkdown()`
    - Create analysis/ and analysis/images/ directories
    - Support extracting multiple components (loop over node IDs)
    - Update CLI output messages (summarize classification results, report screenshot status, report output paths)
    - Update CLI exit codes (0 = success, 1 = failure, Unidentified values don't cause failure)
    - Write integration tests for CLI (single component, multi-component, classification summary, exit codes)
    - _Requirements: Req 10_

---

## Post-Completion Steps

After all tasks are complete:

1. **Run full test suite**: `npm test` to verify all unit and integration tests pass
2. **Manual validation**: Extract Progress/Pagination component and review generated analysis
3. **Commit changes**: Use `./.kiro/hooks/commit-task.sh "Component Analysis Extraction"`
4. **Update Figma-Workflow-Guide.md**: Document new component analysis workflow
5. **Create completion summary**: Document overall integration story and lessons learned

---

## Success Criteria (Spec Complete)

This spec is complete when:

- [ ] All tasks completed with passing tests
- [ ] ComponentAnalysis artifacts generated for sample component (Progress/Pagination)
- [ ] Three-tier classification working correctly (Semantic, Primitive, Unidentified)
- [ ] Hierarchical node tree preserved with token classifications per node
- [ ] Composition patterns detected and summarized
- [ ] Screenshots captured and embedded in Markdown
- [ ] Design-outline auto-generation deprecated
- [ ] CLI generates analysis artifacts in `.kiro/specs/[spec-name]/analysis/`
- [ ] Figma-Workflow-Guide.md updated with new workflow
- [ ] Completion documentation created for all tasks

