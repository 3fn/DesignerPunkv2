# Design Document: Figma Design Extraction

**Date**: February 18, 2026
**Updated**: February 19, 2026 (Thurgood spec review — Req 8, 9, 11 updates)
**Spec**: 054b - Figma Design Extraction
**Status**: Design Phase (Realigned post-054a/054c implementation)
**Dependencies**: Spec 053 (DTCG Token Format Generator), Spec 054 Design Outline (shared architectural context), Spec 054a (Figma Token Push), Spec 054c (Figma Token Push Fixes)

---

## Realignment Notes (Post-054a/054c)

This design was originally written before 054a implementation. During 054a and 054c, several assumptions were invalidated:

1. **MCP tool schemas differ from assumptions** — `figma_get_variables` doesn't exist; use `figma_get_token_values` instead. Tool parameter schemas must be verified against actual `figma-console-mcp` v1.10.1.
2. **Two Figma MCP servers available** — Kiro Figma Power (read-only, design inspection) and `figma-console-mcp` (read-write, 56+ tools). This spec uses both strategically.
3. **Token translation is simpler than originally designed** — 054a pushes tokens with known Figma variable names (`space/100`, `color/purple/300`). Extraction can match by variable binding first, falling back to value-based matching only for unbound values.
4. **ConsoleMCPClient interface is now concrete** — Post-054c, the interface has verified methods: `batchCreateVariables`, `batchUpdateVariables`, `createVariableAliases`, `getVariables`, `execute`, `setupDesignTokens`, `getStatus`. Extension for read operations should build on this.
5. **Color format handling** — DTCG tokens use `rgba()` format; Figma uses hex. `FigmaTransformer.rgbaToHex()` handles push direction. Extraction needs the reverse: hex → token lookup.
6. **Semantic aliases now work** — 054c added `createVariableAliases()` via Plugin API. Extraction can detect alias relationships in Figma.

---

## Overview

This spec implements the design extraction workflow that reads Figma designs and generates design-outline.md documents. The implementation uses two MCP servers strategically and applies behavioral analysis heuristics to provide context-aware recommendations.

**Key Components:**
- **DesignExtractor** — Orchestrates extraction and generates design-outline.md
- **TokenTranslator** — Translates Figma values to DesignerPunk tokens (variable-binding-first approach)
- **VariantAnalyzer** — Analyzes Figma variants and provides mapping recommendations
- **CLI Command** — `npm run figma:extract` with arguments for file, node, output

**Architecture Decision:** Dual-MCP extraction with human-in-the-loop decision points. Use Kiro Figma Power for rich design context and `figma-console-mcp` for variable/style data. Defer final decisions to human review.

---

## Architecture

### Dual-MCP Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     Figma (Design Tool)                         │
│  Component uses DesignerPunk tokens (pushed via 054a)          │
└─────────────────────────────────────────────────────────────────┘
          │                                    │
          │ Kiro Figma Power                   │ figma-console-mcp
          │ (design structure)                 │ (variables & styles)
          ▼                                    ▼
┌──────────────────────┐        ┌──────────────────────────────┐
│ get_design_context   │        │ figma_get_token_values        │
│ get_metadata         │        │ figma_get_styles              │
│ get_variable_defs    │        │ figma_get_component           │
│ get_screenshot       │        │ figma_execute (Plugin API)    │
└──────────────────────┘        └──────────────────────────────┘
          │                                    │
          └──────────────┬─────────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│              DesignExtractor (this spec)                        │
