# Design Document: Figma Design Extraction

**Date**: February 18, 2026
**Spec**: 054b - Figma Design Extraction
**Status**: Design Phase
**Dependencies**: Spec 053 (DTCG Token Format Generator), Spec 054 Design Outline (shared architectural context), Spec 054a (Figma Token Push)

---

## Overview

This spec implements the design extraction workflow that reads Figma designs and generates design-outline.md documents. The implementation uses Console MCP to read Figma structure, queries MCP documentation for context, and applies behavioral analysis heuristics to provide context-aware recommendations.

**Key Components:**
- **DesignExtractor** — Reads Figma designs and generates design-outline.md
- **TokenTranslator** — Translates Figma values to DesignerPunk tokens
- **VariantAnalyzer** — Analyzes Figma variants and provides mapping recommendations
- **CLI Command** — `npm run figma:extract` with arguments for file, node, output

**Architecture Decision:** Context-aware extraction with human-in-the-loop decision points. Extraction surfaces recommendations based on Component-Family patterns, existing components, and behavioral analysis, but defers final decisions to human review.

---

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Figma (Design Tool)                         │
│                                                                 │
│  Designer marks component as "ready for spec"                   │
│  Component uses DesignerPunk tokens (pushed via 054a)          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Console MCP (Read)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              DesignExtractor (this spec)                        │
│                                                                 │
│  - readFigmaComponent()  → Get component structure             │
│  - queryContext()        → MCP queries for family/status       │
│  - extractStructure()    → Variants, states, properties        │
│  - translateTokens()     → TokenTranslator                     │
│  - analyzeVariants()     → VariantAnalyzer                     │
│  - generateOutline()     → design-outline.md                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              TokenTranslator (this spec)                        │
│                                                                 │
│  - translate()           → Match Figma value to token          │
│  - findExactMatch()      → Check for exact token match         │
│  - findApproximateMatch()→ Check within tolerance              │
│  - enrichResponse()      → Add primitive + semantic refs       │
└─────────────────────────────────────────────────────────────────┐
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              VariantAnalyzer (this spec)                        │
│                                                                 │
│  - analyzeVariants()     → Behavioral vs styling differences   │
│  - queryFamilyPattern()  → MCP query for Component-Family      │
│  - queryExistingComponents() → MCP query for status           │
│  - generateRecommendations() → Context-aware suggestions       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     design-outline.md                           │
│                                                                 │
│  Generated with confidence flags (✅ ⚠️ ❌)                      │
│  Context-aware recommendations                                  │
│  Human review required before requirements.md                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### DesignExtractor

**Purpose:** Read Figma designs and generate design-outline.md with context-aware recommendations.

**Interface:**
```typescript
export class DesignExtractor {
  constructor(
    private consoleMcp: ConsoleMCPClient,
    private translator: TokenTranslator,
    private analyzer: VariantAnalyzer
  );
  
  async extractDesign(
    figmaFileKey: string,
    componentNodeId: string
  ): Promise<DesignOutline>;
  
  async generateDesignOutlineMarkdown(
    outline: DesignOutline
  ): Promise<string>;
}
```

**Key Methods:**

```typescript
private async readFigmaComponent(
  fileKey: string, 
  nodeId: string
): Promise<FigmaComponent>;

private async queryContext(
  componentName: string
): Promise<ExtractionContext>;

private extractStructure(
  component: FigmaComponent
): ComponentStructure;

private async translateTokens(
  component: FigmaComponent
): Promise<TokenUsage>;

private async analyzeVariants(
  component: FigmaComponent,
  context: ExtractionContext
): Promise<VariantMapping>;

private detectBehavioralContracts(
  component: FigmaComponent
): BehavioralContractStatus;

private detectPlatformParity(
  component: FigmaComponent
): PlatformParityCheck;
```

---

### TokenTranslator

**Purpose:** Translate Figma values to DesignerPunk tokens with tolerance rules.

