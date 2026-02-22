# Requirements Document

## Introduction

The DesignerPunk Figma design extraction pipeline (`DesignExtractor.ts`) currently produces a flat token usage table that loses the hierarchical structure of composed Figma components. When extracting a COMPONENT_SET like "Progress/Pagination", the pipeline captures top-level layout values (spacing, padding, radius) but discards the composition tree: which child instances exist, what properties they carry, and which grandchild nodes hold the actual color bindings. The design outline markdown renders a single flat table of token matches with no indication of which node each token belongs to.

This spec addresses the architectural gap by introducing hierarchical extraction — preserving the parent → child → grandchild tree structure, associating token usage with specific nodes, and rendering the composition in the design outline output.

## Glossary

- **Design_Extractor**: The `DesignExtractor` class in `src/figma/DesignExtractor.ts` that reads Figma component data and produces a `DesignOutline`.
- **Design_Outline**: The output data structure (`DesignOutline` interface) and its markdown rendering that documents a component's tokens, variants, states, and contracts.
- **Token_Usage**: The `TokenUsage` interface containing categorized arrays of `TokenReference` entries (spacing, colors, typography, radius, shadows).
- **Token_Reference**: A single matched token entry with property name, token path, confidence, and match method.
- **Component_Tree**: The hierarchical node structure from Figma's API response, where a COMPONENT_SET contains COMPONENT children, which contain INSTANCE and FRAME grandchildren.
- **Node_Context**: Metadata identifying which node in the Component_Tree a token usage belongs to (node name, node type, depth level).
- **Composition_Structure**: The pattern of repeated child instances within a component (e.g., 5 "Progress Indicator Primitive" instances inside a Pagination variant).
- **Bound_Variable**: A Figma variable binding (`boundVariables`) on a node's fill, stroke, or layout property that references a Figma variable by ID.
- **Component_Properties**: Figma `componentProperties` on INSTANCE nodes that define variant selections (State, Size) and boolean toggles (Show Label).
- **Variant_Definition**: A property defined in `componentPropertyDefinitions` on a COMPONENT_SET that specifies variant axes and their allowed values.
- **Markdown_Generator**: The `generateDesignOutlineMarkdown` method and its private render helpers that produce the design outline markdown string.

## Requirements

### Requirement 1: Hierarchical Node Tree Extraction

**User Story:** As a design system developer, I want the extraction pipeline to preserve the full component tree structure from Figma, so that I can see which tokens belong to which nodes in a composed component.

#### Acceptance Criteria

1. WHEN the Design_Extractor processes a COMPONENT_SET response, THE Design_Extractor SHALL build a tree of extracted nodes preserving parent-child relationships to a minimum depth of 4 levels.
2. WHEN the Design_Extractor extracts a node, THE Design_Extractor SHALL record the node name, node type (COMPONENT_SET, COMPONENT, INSTANCE, FRAME), and depth level as Node_Context for that node.
3. WHEN the Design_Extractor encounters INSTANCE nodes at any depth, THE Design_Extractor SHALL extract layout properties (layoutMode, padding, itemSpacing, cornerRadius) from each INSTANCE node independently.
4. WHEN the Design_Extractor encounters FRAME nodes nested inside INSTANCE nodes, THE Design_Extractor SHALL extract fill colors and Bound_Variable references from those FRAME nodes and associate them with the parent INSTANCE's Node_Context.
5. THE Design_Extractor SHALL associate every Token_Reference with the Node_Context of the node from which the token value was extracted.

### Requirement 2: Token Usage with Node Context

**User Story:** As a design system developer, I want each token match in the design outline to indicate which node it came from, so that I can understand the token-to-node mapping in composed components.

#### Acceptance Criteria

1. THE Token_Reference interface SHALL include an optional Node_Context field that identifies the source node for the token match.
2. WHEN the Design_Extractor translates extracted values into Token_References, THE Design_Extractor SHALL populate the Node_Context field with the name and type of the originating node.
3. WHEN multiple nodes at different depths produce the same token match, THE Design_Extractor SHALL preserve each match as a separate Token_Reference with its own Node_Context rather than deduplicating.
4. WHEN a Token_Reference originates from a grandchild node (depth 2 or greater), THE Design_Extractor SHALL include the ancestor chain (parent name → child name → node name) in the Node_Context.

### Requirement 3: Composition Structure Detection

**User Story:** As a design system developer, I want the extraction to detect and summarize repeated child instances within a component, so that I understand the composition pattern without redundant per-instance detail.

#### Acceptance Criteria

1. WHEN the Design_Extractor encounters multiple INSTANCE children with the same component name, THE Design_Extractor SHALL group those instances and record the count and shared component name as a Composition_Structure entry.
2. WHEN grouped instances share identical layout properties and Component_Properties definitions, THE Design_Extractor SHALL represent the group as a single Composition_Structure entry with a count rather than listing each instance individually.
3. WHEN grouped instances differ in Component_Properties values (e.g., one has State=Current while others have State=Incomplete), THE Design_Extractor SHALL list the distinct property value combinations within the Composition_Structure entry.
4. THE Design_Extractor SHALL detect Composition_Structure at every level of the Component_Tree, not only at the first child level.