│                                                                 │
│  - readFigmaComponent()  → Kiro Power: get_design_context      │
│  - readTokenBindings()   → Console MCP: figma_get_token_values │
│  - readStyles()          → Console MCP: figma_get_styles       │
│  - queryContext()        → DesignerPunk MCP: doc queries       │
│  - translateTokens()     → TokenTranslator                     │
│  - analyzeVariants()     → VariantAnalyzer                     │
│  - generateOutline()     → design-outline.md                   │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     design-outline.md                           │
│  Generated with confidence flags (✅ ⚠️ ❌)                      │
│  Context-aware recommendations                                  │
│  Human review required before requirements.md                   │
└─────────────────────────────────────────────────────────────────┘
```

### MCP Server Responsibilities

| Server | Purpose | Tools Used |
|--------|---------|------------|
| Kiro Figma Power | Design structure, layout, visual properties | `get_design_context`, `get_metadata`, `get_variable_defs`, `get_screenshot` |
| figma-console-mcp | Variables, styles, Plugin API reads | `figma_get_token_values`, `figma_get_styles`, `figma_get_component`, `figma_execute` |
| DesignerPunk MCP | Documentation context queries | `get_document_full`, `get_section` |

**Rationale:** Kiro Figma Power provides rich design context (component structure, properties, layout) that `figma-console-mcp` doesn't expose as cleanly. `figma-console-mcp` provides variable/style data that Kiro Power doesn't have. Using both gives us the most complete picture.

---

## Components and Interfaces

### DesignExtractor

**Purpose:** Orchestrate extraction from both MCP servers and generate design-outline.md.

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
// Uses Kiro Figma Power: get_design_context + get_metadata
private async readFigmaComponent(
  fileKey: string, 
  nodeId: string
): Promise<FigmaComponent>;

// Uses figma-console-mcp: figma_get_token_values
private async readTokenBindings(
  fileKey: string
): Promise<TokenBinding[]>;

// Uses figma-console-mcp: figma_get_styles
private async readStyles(
  fileKey: string
): Promise<FigmaStyle[]>;

// Uses DesignerPunk MCP: get_document_full, get_section
private async queryContext(
  componentName: string
): Promise<ExtractionContext>;

private async translateTokens(
  component: FigmaComponent,
  bindings: TokenBinding[]
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

### TokenTranslator (Realigned)

**Purpose:** Translate Figma values to DesignerPunk tokens. Uses a variable-binding-first approach that leverages the known token names pushed by 054a.

**Key Change from Original Design:** The original spec assumed all translation would be value-based (reverse-engineering from raw pixel/color values). Since 054a pushes tokens with known Figma variable names, the primary path is now name-based matching. Value-based matching is the fallback for unbound values.

**Interface:**
```typescript
export class TokenTranslator {
  constructor(private dtcgTokens: DTCGTokenFile);
  
  // Primary: match by Figma variable name → DTCG token
  translateByBinding(
    figmaVariableName: string
  ): TranslationResult;
  
  // Fallback: match by raw value with tolerance
  translateByValue(
    value: number | string,
    category: 'spacing' | 'color' | 'typography' | 'radius' | 'shadow'
  ): TranslationResult;
  
  // Composite: try binding first, fall back to value
  translate(
    figmaVariableName: string | undefined,
    rawValue: number | string,
    category: 'spacing' | 'color' | 'typography' | 'radius' | 'shadow'
  ): TranslationResult;
}

