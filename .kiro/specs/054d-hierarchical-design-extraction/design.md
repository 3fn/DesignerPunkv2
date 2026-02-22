# Design Document: Component Analysis Extraction

**Date**: 2026-02-22
**Spec**: 054d - Component Analysis Extraction
**Status**: Design Phase
**Dependencies**: Spec 054a (Figma Token Push), Spec 054b (Figma Design Extract)

---

## Overview

This spec refactors the Figma design extraction pipeline to produce **Component Analysis** artifacts instead of auto-generated design-outlines. The component analysis is a purely descriptive artifact that captures hierarchical node tree data with three-tier token classification, composition patterns, and validation-required recommendations. The design-outline becomes a human-authored specification document created after reviewing component analyses.

**Key architectural principle:** Extraction is mechanical and descriptive. Specification is human-authored and prescriptive. These concerns are separated.

**Scope:** Medium-sized refactor focused on output format and classification. The extraction pipeline (DesignExtractor, TokenTranslator, VariantAnalyzer) remains largely unchanged. We're changing what it produces, not how it extracts.

---

## Architecture

### Current State (Spec 054b)

```
┌─────────────────┐
│  Figma Node     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  DesignExtractor                        │
│  - Reads hierarchical node tree         │
│  - TokenTranslator (binding/value match)│
│  - VariantAnalyzer (recommendations)    │
│  - detectComponentTokenDecisions        │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  generateDesignOutlineMarkdown()        │
│  - Flattens token matches               │
│  - Loses node context                   │
│  - Conflates extraction + specification │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ design-outline  │ (auto-generated, flat)
└─────────────────┘
```

