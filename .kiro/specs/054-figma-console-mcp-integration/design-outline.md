# Figma Integration - Design Outline

**Date**: February 3, 2026
**Purpose**: Capture design decisions and architecture for Figma integration (Code → Figma → Spec workflow)
**Status**: Design Outline (Pre-Requirements)
**Last Updated**: February 17, 2026
**Depends On**: Spec 053 (DTCG Token Format Generator)

---

## Executive Summary

This design outline establishes the architecture for integrating DesignerPunk with Figma via the [figma-console-mcp](https://github.com/southleft/figma-console-mcp) server. Building on the DTCG foundation from Spec 053, this spec implements the complete Code → Figma → Spec workflow.

**Core Value Proposition:**
- **Push tokens**: DesignerPunk tokens → Figma variables (designers work in DesignerPunk vocabulary)
- **Extract designs**: Figma designs → design-outline.md (validated designs become specs)
- **Preserve code as source of truth**: One-way sync prevents drift and maintains architectural integrity

**The Workflow This Enables:**
```
Code (Rosetta) 
  → DTCG (spec 053) 
  → Figma Variables (spec 054 - push) 
  → Designer iteration 
  → Validated design 
  → design-outline.md (spec 054 - extract)
  → Spec process (requirements → design → tasks)
  → Implementation 
  → Code (Rosetta)
```

**This is a loop, not a sync.** Each step is explicit and human-reviewed. Code remains the source of truth.

---

## Architecture Overview

### Two-Part Workflow

This spec implements both halves of the Code → Figma → Spec workflow:

**Part A: Push Tokens (Code → Figma)**
```
┌─────────────────────────────────────────────────────────────────┐
│                     Spec 053 Output                             │
│                                                                 │
│                  DesignTokens.dtcg.json                         │
│                           │                                     │
│                           │ (consumed by)                       │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │   FigmaTransformer     │  ← THIS SPEC (Part A)   │
│              │   (implements          │                         │
│              │    ITokenTransformer)  │                         │
│              └────────────────────────┘                         │
│                           │                                     │
│                           ▼                                     │
│                  DesignTokens.figma.json                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Console MCP (Push)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Figma (Design Tool)                         │
│                                                                 │
│  Dedicated Token Library File                                   │
│  Variables populated from DesignerPunk tokens                   │
│  Designer creates layouts using DesignerPunk vocabulary         │
└─────────────────────────────────────────────────────────────────┘
```

**Part B: Extract Designs (Figma → Spec)**
```
┌─────────────────────────────────────────────────────────────────┐
│                     Figma (Design Tool)                         │
│                                                                 │
│  Designer marks design as "ready for spec"                      │
│  Component structure, properties, variants defined              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Console MCP (Read) + Translation Layer
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              DesignExtractor (THIS SPEC - Part B)               │
│                                                                 │
│  Reads Figma file structure                                     │
│  Translates values to DesignerPunk tokens                       │
│  Generates design-outline.md                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     design-outline.md                           │
│                                                                 │
│  Human-reviewed design specification                            │
│  Enters spec process (requirements → design → tasks)            │
└─────────────────────────────────────────────────────────────────┘
```

### Output Files

```
dist/
├── DesignTokens.dtcg.json      # From Spec 053
├── DesignTokens.figma.json     # THIS SPEC
├── DesignTokens.web.css        # Existing
├── DesignTokens.ios.swift      # Existing
└── DesignTokens.android.kt     # Existing
```

---

## Design Decision: One-Way Sync (Code → Figma → Spec)

**Options Considered:**
- A) Bidirectional sync (Code ↔ Figma) — automatic sync in both directions
- B) One-way sync (Code → Figma → Spec) — tokens flow from code to Figma, designs flow from Figma to specs
- C) Manual export/import — no automatic sync

**Decision:** Option B — One-way sync with explicit spec handoff

**Rationale:**