interface TranslationResult {
  token: string;
  confidence: 'exact' | 'approximate' | 'no-match';
  matchMethod: 'binding' | 'value';
  rawValue: string;
  primitive?: string;
  semantic?: string;
  suggestion?: string;
  delta?: string;
}
```

**Translation Priority (Updated):**

1. **Variable binding match** — Figma element uses a DesignerPunk variable → exact match by name
2. **Style name match** — Figma element uses a DesignerPunk style → exact match by style name
3. **Exact value match** — Raw value exactly matches a token value
4. **Approximate value match** — Raw value within tolerance of a token value
5. **No match** — No token found, pause for human decision

**Tolerance Rules (Unchanged):**

| Category | Tolerance | Rationale |
|----------|-----------|-----------|
| Spacing | ±2px | Accounts for Figma rounding |
| Color | ΔE < 3 | Perceptually similar (CIELAB color difference) |
| Font Size | ±1px | Accounts for rendering differences |
| Radius | ±1px | Minor visual difference |

**Name-to-Token Mapping:**

Figma variable names use slash notation (`space/100`, `color/purple/300`). DTCG tokens use dot notation (`space.100`, `color.purple.300`). The translator converts between these:

```typescript
function figmaNameToTokenPath(figmaName: string): string {
  // space/100 → space.100
  // color/purple/300 → color.purple.300
  // color/feedback/success/text → color.feedback.success.text
  return figmaName.replace(/\//g, '.');
}
```

---

### VariantAnalyzer (Unchanged)

**Purpose:** Analyze Figma variants and provide context-aware mapping recommendations.

The VariantAnalyzer design remains valid. It queries Component-Family docs and Component-Readiness-Status via DesignerPunk MCP, analyzes behavioral vs styling differences, and generates recommendations.

**Interface:** (unchanged from original design)
```typescript
export class VariantAnalyzer {
  constructor(private mcp: MCPClient);
  
  async analyzeVariants(
    component: FigmaComponent,
    context: ExtractionContext
  ): Promise<VariantMapping>;
}
```

---

## Data Models

### DesignOutline (Updated)

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
  matchMethod: 'binding' | 'value';  // NEW: how the match was found
  primitive?: string;
  semantic?: string;
  delta?: string;
}

// NEW: Represents a Figma variable binding on a component
interface TokenBinding {
  variableName: string;     // e.g. "space/100"
  variableId: string;       // Figma variable ID
  collectionName: string;   // e.g. "Primitives" or "Semantics"
  resolvedType: string;     // FLOAT, COLOR, STRING
  valuesByMode: Record<string, unknown>;
  isAlias: boolean;         // true if this is a semantic alias
  aliasTarget?: string;     // primitive variable name if alias
}
```

---

## MCP Query Strategy (Updated)

### Design Structure Query (Kiro Figma Power)

**When:** First step of extraction — get component structure

**Tool:** `get_design_context`
```typescript
const designContext = await kiroFigmaPower.getDesignContext({
  fileKey: figmaFileKey,
  nodeId: componentNodeId,
  clientLanguages: 'typescript',
  clientFrameworks: 'web-components'
});
```

**Extract:**
- Component name, description
- Variants and their properties
- Visual states (hover, focus, disabled)
- Layout structure (auto-layout, spacing, padding)
- Visual properties (colors, typography, shadows, radii)

**Fallback:** If `get_design_context` doesn't provide enough detail, use `get_metadata` for structure + `figma_get_component` for reconstruction spec.

---

### Token Bindings Query (figma-console-mcp)

**When:** After getting component structure — identify which tokens are used

**Tool:** `figma_get_token_values`
```typescript
const tokenValues = await consoleMcp.getVariables(figmaFileKey);
// Returns all variables with names, types, values, collection info
```

**Extract:**
- All variable names and their resolved values
- Collection membership (Primitives vs Semantics)
- Alias relationships (semantic → primitive)
- Mode values (light/dark)

**Usage:** Build a lookup map of `variableName → tokenPath` for the TokenTranslator.

---

### Style Query (figma-console-mcp)

**When:** After token bindings — identify composite tokens (shadows, typography)

**Tool:** `figma_get_styles`
```typescript
const styles = await consoleMcp.callTool('figma_get_styles', {
  fileKey: figmaFileKey
});
```

**Extract:**
- Effect styles (shadows) — match to `shadow.elevation200` etc.
- Text styles (typography) — match to `typography.heading200` etc.

**Usage:** Direct name matching against pushed style names from 054a.

---

### Component-Family Doc Query (DesignerPunk MCP — Unchanged)

**When:** During variant analysis

**Query:**
```typescript
const familyDoc = await designerPunkMcp.getDocumentFull({
  path: `.kiro/steering/Component-Family-${familyName}.md`
});
```

**Fallback:** If doc doesn't exist, flag and recommend creation.

---

### Component-Readiness-Status Query (DesignerPunk MCP — Unchanged)

**When:** During variant analysis

**Query:**
```typescript
const statusDoc = await designerPunkMcp.getSection({
  path: '.kiro/steering/Component-Readiness-Status.md',
  heading: 'Individual Component Status'
});
```

---

## Behavioral Analysis Heuristics (Unchanged)

The behavioral analysis heuristics from the original design remain valid:
- Interactive vs Static component detection (keyword-based)
- Behavioral vs Styling difference analysis
- Platform parity heuristics (hover = web-only, focus = all platforms)

See original design for full heuristic implementations.

---

## Composite Token Reconstruction (Simplified)

### Style Matching First (Primary Path)

Since 054a pushes styles with known names (`shadow.elevation200`, `typography.heading200`), the primary path is direct name matching:

```typescript
async function matchCompositeToken(
  styleName: string,
  dtcgTokens: DTCGTokenFile
): Promise<TokenReference> {
  // Direct name match against pushed style names
  // shadow.elevation200 → shadow.elevation200
  // typography.heading200 → typography.heading200
  const tokenPath = styleName; // Style names already match token paths
  
  if (dtcgTokens.hasToken(tokenPath)) {
    return {
      property: styleName.startsWith('shadow') ? 'shadow' : 'typography',
      token: tokenPath,
      confidence: 'exact',
      matchMethod: 'binding'
    };
  }
  
  // Fallback: reconstruct from raw properties
  return reconstructFromProperties(styleName);
}
```

### Reconstruction Fallback

Only needed when:
- Designer applied raw shadow/typography properties without using a style
- Style name doesn't match any DesignerPunk token

In these cases, attempt property-by-property matching and flag for Ada's review.

---

## Mode Validation (Updated per Requirement 9)

Mode validation distinguishes between expected and unexpected discrepancies:

**Expected Discrepancies (No Flag)**:
- Color tokens differ by mode (light/dark theme variations)
- Example: `color.primary` = `#3B82F6` (light) vs `#60A5FA` (dark)

**Unexpected Discrepancies (Flag for Review)**:
- Spacing, radius, or typography tokens differ by mode
- Structural tokens should be mode-agnostic
- Example: `space.300` = `24px` (light) vs `32px` (dark) → flags as unexpected

**Rationale**: Modes serve design exploration in Figma. Color variations by mode are expected for light/dark themes. Structural token variations indicate potential design errors or misunderstandings.

**Detection Logic**:
```typescript
function categorizeDiscrepancy(
  tokenCategory: string,
  lightValue: unknown,
  darkValue: unknown
): 'expected' | 'unexpected' | 'none' {
  if (lightValue === darkValue) return 'none';
  
  if (tokenCategory === 'color') return 'expected';
  
  // spacing, radius, typography should be mode-agnostic
  return 'unexpected';
}
```

---

## Component Token Decision Points (Updated per Requirement 8)

The extractor detects repeated primitive token usage and provides **illustrative suggestions** to reduce Ada's cognitive load during spec review.

**Approach**:
1. Detect repeated primitive token usage across component properties
2. Generate illustrative component token suggestion following naming conventions
3. Label suggestion as "Illustrative only — pending Ada review"
4. Include rationale explaining why pattern is notable
5. Defer all token creation decisions to Ada during spec review

**Example Detection**:
```typescript
interface ComponentTokenPattern {
  primitiveToken: string;
  usageCount: number;
  locations: string[];
  illustrativeSuggestion: string;
  rationale: string;
}

function detectComponentTokenPatterns(
  tokenUsage: TokenUsage
): ComponentTokenPattern[] {
  // Detect repeated usage
  const patterns = findRepeatedUsage(tokenUsage);
  
  // Generate illustrative suggestions
  return patterns.map(pattern => ({
    primitiveToken: pattern.token,
    usageCount: pattern.count,
    locations: pattern.locations,
    illustrativeSuggestion: generateIllustrativeName(pattern),
    rationale: explainPattern(pattern)
  }));
}

function generateIllustrativeName(pattern: UsagePattern): string {
  // Follow {component}.{property}.{scale} convention
  // Example: button.padding.horizontal = space.300
  return `${pattern.component}.${pattern.property}.${pattern.scale}`;
}
```

**Output Format** (in design-outline.md):
```markdown
## Component Token Needs

### Pattern 1: Repeated Padding Usage

**Primitive Token**: `space.300` (24px)

**Usage Context**:
- Button padding-left: 5 variants
- Button padding-right: 5 variants

**Illustrative Suggestion** (pending Ada review):
```
button.padding.horizontal = space.300
```

**Rationale**: Consistent spacing across button variants suggests semantic intent.

**Ada Decision Required**: Evaluate whether component tokens align with Token Governance standards.
```

**Critical**: Suggestions are illustrative only. Ada makes final token governance decisions during spec review.

---

## Confidence Flag System (Unchanged)

| Flag | Meaning | Trigger |
|------|---------|---------|
| ✅ High Confidence | Exact match via variable binding or style name | Element uses DesignerPunk variable/style |
| ⚠️ Needs Review | Approximate value match or ambiguous | Value within tolerance, no binding |
| ❌ Requires Human Input | No match or missing info | No token match, missing contracts |

---

## Error Handling (Unchanged)

The error handling strategy from the original design remains valid:
- No-match values: pause and report with closest suggestion
- Missing Component-Family doc: flag and recommend creation
- Conflicting recommendations: show both, defer to human

---

## CLI Command Implementation (Updated)

### Command Structure

```bash
npm run figma:extract -- --file <file-key> --node <node-id> --output <path>
```

### Implementation (Updated)

```typescript
// src/cli/figma-extract.ts

import { DesignExtractor } from '../figma/DesignExtractor';
import { TokenTranslator } from '../figma/TokenTranslator';
import { VariantAnalyzer } from '../figma/VariantAnalyzer';
import { ConsoleMCPClientImpl } from '../figma/ConsoleMCPClientImpl';
import { cleanupStalePorts } from '../figma/portCleanup';

async function main() {
  const args = parseArgs(process.argv);
  
  if (!args.file || !args.node) {
    console.error('Error: --file and --node are required');
    process.exit(1);
  }
  
  // Load DTCG tokens for translation
  const dtcgTokens = loadDTCGTokens('dist/DesignTokens.dtcg.json');
  
  // Port cleanup (learned from 054c ISSUE-4)
  await cleanupStalePorts();
  
  // Initialize Console MCP client (reuse from 054a)
  const consoleMcp = new ConsoleMCPClientImpl();
  await consoleMcp.connect();
  
  // Initialize components
  const translator = new TokenTranslator(dtcgTokens);
  const analyzer = new VariantAnalyzer(/* DesignerPunk MCP */);
  const extractor = new DesignExtractor(consoleMcp, translator, analyzer);
  
  try {
    const outline = await extractor.extractDesign(args.file, args.node);
    const markdown = await extractor.generateDesignOutlineMarkdown(outline);
    
    const outputPath = args.output || './design-outline.md';
    fs.writeFileSync(outputPath, markdown);
    
    console.log(`✅ Extraction complete: ${outputPath}`);
    
    if (outline.extractionConfidence.requiresHumanInput) {
      console.log('⚠️  Human input required — review design-outline.md');
      process.exit(1);
    }
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Extraction failed: ${error.message}`);
    process.exit(1);
  } finally {
    await consoleMcp.disconnect();
  }
}
```

---

## Design Decisions

### Decision 1: Dual-MCP Strategy (NEW)

**Options Considered:**
- A) Use only figma-console-mcp for everything
- B) Use only Kiro Figma Power for everything
- C) Use both strategically based on strengths

**Decision:** Option C

**Rationale:**
- Kiro Figma Power provides rich design context (layout, visual properties, component structure) via `get_design_context`
- figma-console-mcp provides variable/style data that Kiro Power doesn't expose
- Using both gives the most complete extraction

**Counter-argument:** Using two MCP servers adds complexity and potential failure modes. If one server is down, extraction partially fails. However, the data quality improvement justifies the complexity, and we can gracefully degrade if one server is unavailable.

---

### Decision 2: Variable-Binding-First Translation (NEW)

**Options Considered:**
- A) Value-based matching only (original design)
- B) Variable-binding-first with value fallback

**Decision:** Option B

**Rationale:**
- 054a pushes tokens with known Figma variable names
- Matching by name is deterministic (no tolerance ambiguity)
- Value-based matching is still needed for unbound values
- Reduces false positives from tolerance-based matching

**Counter-argument:** Not all design elements will have variable bindings. Designers might use raw values. However, the binding-first approach handles the happy path efficiently and falls back gracefully.

---

### Decision 3: Reuse ConsoleMCPClient (NEW)

**Options Considered:**
- A) Create a separate read-only MCP client
- B) Extend existing ConsoleMCPClient interface
- C) Reuse ConsoleMCPClient as-is, add read methods

**Decision:** Option C

**Rationale:**
- ConsoleMCPClient already has `getVariables()` and `execute()` which cover most read needs
- `getVariables()` uses `figma_get_token_values` (verified working post-054c)
- `execute()` can run any Plugin API code for custom reads
- Adding `getStyles()` is the only new method needed

**Counter-argument:** The ConsoleMCPClient was designed for push operations. Mixing read and write concerns in one interface isn't ideal. However, the underlying MCP connection is the same, and the methods are clearly named.

---

### Decision 4: Context-Aware Extraction (Unchanged)

Option B from original design. MCP queries for Component-Family docs and Component-Readiness-Status provide informed recommendations.

### Decision 5: Pause on No-Match (Unchanged)

Option B from original design. Pause and wait for human decision on no-match values.

### Decision 6: Semantic Token Priority (Unchanged)

Option C from original design. Show both primitive and semantic references.

### Decision 7: Best-Effort Extraction with Flags (Unchanged)

Option B from original design. Best-effort with confidence flags for ambiguous areas.

---

## Related Documentation

- [Requirements](./requirements.md) — What this spec must accomplish
- [Design Outline](../../054-figma-console-mcp-integration/design-outline.md) — Shared architectural context
- [Spec 054a Design](../../054a-figma-token-push/design.md) — Token push workflow
- [Spec 054c Bugfix](../../054c-figma-token-push-fixes/bugfix.md) — Push fixes and lessons learned
- [Issues File](../../issues/054a-figma-token-push-issues.md) — Known issues and fixes
- [Component-Readiness-Status](.kiro/steering/Component-Readiness-Status.md) — Component status queries
- [Platform Implementation Guidelines](.kiro/steering/platform-implementation-guidelines.md) — Platform parity validation

---

**Organization**: spec-guide
**Scope**: 054b-figma-design-extract