**Problems:**
- Token matches lose node context (which node did this come from?)
- No classification of extraction confidence
- Design-outline tries to be both extraction AND specification
- Single-component scope (can't analyze composed components together)

### Proposed Architecture

```
┌─────────────────┐
│  Figma Node(s)  │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  DesignExtractor (enhanced)                              │
│  - Reads hierarchical node tree (unchanged)              │
│  - TokenTranslator + Three-Tier Classification (NEW)     │
│  - VariantAnalyzer (unchanged, validation-required)      │
│  - detectComponentTokenDecisions (unchanged)             │
│  - Composition pattern detection (NEW)                   │
│  - Bound variable batch resolution (NEW)                 │
│  - Screenshot capture via figma_get_component_image (NEW)│
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  ComponentAnalysis Generator (NEW)                       │
│  - Preserves hierarchical node tree                      │
│  - Three-tier classification per node                    │
│  - Composition patterns with counts                      │
│  - Validation-required recommendations with disclaimers  │
│  - Dual output: JSON (authoritative) + Markdown (readable)│
└────────┬─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  Component Analysis Artifacts                           │
│  - {component-name}-analysis.json                       │
│  - {component-name}-analysis.md                         │
│  - images/{component-name}-{variant}.png                │
│  Stored in: .kiro/specs/[spec-name]/analysis/          │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│  Human/AI Review                                        │
│  - Ada validates token classifications                  │
│  - Lina validates component architecture                │
│  - Thurgood validates spec completeness                 │
│  - Critical review without confirmation bias            │
└────────┬────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ design-outline  │ (human-authored, synthesis)
└─────────────────┘
```

**Key changes:**
- Component analysis preserves node context
- Three-tier classification shows extraction confidence
- Recommendations include validation requirements
- Design-outline is human-authored after review

---

## Components and Interfaces

### ComponentAnalysis (NEW)

```typescript
interface ComponentAnalysis {
  // Component identity
  componentName: string;
  componentType: 'COMPONENT_SET' | 'COMPONENT' | 'INSTANCE';
  figmaId: string;
  fileKey: string;
  
  // Variant definitions (from componentPropertyDefinitions)
  variantDefinitions?: Record<string, {
    type: 'VARIANT' | 'BOOLEAN' | 'TEXT' | 'INSTANCE_SWAP';
    defaultValue: unknown;
    variantOptions?: string[];
  }>;
  
  // Hierarchical node tree with classifications
  nodeTree: NodeWithClassifications;
  
  // Classification summary
  classificationSummary: {
    semanticIdentified: number;
    primitiveIdentified: number;
    unidentified: number;
  };
  
  // Composition patterns
  compositionPatterns: CompositionPattern[];
  
  // Unresolved bindings
  unresolvedBindings: UnresolvedBinding[];
  
  // Validation-required recommendations
  recommendations: {
    variantMapping?: VariantMappingRecommendation;
    componentTokens?: ComponentTokenSuggestion[];
    modeValidation?: ModeValidationResult;
    platformParity?: PlatformParityResult;
  };
  
  // Screenshot metadata
  screenshots: ScreenshotMetadata[];
  
  // Extraction metadata
  extractedAt: string; // ISO timestamp
  extractorVersion: string;
}
```

### NodeWithClassifications (NEW)

```typescript
interface NodeWithClassifications {
  // Node identity
  id: string;
  name: string;
  type: 'COMPONENT_SET' | 'COMPONENT' | 'INSTANCE' | 'FRAME' | 'TEXT';
  depth: number;
  ancestorChain: string[]; // ['COMPONENT_SET', 'COMPONENT', 'INSTANCE']
  
  // Layout properties
  layout?: {
    layoutMode?: 'HORIZONTAL' | 'VERTICAL' | 'NONE';
    padding?: { top: number; right: number; bottom: number; left: number };
    itemSpacing?: number;
    counterAxisSpacing?: number;
    cornerRadius?: number;
  };
  
  // Component properties (for INSTANCE nodes)
  componentProperties?: Record<string, {
    type: 'VARIANT' | 'BOOLEAN' | 'TEXT' | 'INSTANCE_SWAP';
    value: unknown;
  }>;
  
  // Token classifications (per node)
  tokenClassifications: {
    semanticIdentified: ClassifiedToken[];
    primitiveIdentified: ClassifiedToken[];
    unidentified: UnidentifiedValue[];
  };
  
  // Child nodes
  children: NodeWithClassifications[];
}
```

### ClassifiedToken (NEW)

```typescript
interface ClassifiedToken {
  property: string; // 'padding-top', 'fill', 'border-radius'
  semanticToken?: string; // 'semanticSpace.inset.075'
  primitiveToken: string; // 'space.space075'
  rawValue: unknown; // 6
  matchMethod: 'binding' | 'value';
  confidence: 'exact' | 'approximate';
  delta?: string; // '+1px' for approximate matches
}
```

### UnidentifiedValue (NEW)

```typescript
interface UnidentifiedValue {
  property: string;
  rawValue: unknown;
  reason: 'no-token-match' | 'unresolved-binding' | 'out-of-tolerance';
  closestMatch?: {
    token: string;
    delta: string;
  };
  boundVariableId?: string; // If this was a binding that couldn't resolve
}
```

### CompositionPattern (NEW)

```typescript
interface CompositionPattern {
  componentName: string; // 'Progress Indicator Primitive'
  count: number; // 5
  sharedProperties: Record<string, unknown>; // { Size: 'Sm', 'Show Label': false }
  propertyVariations: Array<{
    properties: Record<string, unknown>; // { State: 'Current' }
    count: number; // 1
  }>;
  depth: number; // Which level of the tree this pattern appears
}
```

### UnresolvedBinding (NEW)

```typescript
interface UnresolvedBinding {
  variableId: string; // 'VariableID:1224:14083'
  property: string; // 'fill'
  nodeId: string;
  nodeName: string;
  ancestorChain: string[];
  reason: 'not-in-token-values' | 'api-resolution-failed';
}
```

### ScreenshotMetadata (NEW)

```typescript
interface ScreenshotMetadata {
  filePath: string; // './images/progress-pagination-sm.png'
  url?: string; // Figma-provided URL (expires after 30 days)
  format: 'png' | 'jpg' | 'svg';
  scale: number; // 2
  variant?: string; // 'Property 1=Sm'
  capturedAt: string; // ISO timestamp
}
```

### Existing Interfaces (Preserved)

The following interfaces from Spec 054b are preserved:

- `TokenReference` - Individual token match with confidence
- `TokenUsage` - Categorized token arrays (spacing, colors, typography, radius, shadows)
- `VariantMapping` - Variant analysis with recommendations
- `ComponentTokenDecision` - Component token suggestions
- `ModeValidationResult` - Light/dark mode discrepancy detection
- `PlatformParityResult` - Platform interaction support detection

---

## Data Models

### Three-Tier Classification Logic

```typescript
function classifyTokenMatch(
  match: TokenReference,
  semanticExists: boolean
): 'semantic' | 'primitive' | 'unidentified' {
  // No match at all
  if (match.confidence === 'no-match') {
    return 'unidentified';
  }
  
  // Has semantic token reference
  if (match.semantic && semanticExists) {
    return 'semantic';
  }
  
  // Has primitive but no semantic
  if (match.primitive && !match.semantic) {
    return 'primitive';
  }
  
  // Has primitive but semantic mapping uncertain
  if (match.primitive && match.semantic && !semanticExists) {
    return 'primitive';
  }
  
  // Fallback
  return 'unidentified';
}
```

### Node Tree Construction

```typescript
function buildNodeTree(
  figmaNode: FigmaNode,
  depth: number = 0,
  ancestors: string[] = []
): NodeWithClassifications {
  const node: NodeWithClassifications = {
    id: figmaNode.id,
    name: figmaNode.name,
    type: figmaNode.type,
    depth,
    ancestorChain: ancestors,
    layout: extractLayout(figmaNode),
    componentProperties: extractComponentProperties(figmaNode),
    tokenClassifications: {
      semanticIdentified: [],
      primitiveIdentified: [],
      unidentified: []
    },
    children: []
  };
  
  // Extract and classify tokens for this node
  const tokenMatches = tokenTranslator.translate(figmaNode);
  for (const match of tokenMatches) {
    const tier = classifyTokenMatch(match, semanticTokenExists(match.semantic));
    node.tokenClassifications[tier].push(match);
  }
  
  // Recursively build children
  if (figmaNode.children) {
    const newAncestors = [...ancestors, figmaNode.type];
    node.children = figmaNode.children.map(child =>
      buildNodeTree(child, depth + 1, newAncestors)
    );
  }
  
  return node;
}
```

### Composition Pattern Detection

```typescript
function detectCompositionPatterns(
  children: NodeWithClassifications[]
): CompositionPattern[] {
  const patterns: CompositionPattern[] = [];
  
  // Group children by component name
  const grouped = new Map<string, NodeWithClassifications[]>();
  for (const child of children) {
    if (child.type === 'INSTANCE') {
      const name = child.name;
      if (!grouped.has(name)) {
        grouped.set(name, []);
      }
      grouped.get(name)!.push(child);
    }
  }
  
  // Detect patterns in groups with 2+ instances
  for (const [componentName, instances] of grouped) {
    if (instances.length < 2) continue;
    
    // Find shared properties
    const sharedProps = findSharedProperties(instances);
    
    // Find property variations
    const variations = groupByPropertyVariations(instances, sharedProps);
    
    patterns.push({
      componentName,
      count: instances.length,
      sharedProperties: sharedProps,
      propertyVariations: variations,
      depth: instances[0].depth
    });
  }
  
  return patterns;
}
```

---

## Error Handling

### Bound Variable Resolution Failures

When batch-resolving bound variable IDs:

1. **Collect all variable IDs** from the node tree
2. **Batch resolve** via `figma-console-mcp`
3. **For each resolution failure:**
   - Classify as Unidentified
   - Record variable ID, property, node context
   - Include reason: 'not-in-token-values' or 'api-resolution-failed'
4. **Continue extraction** - failures don't block analysis generation

### Screenshot Capture Failures

When capturing component screenshots:

1. **Attempt capture** via `figma_get_component_image`
2. **On failure:**
   - Log warning with component name and error
   - Continue analysis generation without screenshot
   - Include note in Markdown: "Screenshot unavailable (capture failed)"
3. **Don't block** analysis generation on screenshot failures

### Token Classification Edge Cases

**Case 1: Semantic token exists but primitive doesn't match**
- Classification: Unidentified
- Reason: 'semantic-primitive-mismatch'
- Action: Flag for human review

**Case 2: Multiple semantic tokens reference same primitive**
- Classification: Semantic Identified (use first match)
- Note: Include all semantic options in Markdown

**Case 3: Approximate match within tolerance**
- Classification: Primitive Identified (if no semantic) or Semantic Identified (if semantic exists)
- Confidence: 'approximate'
- Include delta in output

---

## Testing Strategy

### Unit Tests

**TokenTranslator Three-Tier Classification:**
- Test semantic identified: both semantic and primitive confirmed
- Test primitive identified: primitive exists, no semantic
- Test unidentified: no match within tolerance
- Test edge cases: semantic exists but primitive mismatch

**Node Tree Construction:**
- Test depth tracking and ancestor chains
- Test token classification per node
- Test layout property extraction at every depth
- Test componentProperties extraction from INSTANCE nodes

**Composition Pattern Detection:**
- Test grouping by component name
- Test shared property detection
- Test property variation grouping
- Test patterns at multiple tree levels

**Bound Variable Resolution:**
- Test batch resolution with mixed success/failure
- Test unresolved binding classification
- Test node context association

### Integration Tests

**Full Extraction Pipeline:**
- Test Progress/Pagination COMPONENT_SET extraction
- Verify hierarchical node tree with 4+ levels
- Verify three-tier classification at every node
- Verify composition patterns detected (5× Progress Indicator Primitive)
- Verify unresolved bindings flagged

**Dual Output Generation:**
- Test JSON structure matches ComponentAnalysis interface
- Test Markdown includes all required sections
- Test tier indicators in Markdown (✅ ⚠️ ❌)
- Test screenshot embedding in Markdown

**Multi-Component Analysis:**
- Test extracting multiple components in same spec
- Verify independent JSON + Markdown pairs
- Verify images stored in shared images/ directory

### Validation Tests

**Requirement Compliance:**
- Each requirement has corresponding test coverage
- Acceptance criteria are testable and tested
- Edge cases from requirements are covered

---

## Design Decisions

### Decision 1: Three-Tier Classification vs Multi-Level Confidence

**Options Considered:**
- A: Three tiers (Semantic, Primitive, Unidentified)
- B: Five-level confidence scale (High, Medium-High, Medium, Low, None)
- C: Binary classification (Identified, Unidentified)

**Decision:** Option A (Three tiers)

**Rationale:**
- Three tiers map to actionable decisions: use as-is, create semantic, investigate
- Five levels create analysis paralysis - too many gradations
- Binary loses critical distinction between "has primitive" and "has nothing"
- Three tiers align with token governance: semantic-first, primitive-fallback, hard-coded-last-resort

**Trade-offs:**
- Loses nuance of "high confidence primitive" vs "low confidence primitive"
- But: existing confidence flags (exact/approximate) preserve that nuance within tiers

### Decision 2: JSON as Authoritative vs Markdown as Authoritative

**Options Considered:**
- A: JSON authoritative, Markdown generated from JSON
- B: Markdown authoritative, JSON generated from Markdown
- C: Both independently authored, manual sync required

**Decision:** Option A (JSON authoritative)

**Rationale:**
- JSON is structured and machine-readable - easier to validate and transform
- Markdown is for human consumption - formatting can evolve without breaking contracts
- Generating Markdown from JSON ensures consistency
- JSON can be consumed by future tooling (analysis diff, trend tracking)

**Trade-offs:**
- Markdown can't include human annotations without breaking sync
- But: that's intentional - analysis is descriptive, not annotated

### Decision 3: Screenshot Storage (Local vs URL-only)

**Options Considered:**
- A: Store screenshots locally in analysis/images/
- B: Store only Figma-provided URLs (expire after 30 days)
- C: Store both local files and URLs

**Decision:** Option C (Both local and URLs)

**Rationale:**
- Local storage preserves screenshots long-term (URLs expire)
- URLs provide immediate access without download
- Storage cost is negligible (PNGs are small)
- Local files enable offline review

**Trade-offs:**
- Increases repo size
- But: screenshots are valuable documentation artifacts worth preserving

### Decision 4: Design-Outline Deprecation vs Dual-Mode Support

**Options Considered:**
- A: Deprecate auto-generated design-outline entirely
- B: Support both auto-generated (for simple components) and human-authored (for complex)
- C: Keep auto-generation, add component analysis as optional enhancement

**Decision:** Option A (Deprecate entirely)

**Rationale:**
- Dual-mode creates confusion about which workflow to use
- Auto-generation conflates extraction with specification - this is the core problem
- Human authoring forces critical review and prevents confirmation bias
- Component analysis provides all the data needed for human authoring

**Trade-offs:**
- Requires more human effort for simple components
- But: the effort is valuable - even simple components benefit from critical review

---

## Related Documentation

- **Spec 054a**: Figma Token Push (token sync workflow)
- **Spec 054b**: Figma Design Extract (current extraction pipeline)
- **Token-Governance.md**: Token selection and usage governance
- **Component-Development-Guide.md**: Component development standards
- **Test-Development-Standards.md**: Test patterns and categories