### Code Is Source of Truth
DesignerPunk's Rosetta System defines tokens with:
- Mathematical relationships (`base × 2 = 16`)
- Primitive → semantic hierarchy (token governance)
- Platform-specific implementations (True Native architecture)
- Behavioral contracts (stemma tests)

Figma Variables don't preserve these concepts. If Figma becomes the source of truth (bidirectional sync), DesignerPunk's architectural principles get bypassed.

### Prevents Drift
Bidirectional sync creates merge conflicts when code and Figma disagree:
- Designer changes `space.300` to `25px` in Figma
- Developer changes `space.300` to `24px` in code
- **Who wins?** Automatic sync can't resolve this.

One-way sync eliminates this problem: code always wins.

### Preserves Architectural Integrity
Figma changes don't bypass:
- Token governance (Ada's domain)
- Mathematical foundations (Rosetta System)
- Component behavioral contracts (Lina's domain)
- Test validation (Thurgood's domain)

### Explicit Handoff via Specs
Designers iterate in Figma, then validated designs become specs (design-outline.md). Specs are the contract between design and code. This handoff is:
- **Human-reviewed** (not automatic)
- **Explicit** (designer marks design as "ready for spec")
- **Traceable** (spec documents the design decisions)

**Trade-offs:**
- Designers can't "push" token changes from Figma to code (must go through spec process)
- Requires discipline (designers must use pushed tokens, not create new ones in Figma)
- **But:** Eliminates drift, preserves system integrity, maintains code as canonical source

**The Workflow:**
```
Code (Rosetta) 
  → DTCG (spec 053) 
  → Figma Variables (spec 054 - push) 
  → Designer iteration 
  → Validated design 
  → design-outline.md (spec 054 - extract)
  → Spec process (requirements → design → tasks)
  → Implementation 
  → Code (Rosetta)
```

**This is a loop, not a sync.** Each step is explicit and human-reviewed.

**Counter-argument:** Bidirectional sync would be more convenient for designers (they could change tokens in Figma and see them in code immediately). However, convenience doesn't outweigh the risk of drift and loss of architectural integrity. The spec process provides the necessary review and validation.

---

## Figma Power Strategy

### Use BOTH Figma Powers

Based on capability analysis, DesignerPunk uses both Figma integrations for complementary purposes:

| Power | Purpose | Key Capabilities |
|-------|---------|------------------|
| **Existing Figma Power** (Kiro built-in) | Code Connect, design context | `get_design_context`, `add_code_connect_map`, `get_variable_defs` |
| **Console MCP** (southleft) | Variable management, token sync | `figma_create_variable`, `figma_update_variable`, `figma_delete_variable` |

### Capability Matrix

| Capability | Existing Figma Power | Console MCP |
|------------|---------------------|-------------|
| Read design context | ✅ | ✅ |
| Read variables | ✅ | ✅ |
| Screenshots | ✅ | ✅ |
| Code Connect mapping | ✅ | ❌ |
| **Create variables** | ❌ | ✅ |
| **Update variables** | ❌ | ✅ |
| **Delete variables** | ❌ | ✅ |
| Design creation | ❌ | ✅ (Local Mode) |
| FigJam diagrams | ✅ | ❌ |

---

## FigmaTransformer Implementation

### Transformer Structure

```typescript
// src/generators/transformers/FigmaTransformer.ts

import { ITokenTransformer, TransformResult, TransformerConfig } from './ITokenTransformer';
import { DTCGTokenFile } from '../types/DTCGTypes';

interface FigmaVariable {
  name: string;
  type: 'FLOAT' | 'COLOR' | 'STRING' | 'BOOLEAN';
  valuesByMode: Record<string, any>;
  description?: string;
}

interface FigmaCollection {
  name: string;
  modes: string[];
  variables: FigmaVariable[];
}

interface FigmaTokenFile {
  collections: FigmaCollection[];
}

export class FigmaTransformer implements ITokenTransformer {
  readonly config: TransformerConfig = {
    id: 'figma',
    name: 'Figma Variables',
    outputExtension: '.figma.json',
    includeExtensions: false  // Figma doesn't need DesignerPunk extensions
  };
  
  transform(dtcgTokens: DTCGTokenFile): TransformResult {
    const figmaFile: FigmaTokenFile = {
      collections: [
        this.generatePrimitivesCollection(dtcgTokens),
        this.generateSemanticCollection(dtcgTokens)
      ]
    };
    
    return {
      content: JSON.stringify(figmaFile, null, 2),
      filename: `DesignTokens${this.config.outputExtension}`,
      warnings: this.collectWarnings(dtcgTokens)
    };
  }
  
  canTransform(dtcgTokens: DTCGTokenFile): boolean {
    return true;
  }
  
  private generatePrimitivesCollection(dtcg: DTCGTokenFile): FigmaCollection {
    // Transform primitive tokens to Figma variables
  }
  
  private generateSemanticCollection(dtcg: DTCGTokenFile): FigmaCollection {
    // Transform semantic tokens with alias references
  }
  
  private collectWarnings(dtcg: DTCGTokenFile): string[] {
    // Collect any transformation warnings
  }
}
```

### Figma Output Format

```json
{
  "collections": [
    {
      "name": "DesignerPunk Primitives",
      "modes": ["light", "dark"],
      "variables": [
        {
          "name": "space/100",
          "type": "FLOAT",
          "valuesByMode": {
            "light": 8,
            "dark": 8
          },
          "description": "8px - base × 1"
        },
        {
          "name": "color/purple/300",
          "type": "COLOR",
          "valuesByMode": {
            "light": { "r": 0.69, "g": 0.15, "b": 1, "a": 1 },
            "dark": { "r": 0.69, "g": 0.15, "b": 1, "a": 1 }
          },
          "description": "Primary brand purple"
        }
      ]
    },
    {
      "name": "DesignerPunk Semantic",
      "modes": ["light", "dark"],
      "variables": [
        {
          "name": "color/primary",
          "type": "COLOR",
          "valuesByMode": {
            "light": { "aliasOf": "color/purple/300" },
            "dark": { "aliasOf": "color/purple/300" }
          },
          "description": "Primary brand color"
        }
      ]
    }
  ]
}
```

### DTCG to Figma Type Mapping

| DTCG Type | Figma Type | Transformation |
|-----------|------------|----------------|
| `dimension` | `FLOAT` | Strip unit, keep number |
| `color` | `COLOR` | Convert hex to RGBA object |
| `fontFamily` | `STRING` | Direct mapping |
| `fontWeight` | `FLOAT` | Direct mapping |
| `number` | `FLOAT` | Direct mapping |
| `duration` | `FLOAT` | Convert to milliseconds |
| `cubicBezier` | N/A | Not supported in Figma variables |
| `shadow` (composite) | N/A | Not supported in Figma variables |
| `typography` (composite) | N/A | Not supported in Figma variables |

**Note**: Figma Variables API has limitations. Composite types (shadow, typography) cannot be represented as single variables. They're decomposed into individual properties.

---

## Design Extraction Workflow (Part B)

### DesignExtractor Implementation

```typescript
// src/figma/DesignExtractor.ts

interface DesignOutline {
  componentName: string;
  description: string;
  variants: VariantDefinition[];
  states: StateDefinition[];
  properties: PropertyDefinition[];
  tokens: TokenUsage;
  platformNotes?: PlatformNotes;
}

interface VariantDefinition {
  name: string;
  description: string;
  properties: Record<string, any>;
}

interface TokenUsage {
  spacing: string[];
  colors: string[];
  typography: string[];
  radius: string[];
  shadows: string[];
}

class DesignExtractor {
  constructor(
    private consoleMcp: ConsoleMCPClient,
    private translator: TokenTranslator
  ) {}
  
  async extractDesign(
    figmaFileKey: string,
    componentNodeId: string
  ): Promise<DesignOutline> {
    // 1. Read Figma component structure
    const component = await this.consoleMcp.getNode(figmaFileKey, componentNodeId);
    
    // 2. Extract variants and properties
    const variants = this.extractVariants(component);
    const states = this.extractStates(component);
    const properties = this.extractProperties(component);
    
    // 3. Translate values to tokens
    const tokens = this.extractTokenUsage(component);
    
    // 4. Generate design outline
    return {
      componentName: component.name,
      description: component.description || '',
      variants,
      states,
      properties,
      tokens
    };
  }
  
  async generateDesignOutlineMarkdown(outline: DesignOutline): Promise<string> {
    // Generate design-outline.md format from extracted design
    return `# ${outline.componentName} - Design Outline

**Date**: ${new Date().toISOString().split('T')[0]}
**Purpose**: Component specification extracted from Figma
**Status**: Design Outline (Requires Review)

---

## Component Overview

${outline.description}

---

## Variants

${outline.variants.map(v => `### ${v.name}\n${v.description}`).join('\n\n')}

---

## States

${outline.states.map(s => `### ${s.name}\n${s.description}`).join('\n\n')}

---

## Token Usage

**Spacing**: ${outline.tokens.spacing.join(', ')}
**Colors**: ${outline.tokens.colors.join(', ')}
**Typography**: ${outline.tokens.typography.join(', ')}
**Radius**: ${outline.tokens.radius.join(', ')}
**Shadows**: ${outline.tokens.shadows.join(', ')}

---

## Platform Notes

${outline.platformNotes ? this.formatPlatformNotes(outline.platformNotes) : 'None'}
`;
  }
  
  private extractVariants(component: FigmaComponent): VariantDefinition[] {
    // Extract variant definitions from Figma component
  }
  
  private extractStates(component: FigmaComponent): StateDefinition[] {
    // Extract state definitions (hover, focus, disabled, etc.)
  }
  
  private extractProperties(component: FigmaComponent): PropertyDefinition[] {
    // Extract component properties (size, variant, etc.)
  }
  
  private extractTokenUsage(component: FigmaComponent): TokenUsage {
    // Use TokenTranslator to identify which tokens are used
  }
}
```

### Extraction Process

1. **Designer marks design as ready**
   - Figma component is complete
   - All variants and states defined
   - Uses DesignerPunk tokens (pushed from code)

2. **Run extraction command**
   ```bash
   npm run figma:extract -- --file <file-key> --node <node-id> --output <path>
   ```

3. **Review generated design-outline.md**
   - Human reviews extracted design
   - Validates token usage
   - Adds missing context or rationale
   - Corrects any extraction errors

4. **Enter spec process**
   - design-outline.md → requirements.md
   - requirements.md → design.md
   - design.md → tasks.md
   - tasks.md → implementation

### Extraction Validation

Before generating design-outline.md, validate:

```typescript
interface ExtractionValidation {
  allTokensRecognized: boolean;
  offSystemValues: OffSystemValue[];
  missingVariants: string[];
  missingStates: string[];
  warnings: string[];
}

interface OffSystemValue {
  property: string;
  value: any;
  suggestion: string;
  confidence: 'approximate' | 'no-match';
}
```

**If validation fails:**
- Report off-system values with suggestions
- Warn about missing variants or states
- Require human review before proceeding

---

## Token Sync Workflow (Part A)

### Sync Strategy

- **On-demand only** — Manual trigger via CLI or AI agent
- **Full sync** — Push all tokens, overwrite existing
- **Validation before push** — Verify Figma state matches expected

### Sync Process

```typescript
// src/figma/TokenSyncWorkflow.ts

interface SyncResult {
  success: boolean;
  created: number;
  updated: number;
  deleted: number;
  errors: SyncError[];
}

interface SyncError {
  token: string;
  operation: 'create' | 'update' | 'delete';
  message: string;
}

class TokenSyncWorkflow {
  constructor(
    private consoleMcp: ConsoleMCPClient,
    private figmaFileKey: string
  ) {}
  
  async sync(figmaTokens: FigmaTokenFile): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      created: 0,
      updated: 0,
      deleted: 0,
      errors: []
    };
    
    try {
      // 1. Get current Figma state
      const currentVariables = await this.consoleMcp.getVariables(this.figmaFileKey);
      
      // 2. Diff against desired state
      const diff = this.calculateDiff(currentVariables, figmaTokens);
      
      // 3. Apply changes
      for (const variable of diff.toCreate) {
        await this.createVariable(variable, result);
      }
      for (const variable of diff.toUpdate) {
        await this.updateVariable(variable, result);
      }
      for (const variable of diff.toDelete) {
        await this.deleteVariable(variable, result);
      }
      
    } catch (error) {
      result.success = false;
      result.errors.push({
        token: 'sync',
        operation: 'create',
        message: error.message
      });
    }
    
    return result;
  }
  
  private async createVariable(variable: FigmaVariable, result: SyncResult): Promise<void> {
    try {
      await this.consoleMcp.createVariable(this.figmaFileKey, variable);
      result.created++;
    } catch (error) {
      result.errors.push({
        token: variable.name,
        operation: 'create',
        message: error.message
      });
    }
  }
  
  // ... similar for update and delete
}
```

### Error Handling: Fail and Report

When sync fails:

1. **Stop immediately** — Don't continue with partial state
2. **Report what succeeded** — List created/updated/deleted counts
3. **Report what failed** — List specific errors with token names
4. **Require manual intervention** — User decides how to proceed

```typescript
// Example error report
{
  "success": false,
  "created": 45,
  "updated": 12,
  "deleted": 0,
  "errors": [
    {
      "token": "color/purple/300",
      "operation": "update",
      "message": "Figma API rate limit exceeded"
    }
  ]
}
```

---

## Figma File Strategy

### Dedicated Token Library

DesignerPunk tokens live in a dedicated Figma library file:

```
DesignerPunk Token Library (Figma File)
├── Primitives Collection
│   ├── space/100, space/200, ...
│   ├── color/purple/300, color/cyan/300, ...
│   └── fontSize/100, fontSize/200, ...
└── Semantic Collection
    ├── color/primary, color/error, ...
    └── space/inset/normal, space/inset/spacious, ...
```

### Fork Strategy

When DesignerPunk is forked for a new project:

1. **Fork the token library file** — Copy to new Figma team/project
2. **Update sync configuration** — Point to new file key
3. **Sync tokens** — Push DesignerPunk tokens to forked library
4. **Link project files** — Project files reference the forked library

```typescript
// Configuration per project
interface FigmaSyncConfig {
  /** Figma file key for token library */
  libraryFileKey: string;
  /** Figma team ID (for permissions) */
  teamId?: string;
  /** Project name (for documentation) */
  projectName: string;
}
```

---

## Translation Layer

### Automatic Translation

All Figma reads go through the translation layer automatically:

```typescript
// src/figma/TokenTranslator.ts

interface TranslationResult {
  token: string;           // e.g., "space.300"
  confidence: 'exact' | 'approximate' | 'no-match';
  rawValue: string;        // e.g., "24px"
  suggestion?: string;     // If no exact match, suggest closest
  delta?: string;          // e.g., "1px off from space.300 (24px)"
}

class TokenTranslator {
  constructor(private dtcgTokens: DTCGTokenFile) {}
  
  translate(
    value: number | string,
    category: 'spacing' | 'color' | 'typography' | 'radius' | 'shadow'
  ): TranslationResult {
    const exactMatch = this.findExactMatch(value, category);
    if (exactMatch) {
      return {
        token: exactMatch,
        confidence: 'exact',
        rawValue: String(value)
      };
    }
    
    const approximate = this.findApproximateMatch(value, category);
    if (approximate) {
      return {
        token: approximate.token,
        confidence: 'approximate',
        rawValue: String(value),
        suggestion: `Consider using ${approximate.token} for consistency`,
        delta: approximate.delta
      };
    }
    
    return {
      token: '',
      confidence: 'no-match',
      rawValue: String(value),
      suggestion: 'No matching token found'
    };
  }
  
  private findExactMatch(value: number | string, category: string): string | null {
    // Search DTCG tokens for exact value match
  }
  
  private findApproximateMatch(value: number | string, category: string): { token: string; delta: string } | null {
    // Search DTCG tokens for closest match within tolerance
  }
}
```

### Tolerance Rules

| Category | Tolerance | Rationale |
|----------|-----------|-----------|
| Spacing | ±2px | Accounts for Figma rounding |
| Color | ΔE < 3 | Perceptually similar |
| Font Size | ±1px | Accounts for rendering differences |
| Radius | ±1px | Minor visual difference |

### Warn and Suggest Behavior

When a value doesn't exactly match a token:

```typescript
// Example warning output
{
  "frame": "Card",
  "padding": {
    "raw": { "top": 25, "right": 24, "bottom": 24, "left": 24 },
    "tokens": {
      "top": {
        "token": "space.300",
        "confidence": "approximate",
        "warning": "⚠️ Off-system value: 25px is 1px off from space.300 (24px)"
      },
      "right": { "token": "space.300", "confidence": "exact" },
      "bottom": { "token": "space.300", "confidence": "exact" },
      "left": { "token": "space.300", "confidence": "exact" }
    }
  }
}
```

### Enriched Figma Response

When AI reads a Figma design, the response is automatically enriched:

**Raw Figma Response:**
```json
{
  "frame": "Card",
  "padding": { "top": 24, "right": 24, "bottom": 24, "left": 24 },
  "backgroundColor": "#B026FF"
}
```

**Enriched Response (with DesignerPunk vocabulary):**
```json
{
  "frame": "Card",
  "padding": {
    "raw": { "top": 24, "right": 24, "bottom": 24, "left": 24 },
    "tokens": {
      "top": "space.300",
      "right": "space.300",
      "bottom": "space.300",
      "left": "space.300"
    },
    "semantic": "space.inset.spacious"
  },
  "backgroundColor": {
    "raw": "#B026FF",
    "token": "purple.300",
    "semantic": "color.primary"
  }
}
```

---

## Console MCP Configuration

### Installation (Local Mode)

```json
// .kiro/settings/mcp.json
{
  "mcpServers": {
    "figma-console": {
      "command": "node",
      "args": ["/path/to/figma-console-mcp/dist/index.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
      }
    }
  }
}
```

### Required Setup

1. **Figma Desktop** running with `--remote-debugging-port=9222`
2. **Desktop Bridge plugin** installed and running in Figma file
3. **Personal Access Token** configured in environment

### Pre-flight Checks

Before sync, verify:

```typescript
async function preflight(): Promise<PreflightResult> {
  const checks = {
    figmaDesktopRunning: await checkFigmaDesktop(),
    debugPortOpen: await checkDebugPort(9222),
    pluginRunning: await checkDesktopBridgePlugin(),
    tokenValid: await checkFigmaToken()
  };
  
  return {
    ready: Object.values(checks).every(Boolean),
    checks
  };
}
```

---

## Scope Boundaries

### In Scope (Spec 054)

**Part A: Push Tokens (Code → Figma)**
1. **FigmaTransformer** — Implement ITokenTransformer for Figma
2. **DesignTokens.figma.json** — Figma Variables API format output
3. **Token sync workflow** — On-demand push to Figma
4. **Console MCP configuration** — Local Mode setup
5. **Dedicated library strategy** — Documentation for fork workflow
6. **Error handling** — Fail and report

**Part B: Extract Designs (Figma → Spec)**
7. **DesignExtractor** — Read Figma designs, extract component structure
8. **TokenTranslator** — Automatic translation with warn-and-suggest
9. **design-outline.md generation** — Transform Figma structure to spec format
10. **Extraction validation** — Verify token usage, identify off-system values
11. **CLI commands** — `figma:push` and `figma:extract`

**Documentation**
12. **Figma Integration Guide** — Full workflow (push + extract)
13. **Designer workflow guide** — How to use pushed tokens, mark designs ready
14. **Spec creation workflow** — How to extract and review designs

### Out of Scope (Future Specs)

1. **Automated CI/CD sync** — Automatic token push on release
2. **Multi-designer workflow** — Handling multiple designers
3. **Component token sync** — Evaluate after Phase 1
4. **Figma plugin development** — Custom plugin beyond Desktop Bridge
5. **Bidirectional sync** — Figma → Code automatic sync (explicitly rejected)
6. **Real-time collaboration** — Live sync during design iteration

---

## Risk Assessment

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Console MCP API changes | Medium | High | Pin to specific version, monitor releases |
| Figma Variables API limitations | Low | Medium | Document unsupported types |
| Token mapping edge cases | High | Medium | Define clear tolerance rules, log mismatches |
| Local Mode setup complexity | Medium | Low | Document setup thoroughly, pre-flight checks |

### Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Figma Desktop not running | Medium | Medium | Pre-flight check before sync |
| Token drift (Figma edited directly) | Medium | High | Validation before push, overwrite policy |
| Desktop Bridge plugin not running | Medium | Medium | Pre-flight check, clear error message |

---

## Design Decisions Summary

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | One-way sync (Code → Figma → Spec) | Prevents drift, preserves code as source of truth |
| 2 | Explicit spec handoff (not automatic) | Human review ensures quality and alignment |
| 3 | Use BOTH Figma powers | Complementary capabilities |
| 4 | Implement ITokenTransformer | Clean integration with Spec 053 architecture |
| 5 | Local Mode installation | Required for variable management |
| 6 | Dedicated token library file | Clean separation, fork-friendly |
| 7 | On-demand sync only | Start simple, automate later |
| 8 | Automatic translation | Seamless extraction experience |
| 9 | Warn and suggest for mismatches | Educational, non-blocking, traceable |
| 10 | Fail and report for sync errors | Clear state, manual intervention |
| 11 | Primitives + semantics only | Component tokens add complexity |
| 12 | Combined push + extract in one spec | Complete workflow, end-to-end testing |

---

## Open Questions (Must Resolve Before Requirements)

The following questions must be answered before this spec can proceed to requirements.md:

### OQ-054-1: Local Mode Operational Burden

**Question**: Is the Local Mode setup complexity acceptable for the intended workflow?

**Why it matters**: Local Mode requires:
- Figma Desktop running with `--remote-debugging-port=9222`
- Desktop Bridge plugin installed and running
- Manual process to start/verify before each sync

**Context needed**:
- How often will token sync occur? (Weekly? Per release? Ad-hoc?)
- Who will run the sync? (Peter only? Any team member?)
- Is this acceptable friction for the value delivered?

**Action required**: Define the operational workflow and confirm the setup burden is acceptable.

---

### OQ-054-2: Sync Strategy and Data Loss Risk

**Question**: How should the sync handle Figma-only variables that don't exist in DesignerPunk?

**Why it matters**: "Full sync — Push all tokens, overwrite existing" will delete any variables added directly in Figma. This could cause data loss for:
- Prototyping variables
- Designer experiments
- Project-specific overrides

**Options to evaluate**:
1. **Overwrite all** — Accept data loss, Figma is read-only for tokens
2. **Dry run mode** — Show diff before committing, require confirmation
3. **Additive only** — Never delete, only create/update
4. **Namespaced protection** — Only manage variables in `designerpunk/*` namespace

**Action required**: Decide on sync strategy and document the data loss policy.

---

### OQ-054-3: Translation Layer Tolerance Validation

**Question**: Are the proposed tolerance rules (±2px spacing, ΔE < 3 color) appropriate for real-world Figma designs?

**Why it matters**: If tolerances are too tight, everything shows as "approximate" or "no-match." If too loose, the translation loses precision.

**Action required**: Test tolerance rules against actual Figma designs to validate they produce useful results. Document findings.

---

### OQ-054-4: Handling Truly Custom Values

**Question**: What should the translation layer do when a Figma value has no match (exact or approximate) in the token system?

**Why it matters**: The 80/20 problem framing says AI can interpret custom designs using DesignerPunk vocabulary. But for truly off-system values, the translation layer returns "no-match." What does AI do then?

**Options to evaluate**:
1. **Report raw value** — AI sees `{ "token": null, "rawValue": "37px" }` and improvises
2. **Suggest nearest** — Always suggest closest token even if far off
3. **Flag for review** — Mark as "requires design system decision"
4. **Interpolation hint** — Suggest "between space.400 and space.500"

**Action required**: Define the "no-match" behavior and document how AI should interpret it.

---

### OQ-054-5: Token Drift Detection

**Question**: How do we detect and handle when Figma variables have been edited directly (diverged from DesignerPunk source)?

**Why it matters**: If someone edits a Figma variable value directly, the next sync will silently overwrite their change. This could cause confusion or lost work.

**Options to evaluate**:
1. **Ignore drift** — DesignerPunk is source of truth, Figma edits are ephemeral
2. **Detect and warn** — Pre-sync check shows diverged values, requires confirmation
3. **Detect and block** — Refuse to sync until drift is resolved
4. **Bidirectional merge** — Complex, probably out of scope

**Action required**: Decide on drift handling policy and document it.

---

### OQ-054-6: Design Extraction Completeness

**Question**: What level of design detail should the extraction capture, and what should be left for human review?

**Why it matters**: The DesignExtractor can read Figma structure, but some design decisions require human interpretation:
- **Behavioral intent** (e.g., "this button should disable when form is invalid")
- **Accessibility requirements** (e.g., "this needs ARIA live region")
- **Platform-specific notes** (e.g., "iOS uses native picker, web uses custom dropdown")
- **Edge cases** (e.g., "what happens when text overflows?")

**Options to evaluate**:
1. **Minimal extraction** — Structure and token usage only, human adds all context
2. **Comprehensive extraction** — Attempt to infer behavior, accessibility, platform notes
3. **Hybrid** — Extract what's explicit in Figma, flag what needs human input

**Action required**: Define what the extractor captures vs. what requires human review. Document in design-outline.md template.

---

### OQ-054-7: Extraction Error Handling

**Question**: What should happen when extraction encounters ambiguous or invalid Figma structures?

**Why it matters**: Figma designs might have:
- Components without variants defined
- Inconsistent naming conventions
- Off-system values with no close token match
- Missing or incomplete descriptions

**Options to evaluate**:
1. **Fail fast** — Stop extraction, require Figma fixes before proceeding
2. **Best effort** — Extract what's possible, flag issues for human review
3. **Interactive** — Prompt user for decisions during extraction

**Action required**: Define error handling policy and document expected Figma design quality standards.

---

## Next Steps

1. ✅ **Design outline created** — Architecture and decisions documented
2. ✅ **Dependency on Spec 053 defined** — Clear interface contract
3. ⏳ **Resolve open questions** — OQ-054-1 through OQ-054-6
4. ⏳ **Wait for Spec 053 completion** — Transformer architecture must exist
5. ⏳ **Create requirements.md** — EARS format (blocked by open questions)
6. ⏳ **Create design.md** — Detailed architecture
7. ⏳ **Create tasks.md** — Implementation plan
8. ⏳ **Implement FigmaTransformer**
9. ⏳ **Implement TokenSyncWorkflow**
10. ⏳ **Implement TokenTranslator**
11. ⏳ **Configure Console MCP**

---

**Organization**: spec-guide
**Scope**: 054-figma-console-mcp-integration