**Interface:**
```typescript
export class TokenTranslator {
  constructor(private dtcgTokens: DTCGTokenFile);
  
  translate(
    value: number | string,
    category: 'spacing' | 'color' | 'typography' | 'radius' | 'shadow'
  ): TranslationResult;
}

interface TranslationResult {
  token: string;
  confidence: 'exact' | 'approximate' | 'no-match';
  rawValue: string;
  primitive?: string;
  semantic?: string;
  suggestion?: string;
  delta?: string;
}
```

**Tolerance Rules:**

| Category | Tolerance | Rationale |
|----------|-----------|-----------|
| Spacing | ±2px | Accounts for Figma rounding |
| Color | ΔE < 3 | Perceptually similar (CIELAB color difference) |
| Font Size | ±1px | Accounts for rendering differences |
| Radius | ±1px | Minor visual difference |

**Translation Priority:**

1. **Exact match** — Value exactly matches token value
2. **Approximate match** — Value within tolerance of token value
3. **No match** — No token within tolerance, pause for human decision

**Semantic Priority:**

When multiple tokens match, prioritize semantic over primitive:
```typescript
// Example: #B026FF matches both purple.300 (primitive) and color.primary (semantic)
{
  token: 'color.primary',
  confidence: 'exact',
  primitive: 'purple.300',
  semantic: 'color.primary'
}
```

---

### VariantAnalyzer

**Purpose:** Analyze Figma variants and provide context-aware mapping recommendations.

**Interface:**
```typescript
export class VariantAnalyzer {
  constructor(private mcp: MCPClient);
  
  async analyzeVariants(
    component: FigmaComponent,
    context: ExtractionContext
  ): Promise<VariantMapping>;
}

interface VariantMapping {
  figmaVariants: FigmaVariantProperty[];
  recommendations: MappingRecommendation[];
  conflicts: MappingConflict[];
  familyPattern?: ComponentFamilyPattern;
  existingComponents: ComponentStatus[];
}

interface MappingRecommendation {
  option: 'single-component' | 'primitive-semantic' | 'other';
  rationale: string;
  alignsWith: string[];
  tradeoffs: string[];
  recommended: boolean;
}
```

**Analysis Steps:**

1. **Query Component-Family doc** — Get established pattern
2. **Query Component-Readiness-Status** — Check existing components
3. **Analyze behavioral differences** — Do variants differ in behavior or just styling?
4. **Generate recommendations** — Provide options with rationale
5. **Detect conflicts** — Flag when family pattern conflicts with behavioral analysis

---

## Data Models

### DesignOutline

```typescript
interface DesignOutline {
  componentName: string;
  description: string;
  variants: VariantDefinition[];
  states: StateDefinition[];
  properties: PropertyDefinition[];
  tokenUsage: TokenUsage;
  inheritancePattern?: InheritancePattern;
  behavioralContracts: BehavioralContractStatus;
  platformParity: PlatformParityCheck;
  componentTokenDecisions: ComponentTokenDecision[];
  extractionConfidence: ConfidenceReport;
}

interface TokenUsage {
  spacing: TokenReference[];
  colors: TokenReference[];
  typography: TokenReference[];
  radius: TokenReference[];
  shadows: TokenReference[];
}

interface TokenReference {
  property: string;
  token: string;
  confidence: 'exact' | 'approximate' | 'no-match';
  primitive?: string;
  semantic?: string;
  delta?: string;
}

interface BehavioralContractStatus {
  componentType: 'interactive' | 'static';
  extractedStates: string[];
  missingContracts: string[];
  requiresHumanInput: boolean;
}

interface PlatformParityCheck {
  extractedInteractions: InteractionDefinition[];
  platformConcerns: PlatformConcern[];
  requiresHumanDecision: boolean;
}

interface ComponentTokenDecision {
  property: string;
  currentToken: string;
  recommendation: string;
  rationale: string;
  deferToAda: boolean;
}
```

---

## MCP Query Strategy

### Component-Family Doc Query

**When:** During variant analysis

