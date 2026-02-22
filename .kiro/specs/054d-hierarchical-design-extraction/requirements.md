# Requirements Document

## Introduction

### Current Extraction Pipeline (Spec 054b)

The DesignerPunk Figma design extraction pipeline reads Figma components and auto-generates `design-outline.md` documents. The pipeline follows a 14-step flow (see Figma-Workflow-Guide.md):

1. Load DTCG tokens from `dist/DesignTokens.dtcg.json`
2. Connect to figma-console-mcp and Kiro Figma Power
3. Read component structure via Kiro Figma Power (`get_design_context`, `get_metadata`)
4. Read token bindings via figma-console-mcp (`figma_get_token_values`, `figma_get_styles`)
5. Translate values using TokenTranslator (binding-first, value-fallback matching)
6. Reconstruct composite tokens (shadows, typography)
7. Detect behavioral contracts and platform parity
8. Surface component token decision points
9. Validate mode consistency (light/dark)
10. Generate `design-outline.md` with confidence flags

**Existing components:**
- **DesignExtractor**: Orchestrates extraction pipeline
- **TokenTranslator**: Binding-first, value-fallback matching with confidence flags (✅ exact, ⚠️ approximate, ❌ no-match) and tolerance rules (±2px spacing, ΔE<3 color)
- **VariantAnalyzer**: Queries Component-Family docs via MCP, generates variant mapping recommendations (Option A vs B with rationale)
- **ConsoleMCPClient**: Interface to figma-console-mcp tools
- **KiroFigmaPowerClient**: Interface to Kiro Figma Power tools

**Available MCP tools:**
- **figma-console-mcp**: `figma_get_token_values` (variable values by mode), `figma_get_styles` (color/text/effect styles), `figma_get_component` (component metadata), `figma_get_component_image` (render component as image), `figma_execute` (run Plugin API code)
- **Kiro Figma Power**: `get_design_context` (generated code with layout/properties), `get_metadata` (XML node tree structure)

**What works:**
- The extraction pipeline already gets hierarchical node tree data from Figma (COMPONENT_SET → COMPONENT → INSTANCE → FRAME with all properties, bindings, and fills at every depth)
- Token translation with confidence flags is solid
- Variant analysis with Component-Family doc queries provides valuable context

**What's broken:**
- The design-outline output is **flat** — token matches lose node context (which node did this token come from?)
- The design-outline is **auto-generated** — it conflates extraction (what Figma has) with specification (what code should be)
- The design-outline is **single-component** — composed components with multiple child instances can't be analyzed together
- Recommendations are **mixed with data** — variant mapping suggestions and component token ideas are presented alongside raw extraction data, creating confirmation bias risk

### Proposed Solution

This spec introduces **Component Analysis** as a descriptive artifact that replaces the auto-generated design-outline. Each component analysis captures the full hierarchical node tree from Figma with three-tier token classification (Semantic Identified, Primitive Identified, Unidentified), composition patterns, and validation-required recommendations. The design-outline becomes a human-authored specification document created AFTER reviewing component analyses.

**Key architectural shift:** Extraction is mechanical and descriptive. Specification is human-authored and prescriptive. These concerns are separated.

## Glossary

- **Component_Analysis**: A descriptive artifact produced by the extraction pipeline containing hierarchical node tree, three-tier classification, composition patterns, unresolved bindings, and validation-required recommendations. Output as JSON (authoritative) and Markdown (human-readable).
- **Three_Tier_Classification**: System for categorizing every extracted value as Semantic_Identified, Primitive_Identified, or Unidentified based on token match confidence.
- **Semantic_Identified**: Token/component match where both semantic and primitive references are known and confirmed. Ready to use without human intervention.
- **Primitive_Identified**: Token/component match where primitive reference found but no semantic exists or semantic mapping uncertain. Opportunity for semantic token creation or intentional primitive usage.
- **Unidentified**: Value extracted from Figma that couldn't be matched to any known token or component. Requires human review.
- **Node_Tree**: Hierarchical structure of Figma nodes (COMPONENT_SET → COMPONENT → INSTANCE → FRAME) preserving parent-child relationships with token classifications per node.
- **Node_Context**: Metadata identifying a node: name, type, depth level, ancestor chain.
- **Composition_Pattern**: Detected pattern of repeated child instances (e.g., 5× "Progress Indicator Primitive") grouped by component name with property variations.
- **Bound_Variable_ID**: Figma variable identifier (e.g., `VariableID:1224:14083`) found in `boundVariables` that may or may not resolve to a known token.
- **Validation_Required_Recommendation**: Analysis output (variant mapping, component token suggestions) that requires domain specialist review without confirmation bias. Presented with disclaimers that Figma structure ≠ optimal code structure.
- **Design_Extractor**: The `DesignExtractor` class that orchestrates extraction pipeline.
- **Token_Translator**: Existing token translation logic (binding-first, value-fallback matching) extended with three-tier classification.
- **Variant_Analyzer**: Existing variant analysis logic that queries Component-Family docs and generates mapping recommendations.

