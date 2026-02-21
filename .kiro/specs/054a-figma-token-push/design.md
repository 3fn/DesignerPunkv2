# Design Document: Figma Token Push

**Date**: February 18, 2026
**Spec**: 054a - Figma Token Push
**Status**: Design Phase
**Dependencies**: Spec 053 (DTCG Token Format Generator), Spec 054 Design Outline (shared architectural context)

---

## Overview

This spec implements the token push workflow that converts DesignerPunk tokens to Figma Variables and Styles. The implementation extends the existing transformer pipeline (ITokenTransformer) and uses Console MCP's batch APIs and Plugin API for efficient sync.

**Key Components:**
- **FigmaTransformer** — Converts DTCG tokens to Figma format
- **TokenSyncWorkflow** — Pushes tokens to Figma via Console MCP
- **CLI Command** — `npm run figma:push` with flags for force override and resume

**Architecture Decision:** Styles first (for composite tokens), variables as fallback. This provides optimal designer experience while maintaining reconstruction capability for extraction (Spec 054b).

---

## Architecture

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Spec 053 Output                             │
│                  DesignTokens.dtcg.json                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (consumed by)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              FigmaTransformer (this spec)                       │
│              implements ITokenTransformer                       │
│                                                                 │
│  - transformVariables()  → Figma variable definitions          │
│  - transformStyles()     → Figma style definitions             │
│  - transform()           → Complete Figma format               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DesignTokens.figma.json                        │
│                  (intermediate artifact)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ (consumed by)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              TokenSyncWorkflow (this spec)                      │
│                                                                 │
│  - syncVariables()  → Batch create/update via Console MCP      │
│  - syncStyles()     → Individual create/update via Plugin API  │
│  - detectDrift()    → Compare current vs expected state        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Figma (Design Tool)                         │
│                                                                 │
│  Variables: Primitives + Semantics collections                 │
│  Styles: Effect styles (shadows) + Text styles (typography)    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Components and Interfaces

### FigmaTransformer

**Purpose:** Convert DTCG tokens to Figma Variables and Styles format.

**Interface:**
```typescript
export class FigmaTransformer implements ITokenTransformer {
  readonly config: TransformerConfig = {
    id: 'figma',
    name: 'Figma Variables and Styles',
    outputExtension: '.figma.json',
    includeExtensions: false
  };
  
  transform(dtcgTokens: DTCGTokenFile): TransformResult;
  canTransform(dtcgTokens: DTCGTokenFile): boolean;
}
```

**Key Methods:**

```typescript
private transformVariables(dtcg: DTCGTokenFile): FigmaVariableCollection[];
private transformStyles(dtcg: DTCGTokenFile): FigmaStyleDefinition[];
private generatePrimitivesCollection(dtcg: DTCGTokenFile): FigmaVariableCollection;
private generateSemanticsCollection(dtcg: DTCGTokenFile): FigmaVariableCollection;
private generateEffectStyles(dtcg: DTCGTokenFile): FigmaEffectStyle[];
private generateTextStyles(dtcg: DTCGTokenFile): FigmaTextStyle[];
```

**Naming Conventions:**

| Token Type | Figma Format | Example |
|------------|--------------|---------|
| Primitive variable | `{family}/{name}` | `space/100`, `color/purple/300` |
| Semantic variable | `{family}/{name}` | `color/primary`, `space/inset/spacious` |
| Effect style | `{family}.{name}` | `shadow.elevation200` |
| Text style | `{family}.{name}` | `typography.heading200` |

**Rationale:** Variables use `/` for Figma's visual grouping. Styles use `.` because they're flat in the style picker.

---

### TokenSyncWorkflow

**Purpose:** Push tokens to Figma via Console MCP, handling drift detection and partial failures.

**Interface:**
```typescript
export class TokenSyncWorkflow {
  constructor(
    private consoleMcp: ConsoleMCPClient,
    private figmaFileKey: string
  );
  
  async sync(
    figmaTokens: FigmaTokenFile, 
    options?: SyncOptions
  ): Promise<SyncResult>;
  
  async initialSetup(figmaTokens: FigmaTokenFile): Promise<SyncResult>;
}

interface SyncOptions {
  forceOverride?: boolean;  // Override drift detection
  resume?: number;          // Resume from batch N
}

interface SyncResult {
  success: boolean;
  created: number;
  updated: number;
  deleted: number;
  errors: SyncError[];
  driftDetected?: DriftReport;
}
```

**Key Methods:**