### Requirement 4: Component Property Extraction from Child Instances

**User Story:** As a design system developer, I want the extraction to capture componentProperties from child INSTANCE nodes, so that I can see what states, sizes, and toggles each child primitive exposes.

#### Acceptance Criteria

1. WHEN the Design_Extractor encounters an INSTANCE node with a `componentProperties` field, THE Design_Extractor SHALL extract each property's name, type (VARIANT, BOOLEAN, TEXT, INSTANCE_SWAP), and current value.
2. WHEN a Component_Property has type VARIANT, THE Design_Extractor SHALL record the property name and its current variant value (e.g., State=Incomplete, Size=Sm).
3. WHEN a Component_Property has type BOOLEAN, THE Design_Extractor SHALL record the property name and its boolean value (e.g., Show Label=false).
4. THE Design_Extractor SHALL associate extracted Component_Properties with the INSTANCE node's Node_Context so the design outline can display which child carries which properties.

### Requirement 5: Variant Definition Extraction from componentPropertyDefinitions

**User Story:** As a design system developer, I want the extraction to parse `componentPropertyDefinitions` on COMPONENT_SET nodes, so that variant axes and their allowed values appear in the design outline.

#### Acceptance Criteria

1. WHEN the Design_Extractor processes a COMPONENT_SET node that has a `componentPropertyDefinitions` field, THE Design_Extractor SHALL extract each property definition including its name, type, default value, and allowed variant options.
2. WHEN a componentPropertyDefinition has type VARIANT, THE Design_Extractor SHALL record the variant axis name and the complete list of variant options (e.g., Property 1: Sm, Md, Lg).
3. WHEN the existing `variantProperties` field is absent or empty but `componentPropertyDefinitions` contains VARIANT entries, THE Design_Extractor SHALL use `componentPropertyDefinitions` as the authoritative source for Variant_Definitions.
4. IF `componentPropertyDefinitions` and `variantProperties` both exist with conflicting data, THEN THE Design_Extractor SHALL prefer `componentPropertyDefinitions` as the authoritative source and log a confidence note about the discrepancy.

### Requirement 6: Hierarchical Design Outline Rendering

**User Story:** As a design system developer, I want the design outline markdown to represent the component's composition hierarchy, so that I can read the outline and understand the tree structure of the component.

#### Acceptance Criteria

1. THE Markdown_Generator SHALL render a "Composition Structure" section in the design outline that shows the component tree as an indented hierarchy.
2. WHEN rendering the composition hierarchy, THE Markdown_Generator SHALL display each node's name, type, and a summary of its token usage at the appropriate indentation level.
3. WHEN a Composition_Structure group exists, THE Markdown_Generator SHALL render the group as a single entry with a count indicator (e.g., "× 5 Progress Indicator Primitive (INSTANCE)") rather than repeating each instance.
4. WHEN rendering the Token Usage section, THE Markdown_Generator SHALL group token references by their source node, displaying the node name as a sub-heading or grouping label within each token category.
5. THE Markdown_Generator SHALL continue to render the existing flat Token Usage table as a summary section, preserving backward compatibility with downstream consumers that parse the current format.

### Requirement 7: Bound Variable Resolution for Deep Nodes

**User Story:** As a design system developer, I want Bound_Variable IDs found on grandchild nodes to be resolved to token names, so that color bindings deep in the tree produce accurate token matches instead of raw hex values.

#### Acceptance Criteria

1. WHEN the Design_Extractor collects Bound_Variables from nodes at any depth, THE Design_Extractor SHALL include those variable IDs in the resolution batch sent to `resolveUnknownVariableIds`.
2. WHEN a Bound_Variable ID from a deep node resolves to a known Figma variable name, THE Design_Extractor SHALL use the resolved variable name for token translation instead of the raw color value.
3. IF a Bound_Variable ID from a deep node cannot be resolved (not in token values, not resolvable via Plugin API), THEN THE Design_Extractor SHALL fall back to raw value matching and include a confidence note indicating the binding was unresolved.
4. THE Design_Extractor SHALL associate each resolved Bound_Variable with the Node_Context of the node where the binding was found, not the root component node.

### Requirement 8: Backward Compatibility

**User Story:** As a design system developer, I want the hierarchical extraction changes to preserve the existing flat extraction behavior for simple (non-composed) components, so that existing design outlines remain valid.

#### Acceptance Criteria

1. WHEN the Design_Extractor processes a component with no INSTANCE children (a leaf component), THE Design_Extractor SHALL produce a Design_Outline with the same structure and content as the current implementation.
2. THE Design_Extractor SHALL maintain the existing `TokenUsage` interface with its five category arrays (spacing, colors, typography, radius, shadows) as the primary token summary.
3. WHEN the Design_Outline is consumed by downstream code that reads `tokenUsage.spacing`, `tokenUsage.colors`, etc., THE Design_Extractor SHALL populate those arrays with all token references from all nodes (flattened), preserving the current contract.
4. THE Design_Extractor SHALL not remove or rename any existing public methods or interfaces; new hierarchical data SHALL be added as new optional fields on existing interfaces.