**Query:**
```typescript
const familyDoc = await mcp.getDocumentFull({
  path: `.kiro/steering/Component-Family-${familyName}.md`
});
```

**Extract:**
- Inheritance pattern (primitive + semantic vs single component)
- Behavioral contracts
- Token usage patterns
- Platform parity requirements

**Fallback:** If doc doesn't exist, flag and recommend creation.

---

### Component-Readiness-Status Query

**When:** During variant analysis

**Query:**
```typescript
const statusDoc = await mcp.getSection({
  path: '.kiro/steering/Component-Readiness-Status.md',
  heading: 'Individual Component Status'
});
```

**Extract:**
- Check if component exists (e.g., `ButtonBase`)
- Get component status (🟢 Production Ready, 🟡 Beta, 🔴 Placeholder)
- Get implementation path

**Usage:** Inform variant mapping recommendations (e.g., "ButtonBase not found — this will establish the pattern").

---

### Platform Implementation Guidelines Query

**When:** During platform parity detection

**Query:**
```typescript
const guidelines = await mcp.getSection({
  path: '.kiro/steering/platform-implementation-guidelines.md',
  heading: 'Interaction Patterns'
});
```

**Extract:**
- Platform-specific interaction patterns
- Cross-platform consistency rules

**Usage:** Validate heuristics (hover = web-only) against documented guidelines.

---

## Behavioral Analysis Heuristics

### Interactive vs Static Components

**Interactive Components:**
- Buttons, inputs, modals, navigation, forms
- Require behavioral contracts (click, focus, keyboard, screen reader)

**Static Components:**
- Badges, dividers, avatars, icons, containers
- Auto-generate "no interaction" contract

**Detection:**
```typescript
function detectComponentType(component: FigmaComponent): 'interactive' | 'static' {
  const interactiveKeywords = ['button', 'input', 'modal', 'nav', 'form', 'checkbox', 'radio'];
  const staticKeywords = ['badge', 'divider', 'avatar', 'icon', 'container', 'card'];
  
  const name = component.name.toLowerCase();
  
  if (interactiveKeywords.some(kw => name.includes(kw))) {
    return 'interactive';
  }
  
  if (staticKeywords.some(kw => name.includes(kw))) {
    return 'static';
  }
  
  // Default to interactive (safer to require contracts than skip them)
  return 'interactive';
}
```

---

### Behavioral vs Styling Differences

**Behavioral Difference:**
- Variants have different interaction patterns
- Example: Button with `variant: primary` has different click behavior than `variant: secondary`

**Styling Difference:**
- Variants have same interaction patterns, different visual styling
- Example: Button with `variant: primary` has different color than `variant: secondary`, but same click behavior

**Detection:**
```typescript
function analyzeBehavioralDifferences(variants: FigmaVariant[]): 'behavioral' | 'styling' {
  // Check if variants have different interaction layers
  const hasInteractionDifferences = variants.some(v => 
    v.interactions && v.interactions.length > 0
  );
  
  if (hasInteractionDifferences) {
    return 'behavioral';
  }
  
  // Check if variants differ only in visual properties (color, size, spacing)
  const visualPropertiesOnly = variants.every(v => 
    Object.keys(v.properties).every(prop => 
      ['color', 'size', 'spacing', 'radius', 'shadow'].includes(prop)
    )
  );
  
  if (visualPropertiesOnly) {
    return 'styling';
  }
  
  // Default to behavioral (safer to recommend primitive+semantic than single component)
  return 'behavioral';
}
```

---

### Platform Parity Heuristics

**Platform-Specific Interactions:**

| Interaction | Platforms | Heuristic |
|-------------|-----------|-----------|
| Hover | Web only | No mobile equivalent |
| Press | Mobile only | Maps to click on web |
| Focus | All platforms | Keyboard navigation |
| Disabled | All platforms | Universal state |
| Swipe | Mobile only | No web equivalent |