## Requirements

### Requirement 1: Three-Tier Classification System

**User Story:** As a design system developer, I want every extracted value classified as Semantic Identified, Primitive Identified, or Unidentified, so that I understand which values are ready to use, which need semantic tokens, and which require investigation.

#### Acceptance Criteria

1. THE Token_Translator SHALL classify every extracted token value as exactly one tier: Semantic_Identified, Primitive_Identified, or Unidentified.
2. WHEN a token match has both semantic and primitive references confirmed, THE Token_Translator SHALL classify it as Semantic_Identified.
3. WHEN a token match has a primitive reference but no semantic token exists or the semantic mapping is uncertain, THE Token_Translator SHALL classify it as Primitive_Identified.
4. WHEN no token match is found within tolerance, THE Token_Translator SHALL classify the value as Unidentified.
5. THE Component_Analysis SHALL include a classification summary counting values in each tier for the entire component.
6. THE Component_Analysis SHALL preserve existing confidence flags (✅ exact, ⚠️ approximate, ❌ no-match) alongside tier classification.

### Requirement 2: Hierarchical Node Tree Preservation

**User Story:** As a design system developer, I want the extraction to preserve the full Figma node tree with token classifications per node, so that I understand which tokens belong to which nodes in the composition.

#### Acceptance Criteria

1. THE Design_Extractor SHALL build a Node_Tree preserving parent-child relationships for all nodes in the Figma component response.
2. WHEN extracting a node, THE Design_Extractor SHALL record Node_Context: node name, node type (COMPONENT_SET, COMPONENT, INSTANCE, FRAME), depth level, and ancestor chain.
3. THE Design_Extractor SHALL extract layout properties (layoutMode, padding, itemSpacing, cornerRadius) from each node independently.
4. THE Design_Extractor SHALL extract fill colors and boundVariables from FRAME nodes at any depth and associate them with that FRAME's Node_Context.
5. THE Design_Extractor SHALL classify every extracted value at every node using Three_Tier_Classification, so each node carries its own Semantic_Identified, Primitive_Identified, and Unidentified values.
6. WHEN a token value originates from a child or grandchild node, THE Design_Extractor SHALL include the full ancestor chain in Node_Context rather than attributing the value to the root component.

### Requirement 3: Composition Pattern Detection

**User Story:** As a design system developer, I want repeated child instances grouped and summarized, so that I understand composition patterns without redundant per-instance detail.

#### Acceptance Criteria

1. WHEN multiple INSTANCE children share the same component name, THE Design_Extractor SHALL group them into a Composition_Pattern entry with count and shared component name.
2. WHEN grouped instances share identical layout properties and componentProperties definitions, THE Design_Extractor SHALL represent the group with a count (e.g., "× 4 Progress Indicator Primitive") rather than listing each individually.
3. WHEN grouped instances differ in componentProperties values (e.g., State=Current vs State=Incomplete), THE Design_Extractor SHALL list distinct property value combinations within the Composition_Pattern.
4. THE Design_Extractor SHALL detect Composition_Patterns at every level of the Node_Tree, not only at the first child level.

### Requirement 4: Bound Variable Resolution and Classification

**User Story:** As a design system developer, I want Bound_Variable_IDs batch-resolved and classified, so that resolved bindings produce accurate token matches and unresolved bindings are flagged as Unidentified.

#### Acceptance Criteria

1. WHEN collecting Bound_Variable_IDs from nodes at any depth, THE Design_Extractor SHALL include all variable IDs in a single batch resolution call to figma-console-mcp.
2. WHEN a Bound_Variable_ID resolves to a known Figma variable name, THE Design_Extractor SHALL use the resolved name for token translation and classify as Semantic_Identified or Primitive_Identified based on semantic token existence.
3. WHEN a Bound_Variable_ID cannot be resolved, THE Design_Extractor SHALL classify it as Unidentified and record the raw variable ID, the node where found, and failure reason.
4. THE Design_Extractor SHALL associate each resolved or unresolved binding with the Node_Context of the node where the binding was found.

### Requirement 5: Component Screenshots

**User Story:** As a design system developer, I want component screenshots included in the analysis, so that I have visual reference during review without opening Figma.

#### Acceptance Criteria

1. WHEN generating a Component_Analysis, THE Design_Extractor SHALL capture a component screenshot via figma-console-mcp `figma_get_component_image` tool.
2. THE Design_Extractor SHALL capture screenshots at 2x scale in PNG format.
3. THE Design_Extractor SHALL store screenshot images in `.kiro/specs/[spec-name]/analysis/images/` directory.
4. THE Component_Analysis JSON SHALL include screenshot metadata: file path, format, scale, capture timestamp.
5. THE Component_Analysis Markdown SHALL embed screenshot images with captions indicating component name, variant, and capture date.

