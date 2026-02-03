# Figma Console MCP Integration - Design Outline

**Date**: February 3, 2026
**Purpose**: Capture design decisions and architecture for bidirectional Figma integration
**Status**: Design Outline (Pre-Requirements)
**Last Updated**: February 3, 2026
**Depends On**: Spec 053 (DTCG Token Format Generator)

---

## Executive Summary

This design outline establishes the architecture for integrating DesignerPunk with Figma via the [figma-console-mcp](https://github.com/southleft/figma-console-mcp) server. Building on the DTCG foundation from Spec 053, this spec implements the Figma-specific transformer and bidirectional sync capabilities.

**Core Value Proposition:**
- **Push**: DesignerPunk tokens → Figma variables (designers work in DesignerPunk vocabulary)
- **Pull**: Figma designs → DesignerPunk-native interpretation (AI reads designs in token language)

**The 80/20 Problem This Solves:**
Design systems solve ~80% of UI problems through components and tokens. The remaining 20% (custom layouts, one-off designs) still need to be communicated to AI agents. This integration enables AI to interpret that 20% using DesignerPunk's vocabulary, even when no component exists.

---

## Architecture Overview

### Dependency on Spec 053

This spec consumes the DTCG output from Spec 053:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Spec 053 Output                             │
│                                                                 │
│                  DesignTokens.dtcg.json                         │
│                           │                                     │
│                           │ (consumed by)                       │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │   FigmaTransformer     │  ← THIS SPEC            │
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
│                     Figma (Consumer)                            │
│                                                                 │
│  Dedicated Token Library File                                   │
│  Variables populated from DesignerPunk tokens                   │
│  Designer creates layouts using DesignerPunk vocabulary         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Console MCP (Read) + Translation Layer
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AI Agent                                    │
│                                                                 │
│  Reads Figma design → Interprets in DesignerPunk language       │
│  "24px padding" → "space.300"                                   │
│  Automatic translation with warn-and-suggest                    │
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

## Token Sync Workflow

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

1. **FigmaTransformer** — Implement ITokenTransformer for Figma
2. **DesignTokens.figma.json** — Figma Variables API format output
3. **Token sync workflow** — On-demand push to Figma
4. **Translation layer** — Automatic, warn-and-suggest
5. **Console MCP configuration** — Local Mode setup
6. **Dedicated library strategy** — Documentation for fork workflow
7. **Error handling** — Fail and report

### Out of Scope (Future Specs)

1. **Automated CI/CD sync** — Automatic token push on release
2. **Multi-designer workflow** — Handling multiple designers
3. **Component token sync** — Evaluate after Phase 1
4. **Figma plugin development** — Custom plugin beyond Desktop Bridge

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
| 1 | Use BOTH Figma powers | Complementary capabilities |
| 2 | Implement ITokenTransformer | Clean integration with Spec 053 architecture |
| 3 | Local Mode installation | Required for variable management |
| 4 | Dedicated token library file | Clean separation, fork-friendly |
| 5 | On-demand sync only | Start simple, automate later |
| 6 | Automatic translation | Seamless AI experience |
| 7 | Warn and suggest for mismatches | Educational, non-blocking, traceable |
| 8 | Fail and report for sync errors | Clear state, manual intervention |
| 9 | Primitives + semantics only | Component tokens add complexity |

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

### OQ-054-6: Phased Implementation Strategy

**Question**: Should this spec be split into phases to reduce risk and validate assumptions incrementally?

**Proposed phases**:
1. **Phase 1**: FigmaTransformer only (generate `DesignTokens.figma.json`, manual import)
2. **Phase 2**: Read-only translation layer (AI interprets Figma in token language)
3. **Phase 3**: Full sync workflow via Console MCP

**Why it matters**: Full bidirectional sync is complex. Phasing allows validation of each piece before committing to the full workflow.

**Action required**: Decide whether to implement as single spec or split into phases.

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