**Detection:**
```typescript
function detectPlatformParity(component: FigmaComponent): PlatformParityCheck {
  const concerns: PlatformConcern[] = [];
  
  // Check for hover state
  if (component.states.includes('hover')) {
    concerns.push({
      interaction: 'hover',
      platforms: ['web'],
      recommendation: 'Omit on mobile or map to press state'
    });
  }
  
  // Check for swipe gestures
  if (component.interactions.some(i => i.type === 'SWIPE')) {
    concerns.push({
      interaction: 'swipe',
      platforms: ['mobile'],
      recommendation: 'No web equivalent — document as mobile-only'
    });
  }
  
  return {
    extractedInteractions: component.interactions,
    platformConcerns: concerns,
    requiresHumanDecision: concerns.length > 0
  };
}
```

---

## Composite Token Reconstruction

### Style Matching First

**Priority:**
1. **Match style name** — Check if Figma style name matches DesignerPunk composite token
2. **Match decomposed variables** — Check if raw properties match decomposed variable pattern
3. **Reconstruct from raw properties** — Match individual properties to tokens
4. **Flag for review** — If no match, flag for Ada's review

**Example: Shadow Reconstruction**

```typescript
async function reconstructShadow(
  component: FigmaComponent
): Promise<TokenReference> {
  // 1. Check for style match
  if (component.effectStyleId) {
    const styles = await mcp.getStyles(figmaFileKey);
    const style = styles.find(s => s.id === component.effectStyleId);
    
    if (style && style.name.startsWith('shadow.')) {
      return {
        property: 'shadow',
        token: style.name,
        confidence: 'exact',
        semantic: style.name
      };
    }
  }
  
  // 2. Check for decomposed variables
  const decomposed = checkDecomposedVariables(component.effects);
  if (decomposed) {
    return decomposed;
  }
  
  // 3. Reconstruct from raw properties
  const reconstructed = reconstructFromProperties(component.effects);
  if (reconstructed.confidence !== 'no-match') {
    return reconstructed;
  }
  
  // 4. Flag for review
  return {
    property: 'shadow',
    token: '',
    confidence: 'no-match',
    suggestion: 'No matching shadow token found. Consider creating composite token or using decomposed properties.'
  };
}
```

---

## Mode Validation

**Check:** Light and dark mode values should be identical (Phase 1).

**Detection:**
```typescript
function validateModes(variable: FigmaVariable): ModeValidation {
  const lightValue = variable.valuesByMode['light'];
  const darkValue = variable.valuesByMode['dark'];
  
  if (JSON.stringify(lightValue) !== JSON.stringify(darkValue)) {
    return {
      valid: false,
      variable: variable.name,
      lightValue,
      darkValue,
      recommendation: 'Light and dark mode values should be identical (Phase 1). Review and align.'
    };
  }
  
  return { valid: true };
}
```

**Behavior:** If mode discrepancy detected, flag as ⚠️ and pause for human review.

---

## Confidence Flag System

### Flag Definitions

| Flag | Meaning | Trigger | Action Required |
|------|---------|---------|-----------------|
| ✅ High Confidence | Exact match, no ambiguity | Figma value exactly matches token | Review for semantic correctness |
| ⚠️ Needs Review | Approximate match or ambiguous | Value within tolerance OR multiple matches OR unclear structure | Human validates match is appropriate |
| ❌ Requires Human Input | No match or missing info | No token within tolerance OR behavioral contract missing OR platform parity unclear | Human must provide missing information |

### Flag Application

```typescript
function determineConfidenceFlag(result: TranslationResult): ConfidenceFlag {
  if (result.confidence === 'exact') {
    return '✅';
  }
  
  if (result.confidence === 'approximate') {
    return '⚠️';
  }
  
  if (result.confidence === 'no-match') {
    return '❌';
  }
}
```

---

## Error Handling

### No-Match Token Values (Critical — Human-in-the-Loop)

**Trigger:** TokenTranslator returns `confidence: 'no-match'`