### Requirement 6: Validation-Required Recommendations

**User Story:** As a design system developer, I want recommendations presented with validation requirements and disclaimers, so that I critically review them without confirmation bias.

#### Acceptance Criteria

1. THE Component_Analysis SHALL include variant mapping recommendations (Option A vs B) from Variant_Analyzer with rationale, conflict detection, and alignment evidence.
2. THE Component_Analysis SHALL include component token suggestions from repeated primitive usage detection with illustrative naming and usage rationale.
3. THE Component_Analysis SHALL include mode validation results flagging unexpected discrepancies between light/dark mode values.
4. THE Component_Analysis SHALL include platform parity detection results showing which interactions exist and which platforms support them.
5. EVERY recommendation section in the Markdown output SHALL include a prominent disclaimer: "⚠️ **Validation Required**: This analysis is based on Figma component structure. The optimal code structure may differ."
6. EVERY recommendation section SHALL include validation prompts listing domain specialists (Ada, Lina, Thurgood) and validation questions to prevent confirmation bias.
7. THE Component_Analysis SHALL NOT include prescriptive recommendations (e.g., "use touch-based alternative") or auto-generated behavioral contract text.

### Requirement 7: Dual Output Format (JSON + Markdown)

**User Story:** As a design system developer, I want each Component_Analysis output as JSON (authoritative) and Markdown (human-readable), so that I have machine-readable source of truth and human-readable analysis.

#### Acceptance Criteria

1. THE Design_Extractor SHALL generate a JSON file containing complete structured data: Node_Tree, Three_Tier_Classification for every value, Composition_Patterns, variant definitions, componentProperties, unresolved Bound_Variable_IDs, and screenshot metadata.
2. THE Design_Extractor SHALL generate a Markdown file containing: classification summary (counts per tier), hierarchical node tree rendered as indented structure, token usage grouped by node with tier indicators (✅ Semantic, ⚠️ Primitive, ❌ Unidentified), Composition_Patterns with counts and property variations, validation-required recommendations with disclaimers, and embedded screenshot images.
3. THE Design_Extractor SHALL store both files in `.kiro/specs/[spec-name]/analysis/` using naming convention `{component-name}-analysis.json` and `{component-name}-analysis.md`.
4. WHEN JSON and Markdown contain conflicting information, THE JSON file SHALL be treated as authoritative source of truth.

### Requirement 8: Multi-Component Analysis Support

**User Story:** As a design system developer, I want to generate Component_Analyses for multiple Figma components within a single spec scope, so that composed components and their children can be analyzed together.

#### Acceptance Criteria

1. THE Design_Extractor SHALL support generating Component_Analyses for multiple Figma components, each producing its own JSON + Markdown pair in the Analysis_Directory.
2. WHEN generating a Component_Analysis for a composed component, THE Component_Analysis SHALL surface dependencies on child components (e.g., "This component contains 5× Progress Indicator Primitive instances — consider including it in scope").
3. WHEN multiple Component_Analyses exist in the same Analysis_Directory, THE Design_Extractor SHALL NOT require them to be generated in a single extraction run; each analysis SHALL be independently generated and stored.
4. THE scope of components included in a spec SHALL be determined by the human developer, not automatically expanded by the pipeline.

### Requirement 9: Design-Outline Deprecation

**User Story:** As a design system developer, I want the auto-generated design-outline removed from the extraction pipeline, so that the design-outline becomes a human-authored specification document.

#### Acceptance Criteria

1. THE Design_Extractor SHALL NOT auto-generate design-outline.md documents.
2. THE `generateDesignOutlineMarkdown()` method SHALL be removed or deprecated.
3. Auto-generated behavioral contract text (e.g., "No interaction — static display component") SHALL be removed.
4. Platform parity prescriptive recommendations (e.g., "use touch-based alternative") SHALL be removed.
5. THE extraction pipeline SHALL produce Component_Analysis artifacts only; design-outline authoring is a separate human-driven workflow.

### Requirement 10: CLI and Workflow Updates

**User Story:** As a design system developer, I want the `figma:extract` CLI command to generate Component_Analysis artifacts with screenshots, so that I can review analyses and author design-outlines.

#### Acceptance Criteria

1. THE `figma:extract` CLI command SHALL generate Component_Analysis JSON + Markdown files in `.kiro/specs/[spec-name]/analysis/`.
2. THE CLI SHALL capture component screenshots via `figma_get_component_image` and store them in `.kiro/specs/[spec-name]/analysis/images/`.
3. THE CLI SHALL support extracting multiple components in a single spec scope, each producing independent analysis files.
4. THE CLI exit code SHALL indicate success (0) or failure (1) based on extraction completion, not on classification results (Unidentified values do not cause failure).
5. THE CLI output SHALL summarize classification results: counts of Semantic_Identified, Primitive_Identified, and Unidentified values.