```typescript
private async syncVariables(
  variables: FigmaVariable[], 
  options?: SyncOptions
): Promise<void>;

private async syncStyles(
  styles: FigmaStyleDefinition[]
): Promise<void>;

private async batchCreateVariables(
  variables: FigmaVariable[], 
  startBatch: number
): Promise<void>;

private async batchUpdateVariables(
  variables: FigmaVariable[], 
  startBatch: number
): Promise<void>;

private async createStyle(
  style: FigmaStyleDefinition
): Promise<void>;

private async updateStyle(
  style: FigmaStyleDefinition
): Promise<void>;

private detectDrift(
  current: FigmaVariable[], 
  expected: FigmaTokenFile
): DriftReport;
```

---

### Console MCP Integration

**Variables API (Batch Operations):**
```typescript
// Create up to 100 variables per call
await consoleMcp.batchCreateVariables(figmaFileKey, variables);

// Update up to 100 variables per call
await consoleMcp.batchUpdateVariables(figmaFileKey, variables);

// Get current variable state
const currentVariables = await consoleMcp.getVariables(figmaFileKey);
```

**Plugin API (Individual Operations):**
```typescript
// Create effect style
await consoleMcp.execute(figmaFileKey, `
  const style = figma.createEffectStyle();
  style.name = "${styleName}";
  style.effects = [{
    type: "DROP_SHADOW",
    offset: { x: ${x}, y: ${y} },
    radius: ${blur},
    spread: ${spread},
    color: { r: ${r}, g: ${g}, b: ${b}, a: ${a} }
  }];
`);

// Create text style
await consoleMcp.execute(figmaFileKey, `
  const style = figma.createTextStyle();
  style.name = "${styleName}";
  style.fontName = { family: "${fontFamily}", style: "Regular" };
  style.fontSize = ${fontSize};
  style.fontWeight = ${fontWeight};
  style.lineHeight = { value: ${lineHeight}, unit: "PIXELS" };
  style.letterSpacing = { value: ${letterSpacing}, unit: "PIXELS" };
`);
```

---

## Data Models

### FigmaTokenFile

```typescript
interface FigmaTokenFile {
  collections: FigmaVariableCollection[];
  styles: FigmaStyleDefinition[];
}

interface FigmaVariableCollection {
  name: string;
  modes: string[];  // ["light", "dark"]
  variables: FigmaVariable[];
}

interface FigmaVariable {
  name: string;
  type: 'FLOAT' | 'COLOR' | 'STRING' | 'BOOLEAN';
  valuesByMode: Record<string, any>;
  description?: string;
}

interface FigmaStyleDefinition {
  type: 'EFFECT' | 'TEXT';
  name: string;
  properties: EffectStyleProperties | TextStyleProperties;
  description?: string;
}

interface EffectStyleProperties {
  effects: Array<{
    type: 'DROP_SHADOW' | 'INNER_SHADOW';
    offset: { x: number; y: number };
    radius: number;
    spread?: number;
    color: { r: number; g: number; b: number; a: number };
  }>;
}

interface TextStyleProperties {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
}
```

---

## Error Handling

### Drift Detection

**Trigger:** Current Figma variable values differ from last-known pushed state.

**Behavior:**
1. Compare current Figma state against expected state
2. If drift detected, block sync and report drifted variables
3. Provide force override option (`--force` flag)

**Example Error Report:**
```
Drift detected: 3 variables have been edited in Figma since last push

Drifted variables:
- space/300: Expected 24, found 25 (edited in Figma)
- color/primary: Expected #B026FF, found #A020E0 (edited in Figma)
- fontSize/200: Expected 16, found 18 (edited in Figma)

Resolution options:
1. Revert changes in Figma, then re-run: npm run figma:push
2. Force override (Figma changes will be lost): npm run figma:push --force
3. If these values should be tokens, create them through the spec process first
```

---

### Partial Failure Handling

**Strategy:** Incremental sync with clear recovery.

**Behavior:**
1. Sync proceeds in batches (100 variables per batch)
2. If batch N fails, stop immediately
3. Batches 1 through N-1 remain applied
4. Report progress and provide recovery command

**Example Error Report:**
```
Sync completed with errors:

✅ Created: 200 variables (batches 1-2)
❌ Failed: Batch 3 of 5
   - Error: Rate limit exceeded (429)
   - Recommendation: Wait 60 seconds, then run:
     npm run figma:push --resume 3

⏸️  Remaining: 200 variables (batches 4-5)

To resume sync after resolving the error, use the --resume flag with the failed batch number.
```