**Behavior:**
1. **Flag and PAUSE** — Stop extraction, do not proceed automatically
2. **Report to human** — Show off-system value with closest suggestion
3. **Wait for human decision** — Human reviews and decides:
   - Map to suggested token (accept closest match)
   - Define as intentional off-system value (document in design-outline)
   - Request new token creation (enters spec process)
4. **Execute on feedback** — Resume extraction with human's decision applied

**Example Error Report:**
```
❌ No-match token values found

Property: padding-top
Figma value: 30px
Closest match: space.400 (32px, delta: -2px)

Options:
1. Map to space.400 (accept 2px difference)
2. Document as off-system value (explain why 30px is needed)
3. Request new token creation (enter spec process for space.375 = 30px)

Extraction paused. Provide decision to continue.
```

---

### Missing Component-Family Doc

**Trigger:** Component-Family doc doesn't exist for component being extracted

**Behavior:**
1. **Flag in design-outline** — "⚠️ No Component-Family-Button.md found"
2. **Recommend creation** — "Before proceeding with variant mapping, recommend creating Component-Family-Button.md"
3. **Provide template reference** — "Use Component-MCP-Document-Template.md as starting point"
4. **Allow ad-hoc decision** — Human can proceed without family doc if they document rationale

**Example:**
```markdown
## Variants

**Component-Family Context:**

Component-Family Doc: ⚠️ No Component-Family-Button.md found

**Action Required:**
Before proceeding with variant mapping, recommend creating Component-Family-Button.md to establish:
- Inheritance pattern (primitive + semantic vs single component)
- Behavioral contracts
- Token usage patterns
- Platform parity requirements

Use Component-MCP-Document-Template.md as starting point.

**Temporary Recommendation:**
Cannot provide informed variant mapping recommendation without Component-Family context.
Human must decide whether to:
1. Create Component-Family-Button.md first (recommended)
2. Proceed with ad-hoc decision (document rationale for future family doc)
```

---

### Conflicting Recommendations

**Trigger:** Component-Family pattern conflicts with behavioral analysis

**Behavior:**
1. **Flag conflict** — "⚠️ Conflicting Recommendations"
2. **Show both recommendations** — Family pattern vs behavioral analysis
3. **Explain conflict** — Why recommendations differ
4. **Defer to human** — Human decides which to follow

**Example:**
```markdown
## Variant Mapping (⚠️ Conflicting Recommendations)

**Component-Family-Button.md Recommendation:**
- Primitive + semantic structure (`ButtonBase` + `ButtonCTA`/`ButtonSecondary`/`ButtonTertiary`)
- Rationale: Semantic components encode design intent

**Behavioral Analysis Recommendation:**
- Single component with variant prop
- Rationale: Variants differ only in styling, not behavior

**Conflict:**
Component-Family pattern suggests primitive+semantic, but behavioral analysis suggests single component is sufficient.

**Action Required:**
Human decision on which recommendation to follow. Consider:
- Consistency with existing family pattern vs simplicity
- Future extensibility (will variants diverge in behavior later?)
- Maintenance overhead (more components vs more props)
```

---

## CLI Command Implementation

### Command Structure

```bash
# Extract design from Figma
npm run figma:extract -- --file <file-key> --node <node-id> --output <path>

# Example
npm run figma:extract -- --file abc123 --node 1:234 --output .kiro/specs/button-redesign/design-outline.md
```

### Implementation

```typescript
// src/cli/figma-extract.ts

import { DesignExtractor } from '../figma/DesignExtractor';
import { TokenTranslator } from '../figma/TokenTranslator';
import { VariantAnalyzer } from '../figma/VariantAnalyzer';
import { ConsoleMCPClient } from '../figma/ConsoleMCPClient';

async function main() {
  const args = parseArgs(process.argv);
  
  if (!args.file || !args.node) {
    console.error('Error: --file and --node are required');
    process.exit(1);
  }
  
  // Load DTCG tokens for translation
  const dtcgTokens = loadDTCGTokens('dist/DesignTokens.dtcg.json');
  
  // Initialize components
  const mcp = new ConsoleMCPClient();
  const translator = new TokenTranslator(dtcgTokens);
  const analyzer = new VariantAnalyzer(mcp);
  const extractor = new DesignExtractor(mcp, translator, analyzer);
  
  // Extract design
  try {
    const outline = await extractor.extractDesign(args.file, args.node);
    const markdown = await extractor.generateDesignOutlineMarkdown(outline);
    
    // Write output
    const outputPath = args.output || './design-outline.md';
    fs.writeFileSync(outputPath, markdown);
    
    // Report results
    console.log(`✅ Extraction complete: ${outputPath}`);
    console.log(`Confidence: ${outline.extractionConfidence.summary}`);
    
    if (outline.extractionConfidence.requiresHumanInput) {
      console.log('⚠️  Human input required — review design-outline.md before proceeding');
      process.exit(1);
    }
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Extraction failed: ${error.message}`);
    process.exit(1);
  }
}
```

---

## Design Decisions

### Decision 1: Context-Aware Extraction

**Options Considered:**
- A) Simple extraction (structure only, no context)
- B) Context-aware extraction (MCP queries, recommendations)

**Decision:** Option B

**Rationale:**
- Without context, humans make uninformed decisions
- Component-Family patterns ensure consistency
- Existing component checks prevent duplication
- Behavioral analysis provides rationale for recommendations

**Trade-offs:**
- More complex implementation (MCP queries, analysis logic)
- Slower extraction (multiple MCP queries per component)

**Counter-argument:** Simple extraction is faster and easier to implement. However, the quality of recommendations justifies the complexity.

---

### Decision 2: Pause on No-Match

**Options Considered:**
- A) Auto-resolve to closest match
- B) Pause and wait for human decision
- C) Flag but continue extraction

**Decision:** Option B

**Rationale:**
- AI agents have bias toward "solving" rather than stopping to ask
- No-match values are critical decisions (new token? off-system value?)
- Pausing enforces human-in-the-loop for critical decisions

**Trade-offs:**
- Extraction cannot complete automatically
- Requires human intervention mid-workflow

**Counter-argument:** Auto-resolve is faster. However, incorrect token mappings are worse than pausing for human decision.

---

### Decision 3: Semantic Token Priority

**Options Considered:**
- A) Primitive tokens only
- B) Semantic tokens only
- C) Semantic priority, show both

**Decision:** Option C

**Rationale:**
- Semantic tokens encode design intent (`color.primary` vs `purple.300`)
- Showing both provides traceability (audit trail)
- Designers think in semantic terms ("primary color" not "purple 300")

**Trade-offs:**
- More verbose output (both primitive and semantic shown)

**Counter-argument:** Primitive-only is simpler. However, semantic tokens are more maintainable and self-documenting.

---

### Decision 4: Best-Effort Extraction with Flags

**Options Considered:**
- A) Fail on any ambiguity
- B) Best-effort with flags for ambiguous areas

**Decision:** Option B

**Rationale:**
- Figma designs are often messy (missing descriptions, inconsistent naming)
- Failing entire extraction for minor issues is too strict
- Flags surface issues for human review without blocking extraction

**Trade-offs:**
- Incomplete design-outlines require more human review

**Counter-argument:** Strict validation ensures quality. However, best-effort with flags is more pragmatic for real-world Figma files.

---

## Related Documentation

- [Requirements](./requirements.md) — What this spec must accomplish
- [Design Outline](../../054-figma-console-mcp-integration/design-outline.md) — Shared architectural context
- [Spec 054a Design](../../054a-figma-token-push/design.md) — Token push workflow
- [Component-Readiness-Status](.kiro/steering/Component-Readiness-Status.md) — Component status queries
- [Platform Implementation Guidelines](.kiro/steering/platform-implementation-guidelines.md) — Platform parity validation

---

**Organization**: spec-guide
**Scope**: 054b-figma-design-extract