---

### Desktop Bridge Errors

**Pre-flight Check:**
```typescript
async function checkDesktopBridge(): Promise<PreflightResult> {
  try {
    // Check WebSocket connection on port 9223
    const connected = await checkWebSocket(9223);
    if (!connected) {
      return {
        ready: false,
        error: 'Desktop Bridge not running. Start Figma Desktop and run Desktop Bridge plugin.'
      };
    }
    return { ready: true };
  } catch (error) {
    return {
      ready: false,
      error: `Desktop Bridge connection failed: ${error.message}`
    };
  }
}
```

**Error Message:**
```
❌ Desktop Bridge not available

Desktop Bridge is required for style creation (shadow and typography tokens).

Setup:
1. Install Desktop Bridge plugin in Figma Desktop
2. Run the plugin (Plugins → Development → Desktop Bridge)
3. Verify WebSocket connection on port 9223
4. Re-run: npm run figma:push

Troubleshooting: See .kiro/steering/DTCG-Integration-Guide.md#desktop-bridge-setup
```

---

## Testing Strategy

### Unit Tests

**FigmaTransformer:**
- Transform primitive tokens → Figma variables
- Transform semantic tokens → Figma variables with aliases
- Transform shadow tokens → Figma effect styles
- Transform typography tokens → Figma text styles
- Handle mode mapping (identical values for light/dark)
- Generate correct naming conventions (variables vs styles)

**TokenSyncWorkflow:**
- Detect drift (variables edited in Figma)
- Handle partial failures (stop on first batch error)
- Resume from failed batch
- Batch variables correctly (100 per batch)
- Generate correct Plugin API code for styles

### Integration Tests

**End-to-End Sync:**
- Push tokens to test Figma file
- Verify variables created correctly
- Verify styles created correctly
- Verify drift detection works
- Verify force override works
- Verify resume from failure works

**Console MCP Integration:**
- Batch variable creation
- Batch variable updates
- Plugin API style creation
- Plugin API style updates
- Error handling for rate limits
- Error handling for Desktop Bridge unavailable

---

## Design Decisions

### Decision 1: Styles First, Variables as Fallback

**Options Considered:**
- A) Decomposed variables only (simpler implementation)
- B) Styles first, variables as fallback (better designer experience)

**Decision:** Option B

**Rationale:**
- Designers apply styles by name (one-click, discoverable)
- Extraction can match style names directly to composite tokens
- Cleaner than reconstructing from decomposed variables
- Aligns with how designers already work in Figma

**Trade-offs:**
- More complex implementation (Plugin API + Desktop Bridge)
- Slower sync (individual style calls vs batch variable operations)
- Additional failure modes (Plugin API can fail independently)

**Counter-argument:** Decomposed variables are simpler and remove Desktop Bridge dependency. However, designer experience is prioritized over implementation simplicity.

---

### Decision 2: Incremental Sync with Resume

**Options Considered:**
- A) All-or-nothing (rollback on any failure)
- B) Incremental (batches that succeed stay applied)

**Decision:** Option B

**Rationale:**
- Figma Variables API doesn't support transactions (no rollback capability)
- Rolling back 200 variables manually is worse than leaving them applied
- Resume flag minimizes wasted work
- Drift detection on next sync catches inconsistencies

**Trade-offs:**
- Partial state is possible (200 variables pushed, 300 remaining)
- Requires manual intervention to resume

**Counter-argument:** Partial state creates inconsistency. However, all-or-nothing would require manual rollback, which is worse.

---

### Decision 3: Identical Mode Values (Phase 1)

**Options Considered:**
- A) Single mode only
- B) Identical values across light/dark modes
- C) Theme-aware mode mapping

**Decision:** Option B

**Rationale:**
- DesignerPunk tokens are platform-specific (web/iOS/Android), not theme-specific
- Platform separation happens at build time
- Figma modes provide structure for future theme support without requiring changes now
- Designers see consistent token values regardless of mode

**Trade-offs:**
- "Fake" modes that don't actually vary (could confuse designers)

**Counter-argument:** Single mode is simpler. However, adding modes later would require migration. Better to have the structure in place.

---

### Decision 4: Naming Conventions (Variables vs Styles)

**Options Considered:**
- A) Same convention for both (e.g., all use `/`)
- B) Different conventions (variables use `/`, styles use `.`)

**Decision:** Option B

**Rationale:**
- Variables use `/` because Figma groups them visually in the UI (creates hierarchy)
- Styles use `.` because they're flat in Figma's style picker (no hierarchy, just names)
- Different conventions signal different usage patterns

**Trade-offs:**
- Inconsistency between variables and styles

**Counter-argument:** Same convention is simpler. However, Figma's UI treats variables and styles differently, so different conventions are appropriate.

---

## Performance Considerations

### Batch Size Tuning

**Current:** 100 variables per batch (Console MCP's documented limit)

**Estimated Sync Times:**

| Token Count | Variable Batches | Style Calls | Estimated Time |
|-------------|------------------|-------------|----------------|
| 100 tokens | 1 batch | ~10 styles | 5-10 seconds |
| 500 tokens | 5 batches | ~20 styles | 20-40 seconds |
| 1000 tokens | 10 batches | ~30 styles | 40-80 seconds |

**Optimization Strategy:**
1. Benchmark after implementation
2. Tune batch size if rate limits hit
3. Add progress indicators for long-running syncs
4. Consider parallel batches if Figma API supports concurrent requests

---

## CLI Command Implementation

### Command Structure

```bash
# Normal sync (blocks on drift)
npm run figma:push

# Force override (after reviewing drift report)
npm run figma:push -- --force

# Resume from failed batch
npm run figma:push -- --resume 3

# Dry run (transform only, no sync)
npm run figma:push -- --dry-run
```

### Implementation

```typescript
// src/cli/figma-push.ts

import { FigmaTransformer } from '../generators/transformers/FigmaTransformer';
import { TokenSyncWorkflow } from '../figma/TokenSyncWorkflow';
import { ConsoleMCPClient } from '../figma/ConsoleMCPClient';

async function main() {
  const args = parseArgs(process.argv);
  
  // Load DTCG tokens
  const dtcgTokens = loadDTCGTokens('dist/DesignTokens.dtcg.json');
  
  // Transform to Figma format
  const transformer = new FigmaTransformer();
  const result = transformer.transform(dtcgTokens);
  
  // Write intermediate artifact
  fs.writeFileSync('dist/DesignTokens.figma.json', result.content);
  
  if (args.dryRun) {
    console.log('Dry run complete. Review dist/DesignTokens.figma.json');
    return;
  }
  
  // Pre-flight checks
  const preflight = await checkDesktopBridge();
  if (!preflight.ready) {
    console.error(preflight.error);
    process.exit(1);
  }
  
  // Sync to Figma
  const mcp = new ConsoleMCPClient();
  const workflow = new TokenSyncWorkflow(mcp, process.env.FIGMA_FILE_KEY);
  
  const figmaTokens = JSON.parse(result.content);
  const syncResult = await workflow.sync(figmaTokens, {
    forceOverride: args.force,
    resume: args.resume
  });
  
  // Report results
  if (syncResult.success) {
    console.log(`✅ Sync complete: ${syncResult.created} created, ${syncResult.updated} updated`);
    process.exit(0);
  } else {
    console.error(`❌ Sync failed: ${syncResult.errors.length} errors`);
    syncResult.errors.forEach(err => console.error(`  - ${err.message}`));
    process.exit(1);
  }
}
```

---

## Configuration

### Environment Variables

```bash
# Required
FIGMA_ACCESS_TOKEN=<personal-access-token>
FIGMA_FILE_KEY=<figma-file-key>

# Optional
FIGMA_BATCH_SIZE=100  # Variables per batch (default: 100)
```

### Figma File Structure

```
DesignerPunk Token Library (Figma File)
├── Primitives Collection
│   ├── Modes: light, dark
│   └── Variables: space/*, color/*, fontSize/*, etc.
├── Semantics Collection
│   ├── Modes: light, dark
│   └── Variables: color/primary, space/inset/*, etc.
└── Styles
    ├── Effect Styles: shadow.elevation*
    └── Text Styles: typography.heading*, typography.body*
```

---

## Related Documentation

- [Design Outline](../../054-figma-console-mcp-integration/design-outline.md) — Shared architectural context
- [DTCG Integration Guide](../../../.kiro/steering/DTCG-Integration-Guide.md) — User-facing integration guide
- [Transformer Development Guide](../../../.kiro/steering/Transformer-Development-Guide.md) — ITokenTransformer interface
- [Spec 053 Design](../../053-dtcg-token-format-generator/design.md) — DTCG format generator

---

**Organization**: spec-guide
**Scope**: 054a-figma-token-push
